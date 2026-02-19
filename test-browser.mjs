/**
 * test-browser.mjs
 * Prueba manual automatizada con Puppeteer — Math Arena
 * Abre 2 pestañas, crea sala, se une, juega y toma screenshots
 *
 * Uso: node test-browser.mjs
 */
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';

const URL       = 'http://localhost:8080/lab/juegos.html';
const SHOTS_DIR = './screenshots';
mkdirSync(SHOTS_DIR, { recursive: true });

let shotN = 0;
const shot = async (page, name) => {
    const file = `${SHOTS_DIR}/${String(++shotN).padStart(2,'0')}-${name}.png`;
    await page.screenshot({ path: file, fullPage: false });
    console.log(`  📸 ${file}`);
    return file;
};

const wait = ms => new Promise(r => setTimeout(r, ms));

const C = {
    reset:'\x1b[0m', bold:'\x1b[1m',
    cyan:'\x1b[36m',  yellow:'\x1b[33m',
    green:'\x1b[32m', red:'\x1b[31m',
    gray:'\x1b[90m',
};
const log = (tag, msg, c = C.gray) =>
    console.log(`${c}[${String(tag).padEnd(14)}]${C.reset} ${msg}`);

const results = [];
const check = (name, ok, detail = '') => {
    results.push({ name, ok, detail });
    log(ok ? '✅ PASS' : '❌ FAIL', `${name}${detail ? '  →  ' + detail : ''}`, ok ? C.green : C.red);
};

