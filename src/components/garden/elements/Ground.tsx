
import React from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

interface GroundProps {
  weather: WeatherType;
  groundColors: Record<WeatherType, THREE.Color>;
}

const Ground: React.FC<GroundProps> = ({ weather, groundColors }) => {
  // Crear textura de hierba
  const createGrassTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Color de fondo según el clima
      const bgColorHex = groundColors[weather].getHexString();
      ctx.fillStyle = `#${bgColorHex}`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar briznas de hierba
      const grassCount = 500;
      const grassColors = [
        weather === 'sunny' ? '#8BC34A' : weather === 'cloudy' ? '#689F38' : '#33691E',
        weather === 'sunny' ? '#7CB342' : weather === 'cloudy' ? '#558B2F' : '#2E7D32',
        weather === 'sunny' ? '#9CCC65' : weather === 'cloudy' ? '#7CB342' : '#388E3C'
      ];
      
      for (let i = 0; i < grassCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const height = 5 + Math.random() * 15;
        const width = 1 + Math.random() * 2;
        
        ctx.fillStyle = grassColors[Math.floor(Math.random() * grassColors.length)];
        ctx.fillRect(x, y, width, height);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    
    return texture;
  };
  
  return (
    <group>
      {/* Terreno principal */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial 
          color={groundColors[weather]}
          map={createGrassTexture()}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Elementos decorativos aleatorios */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 6;
        const posX = Math.sin(angle) * radius;
        const posZ = Math.cos(angle) * radius;
        
        return (
          <group key={`ground-decor-${i}`} position={[posX, 0.05, posZ]}>
            {/* Pequeñas rocas o elementos decorativos */}
            {Math.random() > 0.7 && (
              <mesh>
                <sphereGeometry args={[0.1 + Math.random() * 0.1, 8, 8, 0, Math.PI]} />
                <meshStandardMaterial color="#9E9E9E" roughness={0.9} />
              </mesh>
            )}
            
            {/* Pequeños montículos */}
            {Math.random() > 0.8 && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.2 + Math.random() * 0.2, 8]} />
                <meshStandardMaterial color="#795548" roughness={0.8} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default Ground;
