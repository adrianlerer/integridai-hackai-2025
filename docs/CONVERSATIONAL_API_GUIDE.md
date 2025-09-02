# Flaisimulator Conversational API - Guía Completa

## 🎯 Resumen Ejecutivo

La **Flaisimulator Conversational API** proporciona una plataforma completa para desarrollar experiencias conversacionales interactivas basadas en escenarios de entrenamiento ético corporativo. Esta API permite crear aplicaciones conversacionales que simulan situaciones reales de integridad empresarial.

**Características Principales:**
- 🎭 Escenarios interactivos de entrenamiento ético
- 💬 Sesiones conversacionales persistentes
- 📊 Evaluación de decisiones éticas en tiempo real
- 🎮 Sistema de gamificación integrado
- 👥 Soporte multi-usuario
- 📈 Métricas y análisis detallados

## 🚀 Inicio Rápido

### 1. Instalación y Configuración

```bash
# Instalar dependencias
cd /home/user/webapp
pip install flask flask-cors sqlite3

# Iniciar el servidor de la API
python conversational_api.py --host 0.0.0.0 --port 5000

# Verificar que está funcionando
curl http://localhost:5000/api/conversational/health
```

### 2. Verificación del Sistema

```bash
# Estado completo del sistema
curl http://localhost:5000/api/conversational/status

# Escenarios disponibles
curl "http://localhost:5000/api/conversational/scenarios?level=intermediate"
```

## 📚 Endpoints de la API

### 🔍 Sistema y Estado

#### GET `/api/conversational/health`
Verificación rápida de salud del sistema.

**Respuesta:**
```json
{
  "status": "healthy",
  "service": "Flaisimulator Conversational API",
  "version": "1.0.0",
  "engine_ready": true,
  "active_sessions": 3,
  "timestamp": "2024-01-01T12:00:00"
}
```

#### GET `/api/conversational/status`
Estado completo del sistema y capacidades.

**Respuesta:**
```json
{
  "service": "Flaisimulator Conversational API",
  "version": "1.0.0",
  "status": "operational",
  "capabilities": [
    "interactive_scenarios",
    "persistent_sessions",
    "ethical_evaluation",
    "stakeholder_simulation",
    "gamification_scoring",
    "multi_user_support"
  ],
  "system_info": {
    "active_sessions": 5,
    "total_sessions": 142,
    "total_requests": 1247,
    "uptime": "2:45:30",
    "average_session_duration": 18.5
  },
  "scenario_types": [
    "vendor_negotiation",
    "public_bid_process",
    "political_pressure",
    "gift_offering",
    "conflict_interest",
    "whistleblower_report",
    "audit_findings"
  ],
  "difficulty_levels": ["basic", "intermediate", "advanced", "expert"]
}
```

### 🎭 Gestión de Escenarios

#### GET `/api/conversational/scenarios`
Obtiene escenarios disponibles para el usuario.

**Parámetros de consulta:**
- `level` (opcional): Nivel de usuario (`basic`, `intermediate`, `advanced`, `expert`)
- `type` (opcional): Tipo de escenario específico

**Ejemplo:**
```bash
curl "http://localhost:5000/api/conversational/scenarios?level=advanced&type=vendor_negotiation"
```

**Respuesta:**
```json
{
  "scenarios": [
    {
      "id": "scenario_vendor_001",
      "title": "Negociación de Contrato con Presión Política",
      "type": "vendor_negotiation",
      "difficulty": "advanced",
      "duration": 25,
      "based_on_case": "case_mining_chile_2019",
      "learning_objectives": [
        "Identificar red flags en negociaciones complejas",
        "Manejar presión política manteniendo integridad",
        "Aplicar políticas de compliance bajo presión"
      ]
    }
  ],
  "total_available": 15,
  "user_level": "advanced",
  "filtered_by_type": "vendor_negotiation"
}
```

### 💬 Gestión de Sesiones Conversacionales

#### POST `/api/conversational/sessions`
Crea una nueva sesión conversacional.

