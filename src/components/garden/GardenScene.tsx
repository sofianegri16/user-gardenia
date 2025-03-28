
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { WeatherType } from '@/types/garden';
import * as THREE from 'three';

// Importar los componentes refactorizados
import Tree from './elements/Tree';
import Ground from './elements/Ground';
import Sky from './elements/Sky';
import Roots from './elements/Roots';
import Water from './elements/Water';
import Flowers from './elements/Flowers';
import WeatherElements from './elements/Weather';
import Insects from './elements/Insects';

interface GardenSceneProps {
  energy: number;
  mentalPressure: number;
  personalConcerns: number;
  achievements: number;
  exceptionalDay: number;
  weather: WeatherType;
  onElementClick: (element: 'energy' | 'mentalPressure' | 'personalConcerns' | 'achievements' | 'exceptionalDay' | 'weather') => void;
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
  const sceneRef = useRef<THREE.Group>(null);
  const rootsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Group>(null);
  const skyRef = useRef<THREE.Mesh>(null);
  const raindropsRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const bugsRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState<string | null>(null);
  const { viewport } = useThree();
  
  // Colores según el clima
  const skyColors = useMemo(() => ({
    sunny: new THREE.Color('#87CEEB'),
    cloudy: new THREE.Color('#B0C4DE'),
    rainy: new THREE.Color('#4682B4'),
  }), []);
  
  const groundColors = useMemo(() => ({
    sunny: new THREE.Color('#7CFC00'),
    cloudy: new THREE.Color('#669966'),
    rainy: new THREE.Color('#3A5F0B'),
  }), []);
  
