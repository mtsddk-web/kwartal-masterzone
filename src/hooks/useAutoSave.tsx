'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import type { QuarterlyPlan } from '@/types/plan';

const STORAGE_KEY = 'masterzone-quarterly-plan';

interface AutoSaveOptions {
  data: QuarterlyPlan;
  delay?: number;
  onSave?: () => void;
  onRestore?: (data: QuarterlyPlan) => void;
}

export function usePlanAutoSave(
  plan: QuarterlyPlan,
  onChange: (plan: QuarterlyPlan) => void
) {
  const { user, loading: authLoading } = useAuth();

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<Date | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>();

  // Save to localStorage (for non-logged users)
  const saveToLocalStorage = useCallback((data: QuarterlyPlan) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: 1,
      }));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Save to Supabase (for logged users)
  const saveToSupabase = useCallback(async (data: QuarterlyPlan) => {
    if (!user || !isSupabaseConfigured()) return false;

    try {
      const supabase = createClient();
      if (!supabase) return false;

      const { error } = await supabase
        .from('quarterly_plans')
        .upsert({
          user_id: user.id,
          quarter: data.quarter,
          year: data.year,
          plan_data: data,
        }, {
          onConflict: 'user_id,quarter,year'
        });

      return !error;
    } catch {
      return false;
    }
  }, [user]);

  // Main save function
  const saveData = useCallback(async (dataToSave: QuarterlyPlan) => {
    const serialized = JSON.stringify(dataToSave);

    // Skip if data unchanged
    if (serialized === previousDataRef.current) {
      setIsSaving(false);
      return;
    }

    previousDataRef.current = serialized;

    let success: boolean;
    if (user) {
      success = await saveToSupabase(dataToSave);
    } else {
      success = saveToLocalStorage(dataToSave);
    }

    if (success) {
      setLastSaved(new Date());
    }
    setIsSaving(false);
  }, [user, saveToSupabase, saveToLocalStorage]);

  // Restore from localStorage
  const restoreFromLocalStorage = useCallback((): QuarterlyPlan | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      setSavedTimestamp(new Date(parsed.timestamp));
      return parsed.data;
    } catch {
      return null;
    }
  }, []);

  // Restore from Supabase
  const restoreFromSupabase = useCallback(async (quarter: string, year: number): Promise<QuarterlyPlan | null> => {
    if (!user || !isSupabaseConfigured()) return null;

    try {
      const supabase = createClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from('quarterly_plans')
        .select('plan_data, updated_at')
        .eq('user_id', user.id)
        .eq('quarter', quarter)
        .eq('year', year)
        .single();

      if (error || !data) return null;

      setSavedTimestamp(new Date(data.updated_at));
      return data.plan_data as QuarterlyPlan;
    } catch {
      return null;
    }
  }, [user]);

  // Check for data and show appropriate prompts on mount
  useEffect(() => {
    if (authLoading || hasRestoredData) return;

    const checkForData = async () => {
      if (user) {
        // Logged in - check Supabase first
        const supabaseData = await restoreFromSupabase(plan.quarter, plan.year);
        const localData = restoreFromLocalStorage();

        if (supabaseData) {
          // Has cloud data - restore it
          onChange(supabaseData);
          setHasRestoredData(true);

          // If also has local data, offer to migrate
          if (localData) {
            setShowMigrationPrompt(true);
          }
        } else if (localData) {
          // Only local data - offer migration
          setShowMigrationPrompt(true);
          setShowRestorePrompt(true);
        } else {
          setHasRestoredData(true);
        }
      } else {
        // Not logged in - check localStorage
        const localData = restoreFromLocalStorage();
        if (localData) {
          setShowRestorePrompt(true);
        } else {
          setHasRestoredData(true);
        }
      }
    };

    checkForData();
  }, [user, authLoading, hasRestoredData, plan.quarter, plan.year, restoreFromSupabase, restoreFromLocalStorage, onChange]);

  // Auto-save with debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    timeoutRef.current = setTimeout(() => {
      saveData(plan);
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [plan, saveData]);

  // Handle restore from prompt
  const handleRestore = useCallback(() => {
    const restored = restoreFromLocalStorage();
    if (restored) {
      onChange(restored);
      setHasRestoredData(true);
    }
    setShowRestorePrompt(false);
  }, [restoreFromLocalStorage, onChange]);

  // Handle dismiss restore
  const handleDismissRestore = useCallback(() => {
    setShowRestorePrompt(false);
    setHasRestoredData(true);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Handle migration from localStorage to Supabase
  const handleMigrate = useCallback(async () => {
    const localData = restoreFromLocalStorage();
    if (localData && user) {
      onChange(localData);
      await saveToSupabase(localData);
      localStorage.removeItem(STORAGE_KEY);
    }
    setShowMigrationPrompt(false);
    setShowRestorePrompt(false);
    setHasRestoredData(true);
  }, [restoreFromLocalStorage, user, saveToSupabase, onChange]);

  // Handle dismiss migration (keep cloud data)
  const handleDismissMigration = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setShowMigrationPrompt(false);
    setShowRestorePrompt(false);
    setHasRestoredData(true);
  }, []);

  // Format last saved time
  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return null;

    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();

    if (diff < 60000) return 'Przed chwilą';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz. temu`;

    return lastSaved.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [lastSaved]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved(null);
    previousDataRef.current = undefined;
  }, []);

  // Force save
  const forceSave = useCallback(() => {
    saveData(plan);
  }, [plan, saveData]);

  return {
    lastSaved,
    isSaving,
    showRestorePrompt,
    showMigrationPrompt,
    savedTimestamp,
    handleRestore,
    handleDismissRestore,
    handleMigrate,
    handleDismissMigration,
    formatLastSaved,
    forceSave,
    clearSavedData,
    isLoggedIn: !!user,
  };
}

// Save indicator component
export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  isLoggedIn = false,
  className = '',
}: {
  isSaving: boolean;
  lastSaved: string | null;
  isLoggedIn?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isSaving ? (
        <>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-slate-400">Zapisywanie...</span>
        </>
      ) : lastSaved ? (
        <>
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-slate-500">
            Zapisano {lastSaved}
            {isLoggedIn && <span className="text-indigo-400 ml-1">(w chmurze)</span>}
          </span>
        </>
      ) : null}
    </div>
  );
}
