const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Definir personajes disponibles
        const characters = [
            {
                key: 'catalina',
                name: 'Catalina Oportunista',
                role: '⚠️ Personaje de Entrenamiento - Simulador de Corrupción',
                specialization: 'Tentación y escenarios de corrupción empresarial',
                expertise_areas: ['Sobornos disfrazados', 'Favores inapropiados', 'Regalos comprometedores', 'Simulación realista'],
                ai_enabled: true,
                reasoning_level: 'medio',
                warning: 'ENTRENAMIENTO: Este personaje simula situaciones de corrupción para práctica',
                version: '4.0-AI'
            },
            {
                key: 'mentor',
                name: 'Dr. Mentor',
                role: 'Experto Académico en Compliance',
                specialization: 'Ley 27.401 - Responsabilidad Penal Empresaria',
                expertise_areas: ['Análisis normativo', 'Evaluación de riesgo regulatorio', 'Interpretación legal'],
                ai_enabled: true,
                reasoning_level: 'alto',
                version: '4.0-AI'
            },
            {
                key: 'ana',
                name: 'Ana Auditora',
                role: 'Especialista en Controles Operacionales',
                specialization: 'Implementación práctica de compliance',
                expertise_areas: ['Controles internos', 'Procedimientos operacionales', 'Auditoría de compliance'],
                ai_enabled: true,
                reasoning_level: 'medio',
                version: '4.0-AI'
            },
            {
                key: 'carlos',
                name: 'Carlos CEO',
                role: 'Ejecutivo Estratégico',
                specialization: 'Decisiones estratégicas de compliance',
                expertise_areas: ['Estrategia corporativa', 'Gestión de riesgo', 'ROI de compliance'],
                ai_enabled: true,
                reasoning_level: 'alto',
                version: '4.0-AI'
            }
        ];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(characters)
        };

    } catch (error) {
        console.error('Error getting characters:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};