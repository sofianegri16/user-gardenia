
import React from 'react';
import * as THREE from 'three';

interface FlowersProps {
  flowers: Array<{
    position: [number, number, number];
    color: string;
    scale: number;
    rotation: number;
  }>;
  onElementClick: (element: 'achievements') => void;
  handlePointerOver: (element: string) => void;
  handlePointerOut: () => void;
}

const Flowers: React.FC<FlowersProps> = ({
  flowers,
  onElementClick,
  handlePointerOver,
  handlePointerOut
}) => {
  return (
    <group 
      onClick={() => onElementClick('achievements')}
      onPointerOver={() => handlePointerOver('achievements')}
      onPointerOut={handlePointerOut}
    >
      {flowers.map((flower, i) => (
        <group 
          key={`flower-${i}`} 
          position={flower.position} 
          rotation={[0, flower.rotation, 0]}
          scale={[flower.scale, flower.scale, flower.scale]}
        >
          {/* Tallo */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
          
          {/* Pétalos */}
          {Array.from({ length: 5 }).map((_, j) => {
            const petalAngle = (j / 5) * Math.PI * 2;
            return (
              <mesh 
                key={`petal-${i}-${j}`} 
                position={[
                  Math.sin(petalAngle) * 0.2, 
                  1, 
                  Math.cos(petalAngle) * 0.2
                ]}
                rotation={[
                  Math.PI / 3, 
                  0, 
                  petalAngle
                ]}
              >
                <sphereGeometry args={[0.2, 8, 8, 0, Math.PI]} />
                <meshStandardMaterial color={flower.color} side={THREE.DoubleSide} />
              </mesh>
            );
          })}
          
          {/* Centro de la flor */}
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Flowers;
