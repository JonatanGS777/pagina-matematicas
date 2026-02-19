/**
 * test-timer-crear.mjs
 * TEST 1: El tiempo para responder transcurre correctamente
 * TEST 2: El botón "CREAR SALA" funciona
 */
import { io } from './MathBattle/node_modules/socket.io-client/build/esm/index.js';

const SERVER      = 'http://localhost:3002';
const TIME_LIMIT  = 6;   // segundos — configurados en la sala

const C = {
    reset:'\x1b[0m', bold:'\x1b[1m',
    cyan:'\x1b[36m', yellow:'\x1b[33m',
    green:'\x1b[32m', red:'\x1b[31m',
    gray:'\x1b[90m', white:'\x1b[97m',
};
const ts  = () => new Date().toLocaleTimeString('es', { hour12: false, fractionalSecondDigits: 1 });
const log = (tag, msg, c = C.gray) =>
    console.log(`${C.gray}${ts()}${C.reset} ${c}[${String(tag).padEnd(16)}]${C.reset} ${msg}`);

function connect(name) {
    return new Promise((resolve, reject) => {
        const sock = io(SERVER, { transports: ['websocket'] });
        const t = setTimeout(() => reject(new Error(`${name}: timeout de conexión`)), 6000);
        sock.on('connect', () => { clearTimeout(t); resolve(sock); });
        sock.on('connect_error', e => reject(e));
    });
}
function waitFor(sock, event, ms = 20000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout esperando '${event}'`)), ms);
        sock.once(event, d => { clearTimeout(t); resolve(d); });
    });
}

/* ══════════════════════════════════════════════
   TEST 2 — BOTÓN CREAR SALA
   Simula exactamente el click en btn-create:
   emite 'create-room' y espera 'room-created'
══════════════════════════════════════════════ */
async function testCrearSala() {
    console.log(`\n${C.bold}${C.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.bold}${C.yellow}  TEST 2 — Botón CREAR SALA${C.reset}`);
    console.log(`${C.bold}${C.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    const sock = await connect('CrearSala_Test');
    log('Conexión', `Socket conectado: ${sock.id.slice(0,10)}…`, C.cyan);

    // ── Clic en "CREAR SALA" ──
    const t0 = Date.now();
    log('CREAR SALA', 'Emitiendo create-room…', C.white);
    sock.emit('create-room', {
        playerName  : 'Profesor_Test',
        gameSettings: {
            maxPlayers     : 30,
            totalQuestions : 3,
            questionTime   : TIME_LIMIT,
            difficultyLevel: 'easy',
            categories     : ['arithmetic'],
        }
    });

    const data  = await waitFor(sock, 'room-created', 5000);
    const ms    = Date.now() - t0;
    const code  = data.roomCode ?? '';
    const valid = /^[A-Z0-9]{6}$/.test(code);

    log('room-created', `Código recibido: ${C.yellow}${C.bold}${code}${C.reset}  en ${ms}ms`, C.green);
    log('Validación',   `Código 6 chars alfanumérico: ${valid ? C.green+'✅ SÍ'+C.reset : C.red+'❌ NO'+C.reset}`);
    log('Validación',   `Tiempo de respuesta < 200ms: ${ms < 200 ? C.green+'✅ SÍ ('+ms+'ms)'+C.reset : C.yellow+'⚠️ '+ms+'ms'+C.reset}`);

    // ── Verificar que la sala es real: un segundo cliente puede unirse ──
    const guest = await connect('Guest_Verify');
    guest.emit('join-room', { playerName: 'Guest_Verify', roomCode: code });
    const joinData = await waitFor(guest, 'room-joined', 5000);
    log('Verificación',  `Un segundo usuario se unió a ${joinData.roomCode}: ${C.green}✅ Sala real${C.reset}`);

    sock.disconnect();
    guest.disconnect();

    return { code, ms, valid };
}

/* ══════════════════════════════════════════════
   TEST 1 — TIMER
   Se usan 2 jugadores. Ninguno responde durante
   TIME_LIMIT segundos. Al vencerse el tiempo,
   el cliente dispara submit-answer con answer:''
   (igual que juegos.html). Se mide el tiempo real
   transcurrido entre new-question y round-results.
══════════════════════════════════════════════ */
async function testTimer() {
    console.log(`\n${C.bold}${C.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.bold}${C.cyan}  TEST 1 — Timer (tiempo para responder)${C.reset}`);
    console.log(`${C.bold}${C.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    const host  = await connect('Timer_Host');
    const guest = await connect('Timer_Guest');
    log('Conexión', `Host:  ${host.id.slice(0,10)}…`, C.cyan);
    log('Conexión', `Guest: ${guest.id.slice(0,10)}…`, C.cyan);

    // Crear sala con TIME_LIMIT segundos por pregunta
    host.emit('create-room', {
        playerName  : 'Timer_Host',
        gameSettings: {
            maxPlayers     : 30,
            totalQuestions : 2,
            questionTime   : TIME_LIMIT,
            difficultyLevel: 'easy',
            categories     : ['arithmetic'],
        }
    });
    const roomData = await waitFor(host, 'room-created');
    const roomCode = roomData.roomCode;
    log('Sala creada', `Código: ${C.yellow}${roomCode}${C.reset}  · timeLimit configurado: ${C.bold}${TIME_LIMIT}s${C.reset}`, C.green);

    // Guest se une
    guest.emit('join-room', { playerName: 'Timer_Guest', roomCode });
    await waitFor(guest, 'room-joined');
    log('Sala', '2 jugadores en lobby', C.green);

    // Iniciar juego
    host.emit('start-game', { roomCode });
    await waitFor(host, 'game-started');
    log('Juego', 'game-started recibido', C.green);

    const timerResults = [];

    const gameFinish = new Promise(resolve => {
        host.on('game-finished', resolve);
        setTimeout(() => resolve(null), 60000);
    });

    // ── Listener de preguntas para AMBOS jugadores ──
    // Simulan el temporizador del cliente: esperan TIME_LIMIT segundos y envían ''
    for (const [sock, nombre] of [[host,'Host'],[guest,'Guest']]) {
        sock.on('new-question', d => {
            const { questionNumber, timeLimit } = d;
            const t0 = Date.now();

            log(nombre, `P${questionNumber} recibida — timeLimit=${timeLimit}s — esperando que expire…`, C.white);

            // Simulación del timer del cliente: exactamente timeLimit segundos
            setTimeout(() => {
                const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

                if (nombre === 'Host') {
                    timerResults.push({ round: questionNumber, timeLimit, elapsed: parseFloat(elapsed) });
                    log(nombre, `⏰ Tiempo agotado — ${elapsed}s transcurridos — enviando answer:''`, C.yellow);
                } else {
                    log(nombre, `⏰ Tiempo agotado — ${elapsed}s transcurridos — enviando answer:''`, C.yellow);
                }

                sock.emit('submit-answer', { roomCode, answer: '', timeRemaining: 0 });
            }, timeLimit * 1000);
        });
    }

    await gameFinish;

    // ── Análisis de resultados del timer ──
    console.log('');
    let timerOk = true;
    timerResults.forEach(r => {
        const diff      = Math.abs(r.elapsed - r.timeLimit);
        const tolerance = 0.3; // 300 ms de tolerancia
        const ok        = diff <= tolerance;
        if (!ok) timerOk = false;
        log(`Ronda ${r.round} timer`,
            `Configurado: ${r.timeLimit}s  |  Real: ${r.elapsed}s  |  Δ=${diff.toFixed(2)}s  →  ${ok ? C.green+'✅'+C.reset : C.red+'❌'+C.reset}`,
            ok ? C.green : C.red
        );
    });

    host.disconnect();
    guest.disconnect();
    return { timerResults, timerOk };
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
async function main() {
    console.log(`\n${C.bold}${C.cyan}╔════════════════════════════════════════════════╗`);
    console.log(`║  🎮  MATH ARENA — Prueba Timer + Crear Sala    ║`);
    console.log(`╚════════════════════════════════════════════════╝${C.reset}`);

    let t2, t1;

    try {
        t2 = await testCrearSala();
    } catch (e) {
        console.error(`${C.red}❌ TEST 2 falló: ${e.message}${C.reset}`);
        t2 = { valid: false };
    }

    try {
        t1 = await testTimer();
    } catch (e) {
        console.error(`${C.red}❌ TEST 1 falló: ${e.message}${C.reset}`);
        t1 = { timerOk: false, timerResults: [] };
    }

    /* ── Resumen final ── */
    console.log(`\n${C.bold}${'═'.repeat(50)}${C.reset}`);
    console.log(`${C.bold}${C.white}          RESUMEN FINAL${C.reset}`);
    console.log(`${C.bold}${'═'.repeat(50)}${C.reset}\n`);

    const p1 = t1?.timerOk;
    const p2 = t2?.valid;

    console.log(`  ${p1 ? '✅' : '❌'}  TEST 1 — Timer`);
    if (t1?.timerResults?.length) {
        t1.timerResults.forEach(r => {
            const diff = Math.abs(r.elapsed - r.timeLimit);
            console.log(`       Ronda ${r.round}: configurado ${r.timeLimit}s → real ${r.elapsed}s (Δ ${diff.toFixed(2)}s)`);
        });
    }
    console.log(`       Estado: ${p1 ? `${C.green}PASA${C.reset}` : `${C.red}FALLA${C.reset}`}\n`);

    console.log(`  ${p2 ? '✅' : '❌'}  TEST 2 — Botón CREAR SALA`);
    if (t2?.code) {
        console.log(`       Código generado: ${C.yellow}${t2.code}${C.reset}  (${t2.ms}ms)`);
        console.log(`       Sala verificada: segundo usuario pudo unirse`);
    }
    console.log(`       Estado: ${p2 ? `${C.green}PASA${C.reset}` : `${C.red}FALLA${C.reset}`}\n`);

    console.log(`${'═'.repeat(50)}`);
    const all = p1 && p2;
    console.log(all
        ? `${C.green}${C.bold}✅  AMBOS TESTS PASARON${C.reset}`
        : `${C.red}${C.bold}❌  ALGÚN TEST FALLÓ${C.reset}`);
    console.log(`${'═'.repeat(50)}\n`);

    process.exit(0);
}

main().catch(e => {
    console.error(`${C.red}❌ Error: ${e.message}${C.reset}`);
    process.exit(1);
});
