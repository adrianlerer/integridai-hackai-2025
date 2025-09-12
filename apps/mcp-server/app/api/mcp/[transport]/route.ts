import { NextRequest, NextResponse } from 'next/server';
import { createMcpHandler } from 'mcp-handler';
import {
  simulateEthicsCase,
  SimulateEthicsCaseSchema,
  SimulateEthicsCaseOutputSchema
} from '@/mcp/tools/simulateEthicsCase';
import {
  runIntegritySurvey,
  RunIntegritySurveySchema,
  RunIntegritySurveyOutputSchema
} from '@/mcp/tools/runIntegritySurvey';
// 🚀 TRINITY-ASI INTEGRATION: New Advanced Tools
import {
  vaccinateEmployee,
  EmployeeVaccinationSchema,
  EmployeeVaccinationOutputSchema
} from '@/mcp/tools/employeeVaccination';
import {
  analyzePoliticalActors,
  PoliticalActorAnalysisSchema,
  PoliticalActorAnalysisOutputSchema
} from '@/mcp/tools/politicalActorAnalysis';
import {
  analyzeNetworkIntelligence,
  NetworkIntelligenceSchema,
  NetworkIntelligenceOutputSchema
} from '@/mcp/tools/networkIntelligence';
import {
  simulateCorruptionBiofilm,
  CorruptionBiofilmSchema,
  CorruptionBiofilmOutputSchema
} from '@/mcp/tools/corruptionBiofilmModel';
import { OAuthMiddleware, RateLimiter } from '@/infra/oauth';
import { AuditLogger, AuditEventType } from '@/infra/audit';
import { cleanExpiredIdempotencyRecords } from '@/infra/db';
// 🛡️ TRINITY-ASI ZERO TRUST SECURITY INTEGRATION
import { ZeroTrust } from '@/infra/zero-trust-security';

/**
 * 🚀 TRINITY-ASI MCP SERVER - WORLD'S MOST ADVANCED ANTI-CORRUPTION SYSTEM
 * 
 * INTEGRATION LAYERS:
 * ⚖️ JurisRank Patent System: cERGM + Authority + Federated Learning + Topic-Sensitive
 * 🌳 Oak Architecture: SLM routing + P4 Framework + Anti-Smoke metrics + Evolution
 * 💉 Vaccination System: Employee immunization + biofilm prevention + network intelligence
 * 🛡️ Zero Trust Security: BSI/ANSSI 2025 compliant with multi-layer validation
 * 
 * PATENT-PENDING INNOVATIONS:
 * - cERGM Legal Engine for network causality analysis
 * - Dynamic Authority Scoring with federated learning
 * - Oak Architecture SLM-first routing (90% efficiency, 30x cost reduction)
 * - P4 Framework quality assurance (Problema→Planificar→Procesar→Perfeccionar)
 * - Anti-Corruption Vaccination with 5-minute immunization process
 * 
 * COMPLIANCE: Ley 27.401 + McKinsey Technology Trends 2025 + NVIDIA Agentic AI
 */
