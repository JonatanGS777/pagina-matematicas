/*
 * MathMasters | Sistema de sonido
 *
 * Todo se sintetiza con Web Audio: no hay archivos. La familia de sonidos
 * comparte la tonalidad de La menor pentatónica para que aciertos, combos y
 * música suenen como una sola cosa. La música tiene capas que entran según
 * la intensidad de la partida (0 a 3) y un modo especial para los jefes.
 *
 * El contexto de audio solo se crea tras un gesto del usuario, como exige
 * el navegador, y el volumen se guarda entre sesiones.
 */
(function (global) {
  'use strict';

  var CLAVE = 'mathmasters:audio';
  var ctx = null, maestro, busMusica, busEfectos, ruidoBuffer;
  var ajustes = { general: 0.8, musica: 0.45, efectos: 0.85, silencio: false };
  var ultimo = {};

  // La menor pentatónica, en Hz, de La2 a La5.
  var ESCALA = [110, 130.81, 146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];
  // Progresión Am, F, C, G expresada como raíces.
  var ACORDES = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 261.63, 329.63], [196, 246.94, 293.66]];

  try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (guardado) for (var k in ajustes) if (k in guardado) ajustes[k] = guardado[k];
  } catch (e) { /* almacenamiento bloqueado: se usan los valores por defecto */ }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(ajustes)); } catch (e) { /* sin memoria */ }
  }

  function aplicarVolumen() {
    if (!ctx) return;
    var t = ctx.currentTime;
    maestro.gain.setTargetAtTime(ajustes.silencio ? 0 : ajustes.general, t, 0.05);
    busMusica.gain.setTargetAtTime(ajustes.musica, t, 0.05);
    busEfectos.gain.setTargetAtTime(ajustes.efectos, t, 0.05);
  }

  function iniciar() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();

    var compresor = ctx.createDynamicsCompressor();
    compresor.threshold.value = -14;
    compresor.ratio.value = 4;
    compresor.connect(ctx.destination);

    maestro = ctx.createGain();
    maestro.connect(compresor);
    busMusica = ctx.createGain();
    busMusica.connect(maestro);
    busEfectos = ctx.createGain();
    busEfectos.connect(maestro);

    ruidoBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var datos = ruidoBuffer.getChannelData(0);
    for (var i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;

    aplicarVolumen();
    document.addEventListener('visibilitychange', function () {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else ctx.resume();
    });
  }

  /* ------------------------------------------------------------------ *
   * Bloques de síntesis
   * ------------------------------------------------------------------ */

  function variar(f) { return f * (1 + (Math.random() - 0.5) * 0.04); }

  function tono(frec, opciones) {
    var o = opciones || {};
    var t = ctx.currentTime + (o.retraso || 0);
    var dur = o.duracion || 0.15;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = o.forma || 'sine';
    osc.frequency.setValueAtTime(frec, t);
    if (o.hasta) osc.frequency.exponentialRampToValueAtTime(o.hasta, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.volumen || 0.3, t + (o.ataque || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var destino = o.destino || busEfectos;
    if (o.filtro) {
      var f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(o.filtro, t);
      if (o.filtroHasta) f.frequency.exponentialRampToValueAtTime(o.filtroHasta, t + dur);
      osc.connect(f); f.connect(g);
    } else {
      osc.connect(g);
    }
    g.connect(destino);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function ruido(opciones) {
    var o = opciones || {};
    var t = ctx.currentTime + (o.retraso || 0);
    var dur = o.duracion || 0.3;
    var src = ctx.createBufferSource();
    src.buffer = ruidoBuffer;
    var f = ctx.createBiquadFilter();
    f.type = o.tipoFiltro || 'lowpass';
    f.frequency.setValueAtTime(o.filtro || 1800, t);
    if (o.filtroHasta) f.frequency.exponentialRampToValueAtTime(o.filtroHasta, t + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(o.volumen || 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(o.destino || busEfectos);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  }

  /* ------------------------------------------------------------------ *
   * Catálogo de efectos
   * ------------------------------------------------------------------ */

  var EFECTOS = {
    clic: function () { tono(variar(880), { duracion: 0.06, volumen: 0.12, forma: 'triangle' }); },
    foco: function () { tono(variar(1318.5), { duracion: 0.04, volumen: 0.05, forma: 'sine' }); },
    disparo: function () {
      tono(variar(1400), { hasta: 180, duracion: 0.22, volumen: 0.18, forma: 'sawtooth', filtro: 4000, filtroHasta: 600 });
    },
    acierto: function () {
      tono(523.25, { duracion: 0.12, volumen: 0.22, forma: 'triangle' });
      tono(659.25, { duracion: 0.18, volumen: 0.2, forma: 'triangle', retraso: 0.07 });
    },
    explosion: function () {
      ruido({ duracion: 0.45, volumen: 0.35, filtro: 2400, filtroHasta: 120 });
      tono(variar(110), { hasta: 45, duracion: 0.35, volumen: 0.3 });
    },
    error: function () {
      tono(311.13, { duracion: 0.16, volumen: 0.12, forma: 'square', filtro: 1400 });
      tono(293.66, { duracion: 0.24, volumen: 0.12, forma: 'square', filtro: 1200, retraso: 0.1 });
    },
    impacto: function () {
      tono(95, { hasta: 38, duracion: 0.6, volumen: 0.5 });
      ruido({ duracion: 0.5, volumen: 0.4, filtro: 900, filtroHasta: 80 });
    },
    combo: function (nivel) {
      var n = Math.min(5, 2 + (nivel || 1));
      for (var i = 0; i < n; i++) {
        tono(ESCALA[8 + i], { duracion: 0.1, volumen: 0.14, forma: 'triangle', retraso: i * 0.045 });
      }
    },
    poder: function () {
      for (var i = 0; i < 6; i++) tono(ESCALA[6 + i * 2 % 10], { duracion: 0.2, volumen: 0.08, retraso: i * 0.035 });
    },
    congelar: function () {
      for (var i = 0; i < 7; i++) tono(ESCALA[15 - i], { duracion: 0.25, volumen: 0.07, forma: 'sine', retraso: i * 0.05 });
      ruido({ duracion: 0.6, volumen: 0.08, tipoFiltro: 'highpass', filtro: 5000 });
    },
    escudo: function () {
      tono(220, { hasta: 440, duracion: 0.4, volumen: 0.16, forma: 'triangle' });
      tono(329.63, { hasta: 659.25, duracion: 0.4, volumen: 0.1, forma: 'sine' });
    },
    pista: function () { tono(659.25, { duracion: 0.2, volumen: 0.12 }); tono(987.77, { duracion: 0.3, volumen: 0.08, retraso: 0.1 }); },
    fase: function () {
      tono(1760, { hasta: 880, duracion: 0.5, volumen: 0.12, forma: 'square', filtro: 3000, filtroHasta: 700 });
      ruido({ duracion: 0.35, volumen: 0.25, tipoFiltro: 'bandpass', filtro: 2500 });
    },
    jefe: function () {
      [110, 130.81, 164.81].forEach(function (f, i) {
        tono(f, { duracion: 1.4, volumen: 0.18, forma: 'sawtooth', filtro: 400, filtroHasta: 1600, ataque: 0.15, retraso: i * 0.02 });
      });
      ruido({ duracion: 1.2, volumen: 0.18, filtro: 300 });
    },
    oleada: function () {
      [440, 523.25, 659.25, 880].forEach(function (f, i) { tono(f, { duracion: 0.2, volumen: 0.14, forma: 'triangle', retraso: i * 0.08 }); });
    },
    victoria: function () {
      [440, 523.25, 659.25, 880, 1046.5].forEach(function (f, i) { tono(f, { duracion: 0.35, volumen: 0.16, forma: 'triangle', retraso: i * 0.11 }); });
      [220, 329.63, 440].forEach(function (f) { tono(f, { duracion: 1.4, volumen: 0.1, retraso: 0.55, ataque: 0.1 }); });
    },
    derrota: function () {
      [440, 392, 329.63, 220].forEach(function (f, i) { tono(f, { duracion: 0.45, volumen: 0.14, forma: 'triangle', retraso: i * 0.2, filtro: 1500 }); });
    },
    logro: function () {
      [783.99, 1046.5, 1318.5].forEach(function (f, i) { tono(f, { duracion: 0.3, volumen: 0.12, retraso: i * 0.07 }); });
    }
  };

  function reproducir(nombre, arg) {
    if (!ctx || ajustes.silencio || !EFECTOS[nombre]) return;
    var ahora = performance.now();
    // Evita que un mismo sonido se amontone si se dispara muy seguido.
    if (ultimo[nombre] && ahora - ultimo[nombre] < 60) return;
    ultimo[nombre] = ahora;
    EFECTOS[nombre](arg);
  }

  /* ------------------------------------------------------------------ *
   * Música adaptativa
   * ------------------------------------------------------------------ */

  var musica = { modo: 'silencio', intensidad: 0, tempo: 96, paso: 0, siguiente: 0, temporizador: null };

  function programarPaso(n, t) {
    var bpm = musica.modo === 'jefe' ? 128 : (musica.modo === 'juego' ? 112 : 88);
    var dieciseis = 60 / bpm / 4;
    var compas = Math.floor(n / 16);
    var acorde = ACORDES[Math.floor(compas / 2) % ACORDES.length];
    var enPulso = n % 4 === 0;
    var intensidad = musica.modo === 'jefe' ? 3 : musica.intensidad;

    // Colchón armónico al comienzo de cada compás.
    if (n % 16 === 0) {
      acorde.forEach(function (f) {
        tono(f / 2, { duracion: dieciseis * 16 * 0.98, volumen: 0.05, forma: 'triangle', filtro: musica.modo === 'jefe' ? 900 : 600, ataque: 0.4, destino: busMusica, retraso: t - ctx.currentTime });
      });
    }
    // Bajo en corcheas.
    if (intensidad >= 1 && n % 2 === 0) {
      tono(acorde[0] / 4, { duracion: dieciseis * 1.6, volumen: 0.12, forma: 'sawtooth', filtro: 380, destino: busMusica, retraso: t - ctx.currentTime });
    }
    // Arpegio pentatónico en semicorcheas.
    if (intensidad >= 2 && n % 16 !== 15) {
      var patron = [0, 2, 4, 2, 5, 4, 2, 4];
      var nota = ESCALA[6 + patron[n % 8] + (compas % 4 === 3 ? 1 : 0)];
      tono(nota, { duracion: dieciseis * 0.9, volumen: 0.035, forma: 'square', filtro: 2200, destino: busMusica, retraso: t - ctx.currentTime });
    }
    // Percusión: bombo en el pulso y platillo a contratiempo.
    if (intensidad >= 3) {
      if (enPulso) tono(120, { hasta: 42, duracion: 0.18, volumen: 0.3, destino: busMusica, retraso: t - ctx.currentTime });
      if (n % 4 === 2) ruido({ duracion: 0.05, volumen: 0.06, tipoFiltro: 'highpass', filtro: 7000, destino: busMusica, retraso: t - ctx.currentTime });
    }
    return dieciseis;
  }

  function planificador() {
    if (!ctx || musica.modo === 'silencio') return;
    while (musica.siguiente < ctx.currentTime + 0.12) {
      var dur = programarPaso(musica.paso, musica.siguiente);
      musica.siguiente += dur;
      musica.paso++;
    }
  }

  function ponerMusica(modo) {
    if (!ctx) return;
    if (musica.modo === modo) return;
    musica.modo = modo;
    clearInterval(musica.temporizador);
    if (modo === 'silencio') return;
    musica.paso = 0;
    musica.siguiente = ctx.currentTime + 0.05;
    musica.temporizador = setInterval(planificador, 25);
  }

  global.Sonido = {
    iniciar: iniciar,
    reproducir: reproducir,
    musica: ponerMusica,
    intensidad: function (n) { musica.intensidad = Math.max(0, Math.min(3, n)); },
    ajustes: function () { return JSON.parse(JSON.stringify(ajustes)); },
    ajustar: function (clave, valor) {
      if (!(clave in ajustes)) return;
      ajustes[clave] = valor;
      aplicarVolumen();
      guardar();
    }
  };
})(window);
