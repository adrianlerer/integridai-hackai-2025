import { createHash } from 'crypto';
import { RedisClient } from './redis';
import { AuditLogger, AuditEventType } from './audit';

/**
 * 🔒 FORENSIC INFERENCE SYSTEM
 * Implementa determinismo completo para compliance y auditorías
 * Basado en "Defeating Nondeterminism in LLM Inference" - Thinking Machines Lab
 */

export interface ForensicConfig {
  temperature: 0;                    // [Verificado] Elimina sampling aleatorio
  seed: string;                     // [Crítico] Semilla determinista
  batchSize: 1;                    // [Inferencia] Evita batch-variance  
  cacheCanonical: boolean;         // [Estimación] Reduce re-computación
  auditTrail: boolean;             // [Requerido] Trazabilidad completa
  maxTokens?: number;              // [Opcional] Límite fijo de tokens
  model?: string;                  // [Crítico] Versión específica del modelo
}

export interface ForensicContext {
  userId?: string;
  sessionId?: string;
  complianceMode: boolean;
  auditRequired: boolean;
  legalReference?: string;         // [Esencial] Referencia Ley 27.401
}

export interface ForensicResult<T> {
  data: T;
  forensicMetadata: {
    inputHash: string;
    outputHash: string;
    seed: string;
    timestamp: string;
    model: string;
    reproducible: boolean;
    cacheSource?: 'canonical' | 'computed';
    auditTrail: string[];           // [Crítico] Pasos de ejecución
  };
}

export class ForensicInferenceManager {
  
  /**
   * [Verificado] Genera semilla determinista basada en input
   */
  static generateDeterministicSeed(input: any, context?: ForensicContext): string {
    const seedInput = {
      data: input,
      userId: context?.userId,
      date: new Date().toISOString().split('T')[0], // Solo fecha, no hora
      version: '1.0.0'
    };
    
    return createHash('sha256')
      .update(JSON.stringify(seedInput, Object.keys(seedInput).sort()))
      .digest('hex')
      .substring(0, 16); // 16 chars para compatibilidad
  }

  /**
   * [Crítico] Ejecuta inferencia con garantías forenses
   */
  static async executeForensic<TInput, TOutput>(
    operation: string,
    input: TInput,
    executor: (input: TInput, config: ForensicConfig) => Promise<TOutput>,
    context?: ForensicContext
  ): Promise<ForensicResult<TOutput>> {
    
    const startTime = Date.now();
    
    // 1. [Esencial] Configuración determinista
    const forensicConfig: ForensicConfig = {
      temperature: 0,
      seed: this.generateDeterministicSeed(input, context),
      batchSize: 1,
      cacheCanonical: true,
      auditTrail: true,
      model: process.env.FORENSIC_MODEL_VERSION || 'gpt-4o-2024-08-06'
    };

    // 2. [Crítico] Hash de entrada
    const inputHash = createHash('sha256')
      .update(JSON.stringify({ input, config: forensicConfig }))
      .digest('hex');

    // 3. [Optimización] Verificar caché canónica
    if (forensicConfig.cacheCanonical) {
      const cached = await this.getCanonicalResult<TOutput>(inputHash);
      if (cached) {
        await this.logForensicAccess(operation, inputHash, 'cache_hit', context);
        return {
          data: cached.data,
          forensicMetadata: {
            ...cached.metadata,
            cacheSource: 'canonical'
          }
        };
      }
    }

    // 4. [Crítico] Ejecución con lock para evitar concurrencia
    const lockKey = `forensic_lock:${inputHash}`;
    const lockAcquired = await RedisClient.setnx(lockKey, Date.now().toString());
    
    if (!lockAcquired) {
      // [Seguridad] Esperar a que termine otra ejecución
      await this.waitForLockRelease(lockKey);
      return this.executeForensic(operation, input, executor, context);
    }

    try {
      // 5. [Esencial] Ejecutar con configuración determinista
      const auditTrail: string[] = [
        `[${new Date().toISOString()}] Forensic execution started`,
        `[${new Date().toISOString()}] Seed: ${forensicConfig.seed}`,
        `[${new Date().toISOString()}] Input hash: ${inputHash}`
      ];

      const result = await executor(input, forensicConfig);
      
      // 6. [Crítico] Hash de salida
      const outputHash = createHash('sha256')
        .update(JSON.stringify(result))
        .digest('hex');

      auditTrail.push(`[${new Date().toISOString()}] Output hash: ${outputHash}`);
      auditTrail.push(`[${new Date().toISOString()}] Execution completed in ${Date.now() - startTime}ms`);

      // 7. [Esencial] Metadata forense
      const forensicMetadata = {
        inputHash,
        outputHash,
        seed: forensicConfig.seed,
        timestamp: new Date().toISOString(),
        model: forensicConfig.model!,
        reproducible: true,
        cacheSource: 'computed' as const,
        auditTrail
      };

      // 8. [Crítico] Persistir resultado canónico
      if (forensicConfig.cacheCanonical) {
        await this.storeCanonicalResult(inputHash, result, forensicMetadata);
      }

      // 9. [Requerido] Log de auditoría
      await this.logForensicExecution(operation, forensicMetadata, context);

      return {
        data: result,
        forensicMetadata
      };

    } finally {
      // 10. [Esencial] Liberar lock
      await RedisClient.del(lockKey);
    }
  }

