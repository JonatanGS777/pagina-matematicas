# Matemáticas Digitales

Plataforma educativa de matemáticas con recursos interactivos, competencias en tiempo real, módulos STEM y laboratorio virtual. Desarrollada por el Prof. Yonatan Guerrero Soriano para el Departamento de Educación de Puerto Rico.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML, CSS, JavaScript vanilla |
| Base de datos | Supabase (PostgreSQL) |
| Tiempo real | Supabase Realtime (`postgres_changes`) |
| Deploy | Vercel (auto-deploy desde GitHub) |
| MathBattle | Node.js + Express + Socket.IO |

## Estructura del proyecto

```
pagina-matematicas/
├── index.html                        # Página principal con analytics en vivo
│
├── club/                             # Club de Matemáticas
│   ├── competencias.html             # Competencias matemáticas (Supabase real-time)
│   ├── leaderboard.html              # Tabla de posiciones en vivo
│   ├── admin.html                    # Panel de administración
│   ├── olimpiadas.html               # Olimpiadas matemáticas
│   ├── investigacion.html            # Investigación matemática
│   ├── proyectos-creativos.html      # Proyectos creativos
│   ├── registro.html                 # Registro de miembros
│   └── modulos/                      # Módulos interactivos por área
│       ├── algebra.html
│       ├── calculus.html
│       ├── geometry.html
│       ├── trigonometry.html
│       ├── puzzles.html
│       └── statistics.html
│
├── materiales/materiales/            # Materiales de estudio
│   ├── biblioteca.html
│   ├── examenes.html
│   ├── ejercicios_matematicas.html
│   ├── algebra-quiz.html
│   ├── geometria-quiz.html
│   ├── calculo-quiz.html
│   ├── trigonometria-quiz.html
│   ├── rubricas.html
│   ├── guias_estudio.html
│   └── presentaciones.html
│
├── lab/                              # Laboratorio virtual interactivo
│   ├── experimentos.html
│   ├── simulaciones.html
│   ├── juegos.html
│   ├── figuras.html
│   ├── proyectiles.html
│   └── modulos/ (datos, física, geométrico, optimización)
│
├── salon/                            # Salón de clases virtual
│   ├── algebra.html
│   ├── geometria.html
│   ├── estadisticas.html
│   ├── finanzas.html
│   └── game.html
│
├── stem/                             # Sección STEM
│   ├── programacion.html
│   ├── robotica.html
│   ├── ingenieria.html
│   ├── ciencia-datos.html
│   └── Ebook STEM/
│
├── contexto/                         # Historia de las Matemáticas
│   ├── historiamath.html
│   ├── historiamath-examen.html
│   └── profesor-dashboard.html
│
├── galeria/                          # Galería de trabajos estudiantiles
├── links/                            # Recursos y enlaces externos
│
├── MathBattle/                       # Juego multijugador (Socket.IO)
│
├── supabase-setup.sql                # Schema de analytics
├── supabase-competition-setup.sql    # Schema del sistema de competencias
└── vercel.json                       # Configuración de Vercel
```

## Base de datos Supabase

### Analytics — `supabase-setup.sql`

| Tabla | Descripción |
|---|---|
| `analytics` | Estadísticas globales por página (visitas, usuarios activos) |
| `unique_visitors` | Visitantes únicos identificados por `visitor_id` |
| `daily_stats` | Estadísticas por día y página |
| `realtime_activity` | Feed de actividad en tiempo real (últimas 24h) |

### Competencias — `supabase-competition-setup.sql`

| Tabla | Descripción |
|---|---|
| `competitions` | Una competencia activa a la vez, con códigos y timer |
| `competition_participants` | Participantes con puntajes por área matemática |

#### RPCs disponibles

| Función | Descripción |
|---|---|
| `get_active_competition()` | Obtiene o crea la competencia activa |
| `join_competition(code, visitor_id, name, school)` | Valida código e inscribe participante |
| `start_competition_timer(prof_code, competition_id)` | Profesor inicia el cronómetro |
| `reset_competition(prof_code)` | Termina la actual y crea una nueva |
| `update_competition_score(participant_id, area, points, difficulty)` | Actualiza puntaje de un área |

## Sistema de competencias

### Códigos de acceso

**Estudiantes** (cualquiera de estos):
- `MATH24`
- `COMP25`
- `STEM2024`

**Profesor** (para iniciar timer y administrar):
- `PROF2024`
- `RESET123`
- `TEACHER01`

### Áreas matemáticas
Álgebra · Geometría · Cálculo · Trigonometría · Cálculo Mental · Acertijos

### Flujo de la competencia

