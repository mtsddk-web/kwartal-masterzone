'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface QA {
  q: string;
  a: string;
}

interface HelpTooltipProps {
  title: string;
  description: string;
  examples?: string[];
  tips?: string[];
  qa?: QA[];
}

export default function HelpTooltip({ title, description, examples, tips, qa }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedQA, setExpandedQA] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setExpandedQA(null);
    }
  }, [isOpen]);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal - full width on mobile, max-w-md on desktop */}
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] bg-white dark:bg-night-800 border-t sm:border border-slate-200 dark:border-night-600 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95 duration-200 flex flex-col"
      >
        {/* Header - sticky */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-200 dark:border-night-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white pr-8">{title}</h4>
          </div>
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-night-700 hover:bg-slate-200 dark:hover:bg-night-600 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5">
          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{description}</p>

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Przykłady
              </span>
              <ul className="mt-2 space-y-2">
                {examples.slice(0, 3).map((example, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-night-900/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0">→</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Wskazówka
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {tips[0]}
              </p>
            </div>
          )}

          {/* Q&A Section */}
          {qa && qa.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2 block">
                Często zadawane pytania
              </span>
              <div className="space-y-2">
                {qa.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-night-900/50 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedQA(expandedQA === index ? null : index)}
                      className="w-full flex items-start justify-between gap-2 px-3 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-night-700/50 transition-colors"
                    >
                      <span className="flex items-start gap-2 flex-1">
                        <span className="text-sky-600 dark:text-sky-400 flex-shrink-0">Q:</span>
                        <span>{item.q}</span>
                      </span>
                      <svg
                        className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform flex-shrink-0 mt-0.5 ${expandedQA === index ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedQA === index && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-200 dark:border-night-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="text-sky-600 dark:text-sky-400 font-medium">A:</span> {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - sticky close button for mobile */}
        <div className="p-4 border-t border-slate-200 dark:border-night-700 flex-shrink-0 sm:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-slate-100 dark:bg-night-700 hover:bg-slate-200 dark:hover:bg-night-600 text-slate-900 dark:text-white rounded-xl font-medium transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(true)}
        className="ml-2 w-5 h-5 rounded-full bg-slate-200 dark:bg-night-700/80 hover:bg-slate-300 dark:hover:bg-night-600 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium flex items-center justify-center transition-all"
        title="Pokaż pomoc"
      >
        ?
      </button>

      {/* Modal via portal */}
      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
