'use client';

import { useRef, useState } from 'react';
import { QuarterlyPlan, getQuarterMonths } from '@/types/plan';

interface PlanSummaryProps {
  plan: QuarterlyPlan;
  onEdit: () => void;
}

export default function PlanSummary({ plan, onEdit }: PlanSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const months = getQuarterMonths(plan.quarter, plan.quarterType, plan.customQuarterMonths);

  const generateMarkdown = (): string => {
    const lines: string[] = [
      `# Plan ${plan.quarter} ${plan.year}`,
      '',
      `> *Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}*`,
      '',
      '---',
      '',
      '## Wizja Kwartału',
      '',
      plan.vision || '*Brak wizji*',
      '',
      '---',
      '',
      '## TOP 3 Cele',
      '',
    ];

    plan.goals.forEach((goal, index) => {
      if (goal.name) {
        lines.push(`### ${index + 1}. ${goal.name}`);
        if (goal.why) {
          lines.push(`*Dlaczego:* ${goal.why}`);
        }
        lines.push('');
      }
    });

    lines.push('---', '', '## Projekty', '');

    plan.projects.forEach((project) => {
      if (project.name) {
        lines.push(`- **${project.name}** - ${project.percentage}% czasu`);
      }
    });

    lines.push('', '---', '', '## Kamienie Milowe', '');

    if (plan.milestones.month1) {
      lines.push(`### ${months[0]} (Tydzień 1-4)`);
      lines.push(plan.milestones.month1);
      lines.push('');
    }
    if (plan.milestones.month2) {
      lines.push(`### ${months[1]} (Tydzień 5-8)`);
      lines.push(plan.milestones.month2);
      lines.push('');
    }
    if (plan.milestones.month3) {
      lines.push(`### ${months[2]} (Tydzień 9-12)`);
      lines.push(plan.milestones.month3);
      lines.push('');
    }

    lines.push('---', '', '## Metryki Sukcesu', '');

    plan.metrics.forEach((metric) => {
      if (metric.name) {
        lines.push(`| ${metric.name} | ${metric.target} |`);
      }
    });

    lines.push('', '---', '', '## Ryzyka i Zabezpieczenia', '');

    plan.risks.forEach((risk, index) => {
      if (risk.risk) {
        lines.push(`### Ryzyko ${index + 1}`);
        lines.push(`**Problem:** ${risk.risk}`);
        if (risk.mitigation) {
          lines.push(`**Mitygacja:** ${risk.mitigation}`);
        }
        lines.push('');
      }
    });

    if (plan.yearContext) {
      lines.push('---', '', '## Kontekst Roczny', '', plan.yearContext);
    }

    lines.push('', '---', '', '*Plan stworzony z MasterZone Kwartal Planner*');

    return lines.join('\n');
  };

  const copyToClipboard = async () => {
    const markdown = generateMarkdown();
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-${plan.quarter}-${plan.year}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      if (summaryRef.current) {
        const canvas = await html2canvas(summaryRef.current, {
          scale: 2,
          backgroundColor: '#080716',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`plan-${plan.quarter}-${plan.year}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">
            Twój Plan {plan.quarter} {plan.year}
          </h2>
          <p className="text-slate-400">
            Gotowe! Pobierz swój plan lub skopiuj go.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 no-print">
          <button
            onClick={onEdit}
            className="px-4 py-2.5 bg-night-800 border border-night-700 text-slate-300 rounded-xl hover:bg-night-700 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edytuj
          </button>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2.5 bg-night-800 border border-night-700 text-slate-300 rounded-xl hover:bg-night-700 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Skopiowano!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Kopiuj MD
              </>
            )}
          </button>

          <button
            onClick={downloadMarkdown}
            className="px-4 py-2.5 bg-night-800 border border-night-700 text-slate-300 rounded-xl hover:bg-night-700 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Pobierz .md
          </button>

          <button
            onClick={downloadPDF}
            disabled={isExporting}
            className="px-4 py-2.5 bg-gradient-to-r from-ember-500 to-ember-600 text-night-900 font-medium rounded-xl hover:from-ember-400 hover:to-ember-500 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generuję...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Pobierz PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plan summary card */}
      <div
        ref={summaryRef}
        className="bg-night-900 border border-night-700 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-night-800 to-night-900 border-b border-night-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{plan.quarter}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Plan {plan.quarter} {plan.year}
                </h3>
                <p className="text-sm text-slate-400">MasterZone</p>
              </div>
            </div>
            <div className="text-right text-sm text-slate-500">
              {new Date().toLocaleDateString('pl-PL')}
            </div>
          </div>

          {/* Vision */}
          {plan.vision && (
            <div className="mt-4 p-4 bg-night-800/50 rounded-xl border border-night-700/50">
              <p className="text-lg text-white italic">"{plan.vision}"</p>
            </div>
          )}
        </div>

        {/* Content grid */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Goals */}
          <section>
            <h4 className="text-sm font-medium text-ember-400 uppercase tracking-wider mb-4">
              TOP 3 Cele
            </h4>
            <div className="space-y-3">
              {plan.goals.map((goal, index) => (
                goal.name && (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ember-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-ember-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{goal.name}</p>
                      {goal.why && <p className="text-sm text-slate-400">{goal.why}</p>}
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h4 className="text-sm font-medium text-ember-400 uppercase tracking-wider mb-4">
              Projekty
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plan.projects.map((project, index) => (
                project.name && (
                  <div key={index} className="p-4 bg-night-800/50 rounded-xl border border-night-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{project.name}</span>
                      <span className="text-ember-400 font-bold">{project.percentage}%</span>
                    </div>
                    <div className="h-2 bg-night-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-ember-500"
                        style={{ width: `${project.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section>
            <h4 className="text-sm font-medium text-ember-400 uppercase tracking-wider mb-4">
              Kamienie Milowe
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['month1', 'month2', 'month3'] as const).map((field, index) => (
                plan.milestones[field] && (
                  <div key={field} className="p-4 bg-night-800/50 rounded-xl border border-night-700/50">
                    <div className="text-sm text-slate-400 mb-2">{months[index]}</div>
                    <p className="text-white">{plan.milestones[field]}</p>
                  </div>
                )
              ))}
            </div>
          </section>

          {/* Metrics */}
          {plan.metrics.some(m => m.name) && (
            <section>
              <h4 className="text-sm font-medium text-ember-400 uppercase tracking-wider mb-4">
                Metryki Sukcesu
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.metrics.map((metric, index) => (
                  metric.name && (
                    <div key={index} className="p-4 bg-night-800/50 rounded-xl border border-night-700/50 flex items-center justify-between">
                      <span className="text-slate-300">{metric.name}</span>
                      <span className="text-ember-400 font-bold">{metric.target}</span>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Risks */}
          {plan.risks.some(r => r.risk) && (
            <section>
              <h4 className="text-sm font-medium text-ember-400 uppercase tracking-wider mb-4">
                Ryzyka i Zabezpieczenia
              </h4>
              <div className="space-y-3">
                {plan.risks.map((risk, index) => (
                  risk.risk && (
                    <div key={index} className="p-4 bg-night-800/50 rounded-xl border border-night-700/50">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{risk.risk}</p>
                          {risk.mitigation && (
                            <p className="text-sm text-emerald-400 mt-1">
                              → {risk.mitigation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Year context */}
          {plan.yearContext && (
            <section>
              <h4 className="text-sm font-medium text-ember-400 uppercase tracking-wider mb-4">
                Kontekst Roczny
              </h4>
              <p className="text-slate-300">{plan.yearContext}</p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-night-800/30 border-t border-night-700/50 text-center">
          <p className="text-sm text-slate-500">
            Stworzono z{' '}
            <span className="text-ember-400 font-medium">MasterZone</span>
            {' '}• kwartal.masterzone.edu.pl
          </p>
        </div>
      </div>
    </div>
  );
}
