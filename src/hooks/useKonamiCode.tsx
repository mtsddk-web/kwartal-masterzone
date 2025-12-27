'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

// The classic Konami Code sequence
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

// MasterZone secret code: M-A-S-T-E-R
const MASTER_SEQUENCE = ['m', 'a', 's', 't', 'e', 'r'];

export function useKonamiCode(onActivate?: () => void) {
  const [isActivated, setIsActivated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerEasterEgg = useCallback(() => {
    setIsActivated(true);

    // Epic confetti celebration
    const duration = 5000;
    const end = Date.now() + duration;

    const colors = ['#f59e0b', '#6366f1', '#a855f7', '#22d3ee', '#fbbf24'];

    // Continuous fireworks
    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        shapes: ['star', 'circle'],
        scalar: 1.2,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        shapes: ['star', 'circle'],
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big center burst
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.4 },
        colors: colors,
        shapes: ['star'],
        scalar: 2,
        gravity: 0.5,
      });
    }, 1000);

    onActivate?.();

    // Reset after animation
    setTimeout(() => {
      setIsActivated(false);
    }, 6000);
  }, [onActivate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear timeout on new key press
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const key = e.key.toLowerCase();
      const expectedKonami = KONAMI_SEQUENCE[currentIndex]?.toLowerCase();
      const expectedMaster = MASTER_SEQUENCE[currentIndex]?.toLowerCase();

      if (key === expectedKonami || key === expectedMaster) {
        const newIndex = currentIndex + 1;

        // Check if either sequence is complete
        if (newIndex === KONAMI_SEQUENCE.length || newIndex === MASTER_SEQUENCE.length) {
          triggerEasterEgg();
          setCurrentIndex(0);
        } else {
          setCurrentIndex(newIndex);

          // Reset after 3 seconds of inactivity
          timeoutRef.current = setTimeout(() => {
            setCurrentIndex(0);
          }, 3000);
        }
      } else {
        // Wrong key - reset
        setCurrentIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, triggerEasterEgg]);

  return { isActivated, progress: currentIndex / KONAMI_SEQUENCE.length };
}

// Easter egg overlay component
export function EasterEggOverlay({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[10001] pointer-events-none flex items-center justify-center">
      <div className="text-center animate-bounce">
        <div className="text-6xl md:text-8xl font-display font-bold bg-gradient-to-r from-ember-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
          MASTER MODE
        </div>
        <div className="mt-4 text-2xl text-white/80 font-medium">
          Odkryto sekretny kod!
        </div>
      </div>
    </div>
  );
}
