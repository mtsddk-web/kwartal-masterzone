'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface NumberMorphProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
}

export default function NumberMorph({
  value,
  duration = 1,
  className = '',
  format = (n) => Math.round(n).toLocaleString('pl-PL'),
  prefix = '',
  suffix = '',
}: NumberMorphProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    previousValue.current = value;

    return () => controls.stop();
  }, [value, duration]);

  return (
    <motion.span
      className={`tabular-nums ${className}`}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
      key={value}
    >
      {prefix}
      {format(displayValue)}
      {suffix}
    </motion.span>
  );
}

// Percentage counter with circular progress
export function PercentageMorph({
  value,
  size = 80,
  strokeWidth = 6,
  className = '',
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);

  useEffect(() => {
    springValue.set(value);
  }, [springValue, value]);

  const strokeDashoffset = useTransform(
    springValue,
    [0, 100],
    [circumference, 0]
  );

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-night-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <NumberMorph
          value={value}
          suffix="%"
          className="text-lg font-bold text-white"
        />
      </div>
    </div>
  );
}

// Counting up animation
export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  className = '',
  decimals = 0,
  prefix = '',
  suffix = '',
}: {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    const controls = animate(start, end, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (latest) => {
        setCount(Number(latest.toFixed(decimals)));
      },
    });

    return () => controls.stop();
  }, [hasStarted, start, end, duration, decimals]);

  return (
    <motion.span
      className={`tabular-nums ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {prefix}
      {count.toLocaleString('pl-PL', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </motion.span>
  );
}

// Slot machine effect
export function SlotMachineNumber({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const digits = value.toString().split('');

  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {digits.map((digit, index) => (
        <motion.span
          key={`${index}-${digit}`}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: index * 0.1,
          }}
          className="inline-block"
        >
          {digit}
        </motion.span>
      ))}
    </span>
  );
}
