
import React, { forwardRef } from 'react';
import * as THREE from 'three';

interface RootsProps {
  onElementClick: (element: 'personalConcerns') => void;
  handlePointerOver: (element: string) => void;
  handlePointerOut: () => void;
  scale: [number, number, number];
}

const Roots = forwardRef<THREE.Group, RootsProps>(({
  onElementClick,
  handlePointerOver,
  handlePointerOut,
  scale
}, ref) => {
  return (
    <group 
      ref={ref}
      position={[0, -0.1, 0]}
      onClick={() => onElementClick('personalConcerns')}
      onPointerOver={() => handlePointerOver('personalConcerns')}
      onPointerOut={handlePointerOut}
      scale={scale}
    >
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const length = 0.3 + Math.random() * 0.4;
        const curve = Math.random() * 0.2;
        
        return (
          <mesh key={`root-${i}`} position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                  Math.sin(angle) * 0.3,
                  -0.15,
                  Math.cos(angle) * 0.3
                ),
                new THREE.Vector3(
                  Math.sin(angle) * (0.3 + length),
                  -0.3 - curve,
                  Math.cos(angle) * (0.3 + length)
                )
              ]),
              12,
              0.04,
              8,
              false
            ]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
});

Roots.displayName = 'Roots';

export default Roots;
