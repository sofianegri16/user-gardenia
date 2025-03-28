
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { WeatherType } from '@/types/garden';

// Custom hook to manage garden animations
export const useGardenAnimations = (
  skyRef: React.RefObject<THREE.Mesh>,
  rootsRef: React.RefObject<THREE.Group>,
  waterRef: React.RefObject<THREE.Group>,
  raindropsRef: React.RefObject<THREE.Group>,
  cloudsRef: React.RefObject<THREE.Group>,
  bugsRef: React.RefObject<THREE.Group>,
  skyColors: Record<WeatherType, THREE.Color>,
  groundColors: Record<WeatherType, THREE.Color>,
  weather: WeatherType,
  raindrops: Array<{
    position: [number, number, number];
    speed: number;
    size: number;
  }>,
  clouds: Array<{
    position: [number, number, number];
    scale: [number, number, number];
    speed: number;
  }>,
  bugs: Array<{
    position: [number, number, number];
    type: 'butterfly' | 'bee';
    speed: number;
    radius: number;
    phase: number;
    wingPhase: number;
  }>,
  personalConcerns: number,
  energy: number
) => {
  // Use React Three Fiber's useFrame hook for animations
  useFrame((state, delta) => {
    // Animate sky based on weather
    if (skyRef.current) {
      const skyMaterial = skyRef.current.material as THREE.MeshBasicMaterial;
      skyMaterial.color.lerp(skyColors[weather], 0.01);
    }
    
    // Animate ground based on weather
    const groundMesh = state.scene.getObjectByName('ground') as THREE.Mesh | undefined;
    if (groundMesh) {
      const groundMat = groundMesh.material as THREE.MeshStandardMaterial;
      groundMat.color.lerp(groundColors[weather], 0.01);
    }
    
    // Animate roots based on personal concerns
    if (rootsRef.current) {
      const scale = 0.5 + (personalConcerns / 10) * 1.5;
      rootsRef.current.scale.set(scale, scale, scale);
    }
    
    // Animate raindrops if weather is rainy
    if (raindropsRef.current && weather === 'rainy') {
      raindropsRef.current.children.forEach((drop, i) => {
        drop.position.y -= raindrops[i]?.speed || 0.1;
        if (drop.position.y < 0) {
          drop.position.y = 10;
        }
      });
    }
    
    // Animate clouds if weather is cloudy or rainy
    if (cloudsRef.current && (weather === 'cloudy' || weather === 'rainy')) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += clouds[i]?.speed || 0.001;
        if (cloud.position.x > 10) {
          cloud.position.x = -10;
        }
      });
    }
    
    // Animate insects
    if (bugsRef.current) {
      bugsRef.current.children.forEach((bug, i) => {
        if (i < bugs.length) {
          const bugData = bugs[i];
          bugData.phase += bugData.speed;
          bugData.wingPhase += 0.2;
          
          bug.position.x = bugData.position[0] + Math.sin(bugData.phase) * bugData.radius;
          bug.position.y = bugData.position[1] + Math.sin(bugData.phase * 1.5) * 0.5;
          bug.position.z = bugData.position[2] + Math.cos(bugData.phase) * bugData.radius;
          
          bug.rotation.y = Math.atan2(
            Math.cos(bugData.phase) * bugData.radius,
            Math.sin(bugData.phase) * bugData.radius
          );
          
          // Animate butterfly wings
          if (bugData.type === 'butterfly' && bug instanceof THREE.Group) {
            for (let j = 0; j < bug.children.length; j++) {
              if (j < 2) { // Only wing meshes (first two children)
                const wing = bug.children[j];
                wing.rotation.y = Math.sin(bugData.wingPhase) * (j === 0 ? 0.5 : -0.5);
              }
            }
          }
        }
      });
    }
    
    // Animate water level based on energy
    if (waterRef.current) {
      const targetScale = 0.5 + (energy / 10) * 1.5;
      waterRef.current.scale.y += (targetScale - waterRef.current.scale.y) * 0.05;
    }
  });
};
