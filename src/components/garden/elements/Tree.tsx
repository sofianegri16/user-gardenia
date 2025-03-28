
import React, { useRef } from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

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
  
  // Factores de escala basados en la presión mental (árbol más encorvado con más presión)
  const trunkScaleFactor = 1 - (mentalPressure / 30); // Sutil cambio en el tronco
  const leafMovementFactor = mentalPressure / 15; // Afecta el movimiento de las hojas
  
  // Geometrías y materiales mejorados
  const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2.4, 16);
  const trunkMaterial = new THREE.MeshStandardMaterial({ 
    color: '#8B4513', 
    roughness: 0.8,
    metalness: 0.1,
    bumpScale: 0.1 
  });
  
  const foliageGeometry = new THREE.SphereGeometry(1.4, 24, 20);
  const foliageMaterial = new THREE.MeshStandardMaterial({ 
    color: '#2E8B57',
    roughness: 0.7,
    metalness: 0.1,
    flatShading: true
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      <group 
        onClick={() => onElementClick('weather')}
        onPointerOver={() => handlePointerOver('weather')}
        onPointerOut={handlePointerOut}
      >
        {/* Tronco del árbol mejorado */}
        <mesh 
          geometry={trunkGeometry}
          material={trunkMaterial}
          position={[0, 1.2, 0]} 
          castShadow 
          receiveShadow
          scale={[
            hovered === 'weather' ? 1.05 : 1, 
            hovered === 'weather' ? 1.05 : 1 * trunkScaleFactor, 
            hovered === 'weather' ? 1.05 : 1
          ]}
        >
          {/* Añadir textura de corteza */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh 
              key={`bark-${i}`} 
              position={[
                (Math.random() * 0.1 - 0.05) * Math.sin(i * Math.PI / 5),
                -0.5 + i * 0.2,
                (Math.random() * 0.1 - 0.05) * Math.cos(i * Math.PI / 5)
              ]}
              scale={[0.3, 0.05, 0.3]}
            >
              <boxGeometry args={[1, 1, 0.2]} />
              <meshStandardMaterial color="#6F4E37" roughness={1} />
            </mesh>
          ))}
        </mesh>
        
        {/* Copa del árbol mejorada */}
        <mesh 
          geometry={foliageGeometry}
          material={foliageMaterial}
          position={[0, 3.2, 0]} 
          castShadow
          scale={hovered === 'weather' ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        
        {/* Hojas animadas mejoradas */}
        <group ref={leavesRef} position={[0, 3.2, 0]}>
          {Array.from({ length: 25 }).map((_, i) => (
            <mesh 
              key={`leaf-${i}`}
              position={[
                Math.random() * 1.8 - 0.9,
                Math.random() * 1.8 - 0.9,
                Math.random() * 1.8 - 0.9
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
              <planeGeometry args={[0.4, 0.6]} />
              <meshStandardMaterial 
                color={new THREE.Color("#3CB371").lerp(new THREE.Color("#4CAF50"), Math.random() * 0.5)} 
                side={THREE.DoubleSide}
                transparent
                opacity={0.95}
              />
            </mesh>
          ))}
        </group>
        
        {/* Frutos mejorados (visualización de día excepcional) */}
        <group 
          ref={fruitsRef} 
          position={[0, 3.2, 0]}
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
              <meshStandardMaterial 
                color={new THREE.Color("#FF0000").lerp(new THREE.Color("#FF6347"), Math.random() * 0.3)} 
                roughness={0.4} 
                metalness={0.2}
              />
              <mesh position={[0, 0.9, 0]}>
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
