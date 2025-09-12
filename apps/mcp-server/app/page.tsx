export default function HomePage() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>
          IntegridAI MCP Server
        </h1>
        <p style={{ color: '#666', fontSize: '1.2rem' }}>
          Workflow Tools para Compliance Ley 27.401
        </p>
      </header>

      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2196F3', borderBottom: '2px solid #2196F3', paddingBottom: '0.5rem' }}>
            🛠️ Herramientas MCP Disponibles
          </h2>
          
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                🎮 simulate_ethics_case
              </h3>
              <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6' }}>
                Ejecuta un caso del FLAISimulator end-to-end y devuelve un informe ejecutivo 
                con recomendaciones conforme Ley 27.401.
              </p>
              <details>
                <summary style={{ cursor: 'pointer', color: '#2196F3' }}>
                  Ver parámetros
                </summary>
                <pre style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '1rem', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}>
{`{
  "persona": "catalina" | "mentor" | "ana" | "carlos",
  "caseId": "string",
  "userId": "string (opcional)",
  "locale": "string (por defecto: es-AR)"
}`}
                </pre>
              </details>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                📋 run_integrity_survey
              </h3>
              <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6' }}>
                Ejecuta la Encuesta de Integridad completa, genera artefactos CSV/JSON 
                y resumen ejecutivo conforme Ley 27.401.
              </p>
              <details>
                <summary style={{ cursor: 'pointer', color: '#2196F3' }}>
                  Ver parámetros
                </summary>
                <pre style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '1rem', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}>
{`{
  "userId": "string (opcional)",
  "delivery": "csv" | "json" | "both" (por defecto: both),
  "notifyEmails": ["email@domain.com"] (opcional)
}`}
                </pre>
              </details>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2196F3', borderBottom: '2px solid #2196F3', paddingBottom: '0.5rem' }}>
            🔗 Integración MCP
          </h2>
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
            <p><strong>Endpoint MCP:</strong> <code>/api/mcp/http</code></p>
            <p><strong>Protocol:</strong> Model Context Protocol (MCP)</p>
            <p><strong>Transport:</strong> HTTP/Server-Sent Events</p>
            <p><strong>Authentication:</strong> OAuth 2.0 con scopes específicos</p>
          </div>
        </section>

        <section>
          <h2 style={{ color: '#2196F3', borderBottom: '2px solid #2196F3', paddingBottom: '0.5rem' }}>
            ⚖️ Cumplimiento Legal
          </h2>
          <div style={{ marginTop: '1.5rem' }}>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Ley 27.401 - Régimen de Responsabilidad Penal Empresaria</li>
              <li>Art. 22 - Programa de Integridad</li>
              <li>Art. 23 - Elementos del Programa de Integridad</li>
              <li>Auditoría completa y trazabilidad de ejecuciones</li>
              <li>Idempotencia y manejo de errores</li>
            </ul>
          </div>
        </section>
      </main>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        padding: '2rem 0', 
        borderTop: '1px solid #e0e0e0',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>© 2025 IntegridAI - MCP Server v1.0.0</p>
        <p>Plataforma RegTech especializada en Ley 27.401</p>
      </footer>
    </div>
  )
}