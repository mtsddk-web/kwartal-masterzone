'use client';

import { useState } from 'react';
import {
  QuarterlyPlan,
  QuarterType,
  CustomQuarterMonths,
  QUARTER_TYPE_NAMES,
  QUARTER_LABELS,
  ALL_MONTHS,
  getQuarterLabel,
} from '@/types/plan';

interface QuarterSelectorProps {
  quarter: QuarterlyPlan['quarter'];
  year: number;
  quarterType: QuarterType;
  customQuarterMonths?: CustomQuarterMonths;
  onQuarterChange: (quarter: QuarterlyPlan['quarter']) => void;
  onYearChange: (year: number) => void;
  onQuarterTypeChange: (type: QuarterType) => void;
  onCustomMonthsChange: (months: CustomQuarterMonths) => void;
}

const quarters: QuarterlyPlan['quarter'][] = ['Q1', 'Q2', 'Q3', 'Q4'];
const quarterTypes: QuarterType[] = ['calendar', 'school', 'financial', 'custom'];

const defaultCustomMonths: CustomQuarterMonths = {
  Q1: ['Sierpień', 'Wrzesień', 'Październik'],
  Q2: ['Listopad', 'Grudzień', 'Styczeń'],
  Q3: ['Luty', 'Marzec', 'Kwiecień'],
  Q4: ['Maj', 'Czerwiec', 'Lipiec'],
};

export default function QuarterSelector({
  quarter,
  year,
  quarterType,
  customQuarterMonths,
  onQuarterChange,
  onYearChange,
  onQuarterTypeChange,
  onCustomMonthsChange,
}: QuarterSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  // Use provided custom months or defaults
  const effectiveCustomMonths = customQuarterMonths || defaultCustomMonths;

  const handleQuarterTypeChange = (type: QuarterType) => {
    onQuarterTypeChange(type);
    if (type === 'custom' && !customQuarterMonths) {
      onCustomMonthsChange(defaultCustomMonths);
      setShowCustomEditor(true);
    } else if (type === 'custom') {
      setShowCustomEditor(true);
    } else {
      setShowCustomEditor(false);
    }
  };

  // Helper to get next months in sequence
  const getNextMonths = (startMonth: string, count: number): string[] => {
    const startIndex = ALL_MONTHS.indexOf(startMonth);
    if (startIndex === -1) return [];
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(ALL_MONTHS[(startIndex + i) % 12]);
    }
    return result;
  };

  const handleCustomMonthChange = (q: QuarterlyPlan['quarter'], monthIndex: number, value: string) => {
    const newMonths = { ...effectiveCustomMonths };

    // If changing first month of Q1, auto-fill entire year
    if (q === 'Q1' && monthIndex === 0) {
      const yearMonths = getNextMonths(value, 12);
      newMonths.Q1 = [yearMonths[0], yearMonths[1], yearMonths[2]] as [string, string, string];
      newMonths.Q2 = [yearMonths[3], yearMonths[4], yearMonths[5]] as [string, string, string];
      newMonths.Q3 = [yearMonths[6], yearMonths[7], yearMonths[8]] as [string, string, string];
      newMonths.Q4 = [yearMonths[9], yearMonths[10], yearMonths[11]] as [string, string, string];
    }
    // If changing first month of other quarters, auto-fill that quarter
    else if (monthIndex === 0) {
      const quarterMonths = getNextMonths(value, 3);
      newMonths[q] = quarterMonths as [string, string, string];
    }
    // Otherwise just change single month
    else {
      newMonths[q] = [...newMonths[q]] as [string, string, string];
      newMonths[q][monthIndex] = value;
    }

    onCustomMonthsChange(newMonths);
  };

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

      {/* Quarter Type Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {quarterTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleQuarterTypeChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              quarterType === type
                ? 'bg-ember-500 text-night-900 shadow-lg shadow-ember-500/25'
                : 'bg-night-800 text-slate-300 hover:bg-night-700 hover:text-white'
            }`}
          >
            {QUARTER_TYPE_NAMES[type]}
          </button>
        ))}
      </div>

      {/* Custom Quarter Editor */}
      {quarterType === 'custom' && showCustomEditor && (
        <div className="mb-8 p-4 bg-night-800/50 border border-night-700 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">Zdefiniuj własne miesiące dla każdego kwartału</h3>
            <button
              onClick={() => setShowCustomEditor(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Zwiń
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Wybierz pierwszy miesiąc Q1 - reszta wypełni się automatycznie
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quarters.map((q) => (
              <div key={q} className="p-3 bg-night-900/50 rounded-lg">
                <div className="text-sm font-medium text-ember-400 mb-2">{q}</div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((idx) => (
                    <select
                      key={idx}
                      value={effectiveCustomMonths[q][idx]}
                      onChange={(e) => handleCustomMonthChange(q, idx, e.target.value)}
                      className="px-2 py-1.5 bg-night-800 border border-night-700 rounded text-xs text-white"
                    >
                      {ALL_MONTHS.map((month) => (
                        <option key={month} value={month}>{month.substring(0, 3)}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed custom info */}
      {quarterType === 'custom' && !showCustomEditor && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowCustomEditor(true)}
            className="text-sm text-ember-400 hover:text-ember-300 underline"
          >
            Edytuj własne miesiące
          </button>
        </div>
      )}

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
        {quarters.map((q, index) => {
          const label = quarterType === 'custom'
            ? getQuarterLabel(q, quarterType, effectiveCustomMonths)
            : QUARTER_LABELS[quarterType][q];

          return (
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
                {label}
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
          );
        })}
      </div>

      {/* Selected summary */}
      <div className="text-center mt-8">
        <p className="text-slate-400">
          Tworzysz plan na{' '}
          <span className="text-ember-400 font-semibold">{quarter} {year}</span>
          {quarterType !== 'calendar' && (
            <span className="text-slate-500 text-sm ml-2">
              ({QUARTER_TYPE_NAMES[quarterType]})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
