import { executeOCDMCompliance } from './dist/tools/ocdm-compliance-validator.js';

async function testOCDMSystem() {
  console.log('🧠⚖️ Testing OCDM System - Ontology-Driven Compliance');
  console.log('='.repeat(70));
  
  // Test Case 1: Gift violating cash equivalents rule
  const testCashViolation = {
    eventType: 'gift',
    eventId: 'GIFT-001-CASH-VIOLATION',
    offeredBy: 'Proveedor ABC S.A.',
    receivedBy: 'Juan Pérez - Gerente de Compras',
    description: 'Gift card de supermercado por $50,000 ARS',
    valueAmount: 50000,
    valueCurrency: 'ARS',
    isCashOrEquivalent: true,  // VIOLATION
    publicOfficialInvolved: false,
    pendingBusinessDecision: true,
    businessContext: 'Negociación contrato de servicios 2025',
    frequency12m: 1,
    complianceOfficerId: 'OFF-001',
    requiresLegalProtection: true
  };
  
  // Test Case 2: Public official gift (legal issue)
  const testPublicOfficialViolation = {
    eventType: 'hospitality',
    eventId: 'HOSP-002-PUBLIC-OFFICIAL',
    offeredBy: 'María González - Compliance Officer',
    receivedBy: 'Inspector Municipal de Seguridad',
    description: 'Almuerzo de cortesía con funcionario municipal',
    valueAmount: 8000,
    valueCurrency: 'ARS', 
    isCashOrEquivalent: false,
    publicOfficialInvolved: true,  // Requires special handling
    pendingBusinessDecision: false,
    businessContext: 'Inspección de rutina - cortesía institucional',
    complianceOfficerId: 'OFF-001',
    requiresLegalProtection: true
  };
  
  // Test Case 3: Compliant gift (should pass)
  const testCompliantGift = {
    eventType: 'gift',
    eventId: 'GIFT-003-COMPLIANT',
    offeredBy: 'Cliente Premium Corp',
    receivedBy: 'Ana Rodríguez - Account Manager', 
    description: 'Canasta navideña institucional',
    valueAmount: 15000,
    valueCurrency: 'ARS',
    isCashOrEquivalent: false,
    publicOfficialInvolved: false,
    businessContext: 'Regalo navideño tradicional - no hay negociaciones pendientes',
    frequency12m: 1
  };
  
  const testCases = [
    { name: '💰 Cash Equivalent Violation', data: testCashViolation },
    { name: '⚖️ Public Official Gift', data: testPublicOfficialViolation },
    { name: '✅ Compliant Gift', data: testCompliantGift }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🔬 TEST: ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await executeOCDMCompliance(testCase.data);
      
      console.log(`📊 Compliance Status: ${result.ocdmCompliance.isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
      console.log(`📈 OCDM Score: ${result.ocdmCompliance.complianceScore}%`);
      console.log(`⚠️ Risk Level: ${result.dashboardData.overallRiskLevel.toUpperCase()}`);
      console.log(`🧠 Knowledge Graph: ${result.knowledgeGraph.totalTriples} triples`);
      
      // Show validation results
      console.log('\n🔍 SHACL Validation Results:');
      result.ocdmCompliance.validationResults.forEach((validation, index) => {
        console.log(`  ${index + 1}. ${validation.passed ? '✅' : '❌'} ${validation.rule}: ${validation.message}`);
      });
      
      // Show recommendations
      console.log('\n💡 Recommendations:');
      if (result.recommendations.immediate.length > 0) {
        console.log('  🚨 Immediate:', result.recommendations.immediate[0]);
      }
      if (result.recommendations.regulatory.length > 0) {
        console.log('  ⚖️ Regulatory:', result.recommendations.regulatory[0]);
      }
      
      // Legal protection status
      if (result.legalProtection) {
        console.log(`\n🛡️ Legal Protection: Officer=${result.legalProtection.officerProtected ? 'Protected' : 'At Risk'}, Evidence=${result.legalProtection.evidenceGenerated ? 'Generated' : 'Missing'}`);
      }
      
      console.log(`\n📜 Certificates: ${Object.keys(result.certificates).length} generated`);
      
    } catch (error) {
      console.error(`❌ Test failed:`, error.message);
    }
  }
  
  console.log('\n🎯 OCDM SYSTEM VALIDATION COMPLETE');
  console.log('='.repeat(70));
  console.log('🧠 Framework: Ontology-Driven Conceptual Modeling');
  console.log('⚖️ Compliance: Ley 27.401 Argentina');
  console.log('🔗 Integration: Legal Compliance Shield + OCDM');
  console.log('📊 Result: Policy transformed into executable strategy');
}

testOCDMSystem().catch(console.error);
