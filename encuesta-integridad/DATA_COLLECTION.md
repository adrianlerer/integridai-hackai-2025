# 📊 Sistema de Recolección de Datos - Encuesta IntegridAI

## 🎯 **Métodos de Recolección Implementados**

### ✅ **1. Almacenamiento Local (Inmediato)**
- **LocalStorage**: Backup automático cada 15 segundos
- **IndexedDB**: Almacenamiento robusto para datos finales
- **Persistencia**: Datos guardados incluso si se cierra el navegador
- **ID Único**: Cada respuesta tiene un ID único generado automáticamente

### ✅ **2. Exportación Manual (Disponible)**
- **JSON Export**: Datos completos en formato estructurado
- **CSV Export**: Compatible con Excel y herramientas de análisis
- **Email Directo**: Envío automático al equipo IntegridAI
- **Clipboard Copy**: Respaldo automático en portapapeles

### ✅ **3. Endpoint de Servidor (Configurado)**
- **Netlify Function**: `/api/survey-responses`
- **Auto-envío**: Intenta enviar al servidor automáticamente
- **Fallback**: Si falla, mantiene datos locales
- **CORS Enabled**: Funciona desde cualquier dominio

## 🔧 **Configuración del Sistema de Datos**

### **Para Desarrollo Local**
```bash
# Los datos se guardan automáticamente en:
# 1. LocalStorage: integridai_survey_final_v2
# 2. IndexedDB: IntegridAI_Survey -> responses
# 3. Console logs para monitoring
```

### **Para Producción (Netlify)**
```javascript
// Endpoint activo en:
// https://tu-sitio.netlify.app/.netlify/functions/survey-responses

// Configuración automática:
// - Envío POST con datos JSON
// - Retry logic implementado
// - Error handling robusto
```

## 📋 **Estructura de Datos Recolectados**

### **Datos Principales**
```json
{
  "responseId": "INTGRD_1704915600000_abc123def456",
  "companyName": "Empresa del Parque Austral",
  "sector": "tecnologia",
  "companySize": "mediana",
  "employeeCount": 150,
  "companyLocation": "parque_austral",
  "contactEmail": "contacto@empresa.com",
  "position": "Gerente de Compliance",
  
  "hasProgram": "parcial",
  "programElements": ["codigo_etica", "politica_funcionarios"],
  "ethicsCodeStatus": "completo_actualizado",
  "ethicsCodeCommunication": ["induccion", "capacitaciones"],
  
  "hasResponsible": "si_compartido",
  "otherResponsibilities": ["legal", "administracion"],
  "responsibleTraining": "capacitacion_basica",
  
  "hasTraining": "formal",
  "trainingFrequency": "semestral",
  "trainingDuration": "2_4h",
  "trainingModalities": ["virtual_sincrona", "elearning"],
  "trainingContent": ["ley_27401", "prevencion_corrupcion"],
  "trainingEffectiveness": ["examenes_quiz", "asistencia"],
  
  "aiInterest": "muy_interesado",
  "aiFeatures": ["chatbot_consultas", "simulador_escenarios", "reportes_inteligentes"],
  "aiImplementationTimeframe": "corto_plazo",
  "aiInvestmentBudget": "50k_100k",
  
  "additionalComments": "Nos interesa especialmente...",
  
  "metadata": {
    "timestamp": "2025-01-09T15:00:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "completionTime": 1200000,
    "version": "2.0",
    "serverSaved": true
  }
}
```

### **Metadatos del Servidor**
```json
{
  "serverMetadata": {
    "receivedAt": "2025-01-09T15:00:05.000Z",
    "userAgent": "Mozilla/5.0...",
    "clientIP": "192.168.1.100",
    "processedBy": "integridai-survey-endpoint"
  }
}
```

## 🌐 **Acceso a Datos Recolectados**

### **Opción 1: Acceso Local (Inmediato)**
```javascript
// Desde DevTools del navegador:
// 1. Abrir F12 -> Console
// 2. Ejecutar:
JSON.parse(localStorage.getItem('integridai_survey_final_v2'))

// Para ver todas las respuestas en IndexedDB:
// 1. F12 -> Application -> Storage -> IndexedDB
// 2. Expandir: IntegridAI_Survey -> responses
```

### **Opción 2: Email Automático (Configurado)**
- **Emails del equipo**: Configurados en script-v2.js
  - `contacto@integridai.com.ar`
  - `surveys@integridai.com.ar` 
  - `compliance@integridai.com.ar`
- **Formato**: Resumen ejecutivo + JSON completo
- **Activación**: Botón "📧 Enviar por Email" al completar

### **Opción 3: Base de Datos Centralizada**

