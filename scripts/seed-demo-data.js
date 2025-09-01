#!/usr/bin/env node

/**
 * Demo Data Seeding Script for IntegridAI HackAI 2025
 * 
 * This script generates realistic demo data for the hackathon,
 * including providers, analyses, training sessions, and metrics.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  providersCount: 50,
  analysesPerProvider: 3,
  trainingSessionsCount: 100,
  metricsSnapshotsCount: 30,
  outputDir: './data',
  dbFile: './data/integridai_hackathon.db'
};

// Sample data generators
const SECTORS = [
  'Tecnología', 'Financiero', 'Construcción', 'Salud', 
  'Educación', 'Retail', 'Manufactura', 'Logística',
  'Energía', 'Telecomunicaciones', 'Farmacéutico', 'Automotriz'
];

const COMPANY_NAMES = [
  'TechCorp Argentina', 'Innovar Solutions', 'DataPro Services',
  'Sistemas Integrados', 'Digital Transform', 'CloudFirst',
  'AI Analytics', 'SmartBusiness', 'CyberSecure', 'DevOps Pro',
  'Fintech Plus', 'PaySafe Argentina', 'BankTech Solutions',
  'CreditCheck Pro', 'InsureTech', 'InvestSmart',
  'MedTech Argentina', 'HealthCare Plus', 'BioData Solutions',
  'PharmaTech', 'MediCore Systems', 'HealthConnect',
  'EduTech Argentina', 'LearningPro', 'AcademyDigital',
  'SkillsBuilder', 'TrainingTech', 'KnowledgeBase',
  'RetailTech', 'ShopSmart', 'E-Commerce Pro',
  'LogisticsPro', 'TransportTech', 'SupplyChain Plus'
];

const RISK_SCENARIOS = [
  {
    description: 'Conflicto de Intereses en Procurement',
    category: 'ethics',
    difficulty: 'beginner',
    duration: 15
  },
  {
    description: 'Manejo de Información Privilegiada',
    category: 'compliance',
    difficulty: 'intermediate', 
    duration: 20
  },
  {
    description: 'Due Diligence de Terceros',
    category: 'risk_management',
    difficulty: 'advanced',
    duration: 25
  },
  {
    description: 'Políticas Anti-Soborno',
    category: 'legal',
    difficulty: 'beginner',
    duration: 12
  },
  {
    description: 'Transparencia en Operaciones',
    category: 'governance',
    difficulty: 'intermediate',
    duration: 18
  }
];

// Utility functions
function generateCUIT() {
  const prefix = Math.floor(Math.random() * 99) + 1;
  const middle = Math.floor(Math.random() * 99999999) + 10000000;
  const suffix = Math.floor(Math.random() * 9) + 1;
  return `${prefix.toString().padStart(2, '0')}-${middle}-${suffix}`;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// Data generators
function generateProvider() {
  const baseName = randomChoice(COMPANY_NAMES);
  const suffix = ['SA', 'SRL', 'SAS', 'COOP'][Math.floor(Math.random() * 4)];
  
  return {
    cuit: generateCUIT(),
    name: `${baseName} ${suffix}`,
    sector: randomChoice(SECTORS),
    website: `https://${baseName.toLowerCase().replace(/\s+/g, '')}.com.ar`,
    employees: randomInt(10, 1000),
    annual_revenue: randomFloat(1000000, 500000000),
    created_at: generateDate(randomInt(30, 365)),
    updated_at: generateDate(randomInt(0, 30))
  };
}

function generateAnalysis(providerId, providerData) {
  const riskScore = randomFloat(20, 95);
  const riskLevel = riskScore >= 80 ? 'low' : 
                   riskScore >= 60 ? 'medium' :
                   riskScore >= 40 ? 'high' : 'critical';
  
  const complianceStatus = riskScore >= 70 ? 'compliant' :
                          riskScore >= 50 ? 'pending' : 'non-compliant';

  return {
    provider_id: providerId,
    analysis_type: 'comprehensive',
    risk_score: Math.round(riskScore * 100) / 100,
    risk_level: riskLevel,
    compliance_status: complianceStatus,
    verification_data: JSON.stringify({
      afip: {
        status: 'active',
        fiscal_category: randomChoice(['Responsable Inscripto', 'Monotributo', 'Exento']),
        verified_at: generateDate(randomInt(0, 7))
      },
      bcra: {
        financial_rating: randomChoice(['A+', 'A', 'A-', 'B+', 'B', 'B-']),
        debt_indicators: randomChoice(['low_risk', 'medium_risk', 'high_risk']),
        verified_at: generateDate(randomInt(0, 7))
      },
      cnv: {
        market_participation: randomChoice(['none', 'limited', 'active']),
        regulatory_status: randomChoice(['compliant', 'pending', 'n/a'])
      },
      uif: {
        aml_status: randomChoice(['clear', 'under_review', 'flagged']),
        suspicious_activities: randomInt(0, 3),
        verified_at: generateDate(randomInt(0, 7))
      }
    }),
    risk_factors: JSON.stringify([
      {
        category: 'financial',
        description: 'Financial stability assessment',
        weight: 0.3,
        score: randomInt(60, 90)
      },
      {
        category: 'regulatory',
        description: 'Regulatory compliance evaluation',
        weight: 0.4,
        score: randomInt(70, 95)
      },
      {
        category: 'operational',
        description: 'Operational risk assessment', 
        weight: 0.3,
        score: randomInt(50, 85)
      }
    ]),
    recommendations: JSON.stringify([
      'Review quarterly financial statements',
      'Update compliance training for staff',
      'Implement enhanced due diligence procedures',
      'Monitor regulatory changes in sector'
    ].slice(0, randomInt(2, 4))),
    documents_analyzed: randomInt(3, 12),
    next_review_date: generateDate(-randomInt(30, 180)),
    created_at: generateDate(randomInt(0, 90))
  };
}

function generateTrainingScenario() {
  const scenario = randomChoice(RISK_SCENARIOS);
  
  return {
    title: scenario.description,
    description: `Entrenamiento práctico en ${scenario.description.toLowerCase()}`,
    difficulty: scenario.difficulty,
    duration_minutes: scenario.duration,
    category: scenario.category,
    learning_objectives: JSON.stringify([
      'Identificar situaciones de riesgo',
      'Aplicar marco regulatorio apropiado',
      'Tomar decisiones éticas fundamentadas',
      'Documentar procesos de compliance'
    ]),
    scenario_data: JSON.stringify({
      questions: [
        {
          id: 'q1',
          text: '¿Cuál es la acción más apropiada en esta situación?',
          options: [
            { id: 'a', text: 'Proceder sin consultar', weight: -10 },
            { id: 'b', text: 'Consultar con supervisor', weight: 8 },
            { id: 'c', text: 'Escalar a compliance', weight: 10 },
            { id: 'd', text: 'Documentar y proceder', weight: 5 }
          ]
        }
      ],
      context: 'Situación hipotética basada en casos reales de compliance.',
      evaluation_criteria: ['Legal compliance', 'Ethical reasoning', 'Risk assessment']
    }),
    created_at: generateDate(randomInt(0, 30))
  };
}

function generateTrainingSession(userId, scenarioId) {
  const score = randomFloat(60, 98);
  const completed = Math.random() > 0.1; // 90% completion rate
  
  return {
    user_id: userId,
    scenario_id: scenarioId,
    started_at: generateDate(randomInt(0, 30)),
    completed_at: completed ? generateDate(randomInt(0, 7)) : null,
    score: completed ? Math.round(score * 100) / 100 : null,
    responses: JSON.stringify(completed ? [
      {
        question_id: 'q1',
        selected_answer: 'c',
        reasoning: 'Es la opción que mejor cumple con protocolos de compliance',
        score: randomInt(8, 10),
        feedback: 'Excelente análisis del riesgo regulatorio'
      }
    ] : []),
    achievements_earned: JSON.stringify(completed && score > 85 ? [
      'compliance_expert',
      'risk_analyst',
      'ethics_champion'
    ] : []),
    session_data: JSON.stringify({
      progress: completed ? 100 : randomInt(20, 80),
      time_spent: randomInt(600, 1800), // 10-30 minutes
      difficulty_rating: randomInt(3, 5),
      satisfaction_rating: randomInt(4, 5)
    })
  };
}

function generateMetricsSnapshot() {
  const metricTypes = ['dashboard', 'risk_distribution', 'training_metrics', 'compliance_trends'];
  const metricType = randomChoice(metricTypes);
  
  const metricsData = {
    dashboard: {
      total_providers: randomInt(800, 1500),
      high_risk_providers: randomInt(15, 50),
      compliance_rate: randomFloat(85, 98),
      avg_risk_score: randomFloat(70, 85),
      training_completion_rate: randomFloat(80, 95)
    },
    risk_distribution: {
      low: randomInt(55, 70),
      medium: randomInt(20, 30), 
      high: randomInt(8, 15),
      critical: randomInt(2, 7)
    },
    training_metrics: {
      active_users: randomInt(30, 80),
      sessions_completed: randomInt(200, 500),
      avg_score: randomFloat(75, 90),
      completion_rate: randomFloat(82, 95)
    },
    compliance_trends: {
      monthly_analyses: randomInt(80, 150),
      compliance_improvement: randomFloat(-5, 15),
      risk_score_trend: randomFloat(-2, 8)
    }
  };
  
  return {
    metric_type: metricType,
    metric_data: JSON.stringify(metricsData[metricType]),
    calculated_at: generateDate(randomInt(0, 30))
  };
}

// Database creation functions
function createDatabase() {
  console.log('🗄️ Creating SQLite database schema...');
  
  // Ensure data directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Create database schema (SQLite commands)
  const schema = `
-- Providers table
CREATE TABLE IF NOT EXISTS providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cuit TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sector TEXT,
    website TEXT,
    employees INTEGER,
    annual_revenue REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analyses table  
CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER REFERENCES providers(id),
    analysis_type TEXT NOT NULL DEFAULT 'comprehensive',
    risk_score REAL NOT NULL,
    risk_level TEXT NOT NULL,
    compliance_status TEXT NOT NULL,
    verification_data JSON,
    risk_factors JSON,
    recommendations JSON,
    documents_analyzed INTEGER DEFAULT 0,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training scenarios table
CREATE TABLE IF NOT EXISTS training_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL,
    duration_minutes INTEGER,
    category TEXT,
    learning_objectives JSON,
    scenario_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training sessions table
CREATE TABLE IF NOT EXISTS training_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    scenario_id INTEGER REFERENCES training_scenarios(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    score REAL,
    responses JSON,
    achievements_earned JSON,
    session_data JSON
);

-- Metrics snapshots table
CREATE TABLE IF NOT EXISTS metrics_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL,
    metric_data JSON,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_providers_cuit ON providers(cuit);
CREATE INDEX IF NOT EXISTS idx_providers_sector ON providers(sector);
CREATE INDEX IF NOT EXISTS idx_analyses_provider_id ON analyses(provider_id);
CREATE INDEX IF NOT EXISTS idx_analyses_risk_score ON analyses(risk_score);
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON metrics_snapshots(metric_type);
`;

  // Write schema to file for reference
  fs.writeFileSync(path.join(CONFIG.outputDir, 'schema.sql'), schema);
  
  return schema;
}

function generateAndSaveData() {
  console.log('📊 Generating demo data...');
  
  const data = {
    providers: [],
    analyses: [],
    training_scenarios: [],
    training_sessions: [],
    metrics_snapshots: []
  };

  // Generate providers
  console.log(`  📋 Generating ${CONFIG.providersCount} providers...`);
  for (let i = 0; i < CONFIG.providersCount; i++) {
    data.providers.push(generateProvider());
  }

  // Generate analyses for each provider
  console.log(`  🔍 Generating analyses...`);
  data.providers.forEach((provider, index) => {
    const providerId = index + 1; // SQLite auto-increment starts at 1
    
    for (let j = 0; j < CONFIG.analysesPerProvider; j++) {
      data.analyses.push(generateAnalysis(providerId, provider));
    }
  });

  // Generate training scenarios
  console.log('  🎮 Generating training scenarios...');
  for (let i = 0; i < RISK_SCENARIOS.length; i++) {
    data.training_scenarios.push(generateTrainingScenario());
  }

  // Generate training sessions
  console.log(`  📚 Generating ${CONFIG.trainingSessionsCount} training sessions...`);
  for (let i = 0; i < CONFIG.trainingSessionsCount; i++) {
    const userId = `user_hackathon_${(i % 20) + 1}`; // 20 different users
    const scenarioId = randomInt(1, RISK_SCENARIOS.length);
    data.training_sessions.push(generateTrainingSession(userId, scenarioId));
  }

  // Generate metrics snapshots
  console.log(`  📈 Generating ${CONFIG.metricsSnapshotsCount} metrics snapshots...`);
  for (let i = 0; i < CONFIG.metricsSnapshotsCount; i++) {
    data.metrics_snapshots.push(generateMetricsSnapshot());
  }

  // Save data to JSON files for reference
  Object.keys(data).forEach(table => {
    const filepath = path.join(CONFIG.outputDir, `${table}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data[table], null, 2));
    console.log(`  ✅ ${table}: ${data[table].length} records saved to ${filepath}`);
  });

  return data;
}

function generateSQLInserts(data) {
  console.log('🔧 Generating SQL insert statements...');
  
  let sql = '';
  
  // Providers
  sql += '-- Inserting providers\\n';
  data.providers.forEach(provider => {
    const values = [
      `'${provider.cuit}'`,
      `'${provider.name.replace(/'/g, "''")}'`,
      `'${provider.sector}'`,
      `'${provider.website}'`,
      provider.employees,
      provider.annual_revenue,
      `'${provider.created_at}'`,
      `'${provider.updated_at}'`
    ];
    sql += `INSERT INTO providers (cuit, name, sector, website, employees, annual_revenue, created_at, updated_at) VALUES (${values.join(', ')});\\n`;
  });

  // Analyses
  sql += '\\n-- Inserting analyses\\n';
  data.analyses.forEach(analysis => {
    const values = [
      analysis.provider_id,
      `'${analysis.analysis_type}'`,
      analysis.risk_score,
      `'${analysis.risk_level}'`,
      `'${analysis.compliance_status}'`,
      `'${analysis.verification_data.replace(/'/g, "''")}'`,
      `'${analysis.risk_factors.replace(/'/g, "''")}'`,
      `'${analysis.recommendations.replace(/'/g, "''")}'`,
      analysis.documents_analyzed,
      `'${analysis.next_review_date}'`,
      `'${analysis.created_at}'`
    ];
    sql += `INSERT INTO analyses (provider_id, analysis_type, risk_score, risk_level, compliance_status, verification_data, risk_factors, recommendations, documents_analyzed, next_review_date, created_at) VALUES (${values.join(', ')});\\n`;
  });

  // Training scenarios
  sql += '\\n-- Inserting training scenarios\\n';
  data.training_scenarios.forEach(scenario => {
    const values = [
      `'${scenario.title.replace(/'/g, "''")}'`,
      `'${scenario.description.replace(/'/g, "''")}'`,
      `'${scenario.difficulty}'`,
      scenario.duration_minutes,
      `'${scenario.category}'`,
      `'${scenario.learning_objectives.replace(/'/g, "''")}'`,
      `'${scenario.scenario_data.replace(/'/g, "''")}'`,
      `'${scenario.created_at}'`
    ];
    sql += `INSERT INTO training_scenarios (title, description, difficulty, duration_minutes, category, learning_objectives, scenario_data, created_at) VALUES (${values.join(', ')});\\n`;
  });

  // Training sessions
  sql += '\\n-- Inserting training sessions\\n';
  data.training_sessions.forEach(session => {
    const values = [
      `'${session.user_id}'`,
      session.scenario_id,
      `'${session.started_at}'`,
      session.completed_at ? `'${session.completed_at}'` : 'NULL',
      session.score || 'NULL',
      `'${session.responses.replace(/'/g, "''")}'`,
      `'${session.achievements_earned.replace(/'/g, "''")}'`,
      `'${session.session_data.replace(/'/g, "''")}'`
    ];
    sql += `INSERT INTO training_sessions (user_id, scenario_id, started_at, completed_at, score, responses, achievements_earned, session_data) VALUES (${values.join(', ')});\\n`;
  });

  // Metrics snapshots
  sql += '\\n-- Inserting metrics snapshots\\n';
  data.metrics_snapshots.forEach(metrics => {
    const values = [
      `'${metrics.metric_type}'`,
      `'${metrics.metric_data.replace(/'/g, "''")}'`,
      `'${metrics.calculated_at}'`
    ];
    sql += `INSERT INTO metrics_snapshots (metric_type, metric_data, calculated_at) VALUES (${values.join(', ')});\\n`;
  });

  // Save SQL to file
  const sqlFile = path.join(CONFIG.outputDir, 'seed_data.sql');
  fs.writeFileSync(sqlFile, sql);
  console.log(`  ✅ SQL inserts saved to ${sqlFile}`);

  return sql;
}

// Main execution
async function main() {
  console.log('🚀 IntegridAI HackAI 2025 - Demo Data Seeding');
  console.log('===============================================\\n');

  try {
    // Create database schema
    const schema = createDatabase();

    // Generate data
    const data = generateAndSaveData();

    // Generate SQL inserts
    generateSQLInserts(data);

    // Summary
    console.log('\\n📊 Demo Data Generation Complete!');
    console.log('==================================');
    console.log(`📋 Providers: ${data.providers.length}`);
    console.log(`🔍 Analyses: ${data.analyses.length}`);
    console.log(`🎮 Training Scenarios: ${data.training_scenarios.length}`);
    console.log(`📚 Training Sessions: ${data.training_sessions.length}`);
    console.log(`📈 Metrics Snapshots: ${data.metrics_snapshots.length}`);
    console.log(`\\n📁 Files created in: ${CONFIG.outputDir}/`);
    console.log('   - schema.sql (database schema)');
    console.log('   - seed_data.sql (insert statements)');
    console.log('   - *.json (data files for reference)');

    console.log('\\n✨ Ready for HackAI 2025! ¡Éxito en el hackathon!');

  } catch (error) {
    console.error('❌ Error generating demo data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateProvider,
  generateAnalysis,
  generateTrainingScenario,
  generateTrainingSession,
  generateMetricsSnapshot,
  CONFIG
};