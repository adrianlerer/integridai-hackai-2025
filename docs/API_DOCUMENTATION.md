# 📡 API Documentation - IntegridAI HackAI 2025

## 🎯 **Overview**

Esta documentación describe las APIs disponibles para el HackAI 2025. **IMPORTANTE**: Todas las APIs son versiones **MOCK** para desarrollo seguro. No hay conexiones reales a sistemas gubernamentales argentinos.

---

## 🔗 **Base URLs**

```javascript
// Development Environment
const BASE_URL = 'http://localhost:3000/api';
const MOCK_BASE_URL = 'http://localhost:3001/api/mock';

// Production Environment (Demo)
const PROD_BASE_URL = 'https://integridai-hackai.vercel.app/api';
```

---

## 🔐 **Authentication**

### **Development Mode**
```javascript
// No authentication required for mock APIs
// All endpoints are open during hackathon

// Optional: Simulate authentication
const headers = {
  'Authorization': 'Bearer hackathon-demo-token',
  'Content-Type': 'application/json'
};
```

### **Headers**
```javascript
const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-API-Version': '1.0',
  'X-Client': 'hackathon-client'
};
```

---

## 🏢 **Provider Analysis API**

### **Analyze Provider**
Realiza análisis completo de un proveedor según Ley 27.401.

```http
POST /api/mock/analyze
Content-Type: application/json

{
  "cuit": "20-12345678-9",
  "name": "TechCorp Argentina SA", 
  "sector": "Tecnología",
  "additional_data": {
    "website": "https://techcorp.com.ar",
    "employees": 150,
    "annual_revenue": 50000000
  }
}
```

#### **Response**
```json
{
  "success": true,
  "data": {
    "provider_id": "prov_001",
    "analysis_id": "ana_12345",
    "risk_score": 76.3,
    "risk_level": "medium",
    "compliance_status": "compliant",
    "analysis_date": "2024-09-01T15:30:00Z",
    "verification_data": {
      "afip": {
        "status": "active",
        "fiscal_category": "Responsable Inscripto",
        "verified_at": "2024-09-01T15:25:12Z"
      },
      "bcra": {
        "financial_rating": "A-",
        "debt_indicators": "low_risk",
        "verified_at": "2024-09-01T15:26:33Z"
      },
      "cnv": {
        "market_participation": "none",
        "regulatory_status": "n/a"
      },
      "uif": {
        "aml_status": "clear",
        "suspicious_activities": 0,
        "verified_at": "2024-09-01T15:27:45Z"
      }
    },
    "risk_factors": [
      {
        "category": "financial",
        "description": "Stable financial position",
        "weight": 0.3,
        "score": 80
      },
      {
        "category": "regulatory",
        "description": "Full regulatory compliance",
        "weight": 0.4,
        "score": 85
      },
      {
        "category": "operational",
        "description": "Good operational practices",
        "weight": 0.3,
        "score": 65
      }
    ],
    "recommendations": [
      "Monitor quarterly financial reports",
      "Verify employee compliance training",
      "Regular due diligence updates recommended"
    ],
    "documents_analyzed": 7,
    "next_review_date": "2025-03-01"
  }
}
```

### **Get Provider Details**
```http
GET /api/mock/providers/{provider_id}
```

#### **Response**
```json
{
  "success": true,
  "data": {
    "id": "prov_001",
    "cuit": "20-12345678-9",
    "name": "TechCorp Argentina SA",
    "sector": "Tecnología",
    "created_at": "2024-08-15T10:00:00Z",
    "updated_at": "2024-09-01T15:30:00Z",
    "latest_analysis": {
      "analysis_id": "ana_12345",
      "risk_score": 76.3,
      "analysis_date": "2024-09-01T15:30:00Z"
    },
    "analysis_history": [
      {
        "analysis_id": "ana_12344",
        "risk_score": 74.1,
        "analysis_date": "2024-06-01T10:00:00Z"
      }
    ]
  }
}
```

