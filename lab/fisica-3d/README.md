# Física viva · Salón 3D

Entrada del sitio: `lab/modulos/fisica.html`. El salón 3D sustituye al módulo
anterior en su misma ruta. El menú Laboratorio de la página principal y
`lab/experimentos.html` apuntan directamente a esa entrada.
`lab/fisica-3d.html` redirige a ella para conservar los enlaces compartidos.

## Para el aula

- Recorrer el salón: W A S D, flechas y arrastrar el ratón. E abre un aparato cercano.
- En móvil: flechas táctiles para caminar y arrastrar para mirar.
- También se puede elegir cualquier aparato desde el recorrido lateral.
- Guía → Experimenta → Explica: predicción, variables, ensayos y conclusión.
- Se marca un experimento completo con una predicción, dos condiciones distintas,
  una respuesta conceptual correcta y una conclusión. El docente evalúa el contenido
  de las reflexiones; la aplicación no califica automáticamente el texto.
- La bitácora exporta CSV e informe HTML imprimible como PDF.
- “Para el docente” incluye guía con rúbrica, hoja de investigación y modo proyector.
- El progreso se guarda en el navegador. No hay cuentas ni entrega automática.

## Copia para descargar

`lab/fisica-viva-portatil.html` contiene todos los recursos en un solo archivo.
Se puede descargar desde el panel docente y abrir directamente, sin servidor ni red.
Requiere WebGL 2, igual que el sitio. La persistencia al abrir archivos locales
depende del navegador: descargar la bitácora antes de cerrar o cambiar de equipo.

Después de modificar HTML, CSS o JavaScript, regenerar la copia:

```sh
node lab/fisica-3d/build-portable.mjs
```

## Modelos físicos

- Péndulo: aproximación de ángulo pequeño, 3–15°, sin rozamiento.
- Proyectil: sin aire, salida y llegada a igual altura, g = 9.81 m/s².
- Resorte: horizontal, ideal, sin rozamiento; energía mecánica conservada.
- Circuito: fuente de continua y resistor óhmico ideales. Los puntos representan
  corriente convencional y la lámpara es un indicador cualitativo de potencia.

Las gráficas y mediciones comparten las funciones de `physics.js` con los objetos
3D. Los supuestos y las referencias de OpenStax están en las guías.

## Verificación

```sh
node lab/fisica-3d/tests/physics.test.mjs
```

Prueba períodos y proporcionalidad, trayectoria y alcance, conservación de energía,
ley de Ohm, extremos de parámetros y exportación segura de texto.

El proyecto incluye Three.js 0.178.0 localmente, con su licencia MIT en
`vendor/THREE-LICENSE.txt`. No se requiere descargar dependencias para usarlo.
