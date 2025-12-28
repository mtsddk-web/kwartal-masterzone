'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { QuarterlyPlan } from '@/types/plan';

interface PlanSummary {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  plan_data: QuarterlyPlan;
  created_at: string;
  updated_at: string;
}

export default function HistoryPage() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in - but wait for auth to fully load
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch plans when user is available
  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If no user, don't fetch (will redirect)
    if (!user) {
      setLoadingPlans(false);
      return;
    }

    // If Supabase not configured, show error
    if (!isSupabaseConfigured()) {
      setError('Baza danych nie jest skonfigurowana');
      setLoadingPlans(false);
      return;
    }

    const fetchPlans = async () => {
      try {
        const supabase = createClient();
        if (!supabase) {
          setError('Nie można połączyć z bazą danych');
          setLoadingPlans(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('quarterly_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('year', { ascending: false })
          .order('quarter', { ascending: false });

        if (fetchError) {
          console.error('Fetch plans error:', fetchError);
          setError('Nie udało się pobrać planów');
        } else if (data) {
          setPlans(data as PlanSummary[]);
        }
      } catch (err) {
        console.error('Fetch plans exception:', err);
        setError('Wystąpił błąd podczas pobierania planów');
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [user, loading]);

  if (loading || loadingPlans) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const getQuarterLabel = (quarter: string, year: number) => {
    const quarterNames: Record<string, string> = {
      Q1: 'I kwartał',
      Q2: 'II kwartał',
      Q3: 'III kwartał',
      Q4: 'IV kwartał',
    };
    return `${quarterNames[quarter]} ${year}`;
  };

  const getProgress = (plan: QuarterlyPlan) => {
    let filled = 0;
    let total = 10;

    if (plan.northStar) filled++;
    if (plan.oneWord) filled++;
    if (plan.goals?.some(g => g.name)) filled++;
    if (plan.projects?.some(p => p.name)) filled++;
    if (plan.milestones?.month1) filled++;
    if (plan.metrics?.some(m => m.name)) filled++;
    if (plan.risks?.some(r => r.risk)) filled++;
    if (plan.ifThenRules?.some(r => r.condition)) filled++;
    if (plan.retrospective?.previousGoals) filled++;
    if (plan.annualPlan?.annualVision) filled++;

    return Math.round((filled / total) * 100);
  };

  return (
    <div className="min-h-screen bg-night-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-slate-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrót
            </Link>
            <h1 className="text-2xl font-bold text-white">Historia planów</h1>
            <p className="text-slate-400 mt-1">Twoje zapisane plany kwartalne</p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Plans grid */}
        {!error && plans.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-night-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Brak zapisanych planów</h3>
            <p className="text-slate-400 mb-6">Zacznij planować swój pierwszy kwartał</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Stwórz plan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        ) : !error && plans.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => {
              const progress = getProgress(plan.plan_data);
              return (
                <Link
                  key={plan.id}
                  href={`/?q=${plan.quarter}&y=${plan.year}`}
                  className="block bg-night-800 border border-night-700 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-night-700/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {getQuarterLabel(plan.quarter, plan.year)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Ostatnia edycja: {new Date(plan.updated_at).toLocaleDateString('pl-PL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-400">{progress}%</div>
                      <div className="text-xs text-slate-500">ukończone</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-night-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Quick info */}
                  {plan.plan_data.northStar && (
                    <p className="mt-3 text-sm text-slate-400 line-clamp-2">
                      <span className="text-indigo-400">North Star:</span> {plan.plan_data.northStar}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
