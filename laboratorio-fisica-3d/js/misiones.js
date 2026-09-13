/*
 * Laboratorio de Física 3D - Misiones y progreso
 *
 * Cada estación tiene una secuencia de retos que se desbloquean en orden.
 * Hay dos tipos:
 *   prediccion  el estudiante calcula un número antes de correr el experimento
 *               y el laboratorio lo compara con el valor correcto
 *   reto        se cumple manipulando el experimento hasta lograr una condición
 *
 * El progreso se guarda en el navegador para que el estudiante pueda
 * cerrar la página y retomar donde iba.
 */
(function (global) {
  'use strict';

  var U = global.Util3D;
  var CLAVE = 'laboratorio-fisica-3d:progreso';
  var PUNTOS_BASE = 100;
  var PENALIZACION = 15;
  var PUNTOS_MINIMOS = 40;

  function Progreso(estaciones) {
    this.estaciones = estaciones;
    this.estudiante = { nombre: '', grupo: '' };
    this.datos = {};
    this.inicio = new Date();
    this.oyentes = [];
    this.cargar();
  }

  Progreso.prototype.alCambiar = function (fn) { this.oyentes.push(fn); };
  Progreso.prototype.notificar = function () {
    for (var i = 0; i < this.oyentes.length; i++) this.oyentes[i](this);
  };

  Progreso.prototype.registro = function (idEstacion, idMision) {
    if (!this.datos[idEstacion]) this.datos[idEstacion] = {};
    if (!this.datos[idEstacion][idMision]) {
      this.datos[idEstacion][idMision] = { completada: false, intentos: 0, respuesta: null, fecha: null };
    }
    return this.datos[idEstacion][idMision];
  };

  // Una misión queda disponible cuando la anterior de su estación se completó.
  Progreso.prototype.desbloqueada = function (estacion, indice) {
    if (indice === 0) return true;
    var previa = estacion.misiones[indice - 1];
    return this.registro(estacion.id, previa.id).completada;
  };

  Progreso.prototype.puntosDe = function (idEstacion, idMision) {
    var r = this.registro(idEstacion, idMision);
    if (!r.completada) return 0;
    return Math.max(PUNTOS_MINIMOS, PUNTOS_BASE - PENALIZACION * Math.max(0, r.intentos - 1));
  };

  Progreso.prototype.puntajeTotal = function () {
    var total = 0;
    for (var i = 0; i < this.estaciones.length; i++) {
      var e = this.estaciones[i];
      for (var j = 0; j < e.misiones.length; j++) {
        total += this.puntosDe(e.id, e.misiones[j].id);
      }
    }
    return total;
  };

  Progreso.prototype.puntajeMaximo = function () {
    var total = 0;
    for (var i = 0; i < this.estaciones.length; i++) {
      total += this.estaciones[i].misiones.length * PUNTOS_BASE;
    }
    return total;
  };

  Progreso.prototype.completadasEn = function (idEstacion) {
    var e = this.buscarEstacion(idEstacion);
    if (!e) return 0;
    var n = 0;
    for (var i = 0; i < e.misiones.length; i++) {
      if (this.registro(idEstacion, e.misiones[i].id).completada) n++;
    }
    return n;
  };

  Progreso.prototype.totalCompletadas = function () {
    var n = 0;
    for (var i = 0; i < this.estaciones.length; i++) {
      n += this.completadasEn(this.estaciones[i].id);
    }
    return n;
  };

  Progreso.prototype.totalMisiones = function () {
    var n = 0;
    for (var i = 0; i < this.estaciones.length; i++) n += this.estaciones[i].misiones.length;
    return n;
  };

  Progreso.prototype.buscarEstacion = function (id) {
    for (var i = 0; i < this.estaciones.length; i++) {
      if (this.estaciones[i].id === id) return this.estaciones[i];
    }
    return null;
  };

  // Nivel según cuántas misiones lleva resueltas.
  Progreso.prototype.nivel = function () {
    var hechas = this.totalCompletadas();
    var total = this.totalMisiones();
    var fraccion = total > 0 ? hechas / total : 0;
    if (fraccion >= 1) return { nombre: U.texto('Físico de laboratorio', 'Lab physicist'), indice: 5 };
    if (fraccion >= 0.75) return { nombre: U.texto('Investigador', 'Researcher'), indice: 4 };
    if (fraccion >= 0.5) return { nombre: U.texto('Experimentador', 'Experimenter'), indice: 3 };
    if (fraccion >= 0.25) return { nombre: U.texto('Ayudante de laboratorio', 'Lab assistant'), indice: 2 };
    if (hechas > 0) return { nombre: U.texto('Aprendiz', 'Apprentice'), indice: 1 };
    return { nombre: U.texto('Recién llegado', 'Newcomer'), indice: 0 };
  };

  /* ------------------------------------------------------------------ *
   * Evaluación
   * ------------------------------------------------------------------ */

  // Compara la respuesta del estudiante con el valor correcto. Se acepta
  // por tolerancia relativa, y además por una absoluta para los casos en
  // que el valor correcto ronda el cero.
  Progreso.prototype.evaluarPrediccion = function (estacion, mision, valor) {
    var r = this.registro(estacion.id, mision.id);

    if (mision.condicionPrevia && !mision.condicionPrevia(estacion)) {
      return { ok: false, mensaje: U.T(mision, 'avisoPrevio') || U.texto('Ajusta primero las condiciones del experimento.', 'Adjust the experiment conditions first.'), sinIntento: true };
    }
    if (!isFinite(valor)) {
      return { ok: false, mensaje: U.texto('Escribe un número para poder compararlo.', 'Enter a number so it can be compared.'), sinIntento: true };
    }

    var objetivo = mision.objetivo(estacion);
    var tolRel = mision.tolerancia != null ? mision.tolerancia : 0.05;
    var tolAbs = mision.toleranciaAbsoluta != null ? mision.toleranciaAbsoluta : 0;
    var error = Math.abs(valor - objetivo);
    var aceptado = error <= Math.abs(objetivo) * tolRel || error <= tolAbs;

    r.intentos++;
    r.respuesta = valor;

    if (aceptado) {
      r.completada = true;
      r.fecha = new Date().toISOString();
      r.valorCorrecto = objetivo;
      this.guardar();
      this.notificar();
      var desviacion = Math.abs(objetivo) > 1e-9 ? (error / Math.abs(objetivo) * 100) : 0;
      return {
        ok: true,
        mensaje: U.texto(
          'Correcto. El valor exacto es ' + formatear(objetivo) + ' y te quedaste a ' + desviacion.toFixed(1) + ' por ciento.',
          'Correct. The exact value is ' + formatear(objetivo) + ' and you were off by ' + desviacion.toFixed(1) + ' percent.'
        ),
        puntos: this.puntosDe(estacion.id, mision.id)
      };
    }

    this.guardar();
    this.notificar();
    var pista = valor > objetivo ? U.texto('Tu resultado es muy alto.', 'Your result is too high.') : U.texto('Tu resultado es muy bajo.', 'Your result is too low.');
    return { ok: false, mensaje: pista + ' ' + U.texto('Intento ', 'Attempt ') + r.intentos + '. ' + (U.T(mision, 'pista') || '') };
  };

  Progreso.prototype.evaluarReto = function (estacion, mision) {
    var r = this.registro(estacion.id, mision.id);
    var resultado = mision.verificar(estacion);
    r.intentos++;
    if (resultado.ok) {
      r.completada = true;
      r.fecha = new Date().toISOString();
      resultado.puntos = this.puntosDe(estacion.id, mision.id);
    }
    this.guardar();
    this.notificar();
    return resultado;
  };

  function formatear(v) {
    var abs = Math.abs(v);
    if (abs !== 0 && (abs < 0.001 || abs >= 100000)) return v.toExponential(3);
    if (abs >= 100) return v.toFixed(1);
    if (abs >= 1) return v.toFixed(3);
    return v.toFixed(4);
  }

  /* ------------------------------------------------------------------ *
   * Persistencia
   * ------------------------------------------------------------------ */

  Progreso.prototype.guardar = function () {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({
        estudiante: this.estudiante,
        datos: this.datos,
        inicio: this.inicio.toISOString()
      }));
    } catch (e) {
      // Modo privado o almacenamiento lleno: el laboratorio sigue
      // funcionando, solo que sin memoria entre sesiones.
    }
  };

  Progreso.prototype.cargar = function () {
    try {
      var crudo = localStorage.getItem(CLAVE);
      if (!crudo) return;
      var obj = JSON.parse(crudo);
      this.estudiante = obj.estudiante || { nombre: '', grupo: '' };
      this.datos = obj.datos || {};
      if (obj.inicio) this.inicio = new Date(obj.inicio);
    } catch (e) {
      this.datos = {};
    }
  };

  Progreso.prototype.reiniciarTodo = function () {
    this.datos = {};
    this.inicio = new Date();
    this.guardar();
    this.notificar();
  };

  // Resumen que usan el reporte en PDF y el CSV del profesor.
  Progreso.prototype.resumen = function () {
    var filas = [];
    for (var i = 0; i < this.estaciones.length; i++) {
      var e = this.estaciones[i];
      for (var j = 0; j < e.misiones.length; j++) {
        var m = e.misiones[j];
        var r = this.registro(e.id, m.id);
        filas.push({
          estacion: e.numero + '. ' + e.titulo,
          mision: m.enunciado,
          tipo: m.tipo === 'prediccion' ? 'Predicción' : 'Reto',
          completada: r.completada,
          intentos: r.intentos,
          respuesta: r.respuesta,
          valorCorrecto: r.valorCorrecto != null ? r.valorCorrecto : null,
          puntos: this.puntosDe(e.id, m.id),
          fecha: r.fecha
        });
      }
    }
    return filas;
  };

  global.Progreso = Progreso;
  global.Progreso.formatear = formatear;
})(window);
