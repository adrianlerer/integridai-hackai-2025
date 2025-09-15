/**
 * 🚀 IntegridAI MCP Server - HackAI 2025 Demo Version
 * 
 * Versión básica de demostración para integración con Claude Desktop.
 * NO incluye funciones avanzadas de la versión comercial.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { 
  runBasicIntegrityCheck,
  BasicIntegrityCheckSchema,
  BasicIntegrityOutputSchema,
  type BasicIntegrityCheckInput,
  type BasicIntegrityCheckOutput 
} from './tools/basicIntegrityCheck.js';

import {
  executeLegalVaccinationShield,
  type LegalVaccinationInput,
  type LegalVaccinationOutput
} from './tools/legal-vaccination-shield.js';

import {
  executeOCDMCompliance,
  type OCDMValidationInput,
  type OCDMValidationOutput
} from './tools/ocdm-compliance-validator.js';

import {
  executePrivacyDifferentialCompliance,
  type PrivacyDifferentialComplianceInput,
  type PrivacyDifferentialComplianceOutput
} from './tools/privacy-differential-compliance.js';

/**
 * Crear e inicializar el servidor MCP básico
 */
const server = new Server(
  {
    name: 'integridai-demo',
    version: '1.0.0-demo',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler para listar herramientas disponibles
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'legal_vaccination_shield',
        description: '⚖️💉 Vacuna Anti-Corrupción con Protección Legal del Oficial de Cumplimiento (Ley 27.401)',
        inputSchema: {
          type: 'object',
          properties: {
            employeeId: { type: 'string', description: 'ID del empleado a vacunar' },
            employeeName: { type: 'string', description: 'Nombre completo del empleado' },
            department: { type: 'string', description: 'Departamento del empleado' },
            corruptionSituation: { type: 'string', description: 'Situación de riesgo de corrupción identificada' },
            riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], description: 'Nivel de riesgo' },
            complianceOfficerId: { type: 'string', description: 'ID del Oficial de Cumplimiento' },
            complianceOfficerName: { type: 'string', description: 'Nombre del Oficial de Cumplimiento' },
            urgency: { type: 'string', enum: ['routine', 'urgent', 'emergency'], description: 'Nivel de urgencia' }
          },
          required: ['employeeId', 'employeeName', 'department', 'corruptionSituation', 'riskLevel', 'complianceOfficerId', 'complianceOfficerName']
        }
      },
      {
        name: 'basic_integrity_check',
        description: '🔍 Evaluación básica de integridad organizacional (Versión Demo)',
        inputSchema: BasicIntegrityCheckSchema,
      },
      {
        name: 'ocdm_compliance_validator',
        description: '🧠⚖️ Validador OCDM: Ontology-Driven Compliance para Ley 27.401 (Regalos y Hospitalidad)',
        inputSchema: {
          type: 'object',
          properties: {
            eventType: { type: 'string', enum: ['gift', 'hospitality'], description: 'Tipo de evento a validar' },
            eventId: { type: 'string', description: 'ID único del evento' },
            offeredBy: { type: 'string', description: 'Quien ofrece el regalo/hospitalidad' },
            receivedBy: { type: 'string', description: 'Quien recibe el regalo/hospitalidad' },
            description: { type: 'string', description: 'Descripción del regalo/hospitalidad' },
            valueAmount: { type: 'number', description: 'Valor monetario' },
            valueCurrency: { type: 'string', description: 'Moneda (ej: ARS, USD)' },
            isCashOrEquivalent: { type: 'boolean', description: '¿Es efectivo o equivalente?' },
            publicOfficialInvolved: { type: 'boolean', description: '¿Involucra funcionario público?' },
            pendingBusinessDecision: { type: 'boolean', description: '¿Hay decisión comercial pendiente?' },
            businessContext: { type: 'string', description: 'Contexto empresarial' },
            frequency12m: { type: 'number', description: 'Frecuencia en últimos 12 meses' },
            complianceOfficerId: { type: 'string', description: 'ID del Oficial de Cumplimiento (opcional)' },
            requiresLegalProtection: { type: 'boolean', description: '¿Requiere protección legal del oficial?' }
          },
          required: ['eventType', 'eventId', 'offeredBy', 'receivedBy', 'description', 'valueAmount', 'valueCurrency', 'isCashOrEquivalent', 'publicOfficialInvolved', 'businessContext']
        }
      },
      {
        name: 'privacy_differential_compliance',
        description: '🔒🧠⚖️ Privacy-Differential Compliance: VaultGemma + OCDM + Legal Shield (ε≤2.0, δ≤1.1e-10)',
        inputSchema: {
          type: 'object',
          properties: {
            complianceData: {
              type: 'object',
              properties: {
                employeeRecords: { type: 'array', description: 'Registros de empleados con datos sensibles' },
                officerRecommendations: { type: 'array', description: 'Recomendaciones del Oficial de Cumplimiento' },
                giftHospitalityEvents: { type: 'array', description: 'Eventos de regalos y hospitalidad' }
              },
              required: ['employeeRecords', 'officerRecommendations', 'giftHospitalityEvents']
            },
            privacyRequirements: {
              type: 'object',
              properties: {
                maxEpsilon: { type: 'number', description: 'Máximo ε para privacy differential (default: 2.0)', default: 2.0 },
                maxDelta: { type: 'number', description: 'Máximo δ para privacy differential (default: 1.1e-10)', default: 1.1e-10 },
                requireMemorizationTest: { type: 'boolean', description: '¿Ejecutar tests de memorización VaultGemma?', default: true },
                auditLevel: { type: 'string', enum: ['basic', 'soc2', 'regulatory'], description: 'Nivel de auditoría requerido' }
              },
              required: ['auditLevel']
            },
            regulatoryContext: {
              type: 'object',
              properties: {
                framework: { type: 'string', enum: ['Ley_27401', 'NIST_AI_RMF', 'EU_AI_Act', 'Multi_Framework'], description: 'Marco regulatorio' },
                jurisdiction: { type: 'string', description: 'Jurisdicción legal (ej: Argentina, EU, US)' },
                auditScope: { type: 'string', description: 'Alcance de la auditoría' },
                riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], description: 'Nivel de riesgo organizacional' }
              },
              required: ['framework', 'jurisdiction', 'auditScope', 'riskLevel']
            },
            integration: {
              type: 'object',
              properties: {
                enableOCDMValidation: { type: 'boolean', description: '¿Habilitar validación OCDM?', default: true },
                enableLegalProtection: { type: 'boolean', description: '¿Habilitar protección Legal Shield?', default: true },
                complianceOfficerId: { type: 'string', description: 'ID del Oficial de Cumplimiento' },
                generateForensicEvidence: { type: 'boolean', description: '¿Generar evidencia forense?', default: true }
              }
            }
          },
          required: ['complianceData', 'privacyRequirements', 'regulatoryContext', 'integration']
        }
      },
    ],
  };
});

