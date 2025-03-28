
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export const useTeamMembers = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchTeamMembers = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get all user profiles except the current user
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name, role')
        .neq('id', user.id); // Exclude current user
      
      if (error) throw error;
      
      // Handle the case where role might not exist in the type yet
      const members = data.map(user => ({
        id: user.id,
        name: user.name || 'Usuario',
        role: 'role' in user ? (user as any).role : 'user'
      }));
      
      setTeamMembers(members);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los miembros del equipo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);
  
  return {
    teamMembers,
    isLoading,
    refreshTeamMembers: fetchTeamMembers
  };
};
