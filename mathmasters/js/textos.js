/*
 * MathMasters | Textos compartidos
 *
 * Casi toda la interfaz se construye desde JS, así que el idioma se decide
 * al dibujar con tr(es, en), apoyado en I18n.t del sitio. Al cambiar de
 * idioma en vivo, ui.js y juego.js vuelven a dibujar lo que esté visible.
 */
(function (global) {
  'use strict';

  function idioma() {
    return (global.I18n && global.I18n.getCurrentLang && global.I18n.getCurrentLang() === 'en') ? 'en' : 'es';
  }

  function tr(es, en) {
    return idioma() === 'en' && en ? en : es;
  }

  // Elige el texto de un par {es, en}.
  function par(obj) {
    if (!obj) return '';
    return idioma() === 'en' && obj.en ? obj.en : obj.es;
  }

  var TEMAS = {
    aritmetica: { es: 'Aritmética', en: 'Arithmetic', region: { es: 'Cinturón aritmético', en: 'Arithmetic belt' } },
    algebra: { es: 'Álgebra', en: 'Algebra', region: { es: 'Nebulosa del álgebra', en: 'Algebra nebula' } },
    geometria: { es: 'Geometría', en: 'Geometry', region: { es: 'Anillos geométricos', en: 'Geometric rings' } },
    fracciones: { es: 'Fracciones', en: 'Fractions', region: { es: 'Luna fraccionada', en: 'Fractured moon' } },
    funciones: { es: 'Funciones', en: 'Functions', region: { es: 'Estación de funciones', en: 'Function station' } },
    estadistica: { es: 'Estadística', en: 'Statistics', region: { es: 'Constelación estadística', en: 'Statistics constellation' } },
    trigonometria: { es: 'Trigonometría', en: 'Trigonometry', region: { es: 'Faro trigonométrico', en: 'Trigonometry beacon' } },
    calculo: { es: 'Cálculo', en: 'Calculus', region: { es: 'Horizonte del cálculo', en: 'Calculus horizon' } },
    combinatoria: { es: 'Combinatoria', en: 'Combinatorics', region: { es: 'Enjambre combinatorio', en: 'Combinatorics swarm' } }
  };

  var RANGOS = {
    base: { es: 'Base', en: 'Base', icono: 'star',
      desc: { es: 'Lo esencial del tema, cometas lentos.', en: 'The essentials of the topic, slow comets.' } },
    avanzado: { es: 'Avanzado', en: 'Advanced', icono: 'flame',
      desc: { es: 'Varios conceptos por problema, cometas más rápidos.', en: 'Several concepts per problem, faster comets.' } },
    maestro: { es: 'Maestro', en: 'Master', icono: 'medal',
      desc: { es: 'Nivel preuniversitario y un jefe implacable.', en: 'Pre-university level and a relentless boss.' } }
  };

  function tema(t) { return par(TEMAS[t]); }
  function region(t) { return par(TEMAS[t].region); }
  function rango(r) { return par(RANGOS[r]); }

  function numero(n) {
    return Math.round(n).toLocaleString(idioma() === 'en' ? 'en-US' : 'es-ES');
  }

  // Convierte los $...$ de un elemento en fórmulas con KaTeX.
  function formulas(el) {
    if (!el || !global.renderMathInElement) return;
    global.renderMathInElement(el, {
      delimiters: [{ left: '$', right: '$', display: false }],
      throwOnError: false
    });
  }

  function escapar(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  global.MM = {
    idioma: idioma, tr: tr, par: par,
    TEMAS: TEMAS, RANGOS: RANGOS,
    tema: tema, region: region, rango: rango,
    numero: numero, formulas: formulas, escapar: escapar,
    icono: function (n, c) { return global.Iconos.icono(n, c); }
  };
})(window);
