'use client';

import { examplePlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface VisionStepProps {
  vision: string;
  costOfInaction: string;
  braveAction: string;
  northStar: string;
  oneWord: string;
  onChange: (field: 'vision' | 'costOfInaction' | 'braveAction' | 'northStar' | 'oneWord', value: string) => void;
}

export default function VisionStep({
  vision,
  costOfInaction,
  braveAction,
  northStar,
  oneWord,
  onChange,
}: VisionStepProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Wizja i Motywacja Kwartału
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Opisz jasno dokąd zmierzasz i co Cię napędza
        </p>
      </div>

      {/* Vision - jak będzie wyglądało życie */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
          Jak będzie wyglądało życie, gdy to osiągniesz?
          <HelpTooltip {...helpContent.vision} />
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Opisz obrazowo - scena dnia, uczucia, efekty. Co zobaczysz, usłyszysz, poczujesz?
        </p>
        <textarea
          value={vision}
          onChange={(e) => onChange('vision', e.target.value)}
          placeholder={examplePlan.vision}
          className="w-full px-4 py-4 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 focus:border-ember-500 resize-none text-lg"
          rows={4}
        />
      </div>

      {/* Cost of inaction */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-red-300 dark:border-red-500/30 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Cena zaniechania
          <HelpTooltip {...helpContent.costOfInaction} />
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Co się stanie, jeśli NIE zrobisz tego kwartału? Jakie są realne konsekwencje?
        </p>
        <textarea
          value={costOfInaction}
          onChange={(e) => onChange('costOfInaction', e.target.value)}
          placeholder={examplePlan.costOfInaction}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-red-300 dark:border-red-500/40 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 resize-none"
          rows={2}
        />
      </div>

      {/* Brave action */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-amber-300 dark:border-amber-500/30 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Odważny ruch
          <HelpTooltip {...helpContent.braveAction} />
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Co byś zrobił, gdybyś był pewny sukcesu? Jedno odważne działanie.
        </p>
        <input
          type="text"
          value={braveAction}
          onChange={(e) => onChange('braveAction', e.target.value)}
          placeholder={examplePlan.braveAction}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-amber-300 dark:border-amber-500/40 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
        />
      </div>

      {/* North Star + One Word */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-indigo-300 dark:border-indigo-500/30 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            North Star
            <HelpTooltip {...helpContent.northStar} />
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Jedna kluczowa miara sukcesu kwartału
          </p>
          <input
            type="text"
            value={northStar}
            onChange={(e) => onChange('northStar', e.target.value)}
            placeholder={examplePlan.northStar}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-indigo-300 dark:border-indigo-500/40 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>

        <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-purple-300 dark:border-purple-500/30 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Jedno słowo
            <HelpTooltip {...helpContent.oneWord} />
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Słowo-kierunek na ten kwartał
          </p>
          <input
            type="text"
            value={oneWord}
            onChange={(e) => onChange('oneWord', e.target.value.toUpperCase())}
            placeholder="np. ROZPĘD, SKUPIENIE, WZROST..."
            maxLength={15}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-purple-300 dark:border-purple-500/40 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 uppercase font-bold text-center text-xl tracking-widest"
          />
        </div>
      </div>
    </div>
  );
}
