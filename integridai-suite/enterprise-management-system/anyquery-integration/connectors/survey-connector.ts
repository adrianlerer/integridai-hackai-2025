/**
 * 📊 Survey Connector for IntegridAI Enterprise Management System
 * 
 * Unified SQL abstraction layer for IntegridAI Survey Results and Compliance Data
 * Integrates with encuesta-integridad survey system and compliance maturity assessments
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

import { EventEmitter } from 'events';
import { AnyqueryConnector, TableSchema, QueryResult } from '../types/anyquery-types.js';

export interface SurveyConfig {
  apiEndpoint: string;
  authToken: string;
  surveyType: 'integrity_survey' | 'compliance_maturity' | 'risk_assessment' | 'all';
  syncInterval?: number; // minutes
  cacheEnabled?: boolean;
  retryAttempts?: number;
}

export interface SurveyResponse {
  response_id: string;
  survey_type: string;
  company_name: string;
  respondent_email?: string;
  respondent_role?: string;
  sector: string;
  company_size: string;
  has_program: boolean;
  has_responsible: boolean;
  has_training: boolean;
  ai_interest_level: string;
  submission_date: string;
  compliance_maturity_score: number;
  risk_factors_identified: string[]; // JSON array as string
  recommendations_generated: string[]; // JSON array as string
  // Additional compliance fields
  ley27401_compliance_level?: string;
  last_audit_date?: string;
  next_audit_due?: string;
  vaccination_program_interest?: boolean;
  mcp_integration_ready?: boolean;
}

export interface SurveyFilters {
  survey_type?: string;
  sector?: string;
  company_size?: string;
  has_program?: boolean;
  ai_interest_level?: string;
  submission_after?: string;
  submission_before?: string;
  min_maturity_score?: number;
  max_maturity_score?: number;
  limit?: number;
  offset?: number;
}

export interface ComplianceMaturityMetrics {
  total_responses: number;
  avg_maturity_score: number;
  sector_breakdown: Record<string, number>;
  company_size_breakdown: Record<string, number>;
  program_adoption_rate: number;
  ai_interest_distribution: Record<string, number>;
  risk_factors_frequency: Record<string, number>;
}

/**
 * Survey Connector Class
 * Provides unified access to IntegridAI survey data through SQL abstraction
 */
export class SurveyConnector extends EventEmitter implements AnyqueryConnector {
  private config: SurveyConfig;
  private cache: Map<string, any> = new Map();
  private syncTimer?: NodeJS.Timeout;
  private lastSyncTimestamp: Date = new Date(0);

  constructor(config: SurveyConfig) {
    super();
    this.config = {
      syncInterval: 60, // Default 1 hour
      cacheEnabled: true,
      retryAttempts: 3,
      ...config
    };
  }

