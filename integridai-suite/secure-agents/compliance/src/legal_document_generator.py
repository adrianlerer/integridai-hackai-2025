#!/usr/bin/env python3
"""
Legal Document Generator (LDG) Agent
====================================

Generación automatizada de documentos de compliance y legales con plantillas
inteligentes, validación jurídica automática y cumplimiento normativo.

Features:
- Intelligent legal template generation
- Multi-jurisdiction compliance (Argentina, EU, US)
- Automated clause insertion based on risk profiles
- Legal validation and consistency checking
- Document versioning and approval workflows
- Integration with corporate data sources
- Ley 27.401 compliance documentation
- Multi-language support (ES, EN, PT)
- Digital signatures and authenticity verification

Author: IntegridAI Suite
Version: 2.1.3
Compliance: Ley 27.401, EU AI Act, NIST AI RMF
"""

import asyncio
import hashlib
import json
import logging
import re
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Tuple, Any, Union
from pathlib import Path
import uuid

# Configuration for fallback mode
try:
    from jinja2 import Template, Environment, FileSystemLoader
    JINJA2_AVAILABLE = True
except ImportError:
    JINJA2_AVAILABLE = False

try:
    import markdown
    MARKDOWN_AVAILABLE = True
except ImportError:
    MARKDOWN_AVAILABLE = False


class DocumentType(Enum):
    """Types of legal documents that can be generated"""
    COMPLIANCE_POLICY = "compliance_policy"
    DUE_DILIGENCE_REPORT = "due_diligence_report"
    THIRD_PARTY_AGREEMENT = "third_party_agreement"
    PRIVACY_NOTICE = "privacy_notice"
    RISK_ASSESSMENT = "risk_assessment"
    AUDIT_REPORT = "audit_report"
    TRAINING_MATERIAL = "training_material"
    INCIDENT_REPORT = "incident_report"
    REGULATORY_FILING = "regulatory_filing"
    CODE_OF_CONDUCT = "code_of_conduct"


class Jurisdiction(Enum):
    """Legal jurisdictions supported"""
    ARGENTINA = "AR"
    EUROPEAN_UNION = "EU"
    UNITED_STATES = "US"
    BRAZIL = "BR"
    MEXICO = "MX"
    COLOMBIA = "CO"
    URUGUAY = "UY"
    CHILE = "CL"


class DocumentLanguage(Enum):
    """Supported document languages"""
    SPANISH = "es"
    ENGLISH = "en"
    PORTUGUESE = "pt"
    FRENCH = "fr"


class ApprovalLevel(Enum):
    """Document approval levels"""
    DRAFT = "DRAFT"
    MANAGER_REVIEW = "MANAGER_REVIEW"
    LEGAL_REVIEW = "LEGAL_REVIEW"
    COMPLIANCE_REVIEW = "COMPLIANCE_REVIEW"
    EXECUTIVE_APPROVAL = "EXECUTIVE_APPROVAL"
    FINAL_APPROVED = "FINAL_APPROVED"


@dataclass
class DocumentTemplate:
    """Legal document template definition"""
    template_id: str
    document_type: DocumentType
    jurisdiction: Jurisdiction
    language: DocumentLanguage
    template_name: str
    description: str
    version: str
    template_content: str
    required_variables: List[str]
    optional_variables: List[str]
    compliance_frameworks: List[str]
    approval_workflow: List[ApprovalLevel]
    legal_disclaimers: List[str]
    created_by: str
    created_at: datetime
    last_modified: datetime
    is_active: bool


@dataclass
class DocumentRequest:
    """Request for document generation"""
    request_id: str
    document_type: DocumentType
    jurisdiction: Jurisdiction
    language: DocumentLanguage
    requested_by: str
    organization_unit: str
    variables: Dict[str, Any]
    template_preferences: Optional[str]
    urgency_level: str
    delivery_format: List[str]  # pdf, docx, html, etc.
    approval_required: bool
    compliance_validation: bool
    created_at: datetime


@dataclass
class GeneratedDocument:
    """Generated legal document"""
    document_id: str
    request: DocumentRequest
    template_used: DocumentTemplate
    generated_content: str
    generated_html: str
    generated_metadata: Dict[str, Any]
    approval_status: ApprovalLevel
    approval_history: List[Dict[str, Any]]
    compliance_validation_results: Dict[str, Any]
    legal_review_notes: List[str]
    version_number: str
    document_hash: str
    digital_signature: Optional[str]
    expiration_date: Optional[datetime]
    processing_time_ms: int
    audit_trail: Dict[str, Any]
    created_at: datetime


@dataclass
class ComplianceValidation:
    """Compliance validation results"""
    validation_id: str
    document_id: str
    framework: str
    validation_status: str
    compliance_score: float
    issues_found: List[Dict[str, Any]]
    recommendations: List[str]
    validated_by: str
    validation_date: datetime


