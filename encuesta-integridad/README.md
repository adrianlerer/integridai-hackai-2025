# 📋 Encuesta de Integridad Empresarial - Ley 27401

## 🎯 Descripción

Encuesta especializada para evaluar el estado de implementación de Programas de Integridad en empresas argentinas según la **Ley 27401 de Responsabilidad Penal Empresaria**.

Esta herramienta forma parte del proyecto **IntegridAI** desarrollado para **HackAI 2025** y está específicamente diseñada para empresas del **Parque Austral** y otros complejos empresariales argentinos.

## 🏗️ Características Principales

### ✅ **Formulario Dinámico Inteligente**
- **5 secciones progresivas** con lógica condicional
- **Validación en tiempo real** de campos requeridos
- **Navegación paso a paso** con indicadores de progreso
- **Auto-guardado** cada 30 segundos en localStorage

### ⚖️ **Compliance Específico Ley 27401**
- Evaluación de **Programa de Integridad**
- Análisis del **Código de Ética**
- **Política de Relacionamiento con Funcionarios Públicos**
- **Política de Contrataciones Públicas**
- **Debida Diligencia en Cadena de Valor**
- **Responsable Interno de Integridad**
- **Plan de Capacitación obligatorio**

### 🤖 **Evaluación de Interés en IA**
- Consulta sobre sistemas de gestión con **Inteligencia Artificial**
- Evaluación de funcionalidades específicas:
  - Chatbot para consultas de compliance
  - Simulador de escenarios éticos
  - Evaluación automática de riesgos
  - Capacitación personalizada
  - Monitoreo automático
  - Reportes inteligentes
  - Alertas preventivas

### 📊 **Exportación y Analytics**
- **Exportación en JSON** (formato técnico)
- **Exportación en CSV** (análisis en Excel)
- **Resumen visual** de respuestas
- **Analytics básico** sin tracking personal

## 🎨 Secciones del Formulario

### **1. 🏢 Información de la Empresa**
- Nombre de la empresa
- Sector/Industria (13 opciones + otros)
- Tamaño de empresa (micro, pequeña, mediana, grande)
- Email de contacto
- Cargo/Posición del encuestado

### **2. ⚖️ Programa de Integridad**
- Estado de implementación del programa
- Componentes desarrollados (si aplica)
- Motivos de no implementación (si aplica)

### **3. 👤 Responsable de Integridad**
- Designación de responsable interno
- Dedicación exclusiva o múltiples funciones
- Especificación de otras funciones (CFO, Legal, Admin, etc.)

### **4. 🎓 Plan de Capacitación**
- Implementación del plan de capacitación
- Frecuencia de capacitaciones
- Modalidades utilizadas (presencial, virtual, mixta, e-learning)

### **5. 🤖 Sistema de Gestión con IA**
- Nivel de interés en soluciones IA
- Funcionalidades específicas de interés
- Comentarios y sugerencias adicionales

## 💻 Tecnologías Utilizadas

- **HTML5** con semántica moderna
- **CSS3** con gradientes y animaciones
- **JavaScript ES6+** con clases y módulos
- **LocalStorage** para persistencia de datos
- **Responsive Design** para móviles y desktop
- **Progressive Enhancement** para accesibilidad

## 🚀 Instalación y Uso

### **Opción 1: Integrado en IntegridAI**
```bash
cd /home/user/webapp
npm run dev
# Navegar a: http://localhost:3000/encuesta-integridad/
```

### **Opción 2: Standalone**
```bash
cd encuesta-integridad/
python -m http.server 8080
# O cualquier servidor local
```

### **Opción 3: Deploy Directo**
- Subir archivos a cualquier hosting web
- Compatible con GitHub Pages, Netlify, Vercel
- No requiere backend ni base de datos

## 📋 Estructura de Datos de Respuesta

```javascript
{
  // Información de empresa
  "companyName": "Empresa XYZ S.A.",
  "sector": "tecnologia",
  "companySize": "mediana",
  "contactEmail": "contacto@empresa.com",
  "position": "Gerente de Compliance",
  
  // Programa de integridad
  "hasProgram": "si",
  "components": ["codigo_etica", "politica_funcionarios", "cadena_valor"],
  
  // Responsable de integridad
  "hasResponsible": "si",
  "exclusiveDedication": "no",
  "otherFunctions": ["Legales", "Administracion"],
  
  // Capacitación
  "hasTraining": "si",
  "trainingFrequency": "semestral",
  "trainingModalities": ["virtual", "elearning"],
  
  // IA
  "aiInterest": "muy_interesado",
  "aiFeatures": ["chatbot_consultas", "simulador_escenarios", "reportes_inteligentes"],
  "comments": "Nos interesa mucho la automatización..."
}
```

## 🎯 Casos de Uso

### **Para Empresas**
- ✅ **Autoevaluación** de compliance con Ley 27401
- ✅ **Identificación de gaps** en programa de integridad
- ✅ **Benchmarking** con mejores prácticas del sector
- ✅ **Planificación** de implementación

### **Para Consultores**
- ✅ **Diagnóstico inicial** rápido de clientes
- ✅ **Recolección estructurada** de información
- ✅ **Generación de propuestas** personalizadas
- ✅ **Seguimiento de progreso** en implementación

### **Para IntegridAI**
- ✅ **Market research** sobre necesidades del mercado
- ✅ **Segmentación** de clientes potenciales
- ✅ **Desarrollo de producto** basado en datos
- ✅ **Lead generation** calificado

## 📊 Métricas y Analytics

### **Métricas Recolectadas (Anónimas)**
```javascript
{
  "sector_distribution": {
    "tecnologia": 32,
    "finanzas": 18,
    "manufactura": 15
  },
  "program_adoption": {
    "implemented": 45,
    "planned": 30,
    "none": 25
  },
  "ai_interest_by_sector": {
    "tecnologia": "muy_interesado",
    "finanzas": "algo_interesado"
  }
}
```

### **Insights Esperados**
- **Penetración** de programas de integridad por sector
- **Barreras principales** para implementación
- **Demanda específica** de funcionalidades IA
- **Oportunidades de mercado** en RegTech

## 🔐 Privacidad y Seguridad

### **Protección de Datos**
- ✅ **No tracking personal** - solo métricas agregadas
- ✅ **Almacenamiento local** - datos no salen del navegador
- ✅ **Exportación controlada** - usuario decide qué compartir
- ✅ **Sin cookies de terceros** - privacy-first

### **Cumplimiento Normativo**
- ✅ **GDPR compliance** - transparencia total
- ✅ **Ley de Protección de Datos Personales** (Argentina)
- ✅ **Opt-in explícito** para cualquier procesamiento
- ✅ **Right to delete** - función de reset incluida

## 🌐 Integración con IntegridAI Suite

Esta encuesta se integra perfectamente con:

- 🎮 **[FLAISimulator](../flaisimulator/)** - Training viral en ética empresarial
- 🤖 **IntegridAI RAG System** - IA conversacional para compliance
- 📊 **Dashboard Empresarial** - Visualización de métricas de integridad
- ⚖️ **Legal Knowledge Base** - Base de conocimiento Ley 27401

## 📞 Contacto y Soporte

- **Empresa**: IntegridAI
- **Proyecto**: HackAI 2025
- **Especialización**: RegTech Ley 27401
- **Website**: [integridai.com.ar](https://integridai.com.ar)

## 📄 Licencia

MIT License - IntegridAI © 2025

---

**🏆 Desarrollado para HackAI 2025** | **🏛️ Especializado en Ley 27401** | **🇦🇷 RegTech Argentina**