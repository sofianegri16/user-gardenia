
import React from 'react';
import { TeamEmotionalData } from '@/types/leader';

interface TeamStatusIndicatorsProps {
  teamData: TeamEmotionalData;
}

const TeamStatusIndicators: React.FC<TeamStatusIndicatorsProps> = ({ teamData }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
      <div>
        <div className="font-medium">Energía Colectiva</div>
        <div className="mt-1 flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className={`h-2 w-6 mx-0.5 rounded-sm ${
                i < Math.ceil(teamData.avg_energy / 2)
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <div className="font-medium">Logros del Equipo</div>
        <div className="mt-1 flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className={`h-2 w-6 mx-0.5 rounded-sm ${
                i < Math.ceil(teamData.avg_achievements / 2)
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <div className="font-medium">Presión Mental</div>
        <div className="mt-1 flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className={`h-2 w-6 mx-0.5 rounded-sm ${
                i < Math.ceil(teamData.avg_mental_pressure / 2)
                  ? 'bg-red-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <div className="font-medium">Preocupaciones</div>
        <div className="mt-1 flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className={`h-2 w-6 mx-0.5 rounded-sm ${
                i < Math.ceil(teamData.avg_personal_concerns / 2)
                  ? 'bg-purple-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamStatusIndicators;
