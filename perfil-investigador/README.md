# Perfil de Investigador - Dr. Yonatan Guerrero

Página web profesional dedicada al estudio de la Inteligencia Artificial en Educación.

## 📋 Contenido del Proyecto

- `index.html` - Página web completa y autónoma
- `README.md` - Este archivo (documentación)

## 🚀 Cómo Usar

1. **Abrir localmente**: Simplemente abre `index.html` en tu navegador
2. **Publicar en línea**: Sube el archivo a cualquier hosting web (GitHub Pages, Netlify, Vercel, etc.)

## 🎨 Características

### Diseño
- ✅ **Estética Editorial Académica Moderna**
- ✅ Tipografía distintiva (Cormorant Garamond + Spectral)
- ✅ Tema oscuro con acentos dorados
- ✅ Iconos geométricos CSS (sin emojis)
- ✅ Completamente responsive

### Secciones
1. **Hero** - Presentación del investigador
2. **Áreas de Investigación** - 6 áreas de especialización en IA
3. **Publicaciones Destacadas** - Artículos reales sobre IA en educación (2023-2025)
4. **Contacto** - Enlaces profesionales

### Animaciones
- Grid de fondo animado
- Orbes de gradiente con efecto parallax
- Cajas geométricas flotantes
- Animaciones de scroll (Intersection Observer)
- Efectos hover en todas las tarjetas y enlaces
- Navegación suave entre secciones

## 🛠️ Tecnologías

- **HTML5** puro
- **CSS3** con variables personalizadas
- **Vanilla JavaScript** (sin frameworks)
- **Google Fonts** (Cormorant Garamond, Spectral)

## 📱 Responsive

- ✅ Desktop (1400px+)
- ✅ Tablet (1024px)
- ✅ Mobile (768px)

## ✏️ Personalización

### Cambiar colores
Edita las variables CSS en la sección `:root` (líneas 11-23):
```css
--color-bg: #0a0a0a;           /* Fondo principal */
--color-accent: #d4a574;       /* Color de acento */
--color-text: #e8e8e8;         /* Texto principal */
```

### Modificar contenido
- **Nombre/título**: Busca "Dr. Yonatan Guerrero" en el HTML
- **Áreas de investigación**: Sección con id="research"
- **Publicaciones**: Sección con id="publications"
- **Contacto**: Sección con id="contact"

### Agregar tu investigación
Añade un nuevo elemento en la sección de publicaciones:
```html
<div class="publication-item">
    <div class="publication-year">2024</div>
    <h3>Título de tu investigación</h3>
    <p class="publication-authors">Tu nombre, Co-autores</p>
    <p class="publication-venue">Venue/Journal</p>
</div>
```

## 📊 Arquitectura

### Estructura del Código
- **Líneas 1-659**: Head (meta, fonts, CSS completo)
- **Líneas 660-814**: Body (estructura HTML)
- **Líneas 816-863**: JavaScript (interactividad)

### Sistema de Capas
- `z-index: 1` → Contenido principal
- `z-index: 0` → Elementos de fondo (grid, orbes)
- `z-index: -1` → Efectos internos (pseudo-elementos)

## 🎯 Principios de Diseño

Basado en la **frontend-design skill** de Claude Code:

1. **Tipografía distintiva** - NO usar Inter, Roboto, Arial
2. **Paleta sofisticada** - Evitar gradientes púrpura genéricos
3. **Iconos únicos** - Elementos geométricos CSS, no emojis
4. **Animaciones contextuales** - Sutiles pero impactantes
5. **Layout editorial** - Números grandes, composición asimétrica

## 📝 Publicaciones Actuales

Las publicaciones incluidas son artículos **reales** sobre IA en educación:

- (2025) AI and the Future of Education - Naayini, P.
- (2024) Generative ITS with GPT-4 - MDPI
- (2024) AI in Science Education - Springer
- (2023) ITS Toward Sustainable Education - Huang & Lu
- (2023) ITS Learning Gains - D'Mello & Graesser

**Nota**: Reemplaza estas con tus propias publicaciones cuando estén listas.

## 🔗 Próximos Pasos

1. ✅ Agregar enlace real de tu investigación
2. ⬜ Actualizar email de contacto
3. ⬜ Añadir enlaces reales a LinkedIn, Google Scholar, GitHub
4. ⬜ Subir a hosting web
5. ⬜ Configurar dominio personalizado (opcional)

## 📄 Licencia

Página creada para Dr. Yonatan Guerrero - 2024

---

**Creado con Claude Code** usando la skill `frontend-design`
