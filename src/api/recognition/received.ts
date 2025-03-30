
import { supabase } from '@/integrations/supabase/client';
import { EmotionalRecognition } from '@/types/leader';

/**
 * Fetch received recognitions for the current user
 */
export const fetchReceivedRecognitions = async (userId: string): Promise<EmotionalRecognition[]> => {
  try {
    // Using the explicit relationship names from the error message (fk_sender)
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
        user_profiles!fk_sender(id, name),
        categories:recognition_categories(id, name, emoji)
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
      sender_name: rec.user_profiles?.name || 'Usuario',
      category: rec.categories || null
    })) || [];
    
    console.log('Processed received recognitions:', receivedWithNames);
    return receivedWithNames;
  } catch (error) {
    console.error('Error fetching received recognitions:', error);
    return [];
  }
};
