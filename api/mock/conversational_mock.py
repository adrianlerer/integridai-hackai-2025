#!/usr/bin/env python3
"""
🚀 IntegridAI HackAI 2025 - Mock Conversational API
API de simulación para desarrollo durante el hackathon

⚠️ IMPORTANTE: Esta es una versión MOCK para desarrollo
No contiene APIs reales ni datos de producción
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging
import random
import time

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# 📊 Mock Database - Simulamos respuestas típicas
MOCK_SCENARIOS = [
    {
        "id": "ethics_001",
        "title": "Conflicto de Intereses - Proveedor Familiar",
        "description": "Un empleado debe evaluar a un proveedor que resulta ser empresa familiar",
        "difficulty": "medium",
        "category": "conflictos_interes"
    },
    {
        "id": "compliance_002", 
        "title": "Ofrecimiento de Obsequio Costoso",
        "description": "Cliente ofrece regalo de alto valor por agilizar un trámite",
        "difficulty": "high",
        "category": "corrupcion_privada"
    },
    {
        "id": "transparency_003",
        "title": "Información Confidencial Competencia",
        "description": "Acceso accidental a información confidencial de competidor",
        "difficulty": "low",
        "category": "confidencialidad"
    }
]

MOCK_RESPONSES = [
    "Excelente pregunta. En base a la Ley 27.401, este escenario requiere...",
    "Según las mejores prácticas de compliance, la decisión más ética sería...",
    "Esta situación presenta varios dilemas éticos. Analicemos cada uno...",
    "De acuerdo con los estándares internacionales de integridad...",
    "Este caso es muy común en las empresas argentinas. La recomendación es..."
]

# 💾 Mock Sessions Storage
mock_sessions: Dict[str, Dict] = {}

@app.route('/health', methods=['GET'])
def health_check():
    """🏥 Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "IntegridAI Mock Conversational API",
        "version": "1.0.0-hackathon",
        "environment": "hackathon_demo",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/conversation/start', methods=['POST'])
def start_conversation():
    """🚀 Iniciar nueva conversación"""
    try:
        data = request.get_json() or {}
        
        # Generar session ID
        session_id = str(uuid.uuid4())
        
        # Seleccionar escenario mock aleatorio
        scenario = random.choice(MOCK_SCENARIOS)
        
        # Crear sesión mock
        mock_sessions[session_id] = {
            "session_id": session_id,
            "scenario": scenario,
            "messages": [],
            "created_at": datetime.now().isoformat(),
            "user_profile": data.get("user_profile", "estudiante_hackathon"),
            "difficulty_level": data.get("difficulty", "medium")
        }
        
        logger.info(f"Nueva sesión mock iniciada: {session_id}")
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "scenario": scenario,
            "welcome_message": f"¡Bienvenido al escenario '{scenario['title']}'! Este es un entorno de práctica seguro donde puedes explorar diferentes decisiones éticas.",
            "instructions": "Esta es una simulación - tus respuestas no afectan datos reales. ¡Experimenta libremente!"
        })
        
    except Exception as e:
        logger.error(f"Error iniciando conversación: {e}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500

@app.route('/api/conversation/<session_id>/message', methods=['POST'])
def send_message(session_id: str):
    """💬 Enviar mensaje en conversación"""
    try:
        if session_id not in mock_sessions:
            return jsonify({"success": False, "error": "Sesión no encontrada"}), 404
            
        data = request.get_json() or {}
        user_message = data.get("message", "")
        
        # Simular tiempo de procesamiento
        time.sleep(random.uniform(0.5, 1.5))
        
        # Generar respuesta mock
        mock_response = random.choice(MOCK_RESPONSES)
        scenario_context = mock_sessions[session_id]["scenario"]["title"]
        
        response_message = f"{mock_response} En el contexto de '{scenario_context}', considera que esta es una situación frecuente que requiere análisis cuidadoso de múltiples factores éticos y legales."
        
        # Agregar intercambio a la sesión
        exchange = {
            "timestamp": datetime.now().isoformat(),
            "user_message": user_message,
            "ai_response": response_message,
            "confidence": random.uniform(0.7, 0.95),
            "response_type": "mock_demo"
        }
        
        mock_sessions[session_id]["messages"].append(exchange)
        
        return jsonify({
            "success": True,
            "response": response_message,
            "session_id": session_id,
            "message_count": len(mock_sessions[session_id]["messages"]),
            "demo_mode": True,
            "suggestions": [
                "¿Qué otros factores debería considerar?",
                "¿Cómo se aplicaría esto en mi empresa?",
                "¿Qué dice la normativa al respecto?"
            ]
        })
        
    except Exception as e:
        logger.error(f"Error procesando mensaje: {e}")
        return jsonify({"success": False, "error": "Error procesando mensaje"}), 500

@app.route('/api/conversation/<session_id>/history', methods=['GET'])
def get_conversation_history(session_id: str):
    """📚 Obtener historial de conversación"""
    try:
        if session_id not in mock_sessions:
            return jsonify({"success": False, "error": "Sesión no encontrada"}), 404
            
        session_data = mock_sessions[session_id]
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "scenario": session_data["scenario"],
            "messages": session_data["messages"],
            "created_at": session_data["created_at"],
            "message_count": len(session_data["messages"]),
            "demo_mode": True
        })
        
    except Exception as e:
        logger.error(f"Error obteniendo historial: {e}")
        return jsonify({"success": False, "error": "Error interno"}), 500

