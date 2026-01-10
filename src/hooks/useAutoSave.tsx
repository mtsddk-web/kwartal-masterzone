'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// =============================================================================
// TYPES
// =============================================================================

interface AutoSaveOptions<T> {
  key: string;
  data: T;
  delay?: number;
  onSave?: (data: T) => void;
  onRestore?: (data: T) => void;
}

export type CloudStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
export type LocalStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SyncState {
  localStatus: LocalStatus;
  cloudStatus: CloudStatus;
  lastSyncedAt: Date | null;
  lastLocalSaveAt: Date | null;
  retryCount: number;
  errorMessage: string | null;
}

// Retry delays in ms (exponential backoff)
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000];
const MAX_RETRIES = RETRY_DELAYS.length;

// =============================================================================
// BASIC AUTO-SAVE HOOK (localStorage only)
// =============================================================================

export function useAutoSave<T>({
  key,
  data,
  delay = 1000,
  onSave,
  onRestore,
}: AutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const previousDataRef = useRef<string>();

  const saveData = useCallback(
    (dataToSave: T) => {
      try {
        const serialized = JSON.stringify({
          data: dataToSave,
          timestamp: new Date().toISOString(),
          version: 1,
        });

        if (serialized === previousDataRef.current) return;

        previousDataRef.current = serialized;
        localStorage.setItem(key, serialized);
        setLastSaved(new Date());
        setIsSaving(false);
        onSave?.(dataToSave);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setIsSaving(false);
      }
    },
    [key, onSave]
  );

  const restoreData = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      onRestore?.(parsed.data);
      return parsed.data;
    } catch (error) {
      console.error('Failed to restore data:', error);
      return null;
    }
  }, [key, onRestore]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(key);
    setLastSaved(null);
    previousDataRef.current = undefined;
  }, [key]);

  const hasSavedData = useCallback((): boolean => {
    return localStorage.getItem(key) !== null;
  }, [key]);

  const getSavedTimestamp = useCallback((): Date | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return new Date(parsed.timestamp);
    } catch {
      return null;
    }
  }, [key]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    timeoutRef.current = setTimeout(() => {
      saveData(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, saveData]);

  return {
    lastSaved,
    isSaving,
    restoreData,
    clearSavedData,
    hasSavedData,
    getSavedTimestamp,
    forceSave: () => saveData(data),
  };
}

// =============================================================================
// PLAN AUTO-SAVE WITH SUPABASE SYNC
// =============================================================================

interface PlanAutoSaveOptions {
  planId?: string;
  quarter: string;
  year: number;
  userId?: string;
}

