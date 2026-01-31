'use client';

import { Milestone, QuarterlyPlan, QuarterType, CustomQuarterMonths, getQuarterMonths, examplePlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface MilestonesStepProps {
  milestones: Milestone;
  quarter: QuarterlyPlan['quarter'];
  quarterType?: QuarterType;
  customQuarterMonths?: CustomQuarterMonths;
  onChange: (milestones: Milestone) => void;
}

export default function MilestonesStep({ milestones, quarter, quarterType = 'calendar', customQuarterMonths, onChange }: MilestonesStepProps) {
  const months = getQuarterMonths(quarter, quarterType, customQuarterMonths);

  const updateMilestone = (field: keyof Milestone, value: string) => {
    onChange({ ...milestones, [field]: value });
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-500/10 text-ember-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-ember-500" />
          Sekcja 4 z 7
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3 inline-flex items-center">
          Kamienie Milowe
          <HelpTooltip {...helpContent.milestones} />
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Co musi być zrobione <span className="text-ember-400 font-medium">w każdym miesiącu</span>?
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ember-500 via-indigo-500 to-night-700 hidden md:block" />

        {/* Milestones */}
        <div className="space-y-6">
          {(['month1', 'month2', 'month3'] as const).map((field, index) => (
            <div
              key={field}
              className="group relative flex gap-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div className="hidden md:flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center z-10 transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-br from-ember-500 to-ember-600'
                    : index === 1
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                    : 'bg-gradient-to-br from-night-600 to-night-700'
                }`}>
                  <span className="text-white font-bold text-lg">
                    {index === 0 ? 'T4' : index === 1 ? 'T8' : 'T12'}
                  </span>
                </div>
              </div>

              {/* Milestone card */}
              <div className="flex-1 p-6 bg-night-800/50 border border-night-700 rounded-2xl transition-all duration-300 hover:border-night-600">
                {/* Month header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {months[index]}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {index === 0 ? 'Tydzień 1-4' : index === 1 ? 'Tydzień 5-8' : 'Tydzień 9-12'}
                    </p>
                  </div>
                  <div className="md:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M{index + 1}</span>
                  </div>
                </div>

                {/* Milestone input */}
                <textarea
                  value={milestones[field]}
                  onChange={(e) => updateMilestone(field, e.target.value)}
                  placeholder={examplePlan.milestones[field]}
                  className="w-full h-24 px-4 py-3 bg-night-900/50 border border-night-700 rounded-xl text-white placeholder-slate-500/50 resize-none transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
                />

                {/* Progress indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-night-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-ember-500 w-1/3'
                          : index === 1
                          ? 'bg-indigo-500 w-2/3'
                          : 'bg-emerald-500 w-full'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    {index === 0 ? '33%' : index === 1 ? '66%' : '100%'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-night-800/30 rounded-xl border border-night-700/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-1">Work Backwards</h4>
            <p className="text-sm text-slate-500">
              Zacznij od końca – co musi być gotowe w miesiącu 3? Potem cofnij się.
              To metoda Jeffa Bezosa: jasny cel końcowy definiuje wszystko wcześniej.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
