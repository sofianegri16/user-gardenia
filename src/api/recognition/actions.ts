
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Send a new recognition
 */
export const sendNewRecognition = async (
  senderId: string,
  receiverId: string, 
  message: string, 
  categoryId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('emotional_recognitions')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        category_id: categoryId,
        recognition_date: new Date().toISOString().split('T')[0],
        is_read: false
      });
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: 'Límite alcanzado',
          description: 'Ya has enviado un reconocimiento a esta persona hoy',
          variant: 'destructive',
        });
      } else {
        throw error;
      }
      return false;
    }
    
    toast({
      title: 'Reconocimiento enviado',
      description: 'Tu mensaje de reconocimiento ha sido enviado correctamente',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error sending recognition:', error);
    toast({
      title: 'Error',
      description: 'No se pudo enviar el reconocimiento',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Mark a recognition as read
 */
export const markRecognitionAsRead = async (
  recognitionId: string,
  userId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('emotional_recognitions')
      .update({ is_read: true })
      .eq('id', recognitionId)
      .eq('receiver_id', userId);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error marking recognition as read:', error);
    return false;
  }
};