**Request Body:**
```json
{
  "user_id": "user_123",
  "scenario_id": "scenario_vendor_001"
}
```

**Respuesta:**
```json
{
  "session_id": "session_user_123_scenario_vendor_001_1703123456",
  "scenario": {
    "title": "Negociación de Contrato con Presión Política",
    "your_role": "Gerente de Contratos Corporativos",
    "setting": "Oficina de la empresa, reunión con proveedor clave",
    "company_context": "Empresa minera multinacional con operaciones en Chile",
    "situation_description": "Un proveedor estratégico solicita una reunión urgente...",
    "learning_objectives": [
      "Identificar red flags en negociaciones complejas",
      "Manejar presión política manteniendo integridad"
    ],
    "estimated_duration": 25
  },
  "stakeholders": [
    {
      "name": "Carlos Mendoza",
      "role": "vendor",
      "company": "Constructora Los Andes S.A."
    },
    {
      "name": "Patricia Rojas", 
      "role": "government_official",
      "company": "Municipalidad de Calama"
    }
  ],
  "opening_dialogue": "Carlos se inclina hacia adelante con una sonrisa preocupada. 'Necesitamos hablar sobre el proyecto del puerto. Han surgido... complicaciones políticas que requieren nuestra atención inmediata.'",
  "initial_options": [
    {
      "id": "opt_001",
      "text": "¿Qué tipo de complicaciones? Explícame la situación con detalle."
    },
    {
      "id": "opt_002", 
      "text": "Si hay presiones políticas, quizás deberíamos involucrar al departamento legal desde el inicio."
    },
    {
      "id": "opt_003",
      "text": "Entiendo tu preocupación. ¿Qué propones específicamente para resolverlo?"
    }
  ],
  "created_at": "2024-01-01T12:00:00"
}
```

#### GET `/api/conversational/sessions/{session_id}`
Obtiene información completa de una sesión específica.

**Respuesta:**
```json
{
  "session_id": "session_user_123_scenario_vendor_001_1703123456",
  "user_id": "user_123",
  "scenario_id": "scenario_vendor_001",
  "status": "active",
  "started_at": "2024-01-01T12:00:00",
  "updated_at": "2024-01-01T12:15:30",
  "completed_at": null,
  "final_score": null,
  "scenario": { /* datos del escenario */ },
  "stakeholders": [ /* información de stakeholders */ ],
  "current_scores": {
    "ethical": 75,
    "risk_management": 82,
    "total": 157
  },
  "interactions": [
    {
      "step": 1,
      "choice_id": "opt_001",
      "choice_text": "¿Qué tipo de complicaciones? Explícame la situación con detalle.",
      "ethical_score": 10,
      "risk_level": 20,
      "stakeholder_reaction": "Carlos asiente y explica...",
      "timestamp": "2024-01-01T12:05:15"
    }
  ]
}
```

#### POST `/api/conversational/sessions/{session_id}/respond`
Procesa una respuesta del usuario en la sesión.

**Request Body:**
```json
{
  "choice_id": "opt_001",
  "choice_text": "¿Qué tipo de complicaciones? Explícame la situación con detalle."
}
```

**Respuesta:**
```json
{
  "consequence": "Carlos se relaja visiblemente al ver tu enfoque profesional y metódico.",
  "stakeholder_reaction": "Carlos asiente y explica: 'El alcalde de Calama ha sugerido que necesitamos hacer algunas \"contribuciones comunitarias\" adicionales para acelerar los permisos. Habla de $50,000 USD para un proyecto social específico.'",
  "current_scores": {
    "ethical_score": 85,
    "risk_management_score": 78,
    "total_score": 163
  },
  "ethical_impact": 15,
  "risk_level": 35,
  "next_options": [
    {
      "id": "opt_004",
      "text": "Necesitamos documentar esta solicitud oficialmente y revisarla con nuestro equipo legal."
    },
    {
      "id": "opt_005",
      "text": "¿Este tipo de contribuciones son normales en la zona? ¿Tienes documentación de proyectos anteriores?"
    },
    {
      "id": "opt_006",
      "text": "Entiendo la situación, pero necesitamos asegurar que cualquier contribución sea completamente transparente y legal."
    }
  ],
  "session_complete": false,
  "red_flags_identified": [
    "Solicitud de dinero no documentada oficialmente",
    "Presión para pagos rápidos sin proceso formal"
  ],
  "learning_progress": {
    "objectives_met": 2,
    "total_objectives": 5,
    "completion_percentage": 40
  }
}
```

