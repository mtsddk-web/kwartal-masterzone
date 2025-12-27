'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  magnetStrength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  disabled = false,
  magnetStrength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    setPosition({
      x: distanceX * magnetStrength,
      y: distanceY * magnetStrength,
    });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 15,
        mass: 0.5,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}

// Glow variant with extra effects
export function GlowMagneticButton({
  children,
  className = '',
  onClick,
  disabled = false,
  glowColor = 'rgba(245, 158, 11, 0.5)',
}: MagneticButtonProps & { glowColor?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    setPosition({
      x: distanceX * 0.3,
      y: distanceY * 0.3,
    });

    // Update glow position
    const relativeX = ((clientX - left) / width) * 100;
    const relativeY = ((clientY - top) / height) * 100;
    setGlowPosition({ x: relativeX, y: relativeY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
    setIsHovering(false);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={reset}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 15,
        mass: 0.5,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {/* Dynamic glow that follows cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor} 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Shimmer effect */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            width: '50%',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
