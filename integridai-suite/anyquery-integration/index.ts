/**
 * 🚀 IntegridAI Suite AnyQuery Integration - Main Entry Point
 * 
 * Comprehensive SQL-powered compliance data unification for IntegridAI Suite
 * Provides unified access to FLAISimulator, MCP Server, Patents, and Documentation
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Patent-Protected Technology
 */

// Main exports
export { UnifiedQueryInterface } from './unified-query-interface';
export { FLAISimulatorConnector } from './connectors/flaisimulator-connector';
export { MCPServerConnector } from './connectors/mcp-server-connector';
export { PatentsConnector } from './connectors/patents-connector';
export { DocumentationConnector } from './connectors/documentation-connector';

// Configuration exports
export * from './config';
export * from './types';

// Main integration class
import { UnifiedQueryInterface } from './unified-query-interface';
import { UNIFIED_QUERY_CONFIG, INTEGRIDAI_ANYQUERY_CONFIG } from './config';
import type { 
  UnifiedQueryConfig, 
  IntegridAISuiteConfig, 
  QueryResult, 
  UnifiedAnalytics,
  ComplianceReport 
} from './types';

/**
 * Main IntegridAI Suite AnyQuery Integration Class
 * 
 * This is the primary entry point for all AnyQuery functionality in IntegridAI Suite.
 * It provides a unified interface for SQL queries across all components while
 * maintaining security, compliance, and patent protection requirements.
 */
export class IntegridAIAnyQuerySuite {
  private unifiedQuery: UnifiedQueryInterface;
  private config: UnifiedQueryConfig;
  private initialized: boolean = false;

  constructor(config?: Partial<UnifiedQueryConfig>) {
    this.config = {
      ...UNIFIED_QUERY_CONFIG,
      ...config
    };
    
    this.unifiedQuery = new UnifiedQueryInterface(this.config);
    this.setupEventListeners();
  }