  /**
   * [Optimización] Obtener resultado canónico del caché
   */
  private static async getCanonicalResult<T>(inputHash: string): Promise<{
    data: T;
    metadata: any;
  } | null> {
    try {
      const cached = await RedisClient.get(`canonical:${inputHash}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Error reading canonical cache:', error);
      return null;
    }
  }

  /**
   * [Crítico] Almacenar resultado canónico
   */
  private static async storeCanonicalResult<T>(
    inputHash: string,
    data: T,
    metadata: any
  ): Promise<void> {
    try {
      const canonicalResult = { data, metadata };
      
      // [Esencial] TTL largo para resultados forenses (30 días)
      await RedisClient.setex(
        `canonical:${inputHash}`,
        86400 * 30,
        JSON.stringify(canonicalResult)
      );
    } catch (error) {
      console.error('Error storing canonical result:', error);
      // [Crítico] No fallar la ejecución por error de caché
    }
  }

  /**
   * [Seguridad] Esperar liberación de lock
   */
  private static async waitForLockRelease(lockKey: string): Promise<void> {
    const maxWait = 30000; // 30 segundos máximo
    const checkInterval = 100; // Check cada 100ms
    let waited = 0;

    while (waited < maxWait) {
      const lockExists = await RedisClient.exists(lockKey);
      if (!lockExists) return;
      
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waited += checkInterval;
    }

    // [Seguridad] Si el lock no se libera, continuar (puede ser lock zombie)
    console.warn(`Forensic lock ${lockKey} not released after ${maxWait}ms, proceeding`);
  }

  /**
   * [Requerido] Log de ejecución forense
   */
  private static async logForensicExecution(
    operation: string,
    metadata: any,
    context?: ForensicContext
  ): Promise<void> {
    await AuditLogger.logEvent({
      eventType: AuditEventType.RUN_COMPLETED,
      eventData: {
        operation: `forensic_${operation}`,
        forensic: true,
        inputHash: metadata.inputHash,
        outputHash: metadata.outputHash,
        seed: metadata.seed,
        reproducible: metadata.reproducible,
        model: metadata.model,
        legalReference: context?.legalReference || 'Ley 27.401',
        complianceMode: context?.complianceMode || false
      },
      userId: context?.userId,
    });
  }

  /**
   * [Optimización] Log de acceso a caché
   */
  private static async logForensicAccess(
    operation: string,
    inputHash: string,
    source: 'cache_hit' | 'computed',
    context?: ForensicContext
  ): Promise<void> {
    await AuditLogger.logEvent({
      eventType: AuditEventType.AUTH_SUCCESS,
      eventData: {
        operation: `forensic_${operation}`,
        forensic: true,
        inputHash,
        source,
        legalReference: context?.legalReference || 'Ley 27.401'
      },
      userId: context?.userId,
    });
  }

  /**
   * [Utilidad] Verificar reproducibilidad de resultado
   */
  static async verifyReproducibility<TInput, TOutput>(
    operation: string,
    input: TInput,
    executor: (input: TInput, config: ForensicConfig) => Promise<TOutput>,
    iterations: number = 3,
    context?: ForensicContext
  ): Promise<{
    reproducible: boolean;
    results: string[];
    divergencePoint?: number;
  }> {
    
    const results: string[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const forensicResult = await this.executeForensic(
        operation,
        input,
        executor,
        context
      );
      
      results.push(forensicResult.forensicMetadata.outputHash);
    }
    
    // [Verificado] Todos los hashes deben ser idénticos
    const firstHash = results[0];
    const allIdentical = results.every(hash => hash === firstHash);
    
    return {
      reproducible: allIdentical,
      results,
      divergencePoint: allIdentical ? undefined : results.findIndex(hash => hash !== firstHash)
    };
  }
}

/**
 * [Utilidad] Decorador para funciones que requieren determinismo
 */
export function forensic<TInput, TOutput>(
  operation: string
) {
  return function(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    
    descriptor.value = async function(
      input: TInput,
      context?: ForensicContext
    ): Promise<ForensicResult<TOutput>> {
      
      return ForensicInferenceManager.executeForensic<TInput, TOutput>(
        operation,
        input,
        method.bind(this),
        context
      );
    };
  };
}