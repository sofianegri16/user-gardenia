import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { WeatherType } from '@/types/garden';
import * as THREE from 'three';

interface GardenSceneProps {
  energy: number;
  mentalPressure: number;
  personalConcerns: number;
  achievements: number;
  exceptionalDay: number;
  weather: WeatherType;
  onElementClick: (element: 'energy' | 'mentalPressure' | 'personalConcerns' | 'achievements' | 'exceptionalDay' | 'weather') => void;
  isAnimating: boolean;
}

const GardenScene: React.FC<GardenSceneProps> = ({
  energy,
  mentalPressure,
  personalConcerns,
  achievements,
  exceptionalDay,
  weather,
  onElementClick,
  isAnimating
}) => {
  const sceneRef = useRef<THREE.Group>(null);
  const treeRef = useRef<THREE.Group>(null);
  const rootsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Group>(null);
  const flowersRef = useRef<THREE.Group>(null);
  const skyRef = useRef<THREE.Mesh>(null);
  const raindropsRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const fruitsRef = useRef<THREE.Group>(null);
  const bugsRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState<string | null>(null);
  const { viewport } = useThree();
  
  // Colores según el clima
  const skyColors = useMemo(() => ({
    sunny: new THREE.Color('#87CEEB'),
    cloudy: new THREE.Color('#B0C4DE'),
    rainy: new THREE.Color('#4682B4'),
  }), []);
  
  const groundColors = useMemo(() => ({
    sunny: new THREE.Color('#7CFC00'),
    cloudy: new THREE.Color('#669966'),
    rainy: new THREE.Color('#3A5F0B'),
  }), []);
  
  // Generar geometrías y materiales reutilizables
  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.2, 0.3, 2, 12), []);
  const trunkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.8 }), []);
  
  const foliageGeometry = useMemo(() => new THREE.SphereGeometry(1.2, 16, 16), []);
  const foliageMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      color: '#2E8B57',
      roughness: 0.7,
    }), []);
  
  const groundGeometry = useMemo(() => new THREE.PlaneGeometry(20, 20), []);
  const groundMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: groundColors[weather],
      roughness: 0.8,
    }), [groundColors, weather]);
  
  // Crear las gotas de lluvia cuando el clima es lluvioso
  const raindrops = useMemo(() => {
    if (weather !== 'rainy') return [];
    
    return Array.from({ length: 100 }).map(() => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 10 + 5,
        Math.random() * 20 - 10
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.2,
      size: 0.02 + Math.random() * 0.03
    }));
  }, [weather]);
  
  // Crear nubes cuando el clima es nublado o lluvioso
  const clouds = useMemo(() => {
    if (weather === 'sunny') return [];
    
    return Array.from({ length: weather === 'cloudy' ? 8 : 12 }).map(() => ({
      position: [
        Math.random() * 16 - 8,
        Math.random() * 2 + 7,
        Math.random() * 16 - 8
      ] as [number, number, number],
      scale: [
        0.5 + Math.random() * 1.5,
        0.5 + Math.random() * 0.5,
        0.5 + Math.random() * 1.5
      ] as [number, number, number],
      speed: 0.001 + Math.random() * 0.002
    }));
  }, [weather]);
  
  // Crear flores basadas en el nivel de logros
  const flowers = useMemo(() => {
    const flowerCount = Math.max(0, Math.floor(achievements / 2));
    
    return Array.from({ length: flowerCount }).map(() => ({
      position: [
        Math.random() * 14 - 7,
        0.1,
        Math.random() * 14 - 7
      ] as [number, number, number],
      color: [
        ['#FF69B4', '#FF1493', '#DB7093'][Math.floor(Math.random() * 3)],
        ['#FFFF00', '#FFD700', '#FFA500'][Math.floor(Math.random() * 3)],
      ][Math.floor(Math.random() * 2)],
      scale: 0.15 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, [achievements]);
  
  // Crear frutos si es un día excepcional
  const fruits = useMemo(() => {
    if (exceptionalDay !== 1) return [];
    
    return Array.from({ length: 5 }).map(() => ({
      position: [
        Math.random() * 1.6 - 0.8,
        Math.random() * 1.6 - 0.8,
        Math.random() * 1.6 - 0.8
      ] as [number, number, number],
      scale: 0.12 + Math.random() * 0.08,
    }));
  }, [exceptionalDay]);
  
  // Crear mariposas/abejas
  const bugs = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      position: [
        Math.random() * 12 - 6,
        1 + Math.random() * 4,
        Math.random() * 12 - 6
      ] as [number, number, number],
      type: Math.random() > 0.5 ? 'butterfly' : 'bee',
      speed: 0.01 + Math.random() * 0.02,
      radius: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      wingPhase: 0,
    }));
  }, []);
  
  // Animación de las hojas con el viento (presión mental)
  useFrame((state, delta) => {
    if (!sceneRef.current) return;
    
    // Animación del cielo basada en el clima
    if (skyRef.current) {
      const skyMaterial = skyRef.current.material as THREE.MeshBasicMaterial;
      skyMaterial.color.lerp(skyColors[weather], 0.01);
    }
    
    // Animación del suelo basada en el clima
    if (sceneRef.current.children[0]) {
      const groundMesh = sceneRef.current.children[0] as THREE.Mesh;
      const groundMat = groundMesh.material as THREE.MeshStandardMaterial;
      groundMat.color.lerp(groundColors[weather], 0.01);
    }
    
    // Animación de las hojas según la presión mental
    if (leavesRef.current) {
      leavesRef.current.children.forEach((leaf, i) => {
        const intensity = mentalPressure / 10;
        leaf.rotation.x = Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.1 * intensity;
        leaf.rotation.z = Math.cos(state.clock.getElapsedTime() * 1.5 + i) * 0.1 * intensity;
      });
    }
    
    // Animación de las raíces según las preocupaciones personales
    if (rootsRef.current) {
      const scale = 0.5 + (personalConcerns / 10) * 1.5;
      rootsRef.current.scale.set(scale, scale, scale);
    }
    
    // Animación de gotas de lluvia
    if (raindropsRef.current && weather === 'rainy') {
      raindropsRef.current.children.forEach((drop, i) => {
        drop.position.y -= raindrops[i].speed;
        if (drop.position.y < 0) {
          drop.position.y = 10;
        }
      });
    }
    
    // Animación de nubes
    if (cloudsRef.current && (weather === 'cloudy' || weather === 'rainy')) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += clouds[i].speed;
        if (cloud.position.x > 10) {
          cloud.position.x = -10;
        }
      });
    }
    
    // Animación de mariposas y abejas
    if (bugsRef.current) {
      bugsRef.current.children.forEach((bug, i) => {
        const bugData = bugs[i];
        bugData.phase += bugData.speed;
        bugData.wingPhase += 0.2;
        
        bug.position.x = bugData.position[0] + Math.sin(bugData.phase) * bugData.radius;
        bug.position.y = bugData.position[1] + Math.sin(bugData.phase * 1.5) * 0.5;
        bug.position.z = bugData.position[2] + Math.cos(bugData.phase) * bugData.radius;
        
        bug.rotation.y = Math.atan2(
          Math.cos(bugData.phase) * bugData.radius,
          Math.sin(bugData.phase) * bugData.radius
        );
        
        if (bugData.type === 'butterfly') {
          (bug as THREE.Group).children.forEach((wing, j) => {
            wing.rotation.y = Math.sin(bugData.wingPhase) * (j === 0 ? 0.5 : -0.5);
          });
        }
      });
    }
    
    // Nivel de agua basado en la energía
    if (waterRef.current) {
      const targetScale = 0.5 + (energy / 10) * 1.5;
      waterRef.current.scale.y += (targetScale - waterRef.current.scale.y) * 0.05;
    }
  });
  
  // Efectos de hover
  const handlePointerOver = (element: string) => {
    setHovered(element);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  };
  
  // Efectos de escalado
  useEffect(() => {
    if (isAnimating && sceneRef.current) {
      sceneRef.current.scale.set(0.9, 0.9, 0.9);
      const timeout = setTimeout(() => {
        if (sceneRef.current) {
          sceneRef.current.scale.set(1, 1, 1);
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);
  
  return (
    <group ref={sceneRef}>
      {/* Suelo */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]} 
        receiveShadow
        geometry={groundGeometry}
        material={groundMaterial}
      >
        {/* Texturas de césped */}
        <group>
          {Array.from({ length: 200 }).map((_, i) => (
            <mesh 
              key={`grass-${i}`} 
              position={[
                Math.random() * 16 - 8,
                0.05,
                Math.random() * 16 - 8
              ]}
              rotation={[0, Math.random() * Math.PI * 2, 0]}
            >
              <planeGeometry args={[0.05, 0.2]} />
              <meshStandardMaterial 
                color={weather === 'sunny' ? '#7CFC00' : weather === 'cloudy' ? '#669966' : '#3A5F0B'} 
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      </mesh>
      
      {/* Cielo */}
      <mesh ref={skyRef} position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color={skyColors[weather]} side={THREE.BackSide} />
      </mesh>
      
      {/* Árbol principal */}
      <group 
        ref={treeRef} 
        position={[0, 0, 0]}
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
      
      {/* Raíces */}
      <group 
        ref={rootsRef} 
        position={[0, -0.1, 0]}
        onClick={() => onElementClick('personalConcerns')}
        onPointerOver={() => handlePointerOver('personalConcerns')}
        onPointerOut={handlePointerOut}
        scale={[1, 1, 1]}
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
      
      {/* Agua (energía) */}
      <group 
        ref={waterRef} 
        position={[-3, 0, 2]}
        onClick={() => onElementClick('energy')}
        onPointerOver={() => handlePointerOver('energy')}
        onPointerOut={handlePointerOut}
        scale={[1, 1, 1]}
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
      
      {/* Flores (logros) */}
      <group 
        ref={flowersRef} 
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
      
      {/* Gotas de lluvia */}
      <group ref={raindropsRef}>
        {weather === 'rainy' && raindrops.map((drop, i) => (
          <mesh 
            key={`raindrop-${i}`} 
            position={drop.position}
          >
            <capsuleGeometry args={[drop.size / 5, drop.size, 8, 4]} />
            <meshStandardMaterial color="#87CEFA" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Nubes */}
      <group ref={cloudsRef}>
        {(weather === 'cloudy' || weather === 'rainy') && clouds.map((cloud, i) => (
          <group 
            key={`cloud-${i}`} 
            position={cloud.position}
            scale={cloud.scale}
          >
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial 
                color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
                transparent opacity={0.9} 
              />
            </mesh>
            <mesh position={[0.4, 0, 0]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial 
                color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
                transparent opacity={0.9} 
              />
            </mesh>
            <mesh position={[-0.4, 0, 0]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial 
                color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
                transparent opacity={0.9} 
              />
            </mesh>
            <mesh position={[0, 0, 0.4]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial 
                color={weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9'} 
                transparent opacity={0.9} 
              />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Mariposas y abejas */}
      <group ref={bugsRef}>
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
    </group>
  );
};

export default GardenScene;
