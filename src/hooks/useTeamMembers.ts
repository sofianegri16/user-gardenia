
import { useState, useEffect, useCallback } from 'react';
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
  
  const fetchTeamMembers = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      console.log('Fetching team for user:', user.id);
      
      // Consulta optimizada usando JOIN para obtener los miembros del equipo
      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          user_profiles:user_id (
            id,
            name,
            role
          )
        `)
        .eq('team_id', (
          supabase
            .from('team_members')
            .select('team_id')
            .eq('user_id', user.id)
            .limit(1)
        ))
        .neq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
      
      console.log('Raw team members data:', members);
      
      if (!members || members.length === 0) {
        console.log('No team members found for user:', user.id);
        setTeamMembers([]);
        return;
      }
      
      // Procesar los resultados para extraer los perfiles de usuario
      const formattedMembers = members
        .filter(member => member.user_profiles)
        .map(member => ({
          id: member.user_profiles.id,
          name: member.user_profiles.name || 'Usuario sin nombre',
          role: member.user_profiles.role || 'user'
        }));
      
      console.log('Processed team members:', formattedMembers);
      setTeamMembers(formattedMembers);
      
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los miembros del equipo',
        variant: 'destructive',
      });
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user, fetchTeamMembers]);
  
  return {
    teamMembers,
    isLoading,
    refreshTeamMembers: fetchTeamMembers
  };
};