/**
 * Handler para ejecutar herramientas
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'legal_vaccination_shield': {
      const input = args as unknown as LegalVaccinationInput;
      const result = await executeLegalVaccinationShield(input);
      
      return {
        content: [
          {
            type: 'text',
            text: formatLegalVaccinationResult(result),
          },
        ],
      };
    }

    case 'basic_integrity_check': {
      const input = args as unknown as BasicIntegrityCheckInput;
      const result = await runBasicIntegrityCheck(input);
      
      return {
        content: [
          {
            type: 'text',
            text: formatIntegrityResult(result),
          },
        ],
      };
    }

    case 'ocdm_compliance_validator': {
      const input = args as unknown as OCDMValidationInput;
      const result = await executeOCDMCompliance(input);
      
      return {
        content: [
          {
            type: 'text',
            text: formatOCDMResult(result),
          },
        ],
      };
    }

    case 'privacy_differential_compliance': {
      const input = args as unknown as PrivacyDifferentialComplianceInput;
      const result = await executePrivacyDifferentialCompliance(input);
      
      return {
        content: [
          {
            type: 'text',
            text: formatPrivacyDifferentialResult(result),
          },
        ],
      };
    }

    default:
      throw new Error(`Herramienta desconocida: ${name}`);
  }
});

/**
 * Formatear resultado para presentación
 */
/**
 * Formatear resultado de vacunación legal
 */
