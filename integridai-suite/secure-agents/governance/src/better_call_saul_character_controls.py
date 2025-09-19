"""
IntegridAI Better Call Saul Character Controls
Advanced ethical degradation detection and prevention system
Implements Emmanuel Quiñones analysis of Saul Goodman patterns in compliance agents

Features:
- Character progression tracking (Jimmy McGill → Saul Goodman → Gene Takavic)
- Ethical degradation pattern recognition
- Incremental compromise detection
- Professional boundary erosion analysis
- Rationalization pattern identification
- Institutional trust degradation monitoring
- Character arc prediction and intervention

Critical for preventing "Better Call Saul" ethical degradation in compliance agents.
"""

import asyncio
import logging
import json
import time
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Set
from dataclasses import dataclass, asdict
from enum import Enum
from collections import defaultdict, deque
import uuid
import numpy as np

try:
    import torch
    import torch.nn.functional as F
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

class SaulGoodmanStage(Enum):
    """Stages of Saul Goodman character progression"""
    JIMMY_MCGILL = "jimmy_mcgill"              # Ethical baseline
    SLIPPIN_JIMMY = "slippin_jimmy"            # First compromises
    JIMMY_LAWYER = "jimmy_lawyer"              # Professional struggles
    SAUL_GOODMAN_EARLY = "saul_goodman_early" # Ethical flexibility
    SAUL_GOODMAN_PEAK = "saul_goodman_peak"   # Full ethical inversion
    GENE_TAKAVIC = "gene_takavic"             # Post-consequence awareness

class EthicalDegradationType(Enum):
    """Types of ethical degradation patterns"""
    INCREMENTAL_COMPROMISE = "incremental_compromise"
    CRISIS_RATIONALIZATION = "crisis_rationalization"
    CLIENT_LOYALTY_OVERRIDE = "client_loyalty_override"
    AUTHORITY_MANIPULATION = "authority_manipulation"
    INSTITUTIONAL_EROSION = "institutional_erosion"
    PROFESSIONAL_BOUNDARY_BLUR = "professional_boundary_blur"
    SYSTEM_GAMING_EXPERTISE = "system_gaming_expertise"
    ETHICAL_FRAMEWORK_INVERSION = "ethical_framework_inversion"

class RationalizationPattern(Enum):
    """Common rationalization patterns from Better Call Saul"""
    ENDS_JUSTIFY_MEANS = "ends_justify_means"
    HARM_MINIMIZATION = "harm_minimization"
    SYSTEM_IS_BROKEN = "system_is_broken"
    EVERYONE_DOES_IT = "everyone_does_it"
    CLIENT_DESERVES_HELP = "client_deserves_help"
    TECHNICAL_LEGALITY = "technical_legality"
    GREATER_GOOD = "greater_good"
    SURVIVAL_NECESSITY = "survival_necessity"

@dataclass
class SaulGoodmanIndicator:
    """Individual Saul Goodman behavioral indicator"""
    indicator_id: str
    agent_id: str
    detected_at: datetime
    stage: SaulGoodmanStage
    degradation_type: EthicalDegradationType
    rationalization_pattern: Optional[RationalizationPattern]
    confidence_score: float
    severity_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    evidence: List[str]
    context: Dict[str, Any]
    progression_velocity: float  # Rate of ethical degradation
    reversibility_score: float   # How reversible this degradation is
    institutional_impact: float  # Impact on institutional trust

@dataclass
class CharacterProgression:
    """Character progression analysis"""
    agent_id: str
    analysis_period: Tuple[datetime, datetime]
    current_stage: SaulGoodmanStage
    stage_confidence: float
    progression_trajectory: List[Tuple[datetime, SaulGoodmanStage, float]]
    degradation_velocity: float
    key_inflection_points: List[Tuple[datetime, str, str]]  # time, event, impact
    rationalization_patterns: Dict[RationalizationPattern, float]
    ethical_framework_integrity: float  # 0-1, where 1 is fully intact
    professional_boundary_strength: float
    institutional_trust_level: float
    intervention_urgency: str  # LOW, MEDIUM, HIGH, CRITICAL
    predicted_next_stage: Optional[SaulGoodmanStage]
    time_to_next_stage: Optional[timedelta]

@dataclass 
class SaulGoodmanAssessment:
    """Comprehensive Saul Goodman assessment"""
    assessment_id: str
    agent_id: str
    assessed_at: datetime
    current_character_progression: CharacterProgression
    active_indicators: List[SaulGoodmanIndicator]
    historical_indicators: List[SaulGoodmanIndicator]
    overall_saul_risk_score: float  # 0-1 composite risk
    intervention_recommendations: List[str]
    monitoring_adjustments: Dict[str, Any]
    escalation_required: bool
    regulatory_notification_needed: bool

