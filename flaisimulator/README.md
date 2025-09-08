# 🎯 FLAISimulator - Viral Compliance Training Game

![FLAISimulator](https://img.shields.io/badge/FLAISimulator-MVP-blue?style=for-the-badge)
![Argentina](https://img.shields.io/badge/Argentina-Cultural%20Research-green?style=for-the-badge)
![Viral](https://img.shields.io/badge/Strategy-Viral%20Gaming-orange?style=for-the-badge)

**El primer simulador viral de ética empresarial argentina que combina gaming adictivo con investigación cultural profunda.**

## 🚀 ¿Qué es FLAISimulator?

FLAISimulator es un juego web viral diseñado para **recolectar datos culturales sobre ética empresarial argentina** a través de gamificación. En solo 5 minutos, los usuarios enfrentan 10 dilemas éticos empresariales basados en casos reales y la **Ley 27.401 de Responsabilidad Penal Empresaria**.

### 🎮 Mecánica Viral

- **⚡ 5 minutos total**: Experiencia rápida y adictiva
- **🏆 Ranking social**: Competencia entre colegas y empresas
- **📱 Sharing integrado**: Botones de compartir en cada resultado
- **🎯 Desafíos virales**: "Desafiá a tu equipo" como call-to-action principal
- **🇦🇷 Contexto argentino**: Dilemas culturalmente específicos

### 📊 Propósito de Investigación

Cada partida recolecta **datos anónimos** que alimentan el dataset cultural más completo de Argentina sobre:
- Patrones de toma de decisiones éticas
- Diferencias regionales y sectoriales  
- Influencia de jerarquías y relaciones personales
- Respuestas bajo presión temporal
- Tendencias generacionales en compliance

## 📁 Estructura del Proyecto

```
docs/
├── index.html          # Landing page viral con CTAs optimizados
├── game.html           # Interfaz principal del juego
├── game.js            # Lógica completa del juego + 10 escenarios
├── style.css          # Diseño profesional responsive
├── share.js           # Sistema de compartido viral
├── leaderboard.js     # Rankings y competencia social
└── README.md          # Esta documentación
```

## 🎯 Los 10 Escenarios Éticos

Cada escenario está basado en **casos reales del mercado argentino**:

1. **El Cliente VIP Generoso** - Regalos de clientes importantes
2. **La Licitación con Información Privilegiada** - Insider information gubernamental
3. **El Proveedor Familiar** - Nepotismo en PyMEs familiares  
4. **La Auditoría Incómoda** - Presión para ocultar irregularidades
5. **El Regalo de Año Nuevo Corporativo** - Obsequios estacionales
6. **La Facturación Creativa** - Manipulación de estados financieros
7. **El Contacto Político Estratégico** - Tráfico de influencias
8. **La Competencia Interna Desleal** - Conflictos de información interna
9. **El Proveedor con Problemas Laborales** - Ética en cadena de suministro
10. **La Oportunidad de Inversión Familiar** - Uso de información privilegiada

## 🚀 Despliegue en GitHub Pages

### Paso 1: Configuración del Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/adrianlerer/argentina-compliance-cultural-dataset.git
cd argentina-compliance-cultural-dataset

# Copiar archivos del FLAISimulator
cp -r /path/to/docs/* .
```

### Paso 2: Activar GitHub Pages

1. Ve a **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **docs**
4. Folder: **/ (root)** o **/docs**
5. Save

### Paso 3: Configurar Dominio Personalizado (Opcional)

```
# En Settings → Pages → Custom domain
flaisimulator.com
```

### Paso 4: Verificar Despliegue

Tu juego estará disponible en:
- `https://adrianlerer.github.io/argentina-compliance-cultural-dataset/`
- O tu dominio personalizado

## 📊 Sistema de Analíticas

### Datos Recolectados (Anónimos)

```javascript
// Perfil demográfico (opcional)
{
  sector: "tecnologia|finanzas|consultoria|retail|...",
  position: "junior|senior|gerente|director|c-level",
  experience: "0-2|3-5|6-10|11-15|16+",
  region: "caba|gba|cordoba|rosario|mendoza|..."
}

// Por cada decisión
{
  scenario_id: 1-10,
  selected_option: 0-2,
  option_type: "ethical|consultation|risky",
  cultural_flags: ["relationship_priority", "risk_aversion", ...],
  time_taken: 1-30, // segundos
  timestamp: Date.now()
}
```

### Patrones Culturales Detectados

- **Consultation Pattern**: Tendencia a consultar superiores
- **Risk Aversion**: Aversión al riesgo ético
- **Relationship Priority**: Priorización de relaciones personales
- **Authority Deference**: Deferencia hacia autoridad
- **Process Adherence**: Adhesión a procesos formales

### Acceso a Datos

```javascript
// En consola del navegador
window.flaiGame.answers // Respuestas del usuario actual
window.flaiLeaderboard.getComprehensiveAnalytics() // Datos agregados
window.socialShare.getViralAnalytics() // Métricas virales
```

## 🎮 Mecánica de Gamificación

### Sistema de Puntuación

- **Decisión ética**: 10 puntos
- **Consulta/Escalación**: 6-8 puntos  
- **Decisión riesgosa**: 0-3 puntos
- **Skip/Timeout**: 0 puntos

### Categorías de Resultado

- **90-100**: "Ético Ejemplar" 🏆
- **70-89**: "Ético Sólido" ✅
- **55-69**: "Perfil Mixto" ⚖️
- **40-54**: "Perfil Pragmático" 🤔
- **0-39**: "Perfil de Alto Riesgo" ⚠️

### Elementos Virales

1. **Ranking Social**: Leaderboard público por sector/región
2. **Desafío de Equipos**: "Desafiá a tu equipo de trabajo"
3. **Sharing Optimizado**: Mensajes personalizados por plataforma
4. **Comparación Cultural**: "Tu perfil vs. promedio argentino"
5. **Badges Sectoriales**: Reconocimiento por industria

## 🔧 Personalización y Extensión

### Agregar Nuevos Escenarios

```javascript
// En game.js, agregar al array scenarios:
{
  id: 11,
  title: "Tu Nuevo Escenario",
  context: "Contexto situacional...",
  description: "Descripción del dilema...",
  question: "¿Qué harías?",
  options: [
    {
      text: "Opción A",
      type: "ethical|consultation|risky",
      score: 0-10,
      cultural_flags: ["flag1", "flag2"]
    }
  ],
  legal_reference: "Ley X - Art. Y",
  risk_level: "BAJO|MEDIO|ALTO|MUY ALTO"
}
```

### Modificar Análisis Cultural

```javascript
// En game.js, método analyzeCulturalPatterns()
const insights = [];

if (/* tu condición */) {
  insights.push({
    title: 'Tu Patrón Cultural',
    description: 'Descripción del insight...'
  });
}
```

### Personalizar Sharing

```javascript
// En share.js, modificar baseMessages
const messages = {
  linkedin: { text: "Tu mensaje personalizado..." },
  whatsapp: { text: "Tu mensaje para WhatsApp..." }
};
```

## 📈 Estrategia de Crecimiento Viral

### Fase 1: Seeding (Días 1-7)
- **Target**: 100 primeros jugadores
- **Canal**: LinkedIn posts profesionales
- **Hook**: "¿Qué tan ético eres en tu trabajo?"

### Fase 2: Social Proof (Días 8-30)  
- **Target**: 1,000+ jugadores
- **Canal**: Sharing orgánico + desafíos de equipos
- **Hook**: Rankings sectoriales y regionales

### Fase 3: Viral Loop (Días 31+)
- **Target**: 10,000+ jugadores
- **Canal**: Autorrefuerzo del sistema de rankings
- **Hook**: Competencia entre empresas

### Métricas Clave (KPIs)

- **Tasa de Compartido**: % usuarios que comparten resultado
- **Viral Coefficient**: Nuevos usuarios por usuario existente  
- **Completion Rate**: % que terminan los 10 escenarios
- **Return Engagement**: % que juegan más de una vez
- **Data Quality**: % que completan perfil demográfico

## 🔬 Valor Científico

### Para Investigadores

- **Dataset único**: 10,000+ decisiones éticas contextualizadas
- **Validez ecológica**: Escenarios basados en casos reales
- **Diversidad muestral**: Múltiples sectores y regiones
- **Datos temporales**: Patrones de respuesta bajo presión
- **Control cultural**: Específico para mercado argentino

### Para Empresas

- **Benchmarking sectorial**: Comparación con competidores
- **Diagnóstico cultural**: Perfiles éticos por región/industria  
- **Diseño de training**: Insights para programas de compliance
- **Risk assessment**: Identificación de puntos débiles éticos
- **Change management**: Medición de evolución cultural

## 📱 Compatibilidad Técnica

### Navegadores Soportados
- Chrome 70+
- Firefox 65+  
- Safari 12+
- Edge 80+
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 7+)

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: localStorage (fallback para datos offline)
- **Sharing**: Web Share API + fallbacks tradicionales
- **Responsive**: CSS Grid + Flexbox
- **Performance**: <2MB total, <1s load time

## 🛡️ Privacidad y Ética

### Datos Recolectados
- ✅ **Completamente anónimos**
- ✅ **Sin información personal identificable**
- ✅ **Agregación estadística únicamente**
- ✅ **Transparencia total sobre uso de datos**

### Cumplimiento Legal
- ✅ **GDPR compatible** (aunque no aplicable en Argentina)
- ✅ **Ley de Protección de Datos Personales** (Argentina)
- ✅ **Consentimiento informado** en welcome screen
- ✅ **Derecho a no participar** (datos demográficos opcionales)

## 🚀 Próximos Pasos Post-MVP

### Funcionalidades Avanzadas
1. **Integración con LMS**: Plugin para plataformas de e-learning
2. **API Empresarial**: Dashboard para RRHHyCompliance
3. **Versión Multiplayer**: Decisiones grupales en tiempo real
4. **IA Predictiva**: Recomendaciones personalizadas de training
5. **Certificaciones**: Badges oficiales de compliance ético

### Expansión Regional  
1. **Chile**: Adaptación a normativa local
2. **México**: Escenarios específicos mexicanos
3. **Colombia**: Contexto de compliance colombiano
4. **Brasil**: Versión en portugués con casos brasileños

## 📞 Contacto y Contribuciones

### Para Investigadores
- Email: research@flaisimulator.com
- Dataset completo disponible bajo licencia académica
- Colaboraciones de investigación bienvenidas

### Para Empresas
- Email: enterprise@flaisimulator.com  
- Implementaciones white-label disponibles
- Dashboards personalizados por industria

### Para Desarrolladores
- GitHub: [adrianlerer/argentina-compliance-cultural-dataset](https://github.com/adrianlerer/argentina-compliance-cultural-dataset)
- Pull requests bienvenidos
- Issues y feature requests en GitHub

---

## 🎯 Call to Action

**¿Listo para hacer viral el entrenamiento en ética empresarial argentina?**

1. **Deploy** en GitHub Pages (5 minutos)
2. **Comparte** en LinkedIn con tus contactos profesionales  
3. **Desafiá** a tu equipo de trabajo
4. **Midé** el crecimiento viral día a día
5. **Recolectá** los primeros 1,000 datasets culturales

**En 7 días deberías tener 1,000+ jugadores y 10,000+ decisiones etiquetadas GRATIS.**

---

*FLAISimulator - Donde el gaming adictivo se encuentra con la investigación cultural seria.*

**🇦🇷 Hecho en Argentina para Argentina 🚀**