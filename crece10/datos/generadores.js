/*!
 * CRECE 10 · Matemáticas
 * © 2026 Dr. Yonatan Guerrero, creador y desarrollador de CRECE 10.
 * Todos los derechos reservados.
 */
/* Ítems con números aleatorios — Proyecto CRECE 10 · Matemáticas
   Cada plantilla genera un ítem nuevo por sesión, con su explicación y la
   retroalimentación de cada opción calculadas a partir de los números.
   Así el dominio por ruta mide destreza y no memoria de la letra correcta.

   Identificador: "GEN:<clave>:<semilla>". La misma semilla produce siempre el
   mismo ítem, así que el cuaderno de errores y la revisión del simulacro lo
   reconstruyen sin guardarlo. Contenido original. */

window.CRECE_GENERADORES = (function () {
  "use strict";

  /* ---------- Utilidades ---------- */
  function prng(seed) { // mulberry32: rápido y determinista
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const ent = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const noCero = (r, a, b) => { let v = 0; while (v === 0) v = ent(r, a, b); return v; };
  const elegir = (r, xs) => xs[Math.floor(r() * xs.length)];
  const n = v => (v < 0 ? "−" + Math.abs(v) : String(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // signo tipográfico y miles
  const pf = v => (v < 0 ? `(${n(v)})` : n(v)); // factor con paréntesis si es negativo
  const pt = (x, y) => `(${n(x)}, ${n(y)})`;
  const mat = m => "[" + m.map(f => "[" + f.map(n).join(", ") + "]").join(", ") + "]";
  const distintas = xs => new Set(xs).size === xs.length;
  // «3x − 2y = 7» con coeficientes 1 y −1 bien escritos
  function ecuacion(a, b, c) {
    const t = (k, v, primero) => {
      const abs = Math.abs(k) === 1 ? "" : String(Math.abs(k));
      if (primero) return (k < 0 ? "−" : "") + abs + v;
      return (k < 0 ? " − " : " + ") + abs + v;
    };
    return t(a, "x", true) + t(b, "y", false) + " = " + n(c);
  }

  /* ---------- Plantillas ----------
     crear(r) devuelve { enunciado, opciones (la correcta primero), distractores
     (null primero), explicacion, pista, error } o null si los números no sirven
     (por ejemplo, dos opciones iguales). Se reintenta con el mismo generador. */
  const P = {};

  // M4 · Reflexión sobre un eje
  P.reflexion = { repaso: "i1", modulo: "M4", indicador: "ES.G.41", nivel: 2, etiquetas: ["transformaciones", "reflexión"], crear(r) {
    const a = noCero(r, -8, 8), b = noCero(r, -8, 8);
    if (Math.abs(a) === Math.abs(b)) return null;
    const eje = elegir(r, ["x", "y"]);
    const ok = eje === "x" ? [a, -b] : [-a, b];
    const otro = eje === "x" ? [-a, b] : [a, -b];
    const ops = [pt(...ok), pt(...otro), pt(-a, -b), pt(b, a)];
    if (!distintas(ops)) return null;
    return {
      enunciado: `El punto P${pt(a, b)} se refleja sobre el eje ${eje}. ¿Cuáles son las coordenadas de su imagen P′?`,
      opciones: ops,
      distractores: [null,
        `Cambiaste el signo de ${eje === "x" ? "x" : "y"}: eso es reflejar sobre el eje ${eje === "x" ? "y" : "x"}.`,
        "Cambiaste los dos signos: eso es una rotación de 180° alrededor del origen.",
        "Intercambiaste las coordenadas: eso es reflejar sobre la recta y = x."],
      explicacion: eje === "x"
        ? `Reflejar sobre el eje x conserva x y cambia el signo de y: ${pt(a, b)} → ${pt(...ok)}.`
        : `Reflejar sobre el eje y cambia el signo de x y conserva y: ${pt(a, b)} → ${pt(...ok)}.`,
      pista: `El eje ${eje} es el espejo. ¿Cuál coordenada mide la distancia a ese eje? Esa es la que cambia de signo.`,
      error: "Cambiar el signo de la coordenada equivocada."
    };
  } };

  // M4 · Rotación alrededor del origen
  P.rotacion = { repaso: "i2", modulo: "M4", indicador: "ES.G.41", nivel: 3, etiquetas: ["transformaciones", "rotación"], crear(r) {
    const a = noCero(r, -7, 7), b = noCero(r, -7, 7);
    if (Math.abs(a) === Math.abs(b)) return null;
    const reglas = {
      anti: { txt: "90° en sentido contrario a las manecillas del reloj", f: [-b, a], r: "(x, y) → (−y, x)" },
      hor: { txt: "90° en el sentido de las manecillas del reloj", f: [b, -a], r: "(x, y) → (y, −x)" },
      media: { txt: "180°", f: [-a, -b], r: "(x, y) → (−x, −y)" }
    };
    const clave = elegir(r, Object.keys(reglas));
    const R = reglas[clave];
    const otras = Object.keys(reglas).filter(k => k !== clave);
    const extra = clave === "media" ? { f: [-a, b], d: "Solo cambiaste el signo de x: eso es reflejar sobre el eje y, no rotar 180°." }
                                    : { f: [b, a], d: "Intercambiaste las coordenadas sin cambiar signos: eso es reflejar sobre la recta y = x." };
    const ops = [pt(...R.f), pt(...reglas[otras[0]].f), pt(...reglas[otras[1]].f), pt(...extra.f)];
    if (!distintas(ops)) return null;
    const dis = k => `Aplicaste la regla de ${reglas[k].txt}: ${reglas[k].r}. La rotación pedida usa ${R.r}.`;
    return {
      enunciado: `El punto Q${pt(a, b)} se rota ${R.txt} alrededor del origen. ¿Cuál es su imagen Q′?`,
      opciones: ops,
      distractores: [null, dis(otras[0]), dis(otras[1]), extra.d],
      explicacion: `La regla de la rotación de ${R.txt} es ${R.r}. Entonces ${pt(a, b)} → ${pt(...R.f)}.`,
      pista: clave === "media" ? "180° es media vuelta: los dos signos cambian." : "En una rotación de 90° las coordenadas se intercambian y una cambia de signo. Prueba con el punto (1, 0) para saber cuál.",
      error: "Confundir la rotación horaria con la antihoraria."
    };
  } };

  // M4 · Traslación
  P.traslacion = { repaso: "i0", modulo: "M4", indicador: "ES.G.41", nivel: 2, etiquetas: ["transformaciones", "traslación"], crear(r) {
    const a = ent(r, -6, 6), b = ent(r, -6, 6);
    const h = noCero(r, -6, 6), k = noCero(r, -6, 6);
    if (Math.abs(h) === Math.abs(k)) return null;
    const hor = `${Math.abs(h)} ${Math.abs(h) === 1 ? "unidad" : "unidades"} a la ${h > 0 ? "derecha" : "izquierda"}`;
    const ver = `${Math.abs(k)} ${Math.abs(k) === 1 ? "unidad" : "unidades"} hacia ${k > 0 ? "arriba" : "abajo"}`;
    const ops = [pt(a + h, b + k), pt(a - h, b + k), pt(a + h, b - k), pt(a + k, b + h)];
    if (!distintas(ops)) return null;
    return {
      enunciado: `El punto A${pt(a, b)} se traslada ${hor} y ${ver}. ¿Cuáles son las coordenadas de A′?`,
      opciones: ops,
      distractores: [null,
        `Moviste x en la dirección contraria. ${h > 0 ? "Derecha suma" : "Izquierda resta"} a x.`,
        `Moviste y en la dirección contraria. ${k > 0 ? "Arriba suma" : "Abajo resta"} a y.`,
        "Intercambiaste los movimientos: el horizontal cambia x y el vertical cambia y."],
      explicacion: `Horizontal: ${n(a)} ${h > 0 ? "+" : "−"} ${Math.abs(h)} = ${n(a + h)}. Vertical: ${n(b)} ${k > 0 ? "+" : "−"} ${Math.abs(k)} = ${n(b + k)}. A′${pt(a + h, b + k)}.`,
      pista: "Haz los dos movimientos por separado: el horizontal cambia x y el vertical cambia y.",
      error: "Mover en la dirección contraria o cambiar la coordenada equivocada."
    };
  } };

  // M6 · Escalar por matriz
  P.escalar = { repaso: "i2", modulo: "M6", indicador: "ES.A.11", nivel: 2, etiquetas: ["matrices", "escalar"], crear(r) {
    const k = -ent(r, 2, 5);
    const M = [[noCero(r, -7, 7), noCero(r, -7, 7)], [noCero(r, -7, 7), noCero(r, -7, 7)]];
    const plano = M.flat();
    if (!plano.some(v => v > 0) || !plano.some(v => v < 0)) return null;
    const por = f => M.map(fila => fila.map(f));
    const ok = por(v => k * v);
    const ops = [mat(ok), mat(por(v => -k * v)), mat(por(v => Math.abs(k * v))), mat(por(v => -Math.abs(k * v)))];
    if (!distintas(ops)) return null;
    const letra = elegir(r, ["K", "M", "W", "H"]);
    return {
      enunciado: `Si ${letra} = ${mat(M)}, ¿cuál matriz corresponde a ${n(k)}${letra}?`,
      opciones: ops,
      distractores: [null,
        `Multiplicaste por ${-k}, no por ${n(k)}: los signos quedaron igual que en ${letra}.`,
        `Tomaste valores absolutos. Al multiplicar por ${n(k)}, cada entrada cambia de signo.`,
        "Pusiste todo negativo. Negativo por negativo es positivo."],
      explicacion: `Multiplica cada entrada por ${n(k)}: ${plano.map(v => `${pf(v)}(${n(k)}) = ${n(k * v)}`).join("; ")}.`,
      pista: "El escalar multiplica a cada entrada. Si el escalar es negativo, cada signo cambia.",
      error: "Olvidar el signo del escalar en alguna entrada."
    };
  } };

  // M6 · Matriz por vector
  P.producto = { repaso: "i2", modulo: "M6", indicador: "ES.A.11", nivel: 3, etiquetas: ["matrices", "producto"], crear(r) {
    const A = [[noCero(r, -5, 5), noCero(r, -5, 5)], [noCero(r, -5, 5), noCero(r, -5, 5)]];
    const x = noCero(r, -5, 5), y = noCero(r, -5, 5);
    const ok = [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
    const tr = [A[0][0] * x + A[1][0] * y, A[0][1] * x + A[1][1] * y];
    const resta = [A[0][0] * x - A[0][1] * y, A[1][0] * x - A[1][1] * y];
    const diag = [A[0][0] * x, A[1][1] * y];
    const col = v => mat([[v[0]], [v[1]]]);
    const ops = [col(ok), col(tr), col(resta), col(diag)];
    if (!distintas(ops)) return null;
    const [L, V] = elegir(r, [["A", "v"], ["B", "u"], ["C", "w"]]);
    return {
      enunciado: `Si ${L} = ${mat(A)} y ${V} = ${mat([[x], [y]])}, ¿cuál es el producto ${L}${V}?`,
      opciones: ops,
      distractores: [null,
        "Multiplicaste las columnas de la matriz por el vector. Se multiplica cada FILA por la columna.",
        "Restaste los productos. Fila por columna significa multiplicar y luego SUMAR.",
        "Multiplicaste solo una entrada por fila. Cada fila tiene dos productos que se suman."],
      explicacion: `Fila 1: ${pf(A[0][0])}(${n(x)}) + ${pf(A[0][1])}(${n(y)}) = ${n(ok[0])}. Fila 2: ${pf(A[1][0])}(${n(x)}) + ${pf(A[1][1])}(${n(y)}) = ${n(ok[1])}.`,
      pista: "Toma la primera fila, multiplícala entrada por entrada con la columna y suma. Repite con la segunda fila.",
      error: "Multiplicar entrada por entrada sin sumar, o equivocarse con los signos."
    };
  } };

  // M6 · Sistema 2×2
  P.sistema = { repaso: "i1", modulo: "M6", indicador: "ES.A.11", nivel: 2, etiquetas: ["sistemas", "verificación"], crear(r) {
    const x0 = ent(r, -5, 6), y0 = ent(r, -5, 6);
    const a1 = noCero(r, -4, 4), b1 = noCero(r, -4, 4), a2 = noCero(r, -4, 4), b2 = noCero(r, -4, 4);
    if (a1 * b2 === a2 * b1) return null; // necesitamos solución única
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
    const cumple = (x, y) => [a1 * x + b1 * y === c1, a2 * x + b2 * y === c2];
    const cand = [[x0 + b1, y0 - a1], [y0, x0], [-x0, y0], [x0, -y0], [x0 - b1, y0 + a1]];
    const malos = [];
    for (const p of cand) {
      const [u, v] = cumple(...p);
      if (u && v) continue;
      if (malos.some(q => q[0] === p[0] && q[1] === p[1]) || (p[0] === x0 && p[1] === y0)) continue;
      malos.push(p);
      if (malos.length === 3) break;
    }
    if (malos.length < 3) return null;
    const dis = ([x, y]) => {
      const [u] = cumple(x, y);
      return u
        ? `${pt(x, y)} cumple la primera ecuación, pero en la segunda da ${n(a2 * x + b2 * y)}, no ${n(c2)}. Verifica siempre las dos.`
        : `${pt(x, y)} no cumple la primera ecuación: da ${n(a1 * x + b1 * y)}, no ${n(c1)}.`;
    };
    return {
      enunciado: `¿Cuál es la solución del sistema ${ecuacion(a1, b1, c1)} y ${ecuacion(a2, b2, c2)}?`,
      opciones: [pt(x0, y0), ...malos.map(p => pt(...p))],
      distractores: [null, ...malos.map(dis)],
      explicacion: `Sustituye ${pt(x0, y0)}: primera ecuación ${pf(a1)}(${n(x0)}) + ${pf(b1)}(${n(y0)}) = ${n(c1)}; segunda ${pf(a2)}(${n(x0)}) + ${pf(b2)}(${n(y0)}) = ${n(c2)}. Cumple las dos.`,
      pista: "No hace falta resolver desde cero: sustituye cada opción en LAS DOS ecuaciones.",
      error: "Probar solo una de las dos ecuaciones."
    };
  } };

  // M5 · Volumen de cilindro (dan el diámetro)
  P.cilindro = { repaso: "f2", modulo: "M5", indicador: "ES.M.56", nivel: 2, etiquetas: ["medición", "volumen"], crear(r) {
    const rad = ent(r, 3, 9), h = ent(r, 4, 15), d = 2 * rad;
    const [obj, u] = elegir(r, [["Una lata de jugo", "cm"], ["Un tanque de agua", "pies"], ["Un tubo de cartón", "pulg"], ["Una maceta", "pulg"]]);
    const ops = [rad * rad * h, d * d * h, 2 * rad * h, 2 * rad * rad * h].map(v => `${n(v)}π ${u}³`);
    if (!distintas(ops)) return null;
    return {
      enunciado: `${obj} tiene forma de cilindro, con ${d} ${u} de diámetro y ${h} ${u} de altura. ¿Cuál es su volumen?`,
      opciones: ops,
      distractores: [null,
        `Usaste ${d} como radio. El radio es la mitad del diámetro: ${rad} ${u}.`,
        "Calculaste 2πrh, que es el área lateral, no el volumen.",
        "Multiplicaste por 2 de más: el volumen es πr²h, sin el 2."],
      explicacion: `El radio es ${d} ÷ 2 = ${rad}. V = πr²h = π(${rad}²)(${h}) = π(${rad * rad})(${h}) = ${n(rad * rad * h)}π ${u}³.`,
      pista: "Antes de usar la fórmula, convierte el diámetro en radio.",
      error: "Usar el diámetro como radio."
    };
  } };

  // M5 · Volumen de esfera
  P.esfera = { repaso: "f3", modulo: "M5", indicador: "ES.M.56", nivel: 2, etiquetas: ["medición", "volumen"], crear(r) {
    const rad = elegir(r, [3, 6, 9, 12, 15]);
    const u = elegir(r, ["cm", "pulg", "m"]);
    const ops = [4 * rad ** 3 / 3, 4 * rad * rad, 4 * rad ** 3, 4 * rad * rad / 3].map(v => `${n(v)}π ${u}³`);
    if (!distintas(ops)) return null;
    return {
      enunciado: `Una esfera tiene un radio de ${rad} ${u}. ¿Cuál es su volumen?`,
      opciones: ops,
      distractores: [null,
        "Calculaste 4πr², que es el área de la superficie, no el volumen.",
        "Olvidaste dividir entre 3: la fórmula es (4/3)πr³.",
        "Elevaste el radio al cuadrado. En volumen el radio va al cubo."],
      explicacion: `V = (4/3)πr³ = (4/3)π(${rad}³) = (4/3)π(${n(rad ** 3)}) = ${n(4 * rad ** 3 / 3)}π ${u}³.`,
      pista: "Volumen de esfera: (4/3)πr³. Eleva al cubo antes de multiplicar.",
      error: "Usar la fórmula del área de la superficie o elevar al cuadrado."
    };
  } };

  // M5 · Ángulo inscrito y central
  P.inscrito = { repaso: "i1", modulo: "M5", indicador: "ES.G.43", nivel: 2, etiquetas: ["círculos", "ángulos"], crear(r) {
    const ins = ent(r, 12, 80), cen = 2 * ins;
    const pideInscrito = r() < 0.5;
    const dado = pideInscrito ? cen : ins, ok = pideInscrito ? ins : cen;
    const ops = pideInscrito ? [ins, 2 * cen, cen, 180 - cen] : [cen, ins / 2, ins, 180 - ins];
    if (!distintas(ops) || ops.some(v => v <= 0)) return null;
    const fmt = v => `${v}°`;
    return {
      enunciado: pideInscrito
        ? `Un ángulo central mide ${cen}°. ¿Cuánto mide un ángulo inscrito que abarca el mismo arco?`
        : `Un ángulo inscrito mide ${ins}°. ¿Cuánto mide el ángulo central que abarca el mismo arco?`,
      opciones: ops.map(fmt),
      distractores: [null,
        pideInscrito ? "Duplicaste. El inscrito mide la mitad del central." : "Dividiste entre 2. El central es el doble del inscrito.",
        `${dado}° es el ángulo que te dieron. El otro ángulo que abarca el mismo arco no mide lo mismo.`,
        `${180 - dado}° es el suplemento (180 − ${dado}). Aquí no se trata de suplementos.`],
      explicacion: pideInscrito
        ? `El inscrito mide la mitad del central que abarca el mismo arco: ${cen} ÷ 2 = ${ok}°.`
        : `El central mide el doble del inscrito que abarca el mismo arco: ${ins} × 2 = ${ok}°.`,
      pista: "Inscrito = mitad del central. Central = doble del inscrito.",
      error: "Duplicar cuando hay que dividir, o al revés."
    };
  } };

  // M3 · Lado de un triángulo semejante (respuesta numérica)
  P.semejanza = { repaso: "i1", modulo: "M3", indicador: "ES.G.42", nivel: 2, etiquetas: ["semejanza", "proporción"], crear(r) {
    const k = elegir(r, [2, 3, 1.5, 2.5, 0.5]);
    const a = 2 * ent(r, 2, 7), b = 2 * ent(r, 2, 7);
    if (a === b) return null;
    const u = elegir(r, ["cm", "pulg", "m"]);
    const [T1, T2] = elegir(r, [["ABC", "DEF"], ["PQR", "STU"], ["JKL", "MNO"]]);
    const l = (t, i, j) => t[i] + t[j];
    return {
      tipo: "num",
      enunciado: `Δ${T1} ~ Δ${T2}. En Δ${T1}, ${l(T1, 0, 1)} = ${a} ${u} y ${l(T1, 1, 2)} = ${b} ${u}. En Δ${T2}, ${l(T2, 0, 1)} = ${String(a * k)} ${u}. ¿Cuánto mide ${l(T2, 1, 2)}?`,
      respuesta: b * k, tolerancia: 0.01, unidad: u,
      explicacion: `La razón es ${l(T2, 0, 1)}/${l(T1, 0, 1)} = ${a * k}/${a} = ${k}. ${l(T2, 1, 2)} corresponde a ${l(T1, 1, 2)}: ${b} × ${k} = ${b * k} ${u}.`,
      pista: `Alinea los vértices en orden: ${T1[0]}↔${T2[0]}, ${T1[1]}↔${T2[1]}, ${T1[2]}↔${T2[2]}.`,
      error: `Usar la razón invertida y obtener ${Math.round((b / k) * 100) / 100} ${u}.`
    };
  } };

  // M3 · Teorema de Tales
  P.tales = { repaso: "i3", modulo: "M3", indicador: "ES.G.47", nivel: 3, etiquetas: ["semejanza", "tales"], crear(r) {
    const a = ent(r, 2, 8), b = ent(r, 2, 9), t = ent(r, 2, 3);
    if (a === b) return null;
    const c = a * t, ok = b * t;
    const ops = [ok, t * (a + b), c, b + c].map(String);
    if (!distintas(ops)) return null;
    return {
      enunciado: `En ΔABC, DE ∥ BC, con D sobre AB y E sobre AC. Si AD = ${a}, DB = ${b} y AE = ${c}, ¿cuánto mide EC?`,
      opciones: ops,
      distractores: [null,
        `Usaste el lado completo AB = ${a + b} en lugar de DB. Tales compara AD/DB con AE/EC.`,
        `Copiaste AE = ${c}. EC se calcula con la proporción AD/DB = AE/EC.`,
        "Sumaste DB + AE. Los segmentos se relacionan con una proporción, no con una suma."],
      explicacion: `Por Tales: AD/DB = AE/EC → ${a}/${b} = ${c}/EC → ${a}·EC = ${b * c} → EC = ${ok}.`,
      pista: "Escribe la proporción con las partes de cada lado: la de arriba sobre la de abajo.",
      error: "Plantear la proporción con el lado completo o copiar un dato."
    };
  } };

  /* ---------- Fábrica ---------- */
  function generar(clave, seed) {
    const g = P[clave];
    if (!g) return null;
    const r = prng(seed);
    let base = null;
    for (let i = 0; i < 60 && !base; i++) base = g.crear(r);
    if (!base) return null;
    const it = Object.assign({
      id: `GEN:${clave}:${seed}`, modulo: g.modulo, indicador: g.indicador, tipo: "sm", nivel: g.nivel,
      etiquetas: g.etiquetas.concat("variante"), generado: true, repaso: g.repaso
    }, base);
    if (it.tipo === "sm") { // barajar opciones con la misma semilla
      const orden = it.opciones.map((_, i) => i);
      for (let i = orden.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
      it.opciones = orden.map(i => base.opciones[i]);
      it.distractores = orden.map(i => base.distractores[i]);
      it.respuesta = orden.indexOf(0);
    }
    return it;
  }

  function desdeId(id) {
    const m = /^GEN:([a-z]+):(\d+)$/.exec(String(id));
    return m ? generar(m[1], Number(m[2])) : null;
  }

  // Una variante nueva de cada plantilla del módulo (o de todas si mod es null).
  function nuevos(mod) {
    return Object.keys(P)
      .filter(k => !mod || P[k].modulo === mod)
      .map(k => generar(k, Math.floor(Math.random() * 2147483647)))
      .filter(Boolean);
  }

  return { generar, desdeId, nuevos, claves: Object.keys(P), modulo: k => P[k] && P[k].modulo };
})();