@app.route('/api/scenarios', methods=['GET'])
def get_available_scenarios():
    """🎮 Listar escenarios disponibles"""
    return jsonify({
        "success": True,
        "scenarios": MOCK_SCENARIOS,
        "total_count": len(MOCK_SCENARIOS),
        "demo_mode": True,
        "description": "Escenarios de práctica para desarrollo - no son casos reales"
    })

@app.route('/api/analytics/demo', methods=['GET'])
def get_demo_analytics():
    """📊 Analytics de demostración"""
    
    # Generar métricas mock realistas
    mock_analytics = {
        "total_sessions": random.randint(150, 300),
        "active_users": random.randint(25, 50),
        "completion_rate": random.uniform(0.65, 0.85),
        "avg_session_duration": random.randint(8, 15),
        "top_scenarios": [
            {"name": "Conflictos de Interés", "count": random.randint(30, 60)},
            {"name": "Corrupción Privada", "count": random.randint(25, 45)},
            {"name": "Confidencialidad", "count": random.randint(20, 40)}
        ],
        "weekly_growth": random.uniform(0.05, 0.20),
        "demo_mode": True,
        "generated_at": datetime.now().isoformat()
    }
    
    return jsonify({
        "success": True,
        "analytics": mock_analytics,
        "note": "Estos son datos de demostración generados para el hackathon"
    })

@app.route('/api/mock/status', methods=['GET'])
def mock_status():
    """🔧 Estado del sistema mock"""
    return jsonify({
        "service": "IntegridAI Mock API",
        "version": "1.0.0-hackathon",
        "environment": "development",
        "active_sessions": len(mock_sessions),
        "uptime": "Mock service - always available",
        "features": {
            "conversational_ai": "simulated",
            "scenarios": "demo_data",
            "analytics": "generated",
            "real_apis": False,
            "safe_for_development": True
        },
        "endpoints": {
            "/health": "Health check",
            "/api/conversation/start": "Start new conversation",
            "/api/conversation/{id}/message": "Send message",
            "/api/conversation/{id}/history": "Get history",
            "/api/scenarios": "List scenarios",
            "/api/analytics/demo": "Demo analytics"
        }
    })

if __name__ == '__main__':
    print("""
    🚀 IntegridAI HackAI 2025 - Mock Conversational API
    
    ⚠️  MODO DEMO - Solo para desarrollo
    🔒 Sin APIs reales ni datos sensibles
    🎓 Perfecto para hackathon y aprendizaje
    
    Endpoints disponibles:
    - GET  /health
    - POST /api/conversation/start  
    - POST /api/conversation/{id}/message
    - GET  /api/conversation/{id}/history
    - GET  /api/scenarios
    - GET  /api/analytics/demo
    - GET  /api/mock/status
    
    Iniciando servidor en http://localhost:5001
    """)
    
    app.run(host='0.0.0.0', port=5001, debug=True)