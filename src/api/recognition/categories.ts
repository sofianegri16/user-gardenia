
import { supabase } from '@/integrations/supabase/client';
import { RecognitionCategory } from '@/types/leader';
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
