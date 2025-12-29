'use client';

import { AnnualPlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface AnnualPlanStepProps {
  annualPlan: AnnualPlan;
  year: number;
  onChange: (annualPlan: AnnualPlan) => void;
}

export default function AnnualPlanStep({
  annualPlan,
  year,
  onChange,
}: AnnualPlanStepProps) {
  const updateField = <K extends keyof AnnualPlan>(
    key: K,
    value: AnnualPlan[K]
  ) => {
    onChange({ ...annualPlan, [key]: value });
  };

  const updateGoal = (
    index: number,
    field: 'name' | 'description' | 'definitionOfDone',
    value: string
  ) => {
    const goals = [...annualPlan.goals];
    goals[index] = { ...goals[index], [field]: value };
    onChange({ ...annualPlan, goals });
  };

  const updateSuccessSign = (index: number, value: string) => {
    const signs = [...annualPlan.successSigns];
    signs[index] = value;
    onChange({ ...annualPlan, successSigns: signs });
  };

  const updateRule = (index: number, value: string) => {
    const rules = [...annualPlan.rules];
    rules[index] = value;
    onChange({ ...annualPlan, rules });
  };

  const updateSupportingMetric = (
    index: number,
    field: 'name' | 'target',
    value: string
  ) => {
    const metrics = [...annualPlan.supportingMetrics];
    metrics[index] = { ...metrics[index], [field]: value };
    onChange({ ...annualPlan, supportingMetrics: metrics });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Plan Roku {year}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Ustal kierunek i cele na cały rok
        </p>
      </div>

      {/* B1. Kierunek na rok */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
          Kierunek na rok
          <HelpTooltip {...helpContent.annualPlan} />
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Do końca {year} chcę... <span className="text-slate-500 dark:text-slate-400">(1 zdanie - efekt, nie lista)</span>
            </label>
            <textarea
              value={annualPlan.annualVision}
              onChange={(e) => updateField('annualVision', e.target.value)}
              placeholder="np. ...mieć 100 płacących klientów i 50k MRR"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              3 oznaki udanego roku
            </label>
            <div className="space-y-2">
              {annualPlan.successSigns.map((sign, index) => (
                <input
                  key={index}
                  type="text"
                  value={sign}
                  onChange={(e) => updateSuccessSign(index, e.target.value)}
                  placeholder={`Oznaka sukcesu #${index + 1}`}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Jedno słowo opisujące {year}
            </label>
            <input
              type="text"
              value={annualPlan.oneWord}
              onChange={(e) => updateField('oneWord', e.target.value.toUpperCase())}
              placeholder="np. WZROST, SKUPIENIE, WOLNOŚĆ..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase font-bold text-center text-xl tracking-widest"
              maxLength={15}
            />
          </div>
        </div>
      </div>

      {/* B2. 3 Cele roczne */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-ember-500/20 dark:bg-ember-500/30 flex items-center justify-center text-ember-600 dark:text-ember-400 text-sm font-bold">2</span>
          3 Cele roczne
          <HelpTooltip {...helpContent.goals} />
        </h3>

        <div className="space-y-6">
          {annualPlan.goals.map((goal, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                annualPlan.priorityGoal === index
                  ? 'border-ember-500/50 bg-ember-500/10'
                  : 'border-slate-200 dark:border-night-600 bg-slate-50 dark:bg-night-900/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => updateField('priorityGoal', index)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    annualPlan.priorityGoal === index
                      ? 'border-ember-500 bg-ember-500'
                      : 'border-slate-400 dark:border-slate-500 hover:border-ember-500/50'
                  }`}
                >
                  {annualPlan.priorityGoal === index && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {annualPlan.priorityGoal === index ? 'Priorytet #1' : `Cel #${index + 1}`}
                </span>
              </div>

              <input
                type="text"
                value={goal.name}
                onChange={(e) => updateGoal(index, 'name', e.target.value)}
                placeholder="Nazwa celu"
                className="w-full px-4 py-3 bg-white dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 mb-2 font-medium"
              />

              <textarea
                value={goal.description}
                onChange={(e) => updateGoal(index, 'description', e.target.value)}
                placeholder="Opis efektu (2-3 zdania)"
                className="w-full px-4 py-3 bg-white dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 resize-none mb-2 text-sm"
                rows={2}
              />

              <input
                type="text"
                value={goal.definitionOfDone}
                onChange={(e) => updateGoal(index, 'definitionOfDone', e.target.value)}
                placeholder="Definition of Done - po czym poznam że cel osiągnięty?"
                className="w-full px-4 py-3 bg-white dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 text-sm"
              />
            </div>
          ))}

          {annualPlan.priorityGoal !== undefined && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                Dlaczego cel #{annualPlan.priorityGoal + 1} jest najważniejszy?
              </label>
              <textarea
                value={annualPlan.priorityWhy}
                onChange={(e) => updateField('priorityWhy', e.target.value)}
                placeholder="Uzasadnienie priorytetu..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 resize-none"
                rows={2}
              />
            </div>
          )}
        </div>
      </div>

      {/* B3. Miary roku */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">3</span>
          North Star i miary
          <HelpTooltip {...helpContent.northStar} />
        </h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                Co mierzysz? <span className="text-slate-500 dark:text-slate-400">(nazwa metryki)</span>
              </label>
              <input
                type="text"
                value={annualPlan.northStar}
                onChange={(e) => updateField('northStar', e.target.value)}
                placeholder="np. Przychód, Liczba klientów, MRR"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                Docelowa wartość <span className="text-slate-500 dark:text-slate-400">(cel liczbowy)</span>
              </label>
              <input
                type="text"
                value={annualPlan.northStarTarget}
                onChange={(e) => updateField('northStarTarget', e.target.value)}
                placeholder="np. 50 000 PLN, 100 klientów"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              2 miary wspierające
            </label>
            <div className="space-y-2">
              {annualPlan.supportingMetrics.map((metric, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={metric.name}
                    onChange={(e) => updateSupportingMetric(index, 'name', e.target.value)}
                    placeholder="Co mierzysz? np. Konwersja, Churn"
                    className="px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <input
                    type="text"
                    value={metric.target}
                    onChange={(e) => updateSupportingMetric(index, 'target', e.target.value)}
                    placeholder="Cel: np. 30%, <5%, 1000"
                    className="px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* B4. Zasady gry */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-cyan-500/20 dark:bg-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold">4</span>
          Zasady gry na {year}
          <HelpTooltip {...helpContent.ifThenRules} />
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Reguły typu: &quot;Nie biorę X bez Y&quot;, &quot;Zawsze robię Z przed W&quot;
        </p>

        <div className="space-y-2">
          {annualPlan.rules.map((rule, index) => (
            <input
              key={index}
              type="text"
              value={rule}
              onChange={(e) => updateRule(index, e.target.value)}
              placeholder={`Zasada #${index + 1}: "Nie..."/"Zawsze..."/"Zanim..."`}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
