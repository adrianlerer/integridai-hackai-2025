/**
 * 📚 Usage Examples for IntegridAI Suite AnyQuery Integration
 * 
 * Comprehensive examples showing how to use the AnyQuery integration
 * for compliance reporting, analytics, and cross-component queries
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Patent-Protected Technology
 */

import { IntegridAIAnyQuerySuite, createIntegridAIAnyQuerySuite } from '../index';
import type { QueryResult, UnifiedAnalytics, ComplianceReport } from '../types';

// Example 1: Basic Setup and Initialization
async function basicSetupExample(): Promise<void> {
  console.log('=== Basic Setup Example ===');
  
  // Create instance with default configuration
  const anyquery = createIntegridAIAnyQuerySuite();
  
  try {
    // Initialize the suite
    await anyquery.initialize();
    
    // Check system health
    const health = await anyquery.getSystemHealth();
    console.log('System Health:', JSON.stringify(health, null, 2));
    
    // Clean shutdown
    await anyquery.shutdown();
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Example 2: Basic SQL Queries
async function basicQueryExample(): Promise<void> {
  console.log('=== Basic Query Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Query vaccination data
    const vaccinationResult = await anyquery.query(`
      SELECT 
        user_id,
        scenario_name,
        immunity_level,
        vaccination_date,
        p4_reflection_applied
      FROM vaccinations 
      WHERE immunity_level >= 80 
      ORDER BY vaccination_date DESC 
      LIMIT 10
    `, 'user123');
    
    console.log('Recent High-Immunity Vaccinations:', vaccinationResult.data);
    
    // Query legal shields
    const legalShieldResult = await anyquery.query(`
      SELECT 
        shield_id,
        user_id,
        shield_type,
        protection_level,
        verification_status
      FROM legal_shields 
      WHERE verification_status = 'ACTIVE'
      ORDER BY protection_level DESC
    `, 'user123');
    
    console.log('Active Legal Shields:', legalShieldResult.data);
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 3: Cross-Component Analytics
async function analyticsExample(): Promise<void> {
  console.log('=== Analytics Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Get unified analytics
    const analytics: UnifiedAnalytics = await anyquery.getAnalytics('admin_user');
    
    console.log('=== Overall Health ===');
    console.log(`Overall System Health: ${analytics.overallHealth.overall}%`);
    console.log(`FLAISimulator Health: ${analytics.overallHealth.flaisimulator}%`);
    console.log(`MCP Server Health: ${analytics.overallHealth.mcpServer}%`);
    console.log(`Patents Health: ${analytics.overallHealth.patents}%`);
    console.log(`Documentation Health: ${analytics.overallHealth.documentation}%`);
    
    console.log('\n=== Compliance Metrics ===');
    console.log(`Ley 27.401 Compliance: ${analytics.complianceMetrics.ley27401Compliance}%`);
    console.log(`P2/P4 Coverage: ${analytics.complianceMetrics.p2P4Coverage}%`);
    console.log(`Legal Shield Coverage: ${analytics.complianceMetrics.legalShieldCoverage}%`);
    console.log(`Documentation Coverage: ${analytics.complianceMetrics.documentationCoverage}%`);
    
    console.log('\n=== Usage Metrics ===');
    console.log(`Total Users: ${analytics.usageMetrics.totalUsers}`);
    console.log(`Total Sessions: ${analytics.usageMetrics.totalSessions}`);
    console.log(`Average Effectiveness: ${analytics.usageMetrics.averageEffectiveness}%`);
    
    console.log('\n=== Risk Indicators ===');
    console.log('Compliance Gaps:', analytics.riskIndicators.complianceGaps);
    console.log(`Expired Licenses: ${analytics.riskIndicators.expiredLicenses}`);
    console.log(`Outdated Documentation: ${analytics.riskIndicators.outdatedDocumentation}`);
    console.log('Security Alerts:', analytics.riskIndicators.securityAlerts);
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 4: Comprehensive Ley 27.401 Compliance Report
async function complianceReportExample(): Promise<void> {
  console.log('=== Compliance Report Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Generate comprehensive compliance report
    const report: ComplianceReport = await anyquery.generateComplianceReport('compliance_officer');
    
    console.log('=== Executive Summary ===');
    console.log(`Report Type: ${report.reportType}`);
    console.log(`Generated At: ${report.generatedAt}`);
    console.log(`Overall Compliance Score: ${report.overallScore}%`);
    
    console.log('\n=== Component Scores ===');
    Object.entries(report.componentScores).forEach(([component, score]) => {
      console.log(`${component}: ${score}%`);
    });
    
    console.log('\n=== Critical Issues ===');
    report.criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
    
    console.log('\n=== Recommendations ===');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    // Show audit trail sample
    console.log(`\n=== Audit Trail (${report.auditTrail.length} entries) ===`);
    report.auditTrail.slice(0, 3).forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.timestamp} - ${entry.action} by ${entry.userId || 'system'}`);
    });
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 5: Predefined Cross-Component Queries
async function predefinedQueryExample(): Promise<void> {
  console.log('=== Predefined Query Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Vaccination with legal coverage analysis
    const vaccinationLegalResult = await anyquery.executePredefinedQuery(
      'vaccination_legal_coverage',
      { min_immunity: 85, days: 30 },
      'analyst_user'
    );
    
    console.log('Vaccination-Legal Coverage Analysis:');
    console.log(`Found ${vaccinationLegalResult.data.length} vaccinations with legal coverage`);
    vaccinationLegalResult.data.slice(0, 3).forEach((record, index) => {
      console.log(`${index + 1}. User: ${record.user_id}, Immunity: ${record.immunity_level}%, Protection: ${record.protection_level || 'None'}`);
    });
    
    // P2/P4 patent usage analysis
    const patentUsageResult = await anyquery.executePredefinedQuery(
      'p2_p4_patent_usage',
      { days: 90 },
      'analyst_user'
    );
    
    console.log(`\nP2/P4 Patent Usage Analysis (${patentUsageResult.data.length} records):`);
    patentUsageResult.data.slice(0, 3).forEach((record, index) => {
      console.log(`${index + 1}. Patent: ${record.patent_title}, Effectiveness: ${record.effectiveness_score}%, Licensed: ${record.license_verified ? 'Yes' : 'No'}`);
    });
    
    // Compliance documentation gaps
    const gapsResult = await anyquery.executePredefinedQuery(
      'compliance_documentation_gaps',
      { framework: '27401', min_satisfaction: 75, min_success: 80 },
      'compliance_officer'
    );
    
    console.log(`\nCompliance Documentation Gaps (${gapsResult.data.length} issues):`);
    gapsResult.data.forEach((gap, index) => {
      console.log(`${index + 1}. ${gap.document_type} - ${gap.compliance_framework}: Satisfaction ${gap.avg_satisfaction}%, Success ${gap.implementation_success_rate}%`);
    });
    
    // Comprehensive user profile
    const userProfileResult = await anyquery.executePredefinedQuery(
      'user_comprehensive_profile',
      { user_id: 'user123' },
      'admin_user'
    );
    
    console.log('\nComprehensive User Profile:');
    if (userProfileResult.data.length > 0) {
      const profile = userProfileResult.data[0];
      console.log(`User ID: ${profile.user_id}`);
      console.log(`Total Vaccinations: ${profile.total_vaccinations}`);
      console.log(`Average Immunity: ${profile.avg_immunity}%`);
      console.log(`P4 Reflections: ${profile.p4_reflections_count}`);
      console.log(`Legal Shields: ${profile.legal_shields_count}`);
      console.log(`Patent Usages: ${profile.patent_usages_count}`);
      console.log(`Document Accesses: ${profile.document_accesses_count}`);
    }
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 6: Full-Text Search Across Components
async function searchExample(): Promise<void> {
  console.log('=== Search Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Search for Ley 27.401 related content
    const searchResult = await anyquery.search(
      'Ley 27401 compliance training',
      { limit: 10 },
      'search_user'
    );
    
    console.log(`Search Results (${searchResult.data.length} found):`);
    searchResult.data.forEach((result, index) => {
      console.log(`${index + 1}. [${result.component_type}] ${result.title} (Score: ${result.score})`);
      console.log(`   Type: ${result.result_type}`);
      if (result.summary) {
        console.log(`   Summary: ${result.summary.substring(0, 100)}...`);
      }
      console.log('');
    });
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 7: Dashboard Data Integration
async function dashboardExample(): Promise<void> {
  console.log('=== Dashboard Data Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Get comprehensive dashboard data
    const dashboardData = await anyquery.getDashboardData('dashboard_user');
    
    console.log('=== Dashboard Overview ===');
    console.log(`Total Users: ${dashboardData.overview.totalUsers}`);
    console.log(`Total Sessions: ${dashboardData.overview.totalSessions}`);
    console.log(`Overall Health: ${dashboardData.overview.overallHealth}%`);
    console.log(`Compliance Score: ${dashboardData.overview.complianceScore}%`);
    
    console.log('\n=== Component Status ===');
    Object.entries(dashboardData.components).forEach(([component, status]: [string, any]) => {
      console.log(`${component}: ${status.status} (Health: ${status.health}%)`);
    });
    
    console.log('\n=== Performance Metrics ===');
    console.log(`Total Queries: ${dashboardData.performance.queryStats.total_queries}`);
    console.log(`Average Execution Time: ${dashboardData.performance.queryStats.average_execution_time}ms`);
    console.log(`Unique Users: ${dashboardData.performance.queryStats.unique_users}`);
    
    console.log('\n=== Compliance Status ===');
    console.log(`Ley 27.401: ${dashboardData.compliance.ley27401Score}%`);
    console.log(`P2/P4 Coverage: ${dashboardData.compliance.p2p4Coverage}%`);
    console.log(`Legal Shield Coverage: ${dashboardData.compliance.legalShieldCoverage}%`);
    console.log(`Documentation Coverage: ${dashboardData.compliance.documentationCoverage}%`);
    
    console.log('\n=== Recent Activity ===');
    dashboardData.recentActivity.slice(0, 5).forEach((activity: any, index: number) => {
      console.log(`${index + 1}. ${activity.activity_type}: ${activity.description} (${activity.timestamp})`);
    });
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 8: Data Export
async function exportExample(): Promise<void> {
  console.log('=== Export Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Export vaccination data as JSON
    const jsonExport = await anyquery.exportData(
      'flaisimulator',
      'JSON',
      { immunity_level: 90 },
      'export_user'
    );
    
    console.log('JSON Export Sample (first 500 chars):');
    console.log(jsonExport.substring(0, 500) + '...');
    
    // Export patent data as CSV
    const csvExport = await anyquery.exportData(
      'patents',
      'CSV',
      { patent_type: 'P4_REFLECTION' },
      'export_user'
    );
    
    console.log('\nCSV Export Sample (first 300 chars):');
    console.log(csvExport.substring(0, 300) + '...');
    
  } finally {
    await anyquery.shutdown();
  }
}

// Example 9: Error Handling and Monitoring
async function errorHandlingExample(): Promise<void> {
  console.log('=== Error Handling Example ===');
  
  const anyquery = new IntegridAIAnyQuerySuite();
  await anyquery.initialize();
  
  try {
    // Attempt invalid query
    try {
      await anyquery.query('SELECT * FROM non_existent_table', 'test_user');
    } catch (error) {
      console.log('Caught expected error for invalid table:', error.message);
    }
    
    // Attempt query without user authentication (if required)
    try {
      await anyquery.query('SELECT * FROM vaccinations');
    } catch (error) {
      console.log('Caught authentication error:', error.message);
    }
    
    // Get query statistics to monitor performance
    const stats = anyquery.getQueryStatistics();
    console.log('\nQuery Statistics:');
    console.log(`Total Queries: ${stats.total_queries}`);
    console.log(`Recent Queries: ${stats.recent_queries}`);
    console.log(`Average Execution Time: ${stats.average_execution_time}ms`);
    console.log('Most Active Users:', stats.most_active_users);
    
  } finally {
    await anyquery.shutdown();
  }
}

// Main function to run all examples
async function runAllExamples(): Promise<void> {
  console.log('🚀 Starting IntegridAI Suite AnyQuery Integration Examples\n');
  
  const examples = [
    { name: 'Basic Setup', fn: basicSetupExample },
    { name: 'Basic Queries', fn: basicQueryExample },
    { name: 'Analytics', fn: analyticsExample },
    { name: 'Compliance Report', fn: complianceReportExample },
    { name: 'Predefined Queries', fn: predefinedQueryExample },
    { name: 'Search', fn: searchExample },
    { name: 'Dashboard Data', fn: dashboardExample },
    { name: 'Data Export', fn: exportExample },
    { name: 'Error Handling', fn: errorHandlingExample }
  ];
  
  for (const example of examples) {
    try {
      console.log(`\n📊 Running ${example.name} Example...`);
      await example.fn();
      console.log(`✅ ${example.name} Example completed successfully`);
    } catch (error) {
      console.error(`❌ ${example.name} Example failed:`, error.message);
    }
  }
  
  console.log('\n🎉 All examples completed!');
}

// Export individual examples for testing
export {
  basicSetupExample,
  basicQueryExample,
  analyticsExample,
  complianceReportExample,
  predefinedQueryExample,
  searchExample,
  dashboardExample,
  exportExample,
  errorHandlingExample,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}