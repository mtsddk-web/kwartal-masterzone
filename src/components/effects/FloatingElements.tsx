'use client';

import { motion } from 'framer-motion';

export default function FloatingElements() {
  const elements = [
    { size: 300, x: '10%', y: '20%', color: 'rgba(245, 158, 11, 0.08)', delay: 0 },
    { size: 200, x: '80%', y: '60%', color: 'rgba(99, 102, 241, 0.1)', delay: 1 },
    { size: 150, x: '70%', y: '10%', color: 'rgba(168, 85, 247, 0.08)', delay: 2 },
    { size: 250, x: '20%', y: '70%', color: 'rgba(99, 102, 241, 0.06)', delay: 0.5 },
    { size: 100, x: '90%', y: '80%', color: 'rgba(245, 158, 11, 0.1)', delay: 1.5 },
    { size: 180, x: '5%', y: '50%', color: 'rgba(168, 85, 247, 0.06)', delay: 2.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: el.size,
            height: el.size,
            left: el.x,
            top: el.y,
            background: el.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: el.delay,
          }}
        />
      ))}

      {/* Decorative lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <motion.line
          x1="0%"
          y1="30%"
          x2="100%"
          y2="70%"
          stroke="url(#gradient1)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, delay: 1 }}
        />
        <motion.line
          x1="100%"
          y1="20%"
          x2="0%"
          y2="80%"
          stroke="url(#gradient2)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 3, delay: 1.5 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64">
        <motion.div
          className="absolute top-8 left-8 w-32 h-[1px] bg-gradient-to-r from-ember-500/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.div
          className="absolute top-8 left-8 h-32 w-[1px] bg-gradient-to-b from-ember-500/50 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-64 h-64">
        <motion.div
          className="absolute bottom-8 right-8 w-32 h-[1px] bg-gradient-to-l from-indigo-500/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-8 right-8 h-32 w-[1px] bg-gradient-to-t from-indigo-500/50 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </div>
    </div>
  );
}
