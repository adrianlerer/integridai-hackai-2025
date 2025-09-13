/**
 * 🔍 BASIC INTEGRITY CHECK - HackAI 2025 Demo Version
 * 
 * Versión básica de demostración para evaluación de integridad organizacional.
 * NO incluye funciones avanzadas de la versión comercial.
 */

import { z } from 'zod';

// Schema básico para evaluación de integridad
export const BasicIntegrityCheckSchema = z.object({
  organizacion: z.string().min(1, 'Nombre de organización requerido'),
  sector: z.enum(['publico', 'privado', 'mixto']).default('privado'),
  empleados: z.enum(['1-10', '11-50', '51-200', '200+']).default('1-10'),
  riesgo: z.enum(['bajo', 'medio', 'alto']).default('medio'),
});

export const BasicIntegrityOutputSchema = z.object({
  evaluacion: z.literal('completada'),
  puntaje: z.number().min(0).max(100).describe('Puntaje básico de integridad (0-100)'),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).describe('Nivel de madurez en integridad'),
  recomendaciones: z.array(z.string()).describe('Recomendaciones básicas'),
  siguientesPasos: z.array(z.string()).describe('Próximos pasos sugeridos'),
  advertencia: z.string().describe('Nota sobre limitaciones de la versión demo')
});

export type BasicIntegrityCheckInput = z.infer<typeof BasicIntegrityCheckSchema>;
export type BasicIntegrityCheckOutput = z.infer<typeof BasicIntegrityOutputSchema>;

/**
 * 🔍 Función básica de evaluación de integridad (Demo)
 * 
 * NOTA: Esta es una versión LIMITADA para demostración.
 * La versión comercial incluye análisis avanzado con IA.
 */
export async function runBasicIntegrityCheck(
  input: BasicIntegrityCheckInput
): Promise<BasicIntegrityCheckOutput> {
  
  try {
    // Validar entrada
    const validatedInput = BasicIntegrityCheckSchema.parse(input);
    
    // Cálculo básico de puntaje (algoritmo simple para demo)
    let puntaje = 50; // Base
    
    // Ajustes básicos por sector
    if (validatedInput.sector === 'publico') puntaje += 10;
    if (validatedInput.sector === 'privado') puntaje += 5;
    
    // Ajustes por tamaño
    const tamanoBonus = {
      '1-10': 5,
      '11-50': 10,
      '51-200': 8,
      '200+': 15
    };
    puntaje += tamanoBonus[validatedInput.empleados];
    
    // Ajustes por nivel de riesgo declarado
    const riesgoAjuste = {
      'bajo': 20,
      'medio': 10,
      'alto': 5
    };
    puntaje += riesgoAjuste[validatedInput.riesgo];
    
    // Determinar nivel de madurez
    let nivel: 'principiante' | 'intermedio' | 'avanzado' = 'principiante';
    if (puntaje >= 70) nivel = 'avanzado';
    else if (puntaje >= 50) nivel = 'intermedio';
    
    // Recomendaciones básicas basadas en nivel
    const recomendaciones = generarRecomendacionesBasicas(nivel, validatedInput);
    const siguientesPasos = generarSiguientesPasos(nivel);
    
    return {
      evaluacion: 'completada',
      puntaje: Math.min(95, Math.max(15, puntaje)), // Entre 15-95
      nivel,
      recomendaciones,
      siguientesPasos,
      advertencia: '⚠️ VERSIÓN DEMO: Esta evaluación es básica. La versión comercial incluye análisis avanzado con IA, detección de patrones de riesgo, y compliance automático con Ley 27.401.'
    };
    
  } catch (error: any) {
    throw new Error(`Error en evaluación básica de integridad: ${error.message}`);
  }
}

/**
 * Generar recomendaciones básicas según nivel
 */
function generarRecomendacionesBasicas(
  nivel: string, 
  input: BasicIntegrityCheckInput
): string[] {
  const recomendaciones = [];
  
  if (nivel === 'principiante') {
    recomendaciones.push('📋 Implementar políticas básicas de ética y transparencia');
    recomendaciones.push('👥 Capacitar empleados en principios de integridad');
    recomendaciones.push('📞 Establecer canal básico de denuncias');
  }
  
  if (nivel === 'intermedio') {
    recomendaciones.push('📊 Implementar evaluaciones periódicas de riesgo');
    recomendaciones.push('🔍 Fortalecer controles internos existentes');
    recomendaciones.push('📚 Desarrollar programa de capacitación continua');
  }
  
  if (nivel === 'avanzado') {
    recomendaciones.push('🚀 Considerar certificaciones de compliance internacional');
    recomendaciones.push('🤖 Evaluar herramientas tecnológicas avanzadas (¡como IntegridAI comercial!)');
    recomendaciones.push('🌐 Compartir mejores prácticas con otras organizaciones');
  }
  
  // Recomendación específica por sector
  if (input.sector === 'publico') {
    recomendaciones.push('🏛️ Asegurar cumplimiento con normativas de transparencia gubernamental');
  }
  
  return recomendaciones;
}

/**
 * Generar siguientes pasos según nivel
 */
function generarSiguientesPasos(nivel: string): string[] {
  if (nivel === 'principiante') {
    return [
      'Definir código de ética organizacional',
      'Establecer comité de integridad básico',
      'Realizar capacitación inicial de empleados'
    ];
  }
  
  if (nivel === 'intermedio') {
    return [
      'Implementar matriz de riesgos de corrupción',
      'Desarrollar procedimientos de due diligence',
      'Establecer métricas de seguimiento'
    ];
  }
  
  return [
    'Considerar certificación ISO 37001 (Anti-soborno)',
    'Implementar monitoreo continuo automatizado',
    'Evaluar IntegridAI versión comercial para análisis avanzado'
  ];
}

/**
 * Función helper para generar ID de evaluación
 */
export function generarIdEvaluacion(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `DEMO-EVAL-${timestamp}-${random}`.toUpperCase();
}