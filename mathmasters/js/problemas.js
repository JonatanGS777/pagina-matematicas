/*
 * MathMasters | Generador de problemas
 *
 * Nueve temas con tres rangos cada uno (base, avanzado, maestro) y un jefe
 * de varios pasos por tema. Cada problema guarda su enunciado y su pista en
 * los dos idiomas, así el HUD puede redibujarlo si el idioma cambia a mitad
 * de la partida.
 *
 * Forma de un problema:
 *   { tema, rango, tipo: 'num' | 'opc', enunciado: {es, en}, pista: {es, en},
 *     respuesta (num), tolerancia (num), opciones: [latex] y correcta (opc) }
 */
(function (global) {
  'use strict';

  var TEMAS = ['aritmetica', 'algebra', 'geometria', 'fracciones', 'funciones',
    'estadistica', 'trigonometria', 'calculo', 'combinatoria'];
  var RANGOS = ['base', 'avanzado', 'maestro'];

  /* ------------------------------------------------------------------ *
   * Utilidades
   * ------------------------------------------------------------------ */

  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function nz(a, b) { var v; do { v = ri(a, b); } while (v === 0); return v; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function nCr(n, r) { return fact(n) / (fact(r) * fact(n - r)); }
  function nPr(n, r) { return fact(n) / fact(n - r); }
  function barajar(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // Fracción simplificada en LaTeX.
  function fracTex(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1;
    n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  }

  // Coeficiente con signo para escribir polinomios: "+ 3x", "- x".
  function termino(coef, variable, primero) {
    if (coef === 0) return '';
    var abs = Math.abs(coef);
    var cuerpo = (variable && abs === 1) ? variable : abs + (variable || '');
    if (primero) return (coef < 0 ? '-' : '') + cuerpo;
    return (coef < 0 ? ' - ' : ' + ') + cuerpo;
  }

  function poli(coefs, vars) {
    var s = '', primero = true;
    for (var i = 0; i < coefs.length; i++) {
      if (coefs[i] === 0) continue;
      s += termino(coefs[i], vars[i], primero);
      primero = false;
    }
    return s || '0';
  }

  function num(tema, rango, es, en, respuesta, pistaEs, pistaEn, tolerancia) {
    return {
      tema: tema, rango: rango, tipo: 'num',
      enunciado: { es: es, en: en },
      pista: { es: pistaEs, en: pistaEn },
      respuesta: respuesta,
      tolerancia: tolerancia != null ? tolerancia : 1e-6
    };
  }

  function opc(tema, rango, es, en, correctaTex, distractores, pistaEs, pistaEn) {
    var lista = [correctaTex];
    for (var i = 0; i < distractores.length && lista.length < 4; i++) {
      if (lista.indexOf(distractores[i]) < 0) lista.push(distractores[i]);
    }
    barajar(lista);
    return {
      tema: tema, rango: rango, tipo: 'opc',
      enunciado: { es: es, en: en },
      pista: { es: pistaEs, en: pistaEn },
      opciones: lista,
      correcta: lista.indexOf(correctaTex)
    };
  }

  /* ------------------------------------------------------------------ *
   * 1. Aritmética
   * ------------------------------------------------------------------ */

  var aritmetica = {
    base: function (d) {
      var a = nz(-12 * d, 25 * d), b = nz(-12 * d, 12 * d), c = nz(-9, 9);
      var r = a * b - c;
      var tex = '$' + a + ' \\cdot (' + b + ') - (' + c + ')$';
      return num('aritmetica', 'base', 'Calcula ' + tex, 'Compute ' + tex, r,
        'Primero la multiplicación; restar un negativo es sumar.',
        'Multiply first; subtracting a negative means adding.');
    },
    avanzado: function (d) {
      var a = ri(2, 4 + d), b = ri(2, 3), c = ri(2, 9), e = ri(1, 6), f = ri(2, 5);
      var r = Math.pow(a, b) - c * (e - f) * (e - f);
      var tex = '$' + a + '^{' + b + '} - ' + c + '\\,(' + e + ' - ' + f + ')^{2}$';
      return num('aritmetica', 'avanzado', 'Calcula ' + tex, 'Compute ' + tex, r,
        'Orden: paréntesis, potencias, multiplicación y al final la resta.',
        'Order: parentheses, powers, multiplication, then the subtraction.');
    },
    maestro: function (d) {
      if (Math.random() < 0.5) {
        var p = ri(3, 8), q = ri(2, 7), s = ri(3, 9 + d), expo = ri(3, 6);
        var den = p + q + s - expo;
        var tex = '$\\dfrac{2^{' + (p + s) + '} \\cdot 2^{' + q + '}}{2^{' + den + '}}$';
        return num('aritmetica', 'maestro', 'Calcula ' + tex, 'Compute ' + tex, Math.pow(2, expo),
          'Suma los exponentes del numerador y resta el del denominador.',
          'Add the numerator exponents and subtract the denominator one.');
      }
      var x = pick([4, 6, 8, 9, 10, 12, 14, 15]), y = pick([6, 9, 10, 12, 15, 18, 20]), z = pick([8, 12, 14, 16, 21, 24]);
      var m = lcm(lcm(x, y), z);
      var texm = '$\\operatorname{mcm}(' + x + ', ' + y + ', ' + z + ')$';
      var texmEn = '$\\operatorname{lcm}(' + x + ', ' + y + ', ' + z + ')$';
      return num('aritmetica', 'maestro', 'Calcula ' + texm, 'Compute ' + texmEn, m,
        'Descompón en primos y toma cada primo con su mayor exponente.',
        'Factor into primes and take each prime with its highest exponent.');
    }
  };

  /* ------------------------------------------------------------------ *
   * 2. Álgebra
   * ------------------------------------------------------------------ */

  var algebra = {
    base: function (d) {
      var a = nz(-6 - d, 9 + d), x = nz(-9 * d, 12 * d), b = nz(-20, 20);
      var c = a * x + b;
      var tex = '$' + poli([a, b], ['x', '']) + ' = ' + c + '$';
      return num('algebra', 'base', 'Resuelve para $x$: ' + tex, 'Solve for $x$: ' + tex, x,
        'Pasa el término independiente al otro lado y divide entre el coeficiente de $x$.',
        'Move the constant to the other side and divide by the coefficient of $x$.');
    },
    avanzado: function (d) {
      var x = nz(-6, 8 + d), y = nz(-6, 8 + d), a, b, c, e;
      do { a = nz(-5, 6); b = nz(-5, 6); c = nz(-5, 6); e = nz(-5, 6); } while (a * e - b * c === 0);
      var s1 = a * x + b * y, s2 = c * x + e * y;
      var sis = '$\\begin{cases} ' + poli([a, b], ['x', 'y']) + ' = ' + s1 + ' \\\\ ' + poli([c, e], ['x', 'y']) + ' = ' + s2 + ' \\end{cases}$';
      return num('algebra', 'avanzado', 'Resuelve el sistema y escribe $x$: ' + sis,
        'Solve the system and enter $x$: ' + sis, x,
        'Multiplica una ecuación para eliminar $y$ al sumarlas.',
        'Scale one equation so $y$ cancels when you add them.');
    },
    maestro: function (d) {
      var r1 = nz(-9 - d, 9 + d), r2;
      do { r2 = nz(-9 - d, 9 + d); } while (r2 === r1);
      var k = pick([1, 1, 2, 3]);
      var b = -k * (r1 + r2), c = k * r1 * r2;
      var tex = '$' + poli([k, b, c], ['x^{2}', 'x', '']) + ' = 0$';
      return num('algebra', 'maestro', 'Escribe la raíz mayor de ' + tex, 'Enter the larger root of ' + tex,
        Math.max(r1, r2),
        'Factoriza o usa la fórmula general; compara las dos raíces.',
        'Factor or use the quadratic formula; compare both roots.');
    }
  };

  /* ------------------------------------------------------------------ *
   * 3. Geometría
   * ------------------------------------------------------------------ */

  var geometria = {
    base: function (d) {
      var tipo = ri(0, 2);
      if (tipo === 0) {
        var b = ri(4, 15 + 3 * d), h = ri(3, 12 + 3 * d);
        return num('geometria', 'base',
          'Área de un triángulo con base $' + b + '$ y altura $' + h + '$',
          'Area of a triangle with base $' + b + '$ and height $' + h + '$',
          b * h / 2, 'El área es la mitad de base por altura.', 'Area is half of base times height.');
      }
      if (tipo === 1) {
        var r = ri(2, 6 + d);
        return num('geometria', 'base',
          'Área de un círculo de radio $' + r + '$ (usa $\\pi \\approx 3.1416$, dos decimales)',
          'Area of a circle with radius $' + r + '$ (use $\\pi \\approx 3.1416$, two decimals)',
          Math.PI * r * r, '$A = \\pi r^{2}$', '$A = \\pi r^{2}$', 0.05 * r);
      }
      var l = ri(3, 12 + d), w = ri(3, 12 + d);
      return num('geometria', 'base',
        'Perímetro de un rectángulo de $' + l + '$ por $' + w + '$',
        'Perimeter of a $' + l + '$ by $' + w + '$ rectangle',
        2 * (l + w), 'Suma los cuatro lados.', 'Add all four sides.');
    },
    avanzado: function (d) {
      if (Math.random() < 0.5) {
        var a = ri(2, 9 + d), b = ri(2, 11 + d);
        var c = Math.sqrt(a * a + b * b);
        return num('geometria', 'avanzado',
          'Hipotenusa de un triángulo rectángulo con catetos $' + a + '$ y $' + b + '$ (dos decimales)',
          'Hypotenuse of a right triangle with legs $' + a + '$ and $' + b + '$ (two decimals)',
          c, 'Teorema de Pitágoras: $c = \\sqrt{a^{2} + b^{2}}$', 'Pythagorean theorem: $c = \\sqrt{a^{2} + b^{2}}$', 0.01);
      }
      var r = ri(2, 6), h = ri(3, 10 + d);
      return num('geometria', 'avanzado',
        'Volumen de un cilindro de radio $' + r + '$ y altura $' + h + '$ (dos decimales)',
        'Volume of a cylinder with radius $' + r + '$ and height $' + h + '$ (two decimals)',
        Math.PI * r * r * h, '$V = \\pi r^{2} h$', '$V = \\pi r^{2} h$', 0.05 * r * h);
    },
    maestro: function (d) {
      if (Math.random() < 0.5) {
        var a = ri(5, 14), b = ri(5, 14), C = pick([30, 45, 60, 75, 110, 120, 135]);
        var c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * Math.PI / 180));
        return num('geometria', 'maestro',
          'En un triángulo, $a = ' + a + '$, $b = ' + b + '$ y el ángulo entre ellos mide $' + C + '^{\\circ}$. Calcula $c$ (dos decimales)',
          'In a triangle, $a = ' + a + '$, $b = ' + b + '$ and the angle between them is $' + C + '^{\\circ}$. Find $c$ (two decimals)',
          c, 'Ley de cosenos: $c^{2} = a^{2} + b^{2} - 2ab\\cos C$', 'Law of cosines: $c^{2} = a^{2} + b^{2} - 2ab\\cos C$', 0.02);
      }
      var A = pick([30, 40, 45, 50, 60]), B = pick([55, 65, 70, 80]), lado = ri(6, 15 + d);
      var res = lado * Math.sin(B * Math.PI / 180) / Math.sin(A * Math.PI / 180);
      return num('geometria', 'maestro',
        'En un triángulo, $A = ' + A + '^{\\circ}$, $B = ' + B + '^{\\circ}$ y $a = ' + lado + '$. Calcula $b$ (dos decimales)',
        'In a triangle, $A = ' + A + '^{\\circ}$, $B = ' + B + '^{\\circ}$ and $a = ' + lado + '$. Find $b$ (two decimals)',
        res, 'Ley de senos: $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}$', 'Law of sines: $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}$', 0.02);
    }
  };

  global.MMProblemasBase = {
    TEMAS: TEMAS, RANGOS: RANGOS,
    ri: ri, nz: nz, pick: pick, gcd: gcd, lcm: lcm, fact: fact, nCr: nCr, nPr: nPr,
    barajar: barajar, fracTex: fracTex, poli: poli, num: num, opc: opc,
    generadores: { aritmetica: aritmetica, algebra: algebra, geometria: geometria }
  };
})(typeof window !== 'undefined' ? window : globalThis);
