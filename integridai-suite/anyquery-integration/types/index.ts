/**
 * 🔗 Type Definitions for IntegridAI Suite AnyQuery Integration
 * 
 * Comprehensive TypeScript types for all AnyQuery integration components
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Patent-Protected Technology
 */

// Re-export all connector types
export * from '../connectors/flaisimulator-connector';
export * from '../connectors/mcp-server-connector';
export * from '../connectors/patents-connector';
export * from '../connectors/documentation-connector';
export * from '../unified-query-interface';

// Common base types
export interface BaseConnectorConfig {
  dataPath: string;
  enableRealTimeUpdates?: boolean;
  cacheEnabled?: boolean;
  enableLogging?: boolean;
}

export interface BaseRecord {
  created_at: string;
  last_updated: string;
  version?: string;
}

export interface QueryFilter {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  [key: string]: any;
}

export interface AnalyticsResult {
  timestamp: string;
  component: string;
  metrics: {[key: string]: number | string};
  recommendations?: string[];
}

// Integration-specific types
export interface IntegridAISuiteConfig {
  components: {
    flaisimulator: {
      enabled: boolean;
      dataPath: string;
      config?: any;
    };
    mcpServer: {
      enabled: boolean;
      dataPath: string;
      config?: any;
    };
    patents: {
      enabled: boolean;
      dataPath: string;
      config?: any;
    };
    documentation: {
      enabled: boolean;
      dataPath: string;
      config?: any;
    };
  };
  security: {
    enableAuthentication: boolean;
    enableAuditLogging: boolean;
    enableAccessControl: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    maxQueryExecutionTime: number;
    maxConcurrentQueries: number;
  };
}

export interface CrossComponentJoin {
  leftTable: string;
  rightTable: string;
  leftComponent: string;
  rightComponent: string;
  joinCondition: string;
  joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
}

export interface UnifiedMetrics {
  overallHealth: number;
  complianceScore: number;
  usageMetrics: {
    dailyActiveUsers: number;
    totalQueries: number;
    averageResponseTime: number;
  };
  componentHealthScores: {
    flaisimulator: number;
    mcpServer: number;
    patents: number;
    documentation: number;
  };
}

export interface ComplianceReport {
  reportId: string;
  reportType: string;
  generatedAt: string;
  complianceFramework: string;
  overallScore: number;
  componentScores: {[component: string]: number};
  criticalIssues: string[];
  recommendations: string[];
  auditTrail: AuditTrailEntry[];
}

export interface AuditTrailEntry {
  timestamp: string;
  userId?: string;
  action: string;
  component: string;
  details: {[key: string]: any};
  ipAddress?: string;
  userAgent?: string;
}

// Error types
export interface QueryError {
  code: string;
  message: string;
  component?: string;
  query?: string;
  timestamp: string;
  userId?: string;
}

export interface ValidationError extends Error {
  field: string;
  value: any;
  constraint: string;
}

// Event types for EventEmitter
export interface ConnectorEvents {
  'query_executed': (data: {sql: string; resultCount: number; executionTime: number}) => void;
  'query_error': (data: {sql: string; error: string}) => void;
  'cache_hit': (data: {sql: string; executionTime: number}) => void;
  'database_initialized': (data: {path: string}) => void;
  'disconnected': () => void;
}

export interface UnifiedQueryEvents {
  'unified_query_executed': (result: any) => void;
  'unified_query_error': (error: any) => void;
  'component_query_executed': (data: {component: string; sql: string}) => void;
  'component_query_error': (data: {component: string; error: string}) => void;
  'unified_analytics_generated': (analytics: any) => void;
  'comprehensive_report_generated': (report: any) => void;
}

// Argentina-specific legal types
export interface Ley27401ComplianceData {
  articlesCovered: string[];
  constitutionalBasis: string[];
  proceduralRequirements: string[];
  complianceLevel: 'FULL' | 'PARTIAL' | 'MINIMAL' | 'NON_COMPLIANT';
  lastAssessment: string;
  nextReviewDue: string;
}

export interface ArgentinaLegalContext {
  federalJurisdiction: boolean;
  provincialJurisdiction: string[];
  constitutionalProtections: string[];
  ley27401Compliance: Ley27401ComplianceData;
  proceduralSafeguards: string[];
}

// Patent-specific types
export interface PatentProtectionLevel {
  level: number; // 1-100
  protectedFeatures: string[];
  licenseRequired: boolean;
  usageRestrictions: string[];
  territorialLimitations: string[];
}

export interface P2P4MethodologyMetrics {
  p2EvaluationAccuracy: number;
  p4ReflectionDepth: 'SURFACE' | 'MODERATE' | 'DEEP' | 'PROFOUND';
  culturalAdaptationScore: number;
  realWorldApplicability: number;
  officerProtectionEnabled: boolean;
}

// Security and access control types
export interface AccessControlRule {
  userId?: string;
  userRole?: string;
  component: string;
  table?: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  condition?: string;
  granted: boolean;
}

export interface SecurityContext {
  userId: string;
  userRole: string;
  organizationId?: string;
  sessionId: string;
  accessLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  permissions: string[];
}

// Data synchronization types
export interface SyncConfiguration {
  component: string;
  enabled: boolean;
  frequency: number; // milliseconds
  batchSize: number;
  conflictResolution: 'LOCAL_WINS' | 'REMOTE_WINS' | 'MANUAL' | 'MERGE';
}

export interface SyncResult {
  component: string;
  recordsProcessed: number;
  recordsUpdated: number;
  recordsInserted: number;
  recordsDeleted: number;
  conflicts: SyncConflict[];
  executionTime: number;
  timestamp: string;
}

