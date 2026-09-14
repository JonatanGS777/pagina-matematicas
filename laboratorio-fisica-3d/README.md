# Laboratorio de Física 3D

Salón de física virtual que el estudiante recorre caminando en primera persona,
con siete estaciones de experimentos, misiones progresivas y descargas para el
profesor. Construido desde cero para este sitio: no reutiliza código de ningún
otro módulo.

**Ruta:** `laboratorio-fisica-3d/index.html`

## Qué incluye

| # | Estación | Contenido | Misiones |
|---|---|---|---|
| 1 | Caída libre | Tubo de vacío de 12 m, con y sin aire, cuatro gravedades | 4 |
| 2 | Plano inclinado | Fricción estática y cinética, ángulo crítico | 3 |
| 3 | Péndulo simple | Periodo real contra la fórmula del libro | 4 |
| 4 | Colisiones | Carril de aire, coeficiente de restitución | 4 |
| 5 | Tiro parabólico | Galería de 30 m, diana, arrastre del aire | 4 |
| 6 | Campo eléctrico | Líneas de campo en 3D, sonda, cuatro configuraciones | 4 |
| 7 | Fuerza magnética | Bobinas de Helmholtz, órbita ciclotrónica y hélice | 4 |

27 misiones en total. Las de **predicción** piden calcular un número antes de
correr el experimento y lo comparan con el valor exacto (5 % de tolerancia). Las
de **reto** se cumplen manipulando los controles hasta lograr una condición.

## Descargas para el profesor

Botón "Descargas" o tecla `M`:

- **Laboratorio sin conexión**: un único archivo HTML de unos 830 KB con todo
  adentro, incluido el motor 3D. Se copia a las computadoras del salón y
  funciona con doble clic, sin internet ni instalación.
- **Reporte del estudiante**: hoja de laboratorio con puntaje, intentos por
  misión, todas las mediciones y espacio para conclusiones a mano. Se abre lista
  para "Guardar como PDF".
- **Datos en CSV**: separador `;` y coma decimal, para que Excel en español lo
  abra sin diálogo de importación.
- **Guía didáctica**: las siete estaciones con sus controles, todas las misiones
  con respuestas y preguntas para discutir. Se genera desde las mismas
  definiciones que usa el laboratorio, así que nunca se desincroniza.

## Cómo se mueve el estudiante

`W A S D` caminar · mouse mirar · `shift` correr · `E` abrir la estación de
enfrente · `espacio` ejecutar el experimento · `esc` soltar el cursor · `M`
descargas · `H` ayuda. También se puede hacer clic en el plano del salón para
saltar directo a una estación.

El progreso se guarda en `localStorage` de esa computadora.

## Idiomas (ES/EN)

El botón `EN`/`ES` de la esquina es el mismo selector del resto del sitio
(`../js/i18n.js`). Pasar a inglés traduce en vivo; volver a español recarga la
página. La traducción llega por tres caminos distintos:

- **Texto fijo del HTML** (portada, ayuda, descargas): entradas en los
  diccionarios compartidos de `js/i18n.js`, sección `laboratorio-fisica-3d`.
- **Texto que arma el JS** (panel, misiones, lecturas, avisos): cada dato
  guarda su par en inglés como campo hermano (`titulo`/`tituloEn`,
  `enunciado`/`enunciadoEn`, `etiqueta`/`etiquetaEn`...) y el HUD elige con
  `Util3D.T(obj, 'campo')`, `Util3D.TArr()` para arreglos y `Util3D.texto(es, en)`
  para frases con valores interpolados. Al cambiar de idioma, `main.js`
  redibuja el panel abierto y el nombre de nivel.
- **Texto dibujado en canvas** (letreros colgantes, pizarra, pantallas de cada
  mesa, rótulos de ángulo): `main.js` escucha `i18n:langChange` y redibuja las
  texturas con `texturaTexto().actualizar()` y `texturaPizarra().actualizar()`;
  las pantallas se refrescan solas en cada cuadro.

Los valores categóricos del historial (`Vacío`, `Con aire`, `Dipolo (+ y -)`...)
se guardan siempre en español porque las misiones los comparan; solo se
traducen al mostrarlos en la tabla con `Util3D.valorTabla()`. Las descargas
(reporte PDF, guía didáctica y CSV) quedan en español a propósito: son
materiales de clase con formato regional de Excel en español.

## Estructura

```
laboratorio-fisica-3d/
├── index.html                    página única
├── css/lab.css                   interfaz
├── js/
│   ├── fisica.js                 núcleo numérico, sin DOM ni Three.js
│   ├── util3d.js                 flechas, reglas, trazas, pantallas, idioma
│   ├── escena.js                 salón: piso, paredes, techo, pizarra
│   ├── jugador.js                cámara en primera persona y colisiones
│   ├── estaciones-mecanica.js    estaciones 1 a 5
│   ├── estaciones-em.js          estaciones 6 y 7
│   ├── misiones.js               progreso, evaluación y puntaje
│   ├── exportar.js               las cuatro descargas
│   ├── hud.js                    paneles, mapa y avisos
│   └── main.js                   arranque y ciclo de animación
└── pruebas/fisica.test.mjs       23 comprobaciones del núcleo
```

Sin build, sin npm, sin framework. Scripts clásicos y Three.js **r149** por CDN,
que es la última versión con build UMD: eso es lo que permite empaquetar todo en
un solo archivo para el modo sin conexión (de r150 en adelante Three solo se
distribuye como módulos ES).

## Física

Todo se integra con Runge-Kutta de cuarto orden sobre el vector de estado de
cada sistema. El péndulo resuelve la ecuación completa con `sen(θ)`, sin la
aproximación de ángulo pequeño, que es justamente lo que se le pide observar al
estudiante: a 40° el periodo real es 2.534 s y la fórmula del libro da 2.457 s,
un 3 % de diferencia.

### Pruebas

```bash
node laboratorio-fisica-3d/pruebas/fisica.test.mjs
```

23 comprobaciones contra valores analíticos: tiempo de caída, alcance del
proyectil, conservación de momento y energía en colisiones elásticas e
inelásticas, periodo del péndulo, campo y potencial de una carga puntual, cierre
de la órbita ciclotrónica y rapidez constante bajo fuerza magnética.

## Notas de mantenimiento

- Cada estación expone la misma interfaz: `construir`, `aplicarParametros`,
  `correr`, `reiniciar`, `actualizar`, `lecturas`, `registrarMedicion`,
  `columnas` y un arreglo `misiones`. Para agregar una estación nueva basta con
  seguir ese contrato y añadirla a `EstacionesMecanica` o `EstacionesEM`.
- Las texturas de canvas deben llevar `encoding = THREE.sRGBEncoding`. Sin eso
  Three las interpreta como lineales y la escena se ve lavada.
- El generador del archivo sin conexión lee `index.html` y sustituye cada
  `<script src="js/...">` (y `../js/i18n.js`) por su contenido, así que necesita
  que la página esté servida por HTTP. No funciona abriendo el `index.html`
  local con doble clic.
- Todo texto nuevo que vea el estudiante necesita su versión en inglés: un
  campo `...En` en los datos de la estación, `Util3D.texto(es, en)` en frases
  armadas con números, o una entrada en `js/i18n.js` si es HTML fijo.
