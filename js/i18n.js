// i18n.js — Módulo de traducción ES ↔ EN
// Aplica a: index.html, historiamath.html, links.html, materiales.html, galeria.html,
//           club/competencias.html, club/leaderboard.html, club/olimpiadas.html,
//           club/investigacion.html, club/proyectos-creativos.html, club/registro.html

const I18n = (() => {

    // ── CSS del botón (inyectado automáticamente) ──────────────────────────
    function injectStyles() {
        if (document.getElementById('i18n-styles')) return;
        const style = document.createElement('style');
        style.id = 'i18n-styles';
        style.textContent = `
            #lang-toggle {
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
                padding: 0.4rem 0.85rem;
                background: rgba(255,255,255,0.12);
                border: 1px solid rgba(255,255,255,0.22);
                border-radius: 20px;
                color: #fff;
                font-family: 'Space Grotesk', 'Syne', sans-serif;
                font-size: 0.82rem;
                font-weight: 600;
                letter-spacing: 0.04em;
                cursor: pointer;
                backdrop-filter: blur(10px);
                transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                white-space: nowrap;
                flex-shrink: 0;
            }
            #lang-toggle:hover {
                background: rgba(255,255,255,0.22);
                box-shadow: 0 0 12px rgba(0,229,195,0.35);
                transform: translateY(-1px);
            }
            #lang-toggle:active { transform: translateY(0); }
        `;
        document.head.appendChild(style);
    }

    // ── Textos del hero (typewriter) — solo index.html ─────────────────────
    const heroTexts = {
        en: {
            mainTitle:    'Digital Mathematics',
            subtitle:     'Department of Education',
            professorName:'Prof. Yonatan Guerrero Soriano',
            description:  'Welcome to my digital classroom where mathematics come alive through technology, innovation, and interactive learning.'
        }
    };

    // ── Título de la pestaña ────────────────────────────────────────────────
    const titleDict = {
        en: {
            'Historia de las Matemáticas - Prof. Yonatan Guerrero': 'History of Mathematics - Prof. Yonatan Guerrero',
            'Enlaces Útiles - Matemáticas Digitales':               'Useful Links - Digital Mathematics',
            'Materiales Educativos - Matemáticas Digitales':        'Educational Materials - Digital Mathematics',
            'Galería de Proyectos - Matemáticas Digitales':         'Project Gallery - Digital Mathematics',
            'Matemáticas Digitales - Prof. Yonatan Guerrero':       'Digital Mathematics - Prof. Yonatan Guerrero',
            'Ciencia de Datos Interactiva':   'Interactive Data Science',
            'Ingeniería STEM':                'STEM Engineering',
            'Programación y Visualización':   'Programming and Visualization',
            'Robótica Avanzada':              'Advanced Robotics',
            'eBook STEAM - Matemáticas Digitales': 'eBook STEAM - Digital Mathematics',
            'eBook STEAM: Modelando Poblaciones de Bacterias': 'eBook STEAM: Modeling Bacterial Populations',
            // Club
            'Competencias Matemáticas Digitales - Prof. Yonatan Guerrero':
                'Digital Math Competitions - Prof. Yonatan Guerrero',
            'Tabla de Posiciones en Vivo - Competencias Matemáticas':
                'Live Leaderboard - Math Competitions',
            'Olimpiadas Matemáticas - Prof. Yonatan Guerrero':
                'Math Olympics - Prof. Yonatan Guerrero',
            'Investigación Matemática - Prof. Yonatan Guerrero':
                'Mathematical Research - Prof. Yonatan Guerrero',
            'Proyectos Creativos - Club Matemáticas | Prof. Yonatan Guerrero':
                'Creative Projects - Math Club | Prof. Yonatan Guerrero',
            'Registro - Olimpiadas Matemáticas':
                'Registration - Math Olympics',
        }
    };

    // ── Atributos (placeholder, title) ─────────────────────────────────────
    const attrDict = {
        en: {
            placeholder: { 'Buscar proyectos...': 'Search projects...' }
        }
    };

    // ── Diccionario principal de nodos de texto ────────────────────────────
    const textDict = {
        en: {
            // ── Común a varias páginas ──────────────────────────────────
            'Matemáticas Digitales':          'Digital Mathematics',
            'Historia Math':                  'Math History',
            'Yonatan Guerrero Soriano - Página de Matemáticas':
                'Yonatan Guerrero Soriano - Mathematics Page',
            '© 2025 Yonatan Guerrero Soriano - Página de Matemáticas':
                '© 2025 Yonatan Guerrero Soriano - Mathematics Page',
            'Inspirando el aprendizaje matemático a través de la tecnología':
                'Inspiring mathematical learning through technology',

            // ── index.html — Navbar (Σigma Digital) ────────────────────
            'Historia de las Matemáticas':    'History of Mathematics',
            'Enlaces':                        'Links',
            'Materiales':                     'Materials',
            'Galería':                        'Gallery',
            // STEM
            'Ciencia de Datos':               'Data Science',
            'Robótica':                       'Robotics',
            'Programación':                   'Programming',
            'Ingeniería':                     'Engineering',
            // Club
            'Club Matemáticas':               'Math Club',
            'Olimpiadas Math':                'Math Olympics',
            'Proyectos Creativos':            'Creative Projects',
            'Competencias':                   'Competitions',
            'Investigación':                  'Research',
            'Misión Matemática':              'Math Mission',
            // Lab
            'Laboratorio de Matemáticas':     'Math Laboratory',
            'Experimentos':                   'Experiments',
            'Simulaciones':                   'Simulations',
            'Laboratorio de Proyectiles':     'Projectile Lab',
            'Figuras Geométricas':            'Geometric Figures',
            // Aula
            'Δ Aula Matemática':              'Δ Math Classroom',
            'Álgebra':                        'Algebra',
            'Geometría':                      'Geometry',
            'Estadísticas':                   'Statistics',
            'Finanzas':                       'Finance',
            // Games
            'Juegos Matemáticos':             'Math Games',

            // ── index.html — About ──────────────────────────────────────
            'Sobre mí':                       'About Me',
            'Doctor en Educación':            'Doctor of Education',

            // ── index.html — Stats ─────────────────────────────────────
            'Análisis en Tiempo Real':        'Real-Time Analytics',
            'Datos actualizándose en vivo':   'Data updating live',
            'Visitantes Totales':             'Total Visitors',
            'Desde el lanzamiento':           'Since launch',
            'Visitantes Activos':             'Active Visitors',
            'En este momento':                'Right now',
            'Visitas Hoy':                    "Today's Visits",
            'Última actualización:':          'Last update:',
            'ahora':                          'now',
            'Páginas Vistas':                 'Page Views',
            'Total acumulado':                'Total accumulated',
            'Páginas Visistadas':             'Pages Visited',
            '% hoy':                          '% today',
            'ENCUESTA':                       'SURVEY',
            '¿Cuál es tu profesión?':         'What is your profession?',
            'Educación':                      'Education',
            'Ciencias':                       'Sciences',
            'Empresario':                     'Business',
            'Estudiante':                     'Student',
            'Maestro':                        'Teacher',
            '¡Gracias por votar!':            'Thank you for voting!',
            'Móvil':                          'Mobile',
            'Escritorio':                     'Desktop',
            'Tablet':                         'Tablet',
            'España':                         'Spain',
            'México':                         'Mexico',

            // ── index.html — Trabajos ───────────────────────────────────
            'Trabajos de los Estudiantes':    'Student Works',
            'Geometría Circular':             'Circular Geometry',
            'Un parque temático diseñado con matemáticas reales.':
                'A theme park designed with real mathematics.',
            'Ver imagen completa':            'View full image',

            // ── historiamath.html — Navbar ──────────────────────────────
            'Línea del Tiempo':               'Timeline',
            'Matemáticos':                    'Mathematicians',
            'Períodos':                       'Periods',
            'Preguntas':                      'Questions',
            'Examen':                         'Exam',

            // ── historiamath.html — Hero ────────────────────────────────
            'Historia de las Matemáticas':    'History of Mathematics',
            'Un Viaje a través del Tiempo':   'A Journey Through Time',
            'Años de Historia':               'Years of History',
            'Matemáticos Famosos':            'Famous Mathematicians',
            'Descubrimientos':                'Discoveries',

            // ── historiamath.html — Secciones ──────────────────────────
            'Línea del Tiempo Matemática':    'Mathematical Timeline',
            'Períodos Históricos':            'Historical Periods',
            'Datos Curiosos Matemáticos':     'Mathematical Fun Facts',
            'Matemáticos Legendarios':        'Legendary Mathematicians',

            // Timeline items
            'Matemáticas Mesopotámicas':      'Mesopotamian Mathematics',
            'Matemáticas Egipcias':           'Egyptian Mathematics',
            'Matemáticas Griegas':            'Greek Mathematics',
            'Elementos de Euclides':          'Euclid\'s Elements',
            'Era Islámica Dorada':            'Islamic Golden Age',
            'Renacimiento Matemático':        'Mathematical Renaissance',
            'Revolución Newtoniana':          'Newtonian Revolution',
            'Matemáticas Modernas':           'Modern Mathematics',

            // Períodos
            'Mesopotamia y Egipto':           'Mesopotamia and Egypt',
            'Era Griega':                     'Greek Era',
            'Era Islámica':                   'Islamic Era',
            'Renacimiento':                   'Renaissance',
            'Era Moderna':                    'Modern Era',
            '3000 - 600 a.C.':               '3000 - 600 BC',
            '600 a.C. - 400 d.C.':           '600 BC - 400 AD',
            '800 - 1200 d.C.':               '800 - 1200 AD',
            '1300 - 1600':                    '1300 - 1600',
            '1600 - Presente':               '1600 - Present',

            // Period highlights
            'Sistema sexagesimal babilónico': 'Babylonian sexagesimal system',
            'Numeración decimal egipcia':     'Egyptian decimal numeration',
            'Geometría práctica':             'Practical geometry',
            'Primeros algoritmos':            'First algorithms',
            'Teorema de Pitágoras':           'Pythagorean theorem',
            'Geometría euclidiana':           'Euclidean geometry',
            'Método de demostración':         'Proof method',
            'Números irracionales':           'Irrational numbers',
            'Desarrollo del álgebra':         'Development of algebra',
            'Sistema de numeración árabe':    'Arabic numeration system',
            'Trigonometría avanzada':         'Advanced trigonometry',
            'Traducción de textos griegos':   'Translation of Greek texts',
            'Secuencia de Fibonacci':         'Fibonacci sequence',
            'Ecuaciones cúbicas':             'Cubic equations',
            'Perspectiva matemática':         'Mathematical perspective',
            'Simbolismo algebraico':          'Algebraic symbolism',
            'Cálculo diferencial e integral': 'Differential and integral calculus',
            'Matemáticas computacionales':    'Computational mathematics',
            'Teoría de la relatividad':       'Theory of relativity',
            'Inteligencia artificial':        'Artificial intelligence',

            // Fun facts
            'El Símbolo de Infinito':         'The Infinity Symbol',
            'Pi es Infinito':                 'Pi is Infinite',
            'Eratóstenes y la Tierra':        'Eratosthenes and the Earth',
            'El Número Cero':                 'The Number Zero',

            // Mathematicians
            'Era Antigua':                    'Ancient Era',
            'Era Medieval':                   'Medieval Era',
            'Era Moderna':                    'Modern Era',
            'Descubrimientos':                'Discoveries',

            // ── links.html ──────────────────────────────────────────────
            'Enlaces Útiles':                 'Useful Links',
            'Recursos matemáticos y tecnológicos para el aprendizaje':
                'Mathematical and technological resources for learning',
            'Herramientas Matemáticas Digitales':
                'Digital Mathematical Tools',
            'Herramienta interactiva para geometría, álgebra y cálculo que permite visualizar conceptos matemáticos de forma dinámica.':
                'Interactive tool for geometry, algebra and calculus that allows dynamic visualization of mathematical concepts.',
            'Resuelve problemas matemáticos paso a paso, desde aritmética básica hasta cálculo avanzado.':
                'Solves math problems step by step, from basic arithmetic to advanced calculus.',
            'Utiliza la cámara de tu dispositivo para resolver problemas matemáticos de forma instantánea.':
                'Use your device\'s camera to solve math problems instantly.',
            'Plataforma gratuita para aprender matemáticas y otras disciplinas con videos y ejercicios interactivos.':
                'Free platform to learn mathematics and other subjects with videos and interactive exercises.',
            'Poderosa calculadora gráfica en línea para visualizar funciones y explorar conceptos matemáticos.':
                'Powerful online graphing calculator to visualize functions and explore mathematical concepts.',
            'Herramienta avanzada para resolver ecuaciones complejas con explicaciones paso a paso detalladas.':
                'Advanced tool for solving complex equations with detailed step-by-step explanations.',
            'Asistente de IA para resolver dudas y aprender matemáticas de forma interactiva y personalizada.':
                'AI assistant for solving doubts and learning mathematics in an interactive and personalized way.',
            'IA avanzada especializada en ayuda matemática y resolución de problemas complejos con explicaciones claras.':
                'Advanced AI specialized in mathematical assistance and solving complex problems with clear explanations.',
            'Inteligencia artificial de Google para asistencia matemática avanzada y análisis de problemas complejos.':
                'Google\'s artificial intelligence for advanced mathematical assistance and complex problem analysis.',

            // ── materiales.html ─────────────────────────────────────────
            'Materiales Educativos':          'Educational Materials',
            'Recursos didácticos para el aprendizaje de las matemáticas':
                'Teaching resources for mathematics learning',
            'Documentos Básicos':             'Basic Documents',
            'Guías de Estudio':               'Study Guides',
            'Ejercicios Prácticos':           'Practice Exercises',
            'Material de Repaso':             'Review Material',
            'Recursos Didácticos':            'Teaching Resources',
            'Evaluaciones':                   'Assessments',
            'Exámenes de Práctica':           'Practice Exams',
            'Pruebas Cortas':                 'Short Quizzes',
            'Rúbricas':                       'Rubrics',
            'Criterios de Evaluación':        'Evaluation Criteria',
            'Recursos Adicionales':           'Additional Resources',
            'Presentaciones':                 'Presentations',
            'Videos Educativos':              'Educational Videos',
            'Actividades Interactivas':       'Interactive Activities',
            'Material Suplementario':         'Supplementary Material',
            'Sobre los Materiales':           'About the Materials',
            'Documentos Básicos:':            'Basic Documents:',
            'Evaluaciones:':                  'Assessments:',
            'Recursos Adicionales:':          'Additional Resources:',
            'La matemática es la puerta y la llave de las ciencias':
                'Mathematics is the door and the key to the sciences',
            '- Roger Bacon':                  '— Roger Bacon',

            // ── STEM — común ────────────────────────────────────────────
            'Inicio':                         'Home',
            'Avanzado':                       'Advanced',
            'Básico':                         'Basic',
            'Intermedio':                     'Intermediate',
            'Probar TinkerCAD':               'Try TinkerCAD',
            'Probar Scratch':                 'Try Scratch',
            'Probar Fusion 360':              'Try Fusion 360',
            'Probar Arduino':                 'Try Arduino',
            '© 2025 Yonatan Guerrero Soriano - Matemáticas Digitales':
                '© 2025 Yonatan Guerrero Soriano - Digital Mathematics',

            // ── ciencia-datos.html ──────────────────────────────────────
            'Ciencia de Datos':               'Data Science',
            'Laboratorio Interactivo de Ciencia de Datos':
                'Interactive Data Science Laboratory',
            'Dashboard Interactivo':          'Interactive Dashboard',
            'Visualizador':                   'Visualizer',
            'Herramientas':                   'Tools',
            'Ejercicios':                     'Exercises',
            'Calculadoras':                   'Calculators',
            'Simulador':                      'Simulator',
            'Estudiantes Activos':            'Active Students',
            'Promedio General':               'General Average',
            'Tasa de Aprobación':             'Approval Rate',
            'Mejor Calificación':             'Best Score',
            'Notas por Materia - Datos en Vivo': 'Grades by Subject - Live Data',
            'Datos de Estudiantes (Editable)':'Student Data (Editable)',
            'Creador de Gráficas Personalizadas': 'Custom Chart Creator',
            'Explorador de Datasets':         'Dataset Explorer',
            '¿Qué herramientas usan los científicos de datos profesionales?':
                'What tools do professional data scientists use?',
            '¿Cómo puedes empezar a aprender estas herramientas?':
                'How can you start learning these tools?',
            '¿Qué trabajos puedes hacer con estas herramientas?':
                'What jobs can you do with these tools?',
            'Ejercicios Prácticos de Ciencia de Datos':
                'Practical Data Science Exercises',
            'Progreso de Ejercicios':         'Exercise Progress',
            'Simulador de Lanzamiento de Monedas': 'Coin Toss Simulator',
            'Generador de Datos Aleatorios':  'Random Data Generator',
            'Agregar Fila':                   'Add Row',
            'Actualizar Gráfica':             'Update Chart',
            'Generar Datos':                  'Generate Data',
            'Lanzar Moneda':                  'Flip Coin',
            'Lanzar 10 veces':                'Flip 10 times',
            'Reiniciar':                      'Reset',
            'Cara':                           'Heads',
            'Cruz':                           'Tails',

            // ── ingenieria.html ─────────────────────────────────────────
            'Ingeniería para Estudiantes de Secundaria':
                'Engineering for High School Students',
            '¿Qué es la Ingeniería?':         'What is Engineering?',
            'Ramas de la Ingeniería':         'Engineering Fields',
            'Ingeniería Civil':               'Civil Engineering',
            'Ingeniería Mecánica':            'Mechanical Engineering',
            'Ingeniería Eléctrica':           'Electrical Engineering',
            'Ingeniería Química':             'Chemical Engineering',
            'Ingeniería de Software':         'Software Engineering',
            'Ingeniería Aeroespacial':        'Aerospace Engineering',
            'Proyectos y Retos Prácticos':    'Projects and Practical Challenges',
            'Herramientas para Futuros Ingenieros': 'Tools for Future Engineers',
            'Puente de Espaguetis':           'Spaghetti Bridge',
            'Resistencia de materiales':      'Material strength',
            'Brazo Robótico Hidráulico':      'Hydraulic Robotic Arm',
            'Mecánica de fluidos':            'Fluid mechanics',
            'Coche Propulsado por Globos':    'Balloon-Powered Car',
            'Leyes de Newton':                'Newton\'s Laws',
            'Circuito LED':                   'LED Circuit',
            'Electricidad básica':            'Basic electricity',
            '¡Comienza a Explorar!':          'Start Exploring!',

            // ── programacion.html ───────────────────────────────────────
            'Programación y Visualización':   'Programming and Visualization',
            'Ejemplos de Código':             'Code Examples',
            'Gráfica de Resultados':          'Results Chart',
            'Generador de Gráficas Interactivo': 'Interactive Chart Generator',
            'Crea tu Propia Gráfica':         'Create Your Own Chart',
            'Código JavaScript Generado':     'Generated JavaScript Code',
            'Ejecutor de Código de Gráficas': 'Chart Code Executor',
            'Escribe tu Código JavaScript':   'Write your JavaScript Code',
            'Resultado del Código':           'Code Result',
            'Retos de Programación':          'Programming Challenges',
            'Sala de Clases':                 'Classroom',
            'Etiquetas (Eje X), separadas por comas:': 'Labels (X Axis), comma-separated:',
            'Datos (Eje Y), separados por comas:': 'Data (Y Axis), comma-separated:',
            'Tipo de Gráfica:':               'Chart Type:',
            'Barras':                         'Bars',
            'Líneas':                         'Lines',
            'Pastel':                         'Pie',
            'Dona':                           'Doughnut',
            'Generar Gráfica y Código':       'Generate Chart and Code',
            'Tu Gráfica Generada':            'Your Generated Chart',
            'Ejecutar Código':                'Run Code',
            'Probar Solución':                'Test Solution',
            'Verificar Solución':             'Check Solution',

            // ── robotica.html ───────────────────────────────────────────
            'Robótica Avanzada':              'Advanced Robotics',
            'Robótica Educativa Avanzada':    'Advanced Educational Robotics',
            'Robot 3D Ultra-Avanzado':        'Ultra-Advanced 3D Robot',
            'Programación Avanzada':          'Advanced Programming',
            'Controles Avanzados':            'Advanced Controls',
            'Sistema de Física':              'Physics System',
            'Control de Entorno':             'Environment Control',
            'Efectos Visuales':               'Visual Effects',
            'Optimización':                   'Optimization',
            'Controles Básicos':              'Basic Controls',
            'Acciones Especiales':            'Special Actions',
            'Efectos Avanzados':              'Advanced Effects',
            'Estadísticas del Robot':         'Robot Statistics',
            'Exportar/Importar':              'Export/Import',
            'Inicializando motor 3D avanzado...': 'Initializing advanced 3D engine...',
            'Cargando shaders y efectos visuales': 'Loading shaders and visual effects',

            // ── Ebook STEAM ──────────────────────────────────────────────
            'eBook STEAM':                    'eBook STEAM',
            'Modo de visualización:':         'Display mode:',
            'Tamaño de texto:':               'Text size:',
            'Contraste:':                     'Contrast:',
            'Claro':                          'Light',
            'Oscuro':                         'Dark',
            'Normal':                         'Normal',
            'Alto':                           'High',

            // Ebook sidebar nav
            'Introducción':                   'Introduction',
            'Relevancia STEAM':               'STEAM Relevance',
            'Nivel Educativo':                'Education Level',
            'Integración STEAM':              'STEAM Integration',
            'Metodología':                    'Methodology',
            'Simulación':                     'Simulation',
            'Casos Reales':                   'Real Cases',
            'Visualización Avanzada':         'Advanced Visualization',
            'Laboratorio Virtual':            'Virtual Lab',
            'Quiz Interactivo':               'Interactive Quiz',
            'Adaptaciones':                   'Adaptations',
            'Reflexión':                      'Reflection',
            'Glosario':                       'Glossary',
            'Referencias':                    'References',

            // Ebook section h2 titles
            'Descripción del Nivel Educativo': 'Education Level Description',
            'Objetivos de la Lección':        'Lesson Objectives',
            'Contenido de la Lección':        'Lesson Content',
            'Metodología y Actividades':      'Methodology & Activities',
            'Simulación Interactiva':         'Interactive Simulation',
            'Casos de Estudio Reales':        'Real Case Studies',
            'Reflexión Final':                'Final Reflection',
            'Metodología de Evaluación':      'Evaluation Methodology',

            // Ebook hero & badges
            'Modelando Poblaciones de Bacterias con el Modelo Logístico':
                'Modeling Bacterial Populations with the Logistic Model',
            'Modelando Poblaciones de Bacterias': 'Modeling Bacterial Populations',
            'Ir a la Simulación':             'Go to Simulation',
            'Por Yonatan Guerrero Soriano':   'By Yonatan Guerrero Soriano',

            // Ebook progress bar labels
            'Actividades':                    'Activities',

            // Ebook accessibility panel
            'Alto contraste':                 'High Contrast',
            'Activar animaciones':            'Enable animations',
            'Versión para imprimir':          'Print version',
            'Animaciones:':                   'Animations:',

            // Ebook simulation / tabs
            'Ejecutar Simulación':            'Run Simulation',
            'Simulaciones guardadas':         'Saved simulations',
            'Crecimiento Exponencial':        'Exponential Growth',
            'Crecimiento Logístico':          'Logistic Growth',
            'Comparación':                    'Comparison',

            // ── Club — competencias.html ─────────────────────────────────
            'Ver Tabla de Posiciones':        'View Leaderboard',
            'Iniciar Timer':                  'Start Timer',
            'Volver al Inicio':               'Back to Home',
            'Volver a Competencias':          'Back to Competitions',
            '🏆 Competencias Matemáticas Digitales': '🏆 Digital Mathematics Competitions',
            'Demuestra tus habilidades matemáticas en tiempo real':
                'Demonstrate your math skills in real time',
            'Participantes':                  'Participants',
            'Problemas':                      'Problems',
            'En Espera':                      'Waiting',
            'Estado':                         'Status',
            'Código de Acceso a la Competencia': 'Competition Access Code',
            '¡Código correcto! Acceso concedido a la competencia':
                'Correct code! Access granted to the competition',
            'Código incorrecto. Verifica e intenta nuevamente':
                'Incorrect code. Please verify and try again',
            'Acceder a la Competencia':       'Access the Competition',
            'Panel de Competencia':           'Competition Dashboard',
            'Tu Progreso en Tiempo Real':     'Your Real-Time Progress',
            'Ecuaciones, sistemas lineales, polinomios y funciones':
                'Equations, linear systems, polynomials and functions',
            'Fácil (5 pts)':                  'Easy (5 pts)',
            'Medio (10 pts)':                 'Medium (10 pts)',
            'Difícil (15 pts)':               'Hard (15 pts)',
            '30 problemas':                   '30 problems',
            '🚧 Próximamente':                '🚧 Coming Soon',
            'Figuras planas, sólidos, perímetros y áreas':
                'Plane figures, solids, perimeters and areas',
            'Límites, derivadas e integrales': 'Limits, derivatives and integrals',
            'Funciones trigonométricas, identidades y aplicaciones':
                'Trigonometric functions, identities and applications',
            'Datos, representaciones gráficas y análisis estadístico básico':
                'Data, graphical representations and basic statistical analysis',
            'Acertijos':                      'Puzzles',
            'Lógica matemática, patrones y desafíos mentales':
                'Mathematical logic, patterns and mental challenges',
            'Tiempo Restante':                'Time Remaining',
            'Puntos Totales':                 'Total Points',
            'Tabla de Posiciones en Vivo':    'Live Leaderboard',
            '¡COMPETENCIA INICIADA!':         'COMPETITION STARTED!',
            'Esperando Participantes':        'Waiting for Participants',
            'Los participantes aparecerán aquí cuando ingresen con el código de acceso':
                'Participants will appear here when they enter with the access code',
            'Timer Iniciado':                 'Timer Started',

            // ── Club — leaderboard.html ──────────────────────────────────
            'Tabla de Posiciones':            'Leaderboard',
            'EN VIVO':                        'LIVE',
            'Actualizar':                     'Refresh',
            'Participantes Activos':          'Active Participants',
            'Puntuación Promedio':            'Average Score',
            'Puntuación Máxima':              'Top Score',
            'Actualización automática cada 10 segundos':
                'Automatic update every 10 seconds',
            'Rendimiento por Área':           'Performance by Area',
            'Actividad Reciente':             'Recent Activity',
            'Récords de Hoy':                 "Today's Records",
            'Mejor Tiempo':                   'Best Time',
            'Racha Máxima':                   'Max Streak',
            'Más Activo':                     'Most Active',
            'No hay actividad reciente':      'No recent activity',
            'Sin datos de rendimiento':       'No performance data',

            // ── Club — olimpiadas.html ───────────────────────────────────
            'Olimpiadas':                     'Olympics',
            'Recursos':                       'Resources',
            'Olimpiadas Matemáticas':         'Math Olympics',
            'Escuela Superior María Teresa Piñeiro - Club de Matemáticas':
                'María Teresa Piñeiro High School - Math Club',
            'Practica y Prepárate para las olimpiadas':
                'Practice and Prepare for the Olympics',
            'Nuestras Olimpiadas Presenciales': 'Our In-Person Olympics',
            'Categoría Novato':               'Novice Category',
            'Problemas de lógica divertidos': 'Fun logic problems',
            'Acertijos matemáticos básicos':  'Basic math puzzles',
            'Geometría elemental':            'Elementary geometry',
            'Retos numéricos creativos':      'Creative number challenges',
            'Categoría Intermedia':           'Intermediate Category',
            'Álgebra y ecuaciones complejas': 'Algebra and complex equations',
            'Problemas de razonamiento lógico': 'Logical reasoning problems',
            'Geometría aplicada':             'Applied geometry',
            'Desafíos de probabilidad':       'Probability challenges',
            'Categoría Avanzada':             'Advanced Category',
            'Problemas de olimpiadas internacionales': 'International olympiad problems',
            'Demostraciones matemáticas':     'Mathematical proofs',
            'Pensamiento abstracto complejo': 'Complex abstract thinking',
            'Problemas de Práctica':          'Practice Problems',
            'Reto de Combinatoria':           'Combinatorics Challenge',
            'Desafío Geométrico':             'Geometric Challenge',
            'Acertijo Numérico':              'Numerical Puzzle',
            'Calendario Escolar 2025':        'School Calendar 2025',
            'Agosto':                         'August',
            'Inicio del Club':                'Club Start',
            'Octubre':                        'October',
            'Mini-Olimpiada de Otoño':        'Fall Mini-Olympics',
            'Marzo':                          'March',
            'Semana de las Matemáticas':      'Math Week',
            'Mayo':                           'May',
            'Gran Olimpiada Anual':           'Annual Grand Olympics',
            'Premios y Reconocimientos':      'Awards and Recognition',
            'Primer Lugar':                   'First Place',
            'Trofeo personalizado grabado':   'Custom engraved trophy',
            'Calculadora científica avanzada': 'Advanced scientific calculator',
            'Kit de geometría profesional':   'Professional geometry kit',
            'Segundo Lugar':                  'Second Place',
            'Medalla de plata oficial':       'Official silver medal',
            'Colección de libros matemáticos': 'Mathematics book collection',
            'Material escolar especializado': 'Specialized school supplies',
            'Tercer Lugar':                   'Third Place',
            'Medalla de bronce conmemorativa': 'Commemorative bronze medal',
            'Juegos matemáticos educativos':  'Educational math games',
            'Cupones de cafetería escolar':   'School cafeteria coupons',
            'Enfoque General del Club de Matemáticas': 'Math Club General Approach',
            'Estudiantes preparados para Competir': 'Students Prepared to Compete',
            'Listos para Destacarse y Solucionar problemas':
                'Ready to Excel and Solve Problems',
            'Desarrollar Capacidades Analíticas': 'Develop Analytical Skills',
            'Participar en Eventos':          'Participate in Events',
            '¿Listo para el Desafío?':        'Ready for the Challenge?',
            'Registrarse Ahora':              'Register Now',
            'Participantes Inscritos':        'Registered Participants',
            'Total':                          'Total',
            'Novato':                         'Novice',
            'Intermedia':                     'Intermediate',
            'Avanzada':                       'Advanced',
            'Cargando...':                    'Loading...',
            'Escuela':                        'School',
            'Categoría':                      'Category',
            'Selecciona tu categoría':        'Select your category',
            'Grado escolar':                  'School grade',
            'Selecciona tu grado':            'Select your grade',
            'Número de estudiante':           'Student number',

            // ── Club — investigacion.html ────────────────────────────────
            'Investigación Matemática':       'Mathematical Research',
            'Descubre, Explora, Innova':      'Discover, Explore, Innovate',
            'Proyectos Activos':              'Active Projects',
            'Áreas de Investigación':         'Research Areas',
            'Estudiantes Investigadores':     'Student Researchers',
            'Publicaciones':                  'Publications',
            'Análisis de Datos Matemáticos':  'Mathematical Data Analysis',
            'Matemáticas Puras':              'Pure Mathematics',
            'Teoría de Números':              'Number Theory',
            'Topología':                      'Topology',
            'Matemáticas Aplicadas':          'Applied Mathematics',
            'Modelado':                       'Modeling',
            'Física Matemática':              'Mathematical Physics',
            'Biomatemáticas':                 'Biomathematics',
            'Criptografía':                   'Cryptography',
            'Seguridad':                      'Security',
            'Metodología de Investigación':   'Research Methodology',
            'Observación':                    'Observation',
            'Hipótesis':                      'Hypothesis',
            'Investigación':                  'Research',
            'Experimentación':                'Experimentation',
            'Análisis':                       'Analysis',
            'Publicación':                    'Publication',
            'Recursos y Herramientas':        'Resources and Tools',
            'Bases de Datos':                 'Databases',
            'Biblioteca Digital':             'Digital Library',
            'Mentores Expertos':              'Expert Mentors',
            'Conferencias Virtuales':         'Virtual Conferences',
            'Cronograma de Investigación':    'Research Schedule',
            'Agosto 2025':                    'August 2025',
            'Convocatoria de Proyectos':      'Project Call',
            'Septiembre 2025':                'September 2025',
            'Fase de Investigación':          'Research Phase',
            'Octubre 2025':                   'October 2025',
            'Noviembre 2025':                 'November 2025',
            'Análisis de Resultados':         'Results Analysis',
            'Diciembre 2025':                 'December 2025',
            'Feria de Investigación':         'Research Fair',
            '¿Listo para ser un Investigador?': 'Ready to be a Researcher?',
            'Formando la próxima generación de investigadores matemáticos':
                'Training the next generation of mathematical researchers',

            // ── Club — proyectos-creativos.html ─────────────────────────
            'Proyectos Creativos':            'Creative Projects',
            'Guía Paso a Paso':               'Step-by-Step Guide',

            // ── Club — registro.html ─────────────────────────────────────
            'Volver a Olimpiadas':            'Back to Olympics',
            'Registro para el Club de Matemáticas': 'Registration for the Math Club',
            'Formulario de Registro':         'Registration Form',
            'Conectando a Supabase...':       'Connecting to Supabase...',
            '¡Registro exitoso!':             'Registration successful!',
            'Error en el registro':           'Registration error',
            'Información':                    'Information',
            'Email válido requerido':         'Valid email required',
            'Edad entre 10-25 años':          'Age between 10-25 years',
            'Seleccionar grado':              'Select grade',
            'Seleccione un grado':            'Select a grade',
            'Seleccionar categoría':          'Select category',
            'Seleccione una categoría':       'Select a category',
            'Registrarse en las Olimpiadas':  'Register for the Olympics',
            'Participantes Registrados':      'Registered Participants',
            'Estudiantes':                    'Students',
            'Hoy':                            'Today',
            'Aún no hay participantes registrados.': 'No participants registered yet.',
            '¡Sé el primero en registrarte!': 'Be the first to register!',
            'Error cargando participantes':   'Error loading participants',
            'Configuración pendiente':        'Configuration pending',
            'Actualiza SUPABASE_CONFIG con tus credenciales':
                'Update SUPABASE_CONFIG with your credentials',

            // ── galeria.html ────────────────────────────────────────────
            'Galería de Proyectos':           'Project Gallery',
            'Exposición de los trabajos creativos de nuestros estudiantes':
                'Exhibition of our students\' creative work',
            'Proyectos':                      'Projects',
            'Año Académico':                  'Academic Year',
            'Participación':                  'Participation',
            'Todos los Proyectos':            'All Projects',
            'Recientes':                      'Recent',
            'Destacados':                     'Featured',
            'Proyecto Estudiantil':           'Student Project',
            'Trabajo realizado por estudiantes de matemáticas':
                'Work done by mathematics students',
        }
    };

    // ── Párrafos de texto plano ────────────────────────────────────────────
    const paraDict = {
        en: {
            // index.html — About
            'Mi nombre es Yonatan Guerrero Soriano, maestro de matemáticas en el Departamento de Educación de Puerto Rico, y tengo el honor de compartir con ustedes mi pasión por las matemáticas. Me especializo en las matemáticas, ciencias y tecnología y con un fuerte enfoque educativo.':
                'My name is Yonatan Guerrero Soriano, a mathematics teacher at the Department of Education of Puerto Rico, and I have the honor of sharing my passion for mathematics with you. I specialize in mathematics, science, and technology with a strong educational focus.',
            'El propósito de esta página es ofrecer a mis estudiantes un recurso integral donde puedan acceder a materiales didácticos, videos educativos, enlaces útiles y aplicaciones interactivas que apoyen su aprendizaje en matemáticas. Mi objetivo es facilitar el acceso a herramientas que les ayuden a desarrollar sus habilidades matemáticas y aplicar el conocimiento en su vida diaria.':
                'The purpose of this page is to offer my students a comprehensive resource where they can access teaching materials, educational videos, useful links, and interactive applications that support their mathematics learning. My goal is to facilitate access to tools that help them develop their mathematical skills and apply knowledge in their daily lives.',

            // historiamath.html — Hero description
            'Descubre cómo las matemáticas han evolucionado desde las civilizaciones antiguas hasta nuestros días. \n                Explora los grandes descubrimientos, conoce a los genios matemáticos y entiende cómo cada época \n                contribuyó al desarrollo del conocimiento matemático que usamos hoy.':
                'Discover how mathematics has evolved from ancient civilizations to the present day. Explore great discoveries, meet mathematical geniuses and understand how each era contributed to the development of the mathematical knowledge we use today.',

            // links.html — Hero description
            'Descubre una colección cuidadosamente seleccionada de herramientas digitales, \n                aplicaciones y plataformas que transformarán tu experiencia de aprendizaje matemático.':
                'Discover a carefully selected collection of digital tools, applications and platforms that will transform your mathematics learning experience.',

            // club/investigacion.html
            'Explora patrones ocultos en grandes conjuntos de datos utilizando herramientas estadísticas avanzadas y técnicas de visualización innovadoras.':
                'Explore hidden patterns in large datasets using advanced statistical tools and innovative visualization techniques.',
            'Investiga en teoría de números, álgebra abstracta y análisis matemático para expandir los fundamentos teóricos de las matemáticas.':
                'Research in number theory, abstract algebra and mathematical analysis to expand the theoretical foundations of mathematics.',
            'Desarrolla modelos matemáticos para resolver problemas del mundo real en ciencias, ingeniería y tecnología.':
                'Develop mathematical models to solve real-world problems in science, engineering and technology.',
            'Investiga algoritmos de aprendizaje automático y redes neuronales para crear sistemas inteligentes innovadores.':
                'Research machine learning algorithms and neural networks to create innovative intelligent systems.',
            'Aplica modelos matemáticos para entender procesos biológicos complejos y desarrollar soluciones médicas innovadoras.':
                'Apply mathematical models to understand complex biological processes and develop innovative medical solutions.',
            'Desarrolla métodos de encriptación seguros y estudia la seguridad de sistemas criptográficos modernos.':
                'Develop secure encryption methods and study the security of modern cryptographic systems.',
            'Lista en tiempo real de estudiantes registrados por categoría.':
                'Real-time list of students registered by category.',
            'Aún no hay participantes registrados.': 'No participants registered yet.',
            '¡Sé el primero en registrarte!': 'Be the first to register!',
            '© 2025 Prof. Yonatan Guerrero - Club de Matemáticas':
                '© 2025 Prof. Yonatan Guerrero - Math Club',
            'Inspirando el amor por las matemáticas en nuestra escuela':
                'Inspiring the love of mathematics in our school',
            '© 2025 Yonatan Guerrero Soriano - Investigación Matemática':
                '© 2025 Yonatan Guerrero Soriano - Mathematical Research',
            'Formando la próxima generación de investigadores matemáticos':
                'Training the next generation of mathematical researchers',
            'Ingresa el código proporcionado por el profesor para acceder a la competencia':
                'Enter the code provided by the teacher to access the competition',

            // materiales.html
            'Bienvenidos a la sección de materiales educativos. Esta colección ha sido cuidadosamente seleccionada y desarrollada para apoyar el proceso de enseñanza-aprendizaje de las matemáticas. Los recursos están organizados en tres categorías principales para facilitar su acceso y uso:':
                'Welcome to the educational materials section. This collection has been carefully selected and developed to support the mathematics teaching-learning process. Resources are organized into three main categories to facilitate access and use:',
            'Estos materiales se actualizan regularmente para asegurar su relevancia y alineación con los estándares curriculares vigentes. Se recomienda revisar periódicamente esta sección para acceder a los nuevos recursos disponibles.':
                'These materials are regularly updated to ensure their relevance and alignment with current curricular standards. It is recommended to review this section periodically to access newly available resources.',
        }
    };

    // ── Párrafos con HTML interno ──────────────────────────────────────────
    const htmlParaDict = {
        en: {
            // index.html — Student Works
            'Los estudiantes aplicaron longitud de arco y área del sector circular para dar forma a cada zona temática, convirtiendo fórmulas abstractas en decisiones de diseño concretas. El proceso fomentó el trabajo en equipo, la creatividad y el pensamiento crítico — demostrando que la matemática no solo se aprende, se construye.':
                'Students applied <strong>arc length and circular sector area</strong> to shape each thematic zone, turning abstract formulas into concrete design decisions. The process fostered teamwork, creativity, and critical thinking — demonstrating that mathematics is not only learned, it is built.',

            // materiales.html — list items with <strong>
            'Incluye materiales fundamentales para el estudio y práctica de los conceptos matemáticos, diseñados para reforzar el aprendizaje en el aula.':
                'Includes fundamental materials for the study and practice of mathematical concepts, designed to reinforce classroom learning.',
            'Proporciona herramientas para la valoración del progreso académico, permitiendo a los estudiantes autoevaluar su comprensión de los temas.':
                'Provides tools for assessing academic progress, allowing students to self-evaluate their understanding of topics.',
            'Ofrece materiales complementarios que enriquecen el aprendizaje a través de diferentes medios y aproximaciones pedagógicas.':
                'Offers complementary materials that enrich learning through different media and pedagogical approaches.',
        }
    };

    let currentLang = localStorage.getItem('lang') || 'es';

    // ── Paso 1: nodos de texto simples ─────────────────────────────────────
    function translateTextNodes(lang) {
        const dict = textDict[lang];
        if (!dict) return;

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const tag = node.parentElement?.tagName;
                    if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        let node;
        while ((node = walker.nextNode())) nodes.push(node);

        nodes.forEach(node => {
            const trimmed = node.textContent.trim();
            if (trimmed && dict[trimmed]) {
                node.textContent = node.textContent.replace(trimmed, dict[trimmed]);
            }
        });
    }

    // ── Paso 2: párrafos de texto plano ────────────────────────────────────
    function translateParagraphs(lang) {
        const dict = paraDict[lang];
        if (!dict) return;

        document.querySelectorAll('p, li').forEach(el => {
            const key = el.textContent.trim();
            if (dict[key]) el.textContent = dict[key];
        });
    }

    // ── Paso 3: párrafos con HTML interno ──────────────────────────────────
    function translateHtmlElements(lang) {
        const dict = htmlParaDict[lang];
        if (!dict) return;

        document.querySelectorAll('p, li').forEach(el => {
            const key = el.textContent.trim();
            if (dict[key]) el.innerHTML = dict[key];
        });
    }

    // ── Paso 4: atributos (placeholder, etc.) ──────────────────────────────
    function translateAttributes(lang) {
        const dict = attrDict[lang];
        if (!dict) return;

        if (dict.placeholder) {
            document.querySelectorAll('[placeholder]').forEach(el => {
                const key = el.getAttribute('placeholder');
                if (dict.placeholder[key]) el.setAttribute('placeholder', dict.placeholder[key]);
            });
        }
    }

    // ── Paso 5: título de la pestaña ───────────────────────────────────────
    function translateTitle(lang) {
        const dict = titleDict[lang];
        if (!dict) return;
        if (dict[document.title]) document.title = dict[document.title];
    }

    // ── Paso 6: hero (typewriter) — solo index.html ────────────────────────
    function translateHero(lang) {
        const texts = heroTexts[lang];
        if (!texts) return;

        const tryUpdate = () => {
            const map = { mainTitle: 'mainTitle', subtitle: 'subtitle', professorName: 'professorName', description: 'description' };
            Object.entries(map).forEach(([key, id]) => {
                const el = document.getElementById(id);
                if (el && el.textContent.trim()) el.textContent = texts[key];
            });
        };

        tryUpdate();
        setTimeout(tryUpdate, 4000);
        setTimeout(tryUpdate, 7000);
    }

    // ── Actualiza el botón ─────────────────────────────────────────────────
    function updateButton(lang) {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        if (lang === 'en') {
            btn.innerHTML = '🇵🇷 ES';
            btn.title = 'Cambiar a Español';
        } else {
            btn.innerHTML = '🇺🇸 EN';
            btn.title = 'Switch to English';
        }
    }

    // ── API pública ────────────────────────────────────────────────────────
    function applyTranslation(lang) {
        translateTextNodes(lang);
        translateParagraphs(lang);
        translateHtmlElements(lang);
        translateAttributes(lang);
        translateTitle(lang);
        translateHero(lang);
        updateButton(lang);
        document.documentElement.lang = lang;
    }

    function setLanguage(lang) {
        if (lang === 'es') {
            localStorage.setItem('lang', 'es');
            location.reload();
            return;
        }
        if (lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslation(lang);
    }

    function init() {
        injectStyles();
        const saved = localStorage.getItem('lang') || 'es';
        currentLang = saved;
        updateButton(saved);
        if (saved === 'en') applyTranslation('en');
    }

    return { setLanguage, init, getCurrentLang: () => currentLang };
})();
