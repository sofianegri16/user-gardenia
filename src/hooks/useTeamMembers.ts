
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
      
      console.log('Fetching team for user:', user.id);
      
      // First, get the user's team_id
      const { data: userTeam, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();
      
      if (teamError) {
        console.error('Error fetching user team:', teamError);
        throw teamError;
      }
      
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
        name: profile.name || 'Usuario sin nombre',
        role: profile.role || 'user'
      }));
      
      console.log('Team members loaded:', members);
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
