
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import WeatherEmotionSelector, { WeatherType, Emotion } from '@/components/onboarding/WeatherEmotionSelector';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Onboarding = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // If no user and not loading, redirect to login
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Save user's weather emotion selections to Supabase
  const handleEmotionComplete = async (selections: Record<WeatherType, Emotion[]>) => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Delete existing weather emotions for this user
      await supabase
        .from('weather_emotions')
        .delete()
        .eq('user_id', user.id);
        
      // Prepare the records to insert
      const records = Object.entries(selections).flatMap(([weather, emotions]) => {
        return emotions.map(emotion => ({
          user_id: user.id,
          weather: weather, // This will be 'sunny', 'cloudy', or 'rainy'
          emotion: emotion.text
        }));
      });
      
      // Insert the new selections
      const { error } = await supabase
        .from('weather_emotions')
        .insert(records);
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "¡Perfecto!",
        description: "Tus emociones han sido guardadas correctamente.",
      });
      
      // Redirect to the garden page
      navigate('/garden');
      
    } catch (error: any) {
      console.error('Error saving weather emotions:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar tus emociones. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-garden-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-garden-light">
      <div className="w-full max-w-4xl">
        <Card className="garden-card">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-garden-accent p-3 rounded-full">
                <Sprout className="h-6 w-6 text-garden-dark" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">¡Bienvenido a TeraGarden!</CardTitle>
            <CardDescription className="text-center">
              Personaliza tu experiencia compartiendo cómo te sientes con diferentes tipos de clima.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeatherEmotionSelector onComplete={handleEmotionComplete} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="mt-4"
            >
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
