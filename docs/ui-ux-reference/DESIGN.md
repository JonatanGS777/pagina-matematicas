# DESIGN.md — Principios Modernos UI/UX
**Referencia de diseño para agentes IA | Actualizado: Abril 2026**

> Usa este documento cuando construyas o mejores interfaces web del proyecto.
> Sigue estos principios para lograr consistencia visual, accesibilidad y modernidad.

---

## TEMA VISUAL

**Estética**: Minimalista moderna — espaciosa, clara, con jerarquía fuerte.
**Inspiración**: Linear, Vercel, Shadcn, Apple Human Interface Guidelines.
**Modo**: Soporte nativo para Light y Dark mode via CSS custom properties.
**Carácter**: Profesional pero cálido; matemática accesible y visualmente elegante.

---

## PALETA DE COLORES

### Tokens primitivos
```css
/* Azul marca (matemáticas/ciencia) */
--blue-50: #eff6ff; --blue-100: #dbeafe; --blue-200: #bfdbfe;
--blue-300: #93c5fd; --blue-400: #60a5fa; --blue-500: #3b82f6;
--blue-600: #2563eb; --blue-700: #1d4ed8; --blue-800: #1e40af; --blue-900: #1e3a8a;

/* Púrpura secundario */
--purple-400: #a78bfa; --purple-500: #8b5cf6; --purple-600: #7c3aed;

/* Verde éxito */
--green-400: #34d399; --green-500: #10b981; --green-600: #059669;

/* Ámbar advertencia */
--amber-400: #fbbf24; --amber-500: #f59e0b;

/* Rojo error */
--red-400: #f87171; --red-500: #ef4444;

/* Grises neutros */
--gray-50: #f9fafb;  --gray-100: #f3f4f6; --gray-200: #e5e7eb;
--gray-300: #d1d5db; --gray-400: #9ca3af; --gray-500: #6b7280;
--gray-600: #4b5563; --gray-700: #374151; --gray-800: #1f2937; --gray-900: #111827;
```

### Tokens semánticos — Modo Claro
```css
:root {
  --bg-base:          #f9fafb;
  --bg-surface:       #ffffff;
  --bg-elevated:      #ffffff;
  --bg-subtle:        #f3f4f6;
  --text-primary:     #111827;
  --text-secondary:   #4b5563;
  --text-muted:       #9ca3af;
  --text-inverse:     #ffffff;
  --border-default:   #e5e7eb;
  --border-strong:    #d1d5db;
  --accent-primary:   #3b82f6;
  --accent-hover:     #2563eb;
  --accent-subtle:    #eff6ff;
  --accent-secondary: #8b5cf6;
}
```

### Tokens semánticos — Modo Oscuro
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-base:          #0f172a;
    --bg-surface:       #1e293b;
    --bg-elevated:      #334155;
    --bg-subtle:        #1e293b;
    --text-primary:     #f1f5f9;
    --text-secondary:   #94a3b8;
    --text-muted:       #64748b;
    --text-inverse:     #0f172a;
    --border-default:   #334155;
    --border-strong:    #475569;
    --accent-primary:   #60a5fa;
    --accent-hover:     #93c5fd;
    --accent-subtle:    rgba(96, 165, 250, 0.1);
    --accent-secondary: #a78bfa;
  }
}
```

**Contraste mínimo (WCAG 2.2 AA):**
- Texto normal → 4.5:1 contra su fondo
- Texto grande (≥18px o ≥14px bold) → 3:1
- Íconos y borders interactivos → 3:1

---

## TIPOGRAFÍA

### Stack de fuentes
```css
--font-sans: 'Inter', 'system-ui', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
--font-math: 'STIX Two Math', 'Latin Modern Math', serif; /* para ecuaciones */
```

### Escala fluida con clamp()
```css
--text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.8rem);
--text-sm:   clamp(0.875rem, 0.825rem + 0.25vw, 0.925rem);
--text-base: clamp(1rem,     0.95rem  + 0.25vw, 1.05rem);
--text-lg:   clamp(1.125rem, 1.05rem  + 0.375vw, 1.25rem);
--text-xl:   clamp(1.25rem,  1.1rem   + 0.75vw, 1.5rem);
--text-2xl:  clamp(1.5rem,   1.25rem  + 1.25vw, 2rem);
--text-3xl:  clamp(1.875rem, 1.5rem   + 1.875vw, 2.5rem);
--text-4xl:  clamp(2.25rem,  1.75rem  + 2.5vw, 3.5rem);
```

### Jerarquía
| Nivel | Token | Peso | Uso |
|-------|-------|------|-----|
| Display | `--text-4xl` | 700 | Hero, portadas |
| H1 | `--text-3xl` | 700 | Título de página |
| H2 | `--text-2xl` | 600 | Sección principal |
| H3 | `--text-xl` | 600 | Subsección |
| H4 | `--text-lg` | 500 | Grupos |
| Body | `--text-base` | 400 | Párrafos |
| Small | `--text-sm` | 400 | Metadata |
| Micro | `--text-xs` | 500 | Badges, captions |

**Máx. longitud de línea: 65ch** para legibilidad óptima.

---

## ESPACIADO

```css
--space-1: 0.25rem;  /* 4px */    --space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */   --space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */   --space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */   --space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */   --space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */   --space-24: 6rem;    /* 96px */
```

- Padding interno de cards: `--space-6`
- Gap entre elementos: `--space-3` / `--space-4`
- Separación entre secciones: `--space-16` – `--space-24`
- Touch targets: mínimo **44×44px**

---

## BORDES, RADIOS Y SOMBRAS

```css
--radius-sm:   0.25rem;  --radius-md: 0.5rem;   --radius-lg: 0.75rem;
--radius-xl:   1rem;     --radius-2xl: 1.5rem;  --radius-full: 9999px;

