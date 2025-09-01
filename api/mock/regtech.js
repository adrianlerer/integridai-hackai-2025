// 🤖 Mock RegTech API for HackAI 2025
// Safe demo endpoints - no real government APIs

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Demo data generator
function generateDemoAnalysis(providerData) {
  const { name, cuit, sector } = providerData;
  
  // Simulate analysis based on input (deterministic for demo)
  const checksum = (cuit || '20-12345678-9')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate realistic but fake score
  const baseScore = 60 + (checksum % 30); // 60-90 range
  const sectorAdjustments = {
    'servicios_financieros': -5,
    'construccion': -10,
    'energia': -3,
    'tecnologia': +5,
    'educacion': +8,
    'salud': +3,
    'otros': 0
  };
  
  const finalScore = Math.max(45, Math.min(95, 
    baseScore + (sectorAdjustments[sector] || 0)
  ));
  
  // Determine risk level
  let riskLevel = 'bajo';
  if (finalScore < 60) riskLevel = 'alto';
  else if (finalScore < 80) riskLevel = 'medio';
  
  // Generate mock verifications
  const verifications = {
    afip: {
      verified: checksum % 5 !== 0, // 80% success rate
      status: checksum % 5 !== 0 ? 'Contribuyente activo' : 'Observaciones menores',
      confidence: 0.9,
      details: `CUIT: ${cuit} - Verificación automática demo`,
      source: 'AFIP Demo API',
      verification_date: new Date().toISOString().split('T')[0]
    },
    bcra: {
      verified: checksum % 4 !== 0, // 75% success rate
      status: checksum % 4 !== 0 ? 'Sin observaciones' : 'Revisión pendiente',
      confidence: 0.85,
      details: 'Consulta BCRA sistema demo',
      source: 'BCRA Demo API'
    },
    cnv: {
      verified: checksum % 3 !== 0, // 66% success rate
      status: checksum % 3 !== 0 ? 'Cumplimiento satisfactorio' : 'En evaluación',
      confidence: 0.8,
      details: 'Verificación CNV demo',
      source: 'CNV Demo API'
    },
    uif: {
      verified: checksum % 6 !== 0, // 83% success rate
      status: checksum % 6 !== 0 ? 'Sin alertas' : 'Monitoreo estándar',
      confidence: 0.95,
      details: 'Consulta UIF sistema demo',
      source: 'UIF Demo API'
    }
  };
  
  // Generate risk factors
  const riskFactors = [];
  if (finalScore < 70) {
    riskFactors.push({
      category: 'Compliance General',
      level: 'medium',
      description: `Score ${finalScore}% por debajo del objetivo (70%)`,
      impact: 'medium'
    });
  }
  
  if (sector === 'construccion') {
    riskFactors.push({
      category: 'Riesgo Sectorial',
      level: 'high',
      description: 'Sector construcción presenta riesgo elevado según estadísticas LATAM',
      impact: 'high'
    });
  }
  
  // Generate recommendations
  const recommendations = {
    immediate: [],
    short_term: [],
    long_term: []
  };
  
  if (finalScore < 80) {
    recommendations.short_term.push('Implementar programa de integridad según Ley 27.401');
    recommendations.short_term.push('Establecer sistema de monitoreo continuo');
  }
  
  recommendations.long_term.push('Desarrollar cultura de integridad empresarial');
  
  if (finalScore >= 85) {
    recommendations.immediate.push('Mantener estándares actuales de compliance');
  } else if (finalScore < 60) {
    recommendations.immediate.push('Revisión integral de procesos de compliance requerida');
  }
  
  return {
    success: true,
    analysis_id: `demo_${Date.now()}_${checksum}`,
    provider_info: {
      name,
      cuit,
      sector
    },
    compliance_analysis: {
      overall_score: parseFloat(finalScore.toFixed(1)),
      risk_level: riskLevel,
      confidence_level: 0.87
    },
    official_verifications: verifications,
    risk_analysis: {
      factors: riskFactors
    },
    recommendations,
    executive_summary: `**ANÁLISIS DEMO - ${name.toUpperCase()}**\n\nScore: ${finalScore.toFixed(1)}% (${riskLevel.toUpperCase()})\nVerificaciones: ${Object.values(verifications).filter(v => v.verified).length}/4 exitosas\nRecomendación: ${finalScore >= 80 ? 'Apto para contratación' : finalScore >= 60 ? 'Apto con monitoreo' : 'Requiere mejoras'}`,
    analysis_metadata: {
      duration_seconds: Math.round(Math.random() * 25 + 5), // 5-30 seconds
      documents_analyzed: providerData.documents?.length || 0,
      verification_sources: 4,
      ai_enhanced: true
    }
  };
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'IntegridAI RegTech Demo API',
    version: '1.0.0-hackathon',
    timestamp: new Date().toISOString(),
    mode: 'demo',
    capabilities: [
      'provider_analysis_demo',
      'compliance_scoring_demo',
      'mock_verification_apis',
      'demo_data_generation'
    ]
  });
});