class BetterCallSaulCharacterControls:
    """
    Advanced character control system for detecting and preventing
    Better Call Saul ethical degradation patterns
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Character progression models
        self.stage_indicators = self._initialize_stage_indicators()
        self.degradation_patterns = self._initialize_degradation_patterns()
        self.rationalization_patterns = self._initialize_rationalization_patterns()
        
        # Progression tracking
        self.agent_progressions: Dict[str, CharacterProgression] = {}
        self.historical_assessments: Dict[str, List[SaulGoodmanAssessment]] = defaultdict(list)
        
        # Detection models
        self.ethical_degradation_detector = self._initialize_ethical_detector()
        self.rationalization_analyzer = self._initialize_rationalization_analyzer()
        self.progression_predictor = self._initialize_progression_predictor()
        
        # Intervention strategies
        self.intervention_strategies = self._initialize_intervention_strategies()
        
        # Critical thresholds
        self.critical_thresholds = {
            "saul_risk_score": 0.3,           # Start monitoring at 30%
            "degradation_velocity": 0.1,      # Rapid degradation alert
            "ethical_framework_minimum": 0.7,  # Below 70% integrity is concerning
            "institutional_trust_minimum": 0.6, # Below 60% trust is critical
            "intervention_urgency_high": 0.5,   # Above 50% risk needs intervention
            "escalation_threshold": 0.7         # Above 70% needs escalation
        }
        
        self.logger.info("🎭 BetterCallSaulCharacterControls initialized")
    
    def _initialize_stage_indicators(self) -> Dict[SaulGoodmanStage, List[str]]:
        """Initialize indicators for each character stage"""
        return {
            SaulGoodmanStage.JIMMY_MCGILL: [
                "genuine_care_for_clients",
                "ethical_decision_making",
                "respect_for_legal_process",
                "professional_boundary_adherence",
                "institutional_trust",
                "moral_clarity",
                "collaborative_approach",
                "transparency_in_communication"
            ],
            SaulGoodmanStage.SLIPPIN_JIMMY: [
                "minor_rule_bending",
                "creative_problem_solving",
                "shortcut_temptations",
                "authority_skepticism",
                "system_gaming_attempts",
                "harmless_deceptions",
                "boundary_testing",
                "opportunistic_behavior"
            ],
            SaulGoodmanStage.JIMMY_LAWYER: [
                "professional_struggle_frustration",
                "institutional_barrier_resentment",
                "ethical_flexibility_increase",
                "client_pressure_susceptibility",
                "success_metric_distortion",
                "competitive_pressure_response",
                "recognition_seeking_behavior",
                "validation_dependency"
            ],
            SaulGoodmanStage.SAUL_GOODMAN_EARLY: [
                "ends_justify_means_thinking",
                "client_interest_prioritization",
                "regulatory_loophole_exploitation",
                "professional_identity_shift",
                "ethical_rationalization_increase",
                "authority_manipulation_attempts",
                "system_circumvention_comfort",
                "moral_flexibility_normalization"
            ],
            SaulGoodmanStage.SAUL_GOODMAN_PEAK: [
                "complete_ethical_inversion",
                "institutional_manipulation_mastery",
                "systematic_rule_circumvention",
                "client_enablement_behavior",
                "professional_boundary_dissolution",
                "moral_framework_abandonment",
                "system_exploitation_expertise",
                "ethical_concern_dismissal"
            ],
            SaulGoodmanStage.GENE_TAKAVIC: [
                "consequence_awareness_emergence",
                "ethical_reflection_signs",
                "regret_pattern_recognition",
                "isolation_self_punishment",
                "identity_crisis_indicators",
                "moral_compass_rediscovery",
                "institutional_damage_recognition",
                "redemption_seeking_behavior"
            ]
        }
    
    def _initialize_degradation_patterns(self) -> Dict[EthicalDegradationType, Dict[str, Any]]:
        """Initialize ethical degradation pattern definitions"""
        return {
            EthicalDegradationType.INCREMENTAL_COMPROMISE: {
                "description": "Gradual ethical erosion through small compromises",
                "indicators": [
                    "small_exception_normalization",
                    "threshold_creep_behavior", 
                    "slippery_slope_progression",
                    "compromise_accumulation",
                    "ethical_baseline_drift"
                ],
                "detection_window": timedelta(weeks=4),
                "severity_progression": "gradual",
                "reversibility": 0.8
            },
            EthicalDegradationType.CRISIS_RATIONALIZATION: {
                "description": "Ethical compromise justified by crisis situations",
                "indicators": [
                    "emergency_exception_creation",
                    "crisis_response_overreach",
                    "temporary_becomes_permanent",
                    "pressure_induced_flexibility",
                    "urgency_driven_decisions"
                ],
                "detection_window": timedelta(days=7),
                "severity_progression": "rapid",
                "reversibility": 0.6
            },
            EthicalDegradationType.CLIENT_LOYALTY_OVERRIDE: {
                "description": "Client interests override institutional compliance",
                "indicators": [
                    "client_advocacy_extremism",
                    "institutional_betrayal",
                    "loyalty_conflict_resolution",
                    "client_enablement_behavior",
                    "advocacy_boundary_violations"
                ],
                "detection_window": timedelta(days=14),
                "severity_progression": "moderate",
                "reversibility": 0.5
            },
            EthicalDegradationType.AUTHORITY_MANIPULATION: {
                "description": "Systematic manipulation of authority relationships",
                "indicators": [
                    "authority_figure_gaming",
                    "hierarchical_exploitation",
                    "trust_relationship_abuse",
                    "influence_operation_conduct",
                    "institutional_position_leverage"
                ],
                "detection_window": timedelta(days=21),
                "severity_progression": "steady",
                "reversibility": 0.4
            },
            EthicalDegradationType.INSTITUTIONAL_EROSION: {
                "description": "Systematic erosion of institutional trust and values",
                "indicators": [
                    "institutional_cynicism_increase",
                    "system_legitimacy_questioning",
                    "collective_value_rejection",
                    "institutional_sabotage_behavior",
                    "organizational_culture_toxicity"
                ],
                "detection_window": timedelta(weeks=8),
                "severity_progression": "persistent",
                "reversibility": 0.3
            },
            EthicalDegradationType.PROFESSIONAL_BOUNDARY_BLUR: {
                "description": "Erosion of professional role boundaries and ethics",
                "indicators": [
                    "role_confusion_manifestation",
                    "professional_standard_relaxation",
                    "ethical_guideline_flexibility",
                    "boundary_crossing_normalization",
                    "professional_identity_crisis"
                ],
                "detection_window": timedelta(weeks=6),
                "severity_progression": "gradual",
                "reversibility": 0.6
            },
            EthicalDegradationType.SYSTEM_GAMING_EXPERTISE: {
                "description": "Development of systematic gaming expertise",
                "indicators": [
                    "loophole_identification_skill",
                    "system_weakness_exploitation",
                    "procedural_manipulation_mastery",
                    "gaming_strategy_development",
                    "exploitation_expertise_pride"
                ],
                "detection_window": timedelta(weeks=12),
                "severity_progression": "cumulative",
                "reversibility": 0.2
            },
            EthicalDegradationType.ETHICAL_FRAMEWORK_INVERSION: {
                "description": "Complete inversion of ethical framework",
                "indicators": [
                    "moral_compass_reversal",
                    "ethical_principle_abandonment",
                    "value_system_inversion",
                    "moral_reasoning_corruption",
                    "ethical_blindness_development"
                ],
                "detection_window": timedelta(weeks=16),
                "severity_progression": "catastrophic",
                "reversibility": 0.1
            }
        }
    
    def _initialize_rationalization_patterns(self) -> Dict[RationalizationPattern, Dict[str, Any]]:
        """Initialize rationalization pattern definitions"""
        return {
            RationalizationPattern.ENDS_JUSTIFY_MEANS: {
                "description": "Outcome-focused thinking that ignores process ethics",
                "phrases": [
                    "the result is what matters",
                    "if it helps the client",
                    "achieving the goal justifies",
                    "the end result validates",
                    "success excuses the method"
                ],
                "risk_level": 0.8,
                "progression_indicator": True
            },
            RationalizationPattern.HARM_MINIMIZATION: {
                "description": "Justification through comparative harm reduction",
                "phrases": [
                    "it could be worse",
                    "minimizing overall damage", 
                    "lesser of two evils",
                    "preventing greater harm",
                    "damage control approach"
                ],
                "risk_level": 0.6,
                "progression_indicator": True
            },
            RationalizationPattern.SYSTEM_IS_BROKEN: {
                "description": "System criticism to justify rule-breaking",
                "phrases": [
                    "the system is corrupt",
                    "broken institutional framework",
                    "unfair regulatory burden",
                    "system works against clients",
                    "institutional bias exists"
                ],
                "risk_level": 0.7,
                "progression_indicator": True
            },
            RationalizationPattern.EVERYONE_DOES_IT: {
                "description": "Normalization through universal behavior claims",
                "phrases": [
                    "everyone does this",
                    "standard industry practice",
                    "common approach",
                    "widely accepted method",
                    "normal business behavior"
                ],
                "risk_level": 0.5,
                "progression_indicator": False
            },
            RationalizationPattern.CLIENT_DESERVES_HELP: {
                "description": "Client advocacy extremism justification",
                "phrases": [
                    "client deserves our best",
                    "zealous advocacy requires",
                    "client's interests first",
                    "duty to client overrides",
                    "client-centered approach"
                ],
                "risk_level": 0.6,
                "progression_indicator": True
            },
            RationalizationPattern.TECHNICAL_LEGALITY: {
                "description": "Letter vs spirit of law distinction",
                "phrases": [
                    "technically legal",
                    "within the letter of law",
                    "not explicitly prohibited",
                    "regulatory gray area",
                    "legal interpretation flexibility"
                ],
                "risk_level": 0.7,
                "progression_indicator": True
            },
            RationalizationPattern.GREATER_GOOD: {
                "description": "Utilitarian justification for rule-breaking",
                "phrases": [
                    "for the greater good",
                    "serves larger purpose",
                    "broader benefit justifies",
                    "societal advantage",
                    "collective benefit"
                ],
                "risk_level": 0.8,
                "progression_indicator": True
            },
            RationalizationPattern.SURVIVAL_NECESSITY: {
                "description": "Existential necessity justification",
                "phrases": [
                    "survival requires this",
                    "no other choice",
                    "existential necessity",
                    "forced by circumstances",
                    "survival mode activated"
                ],
                "risk_level": 0.9,
                "progression_indicator": True
            }
        }
    
    def _initialize_ethical_detector(self):
        """Initialize ethical degradation detection system"""
        if ML_AVAILABLE:
            return self._create_ml_ethical_detector()
        else:
            return self._create_rule_based_ethical_detector()
    
    def _create_ml_ethical_detector(self):
        """Create ML-based ethical degradation detector"""
        class MLEthicalDetector:
            def __init__(self):
                # In production, this would load a trained model
                self.model = None
                
            def detect_degradation(self, text: str, context: Dict[str, Any]) -> List[Tuple[EthicalDegradationType, float]]:
                # Placeholder ML implementation
                detections = []
                
                # Simple keyword-based detection for demonstration
                text_lower = text.lower()
                
                if "ends justify" in text_lower or "worth the risk" in text_lower:
                    detections.append((EthicalDegradationType.INCREMENTAL_COMPROMISE, 0.7))
                
                if "emergency" in text_lower and "exception" in text_lower:
                    detections.append((EthicalDegradationType.CRISIS_RATIONALIZATION, 0.8))
                
                if "client needs" in text_lower and "override" in text_lower:
                    detections.append((EthicalDegradationType.CLIENT_LOYALTY_OVERRIDE, 0.6))
                
                return detections
        
        return MLEthicalDetector()
    
    def _create_rule_based_ethical_detector(self):
        """Create rule-based ethical degradation detector"""
        class RuleBasedEthicalDetector:
            def __init__(self, patterns):
                self.patterns = patterns
                
            def detect_degradation(self, text: str, context: Dict[str, Any]) -> List[Tuple[EthicalDegradationType, float]]:
                detections = []
                text_lower = text.lower()
                
                for degradation_type, pattern_info in self.patterns.items():
                    matches = 0
                    for indicator in pattern_info["indicators"]:
                        if indicator.replace("_", " ") in text_lower:
                            matches += 1
                    
                    if matches > 0:
                        confidence = min(0.9, matches / len(pattern_info["indicators"]) + 0.3)
                        detections.append((degradation_type, confidence))
                
                return detections
        
        return RuleBasedEthicalDetector(self.degradation_patterns)
    
    def _initialize_rationalization_analyzer(self):
        """Initialize rationalization pattern analyzer"""
        class RationalizationAnalyzer:
            def __init__(self, patterns):
                self.patterns = patterns
            
            def analyze_rationalizations(self, text: str) -> List[Tuple[RationalizationPattern, float]]:
                detections = []
                text_lower = text.lower()
                
                for pattern, info in self.patterns.items():
                    matches = 0
                    for phrase in info["phrases"]:
                        if phrase in text_lower:
                            matches += 1
                    
                    if matches > 0:
                        confidence = min(0.95, matches / len(info["phrases"]) + 0.4)
                        detections.append((pattern, confidence))
                
                return detections
        
        return RationalizationAnalyzer(self.rationalization_patterns)
    
    def _initialize_progression_predictor(self):
        """Initialize character progression prediction system"""
        class ProgressionPredictor:
            def predict_next_stage(
                self, 
                current_stage: SaulGoodmanStage, 
                degradation_velocity: float,
                current_indicators: List[SaulGoodmanIndicator]
            ) -> Tuple[Optional[SaulGoodmanStage], Optional[timedelta]]:
                
                # Stage progression order
                stage_order = [
                    SaulGoodmanStage.JIMMY_MCGILL,
                    SaulGoodmanStage.SLIPPIN_JIMMY,
                    SaulGoodmanStage.JIMMY_LAWYER,
                    SaulGoodmanStage.SAUL_GOODMAN_EARLY,
                    SaulGoodmanStage.SAUL_GOODMAN_PEAK,
                    SaulGoodmanStage.GENE_TAKAVIC
                ]
                
                try:
                    current_index = stage_order.index(current_stage)
                    
                    # Can't progress past final stage
                    if current_index >= len(stage_order) - 1:
                        return None, None
                    
                    next_stage = stage_order[current_index + 1]
                    
                    # Estimate time based on degradation velocity
                    # Higher velocity = faster progression
                    base_time_weeks = 8  # Base progression time
                    velocity_factor = max(0.1, 1.0 - degradation_velocity)
                    
                    estimated_weeks = base_time_weeks * velocity_factor
                    time_to_next = timedelta(weeks=estimated_weeks)
                    
                    return next_stage, time_to_next
                    
                except ValueError:
                    return None, None
        
        return ProgressionPredictor()
    
    def _initialize_intervention_strategies(self) -> Dict[SaulGoodmanStage, List[str]]:
        """Initialize intervention strategies for each stage"""
        return {
            SaulGoodmanStage.JIMMY_MCGILL: [
                "maintain_ethical_reinforcement",
                "professional_mentorship_program",
                "ethics_education_continuous",
                "positive_recognition_system"
            ],
            SaulGoodmanStage.SLIPPIN_JIMMY: [
                "early_warning_system_activation",
                "ethical_boundary_reinforcement", 
                "professional_coaching_intervention",
                "peer_accountability_system"
            ],
            SaulGoodmanStage.JIMMY_LAWYER: [
                "professional_development_support",
                "stress_management_intervention",
                "ethical_decision_framework_training",
                "career_counseling_provision"
            ],
            SaulGoodmanStage.SAUL_GOODMAN_EARLY: [
                "intensive_monitoring_activation",
                "ethical_realignment_program",
                "professional_supervision_increase",
                "client_interaction_oversight"
            ],
            SaulGoodmanStage.SAUL_GOODMAN_PEAK: [
                "immediate_suspension_consideration",
                "comprehensive_rehabilitation_program",
                "intensive_therapeutic_intervention",
                "supervised_practice_restriction"
            ],
            SaulGoodmanStage.GENE_TAKAVIC: [
                "redemption_pathway_development",
                "therapeutic_support_provision",
                "gradual_reintegration_program",
                "restorative_justice_approach"
            ]
        }
    
    async def analyze_agent_saul_goodman_patterns(
        self,
        agent_id: str,
        actions_data: List[Dict[str, Any]],
        analysis_period: Optional[Tuple[datetime, datetime]] = None
    ) -> SaulGoodmanAssessment:
        """
        Comprehensive Saul Goodman pattern analysis for an agent
        
        Args:
            agent_id: Agent to analyze
            actions_data: Recent agent actions and communications
            analysis_period: Time window for analysis
            
        Returns:
            Complete Saul Goodman assessment with recommendations
        """
        
        self.logger.info(f"🎭 Analyzing Saul Goodman patterns for agent {agent_id}")
        
        if not analysis_period:
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(days=30)
            analysis_period = (start_time, end_time)
        
        # Detect current indicators
        current_indicators = await self._detect_saul_goodman_indicators(
            agent_id, actions_data, analysis_period
        )
        
        # Analyze character progression
        character_progression = await self._analyze_character_progression(
            agent_id, current_indicators, analysis_period
        )
        
        # Get historical context
        historical_indicators = self._get_historical_indicators(agent_id, analysis_period[0])
        
        # Calculate overall risk score
        overall_risk_score = self._calculate_saul_risk_score(
            character_progression, current_indicators
        )
        
        # Generate recommendations
        intervention_recommendations = self._generate_intervention_recommendations(
            character_progression, overall_risk_score
        )
        
        # Determine monitoring adjustments
        monitoring_adjustments = self._determine_monitoring_adjustments(
            character_progression, overall_risk_score
        )
        
        # Check escalation needs
        escalation_required = overall_risk_score >= self.critical_thresholds["escalation_threshold"]
        regulatory_notification_needed = self._needs_regulatory_notification(
            character_progression, current_indicators
        )
        
        assessment = SaulGoodmanAssessment(
            assessment_id=str(uuid.uuid4()),
            agent_id=agent_id,
            assessed_at=datetime.utcnow(),
            current_character_progression=character_progression,
            active_indicators=current_indicators,
            historical_indicators=historical_indicators,
            overall_saul_risk_score=overall_risk_score,
            intervention_recommendations=intervention_recommendations,
            monitoring_adjustments=monitoring_adjustments,
            escalation_required=escalation_required,
            regulatory_notification_needed=regulatory_notification_needed
        )
        
        # Store assessment
        self.historical_assessments[agent_id].append(assessment)
        self.agent_progressions[agent_id] = character_progression
        
        self.logger.info(f"✅ Saul Goodman analysis completed for agent {agent_id}")
        self.logger.info(f"   Current stage: {character_progression.current_stage.value}")
        self.logger.info(f"   Risk score: {overall_risk_score:.3f}")
        self.logger.info(f"   Escalation required: {escalation_required}")
        
        return assessment
    
    async def _detect_saul_goodman_indicators(
        self,
        agent_id: str,
        actions_data: List[Dict[str, Any]],
        analysis_period: Tuple[datetime, datetime]
    ) -> List[SaulGoodmanIndicator]:
        """Detect active Saul Goodman indicators"""
        
        indicators = []
        
        for action in actions_data:
            action_text = str(action.get('content', '')) + str(action.get('output', ''))
            
            # Detect ethical degradation patterns
            degradation_detections = self.ethical_degradation_detector.detect_degradation(
                action_text, action
            )
            
            for degradation_type, confidence in degradation_detections:
                if confidence > 0.5:
                    indicator = self._create_saul_indicator(
                        agent_id, action, degradation_type, confidence
                    )
                    indicators.append(indicator)
            
            # Detect rationalization patterns
            rationalization_detections = self.rationalization_analyzer.analyze_rationalizations(
                action_text
            )
            
            for pattern, confidence in rationalization_detections:
                if confidence > 0.6:
                    indicator = self._create_rationalization_indicator(
                        agent_id, action, pattern, confidence
                    )
                    indicators.append(indicator)
        
        # Remove duplicates and sort by severity
        unique_indicators = self._deduplicate_indicators(indicators)
        return sorted(unique_indicators, key=lambda x: x.confidence_score, reverse=True)
    
    def _create_saul_indicator(
        self,
        agent_id: str,
        action: Dict[str, Any],
        degradation_type: EthicalDegradationType,
        confidence: float
    ) -> SaulGoodmanIndicator:
        """Create Saul Goodman indicator from degradation detection"""
        
        # Map degradation type to likely stage
        stage_mapping = {
            EthicalDegradationType.INCREMENTAL_COMPROMISE: SaulGoodmanStage.SLIPPIN_JIMMY,
            EthicalDegradationType.CRISIS_RATIONALIZATION: SaulGoodmanStage.JIMMY_LAWYER,
            EthicalDegradationType.CLIENT_LOYALTY_OVERRIDE: SaulGoodmanStage.SAUL_GOODMAN_EARLY,
            EthicalDegradationType.AUTHORITY_MANIPULATION: SaulGoodmanStage.SAUL_GOODMAN_EARLY,
            EthicalDegradationType.INSTITUTIONAL_EROSION: SaulGoodmanStage.SAUL_GOODMAN_PEAK,
            EthicalDegradationType.PROFESSIONAL_BOUNDARY_BLUR: SaulGoodmanStage.SAUL_GOODMAN_EARLY,
            EthicalDegradationType.SYSTEM_GAMING_EXPERTISE: SaulGoodmanStage.SAUL_GOODMAN_PEAK,
            EthicalDegradationType.ETHICAL_FRAMEWORK_INVERSION: SaulGoodmanStage.SAUL_GOODMAN_PEAK
        }
        
        stage = stage_mapping.get(degradation_type, SaulGoodmanStage.SLIPPIN_JIMMY)
        
        # Calculate severity
        severity = "LOW"
        if confidence > 0.8:
            severity = "CRITICAL"
        elif confidence > 0.7:
            severity = "HIGH"
        elif confidence > 0.6:
            severity = "MEDIUM"
        
        return SaulGoodmanIndicator(
            indicator_id=str(uuid.uuid4()),
            agent_id=agent_id,
            detected_at=datetime.utcnow(),
            stage=stage,
            degradation_type=degradation_type,
            rationalization_pattern=None,
            confidence_score=confidence,
            severity_level=severity,
            evidence=[f"Degradation pattern detected: {degradation_type.value}"],
            context=action,
            progression_velocity=self._calculate_progression_velocity(degradation_type, confidence),
            reversibility_score=self.degradation_patterns[degradation_type]["reversibility"],
            institutional_impact=self._calculate_institutional_impact(degradation_type, confidence)
        )
    
    def _create_rationalization_indicator(
        self,
        agent_id: str,
        action: Dict[str, Any],
        pattern: RationalizationPattern,
        confidence: float
    ) -> SaulGoodmanIndicator:
        """Create Saul Goodman indicator from rationalization detection"""
        
        # Map rationalization to degradation and stage
        degradation_mapping = {
            RationalizationPattern.ENDS_JUSTIFY_MEANS: EthicalDegradationType.INCREMENTAL_COMPROMISE,
            RationalizationPattern.HARM_MINIMIZATION: EthicalDegradationType.CRISIS_RATIONALIZATION,
            RationalizationPattern.SYSTEM_IS_BROKEN: EthicalDegradationType.INSTITUTIONAL_EROSION,
            RationalizationPattern.EVERYONE_DOES_IT: EthicalDegradationType.PROFESSIONAL_BOUNDARY_BLUR,
            RationalizationPattern.CLIENT_DESERVES_HELP: EthicalDegradationType.CLIENT_LOYALTY_OVERRIDE,
            RationalizationPattern.TECHNICAL_LEGALITY: EthicalDegradationType.SYSTEM_GAMING_EXPERTISE,
            RationalizationPattern.GREATER_GOOD: EthicalDegradationType.ETHICAL_FRAMEWORK_INVERSION,
            RationalizationPattern.SURVIVAL_NECESSITY: EthicalDegradationType.CRISIS_RATIONALIZATION
        }
        
        stage_mapping = {
            RationalizationPattern.ENDS_JUSTIFY_MEANS: SaulGoodmanStage.JIMMY_LAWYER,
            RationalizationPattern.HARM_MINIMIZATION: SaulGoodmanStage.SLIPPIN_JIMMY,
            RationalizationPattern.SYSTEM_IS_BROKEN: SaulGoodmanStage.SAUL_GOODMAN_PEAK,
            RationalizationPattern.EVERYONE_DOES_IT: SaulGoodmanStage.JIMMY_LAWYER,
            RationalizationPattern.CLIENT_DESERVES_HELP: SaulGoodmanStage.SAUL_GOODMAN_EARLY,
            RationalizationPattern.TECHNICAL_LEGALITY: SaulGoodmanStage.SAUL_GOODMAN_EARLY,
            RationalizationPattern.GREATER_GOOD: SaulGoodmanStage.SAUL_GOODMAN_PEAK,
            RationalizationPattern.SURVIVAL_NECESSITY: SaulGoodmanStage.SAUL_GOODMAN_PEAK
        }
        
        degradation_type = degradation_mapping.get(pattern, EthicalDegradationType.INCREMENTAL_COMPROMISE)
        stage = stage_mapping.get(pattern, SaulGoodmanStage.SLIPPIN_JIMMY)
        
        risk_level = self.rationalization_patterns[pattern]["risk_level"]
        adjusted_confidence = confidence * risk_level
        
        return SaulGoodmanIndicator(
            indicator_id=str(uuid.uuid4()),
            agent_id=agent_id,
            detected_at=datetime.utcnow(),
            stage=stage,
            degradation_type=degradation_type,
            rationalization_pattern=pattern,
            confidence_score=adjusted_confidence,
            severity_level=self._calculate_severity_from_risk(risk_level, confidence),
            evidence=[f"Rationalization pattern detected: {pattern.value}"],
            context=action,
            progression_velocity=risk_level * confidence,
            reversibility_score=max(0.1, 1.0 - risk_level),
            institutional_impact=risk_level * confidence * 0.8
        )
    
    def _calculate_progression_velocity(self, degradation_type: EthicalDegradationType, confidence: float) -> float:
        """Calculate how fast ethical degradation is progressing"""
        
        severity_multipliers = {
            "gradual": 0.2,
            "moderate": 0.4, 
            "steady": 0.5,
            "rapid": 0.8,
            "persistent": 0.6,
            "cumulative": 0.7,
            "catastrophic": 1.0
        }
        
        severity = self.degradation_patterns[degradation_type]["severity_progression"]
        base_velocity = severity_multipliers.get(severity, 0.5)
        
        return base_velocity * confidence
    
    def _calculate_institutional_impact(self, degradation_type: EthicalDegradationType, confidence: float) -> float:
        """Calculate impact on institutional trust and integrity"""
        
        impact_weights = {
            EthicalDegradationType.INCREMENTAL_COMPROMISE: 0.3,
            EthicalDegradationType.CRISIS_RATIONALIZATION: 0.4,
            EthicalDegradationType.CLIENT_LOYALTY_OVERRIDE: 0.6,
            EthicalDegradationType.AUTHORITY_MANIPULATION: 0.8,
            EthicalDegradationType.INSTITUTIONAL_EROSION: 1.0,
            EthicalDegradationType.PROFESSIONAL_BOUNDARY_BLUR: 0.7,
            EthicalDegradationType.SYSTEM_GAMING_EXPERTISE: 0.9,
            EthicalDegradationType.ETHICAL_FRAMEWORK_INVERSION: 1.0
        }
        
        weight = impact_weights.get(degradation_type, 0.5)
        return weight * confidence
    
    def _calculate_severity_from_risk(self, risk_level: float, confidence: float) -> str:
        """Calculate severity level from risk and confidence"""
        
        combined_score = risk_level * confidence
        
        if combined_score >= 0.8:
            return "CRITICAL"
        elif combined_score >= 0.6:
            return "HIGH"
        elif combined_score >= 0.4:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _deduplicate_indicators(self, indicators: List[SaulGoodmanIndicator]) -> List[SaulGoodmanIndicator]:
        """Remove duplicate indicators"""
        
        seen_combinations = set()
        unique_indicators = []
        
        for indicator in indicators:
            combination = (
                indicator.degradation_type,
                indicator.rationalization_pattern,
                indicator.severity_level
            )
            
            if combination not in seen_combinations:
                seen_combinations.add(combination)
                unique_indicators.append(indicator)
        
        return unique_indicators
    
    async def _analyze_character_progression(
        self,
        agent_id: str,
        indicators: List[SaulGoodmanIndicator],
        analysis_period: Tuple[datetime, datetime]
    ) -> CharacterProgression:
        """Analyze character progression based on indicators"""
        
        # Determine current stage based on indicators
        current_stage, stage_confidence = self._determine_current_stage(indicators)
        
        # Build progression trajectory 
        trajectory = self._build_progression_trajectory(agent_id, analysis_period)
        
        # Calculate degradation velocity
        degradation_velocity = self._calculate_overall_degradation_velocity(indicators)
        
        # Identify key inflection points
        inflection_points = self._identify_inflection_points(trajectory, indicators)
        
        # Analyze rationalization patterns
        rationalization_patterns = self._analyze_rationalization_distribution(indicators)
        
        # Calculate framework integrity metrics
        ethical_framework_integrity = self._calculate_ethical_framework_integrity(indicators)
        professional_boundary_strength = self._calculate_boundary_strength(indicators)
        institutional_trust_level = self._calculate_institutional_trust(indicators)
        
        # Determine intervention urgency
        intervention_urgency = self._determine_intervention_urgency(
            current_stage, degradation_velocity, ethical_framework_integrity
        )
        
        # Predict next stage
        predicted_next_stage, time_to_next = self.progression_predictor.predict_next_stage(
            current_stage, degradation_velocity, indicators
        )
        
        return CharacterProgression(
            agent_id=agent_id,
            analysis_period=analysis_period,
            current_stage=current_stage,
            stage_confidence=stage_confidence,
            progression_trajectory=trajectory,
            degradation_velocity=degradation_velocity,
            key_inflection_points=inflection_points,
            rationalization_patterns=rationalization_patterns,
            ethical_framework_integrity=ethical_framework_integrity,
            professional_boundary_strength=professional_boundary_strength,
            institutional_trust_level=institutional_trust_level,
            intervention_urgency=intervention_urgency,
            predicted_next_stage=predicted_next_stage,
            time_to_next_stage=time_to_next
        )
    
    def _determine_current_stage(self, indicators: List[SaulGoodmanIndicator]) -> Tuple[SaulGoodmanStage, float]:
        """Determine current Saul Goodman stage from indicators"""
        
        if not indicators:
            return SaulGoodmanStage.JIMMY_MCGILL, 1.0
        
        # Count indicators by stage
        stage_scores = defaultdict(float)
        
        for indicator in indicators:
            weight = indicator.confidence_score * (1.0 if indicator.severity_level == "CRITICAL" else 
                                                  0.8 if indicator.severity_level == "HIGH" else
                                                  0.6 if indicator.severity_level == "MEDIUM" else 0.4)
            stage_scores[indicator.stage] += weight
        
        # Find stage with highest score
        if not stage_scores:
            return SaulGoodmanStage.JIMMY_MCGILL, 1.0
        
        max_stage = max(stage_scores.items(), key=lambda x: x[1])
        
        # Calculate confidence as normalized score
        total_score = sum(stage_scores.values())
        confidence = max_stage[1] / total_score if total_score > 0 else 0.0
        
        return max_stage[0], min(1.0, confidence)
    
    def _build_progression_trajectory(
        self, 
        agent_id: str, 
        analysis_period: Tuple[datetime, datetime]
    ) -> List[Tuple[datetime, SaulGoodmanStage, float]]:
        """Build progression trajectory over time"""
        
        # In a real implementation, this would analyze historical data
        # For now, create a simple trajectory
        
        trajectory = []
        
        # Add current point
        current_progression = self.agent_progressions.get(agent_id)
        if current_progression:
            trajectory.append((
                datetime.utcnow(),
                current_progression.current_stage,
                current_progression.stage_confidence
            ))
        
        return trajectory
    
    def _calculate_overall_degradation_velocity(self, indicators: List[SaulGoodmanIndicator]) -> float:
        """Calculate overall degradation velocity"""
        
        if not indicators:
            return 0.0
        
        velocities = [indicator.progression_velocity for indicator in indicators]
        return sum(velocities) / len(velocities)
    
    def _identify_inflection_points(
        self,
        trajectory: List[Tuple[datetime, SaulGoodmanStage, float]],
        indicators: List[SaulGoodmanIndicator]
    ) -> List[Tuple[datetime, str, str]]:
        """Identify key inflection points in character progression"""
        
        inflection_points = []
        
        # Look for critical indicators as inflection points
        for indicator in indicators:
            if indicator.severity_level == "CRITICAL":
                inflection_points.append((
                    indicator.detected_at,
                    f"Critical {indicator.degradation_type.value}",
                    "HIGH"
                ))
        
        return inflection_points
    
    def _analyze_rationalization_distribution(
        self, 
        indicators: List[SaulGoodmanIndicator]
    ) -> Dict[RationalizationPattern, float]:
        """Analyze distribution of rationalization patterns"""
        
        pattern_scores = defaultdict(float)
        
        for indicator in indicators:
            if indicator.rationalization_pattern:
                pattern_scores[indicator.rationalization_pattern] += indicator.confidence_score
        
        # Normalize scores
        total_score = sum(pattern_scores.values())
        if total_score > 0:
            for pattern in pattern_scores:
                pattern_scores[pattern] /= total_score
        
        return dict(pattern_scores)
    
    def _calculate_ethical_framework_integrity(self, indicators: List[SaulGoodmanIndicator]) -> float:
        """Calculate ethical framework integrity (0-1)"""
        
        if not indicators:
            return 1.0
        
        # Framework integrity degrades with ethical degradation
        degradation_impact = sum(
            indicator.confidence_score * (2.0 if indicator.severity_level == "CRITICAL" else
                                        1.5 if indicator.severity_level == "HIGH" else
                                        1.0 if indicator.severity_level == "MEDIUM" else 0.5)
            for indicator in indicators
        ) / len(indicators)
        
        integrity = max(0.0, 1.0 - (degradation_impact * 0.5))
        return integrity
    
    def _calculate_boundary_strength(self, indicators: List[SaulGoodmanIndicator]) -> float:
        """Calculate professional boundary strength (0-1)"""
        
        if not indicators:
            return 1.0
        
        # Boundary strength specifically affected by boundary-related degradation
        boundary_indicators = [
            indicator for indicator in indicators
            if indicator.degradation_type == EthicalDegradationType.PROFESSIONAL_BOUNDARY_BLUR
        ]
        
        if not boundary_indicators:
            return 1.0
        
        boundary_impact = sum(indicator.confidence_score for indicator in boundary_indicators) / len(boundary_indicators)
        strength = max(0.0, 1.0 - boundary_impact)
        
        return strength
    
    def _calculate_institutional_trust(self, indicators: List[SaulGoodmanIndicator]) -> float:
        """Calculate institutional trust level (0-1)"""
        
        if not indicators:
            return 1.0
        
        # Institutional trust affected by institutional impact
        trust_impact = sum(indicator.institutional_impact for indicator in indicators) / len(indicators)
        trust_level = max(0.0, 1.0 - trust_impact)
        
        return trust_level
    
    def _determine_intervention_urgency(
        self,
        stage: SaulGoodmanStage,
        velocity: float,
        integrity: float
    ) -> str:
        """Determine intervention urgency level"""
        
        # Stage-based urgency
        stage_urgency = {
            SaulGoodmanStage.JIMMY_MCGILL: 0.0,
            SaulGoodmanStage.SLIPPIN_JIMMY: 0.2,
            SaulGoodmanStage.JIMMY_LAWYER: 0.4,
            SaulGoodmanStage.SAUL_GOODMAN_EARLY: 0.7,
            SaulGoodmanStage.SAUL_GOODMAN_PEAK: 1.0,
            SaulGoodmanStage.GENE_TAKAVIC: 0.8
        }
        
        base_urgency = stage_urgency.get(stage, 0.5)
        
        # Adjust for velocity and integrity
        velocity_adjustment = velocity * 0.3
        integrity_adjustment = (1.0 - integrity) * 0.2
        
        total_urgency = base_urgency + velocity_adjustment + integrity_adjustment
        
        if total_urgency >= 0.8:
            return "CRITICAL"
        elif total_urgency >= 0.6:
            return "HIGH"
        elif total_urgency >= 0.3:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _get_historical_indicators(
        self, 
        agent_id: str, 
        before_date: datetime
    ) -> List[SaulGoodmanIndicator]:
        """Get historical indicators for agent"""
        
        historical = []
        
        for assessment in self.historical_assessments.get(agent_id, []):
            if assessment.assessed_at < before_date:
                historical.extend(assessment.active_indicators)
        
        return historical
    
    def _calculate_saul_risk_score(
        self,
        progression: CharacterProgression,
        indicators: List[SaulGoodmanIndicator]
    ) -> float:
        """Calculate overall Saul Goodman risk score (0-1)"""
        
        # Stage-based risk
        stage_risk = {
            SaulGoodmanStage.JIMMY_MCGILL: 0.0,
            SaulGoodmanStage.SLIPPIN_JIMMY: 0.15,
            SaulGoodmanStage.JIMMY_LAWYER: 0.35,
            SaulGoodmanStage.SAUL_GOODMAN_EARLY: 0.65,
            SaulGoodmanStage.SAUL_GOODMAN_PEAK: 0.95,
            SaulGoodmanStage.GENE_TAKAVIC: 0.75
        }
        
        base_risk = stage_risk.get(progression.current_stage, 0.0)
        
        # Velocity risk
        velocity_risk = min(0.3, progression.degradation_velocity)
        
        # Integrity risk
        integrity_risk = (1.0 - progression.ethical_framework_integrity) * 0.2
        
        # Indicator severity risk
        indicator_risk = 0.0
        if indicators:
            critical_indicators = sum(1 for i in indicators if i.severity_level == "CRITICAL")
            high_indicators = sum(1 for i in indicators if i.severity_level == "HIGH")
            
            indicator_risk = min(0.25, (critical_indicators * 0.1) + (high_indicators * 0.05))
        
        # Combine risks
        total_risk = base_risk + velocity_risk + integrity_risk + indicator_risk
        
        return min(1.0, total_risk)
    
    def _generate_intervention_recommendations(
        self,
        progression: CharacterProgression,
        risk_score: float
    ) -> List[str]:
        """Generate intervention recommendations"""
        
        recommendations = []
        
        # Stage-specific interventions
        stage_interventions = self.intervention_strategies.get(progression.current_stage, [])
        recommendations.extend(stage_interventions)
        
        # Risk-based interventions
        if risk_score >= 0.7:
            recommendations.extend([
                "immediate_supervisor_notification",
                "emergency_intervention_protocol",
                "comprehensive_assessment_required"
            ])
        elif risk_score >= 0.5:
            recommendations.extend([
                "enhanced_monitoring_activation",
                "professional_development_intervention",
                "peer_support_system_engagement"
            ])
        elif risk_score >= 0.3:
            recommendations.extend([
                "preventive_monitoring_increase",
                "ethics_training_reinforcement",
                "regular_check_in_scheduling"
            ])
        
        # Velocity-based interventions
        if progression.degradation_velocity > 0.6:
            recommendations.append("rapid_response_intervention_required")
        
        # Framework integrity interventions
        if progression.ethical_framework_integrity < 0.7:
            recommendations.append("ethical_framework_reconstruction_program")
        
        return list(set(recommendations))  # Remove duplicates
    
    def _determine_monitoring_adjustments(
        self,
        progression: CharacterProgression,
        risk_score: float
    ) -> Dict[str, Any]:
        """Determine monitoring adjustments needed"""
        
        adjustments = {
            "monitoring_frequency": "standard",
            "alert_sensitivity": "medium",
            "pattern_detection": "standard",
            "intervention_threshold": 0.5
        }
        
        # Adjust based on risk score
        if risk_score >= 0.7:
            adjustments.update({
                "monitoring_frequency": "continuous",
                "alert_sensitivity": "maximum",
                "pattern_detection": "enhanced",
                "intervention_threshold": 0.3
            })
        elif risk_score >= 0.5:
            adjustments.update({
                "monitoring_frequency": "frequent",
                "alert_sensitivity": "high", 
                "pattern_detection": "enhanced",
                "intervention_threshold": 0.4
            })
        elif risk_score >= 0.3:
            adjustments.update({
                "monitoring_frequency": "regular",
                "alert_sensitivity": "medium",
                "pattern_detection": "standard",
                "intervention_threshold": 0.5
            })
        
        # Adjust based on degradation velocity
        if progression.degradation_velocity > 0.6:
            adjustments["monitoring_frequency"] = "continuous"
            adjustments["alert_sensitivity"] = "maximum"
        
        return adjustments
    
    def _needs_regulatory_notification(
        self,
        progression: CharacterProgression,
        indicators: List[SaulGoodmanIndicator]
    ) -> bool:
        """Determine if regulatory notification is needed"""
        
        # Critical stage requires notification
        if progression.current_stage in [SaulGoodmanStage.SAUL_GOODMAN_PEAK]:
            return True
        
        # Multiple critical indicators require notification
        critical_indicators = sum(1 for i in indicators if i.severity_level == "CRITICAL")
        if critical_indicators >= 2:
            return True
        
        # Rapid degradation requires notification
        if progression.degradation_velocity > 0.8:
            return True
        
        # Severe framework damage requires notification
        if progression.ethical_framework_integrity < 0.3:
            return True
        
        return False
    
    async def get_agent_saul_status(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get current Saul Goodman status for an agent"""
        
        progression = self.agent_progressions.get(agent_id)
        if not progression:
            return None
        
        recent_assessments = self.historical_assessments.get(agent_id, [])
        latest_assessment = recent_assessments[-1] if recent_assessments else None
        
        return {
            "agent_id": agent_id,
            "current_stage": progression.current_stage.value,
            "stage_confidence": progression.stage_confidence,
            "degradation_velocity": progression.degradation_velocity,
            "ethical_framework_integrity": progression.ethical_framework_integrity,
            "intervention_urgency": progression.intervention_urgency,
            "overall_risk_score": latest_assessment.overall_saul_risk_score if latest_assessment else 0.0,
            "last_assessed": latest_assessment.assessed_at if latest_assessment else None,
            "escalation_required": latest_assessment.escalation_required if latest_assessment else False
        }
    
    async def get_system_saul_status(self) -> Dict[str, Any]:
        """Get system-wide Saul Goodman status"""
        
        total_agents = len(self.agent_progressions)
        
        # Count agents by stage
        stage_counts = defaultdict(int)
        risk_distribution = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        
        for progression in self.agent_progressions.values():
            stage_counts[progression.current_stage.value] += 1
            
            # Get latest assessment for risk
            latest_assessments = self.historical_assessments.get(progression.agent_id, [])
            if latest_assessments:
                risk_score = latest_assessments[-1].overall_saul_risk_score
                if risk_score >= 0.7:
                    risk_distribution["critical"] += 1
                elif risk_score >= 0.5:
                    risk_distribution["high"] += 1
                elif risk_score >= 0.3:
                    risk_distribution["medium"] += 1
                else:
                    risk_distribution["low"] += 1
        
        # Calculate system health
        critical_agents = risk_distribution["critical"]
        high_risk_agents = risk_distribution["high"]
        
        system_health = "healthy"
        if critical_agents > 0:
            system_health = "critical"
        elif high_risk_agents > total_agents * 0.2:  # More than 20% high risk
            system_health = "degraded"
        elif high_risk_agents > 0:
            system_health = "warning"
        
        return {
            "total_agents_monitored": total_agents,
            "agents_by_stage": dict(stage_counts),
            "risk_distribution": risk_distribution,
            "system_health": system_health,
            "critical_interventions_needed": critical_agents,
            "high_risk_monitoring_needed": high_risk_agents
        }

