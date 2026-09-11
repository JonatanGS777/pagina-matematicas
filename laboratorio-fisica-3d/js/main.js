/*
 * Laboratorio de Fisica 3D - Arranque
 *
 * Monta el renderizador, arma el salon con sus siete estaciones,
 * conecta al jugador con la interfaz y corre el ciclo de animacion.
 */
(function (global) {
  'use strict';

  function Laboratorio() {
    this.lienzo = document.getElementById('lienzo');
    this.reloj = { anterior: performance.now() };
    this.estaciones = [];
    this.pausado = false;
  }

  Laboratorio.prototype.iniciar = function () {
    if (typeof THREE === 'undefined') {
      this.mostrarError('No se pudo cargar el motor 3D. Revisa tu conexion a internet y recarga la pagina.');
      return;
    }

    this.crearRenderizador();
    this.crearEscena();
    this.crearEstaciones();
    this.crearJugador();

    this.progreso = new global.Progreso(this.estaciones);
    this.hud = new global.Hud(this);

    this.conectarVentana();
    this.animar();
    document.body.classList.add('listo');
  };

  Laboratorio.prototype.mostrarError = function (texto) {
    var aviso = document.getElementById('error-carga');
    if (aviso) {
      aviso.querySelector('p').textContent = texto;
      aviso.classList.remove('oculto');
    }
  };

  Laboratorio.prototype.crearRenderizador = function () {
    this.renderizador = new THREE.WebGLRenderer({
      canvas: this.lienzo,
      antialias: true,
      powerPreference: 'high-performance'
    });
    // Se limita a 2 para que no se ahogue en pantallas de mucha densidad.
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
    this.renderizador.shadowMap.enabled = true;
    this.renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderizador.outputEncoding = THREE.sRGBEncoding;
    this.renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderizador.toneMappingExposure = 1.05;
  };

  Laboratorio.prototype.crearEscena = function () {
    this.escena = new THREE.Scene();
    this.escena.background = new THREE.Color(0x0a0e14);
    this.escena.fog = new THREE.Fog(0x0a0e14, 34, 72);

    this.camara = new THREE.PerspectiveCamera(
      68, window.innerWidth / window.innerHeight, 0.1, 400
    );

    global.Escena.construirSalon(this.escena);
    global.Escena.agregarLuces(this.escena);
  };

  Laboratorio.prototype.crearEstaciones = function () {
    var constructores = global.EstacionesMecanica.concat(global.EstacionesEM);
    var self = this;

    constructores.forEach(function (Constructor) {
      var estacion = new Constructor();
      var grupo = estacion.construir();
      grupo.position.set(estacion.posicion.x, 0, estacion.posicion.z);

      // Toda estacion se arma mirando hacia +z y su puesto queda de ese
      // lado, asi que las pantallas de instrumentos siempre dan al frente.
      self.escena.add(grupo);

      // Mesa de trabajo bajo las estaciones que la necesitan.
      if (!estacion.sinMesa) {
        var t = estacion.mesaTamano || { ancho: 3.6, fondo: 1.8 };
        var mesa = global.Escena.crearMesa(t.ancho, t.fondo, 0.95);
        mesa.position.set(estacion.posicion.x, 0, estacion.posicion.z);
        mesa.userData.canto.material.color.setHex(estacion.color);
        self.escena.add(mesa);
        estacion.mesa = mesa;
      }

      // Letrero colgante y marca circular en el piso.
      var letrero = global.Escena.crearLetrero(estacion.numero, estacion.titulo, estacion.subtitulo);
      letrero.position.set(estacion.posicion.x, 4.3, estacion.posicion.z);
      if (estacion.id === 'caida-libre') letrero.position.x += 2.4;
      self.escena.add(letrero);

      var marca = global.Escena.crearMarcaPiso(estacion.color);
      marca.position.set(estacion.puesto.x, 0, estacion.puesto.z);
      self.escena.add(marca);
      estacion.marca = marca;

      self.estaciones.push(estacion);
    });
  };

  Laboratorio.prototype.crearJugador = function () {
    var S = global.Escena.SALON;
    var self = this;

    this.jugador = new global.Jugador(this.camara, this.lienzo, {
      // Entra por el fondo del salon, de cara a las estaciones y la pizarra.
      x: 0, z: 9.5, yaw: 0,
      limites: {
        minX: -S.ancho / 2 + 0.6, maxX: S.ancho / 2 - 0.6,
        minZ: -S.fondo / 2 + 0.6, maxZ: S.fondo / 2 - 0.6
      },
      alCambiarEstacion: function (id) {
        self.hud.mostrarAviso(id ? self.buscarEstacion(id) : null);
      }
    });

    this.jugador.alCambiarModo = function (activo) {
      if (activo) self.hud.ocultarPortada();
      document.getElementById('mira').classList.toggle('oculto', !activo);
    };

    // Cada estacion es solida y tiene su circulo de activacion.
    this.estaciones.forEach(function (e) {
      self.jugador.registrarEstacion(e.id, e.puesto.x, e.puesto.z, 2.4);
      if (!e.sinMesa) {
        var t = e.mesaTamano || { ancho: 3.6, fondo: 1.8 };
        self.jugador.agregarObstaculo(
          e.posicion.x - t.ancho / 2, e.posicion.x + t.ancho / 2,
          e.posicion.z - t.fondo / 2, e.posicion.z + t.fondo / 2
        );
      }
    });
    // El tubo de caida libre y las bobinas tambien bloquean el paso.
    this.jugador.agregarObstaculo(-15.9, -14.1, -5.9, -4.1);
    this.jugador.agregarObstaculo(7.4, 10.6, 2.4, 5.6);
  };

  Laboratorio.prototype.buscarEstacion = function (id) {
    for (var i = 0; i < this.estaciones.length; i++) {
      if (this.estaciones[i].id === id) return this.estaciones[i];
    }
    return null;
  };

  Laboratorio.prototype.entrar = function () {
    this.hud.ocultarPortada();
    this.jugador.entrar();
  };

  Laboratorio.prototype.conectarVentana = function () {
    var self = this;
    window.addEventListener('resize', function () {
      self.camara.aspect = window.innerWidth / window.innerHeight;
      self.camara.updateProjectionMatrix();
      self.renderizador.setSize(window.innerWidth, window.innerHeight);
    });

    // Al hacer clic en el salon se recupera el control de la camara.
    this.lienzo.addEventListener('click', function () {
      if (!self.hud.estacionAbierta &&
          document.getElementById('descargas').classList.contains('oculto') &&
          document.getElementById('ayuda').classList.contains('oculto')) {
        self.jugador.entrar();
      }
    });

    // Con la pestana en segundo plano no tiene sentido seguir calculando.
    document.addEventListener('visibilitychange', function () {
      self.pausado = document.hidden;
      if (!self.pausado) self.reloj.anterior = performance.now();
    });
  };

  Laboratorio.prototype.animar = function () {
    var self = this;
    function cuadro(ahora) {
      requestAnimationFrame(cuadro);
      if (self.pausado) return;

      var dt = Math.min((ahora - self.reloj.anterior) / 1000, 0.05);
      self.reloj.anterior = ahora;

      self.jugador.actualizar(dt);

      for (var i = 0; i < self.estaciones.length; i++) {
        self.estaciones[i].actualizar(dt);
      }

      self.animarMarcas(ahora / 1000);
      self.hud.refrescar(dt);
      self.renderizador.render(self.escena, self.camara);
    }
    requestAnimationFrame(cuadro);
  };

  // La marca del piso late cuando el estudiante esta parado sobre ella.
  Laboratorio.prototype.animarMarcas = function (t) {
    var cercana = this.jugador.estacionCercana;
    for (var i = 0; i < this.estaciones.length; i++) {
      var e = this.estaciones[i];
      if (!e.marca) continue;
      var activa = e.id === cercana;
      var anillo = e.marca.userData.anillo;
      anillo.material.opacity = activa
        ? 0.35 + Math.sin(t * 4) * 0.18
        : 0.18;
      e.marca.rotation.y = activa ? t * 0.5 : 0;
      if (e.mesa) {
        e.mesa.userData.canto.material.opacity = activa ? 0.65 : 0.3;
      }
    }
  };

  // Arranque cuando el documento esta listo.
  function arrancar() {
    var lab = new Laboratorio();
    global.laboratorio = lab;
    lab.iniciar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})(window);
