'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // We need to keep a reference for the cleanup function
    let subscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      // Get initial session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);

      // Listen for auth changes
      const { data: authData } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, sess: Session | null) => {
        setSession(sess);
        setUser(sess?.user ?? null);
        setLoading(false);
      });
      subscription = authData.subscription;
    };

    initAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, [configured]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!configured) {
        return { error: 'Supabase nie jest skonfigurowane' };
      }
      const supabase = createClient();
      if (!supabase) {
        return { error: 'Nie można połączyć z serwerem' };
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    },
    [configured]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!configured) {
        return { error: 'Supabase nie jest skonfigurowane' };
      }
      const supabase = createClient();
      if (!supabase) {
        return { error: 'Nie można połączyć z serwerem' };
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error?.message ?? null };
    },
    [configured]
  );

  const signOut = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [configured]);

  const resetPassword = useCallback(
    async (email: string) => {
      if (!configured) {
        return { error: 'Supabase nie jest skonfigurowane' };
      }
      const supabase = createClient();
      if (!supabase) {
        return { error: 'Nie można połączyć z serwerem' };
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      return { error: error?.message ?? null };
    },
    [configured]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configured,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
