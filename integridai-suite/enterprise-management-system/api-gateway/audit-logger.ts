/**
 * 📋 Audit Logger for IntegridAI Enterprise Management System
 * 
 * Comprehensive audit trail and compliance logging
 * Provides forensic-grade evidence for regulatory compliance
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

import express from 'express';
import crypto from 'crypto';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  clientIp?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
  duration?: number;
  forensicHash: string;
  complianceRelevant: boolean;
}

export interface ComplianceQueryLog {
  query_id: string;
  query: string;
  secure_query: string;
  row_count: number;
  execution_time: number;
  user_context?: string;
  data_sources_used: string[];
  timestamp: string;
  forensic_signature: string;
}

export interface AuditQuery {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction;
  resource?: string;
  success?: boolean;
  complianceRelevant?: boolean;
  limit?: number;
  offset?: number;
}

export type AuditAction = 
  | 'SELECT'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'API_CALL'
  | 'QUERY_EXECUTE'
  | 'REPORT_GENERATE'
  | 'VACCINATION_CREATE'
  | 'RISK_ASSESSMENT'
  | 'COMPLIANCE_CHECK'
  | 'DATA_EXPORT'
  | 'CONFIGURATION_CHANGE'
  | 'SECURITY_VIOLATION';

/**
 * Audit Logger Class
 */
export class AuditLogger {
  private auditLog: AuditLogEntry[] = [];
  private complianceQueryLog: ComplianceQueryLog[] = [];
  private readonly maxLogSize = 10000;
  private readonly secretKey = process.env.AUDIT_SECRET_KEY || 'default-audit-key';

  constructor() {
    this.initializeAuditSystem();
  }

  /**
   * Log HTTP request
   */
  async logRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Capture request details
    const requestDetails = {
      method: req.method,
      path: req.path,
      query: req.query,
      body: this.sanitizeRequestBody(req.body),
      headers: this.sanitizeHeaders(req.headers)
    };

    // Log request start
    const logEntry: Partial<AuditLogEntry> = {
      id: requestId,
      timestamp: new Date().toISOString(),
      userId: (req as any).userContext?.userId,
      sessionId: (req as any).userContext?.sessionId,
      action: this.mapMethodToAction(req.method),
      resource: req.path,
      details: requestDetails,
      clientIp: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      complianceRelevant: this.isComplianceRelevant(req.path, req.method)
    };

    // Override response end to capture response details
    const originalEnd = res.end;
    res.end = (...args: any[]) => {
      const duration = Date.now() - startTime;
      
      // Complete audit log entry
      const completedEntry: AuditLogEntry = {
        ...logEntry,
        success: res.statusCode < 400,
        error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
        duration: duration,
        forensicHash: this.generateForensicHash({
          ...logEntry,
          success: res.statusCode < 400,
          duration: duration
        })
      } as AuditLogEntry;

      this.addAuditEntry(completedEntry);

      // Call original response end
      return originalEnd.apply(res, args);
    };

