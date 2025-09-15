/**
 * 🔧 Configuration for IntegridAI Suite AnyQuery Integration
 * 
 * Central configuration file for all AnyQuery integration components
 * 
 * @author IntegridAI Suite
 * @version 2.0.0
 * @license Patent-Protected Technology
 */

import path from 'path';
import { 
  IntegridAISuiteConfig,
  FLAISimulatorConfig,
  MCPServerConfig,
  PatentsConfig,
  DocumentationConfig,
  UnifiedQueryConfig
} from './types';

// Base paths configuration
export const BASE_PATHS = {
  data: path.join(process.cwd(), 'data'),
  logs: path.join(process.cwd(), 'logs'),
  cache: path.join(process.cwd(), 'cache'),
  documents: path.join(process.cwd(), 'documents'),
  patents: path.join(process.cwd(), 'patents'),
  evidence: path.join(process.cwd(), 'evidence')
};

// Environment-specific configuration
export const ENVIRONMENT_CONFIG = {
  development: {
    enableLogging: true,
    logLevel: 'debug',
    enableCache: true,
    enableRealTimeSync: true,
    maxQueryExecutionTime: 60000, // 1 minute for development
    enableFullTextSearch: true
  },
  testing: {
    enableLogging: false,
    logLevel: 'error',
    enableCache: false,
    enableRealTimeSync: false,
    maxQueryExecutionTime: 10000, // 10 seconds for tests
    enableFullTextSearch: false
  },
  production: {
    enableLogging: true,
    logLevel: 'info',
    enableCache: true,
    enableRealTimeSync: true,
    maxQueryExecutionTime: 30000, // 30 seconds for production
    enableFullTextSearch: true
  }
};

// Get current environment
const ENV = (process.env.NODE_ENV || 'development') as keyof typeof ENVIRONMENT_CONFIG;
const envConfig = ENVIRONMENT_CONFIG[ENV];

// FLAISimulator connector configuration
export const FLAISIMULATOR_CONFIG: FLAISimulatorConfig = {
  dataPath: path.join(BASE_PATHS.data, 'flaisimulator'),
  enableRealTimeUpdates: envConfig.enableRealTimeSync,
  cacheEnabled: envConfig.enableCache,
  culturalAdaptationsEnabled: true,
  p4ReflectionIntegration: true,
  legalShieldEnabled: true
};

// MCP Server connector configuration
export const MCP_SERVER_CONFIG: MCPServerConfig = {
  dataPath: path.join(BASE_PATHS.data, 'mcp-server'),
  mcpServerEndpoint: process.env.MCP_SERVER_ENDPOINT || 'http://localhost:3001',
  enableRealTimeSync: envConfig.enableRealTimeSync,
  legalShieldEnabled: true,
  privacyDifferentialEnabled: true,
  forensicEvidenceGeneration: true,
  argentinianLegalContext: true
};

// Patents connector configuration
export const PATENTS_CONFIG: PatentsConfig = {
  dataPath: path.join(BASE_PATHS.data, 'patents'),
  patentFilesPath: BASE_PATHS.patents,
  enableLicenseTracking: true,
  enableUsageMonitoring: true,
  enableP2P4Analytics: true,
  restrictedAccess: ENV === 'production',
  licenseValidationRequired: ENV === 'production'
};

// Documentation connector configuration
export const DOCUMENTATION_CONFIG: DocumentationConfig = {
  dataPath: path.join(BASE_PATHS.data, 'documentation'),
  documentsPath: BASE_PATHS.documents,
  enableFullTextSearch: envConfig.enableFullTextSearch,
  enableVersionControl: true,
  enableAccessControl: ENV === 'production',
  supportedLanguages: ['es', 'en'],
  argentinianLegalContext: true
};

