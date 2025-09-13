# 🚀 IntegridAI HackAI 2025 - Versión Pública

## ⚠️ IMPORTANTE: Versión Básica de Demostración

Esta es la **versión básica pública** de IntegridAI desarrollada específicamente para **HackAI 2025**. Contiene funcionalidades esenciales de compliance sin contenido premium privado.

## 🎯 **Funcionalidades Incluidas**

### 1. 📋 **Encuesta de Integridad Empresarial**
- ✅ Evaluación completa de compliance Ley 27.401
- ✅ 6 secciones con 50+ preguntas especializadas
- ✅ Exportación de datos para análisis empresarial
- ✅ Triple almacenamiento para confiabilidad

**🌐 Demo en vivo**: [Encuesta de Integridad](https://integridai-hackai-2025.netlify.app/)

### 2. 🎮 **FLAISimulator - Simulador Ético Viral**
- ✅ 4 personajes IA especializados (Catalina, Dr. Mentor, Ana, Carlos)
- ✅ 10 dilemas éticos basados en casos reales argentinos
- ✅ Gamificación para engagement empresarial
- ✅ Recolección de datos culturales sobre ética

**🎮 Jugar ahora**: [FLAISimulator](https://integridai-hackai-2025.netlify.app/flaisimulator/)

### 3. 🤖 **MCP Server Básico para Claude Desktop**
- ✅ 4 herramientas especializadas de compliance
- ✅ Integración nativa con Claude Desktop
- ✅ Análisis de integridad empresarial
- ✅ Simulación de escenarios éticos básicos

## 🛠️ **Herramientas MCP Incluidas**

### 🔍 **1. Evaluación de Integridad** (`integrity_assessment`)
Evalúa el nivel de integridad empresarial según Ley 27.401:
- Análisis por sector y tamaño de empresa
- Identificación de fortalezas y debilidades
- Recomendaciones personalizadas de compliance
- Plan básico de implementación

### 🎭 **2. Simulador Ético Básico** (`basic_ethics_simulation`)
Genera simulaciones de dilemas éticos empresariales:
- **Regalos de proveedores**: Manejo ético de obsequios comerciales
- **Conflictos de interés**: Identificación y manejo de situaciones problemáticas
- **Información privilegiada**: Uso ético de información confidencial
- **Pagos de facilitación**: Prevención de prácticas corruptas

### 📊 **3. Verificador de Compliance** (`compliance_checker`)
Verifica cumplimiento de requisitos Ley 27.401:
- Evaluación de elementos obligatorios (Art. 23)
- Identificación de brechas legales
- Plan de acción priorizado
- Referencias legales específicas

### 📚 **4. Recomendaciones de Entrenamiento** (`basic_training_recommendations`)
Genera planes de capacitación personalizados:
- Adaptado por departamento (ventas, compras, finanzas, RRHH)
- Segmentado por nivel de experiencia
- Módulos específicos con duración y métodos
- Plan de implementación y seguimiento

## 🚀 **Instalación y Uso**

### **Para Claude Desktop (MCP Server)**

1. **Instalar dependencias**:
```bash
cd apps/mcp-server-basic
npm install
npm run build
```

2. **Configurar Claude Desktop**:
Añadir a tu archivo de configuración de Claude Desktop:
```json
{
  "mcpServers": {
    "integridai-basic": {
      "command": "node",
      "args": ["/ruta/completa/apps/mcp-server-basic/dist/index.js"],
      "description": "IntegridAI Compliance Tools"
    }
  }
}
```

3. **Usar en Claude**:
```
Evalúa la integridad de mi empresa del sector finanzas con 150 empleados
Simula un escenario de regalo de proveedor para un gerente
Verifica nuestro compliance con las políticas actuales
Recomienda entrenamiento para el departamento de ventas
```

### **Para Desarrollo Web Local**

```bash
# Instalar dependencias globales
npm install

# Desarrollo local
npm run dev

# O usar Netlify CLI
netlify dev
```

## 🌐 **URLs de Demostración**

- **Portal Principal**: https://integridai-hackai-2025.netlify.app/
- **Encuesta de Integridad**: https://integridai-hackai-2025.netlify.app/encuesta-integridad/
- **FLAISimulator**: https://integridai-hackai-2025.netlify.app/flaisimulator/
- **Sitio Corporativo**: [integridai.com.ar](https://integridai.com.ar)

## 📚 **Ejemplos de Uso MCP**

### **Evaluación de Integridad Empresarial**
```json
{
  "companyName": "TechCorp Argentina",
  "sector": "tecnologia",
  "employeeCount": 150,
  "hasComplianceProgram": true,
  "riskAreas": ["manejo_datos", "contratos_gubernamentales"]
}
```

### **Simulación Ética - Conflicto de Interés**
```json
{
  "scenarioType": "conflicto_interes",
  "userRole": "gerente",
  "contextDetails": "Evaluación de proveedor donde trabaja familiar"
}
```

### **Verificación de Compliance**
```json
{
  "policies": ["Código de Ética", "Política Anticorrupción"],
  "trainings": ["Capacitación Ley 27401", "Entrenamiento Ético"],
  "controls": ["Auditoría Interna", "Canal de Denuncias"],
  "lastAuditDate": "2024-06-15"
}
```

### **Recomendaciones de Entrenamiento**
```json
{
  "department": "compras",
  "experienceLevel": "senior",
  "previousIncidents": false,
  "timeAvailable": 8
}
```

## 🔒 **Funciones NO Incluidas (Solo Versión Comercial)**

Las siguientes funciones están disponibles **ÚNICAMENTE en la versión comercial privada**:

- ❌ **Trinity-ASI System** (JurisRank + Oak Architecture + Vaccination)
- ❌ **Deterministic LLM Inference** (IA reproducible para compliance)
- ❌ **Advanced Network Intelligence** (Análisis avanzado de corrupción)
- ❌ **Zero Trust Security** (Seguridad empresarial de grado máximo)
- ❌ **Political Actor Analysis** (Inteligencia política avanzada)
- ❌ **Biofilm Modeling** (Modelado de redes de corrupción)

## 🎯 **Propósito y Audiencia**

### **Para HackAI 2025**
- Demostración de capacidades básicas de RegTech
- Showcase de integración MCP con Claude Desktop
- Ejemplo de aplicación especializada en Ley 27.401
- Proof of concept para compliance automatizado

### **Para Empresas**
- Evaluación inicial de estado de compliance
- Herramientas básicas de entrenamiento ético
- Introducción a conceptos de Ley 27.401
- Punto de entrada a soluciones comerciales completas

### **Para Desarrolladores**
- Ejemplo de implementación MCP Server
- Estructura de herramientas de compliance
- Integración con Claude Desktop
- Patrones de desarrollo RegTech

## 🏛️ **Marco Legal y Compliance**

### **Ley 27.401 - Responsabilidad Penal Empresaria**
- **Art. 23**: Programas de integridad (elementos mínimos)
- **Art. 24**: Atenuación de la pena por programa de integridad
- **Aplicación**: Empresas argentinas y filiales extranjeras

### **Sectores de Aplicación**
- Finanzas y servicios financieros
- Tecnología y software
- Consultoría y servicios profesionales
- Manufactura y producción
- Servicios generales y comercio

## 🔧 **Especificaciones Técnicas**

### **MCP Server**
- **Runtime**: Node.js 18+
- **Framework**: @modelcontextprotocol/sdk
- **Language**: TypeScript
- **Tools**: 4 herramientas especializadas
- **Output**: JSON estructurado

### **Frontend Web**
- **Stack**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Netlify Functions
- **IA**: OpenRouter API (Claude 3.5 Sonnet)
- **Storage**: LocalStorage + IndexedDB + Server
- **Deploy**: Netlify (automático desde GitHub)

## 📞 **Contacto y Soporte**

### **Para HackAI 2025**
- **Empresa**: IntegridAI
- **Especialización**: RegTech Ley 27.401
- **Demo**: Funcionalidades básicas públicas

### **Para Versión Comercial Completa**
- **Web**: [integridai.com.ar](https://integridai.com.ar)
- **Email**: contacto@integridai.com.ar
- **LinkedIn**: [IntegridAI](https://linkedin.com/company/integridai)

---

## 📄 **Licencia y Uso**

**Versión Pública**: MIT License - IntegridAI © 2025
**Versión Comercial**: Licencia comercial privada

---

**🏆 HackAI 2025** | **🤖 IA Conversacional** | **⚖️ Ley 27.401** | **🇦🇷 Argentina RegTech**

*Esta versión básica pública demuestra las capacidades fundamentales de IntegridAI para compliance empresarial, manteniendo las funcionalidades avanzadas en la versión comercial privada.*