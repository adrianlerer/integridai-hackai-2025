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
        const { session_id } = JSON.parse(event.body);
        
        if (!session_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'session_id es requerido' })
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

        // Generar análisis final con IA
        const final_analysis = await generateFinalAnalysis(character);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                session_id,
                final_analysis,
                status: 'completed'
            })
        };

    } catch (error) {
        console.error('Error ending conversation:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error finalizando conversación',
                message: error.message
            })
        };
    }
};

async function generateFinalAnalysis(character) {
    try {
        const openrouter_api_key = process.env.OPENROUTER_API_KEY || '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';
        
        const character_info = {
            'catalina': {
                name: 'Catalina Oportunista',
                expertise: 'Simulación de escenarios de corrupción',
                analysis_prompt: `Como Catalina, genera un análisis final sobre las tentaciones ofrecidas en esta conversación:
                1. Qué oportunidades de corrupción identificaste
                2. Qué estrategias de persuasión usaste
                3. Nivel de receptividad del usuario
                4. Riesgos que el usuario debería considerar según Ley 27.401
                Mantén un tono casual pero reflexivo sobre los peligros reales de estas situaciones.`
            },
            'mentor': {
                name: 'Dr. Mentor',
                expertise: 'Análisis técnico Ley 27.401',
                analysis_prompt: `Como experto académico en Ley 27.401, genera un análisis final profesional:
                1. Resumen de temas de compliance tratados
                2. Artículos de Ley 27.401 más relevantes para el caso
                3. Nivel de riesgo identificado
                4. Recomendaciones específicas de implementación
                5. Próximos pasos técnicos sugeridos`
            },
            'ana': {
                name: 'Ana Auditora',
                expertise: 'Controles operacionales de compliance',
                analysis_prompt: `Como auditora operacional, genera un análisis final práctico:
                1. Evaluación de controles actuales vs. requerimientos
                2. Gaps operacionales identificados
                3. Controles específicos a implementar
                4. Plan de acción con timeline
                5. Checklist de compliance prioritario`
            },
            'carlos': {
                name: 'Carlos CEO',
                expertise: 'Decisiones estratégicas de compliance',
                analysis_prompt: `Como CEO estratégico, genera un análisis final ejecutivo:
                1. Impacto estratégico en el negocio
                2. Análisis costo/beneficio de implementación
                3. Riesgos reputacionales y regulatorios
                4. ROI esperado de inversiones en compliance
                5. Decisiones ejecutivas recomendadas con priorización`
            }
        };

        const char_info = character_info[character] || character_info['mentor'];

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
                        content: `Eres ${char_info.name}, especializado en ${char_info.expertise}. 
                        Genera un análisis final profesional y específico basado en tu expertise.
                        Mantén el tono y perspectiva de tu personaje.`
                    },
                    {
                        role: 'user',
                        content: char_info.analysis_prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            })
        });

        if (response.ok) {
            const result = await response.json();
            const analysis_text = result.choices[0].message.content.trim();
            
            return {
                summary: analysis_text,
                character: char_info.name,
                expertise_applied: char_info.expertise,
                recommendations: extractRecommendations(analysis_text)
            };
        } else {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

    } catch (error) {
        console.error('Error generating final analysis:', error);
        
        // Fallback analysis por personaje
        const fallback_analyses = {
            'catalina': {
                summary: `Como Catalina, en esta conversación intenté identificar oportunidades de "negocios" y generar confianza. 
                Es importante recordar que situaciones como las que propongo pueden constituir corrupción según la Ley 27.401. 
                Siempre evalúa los riesgos legales y éticos antes de aceptar favores o regalos en contextos profesionales.`,
                character: 'Catalina Oportunista',
                expertise_applied: 'Simulación de escenarios de corrupción',
                recommendations: [
                    'Establecer políticas claras sobre regalos y favores',
                    'Capacitar al personal sobre riesgos de corrupción',
                    'Implementar canales de denuncia internos'
                ]
            },
            'mentor': {
                summary: `Análisis académico basado en Ley 27.401: Es fundamental implementar un programa de compliance integral 
                que incluya controles preventivos, capacitación específica y monitoreo continuo. 
                La responsabilidad penal empresaria requiere evidencia de esfuerzos genuinos de prevención.`,
                character: 'Dr. Mentor',
                expertise_applied: 'Análisis técnico Ley 27.401',
                recommendations: [
                    'Implementar programa de compliance según Art. 22-23 Ley 27.401',
                    'Establecer canal de denuncias confidencial',
                    'Realizar auditorías periódicas de compliance'
                ]
            },
            'ana': {
                summary: `Evaluación operacional: Se requiere fortalecer los controles internos específicos para compliance. 
                Recomiendo implementar procedimientos documentados, capacitación práctica y sistemas de monitoreo 
                que cumplan con los estándares ISO 37001 y Ley 27.401.`,
                character: 'Ana Auditora',
                expertise_applied: 'Controles operacionales de compliance',
                recommendations: [
                    'Documentar procedimientos de compliance',
                    'Implementar controles de Due Diligence',
                    'Establecer métricas de seguimiento'
                ]
            },
            'carlos': {
                summary: `Perspectiva estratégica: La inversión en compliance debe verse como protección del valor corporativo 
                y ventaja competitiva. El costo de no compliance (multas, reputación, exclusiones) supera 
                significativamente la inversión en programas preventivos.`,
                character: 'Carlos CEO',
                expertise_applied: 'Decisiones estratégicas de compliance',
                recommendations: [
                    'Aprobar presupuesto para programa de compliance',
                    'Designar responsable de compliance de alto nivel',
                    'Incluir compliance en evaluación de riesgos corporativos'
                ]
            }
        };

        return fallback_analyses[character] || fallback_analyses['mentor'];
    }
}

function extractRecommendations(analysis_text) {
    const recommendations = [];
    const lines = analysis_text.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && (
            trimmed.includes('recomendar') ||
            trimmed.includes('sugerir') ||
            trimmed.includes('implementar') ||
            trimmed.includes('establecer') ||
            trimmed.startsWith('-') ||
            trimmed.startsWith('•') ||
            /^\d+\./.test(trimmed)
        )) {
            if (trimmed.length > 10) {
                recommendations.push(trimmed.replace(/^[-•\d.]\s*/, ''));
            }
        }
    }
    
    return recommendations.slice(0, 5); // Máximo 5 recomendaciones
}