'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export default function AnimatedTooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
}: AnimatedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const calculatePosition = () => {
    if (!triggerRef.current) return { x: 0, y: 0 };

    const rect = triggerRef.current.getBoundingClientRect();
    const padding = 12;

    switch (position) {
      case 'top':
        return {
          x: rect.left + rect.width / 2,
          y: rect.top - padding,
        };
      case 'bottom':
        return {
          x: rect.left + rect.width / 2,
          y: rect.bottom + padding,
        };
      case 'left':
        return {
          x: rect.left - padding,
          y: rect.top + rect.height / 2,
        };
      case 'right':
        return {
          x: rect.right + padding,
          y: rect.top + rect.height / 2,
        };
      default:
        return { x: 0, y: 0 };
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setCoords(calculatePosition());
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionVariants = {
    top: {
      initial: { opacity: 0, y: 10, x: '-50%' },
      animate: { opacity: 1, y: 0, x: '-50%' },
      exit: { opacity: 0, y: 10, x: '-50%' },
      style: { bottom: '100%', left: '50%' },
    },
    bottom: {
      initial: { opacity: 0, y: -10, x: '-50%' },
      animate: { opacity: 1, y: 0, x: '-50%' },
      exit: { opacity: 0, y: -10, x: '-50%' },
      style: { top: '100%', left: '50%' },
    },
    left: {
      initial: { opacity: 0, x: 10, y: '-50%' },
      animate: { opacity: 1, x: 0, y: '-50%' },
      exit: { opacity: 0, x: 10, y: '-50%' },
      style: { right: '100%', top: '50%' },
    },
    right: {
      initial: { opacity: 0, x: -10, y: '-50%' },
      animate: { opacity: 1, x: 0, y: '-50%' },
      exit: { opacity: 0, x: -10, y: '-50%' },
      style: { left: '100%', top: '50%' },
    },
  };

  const variant = positionVariants[position];

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[10002] px-3 py-2 text-sm text-white bg-night-800/95 backdrop-blur-lg rounded-lg border border-night-700 shadow-xl whitespace-nowrap"
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: coords.x,
            top: coords.y,
            transform: `translate(${position === 'left' ? '-100%' : position === 'right' ? '0' : '-50%'}, ${position === 'top' ? '-100%' : position === 'bottom' ? '0' : '-50%'})`,
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ember-500/10 to-indigo-500/10 blur-xl -z-10" />

          {content}

          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-night-800 border-night-700 transform rotate-45 ${
              position === 'top'
                ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b'
                : position === 'bottom'
                ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t'
                : position === 'left'
                ? 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-t border-r'
                : 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </div>
      {mounted && createPortal(tooltipContent, document.body)}
    </>
  );
}

// Helper component for keyboard shortcut hints
export function ShortcutHint({
  children,
  shortcut,
  position = 'top',
}: {
  children: React.ReactNode;
  shortcut: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <AnimatedTooltip
      content={
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 bg-night-900 rounded text-xs font-mono text-ember-400 border border-night-600">
            {shortcut}
          </kbd>
        </div>
      }
      position={position}
    >
      {children}
    </AnimatedTooltip>
  );
}

// Hint bubble that appears on first visit
export function HintBubble({
  children,
  show,
  onDismiss,
  position = 'bottom',
}: {
  children: React.ReactNode;
  show: boolean;
  onDismiss: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`absolute z-50 px-4 py-3 bg-gradient-to-r from-ember-500/20 to-indigo-500/20 backdrop-blur-lg rounded-xl border border-ember-500/30 shadow-2xl max-w-xs ${
        position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
      } left-1/2 -translate-x-1/2`}
    >
      <button
        onClick={onDismiss}
        className="absolute -top-2 -right-2 w-6 h-6 bg-night-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-night-700"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-ember-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-sm text-slate-300">{children}</div>
      </div>

      {/* Pulsing indicator */}
      <motion.div
        className={`absolute w-3 h-3 bg-ember-500 rounded-full ${
          position === 'top' ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'
        } left-1/2 -translate-x-1/2`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}
