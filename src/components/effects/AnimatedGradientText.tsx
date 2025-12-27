'use client';

import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationDuration?: number;
}

export default function AnimatedGradientText({
  children,
  className = '',
  colors = ['#f59e0b', '#fbbf24', '#6366f1', '#a855f7', '#f59e0b'],
  animationDuration = 5,
}: AnimatedGradientTextProps) {
  const gradientColors = colors.join(', ');

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientColors})`,
        backgroundSize: '300% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}

// Shimmer text variant
export function ShimmerText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base text */}
      <span className="relative z-10">{children}</span>

      {/* Shimmer overlay */}
      <motion.span
        className="absolute inset-0 z-20 overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        animate={{
          backgroundPosition: ['-100% 0%', '200% 0%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Glitch text variant
export function GlitchText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Shadow layers */}
      <motion.span
        className="absolute inset-0 text-red-500/30"
        animate={{
          x: [-2, 2, -2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-cyan-500/30"
        animate={{
          x: [2, -2, 2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 0.1,
        }}
      >
        {children}
      </motion.span>

      {/* Main text */}
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// Wave text - letters animate in a wave
export function WaveText({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
            delay: delay + index * 0.05,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}
