/**
 * Verificador Básico de Compliance Ley 27.401
 * 
 * Evalúa el nivel de cumplimiento de los requisitos básicos
 * de la Ley de Responsabilidad Penal Empresaria
 */

interface ComplianceCheckInput {
  policies: string[];
  trainings?: string[];
  controls?: string[];
  lastAuditDate?: string;
}

interface ComplianceCheckResult {
  overallCompliance: number;
  status: 'Crítico' | 'Básico' | 'Satisfactorio' | 'Avanzado';
  requiredElements: {
    element: string;
    status: 'Completo' | 'Parcial' | 'Faltante';
    description: string;
    priority: 'Alta' | 'Media' | 'Baja';
  }[];
  recommendations: string[];
  legalGaps: string[];
  implementation: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export async function complianceCheckerTool(
  input: ComplianceCheckInput
): Promise<{ content: [{ type: 'text'; text: string }] }> {
  
  try {
    const complianceCheck = evaluateCompliance(input);
    
    const result = {
      complianceAssessment: complianceCheck,
      detailedAnalysis: generateDetailedAnalysis(complianceCheck),
      actionPlan: generateActionPlan(complianceCheck),
      legalFramework: getLegalFrameworkReference()
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
    throw new Error(`Error en verificación de compliance: ${error}`);
  }
}

function evaluateCompliance(input: ComplianceCheckInput): ComplianceCheckResult {
  const requiredElements = getLey27401Requirements();
  const policies = input.policies || [];
  const trainings = input.trainings || [];
  const controls = input.controls || [];
  
  let totalScore = 0;
  const maxScore = requiredElements.length;
  
  // Evaluar cada elemento requerido
  const evaluatedElements = requiredElements.map(element => {
    const evaluation = evaluateElement(element, policies, trainings, controls, input.lastAuditDate);
    
    // Asignar puntaje según estado
    if (evaluation.status === 'Completo') totalScore += 1;
    else if (evaluation.status === 'Parcial') totalScore += 0.5;
    
    return evaluation;
  });

  const compliancePercentage = Math.round((totalScore / maxScore) * 100);
  
  // Determinar status general
  let status: 'Crítico' | 'Básico' | 'Satisfactorio' | 'Avanzado';
  if (compliancePercentage >= 85) status = 'Avanzado';
  else if (compliancePercentage >= 70) status = 'Satisfactorio';
  else if (compliancePercentage >= 50) status = 'Básico';
  else status = 'Crítico';

  const recommendations = generateRecommendations(evaluatedElements, status);
  const legalGaps = identifyLegalGaps(evaluatedElements);
  const implementation = generateImplementationPlan(evaluatedElements, status);

  return {
    overallCompliance: compliancePercentage,
    status,
    requiredElements: evaluatedElements,
    recommendations,
    legalGaps,
    implementation
  };
}

function getLey27401Requirements() {
  return [
    {
      id: 'codigo_etica',
      element: 'Código de Ética',
      description: 'Código de ética y conducta empresarial',
      legalReference: 'Art. 23 inc. a) Ley 27.401',
      priority: 'Alta' as const,
      keywords: ['código', 'ética', 'conducta', 'valores', 'principios']
    },
    {
      id: 'politicas_anticorrupcion',
      element: 'Políticas Anticorrupción',
      description: 'Políticas específicas de prevención de corrupción',
      legalReference: 'Art. 23 inc. a) Ley 27.401',
      priority: 'Alta' as const,
      keywords: ['anticorrupción', 'soborno', 'cohecho', 'regalos', 'hospitalidad']
    },
    {
      id: 'capacitacion',
      element: 'Programa de Capacitación',
      description: 'Capacitación periódica en temas de integridad',
      legalReference: 'Art. 23 inc. b) Ley 27.401',
      priority: 'Alta' as const,
      keywords: ['capacitación', 'entrenamiento', 'formación', 'educación']
    },
    {
      id: 'canal_denuncias',
      element: 'Canal de Denuncias',
      description: 'Sistema de denuncias interno',
      legalReference: 'Art. 23 inc. c) Ley 27.401',
      priority: 'Alta' as const,
      keywords: ['denuncias', 'reporte', 'canal', 'línea ética', 'whistleblowing']
    },
    {
      id: 'due_diligence',
      element: 'Due Diligence de Terceros',
      description: 'Evaluación de riesgos de terceras partes',
      legalReference: 'Art. 23 inc. d) Ley 27.401',
      priority: 'Media' as const,
      keywords: ['due diligence', 'terceros', 'proveedores', 'socios', 'evaluación']
    },
    {
      id: 'controles_internos',
      element: 'Controles Internos',
      description: 'Sistema de controles internos y auditoría',
      legalReference: 'Art. 23 inc. e) Ley 27.401',
      priority: 'Media' as const,
      keywords: ['controles', 'auditoría', 'supervisión', 'monitoreo']
    },
    {
      id: 'disciplinario',
      element: 'Régimen Disciplinario',
      description: 'Sistema disciplinario por infracciones',
      legalReference: 'Art. 23 inc. f) Ley 27.401',
      priority: 'Media' as const,
      keywords: ['disciplinario', 'sanciones', 'infracciones', 'medidas']
    },
    {
      id: 'oficial_compliance',
      element: 'Oficial de Compliance',
      description: 'Designación de responsable de compliance',
      legalReference: 'Art. 23 Ley 27.401',
      priority: 'Alta' as const,
      keywords: ['oficial', 'responsable', 'compliance', 'coordinador']
    }
  ];
}

function evaluateElement(
  element: any,
  policies: string[],
  trainings: string[],
  controls: string[],
  lastAuditDate?: string
) {
  const allContent = [...policies, ...trainings, ...controls].join(' ').toLowerCase();
  
  // Buscar keywords del elemento en el contenido
  const foundKeywords = element.keywords.filter((keyword: string) => 
    allContent.includes(keyword.toLowerCase())
  );
  
  let status: 'Completo' | 'Parcial' | 'Faltante';
  
  if (foundKeywords.length >= element.keywords.length * 0.7) {
    status = 'Completo';
  } else if (foundKeywords.length >= element.keywords.length * 0.3) {
    status = 'Parcial';
  } else {
    status = 'Faltante';
  }
  
  // Consideraciones especiales
  if (element.id === 'controles_internos' && lastAuditDate) {
    const auditDate = new Date(lastAuditDate);
    const now = new Date();
    const monthsDiff = (now.getTime() - auditDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsDiff > 12 && status === 'Completo') {
      status = 'Parcial'; // Auditoría muy antigua
    }
  }

  return {
    element: element.element,
    status,
    description: element.description,
    priority: element.priority
  };
}

function generateRecommendations(
  elements: any[],
  status: 'Crítico' | 'Básico' | 'Satisfactorio' | 'Avanzado'
): string[] {
  const recommendations: string[] = [];
  
  // Recomendaciones por elementos faltantes
  const faltantes = elements.filter(e => e.status === 'Faltante');
  const parciales = elements.filter(e => e.status === 'Parcial');
  
  if (faltantes.length > 0) {
    recommendations.push('PRIORIDAD CRÍTICA: Implementar elementos faltantes de Ley 27.401');
    faltantes.forEach(e => {
      if (e.priority === 'Alta') {
        recommendations.push(`• Desarrollar inmediatamente: ${e.element}`);
      }
    });
  }
  
  if (parciales.length > 0) {
    recommendations.push('MEJORAR: Completar elementos parcialmente implementados');
    parciales.forEach(e => {
      recommendations.push(`• Fortalecer: ${e.element}`);
    });
  }
  
  // Recomendaciones por status general
  switch (status) {
    case 'Crítico':
      recommendations.push(
        'Contratar consultor especializado en Ley 27.401',
        'Implementar programa de compliance urgente',
        'Establecer cronograma intensivo de implementación'
      );
      break;
    case 'Básico':
      recommendations.push(
        'Fortalecer programa de compliance existente',
        'Mejorar documentación de políticas y procedimientos',
        'Intensificar capacitación del personal'
      );
      break;
    case 'Satisfactorio':
      recommendations.push(
        'Mantener y mejorar programa actual',
        'Implementar métricas de efectividad',
        'Considerar certificación ISO 37001'
      );
      break;
    case 'Avanzado':
      recommendations.push(
        'Mantener liderazgo en compliance',
        'Compartir mejores prácticas con otras organizaciones',
        'Considerar auditoría externa independiente'
      );
      break;
  }
  
  return recommendations;
}

function identifyLegalGaps(elements: any[]): string[] {
  const gaps: string[] = [];
  
  const altaPrioridadFaltantes = elements.filter(
    e => e.status === 'Faltante' && e.priority === 'Alta'
  );
  
  if (altaPrioridadFaltantes.length > 0) {
    gaps.push('RIESGO LEGAL ALTO: Elementos obligatorios de Ley 27.401 sin implementar');
    
    altaPrioridadFaltantes.forEach(element => {
      gaps.push(`• ${element.element}: Requerido por Ley 27.401 Art. 23`);
    });
  }
  
  const totalFaltantes = elements.filter(e => e.status === 'Faltante').length;
  if (totalFaltantes >= 4) {
    gaps.push('Programa de integridad insuficiente para defensa en procedimientos penales');
  }
  
  return gaps;
}

function generateImplementationPlan(
  elements: any[],
  status: 'Crítico' | 'Básico' | 'Satisfactorio' | 'Avanzado'
) {
  const faltantes = elements.filter(e => e.status === 'Faltante');
  const parciales = elements.filter(e => e.status === 'Parcial');
  
  return {
    immediate: [
      ...faltantes.filter(e => e.priority === 'Alta').map(e => 
        `Implementar ${e.element}`
      ),
      'Designar responsable de compliance',
      'Establecer cronograma de implementación'
    ],
    shortTerm: [
      ...faltantes.filter(e => e.priority === 'Media').map(e => 
        `Desarrollar ${e.element}`
      ),
      ...parciales.map(e => `Completar ${e.element}`),
      'Capacitar equipo directivo en Ley 27.401'
    ],
    longTerm: [
      'Implementar sistema de métricas de compliance',
      'Realizar auditoría independiente del programa',
      'Establecer programa de mejora continua',
      'Considerar certificación ISO 37001'
    ]
  };
}

function generateDetailedAnalysis(check: ComplianceCheckResult): string {
  return `
📊 ANÁLISIS DETALLADO DE COMPLIANCE

🎯 NIVEL DE CUMPLIMIENTO: ${check.overallCompliance}%
📊 STATUS: ${check.status}

📋 ESTADO POR ELEMENTO:

${check.requiredElements.map(element => `
${element.status === 'Completo' ? '✅' : element.status === 'Parcial' ? '🟡' : '❌'} ${element.element} - ${element.status}
   Prioridad: ${element.priority}
   ${element.description}
`).join('')}

⚠️ BRECHAS LEGALES IDENTIFICADAS:
${check.legalGaps.length > 0 
  ? check.legalGaps.map(gap => `• ${gap}`).join('\n')
  : '• No se identificaron brechas legales críticas'
}

🎯 RECOMENDACIONES PRIORITARIAS:
${check.recommendations.map(rec => `• ${rec}`).join('\n')}
  `;
}

function generateActionPlan(check: ComplianceCheckResult): string {
  return `
📋 PLAN DE ACCIÓN DETALLADO

🚨 ACCIONES INMEDIATAS (0-30 días):
${check.implementation.immediate.map(action => `• ${action}`).join('\n')}

📅 ACCIONES A CORTO PLAZO (1-6 meses):
${check.implementation.shortTerm.map(action => `• ${action}`).join('\n')}

🎯 ACCIONES A LARGO PLAZO (6-12 meses):
${check.implementation.longTerm.map(action => `• ${action}`).join('\n')}

💡 CRONOGRAMA SUGERIDO:
• Mes 1: Elementos críticos faltantes
• Mes 2-3: Políticas y procedimientos
• Mes 4-6: Capacitación y comunicación
• Mes 7-12: Monitoreo y mejora continua
  `;
}

function getLegalFrameworkReference(): string {
  return `
⚖️ MARCO LEGAL DE REFERENCIA

📜 LEY 27.401 - RESPONSABILIDAD PENAL EMPRESARIA
• Art. 1: Responsabilidad penal de personas jurídicas
• Art. 23: Programas de integridad (elementos mínimos)
• Art. 24: Atenuación de la pena por programa de integridad

📚 NORMATIVA COMPLEMENTARIA:
• Código Penal - Delitos contra la administración pública
• ISO 37001:2016 - Sistemas de gestión antisoborno
• Guías UIF - Prevención de lavado de activos
• Resolución CNV - Información privilegiada

🏛️ AUTORIDADES DE APLICACIÓN:
• Ministerio Público Fiscal
• Unidad de Información Financiera (UIF)
• Comisión Nacional de Valores (CNV)
• Superintendencia de Seguros de la Nación (SSN)

📞 RECURSOS ADICIONALES:
• Guía práctica Ley 27.401 (disponible en sitio UIF)
• Manual de buenas prácticas empresariales
• Modelos de políticas y procedimientos
• Programas de capacitación especializados
  `;
}