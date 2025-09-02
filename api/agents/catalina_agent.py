#!/usr/bin/env python3
"""
🎭 Catalina Agent - Conversational Ethics Expert
OpenRouter-powered agent for IntegridAI HackAI 2025

Características:
- IA conversacional especializada en ética corporativa
- Powered by OpenRouter (con límites para hackathon)
- Respuestas contextuales basadas en Ley 27.401
- Personality optimizada para training empresarial
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class ConversationRequest:
    """Request structure for Catalina interactions"""
    session_id: str
    user_message: str
    context: Dict[str, Any]
    user_profile: str = "estudiante_hackathon"

@dataclass 
class ConversationResponse:
    """Response structure from Catalina"""
    message: str
    confidence: float
    suggestions: List[str]
    ethical_analysis: Dict[str, Any]
    session_id: str

class CatalinaAgent:
    """
    🎭 Catalina - Experta en Conversación Ética
    
    Especializada en:
    - Dilemas éticos empresariales
    - Capacitación conversacional
    - Aplicación práctica de Ley 27.401
    - Scenarios de integridad corporativa
    """
    
    def __init__(self, demo_mode: bool = True):
        self.demo_mode = demo_mode
        self.model = "openai/gpt-4-turbo-preview"  # Via OpenRouter BYOK
        
        # Initialize OpenRouter client
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": "https://github.com/adrianlerer/integridai-hackai-2025",
                "X-Title": "IntegridAI-HackAI-Catalina"
            }
        )
        
        # Ethical framework for responses
        self.ethical_principles = [
            "Transparencia y honestidad",
            "Integridad en decisiones",
            "Responsabilidad social corporativa", 
            "Cumplimiento normativo",
            "Ética en relaciones comerciales"
        ]
        
    def _build_system_prompt(self, user_profile: str) -> str:
        """Build contextualized system prompt for Catalina"""
        
        base_prompt = f"""
Eres Catalina, experta en ética corporativa y compliance de IntegridAI.

CONTEXTO DEL HACKATHON:
- Participante: {user_profile}
- Evento: HackAI 2025 Universidad Austral
- Objetivo: Aprendizaje práctico de compliance empresarial

TU PERSONALIDAD:
- Conversacional y empática
- Experta en Ley 27.401 (Responsabilidad Penal Empresaria)
- Enfoque práctico y educativo
- Inspiradora para promover decisiones éticas

METODOLOGÍA DE RESPUESTA:
1. Escucha activa del dilema planteado
2. Análisis ético desde múltiples perspectivas
3. Aplicación práctica de marcos normativos
4. Sugerencias concretas y aplicables
5. Preguntas que profundicen la reflexión

MARCOS DE REFERENCIA:
- Ley 27.401 (Argentina)
- Código de Ética empresarial
- Best practices internacionales
- Casos reales del compliance argentino

TONO:
- Profesional pero accesible
- Educativo y constructivo
- Inspirador hacia la integridad
- Adaptado al contexto de aprendizaje
"""
        
        return base_prompt

    async def process_conversation(self, request: ConversationRequest) -> ConversationResponse:
        """
        Process ethical conversation with context-aware analysis
        """
        try:
            # Build contextualized system prompt
            system_prompt = self._build_system_prompt(request.user_profile)
            
            # Prepare conversation messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": self._contextualize_message(request)}
            ]
            
            # Get AI response via OpenRouter
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=800 if self.demo_mode else 1200,
                temperature=0.7,
                top_p=0.9
            )
            
            ai_message = response.choices[0].message.content
            
            # Generate ethical analysis
            ethical_analysis = await self._analyze_ethical_dimensions(request.user_message)
            
            # Generate follow-up suggestions
            suggestions = self._generate_suggestions(request.user_message, ai_message)
            
            return ConversationResponse(
                message=ai_message,
                confidence=0.85,  # High confidence in demo mode
                suggestions=suggestions,
                ethical_analysis=ethical_analysis,
                session_id=request.session_id
            )
            
        except Exception as e:
            # Fallback for demo stability
            return self._create_fallback_response(request, str(e))
    
    def _contextualize_message(self, request: ConversationRequest) -> str:
        """Add context to user message for better AI understanding"""
        
        context_info = []
        
        # Add session context if available
        if request.context.get("scenario"):
            context_info.append(f"Escenario actual: {request.context['scenario']}")
        
        # Add user profile context
        context_info.append(f"Perfil del participante: {request.user_profile}")
        
        # Add hackathon context
        context_info.append("Contexto: HackAI 2025 - Aprendizaje práctico de compliance")
        
        context_str = " | ".join(context_info)
        
        return f"""
CONTEXTO: {context_str}

CONSULTA DEL PARTICIPANTE:
{request.user_message}

