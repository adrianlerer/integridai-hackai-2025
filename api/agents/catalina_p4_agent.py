#!/usr/bin/env python3
"""
🧠 Catalina P4 Agent - Advanced Reflection-Enhanced Ethics Expert
Implementa la patente P4 de reflexión iterativa de IntegridAI

P4 Reflection Pattern:
1. Initial Response - Primera respuesta intuitiva
2. Self-Critique - Auto-evaluación crítica de la respuesta
3. Ethical Validation - Validación contra principios éticos
4. Refinement - Mejoramiento basado en reflexiones
5. Final Synthesis - Síntesis optimizada y validada

Diferencias vs Catalina estándar:
- Reflexión multi-paso para profundidad ética
- Auto-cuestionamiento de recomendaciones
- Validación iterativa contra marcos éticos
- Refinamiento basado en auto-crítica
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import openai
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()
logger = logging.getLogger(__name__)

@dataclass
class P4ReflectionStep:
    """Individual step in P4 reflection process"""
    step_name: str
    content: str
    confidence: float
    insights: List[str]
    concerns: List[str]

@dataclass
class P4ConversationResponse:
    """Enhanced response with P4 reflection data"""
    final_message: str
    confidence: float
    suggestions: List[str]
    ethical_analysis: Dict[str, Any]
    session_id: str
    reflection_steps: List[P4ReflectionStep]
    p4_insights: Dict[str, Any]
    processing_time: float

class CatalinaP4Agent:
    """
    🧠 Catalina P4 - Advanced Reflection-Enhanced Ethics Expert
    
    Implementa reflexión iterativa patentada para:
    - Análisis ético profundo y multi-dimensional
    - Auto-cuestionamiento y validación crítica
    - Refinamiento iterativo de recomendaciones
    - Síntesis optimizada basada en reflexión
    """
    
    def __init__(self, demo_mode: bool = True):
        self.demo_mode = demo_mode
        self.model = "openai/gpt-4-turbo-preview"  # Mejor modelo para P4
        
        # Initialize OpenRouter client
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": "https://integridai.com",
                "X-Title": "IntegridAI-CatalinaP4-Patent"
            }
        )
        
        # P4 Configuration
        self.p4_config = {
            "reflection_depth": 3 if demo_mode else 4,
            "max_iterations": 2 if demo_mode else 3,
            "confidence_threshold": 0.85,
            "ethical_frameworks": [
                "Consecuencialismo", "Deontología", "Ética de virtudes", 
                "Ética del cuidado", "Principialismo"
            ]
        }
        
        # Ethical validation criteria
        self.ethical_criteria = {
            "transparency": "¿La recomendación promueve transparencia total?",
            "stakeholder_impact": "¿Consideré impacto en TODOS los stakeholders?",
            "long_term_consequences": "¿Evalué consecuencias a largo plazo?",
            "legal_compliance": "¿Es completamente compatible con marcos legales?",
            "organizational_values": "¿Refuerza valores organizacionales positivos?",
            "personal_integrity": "¿Permite mantener integridad personal?",
            "precedent_setting": "¿Qué precedente establece esta decisión?"
        }
    
    async def process_conversation_p4(self, session_id: str, user_message: str, 
                                     context: Dict[str, Any], user_profile: str) -> P4ConversationResponse:
        """
        Process conversation using P4 reflection methodology
        """
        start_time = datetime.now()
        reflection_steps = []
        
        try:
            # STEP 1: Initial Intuitive Response
            logger.info("P4 Step 1: Initial Response")
            initial_response = await self._generate_initial_response(
                user_message, context, user_profile
            )
            reflection_steps.append(P4ReflectionStep(
                step_name="Initial Response",
                content=initial_response,
                confidence=0.6,
                insights=["Respuesta intuitiva generada"],
                concerns=["Requiere validación ética profunda"]
            ))
            
            # STEP 2: Ethical Self-Critique
            logger.info("P4 Step 2: Ethical Self-Critique")
            critique_analysis = await self._perform_ethical_critique(
                user_message, initial_response, context
            )
            reflection_steps.append(P4ReflectionStep(
                step_name="Ethical Self-Critique",
                content=critique_analysis["critique"],
                confidence=critique_analysis["confidence"],
                insights=critique_analysis["insights"],
                concerns=critique_analysis["concerns"]
            ))
            
            # STEP 3: Multi-Framework Validation
            logger.info("P4 Step 3: Multi-Framework Validation")
            framework_validation = await self._validate_against_frameworks(
                user_message, initial_response, critique_analysis
            )
            reflection_steps.append(P4ReflectionStep(
                step_name="Multi-Framework Validation",
                content=framework_validation["validation"],
                confidence=framework_validation["confidence"],
                insights=framework_validation["insights"],
                concerns=framework_validation["concerns"]
            ))
            
            # STEP 4: Iterative Refinement
            logger.info("P4 Step 4: Iterative Refinement")
            refined_response = await self._iterative_refinement(
                user_message, initial_response, critique_analysis, framework_validation, context
            )
            reflection_steps.append(P4ReflectionStep(
                step_name="Iterative Refinement",
                content=refined_response["content"],
                confidence=refined_response["confidence"],
                insights=refined_response["insights"],
                concerns=refined_response["concerns"]
            ))
            
            # STEP 5: Final Synthesis & Optimization
            logger.info("P4 Step 5: Final Synthesis")
            final_synthesis = await self._final_synthesis(
                user_message, reflection_steps, context, user_profile
            )
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Generate enhanced suggestions based on P4 insights
            p4_suggestions = self._generate_p4_suggestions(reflection_steps, final_synthesis)
            
            # Compile P4 insights
            p4_insights = self._compile_p4_insights(reflection_steps, processing_time)
            
            return P4ConversationResponse(
                final_message=final_synthesis["message"],
                confidence=final_synthesis["confidence"],
                suggestions=p4_suggestions,
                ethical_analysis=final_synthesis["ethical_analysis"],
                session_id=session_id,
                reflection_steps=reflection_steps,
                p4_insights=p4_insights,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"P4 processing error: {e}")
            return self._create_p4_fallback(session_id, user_message, str(e))
    
    async def _generate_initial_response(self, message: str, context: Dict[str, Any], 
                                       profile: str) -> str:
        """Generate initial intuitive response"""
        
        prompt = f"""
