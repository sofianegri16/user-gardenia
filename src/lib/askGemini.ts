
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Invokes Gemini API via Supabase Edge Function
 * @param prompt - The user input to send to Gemini
 * @param emotionalData - Optional emotional data to provide context
 * @returns The AI response as a string
 */
export async function askGemini(prompt: string, emotionalData?: any) {
  try {
    console.log('Calling askGemini with prompt:', prompt);
    
    const { data, error } = await supabase.functions.invoke('ask-gemini', {
      body: {
        prompt: prompt,
        emotionalData: emotionalData || null
      }
    });

    if (error) {
      console.error('Error calling ask-gemini function:', error);
      throw error;
    }

    if (!data || typeof data.response !== 'string') {
      console.error('Invalid response format from ask-gemini:', data);
      throw new Error('Invalid response format from AI');
    }

    return data.response;
  } catch (error: any) {
    console.error('Error in askGemini function:', {
      message: error.message || 'Unknown error',
      type: error.name || 'unknown',
      detail: error.context || {}
    });
    
    // Return error message instead of throwing
    return `Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.`;
  }
}