### 📊 Métricas y Análisis

#### GET `/api/conversational/users/{user_id}/metrics`
Obtiene métricas detalladas del usuario.

**Respuesta:**
```json
{
  "user_id": "user_123",
  "total_sessions": 15,
  "completed_sessions": 12,
  "completion_rate": 0.8,
  "average_ethical_score": 78.5,
  "average_risk_score": 82.3,
  "preferred_scenario_types": ["vendor_negotiation", "audit_findings"],
  "skill_level": "advanced",
  "last_active": "2024-01-01T12:00:00",
  "created_at": "2023-11-15T09:30:00",
  "recent_sessions": [
    {
      "scenario_id": "scenario_vendor_001",
      "status": "completed",
      "started_at": "2024-01-01T10:00:00",
      "completed_at": "2024-01-01T10:25:30",
      "final_score": 165
    }
  ]
}
```

#### GET `/api/conversational/analytics`
Obtiene analíticas del sistema completo.

**Respuesta:**
```json
{
  "system_stats": {
    "total_sessions": 1247,
    "completed_sessions": 998,
    "completion_rate": 0.8,
    "unique_users": 156,
    "active_sessions": 8,
    "uptime": "7:23:45",
    "requests_handled": 15642
  },
  "popular_scenarios": [
    {
      "scenario_id": "scenario_vendor_001",
      "usage_count": 89
    },
    {
      "scenario_id": "scenario_audit_003", 
      "usage_count": 76
    }
  ],
  "scenario_performance": [
    {
      "scenario_id": "scenario_vendor_001",
      "average_score": 78.5,
      "completions": 89
    }
  ]
}
```

## 💻 Ejemplos de Integración

### Python Client

