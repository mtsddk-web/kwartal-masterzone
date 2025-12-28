'use client';

import { Retrospective } from '@/types/plan';
import HelpTooltip from '../HelpTooltip';
import { helpContent } from '@/data/helpContent';

interface RetrospectiveStepProps {
  retrospective: Retrospective;
  onChange: (retrospective: Retrospective) => void;
  previousQuarter: string;
}

export default function RetrospectiveStep({
  retrospective,
  onChange,
  previousQuarter,
}: RetrospectiveStepProps) {
  const updateField = <K extends keyof Retrospective>(
    key: K,
    value: Retrospective[K]
  ) => {
    onChange({ ...retrospective, [key]: value });
  };

  const updateArrayItem = (
    key: 'stop' | 'continue' | 'openLoops',
    index: number,
    value: string
  ) => {
    const arr = [...retrospective[key]];
    arr[index] = value;
    onChange({ ...retrospective, [key]: arr });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Retrospektywa {previousQuarter}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Zanim zaplanujemy przyszłość, podsumujmy co się wydarzyło
        </p>
      </div>

      {/* A1. Fakty i wyniki */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-ember-500/20 dark:bg-ember-500/30 flex items-center justify-center text-ember-600 dark:text-ember-400 text-sm font-bold">1</span>
          Fakty i wyniki
          <HelpTooltip {...helpContent.retrospective} />
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Jakie były Twoje 3 główne cele/założenia?
            </label>
            <textarea
              value={retrospective.previousGoals}
              onChange={(e) => updateField('previousGoals', e.target.value)}
              placeholder="np. Launch produktu, 10 klientów, automatyzacja..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 focus:border-ember-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Co realnie dowiozłeś? (3-5 konkretów z liczbami)
            </label>
            <textarea
              value={retrospective.delivered}
              onChange={(e) => updateField('delivered', e.target.value)}
              placeholder="1. MVP uruchomione&#10;2. 7 płacących klientów&#10;3. ..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 focus:border-ember-500 resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Czego NIE dowiozłeś mimo znaczenia?
            </label>
            <textarea
              value={retrospective.notDelivered}
              onChange={(e) => updateField('notDelivered', e.target.value)}
              placeholder="Co zostało niedokończone lub porzucone?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 focus:border-ember-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Jedna liczba opisująca ten okres
            </label>
            <input
              type="text"
              value={retrospective.keyNumber}
              onChange={(e) => updateField('keyNumber', e.target.value)}
              placeholder="np. 50 000 PLN przychodu, 12 klientów, 3 projekty..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50 focus:border-ember-500"
            />
          </div>
        </div>
      </div>

      {/* A2. Co działało */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold">2</span>
          Co działało
          <HelpTooltip {...helpContent.retrospective} />
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Najlepiej działające elementy do utrzymania
            </label>
            <textarea
              value={retrospective.whatWorked}
              onChange={(e) => updateField('whatWorked', e.target.value)}
              placeholder="Co przyniosło najlepsze efekty? Co warto kontynuować?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Nawyki/działania z największym wpływem
            </label>
            <textarea
              value={retrospective.bestHabits}
              onChange={(e) => updateField('bestHabits', e.target.value)}
              placeholder="np. Deep work 4h rano, weekly review w niedzielę..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* A3. Wzorce i przeszkody */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-red-500/20 dark:bg-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-bold">3</span>
          Wzorce i przeszkody
          <HelpTooltip {...helpContent.retrospective} />
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Problemy powtarzające się przez cały okres
            </label>
            <textarea
              value={retrospective.recurringProblems}
              onChange={(e) => updateField('recurringProblems', e.target.value)}
              placeholder="Co ciągle wracało? Jakie wzorce widzisz?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Najczęstsze przeszkody wytrącające z toru
            </label>
            <textarea
              value={retrospective.obstacles}
              onChange={(e) => updateField('obstacles', e.target.value)}
              placeholder="Co przeszkadzało w realizacji planów?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Najdroższa pomyłka / lekcja
            </label>
            <input
              type="text"
              value={retrospective.biggestMistake}
              onChange={(e) => updateField('biggestMistake', e.target.value)}
              placeholder="1 zdanie: co poszło nie tak i czego się nauczyłeś"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* A5. Decyzje zamykające */}
      <div className="bg-white/80 dark:bg-night-800/60 rounded-2xl p-6 border border-slate-200 dark:border-night-600/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">4</span>
          Decyzje zamykające okres
          <HelpTooltip {...helpContent.stopDoing} />
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {/* STOP */}
          <div>
            <label className="block text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wider">
              STOP - co kończysz
            </label>
            <div className="space-y-2">
              {retrospective.stop.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('stop', index, e.target.value)}
                  placeholder={`Stop #${index + 1}`}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-night-900/80 border border-red-300 dark:border-red-500/40 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                />
              ))}
            </div>
          </div>

          {/* CONTINUE */}
          <div>
            <label className="block text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wider">
              CONTINUE - co zostaje
            </label>
            <div className="space-y-2">
              {retrospective.continue.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('continue', index, e.target.value)}
                  placeholder={`Continue #${index + 1}`}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-night-900/80 border border-emerald-300 dark:border-emerald-500/40 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                />
              ))}
            </div>
          </div>

          {/* START */}
          <div>
            <label className="block text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-wider">
              START - nowa zasada
            </label>
            <textarea
              value={retrospective.start}
              onChange={(e) => updateField('start', e.target.value)}
              placeholder="Jedna nowa zasada od teraz"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-night-900/80 border border-amber-300 dark:border-amber-500/40 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Open loops */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-white mb-3">
            Otwarte pętle do domknięcia (2 rzeczy)
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {retrospective.openLoops.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => updateArrayItem('openLoops', index, e.target.value)}
                placeholder={`Otwarta pętla #${index + 1}`}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-night-900/80 border border-slate-300 dark:border-night-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
