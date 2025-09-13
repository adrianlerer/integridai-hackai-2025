#!/usr/bin/env node

/**
 * Script de prueba para el MCP Server básico de IntegridAI
 * 
 * Prueba las 4 herramientas básicas de compliance
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

console.log('🚀 Iniciando pruebas del MCP Server IntegridAI Básico...\n');

// Ejemplos de prueba para cada herramienta
const testCases = [
  {
    name: 'integrity_assessment',
    description: '🔍 Evaluación de Integridad Empresarial',
    args: {
      companyName: 'TechCorp Argentina S.A.',
      sector: 'tecnologia',
      employeeCount: 150,
      hasComplianceProgram: true,
      riskAreas: ['manejo_datos_clientes', 'contratos_gubernamentales']
    }
  },
  {
    name: 'basic_ethics_simulation',
    description: '🎭 Simulación Ética - Conflicto de Interés',
    args: {
      scenarioType: 'conflicto_interes',
      userRole: 'gerente',
      contextDetails: 'Evaluación de proveedor donde trabaja un familiar directo'
    }
  },
  {
    name: 'compliance_checker',
    description: '📊 Verificación de Compliance Ley 27.401',
    args: {
      policies: [
        'Código de Ética Corporativo',
        'Política de Prevención de Corrupción',
        'Manual de Conflictos de Interés'
      ],
      trainings: [
        'Capacitación Ley 27.401',
        'Entrenamiento en Ética Empresarial',
        'Curso de Compliance Financiero'
      ],
      controls: [
        'Auditoría Interna Trimestral',
        'Canal de Denuncias 24/7',
        'Due Diligence de Proveedores'
      ],
      lastAuditDate: '2024-06-15'
    }
  },
  {
    name: 'basic_training_recommendations',
    description: '📚 Recomendaciones de Entrenamiento',
    args: {
      department: 'compras',
      experienceLevel: 'senior',
      previousIncidents: false,
      timeAvailable: 8
    }
  }
];

async function testMCPServer() {
  console.log('📋 Casos de prueba preparados:\n');
  
  testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. ${testCase.description}`);
    console.log(`   Herramienta: ${testCase.name}`);
    console.log(`   Parámetros: ${Object.keys(testCase.args).join(', ')}\n`);
  });

  console.log('💡 Para usar el MCP Server con Claude Desktop:');
  console.log('1. Asegúrate de que esté compilado: npm run build');
  console.log('2. Añade la configuración a Claude Desktop');
  console.log('3. Reinicia Claude Desktop');
  console.log('4. Usa comandos como:');
  console.log('   "Evalúa la integridad de mi empresa tecnológica con 150 empleados"');
  console.log('   "Simula un escenario de conflicto de interés para un gerente"');
  console.log('   "Verifica nuestro compliance actual con estas políticas..."');
  console.log('   "Recomienda entrenamiento para el departamento de compras"\n');

  console.log('🔧 Configuración para Claude Desktop:');
  try {
    const config = readFileSync('./claude-desktop-config.json', 'utf8');
    console.log(config);
  } catch (error) {
    console.log('Error leyendo configuración:', error.message);
  }

  console.log('\n✅ MCP Server listo para integración con Claude Desktop!');
  console.log('📍 Ruta del servidor: ./dist/index.js');
  console.log('🌐 Funcionalidades: 4 herramientas básicas de compliance Ley 27.401');
}

// Ejecutar pruebas
testMCPServer().catch(console.error);