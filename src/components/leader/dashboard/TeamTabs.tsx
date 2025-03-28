
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamEmotionalChart from '../TeamEmotionalChart';
import TeamAlerts from '../TeamAlerts';
import TeamGarden from '../TeamGarden';
import { TeamEmotionalData } from '@/types/leader';

interface TeamTabsProps {
  teamData: TeamEmotionalData[];
}

const TeamTabs: React.FC<TeamTabsProps> = ({ teamData }) => {
  return (
    <Tabs defaultValue="trends">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="trends">Tendencias</TabsTrigger>
        <TabsTrigger value="alerts">Alertas</TabsTrigger>
        <TabsTrigger value="garden">Jardín Colectivo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trends" className="space-y-4">
        <TeamEmotionalChart teamData={teamData} />
      </TabsContent>
      
      <TabsContent value="alerts" className="space-y-4">
        <TeamAlerts teamData={teamData} />
      </TabsContent>
      
      <TabsContent value="garden" className="space-y-4">
        <TeamGarden teamData={teamData[0]} />
      </TabsContent>
    </Tabs>
  );
};

export default TeamTabs;
