'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient, isSupabaseConfigured, QuarterlyPlanRow } from '@/lib/supabase/client';

// =============================================================================
// TYPES
// =============================================================================

export interface DeletedPlan {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  deletedAt: Date;
  planData: Record<string, unknown>;
}

interface UseTrashReturn {
  deletedPlans: DeletedPlan[];
  isLoading: boolean;
  error: string | null;
  moveToBin: (planId: string) => Promise<boolean>;
  restore: (planId: string) => Promise<boolean>;
  permanentDelete: (planId: string) => Promise<boolean>;
  emptyBin: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

// Automatyczne usuwanie po 30 dniach (w ms)
const AUTO_DELETE_DAYS = 30;

// =============================================================================
// HOOK
// =============================================================================

export function useTrash(): UseTrashReturn {
  const [deletedPlans, setDeletedPlans] = useState<DeletedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pobierz usuniete plany
  const fetchDeletedPlans = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setDeletedPlans([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('quarterly_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', true)
        .order('deleted_at', { ascending: false });

      if (fetchError) throw fetchError;

      const plans: DeletedPlan[] = (data || []).map((row: QuarterlyPlanRow) => ({
        id: row.id,
        quarter: row.quarter,
        year: row.year,
        deletedAt: new Date(row.deleted_at || row.updated_at),
        planData: row.plan_data,
      }));

      setDeletedPlans(plans);

      // Automatyczne czyszczenie planów starszych niż 30 dni
      await cleanupOldPlans(supabase, user.id);
    } catch (err) {
      console.error('Error fetching deleted plans:', err);
      setError('Nie udało się pobrać usuniętych planów');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatyczne czyszczenie starych planów
  const cleanupOldPlans = async (supabase: ReturnType<typeof createClient>, userId: string) => {
    if (!supabase) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - AUTO_DELETE_DAYS);

    try {
      await supabase
        .from('quarterly_plans')
        .delete()
        .eq('user_id', userId)
        .eq('is_deleted', true)
        .lt('deleted_at', cutoffDate.toISOString());
    } catch (err) {
      console.error('Error cleaning up old plans:', err);
    }
  };

  // Przenieś do kosza (soft delete)
  const moveToBin = useCallback(async (planId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase nie jest skonfigurowany');
      return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error: updateError } = await supabase
        .from('quarterly_plans')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', planId);

      if (updateError) throw updateError;

      await fetchDeletedPlans();
      return true;
    } catch (err) {
      console.error('Error moving to bin:', err);
      setError('Nie udało się usunąć planu');
      return false;
    }
  }, [fetchDeletedPlans]);

  // Przywróć z kosza
  const restore = useCallback(async (planId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase nie jest skonfigurowany');
      return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error: updateError } = await supabase
        .from('quarterly_plans')
        .update({
          is_deleted: false,
          deleted_at: null,
        })
        .eq('id', planId);

      if (updateError) throw updateError;

      await fetchDeletedPlans();
      return true;
    } catch (err) {
      console.error('Error restoring plan:', err);
      setError('Nie udało się przywrócić planu');
      return false;
    }
  }, [fetchDeletedPlans]);

  // Trwałe usunięcie
  const permanentDelete = useCallback(async (planId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase nie jest skonfigurowany');
      return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error: deleteError } = await supabase
        .from('quarterly_plans')
        .delete()
        .eq('id', planId);

      if (deleteError) throw deleteError;

      await fetchDeletedPlans();
      return true;
    } catch (err) {
      console.error('Error permanently deleting plan:', err);
      setError('Nie udało się trwale usunąć planu');
      return false;
    }
  }, [fetchDeletedPlans]);

  // Opróżnij kosz
  const emptyBin = useCallback(async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase nie jest skonfigurowany');
      return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error: deleteError } = await supabase
        .from('quarterly_plans')
        .delete()
        .eq('user_id', user.id)
        .eq('is_deleted', true);

      if (deleteError) throw deleteError;

      setDeletedPlans([]);
      return true;
    } catch (err) {
      console.error('Error emptying bin:', err);
      setError('Nie udało się opróżnić kosza');
      return false;
    }
  }, []);

  // Odśwież
  const refresh = useCallback(async () => {
    await fetchDeletedPlans();
  }, [fetchDeletedPlans]);

  // Pobierz przy montowaniu
  useEffect(() => {
    fetchDeletedPlans();
  }, [fetchDeletedPlans]);

  return {
    deletedPlans,
    isLoading,
    error,
    moveToBin,
    restore,
    permanentDelete,
    emptyBin,
    refresh,
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Formatuje datę usunięcia z informacją o pozostałym czasie
 */
export function formatDeletedDate(deletedAt: Date): string {
  const now = new Date();
  const daysAgo = Math.floor((now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = AUTO_DELETE_DAYS - daysAgo;

  if (daysLeft <= 0) {
    return 'Wkrótce zostanie usunięty';
  }

  if (daysAgo === 0) {
    return `Dziś • Zostanie usunięty za ${daysLeft} dni`;
  }

  if (daysAgo === 1) {
    return `Wczoraj • Zostanie usunięty za ${daysLeft} dni`;
  }

  return `${daysAgo} dni temu • Zostanie usunięty za ${daysLeft} dni`;
}

export default useTrash;