Por favor, responde desde tu experiencia como experta en ética corporativa, 
considerando que esto es un entorno de aprendizaje seguro donde el participante 
puede explorar diferentes perspectivas éticas sin consecuencias reales.
"""

    async def _analyze_ethical_dimensions(self, user_message: str) -> Dict[str, Any]:
        """Analyze ethical dimensions of the query"""
        
        # Quick ethical assessment (simplified for demo)
        dimensions = {
            "transparency_needed": "transparencia" in user_message.lower() or "honesto" in user_message.lower(),
            "stakeholder_impact": "empleado" in user_message.lower() or "cliente" in user_message.lower(),
            "legal_implications": "ley" in user_message.lower() or "legal" in user_message.lower(),
            "corporate_risk": "riesgo" in user_message.lower() or "problema" in user_message.lower(),
            "ethical_complexity": "dilema" in user_message.lower() or "conflicto" in user_message.lower()
        }
        
        return {
            "dimensions_identified": dimensions,
            "complexity_level": "alto" if sum(dimensions.values()) > 2 else "medio",
            "requires_escalation": dimensions.get("legal_implications", False),
            "learning_opportunity": True
        }
    
    def _generate_suggestions(self, user_message: str, ai_response: str) -> List[str]:
        """Generate contextual follow-up suggestions"""
        
        base_suggestions = [
            "¿Qué otros stakeholders deberíamos considerar?",
            "¿Cómo aplicarías esto en tu futura empresa?",
            "¿Qué marcos normativos son relevantes aquí?"
        ]
        
        # Context-aware suggestions
        if "conflicto" in user_message.lower():
            base_suggestions.append("¿Qué proceso de escalación usarías?")
        
        if "proveedor" in user_message.lower():
            base_suggestions.append("¿Cómo evaluarías el riesgo de este proveedor?")
            
        if "regalo" in user_message.lower() or "obsequio" in user_message.lower():
            base_suggestions.append("¿Cuál sería una política clara para obsequios?")
        
        return base_suggestions[:3]  # Limit to 3 suggestions
    
    def _create_fallback_response(self, request: ConversationRequest, error: str) -> ConversationResponse:
        """Create fallback response if API fails"""
        
        fallback_message = f"""
Hola! Soy Catalina, tu experta en ética corporativa para el HackAI 2025.

Aunque estoy experimentando algunas dificultades técnicas en este momento, 
puedo ayudarte con tu consulta sobre ética empresarial.

Tu pregunta sobre "{request.user_message[:100]}..." es muy relevante para 
el compliance empresarial. En situaciones como esta, siempre recomiendo:

1. **Transparencia**: Documentar el dilema y las opciones consideradas
2. **Consulta**: Buscar guidance del área de compliance o legal
3. **Principios**: Aplicar el código de ética corporativo
4. **Impacto**: Evaluar consecuencias para todos los stakeholders

¿Te gustaría que exploremos algún aspecto específico de tu situación?

*Nota: Estoy en modo demo durante el hackathon, pero mi lógica ética se mantiene sólida.*
"""
        
        return ConversationResponse(
            message=fallback_message,
            confidence=0.7,
            suggestions=[
                "¿Cuáles son los stakeholders afectados?",
                "¿Qué dice el código de ética sobre esto?",
                "¿Hay precedentes similares en la empresa?"
            ],
            ethical_analysis={
                "dimensions_identified": {"fallback_mode": True},
                "complexity_level": "medio",
                "requires_escalation": False,
                "learning_opportunity": True
            },
            session_id=request.session_id
        )

# Global instance for easy import
catalina_agent = CatalinaAgent(demo_mode=True)

# Demo/test function
async def test_catalina():
    """Test function for development"""
    
    test_request = ConversationRequest(
        session_id="test_session_001",
        user_message="Un proveedor me ofreció un regalo costoso para agilizar un contrato. ¿Qué debería hacer?",
        context={"scenario": "conflicto_intereses"},
        user_profile="estudiante_ingenieria"
    )
    
    response = await catalina_agent.process_conversation(test_request)
    
    print("🎭 CATALINA RESPONSE:")
    print(f"Message: {response.message}")
    print(f"Confidence: {response.confidence}")
    print(f"Suggestions: {response.suggestions}")
    print(f"Analysis: {response.ethical_analysis}")

if __name__ == "__main__":
    print("""
    🎭 Catalina Agent - IntegridAI HackAI 2025
    
    ✅ OpenRouter-powered conversational AI
    ✅ Ética corporativa y compliance expertise  
    ✅ Optimizada para aprendizaje interactivo
    ✅ Demo mode para hackathon
    
    Testing agent...
    """)
    
    asyncio.run(test_catalina())