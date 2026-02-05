'use client';

import { useState, useRef, useEffect } from 'react';

interface HelpTooltipProps {
  title: string;
  description: string;
  examples?: string[];
  tips?: string[];
}

export default function HelpTooltip({ title, description, examples, tips }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Zamknij po kliknięciu poza tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-flex">
      {/* Help button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="ml-2 w-5 h-5 rounded-full bg-night-700/80 hover:bg-night-600 text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center transition-all"
        title="Pokaż pomoc"
      >
        ?
      </button>

      {/* Tooltip cloud */}
      {isOpen && (
        <div
          ref={tooltipRef}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 top-full mt-2 z-[100] w-80 max-w-[90vw] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Arrow */}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-night-800 border-l border-t border-night-600 rotate-45" />

          {/* Content */}
          <div className="relative bg-night-800 border border-night-600 rounded-xl p-4 shadow-xl shadow-black/30">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-semibold text-white">{title}</h4>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">{description}</p>

            {/* Examples */}
            {examples && examples.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Przykłady
                </span>
                <ul className="mt-1 space-y-1">
                  {examples.slice(0, 2).map((example, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-1.5 text-[11px] text-slate-300 bg-night-900/50 rounded-md px-2 py-1.5"
                    >
                      <span className="text-emerald-400 mt-0.5">→</span>
                      <span className="line-clamp-2">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {tips && tips.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                  Wskazówka
                </span>
                <p className="text-[11px] text-slate-300 mt-1">
                  {tips[0]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
