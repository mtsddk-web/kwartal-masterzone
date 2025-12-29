'use client';

import { motion } from 'framer-motion';
import { QuarterlyPlan } from '@/types/plan';

interface QuarterSelectorProps {
  quarter: QuarterlyPlan['quarter'];
  year: number;
  onQuarterChange: (quarter: QuarterlyPlan['quarter']) => void;
  onYearChange: (year: number) => void;
}

const quarters: QuarterlyPlan['quarter'][] = ['Q1', 'Q2', 'Q3', 'Q4'];
const quarterLabels = {
  Q1: 'Styczeń - Marzec',
  Q2: 'Kwiecień - Czerwiec',
  Q3: 'Lipiec - Wrzesień',
  Q4: 'Październik - Grudzień',
};

// Pomocnicza funkcja: który kwartał jest aktualny
function getCurrentQuarter(): number {
  const month = new Date().getMonth(); // 0-11
  return Math.floor(month / 3) + 1; // 1-4
}

// Sprawdź czy kwartał można jeszcze zaplanować
function isQuarterPlannable(q: QuarterlyPlan['quarter'], selectedYear: number): boolean {
  const currentYear = new Date().getFullYear();
  const currentQuarter = getCurrentQuarter();
  const quarterNum = parseInt(q.charAt(1)); // Q1 -> 1

  // Przyszłe lata - wszystkie kwartały dostępne
  if (selectedYear > currentYear) return true;

  // Aktualny rok - tylko bieżący i przyszłe kwartały
  if (selectedYear === currentYear) {
    return quarterNum >= currentQuarter;
  }

  // Przeszłe lata - nic nie dostępne (ale nie powinniśmy tu trafić)
  return false;
}

export default function QuarterSelector({
  quarter,
  year,
  onQuarterChange,
  onYearChange,
}: QuarterSelectorProps) {
  const currentYear = new Date().getFullYear();
  const currentQuarter = getCurrentQuarter();

  // Steve Jobs: "Simplicity is the ultimate sophistication"
  // Tylko planowalne lata: obecny + 2 przyszłe
  const years = [currentYear, currentYear + 1, currentYear + 2];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3">
          Który kwartał planujesz?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Wybierz okres, na który tworzysz plan strategiczny
        </p>
      </div>

      {/* Year selector - iOS Segmented Control style */}
      <div className="flex justify-center mb-10">
        <div className="relative inline-flex p-1 bg-slate-200/80 dark:bg-night-800/80 rounded-2xl backdrop-blur-sm border border-slate-300/50 dark:border-night-700/30 shadow-sm dark:shadow-none">
          {/* Animated background slider */}
          <motion.div
            layoutId="yearSelector"
            className="absolute top-1 bottom-1 bg-gradient-to-br from-ember-400 to-ember-500 rounded-xl shadow-lg shadow-ember-500/30"
            style={{
              width: `calc(${100 / years.length}% - 4px)`,
              left: `calc(${years.indexOf(year) * (100 / years.length)}% + 2px)`,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
          />

          {years.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className="relative z-10 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] py-3 px-6 transition-colors duration-200"
            >
              <span
                className={`text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-200 ${
                  year === y
                    ? 'text-night-900'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {y}
              </span>
              {y === currentYear && (
                <span
                  className={`text-[10px] uppercase tracking-widest font-medium mt-0.5 transition-colors duration-200 ${
                    year === y ? 'text-night-900/70' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  teraz
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quarter selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {quarters.map((q, index) => {
          const isPlannable = isQuarterPlannable(q, year);
          const isSelected = quarter === q;
          const isCurrent = year === currentYear && parseInt(q.charAt(1)) === currentQuarter;

          return (
            <button
              key={q}
              onClick={() => isPlannable && onQuarterChange(q)}
              disabled={!isPlannable}
              className={`group relative p-6 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none ${
                !isPlannable
                  ? 'bg-slate-100/50 dark:bg-night-900/30 cursor-not-allowed opacity-50'
                  : isSelected
                  ? 'bg-gradient-to-br from-slate-100 dark:from-night-700 to-white dark:to-night-800 ring-2 ring-ember-500 card-hover'
                  : 'bg-white/80 dark:bg-night-800/50 hover:bg-slate-50 dark:hover:bg-night-800 border border-slate-200 dark:border-transparent card-hover'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quarter badge */}
              <div
                className={`text-4xl font-display font-bold mb-2 transition-colors ${
                  !isPlannable
                    ? 'text-slate-300 dark:text-slate-600'
                    : isSelected
                    ? 'text-gradient'
                    : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              >
                {q}
              </div>

              {/* Month range */}
              <div className={`text-sm ${
                !isPlannable
                  ? 'text-slate-300 dark:text-slate-600'
                  : isSelected
                  ? 'text-ember-500 dark:text-ember-300'
                  : 'text-slate-500'
              }`}>
                {quarterLabels[q]}
              </div>

              {/* Current quarter indicator */}
              {isCurrent && isPlannable && (
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    teraz
                  </span>
                </div>
              )}

              {/* Past quarter indicator */}
              {!isPlannable && (
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-600">
                    miniony
                  </span>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-ember-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white dark:text-night-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      <div className="text-center mt-8">
        <p className="text-slate-600 dark:text-slate-400">
          Tworzysz plan na{' '}
          <span className="text-ember-600 dark:text-ember-400 font-semibold">{quarter} {year}</span>
        </p>
      </div>
    </div>
  );
}
