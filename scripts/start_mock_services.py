#!/usr/bin/env python3
"""
🚀 IntegridAI HackAI 2025 - Mock Services Starter
Script para iniciar todos los servicios mock para el hackathon

Inicia:
- Mock Conversational API (Puerto 5001)
- Mock RegTech API (Puerto 5002)  
- Mock Dashboard (Puerto 5003)
"""

import subprocess
import sys
import time
import os
from pathlib import Path

def start_service(script_path: str, port: int, service_name: str):
    """Iniciar un servicio mock"""
    try:
        print(f"🚀 Iniciando {service_name} en puerto {port}...")
        
        # Cambiar al directorio del script
        script_dir = os.path.dirname(script_path)
        if script_dir:
            os.chdir(script_dir)
        
        # Iniciar el servicio
        process = subprocess.Popen([
            sys.executable, script_path
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Dar tiempo para que inicie
        time.sleep(2)
        
        # Verificar si está corriendo
        if process.poll() is None:
            print(f"✅ {service_name} iniciado correctamente en puerto {port}")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Error iniciando {service_name}:")
            print(f"   STDOUT: {stdout.decode()}")
            print(f"   STDERR: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"❌ Excepción iniciando {service_name}: {e}")
        return None

def main():
    """Función principal"""
    print("""
    🚀 IntegridAI HackAI 2025 - Mock Services Starter
    ================================================
    
    Iniciando todos los servicios mock para desarrollo...
    
    """)
    
    # Obtener directorio base
    base_dir = Path(__file__).parent.parent
    api_dir = base_dir / "api" / "mock"
    
    # Servicios a iniciar
    services = [
        {
            "script": api_dir / "conversational_mock.py",
            "port": 5001,
            "name": "Conversational API Mock"
        },
        {
            "script": api_dir / "regtech_mock.py", 
            "port": 5002,
            "name": "RegTech API Mock"
        },
        {
            "script": base_dir / "api" / "unified_agents_api.py",
            "port": 5003,
            "name": "Unified Agents API (Catalina + Alexis)"
        }
    ]
    
    processes = []
    
    # Iniciar cada servicio
    for service in services:
        if service["script"].exists():
            process = start_service(
                str(service["script"]), 
                service["port"], 
                service["name"]
            )
            if process:
                processes.append({
                    "process": process,
                    "name": service["name"], 
                    "port": service["port"]
                })
        else:
            print(f"⚠️  Archivo no encontrado: {service['script']}")
    
    if not processes:
        print("❌ No se pudieron iniciar servicios.")
        return
    
    print(f"""
    ✅ Servicios iniciados exitosamente!
    
    📡 URLs disponibles:
    """)
    
    for proc in processes:
        print(f"   - {proc['name']}: http://localhost:{proc['port']}")
        print(f"     Health check: http://localhost:{proc['port']}/health")
    
    print(f"""
    
    🛠️  Para desarrollo:
    - Usa estas URLs como base para tus APIs
    - Todos los endpoints devuelven datos mock seguros
    - No hay conexiones reales a APIs gubernamentales
    
    ⌨️  Presiona Ctrl+C para detener todos los servicios
    """)
    
    try:
        # Mantener corriendo hasta Ctrl+C
        while True:
            time.sleep(1)
            
            # Verificar si algún proceso murió
            for i, proc in enumerate(processes[:]):
                if proc["process"].poll() is not None:
                    print(f"⚠️  {proc['name']} se detuvo inesperadamente")
                    processes.remove(proc)
            
            if not processes:
                print("❌ Todos los servicios se detuvieron")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Deteniendo servicios...")
        
        # Terminar todos los procesos
        for proc in processes:
            try:
                proc["process"].terminate()
                proc["process"].wait(timeout=5)
                print(f"✅ {proc['name']} detenido")
            except:
                proc["process"].kill()
                print(f"🔥 {proc['name']} forzado a detenerse")
        
        print("👋 Todos los servicios detenidos. ¡Hasta luego!")

if __name__ == "__main__":
    main()