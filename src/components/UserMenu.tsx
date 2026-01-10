'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-lg bg-night-800/50 animate-pulse"></div>
    );
  }

  // Not logged in - show login button
  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-night-700 hover:border-night-600 rounded-xl transition-colors"
      >
        Zaloguj się
      </Link>
    );
  }

  // Logged in - show user menu
  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-night-800/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-night-900 border border-night-700 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-night-700/50">
              <p className="text-sm font-medium text-white truncate">
                {user.user_metadata?.full_name || 'Użytkownik'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-night-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </Link>

              <Link
                href="/trash"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-night-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Kosz
              </Link>

              <div className="my-2 border-t border-night-700/50"></div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Wyloguj się
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
