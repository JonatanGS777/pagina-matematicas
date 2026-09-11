/*
 * Laboratorio de Fisica 3D - Estaciones de electricidad y magnetismo
 *
 * Misma interfaz que las estaciones de mecanica. Aqui lo que se ve no es
 * un objeto que se mueve sino el campo mismo: lineas que nacen en las
 * cargas positivas y mueren en las negativas, y la helice que describe
 * una particula cargada dentro de un campo magnetico.
 */
(function (global) {
  'use strict';

  var F = global.Fisica;
  var U = global.Util3D;

  function p(est, id) {
    for (var i = 0; i < est.parametros.length; i++) {
      if (est.parametros[i].id === id) return est.parametros[i].valor;
    }
    return null;
  }

  /* ================================================================== *
   * ESTACION 6 - Campo electrico de cargas puntuales
   * ================================================================== */

  function CampoElectricoEstacion() {
    this.id = 'campo-electrico';
    this.numero = 6;
    this.titulo = 'Campo electrico';
    this.subtitulo = 'Lineas de campo en el espacio';
    this.color = 0x5aa9ff;
    this.posicion = { x: -9, z: 4 };
    this.puesto = { x: -9, z: 7.4 };
    this.mesaTamano = { ancho: 3.8, fondo: 2.6 };
    this.descripcion = 'Las lineas salen de lo positivo y entran a lo negativo. Suelta la ' +
      'carga de prueba y mirala seguir el campo: eso es lo que siente un electron.';
    this.ecuaciones = ['E = k q / r^2', 'F = q E', 'V = k q / r'];

    this.parametros = [
      { id: 'configuracion', etiqueta: 'Configuracion', tipo: 'opciones', valor: 0, opciones: [
        { valor: 0, etiqueta: 'Dipolo (+ y -)' },
        { valor: 1, etiqueta: 'Dos cargas iguales (+ y +)' },
        { valor: 2, etiqueta: 'Carga sola (+)' },
        { valor: 3, etiqueta: 'Cuadrupolo' }
      ] },
      { id: 'carga', etiqueta: 'Magnitud de las cargas', unidad: 'nC', tipo: 'rango', min: 1, max: 40, paso: 1, valor: 20 },
      { id: 'separacion', etiqueta: 'Separacion', unidad: 'm', tipo: 'rango', min: 0.4, max: 2.4, paso: 0.1, valor: 1.4 },
      { id: 'cargaPrueba', etiqueta: 'Carga de prueba', unidad: 'nC', tipo: 'rango', min: -10, max: 10, paso: 0.5, valor: 1 },
      { id: 'lineas', etiqueta: 'Lineas por carga', tipo: 'rango', min: 6, max: 24, paso: 2, valor: 14 }
    ];

    this.misiones = [
      {
        id: 'ce-1', tipo: 'prediccion',
        enunciado: 'Con una sola carga positiva, calcula la magnitud del campo a 1 metro de distancia.',
        pista: 'E = k q / r^2, con k = 8.99e9 y la carga en coulombs (1 nC son 1e-9 C).',
        entrada: { etiqueta: 'Campo electrico', unidad: 'N/C' },
        objetivo: function (e) { return F.K_COULOMB * p(e, 'carga') * 1e-9 / 1; },
        tolerancia: 0.05,
        condicionPrevia: function (e) { return p(e, 'configuracion') === 2; },
        avisoPrevio: 'Elige la configuracion de carga sola.'
      },
      {
        id: 'ce-2', tipo: 'prediccion',
        enunciado: 'Si duplicas la distancia, en que factor cambia el campo? Escribe cuanto vale el campo a 2 metros.',
        pista: 'El campo cae con el cuadrado de la distancia, asi que al doble de distancia queda la cuarta parte.',
        entrada: { etiqueta: 'Campo a 2 metros', unidad: 'N/C' },
        objetivo: function (e) { return F.K_COULOMB * p(e, 'carga') * 1e-9 / 4; },
        tolerancia: 0.05,
        condicionPrevia: function (e) { return p(e, 'configuracion') === 2; },
        avisoPrevio: 'Elige la configuracion de carga sola.'
      },
      {
        id: 'ce-3', tipo: 'reto',
        enunciado: 'Pon dos cargas positivas iguales y lleva la carga de prueba al punto exacto donde el campo se anula.',
        pista: 'Por simetria, el punto neutro esta justo a mitad de camino entre las dos cargas.',
        verificar: function (e) {
          if (p(e, 'configuracion') !== 1) return { ok: false, mensaje: 'Cambia a la configuracion de dos cargas iguales.' };
          var E = F.norma(e.campo.campoEn([e.pruebaPos.x, e.pruebaPos.y, e.pruebaPos.z]));
          return E < 5
            ? { ok: true, mensaje: 'Campo de ' + E.toFixed(2) + ' N/C, practicamente nulo. Las dos cargas se cancelan en ese punto.' }
            : { ok: false, mensaje: 'Ahi el campo todavia vale ' + E.toFixed(1) + ' N/C. Acercate al centro.' };
        }
      },
      {
        id: 'ce-4', tipo: 'reto',
        enunciado: 'Con un dipolo, coloca la carga de prueba donde sienta una fuerza mayor a 1 micronewton.',
        pista: 'La fuerza crece muchisimo al acercarte a cualquiera de las dos cargas.',
        verificar: function (e) {
          if (p(e, 'configuracion') !== 0) return { ok: false, mensaje: 'Cambia a la configuracion de dipolo.' };
          var Fv = F.norma(e.campo.fuerzaSobre([e.pruebaPos.x, e.pruebaPos.y, e.pruebaPos.z], p(e, 'cargaPrueba')));
          return Fv > 1e-6
            ? { ok: true, mensaje: 'Fuerza de ' + (Fv * 1e6).toFixed(2) + ' micronewtons sobre la carga de prueba.' }
            : { ok: false, mensaje: 'Solo ' + (Fv * 1e6).toFixed(3) + ' micronewtons. Acercate mas a una carga.' };
        }
      }
    ];

    this.historial = [];
    this.corriendo = false;
    this.pruebaPos = new THREE.Vector3(0, 1.6, 0.9);
  }

  CampoElectricoEstacion.prototype.configuracionCargas = function () {
    var q = p(this, 'carga');
    var d = p(this, 'separacion') / 2;
    var y = 1.5;  // altura sobre la mesa
    var modo = p(this, 'configuracion');
    if (modo === 0) return [
      { posicion: [-d, y, 0], carga_nC: q },
      { posicion: [d, y, 0], carga_nC: -q }
    ];
    if (modo === 1) return [
      { posicion: [-d, y, 0], carga_nC: q },
      { posicion: [d, y, 0], carga_nC: q }
    ];
    if (modo === 2) return [
      { posicion: [0, y, 0], carga_nC: q }
    ];
    return [
      { posicion: [-d, y, -d], carga_nC: q },
      { posicion: [d, y, -d], carga_nC: -q },
      { posicion: [-d, y, d], carga_nC: -q },
      { posicion: [d, y, d], carga_nC: q }
    ];
  };

  CampoElectricoEstacion.prototype.construir = function () {
    var g = new THREE.Group();

    // Plataforma de vidrio donde flotan las cargas.
    var plataforma = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.04, 2.4),
      new THREE.MeshPhysicalMaterial({
        color: 0x9fd8e8, transparent: true, opacity: 0.12,
        roughness: 0.1, metalness: 0.2
      })
    );
    plataforma.position.y = 1.02;
    g.add(plataforma);

    this.grupoCargas = new THREE.Group();
    g.add(this.grupoCargas);

    this.grupoLineas = new THREE.Group();
    g.add(this.grupoLineas);

    // Carga de prueba: se mueve con las teclas de flecha del panel.
    this.prueba = U.crearCuerpo(0.09, 0x7ee787, { emissiveIntensity: 0.7 });
    g.add(this.prueba);
    this.flechaFuerza = new U.Flecha(0x7ee787, 0.028);
    g.add(this.flechaFuerza.grupo);

    this.rotuloPrueba = U.rotulo('sonda', { escala: 0.42, color: '#7ee787' });
    g.add(this.rotuloPrueba);

    this.pantalla = U.crearPantalla(1.35, 0.9);
    this.pantalla.position.set(-2.3, 1.8, 0);
    this.pantalla.rotation.y = 0.7;
    g.add(this.pantalla);
    var sop = U.crearSoporte(1.3);
    sop.position.set(-2.3, 0.98, 0);
    g.add(sop);

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  // Dibuja una esfera por carga, con color y tamano segun el signo.
  CampoElectricoEstacion.prototype.dibujarCargas = function () {
    while (this.grupoCargas.children.length) {
      var hijo = this.grupoCargas.children.pop();
      if (hijo.geometry) hijo.geometry.dispose();
    }
    var cargas = this.campo.cargas;
    for (var i = 0; i < cargas.length; i++) {
      var c = cargas[i];
      var positiva = c.carga_nC > 0;
      var color = positiva ? 0xff6b6b : 0x5aa9ff;
      var radio = 0.09 + Math.min(0.12, Math.abs(c.carga_nC) * 0.003);
      var esfera = U.crearCuerpo(radio, color, { emissiveIntensity: 0.55 });
      esfera.position.set(c.posicion[0], c.posicion[1], c.posicion[2]);
      this.grupoCargas.add(esfera);

      var signo = U.rotulo((positiva ? '+' : '-') + Math.abs(c.carga_nC) + ' nC', {
        escala: 0.45, color: positiva ? '#ff9b9b' : '#9bc9ff'
      });
      signo.position.set(c.posicion[0], c.posicion[1] + radio + 0.3, c.posicion[2]);
      this.grupoCargas.add(signo);
    }
  };

  // Traza las lineas de campo saliendo de cada carga positiva en varias
  // direcciones repartidas sobre una esfera.
  CampoElectricoEstacion.prototype.dibujarLineas = function () {
    while (this.grupoLineas.children.length) {
      var hijo = this.grupoLineas.children.pop();
      if (hijo.geometry) hijo.geometry.dispose();
      if (hijo.material) hijo.material.dispose();
    }

    var porCarga = p(this, 'lineas');
    var cargas = this.campo.cargas;
    var self = this;

    cargas.forEach(function (c) {
      var positiva = c.carga_nC > 0;
      var sentido = positiva ? 1 : -1;
      var color = positiva ? 0xff8c8c : 0x7fbcff;

      // Reparto de direcciones iniciales con la espiral de Fibonacci,
      // que distribuye los puntos de forma pareja sobre la esfera.
      for (var i = 0; i < porCarga; i++) {
        var t = (i + 0.5) / porCarga;
        var phi = Math.acos(1 - 2 * t);
        var theta = Math.PI * (1 + Math.sqrt(5)) * i;
        var dir = [
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ];
        var inicio = [
          c.posicion[0] + dir[0] * 0.16,
          c.posicion[1] + dir[1] * 0.16,
          c.posicion[2] + dir[2] * 0.16
        ];
        var puntos = self.campo.lineaDeCampo(inicio, {
          paso: 0.055, maxPuntos: 130, sentido: sentido,
          centro: [0, 1.5, 0], limite: 1.35
        });
        if (puntos.length < 3) continue;

        var vectores = puntos.map(function (q) { return new THREE.Vector3(q[0], q[1], q[2]); });
        var linea = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(vectores),
          new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.55 })
        );
        self.grupoLineas.add(linea);

        // Punta de flecha a mitad de la linea para indicar el sentido.
        var medio = Math.floor(vectores.length / 2);
        if (medio > 1) {
          var dirFlecha = vectores[medio].clone().sub(vectores[medio - 1]).normalize();
          var cono = new THREE.Mesh(
            new THREE.ConeGeometry(0.035, 0.1, 8),
            new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 })
          );
          cono.position.copy(vectores[medio]);
          cono.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirFlecha);
          self.grupoLineas.add(cono);
        }
      }
    });
  };

  CampoElectricoEstacion.prototype.aplicarParametros = function () {
    this.campo = new F.CampoElectrico({ cargas: this.configuracionCargas() });
    if (this.grupoCargas) {
      this.dibujarCargas();
      this.dibujarLineas();
    }
  };

  CampoElectricoEstacion.prototype.reiniciar = function () {
    this.pruebaPos.set(0, 2.15, 1.1);
    this.aplicarParametros();
    this.corriendo = false;
    this.colocarPrueba();
  };

  // La carga de prueba en movimiento libre sigue la fuerza del campo.
  CampoElectricoEstacion.prototype.correr = function () {
    this.corriendo = !this.corriendo;
    this.velPrueba = new THREE.Vector3(0, 0, 0);
  };

  CampoElectricoEstacion.prototype.moverPrueba = function (dx, dy, dz) {
    this.pruebaPos.x = Math.max(-2.2, Math.min(2.2, this.pruebaPos.x + dx));
    this.pruebaPos.y = Math.max(1.1, Math.min(3.4, this.pruebaPos.y + dy));
    this.pruebaPos.z = Math.max(-1.8, Math.min(1.8, this.pruebaPos.z + dz));
    this.colocarPrueba();
  };

  CampoElectricoEstacion.prototype.colocarPrueba = function () {
    if (!this.prueba) return;
    this.prueba.position.copy(this.pruebaPos);
    this.rotuloPrueba.position.set(this.pruebaPos.x, this.pruebaPos.y + 0.22, this.pruebaPos.z);

    var q = p(this, 'cargaPrueba');
    var fuerza = this.campo.fuerzaSobre([this.pruebaPos.x, this.pruebaPos.y, this.pruebaPos.z], q);
    var magnitud = F.norma(fuerza);
    var color = q >= 0 ? 0x7ee787 : 0xffb347;
    this.prueba.material.color.setHex(color);
    this.prueba.material.emissive.setHex(color);

    if (magnitud > 1e-9) {
      // Escala logaritmica: si no, la flecha se sale del salon al acercarse.
      var largo = Math.min(1.6, 0.25 + Math.log10(magnitud * 1e9 + 1) * 0.32);
      this.flechaFuerza.grupo.children.forEach(function (m) { m.material.color.setHex(color); });
      this.flechaFuerza.apuntar(
        this.pruebaPos,
        new THREE.Vector3(fuerza[0], fuerza[1], fuerza[2]),
        largo / F.norma(fuerza)
      );
    } else {
      this.flechaFuerza.ocultar();
    }
  };

  CampoElectricoEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo) {
      // Integra el movimiento de la carga de prueba dentro del campo.
      var q = p(this, 'cargaPrueba') * 1e-9;
      var masa = 2e-9;   // masa pequena para que el movimiento se vea
      if (!this.velPrueba) this.velPrueba = new THREE.Vector3();
      var e = this.campo.campoEn([this.pruebaPos.x, this.pruebaPos.y, this.pruebaPos.z]);
      var ax = q * e[0] / masa, ay = q * e[1] / masa, az = q * e[2] / masa;
      var tope = 12;
      this.velPrueba.x = Math.max(-tope, Math.min(tope, this.velPrueba.x + ax * dt));
      this.velPrueba.y = Math.max(-tope, Math.min(tope, this.velPrueba.y + ay * dt));
      this.velPrueba.z = Math.max(-tope, Math.min(tope, this.velPrueba.z + az * dt));
      this.pruebaPos.x += this.velPrueba.x * dt;
      this.pruebaPos.y += this.velPrueba.y * dt;
      this.pruebaPos.z += this.velPrueba.z * dt;

      // Si se aleja o cae dentro de una carga, se detiene.
      var fuera = Math.abs(this.pruebaPos.x) > 3 || Math.abs(this.pruebaPos.z) > 2.5 ||
                  this.pruebaPos.y < 1.05 || this.pruebaPos.y > 4;
      var cerca = this.campo.cargas.some(function (c) {
        return F.norma(F.resta([this.pruebaPos.x, this.pruebaPos.y, this.pruebaPos.z], c.posicion)) < 0.2;
      }, this);
      if (fuera || cerca) {
        this.corriendo = false;
        this.pruebaPos.x = Math.max(-2.2, Math.min(2.2, this.pruebaPos.x));
        this.pruebaPos.z = Math.max(-1.8, Math.min(1.8, this.pruebaPos.z));
        this.pruebaPos.y = Math.max(1.1, Math.min(3.4, this.pruebaPos.y));
      }
      this.colocarPrueba();
    }
    this.refrescarPantalla();
  };

  CampoElectricoEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    var punto = [this.pruebaPos.x, this.pruebaPos.y, this.pruebaPos.z];
    var E = F.norma(this.campo.campoEn(punto));
    var V = this.campo.potencialEn(punto);
    this.pantalla.userData.dibujar([
      'SONDA DE CAMPO',
      'E = ' + E.toFixed(1) + ' N/C',
      'V = ' + V.toFixed(1) + ' V',
      'F = ' + (F.norma(this.campo.fuerzaSobre(punto, p(this, 'cargaPrueba'))) * 1e6).toFixed(3) + ' uN'
    ]);
  };

  CampoElectricoEstacion.prototype.lecturas = function () {
    var punto = [this.pruebaPos.x, this.pruebaPos.y, this.pruebaPos.z];
    var E = this.campo.campoEn(punto);
    var fuerza = this.campo.fuerzaSobre(punto, p(this, 'cargaPrueba'));
    return [
      { etiqueta: 'Campo en la sonda', valor: F.norma(E).toFixed(2), unidad: 'N/C', destacado: true },
      { etiqueta: 'Potencial en la sonda', valor: this.campo.potencialEn(punto).toFixed(2), unidad: 'V', destacado: true },
      { etiqueta: 'Fuerza sobre la sonda', valor: (F.norma(fuerza) * 1e6).toFixed(4), unidad: 'micronewtons' },
      { etiqueta: 'Componente Ex', valor: E[0].toFixed(2), unidad: 'N/C' },
      { etiqueta: 'Componente Ey', valor: E[1].toFixed(2), unidad: 'N/C' },
      { etiqueta: 'Componente Ez', valor: E[2].toFixed(2), unidad: 'N/C' },
      { etiqueta: 'Posicion de la sonda', valor: this.pruebaPos.x.toFixed(2) + ', ' + this.pruebaPos.y.toFixed(2) + ', ' + this.pruebaPos.z.toFixed(2), unidad: 'm' }
    ];
  };

  CampoElectricoEstacion.prototype.registrarMedicion = function () {
    var punto = [this.pruebaPos.x, this.pruebaPos.y, this.pruebaPos.z];
    var fila = {
      corrida: this.historial.length + 1,
      configuracion: this.parametros[0].opciones[p(this, 'configuracion')].etiqueta,
      carga: p(this, 'carga'),
      separacion: p(this, 'separacion'),
      x: this.pruebaPos.x,
      y: this.pruebaPos.y,
      z: this.pruebaPos.z,
      campo: F.norma(this.campo.campoEn(punto)),
      potencial: this.campo.potencialEn(punto),
      fuerza: F.norma(this.campo.fuerzaSobre(punto, p(this, 'cargaPrueba'))) * 1e6
    };
    this.historial.push(fila);
    return fila;
  };

  CampoElectricoEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'configuracion', etiqueta: 'Configuracion' },
      { clave: 'carga', etiqueta: 'q (nC)', decimales: 0 },
      { clave: 'x', etiqueta: 'x (m)', decimales: 2 },
      { clave: 'y', etiqueta: 'y (m)', decimales: 2 },
      { clave: 'z', etiqueta: 'z (m)', decimales: 2 },
      { clave: 'campo', etiqueta: 'E (N/C)', decimales: 2 },
      { clave: 'potencial', etiqueta: 'V (V)', decimales: 2 },
      { clave: 'fuerza', etiqueta: 'F (uN)', decimales: 4 }
    ];
  };

  /* ================================================================== *
   * ESTACION 7 - Fuerza de Lorentz
   * ================================================================== */

  function LorentzEstacion() {
    this.id = 'lorentz';
    this.numero = 7;
    this.titulo = 'Fuerza magnetica';
    this.subtitulo = 'Camara de niebla y bobinas';
    this.color = 0xb08cff;
    this.posicion = { x: 9, z: 4 };
    this.puesto = { x: 9, z: 7.4 };
    this.mesaTamano = { ancho: 3.6, fondo: 3.6 };
    this.descripcion = 'La fuerza magnetica nunca acelera ni frena, solo desvia. Por eso la ' +
      'particula gira en circulo sin ganar rapidez, y si entra inclinada dibuja una helice.';
    this.ecuaciones = ['F = q v x B', 'r = m v / (q B)', 'T = 2 pi m / (q B)'];

    this.parametros = [
      { id: 'campoB', etiqueta: 'Campo magnetico B', unidad: 'mT', tipo: 'rango', min: 50, max: 400, paso: 10, valor: 150 },
      { id: 'rapidez', etiqueta: 'Rapidez de entrada', unidad: 'm/s', tipo: 'rango', min: 0.5, max: 6, paso: 0.1, valor: 2.4 },
      { id: 'inclinacion', etiqueta: 'Inclinacion respecto a B', unidad: 'grados', tipo: 'rango', min: 0, max: 80, paso: 5, valor: 0 },
      { id: 'signo', etiqueta: 'Signo de la carga', tipo: 'opciones', valor: 1, opciones: [
        { valor: 1, etiqueta: 'Positiva' }, { valor: -1, etiqueta: 'Negativa' }
      ] },
      { id: 'masaRel', etiqueta: 'Masa de la particula', unidad: 'ug', tipo: 'rango', min: 10, max: 120, paso: 5, valor: 50 }
    ];

    this.misiones = [
      {
        id: 'lo-1', tipo: 'prediccion',
        enunciado: 'Con el campo y la rapidez que elegiste, calcula el radio del circulo que va a describir la particula.',
        pista: 'r = m v / (q B). La carga vale 1 microcoulomb y la masa la ves en el panel en microgramos.',
        entrada: { etiqueta: 'Radio de giro', unidad: 'm' },
        objetivo: function (e) {
          var B = p(e, 'campoB') / 1000;
          var m = p(e, 'masaRel') * 1e-9;
          var v = p(e, 'rapidez') * Math.cos(p(e, 'inclinacion') * Math.PI / 180);
          return m * v / (1e-6 * B);
        },
        tolerancia: 0.06
      },
      {
        id: 'lo-2', tipo: 'reto',
        enunciado: 'Duplica el campo magnetico y comprueba que el radio se reduce a la mitad.',
        pista: 'El radio es inversamente proporcional a B. Anota una corrida, duplica B y vuelve a anotar.',
        verificar: function (e) {
          if (e.historial.length < 2) return { ok: false, mensaje: 'Registra al menos dos corridas con el boton de anotar.' };
          var u = e.historial[e.historial.length - 1];
          for (var i = e.historial.length - 2; i >= 0; i--) {
            var v = e.historial[i];
            var razonB = u.campoB / v.campoB;
            if (Math.abs(razonB - 2) < 0.15 || Math.abs(razonB - 0.5) < 0.04) {
              var razonR = v.radio / u.radio;
              if (Math.abs(razonR - razonB) < 0.15) {
                return { ok: true, mensaje: 'El campo cambio ' + razonB.toFixed(2) + ' veces y el radio cambio en la proporcion inversa. r y B son inversamente proporcionales.' };
              }
            }
          }
          return { ok: false, mensaje: 'Aun no hay dos corridas donde el campo se duplique manteniendo la rapidez.' };
        }
      },
      {
        id: 'lo-3', tipo: 'reto',
        enunciado: 'Inclina la velocidad respecto al campo y consigue que la trayectoria sea una helice con un avance mayor a 0.5 m por vuelta.',
        pista: 'La componente paralela a B no se desvia: esa es la que hace avanzar la helice.',
        verificar: function (e) {
          var paso = e.sim.pasoHelice();
          return paso > 0.5
            ? { ok: true, mensaje: 'La helice avanza ' + paso.toFixed(2) + ' m en cada vuelta. Esa parte del movimiento el campo no la toca.' }
            : { ok: false, mensaje: 'El avance es de ' + paso.toFixed(2) + ' m. Sube la inclinacion o la rapidez.' };
        }
      },
      {
        id: 'lo-4', tipo: 'prediccion',
        enunciado: 'El periodo de giro depende de la rapidez? Calcula cuanto tarda la particula en dar una vuelta completa.',
        pista: 'T = 2 pi m / (q B). Fijate que la rapidez no aparece en la formula.',
        entrada: { etiqueta: 'Periodo de giro', unidad: 's' },
        objetivo: function (e) {
          var B = p(e, 'campoB') / 1000;
          var m = p(e, 'masaRel') * 1e-9;
          return 2 * Math.PI * m / (1e-6 * B);
        },
        tolerancia: 0.06
      }
    ];

    this.historial = [];
    this.corriendo = false;
  }

  LorentzEstacion.prototype.construir = function () {
    var g = new THREE.Group();

    // Par de bobinas tipo Helmholtz que generan el campo vertical.
    var matBobina = new THREE.MeshStandardMaterial({
      color: 0xc07a3a, roughness: 0.4, metalness: 0.85
    });
    this.bobinas = [];
    [1.05, 2.85].forEach(function (y) {
      var bobina = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.11, 12, 48), matBobina);
      bobina.rotation.x = Math.PI / 2;
      bobina.position.y = y;
      bobina.castShadow = true;
      g.add(bobina);
      this.bobinas.push(bobina);
    }, this);

    // Columnas de soporte de las bobinas.
    var matCol = new THREE.MeshStandardMaterial({ color: 0x6f7d92, roughness: 0.4, metalness: 0.8 });
    // En diagonal: una columna en el eje z tapaba la camara justo de frente.
    [[-1.06, -1.06], [1.06, -1.06], [-1.06, 1.06], [1.06, 1.06]].forEach(function (q) {
      var col = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.9, 10), matCol);
      col.position.set(q[0], 1.95, q[1]);
      g.add(col);
    });

    // Camara cilindrica donde se ve la traza.
    var camara = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.35, 1.7, 40, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xb6c9e8, transparent: true, opacity: 0.08,
        roughness: 0.08, side: THREE.DoubleSide
      })
    );
    camara.position.y = 1.95;
    g.add(camara);

    // Flechas que muestran la direccion del campo B.
    this.flechasB = [];
    for (var i = 0; i < 6; i++) {
      var ang = (i / 6) * Math.PI * 2;
      var fl = new U.Flecha(0x5aa9ff, 0.014);
      fl.apuntar(
        new THREE.Vector3(Math.cos(ang) * 1.22, 1.2, Math.sin(ang) * 1.22),
        new THREE.Vector3(0, 1, 0), 0.85
      );
      g.add(fl.grupo);
      this.flechasB.push(fl);
    }

    // Particula y su traza.
    this.particula = U.crearCuerpo(0.075, 0xb08cff, { emissiveIntensity: 0.8 });
    g.add(this.particula);
    this.traza = new U.Traza(0xb08cff, 4000);
    g.add(this.traza.linea);

    this.flechaV = new U.Flecha(0x7ee787, 0.018);
    g.add(this.flechaV.grupo);
    this.flechaF = new U.Flecha(0xff6b6b, 0.018);
    g.add(this.flechaF.grupo);

    this.pantalla = U.crearPantalla(1.35, 0.9);
    this.pantalla.position.set(-2.4, 1.8, 0.6);
    this.pantalla.rotation.y = 0.8;
    g.add(this.pantalla);
    var sop = U.crearSoporte(1.3);
    sop.position.set(-2.4, 0.98, 0.6);
    g.add(sop);

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  LorentzEstacion.prototype.aplicarParametros = function () {
    var B = p(this, 'campoB') / 1000;           // mT a T
    var masa = p(this, 'masaRel') * 1e-9;       // microgramos a kg
    var carga = p(this, 'signo') * 1e-6;        // microcoulombs a C
    var v = p(this, 'rapidez');
    var inc = p(this, 'inclinacion') * Math.PI / 180;

    this.sim = new F.Lorentz({
      masa: masa,
      carga: carga,
      campoB: [0, B, 0],
      posicionInicial: [0, 1.95, 0],
      velocidadInicial: [v * Math.cos(inc), v * Math.sin(inc), 0]
    });

    // El brillo de las bobinas acompana la intensidad del campo.
    var brillo = 0.25 + (p(this, 'campoB') / 400) * 0.75;
    if (this.bobinas) {
      this.bobinas.forEach(function (b) {
        b.material.emissive = new THREE.Color(0x5aa9ff);
        b.material.emissiveIntensity = brillo * 0.35;
      });
    }
    if (this.particula) {
      var color = p(this, 'signo') > 0 ? 0xff6b6b : 0x5aa9ff;
      this.particula.material.color.setHex(color);
      this.particula.material.emissive.setHex(color);
    }
  };

  LorentzEstacion.prototype.reiniciar = function () {
    this.aplicarParametros();
    this.corriendo = false;
    if (this.traza) this.traza.limpiar();
    this.colocar();
  };

  LorentzEstacion.prototype.correr = function () {
    this.reiniciar();
    this.corriendo = true;
  };

  LorentzEstacion.prototype.colocar = function () {
    if (!this.particula) return;
    var q = this.sim.posicion();
    this.particula.position.set(q[0], q[1], q[2]);

    var v = this.sim.velocidad();
    var vVec = new THREE.Vector3(v[0], v[1], v[2]);
    this.flechaV.apuntar(this.particula.position, vVec, 0.16);

    // Fuerza de Lorentz, la que curva la trayectoria.
    var fu = F.escala(F.cruz(v, this.sim.campoB), this.sim.carga);
    var fVec = new THREE.Vector3(fu[0], fu[1], fu[2]);
    if (fVec.length() > 1e-12) {
      this.flechaF.apuntar(this.particula.position, fVec, 0.34 / fVec.length());
    } else {
      this.flechaF.ocultar();
    }
  };

  LorentzEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo) {
      // El periodo suele ser de milisegundos: se usa un factor de camara lenta.
      var T = this.sim.periodoCiclotron();
      var escalaTiempo = T / 4;   // cuatro segundos reales por vuelta
      var avance = dt * escalaTiempo;
      var sub = 20, h = avance / sub;
      for (var i = 0; i < sub; i++) {
        this.sim.paso(h);
        var q = this.sim.posicion();
        // Solo traza mientras la particula sigue dentro de la camara.
        if (Math.hypot(q[0], q[2]) < 1.35 && q[1] > 1.05 && q[1] < 2.9) {
          this.traza.agregar(q[0], q[1], q[2]);
        } else {
          this.corriendo = false;
          break;
        }
      }
      this.colocar();
    }
    this.refrescarPantalla();
  };

  LorentzEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    this.pantalla.userData.dibujar([
      'CAMARA DE NIEBLA',
      'r = ' + this.sim.radioTeorico().toFixed(3) + ' m',
      'T = ' + (this.sim.periodoCiclotron() * 1000).toFixed(2) + ' ms',
      'v = ' + F.norma(this.sim.velocidad()).toFixed(2) + ' m/s',
      'paso helice = ' + this.sim.pasoHelice().toFixed(3) + ' m'
    ]);
  };

  LorentzEstacion.prototype.lecturas = function () {
    var v = this.sim.velocidad();
    return [
      { etiqueta: 'Radio de giro', valor: this.sim.radioTeorico().toFixed(4), unidad: 'm', destacado: true },
      { etiqueta: 'Periodo de giro', valor: (this.sim.periodoCiclotron() * 1000).toFixed(3), unidad: 'ms', destacado: true },
      { etiqueta: 'Avance de la helice', valor: this.sim.pasoHelice().toFixed(4), unidad: 'm por vuelta' },
      { etiqueta: 'Rapidez actual', valor: F.norma(v).toFixed(4), unidad: 'm/s' },
      { etiqueta: 'Rapidez inicial', valor: F.norma(this.sim.velocidadInicial).toFixed(4), unidad: 'm/s', teorico: true },
      { etiqueta: 'Frecuencia ciclotron', valor: (1 / this.sim.periodoCiclotron()).toFixed(1), unidad: 'Hz', teorico: true },
      { etiqueta: 'Tiempo simulado', valor: (this.sim.t * 1000).toFixed(2), unidad: 'ms' }
    ];
  };

  LorentzEstacion.prototype.registrarMedicion = function () {
    var fila = {
      corrida: this.historial.length + 1,
      campoB: p(this, 'campoB'),
      rapidez: p(this, 'rapidez'),
      inclinacion: p(this, 'inclinacion'),
      signo: p(this, 'signo') > 0 ? 'Positiva' : 'Negativa',
      masa: p(this, 'masaRel'),
      radio: this.sim.radioTeorico(),
      periodo: this.sim.periodoCiclotron() * 1000,
      pasoHelice: this.sim.pasoHelice()
    };
    this.historial.push(fila);
    return fila;
  };

  LorentzEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'campoB', etiqueta: 'B (mT)', decimales: 0 },
      { clave: 'rapidez', etiqueta: 'v (m/s)', decimales: 1 },
      { clave: 'inclinacion', etiqueta: 'Inclinacion (gr)', decimales: 0 },
      { clave: 'signo', etiqueta: 'Carga' },
      { clave: 'masa', etiqueta: 'm (ug)', decimales: 1 },
      { clave: 'radio', etiqueta: 'r (m)', decimales: 4 },
      { clave: 'periodo', etiqueta: 'T (ms)', decimales: 3 },
      { clave: 'pasoHelice', etiqueta: 'Paso helice (m)', decimales: 4 }
    ];
  };

  global.EstacionesEM = [CampoElectricoEstacion, LorentzEstacion];
})(window);
