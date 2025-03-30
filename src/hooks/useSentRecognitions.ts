
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { EmotionalRecognition } from '@/types/leader';
import { fetchSentRecognitions } from '@/api/recognition';

export const useSentRecognitions = () => {
  const { user } = useAuth();
  const [sentRecognitions, setSentRecognitions] = useState<EmotionalRecognition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecognitions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching sent recognitions for user:', user.id);
      
      // Fetch sent recognitions
      const sentData = await fetchSentRecognitions(user.id);
      setSentRecognitions(sentData);
      
    } catch (error: any) {
      console.error('Error fetching sent recognitions:', error);
      setError(error?.message || 'Error desconocido');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los reconocimientos enviados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchRecognitions();
    }
  }, [user, fetchRecognitions]);
  
  return {
    sentRecognitions,
    isLoading,
    error,
    refreshRecognitions: fetchRecognitions
  };
};
