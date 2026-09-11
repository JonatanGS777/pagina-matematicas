/*
 * Laboratorio de Fisica 3D - Interfaz
 *
 * Todo el panel de instrumentos: controles de cada estacion, lecturas en
 * vivo, misiones, tabla de datos, mapa del salon y menu de descargas.
 * Los iconos son SVG de Lucide escritos en linea, sin cargar fuentes de
 * iconos externas.
 */
(function (global) {
  'use strict';

  var ICONOS = {
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    reiniciar: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    descargar: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    controles: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    medidor: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    objetivo: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    tabla: '<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>',
    cerrar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    candado: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    documento: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    libro: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    mapa: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    atomo: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
    idea: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    medalla: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    persona: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    teclado: '<path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
    flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    casa: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    rayo: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
  };

  function icono(nombre, tamano) {
    return '<svg class="ic" width="' + (tamano || 18) + '" height="' + (tamano || 18) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONOS[nombre] || '') + '</svg>';
  }

  function el(id) { return document.getElementById(id); }

  function escapar(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ================================================================== *
   * HUD principal
   * ================================================================== */

  function Hud(lab) {
    this.lab = lab;
    this.estacionAbierta = null;
    this.pestana = 'controles';
    this.tiempoRefresco = 0;

    this.nodo = {
      portada: el('portada'),
      hud: el('hud'),
      mira: el('mira'),
      aviso: el('aviso-estacion'),
      panel: el('panel'),
      panelTitulo: el('panel-titulo'),
      panelSubtitulo: el('panel-subtitulo'),
      panelCuerpo: el('panel-cuerpo'),
      pestanas: el('pestanas'),
      mapa: el('mapa'),
      progreso: el('progreso-barra'),
      progresoTexto: el('progreso-texto'),
      nivel: el('nivel-nombre'),
      toasts: el('toasts'),
      descargas: el('descargas'),
      ayuda: el('ayuda')
    };

    this.conectar();
    this.actualizarProgreso();
  }

  Hud.prototype.conectar = function () {
    var self = this;

    el('btn-entrar').addEventListener('click', function () { self.lab.entrar(); });

    // En pantallas tactiles no hay teclado ni bloqueo de cursor, asi que se
    // avisa y se deja la via que si funciona: entrar por la lista de estaciones.
    var punteroFino = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!punteroFino) {
      el('aviso-tactil').classList.remove('oculto');
      el('btn-entrar').querySelector('span').textContent = 'Ver el salon';
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-ir]'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-ir');
        self.ocultarPortada();
        self.irAEstacion(id);
        self.abrirPanel(id);
      });
    });
    el('btn-ayuda').addEventListener('click', function () { self.alternarAyuda(true); });
    el('btn-cerrar-ayuda').addEventListener('click', function () { self.alternarAyuda(false); });
    el('btn-cerrar-panel').addEventListener('click', function () { self.cerrarPanel(); });
    el('btn-descargas').addEventListener('click', function () { self.alternarDescargas(); });
    el('btn-cerrar-descargas').addEventListener('click', function () { self.alternarDescargas(false); });

    // Datos del estudiante para el reporte.
    var nom = el('campo-nombre'), gru = el('campo-grupo');
    nom.value = this.lab.progreso.estudiante.nombre || '';
    gru.value = this.lab.progreso.estudiante.grupo || '';
    nom.addEventListener('input', function () {
      self.lab.progreso.estudiante.nombre = nom.value;
      self.lab.progreso.guardar();
    });
    gru.addEventListener('input', function () {
      self.lab.progreso.estudiante.grupo = gru.value;
      self.lab.progreso.guardar();
    });

    el('btn-reiniciar-progreso').addEventListener('click', function () {
      if (confirm('Se borra todo el progreso guardado en esta computadora. Continuar?')) {
        self.lab.progreso.reiniciarTodo();
        self.toast('Progreso reiniciado.', 'info');
        if (self.estacionAbierta) self.dibujarPanel();
      }
    });

    // Botones de descarga.
    el('dl-csv').addEventListener('click', function () {
      var r = self.estacionAbierta
        ? global.Exportar.descargarCSV(self.estacionAbierta, self.lab.progreso.estudiante)
        : global.Exportar.descargarCSVCompleto(self.lab.estaciones, self.lab.progreso.estudiante);
      self.toast(r.mensaje, r.ok ? 'ok' : 'error');
    });
    el('dl-csv-todo').addEventListener('click', function () {
      var r = global.Exportar.descargarCSVCompleto(self.lab.estaciones, self.lab.progreso.estudiante);
      self.toast(r.mensaje, r.ok ? 'ok' : 'error');
    });
    el('dl-reporte').addEventListener('click', function () {
      var r = global.Exportar.reporteEstudiante(self.lab.estaciones, self.lab.progreso);
      self.toast(r.mensaje, r.ok ? 'ok' : 'error');
    });
    el('dl-guia').addEventListener('click', function () {
      var r = global.Exportar.guiaDocente(self.lab.estaciones);
      self.toast(r.mensaje, r.ok ? 'ok' : 'error');
    });
    el('dl-offline').addEventListener('click', function (ev) {
      var boton = ev.currentTarget;
      boton.disabled = true;
      self.toast('Preparando el archivo, esto toma unos segundos...', 'info');
      global.Exportar.generarPortable(function (paso) { self.toast(paso, 'info'); })
        .then(function (r) {
          self.toast(r.mensaje, r.ok ? 'ok' : 'error');
          boton.disabled = false;
        });
    });

    // Atajos de teclado.
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        if (e.code === 'Escape') e.target.blur();
        return;
      }
      if (e.code === 'KeyE') {
        if (self.estacionAbierta) self.cerrarPanel();
        else if (self.lab.jugador.estacionCercana) self.abrirPanel(self.lab.jugador.estacionCercana);
      }
      if (e.code === 'Escape') {
        if (self.estacionAbierta) self.cerrarPanel();
        self.alternarDescargas(false);
        self.alternarAyuda(false);
      }
      if (e.code === 'KeyM') self.alternarDescargas();
      if (e.code === 'KeyH') self.alternarAyuda();
      if (e.code === 'Space' && self.estacionAbierta) {
        e.preventDefault();
        self.estacionAbierta.correr();
      }
    });

    // El mapa permite saltar de estacion sin caminar.
    this.nodo.mapa.addEventListener('click', function (ev) {
      var caja = self.nodo.mapa.getBoundingClientRect();
      var rx = (ev.clientX - caja.left) / caja.width;
      var ry = (ev.clientY - caja.top) / caja.height;
      var S = global.Escena.SALON;
      var x = (rx - 0.5) * S.ancho;
      var z = (ry - 0.5) * S.fondo;
      var mejor = null, mejorD = 4.5;
      self.lab.estaciones.forEach(function (e) {
        var d = Math.hypot(e.posicion.x - x, e.posicion.z - z);
        if (d < mejorD) { mejorD = d; mejor = e; }
      });
      if (mejor) {
        self.irAEstacion(mejor.id);
        self.toast('Te moviste a la estacion ' + mejor.numero + ': ' + mejor.titulo, 'info');
      }
    });

    this.lab.progreso.alCambiar(function () { self.actualizarProgreso(); });
  };

  /* ------------------------------------------------------------------ *
   * Estados generales
   * ------------------------------------------------------------------ */

  Hud.prototype.ocultarPortada = function () {
    this.nodo.portada.classList.add('oculto');
  };

  // Coloca al estudiante en el puesto de una estacion. Algunas se miran de
  // lado, como la galeria de tiro, y por eso pueden definir su propio punto.
  Hud.prototype.irAEstacion = function (id) {
    var e = this.lab.buscarEstacion(id);
    if (!e) return;
    var hacia = e.mirar || e.posicion;
    this.lab.jugador.teletransportar(e.puesto.x, e.puesto.z, hacia.x, hacia.z);
  };

  Hud.prototype.alternarAyuda = function (forzar) {
    var mostrar = forzar != null ? forzar : this.nodo.ayuda.classList.contains('oculto');
    this.nodo.ayuda.classList.toggle('oculto', !mostrar);
    if (mostrar) this.lab.jugador.salir();
  };

  Hud.prototype.alternarDescargas = function (forzar) {
    var mostrar = forzar != null ? forzar : this.nodo.descargas.classList.contains('oculto');
    this.nodo.descargas.classList.toggle('oculto', !mostrar);
    if (mostrar) this.lab.jugador.salir();
  };

  Hud.prototype.toast = function (texto, tipo) {
    var div = document.createElement('div');
    div.className = 'toast toast-' + (tipo || 'info');
    var ic = tipo === 'ok' ? 'check' : (tipo === 'error' ? 'info' : 'info');
    div.innerHTML = icono(ic, 17) + '<span>' + escapar(texto) + '</span>';
    this.nodo.toasts.appendChild(div);
    setTimeout(function () { div.classList.add('saliendo'); }, 5200);
    setTimeout(function () { if (div.parentNode) div.parentNode.removeChild(div); }, 5800);
  };

  // Aviso flotante de "pulsa E" cuando el estudiante se acerca a una mesa.
  Hud.prototype.mostrarAviso = function (estacion) {
    if (!estacion || this.estacionAbierta) {
      this.nodo.aviso.classList.add('oculto');
      return;
    }
    var hechas = this.lab.progreso.completadasEn(estacion.id);
    this.nodo.aviso.innerHTML =
      '<span class="aviso-num">' + estacion.numero + '</span>' +
      '<span class="aviso-txt"><b>' + escapar(estacion.titulo) + '</b>' +
      '<small>' + hechas + ' de ' + estacion.misiones.length + ' misiones resueltas</small></span>' +
      '<kbd>E</kbd>';
    this.nodo.aviso.classList.remove('oculto');
  };

  Hud.prototype.actualizarProgreso = function () {
    var pr = this.lab.progreso;
    var hechas = pr.totalCompletadas(), total = pr.totalMisiones();
    var pct = total ? (hechas / total * 100) : 0;
    this.nodo.progreso.style.width = pct.toFixed(1) + '%';
    this.nodo.progresoTexto.textContent = hechas + ' / ' + total;
    this.nodo.nivel.textContent = pr.nivel().nombre;
  };

  /* ------------------------------------------------------------------ *
   * Panel de estacion
   * ------------------------------------------------------------------ */

  Hud.prototype.abrirPanel = function (idEstacion) {
    var estacion = this.lab.buscarEstacion(idEstacion);
    if (!estacion) return;
    this.estacionAbierta = estacion;
    this.lab.jugador.salir();
    this.nodo.panel.classList.remove('oculto');
    this.nodo.aviso.classList.add('oculto');
    document.body.classList.add('panel-abierto');
    this.dibujarPanel();
  };

  Hud.prototype.cerrarPanel = function () {
    this.estacionAbierta = null;
    this.nodo.panel.classList.add('oculto');
    document.body.classList.remove('panel-abierto');
  };

  Hud.prototype.dibujarPanel = function () {
    var e = this.estacionAbierta;
    if (!e) return;

    this.nodo.panelTitulo.innerHTML =
      '<span class="panel-num">' + e.numero + '</span>' + escapar(e.titulo);
    this.nodo.panelSubtitulo.textContent = e.subtitulo;

    var pestanas = [
      { id: 'controles', etiqueta: 'Controles', ic: 'controles' },
      { id: 'lecturas', etiqueta: 'Lecturas', ic: 'medidor' },
      { id: 'misiones', etiqueta: 'Misiones', ic: 'objetivo' },
      { id: 'datos', etiqueta: 'Datos', ic: 'tabla' }
    ];
    var self = this;
    var pendientes = e.misiones.length - this.lab.progreso.completadasEn(e.id);

    this.nodo.pestanas.innerHTML = pestanas.map(function (t) {
      var insignia = (t.id === 'misiones' && pendientes > 0)
        ? '<span class="insignia">' + pendientes + '</span>' : '';
      var conteo = (t.id === 'datos' && e.historial.length)
        ? '<span class="insignia gris">' + e.historial.length + '</span>' : '';
      return '<button class="pestana' + (self.pestana === t.id ? ' activa' : '') +
        '" data-pestana="' + t.id + '">' + icono(t.ic, 16) + '<span>' + t.etiqueta + '</span>' +
        insignia + conteo + '</button>';
    }).join('');

    Array.prototype.forEach.call(this.nodo.pestanas.children, function (btn) {
      btn.addEventListener('click', function () {
        self.pestana = btn.getAttribute('data-pestana');
        self.dibujarPanel();
      });
    });

    if (this.pestana === 'controles') this.dibujarControles(e);
    else if (this.pestana === 'lecturas') this.dibujarLecturas(e);
    else if (this.pestana === 'misiones') this.dibujarMisiones(e);
    else this.dibujarDatos(e);
  };

  Hud.prototype.dibujarControles = function (e) {
    var self = this;
    var h = [];

    h.push('<p class="descripcion">' + escapar(e.descripcion) + '</p>');
    h.push('<div class="formulario">');
    e.ecuaciones.forEach(function (f) {
      h.push('<code class="ecuacion">' + escapar(f) + '</code>');
    });
    h.push('</div>');

    h.push('<div class="controles">');
    e.parametros.forEach(function (par, i) {
      if (par.tipo === 'opciones') {
        h.push('<div class="control">');
        h.push('<label for="par-' + i + '">' + escapar(par.etiqueta) + '</label>');
        h.push('<select id="par-' + i + '" data-par="' + i + '">');
        par.opciones.forEach(function (o) {
          h.push('<option value="' + o.valor + '"' + (o.valor === par.valor ? ' selected' : '') + '>' +
            escapar(o.etiqueta) + '</option>');
        });
        h.push('</select></div>');
      } else {
        h.push('<div class="control">');
        h.push('<label for="par-' + i + '">' + escapar(par.etiqueta) +
          '<output id="out-' + i + '">' + formatearValor(par.valor) +
          (par.unidad ? ' ' + escapar(par.unidad) : '') + '</output></label>');
        h.push('<input type="range" id="par-' + i + '" data-par="' + i + '" min="' + par.min +
          '" max="' + par.max + '" step="' + par.paso + '" value="' + par.valor + '">');
        h.push('</div>');
      }
    });
    h.push('</div>');

    // Botonera de la estacion.
    h.push('<div class="acciones">');
    if (e.id === 'campo-electrico') {
      h.push('<button class="btn principal" id="btn-correr">' + icono('play') +
        '<span>' + (e.corriendo ? 'Detener la carga' : 'Soltar la carga de prueba') + '</span></button>');
      h.push('<button class="btn" id="btn-anotar">' + icono('tabla') + '<span>Anotar medicion</span></button>');
    } else if (e.id === 'lorentz') {
      h.push('<button class="btn principal" id="btn-correr">' + icono('play') + '<span>Lanzar particula</span></button>');
      h.push('<button class="btn" id="btn-anotar">' + icono('tabla') + '<span>Anotar medicion</span></button>');
    } else {
      h.push('<button class="btn principal" id="btn-correr">' + icono('play') + '<span>Ejecutar experimento</span></button>');
    }
    h.push('<button class="btn" id="btn-reset">' + icono('reiniciar') + '<span>Reiniciar</span></button>');
    h.push('</div>');

    if (e.id === 'campo-electrico') {
      h.push('<div class="mover-sonda"><span>Mover la sonda</span><div class="cruceta">');
      [['-x', 'izquierda'], ['+x', 'derecha'], ['+y', 'subir'], ['-y', 'bajar'], ['-z', 'atras'], ['+z', 'adelante']]
        .forEach(function (m) {
          h.push('<button class="btn mini" data-mover="' + m[0] + '">' + escapar(m[1]) + '</button>');
        });
      h.push('</div></div>');
    }

    h.push('<p class="atajo">' + icono('teclado', 15) +
      ' Barra espaciadora para ejecutar, E para cerrar el panel.</p>');

    this.nodo.panelCuerpo.innerHTML = h.join('');

    // Conexion de los controles al modelo.
    Array.prototype.forEach.call(this.nodo.panelCuerpo.querySelectorAll('[data-par]'), function (control) {
      var i = parseInt(control.getAttribute('data-par'), 10);
      var par = e.parametros[i];
      control.addEventListener('input', function () {
        par.valor = parseFloat(control.value);
        var salida = el('out-' + i);
        if (salida) {
          salida.textContent = formatearValor(par.valor) + (par.unidad ? ' ' + par.unidad : '');
        }
        e.reiniciar();
      });
    });

    var btnCorrer = el('btn-correr');
    if (btnCorrer) {
      btnCorrer.addEventListener('click', function () {
        e.correr();
        if (e.id === 'campo-electrico') self.dibujarControles(e);
      });
    }
    var btnReset = el('btn-reset');
    if (btnReset) btnReset.addEventListener('click', function () { e.reiniciar(); });

    var btnAnotar = el('btn-anotar');
    if (btnAnotar) {
      btnAnotar.addEventListener('click', function () {
        e.registrarMedicion();
        self.toast('Medicion anotada en la tabla de datos.', 'ok');
        self.dibujarPanel();
      });
    }

    Array.prototype.forEach.call(this.nodo.panelCuerpo.querySelectorAll('[data-mover]'), function (btn) {
      btn.addEventListener('click', function () {
        var m = btn.getAttribute('data-mover');
        var d = 0.25;
        e.moverPrueba(
          m === '+x' ? d : (m === '-x' ? -d : 0),
          m === '+y' ? d : (m === '-y' ? -d : 0),
          m === '+z' ? d : (m === '-z' ? -d : 0)
        );
      });
    });
  };

  function formatearValor(v) {
    if (typeof v !== 'number') return String(v);
    if (Number.isInteger(v)) return String(v);
    return v.toFixed(2).replace(/0$/, '').replace(/\.$/, '');
  }

  Hud.prototype.dibujarLecturas = function (e) {
    var h = ['<div class="lecturas">'];
    e.lecturas().forEach(function (l) {
      var clase = l.destacado ? ' destacada' : (l.teorico ? ' teorica' : '');
      h.push('<div class="lectura' + clase + '">');
      h.push('<span class="lec-etiqueta">' + escapar(l.etiqueta) + '</span>');
      h.push('<span class="lec-valor">' + escapar(l.valor) +
        '<small>' + escapar(l.unidad || '') + '</small></span>');
      h.push('</div>');
    });
    h.push('</div>');
    h.push('<p class="nota">' + icono('info', 15) +
      ' Los valores en gris son los que predice la teoria. Los resaltados son lo que midio el laboratorio.</p>');
    this.nodo.panelCuerpo.innerHTML = h.join('');
  };

  Hud.prototype.dibujarMisiones = function (e) {
    var self = this;
    var pr = this.lab.progreso;
    var h = [];

    e.misiones.forEach(function (m, i) {
      var reg = pr.registro(e.id, m.id);
      var abierta = pr.desbloqueada(e, i);
      var clase = reg.completada ? 'resuelta' : (abierta ? 'abierta' : 'bloqueada');

      h.push('<div class="mision ' + clase + '">');
      h.push('<div class="mision-cabecera">');
      h.push('<span class="mision-estado">' +
        (reg.completada ? icono('check', 16) : (abierta ? icono('objetivo', 16) : icono('candado', 16))) +
        '</span>');
      h.push('<span class="mision-titulo">Mision ' + (i + 1) +
        '<small>' + (m.tipo === 'prediccion' ? 'prediccion numerica' : 'reto practico') + '</small></span>');
      if (reg.completada) {
        h.push('<span class="mision-puntos">' + pr.puntosDe(e.id, m.id) + ' pts</span>');
      }
      h.push('</div>');

      if (!abierta) {
        h.push('<p class="mision-texto">Resuelve la mision anterior para desbloquear esta.</p>');
      } else {
        h.push('<p class="mision-texto">' + escapar(m.enunciado) + '</p>');

        if (!reg.completada) {
          if (m.tipo === 'prediccion') {
            h.push('<div class="mision-entrada">');
            h.push('<input type="number" step="any" id="resp-' + i + '" placeholder="' +
              escapar(m.entrada.etiqueta) + '">');
            h.push('<span class="unidad">' + escapar(m.entrada.unidad) + '</span>');
            h.push('<button class="btn principal" data-verificar="' + i + '">' +
              icono('check', 16) + '<span>Comprobar</span></button>');
            h.push('</div>');
          } else {
            h.push('<div class="mision-entrada">');
            h.push('<button class="btn principal" data-verificar="' + i + '">' +
              icono('check', 16) + '<span>Comprobar si lo logre</span></button>');
            h.push('</div>');
          }
          if (reg.intentos > 0) {
            h.push('<p class="mision-intentos">Intentos: ' + reg.intentos + '</p>');
          }
          h.push('<details class="pista"><summary>' + icono('idea', 15) + ' Ver pista</summary><p>' +
            escapar(m.pista || '') + '</p></details>');
        } else {
          h.push('<p class="mision-logro">' + icono('medalla', 15) + ' Resuelta en ' +
            reg.intentos + (reg.intentos === 1 ? ' intento' : ' intentos') +
            (reg.respuesta != null ? ', con respuesta ' + global.Progreso.formatear(reg.respuesta) : '') + '.</p>');
        }
        h.push('<div class="mision-resultado" id="res-' + i + '"></div>');
      }
      h.push('</div>');
    });

    this.nodo.panelCuerpo.innerHTML = h.join('');

    Array.prototype.forEach.call(this.nodo.panelCuerpo.querySelectorAll('[data-verificar]'), function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-verificar'), 10);
        var m = e.misiones[i];
        var salida = el('res-' + i);
        var resultado;

        if (m.tipo === 'prediccion') {
          var campo = el('resp-' + i);
          var valor = parseFloat(String(campo.value).replace(',', '.'));
          resultado = self.lab.progreso.evaluarPrediccion(e, m, valor);
        } else {
          resultado = self.lab.progreso.evaluarReto(e, m);
        }

        salida.className = 'mision-resultado ' + (resultado.ok ? 'bien' : 'mal');
        salida.innerHTML = icono(resultado.ok ? 'check' : 'info', 16) +
          '<span>' + escapar(resultado.mensaje) + '</span>';

        if (resultado.ok) {
          self.toast('Mision resuelta. ' + (resultado.puntos || 0) + ' puntos.', 'ok');
          setTimeout(function () { self.dibujarPanel(); }, 1800);
        }
      });
    });

    // La tecla enter comprueba la prediccion sin usar el mouse.
    Array.prototype.forEach.call(this.nodo.panelCuerpo.querySelectorAll('input[type="number"]'), function (campo) {
      campo.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
          var i = campo.id.replace('resp-', '');
          var btn = self.nodo.panelCuerpo.querySelector('[data-verificar="' + i + '"]');
          if (btn) btn.click();
        }
      });
    });
  };

  Hud.prototype.dibujarDatos = function (e) {
    var self = this;
    var h = [];

    if (!e.historial.length) {
      h.push('<div class="vacio">' + icono('tabla', 28) +
        '<p>Todavia no hay mediciones. Ejecuta el experimento y cada corrida se anota aqui sola.</p></div>');
    } else {
      var cols = e.columnas();
      h.push('<div class="tabla-envoltura"><table class="tabla-datos"><thead><tr>');
      cols.forEach(function (c) { h.push('<th>' + escapar(c.etiqueta) + '</th>'); });
      h.push('</tr></thead><tbody>');
      e.historial.slice().reverse().forEach(function (fila) {
        h.push('<tr>');
        cols.forEach(function (c) {
          var v = fila[c.clave];
          if (typeof v === 'number' && c.decimales != null) v = v.toFixed(c.decimales);
          h.push('<td>' + escapar(v == null ? '' : v) + '</td>');
        });
        h.push('</tr>');
      });
      h.push('</tbody></table></div>');
    }

    h.push('<div class="acciones">');
    h.push('<button class="btn principal" id="btn-csv-estacion">' + icono('descargar') +
      '<span>Descargar estos datos en CSV</span></button>');
    h.push('<button class="btn" id="btn-borrar-datos">' + icono('reiniciar') + '<span>Borrar la tabla</span></button>');
    h.push('</div>');

    this.nodo.panelCuerpo.innerHTML = h.join('');

    el('btn-csv-estacion').addEventListener('click', function () {
      var r = global.Exportar.descargarCSV(e, self.lab.progreso.estudiante);
      self.toast(r.mensaje, r.ok ? 'ok' : 'error');
    });
    el('btn-borrar-datos').addEventListener('click', function () {
      e.historial = [];
      self.dibujarPanel();
      self.toast('Tabla de datos vaciada.', 'info');
    });
  };

  /* ------------------------------------------------------------------ *
   * Mapa del salon
   * ------------------------------------------------------------------ */

  Hud.prototype.dibujarMapa = function () {
    var canvas = this.nodo.mapa;
    var ctx = canvas.getContext('2d');
    var S = global.Escena.SALON;
    var W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(10,14,20,0.82)';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(143,163,189,0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    function aMapa(x, z) {
      return [((x + S.ancho / 2) / S.ancho) * W, ((z + S.fondo / 2) / S.fondo) * H];
    }

    var self = this;
    this.lab.estaciones.forEach(function (e) {
      var q = aMapa(e.posicion.x, e.posicion.z);
      var hechas = self.lab.progreso.completadasEn(e.id);
      var completa = hechas === e.misiones.length;

      ctx.beginPath();
      ctx.arc(q[0], q[1], 8, 0, Math.PI * 2);
      ctx.fillStyle = completa ? 'rgba(126,231,135,0.9)' : 'rgba(255,179,71,0.75)';
      ctx.fill();

      ctx.fillStyle = '#0a0e14';
      ctx.font = 'bold 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(e.numero), q[0], q[1] + 0.5);
    });

    // Posicion y direccion de la mirada del estudiante.
    var j = this.lab.jugador;
    var pj = aMapa(j.posicion.x, j.posicion.z);
    ctx.save();
    ctx.translate(pj[0], pj[1]);
    ctx.rotate(-j.yaw);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5.5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5.5, 6);
    ctx.closePath();
    ctx.fillStyle = '#4fd6e3';
    ctx.fill();
    ctx.restore();
  };

  Hud.prototype.refrescar = function (dt) {
    this.tiempoRefresco += dt;
    // Diez refrescos por segundo alcanzan para que los numeros se lean bien
    // sin rehacer el DOM en cada cuadro.
    if (this.tiempoRefresco < 0.1) return;
    this.tiempoRefresco = 0;

    this.dibujarMapa();
    if (this.estacionAbierta && this.pestana === 'lecturas') {
      this.dibujarLecturas(this.estacionAbierta);
    }
  };

  global.Hud = Hud;
  global.Hud.icono = icono;
})(window);
