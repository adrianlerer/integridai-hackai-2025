# IntegridAI RegTech Platform - HackAI 2025

![IntegridAI Logo](https://img.shields.io/badge/IntegridAI-RegTech%20Platform-blue?style=for-the-badge&logo=react)
![HackAI 2025](https://img.shields.io/badge/HackAI-2025-gold?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=openai)

## 🚀 Plataforma de Compliance Empresarial con IA Conversacional

Plataforma RegTech especializada en **Ley 27.401** (Responsabilidad Penal Empresaria Argentina) con IA conversacional real para entrenamiento en compliance y simulación de escenarios de corrupción.

## 📋 Módulos Incluidos

### ⚠️ FLAISimulator - Simulador de Corrupción
- **Catalina Oportunista**: Personaje de IA que simula tentaciones de corrupción
- **Dr. Mentor**: Experto académico en Ley 27.401
- **Ana Auditora**: Especialista en controles operacionales
- **Carlos CEO**: Perspectiva estratégica ejecutiva

### 🔧 IntegridAI Suite (En desarrollo)
- Dashboard de compliance en tiempo real
- Análisis automatizado de riesgo
- Auditorías inteligentes con IA
- Reportes regulatorios automáticos

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