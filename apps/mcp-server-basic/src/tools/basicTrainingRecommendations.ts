/**
 * Generador de Recomendaciones Básicas de Entrenamiento
 * 
 * Genera planes de capacitación en ética empresarial
 * adaptados por departamento y nivel de experiencia
 */

interface TrainingRecommendationInput {
  department: 'ventas' | 'compras' | 'finanzas' | 'rrhh' | 'operaciones' | 'general';
  experienceLevel: 'junior' | 'semi-senior' | 'senior' | 'ejecutivo';
  previousIncidents?: boolean;
  timeAvailable: number;
}

interface TrainingModule {
  title: string;
  duration: number; // en horas
  priority: 'Alta' | 'Media' | 'Baja';
  content: string[];
  deliveryMethod: 'Presencial' | 'Virtual' | 'E-learning' | 'Mixto';
  assessmentMethod: string;
  frequency: 'Una vez' | 'Anual' | 'Semestral' | 'Trimestral';
}

interface TrainingPlan {
  totalDuration: number;
  targetAudience: string;
  objectives: string[];
  modules: TrainingModule[];
  implementation: {
    timeline: string;
    resources: string[];
    budget: string;
    kpis: string[];
  };
  followUp: {
    assessments: string[];
    reinforcements: string[];
    continuousImprovement: string[];
  };
}

