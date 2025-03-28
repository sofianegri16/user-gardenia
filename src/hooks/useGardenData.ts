
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GardenCheckin, WeatherEmotions, WeatherType } from '@/types/garden';

export const useGardenData = () => {
  const { user } = useAuth();
  const [todayCheckin, setTodayCheckin] = useState<GardenCheckin | null>(null);
  const [weatherEmotions, setWeatherEmotions] = useState<WeatherEmotions>({ sunny: [], cloudy: [], rainy: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTodayCheckin();
      loadWeatherEmotions();
    }
  }, [user]);

  const loadTodayCheckin = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('garden_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('check_in_date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        // Cast the weather property to ensure it's a valid WeatherType
        const checkinData: GardenCheckin = {
          ...data,
          weather: data.weather as WeatherType
        };
        
        setTodayCheckin(checkinData);
      }
    } catch (error) {
      console.error('Error loading today\'s check-in:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el check-in de hoy. Intenta de nuevo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeatherEmotions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('weather_emotions')
        .select('weather, emotion')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const emotions: WeatherEmotions = { sunny: [], cloudy: [], rainy: [] };
      
      data.forEach(item => {
        if (['sunny', 'cloudy', 'rainy'].includes(item.weather)) {
          emotions[item.weather as WeatherType].push(item.emotion);
        }
      });
      
      setWeatherEmotions(emotions);
    } catch (error) {
      console.error('Error loading weather emotions:', error);
    }
  };

  const saveCheckin = async (checkInData: {
    energy: number;
    mentalPressure: number;
    personalConcerns: number;
    achievements: number;
    exceptionalDay: number;
    weather: WeatherType;
  }) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Map camelCase properties to snake_case for the database
      const dataToSave = {
        user_id: user.id,
        energy: checkInData.energy,
        mental_pressure: checkInData.mentalPressure,
        personal_concerns: checkInData.personalConcerns,
        achievements: checkInData.achievements,
        exceptional_day: checkInData.exceptionalDay,
        weather: checkInData.weather,
        check_in_date: new Date().toISOString().split('T')[0]
      };
      
      let response;
      
      if (todayCheckin) {
        // Update existing check-in
        response = await supabase
          .from('garden_checkins')
          .update(dataToSave)
          .eq('id', todayCheckin.id)
          .select();
      } else {
        // Create new check-in
        response = await supabase
          .from('garden_checkins')
          .insert(dataToSave)
          .select();
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: 'Éxito',
        description: todayCheckin 
          ? 'Tu check-in emocional ha sido actualizado.'
          : 'Tu check-in emocional ha sido registrado.',
      });
      
      // Update the local state with the new check-in
      if (response.data && response.data.length > 0) {
        // Ensure we cast weather to WeatherType
        const checkinData: GardenCheckin = {
          ...response.data[0],
          weather: response.data[0].weather as WeatherType
        };
        setTodayCheckin(checkinData);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error saving check-in:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar el check-in. Intenta de nuevo.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    todayCheckin,
    weatherEmotions,
    isSubmitting,
    isLoading,
    saveCheckin
  };
};