### **List Providers**
```http
GET /api/mock/providers?page=1&limit=20&sector=Tecnología&risk_level=medium
```

#### **Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20, max: 100) |
| search | string | Search by name or CUIT |
| sector | string | Filter by sector |
| risk_level | string | Filter by risk level (low, medium, high, critical) |
| compliance_status | string | Filter by compliance status |

#### **Response**
```json
{
  "success": true,
  "data": {
    "providers": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 247,
      "pages": 13,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## 🎮 **Training Hub API**

### **Get Available Scenarios**
```http
GET /api/mock/training/scenarios
```

#### **Response**
```json
{
  "success": true,
  "data": {
    "scenarios": [
      {
        "id": "scen_001",
        "title": "Conflicto de Intereses",
        "description": "Manejo de situaciones de conflicto de intereses en procurement",
        "difficulty": "beginner",
        "duration_minutes": 15,
        "category": "ethics",
        "learning_objectives": [
          "Identificar conflictos de intereses",
          "Aplicar procedimientos de escalación",
          "Documentar decisiones éticas"
        ]
      }
    ]
  }
}
```

### **Start Training Session**
```http
POST /api/mock/training/sessions
Content-Type: application/json

{
  "scenario_id": "scen_001",
  "user_id": "user_hackathon_01"
}
```

#### **Response**
```json
{
  "success": true,
  "data": {
    "session_id": "sess_12345",
    "scenario": {...},
    "started_at": "2024-09-01T16:00:00Z",
    "expires_at": "2024-09-01T17:00:00Z"
  }
}
```

### **Submit Training Response**
```http
POST /api/mock/training/sessions/{session_id}/responses
Content-Type: application/json

{
  "question_id": "q_001",
  "selected_answer": "answer_b",
  "reasoning": "Esta opción considera todos los aspectos éticos y legales..."
}
```

### **Get User Progress**
```http
GET /api/mock/training/users/{user_id}/progress
```

---

## 📊 **Analytics API**

### **Dashboard Metrics**
```http
GET /api/mock/dashboard/metrics
```

#### **Response**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_providers": 1247,
      "high_risk_providers": 23,
      "compliance_rate": 94.2,
      "avg_risk_score": 76.3
    },
    "trends": {
      "risk_distribution": {
        "low": 62,
        "medium": 23, 
        "high": 12,
        "critical": 3
      },
      "monthly_analysis": [
        {
          "month": "2024-01",
          "analyzed": 89,
          "avg_score": 72.1
        }
      ]
    },
    "training_metrics": {
      "active_users": 45,
      "completion_rate": 87.3,
      "avg_score": 82.5
    }
  }
}
```

### **Risk Analytics**
```http
GET /api/mock/analytics/risk?period=last_6_months&sector=Tecnología
```

### **Training Analytics**
```http
GET /api/mock/analytics/training?user_id=user_01&period=last_month
```

### **Compliance Reports**
```http
GET /api/mock/reports/compliance?format=json&start_date=2024-08-01&end_date=2024-09-01
```

---

## 📄 **Document Management API**

### **Upload Document**
```http
POST /api/mock/documents/upload
Content-Type: multipart/form-data

{
  "provider_cuit": "20-12345678-9",
  "document_type": "afip_constancia",
  "file": <file_data>
}
```

### **OCR Document Processing**
```http
POST /api/mock/documents/ocr
Content-Type: multipart/form-data

{
  "file": <file_data>,
  "document_type": "cuit_card"
}
```

#### **Response**
```json
{
  "success": true,
  "data": {
    "extracted_text": "CUIT: 20-12345678-9\nRazón Social: TechCorp Argentina SA...",
    "structured_data": {
      "cuit": "20-12345678-9",
      "business_name": "TechCorp Argentina SA",
      "document_type": "cuit_card",
      "confidence": 0.95
    },
    "processing_time_ms": 1234
  }
}
```

---

## 🌐 **WebSocket Events**

### **Real-time Updates**
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3001/ws');

