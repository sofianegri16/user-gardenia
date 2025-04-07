import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { team_state, question } = await req.json();

    const geminiApiKey = "AIzaSyBCkzEJ1w8TjKK_CvYntiAA7WXesNv9BqU"; // tu API key

    const systemPrompt = `Sos un asistente experto en bienestar emocional en entornos laborales.
Tu tarea es analizar brevemente el estado emocional de un equipo y brindarle al líder 2 o 3 sugerencias empáticas, claras y aplicables hoy mismo.

Tu tono debe ser humano, cálido y profesional. No uses lenguaje técnico. Sé directo/a, amable y útil.

Información del equipo:
- Nivel de energía: ${team_state?.energy_avg || 'No disponible'}
- Presión mental: ${team_state?.pressure_avg || 'No disponible'}
- Clima emocional: ${team_state?.climate_trend || 'No disponible'}
- Alertas recientes: ${team_state?.recent_alerts?.join(', ') || 'Ninguna'}

Pregunta del líder: ${question}

Cerrá siempre con una frase amable como:  
"Tu acompañamiento hace la diferencia. Escuchar con empatía es el mejor comienzo."`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${geminiApiKey}`
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

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Respuesta vacía de Gemini";

    return new Response(answer, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    return new Response("Error inesperado: " + (error.message || error), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});
