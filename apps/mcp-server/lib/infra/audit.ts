import crypto from 'crypto';
import { logAuditEvent } from './db';

export interface AuditEventData {
  runId?: string;
  sessionId?: string;
  eventType: AuditEventType;
  eventData: any;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  legalRefs?: string[];
}

export enum AuditEventType {
  RUN_STARTED = 'run_started',
  RUN_COMPLETED = 'run_completed', 
  RUN_FAILED = 'run_failed',
  ARTIFACT_CREATED = 'artifact_created',
  ARTIFACT_ACCESSED = 'artifact_accessed',
  SESSION_CREATED = 'session_created',
  SESSION_EXPIRED = 'session_expired',
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  ERROR_OCCURRED = 'error_occurred',
  COMPLIANCE_VIOLATION = 'compliance_violation',
}

export class AuditLogger {
  /**
   * Log audit event with automatic legal references
   */
  static async logEvent(data: AuditEventData): Promise<void> {
    try {
      // Sanitize event data
      const sanitizedEventData = this.sanitizeEventData(data.eventData);
      
      // Add automatic legal references based on event type
      const legalRefs = this.getLegalReferences(data.eventType, data.eventData);
      
      await logAuditEvent({
        runId: data.runId,
        sessionId: data.sessionId,
        eventType: data.eventType,
        eventData: sanitizedEventData,
        userId: data.userId,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        legalRefs: [...(data.legalRefs || []), ...legalRefs],
      });
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Don't throw - audit failure shouldn't break main flow
    }
  }

  /**
   * Log run start event
   */
  static async logRunStart(data: {
    runId: string;
    sessionId: string;
    toolName: string;
    inputHash: string;
    userId?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    await this.logEvent({
      runId: data.runId,
      sessionId: data.sessionId,
      eventType: AuditEventType.RUN_STARTED,
      eventData: {
        toolName: data.toolName,
        inputHash: data.inputHash,
        timestamp: new Date().toISOString(),
      },
      userId: data.userId,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
    });
  }

  /**
   * Log run completion with execution metrics
   */
  static async logRunCompletion(data: {
    runId: string;
    toolName: string;
    duration: number;
    artifactHashes: string[];
    summary: string;
    userId?: string;
  }): Promise<void> {
    await this.logEvent({
      runId: data.runId,
      eventType: AuditEventType.RUN_COMPLETED,
      eventData: {
        toolName: data.toolName,
        duration: data.duration,
        artifactHashes: data.artifactHashes,
        summary: data.summary,
        executionTime: new Date().toISOString(),
      },
      userId: data.userId,
    });
  }

  /**
   * Log artifact creation with integrity hash
   */
  static async logArtifactCreation(data: {
    runId: string;
    artifactType: string;
    fileName: string;
    fileHash: string;
    fileSize: number;
    userId?: string;
  }): Promise<void> {
    await this.logEvent({
      runId: data.runId,
      eventType: AuditEventType.ARTIFACT_CREATED,
      eventData: {
        artifactType: data.artifactType,
        fileName: data.fileName,
        fileHash: data.fileHash,
        fileSize: data.fileSize,
        createdAt: new Date().toISOString(),
      },
      userId: data.userId,
    });
  }

  /**
   * Log error with context
   */
  static async logError(data: {
    runId?: string;
    sessionId?: string;
    error: Error;
    context: any;
    userId?: string;
  }): Promise<void> {
    await this.logEvent({
      runId: data.runId,
      sessionId: data.sessionId,
      eventType: AuditEventType.ERROR_OCCURRED,
      eventData: {
        errorMessage: data.error.message,
        errorStack: data.error.stack?.substring(0, 1000), // Limit stack trace
        context: this.sanitizeEventData(data.context),
        timestamp: new Date().toISOString(),
      },
      userId: data.userId,
    });
  }

  /**
   * Generate artifact integrity hash
   */
  static generateArtifactHash(content: string | Buffer): string {
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }

  /**
   * Get legal references based on event type and context
   */
  private static getLegalReferences(eventType: AuditEventType, eventData: any): string[] {
    const refs: string[] = [];

    // Base references for all events
    refs.push('Ley 27.401 - Régimen de Responsabilidad Penal Empresaria');

    if (eventType === AuditEventType.RUN_STARTED || eventType === AuditEventType.RUN_COMPLETED) {
      refs.push('Ley 27.401 Art. 22 - Programa de Integridad');
      refs.push('Ley 27.401 Art. 23 - Elementos del Programa de Integridad');
    }

    if (eventData?.toolName === 'simulate_ethics_case') {
      refs.push('Ley 27.401 Art. 7 - Delitos precedentes');
      refs.push('Ley 27.401 Art. 23 inc. c) - Capacitación periódica');
    }

    if (eventData?.toolName === 'run_integrity_survey') {
      refs.push('Ley 27.401 Art. 23 inc. a) - Evaluación de riesgos');
      refs.push('Ley 27.401 Art. 23 inc. f) - Monitoreo continuo');
    }

    return refs;
  }

  /**
   * Sanitize event data to remove sensitive information
   */
  private static sanitizeEventData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'token', 'apiKey', 'secret', 'credential',
      'authorization', 'auth', 'key', 'privateKey', 'ssn',
      'creditCard', 'bankAccount'
    ];
    
    const removeSensitiveData = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(removeSensitiveData);
      }

      const cleaned: any = {};
      Object.keys(obj).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          cleaned[key] = '[REDACTED]';
        } else {
          cleaned[key] = removeSensitiveData(obj[key]);
        }
      });

      return cleaned;
    };

    return removeSensitiveData(sanitized);
  }
}