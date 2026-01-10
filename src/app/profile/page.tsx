'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      if (!supabase) {
        router.push('/login');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      setFullName(user.user_metadata?.full_name || '');
      setIsLoading(false);
    };

    loadUser();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Brak połączenia z serwerem' });
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profil został zaktualizowany' });
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'USUŃ KONTO') return;

    setIsDeleting(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Nie udało się usunąć konta');
      }

      router.push('/login?deleted=true');
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Nie udało się usunąć konta'
      });
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleExportData = async () => {
    const supabase = createClient();
    if (!supabase || !user) return;

    const { data: plans } = await supabase
      .from('quarterly_plans')
      .select('*')
      .eq('user_id', user.id);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        email: user.email,
        fullName: user.user_metadata?.full_name,
        createdAt: user.created_at,
      },
      plans: plans || [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kwartal-app-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-ember-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Wróć do planowania
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white border border-night-700 hover:border-night-600 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Wyloguj się
          </button>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center text-white text-2xl font-bold">
              {fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                {fullName || 'Twój profil'}
              </h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit profile form */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                Imię i nazwisko
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-night-900/50 border border-night-700/50 rounded-xl text-white placeholder-slate-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="Jan Kowalski"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-night-900/30 border border-night-700/30 rounded-xl text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">Email nie może być zmieniony</p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 bg-gradient-to-r from-ember-500 to-ember-600 text-white font-semibold rounded-xl hover:from-ember-600 hover:to-ember-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ember-500/25"
            >
              {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>
        </motion.div>

        {/* Data management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Zarządzanie danymi</h2>

          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between px-4 py-4 bg-night-900/30 border border-night-700/30 rounded-xl text-left hover:border-night-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Eksportuj dane</p>
                  <p className="text-sm text-slate-500">Pobierz wszystkie swoje dane w formacie JSON</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Link
              href="/trash"
              className="w-full flex items-center justify-between px-4 py-4 bg-night-900/30 border border-night-700/30 rounded-xl text-left hover:border-night-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Kosz</p>
                  <p className="text-sm text-slate-500">Przywróć usunięte plany</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 border border-red-500/20"
        >
          <h2 className="text-xl font-bold text-red-400 mb-2">Strefa niebezpieczna</h2>
          <p className="text-slate-400 text-sm mb-6">
            Te akcje są nieodwracalne. Przemyśl to dokładnie.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between px-4 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left hover:bg-red-500/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-400">Usuń konto</p>
                <p className="text-sm text-slate-500">Trwale usuń konto i wszystkie dane</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Konto utworzone: {user?.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : '-'}
        </p>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
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
                Usuń konto?
              </h2>
              <p className="text-slate-400 text-center mb-6">
                Ta akcja jest <span className="text-red-400 font-semibold">nieodwracalna</span>.
                Wszystkie Twoje plany i dane zostaną trwale usunięte.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Wpisz <span className="font-mono text-red-400">USUŃ KONTO</span> aby potwierdzić
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-3 bg-night-900/50 border border-red-500/30 rounded-xl text-white placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="USUŃ KONTO"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  className="flex-1 py-3 px-4 border border-night-700 text-white font-medium rounded-xl hover:bg-night-800 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'USUŃ KONTO' || isDeleting}
                  className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Usuwanie...' : 'Usuń konto'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
