// i18n.js — Módulo de traducción ES ↔ EN
// Aplica a: index.html, historiamath.html, links.html, materiales.html, galeria.html,
//           club/competencias.html, club/leaderboard.html, club/olimpiadas.html,
//           club/investigacion.html, club/proyectos-creativos.html, club/registro.html,
//           club/mision-matematica/index.html,
//           contexto/historiamath-examen.html, contexto/historiamath-preguntas.html,
//           contexto/profesor-dashboard.html,
//           salon/algebra.html, salon/estadisticas.html, salon/finanzas.html,
//           salon/geometria.html,
//           lab/experimentos.html, lab/figuras.html, lab/juegos.html,
//           lab/proyectiles.html, lab/simulaciones.html,
//           lab/modulos/datos.html, lab/modulos/fisica.html,
//           lab/modulos/geometrico.html, lab/modulos/optimizacion.html

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
            'Misión Matemática - Club de Matemáticas EMTP':
                'Math Mission - EMTP Mathematics Club',
            // lab/
            'Laboratorio de Experimentos - Matemáticas Digitales':
                'Experiments Laboratory - Digital Mathematics',
            'Laboratorio de Geometría 3D Interactivo':
                'Interactive 3D Geometry Laboratory',
            'MATH ARENA — Competencia Multijugador':
                'MATH ARENA — Multiplayer Competition',
            'Laboratorio de Proyectiles | Física Interactiva':
                'Projectile Laboratory | Interactive Physics',
            'Modelo de Reproducción de Conejos - Sucesión de Fibonacci':
                'Rabbit Reproduction Model - Fibonacci Sequence',
            'Modelado de Datos Reales - Laboratorio de Matemáticas':
                'Real Data Modeling - Mathematics Laboratory',
            'Fenómenos Físicos - Laboratorio de Matemáticas':
                'Physical Phenomena - Mathematics Laboratory',
            'Modelado Geométrico - Laboratorio de Matemáticas':
                'Geometric Modeling - Mathematics Laboratory',
            'Optimización Matemática - Laboratorio de Matemáticas':
                'Mathematical Optimization - Mathematics Laboratory',
            // salon/
            'Álgebra Moderna — Funciones, Gráficas y Calculadoras':
                'Modern Algebra — Functions, Graphs and Calculators',
            'Estadística Moderna — Una Guía Interactiva':
                'Modern Statistics — An Interactive Guide',
            'Finanzas Inteligentes: Tu Guía Interactiva':
                'Smart Finance: Your Interactive Guide',
            'Geometría Moderna — Conceptos, Visualizaciones y Calculadoras':
                'Modern Geometry — Concepts, Visualizations and Calculators',
            // contexto — nuevas páginas
            'Examen - Historia de las Matemáticas':
                'Exam - History of Mathematics',
            'Preguntas de Análisis - Historia de las Matemáticas':
                'Analysis Questions - History of Mathematics',
            'Dashboard del Profesor - Historia de las Matemáticas':
                'Professor Dashboard - History of Mathematics',
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
                'Sugiere posibles líneas de investigación futuras...': 'Suggest possible future lines of research...',
                // club/mision-matematica — form
                'Nombre Completo': 'Full Name',
                'Correo Electrónico': 'Email Address',
                'Mensaje': 'Message',
                // salon/algebra
                'Coeficiente a':             'Coefficient a',
                'Coeficiente b':             'Coefficient b',
                'Coeficiente c':             'Coefficient c',
                'Introduce un valor de x':   'Enter a value of x',
                'El resultado aparecerá aquí...': 'The result will appear here...',
                // salon/estadisticas
                'Ej:85, 92, 78, ...':        'E.g.: 85, 92, 78, ...',
                // salon/finanzas
                'Ej: Pasajes':               'E.g.: Bus fare',
                'Ej: 50':                    'E.g.: 50',
                // historiamath-preguntas
                'Escribe tu nombre completo': 'Write your full name',
                'Escribe tu respuesta aquí... Explica con ejemplos específicos y conecta el concepto del cero con desarrollos matemáticos posteriores.':
                    'Write your answer here... Explain with specific examples and connect the concept of zero with later mathematical developments.',
                'Compara y contrasta las contribuciones de ambas culturas, mencionando matemáticos específicos y sus aportes.':
                    'Compare and contrast the contributions of both cultures, mentioning specific mathematicians and their contributions.',
                'Analiza la importancia histórica y metodológica de los Elementos de Euclides.':
                    'Analyze the historical and methodological importance of Euclid\'s Elements.',
                'Describe el impacto del cálculo en las matemáticas y las ciencias.':
                    'Describe the impact of calculus on mathematics and the sciences.',
                'Reflexiona sobre la evolución de las matemáticas y su futuro en el siglo XXI.':
                    'Reflect on the evolution of mathematics and its future in the 21st century.',
                // profesor-dashboard
                'Buscar por nombre o grupo...': 'Search by name or group...'
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

            // Mathematicians — eras
            'Era Antigua':                    'Ancient Era',
            'Era Medieval':                   'Medieval Era',
            'Era Islámica Dorada':            'Islamic Golden Age',
            'Renacimiento y Era Moderna':     'Renaissance and Modern Era',
            '3000 a.C. - 400 d.C.':         '3000 BC - 400 AD',
            '800 - 1200 d.C.':              '800 - 1200 AD',
            '1400 - Presente':               '1400 - Present',
            'Descubrimientos':                'Discoveries',

            // Mathematicians — discovery tags
            'Padre del Álgebra':              'Father of Algebra',
            'Método Científico':              'Scientific Method',
            'Cálculo Diferencial':            'Differential Calculus',
            'Cálculo Integral':               'Integral Calculus',
            'Identidad de Euler':             "Euler's Identity",
            'Príncipe de las Matemáticas':    'Prince of Mathematics',

            // Mathematicians — hover section titles
            'Descubrimientos Clave:':         'Key Discoveries:',
            'Legado:':                        'Legacy:',
            'Innovaciones:':                  'Innovations:',
            'Revolución Matemática:':         'Mathematical Revolution:',
            'Contribuciones:':                'Contributions:',
            'Legado Duradero:':               'Lasting Legacy:',
            'Revolución Científica:':         'Scientific Revolution:',
            'Genio Universal:':               'Universal Genius:',
            'Prolífico Genio:':               'Prolific Genius:',
            'Genio Supremo:':                 'Supreme Genius:',

            // Mathematicians — hover list items
            'Relaciones numéricas en música': 'Numerical relationships in music',
            'Escuela pitagórica':             'Pythagorean school',
            'Método axiomático':              'Axiomatic method',
            'Algoritmo de Euclides':          'Euclidean algorithm',
            'Método de exhaución':            'Method of exhaustion',
            'Espiral de Arquímedes':          'Archimedean spiral',
            'Cálculo de π':                  'Calculation of π',
            'Sistema de numeración decimal':  'Decimal numeration system',
            'Algoritmos matemáticos':         'Mathematical algorithms',
            'Problema de Alhazen':            "Alhazen's problem",
            'Cámara oscura':                  'Camera obscura',
            'Geometría analítica':            'Analytical geometry',
            'Proporción áurea':               'Golden ratio',
            'Espirales en la naturaleza':     'Spirals in nature',
            'Ley de gravitación universal':   'Law of universal gravitation',
            'Teorema binomial':               'Binomial theorem',
            'Sistema binario':                'Binary system',
            'Máquina de cálculo':             'Calculating machine',
            'Filosofía matemática':           'Mathematical philosophy',
            'Más de 800 publicaciones':       'More than 800 publications',
            'Teoría de grafos':               'Graph theory',
            'Notación matemática moderna':    'Modern mathematical notation',
            'Teoría de números':              'Number theory',
            'Geometría no euclidiana':        'Non-Euclidean geometry',
            'Estadística y probabilidad':     'Statistics and probability',

            // Discoveries section
            'Descubrimientos que Cambiaron el Mundo': 'Discoveries that Changed the World',
            'La Invención del Cero':          'The Invention of Zero',
            'Siglo V d.C. - India':           '5th Century AD - India',
            'Impacto Mundial: 100%':          'World Impact: 100%',
            'El Álgebra':                     'Algebra',
            'Siglo IX - Al-Khwarizmi':        '9th Century - Al-Khwarizmi',
            'Impacto Mundial: 95%':           'World Impact: 95%',
            'El Cálculo':                     'Calculus',
            'Siglo XVII - Newton & Leibniz':  '17th Century - Newton & Leibniz',
            'Impacto Mundial: 90%':           'World Impact: 90%',
            'Geometría Euclidiana':           'Euclidean Geometry',
            'Siglo III a.C. - Euclides':      '3rd Century BC - Euclid',
            'Impacto Mundial: 85%':           'World Impact: 85%',
            'Siglo XX - Turing & Von Neumann':'20th Century - Turing & Von Neumann',
            'Impacto Mundial: 98%':           'World Impact: 98%',
            'Estadística Moderna':            'Modern Statistics',
            'Siglos XVIII-XIX - Gauss & Otros':'18th-19th Centuries - Gauss & Others',
            'Impacto Mundial: 80%':           'World Impact: 80%',

            // Action buttons
            'Preguntas de Análisis':          'Analysis Questions',
            'Tomar Examen':                   'Take Exam',
            'Volver al Inicio':               'Back to Top',

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

            // Ebook — nav & progress bar (missing items)
            'Objetivos':                      'Objectives',
            'Contenido':                      'Content',

            // Ebook — hero
            'Autor:':                         'Author:',
            'Fecha:':                         'Date:',

            // Ebook — Nivel Educativo
            'Nivel y Perfil':                 'Level & Profile',
            'Nivel:':                         'Level:',
            'Noveno grado de escuela secundaria': 'Ninth grade of secondary school',
            'Edad:':                          'Age:',
            '14-15 años':                     '14-15 years old',
            'Características del grupo:':     'Group characteristics:',

            // Ebook — Objetivos
            'Principales Objetivos':          'Main Objectives',
            'Alineación a Estándares':        'Standards Alignment',
            '- Reconocer situaciones de crecimiento y decrecimiento':
                '- Recognize growth and decay situations',
            '- Utilizar modelos matemáticos para explicar dinámicas de poblaciones':
                '- Use mathematical models to explain population dynamics',

            // Ebook — Contenido
            'Conceptos a Enseñar':            'Concepts to Teach',
            'Crecimiento exponencial vs. crecimiento logístico':
                'Exponential growth vs. logistic growth',
            'Sin límites de recursos':        'Without resource limits',
            'Con capacidad de carga (K)':     'With carrying capacity (K)',
            'Ecuación del modelo logístico:': 'Logistic model equation:',
            'Donde:':                         'Where:',

            // Ebook — Integración STEAM
            'Ciencia':                        'Science',
            'Tecnología':                     'Technology',
            'Ingeniería':                     'Engineering',
            'Artes':                          'Arts',
            'Matemáticas':                    'Mathematics',

            // Ebook — Metodología
            'Introducción Conceptual':        'Conceptual Introduction',
            'Programación de la Simulación':  'Simulation Programming',
            'Análisis de Resultados':         'Results Analysis',
            'Duración:':                      'Duration:',
            'Materiales y Recursos':          'Materials & Resources',
            'Instrucciones paso a paso':      'Step-by-step instructions',
            'Presentación teórica:':          'Theoretical presentation:',
            'Explicar el modelo logístico':   'Explain the logistic model',
            'Demostración:':                  'Demonstration:',
            'Mostrar un ejemplo de simulación': 'Show a simulation example',
            'Actividad individual:':          'Individual activity:',
            'Discusión grupal:':              'Group discussion:',
            '¿Qué pasó con la población? ¿Cómo afecta cada parámetro?':
                'What happened to the population? How does each parameter affect it?',
            'Factores que limitan el crecimiento': 'Factors that limit growth',
            'Colonia bacteriana real':        'Real bacterial colony',

            // Ebook — Simulación labels
            'Población Inicial (P₀):':        'Initial Population (P₀):',
            'Tasa de Crecimiento (r):':       'Growth Rate (r):',
            'Capacidad de Carga (K):':        'Carrying Capacity (K):',
            'Exportar':                       'Export',

            // Ebook — Casos Reales
            'E. coli en Laboratorio':         'E. coli in the Lab',
            'Parámetros observados:':         'Observed parameters:',
            'Simular este caso':              'Simulate this case',
            'Infección Bacteriana Clínica':   'Clinical Bacterial Infection',
            'Biorremedación Ambiental':       'Environmental Bioremediation',

            // Ebook — Visualización Avanzada
            'Modelo 1':                       'Model 1',
            'Modelo 2':                       'Model 2',
            'Modelo 3':                       'Model 3',
            'Configuración Modelo 1':         'Model 1 Settings',
            'Color del modelo:':              'Model color:',
            'Activar modelo:':                'Activate model:',
            'Ejecutar Visualización':         'Run Visualization',
            'Guardar Configuración':          'Save Configuration',

            // Ebook — Laboratorio Virtual
            'Laboratorio Virtual de Microscopía': 'Virtual Microscopy Lab',
            'Muestras disponibles':           'Available samples',
            'Fase de Latencia':               'Lag Phase',
            'Fase Exponencial':               'Exponential Phase',
            'Fase Estacionaria':              'Stationary Phase',
            'Fase de Muerte':                 'Death Phase',
            '0-2h de crecimiento':            '0-2h of growth',
            '2-6h de crecimiento':            '2-6h of growth',
            '8-12h de crecimiento':           '8-12h of growth',
            '24h+ de crecimiento':            '24h+ of growth',
            'Observaciones':                  'Observations',
            'Modelo Correspondiente':         'Corresponding Model',
            'Observaciones Microscópicas':    'Microscopic Observations',
            'Análisis Cuantitativo':          'Quantitative Analysis',
            'Modelo Matemático':              'Mathematical Model',

            // Ebook — Quiz result dynamic text
            'Has respondido correctamente':   'You have correctly answered',
            'preguntas.':                     'questions.',

            // Ebook — Adaptaciones
            'Aumentar Dificultad':            'Increase Difficulty',
            'Reducir Dificultad':             'Reduce Difficulty',

            // Ebook — Evaluación
            'Preguntas orientadoras:':        'Guiding questions:',

            // Ebook — Reflexión
            'Reflexión y Conclusión':         'Reflection & Conclusion',
            'Visualización 3D':               '3D Visualization',

            // Ebook — Footer
            'Recursos Adicionales':           'Additional Resources',
            'Inicio':                         'Home',
            'Recursos':                       'Resources',

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
            '🔬 Investigación Matemática':    '🔬 Mathematical Research',
            'Investigación Matemática':       'Mathematical Research',
            'Descubre, Explora, Innova':      'Discover, Explore, Innovate',
            'Sumérgete en el fascinante mundo de la investigación matemática donde cada problema es una oportunidad de descubrimiento y cada teorema es un paso hacia la innovación. Únete a nuestra comunidad de jóvenes investigadores y transforma tu curiosidad en conocimiento científico.':
                'Immerse yourself in the fascinating world of mathematical research where every problem is an opportunity for discovery and every theorem is a step toward innovation. Join our community of young researchers and transform your curiosity into scientific knowledge.',
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

            // ── club/mision-matematica/index.html ───────────────────────
            // Loader
            'Iniciando Misión...':            'Starting Mission...',

            // Navbar
            'Nuestra Misión':                 'Our Mission',
            'Actividades':                    'Activities',
            'Objetivos':                      'Goals',
            'Recursos':                       'Resources',
            'Contacto':                       'Contact',

            // Hero
            'Bienvenidos a la Aventura Matemática': 'Welcome to the Mathematical Adventure',
            'Fomentar la excelencia matemática y el pensamiento crítico':
                'Fostering mathematical excellence and critical thinking',
            'Competencias/Año':               'Competitions/Year',
            '% Meta Mejora':                  '% Improvement Goal',
            'Comenzar la Misión':             'Start the Mission',

            // Misión y Visión
            'Misión y Visión':                'Mission and Vision',
            'Nuestra Visión':                 'Our Vision',
            'Nuestros Propósitos':            'Our Purposes',
            'Complementar':                   'Complement',
            'Competir':                       'Compete',
            'Colaborar':                      'Collaborate',
            'Fortalecer':                     'Strengthen',

            // Actividades
            'Plan de Actividades 2024-2025':  'Activity Plan 2024-2025',
            'Actividades Semanales Regulares':'Regular Weekly Activities',
            'Martes':                         'Tuesday',
            'Jueves':                         'Thursday',
            'Viernes Alternos':               'Alternating Fridays',
            'Sesiones de Resolución de Problemas': 'Problem-Solving Sessions',
            'Talleres de Investigación':      'Research Workshops',
            'Círculos Matemáticos':           'Math Circles',
            'Calendario Anual de Eventos':    'Annual Calendar of Events',

            // Timeline
            'Agosto-Septiembre: Inducción':   'August-September: Induction',
            'Formación Inicial':              'Initial Training',
            'Octubre: Primera Competencia':   'October: First Competition',
            'Noviembre: Gira Educativa':      'November: Educational Tour',
            'Experiencia Universitaria':      'University Experience',
            'Diciembre: Cierre Primer Semestre': 'December: First Semester Closure',
            'Evaluación y Reconocimientos':   'Evaluation and Recognition',
            'Enero-Febrero: Investigación Avanzada': 'January-February: Advanced Research',
            'Proyectos de Investigación':     'Research Projects',
            'Marzo: Semana de las Matemáticas': 'March: Mathematics Week',
            'Evento Especial':                'Special Event',
            'Abril: Segunda Competencia':     'April: Second Competition',
            'Competencia Regional':           'Regional Competition',
            'Mayo: Cierre Año Escolar':       'May: End of School Year',
            'Culminación':                    'Culmination',

            // Objetivos
            'Objetivos del Club':             'Club Goals',
            'Nuestras Metas para 2024-2025':  'Our Goals for 2024-2025',
            'Objetivos Específicos':          'Specific Goals',
            'Sesiones de Práctica':           'Practice Sessions',
            'Semanal':                        'Weekly',
            'Semestral':                      'Semester',
            'Anual':                          'Annual',
            '3 al año':                       '3 per year',
            '⭐ Principal':                   '⭐ Main',
            'Competencias Matemáticas':       'Math Competitions',
            'Giras Educativas':               'Educational Tours',
            'Semana de las Matemáticas':      'Mathematics Week',
            'Marzo':                          'March',
            // Lista de items
            'Problemas de olimpiadas':        'Olympiad problems',
            'Técnicas de demostración':       'Proof techniques',
            'Razonamiento lógico':            'Logical reasoning',
            'Competencia interna (Octubre)':  'Internal Competition (October)',
            'Competencia regional (Abril)':   'Regional Competition (April)',
            'Simulacros continuos':           'Continuous mock exams',
            'Análisis de estrategias':        'Strategy analysis',
            'Software matemático':            'Math software',
            'Presentaciones científicas':     'Scientific presentations',
            'Visita a UPR Río Piedras':       'Visit to UPR Río Piedras',
            'Charlas con profesores':         'Talks with professors',
            'Orientación de carreras':        'Career guidance',
            'Juegos matemáticos':             'Math games',
            'Reto Matemático escolar':        'School Math Challenge',
            'Día de π (3/14)':               'Pi Day (3/14)',
            'Feria de proyectos':             'Project fair',

            // Galería de Momentos
            'Galería de Momentos':            'Gallery of Moments',
            'Competencia Interna':            'Internal Competition',
            'Competencia de Octubre':         'October Competition',
            'Gira UPR':                       'UPR Tour',
            'Visita a Universidad de PR':     'Visit to University of PR',
            'Celebración de π (3/14)':        'Celebration of π (3/14)',
            'Talleres':                       'Workshops',
            'Presentaciones Científicas':     'Scientific Presentations',
            'Reconocimientos':                'Recognitions',
            'Ceremonia de Premios':           'Awards Ceremony',

            // Recursos
            'Recursos Educativos':            'Educational Resources',
            'Biblioteca Virtual':             'Virtual Library',
            'Laboratorios Interactivos':      'Interactive Labs',
            'Videoconferencias':              'Video Conferences',
            'Banco de Problemas':             'Problem Bank',
            'Calculadoras y Simuladores':     'Calculators and Simulators',
            'Foro de Discusión':              'Discussion Forum',
            'Acceder →':                      'Access →',
            'Explorar →':                     'Explore →',
            'Ver →':                          'Watch →',
            'Practicar →':                    'Practice →',
            'Usar →':                         'Use →',
            'Unirse →':                       'Join →',

            // Contacto
            'Contáctanos':                    'Contact Us',
            '¿Listo para Unirte?':            'Ready to Join?',
            'Ubicación':                      'Location',
            'Coordinador':                    'Coordinator',
            'Horario':                        'Schedule',
            'Año Escolar':                    'School Year',
            'Envíanos un Mensaje':            'Send Us a Message',
            'Nombre Completo':                'Full Name',
            'Correo Electrónico':             'Email Address',
            'Grado Escolar':                  'School Grade',
            'Selecciona tu grado':            'Select your grade',
            'Séptimo':                        'Seventh',
            'Octavo':                         'Eighth',
            'Noveno':                         'Ninth',
            'Décimo':                         'Tenth',
            'Undécimo':                       'Eleventh',
            'Duodécimo':                      'Twelfth',
            'Enviar Mensaje':                 'Send Message',

            // Footer
            'Club de Matemáticas':            'Mathematics Club',
            'Año Escolar 2024-2025':          'School Year 2024-2025',
            'Horario:':                       'Schedule:',
            'Mar-Jue: 2:30-4:00 PM':         'Tue-Thu: 2:30-4:00 PM',
            'Vie (alternos): 2:30-4:00 PM':  'Fri (alternating): 2:30-4:00 PM',
            'Enlaces Rápidos':                'Quick Links',
            'Síguenos':                       'Follow Us',
            '© 2026 Misión Matemática — Todos los derechos reservados':
                '© 2026 Math Mission — All rights reserved',
            'Diseñado con ❤️ para el aprendizaje matemático':
                'Designed with ❤️ for mathematical learning',

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

            // ── lab/experimentos.html ────────────────────────────────────
            'Laboratorio Experimental':       'Experimental Laboratory',
            'ContextoMath':                   'MathContext',
            'Laboratorio':                    'Laboratory',
            // Cards
            'Finanzas Personales':            'Personal Finance',
            'Balanza Algebraica':             'Algebraic Balance',
            'Círculo Unitario':               'Unit Circle',
            'Explorar Módulo':                'Explore Module',
            // Card features — Finanzas
            'Gráficas comparativas interactivas': 'Interactive comparative charts',
            'Tabla de crecimiento año por año': 'Year-by-year growth table',
            'Fórmulas matemáticas explicadas': 'Explained mathematical formulas',
            'Simulación en tiempo real':       'Real-time simulation',
            // Card features — Álgebra
            'Balanza interactiva visual':      'Visual interactive balance',
            'Operaciones paso a paso':         'Step-by-step operations',
            'Bloques para variables y constantes': 'Blocks for variables and constants',
            'Registro de pasos algebraicos':   'Algebraic steps log',
            // Card features — Geometría
            'Círculo unitario interactivo':    'Interactive unit circle',
            'Valores trigonométricos en tiempo real': 'Real-time trigonometric values',
            'Visualización de ángulos':        'Angle visualization',
            'Triángulo rectángulo dinámico':   'Dynamic right triangle',
            // Modal headers
            'Simulador de Finanzas Personales': 'Personal Finance Simulator',
            'Balanza Algebraica Interactiva': 'Interactive Algebraic Balance',
            'Explorador del Círculo Unitario': 'Unit Circle Explorer',
            // Finanzas modal controls
            'Parámetros de Inversión':         'Investment Parameters',
            'Monto Inicial ($)':               'Initial Amount ($)',
            'Tasa de Interés Anual (%)':       'Annual Interest Rate (%)',
            'Tiempo (años)':                   'Time (years)',
            'Calcular y Comparar':             'Calculate and Compare',
            'Fórmulas':                        'Formulas',
            'Comparación Visual':              'Visual Comparison',
            // Álgebra modal controls
            'Configurar Ecuación':             'Set Up Equation',
            'Ecuación (formato: 2x+3=9)':      'Equation (format: 2x+3=9)',
            'Configurar Balanza':              'Set Up Balance',
            'Sumar':                           'Add',
            'Restar':                          'Subtract',
            'Multiplicar':                     'Multiply',
            'Dividir':                         'Divide',
            'Valor para operación':            'Value for operation',
            'Reiniciar':                       'Reset',
            'Balanza Visual':                  'Visual Balance',
            'Pasos de Solución':               'Solution Steps',
            // Geometría modal controls
            'Control de Ángulo':               'Angle Control',
            'Ángulo (grados):':                'Angle (degrees):',
            'Ángulo exacto (grados)':          'Exact angle (degrees)',
            'Conversión':                      'Conversion',
            'Animación Completa':              'Full Animation',

            // ── lab/figuras.html ─────────────────────────────────────────
            'Geometría Interactiva':          'Interactive Geometry',
            'Selecciona una categoría para explorar las figuras.': 'Select a category to explore the figures.',
            'Poliedros':                      'Polyhedrons',
            'Cuerpos Redondos':               'Round Bodies',
            'Fractales':                      'Fractals',
            'Controles:':                     'Controls:',
            'Arrastrar: Rotar':               'Drag: Rotate',
            'Rueda: Zoom':                    'Scroll: Zoom',
            'Click derecho: Mover':           'Right click: Pan',

            // ── lab/juegos.html ──────────────────────────────────────────
            '⚡ Competencia Matemática en Tiempo Real ⚡': '⚡ Real-Time Math Competition ⚡',
            'INICIAR COMBATE':                'START BATTLE',
            'UNIRSE CON CÓDIGO':              'JOIN WITH CODE',
            'CREAR SALA':                     'CREATE ROOM',
            'EMPEZAR JUEGO':                  'START GAME',
            'JUGAR DE NUEVO':                 'PLAY AGAIN',
            'MENÚ':                           'MENU',
            'ESCANEA PARA ENTRAR':            'SCAN TO JOIN',
            'CERRAR':                         'CLOSE',
            'COMBATE TERMINADO':              'BATTLE OVER',
            'Clasificación final':            'Final Rankings',
            'ESPERANDO AL HOST…':             'WAITING FOR HOST…',
            'Scoreboard en vivo':             'Live Scoreboard',
            'Tus vidas':                      'Your lives',
            'Selecciona una respuesta · usa A B C D': 'Select an answer · use A B C D',

            // ── lab/proyectiles.html ─────────────────────────────────────
            'Laboratorio de Proyectiles':     'Projectile Laboratory',
            'Parámetros de Entrada':          'Input Parameters',
            'Velocidad inicial (v₀)':         'Initial velocity (v₀)',
            'Ángulo de lanzamiento (θ)':      'Launch angle (θ)',
            'Altura inicial (y₀)':            'Initial height (y₀)',
            'Aceleración de la gravedad (g)': 'Gravitational acceleration (g)',
            'Escenas Predefinidas':           'Preset Scenes',
            'Tiro Clásico':                   'Classic Launch',
            'Horizontal':                     'Horizontal',
            'Tiro Alto':                      'High Launch',
            'Lunar':                          'Lunar',
            'Restablecer Valores':            'Reset Values',
            '▶️ Iniciar':                     '▶️ Start',
            '⏮️ Reiniciar':                   '⏮️ Reset',
            'Resultados Clave':               'Key Results',
            'Altura Máxima (yₘₐₓ)':          'Max Height (yₘₐₓ)',
            'Alcance (R)':                    'Range (R)',
            'Tiempo de Vuelo (T)':            'Flight Time (T)',
            'Tiempo Actual (t)':              'Current Time (t)',
            // Theory section
            '📜 Fundamentos Teóricos y Fórmulas': '📜 Theoretical Foundations & Formulas',
            'Componentes de Velocidad':       'Velocity Components',
            'Ecuaciones de Posición':         'Position Equations',
            'Métricas Clave del Vuelo':       'Key Flight Metrics',
            // Analysis guides
            '🔬 Análisis y Guías de Estudio': '🔬 Analysis & Study Guides',
            'Guía 1: El Ángulo Óptimo y los Ángulos Complementarios':
                'Guide 1: Optimal Angle and Complementary Angles',
            'Guía 2: Gravedad en Otros Mundos': 'Guide 2: Gravity in Other Worlds',
            'Guía 3: El Efecto de la Altura Inicial': 'Guide 3: The Effect of Initial Height',
            'Guía 4: Independencia de Movimientos': 'Guide 4: Independence of Motions',

            // ── lab/simulaciones.html ────────────────────────────────────
            '🐇 Modelo de Reproducción de Conejos': '🐇 Rabbit Reproduction Model',
            'Modelo de Reproducción de Conejos': 'Rabbit Reproduction Model',
            'Sucesión de Fibonacci':          'Fibonacci Sequence',
            // Controls
            'Número de Meses:':               'Number of Months:',
            'Velocidad de Animación':         'Animation Speed',
            'Iniciar Simulación':             'Start Simulation',
            'Reiniciar':                      'Reset',
            'Modo Avanzado':                  'Advanced Mode',
            // Advanced mode
            'Parámetros Personalizados':      'Custom Parameters',
            'Tiempo de Madurez (meses)':      'Maturity Time (months)',
            'Crías por Pareja':               'Offspring per Pair',
            'Freq. Reproducción (meses)':     'Reproduction Freq. (months)',
            // Formula & sections
            'Fórmula Matemática':             'Mathematical Formula',
            'Evolución por Meses':            'Monthly Evolution',
            '💧 Visualización de Burbujas':   '💧 Bubble Visualization',
            'Visualización de Parejas':       'Pair Visualization',
            '🌀 Espiral de Fibonacci':        '🌀 Fibonacci Spiral',
            'Tabla de Datos':                 'Data Table',
            // Bubble controls
            'Gravedad:':                      'Gravity:',
            'Fricción:':                      'Friction:',
            'Rebote:':                        'Bounce:',
            'Pausar Física':                  'Pause Physics',
            // Spiral controls
            'Espiral Dorada':                 'Golden Spiral',
            'Mandala':                        'Mandala',
            'Gráfico Polar':                  'Polar Chart',
            'Escala:':                        'Scale:',
            'Rotación:':                      'Rotation:',
            'Conectar:':                      'Connect:',
            'Animar Espiral':                 'Animate Spiral',
            // Export
            'Descargar CSV':                  'Download CSV',
            'Descargar JSON':                 'Download JSON',

            // ── lab/modulos/ — común ─────────────────────────────────────
            'Volver al Menú':                 'Back to Menu',

            // ── lab/modulos/datos.html ───────────────────────────────────
            'Modelado de Datos':              'Data Modeling',
            'Modelado de Datos Reales':       'Real Data Modeling',
            'Ajusta funciones matemáticas a conjuntos de datos y analiza patrones':
                'Fit mathematical functions to data sets and analyze patterns',
            'Regresión y Ajuste de Curvas':   'Regression and Curve Fitting',
            'Selecciona el Tipo de Función':  'Select Function Type',
            'Exponencial':                    'Exponential',
            'Logarítmica':                    'Logarithmic',
            'Selecciona el Conjunto de Datos': 'Select Data Set',
            'Temperatura':                    'Temperature',
            'Población':                      'Population',
            'Precio':                         'Price',
            'Velocidad':                      'Speed',
            'R-cuadrado':                     'R-squared',
            'Coeficiente de Correlación':     'Correlation Coefficient',
            'Error Estándar':                 'Standard Error',

            // ── lab/modulos/fisica.html ──────────────────────────────────
            'Fenómenos Físicos':              'Physical Phenomena',
            'Simulación de Fenómenos Físicos': 'Simulation of Physical Phenomena',
            'Modela movimientos y fuerzas del mundo real con matemáticas':
                'Model real-world movements and forces with mathematics',
            'Física y Matemáticas en Acción': 'Physics and Mathematics in Action',
            'Selecciona el Fenómeno Físico':  'Select Physical Phenomenon',
            'Tiro Parabólico de Proyectil':   'Projectile Parabolic Launch',
            'Distancia de Frenado':           'Braking Distance',
            'Péndulo Simple':                 'Simple Pendulum',
            'Oscilador de Resorte':           'Spring Oscillator',
            'Altura máxima':                  'Maximum height',
            'Alcance':                        'Range',
            'Tiempo de vuelo':                'Flight time',
            'Velocidad máxima':               'Maximum speed',
            'Energía total':                  'Total energy',

            // ── lab/modulos/geometrico.html ──────────────────────────────
            'Modelado Geométrico':            'Geometric Modeling',
            'Explora volúmenes, áreas y formas geométricas tridimensionales':
                'Explore volumes, areas and three-dimensional geometric shapes',
            'Volumen de Sólidos Geométricos': 'Volume of Geometric Solids',
            'Selecciona el Sólido Geométrico': 'Select Geometric Solid',
            'Caja (Box)':                     'Box',
            'Pirámide':                       'Pyramid',
            'Longitud':                       'Length',
            'Ancho':                          'Width',
            'Altura':                         'Height',
            'Radio':                          'Radius',
            'Volumen':                        'Volume',
            'Área Superficial':               'Surface Area',
            'Diagonal':                       'Diagonal',
            'Animar Modelo':                  'Animate Model',
            'Detener Animación':              'Stop Animation',

            // ── lab/modulos/optimizacion.html ────────────────────────────
            'Optimización Matemática':        'Mathematical Optimization',
            'Encuentra máximos y mínimos en problemas del mundo real':
                'Find maxima and minima in real-world problems',
            'Optimización y Cálculo Aplicado': 'Optimization and Applied Calculus',
            'Selecciona el Problema de Optimización': 'Select Optimization Problem',
            'Volumen Máximo de Caja':         'Maximum Box Volume',
            'Área Máxima de Cerco':           'Maximum Fence Area',
            'Costo Mínimo de Producción':     'Minimum Production Cost',
            'Distancia Mínima Entre Puntos':  'Minimum Distance Between Points',
            'Valor óptimo':                   'Optimal value',
            'Dimensiones óptimas':            'Optimal dimensions',
            'Restricciones':                  'Constraints',

            // ── salon/algebra.html ───────────────────────────────────────
            'Álgebra Moderna':                'Modern Algebra',
            'Fundamentos':                    'Fundamentals',
            'Funciones':                      'Functions',
            'FAQ':                            'FAQ',
            'Comenzar a aprender':            'Start Learning',
            'Fundamentos del Álgebra':        'Algebra Fundamentals',
            'Gráficas de Funciones Interactivas': 'Interactive Function Graphs',
            'Calculadoras Algebraicas':       'Algebraic Calculators',
            'Tabla de Fórmulas Clave':        'Key Formulas Table',
            'Preguntas Frecuentes':           'Frequently Asked Questions',
            'Variable':                       'Variable',
            'Constante':                      'Constant',
            'Coeficiente':                    'Coefficient',
            'Expresión':                      'Expression',
            'Añadir otra función':            'Add another function',
            'Resolvente Cuadrática':          'Quadratic Formula',
            'Evaluador de Función':           'Function Evaluator',
            'Resolver':                       'Solve',
            'Concepto':                       'Concept',
            'Fórmula':                        'Formula',
            'Forma explícita de la recta':    'Explicit form of the line',
            'Forma canónica (vértice)':       'Canonical form (vertex)',
            'Distancia entre dos puntos':     'Distance between two points',
            'Diferencia de cuadrados':        'Difference of squares',
            // Tipos de función
            'Lineal':                         'Linear',
            'Cuadrática':                     'Quadratic',
            'Valor Absoluto':                 'Absolute Value',
            'Raíz Cuadrada':                  'Square Root',
            'Recíproca':                      'Reciprocal',
            'Seno':                           'Sine',
            'Coseno':                         'Cosine',
            // Parámetros
            'Pendiente (m)':                  'Slope (m)',
            'Ordenada (b)':                   'Y-intercept (b)',
            'Apertura (a)':                   'Opening (a)',
            'Vértice x (h)':                  'Vertex x (h)',
            'Vértice y (k)':                  'Vertex y (k)',
            'Amplitud (A)':                   'Amplitude (A)',
            'Frecuencia (B)':                 'Frequency (B)',
            'Fase (C)':                       'Phase (C)',
            'Vertical (D)':                   'Vertical (D)',
            // Footer algebra
            '© 2025 Álgebra Moderna. Creado con fines educativos por Dr. Yonatan Guerrero Soriano.':
                '© 2025 Modern Algebra. Created for educational purposes by Dr. Yonatan Guerrero Soriano.',
            'Contenido bajo licencia Creative Commons. Accesibilidad como prioridad.':
                'Content under Creative Commons license. Accessibility as a priority.',

            // ── salon/estadisticas.html ──────────────────────────────────
            'Estadística Moderna':            'Modern Statistics',
            'Descriptiva':                    'Descriptive',
            'Gráficas':                       'Charts',
            'Probabilidad':                   'Probability',
            'Distribuciones':                 'Distributions',
            'Muestreo':                       'Sampling',
            'Glosario':                       'Glossary',
            'Domina el universo de los datos.': 'Master the universe of data.',
            'Comenzar a explorar':            'Start Exploring',
            'Ingresa tus Datos':              'Enter Your Data',
            'Cargar Ejemplo 1D (Notas)':      'Load 1D Example (Grades)',
            'Cargar Ejemplo 2D (Altura y Peso)': 'Load 2D Example (Height & Weight)',
            'Cargar .csv':                    'Load .csv',
            'Cargando resumen de datos...':   'Loading data summary...',

            // ── salon/finanzas.html ──────────────────────────────────────
            'Finanzas para Estudiantes':      'Finance for Students',
            'Tu Aventura Financiera Comienza Aquí': 'Your Financial Adventure Starts Here',
            'Comenzar a Aprender':            'Start Learning',
            'Crea tu Presupuesto':            'Create Your Budget',
            'La Regla 50/30/20':              'The 50/30/20 Rule',
            'Una guía simple para empezar:':  'A simple guide to get started:',
            'Editor de Presupuesto':          'Budget Editor',
            'Distribución de Gastos':         'Expense Distribution',
            'Imprimir Presupuesto':           'Print Budget',
            'Concepto':                       'Concept',
            'Monto ($)':                      'Amount ($)',
            'Categoría':                      'Category',
            'Necesidades':                    'Needs',
            'Deseos':                         'Wants',
            'Ahorro':                         'Savings',
            'Agregar Partida':                'Add Item',
            'Monto':                          'Amount',
            'Interés Simple vs. Compuesto':   'Simple vs. Compound Interest',
            'Capital Inicial (P)':            'Initial Capital (P)',
            'Tasa de Interés Anual (r %)':    'Annual Interest Rate (r %)',
            'Tiempo (t años)':                'Time (t years)',
            'Capitalización por año (n)':     'Compounding per year (n)',
            'Anual':                          'Annual',
            'Semestral':                      'Semi-annual',
            'Trimestral':                     'Quarterly',
            'Mensual':                        'Monthly',
            'Diaria':                         'Daily',
            'Comparación de Crecimiento':     'Growth Comparison',
            'Metas de Ahorro':                'Savings Goals',
            'Calculadora de Metas':           'Goals Calculator',
            'Meta de Ahorro (M)':             'Savings Goal (M)',
            'Aporte Mensual (d)':             'Monthly Contribution (d)',
            'Tasa Anual (r %)':               'Annual Rate (r %)',
            'Años para Ahorrar (t)':          'Years to Save (t)',
            'Resultados de Ahorro':           'Savings Results',
            'Deuda y Crédito':               'Debt and Credit',
            'Calculadora de Préstamo':        'Loan Calculator',
            'Monto del Préstamo (P)':         'Loan Amount (P)',
            'Tasa Anual (APR %)':             'Annual Rate (APR %)',
            'Plazo (años)':                   'Term (years)',
            'Tabla de Amortización':          'Amortization Table',
            'Mes':                            'Month',
            'Pago':                           'Payment',
            'Interés':                        'Interest',
            'Capital':                        'Principal',
            'Saldo':                          'Balance',
            'Inflación':                      'Inflation',
            'Calculadora de Inflación':       'Inflation Calculator',
            'Monto ($)':                      'Amount ($)',
            'Tasa de Inflación Anual (π %)':  'Annual Inflation Rate (π %)',
            'Años (t)':                       'Years (t)',
            'El Poder Adquisitivo':           'Purchasing Power',
            'Glosario Financiero':            'Financial Glossary',
            'Volver Arriba':                  'Back to Top',
            // Footer finanzas
            '© 2025 Finanzas Interactivas. Creado con fines educativos por Dr. Yonatan Guerrero Soriano.':
                '© 2025 Interactive Finance. Created for educational purposes by Dr. Yonatan Guerrero Soriano.',

            // ── salon/geometria.html ─────────────────────────────────────
            'Geometría Moderna':              'Modern Geometry',
            'Conceptos':                      'Concepts',
            'Figuras 2D':                     '2D Figures',
            'Sólidos 3D':                     '3D Solids',
            'Conceptos Esenciales':           'Essential Concepts',
            'Figuras 2D Interactivas':        'Interactive 2D Figures',
            'Nociones de Sólidos 3D':         '3D Solids Overview',
            'Calculadoras Geométricas':       'Geometric Calculators',
            // Concepts
            'Punto':                          'Point',
            'Recta':                          'Line',
            'Plano':                          'Plane',
            'Ángulo':                         'Angle',
            'Triángulo':                      'Triangle',
            'Círculo y Circunferencia':       'Circle and Circumference',
            'Perímetro':                      'Perimeter',
            'Área':                           'Area',
            // 2D figures
            'Cuadrado':                       'Square',
            'Rectángulo':                     'Rectangle',
            'Círculo':                        'Circle',
            'Paralelogramo':                  'Parallelogram',
            'Trapecio':                       'Trapezoid',
            // 3D solids
            'Cubo':                           'Cube',
            'Cilindro':                       'Cylinder',
            'Cono':                           'Cone',
            'Esfera':                         'Sphere',
            'Pirámide (base cuadrada)':       'Pyramid (square base)',
            'Prisma (base triangular)':       'Prism (triangular base)',
            // Calculators
            'Selecciona una figura:':         'Select a figure:',
            'Triángulo (base y altura)':      'Triangle (base and height)',
            'Cateto a:':                      'Leg a:',
            'Cateto b:':                      'Leg b:',
            'Hipotenusa c:':                  'Hypotenuse c:',
            'Comenzar a explorar':            'Start Exploring',

            // ── historiamath-examen.html ─────────────────────────────────
            // Lock screen
            'Examen Bloqueado':               'Exam Locked',
            'Ingresa la clave de acceso':     'Enter the access code',
            'Iniciar Examen':                 'Start Exam',
            'Clave incorrecta. Inténtalo de nuevo.': 'Incorrect code. Please try again.',
            // Security overlay
            'ADVERTENCIA':                    'WARNING',
            // Exam header
            'Examen: Historia de las Matemáticas': 'Exam: History of Mathematics',
            'En progreso':                    'In Progress',
            // Student info
            'Información del Estudiante':     'Student Information',
            'Nombre Completo':                'Full Name',
            'Selecciona tu grupo':            'Select your group',
            // Submit warning & button
            'Enviar Examen':                  'Submit Exam',
            // Results
            '¡Examen Completado!':            'Exam Completed!',
            'Calculando resultados...':       'Calculating results...',
            'Respuestas Correctas':           'Correct Answers',
            'Total de Preguntas':             'Total Questions',
            'Tiempo Utilizado':               'Time Used',
            'Calificación':                   'Grade',
            'Descargar Resultados':           'Download Results',
            'Descargar mi Certificado':       'Download My Certificate',
            'Descarga Profesor (Requiere Clave)': 'Professor Download (Requires Code)',
            // Acceso Profesor prompt
            'Ingresa la clave del profesor:': 'Enter the professor\'s code:',

            // ── historiamath-preguntas.html ──────────────────────────────
            'Preguntas de Análisis':          'Analysis Questions',
            'Volver':                         'Back',
            'Preguntas de Análisis Histórico': 'Historical Analysis Questions',
            'Información del Estudiante':     'Student Information',
            'Completa tus datos antes de responder las preguntas':
                'Complete your information before answering the questions',
            'Nombre Completo':                'Full Name',
            'Grupo':                          'Group',
            'Fecha':                          'Date',
            'Generar PDF y Enviar':           'Generate PDF and Submit',
            'Generando PDF y guardando respuestas...':
                'Generating PDF and saving answers...',
            'caracteres mínimos':             'minimum characters',

            // ── profesor-dashboard.html ──────────────────────────────────
            // Lock screen
            'Acceso de Profesor':             'Professor Access',
            'Ingresa la clave para acceder al dashboard':
                'Enter the code to access the dashboard',
            'Clave del profesor':             'Professor code',
            'Acceder':                        'Access',
            // Header
            'Dashboard del Profesor':         'Professor Dashboard',
            'Prof. Yonatan Guerrero':         'Prof. Yonatan Guerrero',
            'Página Principal':               'Main Page',
            'Salir':                          'Logout',
            // Stats
            'Exámenes Tomados':               'Exams Taken',
            'Completados Hoy':                'Completed Today',
            'Promedio General':               'General Average',
            'Tiempo Promedio':                'Average Time',
            // Controls
            'Todos los grupos':               'All groups',
            'Todas las calificaciones':       'All grades',
            'Calificación A':                 'Grade A',
            'Calificación B':                 'Grade B',
            'Calificación C':                 'Grade C',
            'Calificación D':                 'Grade D',
            'Calificación F':                 'Grade F',
            'Exportar CSV':                   'Export CSV',
            'Reporte Grupal':                 'Group Report',
            'Borrar Todo':                    'Clear All',
            // Table section
            'Resultados de Exámenes':         'Exam Results',
            'Actualizar':                     'Refresh',
            // Table headers
            'Estudiante':                     'Student',
            'Porcentaje':                     'Percentage',
            'Tiempo':                         'Time',
            'Seguridad':                      'Security',
            'Acciones':                       'Actions',
            // No results
            'No hay resultados disponibles':  'No results available',
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

            // historiamath.html — Timeline descriptions
            'Los babilonios desarrollan el sistema sexagesimal (base 60) y crean las primeras tablas matemáticas. Inventan conceptos fundamentales como el valor posicional.':
                'The Babylonians develop the sexagesimal system (base 60) and create the first mathematical tables. They invent fundamental concepts such as positional value.',
            'Los egipcios desarrollan un sistema decimal y utilizan matemáticas avanzadas para construir las pirámides. El papiro de Rhind contiene problemas matemáticos complejos.':
                'The Egyptians develop a decimal system and use advanced mathematics to build the pyramids. The Rhind Papyrus contains complex mathematical problems.',
            'Pitágoras y sus seguidores establecen las bases de la geometría. Se desarrolla el concepto de demostración matemática rigurosa.':
                'Pythagoras and his followers establish the foundations of geometry. The concept of rigorous mathematical proof is developed.',
            'Euclides publica "Los Elementos", una obra fundamental que sistematiza la geometría y establece el método axiomático.':
                'Euclid publishes "The Elements", a foundational work that systematizes geometry and establishes the axiomatic method.',
            'Al-Khwarizmi desarrolla el álgebra. Se introducen los números arábigos y se preserva y expande el conocimiento matemático griego.':
                'Al-Khwarizmi develops algebra. Arabic numerals are introduced and Greek mathematical knowledge is preserved and expanded.',
            'Fibonacci introduce los números arábigos en Europa. Se desarrollan nuevas técnicas algebraicas y se redescubren textos clásicos.':
                'Fibonacci introduces Arabic numerals to Europe. New algebraic techniques are developed and classical texts are rediscovered.',
            'Isaac Newton publica los "Principia Mathematica" y desarrolla el cálculo, revolucionando las matemáticas y la física.':
                'Isaac Newton publishes the "Principia Mathematica" and develops calculus, revolutionizing mathematics and physics.',
            'Desarrollo de teorías avanzadas como la relatividad, mecánica cuántica, teoría de conjuntos y matemáticas computacionales.':
                'Development of advanced theories such as relativity, quantum mechanics, set theory, and computational mathematics.',

            // historiamath.html — Periods descriptions
            'Las primeras civilizaciones desarrollan sistemas numéricos y técnicas matemáticas básicas para resolver problemas prácticos de comercio, construcción y astronomía.':
                'The first civilizations develop numerical systems and basic mathematical techniques to solve practical problems of trade, construction, and astronomy.',
            'Los griegos transforman las matemáticas de una herramienta práctica en una ciencia teórica rigurosa, estableciendo los fundamentos de la demostración matemática.':
                'The Greeks transform mathematics from a practical tool into a rigorous theoretical science, establishing the foundations of mathematical proof.',
            'Los matemáticos islámicos preservan, traducen y expanden el conocimiento griego, mientras desarrollan nuevas ramas como el álgebra y mejoran los métodos numéricos.':
                'Islamic mathematicians preserve, translate, and expand Greek knowledge, while developing new branches such as algebra and improving numerical methods.',
            'El renacimiento marca el renacimiento de las matemáticas en Europa, con nuevos desarrollos en álgebra, perspectiva y la introducción de simbolos matemáticos modernos.':
                'The Renaissance marks the rebirth of mathematics in Europe, with new developments in algebra, perspective, and the introduction of modern mathematical symbols.',
            'Las matemáticas experimentan una explosión de crecimiento con el desarrollo del cálculo, estadística, computación y nuevas ramas abstractas.':
                'Mathematics experiences an explosion of growth with the development of calculus, statistics, computation, and new abstract branches.',

            // historiamath.html — Fun facts descriptions
            'El símbolo ∞ fue introducido por el matemático John Wallis en 1655, inspirado en la forma de una serpiente mordiéndose la cola.':
                'The symbol ∞ was introduced by mathematician John Wallis in 1655, inspired by the shape of a snake biting its own tail.',
            'Los dígitos de π nunca se repiten ni terminan. Actualmente se conocen más de 31 billones de dígitos de esta constante matemática.':
                'The digits of π never repeat or end. Currently more than 31 trillion digits of this mathematical constant are known.',
            'En el 240 a.C., Eratóstenes calculó la circunferencia de la Tierra usando solo geometría y obtuvo un resultado asombrosamente preciso.':
                'In 240 BC, Eratosthenes calculated the circumference of the Earth using only geometry and obtained an astonishingly accurate result.',
            'El concepto de cero como número fue desarrollado en la India alrededor del siglo V d.C. y revolucionó las matemáticas para siempre.':
                'The concept of zero as a number was developed in India around the 5th century AD and revolutionized mathematics forever.',

            // historiamath.html — Mathematician contributions
            '"En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos."':
                '"In a right triangle, the square of the hypotenuse equals the sum of the squares of the legs."',
            'Sistematizó la geometría en 13 libros fundamentales.':
                'He systematized geometry in 13 fundamental books.',
            'Pionero del cálculo integral y la hidrostática.':
                'Pioneer of integral calculus and hydrostatics.',
            'Desarrolló métodos sistemáticos para resolver ecuaciones lineales y cuadráticas.':
                'He developed systematic methods for solving linear and quadratic equations.',
            'Pionero en óptica y método experimental.':
                'Pioneer in optics and the experimental method.',
            'Introdujo los números arábigos en Europa y descubrió la famosa secuencia.':
                'He introduced Arabic numerals to Europe and discovered the famous sequence.',
            'Co-inventor del cálculo y formulador de las leyes de la física.':
                'Co-inventor of calculus and formulator of the laws of physics.',
            'Co-inventor del cálculo con notación moderna.':
                'Co-inventor of calculus with modern notation.',
            'El matemático más prolífico de la historia.':
                'The most prolific mathematician in history.',
            'Contribuciones fundamentales en casi todas las áreas matemáticas.':
                'Fundamental contributions to almost all areas of mathematics.',

            // historiamath.html — Discoveries descriptions
            'Revolucionó las matemáticas al introducir el concepto de "nada" como número, permitiendo el sistema posicional y cálculos complejos.':
                'It revolutionized mathematics by introducing the concept of "nothing" as a number, enabling the positional system and complex calculations.',
            'Transformó las matemáticas de aritmética pura a manipulación simbólica, creando un lenguaje universal para resolver problemas.':
                'It transformed mathematics from pure arithmetic to symbolic manipulation, creating a universal language for solving problems.',
            'Permitió el análisis de cambio y movimiento, revolucionando la física, ingeniería y ciencias aplicadas.':
                'It enabled the analysis of change and motion, revolutionizing physics, engineering, and applied sciences.',
            'Estableció los fundamentos lógicos de la geometría con axiomas y demostraciones rigurosas que perduran hasta hoy.':
                'It established the logical foundations of geometry with axioms and rigorous proofs that endure to this day.',
            'Creó las bases teóricas de la computación moderna, transformando cada aspecto de la vida contemporánea.':
                'It created the theoretical foundations of modern computing, transforming every aspect of contemporary life.',
            'Revolucionó la toma de decisiones basada en datos, fundamental en ciencia, medicina y economía.':
                'It revolutionized data-based decision making, fundamental in science, medicine, and economics.',

            // historiamath.html — Footer
            '© 2025 Prof. Yonatan Guerrero Soriano - Historia de las Matemáticas':
                '© 2025 Prof. Yonatan Guerrero Soriano - History of Mathematics',
            'Explorando el fascinante mundo de las matemáticas a través de la historia':
                'Exploring the fascinating world of mathematics through history',

            // links.html — Hero description
            'Descubre una colección cuidadosamente seleccionada de herramientas digitales, \n                aplicaciones y plataformas que transformarán tu experiencia de aprendizaje matemático.':
                'Discover a carefully selected collection of digital tools, applications and platforms that will transform your mathematics learning experience.',

            // Ebook — Introducción hero
            'Una exploración STEAM para estudiantes de noveno grado sobre el crecimiento poblacional de organismos microscópicos utilizando modelos matemáticos y programación.':
                'A STEAM exploration for ninth grade students on the population growth of microscopic organisms using mathematical models and programming.',

            // Ebook — Relevancia
            'El modelado matemático es fundamental en múltiples campos científicos:':
                'Mathematical modeling is fundamental in multiple scientific fields:',
            'Investigación biológica para comprender patrones de crecimiento':
                'Biological research to understand growth patterns',
            'Desarrollo farmacéutico para predecir efectos de antibióticos':
                'Pharmaceutical development to predict antibiotic effects',
            'Control ambiental para gestionar ecosistemas':
                'Environmental management to manage ecosystems',
            'Programación de simulaciones como habilidad crítica para futuros científicos e ingenieros':
                'Simulation programming as a critical skill for future scientists and engineers',

            // Ebook — Nivel Educativo (li items)
            'Curiosidad natural por el mundo biológico':
                'Natural curiosity about the biological world',
            'Iniciación en funciones matemáticas':
                'Introduction to mathematical functions',
            'Conocimientos básicos de programación':
                'Basic programming knowledge',
            'Necesidad de experiencias prácticas que conecten teoría y aplicaciones reales':
                'Need for hands-on experiences connecting theory and real-world applications',

            // Ebook — Objetivos (li items)
            'Modelar el crecimiento de una población bacteriana usando el modelo logístico':
                'Model the growth of a bacterial population using the logistic model',
            'Interpretar gráficas de crecimiento poblacional':
                'Interpret population growth graphs',
            'Aplicar principios básicos de programación en JavaScript para simular modelos matemáticos':
                'Apply basic JavaScript programming to simulate mathematical models',
            'Fomentar el pensamiento crítico al analizar factores que limitan el crecimiento poblacional':
                'Foster critical thinking by analyzing factors that limit population growth',

            // Ebook — Integración STEAM (p items)
            'Comprender la reproducción bacteriana y factores limitantes en ecosistemas microbianos':
                'Understand bacterial reproduction and limiting factors in microbial ecosystems',
            'Programar simulaciones interactivas utilizando JavaScript y bibliotecas de visualización':
                'Program interactive simulations using JavaScript and visualization libraries',
            'Analizar limitaciones de sistemas naturales y diseñar soluciones para problemas complejos':
                'Analyze limitations of natural systems and design solutions for complex problems',
            'Diseñar gráficos y visualizaciones atractivas que comuniquen resultados científicos':
                'Design attractive graphics and visualizations that communicate scientific results',
            'Usar funciones logísticas para modelar datos y comprender el comportamiento de ecuaciones':
                'Use logistic functions to model data and understand equation behavior',

            // Ebook — Metodología (li items)
            'Explicación breve del crecimiento bacteriano':
                'Brief explanation of bacterial growth',
            'Presentación del modelo logístico':
                'Presentation of the logistic model',
            'Comparación visual entre crecimiento exponencial y logístico':
                'Visual comparison between exponential and logistic growth',
            'Código base en JavaScript provisto (plantilla)':
                'Base JavaScript code provided (template)',
            'Los estudiantes modificarán parámetros K, r, P₀':
                'Students will modify parameters K, r, P₀',
            'Visualización de los cambios en la gráfica':
                'Visualization of changes in the graph',
            'Discusión de cómo cambios en los parámetros afectan la población':
                'Discussion of how parameter changes affect the population',
            'Conexión a situaciones reales (por ejemplo, infecciones bacterianas, crecimiento de algas, etc.)':
                'Connection to real situations (e.g., bacterial infections, algae growth, etc.)',
            'Computadoras con acceso a Internet':
                'Computers with Internet access',
            'Editor de código online (ejemplo: repl.it, JSFiddle o Visual Studio Code)':
                'Online code editor (e.g., repl.it, JSFiddle or Visual Studio Code)',
            'Plantilla inicial de código JavaScript':
                'Initial JavaScript code template',
            'Acceso a gráficos en línea (por ejemplo, Chart.js)':
                'Access to online charts (e.g., Chart.js)',
            'Ajustar la tasa de crecimiento r':
                'Adjust the growth rate r',
            'Cambiar la capacidad de carga K':
                'Change the carrying capacity K',
            'Modificar la población inicial P₀':
                'Modify the initial population P₀',

            // Ebook — image captions (short p items)
            'Factores que limitan el crecimiento':
                'Factors that limit growth',
            'Colonia bacteriana real':
                'Real bacterial colony',

            // Ebook — Casos Reales (p items)
            'Investigadores de la Universidad de Stanford estudiaron el crecimiento de E. coli en diferentes medios de cultivo. Observaron que la capacidad de carga (K) variaba significativamente dependiendo de la concentración de glucosa en el medio.':
                'Researchers at Stanford University studied the growth of E. coli in different culture media. They observed that the carrying capacity (K) varied significantly depending on the glucose concentration in the medium.',
            'En un estudio clínico sobre infecciones del tracto urinario, se modeló el crecimiento de bacterias en pacientes con y sin tratamiento antibiótico. El modelo logístico permitió predecir la eficacia de diferentes dosis de antibióticos.':
                'In a clinical study on urinary tract infections, bacterial growth was modeled in patients with and without antibiotic treatment. The logistic model allowed prediction of the efficacy of different antibiotic doses.',
            'Investigadores utilizaron bacterias Pseudomonas para degradar contaminantes en un lago. El modelo logístico ayudó a predecir cuánto tiempo tomaría alcanzar niveles seguros de limpieza y la cantidad óptima de bacterias a introducir.':
                'Researchers used Pseudomonas bacteria to degrade contaminants in a lake. The logistic model helped predict how long it would take to reach safe cleanup levels and the optimal number of bacteria to introduce.',

            // Ebook — Visualización Avanzada
            'Esta herramienta te permite comparar múltiples escenarios de crecimiento bacteriano simultáneamente. Configura hasta tres modelos diferentes y observa cómo los cambios en los parámetros afectan el crecimiento poblacional.':
                'This tool lets you compare multiple bacterial growth scenarios simultaneously. Configure up to three different models and observe how parameter changes affect population growth.',

            // Ebook — Laboratorio Virtual
            'Experimenta con un microscopio virtual para observar colonias bacterianas en diferentes etapas de crecimiento. Esta herramienta te permite conectar los modelos matemáticos con observaciones reales.':
                'Experiment with a virtual microscope to observe bacterial colonies at different growth stages. This tool lets you connect mathematical models with real observations.',
            'Selecciona una muestra para ver las observaciones detalladas.':
                'Select a sample to see the detailed observations.',

            // Ebook — Adaptaciones (li items)
            'Introducir la variación de r en el tiempo (modelo logístico con tasas variables)':
                'Introduce the variation of r over time (logistic model with variable rates)',
            'Hacer que los estudiantes programen desde cero el modelo en JavaScript':
                'Have students program the model from scratch in JavaScript',
            'Incluir factores adicionales como depredación o competencia':
                'Include additional factors such as predation or competition',
            'Analizar datos reales de crecimiento bacteriano':
                'Analyze real bacterial growth data',
            'Dar plantillas completas donde solo cambien valores de parámetros':
                'Provide complete templates where only parameter values are changed',
            'Usar simuladores en línea donde no sea necesario programar, solo observar resultados':
                'Use online simulators where no programming is needed, just observe results',
            'Trabajar solo con el modelo exponencial primero, y luego introducir el logístico':
                'Work only with the exponential model first, then introduce the logistic model',
            'Realizar la actividad en grupos para apoyo mutuo':
                'Carry out the activity in groups for mutual support',

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

            // ── club/mision-matematica/index.html — Párrafos ────────────
            // Misión y Visión
            'Fomentar la excelencia matemática y el pensamiento crítico entre los estudiantes de décimo grado mediante experiencias educativas enriquecedoras que trasciendan el currículo tradicional. Nuestro club se compromete a cultivar una comunidad de aprendizaje colaborativo donde cada estudiante desarrolle confianza en sus habilidades matemáticas, descubra aplicaciones prácticas de las matemáticas en la vida cotidiana, y se prepare para competir exitosamente en olimpiadas y concursos académicos a nivel local, regional y nacional.':
                'To foster mathematical excellence and critical thinking among tenth grade students through enriching educational experiences that transcend the traditional curriculum. Our club is committed to cultivating a collaborative learning community where every student builds confidence in their mathematical abilities, discovers practical applications of mathematics in everyday life, and prepares to compete successfully in olympiads and academic contests at local, regional, and national levels.',
            'Ser reconocidos como el club de matemáticas líder en nuestra región, donde los estudiantes no solo dominan conceptos matemáticos avanzados, sino que también desarrollan pasión por la investigación matemática y la resolución creativa de problemas. Aspiramos a formar futuros profesionales en carreras STEM que contribuyan significativamente al desarrollo científico y tecnológico de Puerto Rico, manteniendo siempre los valores de integridad académica, trabajo en equipo y perseverancia.':
                'To be recognized as the leading mathematics club in our region, where students not only master advanced mathematical concepts but also develop a passion for mathematical research and creative problem solving. We aspire to train future professionals in STEM careers who contribute significantly to the scientific and technological development of Puerto Rico, always upholding the values of academic integrity, teamwork, and perseverance.',
            // Propósitos cards
            'Enriquecer la educación matemática formal con actividades extracurriculares que desafíen y motiven a los estudiantes':
                'Enrich formal mathematics education with extracurricular activities that challenge and motivate students',
            'Preparar a los estudiantes para participar en competencias matemáticas regionales, nacionales e internacionales':
                'Prepare students to participate in regional, national, and international mathematics competitions',
            'Desarrollar habilidades de investigación matemática y metodología científica en el análisis de problemas complejos':
                'Develop mathematical research skills and scientific methodology in the analysis of complex problems',
            'Promover el aprendizaje colaborativo y el intercambio de estrategias de resolución de problemas entre pares':
                'Promote collaborative learning and the exchange of problem-solving strategies among peers',
            'Desarrollar autoconfianza y motivación de los estudiantes hacia las matemáticas y las ciencias':
                'Develop student self-confidence and motivation toward mathematics and science',

            // Actividades semanales
            'Práctica intensiva con problemas de olimpiadas matemáticas, estrategias heurísticas y técnicas de demostración':
                'Intensive practice with mathematical olympiad problems, heuristic strategies, and proof techniques',
            'Desarrollo de proyectos de investigación, análisis de datos, uso de software matemático (GeoGebra, Desmos) y preparación de presentaciones científicas':
                'Development of research projects, data analysis, use of mathematical software (GeoGebra, Desmos) and preparation of scientific presentations',
            'Exploración de temas matemáticos avanzados, paradojas, historia de las matemáticas y aplicaciones contemporáneas':
                'Exploration of advanced mathematical topics, paradoxes, history of mathematics, and contemporary applications',

            // Timeline de eventos
            'Sesión de bienvenida e inscripción. Talleres introductorios de estrategias de resolución de problemas y metodología de investigación matemática':
                'Welcome session and enrollment. Introductory workshops on problem-solving strategies and mathematical research methodology',
            'Competencia interna de resolución de problemas. Sesiones intensivas de preparación y simulacros de exámenes competitivos':
                'Internal problem-solving competition. Intensive preparation sessions and competitive exam mock tests',
            'Visita a la Universidad de Puerto Rico, Recinto de Río Piedras. Interacción con profesores del Departamento de Matemáticas. Charlas sobre carreras STEM':
                'Visit to the University of Puerto Rico, Río Piedras campus. Interaction with professors from the Department of Mathematics. Talks on STEM careers',
            'Presentación de proyectos de investigación del primer semestre. Evaluación y retroalimentación de actividades. Reconocimientos a participantes destacados':
                'Presentation of first semester research projects. Evaluation and feedback on activities. Recognition of outstanding participants',
            'Inicio de proyectos de investigación del segundo semestre. Mentoría en metodología científica. Desarrollo de hipótesis y diseño experimental':
                'Start of second semester research projects. Mentoring in scientific methodology. Hypothesis development and experimental design',
            'Celebración especial con actividades diarias: juegos matemáticos, exposiciones, charlas de matemáticos invitados, competencia escolar \'Reto Matemático\', día de π (3/14), y feria de proyectos':
                'Special celebration with daily activities: math games, exhibitions, talks by guest mathematicians, school competition \'Math Challenge\', Pi Day (3/14), and project fair',
            'Participación en competencia regional de matemáticas. Preparación intensiva y simulacros. Análisis post-competencia y áreas de mejora':
                'Participation in regional mathematics competition. Intensive preparation and mock tests. Post-competition analysis and areas for improvement',
            'Simposio final de investigaciones. Ceremonia de reconocimientos y certificados. Evaluación del impacto del club y planificación para el próximo año':
                'Final research symposium. Awards and certificates ceremony. Evaluation of club impact and planning for next year',

            // Objetivos del club
            'Incrementar el rendimiento académico en matemáticas de los estudiantes participantes':
                'Increase the academic performance in mathematics of participating students',
            'Participar en al menos tres competencias matemáticas durante el año escolar':
                'Participate in at least three mathematics competitions during the school year',
            'Resolver problemas no rutinarios y desarrollar estrategias heurísticas':
                'Solve non-routine problems and develop heuristic strategies',
            'Preparación intensiva para competir exitosamente':
                'Intensive preparation to compete successfully',
            'Proyectos que conectan teoría con aplicaciones del mundo real':
                'Projects connecting theory with real-world applications',
            'Exposición a carreras STEM y ambiente universitario':
                'Exposure to STEM careers and university environment',
            'Celebración especial con múltiples actividades':
                'Special celebration with multiple activities',

            // Galería
            'Capturando los mejores momentos de nuestras actividades matemáticas':
                'Capturing the best moments of our mathematical activities',
            'Estudiantes demostrando sus habilidades de resolución de problemas':
                'Students demonstrating their problem-solving skills',
            'Explorando carreras STEM y conociendo profesores':
                'Exploring STEM careers and meeting professors',
            'Actividades especiales y juegos matemáticos':
                'Special activities and math games',
            'Trabajo colaborativo en problemas desafiantes':
                'Collaborative work on challenging problems',
            'Estudiantes mostrando sus investigaciones matemáticas':
                'Students showcasing their mathematical research',
            'Celebrando los logros de nuestros participantes':
                'Celebrating the achievements of our participants',

            // Recursos
            'Acceso a libros, artículos y material didáctico de matemáticas':
                'Access to books, articles and teaching materials on mathematics',
            'Herramientas digitales para visualización y experimentación matemática':
                'Digital tools for mathematical visualization and experimentation',
            'Grabaciones de talleres, conferencias y sesiones especiales':
                'Recordings of workshops, conferences and special sessions',
            'Colección curada de problemas por nivel y tema matemático':
                'Curated collection of problems by level and mathematical topic',
            'Herramientas computacionales para cálculos complejos':
                'Computational tools for complex calculations',
            'Espacio para compartir dudas, soluciones y descubrimientos':
                'Space to share questions, solutions and discoveries',

            // Contacto
            'El Club de Matemáticas Misión Matemática está abierto a todos los estudiantes de décimo grado apasionados por los números y el razonamiento lógico. No importa tu nivel actual, ¡lo que cuenta es tu curiosidad y determinación!':
                'The Misión Matemática Math Club is open to all tenth grade students passionate about numbers and logical reasoning. No matter your current level, what counts is your curiosity and determination!',
            'Martes y Jueves: 2:30 - 4:00 PM':  'Tuesday and Thursday: 2:30 - 4:00 PM',
            'Viernes alternos: 2:30 - 4:00 PM': 'Alternating Fridays: 2:30 - 4:00 PM',

            // Nota galería
            'Las fotos de nuestras actividades se actualizarán regularmente a medida que avanza el año escolar. ¡Síguenos en nuestras redes sociales para ver más momentos!':
                'Photos from our activities will be updated regularly as the school year progresses. Follow us on social media to see more moments!',

            // ── salon/algebra.html — párrafos ────────────────────────────
            'Descubre el poder de las variables y las funciones. Visualiza conceptos, resuelve ecuaciones y domina las herramientas del álgebra de forma interactiva.':
                'Discover the power of variables and functions. Visualize concepts, solve equations and master algebra tools interactively.',
            'El lenguaje de las matemáticas. Estos son los bloques de construcción esenciales.':
                'The language of mathematics. These are the essential building blocks.',
            'Visualiza cómo los parámetros transforman las funciones. Mueve los deslizadores y observa los cambios en tiempo real.':
                'Visualize how parameters transform functions. Move the sliders and observe changes in real time.',
            'Herramientas rápidas para resolver problemas comunes y evaluar funciones.':
                'Quick tools to solve common problems and evaluate functions.',

            // ── salon/estadisticas.html — párrafos ───────────────────────
            'Una guía interactiva para explorar, visualizar y entender la estadística de una forma nueva y audaz.':
                'An interactive guide to explore, visualize and understand statistics in a new and bold way.',
            'Pega tus datos aquí, carga un archivo CSV o usa los datos de ejemplo. La magia comenzará al instante.':
                'Paste your data here, load a CSV file or use the sample data. The magic will start instantly.',

            // ── salon/finanzas.html — párrafos ───────────────────────────
            'Aprende a manejar tu dinero de forma inteligente y divertida. Desde crear tu primer presupuesto hasta entender cómo crece tu ahorro, te guiaremos paso a paso.':
                'Learn to manage your money in a smart and fun way. From creating your first budget to understanding how your savings grow, we will guide you step by step.',
            'Un presupuesto es un plan para tu dinero. Te ayuda a saber cuánto ganas, cuánto gastas y a dónde va cada peso. ¡Es el primer paso para tomar el control!':
                'A budget is a plan for your money. It helps you know how much you earn, how much you spend and where every dollar goes. It is the first step to taking control!',
            'El interés es el costo de pedir dinero prestado, o la ganancia por prestarlo. ¡Entender la diferencia entre simple y compuesto es clave para que tu dinero crezca!':
                'Interest is the cost of borrowing money, or the gain from lending it. Understanding the difference between simple and compound is key to making your money grow!',
            'Ahorrar es guardar una parte de tu dinero para el futuro. Con aportes periódicos y el interés compuesto, puedes alcanzar grandes metas.':
                'Saving is setting aside part of your money for the future. With regular contributions and compound interest, you can reach great goals.',
            'El crédito te permite comprar algo ahora y pagarlo después, pero casi siempre con intereses. Entender cómo funciona te ayuda a evitar deudas costosas.':
                'Credit allows you to buy something now and pay later, but almost always with interest. Understanding how it works helps you avoid costly debt.',
            'La inflación hace que tu dinero pierda valor con el tiempo. Lo que hoy compras con $100, en el futuro costará más. ¡Es importante que tus ahorros crezcan más rápido que la inflación!':
                'Inflation causes your money to lose value over time. What you buy today with $100 will cost more in the future. It is important that your savings grow faster than inflation!',

            // ── salon/geometria.html — párrafos ──────────────────────────
            'Explora el fascinante mundo de las formas, el espacio y las medidas de una manera visual e interactiva. Desde los conceptos más básicos hasta cálculos prácticos.':
                'Explore the fascinating world of shapes, space and measurements in a visual and interactive way. From the most basic concepts to practical calculations.',
            'Los pilares sobre los que se construye toda la geometría. Entiende estas ideas fundamentales para dominar el resto.':
                'The pillars on which all geometry is built. Understand these fundamental ideas to master the rest.',
            'Pasa el cursor o enfoca las figuras para ver sus componentes clave. La geometría cobra vida.':
                'Hover or focus the figures to see their key components. Geometry comes to life.',
            'Una introducción a las figuras tridimensionales. Observa sus caras, aristas y vértices en estas ilustraciones isométricas.':
                'An introduction to three-dimensional figures. Observe their faces, edges and vertices in these isometric illustrations.',
            'Pon a prueba tus conocimientos. Introduce los datos y obtén resultados precisos al instante.':
                'Test your knowledge. Enter the data and get precise results instantly.',
            'Introduce dos valores para hallar el tercero. Deja en blanco el que quieres calcular.':
                'Enter two values to find the third. Leave blank the one you want to calculate.',

            // ── historiamath-examen.html — párrafos ──────────────────────
            'Este examen requiere una clave de acceso proporcionada por el profesor. \n                Una vez iniciado, no podrás salir hasta completarlo.':
                'This exam requires an access code provided by the professor. Once started, you will not be able to leave until you complete it.',
            'Has intentado salir del examen. Esta acción está prohibida y ha sido registrada.':
                'You have attempted to leave the exam. This action is prohibited and has been recorded.',
            'El examen se enviará automáticamente en 10 segundos.':
                'The exam will be submitted automatically in 10 seconds.',
            'Una vez enviado el examen, no podrás realizar cambios. \n                    Revisa tus respuestas antes de continuar.':
                'Once the exam is submitted, you will not be able to make changes. Review your answers before continuing.',

            // ── historiamath-preguntas.html — párrafos ───────────────────
            'Reflexiona sobre los grandes momentos de la historia matemática y demuestra tu comprensión':
                'Reflect on the great moments in the history of mathematics and demonstrate your understanding',
            'Completa tus datos antes de responder las preguntas':
                'Complete your information before answering the questions',
            // Question 1
            '¿Qué impacto tuvo la invención del cero en la historia del cálculo y las matemáticas en general?':
                'What impact did the invention of zero have on the history of calculus and mathematics in general?',
            'Considera cómo el concepto de "nada" como número revolucionó \n                        los sistemas de numeración y permitió desarrollos matemáticos posteriores.':
                'Consider how the concept of "nothing" as a number revolutionized numeration systems and enabled subsequent mathematical developments.',
            // Question 2
            'Compara las contribuciones de los matemáticos griegos con las del mundo islámico. \n                        ¿Cómo se complementaron estos dos períodos históricos?':
                'Compare the contributions of Greek mathematicians with those of the Islamic world. How did these two historical periods complement each other?',
            'Piensa en las diferencias de enfoque: los griegos se \n                        centraron en la geometría y demostraciones, mientras que los matemáticos islámicos \n                        desarrollaron el álgebra y preservaron conocimientos.':
                'Think about the differences in approach: the Greeks focused on geometry and proofs, while Islamic mathematicians developed algebra and preserved knowledge.',
            // Question 3
            'Explica por qué los "Elementos" de Euclides han sido tan influyentes durante más de 2000 años. \n                        ¿Qué los hace únicos en la historia de las matemáticas?':
                'Explain why Euclid\'s "Elements" has been so influential for more than 2000 years. What makes it unique in the history of mathematics?',
            'Considera el método axiomático, la organización sistemática \n                        del conocimiento geométrico y cómo estableció estándares para el razonamiento matemático.':
                'Consider the axiomatic method, the systematic organization of geometric knowledge and how it established standards for mathematical reasoning.',
            // Question 4
            '¿Cómo cambió la revolución científica del siglo XVII (Newton, Leibniz, Descartes) \n                        la naturaleza de las matemáticas? Analiza el desarrollo del cálculo.':
                'How did the 17th century scientific revolution (Newton, Leibniz, Descartes) change the nature of mathematics? Analyze the development of calculus.',
            'Reflexiona sobre cómo el cálculo permitió modelar cambio y movimiento, \n                        y conectó las matemáticas con la física de manera sin precedentes.':
                'Reflect on how calculus enabled modeling of change and motion, and connected mathematics with physics in unprecedented ways.',
            // Question 5
            'Las matemáticas han evolucionado de ser una herramienta práctica a una ciencia abstracta. \n                        Analiza esta transformación y reflexiona sobre el futuro de las matemáticas en la era digital.':
                'Mathematics has evolved from being a practical tool to an abstract science. Analyze this transformation and reflect on the future of mathematics in the digital age.',
            'Considera la transición desde las matemáticas aplicadas de las \n                        civilizaciones antiguas hasta las matemáticas puras modernas, y cómo la computación está \n                        creando nuevas ramas matemáticas.':
                'Consider the transition from the applied mathematics of ancient civilizations to modern pure mathematics, and how computing is creating new mathematical branches.',
            // Submit section
            '¡Respuestas enviadas exitosamente! El PDF se ha generado y guardado.':
                'Answers submitted successfully! The PDF has been generated and saved.',

            // ── lab/proyectiles.html — párrafos ──────────────────────────
            'Usa estas preguntas para explorar los conceptos clave del movimiento de proyectiles con el simulador. ¡Experimenta y descubre!':
                'Use these questions to explore the key concepts of projectile motion with the simulator. Experiment and discover!',
            'Desarrollado como una herramienta educativa de código abierto. Licencia MIT.':
                'Developed as an open-source educational tool. MIT License.',

            // ── lab/simulaciones.html — párrafos ─────────────────────────
            'En 1202, Leonardo de Pisa (conocido como Fibonacci) planteó un problema fascinante: \n                ¿Cuántas parejas de conejos se producirían en un año si cada pareja madura da lugar \n                a una nueva pareja cada mes, y las crías tardan un mes en madurar? Este modelo \n                matemático revela uno de los patrones más hermosos de la naturaleza.':
                'In 1202, Leonardo of Pisa (known as Fibonacci) posed a fascinating problem: How many pairs of rabbits would be produced in a year if each mature pair gives rise to a new pair each month, and the young take a month to mature? This mathematical model reveals one of the most beautiful patterns in nature.',
            'Donde F(0) = 0, F(1) = 1, y cada término es la suma de los dos anteriores':
                'Where F(0) = 0, F(1) = 1, and each term is the sum of the two previous ones',

            // ── lab/experimentos.html — párrafos ──────────────────────────
            'Explora las matemáticas a través de simulaciones interactivas y experimentos virtuales. Cada módulo está diseñado para hacer tangibles los conceptos abstractos.':
                'Explore mathematics through interactive simulations and virtual experiments. Each module is designed to make abstract concepts tangible.',
            'Simulador comparativo de interés simple y compuesto con visualizaciones gráficas interactivas.':
                'Comparative simulator of simple and compound interest with interactive graphical visualizations.',
            'Visualización interactiva de ecuaciones algebraicas usando una balanza virtual.':
                'Interactive visualization of algebraic equations using a virtual balance.',
            'Explorador interactivo del círculo unitario con funciones trigonométricas dinámicas.':
                'Interactive explorer of the unit circle with dynamic trigonometric functions.',
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

            // ── lab/proyectiles.html — párrafos con HTML ──────────────────
            'El movimiento parabólico se analiza descomponiendo el movimiento en dos ejes independientes: horizontal (eje x) y vertical (eje y).':
                'Parabolic motion is analyzed by decomposing the motion into two independent axes: <strong>horizontal (x-axis)</strong> and <strong>vertical (y-axis)</strong>.',
            'Eje Horizontal (x): El movimiento es a velocidad constante (Movimiento Rectilíneo Uniforme, MRU), ya que no hay aceleración horizontal (ignorando la resistencia del aire).':
                '<strong>Horizontal Axis (x):</strong> Motion is at constant velocity (Uniform Rectilinear Motion, URM), since there is no horizontal acceleration (ignoring air resistance).',
            'Pregunta: Para una velocidad inicial fija y sin altura inicial, ¿qué ángulo de lanzamiento produce el mayor alcance? ¿Qué sucede si lanzas a 30° y a 60°? ¿Qué observas?':
                '<strong>Question:</strong> For a fixed initial velocity and no initial height, what launch angle produces the greatest range? What happens if you launch at 30° and 60°? What do you observe?',
            'Instrucciones: Fija la velocidad en 30 m/s y la altura en 0 m. Prueba ángulos como 15°, 30°, 45°, 60° y 75°. Anota el alcance para cada uno. Compara los resultados de 30° y 60°. ¿Ves un patrón con los ángulos que suman 90°?':
                '<strong>Instructions:</strong> Set the velocity to 30 m/s and the height to 0 m. Try angles like 15°, 30°, 45°, 60° and 75°. Record the range for each. Compare the results of 30° and 60°. Do you see a pattern with angles that add up to 90°?',
            'Pregunta: Lanza un proyectil con los mismos parámetros (ej. v₀=20 m/s, θ=45°) en la Tierra (g=9.81 m/s²) y en la Luna (g=1.62 m/s²). ¿Cómo cambian la altura máxima y el alcance?':
                '<strong>Question:</strong> Launch a projectile with the same parameters (e.g. v₀=20 m/s, θ=45°) on Earth (g=9.81 m/s²) and on the Moon (g=1.62 m/s²). How do the maximum height and range change?',
            'Instrucciones: Usa la escena "Tiro Clásico" y luego cambia solo el valor de la gravedad a 1.62. Observa cómo se estira la parábola y compara los resultados numéricos.':
                '<strong>Instructions:</strong> Use the "Classic Launch" scene and then change only the gravity value to 1.62. Observe how the parabola stretches and compare the numerical results.',
            'Pregunta: ¿Cómo afecta la altura inicial (y₀) al tiempo de vuelo y al alcance? ¿Es el tiempo de subida igual al tiempo de bajada si y₀ > 0?':
                '<strong>Question:</strong> How does the initial height (y₀) affect flight time and range? Is the rise time equal to the fall time if y₀ > 0?',
            'Instrucciones: Realiza un lanzamiento desde y₀=0. Anota el tiempo de vuelo. Ahora, aumenta la altura a 5 m y vuelve a lanzar con los mismos v₀ y θ. Compara el nuevo tiempo de vuelo. Observa la forma de la parábola, ¿es simétrica?':
                '<strong>Instructions:</strong> Launch from y₀=0. Record the flight time. Now increase the height to 5 m and launch again with the same v₀ and θ. Compare the new flight time. Observe the shape of the parabola — is it symmetrical?',
            'Pregunta: En un tiro horizontal (θ=0°), ¿de qué depende el tiempo que tarda el objeto en caer al suelo? ¿Depende de la velocidad inicial horizontal?':
                '<strong>Question:</strong> In a horizontal launch (θ=0°), what determines the time it takes the object to hit the ground? Does it depend on the initial horizontal velocity?',
            'Instrucciones: Usa la escena "Horizontal" (v₀=15 m/s, y₀=5 m). Anota el tiempo de vuelo. Ahora, cambia la velocidad a 30 m/s sin cambiar la altura. ¿Cambia el tiempo de vuelo? ¿Qué concluyes sobre la independencia de los movimientos vertical y horizontal?':
                '<strong>Instructions:</strong> Use the "Horizontal" scene (v₀=15 m/s, y₀=5 m). Record the flight time. Now change the velocity to 30 m/s without changing the height. Does the flight time change? What do you conclude about the independence of vertical and horizontal motion?',
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
                    const tag = node.parentElement?.tagName?.toUpperCase();
                    if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
                    // Protect MathJax-rendered formulas from being modified
                    if (node.parentElement?.closest('.formula, mjx-container, .MathJax, [class*="MathJax"]'))
                        return NodeFilter.FILTER_SKIP;
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

        // IDs to translate, in order (each finishes later than the previous)
        const ids = ['mainTitle', 'subtitle', 'professorName', 'description'];
        const done = new Set();

        // Only overwrite an element once it has the 'finished' class
        // (set by the typewriter when the animation completes)
        const poll = () => {
            ids.forEach(id => {
                if (done.has(id) || !texts[id]) return;
                const el = document.getElementById(id);
                if (el && el.classList.contains('finished')) {
                    el.textContent = texts[id];
                    done.add(id);
                }
            });
            // Keep polling until all elements are translated
            if (done.size < ids.length) setTimeout(poll, 600);
        };

        setTimeout(poll, 600);
    }

    // ── Actualiza el botón ─────────────────────────────────────────────────
    function updateButton(lang) {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        if (lang === 'en') {
            btn.innerHTML = 'ES';
            btn.title = 'Cambiar a Español';
        } else {
            btn.innerHTML = 'EN';
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
