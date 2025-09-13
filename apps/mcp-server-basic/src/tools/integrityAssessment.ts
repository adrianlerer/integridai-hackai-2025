/**
 * Herramienta de Evaluación de Integridad Empresarial
 * 
 * Evalúa el nivel de integridad de una empresa según parámetros básicos
 * de la Ley 27.401 (Responsabilidad Penal Empresaria)
 */

interface IntegrityAssessmentInput {
  companyName: string;
  sector: 'tecnologia' | 'finanzas' | 'consultoria' | 'manufactura' | 'servicios' | 'otro';
  employeeCount: number;
  hasComplianceProgram: boolean;
  riskAreas?: string[];
}

interface IntegrityAssessmentResult {
  overallScore: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  complianceGaps: string[];
  nextSteps: string[];
}

export async function integrityAssessmentTool(
  input: IntegrityAssessmentInput
): Promise<{ content: [{ type: 'text'; text: string }] }> {
  
  try {
    const assessment = calculateIntegrityScore(input);
    
    const result = {
      company: input.companyName,
      assessment: assessment,
      summary: generateAssessmentSummary(assessment, input),
      detailedAnalysis: generateDetailedAnalysis(assessment, input),
      compliancePlan: generateBasicCompliancePlan(assessment, input)
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };

  } catch (error) {
    throw new Error(`Error en evaluación de integridad: ${error}`);
  }
}

function calculateIntegrityScore(input: IntegrityAssessmentInput): IntegrityAssessmentResult {
  let score = 0;
  const recommendations: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const complianceGaps: string[] = [];
  const nextSteps: string[] = [];

  // Evaluación del programa de compliance (40% del puntaje)
  if (input.hasComplianceProgram) {
    score += 40;
    strengths.push('Cuenta con programa de compliance establecido');
  } else {
    weaknesses.push('No tiene programa de compliance formal');
    complianceGaps.push('Implementar programa de compliance según Art. 23 Ley 27.401');
    recommendations.push('Desarrollar e implementar un programa de integridad empresarial');
    nextSteps.push('1. Designar oficial de compliance');
  }

  // Evaluación por tamaño de empresa (20% del puntaje)
  if (input.employeeCount >= 500) {
    score += 15; // Empresas grandes necesitan más controles
    recommendations.push('Implementar controles específicos para empresas de gran escala');
  } else if (input.employeeCount >= 50) {
    score += 20;
    strengths.push('Tamaño empresarial permite implementación efectiva de controles');
  } else {
    score += 10;
    recommendations.push('Adaptar controles al tamaño de la organización');
  }

  // Evaluación por sector de riesgo (25% del puntaje)
  const sectorRisk = getSectorRiskProfile(input.sector);
  score += sectorRisk.score;
  
  if (sectorRisk.isHighRisk) {
    recommendations.push(`Sector ${input.sector} requiere controles específicos adicionales`);
    complianceGaps.push('Implementar due diligence reforzado para sector de alto riesgo');
  } else {
    strengths.push(`Sector ${input.sector} presenta riesgo moderado`);
  }

  // Evaluación de áreas de riesgo identificadas (15% del puntaje)
  const riskAreaCount = input.riskAreas?.length || 0;
  if (riskAreaCount === 0) {
    score += 15;
    strengths.push('No se identificaron áreas de riesgo específicas');
  } else if (riskAreaCount <= 2) {
    score += 10;
    recommendations.push('Desarrollar controles específicos para las áreas de riesgo identificadas');
  } else {
    score += 5;
    weaknesses.push('Múltiples áreas de riesgo requieren atención prioritaria');
    complianceGaps.push('Mapeo de riesgos y controles específicos por área');
  }

  // Determinar nivel de riesgo
  let riskLevel: 'Bajo' | 'Medio' | 'Alto';
  if (score >= 75) {
    riskLevel = 'Bajo';
  } else if (score >= 50) {
    riskLevel = 'Medio';
  } else {
    riskLevel = 'Alto';
  }

  // Agregar recomendaciones específicas por nivel de riesgo
  if (riskLevel === 'Alto') {
    nextSteps.push(
      '2. Realizar diagnóstico completo de riesgos',
      '3. Implementar políticas básicas de compliance',
      '4. Establecer canal de denuncias',
      '5. Planificar capacitación inicial'
    );
  } else if (riskLevel === 'Medio') {
    nextSteps.push(
      '2. Fortalecer controles existentes',
      '3. Implementar due diligence de terceros',
      '4. Establecer métricas de compliance',
      '5. Revisar y actualizar políticas'
    );
  } else {
    nextSteps.push(
      '2. Mantener y mejorar programa existente',
      '3. Implementar auditoría independiente',
      '4. Desarrollar cultura de integridad',
      '5. Establecer benchmarking sectorial'
    );
  }

  return {
    overallScore: Math.round(score),
    riskLevel,
    recommendations,
    strengths,
    weaknesses,
    complianceGaps,
    nextSteps
  };
}

