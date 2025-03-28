
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { TeamEmotionalData } from '@/types/leader';

export const useTeamData = () => {
  const { user, profile } = useAuth();
  const [teamData, setTeamData] = useState<TeamEmotionalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Safely check the role property which might not be in the type yet
  const roleValue = profile && 'role' in profile ? (profile as any).role : null;
  const isLeader = roleValue === 'leader' || roleValue === 'admin';
  
  const fetchTeamData = async () => {
    if (!user || !isLeader) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the last 30 days of team data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Use the more generic approach to avoid type errors with the new view
      const { data, error } = await supabase
        .from('team_emotional_data')
        .select('*')
        .gte('check_in_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('check_in_date', { ascending: false });
      
      if (error) throw error;
      
      // Type cast the data to match our expected type
      setTeamData(data as unknown as TeamEmotionalData[]);
    } catch (err: any) {
      console.error('Error fetching team data:', err);
      setError(err.message || 'Failed to load team data');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del equipo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && isLeader) {
      fetchTeamData();
    }
  }, [user, isLeader]);
  
  return {
    teamData,
    isLoading,
    error,
    isLeader,
    refreshTeamData: fetchTeamData
  };
};
