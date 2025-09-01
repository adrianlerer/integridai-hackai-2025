#!/usr/bin/env node

/**
 * Sample Analyses Generator for IntegridAI HackAI 2025
 * 
 * This script generates comprehensive sample analyses for demonstration
 * purposes, showcasing the full RegTech analysis capabilities.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: './data/samples',
  analysisCount: 20,
  includeFullDocumentation: true,
  generateReports: true
};

// Sample company data for realistic analyses
const SAMPLE_COMPANIES = [
  {
    name: 'TechInnovate Argentina SA',
    cuit: '30-71234567-8',
    sector: 'Tecnología',
    employees: 150,
    revenue: 25000000,
    established: '2018-03-15',
    description: 'Empresa de desarrollo de software especializada en fintech'
  },
  {
    name: 'MediCorp Healthcare SRL',
    cuit: '30-65432109-2',
    sector: 'Salud',
    employees: 85,
    revenue: 18000000,
    established: '2015-09-22',
    description: 'Prestador de servicios médicos con tecnología avanzada'
  },
  {
    name: 'EduFuture Learning SA',
    cuit: '30-78901234-5',
    sector: 'Educación',
    employees: 200,
    revenue: 12000000,
    established: '2019-01-10',
    description: 'Plataforma educativa digital con IA'
  },
  {
    name: 'GreenEnergy Solutions COOP',
    cuit: '30-34567890-1',
    sector: 'Energía',
    employees: 75,
    revenue: 35000000,
    established: '2020-06-01',
    description: 'Soluciones de energía renovable para empresas'
  },
  {
    name: 'LogiSmart Transport SAS',
    cuit: '30-89012345-6',
    sector: 'Logística',
    employees: 320,
    revenue: 45000000,
    established: '2016-11-30',
    description: 'Servicios de logística inteligente y distribución'
  }
];

// Risk analysis templates
const RISK_ANALYSIS_TEMPLATES = {
  excellent: {
    scoreRange: [85, 95],
    riskLevel: 'low',
    complianceStatus: 'compliant',
    template: 'La empresa demuestra excelentes prácticas de compliance y gestión de riesgos.'
  },
  good: {
    scoreRange: [70, 84],
    riskLevel: 'low',
    complianceStatus: 'compliant',
    template: 'La empresa mantiene buenas prácticas de compliance con áreas menores de mejora.'
  },
  moderate: {
    scoreRange: [55, 69],
    riskLevel: 'medium',
    complianceStatus: 'pending',
    template: 'La empresa presenta riesgos moderados que requieren atención y seguimiento.'
  },
  concerning: {
    scoreRange: [35, 54],
    riskLevel: 'high',
    complianceStatus: 'non-compliant',
    template: 'La empresa presenta riesgos significativos que requieren acción inmediata.'
  },
  critical: {
    scoreRange: [15, 34],
    riskLevel: 'critical',
    complianceStatus: 'non-compliant',
    template: 'La empresa presenta riesgos críticos que comprometen la relación comercial.'
  }
};

// Utility functions
function randomFloat(min, max, decimals = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function selectRiskTemplate(targetScore) {
  for (const [level, template] of Object.entries(RISK_ANALYSIS_TEMPLATES)) {
    if (targetScore >= template.scoreRange[0] && targetScore <= template.scoreRange[1]) {
      return { level, ...template };
    }
  }
  return RISK_ANALYSIS_TEMPLATES.moderate;
}

// Analysis generators
function generateDetailedVerificationData(company, riskTemplate) {
  const afipStatus = riskTemplate.riskLevel === 'critical' ? 'inactive' : 
                    riskTemplate.riskLevel === 'high' ? 'under_review' : 'active';
  
  const bcraRating = riskTemplate.riskLevel === 'low' ? randomChoice(['A+', 'A', 'A-']) :
                     riskTemplate.riskLevel === 'medium' ? randomChoice(['B+', 'B', 'B-']) :
                     riskTemplate.riskLevel === 'high' ? randomChoice(['C+', 'C']) : 'C-';

  const uifStatus = riskTemplate.riskLevel === 'critical' ? 'flagged' :
                   riskTemplate.riskLevel === 'high' ? 'under_review' : 'clear';

  return {
    afip: {
      status: afipStatus,
      fiscal_category: randomChoice(['Responsable Inscripto', 'Monotributo']),
      tax_compliance: riskTemplate.riskLevel === 'low' ? 'excellent' : 
                     riskTemplate.riskLevel === 'medium' ? 'good' : 'poor',
      recent_penalties: riskTemplate.riskLevel === 'high' ? randomInt(1, 3) : 0,
      last_declaration: generateDate(randomInt(30, 90)),
      verified_at: generateDate(randomInt(0, 2)),
      details: {
        registration_date: company.established,
        current_activity: 'Active',
        tax_debt: riskTemplate.riskLevel === 'high' ? randomFloat(10000, 100000) : 0,
        compliance_score: riskTemplate.riskLevel === 'low' ? randomInt(85, 95) : 
                         riskTemplate.riskLevel === 'medium' ? randomInt(70, 84) : randomInt(40, 69)
      }
    },
    bcra: {
      financial_rating: bcraRating,
      credit_score: riskTemplate.riskLevel === 'low' ? randomInt(750, 850) :
                   riskTemplate.riskLevel === 'medium' ? randomInt(650, 749) :
                   randomInt(400, 649),
      debt_indicators: riskTemplate.riskLevel === 'low' ? 'low_risk' :
                      riskTemplate.riskLevel === 'medium' ? 'medium_risk' : 'high_risk',
      payment_history: riskTemplate.riskLevel === 'low' ? 'excellent' : 
                      riskTemplate.riskLevel === 'medium' ? 'good' : 'poor',
      financial_stability: riskTemplate.riskLevel === 'low' ? 'stable' :
                          riskTemplate.riskLevel === 'medium' ? 'moderate' : 'volatile',
      verified_at: generateDate(randomInt(0, 3)),
      details: {
        total_debt: randomFloat(company.revenue * 0.1, company.revenue * 0.4),
        liquidity_ratio: randomFloat(1.2, 3.5),
        profitability_trend: riskTemplate.riskLevel === 'low' ? 'positive' : 
                            riskTemplate.riskLevel === 'medium' ? 'stable' : 'declining',
        market_position: randomChoice(['leader', 'competitive', 'emerging', 'challenger'])
      }
    },
    cnv: {
      market_participation: company.sector === 'Financiero' ? 'active' : 
                           Math.random() > 0.7 ? 'limited' : 'none',
      regulatory_status: riskTemplate.complianceStatus === 'compliant' ? 'compliant' :
                        riskTemplate.complianceStatus === 'pending' ? 'pending' : 'non-compliant',
      securities_violations: riskTemplate.riskLevel === 'high' ? randomInt(1, 2) : 0,
      last_audit: generateDate(randomInt(180, 365)),
      verified_at: generateDate(randomInt(0, 5))
    },
    uif: {
      aml_status: uifStatus,
      suspicious_activities: riskTemplate.riskLevel === 'high' ? randomInt(1, 3) : 
                            riskTemplate.riskLevel === 'medium' ? randomInt(0, 1) : 0,
      reporting_compliance: riskTemplate.complianceStatus === 'compliant' ? 'up_to_date' : 'delayed',
      risk_classification: riskTemplate.riskLevel,
      last_report: generateDate(randomInt(30, 90)),
      verified_at: generateDate(randomInt(0, 1)),
      details: {
        customer_due_diligence: riskTemplate.riskLevel === 'low' ? 'comprehensive' : 'basic',
        transaction_monitoring: riskTemplate.riskLevel === 'low' ? 'automated' : 'manual',
        staff_training: riskTemplate.complianceStatus === 'compliant' ? 'current' : 'outdated'
      }
    }
  };
}

function generateRiskFactorsAnalysis(company, riskTemplate, verificationData) {
  const factors = [
    {
      category: 'financial',
      description: 'Análisis de estabilidad financiera y solvencia',
      weight: 0.35,
      score: verificationData.bcra.details.profitability_trend === 'positive' ? randomInt(80, 95) :
             verificationData.bcra.details.profitability_trend === 'stable' ? randomInt(65, 79) :
             randomInt(40, 64),
      details: {
        revenue_stability: verificationData.bcra.details.profitability_trend,
        debt_ratio: (verificationData.bcra.details.total_debt / company.revenue).toFixed(2),
        liquidity_position: verificationData.bcra.details.liquidity_ratio > 2 ? 'strong' : 'adequate',
        market_position: verificationData.bcra.details.market_position
      }
    },
    {
      category: 'regulatory',
      description: 'Cumplimiento regulatorio y compliance',
      weight: 0.40,
      score: verificationData.afip.details.compliance_score,
      details: {
        tax_compliance: verificationData.afip.tax_compliance,
        regulatory_violations: verificationData.cnv.securities_violations + verificationData.afip.recent_penalties,
        reporting_timeliness: verificationData.uif.reporting_compliance,
        license_status: 'active'
      }
    },
    {
      category: 'operational',
      description: 'Riesgos operacionales y de gestión',
      weight: 0.15,
      score: company.employees > 100 ? randomInt(70, 85) : randomInt(60, 80),
      details: {
        organizational_maturity: company.employees > 200 ? 'mature' : 'developing',
        internal_controls: riskTemplate.complianceStatus === 'compliant' ? 'robust' : 'basic',
        business_continuity: randomChoice(['excellent', 'good', 'adequate']),
        cybersecurity: randomChoice(['advanced', 'standard', 'basic'])
      }
    },
    {
      category: 'reputational',
      description: 'Riesgo reputacional y de imagen',
      weight: 0.10,
      score: randomInt(75, 90),
      details: {
        media_coverage: randomChoice(['positive', 'neutral', 'mixed']),
        industry_reputation: randomChoice(['excellent', 'good', 'average']),
        stakeholder_relations: randomChoice(['strong', 'adequate', 'weak']),
        social_responsibility: randomChoice(['leader', 'active', 'minimal'])
      }
    }
  ];

  return factors;
}

function generateDetailedRecommendations(company, riskTemplate, verificationData, riskFactors) {
  const recommendations = [];

  // Financial recommendations
  const financialFactor = riskFactors.find(f => f.category === 'financial');
  if (financialFactor.score < 70) {
    recommendations.push({
      category: 'financial',
      priority: 'high',
      description: 'Implementar monitoreo continuo de indicadores financieros',
      actions: [
        'Solicitar estados financieros auditados trimestrales',
        'Establecer covenants financieros en contratos',
        'Revisar política de crédito y garantías'
      ],
      timeline: '30 días',
      responsible: 'Área de Riesgo Crediticio'
    });
  }

  // Regulatory recommendations
  const regulatoryFactor = riskFactors.find(f => f.category === 'regulatory');
  if (regulatoryFactor.score < 75) {
    recommendations.push({
      category: 'regulatory',
      priority: 'critical',
      description: 'Reforzar procedimientos de compliance regulatorio',
      actions: [
        'Auditar cumplimiento de obligaciones fiscales',
        'Implementar sistema de monitoreo regulatorio',
        'Capacitar al equipo en nuevas normativas'
      ],
      timeline: '15 días',
      responsible: 'Área de Compliance'
    });
  }

  // Operational recommendations
  if (company.employees > 50) {
    recommendations.push({
      category: 'operational',
      priority: 'medium',
      description: 'Fortalecer controles internos y governance',
      actions: [
        'Implementar código de ética y conducta',
        'Establecer canales de denuncia',
        'Realizar evaluación de riesgos operacionales'
      ],
      timeline: '60 días',
      responsible: 'Gerencia General'
    });
  }

  // AML/CFT recommendations  
  if (verificationData.uif.aml_status !== 'clear') {
    recommendations.push({
      category: 'aml_cft',
      priority: 'high',
      description: 'Mejorar procedimientos de prevención de lavado de activos',
      actions: [
        'Actualizar matriz de riesgo de LA/FT',
        'Implementar sistema de monitoreo transaccional',
        'Capacitar personal en detección de operaciones sospechosas'
      ],
      timeline: '45 días',
      responsible: 'Oficial de Cumplimiento'
    });
  }

  // Due diligence recommendations
  recommendations.push({
    category: 'due_diligence',
    priority: 'medium',
    description: 'Establecer programa de due diligence continuo',
    actions: [
      'Programar revisiones trimestrales de documentación',
      'Implementar alertas automáticas de cambios regulatorios',
      'Establecer matriz de renovación de documentos'
    ],
    timeline: '90 días',
    responsible: 'Área de Riesgo de Terceros'
  });

  return recommendations.slice(0, randomInt(3, 5)); // Return 3-5 recommendations
}

function generateComplianceAnalysis(company, riskTemplate, verificationData) {
  const analysis = {
    law_27401_compliance: {
      overall_assessment: riskTemplate.complianceStatus,
      compliance_score: randomFloat(60, 95),
      key_requirements: {
        corporate_governance: {
          status: riskTemplate.complianceStatus === 'compliant' ? 'implemented' : 'partial',
          score: randomInt(70, 95),
          details: 'Estructura de gobierno corporativo y responsabilidades definidas'
        },
        ethics_code: {
          status: riskTemplate.complianceStatus === 'compliant' ? 'implemented' : 'missing',
          score: randomInt(60, 90),
          details: 'Código de ética y conducta empresarial'
        },
        risk_assessment: {
          status: 'implemented',
          score: randomInt(75, 90),
          details: 'Evaluación periódica de riesgos de compliance'
        },
        training_program: {
          status: riskTemplate.complianceStatus === 'compliant' ? 'active' : 'needs_improvement',
          score: randomInt(65, 85),
          details: 'Programa de capacitación en integridad y compliance'
        },
        monitoring_system: {
          status: 'partial',
          score: randomInt(60, 80),
          details: 'Sistema de monitoreo y detección de irregularidades'
        }
      }
    },
    sector_specific_requirements: generateSectorSpecificCompliance(company.sector),
    regulatory_updates: {
      last_review: generateDate(randomInt(30, 90)),
      pending_updates: randomInt(0, 3),
      critical_changes: randomInt(0, 1)
    }
  };

  return analysis;
}

function generateSectorSpecificCompliance(sector) {
  const sectorRequirements = {
    'Tecnología': {
      data_protection: { status: 'compliant', regulations: ['PDPA', 'GDPR-like'] },
      cybersecurity: { status: 'implemented', framework: 'ISO 27001' },
      intellectual_property: { status: 'protected', coverage: 'comprehensive' }
    },
    'Salud': {
      patient_privacy: { status: 'compliant', regulations: ['Ley 25.326'] },
      medical_licensing: { status: 'current', expiry: generateDate(-180) },
      quality_standards: { status: 'certified', standard: 'ISO 9001' }
    },
    'Financiero': {
      banking_regulations: { status: 'compliant', supervisor: 'BCRA' },
      aml_cft: { status: 'implemented', last_audit: generateDate(180) },
      consumer_protection: { status: 'compliant', regulations: ['Ley de Defensa del Consumidor'] }
    },
    'Educación': {
      educational_licensing: { status: 'current', authority: 'Ministerio de Educación' },
      student_privacy: { status: 'protected', compliance: 'FERPA-like' },
      accreditation: { status: 'active', level: 'institutional' }
    }
  };

  return sectorRequirements[sector] || {
    general_compliance: { status: 'under_review', notes: 'Sector-specific requirements being evaluated' }
  };
}

function generateExecutiveSummary(company, analysis, riskTemplate, riskFactors) {
  const topRisks = riskFactors
    .filter(f => f.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const strengths = riskFactors
    .filter(f => f.score >= 80)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    overall_assessment: riskTemplate.template,
    risk_level: riskTemplate.riskLevel,
    compliance_status: riskTemplate.complianceStatus,
    key_strengths: strengths.map(s => ({
      area: s.category,
      description: s.description,
      score: s.score
    })),
    key_risks: topRisks.map(r => ({
      area: r.category,
      description: r.description,
      score: r.score,
      impact: r.score < 50 ? 'high' : 'medium'
    })),
    business_relationship_recommendation: {
      decision: riskTemplate.riskLevel === 'low' ? 'approve' :
               riskTemplate.riskLevel === 'medium' ? 'approve_with_conditions' :
               riskTemplate.riskLevel === 'high' ? 'conditional_approval' : 'reject',
      conditions: riskTemplate.riskLevel !== 'low' ? [
        'Implementar monitoreo continuo',
        'Solicitar garantías adicionales',
        'Revisión trimestral obligatoria'
      ] : [],
      review_frequency: riskTemplate.riskLevel === 'low' ? 'annual' :
                       riskTemplate.riskLevel === 'medium' ? 'semi_annual' : 'quarterly'
    },
    next_steps: [
      'Comunicar resultados al área comercial',
      'Programar seguimiento según nivel de riesgo',
      'Actualizar perfil de riesgo del proveedor'
    ]
  };
}

function generateComprehensiveAnalysis(company) {
  console.log(`  🔍 Generating analysis for ${company.name}...`);

  // Determine risk level and template
  const targetScore = randomFloat(20, 95);
  const riskTemplate = selectRiskTemplate(targetScore);

  // Generate detailed verification data
  const verificationData = generateDetailedVerificationData(company, riskTemplate);

  // Generate risk factors analysis
  const riskFactors = generateRiskFactorsAnalysis(company, riskTemplate, verificationData);

  // Calculate weighted risk score
  const calculatedScore = riskFactors.reduce((total, factor) => {
    return total + (factor.score * factor.weight);
  }, 0);

  // Generate compliance analysis
  const complianceAnalysis = generateComplianceAnalysis(company, riskTemplate, verificationData);

  // Generate recommendations
  const recommendations = generateDetailedRecommendations(company, riskTemplate, verificationData, riskFactors);

  // Create comprehensive analysis object
  const analysis = {
    analysis_metadata: {
      analysis_id: `ANA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider_id: company.cuit,
      analysis_date: new Date().toISOString(),
      analysis_type: 'comprehensive_law_27401',
      analyst: 'IntegridAI RegTech Engine v2.1',
      methodology: 'Multi-source verification with AI-powered risk assessment',
      confidence_level: randomFloat(85, 98)
    },
    
    provider_information: {
      basic_data: company,
      business_profile: {
        sector_classification: company.sector,
        size_category: company.employees > 250 ? 'large' : company.employees > 50 ? 'medium' : 'small',
        market_presence: randomChoice(['national', 'regional', 'local']),
        business_model: randomChoice(['B2B', 'B2C', 'B2B2C', 'marketplace'])
      }
    },

    risk_assessment: {
      overall_risk_score: Math.round(calculatedScore * 100) / 100,
      risk_level: riskTemplate.riskLevel,
      compliance_status: riskTemplate.complianceStatus,
      risk_factors: riskFactors,
      risk_distribution: {
        financial: riskFactors.find(f => f.category === 'financial').score,
        regulatory: riskFactors.find(f => f.category === 'regulatory').score,
        operational: riskFactors.find(f => f.category === 'operational').score,
        reputational: riskFactors.find(f => f.category === 'reputational').score
      }
    },

    external_verifications: verificationData,
    
    compliance_analysis: complianceAnalysis,
    
    recommendations: recommendations,
    
    executive_summary: generateExecutiveSummary(company, analysis, riskTemplate, riskFactors),

    documentation: {
      documents_reviewed: randomInt(8, 15),
      document_types: [
        'Constancia de Inscripción AFIP',
        'Estados Financieros Auditados',
        'Certificado de Cumplimiento Fiscal',
        'Póliza de Seguros',
        'Referencias Comerciales',
        'Código de Ética Empresarial'
      ],
      verification_sources: ['AFIP', 'BCRA', 'CNV', 'UIF', 'Registros Públicos'],
      data_quality_score: randomFloat(85, 98)
    },

    monitoring_plan: {
      review_frequency: riskTemplate.riskLevel === 'low' ? 365 : riskTemplate.riskLevel === 'medium' ? 180 : 90,
      key_indicators: [
        'Cambios en situación fiscal',
        'Variaciones en rating crediticio',
        'Alertas regulatorias',
        'Cambios en estructura societaria'
      ],
      automated_alerts: true,
      next_review_date: generateDate(-randomInt(90, 365))
    }
  };

  return analysis;
}

function generateAnalysisReport(analysis) {
  const company = analysis.provider_information.basic_data;
  const riskAssessment = analysis.risk_assessment;
  
  const report = `
# 📊 REPORTE DE ANÁLISIS DE PROVEEDOR
**IntegridAI RegTech Suite - Análisis Ley 27.401**

---

## 📋 INFORMACIÓN GENERAL

**Proveedor:** ${company.name}  
**CUIT:** ${company.cuit}  
**Sector:** ${company.sector}  
**Fecha de Análisis:** ${new Date(analysis.analysis_metadata.analysis_date).toLocaleDateString('es-AR')}  
**ID de Análisis:** ${analysis.analysis_metadata.analysis_id}  

---

## 🎯 RESUMEN EJECUTIVO

### Calificación General
- **Score de Riesgo:** ${riskAssessment.overall_risk_score}/100
- **Nivel de Riesgo:** ${riskAssessment.risk_level.toUpperCase()}
- **Estado de Compliance:** ${riskAssessment.compliance_status.toUpperCase()}

### Recomendación de Relación Comercial
**${analysis.executive_summary.business_relationship_recommendation.decision.toUpperCase()}**

${analysis.executive_summary.overall_assessment}

---

## 🔍 ANÁLISIS DE RIESGOS

### Distribución de Riesgos por Categoría

| Categoría | Score | Peso | Impacto |
|-----------|--------|------|---------|
${analysis.risk_assessment.risk_factors.map(factor => 
  `| ${factor.category} | ${factor.score}/100 | ${(factor.weight * 100).toFixed(0)}% | ${factor.score >= 80 ? '🟢 Bajo' : factor.score >= 60 ? '🟡 Medio' : '🔴 Alto'} |`
).join('\n')}

### Principales Fortalezas
${analysis.executive_summary.key_strengths.map(strength => 
  `- **${strength.area}:** ${strength.description} (${strength.score}/100)`
).join('\n')}

### Áreas de Riesgo
${analysis.executive_summary.key_risks.map(risk => 
  `- **${risk.area}:** ${risk.description} (${risk.score}/100) - Impacto: ${risk.impact}`
).join('\n')}

---

## ✅ VERIFICACIONES EXTERNAS

### AFIP (Administración Federal de Ingresos Públicos)
- **Estado:** ${analysis.external_verifications.afip.status}
- **Categoría Fiscal:** ${analysis.external_verifications.afip.fiscal_category}
- **Cumplimiento Tributario:** ${analysis.external_verifications.afip.tax_compliance}
- **Score de Compliance:** ${analysis.external_verifications.afip.details.compliance_score}/100

### BCRA (Banco Central de la República Argentina)
- **Rating Financiero:** ${analysis.external_verifications.bcra.financial_rating}
- **Score Crediticio:** ${analysis.external_verifications.bcra.credit_score}
- **Estabilidad Financiera:** ${analysis.external_verifications.bcra.financial_stability}
- **Historial de Pagos:** ${analysis.external_verifications.bcra.payment_history}

### UIF (Unidad de Información Financiera)
- **Estado AML:** ${analysis.external_verifications.uif.aml_status}
- **Actividades Sospechosas:** ${analysis.external_verifications.uif.suspicious_activities}
- **Clasificación de Riesgo:** ${analysis.external_verifications.uif.risk_classification}

---

## 📋 CUMPLIMIENTO LEY 27.401

### Evaluación General
- **Score de Compliance:** ${analysis.compliance_analysis.law_27401_compliance.compliance_score}/100
- **Estado General:** ${analysis.compliance_analysis.law_27401_compliance.overall_assessment}

### Requisitos Clave
${Object.entries(analysis.compliance_analysis.law_27401_compliance.key_requirements).map(([key, req]) => 
  `- **${key}:** ${req.status} (${req.score}/100) - ${req.details}`
).join('\n')}

---

## 🎯 RECOMENDACIONES

${analysis.recommendations.map((rec, index) => `
### ${index + 1}. ${rec.description}
**Categoría:** ${rec.category}  
**Prioridad:** ${rec.priority}  
**Plazo:** ${rec.timeline}  
**Responsable:** ${rec.responsible}  

**Acciones Requeridas:**
${rec.actions.map(action => `- ${action}`).join('\n')}
`).join('\n')}

---

## 📊 PLAN DE MONITOREO

### Frecuencia de Revisión
- **Próxima Revisión:** ${new Date(analysis.monitoring_plan.next_review_date).toLocaleDateString('es-AR')}
- **Frecuencia:** Cada ${analysis.monitoring_plan.review_frequency} días

### Indicadores Clave a Monitorear
${analysis.monitoring_plan.key_indicators.map(indicator => `- ${indicator}`).join('\n')}

---

## 📄 DOCUMENTACIÓN ANALIZADA

- **Documentos Revisados:** ${analysis.documentation.documents_reviewed}
- **Fuentes de Verificación:** ${analysis.documentation.verification_sources.join(', ')}
- **Score de Calidad de Datos:** ${analysis.documentation.data_quality_score}/100

### Tipos de Documentos
${analysis.documentation.document_types.map(doc => `- ${doc}`).join('\n')}

---

**Reporte generado por:** ${analysis.analysis_metadata.analyst}  
**Nivel de Confianza:** ${analysis.analysis_metadata.confidence_level}%  
**Metodología:** ${analysis.analysis_metadata.methodology}  

---

*Este reporte es confidencial y está destinado exclusivamente para uso interno de evaluación de riesgos de terceros según la Ley 27.401 de Responsabilidad Penal Empresaria.*
`;

  return report;
}

// Main generation functions
async function generateSampleAnalyses() {
  console.log('🔬 IntegridAI Sample Analysis Generator');
  console.log('=====================================\n');

  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const analyses = [];
  const reports = [];

  // Generate analyses for each sample company
  for (let i = 0; i < SAMPLE_COMPANIES.length; i++) {
    const company = SAMPLE_COMPANIES[i];
    const analysis = generateComprehensiveAnalysis(company);
    analyses.push(analysis);

    if (CONFIG.generateReports) {
      const report = generateAnalysisReport(analysis);
      reports.push({
        filename: `analysis_report_${company.cuit.replace(/[-]/g, '_')}.md`,
        content: report
      });
    }
  }

  // Generate additional random analyses
  const additionalCount = CONFIG.analysisCount - SAMPLE_COMPANIES.length;
  for (let i = 0; i < additionalCount; i++) {
    // Create random company data
    const randomCompany = {
      name: `Empresa Ejemplo ${i + 1} SA`,
      cuit: `30-${String(Math.floor(Math.random() * 90000000) + 10000000)}-${Math.floor(Math.random() * 9) + 1}`,
      sector: randomChoice(Object.keys({
        'Tecnología': true,
        'Salud': true,
        'Financiero': true,
        'Educación': true,
        'Retail': true,
        'Manufactura': true
      })),
      employees: randomInt(20, 500),
      revenue: randomFloat(5000000, 100000000),
      established: generateDate(randomInt(365, 3650)).split('T')[0],
      description: 'Empresa de ejemplo generada para demostración'
    };

    const analysis = generateComprehensiveAnalysis(randomCompany);
    analyses.push(analysis);
  }

  // Save analyses to files
  console.log('\n💾 Saving generated analyses...');

  // Save complete analyses dataset
  const analysesFile = path.join(CONFIG.outputDir, 'comprehensive_analyses.json');
  fs.writeFileSync(analysesFile, JSON.stringify(analyses, null, 2));
  console.log(`  ✅ Complete analyses saved to ${analysesFile}`);

  // Save executive summaries
  const summaries = analyses.map(a => ({
    provider_name: a.provider_information.basic_data.name,
    cuit: a.provider_information.basic_data.cuit,
    sector: a.provider_information.basic_data.sector,
    risk_score: a.risk_assessment.overall_risk_score,
    risk_level: a.risk_assessment.risk_level,
    compliance_status: a.risk_assessment.compliance_status,
    analysis_date: a.analysis_metadata.analysis_date,
    recommendation: a.executive_summary.business_relationship_recommendation.decision
  }));

  const summariesFile = path.join(CONFIG.outputDir, 'analysis_summaries.json');
  fs.writeFileSync(summariesFile, JSON.stringify(summaries, null, 2));
  console.log(`  ✅ Executive summaries saved to ${summariesFile}`);

  // Save individual reports
  if (CONFIG.generateReports) {
    console.log('\n📄 Generating individual analysis reports...');
    reports.forEach(report => {
      const reportFile = path.join(CONFIG.outputDir, report.filename);
      fs.writeFileSync(reportFile, report.content);
      console.log(`  ✅ Report saved: ${report.filename}`);
    });
  }

  // Generate sample API responses
  const apiResponses = {
    analyze_provider: analyses[0],
    dashboard_metrics: {
      total_providers: analyses.length,
      avg_risk_score: analyses.reduce((sum, a) => sum + a.risk_assessment.overall_risk_score, 0) / analyses.length,
      risk_distribution: {
        low: summaries.filter(s => s.risk_level === 'low').length,
        medium: summaries.filter(s => s.risk_level === 'medium').length,
        high: summaries.filter(s => s.risk_level === 'high').length,
        critical: summaries.filter(s => s.risk_level === 'critical').length
      },
      compliance_rate: (summaries.filter(s => s.compliance_status === 'compliant').length / summaries.length) * 100
    },
    provider_list: summaries.slice(0, 10)
  };

  const apiFile = path.join(CONFIG.outputDir, 'sample_api_responses.json');
  fs.writeFileSync(apiFile, JSON.stringify(apiResponses, null, 2));
  console.log(`  ✅ Sample API responses saved to ${apiFile}`);

  return { analyses, summaries, reports };
}

// Main execution
async function main() {
  try {
    const results = await generateSampleAnalyses();

    console.log('\n🎉 Sample Analysis Generation Complete!');
    console.log('=====================================');
    console.log(`📊 Generated Analyses: ${results.analyses.length}`);
    console.log(`📋 Executive Summaries: ${results.summaries.length}`);
    console.log(`📄 Detailed Reports: ${results.reports.length}`);
    console.log(`📁 Output Directory: ${CONFIG.outputDir}`);

    console.log('\n📈 Analysis Distribution:');
    const distribution = results.summaries.reduce((acc, s) => {
      acc[s.risk_level] = (acc[s.risk_level] || 0) + 1;
      return acc;
    }, {});

    Object.entries(distribution).forEach(([level, count]) => {
      console.log(`  ${level}: ${count} análisis`);
    });

    console.log('\n✨ Ready for HackAI 2025 demonstrations!');

  } catch (error) {
    console.error('❌ Error generating sample analyses:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateComprehensiveAnalysis,
  generateAnalysisReport,
  SAMPLE_COMPANIES,
  CONFIG
};