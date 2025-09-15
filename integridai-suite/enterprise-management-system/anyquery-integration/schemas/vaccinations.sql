/**
 * 💉 Vaccination Schema for IntegridAI Enterprise Management System
 * 
 * Unified SQL schema for FLAISimulator vaccination data and immunity tracking
 * Compatible with anyquery SQL abstraction layer
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

-- Main vaccinations table
CREATE TABLE IF NOT EXISTS vaccinations (
    vaccination_id TEXT PRIMARY KEY NOT NULL,
    employee_id TEXT NOT NULL,
    employee_name TEXT,
    scenario_id TEXT NOT NULL,
    scenario_name TEXT NOT NULL,
    scenario_category TEXT CHECK (scenario_category IN (
        'gifts_hospitality', 'bribery', 'conflict_of_interest', 
        'procurement', 'financial_fraud', 'general_compliance'
    )),
    
    -- Vaccination details
    vaccination_date DATETIME NOT NULL,
    immunity_level INTEGER CHECK (immunity_level BETWEEN 0 AND 100) NOT NULL,
    immunity_duration INTEGER NOT NULL, -- days
    immunity_expiry_date DATE NOT NULL,
    
    -- Risk and compliance data
    risk_factors_addressed TEXT, -- JSON array
    cultural_adaptations TEXT, -- JSON array
    legal_evidence_generated BOOLEAN DEFAULT FALSE NOT NULL,
    p4_reflection_applied BOOLEAN DEFAULT FALSE NOT NULL,
    officer_protection_active BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Compliance tracking
    compliance_officer_id TEXT,
    vaccination_status TEXT CHECK (vaccination_status IN ('CURRENT', 'EXPIRED', 'OVERDUE', 'PENDING')) NOT NULL,
    revaccination_due_date DATE,
    effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 0 AND 100) NOT NULL,
    side_effects_reported TEXT, -- JSON array
    booster_required BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Certification and audit
    certification_hash TEXT,
    audit_trail TEXT, -- JSON object
    
    -- Metadata
    last_sync DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Vaccination scenarios (FLAISimulator scenario definitions)
CREATE TABLE IF NOT EXISTS vaccination_scenarios (
    scenario_id TEXT PRIMARY KEY NOT NULL,
    scenario_name TEXT UNIQUE NOT NULL,
    scenario_category TEXT NOT NULL,
    description TEXT,
    
    -- Scenario parameters
    difficulty_level TEXT CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')) DEFAULT 'INTERMEDIATE',
    expected_immunity_gain INTEGER CHECK (expected_immunity_gain BETWEEN 0 AND 100) DEFAULT 50,
    scenario_duration_minutes INTEGER DEFAULT 15,
    
    -- Risk factors
    risk_factors_covered TEXT, -- JSON array
    compliance_regulations TEXT, -- JSON array (e.g., ["Ley 27.401", "SOX", "GDPR"])
    industry_specific BOOLEAN DEFAULT FALSE,
    target_industries TEXT, -- JSON array
    
    -- Cultural and contextual factors
    cultural_contexts TEXT, -- JSON array
    language_variants TEXT, -- JSON array
    regional_adaptations TEXT, -- JSON array
    
    -- Effectiveness metrics
    avg_effectiveness_score REAL DEFAULT 0,
    completion_rate REAL DEFAULT 0,
    total_vaccinations INTEGER DEFAULT 0,
    
    -- P4 integration (Enhanced Patent P4)
    p4_reflection_enabled BOOLEAN DEFAULT TRUE,
    p4_analysis_depth TEXT CHECK (p4_analysis_depth IN ('BASIC', 'STANDARD', 'DEEP', 'COMPREHENSIVE')) DEFAULT 'STANDARD',
    officer_protection_available BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Vaccination boosters and follow-ups
CREATE TABLE IF NOT EXISTS vaccination_boosters (
    booster_id TEXT PRIMARY KEY NOT NULL,
    original_vaccination_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    booster_type TEXT CHECK (booster_type IN ('RENEWAL', 'REINFORCEMENT', 'UPDATE', 'REMEDIATION')) NOT NULL,
    
    -- Booster schedule
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    booster_status TEXT CHECK (booster_status IN ('SCHEDULED', 'COMPLETED', 'OVERDUE', 'CANCELLED')) DEFAULT 'SCHEDULED',
    
    -- Effectiveness tracking
    pre_booster_immunity INTEGER,
    post_booster_immunity INTEGER,
    immunity_improvement INTEGER,
    
    -- Booster configuration
    scenario_modifications TEXT, -- JSON object
    additional_risk_factors TEXT, -- JSON array
    custom_adaptations TEXT, -- JSON object
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at DATETIME,
    
    FOREIGN KEY (original_vaccination_id) REFERENCES vaccinations(vaccination_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Immunity tracking over time
CREATE TABLE IF NOT EXISTS immunity_history (
    history_id TEXT PRIMARY KEY NOT NULL,
    employee_id TEXT NOT NULL,
    vaccination_id TEXT,
    
    -- Immunity measurement
    measurement_date DATE NOT NULL,
    immunity_level INTEGER CHECK (immunity_level BETWEEN 0 AND 100) NOT NULL,
    measurement_method TEXT CHECK (measurement_method IN ('VACCINATION', 'ASSESSMENT', 'SIMULATION', 'OBSERVATION')) NOT NULL,
    
    -- Context
    scenario_category TEXT,
    risk_exposure_level TEXT CHECK (risk_exposure_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    environmental_factors TEXT, -- JSON object
    
    -- Decay analysis
    immunity_decay_rate REAL, -- percentage per day
    predicted_expiry_date DATE,
    confidence_level REAL CHECK (confidence_level BETWEEN 0 AND 1),
    
    -- Metadata
    measured_by TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (vaccination_id) REFERENCES vaccinations(vaccination_id)
);

-- Vaccination effectiveness analytics
CREATE TABLE IF NOT EXISTS vaccination_effectiveness (
    effectiveness_id TEXT PRIMARY KEY NOT NULL,
    scenario_id TEXT NOT NULL,
    employee_demographics TEXT, -- JSON object (anonymized)
    
    -- Effectiveness metrics
    pre_vaccination_risk_score INTEGER,
    post_vaccination_risk_score INTEGER,
    risk_reduction_percentage REAL,
    immunity_durability_days INTEGER,
    
    -- Contextual factors
    cultural_adaptation_used BOOLEAN DEFAULT FALSE,
    p4_reflection_quality TEXT CHECK (p4_reflection_quality IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT')),
    officer_involvement_level TEXT CHECK (officer_involvement_level IN ('NONE', 'MINIMAL', 'MODERATE', 'HIGH')),
    
    -- Learning outcomes
    knowledge_retention_score INTEGER CHECK (knowledge_retention_score BETWEEN 0 AND 100),
    behavior_change_indicators TEXT, -- JSON object
    real_world_application_examples TEXT, -- JSON array
    
    -- Follow-up assessments
    follow_up_30_days INTEGER,
    follow_up_90_days INTEGER,
    follow_up_180_days INTEGER,
    long_term_effectiveness REAL,
    
    -- Metadata
    assessment_date DATE NOT NULL,
    assessor_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (scenario_id) REFERENCES vaccination_scenarios(scenario_id)
);

-- Vaccination campaigns (organized vaccination efforts)
CREATE TABLE IF NOT EXISTS vaccination_campaigns (
    campaign_id TEXT PRIMARY KEY NOT NULL,
    campaign_name TEXT NOT NULL,
    description TEXT,
    
    -- Campaign scope
    target_departments TEXT, -- JSON array
    target_positions TEXT, -- JSON array
    target_risk_profiles TEXT, -- JSON array
    employee_filters TEXT, -- JSON object
    
    -- Campaign schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    campaign_status TEXT CHECK (campaign_status IN ('PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PLANNED',
    
    -- Vaccination configuration
    scenario_ids TEXT NOT NULL, -- JSON array
    mandatory BOOLEAN DEFAULT FALSE,
    priority_level TEXT CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
    
    -- Progress tracking
    target_employees INTEGER,
    vaccinated_employees INTEGER DEFAULT 0,
    completion_rate REAL DEFAULT 0,
    avg_effectiveness_score REAL DEFAULT 0,
    
    -- Campaign management
    campaign_manager_id TEXT,
    compliance_officer_id TEXT,
    budget_allocated REAL,
    actual_cost REAL,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (campaign_manager_id) REFERENCES employees(employee_id),
    FOREIGN KEY (compliance_officer_id) REFERENCES employees(employee_id)
);

-- Campaign participation tracking
CREATE TABLE IF NOT EXISTS campaign_participation (
    participation_id TEXT PRIMARY KEY NOT NULL,
    campaign_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    vaccination_id TEXT,
    
    -- Participation details
    enrolled_date DATE NOT NULL,
    vaccination_date DATE,
    completion_status TEXT CHECK (completion_status IN ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED_OUT', 'DEFERRED')) DEFAULT 'ENROLLED',
    
    -- Performance
    scenarios_completed INTEGER DEFAULT 0,
    total_scenarios INTEGER,
    avg_performance_score REAL,
    overall_effectiveness REAL,
    
    -- Feedback and notes
    participant_feedback TEXT,
    supervisor_notes TEXT,
    compliance_notes TEXT,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (campaign_id) REFERENCES vaccination_campaigns(campaign_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (vaccination_id) REFERENCES vaccinations(vaccination_id)
);

-- Vaccination incidents and side effects
CREATE TABLE IF NOT EXISTS vaccination_incidents (
    incident_id TEXT PRIMARY KEY NOT NULL,
    vaccination_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    
    -- Incident details
    incident_type TEXT CHECK (incident_type IN ('SIDE_EFFECT', 'ADVERSE_REACTION', 'TECHNICAL_ISSUE', 'INCOMPLETE_VACCINATION', 'OTHER')) NOT NULL,
    severity TEXT CHECK (severity IN ('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL')) NOT NULL,
    description TEXT NOT NULL,
    
    -- Response and resolution
    immediate_action_taken TEXT,
    resolution_status TEXT CHECK (resolution_status IN ('REPORTED', 'INVESTIGATING', 'RESOLVED', 'ESCALATED')) DEFAULT 'REPORTED',
    resolution_date DATE,
    resolution_notes TEXT,
    
    -- Impact assessment
    immunity_affected BOOLEAN DEFAULT FALSE,
    revaccination_required BOOLEAN DEFAULT FALSE,
    work_impact_days INTEGER DEFAULT 0,
    
    -- Reporting
    reported_by TEXT,
    reported_date DATE NOT NULL,
    compliance_officer_notified BOOLEAN DEFAULT FALSE,
    regulatory_reporting_required BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (vaccination_id) REFERENCES vaccinations(vaccination_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Performance indexes for vaccinations
CREATE INDEX IF NOT EXISTS idx_vaccinations_employee_id ON vaccinations(employee_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_scenario_id ON vaccinations(scenario_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_date ON vaccinations(vaccination_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_immunity_level ON vaccinations(immunity_level);
CREATE INDEX IF NOT EXISTS idx_vaccinations_expiry_date ON vaccinations(immunity_expiry_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_status ON vaccinations(vaccination_status);
CREATE INDEX IF NOT EXISTS idx_vaccinations_officer_id ON vaccinations(compliance_officer_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_booster_required ON vaccinations(booster_required);
CREATE INDEX IF NOT EXISTS idx_vaccinations_category ON vaccinations(scenario_category);

CREATE INDEX IF NOT EXISTS idx_scenarios_category ON vaccination_scenarios(scenario_category);
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON vaccination_scenarios(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_scenarios_active ON vaccination_scenarios(active);

CREATE INDEX IF NOT EXISTS idx_boosters_original_vaccination ON vaccination_boosters(original_vaccination_id);
CREATE INDEX IF NOT EXISTS idx_boosters_employee ON vaccination_boosters(employee_id);
CREATE INDEX IF NOT EXISTS idx_boosters_scheduled_date ON vaccination_boosters(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_boosters_status ON vaccination_boosters(booster_status);

CREATE INDEX IF NOT EXISTS idx_immunity_history_employee ON immunity_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_immunity_history_date ON immunity_history(measurement_date);
CREATE INDEX IF NOT EXISTS idx_immunity_history_vaccination ON immunity_history(vaccination_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON vaccination_campaigns(campaign_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON vaccination_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_manager ON vaccination_campaigns(campaign_manager_id);

CREATE INDEX IF NOT EXISTS idx_participation_campaign ON campaign_participation(campaign_id);
CREATE INDEX IF NOT EXISTS idx_participation_employee ON campaign_participation(employee_id);
CREATE INDEX IF NOT EXISTS idx_participation_status ON campaign_participation(completion_status);

CREATE INDEX IF NOT EXISTS idx_incidents_vaccination ON vaccination_incidents(vaccination_id);
CREATE INDEX IF NOT EXISTS idx_incidents_employee ON vaccination_incidents(employee_id);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON vaccination_incidents(incident_type);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON vaccination_incidents(severity);

-- Views for vaccination analytics

-- Current vaccination status overview
CREATE VIEW IF NOT EXISTS v_vaccination_status_overview AS
SELECT 
    e.employee_id,
    e.full_name,
    e.department,
    e.position,
    v.vaccination_id,
    v.scenario_name,
    v.scenario_category,
    v.vaccination_date,
    v.immunity_level,
    v.immunity_expiry_date,
    v.vaccination_status,
    v.effectiveness_score,
    v.booster_required,
    JULIANDAY(v.immunity_expiry_date) - JULIANDAY('now') as days_until_expiry,
    CASE 
        WHEN v.vaccination_status = 'CURRENT' AND JULIANDAY(v.immunity_expiry_date) - JULIANDAY('now') > 30 THEN 'HEALTHY'
        WHEN v.vaccination_status = 'CURRENT' AND JULIANDAY(v.immunity_expiry_date) - JULIANDAY('now') <= 30 THEN 'EXPIRING_SOON'
        WHEN v.vaccination_status = 'EXPIRED' THEN 'EXPIRED'
        WHEN v.vaccination_status = 'OVERDUE' THEN 'OVERDUE'
        ELSE 'NO_VACCINATION'
    END as immunity_status,
    CASE 
        WHEN v.immunity_level >= 90 THEN 'EXCELLENT'
        WHEN v.immunity_level >= 80 THEN 'GOOD'
        WHEN v.immunity_level >= 70 THEN 'SATISFACTORY'
        WHEN v.immunity_level >= 60 THEN 'MARGINAL'
        ELSE 'INSUFFICIENT'
    END as immunity_grade
FROM employees e
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, vaccination_id, scenario_name, scenario_category,
        vaccination_date, immunity_level, immunity_expiry_date,
        vaccination_status, effectiveness_score, booster_required,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
    FROM vaccinations
) v ON e.employee_id = v.employee_id AND v.rn = 1
WHERE e.active = true;

-- Vaccination effectiveness by scenario
CREATE VIEW IF NOT EXISTS v_scenario_effectiveness_summary AS
SELECT 
    vs.scenario_id,
    vs.scenario_name,
    vs.scenario_category,
    vs.difficulty_level,
    COUNT(v.vaccination_id) as total_vaccinations,
    AVG(v.immunity_level) as avg_immunity_gained,
    AVG(v.effectiveness_score) as avg_effectiveness_score,
    AVG(v.immunity_duration) as avg_immunity_duration,
    COUNT(CASE WHEN v.p4_reflection_applied = true THEN 1 END) as p4_reflections_applied,
    COUNT(CASE WHEN v.cultural_adaptations != '[]' THEN 1 END) as cultural_adaptations_used,
    COUNT(CASE WHEN v.legal_evidence_generated = true THEN 1 END) as legal_evidence_generated,
    COUNT(CASE WHEN v.officer_protection_active = true THEN 1 END) as officer_protections_active,
    -- Effectiveness tiers
    COUNT(CASE WHEN v.immunity_level >= 90 THEN 1 END) as excellent_outcomes,
    COUNT(CASE WHEN v.immunity_level BETWEEN 80 AND 89 THEN 1 END) as good_outcomes,
    COUNT(CASE WHEN v.immunity_level BETWEEN 70 AND 79 THEN 1 END) as satisfactory_outcomes,
    COUNT(CASE WHEN v.immunity_level < 70 THEN 1 END) as poor_outcomes,
    -- Success rates
    CAST(COUNT(CASE WHEN v.immunity_level >= 80 THEN 1 END) AS REAL) / COUNT(v.vaccination_id) * 100 as success_rate,
    CAST(COUNT(CASE WHEN v.p4_reflection_applied = true THEN 1 END) AS REAL) / COUNT(v.vaccination_id) * 100 as p4_adoption_rate
FROM vaccination_scenarios vs
LEFT JOIN vaccinations v ON vs.scenario_id = v.scenario_id
WHERE vs.active = true
GROUP BY vs.scenario_id, vs.scenario_name, vs.scenario_category, vs.difficulty_level
HAVING COUNT(v.vaccination_id) > 0
ORDER BY success_rate DESC, avg_effectiveness_score DESC;

-- Department vaccination compliance
CREATE VIEW IF NOT EXISTS v_department_vaccination_compliance AS
SELECT 
    d.department_name,
    COUNT(DISTINCT e.employee_id) as total_employees,
    COUNT(DISTINCT v.employee_id) as vaccinated_employees,
    COUNT(CASE WHEN v.vaccination_status = 'CURRENT' THEN 1 END) as current_vaccinations,
    COUNT(CASE WHEN v.vaccination_status = 'EXPIRED' THEN 1 END) as expired_vaccinations,
    COUNT(CASE WHEN v.vaccination_status = 'OVERDUE' THEN 1 END) as overdue_vaccinations,
    COUNT(CASE WHEN v.booster_required = true THEN 1 END) as boosters_required,
    AVG(v.immunity_level) as avg_immunity_level,
    AVG(v.effectiveness_score) as avg_effectiveness_score,
    -- Compliance metrics
    CAST(COUNT(DISTINCT v.employee_id) AS REAL) / COUNT(DISTINCT e.employee_id) * 100 as vaccination_coverage,
    CAST(COUNT(CASE WHEN v.vaccination_status = 'CURRENT' THEN 1 END) AS REAL) / COUNT(DISTINCT e.employee_id) * 100 as current_vaccination_rate,
    CAST(COUNT(CASE WHEN v.immunity_level >= 80 THEN 1 END) AS REAL) / COUNT(DISTINCT v.employee_id) * 100 as high_immunity_rate,
    -- Risk assessment
    CASE 
        WHEN CAST(COUNT(CASE WHEN v.vaccination_status = 'CURRENT' AND v.immunity_level >= 80 THEN 1 END) AS REAL) / COUNT(DISTINCT e.employee_id) >= 0.9 THEN 'LOW_RISK'
        WHEN CAST(COUNT(CASE WHEN v.vaccination_status = 'CURRENT' AND v.immunity_level >= 70 THEN 1 END) AS REAL) / COUNT(DISTINCT e.employee_id) >= 0.8 THEN 'MEDIUM_RISK'
        ELSE 'HIGH_RISK'
    END as department_risk_level,
    -- Priority recommendations
    CASE 
        WHEN COUNT(CASE WHEN v.vaccination_status = 'OVERDUE' THEN 1 END) > 5 THEN 'IMMEDIATE_VACCINATION_CAMPAIGN'
        WHEN COUNT(CASE WHEN v.booster_required = true THEN 1 END) > 10 THEN 'BOOSTER_CAMPAIGN_NEEDED'
        WHEN AVG(v.immunity_level) < 70 THEN 'ENHANCED_TRAINING_REQUIRED'
        ELSE 'CONTINUE_MONITORING'
    END as recommended_action
FROM departments d
LEFT JOIN employees e ON d.department_name = e.department AND e.active = true
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, vaccination_status, immunity_level, effectiveness_score, booster_required,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
    FROM vaccinations
) v ON e.employee_id = v.employee_id AND v.rn = 1
GROUP BY d.department_name
ORDER BY current_vaccination_rate ASC, avg_immunity_level ASC;

-- Vaccination campaign performance
CREATE VIEW IF NOT EXISTS v_campaign_performance AS
SELECT 
    vc.campaign_id,
    vc.campaign_name,
    vc.start_date,
    vc.end_date,
    vc.campaign_status,
    vc.target_employees,
    vc.vaccinated_employees,
    vc.completion_rate,
    vc.avg_effectiveness_score,
    COUNT(cp.participation_id) as total_participants,
    COUNT(CASE WHEN cp.completion_status = 'COMPLETED' THEN 1 END) as completed_participants,
    COUNT(CASE WHEN cp.completion_status = 'DROPPED_OUT' THEN 1 END) as dropouts,
    AVG(cp.avg_performance_score) as campaign_avg_performance,
    AVG(cp.overall_effectiveness) as campaign_overall_effectiveness,
    -- Success metrics
    CAST(COUNT(CASE WHEN cp.completion_status = 'COMPLETED' THEN 1 END) AS REAL) / COUNT(cp.participation_id) * 100 as completion_success_rate,
    CAST(COUNT(CASE WHEN cp.avg_performance_score >= 80 THEN 1 END) AS REAL) / COUNT(cp.participation_id) * 100 as high_performance_rate,
    -- Timeline analysis
    JULIANDAY('now') - JULIANDAY(vc.start_date) as days_since_start,
    JULIANDAY(vc.end_date) - JULIANDAY('now') as days_until_end,
    CASE 
        WHEN vc.campaign_status = 'COMPLETED' THEN 'COMPLETED'
        WHEN JULIANDAY('now') > JULIANDAY(vc.end_date) THEN 'OVERDUE'
        WHEN JULIANDAY('now') > JULIANDAY(vc.start_date) THEN 'IN_PROGRESS'
        ELSE 'UPCOMING'
    END as timeline_status
FROM vaccination_campaigns vc
LEFT JOIN campaign_participation cp ON vc.campaign_id = cp.campaign_id
GROUP BY vc.campaign_id, vc.campaign_name, vc.start_date, vc.end_date, vc.campaign_status, 
         vc.target_employees, vc.vaccinated_employees, vc.completion_rate, vc.avg_effectiveness_score
ORDER BY vc.start_date DESC;

-- Immunity decay analysis
CREATE VIEW IF NOT EXISTS v_immunity_decay_analysis AS
SELECT 
    e.employee_id,
    e.full_name,
    e.department,
    v.vaccination_id,
    v.scenario_category,
    v.vaccination_date,
    v.immunity_level as initial_immunity,
    v.immunity_expiry_date,
    ih.immunity_level as current_immunity,
    ih.measurement_date as last_measurement_date,
    v.immunity_level - ih.immunity_level as immunity_lost,
    JULIANDAY(ih.measurement_date) - JULIANDAY(v.vaccination_date) as days_since_vaccination,
    CASE 
        WHEN JULIANDAY(ih.measurement_date) - JULIANDAY(v.vaccination_date) > 0 
        THEN (v.immunity_level - ih.immunity_level) / (JULIANDAY(ih.measurement_date) - JULIANDAY(v.vaccination_date))
        ELSE 0 
    END as daily_decay_rate,
    CASE 
        WHEN (v.immunity_level - ih.immunity_level) / (JULIANDAY(ih.measurement_date) - JULIANDAY(v.vaccination_date)) > 0.5 THEN 'RAPID_DECAY'
        WHEN (v.immunity_level - ih.immunity_level) / (JULIANDAY(ih.measurement_date) - JULIANDAY(v.vaccination_date)) > 0.2 THEN 'MODERATE_DECAY'
        WHEN (v.immunity_level - ih.immunity_level) / (JULIANDAY(ih.measurement_date) - JULIANDAY(v.vaccination_date)) > 0.1 THEN 'SLOW_DECAY'
        ELSE 'STABLE'
    END as decay_classification
FROM employees e
JOIN vaccinations v ON e.employee_id = v.employee_id
JOIN immunity_history ih ON v.vaccination_id = ih.vaccination_id
WHERE e.active = true 
  AND ih.measurement_date = (
      SELECT MAX(measurement_date) 
      FROM immunity_history ih2 
      WHERE ih2.vaccination_id = v.vaccination_id
  )
  AND v.vaccination_date = (
      SELECT MAX(vaccination_date) 
      FROM vaccinations v2 
      WHERE v2.employee_id = e.employee_id
  )
ORDER BY daily_decay_rate DESC;