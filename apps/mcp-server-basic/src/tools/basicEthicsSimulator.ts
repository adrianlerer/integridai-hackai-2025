/**
 * Simulador Básico de Escenarios Éticos
 * 
 * Genera simulaciones simples de dilemas éticos empresariales
 * basados en casos comunes de la Ley 27.401
 */

interface EthicsSimulationInput {
  scenarioType: 'regalo_proveedor' | 'conflicto_interes' | 'informacion_privilegiada' | 'facilitacion_pagos';
  userRole: 'empleado' | 'supervisor' | 'gerente' | 'directivo';
  contextDetails?: string;
}

interface EthicsScenario {
  title: string;
  situation: string;
  challenge: string;
  options: {
    id: string;
    description: string;
    consequences: string;
    ethicalRating: 'Correcto' | 'Cuestionable' | 'Incorrecto';
    legalImplications: string;
  }[];
  learningPoints: string[];
  legalReferences: string[];
  bestPractices: string[];
}

export async function basicEthicsSimulatorTool(
  input: EthicsSimulationInput
): Promise<{ content: [{ type: 'text'; text: string }] }> {
  
  try {
    const scenario = generateEthicsScenario(input);
    
    const simulation = {
      scenarioInfo: {
        type: input.scenarioType,
        targetRole: input.userRole,
        context: input.contextDetails || 'Contexto empresarial general'
      },
      scenario: scenario,
      guidance: generateGuidance(scenario, input.userRole),
      followUp: generateFollowUpQuestions(input.scenarioType)
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(simulation, null, 2)
        }
      ]
    };

  } catch (error) {
    throw new Error(`Error en simulación ética: ${error}`);
  }
}

