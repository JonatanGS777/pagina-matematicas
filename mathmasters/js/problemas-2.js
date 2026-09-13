/*
 * MathMasters | Generador de problemas (temas 4 a 9)
 */
(function (global) {
  'use strict';

  var P = global.MMProblemasBase;
  var ri = P.ri, nz = P.nz, pick = P.pick, gcd = P.gcd, num = P.num, opc = P.opc, poli = P.poli;

  /* ------------------------------------------------------------------ *
   * 4. Fracciones
   * ------------------------------------------------------------------ */

  function fr(n, d) { return '\\frac{' + n + '}{' + d + '}'; }

  var fracciones = {
    base: function (d) {
      var d1 = ri(2, 6 + d), d2;
      do { d2 = ri(2, 7 + d); } while (d2 === d1);
      var n1 = ri(1, d1 + 2), n2 = ri(1, d2 + 2), resta = Math.random() < 0.4;
      var valor = n1 / d1 + (resta ? -1 : 1) * n2 / d2;
      var tex = '$' + fr(n1, d1) + (resta ? ' - ' : ' + ') + fr(n2, d2) + '$';
      return num('fracciones', 'base', 'Calcula ' + tex + ' (fracción o decimal)',
        'Compute ' + tex + ' (fraction or decimal)', valor,
        'Busca un denominador común antes de operar.', 'Find a common denominator first.', 0.005);
    },
    avanzado: function (d) {
      var e1 = ri(1, 3), n1 = ri(1, 4), d1 = ri(n1 + 1, 7);
      var e2 = ri(1, 2 + d), n2 = ri(1, 4), d2 = ri(n2 + 1, 6);
      var a = (e1 * d1 + n1) / d1, b = (e2 * d2 + n2) / d2, dividir = Math.random() < 0.5;
      var tex = '$' + e1 + fr(n1, d1) + (dividir ? ' \\div ' : ' \\times ') + e2 + fr(n2, d2) + '$';
      return num('fracciones', 'avanzado', 'Calcula ' + tex + ' (fracción o decimal)',
        'Compute ' + tex + ' (fraction or decimal)', dividir ? a / b : a * b,
        'Convierte los números mixtos en fracciones impropias.', 'Turn the mixed numbers into improper fractions.', 0.005);
    },
    maestro: function (d) {
      var a = ri(1, 5), b = ri(2, 6), c = ri(1, 5), e = ri(2, 7), f = ri(1, 6), g = ri(2, 5 + d);
      var valor = (a / b + c / e) / (f / g);
      var tex = '$\\dfrac{' + fr(a, b) + ' + ' + fr(c, e) + '}{' + fr(f, g) + '}$';
      return num('fracciones', 'maestro', 'Simplifica ' + tex + ' (fracción o decimal)',
        'Simplify ' + tex + ' (fraction or decimal)', valor,
        'Resuelve el numerador y luego multiplica por el recíproco del denominador.',
        'Solve the numerator, then multiply by the reciprocal of the denominator.', 0.005);
    }
  };

  /* ------------------------------------------------------------------ *
   * 5. Funciones
   * ------------------------------------------------------------------ */

  var funciones = {
    base: function (d) {
      var a = nz(-4, 5), b = ri(-8, 8), c = ri(-10, 10), x = nz(-4 - d, 4 + d);
      var tex = '$f(x) = ' + poli([a, b, c], ['x^{2}', 'x', '']) + '$';
      return num('funciones', 'base', 'Si ' + tex + ', calcula $f(' + x + ')$',
        'If ' + tex + ', find $f(' + x + ')$', a * x * x + b * x + c,
        'Sustituye $x$ entre paréntesis para no perder el signo.', 'Substitute $x$ in parentheses to keep the sign.');
    },
    avanzado: function (d) {
      var a = nz(-4, 5), b = ri(-6, 6), p = nz(-3, 3), q = ri(-5, 5), x = ri(-3, 3 + d);
      var g = p * x * x + q;
      var texF = '$f(x) = ' + poli([a, b], ['x', '']) + '$', texG = '$g(x) = ' + poli([p, q], ['x^{2}', '']) + '$';
      return num('funciones', 'avanzado',
        'Con ' + texF + ' y ' + texG + ', calcula $f(g(' + x + '))$',
        'With ' + texF + ' and ' + texG + ', find $f(g(' + x + '))$', a * g + b,
        'Primero $g(' + x + ')$, después aplica $f$ a ese resultado.', 'First $g(' + x + ')$, then apply $f$ to that result.');
    },
    maestro: function (d) {
      var a = nz(-6, 7), b = ri(-12, 12), c = pick([1, 2, 3, 4]), y = ri(-6 - d, 8 + d);
      var tex = '$f(x) = \\dfrac{' + poli([a, b], ['x', '']) + '}{' + c + '}$';
      return num('funciones', 'maestro', 'Si ' + tex + ', calcula $f^{-1}(' + y + ')$ (dos decimales)',
        'If ' + tex + ', find $f^{-1}(' + y + ')$ (two decimals)', (c * y - b) / a,
        'Iguala $f(x) = ' + y + '$ y despeja $x$.', 'Set $f(x) = ' + y + '$ and solve for $x$.', 0.01);
    }
  };

  /* ------------------------------------------------------------------ *
   * 6. Estadística
   * ------------------------------------------------------------------ */

  var estadistica = {
    base: function (d) {
      var n = ri(5, 7), datos = [];
      for (var i = 0; i < n; i++) datos.push(ri(1, 20 * d + 10));
      if (Math.random() < 0.5) {
        var media = datos.reduce(function (s, v) { return s + v; }, 0) / n;
        return num('estadistica', 'base', 'Media de $' + datos.join(',\\ ') + '$ (dos decimales)',
          'Mean of $' + datos.join(',\\ ') + '$ (two decimals)', media,
          'Suma todos los datos y divide entre cuántos son.', 'Add all values and divide by how many there are.', 0.01);
      }
      var orden = datos.slice().sort(function (x, y) { return x - y; });
      var med = n % 2 ? orden[(n - 1) / 2] : (orden[n / 2 - 1] + orden[n / 2]) / 2;
      return num('estadistica', 'base', 'Mediana de $' + datos.join(',\\ ') + '$',
        'Median of $' + datos.join(',\\ ') + '$', med,
        'Ordena los datos y toma el del centro.', 'Sort the values and take the middle one.', 0.001);
    },
    avanzado: function () {
      var suma = ri(3, 11), casos = 0;
      for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) if (a + b === suma) casos++;
      return num('estadistica', 'avanzado',
        'Se lanzan dos dados. ¿Cuál es la probabilidad de que la suma sea $' + suma + '$? (fracción o decimal)',
        'Two dice are rolled. What is the probability that the sum is $' + suma + '$? (fraction or decimal)',
        casos / 36, 'Hay 36 resultados posibles; cuenta los que suman ' + suma + '.',
        'There are 36 outcomes; count the ones that add to ' + suma + '.', 0.002);
    },
    maestro: function (d) {
      if (Math.random() < 0.5) {
        var base = ri(2, 10), datos = [], n = ri(4, 5);
        for (var i = 0; i < n; i++) datos.push(base + ri(-4 - d, 4 + d));
        var m = datos.reduce(function (s, v) { return s + v; }, 0) / n;
        var sd = Math.sqrt(datos.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / n);
        return num('estadistica', 'maestro',
          'Desviación estándar poblacional de $' + datos.join(',\\ ') + '$ (dos decimales)',
          'Population standard deviation of $' + datos.join(',\\ ') + '$ (two decimals)', sd,
          '$\\sigma = \\sqrt{\\tfrac{1}{n}\\sum (x_i - \\bar{x})^{2}}$', '$\\sigma = \\sqrt{\\tfrac{1}{n}\\sum (x_i - \\bar{x})^{2}}$', 0.01);
      }
      var rojas = ri(3, 8), azules = ri(3, 8), total = rojas + azules;
      return num('estadistica', 'maestro',
        'Una bolsa tiene $' + rojas + '$ bolas rojas y $' + azules + '$ azules. Sacas dos sin reemplazo. ¿Probabilidad de que ambas sean rojas? (fracción o decimal)',
        'A bag has $' + rojas + '$ red and $' + azules + '$ blue balls. You draw two without replacement. Probability both are red? (fraction or decimal)',
        (rojas / total) * ((rojas - 1) / (total - 1)),
        'Multiplica la probabilidad de la primera por la de la segunda, ya con una bola menos.',
        'Multiply the first probability by the second one, with one ball fewer.', 0.002);
    }
  };

  /* ------------------------------------------------------------------ *
   * 7. Trigonometría
   * ------------------------------------------------------------------ */

  var EXACTOS = {
    sin: { 0: '0', 30: '\\frac{1}{2}', 45: '\\frac{\\sqrt{2}}{2}', 60: '\\frac{\\sqrt{3}}{2}', 90: '1' },
    cos: { 0: '1', 30: '\\frac{\\sqrt{3}}{2}', 45: '\\frac{\\sqrt{2}}{2}', 60: '\\frac{1}{2}', 90: '0' },
    tan: { 0: '0', 30: '\\frac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}' }
  };

  // Valor exacto con el ángulo de referencia; el signo sale del valor numérico.
  function exacto(func, angulo) {
    var ref = angulo % 180;
    var base = ref > 90 ? 180 - ref : ref;
    var t = EXACTOS[func][base];
    if (t === '0') return '0';
    var rad = angulo * Math.PI / 180;
    var valor = func === 'sin' ? Math.sin(rad) : (func === 'cos' ? Math.cos(rad) : Math.tan(rad));
    return (valor < 0 ? '-' : '') + t;
  }

  var trigonometria = {
    base: function () {
      var func = pick(['sin', 'cos', 'tan']);
      var angulos = func === 'tan' ? [0, 30, 45, 60, 120, 135, 150, 210, 225, 315] : [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330];
      var ang = pick(angulos), correcta = exacto(func, ang);
      var pool = ['0', '1', '-1', '\\frac{1}{2}', '-\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '-\\frac{\\sqrt{2}}{2}',
        '\\frac{\\sqrt{3}}{2}', '-\\frac{\\sqrt{3}}{2}', '\\sqrt{3}', '-\\sqrt{3}', '\\frac{\\sqrt{3}}{3}'];
      P.barajar(pool);
      var tex = '$\\' + func + '(' + ang + '^{\\circ})$';
      return opc('trigonometria', 'base', '¿Cuánto vale ' + tex + '?', 'What is ' + tex + '?', correcta, pool,
        'Usa el ángulo de referencia y el signo del cuadrante.', 'Use the reference angle and the sign of the quadrant.');
    },
    avanzado: function (d) {
      var ang = pick([20, 25, 35, 40, 50, 55, 65, 70]), hip = ri(8, 20 + d);
      if (Math.random() < 0.5) {
        return num('trigonometria', 'avanzado',
          'En un triángulo rectángulo la hipotenusa mide $' + hip + '$ y un ángulo agudo mide $' + ang + '^{\\circ}$. Calcula el cateto opuesto (dos decimales)',
          'In a right triangle the hypotenuse is $' + hip + '$ and an acute angle is $' + ang + '^{\\circ}$. Find the opposite leg (two decimals)',
          hip * Math.sin(ang * Math.PI / 180), 'Opuesto $= $ hipotenusa $\\cdot \\sin$ del ángulo.', 'Opposite $= $ hypotenuse $\\cdot \\sin$ of the angle.', 0.02);
      }
      var ady = ri(5, 15 + d);
      return num('trigonometria', 'avanzado',
        'Una escalera forma $' + ang + '^{\\circ}$ con el piso y su base está a $' + ady + '$ m de la pared. ¿A qué altura toca la pared? (dos decimales)',
        'A ladder makes $' + ang + '^{\\circ}$ with the floor and its base is $' + ady + '$ m from the wall. How high does it reach? (two decimals)',
        ady * Math.tan(ang * Math.PI / 180), 'Altura $= $ distancia $\\cdot \\tan$ del ángulo.', 'Height $= $ distance $\\cdot \\tan$ of the angle.', 0.02);
    },
    maestro: function () {
      var casos = [
        { tex: '2\\sin x = \\sqrt{3}', sol: [60, 120] },
        { tex: '2\\cos x = -1', sol: [120, 240] },
        { tex: '\\tan x = -1', sol: [135, 315] },
        { tex: '2\\sin x + 1 = 0', sol: [210, 330] },
        { tex: '\\sqrt{2}\\cos x = 1', sol: [45, 315] },
        { tex: '2\\sin^{2} x = 1', sol: [45, 135, 225, 315] }
      ];
      var c = pick(casos), mayor = Math.random() < 0.5;
      return num('trigonometria', 'maestro',
        'Para $0^{\\circ} \\le x < 360^{\\circ}$, resuelve $' + c.tex + '$ y escribe la solución ' + (mayor ? 'mayor' : 'menor') + ' en grados',
        'For $0^{\\circ} \\le x < 360^{\\circ}$, solve $' + c.tex + '$ and enter the ' + (mayor ? 'largest' : 'smallest') + ' solution in degrees',
        mayor ? Math.max.apply(null, c.sol) : Math.min.apply(null, c.sol),
        'Despeja la función trigonométrica y busca los cuadrantes con ese signo.',
        'Isolate the trig function and find the quadrants with that sign.', 0.01);
    }
  };

  /* ------------------------------------------------------------------ *
   * 8. Cálculo
   * ------------------------------------------------------------------ */

  var calculo = {
    base: function (d) {
      var a = nz(-4, 5), b = ri(-6, 6), c = ri(-9, 9), x = nz(-3, 3 + d);
      var tex = '$f(x) = ' + poli([a, b, c], ['x^{3}', 'x^{2}', 'x']) + '$';
      return num('calculo', 'base', 'Si ' + tex + ', calcula $f\'(' + x + ')$',
        'If ' + tex + ', find $f\'(' + x + ')$', 3 * a * x * x + 2 * b * x + c,
        'Deriva término a término: $(x^{n})\' = n x^{n-1}$.', 'Differentiate term by term: $(x^{n})\' = n x^{n-1}$.');
    },
    avanzado: function (d) {
      var a = nz(-3, 4), b = ri(-5, 5), n = ri(2, 4), x = ri(-2, 2 + Math.min(d, 1));
      var tex = '$f(x) = (' + poli([a, b], ['x', '']) + ')^{' + n + '}$';
      return num('calculo', 'avanzado', 'Si ' + tex + ', calcula $f\'(' + x + ')$',
        'If ' + tex + ', find $f\'(' + x + ')$', n * Math.pow(a * x + b, n - 1) * a,
        'Regla de la cadena: baja el exponente y multiplica por la derivada de adentro.',
        'Chain rule: bring down the exponent and multiply by the inner derivative.');
    },
    maestro: function (d) {
      var p = nz(-3, 4), q = ri(-6, 6), r = ri(-5, 5), a = ri(-2, 1), b = a + ri(1, 3 + Math.min(d, 1));
      function F(x) { return p * x * x * x / 3 + q * x * x / 2 + r * x; }
      var tex = '$\\displaystyle\\int_{' + a + '}^{' + b + '} (' + poli([p, q, r], ['x^{2}', 'x', '']) + ')\\,dx$';
      return num('calculo', 'maestro', 'Calcula ' + tex + ' (fracción o dos decimales)',
        'Compute ' + tex + ' (fraction or two decimals)', F(b) - F(a),
        'Encuentra la antiderivada y evalúa $F(b) - F(a)$.', 'Find the antiderivative and evaluate $F(b) - F(a)$.', 0.01);
    }
  };

  /* ------------------------------------------------------------------ *
   * 9. Combinatoria
   * ------------------------------------------------------------------ */

  var PALABRAS = ['BANANA', 'CARACOL', 'ESTRELLA', 'COMETA', 'PAPAYA', 'ALGEBRA', 'RADAR', 'TETERA', 'MANZANA'];

  var combinatoria = {
    base: function (d) {
      var n = ri(5, 8 + d), r = ri(2, 4);
      return num('combinatoria', 'base',
        'Hay $' + n + '$ corredores. ¿De cuántas formas se pueden repartir los primeros ' + r + ' lugares?',
        'There are $' + n + '$ runners. In how many ways can the top ' + r + ' places be awarded?',
        P.nPr(n, r), '$P(n, r) = \\dfrac{n!}{(n-r)!}$', '$P(n, r) = \\dfrac{n!}{(n-r)!}$');
    },
    avanzado: function (d) {
      var n = ri(6, 10 + d), r = ri(2, 5);
      return num('combinatoria', 'avanzado',
        'Un comité de $' + r + '$ personas se elige entre $' + n + '$ candidatos. ¿Cuántos comités distintos hay?',
        'A committee of $' + r + '$ people is chosen from $' + n + '$ candidates. How many different committees are there?',
        P.nCr(n, r), 'El orden no importa: $C(n, r) = \\dfrac{n!}{r!\\,(n-r)!}$', 'Order does not matter: $C(n, r) = \\dfrac{n!}{r!\\,(n-r)!}$');
    },
    maestro: function () {
      var w = pick(PALABRAS), cuenta = {};
      for (var i = 0; i < w.length; i++) cuenta[w[i]] = (cuenta[w[i]] || 0) + 1;
      var total = P.fact(w.length);
      Object.keys(cuenta).forEach(function (k) { total /= P.fact(cuenta[k]); });
      return num('combinatoria', 'maestro',
        '¿Cuántos ordenamientos distintos tienen las letras de $\\text{' + w + '}$?',
        'How many distinct arrangements do the letters of $\\text{' + w + '}$ have?', total,
        'Divide $n!$ entre el factorial de cada letra repetida.', 'Divide $n!$ by the factorial of each repeated letter.');
    }
  };

  var g = P.generadores;
  g.fracciones = fracciones;
  g.funciones = funciones;
  g.estadistica = estadistica;
  g.trigonometria = trigonometria;
  g.calculo = calculo;
  g.combinatoria = combinatoria;
  void gcd;
})(typeof window !== 'undefined' ? window : globalThis);
