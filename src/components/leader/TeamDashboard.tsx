
import React from 'react';
import { useTeamData } from '@/hooks/useTeamData';
import TeamMetrics from './dashboard/TeamMetrics';
import TeamTabs from './dashboard/TeamTabs';
import TeamDashboardLoading from './dashboard/TeamDashboardLoading';
import TeamDashboardError from './dashboard/TeamDashboardError';

const TeamDashboard = () => {
  const { teamData, isLoading, error } = useTeamData();
  
  if (isLoading) {
    return <TeamDashboardLoading />;
  }
  
  if (error || teamData.length === 0) {
    return <TeamDashboardError error={error} />;
  }
  
  // Get the most recent data
  const latestData = teamData[0];
  
  // Calculate trends by comparing to data from 7 days ago
  const weekAgoIndex = teamData.findIndex(d => {
    const date = new Date(d.check_in_date);
    const today = new Date(latestData.check_in_date);
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  });
  
  const weekAgoData = weekAgoIndex >= 0 ? teamData[weekAgoIndex] : null;
  
  return (
    <div className="space-y-4">
      <TeamMetrics 
        latestData={latestData} 
        weekAgoData={weekAgoData} 
      />
      
      <TeamTabs teamData={teamData} />
    </div>
  );
};

export default TeamDashboard;