  // Crear las gotas de lluvia cuando el clima es lluvioso
  const raindrops = useMemo(() => {
    if (weather !== 'rainy') return [];
    
    return Array.from({ length: 100 }).map(() => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 10 + 5,
        Math.random() * 20 - 10
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.2,
      size: 0.02 + Math.random() * 0.03
    }));
  }, [weather]);
  
  // Crear nubes cuando el clima es nublado o lluvioso
  const clouds = useMemo(() => {
    if (weather === 'sunny') return [];
    
    return Array.from({ length: weather === 'cloudy' ? 8 : 12 }).map(() => ({
      position: [
        Math.random() * 16 - 8,
        Math.random() * 2 + 7,
        Math.random() * 16 - 8
      ] as [number, number, number],
      scale: [
        0.5 + Math.random() * 1.5,
        0.5 + Math.random() * 0.5,
        0.5 + Math.random() * 1.5
      ] as [number, number, number],
      speed: 0.001 + Math.random() * 0.002
    }));
  }, [weather]);
  
  // Crear flores basadas en el nivel de logros
  const flowers = useMemo(() => {
    const flowerCount = Math.max(0, Math.floor(achievements / 2));
    
    return Array.from({ length: flowerCount }).map(() => ({
      position: [
        Math.random() * 14 - 7,
        0.1,
        Math.random() * 14 - 7
      ] as [number, number, number],
      color: [
        ['#FF69B4', '#FF1493', '#DB7093'][Math.floor(Math.random() * 3)],
        ['#FFFF00', '#FFD700', '#FFA500'][Math.floor(Math.random() * 3)],
      ][Math.floor(Math.random() * 2)],
      scale: 0.15 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, [achievements]);
  
  // Crear frutos si es un día excepcional
  const fruits = useMemo(() => {
    if (exceptionalDay !== 1) return [];
    
    return Array.from({ length: 5 }).map(() => ({
      position: [
        Math.random() * 1.6 - 0.8,
        Math.random() * 1.6 - 0.8,
        Math.random() * 1.6 - 0.8
      ] as [number, number, number],
      scale: 0.12 + Math.random() * 0.08,
    }));
  }, [exceptionalDay]);
  
  // Crear mariposas/abejas
  const bugs = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      position: [
        Math.random() * 12 - 6,
        1 + Math.random() * 4,
        Math.random() * 12 - 6
      ] as [number, number, number],
      type: Math.random() > 0.5 ? 'butterfly' : 'bee',
      speed: 0.01 + Math.random() * 0.02,
      radius: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      wingPhase: 0,
    }));
  }, []);
  
  // Animación de las hojas con el viento (presión mental)
  useFrame((state, delta) => {
    if (!sceneRef.current) return;
    
    // Animación del cielo basada en el clima
    if (skyRef.current) {
      const skyMaterial = skyRef.current.material as THREE.MeshBasicMaterial;
      skyMaterial.color.lerp(skyColors[weather], 0.01);
    }
    
    // Animación del suelo basada en el clima
    if (sceneRef.current.children[0]) {
      const groundMesh = sceneRef.current.children[0] as THREE.Mesh;
      const groundMat = groundMesh.material as THREE.MeshStandardMaterial;
      groundMat.color.lerp(groundColors[weather], 0.01);
    }
    
    // Animación de las raíces según las preocupaciones personales
    if (rootsRef.current) {
      const scale = 0.5 + (personalConcerns / 10) * 1.5;
      rootsRef.current.scale.set(scale, scale, scale);
    }
    
    // Animación de gotas de lluvia
    if (raindropsRef.current && weather === 'rainy') {
      raindropsRef.current.children.forEach((drop, i) => {
        drop.position.y -= raindrops[i].speed;
        if (drop.position.y < 0) {
          drop.position.y = 10;
        }
      });
    }
    
    // Animación de nubes
    if (cloudsRef.current && (weather === 'cloudy' || weather === 'rainy')) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += clouds[i].speed;
        if (cloud.position.x > 10) {
          cloud.position.x = -10;
        }
      });
    }
    
    // Animación de mariposas y abejas
    if (bugsRef.current) {
      bugsRef.current.children.forEach((bug, i) => {
        const bugData = bugs[i];
        bugData.phase += bugData.speed;
        bugData.wingPhase += 0.2;
        
        bug.position.x = bugData.position[0] + Math.sin(bugData.phase) * bugData.radius;
        bug.position.y = bugData.position[1] + Math.sin(bugData.phase * 1.5) * 0.5;
        bug.position.z = bugData.position[2] + Math.cos(bugData.phase) * bugData.radius;
        
        bug.rotation.y = Math.atan2(
          Math.cos(bugData.phase) * bugData.radius,
          Math.sin(bugData.phase) * bugData.radius
        );
        
        if (bugData.type === 'butterfly') {
          (bug as THREE.Group).children.forEach((wing, j) => {
            wing.rotation.y = Math.sin(bugData.wingPhase) * (j === 0 ? 0.5 : -0.5);
          });
        }
      });
    }
    
    // Nivel de agua basado en la energía
    if (waterRef.current) {
      const targetScale = 0.5 + (energy / 10) * 1.5;
      waterRef.current.scale.y += (targetScale - waterRef.current.scale.y) * 0.05;
    }
  });
  
  // Efectos de hover
  const handlePointerOver = (element: string) => {
    setHovered(element);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  };
  
  // Efectos de escalado
  useEffect(() => {
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
      {/* Suelo */}
      <Ground weather={weather} groundColors={groundColors} />
      
      {/* Cielo */}
      <Sky weather={weather} skyColors={skyColors} skyRef={skyRef} />
      
      {/* Árbol principal */}
      <Tree 
        onElementClick={onElementClick}
        hovered={hovered}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
        mentalPressure={mentalPressure}
        exceptionalDay={exceptionalDay}
        fruits={fruits}
      />
      
      {/* Raíces */}
      <Roots 
        onElementClick={onElementClick}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
        scale={[1, 1, 1]} // Se actualiza dinámicamente en useFrame
        ref={rootsRef}
        personalConcerns={personalConcerns} // Added the missing required prop
      />
      
      {/* Agua (energía) */}
      <Water 
        position={[-3, 0, 2]}
        onElementClick={onElementClick}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
        scale={[1, 1, 1]} // Se actualiza dinámicamente en useFrame
        ref={waterRef}
        energy={energy} // Added the missing required prop
      />
      
      {/* Flores (logros) */}
      <Flowers 
        flowers={flowers}
        onElementClick={onElementClick}
        handlePointerOver={handlePointerOver}
        handlePointerOut={handlePointerOut}
      />
      
      {/* Elementos del clima */}
      <WeatherElements 
        weather={weather}
        raindrops={raindrops}
        clouds={clouds}
        raindropsRef={raindropsRef}
        cloudsRef={cloudsRef}
      />
      
      {/* Insectos */}
      <Insects bugs={bugs} ref={bugsRef} />
    </group>
  );
};

export default GardenScene;
