
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TeamEmotionalData } from '@/types/leader';

export const CollectiveGarden: React.FC<{ teamData: TeamEmotionalData }> = ({ teamData }) => {
  // Scale factors based on team data
  const treeScale = 0.7 + (teamData.avg_energy / 10) * 0.6;
  const flowerCount = Math.ceil(teamData.avg_achievements * 2);
  const treeColor = new THREE.Color(
    0.2 + (teamData.avg_energy / 20),
    0.5 + (teamData.avg_achievements / 20),
    0.3 - (teamData.avg_mental_pressure / 20)
  );
  
  // Reference for animation
  const groupRef = useRef<THREE.Group>(null);
  
  // Simple animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.01;
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Ground color based on weather
  const getGroundColor = () => {
    switch (teamData.most_common_weather) {
      case 'sunny': return '#7CFC00';
      case 'cloudy': return '#669966';
      case 'rainy': return '#3A5F0B';
      default: return '#7CFC00';
    }
  };
  
  // Sky color based on weather
  const getSkyColor = () => {
    switch (teamData.most_common_weather) {
      case 'sunny': return '#87CEEB';
      case 'cloudy': return '#B0C4DE';
      case 'rainy': return '#4682B4';
      default: return '#87CEEB';
    }
  };
  
  return (
    <>
      {/* Sky */}
      <mesh position={[0, 50, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color={getSkyColor()} side={THREE.BackSide} />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 50]} />
        <meshStandardMaterial color={getGroundColor()} />
      </mesh>
      
      {/* Team tree group */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Main tree trunk */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 1, 4, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Tree foliage */}
        <mesh position={[0, 5, 0]} scale={[treeScale, treeScale, treeScale]} castShadow>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial color={treeColor.getHexString()} />
        </mesh>
        
        {/* Flowers representing achievements */}
        <CollectiveFlowers flowerCount={flowerCount} />
        
        {/* Small trees representing team members */}
        <TeamMemberTrees memberCount={teamData.member_count} />
      </group>
    </>
  );
};

// Flowers component
const CollectiveFlowers: React.FC<{ flowerCount: number }> = ({ flowerCount }) => {
  return (
    <>
      {Array.from({ length: flowerCount }).map((_, i) => {
        const angle = (i / flowerCount) * Math.PI * 2;
        const radius = 5 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const size = 0.3 + Math.random() * 0.3;
        
        return (
          <group key={i} position={[x, 0.2, z]}>
            {/* Flower stem */}
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            
            {/* Flower petals */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <sphereGeometry args={[size, 8, 8]} />
              <meshStandardMaterial 
                color={['#FF69B4', '#FF1493', '#FFD700', '#FFA500'][Math.floor(Math.random() * 4)]} 
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

// Team Member Trees component
const TeamMemberTrees: React.FC<{ memberCount: number }> = ({ memberCount }) => {
  return (
    <>
      {Array.from({ length: memberCount }).map((_, i) => {
        const angle = (i / memberCount) * Math.PI * 2;
        const radius = 10;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.5 + Math.random() * 0.3;
        
        return (
          <group key={i} position={[x, 0, z]} scale={[scale, scale, scale]}>
            {/* Tree trunk */}
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            
            {/* Tree foliage */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial 
                color={new THREE.Color(
                  0.2 + Math.random() * 0.2,
                  0.4 + Math.random() * 0.3,
                  0.2 + Math.random() * 0.1
                )} 
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
};
