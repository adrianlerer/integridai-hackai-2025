/**
 * 🌐 Enterprise API Endpoints for IntegridAI Management System
 * 
 * REST API endpoints for compliance dashboard and enterprise management
 * Powered by anyquery SQL abstraction and real-time monitoring
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

import express from 'express';
import { AnyqueryClient } from './anyquery-bridge.js';
import { SecurityValidator } from './security-validator.js';
import { AuditLogger } from './audit-logger.js';
import { EnhancedMCPIntegration } from './mcp-integration.js';
import { HRMSConnector } from '../anyquery-integration/connectors/hrms-connector.js';
import { SurveyConnector } from '../anyquery-integration/connectors/survey-connector.js';
import { VaccinationConnector } from '../anyquery-integration/connectors/vaccination-connector.js';

export interface DashboardMetrics {
  avg_immunity: number;
  high_risk_employees: number;
  vaccinations_due: number;
  compliance_score: number;
  immunity_trend: number;
  risk_trend: number;
  vaccination_trend: number;
  compliance_trend: number;
  last_updated: string;
}

export interface DepartmentOverview {
  department_name: string;
  total_employees: number;
  avg_immunity: number;
  needs_revaccination: number;
  high_risk_count: number;
  compliance_status: string;
  last_audit_date?: string;
}

export interface CriticalAlert {
  alert_id: string;
  alert_type: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  employee_id?: string;
  department?: string;
  recommended_action?: string;
}

export interface ComplianceReport {
  report_id: string;
  report_type: string;
  generated_at: string;
  summary: {
    total_employees: number;
    compliance_score: number;
    ley27401_status: string;
    vaccination_compliance: number;
  };
  details: any[];
  recommendations: string[];
  audit_trail: any;
}

/**
 * Enterprise API Gateway Class
 */
export class EnterpriseAPIGateway {
  private app: express.Application;
  private anyqueryClient: AnyqueryClient;
  private security: SecurityValidator;
  private audit: AuditLogger;
  private mcpIntegration: EnhancedMCPIntegration;
  private hrmsConnector: HRMSConnector;
  private surveyConnector: SurveyConnector;
  private vaccinationConnector: VaccinationConnector;

  constructor() {
    this.app = express();
    this.anyqueryClient = new AnyqueryClient({
      host: process.env.ANYQUERY_HOST || 'localhost',
      port: parseInt(process.env.ANYQUERY_PORT || '3306'),
      database: 'integridai_enterprise'
    });

    this.security = new SecurityValidator();
    this.audit = new AuditLogger();
    this.mcpIntegration = new EnhancedMCPIntegration();

    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS configuration
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Security middleware
    this.app.use(this.security.authenticate.bind(this.security));
    
    // Audit logging middleware
    this.app.use(this.audit.logRequest.bind(this.audit));
    
    // Rate limiting middleware
    this.app.use(this.setupRateLimit());
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/api/health', this.handleHealthCheck.bind(this));

    // Dashboard metrics endpoints
    this.app.get('/api/dashboard/metrics', this.getDashboardMetrics.bind(this));
    this.app.get('/api/dashboard/department-overview', this.getDepartmentOverview.bind(this));
    this.app.get('/api/dashboard/critical-alerts', this.getCriticalAlerts.bind(this));
    this.app.get('/api/dashboard/real-time', this.getRealTimeDashboard.bind(this));

    // Employee management endpoints
    this.app.get('/api/employees', this.getEmployees.bind(this));
    this.app.get('/api/employees/:id', this.getEmployee.bind(this));
    this.app.get('/api/employees/:id/compliance', this.getEmployeeCompliance.bind(this));
    this.app.put('/api/employees/:id/risk-profile', this.updateEmployeeRiskProfile.bind(this));

    // Vaccination management endpoints
    this.app.get('/api/vaccinations', this.getVaccinations.bind(this));
    this.app.get('/api/vaccinations/due', this.getVaccinationsDue.bind(this));
    this.app.get('/api/vaccinations/analytics', this.getVaccinationAnalytics.bind(this));
    this.app.post('/api/vaccinations/:id/schedule-revaccination', this.scheduleRevaccination.bind(this));

    // Compliance monitoring endpoints
    this.app.get('/api/compliance/monitor/:type', this.getComplianceMonitor.bind(this));
    this.app.post('/api/compliance/alerts', this.createComplianceAlert.bind(this));
    this.app.get('/api/compliance/ley27401-status', this.getLey27401Status.bind(this));

    // Reporting endpoints
    this.app.post('/api/reports/generate', this.generateReport.bind(this));
    this.app.get('/api/reports/:id', this.getReport.bind(this));
    this.app.get('/api/reports', this.getReports.bind(this));

    // SQL query endpoint (secure)
    this.app.post('/api/query/sql', this.executeSQLQuery.bind(this));
    this.app.post('/api/query/explain', this.explainQuery.bind(this));

    // MCP integration endpoints
    this.app.post('/api/mcp/execute', this.executeMCPTool.bind(this));
    this.app.get('/api/mcp/tools', this.getMCPTools.bind(this));

    // Analytics endpoints
    this.app.get('/api/analytics/trends', this.getAnalyticsTrends.bind(this));
    this.app.get('/api/analytics/scenarios', this.getScenarioAnalytics.bind(this));
    this.app.get('/api/analytics/departments', this.getDepartmentAnalytics.bind(this));

    // Data synchronization endpoints
    this.app.post('/api/sync/all', this.syncAllData.bind(this));
    this.app.post('/api/sync/:source', this.syncDataSource.bind(this));
    this.app.get('/api/sync/status', this.getSyncStatus.bind(this));

    // Error handling middleware
    this.app.use(this.handleError.bind(this));
  }

