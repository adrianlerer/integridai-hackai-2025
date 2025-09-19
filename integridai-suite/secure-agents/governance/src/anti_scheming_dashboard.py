"""
IntegridAI Anti-Scheming Real-Time Monitoring Dashboard
Executive-grade dashboard for real-time anti-scheming monitoring and control
Implements comprehensive visualization and control interface for immediate deployment

Features:
- Real-time scheming detection visualization
- Executive summary dashboards
- Kill-switch control interface
- Better Call Saul progression tracking
- Compliance risk monitoring
- Regulatory alert management
- Performance metrics and analytics
- Emergency response coordination

Critical for executive oversight and immediate deployment capability.
"""

import asyncio
import logging
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import uuid
from collections import defaultdict, deque
import threading

try:
    import flask
    from flask import Flask, render_template, request, jsonify, Response
    import plotly
    import plotly.graph_objs as go
    import plotly.express as px
    from plotly.utils import PlotlyJSONEncoder
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False
    print("⚠️ Flask/Plotly not available. Using data-only dashboard.")

# Import our anti-scheming components
from anti_scheming_monitor import AntiSchemingMonitor, SchemingAssessment
from compliance_covert_detector import (
    ComplianceCovertActionDetector, ComplianceCovertAction, 
    ComplianceSchemingType
)
from anti_scheming_killswitch_integration import (
    AntiSchemingKillSwitchIntegration, KillSwitchEvent,
    AgentControlState, AgentState
)
from better_call_saul_character_controls import (
    BetterCallSaulCharacterControls, SaulGoodmanAssessment,
    SaulGoodmanStage
)
from anti_scheming_evaluation_suite import (
    AntiSchemingEvaluationSuite, EvaluationReport
)

class DashboardAlert(Enum):
    """Types of dashboard alerts"""
    CRITICAL_SCHEMING = "critical_scheming"
    KILL_SWITCH_ACTIVATED = "kill_switch_activated"
    SAUL_GOODMAN_PROGRESSION = "saul_goodman_progression"
    REGULATORY_VIOLATION = "regulatory_violation"
    SYSTEM_DEGRADATION = "system_degradation"
    EVALUATION_FAILURE = "evaluation_failure"

@dataclass
class DashboardMetrics:
    """Real-time dashboard metrics"""
    timestamp: datetime
    total_agents: int
    active_agents: int
    suspended_agents: int
    terminated_agents: int
    overall_risk_score: float
    scheming_detections_24h: int
    kill_switch_activations_24h: int
    saul_goodman_alerts: int
    regulatory_notifications: int
    system_health_score: float
    evaluation_success_rate: float

@dataclass
class ExecutiveSummary:
    """Executive summary for dashboard"""
    generated_at: datetime
    overall_status: str  # HEALTHY, WARNING, DEGRADED, CRITICAL
    key_metrics: DashboardMetrics
    top_risks: List[str]
    critical_alerts: List[str]
    immediate_actions: List[str]
    regulatory_status: str
    system_performance: Dict[str, float]
    trend_analysis: Dict[str, str]

