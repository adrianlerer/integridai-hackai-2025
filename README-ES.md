# Suite IntegridAI - Plataforma Pública HackAI 2025

## 🎯 Descripción General

**Suite IntegridAI** es la plataforma RegTech líder de Argentina para la gestión de integridad corporativa y cumplimiento, construida alrededor de la **Ley 27.401** (Ley de Responsabilidad Penal Empresaria Argentina). Este repositorio público ofrece un entorno colaborativo para que los participantes de HackAI 2025 exploren, extiendan e innoven en tecnología de cumplimiento del mundo real.

## 🏗️ Arquitectura

### Componentes Principales

#### **🌐 Landing IntegridAI** (`integridai-landing-real/`)
Página de destino profesional que muestra todo el ecosistema IntegridAI. Construida con React y optimizada para despliegue en producción.

**Características Principales:**
- Marca corporativa y mensajería
- Demostraciones de funcionalidades
- Resumen de puntos de integración
- Build listo para producción

#### **🎮 FlaiSimulator** (`flaisimulator-fixed/`)
Plataforma interactiva de entrenamiento en cumplimiento con capacidades de IA conversacional para educación en Ley 27.401.

**Características Principales:**
- Motor de conversación impulsado por IA (framework P4)
- Tres personajes especializados: Dr. Mentor, Ana Auditora, Carlos CEO
- Escenarios de cumplimiento del mundo real
- Seguimiento de progreso y rutas de certificación

#### **🔧 APIs Backend** (`api/`, `src/`)
Endpoints de API simulados e infraestructura backend para desarrollo y experimentación.

**Endpoints Disponibles:**
- APIs de evaluación de cumplimiento
- Simuladores de gestión de riesgos
- Frameworks de pruebas de integración
- Pipelines de procesamiento de datos

## 🚀 Inicio Rápido

### Prerrequisitos
- Git
- Python 3.8+ o Node.js 16+
- Navegador web

### Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025

# Opción 1: Landing IntegridAI
cd integridai-landing-real
python -m http.server 3000
# Acceso: http://localhost:3000

# Opción 2: FlaiSimulator  
cd flaisimulator-fixed
python -m http.server 3001
# Acceso: http://localhost:3001

# Opción 3: Desarrollo Backend
cd api
python -m http.server 3002
# Acceso: http://localhost:3002
```

## 🎯 Oportunidades de Colaboración HackAI 2025

### **🎨 Mejora de Frontend**
Modernizar y mejorar las interfaces de usuario en todos los componentes de la plataforma:

- **Optimización de Landing Page**: Mejorar UX/UI de `integridai-landing-real/`
- **Biblioteca de Componentes**: Crear componentes UI reutilizables
- **Diseño Responsive**: Experiencia móvil mejorada
- **Accesibilidad**: Implementación de cumplimiento WCAG

### **🔌 Integración de API**
Conectar módulos de la plataforma a través de arquitectura API robusta:

- **Arquitectura de Microservicios**: Diseñar conexiones de servicios escalables
- **Comunicación en Tiempo Real**: Implementaciones WebSocket
- **Sincronización de Datos**: Gestión de estado cross-platform
- **Sistemas de Autenticación**: Control de acceso seguro

### **🧠 Extensiones de FlaiSimulator**
Mejorar la plataforma de entrenamiento de IA conversacional:

- **Nuevos Módulos de Entrenamiento**: Escenarios de cumplimiento adicionales
- **Conversaciones IA Avanzadas**: Procesamiento de lenguaje natural mejorado
- **Funcionalidades de Gamificación**: Sistemas de progreso y logros
- **Soporte Multi-idioma**: Localización español/inglés

### **🔗 Integración de Módulos**
Crear conexiones fluidas entre componentes de la plataforma:

- **Dashboard Unificado**: Acceso de punto único a todas las funcionalidades
- **Analítica de Datos**: Insights y reportes cross-platform
- **Automatización de Workflows**: Orquestación de procesos de cumplimiento
- **Integraciones de Terceros**: Conexiones de servicios externos

## 📁 Estructura del Repositorio

```
integridai-hackai-2025/
├── integridai-landing-real/     # Página de destino de producción
│   ├── assets/                  # Imágenes, fuentes, JS/CSS compilados
│   ├── images/                  # Imágenes de contenido
│   ├── index.html              # Página de destino principal
│   ├── _headers                # Configuración de headers de Netlify
│   └── _redirects              # Reglas de enrutamiento de Netlify
│
├── flaisimulator-fixed/         # Plataforma de entrenamiento interactivo
│   ├── index.html              # Aplicación principal
│   ├── app.js                  # Funcionalidad central y motor IA
│   ├── netlify.toml            # Configuración de despliegue
│   └── _redirects              # Enrutamiento SPA
│
├── api/                         # Endpoints de API simulados
│   ├── mock/                   # Servicios de datos simulados
│   ├── endpoints/              # Definiciones de rutas API
│   └── middleware/             # Procesamiento de request/response
│
├── src/                         # Código fuente y utilidades
│   ├── components/             # Componentes UI reutilizables
│   ├── services/              # Lógica de negocio
│   └── utils/                 # Funciones helper
│
├── hackathon/                   # Recursos específicos de HackAI 2025
│   ├── challenges/             # Desafíos de desarrollo
│   ├── guidelines/             # Guías de contribución
│   └── resources/              # Documentación y assets
│
└── docs/                        # Documentación técnica
    ├── API.md                  # Documentación de API
    ├── DEPLOYMENT.md           # Guías de despliegue
    └── ARCHITECTURE.md         # Arquitectura del sistema
