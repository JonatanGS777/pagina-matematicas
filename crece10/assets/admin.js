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
  // Destrezas (v1.4): mismo mapa que la app del estudiante.
  const NIVELES_DZ = ["No empezada", "Intentada", "Familiar", "Competente", "Dominada"];
  const DESTREZAS = MODS.flatMap(m => (m.destrezas || []).map(d => Object.assign({ modulo: m.id }, d)));
  const DZ_PRUEBA = DESTREZAS.filter(d => !(MOD[d.modulo] && MOD[d.modulo].base));
  const cacheDz = {};
  function destrezaDeId(id) {
    if (id in cacheDz) return cacheDz[id];
    let it = ITEM[id];
    if (!it && GEN && /^GEN:/.test(id)) { try { it = GEN.desdeId(id); } catch (e) { it = null; } }
    const m = it && MOD[it.modulo];
    const d = m && m.destrezas && (m.destrezas.find(x => x.repasos.includes(it.repaso)) || m.destrezas[0]);
    return (cacheDz[id] = d ? d.id : null);
  }
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
    if (!r.ok && /banned/i.test(JSON.stringify(r.cuerpo || ""))) return "Esta cuenta está desactivada. Habla con el administrador.";
    if (!r.ok) return "El correo o la contraseña no coinciden.";
    ses = { access: r.cuerpo.access_token, refresh: r.cuerpo.refresh_token, exp: Date.now() + r.cuerpo.expires_in * 1000, id: r.cuerpo.user.id, correo };
    const p = await api(`/rest/v1/crece_perfiles?select=rol,activo,nombre,debe_cambiar_clave&id=eq.${ses.id}`);
    const yo = p.ok && p.cuerpo[0];
    if (!yo || (yo.rol !== "admin" && yo.rol !== "maestro")) { cerrarSesion(); return "Esta cuenta no es de administrador ni de maestro de CRECE 10."; }
    if (!yo.activo) { cerrarSesion(); return "Esta cuenta está desactivada. Habla con el administrador."; }
    Object.assign(ses, { nombre: yo.nombre, rol: yo.rol, debe: !!yo.debe_cambiar_clave });
    guardarSes();
    return null;
  }
  const esAdmin = () => !!ses && ses.rol === "admin";

  /* ───────────── Datos ───────────── */
  const CACHE = new Map();
  async function datosGrupo(id, forzar) {
    if (!forzar && CACHE.has(id)) return CACHE.get(id);
    const [g] = (await api(`/rest/v1/crece_grupos?select=id,nombre,curso&id=eq.${id}`)).cuerpo || [];
    if (!g) return null;
    // Maestros asignados (solo el admin puede leer los perfiles de los maestros).
    g.maestros = esAdmin()
      ? (await todo(`/rest/v1/crece_grupo_maestros?select=maestro_id,crece_perfiles(nombre)&grupo_id=eq.${id}`))
          .map(x => x.crece_perfiles && x.crece_perfiles.nombre).filter(Boolean)
      : null;
    const est = await todo(`/rest/v1/crece_perfiles?select=id,codigo,nombre,activo,creado&rol=eq.estudiante&grupo_id=eq.${id}&order=codigo`);
    let intentos = [], examenes = [], estados = [];
    if (est.length) {
      const ids = est.map(e => e.id).join(",");
      intentos = await todo(`/rest/v1/crece_intentos?select=estudiante_id,item_id,modulo,ok,pista,opcion,modo,segundos,fecha_local,creado&estudiante_id=in.(${ids})&order=creado`);
      examenes = await todo(`/rest/v1/crece_examenes?select=estudiante_id,correctas,total,minutos,fecha_local,creado&estudiante_id=in.(${ids})&order=creado`);
      // Solo la parte de destrezas del estado guardado (el maestro puede leerla desde v1.4).
      try { estados = await todo(`/rest/v1/crece_estado?select=estudiante_id,destrezas:datos->destrezas&estudiante_id=in.(${ids})`); } catch (e) { estados = []; }
    }
    const d = { grupo: g, est, intentos, examenes, estados, cargado: new Date() };
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
      // Nivel por destreza: el guardado por la app; «Intentada» si tiene alguna respuesta.
      const guardado = ((d.estados || []).find(x => x.estudiante_id === e.id) || {}).destrezas || {};
      const tocadas = new Set(xs.map(i => destrezaDeId(i.item_id)).filter(Boolean));
      const dz = {};
      DESTREZAS.forEach(x => {
        const g = guardado[x.id];
        dz[x.id] = Math.max(g && Number.isInteger(g.nivel) ? Math.min(4, Math.max(0, g.nivel)) : 0, tocadas.has(x.id) ? 1 : 0);
      });
      const r = {
        e, n: xs.length, ultimo, dias: ultimo ? diasDesde(ultimo) : null,
        sem: sem.length, prec7: sem.length ? pct(sem.reduce((s, i) => s + valor(i), 0), sem.length) : null,
        dom, diagnostico: xs.some(i => i.modo === "diagnostico"),
        examenes: exs.length, mejorEx, ultimoEx: exs.length ? pct(exs[exs.length - 1].correctas, exs[exs.length - 1].total) : null,
        medianaSeg: segs.length >= 10 ? mediana(segs) : null,
        dz, competentes: DZ_PRUEBA.filter(x => dz[x.id] >= 3).length
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
            <span class="eyebrow">Panel docente</span>
            <h1>Entra al panel</h1>
            <p class="lead">Crea grupos y cuentas, imprime las tarjetas de acceso y sigue el progreso de cada estudiante.</p>
            <p class="tiny" style="max-width:52ch">Para el administrador y los maestros, con su correo. Los estudiantes no entran aquí: entran en <b>${URL_ESTUDIANTE}</b> con su código y PIN.</p>
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
    // RLS ya limita: el maestro solo recibe sus grupos y sus estudiantes.
    const [grupos, est, asig] = await Promise.all([
      todo("/rest/v1/crece_grupos?select=id,nombre,curso,creado&order=curso.desc,nombre"),
      todo("/rest/v1/crece_perfiles?select=grupo_id,activo&rol=eq.estudiante"),
      esAdmin() ? todo("/rest/v1/crece_grupo_maestros?select=grupo_id,crece_perfiles(nombre,activo)") : Promise.resolve([])
    ]);
    const cuenta = {}, maestros = {};
    est.forEach(e => { cuenta[e.grupo_id] = (cuenta[e.grupo_id] || 0) + 1; });
    asig.forEach(a => { if (a.crece_perfiles) (maestros[a.grupo_id] = maestros[a.grupo_id] || []).push(a.crece_perfiles); });
    const lineaMaestros = g => {
      if (!esAdmin()) return "";
      const ms = maestros[g.id] || [];
      return `<p class="tiny grupo-maestros">${ms.length
        ? "Maestros: " + ms.map(m => esc(m.nombre) + (m.activo ? "" : " (desactivado)")).join(", ")
        : '<span class="sin-maestro">Sin maestro asignado</span>'}</p>`;
    };
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Hola${ses.nombre ? ", " + esc(ses.nombre) : ""}</span>
          <h1>${esAdmin() ? "Grupos" : "Tus grupos"}</h1>
          <p class="lead">${esAdmin()
            ? "Todos los grupos y sus maestros. Asigna maestros en «Maestros»."
            : "Los grupos que te asignaron y los que tú crees."} El código de cada estudiante empieza con el nombre del grupo: en el grupo <b>10B</b>, el número 7 es <b>10B-07</b>.</p>
          ${!grupos.length && !esAdmin() ? `<div class="callout" style="margin-top:20px"><p style="margin:0">Todavía no tienes grupos. Crea uno aquí abajo o pídele al administrador que te asigne uno.</p></div>` : ""}
          <div class="grid grid-3" style="margin-top:24px">
            ${grupos.map(g => `<a class="card grupo-card" href="#/grupo/${g.id}/resumen">
              <span class="tiny">${esc(g.curso)}</span>
              <h3>${esc(g.nombre)}</h3>
              <p class="tiny" style="margin:0">${cuenta[g.id] || 0} ${cuenta[g.id] === 1 ? "estudiante" : "estudiantes"}</p>
              ${lineaMaestros(g)}
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
    // Por la función: así el maestro que lo crea queda asignado al grupo.
    const r = await fn({ accion: "crear_grupo", nombre: nombre.replace(/[\s-]/g, ""), curso });
    if (r.error === "ya_existe") return err("Ya existe un grupo con ese nombre en ese curso.");
    if (!r.ok) return err("No se pudo crear el grupo.");
    anunciar("Grupo creado.");
    location.hash = `#/grupo/${r.grupo.id}/cuentas`;
  }

  function cabeceraGrupo(d, tab) {
    const t = (id, nombre) => `<a href="#/grupo/${d.grupo.id}/${id}" ${tab === id ? 'aria-current="page"' : ""}>${nombre}</a>`;
    return `<div class="admin-head">
      <div>
        <a class="tiny" href="#/grupos">← Grupos</a>
        <h1 style="margin:6px 0 2px">Grupo ${esc(d.grupo.nombre)}</h1>
        <p class="tiny" style="margin:0">${esc(d.grupo.curso)} · ${d.est.length} ${d.est.length === 1 ? "estudiante" : "estudiantes"} · datos de las ${d.cargado.toLocaleTimeString("es-PR", { hour: "numeric", minute: "2-digit" })}</p>
        ${d.grupo.maestros ? `<p class="tiny" style="margin:4px 0 0">${d.grupo.maestros.length ? "Maestros: " + d.grupo.maestros.map(esc).join(", ") : '<span class="sin-maestro">Sin maestro asignado</span> · <a href="#/maestros">asignar</a>'}</p>` : ""}
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
          <p class="tiny">Todas las respuestas de los últimos 30 días. Acierto = 1; con ayuda (pista o segundo intento) = 0.5. «Base» es el repaso de grados anteriores.</p>
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

      ${tarjetaDestrezasGrupo(activos)}

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

  // Cuántos estudiantes activos tiene cada destreza en Competente o más.
  // Ordenadas de menos a más: arriba, dónde se atasca el grupo.
  function tarjetaDestrezasGrupo(activos) {
    if (!activos.length || !DESTREZAS.length) return "";
    const filas = DESTREZAS.map(x => {
      const ns = activos.map(r => r.dz[x.id]);
      return { x, altos: ns.filter(n => n >= 3).length, empezados: ns.filter(n => n >= 1).length };
    }).sort((a, b) => a.altos / activos.length - b.altos / activos.length || a.empezados - b.empezados);
    const fila = f => `<div class="mastery-row dz-fila-grupo">
        <span class="name">${esc(f.x.t)} <span class="tiny">· ${esc(MOD[f.x.modulo].corto)}</span></span>
        <div class="bar" style="--c:var(--verde)"><i style="width:${pct(f.altos, activos.length)}%"></i></div>
        <span class="pct">${f.altos} de ${activos.length}<span class="tiny"> · ${f.empezados} ${f.empezados === 1 ? "la empezó" : "la empezaron"}</span></span>
      </div>`;
    return `<article class="card" style="margin-top:18px">
      <h3>Destrezas del grupo</h3>
      <p class="tiny">Cuántos de los ${activos.length} estudiantes activos tienen cada destreza en Competente o Dominada (sube con 3 de 4 a la primera y sin pista). Arriba, las que más cuestan.</p>
      ${filas.slice(0, 8).map(fila).join("")}
      ${filas.length > 8 ? `<details style="margin-top:8px"><summary class="tiny">Ver las ${filas.length} destrezas</summary>${filas.slice(8).map(fila).join("")}</details>` : ""}
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
      prec7: r.prec7 == null ? -1 : r.prec7, simulacro: r.mejorEx == null ? -1 : r.mejorEx, alertas: r.alertas.length,
      destrezas: r.competentes
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
            ${MODS.map(m => th(m.id, m.base ? "Base" : esc(m.id), `title="${esc(m.nombre)}"`)).join("")}
            ${th("destrezas", "Destrezas", `title="Destrezas de la prueba en Competente o Dominada (de ${DZ_PRUEBA.length})"`)}${th("simulacro", "Simulacro")}${th("alertas", "Alertas")}<th scope="col">Cuenta</th>
          </tr></thead>
          <tbody>${filas.map(r => `<tr class="${r.e.activo ? "" : "inactivo"}">
            <td class="mono">${esc(r.e.codigo)}</td>
            <td>${esc(r.e.nombre)}</td>
            <td class="tiny">${r.ultimo ? (r.dias === 0 ? "Hoy" : r.dias === 1 ? "Ayer" : `Hace ${r.dias} días`) : "Nunca"}</td>
            <td class="num">${r.n}</td>
            <td class="num">${r.prec7 == null ? "—" : r.prec7 + "%"}</td>
            ${MODS.map(m => { const x = r.dom[m.id]; return x.pct == null ? `<td class="num tiny">—</td>`
              : `<td class="num"><span class="dom ${claseDom(x.pct)}" title="${esc(m.nombre)}: ${x.pct}% en ${x.n} intentos">${x.pct}%</span></td>`; }).join("")}
            <td class="num" title="Competente o Dominada">${r.competentes} de ${DZ_PRUEBA.length}</td>
            <td class="num">${r.mejorEx == null ? "—" : `${r.mejorEx}%<br><span class="tiny">${nivel(r.mejorEx)}</span>`}</td>
            <td class="alertas-celda">${r.alertas.map(a => `<span class="chip ${a.k}">${esc(a.t)}</span>`).join("<br>")}</td>
            <td class="acciones">
              <button class="btn btn-ghost btn-sm" data-action="pin" data-id="${r.e.id}">Nuevo PIN</button>
              ${esAdmin() ? `<button class="btn btn-ghost btn-sm" data-action="activo" data-id="${r.e.id}" data-activo="${!r.e.activo}">${r.e.activo ? "Desactivar" : "Activar"}</button>
              <button class="btn btn-ghost btn-sm peligro" data-action="borrar" data-id="${r.e.id}">Borrar</button>` : ""}
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
      ["Código", "Nombre", "Activo", "Último uso", "Respuestas", "Precisión 7 días", ...MODS.map(m => m.nombre), "Destrezas en Competente o más", ...DESTREZAS.map(x => "Destreza: " + x.t), "Mejor simulacro", "Nivel aproximado", "Alertas"],
      ...filas.map(r => [r.e.codigo, r.e.nombre, r.e.activo ? "Sí" : "No", r.ultimo ? r.ultimo.slice(0, 10) : "", r.n,
        r.prec7 == null ? "" : r.prec7 + "%", ...MODS.map(m => r.dom[m.id].pct == null ? "" : r.dom[m.id].pct + "%"),
        `${r.competentes} de ${DZ_PRUEBA.length}`, ...DESTREZAS.map(x => NIVELES_DZ[r.dz[x.id]]),
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
    if ((tipo === "borrar" || tipo === "activo") && !esAdmin()) return;
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

  /* ───────────── Maestros (solo admin) ───────────── */
  const URL_PANEL = "digitalmathematics.org/crece10/admin.html";
  async function vMaestros() {
    document.title = "Maestros · Panel CRECE 10";
    cargando("Cargando maestros…");
    const [ms, grupos, asig] = await Promise.all([
      todo("/rest/v1/crece_perfiles?select=id,nombre,correo,activo,debe_cambiar_clave&rol=eq.maestro&order=nombre"),
      todo("/rest/v1/crece_grupos?select=id,nombre,curso&order=curso.desc,nombre"),
      todo("/rest/v1/crece_grupo_maestros?select=grupo_id,maestro_id")
    ]);
    const suyos = id => new Set(asig.filter(a => a.maestro_id === id).map(a => a.grupo_id));
    const casillas = (nombre, marcados) => grupos.length
      ? `<div class="casillas">${grupos.map(g => `<label><input type="checkbox" name="${nombre}" value="${g.id}" ${marcados.has(g.id) ? "checked" : ""}> ${esc(g.nombre)} <span class="tiny">${esc(g.curso)}</span></label>`).join("")}</div>`
      : `<p class="tiny" style="margin:0">Todavía no hay grupos. Créalos en «Grupos».</p>`;
    $("#vista").innerHTML = `
      <section class="section"><div class="wrap">
        <span class="eyebrow">Administración</span>
        <h1>Maestros</h1>
        <p class="lead">Cada maestro entra en <b>${URL_PANEL}</b> con su correo y ve solo los grupos que le asignes. Puede crear grupos, crear las cuentas de sus estudiantes y darles un PIN nuevo. Desactivar y borrar cuentas queda para ti.</p>
        <div class="grid grid-2" style="margin-top:22px;align-items:start">
          <div>
            ${ms.length ? ms.map(m => { const tiene = suyos(m.id); return `<article class="card maestro-card${m.activo ? "" : " inactivo"}" data-maestro="${m.id}">
              <div class="maestro-cab">
                <div><h3 style="margin:0">${esc(m.nombre)}</h3><p class="tiny" style="margin:2px 0 0">${esc(m.correo || "")}</p></div>
                <div class="maestro-estado">
                  ${m.activo ? "" : '<span class="chip gris">Desactivado</span>'}
                  ${m.debe_cambiar_clave ? '<span class="chip oro">Aún no cambia su contraseña</span>' : ""}
                </div>
              </div>
              <p class="tiny" style="margin:12px 0 6px"><b>Grupos asignados</b></p>
              ${casillas("g-" + m.id, tiene)}
              <div class="btn-row" style="margin-top:12px">
                <button class="btn btn-secondary btn-sm" data-action="guardar-grupos" data-id="${m.id}" ${grupos.length ? "" : "disabled"}>Guardar grupos</button>
                <button class="btn btn-ghost btn-sm" data-action="clave-maestro" data-id="${m.id}">Contraseña temporal nueva</button>
                <button class="btn btn-ghost btn-sm" data-action="activo-maestro" data-id="${m.id}" data-activo="${!m.activo}">${m.activo ? "Desactivar" : "Activar"}</button>
                <button class="btn btn-ghost btn-sm peligro" data-action="borrar-maestro" data-id="${m.id}">Borrar</button>
              </div>
            </article>`; }).join("")
            : `<div class="empty"><p style="margin:0">Todavía no hay maestros. Crea el primero con el formulario.</p></div>`}
          </div>
          <form class="card grupo-nuevo" id="formMaestro" novalidate>
            <h3>Nuevo maestro</h3>
            <label for="maNombre">Nombre</label>
            <input id="maNombre" maxlength="40" placeholder="Prof. Rivera" autocomplete="off" required>
            <label for="maCorreo">Correo</label>
            <input id="maCorreo" type="email" maxlength="254" placeholder="nombre@escuela.pr" autocomplete="off" required>
            <p class="tiny" style="margin:8px 0 2px"><b>Grupos</b> (puedes cambiarlos después)</p>
            ${casillas("nuevo", new Set())}
            <div id="maError" role="alert"></div>
            <button class="btn btn-primary btn-sm" type="submit">Crear maestro</button>
            <p class="tiny" style="margin:6px 0 0">Se crea con una <b>contraseña temporal</b> que verás una sola vez. Al entrar por primera vez, el panel le pide cambiarla.</p>
          </form>
        </div>
      </div></section>`;
  }
  const marcadas = nombre => $$(`input[name="${nombre}"]:checked`).map(x => x.value);
  async function crearMaestro() {
    const nombre = ($("#maNombre").value || "").trim();
    const correo = ($("#maCorreo").value || "").trim();
    const err = m => { $("#maError").innerHTML = `<p class="tiny" style="color:var(--coral);margin:4px 0 0">${esc(m)}</p>`; };
    if (!nombre) return err("Escribe el nombre del maestro.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(correo)) return err("Escribe un correo válido.");
    const b = $('#formMaestro button[type="submit"]'); b.disabled = true; b.textContent = "Creando…";
    const r = await fn({ accion: "crear_maestro", nombre, correo, grupo_ids: marcadas("nuevo") });
    b.disabled = false; b.textContent = "Crear maestro";
    if (!r.ok) return err(r.error === "correo_existe" ? "Ya existe una cuenta con ese correo." : r.error === "correo" ? "Ese correo no es válido." : "No se pudo crear el maestro.");
    await vMaestros();
    mostrarClave(r.nombre, r.correo, r.clave);
  }
  function mostrarClave(nombre, correo, clave) {
    const caja = document.createElement("div");
    caja.className = "modal-fondo";
    caja.innerHTML = `<div class="modal card" role="dialog" aria-modal="true" aria-labelledby="claveTitulo">
      <h3 id="claveTitulo">Contraseña temporal de ${esc(nombre)}</h3>
      <p class="tiny">Se ve <b>solo ahora</b>. Entrégasela a ${esc(nombre)} junto con estas instrucciones:</p>
      <p class="pin-grande mono" style="font-size:1.6rem;letter-spacing:.08em">${esc(clave)}</p>
      <ol class="tiny pasos-lista" style="margin:0 0 14px">
        <li>Entra en <b>${URL_PANEL}</b></li>
        <li>Correo: <b>${esc(correo)}</b></li>
        <li>Contraseña: la de arriba. El panel te pedirá cambiarla por una tuya.</li>
      </ol>
      <div class="btn-row">
        <button class="btn btn-secondary btn-sm" data-action="copiar-clave">Copiar instrucciones</button>
        <button class="btn btn-primary btn-sm" data-action="cerrar-modal">Listo</button>
      </div>
    </div>`;
    caja.dataset.texto = `CRECE 10 · Panel docente\nEntra en ${URL_PANEL}\nCorreo: ${correo}\nContraseña temporal: ${clave}\nAl entrar, el panel te pedirá cambiarla por una tuya.`;
    document.body.appendChild(caja);
    caja.querySelector('[data-action="cerrar-modal"]').focus();
  }
  async function accionMaestro(tipo, id, extra) {
    const tarjeta = document.querySelector(`[data-maestro="${id}"]`);
    const nombre = tarjeta ? tarjeta.querySelector("h3").textContent : "este maestro";
    if (tipo === "guardar-grupos") {
      const r = await fn({ accion: "asignar_grupos", maestro_id: id, grupo_ids: marcadas("g-" + id) });
      anunciar(r.ok ? `Grupos de ${nombre} guardados.` : "No se pudieron guardar los grupos.");
      if (!r.ok) alert("No se pudieron guardar los grupos.");
      CACHE.clear();
      return vMaestros();
    }
    if (tipo === "clave-maestro") {
      if (!confirm(`¿Dar una contraseña temporal nueva a ${nombre}? La actual deja de funcionar.`)) return;
      const r = await fn({ accion: "nueva_clave_maestro", maestro_id: id });
      if (!r.ok) return alert("No se pudo cambiar la contraseña.");
      await vMaestros();
      return mostrarClave(r.nombre, r.correo, r.clave);
    }
    if (tipo === "activo-maestro") {
      if (extra === "false" && !confirm(`¿Desactivar a ${nombre}? No podrá entrar hasta que lo actives.`)) return;
      const r = await fn({ accion: "cambiar_activo", perfil_id: id, activo: extra === "true" });
      if (!r.ok) return alert("No se pudo completar la acción.");
      return vMaestros();
    }
    if (tipo === "borrar-maestro") {
      if (!confirm(`¿Borrar la cuenta de ${nombre}? Sus grupos y estudiantes se quedan. No se puede deshacer.`)) return;
      const r = await fn({ accion: "borrar_maestro", maestro_id: id });
      if (!r.ok) return alert("No se pudo borrar.");
      CACHE.clear();
      return vMaestros();
    }
  }

  /* ───────────── Mi contraseña ───────────── */
  function vClave(obligatoria) {
    document.title = "Mi contraseña · Panel CRECE 10";
    $("#vista").innerHTML = `
      <section class="section entrar"><div class="wrap entrar-grid">
        <div>
          <span class="eyebrow">${obligatoria ? "Primer acceso" : "Tu cuenta"}</span>
          <h1>${obligatoria ? "Crea tu contraseña" : "Cambia tu contraseña"}</h1>
          <p class="lead">${obligatoria
            ? "Entraste con una contraseña temporal. Antes de seguir, escribe una tuya que solo tú conozcas."
            : "Escribe una contraseña nueva. La de ahora deja de funcionar."}</p>
          <p class="tiny">Al menos 10 caracteres, con letras y números.</p>
        </div>
        <form class="card entrar-card" id="formClave" novalidate>
          <label for="clNueva">Contraseña nueva</label>
          <input id="clNueva" type="password" autocomplete="new-password" minlength="10" required>
          <label for="clOtra">Repítela</label>
          <input id="clOtra" type="password" autocomplete="new-password" minlength="10" required>
          <div id="clError" role="alert"></div>
          <button class="btn btn-primary btn-lg" type="submit" id="clBoton">Guardar contraseña</button>
          ${obligatoria ? "" : `<a class="tiny" href="#/grupos" style="text-align:center">Cancelar</a>`}
        </form>
      </div></section>`;
    const c = $("#clNueva"); if (c) c.focus();
  }
  async function guardarClave() {
    const a = $("#clNueva").value, b2 = $("#clOtra").value;
    const err = m => { $("#clError").innerHTML = `<div class="callout coral" style="margin:0"><p style="margin:0">${esc(m)}</p></div>`; };
    if (a.length < 10 || !/[a-zA-Z]/.test(a) || !/\d/.test(a)) return err("Usa al menos 10 caracteres, con letras y números.");
    if (a !== b2) return err("Las dos contraseñas no coinciden.");
    const b = $("#clBoton"); b.disabled = true; b.textContent = "Guardando…";
    const r = await fn({ accion: "cambiar_mi_clave", nueva: a });
    if (!r.ok) { b.disabled = false; b.textContent = "Guardar contraseña"; return err(r.error === "clave_debil" ? "Usa al menos 10 caracteres, con letras y números." : "No se pudo guardar. Intenta de nuevo."); }
    // Cambiar la contraseña cierra las sesiones abiertas de la cuenta: se entra
    // de nuevo con la contraseña que la persona acaba de escribir.
    const s = ses.correo && await llamar("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: ses.correo, password: a }) });
    if (!s || !s.ok) { cerrarSesion(); vEntrar("Contraseña guardada. Entra con la nueva."); return; }
    Object.assign(ses, { access: s.cuerpo.access_token, refresh: s.cuerpo.refresh_token, exp: Date.now() + s.cuerpo.expires_in * 1000, debe: false });
    guardarSes();
    anunciar("Contraseña guardada.");
    location.hash = "#/grupos";
    render();
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
    // Sesión de una versión anterior del panel, sin rol guardado: se completa.
    if (!ses.rol) {
      try {
        const p = await api(`/rest/v1/crece_perfiles?select=rol,activo,nombre,debe_cambiar_clave&id=eq.${ses.id}`);
        const yo = p.ok && p.cuerpo[0];
        if (!yo || !yo.activo || (yo.rol !== "admin" && yo.rol !== "maestro")) { cerrarSesion(); vEntrar(); return; }
        Object.assign(ses, { nombre: yo.nombre, rol: yo.rol, debe: !!yo.debe_cambiar_clave });
        guardarSes();
      } catch (e) { vEntrar("Tu sesión venció. Entra de nuevo."); return; }
    }
    $("#adminAcciones").hidden = false;
    $("#quienSoy").textContent = `${ses.nombre || ""} · ${esAdmin() ? "Administrador" : "Maestro"}`;
    $$(".solo-admin").forEach(x => { x.hidden = !esAdmin(); });
    // Primer acceso de un maestro: no pasa de aquí hasta crear su contraseña.
    if (ses.debe) { vClave(true); return; }
    const [r, id, tab] = partes();
    try {
      if (r === "clave") { vClave(false); return; }
      if (r === "maestros") { if (!esAdmin()) { location.hash = "#/grupos"; return; } await vMaestros(); return; }
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
    if (e.target.id === "formMaestro") { e.preventDefault(); crearMaestro(); }
    if (e.target.id === "formClave") { e.preventDefault(); guardarClave(); }
    if (e.target.id === "formLista") { e.preventDefault(); }
  });

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    const d = CACHE.get(grupoActual());
    if (a === "salir") { cerrarSesion(); location.hash = "#/entrar"; render(); return; }
    if (a === "respaldo") { if (esAdmin()) respaldo().catch(() => alert("No se pudo descargar el respaldo.")); return; }
    if (["guardar-grupos", "clave-maestro", "activo-maestro", "borrar-maestro"].includes(a)) {
      if (esAdmin()) accionMaestro(a, el.dataset.id, el.dataset.activo);
      return;
    }
    if (a === "copiar-clave") {
      const t = el.closest(".modal-fondo").dataset.texto;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
        .then(() => { el.textContent = "Copiado"; }, () => { el.textContent = "No se pudo copiar"; });
      return;
    }
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
