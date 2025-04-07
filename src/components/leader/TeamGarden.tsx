
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEmotionalData } from '@/types/leader';
import TeamGardenLegend from '@/components/garden/TeamGardenLegend';
import TeamStatusIndicators from '@/components/garden/TeamStatusIndicators';
import '@/garden.css';

interface TeamGardenProps {
  teamData: TeamEmotionalData;
}

// Componente para visualización de jardín de equipo en 2D plano
const TeamGarden: React.FC<TeamGardenProps> = ({ teamData }) => {
  // Calculamos algunos valores para los elementos visuales basados en los datos del equipo
  const energyScale = 0.7 + (teamData.avg_energy / 10) * 0.6;
  const achievementsScale = 0.7 + (teamData.avg_achievements / 10) * 0.6;
  const mentalPressureOffset = (teamData.avg_mental_pressure / 10) * 30;
  const hasHighConcerns = teamData.avg_personal_concerns > 7;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jardín Colectivo</CardTitle>
        <CardDescription>
          Representación visual del estado emocional del equipo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="garden-container">
          {/* Fondo según el clima */}
          <div 
            className={`garden-background ${teamData.most_common_weather}-background`}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          />
          
          {/* Suelo */}
          <div 
            className="garden-ground"
            style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '30%',
              backgroundColor: teamData.most_common_weather === 'sunny' 
                ? '#7CFC00' 
                : teamData.most_common_weather === 'cloudy' 
                  ? '#669966' 
                  : '#3A5F0B',
              zIndex: 2
            }}
          />
          
          {/* Árbol principal */}
          <div 
            className="garden-tree" 
            style={{ 
              position: 'absolute',
              bottom: '25%',
              left: '50%',
              transform: `translateX(-50%) rotate(${mentalPressureOffset}deg)`,
              width: '120px',
              height: '200px',
              zIndex: 3
            }}
          >
            {/* Tronco */}
            <div 
              className="tree-trunk"
              style={{ 
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '100px',
                backgroundColor: '#8B4513',
                zIndex: 3
              }}
            />
            
            {/* Copa del árbol */}
            <div 
              className="tree-foliage"
              style={{ 
                position: 'absolute',
                bottom: '80px',
                left: '50%',
                transform: `translateX(-50%) scale(${energyScale})`,
                width: '100px',
                height: '100px',
                backgroundColor: teamData.most_common_weather === 'sunny' ? '#2E8B57' : '#1B5E20',
                borderRadius: '50%',
                zIndex: 4
              }}
            />
          </div>
          
          {/* Flores (representan logros) */}
          {Array.from({ length: Math.min(Math.ceil(teamData.avg_achievements * 2), 10) }).map((_, i) => (
            <div 
              key={`flower-${i}`}
              className="garden-flower"
              style={{ 
                position: 'absolute',
                bottom: `${20 + Math.random() * 10}%`,
                left: `${10 + (i * 8) + Math.random() * 5}%`,
                width: `${30 * achievementsScale}px`,
                height: `${30 * achievementsScale}px`,
                backgroundColor: ['#FF69B4', '#FF1493', '#FFD700', '#FFA500'][Math.floor(Math.random() * 4)],
                borderRadius: '50%',
                zIndex: 5
              }}
            />
          ))}
          
          {/* Raíces (representan preocupaciones personales) */}
          {hasHighConcerns && (
            <div 
              className="garden-roots"
              style={{ 
                position: 'absolute',
                bottom: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '40px',
                zIndex: 2
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={`root-${i}`}
                  style={{ 
                    position: 'absolute',
                    top: '0',
                    left: `${i * 25 + 10}px`,
                    width: '8px',
                    height: `${20 + (teamData.avg_personal_concerns * 3)}px`,
                    backgroundColor: '#8B4513',
                    transform: `rotate(${(i - 2) * 20}deg)`,
                    transformOrigin: 'top center',
                    zIndex: 2
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Elementos meteorológicos */}
          {teamData.most_common_weather === 'rainy' && (
            <div className="weather-elements">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={`raindrop-${i}`}
                  className="raindrop"
                  style={{ 
                    position: 'absolute',
                    top: `${Math.random() * 50}%`,
                    left: `${Math.random() * 100}%`,
                    width: '4px',
                    height: '15px',
                    backgroundColor: '#87CEFA',
                    opacity: 0.7,
                    zIndex: 10
                  }}
                />
              ))}
            </div>
          )}
          
          {(teamData.most_common_weather === 'cloudy' || teamData.most_common_weather === 'rainy') && (
            <div className="clouds">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={`cloud-${i}`}
                  style={{ 
                    position: 'absolute',
                    top: `${10 + (i * 15)}%`,
                    left: `${10 + (i * 30)}%`,
                    width: '80px',
                    height: '40px',
                    backgroundColor: teamData.most_common_weather === 'cloudy' ? '#E0E0E0' : '#A9A9A9',
                    borderRadius: '20px',
                    zIndex: 8
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <TeamStatusIndicators teamData={teamData} />
        <div className="absolute top-4 right-4 z-10">
          <TeamGardenLegend />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamGarden;
