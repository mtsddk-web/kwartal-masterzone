'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingText from './effects/TypingText';
import FloatingElements from './effects/FloatingElements';
import ParticlesBackground from './effects/ParticlesBackground';

interface LandingHeroProps {
  onStart: () => void;
}

const quotes = [
  { text: "Jeśli twój plan nie przeraża cię trochę, nie myślisz wystarczająco szeroko.", author: "Jeff Bezos" },
  { text: "Plan bez deadlinu to tylko życzenie.", author: "Antoine de Saint-Exupéry" },
  { text: "Nie planując, planujesz porażkę.", author: "Benjamin Franklin" },
  { text: "Wizja bez egzekucji to halucynacja.", author: "Thomas Edison" },
  { text: "Wielkie rzeczy nie powstają z impulsu, ale z serii małych rzeczy połączonych razem.", author: "Vincent van Gogh" },
];

export default function LandingHero({ onStart }: LandingHeroProps) {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Stagger the animations - faster for better UX
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowButton(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <ParticlesBackground />
      <FloatingElements />

      {/* Main content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10 max-w-4xl mx-auto"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-night-800/50 backdrop-blur-sm rounded-2xl border border-slate-300 dark:border-night-700/50 shadow-xl dark:shadow-none">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-slate-900 dark:text-slate-300 font-semibold">MasterZone</span>
              </div>
            </motion.div>

            {/* Main title with typing effect */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="text-slate-900 dark:text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Plan </span>
              <span className="text-gradient">
                <TypingText
                  text="Kwartału"
                  speed={80}
                  delay={800}
                  cursor={true}
                />
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
            >
              Zaplanuj następne <span className="text-ember-500 dark:text-ember-400 font-semibold">90 dni</span> strategicznie.
              <br className="hidden md:block" />
              Wizja → Cele → Projekty → Egzekucja.
            </motion.p>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-12 p-6 bg-white dark:bg-night-800/30 backdrop-blur-sm rounded-2xl border border-slate-300 dark:border-night-700/30 max-w-xl mx-auto shadow-xl dark:shadow-none"
            >
              <p className="text-slate-800 dark:text-slate-300 italic text-lg mb-2">"{quote.text}"</p>
              <p className="text-ember-600 dark:text-ember-400 text-sm font-semibold">— {quote.author}</p>
            </motion.div>

            {/* CTA Button */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <button
                    onClick={onStart}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="group relative px-10 py-5 bg-gradient-to-r from-ember-500 to-ember-600 text-night-900 text-xl font-bold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-ember-500/30 hover:scale-105 active:scale-95"
                  >
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-ember-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
                      animate={isHovering ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />

                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-ember-400"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />

                    <span className="relative flex items-center gap-3">
                      Zacznij planować
                      <motion.svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ x: isHovering ? 5 : 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
}
