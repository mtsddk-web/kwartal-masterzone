'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  border?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export default function Card3D({
  children,
  className = '',
  intensity = 15,
  border = true,
  glow = true,
  glowColor = 'rgba(245, 158, 11, 0.3)',
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (e.clientX - centerX) / rect.width;
    const mouseY = (e.clientY - centerY) / rect.height;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 blur-xl -z-10"
          animate={{ opacity: isHovering ? 0.5 : 0 }}
          style={{ background: glowColor }}
        />
      )}

      {/* Border glow */}
      {border && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          style={{
            background: `linear-gradient(135deg, ${glowColor}, transparent) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={{ opacity: isHovering ? 1 : 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        style={{ transform: 'translateZ(1px)' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
          animate={{
            opacity: isHovering ? 0.3 : 0,
            x: isHovering ? ['0%', '100%'] : '0%',
          }}
          transition={{
            opacity: { duration: 0.2 },
            x: { duration: 0.6, ease: 'easeInOut' },
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Flip card variant
export function FlipCard({
  front,
  back,
  className = '',
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Tilt card with parallax layers
export function ParallaxCard({
  children,
  layers,
  className = '',
}: {
  children: React.ReactNode;
  layers?: React.ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: 800,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base content */}
      <div style={{ transform: 'translateZ(0px)' }}>{children}</div>

      {/* Parallax layers */}
      {layers?.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateZ(${(index + 1) * 20}px)`,
          }}
        >
          {layer}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Glass morphism card with hover
export function GlassCard({
  children,
  className = '',
  hoverGlow = true,
}: {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}) {
  return (
    <motion.div
      className={`relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Hover glow */}
      {hoverGlow && (
        <motion.div
          className="absolute -inset-px rounded-2xl opacity-0"
          whileHover={{ opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(99, 102, 241, 0.2))',
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
