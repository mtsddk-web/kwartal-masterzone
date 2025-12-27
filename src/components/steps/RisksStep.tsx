'use client';

import { Risk, IfThenRule, examplePlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface RisksStepProps {
  risks: Risk[];
  ifThenRules: IfThenRule[];
  stopDoing: string[];
  capacity: number;
  onChange: (field: 'risks' | 'ifThenRules' | 'stopDoing' | 'capacity', value: Risk[] | IfThenRule[] | string[] | number) => void;
}

export default function RisksStep({
  risks,
  ifThenRules,
  stopDoing,
  capacity,
  onChange,
}: RisksStepProps) {
  const updateRisk = (index: number, field: keyof Risk, value: string) => {
    const newRisks = [...risks];
    newRisks[index] = { ...newRisks[index], [field]: value };
    onChange('risks', newRisks);
  };

  const updateIfThen = (index: number, field: keyof IfThenRule, value: string) => {
    const newRules = [...ifThenRules];
    newRules[index] = { ...newRules[index], [field]: value };
    onChange('ifThenRules', newRules);
  };

  const updateStopDoing = (index: number, value: string) => {
    const newStop = [...stopDoing];
    newStop[index] = value;
    onChange('stopDoing', newStop);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
          Pre-mortem i Zabezpieczenia
        </h2>
        <p className="text-slate-400">
          Przewidź co może pójść nie tak i przygotuj się z wyprzedzeniem
        </p>
      </div>

      {/* Capacity */}
      <div className="bg-night-800/60 rounded-2xl p-6 border border-night-600/50">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Capacity - ile czasu tygodniowo?
          <HelpTooltip {...helpContent.capacity} />
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          Ile REALNYCH godzin tygodniowo możesz poświęcić na ten cel?
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={capacity}
            onChange={(e) => onChange('capacity', parseInt(e.target.value))}
            className="flex-1 h-2 bg-night-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="w-24 text-center">
            <span className="text-2xl font-bold text-cyan-400">{capacity}</span>
            <span className="text-slate-300 text-sm ml-1">h/tyg</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>5h (hobby)</span>
          <span>20h (part-time)</span>
          <span>40h (full-time)</span>
          <span>60h (sprint)</span>
        </div>
      </div>

      {/* Pre-mortem - 3 ryzyka */}
      <div className="bg-night-800/60 rounded-2xl p-6 border border-night-600/50">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Pre-mortem: 3 Ryzyka + Działania Ochronne
          <HelpTooltip {...helpContent.risks} />
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          Wyobraź sobie koniec kwartału - cel NIE osiągnięty. Co poszło nie tak?
        </p>

        <div className="space-y-4">
          {risks.map((risk, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-night-900/50 rounded-xl border border-night-700/50">
              <div>
                <label className="block text-xs font-semibold text-red-400 mb-1 uppercase tracking-wider">
                  Ryzyko #{index + 1}
                </label>
                <textarea
                  value={risk.risk}
                  onChange={(e) => updateRisk(index, 'risk', e.target.value)}
                  placeholder={examplePlan.risks[index]?.risk || 'Co może pójść nie tak?'}
                  className="w-full px-3 py-2 bg-night-900/80 border border-red-500/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">
                  Działanie ochronne
                </label>
                <textarea
                  value={risk.mitigation}
                  onChange={(e) => updateRisk(index, 'mitigation', e.target.value)}
                  placeholder={examplePlan.risks[index]?.mitigation || 'Jak temu zapobiegniesz?'}
                  className="w-full px-3 py-2 bg-night-900/80 border border-emerald-500/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-sm"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* If-Then Rules */}
      <div className="bg-night-800/60 rounded-2xl p-6 border border-night-600/50">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          Reguły If-Then
          <HelpTooltip {...helpContent.ifThenRules} />
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          Automatyczne reakcje na trudne sytuacje. Skrypty zachowań.
        </p>

        <div className="space-y-3">
          {ifThenRules.map((rule, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-semibold">
                  Jeśli
                </span>
                <input
                  type="text"
                  value={rule.condition}
                  onChange={(e) => updateIfThen(index, 'condition', e.target.value)}
                  placeholder={examplePlan.ifThenRules[index]?.condition || 'warunek/sytuacja...'}
                  className="w-full pl-12 pr-4 py-3 bg-night-900/80 border border-indigo-500/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-semibold">
                  To
                </span>
                <input
                  type="text"
                  value={rule.action}
                  onChange={(e) => updateIfThen(index, 'action', e.target.value)}
                  placeholder={examplePlan.ifThenRules[index]?.action || 'akcja/reakcja...'}
                  className="w-full pl-10 pr-4 py-3 bg-night-900/80 border border-amber-500/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stop Doing */}
      <div className="bg-night-800/60 rounded-2xl p-6 border border-red-500/30">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Stop-Doing - co odkładasz
          <HelpTooltip {...helpContent.stopDoing} />
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          3 rzeczy, które ŚWIADOMIE odkładasz na później, żeby skupić się na celu
        </p>

        <div className="space-y-2">
          {stopDoing.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => updateStopDoing(index, e.target.value)}
              placeholder={examplePlan.stopDoing[index] || `Odkładam #${index + 1}...`}
              className="w-full px-4 py-3 bg-night-900/80 border border-red-500/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
