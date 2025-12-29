'use client';

interface Phase {
  name: string;
  icon: string;
  steps: number[];
  description: string;
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  phases: Phase[];
  onPhaseClick?: (stepIndex: number) => void;
}

export default function ProgressBar({ currentStep, totalSteps, phases, onPhaseClick }: ProgressBarProps) {
  // Oblicz aktualną fazę
  const currentPhaseIndex = phases.findIndex(phase => phase.steps.includes(currentStep));
  const currentPhase = phases[currentPhaseIndex];

  // Oblicz progress w ramach całości (0-100%)
  const overallProgress = ((currentStep + 1) / totalSteps) * 100;

  // Oblicz progress w ramach aktualnej fazy
  const stepsInPhase = currentPhase?.steps || [];
  const stepIndexInPhase = stepsInPhase.indexOf(currentStep);
  const phaseProgress = ((stepIndexInPhase + 1) / stepsInPhase.length) * 100;

  return (
    <div className="w-full mb-8">
      {/* 4 fazy - desktop */}
      <div className="hidden md:block">
        {/* Fazy jako segmenty */}
        <div className="flex items-center justify-between mb-6">
          {phases.map((phase, index) => {
            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const isPending = index > currentPhaseIndex;

            const canNavigate = onPhaseClick && (isCompleted || isCurrent);

            return (
              <div key={phase.name} className="flex-1 flex items-center">
                {/* Faza */}
                <button
                  type="button"
                  onClick={() => canNavigate && onPhaseClick(phase.steps[0])}
                  disabled={!canNavigate}
                  className={`flex items-center gap-3 transition-all duration-350 ${
                    isCompleted ? 'opacity-60' : isCurrent ? 'opacity-100' : 'opacity-40'
                  } ${canNavigate ? 'cursor-pointer hover:opacity-100' : 'cursor-default'}`}
                >
                  {/* Ikona fazy */}
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-xl
                    transition-all duration-350
                    ${isCompleted
                      ? 'bg-emerald-500/20 dark:bg-emerald-500/30'
                      : isCurrent
                        ? 'bg-ember-500/20 dark:bg-ember-500/30 ring-2 ring-ember-500/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-night-900'
                        : 'bg-slate-200 dark:bg-night-800'
                    }
                    ${canNavigate ? 'hover:scale-110' : ''}
                  `}>
                    {isCompleted ? (
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={isCurrent ? '' : 'grayscale'}>{phase.icon}</span>
                    )}
                  </div>

                  {/* Nazwa i opis */}
                  <div className="hidden lg:block text-left">
                    <div className={`font-semibold text-sm transition-colors duration-350 ${
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {phase.name}
                    </div>
                    <div className={`text-xs transition-colors duration-350 ${
                      isCurrent
                        ? 'text-slate-500 dark:text-slate-400'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}>
                      {phase.description}
                    </div>
                  </div>
                </button>

                {/* Linia łącząca (nie po ostatniej fazie) */}
                {index < phases.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 bg-slate-200 dark:bg-night-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                      style={{
                        width: isCompleted ? '100%' : isCurrent ? `${phaseProgress}%` : '0%'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar pod fazami */}
        <div className="relative h-1.5 bg-slate-200 dark:bg-night-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-ember-500 via-ember-400 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Mobile - uproszczony widok */}
      <div className="md:hidden">
        {/* Aktualna faza */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-ember-500/20 dark:bg-ember-500/30 flex items-center justify-center text-lg">
            {currentPhase?.icon}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {currentPhase?.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentPhase?.description}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-slate-200 dark:bg-night-800 rounded-full overflow-hidden mb-3">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-ember-500 to-ember-400 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Mini fazy jako kropki */}
        <div className="flex justify-center gap-2">
          {phases.map((phase, index) => {
            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const canNavigate = onPhaseClick && (isCompleted || isCurrent);

            return (
              <button
                key={phase.name}
                type="button"
                onClick={() => canNavigate && onPhaseClick(phase.steps[0])}
                disabled={!canNavigate}
                className={`w-3 h-3 rounded-full transition-all duration-350 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                      ? 'bg-ember-500 ring-2 ring-ember-500/30'
                      : 'bg-slate-300 dark:bg-night-700'
                } ${canNavigate ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
