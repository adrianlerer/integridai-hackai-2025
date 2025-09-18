#!/usr/bin/env python3
"""
Compliance Score Calculator (CSC) Agent
=======================================

Cálculo dinámico de scores de compliance organizacional con métricas en tiempo real,
dashboard ejecutivo y análisis de tendencias para toma de decisiones estratégicas.

Features:
- Real-time compliance scoring
- Multi-dimensional risk assessment
- Executive dashboard metrics
- Trend analysis and forecasting
- Regulatory framework scoring (Ley 27.401, EU AI Act, NIST AI RMF)
- Automated reporting and alerting
- Benchmark comparisons
- Compliance maturity assessment

Author: IntegridAI Suite
Version: 2.1.3
Compliance: Ley 27.401, EU AI Act, NIST AI RMF
"""

import asyncio
import hashlib
import json
import logging
import statistics
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Tuple, Any, Union
import math

# Configuration for fallback mode
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False


class ComplianceDimension(Enum):
    """Dimensiones del compliance scoring"""
    POLICY_ADHERENCE = "policy_adherence"
    RISK_MANAGEMENT = "risk_management"
    REGULATORY_COMPLIANCE = "regulatory_compliance"
    TRAINING_EFFECTIVENESS = "training_effectiveness"
    INCIDENT_MANAGEMENT = "incident_management"
    AUDIT_READINESS = "audit_readiness"
    THIRD_PARTY_MANAGEMENT = "third_party_management"
    GOVERNANCE_MATURITY = "governance_maturity"


class ScoreLevel(Enum):
    """Niveles de score de compliance"""
    EXCELLENT = "EXCELLENT"      # 90-100%
    GOOD = "GOOD"               # 80-89%
    ADEQUATE = "ADEQUATE"       # 70-79%
    NEEDS_IMPROVEMENT = "NEEDS_IMPROVEMENT"  # 60-69%
    POOR = "POOR"               # <60%


class TrendDirection(Enum):
    """Dirección de tendencia del compliance"""
    IMPROVING = "IMPROVING"
    STABLE = "STABLE"
    DECLINING = "DECLINING"
    VOLATILE = "VOLATILE"


@dataclass
class ComplianceMetric:
    """Métrica individual de compliance"""
    metric_id: str
    dimension: ComplianceDimension
    metric_name: str
    current_value: float
    target_value: float
    weight: float
    unit: str
    description: str
    data_source: str
    last_updated: datetime
    trend_7d: Optional[float]
    trend_30d: Optional[float]
    benchmark_value: Optional[float]


@dataclass
class DimensionScore:
    """Score por dimensión de compliance"""
    dimension: ComplianceDimension
    score: float
    level: ScoreLevel
    weight: float
    metrics_count: int
    contributing_metrics: List[str]
    trend: TrendDirection
    improvement_opportunities: List[str]
    regulatory_impact: str
    last_calculated: datetime


@dataclass
class ComplianceScorecard:
    """Scorecard completo de compliance organizacional"""
    scorecard_id: str
    organization_unit: str
    reporting_period: str
    overall_score: float
    overall_level: ScoreLevel
    overall_trend: TrendDirection
    dimension_scores: Dict[ComplianceDimension, DimensionScore]
    key_metrics: List[ComplianceMetric]
    risk_indicators: List[str]
    improvement_recommendations: List[str]
    regulatory_status: Dict[str, str]
    benchmark_comparison: Dict[str, float]
    forecast_30d: Optional[float]
    forecast_90d: Optional[float]
    confidence_interval: Tuple[float, float]
    data_quality_score: float
    processing_time_ms: int
    audit_trail: Dict[str, Any]
    created_at: datetime


@dataclass
class ComplianceDashboard:
    """Dashboard ejecutivo de compliance"""
    dashboard_id: str
    generated_for: str
    scorecard: ComplianceScorecard
    executive_summary: Dict[str, Any]
    key_insights: List[str]
    critical_alerts: List[str]
    action_items: List[Dict[str, Any]]
    performance_charts: Dict[str, List[Dict]]
    regulatory_updates: List[str]
    next_review_dates: Dict[str, datetime]
    stakeholder_notifications: List[str]
    created_at: datetime


