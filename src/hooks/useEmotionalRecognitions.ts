
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionalRecognition } from '@/types/leader';

export const useEmotionalRecognitions = () => {
  const { user } = useAuth();
  const [receivedRecognitions, setReceivedRecognitions] = useState<EmotionalRecognition[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchRecognitions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Use the type-unsafe version of the Supabase client to query the new table
      const { data, error } = await (supabase as any)
        .from('emotional_recognitions')
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
          is_read,
          recognition_date,
          sender:user_profiles!sender_id(id, name)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include sender name
      const recognitionsWithNames = data.map((rec: any) => ({
        id: rec.id,
        sender_id: rec.sender_id,
        receiver_id: rec.receiver_id,
        message: rec.message,
        created_at: rec.created_at,
        is_read: rec.is_read,
        recognition_date: rec.recognition_date,
        sender_name: rec.sender?.name || 'Usuario'
      })) as EmotionalRecognition[];
      
      setReceivedRecognitions(recognitionsWithNames);
      setUnreadCount(recognitionsWithNames.filter(r => !r.is_read).length);
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
  };
  
  const sendRecognition = async (receiverId: string, message: string) => {
    if (!user) return false;
    
    try {
      // Use the type-unsafe version of the Supabase client to insert into the new table
      const { error } = await (supabase as any)
        .from('emotional_recognitions')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          message,
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
  
  const markAsRead = async (recognitionId: string) => {
    if (!user) return false;
    
    try {
      // Use the type-unsafe version of the Supabase client to update the new table
      const { error } = await (supabase as any)
        .from('emotional_recognitions')
        .update({ is_read: true })
        .eq('id', recognitionId)
        .eq('receiver_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setReceivedRecognitions(prev => 
        prev.map(rec => 
          rec.id === recognitionId ? { ...rec, is_read: true } : rec
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error: any) {
      console.error('Error marking recognition as read:', error);
      return false;
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchRecognitions();
    }
  }, [user]);
  
  return {
    receivedRecognitions,
    unreadCount,
    isLoading,
    sendRecognition,
    markAsRead,
    refreshRecognitions: fetchRecognitions
  };
};
