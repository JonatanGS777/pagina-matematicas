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

[Features](#features) · [Tech Stack](#tech-stack) · [Structure](#project-structure) · [Setup](#supabase-setup) · [Deploy](#deploy-on-vercel)

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
| **Fonts** | Google Fonts — JetBrains Mono, Space Grotesk, Playfair Display |

</div>

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
