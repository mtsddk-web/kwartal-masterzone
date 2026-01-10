'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVersionHistory, formatVersionDate, PlanVersion } from '@/hooks/useVersionHistory';

interface VersionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | undefined;
  currentPlanData?: Record<string, unknown>;
  onRestore?: (planData: Record<string, unknown>) => void;
}

export default function VersionHistoryPanel({
  isOpen,
  onClose,
  planId,
  currentPlanData,
  onRestore,
}: VersionHistoryPanelProps) {
  const {
    versions,
    isLoading,
    error,
    currentVersion,
    restoreVersion,
    getVersions,
  } = useVersionHistory(planId, currentPlanData);

  const [previewVersion, setPreviewVersion] = useState<PlanVersion | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async (versionId: string) => {
    setIsRestoring(true);
    const planData = await restoreVersion(versionId);
    setIsRestoring(false);

    if (planData && onRestore) {
      onRestore(planData);
      setConfirmRestore(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-night-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-night-900 border border-night-700 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-night-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-white">Historia wersji</h2>
                <p className="text-sm text-slate-400">
                  {versions.length === 0
                    ? 'Brak zapisanych wersji'
                    : `${versions.length} ${versions.length === 1 ? 'wersja' : versions.length < 5 ? 'wersje' : 'wersji'}`
                  }
                  {currentVersion && ` • Aktualna: v${currentVersion}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => getVersions()}
                className="p-2 text-slate-400 hover:text-white hover:bg-night-800 rounded-lg transition-colors"
                title="Odśwież"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-night-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Versions list */}
            <div className="w-1/2 border-r border-night-700 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="w-8 h-8 text-ember-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : error ? (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-400">{error}</p>
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 rounded-full bg-night-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 mb-2">Brak historii wersji</p>
                  <p className="text-sm text-slate-500">
                    Wersje będą tworzone automatycznie co 10 minut
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {versions.map((version, index) => (
                    <motion.button
                      key={version.id}
                      onClick={() => setPreviewVersion(version)}
                      className={`w-full p-4 rounded-xl text-left transition-colors ${
                        previewVersion?.id === version.id
                          ? 'bg-indigo-500/20 border border-indigo-500/50'
                          : 'bg-night-800/50 border border-night-700/50 hover:border-night-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${
                          previewVersion?.id === version.id ? 'text-indigo-400' : 'text-white'
                        }`}>
                          Wersja {version.version}
                          {index === 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                              Najnowsza
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {formatVersionDate(version.createdAt)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="w-1/2 overflow-y-auto">
              {previewVersion ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-white">
                      Podgląd wersji {previewVersion.version}
                    </h3>
                    {confirmRestore === previewVersion.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestore(previewVersion.id)}
                          disabled={isRestoring}
                          className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                        >
                          {isRestoring ? 'Przywracanie...' : 'Potwierdź'}
                        </button>
                        <button
                          onClick={() => setConfirmRestore(null)}
                          className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          Anuluj
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRestore(previewVersion.id)}
                        className="px-3 py-1.5 text-sm bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Przywróć tę wersję
                      </button>
                    )}
                  </div>

                  {/* Preview content */}
                  <div className="space-y-4">
                    <PreviewSection
                      label="Kwartał"
                      value={`${(previewVersion.planData as { quarter?: string }).quarter} ${(previewVersion.planData as { year?: number }).year}`}
                    />

                    <PreviewSection
                      label="Wizja"
                      value={(previewVersion.planData as { vision?: string }).vision || '(brak)'}
                    />

                    <PreviewSection
                      label="Cele"
                      value={(previewVersion.planData as { goals?: Array<{ name: string }> }).goals
                        ?.filter((g) => g.name)
                        .map((g) => g.name)
                        .join(', ') || '(brak)'}
                    />

                    <PreviewSection
                      label="Projekty"
                      value={(previewVersion.planData as { projects?: Array<{ name: string; percentage: number }> }).projects
                        ?.filter((p) => p.name)
                        .map((p) => `${p.name} (${p.percentage}%)`)
                        .join(', ') || '(brak)'}
                    />
                  </div>

                  {/* Raw data toggle */}
                  <details className="mt-6">
                    <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                      Pokaż surowe dane JSON
                    </summary>
                    <pre className="mt-2 p-4 bg-night-800 rounded-lg text-xs text-slate-400 overflow-x-auto max-h-64">
                      {JSON.stringify(previewVersion.planData, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p>Wybierz wersję, aby zobaczyć podgląd</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-night-700 bg-night-800/30">
            <p className="text-xs text-slate-500 text-center">
              Wersje są tworzone automatycznie co 10 minut oraz przy wyjściu z aplikacji
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper component
function PreviewSection({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-night-800/50 rounded-lg border border-night-700/50">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-slate-300 line-clamp-3">{value}</p>
    </div>
  );
}
