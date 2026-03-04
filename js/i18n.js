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
            'Creador de Proyectos - Prof. Yonatan Guerrero (Versión Mejorada)':
                'Project Creator - Prof. Yonatan Guerrero (Enhanced Version)',
        }
    };

    // ── Atributos (placeholder, title) ─────────────────────────────────────
    const attrDict = {
        en: {
            placeholder: {
                'Buscar proyectos...': 'Search projects...',
                'Buscar término...':   'Search term...',
                // project.html
                'Ej: Análisis de Patrones Fractales en Sistemas Dinámicos': 'E.g.: Analysis of Fractal Patterns in Dynamic Systems',
                'Tu nombre completo': 'Your full name',
                'Nombre de tu escuela o institución': 'Name of your school or institution',
                'Escribe aquí la introducción de tu proyecto...': 'Write the introduction to your project here...',
                'Analiza y sintetiza los trabajos previos relacionados con tu investigación...': 'Analyze and synthesize previous work related to your research...',
                'Describe claramente el problema que vas a investigar...': 'Clearly describe the problem you will research...',
                'Ej: Analizar los patrones fractales en sistemas dinámicos caóticos...': 'E.g.: Analyze fractal patterns in chaotic dynamic systems...',
                'Lista los objetivos específicos de tu investigación...': 'List the specific objectives of your research...',
                'Plantea tu hipótesis de investigación...': 'State your research hypothesis...',
                'Describe detalladamente la metodología de tu investigación...': 'Describe your research methodology in detail...',
                'Lista las herramientas, software, equipos o recursos que utilizarás...': 'List the tools, software, equipment or resources you will use...',
                'Describe y presenta los datos obtenidos en tu investigación...': 'Describe and present the data obtained in your research...',
                'Título de tu gráfica': 'Title of your chart',
                'Interpreta los resultados obtenidos y su significado...': 'Interpret the results obtained and their meaning...',
                'Escribe las conclusiones principales de tu investigación...': 'Write the main conclusions of your research...',
                'Menciona las limitaciones o restricciones de tu investigación...': 'Mention the limitations or restrictions of your research...',
                'Sugiere posibles líneas de investigación futuras...': 'Suggest possible future lines of research...'
            }
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

            // ── Ebook — Evaluación y Retroalimentación ───────────────────
            'Evaluación y Retroalimentación':  'Assessment & Feedback',
            'Evaluación':                      'Assessment',
            'Retroalimentación':               'Feedback',
            'Posibles mejoras futuras:':       'Possible future improvements:',
            'Modelos de competencia':          'Competition models',
            'Variables ambientales':           'Environmental variables',

            // ── Ebook — Glosario ─────────────────────────────────────────
            'Glosario de Términos':            'Glossary of Terms',
            'Capacidad de carga (K)':          'Carrying Capacity (K)',
            'Crecimiento exponencial':         'Exponential Growth',
            'Crecimiento logístico':           'Logistic Growth',
            'Tasa de crecimiento (r)':         'Growth Rate (r)',
            'Población inicial (P₀)':          'Initial Population (P₀)',
            'Fase de latencia':                'Lag Phase',
            'Fase exponencial':                'Exponential Phase',
            'Fase estacionaria':               'Stationary Phase',
            'Fase de muerte':                  'Death Phase',
            'Tiempo de duplicación':           'Doubling Time',

            // ── Ebook — Referencias ──────────────────────────────────────
            'Referencias y Recursos Adicionales': 'References & Additional Resources',
            'Publicación histórica':           'Historical publication',
            'Modelo logístico':                'Logistic model',
            'Visitar sitio':                   'Visit site',
            'Ver tutoriales':                  'View tutorials',
            'Documentación':                   'Documentation',
            'Visitar MDN':                     'Visit MDN',

            // ── Ebook — Footer ───────────────────────────────────────────
            'Desarrollado como recurso educativo para estudiantes de noveno grado':
                'Developed as an educational resource for ninth grade students',
            'Características Principales':     'Main Features',
            'Guía del Docente':                'Teacher\'s Guide',
            'Actividades Complementarias':     'Supplementary Activities',
            'Formación Docente':               'Teacher Training',

            // ── Ebook quiz — elementos estáticos
            'Quiz Interactivo':               'Interactive Quiz',
            'Pon a prueba tu comprensión del modelo logístico de crecimiento bacteriano con este quiz interactivo. Responde correctamente para avanzar a las siguientes preguntas.':
                'Test your understanding of the logistic model of bacterial growth with this interactive quiz. Answer correctly to advance to the following questions.',
            'Comenzar Quiz':                  'Start Quiz',
            'Pregunta':                       'Question',
            'de':                             'of',
            'Verificar Respuesta':            'Check Answer',
            'Siguiente Pregunta':             'Next Question',
            'Resultados del Quiz':            'Quiz Results',
            'Intentar Nuevamente':            'Try Again',

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
            'Comenzar Proyecto':              'Start Project',
            'Más Información':                'More Information',
            'Formando la próxima generación de investigadores matemáticos':
                'Training the next generation of mathematical researchers',

            // ── Club — proyectos-creativos.html ─────────────────────────
            'Proyectos Creativos':            'Creative Projects',
            'Guía Paso a Paso':               'Step-by-Step Guide',
            // Step titles
            'Identificación del Problema':    'Problem Identification',
            'Investigación y Planificación':  'Research and Planning',
            'Desarrollo y Aplicación':        'Development and Application',
            'Documentación y Análisis':       'Documentation and Analysis',
            'Presentación y Comunicación':    'Presentation and Communication',
            // Step tips headings
            'Consejos para encontrar problemas:': 'Tips for finding problems:',
            'Elementos clave de la investigación:': 'Key elements of research:',
            'Herramientas recomendadas:':     'Recommended tools:',
            'Elementos de la documentación:': 'Elements of documentation:',
            'Consejos para presentar:':       'Presentation tips:',
            // Step list items
            'Observa patrones en la naturaleza, arquitectura o arte': 'Observe patterns in nature, architecture or art',
            'Analiza datos de redes sociales, deportes o música': 'Analyze data from social networks, sports or music',
            'Investiga problemas ambientales o sociales': 'Research environmental or social problems',
            'Examina fenómenos físicos cotidianos': 'Examine everyday physical phenomena',
            'Estudia tendencias económicas o demográficas': 'Study economic or demographic trends',
            'Revisa fuentes académicas y artículos especializados': 'Review academic sources and specialized articles',
            'Identifica las herramientas matemáticas necesarias': 'Identify the necessary mathematical tools',
            'Crea un cronograma realista del proyecto': 'Create a realistic project timeline',
            'Define objetivos específicos y medibles': 'Define specific and measurable objectives',
            'Establece metodología y recursos necesarios': 'Establish methodology and necessary resources',
            'Software de matemáticas: GeoGebra, Desmos, Wolfram Alpha': 'Math software: GeoGebra, Desmos, Wolfram Alpha',
            'Programación: Python, Scratch, JavaScript': 'Programming: Python, Scratch, JavaScript',
            'Análisis de datos: Excel, Google Sheets, Tableau': 'Data analysis: Excel, Google Sheets, Tableau',
            'Diseño: Canva, Adobe Creative Suite': 'Design: Canva, Adobe Creative Suite',
            'Presentaciones: PowerPoint, Google Slides, Prezi': 'Presentations: PowerPoint, Google Slides, Prezi',
            'Registro detallado del proceso de investigación': 'Detailed record of the research process',
            'Explicación clara de las matemáticas utilizadas': 'Clear explanation of the mathematics used',
            'Interpretación de resultados y conclusiones': 'Interpretation of results and conclusions',
            'Reflexión sobre limitaciones y mejoras': 'Reflection on limitations and improvements',
            'Referencias y fuentes consultadas': 'References and sources consulted',
            'Cuenta una historia con tu proyecto': 'Tell a story with your project',
            'Usa visualizaciones claras y atractivas': 'Use clear and attractive visualizations',
            'Practica tu presentación múltiples veces': 'Practice your presentation multiple times',
            'Prepárate para preguntas y debates': 'Prepare for questions and debates',
            'Considera diferentes formatos: póster, video, app': 'Consider different formats: poster, video, app',
            // Section headings
            'Categorías de Proyectos':        'Project Categories',
            'Aplicaciones Matemáticas Clave': 'Key Mathematical Applications',
            'Cronograma Sugerido':            'Suggested Timeline',
            'Rúbrica de Evaluación':          'Evaluation Rubric',
            'Escala de Calificación':         'Grading Scale',
            // Category titles
            'Arte y Diseño Matemático':       'Mathematical Art and Design',
            'Tecnología e Innovación':        'Technology and Innovation',
            'Impacto Social':                 'Social Impact',
            'Ciencia y Experimentación':      'Science and Experimentation',
            'Ejemplos de Proyectos:':         'Project Examples:',
            // Example items
            'Fractales en la naturaleza y el arte': 'Fractals in nature and art',
            'Mosaicos y teselaciones matemáticas': 'Mathematical mosaics and tessellations',
            'Espirales áureas en arquitectura': 'Golden spirals in architecture',
            'Arte generativo con algoritmos': 'Generative art with algorithms',
            'App para optimizar rutas urbanas': 'App to optimize urban routes',
            'Simulador de fenómenos físicos': 'Physical phenomena simulator',
            'Juego educativo de álgebra': 'Educational algebra game',
            'Calculadora de huella de carbono': 'Carbon footprint calculator',
            'Análisis de desigualdad económica': 'Economic inequality analysis',
            'Modelo de propagación de epidemias': 'Epidemic propagation model',
            'Optimización del transporte público': 'Public transportation optimization',
            'Predicción de patrones climáticos': 'Climate pattern prediction',
            'Estado de péndulos acoplados': 'State of coupled pendulums',
            'Crecimiento poblacional de bacterias': 'Bacterial population growth',
            'Análisis de frecuencias musicales': 'Musical frequency analysis',
            'Modelos de sistemas dinámicos': 'Dynamic systems models',
            // Math applications cards
            'Álgebra y Funciones':            'Algebra and Functions',
            'Trigonometría':                  'Trigonometry',
            'Estadística':                    'Statistics',
            'Probabilidad':                   'Probability',
            'Cálculo':                        'Calculus',
            // Timeline
            'Semana 1-2: Exploración e Identificación': 'Weeks 1-2: Exploration and Identification',
            '14 días':                        '14 days',
            'Semana 3-4: Planificación Detallada': 'Weeks 3-4: Detailed Planning',
            'Semana 5-8: Desarrollo y Implementación': 'Weeks 5-8: Development and Implementation',
            '28 días':                        '28 days',
            'Semana 9-10: Análisis y Documentación': 'Weeks 9-10: Analysis and Documentation',
            'Semana 11-12: Presentación Final': 'Weeks 11-12: Final Presentation',
            // Resources
            'Software Matemático':            'Mathematical Software',
            'Diseño y Presentación':          'Design and Presentation',
            'GeoGebra (geometría y álgebra)': 'GeoGebra (geometry and algebra)',
            'Desmos (graficación)':           'Desmos (graphing)',
            'Wolfram Alpha (cálculos)':       'Wolfram Alpha (calculations)',
            'MATLAB/Octave (análisis)':       'MATLAB/Octave (analysis)',
            'R/Python (estadística)':         'R/Python (statistics)',
            'Scratch (principiantes)':        'Scratch (beginners)',
            'Python (análisis de datos)':     'Python (data analysis)',
            'Processing (arte generativo)':   'Processing (generative art)',
            'MIT App Inventor (móvil)':       'MIT App Inventor (mobile)',
            'Knime (análisis visual)':        'Knime (visual analysis)',
            'Canva (diseño gráfico)':         'Canva (graphic design)',
            'Prezi (presentaciones)':         'Prezi (presentations)',
            'Figma (prototipado)':            'Figma (prototyping)',
            // Rubric table headers
            'Criterio de Evaluación':         'Evaluation Criterion',
            'Puntos':                         'Points',
            'Excelente':                      'Excellent',
            'Bueno':                          'Good',
            'Satisfactorio':                  'Satisfactory',
            'Necesita Mejorar':               'Needs Improvement',
            // Rubric criteria
            'Aplicación Matemática':          'Mathematical Application',
            'Uso correcto y profundo de conceptos matemáticos': 'Correct and deep use of mathematical concepts',
            'Creatividad e Innovación':       'Creativity and Innovation',
            'Originalidad y pensamiento crítico en el enfoque': 'Originality and critical thinking in approach',
            'Metodología y Proceso':          'Methodology and Process',
            'Organización, planificación y documentación del trabajo': 'Organization, planning and documentation of work',
            'Claridad, recursos visuales y capacidad explicativa': 'Clarity, visual resources and explanatory capacity',
            'Impacto y Relevancia':           'Impact and Relevance',
            'Relevancia del problema y potencial impacto de la solución': 'Relevance of the problem and potential impact of the solution',
            'PUNTUACIÓN TOTAL':               'TOTAL SCORE',
            // Rubric cell items (Aplicación Matemática)
            'Uso excepcional de conceptos matemáticos avanzados': 'Exceptional use of advanced mathematical concepts',
            'Cálculos precisos y verificados': 'Precise and verified calculations',
            'Conexiones profundas entre teoría y aplicación': 'Deep connections between theory and application',
            'Demuestra comprensión superior': 'Demonstrates superior understanding',
            'Uso correcto de conceptos matemáticos': 'Correct use of mathematical concepts',
            'Cálculos mayormente precisos': 'Mostly precise calculations',
            'Buenas conexiones teórico-prácticas': 'Good theoretical-practical connections',
            'Comprensión sólida evidente': 'Evident solid understanding',
            'Uso básico de conceptos matemáticos': 'Basic use of mathematical concepts',
            'Algunos errores en cálculos': 'Some calculation errors',
            'Conexiones limitadas': 'Limited connections',
            'Comprensión adecuada': 'Adequate understanding',
            'Uso incorrecto o superficial': 'Incorrect or superficial use',
            'Múltiples errores de cálculo': 'Multiple calculation errors',
            'Conexiones débiles o inexistentes': 'Weak or nonexistent connections',
            'Comprensión limitada': 'Limited understanding',
            // Rubric cell items (Creatividad)
            'Enfoque altamente original e innovador': 'Highly original and innovative approach',
            'Soluciones creativas y únicas': 'Creative and unique solutions',
            'Pensamiento crítico excepcional': 'Exceptional critical thinking',
            'Perspectiva fresca del problema': 'Fresh perspective on the problem',
            'Enfoque creativo y bien pensado': 'Creative and well-thought-out approach',
            'Soluciones interesantes': 'Interesting solutions',
            'Buen pensamiento crítico': 'Good critical thinking',
            'Algunas ideas originales': 'Some original ideas',
            'Enfoque convencional pero válido': 'Conventional but valid approach',
            'Soluciones estándar': 'Standard solutions',
            'Pensamiento crítico básico': 'Basic critical thinking',
            'Poca originalidad': 'Little originality',
            'Enfoque poco creativo': 'Uncreative approach',
            'Soluciones obvias o copiadas': 'Obvious or copied solutions',
            'Falta de pensamiento crítico': 'Lack of critical thinking',
            'Sin originalidad aparente': 'No apparent originality',
            // Rubric cell items (Metodología)
            'Metodología científica rigurosa': 'Rigorous scientific methodology',
            'Documentación completa y detallada': 'Complete and detailed documentation',
            'Proceso bien organizado': 'Well-organized process',
            'Seguimiento sistemático': 'Systematic follow-up',
            'Metodología apropiada': 'Appropriate methodology',
            'Buena documentación': 'Good documentation',
            'Proceso organizado': 'Organized process',
            'Seguimiento adecuado': 'Adequate follow-up',
            'Metodología básica': 'Basic methodology',
            'Documentación incompleta': 'Incomplete documentation',
            'Organización limitada': 'Limited organization',
            'Seguimiento irregular': 'Irregular follow-up',
            'Falta de metodología clara': 'Lack of clear methodology',
            'Documentación deficiente': 'Deficient documentation',
            'Proceso desorganizado': 'Disorganized process',
            'Sin seguimiento sistemático': 'Without systematic follow-up',
            // Rubric cell items (Presentación)
            'Presentación excepcional y atractiva': 'Exceptional and attractive presentation',
            'Comunicación clara y efectiva': 'Clear and effective communication',
            'Recursos visuales excelentes': 'Excellent visual resources',
            'Dominio completo del tema': 'Complete mastery of the topic',
            'Buena presentación': 'Good presentation',
            'Comunicación clara': 'Clear communication',
            'Buenos recursos visuales': 'Good visual resources',
            'Buen dominio del tema': 'Good mastery of the topic',
            'Presentación adecuada': 'Adequate presentation',
            'Comunicación básica': 'Basic communication',
            'Recursos visuales limitados': 'Limited visual resources',
            'Dominio suficiente': 'Sufficient mastery',
            'Presentación deficiente': 'Deficient presentation',
            'Comunicación confusa': 'Confusing communication',
            'Recursos visuales pobres': 'Poor visual resources',
            'Dominio limitado': 'Limited mastery',
            // Rubric cell items (Impacto)
            'Problema altamente relevante': 'Highly relevant problem',
            'Solución con gran impacto potencial': 'Solution with great potential impact',
            'Aplicabilidad real evidente': 'Evident real applicability',
            'Beneficio social o educativo claro': 'Clear social or educational benefit',
            'Problema relevante': 'Relevant problem',
            'Solución con buen impacto': 'Solution with good impact',
            'Aplicabilidad probable': 'Probable applicability',
            'Algún beneficio identificable': 'Some identifiable benefit',
            'Problema moderadamente relevante': 'Moderately relevant problem',
            'Solución con impacto limitado': 'Solution with limited impact',
            'Aplicabilidad incierta': 'Uncertain applicability',
            'Beneficio mínimo': 'Minimum benefit',
            'Problema poco relevante': 'Barely relevant problem',
            'Solución sin impacto claro': 'Solution without clear impact',
            'Aplicabilidad dudosa': 'Doubtful applicability',
            'Sin beneficio aparente': 'Without apparent benefit',
            // ── Club — project.html ──────────────────────────────────────
            'Creador de Proyectos (Mejorado)': 'Project Creator (Enhanced)',
            'Guardar':                        'Save',
            'Cargar':                         'Load',
            'Exportar PDF':                   'Export PDF',
            '🚀 Pasos del Proyecto':          '🚀 Project Steps',
            'Información General':            'General Information',
            'Revisión Literatura':            'Literature Review',
            'Problema Investigación':         'Research Problem',
            'Análisis de Datos':              'Data Analysis',
            'Conclusiones':                   'Conclusions',
            'Vista Previa':                   'Preview',
            // Step titles (with emoji)
            '📋 Información General':         '📋 General Information',
            '📖 Introducción':                '📖 Introduction',
            '📚 Revisión de Literatura':      '📚 Literature Review',
            '❓ Problema de Investigación':   '❓ Research Problem',
            '🔬 Metodología':                 '🔬 Methodology',
            '📊 Análisis de Datos':           '📊 Data Analysis',
            '🎯 Conclusiones':                '🎯 Conclusions',
            '👁️ Vista Previa':               '👁️ Preview',
            // Info card headings
            '💡 Consejo':                     '💡 Tip',
            '📝 Guía para la Introducción':   '📝 Introduction Guide',
            '🔍 Gestión de Referencias':      '🔍 Reference Management',
            '🎯 Formulación del Problema':    '🎯 Problem Formulation',
            '⚙️ Diseño Metodológico':         '⚙️ Methodological Design',
            '📈 Análisis de Resultados':      '📈 Results Analysis',
            '📝 Redacción de Conclusiones':   '📝 Writing Conclusions',
            // Form labels
            'Título del Proyecto':            'Project Title',
            'Autor(es)':                      'Author(s)',
            'Institución':                    'Institution',
            'Área de Investigación':          'Research Area',
            'Fecha':                          'Date',
            'Análisis de Literatura':         'Literature Analysis',
            '📖 Referencias':                 '📖 References',
            'Planteamiento del Problema':     'Problem Statement',
            'Objetivo General':              'General Objective',
            'Objetivos Específicos':          'Specific Objectives',
            'Hipótesis (si aplica)':          'Hypothesis (if applicable)',
            'Tipo de Investigación':          'Research Type',
            'Metodología Detallada':          'Detailed Methodology',
            'Herramientas y Recursos':        'Tools and Resources',
            'Presentación de Datos':          'Data Presentation',
            'Tipo de Gráfica':                'Chart Type',
            'Título de la Gráfica':           'Chart Title',
            'Datos':                          'Data',
            'Etiquetas (opcional)':           'Labels (optional)',
            'Interpretación de Resultados':   'Interpretation of Results',
            'Conclusiones Principales':       'Main Conclusions',
            'Limitaciones del Estudio':       'Study Limitations',
            'Investigaciones Futuras':        'Future Research',
            // Select options
            'Selecciona un área':             'Select an area',
            'Teoría de Números':              'Number Theory',
            'Matemáticas Aplicadas':          'Applied Mathematics',
            'Ciencia de Datos':               'Data Science',
            'Modelado Matemático':            'Mathematical Modeling',
            'Selecciona el tipo':             'Select type',
            'Teórica':                        'Theoretical',
            'Computacional':                  'Computational',
            'Mixta':                          'Mixed',
            'Selecciona el tipo de gráfica':  'Select chart type',
            'Gráfica de Líneas':              'Line Chart',
            'Gráfica de Barras':              'Bar Chart',
            'Histograma':                     'Histogram',
            'Gráfica de Dispersión':          'Scatter Plot',
            'Gráfica Circular':               'Pie Chart',
            'Diagrama de Caja':               'Box Plot',
            // Navigation buttons
            'Siguiente':                      'Next',
            'Anterior':                       'Previous',
            'Nuevo Proyecto':                 'New Project',
            'Agregar Referencia':             'Add Reference',
            'Generar Gráfica':                'Generate Chart',
            'Limpiar Gráficas':              'Clear Charts',
            'Exportar Datos':                 'Export Data',
            'Panel Debug':                    'Debug Panel',
            'Exportar a PDF (Con Imágenes Mejoradas)': 'Export to PDF (With Enhanced Images)',
            // Progress text (static portion)
            'Paso 1 de 8':                    'Step 1 of 8',

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

            // Ebook — Glosario (definiciones)
            'Número máximo de individuos que un ambiente puede sostener indefinidamente. Representa el límite superior que la población no puede exceder debido a restricciones de recursos como alimento, espacio o nutrientes.':
                'Maximum number of individuals that an environment can sustain indefinitely. Represents the upper limit that the population cannot exceed due to resource restrictions such as food, space, or nutrients.',
            'Patrón de crecimiento donde la tasa de reproducción es proporcional al tamaño actual de la población, resultando en un incremento acelerado sin límites. Se representa mediante la ecuación N(t) = N₀eʳᵗ.':
                'Growth pattern where the reproduction rate is proportional to the current population size, resulting in unlimited accelerated growth. Represented by the equation N(t) = N₀eʳᵗ.',
            'Modelo de crecimiento poblacional que incorpora la capacidad de carga del ambiente, resultando en una curva S donde el crecimiento disminuye a medida que la población se acerca a su límite máximo sostenible.':
                'Population growth model that incorporates the carrying capacity of the environment, resulting in an S-curve where growth decreases as the population approaches its maximum sustainable limit.',
            'Parámetro que indica la velocidad a la que una población crece por individuo. Representa la diferencia entre la tasa de natalidad y la tasa de mortalidad en condiciones ideales.':
                'Parameter indicating the rate at which a population grows per individual. Represents the difference between birth rate and death rate under ideal conditions.',
            'Número de individuos presentes al comienzo de un periodo de observación o modelado. Punto de partida para las ecuaciones de crecimiento poblacional.':
                'Number of individuals present at the beginning of an observation or modeling period. Starting point for population growth equations.',
            'Periodo inicial de crecimiento bacteriano en el que las células se adaptan a su nuevo entorno y comienzan a prepararse para dividirse, pero no hay aumento significativo en el número de células.':
                'Initial period of bacterial growth in which cells adapt to their new environment and begin to prepare to divide, but there is no significant increase in cell numbers.',
            'Etapa del crecimiento bacteriano donde las células se dividen a una tasa constante y máxima, resultando en un incremento exponencial de la población.':
                'Stage of bacterial growth where cells divide at a constant and maximum rate, resulting in exponential population growth.',
            'Etapa del crecimiento microbiano donde la tasa de reproducción iguala a la tasa de muerte, manteniendo un tamaño poblacional constante, generalmente cerca de la capacidad de carga.':
                'Stage of microbial growth where the reproduction rate equals the death rate, maintaining a constant population size, generally near the carrying capacity.',
            'Etapa final del crecimiento bacteriano donde la tasa de muerte supera a la tasa de reproducción, resultando en una disminución de la población debido al agotamiento de recursos o acumulación de sustancias tóxicas.':
                'Final stage of bacterial growth where the death rate exceeds the reproduction rate, resulting in a population decline due to resource depletion or accumulation of toxic substances.',
            'Tiempo necesario para que una población duplique su tamaño. En crecimiento exponencial, se calcula como ln(2)/r, donde r es la tasa de crecimiento.':
                'Time required for a population to double in size. In exponential growth, calculated as ln(2)/r, where r is the growth rate.',

            // Ebook — Reflexión
            'La lección no solo enseña sobre biología o matemáticas, sino que integra la programación como una herramienta para investigar la vida. Ayuda a los estudiantes a visualizar fenómenos invisibles de manera práctica y artística, desarrollando habilidades clave para un mundo dominado por la tecnología y los datos.':
                'The lesson not only teaches biology or mathematics, but integrates programming as a tool for investigating life. It helps students visualize invisible phenomena in a practical and artistic way, developing key skills for a world driven by technology and data.',
            'Aplicaciones prácticas del modelado poblacional en ciencia e industria':
                'Practical applications of population modeling in science and industry',
            'Ampliar a modelos de competencia entre dos especies que comparten recursos':
                'Expand to competition models between two species sharing resources',
            'Añadir variables como temperatura o pH que afecten la tasa de crecimiento r':
                'Add variables such as temperature or pH that affect the growth rate r',
            'Crear simulaciones en 3D que muestren la dispersión espacial de las bacterias':
                'Create 3D simulations showing the spatial dispersion of bacteria',

            // Ebook — Evaluación (items con strong)
            'Biblioteca JavaScript para crear gráficos interactivos':
                'JavaScript library for creating interactive charts',
            'Recursos para aprender JavaScript':
                'Resources for learning JavaScript',
            'Bacterial Growth - Recursos educativos sobre crecimiento bacteriano':
                'Bacterial Growth - Educational resources on bacterial growth',
            'Growth and Decay Word Problems - Tutoriales sobre problemas de crecimiento y decrecimiento':
                'Growth and Decay Word Problems - Tutorials on growth and decay problems',

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

            // club/investigacion.html — CTA section
            'Únete a nuestra comunidad de jóvenes investigadores y transforma tu curiosidad matemática en descubrimientos científicos que impacten al mundo.':
                'Join our community of young researchers and transform your mathematical curiosity into scientific discoveries that impact the world.',

            // club/project.html — info card descriptions
            'Elige un título descriptivo y específico que refleje claramente el enfoque de tu investigación.':
                'Choose a descriptive and specific title that clearly reflects the focus of your research.',
            'Agrega las fuentes que has consultado. Incluye libros, artículos, papers y recursos web relevantes.':
                'Add the sources you have consulted. Include books, articles, papers and relevant web resources.',

            // club/proyectos-creativos.html — hero and step paragraphs
            'Guía completa para desarrollar proyectos innovadores donde las matemáticas sean las protagonistas. Transforma ideas en realidad aplicando conceptos matemáticos de forma creativa y práctica.':
                'Complete guide for developing innovative projects where mathematics is the protagonist. Transform ideas into reality by applying mathematical concepts creatively and practically.',
            'El primer paso es identificar un problema real o una pregunta interesante que pueda ser abordada usando matemáticas. Busca situaciones en tu vida diaria, en tu comunidad o en temas que te apasionen.':
                'The first step is to identify a real problem or an interesting question that can be addressed using mathematics. Look for situations in your daily life, in your community or in topics you are passionate about.',
            'Una vez identificado el problema, es hora de investigar qué matemáticas necesitarás y planificar tu enfoque. Esta fase es crucial para el éxito de tu proyecto.':
                'Once the problem is identified, it is time to research what mathematics you will need and plan your approach. This phase is crucial for the success of your project.',
            'Aplica las matemáticas para resolver tu problema. Utiliza herramientas tecnológicas, recolecta datos, crea modelos y desarrolla soluciones innovadoras.':
                'Apply mathematics to solve your problem. Use technological tools, collect data, create models and develop innovative solutions.',
            'Documenta todo tu proceso, analiza los resultados obtenidos y reflexiona sobre las implicaciones de tus hallazgos. La documentación es tan importante como el resultado final.':
                'Document your entire process, analyze the results obtained and reflect on the implications of your findings. Documentation is as important as the final result.',
            'Prepara una presentación impactante que comunique efectivamente tu trabajo. Adapta tu mensaje a diferentes audiencias y utiliza elementos visuales atractivos.':
                'Prepare an impactful presentation that effectively communicates your work. Adapt your message to different audiences and use attractive visual elements.',
            // Category descriptions
            'Explora la belleza de las matemáticas a través del arte, creando obras que revelan patrones, simetrías y estructuras matemáticas fascinantes.':
                'Explore the beauty of mathematics through art, creating works that reveal fascinating mathematical patterns, symmetries and structures.',
            'Desarrolla aplicaciones, simulaciones y herramientas tecnológicas que utilicen matemáticas para resolver problemas modernos.':
                'Develop applications, simulations and technological tools that use mathematics to solve modern problems.',
            'Utiliza las matemáticas para abordar problemas sociales, económicos o ambientales que afecten a tu comunidad o al mundo.':
                'Use mathematics to address social, economic or environmental problems that affect your community or the world.',
            'Diseña experimentos y estudios que utilicen métodos matemáticos para explorar fenómenos científicos y naturales.':
                'Design experiments and studies that use mathematical methods to explore scientific and natural phenomena.',
            // Math application card descriptions
            'Modelado de relaciones, optimización de recursos, análisis de tendencias y predicciones.':
                'Modeling relationships, resource optimization, trend analysis and predictions.',
            'Diseño espacial, análisis de formas, cálculo de áreas y volúmenes, perspectiva y simetría.':
                'Spatial design, shape analysis, area and volume calculation, perspective and symmetry.',
            'Análisis de ondas, navegación, astronomía, música y fenómenos periódicos.':
                'Wave analysis, navigation, astronomy, music and periodic phenomena.',
            'Análisis de datos, investigación de mercados, estudios sociales y toma de decisiones.':
                'Data analysis, market research, social studies and decision making.',
            'Análisis de riesgos, juegos, predicciones y modelado de incertidumbre.':
                'Risk analysis, games, predictions and uncertainty modeling.',
            'Tasas de cambio, optimización, área bajo curvas y modelado de fenómenos continuos.':
                'Rates of change, optimization, area under curves and modeling of continuous phenomena.',
            // Timeline descriptions
            'Identificar el problema, realizar investigación preliminar y definir objetivos específicos del proyecto.':
                'Identify the problem, conduct preliminary research and define specific project objectives.',
            'Desarrollar metodología, crear cronograma detallado y adquirir recursos necesarios.':
                'Develop methodology, create detailed timeline and acquire necessary resources.',
            'Aplicar matemáticas, recolectar datos, crear modelos y desarrollar soluciones.':
                'Apply mathematics, collect data, create models and develop solutions.',
            'Analizar resultados, documentar proceso y elaborar conclusiones.':
                'Analyze results, document process and draw conclusions.',
            'Preparar presentación, crear materiales visuales y practicar exposición.':
                'Prepare presentation, create visual materials and practice the presentation.',
        }
    };

    // ── Párrafos con HTML interno ──────────────────────────────────────────
    const htmlParaDict = {
        en: {
            // Ebook — Evaluación (li con <strong>)
            'Producto final: Código funcional que modele poblaciones':
                '<strong>Final product:</strong> Functional code that models populations',
            'Análisis escrito: Reflexión breve sobre cómo cambió la población al modificar K, r y P₀':
                '<strong>Written analysis:</strong> Brief reflection on how the population changed when modifying K, r and P₀',
            'Presentación: Explicación de resultados obtenidos con diferentes parámetros':
                '<strong>Presentation:</strong> Explanation of results obtained with different parameters',
            'Comentarios individualizados sobre claridad en el código y comprensión del modelo':
                'Individualized feedback on code clarity and model understanding',
            '¿Qué representa la capacidad de carga en la vida real?':
                'What does the carrying capacity represent in real life?',
            '¿Por qué el crecimiento no puede ser infinito?':
                'Why can growth not be infinite?',
            '¿Cómo se podrían aplicar estos modelos en la industria o medicina?':
                'How could these models be applied in industry or medicine?',

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

            // club/proyectos-creativos.html — rubric intro
            'Puntuación Total: 300 puntos - Esta rúbrica evalúa integralmente el desarrollo y presentación de proyectos creativos matemáticos.':
                '<strong>Total Score: 300 points</strong> — This rubric comprehensively evaluates the development and presentation of creative math projects.',
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