  /**
   * Initialize connection to IntegridAI Survey API
   */
  async connect(): Promise<void> {
    try {
      // Validate API connection
      await this.validateAPIConnection();
      
      // Initialize cache if enabled
      if (this.config.cacheEnabled) {
        this.initializeCache();
      }

      // Start automatic sync if enabled
      if (this.config.syncInterval && this.config.syncInterval > 0) {
        this.startAutoSync();
      }

      this.emit('connected', { 
        endpoint: this.config.apiEndpoint,
        timestamp: new Date() 
      });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get the SQL table schema for anyquery
   */
  getTableSchema(): TableSchema {
    return {
      name: 'survey_responses',
      columns: [
        { name: 'response_id', type: 'TEXT PRIMARY KEY', nullable: false },
        { name: 'survey_type', type: 'TEXT NOT NULL', nullable: false },
        { name: 'company_name', type: 'TEXT', nullable: true },
        { name: 'respondent_email', type: 'TEXT', nullable: true },
        { name: 'respondent_role', type: 'TEXT', nullable: true },
        { name: 'sector', type: 'TEXT', nullable: true },
        { name: 'company_size', type: 'TEXT', nullable: true },
        { name: 'has_program', type: 'BOOLEAN', nullable: true },
        { name: 'has_responsible', type: 'BOOLEAN', nullable: true },
        { name: 'has_training', type: 'BOOLEAN', nullable: true },
        { name: 'ai_interest_level', type: 'TEXT', nullable: true },
        { name: 'submission_date', type: 'DATETIME', nullable: false },
        { name: 'compliance_maturity_score', type: 'INTEGER', nullable: false },
        { name: 'risk_factors_identified', type: 'JSON', nullable: true },
        { name: 'recommendations_generated', type: 'JSON', nullable: true },
        { name: 'ley27401_compliance_level', type: 'TEXT', nullable: true },
        { name: 'last_audit_date', type: 'DATE', nullable: true },
        { name: 'next_audit_due', type: 'DATE', nullable: true },
        { name: 'vaccination_program_interest', type: 'BOOLEAN', nullable: true },
        { name: 'mcp_integration_ready', type: 'BOOLEAN', nullable: true },
        { name: 'last_sync', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP', nullable: false }
      ],
      indexes: [
        { name: 'idx_survey_type', columns: ['survey_type'] },
        { name: 'idx_sector', columns: ['sector'] },
        { name: 'idx_company_size', columns: ['company_size'] },
        { name: 'idx_submission_date', columns: ['submission_date'] },
        { name: 'idx_maturity_score', columns: ['compliance_maturity_score'] },
        { name: 'idx_has_program', columns: ['has_program'] },
        { name: 'idx_ai_interest', columns: ['ai_interest_level'] }
      ]
    };
  }

  /**
   * Query survey responses with filters
   */
  async querySurveyResponses(filters: SurveyFilters = {}): Promise<SurveyResponse[]> {
    try {
      const cacheKey = this.generateCacheKey('survey_responses', filters);
      
      // Check cache first if enabled
      if (this.config.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (this.isCacheValid(cached.timestamp)) {
          this.emit('cache_hit', { key: cacheKey });
          return cached.data;
        }
      }

      // Fetch from API
      const apiData = await this.fetchSurveyResponses(filters);
      const transformedData = this.transformSurveyData(apiData);
      
      // Cache results if enabled
      if (this.config.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: transformedData,
          timestamp: new Date()
        });
      }

      this.emit('query_executed', {
        filters,
        resultCount: transformedData.length,
        timestamp: new Date()
      });

      return transformedData;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Execute anyquery-compatible SQL query
   */
  async executeQuery(sql: string): Promise<QueryResult> {
    try {
      // Parse SQL to understand what data is needed
      const parsedQuery = this.parseSQL(sql);
      
      // Convert to API query parameters
      const filters = this.convertSQLToFilters(parsedQuery);
      
      // Execute query
      const results = await this.querySurveyResponses(filters);
      
      // Apply SQL-level filtering and aggregation
      const processedResults = this.applySQLOperations(results, parsedQuery);
      
      return {
        rows: processedResults,
        rowCount: processedResults.length,
        executionTime: Date.now(),
        query: sql
      };
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get compliance maturity metrics
   */
  async getComplianceMaturityMetrics(): Promise<ComplianceMaturityMetrics> {
    try {
      const allResponses = await this.querySurveyResponses({});
      
      const metrics: ComplianceMaturityMetrics = {
        total_responses: allResponses.length,
        avg_maturity_score: 0,
        sector_breakdown: {},
        company_size_breakdown: {},
        program_adoption_rate: 0,
        ai_interest_distribution: {},
        risk_factors_frequency: {}
      };

      if (allResponses.length === 0) {
        return metrics;
      }

      // Calculate average maturity score
      metrics.avg_maturity_score = allResponses.reduce(
        (sum, response) => sum + response.compliance_maturity_score, 0
      ) / allResponses.length;

      // Calculate program adoption rate
      const withPrograms = allResponses.filter(r => r.has_program).length;
      metrics.program_adoption_rate = (withPrograms / allResponses.length) * 100;

      // Sector breakdown
      allResponses.forEach(response => {
        const sector = response.sector || 'Unknown';
        metrics.sector_breakdown[sector] = (metrics.sector_breakdown[sector] || 0) + 1;
      });

      // Company size breakdown
      allResponses.forEach(response => {
        const size = response.company_size || 'Unknown';
        metrics.company_size_breakdown[size] = (metrics.company_size_breakdown[size] || 0) + 1;
      });

      // AI interest distribution
      allResponses.forEach(response => {
        const interest = response.ai_interest_level || 'Unknown';
        metrics.ai_interest_distribution[interest] = (metrics.ai_interest_distribution[interest] || 0) + 1;
      });

      // Risk factors frequency
      allResponses.forEach(response => {
        if (response.risk_factors_identified) {
          try {
            const riskFactors = JSON.parse(response.risk_factors_identified as any);
            riskFactors.forEach((factor: string) => {
              metrics.risk_factors_frequency[factor] = (metrics.risk_factors_frequency[factor] || 0) + 1;
            });
          } catch (error) {
            // Ignore parsing errors
          }
        }
      });

      return metrics;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Fetch survey responses from IntegridAI API
   */
  private async fetchSurveyResponses(filters: SurveyFilters): Promise<any[]> {
    const queryParams = new URLSearchParams();
    
    // Convert filters to API query parameters
    if (filters.survey_type) queryParams.append('survey_type', filters.survey_type);
    if (filters.sector) queryParams.append('sector', filters.sector);
    if (filters.company_size) queryParams.append('company_size', filters.company_size);
    if (filters.has_program !== undefined) queryParams.append('has_program', filters.has_program.toString());
    if (filters.ai_interest_level) queryParams.append('ai_interest', filters.ai_interest_level);
    if (filters.submission_after) queryParams.append('after', filters.submission_after);
    if (filters.submission_before) queryParams.append('before', filters.submission_before);
    if (filters.min_maturity_score) queryParams.append('min_score', filters.min_maturity_score.toString());
    if (filters.max_maturity_score) queryParams.append('max_score', filters.max_maturity_score.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.offset) queryParams.append('offset', filters.offset.toString());

    const url = `${this.config.apiEndpoint}/survey-responses?${queryParams.toString()}`;
    
    let attempts = 0;
    while (attempts < this.config.retryAttempts!) {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.config.authToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'IntegridAI-Enterprise-Management-System/2.0'
          }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data.responses || [];
      } catch (error) {
        attempts++;
        if (attempts >= this.config.retryAttempts!) {
          throw error;
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempts) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return [];
  }

  /**
   * Transform API data to standard SurveyResponse format
   */
  private transformSurveyData(apiData: any[]): SurveyResponse[] {
    return apiData.map(record => ({
      response_id: record.id || record.response_id || this.generateResponseId(),
      survey_type: record.survey_type || 'integrity_survey',
      company_name: record.company_name || record.companyName || '',
      respondent_email: record.respondent_email || record.email,
      respondent_role: record.respondent_role || record.role,
      sector: record.sector || record.industry || '',
      company_size: record.company_size || record.companySize || record.size || '',
      has_program: this.parseBoolean(record.has_program || record.hasProgram),
      has_responsible: this.parseBoolean(record.has_responsible || record.hasResponsible),
      has_training: this.parseBoolean(record.has_training || record.hasTraining),
      ai_interest_level: record.ai_interest_level || record.aiInterest || record.ai_interest || '',
      submission_date: this.parseDate(record.submission_date || record.submissionDate || record.created_at),
      compliance_maturity_score: this.calculateMaturityScore(record),
      risk_factors_identified: JSON.stringify(record.risk_factors || []),
      recommendations_generated: JSON.stringify(record.recommendations || []),
      ley27401_compliance_level: record.ley27401_compliance || this.assessLey27401Compliance(record),
      last_audit_date: this.parseDate(record.last_audit_date || record.lastAudit),
      next_audit_due: this.calculateNextAuditDue(record),
      vaccination_program_interest: this.parseBoolean(record.vaccination_interest),
      mcp_integration_ready: this.assessMCPReadiness(record),
      last_sync: new Date().toISOString()
    }));
  }

  /**
   * Calculate compliance maturity score based on survey responses
   */
  private calculateMaturityScore(response: any): number {
    let score = 0;
    
    // Base score components
    if (this.parseBoolean(response.has_program || response.hasProgram)) score += 30;
    if (this.parseBoolean(response.has_responsible || response.hasResponsible)) score += 25;
    if (this.parseBoolean(response.has_training || response.hasTraining)) score += 25;
    
    // AI interest bonus
    const aiInterest = response.ai_interest_level || response.aiInterest || response.ai_interest || '';
    if (aiInterest === 'muy_interesado' || aiInterest === 'very_interested') score += 20;
    else if (aiInterest === 'interesado' || aiInterest === 'interested') score += 10;
    
    // Company size factor (larger companies typically have more mature compliance)
    const companySize = response.company_size || response.companySize || response.size || '';
    if (companySize.includes('grande') || companySize.includes('large') || companySize.includes('enterprise')) {
      score += 10;
    } else if (companySize.includes('mediana') || companySize.includes('medium')) {
      score += 5;
    }

    // Sector risk factor
    const sector = response.sector || response.industry || '';
    const highRiskSectors = ['finance', 'banking', 'government', 'healthcare', 'energy'];
    if (highRiskSectors.some(risk => sector.toLowerCase().includes(risk))) {
      score += 5; // High-risk sectors typically have better compliance
    }

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Assess Ley 27.401 compliance level
   */
  private assessLey27401Compliance(response: any): string {
    const hasProgram = this.parseBoolean(response.has_program || response.hasProgram);
    const hasResponsible = this.parseBoolean(response.has_responsible || response.hasResponsible);
    const hasTraining = this.parseBoolean(response.has_training || response.hasTraining);
    
    if (hasProgram && hasResponsible && hasTraining) {
      return 'FULLY_COMPLIANT';
    } else if (hasProgram || hasResponsible) {
      return 'PARTIALLY_COMPLIANT';
    } else {
      return 'NON_COMPLIANT';
    }
  }

  /**
   * Calculate next audit due date
   */
  private calculateNextAuditDue(response: any): string {
    const lastAudit = this.parseDate(response.last_audit_date || response.lastAudit);
    if (lastAudit) {
      const nextAudit = new Date(lastAudit);
      nextAudit.setFullYear(nextAudit.getFullYear() + 1); // Annual audits
      return nextAudit.toISOString().split('T')[0];
    }
    
    // Default to 1 year from now if no last audit
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  }

  /**
   * Assess MCP integration readiness
   */
  private assessMCPReadiness(response: any): boolean {
    const hasProgram = this.parseBoolean(response.has_program || response.hasProgram);
    const aiInterest = response.ai_interest_level || response.aiInterest || '';
    const isInterested = aiInterest.includes('interesado') || aiInterest.includes('interested');
    
    return hasProgram && isInterested;
  }

  // Utility methods
  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return lower === 'true' || lower === 'si' || lower === 'yes' || lower === '1';
    }
    return Boolean(value);
  }

  private parseDate(value: any): string {
    if (!value) return '';
    
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  private generateResponseId(): string {
    return `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(operation: string, params: any): string {
    return `${operation}_${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: Date): boolean {
    const maxAge = 30 * 60 * 1000; // 30 minutes
    return Date.now() - timestamp.getTime() < maxAge;
  }

  private async validateAPIConnection(): Promise<void> {
    try {
      const testUrl = `${this.config.apiEndpoint}/health`;
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API validation failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to connect to IntegridAI Survey API: ${error.message}`);
    }
  }

  private initializeCache(): void {
    // Set up cache cleanup interval
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (!this.isCacheValid(value.timestamp)) {
          this.cache.delete(key);
        }
      }
    }, 5 * 60 * 1000); // Cleanup every 5 minutes
  }

  private startAutoSync(): void {
    this.syncTimer = setInterval(async () => {
      try {
        await this.syncSurveyData();
      } catch (error) {
        this.emit('error', error);
      }
    }, this.config.syncInterval! * 60 * 1000);
  }

  private async syncSurveyData(): Promise<void> {
    try {
      const syncStartTime = new Date();
      
      // Clear cache to ensure fresh data
      this.cache.clear();
      
      // Fetch latest survey responses
      const latestResponses = await this.querySurveyResponses({
        submission_after: this.lastSyncTimestamp.toISOString().split('T')[0]
      });

      this.lastSyncTimestamp = syncStartTime;
      
      this.emit('sync_completed', {
        newResponses: latestResponses.length,
        timestamp: syncStartTime
      });
    } catch (error) {
      this.emit('error', error);
    }
  }

  // Basic SQL parsing (simplified)
  private parseSQL(sql: string): any {
    // This is a simplified parser - in production, use a proper SQL parser
    return {
      type: 'SELECT',
      tables: ['survey_responses'],
      conditions: [],
      groupBy: [],
      orderBy: [],
      limit: null,
      offset: null
    };
  }

  private convertSQLToFilters(parsedQuery: any): SurveyFilters {
    // Convert parsed SQL conditions to API filters
    return {};
  }

  private applySQLOperations(data: SurveyResponse[], parsedQuery: any): SurveyResponse[] {
    // Apply SQL-level operations like GROUP BY, ORDER BY, etc.
    return data;
  }

  async disconnect(): Promise<void> {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.cache.clear();
    this.emit('disconnected', { timestamp: new Date() });
  }
}

export default SurveyConnector;