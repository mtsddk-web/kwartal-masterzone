'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ONBOARDING_KEY = 'kwartal-onboarding-seen';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Witaj w Planie Kwartału!',
    description: 'Za chwilę przeprowadzę Cię przez proces planowania następnych 90 dni. Poświęć temu tyle czasu, ile potrzebujesz.',
    icon: '👋',
  },
  {
    title: '4 Fazy planowania',
    description: 'Przeszłość (retrospektywa) → Kierunek (wizja i cele) → Droga (projekty i kamienie milowe) → Ochrona (ryzyka).',
    icon: '🎯',
  },
  {
    title: 'Zapisywanie automatyczne',
    description: 'Twój postęp jest zapisywany automatycznie. Możesz wrócić w dowolnym momencie i kontynuować.',
    icon: '💾',
  },
  {
    title: 'Nawigacja',
    description: 'Klikaj w fazy na pasku postępu, aby wrócić do poprzednich sekcji. Użyj strzałek ← → do nawigacji.',
    icon: '⌨️',
  },
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeen) {
      // Small delay to let the page load
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10002] bg-black/60 dark:bg-night-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-night-900 border border-slate-200 dark:border-night-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            {/* Step indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-ember-500 w-6'
                      : index < currentStep
                        ? 'bg-emerald-500'
                        : 'bg-slate-300 dark:bg-night-700'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2.5 text-slate-600 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Pomiń
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-ember-500 to-ember-600 text-white dark:text-night-900 font-medium rounded-xl hover:from-ember-400 hover:to-ember-500 transition-all flex items-center justify-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Zaczynamy!' : 'Dalej'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
