
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Droplet, Wind, Sprout, Flower, Apple, Sun, Cloud, CloudRain } from 'lucide-react';
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

const weatherLabels: Record<WeatherType, { icon: React.ReactNode, label: string }> = {
  sunny: { icon: <Sun className="h-5 w-5" />, label: '☀️ Soleado' },
  cloudy: { icon: <Cloud className="h-5 w-5" />, label: '☁️ Nublado' },
  rainy: { icon: <CloudRain className="h-5 w-5" />, label: '🌧️ Lluvioso' }
};

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

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Check-in Emocional Diario</CardTitle>
        <CardDescription>
          Completa esta breve evaluación para nutrir tu jardín emocional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Energy / Water */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Droplet className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium">Energía (Agua)</span>
          </div>
          <Slider 
            value={[energy]} 
            min={1} 
            max={10} 
            step={1} 
            onValueChange={(values) => setEnergy(values[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Baja (1)</span>
            <span>Media (5)</span>
            <span>Alta (10)</span>
          </div>
        </div>

        {/* Mental Pressure / Wind */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">Presión Mental (Viento)</span>
          </div>
          <Slider 
            value={[mentalPressure]} 
            min={1} 
            max={10} 
            step={1} 
            onValueChange={(values) => setMentalPressure(values[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Baja (1)</span>
            <span>Media (5)</span>
            <span>Alta (10)</span>
          </div>
        </div>

        {/* Personal Concerns / Roots */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Sprout className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">Preocupaciones Personales (Raíces)</span>
          </div>
          <Slider 
            value={[personalConcerns]} 
            min={1} 
            max={10} 
            step={1} 
            onValueChange={(values) => setPersonalConcerns(values[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pocas (1)</span>
            <span>Algunas (5)</span>
            <span>Muchas (10)</span>
          </div>
        </div>

        {/* Achievements / Flowers */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Flower className="h-5 w-5 mr-2 text-purple-500" />
            <span className="font-medium">Logros (Flores)</span>
          </div>
          <Slider 
            value={[achievements]} 
            min={1} 
            max={10} 
            step={1} 
            onValueChange={(values) => setAchievements(values[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pocos (1)</span>
            <span>Algunos (5)</span>
            <span>Muchos (10)</span>
          </div>
        </div>

        {/* Exceptional Day / Fruit */}
        <div className="space-y-3">
          <div className="flex items-center mb-2">
            <Apple className="h-5 w-5 mr-2 text-red-500" />
            <span className="font-medium">¿Fue un día excepcional? (Frutos)</span>
          </div>
          <RadioGroup 
            value={exceptionalDay.toString()} 
            onValueChange={(value) => setExceptionalDay(parseInt(value))}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="exceptional-yes" />
              <Label htmlFor="exceptional-yes">Sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="exceptional-no" />
              <Label htmlFor="exceptional-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Weather Selection */}
        <div className="space-y-4">
          <div className="font-medium">¿Cómo te sentiste hoy?</div>
          <RadioGroup 
            value={selectedWeather || ''} 
            onValueChange={(value) => setSelectedWeather(value as WeatherType)}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {Object.entries(weatherLabels).map(([weather, { icon, label }]) => (
              <div key={weather} className="flex items-start space-x-2 p-3 border rounded-md">
                <RadioGroupItem value={weather} id={`weather-${weather}`} className="mt-1" />
                <div className="space-y-2 w-full">
                  <Label 
                    htmlFor={`weather-${weather}`} 
                    className="flex items-center space-x-2 font-medium cursor-pointer"
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </Label>
                  
                  {weatherEmotions[weather as WeatherType]?.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ({weatherEmotions[weather as WeatherType].join(', ')})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmitForm}
          disabled={isSubmitting || selectedWeather === null}
          className="w-full"
        >
          {isSubmitting 
            ? 'Guardando...' 
            : 'Guardar mi jardín'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GardenCheckInForm;
