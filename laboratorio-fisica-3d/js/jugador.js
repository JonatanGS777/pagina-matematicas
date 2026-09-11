/*
 * Laboratorio de Fisica 3D - Controlador en primera persona
 *
 * Camina por el salon con WASD, mira con el mouse usando Pointer Lock
 * y detecta cuando el estudiante entra al circulo de una estacion.
 * El controlador esta escrito aqui para no depender de los ejemplos
 * de Three.js, que se distribuyen como modulos y romperian la
 * descarga sin conexion.
 */
(function (global) {
  'use strict';

  var ALTURA_OJOS = 1.65;
  var VELOCIDAD = 4.2;         // m/s caminando
  var VELOCIDAD_CORRIENDO = 8.0;
  var ACELERACION = 22;        // suaviza el arranque y el frenado
  var SENSIBILIDAD = 0.0022;
  var RADIO_JUGADOR = 0.35;

  function Jugador(camara, elemento, opciones) {
    var o = opciones || {};
    this.camara = camara;
    this.elemento = elemento;
    this.limites = o.limites || { minX: -20, maxX: 20, minZ: -10, maxZ: 10 };
    this.obstaculos = [];        // cajas AABB contra las que no se puede caminar
    this.estaciones = [];        // { id, x, z, radio }
    this.estacionCercana = null;
    this.alCambiarEstacion = o.alCambiarEstacion || function () {};

    this.posicion = new THREE.Vector3(o.x || 0, ALTURA_OJOS, o.z || 8);
    this.velocidad = new THREE.Vector3();
    this.yaw = o.yaw != null ? o.yaw : Math.PI;
    this.pitch = 0;
    this.activo = false;
    this.teclas = {};
    this.cabeceo = 0;            // fase del balanceo al caminar

    this._conectar();
    this.aplicarCamara();
  }

  Jugador.prototype._conectar = function () {
    var self = this;

    this._onKeyDown = function (e) {
      self.teclas[e.code] = true;
      // Evita que la pagina haga scroll con las flechas o la barra.
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) >= 0) {
        if (self.activo) e.preventDefault();
      }
    };
    this._onKeyUp = function (e) { self.teclas[e.code] = false; };

    this._onMouseMove = function (e) {
      if (!self.activo) return;
      self.yaw -= e.movementX * SENSIBILIDAD;
      self.pitch -= e.movementY * SENSIBILIDAD;
      var tope = Math.PI / 2 - 0.05;
      self.pitch = Math.max(-tope, Math.min(tope, self.pitch));
    };

    this._onPointerLockChange = function () {
      self.activo = (document.pointerLockElement === self.elemento);
      if (!self.activo) self.teclas = {};
      document.body.classList.toggle('en-primera-persona', self.activo);
      if (self.alCambiarModo) self.alCambiarModo(self.activo);
    };

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
  };

  Jugador.prototype.entrar = function () {
    if (this.elemento.requestPointerLock) this.elemento.requestPointerLock();
  };

  Jugador.prototype.salir = function () {
    if (document.exitPointerLock) document.exitPointerLock();
  };

  // Registra una caja solida. Se usa para mesas y estructuras.
  Jugador.prototype.agregarObstaculo = function (minX, maxX, minZ, maxZ) {
    this.obstaculos.push({ minX: minX, maxX: maxX, minZ: minZ, maxZ: maxZ });
  };

  Jugador.prototype.registrarEstacion = function (id, x, z, radio) {
    this.estaciones.push({ id: id, x: x, z: z, radio: radio || 2.6 });
  };

  // Resuelve la colision eje por eje: asi el jugador resbala a lo largo
  // de la mesa en vez de quedarse pegado al chocar en diagonal.
  Jugador.prototype._colisiona = function (x, z) {
    for (var i = 0; i < this.obstaculos.length; i++) {
      var o = this.obstaculos[i];
      if (x > o.minX - RADIO_JUGADOR && x < o.maxX + RADIO_JUGADOR &&
          z > o.minZ - RADIO_JUGADOR && z < o.maxZ + RADIO_JUGADOR) {
        return true;
      }
    }
    return false;
  };

  Jugador.prototype.actualizar = function (dt) {
    // dt acotado: si la pestana estuvo en segundo plano no se teletransporta.
    dt = Math.min(dt, 0.05);

    var adelante = 0, lado = 0;
    if (this.activo) {
      if (this.teclas['KeyW'] || this.teclas['ArrowUp']) adelante += 1;
      if (this.teclas['KeyS'] || this.teclas['ArrowDown']) adelante -= 1;
      if (this.teclas['KeyD'] || this.teclas['ArrowRight']) lado += 1;
      if (this.teclas['KeyA'] || this.teclas['ArrowLeft']) lado -= 1;
    }

    var largo = Math.hypot(adelante, lado);
    if (largo > 0) { adelante /= largo; lado /= largo; }

    var rapidez = (this.teclas['ShiftLeft'] || this.teclas['ShiftRight'])
      ? VELOCIDAD_CORRIENDO : VELOCIDAD;

    // Direccion de avance en el plano del piso, sin componente vertical.
    var sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw);
    var deseadaX = (-sinY * adelante + cosY * lado) * rapidez;
    var deseadaZ = (-cosY * adelante - sinY * lado) * rapidez;

    var k = Math.min(1, ACELERACION * dt);
    this.velocidad.x += (deseadaX - this.velocidad.x) * k;
    this.velocidad.z += (deseadaZ - this.velocidad.z) * k;

    var nx = this.posicion.x + this.velocidad.x * dt;
    var nz = this.posicion.z + this.velocidad.z * dt;

    var l = this.limites;
    nx = Math.max(l.minX, Math.min(l.maxX, nx));
    nz = Math.max(l.minZ, Math.min(l.maxZ, nz));

    if (!this._colisiona(nx, this.posicion.z)) this.posicion.x = nx;
    else this.velocidad.x = 0;
    if (!this._colisiona(this.posicion.x, nz)) this.posicion.z = nz;
    else this.velocidad.z = 0;

    // Balanceo sutil al caminar, suficiente para dar sensacion de cuerpo.
    var rapidezReal = Math.hypot(this.velocidad.x, this.velocidad.z);
    if (rapidezReal > 0.2) this.cabeceo += dt * rapidezReal * 2.6;
    var bob = Math.sin(this.cabeceo) * 0.035 * Math.min(1, rapidezReal / VELOCIDAD);
    this.posicion.y = ALTURA_OJOS + bob;

    this._detectarEstacion();
    this.aplicarCamara();
  };

  Jugador.prototype._detectarEstacion = function () {
    var cercana = null, mejorDistancia = Infinity;
    for (var i = 0; i < this.estaciones.length; i++) {
      var e = this.estaciones[i];
      var d = Math.hypot(this.posicion.x - e.x, this.posicion.z - e.z);
      if (d < e.radio && d < mejorDistancia) {
        mejorDistancia = d;
        cercana = e.id;
      }
    }
    if (cercana !== this.estacionCercana) {
      this.estacionCercana = cercana;
      this.alCambiarEstacion(cercana);
    }
  };

  Jugador.prototype.aplicarCamara = function () {
    this.camara.position.copy(this.posicion);
    this.camara.rotation.order = 'YXZ';
    this.camara.rotation.y = this.yaw;
    this.camara.rotation.x = this.pitch;
    this.camara.rotation.z = 0;
  };

  // Lleva al estudiante frente a una estacion sin que tenga que caminar.
  Jugador.prototype.teletransportar = function (x, z, mirarX, mirarZ) {
    this.posicion.x = x;
    this.posicion.z = z;
    this.velocidad.set(0, 0, 0);
    if (mirarX != null) {
      // La camara mira hacia (-sen yaw, 0, -cos yaw), asi que para apuntar
      // al objetivo hay que invertir el vector que va del jugador hacia el.
      this.yaw = Math.atan2(x - mirarX, z - mirarZ);
      this.pitch = 0;
    }
    this._detectarEstacion();
    this.aplicarCamara();
  };

  Jugador.prototype.destruir = function () {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
  };

  global.Jugador = Jugador;
  global.Jugador.ALTURA_OJOS = ALTURA_OJOS;
})(window);
