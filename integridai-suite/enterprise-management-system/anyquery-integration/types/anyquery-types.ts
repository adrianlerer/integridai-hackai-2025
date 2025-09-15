/**
 * 🔗 Anyquery Type Definitions for IntegridAI Enterprise Management System
 * 
 * Unified type system for SQL abstraction layer across enterprise data sources
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

/**
 * Basic anyquery connector interface
 */
export interface AnyqueryConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getTableSchema(): TableSchema;
  executeQuery(sql: string): Promise<QueryResult>;
}

/**
 * SQL Table Schema Definition
 */
export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  indexes?: IndexDefinition[];
  constraints?: ConstraintDefinition[];
  metadata?: Record<string, any>;
}

/**
 * Column Definition
 */
export interface ColumnDefinition {
  name: string;
  type: SQLDataType;
  nullable?: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  foreignKey?: ForeignKeyDefinition;
  unique?: boolean;
  indexed?: boolean;
  description?: string;
}

/**
 * Index Definition
 */
export interface IndexDefinition {
  name: string;
  columns: string[];
  unique?: boolean;
  type?: 'btree' | 'hash' | 'gin' | 'gist';
}

/**
 * Constraint Definition
 */
export interface ConstraintDefinition {
  name: string;
  type: 'primary_key' | 'foreign_key' | 'unique' | 'check';
  columns: string[];
  references?: {
    table: string;
    columns: string[];
  };
  condition?: string;
}

/**
 * Foreign Key Definition
 */
export interface ForeignKeyDefinition {
  referencedTable: string;
  referencedColumn: string;
  onDelete?: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION';
}

/**
 * SQL Data Types
 */
export type SQLDataType = 
  | 'TEXT'
  | 'TEXT PRIMARY KEY'
  | 'TEXT NOT NULL'
  | 'TEXT UNIQUE'
  | 'INTEGER'
  | 'INTEGER PRIMARY KEY'
  | 'INTEGER NOT NULL'
  | 'REAL'
  | 'NUMERIC'
  | 'BOOLEAN'
  | 'BOOLEAN DEFAULT TRUE'
  | 'BOOLEAN DEFAULT FALSE'
  | 'DATE'
  | 'DATETIME'
  | 'DATETIME DEFAULT CURRENT_TIMESTAMP'
  | 'TIMESTAMP'
  | 'BLOB'
  | 'JSON'
  | 'UUID';

/**
 * Query Result Interface
 */
export interface QueryResult {
  rows: any[];
  rowCount: number;
  executionTime: number;
  query: string;
  metadata?: QueryMetadata;
}

/**
 * Query Metadata
 */
export interface QueryMetadata {
  columns: ColumnMetadata[];
  affectedRows?: number;
  warnings?: string[];
  executionPlan?: any;
}

/**
 * Column Metadata
 */
export interface ColumnMetadata {
  name: string;
  type: SQLDataType;
  nullable: boolean;
  ordinalPosition: number;
}

/**
 * Anyquery Client Configuration
 */
export interface AnyqueryConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  connectionTimeout?: number;
  queryTimeout?: number;
  poolSize?: number;
}

/**
 * Connection Status
 */
export interface ConnectionStatus {
  connected: boolean;
  lastPing?: Date;
  latency?: number;
  error?: string;
}

/**
 * Query Execution Context
 */
export interface QueryContext {
  userId?: string;
  sessionId?: string;
  permissions?: string[];
  timeout?: number;
  dryRun?: boolean;
}

/**
 * Data Source Configuration
 */
export interface DataSourceConfig {
  name: string;
  type: DataSourceType;
  config: Record<string, any>;
  enabled: boolean;
  priority: number;
  cacheDuration?: number;
  retryAttempts?: number;
}

/**
 * Supported Data Source Types
 */
export type DataSourceType = 
  | 'HRMS'
  | 'LMS'
  | 'SURVEY'
  | 'VACCINATION'
  | 'COMPLIANCE'
  | 'AUDIT'
  | 'LEGAL'
  | 'FINANCE'
  | 'CRM'
  | 'ERP';

/**
 * Query Filter Interface
 */
export interface QueryFilter {
  column: string;
  operator: FilterOperator;
  value: any;
  caseSensitive?: boolean;
}

/**
 * Filter Operators
 */
