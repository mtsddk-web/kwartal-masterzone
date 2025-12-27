'use client';

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const fireConfetti = useCallback(() => {
    // Main burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#6366f1', '#818cf8', '#a855f7'],
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#fbbf24'],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#818cf8'],
      });
    }, 400);
  }, []);

  const fireSparkle = useCallback(() => {
    // Small sparkle effect for step completion
    confetti({
      particleCount: 30,
      spread: 50,
      startVelocity: 20,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff'],
      ticks: 100,
      gravity: 1.5,
      scalar: 0.8,
    });
  }, []);

  const fireStars = useCallback(() => {
    // Star-shaped confetti
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#f59e0b', '#fbbf24', '#6366f1'],
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    });

    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 0.75,
      shapes: ['circle'],
    });
  }, []);

  return { fireConfetti, fireSparkle, fireStars };
}

// Progress celebration - mini sparkle
export function MiniSparkle({ x, y }: { x: number; y: number }) {
  confetti({
    particleCount: 15,
    spread: 40,
    startVelocity: 15,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: ['#f59e0b', '#fbbf24'],
    ticks: 60,
    gravity: 2,
    scalar: 0.6,
    disableForReducedMotion: true,
  });
}
