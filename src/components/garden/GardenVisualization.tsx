
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Droplet, Wind, Sprout, Flower, Apple, Sun, Cloud, CloudRain } from 'lucide-react';
import { WeatherType } from '@/types/garden';
import { cn } from '@/lib/utils';

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
  const gardenRef = useRef<HTMLDivElement>(null);
  
  // Estado para las animaciones
  const [isAnimating, setIsAnimating] = useState(false);
  
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

  return (
    <Card className="mb-8 overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 text-white">
        <CardTitle>Tu Jardín de Hoy</CardTitle>
        <CardDescription className="text-green-100">
          Visualización de tu estado emocional actual
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        {/* Cielo según el clima */}
        <div 
          className={cn(
            "w-full h-32 transition-colors duration-1000",
            weather === 'sunny' ? "bg-gradient-to-b from-blue-400 to-blue-300" : 
            weather === 'cloudy' ? "bg-gradient-to-b from-gray-400 to-gray-300" : 
            "bg-gradient-to-b from-gray-600 to-gray-500"
          )}
        >
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
        
        {/* Césped */}
        <div className="bg-gradient-to-b from-green-500 to-green-600 min-h-[300px] relative">
          
          {/* Humedad/Agua (energía) */}
          {energy > 5 && (
            <div className="absolute bottom-0 left-0 right-0 bg-blue-500/10 h-6 animate-pulse z-0" />
          )}
          
          {/* Raíces (preocupaciones) */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-10">
            <div className="relative">
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
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-20 flex flex-col items-center">
            {/* Tronco */}
            <div 
              className="bg-gradient-to-t from-yellow-800 to-yellow-700 w-8 rounded-lg transition-all duration-1000"
              style={{ height: `${treeHeight}px` }}
            />
            
            {/* Copa del árbol */}
            <div 
              className={cn(
                "rounded-full bg-gradient-to-b from-green-600 to-green-500 transition-all duration-1000 absolute bottom-16 shadow-lg",
                isAnimating ? "animate-scale-in" : "",
                windIntensity > 7 ? "animate-[shake_1s_ease-in-out_infinite]" : 
                windIntensity > 4 ? "animate-[shake_2s_ease-in-out_infinite]" : ""
              )}
              style={{ 
                width: `${treeHeight + 20}px`, 
                height: `${treeHeight + 20}px`,
                transform: `translateY(-${treeHeight * 0.6}px)`
              }}
            />
            
            {/* Frutos (días excepcionales) */}
            {fruitsCount > 0 && (
              <div className="absolute" style={{ bottom: `${treeHeight * 0.3}px` }}>
                {Array.from({ length: fruitsCount }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-red-500 w-4 h-4 rounded-full shadow-sm animate-bounce"
                    style={{ 
                      left: `${(i - 1) * 15}px`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1s'
                    }}
                  >
                    <div className="absolute -top-1 left-1.5 w-1 h-2 bg-green-700 rounded-sm"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Flores (logros) */}
          {flowersCount > 0 && (
            <>
              {Array.from({ length: flowersCount }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bottom-2"
                  style={{ left: `${10 + i * 15}%` }}
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
                            transformOrigin: 'center'
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
          
          {/* Arbustos decorativos */}
          <div className="absolute bottom-0 left-5">
            <div className="w-10 h-10 bg-green-700 rounded-full"></div>
            <div className="w-12 h-12 bg-green-700 rounded-full absolute -top-5 -left-3"></div>
            <div className="w-8 h-8 bg-green-700 rounded-full absolute -top-3 -right-2"></div>
          </div>
          
          <div className="absolute bottom-0 right-5">
            <div className="w-10 h-10 bg-green-700 rounded-full"></div>
            <div className="w-12 h-12 bg-green-700 rounded-full absolute -top-5 -right-3"></div>
            <div className="w-8 h-8 bg-green-700 rounded-full absolute -top-3 -left-2"></div>
          </div>
          
          {/* Mariposas (solo si la energía es alta) */}
          {energy > 6 && (
            <>
              <div 
                className="absolute text-purple-400"
                style={{ top: '30%', left: '20%', animation: 'fly 10s ease-in-out infinite' }}
              >
                <Flower size={20} className="transform rotate-45" />
              </div>
              <div 
                className="absolute text-pink-400"
                style={{ top: '40%', right: '15%', animation: 'fly 8s ease-in-out infinite reverse' }}
              >
                <Flower size={16} className="transform -rotate-45" />
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
                    animation: `fly ${3 + i}s ease-in-out infinite ${i % 2 === 0 ? '' : 'reverse'}`
                  }}
                >
                  <div className="w-4 h-3 bg-yellow-400 rounded-full relative">
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full" style={{ clipPath: 'polygon(0 34%, 33% 34%, 33% 67%, 66% 67%, 66% 34%, 100% 34%, 100% 67%, 0 67%)' }}></div>
                    <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                  <div className="w-2 h-1 bg-gray-300 ml-0.5 animate-pulse"></div>
                </div>
              ))}
            </>
          )}
          
          {/* Indicadores visuales de parámetros */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-30 bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-1 text-xs">
              <Droplet size={14} className="text-blue-500" />
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${energy * 10}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs">
              <Wind size={14} className="text-gray-500" />
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-500 transition-all duration-500"
                  style={{ width: `${mentalPressure * 10}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs">
              <Sprout size={14} className="text-green-700" />
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-700 transition-all duration-500"
                  style={{ width: `${personalConcerns * 10}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs">
              <Flower size={14} className="text-purple-500" />
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${achievements * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenVisualization;
