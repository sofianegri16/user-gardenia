
import React, { forwardRef } from 'react';
import * as THREE from 'three';

interface RootsProps {
  onElementClick: (element: 'personalConcerns') => void;
  handlePointerOver: (element: string) => void;
  handlePointerOut: () => void;
  scale: [number, number, number];
  personalConcerns: number;
}

const Roots = forwardRef<THREE.Group, RootsProps>(({
  onElementClick,
  handlePointerOver,
  handlePointerOut,
  scale,
  personalConcerns
}, ref) => {
  // Color y escala de las raíces basados en el nivel de preocupación
  const rootColor = new THREE.Color('#8B4513').lerp(
    new THREE.Color('#A0522D'),
    personalConcerns / 10
  );
  
  const rootLength = 0.3 + (personalConcerns / 10) * 0.5;
  
  return (
    <group 
      ref={ref}
      position={[0, -0.1, 0]}
      onClick={() => onElementClick('personalConcerns')}
      onPointerOver={() => handlePointerOver('personalConcerns')}
      onPointerOut={handlePointerOut}
      scale={scale}
    >
      {/* Raíces principales */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const curveIntensity = 0.2 + (Math.random() * 0.3);
        
        return (
          <group key={`root-group-${i}`}>
            {/* Raíz principal */}
            <mesh key={`root-${i}`}>
              <tubeGeometry args={[
                new THREE.CatmullRomCurve3([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(
                    Math.sin(angle) * 0.4,
                    -0.2,
                    Math.cos(angle) * 0.4
                  ),
                  new THREE.Vector3(
                    Math.sin(angle) * (0.4 + rootLength),
                    -0.4 - curveIntensity,
                    Math.cos(angle) * (0.4 + rootLength)
                  )
                ]),
                16,
                0.05,
                8,
                false
              ]} />
              <meshStandardMaterial 
                color={rootColor} 
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
            
            {/* Raíces secundarias */}
            {Array.from({ length: 3 }).map((_, j) => {
              const subAngle = angle + (Math.random() * 0.5 - 0.25);
              const startPoint = j * 0.3;
              
              return (
                <mesh key={`sub-root-${i}-${j}`}>
                  <tubeGeometry args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(
                        Math.sin(angle) * (0.2 + startPoint),
                        -0.1 - startPoint * 0.3,
                        Math.cos(angle) * (0.2 + startPoint)
                      ),
                      new THREE.Vector3(
                        Math.sin(subAngle) * (0.3 + startPoint + rootLength * 0.3),
                        -0.2 - startPoint * 0.4,
                        Math.cos(subAngle) * (0.3 + startPoint + rootLength * 0.3)
                      )
                    ]),
                    8,
                    0.02,
                    6,
                    false
                  ]} />
                  <meshStandardMaterial 
                    color={rootColor} 
                    roughness={0.9}
                    metalness={0.1}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
});

Roots.displayName = 'Roots';

export default Roots;
