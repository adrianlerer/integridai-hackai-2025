# 🔌 Backend APIs Challenge - Integration Master

## 🏆 **Tu Misión: Conectar el Ecosistema**

Crear las APIs de orquestación que permitan que FLAISimulator, RegTech Engine y Dashboard Unificado funcionen como un sistema integrado y coherente.

---

## 🎯 **Objetivos del Challenge**

### **1. API Gateway Unificada**
Desarrollar un punto de entrada único que:
- 🔄 **Orqueste llamadas** entre módulos
- 🔐 **Maneje autenticación** y autorización  
- ⚡ **Optimice performance** con caching
- 📊 **Centralice logging** y monitoring

### **2. Microservicios Integration**
Conectar los módulos existentes:
- 🎮 **FLAISimulator API** (Puerto 8000) - Capacitación
- 🤖 **RegTech Engine API** (Puerto 3000) - Compliance  
- 📊 **Dashboard API** (Puerto 5000) - Métricas consolidadas

### **3. Real-Time Data Sync**
Implementar sincronización en tiempo real:
- 📡 **WebSockets** para updates live
- 🔄 **Event streaming** entre servicios
- 📈 **Métricas consolidadas** actualizadas automáticamente

---

## 🛠️ **Tech Stack Recomendado**

### **Core Backend:**
```json
{
  "framework": "FastAPI (Python) o Express.js (Node.js)",
  "database": "PostgreSQL + Redis (cache)",
  "messaging": "Redis Pub/Sub o RabbitMQ",
  "monitoring": "Prometheus + Grafana",
  "docs": "Swagger/OpenAPI 3.0"
}
```

### **APIs & Integration:**
- **HTTP Client:** Axios o httpx
- **WebSockets:** Socket.io o WebSockets nativo
- **Validation:** Pydantic o Joi
- **Testing:** pytest o Jest
- **Rate Limiting:** Redis-based limiter

---

## 📂 **Estructura de Archivos**

```
src/backend/
├── api/
│   ├── gateway/
│   │   ├── main.py           # API Gateway principal
│   │   ├── routes.py         # Rutas unificadas
│   │   └── middleware.py     # Auth, CORS, Rate limiting
│   ├── integrations/
│   │   ├── flaisimulator.py  # Cliente FLAISimulator
│   │   ├── regtech.py        # Cliente RegTech
│   │   └── dashboard.py      # Cliente Dashboard
│   ├── orchestration/
│   │   ├── workflow.py       # Flujos entre servicios
│   │   ├── events.py         # Event handling
│   │   └── sync.py           # Data synchronization
│   └── utils/
│       ├── cache.py          # Redis caching
│       ├── logging.py        # Structured logging
│       └── monitoring.py     # Health checks
├── models/
│   ├── unified.py            # Modelos unificados
│   ├── schemas.py            # Request/Response schemas
│   └── events.py             # Event schemas
├── services/
│   ├── metrics.py            # Consolidación métricas
│   ├── notifications.py      # Sistema notificaciones
│   └── reporting.py          # Reportes consolidados
└── tests/
    ├── integration/          # Tests integración
    ├── load/                 # Performance tests
    └── mocks/                # Mock services
```

---

## 🔌 **APIs a Desarrollar**

### **1. API Gateway Unificada**

#### **Endpoint Base:**
```bash
POST /api/v1/gateway/execute
Content-Type: application/json
```

#### **Orchestration Request:**
```typescript
interface OrchestrationRequest {
  workflow: 'complete_analysis' | 'training_sync' | 'metrics_update';
  payload: {
    provider?: ProviderData;
    user_id?: string;
    training_session?: TrainingData;
  };
  options: {
    async?: boolean;
    priority?: 'low' | 'normal' | 'high';
    timeout?: number;
  };
}
```