--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
--shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3); /* acento azul */
```

---

## ANIMACIONES Y TRANSICIONES

```css
--duration-fast:   150ms;   --duration-normal: 250ms;
--duration-slow:   400ms;   --duration-slower: 600ms;

--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

- Hover / focus: **100–200ms**, `ease-out`
- Cambios de estado: **200–300ms**, `ease-in-out`
- Entradas de contenido: **300–500ms**, `ease-out`
- Animar solo `transform` y `opacity` (GPU-accelerated)
- Siempre incluir `@media (prefers-reduced-motion: reduce)`

---

## PATRONES DE COMPONENTES

### Botón primario
```css
.btn-primary {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--accent-primary); color: var(--text-inverse);
  border-radius: var(--radius-md); font-weight: var(--font-semibold);
  font-size: var(--text-sm); min-height: 44px; border: none;
  transition: background var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) var(--ease-out);
}
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn-primary:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }
.btn-primary:active { transform: translateY(0); }
```

### Card interactiva
```css
.card {
  background: var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-spring),
              border-color var(--duration-normal) var(--ease-out);
}
.card:hover {
  box-shadow: var(--shadow-lg); transform: translateY(-2px);
  border-color: var(--border-strong);
}
```

### Glassmorphism (para modales / nav flotante)
```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
}
/* Dark mode */
@media (prefers-color-scheme: dark) {
  .glass {
    background: rgba(15, 23, 42, 0.6);
    border-color: rgba(255, 255, 255, 0.08);
  }
}
```

---

## LAYOUT Y BREAKPOINTS

```css
--bp-sm: 640px; --bp-md: 768px; --bp-lg: 1024px;
--bp-xl: 1280px; --bp-2xl: 1536px;

/* Container */
.container {
  width: 100%; max-width: 1280px; margin-inline: auto;
  padding-inline: clamp(var(--space-4), 5vw, var(--space-16));
}

/* Bento Grid auto-fit */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--space-6);
}
```

---

## ACCESIBILIDAD — CHECKLIST (WCAG 2.2 AA)

- [ ] Contraste texto: ≥ 4.5:1 normal, ≥ 3:1 grande
- [ ] `:focus-visible` visible en todos los elementos interactivos
- [ ] `alt` en imágenes; `alt=""` en decorativas
- [ ] `<label>` asociado a cada `<input>` (via `for` o envolvente)
- [ ] Jerarquía de headings sin saltos (H1→H2→H3)
- [ ] Navegación completa por teclado
- [ ] `prefers-reduced-motion` implementado
- [ ] Touch targets ≥ 44×44px
- [ ] ARIA roles y atributos correctos
- [ ] Gestión de foco en modales y menús

---

## PRINCIPIOS UX 2025–2026

| Principio | Descripción |
|-----------|-------------|
| Progressive Disclosure | Muestra solo lo necesario en cada paso |
| Skeleton Screens | Usar en vez de spinners para carga de contenido |
| Optimistic UI | Actualiza UI inmediatamente; reconcilia después |
| Error Design | Mensajes de error claros, constructivos y accionables |
| Microinteracciones | Feedback visual inmediato en cada acción |
| AI Personalization | Adapta flujos según el comportamiento del usuario |
| Bento Grid | Bloques de diferentes tamaños para organizar información rica |
| Voice-ready | Diseñar como complemento al toque/teclado |

---

## GUARDRAILS — QUÉ NO HACER

- No usar `#000000` puro ni `#ffffff` puro para fondos
- No animar `width`, `height`, `top`, `left`, `margin` (usa `transform`)
- No omitir `:focus-visible` — es requerimiento legal WCAG
- No usar `px` para tipografía — usar `rem` o `clamp()`
- No saltarse niveles en la jerarquía de headings
- No usar más de 3 pesos de fuente distintos en una página
- No exceder 65ch de ancho en bloques de texto corrido
- No usar Glassmorphism en elementos de texto (afecta legibilidad)
- No agregar animaciones sin verificar `prefers-reduced-motion`

---

## REFERENCIAS

| Recurso | URL |
|---------|-----|
| Shadcn/UI | https://ui.shadcn.com |
| Radix UI Primitives | https://radix-ui.com |
| Awesome Design Systems | https://github.com/alexpate/awesome-design-systems |
| Awesome Design MD | https://github.com/VoltAgent/awesome-design-md |
| WCAG 2.2 Guidelines | https://www.w3.org/WAI/WCAG22/ |
| Figma Design Trends | https://www.figma.com/resource-library/web-design-trends/ |
| Inter Font | https://rsms.me/inter/ |
| UX Collective | https://uxdesign.cc |
