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
      <div className="min-h-screen bg-slate-50 dark:bg-night-900 flex items-center justify-center">
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

  // Count filled goals
  const getGoalsCount = (plan: QuarterlyPlan) => {
    return plan.goals?.filter(g => g.name).length || 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-night-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm mb-2 inline-flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrót
            </button>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Historia planów</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Twoje zapisane plany kwartalne</p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ember-500 to-ember-600 text-white dark:text-night-900 rounded-xl font-medium hover:from-ember-400 hover:to-ember-500 transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nowy plan
          </Link>
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-night-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Brak zapisanych planów</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Zacznij planować swój pierwszy kwartał</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ember-500 to-ember-600 text-white dark:text-night-900 rounded-xl font-medium hover:from-ember-400 hover:to-ember-500 transition-all"
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
              const goalsCount = getGoalsCount(plan.plan_data);
              const circumference = 2 * Math.PI * 28; // r=28
              const strokeDashoffset = circumference - (progress / 100) * circumference;

              return (
                <Link
                  key={plan.id}
                  href={`/?q=${plan.quarter}&y=${plan.year}`}
                  className="block bg-white dark:bg-night-800 border border-slate-200 dark:border-night-700 rounded-2xl p-5 hover:border-ember-500/50 hover:shadow-lg dark:hover:bg-night-700/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Circular progress */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          className="stroke-slate-200 dark:stroke-night-700"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          className="stroke-ember-500"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{progress}%</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white group-hover:text-ember-600 dark:group-hover:text-ember-400 transition-colors">
                        {getQuarterLabel(plan.quarter, plan.year)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Edytowano {new Date(plan.updated_at).toLocaleDateString('pl-PL', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {plan.plan_data.oneWord && (
                          <span className="px-2 py-0.5 bg-ember-500/10 text-ember-600 dark:text-ember-400 text-xs rounded-full font-medium">
                            {plan.plan_data.oneWord}
                          </span>
                        )}
                        {goalsCount > 0 && (
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                            {goalsCount} {goalsCount === 1 ? 'cel' : goalsCount < 5 ? 'cele' : 'celów'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-ember-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* North Star preview */}
                  {plan.plan_data.northStar && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-night-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                        <span className="text-slate-400 dark:text-slate-500">North Star:</span>{' '}
                        <span className="text-slate-900 dark:text-slate-300">{plan.plan_data.northStar}</span>
                      </p>
                    </div>
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
