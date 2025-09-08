# 🚀 FLAISimulator - Quick Deploy Guide

## ⚡ **Deploy en 2 Minutos**

### **Opción 1: Netlify (Recomendado)**

#### **Método A: Drag & Drop (30 segundos)**
1. Ve a [netlify.com/drop](https://app.netlify.com/drop)
2. **Descarga** este repositorio como ZIP
3. **Descomprime** y arrastra la carpeta `flaisimulator/` 
4. **¡Live inmediatamente!** en `https://random-name.netlify.app`

#### **Método B: Git Deploy (1 minuto)**
1. **Fork** este repositorio en GitHub
2. Ve a [netlify.com](https://netlify.com) → **New site from Git**
3. Conecta GitHub → Selecciona tu fork
4. **Build settings:**
   - Build command: `echo "No build required"`
   - Publish directory: `flaisimulator`
5. **Deploy site**

### **Opción 2: GitHub Pages (Gratis)**
1. **Fork** este repositorio
2. Ve a **Settings** → **Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. **Save** → Live en `https://tu-usuario.github.io/integridai-hackai-2025/flaisimulator/`

### **Opción 3: Vercel (1 click)**
1. Ve a [vercel.com](https://vercel.com)
2. **Import** desde GitHub → Selecciona este repo
3. **Deploy** → Live en `https://tu-proyecto.vercel.app`

---

## 🎯 **URLs de Acceso Inmediato**

### **GitHub Pages (Ya live):**
👉 **https://adrianlerer.github.io/integridai-hackai-2025/flaisimulator/**

### **Demo Sandbox (Temporal):**
👉 **https://3001-i39sxvp4quqih13nfd7xg-6532622b.e2b.dev**

---

## 📊 **Verificar Sistema de Datos**

Después del deploy, probá el sistema:

```javascript
// Abrir consola del navegador (F12) y ejecutar:

// 1. Completar el juego (10 escenarios)
// 2. Ver estadísticas en tiempo real
window.flaiDataExport.getLiveStats()

// 3. Descargar datos completos
window.flaiDataExport.downloadData()

// 4. Exportar CSV para Excel
window.flaiDataExport.downloadCSV()

// 5. Ver datos raw en consola
window.flaiDataExport.exportAllData()
```

---

## 🚀 **Distribución Viral Inmediata**

### **LinkedIn Post Ready-to-Share:**

```
🎯 ¿Qué tan ético eres en tu trabajo?

Lancé FLAISimulator - el primer test de ética empresarial argentina que combina gaming con investigación cultural.

✅ 10 dilemas reales del mercado argentino
✅ Basado en Ley 27.401 de Responsabilidad Penal Empresaria  
✅ 5 minutos que te van a hacer reflexionar
✅ Ranking con otros profesionales de tu sector

Lo más interesante: cada respuesta alimenta la primera base de datos cultural de Argentina sobre ética empresarial.

¿Te animás a probarlo? 👇
[TU-URL-DEPLOYMENT]

#EticaEmpresarial #Compliance #Argentina #Profesionales
```

### **WhatsApp/Teams para Equipos:**

```
🎯 Desafío para el equipo:

Encontré este simulador de ética empresarial argentina que está buenísimo.

Son 10 dilemas reales en 5 minutos. Me tocó un caso sobre un cliente que me quería "agradecer" con 50k USD 😅

¿Se animan a probarlo y comparamos resultados?

[TU-URL-DEPLOYMENT]

A ver quién tiene el perfil ético más sólido del equipo 🏆
```

---

## ⚡ **Métricas Esperadas (Basado en Mecánicas Virales)**

### **Semana 1:**
- 100-500 jugadores iniciales
- 1,000-5,000 decisiones etiquetadas
- Tasa de compartido: 15-25%

### **Semana 2:**  
- 500-1,500 jugadores (viral kickoff)
- 5,000-15,000 decisiones
- Coeficiente viral: >1.2

### **Mes 1:**
- 2,000-5,000+ jugadores
- 20,000-50,000+ decisiones
- Adopción corporativa iniciada
- Dataset único de ética cultural argentina

---

## 🔧 **Troubleshooting**

### **Si no funciona el sistema de datos:**
1. Verificá que localStorage esté habilitado
2. Abrí consola (F12) y buscá errores
3. Probá en modo incógnito
4. Los datos se guardan localmente como backup

### **Si las URLs no cargan:**
- GitHub Pages puede tardar 5-10 minutos en activarse
- Netlify es inmediato
- Verificá que los archivos estén en la carpeta correcta

### **Para customizar:**
- Escenarios: Editar `flaisimulator/game.js` 
- Styling: Editar `flaisimulator/style.css`
- Datos: Configurar Supabase en Netlify env vars

---

## 🎉 **¡Listo para Distribución Masiva!**

El FLAISimulator está **100% funcional** y listo para:

- ✅ **Distribución viral** en redes profesionales
- ✅ **Recolección automática** de datos culturales  
- ✅ **Exportación completa** para análisis
- ✅ **Escalabilidad** para miles de usuarios
- ✅ **Adopción corporativa** en programas de compliance

**🇦🇷 ¡A revolucionar la ética empresarial argentina! 🚀**