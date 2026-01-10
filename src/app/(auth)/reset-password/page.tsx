'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      if (!supabase) {
        setIsValidSession(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError('Brak połączenia z serwerem. Spróbuj później.');
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);

    // Redirect to home after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  // Loading state
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-ember-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Invalid session
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass rounded-3xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-4">
              Link wygasł
            </h1>
            <p className="text-slate-400 mb-6">
              Ten link do resetowania hasła jest nieprawidłowy lub wygasł.
              Poproś o nowy link.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-ember-500 to-ember-600 text-white font-semibold rounded-xl hover:from-ember-600 hover:to-ember-700 transition-all"
            >
              Wyślij nowy link
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass rounded-3xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-4">
              Hasło zmienione
            </h1>
            <p className="text-slate-400 mb-6">
              Twoje hasło zostało pomyślnie zmienione.
              Za chwilę zostaniesz przekierowany...
            </p>
            <div className="animate-spin h-6 w-6 border-2 border-ember-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 px-6 py-3 bg-night-800/50 backdrop-blur-sm rounded-2xl border border-night-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-slate-300 font-medium">MasterZone</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <h1 className="font-display text-3xl font-bold text-white text-center mb-2">
            Nowe hasło
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Wprowadź nowe hasło dla swojego konta
          </p>

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Nowe hasło
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-night-900/50 border border-night-700/50 rounded-xl text-white placeholder-slate-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="Minimum 8 znaków"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Potwierdź hasło
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-night-900/50 border border-night-700/50 rounded-xl text-white placeholder-slate-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="Powtórz hasło"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-ember-500 to-ember-600 text-white font-semibold rounded-xl hover:from-ember-600 hover:to-ember-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ember-500/25"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Zapisywanie...
                </span>
              ) : (
                'Ustaw nowe hasło'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
