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

export default function QuarterSelector({
  quarter,
  year,
  onQuarterChange,
  onYearChange,
}: QuarterSelectorProps) {
  const currentYear = new Date().getFullYear();
  // Steve Jobs: "Simplicity is the ultimate sophistication" - tylko 3 lata
  const years = [currentYear - 1, currentYear, currentYear + 1];

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
        <div className="relative inline-flex p-1 bg-night-800/60 dark:bg-night-800/80 rounded-2xl backdrop-blur-sm border border-night-700/30">
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
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {y}
              </span>
              {y === currentYear && (
                <span
                  className={`text-[10px] uppercase tracking-widest font-medium mt-0.5 transition-colors duration-200 ${
                    year === y ? 'text-night-900/70' : 'text-slate-500'
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
        {quarters.map((q, index) => (
          <button
            key={q}
            onClick={() => onQuarterChange(q)}
            className={`group relative p-6 rounded-2xl transition-all duration-300 card-hover shadow-sm dark:shadow-none ${
              quarter === q
                ? 'bg-gradient-to-br from-slate-100 dark:from-night-700 to-white dark:to-night-800 ring-2 ring-ember-500'
                : 'bg-white/80 dark:bg-night-800/50 hover:bg-slate-50 dark:hover:bg-night-800 border border-slate-200 dark:border-transparent'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Quarter badge */}
            <div
              className={`text-4xl font-display font-bold mb-2 transition-colors ${
                quarter === q ? 'text-gradient' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}
            >
              {q}
            </div>

            {/* Month range */}
            <div className={`text-sm ${quarter === q ? 'text-ember-500 dark:text-ember-300' : 'text-slate-500'}`}>
              {quarterLabels[q]}
            </div>

            {/* Selected indicator */}
            {quarter === q && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-ember-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white dark:text-night-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
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
