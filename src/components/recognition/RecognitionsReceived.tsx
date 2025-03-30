
import React, { useState, useMemo } from 'react';
import { useEmotionalRecognitions } from '@/hooks/useEmotionalRecognitions';
import { Loader2 } from 'lucide-react';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';
import RecognitionCard from './RecognitionCard';
import RecognitionDialog from './RecognitionDialog';

const RecognitionsReceived = () => {
  const { 
    receivedRecognitions, 
    sentRecognitions, 
    categories, 
    unreadCount, 
    isLoading,
    error,
    markAsRead, 
    refreshRecognitions 
  } = useEmotionalRecognitions();
  const [selectedRecognition, setSelectedRecognition] = useState<EmotionalRecognition | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  
  // Create a lookup map for categories by ID for quick access
  const categoryMap = useMemo(() => {
    const map: Record<string, RecognitionCategory> = {};
    categories.forEach(category => {
      map[category.id] = category;
    });
    return map;
  }, [categories]);
  
  const handleOpenRecognition = async (recognition: EmotionalRecognition) => {
    setSelectedRecognition(recognition);
    
    // Mark as read if it's unread
    if (!recognition.is_read) {
      await markAsRead(recognition.id);
    }
  };

  const handleRefresh = () => {
    refreshRecognitions();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'received' | 'sent');
  };

  console.log('Recognition state:', { 
    receivedCount: receivedRecognitions?.length || 0,
    sentCount: sentRecognitions?.length || 0,
    isLoading,
    error
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Cargando reconocimientos...</span>
      </div>
    );
  }

  return (
    <>
      <RecognitionCard 
        receivedRecognitions={receivedRecognitions}
        sentRecognitions={sentRecognitions}
        categoryMap={categoryMap}
        unreadCount={unreadCount}
        error={error}
        onOpenRecognition={handleOpenRecognition}
        onRefresh={handleRefresh}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <RecognitionDialog
        recognition={selectedRecognition}
        categoryMap={categoryMap}
        activeTab={activeTab}
        onClose={() => setSelectedRecognition(null)}
      />
    </>
  );
};

export default RecognitionsReceived;
