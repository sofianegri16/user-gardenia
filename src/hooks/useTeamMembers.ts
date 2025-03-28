
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
      // Use type assertion to bypass strict TypeScript checks since the database structure
      // might not match our types exactly (role column may not exist yet)
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('id, name')
        .neq('id', user.id); // Exclude current user
      
      if (error) throw error;
      
      // Transform the data to include a default role if missing
      const members = data.map((user: any) => ({
        id: user.id || '',
        name: user.name || 'Usuario',
        role: 'user' // Default role if not available in the database
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
