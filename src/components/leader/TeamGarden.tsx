
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEmotionalData } from '@/types/leader';
import TeamCollectiveGarden from '@/components/garden/TeamCollectiveGarden';
import TeamStatusIndicators from '@/components/garden/TeamStatusIndicators';
import TeamGardenLegend from '@/components/garden/TeamGardenLegend';

interface TeamGardenProps {
  teamData: TeamEmotionalData;
}

// Component for team garden visualization
const TeamGarden: React.FC<TeamGardenProps> = ({ teamData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jardín Colectivo</CardTitle>
        <CardDescription>
          Representación visual del estado emocional del equipo
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <TeamCollectiveGarden teamData={teamData} />
        <TeamStatusIndicators teamData={teamData} />
        <div className="absolute top-4 right-4 z-10">
          <TeamGardenLegend />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamGarden;
