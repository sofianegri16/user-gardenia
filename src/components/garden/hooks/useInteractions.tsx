
import { useState, useEffect } from 'react';

export type InteractionElementType = 'energy' | 'mentalPressure' | 'personalConcerns' | 'achievements' | 'exceptionalDay' | 'weather';

export const useInteractions = (isAnimating: boolean) => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Handle hover effects
  const handlePointerOver = (element: string) => {
    setHovered(element);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  };
  
  return {
    hovered,
    handlePointerOver,
    handlePointerOut
  };
};
