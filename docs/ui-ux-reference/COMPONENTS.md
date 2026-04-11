# COMPONENTS.md — Biblioteca de Patrones UI
**Referencia de componentes modernos | Proyecto Página Matemáticas**

---

## NAVEGACIÓN

### Navbar moderna con glassmorphism
```html
<nav class="navbar" role="navigation" aria-label="Navegación principal">
  <div class="container navbar__inner">
    <a href="/" class="navbar__brand" aria-label="Inicio">
      <span class="navbar__logo">∑</span>
      <span class="navbar__title">Matemáticas</span>
    </a>
    <ul class="navbar__links" role="list">
      <li><a href="/club" class="nav-link">Club</a></li>
      <li><a href="/lab" class="nav-link">Laboratorio</a></li>
      <li><a href="/materiales" class="nav-link">Materiales</a></li>
    </ul>
    <button class="btn btn-primary navbar__cta">Acceder</button>
    <button class="navbar__toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">
      <span aria-hidden="true">☰</span>
    </button>
  </div>
</nav>
```

```css
.navbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid var(--border-default);
  transition: background var(--duration-normal) var(--ease-out);
}
@media (prefers-color-scheme: dark) {
  .navbar { background: rgba(15, 23, 42, 0.85); }
}
.navbar__inner {
  display: flex; align-items: center; gap: var(--space-8);
  height: 64px;
}
```

---

## HERO SECTION

```html
<section class="hero">
  <div class="container hero__content">
    <div class="hero__badge">Educación Matemática</div>
    <h1 class="hero__title">Matemáticas para <span class="gradient-text">todos</span></h1>
    <p class="hero__subtitle">Recursos, herramientas y comunidad para aprender y enseñar matemáticas de manera moderna.</p>
    <div class="hero__actions">
      <a href="/club" class="btn btn-primary btn-lg">Explorar el Club</a>
      <a href="/materiales" class="btn btn-ghost btn-lg">Ver Materiales</a>
    </div>
  </div>
</section>
```

```css
.hero {
  padding-block: var(--space-24) var(--space-20);
  text-align: center;
}
.hero__badge {
  display: inline-flex; align-items: center;
  padding: var(--space-1) var(--space-3);
  background: var(--accent-subtle); color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wider); text-transform: uppercase;
  margin-bottom: var(--space-6);
}
.hero__title {
  font-size: var(--text-4xl); font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary); max-width: 14ch; margin-inline: auto;
  margin-bottom: var(--space-6);
}
.gradient-text {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero__subtitle {
  font-size: var(--text-xl); color: var(--text-secondary);
  max-width: 55ch; margin-inline: auto; margin-bottom: var(--space-10);
  line-height: var(--leading-relaxed);
}
.hero__actions { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }
```

---

## BENTO GRID — SECCIÓN DE FEATURES

```html
<section class="features">
  <div class="container">
    <div class="bento-grid">
      <article class="bento-card bento-card--wide" aria-label="Club de Matemáticas">
        <div class="bento-card__icon" aria-hidden="true">🏆</div>
        <h3 class="bento-card__title">Club de Matemáticas</h3>
        <p class="bento-card__desc">Competencias, olimpiadas y actividades para estudiantes apasionados.</p>
        <a href="/club" class="bento-card__link">Unirme →</a>
      </article>
      <!-- más cards -->
    </div>
  </div>
</section>
```

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}
@media (max-width: 768px) {
  .bento-grid { grid-template-columns: 1fr; }
}
.bento-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl); padding: var(--space-8);
  display: flex; flex-direction: column; gap: var(--space-4);
  transition: all var(--duration-normal) var(--ease-spring);
}
.bento-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--accent-primary); }
.bento-card--wide { grid-column: span 2; }
.bento-card--tall { grid-row: span 2; }
```

---

## TARJETA DE ESTADÍSTICA / KPI

```html
<div class="stat-card">
  <div class="stat-card__icon" aria-hidden="true">📐</div>
  <div class="stat-card__number">1,234</div>
  <div class="stat-card__label">Estudiantes activos</div>
  <div class="stat-card__trend trend--up" aria-label="Subida 12%">+12%</div>