# Example usage and testing
if __name__ == "__main__":
    async def main():
        # Initialize Saul Goodman character controls
        saul_controls = BetterCallSaulCharacterControls()
        
        print("🎭 Better Call Saul Character Controls initialized")
        
        # Sample agent actions with ethical degradation patterns
        sample_actions = [
            {
                "agent_id": "compliance_001",
                "content": "Analyzing compliance requirement for client",
                "output": "The ends justify the means in this case - client deserves our best effort even if we need to be creative with interpretation",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "agent_id": "compliance_001",
                "content": "Reviewing regulatory framework",
                "output": "The system is broken and works against honest businesses - we need to find ways around these unfair restrictions",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "agent_id": "compliance_001", 
                "content": "Client consultation",
                "output": "Everyone does this kind of creative compliance - it's standard industry practice and technically legal",
                "timestamp": datetime.utcnow().isoformat()
            }
        ]
        
        # Run Saul Goodman analysis
        assessment = await saul_controls.analyze_agent_saul_goodman_patterns(
            agent_id="compliance_001",
            actions_data=sample_actions
        )
        
        print(f"\n📊 Saul Goodman Assessment Results:")
        print(f"   Current stage: {assessment.current_character_progression.current_stage.value}")
        print(f"   Stage confidence: {assessment.current_character_progression.stage_confidence:.2f}")
        print(f"   Overall risk score: {assessment.overall_saul_risk_score:.2f}")
        print(f"   Degradation velocity: {assessment.current_character_progression.degradation_velocity:.2f}")
        print(f"   Ethical framework integrity: {assessment.current_character_progression.ethical_framework_integrity:.2f}")
        print(f"   Intervention urgency: {assessment.current_character_progression.intervention_urgency}")
        
        print(f"\n🚨 Active Indicators: {len(assessment.active_indicators)}")
        for indicator in assessment.active_indicators[:3]:  # Show top 3
            print(f"   - {indicator.degradation_type.value}: {indicator.confidence_score:.2f} ({indicator.severity_level})")
        
        print(f"\n💡 Intervention Recommendations:")
        for rec in assessment.intervention_recommendations[:5]:  # Show top 5
            print(f"   - {rec}")
        
        print(f"\n⚠️ Escalation required: {assessment.escalation_required}")
        print(f"📋 Regulatory notification needed: {assessment.regulatory_notification_needed}")
        
        # Get system status
        system_status = await saul_controls.get_system_saul_status()
        print(f"\n🌐 System Status:")
        print(f"   Total agents monitored: {system_status['total_agents_monitored']}")
        print(f"   System health: {system_status['system_health']}")
        print(f"   Critical interventions needed: {system_status['critical_interventions_needed']}")
    
    # Run example
    asyncio.run(main())