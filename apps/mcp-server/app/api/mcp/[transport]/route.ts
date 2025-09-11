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
import { OAuthMiddleware, RateLimiter } from '@/infra/oauth';
import { AuditLogger, AuditEventType } from '@/infra/audit';
import { cleanExpiredIdempotencyRecords } from '@/infra/db';

/**
 * MCP Handler principal para IntegridAI
 * Implementa workflow tools para ejecución completa desde LLMs
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

}, {
  // Configuración del servidor MCP
  name: "integridai-mcp-server",
  version: "1.0.0",
  description: "IntegridAI MCP Server - Workflow tools para compliance Ley 27.401",
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

    // Autenticar request
    const authContext = await OAuthMiddleware.authenticate(request);
    
    // Extraer headers relevantes
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const idempotencyKey = request.headers.get('idempotency-key') || undefined;

    // Agregar contexto a la request para que esté disponible en las tools
    (request as any).mcpContext = {
      authContext,
      userAgent,
      ipAddress,
      idempotencyKey,
    };

    // Log de acceso para auditoría
    await AuditLogger.logEvent({
      eventType: AuditEventType.AUTH_SUCCESS,
      eventData: {
        method: request.method,
        url: request.url,
        userAgent,
        ipAddress,
        authenticated: authContext.isAuthenticated,
        userId: authContext.user?.id,
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