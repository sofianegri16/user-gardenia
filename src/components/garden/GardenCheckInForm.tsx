
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeatherEmotions, WeatherType } from '@/types/garden';

interface GardenCheckInFormProps {
  initialEnergy: number;
  initialMentalPressure: number;
  initialPersonalConcerns: number;
  initialAchievements: number;
  initialExceptionalDay: number;
  initialWeather: WeatherType | null;
  weatherEmotions: WeatherEmotions;
  isSubmitting: boolean;
  onSubmit: (data: {
    energy: number;
    mentalPressure: number;
    personalConcerns: number;
    achievements: number;
    exceptionalDay: number;
    weather: WeatherType;
  }) => void;
}

const GardenCheckInForm = ({
  initialEnergy = 5,
  initialMentalPressure = 5,
  initialPersonalConcerns = 5,
  initialAchievements = 5,
  initialExceptionalDay = 0,
  initialWeather = null,
  weatherEmotions,
  isSubmitting,
  onSubmit
}: GardenCheckInFormProps) => {
  const [energy, setEnergy] = useState<number>(initialEnergy);
  const [mentalPressure, setMentalPressure] = useState<number>(initialMentalPressure);
  const [personalConcerns, setPersonalConcerns] = useState<number>(initialPersonalConcerns);
  const [achievements, setAchievements] = useState<number>(initialAchievements);
  const [exceptionalDay, setExceptionalDay] = useState<number>(initialExceptionalDay);
  const [selectedWeather, setSelectedWeather] = useState<WeatherType | null>(initialWeather);

  const handleSubmitForm = () => {
    if (selectedWeather === null) return;
    
    onSubmit({
      energy,
      mentalPressure,
      personalConcerns,
      achievements,
      exceptionalDay,
      weather: selectedWeather
    });
  };

  const handleUpdateValue = (field: string, value: number) => {
    switch (field) {
      case 'energy':
        setEnergy(value);
        break;
      case 'mentalPressure':
        setMentalPressure(value);
        break;
      case 'personalConcerns':
        setPersonalConcerns(value);
        break;
      case 'achievements':
        setAchievements(value);
        break;
      case 'exceptionalDay':
        setExceptionalDay(value);
        break;
    }
  };

  const handleUpdateWeather = (weather: WeatherType) => {
    setSelectedWeather(weather);
  };

  return (
    <>
      {/* Visualization Component */}
      <div className="mb-4">
        {selectedWeather && (
          <GardenVisualization
            energy={energy}
            mentalPressure={mentalPressure}
            personalConcerns={personalConcerns}
            achievements={achievements}
            exceptionalDay={exceptionalDay}
            weather={selectedWeather}
            onUpdateValues={handleUpdateValue}
            onUpdateWeather={handleUpdateWeather}
            weatherEmotions={weatherEmotions}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>

      {/* Save Button - Only shown if no weather is selected yet */}
      {!selectedWeather && (
        <div className="text-center p-4 bg-white rounded-lg shadow mb-4">
          <p className="mb-4 text-muted-foreground">
            Selecciona tu estado emocional para comenzar a cultivar tu jardín
          </p>
          <Button 
            onClick={handleSubmitForm}
            disabled={isSubmitting || selectedWeather === null}
            className="w-full"
          >
            {isSubmitting 
              ? 'Guardando...' 
              : 'Iniciar mi jardín'}
          </Button>
        </div>
      )}
    </>
  );
};

// Importing here to avoid circular dependency
import GardenVisualization from './GardenVisualization';

export default GardenCheckInForm;
