
import { useState, useEffect } from 'react';
import { useReceivedRecognitions } from './useReceivedRecognitions';
import { useSentRecognitions } from './useSentRecognitions';
import { useRecognitionActions } from './useRecognitionActions';
import { useRecognitionCategories } from './useRecognitionCategories';
import { EmotionalRecognition } from '@/types/leader';

export const useEmotionalRecognitions = () => {
  const {
    receivedRecognitions,
    unreadCount,
    isLoading: isReceivedLoading,
    error: receivedError,
    refreshRecognitions: refreshReceived,
    updateRecognitionStatus
  } = useReceivedRecognitions();
  
  const {
    sentRecognitions,
    isLoading: isSentLoading,
    error: sentError,
    refreshRecognitions: refreshSent
  } = useSentRecognitions();
  
  const {
    sendRecognition,
    markAsRead
  } = useRecognitionActions();
  
  const {
    categories,
    isLoading: isCategoriesLoading
  } = useRecognitionCategories();

  // Combined loading state
  const isLoading = isReceivedLoading || isSentLoading || isCategoriesLoading;
  
  // Combined error state - prioritize received errors
  const error = receivedError || sentError;
  
  // Combined refresh function
  const refreshRecognitions = () => {
    refreshReceived();
    refreshSent();
  };

  // Handle marking a recognition as read
  const handleMarkAsRead = async (recognitionId: string) => {
    const success = await markAsRead(recognitionId);
    if (success) {
      updateRecognitionStatus(recognitionId);
    }
    return success;
  };

  return {
    // Recognition data
    receivedRecognitions,
    sentRecognitions,
    unreadCount,
    
    // Categories data
    categories,
    isCategoriesLoading,
    
    // Status
    isLoading,
    error,
    
    // Actions
    sendRecognition,
    markAsRead: handleMarkAsRead,
    refreshRecognitions,
  };
};
