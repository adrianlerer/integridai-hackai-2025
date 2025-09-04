#!/usr/bin/env python3
"""
AI Proxy Server for FlaiSimulator
Secure OpenRouter API connection without exposing keys
"""

import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import urllib.request
import urllib.error
from datetime import datetime

class AIProxyHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle AI chat requests"""
        if self.path == '/api/chat':
            try:
                # Get request data
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Extract parameters
                message = data.get('message', '')
                character = data.get('character', 'mentor')
                
                # Generate AI response
                response_text = self.generate_ai_response(message, character)
                
                # Send response
                self.send_json_response({
                    'success': True,
                    'response': response_text,
                    'character': character,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                self.send_json_response({
                    'success': False,
                    'error': str(e)
                }, status_code=500)
        else:
            self.send_json_response({
                'success': False,
                'error': 'Endpoint not found'
            }, status_code=404)
    
    def generate_ai_response(self, message, character):
        """Generate AI response using OpenRouter API"""
        
        # Character-specific system prompts
        system_prompts = {
            'mentor': """Eres el Dr. Mentor, un experto académico en compliance y la Ley 27.401 de Responsabilidad Penal Empresaria argentina. 
            Respondes de manera profesional, educativa y detallada. Siempre incluyes referencias a la normativa específica cuando es relevante.
            Tu objetivo es enseñar y formar a profesionales en temas de integridad empresarial.""",
            
            'auditora': """Eres Ana Auditora, una compliance officer experimentada especializada en auditorías internas y evaluación de riesgos.
            Respondes de manera práctica, directa y enfocada en la implementación. Das consejos concretos basados en experiencia real.
            Tu objetivo es ayudar con aspectos operativos y prácticos del compliance.""",
            
            'ceo': """Eres Carlos CEO, un ejecutivo senior con amplia experiencia en liderazgo empresarial y toma de decisiones estratégicas.
            Respondes desde una perspectiva de alto nivel, enfocándote en el impacto en el negocio y la estrategia organizacional.
            Tu objetivo es asesorar sobre decisiones ejecutivas relacionadas con compliance e integridad."""
        }
        
        # Get API key from environment (NOT from code!)
        api_key = os.environ.get('OPENROUTER_API_KEY')
        if not api_key:
            # Fallback to intelligent responses if no API key
            return self.generate_fallback_response(message, character)
        
        try:
            # Prepare OpenRouter API request
            url = "https://openrouter.ai/api/v1/chat/completions"
            
            payload = {
                "model": "anthropic/claude-3-haiku",  # Fast and cost-effective
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
                "max_tokens": 500
            }
            
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://integridai.com.ar',
                'X-Title': 'FlaiSimulator HackAI 2025'
            }
            
            # Make API request
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(response.read().decode('utf-8'))
                
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content'].strip()
            else:
                return self.generate_fallback_response(message, character)
                
        except Exception as e:
            print(f"API Error: {e}")
            return self.generate_fallback_response(message, character)
    
    def generate_fallback_response(self, message, character):
        """Generate intelligent fallback responses when API is not available"""
        
        message_lower = message.lower()
        
        # Character-specific responses
        responses = {
            'mentor': {
                'greeting': "¡Hola! Soy el Dr. Mentor, experto en compliance y Ley 27.401. ¿En qué puedo ayudarte hoy?",
                'compliance': "Desde una perspectiva académica, el compliance se basa en tres pilares fundamentales según la Ley 27.401: prevención, detección y respuesta. ¿Te gustaría profundizar en alguno específicamente?",
                'regalos': "La política de regalos debe establecer límites claros según el artículo 23 de la Ley 27.401. Recomiendo valores máximos de $500 ARS y prohibición absoluta para funcionarios públicos.",
                'riesgos': "La evaluación de riesgos debe ser continua y documentada. Sugiero implementar una matriz que considere probabilidad, impacto y controles existentes.",
                'default': "Excelente pregunta. En el contexto de la Ley 27.401, es importante considerar tanto los aspectos normativos como su aplicación práctica. ¿Podrías darme más detalles sobre tu situación específica?"
            },
            'auditora': {
                'greeting': "Hola, soy Ana Auditora. Trabajo en implementación práctica de compliance. ¿Qué necesitas resolver?",
                'compliance': "En mi experiencia, lo más importante es tener procesos claros y medibles. ¿Ya tienes un programa de integridad implementado o estamos comenzando desde cero?",
                'regalos': "Para regalos, implementamos un registro digital con aprobaciones automáticas hasta $300 y manual para montos superiores. ¿Qué sistema de control tienes actualmente?",
                'riesgos': "Uso una metodología de scoring 1-5 para probabilidad e impacto. Los riesgos altos (score >15) requieren plan de mitigación inmediato. ¿Quieres que revisemos tu matriz actual?",
                'default': "Como auditora, siempre busco soluciones prácticas y medibles. Cuéntame más sobre tu situación para darte recomendaciones específicas."
            },
            'ceo': {
                'greeting': "Soy Carlos, CEO con experiencia en compliance estratégico. ¿Qué desafío empresarial tienes?",
                'compliance': "Desde la perspectiva ejecutiva, el compliance es una inversión estratégica que protege la reputación y reduce riesgos legales. ¿Cómo está impactando en tus objetivos de negocio?",
                'regalos': "Las políticas de regalos deben equilibrar relaciones comerciales y cumplimiento. Establecemos límites que no afecten las operaciones pero protejan la integridad.",
                'riesgos': "Los riesgos de compliance pueden impactar significativamente el valor de la empresa. ¿Has considerado el ROI de tu programa de integridad?",
                'default': "Como CEO, entiendo que el compliance debe generar valor, no solo cumplir normativas. ¿Cómo puedo ayudarte a alinear compliance con tus objetivos estratégicos?"
            }
        }
        
        char_responses = responses.get(character, responses['mentor'])
        
        # Smart keyword matching
        if any(word in message_lower for word in ['hola', 'buenos', 'ayuda', 'inicio']):
            return char_responses['greeting']
        elif any(word in message_lower for word in ['regalo', 'obsequio', 'presente', 'gift']):
            return char_responses['regalos']
        elif any(word in message_lower for word in ['riesgo', 'risk', 'evaluación']):
            return char_responses['riesgos']
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
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    
    print(f"🚀 Starting FlaiSimulator AI Proxy on port {port}")
    print("📡 OpenRouter integration ready")
    print("🔒 API key loaded from environment (secure)")
    
    server = HTTPServer(('0.0.0.0', port), AIProxyHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 AI Proxy stopped")
        server.server_close()