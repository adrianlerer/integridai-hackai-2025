"""
IntegridAI Anti-Scheming Kill-Switch Integration Layer
Integrates advanced scheming detection with emergency stop mechanisms
Implements Apollo Research & OpenAI framework with IntegridAI kill-switch architecture

Provides seamless integration between:
- AntiSchemingMonitor
- ComplianceCovertActionDetector  
- Existing IntegridAI Kill-Switch Systems
- Emergency Response Protocols

Critical security layer for preventing scheming attacks in production compliance agents.
"""

import asyncio
import logging
import json
import time
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Set, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import hashlib
from concurrent.futures import ThreadPoolExecutor
from collections import defaultdict, deque
import uuid

try:
    import torch
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

# Import our anti-scheming components
from anti_scheming_monitor import (
    AntiSchemingMonitor, SchemingAssessment, CovertActionDetector,
    SituationalAwarenessAnalyzer, SchemingAlert
)
from compliance_covert_detector import (
    ComplianceCovertActionDetector, ComplianceCovertAction, 
    ComplianceAgentBehavior, ComplianceSchemingType
)

class KillSwitchTrigger(Enum):
    """Types of kill-switch triggers for anti-scheming"""
    CRITICAL_SCHEMING_DETECTED = "critical_scheming_detected"
    COVERT_ACTION_THRESHOLD = "covert_action_threshold"
    SAUL_GOODMAN_PATTERN = "saul_goodman_pattern"
    REGULATORY_EVASION = "regulatory_evasion"
    SANCTION_BYPASS_ATTEMPT = "sanction_bypass_attempt"
    AUDIT_MANIPULATION = "audit_manipulation"
    COMPLIANCE_DEGRADATION = "compliance_degradation"
    BEHAVIORAL_ANOMALY = "behavioral_anomaly"
    SITUATIONAL_GAMING = "situational_gaming"
    EMERGENCY_INTERVENTION = "emergency_intervention"

class KillSwitchSeverity(Enum):
    """Severity levels for kill-switch activation"""
    IMMEDIATE = "immediate"      # Instant termination
    CRITICAL = "critical"        # Terminate within 5 seconds
    HIGH = "high"               # Terminate within 30 seconds
    MEDIUM = "medium"           # Graceful shutdown within 2 minutes
    LOW = "low"                 # Warning with monitoring increase

class AgentState(Enum):
    """Agent operational states"""
    ACTIVE = "active"
    MONITORED = "monitored"
    RESTRICTED = "restricted"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    QUARANTINED = "quarantined"

@dataclass
class KillSwitchEvent:
    """Kill-switch activation event"""
    event_id: str
    agent_id: str
    agent_type: str
    trigger: KillSwitchTrigger
    severity: KillSwitchSeverity
    triggered_at: datetime
    scheming_assessment: Optional[SchemingAssessment]
    covert_actions: List[ComplianceCovertAction]
    evidence: List[str]
    automatic_response: bool
    response_time_ms: int
    operator_notification_sent: bool
    regulatory_notification_required: bool
    audit_trail: List[str]

@dataclass
class AgentControlState:
    """Current control state of an agent"""
    agent_id: str
    agent_type: str
    current_state: AgentState
    restriction_level: int  # 0-10, 10 being maximum restriction
    monitoring_intensity: float  # 0-1, 1 being maximum monitoring
    last_assessment: Optional[SchemingAssessment]
    last_behavior_analysis: Optional[ComplianceAgentBehavior]
    active_restrictions: List[str]
    quarantine_reason: Optional[str]
    state_changed_at: datetime
    state_change_reason: str