export function usePlanAutoSave<T extends object>(
  plan: T,
  onChange: (plan: T) => void,
  options?: PlanAutoSaveOptions
) {
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  // Sync state
  const [syncState, setSyncState] = useState<SyncState>({
    localStatus: 'idle',
    cloudStatus: isSupabaseConfigured() ? 'idle' : 'offline',
    lastSyncedAt: null,
    lastLocalSaveAt: null,
    retryCount: 0,
    errorMessage: null,
  });

  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const previousPlanRef = useRef<string>();
  const isMountedRef = useRef(true);

  // Check online status
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update cloud status based on online state
  useEffect(() => {
    if (!isOnline && syncState.cloudStatus !== 'offline') {
      setSyncState(prev => ({ ...prev, cloudStatus: 'offline' }));
    }
  }, [isOnline, syncState.cloudStatus]);

  // Basic localStorage save
  const {
    lastSaved,
    isSaving,
    restoreData,
    clearSavedData,
    hasSavedData,
    getSavedTimestamp,
    forceSave: forceLocalSave,
  } = useAutoSave({
    key: 'masterzone-quarterly-plan',
    data: plan,
    delay: 2000,
    onSave: () => {
      setSyncState(prev => ({
        ...prev,
        localStatus: 'saved',
        lastLocalSaveAt: new Date()
      }));
    },
  });

  // Sync to Supabase
  const syncToCloud = useCallback(async (dataToSync: T, retry = false) => {
    if (!isSupabaseConfigured() || !isOnline) {
      setSyncState(prev => ({ ...prev, cloudStatus: 'offline' }));
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setSyncState(prev => ({ ...prev, cloudStatus: 'offline' }));
      return;
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Not logged in - stay in offline mode (localStorage only)
      setSyncState(prev => ({ ...prev, cloudStatus: 'offline' }));
      return;
    }

    setSyncState(prev => ({ ...prev, cloudStatus: 'syncing' }));

    try {
      const quarter = options?.quarter || (dataToSync as { quarter?: string }).quarter || 'Q1';
      const year = options?.year || (dataToSync as { year?: number }).year || new Date().getFullYear();

      // Check if plan exists
      const { data: existingPlan, error: fetchError } = await supabase
        .from('quarterly_plans')
        .select('id, version')
        .eq('user_id', user.id)
        .eq('quarter', quarter)
        .eq('year', year)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingPlan) {
        // Update existing plan
        const { error: updateError } = await supabase
          .from('quarterly_plans')
          .update({
            plan_data: dataToSync,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPlan.id);

        if (updateError) throw updateError;
      } else {
        // Insert new plan
        const { error: insertError } = await supabase
          .from('quarterly_plans')
          .insert({
            user_id: user.id,
            quarter,
            year,
            plan_data: dataToSync,
          });

        if (insertError) throw insertError;
      }

      if (isMountedRef.current) {
        setSyncState(prev => ({
          ...prev,
          cloudStatus: 'synced',
          lastSyncedAt: new Date(),
          retryCount: 0,
          errorMessage: null,
        }));
      }
    } catch (error) {
      console.error('Cloud sync failed:', error);

      if (isMountedRef.current) {
        const currentRetry = retry ? syncState.retryCount : 0;

        if (currentRetry < MAX_RETRIES) {
          // Schedule retry
          const retryDelay = RETRY_DELAYS[currentRetry];
          setSyncState(prev => ({
            ...prev,
            cloudStatus: 'error',
            retryCount: currentRetry + 1,
            errorMessage: `Sync failed. Retrying in ${retryDelay / 1000}s...`,
          }));

          retryTimeoutRef.current = setTimeout(() => {
            syncToCloud(dataToSync, true);
          }, retryDelay);
        } else {
          setSyncState(prev => ({
            ...prev,
            cloudStatus: 'error',
            errorMessage: 'Sync failed after multiple attempts. Data saved locally.',
          }));
        }
      }
    }
  }, [isOnline, options?.quarter, options?.year, syncState.retryCount]);

  // Trigger cloud sync after local save (debounced)
  useEffect(() => {
    if (syncState.localStatus !== 'saved') return;

    const serialized = JSON.stringify(plan);
    if (serialized === previousPlanRef.current) return;
    previousPlanRef.current = serialized;

    // Debounce cloud sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncToCloud(plan);
    }, 3000); // Wait 3s after local save before cloud sync

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [plan, syncState.localStatus, syncToCloud]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  // Check for saved data on mount
  useEffect(() => {
    if (!hasRestoredData && hasSavedData()) {
      setShowRestorePrompt(true);
    }
  }, [hasRestoredData, hasSavedData]);

  const handleRestore = useCallback(() => {
    const restored = restoreData();
    if (restored) {
      onChange(restored);
      setHasRestoredData(true);
    }
    setShowRestorePrompt(false);
  }, [restoreData, onChange]);

  const handleDismissRestore = useCallback(() => {
    setShowRestorePrompt(false);
    setHasRestoredData(true);
    clearSavedData();
  }, [clearSavedData]);

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

  // Manual retry
  const retrySync = useCallback(() => {
    setSyncState(prev => ({ ...prev, retryCount: 0, errorMessage: null }));
    syncToCloud(plan);
  }, [plan, syncToCloud]);

  // Force sync now
  const forceSyncNow = useCallback(() => {
    forceLocalSave();
    syncToCloud(plan);
  }, [forceLocalSave, plan, syncToCloud]);

  return {
    // Local save status
    lastSaved,
    isSaving,
    showRestorePrompt,
    savedTimestamp: getSavedTimestamp(),

    // Cloud sync status
    syncState,
    isOnline,

    // Actions
    handleRestore,
    handleDismissRestore,
    formatLastSaved,
    forceSave: forceLocalSave,
    forceSyncNow,
    retrySync,
    clearSavedData,
  };
}

// =============================================================================
// AUTO-SAVE INDICATOR COMPONENT
// =============================================================================

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: string | null;
  cloudStatus?: CloudStatus;
  onRetry?: () => void;
  className?: string;
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  cloudStatus = 'idle',
  onRetry,
  className = '',
}: AutoSaveIndicatorProps) {
  // Determine what to show
  const getIndicator = () => {
    // Saving locally
    if (isSaving) {
      return {
        dotClass: 'bg-amber-400 animate-pulse',
        text: 'Zapisywanie...',
        textClass: 'text-amber-400',
      };
    }

    // Cloud syncing
    if (cloudStatus === 'syncing') {
      return {
        dotClass: 'bg-blue-400 animate-pulse',
        text: 'Synchronizacja...',
        textClass: 'text-blue-400',
      };
    }

    // Error
    if (cloudStatus === 'error') {
      return {
        dotClass: 'bg-red-400',
        text: 'Błąd synchronizacji',
        textClass: 'text-red-400',
        showRetry: true,
      };
    }

    // Offline
    if (cloudStatus === 'offline') {
      return {
        dotClass: 'bg-yellow-400',
        text: lastSaved ? `Offline - ${lastSaved}` : 'Offline',
        textClass: 'text-yellow-400',
      };
    }

    // Synced
    if (cloudStatus === 'synced' && lastSaved) {
      return {
        dotClass: 'bg-emerald-400',
        text: `Zsynchronizowano ${lastSaved}`,
        textClass: 'text-slate-500',
      };
    }

    // Saved locally only
    if (lastSaved) {
      return {
        dotClass: 'bg-emerald-400',
        text: `Zapisano ${lastSaved}`,
        textClass: 'text-slate-500',
      };
    }

    return null;
  };

  const indicator = getIndicator();
  if (!indicator) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${indicator.dotClass}`} />
      <span className={indicator.textClass}>{indicator.text}</span>
      {indicator.showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-blue-400 hover:text-blue-300 underline ml-1"
        >
          Ponów
        </button>
      )}
    </div>
  );
}