#### **Opción Supabase (Recomendado para producción)**
```javascript
// 1. Crear proyecto en supabase.com
// 2. Configurar tabla:
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

// 3. Configurar variables de entorno en Netlify:
// SUPABASE_URL=https://xxx.supabase.co
// SUPABASE_ANON_KEY=eyJ...
```

#### **Opción Google Sheets (Fácil implementación)**
```javascript
// 1. Crear Google Apps Script
// 2. Endpoint webhook para recibir datos
// 3. Configurar URL en script-v2.js
const GOOGLE_SHEETS_WEBHOOK = 'https://script.google.com/macros/s/xxx/exec';
```

#### **Opción Airtable (Visual y fácil)**
```javascript
// 1. Crear base en Airtable
// 2. Configurar API key
// 3. Actualizar endpoint en netlify/functions/survey-responses.js
```

## 📊 **Dashboard de Análisis Recomendado**

### **Métricas Clave a Trackear**
- **Participación por sector**
- **Estado de programas de integridad**
- **Nivel de interés en IA por tamaño de empresa**
- **Elementos más implementados**
- **Frecuencia de capacitación actual**
- **Budget disponible para soluciones**
- **Ubicación geográfica (Parque Austral vs otros)**

### **Segmentaciones Importantes**
```sql
-- Por sector
SELECT sector, COUNT(*) as responses, 
       AVG(CASE WHEN has_program IN ('completo','parcial') THEN 1 ELSE 0 END) as program_rate
FROM survey_responses GROUP BY sector;

-- Por tamaño de empresa
SELECT company_size, ai_interest, COUNT(*) as count
FROM survey_responses GROUP BY company_size, ai_interest;

-- Parque Austral específico
SELECT * FROM survey_responses 
WHERE company_location = 'parque_austral';
```

## 🚀 **Implementación para Equipo IntegridAI**

### **Setup Inmediato (5 minutos)**
1. **Publicar en Netlify**: La encuesta ya está lista
2. **Compartir URL**: Enviar a empresas objetivo
3. **Monitor en tiempo real**: Revisar datos en localStorage de cada respuesta

### **Setup Completo (30 minutos)**
1. **Configurar Supabase**:
   ```bash
   npm install @supabase/supabase-js
   # Configurar variables de entorno
   # Actualizar netlify/functions/survey-responses.js
   ```

2. **Configurar Email Notifications**:
   ```bash
   npm install @sendgrid/mail
   # Configurar SENDGRID_API_KEY
   # Descomentar código de email en endpoint
   ```

3. **Dashboard Analytics**:
   ```bash
   # Conectar con Retool, Grafana, o custom dashboard
   # Query directo a Supabase para visualizaciones
   ```

## 📧 **Como Compartir la Encuesta**

### **Email Template para Empresas**
```
Asunto: Evaluación Gratuita: Programa de Integridad Ley 27401

Estimados,

Como parte de nuestra iniciativa en HackAI 2025, IntegridAI está realizando una evaluación del estado de implementación de Programas de Integridad según la Ley 27401 en empresas argentinas.

🎯 ENCUESTA RÁPIDA (5-7 minutos):
👉 https://tu-sitio.netlify.app/encuesta-integridad/

BENEFICIOS DE PARTICIPAR:
✅ Diagnóstico gratuito de su programa actual
✅ Benchmarking con su sector
✅ Consulta personalizada sobre IA en compliance
✅ Acceso prioritario a soluciones IntegridAI

La encuesta es completamente confidencial y los datos se usan únicamente para fines de investigación y desarrollo de productos.

¡Gracias por su tiempo!

Equipo IntegridAI
contacto@integridai.com.ar
```

### **LinkedIn/Redes Sociales**
```
🏛️ ¿Tu empresa cumple con la Ley 27401?

Participá en nuestra evaluación de Programas de Integridad y recibí:
• Diagnóstico gratuito de compliance
• Comparación con tu industria  
• Consulta sobre IA en integridad

⏱️ Solo 5 minutos
🔒 100% confidencial
🎁 Consulta gratuita incluida

👉 [LINK]

#Compliance #Ley27401 #IntegridAI #ParqueAustral
```

## 🔐 **Consideraciones de Privacidad**

### **Datos Recolectados**
- ✅ **Información empresarial**: Necesaria para análisis
- ✅ **Email de contacto**: Solo para seguimiento comercial
- ✅ **Metadata técnica**: Para mejorar la herramienta
- ❌ **Datos personales sensibles**: No se recolectan

### **Cumplimiento Normativo**
- ✅ **GDPR Compliance**: Opt-in explícito y derecho al olvido
- ✅ **Ley Protección Datos Personales (Argentina)**: Cumplimiento completo
- ✅ **Transparencia**: Usuario sabe exactamente qué datos se guardan

---

**🎯 Resultado**: Sistema robusto de recolección que permite análisis inmediato y escalabilidad futura para el crecimiento de IntegridAI.**