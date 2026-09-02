// Inline Lucide icons for activity-feed notifications (replaces emoji)
const ANALYTICS_ICONS = {
    barChart: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /> <path d="M18 17V9" /> <path d="M13 17V5" /> <path d="M8 17v-3" /></svg>',
    calendar: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="M8 13h.01" /> <path d="M12 13h.01" /> <path d="M16 13h.01" /> <path d="M8 17h.01" /> <path d="M12 17h.01" /> <path d="M16 17h.01" /></svg>',
    smartphone: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /> <path d="M12 18h.01" /></svg>',
    monitor: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /> <line x1="8" x2="16" y1="21" y2="21" /> <line x1="12" x2="12" y1="17" y2="21" /></svg>',
    eye: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /> <circle cx="12" cy="12" r="3" /></svg>',
    download: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /> <path d="m7 10 5 5 5-5" /></svg>',
    click: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4.1 12 6" /> <path d="m5.1 8-2.9-.8" /> <path d="m6 12-1.9 2" /> <path d="M7.2 2.2 8 5.1" /> <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" /></svg>',
    share: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3" /> <circle cx="6" cy="12" r="3" /> <circle cx="18" cy="19" r="3" /> <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /> <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>',
    sparkles: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></svg>',
    settings: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" /></svg>',
    partyPopper: '<svg style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79" /> <path d="M4 3h.01" /> <path d="M22 8h.01" /> <path d="M15 2h.01" /> <path d="M22 20h.01" /> <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" /> <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" /> <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" /> <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" /></svg>'
};

class SupabaseAnalytics {
    constructor() {
        // ✅ CREDENCIALES CONFIGURADAS
        this.SUPABASE_URL = SUPABASE_CONFIG.url;
        this.SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey;
        
        this.supabase = null;
        this.visitorId = null;
        this.isActive = true;
        this.realtimeChannel = null;
        this.heartbeatInterval = null;
        this.activityTimeout = null;
        this.isSupabaseConfigured = false;
        this.selectedDevice = 'mobile';
        this.devicePercentages = [100, 0, 0];
        
        // 🆕 SLUG DINÁMICO POR PÁGINA
        this.currentPage = this.getCurrentSlug();
        
        // Prevenir conflictos con otros sistemas de contadores
        this.lockCounterElements();
        
        this.init();
    }

    // 🆕 DETECTAR PÁGINA ACTUAL DINÁMICAMENTE
    getCurrentSlug() {
        let path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html') || path === '') return 'home';
        
        const segments = path.split('/').filter(Boolean);
        const last = segments.pop() || 'home';
        
        return last.replace(/\.(html?|php)$/i, '').toLowerCase();
    }