export type FilterOperator = 
  | '='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>='
  | 'IN'
  | 'NOT IN'
  | 'LIKE'
  | 'NOT LIKE'
  | 'ILIKE'
  | 'IS NULL'
  | 'IS NOT NULL'
  | 'BETWEEN'
  | 'NOT BETWEEN';

/**
 * Query Pagination
 */
export interface QueryPagination {
  limit: number;
  offset: number;
  orderBy?: OrderByClause[];
}

/**
 * Order By Clause
 */
export interface OrderByClause {
  column: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Aggregate Function
 */
export interface AggregateFunction {
  function: AggregateFunctionType;
  column: string;
  alias?: string;
  distinct?: boolean;
}

/**
 * Aggregate Function Types
 */
export type AggregateFunctionType = 
  | 'COUNT'
  | 'SUM'
  | 'AVG'
  | 'MIN'
  | 'MAX'
  | 'GROUP_CONCAT'
  | 'STDDEV'
  | 'VARIANCE';

/**
 * Query Builder Interface
 */
export interface QueryBuilder {
  select(columns: string[] | string): QueryBuilder;
  from(table: string): QueryBuilder;
  join(table: string, condition: string, type?: JoinType): QueryBuilder;
  where(condition: string | QueryFilter): QueryBuilder;
  groupBy(columns: string[]): QueryBuilder;
  having(condition: string): QueryBuilder;
  orderBy(column: string, direction?: 'ASC' | 'DESC'): QueryBuilder;
  limit(count: number): QueryBuilder;
  offset(count: number): QueryBuilder;
  build(): string;
}

/**
 * Join Types
 */
export type JoinType = 
  | 'INNER'
  | 'LEFT'
  | 'RIGHT'
  | 'FULL'
  | 'CROSS';

/**
 * Transaction Interface
 */
export interface Transaction {
  id: string;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  savepoint(name: string): Promise<void>;
  rollbackToSavepoint(name: string): Promise<void>;
  isActive(): boolean;
}

/**
 * Cache Configuration
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // seconds
  maxSize: number; // MB
  strategy: 'LRU' | 'LFU' | 'FIFO';
  compression?: boolean;
}

/**
 * Security Context
 */
export interface SecurityContext {
  userId: string;
  roles: string[];
  permissions: string[];
  dataAccessLevel: 'NONE' | 'READ' | 'WRITE' | 'ADMIN';
  departmentAccess?: string[];
  rowLevelSecurity?: boolean;
}

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  clientIp?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
}

/**
 * Audit Actions
 */
export type AuditAction = 
  | 'SELECT'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'CONNECT'
  | 'DISCONNECT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT';

/**
 * Compliance Validation Result
 */
export interface ComplianceValidationResult {
  isCompliant: boolean;
  score: number;
  violations: ComplianceViolation[];
  recommendations: string[];
  auditTrail: AuditLogEntry[];
}

/**
 * Compliance Violation
 */
export interface ComplianceViolation {
  id: string;
  type: ViolationType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  regulation: string;
  article?: string;
  remediation: string;
  dueDate?: Date;
}

/**
 * Violation Types
 */
export type ViolationType = 
  | 'DATA_ACCESS'
  | 'UNAUTHORIZED_QUERY'
  | 'DATA_EXPORT'
  | 'MISSING_APPROVAL'
  | 'POLICY_VIOLATION'
  | 'REGULATORY_BREACH';

/**
 * Data Privacy Configuration
 */
export interface DataPrivacyConfig {
  enableMasking: boolean;
  maskingRules: MaskingRule[];
  piiFields: string[];
  retentionPeriod?: number; // days
  anonymizeAfter?: number; // days
  encryptionRequired: boolean;
}

/**
 * Data Masking Rule
 */
export interface MaskingRule {
  field: string;
  maskingType: MaskingType;
  preserveFormat?: boolean;
  customPattern?: string;
}

/**
 * Masking Types
 */
export type MaskingType = 
  | 'FULL'
  | 'PARTIAL'
  | 'EMAIL'
  | 'PHONE'
  | 'SSN'
  | 'CREDIT_CARD'
  | 'CUSTOM';

export default {
  AnyqueryConnector,
  TableSchema,
  QueryResult,
  DataSourceConfig,
  SecurityContext,
  ComplianceValidationResult
};