export interface SyncConflict {
  recordId: string;
  localVersion: any;
  remoteVersion: any;
  conflictType: 'UPDATE_UPDATE' | 'UPDATE_DELETE' | 'DELETE_UPDATE';
  resolution?: 'LOCAL' | 'REMOTE' | 'MERGED' | 'MANUAL';
}

// Performance monitoring types
export interface PerformanceMetrics {
  component: string;
  averageQueryTime: number;
  slowQueries: SlowQueryInfo[];
  cacheHitRate: number;
  errorRate: number;
  throughput: number; // queries per second
  timestamp: string;
}

export interface SlowQueryInfo {
  query: string;
  executionTime: number;
  timestamp: string;
  userId?: string;
  component: string;
}

// Dashboard and visualization types
export interface DashboardWidget {
  id: string;
  type: 'METRIC' | 'CHART' | 'TABLE' | 'ALERT';
  title: string;
  component?: string;
  query?: string;
  refreshInterval?: number;
  configuration: {[key: string]: any};
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  layout: {
    columns: number;
    rows: number;
    positions: {[widgetId: string]: {x: number; y: number; width: number; height: number}};
  };
  permissions: {
    viewRoles: string[];
    editRoles: string[];
  };
}

// Export convenience type for the main integration class
export interface AnyQueryIntegration {
  unifiedQuery: any;
  connectors: {
    flaisimulator: any;
    mcpServer: any;
    patents: any;
    documentation: any;
  };
  security: any;
  analytics: any;
  reporting: any;
}

// Utility types
export type ComponentName = 'flaisimulator' | 'mcpServer' | 'patents' | 'documentation';
export type QueryOperationType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'DROP' | 'ALTER';
export type ComplianceFramework = 'Ley_27401' | 'GDPR' | 'SOX' | 'HIPAA' | 'PCI_DSS' | 'ISO_27001';
export type PatentType = 'P2_EVALUATION' | 'P4_REFLECTION' | 'GENIE3_AI' | 'VACCINATION_METHODOLOGY' | 'LEGAL_SHIELD';
export type DocumentType = 'TRAINING_GUIDE' | 'LEGAL_COMPLIANCE' | 'TECHNICAL_SPEC' | 'USER_MANUAL' | 'POLICY' | 'PROCEDURE';
export type AccessLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
export type ComplianceLevel = 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
export type ReviewStatus = 'CURRENT' | 'NEEDS_UPDATE' | 'DEPRECATED';

// Default configurations
export const DEFAULT_CONFIG: Partial<IntegridAISuiteConfig> = {
  security: {
    enableAuthentication: true,
    enableAuditLogging: true,
    enableAccessControl: true
  },
  performance: {
    cacheEnabled: true,
    maxQueryExecutionTime: 30000,
    maxConcurrentQueries: 10
  }
};

export const DEFAULT_ARGENTINA_LEGAL_CONTEXT: ArgentinaLegalContext = {
  federalJurisdiction: true,
  provincialJurisdiction: [],
  constitutionalProtections: ['Art. 18', 'Art. 19', 'Art. 33'],
  ley27401Compliance: {
    articlesCovered: [],
    constitutionalBasis: [],
    proceduralRequirements: [],
    complianceLevel: 'MINIMAL',
    lastAssessment: new Date().toISOString(),
    nextReviewDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  proceduralSafeguards: ['Due Process', 'Legal Representation', 'Appeal Rights']
};

// Validation schemas (for runtime validation)
export const VALIDATION_SCHEMAS = {
  queryFilter: {
    limit: { type: 'number', min: 1, max: 1000 },
    offset: { type: 'number', min: 0 },
    sortBy: { type: 'string', maxLength: 100 },
    sortOrder: { type: 'string', enum: ['ASC', 'DESC'] }
  },
  securityContext: {
    userId: { type: 'string', required: true, maxLength: 100 },
    userRole: { type: 'string', required: true, maxLength: 50 },
    sessionId: { type: 'string', required: true, maxLength: 100 },
    accessLevel: { type: 'string', enum: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'] }
  }
};

// Helper type guards
export const isValidComponentName = (name: string): name is ComponentName => {
  return ['flaisimulator', 'mcpServer', 'patents', 'documentation'].includes(name);
};

export const isValidQueryOperation = (op: string): op is QueryOperationType => {
  return ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'].includes(op);
};

export const isValidComplianceFramework = (framework: string): framework is ComplianceFramework => {
  return ['Ley_27401', 'GDPR', 'SOX', 'HIPAA', 'PCI_DSS', 'ISO_27001'].includes(framework);
};

export const isValidAccessLevel = (level: string): level is AccessLevel => {
  return ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'].includes(level);
};

// Error classes
export class AnyQueryError extends Error {
  constructor(
    message: string,
    public code: string,
    public component?: string,
    public details?: {[key: string]: any}
  ) {
    super(message);
    this.name = 'AnyQueryError';
  }
}

export class ValidationError extends AnyQueryError {
  constructor(
    message: string,
    public field: string,
    public value: any,
    public constraint: string
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends AnyQueryError {
  constructor(message: string, public userId?: string, public requiredPermission?: string) {
    super(message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class QueryTimeoutError extends AnyQueryError {
  constructor(message: string, public timeoutMs: number) {
    super(message, 'QUERY_TIMEOUT');
    this.name = 'QueryTimeoutError';
  }
}

export class ComponentError extends AnyQueryError {
  constructor(message: string, component: string, public originalError?: Error) {
    super(message, 'COMPONENT_ERROR', component);
    this.name = 'ComponentError';
  }
}