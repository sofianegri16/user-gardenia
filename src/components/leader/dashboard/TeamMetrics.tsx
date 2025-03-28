
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { TeamEmotionalData } from '@/types/leader';

interface TeamMetricsProps {
  latestData: TeamEmotionalData;
  weekAgoData: TeamEmotionalData | null;
}

interface TrendData {
  value: string;
  direction: 'up' | 'down';
}

const TeamMetrics: React.FC<TeamMetricsProps> = ({ latestData, weekAgoData }) => {
  const calculateTrend = (current: number, previous: number | null): TrendData | null => {
    if (previous === null) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? 'up' : 'down'
    };
  };
  
  const energyTrend = calculateTrend(latestData.avg_energy, weekAgoData?.avg_energy || null);
  const pressureTrend = calculateTrend(latestData.avg_mental_pressure, weekAgoData?.avg_mental_pressure || null);
  
  // Calculate Wellbeing Index (WBI)
  const calculateWBI = (data: typeof latestData) => {
    const positiveMetrics = data.avg_energy + data.avg_achievements;
    const negativeMetrics = data.avg_mental_pressure + data.avg_personal_concerns;
    // Scale from 0-10 to maintain consistency
    return ((positiveMetrics - negativeMetrics / 2) / 2).toFixed(1);
  };
  
  const currentWBI = calculateWBI(latestData);
  const previousWBI = weekAgoData ? calculateWBI(weekAgoData) : null;
  const wbiTrend = calculateTrend(parseFloat(currentWBI), previousWBI ? parseFloat(previousWBI) : null);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Índice de Bienestar (WBI)
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentWBI}</div>
          {wbiTrend && (
            <div className="flex items-center">
              {wbiTrend.direction === 'up' ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${wbiTrend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {wbiTrend.value}% desde la semana pasada
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Energía Promedio
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestData.avg_energy.toFixed(1)}</div>
          {energyTrend && (
            <div className="flex items-center">
              {energyTrend.direction === 'up' ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${energyTrend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {energyTrend.value}% desde la semana pasada
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Presión Mental
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestData.avg_mental_pressure.toFixed(1)}</div>
          {pressureTrend && (
            <div className="flex items-center">
              {pressureTrend.direction === 'down' ? (
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${pressureTrend.direction === 'down' ? 'text-green-500' : 'text-red-500'}`}>
                {pressureTrend.value}% desde la semana pasada
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Miembros Activos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestData.member_count}</div>
          <p className="text-xs text-muted-foreground">
            Registros del {new Date(latestData.check_in_date).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMetrics;
