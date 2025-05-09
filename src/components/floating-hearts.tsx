"use client";

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeartStyle {
  id: number;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  size: string;
  opacity: number;
  color: string;
  floatX: string;
  floatY: string;
  floatRotate: string;
}

const heartColors = [
  'hsl(var(--primary))', // Rosa Choque
  'hsl(var(--secondary))', // Rosa Médio
  'hsl(var(--muted))', // Roxo Claro (border color, might be too light)
  'rgba(233, 30, 99, 0.7)', // Rosa choque with some transparency
  'rgba(244, 143, 177, 0.8)', // Rosa medio with some transparency
];

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<HeartStyle[]>([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts: HeartStyle[] = [];
      const numHearts = 25; // Number of hearts

      for (let i = 0; i < numHearts; i++) {
        newHearts.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`, // Start anywhere on screen
          animationDuration: `${Math.random() * 5 + 8}s`, // 8s to 13s
          animationDelay: `${Math.random() * 5}s`, // 0s to 5s delay
          size: `${Math.random() * 20 + 15}px`, // 15px to 35px
          opacity: Math.random() * 0.3 + 0.2, // 0.2 to 0.5 initial opacity, animation handles fade
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          floatX: `${Math.random() * 60 - 30}px`, // -30px to +30px
          floatY: `${Math.random() * 60 - 30}px`, // -30px to +30px
          floatRotate: `${Math.random() * 20 - 10}deg`, // -10deg to +10deg
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
    // Regenerate hearts occasionally or on resize if complex interactivity is needed
    // For this version, they are generated once.
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1] pointer-events-none" aria-hidden="true">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute heart-float"
          style={{
            left: heart.left,
            top: heart.top,
            width: heart.size,
            height: heart.size,
            color: heart.color,
            opacity: heart.opacity, // Initial opacity, keyframes will handle transition
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
            '--float-x': heart.floatX,
            '--float-y': heart.floatY,
            '--float-rotate': heart.floatRotate,
          } as React.CSSProperties} 
          fill={heart.color}
        />
      ))}
    </div>
  );
};

export default FloatingHearts;
