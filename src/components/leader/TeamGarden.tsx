
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEmotionalData } from '@/types/leader';
import TeamCollectiveGarden from '@/components/garden/TeamCollectiveGarden';
import TeamStatusIndicators from '@/components/garden/TeamStatusIndicators';

interface TeamGardenProps {
  teamData: TeamEmotionalData;
}

// Simple component for team garden visualization
const TeamGarden: React.FC<TeamGardenProps> = ({ teamData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jardín Colectivo</CardTitle>
        <CardDescription>
          Representación visual del estado emocional del equipo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TeamCollectiveGarden teamData={teamData} />
        <TeamStatusIndicators teamData={teamData} />
      </CardContent>
    </Card>
  );
};

export default TeamGarden;
