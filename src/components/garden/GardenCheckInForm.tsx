
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeatherEmotions, WeatherType } from '@/types/garden';
import GardenVisualization from './GardenVisualization';
import { Sun, Cloud, CloudRain, TreeDeciduous } from 'lucide-react';

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
    <div className="w-full">
      {/* Escena del jardín 3D isométrico */}
      <div className="mb-6 perspective-1000 preserve-3d">
        {selectedWeather ? (
          <div className="transform transition-all duration-500 hover:shadow-2xl rounded-2xl overflow-hidden">
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 h-[400px] bg-gradient-to-b from-garden-light to-garden-background rounded-2xl border border-garden-border shadow-lg text-center">
            <div className="mb-6 text-garden-primary">
              <TreeDeciduous size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Elige tu estado emocional</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Para comenzar a cultivar tu jardín emocional, selecciona cómo te sientes hoy
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => handleUpdateWeather('sunny')}
                variant="outline"
                className="flex gap-2 items-center hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
              >
                <Sun size={20} className="text-yellow-500" />
                <span>Soleado</span>
              </Button>
              <Button
                onClick={() => handleUpdateWeather('cloudy')}
                variant="outline"
                className="flex gap-2 items-center hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <Cloud size={20} className="text-gray-500" />
                <span>Nublado</span>
              </Button>
              <Button
                onClick={() => handleUpdateWeather('rainy')}
                variant="outline"
                className="flex gap-2 items-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <CloudRain size={20} className="text-blue-500" />
                <span>Lluvioso</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Botón de guardar - Solo mostrado si el clima está seleccionado */}
      {selectedWeather && (
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <Button 
            onClick={handleSubmitForm}
            disabled={isSubmitting || selectedWeather === null}
            className="w-full bg-garden-primary hover:bg-garden-dark text-white font-medium transition-colors"
          >
            {isSubmitting 
              ? 'Guardando estado emocional...' 
              : 'Guardar estado emocional'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GardenCheckInForm;
