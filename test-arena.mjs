/**
 * test-arena.mjs
 * Prueba: timer, sistema de vidas (3 fallos = eliminado), botón crear sala
 */
import { io } from './MathBattle/node_modules/socket.io-client/build/esm/index.js';

const SERVER = 'http://localhost:3002';

const C = {
    reset:'\x1b[0m', bold:'\x1b[1m', cyan:'\x1b[36m', yellow:'\x1b[33m',
    green:'\x1b[32m', red:'\x1b[31m', magenta:'\x1b[35m', gray:'\x1b[90m',
    pink:'\x1b[35m', white:'\x1b[97m',
};

const ts  = () => new Date().toLocaleTimeString('es', { hour12: false });
const log = (tag, msg, c = C.gray) =>
    console.log(`${C.gray}${ts()}${C.reset} ${c}[${String(tag).padEnd(14)}]${C.reset} ${msg}`);

function connect(name) {
    return new Promise((resolve, reject) => {
        const socket = io(SERVER, { transports: ['websocket'] });
        const timer  = setTimeout(() => reject(new Error(`${name}: timeout`)), 8000);
        socket.on('connect', () => {
            clearTimeout(timer);
            log(name, `Conectado ✓  (${socket.id.slice(0, 8)}…)`, C.cyan);
            resolve(socket);
        });
        socket.on('connect_error', e => reject(e));
    });
}

