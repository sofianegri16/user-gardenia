
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
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color={skyColors[weather]} side={THREE.BackSide} />
    </mesh>
  );
};

export default Sky;
