/**
 * ⚖️💉 LEGAL VACCINATION SHIELD TOOL
 * Herramienta MCP que combina vacunación anti-corrupción con protección legal del Oficial
 * 
 * FUNCIONALIDADES:
 * 1. Vacunación forense con evidencia legal
 * 2. Protección automática del Oficial de Cumplimiento
 * 3. Transferencia documentada de responsabilidad
 * 4. Generación de evidencia para defensa judicial
 */

import {
  LegalComplianceShield,
  ComplianceOfficerRecommendation,
  EmployeeComplianceResponse,
  LegalDefensePackage
} from '../legal-compliance-shield.js';

export interface LegalVaccinationInput {
  // Datos del empleado
  employeeId: string;
  employeeName: string;
  department: string;
  
  // Situación de riesgo
  corruptionSituation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Datos del Oficial de Cumplimiento
  complianceOfficerId: string;
  complianceOfficerName: string;
  
  // Contexto legal
  urgency: 'routine' | 'urgent' | 'emergency';
  legalBasis?: string[];
  witnessedBy?: string[];
}

export interface LegalVaccinationOutput {
  // Resultado de la vacunación
  vaccinationStatus: 'completed' | 'pending_employee_action' | 'employee_refused' | 'escalated';
  vaccinationId: string;
  immunityLevel: number;                   // 0-100%
  
  // Protección legal del Oficial
  officerProtection: {
    recommendationId: string;
    recommendationHash: string;
    protectionStatus: 'fully_protected' | 'partially_protected' | 'requires_escalation';
    dutyFulfilled: boolean;
  };
  
  // Transferencia de responsabilidad
  liabilityTransfer: {
    transferred: boolean;
    transferDate: string;
    employeeAcknowledged: boolean;
    defensePackageId?: string;
  };
  
  // Evidencia legal
  legalEvidence: {
    communicationProof: string[];
    employeeResponse: string;
    witnessChain: string[];
    forensicHash: string;
  };
  
  // Compliance Ley 27.401
  legalCompliance: {
    law: 'Ley 27.401';
    applicableArticles: string[];
    complianceScore: number;               // 0-100
    corporateProtection: 'full' | 'partial' | 'insufficient';
  };
  
  // Certificados y URLs
  certificates: {
    vaccinationCertificate: string;
    officerProtectionCertificate: string;
    legalDefensePackage?: string;
  };
}

