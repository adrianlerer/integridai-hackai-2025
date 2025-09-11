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
  createArtifact 
} from '@/infra/db';

// Input schema with Zod validation
export const SimulateEthicsCaseSchema = z.object({
  persona: z.enum(['catalina', 'mentor', 'ana', 'carlos'], {
    description: 'Personaje del simulador: catalina (oportunista), mentor (académico), ana (auditora), carlos (CEO)',
  }),
  caseId: z.string().min(1, 'Case ID es requerido'),
  userId: z.string().optional(),
  locale: z.string().default('es-AR'),
});

// Output schema
export const SimulateEthicsCaseOutputSchema = z.object({
  status: z.literal('completed'),
  summary: z.string().describe('Resumen ejecutivo del caso simulado'),
  reportUrl: z.string().describe('URL firmada del informe ejecutivo'),
  runId: z.string().describe('ID único de la ejecución'),
  executionTime: z.number().describe('Tiempo de ejecución en milisegundos'),
  legalReferences: z.array(z.string()).describe('Referencias legales aplicadas'),
});

export type SimulateEthicsCaseInput = z.infer<typeof SimulateEthicsCaseSchema>;
export type SimulateEthicsCaseOutput = z.infer<typeof SimulateEthicsCaseOutputSchema>;

/**
 * Herramienta MCP para ejecutar simulación ética completa
 * Encapsula todo el workflow: sesión, decisiones, análisis y reporte
 */
