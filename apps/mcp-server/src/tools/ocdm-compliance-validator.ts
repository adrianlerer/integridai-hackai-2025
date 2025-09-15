/**
 * 🧠⚖️ OCDM COMPLIANCE VALIDATOR TOOL
 * 
 * Herramienta MCP que implementa validación OCDM para Ley 27.401 siguiendo
 * el framework del post LinkedIn: "Transform policy into executable strategy"
 * 
 * FUNCIONALIDADES OCDM:
 * 1. Ontology-driven validation usando reglas SHACL
 * 2. Knowledge graph de compliance en tiempo real  
 * 3. Single source of truth para auditorías
 * 4. Dashboard data para monitoreo continuo
 * 
 * INTEGRACIÓN: Compatible con Legal Compliance Shield existente
 */

import { OCDMEngine, GiftHospitalityEvent, OCDMComplianceResult } from '../ocdm/ocdm-engine.js';

export interface OCDMValidationInput {
  // Datos del evento a validar
  eventType: 'gift' | 'hospitality';
  eventId: string;
  
  // Participantes
  offeredBy: string;
  receivedBy: string;
  
  // Detalles del beneficio
  description: string;
  valueAmount: number;
  valueCurrency: string;
  
  // Flags de riesgo
  isCashOrEquivalent: boolean;
  publicOfficialInvolved: boolean;
  pendingBusinessDecision?: boolean;
  
  // Contexto empresarial
  businessContext: string;
  frequency12m?: number;
  
  // Para integración con Legal Compliance Shield
  complianceOfficerId?: string;
  requiresLegalProtection?: boolean;
}

export interface OCDMValidationOutput {
  // Resultado OCDM
  ocdmCompliance: {
    isCompliant: boolean;
    complianceScore: number;
    validationResults: Array<{
      rule: string;
      passed: boolean;
      severity: 'info' | 'warning' | 'violation';
      message: string;
    }>;
  };
  
  // Knowledge Graph Stats
  knowledgeGraph: {
    totalTriples: number;
    entitiesCount: number;
    relationshipsCount: number;
    conceptsCovered: string[];
  };
  
  // Recomendaciones automáticas
  recommendations: {
    immediate: string[];
    preventive: string[];
    regulatory: string[];
  };
  
  // Dashboard metrics
  dashboardData: {
    overallRiskLevel: 'low' | 'medium' | 'high';
    policyViolations: number;
    complianceGaps: string[];
    nextActions: string[];
  };
  
  // Integración con Legal Shield (si aplica)
  legalProtection?: {
    officerProtected: boolean;
    evidenceGenerated: boolean;
    liabilityTransferred: boolean;
    forensicHash: string;
  };
  
  // Certificados OCDM
  certificates: {
    ocdmValidationCertificate: string;
    knowledgeGraphSnapshot: string;
    policyComplianceReport: string;
  };
}

// Instancia global del motor OCDM
let ocdmEngine: OCDMEngine | null = null;

/**
 * 🧠 Ejecutar validación OCDM completa para compliance Ley 27.401
 */
export async function executeOCDMCompliance(
  input: OCDMValidationInput
): Promise<OCDMValidationOutput> {
  
  console.log(`[OCDM VALIDATOR] Starting OCDM validation for event ${input.eventId}`);
  
  // 1. [Inicialización] Preparar motor OCDM si es necesario
  if (!ocdmEngine) {
    ocdmEngine = new OCDMEngine();
    await ocdmEngine.initialize();
    console.log('[OCDM VALIDATOR] OCDM Engine initialized');
  }
  
  // 2. [Transformación] Convertir input a formato ontológico
  const giftEvent: GiftHospitalityEvent = {
    eventId: input.eventId,
    offeredBy: input.offeredBy,
    receivedBy: input.receivedBy,
    valueAmount: input.valueAmount,
    valueCurrency: input.valueCurrency,
    isCashOrEquivalent: input.isCashOrEquivalent,
    publicOfficialInvolved: input.publicOfficialInvolved,
    pendingBusinessDecision: input.pendingBusinessDecision,
    frequency12m: input.frequency12m,
    context: input.businessContext
  };
  
  // 3. [Validación OCDM] Ejecutar reglas SHACL automáticamente
  const ocdmResult: OCDMComplianceResult = await ocdmEngine.validateGiftHospitalityEvent(giftEvent);
  
  // 4. [Knowledge Graph] Obtener estadísticas del grafo de conocimiento
  const dashboardData = await ocdmEngine.getComplianceDashboardData();
  
  // 5. [Transformación de resultados] Convertir a formato de salida
  const validationResults = ocdmResult.validationReport.results.map(result => ({
    rule: result.resultPath || 'General compliance',
    passed: result.resultSeverity !== 'sh:Violation',
    severity: result.resultSeverity === 'sh:Violation' ? 'violation' as const :
              result.resultSeverity === 'sh:Warning' ? 'warning' as const : 'info' as const,
    message: result.resultMessage
  }));
  
  // 6. [Recomendaciones] Categorizar por tipo
  const categorizedRecommendations = categorizeRecommendations(ocdmResult.recommendations);
  
  // 7. [Legal Protection] Integrar con Legal Compliance Shield si se requiere
  let legalProtection = undefined;
  if (input.requiresLegalProtection && input.complianceOfficerId) {
    legalProtection = await generateLegalProtection(input, ocdmResult);
  }
  
  // 8. [Certificados] Generar URLs de evidencia
  const certificates = generateOCDMCertificates(input.eventId, ocdmResult);
  
  const result: OCDMValidationOutput = {
    ocdmCompliance: {
      isCompliant: ocdmResult.isCompliant,
      complianceScore: ocdmResult.complianceScore,
      validationResults
    },
    
    knowledgeGraph: {
      totalTriples: ocdmResult.knowledgeGraphStats.totalTriples,
      entitiesCount: ocdmResult.knowledgeGraphStats.entities,
      relationshipsCount: ocdmResult.knowledgeGraphStats.relationships,
      conceptsCovered: ['Gift', 'Hospitality', 'PublicOfficial', 'BenefitEvent', 'PolicyParameters']
    },
    
    recommendations: categorizedRecommendations,
    
    dashboardData: {
      overallRiskLevel: ocdmResult.complianceScore >= 80 ? 'low' : 
                      ocdmResult.complianceScore >= 60 ? 'medium' : 'high',
      policyViolations: ocdmResult.validationReport.results.length,
      complianceGaps: dashboardData.riskAreas.map(area => area.area),
      nextActions: generateNextActions(ocdmResult, input)
    },
    
    legalProtection,
    certificates
  };
  
  console.log(`[OCDM VALIDATOR] Validation complete - Compliance: ${result.ocdmCompliance.isCompliant}`);
  console.log(`[OCDM VALIDATOR] Knowledge Graph: ${result.knowledgeGraph.totalTriples} triples`);
  console.log(`[OCDM VALIDATOR] Compliance Score: ${result.ocdmCompliance.complianceScore}%`);
  
  return result;
}

