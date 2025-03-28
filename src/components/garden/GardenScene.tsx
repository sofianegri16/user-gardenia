
import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { WeatherType } from '@/types/garden';
import * as THREE from 'three';

// Import elements
import Tree from './elements/Tree';
import Ground from './elements/Ground';
import Sky from './elements/Sky';
import Roots from './elements/Roots';
import Water from './elements/Water';
import Flowers from './elements/Flowers';
import WeatherElements from './elements/Weather';
import Insects from './elements/Insects';

// Import custom hooks
import { useGardenElements } from './hooks/useGardenElements';
import { useGardenAnimations } from './hooks/useGardenAnimations';
import { useInteractions, InteractionElementType } from './hooks/useInteractions';

interface GardenSceneProps {
  energy: number;
  mentalPressure: number;
  personalConcerns: number;
  achievements: number;
  exceptionalDay: number;
  weather: WeatherType;
  onElementClick: (element: InteractionElementType) => void;
  isAnimating: boolean;
}

const GardenScene: React.FC<GardenSceneProps> = ({
  energy,
  mentalPressure,
  personalConcerns,
  achievements,
  exceptionalDay,
  weather,
  onElementClick,
  isAnimating
}) => {
  // References to elements for animations
  const sceneRef = useRef<THREE.Group>(null);
  const rootsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Group>(null);
  const skyRef = useRef<THREE.Mesh>(null);
  const raindropsRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const bugsRef = useRef<THREE.Group>(null);
  
  const { viewport } = useThree();
  
  // Get garden elements using the custom hook
  const {
    skyColors,
    groundColors,
    raindrops,
    clouds,
    flowers,
    fruits,
    bugs
  } = useGardenElements(weather, achievements, exceptionalDay);
  
  // Interaction state and handlers
  const { hovered, handlePointerOver, handlePointerOut } = useInteractions(isAnimating);
  
  // Apply animations
  useGardenAnimations(
    skyRef,
    rootsRef,
    waterRef,
    raindropsRef,
    cloudsRef,
    bugsRef,
    skyColors,
    groundColors,
    weather,
    raindrops,
    clouds,
    bugs,
    personalConcerns,
    energy
  );
  
  // Apply scale animation when isAnimating changes
  React.useEffect(() => {
    if (isAnimating && sceneRef.current) {
      sceneRef.current.scale.set(0.9, 0.9, 0.9);
      const timeout = setTimeout(() => {
        if (sceneRef.current) {
          sceneRef.current.scale.set(1, 1, 1);
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);
  
  return (
    <group ref={sceneRef}>
      {/* Ground */}
      <Ground weather={weather} groundColors={groundColors} />
      
      {/* Sky */}
      <Sky weather={weather} skyColors={skyColors} skyRef={skyRef} />
      
      {/* Main Tree */}
      <Tree 
        onElementClick={onElementClick}
        hovered={hovered}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
        mentalPressure={mentalPressure}
        exceptionalDay={exceptionalDay}
        fruits={fruits}
      />
      
      {/* Roots */}
      <Roots 
        onElementClick={onElementClick}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
        scale={[1, 1, 1]} 
        ref={rootsRef}
        personalConcerns={personalConcerns}
      />
      
      {/* Water (energy) */}
      <Water 
        position={[-3, 0, 2]}
        onElementClick={onElementClick}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
        scale={[1, 1, 1]} 
        ref={waterRef}
        energy={energy}
      />
      
      {/* Flowers (achievements) */}
      <Flowers 
        flowers={flowers}
        onElementClick={onElementClick}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
      />
      
      {/* Weather Elements */}
      <WeatherElements 
        weather={weather}
        raindrops={raindrops}
        clouds={clouds}
        raindropsRef={raindropsRef}
        cloudsRef={cloudsRef}
      />
      
      {/* Insects */}
      <Insects bugs={bugs} ref={bugsRef} />
    </group>
  );
};

export default GardenScene;
