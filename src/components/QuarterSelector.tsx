'use client';

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
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3">
          Który kwartał planujesz?
        </h2>
        <p className="text-slate-400 text-lg">
          Wybierz okres, na który tworzysz plan strategiczny
        </p>
      </div>

      {/* Year selector */}
      <div className="flex justify-center gap-2 mb-8">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => onYearChange(y)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              year === y
                ? 'bg-ember-500 text-night-900 shadow-lg shadow-ember-500/25'
                : 'bg-night-800 text-slate-300 hover:bg-night-700 hover:text-white'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Quarter selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {quarters.map((q, index) => (
          <button
            key={q}
            onClick={() => onQuarterChange(q)}
            className={`group relative p-6 rounded-2xl transition-all duration-300 card-hover ${
              quarter === q
                ? 'bg-gradient-to-br from-night-700 to-night-800 ring-2 ring-ember-500'
                : 'bg-night-800/50 hover:bg-night-800'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Quarter badge */}
            <div
              className={`text-4xl font-display font-bold mb-2 transition-colors ${
                quarter === q ? 'text-gradient' : 'text-slate-400 group-hover:text-white'
              }`}
            >
              {q}
            </div>

            {/* Month range */}
            <div className={`text-sm ${quarter === q ? 'text-ember-300' : 'text-slate-500'}`}>
              {quarterLabels[q]}
            </div>

            {/* Selected indicator */}
            {quarter === q && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-ember-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-night-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <p className="text-slate-400">
          Tworzysz plan na{' '}
          <span className="text-ember-400 font-semibold">{quarter} {year}</span>
        </p>
      </div>
    </div>
  );
}