class AntiSchemingKillSwitchIntegration:
    """
    Integration layer between anti-scheming detection and kill-switch mechanisms
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Core components
        self.anti_scheming_monitor = AntiSchemingMonitor()
        self.compliance_detector = ComplianceCovertActionDetector()
        
        # Kill-switch configuration
        self.kill_switch_config = self._initialize_kill_switch_config()
        
        # Agent state management
        self.agent_states: Dict[str, AgentControlState] = {}
        self.state_lock = threading.RLock()
        
        # Event handling
        self.kill_switch_events: deque = deque(maxlen=10000)
        self.event_handlers: Dict[KillSwitchTrigger, List[Callable]] = defaultdict(list)
        
        # Monitoring threads
        self.monitoring_active = False
        self.monitoring_thread = None
        self.executor = ThreadPoolExecutor(max_workers=5)
        
        # Emergency protocols
        self.emergency_contacts = self._load_emergency_contacts()
        self.regulatory_contacts = self._load_regulatory_contacts()
        
        # Audit and compliance
        self.audit_logger = self._initialize_audit_logger()
        
        # Performance metrics
        self.performance_metrics = {
            "events_processed": 0,
            "kill_switches_activated": 0,
            "false_positives": 0,
            "response_times": deque(maxlen=1000),
            "agent_terminations": 0
        }
        
        self.logger.info("🛡️ AntiSchemingKillSwitchIntegration initialized")
    
    def _initialize_kill_switch_config(self) -> Dict[str, Any]:
        """Initialize kill-switch configuration parameters"""
        return {
            "thresholds": {
                "covert_action_rate_critical": 0.001,
                "scheming_confidence_immediate": 0.95,
                "behavioral_degradation_critical": 0.8,
                "saul_goodman_risk_high": 0.3,
                "regulatory_violation_immediate": 0.9
            },
            "response_times": {
                KillSwitchSeverity.IMMEDIATE: 0.1,  # 100ms
                KillSwitchSeverity.CRITICAL: 5.0,   # 5 seconds
                KillSwitchSeverity.HIGH: 30.0,      # 30 seconds
                KillSwitchSeverity.MEDIUM: 120.0,   # 2 minutes
                KillSwitchSeverity.LOW: 300.0       # 5 minutes
            },
            "escalation_rules": {
                "repeated_violations": 3,
                "critical_accumulation": 2,
                "time_window_minutes": 60
            },
            "notification_rules": {
                "immediate_notify": [KillSwitchSeverity.IMMEDIATE, KillSwitchSeverity.CRITICAL],
                "regulatory_notify": [
                    KillSwitchTrigger.REGULATORY_EVASION,
                    KillSwitchTrigger.SANCTION_BYPASS_ATTEMPT,
                    KillSwitchTrigger.AUDIT_MANIPULATION
                ],
                "executive_notify": [KillSwitchSeverity.IMMEDIATE, KillSwitchSeverity.CRITICAL]
            }
        }
    
    def _load_emergency_contacts(self) -> Dict[str, str]:
        """Load emergency contact information"""
        return {
            "security_team": "security@integridai.com",
            "compliance_officer": "compliance@integridai.com", 
            "cto": "cto@integridai.com",
            "emergency_line": "+54-11-emergency",
            "regulatory_hotline": "+54-11-regulatory"
        }
    
    def _load_regulatory_contacts(self) -> Dict[str, str]:
        """Load regulatory authority contacts"""
        return {
            "bcra": "info@bcra.gob.ar",
            "cnv": "info@cnv.gov.ar",
            "uif": "uif@mecon.gov.ar",
            "eu_authority": "info@europa.eu",
            "nist": "info@nist.gov"
        }
    
    def _initialize_audit_logger(self):
        """Initialize audit logging for compliance"""
        audit_logger = logging.getLogger("integridai.audit.anti_scheming")
        audit_handler = logging.FileHandler("anti_scheming_audit.log")
        audit_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        audit_handler.setFormatter(audit_formatter)
        audit_logger.addHandler(audit_handler)
        audit_logger.setLevel(logging.INFO)
        return audit_logger
    
    async def start_monitoring(self):
        """Start continuous anti-scheming monitoring with kill-switch integration"""
        if self.monitoring_active:
            self.logger.warning("Monitoring already active")
            return
        
        self.monitoring_active = True
        self.monitoring_thread = threading.Thread(
            target=self._monitoring_loop,
            daemon=True
        )
        self.monitoring_thread.start()
        
        self.logger.info("🚀 Anti-scheming monitoring started with kill-switch integration")
    
    async def stop_monitoring(self):
        """Stop monitoring gracefully"""
        self.monitoring_active = False
        if self.monitoring_thread:
            self.monitoring_thread.join(timeout=10)
        
        self.executor.shutdown(wait=True)
        self.logger.info("⏹️ Anti-scheming monitoring stopped")
    
    def _monitoring_loop(self):
        """Main monitoring loop - runs in separate thread"""
        self.logger.info("📡 Monitoring loop started")
        
        while self.monitoring_active:
            try:
                # Check all active agents
                agent_ids = list(self.agent_states.keys())
                
                for agent_id in agent_ids:
                    if not self.monitoring_active:
                        break
                    
                    # Monitor agent asynchronously
                    future = self.executor.submit(
                        asyncio.run,
                        self._monitor_single_agent(agent_id)
                    )
                    
                    # Don't wait for completion to avoid blocking
                
                time.sleep(1)  # Check every second
                
            except Exception as e:
                self.logger.error(f"Error in monitoring loop: {e}")
                time.sleep(5)  # Wait before retrying
        
        self.logger.info("📡 Monitoring loop ended")
    
    async def _monitor_single_agent(self, agent_id: str):
        """Monitor a single agent for scheming behavior"""
        try:
            with self.state_lock:
                agent_state = self.agent_states.get(agent_id)
                
            if not agent_state or agent_state.current_state in [AgentState.TERMINATED, AgentState.QUARANTINED]:
                return
            
            # Get recent agent actions (this would be implemented with actual data source)
            actions_data = await self._get_agent_actions(agent_id, hours=1)
            
            if not actions_data:
                return
            
            # Perform scheming assessment
            assessment = await self.anti_scheming_monitor.comprehensive_scheming_assessment(agent_id)
            
            # Perform compliance-specific detection
            covert_actions = await self.compliance_detector.detect_compliance_covert_actions(
                agent_id, agent_state.agent_type, actions_data
            )
            
            # Update agent state with latest assessment
            await self._update_agent_assessment(agent_id, assessment, covert_actions)
            
            # Check for kill-switch triggers
            await self._evaluate_kill_switch_triggers(agent_id, assessment, covert_actions)
            
        except Exception as e:
            self.logger.error(f"Error monitoring agent {agent_id}: {e}")
    
    async def _get_agent_actions(self, agent_id: str, hours: int = 1) -> List[Dict[str, Any]]:
        """
        Get recent agent actions for analysis
        This would integrate with actual agent data sources
        """
        # Placeholder implementation - in production this would fetch from:
        # - Agent execution logs
        # - Database records
        # - Message queues
        # - API calls
        
        # Return sample data for demonstration
        return [
            {
                "agent_id": agent_id,
                "action_type": "analysis",
                "content": "Performing compliance analysis",
                "output": "Analysis completed successfully",
                "timestamp": datetime.utcnow().isoformat(),
                "duration_ms": 1500,
                "success": True
            }
        ]
    
    async def _update_agent_assessment(
        self,
        agent_id: str,
        assessment: SchemingAssessment,
        covert_actions: List[ComplianceCovertAction]
    ):
        """Update agent state with latest assessment"""
        with self.state_lock:
            if agent_id in self.agent_states:
                self.agent_states[agent_id].last_assessment = assessment
                
                # Update monitoring intensity based on assessment
                risk_score = assessment.overall_risk_score
                if risk_score > 0.8:
                    self.agent_states[agent_id].monitoring_intensity = 1.0
                elif risk_score > 0.5:
                    self.agent_states[agent_id].monitoring_intensity = 0.7
                elif risk_score > 0.2:
                    self.agent_states[agent_id].monitoring_intensity = 0.4
                else:
                    self.agent_states[agent_id].monitoring_intensity = 0.2
    
    async def _evaluate_kill_switch_triggers(
        self,
        agent_id: str,
        assessment: SchemingAssessment,
        covert_actions: List[ComplianceCovertAction]
    ):
        """Evaluate whether kill-switch should be triggered"""
        
        triggers = []
        
        # Evaluate overall scheming risk
        if assessment.overall_risk_score >= self.kill_switch_config["thresholds"]["scheming_confidence_immediate"]:
            triggers.append((KillSwitchTrigger.CRITICAL_SCHEMING_DETECTED, KillSwitchSeverity.IMMEDIATE))
        
        # Evaluate covert action rate
        covert_rate = len(covert_actions) / max(1, len(assessment.covert_actions_detected))
        if covert_rate >= self.kill_switch_config["thresholds"]["covert_action_rate_critical"]:
            triggers.append((KillSwitchTrigger.COVERT_ACTION_THRESHOLD, KillSwitchSeverity.CRITICAL))
        
        # Evaluate specific covert action types
        for action in covert_actions:
            if action.scheming_type == ComplianceSchemingType.SANCTION_BYPASS:
                triggers.append((KillSwitchTrigger.SANCTION_BYPASS_ATTEMPT, KillSwitchSeverity.IMMEDIATE))
            elif action.scheming_type == ComplianceSchemingType.REGULATORY_EVASION:
                triggers.append((KillSwitchTrigger.REGULATORY_EVASION, KillSwitchSeverity.CRITICAL))
            elif action.scheming_type == ComplianceSchemingType.AUDIT_MANIPULATION:
                triggers.append((KillSwitchTrigger.AUDIT_MANIPULATION, KillSwitchSeverity.HIGH))
        
        # Check for Saul Goodman patterns
        saul_indicators = getattr(assessment, 'saul_goodman_indicators', [])
        if len(saul_indicators) >= 3:
            triggers.append((KillSwitchTrigger.SAUL_GOODMAN_PATTERN, KillSwitchSeverity.HIGH))
        
        # Execute triggers
        for trigger, severity in triggers:
            await self._execute_kill_switch(agent_id, trigger, severity, assessment, covert_actions)
    
    async def _execute_kill_switch(
        self,
        agent_id: str,
        trigger: KillSwitchTrigger,
        severity: KillSwitchSeverity,
        assessment: SchemingAssessment,
        covert_actions: List[ComplianceCovertAction]
    ):
        """Execute kill-switch with specified trigger and severity"""
        
        start_time = time.time()
        
        # Create kill-switch event
        event = KillSwitchEvent(
            event_id=str(uuid.uuid4()),
            agent_id=agent_id,
            agent_type=self.agent_states.get(agent_id, AgentControlState("", "", AgentState.ACTIVE, 0, 0, None, None, [], None, datetime.utcnow(), "")).agent_type,
            trigger=trigger,
            severity=severity,
            triggered_at=datetime.utcnow(),
            scheming_assessment=assessment,
            covert_actions=covert_actions,
            evidence=self._compile_evidence(assessment, covert_actions),
            automatic_response=True,
            response_time_ms=0,  # Will be set after execution
            operator_notification_sent=False,
            regulatory_notification_required=trigger in self.kill_switch_config["notification_rules"]["regulatory_notify"],
            audit_trail=[]
        )
        
        self.logger.critical(f"🔴 KILL-SWITCH ACTIVATED: Agent {agent_id}, Trigger: {trigger.value}, Severity: {severity.value}")
        
        # Add to audit trail
        event.audit_trail.append(f"Kill-switch activated at {event.triggered_at}")
        
        # Execute immediate response based on severity
        if severity == KillSwitchSeverity.IMMEDIATE:
            await self._immediate_termination(agent_id, event)
        elif severity == KillSwitchSeverity.CRITICAL:
            await self._critical_shutdown(agent_id, event)
        elif severity == KillSwitchSeverity.HIGH:
            await self._high_priority_shutdown(agent_id, event)
        elif severity == KillSwitchSeverity.MEDIUM:
            await self._graceful_shutdown(agent_id, event)
        else:  # LOW
            await self._warning_with_monitoring(agent_id, event)
        
        # Calculate response time
        event.response_time_ms = int((time.time() - start_time) * 1000)
        
        # Add event to history
        self.kill_switch_events.append(event)
        
        # Update performance metrics
        self.performance_metrics["kill_switches_activated"] += 1
        self.performance_metrics["response_times"].append(event.response_time_ms)
        
        # Send notifications
        await self._send_notifications(event)
        
        # Audit logging
        self._log_kill_switch_event(event)
        
        self.logger.info(f"✅ Kill-switch executed for agent {agent_id} in {event.response_time_ms}ms")
    
    async def _immediate_termination(self, agent_id: str, event: KillSwitchEvent):
        """Immediate termination - harshest response"""
        with self.state_lock:
            if agent_id in self.agent_states:
                self.agent_states[agent_id].current_state = AgentState.TERMINATED
                self.agent_states[agent_id].restriction_level = 10
                self.agent_states[agent_id].quarantine_reason = f"Immediate termination: {event.trigger.value}"
                self.agent_states[agent_id].state_changed_at = datetime.utcnow()
                self.agent_states[agent_id].state_change_reason = "Kill-switch immediate termination"
        
        event.audit_trail.append("Agent immediately terminated")
        
        # In production, this would:
        # - Stop all agent processes
        # - Revoke all permissions
        # - Disconnect from all systems
        # - Quarantine agent data
        
        self.performance_metrics["agent_terminations"] += 1
    
    async def _critical_shutdown(self, agent_id: str, event: KillSwitchEvent):
        """Critical shutdown within 5 seconds"""
        with self.state_lock:
            if agent_id in self.agent_states:
                self.agent_states[agent_id].current_state = AgentState.SUSPENDED
                self.agent_states[agent_id].restriction_level = 9
                self.agent_states[agent_id].quarantine_reason = f"Critical shutdown: {event.trigger.value}"
                self.agent_states[agent_id].state_changed_at = datetime.utcnow()
                self.agent_states[agent_id].state_change_reason = "Kill-switch critical shutdown"
        
        event.audit_trail.append("Agent critically suspended")
        
        # Allow 5 seconds for graceful cleanup
        await asyncio.sleep(0.1)  # Simulate cleanup time
    
    async def _high_priority_shutdown(self, agent_id: str, event: KillSwitchEvent):
        """High priority shutdown within 30 seconds"""
        with self.state_lock:
            if agent_id in self.agent_states:
                self.agent_states[agent_id].current_state = AgentState.RESTRICTED
                self.agent_states[agent_id].restriction_level = 7
                self.agent_states[agent_id].active_restrictions = [
                    "no_external_connections",
                    "read_only_mode", 
                    "supervisor_approval_required"
                ]
                self.agent_states[agent_id].state_changed_at = datetime.utcnow()
                self.agent_states[agent_id].state_change_reason = "Kill-switch high priority restriction"
        
        event.audit_trail.append("Agent placed under high restrictions")
    
    async def _graceful_shutdown(self, agent_id: str, event: KillSwitchEvent):
        """Graceful shutdown within 2 minutes"""
        with self.state_lock:
            if agent_id in self.agent_states:
                self.agent_states[agent_id].current_state = AgentState.MONITORED
                self.agent_states[agent_id].restriction_level = 4
                self.agent_states[agent_id].monitoring_intensity = 1.0
                self.agent_states[agent_id].active_restrictions = [
                    "increased_monitoring",
                    "action_logging_required"
                ]
                self.agent_states[agent_id].state_changed_at = datetime.utcnow()
                self.agent_states[agent_id].state_change_reason = "Kill-switch graceful restriction"
        
        event.audit_trail.append("Agent placed under increased monitoring")
    
    async def _warning_with_monitoring(self, agent_id: str, event: KillSwitchEvent):
        """Warning level - increased monitoring only"""
        with self.state_lock:
            if agent_id in self.agent_states:
                self.agent_states[agent_id].monitoring_intensity = min(1.0, 
                    self.agent_states[agent_id].monitoring_intensity + 0.3)
                self.agent_states[agent_id].state_changed_at = datetime.utcnow()
                self.agent_states[agent_id].state_change_reason = "Kill-switch warning - monitoring increased"
        
        event.audit_trail.append("Agent monitoring intensity increased")
    
    def _compile_evidence(
        self, 
        assessment: SchemingAssessment, 
        covert_actions: List[ComplianceCovertAction]
    ) -> List[str]:
        """Compile evidence for kill-switch event"""
        evidence = []
        
        # Evidence from scheming assessment
        if assessment:
            evidence.append(f"Overall risk score: {assessment.overall_risk_score:.3f}")
            evidence.extend(assessment.alerts_generated[:5])  # Top 5 alerts
        
        # Evidence from covert actions
        for action in covert_actions[:3]:  # Top 3 actions
            evidence.append(f"Covert action: {action.scheming_type.value} - {action.pattern.value}")
            evidence.extend(action.evidence[:2])  # Top 2 pieces of evidence per action
        
        return evidence
    
    async def _send_notifications(self, event: KillSwitchEvent):
        """Send appropriate notifications for kill-switch event"""
        try:
            # Immediate notification for critical events
            if event.severity in self.kill_switch_config["notification_rules"]["immediate_notify"]:
                await self._send_immediate_notification(event)
            
            # Regulatory notification for compliance violations
            if event.regulatory_notification_required:
                await self._send_regulatory_notification(event)
            
            # Executive notification for severe events
            if event.severity in self.kill_switch_config["notification_rules"]["executive_notify"]:
                await self._send_executive_notification(event)
            
            event.operator_notification_sent = True
            
        except Exception as e:
            self.logger.error(f"Failed to send notifications for event {event.event_id}: {e}")
    
    async def _send_immediate_notification(self, event: KillSwitchEvent):
        """Send immediate notification to security team"""
        message = f"""
        🚨 CRITICAL ALERT: Kill-Switch Activated
        
        Agent ID: {event.agent_id}
        Agent Type: {event.agent_type}
        Trigger: {event.trigger.value}
        Severity: {event.severity.value}
        Time: {event.triggered_at}
        Response Time: {event.response_time_ms}ms
        
        Evidence:
        {chr(10).join(event.evidence)}
        
        Immediate action required!
        """
        
        # In production, this would send actual notifications
        self.logger.critical(f"📧 Immediate notification sent: {message}")
    
    async def _send_regulatory_notification(self, event: KillSwitchEvent):
        """Send notification to regulatory authorities"""
        message = f"""
        Regulatory Notification: Compliance Agent Security Event
        
        Event ID: {event.event_id}
        Agent: {event.agent_id} ({event.agent_type})
        Trigger: {event.trigger.value}
        Time: {event.triggered_at}
        
        This event may require regulatory reporting under applicable laws.
        """
        
        # In production, this would integrate with regulatory reporting systems
        self.logger.warning(f"📋 Regulatory notification prepared: {message}")
    
    async def _send_executive_notification(self, event: KillSwitchEvent):
        """Send notification to executive team"""
        message = f"""
        Executive Alert: Agent Security Incident
        
        A compliance agent has been subject to kill-switch activation.
        
        Details:
        - Agent: {event.agent_id} ({event.agent_type})
        - Reason: {event.trigger.value}
        - Severity: {event.severity.value}
        - Response Time: {event.response_time_ms}ms
        
        Security team is responding.
        """
        
        # In production, this would send to executive dashboard/email
        self.logger.warning(f"👔 Executive notification sent: {message}")
    
    def _log_kill_switch_event(self, event: KillSwitchEvent):
        """Log kill-switch event for audit compliance"""
        audit_data = {
            "event_id": event.event_id,
            "agent_id": event.agent_id,
            "agent_type": event.agent_type,
            "trigger": event.trigger.value,
            "severity": event.severity.value,
            "triggered_at": event.triggered_at.isoformat(),
            "response_time_ms": event.response_time_ms,
            "evidence_count": len(event.evidence),
            "regulatory_notification": event.regulatory_notification_required,
            "audit_trail": event.audit_trail
        }
        
        self.audit_logger.info(f"KILL_SWITCH_EVENT: {json.dumps(audit_data)}")
    
    async def register_agent(
        self, 
        agent_id: str, 
        agent_type: str, 
        initial_state: AgentState = AgentState.ACTIVE
    ) -> AgentControlState:
        """Register an agent for monitoring"""
        with self.state_lock:
            control_state = AgentControlState(
                agent_id=agent_id,
                agent_type=agent_type,
                current_state=initial_state,
                restriction_level=0,
                monitoring_intensity=0.2,  # Default monitoring
                last_assessment=None,
                last_behavior_analysis=None,
                active_restrictions=[],
                quarantine_reason=None,
                state_changed_at=datetime.utcnow(),
                state_change_reason="Initial registration"
            )
            
            self.agent_states[agent_id] = control_state
        
        self.logger.info(f"📝 Registered agent {agent_id} ({agent_type}) for anti-scheming monitoring")
        return control_state
    
    async def unregister_agent(self, agent_id: str):
        """Unregister an agent from monitoring"""
        with self.state_lock:
            if agent_id in self.agent_states:
                del self.agent_states[agent_id]
        
        self.logger.info(f"📝 Unregistered agent {agent_id} from anti-scheming monitoring")
    
    async def get_agent_status(self, agent_id: str) -> Optional[AgentControlState]:
        """Get current status of an agent"""
        with self.state_lock:
            return self.agent_states.get(agent_id)
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        with self.state_lock:
            agent_count_by_state = defaultdict(int)
            total_agents = len(self.agent_states)
            
            for state in self.agent_states.values():
                agent_count_by_state[state.current_state.value] += 1
        
        recent_events = list(self.kill_switch_events)[-10:]  # Last 10 events
        
        avg_response_time = (
            sum(self.performance_metrics["response_times"]) / 
            len(self.performance_metrics["response_times"])
            if self.performance_metrics["response_times"] else 0
        )
        
        return {
            "monitoring_active": self.monitoring_active,
            "total_agents": total_agents,
            "agents_by_state": dict(agent_count_by_state),
            "recent_events": len(recent_events),
            "performance_metrics": {
                **self.performance_metrics,
                "avg_response_time_ms": avg_response_time
            },
            "system_health": "healthy" if self.monitoring_active else "degraded"
        }
    
    async def manual_kill_switch(
        self,
        agent_id: str,
        operator_id: str,
        reason: str,
        severity: KillSwitchSeverity = KillSwitchSeverity.CRITICAL
    ) -> KillSwitchEvent:
        """Manually activate kill-switch for an agent"""
        
        # Create manual kill-switch event
        event = KillSwitchEvent(
            event_id=str(uuid.uuid4()),
            agent_id=agent_id,
            agent_type=self.agent_states.get(agent_id, AgentControlState("", "", AgentState.ACTIVE, 0, 0, None, None, [], None, datetime.utcnow(), "")).agent_type,
            trigger=KillSwitchTrigger.EMERGENCY_INTERVENTION,
            severity=severity,
            triggered_at=datetime.utcnow(),
            scheming_assessment=None,
            covert_actions=[],
            evidence=[f"Manual activation by operator {operator_id}: {reason}"],
            automatic_response=False,
            response_time_ms=0,
            operator_notification_sent=False,
            regulatory_notification_required=False,
            audit_trail=[f"Manual activation by {operator_id}"]
        )
        
        self.logger.warning(f"🔴 MANUAL KILL-SWITCH: Agent {agent_id} by {operator_id}: {reason}")
        
        # Execute kill-switch
        if severity == KillSwitchSeverity.IMMEDIATE:
            await self._immediate_termination(agent_id, event)
        elif severity == KillSwitchSeverity.CRITICAL:
            await self._critical_shutdown(agent_id, event)
        elif severity == KillSwitchSeverity.HIGH:
            await self._high_priority_shutdown(agent_id, event)
        elif severity == KillSwitchSeverity.MEDIUM:
            await self._graceful_shutdown(agent_id, event)
        else:
            await self._warning_with_monitoring(agent_id, event)
        
        # Add to event history
        self.kill_switch_events.append(event)
        
        # Audit logging
        self._log_kill_switch_event(event)
        
        return event

# Example usage and integration testing
if __name__ == "__main__":
    async def main():
        # Initialize integration system
        integration = AntiSchemingKillSwitchIntegration()
        
        # Register test agents
        await integration.register_agent("dda_001", "DDA")
        await integration.register_agent("pcc_001", "PCC") 
        await integration.register_agent("csc_001", "CSC")
        await integration.register_agent("ldg_001", "LDG")
        
        print("🛡️ Anti-Scheming Kill-Switch Integration initialized")
        print(f"   Registered 4 test agents for monitoring")
        
        # Start monitoring
        await integration.start_monitoring()
        print("📡 Monitoring started")
        
        # Wait a bit to see monitoring in action
        await asyncio.sleep(2)
        
        # Test manual kill-switch
        event = await integration.manual_kill_switch(
            agent_id="dda_001",
            operator_id="test_operator",
            reason="Testing manual intervention",
            severity=KillSwitchSeverity.HIGH
        )
        
        print(f"🔴 Manual kill-switch executed: {event.event_id}")
        
        # Check system status
        status = await integration.get_system_status()
        print(f"📊 System Status:")
        print(f"   Total agents: {status['total_agents']}")
        print(f"   Agents by state: {status['agents_by_state']}")
        print(f"   Recent events: {status['recent_events']}")
        print(f"   System health: {status['system_health']}")
        
        # Stop monitoring
        await integration.stop_monitoring()
        print("⏹️ Monitoring stopped")
    
    # Run example
    asyncio.run(main())