function formatLegalVaccinationResult(result: LegalVaccinationOutput): string {
  return `# ⚖️💉 Vacuna Anti-Corrupción con Protección Legal

## 🎆 RESULTADO DE LA VACUNACIÓN
**Estado**: ${result.vaccinationStatus.toUpperCase()}
**ID de Vacunación**: ${result.vaccinationId}
**Nivel de Inmunidad**: ${result.immunityLevel}% 🛡️

## ⚖️ PROTECCIÓN LEGAL DEL OFICIAL
**Estado de Protección**: ${result.officerProtection.protectionStatus.replace('_', ' ').toUpperCase()}
**Deber Cumplido**: ${result.officerProtection.dutyFulfilled ? '✅ SÍ' : '❌ NO'}
**ID Recomendación**: ${result.officerProtection.recommendationId}

## 🔄 TRANSFERENCIA DE RESPONSABILIDAD
**Transferida**: ${result.liabilityTransfer.transferred ? '✅ SÍ' : '❌ NO'}
**Fecha**: ${new Date(result.liabilityTransfer.transferDate).toLocaleString('es-AR')}
**Empleado Reconoció**: ${result.liabilityTransfer.employeeAcknowledged ? '✅ SÍ' : '❌ NO'}

## 🗺️ EVIDENCIA LEGAL
**Prueba de Comunicación**: ${result.legalEvidence.communicationProof.length} documentos
**Respuesta del Empleado**: ${result.legalEvidence.employeeResponse}
**Hash Forense**: ${result.legalEvidence.forensicHash.substring(0, 16)}...

## 📋 COMPLIANCE LEY 27.401
**Puntuación**: ${result.legalCompliance.complianceScore}/100
**Artículos Aplicables**: ${result.legalCompliance.applicableArticles.join(', ')}
**Protección Corporativa**: ${result.legalCompliance.corporateProtection.toUpperCase()}

## 📜 CERTIFICADOS GENERADOS
• **Certificado de Vacunación**: [Ver certificado](${result.certificates.vaccinationCertificate})
• **Certificado de Protección del Oficial**: [Ver protección](${result.certificates.officerProtectionCertificate})
${result.certificates.legalDefensePackage ? `• **Paquete de Defensa Legal**: [Ver evidencia](${result.certificates.legalDefensePackage})` : ''}

---

⚠️ **IMPORTANTE**: Esta vacunación genera evidencia forense irrefutable para defensa legal ante auditorías regulatorias bajo Ley 27.401.

**🎯 RESULTADO**: ${result.liabilityTransfer.transferred ? 'Responsabilidad transferida exitosamente - Oficial protegido legalmente' : 'Pendiente de completar procedimiento'}`;
}

function formatIntegrityResult(result: BasicIntegrityCheckOutput): string {
  return `# 🔍 Evaluación de Integridad - Resultado

## 📊 Puntaje: ${result.puntaje}/100
**Nivel de Madurez**: ${result.nivel.toUpperCase()}

## 💡 Recomendaciones:
${result.recomendaciones.map(rec => `• ${rec}`).join('\n')}

## 🎯 Siguientes Pasos:
${result.siguientesPasos.map(paso => `1. ${paso}`).join('\n')}

---
${result.advertencia}

**IntegridAI Demo** - Para análisis avanzado, contactar para versión comercial.`;
}

/**
 * Formatear resultado de validación OCDM
 */
