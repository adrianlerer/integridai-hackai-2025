/**
 * 💉 Vaccination Connector for IntegridAI Enterprise Management System
 * 
 * Unified SQL abstraction layer for FLAISimulator Vaccination Data
 * Integrates employee "vaccination" against corruption with compliance tracking
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

import { EventEmitter } from 'events';
import { AnyqueryConnector, TableSchema, QueryResult } from '../types/anyquery-types.js';

export interface VaccinationConfig {
  flaiSimulatorEndpoint: string;
  authToken: string;
  gameDataEndpoint?: string;
  realTimeUpdates?: boolean;
  syncInterval?: number; // minutes
  cacheEnabled?: boolean;
  retryAttempts?: number;
}

export interface VaccinationRecord {
  vaccination_id: string;
  employee_id: string;
  employee_name?: string;
  scenario_id: string;
  scenario_name: string;
  scenario_category: string;
  vaccination_date: string;
  immunity_level: number; // 0-100
  immunity_duration: number; // days
  immunity_expiry_date: string;
  risk_factors_addressed: string; // JSON array as string
  cultural_adaptations: string; // JSON array as string
  legal_evidence_generated: boolean;
  p4_reflection_applied: boolean;
  officer_protection_active: boolean;
  // Compliance tracking fields
  compliance_officer_id?: string;
  vaccination_status: 'CURRENT' | 'EXPIRED' | 'OVERDUE' | 'PENDING';
  revaccination_due_date?: string;
  effectiveness_score: number; // 0-100
  side_effects_reported: string; // JSON array as string
  booster_required: boolean;
  certification_hash?: string;
  audit_trail: string; // JSON object as string
  last_sync: string;
}

export interface VaccinationFilters {
  employee_id?: string;
  scenario_category?: string;
  vaccination_status?: 'CURRENT' | 'EXPIRED' | 'OVERDUE' | 'PENDING';
  immunity_level_min?: number;
  immunity_level_max?: number;
  vaccinated_after?: string;
  vaccinated_before?: string;
  expires_within_days?: number;
  officer_id?: string;
  requires_booster?: boolean;
  limit?: number;
  offset?: number;
}

export interface ImmunityAnalytics {
  total_vaccinations: number;
  avg_immunity_level: number;
  active_immunities: number;
  expired_immunities: number;
  overdue_revaccinations: number;
  upcoming_expirations: number; // next 30 days
  effectiveness_by_scenario: Record<string, number>;
  immunity_trends: ImmunityTrendData[];
}

export interface ImmunityTrendData {
  date: string;
  avg_immunity: number;
  new_vaccinations: number;
  expired_immunities: number;
}

export interface ScenarioEffectiveness {
  scenario_id: string;
  scenario_name: string;
  total_vaccinations: number;
  avg_effectiveness: number;
  avg_immunity_gained: number;
  cultural_adaptations_used: number;
  p4_reflections_applied: number;
}

/**
 * Vaccination Connector Class
 * Provides unified access to FLAISimulator vaccination data through SQL abstraction
 */
export class VaccinationConnector extends EventEmitter implements AnyqueryConnector {
  private config: VaccinationConfig;
  private cache: Map<string, any> = new Map();
  private syncTimer?: NodeJS.Timeout;
  private lastSyncTimestamp: Date = new Date(0);
  private websocketConnection?: WebSocket;

  constructor(config: VaccinationConfig) {
    super();
    this.config = {
      syncInterval: 30, // Default 30 minutes for real-time vaccination tracking
      cacheEnabled: true,
      retryAttempts: 3,
      realTimeUpdates: true,
      gameDataEndpoint: config.flaiSimulatorEndpoint + '/game-data',
      ...config
    };
  }

