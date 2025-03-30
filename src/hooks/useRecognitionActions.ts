
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { sendNewRecognition, markRecognitionAsRead } from '@/api/recognition';

export const useRecognitionActions = () => {
  const { user } = useAuth();

  const sendRecognition = useCallback(async (receiverId: string, message: string, categoryId: string) => {
    if (!user) return false;
    
    try {
      const success = await sendNewRecognition(user.id, receiverId, message, categoryId);
      
      if (success) {
        toast({
          title: 'Reconocimiento enviado',
          description: 'Tu mensaje de reconocimiento ha sido enviado correctamente',
        });
      }
      
      return success;
    } catch (error: any) {
      console.error('Error sending recognition:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el reconocimiento',
        variant: 'destructive',
      });
      return false;
    }
  }, [user]);
  
  const markAsRead = useCallback(async (recognitionId: string) => {
    if (!user) return false;
    
    try {
      return await markRecognitionAsRead(recognitionId, user.id);
    } catch (error: any) {
      console.error('Error marking recognition as read:', error);
      return false;
    }
  }, [user]);

  return {
    sendRecognition,
    markAsRead
  };
};
