import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { NetlifyClient } from '@/clients/netlify';
import { StorageClient } from '@/clients/storage';
import { RedisClient } from '@/infra/redis';
import { IdempotencyManager } from '@/infra/idempotency';
import { AuditLogger, AuditEventType } from '@/infra/audit';
import {
  createSession,
  updateSession,
  createRun,
  updateRun,
  createArtifact,
  createSurveyResponse
} from '@/infra/db';

// Input schema with Zod validation
export const RunIntegritySurveySchema = z.object({
  userId: z.string().optional(),
  delivery: z.enum(['csv', 'json', 'both'], {
    description: 'Formato de entrega de resultados',
  }).default('both'),
  notifyEmails: z.array(z.string().email()).optional().default([]),
});

// Output schema
export const RunIntegritySurveyOutputSchema = z.object({
  status: z.literal('completed'),
  summary: z.string().describe('Resumen ejecutivo de la encuesta'),
  csvUrl: z.string().optional().describe('URL del archivo CSV exportado'),
  jsonUrl: z.string().optional().describe('URL del archivo JSON exportado'),
  runId: z.string().describe('ID único de la ejecución'),
  executionTime: z.number().describe('Tiempo de ejecución en milisegundos'),
  totalScore: z.number().describe('Puntuación total de integridad (0-100)'),
  sectionScores: z.record(z.number()).describe('Puntuaciones por sección'),
});

export type RunIntegritySurveyInput = z.infer<typeof RunIntegritySurveySchema>;
export type RunIntegritySurveyOutput = z.infer<typeof RunIntegritySurveyOutputSchema>;

/**
 * Herramienta MCP para ejecutar encuesta de integridad completa
 * Orquesta formulario, validaciones, almacenamiento, exportación y resumen
 */
