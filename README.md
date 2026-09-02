<div align="center">

# Digital Mathematics

**Interactive mathematics platform for students, educators and researchers.**

[![Stack](https://img.shields.io/badge/stack-HTML%20·%20CSS%20·%20JS-4ade80?style=for-the-badge&logoColor=white)](https://github.com/JonatanGS777/pagina-matematicas)
[![Database](https://img.shields.io/badge/database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Real-time](https://img.shields.io/badge/real--time-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io)
[![i18n](https://img.shields.io/badge/i18n-ES%20↔%20EN-22c1ff?style=for-the-badge&logoColor=white)](#i18n-system-es--en)

<br/>

*Developed by **Prof. Yonatan Guerrero Soriano** for the Puerto Rico Department of Education.*

[Features](#features) · [Tech Stack](#tech-stack) · [Design System](#design-system) · [Structure](#project-structure) · [Setup](#supabase-setup) · [Deploy](#deploy-on-vercel)

</div>

---

## Features

<div align="center">

| Module | Description |
|:---|:---|
| 🏆 **Math Competitions** | Real-time competitions with live leaderboard via Supabase Realtime |
| 🔬 **Virtual Lab** | Physics simulations, projectiles, interactive geometry figures |
| 📚 **Study Materials** | Library, exams, quizzes and rubrics by math area |
| 🚀 **STEM Section** | Programming, robotics, engineering and data science modules |
| 🎮 **MathBattle** | Multiplayer math game powered by Socket.IO |
| 📊 **Live Analytics** | Real-time visitor stats and activity feed on the main page |
| 🌐 **Bilingual** | Full ES ↔ EN support via custom `js/i18n.js` module |
| 👨‍🔬 **Researcher Profile** | Academic profile with Chart.js visualizations and doctoral dissertation |

</div>

---

## Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| **Frontend** | HTML, CSS, Vanilla JavaScript — zero framework dependencies |
| **Database** | Supabase (PostgreSQL) |
| **Real-time** | Supabase Realtime (`postgres_changes`) |
| **Deploy** | Vercel — auto-deploy on push to `main` |
| **MathBattle** | Node.js + Express + Socket.IO |
| **Charts** | Chart.js (Radar, Pie, Bar, Polar, Area Line) |
| **Fonts** | Google Fonts — Fraunces (display), Karla (body), JetBrains Mono (data) |

</div>

---

## Design System

Since August 2026 the site has been redesigned page by page. `index.html` and
`galeria/galeria.html` share a single visual identity ("Cuaderno de Cátedra").
Every content subpage redesigned since then gets its **own distinct visual
identity** tailored to its subject instead of reusing that shared theme — a
history page reads like an old atlas, a data-science page like a terminal, an
engineering page like a blueprint, and so on.

### Cuaderno de Cátedra (`index.html`, `galeria/galeria.html`)

A classroom chalkboard for hero/header surfaces and ruled notebook paper for
body content — replacing a generic purple-gradient theme.

### Palette & type

| Token | Value | Use |
|:---|:---|:---|
| `--dark` / `--dark-mid` | `#172922` / `#1E3229` | Chalkboard surfaces (header, hero, footer) |
| `--light` | `#F4F0E2` | Notebook paper surface (`.main-content`) |
| `--primary` | `#E3C468` | Chalk yellow — primary accent |
| `--secondary` / `--accent` | `#8FB8D6` | Chalk blue — secondary accent |
| `--ink` / `--ink-secondary` / `--ink-muted` | `#22352A` / `#5B6355` / `#8A8B76` | Text on paper surfaces |
| `--text-primary` / `--text-secondary` | `#F4F0E2` / `#A9B6A9` | Text on chalkboard surfaces |

Two text-color scopes exist by design: `--text-*` tokens are the light chalk
values used on dark surfaces (header, hero, dropdowns), while `--ink*` tokens
are dark values for the light paper surface — `.main-content` locally
reassigns `--text-primary/secondary/muted` to the ink tokens so shared
component rules (`.section-title`, `.stat-label`, etc.) resolve correctly
depending on which surface they render on.

Fonts: **Fraunces** (serif display, headings/logo), **Karla** (body/UI),
**JetBrains Mono** (data, stats, mono labels) — all loaded per-page via
Google Fonts `<link>`, no shared stylesheet across pages yet.

### What changed

| Area | Change |
|:---|:---|
| `index.html` + `style.css` | Full redesign: header/nav, hero, "The Platform" section, live-stats block (restyled as a wood-framed chalkboard slate with sticky-note stat cards), student gallery (Polaroid photos with washi tape), footer |
| `galeria/galeria.html` | Full standalone redesign (own embedded `<style>`, not shared with `style.css`) — same nav/hero/footer language, gallery grid reuses the Polaroid + tape treatment, hero background is a dedicated illustration (`galeria-header.png`) |
| `js/chatbot.js` | Chat widget re-themed from a generic purple gradient to the chalk palette; dead `.dark-mode` CSS removed. Icons since migrated again, see [Icons](#icons-lucide-svg) below |
| Dark mode toggle | Removed from `index.html` and `galeria.html` (`js/dark-mode.js` no longer loaded there) — the chalkboard identity is a fixed single theme. Other, not-yet-redesigned pages may still load it |
| Background images | `imagenes/stem-bg.png` (index hero) and the old `imagenes/galeria.png` were too saturated for the dark theme; index keeps its image with a stronger `multiply`-blended overlay, gallery now uses `imagenes/galeria-bg.jpg` (a real chalkboard photo, Pexels/Vitaly Gariev) plus `galeria/galeria-header.png` (dedicated hero illustration) |
| Bug fixes found along the way | `showActivityNotification()` in `supabase-analytics.js` was setting inline styles that ignored the real `.activity-notification` CSS class, rendering as a full-screen box on mobile Safari — fixed to use the class; a global `mouseenter`/`mouseleave` listener in `icon-animations.js` threw when `e.target` had no `classList` — guarded |

### Per-page identities (content subpages)

Each row below is a standalone `<style>` block (or, for the Ebook, a CSS
custom-property token swap) — no shared stylesheet across these pages.

| Page | Identity | Look & feel |
|:---|:---|:---|
| `contexto/historiamath.html` | Atlas de Civilizaciones | Sepia/parchment/copper, trade-route timeline, compass-rose hero |
| `materiales/materiales.html` | Fichero de Biblioteca | Library card-catalog aesthetic |
| `links/links.html` | Panel de Circuitos | Circuit-board aesthetic |
| `stem/ciencia-datos.html` | Terminal Ámbar | Dark hacker-terminal, amber-on-black; Chart.js globally re-themed |
| `stem/ingenieria.html` | Plano de Ingeniero | Blueprint-blue technical drawing, dashed title-block, corner registration marks |
| `stem/Ebook-STEM/` | Cuaderno de Campo Microbiológico | Warm cream/amber/teal lab-notebook theme; all interactive charts, simulations and accessibility toggles preserved |
| `club/investigacion.html` | Gaceta Científica | Editorial newspaper/gazette front page — masthead, drop cap, duotone archive photo, dated headlines |
| `club/project.html` | Mesa de Redacción | Companion identity to Gaceta Científica (same palette) reached via its "Comenzar Proyecto" CTA — manuscript-index sidebar, typewriter-draft editor, charts mounted as press clippings |
| `club/competencias.html` | Arena de Torneo | Esports scoreboard — black/gold-neon/electric-blue, Orbitron/Rajdhani/Share Tech Mono |
| `club/leaderboard.html` | Arena de Torneo *(companion)* | Same identity as `competencias.html`, reused deliberately — it's the public live-display screen for the same competition system |
| `club/olimpiadas.html` | Ceremonia Olímpica | Deep navy + medal gold + cream, Cinzel serif headings, laurel/medal ceremonial motifs |
| `club/admin.html` | Torre de Control | Dark slate air-traffic-control panel — cyan/amber/green/red accents, Barlow Condensed/Barlow/IBM Plex Mono, radar-ping status dot |
| `club/mision-matematica/` | Constelación Modular | Brutalist geometric — black/paper with lime + magenta accent, Space Grotesk/JetBrains Mono; canvas particles draw connecting lines between nearby nodes |
| `club/proyectos-creativos.html` | Feria de Inventos | Science-fair expo — cream poster-board cards pinned to a CSS-only corkboard texture, ribbon-blue/red/gold scoring, Permanent Marker/Archivo/JetBrains Mono |
| `club/modulos/*.html` (algebra, calculus, geometry, trigonometry, puzzles, statistics) | Consola Arcade | Shared system across all 6 competition/quiz modules — dark CRT cabinet chrome, scanline overlay, Press Start 2P pixel-font scores/titles, JetBrains Mono UI, shared easy/medium/hard semantic colors (mint/amber/red), each module keeping its own accent: algebra blue, calculus violet, geometry jade, trigonometry orange, puzzles magenta, statistics cyan |
| `club/registro.html` | Pasaporte del Competidor | Passport/enrollment-desk aesthetic — navy passport-cover header with a gold wax-seal emblem, cream document pages, dashed ticket-stub divider between the form and the live roster, Cormorant Garamond display + IBM Plex Mono for stamps/IDs |
| `lab/figuras.html` | Holograma Geométrico *(targeted polish, not a full rebuild)* | Already had a distinctive full-screen Three.js viewer (glass side panel, starfield, bloom) — kept it and added the site's missing top navigation bar (logo + back-to-home), Lucide icons on the category tabs and explode/wireframe controls, and put the previously-unused DM Mono import to work on the technical UI chrome |
| `lab/proyectiles.html` | Campo de Tiro | Firing-range palette (olive/khaki + blaze orange) over the page's existing light/dark dashboard system — canvas trajectory grid, results overlay and theory/guide cards re-themed via CSS custom properties (the physics canvas already read them, so no simulation code changed), Oswald display type, Lucide icons replacing every emoji, back-to-site nav added, and a dead duplicate `--font-mono` declaration fixed so the imported DM Mono is actually used |
| `lab/simulaciones.html` | Espiral Áurea | Golden-ratio/nature palette (warm parchment + gold/amber, meadow-green secondary accent) for the Fibonacci rabbit-reproduction model — same token names repointed to new hex values so every component (month cards, bubble physics, spiral visualizer, data table) re-themed without touching the physics/geometry JS; the golden-spiral mode's hue range already matched gold, mandala/polar modes kept their own distinct accent intentionally. Font Awesome + emoji (🐇💧🌀) replaced with Lucide SVG, including the rabbit-pair grid icons; Fraunces added for display type; back-to-site nav added |
| `lab/experimentos.html` | Mesa de Laboratorio | Clinical lab-bench palette (white/brushed-steel `--primary`/`--secondary`, millimeter graph-paper body background replacing the old `mathexp.png` + purple `.animated-bg`) across the 3-experiment hub (finance interest simulator, algebra balance scale, unit-circle trig explorer) — kept the existing `--success`/`--warning`/`--danger` token names as the per-station accent (finances/algebra/geometry) and repointed their values, so only the `<style>` block and a handful of hardcoded hex/rgba needed touching. Font Awesome + emoji converted to Lucide SVG across the main page *and* its 3 external scripts (`lab/javascript/finanzas.js`, `algebra.js`, `geometria.js`); the Plotly interest chart's trace colors, grid, and font (was `Inter`, a font this project avoids as generic) re-themed to match |
| `lab/juegos.html` | Coliseo Numérico | Roman-gladiator-colosseum reframe of the real-time Socket.IO multiplayer quiz "MATH ARENA" — replaced the neon void-black/cyan-pink-yellow-green esports look (too close to `club/competencias.html`'s existing Arena de Torneo identity) with torch-lit stone/basalt, imperial gold/blood-red/bronze/laurel-green accents, Marcellus display serif; lives (hearts) became gladiator shields, avatars/badges/verdicts moved to Lucide SVG. Also fixed the QR-join flow, which previously linked to a hardcoded production URL with no room code (scanning didn't actually get you into the room) — now builds the URL from `window.location` plus `?code=`, and the join screen auto-fills the code from that param. Socket.IO event contracts, timer, reconnection and elimination logic untouched |
| `stem/robotica.html` | *(unchanged, by request)* | Bug-fix-only pass — no visual redesign |
| `stem/programacion.html` | *(unchanged, by request)* | Bug-fix-only pass — no visual redesign |

Bugs found and fixed opportunistically along the way: a duplicate `<script>`
include and a redundant `DOMContentLoaded` wrapper that broke the Ebook's
scroll-spy sidebar; a DOM-named-access false positive
(`window.microModelChart`) that crashed the Ebook's model chart; a null
`this.renderer`/`this.scene` crash in `robot3d.js`'s `getStats()`; several
dead `../contexto/contexto.html` nav links (404) repointed to
`../contexto/historiamath.html`; and an unescaped-quote injection in
`club/project.html`'s Pyodide chart generator (a title/data value containing
a `"` broke the generated Python code).

More bugs found during the `club/` competition-system and admin passes: a
residual `⏳` emoji (outside the Unicode range an earlier regex swept) left in
`competencias.html`'s timer display and a welcome `alert()`; `podium-avatar`
text on gold/bronze rendering white-on-white in `leaderboard.html` (only
silver had a dark-text override); `olimpiadas.html`'s `[data-theme="dark"]`
selector actually applying the *light* palette (inverted naming, pre-existing)
— renamed so dark means dark; a CSS-specificity bug in
`mision-matematica/index.html` where a `.competition-card.featured *` wildcard
rule (2 classes) beat the single-class `.featured-badge` rule, rendering its
"Principal" label as black-on-black; and, in `admin.html`, two dangling CSS
variable references (`--gradient-primary`, `--color-gray-500`) left over from
the old palette that silently broke the participant-avatar gradient and the
row-subtitle color once the tokens were renamed.

`club/admin.html` also had **zero access control** — unlike the password
prompt gating the link to it from `olimpiadas.html`, the page itself loaded
and displayed real participant PII (names, emails, ages, schools) for anyone
who navigated to it directly, and the "Volver" link was the only thing
gating the *link*, not the destination. Fixed by adding the same client-side
password prompt directly on `admin.html`'s own `DOMContentLoaded`, blocking
all Supabase calls until it's entered correctly. This is not real
authentication (client-side only, same weak level already accepted
elsewhere on the site) — a proper fix needs server-side auth.

### Icons (Lucide SVG)

Every icon on every page listed above is an inline Lucide SVG — `fill="none"
stroke="currentColor"`, sized via `width:1em;height:1em` so it scales with
the surrounding text's `font-size` and inherits color from CSS — not Font
Awesome, not emoji. No icon-font or JS dependency; each page just embeds the
`<path>` data it needs. Path data is pulled from
`https://unpkg.com/lucide-static@latest/icons/<name>.svg` (ISC license),
picking the closest semantic match from [lucide.dev/icons](https://lucide.dev/icons).
Brand logos have no Lucide equivalent, so social/language icons fall back to
a generic stand-in (Python → `terminal`, LinkedIn → `link`, Facebook →
`message-circle`, Twitter/X → `at-sign`) rather than imitating the logo.

The Font Awesome CDN `<link>` is removed from a page once every icon on it
(including ones generated dynamically by its JS, like chat widgets or status
toasts) has been converted. As of this writing that's done on: `index.html`
(plus `js/chatbot.js` — including its ~100-entry historical-facts database,
each with its own icon — and `js/supabase-analytics.js`), `galeria/galeria.html`,
`contexto/historiamath.html`, `materiales/materiales.html`,
`stem/ciencia-datos.html`, `stem/ingenieria.html`, `stem/Ebook-STEM/index.html`,
`club/investigacion.html`, `club/project.html`, `club/competencias.html`,
`club/leaderboard.html`, `club/olimpiadas.html`, `club/admin.html`,
`club/mision-matematica/index.html`, `club/proyectos-creativos.html`,
`club/registro.html`, `club/modulos/algebra.html`, `calculus.html`,
`geometry.html`, `trigonometry.html`, `puzzles.html`, `statistics.html`,
`lab/figuras.html`, `lab/proyectiles.html`, `lab/simulaciones.html`,
`lab/experimentos.html` (plus its `lab/javascript/finanzas.js`, `algebra.js`,
and `geometria.js`), and `lab/juegos.html`. `links/links.html` never used Font
Awesome to begin with; `mision-matematica/index.html` used the `lucide.js`
CDN build (`data-lucide` attributes + `lucide.createIcons()`) rather than
Font Awesome, and was converted to the same inline-SVG-with-no-JS-dependency
pattern as every other page, dropping that CDN script too. Everything else
still uses Font Awesome and/or emoji — convert them the same way when they
get redesigned.

### Not yet redesigned

`lab/modulos/` (datos, fisica, geometrico, optimizacion), `salon/`,
`contexto/historiamath-examen.html`, `contexto/historiamath-preguntas.html`,
`contexto/profesor-dashboard.html`, `materiales/materiales/` (the
study-materials subpages), and `perfil-investigador/` still use the previous
purple/glassmorphism theme and `js/dark-mode.js`. Redesign them the same
way — one page at a time, each with its own identity — when needed.

---

## Project Structure

```
pagina-matematicas/
├── index.html                     # Main page with live analytics
├── club/                          # Mathematics Club
│   ├── competencias.html          # Real-time math competitions
│   ├── leaderboard.html           # Live leaderboard
│   ├── olimpiadas.html            # Math olympiads
│   ├── investigacion.html         # Math research hub
│   ├── proyectos-creativos.html   # Creative projects
│   ├── registro.html              # Member registration
│   └── modulos/                   # Interactive modules
│       ├── algebra.html
│       ├── calculus.html
│       ├── geometry.html
│       ├── trigonometry.html
│       ├── puzzles.html
│       └── statistics.html
├── materiales/                    # Study materials (library, exams, quizzes)
├── lab/                           # Virtual lab (simulations, figures, games)
├── salon/                         # Virtual classroom (algebra, stats, finance)
├── stem/                          # STEM modules + eBook STEAM
├── contexto/                      # History of Mathematics + timeline
├── galeria/                       # Student work gallery
├── links/                         # External resources
├── MathBattle/                    # Multiplayer Socket.IO game
├── js/
│   ├── i18n.js                    # ES ↔ EN language module
│   └── dark-mode.js               # Theme persistence
├── supabase-setup.sql             # Analytics schema
├── supabase-competition-setup.sql # Competition schema
└── vercel.json                    # Vercel config
```

---

## Supabase Database

### Analytics — `supabase-setup.sql`

| Table | Description |
|:---|:---|
| `analytics` | Global stats per page — visits and active users |
| `unique_visitors` | Unique visitors identified by `visitor_id` |
| `daily_stats` | Stats broken down by day and page |
| `realtime_activity` | Live activity feed (last 24 hours) |

### Competitions — `supabase-competition-setup.sql`

| Table | Description |
|:---|:---|
| `competitions` | One active competition at a time, with access codes and timer |
| `competition_participants` | Participants with scores per math area |

#### Available RPCs

| Function | Description |
|:---|:---|
| `get_active_competition()` | Gets or creates the active competition |
| `join_competition(code, visitor_id, name, school)` | Validates code and registers participant |
| `start_competition_timer(prof_code, competition_id)` | Professor starts the synchronized timer |
| `reset_competition(prof_code)` | Ends current session and creates a new one |
| `update_competition_score(participant_id, area, points, difficulty)` | Updates participant score in real time |

---

## Competition System

### Math Areas

`Algebra` · `Geometry` · `Calculus` · `Trigonometry` · `Mental Math` · `Puzzles`

### Competition Flow

```
Students enter code → name → school → dashboard
         ↓
Professor opens Leaderboard → Start Timer → enters professor code
         ↓
Timer starts simultaneously on ALL devices via Supabase Realtime
         ↓
Scores update live on leaderboard
         ↓
Admin → reset_competition → new clean session
```

<details>
<summary>🔐 Access Codes (private — click to reveal)</summary>

<br/>

**Student codes** (any of these):
| Code | Status |
|:---|:---|
| `MATH24` | Active |
| `COMP25` | Active |
| `STEM2024` | Active |

**Professor codes** (timer management & admin):
| Code | Purpose |
|:---|:---|
| `PROF2024` | Start timer |
| `RESET123` | Reset competition |
| `TEACHER01` | Admin access |

> ⚠️ Keep these codes private. Do not share in public channels.

</details>

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query**
3. Run `supabase-setup.sql` (analytics)
4. Run `supabase-competition-setup.sql` (competitions)
5. Update credentials in `index.html` and `club/competencias.html`:

```js
this.SUPABASE_URL      = 'https://YOUR_REF.supabase.co';
this.SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

> 🔒 Never commit real credentials. Use environment variables for production.

---

## Deploy on Vercel

Auto-deploys on every push to `main`:

```bash
git add .
git commit -m "feat: description"
git push origin main
```

---

## MathBattle (local)

```bash
cd MathBattle
npm install
npm start
```

---

## i18n System (ES ↔ EN)

Custom IIFE module — no external library.

```html
<!-- Add at the end of <body> on each page -->
<script src="../../js/i18n.js"></script>
<script>I18n.init();</script>
```

```js
I18n.setLanguage('en');          // Switch to English
I18n.setLanguage('es');          // Back to Spanish (reloads page)
I18n.getCurrentLang();           // Returns 'es' | 'en'
```

Language persists in `localStorage` under the key `lang`.

### Pages with active i18n

| Page | Notes |
|:---|:---|
| `index.html` | Typewriter hero, full navbar, stats |
| `contexto/historiamath.html` | AI in Education 1950–2025 timeline |
| `stem/Ebook STEM /index.html` | Sidebar toggle, path `../../js/i18n.js` |
| `club/competencias.html` | Dashboard, areas, timer, inline leaderboard |
| `club/leaderboard.html` | Stats, podium, records, activity |
| `club/olimpiadas.html` | Categories, problems, schedule, prizes |
| `club/mision-matematica/index.html` | Nav, hero typewriter, mission/vision, activities, resources, contact form |
| `perfil-investigador/index.html` | Independent `data-i18n` attribute system |

---

## Researcher Profile

Single-page academic profile — `perfil-investigador/index.html`

- 🌗 Dark / light mode with persistent theme (`localStorage`)
- 📊 6 Chart.js visualizations (Radar, Pie, Bar, Polar Area, Area Line)
- 📜 Doctoral dissertation with chapter navigation (I–V)
- ⏳ Interactive horizontal timeline — AI in Education 1950–2025
- 🎞️ Entry animations via IntersectionObserver

🔗 Live at [digitalmathematics.org/perfil-investigador](https://digitalmathematics.org/perfil-investigador/index.html)

---

## License

Educational project — **Prof. Yonatan Guerrero Soriano**
Puerto Rico Department of Education · Academic use

---

<div align="center">

**Building mathematics education that is interactive, accessible and data-driven.**

🌐 [digitalmathematics.org](https://digitalmathematics.org) · [LinkedIn](https://www.linkedin.com/in/yonatan-guerrero-soriano-6b3729136/) · [GitHub](https://github.com/JonatanGS777)

[Back to top](#digital-mathematics)

</div>
