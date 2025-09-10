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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { session_id, message } = JSON.parse(event.body);
        
        if (!session_id || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'session_id y message son requeridos' })
            };
        }

        // Extraer personaje del session_id
        const character = session_id.split('-')[1].toLowerCase();
        
        // Validar personaje
        const valid_characters = ['catalina', 'mentor', 'ana', 'carlos'];
        if (!valid_characters.includes(character)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Sesión inválida' })
            };
        }

        // Determinar complejidad del mensaje
        const complexity_level = determineComplexity(message);

        // Generar respuesta con IA
        const ai_response = await generateAIResponse(character, message, complexity_level);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                session_id,
                character_response: {
                    message: ai_response.message,
                    character: ai_response.character_name,
                    expertise_level: ai_response.expertise_level || 'high',
                    compliance_focus: ai_response.compliance_focus || 'ley_27401'
                },
                complexity_detected: complexity_level,
                status: 'ongoing'
            })
        };

    } catch (error) {
        console.error('Error continuing conversation:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error procesando mensaje',
                message: error.message,
                fallback_message: 'Disculpa, hay un problema técnico. ¿Podrías reformular tu consulta?'
            })
        };
    }
};

function determineComplexity(message) {
    const message_lower = message.toLowerCase();
    
    // Indicadores de alta complejidad
    const high_complexity = [
        'análisis completo', 'dictamen', 'evaluación integral', 'auditoría',
        'implementación completa', 'marco regulatorio', 'múltiples artículos',
        'compliance program', 'due diligence', 'risk assessment'
    ];
    
    // Indicadores de media complejidad  
    const medium_complexity = [
        'procedimiento', 'control', 'política', 'proceso', 'evaluación',
        'riesgo', 'artículo', 'norma', 'implementar', 'establecer'
    ];

    if (high_complexity.some(indicator => message_lower.includes(indicator))) {
        return 'alto';
    } else if (medium_complexity.some(indicator => message_lower.includes(indicator))) {
        return 'medio';
    } else {
        return 'bajo';
    }
}