export async function basicTrainingRecommendationsTool(
  input: TrainingRecommendationInput
): Promise<{ content: [{ type: 'text'; text: string }] }> {
  
  try {
    const trainingPlan = generateTrainingPlan(input);
    
    const result = {
      trainingPlan: trainingPlan,
      departmentSpecificRisks: getDepartmentRisks(input.department),
      levelSpecificContent: getLevelSpecificContent(input.experienceLevel),
      implementationGuide: generateImplementationGuide(trainingPlan, input)
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
    throw new Error(`Error generando recomendaciones de entrenamiento: ${error}`);
  }
}

function generateTrainingPlan(input: TrainingRecommendationInput): TrainingPlan {
  const baseModules = getBaseModules();
  const departmentModules = getDepartmentSpecificModules(input.department);
  const levelModules = getLevelSpecificModules(input.experienceLevel);
  
  // Combinar módulos y priorizar según tiempo disponible
  let allModules = [...baseModules, ...departmentModules, ...levelModules];
  
  // Ajustar prioridades si hay incidentes previos
  if (input.previousIncidents) {
    allModules = adjustForIncidents(allModules, input.department);
  }
  
  // Filtrar y ajustar según tiempo disponible
  const selectedModules = optimizeForTime(allModules, input.timeAvailable);
  
  const totalDuration = selectedModules.reduce((sum, module) => sum + module.duration, 0);
  
  return {
    totalDuration,
    targetAudience: `Departamento de ${input.department} - Nivel ${input.experienceLevel}`,
    objectives: generateObjectives(input.department, input.experienceLevel, input.previousIncidents),
    modules: selectedModules,
    implementation: generateImplementation(selectedModules, input.timeAvailable),
    followUp: generateFollowUp(input.department, input.experienceLevel)
  };
}

function getBaseModules(): TrainingModule[] {
  return [
    {
      title: 'Fundamentos de Ética Empresarial',
      duration: 2,
      priority: 'Alta',
      content: [
        'Principios básicos de ética empresarial',
        'Código de conducta organizacional',
        'Valores corporativos y su aplicación práctica',
        'Responsabilidad individual vs. organizacional'
      ],
      deliveryMethod: 'Mixto',
      assessmentMethod: 'Cuestionario + Casos prácticos',
      frequency: 'Anual'
    },
    {
      title: 'Introducción a la Ley 27.401',
      duration: 1.5,
      priority: 'Alta',
      content: [
        'Marco legal de responsabilidad penal empresaria',
        'Delitos cubiertos por la ley',
        'Consecuencias para personas físicas y jurídicas',
        'Programas de integridad como defensa'
      ],
      deliveryMethod: 'Virtual',
      assessmentMethod: 'Evaluación en línea',
      frequency: 'Anual'
    },
    {
      title: 'Identificación de Conflictos de Interés',
      duration: 1,
      priority: 'Alta',
      content: [
        'Definición y tipos de conflictos de interés',
        'Identificación proactiva de situaciones de riesgo',
        'Procedimientos de declaración y recusación',
        'Casos prácticos por sector'
      ],
      deliveryMethod: 'E-learning',
      assessmentMethod: 'Simulaciones interactivas',
      frequency: 'Anual'
    },
    {
      title: 'Canal de Denuncias y Reporte',
      duration: 0.5,
      priority: 'Media',
      content: [
        'Funcionamiento del canal de denuncias',
        'Protección de whistleblowers',
        'Procedimiento de investigación',
        'No represalias por reportes de buena fe'
      ],
      deliveryMethod: 'E-learning',
      assessmentMethod: 'Quiz interactivo',
      frequency: 'Anual'
    }
  ];
}

function getDepartmentSpecificModules(department: string): TrainingModule[] {
  const modules = {
    ventas: [
      {
        title: 'Ética en Ventas y Relaciones Comerciales',
        duration: 2,
        priority: 'Alta' as const,
        content: [
          'Regalos y hospitalidades en ventas',
          'Comisiones y pagos a terceros',
          'Competencia leal y prácticas comerciales',
          'Due diligence de clientes'
        ],
        deliveryMethod: 'Presencial' as const,
        assessmentMethod: 'Role playing + Evaluación',
        frequency: 'Semestral' as const
      }
    ],
    compras: [
      {
        title: 'Integridad en Procurement y Proveedores',
        duration: 2.5,
        priority: 'Alta' as const,
        content: [
          'Selección ética de proveedores',
          'Manejo de regalos y ofertas de proveedores',
          'Due diligence de terceras partes',
          'Contratos y transparencia en licitaciones'
        ],
        deliveryMethod: 'Mixto' as const,
        assessmentMethod: 'Casos reales + Evaluación escrita',
        frequency: 'Semestral' as const
      }
    ],
    finanzas: [
      {
        title: 'Controles Financieros e Integridad',
        duration: 3,
        priority: 'Alta' as const,
        content: [
          'Controles internos financieros',
          'Prevención de fraude contable',
          'Información privilegiada y mercado de valores',
          'Lavado de dinero y compliance financiero'
        ],
        deliveryMethod: 'Presencial' as const,
        assessmentMethod: 'Examen técnico + Análisis de casos',
        frequency: 'Anual' as const
      }
    ],
    rrhh: [
      {
        title: 'Ética en Gestión de Personas',
        duration: 2,
        priority: 'Alta' as const,
        content: [
          'Selección ética de personal',
          'Manejo de información confidencial de empleados',
          'Prevención de acoso y discriminación',
          'Cultura organizacional e integridad'
        ],
        deliveryMethod: 'Mixto' as const,
        assessmentMethod: 'Estudio de casos + Presentación',
        frequency: 'Anual' as const
      }
    ],
    operaciones: [
      {
        title: 'Integridad Operacional y Controles',
        duration: 1.5,
        priority: 'Media' as const,
        content: [
          'Controles operacionales de integridad',
          'Manejo ético de información operacional',
          'Relaciones con reguladores y auditorías',
          'Seguridad y confidencialidad de procesos'
        ],
        deliveryMethod: 'E-learning' as const,
        assessmentMethod: 'Evaluación práctica',
        frequency: 'Anual' as const
      }
    ],
    general: [
      {
        title: 'Cultura de Integridad Organizacional',
        duration: 1,
        priority: 'Media' as const,
        content: [
          'Valores organizacionales en la práctica diaria',
          'Liderazgo ético en todos los niveles',
          'Comunicación de dilemas éticos',
          'Responsabilidad compartida de integridad'
        ],
        deliveryMethod: 'Virtual' as const,
        assessmentMethod: 'Reflexión personal + Compromiso',
        frequency: 'Anual' as const
      }
    ]
  };

  return modules[department as keyof typeof modules] || [];
}

function getLevelSpecificModules(level: string): TrainingModule[] {
  const modules = {
    junior: [
      {
        title: 'Ética para Nuevos Empleados',
        duration: 1,
        priority: 'Alta' as const,
        content: [
          'Inducción en valores organizacionales',
          'Situaciones éticas básicas del día a día',
          'A quién consultar ante dudas éticas',
          'Recursos y herramientas disponibles'
        ],
        deliveryMethod: 'Presencial' as const,
        assessmentMethod: 'Evaluación básica',
        frequency: 'Una vez' as const
      }
    ],
    'semi-senior': [
      {
        title: 'Dilemas Éticos Intermedios',
        duration: 1.5,
        priority: 'Media' as const,
        content: [
          'Casos complejos de toma de decisiones',
          'Balanceando objetivos comerciales y ética',
          'Influencia en equipos junior',
          'Escalamiento de situaciones éticas'
        ],
        deliveryMethod: 'Mixto' as const,
        assessmentMethod: 'Análisis de casos complejos',
        frequency: 'Anual' as const
      }
    ],
    senior: [
      {
        title: 'Liderazgo Ético y Mentoring',
        duration: 2,
        priority: 'Alta' as const,
        content: [
          'Modelado de comportamiento ético',
          'Coaching ético para equipos',
          'Toma de decisiones éticas bajo presión',
          'Construcción de cultura ética departamental'
        ],
        deliveryMethod: 'Presencial' as const,
        assessmentMethod: 'Plan de liderazgo ético',
        frequency: 'Anual' as const
      }
    ],
    ejecutivo: [
      {
        title: 'Governance y Responsabilidad Ejecutiva',
        duration: 3,
        priority: 'Alta' as const,
        content: [
          'Responsabilidad legal de directivos',
          'Tone at the top y cultura organizacional',
          'Due diligence empresarial y M&A',
          'Crisis management y reputación corporativa'
        ],
        deliveryMethod: 'Presencial' as const,
        assessmentMethod: 'Simulacro de crisis + Plan estratégico',
        frequency: 'Anual' as const
      }
    ]
  };

  return modules[level as keyof typeof modules] || [];
}

function adjustForIncidents(modules: TrainingModule[], department: string): TrainingModule[] {
  // Aumentar prioridad de módulos relevantes si hubo incidentes
  return modules.map(module => {
    if (module.title.toLowerCase().includes(department.toLowerCase()) ||
        module.title.includes('Conflictos') ||
        module.title.includes('Canal de Denuncias')) {
      return {
        ...module,
        priority: 'Alta' as const,
        frequency: 'Trimestral' as const,
        duration: module.duration * 1.2 // Aumentar duración 20%
      };
    }
    return module;
  });
}

function optimizeForTime(modules: TrainingModule[], timeAvailable: number): TrainingModule[] {
  // Ordenar por prioridad
  const sorted = modules.sort((a, b) => {
    const priorities = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
    return priorities[b.priority] - priorities[a.priority];
  });
  
  // Seleccionar módulos que caben en el tiempo disponible
  const selected: TrainingModule[] = [];
  let totalTime = 0;
  
  for (const module of sorted) {
    if (totalTime + module.duration <= timeAvailable) {
      selected.push(module);
      totalTime += module.duration;
    }
  }
  
  // Si no se seleccionó nada, incluir al menos el módulo más prioritario (ajustado)
  if (selected.length === 0 && sorted.length > 0) {
    const priority = { ...sorted[0] };
    priority.duration = Math.min(timeAvailable, priority.duration);
    selected.push(priority);
  }
  
  return selected;
}

function generateObjectives(
  department: string, 
  level: string, 
  previousIncidents?: boolean
): string[] {
  const baseObjectives = [
    'Desarrollar conciencia ética en el entorno laboral',
    'Conocer y aplicar los principios de la Ley 27.401',
    'Identificar y manejar conflictos de interés',
    'Promover una cultura de integridad organizacional'
  ];
  
  const departmentObjectives = {
    ventas: ['Manejar éticamente las relaciones comerciales y de ventas'],
    compras: ['Aplicar due diligence ético en la selección de proveedores'],
    finanzas: ['Implementar controles financieros de integridad'],
    rrhh: ['Promover prácticas éticas en la gestión de personas'],
    operaciones: ['Mantener integridad en procesos operacionales'],
    general: ['Contribuir a la cultura de integridad organizacional']
  };
  
  const levelObjectives = {
    junior: ['Establecer fundamentos sólidos de comportamiento ético'],
    'semi-senior': ['Desarrollar habilidades de toma de decisiones éticas'],
    senior: ['Ejercer liderazgo ético y mentoring de equipos'],
    ejecutivo: ['Establecer el tone at the top y governance ético']
  };
  
  let objectives = [...baseObjectives];
  
  if (departmentObjectives[department as keyof typeof departmentObjectives]) {
    objectives.push(...departmentObjectives[department as keyof typeof departmentObjectives]);
  }
  
  if (levelObjectives[level as keyof typeof levelObjectives]) {
    objectives.push(...levelObjectives[level as keyof typeof levelObjectives]);
  }
  
  if (previousIncidents) {
    objectives.push('Prevenir la recurrencia de incidentes éticos similares');
  }
  
  return objectives;
}

function generateImplementation(modules: TrainingModule[], timeAvailable: number) {
  return {
    timeline: timeAvailable <= 8 ? 'Programa intensivo de 2 semanas' :
             timeAvailable <= 20 ? 'Programa distribuido en 1 mes' :
             'Programa extendido de 2-3 meses',
    resources: [
      'Facilitador interno o consultor externo especializado',
      'Material didáctico y casos de estudio',
      'Plataforma e-learning (si aplica)',
      'Espacio físico o virtual para sesiones',
      'Sistema de evaluación y seguimiento'
    ],
    budget: timeAvailable <= 10 ? 'Presupuesto bajo ($50,000-$100,000)' :
           timeAvailable <= 30 ? 'Presupuesto medio ($100,000-$250,000)' :
           'Presupuesto alto ($250,000-$500,000)',
    kpis: [
      'Porcentaje de participación (meta: >95%)',
      'Puntaje promedio en evaluaciones (meta: >85%)',
      'Número de consultas éticas reportadas',
      'Reducción de incidentes éticos (si aplica)',
      'Satisfacción del participante (meta: >4/5)'
    ]
  };
}

function generateFollowUp(department: string, level: string) {
  return {
    assessments: [
      'Evaluación post-entrenamiento inmediata',
      'Evaluación de retención a 30 días',
      'Evaluación práctica a 90 días',
      'Evaluación anual de cultura ética'
    ],
    reinforcements: [
      'Comunicaciones mensuales sobre ética',
      'Casos de estudio trimestrales',
      'Sesiones de refresher semestrales',
      'Mentoring continuo por líderes éticos'
    ],
    continuousImprovement: [
      'Feedback de participantes para mejoras',
      'Actualización de contenidos según cambios legales',
      'Benchmarking con mejores prácticas del sector',
      'Medición de impacto en cultura organizacional'
    ]
  };
}

function getDepartmentRisks(department: string): string {
  const risks = {
    ventas: 'Riesgos principales: Regalos a clientes, comisiones indebidas, competencia desleal, promesas incumplibles',
    compras: 'Riesgos principales: Sobornos de proveedores, conflictos de interés, licitaciones amañadas, due diligence insuficiente',
    finanzas: 'Riesgos principales: Fraude contable, información privilegiada, lavado de dinero, controles internos débiles',
    rrhh: 'Riesgos principales: Discriminación, acoso, manejo indebido de información personal, nepotismo',
    operaciones: 'Riesgos principales: Violación de procedimientos, manejo de información confidencial, relaciones con reguladores',
    general: 'Riesgos principales: Cultura ética débil, falta de conciencia sobre compliance, comunicación deficiente'
  };
  
  return risks[department as keyof typeof risks] || risks.general;
}

function getLevelSpecificContent(level: string): string {
  const content = {
    junior: 'Enfoque en fundamentos, casos básicos, procedimientos claros y recursos de consulta',
    'semi-senior': 'Enfoque en casos intermedios, toma de decisiones autónoma y influencia en pares',
    senior: 'Enfoque en liderazgo ético, mentoring, casos complejos y construcción de cultura',
    ejecutivo: 'Enfoque en governance, responsabilidad legal, tone at the top y gestión de crisis'
  };
  
  return content[level as keyof typeof content] || content.junior;
}

function generateImplementationGuide(plan: TrainingPlan, input: TrainingRecommendationInput): string {
  return `
📋 GUÍA DE IMPLEMENTACIÓN

🎯 PREPARACIÓN (Semana previa):
• Comunicar programa a participantes
• Preparar materiales y recursos
• Configurar espacios y tecnología
• Designar facilitadores internos

🚀 EJECUCIÓN:
• Seguir cronograma de módulos establecido
• Aplicar métodos de evaluación definidos
• Documentar participación y resultados
• Recolectar feedback continuo

📊 SEGUIMIENTO (Post-entrenamiento):
• Aplicar evaluaciones de seguimiento
• Implementar actividades de refuerzo
• Monitorear cambios comportamentales
• Ajustar programa según resultados

💡 CONSEJOS ESPECÍFICOS:
• ${input.previousIncidents ? 'Abordar específicamente los tipos de incidentes previos' : 'Enfocarse en prevención proactiva'}
• Adaptar ejemplos al contexto de ${input.department}
• Considerar el nivel ${input.experienceLevel} en la profundidad de contenidos
• Aprovechar al máximo las ${input.timeAvailable} horas disponibles
  `;
}