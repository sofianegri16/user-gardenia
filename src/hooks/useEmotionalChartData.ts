
import { TeamEmotionalData } from '@/types/leader';

export interface ChartDataPoint {
  date: string;
  energy: number;
  pressure: number;
  concerns: number;
  achievements: number;
  memberCount: number;
}

/**
 * Transforms team emotional data into a format suitable for charts
 */
export const useEmotionalChartData = (teamData: TeamEmotionalData[]): ChartDataPoint[] => {
  // Reverse the data to show oldest to newest (left to right)
  return [...teamData]
    .reverse()
    .map(d => ({
      date: new Date(d.check_in_date).toLocaleDateString(),
      energy: parseFloat(d.avg_energy.toFixed(1)),
      pressure: parseFloat(d.avg_mental_pressure.toFixed(1)),
      concerns: parseFloat(d.avg_personal_concerns.toFixed(1)),
      achievements: parseFloat(d.avg_achievements.toFixed(1)),
      memberCount: d.member_count
    }));
};
