// chatbot.js - Módulo del Chat Bot Matemático Mejorado
// Creado por Prof. Yonatan Guerrero Soriano

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
        
        // Respuestas predefinidas del bot mejoradas
        this.responses = {
            greetings: [
                `¡Hola! 👋 Soy MathBot, creado por el ${this.professorName}. Soy tu asistente matemático personal. Antes de comenzar, ¿podrías decirme tu nombre para personalizar mejor nuestra conversación?`,
                `¡Bienvenido/a! 🤖 Soy MathBot, el asistente digital del ${this.professorName}. ¿Cuál es tu nombre? Así podré ayudarte mejor con tus dudas matemáticas.`,
                `¡Saludos! 📐 Soy MathBot, desarrollado por tu profesor ${this.professorName}. Para brindarte la mejor ayuda posible, ¿me dices cómo te llamas?`,
                `¡Hola estudiante! 🎓 Soy el asistente matemático creado por ${this.professorName}. ¿Cuál es tu nombre? ¡Estoy aquí para resolver todas tus dudas!`
            ],
            nameRequest: [
                "¡Perfecto! Es un placer conocerte, {name}. Ahora que nos conocemos, ¿en qué área de las matemáticas puedo ayudarte hoy? 📚",
                "¡Hola {name}! 🌟 Me alegra poder ayudarte. ¿Tienes alguna duda específica de matemáticas o quieres que te recomiende algún recurso?",
                "¡Excelente, {name}! 🎯 Ahora puedo ayudarte de manera más personalizada. ¿Qué tema matemático te está dando problemas?",
                "¡Mucho gusto, {name}! 🚀 Estoy aquí para hacer que las matemáticas sean más fáciles para ti. ¿En qué puedo ayudarte?"
            ],
            algebra: [
                "📊 El álgebra es el lenguaje universal de las matemáticas, {name}. ¿Necesitas ayuda con ecuaciones lineales, cuadráticas, sistemas de ecuaciones, o factorización? También puedo recomendarte visitar la sección de 'Materiales' en la página web del profesor.",
                "🔢 {name}, en álgebra trabajamos con variables y constantes para resolver problemas reales. ¿Qué tema específico te interesa? Te sugiero revisar la sección 'ContextoMath' para ejemplos prácticos.",
                "📈 El álgebra nos permite modelar situaciones del mundo real, {name}. ¿Tienes alguna ecuación específica? También puedes encontrar más recursos en la 'Galería' de trabajos estudiantiles.",
                "💡 Recuerda {name}: en álgebra, las variables representan valores desconocidos que podemos encontrar. ¿Qué ecuación quieres resolver? Visita 'Enlaces' para herramientas adicionales."
            ],
            geometria: [
                "📐 La geometría estudia formas, tamaños y propiedades del espacio, {name}. ¿Necesitas ayuda con áreas, perímetros, volúmenes, o teoremas? Te recomiendo explorar los 'Experimentos' en el Laboratorio de Matemáticas.",
                "🔺 ¡La geometría es fascinante, {name}! Triángulos, círculos, polígonos... ¿Qué figura te interesa? También hay simulaciones interactivas en nuestra sección 'Simulaciones'.",
                "📏 En geometría todo tiene una razón matemática, {name}. ¿Qué problema geométrico tienes? Puedes ver ejemplos reales en nuestros 'Proyectos Creativos'.",
                "🏗️ La geometría está en todas partes: arquitectura, arte, naturaleza, {name}. ¿Qué quieres calcular? Revisa la sección 'Modelado Math' para aplicaciones prácticas."
            ],
            calculo: [
                "∫ El cálculo es la matemática del cambio, {name}. ¿Necesitas ayuda con límites, derivadas o integrales? Te sugiero revisar nuestros recursos de 'Análisis de Datos' para aplicaciones reales.",
                "📊 Con cálculo podemos entender cómo cambian las cosas, {name}. ¿Límites, derivadas o integrales? También tenemos herramientas en la sección 'Programación'.",
                "∂ El cálculo diferencial e integral son herramientas poderosas, {name}. ¿En qué puedo ayudarte? Visita 'Ciencia de Datos' para ver aplicaciones modernas.",
                "🚀 Newton y Leibniz revolucionaron las matemáticas con el cálculo, {name}. ¿Qué concepto necesitas? Explora nuestras 'Simulaciones' para visualizaciones."
            ],
            trigonometria: [
                "📐 La trigonometría conecta ángulos con longitudes, {name}. ¿Seno, coseno, tangente? También puedes practicar en nuestro 'Laboratorio de Matemáticas'.",
                "🔄 Las funciones trigonométricas son cíclicas y hermosas, {name}. ¿Qué necesitas calcular? Revisa los 'Enlaces' para calculadoras especializadas.",
                "📊 Con trigonometría podemos resolver triángulos y ondas, {name}. ¿Tienes algún problema específico? Hay ejemplos prácticos en 'Materiales'.",
                "⚡ SOH-CAH-TOA es tu mejor amigo en trigonometría, {name}. ¿Qué razón trigonométrica necesitas? Visita 'ContextoMath' para recordatorios."
            ],
            estadistica: [
                "📊 La estadística nos ayuda a entender el mundo a través de los datos, {name}. ¿Necesitas ayuda con media, mediana, moda, o distribuciones? Explora 'Ciencia de Datos' para aplicaciones reales.",
                "📈 {name}, la estadística es esencial en la era digital. ¿Probabilidad, correlación, o análisis descriptivo? Revisa nuestros proyectos de 'Análisis de Datos'.",
                "🎲 La probabilidad y estadística predicen el futuro, {name}. ¿Qué concepto necesitas? También tenemos herramientas en 'Programación' para análisis estadístico."
            ],
            stem: [
                "🚀 STEM integra ciencia, tecnología, ingeniería y matemáticas, {name}. Te invito a explorar nuestras secciones de 'Robótica', 'Programación', 'Ingeniería' y 'Ciencia de Datos'.",
                "🔬 {name}, STEM es el futuro. ¿Te interesa la programación, robótica, o ingeniería? Tenemos proyectos increíbles esperándote en cada sección.",
                "💡 Las matemáticas son la base de todas las disciplinas STEM, {name}. ¿Qué área te emociona más? ¡Explora nuestros recursos!"
            ],
            olimpiadas: [
                "🏆 ¡Las Olimpiadas Matemáticas son emocionantes, {name}! Desarrollan el pensamiento crítico y la resolución creativa de problemas. Visita nuestra sección 'Olimpiadas Math' para entrenar.",
                "🥇 {name}, las competencias matemáticas te desafían a pensar fuera de la caja. Revisa 'Competencias' para ver problemas anteriores y estrategias.",
                "🎯 ¿Te gusta resolver problemas desafiantes, {name}? Únete a nuestro 'Club Matemáticas' y participa en las olimpiadas."
            ],
            recursos: [
                "📚 {name}, tengo muchos recursos para recomendarte:\n• 'ContextoMath' - Teoría y conceptos\n• 'Enlaces' - Herramientas online\n• 'Materiales' - Documentos y guías\n• 'Galería' - Trabajos estudiantiles\n¿Qué tipo de recurso necesitas?",
                "🌐 {name}, nuestra página web tiene secciones increíbles:\n• Laboratorio de Matemáticas - Para experimentar\n• Club Matemáticas - Para competir\n• STEM - Para innovar\n¿Cuál te interesa más?",
                "🔧 {name}, para tu aprendizaje recomiendo:\n• 'Experimentos' - Aprende haciendo\n• 'Simulaciones' - Visualiza conceptos\n• 'Investigación' - Proyectos avanzados\n¿Por dónde empezamos?"
            ],
            duda: [
                "🤔 Entiendo que tienes una duda específica, {name}. Me aseguraré de que el Prof. Guerrero reciba tu pregunta. ¿Podrías explicarme tu duda con más detalle?",
                "❓ {name}, las dudas son oportunidades de aprendizaje. Cuéntame tu pregunta y la enviaré al profesor para que te ayude mejor.",
                "💭 No te preocupes por preguntar, {name}. ¿Cuál es tu duda específica? La registraré para que el profesor pueda ayudarte personalmente."
            ],
            tarea: [
                "📝 {name}, ¿necesitas ayuda con tu tarea? Puedo guiarte con conceptos, pero recuerda que es importante que entiendas el proceso. ¿En qué ejercicio específico tienes dificultades?",
                "✏️ {name}, las tareas son para practicar lo aprendido. ¿Qué tipo de problemas estás resolviendo? Te ayudo a entender el método.",
                "📖 {name}, ¿es sobre álgebra, geometría, o cálculo tu tarea? Mientras más específico seas, mejor te puedo orientar."
            ],
            ayuda: [
                `🆘 {name}, como asistente del ${this.professorName}, puedo ayudarte con:\n📐 Álgebra, Geometría, Cálculo, Trigonometría\n📊 Estadística y Probabilidad\n🔢 Cálculos básicos\n📚 Recomendarte recursos de la página\n❓ Registrar tus dudas para el profesor\n¿Qué necesitas?`,
                "📚 {name}, estoy aquí para hacer las matemáticas más fáciles. Puedo explicar conceptos, resolver dudas, y conectarte con los mejores recursos de nuestra página web.",
                "🤖 {name}, además de responder preguntas matemáticas, puedo recomendarte secciones específicas de la página web según tus necesidades. ¿En qué puedo ayudarte?"
            ],
            formulas: [
                "📝 {name}, ¿qué fórmulas necesitas?\n🔵 Área del círculo: A = πr²\n📐 Teorema de Pitágoras: a² + b² = c²\n📊 Ecuación cuadrática: x = (-b ± √(b²-4ac)) / 2a\n📏 Distancia: d = √[(x₂-x₁)² + (y₂-y₁)²]\nVisita 'ContextoMath' para más fórmulas.",
                "🔢 {name}, tengo una biblioteca completa de fórmulas. ¿De qué tema necesitas fórmulas específicas? También están disponibles en 'Materiales'.",
                "💡 {name}, las fórmulas más usadas están en 'ContextoMath':\n📈 Pendiente: m = (y₂-y₁)/(x₂-x₁)\n⭕ Circunferencia: C = 2πr\n🌐 Volumen esfera: V = (4/3)πr³"
            ],
            unknown: [
                "🤔 {name}, no estoy seguro de entender tu pregunta. ¿Podrías ser más específico? Si es una duda compleja, puedo enviarla al Prof. Guerrero.",
                "📚 {name}, mi especialidad son las matemáticas. ¿Podrías reformular tu pregunta? Si necesitas ayuda especializada, la registraré para el profesor.",
                "🤖 {name}, funciono mejor con preguntas matemáticas específicas. ¿Podrías decirme si es sobre álgebra, geometría, cálculo, o algún tema específico?",
                "💭 {name}, si tu pregunta es muy específica o compleja, puedo registrarla como duda para que el Prof. Guerrero te ayude personalmente. ¿Te parece?"
            ],
            goodbye: [
                "👋 ¡Hasta luego, {name}! Espero haberte ayudado con las matemáticas. Recuerda que puedes regresar cuando quieras y explorar todos los recursos de la página web.",
                "📚 ¡Nos vemos, {name}! Sigue explorando las matemáticas y no olvides revisar las secciones de la página web para más recursos.",
                "🤖 ¡Adiós, {name}! Fue un placer ayudarte. No olvides que el Prof. Guerrero está siempre disponible para resolver tus dudas más complejas.",
                "🌟 ¡Hasta la próxima, {name}! Las matemáticas son el lenguaje del universo. ¡Sigue aprendiendo y explorando! ✨"
            ],
            about_creator: [
                `🎓 {name}, fui creado por el ${this.professorName}, quien tiene:\n• Doctorado en Currículo y Tecnología Educativa\n• Maestría en Educación Matemática\n• Bachillerato en Biomatemáticas\n¡Es un experto dedicado a hacer las matemáticas accesibles para todos!`,
                `👨‍🏫 {name}, mi creador es el ${this.professorName}, un educador apasionado del Departamento de Educación de Puerto Rico, especializado en integrar tecnología con enseñanza matemática.`,
                `🌟 {name}, fui desarrollado por el ${this.professorName} para ser tu compañero en el aprendizaje matemático. ¡Él cree que todos pueden dominar las matemáticas con las herramientas adecuadas!`
            ]
        };
        
        this.mathTopics = [
            'álgebra', 'algebra', 'geometría', 'geometria', 'cálculo', 'calculo', 
            'trigonometría', 'trigonometria', 'estadística', 'estadistica', 
            'probabilidad', 'ecuación', 'ecuacion', 'función', 'funcion'
        ];
        
        this.init();
    }
    
    init() {
        this.addChatBotStyles();
        this.createChatInterface();
        this.addEventListeners();
        this.loadConversationHistory();
    }
    
    addChatBotStyles() {
        const style = document.createElement('style');
        style.id = 'chatbot-styles';
        style.textContent = `
            /* Chat Bot Styles Mejorado */
            .chatbot-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
            }
            
            .chatbot-toggle {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .chatbot-toggle::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #4ecdc4);
                border-radius: 50%;
                z-index: -1;
                animation: borderRotate 3s linear infinite;
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
            
            .chatbot-toggle:active {
                transform: scale(0.95);
            }
            
            .chatbot-toggle i {
                font-size: 1.6rem;
                color: white;
                transition: all 0.3s ease;
            }
            
            .chatbot-toggle.active i.fa-robot {
                transform: rotate(180deg) scale(0);
                opacity: 0;
            }
            
            .chatbot-toggle.active i.fa-times {
                transform: rotate(0deg) scale(1);
                opacity: 1;
            }
            
            .chatbot-toggle i.fa-times {
                position: absolute;
                transform: rotate(180deg) scale(0);
                opacity: 0;
            }
            
            .chatbot-window {
                position: absolute;
                bottom: 85px;
                left: 0;
                width: 380px;
                height: 550px;
                background: white;
                border-radius: 25px;
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                transform: translateX(-420px) scale(0.8);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid rgba(102, 126, 234, 0.1);
            }
            
            .chatbot-window.open {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
            
            .chatbot-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.2rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                position: relative;
                overflow: hidden;
            }
            
            .chatbot-header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: rotate(45deg);
                animation: headerShimmer 4s infinite;
            }
            
            .chatbot-avatar {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                position: relative;
                z-index: 2;
                animation: avatarPulse 2s infinite;
            }
            
            .chatbot-info {
                position: relative;
                z-index: 2;
            }
            
            .chatbot-info h3 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
                font-family: 'Space Grotesk', sans-serif;
            }
            
            .chatbot-info p {
                margin: 0;
                font-size: 0.85rem;
                opacity: 0.9;
            }
            
            .chatbot-status {
                display: flex;
                align-items: center;
                gap: 0.3rem;
                font-size: 0.75rem;
                margin-top: 0.2rem;
            }
            
            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #4ecdc4;
                animation: statusBlink 2s infinite;
            }
            
            .chatbot-messages {
                height: 370px;
                overflow-y: auto;
                padding: 1.2rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                display: flex;
                flex-direction: column;
                gap: 1rem;
                scroll-behavior: smooth;
            }
            
            .chatbot-messages::-webkit-scrollbar {
                width: 4px;
            }
            
            .chatbot-messages::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.05);
                border-radius: 4px;
            }
            
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(102, 126, 234, 0.3);
                border-radius: 4px;
            }
            
            .chatbot-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(102, 126, 234, 0.5);
            }
            
            .message {
                max-width: 85%;
                padding: 0.9rem 1.2rem;
                border-radius: 20px;
                font-size: 0.9rem;
                line-height: 1.5;
                word-wrap: break-word;
                animation: messageSlide 0.4s ease;
                position: relative;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .message.bot {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                align-self: flex-start;
                border-bottom-left-radius: 8px;
                margin-left: 0;
            }
            
            .message.user {
                background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
                color: #2d3748;
                align-self: flex-end;
                border-bottom-right-radius: 8px;
                margin-right: 0;
            }
            
            .message.typing {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                align-self: flex-start;
                border-bottom-left-radius: 8px;
                display: flex;
                align-items: center;
                gap: 0.7rem;
                min-height: 40px;
            }
            
            .message.system {
                background: linear-gradient(135deg, #4ecdc4, #44a08d);
                color: white;
                align-self: center;
                text-align: center;
                font-size: 0.8rem;
                padding: 0.6rem 1rem;
                margin: 0.5rem 1rem;
                max-width: 90%;
            }
            
            .typing-indicator {
                display: flex;
                gap: 0.3rem;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
                animation: typingDot 1.4s infinite;
            }
            
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            .quick-actions {
                padding: 0.5rem 1.2rem;
                background: rgba(102, 126, 234, 0.05);
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                border-top: 1px solid rgba(102, 126, 234, 0.1);
            }
            
            .quick-action {
                background: white;
                border: 1px solid rgba(102, 126, 234, 0.2);
                border-radius: 15px;
                padding: 0.4rem 0.8rem;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #667eea;
                font-weight: 500;
            }
            
            .quick-action:hover {
                background: rgba(102, 126, 234, 0.1);
                transform: translateY(-1px);
            }
            
            .chatbot-input {
                padding: 1rem 1.2rem;
                background: white;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 0.7rem;
                align-items: flex-end;
            }
            
            .input-wrapper {
                flex: 1;
                position: relative;
            }
            
            .chatbot-input input {
                width: 100%;
                border: 2px solid #e2e8f0;
                border-radius: 25px;
                padding: 0.7rem 1rem;
                font-size: 0.9rem;
                outline: none;
                transition: all 0.3s ease;
                resize: none;
                font-family: 'Inter', sans-serif;
            }
            
            .chatbot-input input:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .input-actions {
                display: flex;
                gap: 0.3rem;
            }
            
            .chatbot-input button {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .chatbot-input button:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            
            .chatbot-input button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: scale(1);
            }
            
            .doubt-button {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
            }
            
            .doubt-button:hover {
                box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3) !important;
            }
            
            /* Animaciones */
            @keyframes borderRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes headerShimmer {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }
            
            @keyframes avatarPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes statusBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
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
            
            /* Dark Mode */
            .dark-mode .chatbot-window {
                background: #2a2f3e;
                border: 2px solid rgba(139, 156, 247, 0.2);
            }
            
            .dark-mode .chatbot-header {
                background: linear-gradient(135deg, #8b9cf7 0%, #a482d4 100%);
            }
            
            .dark-mode .chatbot-messages {
                background: linear-gradient(135deg, #1a1f2e 0%, #232937 100%);
            }
            
            .dark-mode .message.bot {
                background: linear-gradient(135deg, #8b9cf7, #a482d4);
            }
            
            .dark-mode .message.user {
                background: linear-gradient(135deg, #334155, #475569);
                color: #e2e8f0;
            }
            
            .dark-mode .message.typing {
                background: linear-gradient(135deg, #8b9cf7, #a482d4);
            }
            
            .dark-mode .quick-actions {
                background: rgba(139, 156, 247, 0.1);
                border-top: 1px solid rgba(139, 156, 247, 0.2);
            }
            
            .dark-mode .quick-action {
                background: #2a2f3e;
                border: 1px solid rgba(139, 156, 247, 0.3);
                color: #8b9cf7;
            }
            
            .dark-mode .quick-action:hover {
                background: rgba(139, 156, 247, 0.2);
            }
            
            .dark-mode .chatbot-input {
                background: #2a2f3e;
                border-top: 1px solid rgba(139, 156, 247, 0.2);
            }
            
            .dark-mode .chatbot-input input {
                background: #1a1f2e;
                border: 2px solid rgba(139, 156, 247, 0.2);
                color: #e2e8f0;
            }
            
            .dark-mode .chatbot-input input:focus {
                border-color: #8b9cf7;
                box-shadow: 0 0 0 3px rgba(139, 156, 247, 0.1);
            }
            
            .dark-mode .chatbot-input input::placeholder {
                color: #64748b;
            }
            
            .dark-mode .chatbot-toggle {
                background: linear-gradient(135deg, #8b9cf7 0%, #a482d4 100%);
                box-shadow: 0 4px 20px rgba(139, 156, 247, 0.3);
            }
            
            .dark-mode .chatbot-toggle:hover {
                box-shadow: 0 8px 30px rgba(139, 156, 247, 0.5);
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .chatbot-container {
                    bottom: 15px;
                    left: 15px;
                }
                
                .chatbot-window {
                    width: 340px;
                    height: 500px;
                    bottom: 80px;
                }
                
                .chatbot-messages {
                    height: 320px;
                }
                
                .chatbot-toggle {
                    width: 60px;
                    height: 60px;
                }
                
                .chatbot-toggle i {
                    font-size: 1.4rem;
                }
            }
            
            @media (max-width: 400px) {
                .chatbot-window {
                    width: calc(100vw - 30px);
                    left: -10px;
                }
                
                .quick-actions {
                    padding: 0.5rem 0.8rem;
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
                    <div class="chatbot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chatbot-info">
                        <h3>MathBot</h3>
                        <p>Asistente del Prof. Guerrero</p>
                        <div class="chatbot-status">
                            <div class="status-indicator"></div>
                            <span>En línea</span>
                        </div>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="message bot">
                        ¡Hola! 👋 Soy MathBot, creado por el Prof. Yonatan Guerrero Soriano. Para ayudarte mejor, ¿podrías decirme tu nombre?
                    </div>
                </div>
                <div class="quick-actions" id="quick-actions">
                    <div class="quick-action" data-action="ayuda">📚 Ayuda</div>
                    <div class="quick-action" data-action="recursos">🔗 Recursos</div>
                    <div class="quick-action" data-action="formulas">📝 Fórmulas</div>
                    <div class="quick-action" data-action="about">👨‍🏫 Sobre el Prof.</div>
                </div>
                <div class="chatbot-input">
                    <div class="input-wrapper">
                        <input type="text" id="chatbot-input" placeholder="Escribe tu nombre o pregunta..." maxlength="250">
                    </div>
                    <div class="input-actions">
                        <button id="chatbot-doubt" type="button" class="doubt-button" title="Enviar duda al profesor">
                            <i class="fas fa-question"></i>
                        </button>
                        <button id="chatbot-send" type="button" title="Enviar mensaje">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
            <button class="chatbot-toggle" id="chatbot-toggle">
                <i class="fas fa-robot"></i>
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        this.chatContainer = container;
        this.toggleButton = container.querySelector('#chatbot-toggle');
        this.messagesContainer = container.querySelector('#chatbot-messages');
        this.inputField = container.querySelector('#chatbot-input');
        this.sendButton = container.querySelector('#chatbot-send');
        this.doubtButton = container.querySelector('#chatbot-doubt');
        this.chatWindow = container.querySelector('#chatbot-window');
        this.quickActions = container.querySelector('#quick-actions');
    }
    
    addEventListeners() {
        // Toggle chat
        this.toggleButton.addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Send message
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send doubt
        this.doubtButton.addEventListener('click', () => {
            this.sendDoubtToTeacher();
        });
        
        // Enter key to send
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                this.sendMessage();
            }
        });
        
        // Quick actions
        this.quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatContainer.contains(e.target)) {
                // Don't close if clicking on email dialog
                if (!e.target.closest('.email-modal')) {
                    this.closeChat();
                }
            }
        });
        
        // Prevent closing when clicking inside
        this.chatWindow.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    handleQuickAction(action) {
        let response = '';
        const name = this.studentName || 'estudiante';
        
        switch(action) {
            case 'ayuda':
                response = this.getRandomResponse('ayuda').replace('{name}', name);
                break;
            case 'recursos':
                response = this.getRandomResponse('recursos').replace('{name}', name);
                break;
            case 'formulas':
                response = this.getRandomResponse('formulas').replace('{name}', name);
                break;
            case 'about':
                response = this.getRandomResponse('about_creator').replace('{name}', name);
                break;
        }
        
        this.addMessage(`Acción rápida: ${action}`, 'user');
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(response, 'bot');
        }, 800);
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
        this.createChatSparkles(true);
        this.saveConversationHistory();
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('open');
        this.toggleButton.classList.remove('active');
        this.createChatSparkles(false);
        this.saveConversationHistory();
    }
    
    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isTyping) return;
        
        this.addMessage(message, 'user');
        this.inputField.value = '';
        this.inputField.disabled = true;
        this.sendButton.disabled = true;
        this.doubtButton.disabled = true;
        
        // Check if it's a name (if student name is not set yet)
        if (!this.studentName && this.isLikelyAName(message)) {
            this.studentName = message;
            this.showTyping();
            setTimeout(() => {
                this.hideTyping();
                const response = this.getRandomResponse('nameRequest').replace('{name}', this.studentName);
                this.addMessage(response, 'bot');
                this.enableInput();
                this.saveConversationHistory();
            }, 1000);
            return;
        }
        
        this.showTyping();
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
            this.enableInput();
            this.saveConversationHistory();
        }, 1000 + Math.random() * 1500);
    }
    
    isLikelyAName(text) {
        // Basic name detection - single word, capitalized, no numbers
        const namePattern = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,15}$/;
        const words = text.trim().split(' ');
        return words.length <= 2 && namePattern.test(words[0]) && !this.mathTopics.some(topic => text.toLowerCase().includes(topic));
    }
    
    sendDoubtToTeacher() {
        const message = this.inputField.value.trim();
        if (!message) {
            this.addMessage('Por favor escribe tu duda antes de enviarla al profesor.', 'system');
            return;
        }
        
        const studentName = this.studentName || 'Estudiante Anónimo';
        this.createEmailModal(studentName, message);
    }
    
    createEmailModal(studentName, doubt) {
        // Remove existing modal
        const existingModal = document.querySelector('.email-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'email-modal';
        modal.innerHTML = `
            <div class="email-modal-content">
                <div class="email-header">
                    <h3>📧 Enviar Duda al Profesor</h3>
                    <button class="email-close">&times;</button>
                </div>
                <div class="email-body">
                    <p><strong>Estudiante:</strong> ${studentName}</p>
                    <p><strong>Duda:</strong></p>
                    <div class="doubt-content">${doubt}</div>
                    <div class="email-actions">
                        <button class="email-send">📧 Enviar por Email</button>
                        <button class="email-register">📝 Solo Registrar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.id = 'email-modal-styles';
        modalStyle.textContent = `
            .email-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: modalFadeIn 0.3s ease;
            }
            
            .email-modal-content {
                background: white;
                border-radius: 15px;
                max-width: 450px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease;
            }
            
            .email-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .email-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }
            
            .email-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .email-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .email-body {
                padding: 1.5rem;
            }
            
            .email-body p {
                margin: 0 0 1rem 0;
                color: #2d3748;
            }
            
            .doubt-content {
                background: #f7fafc;
                padding: 1rem;
                border-radius: 10px;
                border-left: 4px solid #667eea;
                margin: 1rem 0;
                font-style: italic;
                color: #4a5568;
            }
            
            .email-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .email-actions button {
                flex: 1;
                padding: 0.8rem 1rem;
                border: none;
                border-radius: 10px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .email-send {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .email-send:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            
            .email-register {
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                color: white;
            }
            
            .email-register:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideIn {
                from { transform: translateY(-50px) scale(0.9); }
                to { transform: translateY(0) scale(1); }
            }
            
            .dark-mode .email-modal-content {
                background: #2a2f3e;
            }
            
            .dark-mode .email-body p {
                color: #e2e8f0;
            }
            
            .dark-mode .doubt-content {
                background: #1a1f2e;
                color: #a0aec0;
            }
        `;
        
        if (!document.getElementById('email-modal-styles')) {
            document.head.appendChild(modalStyle);
        }
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.email-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        modal.querySelector('.email-send').addEventListener('click', () => {
            this.sendEmailToTeacher(studentName, doubt);
            modal.remove();
        });
        
        modal.querySelector('.email-register').addEventListener('click', () => {
            this.registerDoubt(studentName, doubt);
            modal.remove();
        });
    }
    
    sendEmailToTeacher(studentName, doubt) {
        const subject = `Duda Matemática de ${studentName}`;
        const body = `Estimado Prof. Guerrero,

El estudiante ${studentName} tiene la siguiente duda matemática:

"${doubt}"

Esta duda fue enviada a través de MathBot en ${new Date().toLocaleString('es-PR')}.

Saludos,
MathBot - Asistente Digital`;
        
        const mailtoLink = `mailto:${this.professorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        try {
            window.open(mailtoLink, '_blank');
            this.addMessage(`📧 Duda enviada al ${this.professorName}. Se abrirá tu aplicación de email.`, 'system');
            this.inputField.value = '';
            this.registerDoubtInHistory(studentName, doubt, true);
        } catch (error) {
            this.addMessage('❌ Error al abrir el cliente de email. Tu duda ha sido registrada para el profesor.', 'system');
            this.registerDoubtInHistory(studentName, doubt, false);
        }
    }
    
    registerDoubt(studentName, doubt) {
        this.addMessage(`📝 Tu duda ha sido registrada. El ${this.professorName} la revisará pronto.`, 'system');
        this.inputField.value = '';
        this.registerDoubtInHistory(studentName, doubt, false);
    }
    
    registerDoubtInHistory(studentName, doubt, emailSent) {
        const doubtRecord = {
            student: studentName,
            doubt: doubt,
            timestamp: new Date().toISOString(),
            emailSent: emailSent
        };
        
        let doubts = JSON.parse(localStorage.getItem('mathbot_doubts') || '[]');
        doubts.push(doubtRecord);
        localStorage.setItem('mathbot_doubts', JSON.stringify(doubts));
        
        console.log('Duda registrada:', doubtRecord);
    }
    
    enableInput() {
        this.inputField.disabled = false;
        this.sendButton.disabled = false;
        this.doubtButton.disabled = false;
        this.inputField.focus();
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Update conversation history
        this.conversationHistory.push({
            text: text,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        
        if (sender === 'bot') {
            this.createMessageSparkles(messageDiv);
        }
    }
    
    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message typing';
        typingDiv.innerHTML = `
            <span>MathBot está escribiendo</span>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.currentTypingMessage = typingDiv;
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        this.isTyping = false;
        if (this.currentTypingMessage) {
            this.currentTypingMessage.remove();
            this.currentTypingMessage = null;
        }
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        const name = this.studentName || 'estudiante';
        
        // Greetings
        if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('hello') || 
            lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
            return this.getRandomResponse('greetings').replace('{name}', name);
        }
        
        // About creator
        if (lowerMessage.includes('quien te creo') || lowerMessage.includes('quien te hizo') || 
            lowerMessage.includes('creador') || lowerMessage.includes('profesor guerrero') ||
            lowerMessage.includes('yonatan') || lowerMessage.includes('quien eres')) {
            return this.getRandomResponse('about_creator').replace('{name}', name);
        }
        
        // Doubts and homework
        if (lowerMessage.includes('duda') || lowerMessage.includes('no entiendo') || 
            lowerMessage.includes('ayudame') || lowerMessage.includes('confused')) {
            return this.getRandomResponse('duda').replace('{name}', name);
        }
        
        if (lowerMessage.includes('tarea') || lowerMessage.includes('homework') || 
            lowerMessage.includes('ejercicio') || lowerMessage.includes('problema')) {
            return this.getRandomResponse('tarea').replace('{name}', name);
        }
        
        // STEM topics
        if (lowerMessage.includes('stem') || lowerMessage.includes('robotica') || 
            lowerMessage.includes('programacion') || lowerMessage.includes('ingenieria') || 
            lowerMessage.includes('ciencia de datos')) {
            return this.getRandomResponse('stem').replace('{name}', name);
        }
        
        // Olimpiadas
        if (lowerMessage.includes('olimpiada') || lowerMessage.includes('competencia') || 
            lowerMessage.includes('concurso') || lowerMessage.includes('torneo')) {
            return this.getRandomResponse('olimpiadas').replace('{name}', name);
        }
        
        // Algebra
        if (lowerMessage.includes('algebra') || lowerMessage.includes('álgebra') || 
            lowerMessage.includes('ecuacion') || lowerMessage.includes('ecuación') || 
            lowerMessage.includes('variable') || lowerMessage.includes('sistema') || 
            lowerMessage.includes('factorizar') || lowerMessage.includes('polinomio')) {
            return this.getRandomResponse('algebra').replace('{name}', name);
        }
        
        // Geometría
        if (lowerMessage.includes('geometría') || lowerMessage.includes('geometria') || 
            lowerMessage.includes('triángulo') || lowerMessage.includes('triangulo') || 
            lowerMessage.includes('círculo') || lowerMessage.includes('circulo') ||
            lowerMessage.includes('área') || lowerMessage.includes('area') || 
            lowerMessage.includes('perímetro') || lowerMessage.includes('perimetro') || 
            lowerMessage.includes('volumen') || lowerMessage.includes('rectángulo') || 
            lowerMessage.includes('cuadrado') || lowerMessage.includes('polígono')) {
            return this.getRandomResponse('geometria').replace('{name}', name);
        }
        
        // Cálculo
        if (lowerMessage.includes('cálculo') || lowerMessage.includes('calculo') || 
            lowerMessage.includes('derivada') || lowerMessage.includes('integral') ||
            lowerMessage.includes('límite') || lowerMessage.includes('limite') || 
            lowerMessage.includes('diferencial') || lowerMessage.includes('función') || 
            lowerMessage.includes('funcion')) {
            return this.getRandomResponse('calculo').replace('{name}', name);
        }
        
        // Trigonometría
        if (lowerMessage.includes('trigonometría') || lowerMessage.includes('trigonometria') || 
            lowerMessage.includes('seno') || lowerMessage.includes('coseno') ||
            lowerMessage.includes('tangente') || lowerMessage.includes('ángulo') || 
            lowerMessage.includes('angulo') || lowerMessage.includes('hipotenusa') ||
            lowerMessage.includes('sin') || lowerMessage.includes('cos') || lowerMessage.includes('tan')) {
            return this.getRandomResponse('trigonometria').replace('{name}', name);
        }
        
        // Estadística
        if (lowerMessage.includes('estadística') || lowerMessage.includes('estadistica') || 
            lowerMessage.includes('probabilidad') || lowerMessage.includes('media') || 
            lowerMessage.includes('mediana') || lowerMessage.includes('moda')) {
            return this.getRandomResponse('estadistica').replace('{name}', name);
        }
        
        // Recursos y páginas
        if (lowerMessage.includes('recurso') || lowerMessage.includes('pagina') || 
            lowerMessage.includes('página') || lowerMessage.includes('web') || 
            lowerMessage.includes('sitio') || lowerMessage.includes('enlace')) {
            return this.getRandomResponse('recursos').replace('{name}', name);
        }
        
        // Fórmulas
        if (lowerMessage.includes('formula') || lowerMessage.includes('fórmula') || 
            lowerMessage.includes('ecuacion cuadratica') || lowerMessage.includes('pitagoras') || 
            lowerMessage.includes('teorema')) {
            return this.getRandomResponse('formulas').replace('{name}', name);
        }
        
        // Ayuda
        if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || 
            lowerMessage.includes('que puedes hacer') || lowerMessage.includes('que sabes') || 
            lowerMessage.includes('como funciona')) {
            return this.getRandomResponse('ayuda').replace('{name}', name);
        }
        
        // Goodbye
        if (lowerMessage.includes('adios') || lowerMessage.includes('adiós') || 
            lowerMessage.includes('chao') || lowerMessage.includes('bye') || 
            lowerMessage.includes('hasta luego') || lowerMessage.includes('nos vemos') || 
            lowerMessage.includes('gracias')) {
            return this.getRandomResponse('goodbye').replace('{name}', name);
        }
        
        // Basic calculations
        if (/[\+\-\*\/\(\)\d\s]+/.test(message) && (lowerMessage.includes('+') || 
            lowerMessage.includes('-') || lowerMessage.includes('*') || lowerMessage.includes('/') || 
            lowerMessage.includes('calcular') || lowerMessage.includes('cuanto es'))) {
            try {
                const result = this.evaluateBasicMath(message);
                return `🔢 El resultado es: ${result}\n\n${name}, ¿necesitas ayuda con algún otro cálculo matemático?`;
            } catch (e) {
                return `🤔 ${name}, no pude procesar esa operación. ¿Podrías escribirla más clara? Por ejemplo: 2 + 3 * 4`;
            }
        }
        
        // Specific math topics
        if (lowerMessage.includes('matrices') || lowerMessage.includes('determinante')) {
            return `📋 ${name}, las matrices son herramientas poderosas en matemáticas. ¿Necesitas ayuda con operaciones de matrices o cálculo de determinantes? También puedes revisar nuestros recursos en 'Análisis de Datos'.`;
        }
        
        if (lowerMessage.includes('logaritmo') || lowerMessage.includes('exponencial')) {
            return `📈 ${name}, los logaritmos y exponenciales están relacionados. log_b(x) = y significa que b^y = x. ¿Qué específicamente necesitas saber? Visita 'ContextoMath' para más ejemplos.`;
        }
        
        return this.getRandomResponse('unknown').replace('{name}', name);
    }
    
    evaluateBasicMath(expression) {
        const cleaned = expression
            .replace(/[^0-9+\-*/.() ]/g, '')
            .replace(/[a-zA-Z]/g, '');
        
        if (!cleaned || cleaned.length === 0) {
            return 'Error: Expresión vacía';
        }
        
        if (cleaned.includes('..') || cleaned.includes('**')) {
            return 'Error: Expresión no válida';
        }
        
        try {
            const result = Function(`"use strict"; return (${cleaned})`)();
            
            if (isNaN(result)) {
                return 'Error: Resultado no numérico';
            }
            
            if (!isFinite(result)) {
                return 'Error: Resultado infinito';
            }
            
            return Number(result.toFixed(10)).toString();
        } catch (e) {
            return 'Error: Operación no válida';
        }
    }
    
    getRandomResponse(category) {
        const responses = this.responses[category];
        if (!responses) return 'Lo siento, no tengo una respuesta para eso.';
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    saveConversationHistory() {
        const chatData = {
            studentName: this.studentName,
            conversationHistory: this.conversationHistory,
            lastActive: new Date().toISOString()
        };
        localStorage.setItem('mathbot_chat_history', JSON.stringify(chatData));
    }
    
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('mathbot_chat_history');
            if (saved) {
                const chatData = JSON.parse(saved);
                this.studentName = chatData.studentName || '';
                this.conversationHistory = chatData.conversationHistory || [];
                
                // Only restore if it's the same session (within 1 hour)
                const lastActive = new Date(chatData.lastActive);
                const now = new Date();
                const hoursPassed = (now - lastActive) / (1000 * 60 * 60);
                
                if (hoursPassed > 1) {
                    // Reset for new session
                    this.studentName = '';
                    this.conversationHistory = [];
                    this.saveConversationHistory();
                }
            }
        } catch (e) {
            console.log('No previous chat history found');
        }
    }
    
    createChatSparkles(opening) {
        const button = this.toggleButton;
        const rect = button.getBoundingClientRect();
        const sparkles = opening ? ['🤖', '💬', '✨', '📚', '🎯'] : ['👋', '💫', '⭐', '🌟', '📖'];
        
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[i];
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + rect.width / 2) + 'px';
            sparkle.style.top = (rect.top + rect.height / 2) + 'px';
            sparkle.style.fontSize = '1.3rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10001';
            sparkle.style.animation = `chatSparkle 1.5s ease-out forwards`;
            sparkle.style.animationDelay = i * 0.1 + 's';
            
            const angle = (Math.PI * 2 * i) / 5;
            const distance = 60;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            sparkle.style.setProperty('--end-x', endX + 'px');
            sparkle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
        
        if (!document.getElementById('chat-sparkle-animation')) {
            const sparkleStyle = document.createElement('style');
            sparkleStyle.id = 'chat-sparkle-animation';
            sparkleStyle.textContent = `
                @keyframes chatSparkle {
                    0% {
                        transform: translate(0, 0) scale(0.5) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--end-x, 50px), var(--end-y, -50px)) scale(1.3) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(sparkleStyle);
        }
    }
    
    createMessageSparkles(messageElement) {
        const rect = messageElement.getBoundingClientRect();
        const symbols = ['💡', '🔢', '📐', '✨', '🧮', '📊'];
        
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = rect.left + 'px';
            sparkle.style.top = (rect.top + rect.height / 2) + 'px';
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10001';
            sparkle.style.animation = `messageSparkle 1.2s ease-out forwards`;
            sparkle.style.animationDelay = i * 0.2 + 's';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1200);
        }
        
        if (!document.getElementById('message-sparkle-animation')) {
            const sparkleStyle = document.createElement('style');
            sparkleStyle.id = 'message-sparkle-animation';
            sparkleStyle.textContent = `
                @keyframes messageSparkle {
                    0% {
                        transform: translate(0, 0) scale(0.5);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-40px, -25px) scale(1.2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(sparkleStyle);
        }
    }
    
    // Public methods
    openChatBot() {
        if (!this.isOpen) {
            this.openChat();
        }
    }
    
    closeChatBot() {
        if (this.isOpen) {
            this.closeChat();
        }
    }
    
    getStudentDoubts() {
        return JSON.parse(localStorage.getItem('mathbot_doubts') || '[]');
    }
    
    clearDoubts() {
        localStorage.removeItem('mathbot_doubts');
    }
    
    addCustomResponse(keyword, response) {
        if (!this.responses.custom) {
            this.responses.custom = [];
        }
        this.responses.custom.push({ keyword, response });
    }
    
    destroy() {
        if (this.chatContainer) {
            this.chatContainer.remove();
        }
        const styleElement = document.getElementById('chatbot-styles');
        if (styleElement) {
            styleElement.remove();
        }
        const modalStyles = document.getElementById('email-modal-styles');
        if (modalStyles) {
            modalStyles.remove();
        }
    }
}

// Initialize Math Chat Bot
function initMathChatBot() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new MathChatBot();
        });
    } else {
        new MathChatBot();
    }
}

// Export for use in main file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMathChatBot, MathChatBot };
} else {
    // Browser environment
    window.MathChatBot = { initMathChatBot, MathChatBot };
}