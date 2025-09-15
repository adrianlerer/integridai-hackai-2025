/**
 * 👥 Employee Schema for IntegridAI Enterprise Management System
 * 
 * Unified SQL schema for employee data across all HRMS systems
 * Compatible with anyquery SQL abstraction layer
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

-- Main employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_id TEXT PRIMARY KEY NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    department TEXT,
    position TEXT,
    hire_date DATE,
    manager_id TEXT,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Compliance-specific fields
    risk_profile TEXT CHECK (risk_profile IN ('LOW', 'MEDIUM', 'HIGH')),
    security_clearance TEXT,
    compliance_training_due DATE,
    vaccination_status TEXT CHECK (vaccination_status IN ('CURRENT', 'EXPIRED', 'OVERDUE', 'NEVER_VACCINATED')),
    
    -- Metadata
    last_sync DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    dept_id TEXT PRIMARY KEY NOT NULL,
    department_name TEXT UNIQUE NOT NULL,
    manager_id TEXT,
    risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
    compliance_officer_id TEXT,
    
    -- Compliance metrics
    avg_immunity_level REAL DEFAULT 0,
    total_employees INTEGER DEFAULT 0,
    high_risk_employees INTEGER DEFAULT 0,
    last_audit_date DATE,
    next_audit_due DATE,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id),
    FOREIGN KEY (compliance_officer_id) REFERENCES employees(employee_id)
);

-- Employee positions/roles
CREATE TABLE IF NOT EXISTS positions (
    position_id TEXT PRIMARY KEY NOT NULL,
    position_name TEXT UNIQUE NOT NULL,
    department_id TEXT NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
    requires_security_clearance BOOLEAN DEFAULT FALSE,
    min_immunity_level INTEGER DEFAULT 60,
    
    -- Training requirements
    mandatory_training_modules TEXT, -- JSON array
    training_frequency_months INTEGER DEFAULT 12,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (department_id) REFERENCES departments(dept_id)
);

-- Employee training records
CREATE TABLE IF NOT EXISTS employee_training (
    training_id TEXT PRIMARY KEY NOT NULL,
    employee_id TEXT NOT NULL,
    training_module TEXT NOT NULL,
    completion_date DATE NOT NULL,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_hash TEXT,
    
    -- Training metadata
    training_provider TEXT,
    training_duration_hours REAL,
    next_renewal_date DATE,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Risk assessments
CREATE TABLE IF NOT EXISTS risk_assessments (
    assessment_id TEXT PRIMARY KEY NOT NULL,
    employee_id TEXT NOT NULL,
    assessment_date DATE NOT NULL,
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100) NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')) NOT NULL,
    
    -- Risk factors
    position_risk_score INTEGER DEFAULT 0,
    department_risk_score INTEGER DEFAULT 0,
    tenure_risk_score INTEGER DEFAULT 0,
    training_risk_score INTEGER DEFAULT 0,
    vaccination_risk_score INTEGER DEFAULT 0,
    
    -- Assessment details
    assessed_by TEXT,
    assessment_method TEXT,
    risk_factors_identified TEXT, -- JSON array
    mitigation_recommendations TEXT, -- JSON array
    
    -- Follow-up
    next_assessment_due DATE,
    mitigation_implemented BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Compliance officers
CREATE TABLE IF NOT EXISTS compliance_officers (
    officer_id TEXT PRIMARY KEY NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    department_coverage TEXT, -- JSON array of department IDs
    certification_level TEXT,
    appointment_date DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Officer capabilities
    can_approve_risk_assessments BOOLEAN DEFAULT TRUE,
    can_schedule_vaccinations BOOLEAN DEFAULT TRUE,
    can_generate_reports BOOLEAN DEFAULT TRUE,
    can_investigate_incidents BOOLEAN DEFAULT FALSE,
    
    -- Performance metrics
    employees_managed INTEGER DEFAULT 0,
    avg_compliance_score REAL DEFAULT 0,
    incidents_handled INTEGER DEFAULT 0,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Employee hierarchies (for complex reporting structures)
CREATE TABLE IF NOT EXISTS employee_hierarchy (
    hierarchy_id TEXT PRIMARY KEY NOT NULL,
    employee_id TEXT NOT NULL,
    parent_id TEXT,
    hierarchy_level INTEGER NOT NULL,
    path_to_root TEXT, -- Materialized path for efficient queries
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (parent_id) REFERENCES employees(employee_id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(active);
CREATE INDEX IF NOT EXISTS idx_employees_risk_profile ON employees(risk_profile);
CREATE INDEX IF NOT EXISTS idx_employees_hire_date ON employees(hire_date);
CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_vaccination_status ON employees(vaccination_status);
CREATE INDEX IF NOT EXISTS idx_employees_compliance_training_due ON employees(compliance_training_due);

CREATE INDEX IF NOT EXISTS idx_departments_risk_level ON departments(risk_level);
CREATE INDEX IF NOT EXISTS idx_departments_compliance_officer ON departments(compliance_officer_id);
CREATE INDEX IF NOT EXISTS idx_departments_audit_date ON departments(last_audit_date);

CREATE INDEX IF NOT EXISTS idx_positions_risk_level ON positions(risk_level);
CREATE INDEX IF NOT EXISTS idx_positions_department ON positions(department_id);

CREATE INDEX IF NOT EXISTS idx_training_employee ON employee_training(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_completion_date ON employee_training(completion_date);
CREATE INDEX IF NOT EXISTS idx_training_module ON employee_training(training_module);
CREATE INDEX IF NOT EXISTS idx_training_renewal_date ON employee_training(next_renewal_date);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_employee ON risk_assessments(employee_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_date ON risk_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_risk_level ON risk_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_score ON risk_assessments(risk_score);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_next_due ON risk_assessments(next_assessment_due);

CREATE INDEX IF NOT EXISTS idx_compliance_officers_active ON compliance_officers(active);
CREATE INDEX IF NOT EXISTS idx_compliance_officers_employee ON compliance_officers(employee_id);

CREATE INDEX IF NOT EXISTS idx_hierarchy_employee ON employee_hierarchy(employee_id);
CREATE INDEX IF NOT EXISTS idx_hierarchy_parent ON employee_hierarchy(parent_id);
CREATE INDEX IF NOT EXISTS idx_hierarchy_level ON employee_hierarchy(hierarchy_level);

-- Views for common queries

-- Active employees with current risk and vaccination status
CREATE VIEW IF NOT EXISTS v_employee_compliance_overview AS
SELECT 
    e.employee_id,
    e.full_name,
    e.email,
    e.department,
    e.position,
    e.hire_date,
    e.risk_profile,
    e.vaccination_status,
    e.compliance_training_due,
    r.risk_score,
    r.assessment_date as last_risk_assessment,
    r.next_assessment_due,
    CASE 
        WHEN e.compliance_training_due < DATE('now') THEN 'OVERDUE'
        WHEN e.compliance_training_due <= DATE('now', '+30 days') THEN 'DUE_SOON'
        ELSE 'CURRENT'
    END as training_status,
    CASE 
        WHEN e.vaccination_status = 'CURRENT' AND 
             r.risk_score <= 50 AND 
             e.compliance_training_due > DATE('now') THEN 'COMPLIANT'
        WHEN e.vaccination_status = 'CURRENT' AND 
             r.risk_score <= 70 THEN 'PARTIALLY_COMPLIANT'
        ELSE 'NON_COMPLIANT'
    END as overall_compliance_status
FROM employees e
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, 
        risk_score, 
        assessment_date, 
        next_assessment_due,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY assessment_date DESC) as rn
    FROM risk_assessments
) r ON e.employee_id = r.employee_id AND r.rn = 1
WHERE e.active = true;

-- Department compliance summary
CREATE VIEW IF NOT EXISTS v_department_compliance_summary AS
SELECT 
    d.dept_id,
    d.department_name,
    d.manager_id,
    d.compliance_officer_id,
    d.risk_level as department_risk_level,
    COUNT(e.employee_id) as total_employees,
    COUNT(CASE WHEN e.active = true THEN 1 END) as active_employees,
    COUNT(CASE WHEN e.risk_profile = 'HIGH' THEN 1 END) as high_risk_employees,
    COUNT(CASE WHEN e.vaccination_status = 'CURRENT' THEN 1 END) as current_vaccinations,
    COUNT(CASE WHEN e.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) as overdue_vaccinations,
    COUNT(CASE WHEN e.compliance_training_due < DATE('now') THEN 1 END) as overdue_training,
    AVG(CASE WHEN r.risk_score IS NOT NULL THEN r.risk_score END) as avg_risk_score,
    d.last_audit_date,
    d.next_audit_due,
    CASE 
        WHEN AVG(CASE WHEN r.risk_score IS NOT NULL THEN r.risk_score END) <= 30 THEN 'LOW_RISK'
        WHEN AVG(CASE WHEN r.risk_score IS NOT NULL THEN r.risk_score END) <= 60 THEN 'MEDIUM_RISK'
        ELSE 'HIGH_RISK'
    END as calculated_risk_level,
    CASE 
        WHEN COUNT(CASE WHEN e.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) = 0 AND
             COUNT(CASE WHEN e.compliance_training_due < DATE('now') THEN 1 END) = 0 THEN 'COMPLIANT'
        WHEN COUNT(CASE WHEN e.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) <= 3 AND
             COUNT(CASE WHEN e.compliance_training_due < DATE('now') THEN 1 END) <= 3 THEN 'PARTIALLY_COMPLIANT'
        ELSE 'NON_COMPLIANT'
    END as compliance_status
FROM departments d
LEFT JOIN employees e ON d.department_name = e.department
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, 
        risk_score,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY assessment_date DESC) as rn
    FROM risk_assessments
) r ON e.employee_id = r.employee_id AND r.rn = 1
GROUP BY d.dept_id, d.department_name, d.manager_id, d.compliance_officer_id, d.risk_level, d.last_audit_date, d.next_audit_due;

-- High-risk employees requiring immediate attention
CREATE VIEW IF NOT EXISTS v_high_risk_employees AS
SELECT 
    e.employee_id,
    e.full_name,
    e.department,
    e.position,
    e.risk_profile,
    e.vaccination_status,
    r.risk_score,
    r.assessment_date,
    CASE 
        WHEN e.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 'VACCINATION_REQUIRED'
        WHEN r.risk_score >= 80 THEN 'HIGH_RISK_MONITORING'
        WHEN e.compliance_training_due < DATE('now') THEN 'TRAINING_OVERDUE'
        ELSE 'GENERAL_MONITORING'
    END as priority_action,
    CASE 
        WHEN e.vaccination_status = 'OVERDUE' AND r.risk_score >= 80 THEN 'CRITICAL'
        WHEN e.vaccination_status IN ('EXPIRED', 'OVERDUE') OR r.risk_score >= 80 THEN 'HIGH'
        WHEN e.compliance_training_due < DATE('now') THEN 'MEDIUM'
        ELSE 'LOW'
    END as alert_level
FROM employees e
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, 
        risk_score, 
        assessment_date,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY assessment_date DESC) as rn
    FROM risk_assessments
) r ON e.employee_id = r.employee_id AND r.rn = 1
WHERE e.active = true 
  AND (e.risk_profile = 'HIGH' OR 
       r.risk_score >= 70 OR 
       e.vaccination_status IN ('EXPIRED', 'OVERDUE') OR
       e.compliance_training_due < DATE('now'))
ORDER BY 
    CASE alert_level
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        ELSE 4
    END,
    r.risk_score DESC;

-- Training compliance tracking
CREATE VIEW IF NOT EXISTS v_training_compliance AS
SELECT 
    e.employee_id,
    e.full_name,
    e.department,
    e.position,
    e.hire_date,
    COUNT(t.training_id) as total_trainings,
    MAX(t.completion_date) as last_training_date,
    AVG(t.score) as avg_training_score,
    COUNT(CASE WHEN t.next_renewal_date < DATE('now') THEN 1 END) as overdue_renewals,
    COUNT(CASE WHEN t.next_renewal_date BETWEEN DATE('now') AND DATE('now', '+30 days') THEN 1 END) as due_soon,
    CASE 
        WHEN COUNT(t.training_id) = 0 THEN 'NO_TRAINING'
        WHEN COUNT(CASE WHEN t.next_renewal_date < DATE('now') THEN 1 END) > 0 THEN 'OVERDUE'
        WHEN COUNT(CASE WHEN t.next_renewal_date BETWEEN DATE('now') AND DATE('now', '+30 days') THEN 1 END) > 0 THEN 'DUE_SOON'
        ELSE 'CURRENT'
    END as training_status,
    CASE 
        WHEN AVG(t.score) >= 90 THEN 'EXCELLENT'
        WHEN AVG(t.score) >= 80 THEN 'GOOD'
        WHEN AVG(t.score) >= 70 THEN 'SATISFACTORY'
        ELSE 'NEEDS_IMPROVEMENT'
    END as performance_level
FROM employees e
LEFT JOIN employee_training t ON e.employee_id = t.employee_id
WHERE e.active = true
GROUP BY e.employee_id, e.full_name, e.department, e.position, e.hire_date;

-- Compliance officer workload
CREATE VIEW IF NOT EXISTS v_compliance_officer_workload AS
SELECT 
    co.officer_id,
    co.employee_id,
    e.full_name as officer_name,
    co.department_coverage,
    co.certification_level,
    co.employees_managed,
    co.avg_compliance_score,
    COUNT(CASE WHEN emp.risk_profile = 'HIGH' THEN 1 END) as high_risk_employees_assigned,
    COUNT(CASE WHEN emp.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) as vaccination_issues,
    COUNT(CASE WHEN emp.compliance_training_due < DATE('now') THEN 1 END) as training_overdue,
    CASE 
        WHEN co.employees_managed > 100 THEN 'OVERLOADED'
        WHEN co.employees_managed > 50 THEN 'HIGH_LOAD'
        WHEN co.employees_managed > 20 THEN 'MEDIUM_LOAD'
        ELSE 'LOW_LOAD'
    END as workload_status
FROM compliance_officers co
JOIN employees e ON co.employee_id = e.employee_id
LEFT JOIN employees emp ON JSON_EXTRACT(co.department_coverage, '$[*]') LIKE '%' || emp.department || '%'
WHERE co.active = true AND e.active = true
GROUP BY co.officer_id, co.employee_id, e.full_name, co.department_coverage, co.certification_level, co.employees_managed, co.avg_compliance_score;