# 🚀 FLAISimulator - Deployment Guide

## Quick Netlify Deployment (5 minutos)

### Paso 1: Crear cuenta en Netlify
1. Ve a [netlify.com](https://netlify.com) y registrate gratis
2. Conecta tu cuenta de GitHub

### Paso 2: Deploy desde GitHub
1. **"New site from Git"** → **GitHub** → Selecciona este repositorio
2. **Build settings:**
   - Build command: `echo "No build required"`
   - Publish directory: `.` (punto)
3. **Deploy site**

### Paso 3: Configurar dominio personalizado (opcional)
1. **Site settings** → **Domain management**
2. **Add custom domain**: `tudominio.com`
3. Configurar DNS según instrucciones de Netlify

### Paso 4: Variables de entorno para datos (opcional)
Si quieres guardar datos en Supabase:
1. **Site settings** → **Environment variables**
2. Agregar:
   - `SUPABASE_URL`: tu URL de Supabase
   - `SUPABASE_ANON_KEY`: tu clave anónima de Supabase

## ✅ ¡Listo!

Tu FLAISimulator estará live en: `https://tu-sitio.netlify.app`

## 📊 Acceso a Datos

### Desde la consola del navegador:
```javascript
// Estadísticas en tiempo real
window.flaiDataExport.getLiveStats()

// Descargar dataset completo
window.flaiDataExport.downloadData()

// Descargar CSV para análisis
window.flaiDataExport.downloadCSV()

// Ver todos los datos raw
window.flaiDataExport.exportAllData()
```

### Los datos se guardan automáticamente:
- **LocalStorage**: Para funcionalidad offline
- **Netlify Functions**: Para backup automático
- **Supabase** (opcional): Para persistencia a largo plazo

## 🎯 Distribución Viral

### LinkedIn Posts Sugeridos:

**Post 1 - Lanzamiento:**
```
🎯 ¿Qué tan ético eres en tu trabajo?

Acabo de lanzar FLAISimulator - el primer test de ética empresarial argentina que combina gaming con investigación cultural.

✅ 10 dilemas reales del mercado argentino
✅ Basado en Ley 27.401 de Responsabilidad Penal Empresaria  
✅ 5 minutos que te van a hacer reflexionar
✅ Ranking con otros profesionales de tu sector

Lo más interesante: cada respuesta alimenta la base de datos cultural más grande de Argentina sobre ética empresarial.

¿Te animás a probarlo? 👇
[TU-URL-AQUI]

#EticaEmpresarial #Compliance #Argentina #Profesionales
```

**Post 2 - Resultados:**
```
📊 Resultados sorprendentes del FLAISimulator después de 48 hs:

• 500+ profesionales ya completaron el test
• Sector Fintech lidera en ética (promedio 87/100)
• CABA vs Interior: diferencias culturales marcadas
• 78% tiende a consultar antes de decidir

¿Dónde se ubica tu sector? ¿Y tu región?

Probá el simulador y comparate:
[TU-URL-AQUI]

La ética empresarial argentina tiene patrones únicos. Los datos lo demuestran.

#DatosCulturales #EticaEmpresarial #Research
```

### WhatsApp/Teams:
```
🎯 Desafío para el equipo:

Encontré este simulador de ética empresarial argentina que está buenísimo.

Son 10 dilemas reales en 5 minutos. Me tocó un caso de un cliente que me quería "agradecer" con 50k USD 😅

¿Se animan a probarlo y comparamos resultados?

[TU-URL-AQUI]

A ver quién tiene el perfil ético más sólido del equipo 🏆
```

## 📈 Métricas a Trackear

### KPIs Virales:
- **Completion Rate**: % que termina los 10 escenarios
- **Share Rate**: % que comparte resultado
- **Viral Coefficient**: nuevos usuarios por usuario existente
- **Return Rate**: % que juega más de una vez

### Analytics Culturales:
- Patrones por sector/región
- Flags culturales más frecuentes
- Diferencias generacionales
- Evolución temporal de respuestas

## 🔧 Customización

### Agregar nuevos escenarios:
Editar `game.js` → array `scenarios` → agregar objeto con estructura:
```javascript
{
  id: 11,
  title: "Nuevo Escenario",
  context: "...", 
  description: "...",
  options: [...],
  legal_reference: "Ley X",
  risk_level: "ALTO"
}
```

### Modificar scoring:
Editar `game.js` → método `calculateResults()`

### Cambiar insights culturales:
Editar `game.js` → método `analyzeCulturalPatterns()`

## 🛡️ Datos y Privacidad

- ✅ **Completamente anónimo**
- ✅ **GDPR compatible**
- ✅ **Ley de Protección de Datos Personales (Argentina)**
- ✅ **Consentimiento informado**
- ✅ **Backup automático cada 30 segundos**
- ✅ **Limpieza automática (30 días)**

---

**¡En 7 días deberías tener 1,000+ jugadores y 10,000+ decisiones etiquetadas!**

**🇦🇷 Ética empresarial argentina, gamificada y viral 🚀**