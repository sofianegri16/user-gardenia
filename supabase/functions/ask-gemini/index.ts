
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { team_state, question } = await req.json();
    console.log('📥 Request received:', { team_state, question });
    console.log('👤 User ID:', user.id);

    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Missing required question field' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key is not configured' }),
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
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
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
        }
      );

      const responseTime = Date.now() - startTime;
      console.log(`⚡ Gemini response time: ${responseTime}ms`);
      console.log(`📦 Gemini response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        const fullError = {
          message: `Error al llamar a la API de Gemini`,
          status: response.status,
          error: errorData.error,
          full: errorData
        };

        console.error('❌ Gemini API error response:', fullError);

        // 🔥 Mostrar el error literal en pantalla
        return new Response(
          new TextEncoder().encode(`ERROR desde Gemini:\n\n${JSON.stringify(fullError, null, 2)}`),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } }
        );
      }

      const data = await response.json();
      console.log('✅ Gemini API full response:', JSON.stringify(data));

      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!answer) {
        return new Response(
          JSON.stringify({ error: 'Respuesta vacía o inválida de Gemini', full: data }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ Valid response:', answer);

      return new Response(
        JSON.stringify({ answer }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (geminiError) {
      console.error('🔥 Error llamando a Gemini:', geminiError);
      return new Response(
        JSON.stringify({
          error: 'Error al comunicarse con el servicio de IA de Gemini',
          details: geminiError.message,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('💥 Error general en ask-gemini function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Ha ocurrido un error inesperado' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
