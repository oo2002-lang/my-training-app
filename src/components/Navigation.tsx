'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/programs', label: 'Programs', icon: '📋' },
  { href: '/history', label: 'History', icon: '📊' },
  { href: '/exercises', label: 'Exercises', icon: '💪' },
  { href: '/checkin', label: 'Check-In', icon: '✅' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-1">
        {tabs.map(tab => {
          const active = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors',
                active ? 'text-blue-400' : 'text-zinc-500'
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
