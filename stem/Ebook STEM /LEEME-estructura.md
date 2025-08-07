# Estructura del Proyecto: Modelando Poblaciones de Bacterias con el Modelo Logístico

## Estructura de Carpetas

Para una correcta organización del proyecto, sigue esta estructura de carpetas:

```
📁 modelado-bacterias-ebook/
│
├── 📄 index.html              # Página principal del eBook
├── 📄 styles.css              # Estilos CSS principales
├── 📄 script.js               # JavaScript para funcionalidades básicas
├── 📄 nuevas-funciones.js     # JavaScript para funcionalidades avanzadas
│
├── 📁 images/                 # Carpeta para imágenes
│   ├── 📄 logo-ebook.png
│   ├── 📄 bacteria-hero.png
│   ├── 📄 crecimiento-exponencial.png
│   ├── 📄 crecimiento-logistico.png
│   ├── 📄 modelo-matematico.png
│   ├── 📄 factores-limitantes.png
│   ├── 📄 colonia-bacterias.png
│   ├── 📄 aplicaciones-reales.png
│   ├── 📄 fase-lag.png
│   ├── 📄 fase-lag-thumb.png
│   ├── 📄 fase-exponencial.png
│   ├── 📄 fase-exponencial-thumb.png
│   ├── 📄 fase-estacionaria.png
│   ├── 📄 fase-estacionaria-thumb.png
│   ├── 📄 fase-muerte.png
│   └── 📄 fase-muerte-thumb.png
│
└── 📁 docs/                   # Documentación y recursos adicionales
    ├── 📄 guia-docente.md     # Guía para docentes
    └── 📄 actividades-complementarias.md   # Actividades complementarias
```

## Orden de las Secciones en index.html

Las secciones en el archivo HTML deben seguir este orden específico para asegurar que la navegación y la funcionalidad del indicador de progreso funcionen correctamente:

1. `#introduccion` - Introducción
2. `#relevancia` - Relevancia STEAM
3. `#nivel-educativo` - Nivel Educativo
4. `#objetivos` - Objetivos
5. `#contenido` - Contenido
6. `#integracion` - Integración STEAM
7. `#metodologia` - Metodología
8. `#simulacion` - Simulación
9. `#casos-reales` - Casos de Estudio Reales
10. `#visualizacion-avanzada` - Visualización Avanzada
11. `#laboratorio-virtual` - Laboratorio Virtual
12. `#quiz` - Quiz Interactivo
13. `#adaptaciones` - Adaptaciones
14. `#evaluacion` - Evaluación
15. `#reflexion` - Reflexión
16. `#glosario` - Glosario
17. `#referencias` - Referencias

## Grupos de Secciones para el Indicador de Progreso

El indicador de progreso organiza las secciones en cinco grupos principales:

1. **Intro**: introduccion, relevancia, nivel-educativo, objetivos
2. **Content**: contenido, integracion, metodologia
3. **Simulation**: simulacion, visualizacion-avanzada
4. **Activities**: casos-reales, laboratorio-virtual, quiz
5. **Evaluation**: adaptaciones, evaluacion, reflexion, glosario, referencias

## Instrucciones para Añadir Imágenes

1. Todas las imágenes deben guardarse en la carpeta `images/`
2. Todas las referencias a imágenes en el código deben usar la ruta relativa `images/nombre-imagen.png`
3. Se recomienda optimizar las imágenes para web antes de incluirlas (formatos WebP o PNG optimizado)
4. Asegúrate de que todas las imágenes incluyan el atributo `loading="lazy"` para mejorar el rendimiento

## Orden de Carga de Scripts

Para un rendimiento óptimo, los scripts se cargan en el siguiente orden:

1. Scripts externos (Chart.js, MathJax) con atributo `defer`
2. `script.js` - Funcionalidad principal
3. `nuevas-funciones.js` - Funcionalidades avanzadas

## Estilos para Impresión

El archivo CSS incluye reglas específicas para la impresión, que ocultan elementos innecesarios y ajustan el formato para una mejor legibilidad cuando se imprime el eBook.

## Recursos Adicionales

- La **Guía del Docente** (`docs/guia-docente.md`) proporciona estrategias pedagógicas para implementar esta lección.
- Las **Actividades Complementarias** (`docs/actividades-complementarias.md`) ofrecen actividades adicionales para extender el aprendizaje.

---

Si necesitas modificar la estructura o añadir nuevas secciones, asegúrate de actualizar también:

1. Los enlaces en la barra de navegación lateral
2. Los arrays de agrupación de secciones en `script.js`
3. Los estilos correspondientes en `styles.css`