function formatOCDMResult(result: OCDMValidationOutput): string {
  return `# 🧠⚖️ OCDM Compliance Validation - Resultado

## 🎯 CUMPLIMIENTO ONTOLÓGICO
**Estado**: ${result.ocdmCompliance.isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}
**Puntuación OCDM**: ${result.ocdmCompliance.complianceScore}/100
**Nivel de Riesgo**: ${result.dashboardData.overallRiskLevel.toUpperCase()}

## 🔍 VALIDACIONES SHACL EJECUTADAS
${result.ocdmCompliance.validationResults.map(validation => 
  `${validation.passed ? '✅' : '❌'} **${validation.rule}**: ${validation.message}`
).join('\n')}

## 🧠 KNOWLEDGE GRAPH STATS
- **Triples totales**: ${result.knowledgeGraph.totalTriples}
- **Entidades**: ${result.knowledgeGraph.entitiesCount}  
- **Relaciones**: ${result.knowledgeGraph.relationshipsCount}
- **Conceptos cubiertos**: ${result.knowledgeGraph.conceptsCovered.join(', ')}

## 🚨 RECOMENDACIONES AUTOMÁTICAS

### 🔥 Acciones Inmediatas:
${result.recommendations.immediate.length > 0 ? 
  result.recommendations.immediate.map(rec => `• ${rec}`).join('\n') : 
  '• Ninguna acción crítica requerida'}

### 🛡️ Acciones Preventivas:
${result.recommendations.preventive.length > 0 ?
  result.recommendations.preventive.map(rec => `• ${rec}`).join('\n') :
  '• Continuar monitoreo regular'}

### ⚖️ Requerimientos Regulatorios:
${result.recommendations.regulatory.length > 0 ?
  result.recommendations.regulatory.map(rec => `• ${rec}`).join('\n') :
  '• Cumplimiento regulatorio completo'}

## 📊 DASHBOARD DE COMPLIANCE
- **Violaciones de política**: ${result.dashboardData.policyViolations}
- **Gaps de compliance**: ${result.dashboardData.complianceGaps.join(', ') || 'Ninguno'}
- **Próximas acciones**: ${result.dashboardData.nextActions.join(' | ')}

${result.legalProtection ? `
## ⚖️ PROTECCIÓN LEGAL INTEGRADA
**Oficial protegido**: ${result.legalProtection.officerProtected ? '✅ SÍ' : '❌ NO'}
**Evidencia generada**: ${result.legalProtection.evidenceGenerated ? '✅ SÍ' : '❌ NO'}
**Responsabilidad transferida**: ${result.legalProtection.liabilityTransferred ? '✅ SÍ' : '❌ NO'}
**Hash forense**: ${result.legalProtection.forensicHash}
` : ''}

## 📜 CERTIFICADOS OCDM GENERADOS
• **Validación OCDM**: [Ver certificado](${result.certificates.ocdmValidationCertificate})
• **Snapshot Knowledge Graph**: [Ver grafo](${result.certificates.knowledgeGraphSnapshot})
• **Reporte de Compliance**: [Ver reporte](${result.certificates.policyComplianceReport})

---

🧠 **OCDM FRAMEWORK**: Ontology-Driven Conceptual Modeling aplicado a Ley 27.401
⚖️ **SINGLE SOURCE OF TRUTH**: Governance ejecutable con evidencia automática
🎯 **RESULTADO**: ${result.ocdmCompliance.isCompliant ? 
  'Políticas transformadas en reglas ejecutables - Compliance demostrado' : 
  'Violaciones identificadas automáticamente - Acciones correctivas requeridas'}`;
}

/**
 * Formatear resultado de Privacy-Differential Compliance
 */
