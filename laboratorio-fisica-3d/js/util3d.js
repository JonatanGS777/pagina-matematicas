/*
 * Laboratorio de Fisica 3D - Utilidades de escena para las estaciones
 *
 * Piezas que se repiten en varias mesas: flechas de vectores, reglas
 * graduadas, trazas de trayectoria y rotulos flotantes.
 */
(function (global) {
  'use strict';

  /* Flecha de vector con punta conica. Se reorienta cada cuadro. */
  function Flecha(color, grosor) {
    grosor = grosor || 0.035;
    this.grupo = new THREE.Group();
    var mat = new THREE.MeshBasicMaterial({ color: color });

    this.cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(grosor, grosor, 1, 10), mat);
    this.cuerpo.position.y = 0.5;
    this.punta = new THREE.Mesh(new THREE.ConeGeometry(grosor * 2.6, grosor * 7, 12), mat);
    this.punta.position.y = 1;

    this.grupo.add(this.cuerpo);
    this.grupo.add(this.punta);
    this.grupo.visible = false;
  }

  // origen y vector son THREE.Vector3. escala convierte unidades fisicas a metros de escena.
  Flecha.prototype.apuntar = function (origen, vector, escala) {
    var largo = vector.length() * (escala || 1);
    if (largo < 0.02) { this.grupo.visible = false; return; }
    this.grupo.visible = true;
    this.grupo.position.copy(origen);
    this.grupo.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      vector.clone().normalize()
    );
    this.cuerpo.scale.y = largo;
    this.cuerpo.position.y = largo / 2;
    this.punta.position.y = largo;
  };

  Flecha.prototype.ocultar = function () { this.grupo.visible = false; };

  /* Traza de trayectoria: linea que va acumulando puntos. */
  function Traza(color, maxPuntos, opciones) {
    var o = opciones || {};
    this.max = maxPuntos || 1200;
    this.posiciones = new Float32Array(this.max * 3);
    this.conteo = 0;

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.posiciones, 3));
    geo.setDrawRange(0, 0);
    this.geometria = geo;
    this.linea = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: o.opacidad != null ? o.opacidad : 0.95
    }));
    this.linea.frustumCulled = false;
  }

  Traza.prototype.agregar = function (x, y, z) {
    if (this.conteo >= this.max) return;
    var i = this.conteo * 3;
    this.posiciones[i] = x;
    this.posiciones[i + 1] = y;
    this.posiciones[i + 2] = z;
    this.conteo++;
    this.geometria.setDrawRange(0, this.conteo);
    this.geometria.attributes.position.needsUpdate = true;
    this.geometria.computeBoundingSphere();
  };

  Traza.prototype.limpiar = function () {
    this.conteo = 0;
    this.geometria.setDrawRange(0, 0);
  };

  /* Regla graduada. eje puede ser 'x' o 'y'. */
  function crearRegla(largo, paso, eje, color, opciones) {
    var o = opciones || {};
    var grupo = new THREE.Group();
    var mat = new THREE.LineBasicMaterial({ color: color || 0x8fa3bd, transparent: true, opacity: 0.7 });

    for (var d = 0; d <= largo + 1e-6; d += paso) {
      var mayor = Math.abs(d % (paso * 5)) < 1e-6;
      var t = mayor ? 0.22 : 0.11;
      var puntos;
      if (eje === 'y') {
        puntos = [new THREE.Vector3(0, d, 0), new THREE.Vector3(t, d, 0)];
      } else {
        puntos = [new THREE.Vector3(d, 0, 0), new THREE.Vector3(d, 0, t)];
      }
      grupo.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(puntos), mat));

      if (mayor && d > 0) {
        var etiqueta = rotulo(d.toFixed(0) + ' m', {
          color: o.colorTexto || '#9fb0c8', escala: o.escalaTexto || 0.5
        });
        if (eje === 'y') etiqueta.position.set(0.5, d, 0);
        else etiqueta.position.set(d, 0.18, 0.55);
        grupo.add(etiqueta);
      }
    }
    return grupo;
  }

  /* Rotulo plano que siempre se puede leer de frente. */
  function rotulo(texto, opciones) {
    var o = opciones || {};
    var c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    var g = c.getContext('2d');
    g.clearRect(0, 0, 256, 64);
    if (o.fondo) {
      g.fillStyle = o.fondo;
      g.fillRect(0, 0, 256, 64);
    }
    g.font = o.fuente || 'bold 34px "IBM Plex Mono", monospace';
    g.fillStyle = o.color || '#ffb347';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(texto, 128, 34);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: o.depthTest !== false });
    var sprite = new THREE.Sprite(mat);
    var escala = o.escala || 1;
    sprite.scale.set(escala * 1.6, escala * 0.4, 1);
    sprite.userData.actualizarTexto = function (nuevo) {
      g.clearRect(0, 0, 256, 64);
      if (o.fondo) { g.fillStyle = o.fondo; g.fillRect(0, 0, 256, 64); }
      g.font = o.fuente || 'bold 34px "IBM Plex Mono", monospace';
      g.fillStyle = o.color || '#ffb347';
      g.fillText(nuevo, 128, 34);
      tex.needsUpdate = true;
    };
    return sprite;
  }

  /* Esfera con brillo, la forma base de casi todos los cuerpos de prueba. */
  function crearCuerpo(radio, color, opciones) {
    var o = opciones || {};
    var m = new THREE.Mesh(
      new THREE.SphereGeometry(radio, 28, 20),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: o.roughness != null ? o.roughness : 0.35,
        metalness: o.metalness != null ? o.metalness : 0.6,
        emissive: o.emissive != null ? o.emissive : color,
        emissiveIntensity: o.emissiveIntensity != null ? o.emissiveIntensity : 0.18
      })
    );
    m.castShadow = true;
    return m;
  }

  /* Soporte vertical con base, presente en varias estaciones. */
  function crearSoporte(altura, opciones) {
    var o = opciones || {};
    var grupo = new THREE.Group();
    var mat = new THREE.MeshStandardMaterial({
      color: o.color || 0x8a94a6, roughness: 0.4, metalness: 0.8
    });
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.06, 20), mat);
    base.position.y = 0.03;
    base.castShadow = true;
    grupo.add(base);

    var varilla = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, altura, 12), mat);
    varilla.position.y = altura / 2;
    varilla.castShadow = true;
    grupo.add(varilla);
    return grupo;
  }

  /* Panel de instrumento con pantalla luminosa sobre la mesa. */
  function crearPantalla(ancho, alto, opciones) {
    var o = opciones || {};
    var grupo = new THREE.Group();
    var carcasa = new THREE.Mesh(
      new THREE.BoxGeometry(ancho, alto, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1b202a, roughness: 0.6, metalness: 0.5 })
    );
    grupo.add(carcasa);

    var c = document.createElement('canvas');
    c.width = 512; c.height = Math.round(512 * alto / ancho);
    var g = c.getContext('2d');
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var pantalla = new THREE.Mesh(
      new THREE.PlaneGeometry(ancho - 0.08, alto - 0.08),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    pantalla.position.z = 0.045;
    grupo.add(pantalla);

    grupo.userData.dibujar = function (lineas) {
      g.fillStyle = '#080b10';
      g.fillRect(0, 0, c.width, c.height);
      g.strokeStyle = 'rgba(79,214,227,0.3)';
      g.lineWidth = 3;
      g.strokeRect(4, 4, c.width - 8, c.height - 8);
      var y = 52;
      for (var i = 0; i < lineas.length; i++) {
        g.font = i === 0 ? 'bold 34px "IBM Plex Mono", monospace' : '30px "IBM Plex Mono", monospace';
        g.fillStyle = i === 0 ? '#4fd6e3' : (o.colorTexto || '#e8eef7');
        g.textAlign = 'left';
        g.fillText(lineas[i], 26, y);
        y += 42;
      }
      tex.needsUpdate = true;
    };
    grupo.userData.dibujar(['']);
    return grupo;
  }

  global.Util3D = {
    Flecha: Flecha,
    Traza: Traza,
    crearRegla: crearRegla,
    rotulo: rotulo,
    crearCuerpo: crearCuerpo,
    crearSoporte: crearSoporte,
    crearPantalla: crearPantalla
  };
})(window);
