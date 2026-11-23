/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* Figuras SVG originales para el banco de práctica.
   Todas se dibujan con viewBox 0 0 400 300 y escalan sin pérdida. */

window.CRECE_FIGURAS = (function () {
  "use strict";

  const T = 'stroke="#14211f" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const TXT = 'font-family="system-ui,sans-serif" font-size="14" fill="#14211f"';
  const AC = 'stroke="#0e6b63" stroke-width="2" fill="none"';

  function wrap(inner, cap) {
    return `<svg viewBox="0 0 400 300" role="img" aria-label="${cap}">${inner}</svg>`;
  }

  function grid(step, cx, cy, w, h) {
    let out = "";
    for (let x = cx; x <= w; x += step) out += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#e6ddcd" stroke-width="1"/>`;
    for (let x = cx - step; x >= 0; x -= step) out += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#e6ddcd" stroke-width="1"/>`;
    for (let y = cy; y <= h; y += step) out += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#e6ddcd" stroke-width="1"/>`;
    for (let y = cy - step; y >= 0; y -= step) out += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#e6ddcd" stroke-width="1"/>`;
    out += `<line x1="0" y1="${cy}" x2="${w}" y2="${cy}" stroke="#8b9a96" stroke-width="1.5"/>`;
    out += `<line x1="${cx}" y1="0" x2="${cx}" y2="${h}" stroke="#8b9a96" stroke-width="1.5"/>`;
    out += `<text x="${w - 12}" y="${cy - 8}" ${TXT} font-style="italic">x</text>`;
    out += `<text x="${cx + 8}" y="16" ${TXT} font-style="italic">y</text>`;
    return out;
  }

  function poly(points, opts) {
    const p = points.map(([x, y]) => `${x},${y}`).join(" ");
    return `<polygon points="${p}" ${opts || T}/>`;
  }

  /* ---------- Marcas de congruencia ---------- */
  const COL = ["#c2412d", "#0e6b63", "#9a6b00"];
  const r1 = v => Math.round(v * 10) / 10;
  // n tics perpendiculares en el punto medio del segmento
  function tics(x1, y1, x2, y2, n, color) {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    let out = "";
    for (let k = 0; k < n; k++) {
      const o = (k - (n - 1) / 2) * 5;
      const cx = mx + ux * o, cy = my + uy * o;
      out += `<line x1="${r1(cx - uy * 6)}" y1="${r1(cy + ux * 6)}" x2="${r1(cx + uy * 6)}" y2="${r1(cy - ux * 6)}" stroke="${color}" stroke-width="2.4"/>`;
    }
    return out;
  }
  // n arcos en el vértice V, entre los lados que van a A y a B
  function arcos(V, A, B, n, color, radio) {
    const u = [A[0] - V[0], A[1] - V[1]], w = [B[0] - V[0], B[1] - V[1]];
    const lu = Math.hypot(...u), lw = Math.hypot(...w);
    const sweep = u[0] * w[1] - u[1] * w[0] > 0 ? 1 : 0;
    let out = "";
    for (let k = 0; k < n; k++) {
      const r = (radio || 14) + k * 5;
      const s = [V[0] + u[0] / lu * r, V[1] + u[1] / lu * r], e = [V[0] + w[0] / lw * r, V[1] + w[1] / lw * r];
      out += `<path d="M${r1(s[0])} ${r1(s[1])} A${r} ${r} 0 0 ${sweep} ${r1(e[0])} ${r1(e[1])}" fill="none" stroke="${color}" stroke-width="2"/>`;
    }
    return out;
  }
  // Triángulo con marcas. lados[i] = n tics del lado P[i]–P[i+1]; angulos[i] = n arcos en P[i].
  function triMarcado(P, lados, angulos, radio) {
    let out = poly(P);
    Object.keys(lados || {}).forEach(i => {
      i = Number(i);
      const a = P[i], b = P[(i + 1) % 3];
      out += tics(a[0], a[1], b[0], b[1], lados[i], COL[(lados[i] - 1) % 3]);
    });
    Object.keys(angulos || {}).forEach(i => {
      i = Number(i);
      out += arcos(P[i], P[(i + 1) % 3], P[(i + 2) % 3], angulos[i], COL[(angulos[i] - 1) % 3], radio);
    });
    return out;
  }
  const desplazar = (P, dx, dy) => P.map(([x, y]) => [x + dx, y + dy]);
  // Figura pequeña para usarla como opción de respuesta
  function mini(inner, cap) {
    return `<svg viewBox="0 0 200 140" role="img" aria-label="${cap}">${inner}</svg>`;
  }
  const T1 = [[12, 122], [52, 28], [90, 122]];
  const T1s = [[112, 122], [140, 56], [166.6, 122]]; // T1 a escala 0.7 (semejante, más pequeño)

  const figs = {
    triangulosTics: wrap(`
      <polygon points="40,240 120,80 200,240" ${T}/>
      <polygon points="220,240 300,80 380,240" ${T}/>
      <!-- tics: lado 1 -->
      <line x1="78" y1="158" x2="88" y2="166" stroke="#c2412d" stroke-width="3"/>
      <line x1="258" y1="158" x2="268" y2="166" stroke="#c2412d" stroke-width="3"/>
      <!-- tics: lado 2 -->
      <line x1="116" y1="160" x2="126" y2="152" stroke="#0e6b63" stroke-width="3"/>
      <line x1="122" y1="166" x2="132" y2="158" stroke="#0e6b63" stroke-width="3"/>
      <line x1="296" y1="160" x2="306" y2="152" stroke="#0e6b63" stroke-width="3"/>
      <line x1="302" y1="166" x2="312" y2="158" stroke="#0e6b63" stroke-width="3"/>
      <!-- tics: base -->
      <line x1="112" y1="235" x2="112" y2="245" stroke="#9a6b00" stroke-width="3"/>
      <line x1="120" y1="235" x2="120" y2="245" stroke="#9a6b00" stroke-width="3"/>
      <line x1="128" y1="235" x2="128" y2="245" stroke="#9a6b00" stroke-width="3"/>
      <line x1="292" y1="235" x2="292" y2="245" stroke="#9a6b00" stroke-width="3"/>
      <line x1="300" y1="235" x2="300" y2="245" stroke="#9a6b00" stroke-width="3"/>
      <line x1="308" y1="235" x2="308" y2="245" stroke="#9a6b00" stroke-width="3"/>
    `, "Dos triángulos con los tres pares de lados marcados como congruentes"),

    paralelas: wrap(`
      <line x1="30" y1="100" x2="360" y2="100" ${T}/>
      <line x1="30" y1="200" x2="360" y2="200" ${T}/>
      <line x1="120" y1="60" x2="250" y2="245" ${T}/>
      <text x="365" y="104" ${TXT} font-style="italic">p</text>
      <text x="365" y="204" ${TXT} font-style="italic">q</text>
      <text x="256" y="252" ${TXT} font-style="italic">t</text>
      <text x="150" y="90" ${TXT}>1</text>
      <text x="178" y="90" ${TXT}>2</text>
      <text x="170" y="128" ${TXT}>3</text>
      <text x="140" y="128" ${TXT}>4</text>
      <text x="196" y="190" ${TXT}>5</text>
      <text x="222" y="190" ${TXT}>6</text>
      <text x="216" y="228" ${TXT}>7</text>
      <text x="188" y="228" ${TXT}>8</text>
    `, "Dos rectas paralelas cortadas por una transversal, con ocho ángulos numerados"),

    trianguloEscala: wrap(`
      <polygon points="30,250 150,60 250,250" ${T}/>
      <text x="72" y="150" ${TXT} fill="#0e6b63">18</text>
      <text x="196" y="150" ${TXT} fill="#0e6b63">30</text>
      <text x="132" y="272" ${TXT} fill="#0e6b63">36</text>
      <polygon points="270,250 330,150 380,250" ${T}/>
      <text x="292" y="196" ${TXT}>?</text>
      <text x="352" y="196" ${TXT}>?</text>
      <text x="318" y="272" ${TXT}>?</text>
      <text x="300" y="130" ${TXT} fill="#6b7c78">k = 2/3</text>
    `, "Triángulo grande con lados 18, 30 y 36, y triángulo semejante menor con lados desconocidos"),

    // A escala: ON = 20 y XZ = 5 (razón 4). M divide OX y NZ en razón 4 : 1.
    trianguloAnidado: wrap(`
      <line x1="60" y1="50" x2="60" y2="250" ${T}/>
      <line x1="340" y1="125" x2="340" y2="175" ${T}/>
      <line x1="60" y1="50" x2="340" y2="175" ${T}/>
      <line x1="60" y1="250" x2="340" y2="125" ${T}/>
      <path d="M54 154 l6 -8 l6 8" ${T}/>
      <path d="M334 154 l6 -8 l6 8" ${T}/>
      <circle cx="284" cy="150" r="3.5" fill="#c2412d"/>
      <text x="42" y="48" ${TXT}>O</text>
      <text x="42" y="262" ${TXT}>N</text>
      <text x="348" y="186" ${TXT}>X</text>
      <text x="348" y="126" ${TXT}>Z</text>
      <text x="282" y="140" ${TXT}>M</text>
      <text x="164" y="86" ${TXT} fill="#0e6b63">12</text>
      <text x="30" y="156" ${TXT} fill="#0e6b63">20</text>
      <text x="352" y="156" ${TXT} fill="#0e6b63">5</text>
      <text x="306" y="180" ${TXT} fill="#c2412d">?</text>
      <text x="120" y="282" ${TXT} fill="#6b7c78" font-size="12">ON <tspan font-size="16" font-weight="700">∥</tspan> XZ (las flechas marcan las paralelas)</text>
    `, "Segmentos OX y NZ que se cortan en M. ON mide 20 y XZ mide 5; ON y XZ son paralelos. OM mide 12 y XM es desconocido"),

    rayosProporcion: wrap(`
      <line x1="40" y1="230" x2="380" y2="70" ${T}/>
      <line x1="40" y1="230" x2="370" y2="270" ${T}/>
      <line x1="130" y1="193" x2="120" y2="250" ${T}/>
      <line x1="200" y1="164" x2="192" y2="256" ${T}/>
      <line x1="270" y1="135" x2="264" y2="262" ${T}/>
      <line x1="340" y1="106" x2="336" y2="268" ${T}/>
      <text x="26" y="240" ${TXT}>O</text>
      <text x="132" y="186" ${TXT}>T</text>
      <text x="202" y="156" ${TXT}>W</text>
      <text x="272" y="127" ${TXT}>Y</text>
      <text x="342" y="98" ${TXT}>Z</text>
      <text x="110" y="266" ${TXT}>P</text>
      <text x="182" y="272" ${TXT}>B</text>
      <text x="254" y="278" ${TXT}>R</text>
      <text x="326" y="284" ${TXT}>S</text>
    `, "Dos rayos desde O con cuatro transversales que cortan los rayos en T, W, Y, Z y P, B, R, S"),

    planoReflexion: wrap(`
      ${grid(40, 200, 150, 400, 300)}
      <polygon points="160,70 240,70 240,110 200,110 200,130 160,130" fill="#0e6b63" fill-opacity=".18" ${T}/>
      <polygon points="160,230 240,230 240,190 200,190 200,170 160,170" fill="#c2412d" fill-opacity=".16" stroke="#c2412d" stroke-width="2"/>
      <text x="168" y="62" ${TXT}>A</text>
      <text x="168" y="252" ${TXT}>B</text>
    `, "Plano cartesiano con la figura A arriba del eje x y la figura B abajo, como su reflexión"),

    gridTraslacion: wrap(`
      ${grid(40, 200, 150, 400, 300)}
      <polygon points="120,270 200,190 200,270" fill="#0e6b63" fill-opacity=".14" ${T}/>
      <circle cx="120" cy="270" r="4" fill="#c2412d"/>
      <text x="100" y="290" ${TXT} fill="#c2412d">A</text>
    `, "Triángulo en el plano cartesiano con el vértice A marcado en el cuadrante inferior izquierdo"),

    circuloSecantes: wrap(`
      <circle cx="180" cy="150" r="85" ${T}/>
      <circle cx="180" cy="150" r="2.5" fill="#6b7c78"/>
      <line x1="30" y1="70" x2="370" y2="220" ${T}/>
      <line x1="30" y1="240" x2="370" y2="110" ${T}/>
      <circle cx="300" cy="192" r="3.5" fill="#c2412d"/>
      <text x="306" y="206" ${TXT}>K</text>
      <text x="46" y="66" ${TXT}>J</text>
      <text x="122" y="112" ${TXT}>M</text>
      <text x="228" y="146" ${TXT}>N</text>
      <text x="46" y="256" ${TXT}>L</text>
      <text x="150" y="96" ${TXT} fill="#0e6b63">95°</text>
      <text x="208" y="196" ${TXT} fill="#0e6b63">25°</text>
      <text x="164" y="160" ${TXT} fill="#6b7c78" font-size="12">P</text>
    `, "Círculo con dos secantes que se cortan en el punto exterior K; los arcos interceptados miden 95 y 25 grados"),

    cilindro: wrap(`
      <ellipse cx="200" cy="70" rx="85" ry="24" ${T}/>
      <path d="M115 70 v150 a85 24 0 0 0 170 0 V70" ${T}/>
      <ellipse cx="200" cy="70" rx="85" ry="24" fill="none" stroke="#6b7c78" stroke-dasharray="6 5"/>
      <line x1="115" y1="70" x2="285" y2="70" stroke="#c2412d" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="166" y="60" ${TXT} fill="#c2412d">16 pulg</text>
      <line x1="300" y1="70" x2="300" y2="220" stroke="#0e6b63" stroke-width="2"/>
      <text x="306" y="150" ${TXT} fill="#0e6b63">30 pulg</text>
    `, "Barril cilíndrico con diámetro de 16 pulgadas y altura de 30 pulgadas"),

    esfera: wrap(`
      <circle cx="200" cy="150" r="95" ${T} fill="#0e6b63" fill-opacity=".06"/>
      <ellipse cx="200" cy="150" rx="95" ry="26" stroke="#6b7c78" stroke-width="1.5" fill="none" stroke-dasharray="6 5"/>
      <line x1="200" y1="150" x2="292" y2="178" ${AC}/>
      <circle cx="200" cy="150" r="2.5" fill="#14211f"/>
      <text x="224" y="132" ${TXT} fill="#0e6b63">r = 6 pulg</text>
    `, "Esfera con un radio marcado de 6 pulgadas"),

    prisma: wrap(`
      <polygon points="90,110 150,70 310,70 250,110" fill="#f7f3e9" ${T}/>
      <polygon points="250,110 310,70 310,200 250,240" fill="#f2ecdf" ${T}/>
      <rect x="90" y="110" width="160" height="130" fill="#fbf8f2" ${T}/>
      <line x1="150" y1="70" x2="150" y2="200" ${T} stroke-dasharray="5 4"/>
      <line x1="150" y1="200" x2="310" y2="200" ${T} stroke-dasharray="5 4"/>
      <line x1="150" y1="200" x2="90" y2="240" ${T} stroke-dasharray="5 4"/>
      <line x1="250" y1="240" x2="310" y2="200" ${T}/>
    `, "Prisma rectangular sin dimensiones marcadas"),

    /* ---------- Figuras para demostraciones de dos columnas ---------- */

    // ΔABD y ΔCBD comparten el lado BD; D está sobre AC.
    triangulosBD: wrap(`
      <polygon points="200,40 70,250 330,250" ${T}/>
      <line x1="200" y1="40" x2="200" y2="250" ${T}/>
      <circle cx="200" cy="250" r="3.5" fill="#c2412d"/>
      <text x="194" y="30" ${TXT}>B</text>
      <text x="52" y="262" ${TXT}>A</text>
      <text x="336" y="262" ${TXT}>C</text>
      <text x="195" y="274" ${TXT}>D</text>
    `, "Triángulo ABC con el segmento BD desde el vértice B hasta el punto D sobre el lado AC; se forman los triángulos ABD y CBD"),

    // AB ∥ CD; AD y BC se cortan en E (punto medio de BC).
    corbata: wrap(`
      <line x1="60" y1="60" x2="60" y2="240" ${T}/>
      <line x1="340" y1="60" x2="340" y2="240" ${T}/>
      <line x1="60" y1="60" x2="340" y2="240" ${T}/>
      <line x1="60" y1="240" x2="340" y2="60" ${T}/>
      <path d="M54 154 l6 -8 l6 8" ${T}/>
      <path d="M334 154 l6 -8 l6 8" ${T}/>
      <circle cx="200" cy="150" r="3.5" fill="#c2412d"/>
      <text x="40" y="58" ${TXT}>A</text>
      <text x="40" y="252" ${TXT}>B</text>
      <text x="348" y="58" ${TXT}>C</text>
      <text x="348" y="252" ${TXT}>D</text>
      <text x="196" y="136" ${TXT}>E</text>
      <text x="96" y="285" ${TXT} fill="#6b7c78" font-size="12">AB <tspan font-size="16" font-weight="700">∥</tspan> CD (las flechas marcan las paralelas)</text>
    `, "Segmentos paralelos AB y CD; los segmentos AD y BC se cortan en el punto E y forman los triángulos ABE y DCE"),

    // ΔABC con DE ∥ BC; D en AB y E en AC.
    trianguloParalela: wrap(`
      <polygon points="200,40 60,260 340,260" ${T}/>
      <line x1="137" y1="139" x2="263" y2="139" ${T}/>
      <path d="M196 133 l8 6 l-8 6" ${T}/>
      <path d="M196 254 l8 6 l-8 6" ${T}/>
      <text x="194" y="30" ${TXT}>A</text>
      <text x="42" y="272" ${TXT}>B</text>
      <text x="346" y="272" ${TXT}>C</text>
      <text x="118" y="140" ${TXT}>D</text>
      <text x="270" y="140" ${TXT}>E</text>
    `, "Triángulo ABC con el segmento DE paralelo a BC; D está en AB y E está en AC"),

    // Círculo de centro O con los radios OA y OB y la cuerda AB.
    circuloRadios: wrap(`
      <circle cx="200" cy="140" r="100" ${T}/>
      <line x1="200" y1="140" x2="113" y2="190" ${AC}/>
      <line x1="200" y1="140" x2="287" y2="190" ${AC}/>
      <line x1="113" y1="190" x2="287" y2="190" ${T}/>
      <circle cx="200" cy="140" r="3.5" fill="#14211f"/>
      <circle cx="113" cy="190" r="3.5" fill="#c2412d"/>
      <circle cx="287" cy="190" r="3.5" fill="#c2412d"/>
      <text x="194" y="128" ${TXT}>O</text>
      <text x="94" y="204" ${TXT}>A</text>
      <text x="294" y="204" ${TXT}>B</text>
    `, "Círculo con centro O; los segmentos OA y OB van del centro a los puntos A y B del círculo, y AB los une"),

    /* ---------- M1 ---------- */

    // Bisectrices (punteadas) que se cortan en el incentro I, con el círculo inscrito.
    incentro: wrap(`
      <polygon points="60,250 200,50 340,250" ${T}/>
      <line x1="200" y1="50" x2="200" y2="250" stroke="#0e6b63" stroke-width="1.6" stroke-dasharray="6 5"/>
      <line x1="60" y1="250" x2="265.2" y2="143.1" stroke="#0e6b63" stroke-width="1.6" stroke-dasharray="6 5"/>
      <line x1="340" y1="250" x2="134.8" y2="143.1" stroke="#0e6b63" stroke-width="1.6" stroke-dasharray="6 5"/>
      <circle cx="200" cy="177.1" r="72.9" stroke="#c2412d" stroke-width="2" fill="none"/>
      <circle cx="200" cy="177.1" r="3.5" fill="#c2412d"/>
      <text x="208" y="172" ${TXT} fill="#c2412d">I</text>
      <text x="30" y="282" ${TXT} fill="#6b7c78" font-size="12">Las líneas punteadas son las bisectrices de los ángulos.</text>
    `, "Triángulo con sus tres bisectrices punteadas que se cortan en el punto I, centro de un círculo que toca los tres lados por dentro"),

    // Plano con la recta l (A, B, C), D en el plano y E fuera del plano.
    colineales: wrap(`
      <polygon points="30,230 130,130 390,130 290,230" fill="#0e6b63" fill-opacity=".07" ${T}/>
      <line x1="60" y1="209" x2="360" y2="151" ${T}/>
      <text x="364" y="150" ${TXT} font-style="italic">ℓ</text>
      <circle cx="119" cy="197.6" r="4" fill="#14211f"/><text x="110" y="220" ${TXT}>A</text>
      <circle cx="210" cy="180" r="4" fill="#14211f"/><text x="203" y="202" ${TXT}>B</text>
      <circle cx="301" cy="162.4" r="4" fill="#14211f"/><text x="296" y="184" ${TXT}>C</text>
      <circle cx="180" cy="150" r="4" fill="#0e6b63"/><text x="168" y="146" ${TXT} fill="#0e6b63">D</text>
      <circle cx="250" cy="45" r="4" fill="#c2412d"/><text x="258" y="44" ${TXT} fill="#c2412d">E</text>
      <line x1="250" y1="49" x2="250" y2="140" stroke="#c2412d" stroke-width="1.5" stroke-dasharray="5 5"/>
      <text x="40" y="262" ${TXT} fill="#6b7c78" font-size="12">E está por encima del plano; la línea punteada no es parte de la figura.</text>
    `, "Plano con la recta l que contiene los puntos A, B y C. El punto D está en el plano pero fuera de la recta. El punto E está por encima del plano"),

    // Opciones de la construcción de la mediatriz de AB (A(40,80), B(160,80))
    medCorrecta: mini(`
      <line x1="40" y1="80" x2="160" y2="80" ${T}/>
      <path d="M90.2 20.2 A78 78 0 0 1 107.6 41" ${AC}/>
      <path d="M92.4 41 A78 78 0 0 1 109.8 20.2" ${AC}/>
      <path d="M107.6 119 A78 78 0 0 1 90.2 139.8" ${AC}/>
      <path d="M109.8 139.8 A78 78 0 0 1 92.4 119" ${AC}/>
      <line x1="100" y1="12" x2="100" y2="138" stroke="#c2412d" stroke-width="2"/>
      <text x="28" y="98" ${TXT} font-size="12">A</text><text x="164" y="98" ${TXT} font-size="12">B</text>
    `, "Arcos desde A y desde B que se cortan arriba y abajo del segmento, y la recta que une esos cortes"),
    medNoMedio: mini(`
      <line x1="40" y1="80" x2="160" y2="80" ${T}/>
      <line x1="70" y1="16" x2="70" y2="136" stroke="#c2412d" stroke-width="2"/>
      <path d="M70 72 h8 v8" fill="none" stroke="#14211f" stroke-width="1.5"/>
      <text x="28" y="98" ${TXT} font-size="12">A</text><text x="164" y="98" ${TXT} font-size="12">B</text>
    `, "Una recta perpendicular al segmento AB, más cerca de A que de B"),
    medInclinada: mini(`
      <line x1="40" y1="80" x2="160" y2="80" ${T}/>
      <line x1="70" y1="20" x2="130" y2="140" stroke="#c2412d" stroke-width="2"/>
      ${tics(40, 80, 100, 80, 1, "#0e6b63")}${tics(100, 80, 160, 80, 1, "#0e6b63")}
      <text x="28" y="98" ${TXT} font-size="12">A</text><text x="164" y="98" ${TXT} font-size="12">B</text>
    `, "Una recta inclinada que pasa por el punto medio de AB sin ser perpendicular"),
    medCirculo: mini(`
      <line x1="40" y1="80" x2="160" y2="80" ${T}/>
      <circle cx="100" cy="80" r="60" ${AC}/>
      <circle cx="100" cy="80" r="3" fill="#c2412d"/>
      <text x="22" y="98" ${TXT} font-size="12">A</text><text x="166" y="98" ${TXT} font-size="12">B</text>
    `, "Un círculo con centro en el punto medio de AB que pasa por A y por B"),

    /* ---------- M2 ---------- */

    // Opciones: ¿qué marcas garantizan congruencia?
    congAAA: mini(`
      ${triMarcado(T1, null, { 0: 1, 1: 2, 2: 3 }, 12)}
      ${triMarcado(T1s, null, { 0: 1, 1: 2, 2: 3 }, 10)}
    `, "Dos triángulos de distinto tamaño con los tres pares de ángulos marcados"),
    congLLA: mini(`
      ${triMarcado(T1, { 0: 1, 1: 2 }, { 0: 1 }, 12)}
      ${triMarcado(desplazar(T1, 100, 0), { 0: 1, 1: 2 }, { 0: 1 }, 12)}
    `, "Dos triángulos con dos pares de lados marcados y un ángulo que no está entre esos lados"),
    congLAL: mini(`
      ${triMarcado(T1, { 0: 1, 2: 2 }, { 0: 1 }, 12)}
      ${triMarcado(desplazar(T1, 100, 0), { 0: 1, 2: 2 }, { 0: 1 }, 12)}
    `, "Dos triángulos con dos pares de lados marcados y el ángulo comprendido entre ellos"),
    congLL: mini(`
      ${triMarcado(T1, { 0: 1, 2: 2 }, null)}
      ${triMarcado(desplazar(T1, 100, 0), { 0: 1, 2: 2 }, null)}
    `, "Dos triángulos con solo dos pares de lados marcados"),

    // Dos triángulos con marcas AAL: ángulos en el vértice inferior izquierdo y
    // en el superior; lado marcado del vértice superior al inferior derecho.
    triangulosAAL: wrap(`
      ${triMarcado([[30, 250], [110, 70], [190, 250]], { 1: 1 }, { 0: 1, 1: 2 }, 22)}
      ${triMarcado([[210, 250], [290, 70], [370, 250]], { 1: 1 }, { 0: 1, 1: 2 }, 22)}
      <text x="18" y="270" ${TXT}>A</text><text x="104" y="60" ${TXT}>B</text><text x="180" y="270" ${TXT}>C</text>
      <text x="208" y="270" ${TXT}>D</text><text x="284" y="60" ${TXT}>E</text><text x="372" y="270" ${TXT}>F</text>
    `, "Triángulos ABC y DEF. Están marcados el ángulo A con el D, el ángulo B con el E, y el lado BC con el EF"),

    /* ---------- v1.7 ---------- */

    // M2-19: triángulo con una marca en AB y otra en AC.
    isoscelesTics: wrap(`
      ${triMarcado([[200, 50], [90, 250], [310, 250]], { 0: 1, 2: 1 }, null)}
      <text x="194" y="38" ${TXT}>A</text>
      <text x="72" y="264" ${TXT}>B</text>
      <text x="316" y="264" ${TXT}>C</text>
    `, "Triángulo ABC con una marca en el lado AB y una marca igual en el lado AC"),

    // M2-24: paralelogramo ABCD con la diagonal AC.
    paralelogramoAC: wrap(`
      <polygon points="60,230 130,70 340,70 270,230" ${T}/>
      <line x1="60" y1="230" x2="340" y2="70" stroke="#0e6b63" stroke-width="2" stroke-dasharray="6 5"/>
      <path d="M87.2 155.3 L95 150 L96.4 159.3" ${T}/>
      <path d="M297.2 155.3 L305 150 L306.4 159.3" ${T}/>
      <path d="M160 224 l8 6 l-8 6 M168 224 l8 6 l-8 6" ${T}/>
      <path d="M230 64 l8 6 l-8 6 M238 64 l8 6 l-8 6" ${T}/>
      <text x="42" y="244" ${TXT}>A</text>
      <text x="118" y="60" ${TXT}>B</text>
      <text x="346" y="64" ${TXT}>C</text>
      <text x="276" y="248" ${TXT}>D</text>
      <text x="24" y="285" ${TXT} fill="#6b7c78" font-size="12">Las flechas marcan las paralelas: AB <tspan font-size="16" font-weight="700">∥</tspan> DC y AD <tspan font-size="16" font-weight="700">∥</tspan> BC.</text>
    `, "Paralelogramo ABCD con la diagonal AC punteada; AB es paralelo a DC y AD es paralelo a BC"),

    // M3-14: ΔABC (A = 50°, B = 70°) y ΔDEF menor (D = 50°, F = 60°).
    semejanzaAA: wrap(`
      <polygon points="30,250 200,250 148.6,108.7" ${T}/>
      <polygon points="240,250 342,250 311.2,165.2" ${T}/>
      <text x="14" y="266" ${TXT}>A</text>
      <text x="204" y="266" ${TXT}>B</text>
      <text x="142" y="98" ${TXT}>C</text>
      <text x="58" y="242" ${TXT} fill="#0e6b63">50°</text>
      <text x="160" y="242" ${TXT} fill="#0e6b63">70°</text>
      <text x="226" y="266" ${TXT}>D</text>
      <text x="346" y="266" ${TXT}>E</text>
      <text x="306" y="156" ${TXT}>F</text>
      <text x="262" y="242" ${TXT} fill="#0e6b63">50°</text>
      <text x="291" y="206" ${TXT} fill="#0e6b63">60°</text>
    `, "Triángulo ABC con el ángulo A de 50 grados y el ángulo B de 70 grados; triángulo DEF, más pequeño, con el ángulo D de 50 grados y el ángulo F de 60 grados"),

    // M4-15: A (1,1), (4,1), (1,3) → B, su rotación de 90° antihoraria. Cuadrícula de 30 px.
    gridRotacion: wrap(`
      ${grid(30, 200, 150, 400, 300)}
      <polygon points="230,120 320,120 230,60" fill="#0e6b63" fill-opacity=".16" stroke="#0e6b63" stroke-width="2"/>
      <polygon points="170,120 170,30 110,120" fill="#c2412d" fill-opacity=".16" stroke="#c2412d" stroke-width="2"/>
      <circle cx="320" cy="120" r="4" fill="#14211f"/>
      <text x="324" y="112" ${TXT}>P</text>
      <circle cx="170" cy="30" r="4" fill="#14211f"/>
      <text x="176" y="28" ${TXT}>P′</text>
      <circle cx="200" cy="150" r="3" fill="#14211f"/>
      <text x="204" y="166" ${TXT} font-size="12">O</text>
      <text x="248" y="112" ${TXT} fill="#0e6b63" font-weight="700">A</text>
      <text x="146" y="112" ${TXT} fill="#c2412d" font-weight="700">B</text>
    `, "Plano cartesiano. La figura A es un triángulo con vértices en (1, 1), (4, 1) y (1, 3); el vértice P está en (4, 1). La figura B tiene vértices en (−1, 1), (−1, 4) y (−3, 1); el vértice P′ está en (−1, 4)"),

    // M5-12: AB es diámetro y C está en el círculo.
    semicirculoInscrito: wrap(`
      <circle cx="200" cy="150" r="110" ${T}/>
      <line x1="90" y1="150" x2="310" y2="150" ${T}/>
      <polyline points="90,150 153.5,50.3 310,150" ${AC}/>
      <circle cx="200" cy="150" r="3.5" fill="#14211f"/>
      <text x="194" y="170" ${TXT}>O</text>
      <text x="70" y="156" ${TXT}>A</text>
      <text x="316" y="156" ${TXT}>B</text>
      <text x="144" y="40" ${TXT}>C</text>
    `, "Círculo de centro O. El segmento AB pasa por O. El punto C está en el círculo y se une con A y con B"),

    // M5-13: tangente PT y secante PBC. Arcos: TB = 60° y TC (lejano) = 160°.
    tangenteSecante: wrap(`
      <circle cx="250" cy="150" r="90" ${T}/>
      <line x1="112" y1="60" x2="345" y2="60" ${T}/>
      <line x1="134.4" y1="60" x2="300" y2="258" ${T}/>
      <circle cx="134.4" cy="60" r="3.5" fill="#c2412d"/>
      <circle cx="250" cy="60" r="3.5" fill="#14211f"/>
      <circle cx="172.1" cy="105" r="3.5" fill="#14211f"/>
      <circle cx="280.8" cy="234.6" r="3.5" fill="#14211f"/>
      <text x="120" y="50" ${TXT} fill="#c2412d">P</text>
      <text x="245" y="50" ${TXT}>T</text>
      <text x="152" y="118" ${TXT}>B</text>
      <text x="290" y="250" ${TXT}>C</text>
      <text x="206" y="92" ${TXT} fill="#0e6b63">60°</text>
      <text x="346" y="134" ${TXT} fill="#0e6b63">160°</text>
      <text x="20" y="285" ${TXT} fill="#6b7c78" font-size="12">PT es tangente en T. La secante pasa por B y por C.</text>
    `, "Círculo con la tangente PT y la secante que sale de P y corta el círculo en B y en C. El arco TB mide 60 grados y el arco TC, el más lejano, mide 160 grados")
  };

  return figs;
})();
