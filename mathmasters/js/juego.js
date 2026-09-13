/*
 * MathMasters | Lógica de la partida
 *
 * Modos: campaña (3 oleadas y un jefe por región), arcade (12 cometas que
 * suben de rango), supervivencia (oleadas sin fin con jefe cada 5) y
 * práctica (15 cometas sin perder vidas).
 *
 * Cada cometa trae un problema. El objetivo fijado es siempre el que más
 * avanzó cuando quedó libre la mira; se mantiene hasta resolverlo para no
 * cambiarle el problema al jugador a mitad de escribir.
 */
(function (global) {
  'use strict';

  var MM = global.MM, tr = MM.tr, ic = MM.icono;
  var P = global.MMProblemas;

  function $(id) { return document.getElementById(id); }

  var PUNTOS_RANGO = { base: 100, avanzado: 160, maestro: 250 };
  var DURACION_RANGO = { base: 26, avanzado: 38, maestro: 55 };
  var DURACION_JEFE = { base: 75, avanzado: 100, maestro: 140 };
  var PODERES = [
    { id: 'congelar', icono: 'snowflake', tecla: '1', es: 'Congelar', en: 'Freeze' },
    { id: 'escudo', icono: 'shield', tecla: '2', es: 'Escudo', en: 'Shield' },
    { id: 'pista', icono: 'lightbulb', tecla: '3', es: 'Pista', en: 'Hint' }
  ];

  var arena = new global.Arena($('arena'));
  var estado = null;
  var decorativos = { espera: 1 };

  /* ------------------------------------------------------------------ *
   * Configuración de partida
   * ------------------------------------------------------------------ */

  function nuevaPartida(config) {
    var modo = config.modo;
    return {
      config: config,
      modo: modo,
      tema: config.tema || null,
      rango: config.rango || 'base',
      puntos: 0,
      combo: 0,
      comboMax: 0,
      vidas: 3,
      vidasPerdidas: 0,
      aciertos: 0,
      fallos: 0,
      jefesDerrotados: 0,
      poderesUsados: 0,
      porTema: P.TEMAS.reduce(function (acc, t) { acc[t] = { aciertos: 0, fallos: 0 }; return acc; }, {}),
      poderes: { congelar: 0, escudo: 0, pista: 0 },
      congeladoRestante: 0,
      nivel: 1,
      rachaBuena: 0,
      rachaMala: 0,
      oleada: 0,
      totalOleadas: modo === 'campana' ? 3 : 0,
      pendientes: 0,
      lanzados: 0,
      esperaSpawn: 0,
      simultaneos: 1,
      transicion: 0,
      alTerminarTransicion: null,
      objetivo: null,
      pistaVisible: false,
      intentos: 0,
      pausado: false,
      terminado: false,
      inicio: performance.now()
    };
  }

  function sinVidas() { return estado.modo === 'practica'; }

  // Rango y tema del siguiente cometa según el modo.
  function siguienteReto() {
    var e = estado;
    if (e.modo === 'campana' || e.modo === 'practica') return { tema: e.tema, rango: e.rango };
    var tema = P.TEMAS[Math.floor(Math.random() * P.TEMAS.length)];
    if (e.modo === 'arcade') {
      var n = e.lanzados;
      return { tema: tema, rango: n < 4 ? 'base' : (n < 8 ? 'avanzado' : 'maestro') };
    }
    return { tema: tema, rango: e.oleada <= 3 ? 'base' : (e.oleada <= 7 ? 'avanzado' : 'maestro') };
  }

  function duracionCometa(rango) {
    var base = DURACION_RANGO[rango];
    var factor = { 1: 1.12, 2: 1, 3: 0.9 }[estado.nivel];
    if (estado.modo === 'arcade') factor *= 0.8;
    if (estado.modo === 'practica') factor *= 1.25;
    if (estado.modo === 'supervivencia') factor *= Math.max(0.6, 1 - estado.oleada * 0.035);
    return base * factor;
  }

  /* ------------------------------------------------------------------ *
   * Oleadas
   * ------------------------------------------------------------------ */

  function empezarOleada() {
    var e = estado;
    e.oleada++;
    if (e.modo === 'campana') {
      e.pendientes = 3 + e.oleada;
      e.simultaneos = e.rango === 'maestro' ? 1 : (e.oleada === 3 ? 2 : 1);
      MM_anuncio(MM.region(e.tema), tr('Oleada ', 'Wave ') + e.oleada + tr(' de 3', ' of 3'));
    } else if (e.modo === 'arcade') {
      e.pendientes = 12;
      e.simultaneos = 1;
      MM_anuncio('Arcade', tr('12 cometas', '12 comets'));
    } else if (e.modo === 'supervivencia') {
      e.pendientes = 3 + e.oleada;
      e.simultaneos = e.oleada >= 6 ? 2 : 1;
      MM_anuncio(tr('Supervivencia', 'Survival'), tr('Oleada ', 'Wave ') + e.oleada);
    } else {
      e.pendientes = 15;
      e.simultaneos = 1;
      MM_anuncio(tr('Práctica', 'Practice'), MM.tema(e.tema));
    }
    e.esperaSpawn = 1.6;
    global.Sonido.intensidad(e.rango === 'base' && e.modo !== 'supervivencia' ? 1 : 2);
    global.Sonido.musica('juego');
    actualizarHud();
  }

  function MM_anuncio(pequeno, grande) { global.Pantallas.anuncio(pequeno, grande); }

  function lanzarCometa() {
    var e = estado;
    var reto = siguienteReto();
    var problema = P.generar(reto.tema, reto.rango, e.nivel);
    var enemigo = arena.crearEnemigo({ duracion: duracionCometa(reto.rango) });
    enemigo.problema = problema;
    e.pendientes--;
    e.lanzados++;
    e.esperaSpawn = 2.4;
  }

  function lanzarJefe(tema, rango) {
    var datos = P.jefe(tema, rango);
    var enemigo = arena.crearEnemigo({ jefe: true, fases: 3, duracion: DURACION_JEFE[rango], angulo: -Math.PI / 2 });
    enemigo.jefeDatos = datos;
    enemigo.etiqueta = MM.par(datos.nombre);
    global.Sonido.reproducir('jefe');
    global.Sonido.musica('jefe');
    MM_anuncio(tr('Se acerca un jefe', 'A boss approaches'), MM.par(datos.nombre));
  }

  function oleadaTerminada() {
    var e = estado;
    global.Sonido.reproducir('oleada');
    if (e.modo === 'campana') {
      if (e.oleada < e.totalOleadas) return transicion(2.2, empezarOleada);
      if (!e.jefeLanzado) {
        e.jefeLanzado = true;
        return transicion(1.2, function () { lanzarJefe(e.tema, e.rango); e.esperandoJefe = true; });
      }
      return terminar(true);
    }
    if (e.modo === 'supervivencia') {
      if (e.oleada % 5 === 0 && e.jefeDeOleada !== e.oleada) {
        e.jefeDeOleada = e.oleada;
        var reto = siguienteReto();
        return transicion(1.2, function () { lanzarJefe(reto.tema, reto.rango); e.esperandoJefe = true; });
      }
      return transicion(2.2, empezarOleada);
    }
    return terminar(true);
  }

  function transicion(segundos, fn) {
    estado.transicion = segundos;
    estado.alTerminarTransicion = fn;
  }

  /* ------------------------------------------------------------------ *
   * Objetivo y consola
   * ------------------------------------------------------------------ */

  function elegirObjetivo() {
    var e = estado;
    if (e.objetivo && e.objetivo.vivo) return;
    var candidatos = arena.enemigos.filter(function (x) { return x.vivo && !x.decorativo && !x.destruyendose; });
    if (!candidatos.length) { e.objetivo = null; arena.fijar(null); dibujarConsola(); return; }
    candidatos.sort(function (a, b) { return b.progreso - a.progreso; });
    e.objetivo = candidatos[0];
    e.intentos = 0;
    e.pistaVisible = false;
    e.descartadas = [];
    arena.fijar(e.objetivo);
    dibujarConsola(true);
    $('lector').textContent = e.objetivo.jefe ? tr('Jefe fijado', 'Boss locked') : tr('Nuevo objetivo', 'New target');
  }

  function problemaActual() {
    var o = estado && estado.objetivo;
    if (!o) return null;
    if (o.jefe) return o.jefeDatos.pasos[o.fasesRotas];
    return o.problema;
  }

  function dibujarConsola(enfocar) {
    var consola = $('consola');
    var e = estado;
    var prob = problemaActual();
    if (!e || e.terminado || !prob) { consola.hidden = true; consola.innerHTML = ''; return; }
    var o = e.objetivo;
    var previo = consola.querySelector('input');
    var valorPrevio = previo ? previo.value : '';

    var cabecera = o.jefe
      ? '<span class="etiqueta">' + ic('swords') + MM.par(o.jefeDatos.nombre) + '</span>' +
        '<span class="fases" aria-label="' + tr('Escudo del jefe', 'Boss shield') + '">' +
          [0, 1, 2].map(function (i) { return '<span class="' + (i < o.fasesRotas ? 'rota' : '') + '"></span>'; }).join('') + '</span>'
      : '<span class="etiqueta">' + ic('crosshair') + tr('Objetivo fijado', 'Target locked') + '</span>' +
        '<span>' + MM.tema(prob.tema) + ' · ' + MM.rango(prob.rango) + '</span>';

    var cuerpo = '';
    if (o.jefe) cuerpo += '<p class="contexto">' + MM.par(o.jefeDatos.contexto) + '</p>';
    cuerpo += '<p class="enunciado">' + (o.jefe ? tr('Paso ', 'Step ') + (o.fasesRotas + 1) + ': ' : '') + MM.par(prob.enunciado) + '</p>';

    if (prob.tipo === 'opc') {
      cuerpo += '<div class="opciones" role="group">' + prob.opciones.map(function (op, i) {
        var desc = e.descartadas && e.descartadas.indexOf(i) >= 0 ? ' descartada' : '';
        return '<button class="opcion' + desc + '" data-opcion="' + i + '"><kbd>' + (i + 1) + '</kbd><span>$' + op + '$</span></button>';
      }).join('') + '</div>';
    } else {
      cuerpo += '<form class="respuesta" autocomplete="off">' +
        '<input type="text" inputmode="text" enterkeyhint="send" spellcheck="false" autocapitalize="off" aria-label="' + tr('Tu respuesta', 'Your answer') + '" placeholder="' + tr('Tu respuesta', 'Your answer') + '">' +
        '<button class="btn primario" type="submit">' + ic('zap') + tr('Disparar', 'Fire') + '</button></form>';
    }

    cuerpo += '<div class="consola-pie"><span class="aviso-respuesta" id="aviso-respuesta"></span>' +
      (e.pistaVisible ? '<span class="texto-pista">' + ic('lightbulb') + ' ' + MM.par(prob.pista) + '</span>' : '') + '</div>';

    consola.innerHTML = '<div class="consola-cabecera">' + cabecera + '</div>' + cuerpo;
    consola.hidden = false;
    consola.classList.remove('bien', 'mal');
    MM.formulas(consola);

    var form = consola.querySelector('form');
    if (form) {
      var input = form.querySelector('input');
      input.value = valorPrevio && !enfocar ? valorPrevio : '';
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!input.value.trim()) return;
        responder(input.value);
      });
      if (enfocar !== false && $('pantalla').hidden) input.focus({ preventScroll: true });
    }
    consola.querySelectorAll('[data-opcion]').forEach(function (b) {
      b.addEventListener('click', function () { responder(Number(b.getAttribute('data-opcion'))); });
    });
  }

  function avisar(texto, clase) {
    var el = $('aviso-respuesta');
    if (!el) return;
    el.className = 'aviso-respuesta ' + (clase || '');
    el.innerHTML = texto;
    MM.formulas(el);
  }

  /* ------------------------------------------------------------------ *
   * Respuestas
   * ------------------------------------------------------------------ */

  function multiplicador() {
    return 1 + Math.min(3, Math.floor(estado.combo / 5) * 0.5);
  }

  function responder(entrada) {
    var e = estado;
    if (!e || e.pausado || e.terminado || !e.objetivo) return;
    var o = e.objetivo;
    var prob = problemaActual();
    var bien = P.validar(prob, entrada);
    var consola = $('consola');

    if (bien) {
      e.aciertos++;
      e.porTema[prob.tema].aciertos++;
      e.combo++;
      e.comboMax = Math.max(e.comboMax, e.combo);
      e.rachaBuena++;
      e.rachaMala = 0;
      if (e.rachaBuena >= 3) { e.nivel = Math.min(3, e.nivel + 1); e.rachaBuena = 0; }
      if (e.combo % 5 === 0) ganarPoder();

      var base = PUNTOS_RANGO[prob.rango];
      var ganados = Math.round((base + base * 0.5 * (1 - o.progreso)) * multiplicador() * (o.jefe ? 2 : 1));
      e.puntos += ganados;

      consola.classList.remove('mal');
      consola.classList.add('bien');
      global.Sonido.reproducir('disparo');
      global.Sonido.reproducir('acierto');
      if (e.combo >= 5 && e.combo % 5 === 0) global.Sonido.reproducir('combo', e.combo / 5);

      var posicion = arena.posicion(o);
      arena.texto(posicion.x, posicion.y - 30, '+' + MM.numero(ganados), '#ffb020');

      if (o.jefe) {
        arena.disparar(o, function () {
          arena.romperFase(o);
          global.Sonido.reproducir('fase');
          if (o.fasesRotas >= o.fases) {
            destruir(o, true);
          } else {
            arena.retroceder(o, 0.12);
            e.intentos = 0;
            e.pistaVisible = false;
            e.descartadas = [];
            dibujarConsola(true);
          }
        });
        avisar(ic('check') + ' ' + tr('Escudo roto', 'Shield broken'), 'bien');
      } else {
        o.destruyendose = true;
        e.objetivo = null;
        arena.fijar(null);
        arena.disparar(o, function () { destruir(o, false); });
        avisar(ic('check') + ' ' + tr('Impacto', 'Hit'), 'bien');
      }
      global.Sonido.intensidad(Math.min(3, (e.rango === 'base' ? 1 : 2) + (e.combo >= 10 ? 1 : 0)));
    } else {
      e.fallos++;
      e.porTema[prob.tema].fallos++;
      e.combo = 0;
      e.intentos++;
      e.rachaMala++;
      e.rachaBuena = 0;
      if (e.rachaMala >= 2) { e.nivel = Math.max(1, e.nivel - 1); e.rachaMala = 0; }
      arena.empujar(o, o.jefe ? 0.08 : 0.1);
      global.Sonido.reproducir('error');
      consola.classList.remove('bien', 'mal');
      void consola.offsetWidth;
      consola.classList.add('mal');
      if (prob.tipo === 'opc') {
        e.descartadas = (e.descartadas || []).concat([Number(entrada)]);
        dibujarConsola(false);
      } else {
        var input = consola.querySelector('input');
        if (input) { input.select(); }
      }
      if (e.intentos >= 2 && !e.pistaVisible) {
        e.pistaVisible = true;
        dibujarConsola(false);
        avisar(ic('x') + ' ' + tr('Falló. Te dejo una pista.', 'Missed. Here is a hint.'), 'mal');
      } else {
        avisar(ic('x') + ' ' + tr('Falló, el cometa se acerca.', 'Missed, the comet draws closer.'), 'mal');
      }
      $('consola').classList.add('mal');
    }
    actualizarHud();
  }

  function destruir(enemigo, esJefe) {
    var e = estado;
    var p = arena.posicion(enemigo);
    arena.explotar(p.x, p.y, enemigo.color, esJefe ? 140 : 45);
    arena.sacudir(esJefe ? 20 : 6);
    enemigo.vivo = false;
    arena.enemigos = arena.enemigos.filter(function (x) { return x !== enemigo; });
    global.Sonido.reproducir('explosion');
    if (esJefe) {
      e.jefesDerrotados++;
      e.esperandoJefe = false;
      var bono = PUNTOS_RANGO[enemigo.jefeDatos.rango] * 5;
      e.puntos += bono;
      arena.texto(p.x, p.y - 60, '+' + MM.numero(bono), '#7fd9ff');
      e.objetivo = null;
      arena.fijar(null);
      // Sin objetivo la consola se oculta; si no, el último paso del jefe
      // quedaría visible (y aceptando texto) durante la transición.
      dibujarConsola();
      global.Sonido.musica('juego');
      actualizarHud();
      if (e.modo === 'campana') return transicion(1.4, function () { terminar(true); });
      return transicion(1.4, empezarOleada);
    }
    if (e.objetivo === enemigo) e.objetivo = null;
    actualizarHud();
    elegirObjetivo();
  }

  // Un cometa (o jefe) llegó al núcleo.
  function llegada(enemigo) {
    var e = estado;
    if (!e || e.terminado || enemigo.decorativo) {
      var pp = arena.posicion(enemigo);
      arena.explotar(pp.x, pp.y, enemigo.color, 12);
      return;
    }
    var prob = enemigo.jefe ? enemigo.jefeDatos.pasos[Math.min(2, enemigo.fasesRotas)] : enemigo.problema;
    if (arena.escudo) {
      arena.escudo = false;
      arena.golpeNucleo(true);
      global.Sonido.reproducir('escudo');
    } else {
      arena.golpeNucleo(false);
      global.Sonido.reproducir('impacto');
      e.combo = 0;
      if (!sinVidas()) {
        var dano = enemigo.jefe ? 2 : 1;
        e.vidas = Math.max(0, e.vidas - dano);
        e.vidasPerdidas += dano;
      }
    }
    e.fallos++;
    e.porTema[prob.tema].fallos++;
    avisar(tr('La respuesta era ', 'The answer was ') + P.respuestaTexto(prob), 'mal');

    if (enemigo.jefe && e.vidas > 0) {
      // El jefe vuelve a la órbita exterior conservando el escudo roto.
      var vuelta = arena.crearEnemigo({ jefe: true, fases: 3, duracion: DURACION_JEFE[enemigo.jefeDatos.rango], angulo: enemigo.angulo });
      vuelta.fasesRotas = enemigo.fasesRotas;
      vuelta.jefeDatos = enemigo.jefeDatos;
      vuelta.etiqueta = enemigo.etiqueta;
    }
    if (e.objetivo === enemigo) e.objetivo = null;
    actualizarHud();
    if (!sinVidas() && e.vidas <= 0) return terminar(false);
    elegirObjetivo();
  }
  arena.alLlegar = llegada;

  /* ------------------------------------------------------------------ *
   * Poderes
   * ------------------------------------------------------------------ */

  function ganarPoder() {
    var p = estado.poderes;
    var opciones = PODERES.filter(function (x) { return p[x.id] < 2; });
    if (!opciones.length) return;
    opciones.sort(function (a, b) { return p[a.id] - p[b.id]; });
    var elegido = opciones[0];
    p[elegido.id]++;
    global.Sonido.reproducir('poder');
    var pos = { x: arena.cx, y: arena.cy - arena.radioNucleo * 2.4 };
    arena.texto(pos.x, pos.y, MM.par(elegido) + ' +1', '#7fd9ff');
  }

  function usarPoder(id) {
    var e = estado;
    if (!e || e.pausado || e.terminado || e.poderes[id] <= 0) return;
    if (id === 'escudo' && arena.escudo) return;
    if (id === 'congelar' && arena.congelado) return;
    var prob = problemaActual();
    if (id === 'pista' && (!prob || e.pistaVisible && prob.tipo !== 'opc')) return;
    e.poderes[id]--;
    e.poderesUsados++;
    if (id === 'congelar') {
      arena.congelado = true;
      e.congeladoRestante = 7;
      global.Sonido.reproducir('congelar');
    } else if (id === 'escudo') {
      arena.escudo = true;
      global.Sonido.reproducir('escudo');
    } else {
      e.pistaVisible = true;
      if (prob.tipo === 'opc') {
        var incorrectas = prob.opciones.map(function (_, i) { return i; }).filter(function (i) {
          return i !== prob.correcta && (e.descartadas || []).indexOf(i) < 0;
        });
        e.descartadas = (e.descartadas || []).concat(incorrectas.slice(0, 2));
      }
      global.Sonido.reproducir('pista');
      dibujarConsola(false);
    }
    actualizarHud();
  }

  /* ------------------------------------------------------------------ *
   * HUD
   * ------------------------------------------------------------------ */

  function actualizarHud() {
    var e = estado;
    if (!e) return;
    $('hud-puntos').textContent = MM.numero(e.puntos);

    var combo = $('hud-combo');
    var textoCombo = ic('zap') + tr('Combo ', 'Combo ') + e.combo + (e.combo >= 5 ? ' · x' + multiplicador() : '');
    if (combo.getAttribute('data-valor') !== String(e.combo)) {
      combo.classList.remove('pulso');
      void combo.offsetWidth;
      if (e.combo > 0) combo.classList.add('pulso');
      combo.setAttribute('data-valor', String(e.combo));
    }
    combo.innerHTML = textoCombo;
    combo.classList.toggle('activo', e.combo > 0);

    var etapa;
    if (e.modo === 'campana') {
      etapa = '<b>' + MM.region(e.tema) + '</b> · ' + (e.esperandoJefe ? tr('Jefe', 'Boss') : tr('Oleada ', 'Wave ') + e.oleada + ' / 3') + ' · ' + MM.rango(e.rango);
    } else if (e.modo === 'arcade') {
      etapa = '<b>Arcade</b> · ' + tr('Cometa ', 'Comet ') + Math.min(12, e.lanzados) + ' / 12';
    } else if (e.modo === 'supervivencia') {
      etapa = '<b>' + tr('Supervivencia', 'Survival') + '</b> · ' + tr('Oleada ', 'Wave ') + e.oleada;
    } else {
      etapa = '<b>' + MM.tema(e.tema) + '</b> · ' + MM.rango(e.rango) + ' · ' + Math.min(15, e.lanzados) + ' / 15';
    }
    $('hud-etapa').innerHTML = etapa;

    var vidas = $('hud-vidas');
    vidas.hidden = sinVidas();
    vidas.innerHTML = [0, 1, 2].map(function (i) { return ic('heart', i < e.vidas ? '' : 'perdida'); }).join('');
    vidas.setAttribute('aria-label', e.vidas + ' ' + tr('vidas', 'lives'));

    $('hud-poderes').innerHTML = PODERES.map(function (p) {
      var n = e.poderes[p.id];
      var activo = (p.id === 'congelar' && arena.congelado) || (p.id === 'escudo' && arena.escudo);
      return '<button class="poder' + (n > 0 ? ' cargado' : '') + (activo ? ' activo' : '') + '" data-poder="' + p.id + '"' +
        (n > 0 ? '' : ' disabled') + ' title="' + MM.par(p) + ' (Alt+' + p.tecla + ')" aria-label="' + MM.par(p) + ', ' + n + '">' +
        ic(p.icono) + (n > 0 ? '<span class="cargas">' + n + '</span>' : '') + '<kbd>' + p.tecla + '</kbd></button>';
    }).join('');
    $('hud-poderes').querySelectorAll('[data-poder]').forEach(function (b) {
      b.addEventListener('click', function () { usarPoder(b.getAttribute('data-poder')); });
    });
  }

  /* ------------------------------------------------------------------ *
   * Ciclo de vida
   * ------------------------------------------------------------------ */

  function iniciar(config) {
    global.Sonido.iniciar();
    global.Pantallas.ocultar();
    arena.limpiar();
    arena.congelado = false;
    arena.escudo = false;
    arena.pausado = false;
    estado = nuevaPartida(config);
    $('hud').hidden = false;
    $('btn-pausa').hidden = false;
    $('consola').hidden = true;
    actualizarHud();
    transicion(0.6, empezarOleada);
  }

  function pausar(sinPantalla) {
    if (!estado || estado.terminado || estado.pausado) return;
    estado.pausado = true;
    arena.pausado = true;
    global.Sonido.musica('silencio');
    if (!sinPantalla) global.Pantallas.pausa();
  }

  function reanudar() {
    if (!estado || !estado.pausado) return;
    estado.pausado = false;
    arena.pausado = false;
    global.Pantallas.ocultar();
    global.Sonido.musica(arena.enemigos.some(function (x) { return x.jefe; }) ? 'jefe' : 'juego');
    var input = $('consola').querySelector('input');
    if (input) input.focus({ preventScroll: true });
  }

  function limpiarPartida() {
    $('hud').hidden = true;
    $('btn-pausa').hidden = true;
    $('consola').hidden = true;
    $('consola').innerHTML = '';
    arena.congelado = false;
    arena.escudo = false;
    arena.pausado = false;
    arena.limpiar();
  }

  function abandonar() {
    estado = null;
    limpiarPartida();
  }

  function terminar(superado) {
    var e = estado;
    if (!e || e.terminado) return;
    e.terminado = true;
    arena.fijar(null);
    global.Sonido.reproducir(superado ? 'victoria' : 'derrota');
    global.Sonido.musica('silencio');
    $('consola').hidden = true;

    var resumen = {
      config: e.config, modo: e.modo, tema: e.tema, rango: e.rango, superado: superado,
      puntos: e.puntos, comboMax: e.comboMax, aciertos: e.aciertos, fallos: e.fallos,
      jefesDerrotados: e.jefesDerrotados, poderesUsados: e.poderesUsados,
      vidasPerdidas: e.vidasPerdidas, oleada: e.oleada, porTema: e.porTema,
      duracion: (performance.now() - e.inicio) / 1000
    };
    var registro = global.Progreso.registrarPartida(resumen);
    resumen.nuevos = registro.nuevos;
    resumen.record = registro.record;

    setTimeout(function () {
      if (estado !== e) return;
      estado = null;
      limpiarPartida();
      global.Pantallas.resultados(resumen);
      registro.nuevos.forEach(function (l, i) { setTimeout(function () { global.Pantallas.aviso(l); }, 600 + i * 700); });
    }, superado ? 1600 : 2200);
  }

  function actualizarPartida(dt) {
    var e = estado;
    if (!e || e.pausado || e.terminado) return;

    if (e.congeladoRestante > 0) {
      e.congeladoRestante -= dt;
      if (e.congeladoRestante <= 0) { arena.congelado = false; actualizarHud(); }
    }

    if (e.transicion > 0) {
      e.transicion -= dt;
      if (e.transicion <= 0 && e.alTerminarTransicion) {
        var fn = e.alTerminarTransicion;
        e.alTerminarTransicion = null;
        fn();
      }
      return;
    }

    var vivos = arena.enemigos.filter(function (x) { return x.vivo && !x.decorativo; });
    if (e.pendientes > 0) {
      e.esperaSpawn -= dt;
      if (vivos.length < e.simultaneos && e.esperaSpawn <= 0) {
        lanzarCometa();
        actualizarHud();
        // La lista de vivos ya quedó vieja: si se revisara el fin de oleada
        // ahora, el último cometa recién lanzado no contaría.
        return;
      }
    }
    if (!e.objetivo || !e.objetivo.vivo) elegirObjetivo();
    if (e.pendientes <= 0 && vivos.length === 0 && !e.esperandoJefe && e.oleada > 0) oleadaTerminada();
  }

  // Cometas de adorno detrás de los menús.
  function actualizarDecorativos(dt) {
    if (estado) return;
    decorativos.espera -= dt;
    if (decorativos.espera <= 0 && arena.enemigos.length < 4) {
      var d = arena.crearEnemigo({ duracion: 16 + Math.random() * 8 });
      d.decorativo = true;
      decorativos.espera = 2 + Math.random() * 2;
    }
    arena.enemigos.forEach(function (x) {
      if (x.decorativo && x.vivo && x.progreso > 0.82) {
        var p = arena.posicion(x);
        arena.explotar(p.x, p.y, x.color, 18);
        x.vivo = false;
      }
    });
    arena.enemigos = arena.enemigos.filter(function (x) { return x.vivo; });
  }

  var anterior = performance.now();
  function cuadro(ahora) {
    var dt = Math.min(0.05, (ahora - anterior) / 1000);
    anterior = ahora;
    actualizarDecorativos(dt);
    actualizarPartida(dt);
    arena.actualizar(dt);
    arena.dibujar();
    requestAnimationFrame(cuadro);
  }
  requestAnimationFrame(cuadro);

  /* ------------------------------------------------------------------ *
   * Entrada y eventos globales
   * ------------------------------------------------------------------ */

  document.addEventListener('keydown', function (ev) {
    if (!estado || estado.terminado) return;
    if (ev.code === 'Escape') {
      ev.preventDefault();
      if (estado.pausado) reanudar(); else pausar();
      return;
    }
    if (estado.pausado) return;
    if (ev.altKey && /^Digit[123]$/.test(ev.code)) {
      ev.preventDefault();
      usarPoder(PODERES[Number(ev.code.slice(-1)) - 1].id);
      return;
    }
    var prob = problemaActual();
    var escribiendo = ev.target && ev.target.tagName === 'INPUT';
    if (prob && prob.tipo === 'opc' && !escribiendo && /^(Digit|Numpad)[1-4]$/.test(ev.code)) {
      var i = Number(ev.code.slice(-1)) - 1;
      if (!estado.descartadas || estado.descartadas.indexOf(i) < 0) responder(i);
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pausar();
  });

  document.addEventListener('i18n:langChange', function () {
    if (!estado) return;
    actualizarHud();
    if (!estado.terminado) dibujarConsola(false);
    arena.enemigos.forEach(function (x) { if (x.jefe && x.jefeDatos) x.etiqueta = MM.par(x.jefeDatos.nombre); });
  });

  global.Juego = {
    arena: arena,
    iniciar: iniciar,
    pausar: pausar,
    reanudar: reanudar,
    abandonar: abandonar,
    enPartida: function () { return !!(estado && !estado.terminado); }
  };
})(window);
