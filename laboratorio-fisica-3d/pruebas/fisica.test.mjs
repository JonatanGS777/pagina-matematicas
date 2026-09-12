import { readFileSync } from 'fs';
const src = readFileSync('/Users/yonatanguerrerosoriano/Downloads/pagina-matematicas/laboratorio-fisica-3d/js/fisica.js', 'utf8');
const g = {};
new Function('globalThis', src).call(g, g);
const F = g.Fisica;

let fallos = 0;
function check(nombre, obtenido, esperado, tol) {
  const ok = Math.abs(obtenido - esperado) <= tol;
  if (!ok) fallos++;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${nombre}: obtenido=${obtenido.toFixed(6)} esperado=${esperado.toFixed(6)} tol=${tol}`);
}

// 1. Caída libre sin arrastre: debe coincidir con sqrt(2h/g)
const cl = new F.CaidaLibre({ altura: 20 });
let pasos = 0;
while (!cl.enSuelo && pasos < 100000) { cl.paso(0.0005); pasos++; }
check('caída libre tiempo', cl.t, cl.tiempoTeorico(), 0.002);

// 2. Plano inclinado: a = g(sin - mu cos), v^2 = 2 a d
const pi = new F.PlanoInclinado({ anguloGrados: 30, muCinetico: 0.2, muEstatico: 0.25, largo: 4 });
while (!pi.detenido) pi.paso(0.0005);
const aTeo = F.G * (Math.sin(Math.PI/6) - 0.2 * Math.cos(Math.PI/6));
check('plano inclinado v final', pi.velocidad(), Math.sqrt(2 * aTeo * 4), 0.01);
check('plano ángulo crítico', pi.anguloCriticoGrados(), Math.atan(0.25) * 180 / Math.PI, 1e-9);

// 3. Proyectil sin arrastre vs alcance teórico
const pr = new F.Proyectil({ rapidez: 20, anguloGrados: 45, alturaInicial: 1.2 });
while (pr.enVuelo) pr.paso(0.0002);
check('proyectil alcance', pr.posicion()[0], pr.alcanceTeorico(), 0.02);
check('proyectil altura max', pr.alturaMaxima, pr.alturaMaximaTeorica(), 0.01);
check('proyectil tiempo vuelo', pr.t, pr.tiempoVueloTeorico(), 0.005);

// 4. Colisión elástica masas iguales: intercambio de velocidades
const co = new F.Colision({ masaA: 1, masaB: 1, velocidadA: 3, velocidadB: 0, restitucion: 1 });
while (!co.choco) co.paso(0.001);
check('colisión elástica vA', co.vA, 0, 1e-9);
check('colisión elástica vB', co.vB, 3, 1e-9);
check('colisión momento conservado', co.momentoTotal(), co.momentoInicial, 1e-9);
check('colisión energía conservada', co.energiaCinetica(), co.energiaInicial, 1e-9);

// Colisión perfectamente inelástica: misma velocidad final, momento conservado
const ci = new F.Colision({ masaA: 2, masaB: 1, velocidadA: 3, velocidadB: -1, restitucion: 0 });
while (!ci.choco) ci.paso(0.001);
check('inelástica vA=vB', ci.vA, ci.vB, 1e-9);
check('inelástica momento', ci.momentoTotal(), ci.momentoInicial, 1e-9);
check('inelástica v final', ci.vA, (2*3 + 1*-1)/3, 1e-9);

// 5. Péndulo: periodo medido vs corregido con ángulo grande
const pe = new F.Pendulo({ largo: 1.5, anguloInicialGrados: 40 });
for (let i = 0; i < 200000 && pe.periodoMedido === null; i++) pe.paso(0.0002);
for (let i = 0; i < 200000 && pe.ciclos < 1; i++) pe.paso(0.0002);
check('péndulo periodo real vs corregido', pe.periodoMedido, pe.periodoCorregido(), 0.01);
console.log(`     (periodo pequeño sería ${pe.periodoPequeno().toFixed(4)}, real ${pe.periodoMedido.toFixed(4)})`);
// Energía se conserva sin amortiguamiento
const pe2 = new F.Pendulo({ largo: 1.5, anguloInicialGrados: 40 });
const e0 = pe2.energiaTotal();
for (let i = 0; i < 50000; i++) pe2.paso(0.0002);
check('péndulo energía conservada', pe2.energiaTotal(), e0, 1e-6);

// 6. Campo eléctrico: carga puntual  E = kq/r^2
const ce = new F.CampoElectrico({ cargas: [{ posicion: [0,0,0], carga_nC: 10 }] });
const Emed = F.norma(ce.campoEn([2,0,0]));
check('campo carga puntual', Emed, F.K_COULOMB * 10e-9 / 4, 1e-6);
check('potencial carga puntual', ce.potencialEn([2,0,0]), F.K_COULOMB * 10e-9 / 2, 1e-9);
// Dipolo: campo nulo NO existe entre cargas opuestas, pero en el punto medio
// de dos cargas iguales el campo debe anularse
const cd = new F.CampoElectrico({ cargas: [{posicion:[-1,0,0],carga_nC:5},{posicion:[1,0,0],carga_nC:5}] });
check('dipolo iguales campo nulo en centro', F.norma(cd.campoEn([0,0,0])), 0, 1e-9);

// 7. Lorentz: radio de giro y periodo ciclotrónico
const lo = new F.Lorentz({ masa: 1e-6, carga: 1e-6, campoB: [0,0.5,0], velocidadInicial: [2,0,0], posicionInicial: [0,0,0] });
const rTeo = lo.radioTeorico();
// Recorre un periodo completo y comprueba que vuelve al inicio
const T = lo.periodoCiclotron();
const n = 20000, dt = T / n;
for (let i = 0; i < n; i++) lo.paso(dt);
const p = lo.posicion();
check('lorentz cierra la órbita x', p[0], 0, 1e-4);
check('lorentz cierra la órbita z', p[2], 0, 1e-4);
check('lorentz radio teórico', rTeo, 1e-6 * 2 / (1e-6 * 0.5), 1e-12);
// El radio medido: distancia máxima al centro de giro debe ser 2r
const lo2 = new F.Lorentz({ masa: 1e-6, carga: 1e-6, campoB: [0,0.5,0], velocidadInicial: [2,0,0], posicionInicial: [0,0,0] });
let maxDist = 0;
for (let i = 0; i < n; i++) { lo2.paso(dt); const q = lo2.posicion(); maxDist = Math.max(maxDist, Math.hypot(q[0], q[2])); }
check('lorentz diámetro medido', maxDist, 2 * rTeo, 1e-3);
// Rapidez constante (la fuerza magnética no hace trabajo)
check('lorentz rapidez constante', F.norma(lo2.velocidad()), 2, 1e-6);

console.log(fallos === 0 ? '\nTODAS LAS PRUEBAS PASAN' : `\n${fallos} PRUEBAS FALLAN`);
process.exit(fallos === 0 ? 0 : 1);
