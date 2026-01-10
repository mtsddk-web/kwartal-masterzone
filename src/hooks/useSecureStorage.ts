'use client';

import { useState, useCallback, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface SecureStorageInterface {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  keys: () => Promise<string[]>;
}

interface UseSecureStorageReturn<T> {
  value: T | null;
  isLoading: boolean;
  error: string | null;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  refresh: () => Promise<void>;
}

// =============================================================================
// SECURE STORAGE IMPLEMENTATION
// =============================================================================

/**
 * Sprawdza czy aplikacja działa na platformie natywnej (iOS/Android)
 */
export function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false;

  // Sprawdź czy Capacitor jest dostępny
  const win = window as typeof window & {
    Capacitor?: {
      isNativePlatform: () => boolean;
      getPlatform: () => string;
    };
  };

  return win.Capacitor?.isNativePlatform?.() ?? false;
}

/**
 * Pobiera platformę
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';

  const win = window as typeof window & {
    Capacitor?: {
      getPlatform: () => string;
    };
  };

  const platform = win.Capacitor?.getPlatform?.();
  if (platform === 'ios') return 'ios';
  if (platform === 'android') return 'android';
  return 'web';
}

// Interfejs pluginu Capacitor (różni się od naszego SecureStorageInterface)
interface CapacitorSecureStoragePlugin {
  get(options: { key: string }): Promise<{ value: string }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<{ value: string[] }>;
}

/**
 * Dynamicznie importuje SecureStoragePlugin (tylko na platformach natywnych)
 * Zwraca null jeśli plugin nie jest dostępny
 */
async function getSecureStoragePlugin(): Promise<CapacitorSecureStoragePlugin | null> {
  try {
    // Używamy webpack magic comment aby uniknąć bundlowania na webie
    const module = await import(
      /* webpackIgnore: true */
      'capacitor-secure-storage-plugin'
    );
    return module.SecureStoragePlugin as CapacitorSecureStoragePlugin;
  } catch {
    return null;
  }
}

/**
 * Implementacja secure storage
 * Na platformach natywnych używa SecureStoragePlugin z Capacitor
 * Na webie używa localStorage z prostym szyfrowaniem
 */
const createSecureStorage = (): SecureStorageInterface => {
  const isNative = isNativePlatform();

  // Na natywnej platformie próbuj użyć Capacitor Secure Storage
  if (isNative) {
    return {
      async get(key: string): Promise<string | null> {
        try {
          const plugin = await getSecureStoragePlugin();
          if (plugin) {
            const result = await plugin.get({ key });
            return result.value;
          }
          // Fallback do localStorage jeśli plugin niedostępny
          return localStorage.getItem('kwartal_secure_' + key);
        } catch {
          return null;
        }
      },

      async set(key: string, value: string): Promise<void> {
        try {
          const plugin = await getSecureStoragePlugin();
          if (plugin) {
            await plugin.set({ key, value });
            return;
          }
        } catch {
          // ignore
        }
        // Fallback
        localStorage.setItem('kwartal_secure_' + key, value);
      },

      async remove(key: string): Promise<void> {
        try {
          const plugin = await getSecureStoragePlugin();
          if (plugin) {
            await plugin.remove({ key });
            return;
          }
        } catch {
          // ignore
        }
        localStorage.removeItem('kwartal_secure_' + key);
      },

      async clear(): Promise<void> {
        try {
          const plugin = await getSecureStoragePlugin();
          if (plugin) {
            await plugin.clear();
            return;
          }
        } catch {
          // ignore
        }
        // Clear localStorage fallback
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k?.startsWith('kwartal_secure_')) keysToRemove.push(k);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      },

      async keys(): Promise<string[]> {
        try {
          const plugin = await getSecureStoragePlugin();
          if (plugin) {
            const result = await plugin.keys();
            return result.value;
          }
        } catch {
          // ignore
        }
        // Fallback
        const result: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k?.startsWith('kwartal_secure_')) result.push(k.replace('kwartal_secure_', ''));
        }
        return result;
      },
    };
  }

  // Na webie użyj localStorage z prostą obfuskacją
  // UWAGA: To nie jest prawdziwe szyfrowanie, tylko zaciemnienie
  const PREFIX = 'kwartal_secure_';

  const obfuscate = (value: string): string => {
    // Prosta obfuskacja Base64
    return btoa(encodeURIComponent(value));
  };

  const deobfuscate = (value: string): string => {
    try {
      return decodeURIComponent(atob(value));
    } catch {
      return value;
    }
  };

  return {
    async get(key: string): Promise<string | null> {
      const stored = localStorage.getItem(PREFIX + key);
      if (!stored) return null;
      return deobfuscate(stored);
    },

    async set(key: string, value: string): Promise<void> {
      localStorage.setItem(PREFIX + key, obfuscate(value));
    },

    async remove(key: string): Promise<void> {
      localStorage.removeItem(PREFIX + key);
    },

    async clear(): Promise<void> {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    },

    async keys(): Promise<string[]> {
      const result: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) {
          result.push(key.replace(PREFIX, ''));
        }
      }
      return result;
    },
  };
};

