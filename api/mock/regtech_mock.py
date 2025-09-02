#!/usr/bin/env python3
"""
🚀 IntegridAI HackAI 2025 - Mock RegTech API
API de simulación para análisis de compliance durante el hackathon

⚠️ IMPORTANTE: Esta es una versión MOCK para desarrollo
No conecta con APIs gubernamentales reales (AFIP, BCRA, CNV, UIF)
Genera datos simulados seguros para desarrollo
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
import random
import time

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# 🏢 Mock de empresas para testing
MOCK_COMPANIES = [
    {
        "cuit": "20123456781",
        "razon_social": "Constructora Demo SA",
        "categoria": "Monotributo A", 
        "estado": "Activo",
        "actividad": "Construcción"
    },
    {
        "cuit": "30234567892", 
        "razon_social": "Servicios IT Ejemplo SRL",
        "categoria": "Responsable Inscripto",
        "estado": "Activo", 
        "actividad": "Servicios Informáticos"
    },
    {
        "cuit": "27345678903",
        "razon_social": "Consultoría Legal Mock",
        "categoria": "Responsable Inscripto",
        "estado": "Activo",
        "actividad": "Servicios Profesionales"
    }
]

def generate_mock_compliance_score():
    """Generar score de compliance simulado"""
    return {
        "overall_score": random.uniform(0.65, 0.95),
        "afip_verification": random.choice([True, True, True, False]),  # 75% éxito
        "bcra_check": random.choice([True, True, False]),  # 66% éxito  
        "cnv_status": random.choice([True, True, True, True, False]),  # 80% éxito
        "uif_screening": random.choice([True, True, True, False]),  # 75% éxito
        "risk_level": random.choice(["BAJO", "BAJO", "MEDIO", "ALTO"]),
        "confidence": random.uniform(0.7, 0.95)
    }

@app.route('/health', methods=['GET'])
def health_check():
    """🏥 Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "IntegridAI Mock RegTech API",
        "version": "1.0.0-hackathon", 
        "environment": "demo",
        "apis_status": {
            "mock_afip": "simulated",
            "mock_bcra": "simulated", 
            "mock_cnv": "simulated",
            "mock_uif": "simulated"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/analyze/company', methods=['POST'])
def analyze_company():
    """🔍 Análisis completo de empresa (MOCK)"""
    try:
        data = request.get_json() or {}
        cuit = data.get('cuit', '')
        company_name = data.get('company_name', '')
        
        if not cuit and not company_name:
            return jsonify({
                "success": False, 
                "error": "Se requiere CUIT o nombre de empresa"
            }), 400
        
        # Simular tiempo de procesamiento real
        time.sleep(random.uniform(1.0, 3.0))
        
        # Buscar en mock database o generar datos
        mock_company = None
        if cuit:
            mock_company = next((c for c in MOCK_COMPANIES if c["cuit"] == cuit), None)
        
        if not mock_company:
            # Generar empresa mock
            mock_company = {
                "cuit": cuit or f"20{random.randint(10000000, 99999999)}1",
                "razon_social": company_name or f"Empresa Demo {random.randint(1000, 9999)} SA",
                "categoria": random.choice(["Monotributo A", "Monotributo B", "Responsable Inscripto"]),
                "estado": random.choice(["Activo", "Activo", "Activo", "Suspendido"]),
                "actividad": random.choice(["Comercio", "Servicios", "Industria", "Construcción"])
            }
        
        # Generar análisis de compliance
        compliance_data = generate_mock_compliance_score()
        
        # Simular verificaciones gubernamentales
        analysis_result = {
            "success": True,
            "analysis_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "company_info": mock_company,
            "compliance_analysis": {
                "overall_score": compliance_data["overall_score"],
                "risk_level": compliance_data["risk_level"],
                "recommendation": get_mock_recommendation(compliance_data["risk_level"]),
                "verification_details": {
                    "afip": {
                        "verified": compliance_data["afip_verification"],
                        "status": "Demo: Contribuyente verificado" if compliance_data["afip_verification"] else "Demo: Verificación pendiente",
                        "last_updated": datetime.now().isoformat(),
                        "source": "AFIP Mock API"
                    },
                    "bcra": {
                        "verified": compliance_data["bcra_check"], 
                        "status": "Demo: Sin deudas reportadas" if compliance_data["bcra_check"] else "Demo: Verificar situación",
                        "last_updated": datetime.now().isoformat(),
                        "source": "BCRA Mock API"
                    },
                    "cnv": {
                        "verified": compliance_data["cnv_status"],
                        "status": "Demo: Registrado correctamente" if compliance_data["cnv_status"] else "Demo: No registrado",
                        "last_updated": datetime.now().isoformat(),
                        "source": "CNV Mock API"  
                    },
                    "uif": {
                        "verified": compliance_data["uif_screening"],
                        "status": "Demo: Sin alertas" if compliance_data["uif_screening"] else "Demo: Revisar manualmente",
                        "last_updated": datetime.now().isoformat(),
                        "source": "UIF Mock API"
                    }
                }
            },
            "demo_mode": True,
            "note": "Análisis simulado para desarrollo - no son datos reales"
        }
        
        logger.info(f"Análisis mock completado para: {mock_company['cuit']}")
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error en análisis mock: {e}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500

def get_mock_recommendation(risk_level: str) -> str:
    """Generar recomendación basada en nivel de riesgo"""
    recommendations = {
        "BAJO": "Proveedor apto para contratación. Mantener monitoreo periódico según políticas internas.",
        "MEDIO": "Proveedor requiere verificación adicional. Solicitar documentación complementaria antes de contratación.",
        "ALTO": "Proveedor de alto riesgo. Se recomienda evaluación manual detallada y aprobación gerencial."
    }
    return recommendations.get(risk_level, "Evaluación inconclusa. Contactar al área de compliance.")

@app.route('/api/batch/analyze', methods=['POST'])
def batch_analyze():
    """📋 Análisis en lote de múltiples empresas"""
    try:
        data = request.get_json() or {}
        companies = data.get('companies', [])
        
        if not companies or len(companies) > 50:
            return jsonify({
                "success": False,
                "error": "Se requieren entre 1 y 50 empresas para análisis en lote"
            }), 400
        
        # Simular procesamiento en lote
        time.sleep(len(companies) * 0.5)  # Simular tiempo por empresa
        
        results = []
        for company in companies:
            # Generar resultado mock para cada empresa
            mock_result = {
                "cuit": company.get("cuit", f"20{random.randint(10000000, 99999999)}1"),
                "razon_social": company.get("name", f"Empresa {random.randint(100, 999)} SRL"),
                "analysis_status": "completed",
                "compliance_score": random.uniform(0.6, 0.95),
                "risk_level": random.choice(["BAJO", "MEDIO", "ALTO"]),
                "processed_at": datetime.now().isoformat()
            }
            results.append(mock_result)
        
        return jsonify({
            "success": True,
            "batch_id": str(uuid.uuid4()),
            "processed_count": len(results),
            "results": results,
            "demo_mode": True,
            "processing_time": len(companies) * 0.5
        })
        
    except Exception as e:
        logger.error(f"Error en análisis en lote: {e}")
        return jsonify({"success": False, "error": "Error interno"}), 500

@app.route('/api/reports/dashboard', methods=['GET'])
def get_dashboard_data():
    """📊 Datos para dashboard ejecutivo"""
    
    # Generar métricas mock realistas
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    mock_dashboard = {
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        },
        "summary": {
            "total_analyses": random.randint(150, 500),
            "approved_suppliers": random.randint(100, 350),
            "rejected_suppliers": random.randint(10, 50),
            "pending_review": random.randint(5, 25),
            "avg_processing_time": random.uniform(2.5, 8.0)
        },
        "risk_distribution": {
            "BAJO": random.randint(60, 80),
            "MEDIO": random.randint(15, 25), 
            "ALTO": random.randint(5, 15)
        },
        "api_performance": {
            "afip_success_rate": random.uniform(0.92, 0.98),
            "bcra_success_rate": random.uniform(0.85, 0.95),
            "cnv_success_rate": random.uniform(0.88, 0.96),
            "uif_success_rate": random.uniform(0.90, 0.97)
        },
        "trends": {
            "daily_analyses": [random.randint(10, 40) for _ in range(7)],
            "weekly_growth": random.uniform(-0.05, 0.15),
            "compliance_improvement": random.uniform(0.02, 0.08)
        },
        "demo_mode": True,
        "generated_at": datetime.now().isoformat()
    }
    
    return jsonify({
        "success": True,
        "dashboard": mock_dashboard,
        "note": "Datos de demostración generados para el hackathon"
    })

