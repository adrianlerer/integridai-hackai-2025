/**
 * 📚 Documentation Connector for IntegridAI Suite AnyQuery Integration
 * 
 * Provides SQL access to documentation, guides, and compliance materials
 * Integrates with training content, legal guides, and procedural documentation
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Patent-Protected Technology
 */

import { EventEmitter } from 'events';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs/promises';

export interface DocumentationConfig {
  dataPath: string;
  documentsPath?: string;
  enableFullTextSearch?: boolean;
  enableVersionControl?: boolean;
  enableAccessControl?: boolean;
  supportedLanguages?: string[];
  argentinianLegalContext?: boolean;
}

export interface DocumentRecord {
  document_id: string;
  title: string;
  document_type: 'TRAINING_GUIDE' | 'LEGAL_COMPLIANCE' | 'TECHNICAL_SPEC' | 'USER_MANUAL' | 'POLICY' | 'PROCEDURE';
  category: string;
  subcategory: string;
  
  // Content details
  content_summary: string;
  full_content: string;
  content_length: number;
  content_language: string;
  content_format: 'MARKDOWN' | 'HTML' | 'PDF' | 'JSON' | 'YAML';
  
  // Compliance and legal context
  compliance_framework: string; // 'Ley_27401' | 'GDPR' | 'SOX' | etc.
  legal_jurisdiction: string;
  regulatory_requirements: string; // JSON array
  compliance_level: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  
  // Argentina-specific legal context
  argentina_legal_context: boolean;
  ley27401_articles_referenced: string; // JSON array
  constitutional_basis: string; // JSON array
  procedural_requirements: string; // JSON array
  
  // Integration with IntegridAI Suite
  flaisimulator_integration: boolean;
  mcp_server_integration: boolean;
  patent_references: string; // JSON array of patent_ids
  p2_p4_methodology_docs: boolean;
  
  // Access control and security
  access_level: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  required_roles: string; // JSON array
  required_permissions: string; // JSON array
  
  // Version control
  version: string;
  parent_document_id: string;
  is_latest_version: boolean;
  change_summary: string;
  
  // Usage and effectiveness
  view_count: number;
  download_count: number;
  user_rating: number; // 0-100
  effectiveness_score: number; // 0-100
  last_reviewed: string;
  review_status: 'CURRENT' | 'NEEDS_UPDATE' | 'DEPRECATED';
  
  // Search and discovery
  tags: string; // JSON array
  keywords: string; // JSON array
  search_index_data: string; // JSON for full-text search
  
  // Metadata
  created_by: string;
  created_at: string;
  last_updated: string;
  file_path: string;
  file_size: number;
  checksum: string;
}

export interface TrainingContentRecord {
  content_id: string;
  document_id: string;
  training_module: string;
  learning_objectives: string; // JSON array
  target_audience: string; // JSON array
  
  // Training details
  difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimated_duration_minutes: number;
  prerequisites: string; // JSON array
  completion_criteria: string; // JSON array
  
  // Interactive elements
  has_quizzes: boolean;
  has_simulations: boolean;
  has_case_studies: boolean;
  interactive_elements: string; // JSON array
  
  // P2/P4 integration
  p2_evaluation_components: boolean;
  p4_reflection_triggers: boolean;
  cultural_adaptation_elements: boolean;
  argentina_specific_scenarios: boolean;
  
  // Effectiveness tracking
  completion_rate: number; // 0-100
  average_score: number; // 0-100
  user_feedback_score: number; // 0-100
  real_world_application_score: number; // 0-100
  
  created_at: string;
  last_updated: string;
}

export interface ComplianceDocumentRecord {
  compliance_id: string;
  document_id: string;
  regulation_name: string;
  regulation_code: string; // e.g., 'Ley_27401', 'GDPR'
  
  // Compliance details
  mandatory_requirements: string; // JSON array
  implementation_guidelines: string; // JSON array
  audit_checklist: string; // JSON array
  evidence_requirements: string; // JSON array
  
  // Legal framework integration
  legal_precedents: string; // JSON array
  case_studies: string; // JSON array
  expert_interpretations: string; // JSON array
  
  // Argentina-specific compliance
  argentina_jurisdiction: boolean;
  federal_vs_provincial: string;
  constitutional_implications: string; // JSON array
  procedural_safeguards: string; // JSON array
  
  // Integration with legal tools
  mcp_legal_shield_integration: boolean;
  forensic_evidence_procedures: boolean;
  officer_protection_guidelines: boolean;
  
  // Compliance monitoring
  monitoring_frequency: string;
  key_performance_indicators: string; // JSON array
  risk_assessment_criteria: string; // JSON array
  non_compliance_consequences: string; // JSON array
  
  // Effectiveness metrics
  implementation_success_rate: number; // 0-100
  audit_pass_rate: number; // 0-100
  user_comprehension_score: number; // 0-100
  
  created_at: string;
  last_updated: string;
}

export interface DocumentUsageRecord {
  usage_id: string;
  document_id: string;
  user_id: string;
  usage_type: 'VIEW' | 'DOWNLOAD' | 'SEARCH' | 'REFERENCE' | 'TRAINING' | 'COMPLIANCE_CHECK';
  
