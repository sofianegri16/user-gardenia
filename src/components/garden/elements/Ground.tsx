
import React from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

interface GroundProps {
  weather: WeatherType;
  groundColors: Record<WeatherType, THREE.Color>;
}

const Ground: React.FC<GroundProps> = ({ weather, groundColors }) => {
  // Geometrías y materiales reutilizables
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: groundColors[weather],
    roughness: 0.8,
  });
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.1, 0]} 
      receiveShadow
      geometry={groundGeometry}
      material={groundMaterial}
    >
      {/* Texturas de césped */}
      <group>
        {Array.from({ length: 200 }).map((_, i) => (
          <mesh 
            key={`grass-${i}`} 
            position={[
              Math.random() * 16 - 8,
              0.05,
              Math.random() * 16 - 8
            ]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            <planeGeometry args={[0.05, 0.2]} />
            <meshStandardMaterial 
              color={weather === 'sunny' ? '#7CFC00' : weather === 'cloudy' ? '#669966' : '#3A5F0B'} 
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </mesh>
  );
};

export default Ground;
