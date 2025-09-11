import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { simulateEthicsCase } from './simulateEthicsCase';
import { AuditLogger, AuditEventType } from '@/infra/audit';
import { RedisClient } from '@/infra/redis';

// Schema para vacunación de empleado
export const EmployeeVaccinationSchema = z.object({
  employeeId: z.string().min(1, 'ID de empleado requerido'),
  situation: z.string().min(1, 'Describe la situación de riesgo que enfrenta'),
  riskLevel: z.enum(['bajo', 'medio', 'alto']).default('medio'),
  department: z.enum(['compras', 'ventas', 'finanzas', 'rrhh', 'general']).default('general'),
  vaccinationType: z.enum(['preventiva', 'reactiva', 'refuerzo']).default('preventiva'),
});

export const EmployeeVaccinationOutputSchema = z.object({
  status: z.literal('inmunizado'),
  vaccinationId: z.string().describe('ID único de inmunización'),
  immunityLevel: z.number().min(0).max(100).describe('Nivel de inmunidad adquirida (0-100)'),
  keyLearning: z.string().describe('Aprendizaje clave de la vacunación'),
  nextBooster: z.string().describe('Cuándo necesita refuerzo'),
  certificateUrl: z.string().describe('Certificado de inmunización'),
  executionTime: z.number().describe('Tiempo de vacunación en minutos'),
});

export type EmployeeVaccinationInput = z.infer<typeof EmployeeVaccinationSchema>;
export type EmployeeVaccinationOutput = z.infer<typeof EmployeeVaccinationOutputSchema>;

/**
 * 💉 VACUNA ANTI-CORRUPCIÓN PARA EMPLEADOS
 * Proceso de inmunización en 5 minutos:
 * 1. Analiza situación específica del empleado
 * 2. Selecciona vacuna apropiada (Catalina/Mentor/Ana)
 * 3. Ejecuta simulación inmersiva
 * 4. Genera inmunidad específica
 * 5. Emite certificado de vacunación
 */
export async function vaccinateEmployee(
  input: EmployeeVaccinationInput,
  context?: { userId?: string; userAgent?: string; ipAddress?: string }
): Promise<EmployeeVaccinationOutput> {
  const startTime = Date.now();

  try {
    // 1. Validar entrada
    const validatedInput = EmployeeVaccinationSchema.parse(input);

    // 2. Seleccionar tipo de vacuna según situación
    const { persona, caseId } = selectVaccineType(validatedInput);

    // 3. Ejecutar simulación de vacunación
    const simulationResult = await simulateEthicsCase({
      persona,
      caseId,
      userId: validatedInput.employeeId,
      locale: 'es-AR'
    }, context);

    // 4. Calcular nivel de inmunidad
    const immunityLevel = calculateImmunityLevel(
      validatedInput.riskLevel,
      validatedInput.vaccinationType,
      simulationResult.executionTime
    );

    // 5. Generar certificado de vacunación
    const vaccinationId = generateVaccinationId(validatedInput.employeeId);
    
    // 6. Registrar vacunación en historial del empleado
    await RedisClient.setRunState(`vaccination:${vaccinationId}`, {
      employeeId: validatedInput.employeeId,
      situation: validatedInput.situation,
      immunityLevel,
      vaccinatedAt: new Date().toISOString(),
      nextBooster: calculateNextBooster(immunityLevel),
    });

    // 7. Log de auditoría con enfoque en protección empleado
    await AuditLogger.logEvent({
      eventType: AuditEventType.RUN_COMPLETED,
      eventData: {
        vaccinationType: 'employee_immunization',
        employeeId: validatedInput.employeeId,
        immunityAchieved: immunityLevel,
        situation: validatedInput.situation,
        department: validatedInput.department,
      },
      userId: context?.userId,
    });

    const executionTime = Math.round((Date.now() - startTime) / 1000 / 60); // minutos

    return {
      status: 'inmunizado',
      vaccinationId,
      immunityLevel,
      keyLearning: generateKeyLearning(validatedInput.situation, persona),
      nextBooster: calculateNextBooster(immunityLevel),
      certificateUrl: simulationResult.reportUrl, // Reutilizar URL del reporte
      executionTime,
    };

  } catch (error: any) {
    await AuditLogger.logError({
      error,
      context: { input, step: 'vaccination_process' },
      userId: context?.userId,
    });

    throw new Error(`Error en vacunación anti-corrupción: ${error.message}`);
  }
}