  // Usage context
  session_id: string;
  access_method: 'WEB' | 'API' | 'MOBILE' | 'INTEGRATION';
  user_role: string;
  organization_id: string;
  
  // Interaction details
  time_spent_seconds: number;
  sections_accessed: string; // JSON array
  search_queries_used: string; // JSON array
  actions_performed: string; // JSON array
  
  // Integration context
  vaccination_scenario_context: string;
  mcp_tool_context: string;
  legal_shield_context: string;
  p2_p4_context: string;
  
  // Effectiveness tracking
  user_satisfaction: number; // 0-100
  content_helpfulness: number; // 0-100
  task_completion_success: boolean;
  follow_up_actions_needed: boolean;
  
  usage_timestamp: string;
}

/**
 * Documentation Connector Class
 * Provides anyquery-compatible access to IntegridAI Suite documentation
 */
export class DocumentationConnector extends EventEmitter {
  private config: DocumentationConfig;
  private db: Database.Database;
  private cache: Map<string, any> = new Map();
  private searchIndex: Map<string, string[]> = new Map();

  constructor(config: DocumentationConfig) {
    super();
    this.config = {
      enableFullTextSearch: true,
      enableVersionControl: true,
      enableAccessControl: true,
      supportedLanguages: ['es', 'en'],
      argentinianLegalContext: true,
      ...config
    };

    this.initializeDatabase();
  }

  /**
   * Initialize SQLite database for documentation management
   */
  private initializeDatabase(): void {
    const dbPath = path.join(this.config.dataPath, 'documentation.db');
    this.db = new Database(dbPath);
    
    // Enable full-text search and optimize for read performance
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA synchronous = NORMAL;');
    this.db.exec('PRAGMA cache_size = -32000;'); // 32MB cache
    this.db.exec('PRAGMA temp_store = MEMORY;');
    
    // Create documentation tables
    this.createTablesIfNotExist();
    
    if (this.config.enableFullTextSearch) {
      this.initializeFullTextSearch();
    }
    
    this.emit('documentation_database_initialized', { path: dbPath });
  }

  /**
   * Create documentation database tables
   */
  private createTablesIfNotExist(): void {
    // Main documents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        document_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        document_type TEXT CHECK (document_type IN ('TRAINING_GUIDE', 'LEGAL_COMPLIANCE', 'TECHNICAL_SPEC', 'USER_MANUAL', 'POLICY', 'PROCEDURE')),
        category TEXT NOT NULL,
        subcategory TEXT,
        
        -- Content details
        content_summary TEXT,
        full_content TEXT,
        content_length INTEGER DEFAULT 0,
        content_language TEXT DEFAULT 'es',
        content_format TEXT CHECK (content_format IN ('MARKDOWN', 'HTML', 'PDF', 'JSON', 'YAML')) DEFAULT 'MARKDOWN',
        
        -- Compliance and legal context
        compliance_framework TEXT,
        legal_jurisdiction TEXT DEFAULT 'AR',
        regulatory_requirements TEXT DEFAULT '[]',
        compliance_level TEXT CHECK (compliance_level IN ('MANDATORY', 'RECOMMENDED', 'OPTIONAL')) DEFAULT 'RECOMMENDED',
        
        -- Argentina-specific legal context
        argentina_legal_context BOOLEAN DEFAULT FALSE,
        ley27401_articles_referenced TEXT DEFAULT '[]',
        constitutional_basis TEXT DEFAULT '[]',
        procedural_requirements TEXT DEFAULT '[]',
        
        -- Integration with IntegridAI Suite
        flaisimulator_integration BOOLEAN DEFAULT FALSE,
        mcp_server_integration BOOLEAN DEFAULT FALSE,
        patent_references TEXT DEFAULT '[]',
        p2_p4_methodology_docs BOOLEAN DEFAULT FALSE,
        
        -- Access control and security
        access_level TEXT CHECK (access_level IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED')) DEFAULT 'INTERNAL',
        required_roles TEXT DEFAULT '[]',
        required_permissions TEXT DEFAULT '[]',
        
        -- Version control
        version TEXT DEFAULT '1.0.0',
        parent_document_id TEXT,
        is_latest_version BOOLEAN DEFAULT TRUE,
        change_summary TEXT,
        
        -- Usage and effectiveness
        view_count INTEGER DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        user_rating INTEGER DEFAULT 0 CHECK (user_rating BETWEEN 0 AND 100),
        effectiveness_score INTEGER DEFAULT 0 CHECK (effectiveness_score BETWEEN 0 AND 100),
        last_reviewed DATE,
        review_status TEXT CHECK (review_status IN ('CURRENT', 'NEEDS_UPDATE', 'DEPRECATED')) DEFAULT 'CURRENT',
        
        -- Search and discovery
        tags TEXT DEFAULT '[]',
        keywords TEXT DEFAULT '[]',
        search_index_data TEXT DEFAULT '{}',
        
        -- Metadata
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_path TEXT,
        file_size INTEGER DEFAULT 0,
        checksum TEXT,
        
        FOREIGN KEY (parent_document_id) REFERENCES documents(document_id)
      )
    `);

    // Training content table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS training_content (
        content_id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        training_module TEXT NOT NULL,
        learning_objectives TEXT DEFAULT '[]',
        target_audience TEXT DEFAULT '[]',
        
        -- Training details
        difficulty_level TEXT CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')) DEFAULT 'INTERMEDIATE',
        estimated_duration_minutes INTEGER DEFAULT 30,
        prerequisites TEXT DEFAULT '[]',
        completion_criteria TEXT DEFAULT '[]',
        
        -- Interactive elements
        has_quizzes BOOLEAN DEFAULT FALSE,
        has_simulations BOOLEAN DEFAULT FALSE,
        has_case_studies BOOLEAN DEFAULT FALSE,
        interactive_elements TEXT DEFAULT '[]',
        
        -- P2/P4 integration
        p2_evaluation_components BOOLEAN DEFAULT FALSE,
        p4_reflection_triggers BOOLEAN DEFAULT FALSE,
        cultural_adaptation_elements BOOLEAN DEFAULT FALSE,
        argentina_specific_scenarios BOOLEAN DEFAULT FALSE,
        
        -- Effectiveness tracking
        completion_rate INTEGER DEFAULT 0 CHECK (completion_rate BETWEEN 0 AND 100),
        average_score INTEGER DEFAULT 0 CHECK (average_score BETWEEN 0 AND 100),
        user_feedback_score INTEGER DEFAULT 0 CHECK (user_feedback_score BETWEEN 0 AND 100),
        real_world_application_score INTEGER DEFAULT 0 CHECK (real_world_application_score BETWEEN 0 AND 100),
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (document_id) REFERENCES documents(document_id)
      )
    `);