class ComplianceScoreCalculator:
    """
    Compliance Score Calculator Agent
    
    Calcula scores dinámicos de compliance organizacional con métricas
    en tiempo real y análisis predictivo para toma de decisiones ejecutivas.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize CSC agent with configuration
        
        Args:
            config: Configuration dictionary with data sources, weights, etc.
        """
        self.agent_id = "CSC-001"
        self.agent_name = "Compliance Score Calculator"
        self.version = "v2.1.3"
        self.config = config
        
        # Setup logging
        self.logger = self._setup_secure_logger()
        
        # Initialize data sources
        self.data_sources = {
            "hr_systems": self._init_hr_source(),
            "training_platform": self._init_training_source(),
            "incident_management": self._init_incident_source(),
            "audit_system": self._init_audit_source(),
            "policy_system": self._init_policy_source(),
            "risk_system": self._init_risk_source(),
            "third_party_system": self._init_third_party_source()
        }
        
        # Compliance frameworks and weights
        self.framework_weights = {
            "ley_27401": 0.35,      # Argentine anti-corruption law
            "eu_ai_act": 0.25,      # EU AI Act compliance
            "nist_ai_rmf": 0.20,    # NIST AI Risk Management Framework
            "iso_37001": 0.20       # ISO 37001 Anti-bribery management
        }
        
        # Dimension weights (configurable per organization)
        self.dimension_weights = {
            ComplianceDimension.REGULATORY_COMPLIANCE: 0.25,
            ComplianceDimension.RISK_MANAGEMENT: 0.20,
            ComplianceDimension.POLICY_ADHERENCE: 0.15,
            ComplianceDimension.AUDIT_READINESS: 0.15,
            ComplianceDimension.THIRD_PARTY_MANAGEMENT: 0.10,
            ComplianceDimension.INCIDENT_MANAGEMENT: 0.08,
            ComplianceDimension.TRAINING_EFFECTIVENESS: 0.04,
            ComplianceDimension.GOVERNANCE_MATURITY: 0.03
        }
        
        # Scoring algorithms
        self.scoring_methods = {
            "weighted_average": self._calculate_weighted_average_score,
            "monte_carlo": self._calculate_monte_carlo_score,
            "regression_based": self._calculate_regression_score,
            "composite_risk": self._calculate_composite_risk_score
        }
        
        # Benchmarking data
        self.industry_benchmarks = self._load_industry_benchmarks()
        
        # Metric definitions
        self.metric_definitions = self._load_metric_definitions()
        
        # Resource limits
        self.resource_limits = {
            "max_concurrent_calculations": 20,
            "max_processing_time_s": 45,
            "max_memory_usage_mb": 1536,
            "max_data_points": 10000
        }
        
        # Performance metrics
        self.performance_metrics = {
            "scores_calculated": 0,
            "dashboards_generated": 0,
            "alerts_sent": 0,
            "calculation_time_avg": 0,
            "last_reset": datetime.utcnow()
        }
        
        self.logger.info({
            "action": "agent_initialized",
            "agent_id": self.agent_id,
            "version": self.version,
            "dimensions_configured": len(self.dimension_weights),
            "frameworks_supported": list(self.framework_weights.keys()),
            "data_sources_connected": len(self.data_sources),
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def calculate_compliance_score(self, organization_unit: str, 
                                       calculation_period: str = "current") -> ComplianceScorecard:
        """
        Calculate comprehensive compliance score for organization unit
        
        Args:
            organization_unit: Business unit or organization to score
            calculation_period: Period for calculation (current, monthly, quarterly)
            
        Returns:
            ComplianceScorecard with detailed scoring analysis
        """
        start_time = time.time()
        
        scorecard_id = self._generate_scorecard_id(organization_unit, calculation_period)
        
        self.logger.info({
            "action": "score_calculation_started",
            "agent_id": self.agent_id,
            "organization_unit": organization_unit,
            "calculation_period": calculation_period,
            "scorecard_id": scorecard_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        try:
            # Gather metrics from all data sources
            metrics_data = await self._gather_compliance_metrics(organization_unit, calculation_period)
            
            # Calculate dimension scores
            dimension_scores = {}
            
            for dimension in ComplianceDimension:
                dimension_score = await self._calculate_dimension_score(
                    dimension, metrics_data, organization_unit
                )
                dimension_scores[dimension] = dimension_score
            
            # Calculate overall score
            overall_score = self._calculate_overall_score(dimension_scores)
            overall_level = self._determine_score_level(overall_score)
            overall_trend = self._analyze_overall_trend(dimension_scores)
            
            # Generate insights and recommendations
            risk_indicators = self._identify_risk_indicators(dimension_scores, metrics_data)
            recommendations = self._generate_improvement_recommendations(dimension_scores)
            
            # Regulatory compliance status
            regulatory_status = self._assess_regulatory_status(dimension_scores, metrics_data)
            
            # Benchmarking
            benchmark_comparison = self._perform_benchmark_analysis(
                overall_score, dimension_scores, organization_unit
            )
            
            # Forecasting
            forecast_30d, forecast_90d = await self._generate_compliance_forecast(
                dimension_scores, metrics_data
            )
            
            # Confidence interval
            confidence_interval = self._calculate_confidence_interval(
                overall_score, dimension_scores, metrics_data
            )
            
            # Data quality assessment
            data_quality_score = self._assess_data_quality(metrics_data)
            
            # Processing time
            processing_time_ms = int((time.time() - start_time) * 1000)
            
            # Create audit trail
            audit_trail = self._create_audit_trail(
                organization_unit, calculation_period, dimension_scores,
                processing_time_ms, len(metrics_data)
            )
            
            # Build scorecard
            scorecard = ComplianceScorecard(
                scorecard_id=scorecard_id,
                organization_unit=organization_unit,
                reporting_period=calculation_period,
                overall_score=overall_score,
                overall_level=overall_level,
                overall_trend=overall_trend,
                dimension_scores=dimension_scores,
                key_metrics=list(metrics_data.values())[:10],  # Top 10 metrics
                risk_indicators=risk_indicators,
                improvement_recommendations=recommendations,
                regulatory_status=regulatory_status,
                benchmark_comparison=benchmark_comparison,
                forecast_30d=forecast_30d,
                forecast_90d=forecast_90d,
                confidence_interval=confidence_interval,
                data_quality_score=data_quality_score,
                processing_time_ms=processing_time_ms,
                audit_trail=audit_trail,
                created_at=datetime.utcnow()
            )
            
            # Log completion and update metrics
            self._log_scorecard_completion(scorecard)
            self._update_performance_metrics(scorecard)
            
            return scorecard
            
        except Exception as e:
            error_msg = f"Score calculation failed for {organization_unit}: {str(e)}"
            self.logger.error({
                "action": "score_calculation_error",
                "agent_id": self.agent_id,
                "organization_unit": organization_unit,
                "error": str(e),
                "scorecard_id": scorecard_id,
                "timestamp": datetime.utcnow().isoformat()
            })
            raise RuntimeError(error_msg) from e
    
    async def generate_executive_dashboard(self, scorecard: ComplianceScorecard,
                                         executive_role: str = "C-Level") -> ComplianceDashboard:
        """
        Generate executive dashboard from compliance scorecard
        
        Args:
            scorecard: Compliance scorecard to visualize
            executive_role: Target executive role (C-Level, Director, Manager)
            
        Returns:
            ComplianceDashboard with executive insights and visualizations
        """
        
        dashboard_id = self._generate_dashboard_id(scorecard, executive_role)
        
        self.logger.info({
            "action": "dashboard_generation_started",
            "agent_id": self.agent_id,
            "scorecard_id": scorecard.scorecard_id,
            "executive_role": executive_role,
            "dashboard_id": dashboard_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        try:
            # Generate executive summary
            executive_summary = self._generate_executive_summary(scorecard, executive_role)
            
            # Extract key insights
            key_insights = self._extract_key_insights(scorecard)
            
            # Identify critical alerts
            critical_alerts = self._identify_critical_alerts(scorecard)
            
            # Generate action items
            action_items = self._generate_action_items(scorecard, executive_role)
            
            # Create performance charts data
            performance_charts = self._generate_chart_data(scorecard)
            
            # Get regulatory updates
            regulatory_updates = await self._get_regulatory_updates()
            
            # Calculate next review dates
            next_review_dates = self._calculate_review_schedule(scorecard)
            
            # Determine stakeholder notifications
            stakeholder_notifications = self._determine_stakeholder_notifications(
                scorecard, executive_role
            )
            
            # Build dashboard
            dashboard = ComplianceDashboard(
                dashboard_id=dashboard_id,
                generated_for=executive_role,
                scorecard=scorecard,
                executive_summary=executive_summary,
                key_insights=key_insights,
                critical_alerts=critical_alerts,
                action_items=action_items,
                performance_charts=performance_charts,
                regulatory_updates=regulatory_updates,
                next_review_dates=next_review_dates,
                stakeholder_notifications=stakeholder_notifications,
                created_at=datetime.utcnow()
            )
            
            # Log dashboard generation
            self._log_dashboard_generation(dashboard)
            
            return dashboard
            
        except Exception as e:
            error_msg = f"Dashboard generation failed: {str(e)}"
            self.logger.error({
                "action": "dashboard_generation_error",
                "error": str(e),
                "scorecard_id": scorecard.scorecard_id,
                "timestamp": datetime.utcnow().isoformat()
            })
            raise RuntimeError(error_msg) from e
    
    async def _gather_compliance_metrics(self, organization_unit: str, 
                                       period: str) -> Dict[str, ComplianceMetric]:
        """Gather compliance metrics from all data sources"""
        
        metrics = {}
        
        # Gather metrics from each data source
        gathering_tasks = []
        
        for source_name, source_config in self.data_sources.items():
            task = self._gather_source_metrics(source_name, organization_unit, period)
            gathering_tasks.append(task)
        
        # Execute all gathering tasks
        source_results = await asyncio.gather(*gathering_tasks, return_exceptions=True)
        
        # Combine all metrics
        for i, result in enumerate(source_results):
            if isinstance(result, Exception):
                source_name = list(self.data_sources.keys())[i]
                self.logger.warning(f"Failed to gather metrics from {source_name}: {result}")
                continue
            
            source_metrics = result
            metrics.update(source_metrics)
        
        return metrics
    
    async def _gather_source_metrics(self, source_name: str, organization_unit: str,
                                   period: str) -> Dict[str, ComplianceMetric]:
        """Gather metrics from specific data source"""
        
        source_metrics = {}
        
        try:
            if source_name == "hr_systems":
                source_metrics.update(await self._gather_hr_metrics(organization_unit, period))
            
            elif source_name == "training_platform":
                source_metrics.update(await self._gather_training_metrics(organization_unit, period))
            
            elif source_name == "incident_management":
                source_metrics.update(await self._gather_incident_metrics(organization_unit, period))
            
            elif source_name == "audit_system":
                source_metrics.update(await self._gather_audit_metrics(organization_unit, period))
            
            elif source_name == "policy_system":
                source_metrics.update(await self._gather_policy_metrics(organization_unit, period))
            
            elif source_name == "risk_system":
                source_metrics.update(await self._gather_risk_metrics(organization_unit, period))
            
            elif source_name == "third_party_system":
                source_metrics.update(await self._gather_third_party_metrics(organization_unit, period))
            
            await asyncio.sleep(0.1)  # Simulate API latency
            
            return source_metrics
            
        except Exception as e:
            self.logger.warning(f"Failed to gather metrics from {source_name}: {e}")
            return {}
    
    async def _gather_hr_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather HR-related compliance metrics"""
        
        metrics = {}
        
        # Training completion rate
        metrics["training_completion_rate"] = ComplianceMetric(
            metric_id="HR-001",
            dimension=ComplianceDimension.TRAINING_EFFECTIVENESS,
            metric_name="Training Completion Rate",
            current_value=0.87,  # 87%
            target_value=0.95,   # 95%
            weight=0.8,
            unit="percentage",
            description="Percentage of employees who completed mandatory compliance training",
            data_source="hr_systems",
            last_updated=datetime.utcnow(),
            trend_7d=0.02,       # +2% improvement
            trend_30d=0.05,      # +5% improvement
            benchmark_value=0.82  # Industry benchmark
        )
        
        # Code of conduct violations
        metrics["conduct_violations"] = ComplianceMetric(
            metric_id="HR-002",
            dimension=ComplianceDimension.POLICY_ADHERENCE,
            metric_name="Code of Conduct Violations",
            current_value=3.0,   # 3 violations per 1000 employees
            target_value=2.0,    # Target: <2 per 1000
            weight=0.7,
            unit="per_1000_employees",
            description="Code of conduct violations per 1000 employees",
            data_source="hr_systems",
            last_updated=datetime.utcnow(),
            trend_7d=-0.5,       # Decreasing (good)
            trend_30d=-1.0,      # Decreasing trend
            benchmark_value=4.2   # Industry benchmark
        )
        
        return metrics
    
    async def _gather_training_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather training effectiveness metrics"""
        
        metrics = {}
        
        # Anti-corruption training effectiveness
        metrics["anticorruption_training_score"] = ComplianceMetric(
            metric_id="TRN-001",
            dimension=ComplianceDimension.TRAINING_EFFECTIVENESS,
            metric_name="Anti-Corruption Training Score",
            current_value=8.3,   # Score out of 10
            target_value=9.0,    # Target: >9.0
            weight=0.9,
            unit="score_out_of_10",
            description="Average score on anti-corruption training assessments",
            data_source="training_platform",
            last_updated=datetime.utcnow(),
            trend_7d=0.1,        # Slight improvement
            trend_30d=0.3,       # Good improvement
            benchmark_value=7.8   # Industry benchmark
        )
        
        return metrics
    
    async def _gather_incident_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather incident management metrics"""
        
        metrics = {}
        
        # Incident response time
        metrics["incident_response_time"] = ComplianceMetric(
            metric_id="INC-001",
            dimension=ComplianceDimension.INCIDENT_MANAGEMENT,
            metric_name="Average Incident Response Time",
            current_value=4.2,   # 4.2 hours
            target_value=2.0,    # Target: <2 hours
            weight=0.8,
            unit="hours",
            description="Average time to respond to compliance incidents",
            data_source="incident_management",
            last_updated=datetime.utcnow(),
            trend_7d=-0.3,       # Improving (decreasing)
            trend_30d=-0.8,      # Good improvement
            benchmark_value=6.1   # Industry benchmark
        )
        
        # Incident closure rate
        metrics["incident_closure_rate"] = ComplianceMetric(
            metric_id="INC-002",
            dimension=ComplianceDimension.INCIDENT_MANAGEMENT,
            metric_name="Incident Closure Rate",
            current_value=0.92,  # 92%
            target_value=0.98,   # Target: >98%
            weight=0.7,
            unit="percentage",
            description="Percentage of incidents closed within SLA",
            data_source="incident_management",
            last_updated=datetime.utcnow(),
            trend_7d=0.01,       # Slight improvement
            trend_30d=0.04,      # Good improvement
            benchmark_value=0.85  # Industry benchmark
        )
        
        return metrics
    
    async def _gather_audit_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather audit readiness metrics"""
        
        metrics = {}
        
        # Audit findings closure rate
        metrics["audit_findings_closure"] = ComplianceMetric(
            metric_id="AUD-001",
            dimension=ComplianceDimension.AUDIT_READINESS,
            metric_name="Audit Findings Closure Rate",
            current_value=0.78,  # 78%
            target_value=0.90,   # Target: >90%
            weight=0.9,
            unit="percentage",
            description="Percentage of audit findings closed within agreed timeframes",
            data_source="audit_system",
            last_updated=datetime.utcnow(),
            trend_7d=0.02,       # Improving
            trend_30d=0.08,      # Good improvement
            benchmark_value=0.75  # Industry benchmark
        )
        
        return metrics
    
    async def _gather_policy_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather policy adherence metrics"""
        
        metrics = {}
        
        # Policy compliance rate
        metrics["policy_compliance_rate"] = ComplianceMetric(
            metric_id="POL-001",
            dimension=ComplianceDimension.POLICY_ADHERENCE,
            metric_name="Overall Policy Compliance Rate",
            current_value=0.89,  # 89%
            target_value=0.95,   # Target: >95%
            weight=1.0,
            unit="percentage",
            description="Percentage of policy requirements met across all policies",
            data_source="policy_system",
            last_updated=datetime.utcnow(),
            trend_7d=0.01,       # Slight improvement
            trend_30d=0.03,      # Steady improvement
            benchmark_value=0.83  # Industry benchmark
        )
        
        return metrics
    
    async def _gather_risk_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather risk management metrics"""
        
        metrics = {}
        
        # Risk assessment coverage
        metrics["risk_assessment_coverage"] = ComplianceMetric(
            metric_id="RSK-001",
            dimension=ComplianceDimension.RISK_MANAGEMENT,
            metric_name="Risk Assessment Coverage",
            current_value=0.85,  # 85%
            target_value=0.95,   # Target: >95%
            weight=0.8,
            unit="percentage",
            description="Percentage of business processes with completed risk assessments",
            data_source="risk_system",
            last_updated=datetime.utcnow(),
            trend_7d=0.01,       # Slow improvement
            trend_30d=0.05,      # Good improvement
            benchmark_value=0.78  # Industry benchmark
        )
        
        # High-risk issues resolution time
        metrics["high_risk_resolution_time"] = ComplianceMetric(
            metric_id="RSK-002",
            dimension=ComplianceDimension.RISK_MANAGEMENT,
            metric_name="High-Risk Issues Resolution Time",
            current_value=12.5,  # 12.5 days
            target_value=7.0,    # Target: <7 days
            weight=0.9,
            unit="days",
            description="Average time to resolve high-risk compliance issues",
            data_source="risk_system",
            last_updated=datetime.utcnow(),
            trend_7d=-1.0,       # Improving (decreasing)
            trend_30d=-2.5,      # Good improvement
            benchmark_value=15.2  # Industry benchmark
        )
        
        return metrics
    
    async def _gather_third_party_metrics(self, organization_unit: str, period: str) -> Dict[str, ComplianceMetric]:
        """Gather third-party management metrics"""
        
        metrics = {}
        
        # Third-party due diligence coverage
        metrics["third_party_dd_coverage"] = ComplianceMetric(
            metric_id="3PT-001",
            dimension=ComplianceDimension.THIRD_PARTY_MANAGEMENT,
            metric_name="Third-Party Due Diligence Coverage",
            current_value=0.82,  # 82%
            target_value=0.95,   # Target: >95%
            weight=1.0,
            unit="percentage",
            description="Percentage of third parties with completed due diligence",
            data_source="third_party_system",
            last_updated=datetime.utcnow(),
            trend_7d=0.02,       # Improving
            trend_30d=0.07,      # Good improvement
            benchmark_value=0.76  # Industry benchmark
        )
        
        return metrics
    
    async def _calculate_dimension_score(self, dimension: ComplianceDimension,
                                       metrics_data: Dict[str, ComplianceMetric],
                                       organization_unit: str) -> DimensionScore:
        """Calculate score for specific compliance dimension"""
        
        # Get metrics for this dimension
        dimension_metrics = [
            metric for metric in metrics_data.values()
            if metric.dimension == dimension
        ]
        
        if not dimension_metrics:
            # No metrics for this dimension - use default scoring
            return self._create_default_dimension_score(dimension)
        
        # Calculate weighted average score
        total_weighted_score = 0.0
        total_weight = 0.0
        
        for metric in dimension_metrics:
            # Normalize metric value to 0-1 scale
            if metric.unit == "percentage":
                normalized_value = metric.current_value
            elif metric.unit in ["hours", "days"]:
                # For time-based metrics, lower is better
                if metric.current_value <= metric.target_value:
                    normalized_value = 1.0
                else:
                    normalized_value = max(0.0, metric.target_value / metric.current_value)
            elif "per_1000" in metric.unit:
                # For rate-based metrics, lower is better
                if metric.current_value <= metric.target_value:
                    normalized_value = 1.0
                else:
                    normalized_value = max(0.0, metric.target_value / metric.current_value)
            else:
                # For score-based metrics
                normalized_value = metric.current_value / metric.target_value
            
            # Apply metric weight
            weighted_score = normalized_value * metric.weight
            total_weighted_score += weighted_score
            total_weight += metric.weight
        
        # Calculate final dimension score
        if total_weight > 0:
            dimension_score_value = min(1.0, total_weighted_score / total_weight)
        else:
            dimension_score_value = 0.5  # Default neutral score
        
        # Convert to 0-100 scale
        dimension_score_value *= 100
        
        # Determine score level
        score_level = self._determine_score_level(dimension_score_value)
        
        # Analyze trend
        trend = self._analyze_dimension_trend(dimension_metrics)
        
        # Generate improvement opportunities
        improvement_opportunities = self._generate_dimension_improvements(dimension, dimension_metrics)
        
        # Assess regulatory impact
        regulatory_impact = self._assess_dimension_regulatory_impact(dimension)
        
        return DimensionScore(
            dimension=dimension,
            score=dimension_score_value,
            level=score_level,
            weight=self.dimension_weights.get(dimension, 0.1),
            metrics_count=len(dimension_metrics),
            contributing_metrics=[metric.metric_id for metric in dimension_metrics],
            trend=trend,
            improvement_opportunities=improvement_opportunities,
            regulatory_impact=regulatory_impact,
            last_calculated=datetime.utcnow()
        )
    
    def _calculate_overall_score(self, dimension_scores: Dict[ComplianceDimension, DimensionScore]) -> float:
        """Calculate weighted overall compliance score"""
        
        total_weighted_score = 0.0
        total_weight = 0.0
        
        for dimension, dimension_score in dimension_scores.items():
            weight = self.dimension_weights.get(dimension, 0.1)
            weighted_score = dimension_score.score * weight
            total_weighted_score += weighted_score
            total_weight += weight
        
        if total_weight > 0:
            overall_score = total_weighted_score / total_weight
        else:
            overall_score = 50.0  # Default neutral score
        
        return min(100.0, overall_score)
    
    def _determine_score_level(self, score: float) -> ScoreLevel:
        """Determine score level based on score value"""
        
        if score >= 90.0:
            return ScoreLevel.EXCELLENT
        elif score >= 80.0:
            return ScoreLevel.GOOD
        elif score >= 70.0:
            return ScoreLevel.ADEQUATE
        elif score >= 60.0:
            return ScoreLevel.NEEDS_IMPROVEMENT
        else:
            return ScoreLevel.POOR
    
    def _analyze_overall_trend(self, dimension_scores: Dict[ComplianceDimension, DimensionScore]) -> TrendDirection:
        """Analyze overall trend from dimension trends"""
        
        trend_values = []
        for dimension_score in dimension_scores.values():
            if dimension_score.trend == TrendDirection.IMPROVING:
                trend_values.append(1)
            elif dimension_score.trend == TrendDirection.STABLE:
                trend_values.append(0)
            elif dimension_score.trend == TrendDirection.DECLINING:
                trend_values.append(-1)
            else:  # VOLATILE
                trend_values.append(0)
        
        if not trend_values:
            return TrendDirection.STABLE
        
        avg_trend = sum(trend_values) / len(trend_values)
        
        if avg_trend > 0.3:
            return TrendDirection.IMPROVING
        elif avg_trend < -0.3:
            return TrendDirection.DECLINING
        else:
            return TrendDirection.STABLE
    
    def _analyze_dimension_trend(self, metrics: List[ComplianceMetric]) -> TrendDirection:
        """Analyze trend for specific dimension"""
        
        if not metrics:
            return TrendDirection.STABLE
        
        trends_30d = [m.trend_30d for m in metrics if m.trend_30d is not None]
        
        if not trends_30d:
            return TrendDirection.STABLE
        
        avg_trend = sum(trends_30d) / len(trends_30d)
        trend_volatility = statistics.stdev(trends_30d) if len(trends_30d) > 1 else 0
        
        # High volatility indicates volatile trend
        if trend_volatility > 0.1:
            return TrendDirection.VOLATILE
        
        # Determine trend direction
        if avg_trend > 0.05:  # 5% improvement threshold
            return TrendDirection.IMPROVING
        elif avg_trend < -0.05:  # 5% decline threshold
            return TrendDirection.DECLINING
        else:
            return TrendDirection.STABLE
    
    # Additional utility methods would continue here...
    
    def _create_default_dimension_score(self, dimension: ComplianceDimension) -> DimensionScore:
        """Create default score for dimension with no metrics"""
        
        return DimensionScore(
            dimension=dimension,
            score=50.0,  # Neutral score
            level=ScoreLevel.NEEDS_IMPROVEMENT,
            weight=self.dimension_weights.get(dimension, 0.1),
            metrics_count=0,
            contributing_metrics=[],
            trend=TrendDirection.STABLE,
            improvement_opportunities=[f"Implement metrics tracking for {dimension.value}"],
            regulatory_impact="Unknown - no metrics available",
            last_calculated=datetime.utcnow()
        )
    
    def _generate_dimension_improvements(self, dimension: ComplianceDimension, 
                                       metrics: List[ComplianceMetric]) -> List[str]:
        """Generate improvement opportunities for dimension"""
        
        improvements = []
        
        # Check metrics that are below target
        underperforming_metrics = [m for m in metrics if m.current_value < m.target_value * 0.9]
        
        for metric in underperforming_metrics[:3]:  # Top 3 improvement opportunities
            gap_percentage = ((metric.target_value - metric.current_value) / metric.target_value) * 100
            improvements.append(
                f"Improve {metric.metric_name}: {gap_percentage:.1f}% gap to target"
            )
        
        # Dimension-specific recommendations
        if dimension == ComplianceDimension.TRAINING_EFFECTIVENESS:
            improvements.append("Enhance training programs and assessment methods")
        elif dimension == ComplianceDimension.RISK_MANAGEMENT:
            improvements.append("Implement proactive risk identification and mitigation")
        elif dimension == ComplianceDimension.THIRD_PARTY_MANAGEMENT:
            improvements.append("Accelerate third-party due diligence processes")
        
        return improvements[:5]  # Limit to top 5
    
    def _assess_dimension_regulatory_impact(self, dimension: ComplianceDimension) -> str:
        """Assess regulatory impact for dimension"""
        
        regulatory_mappings = {
            ComplianceDimension.REGULATORY_COMPLIANCE: "Direct regulatory compliance impact",
            ComplianceDimension.ANTI_CORRUPTION: "Ley 27.401 compliance requirement",
            ComplianceDimension.THIRD_PARTY_MANAGEMENT: "Ley 27.401 Art. 23.b requirement",
            ComplianceDimension.RISK_MANAGEMENT: "EU AI Act risk management requirement",
            ComplianceDimension.AUDIT_READINESS: "Regulatory audit preparation",
            ComplianceDimension.POLICY_ADHERENCE: "Internal policy compliance monitoring"
        }
        
        return regulatory_mappings.get(dimension, "Operational compliance impact")
    
    def _identify_risk_indicators(self, dimension_scores: Dict[ComplianceDimension, DimensionScore],
                                 metrics_data: Dict[str, ComplianceMetric]) -> List[str]:
        """Identify key risk indicators from scoring analysis"""
        
        risk_indicators = []
        
        # Check for poor performing dimensions
        poor_dimensions = [
            d for d, score in dimension_scores.items()
            if score.level in [ScoreLevel.POOR, ScoreLevel.NEEDS_IMPROVEMENT]
        ]
        
        for dimension in poor_dimensions:
            risk_indicators.append(f"Poor performance in {dimension.value}")
        
        # Check for declining trends
        declining_dimensions = [
            d for d, score in dimension_scores.items()
            if score.trend == TrendDirection.DECLINING
        ]
        
        for dimension in declining_dimensions:
            risk_indicators.append(f"Declining trend in {dimension.value}")
        
        # Check for critical metric violations
        critical_metrics = [
            m for m in metrics_data.values()
            if m.current_value < m.target_value * 0.7  # More than 30% below target
        ]
        
        for metric in critical_metrics[:3]:  # Top 3 critical metrics
            risk_indicators.append(f"Critical gap in {metric.metric_name}")
        
        return risk_indicators[:7]  # Limit to top 7 indicators
    
    def _generate_improvement_recommendations(self, dimension_scores: Dict[ComplianceDimension, DimensionScore]) -> List[str]:
        """Generate actionable improvement recommendations"""
        
        recommendations = []
        
        # Priority recommendations based on regulatory impact
        regulatory_dimensions = [
            ComplianceDimension.REGULATORY_COMPLIANCE,
            ComplianceDimension.THIRD_PARTY_MANAGEMENT,
            ComplianceDimension.RISK_MANAGEMENT
        ]
        
        for dimension in regulatory_dimensions:
            if dimension in dimension_scores:
                score = dimension_scores[dimension]
                if score.level in [ScoreLevel.POOR, ScoreLevel.NEEDS_IMPROVEMENT]:
                    recommendations.append(
                        f"PRIORITY: Address {dimension.value} - regulatory compliance at risk"
                    )
        
        # General recommendations by score level
        poor_scores = [
            (d, s) for d, s in dimension_scores.items()
            if s.level == ScoreLevel.POOR
        ]
        
        for dimension, score in poor_scores[:2]:  # Top 2 poor scores
            recommendations.append(
                f"Immediate action required: {dimension.value} (Score: {score.score:.1f})"
            )
        
        # Trend-based recommendations
        declining_scores = [
            (d, s) for d, s in dimension_scores.items()
            if s.trend == TrendDirection.DECLINING
        ]
        
        for dimension, score in declining_scores[:2]:  # Top 2 declining trends
            recommendations.append(
                f"Reverse declining trend in {dimension.value}"
            )
        
        return recommendations[:8]  # Limit to top 8 recommendations
    
    def _assess_regulatory_status(self, dimension_scores: Dict[ComplianceDimension, DimensionScore],
                                 metrics_data: Dict[str, ComplianceMetric]) -> Dict[str, str]:
        """Assess regulatory compliance status"""
        
        regulatory_status = {}
        
        # Ley 27.401 compliance assessment
        anti_corruption_score = dimension_scores.get(
            ComplianceDimension.REGULATORY_COMPLIANCE, None
        )
        
        if anti_corruption_score and anti_corruption_score.score >= 80:
            regulatory_status["ley_27401"] = "COMPLIANT"
        elif anti_corruption_score and anti_corruption_score.score >= 70:
            regulatory_status["ley_27401"] = "PARTIALLY_COMPLIANT"
        else:
            regulatory_status["ley_27401"] = "NON_COMPLIANT"
        
        # EU AI Act compliance assessment
        risk_mgmt_score = dimension_scores.get(ComplianceDimension.RISK_MANAGEMENT, None)
        governance_score = dimension_scores.get(ComplianceDimension.GOVERNANCE_MATURITY, None)
        
        avg_ai_score = 0
        if risk_mgmt_score and governance_score:
            avg_ai_score = (risk_mgmt_score.score + governance_score.score) / 2
        elif risk_mgmt_score:
            avg_ai_score = risk_mgmt_score.score
        
        if avg_ai_score >= 80:
            regulatory_status["eu_ai_act"] = "COMPLIANT"
        elif avg_ai_score >= 70:
            regulatory_status["eu_ai_act"] = "PARTIALLY_COMPLIANT"
        else:
            regulatory_status["eu_ai_act"] = "NON_COMPLIANT"
        
        # NIST AI RMF compliance assessment
        if avg_ai_score >= 75:
            regulatory_status["nist_ai_rmf"] = "MATURE"
        elif avg_ai_score >= 60:
            regulatory_status["nist_ai_rmf"] = "DEVELOPING"
        else:
            regulatory_status["nist_ai_rmf"] = "INITIAL"
        
        return regulatory_status
    
    # Additional methods continue with similar implementation patterns...
    
    def _setup_secure_logger(self) -> logging.Logger:
        """Setup secure logger for compliance scoring audit trails"""
        
        logger = logging.getLogger(f"IntegridAI.CSC.{self.agent_id}")
        logger.setLevel(logging.INFO)
        
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        return logger
    
    def _generate_scorecard_id(self, organization_unit: str, period: str) -> str:
        """Generate unique scorecard ID"""
        timestamp = datetime.utcnow().isoformat()
        data = f"{self.agent_id}:{organization_unit}:{period}:{timestamp}"
        return f"SCORECARD-{hashlib.sha256(data.encode()).hexdigest()[:16]}"
    
    def _generate_dashboard_id(self, scorecard: ComplianceScorecard, executive_role: str) -> str:
        """Generate unique dashboard ID"""
        timestamp = datetime.utcnow().isoformat()
        data = f"{scorecard.scorecard_id}:{executive_role}:{timestamp}"
        return f"DASH-{hashlib.sha256(data.encode()).hexdigest()[:16]}"
    
    def _create_audit_trail(self, organization_unit: str, calculation_period: str,
                          dimension_scores: Dict[ComplianceDimension, DimensionScore],
                          processing_time_ms: int, metrics_count: int) -> Dict[str, Any]:
        """Create comprehensive audit trail for compliance scoring"""
        
        return {
            "calculation_method": "weighted_multi_dimensional_scoring",
            "agent_version": self.version,
            "organization_unit": organization_unit,
            "calculation_period": calculation_period,
            "dimensions_evaluated": len(dimension_scores),
            "metrics_processed": metrics_count,
            "framework_weights": self.framework_weights,
            "dimension_weights": {d.value: w for d, w in self.dimension_weights.items()},
            "processing_metrics": {
                "processing_time_ms": processing_time_ms,
                "memory_usage_mb": self._get_memory_usage(),
                "data_sources_queried": len(self.data_sources)
            },
            "compliance_frameworks": ["ley_27401", "eu_ai_act", "nist_ai_rmf"],
            "regulatory_requirements": {
                "ley_27401_scoring": "Compliance scoring per Art. 23 requirements",
                "audit_retention_years": 7,
                "score_calculation_transparency": "Full audit trail maintained"
            }
        }
    
    def _log_scorecard_completion(self, scorecard: ComplianceScorecard):
        """Log scorecard completion for audit trail"""
        
        self.logger.info({
            "action": "compliance_scorecard_calculated",
            "agent_id": self.agent_id,
            "scorecard_id": scorecard.scorecard_id,
            "organization_unit": scorecard.organization_unit,
            "overall_score": scorecard.overall_score,
            "overall_level": scorecard.overall_level.value,
            "dimensions_scored": len(scorecard.dimension_scores),
            "risk_indicators_identified": len(scorecard.risk_indicators),
            "processing_time_ms": scorecard.processing_time_ms,
            "data_quality_score": scorecard.data_quality_score,
            "timestamp": datetime.utcnow().isoformat(),
            "compliance_tags": ["ley_27401_compliant", "automated_scoring", "audit_logged"]
        })
    
    def _log_dashboard_generation(self, dashboard: ComplianceDashboard):
        """Log dashboard generation for audit trail"""
        
        self.logger.info({
            "action": "executive_dashboard_generated",
            "agent_id": self.agent_id,
            "dashboard_id": dashboard.dashboard_id,
            "generated_for": dashboard.generated_for,
            "scorecard_id": dashboard.scorecard.scorecard_id,
            "critical_alerts": len(dashboard.critical_alerts),
            "action_items": len(dashboard.action_items),
            "stakeholder_notifications": len(dashboard.stakeholder_notifications),
            "timestamp": datetime.utcnow().isoformat()
        })
    
    def _update_performance_metrics(self, scorecard: ComplianceScorecard):
        """Update agent performance metrics"""
        
        self.performance_metrics["scores_calculated"] += 1
        
        # Update average calculation time
        current_avg = self.performance_metrics["calculation_time_avg"]
        scores_count = self.performance_metrics["scores_calculated"]
        new_avg = ((current_avg * (scores_count - 1)) + scorecard.processing_time_ms) / scores_count
        self.performance_metrics["calculation_time_avg"] = new_avg
        
        # Log performance metrics periodically
        if self.performance_metrics["scores_calculated"] % 50 == 0:
            self.logger.info({
                "action": "agent_performance_metrics",
                "agent_id": self.agent_id,
                "metrics": self.performance_metrics,
                "timestamp": datetime.utcnow().isoformat()
            })
    
    def _get_memory_usage(self) -> int:
        """Get current memory usage in MB"""
        # In production: use psutil
        return 512  # Simulated memory usage
    
    # Data source initialization methods
    
    def _init_hr_source(self) -> Dict:
        """Initialize HR systems data source"""
        return {
            "name": "HR_SYSTEMS",
            "endpoint": self.config.get("hr_endpoint", "https://hr.company.com/api"),
            "api_key": self.config.get("hr_api_key", "demo-hr-key"),
            "timeout": 20
        }
    
    def _init_training_source(self) -> Dict:
        """Initialize training platform data source"""
        return {
            "name": "TRAINING_PLATFORM",
            "endpoint": self.config.get("training_endpoint", "https://training.company.com/api"),
            "api_key": self.config.get("training_api_key", "demo-training-key"),
            "timeout": 15
        }
    
    def _init_incident_source(self) -> Dict:
        """Initialize incident management data source"""
        return {
            "name": "INCIDENT_MANAGEMENT",
            "endpoint": self.config.get("incident_endpoint", "https://incidents.company.com/api"),
            "api_key": self.config.get("incident_api_key", "demo-incident-key"),
            "timeout": 10
        }
    
    def _init_audit_source(self) -> Dict:
        """Initialize audit system data source"""
        return {
            "name": "AUDIT_SYSTEM",
            "endpoint": self.config.get("audit_endpoint", "https://audit.company.com/api"),
            "api_key": self.config.get("audit_api_key", "demo-audit-key"),
            "timeout": 25
        }
    
    def _init_policy_source(self) -> Dict:
        """Initialize policy system data source"""
        return {
            "name": "POLICY_SYSTEM",
            "endpoint": self.config.get("policy_endpoint", "https://policies.company.com/api"),
            "api_key": self.config.get("policy_api_key", "demo-policy-key"),
            "timeout": 15
        }
    
    def _init_risk_source(self) -> Dict:
        """Initialize risk management data source"""
        return {
            "name": "RISK_SYSTEM",
            "endpoint": self.config.get("risk_endpoint", "https://risk.company.com/api"),
            "api_key": self.config.get("risk_api_key", "demo-risk-key"),
            "timeout": 20
        }
    
    def _init_third_party_source(self) -> Dict:
        """Initialize third-party management data source"""
        return {
            "name": "THIRD_PARTY_SYSTEM",
            "endpoint": self.config.get("third_party_endpoint", "https://thirdparty.company.com/api"),
            "api_key": self.config.get("third_party_api_key", "demo-3pt-key"),
            "timeout": 30
        }
    
    def _load_industry_benchmarks(self) -> Dict[str, float]:
        """Load industry benchmark data"""
        
        # In production: load from external benchmark providers
        return {
            "financial_services": {
                "overall_compliance": 78.5,
                "training_effectiveness": 82.1,
                "incident_management": 75.3,
                "third_party_management": 71.2
            },
            "manufacturing": {
                "overall_compliance": 74.2,
                "training_effectiveness": 79.8,
                "incident_management": 73.1,
                "third_party_management": 68.7
            },
            "technology": {
                "overall_compliance": 81.3,
                "training_effectiveness": 85.4,
                "incident_management": 78.9,
                "third_party_management": 76.1
            }
        }
    
    def _load_metric_definitions(self) -> Dict[str, Dict]:
        """Load metric definitions and calculation methods"""
        
        # In production: load from configuration database
        return {
            "training_completion_rate": {
                "calculation": "completed_training / total_employees",
                "frequency": "monthly",
                "threshold_excellent": 0.95,
                "threshold_good": 0.85,
                "threshold_adequate": 0.75
            },
            "incident_response_time": {
                "calculation": "sum(response_times) / count(incidents)",
                "frequency": "weekly",
                "threshold_excellent": 2.0,
                "threshold_good": 4.0,
                "threshold_adequate": 8.0
            }
        }


# Health check for Kubernetes deployment
class CSCHealthCheck:
    """Health check endpoints for CSC agent"""
    
    def __init__(self, csc_agent: ComplianceScoreCalculator):
        self.agent = csc_agent
    
    def health_check(self) -> Dict[str, Any]:
        """Basic health check"""
        return {
            "status": "healthy",
            "agent_id": self.agent.agent_id,
            "version": self.agent.version,
            "data_sources_configured": len(self.agent.data_sources),
            "frameworks_supported": len(self.agent.framework_weights),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def readiness_check(self) -> Dict[str, Any]:
        """Readiness check for Kubernetes"""
        
        # Check data source connectivity
        sources_ready = True
        source_status = {}
        
        for source_name, source_config in self.agent.data_sources.items():
            # In production: test actual connectivity
            source_status[source_name] = "ready"
        
        return {
            "status": "ready" if sources_ready else "not_ready",
            "agent_id": self.agent.agent_id,
            "data_sources": source_status,
            "dimension_weights_configured": len(self.agent.dimension_weights),
            "timestamp": datetime.utcnow().isoformat()
        }


# Example usage
if __name__ == "__main__":
    
    # Configuration
    config = {
        "hr_endpoint": "https://hr.company.com/api",
        "hr_api_key": "demo-hr-key",
        "training_endpoint": "https://training.company.com/api",
        "training_api_key": "demo-training-key",
        "incident_endpoint": "https://incidents.company.com/api",
        "incident_api_key": "demo-incident-key",
        "audit_endpoint": "https://audit.company.com/api",
        "audit_api_key": "demo-audit-key"
    }
    
    # Initialize CSC agent
    csc = ComplianceScoreCalculator(config)
    
    # Run compliance scoring
    async def run_demo():
        print("📊 Starting Compliance Score Calculation...")
        print(f"📋 Agent: {csc.agent_name} v{csc.version}")
        print(f"🏢 Organization: Global Corporate Division")
        print(f"📅 Period: Current Quarter")
        print("=" * 70)
        
        try:
            # Calculate compliance scorecard
            scorecard = await csc.calculate_compliance_score(
                organization_unit="Global Corporate Division",
                calculation_period="current"
            )
            
            print(f"✅ Compliance scoring completed!")
            print(f"📊 Overall Score: {scorecard.overall_score:.1f}/100")
            print(f"🎯 Overall Level: {scorecard.overall_level.value}")
            print(f"📈 Overall Trend: {scorecard.overall_trend.value}")
            print(f"⏱️  Processing Time: {scorecard.processing_time_ms}ms")
            print(f"📐 Data Quality: {scorecard.data_quality_score:.1%}")
            
            print(f"\n📊 Dimension Scores:")
            for dimension, score in scorecard.dimension_scores.items():
                trend_icon = {"IMPROVING": "📈", "STABLE": "➡️", "DECLINING": "📉", "VOLATILE": "📊"}.get(score.trend.value, "❓")
                print(f"  {score.score:5.1f} | {score.level.value:18s} | {trend_icon} {dimension.value}")
            
            if scorecard.risk_indicators:
                print(f"\n⚠️  Risk Indicators ({len(scorecard.risk_indicators)}):")
                for i, indicator in enumerate(scorecard.risk_indicators[:5], 1):
                    print(f"  {i}. {indicator}")
            
            print(f"\n💡 Key Recommendations ({len(scorecard.improvement_recommendations)}):")
            for i, rec in enumerate(scorecard.improvement_recommendations[:5], 1):
                print(f"  {i}. {rec}")
            
            print(f"\n🏛️  Regulatory Status:")
            for framework, status in scorecard.regulatory_status.items():
                status_icon = "✅" if "COMPLIANT" in status else ("⚠️" if "PARTIAL" in status else "❌")
                print(f"  {status_icon} {framework.upper()}: {status}")
            
            if scorecard.forecast_30d:
                print(f"\n🔮 Forecasts:")
                print(f"  30-day: {scorecard.forecast_30d:.1f} ({scorecard.forecast_30d - scorecard.overall_score:+.1f})")
                if scorecard.forecast_90d:
                    print(f"  90-day: {scorecard.forecast_90d:.1f} ({scorecard.forecast_90d - scorecard.overall_score:+.1f})")
                print(f"  Confidence: {scorecard.confidence_interval[0]:.1f}-{scorecard.confidence_interval[1]:.1f}")
            
            # Generate executive dashboard
            print(f"\n🎛️  Generating Executive Dashboard...")
            dashboard = await csc.generate_executive_dashboard(scorecard, "C-Level")
            
            print(f"✅ Dashboard generated: {dashboard.dashboard_id}")
            print(f"📋 Key Insights: {len(dashboard.key_insights)}")
            print(f"🚨 Critical Alerts: {len(dashboard.critical_alerts)}")
            print(f"✅ Action Items: {len(dashboard.action_items)}")
            
            if dashboard.critical_alerts:
                print(f"\n🚨 Critical Alerts:")
                for alert in dashboard.critical_alerts[:3]:
                    print(f"  ⚠️  {alert}")
            
            print("\n" + "=" * 70)
            print("📊 IntegridAI Compliance Score Calculator - Executive Ready")
            
        except Exception as e:
            print(f"❌ Compliance scoring failed: {e}")
    
    # Run the demo
    asyncio.run(run_demo())