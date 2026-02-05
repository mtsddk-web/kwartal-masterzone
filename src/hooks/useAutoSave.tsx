'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface AutoSaveOptions<T> {
  key: string;
  data: T;
  delay?: number;
  onSave?: (data: T) => void;
  onRestore?: (data: T) => void;
}

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

  // Save data to localStorage
  const saveData = useCallback(
    (dataToSave: T) => {
      try {
        const serialized = JSON.stringify({
          data: dataToSave,
          timestamp: new Date().toISOString(),
          version: 1,
        });

        // Only save if data actually changed
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

  // Restore data from localStorage
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

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(key);
    setLastSaved(null);
    previousDataRef.current = undefined;
  }, [key]);

  // Check if saved data exists
  const hasSavedData = useCallback((): boolean => {
    return localStorage.getItem(key) !== null;
  }, [key]);

  // Get saved timestamp
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

  // Auto-save effect with debounce
  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    // Set new timeout
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

// Hook specifically for quarterly plan
export function usePlanAutoSave<T>(plan: T, onChange: (plan: T) => void) {
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const {
    lastSaved,
    isSaving,
    restoreData,
    clearSavedData,
    hasSavedData,
    getSavedTimestamp,
    forceSave,
  } = useAutoSave({
    key: 'masterzone-quarterly-plan',
    data: plan,
    delay: 2000,
    onSave: () => {
      // Could trigger a toast notification here
    },
  });

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

  return {
    lastSaved,
    isSaving,
    showRestorePrompt,
    savedTimestamp: getSavedTimestamp(),
    handleRestore,
    handleDismissRestore,
    formatLastSaved,
    forceSave,
    clearSavedData,
  };
}

// Save indicator component
export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  className = '',
}: {
  isSaving: boolean;
  lastSaved: string | null;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isSaving ? (
        <>
          <div className="w-2 h-2 bg-ember-400 rounded-full animate-pulse" />
          <span className="text-slate-400">Zapisywanie...</span>
        </>
      ) : lastSaved ? (
        <>
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-slate-500">Zapisano {lastSaved}</span>
        </>
      ) : null}
    </div>
  );
}
