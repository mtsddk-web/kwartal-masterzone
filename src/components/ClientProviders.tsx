'use client';

import { ToastProvider } from './effects';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ToastProvider>
      {/* Main content - animations disabled for performance */}
      {children}
    </ToastProvider>
  );
}
