'use client';

import { Project, examplePlan } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface ProjectsStepProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export default function ProjectsStep({ projects, onChange }: ProjectsStepProps) {
  const totalPercentage = projects.reduce((sum, p) => sum + p.percentage, 0);
  const isValid = totalPercentage === 100;

  const updateProject = (index: number, field: keyof Project, value: string | number) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange(newProjects);
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-500/10 text-ember-600 dark:text-ember-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-ember-500" />
          Sekcja 3 z 7
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3 inline-flex items-center">
          Projekty
          <HelpTooltip {...helpContent.projects} />
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Jakie projekty realizujesz? Pamiętaj: <span className="text-ember-600 dark:text-ember-400 font-medium">max 3 jednocześnie!</span>
        </p>
      </div>

      {/* Total percentage indicator */}
      <div className={`mb-8 p-4 rounded-xl border transition-all duration-300 ${
        isValid
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isValid ? (
              <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className={isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
              Suma alokacji czasu
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {totalPercentage}%
            </span>
            <span className="text-slate-500">/ 100%</span>
          </div>
        </div>
      </div>

      {/* Projects list */}
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group p-6 bg-white/80 dark:bg-night-800/50 border border-slate-200 dark:border-night-700 rounded-2xl transition-all duration-300 hover:border-slate-300 dark:hover:border-night-600 shadow-sm dark:shadow-none"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Project header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  P{index + 1}
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-sm">Projekt {index + 1}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-ember-600 dark:text-ember-400">{project.percentage}%</span>
                <span className="text-slate-500 text-sm ml-1">czasu</span>
              </div>
            </div>

            {/* Project name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Nazwa projektu
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                placeholder={examplePlan.projects[index]?.name}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/50 border border-slate-300 dark:border-night-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/50 transition-all duration-300 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20"
              />
            </div>

            {/* Percentage slider */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                Alokacja czasu w tygodniu
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={project.percentage}
                  onChange={(e) => updateProject(index, 'percentage', parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="w-16 text-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={project.percentage}
                    onChange={(e) => updateProject(index, 'percentage', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full px-2 py-1 bg-slate-50 dark:bg-night-900/50 border border-slate-300 dark:border-night-700 rounded-lg text-center text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              {/* Visual bar */}
              <div className="mt-2 h-2 bg-slate-200 dark:bg-night-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-ember-500 transition-all duration-300"
                  style={{ width: `${project.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-slate-100/80 dark:bg-night-800/30 rounded-xl border border-slate-200 dark:border-night-700/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zasada 3 projektów</h4>
            <p className="text-sm text-slate-500">
              Więcej niż 3 projekty jednocześnie = rozproszenie gwarantowane.
              Jeden projekt główny (40-50%), dwa wspierające.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