export async function simulateEthicsCase(
  input: SimulateEthicsCaseInput,
  context?: { userId?: string; userAgent?: string; ipAddress?: string; idempotencyKey?: string }
): Promise<SimulateEthicsCaseOutput> {
  const startTime = Date.now();
  let sessionId: string | undefined;
  let runId: string | undefined;

  try {
    // 1. Validar entrada
    const validatedInput = SimulateEthicsCaseSchema.parse(input);
    
    // 2. Generar clave de idempotencia
    const idempotencyKey = context?.idempotencyKey || 
      IdempotencyManager.generateKey('simulate_ethics_case', validatedInput, context?.userId);

    // 3. Verificar ejecución existente (idempotencia)
    const existingRun = await IdempotencyManager.checkExistingRun(idempotencyKey);
    if (existingRun && existingRun.status === 'completed') {
      return {
        status: 'completed',
        summary: existingRun.summary || 'Simulación completada previamente',
        reportUrl: existingRun.artifacts[0]?.fileUrl || '',
        runId: existingRun.id,
        executionTime: existingRun.duration || 0,
        legalReferences: ['Ley 27.401 - Ejecución idempotente'],
      };
    }

    // 4. Crear sesión en Redis para estado temporal
    sessionId = uuidv4();
    await RedisClient.createSession(sessionId, {
      type: 'ethics_case',
      persona: validatedInput.persona,
      caseId: validatedInput.caseId,
      userId: validatedInput.userId,
      status: 'initializing',
      createdAt: new Date().toISOString(),
    }, 7200); // 2 hours TTL

    // 5. Adquirir lock para evitar ejecuciones concurrentes
    const lockKey = `ethics_case:${validatedInput.userId || 'anonymous'}:${validatedInput.caseId}`;
    const lockAcquired = await RedisClient.acquireLock(lockKey, 300); // 5 minutes
    
    if (!lockAcquired) {
      throw new Error('Otra simulación del mismo caso está en progreso. Intente nuevamente en unos minutos.');
    }

    try {
      // 6. Crear registros en base de datos
      const dbSession = await createSession({
        userId: validatedInput.userId,
        sessionType: 'ethics_case',
        status: 'active',
        metadata: {
          persona: validatedInput.persona,
          caseId: validatedInput.caseId,
          locale: validatedInput.locale,
        },
        expiresAt: new Date(Date.now() + 7200000), // 2 hours
      });

      const inputHash = IdempotencyManager.generateKey('simulate_ethics_case', validatedInput);
      
      const dbRun = await createRun({
        sessionId: dbSession.id,
        runType: 'simulate_ethics_case',
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
        toolName: 'simulate_ethics_case',
        inputHash,
        userId: context?.userId,
        userAgent: context?.userAgent,
        ipAddress: context?.ipAddress,
      });

      // 8. Actualizar estado en Redis
      await RedisClient.setRunState(runId, {
        status: 'executing_simulation',
        step: 'netlify_integration',
        progress: 25,
      });

      // 9. Ejecutar simulación usando cliente Netlify
      const netlifyClient = new NetlifyClient();
      const simulationResult = await netlifyClient.executeEthicsCase({
        persona: validatedInput.persona,
        caseId: validatedInput.caseId,
        userId: validatedInput.userId,
        locale: validatedInput.locale,
      });

      if (!simulationResult.success) {
        throw new Error(`Error en simulación: ${simulationResult.error}`);
      }

      // 10. Generar informe ejecutivo
      await RedisClient.setRunState(runId, {
        status: 'generating_report',
        step: 'report_generation',
        progress: 75,
      });

      const executiveReport = await generateExecutiveReport({
        runId,
        caseId: validatedInput.caseId,
        persona: validatedInput.persona,
        decisions: simulationResult.decisions || [],
        analysis: simulationResult.analysis,
        locale: validatedInput.locale,
      });

      // 11. Subir artefactos a almacenamiento
      const storageClient = new StorageClient();
      const reportFileName = StorageClient.generateFileName('report', 'html', runId);
      
      const uploadResult = await storageClient.uploadHTMLReport(reportFileName, executiveReport.html);
      
      if (!uploadResult.success) {
        throw new Error(`Error subiendo reporte: ${uploadResult.error}`);
      }

      // 12. Registrar artefacto en BD
      await createArtifact({
        runId,
        artifactType: 'report_html',
        fileName: reportFileName,
        fileUrl: uploadResult.url!,
        fileHash: uploadResult.hash!,
        fileSize: uploadResult.size,
        mimeType: 'text/html',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      // 13. Finalizar ejecución
      const executionTime = Date.now() - startTime;
      
      await updateRun(runId, {
        status: 'completed',
        outputData: {
          decisions: simulationResult.decisions,
          analysis: simulationResult.analysis,
          reportFileName,
        },
        summary: executiveReport.summary,
        completedAt: new Date(),
        duration: executionTime,
      });

      await updateSession(dbSession.id, {
        status: 'completed',
      });

      // 14. Registrar finalización en auditoría
      await AuditLogger.logRunCompletion({
        runId,
        toolName: 'simulate_ethics_case',
        duration: executionTime,
        artifactHashes: [uploadResult.hash!],
        summary: executiveReport.summary,
        userId: context?.userId,
      });

      await AuditLogger.logArtifactCreation({
        runId,
        artifactType: 'report_html',
        fileName: reportFileName,
        fileHash: uploadResult.hash!,
        fileSize: uploadResult.size || 0,
        userId: context?.userId,
      });

      // 15. Limpiar estado temporal
      await RedisClient.deleteRunState(runId);
      await RedisClient.deleteSession(sessionId);

      // 16. Generar URL firmada para acceso
      const signedUrl = await storageClient.generateSignedUrl(reportFileName, 86400); // 24 hours

      return {
        status: 'completed',
        summary: executiveReport.summary,
        reportUrl: signedUrl,
        runId,
        executionTime,
        legalReferences: executiveReport.legalReferences,
      };

    } finally {
      // Liberar lock
      await RedisClient.releaseLock(lockKey);
    }

  } catch (error: any) {
    // Manejo de errores
    console.error('Error in simulateEthicsCase:', error);

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

    throw new Error(`Error ejecutando simulación ética: ${error.message}`);
  }
}

/**
 * Genera informe ejecutivo con análisis y recomendaciones
 */
async function generateExecutiveReport(params: {
  runId: string;
  caseId: string;
  persona: string;
  decisions: any[];
  analysis: any;
  locale: string;
}): Promise<{
  html: string;
  summary: string;
  legalReferences: string[];
}> {
  const { runId, caseId, persona, decisions, analysis, locale } = params;

  // Referencias legales específicas por persona
  const legalReferences = [
    'Ley 27.401 - Régimen de Responsabilidad Penal Empresaria',
    'Ley 27.401 Art. 22 - Programa de Integridad',
    'Ley 27.401 Art. 23 - Elementos del Programa de Integridad',
    'Ley 27.401 Art. 7 - Delitos precedentes',
    'Ley 27.401 Art. 23 inc. c) - Capacitación periódica en ética empresarial',
  ];

  if (persona === 'catalina') {
    legalReferences.push('Ley 27.401 Art. 3 - Hechos ilícitos atribuibles a la persona jurídica');
  }

  // Generar resumen ejecutivo
  const summary = `Simulación ética completada para caso ${caseId} con personaje ${persona}. ` +
    `Se procesaron ${decisions.length} decisiones éticas con análisis conforme a Ley 27.401. ` +
    `Recomendaciones específicas de capacitación y controles internos incluidas en el informe completo.`;

  // Generar secciones del reporte
  const sections = [
    {
      title: 'Contexto de la Simulación',
      content: `
        <p><strong>Caso:</strong> ${caseId}</p>
        <p><strong>Personaje:</strong> ${getPersonaDescription(persona)}</p>
        <p><strong>Decisiones Evaluadas:</strong> ${decisions.length}</p>
        <p><strong>Marco Legal:</strong> Ley 27.401 - Responsabilidad Penal Empresaria</p>
      `,
    },
    {
      title: 'Decisiones Tomadas',
      content: decisions.map((decision, idx) => `
        <div style="margin-bottom: 15px;">
          <strong>Decisión ${idx + 1}:</strong> ${decision.question || 'N/A'}<br>
          <strong>Respuesta:</strong> ${decision.response || 'N/A'}<br>
          <small>Timestamp: ${decision.timestamp || 'N/A'}</small>
        </div>
      `).join(''),
    },
    {
      title: 'Análisis de Riesgos',
      content: `
        <p>${analysis?.riskAssessment || 'Análisis de riesgos según patrones de decisión identificados.'}</p>
        <p><strong>Nivel de Riesgo:</strong> ${analysis?.riskLevel || 'Medio'}</p>
        <p><strong>Factores de Riesgo:</strong> ${(analysis?.riskFactors || []).join(', ') || 'Evaluación estándar'}</p>
      `,
    },
    {
      title: 'Recomendaciones de Mejora',
      content: `
        <ul>
          <li>Implementar capacitación específica en el área identificada</li>
          <li>Revisar controles internos relacionados con el caso simulado</li>
          <li>Establecer canales de consulta ética</li>
          <li>Documentar políticas específicas para situaciones similares</li>
          <li>Programar revisiones periódicas del programa de integridad</li>
        </ul>
      `,
    },
  ];

  const html = StorageClient.generateHTMLReport({
    title: `Informe de Simulación Ética - Caso ${caseId}`,
    summary,
    sections,
    legalRefs: legalReferences,
    runId,
    timestamp: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
  });

  return {
    html,
    summary,
    legalReferences,
  };
}

/**
 * Obtener descripción del personaje
 */
function getPersonaDescription(persona: string): string {
  const descriptions = {
    catalina: 'Catalina Oportunista - Presenta tentaciones de corrupción y dilemas éticos',
    mentor: 'Dr. Mentor - Experto académico en aspectos legales y normativos',
    ana: 'Ana Auditora - Especialista en controles internos y procedimientos',
    carlos: 'Carlos CEO - Perspectiva ejecutiva sobre decisiones estratégicas',
  };
  
  return descriptions[persona as keyof typeof descriptions] || persona;
}