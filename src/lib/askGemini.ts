
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Invokes Gemini API via Supabase Edge Function
 * @param prompt - The user input to send to Gemini
 * @param emotionalData - Optional emotional data to provide context
 * @returns The AI response as a string
 */
export async function askGemini(prompt: string, emotionalData?: any): Promise<string> {
  try {
    console.log('Calling askGemini with prompt:', prompt);
    console.log('Emotional data being sent:', emotionalData);
    
    if (!prompt || prompt.trim() === '') {
      console.error('Empty prompt provided to askGemini');
      return 'Error: Se requiere una pregunta para el asistente';
    }
    
    const { data, error } = await supabase.functions.invoke('ask-gemini', {
      body: {
        question: prompt.trim(),
        team_state: emotionalData || null
      }
    });

    console.log('Response received from ask-gemini:', data);

    if (error) {
      console.error('Error calling ask-gemini function:', error);
      return `Error: ${error.message || 'Hubo un problema conectando con el asistente IA'}`;
    }

    if (!data || typeof data.answer !== 'string') {
      console.error('Invalid response format from ask-gemini:', data);
      return 'Error: Formato de respuesta inválido desde el asistente IA';
    }

    return data.answer;
  } catch (error: any) {
    console.error('Error in askGemini function:', {
      message: error.message || 'Unknown error',
      type: error.name || 'unknown',
      detail: error.context || {}
    });
    
    // Return error message as string
    return `Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.`;
  }
}
