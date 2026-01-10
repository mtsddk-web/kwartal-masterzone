'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrash, formatDeletedDate, DeletedPlan } from '@/hooks/useTrash';

export default function TrashPage() {
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRestore = async (plan: DeletedPlan) => {
    setActionInProgress(plan.id);
    const success = await restore(plan.id);
    setActionInProgress(null);
    if (success) {
      showSuccess(`Plan ${plan.quarter} ${plan.year} przywrócony`);
    }
  };

  const handlePermanentDelete = async (planId: string) => {
    setActionInProgress(planId);
    const success = await permanentDelete(planId);
    setActionInProgress(null);
    setConfirmDelete(null);
    if (success) {
      showSuccess('Plan trwale usunięty');
    }
  };

  const handleEmptyBin = async () => {
    setActionInProgress('empty');
    const success = await emptyBin();
    setActionInProgress(null);
    setConfirmEmptyBin(false);
    if (success) {
      showSuccess('Kosz opróżniony');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/profile"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Profil
          </Link>

          <div className="flex items-center gap-2">
            {deletedPlans.length > 0 && (
              <button
                onClick={() => setConfirmEmptyBin(true)}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                Opróżnij kosz
              </button>
            )}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white hover:bg-night-800 rounded-xl transition-colors disabled:opacity-50"
              title="Odśwież"
            >
              <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Kosz</h1>
              <p className="text-slate-400">
                {deletedPlans.length === 0
                  ? 'Kosz jest pusty'
                  : `${deletedPlans.length} ${deletedPlans.length === 1 ? 'usunięty plan' : deletedPlans.length < 5 ? 'usunięte plany' : 'usuniętych planów'}`
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="w-8 h-8 text-ember-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : deletedPlans.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-night-800 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Kosz jest pusty</h2>
              <p className="text-slate-400 mb-6">Usunięte plany pojawią się tutaj</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ember-500 to-ember-600 text-white font-medium rounded-xl hover:from-ember-600 hover:to-ember-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Utwórz nowy plan
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-night-700/50">
              {deletedPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-night-800/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-ember-500/20 text-ember-400 text-sm font-semibold rounded-lg">
                          {plan.quarter} {plan.year}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {formatDeletedDate(plan.deletedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {confirmDelete === plan.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400 mr-2">Usunąć na stałe?</span>
                          <button
                            onClick={() => handlePermanentDelete(plan.id)}
                            disabled={actionInProgress === plan.id}
                            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {actionInProgress === plan.id ? 'Usuwanie...' : 'Usuń'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-night-700 rounded-lg transition-colors"
                          >
                            Anuluj
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(plan)}
                            disabled={actionInProgress === plan.id}
                            className="px-4 py-2 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {actionInProgress === plan.id ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Przywracanie...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Przywróć
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(plan.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Usuń na stałe"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Footer info */}
          {deletedPlans.length > 0 && (
            <div className="p-4 border-t border-night-700/50 bg-night-800/30">
              <p className="text-xs text-slate-500 text-center">
                Plany w koszu są automatycznie usuwane po 30 dniach
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Empty bin confirmation modal */}
      <AnimatePresence>
        {confirmEmptyBin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setConfirmEmptyBin(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-3xl p-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Opróżnić kosz?
              </h2>
              <p className="text-slate-400 text-center mb-6">
                Wszystkie <span className="text-white font-medium">{deletedPlans.length}</span> planów zostanie <span className="text-red-400 font-semibold">trwale usuniętych</span>.
                Tej operacji nie można cofnąć.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmEmptyBin(false)}
                  className="flex-1 py-3 px-4 border border-night-700 text-white font-medium rounded-xl hover:bg-night-800 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleEmptyBin}
                  disabled={actionInProgress === 'empty'}
                  className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionInProgress === 'empty' ? 'Usuwanie...' : 'Opróżnij kosz'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
