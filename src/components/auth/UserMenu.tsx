'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-night-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg transition-colors"
      >
        Zaloguj się
      </Link>
    );
  }

  const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-night-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {userInitial}
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-night-800 border border-night-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-night-700">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-slate-400">Konto MasterZone</p>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-night-700 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historia planów
            </Link>
          </div>

          {/* Sign out */}
          <div className="py-2 border-t border-night-700">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Wyloguj się
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
