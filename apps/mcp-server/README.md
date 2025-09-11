# IntegridAI MCP Server

![MCP Server](https://img.shields.io/badge/MCP-Server-blue?style=for-the-badge&logo=react)
![Ley 27.401](https://img.shields.io/badge/Ley-27.401-green?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## 🚀 Overview

**IntegridAI MCP Server** es una implementación de **"segunda ola MCP"** que proporciona herramientas de workflow completo para ejecutar flujos de compliance desde LLMs, especializada en **Ley 27.401** (Responsabilidad Penal Empresaria Argentina).

### 🎯 **Características Principales**

- **🛠️ Workflow Tools**: Herramientas que encapsulan flujos completos, no endpoints atómicos
- **⚖️ Especialización Legal**: Enfoque específico en Ley 27.401 Argentina
- **🔒 OAuth Integration**: Autenticación segura con scopes granulares
- **📊 Auditoría Completa**: Trazabilidad completa de ejecuciones y artefactos
- **🔁 Idempotencia**: Manejo robusto de reintentos y duplicados
- **📈 Escalabilidad**: Diseñado para despliegue en Vercel con Redis y PostgreSQL

## 🛠️ Herramientas MCP Disponibles

### 1. **simulate_ethics_case**
Ejecuta un caso del FLAISimulator end-to-end y devuelve un informe ejecutivo.

**Input:**
```typescript
{
  persona: 'catalina' | 'mentor' | 'ana' | 'carlos',
  caseId: string,
  userId?: string,
  locale?: string  // default: 'es-AR'
}
```

**Output:**
```typescript
{
  status: 'completed',
  summary: string,      // Resumen ejecutivo
  reportUrl: string,    // URL firmada del informe
  runId: string,        // ID único de ejecución
  executionTime: number, // Tiempo en ms
  legalReferences: string[] // Referencias Ley 27.401
}
```

### 2. **run_integrity_survey**
Ejecuta la Encuesta de Integridad completa con exportación de artefactos.

**Input:**
```typescript
{
  userId?: string,
  delivery: 'csv' | 'json' | 'both', // default: 'both'
  notifyEmails?: string[]
}
```

**Output:**
```typescript
{
  status: 'completed',
  summary: string,
  csvUrl?: string,      // URL del CSV exportado
  jsonUrl?: string,     // URL del JSON exportado
  runId: string,
  executionTime: number,
  totalScore: number,   // Puntuación 0-100
  sectionScores: Record<string, number>
}
```

## 🔧 Instalación y Configuración

### Prerequisitos

- Node.js 18+
- Cuenta Upstash (Redis)
- Cuenta Supabase (PostgreSQL)
- Cuenta Vercel (deployment)

### 1. **Configurar Variables de Entorno**

```bash
cp .env.example .env
```

Completar las siguientes variables:

```env
# Next.js
NEXT_PUBLIC_BASE_URL=https://your-mcp-server.vercel.app

# OAuth MCP
MCP_OAUTH_CLIENT_ID=your_oauth_client_id
MCP_OAUTH_CLIENT_SECRET=your_oauth_client_secret
MCP_OAUTH_ISSUER=https://oauth.mcpauth.com

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Supabase PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Netlify Functions existentes
NETLIFY_API_TOKEN=your_netlify_token
NETLIFY_FUNCTION_BASE_URL=https://integridai.netlify.app/.netlify/functions
```

### 2. **Instalar Dependencias**

```bash
npm install
```

### 3. **Configurar Base de Datos**

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar esquema a la BD
npm run db:push
```

### 4. **Desarrollo Local**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🚀 Despliegue en Netlify

### 1. **Conectar Repositorio**

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Conectar proyecto
netlify init

# Configurar variables de entorno
netlify env:set UPSTASH_REDIS_REST_URL "your_redis_url"
netlify env:set DATABASE_URL "your_database_url"
# ... (todas las variables del .env)
```

### 2. **Deploy**

```bash
# Deploy de prueba
npm run deploy:preview

# Deploy a producción
npm run deploy
```

### 3. **Auto-deploy desde Git**

Conectar en Netlify Dashboard:
- Repository: `your-repo-url`
- Build command: `npm run build`
- Publish directory: `out`
- Functions directory: `netlify/functions`

## 📖 Integración con LLMs

### Claude Desktop Integration

#### 1. **Configurar Claude Desktop**

Agregar en `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "integridai": {
      "command": "npx",
      "args": ["@integridai/mcp-client"],
      "env": {
        "MCP_SERVER_URL": "https://your-site.netlify.app/.netlify/functions/mcp-handler"
      }
    }
  }
}
```

#### 2. **Ejemplos de Prompts**

**Simulación Ética:**
```
Usá la herramienta simulate_ethics_case con persona="catalina" y caseId="EP-2025-07". 
Necesito el informe ejecutivo y recomendaciones accionables conforme Ley 27.401. 
Entregá el enlace seguro al artefacto y citalo por hash.
```

**Encuesta de Integridad:**
```
Ejecutá run_integrity_survey para generar una evaluación completa de compliance. 
Necesito tanto CSV como JSON, y enviá notificación a compliance@empresa.com. 
Incluí el análisis de riesgo según Ley 27.401.
```

### HTTP API Direct Integration

#### **Endpoint**: `POST /.netlify/functions/mcp-handler`

**Request Format:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "simulate_ethics_case",
    "arguments": {
      "persona": "catalina",
      "caseId": "TEST-001"
    }
  }
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your_oauth_token
Idempotency-Key: unique_request_key
```

## 🧪 Testing

### Ejecutar Pruebas E2E

```bash
# Instalar Playwright
npx playwright install

# Ejecutar tests
npm run test
```

### Casos de Prueba Incluidos

- ✅ **Happy Path**: Ejecución exitosa de ambas herramientas
- ✅ **Validación**: Parámetros inválidos y casos edge
- ✅ **Idempotencia**: Verificación de duplicados
- ✅ **Concurrencia**: Múltiples requests simultáneos
- ✅ **Autenticación**: OAuth y permisos
- ✅ **Artifacts**: Integridad y accesibilidad

### Postman Collection

Importar `postman_collection.json` para pruebas manuales:

```bash
# Generar collection
curl -o postman_collection.json \
  https://your-mcp-server.vercel.app/api/postman/collection
```

## 📊 Monitoring y Auditoría

### Health Check

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "dependencies": {
    "redis": "connected",
    "database": "connected",
    "netlify": "reachable"
  }
}
```

### Auditoría Completa

Todas las ejecuciones se registran con:

- ✅ **Inputs sanitizados** (sin datos sensibles)
- ✅ **Outputs con hash de integridad**
- ✅ **Referencias legales aplicadas**
- ✅ **Tiempos de ejecución**
- ✅ **Contexto de usuario y sesión**

## 🔒 Seguridad y Compliance

### Autenticación OAuth

- **Scopes requeridos por herramienta:**
  - `simulate_ethics_case`: `ethics:simulate`
  - `run_integrity_survey`: `survey:run`
  - Acceso a artefactos: `artifacts:read`

### Rate Limiting

- **Default**: 100 requests/hour
- **Ethics simulation**: 10 runs/hour
- **Integrity survey**: 5 runs/hour

### Privacidad de Datos

- ✅ **Sanitización automática** de datos sensibles
- ✅ **Hashing de contenidos** para integridad
- ✅ **TTL en artefactos** (90 días por defecto)
- ✅ **Logs con retention policy** (12 meses)

## ⚖️ Referencias Legales

### Ley 27.401 - Responsabilidad Penal Empresaria

**Artículos Implementados:**

- **Art. 22**: Programa de Integridad
- **Art. 23**: Elementos del Programa de Integridad
- **Art. 7**: Delitos precedentes
- **Art. 23 inc. c)**: Capacitación periódica en ética empresarial
- **Art. 23 inc. a)**: Evaluación de riesgos
- **Art. 23 inc. f)**: Monitoreo continuo

