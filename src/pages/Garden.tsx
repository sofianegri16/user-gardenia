
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GardenCheckInForm from '@/components/garden/GardenCheckInForm';
import { useGardenData } from '@/hooks/useGardenData';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

const Garden = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    todayCheckin, 
    weatherEmotions, 
    isSubmitting, 
    isLoading: isDataLoading,
    hasLoadError,
    saveCheckin 
  } = useGardenData();

  useEffect(() => {
    // Si no hay usuario y no está cargando, redirigir al login
    if (!user && !isAuthLoading) {
      navigate('/login');
    } else if (user) {
      console.log("🌿 user loaded in Garden:", user.id);
      console.log("🌿 weatherEmotions in Garden:", weatherEmotions);
    }
  }, [user, isAuthLoading, navigate, weatherEmotions]);

  // Si hay un error de carga y se determina que faltan datos de emociones
  useEffect(() => {
    if (hasLoadError && !isDataLoading && !isAuthLoading) {
      // Verificamos específicamente si faltan las emociones por clima
      const hasEmotions = Object.values(weatherEmotions).some(emotions => emotions.length > 0);
      
      if (!hasEmotions) {
        toast({
          title: "Configuración incompleta",
          description: "Necesitamos que configures tus emociones por clima primero.",
          variant: "destructive",
        });
        
        // Redireccionar al usuario a la página de onboarding después de un breve retraso
        const redirectTimer = setTimeout(() => {
          navigate('/onboarding');
        }, 2000);
        
        return () => clearTimeout(redirectTimer);
      }
    }
  }, [hasLoadError, isDataLoading, isAuthLoading, weatherEmotions, navigate]);

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-garden-background">
        <div className="animate-pulse text-garden-primary flex flex-col items-center">
          <Leaf className="h-12 w-12 mb-4 animate-spin" />
          <span className="text-lg font-medium">Cargando tu jardín emocional...</span>
        </div>
      </div>
    );
  }

  // Si hay un error de carga pero tenemos el usuario, mostrar mensaje de error
  if (hasLoadError && user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-garden-light">
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hubo un problema al cargar tus datos</h1>
          <p className="text-lg text-muted-foreground mb-6">
            No pudimos recuperar la información de tu jardín emocional. Por favor intenta de nuevo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
            >
              Intentar de nuevo
            </Button>
            <Button 
              onClick={() => navigate('/onboarding')}
              variant="outline"
            >
              Ir a configuración inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-b from-garden-light to-white">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-garden-primary">Mi Jardín Emocional</h1>
          <p className="text-lg text-muted-foreground">
            {todayCheckin 
              ? 'Interactúa con los elementos del jardín para ajustar tu estado emocional.' 
              : 'Completa tu check-in emocional diario para cultivar tu jardín.'}
          </p>
        </div>
        
        {/* Check-in Form con visualización integrada */}
        <GardenCheckInForm
          initialEnergy={todayCheckin?.energy ?? 5}
          initialMentalPressure={todayCheckin?.mental_pressure ?? 5}
          initialPersonalConcerns={todayCheckin?.personal_concerns ?? 5}
          initialAchievements={todayCheckin?.achievements ?? 5}
          initialExceptionalDay={todayCheckin?.exceptional_day ?? 0}
          initialWeather={todayCheckin?.weather ?? null}
          weatherEmotions={weatherEmotions}
          isSubmitting={isSubmitting}
          onSubmit={saveCheckin}
        />
      </div>
    </div>
  );
};

export default Garden;