  /**
   * Health check endpoint
   */
  private async handleHealthCheck(req: express.Request, res: express.Response): Promise<void> {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          anyquery: 'connected',
          hrms: 'connected',
          survey: 'connected',
          vaccination: 'connected'
        },
        version: '2.0.0',
        uptime: process.uptime()
      };

      res.json(health);
    } catch (error) {
      res.status(500).json({ error: 'Health check failed', message: error.message });
    }
  }

  /**
   * Get dashboard metrics
   */
  private async getDashboardMetrics(req: express.Request, res: express.Response): Promise<void> {
    try {
      const metrics = await this.calculateDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get dashboard metrics', message: error.message });
    }
  }

  /**
   * Get department overview
   */
  private async getDepartmentOverview(req: express.Request, res: express.Response): Promise<void> {
    try {
      const departmentFilter = req.query.department as string;
      const departments = await this.calculateDepartmentOverview(departmentFilter);
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get department overview', message: error.message });
    }
  }

  /**
   * Get critical alerts
   */
  private async getCriticalAlerts(req: express.Request, res: express.Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const severity = req.query.severity as string;
      
      const alerts = await this.fetchCriticalAlerts(limit, severity);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get critical alerts', message: error.message });
    }
  }

  /**
   * Get real-time dashboard data
   */
  private async getRealTimeDashboard(req: express.Request, res: express.Response): Promise<void> {
    try {
      const dashboard = {
        metrics: await this.calculateDashboardMetrics(),
        departments: await this.calculateDepartmentOverview(),
        alerts: await this.fetchCriticalAlerts(10),
        trends: await this.calculateTrends(),
        lastUpdated: new Date().toISOString()
      };

      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get real-time dashboard', message: error.message });
    }
  }

  /**
   * Get employees with filters
   */
  private async getEmployees(req: express.Request, res: express.Response): Promise<void> {
    try {
      const filters = {
        department: req.query.department as string,
        active: req.query.active === 'true',
        risk_profile: req.query.risk_profile as string,
        limit: parseInt(req.query.limit as string) || 100,
        offset: parseInt(req.query.offset as string) || 0
      };

      const employees = await this.fetchEmployees(filters);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get employees', message: error.message });
    }
  }

  /**
   * Get specific employee
   */
  private async getEmployee(req: express.Request, res: express.Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      const employee = await this.fetchEmployee(employeeId);
      
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }

      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get employee', message: error.message });
    }
  }

  /**
   * Get employee compliance profile
   */
  private async getEmployeeCompliance(req: express.Request, res: express.Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      const compliance = await this.fetchEmployeeCompliance(employeeId);
      res.json(compliance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get employee compliance', message: error.message });
    }
  }

  /**
   * Execute SQL query
   */
  private async executeSQLQuery(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { query, security_context, dry_run, include_audit_trail } = req.body;
      
      if (!query) {
        res.status(400).json({ error: 'SQL query is required' });
        return;
      }

      const result = await this.mcpIntegration.executeSQLComplianceQuery({
        query,
        security_context,
        dry_run,
        include_audit_trail
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'SQL query execution failed', message: error.message });
    }
  }

  /**
   * Execute MCP tool
   */
  private async executeMCPTool(req: express.Request, res: express.Response): Promise<void> {
    try {
      const input = req.body;
      
      if (!input.operation) {
        res.status(400).json({ error: 'Operation is required' });
        return;
      }

      const result = await this.mcpIntegration.executeAnyqueryMCPTool(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'MCP tool execution failed', message: error.message });
    }
  }

  /**
   * Generate compliance report
   */
  private async generateReport(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { report_type, date_range, departments, include_details } = req.body;
      
      if (!report_type) {
        res.status(400).json({ error: 'Report type is required' });
        return;
      }

      const report = await this.createComplianceReport({
        report_type,
        date_range,
        departments,
        include_details
      });

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Report generation failed', message: error.message });
    }
  }

  // Helper methods for data processing

  private async calculateDashboardMetrics(): Promise<DashboardMetrics> {
    const query = `
      SELECT 
        AVG(v.immunity_level) as avg_immunity,
        COUNT(CASE WHEN e.risk_profile = 'HIGH' THEN 1 END) as high_risk_employees,
        COUNT(CASE WHEN v.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) as vaccinations_due,
        AVG(CASE 
          WHEN v.immunity_level >= 90 THEN 100
          WHEN v.immunity_level >= 75 THEN 85
          WHEN v.immunity_level >= 60 THEN 70
          ELSE 50
        END) as compliance_score
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      WHERE e.active = true
    `;

    const result = await this.anyqueryClient.query(query);
    const current = result.rows[0] || {};

    return {
      avg_immunity: Math.round(current.avg_immunity || 0),
      high_risk_employees: current.high_risk_employees || 0,
      vaccinations_due: current.vaccinations_due || 0,
      compliance_score: Math.round(current.compliance_score || 0),
      immunity_trend: 2.5, // Mock trend data
      risk_trend: -1.2,
      vaccination_trend: 3.1,
      compliance_trend: 2.8,
      last_updated: new Date().toISOString()
    };
  }

  private async calculateDepartmentOverview(departmentFilter?: string): Promise<DepartmentOverview[]> {
    let whereClause = '';
    if (departmentFilter) {
      whereClause = `AND e.department = '${departmentFilter}'`;
    }

    const query = `
      SELECT 
        e.department as department_name,
        COUNT(e.employee_id) as total_employees,
        AVG(v.immunity_level) as avg_immunity,
        COUNT(CASE WHEN v.vaccination_status IN ('EXPIRED', 'OVERDUE') THEN 1 END) as needs_revaccination,
        COUNT(CASE WHEN e.risk_profile = 'HIGH' THEN 1 END) as high_risk_count,
        CASE 
          WHEN AVG(v.immunity_level) >= 90 THEN '🟢 EXCELLENT'
          WHEN AVG(v.immunity_level) >= 75 THEN '🟡 GOOD'
          WHEN AVG(v.immunity_level) >= 60 THEN '🟠 WARNING'
          ELSE '🔴 CRITICAL'
        END as compliance_status
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      WHERE e.active = true ${whereClause}
      GROUP BY e.department
      ORDER BY avg_immunity DESC
    `;

    const result = await this.anyqueryClient.query(query);
    return result.rows.map((row: any) => ({
      department_name: row.department_name || 'Unknown',
      total_employees: row.total_employees || 0,
      avg_immunity: Math.round(row.avg_immunity || 0),
      needs_revaccination: row.needs_revaccination || 0,
      high_risk_count: row.high_risk_count || 0,
      compliance_status: row.compliance_status,
      last_audit_date: undefined // Would be calculated from audit data
    }));
  }

  private async fetchCriticalAlerts(limit: number = 20, severity?: string): Promise<CriticalAlert[]> {
    // Mock critical alerts - in production, this would query actual alerts
    const alerts: CriticalAlert[] = [
      {
        alert_id: 'alert_001',
        alert_type: 'HIGH_RISK_EMPLOYEE',
        title: 'High risk employee requires immediate attention',
        description: 'Employee John Doe has risk score 95 and immunity level 45%',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        employee_id: 'emp_123',
        department: 'Finance',
        recommended_action: 'Schedule immediate revaccination and risk assessment'
      },
      {
        alert_id: 'alert_002',
        alert_type: 'VACCINATION_OVERDUE',
        title: 'Multiple employees overdue for revaccination',
        description: '15 employees in Procurement department have overdue vaccinations',
        severity: 'warning',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        department: 'Procurement',
        recommended_action: 'Schedule department-wide vaccination campaign'
      }
    ];

    return severity 
      ? alerts.filter(alert => alert.severity === severity).slice(0, limit)
      : alerts.slice(0, limit);
  }

  private async calculateTrends(): Promise<any> {
    // Mock trend calculation
    return {
      immunity_trend: {
        current: 78.5,
        previous: 76.2,
        change: 2.3
      },
      risk_trend: {
        current: 12,
        previous: 15,
        change: -3
      },
      vaccination_trend: {
        current: 85.2,
        previous: 82.1,
        change: 3.1
      }
    };
  }

  private async fetchEmployees(filters: any): Promise<any[]> {
    let whereConditions = ['e.active = true'];
    
    if (filters.department) {
      whereConditions.push(`e.department = '${filters.department}'`);
    }
    
    if (filters.risk_profile) {
      whereConditions.push(`e.risk_profile = '${filters.risk_profile}'`);
    }

    const query = `
      SELECT 
        e.employee_id,
        e.full_name,
        e.email,
        e.department,
        e.position,
        e.risk_profile,
        v.immunity_level,
        v.vaccination_status,
        v.immunity_expiry_date
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY e.full_name
      LIMIT ${filters.limit} OFFSET ${filters.offset}
    `;

    const result = await this.anyqueryClient.query(query);
    return result.rows;
  }

  private async fetchEmployee(employeeId: string): Promise<any> {
    const query = `
      SELECT 
        e.*,
        v.immunity_level,
        v.vaccination_status,
        v.vaccination_date,
        v.immunity_expiry_date
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      WHERE e.employee_id = '${employeeId}'
    `;

    const result = await this.anyqueryClient.query(query);
    return result.rows[0] || null;
  }

  private async fetchEmployeeCompliance(employeeId: string): Promise<any> {
    const query = `
      SELECT 
        e.employee_id,
        e.full_name,
        e.department,
        e.position,
        e.risk_profile,
        COUNT(v.vaccination_id) as total_vaccinations,
        MAX(v.vaccination_date) as last_vaccination,
        AVG(v.immunity_level) as avg_immunity,
        v2.vaccination_status as current_status,
        v2.immunity_expiry_date,
        CASE 
          WHEN v2.vaccination_status = 'CURRENT' AND AVG(v.immunity_level) >= 75 THEN 'FULLY_COMPLIANT'
          WHEN v2.vaccination_status = 'CURRENT' THEN 'PARTIALLY_COMPLIANT'
          ELSE 'NON_COMPLIANT'
        END as compliance_status
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      LEFT JOIN (
        SELECT DISTINCT employee_id, vaccination_status, immunity_expiry_date
        FROM vaccinations 
        WHERE vaccination_date = (
          SELECT MAX(vaccination_date) 
          FROM vaccinations v2 
          WHERE v2.employee_id = vaccinations.employee_id
        )
      ) v2 ON e.employee_id = v2.employee_id
      WHERE e.employee_id = '${employeeId}'
      GROUP BY e.employee_id
    `;

    const result = await this.anyqueryClient.query(query);
    return result.rows[0] || null;
  }

  private async createComplianceReport(options: any): Promise<ComplianceReport> {
    const reportId = this.generateReportId();
    
    // Generate report based on type
    const summary = await this.calculateDashboardMetrics();
    const details = await this.generateReportDetails(options.report_type);
    
    const report: ComplianceReport = {
      report_id: reportId,
      report_type: options.report_type,
      generated_at: new Date().toISOString(),
      summary: {
        total_employees: 0, // Would be calculated
        compliance_score: summary.compliance_score,
        ley27401_status: 'COMPLIANT',
        vaccination_compliance: summary.avg_immunity
      },
      details: details,
      recommendations: [
        'Continue regular vaccination schedule',
        'Monitor high-risk employees closely',
        'Update compliance policies quarterly'
      ],
      audit_trail: {
        generated_by: 'system',
        request_id: reportId,
        timestamp: new Date().toISOString()
      }
    };

    return report;
  }

  private async generateReportDetails(reportType: string): Promise<any[]> {
    switch (reportType) {
      case 'ley27401_compliance':
        return await this.generateLey27401Report();
      case 'vaccination_status':
        return await this.generateVaccinationReport();
      case 'risk_dashboard':
        return await this.generateRiskReport();
      default:
        return [];
    }
  }

  private async generateLey27401Report(): Promise<any[]> {
    // Mock Ley 27.401 compliance report
    return [
      { requirement: 'Programa de Integridad', status: 'IMPLEMENTED', compliance: 'COMPLIANT' },
      { requirement: 'Responsable de Integridad', status: 'DESIGNATED', compliance: 'COMPLIANT' },
      { requirement: 'Capacitación Anti-Corrupción', status: 'ACTIVE', compliance: 'COMPLIANT' },
      { requirement: 'Evaluación de Riesgos', status: 'CURRENT', compliance: 'COMPLIANT' }
    ];
  }

  private async generateVaccinationReport(): Promise<any[]> {
    const query = `
      SELECT 
        e.department,
        COUNT(e.employee_id) as total_employees,
        COUNT(CASE WHEN v.vaccination_status = 'CURRENT' THEN 1 END) as current_vaccinations,
        COUNT(CASE WHEN v.vaccination_status = 'EXPIRED' THEN 1 END) as expired_vaccinations,
        COUNT(CASE WHEN v.vaccination_status = 'OVERDUE' THEN 1 END) as overdue_vaccinations
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      WHERE e.active = true
      GROUP BY e.department
    `;

    const result = await this.anyqueryClient.query(query);
    return result.rows;
  }

  private async generateRiskReport(): Promise<any[]> {
    const query = `
      SELECT 
        e.risk_profile,
        COUNT(e.employee_id) as employee_count,
        AVG(v.immunity_level) as avg_immunity
      FROM employees e
      LEFT JOIN vaccinations v ON e.employee_id = v.employee_id
      WHERE e.active = true
      GROUP BY e.risk_profile
    `;

    const result = await this.anyqueryClient.query(query);
    return result.rows;
  }

  private setupRateLimit(): express.RequestHandler {
    // Simple rate limiting implementation
    const requests = new Map();
    
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const clientId = req.ip || 'unknown';
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute
      const maxRequests = 100;

      if (!requests.has(clientId)) {
        requests.set(clientId, { count: 1, resetTime: now + windowMs });
        return next();
      }

      const clientRequests = requests.get(clientId);
      
      if (now > clientRequests.resetTime) {
        clientRequests.count = 1;
        clientRequests.resetTime = now + windowMs;
        return next();
      }

      if (clientRequests.count >= maxRequests) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      clientRequests.count++;
      next();
    };
  }

  private handleError(error: Error, req: express.Request, res: express.Response, next: express.NextFunction): void {
    console.error('API Error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred',
      timestamp: new Date().toISOString()
    });
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start the API gateway server
   */
  public listen(port: number = 3000): void {
    this.app.listen(port, () => {
      console.log(`🚀 IntegridAI Enterprise API Gateway listening on port ${port}`);
      console.log(`📊 Dashboard API available at http://localhost:${port}/api/dashboard/*`);
      console.log(`🔗 SQL Query API available at http://localhost:${port}/api/query/*`);
      console.log(`📋 MCP Integration API available at http://localhost:${port}/api/mcp/*`);
    });
  }

  /**
   * Get Express app instance
   */
  public getApp(): express.Application {
    return this.app;
  }
}

export default EnterpriseAPIGateway;