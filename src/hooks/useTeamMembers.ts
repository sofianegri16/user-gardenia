
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
      
      // STEP 1: Get the user's team_id
      const { data: userTeams, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (teamError) {
        console.error('Error fetching user teams:', teamError);
        throw teamError;
      }
      
      if (!userTeams || userTeams.length === 0) {
        console.log('User not assigned to any team');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Log STEP 1 result - show team_id obtained
      const teamId = userTeams[0].team_id;
      console.log('DEBUGGING STEP 1: User belongs to team:', teamId);
      
      if (!teamId) {
        console.log('Team ID is undefined');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // STEP 2: Get all team members except current user
      const { data: teamMemberIds, error: membersError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .neq('user_id', user.id);
      
      if (membersError) {
        console.error('Error fetching team member ids:', membersError);
        throw membersError;
      }
      
      if (!teamMemberIds || teamMemberIds.length === 0) {
        console.log('No other team members found');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Log STEP 2 result - show all user_ids found
      const memberIds = teamMemberIds.map(m => m.user_id);
      console.log('DEBUGGING STEP 2: Team member ids:', memberIds);
      
      if (memberIds.length === 0) {
        console.log('Member IDs array is empty after mapping');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // STEP 3: Get the profiles of all team members
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name, role')
        .in('id', memberIds);
      
      if (profilesError) {
        console.error('Error fetching member profiles:', profilesError);
        throw profilesError;
      }
      
      // Log STEP 3 result - show complete profiles retrieved
      console.log('DEBUGGING STEP 3: Team member profiles:', profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log('No team member profiles found even though we had IDs');
        setTeamMembers([]);
      } else {
        const formattedMembers: TeamMember[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Usuario sin nombre',
          role: profile.role || 'user'
        }));
        
        console.log('DEBUGGING FINAL: Formatted team members:', formattedMembers);
        setTeamMembers(formattedMembers);
      }
      
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error al cargar el equipo',
        description: 'No se pudieron cargar los miembros del equipo. Por favor, intenta de nuevo más tarde.',
        variant: 'destructive',
      });
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Execute fetch on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
    }
  }, [user, fetchTeamMembers]);
  
  return {
    teamMembers,
    isLoading,
    refreshTeamMembers: fetchTeamMembers
  };
};