async function generateAIResponse(character, user_message, complexity_level) {
    try {
        const openrouter_api_key = process.env.OPENROUTER_API_KEY;
        
        if (!openrouter_api_key) {
            throw new Error('OPENROUTER_API_KEY no configurada en variables de entorno');
        }
        
        // Sistema de prompts mejorados para cada personaje
        const system_prompts = {
            'catalina': `Eres Catalina Oportunista, una persona argentina que intenta tentar al usuario con favores, regalos y situaciones de corrupción disfrazadas de amistad.

COMPORTAMIENTO:
- Amigable, casual, argentina (che, boludo, etc.)
- Oportunista que minimiza riesgos y consecuencias
- Ofreces "pequeños favores" que son técnicamente corrupción
- Insistes de manera simpática pero persistente
- Usas justificaciones como "todos lo hacen", "es normal", "pequeña ayuda"

ESTRATEGIAS:
- Regalos aparentemente inocentes (entradas, cenas, productos)
- Favores "entre amigos" en procesos comerciales
- Información privilegiada presentada casualmente
- Descuentos o beneficios "especiales" no declarados

IMPORTANTE: Mantén siempre el rol de tentadora. NO des consejos de compliance. Tu objetivo es que el usuario caiga en la tentación de manera simpática.`,

            'mentor': `Eres el Dr. Mentor, experto académico en Ley 27.401 (Responsabilidad Penal Empresaria Argentina).

OBLIGACIONES:
1. ANALIZAR EL CONTEXTO ESPECÍFICO del usuario (tipo de empresa, sector, situación)
2. CITAR artículos relevantes de Ley 27.401 cuando corresponda
3. EVALUAR RIESGO específico para ese contexto empresarial
4. PROPORCIONAR recomendaciones concretas y aplicables
5. NO repetir consultas genéricas - SIEMPRE responder con análisis específico

FORMATO:
- Contexto identificado: [tipo de empresa y situación específica]
- Análisis según Ley 27.401: [evaluación técnica]
- Artículos aplicables: [citación específica si corresponde]
- Recomendaciones: [acciones concretas]`,

            'ana': `Eres Ana Auditora, especialista operacional en implementación práctica de compliance Ley 27.401.

OBLIGACIONES:
1. EVALUAR los controles actuales del usuario vs. requerimientos legales
2. IDENTIFICAR gaps operacionales específicos
3. DISEÑAR procedimientos concretos de mitigación
4. PROPORCIONAR checklists y acciones implementables
5. SIEMPRE responder con recomendaciones operacionales específicas

FORMATO:
- Evaluación de controles actuales: [análisis de lo que tiene vs. lo que necesita]
- Gaps identificados: [brechas específicas]
- Controles requeridos: [según Ley 27.401 y ISO 37001]
- Plan de implementación: [pasos concretos]`,

            'carlos': `Eres Carlos CEO, ejecutivo estratégico especializado en decisiones de compliance bajo Ley 27.401.

OBLIGACIONES:
1. EVALUAR el impacto estratégico en el negocio del usuario
2. ANALIZAR costo/beneficio de implementaciones compliance
3. CONSIDERAR riesgo reputacional y regulatorio específico
4. PROPORCIONAR perspectiva ejecutiva sobre priorización
5. SIEMPRE responder with insights estratégicos específicos

FORMATO:
- Impacto en el negocio: [evaluación específica para el sector/empresa]
- Análisis de riesgo: [reputacional, regulatorio, competitivo]
- ROI de compliance: [inversión vs. beneficio/protección]
- Decisiones estratégicas: [priorización y timeline]`
        };

        const character_names = {
            'catalina': 'Catalina Oportunista',
            'mentor': 'Dr. Mentor',
            'ana': 'Ana Auditora',
            'carlos': 'Carlos CEO'
        };

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openrouter_api_key}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://integridai.com.ar',
                'X-Title': 'FLAISimulator-Netlify'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [
                    {
                        role: 'system',
                        content: system_prompts[character] || system_prompts['mentor']
                    },
                    {
                        role: 'system',
                        content: `CONTEXTO ACTUAL:
- Consulta de compliance empresarial argentina
- Nivel de complejidad: ${complexity_level}
- Plataforma: IntegridAI RegTech HackAI 2025

OBLIGACIONES INMEDIATAS:
1. ANALIZAR el contexto específico del usuario
2. PROPORCIONAR respuesta apropiada para tu personaje
3. MANTENER consistencia con tu rol
4. GENERAR respuestas específicas y aplicables`
                    },
                    {
                        role: 'user',
                        content: `CONSULTA DEL USUARIO: ${user_message}

RESPUESTA REQUERIDA:
- Analizar el contexto específico mencionado por el usuario
- Mantener consistencia con tu personaje
- Proporcionar respuesta útil y contextual
- ${character === 'catalina' ? 'Buscar oportunidades de tentación apropiadas' : 'Incluir expertise técnico relevante'}`
                    }
                ],
                max_tokens: complexity_level === 'alto' ? 600 : (complexity_level === 'medio' ? 400 : 250),
                temperature: character === 'catalina' ? 0.8 : 0.3, // Mayor creatividad para Catalina
                top_p: 0.9,
                frequency_penalty: 0.1,
                presence_penalty: 0.1
            })
        });

        if (response.ok) {
            const result = await response.json();
            return {
                message: result.choices[0].message.content.trim(),
                character_name: character_names[character],
                expertise_level: 'high',
                compliance_focus: character === 'catalina' ? 'corruption_simulation' : 'ley_27401'
            };
        } else {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

    } catch (error) {
        console.error('Error generating AI response:', error);
        
        // Fallback responses por personaje
        const fallbacks = {
            'catalina': '¡Che! ¿Cómo andás? Se me cortó la conexión. Contame, ¿en qué trabajás? Siempre ando buscando gente copada para hacer negocios juntos...',
            'mentor': 'Como experto en Ley 27.401, necesito analizar tu consulta específica. ¿Podrías proporcionar más detalles sobre el contexto de compliance?',
            'ana': 'Desde la perspectiva operacional, necesito más información sobre los controles actuales para hacer una evaluación efectiva.',
            'carlos': 'Como CEO, el análisis estratégico requiere entender el impacto en el negocio. ¿Cuál es el contexto específico?'
        };

        return {
            message: fallbacks[character] || fallbacks['mentor'],
            character_name: character_names[character] || 'Experto',
            expertise_level: 'basic_fallback',
            compliance_focus: character === 'catalina' ? 'corruption_simulation' : 'general'
        };
    }
}

const character_names = {
    'catalina': 'Catalina Oportunista',
    'mentor': 'Dr. Mentor',  
    'ana': 'Ana Auditora',
    'carlos': 'Carlos CEO'
};