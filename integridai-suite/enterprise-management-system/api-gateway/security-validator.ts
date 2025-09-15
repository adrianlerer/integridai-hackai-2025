/**
 * 🛡️ Security Validator for IntegridAI Enterprise Management System
 * 
 * Query security validation and access control
 * Implements row-level security and compliance validation
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Commercial - Patent Protected
 */

import express from 'express';

export interface SecurityValidationResult {
  approved: boolean;
  reason?: string;
  modifications?: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UserContext {
  userId: string;
  roles: string[];
  permissions: string[];
  department?: string;
  dataAccessLevel: 'NONE' | 'READ' | 'WRITE' | 'ADMIN';
  sessionId?: string;
}

export interface QuerySecurityCheck {
  sqlInjection: boolean;
  dangerousOperations: boolean;
  unauthorizedTables: boolean;
  dataExfiltration: boolean;
  privacyViolation: boolean;
}

/**
 * Security Validator Class
 */
export class SecurityValidator {
  private readonly SQL_INJECTION_PATTERNS = [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b.*\bVALUES\b.*\bSELECT\b)/i,
    /(\bUPDATE\b.*\bSET\b.*=.*\bSELECT\b)/i,
    /(\bDELETE\b.*\bFROM\b.*\bWHERE\b.*=.*\bSELECT\b)/i,
    /(\';.*--;)/i,
    /(\bEXEC\b|\bEXECUTE\b)/i,
    /(\bxp_cmdshell\b)/i,
    /(\bsp_executesql\b)/i
  ];

  private readonly DANGEROUS_OPERATIONS = [
    /\bDROP\s+(?:TABLE|DATABASE|INDEX|VIEW|PROCEDURE|FUNCTION)\b/i,
    /\bTRUNCATE\s+TABLE\b/i,
    /\bALTER\s+(?:TABLE|DATABASE|INDEX)\b/i,
    /\bCREATE\s+(?:TABLE|DATABASE|INDEX|VIEW|PROCEDURE|FUNCTION)\b/i,
    /\bDELETE\s+FROM.*WHERE\s+1\s*=\s*1/i,
    /\bUPDATE.*SET.*WHERE\s+1\s*=\s*1/i,
    /\bGRANT\b|\bREVOKE\b/i,
    /\bSHUTDOWN\b|\bRESTART\b/i
  ];

  private readonly UNAUTHORIZED_TABLES = [
    'system_users',
    'passwords',
    'secrets',
    'keys',
    'tokens',
    'credit_cards',
    'ssn',
    'personal_data'
  ];

  private readonly PII_FIELDS = [
    'ssn',
    'social_security_number',
    'credit_card',
    'password',
    'personal_email',
    'phone_number',
    'address',
    'salary',
    'bank_account'
  ];

  /**
   * Authenticate request
   */
  async authenticate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // Skip authentication for health check and public endpoints
      if (req.path === '/api/health' || req.path.startsWith('/public/')) {
        return next();
      }

      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({ error: 'Authorization header required' });
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      const userContext = await this.validateToken(token);
      
      if (!userContext) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }

