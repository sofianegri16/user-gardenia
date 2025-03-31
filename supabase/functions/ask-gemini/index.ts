
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function will be run when the edge function is called
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header found');
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized: No Authorization header',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized: Invalid user',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request body
    const { team_state, question } = await req.json();
    
    // Log the incoming request for debugging
    console.log('Request received:', { team_state, question });
    console.log('User ID:', user.id);
    
    // Validate request
    if (!question) {
      console.error('Missing required question field');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error('Gemini API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key is not configured',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare context for Gemini
    const systemPrompt = `Eres un asistente especializado para líderes de equipos que monitorean el bienestar emocional de sus equipos.
    Debes ser empático, humano y ofrecer consejos prácticos basados en el contexto del equipo.
    Tu tono debe ser cálido pero profesional.
    Tus respuestas deben ser concisas (máximo 3-4 oraciones) y directas al punto, enfocándote en soluciones prácticas.
    
    Contexto del equipo:
    - Nivel de energía promedio: ${team_state?.energy_avg || 'No disponible'}
    - Nivel de presión mental promedio: ${team_state?.pressure_avg || 'No disponible'}
    - Tendencia del clima emocional: ${team_state?.climate_trend || 'No disponible'}
    - Alertas recientes: ${team_state?.recent_alerts ? team_state.recent_alerts.join(', ') : 'Ninguna'}
    
    ${question}`;

    const startTime = Date.now();
    
    try {
      console.log('Sending request to Gemini API with prompt:', systemPrompt);
      console.log('Using endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');
      
      // Call Gemini API with the CORRECT endpoint format and request structure
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      const responseTime = Date.now() - startTime;
      console.log(`Gemini response time: ${responseTime}ms`);
      console.log(`Gemini response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error response:', errorData);
        
        return new Response(
          JSON.stringify({ 
            error: `Error al llamar a la API de Gemini: ${errorData.error?.message || 'Error desconocido'}`,
            details: JSON.stringify(errorData),
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const data = await response.json();
      console.log('Gemini API full response:', JSON.stringify(data));
      
      // Extract the answer from Gemini response using the correct v1beta response structure
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!answer) {
        console.error('Invalid or empty response from Gemini:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Respuesta vacía o inválida de Gemini',
            details: JSON.stringify(data),
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Valid response successfully generated:', answer);
      
      // Return the answer with explicit status and headers
      return new Response(
        JSON.stringify({ answer }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (geminiError) {
      console.error('Error calling Gemini API:', geminiError);
      return new Response(
        JSON.stringify({ 
          error: 'Error al comunicarse con el servicio de IA de Gemini', 
          details: geminiError.message,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error in ask-gemini function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Ha ocurrido un error inesperado',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