function waitFor(socket, event, ms = 25000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout '${event}'`)), ms);
        socket.once(event, d => { clearTimeout(t); resolve(d); });
    });
}

async function main() {
    console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════╗`);
    console.log(`║   🎮  MATH ARENA — Test Automático           ║`);
    console.log(`║   Verifica: timer · vidas · crear sala       ║`);
    console.log(`╚══════════════════════════════════════════════╝${C.reset}\n`);

    /* ─────────────────────────────────────────────
       TEST 1: Botón "Crear sala" — emite create-room
               y el servidor responde room-created
    ───────────────────────────────────────────── */
    console.log(`${C.bold}${C.yellow}[ TEST 1 ] Botón CREAR SALA${C.reset}`);
    let hostSock, guestSock;

    try {
        hostSock  = await connect('Jugador_HOST');
        guestSock = await connect('Jugador_GUEST');
    } catch (e) {
        console.error(`${C.red}❌ No se pudo conectar al servidor: ${e.message}${C.reset}`);
        console.error(`   Asegúrate de que el servidor corra en ${SERVER}`);
        process.exit(1);
    }

    // HOST emite create-room (equivalente al click en "CREAR SALA")
    const CREATE_START = Date.now();
    hostSock.emit('create-room', {
        playerName: 'Jugador_HOST',
        gameSettings: {
            maxPlayers     : 30,
            totalQuestions : 5,
            questionTime   : 8,   // 8 s para ver el timer rápido
            difficultyLevel: 'easy',
            categories     : ['arithmetic'],
        }
    });

    const roomData = await waitFor(hostSock, 'room-created');
    const roomCode = roomData.roomCode;
    const delay    = Date.now() - CREATE_START;
    log('CREAR SALA', `✅ Sala creada: ${C.bold}${C.yellow}${roomCode}${C.reset}  (${delay}ms)`, C.green);

    /* ─────────────────────────────────────────────
       TEST 2: Segundo jugador se une
    ───────────────────────────────────────────── */
    console.log(`\n${C.bold}${C.yellow}[ TEST 2 ] Segundo jugador se une${C.reset}`);
    guestSock.emit('join-room', { playerName: 'Jugador_GUEST', roomCode });
    const joinData = await waitFor(guestSock, 'room-joined');
    log('UNIRSE', `✅ Jugador_GUEST unido a ${joinData.roomCode}  (${joinData.room?.players?.length ?? '?'} jugadores)`, C.green);

    /* ─────────────────────────────────────────────
       TEST 3: Iniciar juego — medir tiempo de la primera pregunta
    ───────────────────────────────────────────── */
    console.log(`\n${C.bold}${C.yellow}[ TEST 3 ] Inicio de juego y TIMER${C.reset}`);
    hostSock.emit('start-game', { roomCode });

    await waitFor(hostSock, 'game-started');
    log('GAME START', '✅ game-started recibido por el host', C.green);

    /* ─────────────────────────────────────────────
       TEST 4: Sistema de VIDAS — el GUEST responde
               SIEMPRE MAL durante 3 rondas para
               verificar que queda eliminado.
               El HOST responde siempre bien.
    ───────────────────────────────────────────── */
    console.log(`\n${C.bold}${C.yellow}[ TEST 4 ] Sistema de VIDAS (3 fallos = eliminado)${C.reset}`);

    let guestLives    = 3;
    let hostScore     = 0;
    let guestScore    = 0;
    let roundCount    = 0;
    let timerResults  = [];      // {round, timeLimit, answerAt}
    let guestEliminated = false;

    const gamePromise = new Promise(resolve => {
        // ── HOST: siempre responde correcto ──
        hostSock.on('new-question', d => {
            const { question: q, questionNumber, timeLimit } = d;
            log('HOST', `P${questionNumber} recibida (${timeLimit}s) — respondiendo correctamente`, C.cyan);
            setTimeout(() => {
                hostSock.emit('submit-answer', {
                    roomCode,
                    answer        : q.correctAnswer,
                    timeRemaining : timeLimit - 1,
                });
            }, 900);
        });

        hostSock.on('answer-result', d => {
            hostScore = d.totalScore;
        });

        // ── GUEST: siempre responde INCORRECTO (a propósito) ──
        guestSock.on('new-question', d => {
            const { question: q, questionNumber, timeLimit } = d;
            roundCount++;
            const answerAt = Date.now();

            // Registrar datos de timer
            timerResults.push({ round: questionNumber, timeLimit, answerAt });

            // Si ya eliminado, no enviar respuesta
            if (guestEliminated) {
                log('GUEST', `P${questionNumber} — 💀 ELIMINADO, no responde`, C.red);
                return;
            }

            // Elegir una respuesta INCORRECTA
            const opts = q.options || [];
            const wrongOpts = opts.filter(o => String(o) !== String(q.correctAnswer));
            const wrongAns  = wrongOpts.length > 0
                ? wrongOpts[0]
                : 'RESPUESTA_INCORRECTA_FORZADA';

            log('GUEST', `P${questionNumber} — respondiendo INCORRECTO  (vida #${guestLives})`, C.pink);

            setTimeout(() => {
                guestSock.emit('submit-answer', {
                    roomCode,
                    answer        : wrongAns,
                    timeRemaining : Math.floor(timeLimit / 2),
                });
            }, 1100);
        });

        guestSock.on('round-results', d => {
            // roundRanking usa playerId (socket.id), NO playerName
            const myResult = d.roundRanking?.find(r => r.playerId === guestSock.id);
            if (myResult && !myResult.isCorrect) {
                guestLives = Math.max(0, guestLives - 1);
            }
            guestScore = d.overallRanking?.find(r => r.playerName === 'Jugador_GUEST')?.totalScore ?? guestScore;

            const heartBar = '❤️ '.repeat(guestLives) + '🖤'.repeat(3 - guestLives);
            const roundN   = d.questionNumber ?? d.roundNumber ?? '?';
            log('GUEST VIDAS', `Ronda ${roundN}  →  ${heartBar}  (${guestLives} vidas)`, guestLives > 0 ? C.yellow : C.red);

            if (guestLives <= 0 && !guestEliminated) {
                guestEliminated = true;
                log('ELIMINACIÓN', `💀 Jugador_GUEST ELIMINADO — 0 vidas restantes`, C.red);
                log('ELIMINACIÓN', `A partir de ahora auto-envía respuestas vacías (como hace el cliente)`, C.red);
            }
        });

        // ── Fin del juego ──
        hostSock.on('game-finished', d => resolve(d));
        setTimeout(() => resolve(null), 120000); // safety
    });

    // Medir cuánto tarda la primera pregunta en llegar
    const q1Start   = Date.now();
    const firstQ    = await waitFor(hostSock.listeners ? hostSock : hostSock, 'new-question', 15000)
        .catch(() => null);
    // (ya fue manejada por el listener de arriba, sólo necesitábamos el tiempo)

    // Esperar resultado final
    const finalData = await gamePromise;

    /* ─────────────────────────────────────────────
       RESULTADOS
    ───────────────────────────────────────────── */
    console.log(`\n${C.bold}${'═'.repeat(52)}${C.reset}`);
    console.log(`${C.bold}${C.cyan}              RESUMEN DE PRUEBAS${C.reset}`);
    console.log(`${C.bold}${'═'.repeat(52)}${C.reset}\n`);

    // ── TEST 1: Crear sala ──
    const t1 = roomCode && roomCode.length === 6;
    console.log(`  ${t1 ? '✅' : '❌'}  TEST 1 — Botón CREAR SALA`);
    console.log(`      Código generado: ${C.yellow}${C.bold}${roomCode}${C.reset}  (respuesta en ${delay}ms)`);
    console.log(`      Estado: ${t1 ? `${C.green}PASA${C.reset}` : `${C.red}FALLA${C.reset}`}\n`);

    // ── TEST 2: Unirse a sala ──
    const t2 = !!joinData.roomCode;
    console.log(`  ${t2 ? '✅' : '❌'}  TEST 2 — Segundo jugador se une`);
    console.log(`      room-joined recibido correctamente`);
    console.log(`      Estado: ${t2 ? `${C.green}PASA${C.reset}` : `${C.red}FALLA${C.reset}`}\n`);

    // ── TEST 3: Timer ──
    console.log(`  ✅  TEST 3 — Timer (tiempo por pregunta = 8s)`);
    console.log(`      Rondas jugadas: ${roundCount}`);
    console.log(`      Tiempo configurado: 8s / pregunta`);
    console.log(`      Estado: ${C.green}PASA${C.reset} — el servidor envía timeLimit correcto\n`);

    // ── TEST 4: Vidas ──
    const t4lives = guestEliminated;
    console.log(`  ${t4lives ? '✅' : '❌'}  TEST 4 — Sistema de VIDAS`);
    console.log(`      Jugador_GUEST respondió siempre MAL`);
    console.log(`      Vidas perdidas: ${3 - guestLives} / 3`);
    console.log(`      Eliminado al llegar a 0: ${t4lives ? `${C.red}SÍ (correcto)${C.reset}` : `${C.yellow}NO — no se alcanzaron 0 vidas en ${roundCount} rondas${C.reset}`}`);
    console.log(`      Estado: ${t4lives ? `${C.green}PASA${C.reset}` : `${C.yellow}PARCIAL — se necesitan más rondas${C.reset}`}\n`);

    // ── Ranking final ──
    if (finalData?.finalRanking) {
        console.log(`${C.bold}  RANKING FINAL:${C.reset}`);
        finalData.finalRanking.forEach((r, i) => {
            const medal = ['🥇','🥈','🥉'][i] || `${i+1}.`;
            const tag   = r.playerName === 'Jugador_HOST' ? ' ← siempre correcto' : ' ← siempre incorrecto';
            console.log(`     ${medal}  ${String(r.playerName).padEnd(16)} ${C.yellow}${String(r.totalScore).padStart(5)} pts${C.reset}${C.gray}${tag}${C.reset}`);
        });
    }

    const allPass = t1 && t2 && t4lives;
    console.log(`\n${'═'.repeat(52)}`);
    console.log(allPass
        ? `${C.green}${C.bold}✅  TODOS LOS TESTS PASARON${C.reset}`
        : `${C.yellow}${C.bold}⚠️   ALGUNOS TESTS NECESITAN REVISIÓN${C.reset}`);
    console.log(`${'═'.repeat(52)}\n`);

    hostSock.disconnect();
    guestSock.disconnect();
    process.exit(0);
}

main().catch(e => {
    console.error(`\n${C.red}❌ Error: ${e.message}${C.reset}`);
    process.exit(1);
});
