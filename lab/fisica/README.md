# Laboratorio de Física 3D

Página integrada en `lab/fisica.html`, accesible desde **Laboratorio → Laboratorio de Física 3D** en el inicio. Sitio estático, sin compilación ni servicios adicionales.

## Abrir

Desde la raíz del sitio:

```sh
python3 -m http.server 8762 --bind 127.0.0.1
```

Visita http://127.0.0.1:8762/lab/fisica.html. Los recursos se sirven localmente, incluido Three.js r128 (MIT). WebGL permite el salón; si falla, los controles, gráficas y actividades siguen disponibles. No se incluye un service worker: el servidor debe seguir accesible.

## Uso en clase

- **Salón:** vista general; selecciona una mesa o estación.
- **Recorrer:** haz clic en el salón; W/A/S/D desplazan, flechas izquierda/derecha giran, arrastrar cambia la mirada. Hay botones táctiles y colisiones con mesas y paredes.
- **Mesa:** acerca la cámara al montaje seleccionado.
- Redacta una hipótesis, ejecuta el ensayo y registra al terminar. Cambiar variables reinicia el ensayo. Pausa, reanuda, reinicia o ajusta la velocidad temporal.
- Registra dos configuraciones distintas, redacta una conclusión y responde la comprobación para completar la estación. El docente evalúa la calidad de las respuestas escritas.
- **Cuaderno:** exporta CSV de datos, TXT de datos y reflexiones, o imprime/guarda PDF con el navegador.
- **Espacio docente:** secuencia de 50 minutos, objetivos, rúbrica formativa, apoyos, respuestas, hoja de trabajo imprimible y modo de proyección.

El progreso se guarda bajo `guerrero-fisica-lab-v1` en localStorage, por navegador y origen; no hay cuentas ni sincronización entre estudiantes y profesor. Si el almacenamiento no está disponible, se avisa y se mantiene la exportación. Se conservan los últimos 300 ensayos. Las fuentes curriculares privadas no se publican con la página.

## Alcance curricular

Fuente: los seis archivos `Mapa Curricular_Ciencias_Físicas_Unidad F.N.pdf` de la carpeta proporcionada `Downloads/Curso de Física`. Se seleccionaron conceptos de cada unidad, sin afirmar cobertura total del curso ni alineación certificada.

| Unidad del mapa | Estación | Referencia consultada |
| --- | --- | --- |
| F.1 Prácticas de ciencia e ingeniería | Vectores, SI, distancia y desplazamiento | ES.F.IT1.2, ES.F.IT1.3 |
| F.2 Cinemática del movimiento | Proyectiles | ES.F1.1, ES.F1.7 |
| F.3 Dinámica del movimiento | Segunda ley de Newton | Objetivos A1, A2, A3 |
| F.4 Trabajo y energía | Energía potencial y cinética | Objetivo A3; conexión ES.F2.2 en F.6 |
| F.5 Ondas | Frecuencia, amplitud y longitud de onda | ES.F3.8 |
| F.6 Transferencia y transformaciones de la energía | Circuitos en serie y paralelo | ES.F4.6, ES.F4.7 |

Los modelos son ideales. Las condiciones y ecuaciones se explican en «Comprende la física». Los valores numéricos son predicciones analíticas del ensayo; al terminar se habilita su registro como mediciones simuladas. La escala del montaje 3D se adapta y no sirve para comparar distancias entre configuraciones. Usar las lecturas SI y gráficas. No se simulan incertidumbre, rozamiento, resistencia del aire o calentamiento de circuitos.

## Archivos y validación

- `models.js`: contenido y ecuaciones analíticas compartidas.
- `room.js`: salón y representaciones 3D, navegación y colisiones.
- `app.js`: controles, gráficas, cuaderno, progreso y docente.
- `lab.css`: diseño adaptable, proyección e impresión.
- `vendor/`: motor Three.js y licencia.

```sh
node lab/fisica/tests/models.test.cjs
node --check lab/fisica/app.js
node --check lab/fisica/room.js
git diff --check
```

Las pruebas matemáticas verifican casos conocidos, límites de parámetros, alcance de ángulos complementarios, relación fuerza/masa, conservación de energía y resistencias equivalentes.

Verificación en Chrome: seis ensayos completos, respuesta incorrecta/correcta, persistencia tras recarga, desplazamiento y colisiones, controles en pantalla, circuitos en paralelo, exportaciones CSV/TXT, PDF A4 de una página, modo de proyección y ancho móvil de 390 px sin desbordamiento. También se verificó experimentar y registrar sin WebGL ni localStorage. Evidencias locales en `output/playwright/`.