  /**
   * Initialize the AnyQuery integration
   */
  async initialize(): Promise<void> {
    try {
      // Create data directories if they don't exist
      await this.ensureDataDirectories();
      
      // Validate configuration
      this.validateConfiguration();
      
      // Initialize all connectors
      await this.initializeConnectors();
      
      this.initialized = true;
      
      console.log('✅ IntegridAI Suite AnyQuery Integration initialized successfully');
      console.log(`📊 Components enabled: ${Object.keys(this.config.connectors).join(', ')}`);
      console.log(`🔒 Security features: ${this.getSecurityFeatures().join(', ')}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize IntegridAI AnyQuery Suite:', error);
      throw error;
    }
  }

  /**
   * Execute SQL queries with unified interface
   */
  async query(sql: string, userId?: string, options?: any): Promise<QueryResult> {
    this.ensureInitialized();
    return this.unifiedQuery.executeQuery(sql, userId, options);
  }

  /**
   * Execute predefined cross-component queries
   */
  async executePredefinedQuery(queryName: string, parameters?: any, userId?: string): Promise<QueryResult> {
    this.ensureInitialized();
    return this.unifiedQuery.executePredefinedQuery(queryName, parameters, userId);
  }

  /**
   * Get comprehensive analytics across all components
   */
  async getAnalytics(userId?: string): Promise<UnifiedAnalytics> {
    this.ensureInitialized();
    return this.unifiedQuery.getUnifiedAnalytics(userId);
  }

  /**
   * Generate comprehensive Ley 27.401 compliance report
   */
  async generateComplianceReport(userId?: string): Promise<ComplianceReport> {
    this.ensureInitialized();
    return this.unifiedQuery.generateLey27401ComprehensiveReport(userId);
  }

  /**
   * Get query execution statistics and performance metrics
   */
  getQueryStatistics(): any {
    this.ensureInitialized();
    return this.unifiedQuery.getQueryStatistics();
  }

  /**
   * Get system health and status
   */
  async getSystemHealth(): Promise<any> {
    this.ensureInitialized();
    
    const analytics = await this.getAnalytics();
    const stats = this.getQueryStatistics();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      components: {
        flaisimulator: { status: 'active', health: analytics.overallHealth.flaisimulator },
        mcpServer: { status: 'active', health: analytics.overallHealth.mcpServer },
        patents: { status: 'active', health: analytics.overallHealth.patents },
        documentation: { status: 'active', health: analytics.overallHealth.documentation }
      },
      performance: {
        totalQueries: stats.total_queries,
        averageExecutionTime: stats.average_execution_time,
        activeUsers: stats.unique_users,
        overallHealth: analytics.overallHealth.overall
      },
      compliance: {
        ley27401Score: analytics.complianceMetrics.ley27401Compliance,
        p2p4Coverage: analytics.complianceMetrics.p2P4Coverage,
        legalShieldCoverage: analytics.complianceMetrics.legalShieldCoverage,
        documentationCoverage: analytics.complianceMetrics.documentationCoverage
      }
    };
  }

  /**
   * Search across all components with full-text search
   */
  async search(query: string, filters?: any, userId?: string): Promise<QueryResult> {
    this.ensureInitialized();
    
    const searchSQL = `
      SELECT 
        'documentation' as component_type,
        document_id as id,
        title,
        content_summary as summary,
        user_rating as score,
        'DOCUMENT' as result_type
      FROM documentation.documents_fts 
      WHERE documents_fts MATCH ?
      UNION ALL
      SELECT 
        'patents' as component_type,
        patent_id as id,
        patent_title as title,
        patent_abstract as summary,
        compliance_score as score,
        'PATENT' as result_type
      FROM patents.patents 
      WHERE patent_abstract LIKE '%' || ? || '%' OR patent_title LIKE '%' || ? || '%'
      ORDER BY score DESC
      LIMIT ${filters?.limit || 20}
    `;
    
    return this.query(searchSQL, userId, { searchQuery: query });
  }

  /**
   * Get dashboard data for comprehensive view
   */
  async getDashboardData(userId?: string): Promise<any> {
    this.ensureInitialized();
    
    const [analytics, health, stats] = await Promise.all([
      this.getAnalytics(userId),
      this.getSystemHealth(),
      this.getQueryStatistics()
    ]);
    
    return {
      overview: {
        totalUsers: analytics.usageMetrics.totalUsers,
        totalSessions: analytics.usageMetrics.totalSessions,
        overallHealth: analytics.overallHealth.overall,
        complianceScore: analytics.complianceMetrics.ley27401Compliance
      },
      components: health.components,
      performance: {
        queryStats: stats,
        systemHealth: health.performance
      },
      compliance: health.compliance,
      riskIndicators: analytics.riskIndicators,
      recentActivity: await this.getRecentActivity(userId)
    };
  }

  /**
   * Export data for external analysis tools
   */
  async exportData(component: string, format: 'JSON' | 'CSV' | 'SQL', filters?: any, userId?: string): Promise<any> {
    this.ensureInitialized();
    
    const tableName = this.getComponentTableName(component);
    const sql = `SELECT * FROM ${tableName} ${this.buildWhereClause(filters)} ORDER BY created_at DESC`;
    
    const result = await this.query(sql, userId);
    
    switch (format) {
      case 'JSON':
        return JSON.stringify(result.data, null, 2);
      case 'CSV':
        return this.convertToCSV(result.data);
      case 'SQL':
        return this.convertToSQL(result.data, tableName);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Cleanup and disconnect all resources
   */
  async shutdown(): Promise<void> {
    if (this.initialized) {
      await this.unifiedQuery.disconnect();
      this.initialized = false;
      console.log('🔌 IntegridAI AnyQuery Suite disconnected');
    }
  }

  // Private helper methods

  private setupEventListeners(): void {
    this.unifiedQuery.on('unified_query_executed', (result) => {
      console.log(`✅ Query executed: ${result.metadata.resultCount} results in ${result.metadata.executionTime}ms`);
    });

    this.unifiedQuery.on('unified_query_error', (error) => {
      console.error(`❌ Query error: ${error.error}`);
    });

    this.unifiedQuery.on('comprehensive_report_generated', (data) => {
      console.log(`📊 Comprehensive report generated for user: ${data.userId}`);
    });
  }

  private async ensureDataDirectories(): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const directories = [
      this.config.dataPath,
      this.config.connectors.flaisimulator.dataPath,
      this.config.connectors.mcpServer.dataPath,
      this.config.connectors.patents.dataPath,
      this.config.connectors.documentation.dataPath
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.warn(`Warning: Could not create directory ${dir}:`, error);
      }
    }
  }

  private validateConfiguration(): void {
    if (!this.config.dataPath) {
      throw new Error('Data path must be specified');
    }

    if (!this.config.connectors) {
      throw new Error('Connector configurations must be specified');
    }

    // Validate each connector config
    Object.entries(this.config.connectors).forEach(([name, config]) => {
      if (!config.dataPath) {
        throw new Error(`${name} connector must have a dataPath`);
      }
    });
  }

  private async initializeConnectors(): Promise<void> {
    // Connectors are initialized automatically by UnifiedQueryInterface
    console.log('🔗 All connectors initialized');
  }

  private getSecurityFeatures(): string[] {
    const features: string[] = [];
    
    if (this.config.auditLoggingEnabled) features.push('Audit Logging');
    if (this.config.enableCrossComponentQueries) features.push('Cross-Component Queries');
    if (this.config.cacheEnabled) features.push('Query Caching');
    
    return features.length > 0 ? features : ['Basic Security'];
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('IntegridAI AnyQuery Suite must be initialized before use');
    }
  }

  private async getRecentActivity(userId?: string): Promise<any[]> {
    const sql = `
      SELECT 
        'vaccination' as activity_type,
        vaccination_date as timestamp,
        user_id,
        scenario_name as description
      FROM flaisimulator.vaccinations
      WHERE vaccination_date >= DATE('now', '-7 days')
      ${userId ? `AND user_id = '${userId}'` : ''}
      ORDER BY vaccination_date DESC
      LIMIT 10
    `;
    
    const result = await this.query(sql);
    return result.data;
  }

  private getComponentTableName(component: string): string {
    const tableMap: {[key: string]: string} = {
      flaisimulator: 'flaisimulator.vaccinations',
      mcpServer: 'mcp_server.legal_shields',
      patents: 'patents.patents',
      documentation: 'documentation.documents'
    };
    
    return tableMap[component] || 'documentation.documents';
  }

  private buildWhereClause(filters?: any): string {
    if (!filters || Object.keys(filters).length === 0) {
      return '';
    }
    
    const conditions = Object.entries(filters)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');
    
    return `WHERE ${conditions}`;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }

  private convertToSQL(data: any[], tableName: string): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const insertStatements = data.map(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
      });
      return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});`;
    });
    
    return insertStatements.join('\n');
  }
}

// Convenience factory function
export const createIntegridAIAnyQuerySuite = (config?: Partial<UnifiedQueryConfig>): IntegridAIAnyQuerySuite => {
  return new IntegridAIAnyQuerySuite(config);
};

// Export default instance with standard configuration
export const integridAIAnyQuery = new IntegridAIAnyQuerySuite();

// Export configuration helpers
export { 
  INTEGRIDAI_ANYQUERY_CONFIG,
  getConfigForEnvironment,
  validateConfiguration,
  generateAnyQueryConfig
} from './config';

// Version information
export const VERSION = '2.0.0';
export const BUILD_DATE = new Date().toISOString();
export const SUPPORTED_ANYQUERY_VERSION = '0.4.0';

console.log(`
🚀 IntegridAI Suite AnyQuery Integration v${VERSION}
📅 Build Date: ${BUILD_DATE}
🔗 AnyQuery Compatibility: ${SUPPORTED_ANYQUERY_VERSION}
📋 Components: FLAISimulator, MCP Server, Patents, Documentation
⚖️  Legal Framework: Argentina Ley 27.401 Compliant
🛡️  Patent Protection: P2/P4 Methodologies Protected
`);

export default IntegridAIAnyQuerySuite;