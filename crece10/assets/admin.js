/*!
 * CRECE 10 · Matemáticas — panel del administrador
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 *
 * Sin dependencias. Router por hash, igual que la app del estudiante.
 *   #/entrar                     correo y contraseña del admin
 *   #/grupos                     grupos y crear grupo
 *   #/grupo/<id>/resumen         resumen, alertas y evolución semanal
 *   #/grupo/<id>/estudiantes     tabla por estudiante y acciones (PIN, desactivar, borrar)
 *   #/grupo/<id>/preguntas       preguntas más falladas y la opción incorrecta más elegida
 *   #/grupo/<id>/cuentas         crear cuentas en lote e imprimir tarjetas
 *
 * Seguridad: lee con la sesión del admin (RLS lo permite solo al rol admin).
 * Las operaciones con la llave de servicio pasan por la función crece-admin.
 * La sesión vive en sessionStorage: se borra al cerrar el navegador.
 */
(function () {
  "use strict";

  const CFG = window.CRECE_NUBE_CONFIG || {};
  const MODS = window.CRECE_MODULOS || [];
  const MOD = Object.fromEntries(MODS.map(m => [m.id, m]));
  const ITEM = Object.fromEntries((window.CRECE_BANCO || []).map(i => [i.id, i]));
  const GEN = window.CRECE_GENERADORES || null;
  const K = "crece10:admin";
  const URL_ESTUDIANTE = "digitalmathematics.org/crece10";

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const DIA = 86400000;
  const fechaLocal = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const hoy = () => fechaLocal(new Date());
  const textoPlano = h => { const d = document.createElement("div"); d.innerHTML = h || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); };
  // El ∥ se ve diminuto con la letra del sistema (mismo estilo .par que la app).
  const paralelas = html => html.replace(/∥/g, '<span class="par">∥</span>');
  function anunciar(t) { const a = $("#anuncios"); if (a) { a.textContent = ""; setTimeout(() => { a.textContent = t; }, 40); } }

  /* ───────────── Sesión del admin ───────────── */
  let ses = null;
  try { ses = JSON.parse(sessionStorage.getItem(K) || "null"); } catch (e) { ses = null; }
  const guardarSes = () => { try { sessionStorage.setItem(K, JSON.stringify(ses)); } catch (e) { /* nada */ } };

  async function llamar(ruta, op) {
    const r = await fetch(CFG.url + ruta, Object.assign({}, op, {
      headers: Object.assign({ apikey: CFG.clave, "Content-Type": "application/json" }, (op || {}).headers)
    }));
    const txt = await r.text();
    let cuerpo = null;
    try { cuerpo = txt ? JSON.parse(txt) : null; } catch (e) { cuerpo = txt; }
    return { ok: r.ok, status: r.status, cuerpo, headers: r.headers };
  }
  async function token() {
    if (!ses) throw new Error("sesion");
    if (ses.exp - Date.now() > 60000) return ses.access;
    const r = await llamar("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: ses.refresh }) });
    if (!r.ok) { cerrarSesion(); throw new Error("sesion"); }
    Object.assign(ses, { access: r.cuerpo.access_token, refresh: r.cuerpo.refresh_token, exp: Date.now() + r.cuerpo.expires_in * 1000 });
    guardarSes();
    return ses.access;
  }
  async function api(ruta, op) {
    const t = await token();
    const r = await llamar(ruta, Object.assign({}, op, { headers: Object.assign({ Authorization: "Bearer " + t }, (op || {}).headers) }));
    if (r.status === 401) { cerrarSesion(); throw new Error("sesion"); }
    return r;
  }
  // Lee todas las filas, de 1,000 en 1,000 (límite de la API).
  async function todo(ruta) {
    const out = [];
    for (let desde = 0; ; desde += 1000) {
      const r = await api(ruta, { headers: { Range: `${desde}-${desde + 999}`, "Range-Unit": "items" } });
      if (!r.ok) throw new Error("lectura");
      out.push(...r.cuerpo);
      if (r.cuerpo.length < 1000) break;
    }
    return out;
  }
  async function fn(cuerpo) {
    const t = await token();
    const r = await llamar("/functions/v1/crece-admin", { method: "POST", headers: { Authorization: "Bearer " + t }, body: JSON.stringify(cuerpo) });
    return Object.assign({ status: r.status }, r.cuerpo || {});
  }
  function cerrarSesion() {
    ses = null;
    try { sessionStorage.removeItem(K); } catch (e) { /* nada */ }
    CACHE.clear();
  }

  async function entrar(correo, clave) {
    const r = await llamar("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: correo, password: clave }) });
    if (r.status === 429) return "Demasiados intentos. Espera un minuto.";
    if (!r.ok) return "El correo o la contraseña no coinciden.";
    ses = { access: r.cuerpo.access_token, refresh: r.cuerpo.refresh_token, exp: Date.now() + r.cuerpo.expires_in * 1000, id: r.cuerpo.user.id, correo };
    const p = await api(`/rest/v1/crece_perfiles?select=rol,activo,nombre&id=eq.${ses.id}`);
    const yo = p.ok && p.cuerpo[0];
    if (!yo || yo.rol !== "admin" || !yo.activo) { cerrarSesion(); return "Esta cuenta no es de administrador de CRECE 10."; }
    ses.nombre = yo.nombre;
    guardarSes();
    return null;
  }

  /* ───────────── Datos ───────────── */
  const CACHE = new Map();
  async function datosGrupo(id, forzar) {
    if (!forzar && CACHE.has(id)) return CACHE.get(id);
    const [g] = (await api(`/rest/v1/crece_grupos?select=id,nombre,curso&id=eq.${id}`)).cuerpo || [];
    if (!g) return null;
    const est = await todo(`/rest/v1/crece_perfiles?select=id,codigo,nombre,activo,creado&rol=eq.estudiante&grupo_id=eq.${id}&order=codigo`);
    let intentos = [], examenes = [];
    if (est.length) {
      const ids = est.map(e => e.id).join(",");
      intentos = await todo(`/rest/v1/crece_intentos?select=estudiante_id,item_id,modulo,ok,pista,opcion,modo,segundos,fecha_local,creado&estudiante_id=in.(${ids})&order=creado`);
      examenes = await todo(`/rest/v1/crece_examenes?select=estudiante_id,correctas,total,minutos,fecha_local,creado&estudiante_id=in.(${ids})&order=creado`);
    }
    const d = { grupo: g, est, intentos, examenes, cargado: new Date() };
    CACHE.set(id, d);
    return d;
  }

  /* ───────────── Cálculos ───────────── */
  const valor = i => (i.ok ? (i.pista ? 0.5 : 1) : 0);
  const NIVELES = [
    { min: 85, nombre: "Sobresaliente" }, { min: 65, nombre: "Proficiente" },
    { min: 40, nombre: "Aprendiz" }, { min: 0, nombre: "Principiante" }
  ];
  const nivel = p => NIVELES.find(n => p >= n.min).nombre;
  const claseDom = p => (p >= 65 ? "alto" : p >= 40 ? "medio" : "bajo");
  const diasDesde = iso => Math.floor((Date.now() - new Date(iso).getTime()) / DIA);
  const mediana = xs => { if (!xs.length) return null; const s = xs.slice().sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

  function porEstudiante(d) {
    const hace7 = fechaLocal(new Date(Date.now() - 6 * DIA));
    return d.est.map(e => {
      const xs = d.intentos.filter(i => i.estudiante_id === e.id);
      const exs = d.examenes.filter(x => x.estudiante_id === e.id);
      const dom = {};
      MODS.forEach(m => {
        const ys = xs.filter(i => i.modulo === m.id).slice(-40);
        dom[m.id] = { n: ys.length, pct: ys.length ? pct(ys.reduce((s, i) => s + valor(i), 0), ys.length) : null };
      });
      const sem = xs.filter(i => i.fecha_local >= hace7);
      const ultimo = xs.length ? xs[xs.length - 1].creado : null;
      const segs = xs.filter(i => i.segundos != null && i.modo !== "examen").map(i => i.segundos);
      const mejorEx = exs.length ? Math.max(...exs.map(x => pct(x.correctas, x.total))) : null;
      const r = {
        e, n: xs.length, ultimo, dias: ultimo ? diasDesde(ultimo) : null,
        sem: sem.length, prec7: sem.length ? pct(sem.reduce((s, i) => s + valor(i), 0), sem.length) : null,
        dom, diagnostico: xs.some(i => i.modo === "diagnostico"),
        examenes: exs.length, mejorEx, ultimoEx: exs.length ? pct(exs[exs.length - 1].correctas, exs[exs.length - 1].total) : null,
        medianaSeg: segs.length >= 10 ? mediana(segs) : null
      };
      r.alertas = alertasDe(r);
      return r;
    });
  }

  function alertasDe(r) {
    const a = [];
    if (!r.e.activo) { a.push({ t: "Cuenta desactivada", k: "gris" }); return a; }
    if (!r.n) a.push({ t: "Nunca ha practicado", k: "coral" });
    else if (r.dias > 7) a.push({ t: `Sin practicar hace ${r.dias} días`, k: "coral" });
    MODS.forEach(m => {
      const x = r.dom[m.id];
      if (x.n >= 8 && x.pct < 40) a.push({ t: `${m.corto} por debajo de 40 %`, k: "oro" });
    });
    if (r.n && !r.diagnostico) a.push({ t: "Sin diagnóstico", k: "gris" });
    if (r.medianaSeg != null && r.medianaSeg < 8) a.push({ t: `Contesta muy rápido (${Math.round(r.medianaSeg)} s)`, k: "oro" });
    return a;
  }

  // Semana que empieza el lunes.
  function lunesDe(fecha) {
    const d = new Date(fecha + "T12:00:00");
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return fechaLocal(d);
  }
  function porSemana(intentos, semanas) {
    const out = [];
    const l0 = lunesDe(hoy());
    for (let k = semanas - 1; k >= 0; k--) {
      const d = new Date(l0 + "T12:00:00"); d.setDate(d.getDate() - 7 * k);
      out.push({ lunes: fechaLocal(d), n: 0, v: 0, est: new Set() });
    }
    const idx = Object.fromEntries(out.map((s, i) => [s.lunes, i]));
    intentos.forEach(i => {
      const k = idx[lunesDe(i.fecha_local)];
      if (k == null) return;
      out[k].n++; out[k].v += valor(i); out[k].est.add(i.estudiante_id);
    });
    return out.map(s => ({ lunes: s.lunes, n: s.n, est: s.est.size, pct: s.n ? pct(s.v, s.n) : null }));
  }

  // Clave para agrupar: un ítem fijo por su id; una variante por su plantilla.
  const claveItem = id => (/^GEN:/.test(id) ? id.split(":").slice(0, 2).join(":") : id);
  function infoItem(clave, ejemploId) {
    if (/^GEN:/.test(clave)) {
      const it = GEN && GEN.desdeId(ejemploId);
      return { gen: true, it, titulo: it ? textoPlano(it.enunciado) : clave, indicador: it ? it.indicador : "", modulo: it ? it.modulo : GEN && GEN.modulo(clave.split(":")[1]) };
    }
    const it = ITEM[clave];
    return { gen: false, it, titulo: it ? textoPlano(it.enunciado) : clave, indicador: it ? it.indicador : "", modulo: it ? it.modulo : "" };
  }
  function preguntasDificiles(intentos) {
    const g = new Map();
    intentos.forEach(i => {
      const k = claveItem(i.item_id);
      const x = g.get(k) || { clave: k, ejemplo: i.item_id, n: 0, fallos: 0, opc: {}, est: new Set(), seg: [] };
      x.n++; x.est.add(i.estudiante_id);
      if (!i.ok) { x.fallos++; if (i.opcion != null && !/^GEN:/.test(k)) x.opc[i.opcion] = (x.opc[i.opcion] || 0) + 1; }
      if (i.segundos != null) x.seg.push(i.segundos);
      g.set(k, x);
    });
    return [...g.values()].filter(x => x.n >= 3 && x.fallos > 0)
      .map(x => Object.assign(x, { tasa: pct(x.fallos, x.n) }))
      .sort((a, b) => b.tasa - a.tasa || b.n - a.n);
  }

  /* ───────────── Vistas ───────────── */
  const CHIP_SYNC = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3M4 4v4h4m12 12v-4h-4"/></svg>';

  function vEntrar(msg) {
    document.title = "Entrar · Panel CRECE 10";
    $("#adminAcciones").hidden = true;
    $("#vista").innerHTML = `
      <section class="section entrar">
        <div class="wrap entrar-grid">
          <div>
            <span class="eyebrow">Panel del administrador</span>
            <h1>Entra al panel</h1>
            <p class="lead">Crea grupos y cuentas, imprime las tarjetas de acceso y sigue el progreso de cada estudiante.</p>
            <p class="tiny" style="max-width:52ch">Los estudiantes no entran aquí: entran en <b>${URL_ESTUDIANTE}</b> con su código y PIN.</p>
          </div>
          <form class="card entrar-card" id="formAdmin" novalidate>
            <label for="adCorreo">Correo</label>
            <input id="adCorreo" type="email" autocomplete="username" required>
            <label for="adClave">Contraseña</label>
            <input id="adClave" type="password" autocomplete="current-password" required>
            <div id="adError" role="alert">${msg ? `<div class="callout coral" style="margin:0"><p style="margin:0">${esc(msg)}</p></div>` : ""}</div>
            <button class="btn btn-primary btn-lg" type="submit" id="adBoton">Entrar</button>
          </form>
        </div>
      </section>`;
    const c = $("#adCorreo"); if (c) c.focus();
  }

  async function vGrupos() {
    document.title = "Grupos · Panel CRECE 10";
    cargando("Cargando grupos…");
    const [grupos, est] = await Promise.all([
      todo("/rest/v1/crece_grupos?select=id,nombre,curso,creado&order=curso.desc,nombre"),
      todo("/rest/v1/crece_perfiles?select=grupo_id,activo&rol=eq.estudiante")
    ]);
    const cuenta = {};
    est.forEach(e => { cuenta[e.grupo_id] = (cuenta[e.grupo_id] || 0) + 1; });
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Hola${ses.nombre ? ", " + esc(ses.nombre) : ""}</span>
          <h1>Grupos</h1>
          <p class="lead">Cada grupo tiene sus cuentas. El código de cada estudiante empieza con el nombre del grupo: en el grupo <b>10B</b>, el número 7 es <b>10B-07</b>.</p>
          <div class="grid grid-3" style="margin-top:24px">
            ${grupos.map(g => `<a class="card grupo-card" href="#/grupo/${g.id}/resumen">
              <span class="tiny">${esc(g.curso)}</span>
              <h3>${esc(g.nombre)}</h3>
              <p class="tiny" style="margin:0">${cuenta[g.id] || 0} ${cuenta[g.id] === 1 ? "estudiante" : "estudiantes"}</p>
            </a>`).join("")}
            <form class="card grupo-nuevo" id="formGrupo" novalidate>
              <h3>Nuevo grupo</h3>
              <label for="grNombre">Nombre</label>
              <input id="grNombre" maxlength="12" placeholder="10B" autocomplete="off" required>
              <label for="grCurso">Curso escolar</label>
              <input id="grCurso" maxlength="9" value="${cursoActual()}" required>
              <div id="grError" role="alert"></div>
              <button class="btn btn-primary btn-sm" type="submit">Crear grupo</button>
            </form>
          </div>
        </div>
      </section>`;
  }
  function cursoActual() {
    const d = new Date(), y = d.getFullYear();
    return d.getMonth() >= 6 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
  }
  async function crearGrupo() {
    const nombre = ($("#grNombre").value || "").trim().toUpperCase();
    const curso = ($("#grCurso").value || "").trim();
    const err = m => { $("#grError").innerHTML = `<p class="tiny" style="color:var(--coral);margin:4px 0 0">${esc(m)}</p>`; };
    if (!/^[A-Z0-9]{1,6}$/.test(nombre.replace(/[\s-]/g, ""))) return err("Usa de 1 a 6 letras o números, por ejemplo 10B.");
    if (!/^\d{4}-\d{4}$/.test(curso)) return err("El curso se escribe como 2026-2027.");
    const r = await api("/rest/v1/crece_grupos", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ nombre: nombre.replace(/[\s-]/g, ""), curso }) });
    if (r.status === 409) return err("Ya existe un grupo con ese nombre en ese curso.");
    if (!r.ok) return err("No se pudo crear el grupo.");
    anunciar("Grupo creado.");
    location.hash = `#/grupo/${r.cuerpo[0].id}/cuentas`;
  }

  function cabeceraGrupo(d, tab) {
    const t = (id, nombre) => `<a href="#/grupo/${d.grupo.id}/${id}" ${tab === id ? 'aria-current="page"' : ""}>${nombre}</a>`;
    return `<div class="admin-head">
      <div>
        <a class="tiny" href="#/grupos">← Grupos</a>
        <h1 style="margin:6px 0 2px">Grupo ${esc(d.grupo.nombre)}</h1>
        <p class="tiny" style="margin:0">${esc(d.grupo.curso)} · ${d.est.length} ${d.est.length === 1 ? "estudiante" : "estudiantes"} · datos de las ${d.cargado.toLocaleTimeString("es-PR", { hour: "numeric", minute: "2-digit" })}</p>
      </div>
      <button class="btn btn-secondary btn-sm" data-action="actualizar">${CHIP_SYNC} Actualizar</button>
    </div>
    <nav class="admin-tabs" aria-label="Secciones del grupo">
      ${t("resumen", "Resumen")}${t("estudiantes", "Estudiantes")}${t("preguntas", "Preguntas difíciles")}${t("cuentas", "Crear cuentas")}
    </nav>`;
  }

  /* ── Resumen ── */
  function vResumen(d) {
    const filas = porEstudiante(d);
    const activos = filas.filter(r => r.e.activo);
    const hace7 = fechaLocal(new Date(Date.now() - 6 * DIA));
    const hace30 = fechaLocal(new Date(Date.now() - 29 * DIA));
    const sem = d.intentos.filter(i => i.fecha_local >= hace7);
    const mes = d.intentos.filter(i => i.fecha_local >= hace30);
    const conAlerta = activos.filter(r => r.alertas.some(a => a.k !== "gris")).sort((a, b) => b.alertas.length - a.alertas.length);
    const semanas = porSemana(d.intentos, 10);
    const diag = activos.filter(r => r.diagnostico && r.ultimoEx != null);

    return `${cabeceraGrupo(d, "resumen")}
      <div class="stat-strip" style="margin-top:22px">
        <div class="stat"><b>${activos.filter(r => r.sem).length} de ${activos.length}</b><span>Practicaron esta semana</span></div>
        <div class="stat"><b>${sem.length}</b><span>Respuestas en 7 días</span></div>
        <div class="stat"><b>${mes.length ? pct(mes.reduce((s, i) => s + valor(i), 0), mes.length) + "%" : "—"}</b><span>Precisión del grupo (30 días)</span></div>
        <div class="stat"><b>${d.examenes.length}</b><span>Simulacros entregados</span></div>
      </div>

      <div class="grid grid-2" style="margin-top:22px;align-items:start">
        <article class="card">
          <h3>Dominio del grupo por ruta</h3>
          <p class="tiny">Todas las respuestas de los últimos 30 días. Acierto = 1, con pista = 0.5.</p>
          ${MODS.map(m => {
            const xs = mes.filter(i => i.modulo === m.id);
            const p = xs.length ? pct(xs.reduce((s, i) => s + valor(i), 0), xs.length) : null;
            return `<div class="mastery-row">
              <span class="name">${esc(m.corto)}</span>
              <div class="bar" style="--c:var(--verde)"><i style="width:${p || 0}%"></i></div>
              <span class="pct">${p == null ? "—" : p + "%"}</span>
            </div>`;
          }).join("")}
          <p class="tiny" style="margin:10px 0 0">El número junto a cada barra es la precisión; «—» significa que aún no hay respuestas en esa ruta.</p>
        </article>

        <article class="card">
          <h3>Necesitan atención</h3>
          ${conAlerta.length ? `<ul class="alertas">${conAlerta.slice(0, 10).map(r => `<li>
              <b>${esc(r.e.codigo)}</b> <span>${esc(r.e.nombre)}</span>
              <div>${r.alertas.filter(a => a.k !== "gris").map(a => `<span class="chip ${a.k}">${esc(a.t)}</span>`).join(" ")}</div>
            </li>`).join("")}</ul>
            ${conAlerta.length > 10 ? `<a class="tiny" href="#/grupo/${d.grupo.id}/estudiantes">Ver los ${conAlerta.length} en la tabla</a>` : ""}`
          : `<div class="empty"><p style="margin:0">Nadie necesita atención ahora mismo.</p></div>`}
        </article>
      </div>

      <article class="card" style="margin-top:18px">
        <h3>Precisión del grupo por semana</h3>
        <p class="tiny">Últimas 10 semanas, de lunes a domingo. Pasa el cursor o el dedo por un punto para ver el detalle.</p>
        ${graficaSemanas(semanas)}
        <details style="margin-top:10px"><summary class="tiny">Ver como tabla</summary>
          <table class="history"><thead><tr><th>Semana del</th><th>Precisión</th><th>Respuestas</th><th>Estudiantes</th></tr></thead>
          <tbody>${semanas.map(s => `<tr><td>${fechaCorta(s.lunes)}</td><td>${s.pct == null ? "—" : s.pct + "%"}</td><td>${s.n}</td><td>${s.est}</td></tr>`).join("")}</tbody></table>
        </details>
      </article>

      <article class="card" style="margin-top:18px">
        <h3>Diagnóstico frente al último simulacro</h3>
        ${diag.length ? `<p class="tiny">Estudiantes que hicieron las dos cosas. El diagnóstico es la línea base del proyecto.</p>
          <div class="tabla-scroll"><table class="history"><thead><tr><th>Código</th><th>Nombre</th><th>Diagnóstico</th><th>Último simulacro</th><th>Nivel aproximado</th></tr></thead>
          <tbody>${diag.map(r => {
            const xs = d.intentos.filter(i => i.estudiante_id === r.e.id && i.modo === "diagnostico");
            const p = pct(xs.reduce((s, i) => s + valor(i), 0), xs.length);
            return `<tr><td>${esc(r.e.codigo)}</td><td>${esc(r.e.nombre)}</td><td>${p}%</td><td>${r.ultimoEx}%</td><td>${nivel(r.ultimoEx)}</td></tr>`;
          }).join("")}</tbody></table></div>
          <p class="tiny" style="margin:10px 0 0">El nivel es una referencia propia (40, 65 y 85 %): el DEPR no publica los puntos de corte.</p>`
        : `<p class="tiny" style="margin:0">Todavía nadie tiene diagnóstico y simulacro a la vez.</p>`}
      </article>`;
  }

  function fechaCorta(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} ${["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][m - 1]}`;
  }

  // Una sola serie: un solo tono, título en vez de leyenda, tooltip y tabla equivalente.
  function graficaSemanas(ss) {
    const W = 720, H = 220, mi = 40, md = 14, ma = 14, mb = 30;
    const ancho = W - mi - md, alto = H - ma - mb;
    const x = i => mi + (ss.length === 1 ? ancho / 2 : (i * ancho) / (ss.length - 1));
    const y = p => ma + alto - (p / 100) * alto;
    const pts = ss.map((s, i) => ({ s, i, cx: x(i), cy: s.pct == null ? null : y(s.pct) }));
    // La línea se corta en las semanas sin datos.
    let d = "", abierto = false;
    pts.forEach(p => { if (p.cy == null) { abierto = false; return; } d += `${abierto ? "L" : "M"}${p.cx.toFixed(1)},${p.cy.toFixed(1)}`; abierto = true; });
    const ultimo = [...pts].reverse().find(p => p.cy != null);
    return `<div class="grafica" id="grafSemanas">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Precisión semanal del grupo en las últimas ${ss.length} semanas">
        ${[0, 25, 50, 75, 100].map(v => `<line class="g-rejilla" x1="${mi}" x2="${W - md}" y1="${y(v)}" y2="${y(v)}"/><text class="g-eje" x="${mi - 8}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`).join("")}
        ${pts.map(p => `<text class="g-eje" x="${p.cx}" y="${H - 8}" text-anchor="middle">${fechaCorta(p.s.lunes)}</text>`).join("")}
        <path class="g-linea" d="${d}"/>
        ${pts.filter(p => p.cy != null).map(p => `<circle class="g-punto" cx="${p.cx}" cy="${p.cy}" r="4.5"/>`).join("")}
        ${ultimo ? `<text class="g-etiqueta" x="${ultimo.cx - 10}" y="${ultimo.s.pct > 85 ? ultimo.cy + 20 : ultimo.cy - 12}" text-anchor="end">${ultimo.s.pct}%</text>` : ""}
        ${pts.map(p => `<rect class="g-zona" x="${p.cx - ancho / ss.length / 2}" y="${ma}" width="${ancho / ss.length}" height="${alto}" tabindex="0"
            data-tip="${esc(`Semana del ${fechaCorta(p.s.lunes)}: ${p.s.pct == null ? "sin respuestas" : p.s.pct + "% de precisión"} · ${p.s.n} respuestas de ${p.s.est} ${p.s.est === 1 ? "estudiante" : "estudiantes"}`)}"
            data-x="${p.cx}"/>`).join("")}
        <line class="g-guia" id="gGuia" x1="0" x2="0" y1="${ma}" y2="${ma + alto}" visibility="hidden"/>
      </svg>
      <div class="g-tip" id="gTip" role="status" hidden></div>
    </div>`;
  }
  function activarGrafica() {
    const g = $("#grafSemanas"); if (!g) return;
    const tip = $("#gTip"), guia = $("#gGuia"), svg = g.querySelector("svg");
    const mostrar = z => {
      const cx = Number(z.dataset.x);
      guia.setAttribute("x1", cx); guia.setAttribute("x2", cx); guia.setAttribute("visibility", "visible");
      tip.textContent = z.dataset.tip; tip.hidden = false;
      const caja = svg.getBoundingClientRect(), esc2 = caja.width / 720;
      tip.style.left = Math.min(Math.max(cx * esc2 - 110, 0), caja.width - 220) + "px";
    };
    const ocultar = () => { tip.hidden = true; guia.setAttribute("visibility", "hidden"); };
    g.querySelectorAll(".g-zona").forEach(z => {
      z.addEventListener("mouseenter", () => mostrar(z));
      z.addEventListener("focus", () => mostrar(z));
      z.addEventListener("touchstart", () => mostrar(z), { passive: true });
    });
    g.addEventListener("mouseleave", ocultar);
    g.addEventListener("focusout", ocultar);
  }

  /* ── Estudiantes ── */
  let orden = { col: "codigo", dir: 1 };
  function vEstudiantes(d) {
    const filas = porEstudiante(d);
    const val = (r, c) => ({
      codigo: r.e.codigo, nombre: r.e.nombre.toLowerCase(), ultimo: r.ultimo || "", n: r.n,
      prec7: r.prec7 == null ? -1 : r.prec7, simulacro: r.mejorEx == null ? -1 : r.mejorEx, alertas: r.alertas.length
    }[c] ?? (r.dom[c] && r.dom[c].pct != null ? r.dom[c].pct : -1));
    filas.sort((a, b) => (val(a, orden.col) > val(b, orden.col) ? 1 : val(a, orden.col) < val(b, orden.col) ? -1 : 0) * orden.dir);
    const th = (c, t, extra) => `<th scope="col" ${extra || ""} aria-sort="${orden.col === c ? (orden.dir > 0 ? "ascending" : "descending") : "none"}"><button class="th-orden" data-action="ordenar" data-col="${c}">${t}${orden.col === c ? (orden.dir > 0 ? " ▲" : " ▼") : ""}</button></th>`;

    return `${cabeceraGrupo(d, "estudiantes")}
      ${d.est.length ? `
      <div class="admin-barra">
        <p class="tiny" style="margin:0">Dominio = últimos 40 intentos de cada ruta. <span class="dom alto">65 % o más</span> <span class="dom medio">40 a 64 %</span> <span class="dom bajo">menos de 40 %</span></p>
        <button class="btn btn-secondary btn-sm" data-action="csv-estudiantes">Descargar para Excel</button>
      </div>
      <div class="tabla-scroll">
        <table class="admin-tabla">
          <thead><tr>
            ${th("codigo", "Código")}${th("nombre", "Nombre")}${th("ultimo", "Último uso")}${th("n", "Respuestas")}${th("prec7", "7 días")}
            ${MODS.map(m => th(m.id, esc(m.id), `title="${esc(m.nombre)}"`)).join("")}
            ${th("simulacro", "Simulacro")}${th("alertas", "Alertas")}<th scope="col">Cuenta</th>
          </tr></thead>
          <tbody>${filas.map(r => `<tr class="${r.e.activo ? "" : "inactivo"}">
            <td class="mono">${esc(r.e.codigo)}</td>
            <td>${esc(r.e.nombre)}</td>
            <td class="tiny">${r.ultimo ? (r.dias === 0 ? "Hoy" : r.dias === 1 ? "Ayer" : `Hace ${r.dias} días`) : "Nunca"}</td>
            <td class="num">${r.n}</td>
            <td class="num">${r.prec7 == null ? "—" : r.prec7 + "%"}</td>
            ${MODS.map(m => { const x = r.dom[m.id]; return x.pct == null ? `<td class="num tiny">—</td>`
              : `<td class="num"><span class="dom ${claseDom(x.pct)}" title="${esc(m.nombre)}: ${x.pct}% en ${x.n} intentos">${x.pct}%</span></td>`; }).join("")}
            <td class="num">${r.mejorEx == null ? "—" : `${r.mejorEx}%<br><span class="tiny">${nivel(r.mejorEx)}</span>`}</td>
            <td class="alertas-celda">${r.alertas.map(a => `<span class="chip ${a.k}">${esc(a.t)}</span>`).join("<br>")}</td>
            <td class="acciones">
              <button class="btn btn-ghost btn-sm" data-action="pin" data-id="${r.e.id}">Nuevo PIN</button>
              <button class="btn btn-ghost btn-sm" data-action="activo" data-id="${r.e.id}" data-activo="${!r.e.activo}">${r.e.activo ? "Desactivar" : "Activar"}</button>
              <button class="btn btn-ghost btn-sm peligro" data-action="borrar" data-id="${r.e.id}">Borrar</button>
            </td>
          </tr>`).join("")}</tbody>
        </table>
      </div>` : `<div class="empty" style="margin-top:22px"><p style="margin:0 0 10px">Este grupo todavía no tiene cuentas.</p><a class="btn btn-primary btn-sm" href="#/grupo/${d.grupo.id}/cuentas">Crear cuentas</a></div>`}`;
  }

  /* ── Preguntas difíciles ── */
  function vPreguntas(d) {
    const ps = preguntasDificiles(d.intentos).slice(0, 15);
    return `${cabeceraGrupo(d, "preguntas")}
      <p class="lead" style="margin-top:18px">Las preguntas que más falla el grupo (con al menos 3 respuestas) y la opción incorrecta que más eligen. Esa opción dice qué idea está confundida: es lo que conviene explicar.</p>
      ${ps.length ? ps.map((x, k) => {
        const inf = infoItem(x.clave, x.ejemplo);
        const it = inf.it;
        const opcs = Object.entries(x.opc).sort((a, b) => b[1] - a[1]);
        const [opTop, nTop] = opcs[0] || [];
        const conOpc = opcs.reduce((s, [, n]) => s + n, 0);
        const m = MOD[inf.modulo];
        const rep = it && m && /^([if])(\d+)$/.exec(it.repaso || "");
        const idea = rep ? (rep[1] === "i" ? m.ideas : m.formulas)[Number(rep[2])] : null;
        return `<article class="card pregunta-card">
          <div class="pregunta-cab">
            <span class="pregunta-num">${k + 1}</span>
            <div style="flex:1;min-width:0">
              <div class="q-meta" style="margin-bottom:6px">
                ${inf.indicador ? `<span class="chip verde">${esc(inf.indicador)}</span>` : ""}
                ${m ? `<span class="chip">${esc(m.corto)}</span>` : ""}
                ${inf.gen ? `<span class="chip">Plantilla con números aleatorios</span>` : `<span class="chip">${esc(x.clave)}</span>`}
              </div>
              <p class="pregunta-texto">${paralelas(esc(inf.titulo.slice(0, 220)))}${inf.titulo.length > 220 ? "…" : ""}</p>
            </div>
            <div class="pregunta-tasa"><b>${x.tasa}%</b><span>falla</span><span class="tiny">${x.fallos} de ${x.n} · ${x.est.size} est.</span></div>
          </div>
          ${!inf.gen && it && it.tipo === "sm" && opTop != null ? `<div class="why">
              <b>La opción incorrecta más elegida: ${String.fromCharCode(65 + Number(opTop))}</b> (${esc(it.opciones[opTop])}), en ${nTop} de ${conOpc} fallos.
              ${it.distractores && it.distractores[opTop] ? `<p style="margin:6px 0 0">${esc(it.distractores[opTop])}</p>` : ""}
            </div>` : inf.gen ? `<p class="tiny" style="margin:8px 0 0">En las plantillas los números cambian en cada variante, así que no se agrupa la opción elegida.</p>` : ""}
          ${idea ? `<p class="tiny" style="margin:10px 0 0"><b>Idea para repasar:</b> ${esc(idea.t || idea.f)}. ${esc(idea.d)}</p>` : ""}
        </article>`;
      }).join("") : `<div class="empty" style="margin-top:18px"><p style="margin:0">Todavía no hay suficientes respuestas. Aparecen cuando una pregunta tiene al menos 3.</p></div>`}`;
  }

  /* ── Crear cuentas ── */
  let ultimasCreadas = null;
  function vCuentas(d) {
    return `${cabeceraGrupo(d, "cuentas")}
      <div class="grid grid-2" style="margin-top:22px;align-items:start">
        <form class="card" id="formLista" novalidate>
          <h3>Pega la lista del grupo</h3>
          <p class="tiny">Una línea por estudiante: <b>número de lista</b> y <b>nombre de pila</b>. Por ejemplo <span class="mono">7 María</span> o <span class="mono">7, María</span>. Puedes copiarla de Excel. No pongas apellidos.</p>
          <label for="lista" class="sr-only">Lista del grupo</label>
          <textarea id="lista" class="open" rows="10" placeholder="1 Ana&#10;2 Luis&#10;3 María José"></textarea>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn btn-secondary btn-sm" type="button" data-action="revisar-lista">Revisar</button>
          </div>
          <div id="vistaPrevia"></div>
        </form>
        <article class="card">
          <h3>Cómo funciona</h3>
          <ol class="tiny pasos-lista">
            <li>El código se arma con el grupo y el número: <b class="mono">${esc(prefijo(d.grupo.nombre))}-07</b>.</li>
            <li>Cada cuenta recibe un PIN de 6 números al azar.</li>
            <li><b>El PIN se ve una sola vez.</b> Imprime las tarjetas o descarga el archivo antes de salir de esta pantalla. Si alguien lo pierde, dale un PIN nuevo desde «Estudiantes».</li>
            <li>El estudiante entra en <b>${URL_ESTUDIANTE}</b>.</li>
          </ol>
        </article>
      </div>
      <div id="resultadoCuentas">${ultimasCreadas && ultimasCreadas.grupo === d.grupo.id ? tablaCreadas(ultimasCreadas.filas) : ""}</div>`;
  }
  const prefijo = n => String(n).toUpperCase().normalize("NFD").replace(/[^A-Z0-9]/g, "").slice(0, 6);
  function leerLista(txt) {
    const filas = [], malas = [];
    String(txt || "").split(/\r?\n/).forEach((l, k) => {
      const s = l.trim();
      if (!s) return;
      const m = s.match(/^(\d{1,3})[\s.,;:)\-\t]+(.+)$/);
      if (!m) { malas.push({ linea: k + 1, texto: s }); return; }
      filas.push({ numero: Number(m[1]), nombre: m[2].replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40) });
    });
    return { filas, malas };
  }
  function revisarLista(d) {
    const { filas, malas } = leerLista($("#lista").value);
    const vistos = new Set(d.est.map(e => e.codigo));
    const pre = prefijo(d.grupo.nombre);
    const rep = new Set();
    const html = filas.map(f => {
      const codigo = `${pre}-${String(f.numero).padStart(2, "0")}`;
      let aviso = "";
      if (vistos.has(codigo)) aviso = "Ya existe";
      else if (rep.has(codigo)) aviso = "Número repetido";
      else if (f.nombre.split(" ").length > 2) aviso = "¿Solo nombre de pila?";
      rep.add(codigo);
      f.codigo = codigo; f.aviso = aviso;
      return `<tr><td class="mono">${codigo}</td><td>${esc(f.nombre)}</td><td>${aviso ? `<span class="chip oro">${aviso}</span>` : ""}</td></tr>`;
    }).join("");
    const nuevas = filas.filter(f => f.aviso !== "Ya existe" && f.aviso !== "Número repetido");
    $("#vistaPrevia").innerHTML = `
      ${malas.length ? `<div class="callout coral" style="margin-top:14px"><b>No entendí ${malas.length} ${malas.length === 1 ? "línea" : "líneas"}</b><p>${malas.slice(0, 4).map(x => `Línea ${x.linea}: «${esc(x.texto.slice(0, 40))}»`).join("<br>")}</p></div>` : ""}
      ${filas.length ? `<div class="tabla-scroll" style="margin-top:14px"><table class="history"><thead><tr><th>Código</th><th>Nombre</th><th></th></tr></thead><tbody>${html}</tbody></table></div>
        <button class="btn btn-primary btn-sm" type="button" data-action="crear-cuentas" style="margin-top:12px" ${nuevas.length ? "" : "disabled"}>Crear ${nuevas.length} ${nuevas.length === 1 ? "cuenta" : "cuentas"}</button>` : ""}`;
    return nuevas;
  }
  async function crearCuentas(d) {
    const nuevas = revisarLista(d);
    if (!nuevas.length) return;
    const b = $('[data-action="crear-cuentas"]');
    if (b) { b.disabled = true; b.textContent = "Creando cuentas…"; }
    const r = await fn({ accion: "crear_estudiantes", grupo_id: d.grupo.id, lista: nuevas.map(f => ({ numero: f.numero, nombre: f.nombre })) });
    if (!r.ok) {
      $("#vistaPrevia").insertAdjacentHTML("beforeend", `<div class="callout coral" style="margin-top:12px"><p style="margin:0">No se pudieron crear las cuentas (${esc(r.error || r.status)}).</p></div>`);
      if (b) { b.disabled = false; b.textContent = "Intentar de nuevo"; }
      return;
    }
    ultimasCreadas = { grupo: d.grupo.id, filas: r.resultados };
    $("#lista").value = "";
    $("#vistaPrevia").innerHTML = "";
    CACHE.delete(d.grupo.id);
    const n = r.resultados.filter(x => x.ok).length;
    anunciar(`${n} cuentas creadas. Imprime las tarjetas ahora: los PIN no se vuelven a mostrar.`);
    $("#resultadoCuentas").innerHTML = tablaCreadas(r.resultados);
    $("#resultadoCuentas").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const ERR_CUENTA = { repetido: "Número repetido", ya_existe: "Ya existe", numero: "Número inválido", nombre: "Falta el nombre", cuenta: "No se pudo crear la cuenta", perfil: "No se pudo crear el perfil" };
  function tablaCreadas(filas) {
    const buenas = filas.filter(x => x.ok);
    return `<article class="card creadas" style="margin-top:18px">
      <h3>${buenas.length} ${buenas.length === 1 ? "cuenta creada" : "cuentas creadas"}</h3>
      <div class="callout oro" style="margin:8px 0 14px"><b>Los PIN se ven solo ahora.</b><p style="margin:4px 0 0">Imprime las tarjetas o descarga el archivo antes de salir de esta pantalla.</p></div>
      <div class="btn-row" style="margin-bottom:12px">
        <button class="btn btn-primary btn-sm" data-action="imprimir-creadas" ${buenas.length ? "" : "disabled"}>Imprimir tarjetas</button>
        <button class="btn btn-secondary btn-sm" data-action="csv-creadas" ${buenas.length ? "" : "disabled"}>Descargar códigos y PIN</button>
      </div>
      <div class="tabla-scroll"><table class="history"><thead><tr><th>Código</th><th>Nombre</th><th>PIN</th><th></th></tr></thead>
      <tbody>${filas.map(x => `<tr><td class="mono">${esc(x.codigo || "—")}</td><td>${esc(x.nombre)}</td><td class="mono">${x.ok ? esc(x.pin) : ""}</td><td>${x.ok ? '<span class="chip verde">Creada</span>' : `<span class="chip coral">${esc(ERR_CUENTA[x.error] || x.error)}</span>`}</td></tr>`).join("")}</tbody></table></div>
    </article>`;
  }

  /* ───────────── Tarjetas, CSV y respaldo ───────────── */
  function imprimirTarjetas(filas, grupo) {
    $("#impresion").innerHTML = `<div class="tarjetas">${filas.map(x => `<div class="tarjeta">
      <div class="tarjeta-marca">CRECE 10 · Matemáticas</div>
      <div class="tarjeta-nombre">${esc(x.nombre)}${grupo ? ` · Grupo ${esc(grupo)}` : ""}</div>
      <div class="tarjeta-campos"><div><span>Código</span><b>${esc(x.codigo)}</b></div><div><span>PIN</span><b>${esc(x.pin)}</b></div></div>
      <div class="tarjeta-pie">Entra en <b>${URL_ESTUDIANTE}</b>. Guarda esta tarjeta y no compartas tu PIN.</div>
    </div>`).join("")}</div>`;
    document.body.classList.add("imprimiendo");
    const fin = () => { document.body.classList.remove("imprimiendo"); $("#impresion").innerHTML = ""; window.removeEventListener("afterprint", fin); };
    window.addEventListener("afterprint", fin);
    window.print();
  }
  function descargar(nombre, contenido, tipo) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  // CSV con BOM y punto y coma: Excel en español lo abre bien.
  const csvCelda = v => { const s = String(v == null ? "" : v); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const csv = filas => "﻿" + filas.map(f => f.map(csvCelda).join(";")).join("\r\n");

  function csvEstudiantes(d) {
    const filas = porEstudiante(d);
    descargar(`crece10-grupo-${d.grupo.nombre}-${hoy()}.csv`, csv([
      ["Código", "Nombre", "Activo", "Último uso", "Respuestas", "Precisión 7 días", ...MODS.map(m => m.nombre), "Mejor simulacro", "Nivel aproximado", "Alertas"],
      ...filas.map(r => [r.e.codigo, r.e.nombre, r.e.activo ? "Sí" : "No", r.ultimo ? r.ultimo.slice(0, 10) : "", r.n,
        r.prec7 == null ? "" : r.prec7 + "%", ...MODS.map(m => r.dom[m.id].pct == null ? "" : r.dom[m.id].pct + "%"),
        r.mejorEx == null ? "" : r.mejorEx + "%", r.mejorEx == null ? "" : nivel(r.mejorEx), r.alertas.map(a => a.t).join(" · ")])
    ]), "text/csv;charset=utf-8");
  }
  async function respaldo() {
    anunciar("Preparando el respaldo…");
    const [grupos, perfiles, intentos, examenes, estado] = await Promise.all([
      todo("/rest/v1/crece_grupos?select=*"), todo("/rest/v1/crece_perfiles?select=*"),
      todo("/rest/v1/crece_intentos?select=*&order=id"), todo("/rest/v1/crece_examenes?select=*&order=id"),
      todo("/rest/v1/crece_estado?select=*")
    ]);
    descargar(`crece10-respaldo-${hoy()}.json`, JSON.stringify({ fecha: new Date().toISOString(), grupos, perfiles, intentos, examenes, estado }, null, 1), "application/json");
    anunciar("Respaldo descargado.");
  }

  /* ───────────── Acciones sobre una cuenta ───────────── */
  async function accionCuenta(tipo, id, extra) {
    const d = CACHE.get(grupoActual());
    const e = d && d.est.find(x => x.id === id);
    if (!e) return;
    if (tipo === "borrar" && !confirm(`¿Borrar la cuenta ${e.codigo} (${e.nombre})? Se borra también todo su progreso. No se puede deshacer.`)) return;
    if (tipo === "activo" && extra === "false" && !confirm(`¿Desactivar ${e.codigo} (${e.nombre})? No podrá entrar hasta que la actives.`)) return;
    if (tipo === "pin" && !confirm(`¿Dar un PIN nuevo a ${e.codigo} (${e.nombre})? El PIN actual deja de funcionar.`)) return;
    const r = tipo === "pin" ? await fn({ accion: "restablecer_pin", estudiante_id: id })
      : tipo === "activo" ? await fn({ accion: "cambiar_activo", estudiante_id: id, activo: extra === "true" })
      : await fn({ accion: "borrar_estudiante", estudiante_id: id });
    if (!r.ok) { alert("No se pudo completar la acción. Intenta de nuevo."); return; }
    if (tipo === "pin") {
      mostrarPin(e, r.pin, d.grupo.nombre);
      return;
    }
    anunciar(tipo === "borrar" ? `Cuenta ${e.codigo} borrada.` : `Cuenta ${e.codigo} ${extra === "true" ? "activada" : "desactivada"}.`);
    await datosGrupo(d.grupo.id, true);
    render();
  }
  function mostrarPin(e, pin, grupo) {
    const caja = document.createElement("div");
    caja.className = "modal-fondo";
    caja.innerHTML = `<div class="modal card" role="dialog" aria-modal="true" aria-labelledby="pinTitulo">
      <h3 id="pinTitulo">PIN nuevo de ${esc(e.codigo)}</h3>
      <p class="tiny">${esc(e.nombre)}. Este PIN se ve solo ahora.</p>
      <p class="pin-grande mono">${esc(pin)}</p>
      <div class="btn-row">
        <button class="btn btn-secondary btn-sm" data-action="imprimir-pin">Imprimir tarjeta</button>
        <button class="btn btn-primary btn-sm" data-action="cerrar-modal">Listo</button>
      </div>
    </div>`;
    caja.dataset.tarjeta = JSON.stringify({ codigo: e.codigo, nombre: e.nombre, pin, grupo });
    document.body.appendChild(caja);
    caja.querySelector('[data-action="cerrar-modal"]').focus();
  }

  /* ───────────── Router ───────────── */
  const partes = () => location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const grupoActual = () => (partes()[0] === "grupo" ? partes()[1] : null);
  function cargando(t) { $("#vista").innerHTML = `<div class="wrap section"><p class="muted">${esc(t)}</p></div>`; }
  function error(t) { $("#vista").innerHTML = `<div class="wrap section"><div class="callout coral"><b>Algo salió mal</b><p>${esc(t)}</p><a class="btn btn-secondary btn-sm" href="#/grupos">Volver a los grupos</a></div></div>`; }

  let turno = 0;
  async function render() {
    const mio = ++turno;
    if (!CFG.url || !CFG.clave || !/^https?:$/.test(location.protocol)) {
      $("#vista").innerHTML = `<div class="wrap section"><div class="callout coral"><b>El panel necesita estar publicado</b><p>Ábrelo desde el sitio (por ejemplo ${URL_ESTUDIANTE}/admin.html), no con doble clic.</p></div></div>`;
      return;
    }
    if (!ses) { vEntrar(); return; }
    $("#adminAcciones").hidden = false;
    const [r, id, tab] = partes();
    try {
      if (r === "grupo" && id) {
        if (!CACHE.has(id)) cargando("Cargando el grupo…");
        const d = await datosGrupo(id);
        if (mio !== turno) return;
        if (!d) return error("Ese grupo no existe.");
        const t = ["resumen", "estudiantes", "preguntas", "cuentas"].includes(tab) ? tab : "resumen";
        document.title = `${d.grupo.nombre} · Panel CRECE 10`;
        const html = t === "resumen" ? vResumen(d) : t === "estudiantes" ? vEstudiantes(d) : t === "preguntas" ? vPreguntas(d) : vCuentas(d);
        $("#vista").innerHTML = `<section class="section"><div class="wrap${t === "estudiantes" ? " ancho" : ""}">${html}</div></section>`;
        if (t === "resumen") activarGrafica();
      } else {
        await vGrupos();
      }
    } catch (e) {
      if (e.message === "sesion") return vEntrar("Tu sesión venció. Entra de nuevo.");
      error("No se pudieron leer los datos. Revisa la conexión y toca «Actualizar».");
    }
  }

  document.addEventListener("submit", async e => {
    if (e.target.id === "formAdmin") {
      e.preventDefault();
      const b = $("#adBoton"); b.disabled = true; b.textContent = "Entrando…";
      let msg;
      try { msg = await entrar($("#adCorreo").value.trim(), $("#adClave").value); } catch (x) { msg = "No hay conexión."; }
      if (msg) { vEntrar(msg); return; }
      location.hash = "#/grupos"; render();
    }
    if (e.target.id === "formGrupo") { e.preventDefault(); crearGrupo(); }
    if (e.target.id === "formLista") { e.preventDefault(); }
  });

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    const d = CACHE.get(grupoActual());
    if (a === "salir") { cerrarSesion(); location.hash = "#/entrar"; render(); return; }
    if (a === "respaldo") { respaldo().catch(() => alert("No se pudo descargar el respaldo.")); return; }
    if (a === "actualizar" && d) { CACHE.delete(d.grupo.id); render(); return; }
    if (a === "ordenar") { const c = el.dataset.col; orden = { col: c, dir: orden.col === c ? -orden.dir : 1 }; render(); return; }
    if (a === "csv-estudiantes" && d) { csvEstudiantes(d); return; }
    if (a === "revisar-lista" && d) { revisarLista(d); return; }
    if (a === "crear-cuentas" && d) { crearCuentas(d); return; }
    if (a === "imprimir-creadas" && ultimasCreadas) { imprimirTarjetas(ultimasCreadas.filas.filter(x => x.ok), d && d.grupo.nombre); return; }
    if (a === "csv-creadas" && ultimasCreadas) {
      descargar(`crece10-cuentas-${d ? d.grupo.nombre : ""}-${hoy()}.csv`,
        csv([["Código", "Nombre", "PIN"], ...ultimasCreadas.filas.filter(x => x.ok).map(x => [x.codigo, x.nombre, x.pin])]), "text/csv;charset=utf-8");
      return;
    }
    if (a === "pin" || a === "activo" || a === "borrar") { accionCuenta(a, el.dataset.id, el.dataset.activo); return; }
    if (a === "imprimir-pin") { const t = JSON.parse(el.closest(".modal-fondo").dataset.tarjeta); imprimirTarjetas([t], t.grupo); return; }
    if (a === "cerrar-modal") { el.closest(".modal-fondo").remove(); return; }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { const m = $(".modal-fondo"); if (m) m.remove(); }
  });

  window.addEventListener("hashchange", render);
  render();
})();
