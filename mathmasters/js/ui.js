/*
 * MathMasters | Pantallas y barra superior
 *
 * Portada, mapa de campaña, selección de rango, práctica, pausa, ajustes,
 * logros y resultados. Cada pantalla es una función que dibuja su HTML;
 * la última dibujada se guarda para volver a dibujarla si cambia el idioma.
 */
(function (global) {
  'use strict';

  var MM = global.MM, tr = MM.tr, ic = MM.icono;
  var CLAVE_MOV = 'mathmasters:movimiento';
  var actual = null;

  function $(id) { return document.getElementById(id); }

  function juego() { return global.Juego; }

  function reducirMovimiento() {
    try {
      var v = localStorage.getItem(CLAVE_MOV);
      if (v != null) return v === '1';
    } catch (e) { /* sin memoria */ }
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function aplicarMovimiento() {
    var r = reducirMovimiento();
    document.body.classList.toggle('sin-movimiento', r);
    if (juego() && juego().arena) juego().arena.reducirMovimiento = r;
  }

  /* ------------------------------------------------------------------ *
   * Infraestructura
   * ------------------------------------------------------------------ */

  // dibujar: función que devuelve { html, conectar(raiz) }.
  function mostrar(dibujar, opciones) {
    var o = opciones || {};
    actual = dibujar;
    var raiz = $('pantalla');
    var vista = dibujar();
    raiz.className = 'pantalla' + (o.velo ? ' velo' : '');
    raiz.innerHTML = vista.html;
    raiz.hidden = false;
    MM.formulas(raiz);
    if (vista.conectar) vista.conectar(raiz);
    raiz.querySelectorAll('button, .modo, .region, .rango').forEach(function (b) {
      b.addEventListener('mouseenter', function () { global.Sonido.reproducir('foco'); });
    });
    var primero = raiz.querySelector('[data-foco]') || raiz.querySelector('button:not(:disabled)');
    if (primero && !o.sinFoco) primero.focus({ preventScroll: true });
  }

  function ocultar() {
    actual = null;
    $('pantalla').hidden = true;
    $('pantalla').innerHTML = '';
  }

  function clic(raiz, selector, fn) {
    raiz.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener('click', function (ev) {
        global.Sonido.reproducir('clic');
        fn(el, ev);
      });
    });
  }

  function estrellas(n) {
    var h = '<span class="estrellas" aria-label="' + n + ' / 3">';
    for (var i = 0; i < 3; i++) h += ic('star', i < n ? 'llena' : '');
    return h + '</span>';
  }

  /* ------------------------------------------------------------------ *
   * Barra superior
   * ------------------------------------------------------------------ */

  function barra() {
    $('marca').innerHTML = ic('orbit') + '<span>MathMasters</span>';
    $('btn-sitio').innerHTML = ic('house') + '<span class="solo-lectores">' + tr('Volver al sitio', 'Back to site') + '</span>';
    $('btn-sitio').title = tr('Volver a Matemáticas Digitales', 'Back to Digital Mathematics');
    $('btn-logros').innerHTML = ic('trophy');
    $('btn-logros').title = tr('Logros', 'Achievements');
    $('btn-logros').setAttribute('aria-label', tr('Logros', 'Achievements'));
    $('btn-ajustes').innerHTML = ic('settings');
    $('btn-ajustes').title = tr('Ajustes', 'Settings');
    $('btn-ajustes').setAttribute('aria-label', tr('Ajustes', 'Settings'));
    var mudo = global.Sonido.ajustes().silencio;
    $('btn-sonido').innerHTML = ic(mudo ? 'volume-x' : 'volume-2');
    $('btn-sonido').title = mudo ? tr('Activar sonido (M)', 'Unmute (M)') : tr('Silenciar (M)', 'Mute (M)');
    $('btn-sonido').setAttribute('aria-label', $('btn-sonido').title);
    $('btn-pausa').innerHTML = ic('pause');
    $('btn-pausa').title = tr('Pausa (Esc)', 'Pause (Esc)');
    $('btn-pausa').setAttribute('aria-label', $('btn-pausa').title);
  }

  function alternarSonido() {
    global.Sonido.iniciar();
    global.Sonido.ajustar('silencio', !global.Sonido.ajustes().silencio);
    barra();
  }

  function conectarBarra() {
    $('marca').addEventListener('click', function (ev) {
      ev.preventDefault();
      if (juego().enPartida()) juego().pausar(); else titulo();
    });
    $('btn-logros').addEventListener('click', function () {
      if (juego().enPartida()) juego().pausar(true);
      logros(juego().enPartida() ? pausa : titulo);
    });
    $('btn-ajustes').addEventListener('click', function () {
      if (juego().enPartida()) juego().pausar(true);
      ajustes(juego().enPartida() ? pausa : titulo);
    });
    $('btn-sonido').addEventListener('click', alternarSonido);
    $('btn-pausa').addEventListener('click', function () { juego().pausar(); });
  }

  /* ------------------------------------------------------------------ *
   * Portada
   * ------------------------------------------------------------------ */

  function titulo() {
    global.Sonido.musica('menu');
    mostrar(function () {
      var rec = global.Progreso.datos().records;
      var modos = [
        { id: 'campana', icono: 'map', nombre: tr('Campaña', 'Campaign'),
          desc: tr('Nueve regiones, tres oleadas y un jefe en cada una.', 'Nine regions, three waves and a boss in each.'),
          extra: '' },
        { id: 'arcade', icono: 'timer', nombre: 'Arcade',
          desc: tr('Doce cometas de temas mixtos que suben de rango.', 'Twelve mixed-topic comets that climb in rank.'),
          extra: rec.arcade ? tr('Récord: ', 'Best: ') + MM.numero(rec.arcade) : '' },
        { id: 'supervivencia', icono: 'infinity', nombre: tr('Supervivencia', 'Survival'),
          desc: tr('Oleadas sin fin, tres vidas y un jefe cada cinco oleadas.', 'Endless waves, three lives and a boss every five waves.'),
          extra: rec.oleadaMax ? tr('Mejor oleada: ', 'Best wave: ') + rec.oleadaMax : '' },
        { id: 'practica', icono: 'target', nombre: tr('Práctica', 'Practice'),
          desc: tr('Elige tema y rango, sin perder vidas.', 'Pick a topic and rank, no lives lost.'),
          extra: '' }
      ];
      var html = '<div class="panel">' +
        '<h1 class="titulo-juego">MathMasters</h1>' +
        '<p class="bajada">' + tr('Los cometas vienen por el planeta núcleo. Resuelve lo que traen y tu cañón los destruye antes de que choquen.',
          'Comets are closing in on the core planet. Solve what they carry and your cannon destroys them before impact.') + '</p>' +
        '<div class="modos">' + modos.map(function (m, i) {
          return '<button class="modo" data-modo="' + m.id + '"' + (i === 0 ? ' data-foco' : '') + '>' + ic(m.icono) +
            '<b>' + m.nombre + '</b><span>' + m.desc + '</span>' + (m.extra ? '<small>' + m.extra + '</small>' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="teclas">' +
          '<span><kbd>Enter</kbd> ' + tr('disparar', 'fire') + '</span>' +
          '<span><kbd>1</kbd>-<kbd>4</kbd> ' + tr('elegir opción', 'pick option') + '</span>' +
          '<span><kbd>Alt</kbd> + <kbd>1</kbd>-<kbd>3</kbd> ' + tr('poderes', 'powers') + '</span>' +
          '<span><kbd>Esc</kbd> ' + tr('pausa', 'pause') + '</span>' +
          '<span><kbd>M</kbd> ' + tr('sonido', 'sound') + '</span>' +
        '</div></div>';
      return {
        html: html,
        conectar: function (raiz) {
          clic(raiz, '[data-modo]', function (el) {
            var modo = el.getAttribute('data-modo');
            if (modo === 'campana') mapa();
            else if (modo === 'practica') practica();
            else juego().iniciar({ modo: modo });
          });
        }
      };
    });
  }

  /* ------------------------------------------------------------------ *
   * Campaña
   * ------------------------------------------------------------------ */

  function mapa() {
    global.Sonido.musica('menu');
    mostrar(function () {
      var datos = global.Progreso.datos();
      var temas = global.Progreso.TEMAS;
      var regiones = temas.map(function (t, i) {
        var ang = -Math.PI / 2 + i * (Math.PI * 2 / temas.length);
        var x = 50 + Math.cos(ang) * 38, y = 50 + Math.sin(ang) * 38;
        var reg = datos.regiones[t];
        var mejor = 0;
        global.Progreso.RANGOS.forEach(function (r) { mejor = Math.max(mejor, reg[r].estrellas); });
        var puntos = global.Progreso.RANGOS.map(function (r) { return '<i class="' + (reg[r].superado ? 'ok' : '') + '"></i>'; }).join('');
        return '<button class="region" data-tema="' + t + '" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%"' + (i === 0 ? ' data-foco' : '') + '>' +
          '<b>' + MM.region(t) + '</b>' + estrellas(mejor) + '<span class="rangos-mini" aria-hidden="true">' + puntos + '</span></button>';
      }).join('');
      var superadas = temas.filter(function (t) { return datos.regiones[t].base.superado; }).length;
      return {
        html: '<div class="panel">' +
          '<h2 class="titulo-pantalla">' + tr('Mapa de campaña', 'Campaign map') + '</h2>' +
          '<p class="bajada">' + tr('Supera el rango base de una región para abrir el avanzado, y el avanzado para abrir el maestro.',
            'Clear a region on base rank to open advanced, and advanced to open master.') + '</p>' +
          '<div class="mapa">' + regiones +
          '<div class="mapa-nucleo">' + superadas + ' / 9</div></div>' +
          '<div class="fila-acciones"><button class="btn" data-volver>' + ic('arrow-left') + tr('Volver', 'Back') + '</button></div></div>',
        conectar: function (raiz) {
          clic(raiz, '[data-tema]', function (el) { rango(el.getAttribute('data-tema')); });
          clic(raiz, '[data-volver]', titulo);
        }
      };
    });
  }

  function rango(tema) {
    mostrar(function () {
      var reg = global.Progreso.datos().regiones[tema];
      var opciones = global.Progreso.RANGOS.map(function (r, i) {
        var abierto = global.Progreso.disponible(tema, r);
        var info = MM.RANGOS[r];
        var detalle = abierto
          ? MM.par(info.desc) + (reg[r].record ? ' · ' + tr('Récord ', 'Best ') + MM.numero(reg[r].record) : '')
          : tr('Supera el rango anterior para abrirlo.', 'Clear the previous rank to open it.');
        return '<button class="rango" data-rango="' + r + '"' + (abierto ? '' : ' disabled') + (i === 0 ? ' data-foco' : '') + '>' +
          ic(abierto ? info.icono : 'lock') + '<div><b>' + MM.rango(r) + '</b><span>' + detalle + '</span></div>' +
          (reg[r].superado ? estrellas(reg[r].estrellas) : '') + '</button>';
      }).join('');
      return {
        html: '<div class="panel estrecho">' +
          '<h2 class="titulo-pantalla">' + MM.region(tema) + '</h2>' +
          '<p class="bajada" style="margin-bottom:0">' + MM.tema(tema) + '</p>' +
          '<div class="rangos">' + opciones + '</div>' +
          '<div class="fila-acciones"><button class="btn" data-volver>' + ic('arrow-left') + tr('Mapa', 'Map') + '</button></div></div>',
        conectar: function (raiz) {
          clic(raiz, '[data-rango]', function (el) {
            juego().iniciar({ modo: 'campana', tema: tema, rango: el.getAttribute('data-rango') });
          });
          clic(raiz, '[data-volver]', mapa);
        }
      };
    });
  }

  /* ------------------------------------------------------------------ *
   * Práctica
   * ------------------------------------------------------------------ */

  var eleccion = { tema: 'aritmetica', rango: 'base' };

  function practica() {
    mostrar(function () {
      var temas = global.Progreso.TEMAS.map(function (t) {
        return '<button class="chip" data-tema="' + t + '" aria-pressed="' + (eleccion.tema === t) + '">' + MM.tema(t) + '</button>';
      }).join('');
      var rangos = global.Progreso.RANGOS.map(function (r) {
        return '<button class="chip" data-rango="' + r + '" aria-pressed="' + (eleccion.rango === r) + '">' + MM.rango(r) + '</button>';
      }).join('');
      return {
        html: '<div class="panel">' +
          '<h2 class="titulo-pantalla">' + tr('Práctica', 'Practice') + '</h2>' +
          '<p class="bajada">' + tr('Quince cometas del tema que elijas. Los fallos no quitan vidas, pero cortan el combo.',
            'Fifteen comets from the topic you choose. Mistakes cost no lives, but they break your combo.') + '</p>' +
          '<div class="temas-practica">' + temas + '</div>' +
          '<div class="temas-practica">' + rangos + '</div>' +
          '<div class="fila-acciones">' +
            '<button class="btn primario" data-iniciar data-foco>' + ic('play') + tr('Empezar', 'Start') + '</button>' +
            '<button class="btn" data-volver>' + ic('arrow-left') + tr('Volver', 'Back') + '</button>' +
          '</div></div>',
        conectar: function (raiz) {
          clic(raiz, '[data-tema]', function (el) { eleccion.tema = el.getAttribute('data-tema'); practica(); });
          clic(raiz, '[data-rango]', function (el) { eleccion.rango = el.getAttribute('data-rango'); practica(); });
          clic(raiz, '[data-iniciar]', function () { juego().iniciar({ modo: 'practica', tema: eleccion.tema, rango: eleccion.rango }); });
          clic(raiz, '[data-volver]', titulo);
        }
      };
    });
  }

  /* ------------------------------------------------------------------ *
   * Pausa, ajustes y logros
   * ------------------------------------------------------------------ */

  function pausa() {
    mostrar(function () {
      return {
        html: '<div class="panel estrecho">' +
          '<h2 class="titulo-pantalla">' + tr('Pausa', 'Paused') + '</h2>' +
          '<p class="bajada">' + tr('Los cometas esperan quietos.', 'The comets wait, frozen in place.') + '</p>' +
          '<div class="rangos">' +
            '<button class="btn primario" data-seguir data-foco>' + ic('play') + tr('Continuar', 'Resume') + '</button>' +
            '<button class="btn" data-ajustes>' + ic('settings') + tr('Ajustes', 'Settings') + '</button>' +
            '<button class="btn" data-abandonar>' + ic('x') + tr('Abandonar partida', 'Quit match') + '</button>' +
          '</div></div>',
        conectar: function (raiz) {
          clic(raiz, '[data-seguir]', function () { juego().reanudar(); });
          clic(raiz, '[data-ajustes]', function () { ajustes(pausa); });
          clic(raiz, '[data-abandonar]', function () { juego().abandonar(); titulo(); });
        }
      };
    }, { velo: true });
  }

  function ajustes(volver) {
    var confirmar = false;
    function dibujar() {
      var a = global.Sonido.ajustes();
      var deslizador = function (clave, nombre) {
        return '<label class="ajuste"><span>' + nombre + '</span>' +
          '<input type="range" min="0" max="1" step="0.05" value="' + a[clave] + '" data-volumen="' + clave + '"></label>';
      };
      return {
        html: '<div class="panel estrecho">' +
          '<h2 class="titulo-pantalla">' + tr('Ajustes', 'Settings') + '</h2>' +
          '<div class="ajustes">' +
            deslizador('general', tr('Volumen general', 'Master volume')) +
            deslizador('musica', tr('Música', 'Music')) +
            deslizador('efectos', tr('Efectos', 'Effects')) +
            '<label class="ajuste"><span>' + tr('Silenciar todo', 'Mute everything') + '</span><input type="checkbox" data-silencio' + (a.silencio ? ' checked' : '') + '></label>' +
            '<label class="ajuste"><span>' + tr('Reducir movimiento', 'Reduce motion') + '</span><input type="checkbox" data-movimiento' + (reducirMovimiento() ? ' checked' : '') + '></label>' +
          '</div>' +
          '<div class="fila-acciones">' +
            '<button class="btn primario" data-volver data-foco>' + ic('check') + tr('Listo', 'Done') + '</button>' +
            '<button class="btn chico" data-borrar>' + ic('rotate-ccw') + (confirmar ? tr('Toca otra vez para borrar', 'Tap again to erase') : tr('Borrar progreso', 'Erase progress')) + '</button>' +
          '</div></div>',
        conectar: function (raiz) {
          raiz.querySelectorAll('[data-volumen]').forEach(function (el) {
            el.addEventListener('input', function () {
              global.Sonido.iniciar();
              global.Sonido.ajustar(el.getAttribute('data-volumen'), Number(el.value));
            });
            el.addEventListener('change', function () { global.Sonido.reproducir('acierto'); });
          });
          raiz.querySelector('[data-silencio]').addEventListener('change', function (ev) {
            global.Sonido.ajustar('silencio', ev.target.checked);
            barra();
          });
          raiz.querySelector('[data-movimiento]').addEventListener('change', function (ev) {
            try { localStorage.setItem(CLAVE_MOV, ev.target.checked ? '1' : '0'); } catch (e) { /* sin memoria */ }
            aplicarMovimiento();
          });
          clic(raiz, '[data-volver]', function () { volver(); });
          clic(raiz, '[data-borrar]', function () {
            if (!confirmar) { confirmar = true; mostrar(dibujar, { velo: true }); return; }
            global.Progreso.reiniciar();
            confirmar = false;
            volver();
          });
        }
      };
    }
    mostrar(dibujar, { velo: true });
  }

  function logros(volver) {
    mostrar(function () {
      var obtenidos = global.Progreso.datos().logros;
      var total = 0;
      var lista = global.Progreso.LOGROS.map(function (l) {
        var ok = !!obtenidos[l.id];
        if (ok) total++;
        var t = MM.idioma() === 'en' ? l.en : l.es;
        return '<div class="logro' + (ok ? ' obtenido' : '') + '">' + ic(ok ? l.icono : 'lock') +
          '<div><b>' + t[0] + '</b><span>' + t[1] + '</span></div></div>';
      }).join('');
      return {
        html: '<div class="panel">' +
          '<h2 class="titulo-pantalla">' + tr('Logros', 'Achievements') + '</h2>' +
          '<p class="bajada" style="margin-bottom:0">' + total + ' / ' + global.Progreso.LOGROS.length + '</p>' +
          '<div class="logros">' + lista + '</div>' +
          '<div class="fila-acciones"><button class="btn" data-volver data-foco>' + ic('arrow-left') + tr('Volver', 'Back') + '</button></div></div>',
        conectar: function (raiz) { clic(raiz, '[data-volver]', function () { volver(); }); }
      };
    }, { velo: true });
  }

  /* ------------------------------------------------------------------ *
   * Resultados
   * ------------------------------------------------------------------ */

  function titularResultado(r) {
    if (r.modo === 'campana') return r.superado ? tr('Región superada', 'Region cleared') : tr('El núcleo cayó', 'The core has fallen');
    if (r.modo === 'arcade') return r.superado ? tr('Arcade completado', 'Arcade complete') : tr('El núcleo cayó', 'The core has fallen');
    if (r.modo === 'supervivencia') return tr('Llegaste a la oleada ', 'You reached wave ') + r.oleada;
    return tr('Práctica terminada', 'Practice finished');
  }

  function graficaTemas(canvas, porTema) {
    var temas = Object.keys(porTema).filter(function (t) { return porTema[t].aciertos + porTema[t].fallos > 0; });
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    var g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!temas.length) return;
    var max = Math.max.apply(null, temas.map(function (t) { return porTema[t].aciertos + porTema[t].fallos; }));
    var fila = Math.min(28, h / temas.length);
    var etiqueta = Math.min(140, w * 0.38);
    g.font = '500 12px Figtree, sans-serif';
    g.textBaseline = 'middle';
    temas.forEach(function (t, i) {
      var y = i * fila + fila / 2;
      var ancho = w - etiqueta - 40;
      var a = porTema[t].aciertos / max * ancho, f = porTema[t].fallos / max * ancho;
      g.fillStyle = '#8a93ad';
      g.textAlign = 'right';
      g.fillText(MM.tema(t), etiqueta - 10, y);
      g.fillStyle = '#6ee7a8';
      g.fillRect(etiqueta, y - 7, a, 14);
      g.fillStyle = '#ff5a5f';
      g.fillRect(etiqueta + a, y - 7, f, 14);
      g.fillStyle = '#e9ecf5';
      g.textAlign = 'left';
      g.fillText(porTema[t].aciertos + ' / ' + (porTema[t].aciertos + porTema[t].fallos), etiqueta + a + f + 8, y);
    });
  }

  function resultados(r) {
    global.Sonido.musica('menu');
    mostrar(function () {
      var respuestas = r.aciertos + r.fallos;
      var precision = respuestas ? Math.round(r.aciertos / respuestas * 100) : 0;
      var metricas = [
        [r.aciertos, tr('aciertos', 'hits')],
        [precision + '%', tr('precisión', 'accuracy')],
        [r.comboMax, tr('combo máximo', 'best combo')],
        [r.jefesDerrotados, tr('jefes derrotados', 'bosses defeated')]
      ];
      if (r.modo === 'supervivencia') metricas.push([r.oleada, tr('oleada', 'wave')]);
      var siguiente = null;
      if (r.modo === 'campana' && r.superado) {
        var i = global.Progreso.RANGOS.indexOf(r.rango);
        if (i < 2) siguiente = global.Progreso.RANGOS[i + 1];
      }
      var nuevos = (r.nuevos || []).map(function (l) {
        var t = MM.idioma() === 'en' ? l.en : l.es;
        return '<div class="logro obtenido">' + ic(l.icono) + '<div><b>' + t[0] + '</b><span>' + t[1] + '</span></div></div>';
      }).join('');
      var subtitulo = r.modo === 'campana' || r.modo === 'practica'
        ? MM.region(r.tema) + ' · ' + MM.rango(r.rango)
        : (r.modo === 'arcade' ? 'Arcade' : tr('Supervivencia', 'Survival'));
      return {
        html: '<div class="panel">' +
          '<p class="bajada" style="margin:0">' + subtitulo + '</p>' +
          '<h2 class="titulo-pantalla">' + titularResultado(r) + '</h2>' +
          (r.modo === 'campana' && r.superado ? estrellas(r.vidasPerdidas === 0 ? 3 : (r.vidasPerdidas === 1 ? 2 : 1)) : '') +
          '<div class="resultado-cifra">' + MM.numero(r.puntos) + '</div>' +
          (r.record ? '<span class="insignia-record">' + ic('sparkles') + tr('Nuevo récord', 'New record') + '</span>' : '') +
          '<div class="metricas">' + metricas.map(function (m) { return '<div class="metrica"><b>' + m[0] + '</b><span>' + m[1] + '</span></div>'; }).join('') + '</div>' +
          '<canvas class="grafica-temas" aria-label="' + tr('Aciertos por tema', 'Hits by topic') + '"></canvas>' +
          (nuevos ? '<h3>' + tr('Logros nuevos', 'New achievements') + '</h3><div class="logros">' + nuevos + '</div>' : '') +
          '<div class="fila-acciones">' +
            (siguiente ? '<button class="btn primario" data-siguiente data-foco>' + ic('flame') + tr('Rango ', 'Rank: ') + MM.rango(siguiente) + '</button>' : '') +
            '<button class="btn' + (siguiente ? '' : ' primario') + '" data-repetir' + (siguiente ? '' : ' data-foco') + '>' + ic('rotate-ccw') + tr('Jugar de nuevo', 'Play again') + '</button>' +
            (r.modo === 'campana' ? '<button class="btn" data-mapa>' + ic('map') + tr('Mapa', 'Map') + '</button>' : '') +
            '<button class="btn" data-menu>' + ic('house') + tr('Menú', 'Menu') + '</button>' +
          '</div></div>',
        conectar: function (raiz) {
          graficaTemas(raiz.querySelector('.grafica-temas'), r.porTema);
          clic(raiz, '[data-repetir]', function () { juego().iniciar(r.config); });
          clic(raiz, '[data-siguiente]', function () { juego().iniciar({ modo: 'campana', tema: r.tema, rango: siguiente }); });
          clic(raiz, '[data-mapa]', mapa);
          clic(raiz, '[data-menu]', titulo);
        }
      };
    });
  }

  /* ------------------------------------------------------------------ *
   * Anuncios y avisos
   * ------------------------------------------------------------------ */

  var temporizadorAnuncio = null;

  function anuncio(pequeno, grande) {
    var el = $('anuncio');
    el.hidden = true;
    void el.offsetWidth;
    el.innerHTML = '<small>' + pequeno + '</small><strong>' + grande + '</strong>';
    el.hidden = false;
    $('lector').textContent = pequeno + '. ' + grande;
    clearTimeout(temporizadorAnuncio);
    temporizadorAnuncio = setTimeout(function () { el.hidden = true; }, 2200);
  }

  function aviso(logro) {
    var t = MM.idioma() === 'en' ? logro.en : logro.es;
    var el = document.createElement('div');
    el.className = 'aviso';
    el.innerHTML = ic(logro.icono) + '<div><b>' + t[0] + '</b><small>' + tr('Logro desbloqueado', 'Achievement unlocked') + '</small></div>';
    $('avisos').appendChild(el);
    global.Sonido.reproducir('logro');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 4200);
  }

  /* ------------------------------------------------------------------ *
   * Arranque
   * ------------------------------------------------------------------ */

  function arrancar() {
    barra();
    conectarBarra();
    aplicarMovimiento();

    // El audio solo puede nacer tras un gesto del usuario.
    var despertar = function () { global.Sonido.iniciar(); if (!juego().enPartida() && actual) global.Sonido.musica('menu'); };
    document.addEventListener('pointerdown', despertar, { once: true });
    document.addEventListener('keydown', despertar, { once: true });

    document.addEventListener('keydown', function (ev) {
      var enCampo = ev.target && (ev.target.tagName === 'INPUT' && ev.target.type !== 'range' && ev.target.type !== 'checkbox');
      if (ev.code === 'KeyM' && !enCampo) alternarSonido();
    });

    document.addEventListener('i18n:langChange', function () {
      barra();
      if (actual && !$('pantalla').hidden) mostrar(actual, { velo: $('pantalla').classList.contains('velo'), sinFoco: true });
    });

    titulo();
  }

  global.Pantallas = {
    titulo: titulo, mapa: mapa, rango: rango, practica: practica,
    pausa: pausa, ajustes: ajustes, logros: logros, resultados: resultados,
    anuncio: anuncio, aviso: aviso, ocultar: ocultar, barra: barra,
    reducirMovimiento: reducirMovimiento
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})(window);