    // Compliance documents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS compliance_documents (
        compliance_id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        regulation_name TEXT NOT NULL,
        regulation_code TEXT NOT NULL,
        
        -- Compliance details
        mandatory_requirements TEXT DEFAULT '[]',
        implementation_guidelines TEXT DEFAULT '[]',
        audit_checklist TEXT DEFAULT '[]',
        evidence_requirements TEXT DEFAULT '[]',
        
        -- Legal framework integration
        legal_precedents TEXT DEFAULT '[]',
        case_studies TEXT DEFAULT '[]',
        expert_interpretations TEXT DEFAULT '[]',
        
        -- Argentina-specific compliance
        argentina_jurisdiction BOOLEAN DEFAULT FALSE,
        federal_vs_provincial TEXT DEFAULT 'FEDERAL',
        constitutional_implications TEXT DEFAULT '[]',
        procedural_safeguards TEXT DEFAULT '[]',
        
        -- Integration with legal tools
        mcp_legal_shield_integration BOOLEAN DEFAULT FALSE,
        forensic_evidence_procedures BOOLEAN DEFAULT FALSE,
        officer_protection_guidelines BOOLEAN DEFAULT FALSE,
        
        -- Compliance monitoring
        monitoring_frequency TEXT DEFAULT 'QUARTERLY',
        key_performance_indicators TEXT DEFAULT '[]',
        risk_assessment_criteria TEXT DEFAULT '[]',
        non_compliance_consequences TEXT DEFAULT '[]',
        