@app.route('/api/mock/companies', methods=['GET'])
def get_mock_companies():
    """🏢 Listar empresas de prueba disponibles"""
    return jsonify({
        "success": True,
        "companies": MOCK_COMPANIES,
        "count": len(MOCK_COMPANIES),
        "demo_mode": True,
        "usage": "Usar estos CUITs para testing durante el hackathon"
    })

@app.route('/api/mock/status', methods=['GET']) 
def mock_status():
    """🔧 Estado del sistema RegTech mock"""
    return jsonify({
        "service": "IntegridAI Mock RegTech API",
        "version": "1.0.0-hackathon",
        "environment": "development",
        "mock_apis": {
            "afip": {"status": "simulated", "success_rate": "92-98%"},
            "bcra": {"status": "simulated", "success_rate": "85-95%"},
            "cnv": {"status": "simulated", "success_rate": "88-96%"},
            "uif": {"status": "simulated", "success_rate": "90-97%"}
        },
        "features": {
            "company_analysis": "automated",
            "batch_processing": "supported", 
            "dashboard_metrics": "real_time",
            "real_government_apis": False,
            "safe_for_development": True
        },
        "endpoints": {
            "/api/analyze/company": "Analyze single company",
            "/api/batch/analyze": "Batch analysis",
            "/api/reports/dashboard": "Dashboard data",
            "/api/mock/companies": "Test companies list"
        }
    })

if __name__ == '__main__':
    print("""
    🚀 IntegridAI HackAI 2025 - Mock RegTech API
    
    ⚠️  MODO DEMO - Solo para desarrollo
    🔒 Sin conexión a APIs gubernamentales reales
    🏛️ Simula AFIP, BCRA, CNV, UIF de forma segura
    🎓 Perfecto para hackathon y aprendizaje
    
    Endpoints disponibles:
    - GET  /health
    - POST /api/analyze/company
    - POST /api/batch/analyze  
    - GET  /api/reports/dashboard
    - GET  /api/mock/companies
    - GET  /api/mock/status
    
    Empresas de prueba disponibles:
    - CUIT: 20123456781 (Constructora Demo SA)
    - CUIT: 30234567892 (Servicios IT Ejemplo SRL) 
    - CUIT: 27345678903 (Consultoría Legal Mock)
    
    Iniciando servidor en http://localhost:5002
    """)
    
    app.run(host='0.0.0.0', port=5002, debug=True)