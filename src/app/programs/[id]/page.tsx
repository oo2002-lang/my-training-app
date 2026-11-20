'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Program, Exercise } from '@/lib/types';

export default function ProgramDetailPage() {
  return <Suspense><ProgramDetail /></Suspense>;
}

function ProgramDetail() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [expandedBlock, setExpandedBlock] = useState<number>(0);

  useEffect(() => {
    const p = store.getProgram(params.id as string);
    if (!p) { router.push('/programs'); return; }
    setProgram(p);
    setExercises(store.getExercises());
  }, [params.id, router]);

  if (!program) return null;

  const exName = (id: string) => exercises.find(e => e.id === id)?.name ?? 'Unknown';

  function toggleStatus() {
    const next = program!.status === 'active' ? 'paused' : 'active';
    const updated = { ...program!, status: next as Program['status'] };
    store.saveProgram(updated);
    setProgram(updated);
  }

  function deleteProgram() {
    if (!confirm('Delete this program?')) return;
    store.deleteProgram(program!.id);
    router.push('/programs');
  }

  return (
    <div className="space-y-5">
      <div>
        <button onClick={() => router.push('/programs')} className="text-sm text-blue-400">
          ← Programs
        </button>
        <div className="mt-1 flex items-start justify-between">
          <h1 className="text-xl font-bold">{program.name}</h1>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            program.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {program.status}
          </span>
        </div>
        {program.description && (
          <p className="mt-1 text-sm text-zinc-500">{program.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleStatus}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
        >
          {program.status === 'active' ? 'Pause' : 'Activate'}
        </button>
        <button
          onClick={deleteProgram}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-red-400 hover:bg-zinc-700"
        >
          Delete
        </button>
      </div>

      {program.blocks.map((block, bi) => (
        <div key={block.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <button
            onClick={() => setExpandedBlock(expandedBlock === bi ? -1 : bi)}
            className="flex w-full items-center justify-between p-4"
          >
            <div className="text-left">
              <p className="font-medium">{block.name}</p>
              <p className="text-xs text-zinc-500">
                {block.focus} · {block.numWeeks} weeks
              </p>
            </div>
            <span className="text-zinc-500">{expandedBlock === bi ? '▾' : '▸'}</span>
          </button>

          {expandedBlock === bi && (
            <div className="border-t border-zinc-800 p-4 space-y-4">
              {block.weeks.map(week => (
                <div key={week.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium">
                      Week {week.weekNumber}
                      {week.isDeload && <span className="ml-1 text-amber-400">(Deload)</span>}
                    </p>
                    <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                      week.status === 'active' ? 'bg-green-900/50 text-green-400' :
                      week.status === 'completed' ? 'bg-zinc-700 text-zinc-400' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      {week.status}
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {week.days.map(day => (
                      <div key={day.id} className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">{day.label}</p>
                          <Link
                            href={`/workout/${program.id}/${day.id}`}
                            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-500"
                          >
                            Start
                          </Link>
                        </div>
                        <div className="space-y-0.5">
                          {day.exercises.map(de => (
                            <p key={de.id} className="text-xs text-zinc-400">
                              <span className={
                                de.section === 'main' ? 'text-blue-400' :
                                de.section === 'accessory' ? 'text-zinc-400' : 'text-zinc-600'
                              }>
                                {exName(de.exerciseId)}
                              </span>
                              <span className="text-zinc-600">
                                {' '}— {de.sets.length}×{de.sets[0]?.targetReps ?? 'AMRAP'}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
