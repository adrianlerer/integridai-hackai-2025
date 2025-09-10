// Netlify Function for FLAISimulator Data Collection
const { createClient } = require('@supabase/supabase-js');

// Configuración (estas variables se establecen en Netlify Dashboard)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Source, X-Version',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validar estructura básica
    if (!data.data || !data.timestamp) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid data structure' })
      };
    }

    // Si tenemos Supabase configurado, guardar ahí
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Guardar datos de sesiones
      if (data.data.game_sessions && data.data.game_sessions.length > 0) {
        for (const session of data.data.game_sessions) {
          await supabase
            .from('game_sessions')
            .upsert({
              session_id: session.session_id,
              timestamp: new Date(session.timestamp).toISOString(),
              demographics: session.demographics,
              performance: session.performance,
              decisions: session.decisions,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'session_id'
            });
        }
      }
      
      // Guardar analytics virales
      if (data.data.viral_analytics) {
        const { share_events, page_visits, referrals } = data.data.viral_analytics;
        
        // Share events
        if (share_events.length > 0) {
          for (const event of share_events) {
            await supabase
              .from('viral_events')
              .upsert({
                event_id: `${event.session_id}_${event.timestamp}`,
                type: 'share',
                platform: event.platform,
                context: event.context,
                timestamp: new Date(event.timestamp).toISOString(),
                session_id: event.session_id,
                url: event.url,
                referrer: event.referrer
              }, {
                onConflict: 'event_id'
              });
          }
        }
        
        // Page visits
        if (page_visits.length > 0) {
          for (const visit of page_visits) {
            await supabase
              .from('page_visits')
              .upsert({
                visit_id: `${visit.session_id}_${visit.timestamp}`,
                page: visit.page,
                timestamp: new Date(visit.timestamp).toISOString(),
                referrer: visit.referrer,
                user_agent: visit.user_agent,
                session_id: visit.session_id
              }, {
                onConflict: 'visit_id'
              });
          }
        }
      }
      
      // Guardar snapshot agregado
      await supabase
        .from('data_snapshots')
        .insert({
          export_id: data.export_id,
          timestamp: new Date(data.timestamp).toISOString(),
          version: data.version,
          aggregated_stats: data.data.aggregated_stats,
          cultural_insights: data.data.cultural_insights,
          raw_data_size: JSON.stringify(data).length
        });
    }

    // Log básico (siempre disponible)
    console.log(`📊 FLAISimulator Data Received:
      - Sessions: ${data.data.game_sessions?.length || 0}
      - Total Decisions: ${data.data.aggregated_stats?.total_decisions || 0}
      - Shares: ${data.data.viral_analytics?.share_events?.length || 0}
      - Export ID: ${data.export_id}
      - Timestamp: ${new Date(data.timestamp).toISOString()}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Data received successfully',
        export_id: data.export_id,
        processed_at: new Date().toISOString(),
        stats: {
          sessions: data.data.game_sessions?.length || 0,
          decisions: data.data.aggregated_stats?.total_decisions || 0,
          shares: data.data.viral_analytics?.share_events?.length || 0
        }
      })
    };

  } catch (error) {
    console.error('Error processing data:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

// Para desarrollo local, también exportar función simple para backup beacon
exports.beaconHandler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Para beacon, simplemente loggear
    console.log('📡 Beacon backup received:', new Date().toISOString());
    
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};