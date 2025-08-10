# Sistema de Registro para Olimpiadas Matemáticas

Este sistema permite a los estudiantes registrarse para las olimpiadas matemáticas y mantiene una lista actualizada de participantes con estadísticas en tiempo real.

## 🏗️ Arquitectura del Sistema

### Frontend
- **registro.html**: Página de registro con formulario interactivo y lista de participantes
- **olimpiadas.html**: Página principal de olimpiadas con CTA actualizado

### Backend APIs
- **api/register.js**: Maneja el registro de nuevos participantes
- **api/participants.js**: Obtiene la lista de participantes registrados
- **api/stats.js**: Gestiona estadísticas globales y votaciones de roles

### Base de Datos
- **Vercel KV**: Base de datos Redis para almacenamiento en la nube
- **Fallback LocalStorage**: Respaldo local cuando la API no está disponible

## 🚀 Configuración

### 1. Configurar Vercel KV

```bash
# Instalar Vercel CLI
npm i -g vercel

# Crear una base de datos KV
vercel kv create olimpiadas-db

# Vincular el proyecto
vercel link
```

### 2. Variables de Entorno

Agregar a tu proyecto de Vercel:

```env
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### 3. Estructura de Archivos

```
proyecto/
├── index.html
├── club/
│   ├── olimpiadas.html
│   └── registro.html
├── api/
│   ├── register.js
│   ├── participants.js
│   └── stats.js
├── package.json
├── vercel.json
└── README.md
```

### 4. Despliegue

```bash
# Desplegar a Vercel
vercel deploy

# Desplegar a producción
vercel --prod
```

## 📊 Estructura de Datos

### Participante
```json
{
  "id": "participant_1234567890_abc123",
  "fullName": "María González López",
  "email": "maria@email.com",
  "age": 16,
  "grade": "10mo",
  "school": "Escuela Superior María Teresa Piñeiro",
  "category": "intermedio",
  "experience": "moderada",
  "motivation": "Me encantan los desafíos matemáticos",
  "role": "estudiante",
  "registrationDate": "2025-01-01T10:00:00.000Z",
  "status": "active"
}
```

### Estadísticas
```json
{
  "visitantes": 1250,
  "estudiantes": 45,
  "maestros": 8,
  "padres": 23,
  "otros": 12,
  "participantesOlimpiadas": 45,
  "registrosHoy": 3,
  "lastUpdated": "2025-01-01T10:00:00.000Z"
}
```

## 🔑 Claves de Redis (Vercel KV)

### Participantes
- `participant:{email}` - Datos del participante por email
- `participant:id:{id}` - Datos del participante por ID
- `participants:list` - Lista de IDs de participantes

### Estadísticas
- `site:statistics` - Estadísticas generales del sitio
- `stats:daily:{YYYY-MM-DD}` - Estadísticas diarias
- `visitors:total` - Total de visitantes
- `visitors:daily:{YYYY-MM-DD}` - Visitantes por día
- `role:votes:{role}` - Votaciones por rol

## 🔧 Funcionalidades

### Registro de Participantes
- ✅ Formulario con validación en tiempo real
- ✅ Verificación de emails duplicados
- ✅ Categorización automática por experiencia
- ✅ Almacenamiento seguro en Vercel KV
- ✅ Fallback a localStorage sin conexión

### Lista de Participantes
- ✅ Vista en tiempo real de registrados
- ✅ Estadísticas dinámicas
- ✅ Ordenamiento y filtrado
- ✅ Protección de datos sensibles
- ✅ Paginación para grandes listas

### Estadísticas Globales
- ✅ Contadores en tiempo real
- ✅ Integración con página principal
- ✅ Votaciones de roles
- ✅ Métricas de visitantes
- ✅ Análisis diarios y semanales

## 🛡️ Seguridad y Privacidad

### Validación de Datos
- Validación en frontend y backend
- Sanitización de entradas
- Límites de edad y formato de email
- Prevención de registros duplicados

### Protección de Datos
- Los emails no se muestran públicamente
- Límites de tasa para APIs
- Expiración automática de datos temporales
- Solo se almacenan datos necesarios

## 📱 Diseño Responsive

### Características
- ✅ Diseño mobile-first
- ✅ Grid responsive para estadísticas
- ✅ Formulario adaptativo
- ✅ Navegación optimizada para móviles
- ✅ Tipografía escalable

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Sistema de Diseño

### Colores
- Primario: `#2563eb` (Azul)
- Secundario: `#7c3aed` (Púrpura)
- Acento: `#f59e0b` (Ámbar)
- Éxito: `#10b981` (Verde)
- Peligro: `#ef4444` (Rojo)

### Tipografía
- Principal: 'Inter' (San-serif)
- Títulos: 'Space Grotesk' (Sans-serif)
- Tamaños: Sistema modular escalable

## 🚦 Estados de la Aplicación

### Estados de Carga
- Skeleton loaders para participantes
- Spinners para formularios
- Mensajes de estado informativos

### Estados de Error
- Manejo graceful de errores de API
- Fallbacks automáticos a localStorage
- Mensajes de error user-friendly

### Estados Vacíos
- Mensajes motivacionales
- CTAs para primeros registros
- Iconografía apropiada

## 📈 Monitoreo y Analytics

### Métricas Rastreadas
- Registros por día/semana/mes
- Distribución por categorías
- Distribución por grados
- Tasa de conversión de visitantes

### Logs
- Errores de API en consola
- Registros exitosos
- Estadísticas de performance
- Uso de fallbacks

## 🔄 Actualización de Datos

### Sincronización
- Auto-actualización cada 30 segundos
- Refresh manual disponible
- Sincronización entre pestañas
- Indicadores visuales de estado

### Cache
- Cache de participantes en memoria
- Invalidación inteligente
- Estrategias de retry para APIs fallidas

## 🎯 Próximas Mejoras

### Funcionalidades Planeadas
- [ ] Notificaciones push para nuevos registros
- [ ] Exportación de listas a CSV/Excel
- [ ] Dashboard administrativo
- [ ] Sistema de categorización automática
- [ ] Integración con calendar para eventos
- [ ] Notificaciones por email
- [ ] Certificados automáticos de participación

### Optimizaciones Técnicas
- [ ] Implementar Service Workers
- [ ] Optimizar consultas de base de datos
- [ ] Añadir índices para búsquedas rápidas
- [ ] Implementar rate limiting más granular
- [ ] Añadir tests automatizados

## 📞 Soporte

Para problemas técnicos o preguntas sobre el sistema:
- Revisar logs en Vercel Dashboard
- Verificar configuración de Vercel KV
- Comprobar variables de entorno
- Validar estructura de datos en Redis

## 📄 Licencia

Este proyecto es parte del sistema educativo del Prof. Yonatan Guerrero Soriano y está destinado para uso académico en el Departamento de Educación de Puerto Rico.