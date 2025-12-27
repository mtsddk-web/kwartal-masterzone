'use client';

import { Metric, examplePlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface MetricsStepProps {
  metrics: Metric[];
  onChange: (metrics: Metric[]) => void;
}

export default function MetricsStep({ metrics, onChange }: MetricsStepProps) {
  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    onChange(newMetrics);
  };

  const addMetric = () => {
    if (metrics.length < 5) {
      onChange([...metrics, { name: '', target: '' }]);
    }
  };

  const removeMetric = (index: number) => {
    if (metrics.length > 1) {
      onChange(metrics.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-500/10 text-ember-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-ember-500" />
          Sekcja 5 z 7
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3 inline-flex items-center">
          Metryki Sukcesu
          <HelpTooltip {...helpContent.metrics} />
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Jak zmierzysz sukces? Podaj <span className="text-ember-400 font-medium">2-3 konkretne KPI</span>
        </p>
      </div>

      {/* Metrics list */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="group relative p-6 bg-night-800/50 border border-night-700 rounded-2xl transition-all duration-300 hover:border-night-600"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Remove button */}
            {metrics.length > 1 && (
              <button
                onClick={() => removeMetric(index)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-night-900/50 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Metric name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nazwa metryki
                </label>
                <input
                  type="text"
                  value={metric.name}
                  onChange={(e) => updateMetric(index, 'name', e.target.value)}
                  placeholder={examplePlan.metrics[index]?.name || 'np. Przychód miesięczny'}
                  className="w-full px-4 py-3 bg-night-900/50 border border-night-700 rounded-xl text-white placeholder-slate-500/50 transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
                />
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cel (target)
                </label>
                <input
                  type="text"
                  value={metric.target}
                  onChange={(e) => updateMetric(index, 'target', e.target.value)}
                  placeholder={examplePlan.metrics[index]?.target || 'np. 50 000 PLN'}
                  className="w-full px-4 py-3 bg-night-900/50 border border-night-700 rounded-xl text-white placeholder-slate-500/50 transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
                />
              </div>
            </div>

            {/* Metric indicator */}
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm text-slate-500">
                KPI #{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add metric button */}
      {metrics.length < 5 && (
        <button
          onClick={addMetric}
          className="mt-4 w-full p-4 border-2 border-dashed border-night-700 rounded-2xl text-slate-400 hover:border-ember-500/50 hover:text-ember-400 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Dodaj metrykę
        </button>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-night-800/30 rounded-xl border border-night-700/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-1">SMART Metrics</h4>
            <p className="text-sm text-slate-500">
              Dobre metryki są: Specific (konkretne), Measurable (mierzalne),
              Achievable (osiągalne), Relevant (istotne), Time-bound (określone w czasie).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
