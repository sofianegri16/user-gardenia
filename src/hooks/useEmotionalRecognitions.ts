import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';

export const useEmotionalRecognitions = () => {
  const { user } = useAuth();
  const [receivedRecognitions, setReceivedRecognitions] = useState<EmotionalRecognition[]>([]);
  const [sentRecognitions, setSentRecognitions] = useState<EmotionalRecognition[]>([]);
  const [categories, setCategories] = useState<RecognitionCategory[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  
  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      
      const { data, error } = await supabase
        .from('recognition_categories')
        .select('*');
      
      if (error) throw error;
      
      console.log('Categories fetched:', data);
      setCategories(data as RecognitionCategory[]);
    } catch (error: any) {
      console.error('Error fetching recognition categories:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías de reconocimiento',
        variant: 'destructive',
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };
  
  const fetchRecognitions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching recognitions for user:', user.id);
      
      // Fetch received recognitions
      const { data: receivedData, error: receivedError } = await supabase
        .from('emotional_recognitions')
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
          is_read,
          recognition_date,
          category_id,
          profiles:sender_id(id, name),
          categories:category_id(id, name, emoji)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });
      
      if (receivedError) {
        console.error('Error fetching received recognitions:', receivedError);
        throw receivedError;
      }
      
      console.log('Received recognitions raw data:', receivedData);
      
      // Transform data to include sender name and category info
      const receivedWithNames = receivedData?.map((rec: any) => ({
        id: rec.id,
        sender_id: rec.sender_id,
        receiver_id: rec.receiver_id,
        message: rec.message,
        created_at: rec.created_at,
        is_read: rec.is_read,
        recognition_date: rec.recognition_date,
        category_id: rec.category_id,
        sender_name: rec.profiles?.name || 'Usuario',
        category: rec.categories || null
      })) || [];
      
      console.log('Processed received recognitions:', receivedWithNames);
      setReceivedRecognitions(receivedWithNames);
      setUnreadCount(receivedWithNames.filter(r => !r.is_read).length);
      
      // Fetch sent recognitions
      const { data: sentData, error: sentError } = await supabase
        .from('emotional_recognitions')
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
          is_read,
          recognition_date,
          category_id,
          profiles:receiver_id(id, name),
          categories:category_id(id, name, emoji)
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      
      if (sentError) {
        console.error('Error fetching sent recognitions:', sentError);
        throw sentError;
      }
      
      console.log('Sent recognitions raw data:', sentData);
      
      // Transform data to include receiver name
      const sentWithNames = sentData?.map((rec: any) => ({
        id: rec.id,
        sender_id: rec.sender_id,
        receiver_id: rec.receiver_id,
        message: rec.message,
        created_at: rec.created_at,
        is_read: rec.is_read,
        recognition_date: rec.recognition_date,
        category_id: rec.category_id,
        receiver_name: rec.profiles?.name || 'Usuario',
        category: rec.categories || null
      })) || [];
      
      console.log('Processed sent recognitions:', sentWithNames);
      setSentRecognitions(sentWithNames);
      
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
    
    try {
      const { error } = await supabase
        .from('emotional_recognitions')
        .insert({
          sender_id: user.id,
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
      
      // Refresh the recognitions list
      fetchRecognitions();
      
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
      const { error } = await supabase
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
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecognitions();
    }
  }, [user, fetchRecognitions]);
  
  return {
    receivedRecognitions,
    sentRecognitions,
    categories,
    unreadCount,
    isLoading,
    isCategoriesLoading,
    sendRecognition,
    markAsRead,
    refreshRecognitions: fetchRecognitions
  };
};

// Directly re-export the type from the types file for convenience
export type { RecognitionCategory } from '@/types/leader';
