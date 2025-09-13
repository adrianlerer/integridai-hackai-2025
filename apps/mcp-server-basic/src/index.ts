#!/usr/bin/env node

/**
 * IntegridAI MCP Server Básico - HackAI 2025
 * 
 * Servidor MCP especializado en herramientas básicas de compliance para Ley 27.401
 * Versión pública sin contenido privado de Trinity-ASI
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Importar herramientas básicas
import { integrityAssessmentTool } from './tools/integrityAssessment.js';
import { basicEthicsSimulatorTool } from './tools/basicEthicsSimulator.js';
import { complianceCheckerTool } from './tools/complianceChecker.js';
import { basicTrainingRecommendationsTool } from './tools/basicTrainingRecommendations.js';

class IntegridAIBasicServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'integridai-basic',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // Lista de herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'integrity_assessment',
            description: 'Evalúa el nivel de integridad empresarial según Ley 27.401',
            inputSchema: {
              type: 'object',
              properties: {
                companyName: {
                  type: 'string',
                  description: 'Nombre de la empresa a evaluar',
                },
                sector: {
                  type: 'string',
                  enum: ['tecnologia', 'finanzas', 'consultoria', 'manufactura', 'servicios', 'otro'],
                  description: 'Sector empresarial',
                },
                employeeCount: {
                  type: 'number',
                  description: 'Número aproximado de empleados',
                },
                hasComplianceProgram: {
                  type: 'boolean',
                  description: '¿La empresa tiene un programa de compliance?',
                },
                riskAreas: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Áreas de riesgo identificadas',
                },
              },
              required: ['companyName', 'sector', 'employeeCount', 'hasComplianceProgram'],
            },
          },
          {
            name: 'basic_ethics_simulation',
            description: 'Simula un escenario ético básico para entrenamiento',
            inputSchema: {
              type: 'object',
              properties: {
                scenarioType: {
                  type: 'string',
                  enum: ['regalo_proveedor', 'conflicto_interes', 'informacion_privilegiada', 'facilitacion_pagos'],
                  description: 'Tipo de escenario ético a simular',
                },
                userRole: {
                  type: 'string',
                  enum: ['empleado', 'supervisor', 'gerente', 'directivo'],
                  description: 'Rol del usuario en la empresa',
                },
                contextDetails: {
                  type: 'string',
                  description: 'Detalles específicos del contexto organizacional',
                },
              },
              required: ['scenarioType', 'userRole'],
            },
          },
          {
            name: 'compliance_checker',
            description: 'Verifica el cumplimiento básico de Ley 27.401',
            inputSchema: {
              type: 'object',
              properties: {
                policies: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Lista de políticas implementadas',
                },
                trainings: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Entrenamientos realizados',
                },
                controls: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Controles internos implementados',
                },
                lastAuditDate: {
                  type: 'string',
                  description: 'Fecha de la última auditoría (YYYY-MM-DD)',
                },
              },
              required: ['policies'],
            },
          },
          {
            name: 'basic_training_recommendations',
            description: 'Genera recomendaciones básicas de entrenamiento en ética',
            inputSchema: {
              type: 'object',
              properties: {
                department: {
                  type: 'string',
                  enum: ['ventas', 'compras', 'finanzas', 'rrhh', 'operaciones', 'general'],
                  description: 'Departamento objetivo',
                },
                experienceLevel: {
                  type: 'string',
                  enum: ['junior', 'semi-senior', 'senior', 'ejecutivo'],
                  description: 'Nivel de experiencia del público objetivo',
                },
                previousIncidents: {
                  type: 'boolean',
                  description: '¿Ha habido incidentes previos de ética en esta área?',
                },
                timeAvailable: {
                  type: 'number',
                  description: 'Tiempo disponible para entrenamiento (en horas)',
                },
              },
              required: ['department', 'experienceLevel', 'timeAvailable'],
            },
          },
        ],
      };
    });

    // Manejador de ejecución de herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'integrity_assessment':
            return await integrityAssessmentTool(args as any);

          case 'basic_ethics_simulation':
            return await basicEthicsSimulatorTool(args as any);

          case 'compliance_checker':
            return await complianceCheckerTool(args as any);

          case 'basic_training_recommendations':
            return await basicTrainingRecommendationsTool(args as any);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Herramienta desconocida: ${name}`
            );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(
          ErrorCode.InternalError,
          `Error ejecutando ${name}: ${errorMessage}`
        );
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('IntegridAI MCP Server Básico iniciado para HackAI 2025');
    console.error('Especializado en herramientas de compliance Ley 27.401');
  }
}

// Iniciar servidor
const server = new IntegridAIBasicServer();
server.run().catch(console.error);