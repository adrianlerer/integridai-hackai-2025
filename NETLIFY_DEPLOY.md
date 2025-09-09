# 🚀 Deploy en Netlify - encuestahackai2025.integridai.com.ar

## 📋 **Pasos para Deploy Completo**

### **1. Preparación del Repositorio** ✅
```bash
# El código ya está listo en GitHub
Repository: https://github.com/adrianlerer/integridai-hackai-2025
Branch: main
```

### **2. Deploy en Netlify**

#### **Opción A: Deploy Automático desde GitHub**
```bash
1. Ir a https://netlify.com
2. Click "New site from Git"
3. Conectar con GitHub: adrianlerer/integridai-hackai-2025
4. Branch: main
5. Build command: (vacío - es static site)
6. Publish directory: . (directorio raíz)
7. Click "Deploy site"
```

#### **Opción B: Deploy Manual (Más Rápido)**
```bash
# Desde el directorio del proyecto:
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=.
```

### **3. Configuración del Dominio Personalizado**

#### **En Netlify Dashboard:**
```
1. Site Settings → Domain Management
2. Add custom domain: encuestahackai2025.integridai.com.ar
3. Verify ownership
```

#### **En el DNS de integridai.com.ar:**
```dns
# Agregar estos registros DNS:
Type: CNAME
Name: encuestahackai2025
Value: [sitio-netlify].netlify.app
TTL: 300

# O si prefieren un subdominio directo:
Type: A
Name: encuestahackai2025  
Value: [IP de Netlify]
```

### **4. Configuración SSL**
```
1. En Netlify: Site Settings → Domain Management → HTTPS
2. Enable "Force HTTPS"
3. Let's Encrypt certificate se genera automáticamente
```

### **5. Variables de Entorno (Opcionales)**
```bash
# En Netlify: Site Settings → Environment Variables
OPENROUTER_API_KEY=sk-or-... (si usan FLAISimulator)
SUPABASE_URL=https://... (si conectan base de datos)
SUPABASE_ANON_KEY=eyJ... (para almacenamiento persistente)
```

## 🌐 **URLs Finales**

### **Producción:**
- **Principal**: https://encuestahackai2025.integridai.com.ar
- **Encuesta**: https://encuestahackai2025.integridai.com.ar/encuesta-integridad/
- **Simulador**: https://encuestahackai2025.integridai.com.ar/flaisimulator/

### **Redirects Configurados:**
- `/encuesta` → `/encuesta-integridad/`
- `/survey` → `/encuesta-integridad/`
- `/api/*` → `/.netlify/functions/*`

## ⚙️ **Configuración Técnica**

### **netlify.toml** (ya configurado):
```toml
[build]
  publish = "."
  functions = "netlify/functions"
  command = "echo 'Static site ready for deploy'"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/encuesta/*"
  to = "/encuesta-integridad/index.html"
  status = 200
```

### **Netlify Functions** (ya configurado):
- `/.netlify/functions/survey-responses` para recibir datos de encuesta
- CORS habilitado para dominios externos
- Procesamiento automático de respuestas

## 📊 **Monitoreo Post-Deploy**

### **Analytics Recomendados:**
```javascript
// Google Analytics (agregar en index.html):
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'IntegridAI Survey',
  page_location: 'https://encuestahackai2025.integridai.com.ar'
});

// Netlify Analytics (automático):
- Visitas únicas
- Páginas más visitadas  
- Tiempo de permanencia
- Conversión de encuestas
```

### **Métricas Clave a Trackear:**
- **Tasa de completitud** de encuestas
- **Tiempo promedio** de completado
- **Abandono por sección**
- **Dispositivos** más utilizados (móvil vs desktop)
- **Fuentes de tráfico** (LinkedIn, email, directo)

## 🎯 **Distribución Post-Deploy**

### **Email de Lanzamiento:**
```
Asunto: 🚀 Lanzamos la Encuesta de Integridad Ley 27401

Estimado equipo y colaboradores,

¡Ya está disponible nuestra encuesta de integridad empresarial!

🔗 ACCESO DIRECTO:
👉 https://encuestahackai2025.integridai.com.ar

🎯 PARA COMPARTIR CON EMPRESAS:
📋 Encuesta completa: .../encuesta-integridad/
🎮 Simulador ético: .../flaisimulator/

📧 Datos se envían automáticamente a:
- surveys@integridai.com.ar
- compliance@integridai.com.ar

¡Empecemos a recopilar insights del mercado argentino!

Equipo IntegridAI
```

### **LinkedIn Post:**
```
🏛️ ¡Lanzamos la primera encuesta especializada en Ley 27401!

📋 5 minutos para evaluar el estado de tu programa de integridad
🎯 Enfoque específico en empresas del Parque Austral
📊 Diagnóstico inmediato + consulta gratuita

👉 https://encuestahackai2025.integridai.com.ar

#Compliance #Ley27401 #IntegridAI #ParqueAustral #HackAI2025
```

## 🛠️ **Mantenimiento y Actualizaciones**

### **Deploy Continuo:**
```bash
# Configurado automáticamente:
# Push a main → Deploy automático en Netlify
# Rollback disponible en dashboard
# Preview deploys para ramas de feature
```

### **Backup de Datos:**
```javascript
// Las respuestas se guardan en:
1. LocalStorage (navegador del usuario)
2. IndexedDB (navegador del usuario) 
3. Netlify Functions (logs del servidor)
4. Email automático (equipo IntegridAI)

// Recomendación: Configurar Supabase para almacenamiento persistente
```

## ✅ **Checklist Pre-Lanzamiento**

- ✅ Código limpio sin claims exagerados
- ✅ Navegación funcionando correctamente
- ✅ Formulario de 6 secciones completo
- ✅ Validaciones en tiempo real
- ✅ Export CSV/JSON funcionando
- ✅ Email sharing configurado
- ✅ Responsive design verificado
- ✅ Netlify Functions deployadas
- ✅ SSL certificate configurado
- ✅ Dominio personalizado configurado
- ⏳ DNS propagation (puede tardar 24-48hs)
- ⏳ Testing en producción
- ⏳ Distribución a primeras empresas

---

**🎯 RESULTADO**: Plataforma profesional lista para recopilar datos valiosos de empresas argentinas sobre su estado de compliance con Ley 27401.**