1. Estudiantes ingresan código → nombre → escuela → entran al dashboard
2. Profesor abre la **Tabla de Posiciones** o el dashboard → **Iniciar Timer** → ingresa código de profesor
3. El cronómetro arranca simultáneamente en **todos** los dispositivos via Supabase Realtime
4. Los puntajes se actualizan en tiempo real en la tabla de posiciones
5. Al terminar: **Admin** → `reset_competition` crea una nueva sesión limpia

## Configuración de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor → New query**
3. Ejecutar `supabase-setup.sql` (analytics)
4. Ejecutar `supabase-competition-setup.sql` (competencias)
5. Actualizar credenciales en `index.html` y `club/competencias.html`:

```js
this.SUPABASE_URL      = 'https://TU_REF.supabase.co';
this.SUPABASE_ANON_KEY = 'TU_ANON_KEY';
```

## Deploy en Vercel

El proyecto se despliega automáticamente al hacer push a `main`:

```bash
git add .
git commit -m "descripción"
git push origin main
```

## MathBattle (local)

Juego multijugador matemático con Socket.IO:

```bash
cd MathBattle
npm install
npm start
```

## Perfil de Investigador (`perfil-investigador/index.html`)

Página de perfil académico del Dr. Yonatan Guerrero Soriano con diseño editorial de una sola página.

### Características
- Modo oscuro / modo claro con tema azul (`#2563eb`) en claro y dorado (`#d4a574`) en oscuro
- Toggle de tema persistente en `localStorage`
- Menú hamburguesa responsive
- Timeline horizontal interactivo con drag-to-scroll (IA en la Educación 1950–2025)
- Sección de disertación doctoral con navegación por capítulos (I–V)
- 6 gráficas con Chart.js (Radar, Pie, Barras horizontales, Barras agrupadas, Área polar, Línea de área)
- Colores de gráficas que se actualizan al cambiar el tema
- Animaciones de entrada con IntersectionObserver
- Animación de contadores y barras en la sección de Resultados

### Correcciones aplicadas (feb 2026)
- Variables CSS de modo claro completamente redefinidas con paleta azul
- Colores hardcodeados (orbs, `visual-box`, timeline featured, sombras de dots) corregidos para respetar el tema
- Sección de Referencias convertida de estilos inline a clases CSS (`references-wrap`, `reference-card`, `reference-badge`, `reference-text`)
- Nav reordenada: toggle + links agrupados en `.nav-right` para correcta alineación en desktop
- Link roto `href="#publications"` corregido a `href="#dissertation"`
- Errores de sintaxis en comentarios CSS (`-->` → `*/`) corregidos
- Footer simplificado: solo muestra el copyright; color azul en modo claro, dorado en modo oscuro
- `Chart.js`: `getChartColors()` y `updateChartsTheme()` actualizados para cambiar el color de acento de los datasets al alternar tema

---

## Sistema de internacionalización i18n (ES ↔ EN)

### Archivo principal: `js/i18n.js`

Módulo IIFE que gestiona el cambio de idioma en toda la plataforma. Se carga **sin `defer`** al final del `<body>` de cada página que lo usa, seguido de `I18n.init()`.

```html
<script src="../../js/i18n.js"></script>
<script>I18n.init();</script>
```

#### Cómo funciona

El módulo aplica traducciones en 6 pasos:
1. **`translateTextNodes`** — recorre el DOM con `TreeWalker` y reemplaza nodos de texto simples
2. **`translateParagraphs`** — busca `<p>` y `<li>` cuyo `textContent` coincida con el diccionario
3. **`translateHtmlElements`** — igual que el anterior pero reemplaza `innerHTML` (para etiquetas `<strong>` internas)
4. **`translateAttributes`** — reemplaza atributos como `placeholder`
5. **`translateTitle`** — actualiza el `<title>` de la pestaña
6. **`translateHero`** — actualiza el bloque hero animado (solo `index.html`, con reintentos a 4s y 7s)

#### Cambio de idioma

```js
// Activar inglés
I18n.setLanguage('en');

// Volver al español (recarga la página)
I18n.setLanguage('es');

// Obtener idioma actual
I18n.getCurrentLang(); // 'es' | 'en'
```

El idioma se persiste en `localStorage` con la clave `lang`. Si el valor es `'es'` o no existe, la página se muestra en su HTML original; si es `'en'`, se aplican las traducciones al cargar.

#### Botón de toggle

Cada página expone un `<button id="lang-toggle">` que llama al módulo:

```html
<button id="lang-toggle"
    onclick="I18n.setLanguage(I18n.getCurrentLang() === 'es' ? 'en' : 'es')">
    🇺🇸 EN
</button>
```

