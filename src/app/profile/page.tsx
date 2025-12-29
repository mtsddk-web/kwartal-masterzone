'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  about_me: string;
  ideal_life_10y: string;
  ideal_life_20y: string;
  ideal_life_30y: string;
  long_term_goal: string;
  important_things: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [idealLife10y, setIdealLife10y] = useState('');
  const [idealLife20y, setIdealLife20y] = useState('');
  const [idealLife30y, setIdealLife30y] = useState('');
  const [longTermGoal, setLongTermGoal] = useState('');
  const [importantThings, setImportantThings] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch profile
  useEffect(() => {
    if (loading || !user) return;

    const fetchProfile = async () => {
      if (!isSupabaseConfigured()) {
        setLoadingProfile(false);
        return;
      }

      try {
        const supabase = createClient();
        if (!supabase) {
          setLoadingProfile(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Fetch profile error:', fetchError);
        }

        if (data) {
          setProfile(data as UserProfile);
          setFirstName(data.first_name || user.user_metadata?.first_name || '');
          setAboutMe(data.about_me || '');
          setIdealLife10y(data.ideal_life_10y || '');
          setIdealLife20y(data.ideal_life_20y || '');
          setIdealLife30y(data.ideal_life_30y || '');
          setLongTermGoal(data.long_term_goal || '');
          setImportantThings(data.important_things || '');
        } else {
          // Use user metadata if no profile exists
          setFirstName(user.user_metadata?.first_name || '');
        }
      } catch (err) {
        console.error('Fetch profile exception:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      if (!supabase) {
        setError('Nie można połączyć z bazą danych');
        setSaving(false);
        return;
      }

      const profileData = {
        user_id: user.id,
        first_name: firstName,
        about_me: aboutMe,
        ideal_life_10y: idealLife10y,
        ideal_life_20y: idealLife20y,
        ideal_life_30y: idealLife30y,
        long_term_goal: longTermGoal,
        important_things: importantThings,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('Save profile error:', upsertError);
        setError('Nie udało się zapisać profilu');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save profile exception:', err);
      setError('Wystąpił błąd podczas zapisywania');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const lastUpdated = profile?.updated_at
    ? new Date(profile.updated_at).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-night-950 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrót
            </button>
            <h1 className="text-2xl font-bold text-white">Mój Profil</h1>
            <p className="text-slate-400 mt-1">Twoja wizja idealnego życia</p>
          </div>
          {lastUpdated && (
            <div className="text-right text-sm text-slate-500">
              Ostatnia aktualizacja:<br />
              <span className="text-slate-400">{lastUpdated}</span>
            </div>
          )}
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-emerald-400 text-sm">Profil został zapisany!</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic info */}
          <div className="bg-night-900 border border-night-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              O mnie
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Imię</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Jak masz na imię?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Czym się zajmujesz?</label>
                <textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Opisz krótko czym się zajmujesz, jaką masz pracę, pasje..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ważne rzeczy w moim życiu</label>
                <textarea
                  value={importantThings}
                  onChange={(e) => setImportantThings(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Co jest dla Ciebie najważniejsze? Rodzina, zdrowie, rozwój...?"
                />
              </div>
            </div>
          </div>

          {/* Ideal life vision */}
          <div className="bg-night-900 border border-night-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Wizja idealnego życia
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Wyobraź sobie swoje idealne życie. Gdzie mieszkasz? Z kim? Co robisz? Jak wygląda Twój dzień?
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="text-indigo-400">Za 10 lat</span> - jak wygląda moje życie?
                </label>
                <textarea
                  value={idealLife10y}
                  onChange={(e) => setIdealLife10y(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Opisz szczegółowo swoje idealne życie za 10 lat..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="text-purple-400">Za 20 lat</span> - jak wygląda moje życie?
                </label>
                <textarea
                  value={idealLife20y}
                  onChange={(e) => setIdealLife20y(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Opisz szczegółowo swoje idealne życie za 20 lat..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="text-amber-400">Za 30 lat</span> - jak wygląda moje życie?
                </label>
                <textarea
                  value={idealLife30y}
                  onChange={(e) => setIdealLife30y(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Opisz szczegółowo swoje idealne życie za 30 lat..."
                />
              </div>
            </div>
          </div>

          {/* Long term goal */}
          <div className="bg-night-900 border border-night-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Cel życiowy
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Do czego ogólnie dążysz? Jaki jest Twój największy cel?
            </p>

            <textarea
              value={longTermGoal}
              onChange={(e) => setLongTermGoal(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-night-800 border border-night-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Jaki jest Twój największy życiowy cel? Do czego zmierzasz?"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Zapisz profil
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
