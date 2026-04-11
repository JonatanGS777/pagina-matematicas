# Skill: Modern UI/UX Design Principles

Aplica los principios modernos de UI/UX de esta skill para construir interfaces web de alta calidad, accesibles y visualmente consistentes. Usa este documento como guía de diseño cuando crees o mejores componentes, páginas o sistemas de diseño.

---

## 1. FILOSOFÍA DE DISEÑO

- **Claridad sobre complejidad**: cada elemento debe tener un propósito claro
- **Jerarquía visual**: guía al usuario mediante tamaño, peso, color y espacio
- **Consistencia sistémica**: usa tokens de diseño, no valores mágicos
- **Accesibilidad primero** (WCAG 2.2 AA): el diseño inclusivo beneficia a todos
- **Mobile-first**: diseña primero para pantallas pequeñas y escala hacia arriba
- **Performance UX**: las interfaces deben sentirse rápidas (< 100ms de respuesta a interacción)

---

## 2. SISTEMA DE COLOR

### Tokens primitivos (en CSS custom properties)
```css
:root {
  /* Escala de color de marca */
  --color-brand-50:  #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-300: #93c5fd;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;  /* Primary */
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a;

  /* Neutros */
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Semánticos de estado */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;
}
```

### Tokens semánticos — Modo Claro
```css
:root {
  --bg-base:        var(--color-gray-50);
  --bg-surface:     #ffffff;
  --bg-elevated:    #ffffff;
  --bg-subtle:      var(--color-gray-100);

  --text-primary:   var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --text-muted:     var(--color-gray-400);
  --text-inverse:   #ffffff;

  --border-default: var(--color-gray-200);
  --border-strong:  var(--color-gray-300);

  --accent-primary:  var(--color-brand-500);
  --accent-hover:    var(--color-brand-600);
  --accent-subtle:   var(--color-brand-50);
}
```

### Tokens semánticos — Modo Oscuro
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-base:        #0f172a;
    --bg-surface:     #1e293b;
    --bg-elevated:    #334155;
    --bg-subtle:      #1e293b;

    --text-primary:   #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted:     #64748b;
    --text-inverse:   #0f172a;

    --border-default: #334155;
    --border-strong:  #475569;

    --accent-primary:  var(--color-brand-400);
    --accent-hover:    var(--color-brand-300);
    --accent-subtle:   rgba(59, 130, 246, 0.1);
  }
}
```

**Reglas de contraste (WCAG 2.2 AA):**
- Texto normal: mínimo **4.5:1** contra el fondo
- Texto grande (≥ 18px o ≥ 14px bold): mínimo **3:1**
- Elementos UI interactivos: mínimo **3:1**
- Nunca usar negro puro (#000) ni blanco puro (#fff) para fondos — usa #0f172a y #f9fafb

---

## 3. TIPOGRAFÍA

### Escala tipográfica (sistema modular, razón 1.25)
```css
:root {
  /* Fuente base */
  --font-sans:  'Inter', 'system-ui', -apple-system, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  /* Escala de tamaños con clamp() para fluid typography */
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.8rem);
  --text-sm:   clamp(0.875rem, 0.825rem + 0.25vw, 0.925rem);
  --text-base: clamp(1rem,     0.95rem  + 0.25vw, 1.05rem);
  --text-lg:   clamp(1.125rem, 1.05rem  + 0.375vw, 1.25rem);
  --text-xl:   clamp(1.25rem,  1.1rem   + 0.75vw, 1.5rem);
  --text-2xl:  clamp(1.5rem,   1.25rem  + 1.25vw, 2rem);
  --text-3xl:  clamp(1.875rem, 1.5rem   + 1.875vw, 2.5rem);
  --text-4xl:  clamp(2.25rem,  1.75rem  + 2.5vw, 3.5rem);

  /* Pesos */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;

  /* Altura de línea */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Espaciado de letras */
  --tracking-tight:  -0.025em;
  --tracking-normal: 0em;
  --tracking-wide:   0.025em;
  --tracking-wider:  0.05em;
  --tracking-widest: 0.1em;
}
```

### Jerarquía de uso
| Nivel     | Tamaño     | Peso      | Uso                                  |
|-----------|------------|-----------|--------------------------------------|
| Display   | `--text-4xl` | bold    | Hero headlines, portadas             |
| H1        | `--text-3xl` | bold    | Títulos de página                    |
| H2        | `--text-2xl` | semibold | Secciones principales               |
| H3        | `--text-xl`  | semibold | Subsecciones                        |
| H4        | `--text-lg`  | medium   | Grupos de contenido                  |
| Body      | `--text-base`| normal  | Texto de párrafo                     |
| Small     | `--text-sm`  | normal  | Metadatos, etiquetas                 |
| Micro     | `--text-xs`  | medium  | Badges, captions                     |

---

## 4. SISTEMA DE ESPACIADO

```css
:root {
  /* Escala de 4px */
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
}
```

**Reglas de espaciado:**
- Padding interno de cards: `--space-6` (24px)
- Gap entre elementos relacionados: `--space-3` o `--space-4`
- Separación entre secciones: `--space-16` a `--space-24`
- Touch targets mínimos: 44×44px (accesibilidad móvil)
- Ancho máximo de contenido de texto: 65ch (legibilidad óptima)

---

## 5. SISTEMA DE BORDES Y RADIOS

```css
:root {
  --radius-sm:   0.25rem;   /* 4px  — inputs pequeños */
  --radius-md:   0.5rem;    /* 8px  — botones, badges */
  --radius-lg:   0.75rem;   /* 12px — cards, modales */
  --radius-xl:   1rem;      /* 16px — cards grandes */
  --radius-2xl:  1.5rem;    /* 24px — hero sections */
  --radius-full: 9999px;    /* píldoras, avatares */

  --shadow-sm:   0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:   0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg:   0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl:   0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
}
```

---

## 6. SISTEMA DE ANIMACIÓN Y TRANSICIONES

```css
:root {
  /* Duraciones */
  --duration-instant:  50ms;
  --duration-fast:     150ms;
  --duration-normal:   250ms;
  --duration-slow:     400ms;
  --duration-slower:   600ms;

  /* Curvas de easing */
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);   /* Entradas */
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);    /* Salidas */
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);  /* Cambios de estado */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* Rebote suave */
  --ease-bounce:     cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Transición estándar para hover */