class LegalDocumentGenerator:
    """
    Legal Document Generator Agent
    
    Genera documentos legales y de compliance automatizados usando plantillas
    inteligentes con validación jurídica y cumplimiento normativo.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize LDG agent with configuration
        
        Args:
            config: Configuration dictionary with templates, data sources, etc.
        """
        self.agent_id = "LDG-001"
        self.agent_name = "Legal Document Generator"
        self.version = "v2.1.3"
        self.config = config
        
        # Setup logging
        self.logger = self._setup_secure_logger()
        
        # Initialize template system
        if JINJA2_AVAILABLE:
            self.template_env = Environment(
                loader=FileSystemLoader(config.get("templates_directory", "templates")),
                autoescape=True
            )
        else:
            self.template_env = None
        
        # Load document templates
        self.templates = self._load_document_templates()
        
        # Initialize data sources
        self.data_sources = {
            "corporate_db": self._init_corporate_db_source(),
            "legal_db": self._init_legal_db_source(),
            "regulatory_feeds": self._init_regulatory_feeds_source(),
            "template_repository": self._init_template_repository_source(),
            "approval_system": self._init_approval_system_source()
        }
        
        # Legal frameworks and compliance rules
        self.compliance_frameworks = {
            "ley_27401": self._load_ley_27401_rules(),
            "eu_ai_act": self._load_eu_ai_act_rules(),
            "nist_ai_rmf": self._load_nist_ai_rmf_rules(),
            "gdpr": self._load_gdpr_rules()
        }
        
        # Document validation rules
        self.validation_rules = self._load_validation_rules()
        
        # Approval workflows by document type
        self.approval_workflows = self._define_approval_workflows()
        
        # Legal clause libraries
        self.clause_libraries = self._load_clause_libraries()
        
        # Resource limits
        self.resource_limits = {
            "max_concurrent_generations": 25,
            "max_document_size_mb": 50,
            "max_processing_time_s": 120,
            "max_template_variables": 500
        }
        
        # Performance metrics
        self.performance_metrics = {
            "documents_generated": 0,
            "templates_used": {},
            "approval_success_rate": 0,
            "average_generation_time": 0,
            "compliance_validation_rate": 0,
            "last_reset": datetime.utcnow()
        }
        
        self.logger.info({
            "action": "agent_initialized",
            "agent_id": self.agent_id,
            "version": self.version,
            "templates_loaded": len(self.templates),
            "frameworks_supported": list(self.compliance_frameworks.keys()),
            "jurisdictions_supported": [j.value for j in Jurisdiction],
            "languages_supported": [l.value for l in DocumentLanguage],
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def generate_document(self, request: DocumentRequest) -> GeneratedDocument:
        """
        Generate legal document based on request
        
        Args:
            request: Document generation request
            
        Returns:
            GeneratedDocument with complete legal document
        """
        start_time = time.time()
        
        document_id = self._generate_document_id(request)
        
        self.logger.info({
            "action": "document_generation_started",
            "agent_id": self.agent_id,
            "request_id": request.request_id,
            "document_type": request.document_type.value,
            "jurisdiction": request.jurisdiction.value,
            "language": request.language.value,
            "document_id": document_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        try:
            # Select appropriate template
            template = await self._select_template(request)
            
            # Gather additional data from corporate sources
            enriched_variables = await self._enrich_document_variables(request, template)
            
            # Generate document content
            document_content = await self._generate_content(template, enriched_variables)
            
            # Generate HTML version
            html_content = await self._generate_html_version(document_content, template)
            
            # Create metadata
            metadata = self._create_document_metadata(request, template, enriched_variables)
            
            # Perform compliance validation if required
            compliance_results = {}
            if request.compliance_validation:
                compliance_results = await self._validate_compliance(
                    document_content, request, template
                )
            
            # Initialize approval process if required
            approval_status = ApprovalLevel.DRAFT
            approval_history = []
            
            if request.approval_required:
                approval_status = ApprovalLevel.MANAGER_REVIEW
                approval_history.append({
                    "level": ApprovalLevel.DRAFT.value,
                    "status": "completed",
                    "by": self.agent_id,
                    "timestamp": datetime.utcnow().isoformat(),
                    "notes": "Document generated automatically"
                })
            
            # Generate document hash and version
            document_hash = self._generate_document_hash(document_content, metadata)
            version_number = "1.0"
            
            # Digital signature if configured
            digital_signature = None
            if self.config.get("enable_digital_signatures", False):
                digital_signature = await self._generate_digital_signature(
                    document_content, document_hash
                )
            
            # Calculate expiration date
            expiration_date = self._calculate_expiration_date(request, template)
            
            # Processing time
            processing_time_ms = int((time.time() - start_time) * 1000)
            
            # Create audit trail
            audit_trail = self._create_audit_trail(
                request, template, enriched_variables, 
                processing_time_ms, len(document_content)
            )
            
            # Build generated document
            generated_document = GeneratedDocument(
                document_id=document_id,
                request=request,
                template_used=template,
                generated_content=document_content,
                generated_html=html_content,
                generated_metadata=metadata,
                approval_status=approval_status,
                approval_history=approval_history,
                compliance_validation_results=compliance_results,
                legal_review_notes=[],
                version_number=version_number,
                document_hash=document_hash,
                digital_signature=digital_signature,
                expiration_date=expiration_date,
                processing_time_ms=processing_time_ms,
                audit_trail=audit_trail,
                created_at=datetime.utcnow()
            )
            
            # Log completion and update metrics
            self._log_generation_completion(generated_document)
            self._update_performance_metrics(generated_document)
            
            # Send for approval if required
            if request.approval_required:
                await self._initiate_approval_workflow(generated_document)
            
            return generated_document
            
        except Exception as e:
            error_msg = f"Document generation failed for request {request.request_id}: {str(e)}"
            self.logger.error({
                "action": "document_generation_error",
                "agent_id": self.agent_id,
                "request_id": request.request_id,
                "error": str(e),
                "document_id": document_id,
                "timestamp": datetime.utcnow().isoformat()
            })
            raise RuntimeError(error_msg) from e
    
    async def _select_template(self, request: DocumentRequest) -> DocumentTemplate:
        """Select appropriate template for document request"""
        
        # Filter templates by document type, jurisdiction, and language
        matching_templates = []
        
        for template in self.templates:
            if (template.document_type == request.document_type and
                template.jurisdiction == request.jurisdiction and
                template.language == request.language and
                template.is_active):
                matching_templates.append(template)
        
        if not matching_templates:
            raise ValueError(
                f"No template found for {request.document_type.value} "
                f"in {request.jurisdiction.value} ({request.language.value})"
            )
        
        # Select best template based on preferences or most recent
        if request.template_preferences:
            for template in matching_templates:
                if request.template_preferences in template.template_name:
                    return template
        
        # Return most recent template
        return max(matching_templates, key=lambda t: t.last_modified)
    
    async def _enrich_document_variables(self, request: DocumentRequest,
                                       template: DocumentTemplate) -> Dict[str, Any]:
        """Enrich document variables with data from corporate sources"""
        
        enriched_variables = request.variables.copy()
        
        # Add standard variables
        enriched_variables.update({
            "generation_date": datetime.utcnow().strftime("%Y-%m-%d"),
            "generation_datetime": datetime.utcnow().isoformat(),
            "document_id": self._generate_document_id(request),
            "agent_version": self.version,
            "jurisdiction": request.jurisdiction.value,
            "language": request.language.value
        })
        
        # Gather corporate data
        corporate_data = await self._gather_corporate_data(request.organization_unit)
        enriched_variables.update(corporate_data)
        
        # Gather legal clauses based on document type and jurisdiction
        legal_clauses = await self._gather_legal_clauses(request, template)
        enriched_variables.update(legal_clauses)
        
        # Add compliance-specific variables
        compliance_vars = await self._gather_compliance_variables(request, template)
        enriched_variables.update(compliance_vars)
        
        return enriched_variables
    
    async def _generate_content(self, template: DocumentTemplate,
                              variables: Dict[str, Any]) -> str:
        """Generate document content from template and variables"""
        
        if JINJA2_AVAILABLE and self.template_env:
            # Use Jinja2 for advanced templating
            jinja_template = Template(template.template_content)
            content = jinja_template.render(**variables)
        else:
            # Simple string substitution fallback
            content = template.template_content
            
            for var_name, var_value in variables.items():
                placeholder = f"{{{{{var_name}}}}}"
                content = content.replace(placeholder, str(var_value))
        
        # Post-process content
        content = self._post_process_content(content, template, variables)
        
        return content
    
    async def _generate_html_version(self, content: str, 
                                   template: DocumentTemplate) -> str:
        """Generate HTML version of document"""
        
        # Convert markdown to HTML if available
        if MARKDOWN_AVAILABLE:
            # Check if content contains markdown
            if re.search(r'[#*_`]', content):
                html_content = markdown.markdown(content)
            else:
                # Wrap plain text in HTML
                html_content = f"<html><body><pre>{content}</pre></body></html>"
        else:
            # Simple HTML wrapper
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>{template.template_name}</title>
                <meta charset="utf-8">
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ text-align: center; margin-bottom: 30px; }}
                    .content {{ line-height: 1.6; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>{template.template_name}</h1>
                </div>
                <div class="content">
                    <pre>{content}</pre>
                </div>
            </body>
            </html>
            """
        
        return html_content
    
    async def _validate_compliance(self, content: str, request: DocumentRequest,
                                 template: DocumentTemplate) -> Dict[str, Any]:
        """Validate document compliance with applicable frameworks"""
        
        validation_results = {}
        
        # Validate against each applicable compliance framework
        for framework_name in template.compliance_frameworks:
            if framework_name in self.compliance_frameworks:
                framework_rules = self.compliance_frameworks[framework_name]
                
                validation_result = await self._validate_against_framework(
                    content, framework_name, framework_rules, request
                )
                
                validation_results[framework_name] = validation_result
        
        return validation_results
    
    async def _validate_against_framework(self, content: str, framework_name: str,
                                        rules: Dict[str, Any], 
                                        request: DocumentRequest) -> Dict[str, Any]:
        """Validate document against specific compliance framework"""
        
        validation_issues = []
        compliance_score = 1.0
        
        # Check required clauses
        required_clauses = rules.get("required_clauses", [])
        for clause in required_clauses:
            if clause.lower() not in content.lower():
                validation_issues.append({
                    "type": "missing_clause",
                    "severity": "high",
                    "description": f"Missing required clause: {clause}",
                    "recommendation": f"Add clause: {clause}"
                })
                compliance_score -= 0.2
        
        # Check prohibited terms
        prohibited_terms = rules.get("prohibited_terms", [])
        for term in prohibited_terms:
            if term.lower() in content.lower():
                validation_issues.append({
                    "type": "prohibited_content",
                    "severity": "critical",
                    "description": f"Contains prohibited term: {term}",
                    "recommendation": f"Remove or replace term: {term}"
                })
                compliance_score -= 0.3
        
        # Jurisdiction-specific validation
        if framework_name == "ley_27401" and request.jurisdiction == Jurisdiction.ARGENTINA:
            # Ley 27.401 specific checks
            art23_requirements = [
                "código de ética", "canales de denuncia", "capacitación",
                "due diligence", "monitoreo", "supervisión"
            ]
            
            missing_requirements = []
            for req in art23_requirements:
                if req not in content.lower():
                    missing_requirements.append(req)
            
            if missing_requirements:
                validation_issues.append({
                    "type": "ley_27401_compliance",
                    "severity": "high",
                    "description": f"Missing Ley 27.401 Art. 23 requirements: {', '.join(missing_requirements)}",
                    "recommendation": "Add missing compliance program elements per Art. 23"
                })
                compliance_score -= len(missing_requirements) * 0.1
        
        compliance_score = max(0.0, compliance_score)
        
        return {
            "framework": framework_name,
            "compliance_score": compliance_score,
            "status": "compliant" if compliance_score >= 0.8 else "non_compliant",
            "issues_found": validation_issues,
            "recommendations": [issue["recommendation"] for issue in validation_issues]
        }
    
    async def _gather_corporate_data(self, organization_unit: str) -> Dict[str, Any]:
        """Gather corporate data for document variables"""
        
        # Simulate corporate data gathering
        corporate_data = {
            "company_name": "IntegridAI Corporation S.A.",
            "company_address": "Av. Corrientes 1234, Buenos Aires, Argentina",
            "company_tax_id": "30-12345678-9",
            "company_phone": "+54 11 1234-5678",
            "company_email": "info@integridai.com",
            "organization_unit": organization_unit,
            "legal_representative": "Dr. Juan Pérez",
            "compliance_officer": "Dra. María González",
            "company_registration": "IGS-2024-001"
        }
        
        return corporate_data
    
    async def _gather_legal_clauses(self, request: DocumentRequest,
                                  template: DocumentTemplate) -> Dict[str, Any]:
        """Gather appropriate legal clauses for document"""
        
        clauses = {}
        
        # Jurisdiction-specific clauses
        if request.jurisdiction == Jurisdiction.ARGENTINA:
            clauses.update({
                "jurisdiction_clause": "Este documento se rige por las leyes de la República Argentina.",
                "dispute_resolution": "Cualquier controversia será resuelta por los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.",
                "data_protection_clause": "Cumpliendo con la Ley de Protección de Datos Personales N° 25.326.",
                "anti_corruption_clause": "En cumplimiento de la Ley de Responsabilidad Penal Empresaria N° 27.401."
            })
        
        elif request.jurisdiction == Jurisdiction.EUROPEAN_UNION:
            clauses.update({
                "jurisdiction_clause": "This document is governed by European Union law.",
                "gdpr_clause": "In compliance with General Data Protection Regulation (EU) 2016/679.",
                "ai_act_clause": "In accordance with the European Union Artificial Intelligence Act."
            })
        
        # Document type-specific clauses
        if request.document_type == DocumentType.THIRD_PARTY_AGREEMENT:
            clauses.update({
                "due_diligence_clause": """
                CLÁUSULA DE DEBIDA DILIGENCIA: El proveedor declara y garantiza que:
                a) No está incluido en listas de sanciones internacionales
                b) Cumple con las normativas anticorrupción aplicables
                c) Mantiene un programa de cumplimiento efectivo
                """,
                "compliance_monitoring": """
                MONITOREO DE CUMPLIMIENTO: IntegridAI se reserva el derecho de
                monitorear el cumplimiento de las obligaciones contractuales y
                normativas por parte del proveedor.
                """
            })
        
        return clauses
    
    async def _gather_compliance_variables(self, request: DocumentRequest,
                                         template: DocumentTemplate) -> Dict[str, Any]:
        """Gather compliance-specific variables"""
        
        compliance_vars = {}
        
        # Add compliance framework references
        for framework in template.compliance_frameworks:
            if framework == "ley_27401":
                compliance_vars.update({
                    "ley_27401_reference": "Ley N° 27.401 de Responsabilidad Penal Empresaria",
                    "ley_27401_article": "Artículo 23 - Programa de Integridad",
                    "compliance_program_elements": [
                        "Código de ética o conducta",
                        "Reglas y procedimientos específicos",
                        "Capacitación periódica",
                        "Sistema de denuncias",
                        "Evaluación de riesgos",
                        "Monitoreo y auditoría"
                    ]
                })
            
            elif framework == "eu_ai_act":
                compliance_vars.update({
                    "eu_ai_act_reference": "Regulation (EU) 2024/1689 on Artificial Intelligence",
                    "ai_risk_assessment": "High-risk AI system assessment completed",
                    "human_oversight_required": "Yes - continuous human supervision"
                })
        
        return compliance_vars
    
    def _post_process_content(self, content: str, template: DocumentTemplate,
                            variables: Dict[str, Any]) -> str:
        """Post-process generated content"""
        
        # Clean up excessive whitespace
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        # Add legal disclaimers
        if template.legal_disclaimers:
            disclaimer_section = "\n\n---\n\nDISCLAIMERS:\n"
            for disclaimer in template.legal_disclaimers:
                disclaimer_section += f"• {disclaimer}\n"
            content += disclaimer_section
        
        # Add generation metadata
        metadata_section = f"""
        
---

METADATA DEL DOCUMENTO:
- Generado automáticamente por: {self.agent_name} v{self.version}
- Fecha de generación: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
- Template utilizada: {template.template_name} v{template.version}
- Jurisdicción: {template.jurisdiction.value}
- Idioma: {template.language.value}
        """
        
        content += metadata_section
        
        return content.strip()
    
    async def _initiate_approval_workflow(self, document: GeneratedDocument):
        """Initiate approval workflow for document"""
        
        workflow = self.approval_workflows.get(
            document.request.document_type,
            [ApprovalLevel.MANAGER_REVIEW, ApprovalLevel.LEGAL_REVIEW]
        )
        
        # Send notification to first approver
        first_approver = workflow[0] if workflow else ApprovalLevel.MANAGER_REVIEW
        
        await self._send_approval_notification(document, first_approver)
        
        self.logger.info({
            "action": "approval_workflow_initiated",
            "document_id": document.document_id,
            "workflow_steps": [step.value for step in workflow],
            "first_approver": first_approver.value,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def _send_approval_notification(self, document: GeneratedDocument,
                                        approval_level: ApprovalLevel):
        """Send approval notification to stakeholders"""
        
        # Simulate sending notification
        notification_data = {
            "document_id": document.document_id,
            "document_type": document.request.document_type.value,
            "approval_level": approval_level.value,
            "requested_by": document.request.requested_by,
            "urgency": document.request.urgency_level,
            "generated_at": document.created_at.isoformat()
        }
        
        self.logger.info({
            "action": "approval_notification_sent",
            "notification_data": notification_data,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    # Utility and initialization methods
    
    def _load_document_templates(self) -> List[DocumentTemplate]:
        """Load document templates from configuration"""
        
        templates = []
        
        # Anti-corruption policy template (Argentina)
        templates.append(DocumentTemplate(
            template_id="TPL-ACR-AR-001",
            document_type=DocumentType.COMPLIANCE_POLICY,
            jurisdiction=Jurisdiction.ARGENTINA,
            language=DocumentLanguage.SPANISH,
            template_name="Política Anticorrupción Ley 27.401",
            description="Política anticorrupción conforme a Ley 27.401",
            version="2.1",
            template_content="""
POLÍTICA ANTICORRUPCIÓN
{{company_name}}

1. OBJETIVO Y ALCANCE
Esta política establece los lineamientos para prevenir actos de corrupción en cumplimiento
de la {{ley_27401_reference}}, {{ley_27401_article}}.

2. DEFINICIONES
- Corrupción: Todo acto que implique ofrecer, prometer, dar o recibir pagos indebidos
- Facilitación: Pagos menores para acelerar trámites rutinarios
- Conflicto de intereses: Situación donde intereses personales interfieren con los corporativos

3. PROHIBICIONES
{{company_name}} prohíbe estrictamente:
a) Pagos de facilitación o sobornos
b) Regalos inapropiados a funcionarios públicos
c) Contribuciones políticas no autorizadas
d) Uso de intermediarios para actos prohibidos

