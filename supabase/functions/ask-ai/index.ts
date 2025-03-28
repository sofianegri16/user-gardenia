
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
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No Authorization header' }),
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
        JSON.stringify({ error: 'Unauthorized: Invalid user' }),
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
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          errorType: 'configuration_error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare context for OpenAI
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
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using a more affordable model to avoid quota issues
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      const responseTime = Date.now() - startTime;
      console.log(`OpenAI response time: ${responseTime}ms`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        
        // Check for quota exceeded error
        if (errorData.error && errorData.error.code === 'insufficient_quota') {
          return new Response(
            JSON.stringify({ 
              error: 'El servicio de IA está temporalmente no disponible por límites de uso. Por favor, inténtalo más tarde.',
              errorType: 'quota_exceeded'
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'Error al llamar a la API de OpenAI',
            details: errorData,
            errorType: 'openai_api_error'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const data = await response.json();
      const answer = data.choices[0]?.message?.content;
      
      if (!answer) {
        console.error('Invalid response from OpenAI:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Respuesta inválida de OpenAI',
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
    } catch (openAIError) {
      console.error('Error calling OpenAI:', openAIError);
      return new Response(
        JSON.stringify({ 
          error: 'Error al comunicarse con el servicio de IA', 
          details: openAIError.message,
          errorType: 'api_call_error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error in ask-ai function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Ha ocurrido un error inesperado',
        errorType: 'unknown_error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