// Analyze provider endpoint (main functionality)
app.post('/analyze_provider', (req, res) => {
  try {
    const { name, cuit, sector, documents, contact_email } = req.body;
    
    // Basic validation
    if (!name || !cuit || !sector) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: name, cuit, sector'
      });
    }
    
    // Generate demo analysis
    const analysis = generateDemoAnalysis({ name, cuit, sector, documents });
    
    // Simulate processing delay
    setTimeout(() => {
      res.json(analysis);
    }, Math.random() * 2000 + 500); // 0.5-2.5 seconds delay
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor demo',
      details: error.message
    });
  }
});

// Dashboard metrics endpoint
app.get('/compliance_dashboard', (req, res) => {
  // Generate demo dashboard data
  const metrics = {
    success: true,
    timestamp: new Date().toISOString(),
    system_status: 'demo_operational',
    metrics: {
      total_providers: Math.floor(Math.random() * 20) + 5,
      avg_compliance_score: parseFloat((Math.random() * 25 + 65).toFixed(1)),
      high_risk_providers: Math.floor(Math.random() * 3),
      analyses_24h: Math.floor(Math.random() * 10) + 1
    },
    recent_analyses: [
      {
        provider_name: 'Demo Construcciones SA',
        compliance_score: 72.3,
        analysis_date: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        risk_level: 'medio',
        sector: 'construccion'
      },
      {
        provider_name: 'TechInnovate SRL',
        compliance_score: 89.1,
        analysis_date: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        risk_level: 'bajo',
        sector: 'tecnologia'
      }
    ],
    sector_distribution: [
      { sector: 'tecnologia', count: 5, avg_score: 84.2 },
      { sector: 'construccion', count: 3, avg_score: 67.8 },
      { sector: 'servicios_financieros', count: 2, avg_score: 79.5 }
    ]
  };
  
  res.json(metrics);
});

// Regulatory updates endpoint
app.get('/regulatory_updates', (req, res) => {
  res.json({
    success: true,
    updates: [
      {
        id: 'demo_001',
        title: 'Actualización Demo Ley 27.401',
        description: 'Nuevos criterios de compliance para sector construcción',
        date: '2025-08-30',
        impact: 'medium',
        source: 'Demo Regulatory Authority'
      },
      {
        id: 'demo_002',
        title: 'Modificaciones Demo AFIP',
        description: 'Actualización en verificaciones automáticas',
        date: '2025-08-25',
        impact: 'low',
        source: 'Demo AFIP Updates'
      }
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 IntegridAI RegTech Demo API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/compliance_dashboard`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`⚡ Analysis: POST http://localhost:${PORT}/analyze_provider`);
  console.log('');
  console.log('🚀 Ready for HackAI 2025! 🎓');
});

module.exports = app;