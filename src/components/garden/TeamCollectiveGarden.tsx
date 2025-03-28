
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TeamEmotionalData } from '@/types/leader';
import { CollectiveGarden } from './elements/CollectiveGarden';

interface TeamCollectiveGardenProps {
  teamData: TeamEmotionalData;
}

const TeamCollectiveGarden: React.FC<TeamCollectiveGardenProps> = ({ teamData }) => {
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden bg-gradient-to-b from-blue-50 to-green-50">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <CollectiveGarden teamData={teamData} />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
};

export default TeamCollectiveGarden;