#### **Ejemplo Implementación (FastAPI):**
```python
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Literal
import httpx
import asyncio

app = FastAPI(title="IntegridAI Gateway API")

class OrchestrationRequest(BaseModel):
    workflow: Literal['complete_analysis', 'training_sync', 'metrics_update']
    payload: dict
    options: Optional[dict] = {}

# Clientes para servicios externos
class ServiceClients:
    def __init__(self):
        self.regtech = httpx.AsyncClient(base_url="http://localhost:3000")
        self.flaisim = httpx.AsyncClient(base_url="http://localhost:8000") 
        self.dashboard = httpx.AsyncClient(base_url="http://localhost:5000")

clients = ServiceClients()

@app.post("/api/v1/gateway/execute")
async def execute_workflow(
    request: OrchestrationRequest,
    background_tasks: BackgroundTasks
):
    """Ejecutar workflow orquestado entre servicios"""
    
    if request.workflow == 'complete_analysis':
        return await complete_analysis_workflow(request.payload)
    elif request.workflow == 'training_sync':
        return await training_sync_workflow(request.payload)
    elif request.workflow == 'metrics_update':
        background_tasks.add_task(update_metrics_async)
        return {"status": "metrics_update_queued"}
    
    return {"error": "Unknown workflow"}

async def complete_analysis_workflow(payload: dict):
    """Workflow completo: RegTech + Dashboard Update"""
    try:
        # 1. Ejecutar análisis RegTech
        regtech_response = await clients.regtech.post(
            "/analyze_provider",
            json=payload
        )
        regtech_data = regtech_response.json()
        
        # 2. Actualizar dashboard con nuevos datos
        dashboard_payload = {
            "provider_analysis": regtech_data,
            "timestamp": datetime.now().isoformat()
        }
        
        dashboard_response = await clients.dashboard.post(
            "/api/update_metrics",
            json=dashboard_payload
        )
        
        # 3. Retornar resultado consolidado
        return {
            "success": True,
            "regtech_analysis": regtech_data,
            "dashboard_updated": dashboard_response.status_code == 200,
            "workflow_id": str(uuid.uuid4())
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "workflow": "complete_analysis"
        }
```

### **2. Métricas Consolidadas API**

#### **Endpoint:**
```bash
GET /api/v1/metrics/consolidated
```

#### **Response Schema:**
```typescript
interface ConsolidatedMetrics {
  timestamp: string;
  system_health: {
    flaisimulator_status: 'online' | 'offline' | 'degraded';
    regtech_status: 'online' | 'offline' | 'degraded';
    dashboard_status: 'online' | 'offline' | 'degraded';
  };
  business_metrics: {
    total_users: number;
    active_simulations: number;
    providers_analyzed: number;
    avg_compliance_score: number;
    training_effectiveness: number;
  };
  performance_metrics: {
    avg_response_time_ms: number;
    requests_per_minute: number;
    error_rate_percent: number;
  };
}
```

#### **Implementación:**
```python
@app.get("/api/v1/metrics/consolidated")
async def get_consolidated_metrics():
    """Obtener métricas consolidadas de todos los servicios"""
    
    try:
        # Obtener métricas en paralelo
        tasks = [
            get_flaisimulator_metrics(),
            get_regtech_metrics(),
            get_dashboard_metrics()
        ]
        
        flai_metrics, regtech_metrics, dashboard_metrics = await asyncio.gather(
            *tasks, return_exceptions=True
        )
        
        # Consolidar métricas
        consolidated = {
            "timestamp": datetime.now().isoformat(),
            "system_health": {
                "flaisimulator_status": "online" if not isinstance(flai_metrics, Exception) else "offline",
                "regtech_status": "online" if not isinstance(regtech_metrics, Exception) else "offline", 
                "dashboard_status": "online" if not isinstance(dashboard_metrics, Exception) else "offline"
            },
            "business_metrics": {
                "total_users": getattr(flai_metrics, 'users', 0),
                "active_simulations": getattr(flai_metrics, 'active_sims', 0),
                "providers_analyzed": getattr(regtech_metrics, 'total_providers', 0),
                "avg_compliance_score": getattr(regtech_metrics, 'avg_score', 0),
                "training_effectiveness": calculate_training_effectiveness(flai_metrics)
            },
            "performance_metrics": {
                "avg_response_time_ms": calculate_avg_response_time(),
                "requests_per_minute": get_request_rate(),
                "error_rate_percent": get_error_rate()
            }
        }
        
        # Cache por 30 segundos
        await cache.set("consolidated_metrics", consolidated, expire=30)
        
        return consolidated
        
    except Exception as e:
        logger.error(f"Error getting consolidated metrics: {e}")
        return {"error": "Failed to retrieve metrics", "details": str(e)}

async def get_flaisimulator_metrics():
    """Obtener métricas del FLAISimulator"""
    response = await clients.flaisim.get("/api/v1/metrics")
    return response.json()

async def get_regtech_metrics():
    """Obtener métricas del RegTech"""
    response = await clients.regtech.get("/compliance_dashboard")
    return response.json()
```