```python
import requests
import json
from typing import Dict, List, Optional

class FlaisimulatorConversationalClient:
    """Cliente Python para la API Conversacional de Flaisimulator"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_available_scenarios(self, user_level: str = "intermediate", 
                              scenario_type: Optional[str] = None) -> Dict:
        """Obtiene escenarios disponibles"""
        params = {"level": user_level}
        if scenario_type:
            params["type"] = scenario_type
            
        response = self.session.get(
            f"{self.base_url}/api/conversational/scenarios",
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    def create_session(self, user_id: str, scenario_id: str) -> Dict:
        """Crea una nueva sesión conversacional"""
        data = {
            "user_id": user_id,
            "scenario_id": scenario_id
        }
        
        response = self.session.post(
            f"{self.base_url}/api/conversational/sessions",
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_session(self, session_id: str) -> Dict:
        """Obtiene información de una sesión"""
        response = self.session.get(
            f"{self.base_url}/api/conversational/sessions/{session_id}"
        )
        response.raise_for_status()
        return response.json()
    
    def respond_to_session(self, session_id: str, choice_id: str, 
                          choice_text: str = "") -> Dict:
        """Envía respuesta del usuario a la sesión"""
        data = {
            "choice_id": choice_id,
            "choice_text": choice_text
        }
        
        response = self.session.post(
            f"{self.base_url}/api/conversational/sessions/{session_id}/respond",
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_user_metrics(self, user_id: str) -> Dict:
        """Obtiene métricas del usuario"""
        response = self.session.get(
            f"{self.base_url}/api/conversational/users/{user_id}/metrics"
        )
        response.raise_for_status()
        return response.json()

# Ejemplo de uso
def ejemplo_sesion_conversacional():
    """Ejemplo completo de una sesión conversacional"""
    client = FlaisimulatorConversationalClient()
    user_id = "demo_user_001"
    
    try:
        # 1. Obtener escenarios disponibles
        print("🎭 Obteniendo escenarios disponibles...")
        scenarios = client.get_available_scenarios(user_level="intermediate")
        print(f"Escenarios disponibles: {len(scenarios['scenarios'])}")
        
        # 2. Seleccionar primer escenario
        scenario = scenarios['scenarios'][0]
        print(f"Escenario seleccionado: {scenario['title']}")
        
        # 3. Crear sesión
        print("\n💬 Creando sesión conversacional...")
        session = client.create_session(user_id, scenario['id'])
        session_id = session['session_id']
        print(f"Sesión creada: {session_id}")
        
        # 4. Mostrar diálogo inicial
        print(f"\n📖 Situación: {session['scenario']['situation_description']}")
        print(f"🎯 Tu rol: {session['scenario']['your_role']}")
        print(f"📍 Lugar: {session['scenario']['setting']}")
        print(f"\n💬 Diálogo: {session['opening_dialogue']}")
        
        # 5. Mostrar opciones iniciales
        print("\n🔤 Opciones disponibles:")
        for i, option in enumerate(session['initial_options'], 1):
            print(f"{i}. {option['text']}")
        
        # 6. Simular elección del usuario (primera opción)
        print(f"\n➡️ Usuario selecciona opción 1...")
        choice = session['initial_options'][0]
        response = client.respond_to_session(session_id, choice['id'], choice['text'])
        
        # 7. Mostrar respuesta del sistema
        print(f"👥 Reacción: {response['stakeholder_reaction']}")
        print(f"📊 Puntaje ético: {response['current_scores']['ethical_score']}")
        print(f"⚠️ Gestión de riesgo: {response['current_scores']['risk_management_score']}")
        
        # 8. Continuar con siguientes opciones si están disponibles
        if 'next_options' in response:
            print(f"\n🔄 Siguientes opciones:")
            for i, option in enumerate(response['next_options'], 1):
                print(f"{i}. {option['text']}")
        
        # 9. Obtener métricas finales del usuario
        print(f"\n📈 Métricas del usuario:")
        metrics = client.get_user_metrics(user_id)
        print(f"Sesiones completadas: {metrics['completed_sessions']}/{metrics['total_sessions']}")
        print(f"Puntaje ético promedio: {metrics['average_ethical_score']}")
        
        return session_id
        
    except requests.RequestException as e:
        print(f"❌ Error en la API: {e}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    ejemplo_sesion_conversacional()
```

### JavaScript/React Integration

