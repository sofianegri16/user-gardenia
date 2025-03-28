
import { useState, useEffect } from 'react';

export type InteractionElementType = 'energy' | 'mentalPressure' | 'personalConcerns' | 'achievements' | 'exceptionalDay' | 'weather';

export const useInteractions = (isAnimating: boolean) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clicked, setClicked] = useState<InteractionElementType | null>(null);
  
  // Handle hover effects
  const handlePointerOver = (element: string) => {
    if (!isAnimating) {
      setHovered(element);
      document.body.style.cursor = 'pointer';
    }
  };
  
  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  };
  
  // Handle click events
  const handleElementClick = (element: InteractionElementType) => {
    if (!isAnimating) {
      setClicked(element);
    }
  };
  
  const resetClickState = () => {
    setClicked(null);
  };
  
  // Reset cursor when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);
  
  return {
    hovered,
    clicked,
    handlePointerOver,
    handlePointerOut,
    handleElementClick,
    resetClickState
  };
};
