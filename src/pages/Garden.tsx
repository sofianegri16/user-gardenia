
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GardenVisualization from '@/components/garden/GardenVisualization';
import GardenCheckInForm from '@/components/garden/GardenCheckInForm';
import { useGardenData } from '@/hooks/useGardenData';

const Garden = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    todayCheckin, 
    weatherEmotions, 
    isSubmitting, 
    isLoading: isDataLoading,
    saveCheckin 
  } = useGardenData();

  useEffect(() => {
    // If no user and not loading, redirect to login
    if (!user && !isAuthLoading) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-garden-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-garden-light">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Jardín Emocional</h1>
          <p className="text-lg text-muted-foreground">
            {todayCheckin 
              ? 'Este es tu jardín de hoy. Puedes actualizarlo si lo deseas.' 
              : 'Completa tu check-in emocional diario para cultivar tu jardín.'}
          </p>
        </div>
        
        {/* Garden Visualization - only show if there's a check-in today */}
        {todayCheckin && (
          <GardenVisualization
            energy={todayCheckin.energy}
            mentalPressure={todayCheckin.mental_pressure}
            personalConcerns={todayCheckin.personal_concerns}
            achievements={todayCheckin.achievements}
            exceptionalDay={todayCheckin.exceptional_day}
            weather={todayCheckin.weather}
          />
        )}

        {/* Check-in Form */}
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
