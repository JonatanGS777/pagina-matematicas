/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* Guía imprimible (v1.8): portada, hoja de fórmulas, 20 ítems y clave.
   Se arma con los mismos datos de la app (datos/modulos.js, datos/banco-items.js
   y assets/figuras.js), así que siempre coincide con el banco. Funciona en el
   sitio publicado y desde la memoria USB (file://), sin cuenta.

   Versiones: «#v=A» (o sin #) es la Versión A, fija y curada. «#v=<número>» arma
   20 ítems con ese número como semilla: la misma versión sale igual en cualquier
   equipo, así que la clave impresa le corresponde. */
(function () {
  "use strict";

  const MODS = window.CRECE_MODULOS || [];
  const BANCO = window.CRECE_BANCO || [];
  const FIG = window.CRECE_FIGURAS || {};
  const MOD = Object.fromEntries(MODS.map(m => [m.id, m]));
  const $ = s => document.querySelector(s);

  // Reparto de la prueba (M6 ≈ 21 %; geometría el resto). Suma 20.
  const CUOTAS = { M1: 2, M2: 4, M3: 3, M4: 3, M5: 4, M6: 4 };
  // Versión A: cubre las destrezas de cada ruta, mezcla niveles e incluye figuras,
  // una demostración, opciones que son figuras y una respuesta numérica.
  const VERSION_A = [
    "M1-03", "M1-08",
    "M2-15", "M2-20", "M2-16", "M2-09",
    "M3-02", "M3-05", "M3-14",
    "M4-02", "M4-12", "M4-14",
    "M5-06", "M5-12", "M5-13", "M5-15",
    "M6-01", "M6-04", "M6-06", "M6-09"
  ];
  const LETRAS = "ABCDEFG";
  const SITIO = "digitalmathematics.org/crece10";

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const par = html => String(html).replace(/∥/g, '<span class="par">∥</span>');
  const textoPlano = html => { const d = document.createElement("div"); d.innerHTML = html; return (d.textContent || "").replace(/\s+/g, " ").trim(); };

  function prng(seed) { // mulberry32, igual que en las plantillas
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // «A» o un número entre 2 y 99999.
  function versionActual() {
    const m = /(?:^|[#&])v=(\d{1,5}|A)\b/i.exec(location.hash);
    if (!m || /^a$/i.test(m[1])) return "A";
    const v = Number(m[1]);
    return v >= 2 && v <= 99999 ? v : "A";
  }

  const usable = it => it && !MOD[it.modulo]?.base && it.tipo !== "abierta" && CUOTAS[it.modulo];

  function seleccion(version) {
    let items;
    if (version === "A") {
      items = VERSION_A.map(id => BANCO.find(i => i.id === id)).filter(usable);
    } else {
      const r = prng(version * 2654435761);
      items = [];
      Object.keys(CUOTAS).forEach(mod => {
        const pool = BANCO.filter(i => i.modulo === mod && usable(i));
        for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
        items.push(...pool.slice(0, CUOTAS[mod]));
      });
    }
    // Por ruta, en el orden del curso, y de menor a mayor nivel dentro de cada ruta.
    const orden = Object.keys(CUOTAS);
    return items.slice().sort((a, b) => orden.indexOf(a.modulo) - orden.indexOf(b.modulo) || a.nivel - b.nivel || BANCO.indexOf(a) - BANCO.indexOf(b));
  }

  const nombreVersion = v => v === "A" ? "Versión A" : `Versión ${v}`;

  function repasoDe(it) {
    const m = MOD[it.modulo], k = /^([if])(\d+)$/.exec(it.repaso || "");
    if (!m || !k) return "";
    const x = (k[1] === "i" ? m.ideas : m.formulas)[Number(k[2])];
    return x ? `${k[1] === "i" ? x.t : x.f} (${m.corto || m.nombre})` : "";
  }

  /* ---------- Partes de la guía ---------- */
  function portada(v) {
    return `<section class="hoja portada">
      <div class="portada-cab">
        <div>
          <span class="eyebrow">CRECE 10 · Matemáticas</span>
          <h1>Guía de práctica para la prueba CRECE</h1>
          <p class="lead">Décimo grado · hoja de fórmulas y 20 ítems</p>
        </div>
        <div class="sello">${esc(nombreVersion(v))}</div>
      </div>
      <div class="campos">
        <div class="campo"><span>Nombre</span><i></i></div>
        <div class="campo corto"><span>Grupo</span><i></i></div>
        <div class="campo corto"><span>Fecha</span><i></i></div>
      </div>
      <h2>Cómo usar esta guía</h2>
      <ol class="pasos-guia">
        <li>Repasa la <b>hoja de fórmulas</b>. Puedes tenerla al lado mientras contestas.</li>
        <li>Contesta los <b>20 ítems</b>. Rellena la burbuja de la opción que escojas y haz tus cálculos en el espacio de cada ítem. En los de respuesta numérica, escribe el número en la línea.</li>
        <li>Corrige con la <b>clave</b> (o entrégasela a tu maestro). En cada ítem que falles, lee la explicación y repasa la idea que indica.</li>
        <li>Practica más en <b>${SITIO}</b> con tu código y tu PIN.</li>
      </ol>
      <div class="reparto">
        ${Object.keys(CUOTAS).map(id => `<span><b>${CUOTAS[id]}</b> ${esc(MOD[id] ? MOD[id].corto || MOD[id].nombre : id)}</span>`).join("")}
      </div>
      <div class="puntaje"><span>Puntaje</span><b>______ de 20</b></div>
      <p class="tiny derechos">© 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10. Todos los derechos reservados. Recurso de práctica: no es un examen oficial ni está afiliado al DEPR, a Pearson ni a TestNav.</p>
    </section>`;
  }

  function hojaFormulas() {
    const rutas = MODS.filter(m => !m.base).concat(MODS.filter(m => m.base));
    return `<section class="hoja formulas-hoja">
      <h2>Hoja de fórmulas</h2>
      <div class="formulas-cols">
        ${rutas.map(m => `<article class="f-ruta">
          <h3>${esc(m.base ? "Base: lo que se da por sabido" : m.nombre)}</h3>
          <dl>${(m.formulas || []).map(f => `<dt>${par(esc(f.f))}</dt><dd>${par(esc(f.d))}</dd>`).join("")}</dl>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function demostracion(d) {
    return `<div class="proof">
      <p><b>Dado:</b> ${par(esc(d.dado))}</p>
      <p><b>Probar:</b> ${par(esc(d.probar))}</p>
      <table>
        <thead><tr><th scope="col">Paso</th><th scope="col">Afirmación</th><th scope="col">Razón</th></tr></thead>
        <tbody>${d.pasos.map(([af, raz], i) => `<tr${i === d.falta ? ' class="gap"' : ""}><td>${i + 1}</td><td>${par(esc(af))}</td><td>${i === d.falta ? "<b>?</b>" : par(esc(raz))}</td></tr>`).join("")}</tbody>
      </table>
    </div>`;
  }

  function item(it, n) {
    const m = MOD[it.modulo];
    let resp = "";
    if (it.tipo === "sm") {
      const figs = Array.isArray(it.opcionesFigura) && it.opcionesFigura.every(k => FIG[k]);
      resp = `<ol class="opciones${figs ? " figs" : ""}">${it.opciones.map((o, k) => `<li><span class="burbuja">${LETRAS[k]}</span>${figs ? `<span class="op-fig">${FIG[it.opcionesFigura[k]]}</span><span class="sr-only">${par(o)}</span>` : `<span>${par(o)}</span>`}</li>`).join("")}</ol>`;
    } else {
      resp = `<p class="linea-resp">Respuesta: <i></i> ${esc(it.unidad || "")}</p>`;
    }
    return `<article class="g-item${it.figura ? " con-figura" : ""}">
      <div class="g-item-cab"><span class="g-num">${n}</span><span class="g-ruta">${esc(m ? m.corto || m.nombre : it.modulo)} · ${esc(it.indicador)}</span></div>
      <div class="g-cuerpo">
        <div class="g-texto">
          <div class="g-enun">${par(it.enunciado)}</div>
          ${it.demostracion ? demostracion(it.demostracion) : ""}
          ${resp}
        </div>
        ${it.figura && FIG[it.figura] ? `<figure class="g-fig">${FIG[it.figura]}</figure>` : ""}
      </div>
      <div class="g-espacio" aria-hidden="true"></div>
    </article>`;
  }

  function respuestaCorta(it) {
    if (it.tipo === "sm") return `${LETRAS[it.respuesta]}. ${esc(textoPlano(it.opciones[it.respuesta]))}`;
    return `${esc(String(it.respuesta).replace("-", "−"))}${it.unidad ? (it.unidad === "°" ? "" : " ") + esc(it.unidad) : ""}`;
  }

  function clave(items, v) {
    return `<section class="hoja clave-hoja">
      <div class="clave-cab"><h2>Clave de respuestas</h2><span class="sello">${esc(nombreVersion(v))}</span></div>
      <p class="tiny">Solo sirve para la ${esc(nombreVersion(v))}. Por cada ítem: la respuesta, por qué y la idea que conviene repasar si lo fallaste.</p>
      <ol class="clave-lista">${items.map(it => `<li>
        <p class="clave-resp"><b>${respuestaCorta(it)}</b></p>
        <p class="clave-exp">${par(it.explicacion)}</p>
        ${repasoDe(it) ? `<p class="clave-rep">Repasa: ${esc(repasoDe(it))}</p>` : ""}
      </li>`).join("")}</ol>
      <p class="tiny derechos">© 2026 Dr. Yonatan Guerrero · CRECE 10 · ${SITIO}</p>
    </section>`;
  }

  function render() {
    const v = versionActual();
    const items = seleccion(v);
    $("#guia").innerHTML = portada(v) + hojaFormulas()
      + `<section class="hoja items-hoja"><h2>Ítems <span class="tiny">${esc(nombreVersion(v))}</span></h2>${items.map((it, k) => item(it, k + 1)).join("")}</section>`
      + clave(items, v);
    $("#guiaVersionTxt").textContent = `${nombreVersion(v)} · ${items.length} ítems`;
    document.title = `Guía imprimible · ${nombreVersion(v)} · CRECE 10`;
    document.body.classList.toggle("sin-clave", !$("#conClave").checked);
  }

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    if (a === "imprimir") { window.print(); return; }
    if (a === "otra") {
      const actual = versionActual();
      let v;
      do { v = 2 + Math.floor(Math.random() * 99998); } while (v === actual);
      location.hash = "v=" + v;
      return;
    }
    if (a === "version-a") { location.hash = "v=A"; return; }
  });
  document.addEventListener("change", e => {
    if (e.target && e.target.id === "conClave") document.body.classList.toggle("sin-clave", !e.target.checked);
  });
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });

  // Para pruebas y para el panel: qué ítems lleva cada versión.
  window.CRECE_GUIA = { seleccion: v => seleccion(v).map(i => i.id), cuotas: CUOTAS, versionA: VERSION_A.slice() };
  render();
})();
