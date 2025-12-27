'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuarterlyPlan, emptyPlan, getPreviousQuarter } from '@/types/plan';
import ProgressBar from './ProgressBar';
import QuarterSelector from './QuarterSelector';
import PlanSummary from './PlanSummary';
import LandingHero from './LandingHero';
import {
  useConfetti,
  useTimer,
  useToast,
} from './effects';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useNavigationShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useKonamiCode, EasterEggOverlay } from '@/hooks/useKonamiCode';
import { usePlanAutoSave, AutoSaveIndicator } from '@/hooks/useAutoSave';
import {
  RetrospectiveStep,
  AnnualPlanStep,
  VisionStep,
  GoalsStep,
  ProjectsStep,
  MilestonesStep,
  MetricsStep,
  RisksStep,
  YearContextStep,
} from './steps';

const STEPS = [
  'Kwartał',
  'Retrospektywa',
  'Plan Roczny',
  'Wizja',
  'Cele',
  'Projekty',
  'Kamienie',
  'Metryki',
  'Ryzyka',
  'Kontekst',
];

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 50, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.98 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export default function PlanningWizard() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [plan, setPlan] = useState<QuarterlyPlan>(emptyPlan);
  const [showSummary, setShowSummary] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [soundEnabled, setSoundEnabled] = useState(false);

  const { fireConfetti, fireSparkle } = useConfetti();
  const { seconds, isRunning, start: startTimer, formatTime } = useTimer();
  const { playClick, playSuccess, playWhoosh, playCelebration } = useSoundEffects();
  const { addToast } = useToast();

  // Konami code easter egg
  const { isActivated: easterEggActive } = useKonamiCode(() => {
    addToast({
      type: 'success',
      message: 'MASTER MODE aktywowany! Odkryto sekretny kod!',
      duration: 5000,
    });
  });

  // Auto-save functionality
  const {
    isSaving,
    showRestorePrompt,
    formatLastSaved,
    handleRestore,
    handleDismissRestore,
  } = usePlanAutoSave(plan, setPlan);

  // Start timer when planning begins
  useEffect(() => {
    if (!showLanding && !showSummary && !isRunning) {
      startTimer();
    }
  }, [showLanding, showSummary, isRunning, startTimer]);

  const updatePlan = useCallback(<K extends keyof QuarterlyPlan>(
    key: K,
    value: QuarterlyPlan[K]
  ) => {
    setPlan((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleStart = () => {
    setShowLanding(false);
    if (soundEnabled) playWhoosh();
  };

  const nextStep = () => {
    setDirection(1);
    if (soundEnabled) playClick();

    if (currentStep < STEPS.length - 1) {
      // Mini sparkle celebration
      fireSparkle();
      if (soundEnabled) playSuccess();
      setCurrentStep((prev) => prev + 1);
    } else {
      // Big celebration on completion!
      setShowSummary(true);
      fireConfetti();
      if (soundEnabled) playCelebration();
    }
  };

  const prevStep = () => {
    setDirection(-1);
    if (soundEnabled) playClick();

    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setShowSummary(false);
    setCurrentStep(step);
    if (soundEnabled) playClick();
  };

  // Keyboard shortcuts
  useNavigationShortcuts({
    onNext: nextStep,
    onPrev: prevStep,
    totalSteps: STEPS.length,
    currentStep,
  });

  const renderStep = () => {
    const prevQ = getPreviousQuarter(plan.quarter, plan.year);
    const previousQuarterLabel = `${prevQ.quarter} ${prevQ.year}`;

    switch (currentStep) {
      case 0:
        return (
          <QuarterSelector
            quarter={plan.quarter}
            year={plan.year}
            onQuarterChange={(q) => updatePlan('quarter', q)}
            onYearChange={(y) => updatePlan('year', y)}
          />
        );
      case 1:
        return (
          <RetrospectiveStep
            retrospective={plan.retrospective}
            previousQuarter={previousQuarterLabel}
            onChange={(r) => updatePlan('retrospective', r)}
          />
        );
      case 2:
        return (
          <AnnualPlanStep
            annualPlan={plan.annualPlan}
            year={plan.year}
            onChange={(a) => updatePlan('annualPlan', a)}
          />
        );
      case 3:
        return (
          <VisionStep
            vision={plan.vision}
            costOfInaction={plan.costOfInaction}
            braveAction={plan.braveAction}
            northStar={plan.northStar}
            oneWord={plan.oneWord}
            onChange={(field, value) => updatePlan(field, value)}
          />
        );
      case 4:
        return (
          <GoalsStep
            goals={plan.goals}
            onChange={(g) => updatePlan('goals', g)}
          />
        );
      case 5:
        return (
          <ProjectsStep
            projects={plan.projects}
            onChange={(p) => updatePlan('projects', p)}
          />
        );
      case 6:
        return (
          <MilestonesStep
            milestones={plan.milestones}
            quarter={plan.quarter}
            onChange={(m) => updatePlan('milestones', m)}
          />
        );
      case 7:
        return (
          <MetricsStep
            metrics={plan.metrics}
            onChange={(m) => updatePlan('metrics', m)}
          />
        );
      case 8:
        return (
          <RisksStep
            risks={plan.risks}
            ifThenRules={plan.ifThenRules}
            stopDoing={plan.stopDoing}
            capacity={plan.capacity}
            onChange={(field, value) => updatePlan(field, value as typeof plan[typeof field])}
          />
        );
      case 9:
        return (
          <YearContextStep
            yearContext={plan.yearContext}
            year={plan.year}
            onChange={(y) => updatePlan('yearContext', y)}
          />
        );
      default:
        return null;
    }
  };

  // Landing page
  if (showLanding) {
    return (
      <>
        <LandingHero onStart={handleStart} />
        <EasterEggOverlay isActive={easterEggActive} />
      </>
    );
  }

  // Summary page with celebration
  if (showSummary) {
    return (
      <div className="min-h-screen py-8 px-4 relative bg-night-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          {/* Timer result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-ember-500/20 to-indigo-500/20 rounded-2xl border border-ember-500/30">
              <svg className="w-6 h-6 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-white font-medium">
                Plan ukończony w <span className="text-ember-400 font-bold">{formatTime(seconds)}</span>
              </span>
            </div>
          </motion.div>

          <PlanSummary
            plan={{ ...plan, createdAt: new Date().toISOString() }}
            onEdit={() => goToStep(0)}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Easter egg overlay */}
      <EasterEggOverlay isActive={easterEggActive} />

      {/* Restore prompt modal */}
      <AnimatePresence>
        {showRestorePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-night-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-night-900 border border-night-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-white mb-2">
                    Znaleziono zapisany plan
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Masz niezapisany plan z poprzedniej sesji. Czy chcesz go przywrócić?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRestore}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-ember-500 to-ember-600 text-night-900 font-medium rounded-xl hover:from-ember-400 hover:to-ember-500 transition-all"
                    >
                      Przywróć
                    </button>
                    <button
                      onClick={handleDismissRestore}
                      className="flex-1 px-4 py-2.5 bg-night-800 text-slate-300 font-medium rounded-xl border border-night-700 hover:bg-night-700 transition-all"
                    >
                      Zacznij od nowa
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background - simplified for performance */}

      {/* Header */}
      <header className="py-6 px-4 border-b border-night-800/50 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </motion.div>
            <div>
              <h1 className="font-display text-xl font-semibold text-white">
                Plan Kwartału
              </h1>
              <p className="text-sm text-slate-500">MasterZone</p>
            </div>
          </div>

          {/* Right side: Auto-save + Timer + Sound toggle + Quarter */}
          <div className="flex items-center gap-4">
            {/* Auto-save indicator */}
            <AutoSaveIndicator
              isSaving={isSaving}
              lastSaved={formatLastSaved()}
              className="hidden md:flex"
            />

            {/* Timer */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-ember-400 font-mono">{formatTime(seconds)}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-night-800/50 text-slate-400 hover:text-white transition-colors"
              title={soundEnabled ? 'Wyłącz dźwięki' : 'Włącz dźwięki'}
            >
              {soundEnabled ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>

            {/* Quarter badge */}
            {plan.quarter && plan.year && (
              <span className="px-3 py-1.5 bg-night-800/80 backdrop-blur rounded-lg text-sm text-slate-300 border border-night-700/50">
                {plan.quarter} {plan.year}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="py-6 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
        </div>
      </div>

      {/* Main content with page transitions */}
      <main className="flex-1 py-4 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              custom={direction}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation buttons */}
      <footer className="py-6 px-4 border-t border-night-800/50 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-night-800 border border-night-700 text-slate-300 rounded-xl hover:bg-night-700 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Wstecz
          </motion.button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-ember-400 font-medium">{currentStep + 1}</span>
            <span>/</span>
            <span>{STEPS.length}</span>
          </div>

          <motion.button
            onClick={nextStep}
            className="group relative px-6 py-3 bg-gradient-to-r from-ember-500 to-ember-600 text-night-900 font-medium rounded-xl transition-all duration-200 flex items-center gap-2 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-ember-400/50 blur-xl"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />

            <span className="relative">
              {currentStep === STEPS.length - 1 ? 'Zobacz podsumowanie' : 'Dalej'}
            </span>
            <motion.svg
              className="w-4 h-4 relative"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
