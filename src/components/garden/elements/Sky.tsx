
import React from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

interface SkyProps {
  weather: WeatherType;
  skyColors: Record<WeatherType, THREE.Color>;
  skyRef: React.RefObject<THREE.Mesh>;
}

const Sky: React.FC<SkyProps> = ({ weather, skyColors, skyRef }) => {
  return (
    <mesh ref={skyRef} position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80]} /> {/* Increased size for better coverage */}
      <meshBasicMaterial 
        color={skyColors[weather]} 
        side={THREE.BackSide} 
        fog={true}
        opacity={weather === 'sunny' ? 0.9 : weather === 'cloudy' ? 0.85 : 0.8}
        transparent={true}
      />
    </mesh>
  );
};

export default Sky;
