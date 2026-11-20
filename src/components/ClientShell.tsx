'use client';

import { Suspense, useEffect } from 'react';
import { store } from '@/lib/store';
import Navigation from './Navigation';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.init();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <>
      <main className="mx-auto w-full max-w-lg px-4 pb-24 pt-4">
        {children}
      </main>
      <Suspense>
        <Navigation />
      </Suspense>
    </>
  );
}
