# IntegridAI RegTech Platform - HackAI 2025

![IntegridAI Logo](https://img.shields.io/badge/IntegridAI-RegTech%20Platform-blue?style=for-the-badge&logo=react)
![HackAI 2025](https://img.shields.io/badge/HackAI-2025-gold?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=openai)
![RAG Hybrid](https://img.shields.io/badge/RAG-HYBRID%20v3.0-purple?style=for-the-badge&logo=databricks)
![Game Changer](https://img.shields.io/badge/GAME-CHANGER-red?style=for-the-badge&logo=rocket)
![FLAISimulator](https://img.shields.io/badge/FLAISimulator-VIRAL%20MVP-orange?style=for-the-badge&logo=gamepad2)

## 🚀 Plataforma IntegridAI - HackAI 2025

### 🎯 **Sistema Integral de Compliance Empresarial**

Plataforma RegTech especializada en la **Ley 27401** que combina herramientas de evaluación, capacitación y simulación para empresas argentinas.

#### 🛠️ **Componentes Principales:**
1. **📋 Encuesta de Integridad** → Evaluación detallada del estado de compliance
2. **🎮 FLAISimulator** → Simulación interactiva de escenarios éticos  
3. **🤖 Sistema IA** → Asistente conversacional para consultas de compliance

#### ✨ **Características Técnicas:**
1. **Formularios Dinámicos** → Lógica condicional y validación en tiempo real
2. **Almacenamiento Confiable** → Triple backup de datos (Local + IndexedDB + Servidor)
3. **Exportación Completa** → Datos en CSV/JSON para análisis empresarial
4. **Integración Email** → Compartir automático con equipos de compliance
5. **Design Responsive** → Funciona en móviles y desktop
6. **Enfoque Ley 27401** → Contenido específico para regulación argentina

---

## 🚀 Plataforma de Compliance Empresarial con IA Conversacional

Plataforma RegTech especializada en **Ley 27.401** (Responsabilidad Penal Empresaria Argentina) con IA conversacional real para entrenamiento en compliance y simulación de escenarios de corrupción.

## 📋 Módulos Incluidos

### 🎮 FLAISimulator - Simulador de Ética Empresarial
- **Catalina Oportunista**: Personaje IA que presenta tentaciones de corrupción
- **Dr. Mentor**: Experto académico que explica aspectos legales
- **Ana Auditora**: Especialista en controles internos y procedimientos
- **Carlos CEO**: Perspectiva ejecutiva sobre decisiones estratégicas

**Características del simulador:**
- ✅ **Escenarios Interactivos** basados en casos reales del mercado argentino
- ✅ **Training Gamificado** con mecánicas de juego para mejor engagement  
- ✅ **Feedback Personalizado** según las decisiones del usuario
- ✅ **Contenido Ley 27401** específicamente desarrollado para compliance argentino
- ✅ **Análisis Post-Simulación** con recomendaciones de mejora

### 📋 Encuesta de Integridad Empresarial
- **🏢 Evaluación Completa**: 6 secciones con 50+ preguntas específicas
- **⚖️ Enfoque Ley 27401**: Contenido especializado en regulación argentina
- **💾 Datos Confiables**: Triple almacenamiento para garantizar recolección
- **📊 Exportación Completa**: CSV/JSON para análisis empresarial
- **📧 Integración Team**: Compartir automático con equipos de compliance

### 🌐 Portal Principal
- Información corporativa
- Documentación técnica
- Enlaces a [integridai.com.ar](https://integridai.com.ar)

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Netlify Functions (Node.js)
- **IA**: OpenRouter API con Claude 3.5 Sonnet
- **Deployment**: Netlify
- **Especialización**: Ley 27.401 Argentina

## 🚀 Deployment en Netlify

### Requisitos Previos
- Cuenta de Netlify
- Clave API de OpenRouter
- Node.js 18+

### Pasos de Deployment

1. **Conectar con Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Configurar Variables de Entorno**
   En Netlify Dashboard → Site settings → Environment variables:
   ```
   OPENROUTER_API_KEY=tu_clave_api_aqui
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=public
   ```

### Configuración de Build
```toml
[build]
  publish = "public"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
```

## 🎯 Funcionalidades Principales

### IA Conversacional Real
- ✅ Integración con OpenRouter API
- ✅ Claude 3.5 Sonnet para análisis de compliance
- ✅ Prompts XML estructurados para expertise en Ley 27.401
- ✅ Reasoning levels adaptativos (bajo/medio/alto)

### Simulación de Corrupción
- ⚠️ Catalina Oportunista: Tentaciones realistas de corrupción
- 🎯 Escenarios contextualizados por sector empresarial
- 📚 Análisis post-simulación con expertos en compliance
- ⚖️ Evaluación de riesgos según Ley 27.401

## 🎮 **FLAISimulator - Viral Ethics Training Game**

### 🔥 **NUEVO: Simulador Viral de Ética Empresarial Argentina**

**El primer juego viral que recolecta datos culturales sobre ética empresarial mientras entrena profesionales.**

🎯 **[JUGAR AHORA →](https://adrianlerer.github.io/integridai-hackai-2025/flaisimulator/)**

#### ✨ **Features Revolucionarios:**
- 🎮 **10 dilemas éticos reales** basados en casos del mercado argentino
- ⚡ **5 minutos total** - experiencia adictiva optimizada para viral
- 🏆 **Ranking social** por sector, región y empresa  
- 📊 **Recolección de datos anónimos** para investigación cultural
- 🚀 **Mecánicas virales** integradas (desafíos de equipo, sharing automático)
- ⚖️ **Basado en Ley 27.401** - Responsabilidad Penal Empresaria

#### 📈 **Impacto Esperado:**
- **Semana 1**: 500+ profesionales jugando
- **Mes 1**: 5,000+ jugadores, 50,000+ decisiones etiquetadas  
- **Dataset único**: Primera base de datos cultural de ética empresarial argentina
- **Adopción corporativa**: Training gamificado para programas de compliance

#### 🧠 **Datos Culturales Recolectados:**
```javascript
// Patrones por sector
"tecnologia": { avg_score: 87, consultation_rate: 78% }
"finanzas": { avg_score: 84, risk_aversion: 91% }  
"consultoria": { avg_score: 89, relationship_priority: 65% }

// Insights regionales  
"caba": { score: 85, response_time: 18s }
"interior": { score: 82, consultation_rate: 85% }
```

#### 🚀 **Deploy Inmediato:**
```bash
# Clone y deploy en Netlify (1 minuto)
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025/flaisimulator
# Drag & drop en netlify.com/drop
```

**🎯 Listo para distribución masiva en LinkedIn, equipos corporativos y redes profesionales.**

### Expertise en Compliance
- 📖 Citación específica de artículos Ley 27.401
- 🔍 Análisis contextual por tipo de empresa
- 📋 Recomendaciones operacionales implementables
- 💼 Perspectiva estratégica ejecutiva

## 📚 Documentación

### Endpoints de API (Netlify Functions)

- `GET /.netlify/functions/get-characters` - Lista personajes disponibles
- `POST /.netlify/functions/start-conversation` - Inicia conversación con IA
- `POST /.netlify/functions/continue-conversation` - Continúa conversación
- `POST /.netlify/functions/end-conversation` - Finaliza con análisis

### Estructura de Personajes

```javascript
{
  "catalina": "Simulador de corrupción y tentaciones",
  "mentor": "Experto académico Ley 27.401", 
  "ana": "Controles operacionales",
  "carlos": "Decisiones estratégicas"
}
```

## 🌐 URLs de Producción

- **Portal Principal**: `/`
- **FLAISimulator**: `/flaisimulator/`
- **IntegridAI Suite**: `/integridai-suite/`
- **Sitio Corporativo**: [integridai.com.ar](https://integridai.com.ar)

## 🔐 Seguridad

- HTTPS habilitado por defecto
- Headers de seguridad configurados
- API Keys protegidas en variables de entorno
- CORS configurado para dominios autorizados

## 📞 Contacto

- **Empresa**: IntegridAI
- **Evento**: HackAI 2025
- **Especialización**: RegTech Ley 27.401
- **Sitio Web**: [integridai.com.ar](https://integridai.com.ar)

## 📄 Licencia

MIT License - IntegridAI © 2025

---

**🏆 HackAI 2025** | **🤖 IA Conversacional Real** | **⚖️ Especialización Ley 27.401** | **🇦🇷 Argentina RegTech**