/*!
 * CRECE 10 · Matemáticas — conexión con la cuenta de la escuela (Supabase)
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 *
 * Sin dependencias: habla con la API de Supabase con fetch.
 *
 * Principio: el equipo es la fuente inmediata y la nube es la copia.
 * - Cada respuesta se guarda primero en localStorage y entra a una cola.
 * - La cola se envía por lotes cuando hay conexión. Cada fila lleva un
 *   cliente_id, así que reenviar nunca duplica.
 * - Si se cae el internet, el estudiante sigue practicando; la cola espera.
 *
 * Solo se activa si existe window.CRECE_NUBE_CONFIG y la página se sirve por
 * http(s). Abierta con doble clic (file://) la app funciona como antes, sin
 * cuentas.
 */
(function () {
  "use strict";

  const CFG = window.CRECE_NUBE_CONFIG || null;
  const activa = !!(CFG && CFG.url && CFG.clave && CFG.activa !== false && /^https?:$/.test(location.protocol));

  const K_SESION = "crece10:nube";
  const kCola = id => "crece10:cola:" + id;
  const LOTE = 200;

  const leer = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const quitar = k => { try { localStorage.removeItem(k); } catch (e) { /* nada */ } };

  const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));

  // «10b 7», «10B-7», «10b07» → «10B-07». Devuelve "" si no tiene forma de código.
  function normalizarCodigo(s) {
    const t = String(s || "").toUpperCase().replace(/[^A-Z0-9\s-]/g, "").trim();
    const m = t.match(/^([A-Z0-9]{1,6}?)[\s-]*(\d{1,3})$/) ;
    if (!m || !/[A-Z]/.test(m[1]) && !/[\s-]/.test(t)) return "";
    return `${m[1]}-${m[2].padStart(2, "0")}`;
  }
  const correoDe = codigo => `${codigo.toLowerCase()}@${(CFG && CFG.dominio) || "crece10.digitalmathematics.org"}`;

  /* ───────────── Sesión ───────────── */
  let sesion = activa ? leer(K_SESION, null) : null;
  const usuario = () => (sesion && sesion.id ? {
    id: sesion.id, codigo: sesion.codigo, nombre: sesion.nombre, grupo: sesion.grupo
  } : null);

  // Estado visible: "ok" | "enviando" | "pendiente" | "sinconexion" | "expirada" | "desactivada"
  let estado = "ok";
  const oyentes = [];
  function fijarEstado(e) {
    if (estado === e) return;
    estado = e;
    oyentes.forEach(fn => { try { fn(e); } catch (x) { /* nada */ } });
  }

  async function llamar(ruta, opciones) {
    const r = await fetch(CFG.url + ruta, Object.assign({}, opciones, {
      headers: Object.assign({ apikey: CFG.clave, "Content-Type": "application/json" }, (opciones || {}).headers)
    }));
    let cuerpo = null;
    const txt = await r.text();
    try { cuerpo = txt ? JSON.parse(txt) : null; } catch (e) { cuerpo = txt; }
    return { status: r.status, ok: r.ok, cuerpo };
  }

  function guardarSesionNube(tok, extra) {
    sesion = Object.assign({}, sesion, extra, {
      access: tok.access_token,
      refresh: tok.refresh_token,
      exp: Date.now() + (Number(tok.expires_in) || 3600) * 1000
    });
    escribir(K_SESION, sesion);
  }

  let renovando = null;
  // Devuelve un token válido. Lanza "sinconexion" o "expirada".
  async function token() {
    if (!sesion) throw new Error("expirada");
    if (sesion.exp - Date.now() > 60000) return sesion.access;
    if (!renovando) {
      renovando = (async () => {
        let r;
        try {
          r = await llamar("/auth/v1/token?grant_type=refresh_token", {
            method: "POST", body: JSON.stringify({ refresh_token: sesion.refresh })
          });
        } catch (e) { throw new Error("sinconexion"); }
        if (!r.ok) {
          const msg = JSON.stringify(r.cuerpo || "");
          throw new Error(/banned/i.test(msg) ? "desactivada" : "expirada");
        }
        guardarSesionNube(r.cuerpo);
        return sesion.access;
      })().finally(() => { renovando = null; });
    }
    return renovando;
  }

  async function api(ruta, opciones) {
    const t = await token();
    let r;
    try {
      r = await llamar(ruta, Object.assign({}, opciones, {
        headers: Object.assign({ Authorization: "Bearer " + t }, (opciones || {}).headers)
      }));
    } catch (e) { throw new Error("sinconexion"); }
    if (r.status === 401) throw new Error("expirada");
    return r;
  }

  async function entrar(codigoEscrito, pin) {
    if (!activa) return { ok: false, error: "inactiva" };
    const codigo = normalizarCodigo(codigoEscrito);
    if (!codigo) return { ok: false, error: "codigo" };
    if (!/^\d{6}$/.test(String(pin || ""))) return { ok: false, error: "pin" };
    let r;
    try {
      r = await llamar("/auth/v1/token?grant_type=password", {
        method: "POST", body: JSON.stringify({ email: correoDe(codigo), password: String(pin) })
      });
    } catch (e) { return { ok: false, error: "sinconexion" }; }
    if (r.status === 429) return { ok: false, error: "espera" };
    if (!r.ok) {
      const msg = JSON.stringify(r.cuerpo || "");
      return { ok: false, error: /banned/i.test(msg) ? "desactivada" : "credenciales" };
    }
    const tok = r.cuerpo;
    const uid = tok.user && tok.user.id;
    sesion = null;
    guardarSesionNube(tok, { id: uid });
    let p;
    try {
      // Desde v1.2 hay dos relaciones entre perfiles y grupos (grupo_id y crece_grupos.creado_por):
      // hay que nombrar la llave, o PostgREST responde 300 (PGRST201) y nadie puede entrar.
      p = await api(`/rest/v1/crece_perfiles?select=codigo,nombre,rol,activo,crece_grupos!crece_perfiles_grupo_id_fkey(nombre)&id=eq.${uid}`, { method: "GET" });
    } catch (e) { sesion = null; quitar(K_SESION); return { ok: false, error: "sinconexion" }; }
    const perfil = p.ok && Array.isArray(p.cuerpo) ? p.cuerpo[0] : null;
    if (!perfil || perfil.rol !== "estudiante" || !perfil.activo) {
      sesion = null; quitar(K_SESION);
      return { ok: false, error: perfil && !perfil.activo ? "desactivada" : "perfil" };
    }
    guardarSesionNube(tok, {
      id: uid, codigo: perfil.codigo, nombre: perfil.nombre,
      grupo: perfil.crece_grupos ? perfil.crece_grupos.nombre : ""
    });
    fijarEstado("ok");
    return { ok: true, usuario: usuario() };
  }

  // Cierra la sesión en este equipo. La cola NO se borra: se envía la próxima
  // vez que ese estudiante entre.
  async function salir() {
    if (!sesion) return;
    try { await Promise.race([enviar(), new Promise(r => setTimeout(r, 5000))]); } catch (e) { /* nada */ }
    const acc = sesion.access;
    sesion = null;
    quitar(K_SESION);
    try {
      await llamar("/auth/v1/logout", { method: "POST", headers: { Authorization: "Bearer " + acc } });
    } catch (e) { /* sin conexión: el token vence solo */ }
  }

  /* ───────────── Cola ───────────── */
  const cola = () => (sesion ? leer(kCola(sesion.id), []) : []);
  const pendientes = () => cola().filter(x => x.t !== "s").length;

  function encolar(t, fila) {
    if (!sesion) return;
    const c = cola();
    if (t === "s") {
      // Solo hace falta el último estado: se reemplaza el anterior.
      const i = c.findIndex(x => x.t === "s");
      if (i >= 0) c.splice(i, 1);
    }
    c.push({ t, f: fila });
    if (!escribir(kCola(sesion.id), c)) {
      // Almacenamiento lleno: se descarta el estado (se puede reconstruir) y se reintenta.
      escribir(kCola(sesion.id), c.filter(x => x.t !== "s"));
    }
    if (t !== "s" && estado === "ok") fijarEstado("pendiente");
    programar(t === "s" ? 8000 : 1500);
  }

  const encolarIntento = f => encolar("i", Object.assign({ cliente_id: uuid() }, f));
  const encolarExamen = f => encolar("e", Object.assign({ cliente_id: uuid() }, f));
  const guardarEstado = datos => encolar("s", { datos, actualizado: new Date().toISOString() });

  // Quita de la cola las filas ya enviadas (la cola pudo crecer mientras tanto).
  function sacar(enviadas) {
    const ids = new Set(enviadas.map(x => x.f.cliente_id || "s:" + x.f.actualizado));
    escribir(kCola(sesion.id), cola().filter(x => !ids.has(x.f.cliente_id || "s:" + x.f.actualizado)));
  }

  async function subirLote(tabla, filas) {
    const r = await api(`/rest/v1/${tabla}?on_conflict=cliente_id`, {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(filas.map(x => x.f))
    });
    if (r.ok) return filas;
    if (r.status === 403) throw new Error("desactivada");
    if (r.status === 400 || r.status === 409 || r.status === 422) {
      // Una fila inválida no puede bloquear la cola: se prueba una por una
      // y se descarta solo la que el servidor rechaza.
      if (filas.length === 1) { console.warn("CRECE: fila descartada", r.cuerpo, filas[0].f); return filas; }
      const hechas = [];
      for (const x of filas) hechas.push(...await subirLote(tabla, [x]));
      return hechas;
    }
    throw new Error("servidor");
  }

  let enviandoAhora = null;
  async function enviar() {
    if (!sesion) return;
    if (enviandoAhora) return enviandoAhora;
    enviandoAhora = (async () => {
      if (navigator.onLine === false) { fijarEstado("sinconexion"); return; }
      fijarEstado("enviando");
      try {
        for (const [t, tabla] of [["i", "crece_intentos"], ["e", "crece_examenes"]]) {
          for (;;) {
            const lote = cola().filter(x => x.t === t).slice(0, LOTE);
            if (!lote.length) break;
            sacar(await subirLote(tabla, lote));
          }
        }
        const s = cola().find(x => x.t === "s");
        if (s) {
          const r = await api("/rest/v1/crece_estado?on_conflict=estudiante_id", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify(s.f)
          });
          if (r.ok) sacar([s]);
          else if (r.status === 403) throw new Error("desactivada");
        }
        fijarEstado(pendientes() ? "pendiente" : "ok");
      } catch (e) {
        const m = e && e.message;
        fijarEstado(m === "sinconexion" || m === "expirada" || m === "desactivada" ? m : "pendiente");
      }
    })().finally(() => { enviandoAhora = null; });
    return enviandoAhora;
  }

  let reloj = null;
  function programar(ms) {
    clearTimeout(reloj);
    reloj = setTimeout(() => { enviar(); }, ms);
  }

  // Estado guardado en la nube (para un equipo nuevo).
  async function traerEstado() {
    const r = await api("/rest/v1/crece_estado?select=datos,actualizado", { method: "GET" });
    return r.ok && Array.isArray(r.cuerpo) && r.cuerpo[0] ? r.cuerpo[0] : null;
  }

  if (activa) {
    window.addEventListener("online", () => enviar());
    window.addEventListener("offline", () => fijarEstado("sinconexion"));
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") enviar(); });
    setInterval(() => { if (sesion && cola().length) enviar(); }, 45000);
    if (sesion) setTimeout(() => enviar(), 800);
  }

  window.CRECE_NUBE = {
    activa,
    usuario,
    sufijo: () => (sesion && sesion.id ? ":" + sesion.id : ""),
    entrar, salir, enviar, traerEstado,
    encolarIntento, encolarExamen, guardarEstado,
    pendientes,
    estado: () => estado,
    alCambiar: fn => oyentes.push(fn),
    normalizarCodigo
  };
})();
