'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QuarterlyPlan, getQuarterMonths } from '@/types/plan';

interface PlanSummaryProps {
  plan: QuarterlyPlan;
  onEdit: () => void;
}

export default function PlanSummary({ plan, onEdit }: PlanSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const months = getQuarterMonths(plan.quarter);

  const generateMarkdown = (): string => {
    const lines: string[] = [
      `# Plan ${plan.quarter} ${plan.year}`,
      '',
      `> *Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}*`,
      '',
      plan.oneWord ? `## Słowo-kompas: **${plan.oneWord}**` : '',
      '',
      plan.northStar ? `## North Star: ${plan.northStar}` : '',
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
        if (goal.actions) {
          lines.push(`*Działania:* ${goal.actions}`);
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
      lines.push(`### ${months[0]}`);
      lines.push(plan.milestones.month1);
      lines.push('');
    }
    if (plan.milestones.month2) {
      lines.push(`### ${months[1]}`);
      lines.push(plan.milestones.month2);
      lines.push('');
    }
    if (plan.milestones.month3) {
      lines.push(`### ${months[2]}`);
      lines.push(plan.milestones.month3);
      lines.push('');
    }

    // Metryki sukcesu
    if (plan.metrics.some(m => m.name)) {
      lines.push('---', '', '## Metryki Sukcesu', '');
      plan.metrics.forEach((metric) => {
        if (metric.name) {
          lines.push(`- **${metric.name}:** ${metric.target}`);
        }
      });
      lines.push('');
    }

    // Ryzyka i zabezpieczenia
    if (plan.risks.some(r => r.risk)) {
      lines.push('---', '', '## Ryzyka i Zabezpieczenia', '');
      plan.risks.forEach((risk, index) => {
        if (risk.risk) {
          lines.push(`### Ryzyko ${index + 1}`);
          lines.push(`⚠️ ${risk.risk}`);
          if (risk.mitigation) {
            lines.push(`✅ Mitygacja: ${risk.mitigation}`);
          }
          lines.push('');
        }
      });
    }

    // Reguły If-Then
    if (plan.ifThenRules?.some(r => r.condition)) {
      lines.push('---', '', '## Reguły If-Then', '');
      plan.ifThenRules.forEach((rule) => {
        if (rule.condition) {
          lines.push(`- **Jeśli** ${rule.condition} **→ To** ${rule.action}`);
        }
      });
      lines.push('');
    }

    // Stop Doing
    if (plan.stopDoing?.some(s => s)) {
      lines.push('---', '', '## Stop Doing (co odkładam)', '');
      plan.stopDoing.forEach((item) => {
        if (item) {
          lines.push(`- ~~${item}~~`);
        }
      });
      lines.push('');
    }

    // Capacity
    if (plan.capacity) {
      lines.push('---', '', '## Capacity', '', `**${plan.capacity} godzin / tydzień**`, '');
    }

    // Kontekst roczny
    if (plan.yearContext) {
      lines.push('---', '', '## Kontekst Roczny', '', plan.yearContext, '');
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

    // Automatycznie rozwiń szczegóły przed eksportem
    const wasShowingDetails = showDetails;
    if (!showDetails) {
      setShowDetails(true);
      // Poczekaj na re-render
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      if (summaryRef.current) {
        // Fix: Tymczasowo napraw elementy z bg-clip-text (html2canvas ich nie renderuje)
        const gradientTextElements = summaryRef.current.querySelectorAll('.bg-clip-text');
        const originalStyles: { el: Element; color: string; bg: string; bgClip: string }[] = [];

        gradientTextElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          originalStyles.push({
            el,
            color: htmlEl.style.color,
            bg: htmlEl.style.background,
            bgClip: htmlEl.style.webkitBackgroundClip || htmlEl.style.backgroundClip,
          });
          // Ustaw widoczny kolor zamiast gradientu
          htmlEl.style.color = '#f97316'; // ember-500
          htmlEl.style.background = 'none';
          htmlEl.style.webkitBackgroundClip = 'unset';
          htmlEl.style.backgroundClip = 'unset';
        });

        const canvas = await html2canvas(summaryRef.current, {
          scale: 1.5, // Zmniejszone z 2 - nadal dobra jakość, mniejszy plik
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        // Przywróć oryginalne style
        originalStyles.forEach(({ el, color, bg, bgClip }) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.color = color;
          htmlEl.style.background = bg;
          htmlEl.style.webkitBackgroundClip = bgClip;
          htmlEl.style.backgroundClip = bgClip;
        });

        // Użyj JPEG z kompresją zamiast PNG (drastycznie mniejszy rozmiar)
        const imgData = canvas.toDataURL('image/jpeg', 0.85);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Jeśli obraz jest dłuższy niż strona A4, dodaj wielostronicowość
        if (imgHeight > pageHeight) {
          let yOffset = 0;
          let pageNum = 0;

          while (yOffset < imgHeight) {
            if (pageNum > 0) {
              pdf.addPage();
            }

            // Oblicz ile obrazu zmieści się na stronie
            const sourceY = (yOffset / imgHeight) * canvas.height;
            const sourceHeight = Math.min(
              (pageHeight / imgHeight) * canvas.height,
              canvas.height - sourceY
            );

            pdf.addImage(
              imgData,
              'JPEG',
              0,
              -yOffset,
              imgWidth,
              imgHeight,
              undefined,
              'FAST'
            );

            yOffset += pageHeight;
            pageNum++;
          }
        } else {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        }

        pdf.save(`plan-${plan.quarter}-${plan.year}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Przywróć poprzedni stan szczegółów
      if (!wasShowingDetails) {
        setShowDetails(false);
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* DIPLOMA STYLE CERTIFICATE */}
      <div
        ref={summaryRef}
        className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 rounded-3xl overflow-hidden shadow-2xl dark:shadow-none border border-slate-200 dark:border-night-700"
      >
        {/* === HERO SECTION - Certificate Header === */}
        <div className="relative px-6 md:px-12 pt-10 pb-8 text-center overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-ember-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
          </div>

          {/* Logo */}
          <div className="relative flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/logo-masterzone.png"
                alt="MasterZone"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          {/* Certificate title */}
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-2 font-medium">
              Plan Kwartalny
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-2">
              {plan.quarter} {plan.year}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {months.join(' • ')}
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-ember-500/50" />
            <div className="w-2 h-2 rounded-full bg-ember-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-ember-500/50" />
          </div>
        </div>

        {/* === ONE WORD - Central Focus === */}
        {plan.oneWord && (
          <div className="px-6 md:px-12 py-8 text-center bg-gradient-to-r from-ember-500/5 via-ember-500/10 to-ember-500/5 dark:from-ember-500/10 dark:via-ember-500/20 dark:to-ember-500/10">
            <p className="text-xs uppercase tracking-[0.2em] text-ember-600 dark:text-ember-400 mb-3 font-semibold">
              Twoje słowo-kompas
            </p>
            <div className="inline-block px-8 py-4 bg-white dark:bg-night-800 rounded-2xl shadow-lg border-2 border-ember-500/30">
              <span className="text-4xl md:text-5xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-ember-500 to-amber-500">
                {plan.oneWord}
              </span>
            </div>
          </div>
        )}

        {/* === NORTH STAR === */}
        {plan.northStar && (
          <div className="px-6 md:px-12 py-6 text-center border-t border-slate-200/50 dark:border-night-700/50">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl border border-indigo-500/20">
              <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">North Star</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{plan.northStar}</p>
              </div>
            </div>
          </div>
        )}

        {/* === VISION === */}
        {plan.vision && (
          <div className="px-6 md:px-12 py-8 border-t border-slate-200/50 dark:border-night-700/50">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 italic leading-relaxed">
                "{plan.vision}"
              </p>
            </div>
          </div>
        )}

        {/* === TOP 3 GOALS - Card Style === */}
        <div className="px-6 md:px-12 py-8 border-t border-slate-200/50 dark:border-night-700/50">
          <h3 className="text-center text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6 font-semibold">
            Trzy cele kwartału
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.goals.map((goal, index) => (
              goal.name && (
                <div
                  key={index}
                  className="relative bg-white dark:bg-night-800 rounded-2xl p-5 shadow-md dark:shadow-none border border-slate-200 dark:border-night-700 overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Number badge */}
                  <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-ember-400 to-ember-600 rounded-bl-2xl flex items-end justify-start pb-1.5 pl-2">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>

                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 pr-6">
                    {goal.name}
                  </h4>
                  {goal.why && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {goal.why}
                    </p>
                  )}
                  {goal.actions && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg px-2 py-1">
                      <span className="font-medium">Działania:</span> {goal.actions}
                    </p>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        {/* === PROJECTS - Mini cards === */}
        {plan.projects.some(p => p.name) && (
          <div className="px-6 md:px-12 py-6 border-t border-slate-200/50 dark:border-night-700/50 bg-slate-50/50 dark:bg-night-900/50">
            <div className="flex flex-wrap justify-center gap-3">
              {plan.projects.map((project, index) => (
                project.name && (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-night-800 rounded-full border border-slate-200 dark:border-night-700 shadow-sm"
                  >
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{project.name}</span>
                    <span className="px-2 py-0.5 bg-ember-500/10 text-ember-600 dark:text-ember-400 rounded-full text-sm font-semibold">
                      {project.percentage}%
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* === EXPAND DETAILS BUTTON === */}
        <div className="px-6 md:px-12 py-4 border-t border-slate-200/50 dark:border-night-700/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">
              {showDetails ? 'Ukryj szczegóły' : 'Pokaż więcej szczegółów'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* === DETAILED SECTIONS (collapsible) === */}
        {showDetails && (
          <div className="px-6 md:px-12 py-6 space-y-6 border-t border-slate-200/50 dark:border-night-700/50 bg-slate-50/30 dark:bg-night-900/30">
            {/* Milestones */}
            {(plan.milestones.month1 || plan.milestones.month2 || plan.milestones.month3) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Kamienie milowe
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['month1', 'month2', 'month3'] as const).map((field, index) => (
                    plan.milestones[field] && (
                      <div key={field} className="p-3 bg-white dark:bg-night-800 rounded-xl border border-slate-200 dark:border-night-700">
                        <div className="text-xs text-ember-500 dark:text-ember-400 font-medium mb-1">{months[index]}</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{plan.milestones[field]}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            {plan.metrics.some(m => m.name) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Metryki sukcesu
                </h4>
                <div className="flex flex-wrap gap-2">
                  {plan.metrics.map((metric, index) => (
                    metric.name && (
                      <div key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-night-800 rounded-xl border border-slate-200 dark:border-night-700">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{metric.name}:</span>
                        <span className="text-sm font-bold text-ember-500 dark:text-ember-400">{metric.target}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {plan.risks.some(r => r.risk) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Ryzyka i zabezpieczenia
                </h4>
                <div className="space-y-2">
                  {plan.risks.map((risk, index) => (
                    risk.risk && (
                      <div key={index} className="p-3 bg-white dark:bg-night-800 rounded-xl border border-slate-200 dark:border-night-700">
                        <p className="text-sm text-red-600 dark:text-red-400">⚠️ {risk.risk}</p>
                        {risk.mitigation && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">✓ {risk.mitigation}</p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* If-Then Rules */}
            {plan.ifThenRules?.some(r => r.condition) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Reguły If-Then
                </h4>
                <div className="space-y-2">
                  {plan.ifThenRules.map((rule, index) => (
                    rule.condition && (
                      <div key={index} className="text-sm p-3 bg-white dark:bg-night-800 rounded-xl border border-slate-200 dark:border-night-700">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">Jeśli</span>{' '}
                        <span className="text-slate-700 dark:text-slate-200">{rule.condition}</span>{' '}
                        <span className="text-amber-600 dark:text-amber-400 font-medium">→</span>{' '}
                        <span className="text-slate-700 dark:text-slate-200">{rule.action}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Stop Doing */}
            {plan.stopDoing?.some(s => s) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Co odkładam
                </h4>
                <div className="flex flex-wrap gap-2">
                  {plan.stopDoing.map((item, index) => (
                    item && (
                      <span key={index} className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-600 dark:text-red-300 text-sm">
                        {item}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === FOOTER - Certificate style === */}
        <div className="px-6 md:px-12 py-8 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-night-800 dark:via-night-900 dark:to-night-800 border-t border-slate-200 dark:border-night-700">
          <div className="flex flex-col items-center gap-4">
            {/* Decorative line */}
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-slate-300 dark:bg-night-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-night-500" />
              <div className="h-px w-12 bg-slate-300 dark:bg-night-600" />
            </div>

            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Ukończono
              </p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {new Date().toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              MasterZone • kwartal.masterzone.edu.pl
            </p>
          </div>
        </div>
      </div>

      {/* === ACTION BUTTONS === */}
      <div className="flex flex-wrap justify-center gap-3 mt-8 no-print">
        <button
          onClick={onEdit}
          className="px-5 py-3 bg-white dark:bg-night-800 border border-slate-200 dark:border-night-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-night-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edytuj plan
        </button>

        <button
          onClick={copyToClipboard}
          className="px-5 py-3 bg-white dark:bg-night-800 border border-slate-200 dark:border-night-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-night-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Skopiowano!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Kopiuj
            </>
          )}
        </button>

        <button
          onClick={downloadMarkdown}
          className="px-5 py-3 bg-white dark:bg-night-800 border border-slate-200 dark:border-night-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-night-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Markdown
        </button>

        <button
          onClick={downloadPDF}
          disabled={isExporting}
          className="px-5 py-3 bg-gradient-to-r from-ember-500 to-ember-600 text-white font-medium rounded-xl hover:from-ember-400 hover:to-ember-500 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-ember-500/25 disabled:opacity-50"
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

      {/* Navigation buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-night-700">
        <Link
          href="/profile"
          className="px-5 py-3 bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mój profil
        </Link>
        <Link
          href="/history"
          className="px-5 py-3 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historia planów
        </Link>
        <Link
          href="/"
          className="px-5 py-3 bg-slate-100 dark:bg-night-800 border border-slate-200 dark:border-night-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-night-700 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Nowy plan
        </Link>
      </div>
    </div>
  );
}
