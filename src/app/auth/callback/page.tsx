'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const type = searchParams.get('type');

      if (code && isSupabaseConfigured()) {
        const supabase = createClient();
        if (supabase) {
          const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
          if (authError) {
            console.error('Auth callback error:', authError);
            setError('Nie udało się zalogować. Spróbuj ponownie.');
            return;
          }
        }
      }

      // Handle password recovery
      if (type === 'recovery') {
        router.push('/profile?reset=true');
        return;
      }

      // Redirect to home after auth
      router.push('/');
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Błąd logowania</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-ember-500 text-white rounded-xl hover:bg-ember-600 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-3 border-ember-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400">Trwa logowanie...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-3 border-ember-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-400">Trwa logowanie...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
