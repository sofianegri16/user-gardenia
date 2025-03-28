
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TeamEmotionalData } from '@/types/leader';

interface TeamAlertsProps {
  teamData: TeamEmotionalData[];
}

interface Alert {
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  icon: React.ReactNode;
}

const TeamAlerts: React.FC<TeamAlertsProps> = ({ teamData }) => {
  // Generate alerts based on team data patterns
  const alerts: Alert[] = React.useMemo(() => {
    const result: Alert[] = [];
    
    // Skip if not enough data
    if (teamData.length < 2) return [];
    
    // Check for high pressure for consecutive days
    let highPressureDays = 0;
    for (let i = 0; i < Math.min(teamData.length, 3); i++) {
      if (teamData[i].avg_mental_pressure > 7) {
        highPressureDays++;
      }
    }
    
    if (highPressureDays >= 2) {
      result.push({
        type: 'warning',
        title: 'Alta presión mental',
        message: `El equipo ha registrado alta presión mental durante ${highPressureDays} días consecutivos.`,
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
      });
    }
    
    // Check for low energy
    let lowEnergyDays = 0;
    for (let i = 0; i < Math.min(teamData.length, 3); i++) {
      if (teamData[i].avg_energy < 4) {
        lowEnergyDays++;
      }
    }
    
    if (lowEnergyDays >= 2) {
      result.push({
        type: 'warning',
        title: 'Baja energía',
        message: `El equipo ha registrado baja energía durante ${lowEnergyDays} días consecutivos.`,
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
      });
    }
    
    // Check for increased achievements
    if (teamData.length >= 7) {
      const weekAgoIndex = teamData.findIndex(d => {
        const date = new Date(d.check_in_date);
        const today = new Date(teamData[0].check_in_date);
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
      });
      
      if (weekAgoIndex >= 0) {
        const currentAchievements = teamData[0].avg_achievements;
        const weekAgoAchievements = teamData[weekAgoIndex].avg_achievements;
        
        if (currentAchievements > weekAgoAchievements * 1.2) {
          result.push({
            type: 'success',
            title: 'Aumento en logros',
            message: 'El equipo ha registrado un aumento significativo en sus logros esta semana.',
            icon: <CheckCircle className="h-5 w-5 text-green-500" />
          });
        }
      }
    }
    
    // Add info about weather patterns if consistent
    const weatherCounts: Record<string, number> = {};
    for (let i = 0; i < Math.min(teamData.length, 5); i++) {
      const weather = teamData[i].most_common_weather;
      weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
    }
    
    const dominantWeather = Object.entries(weatherCounts).sort((a, b) => b[1] - a[1])[0];
    if (dominantWeather && dominantWeather[1] >= 4) {
      const weatherTranslation: Record<string, string> = {
        sunny: 'soleado',
        cloudy: 'nublado',
        rainy: 'lluvioso'
      };
      
      result.push({
        type: 'info',
        title: 'Patrón climático emocional',
        message: `El clima emocional del equipo ha sido predominantemente ${weatherTranslation[dominantWeather[0]] || dominantWeather[0]} en los últimos días.`,
        icon: <Info className="h-5 w-5 text-blue-500" />
      });
    }
    
    return result;
  }, [teamData]);
  
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas del Equipo</CardTitle>
          <CardDescription>
            No hay alertas activas en este momento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <CheckCircle className="h-12 w-12 mb-4 text-green-400" />
            <p>El equipo parece estar en un buen equilibrio emocional.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas del Equipo</CardTitle>
        <CardDescription>
          Alertas basadas en los patrones emocionales recientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                alert.type === 'warning' 
                  ? 'bg-amber-50 border border-amber-200' 
                  : alert.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {alert.icon}
                </div>
                <div>
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm mt-1">{alert.message}</p>
                  {alert.type === 'warning' && (
                    <div className="mt-2">
                      <span className="text-xs font-medium">Recomendación: </span>
                      <span className="text-xs">
                        {alert.title.includes('presión') 
                          ? 'Considera organizar actividades para reducir el estrés o ajustar deadlines del equipo.'
                          : 'Evalúa la carga de trabajo y considera dar tiempo para recuperación.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAlerts;
