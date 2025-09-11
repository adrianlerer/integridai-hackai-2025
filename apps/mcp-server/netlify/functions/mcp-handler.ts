import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import {
  simulateEthicsCase,
  SimulateEthicsCaseSchema,
  SimulateEthicsCaseOutputSchema
} from '../../lib/mcp/tools/simulateEthicsCase';
import {
  runIntegritySurvey,
  RunIntegritySurveySchema,
  RunIntegritySurveyOutputSchema
} from '../../lib/mcp/tools/runIntegritySurvey';
import { OAuthMiddleware, RateLimiter } from '../../lib/infra/oauth';
import { AuditLogger, AuditEventType } from '../../lib/infra/audit';
import { cleanExpiredIdempotencyRecords } from '../../lib/infra/db';

interface MCPRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * Handler principal MCP para Netlify Functions
 * Implementa protocolo MCP sobre HTTP para IntegridAI
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Limpiar registros expirados ocasionalmente
    if (Math.random() < 0.1) {
      await cleanExpiredIdempotencyRecords().catch(console.error);
    }

    // Parse request
    if (!event.body) {
      return createErrorResponse(400, -32700, 'Parse error: Missing request body');
    }

    let mcpRequest: MCPRequest;
    try {
      mcpRequest = JSON.parse(event.body);
    } catch (error) {
      return createErrorResponse(400, -32700, 'Parse error: Invalid JSON');
    }

    // Validate MCP structure
    if (!mcpRequest.jsonrpc || mcpRequest.jsonrpc !== '2.0') {
      return createErrorResponse(400, -32600, 'Invalid Request: Missing or invalid jsonrpc');
    }

    if (mcpRequest.id === undefined) {
      return createErrorResponse(400, -32600, 'Invalid Request: Missing id');
    }

    // Extract context
    const userAgent = event.headers['user-agent'] || '';
    const ipAddress = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const idempotencyKey = event.headers['idempotency-key'];
    const authHeader = event.headers.authorization;

    // Authenticate
    const user = authHeader ? await OAuthMiddleware.validateToken(authHeader) : null;
    const authContext = OAuthMiddleware.createAuthContext(user);

    const requestContext = {
      userId: user?.id,
      userAgent,
      ipAddress,
      idempotencyKey,
    };

    // Log access
    await AuditLogger.logEvent({
      eventType: AuditEventType.AUTH_SUCCESS,
      eventData: {
        method: event.httpMethod,
        path: event.path,
        mcpMethod: mcpRequest.method,
        userAgent,
        ipAddress,
        authenticated: authContext.isAuthenticated,
        userId: user?.id,
      },
      userId: user?.id,
      userAgent,
      ipAddress,
    }).catch(console.error);

    // Handle MCP methods
    const response = await handleMCPMethod(mcpRequest, authContext, requestContext);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error: any) {
    console.error('MCP Handler Error:', error);

    // Log error
    await AuditLogger.logEvent({
      eventType: AuditEventType.ERROR_OCCURRED,
      eventData: {
        error: error.message,
        path: event.path,
        method: event.httpMethod,
      },
      userAgent: event.headers['user-agent'] || '',
      ipAddress: event.headers['x-forwarded-for'] || 'unknown',
    }).catch(console.error);

    return createErrorResponse(500, -32603, 'Internal error', { message: error.message });
  }
};

async function handleMCPMethod(
  request: MCPRequest,
  authContext: any,
  requestContext: any
): Promise<MCPResponse> {
  
  switch (request.method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'integridai-mcp-server',
            version: '1.0.0',
            description: 'IntegridAI MCP Server - Workflow tools para compliance Ley 27.401',
          },
        },
      };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: [
            {
              name: 'simulate_ethics_case',
              description: 'Ejecuta un caso del FLAISimulator end-to-end y devuelve un informe ejecutivo con recomendaciones conforme Ley 27.401',
              inputSchema: SimulateEthicsCaseSchema,
            },
            {
              name: 'run_integrity_survey',
              description: 'Ejecuta la Encuesta de Integridad completa, genera artefactos CSV/JSON y resumen ejecutivo conforme Ley 27.401',
              inputSchema: RunIntegritySurveySchema,
            },
          ],
        },
      };

    case 'tools/call':
      return await handleToolCall(request, authContext, requestContext);

    default:
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`,
        },
      };
  }
}

async function handleToolCall(
  request: MCPRequest,
  authContext: any,
  requestContext: any
): Promise<MCPResponse> {
  
  const { name, arguments: args } = request.params || {};

  if (!name) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32602,
        message: 'Invalid params: Missing tool name',
      },
    };
  }

  // Validate tool access
  if (!validateToolAccess(name, authContext)) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Insufficient permissions for tool: ${name}`,
      },
    };
  }

  try {
    let result: any;

    switch (name) {
      case 'simulate_ethics_case':
        // Rate limiting
        if (authContext.user?.id) {
          const rateLimit = await RateLimiter.checkRateLimit(
            authContext.user.id,
            'ethics_simulation'
          );
          
          if (!rateLimit.allowed) {
            return {
              jsonrpc: '2.0',
              id: request.id,
              error: {
                code: -32603,
                message: 'Rate limit exceeded. Please try again later.',
              },
            };
          }
        }

        result = await simulateEthicsCase(args, requestContext);
        result = SimulateEthicsCaseOutputSchema.parse(result);
        break;

      case 'run_integrity_survey':
        // Rate limiting
        if (authContext.user?.id) {
          const rateLimit = await RateLimiter.checkRateLimit(
            authContext.user.id,
            'integrity_survey'
          );
          
          if (!rateLimit.allowed) {
            return {
              jsonrpc: '2.0',
              id: request.id,
              error: {
                code: -32603,
                message: 'Rate limit exceeded. Please try again later.',
              },
            };
          }
        }

        result = await runIntegritySurvey(args, requestContext);
        result = RunIntegritySurveyOutputSchema.parse(result);
        break;

      default:
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown tool: ${name}`,
          },
        };
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      },
    };

  } catch (error: any) {
    console.error(`Error executing tool ${name}:`, error);

    // Log tool error
    await AuditLogger.logEvent({
      eventType: AuditEventType.ERROR_OCCURRED,
      eventData: {
        toolName: name,
        error: error.message,
        arguments: args,
      },
      userId: requestContext.userId,
    }).catch(console.error);

    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Error executing tool: ${error.message}`,
        data: { tool: name },
      },
    };
  }
}

function validateToolAccess(toolName: string, authContext: any): boolean {
  // Para desarrollo, permitir acceso sin autenticación
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  if (!authContext?.isAuthenticated) {
    return false;
  }

  return OAuthMiddleware.validateToolAccess(toolName, authContext);
}

function createErrorResponse(
  statusCode: number,
  code: number,
  message: string,
  data?: any
): { statusCode: number; headers: Record<string, string>; body: string } {
  
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: {
        code,
        message,
        data,
      },
    }),
  };
}