```

## 🛠️ Guías de Desarrollo

### **Estándares de Código**
- **ES6+ JavaScript** para desarrollo frontend
- **Python 3.8+** para servicios backend
- **Versionado semántico** para releases
- **Commits convencionales** para historial git

### **Requisitos de Testing**
- **Unit tests** para funcionalidad principal
- **Tests de integración** para endpoints API
- **Tests E2E** para workflows de usuario
- **Benchmarks de rendimiento** para optimización

### **Documentación**
- **Comentarios de código** para lógica compleja
- **Documentación de API** usando OpenAPI/Swagger
- **Archivos README** para cada componente principal
- **Change logs** para actualizaciones de versión

## 🔐 Consideraciones de Seguridad

Este repositorio público contiene **código de demostración y desarrollo únicamente**:

- ❌ **Sin credenciales de producción** o datos sensibles
- ❌ **Sin información real de usuarios** o datos corporativos
- ❌ **Sin API keys de producción** o tokens de autenticación
- ✅ **Datos simulados y respuestas mock** para desarrollo seguro
- ✅ **Ejemplos sanitizados** y casos de prueba
- ✅ **Documentación pública** y componentes open-source

## 🎯 Producción vs Desarrollo

| Componente | Desarrollo (Este Repo) | Producción (Privado) |
|-----------|------------------------|---------------------|
| **Autenticación** | Mock/Deshabilitado | OAuth/SAML completo |
| **Fuentes de Datos** | Simuladas | APIs reales AFIP/BCRA/CNV |
| **Base de Datos** | SQLite/archivos JSON | Cluster PostgreSQL |
| **Analytics** | Logging local | Monitoreo empresarial |
| **Cumplimiento** | Escenarios demo | Datos corporativos reales |

## 🌟 Contribuciones

### **Primeros Pasos**
1. **Fork** de este repositorio
2. **Crear** una rama de feature (`git checkout -b feature/funcionalidad-increible`)
3. **Commit** tus cambios (`git commit -m 'Agregar funcionalidad increíble'`)
4. **Push** a la rama (`git push origin feature/funcionalidad-increible`)
5. **Abrir** un Pull Request

### **Áreas de Contribución**
- **🐛 Corrección de bugs** y mejoras de estabilidad
- **✨ Nuevas funcionalidades** y mejoras de funcionalidad
- **📚 Actualizaciones de documentación** y mejoras
- **🎨 Diseño UI/UX** y mejoras de experiencia de usuario
- **⚡ Optimizaciones de rendimiento** y refactoring
- **🧪 Cobertura de testing** y aseguramiento de calidad

## 📞 Soporte y Recursos

### **Recursos HackAI 2025**
- **Repositorio del Proyecto**: [github.com/adrianlerer/integridai-hackai-2025](https://github.com/adrianlerer/integridai-hackai-2025)
- **Demos en Vivo**: Disponibles durante sesiones del hackathon
- **Soporte Técnico**: Via GitHub Issues y discusiones
- **Documentación**: Guías completas en directorio `/docs`

### **Stack Tecnológico**
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, Node.js
- **Base de Datos**: SQLite (dev), PostgreSQL (producción)
- **Despliegue**: Netlify, Vercel, Docker
- **APIs**: REST, WebSocket, GraphQL

---

## 📋 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** - ver el archivo [LICENSE](LICENSE) para detalles.

## 🎯 Reconocimientos

- **Universidad Austral** - Organización HackAI 2025
- **MiniMax AI** - Desarrollo original de la landing page
- **Equipo IntegridAI** - Arquitectura y diseño de la plataforma
- **Comunidad Open Source** - Librerías y frameworks

---

**Construido para HackAI 2025 | Universidad Austral | Desafío de Innovación RegTech**