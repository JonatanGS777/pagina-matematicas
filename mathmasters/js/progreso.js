/*
 * MathMasters | Progreso, récords y logros
 *
 * Todo vive en localStorage. Si el navegador lo bloquea (modo privado), el
 * juego sigue funcionando con un progreso que dura solo la sesión.
 */
(function (global) {
  'use strict';

  var CLAVE = 'mathmasters:progreso';
  var TEMAS = ['aritmetica', 'algebra', 'geometria', 'fracciones', 'funciones',
    'estadistica', 'trigonometria', 'calculo', 'combinatoria'];
  var RANGOS = ['base', 'avanzado', 'maestro'];

  var LOGROS = [
    { id: 'primer-impacto', icono: 'crosshair', es: ['Primer impacto', 'Destruye tu primer cometa.'], en: ['First impact', 'Destroy your first comet.'] },
    { id: 'combo-10', icono: 'zap', es: ['Reacción en cadena', 'Llega a un combo de 10.'], en: ['Chain reaction', 'Reach a 10 combo.'] },
    { id: 'combo-25', icono: 'flame', es: ['Supernova', 'Llega a un combo de 25.'], en: ['Supernova', 'Reach a 25 combo.'] },
    { id: 'cazador', icono: 'swords', es: ['Cazador de jefes', 'Derrota a tu primer jefe.'], en: ['Boss hunter', 'Defeat your first boss.'] },
    { id: 'intocable', icono: 'shield', es: ['Intocable', 'Supera una región sin perder vidas.'], en: ['Untouchable', 'Clear a region without losing a life.'] },
    { id: 'maestro-tema', icono: 'medal', es: ['Maestro', 'Supera una región en rango maestro.'], en: ['Master', 'Clear a region on master rank.'] },
    { id: 'nueve-regiones', icono: 'map', es: ['Cartógrafo', 'Supera las nueve regiones en rango base.'], en: ['Cartographer', 'Clear all nine regions on base rank.'] },
    { id: 'gran-maestro', icono: 'trophy', es: ['Gran maestro', 'Supera las nueve regiones en rango maestro.'], en: ['Grandmaster', 'Clear all nine regions on master rank.'] },
    { id: 'superviviente', icono: 'infinity', es: ['Superviviente', 'Llega a la oleada 10 en supervivencia.'], en: ['Survivor', 'Reach wave 10 in survival.'] },
    { id: 'arcade', icono: 'star', es: ['Estrella del arcade', 'Consigue 15 000 puntos en arcade.'], en: ['Arcade star', 'Score 15,000 points in arcade.'] },
    { id: 'precision', icono: 'target', es: ['Puntería fina', 'Termina con 90% de acierto o más (mínimo 15 respuestas).'], en: ['Sharpshooter', 'Finish with 90% accuracy or more (at least 15 answers).'] },
    { id: 'estratega', icono: 'sparkles', es: ['Estratega', 'Usa 10 poderes en total.'], en: ['Strategist', 'Use 10 powers in total.'] }
  ];

  function vacio() {
    var regiones = {};
    TEMAS.forEach(function (t) {
      regiones[t] = {};
      RANGOS.forEach(function (r) { regiones[t][r] = { superado: false, estrellas: 0, record: 0 }; });
    });
    return {
      version: 1,
      regiones: regiones,
      records: { arcade: 0, supervivencia: 0, oleadaMax: 0, practica: 0 },
      logros: {},
      totales: { aciertos: 0, fallos: 0, jefes: 0, poderes: 0, partidas: 0 }
    };
  }

  var datos = vacio();
  try {
    var crudo = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (crudo && crudo.version === 1) {
      var base = vacio();
      TEMAS.forEach(function (t) {
        RANGOS.forEach(function (r) {
          if (crudo.regiones && crudo.regiones[t] && crudo.regiones[t][r]) base.regiones[t][r] = crudo.regiones[t][r];
        });
      });
      base.records = Object.assign(base.records, crudo.records || {});
      base.logros = crudo.logros || {};
      base.totales = Object.assign(base.totales, crudo.totales || {});
      datos = base;
    }
  } catch (e) { /* progreso de solo esta sesión */ }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* sin memoria */ }
  }

  function disponible(tema, rango) {
    var i = RANGOS.indexOf(rango);
    return i === 0 || datos.regiones[tema][RANGOS[i - 1]].superado;
  }

  function desbloquear(id, nuevos) {
    if (datos.logros[id]) return;
    datos.logros[id] = new Date().toISOString();
    nuevos.push(LOGROS.filter(function (l) { return l.id === id; })[0]);
  }

  /*
   * resumen: { modo, tema, rango, superado, vidasPerdidas, puntos, comboMax,
   *            aciertos, fallos, jefesDerrotados, poderesUsados, oleada }
   * Devuelve los logros nuevos y si hubo récord.
   */
  function registrarPartida(r) {
    var nuevos = [], record = false;
    var t = datos.totales;
    t.aciertos += r.aciertos;
    t.fallos += r.fallos;
    t.jefes += r.jefesDerrotados;
    t.poderes += r.poderesUsados;
    t.partidas++;

    if (r.modo === 'campana') {
      var reg = datos.regiones[r.tema][r.rango];
      if (r.puntos > reg.record) { reg.record = r.puntos; record = true; }
      if (r.superado) {
        reg.superado = true;
        var estrellas = r.vidasPerdidas === 0 ? 3 : (r.vidasPerdidas === 1 ? 2 : 1);
        reg.estrellas = Math.max(reg.estrellas, estrellas);
        if (r.vidasPerdidas === 0) desbloquear('intocable', nuevos);
        if (r.rango === 'maestro') desbloquear('maestro-tema', nuevos);
      }
      var todas = function (rango) { return TEMAS.every(function (tm) { return datos.regiones[tm][rango].superado; }); };
      if (todas('base')) desbloquear('nueve-regiones', nuevos);
      if (todas('maestro')) desbloquear('gran-maestro', nuevos);
    } else if (r.modo === 'arcade') {
      if (r.puntos > datos.records.arcade) { datos.records.arcade = r.puntos; record = true; }
      if (r.puntos >= 15000) desbloquear('arcade', nuevos);
    } else if (r.modo === 'supervivencia') {
      if (r.puntos > datos.records.supervivencia) { datos.records.supervivencia = r.puntos; record = true; }
      datos.records.oleadaMax = Math.max(datos.records.oleadaMax, r.oleada);
      if (r.oleada >= 10) desbloquear('superviviente', nuevos);
    } else if (r.modo === 'practica') {
      if (r.puntos > datos.records.practica) { datos.records.practica = r.puntos; record = true; }
    }

    if (t.aciertos > 0) desbloquear('primer-impacto', nuevos);
    if (r.comboMax >= 10) desbloquear('combo-10', nuevos);
    if (r.comboMax >= 25) desbloquear('combo-25', nuevos);
    if (t.jefes > 0) desbloquear('cazador', nuevos);
    if (t.poderes >= 10) desbloquear('estratega', nuevos);
    var respuestas = r.aciertos + r.fallos;
    if (respuestas >= 15 && r.aciertos / respuestas >= 0.9) desbloquear('precision', nuevos);

    guardar();
    return { nuevos: nuevos, record: record };
  }

  function reiniciar() {
    datos = vacio();
    guardar();
  }

  global.Progreso = {
    TEMAS: TEMAS,
    RANGOS: RANGOS,
    LOGROS: LOGROS,
    datos: function () { return datos; },
    disponible: disponible,
    registrarPartida: registrarPartida,
    reiniciar: reiniciar
  };
})(window);
