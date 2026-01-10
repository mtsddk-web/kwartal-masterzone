'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// =============================================================================
// TYPES
// =============================================================================

export interface PlanVersion {
  id: string;
  planId: string;
  version: number;
  planData: Record<string, unknown>;
  createdAt: Date;
}

interface UseVersionHistoryReturn {
  versions: PlanVersion[];
  isLoading: boolean;
  error: string | null;
  currentVersion: number | null;
  createVersion: (planData: Record<string, unknown>) => Promise<boolean>;
  restoreVersion: (versionId: string) => Promise<Record<string, unknown> | null>;
  getVersions: () => Promise<void>;
}

// Automatyczne tworzenie wersji co 10 minut
const AUTO_VERSION_INTERVAL = 10 * 60 * 1000;

// Maksymalna liczba wersji do przechowywania
const MAX_VERSIONS = 50;

// =============================================================================
// HOOK
// =============================================================================

export function useVersionHistory(
  planId: string | undefined,
  currentPlanData?: Record<string, unknown>
): UseVersionHistoryReturn {
  const [versions, setVersions] = useState<PlanVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);

  const lastVersionDataRef = useRef<string | null>(null);
  const autoVersionTimerRef = useRef<NodeJS.Timeout>();

  // Pobierz historię wersji
  const getVersions = useCallback(async () => {
    if (!planId || !isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('plan_versions')
        .select('*')
        .eq('plan_id', planId)
        .order('version', { ascending: false })
        .limit(MAX_VERSIONS);

      if (fetchError) throw fetchError;

      const versionsList: PlanVersion[] = (data || []).map((row) => ({
        id: row.id,
        planId: row.plan_id,
        version: row.version,
        planData: row.plan_data,
        createdAt: new Date(row.created_at),
      }));

      setVersions(versionsList);

      if (versionsList.length > 0) {
        setCurrentVersion(versionsList[0].version);
      }
    } catch (err) {
      console.error('Error fetching versions:', err);
      setError('Nie udało się pobrać historii wersji');
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  // Utwórz nową wersję
  const createVersion = useCallback(async (
    planData: Record<string, unknown>
  ): Promise<boolean> => {
    if (!planId || !isSupabaseConfigured()) {
      return false;
    }

    // Sprawdź czy dane się zmieniły od ostatniej wersji
    const serialized = JSON.stringify(planData);
    if (serialized === lastVersionDataRef.current) {
      return true; // Bez zmian, nie tworzymy wersji
    }

    const supabase = createClient();
    if (!supabase) return false;

    try {
      // Pobierz aktualny numer wersji
      const { data: latestVersion } = await supabase
        .from('plan_versions')
        .select('version')
        .eq('plan_id', planId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      const newVersion = (latestVersion?.version || 0) + 1;

      // Wstaw nową wersję
      const { error: insertError } = await supabase
        .from('plan_versions')
        .insert({
          plan_id: planId,
          version: newVersion,
          plan_data: planData,
        });

      if (insertError) throw insertError;

      lastVersionDataRef.current = serialized;
      setCurrentVersion(newVersion);

      // Usuń stare wersje jeśli przekroczono limit
      await cleanupOldVersions(supabase, planId);

      // Odśwież listę
      await getVersions();

      return true;
    } catch (err) {
      console.error('Error creating version:', err);
      setError('Nie udało się utworzyć wersji');
      return false;
    }
  }, [planId, getVersions]);

  // Usuń stare wersje
  const cleanupOldVersions = async (
    supabase: ReturnType<typeof createClient>,
    planId: string
  ) => {
    if (!supabase) return;

    try {
      // Pobierz wersje do usunięcia
      const { data: oldVersions } = await supabase
        .from('plan_versions')
        .select('id')
        .eq('plan_id', planId)
        .order('version', { ascending: false })
        .range(MAX_VERSIONS, MAX_VERSIONS + 100);

      if (oldVersions && oldVersions.length > 0) {
        const idsToDelete = oldVersions.map((v) => v.id);
        await supabase
          .from('plan_versions')
          .delete()
          .in('id', idsToDelete);
      }
    } catch (err) {
      console.error('Error cleaning up old versions:', err);
    }
  };

  // Przywróć wersję
  const restoreVersion = useCallback(async (
    versionId: string
  ): Promise<Record<string, unknown> | null> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase nie jest skonfigurowany');
      return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('plan_versions')
        .select('plan_data')
        .eq('id', versionId)
        .single();

      if (fetchError) throw fetchError;

      return data?.plan_data || null;
    } catch (err) {
      console.error('Error restoring version:', err);
      setError('Nie udało się przywrócić wersji');
      return null;
    }
  }, []);

  // Automatyczne wersjonowanie
  useEffect(() => {
    if (!planId || !currentPlanData || !isSupabaseConfigured()) {
      return;
    }

    // Wyczyść poprzedni timer
    if (autoVersionTimerRef.current) {
      clearInterval(autoVersionTimerRef.current);
    }

    // Ustaw nowy timer
    autoVersionTimerRef.current = setInterval(() => {
      createVersion(currentPlanData);
    }, AUTO_VERSION_INTERVAL);

    return () => {
      if (autoVersionTimerRef.current) {
        clearInterval(autoVersionTimerRef.current);
      }
    };
  }, [planId, currentPlanData, createVersion]);

  // Pobierz wersje przy montowaniu
  useEffect(() => {
    if (planId) {
      getVersions();
    }
  }, [planId, getVersions]);

  // Twórz wersję przy wyjściu (beforeunload)
  useEffect(() => {
    if (!planId || !currentPlanData) return;

    const handleBeforeUnload = () => {
      // Sync version creation - może nie zadziałać ze względu na ograniczenia przeglądarki
      createVersion(currentPlanData);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [planId, currentPlanData, createVersion]);

  return {
    versions,
    isLoading,
    error,
    currentVersion,
    createVersion,
    restoreVersion,
    getVersions,
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Formatuje datę wersji
 */
export function formatVersionDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Przed chwilą';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz. temu`;

  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Porównuje dwie wersje i zwraca różnice (uproszczone)
 */
export function getVersionDiff(
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>
): string[] {
  const changes: string[] = [];

  const checkDiff = (obj1: unknown, obj2: unknown, path: string) => {
    if (typeof obj1 !== typeof obj2) {
      changes.push(`Zmieniono: ${path}`);
      return;
    }

    if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
      const keys = new Set([
        ...Object.keys(obj1 as Record<string, unknown>),
        ...Object.keys(obj2 as Record<string, unknown>),
      ]);

      keys.forEach((key) => {
        const val1 = (obj1 as Record<string, unknown>)[key];
        const val2 = (obj2 as Record<string, unknown>)[key];
        checkDiff(val1, val2, path ? `${path}.${key}` : key);
      });
    } else if (obj1 !== obj2) {
      changes.push(`Zmieniono: ${path}`);
    }
  };

  checkDiff(oldData, newData, '');
  return changes.slice(0, 5); // Limit do 5 zmian
}

export default useVersionHistory;
