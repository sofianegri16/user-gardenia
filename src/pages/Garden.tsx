import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Droplet, Wind, Sprout, Flower, Apple, Sun, Cloud, CloudRain } from 'lucide-react';

type WeatherType = 'sunny' | 'cloudy' | 'rainy';
type WeatherEmotions = Record<WeatherType, string[]>;

interface GardenCheckin {
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

const weatherLabels: Record<WeatherType, { icon: React.ReactNode, label: string }> = {
  sunny: { icon: <Sun className="h-5 w-5" />, label: '☀️ Soleado' },
  cloudy: { icon: <Cloud className="h-5 w-5" />, label: '☁️ Nublado' },
  rainy: { icon: <CloudRain className="h-5 w-5" />, label: '🌧️ Lluvioso' }
};

const Garden = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [todayCheckin, setTodayCheckin] = useState<GardenCheckin | null>(null);
  const [weatherEmotions, setWeatherEmotions] = useState<WeatherEmotions>({ sunny: [], cloudy: [], rainy: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [energy, setEnergy] = useState<number>(5);
  const [mentalPressure, setMentalPressure] = useState<number>(5);
  const [personalConcerns, setPersonalConcerns] = useState<number>(5);
  const [achievements, setAchievements] = useState<number>(5);
  const [exceptionalDay, setExceptionalDay] = useState<number>(0);
  const [selectedWeather, setSelectedWeather] = useState<WeatherType | null>(null);

  useEffect(() => {
    // If no user and not loading, redirect to login
    if (!user && !isLoading) {
      navigate('/login');
    }
    
    if (user) {
      loadTodayCheckin();
      loadWeatherEmotions();
    }
  }, [user, isLoading, navigate]);

  const loadTodayCheckin = async () => {
    if (!user) return;
    
    try {
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
        // Update form with existing data
        setEnergy(data.energy);
        setMentalPressure(data.mental_pressure);
        setPersonalConcerns(data.personal_concerns);
        setAchievements(data.achievements);
        setExceptionalDay(data.exceptional_day);
        setSelectedWeather(data.weather as WeatherType);
      }
    } catch (error) {
      console.error('Error loading today\'s check-in:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el check-in de hoy. Intenta de nuevo más tarde.',
        variant: 'destructive',
      });
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

  const handleSubmit = async () => {
    if (!user) return;
    
    // Validate form
    if (selectedWeather === null) {
      toast({
        title: 'Atención',
        description: 'Por favor, selecciona el clima emocional del día.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const checkInData = {
        user_id: user.id,
        energy,
        mental_pressure: mentalPressure,
        personal_concerns: personalConcerns,
        achievements,
        exceptional_day: exceptionalDay,
        weather: selectedWeather,
      };
      
      let response;
      
      if (todayCheckin) {
        // Update existing check-in
        response = await supabase
          .from('garden_checkins')
          .update(checkInData)
          .eq('id', todayCheckin.id)
          .select();
      } else {
        // Create new check-in
        response = await supabase
          .from('garden_checkins')
          .insert(checkInData)
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
      
    } catch (error: any) {
      console.error('Error saving check-in:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar el check-in. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
        
        {/* Garden Visualization */}
        {todayCheckin && (
          <Card className="mb-8 bg-white">
            <CardHeader>
              <CardTitle>Tu Jardín de Hoy</CardTitle>
              <CardDescription>Visualización de tu estado emocional actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Droplet className="h-12 w-12 mb-2 text-blue-500" />
                  <span className="text-lg font-medium">Energía</span>
                  <Badge className="mt-1">{todayCheckin.energy}/10</Badge>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Wind className="h-12 w-12 mb-2 text-gray-500" />
                  <span className="text-lg font-medium">Presión Mental</span>
                  <Badge className="mt-1">{todayCheckin.mental_pressure}/10</Badge>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Sprout className="h-12 w-12 mb-2 text-green-500" />
                  <span className="text-lg font-medium">Preocupaciones</span>
                  <Badge className="mt-1">{todayCheckin.personal_concerns}/10</Badge>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Flower className="h-12 w-12 mb-2 text-purple-500" />
                  <span className="text-lg font-medium">Logros</span>
                  <Badge className="mt-1">{todayCheckin.achievements}/10</Badge>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Apple className="h-12 w-12 mb-2 text-red-500" />
                  <span className="text-lg font-medium">Día Excepcional</span>
                  <Badge className="mt-1">{todayCheckin.exceptional_day === 1 ? 'Sí' : 'No'}</Badge>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  {todayCheckin.weather === 'sunny' && <Sun className="h-12 w-12 mb-2 text-yellow-500" />}
                  {todayCheckin.weather === 'cloudy' && <Cloud className="h-12 w-12 mb-2 text-gray-500" />}
                  {todayCheckin.weather === 'rainy' && <CloudRain className="h-12 w-12 mb-2 text-blue-400" />}
                  <span className="text-lg font-medium">Clima Emocional</span>
                  <Badge className="mt-1">
                    {
                      todayCheckin.weather === 'sunny' 
                        ? 'Soleado' 
                        : todayCheckin.weather === 'cloudy' 
                          ? 'Nublado' 
                          : 'Lluvioso'
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Check-in Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>{todayCheckin ? 'Actualizar Check-in Emocional' : 'Check-in Emocional Diario'}</CardTitle>
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
              onClick={handleSubmit}
              disabled={isSubmitting || selectedWeather === null}
              className="w-full"
            >
              {isSubmitting 
                ? 'Guardando...' 
                : todayCheckin 
                  ? 'Actualizar mi jardín' 
                  : 'Guardar mi jardín'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Garden;
