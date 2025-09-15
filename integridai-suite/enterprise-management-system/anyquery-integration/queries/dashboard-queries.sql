/**
 * 📊 Dashboard Queries for IntegridAI Enterprise Management System
 * 
 * Optimized SQL queries for executive dashboard and real-time monitoring
 * Compatible with anyquery SQL abstraction layer
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

-- ============================================================================
-- EXECUTIVE DASHBOARD METRICS
-- ============================================================================

-- Main dashboard metrics query
-- Returns key performance indicators for executive overview
SELECT 
    -- Basic employee metrics
    COUNT(DISTINCT e.employee_id) as total_employees,
    COUNT(DISTINCT CASE WHEN e.active = true THEN e.employee_id END) as active_employees,
    COUNT(DISTINCT CASE WHEN e.risk_profile = 'HIGH' THEN e.employee_id END) as high_risk_employees,
    
    -- Vaccination metrics
    AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) as avg_immunity_level,
    COUNT(CASE WHEN v.vaccination_status = 'CURRENT' THEN 1 END) as current_vaccinations,
    COUNT(CASE WHEN v.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) as vaccinations_due,
    COUNT(CASE WHEN v.booster_required = true THEN 1 END) as boosters_needed,
    
    -- Compliance scores
    AVG(CASE 
        WHEN v.immunity_level >= 90 THEN 100
        WHEN v.immunity_level >= 80 THEN 95
        WHEN v.immunity_level >= 70 THEN 85
        WHEN v.immunity_level >= 60 THEN 75
        ELSE 50
    END) as compliance_score,
    
    -- Risk assessment
    AVG(CASE WHEN r.risk_score IS NOT NULL THEN r.risk_score END) as avg_risk_score,
    COUNT(CASE WHEN r.risk_score >= 80 THEN 1 END) as critical_risk_employees,
    COUNT(CASE WHEN r.risk_score BETWEEN 60 AND 79 THEN 1 END) as medium_risk_employees,
    
    -- Training compliance
    COUNT(CASE WHEN e.compliance_training_due < DATE('now') THEN 1 END) as training_overdue,
    COUNT(CASE WHEN e.compliance_training_due BETWEEN DATE('now') AND DATE('now', '+30 days') THEN 1 END) as training_due_soon,
    
    -- Departmental health
    COUNT(DISTINCT CASE WHEN e.department IS NOT NULL THEN e.department END) as total_departments,
    
    -- Trend indicators (30-day comparison)
    COUNT(CASE WHEN v.vaccination_date >= DATE('now', '-30 days') THEN 1 END) as new_vaccinations_30d,
    COUNT(CASE WHEN r.assessment_date >= DATE('now', '-30 days') THEN 1 END) as new_risk_assessments_30d,
    
    -- System health
    MAX(v.last_sync) as last_vaccination_sync,
    MAX(e.last_sync) as last_employee_sync,
    
    -- Report timestamp
    DATETIME('now') as dashboard_generated_at
FROM employees e
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, immunity_level, vaccination_status, booster_required, 
        vaccination_date, last_sync,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
    FROM vaccinations
) v ON e.employee_id = v.employee_id AND v.rn = 1
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, risk_score, assessment_date,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY assessment_date DESC) as rn
    FROM risk_assessments
) r ON e.employee_id = r.employee_id AND r.rn = 1;

-- ============================================================================
-- DEPARTMENT OVERVIEW DASHBOARD
-- ============================================================================

-- Department-level compliance and performance metrics
-- Provides detailed breakdown by department for management oversight
SELECT 
    d.department_name,
    d.manager_id,
    manager.full_name as manager_name,
    d.compliance_officer_id,
    officer.full_name as compliance_officer_name,
    
    -- Employee counts
    COUNT(e.employee_id) as total_employees,
    COUNT(CASE WHEN e.active = true THEN 1 END) as active_employees,
    COUNT(CASE WHEN e.risk_profile = 'HIGH' THEN 1 END) as high_risk_count,
    COUNT(CASE WHEN e.risk_profile = 'MEDIUM' THEN 1 END) as medium_risk_count,
    COUNT(CASE WHEN e.risk_profile = 'LOW' THEN 1 END) as low_risk_count,
    
    -- Vaccination status
    COUNT(CASE WHEN v.vaccination_status = 'CURRENT' THEN 1 END) as current_vaccinations,
    COUNT(CASE WHEN v.vaccination_status = 'EXPIRED' THEN 1 END) as expired_vaccinations,
    COUNT(CASE WHEN v.vaccination_status = 'OVERDUE' THEN 1 END) as overdue_vaccinations,
    COUNT(CASE WHEN v.vaccination_status IS NULL THEN 1 END) as never_vaccinated,
    
    -- Immunity metrics
    AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) as avg_immunity,
    MIN(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) as min_immunity,
    MAX(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) as max_immunity,
    
    -- Risk metrics
    AVG(CASE WHEN r.risk_score IS NOT NULL THEN r.risk_score END) as avg_risk_score,
    MAX(CASE WHEN r.risk_score IS NOT NULL THEN r.risk_score END) as max_risk_score,
    
    -- Training compliance
    COUNT(CASE WHEN e.compliance_training_due < DATE('now') THEN 1 END) as training_overdue,
    COUNT(CASE WHEN e.compliance_training_due BETWEEN DATE('now') AND DATE('now', '+30 days') THEN 1 END) as training_due_soon,
    
    -- Performance calculations
    CASE 
        WHEN COUNT(e.employee_id) = 0 THEN 0
        ELSE CAST(COUNT(CASE WHEN v.vaccination_status = 'CURRENT' THEN 1 END) AS REAL) / COUNT(e.employee_id) * 100
    END as vaccination_compliance_rate,
    
    CASE 
        WHEN COUNT(CASE WHEN v.immunity_level IS NOT NULL THEN 1 END) = 0 THEN 0
        ELSE CAST(COUNT(CASE WHEN v.immunity_level >= 80 THEN 1 END) AS REAL) / COUNT(CASE WHEN v.immunity_level IS NOT NULL THEN 1 END) * 100
    END as high_immunity_rate,
    
    -- Compliance status classification
    CASE 
        WHEN AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) >= 90 THEN '🟢 EXCELLENT'
        WHEN AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) >= 80 THEN '🟢 GOOD'
        WHEN AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) >= 70 THEN '🟡 WARNING'
        WHEN AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) >= 60 THEN '🟠 CONCERN'
        ELSE '🔴 CRITICAL'
    END as compliance_status,
    
    -- Priority recommendations
    CASE 
        WHEN COUNT(CASE WHEN v.vaccination_status = 'OVERDUE' THEN 1 END) > 5 THEN 'IMMEDIATE_VACCINATION_REQUIRED'
        WHEN AVG(CASE WHEN v.immunity_level IS NOT NULL THEN v.immunity_level END) < 70 THEN 'ENHANCED_TRAINING_NEEDED'
        WHEN COUNT(CASE WHEN e.risk_profile = 'HIGH' THEN 1 END) > 10 THEN 'RISK_MITIGATION_FOCUS'
        WHEN COUNT(CASE WHEN e.compliance_training_due < DATE('now') THEN 1 END) > 5 THEN 'TRAINING_CATCH_UP_REQUIRED'
        ELSE 'CONTINUE_MONITORING'
    END as recommended_action,
    
    -- Audit information
    d.last_audit_date,
    d.next_audit_due,
    CASE 
        WHEN d.next_audit_due < DATE('now') THEN 'AUDIT_OVERDUE'
        WHEN d.next_audit_due <= DATE('now', '+30 days') THEN 'AUDIT_DUE_SOON'
        ELSE 'AUDIT_CURRENT'
    END as audit_status
    
FROM departments d
LEFT JOIN employees e ON d.department_name = e.department
LEFT JOIN employees manager ON d.manager_id = manager.employee_id
LEFT JOIN employees officer ON d.compliance_officer_id = officer.employee_id
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, immunity_level, vaccination_status, vaccination_date,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
    FROM vaccinations
) v ON e.employee_id = v.employee_id AND v.rn = 1
LEFT JOIN (
    SELECT DISTINCT 
        employee_id, risk_score, assessment_date,
        ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY assessment_date DESC) as rn
    FROM risk_assessments
) r ON e.employee_id = r.employee_id AND r.rn = 1
GROUP BY 
    d.department_name, d.manager_id, manager.full_name, 
    d.compliance_officer_id, officer.full_name, 
    d.last_audit_date, d.next_audit_due
ORDER BY 
    CASE compliance_status
        WHEN '🔴 CRITICAL' THEN 1
        WHEN '🟠 CONCERN' THEN 2
        WHEN '🟡 WARNING' THEN 3
        WHEN '🟢 GOOD' THEN 4
        WHEN '🟢 EXCELLENT' THEN 5
    END,
    avg_immunity ASC;

-- ============================================================================
-- REAL-TIME ALERTS DASHBOARD
-- ============================================================================

-- Critical alerts requiring immediate attention
-- Prioritized list of employees and situations needing intervention
SELECT 
    alert_id,
    alert_type,
    severity,
    employee_id,
    full_name,
    department,
    position,
    alert_title,
    alert_description,
    recommended_action,
    created_at,
    days_since_alert,
    priority_score
FROM (
    -- High-risk employees with low immunity
    SELECT 
        'RISK_' || e.employee_id as alert_id,
        'HIGH_RISK_LOW_IMMUNITY' as alert_type,
        'CRITICAL' as severity,
        e.employee_id,
        e.full_name,
        e.department,
        e.position,
        'High-risk employee with insufficient immunity' as alert_title,
        'Employee ' || e.full_name || ' has risk profile HIGH and immunity level ' || COALESCE(v.immunity_level, 0) || '%' as alert_description,
        'Schedule immediate revaccination and enhanced monitoring' as recommended_action,
        DATETIME('now') as created_at,
        0 as days_since_alert,
        100 as priority_score
    FROM employees e
    LEFT JOIN (
        SELECT DISTINCT 
            employee_id, immunity_level, vaccination_status,
            ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
        FROM vaccinations
    ) v ON e.employee_id = v.employee_id AND v.rn = 1
    WHERE e.active = true 
      AND e.risk_profile = 'HIGH' 
      AND (v.immunity_level IS NULL OR v.immunity_level < 60)
    
    UNION ALL
    
    -- Overdue vaccinations
    SELECT 
        'VAC_' || e.employee_id as alert_id,
        'VACCINATION_OVERDUE' as alert_type,
        CASE 
            WHEN v.vaccination_status = 'OVERDUE' THEN 'CRITICAL'
            WHEN JULIANDAY('now') - JULIANDAY(v.immunity_expiry_date) > 30 THEN 'CRITICAL'
            ELSE 'HIGH'
        END as severity,
        e.employee_id,
        e.full_name,
        e.department,
        e.position,
        'Vaccination overdue for ' || CAST(JULIANDAY('now') - JULIANDAY(v.immunity_expiry_date) AS INTEGER) || ' days' as alert_title,
        'Employee requires immediate revaccination - immunity expired on ' || v.immunity_expiry_date as alert_description,
        'Schedule revaccination within 48 hours' as recommended_action,
        DATETIME('now') as created_at,
        CAST(JULIANDAY('now') - JULIANDAY(v.immunity_expiry_date) AS INTEGER) as days_since_alert,
        90 + CAST(JULIANDAY('now') - JULIANDAY(v.immunity_expiry_date) AS INTEGER) as priority_score
    FROM employees e
    JOIN (
        SELECT DISTINCT 
            employee_id, vaccination_status, immunity_expiry_date,
            ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
        FROM vaccinations
    ) v ON e.employee_id = v.employee_id AND v.rn = 1
    WHERE e.active = true 
      AND (v.vaccination_status IN ('EXPIRED', 'OVERDUE') OR v.immunity_expiry_date < DATE('now'))
    
    UNION ALL
    
    -- High risk scores
    SELECT 
        'SCORE_' || e.employee_id as alert_id,
        'HIGH_RISK_SCORE' as alert_type,
        CASE 
            WHEN r.risk_score >= 90 THEN 'CRITICAL'
            WHEN r.risk_score >= 80 THEN 'HIGH'
            ELSE 'MEDIUM'
        END as severity,
        e.employee_id,
        e.full_name,
        e.department,
        e.position,
        'Risk score elevated to ' || r.risk_score as alert_title,
        'Employee risk assessment shows score of ' || r.risk_score || ' - requires intervention' as alert_description,
        CASE 
            WHEN r.risk_score >= 90 THEN 'Immediate risk mitigation and monitoring required'
            WHEN r.risk_score >= 80 THEN 'Enhanced monitoring and targeted training needed'
            ELSE 'Regular monitoring and follow-up assessment'
        END as recommended_action,
        r.assessment_date as created_at,
        CAST(JULIANDAY('now') - JULIANDAY(r.assessment_date) AS INTEGER) as days_since_alert,
        r.risk_score as priority_score
    FROM employees e
    JOIN (
        SELECT DISTINCT 
            employee_id, risk_score, assessment_date,
            ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY assessment_date DESC) as rn
        FROM risk_assessments
    ) r ON e.employee_id = r.employee_id AND r.rn = 1
    WHERE e.active = true 
      AND r.risk_score >= 70
    
    UNION ALL
    
    -- Training overdue
    SELECT 
        'TRAIN_' || e.employee_id as alert_id,
        'TRAINING_OVERDUE' as alert_type,
        CASE 
            WHEN JULIANDAY('now') - JULIANDAY(e.compliance_training_due) > 60 THEN 'HIGH'
            WHEN JULIANDAY('now') - JULIANDAY(e.compliance_training_due) > 30 THEN 'MEDIUM'
            ELSE 'LOW'
        END as severity,
        e.employee_id,
        e.full_name,
        e.department,
        e.position,
        'Compliance training overdue by ' || CAST(JULIANDAY('now') - JULIANDAY(e.compliance_training_due) AS INTEGER) || ' days' as alert_title,
        'Employee requires updated compliance training - due date was ' || e.compliance_training_due as alert_description,
        'Schedule compliance training update within 2 weeks' as recommended_action,
        DATETIME('now') as created_at,
        CAST(JULIANDAY('now') - JULIANDAY(e.compliance_training_due) AS INTEGER) as days_since_alert,
        60 + CAST(JULIANDAY('now') - JULIANDAY(e.compliance_training_due) AS INTEGER) as priority_score
    FROM employees e
    WHERE e.active = true 
      AND e.compliance_training_due < DATE('now')
    
    UNION ALL
    
    -- Department compliance issues
    SELECT 
        'DEPT_' || dept_summary.department_name as alert_id,
        'DEPARTMENT_COMPLIANCE' as alert_type,
        CASE 
            WHEN dept_summary.avg_immunity < 60 THEN 'CRITICAL'
            WHEN dept_summary.avg_immunity < 70 THEN 'HIGH'
            ELSE 'MEDIUM'
        END as severity,
        NULL as employee_id,
        'Department: ' || dept_summary.department_name as full_name,
        dept_summary.department_name as department,
        'Department-wide' as position,
        'Department compliance below threshold' as alert_title,
        'Department ' || dept_summary.department_name || ' has average immunity of ' || ROUND(dept_summary.avg_immunity, 1) || '%' as alert_description,
        'Implement department-wide vaccination campaign' as recommended_action,
        DATETIME('now') as created_at,
        0 as days_since_alert,
        CASE 
            WHEN dept_summary.avg_immunity < 60 THEN 85
            WHEN dept_summary.avg_immunity < 70 THEN 75
            ELSE 65
        END as priority_score
    FROM (
        SELECT 
            d.department_name,
            AVG(v.immunity_level) as avg_immunity,
            COUNT(e.employee_id) as total_employees
        FROM departments d
        LEFT JOIN employees e ON d.department_name = e.department AND e.active = true
        LEFT JOIN (
            SELECT DISTINCT 
                employee_id, immunity_level,
                ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY vaccination_date DESC) as rn
            FROM vaccinations
        ) v ON e.employee_id = v.employee_id AND v.rn = 1
        GROUP BY d.department_name
        HAVING COUNT(e.employee_id) >= 5 AND AVG(v.immunity_level) < 75
    ) dept_summary
) alerts
ORDER BY 
    CASE severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        ELSE 4
    END,
    priority_score DESC,
    days_since_alert DESC
LIMIT 50;

-- ============================================================================
-- COMPLIANCE TRENDS ANALYSIS
-- ============================================================================

-- 30-day trend analysis for executive dashboard
-- Shows improvement or decline in key compliance metrics
WITH trend_base AS (
    SELECT 
        DATE(v.vaccination_date) as trend_date,
        COUNT(v.vaccination_id) as daily_vaccinations,
        AVG(v.immunity_level) as daily_avg_immunity,
        COUNT(CASE WHEN v.immunity_level >= 80 THEN 1 END) as high_immunity_vaccinations,
        COUNT(CASE WHEN e.risk_profile = 'HIGH' THEN 1 END) as high_risk_vaccinations
    FROM vaccinations v
    JOIN employees e ON v.employee_id = e.employee_id
    WHERE v.vaccination_date >= DATE('now', '-30 days')
      AND e.active = true
    GROUP BY DATE(v.vaccination_date)
),
weekly_trends AS (
    SELECT 
        CASE 
            WHEN trend_date >= DATE('now', '-7 days') THEN 'current_week'
            WHEN trend_date >= DATE('now', '-14 days') THEN 'prev_week'
            WHEN trend_date >= DATE('now', '-21 days') THEN 'two_weeks_ago'
            ELSE 'three_weeks_ago'
        END as week_period,
        SUM(daily_vaccinations) as total_vaccinations,
        AVG(daily_avg_immunity) as avg_immunity_level,
        CAST(SUM(high_immunity_vaccinations) AS REAL) / SUM(daily_vaccinations) * 100 as high_immunity_rate
    FROM trend_base
    GROUP BY week_period
)
SELECT 
    'vaccination_trend' as metric_name,
    current_week.total_vaccinations as current_value,
    prev_week.total_vaccinations as previous_value,
    CASE 
        WHEN prev_week.total_vaccinations = 0 THEN 0
        ELSE ROUND((current_week.total_vaccinations - prev_week.total_vaccinations) * 100.0 / prev_week.total_vaccinations, 1)
    END as percentage_change,
    CASE 
        WHEN current_week.total_vaccinations > prev_week.total_vaccinations THEN 'IMPROVING'
        WHEN current_week.total_vaccinations < prev_week.total_vaccinations THEN 'DECLINING'
        ELSE 'STABLE'
    END as trend_direction
FROM weekly_trends current_week
JOIN weekly_trends prev_week ON prev_week.week_period = 'prev_week'
WHERE current_week.week_period = 'current_week'

UNION ALL

SELECT 
    'immunity_trend' as metric_name,
    ROUND(current_week.avg_immunity_level, 1) as current_value,
    ROUND(prev_week.avg_immunity_level, 1) as previous_value,
    CASE 
        WHEN prev_week.avg_immunity_level = 0 THEN 0
        ELSE ROUND((current_week.avg_immunity_level - prev_week.avg_immunity_level) * 100.0 / prev_week.avg_immunity_level, 1)
    END as percentage_change,
    CASE 
        WHEN current_week.avg_immunity_level > prev_week.avg_immunity_level THEN 'IMPROVING'
        WHEN current_week.avg_immunity_level < prev_week.avg_immunity_level THEN 'DECLINING'
        ELSE 'STABLE'
    END as trend_direction
FROM weekly_trends current_week
JOIN weekly_trends prev_week ON prev_week.week_period = 'prev_week'
WHERE current_week.week_period = 'current_week'

UNION ALL

SELECT 
    'quality_trend' as metric_name,
    ROUND(current_week.high_immunity_rate, 1) as current_value,
    ROUND(prev_week.high_immunity_rate, 1) as previous_value,
    CASE 
        WHEN prev_week.high_immunity_rate = 0 THEN 0
        ELSE ROUND((current_week.high_immunity_rate - prev_week.high_immunity_rate), 1)
    END as percentage_change,
    CASE 
        WHEN current_week.high_immunity_rate > prev_week.high_immunity_rate THEN 'IMPROVING'
        WHEN current_week.high_immunity_rate < prev_week.high_immunity_rate THEN 'DECLINING'
        ELSE 'STABLE'
    END as trend_direction
FROM weekly_trends current_week
JOIN weekly_trends prev_week ON prev_week.week_period = 'prev_week'
WHERE current_week.week_period = 'current_week';

-- ============================================================================
-- SYSTEM HEALTH DASHBOARD
-- ============================================================================

-- Data source connectivity and synchronization status
-- Monitors the health of data integrations and anyquery connectors
SELECT 
    'data_sources' as component,
    JSON_OBJECT(
        'hrms_last_sync', (SELECT MAX(last_sync) FROM employees),
        'hrms_total_records', (SELECT COUNT(*) FROM employees WHERE active = true),
        'vaccination_last_sync', (SELECT MAX(last_sync) FROM vaccinations),
        'vaccination_total_records', (SELECT COUNT(*) FROM vaccinations WHERE vaccination_date >= DATE('now', '-365 days')),
        'risk_assessments_count', (SELECT COUNT(*) FROM risk_assessments WHERE assessment_date >= DATE('now', '-180 days')),
        'active_campaigns', (SELECT COUNT(*) FROM vaccination_campaigns WHERE campaign_status = 'ACTIVE'),
        'system_health_score', 
            CASE 
                WHEN (SELECT MAX(last_sync) FROM employees) >= DATETIME('now', '-2 hours') AND
                     (SELECT MAX(last_sync) FROM vaccinations) >= DATETIME('now', '-2 hours') THEN 100
                WHEN (SELECT MAX(last_sync) FROM employees) >= DATETIME('now', '-6 hours') AND
                     (SELECT MAX(last_sync) FROM vaccinations) >= DATETIME('now', '-6 hours') THEN 80
                WHEN (SELECT MAX(last_sync) FROM employees) >= DATETIME('now', '-24 hours') AND
                     (SELECT MAX(last_sync) FROM vaccinations) >= DATETIME('now', '-24 hours') THEN 60
                ELSE 40
            END
    ) as health_data,
    DATETIME('now') as check_timestamp;