export async function executeLegalVaccinationShield(
  input: LegalVaccinationInput
): Promise<LegalVaccinationOutput> {

  console.log(`[LEGAL VACCINATION] Starting process for employee ${input.employeeId}`);
  
  // 1. [Crítico] Registrar recomendación del Oficial de Cumplimiento
  const recommendation: ComplianceOfficerRecommendation = {
    officerId: input.complianceOfficerId,
    employeeId: input.employeeId,
    recommendationType: 'vaccination_mandatory',
    riskIdentified: input.corruptionSituation,
    legalBasis: input.legalBasis || [
      'Ley 27.401 Art. 22 - Deberes de supervisión y control',
      'Ley 27.401 Art. 23 - Programas de integridad'
    ],
    recommendationText: `Se recomienda vacunación anti-corrupción inmediata para ${input.employeeName} debido a: ${input.corruptionSituation}`,
    urgencyLevel: mapUrgencyLevel(input.urgency),
    witnessedBy: input.witnessedBy
  };

  const recommendationId = await LegalComplianceShield.recordOfficerRecommendation(recommendation);
  
  // 2. [Esencial] Simular proceso de vacunación
  const vaccinationResult = await simulateVaccinationProcess(input);
  
  // 3. [Crítico] Registrar respuesta del empleado
  const employeeResponse: EmployeeComplianceResponse = {
    employeeId: input.employeeId,
    recommendationId: recommendationId,
    responseStatus: vaccinationResult.completed ? 'completed' : 'ignored',
    responseDate: new Date().toISOString(),
    completionEvidence: vaccinationResult.certificateUrl
  };

  // 4. [Esencial] Generar paquete de defensa legal
  const defensePackage = await LegalComplianceShield.recordEmployeeResponse(
    employeeResponse, 
    recommendation
  );

  // 5. [Crítico] Generar certificado de protección para el Oficial
  const officerCertificate = await LegalComplianceShield.generateOfficerProtectionCertificate(
    input.complianceOfficerId
  );

  // 6. [Esencial] Calcular nivel de compliance
  const complianceScore = calculateComplianceScore(
    vaccinationResult,
    defensePackage,
    officerCertificate
  );

  // 7. [Crítico] Construir resultado con protección legal completa
  const result: LegalVaccinationOutput = {
    vaccinationStatus: vaccinationResult.completed ? 'completed' : 'pending_employee_action',
    vaccinationId: generateVaccinationId(input.employeeId),
    immunityLevel: vaccinationResult.immunityLevel,
    
    officerProtection: {
      recommendationId: recommendationId,
      recommendationHash: defensePackage.evidence.recommendationHash,
      protectionStatus: officerCertificate.legalStanding === 'protected' ? 'fully_protected' : 
                       officerCertificate.legalStanding === 'partially_protected' ? 'partially_protected' : 'requires_escalation',
      dutyFulfilled: true
    },
    
    liabilityTransfer: {
      transferred: defensePackage.legalFramework.liabilityTransfer,
      transferDate: defensePackage.forensicMetadata.creationTimestamp,
      employeeAcknowledged: vaccinationResult.completed,
      defensePackageId: defensePackage.packageId
    },
    
    legalEvidence: {
      communicationProof: defensePackage.evidence.communicationProof,
      employeeResponse: employeeResponse.responseStatus,
      witnessChain: defensePackage.evidence.witnessChain,
      forensicHash: defensePackage.forensicMetadata.hashChain
    },
    
    legalCompliance: {
      law: 'Ley 27.401',
      applicableArticles: defensePackage.legalFramework.applicableArticles,
      complianceScore: complianceScore,
      corporateProtection: defensePackage.legalFramework.corporateProtection ? 'full' : 'partial'
    },
    
    certificates: {
      vaccinationCertificate: vaccinationResult.certificateUrl,
      officerProtectionCertificate: officerCertificate.certificateUrl,
      legalDefensePackage: `https://integridai.com/legal/defense/${defensePackage.packageId}`
    }
  };

  console.log(`[LEGAL VACCINATION] Process completed successfully`);
  console.log(`[LEGAL VACCINATION] Officer protection: ${result.officerProtection.protectionStatus}`);
  console.log(`[LEGAL VACCINATION] Liability transferred: ${result.liabilityTransfer.transferred}`);
  console.log(`[LEGAL VACCINATION] Compliance score: ${result.legalCompliance.complianceScore}%`);

  return result;
}

// Funciones auxiliares

function mapUrgencyLevel(urgency: string): ComplianceOfficerRecommendation['urgencyLevel'] {
  switch (urgency) {
    case 'emergency': return 'critical';
    case 'urgent': return 'high';
    case 'routine': return 'medium';
    default: return 'medium';
  }
}

async function simulateVaccinationProcess(input: LegalVaccinationInput): Promise<{
  completed: boolean;
  immunityLevel: number;
  certificateUrl: string;
}> {
  
  // [Simulado] Proceso de vacunación determinístico
  const baseImmunity = 60;
  let immunityBonus = 0;
  
  // Bonus por nivel de riesgo
  if (input.riskLevel === 'critical') immunityBonus += 25;
  else if (input.riskLevel === 'high') immunityBonus += 20;
  else if (input.riskLevel === 'medium') immunityBonus += 10;
  
  // Bonus por urgencia
  if (input.urgency === 'emergency') immunityBonus += 10;
  else if (input.urgency === 'urgent') immunityBonus += 5;
  
  const immunityLevel = Math.min(95, baseImmunity + immunityBonus);
  
  // [Simulado] 95% de empleados completan la vacunación
  const completed = Math.random() > 0.05;
  
  const certificateUrl = `https://integridai.com/certificates/VAC-${input.employeeId}-${Date.now()}`;
  
  return {
    completed,
    immunityLevel: completed ? immunityLevel : 0,
    certificateUrl: completed ? certificateUrl : ''
  };
}

function generateVaccinationId(employeeId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `VAC-LEGAL-${employeeId}-${timestamp}-${random}`.toUpperCase();
}

function calculateComplianceScore(
  vaccination: any,
  defensePackage: LegalDefensePackage,
  officerCertificate: any
): number {
  
  let score = 70; // Base score
  
  // Bonus por vacunación completada
  if (vaccination.completed) score += 20;
  
  // Bonus por protección legal
  if (defensePackage.legalFramework.corporateProtection) score += 10;
  
  // Bonus por protección del oficial
  if (officerCertificate.legalStanding === 'protected') score += 10;
  else if (officerCertificate.legalStanding === 'partially_protected') score += 5;
  
  return Math.min(100, score);
}