// Listen for real-time events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'analysis_complete':
      // Handle completed analysis
      break;
    case 'risk_alert':
      // Handle high-risk provider alert
      break;
    case 'training_completed':
      // Handle training session completion
      break;
  }
};
```

### **Event Types**
```typescript
interface WebSocketEvent {
  type: 'analysis_complete' | 'risk_alert' | 'training_completed' | 'system_update';
  timestamp: string;
  data: any;
}

// Analysis Complete Event
{
  "type": "analysis_complete",
  "timestamp": "2024-09-01T16:30:00Z",
  "data": {
    "provider_id": "prov_001",
    "analysis_id": "ana_12345",
    "risk_score": 76.3
  }
}

// Risk Alert Event
{
  "type": "risk_alert",
  "timestamp": "2024-09-01T16:31:00Z", 
  "data": {
    "provider_id": "prov_002",
    "alert_type": "high_risk_detected",
    "risk_score": 15.2,
    "requires_immediate_review": true
  }
}
```

---

## 🔍 **Search API**

### **Global Search**
```http
GET /api/mock/search?q=TechCorp&types=providers,analyses,training
```

### **Advanced Provider Search**
```http
POST /api/mock/search/providers
Content-Type: application/json

{
  "query": {
    "name": "Tech*",
    "sector": ["Tecnología", "Software"],
    "risk_score_range": {
      "min": 60,
      "max": 90
    },
    "analysis_date_range": {
      "start": "2024-01-01",
      "end": "2024-09-01"
    }
  },
  "sort": {
    "field": "risk_score",
    "order": "desc"
  },
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

---

## 📊 **Export API**

### **Export Provider Report**
```http
GET /api/mock/providers/{provider_id}/export?format=pdf&include=analysis,documents,history
```

### **Export Dashboard Data**
```http
POST /api/mock/dashboard/export
Content-Type: application/json

{
  "format": "xlsx",
  "sections": ["overview", "risk_analysis", "training_metrics"],
  "date_range": {
    "start": "2024-08-01",
    "end": "2024-09-01"
  }
}
```

---

## 📱 **Mobile API Endpoints**

### **Optimized for Mobile**
```http
GET /api/mock/mobile/dashboard/summary
GET /api/mock/mobile/providers/recent
POST /api/mock/mobile/analysis/quick
```

### **Offline Sync**
```http
POST /api/mock/mobile/sync/upload
GET /api/mock/mobile/sync/download?last_sync=2024-09-01T10:00:00Z
```

---

## 🎲 **Mock Data Generation**

### **Generate Sample Data**
```http
POST /api/mock/admin/generate-data
Content-Type: application/json

{
  "providers_count": 50,
  "analyses_per_provider": 3,
  "training_sessions": 100,
  "sectors": ["Tecnología", "Financiero", "Construcción"]
}
```

### **Reset Demo Data**
```http
POST /api/mock/admin/reset-data
```

---

## 🔧 **Utility Endpoints**

### **Health Check**
```http
GET /api/mock/health
```

#### **Response**
```json
{
  "status": "healthy",
  "timestamp": "2024-09-01T16:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "mock_apis": "running",
    "websocket": "active"
  }
}
```

### **System Info**
```http
GET /api/mock/info
```

### **Mock Configuration**
```http
GET /api/mock/config
```

---

## 🚦 **Response Codes**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "PROVIDER_NOT_FOUND",
    "message": "Provider with CUIT 20-12345678-9 not found",
    "details": {
      "cuit": "20-12345678-9",
      "timestamp": "2024-09-01T16:00:00Z"
    }
  }
}
```

---

## 📈 **Rate Limiting**

### **Development Limits**
```javascript
// Generous limits for hackathon
const RATE_LIMITS = {
  analysis: 100,    // per minute
  search: 200,      // per minute  
  dashboard: 500,   // per minute
  websocket: 1000   // connections
};
```

### **Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693574400
```

---

## 🎨 **SDK Examples**

