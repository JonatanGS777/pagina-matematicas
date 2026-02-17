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

## Licencia

Proyecto educativo del Prof. Yonatan Guerrero Soriano — uso académico en el Departamento de Educación de Puerto Rico.