const handler = createMcpHandler((server) => {
  
  // Tool 1: Simulate Ethics Case
  server.tool(
    "simulate_ethics_case",
    "Ejecuta un caso del FLAISimulator end-to-end y devuelve un informe ejecutivo con recomendaciones conforme Ley 27.401",
    SimulateEthicsCaseSchema,
    async (input: any, context?: any) => {
      const startTime = Date.now();
      
      try {
        // Extraer contexto de la request
        const authContext = context?.authContext;
        const requestContext = {
          userId: authContext?.user?.id,
          userAgent: context?.userAgent,
          ipAddress: context?.ipAddress,
          idempotencyKey: context?.idempotencyKey,
        };

        // Rate limiting
        if (authContext?.user?.id) {
          const rateLimit = await RateLimiter.checkRateLimit(
            authContext.user.id,
            'ethics_simulation'
          );
          
          if (!rateLimit.allowed) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
        }

        // Ejecutar herramienta
        const result = await simulateEthicsCase(input, requestContext);
        
        // Validar salida
        return SimulateEthicsCaseOutputSchema.parse(result);
        
      } catch (error: any) {
        console.error('Error in simulate_ethics_case tool:', error);
        
        // Log error para auditoría
        await AuditLogger.logEvent({
          eventType: AuditEventType.ERROR_OCCURRED,
          eventData: {
            toolName: 'simulate_ethics_case',
            error: error.message,
            input: input,
            timestamp: new Date().toISOString(),
          },
          userId: context?.authContext?.user?.id,
        });
        
        throw new Error(`Error ejecutando simulación ética: ${error.message}`);
      }
    }
  );

  // Tool 2: Run Integrity Survey
  server.tool(
    "run_integrity_survey",
    "Ejecuta la Encuesta de Integridad completa, genera artefactos CSV/JSON y resumen ejecutivo conforme Ley 27.401",
    RunIntegritySurveySchema,
    async (input: any, context?: any) => {
      const startTime = Date.now();
      
      try {
        // Extraer contexto de la request
        const authContext = context?.authContext;
        const requestContext = {
          userId: authContext?.user?.id,
          userAgent: context?.userAgent,
          ipAddress: context?.ipAddress,
          idempotencyKey: context?.idempotencyKey,
        };

        // Rate limiting
        if (authContext?.user?.id) {
          const rateLimit = await RateLimiter.checkRateLimit(
            authContext.user.id,
            'integrity_survey'
          );
          
          if (!rateLimit.allowed) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
        }

        // Ejecutar herramienta
        const result = await runIntegritySurvey(input, requestContext);
        
        // Validar salida
        return RunIntegritySurveyOutputSchema.parse(result);
        
      } catch (error: any) {
        console.error('Error in run_integrity_survey tool:', error);
        
        // Log error para auditoría
        await AuditLogger.logEvent({
          eventType: AuditEventType.ERROR_OCCURRED,
          eventData: {
            toolName: 'run_integrity_survey',
            error: error.message,
            input: input,
            timestamp: new Date().toISOString(),
          },
          userId: context?.authContext?.user?.id,
        });
        
        throw new Error(`Error ejecutando encuesta de integridad: ${error.message}`);
      }
    }
  );

  // 🚀 TRINITY-ASI ADVANCED TOOLS

  // Tool 3: Employee Anti-Corruption Vaccination
  server.tool(
    "vaccinate_employee",
    "Ejecuta el sistema de Vacunación Anti-Corrupción Trinity-ASI. Proceso de inmunización en 5 minutos con SLM optimizado, P4 Framework y validación anti-smoke",
    EmployeeVaccinationSchema,
    async (input: any, context?: any) => {
      try {
        const requestContext = extractRequestContext(context);
        await checkRateLimit(requestContext.userId, 'vaccination');
        const result = await vaccinateEmployee(input, requestContext);
        return EmployeeVaccinationOutputSchema.parse(result);
      } catch (error: any) {
        await logToolError('vaccinate_employee', error, input, context);
        throw new Error(`Error en vacunación anti-corrupción: ${error.message}`);
      }
    }
  );

  // Tool 4: Political Actor Analysis with cERGM
  server.tool(
    "analyze_political_actors", 
    "Análisis multidimensional de actores políticos con cERGM causality, Oak SLM routing, bootstrap validation y JurisRank authority scoring",
    PoliticalActorAnalysisSchema,
    async (input: any, context?: any) => {
      try {
        const requestContext = extractRequestContext(context);
        await checkRateLimit(requestContext.userId, 'political_analysis');
        const result = await analyzePoliticalActors(input, requestContext);
        return PoliticalActorAnalysisOutputSchema.parse(result);
      } catch (error: any) {
        await logToolError('analyze_political_actors', error, input, context);
        throw new Error(`Error en análisis político: ${error.message}`);
      }
    }
  );

  // Tool 5: Network Intelligence with JurisRank
  server.tool(
    "analyze_network_intelligence",
    "Inteligencia de redes avanzada con algoritmos JurisRank, RootFinder, Legal-Memespace y Oak Architecture evolution. Incluye authority scoring y federated learning",
    NetworkIntelligenceSchema,
    async (input: any, context?: any) => {
      try {
        const requestContext = extractRequestContext(context);
        await checkRateLimit(requestContext.userId, 'network_analysis');
        const result = await analyzeNetworkIntelligence(input, requestContext);
        return NetworkIntelligenceOutputSchema.parse(result);
      } catch (error: any) {
        await logToolError('analyze_network_intelligence', error, input, context);
        throw new Error(`Error en análisis de red: ${error.message}`);
      }
    }
  );

  // Tool 6: Corruption Biofilm Simulation
  server.tool(
    "simulate_corruption_biofilm",
    "Simulación avanzada de evolución de corrupción con modelo biofilm. Integra cERGM causality, Oak anti-smoke metrics y P4 Framework validation",
    CorruptionBiofilmSchema,
    async (input: any, context?: any) => {
      try {
        const requestContext = extractRequestContext(context);
        await checkRateLimit(requestContext.userId, 'biofilm_simulation');
        const result = await simulateCorruptionBiofilm(input, requestContext);
        return CorruptionBiofilmOutputSchema.parse(result);
      } catch (error: any) {
        await logToolError('simulate_corruption_biofilm', error, input, context);
        throw new Error(`Error en simulación biofilm: ${error.message}`);
      }
    }
  );

}, {
  // Configuración del servidor Trinity-ASI MCP
  name: "trinity-asi-mcp-server",
  version: "1.0.0",
  description: "Trinity-ASI MCP Server - Advanced anti-corruption system with JurisRank + Oak Architecture + Vaccination",
}, {
  basePath: "/api/mcp",
  verboseLogs: process.env.NODE_ENV === 'development',
});

