/*
 * Laboratorio de Física 3D - Estaciones de mecánica
 *
 * Cada estación es un objeto con la misma interfaz:
 *   construir()          arma la geometría y la deja en this.grupo
 *   aplicarParametros()  traslada los controles del panel al modelo físico
 *   correr() / reiniciar()
 *   actualizar(dt)       avanza la simulación y mueve la geometría
 *   lecturas()           valores que se muestran en el panel y en la mesa
 *   registrarMedicion()  fila que se agrega a la tabla de datos
 */
(function (global) {
  'use strict';

  var F = global.Fisica;
  var U = global.Util3D;

  var GRAVEDADES = [
    { valor: 9.81, etiqueta: 'Tierra 9.81' },
    { valor: 1.62, etiqueta: 'Luna 1.62' },
    { valor: 3.72, etiqueta: 'Marte 3.72' },
    { valor: 24.79, etiqueta: 'Júpiter 24.79' }
  ];

  // Lee el valor actual de un parámetro por su id.
  function p(est, id) {
    for (var i = 0; i < est.parametros.length; i++) {
      if (est.parametros[i].id === id) return est.parametros[i].valor;
    }
    return null;
  }

  /* ================================================================== *
   * ESTACIÓN 1 - Caída libre en tubo de vacío
   * ================================================================== */

  function CaidaLibreEstacion() {
    this.id = 'caida-libre';
    this.numero = 1;
    this.titulo = 'Caída libre';
    this.subtitulo = 'Tubo de vacío de 12 metros';
    this.color = 0x4fd6e3;
    this.posicion = { x: -15, z: -5 };
    // Algo más lejos que las demás: el tubo mide doce metros y hay que
    // poder verlo entero sin doblar el cuello.
    this.puesto = { x: -15, z: -1.4 };
    this.sinMesa = true;
    this.descripcion = 'Suelta un cuerpo dentro de un tubo del que puedes sacar el aire. ' +
      'Sin aire, la masa no importa: todo cae igual. Con aire, la forma manda.';
    this.ecuaciones = ['y = h - g t^2 / 2', 't = raíz(2h / g)', 'v = raíz(2 g h)'];

    this.parametros = [
      { id: 'altura', etiqueta: 'Altura de caída', unidad: 'm', tipo: 'rango', min: 2, max: 12, paso: 0.5, valor: 10 },
      { id: 'gravedad', etiqueta: 'Gravedad', unidad: 'm/s2', tipo: 'opciones', opciones: GRAVEDADES, valor: 9.81 },
      { id: 'medio', etiqueta: 'Medio', tipo: 'opciones', valor: 0, opciones: [
        { valor: 0, etiqueta: 'Vacío' }, { valor: 1, etiqueta: 'Con aire' }
      ] },
      { id: 'cuerpo', etiqueta: 'Cuerpo', tipo: 'opciones', valor: 0, opciones: [
        { valor: 0, etiqueta: 'Balín de acero' },
        { valor: 1, etiqueta: 'Pelota de espuma' },
        { valor: 2, etiqueta: 'Hoja de papel' }
      ] }
    ];

    this.misiones = [
      {
        id: 'cl-1', tipo: 'prediccion',
        enunciado: 'Antes de soltar el cuerpo, calcula cuánto tiempo tarda en llegar al piso con los valores que pusiste en el panel.',
        pista: 'Despeja el tiempo de h = g t^2 / 2.',
        entrada: { etiqueta: 'Tiempo de caída', unidad: 's' },
        objetivo: function (e) { return Math.sqrt(2 * p(e, 'altura') / p(e, 'gravedad')); },
        tolerancia: 0.05,
        condicionPrevia: function (e) { return p(e, 'medio') === 0; },
        avisoPrevio: 'Pon el medio en vacío para que valga la fórmula.'
      },
      {
        id: 'cl-2', tipo: 'prediccion',
        enunciado: 'Ahora predice con qué rapidez llega al piso.',
        pista: 'Usa v^2 = 2 g h, o bien v = g t con el tiempo que ya calculaste.',
        entrada: { etiqueta: 'Rapidez de impacto', unidad: 'm/s' },
        objetivo: function (e) { return Math.sqrt(2 * p(e, 'gravedad') * p(e, 'altura')); },
        tolerancia: 0.05,
        condicionPrevia: function (e) { return p(e, 'medio') === 0; },
        avisoPrevio: 'Pon el medio en vacío para que valga la fórmula.'
      },
      {
        id: 'cl-3', tipo: 'reto',
        enunciado: 'En vacío, suelta el balín de acero y la hoja de papel desde la misma altura. Comprueba que los dos tiempos son iguales.',
        pista: 'Corre una vez con cada cuerpo sin cambiar la altura y compara la tabla de datos.',
        verificar: function (e) {
          var enVacio = e.historial.filter(function (m) { return m.medio === 'Vacío'; });
          var acero = enVacio.filter(function (m) { return m.cuerpo === 'Balín de acero'; }).pop();
          var papel = enVacio.filter(function (m) { return m.cuerpo === 'Hoja de papel'; }).pop();
          if (!acero || !papel) return { ok: false, mensaje: 'Faltan corridas en vacío con los dos cuerpos.' };
          if (Math.abs(acero.altura - papel.altura) > 0.01) {
            return { ok: false, mensaje: 'Repite las dos corridas usando la misma altura.' };
          }
          var dif = Math.abs(acero.tiempo - papel.tiempo);
          return dif < 0.02
            ? { ok: true, mensaje: 'Exacto: en vacío los dos tardan ' + acero.tiempo.toFixed(2) + ' s. La masa no aparece en la fórmula.' }
            : { ok: false, mensaje: 'Los tiempos difieren en ' + dif.toFixed(2) + ' s.' };
        }
      },
      {
        id: 'cl-4', tipo: 'reto',
        enunciado: 'Deja entrar aire al tubo y suelta la hoja de papel. Logra que tarde al menos 1 segundo más que en vacío.',
        pista: 'El arrastre crece con el área. La hoja es la que más superficie ofrece.',
        verificar: function (e) {
          var papelAire = e.historial.filter(function (m) { return m.cuerpo === 'Hoja de papel' && m.medio === 'Con aire'; }).pop();
          var papelVacio = e.historial.filter(function (m) { return m.cuerpo === 'Hoja de papel' && m.medio === 'Vacío'; }).pop();
          if (!papelAire || !papelVacio) return { ok: false, mensaje: 'Suelta la hoja en vacío y con aire.' };
          var dif = papelAire.tiempo - papelVacio.tiempo;
          return dif >= 1
            ? { ok: true, mensaje: 'Con aire tarda ' + dif.toFixed(2) + ' s más. Esa diferencia es la fuerza de arrastre.' }
            : { ok: false, mensaje: 'Solo hay ' + dif.toFixed(2) + ' s de diferencia. Prueba con más altura.' };
        }
      }
    ];

    this.sim = null;
    this.corriendo = false;
    this.historial = [];
  }

  CaidaLibreEstacion.prototype.datosCuerpo = function () {
    var tipo = p(this, 'cuerpo');
    if (tipo === 0) return { masa: 0.51, radio: 0.05, cd: 0.47, area: Math.PI * 0.05 * 0.05, color: 0xb9c3d4, nombre: 'Balín de acero' };
    if (tipo === 1) return { masa: 0.012, radio: 0.09, cd: 0.47, area: Math.PI * 0.09 * 0.09, color: 0xff9f6b, nombre: 'Pelota de espuma' };
    return { masa: 0.005, radio: 0.11, cd: 1.28, area: 0.06, color: 0xf2ead6, nombre: 'Hoja de papel' };
  };

  CaidaLibreEstacion.prototype.construir = function () {
    var g = new THREE.Group();
    var altoTubo = 12.4;

    // Tubo de vidrio: atraviesa el tragaluz del techo.
    var tubo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, altoTubo, 32, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xaee3f2, transparent: true, opacity: 0.16,
        roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide,
        transmission: 0.6, thickness: 0.2
      })
    );
    tubo.position.y = altoTubo / 2 + 0.1;
    g.add(tubo);

    // Aros de refuerzo cada 2 metros.
    var matAro = new THREE.MeshStandardMaterial({ color: 0x8a94a6, roughness: 0.4, metalness: 0.85 });
    for (var a = 0; a <= 12; a += 2) {
      var aro = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.035, 8, 28), matAro);
      aro.rotation.x = Math.PI / 2;
      aro.position.y = a + 0.1;
      g.add(aro);
    }

    // Base con el sensor de llegada.
    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 0.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x2b3140, roughness: 0.5, metalness: 0.5 })
    );
    base.position.y = 0.1;
    base.receiveShadow = true;
    g.add(base);

    this.sensor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.03, 24),
      new THREE.MeshBasicMaterial({ color: 0x4fd6e3, transparent: true, opacity: 0.35 })
    );
    this.sensor.position.y = 0.21;
    g.add(this.sensor);

    // Regla vertical con marcas cada metro.
    var regla = U.crearRegla(12, 1, 'y', 0x8fa3bd, { escalaTexto: 0.55 });
    regla.position.set(0.75, 0.1, 0);
    g.add(regla);

    // Cuerpo que cae.
    var d = this.datosCuerpo();
    this.cuerpo = U.crearCuerpo(d.radio, d.color);
    this.cuerpo.position.y = 10;
    g.add(this.cuerpo);

    // Compuerta de la que se suelta el cuerpo.
    this.compuerta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.06, 24),
      new THREE.MeshStandardMaterial({ color: 0xffb347, roughness: 0.4, metalness: 0.6 })
    );
    this.compuerta.position.y = 10.1;
    g.add(this.compuerta);

    // Pantalla de instrumentos al lado del tubo.
    this.pantalla = U.crearPantalla(1.25, 0.8);
    this.pantalla.position.set(-1.35, 1.5, 0.2);
    this.pantalla.rotation.y = 0.5;
    g.add(this.pantalla);

    var soporte = U.crearSoporte(1.1);
    soporte.position.set(-1.35, 0, 0.2);
    g.add(soporte);

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  CaidaLibreEstacion.prototype.aplicarParametros = function () {
    var d = this.datosCuerpo();
    var conAire = p(this, 'medio') === 1;
    this.sim = new F.CaidaLibre({
      altura: p(this, 'altura'),
      masa: d.masa,
      gravedad: p(this, 'gravedad'),
      coefArrastre: conAire ? d.cd : 0,
      area: conAire ? d.area : 0
    });

    // Reconstruye el cuerpo si cambió de tipo.
    if (this.cuerpo && this.cuerpoActual !== d.nombre) {
      this.cuerpo.geometry.dispose();
      this.cuerpo.geometry = new THREE.SphereGeometry(d.radio, 28, 20);
      this.cuerpo.material.color.setHex(d.color);
      this.cuerpo.material.emissive.setHex(d.color);
      this.cuerpoActual = d.nombre;
    }
    if (this.compuerta) this.compuerta.position.y = p(this, 'altura') + 0.15;
    if (this.sensor) {
      this.sensor.material.color.setHex(conAire ? 0xffb347 : 0x4fd6e3);
    }
  };

  CaidaLibreEstacion.prototype.reiniciar = function () {
    this.aplicarParametros();
    this.corriendo = false;
    this.impacto = null;
    if (this.cuerpo) this.cuerpo.position.y = this.sim.altura;
    this.refrescarPantalla();
  };

  CaidaLibreEstacion.prototype.correr = function () {
    this.reiniciar();
    this.corriendo = true;
  };

  CaidaLibreEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo && !this.sim.enSuelo) {
      // Subdivide el paso para que el impacto quede bien resuelto.
      var sub = 6, h = dt / sub;
      for (var i = 0; i < sub && !this.sim.enSuelo; i++) this.sim.paso(h);
      this.cuerpo.position.y = this.sim.posicion() + 0.22;

      if (this.sim.enSuelo) {
        this.corriendo = false;
        this.impacto = { tiempo: this.sim.t, velocidad: Math.abs(this.sim.velocidad()) };
        this.registrarMedicion();
        this.destello = 0.6;
      }
    }
    if (this.destello > 0) {
      this.destello -= dt;
      this.sensor.material.opacity = 0.35 + Math.abs(Math.sin(this.destello * 24)) * 0.5;
    } else if (this.sensor) {
      this.sensor.material.opacity = 0.35;
    }
    this.refrescarPantalla();
  };

  CaidaLibreEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    var altura = this.sim ? this.sim.posicion() : 0;
    var vel = this.sim ? Math.abs(this.sim.velocidad()) : 0;
    this.pantalla.userData.dibujar([
      'CAÍDA LIBRE',
      't = ' + (this.sim ? this.sim.t : 0).toFixed(3) + ' s',
      'y = ' + altura.toFixed(2) + ' m',
      'v = ' + vel.toFixed(2) + ' m/s'
    ]);
  };

  CaidaLibreEstacion.prototype.lecturas = function () {
    var teorico = this.sim.tiempoTeorico();
    var vTeorica = this.sim.velocidadImpactoTeorica();
    var out = [
      { etiqueta: 'Tiempo transcurrido', valor: this.sim.t.toFixed(3), unidad: 's' },
      { etiqueta: 'Altura actual', valor: this.sim.posicion().toFixed(2), unidad: 'm' },
      { etiqueta: 'Rapidez actual', valor: Math.abs(this.sim.velocidad()).toFixed(2), unidad: 'm/s' },
      { etiqueta: 'Tiempo teórico sin aire', valor: teorico.toFixed(3), unidad: 's', teorico: true },
      { etiqueta: 'Rapidez teórica sin aire', valor: vTeorica.toFixed(2), unidad: 'm/s', teorico: true }
    ];
    if (this.impacto) {
      out.push({ etiqueta: 'Tiempo medido al caer', valor: this.impacto.tiempo.toFixed(3), unidad: 's', destacado: true });
      out.push({ etiqueta: 'Rapidez al impactar', valor: this.impacto.velocidad.toFixed(2), unidad: 'm/s', destacado: true });
    }
    return out;
  };

  CaidaLibreEstacion.prototype.registrarMedicion = function () {
    var d = this.datosCuerpo();
    var fila = {
      corrida: this.historial.length + 1,
      altura: p(this, 'altura'),
      gravedad: p(this, 'gravedad'),
      medio: p(this, 'medio') === 1 ? 'Con aire' : 'Vacío',
      cuerpo: d.nombre,
      masa: d.masa,
      tiempo: this.sim.t,
      velocidad: Math.abs(this.sim.velocidad()),
      tiempoTeorico: this.sim.tiempoTeorico()
    };
    this.historial.push(fila);
    return fila;
  };

  CaidaLibreEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'altura', etiqueta: 'h (m)', decimales: 2 },
      { clave: 'gravedad', etiqueta: 'g (m/s2)', decimales: 2 },
      { clave: 'medio', etiqueta: 'Medio' },
      { clave: 'cuerpo', etiqueta: 'Cuerpo' },
      { clave: 'tiempo', etiqueta: 't medido (s)', decimales: 3 },
      { clave: 'tiempoTeorico', etiqueta: 't teórico (s)', decimales: 3 },
      { clave: 'velocidad', etiqueta: 'v impacto (m/s)', decimales: 2 }
    ];
  };

  /* ================================================================== *
   * ESTACIÓN 2 - Plano inclinado con fricción
   * ================================================================== */

  function PlanoEstacion() {
    this.id = 'plano-inclinado';
    this.numero = 2;
    this.titulo = 'Plano inclinado';
    this.subtitulo = 'Fricción y ángulo crítico';
    this.color = 0xffb347;
    this.posicion = { x: -5, z: -5 };
    this.puesto = { x: -5, z: -1.6 };
    this.mesaTamano = { ancho: 5.6, fondo: 2.0 };
    this.descripcion = 'Sube el ángulo poco a poco. Hay un valor exacto donde el bloque ' +
      'vence a la fricción y empieza a bajar: ese ángulo te mide el coeficiente.';
    this.ecuaciones = ['a = g (sen A - mu cos A)', 'tan A_crítico = mu_estático'];

    this.parametros = [
      { id: 'angulo', etiqueta: 'Ángulo de la rampa', unidad: 'grados', tipo: 'rango', min: 5, max: 50, paso: 1, valor: 25 },
      { id: 'mu', etiqueta: 'Coef. de fricción', unidad: '', tipo: 'rango', min: 0, max: 0.8, paso: 0.02, valor: 0.3 },
      { id: 'masa', etiqueta: 'Masa del bloque', unidad: 'kg', tipo: 'rango', min: 0.5, max: 8, paso: 0.5, valor: 2 },
      { id: 'gravedad', etiqueta: 'Gravedad', unidad: 'm/s2', tipo: 'opciones', opciones: GRAVEDADES, valor: 9.81 }
    ];

    this.misiones = [
      {
        id: 'pi-1', tipo: 'prediccion',
        enunciado: 'Con los valores del panel, calcula la aceleración del bloque al bajar la rampa.',
        pista: 'a = g (sen A - mu cos A). Si te da negativa, el bloque ni se mueve.',
        entrada: { etiqueta: 'Aceleración', unidad: 'm/s2' },
        objetivo: function (e) {
          var th = p(e, 'angulo') * Math.PI / 180;
          var a = p(e, 'gravedad') * (Math.sin(th) - p(e, 'mu') * Math.cos(th));
          return Math.max(0, a);
        },
        tolerancia: 0.08,
        condicionPrevia: function (e) {
          var th = p(e, 'angulo') * Math.PI / 180;
          return Math.tan(th) > p(e, 'mu') * 1.25;
        },
        avisoPrevio: 'Con ese ángulo el bloque no desliza. Súbelo hasta que se mueva.'
      },
      {
        id: 'pi-2', tipo: 'prediccion',
        enunciado: 'Busca el ángulo crítico: el mínimo con el que el bloque empieza a deslizar por sí solo.',
        pista: 'En el límite, tan del ángulo iguala al coeficiente estático, que aquí vale 1.25 veces el que ajustaste.',
        entrada: { etiqueta: 'Ángulo crítico', unidad: 'grados' },
        objetivo: function (e) { return Math.atan(p(e, 'mu') * 1.25) * 180 / Math.PI; },
        tolerancia: 0.06
      },
      {
        id: 'pi-3', tipo: 'reto',
        enunciado: 'Demuestra que la masa no cambia la aceleración: haz dos corridas con el mismo ángulo y fricción pero masas muy distintas.',
        pista: 'La masa se cancela al dividir la fuerza entre m. Prueba 0.5 kg y 8 kg.',
        verificar: function (e) {
          if (e.historial.length < 2) return { ok: false, mensaje: 'Necesitas al menos dos corridas.' };
          var u = e.historial[e.historial.length - 1];
          var v = null;
          for (var i = e.historial.length - 2; i >= 0; i--) {
            var c = e.historial[i];
            if (Math.abs(c.angulo - u.angulo) < 0.01 && Math.abs(c.mu - u.mu) < 0.001 &&
                Math.abs(c.masa - u.masa) > 1) { v = c; break; }
          }
          if (!v) return { ok: false, mensaje: 'Repite la corrida cambiando solo la masa (al menos 1 kg de diferencia).' };
          var dif = Math.abs(u.aceleracion - v.aceleracion);
          return dif < 0.01
            ? { ok: true, mensaje: 'Con ' + v.masa + ' kg y ' + u.masa + ' kg la aceleración es la misma: ' + u.aceleracion.toFixed(2) + ' m/s2.' }
            : { ok: false, mensaje: 'Las aceleraciones no coinciden.' };
        }
      }
    ];

    this.corriendo = false;
    this.historial = [];
  }

  PlanoEstacion.prototype.construir = function () {
    var g = new THREE.Group();
    this.largoRampa = 4;

    // Base de la rampa.
    var base = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.12, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x2b3140, roughness: 0.6, metalness: 0.4 })
    );
    base.position.set(0, 0.96, 0);
    base.receiveShadow = true;
    g.add(base);

    // Superficie inclinada, gira alrededor del pivote inferior derecho.
    this.pivote = new THREE.Group();
    this.pivote.position.set(2.1, 1.02, 0);
    g.add(this.pivote);

    this.rampa = new THREE.Mesh(
      new THREE.BoxGeometry(this.largoRampa, 0.08, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x50596b, roughness: 0.7, metalness: 0.2 })
    );
    this.rampa.position.x = -this.largoRampa / 2;
    this.rampa.castShadow = true;
    this.rampa.receiveShadow = true;
    this.pivote.add(this.rampa);

    // Regla sobre la rampa para leer la distancia recorrida.
    var regla = U.crearRegla(this.largoRampa, 0.5, 'x', 0xbfcadb, { escalaTexto: 0.4 });
    regla.rotation.y = Math.PI;
    regla.position.set(0, 0.05, 0.6);
    this.pivote.add(regla);

    // Bloque que desliza.
    this.bloque = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.3, 0.45),
      new THREE.MeshStandardMaterial({ color: 0xffb347, roughness: 0.5, metalness: 0.3, emissive: 0x3a2a10 })
    );
    this.bloque.castShadow = true;
    this.pivote.add(this.bloque);

    // Puntal ajustable que sostiene el extremo alto.
    this.puntal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1, 12),
      new THREE.MeshStandardMaterial({ color: 0x8a94a6, roughness: 0.4, metalness: 0.8 })
    );
    g.add(this.puntal);

    // Transportador que muestra el ángulo.
    var disco = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 40, Math.PI / 2, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x4fd6e3, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
    );
    disco.position.set(2.1, 1.02, 0.62);
    g.add(disco);
    this.rotuloAngulo = U.rotulo('25 grados', { escala: 0.5 });
    this.rotuloAngulo.position.set(1.0, 1.42, 0.68);
    g.add(this.rotuloAngulo);

    this.pantalla = U.crearPantalla(1.2, 0.8);
    this.pantalla.position.set(-2.4, 1.7, 0.3);
    this.pantalla.rotation.y = 0.6;
    g.add(this.pantalla);
    var sop = U.crearSoporte(1.3);
    sop.position.set(-2.4, 0.98, 0.3);
    g.add(sop);

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  PlanoEstacion.prototype.aplicarParametros = function () {
    var mu = p(this, 'mu');
    this.sim = new F.PlanoInclinado({
      anguloGrados: p(this, 'angulo'),
      masa: p(this, 'masa'),
      muCinetico: mu,
      muEstatico: mu * 1.25,
      largo: this.largoRampa,
      gravedad: p(this, 'gravedad')
    });

    var th = p(this, 'angulo') * Math.PI / 180;
    // Signo negativo: con el positivo la rampa baja y atraviesa la mesa.
    if (this.pivote) this.pivote.rotation.z = -th;
    if (this.puntal) {
      var alturaExtremo = this.largoRampa * Math.sin(th);
      this.puntal.scale.y = Math.max(0.05, alturaExtremo);
      this.puntal.position.set(2.1 - this.largoRampa * Math.cos(th), 1.02 + alturaExtremo / 2, 0);
    }
    if (this.bloque) {
      var lado = 0.25 + p(this, 'masa') * 0.035;
      this.bloque.scale.set(lado / 0.45, lado / 0.45, lado / 0.45);
    }
    if (this.rotuloAngulo) {
      this.rotuloAngulo.userData.actualizarTexto(p(this, 'angulo').toFixed(0) + ' grados');
    }
  };

  PlanoEstacion.prototype.reiniciar = function () {
    this.aplicarParametros();
    this.corriendo = false;
    this.finalizado = false;
    this.colocarBloque(0);
    this.refrescarPantalla();
  };

  PlanoEstacion.prototype.colocarBloque = function (distancia) {
    if (!this.bloque) return;
    // El bloque apoya sobre la cara de la rampa: media altura ya escalada
    // más el medio grosor del tablero.
    var escala = (0.25 + p(this, 'masa') * 0.035) / 0.45;
    var medio = 0.15 * escala;
    this.bloque.position.set(-this.largoRampa + 0.35 + distancia, 0.04 + medio, 0);
  };

  PlanoEstacion.prototype.correr = function () {
    this.reiniciar();
    this.corriendo = true;
  };

  PlanoEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo && !this.sim.detenido) {
      var sub = 4, h = dt / sub;
      for (var i = 0; i < sub && !this.sim.detenido; i++) this.sim.paso(h);
      this.colocarBloque(Math.min(this.sim.distancia(), this.largoRampa - 0.5));
      if (this.sim.detenido) {
        this.corriendo = false;
        this.finalizado = true;
        this.registrarMedicion();
      }
    }
    this.refrescarPantalla();
  };

  PlanoEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    var desliza = this.sim.desliza();
    this.pantalla.userData.dibujar([
      'PLANO INCLINADO',
      'a = ' + this.sim.aceleracion(this.sim.velocidad()).toFixed(2) + ' m/s2',
      'v = ' + this.sim.velocidad().toFixed(2) + ' m/s',
      desliza ? 'estado: desliza' : 'estado: en reposo'
    ]);
  };

  PlanoEstacion.prototype.lecturas = function () {
    var th = p(this, 'angulo') * Math.PI / 180;
    var g = p(this, 'gravedad');
    var m = p(this, 'masa');
    return [
      { etiqueta: 'Aceleración', valor: this.sim.aceleracion(this.sim.velocidad()).toFixed(3), unidad: 'm/s2' },
      { etiqueta: 'Rapidez', valor: this.sim.velocidad().toFixed(2), unidad: 'm/s' },
      { etiqueta: 'Distancia recorrida', valor: this.sim.distancia().toFixed(2), unidad: 'm' },
      { etiqueta: 'Tiempo', valor: this.sim.t.toFixed(2), unidad: 's' },
      { etiqueta: 'Peso paralelo', valor: (m * g * Math.sin(th)).toFixed(2), unidad: 'N', teorico: true },
      { etiqueta: 'Fricción máxima', valor: (m * g * Math.cos(th) * p(this, 'mu') * 1.25).toFixed(2), unidad: 'N', teorico: true },
      { etiqueta: 'Ángulo crítico', valor: this.sim.anguloCriticoGrados().toFixed(1), unidad: 'grados', teorico: true },
      { etiqueta: 'Estado', valor: this.sim.desliza() ? 'Desliza' : 'En reposo', unidad: '', destacado: true }
    ];
  };

  PlanoEstacion.prototype.registrarMedicion = function () {
    var fila = {
      corrida: this.historial.length + 1,
      angulo: p(this, 'angulo'),
      mu: p(this, 'mu'),
      masa: p(this, 'masa'),
      aceleracion: this.sim.aceleracion(0.1),
      velocidadFinal: this.sim.velocidad(),
      tiempo: this.sim.t,
      distancia: this.sim.distancia()
    };
    this.historial.push(fila);
    return fila;
  };

  PlanoEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'angulo', etiqueta: 'Ángulo (gr)', decimales: 0 },
      { clave: 'mu', etiqueta: 'mu', decimales: 2 },
      { clave: 'masa', etiqueta: 'm (kg)', decimales: 1 },
      { clave: 'aceleracion', etiqueta: 'a (m/s2)', decimales: 3 },
      { clave: 'velocidadFinal', etiqueta: 'v final (m/s)', decimales: 2 },
      { clave: 'tiempo', etiqueta: 't (s)', decimales: 2 }
    ];
  };

  /* ================================================================== *
   * ESTACIÓN 3 - Péndulo simple
   * ================================================================== */

  function PenduloEstacion() {
    this.id = 'pendulo';
    this.numero = 3;
    this.titulo = 'Péndulo simple';
    this.subtitulo = 'Donde falla la fórmula del libro';
    this.color = 0xb08cff;
    this.posicion = { x: 5, z: -5 };
    this.puesto = { x: 5, z: -1.6 };
    this.mesaTamano = { ancho: 3.4, fondo: 1.8 };
    this.descripcion = 'El periodo casi no depende de la masa ni de la amplitud, pero ese ' +
      '"casi" se nota: pasa de 10 a 70 grados y mira crecer el error de la fórmula.';
    this.ecuaciones = ['T = 2 pi raíz(L / g)', 'válido solo si el ángulo es pequeño'];

    this.parametros = [
      { id: 'largo', etiqueta: 'Largo del hilo', unidad: 'm', tipo: 'rango', min: 0.3, max: 2.3, paso: 0.05, valor: 1.2 },
      { id: 'angulo', etiqueta: 'Ángulo inicial', unidad: 'grados', tipo: 'rango', min: 5, max: 80, paso: 1, valor: 15 },
      { id: 'masa', etiqueta: 'Masa', unidad: 'kg', tipo: 'rango', min: 0.1, max: 3, paso: 0.1, valor: 0.5 },
      { id: 'roce', etiqueta: 'Rozamiento', unidad: '1/s', tipo: 'rango', min: 0, max: 0.5, paso: 0.02, valor: 0 },
      { id: 'gravedad', etiqueta: 'Gravedad', unidad: 'm/s2', tipo: 'opciones', opciones: GRAVEDADES, valor: 9.81 }
    ];

    this.misiones = [
      {
        id: 'pe-1', tipo: 'prediccion',
        enunciado: 'Calcula el periodo del péndulo con la fórmula del libro y compáralo con el que mide el laboratorio.',
        pista: 'T = 2 pi raíz(L / g). Deja el ángulo inicial en 15 grados o menos.',
        entrada: { etiqueta: 'Periodo', unidad: 's' },
        objetivo: function (e) { return 2 * Math.PI * Math.sqrt(p(e, 'largo') / p(e, 'gravedad')); },
        tolerancia: 0.04
      },
      {
        id: 'pe-2', tipo: 'reto',
        enunciado: 'Comprueba que la masa no cambia el periodo: dos corridas con el mismo largo y ángulo, pero masas distintas.',
        pista: 'La masa se cancela en la ecuación del péndulo, igual que en la caída libre.',
        verificar: function (e) {
          if (e.historial.length < 2) return { ok: false, mensaje: 'Necesitas dos corridas.' };
          var u = e.historial[e.historial.length - 1], v = null;
          for (var i = e.historial.length - 2; i >= 0; i--) {
            var c = e.historial[i];
            if (Math.abs(c.largo - u.largo) < 0.001 && Math.abs(c.angulo - u.angulo) < 0.5 &&
                Math.abs(c.masa - u.masa) > 0.3) { v = c; break; }
          }
          if (!v) return { ok: false, mensaje: 'Cambia solo la masa y vuelve a medir.' };
          var dif = Math.abs(u.periodoMedido - v.periodoMedido);
          return dif < 0.02
            ? { ok: true, mensaje: 'Con ' + v.masa + ' kg y ' + u.masa + ' kg el periodo es el mismo: ' + u.periodoMedido.toFixed(3) + ' s.' }
            : { ok: false, mensaje: 'Hay ' + dif.toFixed(3) + ' s de diferencia, revisa que el largo sea igual.' };
        }
      },
      {
        id: 'pe-3', tipo: 'reto',
        enunciado: 'Encuentra un ángulo inicial con el que la fórmula del libro se equivoque en más de 3 por ciento.',
        pista: 'La fórmula supone ángulos pequeños. Prueba pasando de 45 grados.',
        verificar: function (e) {
          var malo = e.historial.filter(function (m) { return m.errorPorciento > 3; }).pop();
          return malo
            ? { ok: true, mensaje: 'A ' + malo.angulo + ' grados la fórmula falla por ' + malo.errorPorciento.toFixed(1) + ' por ciento. Ese es el límite de la aproximación.' }
            : { ok: false, mensaje: 'Todavía no pasas del 3 por ciento. Sube más el ángulo y deja correr una oscilación completa.' };
        }
      },
      {
        id: 'pe-4', tipo: 'prediccion',
        enunciado: 'Si quieres un péndulo que tarde exactamente 2 segundos por oscilación en la Tierra, ¿qué largo necesitas?',
        pista: 'Despeja L de T = 2 pi raíz(L / g) con T = 2 s.',
        entrada: { etiqueta: 'Largo del hilo', unidad: 'm' },
        objetivo: function () { return 9.81 * Math.pow(2 / (2 * Math.PI), 2); },
        tolerancia: 0.05
      }
    ];

    this.corriendo = false;
    this.historial = [];
  }

  PenduloEstacion.prototype.construir = function () {
    var g = new THREE.Group();

    // Pórtico del que cuelga el péndulo.
    var matMetal = new THREE.MeshStandardMaterial({ color: 0x8a94a6, roughness: 0.4, metalness: 0.85 });
    // El pórtico se monta sobre la superficie de la mesa, a 1.03 m.
    var MESA = 1.03, ALTO_PORTICO = 2.6;
    [-0.9, 0.9].forEach(function (x) {
      var col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, ALTO_PORTICO, 12), matMetal);
      col.position.set(x, MESA + ALTO_PORTICO / 2, 0);
      col.castShadow = true;
      g.add(col);
      var pie = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.6), matMetal);
      pie.position.set(x, MESA + 0.025, 0);
      g.add(pie);
    });
    var travesano = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.12), matMetal);
    travesano.position.set(0, MESA + ALTO_PORTICO, 0);
    travesano.castShadow = true;
    g.add(travesano);

    // Punto de giro, justo debajo del travesano.
    this.pivote = new THREE.Group();
    this.pivote.position.set(0, MESA + ALTO_PORTICO - 0.06, 0);
    g.add(this.pivote);

    this.hilo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 1, 6),
      new THREE.MeshBasicMaterial({ color: 0xd8dee9 })
    );
    this.pivote.add(this.hilo);

    this.masa = U.crearCuerpo(0.12, 0xb08cff);
    this.pivote.add(this.masa);

    // Transportador de fondo con la vertical marcada.
    var vertical = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -2.5, 0)
      ]),
      new THREE.LineDashedMaterial({ color: 0x6f7d92, dashSize: 0.08, gapSize: 0.06 })
    );
    vertical.computeLineDistances();
    this.pivote.add(vertical);

    // Traza del recorrido de la masa.
    this.traza = new U.Traza(0xb08cff, 900, { opacidad: 0.5 });
    this.pivote.add(this.traza.linea);

    this.pantalla = U.crearPantalla(1.25, 0.85);
    this.pantalla.position.set(-2.5, 1.75, 0.5);
    this.pantalla.rotation.y = 0.5;
    g.add(this.pantalla);
    var sop = U.crearSoporte(1.25);
    sop.position.set(-2.5, 1.02, 0.5);
    g.add(sop);

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  PenduloEstacion.prototype.aplicarParametros = function () {
    this.sim = new F.Pendulo({
      largo: p(this, 'largo'),
      masa: p(this, 'masa'),
      anguloInicialGrados: p(this, 'angulo'),
      amortiguamiento: p(this, 'roce'),
      gravedad: p(this, 'gravedad')
    });
    if (this.masa) {
      var r = 0.07 + p(this, 'masa') * 0.035;
      this.masa.geometry.dispose();
      this.masa.geometry = new THREE.SphereGeometry(r, 24, 18);
    }
    this.colocar();
  };

  PenduloEstacion.prototype.colocar = function () {
    if (!this.hilo) return;
    var L = this.sim.largo;
    var th = this.sim.angulo();
    this.hilo.scale.y = L;
    this.hilo.position.set(Math.sin(th) * L / 2, -Math.cos(th) * L / 2, 0);
    this.hilo.rotation.z = th;
    this.masa.position.set(Math.sin(th) * L, -Math.cos(th) * L, 0);
  };

  PenduloEstacion.prototype.reiniciar = function () {
    this.aplicarParametros();
    this.corriendo = false;
    if (this.traza) this.traza.limpiar();
    this.refrescarPantalla();
  };

  PenduloEstacion.prototype.correr = function () {
    this.reiniciar();
    this.corriendo = true;
  };

  PenduloEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo) {
      var sub = 8, h = dt / sub;
      var teniaPeriodo = this.sim.periodoMedido != null;
      for (var i = 0; i < sub; i++) this.sim.paso(h);
      this.colocar();
      if (this.traza && this.masa) {
        this.traza.agregar(this.masa.position.x, this.masa.position.y, this.masa.position.z);
      }
      // En cuanto hay dos cruces por la vertical ya se conoce el periodo:
      // esa es la medición que se anota en la tabla.
      if (!teniaPeriodo && this.sim.periodoMedido != null) {
        this.registrarMedicion();
      }
    }
    this.refrescarPantalla();
  };

  PenduloEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    var medido = this.sim.periodoMedido;
    this.pantalla.userData.dibujar([
      'PÉNDULO',
      'T libro = ' + this.sim.periodoPequeno().toFixed(3) + ' s',
      'T real  = ' + (medido ? medido.toFixed(3) + ' s' : 'midiendo...'),
      'ángulo  = ' + (this.sim.angulo() * 180 / Math.PI).toFixed(1) + ' gr'
    ]);
  };

  PenduloEstacion.prototype.errorPorciento = function () {
    if (!this.sim.periodoMedido) return null;
    return Math.abs(this.sim.periodoMedido - this.sim.periodoPequeno()) / this.sim.periodoMedido * 100;
  };

  PenduloEstacion.prototype.lecturas = function () {
    var err = this.errorPorciento();
    var out = [
      { etiqueta: 'Periodo fórmula del libro', valor: this.sim.periodoPequeno().toFixed(4), unidad: 's', teorico: true },
      { etiqueta: 'Periodo con corrección', valor: this.sim.periodoCorregido().toFixed(4), unidad: 's', teorico: true },
      { etiqueta: 'Periodo medido', valor: this.sim.periodoMedido ? this.sim.periodoMedido.toFixed(4) : 'sin medir', unidad: 's', destacado: true },
      { etiqueta: 'Ángulo actual', valor: (this.sim.angulo() * 180 / Math.PI).toFixed(1), unidad: 'grados' },
      { etiqueta: 'Energía total', valor: this.sim.energiaTotal().toFixed(4), unidad: 'J' },
      { etiqueta: 'Oscilaciones', valor: this.sim.ciclos.toFixed(1), unidad: '' }
    ];
    if (err != null) {
      out.push({ etiqueta: 'Error de la fórmula', valor: err.toFixed(2), unidad: 'por ciento', destacado: true });
    }
    return out;
  };

  PenduloEstacion.prototype.registrarMedicion = function () {
    var fila = {
      corrida: this.historial.length + 1,
      largo: p(this, 'largo'),
      angulo: p(this, 'angulo'),
      masa: p(this, 'masa'),
      periodoMedido: this.sim.periodoMedido,
      periodoLibro: this.sim.periodoPequeno(),
      periodoCorregido: this.sim.periodoCorregido(),
      errorPorciento: this.errorPorciento() || 0
    };
    this.historial.push(fila);
    return fila;
  };

  PenduloEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'largo', etiqueta: 'L (m)', decimales: 2 },
      { clave: 'angulo', etiqueta: 'Ángulo (gr)', decimales: 0 },
      { clave: 'masa', etiqueta: 'm (kg)', decimales: 1 },
      { clave: 'periodoMedido', etiqueta: 'T medido (s)', decimales: 4 },
      { clave: 'periodoLibro', etiqueta: 'T libro (s)', decimales: 4 },
      { clave: 'errorPorciento', etiqueta: 'Error (%)', decimales: 2 }
    ];
  };

  /* ================================================================== *
   * ESTACIÓN 4 - Colisiones en carril de aire
   * ================================================================== */

  function ColisionEstacion() {
    this.id = 'colisiones';
    this.numero = 4;
    this.titulo = 'Colisiones';
    this.subtitulo = 'Carril de aire sin fricción';
    this.color = 0x7ee787;
    this.posicion = { x: 15, z: -5 };
    this.puesto = { x: 15, z: -1.6 };
    this.mesaTamano = { ancho: 7.4, fondo: 1.6 };
    this.descripcion = 'El momento total siempre se conserva. La energía solo se conserva ' +
      'si el choque es elástico: mueve el control de rebote y mira cuánta se pierde.';
    this.ecuaciones = ['m1 v1 + m2 v2 = constante', 'e = (v2 - v1) después / (v1 - v2) antes'];

    this.parametros = [
      { id: 'masaA', etiqueta: 'Masa del carro rojo', unidad: 'kg', tipo: 'rango', min: 0.2, max: 5, paso: 0.1, valor: 1 },
      { id: 'masaB', etiqueta: 'Masa del carro azul', unidad: 'kg', tipo: 'rango', min: 0.2, max: 5, paso: 0.1, valor: 1 },
      { id: 'velA', etiqueta: 'Velocidad del rojo', unidad: 'm/s', tipo: 'rango', min: 0, max: 4, paso: 0.1, valor: 2 },
      { id: 'velB', etiqueta: 'Velocidad del azul', unidad: 'm/s', tipo: 'rango', min: -4, max: 0, paso: 0.1, valor: 0 },
      { id: 'rebote', etiqueta: 'Coef. de restitución', unidad: '', tipo: 'rango', min: 0, max: 1, paso: 0.05, valor: 1 }
    ];

    this.misiones = [
      {
        id: 'co-1', tipo: 'prediccion',
        enunciado: 'Choque elástico entre masas iguales: predice la velocidad final del carro rojo.',
        pista: 'Con masas iguales y rebote 1, los carros intercambian velocidades.',
        entrada: { etiqueta: 'Velocidad final del rojo', unidad: 'm/s' },
        objetivo: function (e) {
          var mA = p(e, 'masaA'), mB = p(e, 'masaB'), ee = p(e, 'rebote');
          var uA = p(e, 'velA'), uB = p(e, 'velB');
          return (mA * uA + mB * uB + mB * ee * (uB - uA)) / (mA + mB);
        },
        tolerancia: 0.06,
        toleranciaAbsoluta: 0.08,
        condicionPrevia: function (e) { return Math.abs(p(e, 'masaA') - p(e, 'masaB')) < 0.01 && p(e, 'rebote') > 0.99; },
        avisoPrevio: 'Pon las dos masas iguales y el rebote en 1.'
      },
      {
        id: 'co-2', tipo: 'prediccion',
        enunciado: 'Choque perfectamente inelástico: los carros quedan pegados. Predice la velocidad con la que siguen juntos.',
        pista: 'v = (mA uA + mB uB) / (mA + mB).',
        entrada: { etiqueta: 'Velocidad común', unidad: 'm/s' },
        objetivo: function (e) {
          return (p(e, 'masaA') * p(e, 'velA') + p(e, 'masaB') * p(e, 'velB')) / (p(e, 'masaA') + p(e, 'masaB'));
        },
        tolerancia: 0.06,
        toleranciaAbsoluta: 0.08,
        condicionPrevia: function (e) { return p(e, 'rebote') < 0.01; },
        avisoPrevio: 'Baja el coeficiente de restitución a 0.'
      },
      {
        id: 'co-3', tipo: 'reto',
        enunciado: 'Consigue una colisión que pierda más del 40 por ciento de la energía cinética, sin que el momento cambie.',
        pista: 'Cuanto más bajo el coeficiente de restitución, más energía se convierte en deformación y calor.',
        verificar: function (e) {
          var m = e.historial[e.historial.length - 1];
          if (!m) return { ok: false, mensaje: 'Corre al menos una colisión.' };
          if (m.energiaPerdidaPorciento > 40 && Math.abs(m.momentoDespues - m.momentoAntes) < 1e-6) {
            return { ok: true, mensaje: 'Perdiste ' + m.energiaPerdidaPorciento.toFixed(1) + ' por ciento de la energía y el momento no cambió ni un poco.' };
          }
          return { ok: false, mensaje: 'Solo perdiste ' + m.energiaPerdidaPorciento.toFixed(1) + ' por ciento. Baja el rebote.' };
        }
      },
      {
        id: 'co-4', tipo: 'reto',
        enunciado: 'Haz que el carro rojo quede totalmente quieto después del choque, sin que su velocidad inicial sea cero.',
        pista: 'Con masas iguales y choque elástico contra un carro en reposo, el primero se detiene por completo.',
        verificar: function (e) {
          var m = e.historial[e.historial.length - 1];
          if (!m) return { ok: false, mensaje: 'Corre una colisión.' };
          if (Math.abs(m.velA) > 0.05 || Math.abs(m.velAFinal) > 0.02) {
            return { ok: false, mensaje: 'El rojo quedó a ' + m.velAFinal.toFixed(2) + ' m/s.' };
          }
          return { ok: true, mensaje: 'El rojo entregó toda su velocidad al azul. Eso solo pasa con masas iguales y choque elástico.' };
        }
      }
    ];

    this.corriendo = false;
    this.historial = [];
  }

  ColisionEstacion.prototype.construir = function () {
    var g = new THREE.Group();
    this.largoCarril = 6;

    // Carril de aire montado sobre la mesa.
    var carril = new THREE.Mesh(
      new THREE.BoxGeometry(this.largoCarril + 0.6, 0.14, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x5a6475, roughness: 0.3, metalness: 0.8 })
    );
    carril.position.set(0, 1.03, 0);
    carril.castShadow = true;
    carril.receiveShadow = true;
    g.add(carril);

    // Topes en los extremos.
    var matTope = new THREE.MeshStandardMaterial({ color: 0x8a94a6, roughness: 0.4, metalness: 0.8 });
    [-1, 1].forEach(function (s) {
      var tope = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.5), matTope);
      tope.position.set(s * (this.largoCarril / 2 + 0.3), 1.3, 0);
      g.add(tope);
    }, this);

    // Regla del carril.
    var regla = U.crearRegla(6, 0.5, 'x', 0xbfcadb, { escalaTexto: 0.4 });
    regla.position.set(-3, 1.11, 0.3);
    g.add(regla);

    this.carroA = this.crearCarro(0xff6b6b);
    this.carroB = this.crearCarro(0x5aa9ff);
    g.add(this.carroA);
    g.add(this.carroB);

    // Flechas de velocidad sobre cada carro.
    this.flechaA = new U.Flecha(0xff6b6b, 0.03);
    this.flechaB = new U.Flecha(0x5aa9ff, 0.03);
    g.add(this.flechaA.grupo);
    g.add(this.flechaB.grupo);

    this.pantalla = U.crearPantalla(1.5, 0.95);
    this.pantalla.position.set(0, 2.3, -0.5);
    g.add(this.pantalla);
    [-0.7, 0.7].forEach(function (x) {
      var sop = U.crearSoporte(1.8);
      sop.position.set(x, 0.98, -0.5);
      g.add(sop);
    });

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  ColisionEstacion.prototype.crearCarro = function (color) {
    var grupo = new THREE.Group();
    var cuerpo = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.26, 0.44),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.4, emissive: color, emissiveIntensity: 0.15 })
    );
    cuerpo.castShadow = true;
    grupo.add(cuerpo);
    grupo.userData.cuerpo = cuerpo;

    // Parachoques de resorte.
    var matRes = new THREE.MeshStandardMaterial({ color: 0xd8dee9, roughness: 0.3, metalness: 0.9 });
    [-1, 1].forEach(function (s) {
      var res = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.018, 6, 14), matRes);
      res.rotation.y = Math.PI / 2;
      res.position.x = s * 0.22;
      grupo.add(res);
    });
    return grupo;
  };

  ColisionEstacion.prototype.aplicarParametros = function () {
    this.sim = new F.Colision({
      masaA: p(this, 'masaA'),
      masaB: p(this, 'masaB'),
      velocidadA: p(this, 'velA'),
      velocidadB: p(this, 'velB'),
      restitucion: p(this, 'rebote'),
      posicionA: -2,
      posicionB: 2,
      anchoCarro: 0.44,
      largoCarril: this.largoCarril
    });
    if (this.carroA) {
      var eA = 0.7 + p(this, 'masaA') * 0.22;
      var eB = 0.7 + p(this, 'masaB') * 0.22;
      this.carroA.userData.cuerpo.scale.set(1, eA, eA);
      this.carroB.userData.cuerpo.scale.set(1, eB, eB);
    }
    this.colocar();
  };

  ColisionEstacion.prototype.colocar = function () {
    if (!this.carroA) return;
    this.carroA.position.set(this.sim.xA, 1.24, 0);
    this.carroB.position.set(this.sim.xB, 1.24, 0);

    var origenA = new THREE.Vector3(this.sim.xA, 1.55, 0);
    var origenB = new THREE.Vector3(this.sim.xB, 1.55, 0);
    if (Math.abs(this.sim.vA) > 0.05) {
      this.flechaA.apuntar(origenA, new THREE.Vector3(Math.sign(this.sim.vA), 0, 0), Math.abs(this.sim.vA) * 0.25);
    } else this.flechaA.ocultar();
    if (Math.abs(this.sim.vB) > 0.05) {
      this.flechaB.apuntar(origenB, new THREE.Vector3(Math.sign(this.sim.vB), 0, 0), Math.abs(this.sim.vB) * 0.25);
    } else this.flechaB.ocultar();
  };

  ColisionEstacion.prototype.reiniciar = function () {
    this.aplicarParametros();
    this.corriendo = false;
    this.registrada = false;
    this.refrescarPantalla();
  };

  ColisionEstacion.prototype.correr = function () {
    this.reiniciar();
    this.corriendo = true;
  };

  ColisionEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo) {
      var sub = 6, h = dt / sub;
      for (var i = 0; i < sub; i++) this.sim.paso(h);
      this.colocar();
      if (this.sim.choco && !this.registrada) {
        this.registrada = true;
        this.registrarMedicion();
      }
      // Se detiene sola cuando los carros llegan a los extremos.
      if (this.sim.t > 12) this.corriendo = false;
    }
    this.refrescarPantalla();
  };

  ColisionEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    var perdida = this.sim.energiaInicial > 0
      ? (this.sim.energiaPerdida() / this.sim.energiaInicial * 100) : 0;
    this.pantalla.userData.dibujar([
      'CARRIL DE AIRE',
      'p total = ' + this.sim.momentoTotal().toFixed(3) + ' kg m/s',
      'K total = ' + this.sim.energiaCinetica().toFixed(3) + ' J',
      'energía perdida = ' + perdida.toFixed(1) + ' %',
      this.sim.choco ? 'choque realizado' : 'antes del choque'
    ]);
  };

  ColisionEstacion.prototype.lecturas = function () {
    var perdida = this.sim.energiaInicial > 0
      ? (this.sim.energiaPerdida() / this.sim.energiaInicial * 100) : 0;
    return [
      { etiqueta: 'Velocidad rojo', valor: this.sim.vA.toFixed(3), unidad: 'm/s' },
      { etiqueta: 'Velocidad azul', valor: this.sim.vB.toFixed(3), unidad: 'm/s' },
      { etiqueta: 'Momento total', valor: this.sim.momentoTotal().toFixed(4), unidad: 'kg m/s', destacado: true },
      { etiqueta: 'Momento inicial', valor: this.sim.momentoInicial.toFixed(4), unidad: 'kg m/s', teorico: true },
      { etiqueta: 'Energía cinética', valor: this.sim.energiaCinetica().toFixed(4), unidad: 'J' },
      { etiqueta: 'Energía inicial', valor: this.sim.energiaInicial.toFixed(4), unidad: 'J', teorico: true },
      { etiqueta: 'Energía perdida', valor: perdida.toFixed(1), unidad: 'por ciento', destacado: true }
    ];
  };

  ColisionEstacion.prototype.registrarMedicion = function () {
    var perdida = this.sim.energiaInicial > 0
      ? (this.sim.energiaPerdida() / this.sim.energiaInicial * 100) : 0;
    var fila = {
      corrida: this.historial.length + 1,
      masaA: p(this, 'masaA'),
      masaB: p(this, 'masaB'),
      velA: p(this, 'velA'),
      velB: p(this, 'velB'),
      rebote: p(this, 'rebote'),
      velAFinal: this.sim.vA,
      velBFinal: this.sim.vB,
      momentoAntes: this.sim.momentoInicial,
      momentoDespues: this.sim.momentoTotal(),
      energiaPerdidaPorciento: perdida
    };
    this.historial.push(fila);
    return fila;
  };

  ColisionEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'masaA', etiqueta: 'mA (kg)', decimales: 1 },
      { clave: 'masaB', etiqueta: 'mB (kg)', decimales: 1 },
      { clave: 'velA', etiqueta: 'vA inicial', decimales: 2 },
      { clave: 'velB', etiqueta: 'vB inicial', decimales: 2 },
      { clave: 'rebote', etiqueta: 'e', decimales: 2 },
      { clave: 'velAFinal', etiqueta: 'vA final', decimales: 3 },
      { clave: 'velBFinal', etiqueta: 'vB final', decimales: 3 },
      { clave: 'energiaPerdidaPorciento', etiqueta: 'K perdida (%)', decimales: 1 }
    ];
  };

  /* ================================================================== *
   * ESTACIÓN 5 - Galería de tiro parabólico
   * ================================================================== */

  function ProyectilEstacion() {
    this.id = 'proyectiles';
    this.numero = 5;
    this.titulo = 'Tiro parabólico';
    this.subtitulo = 'Galería de 30 metros';
    this.color = 0xff6b6b;
    this.posicion = { x: -16, z: 9.5 };
    this.puesto = { x: -18.6, z: 7.6 };
    // Se mira a lo largo de la galería, para ver la parábola completa
    // en vez de tener el cañón de frente tapando el recorrido.
    this.mirar = { x: -4, z: 9.5 };
    this.sinMesa = true;
    this.descripcion = 'El movimiento horizontal y el vertical son independientes. Ajusta el ' +
      'cañón y acierta en la diana: dos ángulos distintos llegan al mismo punto.';
    this.ecuaciones = ['x = v0 cos(A) t', 'y = h + v0 sen(A) t - g t^2 / 2', 'R = v0^2 sen(2A) / g'];

    this.parametros = [
      { id: 'rapidez', etiqueta: 'Rapidez de salida', unidad: 'm/s', tipo: 'rango', min: 4, max: 17, paso: 0.5, valor: 14 },
      { id: 'angulo', etiqueta: 'Ángulo del cañón', unidad: 'grados', tipo: 'rango', min: 5, max: 85, paso: 1, valor: 45 },
      { id: 'diana', etiqueta: 'Distancia de la diana', unidad: 'm', tipo: 'rango', min: 4, max: 30, paso: 0.5, valor: 20 },
      { id: 'arrastre', etiqueta: 'Resistencia del aire', tipo: 'opciones', valor: 0, opciones: [
        { valor: 0, etiqueta: 'Sin aire' }, { valor: 1, etiqueta: 'Con aire' }
      ] },
      { id: 'gravedad', etiqueta: 'Gravedad', unidad: 'm/s2', tipo: 'opciones', opciones: GRAVEDADES, valor: 9.81 }
    ];

    this.misiones = [
      {
        id: 'pr-1', tipo: 'prediccion',
        enunciado: 'Sin aire, calcula a qué distancia va a caer el proyectil con la rapidez y el ángulo que elegiste.',
        pista: 'El cañón está a 1.2 m de altura, así que el alcance es algo mayor que v0^2 sen(2A) / g.',
        entrada: { etiqueta: 'Alcance', unidad: 'm' },
        objetivo: function (e) {
          var sim = new F.Proyectil({
            rapidez: p(e, 'rapidez'), anguloGrados: p(e, 'angulo'),
            alturaInicial: 1.2, gravedad: p(e, 'gravedad')
          });
          return sim.alcanceTeorico();
        },
        tolerancia: 0.06,
        condicionPrevia: function (e) { return p(e, 'arrastre') === 0; },
        avisoPrevio: 'Apaga la resistencia del aire para poder usar la fórmula.'
      },
      {
        id: 'pr-2', tipo: 'reto',
        enunciado: 'Acierta en la diana con un error menor a medio metro.',
        pista: 'Sube o baja el ángulo de a un grado. Cerca de 45 grados el alcance cambia poco.',
        verificar: function (e) {
          var m = e.historial[e.historial.length - 1];
          if (!m) return { ok: false, mensaje: 'Dispara al menos una vez.' };
          return Math.abs(m.error) < 0.5
            ? { ok: true, mensaje: 'Impacto a ' + Math.abs(m.error).toFixed(2) + ' m del centro de la diana.' }
            : { ok: false, mensaje: 'Te quedaste a ' + Math.abs(m.error).toFixed(2) + ' m. ' + (m.error < 0 ? 'Te faltó alcance.' : 'Te pasaste.') };
        }
      },
      {
        id: 'pr-3', tipo: 'reto',
        enunciado: 'Encuentra dos ángulos distintos que den el mismo alcance con la misma rapidez. Son los ángulos complementarios.',
        pista: 'Si un ángulo A funciona, prueba con 90 menos A. Deben sumar 90 grados.',
        verificar: function (e) {
          var sinAire = e.historial.filter(function (m) { return m.aire === 'Sin aire'; });
          for (var i = sinAire.length - 1; i >= 0; i--) {
            for (var j = i - 1; j >= 0; j--) {
              var a = sinAire[i], b = sinAire[j];
              if (Math.abs(a.rapidez - b.rapidez) < 0.01 &&
                  Math.abs(a.angulo - b.angulo) > 4 &&
                  Math.abs(a.alcance - b.alcance) < 0.6) {
                return { ok: true, mensaje: 'A ' + b.angulo + ' y ' + a.angulo + ' grados el alcance es casi el mismo. Suman ' + (a.angulo + b.angulo) + ' grados.' };
              }
            }
          }
          return { ok: false, mensaje: 'Todavía no hay dos ángulos con el mismo alcance. Prueba 30 y 60 grados con la misma rapidez.' };
        }
      },
      {
        id: 'pr-4', tipo: 'prediccion',
        enunciado: '¿Qué ángulo da el alcance máximo cuando no hay aire y el cañón está casi a ras del piso?',
        pista: 'Piensa en dónde sen(2A) llega a su valor más grande.',
        entrada: { etiqueta: 'Ángulo óptimo', unidad: 'grados' },
        objetivo: function () { return 45; },
        tolerancia: 0.06,
        toleranciaAbsoluta: 2
      }
    ];

    this.corriendo = false;
    this.historial = [];
  }

  ProyectilEstacion.prototype.construir = function () {
    var g = new THREE.Group();

    // Trípode y cañón. El grupo del cañón gira según el ángulo.
    var tri = U.crearSoporte(1.1, { color: 0x6f7d92 });
    g.add(tri);

    this.canonPivote = new THREE.Group();
    this.canonPivote.position.set(0, 1.2, 0);
    g.add(this.canonPivote);

    var tubo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.13, 0.9, 18),
      new THREE.MeshStandardMaterial({ color: 0x59636f, roughness: 0.35, metalness: 0.9 })
    );
    tubo.rotation.z = -Math.PI / 2;
    tubo.position.x = 0.45;
    tubo.castShadow = true;
    this.canonPivote.add(tubo);

    var boca = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.025, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.4, metalness: 0.6 })
    );
    boca.rotation.y = Math.PI / 2;
    boca.position.x = 0.9;
    this.canonPivote.add(boca);

    // Transportador del cañón.
    var arco = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.62, 40, 1, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x4fd6e3, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    arco.position.set(0, 1.2, 0.2);
    g.add(arco);
    this.rotuloAngulo = U.rotulo('45 grados', { escala: 0.8 });
    this.rotuloAngulo.position.set(0.3, 2.1, 0.2);
    g.add(this.rotuloAngulo);

    // Proyectil.
    this.bala = U.crearCuerpo(0.09, 0xff6b6b, { emissiveIntensity: 0.4 });
    this.bala.visible = false;
    g.add(this.bala);

    // Traza de la trayectoria y traza fantasma del disparo anterior.
    this.traza = new U.Traza(0xff6b6b, 3000);
    g.add(this.traza.linea);
    this.trazaPrevia = new U.Traza(0x6f7d92, 3000, { opacidad: 0.35 });
    g.add(this.trazaPrevia.linea);

    // Regla en el piso a lo largo de la galería.
    var regla = U.crearRegla(30, 1, 'x', 0x8fa3bd, { escalaTexto: 0.6 });
    regla.position.set(0, 0.02, 0.6);
    g.add(regla);

    // Diana movible.
    this.diana = new THREE.Group();
    var anillos = [[0.5, 0xff6b6b], [0.35, 0xf2ead6], [0.2, 0xff6b6b], [0.08, 0xffb347]];
    anillos.forEach(function (a, i) {
      var m = new THREE.Mesh(
        new THREE.CircleGeometry(a[0], 32),
        new THREE.MeshStandardMaterial({ color: a[1], roughness: 0.8, side: THREE.DoubleSide })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.03 + i * 0.002;
      this.diana.add(m);
    }, this);
    var poste = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x8a94a6, metalness: 0.8, roughness: 0.4 })
    );
    poste.position.y = 0.7;
    this.diana.add(poste);
    this.banderin = U.rotulo('20.0 m', { escala: 0.8, color: '#4fd6e3' });
    this.banderin.position.y = 1.6;
    this.diana.add(this.banderin);
    g.add(this.diana);

    this.pantalla = U.crearPantalla(1.3, 0.85);
    this.pantalla.position.set(-1.5, 1.6, 0.5);
    this.pantalla.rotation.y = -1.1;
    g.add(this.pantalla);
    var sop = U.crearSoporte(1.2, { color: 0x6f7d92 });
    sop.position.set(-1.5, 0, 0.5);
    g.add(sop);

    this.grupo = g;
    this.reiniciar();
    return g;
  };

  ProyectilEstacion.prototype.aplicarParametros = function () {
    var conAire = p(this, 'arrastre') === 1;
    this.sim = new F.Proyectil({
      rapidez: p(this, 'rapidez'),
      anguloGrados: p(this, 'angulo'),
      alturaInicial: 1.2,
      masa: 0.25,
      radio: 0.09,
      coefArrastre: conAire ? 0.47 : 0,
      gravedad: p(this, 'gravedad')
    });
    var th = p(this, 'angulo') * Math.PI / 180;
    if (this.canonPivote) this.canonPivote.rotation.z = th;
    if (this.rotuloAngulo) this.rotuloAngulo.userData.actualizarTexto(p(this, 'angulo').toFixed(0) + ' grados');
    if (this.diana) {
      this.diana.position.x = p(this, 'diana');
      this.banderin.userData.actualizarTexto(p(this, 'diana').toFixed(1) + ' m');
    }
  };

  ProyectilEstacion.prototype.reiniciar = function () {
    this.aplicarParametros();
    this.corriendo = false;
    if (this.bala) this.bala.visible = false;
    if (this.traza) {
      // Guarda el disparo anterior como referencia tenue.
      if (this.traza.conteo > 2 && this.trazaPrevia) {
        this.trazaPrevia.limpiar();
        for (var i = 0; i < this.traza.conteo; i++) {
          this.trazaPrevia.agregar(
            this.traza.posiciones[i * 3],
            this.traza.posiciones[i * 3 + 1],
            this.traza.posiciones[i * 3 + 2]
          );
        }
      }
      this.traza.limpiar();
    }
    this.refrescarPantalla();
  };

  ProyectilEstacion.prototype.correr = function () {
    this.reiniciar();
    this.corriendo = true;
    this.bala.visible = true;
  };

  ProyectilEstacion.prototype.actualizar = function (dt) {
    if (this.corriendo && this.sim.enVuelo) {
      var sub = 8, h = dt / sub;
      for (var i = 0; i < sub && this.sim.enVuelo; i++) {
        this.sim.paso(h);
        var pos = this.sim.posicion();
        this.traza.agregar(pos[0], pos[1], pos[2]);
      }
      var q = this.sim.posicion();
      this.bala.position.set(q[0], q[1], q[2]);
      if (!this.sim.enVuelo) {
        this.corriendo = false;
        this.registrarMedicion();
      }
    }
    this.refrescarPantalla();
  };

  ProyectilEstacion.prototype.refrescarPantalla = function () {
    if (!this.pantalla) return;
    var q = this.sim.posicion();
    this.pantalla.userData.dibujar([
      'TIRO PARABÓLICO',
      'x = ' + q[0].toFixed(2) + ' m',
      'y = ' + q[1].toFixed(2) + ' m',
      't = ' + this.sim.t.toFixed(2) + ' s',
      'diana en ' + p(this, 'diana').toFixed(1) + ' m'
    ]);
  };

  ProyectilEstacion.prototype.lecturas = function () {
    var q = this.sim.posicion();
    var out = [
      { etiqueta: 'Posición horizontal', valor: q[0].toFixed(2), unidad: 'm' },
      { etiqueta: 'Altura', valor: q[1].toFixed(2), unidad: 'm' },
      { etiqueta: 'Tiempo de vuelo', valor: this.sim.t.toFixed(2), unidad: 's' },
      { etiqueta: 'Altura máxima', valor: this.sim.alturaMaxima.toFixed(2), unidad: 'm', destacado: true },
      { etiqueta: 'Alcance teórico sin aire', valor: this.sim.alcanceTeorico().toFixed(2), unidad: 'm', teorico: true },
      { etiqueta: 'Altura máxima teórica', valor: this.sim.alturaMaximaTeorica().toFixed(2), unidad: 'm', teorico: true },
      { etiqueta: 'Tiempo de vuelo teórico', valor: this.sim.tiempoVueloTeorico().toFixed(2), unidad: 's', teorico: true }
    ];
    if (!this.sim.enVuelo && this.sim.t > 0) {
      out.push({ etiqueta: 'Alcance medido', valor: q[0].toFixed(2), unidad: 'm', destacado: true });
      out.push({ etiqueta: 'Error respecto a la diana', valor: (q[0] - p(this, 'diana')).toFixed(2), unidad: 'm', destacado: true });
    }
    return out;
  };

  ProyectilEstacion.prototype.registrarMedicion = function () {
    var alcance = this.sim.posicion()[0];
    var fila = {
      corrida: this.historial.length + 1,
      rapidez: p(this, 'rapidez'),
      angulo: p(this, 'angulo'),
      aire: p(this, 'arrastre') === 1 ? 'Con aire' : 'Sin aire',
      gravedad: p(this, 'gravedad'),
      alcance: alcance,
      alcanceTeorico: this.sim.alcanceTeorico(),
      alturaMaxima: this.sim.alturaMaxima,
      tiempoVuelo: this.sim.t,
      diana: p(this, 'diana'),
      error: alcance - p(this, 'diana')
    };
    this.historial.push(fila);
    return fila;
  };

  ProyectilEstacion.prototype.columnas = function () {
    return [
      { clave: 'corrida', etiqueta: 'N' },
      { clave: 'rapidez', etiqueta: 'v0 (m/s)', decimales: 1 },
      { clave: 'angulo', etiqueta: 'Ángulo (gr)', decimales: 0 },
      { clave: 'aire', etiqueta: 'Aire' },
      { clave: 'alcance', etiqueta: 'Alcance (m)', decimales: 2 },
      { clave: 'alcanceTeorico', etiqueta: 'Alcance teórico (m)', decimales: 2 },
      { clave: 'alturaMaxima', etiqueta: 'h max (m)', decimales: 2 },
      { clave: 'tiempoVuelo', etiqueta: 't vuelo (s)', decimales: 2 },
      { clave: 'error', etiqueta: 'Error a diana (m)', decimales: 2 }
    ];
  };

  global.EstacionesMecanica = [
    CaidaLibreEstacion,
    PlanoEstacion,
    PenduloEstacion,
    ColisionEstacion,
    ProyectilEstacion
  ];
})(window);
