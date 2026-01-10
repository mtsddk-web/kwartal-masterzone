'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError('Brak połączenia z serwerem. Spróbuj później.');
      setIsLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Nieprawidłowy email lub hasło'
          : authError.message
      );
      setIsLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError('Brak połączenia z serwerem. Spróbuj później.');
      setIsLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    }
  };

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
            Zaloguj się
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Kontynuuj planowanie swojego kwartału
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

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Kontynuuj z Apple
            </button>

            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Kontynuuj z Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-night-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-night-800/40 text-slate-500">lub</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-night-900/50 border border-night-700/50 rounded-xl text-white placeholder-slate-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="twoj@email.pl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Hasło
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-night-900/50 border border-night-700/50 rounded-xl text-white placeholder-slate-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="••••••••"
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
                  Logowanie...
                </span>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm text-slate-400 hover:text-ember-400 transition-colors"
            >
              Zapomniałeś hasła?
            </Link>
            <p className="text-sm text-slate-500">
              Nie masz konta?{' '}
              <Link href="/register" className="text-ember-400 hover:text-ember-300 font-medium transition-colors">
                Zarejestruj się
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Logując się, akceptujesz{' '}
          <Link href="/terms" className="text-slate-500 hover:text-slate-400">
            Regulamin
          </Link>{' '}
          i{' '}
          <Link href="/privacy" className="text-slate-500 hover:text-slate-400">
            Politykę Prywatności
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
