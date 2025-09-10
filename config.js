// Configuración IntegridAI - Encuesta de Integridad
// Actualizar estos emails con las direcciones reales del equipo

const INTEGRIDAI_CONFIG = {
    // 📧 EMAILS DEL EQUIPO (ACTUALIZAR CON EMAILS REALES)
    teamEmails: {
        primary: 'ACTUALIZAR_EMAIL_PRINCIPAL@example.com',  // Email principal del equipo
        backup: 'ACTUALIZAR_EMAIL_BACKUP@example.com',      // Email de respaldo
        // Agregar más emails según necesiten:
        // ceo: 'ceo@integridai.com.ar',
        // compliance: 'compliance@empresa.com',  
        // surveys: 'encuestas@empresa.com'
    },
    
    // 🏢 INFORMACIÓN DE LA EMPRESA
    company: {
        name: 'IntegridAI',
        website: 'https://integridai.com.ar',
        project: 'HackAI 2025'
    },
    
    // 📊 CONFIGURACIÓN DE LA ENCUESTA
    survey: {
        title: 'Encuesta de Integridad Empresarial - Ley 27401',
        version: '2.0',
        autoSaveInterval: 15000, // 15 segundos
        maxSections: 6
    },
    
    // 🌐 URLS Y DOMINIOS
    urls: {
        production: 'https://encuestahackai2025.integridai.com.ar',
        development: 'http://localhost:3000',
        repository: 'https://github.com/adrianlerer/integridai-hackai-2025'
    }
};

// 📧 FUNCIÓN PARA OBTENER LISTA DE EMAILS
function getTeamEmails() {
    const emails = Object.values(INTEGRIDAI_CONFIG.teamEmails)
        .filter(email => !email.includes('example.com')) // Filtrar emails de ejemplo
        .filter(email => email.includes('@')); // Solo emails válidos
    
    if (emails.length === 0) {
        console.warn('⚠️ No hay emails del equipo configurados en config.js');
        return ['configurar@emails.aqui']; // Fallback
    }
    
    return emails;
}

// 📝 FUNCIÓN PARA GENERAR SUBJECT DEL EMAIL
function getEmailSubject(companyName, responseId) {
    return `Encuesta Integridad - ${companyName} - ${responseId} - ${INTEGRIDAI_CONFIG.company.project}`;
}

// Exportar configuración global
if (typeof window !== 'undefined') {
    window.INTEGRIDAI_CONFIG = INTEGRIDAI_CONFIG;
    window.getTeamEmails = getTeamEmails;
    window.getEmailSubject = getEmailSubject;
}