### **JavaScript/TypeScript**
```typescript
// SDK Usage Example
import { IntegridAI } from './sdk/integridai-client';

const client = new IntegridAI({
  baseUrl: 'http://localhost:3001/api/mock',
  apiKey: 'hackathon-demo-token' // optional for mock
});

// Analyze provider
const analysis = await client.providers.analyze({
  cuit: '20-12345678-9',
  name: 'TechCorp Argentina SA',
  sector: 'Tecnología'
});

// Get dashboard data
const dashboard = await client.dashboard.getMetrics();

// Start training session
const session = await client.training.startSession({
  scenarioId: 'scen_001',
  userId: 'user_hackathon_01'
});
```

### **Python**
```python
# Python SDK Example
from integridai import IntegridAIClient

client = IntegridAIClient(
    base_url='http://localhost:3001/api/mock',
    api_key='hackathon-demo-token'  # optional for mock
)

# Analyze provider
analysis = client.providers.analyze(
    cuit='20-12345678-9',
    name='TechCorp Argentina SA',
    sector='Tecnología'
)

# Get dashboard metrics
metrics = client.dashboard.get_metrics()

# Export report
report = client.providers.export_report(
    provider_id='prov_001',
    format='pdf'
)
```

### **React Hooks**
```typescript
// Custom React hooks for API integration
import { useProviderAnalysis, useDashboardMetrics } from './hooks/api';

const ProviderAnalysisComponent = ({ cuit }) => {
  const { 
    data: analysis, 
    loading, 
    error,
    refetch 
  } = useProviderAnalysis(cuit);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <AnalysisDisplay 
      analysis={analysis} 
      onRefresh={refetch}
    />
  );
};
```

---

## 📚 **Additional Resources**

### **Interactive API Explorer**
- **Swagger UI**: http://localhost:3001/docs
- **Redoc**: http://localhost:3001/redoc

### **Postman Collection**
```bash
# Import Postman collection
curl -o integridai-hackathon.postman_collection.json \
  http://localhost:3001/api/mock/postman-collection
```

### **API Testing Tools**
```bash
# Test all endpoints
npm run test:api

# Load testing
npm run load-test

# API documentation validation
npm run validate:api-docs
```

---

## 🎯 **Best Practices**

### **Error Handling**
```typescript
try {
  const analysis = await client.providers.analyze(data);
  return analysis;
} catch (error) {
  if (error.status === 429) {
    // Handle rate limiting
    await delay(error.retryAfter * 1000);
    return client.providers.analyze(data);
  }
  
  if (error.status === 422) {
    // Handle validation errors
    return handleValidationError(error.details);
  }
  
  // Handle other errors
  throw error;
}
```

### **Caching**
```typescript
// Cache frequently accessed data
const cache = new Map();

const getCachedProviders = async () => {
  if (cache.has('providers')) {
    return cache.get('providers');
  }
  
  const providers = await client.providers.list();
  cache.set('providers', providers);
  
  // Invalidate after 5 minutes
  setTimeout(() => cache.delete('providers'), 5 * 60 * 1000);
  
  return providers;
};
```

### **Pagination**
```typescript
const getAllProviders = async () => {
  let page = 1;
  const allProviders = [];
  
  while (true) {
    const response = await client.providers.list({ page, limit: 100 });
    allProviders.push(...response.data.providers);
    
    if (!response.data.pagination.has_next) {
      break;
    }
    
    page++;
  }
  
  return allProviders;
};
```

---

## 🎉 **Ready to Integrate!**

Esta API te permite crear soluciones increíbles para el HackAI 2025. **Recuerda**:

✅ **Todas las APIs son MOCK** - No hay conexiones reales  
✅ **Datos realistas** - Simulan casos de uso reales  
✅ **Sin restricciones** - Experimenta libremente  
✅ **Documentación completa** - Todo lo que necesitas está aquí  

### **¿Necesitas ayuda?**
- **Swagger UI**: http://localhost:3001/docs
- **GitHub Issues**: Para bugs y preguntas
- **Discord**: #hackathon-api-support

**¡Hora de construir el futuro del RegTech! 🚀**