
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Droplet, Wind, Flower, Leaf, Apple,
  Sun, Cloud, CloudRain, X, TreeDeciduous, TreePine, Bird
} from 'lucide-react';
import { WeatherType } from '@/types/garden';
import { cn } from '@/lib/utils';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import GardenScene from './GardenScene';

interface GardenVisualizationProps {
  energy: number;
  mentalPressure: number;
  personalConcerns: number;
  achievements: number;
  exceptionalDay: number;
  weather: WeatherType;
  onUpdateValues: (field: string, value: number) => void;
  onUpdateWeather: (weather: WeatherType) => void;
  weatherEmotions: Record<WeatherType, string[]>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

type InteractionType = 'energy' | 'mentalPressure' | 'personalConcerns' | 'achievements' | 'exceptionalDay' | 'weather' | null;

const GardenVisualization = ({
  energy,
  mentalPressure,
  personalConcerns,
  achievements,
  exceptionalDay,
  weather,
  onUpdateValues,
  onUpdateWeather,
  weatherEmotions,
  isSubmitting,
  onSubmit
}: GardenVisualizationProps) => {
  const gardenRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeInteraction, setActiveInteraction] = useState<InteractionType>(null);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [energy, mentalPressure, personalConcerns, achievements, exceptionalDay, weather]);

  const handleElementClick = (type: InteractionType) => {
    setActiveInteraction(type);
  };

  const handleCloseInteraction = () => {
    setActiveInteraction(null);
  };

  const handleUpdateValue = (value: number) => {
    if (activeInteraction && activeInteraction !== 'weather') {
      onUpdateValues(activeInteraction, value);
    }
  };

  const handleUpdateWeather = (newWeather: WeatherType) => {
    onUpdateWeather(newWeather);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-xl">
      <div className="absolute inset-0 garden-scene">
        <Canvas shadows dpr={[1, 2]} className="garden-canvas">
          <PerspectiveCamera makeDefault position={[6, 6, 6]} fov={45} />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          
          <GardenScene 
            energy={energy}
            mentalPressure={mentalPressure}
            personalConcerns={personalConcerns}
            achievements={achievements}
            exceptionalDay={exceptionalDay}
            weather={weather}
            onElementClick={handleElementClick}
            isAnimating={isAnimating}
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.5}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
          />
        </Canvas>
      </div>

      {activeInteraction && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
            <CardContent className="pt-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  {activeInteraction === 'energy' && (
                    <>
                      <Droplet size={18} className="text-blue-500" />
                      <span>Energía (Agua)</span>
                    </>
                  )}
                  {activeInteraction === 'mentalPressure' && (
                    <>
                      <Wind size={18} className="text-gray-500" />
                      <span>Presión Mental (Viento)</span>
                    </>
                  )}
                  {activeInteraction === 'personalConcerns' && (
                    <>
                      <TreeDeciduous size={18} className="text-green-700" />
                      <span>Preocupaciones (Raíces)</span>
                    </>
                  )}
                  {activeInteraction === 'achievements' && (
                    <>
                      <Flower size={18} className="text-pink-500" />
                      <span>Logros (Flores)</span>
                    </>
                  )}
                  {activeInteraction === 'exceptionalDay' && (
                    <>
                      <Apple size={18} className="text-red-500" />
                      <span>¿Día Excepcional? (Frutos)</span>
                    </>
                  )}
                  {activeInteraction === 'weather' && (
                    <>
                      <Sun size={18} className="text-yellow-500" />
                      <span>Estado Emocional (Clima)</span>
                    </>
                  )}
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseInteraction}
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </Button>
              </div>

              {activeInteraction === 'exceptionalDay' ? (
                <RadioGroup 
                  value={exceptionalDay.toString()} 
                  onValueChange={(value) => handleUpdateValue(parseInt(value))}
                  className="flex justify-around my-4"
                >
                  <div className="space-y-2 text-center">
                    <RadioGroupItem value="1" id="exceptional-yes" className="mx-auto" />
                    <Label htmlFor="exceptional-yes" className="block">Sí</Label>
                    <div className="text-xs text-muted-foreground">Día especial</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <RadioGroupItem value="0" id="exceptional-no" className="mx-auto" />
                    <Label htmlFor="exceptional-no" className="block">No</Label>
                    <div className="text-xs text-muted-foreground">Día normal</div>
                  </div>
                </RadioGroup>
              ) : activeInteraction === 'weather' ? (
                <div className="space-y-4 py-2">
                  <RadioGroup 
                    value={weather} 
                    onValueChange={(value) => handleUpdateWeather(value as WeatherType)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    <div className="flex items-start space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="sunny" id="weather-sunny" className="mt-1" />
                      <div className="space-y-2 w-full">
                        <Label htmlFor="weather-sunny" className="flex items-center space-x-2 font-medium cursor-pointer">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <span>Soleado</span>
                        </Label>
                        {weatherEmotions['sunny']?.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            ({weatherEmotions['sunny'].join(', ')})
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cloudy" id="weather-cloudy" className="mt-1" />
                      <div className="space-y-2 w-full">
                        <Label htmlFor="weather-cloudy" className="flex items-center space-x-2 font-medium cursor-pointer">
                          <Cloud className="h-4 w-4 text-gray-500" />
                          <span>Nublado</span>
                        </Label>
                        {weatherEmotions['cloudy']?.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            ({weatherEmotions['cloudy'].join(', ')})
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="rainy" id="weather-rainy" className="mt-1" />
                      <div className="space-y-2 w-full">
                        <Label htmlFor="weather-rainy" className="flex items-center space-x-2 font-medium cursor-pointer">
                          <CloudRain className="h-4 w-4 text-blue-500" />
                          <span>Lluvioso</span>
                        </Label>
                        {weatherEmotions['rainy']?.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            ({weatherEmotions['rainy'].join(', ')})
                          </div>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  <Slider 
                    value={[
                      activeInteraction === 'energy' ? energy :
                      activeInteraction === 'mentalPressure' ? mentalPressure :
                      activeInteraction === 'personalConcerns' ? personalConcerns :
                      achievements
                    ]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(values) => handleUpdateValue(values[0])}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Nivel bajo (1)</span>
                    <span>Nivel alto (10)</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCloseInteraction}
                >
                  Cerrar
                </Button>
                {activeInteraction === 'weather' && (
                  <Button 
                    onClick={onSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GardenVisualization;
