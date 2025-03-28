
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
  
  const isLeader = profile?.role === 'leader' || profile?.role === 'admin';
  
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
      
      const { data, error } = await supabase
        .from('team_emotional_data')
        .select('*')
        .gte('check_in_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('check_in_date', { ascending: false });
      
      if (error) throw error;
      
      setTeamData(data as TeamEmotionalData[]);
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