        -- Effectiveness metrics
        implementation_success_rate INTEGER DEFAULT 0 CHECK (implementation_success_rate BETWEEN 0 AND 100),
        audit_pass_rate INTEGER DEFAULT 0 CHECK (audit_pass_rate BETWEEN 0 AND 100),
        user_comprehension_score INTEGER DEFAULT 0 CHECK (user_comprehension_score BETWEEN 0 AND 100),
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (document_id) REFERENCES documents(document_id)
      )
    `);

    // Document usage tracking table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS document_usage (
        usage_id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        usage_type TEXT CHECK (usage_type IN ('VIEW', 'DOWNLOAD', 'SEARCH', 'REFERENCE', 'TRAINING', 'COMPLIANCE_CHECK')),
        
        -- Usage context
        session_id TEXT,
        access_method TEXT CHECK (access_method IN ('WEB', 'API', 'MOBILE', 'INTEGRATION')) DEFAULT 'WEB',
        user_role TEXT,
        organization_id TEXT,
        
        -- Interaction details
        time_spent_seconds INTEGER DEFAULT 0,
        sections_accessed TEXT DEFAULT '[]',
        search_queries_used TEXT DEFAULT '[]',
        actions_performed TEXT DEFAULT '[]',
        
        -- Integration context
        vaccination_scenario_context TEXT,
        mcp_tool_context TEXT,
        legal_shield_context TEXT,
        p2_p4_context TEXT,
        
        -- Effectiveness tracking
        user_satisfaction INTEGER DEFAULT 0 CHECK (user_satisfaction BETWEEN 0 AND 100),
        content_helpfulness INTEGER DEFAULT 0 CHECK (content_helpfulness BETWEEN 0 AND 100),
        task_completion_success BOOLEAN DEFAULT FALSE,
        follow_up_actions_needed BOOLEAN DEFAULT FALSE,
        
        usage_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (document_id) REFERENCES documents(document_id)
      )
    `);

    // Document relationships table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS document_relationships (
        relationship_id TEXT PRIMARY KEY,
        source_document_id TEXT NOT NULL,
        target_document_id TEXT NOT NULL,
        relationship_type TEXT CHECK (relationship_type IN ('REFERENCES', 'SUPERSEDES', 'SUPPLEMENTS', 'REQUIRES', 'CONFLICTS_WITH')),
        relationship_strength INTEGER DEFAULT 50 CHECK (relationship_strength BETWEEN 0 AND 100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (source_document_id) REFERENCES documents(document_id),
        FOREIGN KEY (target_document_id) REFERENCES documents(document_id)
      )
    `);

    // Create performance indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
      CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
      CREATE INDEX IF NOT EXISTS idx_documents_compliance ON documents(compliance_framework);
      CREATE INDEX IF NOT EXISTS idx_documents_access ON documents(access_level);
      CREATE INDEX IF NOT EXISTS idx_documents_version ON documents(is_latest_version);
      CREATE INDEX IF NOT EXISTS idx_documents_review ON documents(review_status);
      CREATE INDEX IF NOT EXISTS idx_documents_argentina ON documents(argentina_legal_context);
      CREATE INDEX IF NOT EXISTS idx_documents_integration ON documents(flaisimulator_integration, mcp_server_integration);
      
      CREATE INDEX IF NOT EXISTS idx_training_module ON training_content(training_module);
      CREATE INDEX IF NOT EXISTS idx_training_difficulty ON training_content(difficulty_level);
      CREATE INDEX IF NOT EXISTS idx_training_p2p4 ON training_content(p2_evaluation_components, p4_reflection_triggers);
      
      CREATE INDEX IF NOT EXISTS idx_compliance_regulation ON compliance_documents(regulation_code);
      CREATE INDEX IF NOT EXISTS idx_compliance_jurisdiction ON compliance_documents(argentina_jurisdiction);
      CREATE INDEX IF NOT EXISTS idx_compliance_success ON compliance_documents(implementation_success_rate);
      
      CREATE INDEX IF NOT EXISTS idx_usage_document ON document_usage(document_id);
      CREATE INDEX IF NOT EXISTS idx_usage_user ON document_usage(user_id);
      CREATE INDEX IF NOT EXISTS idx_usage_type ON document_usage(usage_type);
      CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON document_usage(usage_timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_relationships_source ON document_relationships(source_document_id);
      CREATE INDEX IF NOT EXISTS idx_relationships_target ON document_relationships(target_document_id);
      CREATE INDEX IF NOT EXISTS idx_relationships_type ON document_relationships(relationship_type);
    `);
  }

  /**
   * Initialize full-text search capabilities
   */
  private initializeFullTextSearch(): void {
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
        document_id UNINDEXED,
        title,
        content_summary,
        full_content,
        tags,
        keywords,
        content='documents',
        content_rowid='rowid'
      )
    `);

    // Create triggers to maintain FTS index
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
        INSERT INTO documents_fts(rowid, document_id, title, content_summary, full_content, tags, keywords)
        VALUES (NEW.rowid, NEW.document_id, NEW.title, NEW.content_summary, NEW.full_content, NEW.tags, NEW.keywords);
      END
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
        INSERT INTO documents_fts(documents_fts, rowid, document_id, title, content_summary, full_content, tags, keywords)
        VALUES ('delete', OLD.rowid, OLD.document_id, OLD.title, OLD.content_summary, OLD.full_content, OLD.tags, OLD.keywords);
      END
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
        INSERT INTO documents_fts(documents_fts, rowid, document_id, title, content_summary, full_content, tags, keywords)
        VALUES ('delete', OLD.rowid, OLD.document_id, OLD.title, OLD.content_summary, OLD.full_content, OLD.tags, OLD.keywords);
        INSERT INTO documents_fts(rowid, document_id, title, content_summary, full_content, tags, keywords)
        VALUES (NEW.rowid, NEW.document_id, NEW.title, NEW.content_summary, NEW.full_content, NEW.tags, NEW.keywords);
      END
    `);
  }

  /**
   * Execute SQL queries with documentation-specific optimizations
   */
  async executeQuery(sql: string, userId?: string): Promise<any[]> {
    try {
      const startTime = Date.now();
      
      // Check access permissions
      if (this.config.enableAccessControl && !userId) {
        throw new Error('Documentation access requires user authentication');
      }

      // Check cache for read queries
      const cacheKey = this.generateCacheKey(sql, userId);
      if (sql.trim().toLowerCase().startsWith('select')) {
        if (this.cache.has(cacheKey)) {
          const cached = this.cache.get(cacheKey);
          if (this.isCacheValid(cached.timestamp)) {
            this.emit('documentation_cache_hit', { sql, userId, executionTime: Date.now() - startTime });
            return cached.results;
          }
        }
      }

      // Apply access control filters
      const filteredSQL = this.config.enableAccessControl ? 
        this.applyAccessControl(sql, userId) : sql;
      
      // Execute query
      const stmt = this.db.prepare(filteredSQL);
      const results = stmt.all();
      
      // Transform results
      const transformedResults = this.transformResults(results);
      
      // Cache results
      if (sql.trim().toLowerCase().startsWith('select')) {
        this.cache.set(cacheKey, {
          results: transformedResults,
          timestamp: new Date()
        });
      }

      this.emit('documentation_query_executed', {
        sql: filteredSQL,
        userId,
        resultCount: transformedResults.length,
        executionTime: Date.now() - startTime
      });

      return transformedResults;
    } catch (error) {
      this.emit('documentation_query_error', { sql, userId, error: error.message });
      throw error;
    }
  }

  /**
   * Search documents with full-text search
   */
  async searchDocuments(searchQuery: string, filters: any = {}, userId?: string): Promise<any[]> {
    if (!this.config.enableFullTextSearch) {
      throw new Error('Full-text search is not enabled');
    }

    let whereClause = '';
    const params: any[] = [searchQuery];

    // Add filters
    if (filters.document_type) {
      whereClause += ' AND d.document_type = ?';
      params.push(filters.document_type);
    }

    if (filters.category) {
      whereClause += ' AND d.category = ?';
      params.push(filters.category);
    }

    if (filters.compliance_framework) {
      whereClause += ' AND d.compliance_framework = ?';
      params.push(filters.compliance_framework);
    }

    if (filters.argentina_legal_context) {
      whereClause += ' AND d.argentina_legal_context = TRUE';
    }

    if (filters.access_level && this.config.enableAccessControl) {
      whereClause += ' AND d.access_level IN (?, "PUBLIC")';
      params.push(filters.access_level);
    }

    if (filters.current_only) {
      whereClause += ' AND d.is_latest_version = TRUE AND d.review_status != "DEPRECATED"';
    }

    const sql = `
      SELECT 
        d.*,
        fts.rank as search_relevance
      FROM documents_fts fts
      JOIN documents d ON fts.document_id = d.document_id
      WHERE documents_fts MATCH ?
        ${whereClause}
      ORDER BY fts.rank, d.user_rating DESC, d.view_count DESC
      ${filters.limit ? `LIMIT ${filters.limit}` : 'LIMIT 50'}
    `;

    const results = this.db.prepare(sql).all(...params);
    
    // Log search for analytics
    if (userId) {
      await this.logDocumentUsage(userId, results.map(r => r.document_id), 'SEARCH', {
        searchQuery,
        resultCount: results.length
      });
    }

    return results;
  }

  /**
   * Get documents with advanced filtering
   */
  async getDocuments(filters: any = {}, userId?: string): Promise<DocumentRecord[]> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    // Apply filters
    if (filters.document_type) {
      whereClause += ' AND document_type = ?';
      params.push(filters.document_type);
    }

    if (filters.category) {
      whereClause += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.compliance_framework) {
      whereClause += ' AND compliance_framework = ?';
      params.push(filters.compliance_framework);
    }

    if (filters.argentina_legal_context) {
      whereClause += ' AND argentina_legal_context = TRUE';
    }

    if (filters.integridai_integration) {
      whereClause += ' AND (flaisimulator_integration = TRUE OR mcp_server_integration = TRUE)';
    }

    if (filters.p2_p4_docs) {
      whereClause += ' AND p2_p4_methodology_docs = TRUE';
    }

    if (filters.access_level && this.config.enableAccessControl) {
      whereClause += ' AND access_level IN (?, "PUBLIC")';
      params.push(filters.access_level);
    }

    if (filters.review_status) {
      whereClause += ' AND review_status = ?';
      params.push(filters.review_status);
    }

    if (filters.latest_only) {
      whereClause += ' AND is_latest_version = TRUE';
    }

    if (filters.min_rating) {
      whereClause += ' AND user_rating >= ?';
      params.push(filters.min_rating);
    }

    const sql = `
      SELECT * FROM documents 
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN review_status = 'CURRENT' THEN 1
          WHEN review_status = 'NEEDS_UPDATE' THEN 2
          ELSE 3
        END,
        user_rating DESC,
        view_count DESC,
        last_updated DESC
      ${filters.limit ? `LIMIT ${filters.limit}` : ''}
    `;

    const stmt = this.db.prepare(sql);
    const results = stmt.all(...params) as DocumentRecord[];
    
    // Log access for monitoring
    if (userId && results.length > 0) {
      await this.logDocumentUsage(userId, results.map(d => d.document_id), 'VIEW');
    }

    return results;
  }

  /**
   * Get training content analytics
   */
  async getTrainingContentAnalytics(): Promise<any> {
    const analyticsSQL = `
      SELECT 
        tc.training_module,
        tc.difficulty_level,
        COUNT(d.document_id) as total_documents,
        AVG(tc.completion_rate) as avg_completion_rate,
        AVG(tc.average_score) as avg_user_score,
        AVG(tc.user_feedback_score) as avg_feedback_score,
        AVG(tc.real_world_application_score) as avg_application_score,
        COUNT(CASE WHEN tc.p2_evaluation_components THEN 1 END) as p2_integration_count,
        COUNT(CASE WHEN tc.p4_reflection_triggers THEN 1 END) as p4_integration_count,
        COUNT(CASE WHEN tc.argentina_specific_scenarios THEN 1 END) as argentina_scenarios_count,
        AVG(d.user_rating) as avg_document_rating,
        SUM(d.view_count) as total_views
      FROM training_content tc
      JOIN documents d ON tc.document_id = d.document_id
      WHERE d.is_latest_version = TRUE 
        AND d.review_status != 'DEPRECATED'
      GROUP BY tc.training_module, tc.difficulty_level
      ORDER BY avg_completion_rate DESC, total_views DESC
    `;

    return this.db.prepare(analyticsSQL).all();
  }

  /**
   * Get compliance documentation metrics
   */
  async getComplianceDocumentationMetrics(): Promise<any> {
    const metricsSQL = `
      SELECT 
        cd.regulation_code,
        cd.regulation_name,
        COUNT(d.document_id) as total_documents,
        AVG(cd.implementation_success_rate) as avg_implementation_success,
        AVG(cd.audit_pass_rate) as avg_audit_pass_rate,
        AVG(cd.user_comprehension_score) as avg_comprehension_score,
        COUNT(CASE WHEN cd.argentina_jurisdiction THEN 1 END) as argentina_specific_docs,
        COUNT(CASE WHEN cd.mcp_legal_shield_integration THEN 1 END) as mcp_integrated_docs,
        COUNT(CASE WHEN cd.forensic_evidence_procedures THEN 1 END) as forensic_procedure_docs,
        AVG(d.user_rating) as avg_document_rating,
        SUM(d.view_count) as total_views
      FROM compliance_documents cd
      JOIN documents d ON cd.document_id = d.document_id
      WHERE d.is_latest_version = TRUE 
        AND d.review_status != 'DEPRECATED'
      GROUP BY cd.regulation_code, cd.regulation_name
      ORDER BY avg_implementation_success DESC, total_views DESC
    `;

    return this.db.prepare(metricsSQL).all();
  }

  /**
   * Generate Ley 27.401 documentation compliance report
   */
  async generateLey27401DocumentationReport(): Promise<any> {
    const reportSQL = `
      WITH ley27401_docs AS (
        SELECT 
          d.document_type,
          COUNT(*) as total_docs,
          AVG(d.user_rating) as avg_rating,
          AVG(d.effectiveness_score) as avg_effectiveness,
          SUM(d.view_count) as total_views,
          COUNT(CASE WHEN d.review_status = 'CURRENT' THEN 1 END) as current_docs,
          COUNT(CASE WHEN cd.mcp_legal_shield_integration THEN 1 END) as mcp_integrated
        FROM documents d
        LEFT JOIN compliance_documents cd ON d.document_id = cd.document_id
        WHERE (d.compliance_framework LIKE '%27401%' 
               OR JSON_EXTRACT(d.ley27401_articles_referenced, '$') != '[]'
               OR cd.regulation_code = 'Ley_27401')
          AND d.is_latest_version = TRUE
        GROUP BY d.document_type
      ),
      training_coverage AS (
        SELECT 
          COUNT(*) as ley27401_training_modules,
          AVG(tc.completion_rate) as avg_completion_rate,
          COUNT(CASE WHEN tc.argentina_specific_scenarios THEN 1 END) as argentina_scenarios
        FROM training_content tc
        JOIN documents d ON tc.document_id = d.document_id
        WHERE (d.compliance_framework LIKE '%27401%' 
               OR JSON_EXTRACT(d.ley27401_articles_referenced, '$') != '[]')
          AND d.is_latest_version = TRUE
      ),
      usage_metrics AS (
        SELECT 
          COUNT(DISTINCT du.user_id) as unique_users,
          COUNT(*) as total_accesses,
          AVG(du.user_satisfaction) as avg_satisfaction,
          AVG(du.content_helpfulness) as avg_helpfulness,
          COUNT(CASE WHEN du.task_completion_success THEN 1 END) as successful_tasks
        FROM document_usage du
        JOIN documents d ON du.document_id = d.document_id
        WHERE (d.compliance_framework LIKE '%27401%' 
               OR JSON_EXTRACT(d.ley27401_articles_referenced, '$') != '[]')
          AND du.usage_timestamp >= DATE('now', '-30 days')
      )
      SELECT 
        ld.document_type,
        ld.total_docs,
        ld.avg_rating,
        ld.avg_effectiveness,
        ld.total_views,
        ld.current_docs,
        ld.mcp_integrated,
        -- Calculate coverage percentage
        ROUND(CAST(ld.current_docs AS FLOAT) / ld.total_docs * 100, 2) as current_coverage_percentage
      FROM ley27401_docs ld
    `;

    const trainingSQL = `
      SELECT 
        COUNT(*) as ley27401_training_modules,
        AVG(tc.completion_rate) as avg_completion_rate,
        COUNT(CASE WHEN tc.argentina_specific_scenarios THEN 1 END) as argentina_scenarios
      FROM training_content tc
      JOIN documents d ON tc.document_id = d.document_id
      WHERE (d.compliance_framework LIKE '%27401%' 
             OR JSON_EXTRACT(d.ley27401_articles_referenced, '$') != '[]')
        AND d.is_latest_version = TRUE
    `;

    const usageSQL = `
      SELECT 
        COUNT(DISTINCT du.user_id) as unique_users,
        COUNT(*) as total_accesses,
        AVG(du.user_satisfaction) as avg_satisfaction,
        AVG(du.content_helpfulness) as avg_helpfulness,
        COUNT(CASE WHEN du.task_completion_success THEN 1 END) as successful_tasks
      FROM document_usage du
      JOIN documents d ON du.document_id = d.document_id
      WHERE (d.compliance_framework LIKE '%27401%' 
             OR JSON_EXTRACT(d.ley27401_articles_referenced, '$') != '[]')
        AND du.usage_timestamp >= DATE('now', '-30 days')
    `;

    const documentMetrics = this.db.prepare(reportSQL).all();
    const trainingMetrics = this.db.prepare(trainingSQL).get();
    const usageMetrics = this.db.prepare(usageSQL).get();

    return {
      report_generated_at: new Date().toISOString(),
      report_type: 'Ley 27.401 Documentation Compliance',
      document_coverage: documentMetrics,
      training_metrics: trainingMetrics,
      usage_metrics: usageMetrics,
      overall_compliance_score: this.calculateDocumentationComplianceScore(documentMetrics, trainingMetrics, usageMetrics),
      recommendations: this.generateDocumentationRecommendations(documentMetrics, trainingMetrics, usageMetrics),
      next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
    };
  }

  /**
   * Get documentation dashboard metrics
   */
  async getDocumentationDashboardMetrics(): Promise<any> {
    const overviewSQL = `
      SELECT 
        COUNT(*) as total_documents,
        COUNT(CASE WHEN is_latest_version THEN 1 END) as latest_version_count,
        COUNT(CASE WHEN review_status = 'CURRENT' THEN 1 END) as current_documents,
        COUNT(CASE WHEN review_status = 'NEEDS_UPDATE' THEN 1 END) as needs_update_count,
        COUNT(CASE WHEN review_status = 'DEPRECATED' THEN 1 END) as deprecated_count,
        AVG(user_rating) as avg_user_rating,
        AVG(effectiveness_score) as avg_effectiveness_score,
        SUM(view_count) as total_views,
        SUM(download_count) as total_downloads
      FROM documents
    `;

    const typeBreakdownSQL = `
      SELECT 
        document_type,
        COUNT(*) as count,
        AVG(user_rating) as avg_rating,
        SUM(view_count) as total_views
      FROM documents
      WHERE is_latest_version = TRUE
      GROUP BY document_type
      ORDER BY count DESC
    `;

    const recentActivitySQL = `
      SELECT 
        usage_type,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users
      FROM document_usage
      WHERE usage_timestamp >= DATE('now', '-7 days')
      GROUP BY usage_type
    `;

    const integrationMetricsSQL = `
      SELECT 
        COUNT(CASE WHEN flaisimulator_integration THEN 1 END) as flaisimulator_docs,
        COUNT(CASE WHEN mcp_server_integration THEN 1 END) as mcp_server_docs,
        COUNT(CASE WHEN p2_p4_methodology_docs THEN 1 END) as p2_p4_docs,
        COUNT(CASE WHEN argentina_legal_context THEN 1 END) as argentina_legal_docs
      FROM documents
      WHERE is_latest_version = TRUE
    `;

    const overview = this.db.prepare(overviewSQL).get();
    const typeBreakdown = this.db.prepare(typeBreakdownSQL).all();
    const recentActivity = this.db.prepare(recentActivitySQL).all();
    const integrationMetrics = this.db.prepare(integrationMetricsSQL).get();

    return {
      ...overview,
      document_type_breakdown: typeBreakdown,
      recent_activity: recentActivity,
      integration_metrics: integrationMetrics,
      last_updated: new Date().toISOString(),
      documentation_health: this.calculateDocumentationHealth(overview, typeBreakdown),
      compliance_status: this.calculateComplianceDocumentationStatus(overview)
    };
  }

  /**
   * Record document usage for analytics
   */
  async logDocumentUsage(userId: string, documentIds: string[], usageType: string, context: any = {}): Promise<void> {
    const usageId = this.generateId('usage');
    
    // For multiple documents, log each separately
    const insertSQL = `
      INSERT INTO document_usage (
        usage_id, document_id, user_id, usage_type,
        session_id, access_method, user_role, organization_id,
        time_spent_seconds, sections_accessed, search_queries_used, actions_performed,
        vaccination_scenario_context, mcp_tool_context, legal_shield_context, p2_p4_context,
        user_satisfaction, content_helpfulness, task_completion_success
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Update view count for documents
    const updateViewCountSQL = `
      UPDATE documents 
      SET view_count = view_count + 1,
          last_updated = CURRENT_TIMESTAMP
      WHERE document_id = ?
    `;

    documentIds.forEach(documentId => {
      this.db.prepare(insertSQL).run(
        `${usageId}_${documentId}`,
        documentId,
        userId,
        usageType,
        context.sessionId || null,
        context.accessMethod || 'WEB',
        context.userRole || null,
        context.organizationId || null,
        context.timeSpent || 0,
        JSON.stringify(context.sectionsAccessed || []),
        JSON.stringify(context.searchQueries || []),
        JSON.stringify(context.actionsPerformed || []),
        context.vaccinationScenarioContext || null,
        context.mcpToolContext || null,
        context.legalShieldContext || null,
        context.p2P4Context || null,
        context.userSatisfaction || 0,
        context.contentHelpfulness || 0,
        context.taskCompletionSuccess || false
      );

      if (usageType === 'VIEW' || usageType === 'REFERENCE') {
        this.db.prepare(updateViewCountSQL).run(documentId);
      }
    });

    this.emit('document_usage_logged', { userId, documentIds, usageType });
  }

  // Utility methods

  private transformResults(results: any[]): any[] {
    return results.map(row => {
      // Parse JSON fields
      const jsonFields = [
        'regulatory_requirements', 'ley27401_articles_referenced', 'constitutional_basis',
        'procedural_requirements', 'patent_references', 'required_roles', 'required_permissions',
        'tags', 'keywords', 'search_index_data', 'learning_objectives', 'target_audience',
        'prerequisites', 'completion_criteria', 'interactive_elements', 'mandatory_requirements',
        'implementation_guidelines', 'audit_checklist', 'evidence_requirements',
        'legal_precedents', 'case_studies', 'expert_interpretations', 'constitutional_implications',
        'procedural_safeguards', 'key_performance_indicators', 'risk_assessment_criteria',
        'non_compliance_consequences', 'sections_accessed', 'search_queries_used', 'actions_performed'
      ];

      jsonFields.forEach(field => {
        if (row[field] && typeof row[field] === 'string') {
          try {
            row[field] = JSON.parse(row[field]);
          } catch (e) {
            row[field] = row[field] === '[]' ? [] : row[field] === '{}' ? {} : row[field];
          }
        }
      });

      return row;
    });
  }

  private applyAccessControl(sql: string, userId?: string): string {
    // In production, this would implement role-based access control
    // For now, we add basic access level filtering
    if (sql.toLowerCase().includes('from documents') && !sql.toLowerCase().includes('access_level')) {
      // Add access level filter to documents queries
      if (sql.toLowerCase().includes('where')) {
        sql = sql.replace(/where/i, 'WHERE (access_level = "PUBLIC" OR access_level = "INTERNAL") AND');
      } else {
        sql = sql.replace(/from documents/i, 'FROM documents WHERE (access_level = "PUBLIC" OR access_level = "INTERNAL")');
      }
    }
    return sql;
  }

  private generateCacheKey(sql: string, userId?: string): string {
    const baseKey = Buffer.from(sql).toString('base64').slice(0, 32);
    return `docs_${baseKey}_${userId || 'anonymous'}`;
  }

  private isCacheValid(timestamp: Date): boolean {
    const maxAge = 15 * 60 * 1000; // 15 minutes for documentation
    return Date.now() - timestamp.getTime() < maxAge;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateDocumentationComplianceScore(documentMetrics: any[], trainingMetrics: any, usageMetrics: any): number {
    const docCoverage = documentMetrics.reduce((sum, doc) => sum + doc.current_coverage_percentage, 0) / documentMetrics.length;
    const trainingEffectiveness = trainingMetrics.avg_completion_rate || 0;
    const userSatisfaction = usageMetrics.avg_satisfaction || 0;
    
    return Math.round((docCoverage * 0.4 + trainingEffectiveness * 0.3 + userSatisfaction * 0.3));
  }

  private generateDocumentationRecommendations(documentMetrics: any[], trainingMetrics: any, usageMetrics: any): string[] {
    const recommendations = [];
    
    const lowCoverageTypes = documentMetrics.filter(doc => doc.current_coverage_percentage < 80);
    if (lowCoverageTypes.length > 0) {
      recommendations.push(`Update documentation for: ${lowCoverageTypes.map(d => d.document_type).join(', ')}`);
    }
    
    if (trainingMetrics.avg_completion_rate < 70) {
      recommendations.push('Improve training content engagement and completion rates');
    }
    
    if (usageMetrics.avg_satisfaction < 75) {
      recommendations.push('Enhance documentation quality and user experience');
    }
    
    if (trainingMetrics.argentina_scenarios < 5) {
      recommendations.push('Develop more Argentina-specific training scenarios for Ley 27.401 compliance');
    }
    
    return recommendations.length > 0 ? recommendations : 
      ['Documentation compliance is excellent. Continue regular reviews and updates.'];
  }

  private calculateDocumentationHealth(overview: any, typeBreakdown: any[]): number {
    const currentRate = overview.current_documents / overview.total_documents * 100;
    const avgRating = overview.avg_user_rating || 0;
    const avgEffectiveness = overview.avg_effectiveness_score || 0;
    const typeBalance = typeBreakdown.length >= 4 ? 100 : (typeBreakdown.length / 4) * 100;
    
    return Math.round((currentRate * 0.3 + avgRating * 0.25 + avgEffectiveness * 0.25 + typeBalance * 0.2));
  }

  private calculateComplianceDocumentationStatus(overview: any): string {
    const currentRate = (overview.current_documents / overview.total_documents) * 100;
    const avgRating = overview.avg_user_rating || 0;
    
    if (currentRate >= 95 && avgRating >= 85) return 'EXCELLENT';
    if (currentRate >= 85 && avgRating >= 75) return 'GOOD';
    if (currentRate >= 75) return 'SATISFACTORY';
    return 'NEEDS_IMPROVEMENT';
  }

  /**
   * Close database connection and cleanup
   */
  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
    }
    this.cache.clear();
    this.searchIndex.clear();
    this.emit('documentation_disconnected');
  }
}

export default DocumentationConnector;