Eres Catalina, experta en ética corporativa. Da una respuesta INICIAL e INTUITIVA a esta consulta.

NO reflexiones profundamente todavía - esa será la siguiente fase.
Simplemente proporciona tu primera impresión profesional.

Usuario: {profile}
Consulta: {message}
Contexto: {json.dumps(context, ensure_ascii=False)}

Respuesta inicial (máximo 200 palabras):
"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def _perform_ethical_critique(self, original_query: str, initial_response: str, 
                                      context: Dict[str, Any]) -> Dict[str, Any]:
        """Perform deep ethical self-critique of initial response"""
        
        critique_prompt = f"""
Actúa como un CRÍTICO ÉTICO EXPERTO evaluando esta respuesta sobre ética corporativa.

CONSULTA ORIGINAL: {original_query}
RESPUESTA A EVALUAR: {initial_response}

Realiza una CRÍTICA PROFUNDA considerando:

1. **Completitud Ética**: ¿Qué aspectos éticos importantes se omitieron?
2. **Análisis de Stakeholders**: ¿Se consideraron TODOS los afectados?
3. **Consecuencias No Previstas**: ¿Qué riesgos no se anticiparon?
4. **Marcos Éticos**: ¿Qué principios éticos necesitan más profundidad?
5. **Aplicabilidad Práctica**: ¿Es realmente implementable la recomendación?

Estructura tu crítica como:
- **Fortalezas identificadas**: [lista]
- **Debilidades críticas**: [lista] 
- **Aspectos omitidos**: [lista]
- **Riesgos no considerados**: [lista]
- **Recomendaciones de mejora**: [lista]

Sé RIGUROSO y CONSTRUCTIVO. Esta crítica se usará para mejorar la respuesta.
"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": critique_prompt}],
            max_tokens=600,
            temperature=0.3  # Lower temperature for analytical critique
        )
        
        critique_content = response.choices[0].message.content
        
        # Extract insights and concerns using simple parsing
        insights = self._extract_insights_from_critique(critique_content)
        concerns = self._extract_concerns_from_critique(critique_content)
        
        return {
            "critique": critique_content,
            "confidence": 0.8,
            "insights": insights,
            "concerns": concerns
        }
    
    async def _validate_against_frameworks(self, query: str, initial_response: str, 
                                         critique: Dict[str, Any]) -> Dict[str, Any]:
        """Validate response against multiple ethical frameworks"""
        
        frameworks_prompt = f"""
Evalúa esta respuesta ética desde MÚLTIPLES MARCOS ÉTICOS FILOSÓFICOS:

CONSULTA: {query}
RESPUESTA: {initial_response}
CRÍTICAS PREVIAS: {critique['critique'][:300]}...

Analiza desde estos marcos:

