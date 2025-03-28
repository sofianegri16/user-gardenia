
import { supabase } from '@/integrations/supabase/client';
import { TeamEmotionalData } from '@/types/leader';

export interface AskAIPayload {
  user_role: string;
  team_state: {
    energy_avg: number;
    pressure_avg: number;
    climate_trend: string;
    recent_alerts: string[];
  };
  question: string;
}

export interface AskAIResponse {
  answer: string;
}

export interface AskAIError {
  message: string;
  type: 'quota' | 'connection' | 'auth' | 'unknown';
  detail?: string;
}

/**
 * Calls the ask-ai Edge Function to get AI assistant responses
 * @param payload The data containing user role, team state, and question
 * @returns The AI response with the answer
 */
export const askAI = async (payload: AskAIPayload): Promise<AskAIResponse> => {
  try {
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('ask-ai', {
      body: payload,
    });

    if (error) {
      console.error('Error calling ask-ai function:', error);
      
      // Handle specific connection errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network Error')) {
        throw {
          message: 'No se pudo conectar al asistente. Verifica tu conexión a internet.',
          type: 'connection'
        } as AskAIError;
      }
      
      // Handle auth errors
      if (error.status === 401) {
        throw {
          message: 'No tienes autorización para usar el asistente. Por favor, inicia sesión nuevamente.',
          type: 'auth'
        } as AskAIError;
      }
      
      // Generic error
      throw {
        message: error.message || 'Error al comunicarse con el asistente virtual',
        type: 'unknown',
        detail: error.context || ''
      } as AskAIError;
    }

    if (!data) {
      console.error('No data received from ask-ai function');
      throw {
        message: 'No se recibió respuesta del asistente virtual',
        type: 'unknown'
      } as AskAIError;
    }
    
    // Handle specific error types from the edge function
    if (data.error) {
      console.error('Error returned from ask-ai function:', data);
      
      if (data.errorType === 'quota_exceeded') {
        throw {
          message: data.error || 'El servicio de IA está temporalmente no disponible debido a cuota excedida. Por favor, intenta más tarde.',
          type: 'quota',
          detail: data.errorDetail || ''
        } as AskAIError;
      }
      
      if (data.errorType === 'configuration_error') {
        throw {
          message: data.error || 'Error de configuración en el servidor. Contacta al administrador.',
          type: 'unknown',
          detail: data.errorDetail || ''
        } as AskAIError;
      }
      
      if (data.errorType === 'openai_api_error') {
        throw {
          message: data.error || 'Error en el servicio de IA. Por favor, intenta más tarde.',
          type: 'unknown',
          detail: data.errorDetail || ''
        } as AskAIError;
      }

      if (data.errorType === 'auth') {
        throw {
          message: data.error || 'Error de autenticación. Por favor, inicia sesión nuevamente.',
          type: 'auth',
          detail: data.errorDetail || ''
        } as AskAIError;
      }
      
      throw {
        message: data.error || 'Error desconocido del asistente virtual',
        type: 'unknown',
        detail: data.errorDetail || ''
      } as AskAIError;
    }

    if (!data.answer) {
      console.error('Invalid response from ask-ai function:', data);
      throw {
        message: 'Respuesta inválida del asistente virtual',
        type: 'unknown'
      } as AskAIError;
    }

    return { answer: data.answer };
  } catch (error) {
    console.error('Error in askAI function:', error);
    
    // If the error is already formatted as AskAIError, rethrow it
    if (error.type) {
      throw error;
    }
    
    // Otherwise format as unknown error
    throw {
      message: error.message || 'Error inesperado al comunicarse con el asistente virtual',
      type: 'unknown',
      detail: error.toString()
    } as AskAIError;
  }
};

/**
 * Utility function to prepare team data for the AI assistant
 * @param teamData The team emotional data
 * @returns Formatted team state for the AI payload
 */
export const prepareTeamStateForAI = (teamData: TeamEmotionalData): AskAIPayload['team_state'] => {
  // Determine climate trend based on energy and mental pressure
  const climateTrend = determineClimateTrend(teamData);
  
  // Generate alerts based on thresholds
  const recentAlerts = generateAlerts(teamData);
  
  return {
    energy_avg: teamData.avg_energy,
    pressure_avg: teamData.avg_mental_pressure,
    climate_trend: climateTrend,
    recent_alerts: recentAlerts,
  };
};

/**
 * Determines the climate trend based on team data
 */
const determineClimateTrend = (teamData: TeamEmotionalData): string => {
  // Simplified algorithm: Considering energy good, pressure bad
  const wellbeingScore = teamData.avg_energy - teamData.avg_mental_pressure / 2;
  
  if (wellbeingScore > 3) return "positiva";
  if (wellbeingScore < 0) return "negativa";
  return "neutral";
};

/**
 * Generates alerts based on team data thresholds
 */
const generateAlerts = (teamData: TeamEmotionalData): string[] => {
  const alerts: string[] = [];
  
  // Energy alert
  if (teamData.avg_energy < 4) {
    alerts.push("baja energía");
  }
  
  // Mental pressure alert
  if (teamData.avg_mental_pressure > 7) {
    alerts.push("alta presión mental");
  }
  
  // Personal concerns alert
  if (teamData.avg_personal_concerns > 6) {
    alerts.push("preocupaciones personales elevadas");
  }
  
  // Achievements alert
  if (teamData.avg_achievements < 3) {
    alerts.push("logros reducidos");
  }
  
  return alerts;
};
