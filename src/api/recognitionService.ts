
import { supabase } from '@/integrations/supabase/client';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';
import { toast } from '@/hooks/use-toast';

/**
 * Fetch recognition categories from Supabase
 */
export const fetchRecognitionCategories = async (): Promise<RecognitionCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('recognition_categories')
      .select('*');
    
    if (error) throw error;
    
    console.log('Categories fetched:', data);
    return Array.isArray(data) ? data as RecognitionCategory[] : [];
  } catch (error: any) {
    console.error('Error fetching recognition categories:', error);
    toast({
      title: 'Error',
      description: 'No se pudieron cargar las categorías de reconocimiento',
      variant: 'destructive',
    });
    return [];
  }
};

/**
 * Fetch received recognitions for the current user
 */
export const fetchReceivedRecognitions = async (userId: string): Promise<EmotionalRecognition[]> => {
  try {
    const { data, error } = await supabase
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
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching received recognitions:', error);
      throw error;
    }
    
    console.log('Received recognitions raw data:', data);
    
    // Transform data to include sender name and category info
    const receivedWithNames = data?.map((rec: any) => ({
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
    return receivedWithNames;
  } catch (error) {
    console.error('Error fetching received recognitions:', error);
    return [];
  }
};

/**
 * Fetch sent recognitions for the current user
 */
export const fetchSentRecognitions = async (userId: string): Promise<EmotionalRecognition[]> => {
  try {
    const { data, error } = await supabase
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
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sent recognitions:', error);
      throw error;
    }
    
    console.log('Sent recognitions raw data:', data);
    
    // Transform data to include receiver name
    const sentWithNames = data?.map((rec: any) => ({
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
    return sentWithNames;
  } catch (error) {
    console.error('Error fetching sent recognitions:', error);
    return [];
  }
};

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