4. PROGRAMA DE INTEGRIDAD
Conforme al Art. 23 de la Ley 27.401, implementamos:
{% for element in compliance_program_elements %}
- {{element}}
{% endfor %}

5. DEBIDA DILIGENCIA
{{due_diligence_clause}}

6. MONITOREO Y AUDITORÍA
{{compliance_monitoring}}

7. SANCIONES
Las violaciones a esta política resultarán en medidas disciplinarias hasta el despido
y podrán ser reportadas a autoridades competentes.

{{jurisdiction_clause}}
{{anti_corruption_clause}}

Aprobado por: {{legal_representative}}
Cargo: Representante Legal
Fecha: {{generation_date}}
            """,
            required_variables=[
                "company_name", "legal_representative", "generation_date"
            ],
            optional_variables=[
                "company_address", "compliance_officer"
            ],
            compliance_frameworks=["ley_27401"],
            approval_workflow=[
                ApprovalLevel.LEGAL_REVIEW,
                ApprovalLevel.COMPLIANCE_REVIEW,
                ApprovalLevel.EXECUTIVE_APPROVAL
            ],
            legal_disclaimers=[
                "Esta política debe ser revisada por asesoría legal calificada",
                "Debe adaptarse a las particularidades de cada organización"
            ],
            created_by="IntegridAI Legal Team",
            created_at=datetime(2024, 1, 15),
            last_modified=datetime.utcnow(),
            is_active=True
        ))
        
        # Due diligence report template
        templates.append(DocumentTemplate(
            template_id="TPL-DD-AR-001",
            document_type=DocumentType.DUE_DILIGENCE_REPORT,
            jurisdiction=Jurisdiction.ARGENTINA,
            language=DocumentLanguage.SPANISH,
            template_name="Reporte Due Diligence Terceros",
            description="Reporte de due diligence para terceros",
            version="1.5",
            template_content="""
