
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, RefreshCw } from 'lucide-react';
import WeatherEmotionSelector, { WeatherType, Emotion } from '@/components/onboarding/WeatherEmotionSelector';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Onboarding = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [checkingEmotions, setCheckingEmotions] = useState(true);
  const [checkFailed, setCheckFailed] = useState(false);
  
  // This effect runs when the component mounts
  useEffect(() => {
    console.log("🌿 Onboarding component mounted, user:", user?.id, "isLoading:", isLoading);
    
    // If no user and not loading, redirect to login
    if (!user && !isLoading) {
      console.log("🌿 No user in Onboarding, redirecting to login");
      navigate('/login');
    } else if (user && !isLoading) {
      console.log("🌿 user loaded in Onboarding:", user.id);
      checkExistingEmotions();
    }
  }, [user, isLoading, navigate]);

  // Check if user already has weather emotions configured
  const checkExistingEmotions = async () => {
    if (!user) {
      console.log("🌿 No user available for checking emotions");
      return;
    }
    
    try {
      setCheckingEmotions(true);
      setCheckFailed(false);
      
      console.log("🌿 Checking existing emotions for user:", user.id);
      
      const { data, error } = await supabase
        .from('weather_emotions')
        .select('weather')
        .eq('user_id', user.id)
        .limit(1);
        
      if (error) {
        console.error('Error checking weather emotions:', error);
        setCheckFailed(true);
        throw error;
      }
      
      console.log("🌿 Emotions check result:", data);
      
      // If user already has emotions, redirect to garden
      if (data && data.length > 0) {
        console.log("🌿 user has existing emotions, redirecting to garden");
        navigate('/garden');
      } else {
        console.log("🌿 No emotions found, staying on onboarding");
      }
    } catch (error) {
      console.error('Error checking weather emotions:', error);
      toast({
        title: "Error",
        description: "No se pudieron verificar tus emociones guardadas. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setCheckingEmotions(false);
    }
  };

  // Retry checking for emotions
  const handleRetryCheck = () => {
    checkExistingEmotions();
  };

  // Save user's weather emotion selections to Supabase
  const handleEmotionComplete = async (selections: Record<WeatherType, Emotion[]>) => {
    if (!user) {
      console.error("No user found when trying to save emotions");
      toast({
        title: "Error",
        description: "Usuario no encontrado. Por favor inicia sesión de nuevo.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      console.log("🌿 Saving emotions for user:", user.id);
      
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

  if (isLoading || checkingEmotions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-garden-primary mb-4">Cargando...</div>
          <p className="text-sm text-gray-500">Verificando tus emociones guardadas</p>
        </div>
      </div>
    );
  }

  if (checkFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 mb-4">Error al verificar tus emociones</div>
          <p className="text-sm text-gray-600 mb-4">
            No pudimos verificar si ya tienes emociones guardadas. Esto puede deberse a un problema de conexión.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetryCheck} className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" /> Intentar de nuevo
            </Button>
            <Button variant="outline" onClick={() => navigate('/garden')}>
              Ir al jardín
            </Button>
          </div>
        </div>
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
