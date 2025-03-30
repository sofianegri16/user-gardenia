
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { EmotionalRecognition } from '@/types/leader';
import { fetchReceivedRecognitions } from '@/api/recognition';

export const useReceivedRecognitions = () => {
  const { user } = useAuth();
  const [receivedRecognitions, setReceivedRecognitions] = useState<EmotionalRecognition[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecognitions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching received recognitions for user:', user.id);
      
      // Fetch received recognitions
      const receivedData = await fetchReceivedRecognitions(user.id);
      setReceivedRecognitions(receivedData);
      setUnreadCount(receivedData.filter(r => !r.is_read).length);
      
    } catch (error: any) {
      console.error('Error fetching received recognitions:', error);
      setError(error?.message || 'Error desconocido');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los reconocimientos recibidos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Update unread count when received recognitions change
  const updateRecognitionStatus = useCallback((recognitionId: string) => {
    setReceivedRecognitions(prev => 
      prev.map(rec => 
        rec.id === recognitionId ? { ...rec, is_read: true } : rec
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchRecognitions();
    }
  }, [user, fetchRecognitions]);
  
  return {
    receivedRecognitions,
    unreadCount,
    isLoading,
    error,
    refreshRecognitions: fetchRecognitions,
    updateRecognitionStatus
  };
};