REPORTE DE DEBIDA DILIGENCIA
{{company_name}}

INFORMACIÓN DEL TERCERO:
- Nombre/Razón Social: {{third_party_name}}
- CUIT/Documento: {{third_party_tax_id}}
- Domicilio: {{third_party_address}}
- Actividad: {{business_activity}}
- País de origen: {{country_of_origin}}

EVALUACIÓN DE RIESGO:
- Nivel de riesgo: {{risk_level}}
- Score de compliance: {{compliance_score}}
- Jurisdicción de riesgo: {{risk_jurisdiction}}

VERIFICACIONES REALIZADAS:
✓ Consulta listas OFAC: {{ofac_check_result}}
✓ Consulta sanciones UE: {{eu_sanctions_check}}
✓ Consulta BCRA: {{bcra_check_result}}
✓ Verificación PEP: {{pep_check_result}}
✓ Medios adversos: {{adverse_media_check}}

DOCUMENTACIÓN REVISADA:
- Estatuto social: {{estatuto_reviewed}}
- Estados financieros: {{financial_statements_reviewed}}
- Certificados vigentes: {{certificates_reviewed}}
- Referencias comerciales: {{commercial_references}}

CONCLUSIÓN Y RECOMENDACIÓN:
{{conclusion_text}}

APROBACIÓN PARA RELACIÓN COMERCIAL: {{approval_recommendation}}