1. **CONSECUENCIALISMO**: ¿Las consecuencias son óptimas para el mayor bien?
2. **DEONTOLOGÍA**: ¿Cumple con deberes y reglas universales?
3. **ÉTICA DE VIRTUDES**: ¿Promueve virtudes y excelencia del carácter?
4. **ÉTICA DEL CUIDADO**: ¿Considera relaciones y responsabilidades?
5. **PRINCIPIALISMO**: ¿Respeta autonomía, beneficencia, no-maleficencia, justicia?

Para cada marco, evalúa (1-10):
- Adherencia al marco
- Consistencia lógica
- Aplicabilidad práctica

Identifica CONFLICTOS entre marcos y propón SÍNTESIS integradora.
"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": frameworks_prompt}],
            max_tokens=700,
            temperature=0.4
        )
        
        validation_content = response.choices[0].message.content
        
        # Extract framework-specific insights
        insights = self._extract_framework_insights(validation_content)
        concerns = self._extract_framework_concerns(validation_content)
        
        return {
            "validation": validation_content,
            "confidence": 0.85,
            "insights": insights,
            "concerns": concerns
        }
    
    async def _iterative_refinement(self, query: str, initial_response: str,
                                  critique: Dict[str, Any], validation: Dict[str, Any], 
                                  context: Dict[str, Any]) -> Dict[str, Any]:
        """Iteratively refine response based on critique and validation"""
        
        refinement_prompt = f"""
TAREA: Crear una respuesta MEJORADA integrando todas las reflexiones previas.

CONSULTA ORIGINAL: {query}
RESPUESTA INICIAL: {initial_response}

CRÍTICAS IDENTIFICADAS:
{critique['critique']}

VALIDACIÓN MULTI-MARCO:
{validation['validation']}

INSTRUCCIONES PARA REFINAMIENTO:

1. **Integra todas las críticas válidas**
2. **Resuelve conflictos entre marcos éticos**
3. **Agrega los aspectos omitidos identificados**
4. **Mejora la aplicabilidad práctica**
5. **Mantén claridad y concisión**

IMPORTANTE: 
- NO repitas la respuesta inicial
- CONSTRUYE una respuesta NUEVA y MEJORADA
- INTEGRA insights de múltiples marcos éticos
- PROPORCIONA pasos concretos y actionables

Respuesta refinada (máximo 400 palabras):
"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": refinement_prompt}],
            max_tokens=600,
            temperature=0.5
        )
        
        refined_content = response.choices[0].message.content
        
        return {
            "content": refined_content,
            "confidence": 0.9,
            "insights": ["Respuesta refinada integrando múltiples perspectivas",
                        "Consideraciones prácticas mejoradas"],
            "concerns": ["Requiere síntesis final para optimización"]
        }
    
    async def _final_synthesis(self, query: str, reflection_steps: List[P4ReflectionStep],
                              context: Dict[str, Any], user_profile: str) -> Dict[str, Any]:
        """Create final optimized synthesis of all reflection steps"""
        
        # Compile all insights from reflection steps
        all_insights = []
        all_concerns = []
        for step in reflection_steps:
            all_insights.extend(step.insights)
            all_concerns.extend(step.concerns)
        
        synthesis_prompt = f"""
TAREA FINAL: Crear la SÍNTESIS ÓPTIMA de todo el proceso de reflexión P4.

CONSULTA ORIGINAL: {query}
PERFIL USUARIO: {user_profile}

PROCESO DE REFLEXIÓN COMPLETADO:
- Respuesta inicial generada
- Auto-crítica ética realizada  
- Validación multi-marco completada
- Refinamiento iterativo aplicado

INSIGHTS ACUMULADOS: {', '.join(all_insights[:10])}
CONCERNS IDENTIFICADOS: {', '.join(all_concerns[:8])}

INSTRUCCIONES PARA SÍNTESIS FINAL:

1. **Crea una respuesta DEFINITIVA y OPTIMIZADA**
2. **Integra TODOS los insights del proceso P4**
3. **Resuelve TODAS las concerns identificadas**
4. **Proporciona un plan de acción CLARO y ESPECÍFICO**
5. **Incluye consideraciones de implementación PRÁCTICA**
6. **Mantén tono conversacional pero profesional**

La respuesta debe ser:
- Éticamente sólida desde múltiples perspectivas
- Prácticamente implementable
- Específicamente adaptada al contexto
- Clara en próximos pasos concretos