      // Add user context to request
      (req as any).userContext = userContext;
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Authentication error', message: error.message });
    }
  }

  /**
   * Validate SQL query for security risks
   */
  async validateQuery(sql: string, securityContext?: string): Promise<SecurityValidationResult> {
    try {
      const checks = await this.performSecurityChecks(sql);
      const riskLevel = this.calculateRiskLevel(checks);
      
      // Check for SQL injection
      if (checks.sqlInjection) {
        return {
          approved: false,
          reason: 'Potential SQL injection detected',
          riskLevel: 'CRITICAL'
        };
      }

      // Check for dangerous operations
      if (checks.dangerousOperations) {
        return {
          approved: false,
          reason: 'Dangerous SQL operation detected',
          riskLevel: 'CRITICAL'
        };
      }

      // Check for unauthorized table access
      if (checks.unauthorizedTables) {
        return {
          approved: false,
          reason: 'Unauthorized table access attempted',
          riskLevel: 'HIGH'
        };
      }

      // Check for data exfiltration patterns
      if (checks.dataExfiltration) {
        return {
          approved: false,
          reason: 'Potential data exfiltration pattern detected',
          riskLevel: 'HIGH'
        };
      }

      // Check for privacy violations
      if (checks.privacyViolation) {
        return {
          approved: false,
          reason: 'Privacy violation detected - PII fields accessed without permission',
          riskLevel: 'HIGH'
        };
      }

      // Query approved with potential modifications
      const modifications = await this.suggestSecurityModifications(sql);

      return {
        approved: true,
        riskLevel,
        modifications: modifications.length > 0 ? modifications : undefined
      };

    } catch (error) {
      return {
        approved: false,
        reason: `Security validation error: ${error.message}`,
        riskLevel: 'CRITICAL'
      };
    }
  }

  /**
   * Validate user permissions for specific resource
   */
  async validatePermissions(userContext: UserContext, resource: string, action: string): Promise<boolean> {
    try {
      // Admin users have all permissions
      if (userContext.roles.includes('admin')) {
        return true;
      }

      // Check data access level
      if (action === 'read' && userContext.dataAccessLevel === 'NONE') {
        return false;
      }

      if (action === 'write' && !['WRITE', 'ADMIN'].includes(userContext.dataAccessLevel)) {
        return false;
      }

      // Check specific permissions
      const requiredPermission = `${resource}:${action}`;
      if (userContext.permissions.includes(requiredPermission)) {
        return true;
      }

      // Check role-based permissions
      return await this.checkRoleBasedPermissions(userContext.roles, resource, action);

    } catch (error) {
      console.error('Permission validation error:', error);
      return false;
    }
  }

  /**
   * Apply row-level security filters
   */
  async applyRowLevelSecurity(sql: string, userContext: UserContext): Promise<string> {
    try {
      let securedSql = sql;

      // Apply department restrictions for non-admin users
      if (!userContext.roles.includes('admin') && userContext.department) {
        if (sql.toLowerCase().includes('from employees')) {
          securedSql = this.addDepartmentFilter(securedSql, userContext.department);
        }
      }

      // Apply data access level restrictions
      if (userContext.dataAccessLevel === 'READ') {
        securedSql = this.addReadOnlyConstraints(securedSql);
      }

      // Remove PII fields for unauthorized users
      if (!userContext.permissions.includes('pii:read')) {
        securedSql = this.removePIIFields(securedSql);
      }

      return securedSql;

    } catch (error) {
      throw new Error(`Row-level security application failed: ${error.message}`);
    }
  }

  /**
   * Validate data privacy compliance
   */
  async validatePrivacyCompliance(sql: string, userContext: UserContext): Promise<boolean> {
    try {
      // Check for PII field access without proper permissions
      const piiFieldsInQuery = this.extractPIIFields(sql);
      
      if (piiFieldsInQuery.length > 0 && !userContext.permissions.includes('pii:read')) {
        return false;
      }

      // Check for bulk data export patterns
      if (this.isBulkExportPattern(sql) && !userContext.permissions.includes('export:bulk')) {
        return false;
      }

      // Check for cross-department data access
      if (this.isCrossDepartmentAccess(sql, userContext)) {
        return false;
      }

      return true;

    } catch (error) {
      console.error('Privacy compliance validation error:', error);
      return false;
    }
  }

  // Private helper methods

  private async validateToken(token: string): Promise<UserContext | null> {
    try {
      // Mock token validation - in production, validate against JWT/OAuth
      if (token === 'demo-token' || token === 'system-token') {
        return {
          userId: 'demo-user',
          roles: ['user'],
          permissions: ['employees:read', 'vaccinations:read', 'dashboard:read'],
          department: 'IT',
          dataAccessLevel: 'READ'
        };
      }

      if (token === 'admin-token') {
        return {
          userId: 'admin-user',
          roles: ['admin'],
          permissions: ['*:*'],
          dataAccessLevel: 'ADMIN'
        };
      }

      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  private async performSecurityChecks(sql: string): Promise<QuerySecurityCheck> {
    return {
      sqlInjection: this.checkSQLInjection(sql),
      dangerousOperations: this.checkDangerousOperations(sql),
      unauthorizedTables: this.checkUnauthorizedTables(sql),
      dataExfiltration: this.checkDataExfiltration(sql),
      privacyViolation: this.checkPrivacyViolation(sql)
    };
  }

  private checkSQLInjection(sql: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(sql));
  }

  private checkDangerousOperations(sql: string): boolean {
    return this.DANGEROUS_OPERATIONS.some(pattern => pattern.test(sql));
  }

  private checkUnauthorizedTables(sql: string): boolean {
    const lowerSql = sql.toLowerCase();
    return this.UNAUTHORIZED_TABLES.some(table => 
      lowerSql.includes(`from ${table}`) || 
      lowerSql.includes(`join ${table}`) ||
      lowerSql.includes(`update ${table}`) ||
      lowerSql.includes(`insert into ${table}`)
    );
  }

  private checkDataExfiltration(sql: string): boolean {
    // Check for patterns that suggest bulk data export
    const exfiltrationPatterns = [
      /SELECT\s+\*\s+FROM\s+\w+\s*(?:WHERE\s+1\s*=\s*1)?(?:;\s*--)?$/i,
      /SELECT\s+.+\s+FROM\s+\w+\s+LIMIT\s+(?:9999|10000|\d{5,})/i,
      /UNION\s+SELECT/i
    ];

    return exfiltrationPatterns.some(pattern => pattern.test(sql));
  }

  private checkPrivacyViolation(sql: string): boolean {
    const lowerSql = sql.toLowerCase();
    return this.PII_FIELDS.some(field => lowerSql.includes(field));
  }

  private calculateRiskLevel(checks: QuerySecurityCheck): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (checks.sqlInjection || checks.dangerousOperations) {
      return 'CRITICAL';
    }

    if (checks.unauthorizedTables || checks.dataExfiltration) {
      return 'HIGH';
    }

    if (checks.privacyViolation) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  private async suggestSecurityModifications(sql: string): Promise<string[]> {
    const modifications: string[] = [];

    // Suggest LIMIT clause for large queries
    if (!sql.toUpperCase().includes('LIMIT') && sql.toUpperCase().includes('SELECT')) {
      modifications.push('Consider adding LIMIT clause to prevent large result sets');
    }

    // Suggest parameterized queries
    if (sql.includes("'") && !sql.includes('$1')) {
      modifications.push('Consider using parameterized queries to prevent SQL injection');
    }

    // Suggest specific column selection instead of SELECT *
    if (sql.includes('SELECT *')) {
      modifications.push('Consider selecting specific columns instead of SELECT *');
    }

    return modifications;
  }

  private async checkRoleBasedPermissions(roles: string[], resource: string, action: string): Promise<boolean> {
    // Mock role-based permission check
    const rolePermissions: Record<string, string[]> = {
      'compliance_officer': ['employees:read', 'vaccinations:read', 'vaccinations:write', 'reports:generate'],
      'hr_manager': ['employees:read', 'employees:write', 'vaccinations:read'],
      'department_manager': ['employees:read', 'vaccinations:read', 'dashboard:read'],
      'user': ['dashboard:read', 'employees:read']
    };

    const requiredPermission = `${resource}:${action}`;
    
    return roles.some(role => 
      rolePermissions[role]?.includes(requiredPermission) || 
      rolePermissions[role]?.includes('*:*')
    );
  }

  private addDepartmentFilter(sql: string, department: string): string {
    // Add department filter to employee queries
    if (sql.toLowerCase().includes('from employees')) {
      const whereIndex = sql.toLowerCase().indexOf('where');
      
      if (whereIndex === -1) {
        // Add WHERE clause
        return sql.replace(/from employees/i, `from employees WHERE department = '${department}'`);
      } else {
        // Add to existing WHERE clause
        return sql.replace(/where/i, `WHERE department = '${department}' AND `);
      }
    }

    return sql;
  }

  private addReadOnlyConstraints(sql: string): string {
    // Ensure only SELECT queries are allowed for read-only users
    const queryType = sql.trim().toUpperCase().split(' ')[0];
    
    if (!['SELECT', 'EXPLAIN', 'SHOW', 'DESCRIBE'].includes(queryType)) {
      throw new Error('Only read operations are permitted for this user');
    }

    return sql;
  }

  private removePIIFields(sql: string): string {
    let modifiedSql = sql;

    // Remove PII fields from SELECT clause
    this.PII_FIELDS.forEach(field => {
      const fieldPattern = new RegExp(`\\b${field}\\b`, 'gi');
      modifiedSql = modifiedSql.replace(fieldPattern, `'[REDACTED]' as ${field}`);
    });

    return modifiedSql;
  }

  private extractPIIFields(sql: string): string[] {
    const foundFields: string[] = [];
    const lowerSql = sql.toLowerCase();

    this.PII_FIELDS.forEach(field => {
      if (lowerSql.includes(field.toLowerCase())) {
        foundFields.push(field);
      }
    });

    return foundFields;
  }

  private isBulkExportPattern(sql: string): boolean {
    // Check for patterns that suggest bulk data export
    const bulkPatterns = [
      /SELECT\s+\*\s+FROM/i,
      /LIMIT\s+(?:9999|10000|\d{5,})/i,
      /WHERE\s+1\s*=\s*1/i
    ];

    return bulkPatterns.some(pattern => pattern.test(sql));
  }

  private isCrossDepartmentAccess(sql: string, userContext: UserContext): boolean {
    // Check if query tries to access data from other departments
    if (!userContext.department || userContext.roles.includes('admin')) {
      return false;
    }

    // If query doesn't filter by department and user has department restrictions
    const hasWhere = sql.toLowerCase().includes('where');
    const hasDepartmentFilter = sql.toLowerCase().includes('department');

    return hasWhere && !hasDepartmentFilter && sql.toLowerCase().includes('from employees');
  }
}

export default SecurityValidator;