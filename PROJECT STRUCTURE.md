# 📁 Estructura del Proyecto - Olimpiadas Matemáticas

Esta es la estructura completa del proyecto de la página web de Matemáticas Digitales con el sistema de registro para olimpiadas.

## 🏗️ Arquitectura del Sistema

```
pagina-matematicas/
├── 📄 index.html                    # Página principal con estadísticas integradas
├── 📄 package.json                  # Dependencias y configuración de npm
├── 📄 vercel.json                   # Configuración de despliegue en Vercel
├── 📄 .env.example                  # Template de variables de entorno
├── 📄 README.md                     # Documentación principal
├── 📄 PROJECT_STRUCTURE.md          # Este archivo - estructura del proyecto
│
├── 📂 api/                          # APIs de backend (Vercel Functions)
│   ├── 📄 register.js               # API para registro de participantes
│   ├── 📄 participants.js           # API para obtener lista de participantes
│   └── 📄 stats.js                  # API para estadísticas globales
│
├── 📂 club/                         # Sección del Club de Matemáticas
│   ├── 📄 olimpiadas.html           # Página principal de olimpiadas (ACTUALIZADA)
│   ├── 📄 registro.html             # Formulario de registro para olimpiadas
│   ├── 📄 admin.html                # Dashboard administrativo
│   ├── 📄 competencias.html         # Competencias digitales
│   ├── 📄 proyectos-creativos.html  # Proyectos del club
│   └── 📄 investigacion.html        # Investigaciones matemáticas
│
├── 📂 js/                           # Módulos JavaScript
│   ├── 📄 visitor-counter.js        # Sistema de contadores actualizado
│   ├── 📄 chatbot.js                # Chatbot matemático
│   ├── 📄 dark-mode.js              # Modo oscuro
│   ├── 📄 icon-animations.js        # Animaciones de iconos
│   ├── 📄 typewriter-effects.js     # Efectos de escritura
│   ├── 📄 math-particles.js         # Partículas matemáticas
│   └── 📄 migrate-data.js           # Herramienta de migración de datos
│
├── 📂 scripts/                      # Scripts de utilidad y migración
│   ├── 📄 migrate-data.js           # Script de migración independiente
│   ├── 📄 backup-data.js            # Script de respaldo
│   └── 📄 deploy.js                 # Script de despliegue
│
├── 📂 imagenes/                     # Recursos gráficos
│   ├── 📄 mi_foto.jpg               # Foto del profesor
│   ├── 📄 fondo2.jpg                # Imagen de fondo
│   ├── 📄 banner-linkedin.jpg       # Banner para redes sociales
│   └── 📂 trabajos/                 # Trabajos de estudiantes
│       ├── 📄 trabajo1.jpg
│       ├── 📄 trabajo2.jpg
│       └── ...
│
├── 📂 materiales/                   # Materiales educativos
│   ├── 📄 materiales.html
│   └── 📂 documentos/
│
├── 📂 stem/                         # Sección STEM
│   ├── 📄 ciencia-datos.html
│   ├── 📄 robotica.html
│   ├── 📄 programacion.html
│   ├── 📄 ingenieria.html
│   └── 📂 Ebook STEM/
│
├── 📂 contexto/                     # Contexto histórico
│   └── 📄 historiamath.html
│
├── 📂 links/                        # Enlaces educativos
│   └── 📄 links.html
│
├── 📂 galeria/                      # Galería de imágenes
│   └── 📄 galeria.html
│
└── 📂 lab/                          # Laboratorio matemático
    ├── 📄 experimentos.html
    ├── 📄 simulaciones.html
    ├── 📄 juegos.html
    └── 📄 modelado.html
```

## 🔧 Componentes Principales

### 📊 Sistema de Registro (NUEVO)
- **registro.html**: Formulario de registro con validación en tiempo real
- **API register.js**: Maneja el registro en Vercel KV
- **API participants.js**: Obtiene lista de participantes con paginación
- **API stats.js**: Gestiona estadísticas globales y votaciones

### 📈 Dashboard Administrativo (NUEVO)
- **admin.html**: Panel de control para el profesor
- Estadísticas en tiempo real
- Exportación de datos en JSON/CSV
- Filtrado y búsqueda de participantes

### 🔄 Sistema de Migración (NUEVO)
- **migrate-data.js**: Migra datos de localStorage a Vercel KV
- Interfaz visual para el proceso de migración
- Respaldo de datos antes de migración
- Validación y logs de errores

### 📊 Contadores Integrados (ACTUALIZADO)
- **visitor-counter.js**: Sistema completo de estadísticas
- Integración con APIs de Vercel KV
- Fallback automático a localStorage
- Votaciones de roles de usuarios

## 🎯 Flujo de Datos

### Registro de Participantes
```
Usuario → registro.html → API register.js → Vercel KV → Confirmación
                       ↓
                    localStorage (fallback)
```

### Visualización de Datos
```
admin.html → API participants.js → Vercel KV → Dashboard
          ↓                                   ↑
    localStorage ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
    (fallback)                           (refresh)
```

### Estadísticas Globales
```
index.html → visitor-counter.js → API stats.js → Vercel KV
                                ↓                    ↑
                           localStorage ← ← ← ← ← ← ←
                           (fallback)        (sync)
```

## 🔐 Variables de Entorno

### Requeridas para Producción
```env
KV_REST_API_URL=https://your-kv-database.upstash.io
KV_REST_API_TOKEN=your_secure_token
```

