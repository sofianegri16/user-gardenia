
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Droplet, Wind, Flower, Leaf, Apple,
  Sun, Cloud, CloudRain, X, TreeDeciduous, Bird
} from 'lucide-react';
import { WeatherType } from '@/types/garden';
import { cn } from '@/lib/utils';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import GardenScene from './GardenScene';
import InteractionPanel from './InteractionPanel';

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
        <InteractionPanel
          activeInteraction={activeInteraction}
          energy={energy}
          mentalPressure={mentalPressure}
          personalConcerns={personalConcerns}
          achievements={achievements}
          exceptionalDay={exceptionalDay}
          weather={weather}
          weatherEmotions={weatherEmotions}
          handleCloseInteraction={handleCloseInteraction}
          handleUpdateValue={handleUpdateValue}
          handleUpdateWeather={handleUpdateWeather}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default GardenVisualization;