// Unified query interface configuration
export const UNIFIED_QUERY_CONFIG: UnifiedQueryConfig = {
  dataPath: BASE_PATHS.data,
  connectors: {
    flaisimulator: FLAISIMULATOR_CONFIG,
    mcpServer: MCP_SERVER_CONFIG,
    patents: PATENTS_CONFIG,
    documentation: DOCUMENTATION_CONFIG
  },
  enableCrossComponentQueries: true,
  enableUnifiedAnalytics: true,
  enableRealTimeSync: envConfig.enableRealTimeSync,
  cacheEnabled: envConfig.enableCache,
  maxQueryExecutionTime: envConfig.maxQueryExecutionTime,
  auditLoggingEnabled: ENV === 'production'
};

// Security configuration
export const SECURITY_CONFIG = {
  authentication: {
    enabled: ENV === 'production',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    requireStrongPasswords: ENV === 'production',
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },
  authorization: {
    enabled: ENV === 'production',
    defaultRole: 'user',
    adminRoles: ['admin', 'compliance_officer'],
    auditRoles: ['auditor', 'legal_officer'],
    roles: {
      admin: {
        permissions: ['*'],
        accessLevel: 'RESTRICTED',
        components: ['*']
      },
      compliance_officer: {
        permissions: ['read', 'write', 'audit'],
        accessLevel: 'CONFIDENTIAL',
        components: ['flaisimulator', 'mcpServer', 'documentation']
      },
      legal_officer: {
        permissions: ['read', 'audit'],
        accessLevel: 'CONFIDENTIAL',
        components: ['mcpServer', 'patents', 'documentation']
      },
      patent_analyst: {
        permissions: ['read'],
        accessLevel: 'INTERNAL',
        components: ['patents', 'documentation']
      },
      trainer: {
        permissions: ['read', 'write'],
        accessLevel: 'INTERNAL',
        components: ['flaisimulator', 'documentation']
      },
      user: {
        permissions: ['read'],
        accessLevel: 'INTERNAL',
        components: ['flaisimulator', 'documentation']
      },
      auditor: {
        permissions: ['read', 'audit'],
        accessLevel: 'RESTRICTED',
        components: ['*']
      }
    }
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
    saltLength: 32
  },
  auditLogging: {
    enabled: envConfig.enableLogging,
    logPath: path.join(BASE_PATHS.logs, 'audit'),
    logRotation: {
      maxFiles: '30d',
      maxSize: '100m',
      compress: true
    },
    logLevel: envConfig.logLevel as string,
    sensitiveFields: ['password', 'token', 'ssn', 'credit_card']
  }
};

// Performance and monitoring configuration
export const PERFORMANCE_CONFIG = {
  cache: {
    enabled: envConfig.enableCache,
    maxSize: 100 * 1024 * 1024, // 100MB
    ttl: 5 * 60 * 1000, // 5 minutes default TTL
    checkPeriod: 60 * 1000, // Check every minute
    useClones: false // Don't clone cached objects for performance
  },
  queryLimits: {
    maxExecutionTime: envConfig.maxQueryExecutionTime,
    maxResultSize: 10000, // Maximum rows returned
    maxConcurrentQueries: 10,
    rateLimitPerUser: 100, // queries per minute
    rateLimitWindow: 60 * 1000 // 1 minute window
  },
  monitoring: {
    enabled: ENV === 'production',
    metricsCollection: true,
    performanceAlerts: true,
    slowQueryThreshold: 5000, // 5 seconds
    errorRateThreshold: 0.05, // 5% error rate
    memoryThreshold: 0.85, // 85% memory usage
    cpuThreshold: 0.80 // 80% CPU usage
  }
};

