
export type WeatherType = 'sunny' | 'cloudy' | 'rainy';
export type WeatherEmotions = Record<WeatherType, string[]>;

export interface GardenCheckin {
  id: string;
  user_id: string;
  check_in_date: string;
  energy: number;
  mental_pressure: number;
  personal_concerns: number;
  achievements: number;
  exceptional_day: number;
  weather: WeatherType;
  created_at: string;
  teragesto_accepted?: boolean | null;
  teragesto_shown?: string | null;
}