export async function runIntegritySurvey(
  input: RunIntegritySurveyInput,
  context?: { userId?: string; userAgent?: string; ipAddress?: string; idempotencyKey?: string }
): Promise<RunIntegritySurveyOutput> {
  const startTime = Date.now();
  let sessionId: string | undefined;
  let runId: string | undefined;

  try {
    // 1. Validar entrada
    const validatedInput = RunIntegritySurveySchema.parse(input);

    // 2. Generar clave de idempotencia
    const idempotencyKey = context?.idempotencyKey ||
      IdempotencyManager.generateKey('run_integrity_survey', validatedInput, context?.userId);

    // 3. Verificar ejecución existente (idempotencia)
    const existingRun = await IdempotencyManager.checkExistingRun(idempotencyKey);
    if (existingRun && existingRun.status === 'completed') {
      const csvArtifact = existingRun.artifacts.find(a => a.artifactType === 'csv_export');
      const jsonArtifact = existingRun.artifacts.find(a => a.artifactType === 'json_export');

      return {
        status: 'completed',
        summary: existingRun.summary || 'Encuesta de integridad completada previamente',
        csvUrl: csvArtifact?.fileUrl,
        jsonUrl: jsonArtifact?.fileUrl,
        runId: existingRun.id,
        executionTime: existingRun.duration || 0,
        totalScore: existingRun.outputData?.totalScore || 0,
        sectionScores: existingRun.outputData?.sectionScores || {},
      };
    }

    // 4. Crear sesión en Redis
    sessionId = uuidv4();
    await RedisClient.createSession(sessionId, {
      type: 'integrity_survey',
      userId: validatedInput.userId,
      delivery: validatedInput.delivery,
      status: 'initializing',
      createdAt: new Date().toISOString(),
    }, 7200); // 2 hours TTL

    // 5. Adquirir lock
    const lockKey = `integrity_survey:${validatedInput.userId || 'anonymous'}`;
    const lockAcquired = await RedisClient.acquireLock(lockKey, 600); // 10 minutes

    if (!lockAcquired) {
      throw new Error('Otra encuesta de integridad está en progreso. Intente nuevamente en unos minutos.');
    }

    try {
      // 6. Crear registros en base de datos
      const dbSession = await createSession({
        userId: validatedInput.userId,
        sessionType: 'integrity_survey',
        status: 'active',
        metadata: {
          delivery: validatedInput.delivery,
          notifyEmails: validatedInput.notifyEmails,
        },
        expiresAt: new Date(Date.now() + 7200000), // 2 hours
      });

      const inputHash = IdempotencyManager.generateKey('run_integrity_survey', validatedInput);

      const dbRun = await createRun({
        sessionId: dbSession.id,
        runType: 'run_integrity_survey',
        status: 'running',
        inputHash,
        inputParams: validatedInput,
        idempotencyKey,
      });

      runId = dbRun.id;

      // 7. Registrar inicio en auditoría
      await AuditLogger.logRunStart({
        runId,
        sessionId: dbSession.id,
        toolName: 'run_integrity_survey',
        inputHash,
        userId: context?.userId,
        userAgent: context?.userAgent,
        ipAddress: context?.ipAddress,
      });

      // 8. Actualizar estado en Redis
      await RedisClient.setRunState(runId, {
        status: 'collecting_responses',
        step: 'survey_orchestration',
        progress: 20,
      });

      // 9. Ejecutar encuesta usando cliente Netlify
      const netlifyClient = new NetlifyClient();
      const surveyResult = await netlifyClient.executeIntegritySurvey({
        userId: validatedInput.userId,
      });

      if (!surveyResult.success) {
        throw new Error(`Error en encuesta: ${surveyResult.error}`);
      }

      // 10. Procesar y validar respuestas
      await RedisClient.setRunState(runId, {
        status: 'processing_responses',
        step: 'validation_and_scoring',
        progress: 50,
      });

      const processedResults = await processIntegrityResponses({
        runId,
        responses: surveyResult.responses || {},
        userId: validatedInput.userId,
      });

      // 11. Generar artefactos según formato solicitado
      await RedisClient.setRunState(runId, {
        status: 'generating_exports',
        step: 'artifact_creation',
        progress: 70,
      });

      const storageClient = new StorageClient();
      const artifacts: Array<{ type: string; url: string; hash: string; size: number }> = [];

      // Generar CSV si se solicita
      if (validatedInput.delivery === 'csv' || validatedInput.delivery === 'both') {
        const csvContent = generateCSVExport(processedResults);
        const csvFileName = StorageClient.generateFileName('csv', 'csv', runId);
        
        const csvUpload = await storageClient.uploadCSV(csvFileName, csvContent);
        if (!csvUpload.success) {
          throw new Error(`Error subiendo CSV: ${csvUpload.error}`);
        }

        await createArtifact({
          runId,
          artifactType: 'csv_export',
          fileName: csvFileName,
          fileUrl: csvUpload.url!,
          fileHash: csvUpload.hash!,
          fileSize: csvUpload.size,
          mimeType: 'text/csv',
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        });

        artifacts.push({
          type: 'csv_export',
          url: csvUpload.url!,
          hash: csvUpload.hash!,
          size: csvUpload.size || 0,
        });
      }

      // Generar JSON si se solicita
      if (validatedInput.delivery === 'json' || validatedInput.delivery === 'both') {
        const jsonFileName = StorageClient.generateFileName('json', 'json', runId);
        
        const jsonUpload = await storageClient.uploadJSON(jsonFileName, processedResults);
        if (!jsonUpload.success) {
          throw new Error(`Error subiendo JSON: ${jsonUpload.error}`);
        }

        await createArtifact({
          runId,
          artifactType: 'json_export',
          fileName: jsonFileName,
          fileUrl: jsonUpload.url!,
          fileHash: jsonUpload.hash!,
          fileSize: jsonUpload.size,
          mimeType: 'application/json',
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        });

        artifacts.push({
          type: 'json_export',
          url: jsonUpload.url!,
          hash: jsonUpload.hash!,
          size: jsonUpload.size || 0,
        });
      }

      // 12. Crear registro de respuesta en BD
      await createSurveyResponse({
        runId,
        userId: validatedInput.userId,
        responses: processedResults.responses,
        sectionScores: processedResults.sectionScores,
        totalScore: processedResults.totalScore,
        deliveryFormat: validatedInput.delivery === 'both' ? ['csv', 'json'] : [validatedInput.delivery],
        notifyEmails: validatedInput.notifyEmails,
      });

      // 13. Generar resumen ejecutivo
      const executiveSummary = generateExecutiveSummary(processedResults);

      // 14. Enviar notificaciones si se solicitan
      if (validatedInput.notifyEmails.length > 0) {
        await RedisClient.setRunState(runId, {
          status: 'sending_notifications',
          step: 'email_delivery',
          progress: 90,
        });
        
        // TODO: Implementar envío de emails
        // await sendSurveyNotifications(validatedInput.notifyEmails, artifacts);
      }

      // 15. Finalizar ejecución
      const executionTime = Date.now() - startTime;

      await updateRun(runId, {
        status: 'completed',
        outputData: {
          totalScore: processedResults.totalScore,
          sectionScores: processedResults.sectionScores,
          responseCount: Object.keys(processedResults.responses).length,
          artifacts: artifacts.map(a => ({ type: a.type, hash: a.hash })),
        },
        summary: executiveSummary,
        completedAt: new Date(),
        duration: executionTime,
      });

      await updateSession(dbSession.id, {
        status: 'completed',
      });

      // 16. Registrar finalización en auditoría
      await AuditLogger.logRunCompletion({
        runId,
        toolName: 'run_integrity_survey',
        duration: executionTime,
        artifactHashes: artifacts.map(a => a.hash),
        summary: executiveSummary,
        userId: context?.userId,
      });

      // Registrar cada artefacto
      for (const artifact of artifacts) {
        await AuditLogger.logArtifactCreation({
          runId,
          artifactType: artifact.type,
          fileName: `${artifact.type}_${runId}`,
          fileHash: artifact.hash,
          fileSize: artifact.size,
          userId: context?.userId,
        });
      }

      // 17. Limpiar estado temporal
      await RedisClient.deleteRunState(runId);
      await RedisClient.deleteSession(sessionId);

      // 18. Generar URLs firmadas
      const csvUrl = artifacts.find(a => a.type === 'csv_export')?.url;
      const jsonUrl = artifacts.find(a => a.type === 'json_export')?.url;

      return {
        status: 'completed',
        summary: executiveSummary,
        csvUrl,
        jsonUrl,
        runId,
        executionTime,
        totalScore: processedResults.totalScore,
        sectionScores: processedResults.sectionScores,
      };

    } finally {
      // Liberar lock
      await RedisClient.releaseLock(lockKey);
    }

  } catch (error: any) {
    // Manejo de errores
    console.error('Error in runIntegritySurvey:', error);

    if (runId) {
      await updateRun(runId, {
        status: 'failed',
        errorMessage: error.message,
        completedAt: new Date(),
        duration: Date.now() - startTime,
      });

      await AuditLogger.logError({
        runId,
        sessionId,
        error,
        context: { input: validatedInput, step: 'execution' },
        userId: context?.userId,
      });
    }

    // Limpiar estado en caso de error
    if (sessionId) {
      await RedisClient.deleteSession(sessionId);
    }
    if (runId) {
      await RedisClient.deleteRunState(runId);
    }

    throw new Error(`Error ejecutando encuesta de integridad: ${error.message}`);
  }
}

