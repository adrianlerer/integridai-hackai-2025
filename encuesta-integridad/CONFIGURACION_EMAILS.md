# 📧 Configuración de Emails del Equipo IntegridAI

## ⚠️ **IMPORTANTE: Configurar Antes del Deploy**

El sistema de encuestas está configurado para enviar los resultados por email al equipo IntegridAI, pero **necesitas actualizar los emails reales** antes de publicar.

## 🔧 **Cómo Configurar**

### **1. Editar archivo de configuración**
```bash
# Editar el archivo:
/encuesta-integridad/config.js

# Buscar la sección:
teamEmails: {
    primary: 'ACTUALIZAR_EMAIL_PRINCIPAL@example.com',
    backup: 'ACTUALIZAR_EMAIL_BACKUP@example.com',
}
```

### **2. Reemplazar con emails reales**
```javascript
// ANTES (ejemplo):
teamEmails: {
    primary: 'ACTUALIZAR_EMAIL_PRINCIPAL@example.com',
    backup: 'ACTUALIZAR_EMAIL_BACKUP@example.com',
}

// DESPUÉS (con emails reales del equipo):
teamEmails: {
    primary: 'adrian@integridai.com.ar',           // Email principal
    backup: 'equipo@integridai.com.ar',           // Email de respaldo
    ceo: 'ceo@integridai.com.ar',                 // CEO (opcional)
    compliance: 'compliance@tuempresa.com'         // Compliance (opcional)
}
```

### **3. Opciones de configuración**

#### **Opción A: Email Personal/Gmail**
```javascript
teamEmails: {
    primary: 'tu.email.personal@gmail.com',
    backup: 'otro.email@outlook.com'
}
```

#### **Opción B: Emails Corporativos**  
```javascript
teamEmails: {
    primary: 'surveys@integridai.com.ar',
    backup: 'admin@integridai.com.ar',
    ceo: 'direccion@integridai.com.ar'
}
```

#### **Opción C: Emails de Prueba (para testing)**
```javascript
teamEmails: {
    primary: 'test@mailtrap.io',        // Para testing
    backup: 'debug@tempmail.com'       // Email temporal
}
```

## 📝 **Formato del Email que Recibirán**

```
DE: [navegador del usuario]
PARA: [emails configurados]
ASUNTO: Encuesta Integridad - [Nombre Empresa] - INTGRD_12345... - HackAI 2025

CUERPO:
===============================================
ENCUESTA DE INTEGRIDAD EMPRESARIAL - LEY 27401
===============================================

ID de Respuesta: INTGRD_1704915600000_abc123
Fecha: 9/1/2025, 3:00:00 PM

INFORMACIÓN DE LA EMPRESA
-------------------------
Empresa: Empresa del Parque Austral
Sector: tecnologia
Tamaño: mediana
Contacto: contacto@empresa.com
Cargo encuestado: Gerente de Compliance

PROGRAMA DE INTEGRIDAD  
----------------------
Estado del programa: parcial
Elementos implementados: codigo_etica, politica_funcionarios

[... más detalles ...]
```

## 🚀 **Después de Configurar**

### **1. Commit los cambios**
```bash
git add encuesta-integridad/config.js
git commit -m "config: Update team emails for survey responses"
git push origin main
```

### **2. Probar en desarrollo**
```bash
# Completar una encuesta de prueba
# Verificar que llegue el email a las direcciones configuradas
```

### **3. Deploy a producción**
```bash
# Deploy en Netlify con emails configurados
# La configuración se aplica automáticamente
```

## 🛠️ **Troubleshooting**

### **Problema: No llegan los emails**
```javascript
// Verificar en navegador (F12 → Console):
console.log(getTeamEmails()); 
// Debe mostrar: ["tu@email.com", "otro@email.com"]

// Si muestra emails de ejemplo, actualizar config.js
```

### **Problema: Error en navegador**
```javascript
// Error común: "getTeamEmails is not defined"
// Solución: Verificar que config.js se carga antes que script-v2.js
// En index.html debe estar:
<script src="config.js"></script>      <!-- PRIMERO -->
<script src="script-v2.js"></script>   <!-- SEGUNDO -->
```

### **Problema: Cliente de email no abre**
```javascript
// Algunos navegadores bloquean mailto: con muchos destinatarios
// Solución: Reducir a máximo 3 emails en teamEmails
teamEmails: {
    primary: 'email1@domain.com',
    backup: 'email2@domain.com'   // Solo 2 emails máximo
}
```

## 📊 **Alternativas de Recolección**

Si los emails no funcionan bien, hay otros métodos configurados:

### **1. Exportación Manual**
- Usuario completa encuesta
- Click "📥 Exportar CSV" o "📥 Exportar JSON"  
- Envía archivo manualmente

### **2. Almacenamiento Automático**
- Datos guardados en LocalStorage del navegador
- Datos guardados en IndexedDB
- Pueden extraerse desde DevTools del navegador

### **3. Servidor Netlify Functions**
- Endpoint automático: `/.netlify/functions/survey-responses`
- Logs disponibles en Netlify dashboard
- Configurar base de datos externa (Supabase/Airtable)

---

**🎯 RESULTADO**: Después de configurar los emails, el sistema enviará automáticamente todas las respuestas de encuesta al equipo IntegridAI para análisis y seguimiento.**