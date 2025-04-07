
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
    
    console.log('Request received:', { team_state, question });
    console.log('User ID:', user.id);
    
    if (!question) {
      console.error('Missing required question field');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    const systemPrompt = `Sos un asistente experto en bienestar emocional en entornos laborales.
Tu tarea es analizar brevemente el estado emocional de un equipo y brindarle al líder 2 o 3 sugerencias empáticas, claras y aplicables hoy mismo.

Tu tono debe ser humano, cálido y profesional. No uses lenguaje técnico. Sé directo/a, amable y útil.

Información del equipo:
- Nivel de energía: ${team_state?.energy_avg || 'No disponible'}
- Presión mental: ${team_state?.pressure_avg || 'No disponible'}
- Clima emocional: ${team_state?.climate_trend || 'No disponible'}
- Alertas recientes: ${team_state?.recent_alerts ? team_state.recent_alerts.join(', ') : 'Ninguna'}

Pregunta del líder: ${question}

Cerrá siempre con una frase amable como:  
"Tu acompañamiento hace la diferencia. Escuchar con empatía es el mejor comienzo."`;

    const startTime = Date.now();

    try {
      console.log('Sending request to Gemini API with prompt:', systemPrompt);
      console.log('Using endpoint: https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
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

