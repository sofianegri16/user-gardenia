import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { TeamEmotionalData } from '@/types/leader';

export const useTeamData = () => {
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<TeamEmotionalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Since all users are now leaders, we can simplify this
  const isLeader = true;
  
  const fetchTeamData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the last 30 days of team data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // First try to get actual team emotional data
      const { data: actualData, error: actualError } = await (supabase as any)
        .from('team_emotional_data')
        .select('*')
        .gte('check_in_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('check_in_date', { ascending: false });
      
      if (actualError) throw actualError;
      
      // If we have actual data and it's not empty, use it
      if (actualData && actualData.length > 0) {
        setTeamData(actualData as TeamEmotionalData[]);
      } else {
        // Otherwise, use our demo data
        const { data: demoData, error: demoError } = await (supabase as any)
          .rpc('get_team_emotional_demo');
        
        if (demoError) throw demoError;
        
        // Type cast the data to match our expected type
        setTeamData(demoData as TeamEmotionalData[]);
      }
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
    if (user) {
      fetchTeamData();
    }
  }, [user]);
  
  return {
    teamData,
    isLoading,
    error,
    isLeader,
    refreshTeamData: fetchTeamData
  };
};