async function main() {
    console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════╗`);
    console.log(`║  🎮  MATH ARENA — Prueba en Navegador (Puppeteer) ║`);
    console.log(`╚══════════════════════════════════════════════════╝${C.reset}\n`);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-web-security'],
        protocolTimeout: 60000,
    });

    /* ─────────────────────────────────────────
       Jugador 1 — HOST
    ───────────────────────────────────────── */
    log('Navegador', 'Abriendo pestaña HOST…', C.cyan);
    const p1 = await browser.newPage();
    await p1.goto(URL, { waitUntil: 'networkidle0' });

    // 1. Pantalla de bienvenida visible
    const welcomeVisible = await p1.$eval('#scr-welcome', el => el.classList.contains('on'));
    check('Pantalla bienvenida', welcomeVisible, 'scr-welcome.on = true');
    await shot(p1, 'host-bienvenida');

    // 2. Conexión al servidor
    await wait(1500);
    const connStatus = await p1.$eval('#conn-badge', el => el.className);
    check('Conexión servidor', connStatus.includes('connected'), `badge="${connStatus}"`);
    await shot(p1, 'host-conectado');

    // 3. Escribir nombre
    log('HOST', 'Escribiendo nombre "ProfeYonatan"…', C.yellow);
    await p1.click('#inp-name');
    await p1.type('#inp-name', 'ProfeYonatan', { delay: 60 });
    await shot(p1, 'host-nombre');

    // 4. Seleccionar dificultad "Medio"
    log('HOST', 'Seleccionando dificultad Medio…', C.yellow);
    await p1.click('[data-diff="medium"]');
    await wait(300);
    const diffActive = await p1.$eval('[data-diff="medium"]', el => el.classList.contains('active'));
    check('Dificultad seleccionada', diffActive, 'Medio activo');
    await shot(p1, 'host-dificultad');

    // 5. Click en CREAR SALA
    log('HOST', 'Haciendo click en CREAR SALA…', C.yellow);
    const t0 = Date.now();
    await p1.click('#btn-create');

    // Esperar pantalla lobby
    await p1.waitForFunction(
        () => document.getElementById('scr-lobby')?.classList.contains('on'),
        { timeout: 6000 }
    );
    const createMs = Date.now() - t0;
    check('Botón CREAR SALA', true, `Lobby cargó en ${createMs}ms`);
    await shot(p1, 'host-lobby');

    // 6. Leer código de sala
    const roomCode = await p1.$eval('#lobby-code', el => el.textContent.trim());
    check('Código de sala generado', /^[A-Z0-9]{6}$/.test(roomCode), `código="${roomCode}"`);
    log('HOST', `Código de sala: ${C.bold}${C.yellow}${roomCode}${C.reset}`, C.cyan);

    // 7. Botón INICIAR deshabilitado (solo 1 jugador)
    const startDisabled = await p1.$eval('#btn-start', el => el.disabled);
    check('Iniciar deshabilitado con 1 jugador', startDisabled, 'necesita ≥2 jugadores');

    /* ─────────────────────────────────────────
       Jugador 2 — GUEST
    ───────────────────────────────────────── */
    log('Navegador', 'Abriendo pestaña GUEST…', C.cyan);
    const p2 = await browser.newPage();
    await p2.goto(URL, { waitUntil: 'networkidle0' });
    await wait(1200);
    await shot(p2, 'guest-bienvenida');

    // 8. Nombre del guest
    await p2.click('#inp-name');
    await p2.type('#inp-name', 'Estudiante01', { delay: 60 });

    // 9. Click UNIRSE
    log('GUEST', 'Click en UNIRSE…', C.yellow);
    await p2.click('#btn-join-go');
    await p2.waitForFunction(
        () => document.getElementById('scr-join')?.classList.contains('on'),
        { timeout: 4000 }
    );
    check('Pantalla UNIRSE', true, 'scr-join visible');
    await shot(p2, 'guest-pantalla-unirse');

    // 10. Ingresar código
    log('GUEST', `Ingresando código "${roomCode}"…`, C.yellow);
    await p2.click('#inp-code');
    await p2.type('#inp-code', roomCode, { delay: 80 });
    await shot(p2, 'guest-codigo');

    // 11. Click UNIRSE (confirmar)
    await p2.click('#btn-join');
    await p2.waitForFunction(
        () => document.getElementById('scr-lobby')?.classList.contains('on'),
        { timeout: 6000 }
    );
    check('Guest se unió al lobby', true, `sala=${roomCode}`);
    await shot(p2, 'guest-lobby');

    // 12. Verificar que HOST ve 2 jugadores y botón activo
    await wait(800);
    const lobbyCount  = await p1.$eval('#lobby-count', el => el.textContent.trim());
    const startEnabled = !(await p1.$eval('#btn-start', el => el.disabled));
    check('HOST ve 2 jugadores',      lobbyCount.startsWith('2'), `count="${lobbyCount}"`);
    check('Botón INICIAR habilitado', startEnabled, 'con 2 jugadores');
    await shot(p1, 'host-lobby-2jugadores');

    /* ─────────────────────────────────────────
       INICIAR JUEGO
    ───────────────────────────────────────── */
    // Capturar TODOS los logs del browser
    p1.on('console', m => {
        const t = m.type();
        if (t === 'error' || t === 'warning' || t === 'log')
            log(`Browser[${t}]`, m.text().slice(0, 120), t === 'error' ? C.red : C.gray);
    });
    p1.on('pageerror', e => log('PageError', e.message, C.red));

    log('HOST', 'Click en INICIAR COMBATE…', C.yellow);
    await p1.click('#btn-start');

    // Esperar mensaje "¡Prepárate!" en el lobby (game-started recibido)
    await p1.waitForFunction(
        () => document.getElementById('lobby-msg')?.textContent.includes('Prepárate'),
        { timeout: 8000 }
    );
    log('HOST', 'game-started recibido — esperando primera pregunta (3s)…', C.gray);
    await shot(p1, 'host-game-started');

    // Esperar pantalla de juego en HOST (new-question llega ~3s después)
    await p1.waitForFunction(
        () => document.getElementById('scr-game')?.style.display === 'flex',
        { timeout: 12000 }
    );
    check('Pantalla JUEGO visible (HOST)', true, 'scr-game display:flex');
    await shot(p1, 'host-juego');

    // Esperar pantalla de juego en GUEST
    await p2.waitForFunction(
        () => document.getElementById('scr-game')?.style.display === 'flex',
        { timeout: 12000 }
    );
    check('Pantalla JUEGO visible (GUEST)', true, 'scr-game display:flex');
    await shot(p2, 'guest-juego');

    /* ─────────────────────────────────────────
       VERIFICAR ELEMENTOS DEL JUEGO
    ───────────────────────────────────────── */
    await wait(500);

    // Timer visible
    const timerText = await p1.$eval('#t-num', el => el.textContent.trim());
    const timerNum  = parseInt(timerText);
    check('Timer visible y activo', timerNum > 0 && timerNum <= 20, `valor="${timerText}"`);

    // Pregunta visible
    const qText = await p1.$eval('#q-text', el => el.textContent.trim());
    check('Pregunta cargada', qText.length > 3 && qText !== 'Cargando…', `"${qText.slice(0,40)}"`);

    // Botones de respuesta
    const ansCount = await p1.$$eval('#ans-grid .ans-btn', btns => btns.length);
    check('Botones de respuesta', ansCount >= 2 && ansCount <= 4, `${ansCount} opciones`);

    // Scoreboard visible
    const lbRows = await p1.$$eval('#live-lb .lb-row', rows => rows.length);
    check('Scoreboard en vivo', lbRows >= 2, `${lbRows} filas`);

    // Vidas visibles
    const livesText = await p1.$eval('#my-lives', el => el.textContent.trim());
    check('Vidas visibles', livesText.includes('❤'), `"${livesText}"`);

    await shot(p1, 'host-juego-detalle');
    await shot(p2, 'guest-juego-detalle');

    /* ─────────────────────────────────────────
       RESPONDER UNA PREGUNTA (HOST)
    ───────────────────────────────────────── */
    log('HOST', 'Respondiendo primera opción…', C.yellow);
    const firstBtn = await p1.$('#ans-grid .ans-btn');
    if (firstBtn) {
        await firstBtn.click();
        await wait(500);
        check('HOST puede responder', true, 'click en opción A');
        await shot(p1, 'host-respondio');
    }

    // Esperar feedback (overlay de ronda)
    await wait(3000);
    await shot(p1, 'host-resultado-ronda');
    await shot(p2, 'guest-resultado-ronda');

    /* ─────────────────────────────────────────
       RESUMEN FINAL
    ───────────────────────────────────────── */
    console.log(`\n${C.bold}${'═'.repeat(52)}${C.reset}`);
    console.log(`${C.bold}${C.cyan}             RESUMEN DE PRUEBA MANUAL${C.reset}`);
    console.log(`${C.bold}${'═'.repeat(52)}${C.reset}\n`);

    const passed = results.filter(r => r.ok).length;
    const total  = results.length;

    results.forEach(r => {
        const sym = r.ok ? `${C.green}✅` : `${C.red}❌`;
        console.log(`  ${sym}  ${r.name}${C.reset}${r.detail ? `  ${C.gray}(${r.detail})${C.reset}` : ''}`);
    });

    console.log(`\n${'═'.repeat(52)}`);
    const allOk = passed === total;
    console.log(allOk
        ? `${C.green}${C.bold}✅  ${passed}/${total} pruebas pasaron${C.reset}`
        : `${C.yellow}${C.bold}⚠️   ${passed}/${total} pruebas pasaron${C.reset}`);
    console.log(`${'═'.repeat(52)}`);
    console.log(`\n📸 Screenshots guardados en: ${SHOTS_DIR}/\n`);

    // Dejar el navegador abierto 5 s para que el usuario vea el estado
    await wait(5000);
    await browser.close();
    process.exit(0);
}

main().catch(async e => {
    console.error(`\n${C.red}❌ Error: ${e.message}${C.reset}`);
    process.exit(1);
});