  /**
   * Initialize connection to FLAISimulator system
   */
  async connect(): Promise<void> {
    try {
      // Validate API connection
      await this.validateFLAIConnection();
      
      // Initialize cache if enabled
      if (this.config.cacheEnabled) {
        this.initializeCache();
      }

      // Set up real-time updates if enabled
      if (this.config.realTimeUpdates) {
        await this.setupRealTimeUpdates();
      }

      // Start automatic sync if enabled
      if (this.config.syncInterval && this.config.syncInterval > 0) {
        this.startAutoSync();
      }

      this.emit('connected', { 
        endpoint: this.config.flaiSimulatorEndpoint,
        realTime: this.config.realTimeUpdates,
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
      name: 'vaccinations',
      columns: [
        { name: 'vaccination_id', type: 'TEXT PRIMARY KEY', nullable: false },
        { name: 'employee_id', type: 'TEXT NOT NULL', nullable: false },
        { name: 'employee_name', type: 'TEXT', nullable: true },
        { name: 'scenario_id', type: 'TEXT NOT NULL', nullable: false },
        { name: 'scenario_name', type: 'TEXT', nullable: false },
        { name: 'scenario_category', type: 'TEXT', nullable: true },
        { name: 'vaccination_date', type: 'DATETIME NOT NULL', nullable: false },
        { name: 'immunity_level', type: 'INTEGER', nullable: false },
        { name: 'immunity_duration', type: 'INTEGER', nullable: false },
        { name: 'immunity_expiry_date', type: 'DATE', nullable: false },
        { name: 'risk_factors_addressed', type: 'JSON', nullable: true },
        { name: 'cultural_adaptations', type: 'JSON', nullable: true },
        { name: 'legal_evidence_generated', type: 'BOOLEAN DEFAULT FALSE', nullable: false },
        { name: 'p4_reflection_applied', type: 'BOOLEAN DEFAULT FALSE', nullable: false },
        { name: 'officer_protection_active', type: 'BOOLEAN DEFAULT FALSE', nullable: false },
        { name: 'compliance_officer_id', type: 'TEXT', nullable: true },
        { name: 'vaccination_status', type: 'TEXT', nullable: false },
        { name: 'revaccination_due_date', type: 'DATE', nullable: true },
        { name: 'effectiveness_score', type: 'INTEGER', nullable: false },
        { name: 'side_effects_reported', type: 'JSON', nullable: true },
        { name: 'booster_required', type: 'BOOLEAN DEFAULT FALSE', nullable: false },
        { name: 'certification_hash', type: 'TEXT', nullable: true },
        { name: 'audit_trail', type: 'JSON', nullable: true },
        { name: 'last_sync', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP', nullable: false }
      ],
      indexes: [
        { name: 'idx_employee_id', columns: ['employee_id'] },
        { name: 'idx_scenario_id', columns: ['scenario_id'] },
        { name: 'idx_vaccination_date', columns: ['vaccination_date'] },
        { name: 'idx_immunity_level', columns: ['immunity_level'] },
        { name: 'idx_expiry_date', columns: ['immunity_expiry_date'] },
        { name: 'idx_status', columns: ['vaccination_status'] },
        { name: 'idx_officer_id', columns: ['compliance_officer_id'] },
        { name: 'idx_booster_required', columns: ['booster_required'] }
      ]
    };
  }

  /**
   * Query vaccination records with filters
   */
  async queryVaccinations(filters: VaccinationFilters = {}): Promise<VaccinationRecord[]> {
    try {
      const cacheKey = this.generateCacheKey('vaccinations', filters);
      
      // Check cache first if enabled
      if (this.config.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (this.isCacheValid(cached.timestamp)) {
          this.emit('cache_hit', { key: cacheKey });
          return cached.data;
        }
      }

      // Fetch from FLAISimulator API
      const flaiData = await this.fetchVaccinationData(filters);
      const transformedData = this.transformVaccinationData(flaiData);
      
      // Update vaccination status based on current date
      const updatedData = this.updateVaccinationStatus(transformedData);
      
      // Cache results if enabled
      if (this.config.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: updatedData,
          timestamp: new Date()
        });
      }

      this.emit('query_executed', {
        filters,
        resultCount: updatedData.length,
        timestamp: new Date()
      });

      return updatedData;
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
      const results = await this.queryVaccinations(filters);
      
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
   * Get immunity analytics and insights
   */
  async getImmunityAnalytics(): Promise<ImmunityAnalytics> {
    try {
      const allVaccinations = await this.queryVaccinations({});
      
      const analytics: ImmunityAnalytics = {
        total_vaccinations: allVaccinations.length,
        avg_immunity_level: 0,
        active_immunities: 0,
        expired_immunities: 0,
        overdue_revaccinations: 0,
        upcoming_expirations: 0,
        effectiveness_by_scenario: {},
        immunity_trends: []
      };

      if (allVaccinations.length === 0) {
        return analytics;
      }

      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));

      // Calculate basic metrics
      analytics.avg_immunity_level = allVaccinations.reduce(
        (sum, vac) => sum + vac.immunity_level, 0
      ) / allVaccinations.length;

      // Count status categories
      allVaccinations.forEach(vaccination => {
        switch (vaccination.vaccination_status) {
          case 'CURRENT':
            analytics.active_immunities++;
            break;
          case 'EXPIRED':
            analytics.expired_immunities++;
            break;
          case 'OVERDUE':
            analytics.overdue_revaccinations++;
            break;
        }

        // Check upcoming expirations
        const expiryDate = new Date(vaccination.immunity_expiry_date);
        if (expiryDate <= thirtyDaysFromNow && expiryDate > now) {
          analytics.upcoming_expirations++;
        }
      });

      // Calculate effectiveness by scenario
      const scenarioMap = new Map<string, { total: number; effectiveness: number }>();
      
      allVaccinations.forEach(vaccination => {
        const scenarioId = vaccination.scenario_id;
        if (!scenarioMap.has(scenarioId)) {
          scenarioMap.set(scenarioId, { total: 0, effectiveness: 0 });
        }
        
        const scenario = scenarioMap.get(scenarioId)!;
        scenario.total++;
        scenario.effectiveness += vaccination.effectiveness_score;
      });

      scenarioMap.forEach((data, scenarioId) => {
        analytics.effectiveness_by_scenario[scenarioId] = data.effectiveness / data.total;
      });

      // Generate immunity trends (last 30 days)
      analytics.immunity_trends = await this.generateImmunityTrends(allVaccinations);

      return analytics;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get scenario effectiveness analysis
   */
  async getScenarioEffectiveness(): Promise<ScenarioEffectiveness[]> {
    try {
      const allVaccinations = await this.queryVaccinations({});
      const scenarioMap = new Map<string, {
        name: string;
        vaccinations: VaccinationRecord[];
      }>();

      // Group vaccinations by scenario
      allVaccinations.forEach(vaccination => {
        const scenarioId = vaccination.scenario_id;
        if (!scenarioMap.has(scenarioId)) {
          scenarioMap.set(scenarioId, {
            name: vaccination.scenario_name,
            vaccinations: []
          });
        }
        scenarioMap.get(scenarioId)!.vaccinations.push(vaccination);
      });

      // Calculate effectiveness metrics for each scenario
      const effectiveness: ScenarioEffectiveness[] = [];
      
      scenarioMap.forEach((data, scenarioId) => {
        const vaccinations = data.vaccinations;
        const totalVaccinations = vaccinations.length;
        
        const avgEffectiveness = vaccinations.reduce(
          (sum, vac) => sum + vac.effectiveness_score, 0
        ) / totalVaccinations;
        
        const avgImmunity = vaccinations.reduce(
          (sum, vac) => sum + vac.immunity_level, 0
        ) / totalVaccinations;
        
        const culturalAdaptations = vaccinations.filter(vac => {
          try {
            const adaptations = JSON.parse(vac.cultural_adaptations);
            return Array.isArray(adaptations) && adaptations.length > 0;
          } catch {
            return false;
          }
        }).length;
        
        const p4Reflections = vaccinations.filter(vac => vac.p4_reflection_applied).length;

        effectiveness.push({
          scenario_id: scenarioId,
          scenario_name: data.name,
          total_vaccinations: totalVaccinations,
          avg_effectiveness: Math.round(avgEffectiveness),
          avg_immunity_gained: Math.round(avgImmunity),
          cultural_adaptations_used: culturalAdaptations,
          p4_reflections_applied: p4Reflections
        });
      });

      // Sort by effectiveness
      return effectiveness.sort((a, b) => b.avg_effectiveness - a.avg_effectiveness);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get employees requiring revaccination
   */
  async getRevaccinationQueue(): Promise<VaccinationRecord[]> {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));

    return this.queryVaccinations({
      vaccination_status: 'EXPIRED'
    }).then(expired => {
      return this.queryVaccinations({
        expires_within_days: 30
      }).then(expiring => {
        // Combine and deduplicate
        const allRequiring = [...expired, ...expiring];
        const uniqueEmployees = new Map<string, VaccinationRecord>();
        
        allRequiring.forEach(vaccination => {
          const employeeId = vaccination.employee_id;
          if (!uniqueEmployees.has(employeeId) || 
              new Date(vaccination.vaccination_date) > new Date(uniqueEmployees.get(employeeId)!.vaccination_date)) {
            uniqueEmployees.set(employeeId, vaccination);
          }
        });

        return Array.from(uniqueEmployees.values())
          .sort((a, b) => new Date(a.immunity_expiry_date).getTime() - new Date(b.immunity_expiry_date).getTime());
      });
    });
  }

  /**
   * Fetch vaccination data from FLAISimulator API
   */
  private async fetchVaccinationData(filters: VaccinationFilters): Promise<any[]> {
    const queryParams = new URLSearchParams();
    
    // Convert filters to API query parameters
    if (filters.employee_id) queryParams.append('employee_id', filters.employee_id);
    if (filters.scenario_category) queryParams.append('category', filters.scenario_category);
    if (filters.vaccination_status) queryParams.append('status', filters.vaccination_status);
    if (filters.immunity_level_min) queryParams.append('min_immunity', filters.immunity_level_min.toString());
    if (filters.immunity_level_max) queryParams.append('max_immunity', filters.immunity_level_max.toString());
    if (filters.vaccinated_after) queryParams.append('after', filters.vaccinated_after);
    if (filters.vaccinated_before) queryParams.append('before', filters.vaccinated_before);
    if (filters.expires_within_days) queryParams.append('expires_in', filters.expires_within_days.toString());
    if (filters.officer_id) queryParams.append('officer_id', filters.officer_id);
    if (filters.requires_booster !== undefined) queryParams.append('booster_required', filters.requires_booster.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.offset) queryParams.append('offset', filters.offset.toString());

    const url = `${this.config.gameDataEndpoint}/vaccinations?${queryParams.toString()}`;
    
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
          throw new Error(`FLAISimulator API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data.vaccinations || [];
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
   * Transform FLAISimulator data to standard VaccinationRecord format
   */
  private transformVaccinationData(flaiData: any[]): VaccinationRecord[] {
    return flaiData.map(record => {
      const vaccinationDate = new Date(record.timestamp || record.vaccination_date || record.created_at);
      const immunityDuration = record.immunity_duration || this.calculateImmunityDuration(record);
      const expiryDate = new Date(vaccinationDate.getTime() + (immunityDuration * 24 * 60 * 60 * 1000));
      
      return {
        vaccination_id: record.vaccination_id || record.id || this.generateVaccinationId(),
        employee_id: record.employee_id || record.employeeId,
        employee_name: record.employee_name || record.employeeName,
        scenario_id: record.scenario_id || record.scenarioId,
        scenario_name: record.scenario_name || record.scenarioName || 'Unknown Scenario',
        scenario_category: record.scenario_category || this.inferScenarioCategory(record),
        vaccination_date: vaccinationDate.toISOString(),
        immunity_level: record.immunity_level || record.immunityLevel || 0,
        immunity_duration: immunityDuration,
        immunity_expiry_date: expiryDate.toISOString().split('T')[0],
        risk_factors_addressed: JSON.stringify(record.risk_factors || record.riskFactors || []),
        cultural_adaptations: JSON.stringify(record.cultural_context || record.culturalAdaptations || []),
        legal_evidence_generated: Boolean(record.legal_evidence?.generated || record.legalEvidence),
        p4_reflection_applied: Boolean(record.p4_analysis?.applied || record.p4Reflection),
        officer_protection_active: Boolean(record.officer_protection?.active || record.officerProtection),
        compliance_officer_id: record.compliance_officer_id || record.complianceOfficerId,
        vaccination_status: 'CURRENT', // Will be updated by updateVaccinationStatus
        revaccination_due_date: undefined, // Will be calculated
        effectiveness_score: record.effectiveness_score || this.calculateEffectiveness(record),
        side_effects_reported: JSON.stringify(record.side_effects || []),
        booster_required: false, // Will be calculated
        certification_hash: record.certification_hash || this.generateCertificationHash(record),
        audit_trail: JSON.stringify(record.audit_trail || this.generateAuditTrail(record)),
        last_sync: new Date().toISOString()
      };
    });
  }

  /**
   * Update vaccination status based on current date and business rules
   */
  private updateVaccinationStatus(vaccinations: VaccinationRecord[]): VaccinationRecord[] {
    const now = new Date();
    
    return vaccinations.map(vaccination => {
      const expiryDate = new Date(vaccination.immunity_expiry_date);
      const warningPeriod = new Date(expiryDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days before expiry
      
      if (expiryDate <= now) {
        vaccination.vaccination_status = 'EXPIRED';
        vaccination.revaccination_due_date = now.toISOString().split('T')[0];
        vaccination.booster_required = true;
      } else if (warningPeriod <= now) {
        vaccination.vaccination_status = 'CURRENT';
        vaccination.revaccination_due_date = expiryDate.toISOString().split('T')[0];
        vaccination.booster_required = true;
      } else {
        vaccination.vaccination_status = 'CURRENT';
        vaccination.booster_required = false;
      }

      // Check if immunity level is below threshold
      if (vaccination.immunity_level < 60) {
        vaccination.booster_required = true;
        if (vaccination.vaccination_status === 'CURRENT') {
          vaccination.vaccination_status = 'OVERDUE';
        }
      }

      return vaccination;
    });
  }

  // Utility methods
  private calculateImmunityDuration(record: any): number {
    // Default immunity duration based on scenario complexity
    const scenarioName = record.scenario_name || record.scenarioName || '';
    
    if (scenarioName.toLowerCase().includes('complex') || scenarioName.toLowerCase().includes('advanced')) {
      return 180; // 6 months for complex scenarios
    } else if (scenarioName.toLowerCase().includes('basic') || scenarioName.toLowerCase().includes('simple')) {
      return 90; // 3 months for basic scenarios
    }
    
    return 120; // Default 4 months
  }

  private inferScenarioCategory(record: any): string {
    const scenarioName = (record.scenario_name || record.scenarioName || '').toLowerCase();
    
    if (scenarioName.includes('gift') || scenarioName.includes('regalo')) return 'gifts_hospitality';
    if (scenarioName.includes('brib') || scenarioName.includes('cohecho')) return 'bribery';
    if (scenarioName.includes('conflict') || scenarioName.includes('conflicto')) return 'conflict_of_interest';
    if (scenarioName.includes('procurement') || scenarioName.includes('compra')) return 'procurement';
    if (scenarioName.includes('financial') || scenarioName.includes('financiero')) return 'financial_fraud';
    
    return 'general_compliance';
  }

  private calculateEffectiveness(record: any): number {
    let effectiveness = record.immunity_level || 0;
    
    // Boost effectiveness if P4 reflection was applied
    if (record.p4_analysis?.applied || record.p4Reflection) {
      effectiveness = Math.min(effectiveness + 10, 100);
    }
    
    // Boost for cultural adaptations
    if (record.cultural_context && Array.isArray(record.cultural_context) && record.cultural_context.length > 0) {
      effectiveness = Math.min(effectiveness + 5, 100);
    }
    
    // Boost for legal evidence generation
    if (record.legal_evidence?.generated || record.legalEvidence) {
      effectiveness = Math.min(effectiveness + 5, 100);
    }
    
    return effectiveness;
  }

  private generateVaccinationId(): string {
    return `vac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCertificationHash(record: any): string {
    // Generate a simple hash for the certification
    const data = JSON.stringify({
      employee_id: record.employee_id || record.employeeId,
      scenario_id: record.scenario_id || record.scenarioId,
      timestamp: record.timestamp || record.vaccination_date,
      immunity_level: record.immunity_level || record.immunityLevel
    });
    
    // Simple hash function (in production, use crypto.createHash)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `cert_${Math.abs(hash).toString(16)}`;
  }

  private generateAuditTrail(record: any): any {
    return {
      vaccination_timestamp: record.timestamp || new Date().toISOString(),
      scenario_completed: true,
      immunity_granted: record.immunity_level || 0,
      officer_involved: Boolean(record.compliance_officer_id || record.complianceOfficerId),
      legal_protection_enabled: Boolean(record.officer_protection?.active),
      p4_reflection_completed: Boolean(record.p4_analysis?.applied),
      cultural_adaptations_count: Array.isArray(record.cultural_context) ? record.cultural_context.length : 0,
      created_by: 'FLAISimulator',
      created_at: new Date().toISOString()
    };
  }

  private async generateImmunityTrends(vaccinations: VaccinationRecord[]): Promise<ImmunityTrendData[]> {
    const trends: ImmunityTrendData[] = [];
    const now = new Date();
    
    // Generate data for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      
      // Vaccinations on this date
      const dayVaccinations = vaccinations.filter(vac => 
        vac.vaccination_date.split('T')[0] === dateStr
      );
      
      // Expired immunities on this date
      const expiredOnDate = vaccinations.filter(vac =>
        vac.immunity_expiry_date === dateStr
      );
      
      // Average immunity for active vaccinations
      const activeVaccinations = vaccinations.filter(vac => {
        const vacDate = new Date(vac.vaccination_date);
        const expDate = new Date(vac.immunity_expiry_date);
        return vacDate <= date && expDate > date;
      });
      
      const avgImmunity = activeVaccinations.length > 0 
        ? activeVaccinations.reduce((sum, vac) => sum + vac.immunity_level, 0) / activeVaccinations.length
        : 0;
      
      trends.push({
        date: dateStr,
        avg_immunity: Math.round(avgImmunity),
        new_vaccinations: dayVaccinations.length,
        expired_immunities: expiredOnDate.length
      });
    }
    
    return trends;
  }

  private generateCacheKey(operation: string, params: any): string {
    return `${operation}_${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: Date): boolean {
    const maxAge = 15 * 60 * 1000; // 15 minutes for vaccination data (more frequent updates needed)
    return Date.now() - timestamp.getTime() < maxAge;
  }

  private async validateFLAIConnection(): Promise<void> {
    try {
      const testUrl = `${this.config.flaiSimulatorEndpoint}/health`;
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`FLAISimulator API validation failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to connect to FLAISimulator API: ${error.message}`);
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

  private async setupRealTimeUpdates(): Promise<void> {
    try {
      const wsUrl = this.config.flaiSimulatorEndpoint.replace('http', 'ws') + '/ws/vaccinations';
      this.websocketConnection = new WebSocket(wsUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.authToken}`
        }
      } as any);

      this.websocketConnection.onopen = () => {
        this.emit('realtime_connected');
      };

      this.websocketConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealTimeUpdate(data);
        } catch (error) {
          this.emit('error', error);
        }
      };

