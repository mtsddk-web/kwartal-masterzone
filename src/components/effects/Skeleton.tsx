'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-night-800 relative overflow-hidden';

  const variantClasses = {
    text: 'rounded h-4',
    circle: 'rounded-full',
    rect: 'rounded-xl',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-night-700/50 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton variant="rect" className="w-24 h-8 mx-auto" />
        <Skeleton variant="text" className="w-64 h-10 mx-auto" />
        <Skeleton variant="text" className="w-96 h-6 mx-auto" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-6">
        <div className="p-6 bg-night-800/50 rounded-2xl space-y-4">
          <Skeleton variant="text" className="w-32 h-5" />
          <Skeleton variant="rect" className="w-full h-12" />
        </div>

        <div className="p-6 bg-night-800/50 rounded-2xl space-y-4">
          <Skeleton variant="text" className="w-40 h-5" />
          <Skeleton variant="rect" className="w-full h-24" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" className="h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}