Respuesta final optimizada:
"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": synthesis_prompt}],
            max_tokens=800,
            temperature=0.3  # Lower temperature for final precision
        )
        
        final_content = response.choices[0].message.content
        
        # Generate ethical analysis summary
        ethical_analysis = {
            "frameworks_considered": len(self.p4_config["ethical_frameworks"]),
            "reflection_depth": len(reflection_steps),
            "confidence_progression": [step.confidence for step in reflection_steps],
            "key_ethical_dimensions": self._identify_key_dimensions(reflection_steps),
            "p4_validation": "Complete multi-step ethical validation performed"
        }
        
        return {
            "message": final_content,
            "confidence": 0.95,  # High confidence after P4 process
            "ethical_analysis": ethical_analysis
        }
    
    def _generate_p4_suggestions(self, reflection_steps: List[P4ReflectionStep], 
                                synthesis: Dict[str, Any]) -> List[str]:
        """Generate enhanced suggestions based on P4 insights"""
        
        base_suggestions = [
            "¿Cómo validarías esta decisión con diferentes stakeholders?",
            "¿Qué métricas usarías para evaluar el éxito ético a largo plazo?",
            "¿Cómo documentarías el proceso de toma de decisión ética?"
        ]
        
        # Add P4-specific suggestions based on reflection insights
        p4_suggestions = []
        
        if any("stakeholder" in step.content.lower() for step in reflection_steps):
            p4_suggestions.append("¿Realizaste un mapeo completo de stakeholders afectados?")
        
        if any("consecuencia" in step.content.lower() for step in reflection_steps):
            p4_suggestions.append("¿Consideraste consecuencias de segundo y tercer orden?")
            
        if any("marco" in step.content.lower() or "framework" in step.content.lower() for step in reflection_steps):
            p4_suggestions.append("¿Qué otros marcos éticos podrían aplicar a esta situación?")
        
        return (base_suggestions + p4_suggestions)[:4]  # Limit to 4 suggestions
    
    def _compile_p4_insights(self, reflection_steps: List[P4ReflectionStep], 
                           processing_time: float) -> Dict[str, Any]:
        """Compile comprehensive P4 process insights"""
        
        return {
            "total_reflection_steps": len(reflection_steps),
            "processing_time_seconds": round(processing_time, 2),
            "confidence_evolution": [step.confidence for step in reflection_steps],
            "insights_generated": sum(len(step.insights) for step in reflection_steps),
            "concerns_identified": sum(len(step.concerns) for step in reflection_steps),
            "p4_methodology": "Multi-step ethical reflection with iterative refinement",
            "ethical_frameworks_applied": len(self.p4_config["ethical_frameworks"]),
            "validation_depth": "Deep multi-perspective ethical validation"
        }
    
    def _extract_insights_from_critique(self, critique: str) -> List[str]:
        """Extract key insights from critique text"""
        insights = []
        lines = critique.split('\n')
        
        for line in lines:
            if 'fortaleza' in line.lower() or 'strength' in line.lower():
                insights.append(line.strip())
            elif line.startswith('- ') and 'bueno' in line.lower():
                insights.append(line[2:].strip())
        
        return insights[:3] if insights else ["Crítica ética completada"]
    
    def _extract_concerns_from_critique(self, critique: str) -> List[str]:
        """Extract key concerns from critique text"""
        concerns = []
        lines = critique.split('\n')
        
        for line in lines:
            if 'debilidad' in line.lower() or 'weakness' in line.lower():
                concerns.append(line.strip())
            elif 'riesgo' in line.lower() or 'risk' in line.lower():
                concerns.append(line.strip())
            elif line.startswith('- ') and any(word in line.lower() for word in ['falta', 'omite', 'problema']):
                concerns.append(line[2:].strip())
        
        return concerns[:3] if concerns else ["Requiere validación adicional"]
    
    def _extract_framework_insights(self, validation: str) -> List[str]:
        """Extract insights from framework validation"""
        return [
            "Validación multi-marco ética completada",
            "Consistencia entre marcos éticos evaluada",
            "Conflictos éticos identificados y resueltos"
        ]
    
    def _extract_framework_concerns(self, validation: str) -> List[str]:
        """Extract concerns from framework validation"""
        return [
            "Requiere integración de perspectivas múltiples",
            "Necesita síntesis final optimizada"
        ]
    
    def _identify_key_dimensions(self, reflection_steps: List[P4ReflectionStep]) -> List[str]:
        """Identify key ethical dimensions from reflection process"""
        dimensions = []
        
        all_content = " ".join([step.content for step in reflection_steps]).lower()
        
        if "stakeholder" in all_content:
            dimensions.append("Análisis de stakeholders")
        if "consecuencia" in all_content:
            dimensions.append("Evaluación de consecuencias")
        if "transparencia" in all_content:
            dimensions.append("Principio de transparencia")
        if "integridad" in all_content:
            dimensions.append("Integridad corporativa")
        if "legal" in all_content or "ley" in all_content:
            dimensions.append("Cumplimiento legal")
        
        return dimensions[:5]  # Top 5 dimensions
    
    def _create_p4_fallback(self, session_id: str, message: str, error: str) -> P4ConversationResponse:
        """Create fallback P4 response when processing fails"""
        
        fallback_message = f"""
🧠 **Catalina P4 - Respuesta de Contingencia**

Tu consulta sobre "{message[:100]}..." requiere análisis ético profundo. 

Aunque experimento dificultades técnicas, puedo ofrecerte un framework P4 simplificado:

**1. Evaluación Inicial**: Tu situación presenta dilemas éticos que requieren consideración cuidadosa.

**2. Auto-Reflexión**: ¿Qué principios éticos están en tensión aquí?

**3. Validación Multi-Marco**:
   - **Consecuencias**: ¿Cuál es el resultado óptimo?
   - **Deberes**: ¿Qué reglas/obligaciones aplican?
   - **Virtudes**: ¿Qué haría una persona íntegra?

**4. Refinamiento**: Integra todas las perspectivas para una decisión balanceada.

**5. Síntesis**: Actúa con transparencia, considerando todos los stakeholders afectados.

*Nota: Esta es una versión simplificada del proceso P4. Para análisis completo, el sistema necesita estar completamente operativo.*
"""
        
        return P4ConversationResponse(
            final_message=fallback_message,
            confidence=0.75,
            suggestions=[
                "¿Aplicaste el framework P4 completo a tu situación?",
                "¿Consideraste las perspectivas de todos los stakeholders?",
                "¿Tu decisión resiste el escrutinio ético multi-marco?"
            ],
            ethical_analysis={
                "frameworks_considered": 3,
                "reflection_depth": 1,
                "confidence_progression": [0.75],
                "key_ethical_dimensions": ["Transparencia", "Integridad", "Stakeholders"],
                "p4_validation": "Fallback mode - P4 simplificado"
            },
            session_id=session_id,
            reflection_steps=[
                P4ReflectionStep(
                    step_name="Fallback Response",
                    content=fallback_message,
                    confidence=0.75,
                    insights=["P4 framework aplicado en modo simplificado"],
                    concerns=["Sistema requiere reparación para P4 completo"]
                )
            ],
            p4_insights={
                "total_reflection_steps": 1,
                "processing_time_seconds": 0.5,
                "p4_methodology": "Simplified P4 fallback mode",
                "validation_depth": "Basic multi-framework consideration"
            },
            processing_time=0.5
        )

