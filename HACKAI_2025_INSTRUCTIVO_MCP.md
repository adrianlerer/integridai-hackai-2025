# 🚀 IntegridAI MCP Server - Instructivo HackAI 2025

![MCP Server](https://img.shields.io/badge/MCP-Server-blue?style=for-the-badge) ![HackAI 2025](https://img.shields.io/badge/HackAI-2025-gold?style=for-the-badge) ![Ley 27.401](https://img.shields.io/badge/Ley-27.401-green?style=for-the-badge)

## 📋 **¿Qué Es Este Proyecto?**

### **Concepto Principal**
Hemos desarrollado un **servidor MCP (Model Context Protocol)** que permite a LLMs como Claude ejecutar workflows completos de compliance empresarial de manera conversacional.

**En términos simples:** Convertimos a Claude en un asistente de compliance que no solo aconseja, sino que **ejecuta tareas reales** y genera documentación oficial.

### **Paradigma "Segunda Ola MCP"**
- ❌ **APIs tradicionales:** Múltiples llamadas, manejo manual de errores
- ✅ **Workflow Tools:** Una herramienta = Un proceso completo de principio a fin

---

## 🎯 **¿Qué Hace en la Práctica?**

### **Ejemplo Real de Uso:**

```
👤 Usuario: "Claude, evalúa el riesgo ético en nuestra área de compras"

🤖 Claude (con MCP): 
   [Ejecuta internamente: crea sesión → simula escenarios → analiza → genera informe]
   
   "✅ Evaluación completada
    📊 Nivel de riesgo: ALTO  
    📋 Principales problemas: Falta segregación, autorizaciones débiles
    📄 Informe ejecutivo: [URL segura - válida 24h]
    ⚖️ Cumplimiento Ley 27.401 Art. 22, 23
    💡 Acción inmediata: Implementar matriz de autorizaciones"
```

### **Casos de Uso Empresarial:**

1. **🎮 Simulaciones Éticas Automatizadas**
   - Ejecutar casos del FLAISimulator con diferentes personajes
   - Generar informes ejecutivos con recomendaciones legales
   - Documentar evidencia de capacitación para auditorías

2. **📊 Evaluaciones de Integridad Express**
   - Correr encuestas completas de integridad organizacional
   - Exportar resultados en CSV/JSON para análisis
   - Obtener scoring automático con benchmarks del sector

3. **⚖️ Compliance Ley 27.401 Automatizado**
   - Referencias automáticas a artículos específicos
   - Generación de documentación para programas de integridad
   - Audit trails completos para reguladores

---

## 🛠️ **Herramientas Disponibles**

### **1. `simulate_ethics_case`**
**Qué hace:** Ejecuta simulación ética completa end-to-end

**Input:**
- `persona`: "catalina" | "mentor" | "ana" | "carlos"  
- `caseId`: Identificador del caso (ej: "COMPRAS-CI-2024")
- `userId`: Usuario que ejecuta (opcional)

**Output:**
- Informe ejecutivo con recomendaciones
- URL firmada del documento (válida 24h)
- Referencias legales específicas (Ley 27.401)
- Tiempo de ejecución y audit trail

### **2. `run_integrity_survey`**
**Qué hace:** Orquesta encuesta completa de integridad

**Input:**
- `delivery`: "csv" | "json" | "both" 
- `notifyEmails`: Lista de emails para notificación
- `userId`: Usuario que ejecuta (opcional)

**Output:**
- Archivos CSV/JSON exportados
- Scoring por secciones (Gobierno, Riesgos, Compliance, etc.)
- Resumen ejecutivo con recomendaciones
- Notificaciones automáticas

---

## 🏗️ **Arquitectura Técnica**

### **Stack Implementado:**
- 🔷 **Next.js 14+** - Framework principal
- ⚡ **Netlify Functions** - Serverless deployment
- 🔴 **Redis (Upstash)** - Sesiones y locks
- 🐘 **PostgreSQL (Supabase)** - Persistencia
- 🔐 **OAuth 2.0** - Autenticación con scopes
- 📊 **Prisma ORM** - Database management

### **Características de Producción:**
- ✅ **Idempotencia:** Requests duplicados retornan mismo resultado
- ✅ **Rate Limiting:** 10 simulaciones/hora, 5 encuestas/hora por usuario
- ✅ **Audit Trail:** Logs completos con referencias legales
- ✅ **Error Recovery:** Rollback automático en fallos
- ✅ **Health Monitoring:** Métricas en tiempo real

---

## 🧪 **Cómo Probarlo - 3 Niveles**

### 🟢 **NIVEL 1: Verificación Básica (5 minutos)**

**Objetivo:** Confirmar que el código está completo y compila

```bash
# 1. Clonar repositorio
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025
git checkout genspark_ai_developer

# 2. Navegar al MCP server
cd apps/mcp-server

# 3. Verificar estructura
ls -la
# Debería mostrar: app/, lib/, netlify/, prisma/, tests/, README.md

# 4. Instalar dependencias
npm install

# 5. Verificar compilación
npm run build
# Si funciona sin errores → ✅ Código completo
```

**Qué valida:** Integridad del código, dependencias correctas, sintaxis válida

---

### 🟡 **NIVEL 2: Testing Funcional (20 minutos)**

**Objetivo:** Probar endpoints y lógica sin servicios externos

```bash
# 1. Configurar entorno local
cp .env.example .env
# Editar .env con NODE_ENV=development

# 2. Generar esquemas
npm run db:generate

# 3. Iniciar servidor de desarrollo  
npm run dev
# Servidor disponible en http://localhost:3000

# 4. Probar endpoints
curl -X POST http://localhost:3000/api/mcp/http \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'

# Respuesta esperada: Lista de herramientas MCP
```

**Testing de herramientas:**
```bash
# Test simulate_ethics_case
curl -X POST http://localhost:3000/api/mcp/http \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0", 
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "simulate_ethics_case",
      "arguments": {
        "persona": "catalina",
        "caseId": "TEST-HACKAI-001"
      }
    }
  }'
```

**Qué valida:** Protocolo MCP, validación de parámetros, estructura de respuestas

---

### 🔴 **NIVEL 3: Testing Completo con Servicios (1-2 horas)**

**Objetivo:** Deploy funcional con infraestructura real

#### **Paso 1: Configurar Servicios (Gratuitos)**

1. **Redis (Upstash)** → https://upstash.com/
   - Crear cuenta gratuita
   - Crear base Redis
   - Obtener URL y token

2. **PostgreSQL (Supabase)** → https://supabase.com/
   - Crear proyecto
   - Obtener DATABASE_URL
   - Obtener service role key

3. **Netlify** → https://netlify.com/
   - Conectar repositorio
   - Configurar build: `npm run build`
   - Directory: `out`

#### **Paso 2: Variables de Entorno**
```env
NEXT_PUBLIC_BASE_URL=https://tu-app.netlify.app
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token
DATABASE_URL=postgresql://postgres:...@db....supabase.co:5432/postgres
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
NETLIFY_FUNCTION_BASE_URL=https://integridai.netlify.app/.netlify/functions
```

#### **Paso 3: Deploy y Testing**
```bash
# Deploy a Netlify
npm run deploy

# Ejecutar suite E2E completa
npm run test

# Testing manual con endpoints reales
curl -X POST https://tu-app.netlify.app/.netlify/functions/mcp-handler \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

**Qué valida:** Funcionalidad completa, persistencia, manejo de errores, performance

---

## 🔗 **Integración con Claude Desktop**

### **Configuración:**
```json
// claude_desktop_config.json
{
  "mcpServers": {
    "integridai": {
      "command": "npx",
      "args": ["@integridai/mcp-client"],
      "env": {
        "MCP_SERVER_URL": "https://tu-app.netlify.app/.netlify/functions/mcp-handler"
      }
    }
  }
}
```

### **Ejemplos de Conversación:**

**Simulación Ética:**
```
Usuario: "Ejecutá una simulación ética con Catalina para evaluar conflictos 
         de interés en compras. Caso: 'COMPRAS-PROVEEDOR-2024'"

Claude: [Usa simulate_ethics_case]
        "✅ Simulación completada
         📄 Informe: [URL]
         ⚖️ Ley 27.401 Art. 22, 23, 7
         💡 Recomendaciones: [específicas]"
```

**Evaluación Integral:**
```
Usuario: "Corré una evaluación completa de integridad y enviá 
         resultados a compliance@empresa.com"

Claude: [Usa run_integrity_survey] 
        "✅ Evaluación completada
         📊 Score: 87/100 (Riesgo Bajo)
         📄 CSV/JSON: [URLs]
         📧 Notificación enviada"
```

---

## 📊 **Métricas y Validación**

### **Testing Automatizado Incluye:**
- ✅ Happy path (ambas herramientas)
- ✅ Validación de parámetros inválidos
- ✅ Idempotencia (mismo request = mismo resultado)
- ✅ Concurrencia (50 requests simultáneos)
- ✅ Autenticación OAuth
- ✅ Integridad de artefactos
- ✅ Manejo de errores y recovery

### **Performance Esperado:**
- **Simulación ética:** ~3-5 segundos
- **Encuesta integridad:** ~8-12 segundos  
- **Rate limits:** 10 simulaciones/hora, 5 encuestas/hora
- **Availability:** 99.9% SLA (Netlify + Upstash + Supabase)

---

## 🎯 **Valor para HackAI 2025**

### **Innovación Técnica:**
- Primera implementación "Segunda Ola MCP" en RegTech
- Workflows conversacionales para compliance empresarial
- Integración nativa LLM → Sistemas empresariales

### **Impacto Empresarial:**
- **Tiempo de compliance:** Semanas → Minutos
- **Documentación:** Manual → Automática
- **Auditoría:** Reactiva → Continua
- **Especialización:** Ley 27.401 Argentina

### **Escalabilidad:**
- Arquitectura serverless (costo = uso)
- OAuth empresarial (multi-tenant ready)  
- API extensible para nuevos workflows
- Audit trail para reguladores

---

## 📞 **Contacto y Soporte**

- **Email Principal:** adrian@lerer.com.ar
- **Email Empresarial:** legity@integridai.com.ar
- **Repositorio:** https://github.com/adrianlerer/integridai-hackai-2025
- **Branch:** `genspark_ai_developer`
- **Documentación:** `/apps/mcp-server/README.md`

---

## 🚀 **Próximos Pasos Sugeridos**

1. **Testing Básico:** Cada miembro del equipo ejecuta Nivel 1
2. **Demo Funcional:** Una persona del equipo completa Nivel 2
3. **Evaluación Técnica:** Revisar código y arquitectura
4. **Decisión Deploy:** Si aprueban, proceder con Nivel 3
5. **Integración Claude:** Configurar para demos en vivo

---

**🏆 Estado del Proyecto: COMPLETO y LISTO PARA EVALUACIÓN**

*Este documento fue generado para HackAI 2025 - IntegridAI MCP Server Implementation*