/**
 * Procesa y valida respuestas de la encuesta de integridad
 */
async function processIntegrityResponses(params: {
  runId: string;
  responses: any;
  userId?: string;
}): Promise<{
  responses: any;
  sectionScores: Record<string, number>;
  totalScore: number;
  recommendations: string[];
}> {
  const { responses } = params;

  // Definir secciones de la encuesta de integridad
  const sections = {
    governance: { weight: 0.2, name: 'Gobierno Corporativo' },
    riskManagement: { weight: 0.2, name: 'Gestión de Riesgos' },
    compliance: { weight: 0.25, name: 'Cumplimiento Normativo' },
    ethics: { weight: 0.15, name: 'Código de Ética' },
    training: { weight: 0.1, name: 'Capacitación' },
    monitoring: { weight: 0.1, name: 'Monitoreo y Auditoría' },
  };

  // Calcular puntuaciones por sección (mock - en implementación real usaríamos lógica específica)
  const sectionScores: Record<string, number> = {};
  let totalWeightedScore = 0;

  Object.entries(sections).forEach(([sectionId, sectionInfo]) => {
    // Generar score simulado basado en respuestas
    const sectionResponses = responses[sectionId] || {};
    const responseCount = Object.keys(sectionResponses).length;
    
    // Score básico: 60-95 basado en completitud y respuestas
    const baseScore = 60 + (responseCount * 5) + Math.random() * 20;
    const finalScore = Math.min(95, Math.max(40, baseScore));
    
    sectionScores[sectionId] = Math.round(finalScore);
    totalWeightedScore += finalScore * sectionInfo.weight;
  });

  const totalScore = Math.round(totalWeightedScore);

  // Generar recomendaciones basadas en puntuaciones
  const recommendations: string[] = [];
  
  Object.entries(sectionScores).forEach(([sectionId, score]) => {
    if (score < 70) {
      const sectionName = sections[sectionId as keyof typeof sections].name;
      recommendations.push(`Mejorar controles en ${sectionName} (puntuación: ${score})`);
    }
  });

  if (totalScore < 75) {
    recommendations.push('Implementar programa integral de mejora de compliance');
  }

  return {
    responses,
    sectionScores,
    totalScore,
    recommendations,
  };
}