/**
 * Middleware personalizado para manejo de autenticación y contexto
 */
async function withAuthAndContext(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Limpiar registros de idempotencia expirados (ejecutar ocasionalmente)
    if (Math.random() < 0.1) { // 10% chance
      await cleanExpiredIdempotencyRecords().catch(console.error);
    }

    // 🛡️ TRINITY-ASI ZERO TRUST SECURITY VALIDATION (Pre-Auth)
    const preAuthContext = {
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };
    
    const zeroTrustValidation = await ZeroTrust.validateRequest(preAuthContext, {});
    
    if (!zeroTrustValidation.passed && zeroTrustValidation.trustScore < 0.3) {
      // Critical security violations - block request immediately
      return NextResponse.json({
        error: 'security_validation_failed',
        message: 'Request blocked by Trinity-ASI Zero Trust security',
        compliance: 'BSI_ANSSI_2025',
        violations: zeroTrustValidation.violations.filter(v => v.severity === 'critical')
      }, { status: 403 });
    }

    // Autenticar request
    const authContext = await OAuthMiddleware.authenticate(request);
    
    // Extraer headers relevantes
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const idempotencyKey = request.headers.get('idempotency-key') || undefined;

    // 🛡️ TRINITY-ASI ZERO TRUST SECURITY VALIDATION (Post-Auth)
    const fullContext = {
      authContext,
      userAgent,
      ipAddress,
      idempotencyKey,
      timestamp: new Date().toISOString(),
      fingerprint: generateRequestFingerprint(request),
    };
    
    const fullZeroTrustValidation = await ZeroTrust.validateRequest(request, fullContext);
    
    // Agregar contexto extendido a la request para que esté disponible en las tools
    (request as any).mcpContext = {
      authContext,
      userAgent,
      ipAddress,
      idempotencyKey,
      // Trinity-ASI Security Context
      zeroTrustValidation: fullZeroTrustValidation,
      securityLevel: fullZeroTrustValidation.complianceLevel,
      trustScore: fullZeroTrustValidation.trustScore,
    };

    // Log de acceso para auditoría con Trinity-ASI enhancement
    await AuditLogger.logEvent({
      eventType: AuditEventType.AUTH_SUCCESS,
      eventData: {
        method: request.method,
        url: request.url,
        userAgent,
        ipAddress,
        authenticated: authContext.isAuthenticated,
        userId: authContext.user?.id,
        // Trinity-ASI security metrics
        zeroTrustCompliance: fullZeroTrustValidation.complianceLevel,
        trustScore: fullZeroTrustValidation.trustScore,
        securityViolations: fullZeroTrustValidation.violations.length,
        trinityAsiEnhanced: true,
      },
      userId: authContext.user?.id,
      userAgent,
      ipAddress,
    });

    return await handler(request);
    
  } catch (error: any) {
    console.error('MCP Handler Error:', error);
    
    // Log error de autenticación
    await AuditLogger.logEvent({
      eventType: AuditEventType.AUTH_FAILURE,
      eventData: {
        error: error.message,
        url: request.url,
        method: request.method,
      },
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    }).catch(console.error);

    return NextResponse.json(
      { 
        error: 'internal_server_error', 
        message: 'Error processing MCP request' 
      },
      { status: 500 }
    );
  }
}

