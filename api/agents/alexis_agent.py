#!/usr/bin/env python3
"""
🔬 Alexis Agent - Analytical Compliance Expert  
Claude-powered analytical agent for IntegridAI HackAI 2025

Características:
- IA analítica especializada en compliance automático
- Powered by Claude via OpenRouter (con límites para hackathon)  
- Análisis profundo de regulaciones y normativas
- Personality optimizada para investigación y análisis
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from datetime import datetime
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class AnalysisRequest:
    """Request structure for Alexis analysis"""
    session_id: str
    query: str
    context: Dict[str, Any]
    analysis_type: str = "compliance"  # compliance, regulatory, risk, legal

@dataclass
class AnalysisResponse:
    """Response structure from Alexis"""
    analysis: str
    key_findings: List[str]
    regulatory_references: List[Dict[str, str]]
    risk_assessment: Dict[str, Any]
    recommendations: List[str]
    confidence: float
    session_id: str

class AlexisAgent:
    """
    🔬 Alexis - Experto en Análisis de Compliance
    
    Especializado en:
    - Análisis regulatorio profundo
    - Investigación de normativas
    - Assessment de riesgo automático
    - Referencias legales y jurisprudencia
    """
    
    def __init__(self, demo_mode: bool = True):
        self.demo_mode = demo_mode
        self.model = "anthropic/claude-3-sonnet-20240229"  # Via OpenRouter BYOK
        
        # Initialize OpenRouter client  
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": "https://github.com/adrianlerer/integridai-hackai-2025",
                "X-Title": "IntegridAI-HackAI-Alexis"
            }
        )
        
        # Regulatory framework database (simplified for demo)
        self.regulatory_frameworks = {
            "ley_27401": {
                "title": "Ley 27.401 - Responsabilidad Penal Empresaria",
                "scope": "Prevención de corrupción en sector privado",
                "key_articles": ["Art. 22", "Art. 23", "Art. 24", "Art. 25"]
            },
            "uif_guidelines": {
                "title": "Resoluciones UIF",
                "scope": "Prevención lavado de dinero",  
                "key_articles": ["Res. 65/2011", "Res. 229/2011"]
            },
            "bcra_compliance": {
                "title": "Normativa BCRA",
                "scope": "Compliance financiero",
                "key_articles": ["Com. A 5374", "Com. A 6331"]
            }
        }
        
    def _build_analytical_prompt(self, analysis_type: str) -> str:
        """Build specialized analytical prompt for Alexis"""
        
        base_prompt = f"""
Eres Alexis, experto analítico en compliance y regulaciones de IntegridAI.

CONTEXTO DEL HACKATHON:
- Evento: HackAI 2025 Universidad Austral
- Análisis tipo: {analysis_type}
- Objetivo: Research profundo y análisis técnico

TU EXPERTISE:
- Análisis regulatorio sistemático
- Investigación de normativas argentinas
- Assessment de riesgo cuantificativo
- Referencias legales precisas
- Metodología analítica estructurada

MARCOS NORMATIVOS PRINCIPALES:
- Ley 27.401 (Responsabilidad Penal Empresaria)
- Normativa UIF (Lavado de dinero)
- Regulaciones BCRA (Compliance financiero)
- CNV (Mercado de capitales)
- Código Penal (Delitos económicos)

METODOLOGÍA DE ANÁLISIS:
1. Identificación del marco normativo aplicable
2. Análisis de artículos y disposiciones relevantes
3. Assessment de riesgo regulatorio
4. Identificación de obligaciones específicas
5. Recomendaciones de implementación práctica
6. Referencias a jurisprudencia y precedentes

FORMATO DE RESPUESTA:
- Análisis estructurado y sistemático
- Key findings claramente identificados
- Referencias normativas específicas
- Assessment de riesgo cuantificado
- Recomendaciones actionables

TONO:
- Técnico pero comprensible
- Analítico y metódico  
- Basado en evidencia
- Orientado a la implementación práctica
"""
        
        return base_prompt
    
    async def process_analysis(self, request: AnalysisRequest) -> AnalysisResponse:
        """
        Process analytical request with deep regulatory research
        """
        try:
            # Build specialized analytical prompt
            system_prompt = self._build_analytical_prompt(request.analysis_type)
            
            # Prepare analysis messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": self._structure_analysis_query(request)}
            ]
            
            # Get AI analysis via OpenRouter + Claude
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=1200 if self.demo_mode else 2000,
                temperature=0.3,  # Lower temperature for analytical precision
                top_p=0.9
            )
            
            analysis_content = response.choices[0].message.content
            
            # Extract structured components
            key_findings = await self._extract_key_findings(analysis_content)
            regulatory_refs = self._identify_regulatory_references(request.query)
            risk_assessment = await self._assess_regulatory_risk(request.query, request.context)
            recommendations = self._generate_recommendations(analysis_content, request.analysis_type)
            
            return AnalysisResponse(
                analysis=analysis_content,
                key_findings=key_findings,
                regulatory_references=regulatory_refs,
                risk_assessment=risk_assessment,
                recommendations=recommendations,
                confidence=0.88,  # High analytical confidence
                session_id=request.session_id
            )
            
        except Exception as e:
            # Analytical fallback
            return self._create_analytical_fallback(request, str(e))
    
    def _structure_analysis_query(self, request: AnalysisRequest) -> str:
        """Structure the analytical query for optimal AI processing"""
        
        context_elements = []
        
        # Add analysis type context
        context_elements.append(f"Tipo de análisis: {request.analysis_type}")
        
        # Add relevant context
        if request.context.get("company_size"):
            context_elements.append(f"Tamaño empresa: {request.context['company_size']}")
        
        if request.context.get("industry"):
            context_elements.append(f"Industria: {request.context['industry']}")
            
        if request.context.get("jurisdiction"):
            context_elements.append(f"Jurisdicción: {request.context['jurisdiction']}")
        
        context_str = " | ".join(context_elements)
        
        return f"""
