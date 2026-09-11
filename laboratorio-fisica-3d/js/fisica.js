/*
 * Laboratorio de Fisica 3D - Nucleo numerico
 *
 * Este archivo no toca el DOM ni Three.js: solo resuelve fisica.
 * Todo se integra con Runge-Kutta de cuarto orden (RK4) sobre el vector
 * de estado de cada sistema, para que los resultados aguanten pasos de
 * tiempo grandes sin desviarse del valor analitico.
 *
 * Unidades del sistema internacional en todo el archivo:
 *   longitud m, masa kg, tiempo s, carga C, campo magnetico T.
 */
(function (global) {
  'use strict';

  var G = 9.80665;          // gravedad estandar, m/s^2
  var K_COULOMB = 8.9875517923e9; // constante de Coulomb, N m^2 / C^2
  var RHO_AIRE = 1.225;     // densidad del aire a nivel del mar, kg/m^3

  /* ------------------------------------------------------------------ *
   * Utilidades de vectores (arreglos planos de 3 numeros)
   * ------------------------------------------------------------------ */

  function v3(x, y, z) { return [x || 0, y || 0, z || 0]; }
  function suma(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function resta(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function escala(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function producto(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cruz(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
  function norma(a) { return Math.sqrt(producto(a, a)); }
  function normaliza(a) {
    var n = norma(a);
    return n < 1e-12 ? v3(0, 0, 0) : escala(a, 1 / n);
  }

  /* ------------------------------------------------------------------ *
   * Integrador RK4 generico
   *
   * estado: arreglo de numeros de cualquier largo
   * derivada(t, estado) -> arreglo del mismo largo
   * ------------------------------------------------------------------ */

  function rk4(derivada, t, estado, dt) {
    var n = estado.length;
    var k1 = derivada(t, estado);
    var tmp = new Array(n);
    var i;

    for (i = 0; i < n; i++) tmp[i] = estado[i] + k1[i] * dt / 2;
    var k2 = derivada(t + dt / 2, tmp);

    for (i = 0; i < n; i++) tmp[i] = estado[i] + k2[i] * dt / 2;
    var k3 = derivada(t + dt / 2, tmp);

    for (i = 0; i < n; i++) tmp[i] = estado[i] + k3[i] * dt;
    var k4 = derivada(t + dt, tmp);

    var salida = new Array(n);
    for (i = 0; i < n; i++) {
      salida[i] = estado[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }
    return salida;
  }

  /* ------------------------------------------------------------------ *
   * Arrastre del aire
   *
   * Fuerza cuadratica: F = -0.5 * rho * Cd * A * |v| * v
   * Devuelve la aceleracion que produce sobre una masa m.
   * ------------------------------------------------------------------ */

  function aceleracionArrastre(velocidad, masa, coefArrastre, area) {
    if (!coefArrastre || !area || masa <= 0) return v3(0, 0, 0);
    var rapidez = norma(velocidad);
    if (rapidez < 1e-9) return v3(0, 0, 0);
    var magnitud = 0.5 * RHO_AIRE * coefArrastre * area * rapidez * rapidez;
    return escala(normaliza(velocidad), -magnitud / masa);
  }

  /* ================================================================== *
   * 1. CAIDA LIBRE
   *
   * Estado: [y, vy]. El eje y apunta hacia arriba.
   * ================================================================== */

  function CaidaLibre(opciones) {
    var o = opciones || {};
    this.altura = o.altura != null ? o.altura : 20;
    this.masa = o.masa != null ? o.masa : 1;
    this.gravedad = o.gravedad != null ? o.gravedad : G;
    this.coefArrastre = o.coefArrastre || 0;
    this.area = o.area || 0;
    this.reiniciar();
  }

  CaidaLibre.prototype.reiniciar = function () {
    this.t = 0;
    this.estado = [this.altura, 0];
    this.enSuelo = false;
    return this;
  };

  CaidaLibre.prototype.derivada = function (t, s) {
    var vy = s[1];
    var a = -this.gravedad;
    if (this.coefArrastre && this.area) {
      a += aceleracionArrastre(v3(0, vy, 0), this.masa, this.coefArrastre, this.area)[1];
    }
    return [vy, a];
  };

  CaidaLibre.prototype.paso = function (dt) {
    if (this.enSuelo) return this;
    var self = this;
    this.estado = rk4(function (t, s) { return self.derivada(t, s); }, this.t, this.estado, dt);
    this.t += dt;
    if (this.estado[0] <= 0) {
      // Retrocede al instante exacto del impacto interpolando linealmente.
      this.estado[0] = 0;
      this.enSuelo = true;
    }
    return this;
  };

  CaidaLibre.prototype.posicion = function () { return this.estado[0]; };
  CaidaLibre.prototype.velocidad = function () { return this.estado[1]; };

  // Solucion analitica sin arrastre, util para que el estudiante compare.
  CaidaLibre.prototype.tiempoTeorico = function () {
    return Math.sqrt(2 * this.altura / this.gravedad);
  };
  CaidaLibre.prototype.velocidadImpactoTeorica = function () {
    return Math.sqrt(2 * this.gravedad * this.altura);
  };

  /* ================================================================== *
   * 2. PLANO INCLINADO
   *
   * Estado: [s, vs] medido a lo largo del plano, positivo hacia abajo.
   * Incluye friccion estatica y cinetica.
   * ================================================================== */

  function PlanoInclinado(opciones) {
    var o = opciones || {};
    this.anguloGrados = o.anguloGrados != null ? o.anguloGrados : 30;
    this.masa = o.masa != null ? o.masa : 2;
    this.muCinetico = o.muCinetico != null ? o.muCinetico : 0.2;
    this.muEstatico = o.muEstatico != null ? o.muEstatico : 0.3;
    this.largo = o.largo != null ? o.largo : 4;
    this.gravedad = o.gravedad != null ? o.gravedad : G;
    this.reiniciar();
  }

  PlanoInclinado.prototype.reiniciar = function () {
    this.t = 0;
    this.estado = [0, 0];
    this.detenido = false;
    return this;
  };

  PlanoInclinado.prototype.angulo = function () {
    return this.anguloGrados * Math.PI / 180;
  };

  // Aceleracion a lo largo del plano. Positiva significa deslizar hacia abajo.
  PlanoInclinado.prototype.aceleracion = function (velocidad) {
    var th = this.angulo();
    var aMotriz = this.gravedad * Math.sin(th);
    var aFriccionMax = this.gravedad * Math.cos(th) * this.muCinetico;

    if (Math.abs(velocidad) < 1e-6) {
      // Todavia en reposo: decide si la friccion estatica lo sostiene.
      var limiteEstatico = this.gravedad * Math.cos(th) * this.muEstatico;
      if (aMotriz <= limiteEstatico) return 0;
      return aMotriz - aFriccionMax;
    }
    // En movimiento: la friccion cinetica siempre se opone a la velocidad.
    return aMotriz - Math.sign(velocidad) * aFriccionMax;
  };

  PlanoInclinado.prototype.paso = function (dt) {
    if (this.detenido) return this;
    var self = this;
    var previo = this.estado[1];
    this.estado = rk4(function (t, s) {
      return [s[1], self.aceleracion(s[1])];
    }, this.t, this.estado, dt);
    this.t += dt;

    // Si la friccion frena el bloque, no se deja invertir el movimiento.
    if (previo > 0 && this.estado[1] < 0) {
      this.estado[1] = 0;
      this.detenido = true;
    }
    if (this.estado[0] >= this.largo) {
      this.estado[0] = this.largo;
      this.detenido = true;
    }
    return this;
  };

  PlanoInclinado.prototype.distancia = function () { return this.estado[0]; };
  PlanoInclinado.prototype.velocidad = function () { return this.estado[1]; };
  PlanoInclinado.prototype.desliza = function () {
    return Math.tan(this.angulo()) > this.muEstatico;
  };
  PlanoInclinado.prototype.anguloCriticoGrados = function () {
    return Math.atan(this.muEstatico) * 180 / Math.PI;
  };

  /* ================================================================== *
   * 3. PROYECTIL
   *
   * Estado: [x, y, z, vx, vy, vz]. Lanza en el plano x-y con desviacion
   * opcional en z para que el tiro se vea en el espacio del salon.
   * ================================================================== */

  function Proyectil(opciones) {
    var o = opciones || {};
    this.rapidez = o.rapidez != null ? o.rapidez : 20;
    this.anguloGrados = o.anguloGrados != null ? o.anguloGrados : 45;
    this.alturaInicial = o.alturaInicial != null ? o.alturaInicial : 1.2;
    this.masa = o.masa != null ? o.masa : 0.2;
    this.gravedad = o.gravedad != null ? o.gravedad : G;
    this.coefArrastre = o.coefArrastre || 0;
    this.radio = o.radio != null ? o.radio : 0.05;
    this.reiniciar();
  }

  Proyectil.prototype.area = function () {
    return Math.PI * this.radio * this.radio;
  };

  Proyectil.prototype.reiniciar = function () {
    var th = this.anguloGrados * Math.PI / 180;
    this.t = 0;
    this.estado = [
      0, this.alturaInicial, 0,
      this.rapidez * Math.cos(th), this.rapidez * Math.sin(th), 0
    ];
    this.enVuelo = true;
    this.alturaMaxima = this.alturaInicial;
    this.trayectoria = [[0, this.alturaInicial, 0]];
    return this;
  };

  Proyectil.prototype.paso = function (dt) {
    if (!this.enVuelo) return this;
    var self = this;
    this.estado = rk4(function (t, s) {
      var vel = v3(s[3], s[4], s[5]);
      var a = v3(0, -self.gravedad, 0);
      if (self.coefArrastre) {
        a = suma(a, aceleracionArrastre(vel, self.masa, self.coefArrastre, self.area()));
      }
      return [vel[0], vel[1], vel[2], a[0], a[1], a[2]];
    }, this.t, this.estado, dt);
    this.t += dt;

    if (this.estado[1] > this.alturaMaxima) this.alturaMaxima = this.estado[1];
    this.trayectoria.push([this.estado[0], this.estado[1], this.estado[2]]);

    if (this.estado[1] <= 0) {
      this.estado[1] = 0;
      this.enVuelo = false;
    }
    return this;
  };

  Proyectil.prototype.posicion = function () {
    return v3(this.estado[0], this.estado[1], this.estado[2]);
  };
  Proyectil.prototype.velocidad = function () {
    return v3(this.estado[3], this.estado[4], this.estado[5]);
  };

  // Valores analiticos en el vacio, para contrastar con el resultado medido.
  Proyectil.prototype.alcanceTeorico = function () {
    var th = this.anguloGrados * Math.PI / 180;
    var v = this.rapidez;
    var g = this.gravedad;
    var h = this.alturaInicial;
    var vy = v * Math.sin(th);
    var t = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
    return v * Math.cos(th) * t;
  };
  Proyectil.prototype.alturaMaximaTeorica = function () {
    var th = this.anguloGrados * Math.PI / 180;
    var vy = this.rapidez * Math.sin(th);
    return this.alturaInicial + vy * vy / (2 * this.gravedad);
  };
  Proyectil.prototype.tiempoVueloTeorico = function () {
    var th = this.anguloGrados * Math.PI / 180;
    var vy = this.rapidez * Math.sin(th);
    return (vy + Math.sqrt(vy * vy + 2 * this.gravedad * this.alturaInicial)) / this.gravedad;
  };

  /* ================================================================== *
   * 4. COLISION EN UNA DIMENSION
   *
   * Dos carros en un carril sin friccion. El coeficiente de restitucion e
   * va de 0 (perfectamente inelastica) a 1 (perfectamente elastica).
   * ================================================================== */

  function Colision(opciones) {
    var o = opciones || {};
    this.masaA = o.masaA != null ? o.masaA : 1;
    this.masaB = o.masaB != null ? o.masaB : 1;
    this.velocidadA = o.velocidadA != null ? o.velocidadA : 3;
    this.velocidadB = o.velocidadB != null ? o.velocidadB : 0;
    this.restitucion = o.restitucion != null ? o.restitucion : 1;
    this.posicionA = o.posicionA != null ? o.posicionA : -2;
    this.posicionB = o.posicionB != null ? o.posicionB : 2;
    this.anchoCarro = o.anchoCarro != null ? o.anchoCarro : 0.4;
    this.largoCarril = o.largoCarril != null ? o.largoCarril : 6;
    this.reiniciar();
  }

  Colision.prototype.reiniciar = function () {
    this.t = 0;
    this.xA = this.posicionA;
    this.xB = this.posicionB;
    this.vA = this.velocidadA;
    this.vB = this.velocidadB;
    this.choco = false;
    this.energiaInicial = this.energiaCinetica();
    this.momentoInicial = this.momentoTotal();
    return this;
  };

  Colision.prototype.momentoTotal = function () {
    return this.masaA * this.vA + this.masaB * this.vB;
  };
  Colision.prototype.energiaCinetica = function () {
    return 0.5 * this.masaA * this.vA * this.vA + 0.5 * this.masaB * this.vB * this.vB;
  };

  // Resolucion exacta del choque a partir de conservacion del momento
  // y de la definicion del coeficiente de restitucion.
  Colision.prototype.resolverChoque = function () {
    var mA = this.masaA, mB = this.masaB, e = this.restitucion;
    var uA = this.vA, uB = this.vB;
    var total = mA + mB;
    this.vA = (mA * uA + mB * uB + mB * e * (uB - uA)) / total;
    this.vB = (mA * uA + mB * uB + mA * e * (uA - uB)) / total;
    this.choco = true;
  };

  Colision.prototype.paso = function (dt) {
    this.xA += this.vA * dt;
    this.xB += this.vB * dt;
    this.t += dt;

    var separacion = this.xB - this.xA;
    if (!this.choco && separacion <= this.anchoCarro && this.vA > this.vB) {
      // Coloca los carros justo en contacto antes de resolver.
      var solape = this.anchoCarro - separacion;
      this.xA -= solape / 2;
      this.xB += solape / 2;
      this.resolverChoque();
    }

    var limite = this.largoCarril / 2;
    if (this.xA < -limite) { this.xA = -limite; this.vA = Math.abs(this.vA); }
    if (this.xB > limite) { this.xB = limite; this.vB = -Math.abs(this.vB); }
    return this;
  };

  Colision.prototype.energiaPerdida = function () {
    return this.energiaInicial - this.energiaCinetica();
  };

  /* ================================================================== *
   * 5. PENDULO SIMPLE
   *
   * Estado: [theta, omega]. Se resuelve la ecuacion completa
   *   theta'' = -(g/L) sen(theta) - b * theta'
   * sin aproximar sen(theta) por theta, para que el estudiante vea
   * donde se rompe la formula del periodo que aparece en el libro.
   * ================================================================== */

  function Pendulo(opciones) {
    var o = opciones || {};
    this.largo = o.largo != null ? o.largo : 1.5;
    this.masa = o.masa != null ? o.masa : 0.5;
    this.anguloInicialGrados = o.anguloInicialGrados != null ? o.anguloInicialGrados : 20;
    this.amortiguamiento = o.amortiguamiento != null ? o.amortiguamiento : 0;
    this.gravedad = o.gravedad != null ? o.gravedad : G;
    this.reiniciar();
  }

  Pendulo.prototype.reiniciar = function () {
    this.t = 0;
    this.estado = [this.anguloInicialGrados * Math.PI / 180, 0];
    this.ciclos = 0;
    this.signoPrevio = Math.sign(this.estado[0]);
    this.tiempoUltimoCruce = null;
    this.periodoMedido = null;
    return this;
  };

  Pendulo.prototype.paso = function (dt) {
    var self = this;
    this.estado = rk4(function (t, s) {
      return [
        s[1],
        -(self.gravedad / self.largo) * Math.sin(s[0]) - self.amortiguamiento * s[1]
      ];
    }, this.t, this.estado, dt);
    this.t += dt;

    // Mide el periodo real contando cruces por el punto mas bajo.
    var signo = Math.sign(this.estado[0]);
    if (signo !== 0 && this.signoPrevio !== 0 && signo !== this.signoPrevio) {
      if (this.tiempoUltimoCruce != null) {
        this.periodoMedido = 2 * (this.t - this.tiempoUltimoCruce);
        this.ciclos += 0.5;
      }
      this.tiempoUltimoCruce = this.t;
    }
    if (signo !== 0) this.signoPrevio = signo;
    return this;
  };

  Pendulo.prototype.angulo = function () { return this.estado[0]; };
  Pendulo.prototype.velocidadAngular = function () { return this.estado[1]; };

  // Periodo de la aproximacion de angulo pequeno que ensena el libro.
  Pendulo.prototype.periodoPequeno = function () {
    return 2 * Math.PI * Math.sqrt(this.largo / this.gravedad);
  };
  // Correccion de segundo orden, mas cercana al periodo real.
  Pendulo.prototype.periodoCorregido = function () {
    var th0 = this.anguloInicialGrados * Math.PI / 180;
    var s = Math.sin(th0 / 2);
    return this.periodoPequeno() * (1 + s * s / 4 + 9 * Math.pow(s, 4) / 64);
  };
  Pendulo.prototype.posicionMasa = function () {
    var th = this.estado[0];
    return v3(this.largo * Math.sin(th), -this.largo * Math.cos(th), 0);
  };
  Pendulo.prototype.energiaTotal = function () {
    var th = this.estado[0], w = this.estado[1];
    var cinetica = 0.5 * this.masa * Math.pow(this.largo * w, 2);
    var potencial = this.masa * this.gravedad * this.largo * (1 - Math.cos(th));
    return cinetica + potencial;
  };

  /* ================================================================== *
   * 6. CAMPO ELECTRICO DE CARGAS PUNTUALES
   *
   * Las cargas se dan en nanocoulombs para que los numeros sean legibles
   * en pantalla, y se convierten internamente.
   * ================================================================== */

  function CampoElectrico(opciones) {
    var o = opciones || {};
    this.cargas = o.cargas || [];  // { posicion: [x,y,z], carga_nC: numero }
    this.reiniciar();
  }

  CampoElectrico.prototype.reiniciar = function () {
    this.t = 0;
    return this;
  };

  CampoElectrico.prototype.agregarCarga = function (posicion, cargaNC) {
    this.cargas.push({ posicion: posicion.slice(), carga_nC: cargaNC });
    return this;
  };

  // Campo E en un punto, en N/C. Suma vectorial de Coulomb.
  CampoElectrico.prototype.campoEn = function (punto) {
    var total = v3(0, 0, 0);
    for (var i = 0; i < this.cargas.length; i++) {
      var c = this.cargas[i];
      var r = resta(punto, c.posicion);
      var d = norma(r);
      if (d < 0.08) continue;  // evita la singularidad dentro de la esfera
      var magnitud = K_COULOMB * (c.carga_nC * 1e-9) / (d * d);
      total = suma(total, escala(normaliza(r), magnitud));
    }
    return total;
  };

  // Potencial V en un punto, en voltios.
  CampoElectrico.prototype.potencialEn = function (punto) {
    var total = 0;
    for (var i = 0; i < this.cargas.length; i++) {
      var c = this.cargas[i];
      var d = norma(resta(punto, c.posicion));
      if (d < 0.08) continue;
      total += K_COULOMB * (c.carga_nC * 1e-9) / d;
    }
    return total;
  };

  // Traza una linea de campo siguiendo la direccion de E paso a paso.
  CampoElectrico.prototype.lineaDeCampo = function (inicio, opciones) {
    var o = opciones || {};
    var paso = o.paso || 0.06;
    var maxPuntos = o.maxPuntos || 420;
    var sentido = o.sentido || 1;   // 1 sale de positiva, -1 entra a negativa
    var limite = o.limite || 6;
    // La linea se corta al salir de una esfera alrededor del montaje. Sin
    // un centro propio se mediria desde el origen, que suele estar en el piso.
    var centro = o.centro || [0, 0, 0];
    var puntos = [inicio.slice()];
    var p = inicio.slice();

    for (var i = 0; i < maxPuntos; i++) {
      var e = this.campoEn(p);
      if (norma(e) < 1e-3) break;
      p = suma(p, escala(normaliza(e), paso * sentido));
      puntos.push(p.slice());
      if (norma(resta(p, centro)) > limite) break;
      // Se detiene si llego al centro de otra carga.
      var choco = false;
      for (var j = 0; j < this.cargas.length; j++) {
        if (norma(resta(p, this.cargas[j].posicion)) < 0.12) { choco = true; break; }
      }
      if (choco) break;
    }
    return puntos;
  };

  // Fuerza sobre una carga de prueba, en newtons.
  CampoElectrico.prototype.fuerzaSobre = function (punto, cargaNC) {
    return escala(this.campoEn(punto), cargaNC * 1e-9);
  };

  /* ================================================================== *
   * 7. FUERZA DE LORENTZ
   *
   * Estado: [x, y, z, vx, vy, vz]
   *   F = q (E + v x B),  a = F / m
   * Con E nulo y B constante la trayectoria es una helice de radio
   * r = m v_perp / (q B).
   * ================================================================== */

  function Lorentz(opciones) {
    var o = opciones || {};
    this.masa = o.masa != null ? o.masa : 1e-6;      // kg
    this.carga = o.carga != null ? o.carga : 1e-6;   // C
    this.campoB = o.campoB || v3(0, 0.5, 0);         // T
    this.campoE = o.campoE || v3(0, 0, 0);           // N/C
    this.posicionInicial = o.posicionInicial || v3(0, 0, 0);
    this.velocidadInicial = o.velocidadInicial || v3(2, 0.4, 0);
    this.reiniciar();
  }

  Lorentz.prototype.reiniciar = function () {
    this.t = 0;
    var p = this.posicionInicial, v = this.velocidadInicial;
    this.estado = [p[0], p[1], p[2], v[0], v[1], v[2]];
    this.traza = [p.slice()];
    return this;
  };

  Lorentz.prototype.paso = function (dt) {
    var self = this;
    this.estado = rk4(function (t, s) {
      var vel = v3(s[3], s[4], s[5]);
      var fuerza = escala(suma(self.campoE, cruz(vel, self.campoB)), self.carga);
      var a = escala(fuerza, 1 / self.masa);
      return [vel[0], vel[1], vel[2], a[0], a[1], a[2]];
    }, this.t, this.estado, dt);
    this.t += dt;
    this.traza.push([this.estado[0], this.estado[1], this.estado[2]]);
    if (this.traza.length > 2000) this.traza.shift();
    return this;
  };

  Lorentz.prototype.posicion = function () {
    return v3(this.estado[0], this.estado[1], this.estado[2]);
  };
  Lorentz.prototype.velocidad = function () {
    return v3(this.estado[3], this.estado[4], this.estado[5]);
  };

  // Radio de giro esperado, solo la componente perpendicular a B cuenta.
  Lorentz.prototype.radioTeorico = function () {
    var b = norma(this.campoB);
    if (b < 1e-12 || Math.abs(this.carga) < 1e-18) return Infinity;
    var v = this.velocidadInicial;
    var bHat = normaliza(this.campoB);
    var vParalela = escala(bHat, producto(v, bHat));
    var vPerp = norma(resta(v, vParalela));
    return this.masa * vPerp / (Math.abs(this.carga) * b);
  };
  // Periodo ciclotronico: no depende de la rapidez.
  Lorentz.prototype.periodoCiclotron = function () {
    var b = norma(this.campoB);
    if (b < 1e-12 || Math.abs(this.carga) < 1e-18) return Infinity;
    return 2 * Math.PI * this.masa / (Math.abs(this.carga) * b);
  };
  // Avance de la helice en cada vuelta completa.
  Lorentz.prototype.pasoHelice = function () {
    var bHat = normaliza(this.campoB);
    var vParalela = producto(this.velocidadInicial, bHat);
    return Math.abs(vParalela) * this.periodoCiclotron();
  };

  /* ------------------------------------------------------------------ *
   * Exportacion
   * ------------------------------------------------------------------ */

  global.Fisica = {
    G: G,
    K_COULOMB: K_COULOMB,
    RHO_AIRE: RHO_AIRE,
    v3: v3,
    suma: suma,
    resta: resta,
    escala: escala,
    producto: producto,
    cruz: cruz,
    norma: norma,
    normaliza: normaliza,
    rk4: rk4,
    aceleracionArrastre: aceleracionArrastre,
    CaidaLibre: CaidaLibre,
    PlanoInclinado: PlanoInclinado,
    Proyectil: Proyectil,
    Colision: Colision,
    Pendulo: Pendulo,
    CampoElectrico: CampoElectrico,
    Lorentz: Lorentz
  };
})(typeof window !== 'undefined' ? window : globalThis);