function generateEthicsScenario(input: EthicsSimulationInput): EthicsScenario {
  const scenarios = {
    regalo_proveedor: {
      title: '🎁 Dilema: Regalo de Proveedor',
      situation: `
Como ${input.userRole}, has desarrollado una buena relación profesional con un proveedor clave de la empresa. 
Se acercan las fiestas navideñas y el proveedor te ofrece una cesta navideña de productos gourmet valorada en $15,000 pesos argentinos.

El proveedor menciona que es "una tradición de la empresa regalar a sus principales contactos comerciales" y que "no espera nada a cambio, solo mantener la buena relación".

Contexto adicional: ${input.contextDetails || 'Tu empresa no tiene una política clara sobre regalos de proveedores.'}
      `,
      challenge: '¿Qué deberías hacer en esta situación?',
      options: [
        {
          id: 'A',
          description: 'Acepto el regalo ya que es parte de las tradiciones navideñas y no compromete mi objetividad',
          consequences: 'Posible percepción de compromiso en futuras decisiones comerciales',
          ethicalRating: 'Incorrecto' as const,
          legalImplications: 'Potencial violación Art. 256 bis Código Penal (cohecho privado)'
        },
        {
          id: 'B', 
          description: 'Rechazo cortésmente el regalo explicando que no puedo aceptar obsequios de proveedores',
          consequences: 'Mantiene independencia y evita conflictos de interés',
          ethicalRating: 'Correcto' as const,
          legalImplications: 'Cumple con principios de transparencia de Ley 27.401'
        },
        {
          id: 'C',
          description: 'Acepto el regalo pero lo entrego a mi supervisor para que decida qué hacer',
          consequences: 'Traslada la responsabilidad pero demuestra transparencia',
          ethicalRating: 'Cuestionable' as const,
          legalImplications: 'Parcialmente conforme, requiere política empresarial clara'
        }
      ],
      learningPoints: [
        'Los regalos pueden generar conflictos de interés reales o percibidos',
        'La transparencia es clave en las relaciones comerciales',
        'Las políticas de regalos deben ser claras y comunicadas a todos los empleados',
        'El valor monetario no es el único factor relevante'
      ],
      legalReferences: [
        'Ley 27.401 - Art. 1: Responsabilidad penal empresaria',
        'Código Penal - Art. 256 bis: Cohecho privado',
        'ISO 37001: Sistemas de gestión antisoborno'
      ],
      bestPractices: [
        'Implementar política clara sobre regalos y hospitalidades',
        'Establecer límites monetarios para obsequios',
        'Crear registro de regalos recibidos/ofrecidos',
        'Capacitar regularmente sobre conflictos de interés'
      ]
    },

    conflicto_interes: {
      title: '⚖️ Dilema: Conflicto de Interés',
      situation: `
Como ${input.userRole}, tienes que evaluar propuestas de proveedores para un nuevo proyecto importante de la empresa.
Una de las propuestas viene de una empresa donde tu hermano trabaja como gerente de ventas.

La propuesta de la empresa de tu hermano es competitiva, pero no necesariamente la mejor. Tu hermano no sabe que estás involucrado en el proceso de evaluación.

Contexto adicional: ${input.contextDetails || 'Este proyecto podría definir bonos anuales para tu área y el desempeño de tu hermano en su empresa.'}
      `,
      challenge: '¿Cómo manejas esta situación de conflicto de interés?',
      options: [
        {
          id: 'A',
          description: 'Evalúo todas las propuestas objetivamente sin mencionar mi relación familiar',
          consequences: 'Mantiene confidencialidad pero no aborda el conflicto de interés',
          ethicalRating: 'Incorrecto' as const,
          legalImplications: 'Posible conflicto de interés no declarado'
        },
        {
          id: 'B',
          description: 'Declaro inmediatamente el conflicto de interés a mi supervisor y me recuso del proceso',
          consequences: 'Actúa con transparencia y evita cualquier compromiso ético',
          ethicalRating: 'Correcto' as const,
          legalImplications: 'Cumple con deberes de transparencia y buena fe'
        },
        {
          id: 'C', 
          description: 'Evalúo las propuestas pero doy preferencia a otras opciones para evitar sospechas',
          consequences: 'Introduce sesgo negativo, igualmente problemático éticamente',
          ethicalRating: 'Incorrecto' as const,
          legalImplications: 'Discriminación injustificada, posible daño a la empresa'
        }
      ],
      learningPoints: [
        'Los conflictos de interés deben declararse proactivamente',
        'La recusación es la mejor práctica ante conflictos evidentes',
        'La transparencia protege tanto al empleado como a la empresa',
        'Los conflictos familiares son tan importantes como los financieros'
      ],
      legalReferences: [
        'Ley 27.401 - Art. 23: Programas de integridad',
        'Código Civil - Art. 1725: Conflicto de interés',
        'Ley de Sociedades - Art. 248: Conflicto de interés de administradores'
      ],
      bestPractices: [
        'Implementar formularios de declaración de conflictos',
        'Establecer procesos claros de recusación',
        'Crear comités de evaluación con múltiples miembros',
        'Documentar todas las decisiones de conflictos de interés'
      ]
    },

    informacion_privilegiada: {
      title: '📊 Dilema: Información Privilegiada',
      situation: `
Como ${input.userRole}, tienes acceso a información confidencial sobre una próxima fusión entre tu empresa y un competidor.
Tu cuñado te comenta que está pensando en invertir en acciones de esa empresa competidora y te pide tu opinión "profesional".

La información que tienes podría ser muy relevante para su decisión de inversión, pero aún no es pública.

Contexto adicional: ${input.contextDetails || 'Tu cuñado confía en tu criterio financiero y esta inversión representaría sus ahorros de varios años.'}
      `,
      challenge: '¿Cómo respondes a la consulta de tu cuñado?',
      options: [
        {
          id: 'A',
          description: 'Le doy pistas indirectas para que no pierda su dinero sin revelar información específica',
          consequences: 'Uso indirecto de información privilegiada, igualmente problemático',
          ethicalRating: 'Incorrecto' as const,
          legalImplications: 'Posible uso indebido de información privilegiada'
        },
        {
          id: 'B',
          description: 'Explico que no puedo opinar sobre inversiones por mi posición en la empresa',
          consequences: 'Mantiene confidencialidad y cumple deberes profesionales',
          ethicalRating: 'Correcto' as const,
          legalImplications: 'Cumple con deberes de confidencialidad y mercado de valores'
        },
        {
          id: 'C',
          description: 'Le recomiendo que no invierta sin dar detalles específicos',
          consequences: 'Previene pérdida pero usa información privilegiada indirectamente',
          ethicalRating: 'Cuestionable' as const,
          legalImplications: 'Zona gris, podría constituir uso de información privilegiada'
        }
      ],
      learningPoints: [
        'La información privilegiada no puede usarse directa ni indirectamente',
        'Los deberes de confidencialidad aplican incluso con familiares',
        'Las "pistas" o sugerencias también constituyen uso indebido',
        'La integridad profesional debe mantenerse en todas las relaciones'
      ],
      legalReferences: [
        'Ley 26.831 - Mercado de Capitales: Información privilegiada',
        'Ley 27.401 - Responsabilidad empresarial',
        'CNV - Normas sobre uso de información privilegiada'
      ],
      bestPractices: [
        'Establecer políticas claras sobre información privilegiada',
        'Capacitar sobre definiciones de información material no pública',
        'Implementar controles de acceso a información sensible',
        'Crear canales para consultas sobre situaciones ambiguas'
      ]
    },

    facilitacion_pagos: {
      title: '💰 Dilema: Pagos de Facilitación',
      situation: `
Como ${input.userRole}, necesitas urgentemente un permiso municipal para una obra que debe comenzar el lunes.
El funcionario público te dice que "el proceso normal toma 15 días, pero por $5,000 pesos puede acelerarse a 2 días".

La obra es crítica para cumplir compromisos con clientes y su demora generaría pérdidas significativas.

Contexto adicional: ${input.contextDetails || 'Tu jefe te presiona para resolver esto "como sea" y otros colegas sugieren que "es normal" hacer estos pagos.'}
      `,
      challenge: '¿Qué decides hacer ante esta solicitud de pago de facilitación?',
      options: [
        {
          id: 'A',
          description: 'Realizo el pago ya que es pequeño y evita pérdidas mayores para la empresa',
          consequences: 'Solución inmediata pero constituye soborno y perpetúa corrupción',
          ethicalRating: 'Incorrecto' as const,
          legalImplications: 'Violación Art. 258 Código Penal (cohecho activo)'
        },
        {
          id: 'B',
          description: 'Rechazo el pago y busco alternativas legales, informando a la empresa de la situación',
          consequences: 'Actúa con integridad y protege a la empresa de riesgos legales',
          ethicalRating: 'Correcto' as const,
          legalImplications: 'Cumple con Ley 27.401 y evita responsabilidad penal'
        },
        {
          id: 'C',
          description: 'Consulto con mi supervisor antes de tomar cualquier decisión',
          consequences: 'Traslada responsabilidad pero puede no resolver el dilema ético',
          ethicalRating: 'Cuestionable' as const,
          legalImplications: 'Depende de la decisión final del supervisor'
        }
      ],
      learningPoints: [
        'Los pagos de facilitación son sobornos, independientemente del monto',
        'La presión temporal no justifica actos de corrupción',
        'Las empresas deben tener protocolos para estas situaciones',
        'Los costos de corrupción siempre superan los beneficios temporales'
      ],
      legalReferences: [
        'Código Penal - Art. 258: Cohecho activo',
        'Ley 27.401 - Responsabilidad penal empresaria',
        'Convención Interamericana contra la Corrupción'
      ],
      bestPractices: [
        'Establecer política de cero tolerancia a pagos indebidos',
        'Crear procedimientos para situaciones de presión por sobornos',
        'Capacitar sobre diferencias entre regalos, facilitación y soborno',
        'Establecer canales de reporte para presiones corruptas'
      ]
    }
  };

  return scenarios[input.scenarioType];
}