// === FUNCIONES AUXILIARES ===

function categorizeRecommendations(recommendations: string[]): {
  immediate: string[];
  preventive: string[];
  regulatory: string[];
} {
  const immediate: string[] = [];
  const preventive: string[] = [];
  const regulatory: string[] = [];
  
  recommendations.forEach(rec => {
    if (rec.includes('❌') || rec.includes('Rechazar')) {
      immediate.push(rec);
    } else if (rec.includes('⚖️') || rec.includes('Ley') || rec.includes('Decreto')) {
      regulatory.push(rec);
    } else {
      preventive.push(rec);
    }
  });
  
  return { immediate, preventive, regulatory };
}

async function generateLegalProtection(
  input: OCDMValidationInput, 
  ocdmResult: OCDMComplianceResult
): Promise<{
  officerProtected: boolean;
  evidenceGenerated: boolean;
  liabilityTransferred: boolean;
  forensicHash: string;
}> {
  
  // Integrar con Legal Compliance Shield existente
  const forensicHash = generateForensicHash(input, ocdmResult);
  
  return {
    officerProtected: true,
    evidenceGenerated: true,
    liabilityTransferred: !ocdmResult.isCompliant, // Si no es compliant, transferir responsabilidad
    forensicHash
  };
}

function generateForensicHash(input: OCDMValidationInput, ocdmResult: OCDMComplianceResult): string {
  // Generar hash forense de la validación OCDM para evidencia legal
  const dataToHash = JSON.stringify({
    eventId: input.eventId,
    timestamp: new Date().toISOString(),
    validationResults: ocdmResult.validationReport,
    complianceScore: ocdmResult.complianceScore
  });
  
  // [Simulado] En producción usaría crypto.createHash('sha256')
  return `OCDM-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`.toUpperCase();
}

function generateOCDMCertificates(eventId: string, ocdmResult: OCDMComplianceResult): {
  ocdmValidationCertificate: string;
  knowledgeGraphSnapshot: string;
  policyComplianceReport: string;
} {
  const baseUrl = 'https://integridai.com/ocdm';
  const timestamp = Date.now();
  
  return {
    ocdmValidationCertificate: `${baseUrl}/validation/${eventId}-${timestamp}`,
    knowledgeGraphSnapshot: `${baseUrl}/graph/snapshot/${eventId}-${timestamp}`,
    policyComplianceReport: `${baseUrl}/compliance/report/${eventId}-${timestamp}`
  };
}

function generateNextActions(ocdmResult: OCDMComplianceResult, input: OCDMValidationInput): string[] {
  const actions: string[] = [];
  
  if (!ocdmResult.isCompliant) {
    actions.push('Revisar violaciones identificadas por validación SHACL');
    actions.push('Implementar recomendaciones de compliance automáticas');
  }
  
  if (input.publicOfficialInvolved) {
    actions.push('Registrar en sistema de obsequios a funcionarios públicos');
  }
  
  if (input.valueAmount > 30000) { // Umbral de política
    actions.push('Solicitar preaprobación por superar umbral de monto');
  }
  
  actions.push('Actualizar knowledge graph con nueva información');
  
  return actions;
}