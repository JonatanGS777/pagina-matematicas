/*
 * MathMasters | Jefes y API pública de problemas
 *
 * Un jefe es un problema de tres pasos que comparten el mismo contexto: cada
 * paso resuelto rompe una capa de su escudo. El rango escala los números.
 */
(function (global) {
  'use strict';

  var P = global.MMProblemasBase;
  var ri = P.ri, nz = P.nz, pick = P.pick, num = P.num, poli = P.poli;

  function paso(tema, rango, es, en, respuesta, pistaEs, pistaEn, tol) {
    return num(tema, rango, es, en, respuesta, pistaEs, pistaEn, tol);
  }

  var JEFES = {
    aritmetica: function (rango, k) {
      var precio = ri(12, 30) * k, cantidad = ri(3, 8), desc = pick([10, 15, 20, 25]);
      var bruto = precio * cantidad, rebaja = bruto * desc / 100;
      return {
        nombre: { es: 'Recaudador de impuestos', en: 'The tax collector' },
        contexto: { es: 'Compras $' + cantidad + '$ artículos de $\\$' + precio + '$ cada uno con $' + desc + '\\%$ de descuento.',
          en: 'You buy $' + cantidad + '$ items at $\\$' + precio + '$ each with a $' + desc + '\\%$ discount.' },
        pasos: [
          paso('aritmetica', rango, '¿Cuánto cuesta sin descuento?', 'What is the cost before the discount?', bruto,
            'Multiplica precio por cantidad.', 'Multiply price by quantity.'),
          paso('aritmetica', rango, '¿Cuánto dinero ahorras?', 'How much money do you save?', rebaja,
            'Calcula el ' + desc + '% del total.', 'Take ' + desc + '% of the total.', 0.01),
          paso('aritmetica', rango, '¿Cuánto pagas al final?', 'How much do you pay in the end?', bruto - rebaja,
            'Resta el ahorro al total.', 'Subtract the savings from the total.', 0.01)
        ]
      };
    },
    algebra: function (rango, k) {
      var x = nz(-5 * k, 6 * k), y = nz(-5 * k, 6 * k), a = nz(-4, 5), b = nz(-4, 5), c, e;
      do { c = nz(-4, 5); e = nz(-4, 5); } while (a * e - b * c === 0);
      var sis = '$\\begin{cases} ' + poli([a, b], ['x', 'y']) + ' = ' + (a * x + b * y) + ' \\\\ ' +
        poli([c, e], ['x', 'y']) + ' = ' + (c * x + e * y) + ' \\end{cases}$';
      return {
        nombre: { es: 'Hidra de dos cabezas', en: 'The two-headed hydra' },
        contexto: { es: 'Resuelve el sistema ' + sis, en: 'Solve the system ' + sis },
        pasos: [
          paso('algebra', rango, 'Escribe el valor de $x$.', 'Enter the value of $x$.', x,
            'Elimina $y$ combinando las ecuaciones.', 'Eliminate $y$ by combining the equations.'),
          paso('algebra', rango, 'Escribe el valor de $y$.', 'Enter the value of $y$.', y,
            'Sustituye $x$ en cualquiera de las ecuaciones.', 'Substitute $x$ into either equation.'),
          paso('algebra', rango, 'Calcula $x^{2} - xy$.', 'Compute $x^{2} - xy$.', x * x - x * y,
            'Usa los dos valores que ya encontraste.', 'Use both values you already found.')
        ]
      };
    },
    geometria: function (rango, k) {
      var r = ri(2, 4) * k, h = ri(3, 7) * k;
      var g = Math.sqrt(r * r + h * h);
      return {
        nombre: { es: 'Coloso cónico', en: 'The conic colossus' },
        contexto: { es: 'Un cono tiene radio $' + r + '$ y altura $' + h + '$.', en: 'A cone has radius $' + r + '$ and height $' + h + '$.' },
        pasos: [
          paso('geometria', rango, 'Calcula la generatriz (dos decimales).', 'Find the slant height (two decimals).', g,
            '$g = \\sqrt{r^{2} + h^{2}}$', '$g = \\sqrt{r^{2} + h^{2}}$', 0.01),
          paso('geometria', rango, 'Calcula el volumen (dos decimales).', 'Find the volume (two decimals).', Math.PI * r * r * h / 3,
            '$V = \\tfrac{1}{3}\\pi r^{2} h$', '$V = \\tfrac{1}{3}\\pi r^{2} h$', 0.05 * k * k),
          paso('geometria', rango, 'Calcula el área lateral (dos decimales).', 'Find the lateral area (two decimals).', Math.PI * r * g,
            '$A = \\pi r g$', '$A = \\pi r g$', 0.05 * k * k)
        ]
      };
    },
    fracciones: function (rango, k) {
      var total = ri(4, 9) * 12 * k;
      return {
        nombre: { es: 'Guardián del tanque', en: 'The tank warden' },
        contexto: { es: 'Un tanque tiene $' + total + '$ litros. Se usa $\\tfrac{1}{3}$ el lunes y $\\tfrac{1}{4}$ de lo que queda el martes.',
          en: 'A tank holds $' + total + '$ liters. $\\tfrac{1}{3}$ is used on Monday and $\\tfrac{1}{4}$ of what is left on Tuesday.' },
        pasos: [
          paso('fracciones', rango, '¿Cuántos litros quedan tras el lunes?', 'How many liters remain after Monday?', total * 2 / 3,
            'Queda $\\tfrac{2}{3}$ del tanque.', '$\\tfrac{2}{3}$ of the tank remains.'),
          paso('fracciones', rango, '¿Cuántos litros se usan el martes?', 'How many liters are used on Tuesday?', total * 2 / 3 / 4,
            'Toma $\\tfrac{1}{4}$ de lo que quedaba.', 'Take $\\tfrac{1}{4}$ of what was left.'),
          paso('fracciones', rango, '¿Qué fracción del tanque original queda? (fracción o decimal)', 'What fraction of the original tank remains? (fraction or decimal)', 0.5,
            'Divide lo que queda entre el total inicial.', 'Divide what remains by the starting total.', 0.002)
        ]
      };
    },
    funciones: function (rango, k) {
      var a = nz(-3, 3), h = nz(-4 * k, 4 * k), v = ri(-9, 9);
      var b = -2 * a * h, c = a * h * h + v;
      var tex = '$f(x) = ' + poli([a, b, c], ['x^{2}', 'x', '']) + '$';
      return {
        nombre: { es: 'Serpiente parabólica', en: 'The parabolic serpent' },
        contexto: { es: 'Analiza ' + tex, en: 'Analyze ' + tex },
        pasos: [
          paso('funciones', rango, 'Coordenada $x$ del vértice.', 'The $x$ coordinate of the vertex.', h,
            '$x_v = -\\dfrac{b}{2a}$', '$x_v = -\\dfrac{b}{2a}$'),
          paso('funciones', rango, 'Coordenada $y$ del vértice.', 'The $y$ coordinate of the vertex.', v,
            'Evalúa $f$ en $x_v$.', 'Evaluate $f$ at $x_v$.'),
          paso('funciones', rango, 'Valor de $f(' + (h + 2) + ')$.', 'The value of $f(' + (h + 2) + ')$.', a * 4 + v,
            'Sustituye en la función.', 'Substitute into the function.')
        ]
      };
    },
    estadistica: function (rango, k) {
      var datos = [], n = 5;
      for (var i = 0; i < n; i++) datos.push(ri(2, 12) * k);
      var m = datos.reduce(function (s, x) { return s + x; }, 0) / n;
      var varianza = datos.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / n;
      var lista = '$' + datos.join(',\\ ') + '$';
      return {
        nombre: { es: 'Oráculo de los datos', en: 'The data oracle' },
        contexto: { es: 'Datos: ' + lista, en: 'Data: ' + lista },
        pasos: [
          paso('estadistica', rango, 'Calcula la media.', 'Find the mean.', m, 'Suma y divide entre 5.', 'Add and divide by 5.', 0.01),
          paso('estadistica', rango, 'Calcula la varianza poblacional (dos decimales).', 'Find the population variance (two decimals).', varianza,
            'Promedio de los cuadrados de las desviaciones.', 'Average of the squared deviations.', 0.01),
          paso('estadistica', rango, 'Calcula la desviación estándar (dos decimales).', 'Find the standard deviation (two decimals).', Math.sqrt(varianza),
            'Raíz cuadrada de la varianza.', 'Square root of the variance.', 0.01)
        ]
      };
    },
    trigonometria: function (rango, k) {
      var ang = pick([30, 35, 40, 50, 55, 60]), d = ri(20, 40) * k;
      var altura = d * Math.tan(ang * Math.PI / 180);
      return {
        nombre: { es: 'Torre del vigía', en: 'The watchtower' },
        contexto: { es: 'Desde $' + d + '$ m de una torre ves su punta con un ángulo de $' + ang + '^{\\circ}$.',
          en: 'From $' + d + '$ m away you see the top of a tower at a $' + ang + '^{\\circ}$ angle.' },
        pasos: [
          paso('trigonometria', rango, 'Altura de la torre (dos decimales).', 'Height of the tower (two decimals).', altura,
            'Altura $= d \\tan$ del ángulo.', 'Height $= d \\tan$ of the angle.', 0.05),
          paso('trigonometria', rango, 'Distancia en línea recta hasta la punta (dos decimales).', 'Straight-line distance to the top (two decimals).', d / Math.cos(ang * Math.PI / 180),
            'Distancia $= \\dfrac{d}{\\cos}$ del ángulo.', 'Distance $= \\dfrac{d}{\\cos}$ of the angle.', 0.05),
          paso('trigonometria', rango, 'Ángulo si te acercas a la mitad de la distancia (grados, dos decimales).', 'The angle if you walk to half the distance (degrees, two decimals).',
            Math.atan(altura / (d / 2)) * 180 / Math.PI, '$\\theta = \\arctan\\dfrac{h}{d/2}$', '$\\theta = \\arctan\\dfrac{h}{d/2}$', 0.05)
        ]
      };
    },
    calculo: function (rango, k) {
      var a = nz(-2, 2), b = ri(-3, 3) * k, c = ri(-6, 6) * k, x0 = ri(-2, 2);
      var f = function (x) { return a * x * x * x + b * x * x + c * x; };
      var fp = 3 * a * x0 * x0 + 2 * b * x0 + c;
      var tex = '$f(x) = ' + poli([a, b, c], ['x^{3}', 'x^{2}', 'x']) + '$';
      return {
        nombre: { es: 'Espectro de la tangente', en: 'The tangent wraith' },
        contexto: { es: 'Con ' + tex + ' y el punto $x_0 = ' + x0 + '$.', en: 'With ' + tex + ' and the point $x_0 = ' + x0 + '$.' },
        pasos: [
          paso('calculo', rango, 'Calcula $f(x_0)$.', 'Compute $f(x_0)$.', f(x0), 'Sustituye en $f$.', 'Substitute into $f$.'),
          paso('calculo', rango, 'Pendiente de la tangente en $x_0$.', 'Slope of the tangent at $x_0$.', fp, 'Es $f\'(x_0)$.', 'It is $f\'(x_0)$.'),
          paso('calculo', rango, 'Ordenada al origen de esa recta tangente.', 'The y-intercept of that tangent line.', f(x0) - fp * x0,
            '$y = f(x_0) + f\'(x_0)(x - x_0)$ evaluada en $x = 0$.', '$y = f(x_0) + f\'(x_0)(x - x_0)$ evaluated at $x = 0$.')
        ]
      };
    },
    combinatoria: function (rango, k) {
      var h = ri(4, 6) + k, m = ri(3, 5) + k;
      return {
        nombre: { es: 'Arquitecto de comités', en: 'The committee architect' },
        contexto: { es: 'Un club tiene $' + h + '$ hombres y $' + m + '$ mujeres. Se forma un comité de 4.',
          en: 'A club has $' + h + '$ men and $' + m + '$ women. A committee of 4 is formed.' },
        pasos: [
          paso('combinatoria', rango, '¿Cuántos comités hay en total?', 'How many committees are possible in total?', P.nCr(h + m, 4),
            '$C(n, 4)$ con todos los miembros.', '$C(n, 4)$ with every member.'),
          paso('combinatoria', rango, '¿Cuántos tienen exactamente 2 mujeres?', 'How many have exactly 2 women?', P.nCr(m, 2) * P.nCr(h, 2),
            'Elige 2 mujeres y 2 hombres, y multiplica.', 'Choose 2 women and 2 men, then multiply.'),
          paso('combinatoria', rango, 'Probabilidad de exactamente 2 mujeres (fracción o decimal).', 'Probability of exactly 2 women (fraction or decimal).',
            P.nCr(m, 2) * P.nCr(h, 2) / P.nCr(h + m, 4), 'Casos favorables entre casos totales.', 'Favorable cases over total cases.', 0.002)
        ]
      };
    }
  };

  /* ------------------------------------------------------------------ *
   * API
   * ------------------------------------------------------------------ */

  // d es el nivel adaptativo dentro del rango (1 a 3).
  function generar(tema, rango, d) {
    var g = P.generadores[tema];
    return g[rango](Math.max(1, Math.min(3, d || 1)));
  }

  function jefe(tema, rango) {
    var escala = { base: 1, avanzado: 2, maestro: 3 }[rango] || 1;
    var j = JEFES[tema](rango, escala);
    j.tema = tema;
    j.rango = rango;
    return j;
  }

  // Acepta enteros, decimales con punto o coma, fracciones "a/b" y "x = ...".
  function interpretar(texto) {
    if (texto == null) return NaN;
    var s = String(texto).trim().replace(/\s+/g, '').replace(/^[a-z]=/i, '').replace(/−/g, '-').replace(',', '.');
    if (!s) return NaN;
    var partes = s.split('/');
    if (partes.length === 2) {
      var n = Number(partes[0]), d = Number(partes[1]);
      return (isFinite(n) && isFinite(d) && d !== 0) ? n / d : NaN;
    }
    return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s) ? Number(s) : NaN;
  }

  function validar(problema, entrada) {
    if (problema.tipo === 'opc') return Number(entrada) === problema.correcta;
    var v = interpretar(entrada);
    if (!isFinite(v)) return false;
    var tol = Math.max(problema.tolerancia || 0, Math.abs(problema.respuesta) * 1e-9);
    return Math.abs(v - problema.respuesta) <= tol + 1e-9;
  }

  // Texto de la respuesta correcta, para mostrarla tras un fallo.
  function respuestaTexto(problema) {
    if (problema.tipo === 'opc') return '$' + problema.opciones[problema.correcta] + '$';
    var r = problema.respuesta;
    if (Number.isInteger(r)) return String(r);
    return String(Math.round(r * 100) / 100);
  }

  global.MMProblemas = {
    TEMAS: P.TEMAS,
    RANGOS: P.RANGOS,
    generar: generar,
    jefe: jefe,
    validar: validar,
    interpretar: interpretar,
    respuestaTexto: respuestaTexto
  };
})(typeof window !== 'undefined' ? window : globalThis);
