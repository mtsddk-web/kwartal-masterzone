'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, isConfigured } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-night-800 border border-night-700 rounded-2xl p-8 shadow-xl relative">
        {/* Close button */}
        <Link
          href="/"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-night-700 rounded-lg transition-colors"
          title="Zamknij"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Zaloguj się
          </h1>
          <p className="text-slate-400">
            Kontynuuj planowanie swojego kwartału
          </p>
        </div>

        {/* Warning when Supabase not configured */}
        {!isConfigured && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400 text-sm mb-3">
              Logowanie nie jest aktywne w tej wersji aplikacji.
            </p>
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-gradient-to-r from-ember-500 to-amber-500 text-white font-medium rounded-xl text-center hover:from-ember-600 hover:to-amber-600 transition-all"
            >
              Przejdź do planowania kwartału
            </Link>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form - only show when Supabase is configured */}
        {isConfigured && (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full px-4 py-3 bg-night-900 border border-night-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                  minLength={6}
                  className="w-full px-4 py-3 bg-night-900 border border-night-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Minimum 6 znaków"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-night-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>

            {/* Footer - only when form is shown */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-slate-400 text-sm">
                Nie masz konta?{' '}
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Zarejestruj się
                </Link>
              </p>
              <p className="text-slate-500 text-sm">
                <Link href="/" className="hover:text-slate-400">
                  Lub kontynuuj bez logowania
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