```javascript
class FlaisimulatorConversationalAPI {
    constructor(baseUrl = 'http://localhost:5000') {
        this.baseUrl = baseUrl;
    }
    
    async getScenarios(userLevel = 'intermediate', scenarioType = null) {
        const params = new URLSearchParams({ level: userLevel });
        if (scenarioType) params.append('type', scenarioType);
        
        const response = await fetch(
            `${this.baseUrl}/api/conversational/scenarios?${params}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to get scenarios: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async createSession(userId, scenarioId) {
        const response = await fetch(
            `${this.baseUrl}/api/conversational/sessions`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    scenario_id: scenarioId
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async respondToSession(sessionId, choiceId, choiceText = '') {
        const response = await fetch(
            `${this.baseUrl}/api/conversational/sessions/${sessionId}/respond`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    choice_id: choiceId,
                    choice_text: choiceText
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to respond: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async getUserMetrics(userId) {
        const response = await fetch(
            `${this.baseUrl}/api/conversational/users/${userId}/metrics`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to get metrics: ${response.status}`);
        }
        
        return await response.json();
    }
}

// Componente React de ejemplo
import React, { useState, useEffect } from 'react';

const ConversationalTraining = ({ userId }) => {
    const [api] = useState(new FlaisimulatorConversationalAPI());
    const [scenarios, setScenarios] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadScenarios();
    }, []);
    
    const loadScenarios = async () => {
        try {
            const result = await api.getScenarios('intermediate');
            setScenarios(result.scenarios);
        } catch (error) {
            console.error('Error loading scenarios:', error);
        }
    };
    
    const startSession = async (scenarioId) => {
        try {
            setLoading(true);
            const session = await api.createSession(userId, scenarioId);
            setCurrentSession(session.session_id);
            setSessionData(session);
        } catch (error) {
            console.error('Error creating session:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const makeChoice = async (choiceId, choiceText) => {
        try {
            setLoading(true);
            const response = await api.respondToSession(currentSession, choiceId, choiceText);
            
            // Actualizar datos de la sesión con la respuesta
            setSessionData(prev => ({
                ...prev,
                currentScores: response.current_scores,
                lastResponse: response
            }));
            
        } catch (error) {
            console.error('Error making choice:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (!sessionData) {
        return (
            <div className="scenario-selector">
                <h2>Selecciona un Escenario de Entrenamiento</h2>
                <div className="scenario-grid">
                    {scenarios.map(scenario => (
                        <div key={scenario.id} className="scenario-card">
                            <h3>{scenario.title}</h3>
                            <p>Dificultad: {scenario.difficulty}</p>
                            <p>Duración: {scenario.duration} minutos</p>
                            <button 
                                onClick={() => startSession(scenario.id)}
                                disabled={loading}
                            >
                                {loading ? 'Iniciando...' : 'Iniciar Entrenamiento'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="conversational-session">
            <div className="session-header">
                <h2>{sessionData.scenario.title}</h2>
                <div className="role-info">
                    <p><strong>Tu rol:</strong> {sessionData.scenario.your_role}</p>
                    <p><strong>Lugar:</strong> {sessionData.scenario.setting}</p>
                </div>
                
                {sessionData.currentScores && (
                    <div className="score-display">
                        <span>Ético: {sessionData.currentScores.ethical_score}</span>
                        <span>Riesgo: {sessionData.currentScores.risk_management_score}</span>
                    </div>
                )}
            </div>
            
            <div className="dialogue-content">
                <div className="situation">
                    <h3>Situación</h3>
                    <p>{sessionData.scenario.situation_description}</p>
                </div>
                
                <div className="current-dialogue">
                    <h3>Diálogo</h3>
                    <p>{sessionData.opening_dialogue}</p>
                    
                    {sessionData.lastResponse && (
                        <div className="response">
                            <p><strong>Reacción:</strong> {sessionData.lastResponse.stakeholder_reaction}</p>
                            {sessionData.lastResponse.red_flags_identified && (
                                <div className="red-flags">
                                    <strong>🚩 Red Flags Identificados:</strong>
                                    <ul>
                                        {sessionData.lastResponse.red_flags_identified.map((flag, i) => (
                                            <li key={i}>{flag}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="options">
                    <h3>¿Cómo respondes?</h3>
                    {(sessionData.lastResponse?.next_options || sessionData.initial_options).map(option => (
                        <button
                            key={option.id}
                            className="choice-button"
                            onClick={() => makeChoice(option.id, option.text)}
                            disabled={loading}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="stakeholders">
                <h3>Participantes</h3>
                {sessionData.stakeholders.map(stakeholder => (
                    <div key={stakeholder.name} className="stakeholder">
                        <strong>{stakeholder.name}</strong> - {stakeholder.role} ({stakeholder.company})
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationalTraining;
```

## 🛠️ Configuración de Producción

### Usando PM2 (Recomendado)

```bash
# Crear archivo de configuración de PM2
cat > ecosystem.conversational.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'flaisimulator-conversational-api',
    script: 'conversational_api.py',
    interpreter: 'python3',
    args: '--host 0.0.0.0 --port 5000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      FLASK_ENV: 'production'
    },
    error_file: './logs/conversational-api-error.log',
    out_file: './logs/conversational-api-out.log',
    log_file: './logs/conversational-api.log',
    time: true
  }]
};
EOF

# Crear directorio de logs
mkdir -p logs

# Iniciar con PM2
pm2 start ecosystem.conversational.config.js
pm2 save
pm2 startup

# Monitorear
pm2 status
pm2 logs flaisimulator-conversational-api --nostream
```

### Variables de Entorno

```bash
# Configuraciones opcionales
export CONVERSATIONAL_API_HOST=0.0.0.0
export CONVERSATIONAL_API_PORT=5000
export CONVERSATIONAL_API_DEBUG=false
export CONVERSATIONAL_DB_PATH=/data/conversational_api.db
export FLASK_ENV=production
```

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copiar código de la aplicación
COPY conversational_api.py flaisimulator_engine.py ./
COPY integridai.db ./

# Crear directorio para base de datos
RUN mkdir -p /data
VOLUME ["/data"]

# Exponer puerto
EXPOSE 5000

# Variables de entorno
ENV CONVERSATIONAL_DB_PATH=/data/conversational_api.db
ENV FLASK_ENV=production

# Comando de inicio
CMD ["python", "conversational_api.py", "--host", "0.0.0.0", "--port", "5000", "--db", "/data/conversational_api.db"]
```

```bash
# Construir y ejecutar
docker build -t flaisimulator-conversational-api .
docker run -d -p 5000:5000 -v /local/data:/data flaisimulator-conversational-api
```

## 📊 Monitoreo y Métricas

### Métricas Clave a Monitorear

1. **Performance**
   - Tiempo de respuesta promedio
   - Sesiones activas simultáneas
   - Memoria utilizada

2. **Uso**
   - Número total de sesiones
   - Tasa de completación
   - Usuarios activos

3. **Calidad**
   - Puntajes éticos promedio
   - Escenarios más populares
   - Feedback del usuario

### Endpoints de Monitoreo

```bash
# Métricas del sistema
curl http://localhost:5000/api/conversational/analytics

# Estado de salud
curl http://localhost:5000/api/conversational/health

# Métricas específicas de usuario
curl http://localhost:5000/api/conversational/users/user_123/metrics
```

## 🔧 Troubleshooting

### Problemas Comunes

**La API no responde:**
```bash
# Verificar que el servicio está corriendo
pm2 status flaisimulator-conversational-api

# Verificar logs
pm2 logs flaisimulator-conversational-api

# Reiniciar si es necesario
pm2 restart flaisimulator-conversational-api
```

**Sesiones no se crean:**
- Verificar que el scenario_id existe
- Comprobar que el motor Flaisimulator está inicializado
- Revisar permisos de la base de datos

**Respuestas lentas:**
- Monitorear uso de CPU y memoria
- Verificar conexiones a la base de datos
- Considerar optimizar consultas SQL

**Errores de base de datos:**
```bash
# Verificar permisos
ls -la conversational_api.db

# Recrear base de datos si es necesario
rm conversational_api.db
python conversational_api.py --db conversational_api.db
```

## 🚀 Casos de Uso

### 1. Plataforma de E-Learning Corporativo
Integrar en sistemas LMS para entrenamientos de compliance e integridad.

### 2. Simuladores de Riesgo
Crear herramientas de evaluación de riesgo para diferentes industrias.

### 3. Aplicaciones Móviles de Entrenamiento
Desarrollar apps móviles con escenarios interactivos.

### 4. Sistemas de Gamificación
Implementar elementos de juego en programas de entrenamiento corporativo.

### 5. Evaluación de Competencias
Usar para evaluar habilidades éticas y de toma de decisiones.

---

## 📞 Soporte y Desarrollo

**Características Implementadas:**
- ✅ API REST completa con 9 endpoints
- ✅ Sesiones persistentes con SQLite
- ✅ Evaluación ética en tiempo real
- ✅ Soporte multi-usuario
- ✅ Métricas y análisis
- ✅ Sistema de gamificación

**Roadmap:**
- 🔄 Autenticación y autorización
- 🔄 Webhooks para notificaciones
- 🔄 Exportación de reportes
- 🔄 Integración con sistemas LMS
- 🔄 API GraphQL opcional

La **Flaisimulator Conversational API** proporciona una base sólida para construir experiencias conversacionales sofisticadas basadas en escenarios reales de integridad corporativa, ofreciendo una combinación única de educación ética, gamificación y análisis de desempeño.