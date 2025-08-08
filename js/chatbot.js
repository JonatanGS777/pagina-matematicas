// chatbot.js - Módulo del Chat Bot de Historia y Navegación Matemática
// Guía del sitio + Historia de las Matemáticas (por periodos) + Contacto
// No resuelve ejercicios: filtra y redirige a historia/navegación/contacto

class MathChatBot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.chatContainer = null;
        this.toggleButton = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.currentTypingMessage = null;
        this.studentName = '';
        this.professorEmail = 'de155349@miescuela.pr';
        this.professorName = 'Prof. Yonatan Guerrero Soriano';
        this.conversationHistory = [];
        this.searchHistory = [];
        this.currentPeriod = null;
        this.favoriteTopics = new Set();
        
        // Configuración del sitio
        this.siteLinks = {
            historia: 'contexto/historiamath.html',
            enlaces: 'links/links.html',
            materiales: 'materiales/materiales.html',
            galeria: 'galeria/galeria.html',
            cienciaDatos: 'stem/ciencia-datos.html',
            robotica: 'stem/robotica.html',
            programacion: 'stem/programacion.html',
            ingenieria: 'stem/ingenieria.html',
            ebookStem: 'stem/Ebook%20STEM/index.html', // Fixed: URL encoded space
            olimpiadas: 'club/olimpiadas.html',
            proyectos: 'club/proyectos-creativos.html',
            competencias: 'club/competencias.html',
            investigacion: 'club/investigacion.html',
            labExperimentos: 'lab/experimentos.html',
            labSimulaciones: 'lab/simulaciones.html',
            labJuegos: 'lab/juegos.html',
            labModelado: 'lab/modelado.html'
        };
        
        // Banco ampliado de Historia por periodos
        this.historyBank = {
            'Prehistoria': [
                '🦴 Hueso de Ishango (~20,000 a.C.): posiblemente el artefacto matemático más antiguo con marcas de conteo.',
                '🗿 Notación numérica en cuevas: marcas talladas para registrar ciclos lunares y estaciones.',
                '🎨 Geometría en el arte rupestre: patrones simétricos y proporciones en pinturas paleolíticas.',
                '🔢 Primeros sistemas de conteo: uso de dedos, piedras y muescas para comercio primitivo.',
                '🌙 Astronomía temprana: observación de ciclos para agricultura y migración.'
            ],
            'Mesopotamia': [
                '📜 Plimpton 322 (~1800 a.C.): tabla con ternas pitagóricas, 1000 años antes de Pitágoras.',
                '🧮 Sistema sexagesimal babilónico (base 60): origen de nuestros 60 minutos y 360 grados.',
                '📐 Tablas de multiplicar cuneiformes: educación matemática sistematizada hace 4000 años.',
                '📏 Ecuaciones cuadráticas babilónicas: métodos algorítmicos similares a "completar el cuadrado".',
                '🏛️ Matemática administrativa: contabilidad compleja para templos y palacios.',
                '⚖️ Código de Hammurabi: leyes con cálculos de interés compuesto y proporciones.',
                '🌾 Agrimensura mesopotámica: cálculo de áreas irregulares para impuestos.',
                '🔮 Astrología matemática: predicciones basadas en cálculos astronómicos precisos.'
            ],
            'Egipto Antiguo': [
                '📄 Papiro Rhind (~1650 a.C.): manual matemático con 84 problemas resueltos.',
                '🔺 Papiro de Moscú: contiene el cálculo del volumen de un tronco de pirámide.',
                '🏗️ Matemática de las pirámides: proporciones áureas y triángulos 3-4-5.',
                '➗ Fracciones unitarias egipcias: todo número expresado como suma de fracciones 1/n.',
                '📏 Cuerda de 12 nudos: herramienta para crear ángulos rectos en construcción.',
                '🌊 Nilómetros: medición matemática de crecidas para predecir cosechas.',
                '👁️ Ojo de Horus: sistema de fracciones basado en mitología.',
                '📅 Calendario de 365 días: precisión astronómica sorprendente.',
                '⚱️ Geometría funeraria: cálculos para tumbas y sarcófagos.'
            ],
            'Grecia Clásica': [
                '📐 Euclides y "Los Elementos": el libro más influyente después de la Biblia.',
                '🎵 Pitágoras: números, música y el teorema más famoso de la historia.',
                '💫 Platón y los sólidos perfectos: geometría como lenguaje del universo.',
                '🧪 Arquímedes: "¡Eureka!" y el principio de la palanca.',
                '🌀 La espiral de Arquímedes: primera curva mecánica de la historia.',
                '📊 Apolonio: secciones cónicas que usamos en órbitas satelitales.',
                '∞ Zenón y sus paradojas: primeros debates sobre el infinito.',
                '📏 Tales de Mileto: midió pirámides con sombras.',
                '🔢 Números perfectos y amigos: misticismo matemático pitagórico.',
                '🏛️ Academia de Platón: "Que no entre quien no sepa geometría".'
            ],
            'India': [
                '🔢 El cero como número: revolución conceptual india (~500 d.C.).',
                '📿 Sistema decimal posicional: base de toda la matemática moderna.',
                '📈 Aryabhata: calculó π con 4 decimales y la duración del año.',
                '🌟 Brahmagupta: reglas para operar con cero y números negativos.',
                '♾️ Bhaskara II: primeras ideas sobre el infinito matemático.',
                '🧮 Sulba Sutras: geometría védica para construcción de altares.',
                '🎲 Combinatoria india: permutaciones en poesía sánscrita.',
                '🔄 Método chakravala: algoritmo para ecuaciones diofánticas.',
                '📐 Trigonometría india: tablas de senos y desarrollo del coseno.',
                '🌙 Astronomía matemática: predicción precisa de eclipses.'
            ],
            'China': [
                '📘 "Nueve Capítulos": enciclopedia matemática china (~200 a.C.).',
                '🎋 Varillas de cálculo: primer sistema de matrices y determinantes.',
                '🔢 Triángulo de Yang Hui: "Pascal" 500 años antes que Pascal.',
                '🧮 Ábaco suanpan: calculadora mecánica usada por 2000 años.',
                '🏮 Cuadrados mágicos: Lo Shu y misticismo numérico.',
                '🌸 Problema de los restos chinos: teorema fundamental en criptografía moderna.',
                '📏 Liu Hui: calculó π con polígonos de 3072 lados.',
                '🎯 Matemática militar: "El Arte de la Guerra" y cálculos estratégicos.',
                '🌾 Matemática agraria: sistemas de irrigación optimizados.',
                '🔮 I Ching: binario antes de Leibniz.'
            ],
            'Mundo Islámico': [
                '📗 Al-Juarismi: padre del álgebra y los algoritmos.',
                '🔬 Ibn al-Haytham (Alhazen): método científico y óptica geométrica.',
                '🌙 Al-Kashi: calculó π con 16 decimales, récord por 200 años.',
                '📐 Omar Khayyam: soluciones geométricas a ecuaciones cúbicas.',
                '🌍 Al-Biruni: midió el radio de la Tierra con trigonometría.',
                '📚 Casa de la Sabiduría de Bagdad: centro mundial del conocimiento.',
                '🔭 Trigonometría esférica: navegación y astronomía avanzada.',
                '💰 Al-Karaji: desarrollo del álgebra sin geometría.',
                '🎨 Geometría islámica: teselaciones y patrones infinitos.',
                '📖 Preservación griega: sin los árabes, perderíamos a Euclides y Arquímedes.'
            ],
            'Europa Medieval': [
                '📙 Fibonacci (1202): introdujo números indo-arábigos en Europa.',
                '🐰 Sucesión de Fibonacci: aparece en naturaleza y arte.',
                '🏰 Matemática de castillos: balística y fortificaciones.',
                '⛪ Geometría gótica: catedrales y proporción divina.',
                '📿 Escolástica: lógica matemática en teología.',
                '🎓 Primeras universidades: Oxford, París, Bolonia.',
                '⚗️ Alquimia matemática: búsqueda de patrones universales.',
                '📅 Reforma del calendario: matemática para el calendario gregoriano.',
                '💰 Matemática comercial: letras de cambio y contabilidad doble.',
                '🎵 Música medieval: teoría matemática del canto gregoriano.'
            ],
            'Renacimiento': [
                '🎨 Leonardo da Vinci: matemática en arte e ingeniería.',
                '📐 Perspectiva matemática: revolución en el arte renacentista.',
                '🔬 Galileo: "El libro de la naturaleza está escrito en lenguaje matemático".',
                '📈 Descartes: unión de álgebra y geometría (coordenadas cartesianas).',
                '🎲 Cardano y Tartaglia: fórmulas para ecuaciones cúbicas.',
                '💫 Kepler: órbitas elípticas y leyes planetarias.',
                '🗺️ Mercator: proyección matemática para navegación.',
                '⚙️ Relojes mecánicos: precisión matemática del tiempo.',
                '🏛️ Arquitectura renacentista: proporción áurea en cada edificio.',
                '📚 Imprenta: democratización del conocimiento matemático.'
            ],
            'Siglo XVII': [
                '∫ Newton vs Leibniz: la guerra del cálculo.',
                '🍎 Newton: gravedad, cálculo y las leyes del movimiento.',
                '🔢 Leibniz: notación moderna y sistema binario.',
                '📊 Fermat: último teorema y principio del tiempo mínimo.',
                '🎲 Pascal: triángulo, probabilidad y la primera calculadora.',
                '📈 Logaritmos de Napier: simplificaron cálculos astronómicos.',
                '🔬 Microscopio y telescopio: matemática de lentes.',
                '⚖️ Mecánica analítica: matematización de la física.',
                '🌊 Huygens: teoría ondulatoria y relojes de péndulo.',
                '📐 Geometría proyectiva: perspectiva matematizada.'
            ],
            'Siglo XVIII': [
                '👑 Euler: el matemático más prolífico de la historia.',
                '♾️ e^(iπ) + 1 = 0: "la fórmula más bella de las matemáticas".',
                '🌉 Problema de los puentes de Königsberg: nace la teoría de grafos.',
                '📊 Lagrange: mecánica analítica y teoría de grupos.',
                '🎵 Fourier: descomposición de ondas (base del MP3).',
                '📈 Estadística moderna: Bayes y la probabilidad condicional.',
                '🌍 Medición del meridiano: base del sistema métrico.',
                '⚡ Matemática de la electricidad: ecuaciones de Laplace.',
                '🏛️ Enciclopedia: D\'Alembert matematiza el conocimiento.',
                '👸 Émilie du Châtelet: tradujo y extendió los Principia de Newton.'
            ],
            'Siglo XIX': [
                '👑 Gauss: "Príncipe de las Matemáticas".',
                '🌀 Números complejos: de "imaginarios" a fundamentales.',
                '📐 Geometrías no euclidianas: Bolyai, Lobachevsky, Riemann.',
                '♾️ Cantor: infinitos de diferentes tamaños.',
                '👩‍🔬 Sofia Kovalevskaya: primera profesora de matemáticas.',
                '📊 Galois: teoría de grupos y muerte en duelo a los 20 años.',
                '🎯 Riemann: hipótesis del millón de dólares.',
                '⚡ Maxwell: electromagnetismo en 4 ecuaciones.',
                '🧮 Máquina analítica de Babbage: primera computadora.',
                '💻 Ada Lovelace: primera programadora de la historia.'
            ],
            'Siglo XX': [
                '💻 Turing: computación teórica y la máquina universal.',
                '🔐 RSA: criptografía de clave pública.',
                '❓ Gödel: teoremas de incompletitud.',
                '🎮 Von Neumann: teoría de juegos y arquitectura de computadoras.',
                '📊 Estadística moderna: Fisher, Pearson, Neyman.',
                '🌌 Relatividad: geometría del espacio-tiempo.',
                '🎲 Teoría del caos: el efecto mariposa.',
                '🧬 Matemática del ADN: bioinformática.',
                '💹 Black-Scholes: matemática financiera moderna.',
                '🏆 Medallas Fields: el "Nobel" de las matemáticas.'
            ],
            'Siglo XXI': [
                '🤖 Machine Learning: matemática que aprende.',
                '🔐 Blockchain: criptografía descentralizada.',
                '🧬 Bioinformática: decodificando el genoma humano.',
                '🌐 Big Data: estadística a escala planetaria.',
                '🎮 Gráficos 3D: álgebra lineal en videojuegos.',
                '📱 Compresión de datos: matemática en tu smartphone.',
                '🚀 SpaceX: cálculo de trayectorias reutilizables.',
                '💊 Modelado de pandemias: epidemiología matemática.',
                '🌍 Cambio climático: modelos matemáticos globales.',
                '🏆 Problemas del Milenio: 6 de 7 siguen sin resolver.'
            ],
            'América Precolombina': [
                '🌽 Calendario maya: precisión superior al juliano.',
                '0️⃣ Cero maya: símbolo de concha, concepto revolucionario.',
                '🪢 Quipus incas: computación con cuerdas y nudos.',
                '🏔️ Ingeniería inca: ángulos antisísmicos calculados.',
                '🌮 Sistema vigesimal maya: matemática en base 20.',
                '🗿 Geometría olmeca: cabezas colosales perfectamente esféricas.',
                '🏛️ Teotihuacán: ciudad planificada con proporciones matemáticas.',
                '📐 Nazca: geometría a escala kilométrica.',
                '🌙 Astronomía azteca: predicción de eclipses.',
                '🎨 Simetría en textiles: matemática en el arte precolombino.'
            ],
            'África': [
                '🦴 Hueso de Lebombo (35,000 a.C.): posible calendario lunar.',
                '🏺 Geometría fractal africana: patrones recursivos en aldeas.',
                '📿 Sistemas de conteo yoruba: base 20 con sub-base 5.',
                '🎲 Mancala: teoría de juegos milenaria.',
                '🏛️ Pirámides de Nubia: geometría kushita.',
                '📚 Biblioteca de Tombuctú: manuscritos matemáticos del Sahel.',
                '🧮 Gelosia etíope: método de multiplicación único.',
                '🎨 Simetría en el arte africano: grupos de transformación.',
                '🌍 Navegación swahili: trigonometría del Índico.',
                '💎 Geometría del Gran Zimbabwe: arquitectura sin mortero.'
            ],
            'Oceanía': [
                '🌊 Navegación polinesia: mapas de palos y corrientes.',
                '🗿 Moái de Pascua: ingeniería y transporte calculado.',
                '🪃 Física del bumerán: aerodinámica aborigen.',
                '🎨 Arte aborigen: geometría del Tiempo del Sueño.',
                '🏝️ Calendarios lunares: agricultura isleña.',
                '🌺 Simetría en tatuajes: matemática corporal.',
                '🛶 Cálculo de mareas: navegación precisa.',
                '🪨 Megalitos de Nan Madol: ingeniería misteriosa.',
                '🌴 Distribución de recursos: optimización en atolones.',
                '📿 Sistemas de conteo: base 5 en muchas culturas.'
            ]
        };
        
        // Tips diarios ampliados
        this.dailyTips = [
            '📜 Los babilonios conocían el teorema de Pitágoras 1000 años antes que Pitágoras.',
            '🧮 El ábaco sigue siendo más rápido que una calculadora en manos expertas.',
            '0️⃣ El cero tardó siglos en ser aceptado en Europa por considerarse "diabólico".',
            '♾️ Hay infinitos más grandes que otros según la teoría de Cantor.',
            '🎲 El problema de Monty Hall confunde incluso a matemáticos experimentados.',
            '🌀 La sucesión de Fibonacci aparece en girasoles, piñas y galaxias.',
            '📐 Sólo existen 5 sólidos platónicos perfectos en 3D.',
            '🔢 El número e aparece naturalmente en interés compuesto y crecimiento.',
            '🎵 Bach usó proporciones matemáticas en sus composiciones.',
            '🏛️ El Partenón sigue la proporción áurea en su diseño.',
            '💻 Alan Turing rompió Enigma y creó la ciencia de la computación.',
            '👩‍🔬 Emmy Noether revolucionó el álgebra abstracta y la física.',
            '🌍 Eratóstenes calculó el radio de la Tierra con palos y sombras.',
            '🎯 La paradoja del cumpleaños: en 23 personas, 50% comparten fecha.',
            '📊 El 80% de la estadística se inventó en el siglo XX.',
            '🏺 Los egipcios usaban la cuerda de 12 nudos para hacer ángulos rectos.',
            '🌙 Los mayas predecían eclipses con siglos de anticipación.',
            '🔐 Tu tarjeta de crédito usa matemática de Fermat del siglo XVII.',
            '🧬 El ADN es esencialmente un código de corrección de errores.',
            '🌊 Las olas del mar siguen ecuaciones diferenciales parciales.'
        ];
        
        // Frases motivacionales sobre historia matemática
        this.motivationalQuotes = [
            '"Las matemáticas son el alfabeto con el cual Dios escribió el universo" - Galileo',
            '"En matemáticas, el arte de proponer una pregunta debe valorarse más que resolverla" - Cantor',
            '"La matemática es la reina de las ciencias" - Gauss',
            '"Dios existe desde que las matemáticas son consistentes" - Paul Erdős',
            '"Las matemáticas no mienten, mienten los que no las entienden" - Anónimo'
        ];
        
        // Regex mejorado para detectar intentos de resolver ejercicios
        this.exercisePatterns = [
            /resuelve|resolver|soluciona|solucionar/i,
            /calcula|calcular|calcúlame|calculame/i,
            /deriva|derivar|derivada|integra|integrar|integral/i,
            /factoriza|factorizar|simplifica|simplificar/i,
            /ecuación|ecuacion|sistema\s+de\s+ecuaciones/i,
            /problema\s+\d+|ejercicio\s+\d+|tarea/i,
            /cuánto\s+es|cuanto\s+es|resultado/i,
            /[xyzabc]\s*=\s*\?|=\s*\?/i,
            /\d+\s*[\+\-\*\/\^]\s*\d+\s*=/i,
            /encuentra\s+el\s+valor|halla|hallar/i,
            /demuestra|demostrar|prueba|probar/i,
            /límite|limite|lim\s*\(/i,
            /\√|\^|log|ln|sen|sin|cos|tan/i
        ];
        
        this.init();
    }
    
    init() {
        this.addChatBotStyles();
        this.createChatInterface();
        this.addEventListeners();
        this.loadUserPreferences();
        this.showWelcomeMessage();
    }
    
    addChatBotStyles() {
        const style = document.createElement('style');
        style.id = 'chatbot-styles';
        style.textContent = `
            /* Estilos mejorados del Chat Bot */
            .chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            
            .chatbot-toggle {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                z-index: 10000;
            }
            
            .chatbot-toggle::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .chatbot-toggle:hover::before {
                opacity: 1;
            }
            
            .chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
            }
            
            .chatbot-toggle.active {
                pointer-events: none;
                opacity: 0.3;
                transform: scale(0.9);
            }
            
            .chatbot-toggle-icon {
                font-size: 1.8rem;
                color: white;
                transition: transform 0.3s ease;
            }
            
            .chatbot-toggle.active .chatbot-toggle-icon {
                transform: rotate(90deg);
            }
            
            .chatbot-window {
                position: absolute;
                bottom: 85px;
                right: 0;
                width: 400px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 10001;
            }
            
            .chatbot-window.open {
                transform: translateY(0) scale(1);
                opacity: 1;
                visibility: visible;
            }
            
            .chatbot-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .chatbot-header-info {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }
            
            .chatbot-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .chatbot-title {
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0;
            }
            
            .chatbot-subtitle {
                font-size: 0.8rem;
                opacity: 0.9;
                margin: 0;
            }
            
            .chatbot-header-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .chatbot-header-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
                font-size: 1rem;
            }
            
            .chatbot-header-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }
            
            .chatbot-header-btn:active {
                transform: scale(0.95);
            }
            
            #favorites-btn {
                position: relative;
            }
            
            .chatbot-messages {
                height: calc(100% - 140px);
                overflow-y: auto;
                padding: 1.2rem;
                background: linear-gradient(to bottom, #f8faff, #ffffff);
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }
            
            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }
            
            .chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(102, 126, 234, 0.2);
                border-radius: 3px;
            }
            
            .chatbot-container .message {
                animation: messageSlide 0.3s ease;
            }
            
            .chatbot-container .message.bot {
                align-self: flex-start;
                max-width: 85%;
            }
            
            .chatbot-container .message.user {
                align-self: flex-end;
                max-width: 85%;
            }
            
            .chatbot-container .message-bubble {
                padding: 0.8rem 1rem;
                border-radius: 18px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .chatbot-container .message.bot .message-bubble {
                background: white;
                border: 1px solid rgba(102, 126, 234, 0.1);
                color: #2d3748;
                border-bottom-left-radius: 6px;
            }
            
            .chatbot-container .message.user .message-bubble {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-bottom-right-radius: 6px;
            }
            
            .chatbot-container .message-card {
                background: white;
                border: 1px solid rgba(102, 126, 234, 0.15);
                border-radius: 12px;
                padding: 1rem;
                margin-top: 0.5rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            
            .chatbot-container .message-card-title {
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.8rem;
            }
            
            .quick-action-chip {
                padding: 0.5rem 1rem;
                background: white;
                border: 1px solid rgba(102, 126, 234, 0.3);
                border-radius: 20px;
                color: #667eea;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
            }
            
            .quick-action-chip:hover {
                background: rgba(102, 126, 234, 0.1);
                transform: translateY(-1px);
            }
            
            .period-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 0.5rem;
                margin-top: 0.8rem;
            }
            
            .period-card {
                padding: 0.6rem;
                background: linear-gradient(135deg, #f8faff, #ffffff);
                border: 1px solid rgba(102, 126, 234, 0.2);
                border-radius: 10px;
                cursor: pointer;
                text-align: center;
                font-size: 0.85rem;
                transition: all 0.2s ease;
            }
            
            .period-card:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .chatbot-container .nav-links {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-top: 0.8rem;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .chatbot-container .nav-link {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                padding: 0.8rem;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                text-decoration: none;
                color: #2d3748;
                transition: all 0.2s ease;
            }
            
            .chatbot-container .nav-link:hover {
                background: rgba(102, 126, 234, 0.05);
                border-color: rgba(102, 126, 234, 0.3);
                transform: translateX(4px);
            }
            
            .chatbot-container .nav-link-icon {
                font-size: 1.2rem;
            }
            
            .chatbot-container .nav-link-text {
                flex: 1;
            }
            
            .chatbot-container .nav-link-title {
                font-weight: 500;
                margin: 0;
            }
            
            .chatbot-container .nav-link-desc {
                font-size: 0.75rem;
                color: #718096;
                margin: 0;
            }
            
            .search-form {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.8rem;
            }
            
            .search-input {
                flex: 1;
                padding: 0.6rem 1rem;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                outline: none;
                transition: border-color 0.2s ease;
            }
            
            .search-input:focus {
                border-color: rgba(102, 126, 234, 0.5);
            }
            
            .search-btn {
                padding: 0.6rem 1.2rem;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .search-btn:hover {
                transform: translateY(-1px);
            }
            
            .search-results {
                margin-top: 0.8rem;
                max-height: 250px;
                overflow-y: auto;
            }
            
            .search-result {
                padding: 0.8rem;
                background: #f8faff;
                border-left: 3px solid #667eea;
                margin-bottom: 0.5rem;
                border-radius: 0 8px 8px 0;
            }
            
            .search-result-period {
                font-weight: 600;
                color: #667eea;
                font-size: 0.85rem;
            }
            
            .search-result-text {
                margin-top: 0.3rem;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .contact-form {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
                margin-top: 0.8rem;
            }
            
            .chatbot-container .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
            }
            
            .chatbot-container .form-label {
                font-size: 0.85rem;
                color: #4a5568;
                font-weight: 500;
            }
            
            .chatbot-container .form-input,
            .chatbot-container .form-select,
            .chatbot-container .form-textarea {
                padding: 0.6rem 0.8rem;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                outline: none;
                transition: border-color 0.2s ease;
                font-family: inherit;
            }
            
            .chatbot-container .form-input:focus,
            .chatbot-container .form-select:focus,
            .chatbot-container .form-textarea:focus {
                border-color: rgba(102, 126, 234, 0.5);
            }
            
            .chatbot-container .form-textarea {
                resize: vertical;
                min-height: 80px;
            }
            
            .chatbot-container .form-submit {
                padding: 0.8rem;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 500;
                transition: transform 0.2s ease;
            }
            
            .chatbot-container .form-submit:hover {
                transform: translateY(-1px);
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.8rem 1rem;
                background: white;
                border: 1px solid rgba(102, 126, 234, 0.1);
                border-radius: 18px;
                border-bottom-left-radius: 6px;
                max-width: 80px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #667eea;
                animation: typingDot 1.4s infinite;
            }
            
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            .chatbot-input-container {
                padding: 1rem;
                background: white;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 0.5rem;
            }
            
            .chatbot-input {
                flex: 1;
                padding: 0.6rem 1rem;
                border: 1px solid #e5e7eb;
                border-radius: 20px;
                outline: none;
                transition: border-color 0.2s ease;
            }
            
            .chatbot-input:focus {
                border-color: rgba(102, 126, 234, 0.5);
            }
            
            .chatbot-send {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            }
            
            .chatbot-send:hover {
                transform: scale(1.1);
            }
            
            .favorites-indicator {
                position: absolute;
                top: -5px;
                right: -5px;
                min-width: 16px;
                height: 16px;
                background: #ef4444;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 0.65rem;
                font-weight: bold;
                color: white;
                padding: 1px;
                border: 1.5px solid white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                z-index: 1;
            }
            
            .favorites-indicator.active {
                display: flex;
            }
            
            .tip-card {
                background: linear-gradient(135deg, #fef3c7, #fef9e7);
                border: 1px solid #fbbf24;
                padding: 1rem;
                border-radius: 12px;
                margin-top: 0.5rem;
            }
            
            .tip-card-icon {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }
            
            .tip-card-text {
                color: #78350f;
                line-height: 1.5;
            }
            
            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes typingDot {
                0%, 60%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                30% {
                    transform: scale(1.3);
                    opacity: 1;
                }
            }
            
            /* Dark mode */
            body.dark-mode .chatbot-window {
                background: #1a202c;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            
            body.dark-mode .chatbot-messages {
                background: linear-gradient(to bottom, #1a202c, #2d3748);
            }
            
            body.dark-mode .chatbot-container .message.bot .message-bubble {
                background: #2d3748;
                border-color: rgba(102, 126, 234, 0.3);
                color: #e2e8f0;
            }
            
            body.dark-mode .chatbot-container .message-card {
                background: #2d3748;
                border-color: rgba(102, 126, 234, 0.3);
                color: #e2e8f0;
            }
            
            body.dark-mode .chatbot-input-container {
                background: #2d3748;
                border-top-color: #4a5568;
            }
            
            body.dark-mode .chatbot-container .chatbot-input {
                background: #1a202c;
                border-color: #4a5568;
                color: #e2e8f0;
            }
            
            /* Modal styles (for any future modals) */
            .chatbot-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10003;
            }
            @media (max-width: 768px) {
                .chatbot-toggle {
                    width: 60px;
                    height: 60px;
                    right: 15px;
                    bottom: 15px;
                }
                
                .chatbot-toggle-icon {
                    font-size: 1.6rem;
                }
                
                .chatbot-window {
                    width: 380px;
                    height: 85vh;
                    max-height: 600px;
                    right: 10px;
                    bottom: 80px;
                }
                
                .chatbot-header {
                    padding: 1rem;
                }
                
                .chatbot-avatar {
                    width: 35px;
                    height: 35px;
                    font-size: 1rem;
                }
                
                .chatbot-title {
                    font-size: 1rem;
                }
                
                .chatbot-subtitle {
                    font-size: 0.75rem;
                }
                
                .chatbot-header-btn {
                    width: 30px;
                    height: 30px;
                    font-size: 0.9rem;
                }
                
                .period-grid {
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                }
            }
            
            /* Mobile responsive - Smartphones */
            @media (max-width: 480px) {
                .chatbot-container {
                    bottom: 0;
                    right: 0;
                }
                
                .chatbot-toggle {
                    width: 55px;
                    height: 55px;
                    right: 15px;
                    bottom: 15px;
                }
                
                .chatbot-toggle-icon {
                    font-size: 1.4rem;
                }
                
                .chatbot-window {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    max-height: 100%;
                    border-radius: 0;
                    z-index: 10002; /* Higher z-index for mobile fullscreen */
                }
                
                .chatbot-window.open {
                    transform: translateY(0) scale(1);
                }
                
                .chatbot-header {
                    border-radius: 0;
                    padding: 1rem;
                }
                
                .chatbot-messages {
                    height: calc(100vh - 120px);
                    padding: 1rem;
                }
                
                .chatbot-input-container {
                    padding: 0.8rem;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                }
                
                .chatbot-input {
                    font-size: 16px; /* Prevents zoom on iOS */
                }
                
                .period-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.5rem;
                }
                
                .period-card {
                    padding: 0.5rem;
                    font-size: 0.8rem;
                }
                
                .quick-action-chip {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.85rem;
                }
                
                .chatbot-container .nav-link {
                    padding: 0.6rem;
                }
                
                .chatbot-container .nav-link-icon {
                    font-size: 1rem;
                }
                
                .chatbot-container .nav-link-title {
                    font-size: 0.9rem;
                }
                
                .chatbot-container .nav-link-desc {
                    font-size: 0.7rem;
                }
                
                .message-card {
                    padding: 0.8rem;
                }
                
                .search-form {
                    flex-direction: column;
                }
                
                .search-input {
                    width: 100%;
                }
                
                .search-btn {
                    width: 100%;
                }
                
                .stat-item {
                    padding: 1rem;
                }
                
                .tip-card {
                    padding: 0.8rem;
                }
                
                .contact-form {
                    gap: 0.6rem;
                }
                
                .chatbot-container .form-input,
                .chatbot-container .form-select,
                .chatbot-container .form-textarea {
                    font-size: 16px; /* Prevents zoom on iOS */
                }
            }
            
            /* Very small devices */
            @media (max-width: 375px) {
                .chatbot-toggle {
                    width: 50px;
                    height: 50px;
                    right: 10px;
                    bottom: 10px;
                }
                
                .chatbot-toggle-icon {
                    font-size: 1.2rem;
                }
                
                .chatbot-header {
                    padding: 0.8rem;
                }
                
                .chatbot-title {
                    font-size: 0.95rem;
                }
                
                .chatbot-subtitle {
                    font-size: 0.7rem;
                }
                
                .chatbot-header-btn {
                    width: 28px;
                    height: 28px;
                    font-size: 0.8rem;
                }
                
                .chatbot-header-actions {
                    gap: 0.3rem;
                }
                
                .chatbot-messages {
                    padding: 0.8rem;
                }
                
                .chatbot-container .message-bubble {
                    padding: 0.6rem 0.8rem;
                    font-size: 0.9rem;
                }
                
                .quick-actions {
                    gap: 0.4rem;
                }
                
                .quick-action-chip {
                    padding: 0.35rem 0.7rem;
                    font-size: 0.8rem;
                }
            }
            
            /* Landscape orientation for mobile */
            @media (max-height: 500px) and (orientation: landscape) {
                .chatbot-window {
                    height: 100vh;
                    max-height: 100vh;
                }
                
                .chatbot-messages {
                    height: calc(100vh - 110px);
                    padding: 0.5rem 1rem;
                }
                
                .chatbot-header {
                    padding: 0.5rem 1rem;
                }
                
                .chatbot-input-container {
                    padding: 0.5rem;
                }
                
                .quick-actions {
                    margin-top: 0.4rem;
                }
            }
            
            /* iPad and tablets in portrait */
            @media (min-width: 481px) and (max-width: 1024px) and (orientation: portrait) {
                .chatbot-window {
                    width: min(450px, 90vw);
                    height: 70vh;
                    max-height: 700px;
                }
            }
            
            /* iPad Pro and large tablets */
            @media (min-width: 1024px) and (max-width: 1366px) {
                .chatbot-window {
                    width: 420px;
                    height: 650px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    createChatInterface() {
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">📚</div>
                        <div>
                            <h3 class="chatbot-title">Guía Histórico</h3>
                            <p class="chatbot-subtitle">Historia y navegación matemática</p>
                        </div>
                    </div>
                    <div class="chatbot-header-actions">
                        <button class="chatbot-header-btn" id="favorites-btn" title="Favoritos">
                            <span style="position: relative;">⭐</span>
                            <span class="favorites-indicator"></span>
                        </button>
                        <button class="chatbot-header-btn" id="refresh-btn" title="Nueva conversación">
                            <span>🔄</span>
                        </button>
                        <button class="chatbot-header-btn" id="close-btn" title="Cerrar">
                            <span>✕</span>
                        </button>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-container">
                    <input type="text" class="chatbot-input" id="chatbot-input" 
                           placeholder="Historia, periodos, búsqueda, navegación..." maxlength="200">
                    <button class="chatbot-send" id="chatbot-send">
                        <i>➤</i>
                    </button>
                </div>
            </div>
            <button class="chatbot-toggle" id="chatbot-toggle">
                <span class="chatbot-toggle-icon">💬</span>
            </button>
        `;
        
        document.body.appendChild(container);
        
        this.chatContainer = container;
        this.toggleButton = container.querySelector('#chatbot-toggle');
        this.messagesContainer = container.querySelector('#chatbot-messages');
        this.inputField = container.querySelector('#chatbot-input');
        this.sendButton = container.querySelector('#chatbot-send');
        this.chatWindow = container.querySelector('#chatbot-window');
    }
    
    addEventListeners() {
        // Toggle chat
        this.toggleButton.addEventListener('click', () => this.toggleChat());
        
        // Close button - use chatContainer for better scoping
        const closeBtn = this.chatContainer.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeChat();
            });
        }
        
        // Refresh button - use chatContainer for better scoping
        const refreshBtn = this.chatContainer.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetConversation();
                // Uncomment next line if you want hard page reload instead
                // location.reload();
            });
        }
        
        // Favorites button - use chatContainer for better scoping
        const favoritesBtn = this.chatContainer.querySelector('#favorites-btn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showFavorites();
            });
        }
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key - using keydown instead of deprecated keypress
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Delegate clicks for dynamic elements
        this.messagesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-chip')) {
                this.handleQuickAction(e.target.dataset.action, e.target.dataset.payload);
            }
            if (e.target.classList.contains('period-card')) {
                this.showPeriodHistory(e.target.dataset.period);
            }
        });
        
        // Prevent closing when clicking inside the chat window
        this.chatWindow.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.add('open');
        this.toggleButton.classList.add('active');
        this.inputField.focus();
        
        // Update favorites indicator
        this.updateFavoritesIndicator();
        
        // Check for daily tip
        this.checkDailyTip();
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('open');
        this.toggleButton.classList.remove('active');
        this.saveConversationHistory();
    }
    
    resetConversation() {
        this.messagesContainer.innerHTML = '';
        this.conversationHistory = [];
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        const welcomeHtml = `
            <div class="message bot">
                <div class="message-bubble">
                    <strong>¡Bienvenido! 🎓</strong><br>
                    Soy tu guía en la fascinante historia de las matemáticas. 
                    Puedo mostrarte cómo las matemáticas han evolucionado a través de las civilizaciones 
                    y ayudarte a navegar por el sitio.
                </div>
                <div class="quick-actions">
                    <button class="quick-action-chip" data-action="historia">
                        📚 Historia General
                    </button>
                    <button class="quick-action-chip" data-action="periodos">
                        📆 Por Periodos
                    </button>
                    <button class="quick-action-chip" data-action="buscar">
                        🔎 Buscar
                    </button>
                    <button class="quick-action-chip" data-action="navegacion">
                        🧭 Navegar Sitio
                    </button>
                    <button class="quick-action-chip" data-action="tip">
                        💡 Tip Aleatorio
                    </button>
                    <button class="quick-action-chip" data-action="contacto">
                        ✉️ Contactar
                    </button>
                </div>
            </div>
        `;
        
        this.addBotMessage(welcomeHtml, false);
    }
    
    checkDailyTip() {
        const today = new Date().toDateString();
        const lastTipDate = localStorage.getItem('mathbot_last_tip_date');
        
        if (lastTipDate !== today) {
            const tip = this.getRandomTip();
            const tipHtml = `
                <div class="tip-card">
                    <div class="tip-card-icon">💡</div>
                    <div class="tip-card-text">
                        <strong>Tip del día:</strong><br>
                        ${tip}
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                this.addBotMessage(tipHtml, false);
                localStorage.setItem('mathbot_last_tip_date', today);
            }, 500);
        }
    }
    
    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isTyping) return;
        
        this.addUserMessage(message);
        this.inputField.value = '';
        
        // Check if trying to solve exercises
        if (this.isExerciseRequest(message)) {
            this.showTyping();
            setTimeout(() => {
                this.hideTyping();
                this.handleExerciseRequest();
            }, 800);
            return;
        }
        
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(message);
        }, 600 + Math.random() * 400);
    }
    
    isExerciseRequest(message) {
        return this.exercisePatterns.some(pattern => pattern.test(message));
    }
    
    handleExerciseRequest() {
        const responses = [
            `🛑 <strong>No resuelvo ejercicios matemáticos.</strong><br>
            Mi función es compartir la fascinante historia de las matemáticas y ayudarte a navegar por el sitio. 
            Si necesitas ayuda con ejercicios, te sugiero contactar al profesor.`,
            
            `📚 <strong>Mi especialidad es la historia, no resolver problemas.</strong><br>
            Puedo contarte cómo diferentes civilizaciones desarrollaron métodos para resolver 
            ecuaciones similares a la tuya. ¿Te interesa?`,
            
            `🎓 <strong>Para ejercicios, mejor contacta directamente al profesor.</strong><br>
            Mientras tanto, ¿sabías que el método que probablemente necesitas fue desarrollado 
            hace siglos? Te puedo contar su historia.`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        const html = `
            <div class="message-bubble">${response}</div>
            <div class="quick-actions">
                <button class="quick-action-chip" data-action="contacto">
                    ✉️ Contactar Profesor
                </button>
                <button class="quick-action-chip" data-action="historia">
                    📚 Ver Historia
                </button>
                <button class="quick-action-chip" data-action="navegacion">
                    🧭 Recursos del Sitio
                </button>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Navigation keywords
        if (/navega|navegación|sitio|página|secciones|menú|menu|dónde|donde/i.test(lowerMessage)) {
            this.showNavigation();
            return;
        }
        
        // History keywords
        if (/historia|histórico|historico|origen|antiguo|evolución|evolucion/i.test(lowerMessage)) {
            this.showHistoryMenu();
            return;
        }
        
        // Periods keywords
        if (/periodo|período|era|época|civilización|civilizacion|siglo/i.test(lowerMessage)) {
            this.showPeriods();
            return;
        }
        
        // Search keywords
        if (/buscar|busca|encuentra|búsqueda|busqueda/i.test(lowerMessage)) {
            this.showSearchInterface();
            return;
        }
        
        // Contact keywords
        if (/contacto|contactar|profesor|duda|consulta|email|correo|mensaje/i.test(lowerMessage)) {
            this.showContactForm();
            return;
        }
        
        // Tip keywords
        if (/tip|dato|curiosidad|sabías|sabias|aleatorio|random/i.test(lowerMessage)) {
            this.showRandomTip();
            return;
        }
        
        // Specific periods
        for (const period in this.historyBank) {
            if (lowerMessage.includes(period.toLowerCase())) {
                this.showPeriodHistory(period);
                return;
            }
        }
        
        // Default response
        this.showDefaultOptions();
    }
    
    showNavigation() {
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    🧭 Navegación del Sitio
                </div>
                <div class="nav-links">
                    <a href="${this.siteLinks.historia}" class="nav-link">
                        <span class="nav-link-icon">📚</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Historia de las Matemáticas</p>
                            <p class="nav-link-desc">Explora el desarrollo histórico</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.cienciaDatos}" class="nav-link">
                        <span class="nav-link-icon">📊</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Ciencia de Datos</p>
                            <p class="nav-link-desc">Análisis y visualización</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.robotica}" class="nav-link">
                        <span class="nav-link-icon">🤖</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Robótica</p>
                            <p class="nav-link-desc">Proyectos y programación</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.programacion}" class="nav-link">
                        <span class="nav-link-icon">💻</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Programación</p>
                            <p class="nav-link-desc">Código y algoritmos</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.ingenieria}" class="nav-link">
                        <span class="nav-link-icon">⚙️</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Ingeniería</p>
                            <p class="nav-link-desc">Diseño y construcción</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.olimpiadas}" class="nav-link">
                        <span class="nav-link-icon">🏆</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Olimpiadas</p>
                            <p class="nav-link-desc">Competencias matemáticas</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.labExperimentos}" class="nav-link">
                        <span class="nav-link-icon">🧪</span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Laboratorio</p>
                            <p class="nav-link-desc">Experimentos interactivos</p>
                        </div>
                    </a>
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    showHistoryMenu() {
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    📚 Historia de las Matemáticas
                </div>
                <p>Las matemáticas han sido el lenguaje universal de la humanidad, 
                evolucionando desde simples marcas de conteo hasta la teoría de cuerdas.</p>
                <div class="quick-actions">
                    <button class="quick-action-chip" data-action="periodos">
                        📆 Explorar por Periodo
                    </button>
                    <button class="quick-action-chip" data-action="buscar">
                        🔎 Buscar Tema
                    </button>
                    <button class="quick-action-chip" data-action="timeline">
                        ⏳ Línea de Tiempo
                    </button>
                    <button class="quick-action-chip" data-action="random_period">
                        🎲 Periodo Aleatorio
                    </button>
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    showPeriods() {
        const periods = Object.keys(this.historyBank);
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    📆 Periodos Históricos
                </div>
                <p>Selecciona un periodo para explorar sus aportes matemáticos:</p>
                <div class="period-grid">
                    ${periods.map(period => `
                        <div class="period-card" data-period="${period}">
                            ${this.getPeriodEmoji(period)} ${period}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    getPeriodEmoji(period) {
        const emojis = {
            'Prehistoria': '🦴',
            'Mesopotamia': '📜',
            'Egipto Antiguo': '🔺',
            'Grecia Clásica': '🏛️',
            'India': '🕉️',
            'China': '🏮',
            'Mundo Islámico': '🌙',
            'Europa Medieval': '🏰',
            'Renacimiento': '🎨',
            'Siglo XVII': '🔬',
            'Siglo XVIII': '⚡',
            'Siglo XIX': '🚂',
            'Siglo XX': '💻',
            'Siglo XXI': '🤖',
            'América Precolombina': '🌽',
            'África': '🌍',
            'Oceanía': '🌊'
        };
        return emojis[period] || '📖';
    }
    
    showPeriodHistory(period) {
        const facts = this.historyBank[period];
        if (!facts || facts.length === 0) {
            this.addBotMessage('No tengo información sobre ese periodo aún.', true);
            return;
        }
        
        // Select 3 random facts
        const selectedFacts = this.getRandomItems(facts, 3);
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    ${this.getPeriodEmoji(period)} ${period}
                </div>
                <div style="margin-top: 0.8rem;">
                    ${selectedFacts.map(fact => `
                        <div class="search-result">
                            <div class="search-result-text">${fact}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="quick-actions">
                    <button class="quick-action-chip" data-action="more_facts" data-payload="${period}">
                        ➕ Más datos
                    </button>
                    <button class="quick-action-chip" data-action="favorite_period" data-payload="${period}">
                        ⭐ Favorito
                    </button>
                    <button class="quick-action-chip" data-action="periodos">
                        📆 Otros periodos
                    </button>
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
        this.currentPeriod = period;
    }
    
    showSearchInterface() {
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    🔎 Buscar en Historia
                </div>
                <p>Busca por matemático, concepto, civilización o descubrimiento:</p>
                <div class="search-form">
                    <input type="text" class="search-input" id="history-search-input" 
                           placeholder="Ej: Pitágoras, cero, álgebra..." maxlength="50">
                    <button class="search-btn" onclick="window.mathChatBot.performSearch()">
                        Buscar
                    </button>
                </div>
                <div id="search-results"></div>
            </div>
        `;
        
        this.addBotMessage(html, false);
        
        // Focus on search input
        setTimeout(() => {
            const searchInput = document.getElementById('history-search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.performSearch();
                    }
                });
            }
        }, 100);
    }
    
    performSearch() {
        const searchInput = document.getElementById('history-search-input');
        if (!searchInput) return;
        
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        
        const results = [];
        
        // Search through all periods
        for (const [period, facts] of Object.entries(this.historyBank)) {
            facts.forEach(fact => {
                if (fact.toLowerCase().includes(query)) {
                    results.push({ period, fact });
                }
            });
        }
        
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div style="margin-top: 1rem; color: #718096;">
                    No encontré resultados para "${searchInput.value}". 
                    Intenta con otros términos.
                </div>
            `;
        } else {
            const limitedResults = results.slice(0, 5);
            resultsContainer.innerHTML = `
                <div class="search-results">
                    <div style="margin: 0.8rem 0; font-weight: 500;">
                        Encontré ${results.length} resultado(s):
                    </div>
                    ${limitedResults.map(r => `
                        <div class="search-result">
                            <div class="search-result-period">${r.period}</div>
                            <div class="search-result-text">${r.fact}</div>
                        </div>
                    `).join('')}
                    ${results.length > 5 ? `
                        <div style="margin-top: 0.5rem; color: #718096; font-size: 0.85rem;">
                            Mostrando 5 de ${results.length} resultados...
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Save search to history
        this.searchHistory.push({ query: searchInput.value, results: results.length });
    }
    
    showContactForm() {
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    ✉️ Contactar al Profesor
                </div>
                <form class="contact-form" onsubmit="window.mathChatBot.submitContact(event); return false;">
                    <div class="form-group">
                        <label class="form-label">¿Quién eres?</label>
                        <select class="form-select" name="role" required>
                            <option value="">Selecciona...</option>
                            <option value="estudiante">Estudiante</option>
                            <option value="padre">Padre/Madre</option>
                            <option value="maestro">Maestro/a</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tu nombre</label>
                        <input type="text" class="form-input" name="name" required maxlength="50">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tu correo</label>
                        <input type="email" class="form-input" name="email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mensaje</label>
                        <textarea class="form-textarea" name="message" required maxlength="500" 
                                  placeholder="Escribe tu consulta o comentario..."></textarea>
                    </div>
                    <button type="submit" class="form-submit">
                        📧 Enviar Mensaje
                    </button>
                </form>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    submitContact(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const data = {
            role: formData.get('role'),
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            page: window.location.href
        };
        
        // Create mailto link
        const subject = `[Matemáticas Digitales] Consulta de ${data.name} (${data.role})`;
        const body = `
Rol: ${data.role}
Nombre: ${data.name}
Email: ${data.email}
Fecha: ${new Date().toLocaleString('es-PR')}
Página: ${data.page}

Mensaje:
${data.message}

---
Enviado desde el Chat Bot de Historia Matemática
        `.trim();
        
        const mailtoLink = `mailto:${this.professorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open mail client
        window.location.href = mailtoLink;
        
        // Show confirmation
        const confirmHtml = `
            <div class="message-bubble">
                ✅ <strong>Abriendo tu cliente de correo...</strong><br>
                Si no se abre automáticamente, puedes copiar esta información y enviarla a: 
                <code>${this.professorEmail}</code>
            </div>
        `;
        
        this.addBotMessage(confirmHtml, false);
        
        // Save to history
        this.conversationHistory.push({ type: 'contact', data, timestamp: new Date().toISOString() });
    }
    
    showRandomTip() {
        const tip = this.getRandomTip();
        const quote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        
        const html = `
            <div class="tip-card">
                <div class="tip-card-icon">💡</div>
                <div class="tip-card-text">
                    ${tip}
                </div>
            </div>
            <div style="margin-top: 0.8rem; padding: 0.8rem; background: rgba(102, 126, 234, 0.05); 
                        border-left: 3px solid #667eea; border-radius: 0 8px 8px 0;">
                <em style="color: #4a5568; font-size: 0.9rem;">${quote}</em>
            </div>
            <div class="quick-actions">
                <button class="quick-action-chip" data-action="tip">
                    🎲 Otro tip
                </button>
                <button class="quick-action-chip" data-action="periodos">
                    📆 Ver periodos
                </button>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    showFavorites() {
        const favorites = Array.from(this.favoriteTopics);
        if (favorites.length === 0) {
            this.addBotMessage('⭐ No tienes favoritos guardados aún. Explora los periodos y marca tus favoritos.', true);
            return;
        }
        
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    ⭐ Tus Favoritos
                </div>
                <div class="period-grid">
                    ${favorites.map(period => `
                        <div class="period-card" data-period="${period}">
                            ${this.getPeriodEmoji(period)} ${period}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    showDefaultOptions() {
        const html = `
            <div class="message-bubble">
                No entendí tu pregunta. Puedo ayudarte con:
                <div class="quick-actions">
                    <button class="quick-action-chip" data-action="historia">
                        📚 Historia
                    </button>
                    <button class="quick-action-chip" data-action="periodos">
                        📆 Periodos
                    </button>
                    <button class="quick-action-chip" data-action="buscar">
                        🔎 Buscar
                    </button>
                    <button class="quick-action-chip" data-action="navegacion">
                        🧭 Navegación
                    </button>
                    <button class="quick-action-chip" data-action="contacto">
                        ✉️ Contacto
                    </button>
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    handleQuickAction(action, payload) {
        switch(action) {
            case 'historia':
                this.showHistoryMenu();
                break;
            case 'periodos':
                this.showPeriods();
                break;
            case 'buscar':
                this.showSearchInterface();
                break;
            case 'navegacion':
                this.showNavigation();
                break;
            case 'contacto':
                this.showContactForm();
                break;
            case 'tip':
                this.showRandomTip();
                break;
            case 'more_facts':
                this.showPeriodHistory(payload);
                break;
            case 'favorite_period':
                this.addToFavorites(payload);
                break;
            case 'random_period':
                this.showRandomPeriod();
                break;
            case 'timeline':
                this.showTimeline();
                break;
            default:
                this.showDefaultOptions();
        }
    }
    
    showRandomPeriod() {
        const periods = Object.keys(this.historyBank);
        const randomPeriod = periods[Math.floor(Math.random() * periods.length)];
        this.showPeriodHistory(randomPeriod);
    }
    
    showTimeline() {
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    ⏳ Línea de Tiempo Matemática
                </div>
                <div style="margin-top: 0.8rem; font-size: 0.9rem; line-height: 1.6;">
                    <div>🦴 <strong>35,000 a.C.</strong> - Primeras marcas de conteo</div>
                    <div>📜 <strong>1800 a.C.</strong> - Tablilla Plimpton 322</div>
                    <div>🔺 <strong>1650 a.C.</strong> - Papiro Rhind</div>
                    <div>🏛️ <strong>300 a.C.</strong> - Elementos de Euclides</div>
                    <div>0️⃣ <strong>500 d.C.</strong> - Cero como número (India)</div>
                    <div>📗 <strong>820 d.C.</strong> - Al-Juarismi y el álgebra</div>
                    <div>📙 <strong>1202</strong> - Fibonacci introduce números árabes</div>
                    <div>🎨 <strong>1637</strong> - Descartes: geometría analítica</div>
                    <div>∫ <strong>1675</strong> - Newton/Leibniz: cálculo</div>
                    <div>♾️ <strong>1874</strong> - Cantor: teoría de conjuntos</div>
                    <div>💻 <strong>1936</strong> - Turing: computación teórica</div>
                    <div>🤖 <strong>2020s</strong> - IA y machine learning</div>
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    addToFavorites(period) {
        this.favoriteTopics.add(period);
        this.saveUserPreferences();
        
        // Update favorites indicator
        const indicator = document.querySelector('.favorites-indicator');
        if (indicator) {
            indicator.classList.add('active');
        }
        
        this.addBotMessage(`⭐ "${period}" añadido a tus favoritos.`, true);
    }
    
    getRandomTip() {
        return this.dailyTips[Math.floor(Math.random() * this.dailyTips.length)];
    }
    
    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    addBotMessage(html, isSimple = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        if (isSimple) {
            messageDiv.innerHTML = `<div class="message-bubble">${html}</div>`;
        } else {
            messageDiv.innerHTML = html;
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.conversationHistory.push({
            type: 'bot',
            content: html,
            timestamp: new Date().toISOString()
        });
    }
    
    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-bubble">${this.escapeHtml(text)}</div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.conversationHistory.push({
            type: 'user',
            content: text,
            timestamp: new Date().toISOString()
        });
    }
    
    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.currentTypingMessage = typingDiv;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        if (this.currentTypingMessage) {
            this.currentTypingMessage.remove();
            this.currentTypingMessage = null;
        }
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveConversationHistory() {
        const data = {
            history: this.conversationHistory,
            favorites: Array.from(this.favoriteTopics),
            searchHistory: this.searchHistory,
            lastActive: new Date().toISOString()
        };
        localStorage.setItem('mathbot_conversation', JSON.stringify(data));
    }
    
    saveUserPreferences() {
        const prefs = {
            favorites: Array.from(this.favoriteTopics),
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        };
        localStorage.setItem('mathbot_preferences', JSON.stringify(prefs));
    }
    
    loadUserPreferences() {
        try {
            const prefs = JSON.parse(localStorage.getItem('mathbot_preferences') || '{}');
            if (prefs.favorites) {
                this.favoriteTopics = new Set(prefs.favorites);
            }
            
            // Update indicator after DOM is ready
            setTimeout(() => {
                this.updateFavoritesIndicator();
            }, 100);
        } catch (e) {
            console.log('No preferences found');
        }
    }
}

// Initialize function to maintain compatibility
function initMathChatBot(config = {}) {
    // Make it globally accessible for inline onclick handlers
    window.mathChatBot = new MathChatBot();
    return window.mathChatBot;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMathChatBot);
} else {
    initMathChatBot();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMathChatBot, MathChatBot };
} else {
    window.MathChatBot = { initMathChatBot, MathChatBot };
}