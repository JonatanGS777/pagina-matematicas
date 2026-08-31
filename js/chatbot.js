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
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" /></svg> Hueso de Ishango (~20,000 a.C.): posiblemente el artefacto matemático más antiguo con marcas de conteo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Notación numérica en cuevas: marcas talladas para registrar ciclos lunares y estaciones.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> Geometría en el arte rupestre: patrones simétricos y proporciones en pinturas paleolíticas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></svg> Primeros sistemas de conteo: uso de dedos, piedras y muescas para comercio primitivo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg> Astronomía temprana: observación de ciclos para agricultura y migración.'
            ],
            'Mesopotamia': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg> Plimpton 322 (~1800 a.C.): tabla con ternas pitagóricas, 1000 años antes de Pitágoras.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></svg> Sistema sexagesimal babilónico (base 60): origen de nuestros 60 minutos y 360 grados.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Tablas de multiplicar cuneiformes: educación matemática sistematizada hace 4000 años.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Ecuaciones cuadráticas babilónicas: métodos algorítmicos similares a "completar el cuadrado".',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Matemática administrativa: contabilidad compleja para templos y palacios.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /> <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" /> <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" /> <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" /> <path d="M7 21h10" /></svg> Código de Hammurabi: leyes con cálculos de interés compuesto y proporciones.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8" /> <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /> <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /></svg> Agrimensura mesopotámica: cálculo de áreas irregulares para impuestos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></svg> Astrología matemática: predicciones basadas en cálculos astronómicos precisos.'
            ],
            'Egipto Antiguo': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /> <path d="M14 2v5a1 1 0 0 0 1 1h5" /> <path d="M10 9H8" /> <path d="M16 13H8" /> <path d="M16 17H8" /></svg> Papiro Rhind (~1650 a.C.): manual matemático con 84 problemas resueltos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg> Papiro de Moscú: contiene el cálculo del volumen de un tronco de pirámide.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1" /> <path d="M17 14v7" /> <path d="M7 14v7" /> <path d="M17 3v3" /> <path d="M7 3v3" /> <path d="M10 14 2.3 6.3" /> <path d="m14 6 7.7 7.7" /> <path d="m8 6 8 8" /></svg> Matemática de las pirámides: proporciones áureas y triángulos 3-4-5.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="1" /> <line x1="5" x2="19" y1="12" y2="12" /> <circle cx="12" cy="18" r="1" /></svg> Fracciones unitarias egipcias: todo número expresado como suma de fracciones 1/n.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Cuerda de 12 nudos: herramienta para crear ángulos rectos en construcción.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></svg> Nilómetros: medición matemática de crecidas para predecir cosechas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /> <circle cx="12" cy="12" r="3" /></svg> Ojo de Horus: sistema de fracciones basado en mitología.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /></svg> Calendario de 365 días: precisión astronómica sorprendente.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" /> <path d="M10 5H8a2 2 0 0 0 0 4h.68" /> <path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" /> <path d="M14 5h2a2 2 0 0 1 0 4h-.68" /> <path d="M18 22H6" /> <path d="M9 2h6" /></svg> Geometría funeraria: cálculos para tumbas y sarcófagos.'
            ],
            'Grecia Clásica': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Euclides y "Los Elementos": el libro más influyente después de la Biblia.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13" /> <circle cx="6" cy="18" r="3" /> <circle cx="18" cy="16" r="3" /></svg> Pitágoras: números, música y el teorema más famoso de la historia.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></svg> Platón y los sólidos perfectos: geometría como lenguaje del universo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" /> <path d="M8.5 2h7" /> <path d="M14.5 16h-5" /></svg> Arquímedes: "¡Eureka!" y el principio de la palanca.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> La espiral de Arquímedes: primera curva mecánica de la historia.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg> Apolonio: secciones cónicas que usamos en órbitas satelitales.',
                '∞ Zenón y sus paradojas: primeros debates sobre el infinito.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Tales de Mileto: midió pirámides con sombras.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></svg> Números perfectos y amigos: misticismo matemático pitagórico.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Academia de Platón: "Que no entre quien no sepa geometría".'
            ],
            'India': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></svg> El cero como número: revolución conceptual india (~500 d.C.).',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14" /> <path d="m18.065 8.496-12.125 7" /> <path d="m5.94 8.504 12.125 7" /></svg> Sistema decimal posicional: base de toda la matemática moderna.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6" /> <path d="m22 7-8.5 8.5-5-5L2 17" /></svg> Aryabhata: calculó π con 4 decimales y la duración del año.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg> Brahmagupta: reglas para operar con cero y números negativos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" /></svg> Bhaskara II: primeras ideas sobre el infinito matemático.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></svg> Sulba Sutras: geometría védica para construcción de altares.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Combinatoria india: permutaciones en poesía sánscrita.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" /></svg> Método chakravala: algoritmo para ecuaciones diofánticas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Trigonometría india: tablas de senos y desarrollo del coseno.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg> Astronomía matemática: predicción precisa de eclipses.'
            ],
            'China': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg> "Nueve Capítulos": enciclopedia matemática china (~200 a.C.).',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3" /> <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" /> <path d="M5 21h14" /></svg> Varillas de cálculo: primer sistema de matrices y determinantes.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></svg> Triángulo de Yang Hui: "Pascal" 500 años antes que Pascal.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></svg> Ábaco suanpan: calculadora mecánica usada por 2000 años.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12v6" /> <path d="M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z" /> <path d="M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" /></svg> Cuadrados mágicos: Lo Shu y misticismo numérico.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /> <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" /> <path d="M12 7.5V9" /> <path d="M7.5 12H9" /> <path d="M16.5 12H15" /> <path d="M12 16.5V15" /> <path d="m8 8 1.88 1.88" /> <path d="M14.12 9.88 16 8" /> <path d="m8 16 1.88-1.88" /> <path d="M14.12 14.12 16 16" /></svg> Problema de los restos chinos: teorema fundamental en criptografía moderna.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Liu Hui: calculó π con polígonos de 3072 lados.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="6" /> <circle cx="12" cy="12" r="2" /></svg> Matemática militar: "El Arte de la Guerra" y cálculos estratégicos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8" /> <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /> <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /></svg> Matemática agraria: sistemas de irrigación optimizados.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></svg> I Ching: binario antes de Leibniz.'
            ],
            'Mundo Islámico': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg> Al-Juarismi: padre del álgebra y los algoritmos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8" /> <path d="M3 22h18" /> <path d="M14 22a7 7 0 1 0 0-14h-1" /> <path d="M9 14h2" /> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg> Ibn al-Haytham (Alhazen): método científico y óptica geométrica.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg> Al-Kashi: calculó π con 16 decimales, récord por 200 años.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Omar Khayyam: soluciones geométricas a ecuaciones cúbicas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg> Al-Biruni: midió el radio de la Tierra con trigonometría.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Casa de la Sabiduría de Bagdad: centro mundial del conocimiento.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" /> <path d="m13.56 11.747 4.332-.924" /> <path d="m16 21-3.105-6.21" /> <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" /> <path d="m6.158 8.633 1.114 4.456" /> <path d="m8 21 3.105-6.21" /> <circle cx="12" cy="13" r="2" /></svg> Trigonometría esférica: navegación y astronomía avanzada.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" /> <path d="M15 6h1v4" /> <path d="m6.134 14.768.866-.5 2 3.464" /> <circle cx="16" cy="8" r="6" /></svg> Al-Karaji: desarrollo del álgebra sin geometría.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> Geometría islámica: teselaciones y patrones infinitos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v16" /> <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" /></svg> Preservación griega: sin los árabes, perderíamos a Euclides y Arquímedes.'
            ],
            'Europa Medieval': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg> Fibonacci (1202): introdujo números indo-arábigos en Europa.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 16a3 3 0 0 1 2.24 5" /> <path d="M18 12h.01" /> <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3" /> <path d="M20 8.54V4a2 2 0 1 0-4 0v3" /> <path d="M7.612 12.524a3 3 0 1 0-1.6 4.3" /></svg> Sucesión de Fibonacci: aparece en naturaleza y arte.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5V3" /> <path d="M14 5V3" /> <path d="M15 21v-3a3 3 0 0 0-6 0v3" /> <path d="M18 3v8" /> <path d="M18 5H6" /> <path d="M22 11H2" /> <path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9" /> <path d="M6 3v8" /></svg> Matemática de castillos: balística y fortificaciones.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9h4" /> <path d="M12 7v5" /> <path d="M14 21v-3a2 2 0 0 0-4 0v3" /> <path d="m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9" /> <path d="M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14" /></svg> Geometría gótica: catedrales y proporción divina.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14" /> <path d="m18.065 8.496-12.125 7" /> <path d="m5.94 8.504 12.125 7" /></svg> Escolástica: lógica matemática en teología.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /> <path d="M22 10v6" /> <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg> Primeras universidades: Oxford, París, Bolonia.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" /> <path d="M6.453 15h11.094" /> <path d="M8.5 2h7" /></svg> Alquimia matemática: búsqueda de patrones universales.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /></svg> Reforma del calendario: matemática para el calendario gregoriano.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" /> <path d="M15 6h1v4" /> <path d="m6.134 14.768.866-.5 2 3.464" /> <circle cx="16" cy="8" r="6" /></svg> Matemática comercial: letras de cambio y contabilidad doble.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13" /> <circle cx="6" cy="18" r="3" /> <circle cx="18" cy="16" r="3" /></svg> Música medieval: teoría matemática del canto gregoriano.'
            ],
            'Renacimiento': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> Leonardo da Vinci: matemática en arte e ingeniería.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Perspectiva matemática: revolución en el arte renacentista.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8" /> <path d="M3 22h18" /> <path d="M14 22a7 7 0 1 0 0-14h-1" /> <path d="M9 14h2" /> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg> Galileo: "El libro de la naturaleza está escrito en lenguaje matemático".',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6" /> <path d="m22 7-8.5 8.5-5-5L2 17" /></svg> Descartes: unión de álgebra y geometría (coordenadas cartesianas).',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Cardano y Tartaglia: fórmulas para ecuaciones cúbicas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></svg> Kepler: órbitas elípticas y leyes planetarias.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /> <path d="M15 5.764v15" /> <path d="M9 3.236v15" /></svg> Mercator: proyección matemática para navegación.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" /></svg> Relojes mecánicos: precisión matemática del tiempo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Arquitectura renacentista: proporción áurea en cada edificio.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Imprenta: democratización del conocimiento matemático.'
            ],
            'Siglo XVII': [
                '∫ Newton vs Leibniz: la guerra del cálculo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.528V3a1 1 0 0 1 1-1h0" /> <path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21" /></svg> Newton: gravedad, cálculo y las leyes del movimiento.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></svg> Leibniz: notación moderna y sistema binario.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg> Fermat: último teorema y principio del tiempo mínimo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Pascal: triángulo, probabilidad y la primera calculadora.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6" /> <path d="m22 7-8.5 8.5-5-5L2 17" /></svg> Logaritmos de Napier: simplificaron cálculos astronómicos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8" /> <path d="M3 22h18" /> <path d="M14 22a7 7 0 1 0 0-14h-1" /> <path d="M9 14h2" /> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg> Microscopio y telescopio: matemática de lentes.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /> <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" /> <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" /> <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" /> <path d="M7 21h10" /></svg> Mecánica analítica: matematización de la física.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></svg> Huygens: teoría ondulatoria y relojes de péndulo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Geometría proyectiva: perspectiva matematizada.'
            ],
            'Siglo XVIII': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /> <path d="M5 21h14" /></svg> Euler: el matemático más prolífico de la historia.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" /></svg> e^(iπ) + 1 = 0: "la fórmula más bella de las matemáticas".',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Problema de los puentes de Königsberg: nace la teoría de grafos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg> Lagrange: mecánica analítica y teoría de grupos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13" /> <circle cx="6" cy="18" r="3" /> <circle cx="18" cy="16" r="3" /></svg> Fourier: descomposición de ondas (base del MP3).',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6" /> <path d="m22 7-8.5 8.5-5-5L2 17" /></svg> Estadística moderna: Bayes y la probabilidad condicional.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg> Medición del meridiano: base del sistema métrico.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></svg> Matemática de la electricidad: ecuaciones de Laplace.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Enciclopedia: D\'Alembert matematiza el conocimiento.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /> <path d="M5 21h14" /></svg> Émilie du Châtelet: tradujo y extendió los Principia de Newton.'
            ],
            'Siglo XIX': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /> <path d="M5 21h14" /></svg> Gauss: "Príncipe de las Matemáticas".',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Números complejos: de "imaginarios" a fundamentales.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Geometrías no euclidianas: Bolyai, Lobachevsky, Riemann.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" /></svg> Cantor: infinitos de diferentes tamaños.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /></svg> <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8" /> <path d="M3 22h18" /> <path d="M14 22a7 7 0 1 0 0-14h-1" /> <path d="M9 14h2" /> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg> Sofia Kovalevskaya: primera profesora de matemáticas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg> Galois: teoría de grupos y muerte en duelo a los 20 años.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="6" /> <circle cx="12" cy="12" r="2" /></svg> Riemann: hipótesis del millón de dólares.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></svg> Maxwell: electromagnetismo en 4 ecuaciones.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></svg> Máquina analítica de Babbage: primera computadora.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /> <path d="M20.054 15.987H3.946" /></svg> Ada Lovelace: primera programadora de la historia.'
            ],
            'Siglo XX': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /> <path d="M20.054 15.987H3.946" /></svg> Turing: computación teórica y la máquina universal.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> RSA: criptografía de clave pública.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /> <path d="M12 17h.01" /></svg> Gödel: teoremas de incompletitud.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11" /> <line x1="8" x2="8" y1="9" y2="13" /> <line x1="15" x2="15.01" y1="12" y2="12" /> <line x1="18" x2="18.01" y1="10" y2="10" /> <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></svg> Von Neumann: teoría de juegos y arquitectura de computadoras.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg> Estadística moderna: Fisher, Pearson, Neyman.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" /> <path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" /> <circle cx="12" cy="12" r="3" /> <circle cx="19" cy="5" r="2" /> <circle cx="5" cy="19" r="2" /></svg> Relatividad: geometría del espacio-tiempo.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Teoría del caos: el efecto mariposa.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 16 1.5 1.5" /> <path d="m14 8-1.5-1.5" /> <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /> <path d="m16.5 10.5 1 1" /> <path d="m17 6-2.891-2.891" /> <path d="M2 15c6.667-6 13.333 0 20-6" /> <path d="m20 9 .891.891" /> <path d="M3.109 14.109 4 15" /> <path d="m6.5 12.5 1 1" /> <path d="m7 18 2.891 2.891" /> <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /></svg> Matemática del ADN: bioinformática.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6" /> <path d="m22 7-8.5 8.5-5-5L2 17" /></svg> Black-Scholes: matemática financiera moderna.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2" /> <path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2" /> <path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3" /> <path d="M4 22h16" /> <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /> <path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3" /></svg> Medallas Fields: el "Nobel" de las matemáticas.'
            ],
            'Siglo XXI': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8" /> <rect width="16" height="12" x="4" y="8" rx="2" /> <path d="M2 14h2" /> <path d="M20 14h2" /> <path d="M15 13v2" /> <path d="M9 13v2" /></svg> Machine Learning: matemática que aprende.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Blockchain: criptografía descentralizada.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 16 1.5 1.5" /> <path d="m14 8-1.5-1.5" /> <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /> <path d="m16.5 10.5 1 1" /> <path d="m17 6-2.891-2.891" /> <path d="M2 15c6.667-6 13.333 0 20-6" /> <path d="m20 9 .891.891" /> <path d="M3.109 14.109 4 15" /> <path d="m6.5 12.5 1 1" /> <path d="m7 18 2.891 2.891" /> <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /></svg> Bioinformática: decodificando el genoma humano.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg> Big Data: estadística a escala planetaria.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11" /> <line x1="8" x2="8" y1="9" y2="13" /> <line x1="15" x2="15.01" y1="12" y2="12" /> <line x1="18" x2="18.01" y1="10" y2="10" /> <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></svg> Gráficos 3D: álgebra lineal en videojuegos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /> <path d="M12 18h.01" /></svg> Compresión de datos: matemática en tu smartphone.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /> <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /> <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /> <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" /></svg> SpaceX: cálculo de trayectorias reutilizables.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /> <path d="m8.5 8.5 7 7" /></svg> Modelado de pandemias: epidemiología matemática.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg> Cambio climático: modelos matemáticos globales.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2" /> <path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2" /> <path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3" /> <path d="M4 22h16" /> <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /> <path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3" /></svg> Problemas del Milenio: 6 de 7 siguen sin resolver.'
            ],
            'América Precolombina': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8" /> <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /> <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /></svg> Calendario maya: precisión superior al juliano.',
                '0 Cero maya: símbolo de concha, concepto revolucionario.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2" /> <path d="M7 11v4a2 2 0 0 0 2 2h4" /> <rect width="8" height="8" x="13" y="13" rx="2" /></svg> Quipus incas: computación con cuerdas y nudos.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg> Ingeniería inca: ángulos antisísmicos calculados.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /> <circle cx="12" cy="10" r="3" /></svg> Sistema vigesimal maya: matemática en base 20.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Geometría olmeca: cabezas colosales perfectamente esféricas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Teotihuacán: ciudad planificada con proporciones matemáticas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Nazca: geometría a escala kilométrica.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg> Astronomía azteca: predicción de eclipses.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> Simetría en textiles: matemática en el arte precolombino.'
            ],
            'África': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" /></svg> Hueso de Lebombo (35,000 a.C.): posible calendario lunar.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" /> <path d="M10 5H8a2 2 0 0 0 0 4h.68" /> <path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" /> <path d="M14 5h2a2 2 0 0 1 0 4h-.68" /> <path d="M18 22H6" /> <path d="M9 2h6" /></svg> Geometría fractal africana: patrones recursivos en aldeas.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14" /> <path d="m18.065 8.496-12.125 7" /> <path d="m5.94 8.504 12.125 7" /></svg> Sistemas de conteo yoruba: base 20 con sub-base 5.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Mancala: teoría de juegos milenaria.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Pirámides de Nubia: geometría kushita.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Biblioteca de Tombuctú: manuscritos matemáticos del Sahel.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></svg> Gelosia etíope: método de multiplicación único.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> Simetría en el arte africano: grupos de transformación.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg> Navegación swahili: trigonometría del Índico.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 3 8 9l4 13 4-13-2.5-6" /> <path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z" /> <path d="M2 9h20" /></svg> Geometría del Gran Zimbabwe: arquitectura sin mortero.'
            ],
            'Oceanía': [
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></svg> Navegación polinesia: mapas de palos y corrientes.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> Moái de Pascua: ingeniería y transporte calculado.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /> <path d="M3 3v5h5" /></svg> Física del bumerán: aerodinámica aborigen.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> Arte aborigen: geometría del Tiempo del Sueño.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" /> <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" /> <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" /> <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" /></svg> Calendarios lunares: agricultura isleña.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1" /> <circle cx="12" cy="8" r="2" /> <path d="M12 10v12" /> <path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z" /> <path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z" /></svg> Simetría en tatuajes: matemática corporal.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v15" /> <path d="M7 22a4 4 0 0 1-4-4 1 1 0 0 1 1-1h16a1 1 0 0 1 1 1 4 4 0 0 1-4 4z" /> <path d="M9.159 2.46a1 1 0 0 1 1.521-.193l9.977 8.98A1 1 0 0 1 20 13H4a1 1 0 0 1-.824-1.567z" /></svg> Cálculo de mareas: navegación precisa.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg> Megalitos de Nan Madol: ingeniería misteriosa.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" /> <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" /> <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" /> <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" /></svg> Distribución de recursos: optimización en atolones.',
                '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14" /> <path d="m18.065 8.496-12.125 7" /> <path d="m5.94 8.504 12.125 7" /></svg> Sistemas de conteo: base 5 en muchas culturas.'
            ]
        };
        
        // Tips diarios ampliados
        this.dailyTips = [
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg> Los babilonios conocían el teorema de Pitágoras 1000 años antes que Pitágoras.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" /></svg> El ábaco sigue siendo más rápido que una calculadora en manos expertas.',
            '0 El cero tardó siglos en ser aceptado en Europa por considerarse "diabólico".',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" /></svg> Hay infinitos más grandes que otros según la teoría de Cantor.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> El problema de Monty Hall confunde incluso a matemáticos experimentados.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> La sucesión de Fibonacci aparece en girasoles, piñas y galaxias.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" /></svg> Sólo existen 5 sólidos platónicos perfectos en 3D.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" /></svg> El número e aparece naturalmente en interés compuesto y crecimiento.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13" /> <circle cx="6" cy="18" r="3" /> <circle cx="18" cy="16" r="3" /></svg> Bach usó proporciones matemáticas en sus composiciones.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> El Partenón sigue la proporción áurea en su diseño.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /> <path d="M20.054 15.987H3.946" /></svg> Alan Turing rompió Enigma y creó la ciencia de la computación.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /></svg> <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8" /> <path d="M3 22h18" /> <path d="M14 22a7 7 0 1 0 0-14h-1" /> <path d="M9 14h2" /> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg> Emmy Noether revolucionó el álgebra abstracta y la física.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg> Eratóstenes calculó el radio de la Tierra con palos y sombras.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="6" /> <circle cx="12" cy="12" r="2" /></svg> La paradoja del cumpleaños: en 23 personas, 50% comparten fecha.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg> El 80% de la estadística se inventó en el siglo XX.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" /> <path d="M10 5H8a2 2 0 0 0 0 4h.68" /> <path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" /> <path d="M14 5h2a2 2 0 0 1 0 4h-.68" /> <path d="M18 22H6" /> <path d="M9 2h6" /></svg> Los egipcios usaban la cuerda de 12 nudos para hacer ángulos rectos.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg> Los mayas predecían eclipses con siglos de anticipación.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Tu tarjeta de crédito usa matemática de Fermat del siglo XVII.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 16 1.5 1.5" /> <path d="m14 8-1.5-1.5" /> <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /> <path d="m16.5 10.5 1 1" /> <path d="m17 6-2.891-2.891" /> <path d="M2 15c6.667-6 13.333 0 20-6" /> <path d="m20 9 .891.891" /> <path d="M3.109 14.109 4 15" /> <path d="m6.5 12.5 1 1" /> <path d="m7 18 2.891 2.891" /> <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /></svg> El ADN es esencialmente un código de corrección de errores.',
            '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></svg> Las olas del mar siguen ecuaciones diferenciales parciales.'
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
            /* Estilos del Chat Bot — Cuaderno de Cátedra */
            .chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Karla', sans-serif;
            }

            .chatbot-toggle {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                background: var(--dark-mid);
                border: 1.5px dashed rgba(227, 196, 104, 0.55);
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(8, 16, 12, 0.4);
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
                transform: scale(1.08);
                border-color: rgba(227, 196, 104, 0.9);
                box-shadow: 0 8px 30px rgba(8, 16, 12, 0.5);
            }

            .chatbot-toggle.active {
                pointer-events: none;
                opacity: 0.3;
                transform: scale(0.9);
            }

            .chatbot-toggle-icon {
                font-size: 1.5rem;
                color: var(--primary);
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
                background: var(--light);
                border-radius: 10px;
                border: 1.5px dashed rgba(34, 53, 42, 0.22);
                box-shadow: 0 20px 60px rgba(8, 16, 12, 0.3);
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
                background: var(--dark-mid);
                color: var(--text-primary);
                padding: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1.5px dashed rgba(244, 240, 226, 0.2);
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
                background: rgba(227, 196, 104, 0.16);
                color: var(--primary);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
            }

            .chatbot-title {
                font-family: 'Fraunces', serif;
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0;
            }

            .chatbot-subtitle {
                font-size: 0.8rem;
                color: var(--text-secondary);
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
                background: rgba(244, 240, 226, 0.1);
                border: none;
                color: var(--text-primary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
                font-size: 0.9rem;
            }

            .chatbot-header-btn:hover {
                background: var(--primary);
                color: var(--ink);
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
                background-color: var(--light);
                background-image: repeating-linear-gradient(180deg, transparent 0px, transparent 27px, rgba(34, 53, 42, 0.06) 27px, rgba(34, 53, 42, 0.06) 28px);
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
                background: rgba(227, 196, 104, 0.35);
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
                border-radius: 10px;
                line-height: 1.4;
                word-wrap: break-word;
            }

            .chatbot-container .message.bot .message-bubble {
                background: var(--white);
                border: 1.5px dashed rgba(34, 53, 42, 0.25);
                color: var(--ink);
                border-bottom-left-radius: 3px;
            }

            .chatbot-container .message.user .message-bubble {
                background: var(--gradient-main);
                color: var(--ink);
                border-bottom-right-radius: 3px;
            }

            .chatbot-container .message-card {
                background: var(--white);
                border: 1.5px dashed rgba(34, 53, 42, 0.22);
                border-radius: 8px;
                padding: 1rem;
                margin-top: 0.5rem;
                box-shadow: 0 4px 14px rgba(34, 53, 42, 0.08);
            }

            .chatbot-container .message-card-title {
                font-family: 'Fraunces', serif;
                font-weight: 600;
                color: var(--ink);
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
                background: var(--white);
                border: 1.5px dashed rgba(227, 196, 104, 0.5);
                border-radius: 20px;
                color: var(--ink-secondary);
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
            }

            .quick-action-chip:hover {
                background: var(--primary);
                border-style: solid;
                color: var(--ink);
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
                background: var(--white);
                border: 1px solid rgba(34, 53, 42, 0.15);
                border-radius: 8px;
                cursor: pointer;
                text-align: center;
                font-size: 0.85rem;
                color: var(--ink-secondary);
                transition: all 0.2s ease;
            }

            .period-card:hover {
                background: var(--gradient-main);
                color: var(--ink);
                border-color: transparent;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(227, 196, 104, 0.35);
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
                background: var(--white);
                border: 1px solid rgba(34, 53, 42, 0.14);
                border-radius: 8px;
                text-decoration: none;
                color: var(--ink);
                transition: all 0.2s ease;
            }

            .chatbot-container .nav-link:hover {
                background: rgba(227, 196, 104, 0.1);
                border-color: rgba(227, 196, 104, 0.5);
                transform: translateX(4px);
            }

            .chatbot-container .nav-link-icon {
                font-size: 1.2rem;
                color: var(--primary);
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
                color: var(--ink-muted);
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
                border: 1px solid rgba(34, 53, 42, 0.25);
                border-radius: 8px;
                outline: none;
                color: var(--ink);
                background: var(--white);
                transition: border-color 0.2s ease;
            }

            .search-input:focus {
                border-color: var(--primary);
            }

            .search-btn {
                padding: 0.6rem 1.2rem;
                background: var(--gradient-main);
                color: var(--ink);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
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
                background: var(--white);
                border-left: 3px solid var(--primary);
                margin-bottom: 0.5rem;
                border-radius: 0 6px 6px 0;
            }

            .search-result-period {
                font-family: 'JetBrains Mono', monospace;
                font-weight: 600;
                color: var(--secondary);
                font-size: 0.8rem;
            }

            .search-result-text {
                margin-top: 0.3rem;
                font-size: 0.9rem;
                line-height: 1.4;
                color: var(--ink);
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
                color: var(--ink-secondary);
                font-weight: 500;
            }

            .chatbot-container .form-input,
            .chatbot-container .form-select,
            .chatbot-container .form-textarea {
                padding: 0.6rem 0.8rem;
                border: 1px solid rgba(34, 53, 42, 0.25);
                border-radius: 6px;
                outline: none;
                color: var(--ink);
                background: var(--white);
                transition: border-color 0.2s ease;
                font-family: inherit;
            }

            .chatbot-container .form-input:focus,
            .chatbot-container .form-select:focus,
            .chatbot-container .form-textarea:focus {
                border-color: var(--primary);
            }

            .chatbot-container .form-textarea {
                resize: vertical;
                min-height: 80px;
            }

            .chatbot-container .form-submit {
                padding: 0.8rem;
                background: var(--gradient-main);
                color: var(--ink);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
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
                background: var(--white);
                border: 1.5px dashed rgba(34, 53, 42, 0.22);
                border-radius: 10px;
                border-bottom-left-radius: 3px;
                max-width: 80px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--primary);
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
                background: var(--white);
                border-top: 1.5px dashed rgba(34, 53, 42, 0.2);
                display: flex;
                gap: 0.5rem;
            }

            .chatbot-input {
                flex: 1;
                padding: 0.6rem 1rem;
                border: 1px solid rgba(34, 53, 42, 0.25);
                border-radius: 20px;
                outline: none;
                color: var(--ink);
                background: var(--light);
                transition: border-color 0.2s ease;
            }

            .chatbot-input:focus {
                border-color: var(--primary);
            }

            .chatbot-send {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--gradient-main);
                border: none;
                color: var(--ink);
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
                background: #D97A63;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 0.65rem;
                font-weight: bold;
                color: var(--white);
                padding: 1px;
                border: 1.5px solid var(--dark-mid);
                box-shadow: 0 1px 3px rgba(8, 16, 12, 0.4);
                z-index: 1;
            }

            .favorites-indicator.active {
                display: flex;
            }

            .tip-card {
                background: rgba(227, 196, 104, 0.14);
                border: 1.5px dashed rgba(227, 196, 104, 0.5);
                padding: 1rem;
                border-radius: 8px;
                margin-top: 0.5rem;
            }

            .tip-card-icon {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .tip-card-text {
                color: var(--ink);
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
                    background: var(--white);
                    border-top: 1.5px dashed rgba(34, 53, 42, 0.2);
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
                        <div class="chatbot-avatar"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg></div>
                        <div>
                            <h3 class="chatbot-title">Guía Histórico</h3>
                            <p class="chatbot-subtitle">Historia y navegación matemática</p>
                        </div>
                    </div>
                    <div class="chatbot-header-actions">
                        <button class="chatbot-header-btn" id="favorites-btn" title="Favoritos">
                            <span style="position: relative;"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg></span>
                            <span class="favorites-indicator"></span>
                        </button>
                        <button class="chatbot-header-btn" id="refresh-btn" title="Nueva conversación">
                            <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" /></svg>
                        </button>
                        <button class="chatbot-header-btn" id="close-btn" title="Cerrar">
                            <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /> <path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-container">
                    <input type="text" class="chatbot-input" id="chatbot-input"
                           placeholder="Historia, periodos, búsqueda, navegación..." maxlength="200">
                    <button class="chatbot-send" id="chatbot-send">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /> <path d="m21.854 2.147-10.94 10.939" /></svg>
                    </button>
                </div>
            </div>
            <button class="chatbot-toggle" id="chatbot-toggle">
                <svg class="chatbot-toggle-icon" style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg>
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
                    <strong>¡Bienvenido! <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /> <path d="M22 10v6" /> <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg></strong><br>
                    Soy tu guía en la fascinante historia de las matemáticas. 
                    Puedo mostrarte cómo las matemáticas han evolucionado a través de las civilizaciones 
                    y ayudarte a navegar por el sitio.
                </div>
                <div class="quick-actions">
                    <button class="quick-action-chip" data-action="historia">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Historia General
                    </button>
                    <button class="quick-action-chip" data-action="periodos">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg> Por Periodos
                    </button>
                    <button class="quick-action-chip" data-action="buscar">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /></svg> Buscar
                    </button>
                    <button class="quick-action-chip" data-action="navegacion">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></svg> Navegar Sitio
                    </button>
                    <button class="quick-action-chip" data-action="tip">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /> <path d="M9 18h6" /> <path d="M10 22h4" /></svg> Tip Aleatorio
                    </button>
                    <button class="quick-action-chip" data-action="contacto">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /></svg> Contactar
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
                    <div class="tip-card-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /> <path d="M9 18h6" /> <path d="M10 22h4" /></svg></div>
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
            `<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16h.01" /> <path d="M12 8v4" /> <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" /></svg> <strong>No resuelvo ejercicios matemáticos.</strong><br>
            Mi función es compartir la fascinante historia de las matemáticas y ayudarte a navegar por el sitio. 
            Si necesitas ayuda con ejercicios, te sugiero contactar al profesor.`,
            
            `<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> <strong>Mi especialidad es la historia, no resolver problemas.</strong><br>
            Puedo contarte cómo diferentes civilizaciones desarrollaron métodos para resolver 
            ecuaciones similares a la tuya. ¿Te interesa?`,
            
            `<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /> <path d="M22 10v6" /> <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg> <strong>Para ejercicios, mejor contacta directamente al profesor.</strong><br>
            Mientras tanto, ¿sabías que el método que probablemente necesitas fue desarrollado 
            hace siglos? Te puedo contar su historia.`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        const html = `
            <div class="message-bubble">${response}</div>
            <div class="quick-actions">
                <button class="quick-action-chip" data-action="contacto">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /></svg> Contactar Profesor
                </button>
                <button class="quick-action-chip" data-action="historia">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Ver Historia
                </button>
                <button class="quick-action-chip" data-action="navegacion">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></svg> Recursos del Sitio
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
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></svg> Navegación del Sitio
                </div>
                <div class="nav-links">
                    <a href="${this.siteLinks.historia}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg></span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Historia de las Matemáticas</p>
                            <p class="nav-link-desc">Explora el desarrollo histórico</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.cienciaDatos}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg></span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Ciencia de Datos</p>
                            <p class="nav-link-desc">Análisis y visualización</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.robotica}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8" /> <rect width="16" height="12" x="4" y="8" rx="2" /> <path d="M2 14h2" /> <path d="M20 14h2" /> <path d="M15 13v2" /> <path d="M9 13v2" /></svg></span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Robótica</p>
                            <p class="nav-link-desc">Proyectos y programación</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.programacion}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /> <path d="M20.054 15.987H3.946" /></svg></span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Programación</p>
                            <p class="nav-link-desc">Código y algoritmos</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.ingenieria}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" /></svg></span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Ingeniería</p>
                            <p class="nav-link-desc">Diseño y construcción</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.olimpiadas}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2" /> <path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2" /> <path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3" /> <path d="M4 22h16" /> <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /> <path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3" /></svg></span>
                        <div class="nav-link-text">
                            <p class="nav-link-title">Olimpiadas</p>
                            <p class="nav-link-desc">Competencias matemáticas</p>
                        </div>
                    </a>
                    <a href="${this.siteLinks.labExperimentos}" class="nav-link">
                        <span class="nav-link-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" /> <path d="M8.5 2h7" /> <path d="M14.5 16h-5" /></svg></span>
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
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Historia de las Matemáticas
                </div>
                <p>Las matemáticas han sido el lenguaje universal de la humanidad, 
                evolucionando desde simples marcas de conteo hasta la teoría de cuerdas.</p>
                <div class="quick-actions">
                    <button class="quick-action-chip" data-action="periodos">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg> Explorar por Periodo
                    </button>
                    <button class="quick-action-chip" data-action="buscar">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /></svg> Buscar Tema
                    </button>
                    <button class="quick-action-chip" data-action="timeline">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14" /> <path d="M5 2h14" /> <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /> <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg> Línea de Tiempo
                    </button>
                    <button class="quick-action-chip" data-action="random_period">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Periodo Aleatorio
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
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg> Periodos Históricos
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
            'Prehistoria': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" /></svg>',
            'Mesopotamia': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg>',
            'Egipto Antiguo': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg>',
            'Grecia Clásica': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg>',
            'India': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14" /> <path d="m18.065 8.496-12.125 7" /> <path d="m5.94 8.504 12.125 7" /></svg>',
            'China': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12v6" /> <path d="M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z" /> <path d="M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" /></svg>',
            'Mundo Islámico': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>',
            'Europa Medieval': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5V3" /> <path d="M14 5V3" /> <path d="M15 21v-3a3 3 0 0 0-6 0v3" /> <path d="M18 3v8" /> <path d="M18 5H6" /> <path d="M22 11H2" /> <path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9" /> <path d="M6 3v8" /></svg>',
            'Renacimiento': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg>',
            'Siglo XVII': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8" /> <path d="M3 22h18" /> <path d="M14 22a7 7 0 1 0 0-14h-1" /> <path d="M9 14h2" /> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>',
            'Siglo XVIII': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></svg>',
            'Siglo XIX': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" /> <path d="m9 15-1-1" /> <path d="m15 15 1-1" /> <path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" /> <path d="m8 19-2 3" /> <path d="m16 19 2 3" /></svg>',
            'Siglo XX': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /> <path d="M20.054 15.987H3.946" /></svg>',
            'Siglo XXI': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8" /> <rect width="16" height="12" x="4" y="8" rx="2" /> <path d="M2 14h2" /> <path d="M20 14h2" /> <path d="M15 13v2" /> <path d="M9 13v2" /></svg>',
            'América Precolombina': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8" /> <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /> <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /></svg>',
            'África': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" /></svg>',
            'Oceanía': '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /> <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></svg>'
        };
        return emojis[period] || '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v16" /> <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" /></svg>';
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
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /> <path d="M12 5v14" /></svg> Más datos
                    </button>
                    <button class="quick-action-chip" data-action="favorite_period" data-payload="${period}">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg> Favorito
                    </button>
                    <button class="quick-action-chip" data-action="periodos">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg> Otros periodos
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
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /></svg> Buscar en Historia
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
                <div style="margin-top: 1rem; color: var(--ink-muted);">
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
                        <div style="margin-top: 0.5rem; color: var(--ink-muted); font-size: 0.85rem;">
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
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /></svg> Contactar al Profesor
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
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /></svg> Enviar Mensaje
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
                <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /> <path d="m9 11 3 3L22 4" /></svg> <strong>Abriendo tu cliente de correo...</strong><br>
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
                <div class="tip-card-icon"><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /> <path d="M9 18h6" /> <path d="M10 22h4" /></svg></div>
                <div class="tip-card-text">
                    ${tip}
                </div>
            </div>
            <div style="margin-top: 0.8rem; padding: 0.8rem; background: rgba(227, 196, 104, 0.1);
                        border-left: 3px solid var(--primary); border-radius: 0 6px 6px 0;">
                <em style="color: var(--ink-secondary); font-size: 0.9rem;">${quote}</em>
            </div>
            <div class="quick-actions">
                <button class="quick-action-chip" data-action="tip">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" /></svg> Otro tip
                </button>
                <button class="quick-action-chip" data-action="periodos">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg> Ver periodos
                </button>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    showFavorites() {
        const favorites = Array.from(this.favoriteTopics);
        if (favorites.length === 0) {
            this.addBotMessage('<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg> No tienes favoritos guardados aún. Explora los periodos y marca tus favoritos.', true);
            return;
        }
        
        const html = `
            <div class="message-bubble">
                <div class="message-card-title">
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg> Tus Favoritos
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
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14" /> <path d="M12 6v14" /> <path d="M8 8v12" /> <path d="M4 4v16" /></svg> Historia
                    </button>
                    <button class="quick-action-chip" data-action="periodos">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg> Periodos
                    </button>
                    <button class="quick-action-chip" data-action="buscar">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /></svg> Buscar
                    </button>
                    <button class="quick-action-chip" data-action="navegacion">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /> <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></svg> Navegación
                    </button>
                    <button class="quick-action-chip" data-action="contacto">
                        <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /></svg> Contacto
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
                    <svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14" /> <path d="M5 2h14" /> <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /> <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg> Línea de Tiempo Matemática
                </div>
                <div style="margin-top: 0.8rem; font-size: 0.9rem; line-height: 1.6;">
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" /></svg> <strong>35,000 a.C.</strong> - Primeras marcas de conteo</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg> <strong>1800 a.C.</strong> - Tablilla Plimpton 322</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg> <strong>1650 a.C.</strong> - Papiro Rhind</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7" /> <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /> <path d="M14 18v-7" /> <path d="M18 18v-7" /> <path d="M3 22h18" /> <path d="M6 18v-7" /></svg> <strong>300 a.C.</strong> - Elementos de Euclides</div>
                    <div>0 <strong>500 d.C.</strong> - Cero como número (India)</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg> <strong>820 d.C.</strong> - Al-Juarismi y el álgebra</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg> <strong>1202</strong> - Fibonacci introduce números árabes</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg> <strong>1637</strong> - Descartes: geometría analítica</div>
                    <div>∫ <strong>1675</strong> - Newton/Leibniz: cálculo</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" /></svg> <strong>1874</strong> - Cantor: teoría de conjuntos</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /> <path d="M20.054 15.987H3.946" /></svg> <strong>1936</strong> - Turing: computación teórica</div>
                    <div><svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8" /> <rect width="16" height="12" x="4" y="8" rx="2" /> <path d="M2 14h2" /> <path d="M20 14h2" /> <path d="M15 13v2" /> <path d="M9 13v2" /></svg> <strong>2020s</strong> - IA y machine learning</div>
                </div>
            </div>
        `;
        
        this.addBotMessage(html, false);
    }
    
    addToFavorites(period) {
        this.favoriteTopics.add(period);
        this.saveUserPreferences();
        this.updateFavoritesIndicator();
        
        this.addBotMessage(`<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg> "${period}" añadido a tus favoritos.`, true);
    }

    updateFavoritesIndicator() {
        const indicator = document.querySelector('.favorites-indicator');
        if (!indicator) return;

        if (this.favoriteTopics && this.favoriteTopics.size > 0) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
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
