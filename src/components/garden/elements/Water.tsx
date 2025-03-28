
import React, { forwardRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface WaterProps {
  position: [number, number, number];
  onElementClick: (element: 'energy') => void;
  handlePointerOver: (element: string) => void;
  handlePointerOut: () => void;
  scale: [number, number, number];
  energy: number; // Required prop that was missing
}

const Water = forwardRef<THREE.Group, WaterProps>(({
  position,
  onElementClick,
  handlePointerOver,
  handlePointerOut,
  scale,
  energy
}, ref) => {
  // Estado para la animación de ondas
  const [waveTime, setWaveTime] = useState(0);
  
  // Actualizar animación de ondas
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveTime(prev => prev + 0.05);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Color del agua basado en la energía
  const waterColor = new THREE.Color('#4682B4').lerp(
    new THREE.Color('#87CEEB'), 
    energy / 10
  );
  
  // Transparencia del agua basada en la energía
  const waterOpacity = 0.5 + (energy / 20);
  
  return (
    <group 
      ref={ref}
      position={position}
      onClick={() => onElementClick('energy')}
      onPointerOver={() => handlePointerOver('energy')}
      onPointerOut={handlePointerOut}
      scale={scale}
    >
      {/* Estanque principal mejorado */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial 
          color={waterColor}
          transparent 
          opacity={waterOpacity}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Borde del estanque */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshStandardMaterial color="#8B7D6B" roughness={0.9} />
      </mesh>
      
      {/* Ondas de agua animadas */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh 
          key={`water-ring-${i}`} 
          position={[0, 0.12 + Math.sin(waveTime + i) * 0.02, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.9 - i * 0.2, 1.1 - i * 0.2, 32]} />
          <meshStandardMaterial 
            color={new THREE.Color('#87CEEB').lerp(waterColor, 0.5)} 
            transparent 
            opacity={0.4 - i * 0.1}
          />
        </mesh>
      ))}
      
      {/* Pequeñas plantas acuáticas en el estanque */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <group 
            key={`water-plant-${i}`} 
            position={[
              Math.sin(angle) * 0.8, 
              0.3, 
              Math.cos(angle) * 0.8
            ]}
            rotation={[
              Math.random() * 0.2 - 0.1,
              Math.random() * Math.PI * 2,
              Math.random() * 0.2 - 0.1
            ]}
          >
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial color="#006400" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
});

Water.displayName = 'Water';

export default Water;
