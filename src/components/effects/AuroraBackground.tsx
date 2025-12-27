'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// Generate stars with deterministic positions based on index
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    // Use a seeded pseudo-random based on index
    const seed = (i * 9301 + 49297) % 233280;
    const rand1 = seed / 233280;
    const seed2 = (seed * 9301 + 49297) % 233280;
    const rand2 = seed2 / 233280;
    const seed3 = (seed2 * 9301 + 49297) % 233280;
    const rand3 = seed3 / 233280;
    const seed4 = (seed3 * 9301 + 49297) % 233280;
    const rand4 = seed4 / 233280;
    const seed5 = (seed4 * 9301 + 49297) % 233280;
    const rand5 = seed5 / 233280;

    return {
      id: i,
      width: rand1 * 2 + 1,
      height: rand2 * 2 + 1,
      left: rand3 * 100,
      top: rand4 * 100,
      duration: 2 + rand5 * 3,
      delay: rand1 * 5,
    };
  });
}

const STARS = generateStars(50);

export default function AuroraBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-950 via-night-900 to-night-950" />

      {/* Aurora layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Aurora wave 1 - Amber/Gold */}
        <motion.div
          className="absolute w-[200%] h-[60%] top-[10%] -left-[50%]"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 50%,
                rgba(245, 158, 11, 0.15) 0%,
                rgba(245, 158, 11, 0.08) 30%,
                transparent 70%
              )
            `,
            filter: 'blur(40px)',
          }}
          animate={{
            x: ['0%', '25%', '0%'],
            y: ['0%', '10%', '0%'],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Aurora wave 2 - Indigo/Purple */}
        <motion.div
          className="absolute w-[200%] h-[50%] top-[20%] -left-[25%]"
          style={{
            background: `
              radial-gradient(ellipse 70% 40% at 60% 50%,
                rgba(99, 102, 241, 0.12) 0%,
                rgba(139, 92, 246, 0.08) 40%,
                transparent 70%
              )
            `,
            filter: 'blur(50px)',
          }}
          animate={{
            x: ['0%', '-20%', '0%'],
            y: ['0%', '-15%', '0%'],
            scale: [1, 1.15, 1],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Aurora wave 3 - Cyan/Teal accent */}
        <motion.div
          className="absolute w-[150%] h-[40%] top-[30%] -left-[25%]"
          style={{
            background: `
              radial-gradient(ellipse 60% 35% at 40% 50%,
                rgba(34, 211, 238, 0.08) 0%,
                rgba(20, 184, 166, 0.05) 50%,
                transparent 70%
              )
            `,
            filter: 'blur(60px)',
          }}
          animate={{
            x: ['0%', '30%', '0%'],
            y: ['0%', '20%', '0%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />

        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                45deg,
                transparent 40%,
                rgba(255, 255, 255, 0.02) 50%,
                transparent 60%
              )
            `,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Stars layer - only render when mounted to avoid hydration mismatch */}
        {mounted && (
          <div className="absolute inset-0">
            {STARS.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: star.width,
                  height: star.height,
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </div>
        )}

        {/* Shooting stars */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: '10%',
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.5)',
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [0, 200],
              y: [0, 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 8 + i * 5,
              delay: i * 3,
            }}
          >
            {/* Trail */}
            <div
              className="absolute w-20 h-0.5 -left-20 top-0 origin-right"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8))',
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at 50% 50%,
              transparent 0%,
              rgba(8, 7, 22, 0.4) 100%
            )
          `,
        }}
      />
    </div>
  );
}
