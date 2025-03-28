
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/hooks/useEmotionalChartData';

interface TeamEmotionalLineChartProps {
  chartData: ChartDataPoint[];
}

/**
 * Line chart visualization for team emotional data
 */
const TeamEmotionalLineChart: React.FC<TeamEmotionalLineChartProps> = ({ chartData }) => {
  return (
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
  );
};

export default TeamEmotionalLineChart;
