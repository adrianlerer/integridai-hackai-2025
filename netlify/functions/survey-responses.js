// Netlify Function para recibir respuestas de encuestas
// IntegridAI - Survey Data Collection Endpoint

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const surveyData = JSON.parse(event.body);
        
        // Validate required fields
        if (!surveyData.companyName || !surveyData.contactEmail) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required fields: companyName and contactEmail are required' 
                })
            };
        }

        // Add server processing metadata
        const processedData = {
            ...surveyData,
            serverMetadata: {
                receivedAt: new Date().toISOString(),
                userAgent: event.headers['user-agent'],
                clientIP: event.headers['client-ip'] || event.headers['x-forwarded-for'],
                processedBy: 'integridai-survey-endpoint'
            }
        };

        // Log the response for monitoring (in production, send to database)
        console.log('📋 Survey Response Received:', {
            responseId: processedData.responseId,
            company: processedData.companyName,
            sector: processedData.sector,
            timestamp: processedData.serverMetadata.receivedAt
        });

        // In a production environment, you would:
        // 1. Save to database (Supabase, MongoDB, etc.)
        // 2. Send confirmation email
        // 3. Trigger analytics events
        // 4. Validate data integrity
        
        // For now, we'll simulate successful processing
        await simulateDataProcessing(processedData);

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Survey response received and processed successfully',
                responseId: processedData.responseId,
                timestamp: processedData.serverMetadata.receivedAt
            })
        };

    } catch (error) {
        console.error('❌ Error processing survey response:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error while processing survey response',
                message: error.message
            })
        };
    }
};

// Simulate data processing (replace with real database operations)
async function simulateDataProcessing(data) {
    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, implement:
    // await saveToDatabase(data);
    // await sendConfirmationEmail(data.contactEmail, data.responseId);
    // await triggerAnalytics(data);
    
    return true;
}

// Example database save function (implement based on your chosen database)
/*
async function saveToDatabase(surveyData) {
    // Example with Supabase
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
        process.env.SUPABASE_URL, 
        process.env.SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase
        .from('survey_responses')
        .insert([surveyData]);
    
    if (error) throw error;
    return data;
}

async function sendConfirmationEmail(email, responseId) {
    // Example with SendGrid or similar
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to: email,
        from: 'surveys@integridai.com.ar',
        subject: 'Confirmación de Encuesta de Integridad - IntegridAI',
        html: `
            <h2>¡Gracias por completar nuestra encuesta!</h2>
            <p>Su respuesta ha sido registrada con el ID: <strong>${responseId}</strong></p>
            <p>Nos pondremos en contacto con usted pronto.</p>
            <br>
            <p>Equipo IntegridAI</p>
        `
    };
    
    await sgMail.send(msg);
}
*/