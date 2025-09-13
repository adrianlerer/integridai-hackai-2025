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
      const input = args as LegalVaccinationInput;
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
      const input = args as BasicIntegrityCheckInput;
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

**🎯 RESULTADO**: ${result.liabilityTransfer.transferred ? 'Responsabilidad transferida exitosamente - Oficial protegido leg'}`;
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
 * Inicializar servidor
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('🚀 IntegridAI MCP Server con Legal Compliance Shield iniciado');
  console.error('📋 Herramientas disponibles:');
  console.error('   • legal_vaccination_shield - Vacuna Anti-Corrupción + Protección Legal');
  console.error('   • basic_integrity_check - Evaluación básica de integridad');
  console.error('⚖️  PROTECCIÓN LEGAL LEY 27.401 INCLUIDA');
}

main().catch((error) => {
  console.error('Error iniciando servidor MCP:', error);
  process.exit(1);
});