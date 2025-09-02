#!/usr/bin/env python3
"""
🤖 Unified Agents API - IntegridAI HackAI 2025
API unificada que integra Catalina + Alexis + Routing inteligente

Características:
- Routing automático entre Catalina (conversacional) y Alexis (analítico)
- OpenRouter-powered con modelos cost-optimized para hackathon
- Fallback a responses mock si OpenRouter falla
- Rate limiting para demo sustentable
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Import agents
from agents.catalina_agent import catalina_agent, ConversationRequest
from agents.alexis_agent import alexis_agent, AnalysisRequest

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Rate limiting storage (simple in-memory for demo)
request_history = {}
RATE_LIMIT = 10  # requests per hour per IP in demo mode

@dataclass
class UnifiedRequest:
    """Unified request structure for agent routing"""
    session_id: str
    message: str
    context: Dict[str, Any]
    user_profile: str = "estudiante_hackathon"
    
@dataclass 
class UnifiedResponse:
    """Unified response structure"""
    response: str
    agent_used: str  # 'catalina', 'alexis', 'hybrid'
    confidence: float
    suggestions: List[str]
    metadata: Dict[str, Any]
    session_id: str
    demo_mode: bool = True

class AgentRouter:
    """Smart routing between Catalina and Alexis"""
    
    def __init__(self):
        self.conversational_keywords = [
            'hola', 'ayuda', 'explica', 'cómo', 'qué', 'necesito', 'ayúdame',
            'dilema', 'situación', 'problema', 'consejo', 'opinión', 'conflicto',
            'ético', 'debería', 'correcto', 'incorrecto', 'moral'
        ]
        
        self.analytical_keywords = [
            'analiza', 'reporta', 'evalúa', 'implementa', 'compliance', 'normativa',
            'regulación', 'legal', 'ley', 'artículo', 'decreto', 'riesgo',
            'auditoria', 'control', 'procedimiento', 'política', 'programa'
        ]
    
    def route_request(self, message: str, context: Dict[str, Any]) -> str:
        """Determine which agent should handle the request"""
        
        message_lower = message.lower()
        
        # Count keyword matches
        conv_score = sum(1 for kw in self.conversational_keywords if kw in message_lower)
        anal_score = sum(1 for kw in self.analytical_keywords if kw in message_lower)
        
        # Context-based routing
        if context.get('force_agent'):
            return context['force_agent']
        
        # Length-based heuristic
        if len(message.split()) < 10 and conv_score > 0:
            return 'catalina'  # Short conversational queries
        
        # Analytical indicators
        if any(indicator in message_lower for indicator in ['implementar', 'programa', 'análisis', 'reporte']):
            return 'alexis'
        
        # Default routing logic
        if anal_score > conv_score:
            return 'alexis'
        elif conv_score > anal_score:
            return 'catalina' 
        else:
            # Hybrid approach for complex queries
            return 'hybrid' if len(message.split()) > 20 else 'catalina'

router = AgentRouter()

def check_rate_limit(ip_address: str) -> bool:
    """Check if IP has exceeded rate limit"""
    now = datetime.now()
    hour_ago = now - timedelta(hours=1)
    
    if ip_address not in request_history:
        request_history[ip_address] = []
    
    # Clean old requests
    request_history[ip_address] = [
        req_time for req_time in request_history[ip_address] 
        if req_time > hour_ago
    ]
    
    # Check limit
    if len(request_history[ip_address]) >= RATE_LIMIT:
        return False
    
    # Add current request
    request_history[ip_address].append(now)
    return True

def create_fallback_response(message: str, session_id: str, error: str = "") -> UnifiedResponse:
    """Create fallback response when agents fail"""
    
    fallback_msg = f"""
🤖 **IntegridAI Demo Response**

Tu consulta sobre "{message[:100]}..." es muy relevante para compliance empresarial.

**Análisis Rápido:**
- **Marco aplicable**: Ley 27.401 y mejores prácticas
- **Consideración clave**: Siempre priorizar transparencia e integridad
- **Próximo paso**: Consultar políticas internas y área legal/compliance

**Recomendaciones:**
1. Documentar la situación y opciones consideradas
2. Buscar guidance del área de compliance
3. Aplicar principios éticos corporativos
4. Evaluar impacto en todos los stakeholders

