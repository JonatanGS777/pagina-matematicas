/*
 * MathMasters | Arena 2D (Órbita cero)
 *
 * Dibuja el espacio profundo, el planeta núcleo, los cometas enemigos, los
 * disparos y las partículas. No sabe nada de matemáticas: el juego le pide
 * crear enemigos, fijar uno como objetivo y dispararle, y la arena avisa
 * cuando un enemigo llega al núcleo.
 */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;
  var COLORES = {
    ambar: '#ffb020', coral: '#ff5a5f', hielo: '#7fd9ff', texto: '#e9ecf5',
    nucleo: '#ffcf6b', jefe: '#ff3d7f'
  };

  function Arena(canvas) {
    this.canvas = canvas;
    this.g = canvas.getContext('2d');
    this.enemigos = [];
    this.disparos = [];
    this.particulas = [];
    this.textos = [];
    this.estrellas = [];
    this.objetivo = null;
    this.congelado = false;
    this.escudo = false;
    this.sacudida = 0;
    this.destello = 0;
    this.reducirMovimiento = false;
    this.pausado = false;
    this.tiempo = 0;
    this.alLlegar = null;
    this.nebulosa = null;
    this.redimensionar();
    var self = this;
    global.addEventListener('resize', function () { self.redimensionar(); });
  }

  Arena.prototype.redimensionar = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = global.innerWidth, h = global.innerHeight;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    // El núcleo queda un poco arriba del centro para dejar sitio a la consola.
    this.cx = w / 2;
    this.cy = h * (w < 700 ? 0.36 : 0.42);
    this.radioNucleo = Math.max(26, Math.min(w, h) * 0.055);
    this.radioOrbita = Math.max(w, h) * 0.62;
    this.crearEstrellas();
    this.crearNebulosa();
  };

  Arena.prototype.crearEstrellas = function () {
    this.estrellas = [];
    var n = Math.round(this.w * this.h / 2600);
    for (var i = 0; i < n; i++) {
      this.estrellas.push({
        x: Math.random() * this.w, y: Math.random() * this.h,
        capa: Math.random() < 0.7 ? 0 : (Math.random() < 0.7 ? 1 : 2),
        brillo: Math.random() * TAU
      });
    }
  };

  // La nebulosa se pinta una sola vez en un canvas aparte.
  Arena.prototype.crearNebulosa = function () {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(this.w / 2));
    c.height = Math.max(1, Math.round(this.h / 2));
    var g = c.getContext('2d');
    var manchas = [
      [0.18, 0.2, 0.55, 'rgba(255,90,95,0.10)'],
      [0.85, 0.15, 0.5, 'rgba(255,176,32,0.08)'],
      [0.7, 0.85, 0.65, 'rgba(90,110,255,0.10)'],
      [0.3, 0.75, 0.45, 'rgba(127,217,255,0.06)']
    ];
    manchas.forEach(function (m) {
      var r = m[2] * Math.max(c.width, c.height);
      var grad = g.createRadialGradient(m[0] * c.width, m[1] * c.height, 0, m[0] * c.width, m[1] * c.height, r);
      grad.addColorStop(0, m[3]);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, c.width, c.height);
    });
    this.nebulosa = c;
  };

  /* ------------------------------------------------------------------ *
   * Enemigos
   * ------------------------------------------------------------------ */

  // duracion: segundos que tarda en llegar al núcleo sin congelamiento.
  Arena.prototype.crearEnemigo = function (opciones) {
    var o = opciones || {};
    var angulo = o.angulo != null ? o.angulo : Math.random() * TAU;
    var e = {
      jefe: !!o.jefe,
      angulo: angulo,
      giro: (Math.random() < 0.5 ? -1 : 1) * (o.jefe ? 0.12 : 0.35),
      progreso: 0,
      duracion: o.duracion || 20,
      radio: o.jefe ? 34 : 13 + Math.random() * 5,
      fases: o.fases || 0,
      fasesRotas: 0,
      color: o.jefe ? COLORES.jefe : (Math.random() < 0.5 ? COLORES.coral : COLORES.ambar),
      rastro: [],
      vivo: true,
      aparicion: 0,
      etiqueta: o.etiqueta || ''
    };
    this.enemigos.push(e);
    return e;
  };

  Arena.prototype.posicion = function (e) {
    // Espiral hacia el núcleo: el radio se encoge y el ángulo gira.
    var r = this.radioNucleo + (this.radioOrbita - this.radioNucleo) * (1 - e.progreso);
    return { x: this.cx + Math.cos(e.angulo) * r, y: this.cy + Math.sin(e.angulo) * r * 0.78 };
  };

  Arena.prototype.fijar = function (e) { this.objetivo = e; };

  // Empuja al enemigo hacia el núcleo (castigo por fallar con un jefe).
  Arena.prototype.empujar = function (e, cantidad) {
    e.progreso = Math.min(0.97, e.progreso + cantidad);
  };

  Arena.prototype.retroceder = function (e, cantidad) {
    e.progreso = Math.max(0, e.progreso - cantidad);
  };

  Arena.prototype.limpiar = function () {
    this.enemigos = [];
    this.disparos = [];
    this.objetivo = null;
  };

  /* ------------------------------------------------------------------ *
   * Efectos
   * ------------------------------------------------------------------ */

  Arena.prototype.disparar = function (e, alImpactar) {
    this.disparos.push({ objetivo: e, t: 0, dur: 0.16, alImpactar: alImpactar });
  };

  Arena.prototype.explotar = function (x, y, color, cantidad) {
    var n = this.reducirMovimiento ? Math.round(cantidad / 3) : cantidad;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * TAU, v = 60 + Math.random() * 260;
      this.particulas.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        vida: 0.5 + Math.random() * 0.6, t: 0, color: color, tam: 1 + Math.random() * 2.6
      });
    }
  };

  Arena.prototype.sacudir = function (fuerza) {
    if (!this.reducirMovimiento) this.sacudida = Math.max(this.sacudida, fuerza);
  };

  Arena.prototype.golpeNucleo = function (bloqueado) {
    this.destello = bloqueado ? 0.25 : 0.6;
    this.sacudir(bloqueado ? 6 : 16);
    this.explotar(this.cx, this.cy, bloqueado ? COLORES.hielo : COLORES.coral, bloqueado ? 30 : 60);
  };

  Arena.prototype.texto = function (x, y, contenido, color) {
    this.textos.push({ x: x, y: y, contenido: contenido, color: color || COLORES.texto, t: 0, vida: 1.1 });
  };

  Arena.prototype.romperFase = function (e) {
    e.fasesRotas++;
    var p = this.posicion(e);
    this.explotar(p.x, p.y, COLORES.hielo, 40);
    this.sacudir(9);
  };

  /* ------------------------------------------------------------------ *
   * Ciclo
   * ------------------------------------------------------------------ */

  Arena.prototype.actualizar = function (dt) {
    this.tiempo += dt;
    var self = this;

    if (!this.pausado) {
      this.enemigos.forEach(function (e) {
        if (!e.vivo) return;
        e.aparicion = Math.min(1, e.aparicion + dt * 2);
        if (!self.congelado) {
          e.progreso += dt / e.duracion;
          e.angulo += e.giro * dt * (0.4 + e.progreso);
        }
        var p = self.posicion(e);
        e.rastro.unshift({ x: p.x, y: p.y });
        if (e.rastro.length > (e.jefe ? 26 : 18)) e.rastro.pop();
        if (e.progreso >= 1) {
          e.vivo = false;
          if (self.objetivo === e) self.objetivo = null;
          if (self.alLlegar) self.alLlegar(e);
        }
      });
      this.enemigos = this.enemigos.filter(function (e) { return e.vivo; });

      this.disparos = this.disparos.filter(function (d) {
        d.t += dt;
        if (d.t >= d.dur) {
          if (d.alImpactar) d.alImpactar();
          return false;
        }
        return true;
      });
    }

    this.particulas = this.particulas.filter(function (p) {
      p.t += dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= 0.94; p.vy *= 0.94;
      return p.t < p.vida;
    });
    this.textos = this.textos.filter(function (t) { t.t += dt; t.y -= 38 * dt; return t.t < t.vida; });
    this.sacudida = Math.max(0, this.sacudida - dt * 40);
    this.destello = Math.max(0, this.destello - dt);
  };

  Arena.prototype.dibujar = function () {
    var g = this.g, w = this.w, h = this.h, t = this.tiempo, self = this;
    g.save();
    if (this.sacudida > 0) g.translate((Math.random() - 0.5) * this.sacudida, (Math.random() - 0.5) * this.sacudida);

    // Fondo y nebulosa.
    var fondo = g.createLinearGradient(0, 0, 0, h);
    fondo.addColorStop(0, '#05070f');
    fondo.addColorStop(1, '#0a0f1f');
    g.fillStyle = fondo;
    g.fillRect(-20, -20, w + 40, h + 40);
    if (this.nebulosa) g.drawImage(this.nebulosa, 0, 0, w, h);

    // Estrellas en tres capas con leve paralaje respecto al núcleo.
    this.estrellas.forEach(function (s) {
      var desplaz = self.reducirMovimiento ? 0 : (s.capa + 1) * 4;
      var x = s.x + Math.sin(t * 0.05 + s.capa) * desplaz;
      var alfa = 0.35 + 0.35 * Math.sin(t * (0.6 + s.capa * 0.5) + s.brillo);
      g.fillStyle = 'rgba(233,236,245,' + alfa.toFixed(3) + ')';
      g.fillRect(x, s.y, s.capa === 2 ? 2 : 1, s.capa === 2 ? 2 : 1);
    });

    // Anillos de órbita.
    g.strokeStyle = 'rgba(255,176,32,0.08)';
    g.lineWidth = 1;
    [0.35, 0.6, 0.85].forEach(function (f) {
      g.beginPath();
      var r = self.radioNucleo + (self.radioOrbita - self.radioNucleo) * f;
      g.ellipse(self.cx, self.cy, r, r * 0.78, 0, 0, TAU);
      g.stroke();
    });

    this.dibujarNucleo(g, t);

    // Cometas.
    this.enemigos.forEach(function (e) { self.dibujarEnemigo(g, e, t); });

    // Disparos: haz de luz del núcleo al objetivo.
    this.disparos.forEach(function (d) {
      if (!d.objetivo) return;
      var p = self.posicion(d.objetivo);
      var avance = d.t / d.dur;
      var x = self.cx + (p.x - self.cx) * avance, y = self.cy + (p.y - self.cy) * avance;
      g.strokeStyle = COLORES.ambar;
      g.lineWidth = 3;
      g.shadowColor = COLORES.ambar;
      g.shadowBlur = 18;
      g.beginPath();
      g.moveTo(self.cx + (p.x - self.cx) * Math.max(0, avance - 0.35), self.cy + (p.y - self.cy) * Math.max(0, avance - 0.35));
      g.lineTo(x, y);
      g.stroke();
      g.shadowBlur = 0;
    });

    // Partículas.
    this.particulas.forEach(function (p) {
      g.globalAlpha = Math.max(0, 1 - p.t / p.vida);
      g.fillStyle = p.color;
      g.fillRect(p.x, p.y, p.tam, p.tam);
    });
    g.globalAlpha = 1;

    // Textos flotantes.
    g.textAlign = 'center';
    g.font = '600 18px Tektur, "Trebuchet MS", sans-serif';
    this.textos.forEach(function (tx) {
      g.globalAlpha = Math.max(0, 1 - tx.t / tx.vida);
      g.fillStyle = tx.color;
      g.fillText(tx.contenido, tx.x, tx.y);
    });
    g.globalAlpha = 1;

    // Velo de congelamiento y destello de daño.
    if (this.congelado) {
      g.fillStyle = 'rgba(127,217,255,0.07)';
      g.fillRect(0, 0, w, h);
    }
    if (this.destello > 0) {
      g.fillStyle = 'rgba(255,90,95,' + (this.destello * 0.35).toFixed(3) + ')';
      g.fillRect(-20, -20, w + 40, h + 40);
    }
    g.restore();
  };

  Arena.prototype.dibujarNucleo = function (g, t) {
    var r = this.radioNucleo, cx = this.cx, cy = this.cy;
    var halo = g.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 3.2);
    halo.addColorStop(0, 'rgba(255,176,32,0.35)');
    halo.addColorStop(1, 'rgba(255,176,32,0)');
    g.fillStyle = halo;
    g.beginPath(); g.arc(cx, cy, r * 3.2, 0, TAU); g.fill();

    var cuerpo = g.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    cuerpo.addColorStop(0, '#fff1c9');
    cuerpo.addColorStop(0.45, COLORES.nucleo);
    cuerpo.addColorStop(1, '#c46a00');
    g.fillStyle = cuerpo;
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();

    // Bandas del planeta.
    g.save();
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.clip();
    g.strokeStyle = 'rgba(120,50,0,0.25)';
    g.lineWidth = r * 0.12;
    for (var i = -2; i <= 2; i++) {
      g.beginPath();
      g.ellipse(cx + Math.sin(t * 0.3 + i) * 3, cy + i * r * 0.32, r * 1.2, r * 0.08, 0.1, 0, TAU);
      g.stroke();
    }
    g.restore();

    // Anillo del planeta.
    g.strokeStyle = 'rgba(255,207,107,0.55)';
    g.lineWidth = 2;
    g.beginPath(); g.ellipse(cx, cy, r * 1.75, r * 0.45, -0.3, 0, TAU); g.stroke();

    if (this.escudo) {
      g.strokeStyle = 'rgba(127,217,255,' + (0.55 + 0.25 * Math.sin(t * 6)).toFixed(3) + ')';
      g.lineWidth = 3;
      g.beginPath(); g.arc(cx, cy, r * 1.45, 0, TAU); g.stroke();
    }
  };

  Arena.prototype.dibujarEnemigo = function (g, e, t) {
    var p = this.posicion(e);
    var escala = e.aparicion;

    // Cola del cometa.
    for (var i = e.rastro.length - 1; i >= 1; i--) {
      var a = e.rastro[i], f = 1 - i / e.rastro.length;
      g.globalAlpha = f * 0.45 * escala;
      g.fillStyle = e.color;
      g.beginPath();
      g.arc(a.x, a.y, e.radio * f * 0.8, 0, TAU);
      g.fill();
    }
    g.globalAlpha = 1;

    // Cabeza.
    g.shadowColor = e.color;
    g.shadowBlur = e.jefe ? 30 : 16;
    g.fillStyle = e.color;
    g.beginPath(); g.arc(p.x, p.y, e.radio * escala, 0, TAU); g.fill();
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.beginPath(); g.arc(p.x - e.radio * 0.3, p.y - e.radio * 0.3, e.radio * 0.28 * escala, 0, TAU); g.fill();

    // Escudo por fases del jefe.
    if (e.jefe && e.fases > 0) {
      var restantes = e.fases - e.fasesRotas;
      for (var k = 0; k < restantes; k++) {
        g.strokeStyle = 'rgba(127,217,255,' + (0.8 - k * 0.2) + ')';
        g.lineWidth = 3;
        g.beginPath();
        g.arc(p.x, p.y, e.radio + 9 + k * 8, t * (1 + k * 0.4), t * (1 + k * 0.4) + TAU * 0.8);
        g.stroke();
      }
    }

    // Retícula sobre el objetivo actual.
    if (this.objetivo === e) {
      var rr = e.radio + (e.jefe ? 40 : 16) + Math.sin(t * 5) * 3;
      g.strokeStyle = COLORES.hielo;
      g.lineWidth = 2;
      for (var s = 0; s < 4; s++) {
        var ang = t * 1.5 + s * Math.PI / 2;
        g.beginPath();
        g.arc(p.x, p.y, rr, ang, ang + 0.7);
        g.stroke();
      }
      if (e.etiqueta) {
        g.font = '600 13px Figtree, "Trebuchet MS", sans-serif';
        g.textAlign = 'center';
        g.fillStyle = COLORES.hielo;
        g.fillText(e.etiqueta, p.x, p.y - rr - 8);
      }
    }
  };

  global.Arena = Arena;
  global.Arena.COLORES = COLORES;
})(window);