/**
 * Middleware de validación de herramientas
 */
function validateToolAccess(request: NextRequest, toolName?: string): boolean {
  const authContext = (request as any).mcpContext?.authContext;
  
  if (!authContext?.isAuthenticated) {
    // Para desarrollo, permitir acceso sin autenticación
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  }

  if (!toolName) {
    return true; // Request de metadata, no específica de herramienta
  }

  return OAuthMiddleware.validateToolAccess(toolName, authContext);
}

/**
 * Handler HTTP principal con middleware
 */
async function handleRequest(request: NextRequest): Promise<NextResponse> {
  return withAuthAndContext(request, async (req) => {
    // Manejar preflight CORS
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
        },
      });
    }

    // Extraer nombre de herramienta del body si está disponible
    let toolName: string | undefined;
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        toolName = body?.method?.replace('tools/', '');
      } catch {
        // Ignore parsing errors for tool name extraction
      }
    }

    // Validar acceso a herramienta
    if (!validateToolAccess(req, toolName)) {
      if (toolName) {
        return OAuthMiddleware.createForbiddenResponse(
          `Insufficient permissions for tool: ${toolName}`
        );
      } else {
        return OAuthMiddleware.createUnauthorizedResponse();
      }
    }

    // Delegar al handler MCP
    return handler(req);
  });
}

// Exportar handlers para diferentes métodos HTTP
export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

// 🚀 TRINITY-ASI UTILITY FUNCTIONS

/**
 * Extract request context for tools (DRY principle)
 */
function extractRequestContext(context?: any) {
  const authContext = context?.authContext;
  return {
    userId: authContext?.user?.id,
    userAgent: context?.userAgent,
    ipAddress: context?.ipAddress,
    idempotencyKey: context?.idempotencyKey,
  };
}

/**
 * Check rate limit for authenticated users (DRY principle)
 */
async function checkRateLimit(userId?: string, toolType?: string) {
  if (userId && toolType) {
    const rateLimit = await RateLimiter.checkRateLimit(userId, toolType);
    if (!rateLimit.allowed) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  }
}

/**
 * Log tool errors consistently (DRY principle)
 */
async function logToolError(toolName: string, error: any, input: any, context?: any) {
  console.error(`Error in ${toolName} tool:`, error);
  
  await AuditLogger.logEvent({
    eventType: AuditEventType.ERROR_OCCURRED,
    eventData: {
      toolName,
      error: error.message,
      input: input,
      timestamp: new Date().toISOString(),
      trinity_asi_enhanced: true,
    },
    userId: context?.authContext?.user?.id,
  });
}

/**
 * Generate request fingerprint for Zero Trust validation
 */
function generateRequestFingerprint(request: NextRequest): string {
  const crypto = require('crypto');
  
  const fingerprintData = {
    userAgent: request.headers.get('user-agent') || '',
    acceptLanguage: request.headers.get('accept-language') || '',
    acceptEncoding: request.headers.get('accept-encoding') || '',
    connection: request.headers.get('connection') || '',
    timestamp: Date.now(),
  };
  
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(fingerprintData))
    .digest('hex')
    .substring(0, 32);
}