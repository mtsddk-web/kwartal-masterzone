'use client';

import { Goal, examplePlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface GoalsStepProps {
  goals: Goal[];
  onChange: (goals: Goal[]) => void;
}

export default function GoalsStep({ goals, onChange }: GoalsStepProps) {
  const updateGoal = (index: number, field: keyof Goal, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    onChange(newGoals);
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-500/10 text-ember-600 dark:text-ember-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-ember-500" />
          Sekcja 2 z 7
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3 inline-flex items-center">
          TOP 3 Cele
          <HelpTooltip {...helpContent.goals} />
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Jakie są Twoje <span className="text-ember-600 dark:text-ember-400 font-medium">3 najważniejsze cele</span> na ten kwartał?
        </p>
      </div>

      {/* Goals list */}
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div
            key={index}
            className="group p-6 bg-white/80 dark:bg-night-800/50 border border-slate-200 dark:border-night-700 rounded-2xl transition-all duration-300 hover:border-slate-300 dark:hover:border-night-600 shadow-sm dark:shadow-none"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Goal number */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center text-white font-bold text-lg">
                {index + 1}
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {index === 0 && 'Najważniejszy cel'}
                {index === 1 && 'Drugi priorytet'}
                {index === 2 && 'Trzeci priorytet'}
              </span>
            </div>

            {/* Goal name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Cel
              </label>
              <input
                type="text"
                value={goal.name}
                onChange={(e) => updateGoal(index, 'name', e.target.value)}
                placeholder={examplePlan.goals[index]?.name}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/50 border border-slate-300 dark:border-night-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/50 transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
              />
            </div>

            {/* Why important */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Dlaczego to ważne?
              </label>
              <input
                type="text"
                value={goal.why}
                onChange={(e) => updateGoal(index, 'why', e.target.value)}
                placeholder={examplePlan.goals[index]?.why}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/50 border border-slate-300 dark:border-night-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/50 transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-slate-100/80 dark:bg-night-800/30 rounded-xl border border-slate-200 dark:border-night-700/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zasada 80/20</h4>
            <p className="text-sm text-slate-500">
              Które 20% działań da 80% rezultatów? Skup się na celach, które naprawdę
              przesuwają igłę. Reszta może poczekać.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
