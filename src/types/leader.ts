
import { WeatherType } from './garden';

export interface TeamEmotionalData {
  role: string;
  check_in_date: string;
  member_count: number;
  avg_energy: number;
  avg_mental_pressure: number;
  avg_personal_concerns: number;
  avg_achievements: number;
  avg_exceptional_day: number;
  most_common_weather: WeatherType;
}

export interface EmotionalRecognition {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  recognition_date: string;
  sender_name?: string;
}