El módulo inyecta automáticamente los estilos del botón (pill redondeado, efecto glass) sin necesidad de CSS adicional en cada página.

### Páginas con i18n activo

| Página | Path | Notas |
|---|---|---|
| Principal | `index.html` | Hero con typewriter, navbar completo, stats, trabajos |
| Historia Math | `contexto/historiamath.html` | Timeline, períodos, matemáticos |
| eBook STEAM | `stem/Ebook STEM /index.html` | Toggle en sidebar-header; path `../../js/i18n.js` |
| Enlaces | `links/links.html` | Descripciones de herramientas |
| Materiales | `materiales/materiales.html` | Categorías y descripciones |
| Galería | `galeria/galeria.html` | Títulos y etiquetas |
| Competencias | `club/competencias.html` | Dashboard, áreas, timer, leaderboard inline |
| Tabla de Posiciones | `club/leaderboard.html` | Stats, podio, récords, actividad |
| Olimpiadas | `club/olimpiadas.html` | Categorías, problemas, calendario, premios |
| Investigación | `club/investigacion.html` | Áreas, metodología, cronograma |
| Proyectos Creativos | `club/proyectos-creativos.html` | Guía, nav |
| Registro | `club/registro.html` | Formulario, participantes |
| Perfil Investigador | `perfil-investigador/index.html` | Sistema `data-i18n` attributes (independiente de `js/i18n.js`) |
| Misión Matemática | `club/mision-matematica/index.html` | Pill button con acento verde, Exo 2; path `../../js/i18n.js` |

### Corrección de path en eBook STEAM (mar 2026)

El eBook usaba `../js/i18n.js` (path incorrecto) porque está un nivel más profundo (`stem/Ebook STEM /`). Corregido a `../../js/i18n.js`.

### Modernización STEM — Terminal Neón / Dark Code Lab (mar 2026)

Rediseño visual completo de las páginas STEM con dirección estética **"Terminal Neón / Dark Code Lab"**:

#### Páginas modernizadas
| Página | Estado |
|---|---|
| `stem/programacion.html` | Completada |
| `stem/robotica.html` | Completada |

#### Sistema de diseño aplicado
- **Fondo**: `#07090F` (negro terminal) con grid de líneas neón `rgba(0,255,135,0.025)` de 48px
- **Imagen de fondo**: se mantiene `imagenes/stem.png` con overlay oscuro encima
- **Acento primario**: neón verde `#00FF87` — reemplazó el morado `#5B4CF5`
- **Acento secundario**: cian `#00C8FF`
- **Acento de énfasis**: naranja llama `#FF6B35`
- **Superficies**: `#0D1220` (surface), `#121829` (raised), `#07090F` (base)
- **Tipografía display**: `JetBrains Mono` — logo, quick-nav, labels, código (reemplazó Syne + DM Mono)
- **Tipografía texto**: `Space Grotesk` — headings y cuerpo
- **Cards**: fondo `#121829`, borde lateral verde de 3px que aparece al hover
- **Secciones**: barra de 3px neón en esquina superior izquierda como acento
- **Botones primarios**: relleno neón con texto oscuro + glow `box-shadow`
- **Code blocks**: texto `#A8FF78` sobre negro, scrollbar neón
- **Score de rúbrica**: número gigante en JetBrains Mono con `text-shadow` neón

#### Notas técnicas
- Todas las funcionalidades JS preservadas intactas (Three.js robot 3D, editor de código, stats en tiempo real, laboratorio de snippets, rúbrica automática)
- CSS variables con aliases de compatibilidad (`--primary`, `--secondary`, etc.) para no romper JS que los lee
- Responsive: mobile-first, todos los breakpoints existentes conservados

---

### Modernización del eBook STEAM (mar 2026)

Rediseño completo de `stem/Ebook STEM /styles.css` con dirección estética **"Minimalista Científico"**:

- **Colores**: blanco/gris base (`#f8fafc`, `#f1f5f9`), púrpura acento (`#5B4CF5`), teal (`#00E5C3`)
- **Sidebar**: fondo blanco, borde derecho sutil, links con pill activo en púrpura pálido
- **Hero**: borde superior de acento, sin imagen de fondo, gradiente radial decorativo
- **Cards**: `border-top: 3px solid var(--primary)`, sombra mínima
- **Progress bar**: gradiente púrpura → teal
- **Lang toggle**: integrado en `.sidebar-header`, estilo pill `static` (no `fixed`)
- **Dark mode**: grises oscuros (`#0f172a`, `#1e293b`), no negro puro
- **Traducciones ebook añadidas**: nav links, secciones h2, hero, badges, panel de accesibilidad, tabs de simulación

