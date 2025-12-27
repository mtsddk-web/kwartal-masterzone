'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="w-full mb-12">
      {/* Progress bar */}
      <div className="relative h-1 bg-night-800 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-ember-500 to-ember-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="hidden md:flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center gap-2 transition-all duration-300 ${
              index < currentStep
                ? 'text-ember-400'
                : index === currentStep
                ? 'text-white'
                : 'text-slate-500'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                index < currentStep
                  ? 'bg-ember-500 text-night-900'
                  : index === currentStep
                  ? 'bg-night-700 text-white ring-2 ring-ember-500/50'
                  : 'bg-night-800 text-slate-500'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs font-medium hidden lg:block">{step}</span>
          </div>
        ))}
      </div>

      {/* Mobile step indicator */}
      <div className="flex md:hidden justify-center items-center gap-2 text-sm">
        <span className="text-ember-400 font-medium">Krok {currentStep + 1}</span>
        <span className="text-slate-500">z {totalSteps}</span>
        <span className="text-slate-400 ml-2">{steps[currentStep]}</span>
      </div>
    </div>
  );
}