// Argentina-specific legal configuration
export const ARGENTINA_LEGAL_CONFIG = {
  ley27401: {
    enabled: true,
    articlesTracked: [
      'Art. 1', 'Art. 2', 'Art. 3', 'Art. 4', 'Art. 5',
      'Art. 7', 'Art. 8', 'Art. 9', 'Art. 22', 'Art. 23'
    ],
    complianceRequirements: {
      riskAssessment: 'MANDATORY',
      integrityProgram: 'MANDATORY',
      trainingPrograms: 'MANDATORY',
      monitoringSystem: 'MANDATORY',
      reportingChannel: 'MANDATORY',
      dueDiligence: 'MANDATORY',
      documentationRequirements: 'COMPREHENSIVE'
    },
    reportingFrequency: 'QUARTERLY',
    auditRequirements: {
      internal: 'ANNUAL',
      external: 'BIENNIAL',
      governmentInspection: 'ON_DEMAND'
    }
  },
  constitutional: {
    protections: [
      { article: 'Art. 18', description: 'Due Process Rights' },
      { article: 'Art. 19', description: 'Privacy Rights' },
      { article: 'Art. 33', description: 'Implicit Rights' },
      { article: 'Art. 43', description: 'Habeas Data' }
    ],
    proceduralSafeguards: [
      'Right to Legal Representation',
      'Right to Appeal',
      'Right to Due Process',
      'Right to Privacy Protection',
      'Right to Data Correction'
    ]
  },
  jurisdictional: {
    federal: true,
    provinces: [
      'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 
      'Tucumán', 'Entre Ríos', 'Salta', 'Misiones'
    ],
    regulatory_bodies: [
      'UIF (Unidad de Información Financiera)',
      'AFIP (Administración Federal de Ingresos Públicos)',
      'AAIP (Agencia de Acceso a la Información Pública)',
      'CNV (Comisión Nacional de Valores)'
    ]
  }
};

// Integration with external systems
export const EXTERNAL_INTEGRATIONS = {
  anyquery: {
    enabled: true,
    version: '0.4.0',
    configPath: path.join(process.cwd(), '.anyquery'),
    plugins: [
      'integridai-flaisimulator',
      'integridai-mcp-server',
      'integridai-patents',
      'integridai-documentation'
    ]
  },
  elasticsearch: {
    enabled: ENV === 'production',
    host: process.env.ELASTICSEARCH_HOST || 'localhost:9200',
    index_prefix: 'integridai_suite_',
    bulk_size: 1000,
    refresh_interval: '30s'
  },
  grafana: {
    enabled: ENV === 'production',
    endpoint: process.env.GRAFANA_ENDPOINT || 'http://localhost:3000',
    api_key: process.env.GRAFANA_API_KEY,
    dashboard_uid: 'integridai-suite-dashboard'
  },
  webhook_notifications: {
    enabled: true,
    endpoints: {
      compliance_alerts: process.env.COMPLIANCE_WEBHOOK_URL,
      security_alerts: process.env.SECURITY_WEBHOOK_URL,
      performance_alerts: process.env.PERFORMANCE_WEBHOOK_URL
    }
  }
};

// Development and testing configuration
export const DEVELOPMENT_CONFIG = {
  sampleData: {
    enabled: ENV === 'development',
    generateOnStartup: true,
    sampleSize: 1000,
    includeArgentinaData: true,
    includeLey27401Scenarios: true
  },
  debugging: {
    enabled: ENV === 'development',
    verboseLogging: true,
    queryProfiling: true,
    memoryProfiling: false,
    performanceMetrics: true
  },
  testing: {
    testDatabase: path.join(BASE_PATHS.data, 'test'),
    mockExternalServices: ENV === 'testing',
    parallelTests: false,
    coverage: {
      enabled: true,
      threshold: 80,
      reportFormats: ['html', 'json', 'text']
    }
  }
};