      this.websocketConnection.onerror = (error) => {
        this.emit('error', error);
      };

      this.websocketConnection.onclose = () => {
        this.emit('realtime_disconnected');
        // Attempt reconnection after 5 seconds
        setTimeout(() => this.setupRealTimeUpdates(), 5000);
      };
    } catch (error) {
      // Real-time updates are optional, continue without them
      console.warn('Real-time updates unavailable:', error);
    }
  }

  private handleRealTimeUpdate(data: any): void {
    // Clear cache to ensure fresh data on next query
    this.cache.clear();
    
    this.emit('vaccination_update', {
      type: data.type,
      employee_id: data.employee_id,
      vaccination_id: data.vaccination_id,
      timestamp: new Date()
    });
  }

  private startAutoSync(): void {
    this.syncTimer = setInterval(async () => {
      try {
        await this.syncVaccinationData();
      } catch (error) {
        this.emit('error', error);
      }
    }, this.config.syncInterval! * 60 * 1000);
  }

  private async syncVaccinationData(): Promise<void> {
    try {
      const syncStartTime = new Date();
      
      // Clear cache to ensure fresh data
      this.cache.clear();
      
      // Fetch latest vaccination records
      const latestVaccinations = await this.queryVaccinations({
        vaccinated_after: this.lastSyncTimestamp.toISOString().split('T')[0]
      });

      this.lastSyncTimestamp = syncStartTime;
      
      this.emit('sync_completed', {
        newVaccinations: latestVaccinations.length,
        timestamp: syncStartTime
      });
    } catch (error) {
      this.emit('error', error);
    }
  }

  // Basic SQL parsing (simplified)
  private parseSQL(sql: string): any {
    return {
      type: 'SELECT',
      tables: ['vaccinations'],
      conditions: [],
      groupBy: [],
      orderBy: [],
      limit: null,
      offset: null
    };
  }

  private convertSQLToFilters(parsedQuery: any): VaccinationFilters {
    return {};
  }

  private applySQLOperations(data: VaccinationRecord[], parsedQuery: any): VaccinationRecord[] {
    return data;
  }

  async disconnect(): Promise<void> {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    if (this.websocketConnection) {
      this.websocketConnection.close();
    }
    
    this.cache.clear();
    this.emit('disconnected', { timestamp: new Date() });
  }
}

export default VaccinationConnector;