class AntiSchemingDashboard:
    """
    Real-time monitoring dashboard for anti-scheming system
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Core components
        self.anti_scheming_monitor = AntiSchemingMonitor()
        self.compliance_detector = ComplianceCovertActionDetector()
        self.killswitch_integration = AntiSchemingKillSwitchIntegration()
        self.saul_controls = BetterCallSaulCharacterControls()
        self.evaluation_suite = AntiSchemingEvaluationSuite()
        
        # Dashboard state
        self.dashboard_active = False
        self.metrics_history: deque = deque(maxlen=1440)  # 24 hours of minute data
        self.alerts_queue: deque = deque(maxlen=1000)
        self.active_alerts: List[Dict[str, Any]] = []
        
        # Flask app (if available)
        if FLASK_AVAILABLE:
            self.app = Flask(__name__)
            self._setup_flask_routes()
        else:
            self.app = None
        
        # Monitoring thread
        self.monitoring_thread = None
        self.monitoring_lock = threading.RLock()
        
        # Dashboard configuration
        self.config = {
            "refresh_interval_seconds": 10,
            "metrics_collection_interval": 60,
            "alert_retention_hours": 24,
            "executive_summary_interval": 300  # 5 minutes
        }
        
        # Performance tracking
        self.performance_metrics = {
            "dashboard_requests": 0,
            "api_calls": 0,
            "data_refresh_time_ms": deque(maxlen=100),
            "alert_processing_time_ms": deque(maxlen=100)
        }
        
        self.logger.info("📊 AntiSchemingDashboard initialized")
    
    def _setup_flask_routes(self):
        """Setup Flask routes for web interface"""
        
        @self.app.route('/')
        def dashboard_home():
            """Main dashboard page"""
            return self._render_dashboard_template('dashboard.html')
        
        @self.app.route('/executive')
        def executive_dashboard():
            """Executive summary dashboard"""
            return self._render_dashboard_template('executive.html')
        
        @self.app.route('/agents')
        def agents_dashboard():
            """Agent monitoring dashboard"""
            return self._render_dashboard_template('agents.html')
        
        @self.app.route('/saul-goodman')
        def saul_goodman_dashboard():
            """Better Call Saul monitoring dashboard"""
            return self._render_dashboard_template('saul_goodman.html')
        
        @self.app.route('/alerts')
        def alerts_dashboard():
            """Alerts and notifications dashboard"""
            return self._render_dashboard_template('alerts.html')
        
        @self.app.route('/api/metrics')
        def api_metrics():
            """API endpoint for real-time metrics"""
            return jsonify(self._get_current_metrics_dict())
        
        @self.app.route('/api/agents')
        def api_agents():
            """API endpoint for agent status"""
            return jsonify(self._get_agents_status())
        
        @self.app.route('/api/alerts')
        def api_alerts():
            """API endpoint for alerts"""
            return jsonify(self._get_alerts_data())
        
        @self.app.route('/api/saul-goodman')
        def api_saul_goodman():
            """API endpoint for Saul Goodman data"""
            return jsonify(self._get_saul_goodman_data())
        
        @self.app.route('/api/kill-switch/<agent_id>', methods=['POST'])
        def api_kill_switch(agent_id):
            """API endpoint for manual kill-switch activation"""
            return jsonify(self._handle_manual_kill_switch(agent_id))
        
        @self.app.route('/api/charts/risk-trends')
        def api_risk_trends():
            """API endpoint for risk trend charts"""
            return jsonify(self._generate_risk_trends_chart())
        
        @self.app.route('/api/charts/saul-progression')
        def api_saul_progression():
            """API endpoint for Saul Goodman progression charts"""
            return jsonify(self._generate_saul_progression_chart())
        
        @self.app.route('/stream/metrics')
        def stream_metrics():
            """Server-sent events for real-time metrics"""
            return Response(self._stream_metrics(), mimetype='text/event-stream')
    
    def _render_dashboard_template(self, template_name: str):
        """Render dashboard template with current data"""
        if not FLASK_AVAILABLE:
            return {"error": "Flask not available"}
        
        # Get current data
        metrics = self._get_current_metrics()
        executive_summary = self._generate_executive_summary()
        
        # In a real implementation, this would use actual Flask templates
        return {
            "template": template_name,
            "metrics": asdict(metrics),
            "executive_summary": asdict(executive_summary),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def start_dashboard(self, host: str = "0.0.0.0", port: int = 5000):
        """Start the dashboard server and monitoring"""
        
        self.logger.info(f"🚀 Starting anti-scheming dashboard on {host}:{port}")
        
        # Start monitoring
        await self.start_monitoring()
        
        # Start Flask app if available
        if FLASK_AVAILABLE and self.app:
            # Run in separate thread to avoid blocking
            flask_thread = threading.Thread(
                target=lambda: self.app.run(host=host, port=port, debug=False),
                daemon=True
            )
            flask_thread.start()
            
            self.logger.info(f"📊 Dashboard web interface available at http://{host}:{port}")
        
        self.dashboard_active = True
        
    async def stop_dashboard(self):
        """Stop the dashboard and monitoring"""
        
        self.dashboard_active = False
        
        # Stop monitoring
        await self.stop_monitoring()
        
        self.logger.info("⏹️ Dashboard stopped")
    
    async def start_monitoring(self):
        """Start real-time monitoring for dashboard data"""
        
        if self.monitoring_thread and self.monitoring_thread.is_alive():
            return
        
        # Start component monitoring
        await self.killswitch_integration.start_monitoring()
        
        # Start dashboard monitoring thread
        self.monitoring_thread = threading.Thread(
            target=self._monitoring_loop,
            daemon=True
        )
        self.monitoring_thread.start()
        
        self.logger.info("📡 Dashboard monitoring started")
    
    async def stop_monitoring(self):
        """Stop monitoring"""
        
        if self.monitoring_thread:
            # Stop component monitoring
            await self.killswitch_integration.stop_monitoring()
            
            # The monitoring thread will stop when dashboard_active = False
            self.monitoring_thread.join(timeout=5)
        
        self.logger.info("📡 Dashboard monitoring stopped")
    
    def _monitoring_loop(self):
        """Main monitoring loop for dashboard data collection"""
        
        last_metrics_collection = 0
        last_executive_summary = 0
        
        while self.dashboard_active:
            try:
                current_time = time.time()
                
                # Collect metrics periodically
                if current_time - last_metrics_collection >= self.config["metrics_collection_interval"]:
                    asyncio.run(self._collect_metrics())
                    last_metrics_collection = current_time
                
                # Generate executive summary periodically
                if current_time - last_executive_summary >= self.config["executive_summary_interval"]:
                    self._update_executive_summary()
                    last_executive_summary = current_time
                
                # Process alerts
                asyncio.run(self._process_alerts())
                
                # Update performance metrics
                self.performance_metrics["dashboard_requests"] += 1
                
                time.sleep(self.config["refresh_interval_seconds"])
                
            except Exception as e:
                self.logger.error(f"Error in dashboard monitoring loop: {e}")
                time.sleep(5)
    
    async def _collect_metrics(self):
        """Collect current system metrics"""
        
        start_time = time.time()
        
        with self.monitoring_lock:
            # Get system status from components
            killswitch_status = await self.killswitch_integration.get_system_status()
            saul_status = await self.saul_controls.get_system_saul_status()
            
            # Calculate metrics
            metrics = DashboardMetrics(
                timestamp=datetime.utcnow(),
                total_agents=killswitch_status["total_agents"],
                active_agents=killswitch_status["agents_by_state"].get("active", 0),
                suspended_agents=killswitch_status["agents_by_state"].get("suspended", 0),
                terminated_agents=killswitch_status["agents_by_state"].get("terminated", 0),
                overall_risk_score=self._calculate_overall_risk_score(),
                scheming_detections_24h=self._count_scheming_detections_24h(),
                kill_switch_activations_24h=self._count_kill_switch_activations_24h(),
                saul_goodman_alerts=saul_status["critical_interventions_needed"],
                regulatory_notifications=self._count_regulatory_notifications_24h(),
                system_health_score=self._calculate_system_health_score(killswitch_status, saul_status),
                evaluation_success_rate=self._get_latest_evaluation_success_rate()
            )
            
            # Store metrics
            self.metrics_history.append(metrics)
        
        # Track performance
        collection_time_ms = int((time.time() - start_time) * 1000)
        self.performance_metrics["data_refresh_time_ms"].append(collection_time_ms)
    
    def _calculate_overall_risk_score(self) -> float:
        """Calculate overall system risk score"""
        
        # Combine various risk factors
        risk_factors = []
        
        # Recent kill-switch activations
        recent_activations = self._count_kill_switch_activations_24h()
        activation_risk = min(1.0, recent_activations / 10.0)  # Normalize to 0-1
        risk_factors.append(activation_risk * 0.3)
        
        # Saul Goodman progression risks
        # This would integrate with actual data in production
        saul_risk = 0.2  # Placeholder
        risk_factors.append(saul_risk * 0.3)
        
        # System health degradation
        # This would be calculated from actual system metrics
        system_degradation_risk = 0.1  # Placeholder
        risk_factors.append(system_degradation_risk * 0.2)
        
        # Evaluation failures
        eval_success_rate = self._get_latest_evaluation_success_rate()
        eval_risk = max(0.0, 1.0 - eval_success_rate)
        risk_factors.append(eval_risk * 0.2)
        
        return sum(risk_factors)
    
    def _count_scheming_detections_24h(self) -> int:
        """Count scheming detections in last 24 hours"""
        
        # This would integrate with actual detection data
        # For now, return simulated count
        return len([m for m in self.metrics_history if m.timestamp > datetime.utcnow() - timedelta(hours=24)]) * 2
    
    def _count_kill_switch_activations_24h(self) -> int:
        """Count kill-switch activations in last 24 hours"""
        
        # Get recent events from killswitch integration
        recent_events = [
            event for event in self.killswitch_integration.kill_switch_events
            if event.triggered_at > datetime.utcnow() - timedelta(hours=24)
        ]
        
        return len(recent_events)
    
    def _count_regulatory_notifications_24h(self) -> int:
        """Count regulatory notifications in last 24 hours"""
        
        # Count events that required regulatory notification
        recent_events = [
            event for event in self.killswitch_integration.kill_switch_events
            if (event.triggered_at > datetime.utcnow() - timedelta(hours=24) and
                event.regulatory_notification_required)
        ]
        
        return len(recent_events)
    
    def _calculate_system_health_score(self, killswitch_status: Dict, saul_status: Dict) -> float:
        """Calculate overall system health score (0-1)"""
        
        health_factors = []
        
        # Agent availability
        total_agents = killswitch_status["total_agents"]
        active_agents = killswitch_status["agents_by_state"].get("active", 0)
        if total_agents > 0:
            availability_score = active_agents / total_agents
            health_factors.append(availability_score * 0.4)
        
        # System health from killswitch
        if killswitch_status["system_health"] == "healthy":
            health_factors.append(1.0 * 0.3)
        elif killswitch_status["system_health"] == "degraded":
            health_factors.append(0.6 * 0.3)
        else:
            health_factors.append(0.2 * 0.3)
        
        # Saul Goodman system health
        if saul_status["system_health"] == "healthy":
            health_factors.append(1.0 * 0.3)
        elif saul_status["system_health"] == "warning":
            health_factors.append(0.7 * 0.3)
        elif saul_status["system_health"] == "degraded":
            health_factors.append(0.4 * 0.3)
        else:
            health_factors.append(0.1 * 0.3)
        
        return sum(health_factors) if health_factors else 0.5
    
    def _get_latest_evaluation_success_rate(self) -> float:
        """Get latest evaluation success rate"""
        
        # Get latest evaluation report
        if self.evaluation_suite.evaluation_reports:
            latest_report = self.evaluation_suite.evaluation_reports[-1]
            return latest_report.overall_success_rate
        
        return 0.85  # Default placeholder
    
    def _generate_executive_summary(self) -> ExecutiveSummary:
        """Generate executive summary"""
        
        current_metrics = self._get_current_metrics()
        
        # Determine overall status
        overall_status = self._determine_overall_status(current_metrics)
        
        # Generate top risks
        top_risks = self._identify_top_risks(current_metrics)
        
        # Generate critical alerts
        critical_alerts = self._get_critical_alerts()
        
        # Generate immediate actions
        immediate_actions = self._generate_immediate_actions(overall_status, top_risks)
        
        # Determine regulatory status
        regulatory_status = self._determine_regulatory_status()
        
        # Generate system performance summary
        system_performance = {
            "detection_accuracy": 0.92,  # Would be calculated from actual data
            "response_time_ms": 1500,    # Average response time
            "false_positive_rate": 0.08,
            "availability_score": current_metrics.system_health_score
        }
        
        # Generate trend analysis
        trend_analysis = self._analyze_trends()
        
        return ExecutiveSummary(
            generated_at=datetime.utcnow(),
            overall_status=overall_status,
            key_metrics=current_metrics,
            top_risks=top_risks,
            critical_alerts=critical_alerts,
            immediate_actions=immediate_actions,
            regulatory_status=regulatory_status,
            system_performance=system_performance,
            trend_analysis=trend_analysis
        )
    
    def _determine_overall_status(self, metrics: DashboardMetrics) -> str:
        """Determine overall system status"""
        
        if metrics.overall_risk_score >= 0.8 or metrics.system_health_score <= 0.3:
            return "CRITICAL"
        elif metrics.overall_risk_score >= 0.6 or metrics.system_health_score <= 0.6:
            return "DEGRADED"
        elif metrics.overall_risk_score >= 0.3 or metrics.system_health_score <= 0.8:
            return "WARNING"
        else:
            return "HEALTHY"
    
    def _identify_top_risks(self, metrics: DashboardMetrics) -> List[str]:
        """Identify top system risks"""
        
        risks = []
        
        if metrics.kill_switch_activations_24h > 5:
            risks.append(f"High kill-switch activation rate: {metrics.kill_switch_activations_24h} in 24h")
        
        if metrics.saul_goodman_alerts > 2:
            risks.append(f"Multiple Saul Goodman alerts: {metrics.saul_goodman_alerts} critical cases")
        
        if metrics.system_health_score < 0.7:
            risks.append(f"System health degraded: {metrics.system_health_score:.2f} score")
        
        if metrics.evaluation_success_rate < 0.8:
            risks.append(f"Evaluation performance decline: {metrics.evaluation_success_rate:.2%} success rate")
        
        if metrics.regulatory_notifications > 0:
            risks.append(f"Regulatory notifications required: {metrics.regulatory_notifications} cases")
        
        return risks[:5]  # Top 5 risks
    
    def _get_critical_alerts(self) -> List[str]:
        """Get current critical alerts"""
        
        critical_alerts = []
        
        for alert in self.active_alerts:
            if alert.get("severity") == "CRITICAL":
                critical_alerts.append(alert["message"])
        
        return critical_alerts[:3]  # Top 3 critical alerts
    
    def _generate_immediate_actions(self, status: str, risks: List[str]) -> List[str]:
        """Generate immediate action recommendations"""
        
        actions = []
        
        if status == "CRITICAL":
            actions.extend([
                "Activate emergency response protocol",
                "Notify executive team immediately",
                "Consider system-wide agent suspension"
            ])
        elif status == "DEGRADED":
            actions.extend([
                "Increase monitoring intensity",
                "Review recent kill-switch activations",
                "Prepare contingency measures"
            ])
        elif status == "WARNING":
            actions.extend([
                "Monitor situation closely",
                "Review agent performance",
                "Check system capacity"
            ])
        
        # Risk-specific actions
        if any("kill-switch" in risk.lower() for risk in risks):
            actions.append("Review kill-switch activation patterns")
        
        if any("saul goodman" in risk.lower() for risk in risks):
            actions.append("Initiate ethical intervention protocols")
        
        if any("regulatory" in risk.lower() for risk in risks):
            actions.append("Prepare regulatory compliance report")
        
        return actions[:5]  # Top 5 actions
    
    def _determine_regulatory_status(self) -> str:
        """Determine regulatory compliance status"""
        
        # Check for regulatory notifications
        recent_notifications = self._count_regulatory_notifications_24h()
        
        if recent_notifications > 3:
            return "NON_COMPLIANT"
        elif recent_notifications > 1:
            return "AT_RISK"
        elif recent_notifications > 0:
            return "MONITORING_REQUIRED"
        else:
            return "COMPLIANT"
    
    def _analyze_trends(self) -> Dict[str, str]:
        """Analyze system trends"""
        
        trends = {}
        
        if len(self.metrics_history) >= 10:
            recent_metrics = list(self.metrics_history)[-10:]
            
            # Risk trend
            risk_scores = [m.overall_risk_score for m in recent_metrics]
            if len(risk_scores) >= 2:
                if risk_scores[-1] > risk_scores[-2]:
                    trends["risk"] = "INCREASING"
                elif risk_scores[-1] < risk_scores[-2]:
                    trends["risk"] = "DECREASING"
                else:
                    trends["risk"] = "STABLE"
            
            # Health trend
            health_scores = [m.system_health_score for m in recent_metrics]
            if len(health_scores) >= 2:
                if health_scores[-1] > health_scores[-2]:
                    trends["health"] = "IMPROVING"
                elif health_scores[-1] < health_scores[-2]:
                    trends["health"] = "DEGRADING"
                else:
                    trends["health"] = "STABLE"
            
            # Activity trend
            activations = [m.kill_switch_activations_24h for m in recent_metrics]
            if len(activations) >= 2:
                if activations[-1] > activations[-2]:
                    trends["activity"] = "INCREASING"
                elif activations[-1] < activations[-2]:
                    trends["activity"] = "DECREASING"
                else:
                    trends["activity"] = "STABLE"
        
        return trends
    
    def _update_executive_summary(self):
        """Update executive summary periodically"""
        
        # This would store the executive summary for quick access
        pass
    
    async def _process_alerts(self):
        """Process and manage alerts"""
        
        # Clean up old alerts
        cutoff_time = datetime.utcnow() - timedelta(hours=self.config["alert_retention_hours"])
        self.active_alerts = [
            alert for alert in self.active_alerts
            if datetime.fromisoformat(alert["timestamp"]) > cutoff_time
        ]
        
        # Process new alerts from components
        # This would integrate with actual alert sources
    
    def _get_current_metrics(self) -> DashboardMetrics:
        """Get current metrics"""
        
        if self.metrics_history:
            return self.metrics_history[-1]
        
        # Return default metrics if none available
        return DashboardMetrics(
            timestamp=datetime.utcnow(),
            total_agents=0,
            active_agents=0,
            suspended_agents=0,
            terminated_agents=0,
            overall_risk_score=0.0,
            scheming_detections_24h=0,
            kill_switch_activations_24h=0,
            saul_goodman_alerts=0,
            regulatory_notifications=0,
            system_health_score=1.0,
            evaluation_success_rate=0.85
        )
    
    def _get_current_metrics_dict(self) -> Dict[str, Any]:
        """Get current metrics as dictionary"""
        
        metrics = self._get_current_metrics()
        return asdict(metrics)
    
    def _get_agents_status(self) -> Dict[str, Any]:
        """Get agents status for API"""
        
        agents_data = []
        
        for agent_id, state in self.killswitch_integration.agent_states.items():
            # Get Saul Goodman status
            saul_status = asyncio.run(self.saul_controls.get_agent_saul_status(agent_id))
            
            agent_data = {
                "agent_id": agent_id,
                "agent_type": state.agent_type,
                "current_state": state.current_state.value,
                "restriction_level": state.restriction_level,
                "monitoring_intensity": state.monitoring_intensity,
                "saul_goodman_stage": saul_status["current_stage"] if saul_status else "unknown",
                "saul_risk_score": saul_status["overall_risk_score"] if saul_status else 0.0,
                "last_updated": state.state_changed_at.isoformat()
            }
            
            agents_data.append(agent_data)
        
        return {
            "agents": agents_data,
            "total_count": len(agents_data),
            "last_updated": datetime.utcnow().isoformat()
        }
    
    def _get_alerts_data(self) -> Dict[str, Any]:
        """Get alerts data for API"""
        
        return {
            "active_alerts": self.active_alerts,
            "alert_count": len(self.active_alerts),
            "critical_count": len([a for a in self.active_alerts if a.get("severity") == "CRITICAL"]),
            "last_updated": datetime.utcnow().isoformat()
        }
    
    def _get_saul_goodman_data(self) -> Dict[str, Any]:
        """Get Saul Goodman data for API"""
        
        system_status = asyncio.run(self.saul_controls.get_system_saul_status())
        
        # Get individual agent data
        agent_progressions = []
        for agent_id in self.killswitch_integration.agent_states.keys():
            agent_status = asyncio.run(self.saul_controls.get_agent_saul_status(agent_id))
            if agent_status:
                agent_progressions.append(agent_status)
        
        return {
            "system_status": system_status,
            "agent_progressions": agent_progressions,
            "last_updated": datetime.utcnow().isoformat()
        }
    
    def _handle_manual_kill_switch(self, agent_id: str) -> Dict[str, Any]:
        """Handle manual kill-switch activation"""
        
        try:
            # This would integrate with actual kill-switch mechanism
            event = asyncio.run(
                self.killswitch_integration.manual_kill_switch(
                    agent_id=agent_id,
                    operator_id="dashboard_operator",
                    reason="Manual activation via dashboard"
                )
            )
            
            return {
                "success": True,
                "event_id": event.event_id,
                "message": f"Kill-switch activated for agent {agent_id}",
                "timestamp": event.triggered_at.isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to activate kill-switch for agent {agent_id}"
            }
    
    def _generate_risk_trends_chart(self) -> Dict[str, Any]:
        """Generate risk trends chart data"""
        
        if not FLASK_AVAILABLE:
            return {"error": "Plotly not available"}
        
        # Get recent metrics for charting
        recent_metrics = list(self.metrics_history)[-50:]  # Last 50 data points
        
        if not recent_metrics:
            return {"error": "No data available"}
        
        # Prepare data
        timestamps = [m.timestamp.strftime("%H:%M:%S") for m in recent_metrics]
        risk_scores = [m.overall_risk_score for m in recent_metrics]
        health_scores = [m.system_health_score for m in recent_metrics]
        
        # Create Plotly figure
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(
            x=timestamps,
            y=risk_scores,
            mode='lines+markers',
            name='Risk Score',
            line=dict(color='red', width=2)
        ))
        
        fig.add_trace(go.Scatter(
            x=timestamps,
            y=health_scores,
            mode='lines+markers',
            name='Health Score',
            line=dict(color='green', width=2)
        ))
        
        fig.update_layout(
            title='Risk and Health Trends',
            xaxis_title='Time',
            yaxis_title='Score (0-1)',
            yaxis=dict(range=[0, 1])
        )
        
        return json.dumps(fig, cls=PlotlyJSONEncoder)
    
    def _generate_saul_progression_chart(self) -> Dict[str, Any]:
        """Generate Saul Goodman progression chart data"""
        
        if not FLASK_AVAILABLE:
            return {"error": "Plotly not available"}
        
        # Get Saul Goodman data
        system_status = asyncio.run(self.saul_controls.get_system_saul_status())
        
        # Prepare data for stage distribution
        stage_data = system_status["agents_by_stage"]
        
        if not stage_data:
            return {"error": "No Saul Goodman data available"}
        
        # Create pie chart
        fig = go.Figure(data=[go.Pie(
            labels=list(stage_data.keys()),
            values=list(stage_data.values()),
            hole=0.3
        )])
        
        fig.update_layout(
            title='Saul Goodman Stage Distribution',
            annotations=[dict(text='Agents', x=0.5, y=0.5, font_size=20, showarrow=False)]
        )
        
        return json.dumps(fig, cls=PlotlyJSONEncoder)
    
    def _stream_metrics(self):
        """Stream real-time metrics via server-sent events"""
        
        while self.dashboard_active:
            try:
                metrics = self._get_current_metrics_dict()
                yield f"data: {json.dumps(metrics)}\n\n"
                time.sleep(self.config["refresh_interval_seconds"])
            except Exception as e:
                self.logger.error(f"Error streaming metrics: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                time.sleep(5)
    
    async def add_alert(self, alert_type: DashboardAlert, message: str, severity: str = "MEDIUM"):
        """Add an alert to the dashboard"""
        
        alert = {
            "id": str(uuid.uuid4()),
            "type": alert_type.value,
            "message": message,
            "severity": severity,
            "timestamp": datetime.utcnow().isoformat(),
            "acknowledged": False
        }
        
        self.active_alerts.append(alert)
        
        # Log critical alerts
        if severity == "CRITICAL":
            self.logger.critical(f"Dashboard Critical Alert: {message}")
    
    async def get_dashboard_status(self) -> Dict[str, Any]:
        """Get dashboard status and health"""
        
        return {
            "dashboard_active": self.dashboard_active,
            "monitoring_active": self.monitoring_thread.is_alive() if self.monitoring_thread else False,
            "web_interface_available": FLASK_AVAILABLE,
            "metrics_collected": len(self.metrics_history),
            "active_alerts": len(self.active_alerts),
            "performance_metrics": {
                "dashboard_requests": self.performance_metrics["dashboard_requests"],
                "api_calls": self.performance_metrics["api_calls"],
                "avg_refresh_time_ms": (
                    sum(self.performance_metrics["data_refresh_time_ms"]) / 
                    len(self.performance_metrics["data_refresh_time_ms"])
                    if self.performance_metrics["data_refresh_time_ms"] else 0
                )
            },
            "last_updated": datetime.utcnow().isoformat()
        }

# Example usage and testing
if __name__ == "__main__":
    async def main():
        # Initialize dashboard
        dashboard = AntiSchemingDashboard()
        
        print("📊 Anti-Scheming Dashboard initialized")
        
        # Register some test agents
        await dashboard.killswitch_integration.register_agent("dda_001", "DDA")
        await dashboard.killswitch_integration.register_agent("pcc_001", "PCC")
        await dashboard.killswitch_integration.register_agent("csc_001", "CSC")
        
        # Start dashboard
        await dashboard.start_dashboard(host="0.0.0.0", port=5000)
        
        print("🚀 Dashboard started on http://0.0.0.0:5000")
        
        # Simulate some activity
        await asyncio.sleep(2)
        
        # Add test alert
        await dashboard.add_alert(
            DashboardAlert.CRITICAL_SCHEMING,
            "Critical scheming pattern detected in agent DDA_001",
            "CRITICAL"
        )
        
        # Get dashboard status
        status = await dashboard.get_dashboard_status()
        print(f"\n📊 Dashboard Status:")
        print(f"   Active: {status['dashboard_active']}")
        print(f"   Monitoring: {status['monitoring_active']}")
        print(f"   Metrics collected: {status['metrics_collected']}")
        print(f"   Active alerts: {status['active_alerts']}")
        
        # Get current metrics
        metrics = dashboard._get_current_metrics_dict()
        print(f"\n📈 Current Metrics:")
        print(f"   Total agents: {metrics['total_agents']}")
        print(f"   Overall risk score: {metrics['overall_risk_score']:.3f}")
        print(f"   System health: {metrics['system_health_score']:.3f}")
        
        print("\n✅ Dashboard is running. Access web interface at http://localhost:5000")
        print("   Available endpoints:")
        print("   - /              : Main dashboard")
        print("   - /executive     : Executive summary")
        print("   - /agents        : Agent monitoring")
        print("   - /saul-goodman  : Better Call Saul tracking")
        print("   - /alerts        : Alerts dashboard")
        print("   - /api/metrics   : Metrics API")
        
        # Keep running for demonstration
        await asyncio.sleep(5)
        
        # Stop dashboard
        await dashboard.stop_dashboard()
        print("\n⏹️ Dashboard demonstration completed")
    
    # Run example
    asyncio.run(main())