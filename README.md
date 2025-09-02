# 🚀 IntegridAI - HackAI 2025 Universidad Austral

**¡Bienvenidos al Hackathon más innovador de RegTech en Argentina!**

## 🎯 **Sobre el Proyecto**

**IntegridAI** es el primer ecosistema completo de compliance e integridad corporativa de Latinoamérica. Combinamos **IA conversacional**, **RegTech automático** y **gamificación** para revolucionar cómo las empresas manejan el riesgo y la integridad.

### **🏆 Sistema Real en Producción**
Este no es un ejercicio académico - es un **proyecto real** con:
- ✅ **Sistema operativo** analizando proveedores reales
- ✅ **1+ empresas** ya usando la plataforma  
- ✅ **APIs funcionales** en producción
- ✅ **Base de datos** con análisis históricos

👉 **[Ver Demo Live](https://3000-ifknyuzyit0jaqy80ghd2-6532622b.e2b.dev)** (Sistema real funcionando)

---

## 🏗️ **Arquitectura del Ecosistema**

### **Módulos Principales:**

#### **🎮 FLAISimulator**
- **Capacitación ética gamificada** con IA conversacional
- **Escenarios reales** de dilemas éticos empresariales
- **Algoritmos de aprendizaje** adaptativo por perfil

#### **🤖 RegTech Engine**
- **Análisis automático** de proveedores según Ley 27.401
- **Verificaciones oficiales** AFIP, BCRA, CNV, UIF
- **Scoring predictivo** de riesgo de compliance

#### **📊 Dashboard Unificado**
- **Métricas consolidadas** de capacitación + compliance
- **Reportes ejecutivos** en tiempo real
- **APIs de orquestación** entre módulos

---

## 🏆 **Challenges HackAI 2025**

### **Challenge 1: 🎨 Frontend UX/UI Excellence**
**Objetivo:** Crear interfaces espectaculares para el Dashboard Unificado

**Tu misión:**
- Mejorar UX del dashboard ejecutivo
- Crear componentes React responsivos
- Optimizar flujo de navegación entre módulos

**Tech Stack:** React, TailwindCSS, Chart.js
**APIs Disponibles:** Mock endpoints con datos demo
**Carpeta:** `/src/frontend/`

---

### **Challenge 2: 🔌 APIs Integration Master**
**Objetivo:** Conectar perfectamente FLAISimulator + RegTech + Dashboard

**Tu misión:**
- Crear APIs de orquestación entre módulos
- Implementar sistema de métricas consolidadas
- Desarrollar endpoints de sincronización

**Tech Stack:** FastAPI, Node.js, RESTful APIs
**APIs Disponibles:** Simuladores AFIP/BCRA/CNV/UIF
**Carpeta:** `/src/backend/`

---

### **Challenge 3: 📊 Data Analytics Genius**
**Objetivo:** Dashboard ejecutivo con analytics predictivos

**Tu misión:**
- Visualizaciones interactivas de compliance
- Métricas predictivas de riesgo
- Reportes ejecutivos automatizados

**Tech Stack:** D3.js, Python, Pandas, Chart.js
**Data Available:** Datasets demo de análisis
**Carpeta:** `/src/analytics/`

---

### **Challenge 4: 📱 Mobile Experience Pro**
**Objetivo:** App móvil para análisis rápido de proveedores

**Tu misión:**
- PWA o React Native para análisis móvil
- Camera integration para scan de documentos
- Offline-first para análisis sin conexión

**Tech Stack:** React Native, PWA, Camera APIs
**APIs Disponibles:** REST endpoints optimizados
**Carpeta:** `/mobile/`

---

## 🚀 **Quick Start**

### **1. Setup Desarrollo**
```bash
# Clonar repo
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025

# Instalar dependencias Python
pip install -r requirements.txt

# Instalar dependencias Node (si usas frontend)
npm install

# Setup variables de entorno
cp .env.example .env.local
```

### **2. Iniciar Servicios Mock**
```bash
# Opción 1: Iniciar todos los servicios automáticamente
python scripts/start_mock_services.py

# Opción 2: Iniciar servicios individuales
python api/mock/conversational_mock.py    # Puerto 5001
python api/mock/regtech_mock.py           # Puerto 5002
```

### **3. APIs Mock Disponibles**

#### **🤖 Conversational API (Puerto 5001)**
```bash
# Health check
GET http://localhost:5001/health

# Iniciar conversación
POST http://localhost:5001/api/conversation/start
{
  "user_profile": "estudiante_hackathon",
  "difficulty": "medium"
}

# Enviar mensaje
POST http://localhost:5001/api/conversation/{session_id}/message
{
  "message": "¿Cómo manejo un conflicto de intereses?"
}

# Ver escenarios
GET http://localhost:5001/api/scenarios
```

#### **🏛️ RegTech API (Puerto 5002)** 
```bash
# Health check
GET http://localhost:5002/health

# Analizar empresa
POST http://localhost:5002/api/analyze/company
{
  "cuit": "20123456781",
  "company_name": "Empresa Demo SA"
}

# Dashboard ejecutivo
GET http://localhost:5002/api/reports/dashboard

# Empresas de prueba
GET http://localhost:5002/api/mock/companies
```

### **4. Datos Demo Seguros**
```bash
# Empresas de prueba disponibles:
CUIT: 20123456781 - Constructora Demo SA
CUIT: 30234567892 - Servicios IT Ejemplo SRL  
CUIT: 27345678903 - Consultoría Legal Mock

# Todos los datos son SIMULADOS y seguros para desarrollo
# No hay conexión a APIs gubernamentales reales
```

---

## 📚 **Documentación Técnica**

### **📖 Guías Disponibles:**
- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Configuración paso a paso
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Endpoints y schemas
- **[Architecture Overview](./docs/ARQUITECTURA.md)** - Diseño del sistema
- **[Contribution Guidelines](./docs/CONTRIBUTING.md)** - Cómo contribuir

### **🛠️ Tech Stack:**
- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** FastAPI (Python), Node.js
- **Database:** SQLite (desarrollo), PostgreSQL (producción)  
- **APIs:** RESTful + WebSockets
- **Deploy:** Vercel, Netlify, Docker

---

## 🎯 **Criterios de Evaluación**

### **Impacto Técnico (40%)**
- Calidad del código y arquitectura
- Innovación en la implementación
- Performance y escalabilidad

### **UX/UI Excellence (30%)**
- Diseño intuitivo y atractivo
- Responsive design
- Accesibilidad y usabilidad

### **Integración (20%)**
- Conectividad entre módulos
- Uso efectivo de APIs
- Flujo de datos coherente

### **Presentación (10%)**
- Demo clara y convincente
- Explicación técnica sólida
- Vision de producto

---

## 👥 **Mentorship & Support**

### **🧑‍💼 Adrián Lerer - Founder & CTO**
- **Experiencia:** 10+ años en LegalTech/RegTech
- **Especialidad:** IA conversacional, compliance automation
- **Disponibilidad:** Todo el viernes durante hackathon

### **📞 Contacto Directo:**
- **Email:** adrian@lerer.com.ar
- **LinkedIn:** [adrianlerer](https://linkedin.com/in/adrianlerer)
- **Slack HackAI:** @adrianlerer

### **🆘 Support Channels:**
- **Issues GitHub:** Para bugs y questions técnicas
- **Discord HackAI:** Chat en tiempo real
- **Mentorship 1:1:** Disponible bajo pedido

---

## 🏅 **Premios y Reconocimientos**

### **🥇 Mejor Proyecto Overall**
- **Reconocimiento:** Coautoria en publicación técnica
- **Mentoría:** 3 meses de mentoring 1:1
- **Networking:** Acceso a red de inversores RegTech

### **🥈 Mejores por Challenge**
- **Portfolio:** Carta de recomendación profesional
- **Código:** Créditos como contributor en repo principal
- **Oportunidad:** Pasantía/freelance en IntegridAI

### **🥉 Participación Destacada**
- **Certificado:** Universidad Austral + IntegridAI
- **Network:** Acceso a comunidad de desarrolladores RegTech
- **Learning:** Recursos exclusivos de capacitación

---

## 🚀 **¿Por Qué Es Especial?**

### **🔥 Proyecto Real, No Ejercicio**
- Sistema en producción con usuarios reales
- Tu código impacta empresas argentinas
- Portfolio con valor profesional inmediato

### **🧠 Tecnología Cutting-Edge**
- IA conversacional especializada en compliance
- RegTech automation con verificaciones reales
- Arquitectura moderna y escalable

### **🌟 Impact Social**
- Democratizar compliance para PyMEs
- Combatir corrupción con tecnología
- Transformar cultura empresarial argentina

---

## 🎉 **¡Empecemos a Cambiar el Mundo!**

**Este viernes no solo van a codear - van a co-crear el futuro del compliance en Latinoamérica.**

### **Ready to Start?**
1. **🚀 Fork este repo**
2. **📝 Elige tu challenge**  
3. **💻 Empezá a codear**
4. **🏆 Cambiemos la historia**

**¡Nos vemos el viernes en la Universidad Austral! 🎓**