/**
 * Selecciona el tipo de vacuna según la situación del empleado
 */
function selectVaccineType(input: EmployeeVaccinationInput): {
  persona: 'catalina' | 'mentor' | 'ana' | 'carlos';
  caseId: string;
} {
  const situation = input.situation.toLowerCase();
  
  // Mapear situaciones a personajes de vacunación
  if (situation.includes('oferta') || situation.includes('regalo') || situation.includes('tentación')) {
    return { persona: 'catalina', caseId: `VACCINE-TEMPTATION-${input.department.toUpperCase()}` };
  }
  
  if (situation.includes('control') || situation.includes('proceso') || situation.includes('auditoría')) {
    return { persona: 'ana', caseId: `VACCINE-CONTROL-${input.department.toUpperCase()}` };
  }
  
  if (situation.includes('liderazgo') || situation.includes('equipo') || situation.includes('decisión')) {
    return { persona: 'carlos', caseId: `VACCINE-LEADERSHIP-${input.department.toUpperCase()}` };
  }
  
  // Default: Mentor para situaciones generales
  return { persona: 'mentor', caseId: `VACCINE-GENERAL-${input.department.toUpperCase()}` };
}

/**
 * Calcula nivel de inmunidad basado en factores de riesgo
 */
function calculateImmunityLevel(
  riskLevel: string,
  vaccinationType: string,
  executionTime: number
): number {
  let baseImmunity = 60; // Base immunity level
  
  // Ajustar por nivel de riesgo
  if (riskLevel === 'alto') baseImmunity += 20;
  if (riskLevel === 'medio') baseImmunity += 10;
  
  // Ajustar por tipo de vacuna
  if (vaccinationType === 'reactiva') baseImmunity += 15; // Más efectiva si es reactiva
  if (vaccinationType === 'refuerzo') baseImmunity += 10;
  
  // Ajustar por tiempo de ejecución (más tiempo = mejor inmunidad)
  if (executionTime > 180000) baseImmunity += 10; // >3 minutos
  
  return Math.min(95, Math.max(40, baseImmunity)); // Entre 40-95%
}

/**
 * Calcula cuándo necesita el próximo refuerzo
 */
function calculateNextBooster(immunityLevel: number): string {
  if (immunityLevel >= 90) return '6 meses';
  if (immunityLevel >= 75) return '4 meses';
  if (immunityLevel >= 60) return '3 meses';
  return '2 meses';
}

/**
 * Genera aprendizaje clave personalizado
 */
function generateKeyLearning(situation: string, persona: string): string {
  const learnings = {
    catalina: `Identificaste las señales de tentación en: "${situation}". Ahora sabes reconocer y rechazar ofertas similares.`,
    mentor: `Aprendiste el marco legal aplicable a: "${situation}". Tienes las herramientas para tomar decisiones éticas.`,
    ana: `Fortaleciste tus habilidades de control interno para: "${situation}". Puedes implementar mejores procesos.`,
    carlos: `Desarrollaste liderazgo ético para: "${situation}". Puedes guiar a tu equipo en situaciones similares.`
  };
  
  return learnings[persona as keyof typeof learnings];
}

/**
 * Genera ID único de vacunación
 */
function generateVaccinationId(employeeId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `VAC-${employeeId}-${timestamp}-${random}`.toUpperCase();
}