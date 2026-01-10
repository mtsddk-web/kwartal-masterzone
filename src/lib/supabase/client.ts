'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Sprawdza czy Supabase jest skonfigurowany
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Tworzy klienta Supabase dla komponentów klienckich
 * Zwraca null jeśli Supabase nie jest skonfigurowany
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - running in offline mode');
    return null;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Typy dla bazy danych
 */
export interface QuarterlyPlanRow {
  id: string;
  user_id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  plan_data: Record<string, unknown>;
  version: number;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanVersionRow {
  id: string;
  plan_id: string;
  version: number;
  plan_data: Record<string, unknown>;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}
