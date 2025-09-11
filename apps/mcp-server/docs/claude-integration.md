# Integración con Claude MCP

## 🔌 Configuración Claude Desktop

### 1. **Instalación del Cliente MCP**

Crear archivo de configuración para Claude Desktop:

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "integridai": {
      "command": "npx",
      "args": [
        "@integridai/mcp-client",
        "--server-url",
        "https://integridai-mcp.netlify.app/.netlify/functions/mcp-handler"
      ],
      "env": {
        "MCP_OAUTH_TOKEN": "your_oauth_token_here",
        "MCP_SERVER_URL": "https://integridai-mcp.netlify.app/.netlify/functions/mcp-handler"
      }
    }
  }
}
```

### 2. **Configuración de Autenticación**

#### Obtener Token OAuth

```bash
# 1. Registrar aplicación
curl -X POST https://oauth.mcpauth.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IntegridAI Claude Integration",
    "scopes": ["ethics:simulate", "survey:run", "artifacts:read"],
    "redirect_uri": "https://your-domain.com/callback"
  }'

# 2. Autorizar y obtener token
# (Seguir flujo OAuth estándar)
```

## 💬 Ejemplos de Conversaciones

### **Ejemplo 1: Simulación Ética Completa**

**Usuario:**
```
Necesito ejecutar una simulación ética para el caso "CORRUPCIÓN-COMPRAS-2024" 
usando el personaje Catalina Oportunista. Quiero el informe ejecutivo completo 
con recomendaciones específicas para nuestro programa de integridad.
```

**Claude responderá:**
```
Te ayudo a ejecutar esa simulación ética. Voy a usar la herramienta 
simulate_ethics_case para procesar el caso completo.

[Ejecuta herramienta]

✅ **Simulación Completada**

**Resumen:** Simulación ética completada para caso CORRUPCIÓN-COMPRAS-2024 con 
personaje Catalina Oportunista. Se procesaron 5 decisiones éticas con análisis 
conforme a Ley 27.401. Recomendaciones específicas de capacitación y controles 
internos incluidas en el informe completo.

**📄 Informe Ejecutivo:** [Enlace seguro al reporte]
- **ID de Ejecución:** sim_abc123xyz789
- **Tiempo de Procesamiento:** 3,247 ms
- **Referencias Legales Aplicadas:**
  - Ley 27.401 - Régimen de Responsabilidad Penal Empresaria
  - Art. 22 - Programa de Integridad
  - Art. 7 - Delitos precedentes
  - Art. 23 inc. c) - Capacitación periódica

**💡 Recomendaciones Clave:**
1. Implementar capacitación específica en procesos de compras
2. Revisar controles internos de autorización
3. Establecer canales de denuncia anónima
4. Documentar políticas anti-corrupción específicas

El informe completo está disponible por 24 horas en el enlace proporcionado.
```

### **Ejemplo 2: Evaluación de Integridad Organizacional**

**Usuario:**
```
Quiero ejecutar una evaluación completa de integridad para nuestra organización. 
Necesito los resultados en CSV y JSON, y que se envíe una notificación a 
compliance@miempresa.com cuando esté listo.
```

**Claude responderá:**
```
Perfecto, voy a ejecutar una evaluación completa de integridad organizacional 
con exportación en ambos formatos y notificación automática.

[Ejecuta herramienta]

✅ **Evaluación de Integridad Completada**

**📊 Resultados Generales:**
- **Puntuación Total:** 87/100
- **Nivel de Riesgo:** Bajo
- **Secciones Evaluadas:** 6

**📈 Puntuaciones por Sección:**
- Gobierno Corporativo: 92/100
- Gestión de Riesgos: 85/100  
- Cumplimiento Normativo: 89/100
- Código de Ética: 90/100
- Capacitación: 78/100 ⚠️
- Monitoreo y Auditoría: 88/100

**📄 Artefactos Generados:**
- **CSV:** [Enlace de descarga] (Válido por 90 días)
- **JSON:** [Enlace de descarga] (Válido por 90 días)

**🔍 Áreas de Mejora Identificadas:**
1. **Capacitación (78 pts):** Incrementar frecuencia de entrenamientos éticos
2. Implementar programa integral de mejora de compliance

**📧 Notificación enviada a:** compliance@miempresa.com

**Resumen Ejecutivo:** Evaluación de integridad completada con puntuación total 
de 87/100. Evaluadas 6 secciones de compliance con nivel de riesgo Bajo. 
1 área requiere atención inmediata. 2 recomendación(es) específica(s) generadas 
conforme Ley 27.401.
```

### **Ejemplo 3: Comparación de Personajes**

**Usuario:**
```
Quiero comparar cómo responden diferentes personajes al mismo caso ético. 
Ejecuta el caso "CONFLICTO-INTERÉS-001" con Ana Auditora y Dr. Mentor para 
ver las diferencias en el análisis.
```

**Claude responderá:**
```
Excelente idea para obtener perspectivas complementarias. Voy a ejecutar el 
mismo caso con ambos personajes para comparar enfoques.

[Ejecuta primera simulación con Ana Auditora]
[Ejecuta segunda simulación con Dr. Mentor]

✅ **Análisis Comparativo Completado**

## 🔍 **Ana Auditora - Enfoque Operacional**
- **Puntuación de Riesgo:** Alto
- **Enfoque Principal:** Controles internos y procedimientos
- **Recomendaciones:** 
  - Implementar segregación de funciones
  - Crear matrices de autorización
  - Establecer reportes de excepción automáticos

📄 [Informe Ana Auditora]

