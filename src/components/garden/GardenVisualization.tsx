
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Droplet, Wind, Flower, Apple, Leaf, 
  Sun, Cloud, CloudRain, X, TreeDeciduous, TreePine, Butterfly
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
  
  // Estados para animaciones y interacción
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeInteraction, setActiveInteraction] = useState<InteractionType>(null);
  
  // Inicia animación cuando se monta el componente o cambian los datos
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [energy, mentalPressure, personalConcerns, achievements, exceptionalDay, weather]);

  // Calculamos parámetros visuales basados en los datos emocionales
  const treeHeight = Math.max(45, Math.min(90, (energy + achievements) * 4));
  const rootsWidth = Math.max(30, Math.min(100, personalConcerns * 8));
  const fruitsCount = exceptionalDay === 1 ? 5 : 0;
  const flowersCount = Math.min(10, Math.max(0, Math.floor(achievements / 1.5)));
  const windIntensity = mentalPressure;
  const waterLevel = Math.max(8, energy * 3);

  // Manejadores de interacción
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
      {/* Escena principal - Jardín isométrico 3D */}
      <div className="absolute inset-0 garden-scene perspective-1000 bg-gradient-to-b from-green-50 to-green-100">
        {/* Cielo según el clima */}
        <div 
          className={cn(
            "w-full h-32 transition-colors duration-1000 relative overflow-hidden",
            weather === 'sunny' ? "bg-gradient-to-b from-sky-400 to-blue-300" : 
            weather === 'cloudy' ? "bg-gradient-to-b from-gray-400 to-gray-300" : 
            "bg-gradient-to-b from-indigo-700 to-gray-500"
          )}
          onClick={() => handleElementClick('weather')}
        >
          {/* Tooltip para interacción */}
          <div className="garden-tooltip">
            Cambiar clima y estado emocional
          </div>
          
          {/* Elementos del cielo según el clima */}
          {weather === 'sunny' && (
            <div className="absolute top-6 right-10 text-yellow-300 animate-[pulse_3s_ease-in-out_infinite]">
              <Sun size={48} className="drop-shadow-lg" />
            </div>
          )}
          
          {weather === 'cloudy' && (
            <>
              <div className="absolute top-6 right-10 text-gray-200 animate-[float_20s_ease-in-out_infinite]">
                <Cloud size={40} className="drop-shadow-md" />
              </div>
              <div className="absolute top-12 right-24 text-gray-300 animate-[float_15s_ease-in-out_infinite_reverse]">
                <Cloud size={28} />
              </div>
              <div className="absolute top-5 left-10 text-gray-200 animate-[float_25s_ease-in-out_infinite]">
                <Cloud size={36} />
              </div>
            </>
          )}
          
          {weather === 'rainy' && (
            <>
              <div className="absolute top-4 left-0 right-0 flex justify-around">
                <CloudRain size={38} className="text-gray-400 animate-[float_12s_ease-in-out_infinite]" />
                <CloudRain size={46} className="text-gray-500 animate-[float_15s_ease-in-out_infinite_reverse]" />
                <CloudRain size={42} className="text-gray-400 animate-[float_18s_ease-in-out_infinite]" />
              </div>
              <div className="absolute inset-0">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-blue-300/80 w-[1px] h-6 rounded-full animate-[fall_1.5s_linear_infinite]"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 30}%`,
                      animationDuration: `${0.7 + Math.random() * 1.5}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Escena isométrica del jardín */}
        <div className="relative w-full h-[568px] perspective-1200 preserve-3d">
          {/* Suelo con césped texturizado */}
          <div className="absolute inset-0 transform rotate-x-60 origin-bottom">
            <div 
              className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-600"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.9)),
                  url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,.1)' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")
                `,
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.1)'
              }}
            />

            {/* Grid para mejor efecto isométrico */}
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg, 
                    rgba(255,255,255,0.05) 0px, 
                    rgba(255,255,255,0.05) 1px, 
                    transparent 1px, 
                    transparent 25px
                  ), 
                  repeating-linear-gradient(
                    90deg, 
                    rgba(255,255,255,0.05) 0px, 
                    rgba(255,255,255,0.05) 1px, 
                    transparent 1px, 
                    transparent 25px
                  )
                `
              }}
            />
          </div>

          {/* Nivel de agua (energía) */}
          <div 
            className="absolute left-0 right-0 bottom-0 transform rotate-x-60 origin-bottom interactive-element"
            style={{ height: `${waterLevel}px` }}
            onClick={() => handleElementClick('energy')}
          >
            <div className="absolute inset-0 bg-blue-400/20 animate-pulse">
              {/* Efecto de ondas */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-400/30"
                  style={{
                    width: `${30 + i * 20}px`,
                    height: `${30 + i * 20}px`,
                    left: `${20 + Math.random() * 50}%`,
                    top: `${Math.random() * 80}%`,
                    animation: `pulse ${2 + i * 0.5}s infinite ease-out`,
                    animationDelay: `${i * 0.7}s`
                  }}
                />
              ))}
            </div>
            
            {/* Gotas de agua */}
            {Array.from({ length: Math.floor(energy / 2) }).map((_, i) => (
              <div 
                key={i}
                className="absolute"
                style={{ 
                  bottom: `${2 + Math.random() * 6}px`, 
                  left: `${5 + i * 12 + Math.random() * 10}%`,
                }}
              >
                <Droplet size={16} className="text-blue-400/70 fill-blue-300/50 drop-shadow-sm" />
              </div>
            ))}
            
            {/* Tooltip para energía */}
            <div className="garden-tooltip">
              Ajustar nivel de energía
            </div>
          </div>

          {/* Árbol central con sistema de raíces integrado */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 preserve-3d">
            {/* Sistema de raíces integrado */}
            <div 
              className="absolute left-0 bottom-0 transform rotate-x-60 origin-bottom interactive-element"
              style={{ width: `${rootsWidth}px` }}
              onClick={() => handleElementClick('personalConcerns')}
            >
              <svg 
                width={rootsWidth} 
                height="50" 
                viewBox={`0 0 ${rootsWidth} 50`} 
                className="transform"
              >
                <path 
                  d={`M${rootsWidth/2},0 Q${rootsWidth/2 - personalConcerns*2},15 ${rootsWidth/2 - personalConcerns*3},40 M${rootsWidth/2},0 Q${rootsWidth/2 + personalConcerns*2},15 ${rootsWidth/2 + personalConcerns*3},40`} 
                  stroke="#8B4513" 
                  strokeWidth="3" 
                  fill="transparent"
                />
                <path 
                  d={`M${rootsWidth/2},5 Q${rootsWidth/2 - personalConcerns},20 ${rootsWidth/2 - personalConcerns*1.5},45 M${rootsWidth/2},5 Q${rootsWidth/2 + personalConcerns},20 ${rootsWidth/2 + personalConcerns*1.5},45`} 
                  stroke="#8B4513" 
                  strokeWidth="2" 
                  fill="transparent"
                />
                <path 
                  d={`M${rootsWidth/2},8 Q${rootsWidth/2 - personalConcerns/2},25 ${rootsWidth/2 - personalConcerns/2},50 M${rootsWidth/2},8 Q${rootsWidth/2 + personalConcerns/2},25 ${rootsWidth/2 + personalConcerns/2},50`} 
                  stroke="#8B4513" 
                  strokeWidth="1.5" 
                  fill="transparent"
                />
              </svg>
              
              {/* Tooltip para raíces */}
              <div className="garden-tooltip">
                Ajustar nivel de preocupaciones
              </div>
            </div>

            {/* Tronco del árbol */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 interactive-element"
              onClick={() => handleElementClick('mentalPressure')}
            >
              <div 
                className="relative bg-gradient-to-t from-yellow-800 via-yellow-700 to-yellow-600 rounded-md translate-z-2"
                style={{ 
                  width: '18px',
                  height: `${treeHeight + 20}px`,
                  boxShadow: '2px 4px 6px rgba(0,0,0,0.2)'
                }}
              >
                {/* Textura del tronco */}
                <div className="absolute inset-0 overflow-hidden rounded-md">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute bg-yellow-900/20 rounded-full"
                      style={{
                        height: '3px',
                        width: '70%',
                        left: '15%',
                        top: `${10 + i * 12}%`,
                        transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`
                      }}
                    />
                  ))}
                </div>

                {/* Tooltip para el tronco */}
                <div className="garden-tooltip">
                  Ajustar presión mental
                </div>
              </div>

              {/* Copa del árbol unificada */}
              <div 
                className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-z-3 translate-y-neg",
                  windIntensity > 7 ? "animate-[sway_1s_ease-in-out_infinite]" : 
                  windIntensity > 4 ? "animate-[sway_2s_ease-in-out_infinite]" : "",
                  isAnimating ? "animate-scale-in" : ""
                )}
                style={{ 
                  transform: `translateZ(3px) translateY(-${treeHeight * 0.9}px)`,
                }}
              >
                {/* Forma principal de la copa */}
                <div 
                  className="bg-gradient-to-b from-green-700 to-green-600 rounded-[40%]"
                  style={{ 
                    width: `${treeHeight * 0.9}px`, 
                    height: `${treeHeight * 1.1}px`,
                    boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Textura para la copa */}
                  <div className="absolute inset-0 rounded-[40%] overflow-hidden">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute bg-green-800/20 rounded-full"
                        style={{
                          height: `${20 + Math.random() * 30}%`,
                          width: `${20 + Math.random() * 30}%`,
                          left: `${Math.random() * 80}%`,
                          top: `${Math.random() * 80}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hojas adicionales para dar profundidad */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "absolute transform",
                      windIntensity > 4 ? "animate-[shake_2s_ease-in-out_infinite]" : ""
                    )}
                    style={{
                      left: `${-20 + Math.random() * 130}%`,
                      top: `${-10 + Math.random() * 110}%`,
                      transform: `translateZ(${1 + Math.random() * 5}px) rotate(${Math.random() * 360}deg)`,
                      transformOrigin: 'center bottom',
                      zIndex: Math.floor(Math.random() * 30)
                    }}
                  >
                    <Leaf 
                      size={22 + Math.floor(Math.random() * 10)} 
                      className={cn(
                        "text-green-600",
                        i % 2 === 0 ? "fill-green-700/80" : "fill-green-600/80"
                      )} 
                    />
                  </div>
                ))}

                {/* Frutos integrados en la copa (solo si es día excepcional) */}
                {fruitsCount > 0 && (
                  <div 
                    className="absolute inset-0 interactive-element"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementClick('exceptionalDay');
                    }}
                  >
                    {Array.from({ length: fruitsCount }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute"
                        style={{ 
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          transform: `translateZ(6px)`,
                          zIndex: 30
                        }}
                      >
                        <div className="relative">
                          <div className="w-5 h-5 bg-red-500 rounded-full shadow-md"></div>
                          <div className="absolute -top-1 left-2 w-1.5 h-3 bg-green-700 rounded-sm"></div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Tooltip para día excepcional */}
                    <div className="garden-tooltip">
                      ¿Día excepcional?
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Flores - representación de logros */}
          <div 
            className="absolute inset-x-8 bottom-2 h-20 transform rotate-x-60 origin-bottom interactive-element"
            onClick={() => handleElementClick('achievements')}
          >
            {flowersCount > 0 && (
              <>
                {Array.from({ length: flowersCount }).map((_, i) => {
                  const leftPos = 5 + (i * 90 / flowersCount) + (Math.sin(i) * 5);
                  const heightVar = 14 + Math.floor(Math.random() * 6);
                  
                  return (
                    <div 
                      key={i}
                      className="absolute bottom-1 transform"
                      style={{ 
                        left: `${leftPos}%`,
                        transform: 'translateZ(2px)',
                      }}
                    >
                      {/* Tallo */}
                      <div 
                        className="w-1 bg-green-700 transform" 
                        style={{ 
                          height: `${heightVar}px`,
                          transform: `rotate(${-5 + Math.random() * 10}deg)`,
                          transformOrigin: 'bottom center',
                          boxShadow: '1px 1px 1px rgba(0,0,0,0.1)'
                        }}
                      />
                      
                      {/* Flor */}
                      <div 
                        className="absolute -top-4 -left-3 flex transform translate-z-1"
                      >
                        <Flower 
                          size={16} 
                          className={cn(
                            i % 5 === 0 ? "text-purple-400" : 
                            i % 5 === 1 ? "text-pink-400" : 
                            i % 5 === 2 ? "text-yellow-400" : 
                            i % 5 === 3 ? "text-blue-400" : 
                            "text-red-400",
                            "drop-shadow-sm",
                            "animate-[sway_3s_ease-in-out_infinite]"
                          )}
                          style={{
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            
            {/* Tooltip para logros */}
            <div className="garden-tooltip transform translate-z-4">
              Ajustar nivel de logros
            </div>
          </div>

          {/* Arbustos decorativos integrados */}
          <div className="absolute bottom-0 left-0 right-0 transform rotate-x-60 origin-bottom">
            {/* Arbusto izquierdo */}
            <div 
              className="absolute bottom-2 left-6 transform translate-z-1"
            >
              <TreePine 
                size={42} 
                className="text-green-800 fill-green-700/90 drop-shadow-md" 
              />
            </div>
            
            {/* Arbusto derecho */}
            <div 
              className="absolute bottom-2 right-6 transform translate-z-1"
            >
              <TreeDeciduous 
                size={36} 
                className="text-green-800 fill-green-700/90 drop-shadow-md" 
              />
            </div>
          </div>

          {/* Elementos animados: mariposas y abejas */}
          {energy > 6 && (
            <>
              {/* Mariposas */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={`butterfly-${i}`}
                  className="absolute transform"
                  style={{ 
                    top: `${15 + i * 15}%`, 
                    left: `${30 + i * 20}%`, 
                    animation: `fly ${8 + i * 4}s ease-in-out infinite ${i % 2 === 0 ? '' : 'alternate'}`,
                    zIndex: 40,
                    transform: 'translateZ(10px)'
                  }}
                >
                  <Butterfly 
                    size={i % 2 === 0 ? 18 : 16} 
                    className={cn(
                      i % 3 === 0 ? "text-purple-300" : 
                      i % 3 === 1 ? "text-pink-300" : "text-blue-300",
                      "drop-shadow-sm animate-[pulse_2s_ease-in-out_infinite]"
                    )} 
                    style={{
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                </div>
              ))}
            </>
          )}

          {/* Abejas que aparecen si hay logros significativos */}
          {achievements > 7 && (
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <div 
                  key={`bee-${i}`}
                  className="absolute"
                  style={{ 
                    top: `${35 + i * 15}%`, 
                    left: i % 2 === 0 ? '30%' : '65%',
                    animation: `fly ${3 + i * 2}s ease-in-out infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                    zIndex: 40,
                    transform: 'translateZ(15px)'
                  }}
                >
                  <div className="relative">
                    <div className="w-4 h-3 bg-yellow-400 rounded-full relative drop-shadow-md">
                      <div className="absolute inset-0 bg-black/40 rounded-full" 
                           style={{ clipPath: 'polygon(0 34%, 33% 34%, 33% 67%, 66% 67%, 66% 34%, 100% 34%, 100% 67%, 0 67%)' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                    <div className="w-2 h-1 bg-gray-300 ml-0.5 animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Modales contextuales para interacción */}
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
