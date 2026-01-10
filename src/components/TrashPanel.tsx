'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrash, formatDeletedDate, DeletedPlan } from '@/hooks/useTrash';

interface TrashPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanRestored?: (plan: DeletedPlan) => void;
}

export default function TrashPanel({ isOpen, onClose, onPlanRestored }: TrashPanelProps) {
  const {
    deletedPlans,
    isLoading,
    error,
    restore,
    permanentDelete,
    emptyBin,
    refresh,
  } = useTrash();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmEmptyBin, setConfirmEmptyBin] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleRestore = async (plan: DeletedPlan) => {
    setActionInProgress(plan.id);
    const success = await restore(plan.id);
    setActionInProgress(null);
    if (success && onPlanRestored) {
      onPlanRestored(plan);
    }
  };

  const handlePermanentDelete = async (planId: string) => {
    setActionInProgress(planId);
    await permanentDelete(planId);
    setActionInProgress(null);
    setConfirmDelete(null);
  };

  const handleEmptyBin = async () => {
    setActionInProgress('empty');
    await emptyBin();
    setActionInProgress(null);
    setConfirmEmptyBin(false);
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
          className="bg-night-900 border border-night-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-night-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-white">Kosz</h2>
                <p className="text-sm text-slate-400">
                  {deletedPlans.length === 0
                    ? 'Kosz jest pusty'
                    : `${deletedPlans.length} ${deletedPlans.length === 1 ? 'plan' : deletedPlans.length < 5 ? 'plany' : 'planów'}`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {deletedPlans.length > 0 && (
                <button
                  onClick={() => setConfirmEmptyBin(true)}
                  className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Opróżnij kosz
                </button>
              )}
              <button
                onClick={refresh}
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
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="w-8 h-8 text-ember-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-400">{error}</p>
              </div>
            ) : deletedPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-night-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p className="text-slate-400 mb-2">Kosz jest pusty</p>
                <p className="text-sm text-slate-500">Usunięte plany pojawią się tutaj</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deletedPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-night-800/50 rounded-xl border border-night-700/50 hover:border-night-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-ember-500/20 text-ember-400 text-xs font-medium rounded">
                            {plan.quarter} {plan.year}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">
                          {formatDeletedDate(plan.deletedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {confirmDelete === plan.id ? (
                          <>
                            <button
                              onClick={() => handlePermanentDelete(plan.id)}
                              disabled={actionInProgress === plan.id}
                              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {actionInProgress === plan.id ? 'Usuwanie...' : 'Potwierdź'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                              Anuluj
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestore(plan)}
                              disabled={actionInProgress === plan.id}
                              className="px-3 py-1.5 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              {actionInProgress === plan.id ? (
                                <>
                                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Przywracanie...
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  Przywróć
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(plan.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                              title="Usuń na stałe"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-night-700 bg-night-800/30">
            <p className="text-xs text-slate-500 text-center">
              Plany w koszu są automatycznie usuwane po 30 dniach
            </p>
          </div>

          {/* Empty bin confirmation modal */}
          <AnimatePresence>
            {confirmEmptyBin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-night-950/90 flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-night-800 border border-night-700 rounded-xl p-6 max-w-sm w-full"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white text-center mb-2">
                    Opróżnić kosz?
                  </h3>
                  <p className="text-sm text-slate-400 text-center mb-6">
                    Wszystkie {deletedPlans.length} planów zostanie trwale usuniętych.
                    Tej operacji nie można cofnąć.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmEmptyBin(false)}
                      className="flex-1 px-4 py-2.5 bg-night-700 text-slate-300 rounded-lg hover:bg-night-600 transition-colors"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleEmptyBin}
                      disabled={actionInProgress === 'empty'}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {actionInProgress === 'empty' ? 'Usuwanie...' : 'Opróżnij'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