Elaborado por: {{analyst_name}}
Fecha: {{generation_date}}
Revisado por: {{compliance_officer}}
            """,
            required_variables=[
                "third_party_name", "third_party_tax_id", "risk_level"
            ],
            optional_variables=[
                "business_activity", "country_of_origin", "compliance_score"
            ],
            compliance_frameworks=["ley_27401"],
            approval_workflow=[
                ApprovalLevel.MANAGER_REVIEW,
                ApprovalLevel.COMPLIANCE_REVIEW
            ],
            legal_disclaimers=[
                "Este reporte debe ser actualizado periódicamente",
                "La relación comercial requiere monitoreo continuo"
            ],
            created_by="IntegridAI Compliance Team",
            created_at=datetime(2024, 1, 20),
            last_modified=datetime.utcnow(),
            is_active=True
        ))
        
        return templates
    
    def _define_approval_workflows(self) -> Dict[DocumentType, List[ApprovalLevel]]:
        """Define approval workflows by document type"""
        
        return {
            DocumentType.COMPLIANCE_POLICY: [
                ApprovalLevel.MANAGER_REVIEW,
                ApprovalLevel.LEGAL_REVIEW,
                ApprovalLevel.COMPLIANCE_REVIEW,
                ApprovalLevel.EXECUTIVE_APPROVAL
            ],
            DocumentType.DUE_DILIGENCE_REPORT: [
                ApprovalLevel.MANAGER_REVIEW,
                ApprovalLevel.COMPLIANCE_REVIEW
            ],
            DocumentType.THIRD_PARTY_AGREEMENT: [
                ApprovalLevel.LEGAL_REVIEW,
                ApprovalLevel.COMPLIANCE_REVIEW,
                ApprovalLevel.EXECUTIVE_APPROVAL
            ],
            DocumentType.RISK_ASSESSMENT: [
                ApprovalLevel.MANAGER_REVIEW,
                ApprovalLevel.COMPLIANCE_REVIEW
            ],
            DocumentType.REGULATORY_FILING: [
                ApprovalLevel.LEGAL_REVIEW,
                ApprovalLevel.EXECUTIVE_APPROVAL
            ]
        }
    
    def _load_ley_27401_rules(self) -> Dict[str, Any]:
        """Load Ley 27.401 compliance rules"""
        
        return {
            "required_clauses": [
                "código de ética",
                "canal de denuncias",
                "capacitación",
                "due diligence",
                "monitoreo",
                "evaluación de riesgos"
            ],
            "prohibited_terms": [
                "pago de facilitación permitido",
                "soborno aceptable",
                "corrupción menor"
            ],
            "article_23_requirements": [
                "Designar un responsable del programa",
                "Elaborar un mapa de riesgos",
                "Diseñar reglas y procedimientos",
                "Realizar capacitaciones periódicas",
                "Establecer canales de denuncia",
                "Implementar un sistema de monitoreo"
            ]
        }
    
    def _load_eu_ai_act_rules(self) -> Dict[str, Any]:
        """Load EU AI Act compliance rules"""
        
        return {
            "required_clauses": [
                "risk assessment",
                "human oversight",
                "transparency",
                "accuracy monitoring",
                "data governance"
            ],
            "prohibited_terms": [
                "fully autonomous",
                "no human control",
                "unrestricted ai"
            ],
            "high_risk_requirements": [
                "Conformity assessment",
                "Risk management system",
                "Data governance measures",
                "Transparency obligations",
                "Human oversight requirements"
            ]
        }
    
    def _load_nist_ai_rmf_rules(self) -> Dict[str, Any]:
        """Load NIST AI RMF compliance rules"""
        
        return {
            "required_clauses": [
                "risk management",
                "governance framework",
                "measurement procedures",
                "monitoring system"
            ],
            "core_functions": ["GOVERN", "MAP", "MEASURE", "MANAGE"]
        }
    
    def _load_gdpr_rules(self) -> Dict[str, Any]:
        """Load GDPR compliance rules"""
        
        return {
            "required_clauses": [
                "data protection",
                "consent",
                "data subject rights",
                "privacy by design",
                "data retention"
            ],
            "prohibited_terms": [
                "permanent data storage",
                "unlimited data use",
                "no deletion rights"
            ]
        }
    
    def _load_validation_rules(self) -> Dict[str, Any]:
        """Load document validation rules"""
        
        return {
            "min_content_length": 500,
            "max_content_length": 50000,
            "required_sections": ["objective", "scope", "responsibilities"],
            "date_format": r"\d{4}-\d{2}-\d{2}",
            "signature_required": True
        }
    
    def _load_clause_libraries(self) -> Dict[str, Dict[str, str]]:
        """Load legal clause libraries"""
        
        return {
            "argentina": {
                "jurisdiction": "Este documento se rige por las leyes de la República Argentina.",
                "disputes": "Cualquier controversia será resuelta por los Tribunales de la Ciudad de Buenos Aires.",
                "data_protection": "En cumplimiento de la Ley 25.326 de Protección de Datos Personales."
            },
            "eu": {
                "jurisdiction": "This document is governed by European Union law.",
                "disputes": "Disputes shall be resolved by the competent courts of [Member State].",
                "data_protection": "In compliance with GDPR (EU) 2016/679."
            }
        }
    
    def _create_document_metadata(self, request: DocumentRequest, 
                                template: DocumentTemplate,
                                variables: Dict[str, Any]) -> Dict[str, Any]:
        """Create document metadata"""
        
        return {
            "document_type": request.document_type.value,
            "template_id": template.template_id,
            "template_version": template.version,
            "jurisdiction": request.jurisdiction.value,
            "language": request.language.value,
            "generated_by": self.agent_id,
            "requested_by": request.requested_by,
            "organization_unit": request.organization_unit,
            "variables_count": len(variables),
            "compliance_frameworks": template.compliance_frameworks,
            "approval_required": request.approval_required,
            "urgency_level": request.urgency_level,
            "delivery_formats": request.delivery_format
        }
    
    def _calculate_expiration_date(self, request: DocumentRequest,
                                 template: DocumentTemplate) -> Optional[datetime]:
        """Calculate document expiration date"""
        
        # Different document types have different validity periods
        validity_periods = {
            DocumentType.COMPLIANCE_POLICY: 365,      # 1 year
            DocumentType.DUE_DILIGENCE_REPORT: 180,   # 6 months
            DocumentType.RISK_ASSESSMENT: 90,         # 3 months
            DocumentType.TRAINING_MATERIAL: 365,      # 1 year
            DocumentType.PRIVACY_NOTICE: 730          # 2 years
        }
        
        days = validity_periods.get(request.document_type, 365)
        return datetime.utcnow() + timedelta(days=days)
    
    async def _generate_digital_signature(self, content: str, 
                                        document_hash: str) -> str:
        """Generate digital signature for document"""
        
        # In production: use proper cryptographic signing
        signature_data = f"{self.agent_id}:{document_hash}:{datetime.utcnow().isoformat()}"
        return hashlib.sha256(signature_data.encode()).hexdigest()
    
    def _generate_document_id(self, request: DocumentRequest) -> str:
        """Generate unique document ID"""
        
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        doc_type_code = request.document_type.value[:3].upper()
        jurisdiction_code = request.jurisdiction.value
        
        unique_part = hashlib.sha256(
            f"{request.request_id}:{timestamp}".encode()
        ).hexdigest()[:8]
        
        return f"DOC-{doc_type_code}-{jurisdiction_code}-{timestamp}-{unique_part}"
    
    def _generate_document_hash(self, content: str, metadata: Dict[str, Any]) -> str:
        """Generate document hash for integrity verification"""
        
        hash_data = f"{content}:{json.dumps(metadata, sort_keys=True)}"
        return hashlib.sha256(hash_data.encode()).hexdigest()
    
    def _create_audit_trail(self, request: DocumentRequest, template: DocumentTemplate,
                          variables: Dict[str, Any], processing_time_ms: int,
                          content_length: int) -> Dict[str, Any]:
        """Create comprehensive audit trail"""
        
        return {
            "generation_method": "template_based_automatic_generation",
            "agent_version": self.version,
            "template_used": template.template_id,
            "template_version": template.version,
            "variables_processed": len(variables),
            "content_length": content_length,
            "processing_metrics": {
                "processing_time_ms": processing_time_ms,
                "memory_usage_mb": self._get_memory_usage(),
                "template_complexity": len(template.required_variables)
            },
            "compliance_frameworks": template.compliance_frameworks,
            "regulatory_requirements": {
                "document_classification": "Legal/Compliance Document",
                "retention_period_years": 7,
                "approval_required": request.approval_required,
                "digital_signature": self.config.get("enable_digital_signatures", False)
            }
        }
    
    def _log_generation_completion(self, document: GeneratedDocument):
        """Log document generation completion"""
        
        self.logger.info({
            "action": "document_generated",
            "agent_id": self.agent_id,
            "document_id": document.document_id,
            "request_id": document.request.request_id,
            "document_type": document.request.document_type.value,
            "template_used": document.template_used.template_id,
            "approval_status": document.approval_status.value,
            "processing_time_ms": document.processing_time_ms,
            "content_length": len(document.generated_content),
            "compliance_validation": bool(document.compliance_validation_results),
            "timestamp": datetime.utcnow().isoformat(),
            "compliance_tags": ["legal_document", "automated_generation", "audit_logged"]
        })
    
    def _update_performance_metrics(self, document: GeneratedDocument):
        """Update agent performance metrics"""
        
        self.performance_metrics["documents_generated"] += 1
        
        # Track template usage
        template_id = document.template_used.template_id
        if template_id not in self.performance_metrics["templates_used"]:
            self.performance_metrics["templates_used"][template_id] = 0
        self.performance_metrics["templates_used"][template_id] += 1
        
        # Update average generation time
        docs_count = self.performance_metrics["documents_generated"]
        current_avg = self.performance_metrics["average_generation_time"]
        new_avg = ((current_avg * (docs_count - 1)) + document.processing_time_ms) / docs_count
        self.performance_metrics["average_generation_time"] = new_avg
        
        # Log metrics periodically
        if docs_count % 25 == 0:
            self.logger.info({
                "action": "agent_performance_metrics",
                "agent_id": self.agent_id,
                "metrics": self.performance_metrics,
                "timestamp": datetime.utcnow().isoformat()
            })
    
    def _setup_secure_logger(self) -> logging.Logger:
        """Setup secure logger for legal document generation audit trails"""
        
        logger = logging.getLogger(f"IntegridAI.LDG.{self.agent_id}")
        logger.setLevel(logging.INFO)
        
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        return logger
    
    def _get_memory_usage(self) -> int:
        """Get current memory usage in MB"""
        # In production: use psutil
        return 384  # Simulated memory usage
    
    # Data source initialization methods
    
    def _init_corporate_db_source(self) -> Dict:
        """Initialize corporate database source"""
        return {
            "name": "CORPORATE_DATABASE",
            "endpoint": self.config.get("corporate_db_endpoint", "https://corporate.company.com/api"),
            "api_key": self.config.get("corporate_db_api_key", "demo-corp-key"),
            "timeout": 15
        }
    
    def _init_legal_db_source(self) -> Dict:
        """Initialize legal database source"""
        return {
            "name": "LEGAL_DATABASE",
            "endpoint": self.config.get("legal_db_endpoint", "https://legal.company.com/api"),
            "api_key": self.config.get("legal_db_api_key", "demo-legal-key"),
            "timeout": 20
        }
    
    def _init_regulatory_feeds_source(self) -> Dict:
        """Initialize regulatory feeds source"""
        return {
            "name": "REGULATORY_FEEDS",
            "endpoint": self.config.get("regulatory_endpoint", "https://regulatory.feeds.com/api"),
            "api_key": self.config.get("regulatory_api_key", "demo-reg-key"),
            "timeout": 30
        }
    
    def _init_template_repository_source(self) -> Dict:
        """Initialize template repository source"""
        return {
            "name": "TEMPLATE_REPOSITORY",
            "endpoint": self.config.get("template_repo_endpoint", "https://templates.company.com/api"),
            "api_key": self.config.get("template_repo_api_key", "demo-template-key"),
            "timeout": 10
        }
    
    def _init_approval_system_source(self) -> Dict:
        """Initialize approval system source"""
        return {
            "name": "APPROVAL_SYSTEM",
            "endpoint": self.config.get("approval_endpoint", "https://approvals.company.com/api"),
            "api_key": self.config.get("approval_api_key", "demo-approval-key"),
            "timeout": 25
        }


# Health check for Kubernetes deployment
class LDGHealthCheck:
    """Health check endpoints for LDG agent"""
    
    def __init__(self, ldg_agent: LegalDocumentGenerator):
        self.agent = ldg_agent
    
    def health_check(self) -> Dict[str, Any]:
        """Basic health check"""
        return {
            "status": "healthy",
            "agent_id": self.agent.agent_id,
            "version": self.agent.version,
            "templates_loaded": len(self.agent.templates),
            "frameworks_supported": len(self.agent.compliance_frameworks),
            "jinja2_available": JINJA2_AVAILABLE,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def readiness_check(self) -> Dict[str, Any]:
        """Readiness check for Kubernetes"""
        
        # Check template availability
        active_templates = sum(1 for t in self.agent.templates if t.is_active)
        
        # Check data sources
        sources_ready = len(self.agent.data_sources) > 0
        
        return {
            "status": "ready" if sources_ready and active_templates > 0 else "not_ready",
            "agent_id": self.agent.agent_id,
            "active_templates": active_templates,
            "data_sources_configured": len(self.agent.data_sources),
            "template_engine": "jinja2" if JINJA2_AVAILABLE else "basic",
            "timestamp": datetime.utcnow().isoformat()
        }


# Example usage
if __name__ == "__main__":
    
    # Configuration
    config = {
        "templates_directory": "./templates",
        "corporate_db_endpoint": "https://corporate.company.com/api",
        "legal_db_endpoint": "https://legal.company.com/api",
        "enable_digital_signatures": True,
        "approval_notifications": True
    }
    
    # Initialize LDG agent
    ldg = LegalDocumentGenerator(config)
    
    # Example document request
    test_request = DocumentRequest(
        request_id="REQ-20240118-001",
        document_type=DocumentType.COMPLIANCE_POLICY,
        jurisdiction=Jurisdiction.ARGENTINA,
        language=DocumentLanguage.SPANISH,
        requested_by="compliance@company.com",
        organization_unit="Corporate Compliance",
        variables={
            "company_name": "IntegridAI Corporation S.A.",
            "legal_representative": "Dr. Juan Carlos Pérez",
            "compliance_officer": "Dra. María Elena González"
        },
        template_preferences=None,
        urgency_level="normal",
        delivery_format=["pdf", "html"],
        approval_required=True,
        compliance_validation=True,
        created_at=datetime.utcnow()
    )
    
    # Generate document
    async def run_demo():
        print("📄 Starting Legal Document Generation...")
        print(f"📋 Agent: {ldg.agent_name} v{ldg.version}")
        print(f"📑 Document Type: {test_request.document_type.value}")
        print(f"🌍 Jurisdiction: {test_request.jurisdiction.value}")
        print(f"🗣️  Language: {test_request.language.value}")
        print("=" * 70)
        
        try:
            document = await ldg.generate_document(test_request)
            
            print(f"✅ Document generated successfully!")
            print(f"📄 Document ID: {document.document_id}")
            print(f"📋 Template Used: {document.template_used.template_name}")
            print(f"📊 Approval Status: {document.approval_status.value}")
            print(f"⏱️  Processing Time: {document.processing_time_ms}ms")
            print(f"📐 Content Length: {len(document.generated_content):,} characters")
            print(f"🔒 Document Hash: {document.document_hash[:16]}...")
            
            if document.compliance_validation_results:
                print(f"\n🛡️  Compliance Validation:")
                for framework, result in document.compliance_validation_results.items():
                    status_icon = "✅" if result["status"] == "compliant" else "⚠️"
                    print(f"  {status_icon} {framework.upper()}: {result['status']} (Score: {result['compliance_score']:.1%})")
                    
                    if result["issues_found"]:
                        print(f"    Issues found: {len(result['issues_found'])}")
                        for issue in result["issues_found"][:2]:  # Show first 2 issues
                            print(f"      - {issue['description']}")
            
            if document.expiration_date:
                print(f"\n📅 Document Expiration: {document.expiration_date.strftime('%Y-%m-%d')}")
            
            print(f"\n📋 Approval Workflow:")
            for step in document.template_used.approval_workflow:
                status = "✅ Completed" if step == ApprovalLevel.DRAFT else "⏳ Pending"
                print(f"  {status} {step.value}")
            
            # Show first 500 characters of generated content
            print(f"\n📄 Generated Content (preview):")
            print("─" * 60)
            print(document.generated_content[:500] + "..." if len(document.generated_content) > 500 else document.generated_content)
            print("─" * 60)
            
            print("\n" + "=" * 70)
            print("📄 IntegridAI Legal Document Generator - Compliance Ready")
            
        except Exception as e:
            print(f"❌ Document generation failed: {e}")
    
    # Run the demo
    asyncio.run(run_demo())