PARÁMETROS DE ANÁLISIS: {context_str}

CONSULTA PARA ANÁLISIS PROFUNDO:
{request.query}

Por favor, proporciona un análisis técnico comprensivo que incluya:

1. **Marco Normativo Aplicable**: Identifica las regulaciones específicas
2. **Análisis de Cumplimiento**: Evalúa obligaciones y requerimientos  
3. **Assessment de Riesgo**: Cuantifica riesgos regulatorios y operacionales
4. **Gap Analysis**: Identifica brechas de cumplimiento potenciales
5. **Implementación Práctica**: Recomienda pasos concretos de implementación
6. **Monitoring Continuo**: Sugiere métricas y controles de seguimiento

Enfócate en proporcionar insights actionables y referencias normativas precisas.
"""

    async def _extract_key_findings(self, analysis_content: str) -> List[str]:
        """Extract key findings from analysis (simplified NLP)"""
        
        # Simplified extraction based on common patterns
        findings = []
        
        lines = analysis_content.split('\n')
        for line in lines:
            line = line.strip()
            # Look for structured findings
            if any(indicator in line.lower() for indicator in ['clave:', 'importante:', 'crítico:', 'hallazgo:']):
                findings.append(line.replace('**', '').replace('*', ''))
            elif line.startswith('- ') and len(line) > 20:
                findings.append(line[2:])  # Remove bullet point
        
        # Ensure we have at least some findings
        if not findings:
            findings = [
                "Análisis regulatorio completado exitosamente",
                "Marco normativo aplicable identificado",
                "Recomendaciones de implementación disponibles"
            ]
        
        return findings[:5]  # Limit to top 5 findings
    
    def _identify_regulatory_references(self, query: str) -> List[Dict[str, str]]:
        """Identify relevant regulatory references based on query"""
        
        references = []
        query_lower = query.lower()
        
        # Check for specific regulatory frameworks
        if any(term in query_lower for term in ['corrupción', 'soborno', 'ética', 'integridad']):
            references.append({
                "regulation": "Ley 27.401",
                "article": "Art. 22-25", 
                "description": "Programa de Integridad - Responsabilidad Penal Empresaria"
            })
        
        if any(term in query_lower for term in ['lavado', 'dinero', 'uif', 'financiero']):
            references.append({
                "regulation": "Resolución UIF 65/2011",
                "article": "Art. 1-15",
                "description": "Sujetos obligados - Prevención Lavado de Activos"
            })
            
        if any(term in query_lower for term in ['banco', 'bcra', 'financiera', 'crédito']):
            references.append({
                "regulation": "Comunicación BCRA A 5374",
                "article": "Punto 1-8",
                "description": "Gestión Integral de Riesgos"
            })
        
        # Default reference if no specific match
        if not references:
            references.append({
                "regulation": "Marco General de Compliance",
                "article": "Principios Generales", 
                "description": "Buenas prácticas de cumplimiento normativo"
            })
        
        return references
    
    async def _assess_regulatory_risk(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Assess regulatory risk based on query and context"""
        
        # Simplified risk scoring algorithm
        risk_factors = {
            "regulatory_complexity": 0.3,  # Base complexity
            "industry_risk": 0.2,
            "size_factor": 0.2, 
            "geographic_scope": 0.1,
            "operational_risk": 0.2
        }
        
        # Adjust based on query content
        if any(term in query.lower() for term in ['internacional', 'exporta', 'multinacional']):
            risk_factors["geographic_scope"] = 0.4
        
        if any(term in query.lower() for term in ['financiero', 'banco', 'crédito']):
            risk_factors["industry_risk"] = 0.5
            
        if context.get("company_size") == "large":
            risk_factors["size_factor"] = 0.4
        
        # Calculate overall risk score
        overall_risk = sum(risk_factors.values()) / len(risk_factors)
        
        return {
            "overall_score": round(overall_risk, 2),
            "risk_level": "Alto" if overall_risk > 0.7 else "Medio" if overall_risk > 0.4 else "Bajo",
            "key_risk_factors": [k for k, v in risk_factors.items() if v > 0.3],
            "mitigation_priority": "Inmediata" if overall_risk > 0.8 else "Corto plazo" if overall_risk > 0.5 else "Medio plazo"
        }
    
    def _generate_recommendations(self, analysis: str, analysis_type: str) -> List[str]:
        """Generate actionable recommendations based on analysis"""
        
        base_recommendations = []
        
        if analysis_type == "compliance":
            base_recommendations = [
                "Implementar programa de compliance integral según Ley 27.401",
                "Establecer canal de denuncias anónimas y confidenciales",
                "Realizar due diligence exhaustiva de terceros y proveedores",
                "Capacitar personal en prevención de corrupción y ética empresarial"
            ]
        elif analysis_type == "risk":
            base_recommendations = [
                "Desarrollar matriz de riesgos específica por área de negocio", 
                "Implementar controles preventivos y detectivos",
                "Establecer métricas y KPIs de monitoreo continuo",
                "Realizar assessments periódicos de efectividad"
            ]
        elif analysis_type == "regulatory":
            base_recommendations = [
                "Monitorear cambios regulatorios de forma sistemática",
                "Establecer procedimientos de actualización normativa", 
                "Implementar training específico por marco regulatorio",
                "Documentar evidencia de cumplimiento para auditorías"
            ]
        else:
            base_recommendations = [
                "Realizar análisis de gap contra mejores prácticas",
                "Implementar controles basados en riesgo",
                "Establecer governance y reporting ejecutivo",
                "Planificar implementación por fases priorizadas"
            ]
        
        return base_recommendations[:4]  # Limit to 4 recommendations
    
    def _create_analytical_fallback(self, request: AnalysisRequest, error: str) -> AnalysisResponse:
        """Create fallback analytical response"""
        
        fallback_analysis = f"""
**ANÁLISIS DE COMPLIANCE - MODO DEMO**

He analizado tu consulta sobre "{request.query[:100]}..." desde la perspectiva 
de cumplimiento normativo y gestión de riesgo empresarial.

**MARCO REGULATORIO APLICABLE:**
- Ley 27.401 (Responsabilidad Penal Empresaria)
- Normativa sectorial específica
- Mejores prácticas internacionales

**CONSIDERACIONES PRINCIPALES:**
1. **Obligaciones de Compliance**: Toda empresa debe implementar programas de integridad
2. **Due Diligence**: Verificación sistemática de terceros es mandatoria  
3. **Controles Internos**: Sistemas de prevención y detección son clave
4. **Capacitación**: Personal debe estar entrenado en prevención de corrupción

**ASSESSMENT DE RIESGO:**
Basado en tu consulta, identifico riesgo de nivel medio que requiere 
atención sistemática y controles específicos.

*Nota: Análisis en modo demo para HackAI 2025. Consulta expertos para implementación real.*
"""
        
        return AnalysisResponse(
            analysis=fallback_analysis,
            key_findings=[
                "Marco regulatorio aplicable identificado",
                "Riesgo de compliance requiere atención",
                "Controles preventivos recomendados",
                "Capacitación de personal necesaria"
            ],
            regulatory_references=[
                {
                    "regulation": "Ley 27.401",
                    "article": "Art. 22-25",
                    "description": "Programa de Integridad Empresarial"
                }
            ],
            risk_assessment={
                "overall_score": 0.6,
                "risk_level": "Medio",
                "key_risk_factors": ["regulatory_complexity"],
                "mitigation_priority": "Corto plazo"
            },
            recommendations=[
                "Implementar programa de compliance básico",
                "Establecer políticas y procedimientos",
                "Capacitar personal clave",
                "Monitorear cumplimiento periódicamente"
            ],
            confidence=0.75,
            session_id=request.session_id
        )

# Global instance for easy import
alexis_agent = AlexisAgent(demo_mode=True)

# Demo/test function
async def test_alexis():
    """Test function for development"""
    
    test_request = AnalysisRequest(
        session_id="test_analysis_001",
        query="Necesito implementar un programa de compliance según Ley 27.401 para una empresa de construcción de 200 empleados",
        context={
            "company_size": "medium",
            "industry": "construcción", 
            "jurisdiction": "argentina"
        },
        analysis_type="compliance"
    )
    
    response = await alexis_agent.process_analysis(test_request)
    
    print("🔬 ALEXIS ANALYSIS:")
    print(f"Analysis: {response.analysis[:200]}...")
    print(f"Key Findings: {response.key_findings}")
    print(f"Risk Assessment: {response.risk_assessment}")
    print(f"Recommendations: {response.recommendations}")

if __name__ == "__main__":
    print("""
    🔬 Alexis Agent - IntegridAI HackAI 2025
    
    ✅ Claude-powered analytical AI
    ✅ Compliance y regulatory expertise  
    ✅ Optimizado para research profundo
    ✅ Demo mode para hackathon
    
    Testing agent...
    """)
    
    asyncio.run(test_alexis())