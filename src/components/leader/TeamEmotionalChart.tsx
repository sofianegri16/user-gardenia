
import React from 'react';
import { TeamEmotionalData } from '@/types/leader';
import ChartContainer from './charts/ChartContainer';
import TeamEmotionalLineChart from './charts/TeamEmotionalLineChart';
import { useEmotionalChartData } from '@/hooks/useEmotionalChartData';

interface TeamEmotionalChartProps {
  teamData: TeamEmotionalData[];
}

/**
 * Complete emotional chart component that shows trends in team emotional data
 */
const TeamEmotionalChart: React.FC<TeamEmotionalChartProps> = ({ teamData }) => {
  const chartData = useEmotionalChartData(teamData);
  
  return (
    <ChartContainer 
      title="Tendencias Emocionales del Equipo"
      description="Evolución de los indicadores emocionales en los últimos 30 días"
    >
      <TeamEmotionalLineChart chartData={chartData} />
    </ChartContainer>
  );
};

export default TeamEmotionalChart;