function getSectorRiskProfile(sector: string): { score: number; isHighRisk: boolean } {
  const profiles = {
    'finanzas': { score: 15, isHighRisk: true },
    'tecnologia': { score: 20, isHighRisk: false },
    'consultoria': { score: 18, isHighRisk: false },
    'manufactura': { score: 20, isHighRisk: false },
    'servicios': { score: 22, isHighRisk: false },
    'otro': { score: 18, isHighRisk: false }
  };

  return profiles[sector as keyof typeof profiles] || profiles.otro;
}

function generateAssessmentSummary(
  assessment: IntegrityAssessmentResult, 
  input: IntegrityAssessmentInput
): string {
  return `
📊 RESUMEN EJECUTIVO DE INTEGRIDAD

Empresa: ${input.companyName}
Sector: ${input.sector.toUpperCase()}
Empleados: ${input.employeeCount}

🎯 PUNTUACIÓN GENERAL: ${assessment.overallScore}/100
🚨 NIVEL DE RIESGO: ${assessment.riskLevel}

${assessment.riskLevel === 'Alto' ? '⚠️' : assessment.riskLevel === 'Medio' ? '⚡' : '✅'} ESTADO: ${
    assessment.riskLevel === 'Alto' 
      ? 'Requiere atención inmediata para cumplir Ley 27.401'
      : assessment.riskLevel === 'Medio'
      ? 'Cumplimiento básico, mejoras recomendadas'
      : 'Buen nivel de compliance, mantener y mejorar'
  }
  `.trim();
}

function generateDetailedAnalysis(
  assessment: IntegrityAssessmentResult,
  input: IntegrityAssessmentInput
): string {
  return `
📋 ANÁLISIS DETALLADO

🟢 FORTALEZAS IDENTIFICADAS:
${assessment.strengths.map(s => `• ${s}`).join('\n')}

🔴 DEBILIDADES A CORREGIR:
${assessment.weaknesses.length > 0 
  ? assessment.weaknesses.map(w => `• ${w}`).join('\n')
  : '• No se identificaron debilidades críticas'
}

⚖️ BRECHAS DE COMPLIANCE LEY 27.401:
${assessment.complianceGaps.length > 0
  ? assessment.complianceGaps.map(g => `• ${g}`).join('\n')
  : '• No se identificaron brechas críticas de compliance'
}

🎯 RECOMENDACIONES PRIORITARIAS:
${assessment.recommendations.map(r => `• ${r}`).join('\n')}
  `.trim();
}

function generateBasicCompliancePlan(
  assessment: IntegrityAssessmentResult,
  input: IntegrityAssessmentInput
): string {
  return `
📋 PLAN BÁSICO DE COMPLIANCE

🚀 PASOS INMEDIATOS (30 días):
${assessment.nextSteps.map(step => `${step}`).join('\n')}

⏰ CRONOGRAMA SUGERIDO:
• Mes 1: Diagnóstico y políticas básicas
• Mes 2-3: Implementación de controles
• Mes 4-6: Capacitación y comunicación
• Mes 7-12: Monitoreo y mejora continua

💡 RECURSOS RECOMENDADOS:
• Guía práctica Ley 27.401 (UIF Argentina)
• Template de políticas de compliance
• Capacitación básica en ética empresarial
• Software de gestión de compliance (opcional)

📞 PRÓXIMOS PASOS:
1. Revisar este reporte con equipo directivo
2. Asignar responsable de compliance
3. Establecer presupuesto para implementación
4. Planificar cronograma detallado
  `.trim();
}