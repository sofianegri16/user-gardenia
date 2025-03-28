
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export type Emotion = {
  emoji: string;
  text: string;
};

export type WeatherType = 'sunny' | 'cloudy' | 'rainy';

const WEATHER_LABELS: Record<WeatherType, string> = {
  'sunny': 'Soleado',
  'cloudy': 'Nublado',
  'rainy': 'Lluvioso'
};

export const EMOTIONS: Emotion[] = [
  { emoji: "😊", text: "Felicidad" },
  { emoji: "😢", text: "Tristeza" },
  { emoji: "😰", text: "Ansiedad" },
  { emoji: "😌", text: "Calma" },
  { emoji: "😣", text: "Agobio" },
  { emoji: "🚀", text: "Motivación" },
  { emoji: "😠", text: "Irritación" },
  { emoji: "🌈", text: "Esperanza" },
  { emoji: "😴", text: "Cansancio" },
  { emoji: "🙏", text: "Gratitud" },
  { emoji: "🤯", text: "Preocupación" },
  { emoji: "😤", text: "Frustración" },
  { emoji: "🥳", text: "Entusiasmo" },
  { emoji: "🤝", text: "Conexión" },
  { emoji: "🥺", text: "Nostalgia" }
];

const MAX_EMOTIONS_PER_WEATHER = 3;

type WeatherEmotionSelectorProps = {
  onComplete: (selections: Record<WeatherType, Emotion[]>) => void;
};

const WeatherEmotionSelector = ({ onComplete }: WeatherEmotionSelectorProps) => {
  const [selections, setSelections] = useState<Record<WeatherType, Emotion[]>>({
    sunny: [],
    cloudy: [],
    rainy: []
  });

  const toggleEmotion = (weather: WeatherType, emotion: Emotion) => {
    setSelections(prev => {
      const currentSelections = [...prev[weather]];
      const index = currentSelections.findIndex(e => e.text === emotion.text);
      
      if (index > -1) {
        // Remove if already selected
        currentSelections.splice(index, 1);
      } else {
        // Add if not at max capacity
        if (currentSelections.length < MAX_EMOTIONS_PER_WEATHER) {
          currentSelections.push(emotion);
        } else {
          toast({
            title: "Máximo alcanzado",
            description: `Solo puedes seleccionar ${MAX_EMOTIONS_PER_WEATHER} emociones para ${WEATHER_LABELS[weather]}`,
            variant: "destructive"
          });
          return prev;
        }
      }
      
      return {
        ...prev,
        [weather]: currentSelections
      };
    });
  };

  const isEmotionSelected = (weather: WeatherType, emotion: Emotion) => {
    return selections[weather].some(e => e.text === emotion.text);
  };

  const handleSubmit = () => {
    // Validate all weather types have at least one emotion
    const incompleteWeathers = Object.entries(selections)
      .filter(([_, emotions]) => emotions.length === 0)
      .map(([weather, _]) => WEATHER_LABELS[weather as WeatherType]);
    
    if (incompleteWeathers.length > 0) {
      toast({
        title: "Selección incompleta",
        description: `Por favor, selecciona al menos una emoción para: ${incompleteWeathers.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    onComplete(selections);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">¿Cómo te sientes con el clima?</h2>
        <p className="text-muted-foreground">
          Selecciona hasta 3 emociones para cada tipo de clima. Esto nos ayudará a personalizar tu experiencia.
        </p>
      </div>
      
      {Object.entries(WEATHER_LABELS).map(([weatherKey, weatherLabel]) => {
        const weather = weatherKey as WeatherType;
        return (
          <Card key={weather} className="garden-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {weather === 'sunny' && '☀️'}
                {weather === 'cloudy' && '☁️'}
                {weather === 'rainy' && '🌧️'}
                {weatherLabel}
                
                <div className="text-sm font-normal ml-auto">
                  {selections[weather].length} / {MAX_EMOTIONS_PER_WEATHER}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {EMOTIONS.map((emotion) => (
                    <Button
                      key={emotion.text}
                      variant={isEmotionSelected(weather, emotion) ? "default" : "outline"}
                      className="h-auto py-2 px-3 flex flex-col items-center"
                      onClick={() => toggleEmotion(weather, emotion)}
                    >
                      <span className="text-xl mb-1">{emotion.emoji}</span>
                      <span className="text-xs">{emotion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 min-h-10">
                {selections[weather].map((emotion) => (
                  <Badge key={emotion.text} variant="secondary" className="text-sm">
                    {emotion.emoji} {emotion.text}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <div className="flex justify-center mt-8">
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default WeatherEmotionSelector;
