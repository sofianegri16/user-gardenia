
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
      
      // Step 1: Get the user's team_id
      console.log('Fetching team for user:', user.id);
      const { data: userTeamData, error: userTeamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();
      
      if (userTeamError) {
        if (userTeamError.code === 'PGRST116') {
          // No team found for this user
          console.log('No team found for user:', user.id);
          setTeamMembers([]);
          return;
        }
        throw userTeamError;
      }

      if (!userTeamData || !userTeamData.team_id) {
        console.log('User is not part of any team:', user.id);
        setTeamMembers([]);
        return;
      }

      const teamId = userTeamData.team_id;
      console.log('User belongs to team:', teamId);

      // Step 2: Get all users in the same team
      const { data: teamMembersIds, error: teamMembersError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .neq('user_id', user.id); // Exclude the current user
      
      if (teamMembersError) throw teamMembersError;
      
      if (!teamMembersIds || teamMembersIds.length === 0) {
        console.log('No other members found in team:', teamId);
        setTeamMembers([]);
        return;
      }

      const memberIds = teamMembersIds.map(member => member.user_id);
      console.log('Team member IDs found:', memberIds.length);

      // Step 3: Get the profiles for those team members
      const { data: membersData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name, role')
        .in('id', memberIds);
      
      if (profilesError) throw profilesError;
      
      const members: TeamMember[] = membersData.map((profile: any) => ({
        id: profile.id || '',
        name: profile.name || 'Usuario',
        role: profile.role || 'user'
      }));
      
      console.log('Team members loaded:', members.length);
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
