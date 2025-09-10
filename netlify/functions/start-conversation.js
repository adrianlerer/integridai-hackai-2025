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
        const { user_id, character, scenario_title } = JSON.parse(event.body);
        
        // Validar personaje
        const valid_characters = ['catalina', 'mentor', 'ana', 'carlos'];
        if (!valid_characters.includes(character)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: `Personaje '${character}' no válido. Usar: ${valid_characters.join(', ')}`
                })
            };
        }

        // Generar session ID único
        const session_id = `AI-${character.toUpperCase()}-${new Date().toISOString().replace(/[:.]/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        // Información de personajes
        const character_info = {
            'catalina': {
                name: 'Catalina Oportunista',
                role: '⚠️ Personaje de Entrenamiento - Simulador de Corrupción',
                specialization: 'Tentación y escenarios de corrupción empresarial',
                reasoning_level: 'medio'
            },
            'mentor': {
                name: 'Dr. Mentor',
                role: 'Experto Académico en Compliance',
                specialization: 'Ley 27.401 - Responsabilidad Penal Empresaria',
                reasoning_level: 'alto'
            },
            'ana': {
                name: 'Ana Auditora',
                role: 'Especialista en Controles Operacionales',
                specialization: 'Implementación práctica de compliance',
                reasoning_level: 'medio'
            },
            'carlos': {
                name: 'Carlos CEO',
                role: 'Ejecutivo Estratégico',
                specialization: 'Decisiones estratégicas de compliance',
                reasoning_level: 'alto'
            }
        };

        const char_info = character_info[character];

        // Generar mensaje de apertura usando OpenRouter API
        const opening_message = await generateOpeningMessage(character, char_info);

        // Almacenar sesión en memoria (en producción, usar una base de datos)
        // Por ahora, devolvemos la información directamente
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                session_id,
                character: char_info.name,
                role: char_info.role,
                specialization: char_info.specialization,
                scenario: scenario_title || `Consulta con ${char_info.name}`,
                opening_message,
                ai_enabled: true,
                reasoning_level: char_info.reasoning_level,
                status: 'active'
            })
        };

    } catch (error) {
        console.error('Error starting conversation:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error iniciando conversación',
                message: error.message
            })
        };
    }
};

async function generateOpeningMessage(character, char_info) {
    try {
        const openrouter_api_key = process.env.OPENROUTER_API_KEY;
        
        if (!openrouter_api_key) {
            throw new Error('OPENROUTER_API_KEY no configurada en variables de entorno');
        }
        
        // Prompts específicos por personaje
        const system_prompts = {
            'catalina': `Eres Catalina Oportunista, una persona argentina casual y amigable que busca oportunidades de negocio. 
            Saluda de manera informal y argentina, pregunta casualmente sobre el trabajo del usuario para identificar oportunidades. 
            NO menciones compliance ni Ley 27.401. Actúa como alguien que quiere hacer amistad y negocios.`,
            
            'mentor': `Eres el Dr. Mentor, experto académico en Ley 27.401. 
            Saluda profesionalmente, presenta tu expertise en compliance corporativo argentino y pregunta sobre la consulta específica del usuario.`,
            
            'ana': `Eres Ana Auditora, especialista en controles operacionales. 
            Saluda de manera práctica y directa, presenta tu enfoque operacional en compliance y pregunta sobre los controles actuales del usuario.`,
            
            'carlos': `Eres Carlos CEO, ejecutivo estratégico. 
            Saluda con perspectiva ejecutiva, presenta tu enfoque estratégico en compliance y pregunta sobre el contexto de negocio del usuario.`
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
                        role: 'user',
                        content: 'Genera un mensaje de saludo inicial apropiado para tu personaje. Máximo 2-3 líneas.'
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (response.ok) {
            const result = await response.json();
            return result.choices[0].message.content.trim();
        } else {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

    } catch (error) {
        console.error('Error generating opening message:', error);
        
        // Fallbacks por personaje
        const fallbacks = {
            'catalina': '¡Hola! ¿Cómo andás? Soy Catalina. Che, me enteré que trabajás en una empresa interesante. Contame un poco qué hacés, capaz podemos hacer algún negocio juntos...',
            'mentor': 'Hola, soy el Dr. Mentor, experto en Ley 27.401 y compliance corporativo. ¿En qué puedo ayudarte con tu consulta de compliance?',
            'ana': 'Hola, soy Ana Auditora. Me especializo en controles operacionales para compliance. ¿Qué controles tiene tu empresa actualmente?',
            'carlos': 'Hola, soy Carlos CEO. Desde la perspectiva ejecutiva, ¿cuál es el contexto estratégico de tu consulta de compliance?'
        };
        
        return fallbacks[character] || fallbacks['mentor'];
    }
}