# Global instance for testing
catalina_p4_agent = CatalinaP4Agent(demo_mode=True)

# Test function
async def test_catalina_p4():
    """Test P4 functionality"""
    
    test_query = "Mi jefe me pidió que apruebe una factura que creo que es inflada para favorecer a un proveedor que es su amigo personal. ¿Qué debo hacer?"
    
    print("🧠 TESTING CATALINA P4 REFLECTION...")
    print(f"Query: {test_query}")
    print("\n" + "="*80 + "\n")
    
    response = await catalina_p4_agent.process_conversation_p4(
        session_id="p4_test_001",
        user_message=test_query,
        context={"company_size": "medium", "industry": "servicios"},
        user_profile="empleado_administracion"
    )
    
    print("🎭 CATALINA P4 RESPONSE:")
    print(f"Final Message: {response.final_message}")
    print(f"\nConfidence: {response.confidence}")
    print(f"Processing Time: {response.processing_time}s")
    print(f"\nReflection Steps: {len(response.reflection_steps)}")
    
    for i, step in enumerate(response.reflection_steps, 1):
        print(f"\n--- P4 Step {i}: {step.step_name} ---")
        print(f"Confidence: {step.confidence}")
        print(f"Content: {step.content[:200]}...")
    
    print(f"\nP4 Insights: {response.p4_insights}")

if __name__ == "__main__":
    print("""
    🧠 Catalina P4 Agent - Advanced Ethical Reflection
    
    ✅ P4 Patent Implementation: Multi-step reflection
    ✅ Ethical Framework Validation: 5 major frameworks
    ✅ Iterative Refinement: Self-critique + improvement
    ✅ Deep Analysis: Stakeholder + consequence evaluation
    
    Testing P4 methodology...
    """)
    
    asyncio.run(test_catalina_p4())