*Nota: Respuesta en modo demo para HackAI 2025. Para casos reales, consultar expertos en compliance.*
"""
    
    return UnifiedResponse(
        response=fallback_msg,
        agent_used="fallback",
        confidence=0.7,
        suggestions=[
            "¿Qué dice el código de ética sobre esto?",
            "¿Cómo afecta a los stakeholders?", 
            "¿Hay precedentes en la empresa?"
        ],
        metadata={
            "fallback_reason": error or "API temporarily unavailable",
            "demo_mode": True,
            "hackathon_response": True
        },
        session_id=session_id,
        demo_mode=True
    )

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "IntegridAI Unified Agents API",
        "agents": {
            "catalina": "Conversational Ethics Expert",
            "alexis": "Analytical Compliance Expert",
            "router": "Smart Agent Routing"
        },
        "version": "1.0.0-hackathon",
        "demo_mode": True,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/chat', methods=['POST'])
async def unified_chat():
    """Unified chat endpoint with smart agent routing"""
    
    try:
        # Rate limiting check
        client_ip = request.environ.get('REMOTE_ADDR', 'unknown')
        if not check_rate_limit(client_ip):
            return jsonify({
                "error": "Rate limit exceeded. Demo allows 10 requests per hour.",
                "demo_info": "Esta es una limitación del modo demo para el hackathon"
            }), 429
        
        # Parse request
        data = request.get_json() or {}
        message = data.get('message', '')
        session_id = data.get('session_id', f"session_{datetime.now().timestamp()}")
        context = data.get('context', {})
        user_profile = data.get('user_profile', 'estudiante_hackathon')
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Route to appropriate agent
        selected_agent = router.route_request(message, context)
        logger.info(f"Routing to agent: {selected_agent}")
        
        try:
            if selected_agent == 'catalina':
                # Route to Catalina (conversational)
                conv_request = ConversationRequest(
                    session_id=session_id,
                    user_message=message,
                    context=context,
                    user_profile=user_profile
                )
                
                agent_response = await catalina_agent.process_conversation(conv_request)
                
                response = UnifiedResponse(
                    response=agent_response.message,
                    agent_used="catalina",
                    confidence=agent_response.confidence,
                    suggestions=agent_response.suggestions,
                    metadata={
                        "ethical_analysis": agent_response.ethical_analysis,
                        "agent_type": "conversational"
                    },
                    session_id=session_id
                )
                
            elif selected_agent == 'alexis':
                # Route to Alexis (analytical) 
                analysis_request = AnalysisRequest(
                    session_id=session_id,
                    query=message,
                    context=context,
                    analysis_type="compliance"
                )
                
                agent_response = await alexis_agent.process_analysis(analysis_request)
                
                response = UnifiedResponse(
                    response=agent_response.analysis,
                    agent_used="alexis", 
                    confidence=agent_response.confidence,
                    suggestions=agent_response.recommendations,
                    metadata={
                        "key_findings": agent_response.key_findings,
                        "risk_assessment": agent_response.risk_assessment,
                        "regulatory_refs": agent_response.regulatory_references,
                        "agent_type": "analytical"
                    },
                    session_id=session_id
                )
                
            else:  # hybrid
                # For complex queries, get both perspectives
                logger.info("Processing hybrid request - using both agents")
                
                # Get analytical foundation from Alexis
                analysis_req = AnalysisRequest(
                    session_id=session_id,
                    query=message, 
                    context=context,
                    analysis_type="compliance"
                )
                alexis_response = await alexis_agent.process_analysis(analysis_req)
                
                # Enhance context for Catalina
                enhanced_context = context.copy()
                enhanced_context['analytical_input'] = {
                    'key_findings': alexis_response.key_findings,
                    'risk_level': alexis_response.risk_assessment.get('risk_level', 'Medio')
                }
                
                # Get conversational response from Catalina
                conv_req = ConversationRequest(
                    session_id=session_id,
                    user_message=f"Basándote en este análisis técnico: {alexis_response.analysis[:300]}...\n\nPregunta original: {message}",
                    context=enhanced_context,
                    user_profile=user_profile
                )
                catalina_response = await catalina_agent.process_conversation(conv_req)
                
                response = UnifiedResponse(
                    response=catalina_response.message,
                    agent_used="hybrid",
                    confidence=(alexis_response.confidence + catalina_response.confidence) / 2,
                    suggestions=catalina_response.suggestions + alexis_response.recommendations[:2],
                    metadata={
                        "analytical_foundation": {
                            "key_findings": alexis_response.key_findings,
                            "risk_assessment": alexis_response.risk_assessment
                        },
                        "conversational_enhancement": {
                            "ethical_analysis": catalina_response.ethical_analysis
                        },
                        "agent_type": "hybrid"
                    },
                    session_id=session_id
                )
            
            return jsonify(asdict(response))
            
        except Exception as agent_error:
            logger.error(f"Agent processing error: {agent_error}")
            # Fallback to mock response
            fallback = create_fallback_response(message, session_id, str(agent_error))
            return jsonify(asdict(fallback))
            
    except Exception as e:
        logger.error(f"Unified chat error: {e}")
        return jsonify({
            "error": "Internal server error",
            "demo_info": "Error en modo demo - intenta de nuevo",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/agents/status', methods=['GET'])
def agents_status():
    """Get status of all agents"""
    
    return jsonify({
        "agents": {
            "catalina": {
                "name": "Catalina - Conversational Ethics Expert",
                "model": os.getenv("CATALINA_MODEL", "openai/gpt-3.5-turbo"),
                "specialization": "Ethical dilemmas, conversational training",
                "status": "active"
            },
            "alexis": {
                "name": "Alexis - Analytical Compliance Expert", 
                "model": os.getenv("ALEXIS_MODEL", "anthropic/claude-3-haiku-20240307"),
                "specialization": "Regulatory analysis, compliance research",
                "status": "active"
            },
            "router": {
                "name": "Smart Agent Router",
                "algorithm": "Keyword-based + context-aware routing",
                "modes": ["catalina", "alexis", "hybrid"],
                "status": "active"
            }
        },
        "demo_mode": True,
        "rate_limits": {
            "requests_per_hour": RATE_LIMIT,
            "current_requests": len(request_history.get(request.environ.get('REMOTE_ADDR', 'unknown'), []))
        },
        "openrouter_status": "configured" if os.getenv("OPENROUTER_API_KEY") else "not_configured"
    })

@app.route('/api/demo/examples', methods=['GET'])
def demo_examples():
    """Get example queries for each agent type"""
    
    return jsonify({
        "examples": {
            "catalina_queries": [
                "Un proveedor me ofrece un regalo costoso, ¿qué debo hacer?",
                "Tengo un conflicto de intereses con un familiar, ¿cómo lo manejo?",
                "Mi jefe me pide algo que me parece poco ético, ¿cómo respondo?"
            ],
            "alexis_queries": [
                "Necesito implementar un programa de compliance según Ley 27.401",
                "¿Qué controles internos requiere la normativa UIF?",
                "Analiza el riesgo regulatorio de nuestra operación en construcción"
            ],
            "hybrid_queries": [
                "Cómo implementar un código de ética que sea efectivo y práctico para empleados",
                "Desarrollar un programa integral de prevención de corrupción para PyME argentina",
                "Estrategia completa de compliance para empresa que exporta a Brasil"
            ]
        },
        "usage_tips": {
            "catalina": "Usa para dilemas éticos, situaciones personales, decisiones morales",
            "alexis": "Usa para análisis técnico, normativas, implementaciones, riesgos",
            "hybrid": "Usa para consultas complejas que requieren análisis + conversación"
        }
    })

if __name__ == '__main__':
    print("""
    🤖 IntegridAI Unified Agents API - HackAI 2025
    ===============================================
    
    ✅ Catalina: Conversational Ethics Expert
    ✅ Alexis: Analytical Compliance Expert  
    ✅ Smart Router: Automatic agent selection
    ✅ Rate Limited: 10 requests/hour in demo
    
    Endpoints:
    - POST /api/chat - Unified chat with smart routing
    - GET  /api/agents/status - Agent status and config
    - GET  /api/demo/examples - Example queries
    - GET  /health - Health check
    
    Iniciando en http://localhost:5003
    """)
    
    app.run(host='0.0.0.0', port=5003, debug=True)