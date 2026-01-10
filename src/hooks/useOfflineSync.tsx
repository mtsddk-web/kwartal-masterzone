'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// =============================================================================
// TYPES
// =============================================================================

export interface OfflinePlanChange {
  id: string;
  planId: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: number;
  synced: boolean;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline' | 'pending';

interface UseOfflineSyncReturn {
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingChanges: number;
  lastSyncedAt: Date | null;
  error: string | null;
  queueChange: (planId: string, operation: 'create' | 'update' | 'delete', data: Record<string, unknown>) => Promise<void>;
  syncNow: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

// IndexedDB config
const DB_NAME = 'kwartal-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-changes';

// =============================================================================
// INDEXEDDB HELPERS
// =============================================================================

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('synced', 'synced');
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
};

const addToQueue = async (change: OfflinePlanChange): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(change);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
};

const getPendingChanges = async (): Promise<OfflinePlanChange[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.getAll(IDBKeyRange.only(false));
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    tx.oncomplete = () => db.close();
  });
};

const markAsSynced = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.synced = true;
        store.put(data);
      }
      resolve();
    };
    getRequest.onerror = () => reject(getRequest.error);
    tx.oncomplete = () => db.close();
  });
};

const clearSyncedChanges = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.openCursor(IDBKeyRange.only(true));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
  });
};

const clearAllChanges = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
};

// =============================================================================
// HOOK
// =============================================================================

export function useOfflineSync(): UseOfflineSyncReturn {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSyncingRef = useRef(false);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync po przywróceniu połączenia
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Refresh pending count
  const refreshPendingCount = useCallback(async () => {
    try {
      const pending = await getPendingChanges();
      setPendingChanges(pending.length);
      if (pending.length > 0 && isOnline) {
        setSyncStatus('pending');
      }
    } catch (err) {
      console.error('Error getting pending changes:', err);
    }
  }, [isOnline]);

  // Initial load
  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // Sync pending changes
  const syncPendingChanges = useCallback(async () => {
    if (!isOnline || isSyncingRef.current || !isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSyncStatus('offline');
        return;
      }

      const pending = await getPendingChanges();
      if (pending.length === 0) {
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
        return;
      }

      // Sort by timestamp
      pending.sort((a, b) => a.timestamp - b.timestamp);

      for (const change of pending) {
        try {
          switch (change.operation) {
            case 'create':
              await supabase
                .from('quarterly_plans')
                .insert({
                  ...change.data,
                  user_id: user.id,
                });
              break;

            case 'update':
              await supabase
                .from('quarterly_plans')
                .update(change.data)
                .eq('id', change.planId)
                .eq('user_id', user.id);
              break;

            case 'delete':
              await supabase
                .from('quarterly_plans')
                .update({
                  is_deleted: true,
                  deleted_at: new Date().toISOString(),
                })
                .eq('id', change.planId)
                .eq('user_id', user.id);
              break;
          }

          await markAsSynced(change.id);
        } catch (changeErr) {
          console.error(`Error syncing change ${change.id}:`, changeErr);
          // Continue with other changes
        }
      }

      // Clear synced changes
      await clearSyncedChanges();
      await refreshPendingCount();

      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('Sync error:', err);
      setError('Błąd synchronizacji');
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [isOnline, refreshPendingCount]);

  // Queue a change for sync
  const queueChange = useCallback(async (
    planId: string,
    operation: 'create' | 'update' | 'delete',
    data: Record<string, unknown>
  ) => {
    const change: OfflinePlanChange = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      planId,
      operation,
      data,
      timestamp: Date.now(),
      synced: false,
    };

    try {
      await addToQueue(change);
      await refreshPendingCount();

      // Try to sync immediately if online
      if (isOnline) {
        await syncPendingChanges();
      }
    } catch (err) {
      console.error('Error queuing change:', err);
      setError('Nie udało się zapisać zmiany');
    }
  }, [isOnline, refreshPendingCount, syncPendingChanges]);

  // Manual sync
  const syncNow = useCallback(async () => {
    await syncPendingChanges();
  }, [syncPendingChanges]);

  // Clear queue
  const clearQueue = useCallback(async () => {
    try {
      await clearAllChanges();
      setPendingChanges(0);
      setSyncStatus('idle');
    } catch (err) {
      console.error('Error clearing queue:', err);
    }
  }, []);

  // Auto-sync interval
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      syncPendingChanges();
    }, 30000); // Co 30 sekund

    return () => clearInterval(interval);
  }, [isOnline, syncPendingChanges]);

  return {
    isOnline,
    syncStatus,
    pendingChanges,
    lastSyncedAt,
    error,
    queueChange,
    syncNow,
    clearQueue,
  };
}

// =============================================================================
// OFFLINE STATUS COMPONENT
// =============================================================================

interface OfflineStatusProps {
  isOnline: boolean;
  pendingChanges: number;
  syncStatus: SyncStatus;
  onSync?: () => void;
  className?: string;
}

export function OfflineStatus({
  isOnline,
  pendingChanges,
  syncStatus,
  onSync,
  className = '',
}: OfflineStatusProps) {
  if (isOnline && syncStatus === 'synced' && pendingChanges === 0) {
    return null; // Nie pokazuj nic gdy wszystko OK
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!isOnline ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-sm rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          <span>Tryb offline</span>
          {pendingChanges > 0 && (
            <span className="px-1.5 py-0.5 bg-yellow-500/30 rounded text-xs">
              {pendingChanges} do synchronizacji
            </span>
          )}
        </div>
      ) : syncStatus === 'syncing' ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Synchronizacja...</span>
        </div>
      ) : syncStatus === 'pending' && pendingChanges > 0 ? (
        <button
          onClick={onSync}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg hover:bg-amber-500/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Synchronizuj ({pendingChanges})</span>
        </button>
      ) : syncStatus === 'error' ? (
        <button
          onClick={onSync}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Błąd - ponów</span>
        </button>
      ) : null}
    </div>
  );
}

export default useOfflineSync;
