'use client';

import { examplePlan } from '@/types/plan';

interface YearContextStepProps {
  yearContext: string;
  year: number;
  onChange: (yearContext: string) => void;
}

export default function YearContextStep({ yearContext, year, onChange }: YearContextStepProps) {
  const maxLength = 300;
  const remaining = maxLength - yearContext.length;

  return (
    <div className="animate-fade-up max-w-2xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-500/10 text-ember-600 dark:text-ember-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-ember-500" />
          Sekcja 7 z 7
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3">
          Kontekst Roczny
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Jak ten kwartał wpływa na <span className="text-ember-600 dark:text-ember-400 font-medium">Twój cel roczny {year}</span>?
        </p>
      </div>

      {/* Year context visual */}
      <div className="mb-8 p-6 bg-white/80 dark:bg-night-800/30 rounded-2xl border border-slate-200 dark:border-night-700/50 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">Rok {year}</span>
          <span className="text-sm text-ember-600 dark:text-ember-400">Twój kwartał</span>
        </div>
        <div className="flex gap-2">
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
            <div
              key={q}
              className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-night-700 overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-ember-500 to-indigo-500 transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-500">
          <span>Q1</span>
          <span>Q2</span>
          <span>Q3</span>
          <span>Q4</span>
        </div>
      </div>

      {/* Context input */}
      <div className="relative">
        <textarea
          value={yearContext}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={examplePlan.yearContext}
          className="w-full h-36 p-6 bg-slate-50 dark:bg-night-800/50 border border-slate-300 dark:border-night-700 rounded-2xl text-slate-900 dark:text-white text-lg placeholder-slate-400 dark:placeholder-slate-500/50 resize-none transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
        />

        {/* Character count */}
        <div className="absolute bottom-4 right-4 text-sm">
          <span className={remaining < 50 ? 'text-ember-500 dark:text-ember-400' : 'text-slate-500'}>
            {remaining}
          </span>
          <span className="text-slate-500 dark:text-slate-600"> znaków</span>
        </div>
      </div>

      {/* Completion celebration */}
      <div className="mt-8 p-6 bg-gradient-to-br from-ember-500/10 to-indigo-500/10 rounded-2xl border border-ember-500/20 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Prawie gotowe!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Po kliknięciu "Dalej" zobaczysz podsumowanie swojego planu.
              Będziesz mógł go pobrać jako PDF lub skopiować.
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-slate-100/80 dark:bg-night-800/30 rounded-xl border border-slate-200 dark:border-night-700/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Perspektywa długoterminowa</h4>
            <p className="text-sm text-slate-500">
              Każdy kwartał to klocek w większej układance. Gdzie ten klocek pasuje?
              Czy przybliża Cię do celu rocznego, czy to tylko "pilne" bez "ważne"?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
