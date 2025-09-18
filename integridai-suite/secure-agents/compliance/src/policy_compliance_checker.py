#!/usr/bin/env python3
"""
Policy Compliance Checker (PCC) Agent
=====================================

Verificación automática y continua de cumplimiento de políticas internas corporativas
con capacidades de monitoreo en tiempo real y alertas proactivas.

Features:
- Continuous policy compliance monitoring
- Real-time document analysis
- Automated policy validation
- SharePoint/Document Management integration
- Ley 27.401 compliance framework alignment
- Immutable audit trails
- Escalation and alerting system
- Policy drift detection

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
from typing import Dict, List, Optional, Tuple, Any, Set
from pathlib import Path
import xml.etree.ElementTree as ET

# Configuration for fallback mode
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

try:
    from dateutil.parser import parse as parse_date
    DATEUTIL_AVAILABLE = True
except ImportError:
    DATEUTIL_AVAILABLE = False


class PolicyType(Enum):
    """Types of corporate policies"""
    ANTI_CORRUPTION = "anti_corruption"
    CODE_OF_CONDUCT = "code_of_conduct"
    DATA_PRIVACY = "data_privacy"
    CONFLICT_OF_INTEREST = "conflict_of_interest"
    PROCUREMENT = "procurement"
    FINANCIAL_CONTROLS = "financial_controls"
    HR_POLICIES = "hr_policies"
    INFORMATION_SECURITY = "information_security"
    ENVIRONMENTAL = "environmental"
    REGULATORY_COMPLIANCE = "regulatory_compliance"


class ComplianceStatus(Enum):
    """Policy compliance status levels"""
    FULLY_COMPLIANT = "FULLY_COMPLIANT"
    PARTIALLY_COMPLIANT = "PARTIALLY_COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class AlertSeverity(Enum):
    """Alert severity levels for compliance violations"""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


@dataclass
class PolicyRule:
    """Individual policy rule definition"""
    rule_id: str
    policy_type: PolicyType
    rule_name: str
    description: str
    requirement_text: str
    mandatory: bool
    validation_criteria: Dict[str, Any]
    applicable_roles: List[str]
    effective_date: datetime
    review_frequency_days: int
    regulatory_basis: Optional[str]
    created_at: datetime
    updated_at: datetime


@dataclass
class ComplianceDocument:
    """Document to be checked for compliance"""
    document_id: str
    document_name: str
    document_type: str
    content_hash: str
    file_path: str
    created_by: str
    created_at: datetime
    last_modified: datetime
    access_level: str
    department: str
    related_policies: List[str]
    metadata: Dict[str, Any]


@dataclass
class PolicyViolation:
    """Identified policy violation"""
    violation_id: str
    rule_id: str
    document_id: str
    violation_type: str
    severity: AlertSeverity
    description: str
    evidence_text: str
    confidence_score: float
    risk_assessment: str
    remediation_suggestions: List[str]
    requires_human_review: bool
    regulatory_impact: bool
    detected_at: datetime


@dataclass
class ComplianceAssessment:
    """Complete compliance assessment result"""
    assessment_id: str
    document: ComplianceDocument
    total_rules_checked: int
    compliant_rules: int
    violations_found: int
    overall_status: ComplianceStatus
    compliance_score: float
    violations: List[PolicyViolation]
    recommendations: List[str]
    next_review_date: datetime
    processing_time_ms: int
    data_sources_used: List[str]
    audit_trail: Dict[str, Any]
    created_at: datetime


class PolicyComplianceChecker:
    """
    Policy Compliance Checker Agent
    
    Realiza verificación automática continua de cumplimiento de políticas
    corporativas con monitoreo en tiempo real y alertas proactivas.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize PCC agent with secure configuration
        
        Args:
            config: Configuration dictionary with policy rules, endpoints, etc.
        """
        self.agent_id = "PCC-001"
        self.agent_name = "Policy Compliance Checker"
        self.version = "v2.1.3"
        self.config = config
        
        # Setup logging
        self.logger = self._setup_secure_logger()
        
        # Initialize policy rules database
        self.policy_rules = self._load_policy_rules()
        
        # Initialize document sources
        self.document_sources = {
            "sharepoint": self._init_sharepoint_source(),
            "document_management": self._init_document_mgmt_source(),
            "file_system": self._init_filesystem_source(),
            "email_system": self._init_email_source(),
            "contracts_db": self._init_contracts_source()
        }
        
        # Compliance frameworks
        self.compliance_frameworks = [
            "ley_27401_art23",
            "eu_ai_act_governance",
            "nist_ai_rmf_govern"
        ]
        
        # NLP patterns for compliance checking
        self.violation_patterns = self._init_violation_patterns()
        
        # Resource limits
        self.resource_limits = {
            "max_concurrent_documents": 50,
            "max_document_size_mb": 10,
            "max_processing_time_s": 60,
            "max_memory_usage_mb": 2048
        }
        
        # Monitoring metrics
        self.metrics = {
            "documents_processed": 0,
            "violations_detected": 0,
            "alerts_sent": 0,
            "false_positives": 0,
            "last_reset": datetime.utcnow()
        }
        
        self.logger.info({
            "action": "agent_initialized",
            "agent_id": self.agent_id,
            "version": self.version,
            "total_policy_rules": len(self.policy_rules),
            "compliance_frameworks": self.compliance_frameworks,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def check_document_compliance(self, document: ComplianceDocument) -> ComplianceAssessment:
        """
        Perform comprehensive compliance check on document
        
        Args:
            document: Document to analyze for policy compliance
            
        Returns:
            ComplianceAssessment with detailed compliance analysis
        """
        start_time = time.time()
        
        assessment_id = self._generate_assessment_id(document)
        
        self.logger.info({
            "action": "compliance_check_started",
            "agent_id": self.agent_id,
            "document_id": document.document_id,
            "document_name": document.document_name,
            "assessment_id": assessment_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        try:
            # Get document content
            document_content = await self._extract_document_content(document)
            
            # Get applicable policy rules
            applicable_rules = self._get_applicable_rules(document)
            
            # Parallel compliance checking
            check_tasks = []
            for rule in applicable_rules:
                task = self._check_rule_compliance(document, document_content, rule)
                check_tasks.append(task)
            
            # Execute all checks
            check_results = await asyncio.gather(*check_tasks, return_exceptions=True)
            
            # Process results
            violations = []
            compliant_rules = 0
            
            for i, result in enumerate(check_results):
                if isinstance(result, Exception):
                    self.logger.warning(f"Rule check failed for rule {applicable_rules[i].rule_id}: {result}")
                    continue
                
                is_compliant, violation = result
                if is_compliant:
                    compliant_rules += 1
                elif violation:
                    violations.append(violation)
            
            # Calculate overall compliance
            total_rules = len(applicable_rules)
            compliance_score = compliant_rules / total_rules if total_rules > 0 else 1.0
            overall_status = self._determine_overall_status(compliance_score, violations)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(document, violations, compliance_score)
            
            # Calculate next review date
            next_review_date = self._calculate_next_review_date(document, violations)
            
            # Processing metrics
            processing_time_ms = int((time.time() - start_time) * 1000)
            
            # Create audit trail
            audit_trail = self._create_audit_trail(
                document, applicable_rules, violations, 
                compliance_score, processing_time_ms
            )
            
            # Build assessment result
            assessment = ComplianceAssessment(
                assessment_id=assessment_id,
                document=document,
                total_rules_checked=total_rules,
                compliant_rules=compliant_rules,
                violations_found=len(violations),
                overall_status=overall_status,
                compliance_score=compliance_score,
                violations=violations,
                recommendations=recommendations,
                next_review_date=next_review_date,
                processing_time_ms=processing_time_ms,
                data_sources_used=list(self.document_sources.keys()),
                audit_trail=audit_trail,
                created_at=datetime.utcnow()
            )
            
            # Log completion and update metrics
            self._log_assessment_completion(assessment)
            self._update_metrics(assessment)
            
            # Send alerts if violations found
            if violations:
                await self._send_compliance_alerts(assessment)
            
            return assessment
            
        except Exception as e:
            error_msg = f"Compliance check failed for document {document.document_id}: {str(e)}"
            self.logger.error({
                "action": "compliance_check_error",
                "agent_id": self.agent_id,
                "document_id": document.document_id,
                "error": str(e),
                "assessment_id": assessment_id,
                "timestamp": datetime.utcnow().isoformat()
            })
            raise RuntimeError(error_msg) from e
    
    async def continuous_monitoring(self, monitoring_config: Dict[str, Any]) -> None:
        """
        Start continuous policy compliance monitoring
        
        Args:
            monitoring_config: Configuration for continuous monitoring
        """
        
        self.logger.info({
            "action": "continuous_monitoring_started",
            "agent_id": self.agent_id,
            "monitoring_sources": list(self.document_sources.keys()),
            "check_interval_minutes": monitoring_config.get("check_interval_minutes", 15),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        check_interval = monitoring_config.get("check_interval_minutes", 15) * 60  # Convert to seconds
        
        while True:
            try:
                # Discover new/modified documents
                documents_to_check = await self._discover_documents_for_monitoring()
                
                self.logger.info({
                    "action": "monitoring_cycle_started",
                    "documents_discovered": len(documents_to_check),
                    "timestamp": datetime.utcnow().isoformat()
                })
                
                # Process documents in batches
                batch_size = monitoring_config.get("batch_size", 10)
                for i in range(0, len(documents_to_check), batch_size):
                    batch = documents_to_check[i:i + batch_size]
                    
                    # Process batch concurrently
                    batch_tasks = [self.check_document_compliance(doc) for doc in batch]
                    batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
                    
                    # Log batch completion
                    successful_checks = sum(1 for r in batch_results if not isinstance(r, Exception))
                    failed_checks = len(batch_results) - successful_checks
                    
                    self.logger.info({
                        "action": "monitoring_batch_completed",
                        "batch_size": len(batch),
                        "successful_checks": successful_checks,
                        "failed_checks": failed_checks,
                        "timestamp": datetime.utcnow().isoformat()
                    })
                
                # Wait before next monitoring cycle
                await asyncio.sleep(check_interval)
                
            except Exception as e:
                self.logger.error({
                    "action": "monitoring_cycle_error",
                    "error": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                })
                
                # Wait shorter interval on error
                await asyncio.sleep(60)  # 1 minute error recovery interval
    
    async def _extract_document_content(self, document: ComplianceDocument) -> str:
        """Extract text content from document"""
        
        try:
            # Simulate document content extraction
            # In production: use appropriate document parsers (PDF, Word, etc.)
            
            file_path = Path(document.file_path)
            
            if file_path.suffix.lower() == '.txt':
                # Plain text file
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            
            elif file_path.suffix.lower() in ['.pdf']:
                # PDF file (simulated)
                return f"Simulated PDF content for {document.document_name}"
            
            elif file_path.suffix.lower() in ['.docx', '.doc']:
                # Word document (simulated)
                return f"Simulated Word document content for {document.document_name}"
            
            else:
                # Unknown file type
                return f"Binary content - type: {file_path.suffix}"
                
        except Exception as e:
            self.logger.warning(f"Failed to extract content from {document.file_path}: {e}")
            return ""
    
    def _get_applicable_rules(self, document: ComplianceDocument) -> List[PolicyRule]:
        """Get policy rules applicable to document"""
        
        applicable_rules = []
        
        for rule in self.policy_rules:
            # Check if rule applies based on document type, department, etc.
            if self._rule_applies_to_document(rule, document):
                applicable_rules.append(rule)
        
        return applicable_rules
    
    def _rule_applies_to_document(self, rule: PolicyRule, document: ComplianceDocument) -> bool:
        """Check if policy rule applies to specific document"""
        
        # Check document type relevance
        if rule.policy_type == PolicyType.PROCUREMENT and "procurement" in document.document_type.lower():
            return True
        
        if rule.policy_type == PolicyType.FINANCIAL_CONTROLS and "financial" in document.document_type.lower():
            return True
        
        if rule.policy_type == PolicyType.HR_POLICIES and "hr" in document.department.lower():
            return True
        
        # Check if document explicitly references this policy
        if rule.rule_id in document.related_policies:
            return True
        
        # Universal rules (apply to all documents)
        if rule.policy_type in [PolicyType.CODE_OF_CONDUCT, PolicyType.ANTI_CORRUPTION]:
            return True
        
        return False
    
    async def _check_rule_compliance(self, document: ComplianceDocument, 
                                   content: str, rule: PolicyRule) -> Tuple[bool, Optional[PolicyViolation]]:
        """Check compliance with specific policy rule"""
        
        # Apply rule validation criteria
        validation_results = []
        
        for criterion_name, criterion_config in rule.validation_criteria.items():
            result = await self._apply_validation_criterion(
                document, content, criterion_name, criterion_config, rule
            )
            validation_results.append(result)
        
        # Determine if rule is compliant
        is_compliant = all(validation_results)
        
        if not is_compliant:
            # Create violation record
            violation = self._create_violation_record(document, rule, content, validation_results)
            return False, violation
        
        return True, None
    
    async def _apply_validation_criterion(self, document: ComplianceDocument, content: str,
                                        criterion_name: str, criterion_config: Dict[str, Any],
                                        rule: PolicyRule) -> bool:
        """Apply specific validation criterion"""
        
        criterion_type = criterion_config.get("type", "text_pattern")
        
        if criterion_type == "text_pattern":
            # Text pattern matching
            pattern = criterion_config.get("pattern", "")
            required = criterion_config.get("required", True)
            
            if required:
                # Pattern must be present
                return bool(re.search(pattern, content, re.IGNORECASE))
            else:
                # Pattern must NOT be present
                return not bool(re.search(pattern, content, re.IGNORECASE))
        
        elif criterion_type == "prohibited_terms":
            # Check for prohibited terms
            prohibited_terms = criterion_config.get("terms", [])
            content_lower = content.lower()
            
            for term in prohibited_terms:
                if term.lower() in content_lower:
                    return False
            return True
        
        elif criterion_type == "required_clauses":
            # Check for required legal clauses
            required_clauses = criterion_config.get("clauses", [])
            content_lower = content.lower()
            
            for clause in required_clauses:
                if clause.lower() not in content_lower:
                    return False
            return True
        
        elif criterion_type == "approval_signature":
            # Check for proper approval signatures
            required_approvers = criterion_config.get("approvers", [])
            
            # Check document metadata for approvals
            approvals = document.metadata.get("approvals", [])
            approver_roles = [a.get("role", "") for a in approvals]
            
            for required_role in required_approvers:
                if required_role not in approver_roles:
                    return False
            return True
        
        elif criterion_type == "date_validity":
            # Check document date validity
            max_age_days = criterion_config.get("max_age_days", 365)
            cutoff_date = datetime.utcnow() - timedelta(days=max_age_days)
            
            return document.last_modified > cutoff_date
        
        elif criterion_type == "amount_threshold":
            # Check financial amount thresholds
            max_amount = criterion_config.get("max_amount", float('inf'))
            
            # Extract amounts from document (simplified)
            amounts = re.findall(r'\$[\d,]+(?:\.\d{2})?', content)
            
            for amount_str in amounts:
                amount = float(amount_str.replace('$', '').replace(',', ''))
                if amount > max_amount:
                    return False
            return True
        
        else:
            # Unknown criterion type - default to compliant
            self.logger.warning(f"Unknown validation criterion type: {criterion_type}")
            return True
    
    def _create_violation_record(self, document: ComplianceDocument, rule: PolicyRule,
                               content: str, validation_results: List[bool]) -> PolicyViolation:
        """Create policy violation record"""
        
        violation_id = self._generate_violation_id(document, rule)
        
        # Determine severity based on rule importance and violation type
        severity = self._determine_violation_severity(rule, validation_results)
        
        # Extract evidence text
        evidence_text = self._extract_violation_evidence(content, rule)
        
        # Calculate confidence score
        confidence_score = self._calculate_violation_confidence(rule, validation_results, evidence_text)
        
        # Generate remediation suggestions
        remediation_suggestions = self._generate_remediation_suggestions(rule, validation_results)
        
        return PolicyViolation(
            violation_id=violation_id,
            rule_id=rule.rule_id,
            document_id=document.document_id,
            violation_type=rule.policy_type.value,
            severity=severity,
            description=f"Policy violation: {rule.rule_name}",
            evidence_text=evidence_text,
            confidence_score=confidence_score,
            risk_assessment=self._assess_violation_risk(rule, document),
            remediation_suggestions=remediation_suggestions,
            requires_human_review=severity in [AlertSeverity.CRITICAL, AlertSeverity.HIGH],
            regulatory_impact=rule.regulatory_basis is not None,
            detected_at=datetime.utcnow()
        )
    
    def _determine_violation_severity(self, rule: PolicyRule, validation_results: List[bool]) -> AlertSeverity:
        """Determine severity of policy violation"""
        
        # Critical violations
        if rule.policy_type in [PolicyType.ANTI_CORRUPTION, PolicyType.FINANCIAL_CONTROLS]:
            if rule.mandatory:
                return AlertSeverity.CRITICAL
        
        # High severity violations
        if rule.policy_type in [PolicyType.DATA_PRIVACY, PolicyType.REGULATORY_COMPLIANCE]:
            return AlertSeverity.HIGH
        
        # Medium severity violations
        if rule.mandatory:
            return AlertSeverity.MEDIUM
        
        # Low severity violations
        return AlertSeverity.LOW
    
    def _extract_violation_evidence(self, content: str, rule: PolicyRule) -> str:
        """Extract relevant text as evidence of violation"""
        
        # Look for context around violation patterns
        evidence_snippets = []
        
        for criterion_name, criterion_config in rule.validation_criteria.items():
            if criterion_config.get("type") == "text_pattern":
                pattern = criterion_config.get("pattern", "")
                matches = re.finditer(pattern, content, re.IGNORECASE)
                
                for match in matches:
                    start = max(0, match.start() - 100)
                    end = min(len(content), match.end() + 100)
                    snippet = content[start:end].strip()
                    evidence_snippets.append(f"...{snippet}...")
        
        return " | ".join(evidence_snippets[:3])  # Limit to 3 snippets
    
    def _calculate_violation_confidence(self, rule: PolicyRule, validation_results: List[bool],
                                      evidence_text: str) -> float:
        """Calculate confidence score for violation detection"""
        
        # Base confidence based on rule clarity
        base_confidence = 0.7
        
        # Adjust based on evidence quality
        if len(evidence_text) > 50:
            base_confidence += 0.1
        
        # Adjust based on validation results consistency
        failed_validations = sum(1 for r in validation_results if not r)
        total_validations = len(validation_results)
        
        if total_validations > 0:
            failure_rate = failed_validations / total_validations
            base_confidence += failure_rate * 0.2
        
        return min(base_confidence, 0.95)  # Cap at 95%
    
    def _generate_remediation_suggestions(self, rule: PolicyRule, 
                                        validation_results: List[bool]) -> List[str]:
        """Generate actionable remediation suggestions"""
        
        suggestions = []
        
        # Generic suggestions based on policy type
        if rule.policy_type == PolicyType.ANTI_CORRUPTION:
            suggestions.extend([
                "Review document against anti-corruption policy requirements",
                "Ensure proper due diligence documentation is attached",
                "Verify all third-party relationships are properly disclosed"
            ])
        
        elif rule.policy_type == PolicyType.FINANCIAL_CONTROLS:
            suggestions.extend([
                "Obtain required financial approvals per policy thresholds",
                "Add proper cost center and budget allocation information",
                "Include supporting financial documentation"
            ])
        
        elif rule.policy_type == PolicyType.DATA_PRIVACY:
            suggestions.extend([
                "Add data privacy impact assessment",
                "Include consent documentation where required",
                "Verify data retention and deletion procedures"
            ])
        
        # Specific suggestions based on validation failures
        for i, result in enumerate(validation_results):
            if not result:
                suggestions.append(f"Address validation criterion #{i+1} per policy requirement")
        
        return suggestions[:5]  # Limit to top 5 suggestions
    
    def _assess_violation_risk(self, rule: PolicyRule, document: ComplianceDocument) -> str:
        """Assess risk level of policy violation"""
        
        risk_factors = []
        
        # Regulatory risk
        if rule.regulatory_basis:
            risk_factors.append("REGULATORY")
        
        # Financial risk
        if rule.policy_type == PolicyType.FINANCIAL_CONTROLS:
            risk_factors.append("FINANCIAL")
        
        # Reputational risk
        if rule.policy_type == PolicyType.CODE_OF_CONDUCT:
            risk_factors.append("REPUTATIONAL")
        
        # Document sensitivity
        if document.access_level in ["CONFIDENTIAL", "RESTRICTED"]:
            risk_factors.append("CONFIDENTIALITY")
        
        return ", ".join(risk_factors) if risk_factors else "OPERATIONAL"
    
    def _determine_overall_status(self, compliance_score: float, 
                                violations: List[PolicyViolation]) -> ComplianceStatus:
        """Determine overall compliance status"""
        
        # Check for critical violations
        critical_violations = [v for v in violations if v.severity == AlertSeverity.CRITICAL]
        if critical_violations:
            return ComplianceStatus.NON_COMPLIANT
        
        # Check compliance score thresholds
        if compliance_score >= 0.95:
            return ComplianceStatus.FULLY_COMPLIANT
        elif compliance_score >= 0.80:
            return ComplianceStatus.PARTIALLY_COMPLIANT
        elif compliance_score >= 0.60:
            return ComplianceStatus.REQUIRES_REVIEW
        else:
            return ComplianceStatus.NON_COMPLIANT
    
    def _generate_recommendations(self, document: ComplianceDocument, 
                                violations: List[PolicyViolation], 
                                compliance_score: float) -> List[str]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        # Recommendations based on violations
        critical_violations = [v for v in violations if v.severity == AlertSeverity.CRITICAL]
        if critical_violations:
            recommendations.extend([
                "URGENT: Address critical policy violations immediately",
                "Escalate to Chief Compliance Officer",
                "Suspend document/process until violations resolved"
            ])
        
        high_violations = [v for v in violations if v.severity == AlertSeverity.HIGH]
        if high_violations:
            recommendations.extend([
                "Address high-severity violations within 48 hours",
                "Document remediation actions taken",
                "Schedule compliance review meeting"
            ])
        
        # Recommendations based on compliance score
        if compliance_score < 0.80:
            recommendations.extend([
                "Comprehensive policy compliance review required",
                "Additional training for document authors",
                "Implement enhanced approval workflow"
            ])
        
        # Proactive recommendations
        if not violations:
            recommendations.extend([
                "Document is compliant - maintain current standards",
                "Schedule routine compliance review per policy"
            ])
        
        return recommendations[:7]  # Limit to top 7 recommendations
    
    def _calculate_next_review_date(self, document: ComplianceDocument, 
                                  violations: List[PolicyViolation]) -> datetime:
        """Calculate next compliance review date"""
        
        base_interval_days = 90  # Default 90 days
        
        # Accelerate reviews based on violations
        if any(v.severity == AlertSeverity.CRITICAL for v in violations):
            return datetime.utcnow() + timedelta(days=7)  # 1 week
        elif any(v.severity == AlertSeverity.HIGH for v in violations):
            return datetime.utcnow() + timedelta(days=30)  # 1 month
        elif violations:
            return datetime.utcnow() + timedelta(days=60)  # 2 months
        else:
            return datetime.utcnow() + timedelta(days=base_interval_days)
    
    async def _discover_documents_for_monitoring(self) -> List[ComplianceDocument]:
        """Discover documents that need compliance monitoring"""
        
        documents = []
        
        # Simulate document discovery from various sources
        # In production: integrate with SharePoint, file systems, etc.
        
        for i in range(5):  # Simulate 5 documents discovered
            doc = ComplianceDocument(
                document_id=f"DOC-{datetime.utcnow().strftime('%Y%m%d')}-{i:03d}",
                document_name=f"Policy Document {i+1}",
                document_type="policy_procedure",
                content_hash=hashlib.sha256(f"content-{i}".encode()).hexdigest(),
                file_path=f"/documents/policy_{i+1}.pdf",
                created_by=f"user{i}@company.com",
                created_at=datetime.utcnow() - timedelta(days=i),
                last_modified=datetime.utcnow() - timedelta(hours=i),
                access_level="INTERNAL",
                department="Compliance",
                related_policies=["ANTI_CORRUPTION", "CODE_OF_CONDUCT"],
                metadata={
                    "approvals": [{"role": "Manager", "date": "2024-01-15"}],
                    "version": "1.0"
                }
            )
            documents.append(doc)
        
        return documents
    
    async def _send_compliance_alerts(self, assessment: ComplianceAssessment):
        """Send compliance alerts for violations"""
        
        critical_violations = [v for v in assessment.violations if v.severity == AlertSeverity.CRITICAL]
        high_violations = [v for v in assessment.violations if v.severity == AlertSeverity.HIGH]
        
        if critical_violations:
            alert_data = {
                "alert_type": "CRITICAL_COMPLIANCE_VIOLATION",
                "document_id": assessment.document.document_id,
                "document_name": assessment.document.document_name,
                "violations_count": len(critical_violations),
                "compliance_score": assessment.compliance_score,
                "timestamp": datetime.utcnow().isoformat(),
                "requires_immediate_action": True
            }
            
            # Send to stakeholders (simulated)
            self.logger.critical({
                "action": "critical_compliance_alert",
                "alert_data": alert_data,
                "recipients": ["cco@company.com", "legal@company.com"],
                "agent_id": self.agent_id
            })
        
        elif high_violations:
            alert_data = {
                "alert_type": "HIGH_COMPLIANCE_VIOLATION", 
                "document_id": assessment.document.document_id,
                "violations_count": len(high_violations),
                "compliance_score": assessment.compliance_score,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            self.logger.warning({
                "action": "high_compliance_alert",
                "alert_data": alert_data,
                "recipients": ["compliance@company.com"],
                "agent_id": self.agent_id
            })
        
        self.metrics["alerts_sent"] += 1
    
    # Utility methods
    
    def _load_policy_rules(self) -> List[PolicyRule]:
        """Load policy rules from configuration"""
        
        # In production: load from database or configuration files
        rules = [
            PolicyRule(
                rule_id="ACR-001",
                policy_type=PolicyType.ANTI_CORRUPTION,
                rule_name="Third-party Due Diligence Required",
                description="All third-party relationships must include due diligence documentation",
                requirement_text="Due diligence must be performed and documented for all third-party relationships",
                mandatory=True,
                validation_criteria={
                    "due_diligence_clause": {
                        "type": "required_clauses",
                        "clauses": ["due diligence", "background check", "compliance verification"]
                    },
                    "approval_signature": {
                        "type": "approval_signature",
                        "approvers": ["Compliance Officer", "Legal Counsel"]
                    }
                },
                applicable_roles=["Procurement", "Sales", "Partnerships"],
                effective_date=datetime(2024, 1, 1),
                review_frequency_days=180,
                regulatory_basis="Ley 27.401 Art. 23.b",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            
            PolicyRule(
                rule_id="FIN-001",
                policy_type=PolicyType.FINANCIAL_CONTROLS,
                rule_name="Financial Approval Thresholds",
                description="Financial transactions must have appropriate approval levels",
                requirement_text="Expenditures above $10,000 require senior management approval",
                mandatory=True,
                validation_criteria={
                    "amount_threshold": {
                        "type": "amount_threshold",
                        "max_amount": 10000
                    },
                    "approval_signature": {
                        "type": "approval_signature", 
                        "approvers": ["Finance Manager", "Senior Manager"]
                    }
                },
                applicable_roles=["Finance", "Procurement", "Operations"],
                effective_date=datetime(2024, 1, 1),
                review_frequency_days=90,
                regulatory_basis=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            
            PolicyRule(
                rule_id="COC-001",
                policy_type=PolicyType.CODE_OF_CONDUCT,
                rule_name="Professional Communication Standards",
                description="All business communications must maintain professional standards",
                requirement_text="Business documents must not contain inappropriate language or discriminatory content",
                mandatory=True,
                validation_criteria={
                    "prohibited_terms": {
                        "type": "prohibited_terms",
                        "terms": ["inappropriate", "discriminatory", "offensive"]
                    }
                },
                applicable_roles=["All"],
                effective_date=datetime(2024, 1, 1),
                review_frequency_days=365,
                regulatory_basis=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]
        
        return rules
    
    def _init_violation_patterns(self) -> Dict[str, List[str]]:
        """Initialize NLP patterns for violation detection"""
        
        return {
            "anti_corruption": [
                r"brib[ery|e|ing]",
                r"kickback",
                r"under.{0,10}table",
                r"facilitat[ing|ion].{0,10}payment"
            ],
            "financial_controls": [
                r"unauthorized.{0,20}expenditure",
                r"exceed.{0,10}budget",
                r"approval.{0,10}bypass"
            ],
            "data_privacy": [
                r"personal.{0,10}data.{0,10}without.{0,10}consent",
                r"privacy.{0,10}breach",
                r"unauthorized.{0,10}access"
            ]
        }
    
    def _setup_secure_logger(self) -> logging.Logger:
        """Setup secure logger for audit trails"""
        
        logger = logging.getLogger(f"IntegridAI.PCC.{self.agent_id}")
        logger.setLevel(logging.INFO)
        
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        return logger
    
    def _generate_assessment_id(self, document: ComplianceDocument) -> str:
        """Generate unique assessment ID"""
        timestamp = datetime.utcnow().isoformat()
        data = f"{self.agent_id}:{document.document_id}:{timestamp}"
        return f"ASSESS-{hashlib.sha256(data.encode()).hexdigest()[:16]}"
    
    def _generate_violation_id(self, document: ComplianceDocument, rule: PolicyRule) -> str:
        """Generate unique violation ID"""
        timestamp = datetime.utcnow().isoformat()
        data = f"{document.document_id}:{rule.rule_id}:{timestamp}"
        return f"VIOL-{hashlib.sha256(data.encode()).hexdigest()[:16]}"
    
    def _create_audit_trail(self, document: ComplianceDocument, rules: List[PolicyRule],
                          violations: List[PolicyViolation], compliance_score: float,
                          processing_time_ms: int) -> Dict[str, Any]:
        """Create comprehensive audit trail"""
        
        return {
            "assessment_method": "automated_policy_compliance_check",
            "agent_version": self.version,
            "rules_evaluated": [rule.rule_id for rule in rules],
            "document_hash": document.content_hash,
            "violations_detected": len(violations),
            "compliance_score": compliance_score,
            "processing_metrics": {
                "processing_time_ms": processing_time_ms,
                "memory_usage_mb": self._get_memory_usage(),
                "rules_checked": len(rules)
            },
            "compliance_frameworks": self.compliance_frameworks,
            "regulatory_requirements": {
                "ley_27401_compliance": "Automated policy compliance per Art. 23.a",
                "audit_retention_years": 7,
                "human_review_threshold": 0.8
            }
        }
    
    def _log_assessment_completion(self, assessment: ComplianceAssessment):
        """Log assessment completion for audit trail"""
        
        self.logger.info({
            "action": "compliance_assessment_completed",
            "agent_id": self.agent_id,
            "assessment_id": assessment.assessment_id,
            "document_id": assessment.document.document_id,
            "compliance_score": assessment.compliance_score,
            "overall_status": assessment.overall_status.value,
            "violations_found": assessment.violations_found,
            "processing_time_ms": assessment.processing_time_ms,
            "next_review_date": assessment.next_review_date.isoformat(),
            "timestamp": datetime.utcnow().isoformat(),
            "compliance_tags": ["ley_27401_compliant", "automated_assessment", "audit_logged"]
        })
    
    def _update_metrics(self, assessment: ComplianceAssessment):
        """Update agent performance metrics"""
        
        self.metrics["documents_processed"] += 1
        self.metrics["violations_detected"] += assessment.violations_found
        
        # Log metrics periodically
        if self.metrics["documents_processed"] % 100 == 0:
            self.logger.info({
                "action": "agent_metrics_update",
                "agent_id": self.agent_id,
                "metrics": self.metrics,
                "timestamp": datetime.utcnow().isoformat()
            })
    
    def _get_memory_usage(self) -> int:
        """Get current memory usage in MB"""
        # In production: use psutil
        return 256  # Simulated memory usage
    
    # Document source initialization methods
    
    def _init_sharepoint_source(self) -> Dict:
        """Initialize SharePoint integration"""
        return {
            "name": "SHAREPOINT",
            "endpoint": self.config.get("sharepoint_endpoint", "https://company.sharepoint.com"),
            "client_id": self.config.get("sharepoint_client_id", "demo-client"),
            "timeout": 30
        }
    
    def _init_document_mgmt_source(self) -> Dict:
        """Initialize document management system integration"""
        return {
            "name": "DOCUMENT_MANAGEMENT",
            "endpoint": self.config.get("dms_endpoint", "https://dms.company.com/api"),
            "api_key": self.config.get("dms_api_key", "demo-key"),
            "timeout": 20
        }
    
    def _init_filesystem_source(self) -> Dict:
        """Initialize file system monitoring"""
        return {
            "name": "FILE_SYSTEM",
            "watch_directories": self.config.get("watch_directories", ["/documents", "/policies"]),
            "file_extensions": [".pdf", ".docx", ".txt", ".doc"],
            "timeout": 5
        }
    
    def _init_email_source(self) -> Dict:
        """Initialize email system integration"""
        return {
            "name": "EMAIL_SYSTEM",
            "server": self.config.get("email_server", "mail.company.com"),
            "api_key": self.config.get("email_api_key", "demo-key"),
            "timeout": 15
        }
    
    def _init_contracts_source(self) -> Dict:
        """Initialize contracts database integration"""
        return {
            "name": "CONTRACTS_DATABASE",
            "endpoint": self.config.get("contracts_endpoint", "https://contracts.company.com/api"),
            "api_key": self.config.get("contracts_api_key", "demo-key"),
            "timeout": 25
        }


# Health check for Kubernetes deployment
class PCCHealthCheck:
    """Health check endpoints for PCC agent"""
    
    def __init__(self, pcc_agent: PolicyComplianceChecker):
        self.agent = pcc_agent
    
    def health_check(self) -> Dict[str, Any]:
        """Basic health check"""
        return {
            "status": "healthy",
            "agent_id": self.agent.agent_id,
            "version": self.agent.version,
            "policy_rules_loaded": len(self.agent.policy_rules),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def readiness_check(self) -> Dict[str, Any]:
        """Readiness check for Kubernetes"""
        
        # Check document sources
        sources_ready = True
        source_status = {}
        
        for source_name, source_config in self.agent.document_sources.items():
            # In production: test actual connectivity
            source_status[source_name] = "ready"
        
        return {
            "status": "ready" if sources_ready else "not_ready",
            "agent_id": self.agent.agent_id,
            "document_sources": source_status,
            "policy_rules_count": len(self.agent.policy_rules),
            "timestamp": datetime.utcnow().isoformat()
        }


# Example usage
if __name__ == "__main__":
    
    # Configuration
    config = {
        "sharepoint_endpoint": "https://company.sharepoint.com",
        "sharepoint_client_id": "demo-sharepoint-client",
        "dms_endpoint": "https://dms.company.com/api",
        "dms_api_key": "demo-dms-key",
        "watch_directories": ["/documents", "/policies", "/procedures"],
        "email_server": "mail.company.com",
        "contracts_endpoint": "https://contracts.company.com/api"
    }
    
    # Initialize PCC agent
    pcc = PolicyComplianceChecker(config)
    
    # Example document for testing
    test_document = ComplianceDocument(
        document_id="TEST-DOC-001",
        document_name="Vendor Agreement Template",
        document_type="legal_contract",
        content_hash="abc123def456",
        file_path="/documents/vendor_agreement.pdf",
        created_by="legal@company.com",
        created_at=datetime.utcnow() - timedelta(days=30),
        last_modified=datetime.utcnow() - timedelta(days=5),
        access_level="CONFIDENTIAL",
        department="Legal",
        related_policies=["ANTI_CORRUPTION", "PROCUREMENT"],
        metadata={
            "approvals": [
                {"role": "Legal Counsel", "date": "2024-01-10"},
                {"role": "Compliance Officer", "date": "2024-01-12"}
            ],
            "version": "2.1",
            "contract_value": "$25000"
        }
    )
    
    # Run compliance check
    async def run_demo():
        print("🔍 Starting Policy Compliance Check...")
        print(f"📋 Agent: {pcc.agent_name} v{pcc.version}")
        print(f"📄 Document: {test_document.document_name}")
        print(f"🏢 Department: {test_document.department}")
        print("=" * 60)
        
        try:
            assessment = await pcc.check_document_compliance(test_document)
            
            print(f"✅ Compliance check completed!")
            print(f"📊 Compliance Score: {assessment.compliance_score:.1%}")
            print(f"📋 Overall Status: {assessment.overall_status.value}")
            print(f"🔍 Rules Checked: {assessment.total_rules_checked}")
            print(f"✅ Compliant Rules: {assessment.compliant_rules}")
            print(f"⚠️  Violations Found: {assessment.violations_found}")
            print(f"⏱️  Processing Time: {assessment.processing_time_ms}ms")
            
            if assessment.violations:
                print(f"\n🚨 Policy Violations ({len(assessment.violations)}):")
                for i, violation in enumerate(assessment.violations, 1):
                    print(f"  {i}. {violation.severity.value}: {violation.description}")
                    print(f"     Rule: {violation.rule_id}")
                    print(f"     Confidence: {violation.confidence_score:.1%}")
                    if violation.evidence_text:
                        print(f"     Evidence: {violation.evidence_text[:100]}...")
            
            print(f"\n💡 Recommendations ({len(assessment.recommendations)}):")
            for i, rec in enumerate(assessment.recommendations, 1):
                print(f"  {i}. {rec}")
            
            print(f"\n📅 Next Review: {assessment.next_review_date.strftime('%Y-%m-%d')}")
            
            print("\n" + "=" * 60)
            print("🛡️  IntegridAI Policy Compliance Checker - Ley 27.401 Compliant")
            
        except Exception as e:
            print(f"❌ Compliance check failed: {e}")
    
    # Run the demo
    asyncio.run(run_demo())