## 🎓 **Dr. Mentor - Enfoque Académico/Legal**  
- **Puntuación de Riesgo:** Medio-Alto
- **Enfoque Principal:** Marco normativo y precedentes legales
- **Recomendaciones:**
  - Revisar políticas conforme Art. 23 Ley 27.401
  - Documentar decisiones para defensa futura
  - Capacitar en aspectos legales específicos

📄 [Informe Dr. Mentor]

## 📊 **Síntesis Comparativa:**

| Aspecto | Ana Auditora | Dr. Mentor |
|---------|--------------|------------|
| **Perspectiva** | Operacional/Práctica | Legal/Académica |
| **Prioridad** | Controles inmediatos | Fundamentos legales |
| **Riesgo Percibido** | Alto (operacional) | Medio-Alto (legal) |
| **Soluciones** | Procesos y sistemas | Políticas y capacitación |

**💡 Recomendación Integrada:** Combinar ambos enfoques para una estrategia 
integral que incluya tanto controles operacionales robustos como fundamentos 
legales sólidos.
```

## 🚀 Casos de Uso Avanzados

### **Workflow Automatizado para Compliance Officer**

**Prompt Template:**
```
Actúa como mi asistente de compliance. Ejecutá las siguientes tareas de manera 
secuencial:

1. Ejecutá una evaluación de integridad completa
2. Si el score total es menor a 80, ejecutá simulaciones éticas específicas 
   para las secciones con menor puntuación
3. Generá un plan de acción consolidado con todos los hallazgos
4. Exportá todo en formato ejecutivo para el directorio

Comenzá cuando confirmes que entendiste la secuencia.
```

### **Investigación de Incidentes**

**Prompt Template:**
```
Tenemos un reporte de posible conflicto de interés en el área de compras. 
Necesito que:

1. Ejecutes simulación con Catalina (tentaciones) para el caso "COMPRAS-CI-2024"
2. Ejecutes simulación con Ana (controles) para el mismo caso  
3. Compares los resultados con nuestra última evaluación de integridad
4. Sugieras acciones correctivas específicas

El objetivo es tener un análisis completo para presentar al comité de ética.
```

### **Preparación para Auditoría Externa**

**Prompt Template:**
```
Nos van a auditar el programa de integridad la próxima semana. Preparame un 
paquete completo que incluya:

1. Evaluación de integridad actualizada con todos los formatos
2. Evidencia de capacitación (simulaciones éticas recientes)  
3. Análisis de casos por cada tipo de riesgo identificado
4. Plan de mejoras con cronograma

Todo debe estar respaldado con referencias específicas a Ley 27.401.
```

## 🔧 Configuración Avanzada

### **Variables de Entorno Claude**

```env
# Configuración de comportamiento
MCP_INTEGRIDAI_AUTO_RETRY=true
MCP_INTEGRIDAI_MAX_RETRIES=3
MCP_INTEGRIDAI_TIMEOUT=60000

# Configuración de outputs
MCP_INTEGRIDAI_VERBOSE_LOGS=false
MCP_INTEGRIDAI_SAVE_ARTIFACTS=true
MCP_INTEGRIDAI_DEFAULT_LOCALE=es-AR

# Configuración de seguridad
MCP_INTEGRIDAI_VALIDATE_CERTS=true
MCP_INTEGRIDAI_RATE_LIMIT_RESPECT=true
```

### **Manejo de Errores**

Claude automáticamente manejará errores comunes como:

- ✅ **Rate limiting**: Reintento automático con backoff
- ✅ **Tokens expirados**: Refresh automático si está configurado
- ✅ **Timeouts**: Reintento con parámetros ajustados
- ✅ **Validation errors**: Mensajes descriptivos para corrección

### **Personalización de Outputs**

```json
// Configuración de formato de respuesta
{
  "integridai_config": {
    "response_format": "detailed", // "brief" | "detailed" | "executive"
    "include_legal_refs": true,
    "include_artifacts_preview": true,
    "auto_summarize": true
  }
}
```

## 📋 Checklist de Integración

### Pre-requisitos
- [ ] Token OAuth válido con scopes correctos
- [ ] Claude Desktop actualizado (v1.2+)
- [ ] Configuración MCP en claude_desktop_config.json
- [ ] Conexión de red estable

### Validación
- [ ] Test de conexión exitoso: `simulate_ethics_case` con caso simple
- [ ] Test de autenticación: verificar scopes y permisos
- [ ] Test de artifacts: verificar acceso a URLs generadas
- [ ] Test de idempotencia: mismo request dos veces

### Producción
- [ ] Monitorear rate limits y ajustar uso
- [ ] Configurar alertas para errores recurrentes
- [ ] Revisar logs de auditoría regularmente
- [ ] Mantener tokens actualizados

## 🆘 Troubleshooting

### Errores Comunes

**"Tool not found"**
```
- Verificar configuración MCP en claude_desktop_config.json
- Confirmar que el servidor esté disponible
- Revisar logs de Claude Desktop
```

**"Unauthorized"**
```
- Verificar token OAuth no expirado
- Confirmar scopes requeridos
- Revisar configuración de autenticación
```

**"Rate limit exceeded"**
```
- Esperar ventana de rate limit
- Configurar reintentos automáticos
- Considerar distribución temporal de requests
```

**"Artifact not accessible"**
```
- URLs firmadas tienen TTL limitado
- Re-ejecutar herramienta para nueva URL
- Verificar permisos de artifacts:read
```

### Logs y Debugging

```bash
# Habilitar logs verbosos en Claude
export MCP_INTEGRIDAI_DEBUG=true

# Monitorear requests en tiempo real
curl -H "Authorization: Bearer $TOKEN" \
     https://integridai-mcp.vercel.app/api/debug/logs
```

---

Para más información técnica, consultar el [README principal](../README.md) y la [documentación completa](https://docs.integridai.com.ar).