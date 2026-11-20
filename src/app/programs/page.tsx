'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Program } from '@/lib/types';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrograms(store.getPrograms());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Programs</h1>
        <Link
          href="/programs/builder"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          + New
        </Link>
      </div>

      {programs.length === 0 ? (
        <p className="text-sm text-zinc-500">No programs yet.</p>
      ) : (
        <div className="space-y-3">
          {programs.map(p => (
            <Link
              key={p.id}
              href={`/programs/${p.id}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  {p.description && (
                    <p className="mt-0.5 text-sm text-zinc-500 line-clamp-2">{p.description}</p>
                  )}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  p.status === 'active' ? 'bg-green-900/50 text-green-400' :
                  p.status === 'paused' ? 'bg-amber-900/50 text-amber-400' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className={`rounded px-1.5 py-0.5 ${
                  p.sport === 'long_jump' ? 'bg-purple-900/40 text-purple-400' :
                  p.sport === 'cb_football' ? 'bg-blue-900/40 text-blue-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {p.sport === 'long_jump' ? '🏃 Long Jump' : p.sport === 'cb_football' ? '🏈 CB Football' : '🏃🏈 Dual-Sport'}
                </span>
                <span>{p.blocks.reduce((sum, b) => sum + b.weeks.length, 0)} weeks</span>
                <span>{p.blocks[0]?.weeks[0]?.days.length ?? 0} days/week</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
