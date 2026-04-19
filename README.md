# Digital Mathematics

Educational mathematics platform with interactive resources, real-time competitions, STEM modules and a virtual lab. Developed by Prof. Yonatan Guerrero Soriano for the Puerto Rico Department of Education.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Database | Supabase (PostgreSQL) |
| Real-time | Supabase Realtime (`postgres_changes`) |
| Deploy | Vercel (auto-deploy from GitHub) |
| MathBattle | Node.js + Express + Socket.IO |

## Project Structure

```
pagina-matematicas/
├── index.html                        # Main page with live analytics
│
├── club/                             # Mathematics Club
│   ├── competencias.html             # Math competitions (Supabase real-time)
│   ├── leaderboard.html              # Live leaderboard
│   ├── admin.html                    # Admin panel
│   ├── olimpiadas.html               # Math olympiads
│   ├── investigacion.html            # Math research
│   ├── proyectos-creativos.html      # Creative projects
│   ├── registro.html                 # Member registration
│   └── modulos/                      # Interactive modules by area
│       ├── algebra.html
│       ├── calculus.html
│       ├── geometry.html
│       ├── trigonometry.html
│       ├── puzzles.html
│       └── statistics.html
│
├── materiales/materiales/            # Study materials
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
├── lab/                              # Interactive virtual lab
│   ├── experimentos.html
│   ├── simulaciones.html
│   ├── juegos.html
│   ├── figuras.html
│   ├── proyectiles.html
│   └── modulos/ (data, physics, geometric, optimization)
│
├── salon/                            # Virtual classroom
│   ├── algebra.html
│   ├── geometria.html
│   ├── estadisticas.html
│   ├── finanzas.html
│   └── game.html
│
├── stem/                             # STEM section
│   ├── programacion.html
│   ├── robotica.html
│   ├── ingenieria.html
│   ├── ciencia-datos.html
│   └── Ebook STEM/
│
├── contexto/                         # History of Mathematics
│   ├── historiamath.html
│   ├── historiamath-examen.html
│   └── profesor-dashboard.html
│
├── galeria/                          # Student work gallery
├── links/                            # External resources & links
│
├── MathBattle/                       # Multiplayer game (Socket.IO)
│
├── supabase-setup.sql                # Analytics schema
├── supabase-competition-setup.sql    # Competition system schema
└── vercel.json                       # Vercel configuration
```

## Supabase Database

### Analytics — `supabase-setup.sql`

| Table | Description |
|---|---|
| `analytics` | Global stats per page (visits, active users) |
| `unique_visitors` | Unique visitors identified by `visitor_id` |
| `daily_stats` | Stats by day and page |
| `realtime_activity` | Real-time activity feed (last 24h) |

### Competitions — `supabase-competition-setup.sql`

| Table | Description |
|---|---|
| `competitions` | One active competition at a time, with codes and timer |
| `competition_participants` | Participants with scores per math area |

#### Available RPCs

| Function | Description |
|---|---|
| `get_active_competition()` | Gets or creates the active competition |
| `join_competition(code, visitor_id, name, school)` | Validates code and registers participant |
| `start_competition_timer(prof_code, competition_id)` | Professor starts the timer |
| `reset_competition(prof_code)` | Ends the current and creates a new one |
| `update_competition_score(participant_id, area, points, difficulty)` | Updates a participant's area score |

## Competition System

### Access Codes

**Students** (any of these):
- `MATH24`
- `COMP25`
- `STEM2024`

**Professor** (to start timer and manage):
- `PROF2024`
- `RESET123`
- `TEACHER01`

### Math Areas
Algebra · Geometry · Calculus · Trigonometry · Mental Math · Puzzles

### Competition Flow

1. Students enter a code → name → school → enter dashboard
2. Professor opens the **Leaderboard** or dashboard → **Start Timer** → enters professor code
3. The timer starts simultaneously on **all devices** via Supabase Realtime
4. Scores update in real time on the leaderboard
5. When finished: **Admin** → `reset_competition` creates a new clean session

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

## Deploy on Vercel

The project deploys automatically on every push to `main`:

