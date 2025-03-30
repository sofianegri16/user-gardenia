
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
      
      // Step 1: Get the user's team_id - Change query approach to use more direct query
      console.log('Fetching team for user:', user.id);
      
      // Use INNER JOIN to get team members in one query
      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          team_members!inner(user_id),
          user_profiles!inner(id, name, role)
        `)
        .eq('team_members.user_id', user.id)
        .neq('user_profiles.id', user.id);
        
      if (teamError) {
        console.error('Error fetching team data:', teamError);
        throw teamError;
      }
      
      if (!teamMembers || teamMembers.length === 0) {
        console.log('No team or team members found for user:', user.id);
        
        // Try an alternative approach - get the team first
        const { data: userTeam } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .single();
        
        if (!userTeam || !userTeam.team_id) {
          console.log('No team association found for user:', user.id);
          setTeamMembers([]);
          return;
        }
        
        console.log('Found team_id:', userTeam.team_id, 'for user:', user.id);
        
        // Then get other members with the same team_id
        const { data: otherMembers, error: membersError } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', userTeam.team_id)
          .neq('user_id', user.id);
        
        if (membersError) {
          console.error('Error fetching team members:', membersError);
          throw membersError;
        }
        
        if (!otherMembers || otherMembers.length === 0) {
          console.log('No other team members found in team:', userTeam.team_id);
          setTeamMembers([]);
          return;
        }
        
        const memberIds = otherMembers.map(member => member.user_id);
        console.log('Found team member IDs:', memberIds);
        
        // Get profiles for these members
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('id, name, role')
          .in('id', memberIds);
        
        if (profilesError) {
          console.error('Error fetching team member profiles:', profilesError);
          throw profilesError;
        }
        
        const members = profiles.map(profile => ({
          id: profile.id || '',
          name: profile.name || 'Usuario',
          role: profile.role || 'user'
        }));
        
        console.log('Team members loaded:', members.length);
        setTeamMembers(members);
        return;
      }
      
      // Process results from the first query approach if successful
      const memberProfiles = teamMembers.map((item: any) => ({
        id: item.user_profiles.id || '',
        name: item.user_profiles.name || 'Usuario',
        role: item.user_profiles.role || 'user'
      }));
      
      console.log('Team members loaded (approach 1):', memberProfiles.length);
      setTeamMembers(memberProfiles);
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
