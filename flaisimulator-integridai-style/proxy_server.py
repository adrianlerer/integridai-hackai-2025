#!/usr/bin/env python3
"""
Proxy Server for FlaiSimulator
Serves static files and proxies AI requests
"""

import json
import os
import sys
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import urllib.error
from datetime import datetime
import threading

class FlaiSimulatorProxyHandler(SimpleHTTPRequestHandler):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='/home/user/integridai-hackai-2025/flaisimulator-integridai-style', **kwargs)

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST requests - proxy AI requests"""
        if self.path == '/api/chat':
            try:
                # Get request data
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Generate AI response directly (no external proxy needed)
                response_text = self.generate_ai_response(data.get('message', ''), data.get('character', 'mentor'))
                
                # Send response
                self.send_json_response({
                    'success': True,
                    'response': response_text,
                    'character': data.get('character', 'mentor'),
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"AI Error: {e}")
                self.send_json_response({
                    'success': False,
                    'error': str(e)
                }, status_code=500)
        else:
            # Not an API request, handle as normal file request
            super().do_POST()

    def do_GET(self):
        """Handle GET requests - serve files normally"""
        return super().do_GET()

    def generate_ai_response(self, message, character):
        """Generate AI response using OpenRouter API or intelligent fallback"""
        
        # Character-specific system prompts
        system_prompts = {
            'mentor': """Eres el Dr. Mentor, un experto académico en compliance y la Ley 27.401 de Responsabilidad Penal Empresaria argentina. 
            Respondes de manera profesional, educativa y detallada. Siempre incluyes referencias a la normativa específica cuando es relevante.
            Tu objetivo es enseñar y formar a profesionales en temas de integridad empresarial. Responde en español.""",
            
            'auditora': """Eres Ana Auditora, una compliance officer experimentada especializada en auditorías internas y evaluación de riesgos.
            Respondes de manera práctica, directa y enfocada en la implementación. Das consejos concretos basados en experiencia real.
            Tu objetivo es ayudar con aspectos operativos y prácticos del compliance. Responde en español.""",
            
            'ceo': """Eres Carlos CEO, un ejecutivo senior con amplia experiencia en liderazgo empresarial y toma de decisiones estratégicas.
            Respondes desde una perspectiva de alto nivel, enfocándote en el impacto en el negocio y la estrategia organizacional.
            Tu objetivo es asesorar sobre decisiones ejecutivas relacionadas con compliance e integridad. Responde en español."""
        }
        
        # Get API key from environment (secure)
        api_key = os.environ.get('OPENROUTER_API_KEY')
        if api_key and len(api_key) > 10:  # Basic validation
            try:
                return self.call_openrouter_api(message, character, system_prompts, api_key)
            except Exception as e:
                print(f"OpenRouter API failed: {e}")
        
        # Fallback to intelligent responses
        return self.generate_fallback_response(message, character)
    
    def call_openrouter_api(self, message, character, system_prompts, api_key):
        """Call OpenRouter API"""
        url = "https://openrouter.ai/api/v1/chat/completions"
        
        payload = {
            "model": "anthropic/claude-3-haiku",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompts.get(character, system_prompts['mentor'])
                },
                {
                    "role": "user", 
                    "content": message
                }
            ],
            "temperature": 0.7,
            "max_tokens": 400
        }
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://integridai.com.ar',
            'X-Title': 'FlaiSimulator HackAI 2025'
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content'].strip()
        else:
            raise Exception("No response from OpenRouter")

    def generate_fallback_response(self, message, character):
        """Generate intelligent fallback responses"""
        
        message_lower = message.lower()
        
        responses = {
            'mentor': {
                'greeting': "¡Hola! Soy el Dr. Mentor, experto académico en compliance y Ley 27.401. Mi rol es ayudarte a comprender los fundamentos teóricos y normativos. ¿En qué aspecto específico del compliance te gustaría profundizar?",
                'regalos': "En cuanto a la política de regalos, la Ley 27.401 en su artículo 23 establece que los programas de integridad deben incluir reglas claras de prevención. Para regalos recomiendo: límite máximo de $1000 ARS, registro obligatorio, prohibición absoluta con funcionarios públicos, y aprobación previa del supervisor para montos superiores a $500.",
                'riesgos': "La evaluación de riesgos debe ser sistemática y continua. Según las mejores prácticas internacionales, sugiero implementar una matriz que considere: probabilidad de ocurrencia (1-5), impacto potencial (1-5), controles existentes, y nivel de riesgo residual. Los riesgos altos requieren planes de mitigación específicos.",
                'compliance': "Desde la perspectiva académica, un programa de compliance efectivo según la Ley 27.401 debe incluir: 1) Designación de responsable, 2) Código de ética, 3) Reglas de prevención, 4) Capacitación periódica, 5) Canales de denuncia, 6) Sistema disciplinario, 7) Monitoreo y evaluación.",
                'ley27401': "La Ley 27.401 de Responsabilidad Penal Empresaria establece un régimen de responsabilidad penal para personas jurídicas por delitos de corrupción. Los elementos clave son: responsabilidad objetiva, programas de integridad como atenuante, sanciones económicas y inhabilitación, y la importancia de la implementación efectiva vs formal.",
                'default': "Excelente pregunta sobre compliance. Como académico, siempre enfatizo la importancia de entender tanto la teoría como la aplicación práctica de las normas. ¿Podrías contarme más sobre tu situación específica para poder darte una orientación más precisa?"
            },
            'auditora': {
                'greeting': "Hola, soy Ana Auditora. Trabajo en la implementación práctica de programas de compliance y auditorías internas. Mi enfoque es siempre operativo y basado en resultados medibles. ¿Qué desafío práctico necesitas resolver?",
                'regalos': "Para el control de regalos, en mi experiencia implementamos un sistema digital con estas reglas: registro automático con foto del regalo, aprobación automática hasta $300 ARS, aprobación manual del supervisor entre $301-800, prohibido >$800, reporte trimestral al comité de ética. ¿Qué sistema de control tienes actualmente?",
                'riesgos': "Como auditora, uso una metodología práctica: scoring 1-5 para probabilidad e impacto, riesgos críticos (>20) requieren acción inmediata, altos (15-19) plan en 30 días, medios (10-14) revisión trimestral. Siempre documento evidencias y seguimiento. ¿Quieres que revisemos tu matriz de riesgos actual?",
                'compliance': "En auditoría, evalúo efectividad del programa midiendo: % de empleados capacitados, tiempo de respuesta a denuncias, número de controles implementados vs planificados, incidentes detectados vs reportados externamente. Los programas efectivos muestran tendencias de mejora continua.",
                'auditoria': "Mi proceso de auditoría incluye: 1) Revisión documental del programa, 2) Entrevistas con responsables, 3) Testing de controles clave, 4) Revisión de casos reportados, 5) Evaluación de cultura ética, 6) Recomendaciones priorizadas por riesgo e impacto.",
                'default': "Como auditora, siempre busco soluciones prácticas y medibles. Mi experiencia dice que los mejores programas de compliance son los que se implementan de manera gradual pero consistente. Cuéntame más detalles sobre tu situación para darte recomendaciones específicas."
            },
            'ceo': {
                'greeting': "Soy Carlos, CEO con amplia experiencia en liderazgo empresarial y gestión estratégica de compliance. Entiendo que el compliance debe generar valor para el negocio, no solo cumplir regulaciones. ¿Qué desafío estratégico estás enfrentando?",
                'regalos': "Desde la perspectiva ejecutiva, las políticas de regalos deben equilibrar las relaciones comerciales con el cumplimiento normativo. Implementamos límites que permitan mantener vínculos profesionales sin comprometer la integridad. También consideramos el impacto cultural y la percepción de stakeholders.",
                'riesgos': "Los riesgos de compliance pueden impactar significativamente el valor de la empresa y la confianza de inversores. Como CEO, siempre evalúo el ROI del programa de integridad: costo de implementación vs potencial ahorro en sanciones, reputación y oportunidades de negocio. ¿Has calculado este impacto?",
                'compliance': "El compliance es una inversión estratégica que protege la reputación, reduce riesgos legales y puede abrir nuevas oportunidades de mercado. Los stakeholders valoran cada vez más las empresas con sólidos programas de integridad. ¿Cómo está alineado tu programa con la estrategia de negocio?",
                'estrategia': "La integración del compliance en la estrategia empresarial requiere: 1) Tone at the top claro, 2) KPIs de compliance en scorecards ejecutivos, 3) Consideración de riesgos éticos en decisiones estratégicas, 4) Comunicación regular con el board, 5) Inversión adecuada en recursos y tecnología.",
                'default': "Como CEO, entiendo que el compliance efectivo debe crear valor para la organización, no solo evitar problemas. Los mejores programas son los que se integran naturalmente en la operación diaria y apoyan los objetivos de negocio. ¿Cómo puedo ayudarte a alinear compliance con tus objetivos estratégicos?"
            }
        }
        
        char_responses = responses.get(character, responses['mentor'])
        
        # Enhanced keyword matching
        if any(word in message_lower for word in ['hola', 'buenos', 'ayuda', 'inicio', 'quien', 'eres']):
            return char_responses['greeting']
        elif any(word in message_lower for word in ['regalo', 'obsequio', 'presente', 'gift', 'dádiva']):
            return char_responses['regalos']  
        elif any(word in message_lower for word in ['riesgo', 'risk', 'evaluación', 'matriz', 'impacto']):
            return char_responses['riesgos']
        elif any(word in message_lower for word in ['27401', 'ley', 'normativ', 'legal', 'penal']):
            return char_responses.get('ley27401', char_responses['compliance'])
        elif any(word in message_lower for word in ['auditor', 'control', 'revision', 'verificar']):
            return char_responses.get('auditoria', char_responses['default'])
        elif any(word in message_lower for word in ['estrateg', 'negocio', 'roi', 'valor', 'costo']):
            return char_responses.get('estrategia', char_responses['default'])
        elif any(word in message_lower for word in ['compliance', 'cumplimiento', 'programa', 'integridad']):
            return char_responses['compliance']
        else:
            return char_responses['default']

    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def log_message(self, format, *args):
        """Custom logging"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {format % args}")

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3013
    
    print(f"🚀 Starting FlaiSimulator with AI Integration on port {port}")
    print("🤖 OpenRouter API integration ready")
    print("💬 3 AI Characters: Dr. Mentor, Ana Auditora, Carlos CEO")
    
    server = HTTPServer(('0.0.0.0', port), FlaiSimulatorProxyHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 FlaiSimulator stopped")
        server.server_close()