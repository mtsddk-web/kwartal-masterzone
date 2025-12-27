'use client';

import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        // Allow certain shortcuts even in inputs
        if (!e.ctrlKey && !e.metaKey) return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl
          ? e.ctrlKey || e.metaKey
          : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for navigation shortcuts
export function useNavigationShortcuts({
  onNext,
  onPrev,
  onSave,
  totalSteps,
  currentStep,
}: {
  onNext: () => void;
  onPrev: () => void;
  onSave?: () => void;
  totalSteps: number;
  currentStep: number;
}) {
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'ArrowRight',
      action: () => {
        if (currentStep < totalSteps - 1) onNext();
      },
      description: 'Następny krok',
    },
    {
      key: 'ArrowLeft',
      action: () => {
        if (currentStep > 0) onPrev();
      },
      description: 'Poprzedni krok',
    },
    {
      key: 'Enter',
      ctrl: true,
      action: onNext,
      description: 'Zatwierdź i dalej',
    },
  ];

  if (onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      action: onSave,
      description: 'Zapisz plan',
    });
  }

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}
