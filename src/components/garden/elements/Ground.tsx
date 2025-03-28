
import React from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

interface GroundProps {
  weather: WeatherType;
  groundColors: Record<WeatherType, THREE.Color>;
}

const Ground: React.FC<GroundProps> = ({ weather, groundColors }) => {
  // Geometrías y materiales reutilizables
  const groundGeometry = new THREE.PlaneGeometry(25, 25);
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
      {/* Textura de césped mejorada - más denso y realista */}
      <group>
        {Array.from({ length: 500 }).map((_, i) => (
          <mesh 
            key={`grass-${i}`} 
            position={[
              Math.random() * 20 - 10,
              0.05,
              Math.random() * 20 - 10
            ]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            <planeGeometry args={[0.08, 0.25 + Math.random() * 0.15]} />
            <meshStandardMaterial 
              color={
                weather === 'sunny' 
                  ? new THREE.Color('#7CFC00').lerp(new THREE.Color('#A0FF70'), Math.random() * 0.5) 
                  : weather === 'cloudy' 
                    ? new THREE.Color('#669966').lerp(new THREE.Color('#8FB98F'), Math.random() * 0.3) 
                    : new THREE.Color('#3A5F0B').lerp(new THREE.Color('#5A8F2B'), Math.random() * 0.3)
              } 
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.95}
            />
          </mesh>
        ))}
      </group>
    </mesh>
  );
};

export default Ground;