```bash
git add .
git commit -m "description"
git push origin main
```

## MathBattle (local)

Multiplayer math game powered by Socket.IO:

```bash
cd MathBattle
npm install
npm start
```

## Researcher Profile (`perfil-investigador/index.html`)

Single-page academic profile of Dr. Yonatan Guerrero Soriano with an editorial design.

### Features
- Dark / light mode with blue theme (`#2563eb`) in light and gold (`#d4a574`) in dark
- Persistent theme toggle via `localStorage`
- Responsive hamburger menu
- Interactive horizontal timeline with drag-to-scroll (AI in Education 1950–2025)
- Doctoral dissertation section with chapter navigation (I–V)
- 6 Chart.js charts (Radar, Pie, Horizontal Bars, Grouped Bars, Polar Area, Area Line)
- Chart colors update on theme toggle
- Entry animations with IntersectionObserver
- Counter and progress bar animations in the Results section

## i18n System (ES ↔ EN)

### Main file: `js/i18n.js`

IIFE module that manages language switching across the platform. Loaded **without `defer`** at the end of each page's `<body>`, followed by `I18n.init()`.

```html
<script src="../../js/i18n.js"></script>
<script>I18n.init();</script>
```

#### How it works

The module applies translations in 6 steps:
1. **`translateTextNodes`** — walks the DOM with `TreeWalker` and replaces plain text nodes
2. **`translateParagraphs`** — finds `<p>` and `<li>` whose `textContent` matches the dictionary
3. **`translateHtmlElements`** — same as above but replaces `innerHTML` (for inner `<strong>` tags)
4. **`translateAttributes`** — replaces attributes like `placeholder`
5. **`translateTitle`** — updates the browser tab `<title>`
6. **`translateHero`** — updates the animated hero block (only `index.html`, with retries at 4s and 7s)

#### Language switching

```js
// Switch to English
I18n.setLanguage('en');

// Back to Spanish (reloads the page)
I18n.setLanguage('es');

// Get current language
I18n.getCurrentLang(); // 'es' | 'en'
```

Language is persisted in `localStorage` under the key `lang`. If the value is `'es'` or missing, the page shows its original HTML; if `'en'`, translations are applied on load.

#### Toggle button

Each page exposes a `<button id="lang-toggle">` that calls the module:

```html
<button id="lang-toggle"
    onclick="I18n.setLanguage(I18n.getCurrentLang() === 'es' ? 'en' : 'es')">
    🇺🇸 EN
</button>
```

The module automatically injects button styles (rounded pill, glass effect) — no extra CSS needed per page.

### Pages with active i18n

| Page | Path | Notes |
|---|---|---|
| Main | `index.html` | Typewriter hero, full navbar, stats, student work |
| Math History | `contexto/historiamath.html` | Timeline, periods, mathematicians |
| STEAM eBook | `stem/Ebook STEM /index.html` | Toggle in sidebar-header; path `../../js/i18n.js` |
| Links | `links/links.html` | Tool descriptions |
| Materials | `materiales/materiales.html` | Categories and descriptions |
| Gallery | `galeria/galeria.html` | Titles and labels |
| Competitions | `club/competencias.html` | Dashboard, areas, timer, inline leaderboard |
| Leaderboard | `club/leaderboard.html` | Stats, podium, records, activity |
| Olympiads | `club/olimpiadas.html` | Categories, problems, schedule, prizes |
| Research | `club/investigacion.html` | Areas, methodology, timeline |
| Creative Projects | `club/proyectos-creativos.html` | Guide, nav |
| Registration | `club/registro.html` | Form, participants |
| Researcher Profile | `perfil-investigador/index.html` | Independent `data-i18n` attribute system |
| Math Mission | `club/mision-matematica/index.html` | Green accent pill button, Exo 2 font |

## License

Educational project by Prof. Yonatan Guerrero Soriano — academic use for the Puerto Rico Department of Education.

---

🌐 [digitalmathematics.org](https://digitalmathematics.org) · [LinkedIn](https://www.linkedin.com/in/yonatan-guerrero-soriano-6b3729136/)
