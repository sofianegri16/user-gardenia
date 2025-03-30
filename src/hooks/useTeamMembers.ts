
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
      
      // First, get the user's team_id - using maybeSingle() to avoid errors with multiple teams
      const { data: userTeams, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);
      
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
      
      // Use the first team_id found (in case user is in multiple teams)
      const teamId = userTeams[0].team_id;
      console.log('User belongs to team:', teamId);
      
      if (!teamId) {
        console.log('Team ID is undefined');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Then, get all team members except current user
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
      
      // Extract user_ids from team_members
      const memberIds = teamMemberIds.map(m => m.user_id);
      console.log('Team member ids:', memberIds);
      
      // Finally, get the profiles of all team members
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name, role')
        .in('id', memberIds);
      
      if (profilesError) {
        console.error('Error fetching member profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('Team member profiles:', profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log('No team member profiles found');
        setTeamMembers([]);
      } else {
        const formattedMembers: TeamMember[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Usuario sin nombre',
          role: profile.role || 'user'
        }));
        
        console.log('Formatted team members:', formattedMembers);
        setTeamMembers(formattedMembers);
      }
      
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