// Singleton instance
let storageInstance: SecureStorageInterface | null = null;

const getStorage = (): SecureStorageInterface => {
  if (!storageInstance) {
    storageInstance = createSecureStorage();
  }
  return storageInstance;
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook do bezpiecznego przechowywania danych
 * Automatycznie używa odpowiedniej implementacji zależnie od platformy
 */
export function useSecureStorage<T>(key: string): UseSecureStorageReturn<T> {
  const [value, setValue] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storage = getStorage();

  // Load initial value
  const loadValue = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = await storage.get(key);
      if (stored) {
        setValue(JSON.parse(stored) as T);
      } else {
        setValue(null);
      }
    } catch (err) {
      console.error('Error loading secure storage:', err);
      setError('Nie udało się odczytać danych');
      setValue(null);
    } finally {
      setIsLoading(false);
    }
  }, [key, storage]);

  // Save value
  const saveValue = useCallback(async (newValue: T) => {
    setError(null);

    try {
      await storage.set(key, JSON.stringify(newValue));
      setValue(newValue);
    } catch (err) {
      console.error('Error saving to secure storage:', err);
      setError('Nie udało się zapisać danych');
      throw err;
    }
  }, [key, storage]);

  // Remove value
  const removeValue = useCallback(async () => {
    setError(null);

    try {
      await storage.remove(key);
      setValue(null);
    } catch (err) {
      console.error('Error removing from secure storage:', err);
      setError('Nie udało się usunąć danych');
      throw err;
    }
  }, [key, storage]);

  // Refresh
  const refresh = useCallback(async () => {
    await loadValue();
  }, [loadValue]);

  // Initial load
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  return {
    value,
    isLoading,
    error,
    setValue: saveValue,
    removeValue,
    refresh,
  };
}

// =============================================================================
// AUTH TOKEN STORAGE
// =============================================================================

const AUTH_TOKEN_KEY = 'auth_session';

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

/**
 * Hook specjalnie do przechowywania sesji auth
 */
export function useSecureAuthStorage() {
  const { value, isLoading, error, setValue, removeValue, refresh } =
    useSecureStorage<AuthSession>(AUTH_TOKEN_KEY);

  const saveSession = useCallback(async (session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    user?: { id: string };
  }) => {
    await setValue({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at || Date.now() + 3600000,
      userId: session.user?.id || '',
    });
  }, [setValue]);

  const clearSession = useCallback(async () => {
    await removeValue();
  }, [removeValue]);

  const isSessionValid = useCallback(() => {
    if (!value) return false;
    return value.expiresAt > Date.now();
  }, [value]);

  return {
    session: value,
    isLoading,
    error,
    saveSession,
    clearSession,
    isSessionValid,
    refresh,
  };
}

// =============================================================================
// SENSITIVE DATA STORAGE
// =============================================================================

const SENSITIVE_DATA_KEY = 'sensitive_plan_data';

/**
 * Hook do przechowywania wrażliwych danych planu
 * Używane gdy plan zawiera prywatne informacje biznesowe
 */
export function useSensitivePlanStorage() {
  const { value, isLoading, error, setValue, removeValue, refresh } =
    useSecureStorage<Record<string, unknown>>(SENSITIVE_DATA_KEY);

  const saveSensitiveData = useCallback(async (
    planId: string,
    data: Record<string, unknown>
  ) => {
    const current = value || {};
    await setValue({
      ...current,
      [planId]: data,
    });
  }, [value, setValue]);

  const getSensitiveData = useCallback((planId: string): Record<string, unknown> | null => {
    if (!value) return null;
    return (value[planId] as Record<string, unknown>) || null;
  }, [value]);

  const removeSensitiveData = useCallback(async (planId: string) => {
    if (!value) return;
    const updated = { ...value };
    delete updated[planId];
    await setValue(updated);
  }, [value, setValue]);

  return {
    isLoading,
    error,
    saveSensitiveData,
    getSensitiveData,
    removeSensitiveData,
    clearAll: removeValue,
    refresh,
  };
}

export default useSecureStorage;
