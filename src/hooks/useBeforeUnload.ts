'use client';

import { useEffect, useCallback } from 'react';

/**
 * Hook ostrzegający użytkownika przed opuszczeniem strony z niezapisanymi zmianami.
 *
 * @param hasUnsavedChanges - czy są niezapisane zmiany
 * @param message - opcjonalna wiadomość (większość przeglądarek ignoruje custom message)
 */
export function useBeforeUnload(
  hasUnsavedChanges: boolean,
  message?: string
) {
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Większość nowoczesnych przeglądarek ignoruje custom message
        // ale returnValue jest wymagane dla kompatybilności
        e.returnValue = message || 'Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?';
        return e.returnValue;
      }
    },
    [hasUnsavedChanges, message]
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);
}

/**
 * Hook dla Next.js App Router - ostrzega przed nawigacją wewnątrz aplikacji
 * Używa window.history i popstate
 */
export function useNavigationWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Obsługa przycisku wstecz
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm(
          'Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?'
        );
        if (!confirmed) {
          // Wróć do aktualnej strony
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Dodaj stan do historii żeby przechwycić przycisk wstecz
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);
}

/**
 * Połączony hook - ostrzega zarówno przed zamknięciem karty jak i nawigacją
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useBeforeUnload(hasUnsavedChanges);
  useNavigationWarning(hasUnsavedChanges);
}

export default useBeforeUnload;
