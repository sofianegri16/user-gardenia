
import { supabase } from '@/integrations/supabase/client';
import { EmotionalRecognition } from '@/types/leader';

/**
 * Fetch sent recognitions for the current user
 */
export const fetchSentRecognitions = async (userId: string): Promise<EmotionalRecognition[]> => {
  try {
    // Using the explicit relationship names from the error message (fk_receiver)
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
        user_profiles!fk_receiver(id, name),
        categories:recognition_categories(id, name, emoji)
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
      receiver_name: rec.user_profiles?.name || 'Usuario',
      category: rec.categories || null
    })) || [];
    
    console.log('Processed sent recognitions:', sentWithNames);
    return sentWithNames;
  } catch (error) {
    console.error('Error fetching sent recognitions:', error);
    return [];
  }
};