### **3. Real-Time WebSocket API**

#### **WebSocket Endpoint:**
```bash
WS /api/v1/realtime/subscribe
```

#### **Event Types:**
```typescript
type WebSocketEvent = 
  | { type: 'metrics_update'; data: ConsolidatedMetrics }
  | { type: 'analysis_complete'; data: AnalysisResult }
  | { type: 'training_progress'; data: TrainingUpdate }
  | { type: 'system_alert'; data: SystemAlert };
```

#### **Implementación WebSocket:**
```python
from fastapi import WebSocket, WebSocketDisconnect
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/api/v1/realtime/subscribe")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Mantener conexión viva
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task para enviar updates
async def broadcast_metrics_updates():
    """Enviar actualizaciones de métricas cada 30 segundos"""
    while True:
        try:
            metrics = await get_consolidated_metrics()
            await manager.broadcast({
                "type": "metrics_update",
                "data": metrics,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            logger.error(f"Error broadcasting metrics: {e}")
        
        await asyncio.sleep(30)

# Iniciar background task al startup
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(broadcast_metrics_updates())
```

---

## 📊 **Database Schema**

### **Eventos y Logs:**
```sql
-- Tabla de eventos del sistema
CREATE TABLE system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    service_name VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    correlation_id VARCHAR(100),
    user_id VARCHAR(100)
);

-- Métricas históricas
CREATE TABLE metrics_history (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    service VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- API Calls logs
CREATE TABLE api_calls_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint VARCHAR(200) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    request_size INTEGER,
    response_size INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 **Testing Strategy**

### **Integration Tests:**
```python
import pytest
import httpx
from fastapi.testclient import TestClient

