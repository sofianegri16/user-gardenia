
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplet, Wind, Sprout, Flower, Apple, Sun, Cloud, CloudRain } from 'lucide-react';
import { WeatherType } from '@/types/garden';

interface GardenVisualizationProps {
  energy: number;
  mentalPressure: number;
  personalConcerns: number;
  achievements: number;
  exceptionalDay: number;
  weather: WeatherType;
}

const GardenVisualization = ({
  energy,
  mentalPressure,
  personalConcerns,
  achievements,
  exceptionalDay,
  weather
}: GardenVisualizationProps) => {
  return (
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
            <Badge className="mt-1">{energy}/10</Badge>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Wind className="h-12 w-12 mb-2 text-gray-500" />
            <span className="text-lg font-medium">Presión Mental</span>
            <Badge className="mt-1">{mentalPressure}/10</Badge>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Sprout className="h-12 w-12 mb-2 text-green-500" />
            <span className="text-lg font-medium">Preocupaciones</span>
            <Badge className="mt-1">{personalConcerns}/10</Badge>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Flower className="h-12 w-12 mb-2 text-purple-500" />
            <span className="text-lg font-medium">Logros</span>
            <Badge className="mt-1">{achievements}/10</Badge>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Apple className="h-12 w-12 mb-2 text-red-500" />
            <span className="text-lg font-medium">Día Excepcional</span>
            <Badge className="mt-1">{exceptionalDay === 1 ? 'Sí' : 'No'}</Badge>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            {weather === 'sunny' && <Sun className="h-12 w-12 mb-2 text-yellow-500" />}
            {weather === 'cloudy' && <Cloud className="h-12 w-12 mb-2 text-gray-500" />}
            {weather === 'rainy' && <CloudRain className="h-12 w-12 mb-2 text-blue-400" />}
            <span className="text-lg font-medium">Clima Emocional</span>
            <Badge className="mt-1">
              {
                weather === 'sunny' 
                  ? 'Soleado' 
                  : weather === 'cloudy' 
                    ? 'Nublado' 
                    : 'Lluvioso'
              }
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenVisualization;