    next();
  }

  /**
   * Log compliance query execution
   */
  async logComplianceQuery(queryDetails: {
    query_id: string;
    query: string;
    secure_query: string;
    row_count: number;
    execution_time: number;
    user_context?: string;
    data_sources_used: string[];
  }): Promise<ComplianceQueryLog> {
    const logEntry: ComplianceQueryLog = {
      ...queryDetails,
      timestamp: new Date().toISOString(),
      forensic_signature: this.generateQuerySignature(queryDetails)
    };

    this.complianceQueryLog.push(logEntry);
    this.trimComplianceLog();

    // Also create general audit entry
    await this.logEvent({
      action: 'QUERY_EXECUTE',
      resource: 'sql_query',
      resourceId: queryDetails.query_id,
      details: {
        query_preview: queryDetails.query.substring(0, 100) + '...',
        row_count: queryDetails.row_count,
        execution_time: queryDetails.execution_time,
        data_sources: queryDetails.data_sources_used
      },
      userId: queryDetails.user_context,
      success: true,
      complianceRelevant: true
    });

    return logEntry;
  }

  /**
   * Log specific event
   */
  async logEvent(event: {
    action: AuditAction;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    userId?: string;
    sessionId?: string;
    success: boolean;
    error?: string;
    complianceRelevant?: boolean;
  }): Promise<AuditLogEntry> {
    const logEntry: AuditLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      userId: event.userId,
      sessionId: event.sessionId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      details: event.details || {},
      success: event.success,
      error: event.error,
      forensicHash: '',
      complianceRelevant: event.complianceRelevant ?? false
    };

    // Generate forensic hash
    logEntry.forensicHash = this.generateForensicHash(logEntry);

    this.addAuditEntry(logEntry);
    return logEntry;
  }

  /**
   * Log security violation
   */
  async logSecurityViolation(violation: {
    type: 'SQL_INJECTION' | 'UNAUTHORIZED_ACCESS' | 'DATA_EXFILTRATION' | 'DANGEROUS_OPERATION';
    description: string;
    userId?: string;
    query?: string;
    clientIp?: string;
    userAgent?: string;
    additionalDetails?: Record<string, any>;
  }): Promise<AuditLogEntry> {
    const logEntry = await this.logEvent({
      action: 'SECURITY_VIOLATION',
      resource: 'security',
      details: {
        violation_type: violation.type,
        description: violation.description,
        query_preview: violation.query?.substring(0, 200),
        client_ip: violation.clientIp,
        user_agent: violation.userAgent,
        ...violation.additionalDetails
      },
      userId: violation.userId,
      success: false,
      error: `Security violation: ${violation.type}`,
      complianceRelevant: true
    });

    // Immediate alert for critical security violations
    if (violation.type === 'SQL_INJECTION' || violation.type === 'DATA_EXFILTRATION') {
      await this.triggerSecurityAlert(logEntry);
    }

    return logEntry;
  }

  /**
   * Log vaccination event
   */
  async logVaccinationEvent(vaccinationDetails: {
    vaccinationId: string;
    employeeId: string;
    scenarioId: string;
    immunityLevel: number;
    complianceOfficerId?: string;
    success: boolean;
    error?: string;
  }): Promise<AuditLogEntry> {
    return await this.logEvent({
      action: 'VACCINATION_CREATE',
      resource: 'vaccination',
      resourceId: vaccinationDetails.vaccinationId,
      details: {
        employee_id: vaccinationDetails.employeeId,
        scenario_id: vaccinationDetails.scenarioId,
        immunity_level: vaccinationDetails.immunityLevel,
        compliance_officer_id: vaccinationDetails.complianceOfficerId
      },
      userId: vaccinationDetails.complianceOfficerId,
      success: vaccinationDetails.success,
      error: vaccinationDetails.error,
      complianceRelevant: true
    });
  }

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(query: AuditQuery): Promise<AuditLogEntry[]> {
    let filteredLogs = [...this.auditLog];

    // Apply filters
    if (query.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(query.startDate!)
      );
    }

    if (query.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(query.endDate!)
      );
    }

    if (query.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === query.userId);
    }

    if (query.action) {
      filteredLogs = filteredLogs.filter(log => log.action === query.action);
    }

    if (query.resource) {
      filteredLogs = filteredLogs.filter(log => 
        log.resource.includes(query.resource!)
      );
    }

    if (query.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === query.success);
    }

    if (query.complianceRelevant !== undefined) {
      filteredLogs = filteredLogs.filter(log => 
        log.complianceRelevant === query.complianceRelevant
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    return filteredLogs.slice(offset, offset + limit);
  }

  /**
   * Get compliance query logs
   */
  async getComplianceQueryLogs(filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    limit?: number;
  }): Promise<ComplianceQueryLog[]> {
    let filteredLogs = [...this.complianceQueryLog];

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate!)
      );
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate!)
      );
    }

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => 
        log.user_context === filters.userId
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const limit = filters?.limit || 100;
    return filteredLogs.slice(0, limit);
  }

  /**
   * Generate audit report
   */
  async generateAuditReport(options: {
    startDate: string;
    endDate: string;
    includeCompliance?: boolean;
    includeSecurity?: boolean;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<any> {
    const logs = await this.getAuditLogs({
      startDate: options.startDate,
      endDate: options.endDate
    });

    const report = {
      reportId: this.generateReportId(),
      generatedAt: new Date().toISOString(),
      period: {
        start: options.startDate,
        end: options.endDate
      },
      summary: {
        totalEvents: logs.length,
        successfulEvents: logs.filter(l => l.success).length,
        failedEvents: logs.filter(l => !l.success).length,
        complianceRelevantEvents: logs.filter(l => l.complianceRelevant).length,
        securityViolations: logs.filter(l => l.action === 'SECURITY_VIOLATION').length,
        uniqueUsers: [...new Set(logs.map(l => l.userId).filter(Boolean))].length
      },
      eventsByAction: this.groupEventsByAction(logs),
      eventsByResource: this.groupEventsByResource(logs),
      timeline: this.generateTimeline(logs),
      logs: logs
    };

    if (options.includeCompliance) {
      const complianceLogs = await this.getComplianceQueryLogs({
        startDate: options.startDate,
        endDate: options.endDate
      });
      (report as any).complianceQueries = complianceLogs;
    }

    return report;
  }

  /**
   * Verify audit trail integrity
   */
  async verifyIntegrity(logId?: string): Promise<{
    valid: boolean;
    details: any;
  }> {
    try {
      if (logId) {
        // Verify specific log entry
        const entry = this.auditLog.find(log => log.id === logId);
        if (!entry) {
          return { valid: false, details: { error: 'Log entry not found' } };
        }

        const expectedHash = this.generateForensicHash(entry);
        const valid = entry.forensicHash === expectedHash;

        return {
          valid,
          details: {
            logId: entry.id,
            expectedHash,
            actualHash: entry.forensicHash,
            timestamp: entry.timestamp
          }
        };
      } else {
        // Verify entire audit trail
        let validEntries = 0;
        let invalidEntries = 0;
        const issues: any[] = [];

        for (const entry of this.auditLog) {
          const expectedHash = this.generateForensicHash(entry);
          if (entry.forensicHash === expectedHash) {
            validEntries++;
          } else {
            invalidEntries++;
            issues.push({
              logId: entry.id,
              timestamp: entry.timestamp,
              expectedHash,
              actualHash: entry.forensicHash
            });
          }
        }

        return {
          valid: invalidEntries === 0,
          details: {
            totalEntries: this.auditLog.length,
            validEntries,
            invalidEntries,
            issues: issues.slice(0, 10) // Limit issues in response
          }
        };
      }
    } catch (error) {
      return {
        valid: false,
        details: { error: `Integrity verification failed: ${error.message}` }
      };
    }
  }

  // Private helper methods

  private initializeAuditSystem(): void {
    // Set up periodic log rotation
    setInterval(() => {
      this.rotateAuditLogs();
    }, 24 * 60 * 60 * 1000); // Daily rotation

    // Set up integrity checks
    setInterval(() => {
      this.performIntegrityCheck();
    }, 60 * 60 * 1000); // Hourly integrity check
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return {};

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private mapMethodToAction(method: string): AuditAction {
    switch (method.toUpperCase()) {
      case 'GET': return 'SELECT';
      case 'POST': return 'INSERT';
      case 'PUT':
      case 'PATCH': return 'UPDATE';
      case 'DELETE': return 'DELETE';
      default: return 'API_CALL';
    }
  }

  private isComplianceRelevant(path: string, method: string): boolean {
    const compliancePaths = [
      '/api/compliance/',
      '/api/vaccinations/',
      '/api/employees/',
      '/api/query/',
      '/api/reports/',
      '/api/mcp/'
    ];

    return compliancePaths.some(cp => path.includes(cp));
  }

  private generateForensicHash(entry: Partial<AuditLogEntry>): string {
    const hashData = {
      id: entry.id,
      timestamp: entry.timestamp,
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      success: entry.success
    };

    return crypto
      .createHmac('sha256', this.secretKey)
      .update(JSON.stringify(hashData))
      .digest('hex');
  }

  private generateQuerySignature(queryDetails: any): string {
    const signatureData = {
      query_id: queryDetails.query_id,
      query_hash: crypto.createHash('sha256').update(queryDetails.query).digest('hex'),
      timestamp: queryDetails.timestamp,
      user_context: queryDetails.user_context
    };

    return crypto
      .createHmac('sha256', this.secretKey)
      .update(JSON.stringify(signatureData))
      .digest('hex');
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addAuditEntry(entry: AuditLogEntry): void {
    this.auditLog.push(entry);
    this.trimAuditLog();
  }

  private trimAuditLog(): void {
    if (this.auditLog.length > this.maxLogSize) {
      this.auditLog = this.auditLog.slice(-this.maxLogSize);
    }
  }

  private trimComplianceLog(): void {
    if (this.complianceQueryLog.length > this.maxLogSize) {
      this.complianceQueryLog = this.complianceQueryLog.slice(-this.maxLogSize);
    }
  }

  private async triggerSecurityAlert(logEntry: AuditLogEntry): Promise<void> {
    // In production, this would send alerts to security team
    console.warn('🚨 SECURITY ALERT:', {
      type: logEntry.action,
      user: logEntry.userId,
      timestamp: logEntry.timestamp,
      details: logEntry.details
    });
  }

  private rotateAuditLogs(): void {
    // In production, archive old logs to persistent storage
    const cutoffDate = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)); // 30 days
    
    const recentLogs = this.auditLog.filter(log => 
      new Date(log.timestamp) > cutoffDate
    );

    console.log(`Rotated ${this.auditLog.length - recentLogs.length} audit logs`);
    this.auditLog = recentLogs;
  }

  private async performIntegrityCheck(): Promise<void> {
    const result = await this.verifyIntegrity();
    
    if (!result.valid) {
      console.error('🚨 AUDIT INTEGRITY VIOLATION:', result.details);
      // In production, trigger security alert
    }
  }

  private groupEventsByAction(logs: AuditLogEntry[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupEventsByResource(logs: AuditLogEntry[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.resource] = (acc[log.resource] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private generateTimeline(logs: AuditLogEntry[]): any[] {
    // Group logs by hour for timeline visualization
    const timeline = logs.reduce((acc, log) => {
      const hour = new Date(log.timestamp).toISOString().substr(0, 13);
      if (!acc[hour]) {
        acc[hour] = { timestamp: hour, events: 0, success: 0, failures: 0 };
      }
      acc[hour].events++;
      if (log.success) {
        acc[hour].success++;
      } else {
        acc[hour].failures++;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(timeline).sort((a: any, b: any) => 
      a.timestamp.localeCompare(b.timestamp)
    );
  }
}

export default AuditLogger;