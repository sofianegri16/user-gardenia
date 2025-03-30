
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { EmotionalRecognition } from '@/types/leader';
import { useRecognitionCategories } from './useRecognitionCategories';
import { 
  fetchReceivedRecognitions, 
  fetchSentRecognitions, 
  sendNewRecognition,
  markRecognitionAsRead
} from '@/api/recognitionService';

export const useEmotionalRecognitions = () => {
  const { user } = useAuth();
  const [receivedRecognitions, setReceivedRecognitions] = useState<EmotionalRecognition[]>([]);
  const [sentRecognitions, setSentRecognitions] = useState<EmotionalRecognition[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { categories, isLoading: isCategoriesLoading, refreshCategories } = useRecognitionCategories();
  
  const fetchRecognitions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching recognitions for user:', user.id);
      
      // Fetch received recognitions
      const receivedData = await fetchReceivedRecognitions(user.id);
      setReceivedRecognitions(receivedData);
      setUnreadCount(receivedData.filter(r => !r.is_read).length);
      
      // Fetch sent recognitions
      const sentData = await fetchSentRecognitions(user.id);
      setSentRecognitions(sentData);
      
    } catch (error: any) {
      console.error('Error fetching recognitions:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los reconocimientos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  const sendRecognition = async (receiverId: string, message: string, categoryId: string) => {
    if (!user) return false;
    
    const success = await sendNewRecognition(user.id, receiverId, message, categoryId);
    if (success) {
      // Refresh the recognitions list
      fetchRecognitions();
    }
    return success;
  };
  
  const markAsRead = async (recognitionId: string) => {
    if (!user) return false;
    
    const success = await markRecognitionAsRead(recognitionId, user.id);
    
    if (success) {
      // Update local state
      setReceivedRecognitions(prev => 
        prev.map(rec => 
          rec.id === recognitionId ? { ...rec, is_read: true } : rec
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    return success;
  };
  
  useEffect(() => {
    if (user) {
      fetchRecognitions();
    }
  }, [user, fetchRecognitions]);
  
  return {
    receivedRecognitions,
    sentRecognitions,
    categories: Array.isArray(categories) ? categories : [],
    unreadCount,
    isLoading,
    isCategoriesLoading,
    sendRecognition,
    markAsRead,
    refreshRecognitions: fetchRecognitions,
    refreshCategories
  };
};

// Re-export the type for convenience
export type { RecognitionCategory } from '@/types/leader';