### Opcionales para Desarrollo
```env
NODE_ENV=development
DEBUG_MODE=true
ENABLE_MIGRATION_UI=true
```

## 📱 Características Responsive

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Componentes Adaptativos
- ✅ Formulario de registro
- ✅ Dashboard administrativo
- ✅ Navegación móvil
- ✅ Tablas con scroll horizontal
- ✅ Grids responsivos

## 🛡️ Seguridad Implementada

### Validación de Datos
- **Frontend**: Validación en tiempo real con JavaScript
- **Backend**: Validación servidor en APIs
- **Base de Datos**: Validación de tipos en Vercel KV

### Protección de Información
- Emails no se muestran públicamente
- Rate limiting en APIs
- Sanitización de entradas
- CORS configurado correctamente

## 🚀 Despliegue en Vercel

### Archivos de Configuración
- **vercel.json**: Configuración de rutas y funciones
- **package.json**: Dependencias y scripts
- **.env**: Variables de entorno (no incluido en git)

### Pasos de Despliegue
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Crear base de datos Vercel KV
4. Desplegar automáticamente

## 📊 Base de Datos (Vercel KV)

### Estructura de Datos

#### Participantes
```redis
participant:{email} → JSON completo del participante
participant:id:{id} → JSON completo del participante
participants:list → Lista de IDs de participantes
```

#### Estadísticas
```redis
site:statistics → Estadísticas generales
stats:daily:{YYYY-MM-DD} → Estadísticas diarias
visitors:total → Contador total de visitantes
visitors:daily:{YYYY-MM-DD} → Visitantes por día
role:votes:{role} → Votaciones por rol
```

## 🔄 Sincronización de Datos

### Estrategia Híbrida
1. **Primario**: Vercel KV (nube)
2. **Secundario**: localStorage (local)
3. **Migración**: Automática con UI visual
4. **Fallback**: Automático sin conexión

### Consistencia
- Sincronización cada 30 segundos
- Validación de integridad
- Manejo de conflictos
- Logs de errores

## 📈 Monitoreo y Analytics

### Métricas Rastreadas
- **Visitantes**: Total, diarios, semanales
- **Registros**: Por día, categoría, grado
- **Conversión**: Visitante → Registro
- **Engagement**: Tiempo en página, interacciones

### Herramientas
- Console logs para desarrollo
- Vercel Analytics (opcional)
- Dashboard administrativo
- Exportación de datos

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primario**: `#2563eb` (Azul)
- **Secundario**: `#7c3aed` (Púrpura)
- **Acento**: `#f59e0b` (Ámbar)
- **Éxito**: `#10b981` (Verde)
- **Peligro**: `#ef4444` (Rojo)

### Tipografía
- **Principal**: 'Inter' (Texto general)
- **Títulos**: 'Space Grotesk' (Headings)
- **Código**: 'Courier New' (Monospace)

### Componentes Reutilizables
- Botones con estados hover
- Cards con sombras dinámicas
- Formularios con validación visual
- Tablas responsivas
- Modales y overlays

## 🔧 Herramientas de Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Desarrollo local
npm run build        # Construcción
npm run deploy       # Despliegue a Vercel
npm run migrate      # Migración de datos
npm run backup       # Respaldo de datos
```

### Utilidades
- **migrate-data.js**: Migración visual de datos
- **admin.html**: Dashboard completo
- **visitor-counter.js**: Sistema de estadísticas
- **.env.example**: Template de configuración

## 📱 Funcionalidades Móviles

### Navegación
- Menú hamburguesa animado
- Navegación touch-friendly
- Breadcrumbs en páginas internas

### Formularios
- Teclados apropiados (numeric, email)
- Validación en tiempo real
- Mensajes de error claros

### Visualización
- Tablas con scroll horizontal
- Cards adaptativas
- Métricas stack en móvil

## 🔮 Roadmap de Mejoras

### Próximas Funcionalidades
- [ ] Notificaciones push
- [ ] Integración con Google Calendar
- [ ] Sistema de chat en vivo
- [ ] Certificates automáticos
- [ ] App móvil PWA

### Optimizaciones Técnicas
- [ ] Service Workers
- [ ] Cache estratégico
- [ ] Lazy loading de imágenes
- [ ] Compresión de assets
- [ ] CDN para imágenes

### Integraciones
- [ ] Google Classroom
- [ ] Microsoft Teams
- [ ] Slack notifications
- [ ] Email marketing
- [ ] Social media sharing

## 🆘 Solución de Problemas

### Errores Comunes
1. **Variables de entorno no configuradas**
2. **Base de datos KV no conectada**
3. **APIs no desplegadas correctamente**
4. **CORS mal configurado**

### Debugging
- Verificar logs en Vercel Dashboard
- Comprobar Network tab en DevTools
- Revisar localStorage en caso de fallback
- Validar estructura de datos en KV

## 📞 Soporte y Contacto

### Para Desarrollo
- Revisar documentación en `/README.md`
- Consultar estructura en este archivo
- Verificar ejemplos en `.env.example`

### Para Uso Educativo
- Contactar: Prof. Yonatan Guerrero Soriano
- Escuela: María Teresa Piñeiro
- Departamento: Educación de Puerto Rico

---

**📝 Nota**: Esta estructura está diseñada para ser escalable y mantenible. Cada componente tiene una responsabilidad específica y puede ser modificado independientemente.