
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
          errorType: 'auth'
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
          errorType: 'auth'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request body
    const { user_role, team_state, question } = await req.json();
    
    // Log the incoming request for debugging
    console.log('Request received:', { user_role, team_state, question });
    console.log('User ID:', user.id);
    
    // Validate request
    if (!question) {
      console.error('Missing required question field');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          errorType: 'validation'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get Gemini API key from environment
    const geminiApiKey = "AIzaSyBCkzEJ1w8TjKK_CvYntiAA7WXesNv9BqU"; // Using the provided API key
    if (!geminiApiKey) {
      console.error('Gemini API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key is not configured',
          errorType: 'configuration_error'
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
    - Alertas recientes: ${team_state?.recent_alerts ? team_state.recent_alerts.join(', ') : 'Ninguna'}`;

    const startTime = Date.now();
    
    try {
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: question }
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
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        
        // Generic API error
        return new Response(
          JSON.stringify({ 
            error: `Error al llamar a la API de Gemini: ${errorData.error?.message || 'Error desconocido'}`,
            errorDetail: JSON.stringify(errorData),
            errorType: 'gemini_api_error'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const data = await response.json();
      
      // Extract the answer from Gemini response
      const answer = data.candidates && 
                     data.candidates[0] && 
                     data.candidates[0].content && 
                     data.candidates[0].content.parts && 
                     data.candidates[0].content.parts[0] && 
                     data.candidates[0].content.parts[0].text;
      
      if (!answer) {
        console.error('Invalid response from Gemini:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Respuesta inválida de Gemini',
            errorDetail: JSON.stringify(data),
            errorType: 'invalid_response'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Response successfully generated');
      
      // Return the answer
      return new Response(
        JSON.stringify({ answer }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (geminiError) {
      console.error('Error calling Gemini:', geminiError);
      return new Response(
        JSON.stringify({ 
          error: 'Error al comunicarse con el servicio de IA de Gemini', 
          errorDetail: geminiError.message,
          errorType: 'api_call_error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error in ask-gemini function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Ha ocurrido un error inesperado',
        errorType: 'unknown_error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
