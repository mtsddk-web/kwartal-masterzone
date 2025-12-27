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
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAskSection, setShowAskSection] = useState(false);
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
      setShowAskSection(false);
      setAiResponse('');
      setQuestion('');
      setExpandedQA(null);
    }
  }, [isOpen]);

  const askAI = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/help-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          context: { title, description, examples, tips },
        }),
      });

      const data = await response.json();
      setAiResponse(data.response || data.error || 'Brak odpowiedzi');
    } catch (error) {
      setAiResponse('Przepraszam, wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-night-800 border border-night-600 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-night-700 hover:bg-night-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-white">{title}</h4>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{description}</p>

        {/* Examples */}
        {examples && examples.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Przykłady
            </span>
            <ul className="mt-2 space-y-2">
              {examples.slice(0, 3).map((example, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-300 bg-night-900/50 rounded-lg px-3 py-2"
                >
                  <span className="text-emerald-400 mt-0.5">→</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        {tips && tips.length > 0 && !showAskSection && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Wskazówka
            </span>
            <p className="text-sm text-slate-300 mt-1">
              {tips[0]}
            </p>
          </div>
        )}

        {/* Q&A Section */}
        {qa && qa.length > 0 && !showAskSection && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2 block">
              Często zadawane pytania
            </span>
            <div className="space-y-2">
              {qa.map((item, index) => (
                <div
                  key={index}
                  className="bg-night-900/50 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedQA(expandedQA === index ? null : index)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-night-700/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sky-400">Q:</span>
                      <span>{item.q}</span>
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform ${expandedQA === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedQA === index && (
                    <div className="px-3 pb-3 pt-1 border-t border-night-700">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="text-sky-400 font-medium">A:</span> {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-night-600 my-4" />

        {/* Ask AI section */}
        {!showAskSection ? (
          <button
            onClick={() => setShowAskSection(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Masz pytanie? Zapytaj AI
          </button>
        ) : (
          <div className="space-y-4">
            {/* Question input */}
            <div>
              <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 block">
                Twoje pytanie
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="np. Czy to ma być liczba czy %?"
                  className="flex-1 px-4 py-3 bg-night-900 border border-night-600 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  onClick={askAI}
                  disabled={isLoading || !question.trim()}
                  className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-night-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Odpowiedź AI
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {aiResponse}
                </p>
              </div>
            )}

            {/* Back button */}
            {!isLoading && (
              <button
                onClick={() => {
                  setShowAskSection(false);
                  setAiResponse('');
                  setQuestion('');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Wróć do podpowiedzi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(true)}
        className="ml-2 w-5 h-5 rounded-full bg-night-700/80 hover:bg-night-600 text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center transition-all"
        title="Pokaż pomoc"
      >
        ?
      </button>

      {/* Modal via portal */}
      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
