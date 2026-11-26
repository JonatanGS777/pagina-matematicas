/*
 * Contador de visitas de la portada (v2, 26 nov. 2026).
 *
 * - Registra la visita con register_unique_visitor (el servidor valida y no
 *   cuenta recargas en menos de 30 min).
 * - Lee todo de get_visitor_summary: solo números agregados, nunca filas.
 * - El país sale de /api/geo (Vercel ya lo sabe; la IP no se guarda) o,
 *   si falla, de la zona horaria del navegador.
 * - No registra en localhost, con ?notrack ni en navegadores automatizados.
 * - Sin supabase-js: dos llamadas fetch a la API REST.
 */
(function () {
    'use strict';

    const CFG = window.SUPABASE_CONFIG || (typeof SUPABASE_CONFIG !== 'undefined' ? SUPABASE_CONFIG : null);
    const PAGINA = 'home';
    const REFRESCO_MS = 60000;

    const $ = (id) => document.getElementById(id);
    const lang = () => (localStorage.getItem('lang') === 'en' ? 'en' : 'es');
    const reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const TXT = {
        es: {
            cargando: 'Cargando datos',
            vivo: 'Se actualiza cada minuto',
            error: 'No se pudieron cargar los datos',
            desde: (f) => `desde el ${f}`,
            ahora: 'ahora',
            regresan: (n) => (n === 1 ? 'visitante ha vuelto' : 'visitantes han vuelto'),
            igual: 'igual',
            disp: { desktop: 'Computadora', mobile: 'Móvil', tablet: 'Tableta' },
            paisesNota: (k, t) => `Según ${k} de ${t} visitantes con país conocido`,
            sinPaises: 'Aún no hay datos de país',
            grafica: (m, n) => `${m}: ${n} visitas`,
            graficaTitulo: 'Visitas por mes en los últimos 12 meses'
        },
        en: {
            cargando: 'Loading data',
            vivo: 'Updates every minute',
            error: 'Could not load the data',
            desde: (f) => `since ${f}`,
            ahora: 'now',
            regresan: (n) => (n === 1 ? 'visitor has returned' : 'visitors have returned'),
            igual: 'same',
            disp: { desktop: 'Computer', mobile: 'Mobile', tablet: 'Tablet' },
            paisesNota: (k, t) => `Based on ${k} of ${t} visitors with a known country`,
            sinPaises: 'No country data yet',
            grafica: (m, n) => `${m}: ${n} visits`,
            graficaTitulo: 'Visits per month over the last 12 months'
        }
    };
    const t = () => TXT[lang()];
    const nf = () => new Intl.NumberFormat(lang() === 'en' ? 'en-US' : 'es-PR');

    let resumen = null;

    // ---------- API ----------
    async function rpc(fn, body) {
        const r = await fetch(`${CFG.url}/rest/v1/rpc/${fn}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: CFG.anonKey,
                Authorization: `Bearer ${CFG.anonKey}`
            },
            body: JSON.stringify(body || {})
        });
        if (!r.ok) throw new Error(`${fn}: ${r.status}`);
        const txt = await r.text();
        return txt ? JSON.parse(txt) : null;
    }

    // ---------- Registro ----------
    function debeRegistrar() {
        const h = location.hostname;
        if (location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '') return false;
        if (navigator.webdriver) return false;
        if (/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent)) return false;
        if (new URLSearchParams(location.search).has('notrack')) return false;
        return true;
    }

    function idVisitante() {
        let id = localStorage.getItem('visitor_id');
        if (!id || !/^visitor_\d{10,16}_[a-z0-9]{3,12}$/.test(id)) {
            id = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
            localStorage.setItem('visitor_id', id);
        }
        return id;
    }

    function dispositivo() {
        const ua = navigator.userAgent;
        if (/ipad|tablet|playbook|silk/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'tablet';
        if (/mobi|iphone|ipod|android/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    // Respaldo sin red: zonas horarias de la región más comunes
    const ZONAS = {
        'America/Puerto_Rico': 'PR', 'America/Santo_Domingo': 'DO', 'America/Mexico_City': 'MX',
        'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Caracas': 'VE', 'America/Santiago': 'CL',
        'America/Argentina/Buenos_Aires': 'AR', 'America/Guayaquil': 'EC', 'America/Panama': 'PA',
        'America/Costa_Rica': 'CR', 'America/Havana': 'CU', 'America/Sao_Paulo': 'BR',
        'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'Europe/Madrid': 'ES'
    };
    async function pais() {
        const guardado = sessionStorage.getItem('geo_pais');
        if (guardado) return guardado;
        let cc = null;
        try {
            const r = await fetch('/api/geo', { cache: 'no-store' });
            if (r.ok) cc = (await r.json()).country;
        } catch (_) { /* sin función de Vercel: se usa la zona horaria */ }
        if (!cc) {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            cc = ZONAS[tz] || (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana)/.test(tz) || tz === 'Pacific/Honolulu' ? 'US' : 'ZZ');
        }
        sessionStorage.setItem('geo_pais', cc);
        return cc;
    }

    async function registrar() {
        if (!debeRegistrar()) return;
        try {
            await rpc('register_unique_visitor', {
                visitor_uuid: idVisitante(),
                p_page_name: PAGINA,
                device: dispositivo(),
                country: await pais(),
                referrer_url: document.referrer || 'direct'
            });
            // Latido: mantiene «ahora» al día mientras la pestaña está visible
            setInterval(() => {
                if (!document.hidden) rpc('secure_update_last_visit', { p_visitor_id: idVisitante() }).catch(() => {});
            }, REFRESCO_MS);
        } catch (e) {
            console.warn('[visitas] no se pudo registrar la visita', e);
        }
    }

    // ---------- Pintar ----------
    function contar(el, valor) {
        if (!el) return;
        const fmt = nf();
        const desde = Number(el.dataset.v || 0);
        el.dataset.v = valor;
        if (reducido || desde === valor) { el.textContent = fmt.format(valor); return; }
        const t0 = performance.now(), dur = 900;
        const paso = (ahora) => {
            const k = Math.min(1, (ahora - t0) / dur);
            const e = 1 - Math.pow(1 - k, 3);
            el.textContent = fmt.format(Math.round(desde + (valor - desde) * e));
            if (k < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
    }

    function fechaLarga(iso) {
        const [y, m, d] = iso.split('-').map(Number);
        return new Intl.DateTimeFormat(lang() === 'en' ? 'en-US' : 'es-PR', { day: 'numeric', month: 'short', year: 'numeric' })
            .format(new Date(y, m - 1, d));
    }
    function mesCorto(ym) {
        const [y, m] = ym.split('-').map(Number);
        return new Intl.DateTimeFormat(lang() === 'en' ? 'en-US' : 'es-PR', { month: 'short' })
            .format(new Date(y, m - 1, 1)).replace('.', '').slice(0, 3);
    }
    function mesLargo(ym) {
        const [y, m] = ym.split('-').map(Number);
        return new Intl.DateTimeFormat(lang() === 'en' ? 'en-US' : 'es-PR', { month: 'long', year: 'numeric' })
            .format(new Date(y, m - 1, 1));
    }

    const SVG = 'http://www.w3.org/2000/svg';
    function el(tag, attrs, texto) {
        const n = document.createElementNS(SVG, tag);
        for (const k in attrs) n.setAttribute(k, attrs[k]);
        if (texto != null) n.textContent = texto;
        return n;
    }

    // Barras de tiza: relleno rayado, borde irregular (filtro) y el mes actual en dorado
    function graficaMeses(meses) {
        const svg = $('visitasMeses');
        if (!svg || !meses || !meses.length) return;
        const W = Math.max(280, svg.clientWidth || 600);
        const H = 190, top = 26, base = H - 28;
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.setAttribute('aria-label', t().graficaTitulo);
        svg.replaceChildren();

        const defs = el('defs', {});
        const f = el('filter', { id: 'tiza', x: '-5%', y: '-5%', width: '110%', height: '110%' });
        f.append(
            el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.8', numOctaves: '2', seed: '7', result: 'r' }),
            el('feDisplacementMap', { in: 'SourceGraphic', in2: 'r', scale: '2.6' })
        );
        const pat = el('pattern', { id: 'rayas', width: '6', height: '6', patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-35)' });
        pat.append(el('line', { x1: '0', y1: '0', x2: '0', y2: '6', class: 'tiza-raya' }));
        defs.append(f, pat);
        svg.append(defs);

        const max = Math.max(1, ...meses.map((m) => m.n));
        const n = meses.length, hueco = W / n, ancho = Math.min(38, hueco * 0.58);
        const chico = W < 460;
        const g = el('g', { filter: 'url(#tiza)' });
        const letras = el('g', {});
        g.append(el('line', { x1: 4, y1: base + 0.5, x2: W - 4, y2: base + 0.5, class: 'tiza-base' }));

        meses.forEach((m, i) => {
            const x = hueco * i + (hueco - ancho) / 2;
            const h = m.n === 0 ? 0 : Math.max(3, (m.n / max) * (base - top));
            const actual = i === n - 1;
            const barra = el('rect', {
                x: x.toFixed(1), y: (base - h).toFixed(1), width: ancho.toFixed(1), height: h.toFixed(1),
                class: 'tiza-barra' + (actual ? ' es-actual' : ''), style: `--i:${i}`
            });
            barra.append(el('title', {}, t().grafica(mesLargo(m.mes), nf().format(m.n))));
            g.append(barra);
            if (m.n > 0 && (!chico || actual || m.n === max)) {
                letras.append(el('text', { x: (x + ancho / 2).toFixed(1), y: (base - h - 7).toFixed(1), class: 'tiza-valor' + (actual ? ' es-actual' : '') }, nf().format(m.n)));
            }
            if (!chico || i % 2 === n % 2 || actual) {
                letras.append(el('text', { x: (x + ancho / 2).toFixed(1), y: H - 8, class: 'tiza-mes' + (actual ? ' es-actual' : '') }, mesCorto(m.mes)));
            }
        });
        svg.append(g, letras);
    }

    function lista(ul, filas) {
        ul.replaceChildren(...filas.map((f) => {
            const li = document.createElement('li');
            li.className = 'visitas-fila';
            const nombre = document.createElement('span');
            nombre.className = 'visitas-nombre';
            if (f.codigo) {
                const c = document.createElement('span');
                c.className = 'visitas-codigo';
                c.textContent = f.codigo;
                nombre.append(c);
            }
            nombre.append(document.createTextNode(f.nombre));
            const pct = document.createElement('span');
            pct.className = 'visitas-pct';
            pct.textContent = `${f.pct}%`;
            const barra = document.createElement('span');
            barra.className = 'visitas-barra';
            barra.setAttribute('aria-hidden', 'true');
            const relleno = document.createElement('span');
            relleno.style.width = `${f.pct}%`;
            barra.append(relleno);
            li.append(nombre, pct, barra);
            return li;
        }));
    }

    function pintar(s) {
        const tx = t();
        contar($('totalVisitors'), s.total || 0);
        $('visitasDesde').textContent = s.desde ? tx.desde(fechaLarga(s.desde)) : '';
        contar($('ult30'), s.ult30 || 0);
        contar($('visitsToday'), s.hoy || 0);
        contar($('pageViews'), s.vistas || 0);
        $('activeNow').textContent = nf().format(Math.max(s.activos || 0, debeRegistrar() ? 1 : 0));
        $('activeNowTxt').textContent = tx.ahora;
        $('regresan').textContent = nf().format(s.regresan || 0);
        $('regresanTxt').textContent = tx.regresan(s.regresan || 0);

        const cambio = $('ult30Cambio');
        if (s.prev30 > 0) {
            const pct = Math.round(((s.ult30 - s.prev30) / s.prev30) * 100);
            cambio.hidden = false;
            cambio.classList.toggle('positive', pct > 0);
            cambio.classList.toggle('negative', pct < 0);
            cambio.textContent = pct === 0 ? tx.igual : `${pct > 0 ? '+' : '−'}${Math.abs(pct)}%`;
        } else {
            cambio.hidden = true;
        }

        graficaMeses(s.meses);

        const d = s.dispositivos || {};
        const totD = (d.desktop || 0) + (d.mobile || 0) + (d.tablet || 0) || 1;
        lista($('visitasDispositivos'), ['desktop', 'mobile', 'tablet'].map((k) => ({
            nombre: tx.disp[k], pct: Math.round(((d[k] || 0) / totD) * 100)
        })));

        const paises = s.paises || [];
        const conocido = s.pais_conocido || 0;
        let nombres = null;
        try { nombres = new Intl.DisplayNames([lang()], { type: 'region' }); } catch (_) { /* navegador viejo */ }
        lista($('visitasPaises'), paises.map((p) => ({
            codigo: p.pais,
            nombre: nombres ? nombres.of(p.pais) : p.pais,
            pct: conocido ? Math.round((p.n / conocido) * 100) : 0
        })));
        $('visitasPaisesNota').textContent = paises.length
            ? tx.paisesNota(nf().format(conocido), nf().format(s.total || 0))
            : tx.sinPaises;

        $('visitasEstado').textContent = tx.vivo;
    }

    async function cargar() {
        try {
            resumen = await rpc('get_visitor_summary', { p_page: PAGINA });
            if (resumen) pintar(resumen);
        } catch (e) {
            console.warn('[visitas] no se pudo leer el resumen', e);
            if (!resumen) $('visitasEstado').textContent = t().error;
        }
    }

    function iniciar() {
        if (!$('modernStatsSection')) return;
        if (!CFG || !CFG.url || !CFG.anonKey) { $('visitasEstado').textContent = t().error; return; }
        $('visitasEstado').textContent = t().cargando;

        // Primero se registra y luego se lee, para que esta visita ya cuente
        registrar().finally(cargar);
        setInterval(() => { if (!document.hidden) cargar(); }, REFRESCO_MS);

        let espera;
        window.addEventListener('resize', () => {
            clearTimeout(espera);
            espera = setTimeout(() => resumen && graficaMeses(resumen.meses), 150);
        });
        document.addEventListener('i18n:langChange', () => resumen && pintar(resumen));
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
