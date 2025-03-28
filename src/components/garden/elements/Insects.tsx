
import React, { forwardRef } from 'react';
import * as THREE from 'three';

interface InsectsProps {
  bugs: Array<{
    position: [number, number, number];
    type: 'butterfly' | 'bee';
    speed: number;
    radius: number;
    phase: number;
    wingPhase: number;
  }>;
}

const Insects = forwardRef<THREE.Group, InsectsProps>(({ bugs }, ref) => {
  return (
    <group ref={ref}>
      {bugs.map((bug, i) => (
        bug.type === 'butterfly' ? (
          <group key={`butterfly-${i}`} position={bug.position}>
            {/* Cuerpo de la mariposa */}
            <mesh>
              <capsuleGeometry args={[0.02, 0.1, 8, 4]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            
            {/* Alas */}
            <mesh rotation={[0, Math.sin(bug.wingPhase) * 0.5, 0]}>
              <planeGeometry args={[0.2, 0.15]} />
              <meshStandardMaterial 
                color={new THREE.Color().setHSL(Math.random(), 0.8, 0.5)} 
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh rotation={[0, Math.sin(bug.wingPhase) * -0.5, 0]}>
              <planeGeometry args={[0.2, 0.15]} />
              <meshStandardMaterial 
                color={new THREE.Color().setHSL(Math.random(), 0.8, 0.5)} 
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        ) : (
          <group key={`bee-${i}`} position={bug.position}>
            {/* Cuerpo de la abeja */}
            <mesh>
              <capsuleGeometry args={[0.03, 0.08, 8, 4]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            
            {/* Rayas */}
            <mesh position={[0, 0, 0.015]}>
              <planeGeometry args={[0.06, 0.08]} />
              <meshStandardMaterial color="#FFD700" side={THREE.DoubleSide} />
            </mesh>
            
            {/* Alas */}
            <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.1, 0.07]} />
              <meshStandardMaterial 
                color="#FFFFFF" 
                transparent 
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <planeGeometry args={[0.1, 0.07]} />
              <meshStandardMaterial 
                color="#FFFFFF" 
                transparent 
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )
      ))}
    </group>
  );
});

Insects.displayName = 'Insects';

export default Insects;