### Traducciones completas del eBook STEAM (mar 2026)

Se añadieron ~240 entradas a `js/i18n.js` cubriendo la totalidad del contenido del eBook:

- `textDict`: nav links (Objetivos, Contenido), labels del hero, headings de Nivel Educativo, Objetivos, Contenido, Integración STEAM y Metodología, labels de simulación, headings de Casos Reales, controles de Visualización Avanzada, secciones del Laboratorio Virtual, texto dinámico del Quiz, Adaptaciones, Reflexión y footer
- `paraDict`: párrafo intro del hero, ítems de Relevancia, Nivel Educativo, Objetivos, STEAM cards, ítems de Metodología (timeline + instrucciones), párrafos de Casos Reales, intro de Visualización Avanzada, intro del Laboratorio Virtual, ítems de Adaptaciones

### Gráficas interactivas en "Contenido de la Lección" (mar 2026)

Las imágenes estáticas de la sección fueron reemplazadas por gráficas Chart.js en tiempo real:

- **Crecimiento Exponencial** (púrpura `#5B4CF5`): `P(t) = P₀·eʳᵗ` — curva ilimitada
- **Crecimiento Logístico** (teal `#00B8A9`): `P(t) = K/(1+((K−P₀)/P₀)·e⁻ʳᵗ)` — curva S con asíntota en K
- Ambas con animación de entrada y tooltip interactivo
- Código añadido como IIFE inline al final de `stem/Ebook STEM /index.html` antes de `i18n.js`

### Protección de fórmulas MathJax en i18n (mar 2026)

El `TreeWalker` de `translateTextNodes` ahora omite nodos de texto dentro de elementos `.formula`, `mjx-container` y cualquier clase `MathJax`, evitando que el cambio de idioma rompa el formato LaTeX renderizado.

```javascript
// js/i18n.js — acceptNode filter
if (node.parentElement?.closest('.formula, mjx-container, .MathJax, [class*="MathJax"]'))
    return NodeFilter.FILTER_SKIP;
```

### Traducciones del hero de `club/investigacion.html` (mar 2026)

- `🔬 Investigación Matemática` → clave con emoji añadida a `textDict`
- Párrafo largo del `<div class="hero-description">` añadido a `textDict` (el TreeWalker procesa nodos de texto en `<div>`)
- `Descubre, Explora, Innova` ya estaba en `textDict`

---

## Correcciones generales (feb 2026)

### `index.html` — Sección Análisis en Tiempo Real
- **Botones dispositivos (Móvil / Tablet / Escritorio):** corregido doble bug:
  1. `setupEventListeners()` no se llamaba en el modo fallback de Supabase
  2. El pseudo-elemento `::before` de `.stat-card` (`position: absolute; inset: 0`) bloqueaba los clics en los botones al apilarse encima del contenido estático — solucionado con `pointer-events: none`

### `index.html` — Mejoras de UI/UX
- Eliminada sección "Insights de IA" y aviso de privacidad
- Sección "Trabajos de los Estudiantes" rediseñada con estilo moderno (fecha narrativa, clases `project-description-lead/body`)
- Footer muestra año actual dinámico con JavaScript
- Título del hero ("Matemáticas Digitales") con tamaño responsive (`clamp`) y gradiente del header
- Tarjeta "Tiempo Promedio" reemplazada por encuesta de profesión (localStorage, sin Supabase)
- Corregida inicialización de Supabase Analytics tras eliminar el elemento `avgSession`

### `stem/ciencia-datos.html`
- Header simplificado: eliminados links duplicados del nav, solo logo + botón Inicio + toggle

### `club/competencias.html` — Sistema de competencias
- Logo corregido a `../index.html`
- Botón "Iniciar Timer" restaurado en el navbar
- Todas las tarjetas de área navegan con `window.location.href` directamente a los módulos
- `selectArea()` mantiene comportamiento original (alerta PRÓXIMAMENTE para áreas sin módulo)

### `club/modulos/` — Módulos interactivos (todos los 6)
- Integración con Supabase: al resolver un problema, `syncScoreToSupabase()` llama `update_competition_score` y actualiza el puntaje en tiempo real en la tabla de posiciones
- Antes los puntajes solo se guardaban en `localStorage`; ahora se sincronizan a Supabase

### `js/dark-mode.js`
- Opacidad del gradiente reducida (0.85 → 0.65) para que `fondo2.jpg` sea visible en modo oscuro
- Añadidos estilos dark mode para `.poll-card`, `.project-description-lead/body`, `.insight-card`, chatbot

---

## Licencia

Proyecto educativo del Prof. Yonatan Guerrero Soriano — uso académico en el Departamento de Educación de Puerto Rico.
