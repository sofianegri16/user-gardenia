
import React, { useRef } from 'react';
import * as THREE from 'three';

interface TreeProps {
  position?: [number, number, number];
  onElementClick: (element: 'weather' | 'mentalPressure' | 'exceptionalDay') => void;
  hovered: string | null;
  handlePointerOver: (element: string) => void;
  handlePointerOut: () => void;
  mentalPressure: number;
  exceptionalDay: number;
  fruits: Array<{
    position: [number, number, number];
    scale: number;
  }>;
}

const Tree: React.FC<TreeProps> = ({
  position = [0, 0, 0],
  onElementClick,
  hovered,
  handlePointerOver,
  handlePointerOut,
  mentalPressure,
  exceptionalDay,
  fruits
}) => {
  const leavesRef = useRef<THREE.Group>(null);
  const fruitsRef = useRef<THREE.Group>(null);
  
  // Geometrías y materiales reutilizables
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 12);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.8 });
  
  const foliageGeometry = new THREE.SphereGeometry(1.2, 16, 16);
  const foliageMaterial = new THREE.MeshStandardMaterial({ 
    color: '#2E8B57',
    roughness: 0.7,
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      <group 
        onClick={() => onElementClick('weather')}
        onPointerOver={() => handlePointerOver('weather')}
        onPointerOut={handlePointerOut}
      >
        {/* Tronco del árbol */}
        <mesh 
          geometry={trunkGeometry}
          material={trunkMaterial}
          position={[0, 1, 0]} 
          castShadow 
          receiveShadow
          scale={hovered === 'weather' ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        
        {/* Copa del árbol */}
        <mesh 
          geometry={foliageGeometry}
          material={foliageMaterial}
          position={[0, 2.8, 0]} 
          castShadow
          scale={hovered === 'weather' ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        
        {/* Hojas animadas */}
        <group ref={leavesRef} position={[0, 2.8, 0]}>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh 
              key={`leaf-${i}`}
              position={[
                Math.random() * 1.6 - 0.8,
                Math.random() * 1.6 - 0.8,
                Math.random() * 1.6 - 0.8
              ]}
              rotation={[
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
              ]}
              onClick={(e) => {
                e.stopPropagation();
                onElementClick('mentalPressure');
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                handlePointerOver('mentalPressure');
              }}
              onPointerOut={handlePointerOut}
            >
              <planeGeometry args={[0.3, 0.5]} />
              <meshStandardMaterial 
                color="#3CB371" 
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
        </group>
        
        {/* Frutos (si es un día excepcional) */}
        <group 
          ref={fruitsRef} 
          position={[0, 2.8, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onElementClick('exceptionalDay');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            handlePointerOver('exceptionalDay');
          }}
          onPointerOut={handlePointerOut}
        >
          {fruits.map((fruit, i) => (
            <mesh 
              key={`fruit-${i}`} 
              position={fruit.position} 
              scale={[fruit.scale, fruit.scale, fruit.scale]}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#FF0000" roughness={0.4} />
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
                <meshStandardMaterial color="#5D4037" />
              </mesh>
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

export default Tree;
