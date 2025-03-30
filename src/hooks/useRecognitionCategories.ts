
import { useState, useEffect } from 'react';
import { RecognitionCategory } from '@/types/leader';
import { fetchRecognitionCategories } from '@/api/recognitionService';

export const useRecognitionCategories = () => {
  const [categories, setCategories] = useState<RecognitionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRecognitionCategories();
      setCategories(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    refreshCategories: loadCategories
  };
};
