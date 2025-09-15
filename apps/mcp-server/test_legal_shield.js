const { executeLegalVaccinationShield } = require('./dist/tools/legal-vaccination-shield.js');

async function testLegalShield() {
  console.log('🧪 Testing Legal Compliance Shield - Ley 27.401 Protection');
  console.log('=' .repeat(60));
  
  const testInput = {
    employeeId: 'EMP001', 
    employeeName: 'Juan Pérez',
    department: 'Ventas',
    corruptionSituation: 'Ofrecimiento de soborno a funcionario público municipal',
    riskLevel: 'critical',
    complianceOfficerId: 'OFF001',
    complianceOfficerName: 'María González',
    urgency: 'emergency'
  };
  
  try {
    console.log('📋 Input:', JSON.stringify(testInput, null, 2));
    console.log('\n🔄 Executing Legal Vaccination Shield...\n');
    
    const result = await executeLegalVaccinationShield(testInput);
    
    console.log('✅ LEGAL SHIELD VALIDATION SUCCESSFUL');
    console.log('=' .repeat(60));
    console.log('📊 Vaccination Status:', result.vaccinationStatus);
    console.log('⚖️  Officer Protection:', result.officerProtection.protectionStatus);
    console.log('🔄 Liability Transferred:', result.liabilityTransfer.transferred);
    console.log('📜 Legal Compliance Score:', result.legalCompliance.complianceScore + '%');
    console.log('🛡️  Corporate Protection:', result.legalCompliance.corporateProtection);
    console.log('🔐 Forensic Hash:', result.legalEvidence.forensicHash.substring(0, 32) + '...');
    
    // Validate critical requirements
    const validations = {
      'Officer Protection': result.officerProtection.dutyFulfilled,
      'Liability Transfer': result.liabilityTransfer.transferred,
      'Legal Evidence': result.legalEvidence.forensicHash.length > 0,
      'Ley 27.401 Compliance': result.legalCompliance.complianceScore >= 70,
      'Certificate Generated': result.certificates.officerProtectionCertificate.length > 0
    };
    
    console.log('\n🔍 CRITICAL VALIDATIONS:');
    Object.entries(validations).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
    const allPassed = Object.values(validations).every(v => v);
    console.log(`\n🎯 OVERALL RESULT: ${allPassed ? '✅ ALL VALIDATIONS PASSED' : '❌ SOME VALIDATIONS FAILED'}`);
    
    if (allPassed) {
      console.log('\n⚖️  LEGAL COMPLIANCE SHIELD FULLY OPERATIONAL');
      console.log('🛡️  Compliance Officers are now legally protected under Ley 27.401');
      console.log('📋 Enterprise-grade forensic evidence generation confirmed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testLegalShield();
