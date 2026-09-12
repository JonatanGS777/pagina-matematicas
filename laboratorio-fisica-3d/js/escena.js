/*
 * Laboratorio de Física 3D - Construcción del salón
 *
 * Levanta el aula completa con geometría procedural: piso, paredes,
 * ventanales, techo con tragaluz, pizarra y las mesas de trabajo.
 * No se carga ningún modelo ni textura externa, todo se dibuja aquí.
 */
(function (global) {
  'use strict';

  var SALON = {
    ancho: 44,      // eje x, de -22 a 22
    fondo: 24,      // eje z, de -12 a 12
    alto: 8,
    grosorPared: 0.3
  };

  var PALETA = {
    piso: 0x1b1f27,
    pisoLinea: 0x2f3a4a,
    pared: 0x232833,
    zocalo: 0x161a21,
    techo: 0x1a1e26,
    mesa: 0x252b38,
    mesaSuperficie: 0x2e3646,
    metal: 0x8a94a6,
    ambar: 0xffb347,
    cian: 0x4fd6e3,
    verde: 0x7ee787,
    rojo: 0xff6b6b,
    violeta: 0xb08cff
  };

  /* ------------------------------------------------------------------ *
   * Texturas generadas por canvas
   * ------------------------------------------------------------------ */

  // Piso de losas con líneas tenues, sirve de referencia métrica al caminar.
  function texturaPiso() {
    var lado = 256;
    var c = document.createElement('canvas');
    c.width = c.height = lado;
    var g = c.getContext('2d');
    g.fillStyle = '#1b1f27';
    g.fillRect(0, 0, lado, lado);
    g.strokeStyle = 'rgba(120,150,190,0.16)';
    g.lineWidth = 2;
    g.strokeRect(1, 1, lado - 2, lado - 2);
    g.strokeStyle = 'rgba(120,150,190,0.06)';
    g.lineWidth = 1;
    for (var i = 1; i < 4; i++) {
      var p = (lado / 4) * i;
      g.beginPath(); g.moveTo(p, 0); g.lineTo(p, lado); g.stroke();
      g.beginPath(); g.moveTo(0, p); g.lineTo(lado, p); g.stroke();
    }
    var t = new THREE.CanvasTexture(c);
    // Sin marcar la codificación, Three trata el canvas como lineal y el
    // piso se ve varios tonos más claro de lo dibujado.
    t.encoding = THREE.sRGBEncoding;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(SALON.ancho / 2, SALON.fondo / 2);
    return t;
  }

  // Panel de texto para letreros y rótulos flotantes.
  function texturaTexto(lineas, opciones) {
    var o = opciones || {};
    var ancho = o.ancho || 512;
    var alto = o.alto || 128;
    var c = document.createElement('canvas');
    c.width = ancho; c.height = alto;
    var g = c.getContext('2d');

    if (o.fondo !== false) {
      g.fillStyle = o.colorFondo || 'rgba(12,15,20,0.92)';
      g.fillRect(0, 0, ancho, alto);
      g.strokeStyle = o.colorBorde || 'rgba(255,179,71,0.55)';
      g.lineWidth = 4;
      g.strokeRect(2, 2, ancho - 4, alto - 4);
    }

    var y = alto / 2 - ((lineas.length - 1) * (o.interlineado || 42)) / 2;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i = 0; i < lineas.length; i++) {
      var estilo = i === 0 ? (o.fuente || 'bold 46px "IBM Plex Mono", monospace')
                           : (o.fuenteSecundaria || '30px "IBM Plex Mono", monospace');
      g.font = estilo;
      g.fillStyle = i === 0 ? (o.color || '#ffb347') : (o.colorSecundario || '#9fb0c8');
      g.fillText(lineas[i], ancho / 2, y);
      y += (o.interlineado || 42);
    }
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  // Pizarra con las ecuaciones clave escritas a mano alzada digital.
  function texturaPizarra(titulo, formulas) {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 576;
    var g = c.getContext('2d');
    g.fillStyle = '#12321f';
    g.fillRect(0, 0, 1024, 576);
    // Manchas de gis para que no se vea plana.
    for (var i = 0; i < 60; i++) {
      g.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.02) + ')';
      g.beginPath();
      g.ellipse(Math.random() * 1024, Math.random() * 576,
                Math.random() * 90 + 20, Math.random() * 30 + 10, Math.random() * 3, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = '#f4f7f2';
    g.font = 'bold 52px "IBM Plex Mono", monospace';
    g.fillText(titulo, 56, 92);
    g.strokeStyle = 'rgba(244,247,242,0.5)';
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(56, 116); g.lineTo(560, 116); g.stroke();

    g.font = '38px "IBM Plex Mono", monospace';
    for (var j = 0; j < formulas.length; j++) {
      g.fillStyle = j % 2 === 0 ? '#f4f7f2' : '#a8e6b8';
      g.fillText(formulas[j], 56, 190 + j * 62);
    }
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /* ------------------------------------------------------------------ *
   * Piezas del salón
   * ------------------------------------------------------------------ */

  function crearPiso() {
    var geo = new THREE.PlaneGeometry(SALON.ancho, SALON.fondo);
    var mat = new THREE.MeshStandardMaterial({
      map: texturaPiso(), roughness: 0.86, metalness: 0.08
    });
    var piso = new THREE.Mesh(geo, mat);
    piso.rotation.x = -Math.PI / 2;
    piso.receiveShadow = true;
    piso.name = 'piso';
    return piso;
  }

  function crearPared(ancho, alto, x, y, z, rotY) {
    var mat = new THREE.MeshStandardMaterial({
      color: PALETA.pared, roughness: 0.95, metalness: 0.0, side: THREE.DoubleSide
    });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), mat);
    m.position.set(x, y, z);
    m.rotation.y = rotY;
    m.receiveShadow = true;
    return m;
  }

  // Ventanal con marco y cristal levemente azulado, deja pasar luz de día.
  function crearVentanal(x, y, z, ancho, alto, rotY) {
    var grupo = new THREE.Group();
    var cristal = new THREE.Mesh(
      new THREE.PlaneGeometry(ancho, alto),
      new THREE.MeshStandardMaterial({
        color: 0x8fc4e8, transparent: true, opacity: 0.22,
        roughness: 0.1, metalness: 0.3, emissive: 0x2a4f6b, emissiveIntensity: 0.5
      })
    );
    grupo.add(cristal);

    var matMarco = new THREE.MeshStandardMaterial({ color: 0x39414f, roughness: 0.6, metalness: 0.5 });
    var g2 = 0.08;
    [[-ancho / 2, 0, g2, alto], [ancho / 2, 0, g2, alto],
     [0, -alto / 2, ancho, g2], [0, alto / 2, ancho, g2],
     [0, 0, g2, alto]].forEach(function (b) {
      var barra = new THREE.Mesh(new THREE.BoxGeometry(b[2], b[3], 0.1), matMarco);
      barra.position.set(b[0], b[1], 0.02);
      grupo.add(barra);
    });

    grupo.position.set(x, y, z);
    grupo.rotation.y = rotY;
    return grupo;
  }

  // Mesa de trabajo: es la base física de cada estación.
  function crearMesa(ancho, fondo, altura) {
    var grupo = new THREE.Group();
    var matSup = new THREE.MeshStandardMaterial({
      color: PALETA.mesaSuperficie, roughness: 0.68, metalness: 0.12
    });
    var matPata = new THREE.MeshStandardMaterial({
      color: PALETA.mesa, roughness: 0.6, metalness: 0.4
    });

    var sup = new THREE.Mesh(new THREE.BoxGeometry(ancho, 0.08, fondo), matSup);
    sup.position.y = altura;
    sup.castShadow = true; sup.receiveShadow = true;
    grupo.add(sup);

    // Canto luminoso que marca la mesa como zona interactiva.
    var canto = new THREE.Mesh(
      new THREE.BoxGeometry(ancho + 0.04, 0.02, fondo + 0.04),
      new THREE.MeshBasicMaterial({ color: PALETA.cian, transparent: true, opacity: 0.35 })
    );
    canto.position.y = altura - 0.05;
    grupo.add(canto);
    grupo.userData.canto = canto;

    var dx = ancho / 2 - 0.12, dz = fondo / 2 - 0.12;
    [[-dx, -dz], [dx, -dz], [-dx, dz], [dx, dz]].forEach(function (p) {
      var pata = new THREE.Mesh(new THREE.BoxGeometry(0.1, altura, 0.1), matPata);
      pata.position.set(p[0], altura / 2, p[1]);
      pata.castShadow = true;
      grupo.add(pata);
    });

    // Travesano inferior, da sensación de mueble real de laboratorio.
    var travesano = new THREE.Mesh(new THREE.BoxGeometry(ancho - 0.2, 0.06, 0.06), matPata);
    travesano.position.set(0, 0.25, 0);
    grupo.add(travesano);

    return grupo;
  }

  // Letrero colgante sobre cada estación con número y nombre.
  function crearLetrero(numero, titulo, subtitulo) {
    var grupo = new THREE.Group();
    var tex = texturaTexto([numero + '. ' + titulo, subtitulo], {
      ancho: 640, alto: 160, interlineado: 52
    });
    var panel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.65),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    grupo.add(panel);

    var panelB = panel.clone();
    panelB.rotation.y = Math.PI;
    grupo.add(panelB);

    // Tirantes al techo.
    var matCable = new THREE.MeshBasicMaterial({ color: 0x4a5364 });
    [-1.1, 1.1].forEach(function (x) {
      var cable = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.4), matCable);
      cable.position.set(x, 0.7 + 0.33, 0);
      grupo.add(cable);
    });
    return grupo;
  }

  // Disco en el piso que indica dónde pararse para operar la estación.
  function crearMarcaPiso(color) {
    var grupo = new THREE.Group();
    var anillo = new THREE.Mesh(
      new THREE.RingGeometry(1.05, 1.25, 48),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    anillo.rotation.x = -Math.PI / 2;
    anillo.position.y = 0.015;
    grupo.add(anillo);
    grupo.userData.anillo = anillo;
    return grupo;
  }

  /* ------------------------------------------------------------------ *
   * Montaje completo
   * ------------------------------------------------------------------ */

  function construirSalon(escena) {
    var mitadX = SALON.ancho / 2;
    var mitadZ = SALON.fondo / 2;

    escena.add(crearPiso());

    // Cuatro paredes.
    escena.add(crearPared(SALON.ancho, SALON.alto, 0, SALON.alto / 2, -mitadZ, 0));
    escena.add(crearPared(SALON.ancho, SALON.alto, 0, SALON.alto / 2, mitadZ, Math.PI));
    escena.add(crearPared(SALON.fondo, SALON.alto, -mitadX, SALON.alto / 2, 0, Math.PI / 2));
    escena.add(crearPared(SALON.fondo, SALON.alto, mitadX, SALON.alto / 2, 0, -Math.PI / 2));

    // Zócalo perimetral, ayuda a leer la escala del salón.
    var matZocalo = new THREE.MeshStandardMaterial({ color: PALETA.zocalo, roughness: 0.9 });
    [[SALON.ancho, 0.35, 0.15, 0, 0.175, -mitadZ + 0.08],
     [SALON.ancho, 0.35, 0.15, 0, 0.175, mitadZ - 0.08],
     [0.15, 0.35, SALON.fondo, -mitadX + 0.08, 0.175, 0],
     [0.15, 0.35, SALON.fondo, mitadX - 0.08, 0.175, 0]].forEach(function (z) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(z[0], z[1], z[2]), matZocalo);
      m.position.set(z[3], z[4], z[5]);
      escena.add(m);
    });

    // Techo con un hueco circular donde sube el tubo de caída libre.
    var forma = new THREE.Shape();
    forma.moveTo(-mitadX, -mitadZ);
    forma.lineTo(mitadX, -mitadZ);
    forma.lineTo(mitadX, mitadZ);
    forma.lineTo(-mitadX, mitadZ);
    forma.lineTo(-mitadX, -mitadZ);
    var hueco = new THREE.Path();
    hueco.absarc(-15, -5, 1.6, 0, Math.PI * 2, true);
    forma.holes.push(hueco);

    var techo = new THREE.Mesh(
      new THREE.ShapeGeometry(forma),
      new THREE.MeshStandardMaterial({ color: PALETA.techo, roughness: 1, side: THREE.DoubleSide })
    );
    techo.rotation.x = Math.PI / 2;
    techo.position.y = SALON.alto;
    escena.add(techo);

    // Ventanales en la pared sur y en la este.
    for (var i = -2; i <= 2; i++) {
      escena.add(crearVentanal(i * 7.2, 3.4, mitadZ - 0.06, 5.2, 3.2, Math.PI));
    }
    escena.add(crearVentanal(mitadX - 0.06, 3.4, -4, 5.2, 3.2, -Math.PI / 2));
    escena.add(crearVentanal(mitadX - 0.06, 3.4, 4, 5.2, 3.2, -Math.PI / 2));

    // Pizarra en la pared norte con el formulario del curso.
    var pizarra = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4.5),
      new THREE.MeshStandardMaterial({
        map: texturaPizarra('Formulario del laboratorio', [
          'y = y0 + v0 t - g t^2 / 2',
          'v^2 = v0^2 + 2 a d',
          'R = v0^2 sen(2a) / g',
          'p = m v    (se conserva siempre)',
          'T = 2 pi raíz(L / g)',
          'E = k q / r^2',
          'F = q (v x B)'
        ]),
        roughness: 0.9
      })
    );
    pizarra.position.set(0, 3.2, -mitadZ + 0.2);
    escena.add(pizarra);

    // Marco de madera de la pizarra.
    var matMarco = new THREE.MeshStandardMaterial({ color: 0x4a3b2a, roughness: 0.8 });
    var marco = new THREE.Mesh(new THREE.BoxGeometry(8.4, 4.9, 0.12), matMarco);
    marco.position.set(0, 3.2, -mitadZ + 0.12);
    escena.add(marco);

    // Rieles de luz en el techo.
    var matRiel = new THREE.MeshStandardMaterial({ color: 0x2c323d, roughness: 0.5, metalness: 0.7 });
    for (var r = -1; r <= 1; r++) {
      var riel = new THREE.Mesh(new THREE.BoxGeometry(SALON.ancho - 2, 0.14, 0.3), matRiel);
      riel.position.set(0, SALON.alto - 0.2, r * 7);
      escena.add(riel);
      for (var l = -3; l <= 3; l++) {
        var lampara = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.06, 0.24),
          new THREE.MeshBasicMaterial({ color: 0xdfe9f5 })
        );
        lampara.position.set(l * 6, SALON.alto - 0.3, r * 7);
        escena.add(lampara);
      }
    }

    return SALON;
  }

  function agregarLuces(escena) {
    // Ambiente bajo a propósito: el salón se lee como laboratorio de tarde,
    // con la luz concentrada en las mesas y no repartida por todas partes.
    escena.add(new THREE.AmbientLight(0x4a5a72, 0.42));

    // Luz de día entrando por los ventanales del sur.
    var sol = new THREE.DirectionalLight(0xffeacd, 0.5);
    sol.position.set(14, 16, 20);
    sol.castShadow = true;
    sol.shadow.mapSize.width = 2048;
    sol.shadow.mapSize.height = 2048;
    sol.shadow.camera.near = 1;
    sol.shadow.camera.far = 70;
    sol.shadow.camera.left = -26;
    sol.shadow.camera.right = 26;
    sol.shadow.camera.top = 20;
    sol.shadow.camera.bottom = -20;
    sol.shadow.bias = -0.0006;
    escena.add(sol);

    // Relleno frío desde el norte para que las sombras no queden negras.
    var relleno = new THREE.DirectionalLight(0x9ec4ff, 0.2);
    relleno.position.set(-12, 10, -18);
    escena.add(relleno);

    // Las lámparas del techo son la fuente principal: caen sobre las mesas
    // y dejan el piso en penumbra, que es lo que separa una cosa de la otra.
    for (var l = -2; l <= 2; l++) {
      for (var f = -1; f <= 1; f += 2) {
        var punto = new THREE.PointLight(0xe6eefa, 0.85, 22, 2);
        punto.position.set(l * 9, SALON.alto - 1.4, f * 5);
        escena.add(punto);
      }
    }

    // Un rebote tenue hacia el techo para que no quede como un vacío negro.
    var haciaArriba = new THREE.HemisphereLight(0x2b3444, 0x0d1219, 0.35);
    escena.add(haciaArriba);

    return sol;
  }

  global.Escena = {
    SALON: SALON,
    PALETA: PALETA,
    construirSalon: construirSalon,
    agregarLuces: agregarLuces,
    crearMesa: crearMesa,
    crearLetrero: crearLetrero,
    crearMarcaPiso: crearMarcaPiso,
    texturaTexto: texturaTexto,
    texturaPizarra: texturaPizarra
  };
})(window);
