
import { useMemo } from 'react';
import * as THREE from 'three';
import { WeatherType } from '@/types/garden';

export const useGardenElements = (
  weather: WeatherType,
  achievements: number,
  exceptionalDay: number
) => {
  // Colors based on weather
  const skyColors = useMemo(() => ({
    sunny: new THREE.Color('#87CEEB'),
    cloudy: new THREE.Color('#B0C4DE'),
    rainy: new THREE.Color('#4682B4'),
  }), []);
  
  const groundColors = useMemo(() => ({
    sunny: new THREE.Color('#7CFC00'),
    cloudy: new THREE.Color('#669966'),
    rainy: new THREE.Color('#3A5F0B'),
  }), []);
  
  // Create raindrops when weather is rainy
  const raindrops = useMemo(() => {
    if (weather !== 'rainy') return [];
    
    return Array.from({ length: 100 }).map(() => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 10 + 5,
        Math.random() * 20 - 10
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.2,
      size: 0.02 + Math.random() * 0.03
    }));
  }, [weather]);
  
  // Create clouds when weather is cloudy or rainy
  const clouds = useMemo(() => {
    if (weather === 'sunny') return [];
    
    return Array.from({ length: weather === 'cloudy' ? 8 : 12 }).map(() => ({
      position: [
        Math.random() * 16 - 8,
        Math.random() * 2 + 7,
        Math.random() * 16 - 8
      ] as [number, number, number],
      scale: [
        0.5 + Math.random() * 1.5,
        0.5 + Math.random() * 0.5,
        0.5 + Math.random() * 1.5
      ] as [number, number, number],
      speed: 0.001 + Math.random() * 0.002
    }));
  }, [weather]);
  
  // Create flowers based on achievements
  const flowers = useMemo(() => {
    const flowerCount = Math.max(0, Math.floor(achievements / 2));
    
    return Array.from({ length: flowerCount }).map(() => ({
      position: [
        Math.random() * 14 - 7,
        0.1,
        Math.random() * 14 - 7
      ] as [number, number, number],
      color: [
        ['#FF69B4', '#FF1493', '#DB7093'][Math.floor(Math.random() * 3)],
        ['#FFFF00', '#FFD700', '#FFA500'][Math.floor(Math.random() * 3)],
      ][Math.floor(Math.random() * 2)],
      scale: 0.15 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, [achievements]);
  
  // Create fruits if it's an exceptional day
  const fruits = useMemo(() => {
    if (exceptionalDay !== 1) return [];
    
    return Array.from({ length: 5 }).map(() => ({
      position: [
        Math.random() * 1.6 - 0.8,
        Math.random() * 1.6 - 0.8,
        Math.random() * 1.6 - 0.8
      ] as [number, number, number],
      scale: 0.12 + Math.random() * 0.08,
    }));
  }, [exceptionalDay]);
  
  // Create butterflies and bees
  const bugs = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      position: [
        Math.random() * 12 - 6,
        1 + Math.random() * 4,
        Math.random() * 12 - 6
      ] as [number, number, number],
      type: Math.random() > 0.5 ? 'butterfly' as const : 'bee' as const,
      speed: 0.01 + Math.random() * 0.02,
      radius: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      wingPhase: 0,
    }));
  }, []);
  
  return {
    skyColors,
    groundColors,
    raindrops,
    clouds,
    flowers,
    fruits,
    bugs
  };
};