    lockCounterElements() {
        const counterElements = [
            'totalVisitors', 'activeNow', 'visitsToday',
            'pageViews', 'dailyGrowth', 'todayChange'
        ];
        
        counterElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('data-controlled-by', 'supabase-analytics');
                element.setAttribute('data-locked', 'true');
            }
        });
        
        console.log('🔒 Elementos de contador bloqueados para Supabase Analytics');
    }

    async init() {
        try {
            if (typeof window.supabase === 'undefined') {
                throw new Error('Supabase no está cargado');
            }

            if (this.SUPABASE_URL === 'TU_SUPABASE_URL' || this.SUPABASE_ANON_KEY === 'TU_SUPABASE_ANON_KEY') {
                throw new Error('Credenciales de Supabase no configuradas');
            }
            
            this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
            this.isSupabaseConfigured = true;
            
            this.visitorId = this.getOrCreateVisitorId();
            
            await this.setupTracking();
            this.setupRealtime();
            await this.loadInitialData();
            this.setupEventListeners();
            
            console.log(`✅ Supabase Analytics inicializado. Página: ${this.currentPage}. Modo: PRODUCCIÓN`);
            
        } catch (error) {
            console.error('❌ Error inicializando Supabase Analytics:', error);
            this.fallbackToSimulatedData();
        }
    }

    getOrCreateVisitorId() {
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitor_id', visitorId);
        }
        return visitorId;
    }

    async setupTracking() {
        try {
            const deviceType = this.getDeviceType();
            const countryCode = await this.getCountryCode();
            const referrer = document.referrer || 'direct';

            const { data, error } = await this.supabase
                .rpc('register_unique_visitor', {
                    visitor_uuid: this.visitorId,
                     p_page_name: this.currentPage, 
                    device: deviceType,
                    country: countryCode,
                    referrer_url: referrer
                });

            if (error) throw error;

            await this.logActivity('page_view', {
                page: this.currentPage, // 🔄 DINÁMICO
                device: deviceType,
                timestamp: new Date().toISOString()
            });

            this.startHeartbeat();

        } catch (error) {
            console.error('Error en setup tracking:', error);
        }
    }

    // 🔄 REALTIME MEJORADO con daily_stats y unique_visitors
    async setupRealtime() {
    try {
        const today = new Date().toISOString().slice(0, 10);

        this.realtimeChannel = this.supabase
            .channel('analytics_updates')

            // 1. Analytics SOLO de la página actual
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'analytics',
                    filter: `page_slug=eq.${this.currentPage}`
                }, 
                (payload) => this.handleRealtimeUpdate(payload)
            )

            // 2. Daily stats SOLO de hoy y de la página actual
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'daily_stats',
                    filter: `date=eq.${today},page_slug=eq.${this.currentPage}`
                }, 
                (payload) => this.handleDailyStatsUpdate(payload)
            )

            // 3. Actividades SOLO de la página actual
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'realtime_activity',
                    filter: `page_slug=eq.${this.currentPage}`
                }, 
                (payload) => this.handleActivityUpdate(payload)
            )

            // 4. Nuevos visitantes que incluyan esta página
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'unique_visitors'
                }, 
                (payload) => {
                    const visitor = payload.new;
                    if (visitor.pages_visited?.includes(this.currentPage)) {
                        this.handleNewVisitor(payload);
                    }
                }
            )

            .subscribe();

    } catch (error) {
        console.error('Error configurando realtime:', error);
    }
}


    // 🔄 CARGA INICIAL MEJORADA con slug dinámico
    async loadInitialData() {
        try {
            // Analytics por página
            const { data: analytics, error: analyticsError } = await this.supabase
                .from('analytics')
                .select('*')
                .eq('page_slug', this.currentPage) // 🔄 DINÁMICO
                .maybeSingle(); // ✅ maybeSingle: no lanza error si no existe fila

            if (analyticsError) throw analyticsError;

            // Daily stats por página y fecha
            const today = new Date().toISOString().split('T')[0];
            const { data: dailyStats, error: dailyError } = await this.supabase
                .from('daily_stats')
                .select('*')
                .eq('date', today)
                .eq('page_slug', this.currentPage) // 🔄 DINÁMICO
                .maybeSingle(); // ✅ maybeSingle: no lanza error si no existe fila hoy

            // Usuarios activos (últimos 15 minutos)
            const { data: activeUsers, error: activeError } = await this.supabase
                .from('unique_visitors')
                .select('visitor_id')
                .contains('pages_visited', [this.currentPage]) // 🔄 DINÁMICO
                .gte('last_visit', new Date(Date.now() - 15 * 60 * 1000).toISOString());

            const activeCount = activeUsers ? activeUsers.length : analytics?.active_users || 0;

            // Actualizar UI
            this.updateUI({
                totalVisitors: analytics?.visitor_count || 0,
                activeNow: activeCount,
                visitsToday: dailyStats?.total_visitors || analytics?.daily_visits || 0,
                pageViews: analytics?.page_views || 0,
                avgSession: analytics?.avg_session_time || 0,
                dailyGrowth: this.calculateGrowth(dailyStats),
                todayChange: dailyStats?.new_visitors || 0
            });

            // 🆕 CARGAR DESGLOSES DE DISPOSITIVOS Y PAÍSES
            await this.fetchBreakdowns();

        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            this.fallbackToSimulatedData();
        }
    }

    // 🔄 HANDLER MEJORADO con visitsToday
    handleRealtimeUpdate(payload) {
        console.log('📈 Analytics update:', payload);
        
        if (payload.new && payload.new.page_slug === this.currentPage) {
            const newData = payload.new;
            
            // Contadores principales
            this.animateCounter('totalVisitors', newData.visitor_count);
            this.animateCounter('pageViews', newData.page_views);
            this.animateCounter('activeNow', newData.active_users);
            this.animateCounter('avgSession', parseFloat(newData.avg_session_time || 0).toFixed(1));
            
            // 🆕 AGREGAR VISITAS HOY desde daily_visits
            if (newData.daily_visits !== undefined) {
                this.animateCounter('visitsToday', newData.daily_visits);
            }
            
            this.updateLastUpdateTime();
            this.showActivityNotification('Estadísticas actualizadas en tiempo real', ANALYTICS_ICONS.barChart);
        }
    }

    // 🆕 HANDLER PARA DAILY STATS
    handleDailyStatsUpdate(payload) {
        console.log('📅 Daily stats update:', payload);
        
        if (payload.new && payload.new.page_slug === this.currentPage) {
            const ds = payload.new;
            
            this.animateCounter('visitsToday', ds.total_visitors || 0);
            document.getElementById('todayChange').textContent = `+${ds.new_visitors || 0}`;
            document.getElementById('dailyGrowth').textContent = this.calculateGrowth(ds).toFixed(1);
            
            this.updateLastUpdateTime();
            this.showActivityNotification('Estadísticas diarias actualizadas', ANALYTICS_ICONS.calendar);
        }
    }

    // 🆕 HANDLER PARA NUEVOS VISITANTES
    handleNewVisitor(payload) {
        const visitor = payload.new;
        if (visitor.pages_visited && visitor.pages_visited.includes(this.currentPage)) {
            // Refrescar desgloses cuando hay nuevo visitante en esta página
            this.fetchBreakdowns();
            
            const deviceIcon = {
                'mobile': ANALYTICS_ICONS.smartphone,
                'tablet': ANALYTICS_ICONS.smartphone,
                'desktop': ANALYTICS_ICONS.monitor
            };

            const icon = deviceIcon[visitor.device_type] || ANALYTICS_ICONS.monitor;
            this.showActivityNotification(`Nuevo visitante desde ${visitor.country_code || 'desconocido'}`, icon);
        }
    }

    handleActivityUpdate(payload) {
        const activity = payload.new;
        const activityMessages = {
            'page_view': ['Nueva página vista', ANALYTICS_ICONS.eye],
            'download': ['Descarga de material', ANALYTICS_ICONS.download],
            'interaction': ['Nueva interacción', ANALYTICS_ICONS.click],
            'share': ['Contenido compartido', ANALYTICS_ICONS.share]
        };

        const [message, icon] = activityMessages[activity.activity_type] || ['Nueva actividad', ANALYTICS_ICONS.sparkles];
        this.showActivityNotification(message, icon);
    }

    // 🆕 OBTENER DESGLOSES DE DISPOSITIVOS Y PAÍSES
    async fetchBreakdowns() {
        try {
            // Dispositivos hoy
            const { data: devices, error: devError } = await this.supabase
                .rpc('get_device_breakdown', { page_name: this.currentPage });
            
            // Países últimos 30 días
            const { data: countries, error: geoError } = await this.supabase
                .rpc('get_country_breakdown', { page_name: this.currentPage, days: 30 });

            if (devError) console.error('Error devices:', devError);
            if (geoError) console.error('Error countries:', geoError);

            this.renderDevices(devices || []);
            this.renderCountries(countries || []);

        } catch (error) {
            console.error('Error fetching breakdowns:', error);
        }
    }

    // 🆕 RENDERIZAR DISPOSITIVOS
    renderDevices(rows) {
        const total = rows.reduce((sum, row) => sum + parseInt(row.visitas), 0) || 1;
        
        const getPercentage = (device) => {
            const found = rows.find(r => r.device === device);
            return Math.round(100 * (found ? parseInt(found.visitas) : 0) / total);
        };

        // Actualizar porcentajes
        const mobilePct = getPercentage('mobile');
        const desktopPct = getPercentage('desktop');
        const tabletPct = getPercentage('tablet');
        this.devicePercentages = [mobilePct, desktopPct, tabletPct];

        // Actualizar stats de dispositivos
        document.querySelectorAll('.device-stat').forEach(stat => {
            const device = stat.dataset.device;
            const counterEl = stat.querySelector('.counter');
            
            if (counterEl) {
                switch(device) {
                    case 'mobile':
                        counterEl.textContent = mobilePct;
                        break;
                    case 'desktop':
                        counterEl.textContent = desktopPct;
                        break;
                    case 'tablet':
                        counterEl.textContent = tabletPct;
                        break;
                }
            }
        });

        // Actualizar gráfico simplificado respetando selección actual
        const activeBtn = document.querySelector('.device-btn.active');
        this.selectedDevice = activeBtn?.dataset.device || this.selectedDevice || 'mobile';
        this.updateDeviceChart(this.devicePercentages, this.selectedDevice);
    }

    // 🆕 RENDERIZAR PAÍSES
    renderCountries(rows) {
        const countriesList = document.querySelector('.countries-list');
        if (!countriesList) return;

        // Diccionario de países (simplificado)
        const countryNames = {
            'PR': 'Puerto Rico', 'US': 'Estados Unidos', 'ES': 'España', 
            'MX': 'México', 'AR': 'Argentina', 'CO': 'Colombia',
            'ZZ': 'Desconocido'
        };

        const countryFlags = {
            'PR': '🇵🇷', 'US': '🇺🇸', 'ES': '🇪🇸', 'MX': '🇲🇽',
            'AR': '🇦🇷', 'CO': '🇨🇴', 'ZZ': '🏳️'
        };

        const total = rows.reduce((sum, row) => sum + parseInt(row.visitas), 0) || 1;

        // Tomar top 4 países
        const topCountries = rows.slice(0, 4);
        
        // Actualizar cada item de país
        const countryItems = countriesList.querySelectorAll('.country-item');
        
        countryItems.forEach((item, index) => {
            const country = topCountries[index];
            const flag = item.querySelector('.flag');
            const nameEl = item.querySelector('.country-name');
            const pctEl = item.querySelector('.country-percentage');
            const barFill = item.querySelector('.bar-fill');

            if (country) {
                const code = country.country;
                const visitas = parseInt(country.visitas);
                const percentage = Math.round(100 * visitas / total);

                flag.textContent = countryFlags[code] || '🏳️';
                nameEl.textContent = countryNames[code] || code;
                pctEl.textContent = `${percentage}%`;
                barFill.style.width = `${percentage}%`;
            } else {
                // Sin datos
                flag.textContent = '🏳️';
                nameEl.textContent = 'Sin datos';
                pctEl.textContent = '0%';
                barFill.style.width = '0%';
            }
        });
    }

    async logActivity(activityType, details = {}) {
        try {
            await this.supabase
                .rpc('log_realtime_activity', {
                    activity_name: activityType,
                    page_name: this.currentPage, // 🔄 DINÁMICO
                    activity_details: details
                });
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    startHeartbeat() {
        this.heartbeatInterval = setInterval(async () => {
            if (this.isActive && !document.hidden) {
                if (!this.checkSystemIntegrity()) {
                    console.log('🛠️ Sistema reparado automáticamente');
                }
                
                try {
                    if (this.isSupabaseConfigured && this.supabase) {
                        // Usuarios activos por página
                        const { data: activeUsers } = await this.supabase
                            .from('unique_visitors')
                            .select('visitor_id')
                            .contains('pages_visited', [this.currentPage]) // 🔄 DINÁMICO
                            .gte('last_visit', new Date(Date.now() - 15 * 60 * 1000).toISOString());
                        
                        const activeCount = activeUsers ? activeUsers.length : 1;
                        
                        // ✅ Ahora (más seguro)
                        await this.supabase.rpc('secure_update_last_visit', { p_visitor_id: this.visitorId });
                        await this.supabase.rpc('secure_update_active_users', { p_page: this.currentPage });

                    }
                        
                } catch (error) {
                    console.error('Error en heartbeat:', error);
                }
            }
        }, 30000);
    }

    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }

    // 🔄 PAÍS CON FALLBACK CORRECTO
    async getCountryCode() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return data.country_code || 'ZZ'; // 🔄 CAMBIO DE 'PR' A 'ZZ'
        } catch (error) {
            return 'ZZ'; // 🔄 DESCONOCIDO, NO 'PR'
        }
    }

    calculateGrowth(dailyStats) {
        if (!dailyStats) return 0;
        const total = dailyStats.total_visitors || 0;
        const new_visitors = dailyStats.new_visitors || 0;
        return total > 0 ? ((new_visitors / total) * 100) : 0;
    }

    updateUI(data) {
        this.animateCounter('totalVisitors', data.totalVisitors || 0);
        this.animateCounter('activeNow', data.activeNow || 0);
        this.animateCounter('visitsToday', data.visitsToday || 0);
        this.animateCounter('pageViews', data.pageViews || 0);

        document.getElementById('dailyGrowth').textContent = parseFloat(data.dailyGrowth || 0).toFixed(1);
        document.getElementById('todayChange').textContent = `+${data.todayChange || 0}`;

        this.updateActiveChart(data.activeNow || 0);
        this.updateLastUpdateTime();
        this.updateProgressBar();
    }

    getDevicePercentagesFromDom() {
        const getFromStat = (device) => {
            const node = document.querySelector(`.device-stat[data-device="${device}"] .counter`);
            return Number.parseInt(node?.textContent || '0', 10) || 0;
        };

        return [getFromStat('mobile'), getFromStat('desktop'), getFromStat('tablet')];
    }

    drawRoundedBar(ctx, x, y, width, height, radius = 8) {
        const safeHeight = Math.max(0, height);
        const safeRadius = Math.min(radius, width / 2, safeHeight / 2);

        ctx.beginPath();
        ctx.moveTo(x, y + safeHeight);
        ctx.lineTo(x, y + safeRadius);
        ctx.quadraticCurveTo(x, y, x + safeRadius, y);
        ctx.lineTo(x + width - safeRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
        ctx.lineTo(x + width, y + safeHeight);
        ctx.closePath();
    }

    updateDeviceChart(percentages, selectedDevice = this.selectedDevice) {
        const canvas = document.getElementById('deviceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const values = (Array.isArray(percentages) && percentages.length === 3
            ? percentages
            : this.getDevicePercentagesFromDom())
            .map((value) => {
                const number = Number(value) || 0;
                return Math.max(0, Math.min(100, Math.round(number)));
            });

        const deviceOrder = ['mobile', 'desktop', 'tablet'];
        const shortLabels = { mobile: 'MOB', desktop: 'PC', tablet: 'TAB' };
        const palette = {
            mobile: { strong: '#8FB8D6', soft: 'rgba(143, 184, 214, 0.28)' },
            desktop: { strong: '#E3C468', soft: 'rgba(227, 196, 104, 0.26)' },
            tablet: { strong: '#D97A63', soft: 'rgba(217, 122, 99, 0.28)' }
        };

        const activeIndex = Math.max(0, deviceOrder.indexOf(selectedDevice || 'mobile'));
        const chartArea = { left: 8, right: 8, top: 12, bottom: 20 };
        const plotWidth = canvas.width - chartArea.left - chartArea.right;
        const plotHeight = canvas.height - chartArea.top - chartArea.bottom;
        const slotWidth = plotWidth / deviceOrder.length;
        const barWidth = Math.min(34, slotWidth * 0.56);

        // Rejilla de referencia
        ctx.strokeStyle = 'rgba(34, 53, 42, 0.14)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = chartArea.top + (plotHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(canvas.width - chartArea.right, y);
            ctx.stroke();
        }

        deviceOrder.forEach((device, index) => {
            const pct = values[index];
            const x = chartArea.left + index * slotWidth + (slotWidth - barWidth) / 2;
            const rawHeight = (pct / 100) * plotHeight;
            const barHeight = pct > 0 ? Math.max(4, rawHeight) : 0;
            const y = chartArea.top + plotHeight - barHeight;
            const isActive = index === activeIndex;
            const colors = palette[device];

            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            if (isActive) {
                gradient.addColorStop(0, '#E8FFF9');
                gradient.addColorStop(0.2, colors.strong);
                gradient.addColorStop(1, colors.strong);
            } else {
                gradient.addColorStop(0, 'rgba(255,255,255,0.55)');
                gradient.addColorStop(1, colors.soft);
            }

            this.drawRoundedBar(ctx, x, y, barWidth, barHeight, 8);
            ctx.fillStyle = gradient;
            ctx.fill();

            if (isActive) {
                ctx.strokeStyle = colors.strong;
                ctx.lineWidth = 1.5;
                this.drawRoundedBar(ctx, x, y, barWidth, barHeight, 8);
                ctx.stroke();
            }

            ctx.textAlign = 'center';
            ctx.font = '700 9px "JetBrains Mono", monospace';
            ctx.fillStyle = isActive ? '#22352A' : 'rgba(34, 53, 42, 0.7)';
            ctx.fillText(`${pct}%`, x + (barWidth / 2), Math.max(10, y - 4));

            ctx.font = '700 8px "Karla", sans-serif';
            ctx.fillStyle = isActive ? '#3A4A3E' : 'rgba(60, 75, 64, 0.75)';
            ctx.fillText(shortLabels[device], x + (barWidth / 2), canvas.height - 5);
        });
    }

    // Sparkline para visitantes activos
    updateActiveChart(currentValue) {
        const canvas = document.getElementById('activeChart');
        if (!canvas) return;

        if (!this._activeHistory) this._activeHistory = [];
        this._activeHistory.push(Number(currentValue) || 0);
        if (this._activeHistory.length > 20) this._activeHistory.shift();

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = this._activeHistory;
        if (data.length < 2) return;

        const max = Math.max(...data, 1);
        const w = canvas.width;
        const h = canvas.height;
        const stepX = w / (data.length - 1);

        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'rgba(143, 184, 214, 0.4)');
        gradient.addColorStop(1, 'rgba(143, 184, 214, 0)');

        ctx.beginPath();
        data.forEach((v, i) => {
            const x = i * stepX;
            const y = h - (v / max) * (h - 4) - 2;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        // Cerrar área de relleno
        ctx.lineTo((data.length - 1) * stepX, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Línea encima
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = i * stepX;
            const y = h - (v / max) * (h - 4) - 2;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#5F97BE';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    animateCounter(elementId, targetValue, animate = true) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (element.getAttribute('data-controlled-by') !== 'supabase-analytics') {
            console.warn(`⚠️ Elemento ${elementId} no está bajo control de Supabase Analytics`);
            this.lockCounterElements();
            return;
        }

        const counter = element.querySelector('.counting-number') || element;
        const currentValue = parseInt(counter.textContent.replace(/,/g, '')) || 0;
        
        if (animate && Math.abs(targetValue - currentValue) > 0) {
            counter.classList.add('updating');
            setTimeout(() => counter.classList.remove('updating'), 600);
        }

        const duration = animate ? 1000 : 0;
        const steps = 20;
        const stepValue = (targetValue - currentValue) / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const value = Math.round(currentValue + (stepValue * currentStep));
            
            if (typeof targetValue === 'string' && targetValue.includes('.')) {
                counter.textContent = value.toFixed(1);
            } else {
                counter.textContent = value.toLocaleString();
            }

            if (currentStep >= steps) {
                clearInterval(timer);
                if (typeof targetValue === 'string' && targetValue.includes('.')) {
                    counter.textContent = parseFloat(targetValue).toFixed(1);
                } else {
                    counter.textContent = targetValue.toLocaleString();
                }
            }
        }, stepDuration);
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-PR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        document.getElementById('lastUpdate').textContent = timeString;
    }

    updateProgressBar() {
        const hour = new Date().getHours();
        const dailyProgress = (hour / 24) * 100;
        document.getElementById('dailyProgress').style.width = `${dailyProgress}%`;
    }

    showActivityNotification(message, iconSvg) {
        const icon = iconSvg || '<svg class="pulse-dot-small" style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.32em;flex-shrink:0;display:inline-block;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /></svg>';
        const notification = document.createElement('div');
        notification.className = 'activity-notification';
        notification.innerHTML = `
            <div class="activity-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    setupEventListeners() {
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (this.isActive) {
                this.logActivity('tab_focus');
            } else {
                this.logActivity('tab_blur');
            }
        });

        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', () => {
                this.logActivity('link_click', {
                    url: link.href,
                    text: link.textContent.trim()
                });
            });
        });

        document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]').forEach(link => {
            link.addEventListener('click', () => {
                this.logActivity('download', {
                    file: link.href,
                    name: link.textContent.trim()
                });
            });
        });

        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.device-stat').forEach(s => s.classList.remove('active'));
                
                btn.classList.add('active');
                const device = btn.dataset.device;
                const stat = document.querySelector(`.device-stat[data-device="${device}"]`);
                if (stat) stat.classList.add('active');

                this.selectedDevice = device || 'mobile';
                const percentages = this.devicePercentages?.length === 3
                    ? this.devicePercentages
                    : this.getDevicePercentagesFromDom();
                this.updateDeviceChart(percentages, this.selectedDevice);
            });
        });
    }

    fallbackToSimulatedData() {
        console.log('🔄 Modo FALLBACK: Supabase no configurado. Usando datos simulados');

        this.setupEventListeners();
        this.lockCounterElements();
        
        const initialData = {
            totalVisitors: 0,
            activeNow: 0,
            visitsToday: 0,
            pageViews: 0,
            avgSession: 0,
            dailyGrowth: 0,
            todayChange: 0
        };
        
        this.updateUI(initialData);
        this.showActivityNotification('Sistema iniciado. Modo de demostración', ANALYTICS_ICONS.settings);
        
        setTimeout(() => {
            const firstVisitData = {
                totalVisitors: 1,
                activeNow: 1,
                visitsToday: 1,
                pageViews: 1,
                avgSession: 0.1,
                dailyGrowth: 100,
                todayChange: 1
            };
            
            this.updateUI(firstVisitData);
            this.showActivityNotification('¡Primera visita registrada! (Demo)', ANALYTICS_ICONS.partyPopper);
        }, 5000);
    }

    checkSystemIntegrity() {
        const counterElements = [
            'totalVisitors', 'activeNow', 'visitsToday',
            'pageViews', 'dailyGrowth', 'todayChange'
        ];
        
        let integrityOk = true;
        
        counterElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element || element.getAttribute('data-controlled-by') !== 'supabase-analytics') {
                console.warn(`⚠️ Pérdida de control detectada en elemento: ${id}`);
                integrityOk = false;
            }
        });
        
        if (!integrityOk) {
            console.log('🔒 Restaurando control de elementos...');
            this.lockCounterElements();
        }
        
        return integrityOk;
    }

    destroy() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        if (this.realtimeChannel) {
            this.supabase.removeChannel(this.realtimeChannel);
        }

        const counterElements = [
            'totalVisitors', 'activeNow', 'visitsToday',
            'pageViews', 'dailyGrowth', 'todayChange'
        ];
        
        counterElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.removeAttribute('data-controlled-by');
                element.removeAttribute('data-locked');
            }
        });
        
        console.log('🔓 Control de elementos liberado');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.VisitorCounter) {
        console.warn('⚠️ Detectado sistema de contador antiguo. DESHABILITADO automáticamente');
        window.VisitorCounter = null;
    }
    
    const requiredElements = [
        'totalVisitors', 'activeNow', 'visitsToday',
        'pageViews', 'dailyGrowth', 'todayChange'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('❌ Elementos de contador faltantes:', missingElements);
        return;
    }
    
    console.log('🚀 Iniciando Supabase Analytics como sistema EXCLUSIVO de contadores');
    window.supabaseAnalytics = new SupabaseAnalytics();
});

window.addEventListener('beforeunload', () => {
    if (window.supabaseAnalytics) {
        window.supabaseAnalytics.destroy();
    }
});
