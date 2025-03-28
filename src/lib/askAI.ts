
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
      throw new Error(error.message || 'Error al comunicarse con el asistente virtual');
    }

    if (!data || !data.answer) {
      console.error('Invalid response from ask-ai function:', data);
      throw new Error('Respuesta inválida del asistente virtual');
    }

    return { answer: data.answer };
  } catch (error) {
    console.error('Error in askAI function:', error);
    throw error;
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
