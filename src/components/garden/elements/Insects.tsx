
import React, { forwardRef } from 'react';
import * as THREE from 'three';

interface InsectsProps {
  bugs: Array<{
    position: [number, number, number];
    type: string;
    speed: number;
    radius: number;
    phase: number;
    wingPhase: number;
  }>;
}

const Insects = forwardRef<THREE.Group, InsectsProps>(({ bugs }, ref) => {
  return (
    <group ref={ref}>
      {bugs.map((bug, i) => {
        if (bug.type === 'butterfly') {
          return (
            <group key={`butterfly-${i}`} position={bug.position}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
              
              {/* Alas */}
              <group position={[0, 0, 0]}>
                <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0]}>
                  <planeGeometry args={[0.2, 0.15]} />
                  <meshStandardMaterial
                    color="#FF69B4"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </group>
              
              <group position={[0, 0, 0]}>
                <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0]}>
                  <planeGeometry args={[0.2, 0.15]} />
                  <meshStandardMaterial
                    color="#FF69B4"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </group>
            </group>
          );
        } else {
          return (
            <group key={`bee-${i}`} position={bug.position}>
              <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.05, 0.1, 8, 8]} />
                <meshStandardMaterial color="#FFD700" />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.05, 0.1, 8, 8]} />
                <meshStandardMaterial color="#000000" wireframe />
              </mesh>
              
              {/* Alas */}
              <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.15, 0.1]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          );
        }
      })}
    </group>
  );
});

Insects.displayName = 'Insects';

export default Insects;