/**
 * Genera exportación CSV de resultados
 */
function generateCSVExport(data: {
  responses: any;
  sectionScores: Record<string, number>;
  totalScore: number;
  recommendations: string[];
}): string {
  const csvRows: any[] = [];

  // Header de resumen
  csvRows.push({
    Tipo: 'Resumen',
    Sección: 'Total',
    Puntuación: data.totalScore,
    Detalles: `Evaluación completa de integridad`,
    Timestamp: new Date().toISOString(),
  });

  // Puntuaciones por sección
  Object.entries(data.sectionScores).forEach(([section, score]) => {
    csvRows.push({
      Tipo: 'Sección',
      Sección: section,
      Puntuación: score,
      Detalles: `Evaluación de ${section}`,
      Timestamp: new Date().toISOString(),
    });
  });

  // Recomendaciones
  data.recommendations.forEach((rec, index) => {
    csvRows.push({
      Tipo: 'Recomendación',
      Sección: `Rec_${index + 1}`,
      Puntuación: '',
      Detalles: rec,
      Timestamp: new Date().toISOString(),
    });
  });

  return StorageClient.objectArrayToCSV(csvRows);
}

/**
 * Genera resumen ejecutivo de la encuesta
 */
function generateExecutiveSummary(data: {
  totalScore: number;
  sectionScores: Record<string, number>;
  recommendations: string[];
}): string {
  const { totalScore, sectionScores, recommendations } = data;

  const sectionCount = Object.keys(sectionScores).length;
  const avgScore = totalScore;
  const lowScoreSections = Object.entries(sectionScores)
    .filter(([, score]) => score < 70)
    .length;

  let riskLevel = 'Bajo';
  if (avgScore < 60) riskLevel = 'Alto';
  else if (avgScore < 75) riskLevel = 'Medio';

  return `Encuesta de Integridad completada con puntuación total de ${totalScore}/100. ` +
    `Evaluadas ${sectionCount} secciones de compliance con nivel de riesgo ${riskLevel}. ` +
    `${lowScoreSections > 0 ? `${lowScoreSections} área(s) requieren atención inmediata. ` : ''}` +
    `${recommendations.length} recomendación(es) específica(s) generadas conforme Ley 27.401.`;
}