function generateGuidance(scenario: EthicsScenario, userRole: string): string {
  return `
🎯 GUÍA DE ANÁLISIS PARA ${userRole.toUpperCase()}

📋 PASOS PARA EVALUAR LA SITUACIÓN:

1️⃣ IDENTIFICACIÓN DEL DILEMA
• ¿Cuál es el conflicto ético central?
• ¿Quién podría verse afectado por tu decisión?
• ¿Qué valores están en tensión?

2️⃣ ANÁLISIS DE OPCIONES
${scenario.options.map(option => `
   Opción ${option.id}: ${option.ethicalRating}
   • Implicación legal: ${option.legalImplications}
   • Consecuencias: ${option.consequences}
`).join('')}

3️⃣ CONSIDERACIONES CLAVE
• Principio de transparencia: ¿Estarías cómodo si esta decisión fuera pública?
• Principio de reciprocidad: ¿Cómo te sentirías si fueras la otra parte?
• Principio de legalidad: ¿Cumple con todas las regulaciones aplicables?

4️⃣ MEJORES PRÁCTICAS
${scenario.bestPractices.map(practice => `• ${practice}`).join('\n')}
  `;
}

function generateFollowUpQuestions(scenarioType: string): string[] {
  const questions = {
    regalo_proveedor: [
      '¿Qué políticas debería tener tu empresa sobre regalos de proveedores?',
      '¿Cómo comunicarías esta política a tu equipo?',
      '¿Qué harías si un proveedor insiste después de rechazar un regalo?'
    ],
    conflicto_interes: [
      '¿Cómo identificas proactivamente potenciales conflictos de interés?',
      '¿Qué proceso seguirías para documentar una recusación?',
      '¿Cómo balanceas transparencia con privacidad familiar?'
    ],
    informacion_privilegiada: [
      '¿Cómo defines qué información es "privilegiada" en tu empresa?',
      '¿Qué controles implementarías para proteger información sensible?',
      '¿Cómo educarías a tu equipo sobre estos temas?'
    ],
    facilitacion_pagos: [
      '¿Qué alternativas legales existen para agilizar trámites oficiales?',
      '¿Cómo prepararías a tu equipo para enfrentar solicitudes de soborno?',
      '¿Qué haría tu empresa si perdiera un negocio por no pagar sobornos?'
    ]
  };

  return questions[scenarioType as keyof typeof questions] || [];
}