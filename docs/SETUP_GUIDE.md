# 🚀 Setup Guide - IntegridAI HackAI 2025

## ⚡ Quick Start (5 minutos)

### **1. Prerequisites**
```bash
# Verificar versiones
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
git --version   # >= 2.0.0
```

### **2. Clone & Setup**
```bash
# Clonar repo
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025

# Instalar dependencias
npm install

# Setup environment
cp .env.example .env.local

# Iniciar desarrollo
npm run dev
```

### **3. Verificar Instalación**
```bash
# Abrir en browser
open http://localhost:3000      # Frontend
open http://localhost:3001      # Mock API

# Health checks
curl http://localhost:3001/health
curl http://localhost:3001/compliance_dashboard
```

---

## 📂 **Estructura del Proyecto**

```
integridai-hackai-2025/
├── 📁 src/
│   ├── 🎨 frontend/          # Challenge: UX/UI
│   ├── 🔌 backend/           # Challenge: APIs
│   └── 📊 analytics/         # Challenge: Data
├── 📱 mobile/                # Challenge: Mobile
├── 🔧 api/mock/              # Mock APIs seguras
├── 📚 docs/                  # Documentación
├── 🏆 hackathon/            # Challenges específicos
└── 🚀 deployment/           # Deploy configs
```

---

## 🔧 **Configuración por Challenge**

### **🎨 Frontend Challenge**
```bash
# Setup específico frontend
cd src/frontend
npm install

# Dependencias adicionales
npm install react@18 typescript tailwindcss
npm install @headlessui/react heroicons
npm install framer-motion react-hook-form
npm install zustand react-router-dom

# Iniciar desarrollo
npm run dev    # Puerto 3000
```

### **🔌 Backend APIs Challenge**
```bash
# Setup APIs
cd src/backend
npm install

# Dependencias backend
npm install fastapi express
npm install cors helmet morgan
npm install sqlite3 prisma

# Iniciar servidor
npm run dev    # Puerto 3002
```

### **📊 Data Analytics Challenge**
```bash
# Setup analytics
cd src/analytics
pip install -r requirements.txt

# Dependencias Python
pip install pandas numpy matplotlib
pip install plotly dash streamlit
pip install scikit-learn

# Iniciar analytics server
python app.py  # Puerto 3003
```

### **📱 Mobile Challenge**
```bash
# Setup mobile
cd mobile
npm install

# React Native setup
npx react-native init IntegridAIMobile
npm install @react-navigation/native
npm install react-native-vector-icons

# Expo setup (alternativo)
npx create-expo-app IntegridAIMobile
npm install expo-camera expo-document-picker

# Iniciar desarrollo
npm run ios    # iOS Simulator
npm run android # Android Emulator
```

---

## 🔌 **APIs Mock Disponibles**

### **Base URL:**
```bash
API_BASE=http://localhost:3001
```

### **Endpoints Principales:**

#### **Health Check**
```bash
GET /health
# Response: { status, service, version, capabilities }
```

#### **Análisis de Proveedor**
```bash
POST /analyze_provider
Content-Type: application/json

{
  "name": "Mi Empresa SA",
  "cuit": "30-12345678-9", 
  "sector": "tecnologia",
  "documents": ["balance.pdf", "codigo_etica.pdf"],
  "contact_email": "contacto@empresa.com"
}

# Response: Análisis completo con score, verificaciones, recomendaciones
```

#### **Dashboard Metrics**
```bash
GET /compliance_dashboard
# Response: Métricas consolidadas, análisis recientes, distribución sectorial
```

#### **Regulatory Updates**
```bash
GET /regulatory_updates  
# Response: Últimas actualizaciones regulatorias
```

### **Ejemplo de Uso (JavaScript):**
```javascript
// Cliente API simple
const API_BASE = 'http://localhost:3001';

async function analyzeProvider(providerData) {
  try {
    const response = await fetch(`${API_BASE}/analyze_provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Analysis Result:', result);
    return result;
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Uso
const provider = {
  name: "TechStart SRL",
  cuit: "30-87654321-0",
  sector: "tecnologia",
  documents: ["balance_2024.pdf", "estatuto.pdf"]
};

analyzeProvider(provider)
  .then(result => {
    console.log(`Score: ${result.compliance_analysis.overall_score}%`);
    console.log(`Risk: ${result.compliance_analysis.risk_level}`);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });
```

---

## 🗄️ **Base de Datos Demo**

### **SQLite Setup (Para desarrollo):**
```bash
# Crear base demo
npm run seed:demo

# Estructura de datos
data/
├── hackathon.db        # Base principal desarrollo
├── demo.db            # Datos de ejemplo
└── samples/           # Datasets para analytics
    ├── providers.json
    ├── analyses.json
    └── metrics.json
```

### **Modelos de Datos:**
```typescript
// Provider Model
interface Provider {
  id: string;
  name: string;
  cuit: string;
  sector: string;
  compliance_score: number;
  risk_level: 'bajo' | 'medio' | 'alto';
  created_at: string;
  updated_at: string;
}

// Analysis Model  
interface Analysis {
  id: string;
  provider_id: string;
  score: number;
  risk_factors: RiskFactor[];
  verifications: Verification[];
  recommendations: string[];
  created_at: string;
}
```

---

## 🚀 **Deployment Options**

### **Vercel (Recomendado para Frontend):**
```bash
# Install Vercel CLI
npm install -g vercel

# Setup proyecto
vercel

# Deploy
vercel --prod

# Custom domain (opcional)
vercel domains add your-team-name.vercel.app
```

### **Netlify (Alternativo):**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Setup
netlify init

# Deploy
netlify deploy --prod
```

### **Docker (Para desarrollo local):**
```bash
# Build image
docker build -t integridai-hackathon .

# Run container
docker run -p 3000:3000 -p 3001:3001 integridai-hackathon

# Docker Compose (desarrollo completo)
docker-compose up -d
```

### **Configuración Vercel:**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/frontend/package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "api/mock/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/mock/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/src/frontend/$1"
    }
  ]
}
```

---

## 🐛 **Troubleshooting**

### **Problemas Comunes:**

#### **Port Already in Use:**
```bash
# Matar proceso en puerto
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Cambiar puerto en .env.local
PORT=3005
MOCK_API_PORT=3006
```

#### **Node Version Issues:**
```bash
# Usar nvm para cambiar versión
nvm install 18
nvm use 18
nvm alias default 18
```

#### **CORS Errors:**
```bash
# Verificar CORS origin en .env.local
CORS_ORIGIN=http://localhost:3000,http://localhost:3005

# O deshabilitar temporalmente para desarrollo
CORS_DISABLED=true
```

#### **Mock API No Response:**
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:3001/health

# Reiniciar mock API
npm run api:mock

# Check logs
npm run api:mock -- --verbose
```

### **Performance Issues:**
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpiar cache
npm cache clean --force

# Verificar memoria disponible
node --max-old-space-size=4096 api/mock/regtech.js
```

---

## 📞 **Support & Help**

### **Durante HackAI 2025:**
- 💬 **Slack:** #integridai-support
- 🐛 **Issues:** [GitHub Issues](https://github.com/adrianlerer/integridai-hackai-2025/issues)
- 👨‍💻 **Mentor:** Adrian Lerer - adrian@lerer.com.ar

### **Resources:**
- 📚 **Docs:** `/docs/` folder
- 💡 **Examples:** `/examples/` folder  
- 🎥 **Video Guides:** [Coming Soon]

### **Emergency Contacts:**
```
Adrian Lerer (Founder)
📧 adrian@lerer.com.ar
📱 +54 9 11 5120 1247
🔗 linkedin.com/in/adrianlerer
```

---

## 🏆 **Success Checklist**

### **✅ Setup Completo:**
- [ ] Node.js 18+ instalado
- [ ] Repo clonado y dependencias instaladas
- [ ] `.env.local` configurado correctamente
- [ ] Mock API corriendo en puerto 3001
- [ ] Frontend accesible en puerto 3000
- [ ] Health check API funcionando

### **✅ Ready to Code:**
- [ ] Challenge elegido (Frontend/Backend/Analytics/Mobile)
- [ ] Editor/IDE configurado con extensiones
- [ ] Git configurado con usuario y email
- [ ] Branch de desarrollo creado
- [ ] Primer commit realizado

### **✅ Ready to Demo:**
- [ ] Funcionalidad core implementada
- [ ] APIs integradas correctamente
- [ ] UI/UX pulida y responsive
- [ ] Testing básico completado
- [ ] Deploy funcionando

---

## 🎉 **¡Estás Listo!**

**Con este setup tienes todo lo necesario para crear algo increíble en HackAI 2025.**

**¡Ahora a codear! 🚀**