import crypto from 'crypto';
import { findRunByIdempotencyKey, createIdempotencyRecord } from './db';

export class IdempotencyManager {
  /**
   * Generate idempotency key from input parameters
   */
  static generateKey(toolName: string, inputParams: any, userId?: string): string {
    // Sanitize input params by removing sensitive data and normalizing
    const sanitizedParams = this.sanitizeInputParams(inputParams);
    
    // Create deterministic hash
    const dataToHash = {
      tool: toolName,
      params: sanitizedParams,
      userId: userId || 'anonymous',
    };
    
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(dataToHash))
      .digest('hex');
    
    return `${toolName}_${hash.substring(0, 16)}`;
  }

  /**
   * Check if a run already exists for this idempotency key
   */
  static async checkExistingRun(idempotencyKey: string) {
    return await findRunByIdempotencyKey(idempotencyKey);
  }

  /**
   * Create idempotency record for a new run
   */
  static async createRecord(idempotencyKey: string, runId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour TTL

    return await createIdempotencyRecord({
      idempotencyKey,
      runId,
      expiresAt,
    });
  }

  /**
   * Sanitize input parameters for hashing
   * Removes sensitive data and normalizes structure
   */
  private static sanitizeInputParams(params: any): any {
    if (typeof params !== 'object' || params === null) {
      return params;
    }

    const sanitized = { ...params };
    
    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'token', 'apiKey', 'secret', 'credential',
      'authorization', 'auth', 'key', 'privateKey'
    ];
    
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        delete sanitized[field];
      }
    });

    // Normalize email addresses (lowercase)
    if (sanitized.email && typeof sanitized.email === 'string') {
      sanitized.email = sanitized.email.toLowerCase().trim();
    }

    if (sanitized.notifyEmails && Array.isArray(sanitized.notifyEmails)) {
      sanitized.notifyEmails = sanitized.notifyEmails
        .map((email: string) => email.toLowerCase().trim())
        .sort(); // Sort for consistency
    }

    // Normalize strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitized[key].trim();
      }
    });

    return sanitized;
  }

  /**
   * Generate content hash for artifacts
   */
  static generateContentHash(content: string | Buffer): string {
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }

  /**
   * Validate idempotency key format
   */
  static validateIdempotencyKey(key: string): boolean {
    // Format: toolname_hash16
    const pattern = /^[a-z_]+_[a-f0-9]{16}$/;
    return pattern.test(key);
  }

  /**
   * Extract tool name from idempotency key
   */
  static extractToolName(key: string): string | null {
    const match = key.match(/^([a-z_]+)_[a-f0-9]{16}$/);
    return match ? match[1] : null;
  }
}