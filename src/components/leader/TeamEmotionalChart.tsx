
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TeamEmotionalData } from '@/types/leader';

interface TeamEmotionalChartProps {
  teamData: TeamEmotionalData[];
}

const TeamEmotionalChart: React.FC<TeamEmotionalChartProps> = ({ teamData }) => {
  // Reverse the data to show oldest to newest (left to right)
  const chartData = [...teamData]
    .reverse()
    .map(d => ({
      date: new Date(d.check_in_date).toLocaleDateString(),
      energy: parseFloat(d.avg_energy.toFixed(1)),
      pressure: parseFloat(d.avg_mental_pressure.toFixed(1)),
      concerns: parseFloat(d.avg_personal_concerns.toFixed(1)),
      achievements: parseFloat(d.avg_achievements.toFixed(1)),
      memberCount: d.member_count
    }));
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tendencias Emocionales del Equipo</CardTitle>
        <CardDescription>
          Evolución de los indicadores emocionales en los últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Show fewer ticks for better readability
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(1), '']}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="energy" 
                name="Energía" 
                stroke="#4ade80" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="pressure" 
                name="Presión Mental" 
                stroke="#f43f5e" 
              />
              <Line 
                type="monotone" 
                dataKey="concerns" 
                name="Preocupaciones" 
                stroke="#a855f7" 
              />
              <Line 
                type="monotone" 
                dataKey="achievements" 
                name="Logros" 
                stroke="#3b82f6" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamEmotionalChart;