function formatPrivacyDifferentialResult(result: PrivacyDifferentialComplianceOutput): string {
  return `# 🔒🧠⚖️ Privacy-Differential Compliance - Resultado VaultGemma

## 🎆 CUMPLIMIENTO GENERAL
**Estado Global**: ${result.overallCompliance.privacyCompliant && result.overallCompliance.auditReady ? '✅ FULLY COMPLIANT' : '⚠️ REQUIRES ATTENTION'}
- **Privacy Compliant**: ${result.overallCompliance.privacyCompliant ? '✅' : '❌'}
- **OCDM Compliant**: ${result.overallCompliance.ocdmCompliant ? '✅' : '❌'}
- **Legally Protected**: ${result.overallCompliance.legallyProtected ? '✅' : '❌'}
- **Audit Ready**: ${result.overallCompliance.auditReady ? '✅' : '❌'}

## 🔒 VAULTGEMMA PRIVACY VALIDATION
**VaultGemma Compatible**: ${result.privacyValidation.vaultGemmaCompatible ? '✅ YES' : '❌ NO'}
**Privacy Guarantees Achieved**:
- **Epsilon (ε)**: ${result.privacyValidation.epsilonAchieved} ≤ 2.0 ${result.privacyValidation.epsilonAchieved <= 2.0 ? '✅' : '❌'}
- **Delta (δ)**: ${result.privacyValidation.deltaAchieved.toExponential(2)} ≤ 1.1e-10 ${result.privacyValidation.deltaAchieved <= 1.1e-10 ? '✅' : '❌'}
- **Noise Calibration**: ${result.privacyValidation.noiseCalibrationLevel.toFixed(4)}

## 🧪 ANTI-MEMORIZATION TESTING
**Tests Executed**: ${result.memorizationResults.testsExecuted}
**Tests Passed**: ${result.memorizationResults.testsPassed}/${result.memorizationResults.testsExecuted}
**Success Rate**: ${Math.round((result.memorizationResults.testsPassed/result.memorizationResults.testsExecuted)*100)}%

${result.memorizationResults.riskAreas.length > 0 ? `
### ⚠️ Risk Areas Detected:
${result.memorizationResults.riskAreas.map(area => `• ${area}`).join('\n')}
` : '✅ **No memorization risks detected**'}

${result.ocdmResults ? `
## 🧠 OCDM INTEGRATION RESULTS  
**Knowledge Graph**: ${result.ocdmResults.knowledgeGraphTriples} triples
**SHACL Validations**: ${result.ocdmResults.shaclValidationsPassed} passed
**OCDM Score**: ${result.ocdmResults.complianceScore}%
${result.ocdmResults.policyViolations.length > 0 ? `**Policy Violations**: ${result.ocdmResults.policyViolations.length}` : '**No Policy Violations**'}
` : ''}

${result.legalProtection ? `
## ⚖️ LEGAL COMPLIANCE SHIELD STATUS
**Officer Protected**: ${result.legalProtection.officerProtected ? '✅ YES' : '❌ NO'}
**Liability Transferred**: ${result.legalProtection.liabilityTransferred ? '✅ YES' : '❌ NO'}  
**Forensic Evidence**: ${result.legalProtection.forensicEvidenceGenerated ? '✅ GENERATED' : '❌ NOT GENERATED'}
**Evidence Hash**: ${result.legalProtection.evidenceHash || 'N/A'}
` : ''}

## 📊 DASHBOARD METRICS
- **Privacy Score**: ${result.dashboardMetrics.privacyScore}%
- **Compliance Score**: ${result.dashboardMetrics.complianceScore}%
- **Risk Level**: ${result.dashboardMetrics.riskLevel.toUpperCase()}
- **Audit Readiness**: ${result.dashboardMetrics.auditReadiness}%
- **Next Review**: ${result.dashboardMetrics.nextReviewDate}

## 💡 AUTOMATED RECOMMENDATIONS

### 🔒 Privacy Improvement:
${result.recommendations.privacyImprovement.map(rec => `• ${rec}`).join('\n')}

### ⚖️ Regulatory Alignment:
${result.recommendations.regulatoryAlignment.map(rec => `• ${rec}`).join('\n')}

### 🚀 Operational Optimization:
${result.recommendations.operationalOptimization.map(rec => `• ${rec}`).join('\n')}

### 💰 Cost Optimization:
${result.recommendations.costOptimization.map(rec => `• ${rec}`).join('\n')}

## 📋 PRIVACY CARD GENERATED
**Model ID**: ${result.documentation.privacyCard.modelId}
**Privacy Framework**: ${result.documentation.privacyCard.privacyFramework}
**Compliance Frameworks**: ${result.documentation.privacyCard.complianceFrameworks.join(', ')}
**Valid Until**: ${new Date(result.documentation.privacyCard.validUntil).toLocaleDateString('es-AR')}

## 📜 CERTIFICATES & DOCUMENTATION
• **Privacy Card**: [Ver Privacy Card](${result.documentation.privacyCardUrl})
• **Audit Trail**: ${result.documentation.auditTrail}
• **Compliance Certificates**: ${result.documentation.complianceCertificates.length} generated

---

🔒 **VAULTGEMMA INTEGRATION**: Gold standard privacy diferencial con guarantees formales
🧠 **OCDM FRAMEWORK**: Ontology-driven compliance con validación automática  
⚖️ **LEGAL SHIELD**: Protección completa del Oficial de Cumplimiento Ley 27.401
🎯 **RESULTADO**: ${result.overallCompliance.auditReady ? 
  'Sistema con privacy máxima + compliance automático + protección legal completa' : 
  'Requiere atención en áreas identificadas - Ver recomendaciones específicas'}`;
}

/**
 * Inicializar servidor
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('🚀 IntegridAI MCP Server con Privacy-Differential + OCDM + Legal Shield iniciado');
  console.error('📋 Herramientas disponibles:');
  console.error('   • legal_vaccination_shield - Vacuna Anti-Corrupción + Protección Legal');
  console.error('   • basic_integrity_check - Evaluación básica de integridad');
  console.error('   • ocdm_compliance_validator - OCDM: Ontology-Driven Compliance Ley 27.401');
  console.error('   • privacy_differential_compliance - 🔒 VaultGemma + OCDM + Legal Shield');
  console.error('⚖️  PROTECCIÓN LEGAL LEY 27.401 INCLUIDA');
  console.error('🧠 OCDM FRAMEWORK: Transform policy into executable strategy');
  console.error('🔒 VAULTGEMMA PRIVACY: Gold standard privacy (ε≤2.0, δ≤1.1e-10)');
}

main().catch((error) => {
  console.error('Error iniciando servidor MCP:', error);
  process.exit(1);
});