def test_complete_analysis_workflow():
    """Test del workflow completo de análisis"""
    client = TestClient(app)
    
    # Mock de servicios externos
    with httpx_mock.HTTPXMock() as mock:
        # Mock RegTech response
        mock.add_response(
            method="POST",
            url="http://localhost:3000/analyze_provider",
            json={"success": True, "score": 85.5}
        )
        
        # Mock Dashboard response  
        mock.add_response(
            method="POST",
            url="http://localhost:5000/api/update_metrics",
            status_code=200
        )
        
        # Ejecutar test
        response = client.post("/api/v1/gateway/execute", json={
            "workflow": "complete_analysis",
            "payload": {
                "name": "Test Provider",
                "cuit": "30-12345678-9",
                "sector": "tecnologia"
            }
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "regtech_analysis" in data
        assert data["dashboard_updated"] == True

def test_metrics_consolidation():
    """Test de consolidación de métricas"""
    client = TestClient(app)
    
    response = client.get("/api/v1/metrics/consolidated")
    
    assert response.status_code == 200
    data = response.json()
    assert "system_health" in data
    assert "business_metrics" in data
    assert "performance_metrics" in data

@pytest.mark.asyncio
async def test_websocket_connection():
    """Test de conexión WebSocket"""
    client = TestClient(app)
    
    with client.websocket_connect("/api/v1/realtime/subscribe") as websocket:
        # Enviar mensaje de prueba
        websocket.send_text("ping")
        
        # Verificar que la conexión se mantenga
        data = websocket.receive_text()
        assert data is not None
```

### **Load Testing:**
```python
import locust
from locust import HttpUser, task, between

class APILoadTest(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def test_metrics_endpoint(self):
        """Test de carga para endpoint de métricas"""
        self.client.get("/api/v1/metrics/consolidated")
    
    @task(1)
    def test_analysis_workflow(self):
        """Test de carga para workflow de análisis"""
        self.client.post("/api/v1/gateway/execute", json={
            "workflow": "complete_analysis",
            "payload": {
                "name": f"Load Test Provider {self.user_id}",
                "cuit": "30-12345678-9",
                "sector": "tecnologia"
            }
        })
```

---

## 🚀 **Deployment & Monitoring**

### **Docker Setup:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 3002

CMD ["uvicorn", "api.gateway.main:app", "--host", "0.0.0.0", "--port", "3002"]
```

### **Health Checks:**
```python
@app.get("/api/v1/health")
async def health_check():
    """Comprehensive health check"""
    
    checks = {
        "api_gateway": "healthy",
        "database": await check_database_health(),
        "redis": await check_redis_health(),
        "external_services": await check_external_services_health()
    }
    
    overall_status = "healthy" if all(
        status == "healthy" for status in checks.values()
    ) else "degraded"
    
    return {
        "status": overall_status,
        "timestamp": datetime.now().isoformat(),
        "checks": checks,
        "version": "1.0.0-hackathon"
    }
```

---

## 🏆 **Criterios de Evaluación**

### **Integration Excellence (40%)**
- 🔄 **Orquestación fluida** entre servicios
- ⚡ **Performance óptimo** con caching inteligente
- 🛡️ **Error handling** robusto y resiliente

### **API Design (30%)**
- 📝 **Documentación clara** con OpenAPI/Swagger
- 🔐 **Security** implementado correctamente
- 📊 **Monitoring** y observability completos

### **Real-Time Features (20%)**
- 📡 **WebSockets** funcionando correctamente
- 🔄 **Sync** de datos entre servicios
- ⚡ **Latencia baja** en updates

### **Code Quality (10%)**
- 🧪 **Testing** comprehensivo
- 📚 **Documentación** técnica clara
- 🏗️ **Arquitectura** escalable y mantenible

---

## 💡 **Ideas de Funcionalidades Avanzadas**

### **Circuit Breaker Pattern:**
```python
from circuit_breaker import CircuitBreaker

# Proteger llamadas a servicios externos
regtech_breaker = CircuitBreaker(
    failure_threshold=5,
    recovery_timeout=30,
    expected_exception=httpx.RequestError
)

@regtech_breaker
async def call_regtech_service(payload):
    response = await clients.regtech.post("/analyze_provider", json=payload)
    return response.json()
```

### **Request Tracing:**
```python
import opentelemetry.trace as trace

tracer = trace.get_tracer(__name__)

@app.post("/api/v1/gateway/execute")
async def execute_workflow(request: OrchestrationRequest):
    with tracer.start_as_current_span("gateway.execute_workflow") as span:
        span.set_attribute("workflow.type", request.workflow)
        span.set_attribute("payload.size", len(str(request.payload)))
        
        # Ejecutar workflow con tracing
        result = await process_workflow(request)
        
        span.set_attribute("result.success", result.get("success", False))
        return result
```

### **Rate Limiting Inteligente:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/gateway/execute")
@limiter.limit("10/minute")  # 10 requests por minuto por IP
async def execute_workflow(request: Request, workflow_req: OrchestrationRequest):
    # Lógica del endpoint
    pass
```

---

## 🆘 **Need Help?**

### **Resources:**
- 📚 **FastAPI Docs:** https://fastapi.tiangolo.com/
- 📡 **WebSocket Guide:** https://fastapi.tiangolo.com/advanced/websockets/
- 🔄 **Async Programming:** https://docs.python.org/3/library/asyncio.html

### **Support:**
- 💬 **Slack:** #backend-apis-challenge
- 👨‍💻 **Mentor:** Adrian Lerer - adrian@lerer.com.ar
- 🐛 **Issues:** GitHub Issues

---

## 🎉 **¡Conecta el Futuro!**

Tu código va a ser el **sistema nervioso** de IntegridAI - conectando módulos, sincronizando datos, y haciendo que todo funcione como una sinfonía perfecta.

**¡El ecosistema te está esperando! 🚀**