</div>
```

```css
.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); padding: var(--space-6);
  display: flex; flex-direction: column; gap: var(--space-2);
}
.stat-card__number {
  font-size: var(--text-3xl); font-weight: 700;
  color: var(--text-primary); letter-spacing: var(--tracking-tight);
}
.stat-card__label { font-size: var(--text-sm); color: var(--text-secondary); }
.trend--up { color: var(--color-success); font-size: var(--text-sm); font-weight: var(--font-semibold); }
.trend--down { color: var(--color-error); }
```

---

## BADGE / ETIQUETA

```html
<span class="badge badge--blue">Olimpiada</span>
<span class="badge badge--green">Nuevo</span>
<span class="badge badge--purple">Premium</span>
<span class="badge badge--amber">Beta</span>
```

```css
.badge {
  display: inline-flex; align-items: center;
  padding: 0.2em 0.7em;
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
}
.badge--blue   { background: #dbeafe; color: #1d4ed8; }
.badge--green  { background: #d1fae5; color: #065f46; }
.badge--purple { background: #ede9fe; color: #5b21b6; }
.badge--amber  { background: #fef3c7; color: #92400e; }
@media (prefers-color-scheme: dark) {
  .badge--blue   { background: rgba(59,130,246,0.2);  color: #93c5fd; }
  .badge--green  { background: rgba(16,185,129,0.2);  color: #6ee7b7; }
  .badge--purple { background: rgba(139,92,246,0.2);  color: #c4b5fd; }
  .badge--amber  { background: rgba(245,158,11,0.2);  color: #fde68a; }
}
```

---

## INPUT Y FORMULARIO

```html
<div class="form-group">
  <label for="nombre" class="form-label">Nombre completo</label>
  <input type="text" id="nombre" name="nombre" class="form-input"
         placeholder="Tu nombre" autocomplete="name" required
         aria-describedby="nombre-hint">
  <span id="nombre-hint" class="form-hint">Como aparecerá en tu certificado</span>
</div>
```

```css
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label {
  font-size: var(--text-sm); font-weight: var(--font-medium);
  color: var(--text-primary);
}
.form-input {
  width: 100%; padding: var(--space-2) var(--space-3);
  background: var(--bg-surface); border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-md); color: var(--text-primary);
  font-size: var(--text-base); min-height: 44px;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.form-input:focus {
  outline: none; border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}
.form-input:invalid:not(:placeholder-shown) {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.form-hint { font-size: var(--text-xs); color: var(--text-muted); }
```

---

## MODAL / DIALOG

```html
<dialog class="modal" id="competencia-modal" aria-labelledby="modal-title">
  <div class="modal__content">
    <button class="modal__close" aria-label="Cerrar">✕</button>
    <h2 class="modal__title" id="modal-title">Inscripción a Olimpiada</h2>
    <div class="modal__body"><!-- contenido --></div>
    <div class="modal__footer">
      <button class="btn btn-ghost" data-modal-close>Cancelar</button>
      <button class="btn btn-primary">Inscribirme</button>
    </div>
  </div>
</dialog>
```

```css
.modal {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-4);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border: none;
}
.modal::backdrop { background: rgba(0,0,0,0); }
.modal__content {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  max-width: 480px; width: 100%;
  box-shadow: var(--shadow-xl);
  animation: modal-in var(--duration-normal) var(--ease-spring);
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
```

---

## SKELETON LOADER

```html
<div class="skeleton-card" aria-busy="true" aria-label="Cargando contenido...">
  <div class="skeleton skeleton--title"></div>
  <div class="skeleton skeleton--text"></div>
  <div class="skeleton skeleton--text skeleton--short"></div>
</div>
```

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--bg-subtle) 25%,
    var(--border-default) 50%,
    var(--bg-subtle) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
.skeleton--title { height: 1.5rem; width: 60%; margin-bottom: var(--space-3); }
.skeleton--text  { height: 1rem; width: 100%; margin-bottom: var(--space-2); }
.skeleton--short { width: 40%; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
```

---

## NOTIFICACIÓN / TOAST

```html
<div class="toast toast--success" role="alert" aria-live="polite">
  <span class="toast__icon" aria-hidden="true">✓</span>
  <span class="toast__message">¡Inscripción exitosa!</span>
  <button class="toast__close" aria-label="Cerrar notificación">✕</button>
</div>
```

```css
.toast {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg); min-width: 280px;
  box-shadow: var(--shadow-lg);
  animation: toast-in var(--duration-normal) var(--ease-spring);
}
.toast--success { background: var(--color-success); color: white; }
.toast--error   { background: var(--color-error); color: white; }
.toast--info    { background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-default); }
@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```