.interactive {
  transition: background-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-spring);
}

/* Respetar preferencias del usuario */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Reglas de animación:**
- Microinteracciones (hover, focus): 100–200ms
- Transiciones de estado (tab switch, toggle): 200–300ms
- Animaciones de entrada de contenido: 300–500ms
- Animaciones largas (loading, onboarding): máx 600ms
- Usar `transform` y `opacity` — son GPU-accelerated
- Nunca animar `width`, `height`, `margin`, `padding` (causan reflow)

---

## 7. PATRONES DE COMPONENTES

### Botones
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--duration-fast) var(--ease-out);
  min-height: 44px; /* accesibilidad táctil */
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
}
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

### Cards
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-spring);
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs
```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-base);
  min-height: 44px;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}
```

---

## 8. LAYOUT Y GRID

```css
/* Breakpoints */
:root {
  --bp-sm:  640px;
  --bp-md:  768px;
  --bp-lg:  1024px;
  --bp-xl:  1280px;
  --bp-2xl: 1536px;
}

/* Container responsivo */
.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: clamp(var(--space-4), 5vw, var(--space-16));
}

/* Grid system */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--space-6);
}
```

**Principios de layout:**
- **Bento Grid**: bloques de diferentes tamaños para organizar información rica
- **Glassmorphism**: `backdrop-filter: blur(12px)` con `background: rgba(255,255,255,0.1)` para surfaces flotantes
- **Whitespace generoso**: el espacio vacío guía la atención y mejora la legibilidad
- Columnas de texto: máximo 65–75ch de ancho para lectura cómoda

---

## 9. ACCESIBILIDAD (WCAG 2.2 AA)

**Checklist obligatorio:**
- [ ] Todo texto tiene contraste mínimo 4.5:1
- [ ] Elementos interactivos tienen `:focus-visible` visible
- [ ] Imágenes tienen `alt` descriptivo; decorativas usan `alt=""`
- [ ] Formularios tienen `<label>` asociado a cada `<input>`
- [ ] Jerarquía de headings correcta (H1 → H2 → H3, sin saltos)
- [ ] Navegación por teclado funciona completamente
- [ ] Animaciones respetan `prefers-reduced-motion`
- [ ] Touch targets ≥ 44×44px en móvil
- [ ] Uso correcto de roles ARIA (`role`, `aria-label`, `aria-expanded`)
- [ ] Modales y dropdowns tienen manejo correcto del foco

---

## 10. PRINCIPIOS DE UX MODERNOS (2025–2026)

1. **Progressive disclosure**: muestra solo lo necesario en cada paso
2. **Skeleton screens** en vez de spinners para carga de contenido
3. **Optimistic UI**: actualiza la interfaz inmediatamente, reconcilia después
4. **Diseño para el error**: mensajes de error claros, constructivos y accionables
5. **Microinteracciones**: cada acción del usuario debe tener feedback visual inmediato
6. **Dark/Light mode** automático por sistema + toggle manual
7. **AI-driven UI**: adapta contenido y flujos según el comportamiento del usuario
8. **Voice & multimodal**: diseña pensando en interacciones de voz como complemento
9. **Glassmorphism con moderación**: solo para surfaces flotantes (modales, tooltips, nav)
10. **Performance percibida**: prioriza LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 11. REFERENCIAS Y REPOSITORIOS CLAVE

- **Shadcn/UI** — componentes accesibles con Radix + Tailwind: https://ui.shadcn.com
- **Radix UI** — primitivos de UI accesibles: https://radix-ui.com
- **Awesome Design Systems** — colección curada: https://github.com/alexpate/awesome-design-systems
- **Awesome Design MD** — DESIGN.md para agentes IA: https://github.com/VoltAgent/awesome-design-md
- **Google Fonts** — tipografías optimizadas para web: https://fonts.google.com
- **WCAG 2.2** — estándar de accesibilidad: https://www.w3.org/WAI/WCAG22/
- **Figma Web Design Trends** — tendencias anuales: https://www.figma.com/resource-library/web-design-trends/

---

## USO DE ESTA SKILL

Cuando el usuario pida construir o mejorar una interfaz web:

1. Aplica primero los **tokens de diseño** (colores, tipografía, espaciado) como CSS custom properties
2. Asegura **accesibilidad** desde el inicio (no como parche final)
3. Implementa **dark mode** con `prefers-color-scheme` desde el principio
4. Usa **transiciones suaves** con las curvas y duraciones definidas
5. Sigue la **jerarquía visual** para guiar la atención del usuario
6. Valida que todo sea **responsive** (mobile-first, breakpoints definidos)
7. Añade **microinteracciones** en elementos interactivos clave
