
import React, { forwardRef } from 'react';
import * as THREE from 'three';

interface WaterProps {
  position: [number, number, number];
  onElementClick: (element: 'energy') => void;
  handlePointerOver: (element: string) => void;
  handlePointerOut: () => void;
  scale: [number, number, number];
}

const Water = forwardRef<THREE.Group, WaterProps>(({
  position,
  onElementClick,
  handlePointerOver,
  handlePointerOut,
  scale
}, ref) => {
  return (
    <group 
      ref={ref}
      position={position}
      onClick={() => onElementClick('energy')}
      onPointerOver={() => handlePointerOver('energy')}
      onPointerOut={handlePointerOut}
      scale={scale}
    >
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial 
          color="#4682B4" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Ondas de agua */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh 
          key={`water-ring-${i}`} 
          position={[0, 0.12 + i * 0.01, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.7 - i * 0.2, 0.8 - i * 0.2, 32]} />
          <meshStandardMaterial 
            color="#87CEEB" 
            transparent 
            opacity={0.4 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
});

Water.displayName = 'Water';

export default Water;
