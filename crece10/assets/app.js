/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* ============================================================
   CRECE 10 · Matemáticas — aplicación de práctica
   Sin dependencias. Router por hash. Progreso en localStorage.
   ============================================================ */
(function () {
  "use strict";

  const MODS = window.CRECE_MODULOS || [];
  const BANCO = window.CRECE_BANCO || [];
  const FIG = window.CRECE_FIGURAS || {};
  const MOD = Object.fromEntries(MODS.map(m => [m.id, m]));
  const ITEM = Object.fromEntries(BANCO.map(i => [i.id, i]));
  const GEN = window.CRECE_GENERADORES || null;
  // Ítems del banco por id; las variantes «GEN:…» se reconstruyen desde su semilla.
  const cacheGen = {};
  function itemPorId(id) {
    if (ITEM[id]) return ITEM[id];
    if (!GEN || !/^GEN:/.test(id)) return null;
    return cacheGen[id] || (cacheGen[id] = GEN.desdeId(id));
  }
  const variantes = mod => (GEN ? GEN.nuevos(mod || null) : []);

  // Cuenta de la escuela (assets/nube.js). Sin ella, o en file://, todo es local.
  const NUBE = window.CRECE_NUBE || {
    activa: false, usuario: () => null, sufijo: () => "", pendientes: () => 0, estado: () => "ok",
    encolarIntento() {}, encolarExamen() {}, guardarEstado() {}, alCambiar() {}, enviar() {}
  };
  // Con cuenta, cada estudiante tiene su propio progreso en el equipo
  // (varios pueden compartir un Chromebook). Sin cuenta, la clave de siempre.
  const CLAVE_LEGADO = "crece10:v1";
  const CLAVE = CLAVE_LEGADO + NUBE.sufijo();

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
  const CLAVE_SESION = "crece10:sesion" + NUBE.sufijo();
  // Fecha en hora local (Puerto Rico), no UTC: después de las 8 p.m. UTC ya es «mañana».
  const fechaLocal = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const hoy = () => fechaLocal(new Date());

  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-5-6 6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    flag: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 21V4m0 0h11l-2 4 2 4H5"/></svg>',
    sound: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 10v4h3l4 4V6l-4 4H4Zm12-2a6 6 0 0 1 0 8m2-11a9 9 0 0 1 0 14"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-.8.7-1 2-1 3H9c0-1-.2-2.3-1-3a6 6 0 0 1 4-10Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5Zm0 14h15"/></svg>',
    chart: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20V10m5 10V4m5 16v-7m5 7V8"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/></svg>'
  };

  /* ===================== Estado ===================== */
  const estadoInicial = () => ({
    v: 1,
    intentos: [],
    errores: {},
    plan: [false, false, false, false],
    ajustes: { letra: false, contraste: false },
    examenes: [],
    diagnostico: null,
    ultimoExamen: null
  });

  let STATE = cargar();
  let session = null;
  let temporizador = null;
  let calcExpr = "";
  let tabActiva = "calc";

  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (!raw) return estadoInicial();
      const s = JSON.parse(raw);
      return Object.assign(estadoInicial(), s, {
        ajustes: Object.assign({ letra: false, contraste: false }, s.ajustes),
        plan: Array.isArray(s.plan) && s.plan.length === 4 ? s.plan : [false, false, false, false]
      });
    } catch (e) { return estadoInicial(); }
  }
  function guardar() {
    STATE.t = Date.now(); // decide qué copia es más reciente al entrar en otro equipo
    try { localStorage.setItem(CLAVE, JSON.stringify(STATE)); } catch (e) { /* almacenamiento lleno o bloqueado */ }
    if (NUBE.usuario()) NUBE.guardarEstado(STATE);
  }
  function anunciar(t) { const a = $("#anuncios"); if (a) { a.textContent = ""; setTimeout(() => { a.textContent = t; }, 40); } }

  /* ===================== Progreso ===================== */
  function intentosDe(mod) { return STATE.intentos.filter(i => i.mod === mod); }
  // Un acierto sin ayuda vale 1; con pista, 0.5; un fallo, 0.
  const valorIntento = i => (i.ok ? (i.pista ? 0.5 : 1) : 0);
  function dominio(mod) {
    const xs = intentosDe(mod).slice(-40);
    const ok = xs.reduce((s, i) => s + valorIntento(i), 0);
    return { pct: xs.length ? pct(ok, xs.length) : 0, n: xs.length, ok };
  }
  function precisionGlobal() {
    const xs = STATE.intentos.slice(-200);
    return { pct: xs.length ? pct(xs.reduce((s, i) => s + valorIntento(i), 0), xs.length) : 0, n: xs.length };
  }
  function racha() {
    const dias = new Set(STATE.intentos.map(i => i.fecha));
    let d = new Date();
    const key0 = fechaLocal(d);
    if (!dias.has(key0)) d.setDate(d.getDate() - 1);
    let n = 0;
    for (;;) {
      const key = fechaLocal(d);
      if (!dias.has(key)) break;
      n++; d.setDate(d.getDate() - 1);
      if (n > 365) break;
    }
    return n;
  }
  function mejorExamen() {
    if (!STATE.examenes.length) return null;
    return Math.max(...STATE.examenes.map(e => pct(e.correctas, e.total)));
  }
  function moduloRecomendado() {
    const conDatos = MODS.filter(m => dominio(m.id).n > 0);
    if (!conDatos.length) return MODS[0];
    return conDatos.slice().sort((a, b) => dominio(a.id).pct - dominio(b.id).pct)[0];
  }
  // extra: { opcion, segundos } para el panel docente (qué eligió y cuánto tardó).
  function registrar(item, ok, modo, diferir, conPista, extra) {
    const intento = { id: item.id, mod: item.modulo, ok: !!ok, fecha: hoy(), modo };
    if (conPista) intento.pista = true;
    STATE.intentos.push(intento);
    if (NUBE.usuario()) {
      const x = extra || {};
      NUBE.encolarIntento({
        item_id: String(item.id).slice(0, 60), modulo: item.modulo, ok: !!ok, pista: !!conPista,
        opcion: Number.isInteger(x.opcion) && x.opcion >= 0 && x.opcion <= 9 ? x.opcion : null,
        modo: ["practica", "diagnostico", "examen", "repaso"].includes(modo) ? modo : "practica",
        segundos: Number.isFinite(x.segundos) ? Math.max(0, Math.min(7200, Math.round(x.segundos))) : null,
        fecha_local: intento.fecha
      });
    }
    if (STATE.intentos.length > 800) STATE.intentos = STATE.intentos.slice(-800);
    if (!ok) {
      const e = STATE.errores[item.id] || { veces: 0, ultima: "" };
      e.veces++; e.ultima = hoy();
      STATE.errores[item.id] = e;
    } else if (STATE.errores[item.id] && !conPista) {
      // Solo un acierto sin pista saca el ítem del cuaderno de errores.
      STATE.errores[item.id].veces = Math.max(0, STATE.errores[item.id].veces - 1);
      if (STATE.errores[item.id].veces === 0) delete STATE.errores[item.id];
    }
    if (!diferir) guardar();
  }

  /* ===================== Utilidades ===================== */
  function barajar(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
    return x;
  }
  // El banco fijo más una variante nueva de cada plantilla de la ruta.
  function muestraModulo(mod, n) {
    const xs = BANCO.filter(i => i.modulo === mod).concat(variantes(mod));
    return barajar(xs).slice(0, Math.min(n, xs.length));
  }
  function muestraMezcla(n, excluirAbiertas) {
    // M6 (numeración, álgebra y probabilidad) = 12 de 56 puntos ≈ 21 %: 18 / 84.
    const pesos = { M1: 10, M2: 16, M3: 14, M4: 12, M5: 14, M6: 18 };
    const total = Object.values(pesos).reduce((a, b) => a + b, 0);
    const cuotas = {};
    let asignados = 0;
    MODS.forEach(m => { cuotas[m.id] = Math.max(1, Math.round(n * pesos[m.id] / total)); asignados += cuotas[m.id]; });
    while (asignados > n) {
      const m = MODS.slice().sort((a, b) => cuotas[b.id] - cuotas[a.id])[0];
      if (cuotas[m.id] > 1) { cuotas[m.id]--; asignados--; } else break;
    }
    let pool = BANCO.concat(variantes()).filter(i => !(excluirAbiertas && i.tipo === "abierta"));
    const out = [];
    MODS.forEach(m => {
      const xs = barajar(pool.filter(i => i.modulo === m.id)).slice(0, cuotas[m.id]);
      out.push(...xs);
    });
    if (out.length < n) {
      const ids = new Set(out.map(i => i.id));
      out.push(...barajar(pool.filter(i => !ids.has(i.id))).slice(0, n - out.length));
    }
    return barajar(out).slice(0, n);
  }
  function formatearTiempo(seg) {
    const m = Math.floor(seg / 60), s = seg % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function normalizarNum(t) {
    let s = String(t == null ? "" : t).replace(/\s/g, "").replace(/[−–]/g, "-");
    // «1,500» es separador de miles; «9,5» es coma decimal.
    if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
    else s = s.replace(/,/g, ".");
    return s;
  }
  // Devuelve el número que escribió el estudiante o NaN si no se entiende.
  // Acepta enteros, decimales, fracciones (1/2, −3/4) y una unidad al final (9cm).
  function leerNumero(t) {
    const s = normalizarNum(t);
    if (s === "") return NaN;
    const frac = s.match(/^([+-]?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (frac) return Number(frac[2]) === 0 ? NaN : Number(frac[1]) / Number(frac[2]);
    const num = s.match(/^([+-]?(?:\d+\.?\d*|\.\d+))(?:[a-zA-Z°²³]+)?$/);
    return num ? Number(num[1]) : NaN;
  }
  function numeroCorrecto(it, r) {
    const v = leerNumero(r);
    return Number.isFinite(v) && Math.abs(v - it.respuesta) <= (it.tolerancia || 0.001);
  }

  /* ===================== Sesión guardada ===================== */
  // La sesión en curso (práctica o simulacro) sobrevive a una recarga o a un
  // Chromebook que se apaga. Se guardan los ids de los ítems, no los ítems.
  function guardarSesion() {
    if (!session) return;
    try {
      const copia = Object.assign({}, session, { items: session.items.map(i => i.id) });
      localStorage.setItem(CLAVE_SESION, JSON.stringify(copia));
    } catch (e) { /* almacenamiento lleno o bloqueado */ }
  }
  function borrarSesion() {
    try { localStorage.removeItem(CLAVE_SESION); } catch (e) { /* nada */ }
  }
  function restaurarSesion() {
    try {
      const raw = localStorage.getItem(CLAVE_SESION);
      if (!raw) return null;
      const s = JSON.parse(raw);
      const items = (s.items || []).map(id => itemPorId(id)).filter(Boolean);
      if (!items.length || items.length !== s.items.length) { borrarSesion(); return null; }
      s.items = items;
      return s;
    } catch (e) { borrarSesion(); return null; }
  }
  function sesionAbierta() {
    return session && !session.examen && !session.terminado ? session : null;
  }

  /* ===================== Cuenta de la escuela ===================== */
  const ERRORES_ENTRADA = {
    codigo: "Ese código no tiene la forma correcta. Se escribe como 10B-07.",
    pin: "El PIN tiene 6 números.",
    credenciales: "El código o el PIN no coinciden. Revísalos y vuelve a intentar.",
    desactivada: "Esta cuenta está desactivada. Habla con tu maestro.",
    espera: "Demasiados intentos seguidos. Espera un minuto y vuelve a intentar.",
    sinconexion: "No hay conexión. Para entrar necesitas internet; después puedes practicar sin él.",
    perfil: "Esta cuenta no es de estudiante."
  };
  const TEXTO_SYNC = {
    ok: "Guardado en tu cuenta",
    enviando: "Guardando en tu cuenta…",
    pendiente: "Respuestas por enviar",
    sinconexion: "Sin conexión: se guarda en este equipo",
    expirada: "Tu sesión venció: vuelve a entrar",
    desactivada: "Cuenta desactivada"
  };
  const necesitaEntrar = () => NUBE.activa && !NUBE.usuario();

  function vEntrar() {
    document.title = "Entrar · CRECE 10";
    $("#vista").innerHTML = `
      <section class="section entrar">
        <div class="wrap entrar-grid">
          <div>
            <span class="eyebrow">Décimo grado · Matemáticas</span>
            <h1>Entra con tu código</h1>
            <p class="lead">Tu maestro te dio un código como <b>10B-07</b> y un PIN de 6 números. Tu progreso se guarda en tu cuenta y te sigue a cualquier equipo.</p>
            <p class="tiny" style="max-width:52ch">Si se va el internet mientras practicas, no pierdes nada: tus respuestas se guardan en el equipo y se envían cuando vuelva la conexión.</p>
          </div>
          <form class="card entrar-card" id="formEntrar" novalidate>
            <label for="entCodigo">Código</label>
            <input id="entCodigo" name="username" autocomplete="username" autocapitalize="characters" spellcheck="false" placeholder="10B-07" maxlength="12" required>
            <label for="entPin">PIN</label>
            <input id="entPin" name="password" type="password" inputmode="numeric" autocomplete="current-password" placeholder="6 números" maxlength="6" pattern="[0-9]{6}" required>
            <div id="entError" role="alert" aria-live="assertive"></div>
            <button class="btn btn-primary btn-lg" type="submit" id="entBoton">Entrar ${ICON.arrow}</button>
            <p class="tiny" style="margin:4px 0 0">¿Olvidaste tu PIN? Pídele uno nuevo a tu maestro.</p>
          </form>
        </div>
      </section>`;
    const c = $("#entCodigo");
    if (c) c.focus();
  }

  async function enviarEntrada() {
    const boton = $("#entBoton"), zona = $("#entError");
    const codigo = ($("#entCodigo") || {}).value || "";
    const pin = (($("#entPin") || {}).value || "").replace(/\D/g, "");
    if (boton) { boton.disabled = true; boton.textContent = "Entrando…"; }
    const r = await NUBE.entrar(codigo, pin);
    if (!r.ok) {
      if (zona) zona.innerHTML = `<div class="callout coral" style="margin:0"><p style="margin:0">${esc(ERRORES_ENTRADA[r.error] || "No se pudo entrar. Intenta de nuevo.")}</p></div>`;
      if (boton) { boton.disabled = false; boton.innerHTML = `Entrar ${ICON.arrow}`; }
      anunciar(ERRORES_ENTRADA[r.error] || "No se pudo entrar.");
      return;
    }
    // ¿Qué copia del progreso es más reciente, la de este equipo o la de la nube?
    const clave = CLAVE_LEGADO + ":" + r.usuario.id;
    let local = null;
    try { local = JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) { local = null; }
    try {
      const s = await NUBE.traerEstado();
      if (s && s.datos && (!local || (s.datos.t || 0) > (local.t || 0))) {
        localStorage.setItem(clave, JSON.stringify(s.datos));
      } else if (local) {
        NUBE.guardarEstado(local);
      }
    } catch (e) { /* sin conexión: se usa lo del equipo */ }
    location.hash = "#/inicio";
    location.reload();
  }

  async function salirCuenta() {
    const n = NUBE.pendientes();
    if (n && navigator.onLine === false &&
        !confirm(`Tienes ${n} respuestas sin enviar y no hay conexión. Se quedan guardadas en este equipo y se envían la próxima vez que entres aquí. ¿Salir?`)) return;
    detenerReloj();
    await NUBE.salir();
    location.hash = "#/inicio";
    location.reload();
  }

  function pintarCuenta() {
    const u = NUBE.usuario();
    document.body.classList.toggle("sin-sesion", necesitaEntrar());
    const chip = $("#cuentaChip");
    if (!chip) return;
    if (!u) { chip.hidden = true; return; }
    const e = NUBE.estado(), n = NUBE.pendientes();
    const texto = e === "pendiente" ? `${n} ${n === 1 ? "respuesta" : "respuestas"} por enviar` : TEXTO_SYNC[e] || "";
    chip.hidden = false;
    chip.className = "cuenta-chip sync-" + e;
    chip.title = texto;
    chip.setAttribute("aria-label", `${u.nombre}, ${u.codigo}. ${texto}. Ver tu cuenta`);
    chip.innerHTML = `<span class="sync-dot" aria-hidden="true"></span><span class="cuenta-nombre">${esc(u.nombre)}</span><span class="cuenta-codigo">${esc(u.codigo)}</span>`;
  }

  function tarjetaCuenta() {
    const u = NUBE.usuario();
    if (!u) return "";
    const e = NUBE.estado(), n = NUBE.pendientes();
    const vencida = e === "expirada" || e === "desactivada";
    return `<article class="card cuenta-card" style="margin-top:18px">
      <h3>Tu cuenta</h3>
      <dl class="cuenta-datos">
        <div><dt>Nombre</dt><dd>${esc(u.nombre)}</dd></div>
        <div><dt>Código</dt><dd>${esc(u.codigo)}</dd></div>
        ${u.grupo ? `<div><dt>Grupo</dt><dd>${esc(u.grupo)}</dd></div>` : ""}
        <div><dt>Estado</dt><dd><span class="cuenta-chip sync-${e}" style="cursor:default"><span class="sync-dot" aria-hidden="true"></span>${esc(e === "pendiente" ? `${n} por enviar` : TEXTO_SYNC[e])}</span></dd></div>
      </dl>
      <div class="btn-row">
        ${!vencida && n ? `<button class="btn btn-secondary btn-sm" data-action="enviar-ahora">Enviar ahora</button>` : ""}
        <button class="btn ${vencida ? "btn-primary" : "btn-ghost"} btn-sm" data-action="salir">${vencida ? "Entrar de nuevo" : "Salir de mi cuenta"}</button>
      </div>
    </article>`;
  }

  // Progreso que quedó en el equipo de antes de las cuentas (clave sin usuario).
  function legado() {
    if (!NUBE.usuario()) return null;
    try {
      if (localStorage.getItem("crece10:legado-visto:" + NUBE.usuario().id)) return null;
      const a = JSON.parse(localStorage.getItem(CLAVE_LEGADO) || "null");
      return a && Array.isArray(a.intentos) && a.intentos.length ? a : null;
    } catch (e) { return null; }
  }
  function avisoLegado() {
    const a = legado();
    if (!a) return "";
    return `<div class="wrap" style="padding-top:20px">
      <div class="callout" role="region" aria-label="Progreso guardado en este equipo">
        <b>Hay progreso guardado en este equipo de antes de las cuentas</b>
        <p>${a.intentos.length} respuestas, sin nombre. Si son tuyas, pásalas a tu cuenta para que cuenten en tu progreso. Si no son tuyas, déjalas.</p>
        <div class="btn-row" style="margin-top:10px">
          <button class="btn btn-primary btn-sm" data-action="reclamar-legado">Sí, son mías</button>
          <button class="btn btn-ghost btn-sm" data-action="ignorar-legado">No son mías</button>
        </div>
      </div>
    </div>`;
  }
  function reclamarLegado() {
    const a = legado();
    if (!a) return;
    const MODOS = ["practica", "diagnostico", "examen", "repaso"];
    a.intentos.forEach(i => {
      if (!i || !i.id || !/^M[1-9]$/.test(i.mod || "")) return;
      STATE.intentos.push(i);
      NUBE.encolarIntento({
        item_id: String(i.id).slice(0, 60), modulo: i.mod, ok: !!i.ok, pista: !!i.pista, opcion: null,
        modo: MODOS.includes(i.modo) ? i.modo : "practica", segundos: null,
        fecha_local: /^\d{4}-\d{2}-\d{2}$/.test(i.fecha || "") ? i.fecha : hoy()
      });
    });
    STATE.intentos.sort((x, y) => String(x.fecha).localeCompare(String(y.fecha)));
    if (STATE.intentos.length > 800) STATE.intentos = STATE.intentos.slice(-800);
    Object.entries(a.errores || {}).forEach(([id, e]) => {
      const m = STATE.errores[id] || { veces: 0, ultima: "" };
      m.veces += Number(e.veces) || 0;
      if (String(e.ultima) > String(m.ultima)) m.ultima = e.ultima;
      STATE.errores[id] = m;
    });
    STATE.examenes = STATE.examenes.concat(a.examenes || [])
      .sort((x, y) => String(x.fecha).localeCompare(String(y.fecha))).slice(-20);
    if (Array.isArray(a.plan)) STATE.plan = STATE.plan.map((v, k) => v || !!a.plan[k]);
    STATE.diagnostico = STATE.diagnostico || a.diagnostico || null;
    if (a.ultimoExamen && (!STATE.ultimoExamen || String(a.ultimoExamen.fecha) > String(STATE.ultimoExamen.fecha))) {
      STATE.ultimoExamen = a.ultimoExamen;
    }
    guardar();
    // Se quita del equipo para que otro estudiante no lo reclame también.
    try { localStorage.removeItem(CLAVE_LEGADO); localStorage.removeItem("crece10:sesion"); } catch (e) { /* nada */ }
    anunciar("Listo: ese progreso ya está en tu cuenta.");
    render();
  }
  function ignorarLegado() {
    try { localStorage.setItem("crece10:legado-visto:" + NUBE.usuario().id, "1"); } catch (e) { /* nada */ }
    render();
  }

  /* ===================== Router ===================== */
  function rutaActual() {
    const h = location.hash.replace(/^#\/?/, "");
    return h.split("/").filter(Boolean);
  }
  function ir(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }
  function render() {
    const partes = rutaActual();
    const r = partes[0] || "inicio";
    detenerReloj();
    cerrarMenu();
    pintarCuenta();
    if (necesitaEntrar()) {
      vEntrar();
      $$(".nav a").forEach(a => a.removeAttribute("aria-current"));
      window.scrollTo(0, 0);
      return;
    }
    if (session && session.examen && !session.entregado && !["simulacro"].includes(r)) {
      // Salir de un examen en curso: se conserva la sesión, pero se avisa.
    }
    if (r === "inicio") { document.title = "CRECE 10 · Matemáticas — Práctica guiada"; vInicio(); }
    else if (r === "aprende") { document.title = "Aprende · CRECE 10"; vAprende(); }
    else if (r === "modulo") { document.title = (MOD[partes[1]] ? MOD[partes[1]].nombre + " · " : "") + "CRECE 10"; vModulo(partes[1], partes[2]); }
    else if (r === "practica") {
      document.title = "Practica · CRECE 10";
      if (partes[1] === "sesion") { if (!session || session.examen) return ir("#/practica"); vRunner(); }
      else vPractica();
    }
    else if (r === "simulacro") {
      document.title = "Simulacro · CRECE 10";
      if (partes[1] === "sesion") { if (!session || !session.examen) return ir("#/simulacro"); vExamen(); }
      else if (partes[1] === "resultado") vResultadoExamen();
      else vSimulacro();
    }
    else if (r === "progreso") { document.title = "Progreso · CRECE 10"; vProgreso(); }
    else if (r === "herramientas") { document.title = "Herramientas · CRECE 10"; vHerramientas(); }
    else ir("#/inicio");

    $$(".nav a").forEach(a => {
      const rr = a.getAttribute("data-route");
      if (rr === r) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const v = $("#vista");
    if (v) v.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ===================== Vistas: inicio ===================== */
  function vInicio() {
    const g = precisionGlobal();
    const rec = moduloRecomendado();
    const recDom = dominio(rec.id);
    const mejor = mejorExamen();
    const hechos = STATE.intentos.length;

    $("#vista").innerHTML = `${avisoLegado()}
      <section class="hero">
        <div class="wrap hero-grid">
          <div>
            <span class="eyebrow">Décimo grado · Matemáticas</span>
            <h1>Geometría que se entiende.<br><em>Práctica que se queda.</em></h1>
            <p class="lead">Un plan de práctica independiente para prepararte para la prueba CRECE, aunque tu maestro no esté en el salón. Explicaciones claras, figuras, pistas y un registro de lo que ya dominas.</p>
            <div class="btn-row">
              <a class="btn btn-primary btn-lg" href="#/practica">Empezar a practicar ${ICON.arrow}</a>
              <a class="btn btn-secondary btn-lg" href="#/aprende">Ver las rutas</a>
            </div>
            <div class="hero-note">
              <span>${ICON.check} ${BANCO.length} ítems con explicación</span>
              <span>${ICON.check} Funciona sin internet</span>
              <span>${ICON.check} ${NUBE.usuario() ? "Tu progreso te sigue a cualquier equipo" : "Sin cuentas ni registro"}</span>
            </div>
          </div>

          <aside class="route-card" aria-labelledby="rutaHoy">
            <h3 id="rutaHoy">Tu ruta de hoy</h3>
            <p class="tiny">${hechos ? "Continúa donde quedaste." : "Tres pasos para empezar sin profesor al lado."}</p>
            ${avisoSesionPendiente()}
            <div class="route-step">
              <span class="route-num">1</span>
              <div><b>${hechos ? "Calienta 10 minutos" : "Haz el diagnóstico"}</b><span>${hechos ? "Una práctica corta en tu ruta más débil." : "12 ítems, 2 por ruta, para saber dónde estás."}</span></div>
            </div>
            <div class="route-step">
              <span class="route-num">2</span>
              <div><b>Estudia una ruta</b><span>${esc(rec.nombre)}: ideas, fórmulas y un ejemplo resuelto.</span></div>
            </div>
            <div class="route-step">
              <span class="route-num">3</span>
              <div><b>Mide tu progreso</b><span>Un simulacro de 25 ítems cuando completes dos rutas.</span></div>
            </div>
            <div class="route-foot">
              <span class="chip ${recDom.n ? "verde" : "oro"}">${recDom.n ? recDom.pct + "% en " + esc(rec.corto) : "Sin diagnóstico"}</span>
              <button class="btn btn-primary btn-sm" data-action="${hechos ? "iniciar-corta" : "iniciar-diagnostico"}" data-mod="${rec.id}">${hechos ? "Sesión corta" : "Diagnóstico"} ${ICON.arrow}</button>
            </div>
          </aside>
        </div>

        <div class="wrap">
          <div class="stat-strip">
            <div class="stat"><b>${g.pct}%</b><span>Precisión (${g.n} intentos)</span></div>
            <div class="stat"><b>${hechos}</b><span>Ítems resueltos</span></div>
            <div class="stat"><b>${racha()}</b><span>Días seguidos</span></div>
            <div class="stat"><b>${mejor == null ? "—" : mejor + "%"}</b><span>Mejor simulacro</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="eyebrow">Las seis rutas</span>
              <h2>Todo lo que evalúa la prueba, en orden</h2>
              <p>La geometría vale el 71% de los puntos (40 de 56). Por eso las cinco primeras rutas son geométricas y la última conecta álgebra, matrices y datos.</p>
            </div>
            <a class="btn btn-ghost" href="#/aprende">Ver todas ${ICON.arrow}</a>
          </div>
          <div class="grid grid-3">
            ${MODS.map(m => {
              const d = dominio(m.id);
              return `<a class="card hover skill-card" style="--c:${m.color}" href="#/modulo/${m.id}">
                <div class="card-top">
                  <span class="skill-mono">${m.id.replace("M", "")}</span>
                  <span class="chip">${esc(m.peso.replace("≈ ", ""))}</span>
                </div>
                <h3>${esc(m.nombre)}</h3>
                <span class="tag">${esc(m.indicadores.join(" · "))}</span>
                <p>${esc(m.gancho)}</p>
                <div class="skill-foot">
                  <div class="bar" style="--c:${m.color}"><i style="width:${d.pct}%"></i></div>
                  <span class="tiny">${d.n ? d.pct + "%" : "Nuevo"}</span>
                </div>
              </a>`;
            }).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="eyebrow">Cómo funciona</span>
              <h2>Estudiar solo no significa adivinar</h2>
              <p>Cada ítem te dice qué destreza practica, qué error estás cometiendo y cómo corregirlo.</p>
            </div>
          </div>
          <div class="grid grid-3">
            <article class="card">
              <span class="skill-mono" style="--c:#0e6b63">${ICON.book}</span>
              <h3>1. Aprende la idea</h3>
              <p>Una ruta tiene lo esencial, las fórmulas, un ejemplo resuelto y los errores que más cuestan puntos.</p>
            </article>
            <article class="card">
              <span class="skill-mono" style="--c:#c2412d">${ICON.bulb}</span>
              <h3>2. Practica con pistas</h3>
              <p>Si te trabas, pide una pista. Si fallas, ves la explicación y el error frecuente, no solo la respuesta.</p>
            </article>
            <article class="card">
              <span class="skill-mono" style="--c:#9a6b00">${ICON.chart}</span>
              <h3>3. Mide y repite</h3>
              <p>El progreso se guarda en tu navegador. El cuaderno de errores te devuelve justo lo que fallaste.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="eyebrow">Plan de 4 semanas</span>
              <h2>Una hora por día, sin depender del maestro</h2>
              <p>Cada semana se marca sola cuando llegas a la meta en sus rutas; si ya la hiciste por otro medio, márcala tú. Está pensado para 20–30 minutos diarios.</p>
            </div>
          </div>
          <div class="grid grid-2">
            ${PLAN.map((p, i) => {
              const e = estadoSemana(i);
              const hecho = e.auto || STATE.plan[i];
              return `
              <article class="card hover" style="display:flex;gap:14px;align-items:flex-start">
                <button class="icon-btn" data-action="plan" data-i="${i}" aria-pressed="${hecho}" ${e.auto ? "disabled" : ""}
                  aria-label="${e.auto ? "Semana completada según tu dominio" : "Marcar " + esc(p.t) + " como completada"}"
                  style="${hecho ? "background:var(--verde);color:#fff;border-color:var(--verde)" : ""}">
                  ${hecho ? ICON.check : ""}
                </button>
                <div>
                  <h3 style="font-size:1.05rem;margin-bottom:4px">${esc(p.t)}</h3>
                  <p class="muted" style="font-size:.9rem;margin:0">${esc(p.d)}</p>
                  <div class="plan-rutas">
                    ${e.rutas.map(r => `<a class="chip ${r.lista ? "ok" : ""}" href="#/modulo/${r.id}">${r.lista ? ICON.check + " " : ""}${esc(MOD[r.id].corto)} · ${r.n ? r.pct + "%" : "sin práctica"}</a>`).join("")}
                    ${p.simulacro ? `<a class="chip ${e.simOk ? "ok" : ""}" href="#/simulacro">${e.simOk ? ICON.check + " Simulacro hecho" : "Simulacro pendiente"}</a>` : ""}
                  </div>
                  <p class="plan-auto">${e.auto
                    ? "Completada: llegaste a la meta en cada ruta."
                    : `<span class="tiny" style="font-weight:400">Se marca sola cuando llegues a ${META_PLAN}% en cada ruta (con al menos ${MIN_PLAN} intentos)${p.simulacro ? " y hagas un simulacro" : ""}.</span>`}</p>
                </div>
              </article>`;
            }).join("")}
          </div>
        </div>
      </section>
    `;
  }

  // Aviso para retomar una práctica o un simulacro que quedó a medias.
  function avisoSesionPendiente() {
    if (!session || session.terminado || session.entregado) return "";
    const total = session.items.length;
    const hechas = session.examen
      ? Object.values(session.respuestas).filter(r => r !== "" && r != null).length
      : Object.keys(session.revisado).length;
    const destino = session.examen ? "#/simulacro/sesion" : "#/practica/sesion";
    const nombre = session.examen ? "un simulacro" : session.modo === "diagnostico" ? "el diagnóstico" : "una práctica";
    return `<div class="callout oro" style="margin:10px 0 14px">
      <b>Tienes ${nombre} sin terminar</b>
      <p>Llevas ${hechas} de ${total}. ${session.examen ? "El cronómetro siguió corriendo." : "Tus respuestas están guardadas."}</p>
      <a class="btn btn-primary btn-sm" href="${destino}" style="margin-top:8px">Continuar ${ICON.arrow}</a>
    </div>`;
  }

  const PLAN = [
    { t: "Semana 1 · Vocabulario y congruencia", d: "Fundamentos (M1) y criterios de congruencia (M2). Empieza por leer figuras, no por fórmulas.", mods: ["M1", "M2"] },
    { t: "Semana 2 · Semejanza y transformaciones", d: "Proporciones, razón de semejanza y movimientos en el plano (M3 y M4). Son los ítems más rentables.", mods: ["M3", "M4"] },
    { t: "Semana 3 · Círculos y sólidos", d: "Ángulos en el círculo, tangentes y volumen (M5). Aquí se recuperan puntos fáciles.", mods: ["M5"] },
    { t: "Semana 4 · Álgebra y simulacro", d: "Propiedades, sistemas, matrices y probabilidad (M6). Cierra con un simulacro completo.", mods: ["M6"], simulacro: true }
  ];
  // Una semana se completa sola cuando cada ruta llega a la meta con suficientes intentos.
  const META_PLAN = 70, MIN_PLAN = 8;
  function estadoSemana(i) {
    const p = PLAN[i];
    const rutas = p.mods.map(id => { const d = dominio(id); return { id, pct: d.pct, n: d.n, lista: d.n >= MIN_PLAN && d.pct >= META_PLAN }; });
    const simOk = !p.simulacro || STATE.examenes.length > 0;
    return { rutas, simOk, auto: rutas.every(r => r.lista) && simOk };
  }

  /* ===================== Vistas: aprende ===================== */
  function vAprende() {
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Aprende</span>
          <h1 style="max-width:18ch">Seis rutas, una destreza a la vez</h1>
          <p class="lead">Cada ruta explica la idea central, muestra las fórmulas que sí se usan y resuelve un ejemplo. Al final te manda a practicar solo esa destreza.</p>

          <div class="grid grid-2" style="margin-top:34px">
            ${MODS.map(m => {
              const d = dominio(m.id);
              return `<article class="card hover" style="--c:${m.color};border-left:3px solid ${m.color}">
                <div class="card-top">
                  <div style="display:flex;gap:12px;align-items:center">
                    <span class="skill-mono" style="--c:${m.color}">${m.id.replace("M", "")}</span>
                    <div>
                      <h3 style="margin:0">${esc(m.nombre)}</h3>
                      <span class="tiny">${esc(m.indicadores.join(" · "))}</span>
                    </div>
                  </div>
                  <span class="chip">${esc(m.peso.replace("≈ ", ""))}</span>
                </div>
                <p style="margin-top:12px">${esc(m.proposito)}</p>
                <div class="skill-foot">
                  <div class="bar" style="--c:${m.color}"><i style="width:${d.pct}%"></i></div>
                  <span class="tiny">${d.n ? d.pct + "%" : "Sin práctica"}</span>
                </div>
                <div class="btn-row" style="margin-top:14px">
                  <a class="btn btn-secondary btn-sm" href="#/modulo/${m.id}">Abrir ruta ${ICON.arrow}</a>
                  <button class="btn btn-ghost btn-sm" data-action="iniciar-practica" data-mod="${m.id}">Practicar</button>
                </div>
              </article>`;
            }).join("")}
          </div>
        </div>
      </section>`;
  }

  function vModulo(id, foco) {
    const m = MOD[id];
    if (!m) return ir("#/aprende");
    const d = dominio(id);
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <p class="tiny" style="margin-bottom:18px"><a href="#/aprende">Aprende</a> / ${esc(m.nombre)}</p>
          <div class="module-head">
            <div>
              <div class="module-title">
                <span class="skill-mono" style="--c:${m.color}">${m.id.replace("M", "")}</span>
                <h1>${esc(m.nombre)}</h1>
              </div>
              <p class="lead">${esc(m.proposito)}</p>
              <div class="btn-row">
                <button class="btn btn-primary" data-action="iniciar-practica" data-mod="${m.id}">Practicar esta ruta ${ICON.arrow}</button>
                <button class="btn btn-secondary" data-action="iniciar-practica" data-mod="${m.id}" data-n="3">Prueba de 3</button>
              </div>
            </div>
            <aside class="module-side">
              <h4>Ficha de la ruta</h4>
              <ul>
                <li><strong>Indicadores:</strong> ${esc(m.indicadores.join(", "))}</li>
                <li><strong>Peso:</strong> ${esc(m.peso)}</li>
                <li><strong>Tu dominio:</strong> ${d.n ? d.pct + "% en " + d.n + " intentos" : "Aún sin práctica"}</li>
                <li><strong>Formato:</strong> selección múltiple, numérica y abierta</li>
              </ul>
              <div class="bar" style="--c:${m.color};margin-top:14px"><i style="width:${d.pct}%"></i></div>
            </aside>
          </div>

          <div class="grid grid-2" style="margin-top:40px;align-items:start">
            <div>
              <h2 style="font-size:1.4rem">Lo esencial</h2>
              ${m.ideas.map((i, k) => `<div class="idea" id="rep-i${k}"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div>`).join("")}
            </div>
            <div>
              <h2 style="font-size:1.4rem">Fórmulas y reglas</h2>
              <div class="formula-list" style="grid-template-columns:1fr">
                ${m.formulas.map((f, k) => `<div class="formula" id="rep-f${k}"><b>${esc(f.f)}</b><span>${esc(f.d)}</span></div>`).join("")}
              </div>
            </div>
          </div>

          <div style="margin-top:40px">
            <h2 style="font-size:1.4rem">Ejemplo resuelto</h2>
            <div class="worked">
              <div class="worked-head"><h3>${esc(m.ejemplo.titulo)}</h3></div>
              <div class="worked-body">
                <ol>${m.ejemplo.pasos.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
                <div class="answer">${esc(m.ejemplo.respuesta)}</div>
              </div>
            </div>
          </div>

          <div style="margin-top:40px">
            <h2 style="font-size:1.4rem">Errores que cuestan puntos</h2>
            <div class="error-grid card">
              ${m.errores.map(e => `<div class="error-item"><span class="error-x">×</span><div><b>${esc(e.e)}</b><span>${esc(e.c)}</span></div></div>`).join("")}
            </div>
          </div>

          <div class="callout" style="margin-top:32px">
            <b>Antes de seguir</b>
            <p>Explica en una frase, con tus palabras, la diferencia entre los conceptos de esta ruta. Si no puedes, vuelve a «Lo esencial» antes de practicar.</p>
          </div>
        </div>
      </section>`;
    if (foco && /^[if]\d+$/.test(foco)) {
      // render() sube al inicio después de pintar; esperamos y luego bajamos a la idea.
      setTimeout(() => {
        const el = document.getElementById("rep-" + foco);
        if (!el) return;
        el.classList.add("resaltado");
        el.scrollIntoView({ block: "center" });
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }, 60);
    }
  }

  /* ===================== Vistas: práctica ===================== */
  let selMod = "mix";
  let selN = 10;

  function vPractica() {
    const fijos = selMod === "mix" ? BANCO.length : BANCO.filter(i => i.modulo === selMod).length;
    const nVar = GEN ? GEN.claves.filter(k => selMod === "mix" || GEN.modulo(k) === selMod).length : 0;
    const disp = fijos + nVar;
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Practica</span>
          <h1>Una sesión corta, con retroalimentación</h1>
          <p class="lead">Elige una ruta o mezcla todo. Cada respuesta te explica el porqué y te dice cuál error evitar.</p>
          ${sesionAbierta() ? `<div style="max-width:560px">${avisoSesionPendiente()}</div>` : ""}

          <div class="setup" style="margin-top:32px">
            <div>
              <h3 style="font-family:var(--fuente-texto);font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--tinta-3)">1 · ¿Qué quieres practicar?</h3>
              <div class="setup-list">
                <button class="setup-item" data-action="sel-mod" data-mod="mix" aria-pressed="${selMod === "mix"}">
                  <span class="skill-mono" style="--c:#14211f">∞</span>
                  <span><b>Mezcla completa</b><span>Proporción parecida a la prueba: más geometría y álgebra.</span></span>
                  <span class="check">${ICON.check}</span>
                </button>
                ${MODS.map(m => `<button class="setup-item" data-action="sel-mod" data-mod="${m.id}" aria-pressed="${selMod === m.id}">
                  <span class="skill-mono" style="--c:${m.color}">${m.id.replace("M", "")}</span>
                  <span><b>${esc(m.nombre)}</b><span>${esc(m.indicadores.join(" · "))}</span></span>
                  <span class="check">${ICON.check}</span>
                </button>`).join("")}
              </div>
            </div>

            <aside class="card" style="position:sticky;top:88px">
              <h3>2 · Tamaño de la sesión</h3>
              <p class="tiny">Recomendado: 10 ítems, unos 15 minutos.</p>
              <div class="seg" role="group" aria-label="Cantidad de ítems" style="margin:12px 0 18px">
                ${[5, 10, 15].map(n => `<button data-action="sel-n" data-n="${n}" aria-pressed="${selN === n}">${n}</button>`).join("")}
              </div>
              <div class="callout" style="margin:0 0 18px;font-size:.88rem">
                <b>${selMod === "mix" ? "Mezcla ponderada" : esc(MOD[selMod].nombre)}</b>
                <p>${disp} ítems disponibles${nVar ? `, ${nVar} con números nuevos en cada sesión` : ""}${selN > disp ? `; se usarán ${disp}` : ""}.</p>
              </div>
              <button class="btn btn-primary" style="width:100%" data-action="iniciar-practica" data-mod="${selMod}" data-n="${selN}">Empezar sesión ${ICON.arrow}</button>
              <p class="tiny" style="margin:12px 0 0;text-align:center">Sin cronómetro. Puedes usar pistas.</p>
            </aside>
          </div>

          <div class="grid grid-3" style="margin-top:44px">
            <article class="card"><h3>Pista antes de rendirte</h3><p class="muted" style="font-size:.9rem">Cada ítem tiene una pista que orienta sin dar la respuesta. Úsala: en la prueba real también puedes descartar opciones.</p></article>
            <article class="card"><h3>Error diagnosticado</h3><p class="muted" style="font-size:.9rem">Si eliges una opción equivocada, te explicamos qué confusión la produce. Ese es el dato que sirve para estudiar.</p></article>
            <article class="card"><h3>Respuesta abierta</h3><p class="muted" style="font-size:.9rem">Los ítems de 2 puntos se autoevalúan con una rúbrica. Así entrenas la parte que más se olvida.</p></article>
          </div>
        </div>
      </section>`;
  }

  function iniciarPractica(mod, n, modo) {
    n = Number(n) || 10;
    let items;
    if (mod === "errores") {
      items = Object.keys(STATE.errores).map(id => itemPorId(id)).filter(Boolean).slice(0, 20);
      if (!items.length) { anunciar("No hay errores pendientes."); return; }
      items = barajar(items);
    } else if (mod === "mix") {
      items = muestraMezcla(n, false);
    } else {
      items = muestraModulo(mod, n);
    }
    if (!items.length) return;
    session = {
      modo: modo || "practica", items, idx: 0, respuestas: {}, revisado: {}, flags: {},
      inicio: Date.now(), examen: false, entregado: false
    };
    ir("#/practica/sesion");
  }

  function iniciarDiagnostico() {
    const items = [];
    MODS.forEach(m => items.push(...muestraModulo(m.id, 2)));
    session = { modo: "diagnostico", items: barajar(items), idx: 0, respuestas: {}, revisado: {}, flags: {}, inicio: Date.now(), examen: false, entregado: false };
    ir("#/practica/sesion");
  }

  /* ===================== Runner de práctica ===================== */
  function vRunner() {
    if (!session) return ir("#/practica");
    if (session.terminado) return vResumenPractica();
    const it = session.items[session.idx];
    const total = session.items.length;
    const rev = !!session.revisado[session.idx];
    const resp = session.respuestas[session.idx];
    const esUltima = session.idx === total - 1;
    // Cuándo vio el ítem por primera vez (para medir el tiempo de respuesta).
    session.inicios = session.inicios || {};
    if (!rev && !session.inicios[session.idx]) session.inicios[session.idx] = Date.now();

    $("#vista").innerHTML = `
      <section class="section" style="padding-top:28px">
        <div class="wrap quiz">
          <div class="quiz-head">
            <a class="btn btn-ghost btn-sm" href="#/practica">← Salir</a>
            <span class="chip">${esc(MOD[it.modulo].corto)}</span>
            <span class="tiny">Pregunta ${session.idx + 1} de ${total}</span>
            <button class="btn btn-ghost btn-sm" data-action="tts" title="Escuchar el ítem" aria-label="Escuchar el ítem">${ICON.sound}</button>
            <button class="btn btn-ghost btn-sm" data-action="flag" aria-pressed="${!!session.flags[session.idx]}" title="Marcar para repasar al final" aria-label="Marcar para repasar al final">${ICON.flag}</button>
          </div>
          <div class="progress-line" aria-hidden="true"><i style="width:${(session.idx / total) * 100}%"></i></div>

          <article class="q-card">
            <div class="q-meta">
              <span class="chip verde">${esc(it.indicador)}</span>
              <span class="chip">${it.tipo === "sm" ? "Selección múltiple" : it.tipo === "num" ? "Respuesta numérica" : "Respuesta abierta · 2 pts"}</span>
              <span class="chip">Nivel ${it.nivel}</span>
            </div>
            <div class="q-stem">${it.enunciado}</div>
            ${it.figura && FIG[it.figura] ? `<figure class="figure">${FIG[it.figura]}</figure>` : ""}
            ${it.demostracion ? tablaDemostracion(it.demostracion) : ""}
            ${interaccion(it, resp, rev)}
            <div class="actions">
              ${!rev ? `<button class="btn btn-primary" data-action="comprobar">${it.tipo === "abierta" ? "Ver rúbrica y respuesta modelo" : "Comprobar"} ${ICON.arrow}</button>
                <button class="btn btn-ghost" data-action="pista">${ICON.bulb} Ver pista</button>` : ""}
              <span class="spacer"></span>
              ${rev ? `<button class="btn btn-primary" data-action="siguiente">${esUltima ? "Ver resultados" : "Siguiente"} ${ICON.arrow}</button>` : `<button class="btn btn-ghost" data-action="saltar">Saltar</button>`}
            </div>
            <div id="zonaPista">${!rev && usoPista(session.idx) ? cajaPista(it) : ""}</div>
            ${rev ? feedback(it, resp) : ""}
          </article>

          <p class="tiny" style="margin-top:16px;text-align:center">Atajos: teclas 1–4 para elegir · Enter para comprobar o avanzar.</p>
        </div>
      </section>`;
    guardarSesion();
  }

  // Mueve el ítem de la posición i al final de la sesión. Todo lo que se guarda
  // por posición (respuesta, pista, marca…) se mueve con su ítem.
  function moverAlFinal(i) {
    const n = session.items.length;
    const orden = session.items.map((_, k) => k).filter(k => k !== i).concat(i); // orden[nueva] = vieja
    session.items = orden.map(k => session.items[k]);
    ["respuestas", "revisado", "aciertos", "flags", "pistas", "evaluados", "inicios"].forEach(clave => {
      const viejo = session[clave];
      if (!viejo) return;
      const nuevo = {};
      for (let nueva = 0; nueva < n; nueva++) if (orden[nueva] in viejo) nuevo[nueva] = viejo[orden[nueva]];
      session[clave] = nuevo;
    });
  }

  // Una opción puede ser una figura (opcionesFigura[i] = clave de CRECE_FIGURAS).
  // El texto de la opción queda para lector de pantalla, voz y revisión.
  function contenidoOpcion(it, i, o) {
    const clave = it.opcionesFigura && it.opcionesFigura[i];
    if (clave && FIG[clave]) return `<span class="choice-fig">${FIG[clave]}</span><span class="sr-only">${esc(o)}</span>`;
    return `<span>${esc(o)}</span>`;
  }

  // La idea o fórmula de la ruta que explica el ítem («i2» = idea 2, «f1» = fórmula 1).
  function repasoDe(it) {
    const m = MOD[it.modulo], r = /^([if])(\d+)$/.exec(it.repaso || "");
    if (!m || !r) return null;
    const x = (r[1] === "i" ? m.ideas : m.formulas)[Number(r[2])];
    if (!x) return null;
    return { titulo: r[1] === "i" ? x.t : x.f, texto: x.d, href: `#/modulo/${m.id}/${it.repaso}` };
  }
  function bloqueRepaso(it) {
    const r = repasoDe(it);
    if (!r) return "";
    return `<details class="repaso" open>
      <summary>Repasa la idea: <b>${esc(r.titulo)}</b></summary>
      <p>${esc(r.texto)}</p>
      <a class="btn btn-ghost btn-sm" href="${r.href}">Verla en la ruta ${esc(MOD[it.modulo].corto)} ${ICON.arrow}</a>
    </details>`;
  }

  function cajaPista(it) {
    return `<div class="callout" style="margin-bottom:0"><b>Pista</b><p>${esc(it.pista || "")}</p><p class="tiny" style="margin:6px 0 0">Si aciertas con pista, cuenta como medio acierto.</p></div>`;
  }

  // Demostración de dos columnas: el paso que se pregunta aparece con «?».
  function tablaDemostracion(d) {
    return `<div class="proof">
      <p><b>Dado:</b> ${esc(d.dado)}</p>
      <p><b>Probar:</b> ${esc(d.probar)}</p>
      <div class="proof-scroll">
        <table>
          <thead><tr><th scope="col">Paso</th><th scope="col">Afirmación</th><th scope="col">Razón</th></tr></thead>
          <tbody>
            ${d.pasos.map(([af, raz], i) => `<tr${i === d.falta ? ' class="gap"' : ""}>
              <td>${i + 1}</td><td>${esc(af)}</td>
              <td>${i === d.falta ? '<span class="proof-q" aria-label="razón que falta">?</span>' : esc(raz)}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function interaccion(it, resp, rev) {
    if (it.tipo === "sm") {
      return `<div class="choices${it.opcionesFigura ? " figs" : ""}" role="group" aria-label="Opciones de respuesta">
        ${it.opciones.map((o, i) => {
          let cl = "";
          if (rev) cl = i === it.respuesta ? "correct" : (i === Number(resp) ? "wrong" : "");
          return `<button class="choice ${cl}" data-action="elegir" data-i="${i}" aria-pressed="${Number(resp) === i}" ${rev ? "disabled" : ""}>
            <span class="key">${String.fromCharCode(65 + i)}</span>
            ${contenidoOpcion(it, i, o)}
            ${rev && i === it.respuesta ? `<span class="mark" style="color:#2f7d4f">${ICON.check}</span>` : ""}
            ${rev && i === Number(resp) && i !== it.respuesta ? `<span class="mark" style="color:#b5452f">${ICON.x}</span>` : ""}
          </button>`;
        }).join("")}
      </div>`;
    }
    if (it.tipo === "num") {
      return `<div class="num-entry">
        <label for="respNum" class="sr-only">Tu respuesta</label>
        <input id="respNum" type="text" inputmode="decimal" autocomplete="off" placeholder="Escribe el número" value="${resp == null ? "" : esc(resp)}" ${rev ? "disabled" : ""}>
        <span class="unit">${esc(it.unidad || "")}</span>
      </div>`;
    }
    return `<div style="margin-top:18px">
      <label for="respAbierta" class="tiny" style="display:block;margin-bottom:6px">Escribe tu respuesta. Incluye todas las partes que pide el ítem.</label>
      <textarea id="respAbierta" class="open" ${rev ? "disabled" : ""} placeholder="Explica tu razonamiento y escribe el resultado…">${resp == null ? "" : esc(resp)}</textarea>
      <div class="rubric"><b>Rúbrica de 2 puntos</b><ul>${(it.rubrica || []).map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>
    </div>`;
  }

  function feedback(it, resp) {
    const idx = session.idx;
    const ok = session.aciertos && session.aciertos[idx];
    const abierta = it.tipo === "abierta";
    const sinNota = abierta && (session.aciertos[idx] == null);
    return `<div class="feedback ${sinNota ? "" : ok ? "ok" : "no"}" role="status">
      <h4>${sinNota ? "Compara tu respuesta con la rúbrica" : ok ? ICON.check + (usoPista(idx) ? " Correcto, con pista" : " Correcto") : ICON.x + " Revisa esto"}</h4>
      ${ok && usoPista(idx) ? `<p class="tiny" style="margin:0 0 8px">Con pista cuenta como medio acierto en tu dominio. Intenta el próximo sin ella.</p>` : ""}
      <p>${esc(it.explicacion)}</p>
      ${!sinNota && !ok ? porQueNo(it, resp) : ""}
      ${!sinNota && (!ok || usoPista(idx)) ? bloqueRepaso(it) : ""}
      ${!sinNota ? `<button class="btn btn-ghost btn-sm" data-action="tts-exp" style="margin-top:8px">${ICON.sound} Escuchar la explicación</button>` : ""}
      ${abierta ? `<div class="why" style="margin-top:8px"><b>Respuesta modelo:</b> ${esc(it.respuestaModelo || "")}</div>` : ""}
      ${abierta && !(session.evaluados && session.evaluados[idx]) ? `<div class="actions" style="margin-top:12px">
        <span class="tiny">Autoevalúa tu respuesta:</span>
        ${[0, 1, 2].map(p => `<button class="btn btn-secondary btn-sm" data-action="autoevaluar" data-pts="${p}">${p} ${p === 1 ? "punto" : "puntos"}</button>`).join("")}
      </div>` : ""}
    </div>`;
  }

  // Diagnóstico ligado a la opción elegida. Si el ítem no tiene texto para esa
  // opción (o el estudiante saltó), se muestra el error frecuente general.
  function porQueNo(it, resp) {
    const i = resp === "" || resp == null ? NaN : Number(resp);
    const propio = it.tipo === "sm" && Number.isInteger(i) && it.distractores && it.distractores[i];
    if (propio) {
      return `<div class="why"><b>Por qué la ${String.fromCharCode(65 + i)} no funciona:</b> ${esc(propio)}</div>`;
    }
    return `<div class="why"><b>Error frecuente:</b> ${esc(it.error)}</div>`;
  }

  function respuestaLegible(it, r) {
    if (r === "" || r == null) return "en blanco";
    if (it.tipo === "sm") {
      const i = Number(r);
      return `${String.fromCharCode(65 + i)} (${esc(it.opciones[i])})`;
    }
    return esc(r) + (it.unidad ? " " + esc(it.unidad) : "");
  }

  const usoPista = idx => !!(session && session.pistas && session.pistas[idx]);
  function extraIntento(idx, opcion) {
    const t0 = session.inicios && session.inicios[idx];
    return { opcion, segundos: t0 ? (Date.now() - t0) / 1000 : null };
  }

  function comprobar() {
    const it = session.items[session.idx];
    const idx = session.idx;
    if (session.revisado[idx]) return;
    let resp = session.respuestas[idx];

    if (it.tipo === "sm") {
      if (resp == null) { anunciar("Elige una opción primero."); return; }
      const ok = Number(resp) === it.respuesta;
      session.aciertos = session.aciertos || {};
      session.aciertos[idx] = ok;
      session.revisado[idx] = true;
      registrar(it, ok, session.modo, false, usoPista(idx), extraIntento(idx, Number(resp)));
      anunciar(ok ? "Correcto." : "Incorrecto. Lee la explicación.");
      vRunner();
      return;
    }
    if (it.tipo === "num") {
      const val = normalizarNum(resp);
      if (val === "") { avisoNumero("Escribe un número primero."); return; }
      if (!Number.isFinite(leerNumero(resp))) {
        avisoNumero("No entendí ese número. Escribe solo el número, por ejemplo 9, −4, 2.5 o 1/2.");
        return;
      }
      const ok = numeroCorrecto(it, resp);
      session.aciertos = session.aciertos || {};
      session.aciertos[idx] = ok;
      session.revisado[idx] = true;
      registrar(it, ok, session.modo, false, usoPista(idx), extraIntento(idx, null));
      anunciar(ok ? "Correcto." : "Incorrecto. Revisa el procedimiento.");
      vRunner();
      return;
    }
    // abierta: revela rúbrica y modelo; la nota la pone el estudiante
    if (!String(resp || "").trim()) { anunciar("Escribe tu respuesta antes de ver el modelo."); return; }
    session.revisado[idx] = true;
    session.aciertos = session.aciertos || {};
    session.aciertos[idx] = null;
    vRunner();
  }

  // Mensaje visible (no solo para lector de pantalla) cuando el número no es válido.
  function avisoNumero(t) {
    anunciar(t);
    const z = $("#zonaPista");
    if (z) z.innerHTML = `<div class="callout coral" style="margin-bottom:0" role="alert"><b>Revisa tu respuesta</b><p>${esc(t)}</p></div>`;
  }

  function autoevaluar(pts) {
    const it = session.items[session.idx];
    const idx = session.idx;
    session.evaluados = session.evaluados || {};
    if (session.evaluados[idx]) return;
    const ok = pts >= 1;
    session.aciertos[idx] = ok;
    session.evaluados[idx] = true;
    registrar(it, ok, session.modo, false, usoPista(idx), extraIntento(idx, null));
    anunciar(`Registrado: ${pts} puntos.`);
    vRunner();
  }

  function siguiente() {
    const actual = session.items[session.idx];
    if (actual.tipo === "abierta" && (session.aciertos[session.idx] == null)) {
      anunciar("Primero autoevalúa tu respuesta con la rúbrica.");
      return;
    }
    avanzar();
  }

  function avanzar() {
    if (session.idx < session.items.length - 1) {
      session.idx++;
      vRunner();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      session.terminado = true;
      if (session.modo === "diagnostico") {
        const ok = Object.values(session.aciertos || {}).filter(Boolean).length;
        STATE.diagnostico = { fecha: hoy(), correctas: ok, total: session.items.length };
        guardar();
      }
      vResumenPractica();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function vResumenPractica() {
    const items = session.items;
    const ac = session.aciertos || {};
    const ok = Object.values(ac).filter(Boolean).length;
    // Los ítems saltados dos veces quedan sin nota: no cuentan en el total.
    const saltados = items.filter((_, i) => session.revisado[i] && ac[i] == null).length;
    const conPista = items.filter((_, i) => ac[i] && usoPista(i)).length;
    const total = items.length - saltados;
    const porMod = {};
    items.forEach((it, i) => {
      if (session.revisado[i] && ac[i] == null) return;
      porMod[it.modulo] = porMod[it.modulo] || { ok: 0, n: 0 };
      porMod[it.modulo].n++;
      if (ac[i]) porMod[it.modulo].ok++;
    });
    const fallados = items.filter((it, i) => session.revisado[i] && session.aciertos && session.aciertos[i] === false);
    const marcados = items.filter((it, i) => session.flags[i] && !fallados.includes(it));
    const diag = session.modo === "diagnostico";
    const rec = moduloRecomendado();

    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap quiz">
          <div class="result-hero">
            <span class="eyebrow">${diag ? "Diagnóstico completado" : "Sesión completada"}</span>
            <div class="result-score">${pct(ok, total)}%<small> · ${ok} de ${total}</small></div>
            ${conPista || saltados ? `<p class="tiny" style="margin:4px 0 0">${[conPista ? `${conPista} ${conPista === 1 ? "acierto" : "aciertos"} con pista` : "", saltados ? `${saltados} sin contestar (no cuentan)` : ""].filter(Boolean).join(" · ")}</p>` : ""}
            <p class="lead" style="margin-inline:auto">${mensajeResultado(pct(ok, total))}</p>
          </div>

          <div class="grid grid-2">
            <article class="card">
              <h3>Cómo te fue por ruta</h3>
              ${Object.entries(porMod).map(([mid, v]) => `
                <div class="mastery-row" style="padding:10px 0">
                  <span class="name" style="flex:1 0 120px">${esc(MOD[mid].corto)}</span>
                  <div class="bar" style="--c:${MOD[mid].color}"><i style="width:${pct(v.ok, v.n)}%"></i></div>
                  <span class="pct">${v.ok}/${v.n}</span>
                </div>`).join("")}
            </article>
            <article class="card">
              <h3>Tu siguiente paso</h3>
              <p class="muted" style="font-size:.93rem">${diag ? "Con el diagnóstico listo, empieza por la ruta con menor dominio." : "Repite los ítems fallados en 24 horas: es cuando más se fija el aprendizaje."}</p>
              <div class="callout" style="margin:12px 0 16px">
                <b>Ruta recomendada</b>
                <p>${esc(rec.nombre)} · ${dominio(rec.id).n ? dominio(rec.id).pct + "% de dominio" : "sin práctica todavía"}</p>
              </div>
              <div class="btn-row">
                <a class="btn btn-primary" href="#/modulo/${rec.id}">Estudiar ${esc(rec.corto)} ${ICON.arrow}</a>
                ${fallados.length || marcados.length ? `<button class="btn btn-secondary" data-action="repetir-fallos">Repetir fallos y marcados (${fallados.length + marcados.length})</button>` : ""}
              </div>
            </article>
          </div>

          ${fallados.length || marcados.length ? `<div class="card" style="margin-top:18px">
            <h3>Ítems para repasar</h3>
            ${fallados.concat(marcados).map(it => `<div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--linea-2)">
              <span class="chip ${marcados.includes(it) ? "oro" : "coral"}">${marcados.includes(it) ? "Marcado" : esc(it.indicador)}</span>
              <span style="flex:1;font-size:.9rem">${textoPlano(it.enunciado).slice(0, 110)}…</span>
              <a class="btn btn-ghost btn-sm" href="${repasoDe(it) ? repasoDe(it).href : "#/modulo/" + it.modulo}">${repasoDe(it) ? "Repasar la idea" : "Ver ruta"}</a>
            </div>`).join("")}
          </div>` : ""}

          <div class="btn-row" style="justify-content:center;margin-top:28px">
            <button class="btn btn-primary" data-action="iniciar-practica" data-mod="mix" data-n="10">Otra sesión de 10</button>
            <a class="btn btn-secondary" href="#/progreso">Ver mi progreso</a>
          </div>
        </div>
      </section>`;
    guardarSesion();
  }

  // Nivel CRECE aproximado. El DEPR no publica los puntos de corte, así que
  // estos umbrales son una referencia para orientar al estudiante, no oficiales.
  const NIVELES = [
    { min: 85, nombre: "Sobresaliente", clase: "verde", meta: null },
    { min: 65, nombre: "Proficiente", clase: "verde", meta: 85 },
    { min: 40, nombre: "Aprendiz", clase: "oro", meta: 65 },
    { min: 0, nombre: "Principiante", clase: "coral", meta: 40 }
  ];
  function nivelAprox(p) { return NIVELES.find(n => p >= n.min); }
  function bloqueNivel(p, total) {
    const n = nivelAprox(p);
    const sig = n.meta == null ? null : NIVELES.find(x => x.min === n.meta);
    const faltan = sig ? Math.max(1, Math.ceil(total * n.meta / 100 - total * p / 100)) : 0;
    return `<div class="nivel">
      <span class="chip ${n.clase}">Nivel aproximado: ${n.nombre}</span>
      <p class="tiny" style="margin:8px auto 0;max-width:52ch">${sig
        ? `Para llegar a <b>${sig.nombre}</b> te faltan unas ${faltan} respuestas correctas de ${total}.`
        : "Estás en el nivel más alto. Mantén la práctica para no perderlo."}
        Es una estimación para orientarte: el DEPR no publica los puntos de corte oficiales.</p>
    </div>`;
  }

  function mensajeResultado(p) {
    if (p >= 90) return "Dominio alto. Sube la dificultad y haz un simulacro completo.";
    if (p >= 70) return "Vas bien. Revisa los fallos: casi siempre son de lectura de figura o de vocabulario.";
    if (p >= 50) return "Hay base, pero falta precisión. Repite la ruta más débil antes de avanzar.";
    return "Empieza por lo esencial: vocabulario, figuras y un ejemplo resuelto. No acumules ítems sin entender.";
  }

  /* ===================== Simulacro ===================== */
  function vSimulacro() {
    const mejor = mejorExamen();
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Simulacro</span>
          <h1>25 ítems. 55 minutos. Sin pistas.</h1>
          <p class="lead">La distribución imita la prueba: más geometría, algo de álgebra y un bloque corto de datos. Al final ves tu puntaje por ruta y puedes revisar cada respuesta.</p>

          <div class="grid grid-2" style="margin-top:32px">
            <article class="card">
              <h3>Reglas de la sala</h3>
              <ul class="muted" style="font-size:.93rem;padding-left:20px">
                <li>No hay retroalimentación hasta entregar.</li>
                <li>Puedes marcar ítems y volver con el mapa.</li>
                <li>El cronómetro corre aunque cambies de pestaña.</li>
                <li>Al llegar a 00:00 se entrega automáticamente.</li>
              </ul>
              <div class="callout oro" style="margin-top:18px"><b>Consejo</b><p>No dejes la respuesta abierta para el final: en el simulacro no se incluye, pero en la prueba real sí vale 2 puntos.</p></div>
            </article>
            <article class="card" style="display:flex;flex-direction:column;justify-content:center">
              <div class="stat" style="border:0;padding:0 0 12px">
                <b style="font-size:2.4rem">${mejor == null ? "—" : mejor + "%"}</b>
                <span>${STATE.examenes.length ? "Tu mejor simulacro (" + STATE.examenes.length + " realizados)" : "Aún no has hecho un simulacro"}</span>
                ${mejor == null ? "" : `<span class="chip ${nivelAprox(mejor).clase}" style="margin-top:8px;align-self:flex-start">Nivel aproximado: ${nivelAprox(mejor).nombre}</span>`}
              </div>
              ${session && session.examen && !session.entregado
                ? `<button class="btn btn-primary btn-lg" data-action="continuar-examen">Continuar simulacro ${ICON.arrow}</button>
                   <p class="tiny" style="margin:12px 0 0">Tienes un simulacro en curso. El cronómetro sigue corriendo.</p>`
                : `<button class="btn btn-primary btn-lg" data-action="iniciar-examen">Comenzar simulacro ${ICON.arrow}</button>
                   <p class="tiny" style="margin:12px 0 0">25 ítems · 55 minutos · guarda tu resultado</p>`}
            </article>
          </div>

          <div class="grid grid-3" style="margin-top:28px">
            <div class="card"><h3>71% geometría</h3><p class="muted" style="font-size:.9rem">Cinco de las seis rutas son geométricas. El simulacro respeta ese peso.</p></div>
            <div class="card"><h3>Lectura de figuras</h3><p class="muted" style="font-size:.9rem">La mitad de los ítems trae una figura o una tabla de demostración.</p></div>
            <div class="card"><h3>Revisión guiada</h3><p class="muted" style="font-size:.9rem">Cada error te lleva a la explicación y a la ruta que lo cubre.</p></div>
          </div>
        </div>
      </section>`;
  }

  function iniciarExamen() {
    session = {
      modo: "examen", examen: true, items: muestraMezcla(25, true), idx: 0,
      respuestas: {}, revisado: {}, flags: {}, inicio: Date.now(),
      limite: 55 * 60, entregado: false, aciertos: {}
    };
    ir("#/simulacro/sesion");
  }

  function vExamen() {
    if (!session || !session.examen) return ir("#/simulacro");
    if (session.entregado) return ir("#/simulacro/resultado");
    const it = session.items[session.idx];
    const total = session.items.length;
    const resp = session.respuestas[session.idx];
    const restante = Math.max(0, Math.round((session.inicio + session.limite * 1000 - Date.now()) / 1000));

    $("#vista").innerHTML = `
      <div class="exam-bar">
        <div class="wrap exam-bar-inner">
          <span class="chip coral">Simulacro</span>
          <span class="tiny">${session.idx + 1} / ${total}</span>
          <div class="bar"><i style="width:${((session.idx + 1) / total) * 100}%"></i></div>
          <span class="timer" id="reloj">${formatearTiempo(restante)}</span>
          <button class="btn btn-secondary btn-sm" data-action="entregar">Entregar</button>
        </div>
      </div>
      <section class="section" style="padding-top:8px">
        <div class="wrap quiz">
          <article class="q-card">
            <div class="q-meta">
              <span class="chip">Pregunta ${session.idx + 1}</span>
              <span class="chip">${esc(it.indicador)}</span>
              <span class="chip">Nivel ${it.nivel}</span>
            </div>
            <div class="q-stem">${it.enunciado}</div>
            ${it.figura && FIG[it.figura] ? `<figure class="figure">${FIG[it.figura]}</figure>` : ""}
            ${it.demostracion ? tablaDemostracion(it.demostracion) : ""}
            ${it.tipo === "sm" ? `<div class="choices${it.opcionesFigura ? " figs" : ""}" role="group" aria-label="Opciones de respuesta">
                ${it.opciones.map((o, i) => `<button class="choice" data-action="elegir" data-i="${i}" aria-pressed="${Number(resp) === i}">
                  <span class="key">${String.fromCharCode(65 + i)}</span>${contenidoOpcion(it, i, o)}
                </button>`).join("")}
              </div>`
            : `<div class="num-entry">
                <label for="respNum" class="sr-only">Tu respuesta</label>
                <input id="respNum" type="text" inputmode="decimal" autocomplete="off" placeholder="Escribe el número" value="${resp == null ? "" : esc(resp)}">
                <span class="unit">${esc(it.unidad || "")}</span>
              </div>`}
            <div class="actions">
              <button class="btn btn-secondary btn-sm" data-action="prev" ${session.idx === 0 ? "disabled" : ""}>← Anterior</button>
              <button class="btn btn-ghost btn-sm" data-action="flag" aria-pressed="${!!session.flags[session.idx]}">${ICON.flag} ${session.flags[session.idx] ? "Marcado" : "Marcar"}</button>
              <span class="spacer"></span>
              ${session.idx < total - 1
                ? `<button class="btn btn-primary btn-sm" data-action="next-exam">Siguiente ${ICON.arrow}</button>`
                : `<button class="btn btn-coral btn-sm" data-action="entregar">Entregar ahora</button>`}
            </div>
          </article>

          <div class="card" style="margin-top:18px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
              <h3 style="margin:0;font-size:1rem">Mapa de preguntas</h3>
              <span class="tiny">Verde: contestada · Borde dorado: marcada</span>
            </div>
            <div class="qmap">
              ${session.items.map((_, i) => `<button data-action="ir-q" data-i="${i}" class="${i === session.idx ? "current" : ""} ${session.respuestas[i] != null ? "answered" : ""} ${session.flags[i] ? "flagged" : ""}" aria-label="Ir a la pregunta ${i + 1}">${i + 1}</button>`).join("")}
            </div>
          </div>
        </div>
      </section>`;
    guardarSesion();
    iniciarReloj();
  }

  function iniciarReloj() {
    detenerReloj();
    const pintar = () => {
      if (!session || !session.examen || session.entregado) return;
      const restante = Math.max(0, Math.round((session.inicio + session.limite * 1000 - Date.now()) / 1000));
      const el = $("#reloj");
      if (el) {
        el.textContent = formatearTiempo(restante);
        if (restante <= 300) el.classList.add("low");
      }
      if (restante <= 0) { entregarExamen(true); }
    };
    pintar();
    temporizador = setInterval(pintar, 1000);
  }
  function detenerReloj() { if (temporizador) { clearInterval(temporizador); temporizador = null; } }

  function entregarExamen(auto) {
    if (!session || session.entregado) return;
    const contestadas = Object.values(session.respuestas).filter(r => r !== "" && r != null).length;
    if (!auto && contestadas < session.items.length) {
      if (!confirm(`Quedan ${session.items.length - contestadas} preguntas sin contestar. ¿Entregar de todas formas?`)) return;
    }
    detenerReloj();
    session.entregado = true;
    let ok = 0;
    const detalle = session.items.map((it, i) => {
      const r = session.respuestas[i];
      const bueno = it.tipo === "num"
        ? numeroCorrecto(it, r)
        : (r !== "" && r != null && Number(r) === it.respuesta);
      if (bueno) ok++;
      const opcion = it.tipo === "sm" && r !== "" && r != null ? Number(r) : null;
      registrar(it, bueno, "examen", true, false, { opcion, segundos: null });
      return { id: it.id, ok: bueno, resp: r };
    });
    const minutos = Math.max(1, Math.round((Date.now() - session.inicio) / 60000));
    if (NUBE.usuario()) {
      NUBE.encolarExamen({
        correctas: ok, total: session.items.length, minutos: Math.min(minutos, 9999),
        detalle: detalle.map(d => ({ id: String(d.id).slice(0, 60), ok: d.ok, resp: d.resp == null ? null : String(d.resp).slice(0, 40) })),
        fecha_local: hoy()
      });
    }
    STATE.examenes.push({ fecha: new Date().toISOString(), correctas: ok, total: session.items.length, minutos });
    if (STATE.examenes.length > 20) STATE.examenes = STATE.examenes.slice(-20);
    STATE.ultimoExamen = { fecha: new Date().toISOString(), correctas: ok, total: session.items.length, minutos, detalle };
    guardar();
    borrarSesion();
    anunciar(`Simulacro entregado: ${ok} de ${session.items.length}.`);
    ir("#/simulacro/resultado");
  }

  function vResultadoExamen() {
    const r = STATE.ultimoExamen;
    if (!r) return ir("#/simulacro");
    const porMod = {};
    r.detalle.forEach(d => {
      const it = itemPorId(d.id);
      if (!it) return;
      porMod[it.modulo] = porMod[it.modulo] || { ok: 0, n: 0 };
      porMod[it.modulo].n++;
      if (d.ok) porMod[it.modulo].ok++;
    });
    const fallos = r.detalle.filter(d => !d.ok).map(d => itemPorId(d.id)).filter(Boolean);

    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap quiz">
          <div class="result-hero">
            <span class="eyebrow">Resultado del simulacro</span>
            <div class="result-score">${pct(r.correctas, r.total)}%<small> · ${r.correctas} de ${r.total}</small></div>
            ${bloqueNivel(pct(r.correctas, r.total), r.total)}
            <p class="lead" style="margin-inline:auto">Tiempo: ${r.minutos} min · ${new Date(r.fecha).toLocaleDateString("es-PR", { day: "numeric", month: "long" })}</p>
          </div>

          <div class="grid grid-2">
            <article class="card">
              <h3>Puntaje por ruta</h3>
              ${Object.entries(porMod).map(([mid, v]) => `
                <div class="mastery-row" style="padding:10px 0">
                  <span class="name" style="flex:1 0 120px">${esc(MOD[mid].corto)}</span>
                  <div class="bar" style="--c:${MOD[mid].color}"><i style="width:${pct(v.ok, v.n)}%"></i></div>
                  <span class="pct">${v.ok}/${v.n}</span>
                </div>`).join("")}
            </article>
            <article class="card">
              <h3>Lectura del resultado</h3>
              <p class="muted" style="font-size:.93rem">${mensajeResultado(pct(r.correctas, r.total))}</p>
              <div class="callout"><b>Regla de estudio</b><p>Revisa los fallos hoy y vuelve a intentarlos mañana. Cuando aciertas un ítem tantas veces como lo fallaste, sale del cuaderno de errores.</p></div>
              <div class="btn-row">
                ${fallos.length ? `<button class="btn btn-primary" data-action="repetir-fallos" data-origen="examen">Repasar ${fallos.length} fallos</button>` : ""}
                <a class="btn btn-secondary" href="#/progreso">Ver progreso</a>
              </div>
            </article>
          </div>

          <div class="card" style="margin-top:18px">
            <h3>Revisión rápida</h3>
            ${r.detalle.map((d, i) => {
              const it = itemPorId(d.id); if (!it) return "";
              return `<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--linea-2)">
                <span class="skill-mono" style="--c:${d.ok ? "#2f7d4f" : "#b5452f"};width:28px;height:28px;font-size:.8rem">${d.ok ? "✓" : "×"}</span>
                <div style="flex:1">
                  <div class="tiny" style="margin-bottom:2px">${i + 1} · ${esc(it.indicador)} · ${esc(MOD[it.modulo].corto)}</div>
                  <div style="font-size:.9rem">${textoPlano(it.enunciado).slice(0, 130)}…</div>
                  ${!d.ok ? `<div class="tiny" style="margin-top:4px;color:var(--tinta-2)">
                    <b>Tu respuesta:</b> ${respuestaLegible(it, d.resp)} · <b>Correcta:</b> ${respuestaLegible(it, it.respuesta)}<br>
                    <b>Por qué:</b> ${esc(it.explicacion)}
                    ${repasoDe(it) ? `<br><b>Repasa:</b> <a href="${repasoDe(it).href}">${esc(repasoDe(it).titulo)}</a> (${esc(MOD[it.modulo].corto)})` : ""}
                    ${it.tipo === "sm" && it.distractores && it.distractores[Number(d.resp)] && d.resp !== "" && d.resp != null ? `<br><b>Tu opción:</b> ${esc(it.distractores[Number(d.resp)])}` : ""}
                  </div>` : ""}
                </div>
              </div>`;
            }).join("")}
          </div>
        </div>
      </section>`;
  }

  /* ===================== Progreso ===================== */
  function vProgreso() {
    const g = precisionGlobal();
    const errores = Object.keys(STATE.errores).map(id => itemPorId(id)).filter(Boolean);
    const recientes = STATE.intentos.slice(-10).reverse();

    if (!STATE.intentos.length) {
      $("#vista").innerHTML = `<section class="section"><div class="wrap quiz">
        <span class="eyebrow">Progreso</span><h1>Todavía no hay datos</h1>
        <p class="lead">Haz una sesión corta y aquí aparecerá tu dominio por ruta, tu racha y el cuaderno de errores.</p>
        <div class="btn-row"><a class="btn btn-primary" href="#/practica">Empezar una sesión</a><button class="btn btn-secondary" data-action="iniciar-diagnostico">Hacer el diagnóstico</button></div>
        ${tarjetaCuenta()}
      </div></section>`;
      return;
    }

    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Progreso</span>
          <h1>Lo que ya dominas y lo que falta</h1>
          <p class="lead">${NUBE.usuario()
            ? "Este panel se guarda en tu cuenta de la escuela. Si cambias de equipo, entra con tu código y lo encuentras igual."
            : "Este panel se guarda en tu navegador. Si cambias de equipo, exporta el archivo y vuelve a importarlo."}</p>

          <div class="stat-strip" style="margin-top:28px">
            <div class="stat"><b>${g.pct}%</b><span>Precisión global</span></div>
            <div class="stat"><b>${STATE.intentos.length}</b><span>Ítems resueltos</span></div>
            <div class="stat"><b>${racha()}</b><span>Días seguidos</span></div>
            <div class="stat"><b>${errores.length}</b><span>Errores pendientes</span></div>
          </div>

          <div class="grid grid-2" style="margin-top:28px;align-items:start">
            <article class="card">
              <h3>Dominio por ruta</h3>
              <p class="tiny">Basado en tus últimos 40 intentos por ruta.</p>
              ${MODS.map(m => { const d = dominio(m.id); return `<div class="mastery-row">
                <span class="name">${esc(m.corto)}</span>
                <div class="bar" style="--c:${m.color}"><i style="width:${d.pct}%"></i></div>
                <span class="pct">${d.n ? d.pct + "%" : "—"}</span>
              </div>`; }).join("")}
            </article>

            <article class="card">
              <h3>Cuaderno de errores</h3>
              ${errores.length ? `
                <p class="tiny">Cada acierto le resta una vez; el ítem sale del cuaderno cuando lo aciertas tantas veces como lo fallaste.</p>
                ${errores.slice(0, 6).map(it => `<div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-top:1px solid var(--linea-2)">
                  <span class="chip coral">${esc(it.indicador)}</span>
                  <span style="flex:1;font-size:.86rem">${textoPlano(it.enunciado).slice(0, 80)}…</span>
                  <span class="tiny">${STATE.errores[it.id].veces}×</span>
                </div>`).join("")}
                <button class="btn btn-primary btn-sm" style="margin-top:14px" data-action="repetir-errores">Practicar estos errores</button>
              ` : `<div class="empty">${ICON.check}<p style="margin:0">Sin errores pendientes. Buen trabajo.</p></div>`}
            </article>
          </div>

          <article class="card" style="margin-top:18px">
            <h3>Actividad reciente</h3>
            <table class="history">
              <thead><tr><th>Ítem</th><th>Ruta</th><th>Resultado</th><th>Fecha</th></tr></thead>
              <tbody>
                ${recientes.map(i => {
                  const it = itemPorId(i.id);
                  return `<tr>
                    <td>${it ? esc(it.indicador) : esc(i.id)}</td>
                    <td>${it ? esc(MOD[it.modulo].corto) : "—"}</td>
                    <td><span class="chip ${i.ok ? "verde" : "coral"}">${i.ok ? "Correcto" : "Falló"}</span></td>
                    <td class="tiny">${esc(i.fecha)}</td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </article>

          ${NUBE.usuario() ? tarjetaCuenta() : `
          <article class="card" style="margin-top:18px">
            <h3>Tus datos</h3>
            <p class="tiny">Todo se guarda solo en este navegador. Exporta antes de limpiar el equipo o cambiar de dispositivo.</p>
            <div class="btn-row">
              <button class="btn btn-secondary btn-sm" data-action="exportar">Exportar progreso</button>
              <label class="btn btn-secondary btn-sm" style="cursor:pointer">Importar progreso
                <input type="file" accept="application/json" id="archivoImport" style="display:none">
              </label>
              <button class="btn btn-ghost btn-sm" data-action="reset" style="color:var(--coral)">${ICON.trash} Borrar todo</button>
            </div>
          </article>`}
        </div>
      </section>`;
  }

  /* ===================== Herramientas ===================== */
  const GLOSARIO = [
    ["Ángulo central", "Ángulo con vértice en el centro del círculo; mide igual que su arco."],
    ["Ángulo inscrito", "Ángulo con vértice en la circunferencia; mide la mitad de su arco."],
    ["Ángulo exterior", "Ángulo con vértice fuera del círculo; mide la mitad de la diferencia de los arcos."],
    ["Bisectriz", "Recta o rayo que divide un ángulo en dos ángulos congruentes."],
    ["Circuncentro", "Punto donde se cortan las mediatrices; centro del círculo circunscrito."],
    ["Congruente", "Misma forma y mismo tamaño."],
    ["Contraejemplo", "Caso que cumple la hipótesis y hace falsa la conclusión de una proposición."],
    ["Correspondencia", "Relación entre vértices, lados o ángulos de figuras semejantes o congruentes."],
    ["CPCTC", "Partes correspondientes de triángulos congruentes son congruentes."],
    ["Escalar", "Número que multiplica cada entrada de una matriz."],
    ["Incentro", "Punto donde se cortan las bisectrices; centro del círculo inscrito."],
    ["Mediatriz", "Recta perpendicular a un segmento por su punto medio."],
    ["Polígono", "Figura cerrada formada por segmentos que no se cruzan."],
    ["Postulado", "Afirmación que se acepta como verdadera sin demostración."],
    ["Prueba", "Cadena de afirmaciones justificadas que lleva a una conclusión."],
    ["Razón de semejanza", "Cociente entre un lado de la imagen y su correspondiente en la figura original."],
    ["Semejante", "Misma forma; los lados correspondientes son proporcionales y los ángulos congruentes."],
    ["Tangente", "Recta que toca la circunferencia en un solo punto y es perpendicular al radio."],
    ["Teorema", "Afirmación que se demuestra a partir de definiciones, postulados y teoremas previos."],
    ["Transformación rígida", "Traslación, rotación o reflexión: conserva distancias y ángulos."],
    ["Traslación", "Movimiento de todos los puntos por el mismo vector."],
    ["Valor esperado", "Promedio ponderado de los valores de una variable aleatoria."]
  ];

  function vHerramientas() {
    $("#vista").innerHTML = `
      <section class="section">
        <div class="wrap">
          <span class="eyebrow">Herramientas</span>
          <h1>Lo que puedes usar mientras practicas</h1>
          <p class="lead">Calculadora, hoja de fórmulas, glosario y una guía para moverte en TestNav sin perder tiempo.</p>

          <div class="tabs" role="tablist" style="margin-top:26px">
            ${[["calc", "Calculadora"], ["formulas", "Fórmulas"], ["glosario", "Glosario"], ["testnav", "TestNav"]].map(([k, t]) => `
              <button class="tab" role="tab" data-action="tab" data-tab="${k}" aria-selected="${tabActiva === k}">${t}</button>`).join("")}
          </div>
          <div id="panelHerramienta">${panelHerramienta()}</div>
        </div>
      </section>`;
  }

  function panelHerramienta() {
    if (tabActiva === "calc") {
      return `<div class="grid grid-2" style="align-items:start">
        <div class="calc" role="group" aria-label="Calculadora">
          <div class="calc-display" id="calcDisplay"><small>&nbsp;</small><div id="calcValor">0</div></div>
          <div class="calc-keys">
            ${[["C", "op"], ["⌫", "op"], ["(", "op"], [")", "op"],
               ["7", ""], ["8", ""], ["9", ""], ["÷", "op"],
               ["4", ""], ["5", ""], ["6", ""], ["×", "op"],
               ["1", ""], ["2", ""], ["3", ""], ["−", "op"],
               ["0", ""], [".", ""], ["π", "op"], ["+", "op"],
               ["√(", "op"], ["x²", "op"], ["=", "eq wide"]]
              .map(([k, c]) => `<button class="${c}" data-action="calc" data-k="${esc(k)}" ${k === "=" ? 'aria-label="Calcular"' : ""}>${k}</button>`).join("")}
          </div>
        </div>
        <div class="card">
          <h3>Para qué sirve (y para qué no)</h3>
          <p class="muted" style="font-size:.92rem">La calculadora ayuda con aritmética, pero no elige el método ni lee la figura. En la prueba CRECE, verifica si tu acomodo permite calculadora antes de depender de ella.</p>
          <div class="callout"><b>Consejo de examen</b><p>Escribe la expresión completa antes de calcular. Así puedes revisar si el error fue de planteamiento o de tecla.</p></div>
          <p class="tiny">Acepta +, −, ×, ÷, paréntesis, π, raíz cuadrada y cuadrado. Usa punto decimal.</p>
        </div>
      </div>`;
    }
    if (tabActiva === "formulas") {
      return `<div class="grid grid-2" style="align-items:start">
        ${MODS.map(m => `<article class="card">
          <h3 style="color:${m.color}">${esc(m.nombre)}</h3>
          <div class="formula-list" style="grid-template-columns:1fr">
            ${m.formulas.map(f => `<div class="formula"><b>${esc(f.f)}</b><span>${esc(f.d)}</span></div>`).join("")}
          </div>
        </article>`).join("")}
      </div>`;
    }
    if (tabActiva === "glosario") {
      return `<input class="search" id="buscarGlosario" type="search" placeholder="Buscar un término…" aria-label="Buscar en el glosario">
        <div class="glossary" id="listaGlosario">
          ${GLOSARIO.map(([t, d]) => `<div class="gloss"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}
        </div>`;
    }
    return `<div class="grid grid-2" style="align-items:start">
      <article class="card">
        <h3>Navegación</h3>
        <ul class="muted" style="font-size:.93rem;padding-left:20px">
          <li><b>Anterior / Siguiente:</b> cambia de ítem sin perder la respuesta.</li>
          <li><b>Repasar:</b> abre el mapa de preguntas y marca las que dejaste en blanco.</li>
          <li><b>Marcador:</b> pone una bandera para volver después.</li>
          <li><b>Enviar:</b> cierra la sección. Confirma antes de aceptar.</li>
        </ul>
      </article>
      <article class="card">
        <h3>Herramientas del estudiante</h3>
        <ul class="muted" style="font-size:.93rem;padding-left:20px">
          <li><b>Audio:</b> el botón de audio lee el ítem en voz alta.</li>
          <li><b>Contraste y zoom:</b> en el menú de usuario, sin cambiar la respuesta.</li>
          <li><b>Editor de ecuaciones:</b> para fracciones, exponentes y raíces.</li>
          <li><b>Calculadora:</b> solo si el acomodo de tu escuela lo permite.</li>
        </ul>
      </article>
      <article class="card">
        <h3>Rutina de 60 segundos por ítem</h3>
        <ol class="muted" style="font-size:.93rem;padding-left:20px">
          <li>Lee la última línea: ¿qué te piden?</li>
          <li>Subraya los datos y las unidades.</li>
          <li>Mira la figura: ¿qué está marcado?</li>
          <li>Descarta dos opciones antes de calcular.</li>
          <li>Si te trabas, marca y sigue. Vuelve al final.</li>
        </ol>
      </article>
      <article class="card">
        <h3>Antes de entregar</h3>
        <ul class="muted" style="font-size:.93rem;padding-left:20px">
          <li>¿Contestaste todas las partes de las preguntas abiertas?</li>
          <li>¿Revisaste las que marcaste?</li>
          <li>¿Las respuestas numéricas tienen el signo y las unidades correctas?</li>
        </ul>
        <div class="callout coral" style="margin-bottom:0"><b>Ojo</b><p>Una respuesta abierta de 2 puntos puede valer 1 si contestas solo la mitad. Lee los verbos: clasifica, calcula, justifica, explica.</p></div>
      </article>
    </div>`;
  }

  /* ===================== Calculadora ===================== */
  function evaluarExpresion(exp) {
    let s = String(exp).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, "(" + Math.PI + ")").replace(/√/g, "sqrt").replace(/\s+/g, "");
    let i = 0;
    const peek = () => s[i];
    function expr() {
      let v = term();
      while (peek() === "+" || peek() === "-") { const op = s[i++]; const r = term(); v = op === "+" ? v + r : v - r; }
      return v;
    }
    // Multiplicación implícita: 2π, 3(4), (2)(3), 2√(9) se leen como productos.
    const empiezaFactor = () => peek() === "(" || /[0-9.]/.test(peek() || "") || s.slice(i, i + 4) === "sqrt";
    function term() {
      let v = power();
      for (;;) {
        if (peek() === "*" || peek() === "/") { const op = s[i++]; const r = power(); v = op === "*" ? v * r : v / r; }
        else if (empiezaFactor()) v *= power();
        else break;
      }
      return v;
    }
    function power() {
      const base = factor();
      if (peek() === "^") { i++; return Math.pow(base, power()); }
      return base;
    }
    function factor() {
      if (peek() === "-") { i++; return -factor(); }
      if (peek() === "+") { i++; return factor(); }
      if (peek() === "(") { i++; const v = expr(); if (peek() === ")") i++; return v; }
      if (s.slice(i, i + 4) === "sqrt") { i += 4; return Math.sqrt(factor()); }
      const start = i;
      while (i < s.length && /[0-9.]/.test(s[i])) i++;
      if (start === i) throw new Error("expresión incompleta");
      return parseFloat(s.slice(start, i));
    }
    const v = expr();
    if (i < s.length) throw new Error("expresión incompleta");
    if (!Number.isFinite(v)) throw new Error("resultado no válido");
    return v;
  }

  function calcPulsar(k) {
    if (k === "C") { calcExpr = ""; pintarCalc(""); return; }
    if (k === "⌫") { calcExpr = calcExpr.slice(0, -1); pintarCalc(calcExpr); return; }
    if (k === "=") {
      try {
        const v = evaluarExpresion(calcExpr);
        const bonito = Math.abs(v - Math.round(v)) < 1e-10 ? String(Math.round(v)) : String(Math.round(v * 1e6) / 1e6);
        pintarCalc(calcExpr, bonito);
        calcExpr = bonito;
      } catch (e) { pintarCalc(calcExpr, "Error"); }
      return;
    }
    if (k === "x²") { calcExpr += "^2"; }
    else calcExpr += k;
    pintarCalc(calcExpr);
  }
  function pintarCalc(exp, resultado) {
    const v = $("#calcValor"), s = $("#calcDisplay small");
    if (v) v.textContent = resultado != null ? resultado : (exp || "0");
    if (s) s.textContent = resultado != null ? exp + " =" : " ";
  }

  /* ===================== Acciones ===================== */
  function textoPlano(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  }

  // Las voces suelen saltar o leer raro los símbolos; se dicen en palabras.
  function paraVoz(t) {
    return String(t)
      .replace(/\s*∥\s*/g, " es paralela a ")
      .replace(/\s*⊥\s*/g, " es perpendicular a ")
      .replace(/\s*≅\s*/g, " es congruente con ")
      .replace(/\s*~\s*/g, " es semejante a ")
      .replace(/(tri[aá]ngulos?)\s*Δ/gi, "$1 ")
      .replace(/Δ/g, "triángulo ")
      .replace(/∠/g, "ángulo ");
  }

  function decir(texto) {
    if (!("speechSynthesis" in window)) { anunciar("Tu navegador no tiene lectura en voz alta."); return false; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(paraVoz(texto));
    u.lang = "es-PR";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
    return true;
  }
  function hablarExplicacion() {
    if (!session) return;
    const it = session.items[session.idx], resp = session.respuestas[session.idx];
    const ok = session.aciertos && session.aciertos[session.idx];
    const i = resp === "" || resp == null ? NaN : Number(resp);
    const propio = !ok && it.tipo === "sm" && Number.isInteger(i) && it.distractores && it.distractores[i];
    const r = !ok ? repasoDe(it) : null;
    const partes = [ok ? "Correcto." : "Revisa esto.", it.explicacion];
    if (propio) partes.push(`Por qué la ${String.fromCharCode(65 + i)} no funciona: ${propio}`);
    else if (!ok && it.tipo !== "abierta") partes.push(`Error frecuente: ${it.error}`);
    if (r) partes.push(`Repasa la idea ${r.titulo}: ${r.texto}`);
    if (decir(textoPlano(partes.join(" ")))) anunciar("Leyendo la explicación en voz alta.");
  }

  function hablar() {
    if (!("speechSynthesis" in window) || !session) { anunciar("Tu navegador no tiene lectura en voz alta."); return; }
    const it = session.items[session.idx];
    if (!it) return;
    window.speechSynthesis.cancel();
    const d = it.demostracion;
    const prueba = d ? ` Dado: ${d.dado}. Probar: ${d.probar}. ` + d.pasos.map(([af, raz], i) =>
      `Paso ${i + 1}: ${af}. Razón: ${i === d.falta ? "la que falta" : raz}.`).join(" ") : "";
    const u = new SpeechSynthesisUtterance(paraVoz(textoPlano(it.enunciado) + "." + prueba + " " + (it.opciones ? it.opciones.map((o, i) => `${String.fromCharCode(65 + i)}: ${o}`).join(". ") : "")));
    u.lang = "es-PR";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
    anunciar("Leyendo el ítem en voz alta.");
  }

  function exportar() {
    const data = JSON.stringify(STATE, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crece10-progreso-${hoy()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    anunciar("Progreso exportado.");
  }

  function importar(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const s = JSON.parse(fr.result);
        if (!s || !Array.isArray(s.intentos)) throw new Error("formato");
        STATE = Object.assign(estadoInicial(), s);
        STATE.ajustes = Object.assign({ letra: false, contraste: false }, s.ajustes);
        guardar(); aplicarAjustes(); render();
        anunciar("Progreso importado.");
      } catch (e) { alert("El archivo no tiene el formato de progreso de CRECE 10."); }
    };
    fr.readAsText(file);
  }

  function aplicarAjustes() {
    document.body.classList.toggle("letra-grande", !!STATE.ajustes.letra);
    document.body.classList.toggle("alto-contraste", !!STATE.ajustes.contraste);
    const bl = $("#btnLetra"), bc = $("#btnContraste");
    if (bl) bl.setAttribute("aria-pressed", String(!!STATE.ajustes.letra));
    if (bc) bc.setAttribute("aria-pressed", String(!!STATE.ajustes.contraste));
  }

  function cerrarMenu() {
    const n = $("#nav"), b = $("#btnMenu");
    if (n) n.classList.remove("open");
    if (b) b.setAttribute("aria-expanded", "false");
  }

  /* ===================== Eventos ===================== */
  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;

    if (a === "sel-mod") { selMod = el.dataset.mod; vPractica(); return; }
    if (a === "sel-n") { selN = Number(el.dataset.n); vPractica(); return; }
    if (a === "iniciar-practica") { iniciarPractica(el.dataset.mod || "mix", el.dataset.n || 10); return; }
    if (a === "iniciar-diagnostico") { iniciarDiagnostico(); return; }
    if (a === "iniciar-corta") { iniciarPractica(el.dataset.mod || "mix", 8); return; }
    if (a === "iniciar-examen") { iniciarExamen(); return; }
    if (a === "continuar-examen") { ir("#/simulacro/sesion"); return; }

    if (a === "elegir") {
      if (!session || session.revisado[session.idx]) return;
      session.respuestas[session.idx] = Number(el.dataset.i);
      if (session.examen) {
        $$(".choice").forEach(c => c.setAttribute("aria-pressed", String(c === el)));
        $$(".qmap button")[session.idx] && $$(".qmap button")[session.idx].classList.add("answered");
        guardarSesion();
      } else {
        vRunner();
      }
      return;
    }
    if (a === "comprobar") { comprobar(); return; }
    if (a === "autoevaluar") { autoevaluar(Number(el.dataset.pts)); return; }
    if (a === "siguiente") { siguiente(); return; }
    if (a === "saltar") {
      // Saltar no cuenta como error. La primera vez, el ítem pasa al final de la
      // sesión para volver a él; la segunda, queda sin contestar y sin nota.
      const it = session.items[session.idx];
      session.saltos = session.saltos || {};
      session.pistas = session.pistas || {};
      const quedanOtros = session.items.slice(session.idx + 1).length > 0;
      if (!session.saltos[it.id] && quedanOtros) {
        session.saltos[it.id] = 1;
        moverAlFinal(session.idx);
        anunciar("Lo dejamos para el final de la sesión.");
        vRunner();
      } else {
        session.saltos[it.id] = 2;
        session.revisado[session.idx] = true;
        session.aciertos = session.aciertos || {};
        session.aciertos[session.idx] = null;
        avanzar();
      }
      return;
    }
    if (a === "pista") {
      session.pistas = session.pistas || {};
      session.pistas[session.idx] = true;
      guardarSesion();
      const z = $("#zonaPista");
      if (z) z.innerHTML = cajaPista(session.items[session.idx]);
      return;
    }
    if (a === "tts") { hablar(); return; }
    if (a === "tts-exp") { hablarExplicacion(); return; }
    if (a === "flag") {
      if (!session) return;
      session.flags[session.idx] = !session.flags[session.idx];
      if (session.examen) vExamen(); else vRunner();
      return;
    }
    if (a === "prev") { if (session.idx > 0) { session.idx--; vExamen(); window.scrollTo({ top: 0 }); } return; }
    if (a === "next-exam") { if (session.idx < session.items.length - 1) { session.idx++; vExamen(); window.scrollTo({ top: 0 }); } return; }
    if (a === "ir-q") { session.idx = Number(el.dataset.i); vExamen(); window.scrollTo({ top: 0 }); return; }
    if (a === "entregar") { entregarExamen(false); return; }

    if (a === "repetir-fallos") {
      // Tras un simulacro, los fallos están en STATE.ultimoExamen (la sesión del
      // examen no usa «revisado»). Así funciona también después de recargar.
      const deExamen = el.dataset.origen === "examen" || !session || session.examen;
      const malos = deExamen
        ? (STATE.ultimoExamen ? STATE.ultimoExamen.detalle.filter(d => !d.ok).map(d => itemPorId(d.id)).filter(Boolean) : [])
        : session.items.filter((it, i) => (session.revisado[i] && session.aciertos && session.aciertos[i] === false) || session.flags[i]);
      if (!malos.length) { anunciar("No hay fallos para repasar."); return; }
      session = { modo: "repaso", items: barajar(malos), idx: 0, respuestas: {}, revisado: {}, flags: {}, inicio: Date.now(), examen: false, entregado: false };
      ir("#/practica/sesion");
      return;
    }
    if (a === "repetir-errores") {
      const items = Object.keys(STATE.errores).map(id => itemPorId(id)).filter(Boolean);
      if (!items.length) return;
      session = { modo: "repaso", items: barajar(items), idx: 0, respuestas: {}, revisado: {}, flags: {}, inicio: Date.now(), examen: false, entregado: false };
      ir("#/practica/sesion");
      return;
    }
    if (a === "tab") { tabActiva = el.dataset.tab; vHerramientas(); return; }
    if (a === "calc") { calcPulsar(el.dataset.k); return; }
    if (a === "exportar") { exportar(); return; }
    if (a === "salir") { salirCuenta(); return; }
    if (a === "enviar-ahora") { NUBE.enviar(); return; }
    if (a === "reclamar-legado") { reclamarLegado(); return; }
    if (a === "ignorar-legado") { ignorarLegado(); return; }
    if (a === "reset") {
      if (confirm("¿Borrar todo el progreso guardado en este navegador? Esta acción no se puede deshacer.")) {
        STATE = estadoInicial(); guardar(); session = null; borrarSesion(); aplicarAjustes(); ir("#/inicio");
      }
      return;
    }
    if (a === "plan") {
      const i = Number(el.dataset.i);
      if (estadoSemana(i).auto) return;
      STATE.plan[i] = !STATE.plan[i];
      guardar();
      vInicio();
      return;
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "archivoImport" && e.target.files[0]) importar(e.target.files[0]);
  });

  document.addEventListener("input", function (e) {
    if (session && (e.target.id === "respNum" || e.target.id === "respAbierta")) {
      session.respuestas[session.idx] = e.target.value;
      guardarSesion();
    }
    if (e.target.id === "buscarGlosario") {
      const q = e.target.value.toLowerCase().trim();
      $$("#listaGlosario .gloss").forEach(g => {
        g.style.display = g.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!session || (e.target.matches("input, textarea, select"))) return;
    if (e.key === "Enter") {
      if (session.examen) { if (session.idx < session.items.length - 1) { session.idx++; vExamen(); } }
      else if (session.revisado[session.idx]) siguiente();
      else comprobar();
      return;
    }
    if (!session.examen && !session.revisado[session.idx]) {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) {
        const it = session.items[session.idx];
        if (it.tipo === "sm" && n <= it.opciones.length) { session.respuestas[session.idx] = n - 1; vRunner(); }
      }
    }
  });

  // El símbolo de paralelas (∥) se ve diminuto con la letra del sistema.
  // En vez de tocar cada ítem, se envuelve al pintarse: <span class="par">∥</span>.
  // Se omiten las figuras SVG (un <span> no es válido ahí) y los campos de texto.
  const PAR = "∥";
  function marcarParalelas(raiz) {
    if (!raiz || !raiz.ownerDocument) return;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (n.nodeValue.indexOf(PAR) === -1) return NodeFilter.FILTER_REJECT;
        const p = n.parentNode;
        if (!p || (p.classList && p.classList.contains("par"))) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("svg, textarea, script, style, option")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodos = [];
    while (w.nextNode()) nodos.push(w.currentNode);
    nodos.forEach(n => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(PAR).forEach((trozo, i) => {
        if (i) {
          const s = document.createElement("span");
          s.className = "par";
          s.textContent = PAR;
          frag.appendChild(s);
        }
        if (trozo) frag.appendChild(document.createTextNode(trozo));
      });
      n.parentNode.replaceChild(frag, n);
    });
  }
  function vigilarParalelas() {
    const v = $("#vista");
    if (!v || !("MutationObserver" in window)) return;
    marcarParalelas(v);
    new MutationObserver(cambios => {
      cambios.forEach(c => c.addedNodes.forEach(n => {
        if (n.nodeType === 1) marcarParalelas(n);
        else if (n.nodeType === 3 && n.parentNode) marcarParalelas(n.parentNode);
      }));
    }).observe(v, { childList: true, subtree: true });
  }

  document.addEventListener("submit", e => {
    if (e.target && e.target.id === "formEntrar") { e.preventDefault(); enviarEntrada(); }
  });

  // Cuando cambia el estado de la sincronización, se repinta el indicador.
  NUBE.alCambiar(() => {
    pintarCuenta();
    const card = $(".cuenta-card");
    if (card && NUBE.usuario()) card.outerHTML = tarjetaCuenta();
  });

  window.addEventListener("hashchange", render);

  document.addEventListener("DOMContentLoaded", function () {
    const btnLetra = $("#btnLetra"), btnContraste = $("#btnContraste"), btnMenu = $("#btnMenu");
    if (btnLetra) btnLetra.addEventListener("click", () => {
      STATE.ajustes.letra = !STATE.ajustes.letra; guardar(); aplicarAjustes();
      anunciar(STATE.ajustes.letra ? "Letra grande activada." : "Letra normal.");
    });
    if (btnContraste) btnContraste.addEventListener("click", () => {
      STATE.ajustes.contraste = !STATE.ajustes.contraste; guardar(); aplicarAjustes();
      anunciar(STATE.ajustes.contraste ? "Alto contraste activado." : "Contraste normal.");
    });
    if (btnMenu) btnMenu.addEventListener("click", () => {
      const n = $("#nav"); const open = n.classList.toggle("open");
      btnMenu.setAttribute("aria-expanded", String(open));
    });
    aplicarAjustes();
    vigilarParalelas();
    const nota = $("#notaGuardado");
    if (nota && NUBE.activa) nota.textContent = "Tu progreso se guarda en tu cuenta de la escuela y en este equipo.";
    session = necesitaEntrar() ? null : restaurarSesion();
    if (session && session.examen && !session.entregado &&
        Date.now() >= session.inicio + session.limite * 1000) {
      // El tiempo se acabó mientras la página estaba cerrada: se entrega lo que hubo.
      entregarExamen(true);
      return;
    }
    if (!location.hash) location.hash = "#/inicio";
    render();
  });
})();
