
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Droplet, Wind, Sprout, Flower, Apple, 
  Sun, Cloud, CloudRain, X 
} from 'lucide-react';
import { WeatherType } from '@/types/garden';
import { cn } from '@/lib/utils';

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
  
  // Estado para las animaciones
  const [isAnimating, setIsAnimating] = useState(false);
  // Estado para controlar qué elemento está siendo interactuado
  const [activeInteraction, setActiveInteraction] = useState<InteractionType>(null);
  
  // Inicia animación cuando se monta el componente o cambian los datos
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [energy, mentalPressure, personalConcerns, achievements, exceptionalDay, weather]);

  // Calculamos la altura del árbol basado en la energía y los logros
  const treeHeight = Math.max(40, Math.min(90, (energy + achievements) * 4));
  
  // Calculamos la anchura de las raíces basado en preocupaciones personales
  const rootsWidth = Math.max(30, Math.min(100, personalConcerns * 8));
  
  // Calculamos la cantidad de frutos según si fue un día excepcional
  const fruitsCount = exceptionalDay === 1 ? 3 : 0;
  
  // Calculamos la cantidad de flores según los logros
  const flowersCount = Math.min(8, Math.max(0, Math.floor(achievements / 2)));
  
  // Intensidad del viento según la presión mental
  const windIntensity = mentalPressure;

  // Manejador para abrir el modal de interacción
  const handleElementClick = (type: InteractionType) => {
    setActiveInteraction(type);
  };

  // Manejador para cerrar el modal de interacción
  const handleCloseInteraction = () => {
    setActiveInteraction(null);
  };

  // Manejador para actualizar el valor del elemento seleccionado
  const handleUpdateValue = (value: number) => {
    if (activeInteraction && activeInteraction !== 'weather') {
      onUpdateValues(activeInteraction, value);
      // setActiveInteraction(null);
    }
  };

  // Manejador para actualizar el clima
  const handleUpdateWeather = (newWeather: WeatherType) => {
    onUpdateWeather(newWeather);
    // setActiveInteraction(null);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl shadow-lg border border-gray-200">
      {/* Cielo según el clima */}
      <div 
        className={cn(
          "w-full h-32 transition-colors duration-1000 relative",
          weather === 'sunny' ? "bg-gradient-to-b from-blue-400 to-blue-300" : 
          weather === 'cloudy' ? "bg-gradient-to-b from-gray-400 to-gray-300" : 
          "bg-gradient-to-b from-gray-600 to-gray-500"
        )}
        onClick={() => handleElementClick('weather')}
      >
        {/* Elements for interaction hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10 cursor-pointer">
          <span className="text-white bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            Cambiar clima y emoción
          </span>
        </div>
        
        {/* Elementos del cielo según el clima */}
        {weather === 'sunny' && (
          <div className="absolute top-4 right-8 text-yellow-400 animate-pulse">
            <Sun size={48} />
          </div>
        )}
        
        {weather === 'cloudy' && (
          <>
            <div className="absolute top-6 right-8 text-gray-200">
              <Cloud size={32} />
            </div>
            <div className="absolute top-12 right-16 text-gray-300">
              <Cloud size={24} />
            </div>
            <div className="absolute top-5 left-8 text-gray-200">
              <Cloud size={36} />
            </div>
          </>
        )}
        
        {weather === 'rainy' && (
          <>
            <div className="absolute top-4 right-10 text-gray-400">
              <CloudRain size={42} />
            </div>
            <div className="absolute top-6 left-10 text-gray-500">
              <CloudRain size={36} />
            </div>
            <div className="rain-container absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="rain-drop absolute bg-blue-300 w-0.5 h-2 opacity-70 animate-[fall_1s_linear_infinite]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${0.5 + Math.random() * 1}s`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Césped - Contexto isométrico */}
      <div 
        className="bg-gradient-to-b from-green-500 to-green-600 min-h-[468px] relative perspective"
        style={{ 
          transformStyle: 'preserve-3d', 
          perspective: '800px'
        }}
      >
        {/* Grid para efecto isométrico */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundImage: `repeating-linear-gradient(
                0deg, 
                rgba(255,255,255,0.03) 0px, 
                rgba(255,255,255,0.03) 1px, 
                transparent 1px, 
                transparent 20px
              ), 
              repeating-linear-gradient(
                90deg, 
                rgba(255,255,255,0.03) 0px, 
                rgba(255,255,255,0.03) 1px, 
                transparent 1px, 
                transparent 20px
              )`,
              transform: 'rotateX(30deg)',
              transformOrigin: 'center top'
            }} 
          />
        </div>
        
        {/* Humedad/Agua (energía) */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-500",
            "cursor-pointer"
          )}
          style={{ height: `${Math.max(6, energy * 2)}px` }}
          onClick={() => handleElementClick('energy')}
        >
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
          
          {/* Interaction hint */}
          <div className="absolute left-4 bottom-4 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              Ajustar nivel de energía
            </span>
          </div>
          
          {/* Water drop indicators */}
          {Array.from({ length: Math.floor(energy / 2) }).map((_, i) => (
            <div 
              key={i}
              className="absolute h-4 w-4 text-blue-400"
              style={{ 
                bottom: `${6 + Math.random() * 4}px`, 
                left: `${10 + i * 12 + Math.random() * 5}%`,
                opacity: 0.7 + Math.random() * 0.3
              }}
            >
              <Droplet size={16} className="fill-blue-300" />
            </div>
          ))}
        </div>
        
        {/* Raíces (preocupaciones) */}
        <div 
          className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => handleElementClick('personalConcerns')}
        >
          <div className="relative">
            {/* Interaction hint */}
            <div className="absolute -left-24 -bottom-2 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                Ajustar nivel de preocupaciones
              </span>
            </div>
            
            <svg width="100" height="30" viewBox="0 0 100 30" className="transform translate-y-1">
              <path 
                d={`M50,0 Q${40-personalConcerns},15 ${30-personalConcerns/2},30 M50,0 Q${60+personalConcerns},15 ${70+personalConcerns/2},30`} 
                stroke="brown" 
                strokeWidth="3" 
                fill="transparent"
              />
              <path 
                d={`M50,5 Q${45-personalConcerns/2},20 ${40-personalConcerns/4},30 M50,5 Q${55+personalConcerns/2},20 ${60+personalConcerns/4},30`} 
                stroke="brown" 
                strokeWidth="2" 
                fill="transparent"
              />
            </svg>
          </div>
        </div>
        
        {/* Árbol (centro) */}
        <div 
          className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
          onClick={() => handleElementClick('mentalPressure')}
          style={{
            transform: 'translate(-50%, 0) rotateX(5deg)',
            transformOrigin: 'bottom center'
          }}
        >
          {/* Interaction hint */}
          <div className="absolute -left-24 top-1/2 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              Ajustar presión mental
            </span>
          </div>
          
          {/* Tronco */}
          <div 
            className="bg-gradient-to-t from-yellow-800 to-yellow-700 w-8 rounded-lg transition-all duration-1000"
            style={{ 
              height: `${treeHeight}px`,
              boxShadow: '2px 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            {/* Texture lines for trunk */}
            <div className="h-full w-full relative overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-yellow-900/30 rounded-full"
                  style={{
                    height: '4px',
                    width: '70%',
                    left: '15%',
                    top: `${20 + i * 20}%`,
                    transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Copa del árbol */}
          <div 
            className={cn(
              "rounded-full bg-gradient-to-b from-green-600 to-green-500 transition-all duration-1000 absolute shadow-lg",
              isAnimating ? "animate-scale-in" : "",
              windIntensity > 7 ? "animate-[shake_1s_ease-in-out_infinite]" : 
              windIntensity > 4 ? "animate-[shake_2s_ease-in-out_infinite]" : ""
            )}
            style={{ 
              width: `${treeHeight + 20}px`, 
              height: `${treeHeight + 20}px`,
              transform: `translateY(-${treeHeight * 0.6}px)`,
              boxShadow: '2px 8px 12px rgba(0,0,0,0.15)'
            }}
          >
            {/* Texture for tree leaves */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-green-700/20 rounded-full"
                  style={{
                    height: `${30 + Math.random() * 20}%`,
                    width: `${30 + Math.random() * 20}%`,
                    left: `${Math.random() * 70}%`,
                    top: `${Math.random() * 70}%`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Frutos (días excepcionales) */}
          <div 
            className="absolute z-30 cursor-pointer"
            style={{ bottom: `${treeHeight * 0.3}px` }}
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('exceptionalDay');
            }}
          >
            {/* Interaction hint */}
            <div className="absolute -right-24 top-0 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                ¿Día excepcional?
              </span>
            </div>
            
            {fruitsCount > 0 ? (
              Array.from({ length: fruitsCount }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-red-500 w-4 h-4 rounded-full shadow-sm animate-bounce"
                  style={{ 
                    left: `${(i - 1) * 15}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s',
                    boxShadow: '1px 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="absolute -top-1 left-1.5 w-1 h-2 bg-green-700 rounded-sm"></div>
                </div>
              ))
            ) : (
              <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center text-white/40">
                <Apple size={20} className="opacity-30" />
              </div>
            )}
          </div>
        </div>
        
        {/* Flores (logros) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-16 cursor-pointer"
          onClick={() => handleElementClick('achievements')}
        >
          {/* Interaction hint */}
          <div className="absolute right-4 bottom-4 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              Ajustar nivel de logros
            </span>
          </div>
          
          {flowersCount > 0 && (
            <>
              {Array.from({ length: flowersCount }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bottom-2"
                  style={{ 
                    left: `${10 + i * 15}%`,
                    transform: 'rotateX(20deg)',
                    transformOrigin: 'bottom center'
                  }}
                >
                  <div className="relative">
                    <div className="w-1 h-10 bg-green-700"></div>
                    <div className="absolute -top-3 -left-2.5 flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div
                          key={j}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            ["bg-purple-400", "bg-pink-400", "bg-yellow-400", "bg-blue-400", "bg-red-400"][i % 5]
                          )}
                          style={{
                            transform: `rotate(${j * 72}deg) translate(2.5px, 0)`,
                            transformOrigin: 'center',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}
                        ></div>
                      ))}
                      <div className="w-2 h-2 rounded-full bg-yellow-300 absolute top-0 left-0.5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Arbustos decorativos con efecto isométrico */}
        <div 
          className="absolute bottom-0 left-5"
          style={{ transform: 'rotateX(20deg)', transformOrigin: 'bottom center' }}
        >
          <div className="w-10 h-10 bg-green-700 rounded-full"></div>
          <div className="w-12 h-12 bg-green-700 rounded-full absolute -top-5 -left-3"></div>
          <div className="w-8 h-8 bg-green-700 rounded-full absolute -top-3 -right-2"></div>
        </div>
        
        <div 
          className="absolute bottom-0 right-5"
          style={{ transform: 'rotateX(20deg)', transformOrigin: 'bottom center' }}
        >
          <div className="w-10 h-10 bg-green-700 rounded-full"></div>
          <div className="w-12 h-12 bg-green-700 rounded-full absolute -top-5 -right-3"></div>
          <div className="w-8 h-8 bg-green-700 rounded-full absolute -top-3 -left-2"></div>
        </div>
        
        {/* Mariposas (solo si la energía es alta) */}
        {energy > 6 && (
          <>
            <div 
              className="absolute text-purple-400"
              style={{ 
                top: '30%', 
                left: '20%', 
                animation: 'fly 10s ease-in-out infinite',
                zIndex: 30
              }}
            >
              <Flower size={20} className="transform rotate-45 filter drop-shadow-md" />
            </div>
            <div 
              className="absolute text-pink-400"
              style={{ 
                top: '40%', 
                right: '15%', 
                animation: 'fly 8s ease-in-out infinite reverse',
                zIndex: 30
              }}
            >
              <Flower size={16} className="transform -rotate-45 filter drop-shadow-md" />
            </div>
          </>
        )}
        
        {/* Abejas (solo si hay logros) */}
        {achievements > 7 && (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <div 
                key={i}
                className="absolute flex items-center"
                style={{ 
                  top: `${30 + i * 15}%`, 
                  left: i % 2 === 0 ? '30%' : '60%',
                  animation: `fly ${3 + i}s ease-in-out infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                  zIndex: 40
                }}
              >
                <div className="w-4 h-3 bg-yellow-400 rounded-full relative filter drop-shadow-md">
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full" style={{ clipPath: 'polygon(0 34%, 33% 34%, 33% 67%, 66% 67%, 66% 34%, 100% 34%, 100% 67%, 0 67%)' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
                <div className="w-2 h-1 bg-gray-300 ml-0.5 animate-pulse"></div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modales de interacción */}
      {activeInteraction && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
            <CardContent className="pt-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {activeInteraction === 'energy' && 'Energía (Agua)'}
                  {activeInteraction === 'mentalPressure' && 'Presión Mental (Viento)'}
                  {activeInteraction === 'personalConcerns' && 'Preocupaciones (Raíces)'}
                  {activeInteraction === 'achievements' && 'Logros (Flores)'}
                  {activeInteraction === 'exceptionalDay' && '¿Día Excepcional? (Frutos)'}
                  {activeInteraction === 'weather' && 'Estado Emocional (Clima)'}
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

              {/* Contenido según el tipo de interacción */}
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
                    <div className="flex items-start space-x-2 p-3 border rounded-md">
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

                    <div className="flex items-start space-x-2 p-3 border rounded-md">
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

                    <div className="flex items-start space-x-2 p-3 border rounded-md">
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