// Export main configuration object
export const INTEGRIDAI_ANYQUERY_CONFIG: IntegridAISuiteConfig = {
  components: {
    flaisimulator: {
      enabled: true,
      dataPath: FLAISIMULATOR_CONFIG.dataPath,
      config: FLAISIMULATOR_CONFIG
    },
    mcpServer: {
      enabled: true,
      dataPath: MCP_SERVER_CONFIG.dataPath,
      config: MCP_SERVER_CONFIG
    },
    patents: {
      enabled: true,
      dataPath: PATENTS_CONFIG.dataPath,
      config: PATENTS_CONFIG
    },
    documentation: {
      enabled: true,
      dataPath: DOCUMENTATION_CONFIG.dataPath,
      config: DOCUMENTATION_CONFIG
    }
  },
  security: {
    enableAuthentication: SECURITY_CONFIG.authentication.enabled,
    enableAuditLogging: SECURITY_CONFIG.auditLogging.enabled,
    enableAccessControl: SECURITY_CONFIG.authorization.enabled
  },
  performance: {
    cacheEnabled: PERFORMANCE_CONFIG.cache.enabled,
    maxQueryExecutionTime: PERFORMANCE_CONFIG.queryLimits.maxExecutionTime,
    maxConcurrentQueries: PERFORMANCE_CONFIG.queryLimits.maxConcurrentQueries
  }
};

// Utility functions for configuration
export const getConfigForEnvironment = (env: string): Partial<IntegridAISuiteConfig> => {
  const envConfig = ENVIRONMENT_CONFIG[env as keyof typeof ENVIRONMENT_CONFIG];
  if (!envConfig) {
    throw new Error(`Unknown environment: ${env}`);
  }
  
  return {
    performance: {
      cacheEnabled: envConfig.enableCache,
      maxQueryExecutionTime: envConfig.maxQueryExecutionTime,
      maxConcurrentQueries: PERFORMANCE_CONFIG.queryLimits.maxConcurrentQueries
    }
  };
};

export const validateConfiguration = (config: IntegridAISuiteConfig): boolean => {
  // Basic validation
  if (!config.components) {
    throw new Error('Configuration must include components section');
  }

  // Validate component configurations
  Object.entries(config.components).forEach(([name, component]) => {
    if (!component.dataPath) {
      throw new Error(`Component ${name} must have a dataPath`);
    }
  });

  return true;
};

export const getConnectionString = (component: string): string => {
  const componentConfig = INTEGRIDAI_ANYQUERY_CONFIG.components[component as keyof typeof INTEGRIDAI_ANYQUERY_CONFIG.components];
  if (!componentConfig) {
    throw new Error(`Unknown component: ${component}`);
  }
  
  return `sqlite://${path.join(componentConfig.dataPath, `${component}.db`)}`;
};

// AnyQuery plugin configuration generator
export const generateAnyQueryConfig = (): any => {
  return {
    version: "1.0",
    plugins: [
      {
        name: "integridai-flaisimulator",
        type: "sqlite",
        config: {
          database: path.join(FLAISIMULATOR_CONFIG.dataPath, 'flaisimulator.db'),
          readonly: false
        }
      },
      {
        name: "integridai-mcp-server",
        type: "sqlite",
        config: {
          database: path.join(MCP_SERVER_CONFIG.dataPath, 'mcp-server.db'),
          readonly: false
        }
      },
      {
        name: "integridai-patents",
        type: "sqlite",
        config: {
          database: path.join(PATENTS_CONFIG.dataPath, 'patents.db'),
          readonly: true // Patents database is read-only for most users
        }
      },
      {
        name: "integridai-documentation",
        type: "sqlite",
        config: {
          database: path.join(DOCUMENTATION_CONFIG.dataPath, 'documentation.db'),
          readonly: false
        }
      }
    ]
  };
};

// Export configuration validation
export const CONFIG_VALIDATION = {
  required_env_vars: [
    ...(ENV === 'production' ? ['DATABASE_URL', 'JWT_SECRET'] : []),
    ...(EXTERNAL_INTEGRATIONS.elasticsearch.enabled ? ['ELASTICSEARCH_HOST'] : []),
    ...(EXTERNAL_INTEGRATIONS.grafana.enabled ? ['GRAFANA_ENDPOINT', 'GRAFANA_API_KEY'] : [])
  ],
  optional_env_vars: [
    'MCP_SERVER_ENDPOINT',
    'COMPLIANCE_WEBHOOK_URL',
    'SECURITY_WEBHOOK_URL',
    'PERFORMANCE_WEBHOOK_URL'
  ]
};

export default INTEGRIDAI_ANYQUERY_CONFIG;