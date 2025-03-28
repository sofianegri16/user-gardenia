
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamData } from '@/hooks/useTeamData';
import { Loader2, TrendingDown, TrendingUp, Activity, Users, AlertTriangle } from 'lucide-react';
import TeamEmotionalChart from './TeamEmotionalChart';
import TeamAlerts from './TeamAlerts';
import TeamGarden from './TeamGarden';

const TeamDashboard = () => {
  const { teamData, isLoading, error, isLeader } = useTeamData();
  
  if (!isLeader) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Acceso restringido</CardTitle>
          <CardDescription>
            No tienes los permisos necesarios para acceder al panel de líderes
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-garden-primary" />
        <span className="text-lg font-medium">Cargando datos del equipo...</span>
      </div>
    );
  }
  
  if (error || teamData.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>No se pudieron cargar los datos</CardTitle>
          <CardDescription>
            {error || 'No hay datos de equipo disponibles en este momento'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
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
  
  const calculateTrend = (current: number, previous: number | null) => {
    if (previous === null) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? 'up' : 'down'
    };
  };
  
  const energyTrend = calculateTrend(latestData.avg_energy, weekAgoData?.avg_energy || null);
  const pressureTrend = calculateTrend(latestData.avg_mental_pressure, weekAgoData?.avg_mental_pressure || null);
  const concernsTrend = calculateTrend(latestData.avg_personal_concerns, weekAgoData?.avg_personal_concerns || null);
  const achievementsTrend = calculateTrend(latestData.avg_achievements, weekAgoData?.avg_achievements || null);
  
  // Calculate Wellbeing Index (WBI) - simple average of all metrics
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
    <div className="space-y-4">
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
          <TeamGarden teamData={latestData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamDashboard;