**Disclaimer Legal:**
> Los informes generados son para fines de capacitación y evaluación. No constituyen asesoramiento legal definitivo y deben ser revisados por personal especializado.

## 🚀 Roadmap

### v1.1 (Q1 2025)
- [ ] Integración con más simuladores éticos
- [ ] Dashboard web para gestión de sesiones
- [ ] Notificaciones email automatizadas
- [ ] Exportación PDF nativa

### v1.2 (Q2 2025)
- [ ] Integración con sistemas ERP
- [ ] API para third-party integrations
- [ ] Multi-tenant support
- [ ] Analytics dashboard

## 📞 Soporte

### Contacto Técnico

- **Email**: tech@integridai.com.ar
- **Documentación**: [docs.integridai.com.ar](https://docs.integridai.com.ar)
- **Issues**: GitHub Issues
- **Slack**: #integridai-mcp-support

### SLA y Disponibilidad

- **Uptime**: 99.9% SLA
- **Response Time**: < 2 segundos (p95)
- **Support**: Horario comercial Argentina (UTC-3)

## 📄 Licencia

MIT License - IntegridAI © 2025

---

**🏆 HackAI 2025** | **🤖 Segunda Ola MCP** | **⚖️ Especialización Ley 27.401** | **🇦🇷 Argentina RegTech**