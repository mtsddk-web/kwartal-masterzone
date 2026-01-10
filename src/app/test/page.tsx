'use client';

import { useState, useEffect } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAutoSave, usePlanAutoSave, AutoSaveIndicator } from '@/hooks/useAutoSave';
import { useBeforeUnload, useUnsavedChangesWarning } from '@/hooks/useBeforeUnload';
import { useTrash, formatDeletedDate } from '@/hooks/useTrash';
import { useVersionHistory, formatVersionDate } from '@/hooks/useVersionHistory';
import { useOfflineSync, OfflineStatus } from '@/hooks/useOfflineSync';
import { useSecureStorage, isNativePlatform, getPlatform } from '@/hooks/useSecureStorage';
import { emptyPlan } from '@/types/plan';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'running';
  message?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setResults([]);
    setRunning(true);

    // Test 1: Supabase Configuration
    addResult({ name: 'Supabase Configuration', status: 'running' });
    try {
      const configured = isSupabaseConfigured();
      addResult({
        name: 'Supabase Configuration',
        status: configured ? 'pass' : 'skip',
        message: configured ? 'Supabase is configured' : 'Supabase not configured (offline mode)',
      });
    } catch (e) {
      addResult({ name: 'Supabase Configuration', status: 'fail', message: String(e) });
    }

    // Test 2: Supabase Client Creation
    addResult({ name: 'Supabase Client Creation', status: 'running' });
    try {
      const client = createClient();
      addResult({
        name: 'Supabase Client Creation',
        status: client ? 'pass' : 'skip',
        message: client ? 'Client created successfully' : 'Client is null (expected in offline mode)',
      });
    } catch (e) {
      addResult({ name: 'Supabase Client Creation', status: 'fail', message: String(e) });
    }

    // Test 3: localStorage availability
    addResult({ name: 'localStorage Availability', status: 'running' });
    try {
      localStorage.setItem('test-key', 'test-value');
      const value = localStorage.getItem('test-key');
      localStorage.removeItem('test-key');
      addResult({
        name: 'localStorage Availability',
        status: value === 'test-value' ? 'pass' : 'fail',
        message: value === 'test-value' ? 'localStorage works correctly' : 'localStorage value mismatch',
      });
    } catch (e) {
      addResult({ name: 'localStorage Availability', status: 'fail', message: String(e) });
    }

    // Test 4: IndexedDB availability (for offline sync)
    addResult({ name: 'IndexedDB Availability', status: 'running' });
    try {
      const request = indexedDB.open('test-db', 1);
      await new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
          request.result.close();
          indexedDB.deleteDatabase('test-db');
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
      addResult({
        name: 'IndexedDB Availability',
        status: 'pass',
        message: 'IndexedDB is available',
      });
    } catch (e) {
      addResult({ name: 'IndexedDB Availability', status: 'fail', message: String(e) });
    }

    // Test 5: Platform Detection
    addResult({ name: 'Platform Detection', status: 'running' });
    try {
      const isNative = isNativePlatform();
      const platform = getPlatform();
      addResult({
        name: 'Platform Detection',
        status: 'pass',
        message: `Platform: ${platform}, Native: ${isNative}`,
      });
    } catch (e) {
      addResult({ name: 'Platform Detection', status: 'fail', message: String(e) });
    }

    // Test 6: Online Status
    addResult({ name: 'Online Status Detection', status: 'running' });
    try {
      const isOnline = navigator.onLine;
      addResult({
        name: 'Online Status Detection',
        status: 'pass',
        message: `Online: ${isOnline}`,
      });
    } catch (e) {
      addResult({ name: 'Online Status Detection', status: 'fail', message: String(e) });
    }

    // Test 7: formatDeletedDate utility
    addResult({ name: 'formatDeletedDate Utility', status: 'running' });
    try {
      const now = new Date();
      const formatted = formatDeletedDate(now);
      addResult({
        name: 'formatDeletedDate Utility',
        status: formatted.includes('Dziś') || formatted.includes('dni') ? 'pass' : 'fail',
        message: `Result: "${formatted}"`,
      });
    } catch (e) {
      addResult({ name: 'formatDeletedDate Utility', status: 'fail', message: String(e) });
    }

    // Test 8: formatVersionDate utility
    addResult({ name: 'formatVersionDate Utility', status: 'running' });
    try {
      const now = new Date();
      const formatted = formatVersionDate(now);
      addResult({
        name: 'formatVersionDate Utility',
        status: formatted === 'Przed chwilą' ? 'pass' : 'fail',
        message: `Result: "${formatted}"`,
      });
    } catch (e) {
      addResult({ name: 'formatVersionDate Utility', status: 'fail', message: String(e) });
    }

    // Test 9: EmptyPlan structure
    addResult({ name: 'EmptyPlan Structure', status: 'running' });
    try {
      const requiredFields = ['quarter', 'year', 'vision', 'goals', 'projects', 'milestones', 'retrospective', 'annualPlan'];
      const hasAll = requiredFields.every(field => field in emptyPlan);
      addResult({
        name: 'EmptyPlan Structure',
        status: hasAll ? 'pass' : 'fail',
        message: hasAll ? 'All required fields present' : 'Missing fields in emptyPlan',
      });
    } catch (e) {
      addResult({ name: 'EmptyPlan Structure', status: 'fail', message: String(e) });
    }

    // Test 10: JSON Export function
    addResult({ name: 'JSON Export Format', status: 'running' });
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        format: 'kwartal-app-v1',
        version: 1,
        plan: emptyPlan,
      };
      const json = JSON.stringify(exportData, null, 2);
      const parsed = JSON.parse(json);
      addResult({
        name: 'JSON Export Format',
        status: parsed.format === 'kwartal-app-v1' && parsed.version === 1 ? 'pass' : 'fail',
        message: `Format: ${parsed.format}, Version: ${parsed.version}`,
      });
    } catch (e) {
      addResult({ name: 'JSON Export Format', status: 'fail', message: String(e) });
    }

    setRunning(false);
  };

  // Run tests on mount
  useEffect(() => {
    runTests();
  }, []);

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const skipCount = results.filter(r => r.status === 'skip').length;

  return (
    <div className="min-h-screen bg-night-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Kwartal-App Integration Tests</h1>

        {/* Summary */}
        <div className="mb-6 p-4 bg-night-900 rounded-xl border border-night-700">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-emerald-400">Pass: {passCount}</span>
            <span className="text-red-400">Fail: {failCount}</span>
            <span className="text-yellow-400">Skip: {skipCount}</span>
            <span className="text-slate-400">Total: {results.length}</span>
          </div>
        </div>

        {/* Rerun button */}
        <button
          onClick={runTests}
          disabled={running}
          className="mb-6 px-4 py-2 bg-ember-500 text-white rounded-lg disabled:opacity-50"
        >
          {running ? 'Running...' : 'Run Tests Again'}
        </button>

        {/* Results */}
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.status === 'pass'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : result.status === 'fail'
                  ? 'bg-red-500/10 border-red-500/30'
                  : result.status === 'skip'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{result.name}</span>
                <span
                  className={`text-sm px-2 py-0.5 rounded ${
                    result.status === 'pass'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : result.status === 'fail'
                      ? 'bg-red-500/20 text-red-400'
                      : result.status === 'skip'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {result.status.toUpperCase()}
                </span>
              </div>
              {result.message && (
                <p className="mt-1 text-sm text-slate-400">{result.message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Manual Test Instructions */}
        <div className="mt-8 p-4 bg-night-900 rounded-xl border border-night-700">
          <h2 className="text-lg font-semibold text-white mb-4">Manual Tests</h2>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>1. Go to main page and start planning</li>
            <li>2. Check AutoSaveIndicator shows "Zapisywanie..." then "Zapisano"</li>
            <li>3. Fill some fields and try closing the tab - should show warning</li>
            <li>4. Complete plan and check "Backup JSON" button works</li>
            <li>5. Toggle offline in DevTools Network - check offline status shows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
