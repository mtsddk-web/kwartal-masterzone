'use client';

import { motion, useAnimation } from 'framer-motion';
import { useCallback, forwardRef, useImperativeHandle } from 'react';

interface ShakeAnimationProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

export interface ShakeAnimationRef {
  shake: () => void;
}

const intensityConfig = {
  light: { x: [-2, 2, -2, 2, 0], duration: 0.3 },
  medium: { x: [-5, 5, -5, 5, -3, 3, 0], duration: 0.4 },
  strong: { x: [-10, 10, -10, 10, -8, 8, -5, 5, 0], duration: 0.5 },
};

const ShakeAnimation = forwardRef<ShakeAnimationRef, ShakeAnimationProps>(
  ({ children, className = '', intensity = 'medium' }, ref) => {
    const controls = useAnimation();
    const config = intensityConfig[intensity];

    const shake = useCallback(async () => {
      await controls.start({
        x: config.x,
        transition: {
          duration: config.duration,
          ease: 'easeInOut',
        },
      });
    }, [controls, config]);

    useImperativeHandle(ref, () => ({ shake }), [shake]);

    return (
      <motion.div className={className} animate={controls}>
        {children}
      </motion.div>
    );
  }
);

ShakeAnimation.displayName = 'ShakeAnimation';

export default ShakeAnimation;

// Hook for triggering shake on error
export function useShakeOnError() {
  const controls = useAnimation();

  const triggerShake = useCallback(async () => {
    await controls.start({
      x: [-10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4 },
    });
  }, [controls]);

  return { shakeControls: controls, triggerShake };
}

// Input wrapper with shake on invalid
export function ShakeInput({
  children,
  isError,
  className = '',
}: {
  children: React.ReactNode;
  isError: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={
        isError
          ? {
              x: [-5, 5, -5, 5, -3, 3, 0],
              borderColor: ['#ef4444', '#ef4444', '#ef4444'],
            }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
