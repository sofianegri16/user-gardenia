
import React from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

interface RaindropsProps {
  raindrops: Array<{
    position: [number, number, number];
    speed: number;
    size: number;
  }>;
}

const Raindrops: React.FC<RaindropsProps> = ({ raindrops }) => {
  return (
    <group>
      {raindrops.map((drop, i) => (
        <mesh 
          key={`raindrop-${i}`} 
          position={drop.position}
        >
          <capsuleGeometry args={[drop.size / 5, drop.size, 8, 4]} />
          <meshStandardMaterial color="#87CEFA" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

interface CloudsProps {
  clouds: Array<{
    position: [number, number, number];
    scale: [number, number, number];
    speed: number;
  }>;
  weather: WeatherType;
}

const Clouds: React.FC<CloudsProps> = ({ clouds, weather }) => {
  return (
    <group>
      {clouds.map((cloud, i) => (
        <group 
          key={`cloud-${i}`} 
          position={cloud.position}
          scale={cloud.scale}
        >
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial 
              color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
              transparent opacity={0.9} 
            />
          </mesh>
          <mesh position={[0.4, 0, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
              transparent opacity={0.9} 
            />
          </mesh>
          <mesh position={[-0.4, 0, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
              transparent opacity={0.9} 
            />
          </mesh>
          <mesh position={[0, 0, 0.4]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial 
              color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
              transparent opacity={0.9} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

interface WeatherElementsProps {
  weather: WeatherType;
  raindrops: Array<{
    position: [number, number, number];
    speed: number;
    size: number;
  }>;
  clouds: Array<{
    position: [number, number, number];
    scale: [number, number, number];
    speed: number;
  }>;
  raindropsRef: React.RefObject<THREE.Group>;
  cloudsRef: React.RefObject<THREE.Group>;
}

const WeatherElements: React.FC<WeatherElementsProps> = ({ 
  weather, 
  raindrops, 
  clouds,
  raindropsRef,
  cloudsRef 
}) => {
  return (
    <>
      {/* Gotas de lluvia */}
      <group ref={raindropsRef}>
        {weather === 'rainy' && <Raindrops raindrops={raindrops} />}
      </group>
      
      {/* Nubes */}
      <group ref={cloudsRef}>
        {(weather === 'cloudy' || weather === 'rainy') && <Clouds clouds={clouds} weather={weather} />}
      </group>
    </>
  );
};

export default WeatherElements;
