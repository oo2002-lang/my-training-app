'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Session, Exercise, E1RMRecord, PRRecord } from '@/lib/types';
import { formatDate, formatWeight } from '@/lib/utils';
import { getE1RMTrend } from '@/lib/e1rm';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prs, setPrs] = useState<PRRecord[]>([]);
  const [settings] = useState(() => store.getSettings());
  const [view, setView] = useState<'sessions' | 'prs'>('sessions');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(
      [...store.getSessions()].sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    );
    setExercises(store.getExercises());
    setPrs(store.getPRs());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const exName = (id: string) => exercises.find(e => e.id === id)?.name ?? 'Unknown';
  const getEx = (id: string) => exercises.find(e => e.id === id);

  function formatSetDisplay(s: { exerciseId: string; actualWeightKg: number | null; actualReps: number | null; actualTime: number | null; actualDistance: number | null; actualDuration: number | null }) {
    const ex = getEx(s.exerciseId);
    if (!ex) return '';
    switch (ex.trackingType) {
      case 'weight_reps':
        return `${s.actualWeightKg ? formatWeight(s.actualWeightKg, settings.unitSystem) : 'BW'}×${s.actualReps}`;
      case 'time':
        return `${s.actualTime}s`;
      case 'distance':
        return settings.unitSystem === 'imperial' && s.actualDistance
          ? `${(s.actualDistance * 3.281).toFixed(1)}ft`
          : `${s.actualDistance}m`;
      case 'reps_only':
        return `${s.actualReps} reps`;
      case 'duration':
        return `${s.actualDuration}s`;
      default:
        return '';
    }
  }

  // Group PRs by exercise, only keep the best
  const bestPRs = Object.values(
    prs.reduce<Record<string, PRRecord>>((acc, pr) => {
      const existing = acc[pr.exerciseId];
      if (!existing) { acc[pr.exerciseId] = pr; return acc; }
      if (pr.unit === 'sec') {
        if (pr.value < existing.value) acc[pr.exerciseId] = pr;
      } else {
        if (pr.value > existing.value) acc[pr.exerciseId] = pr;
      }
      return acc;
    }, {})
  );

  function formatPRValue(pr: PRRecord) {
    switch (pr.unit) {
      case 'sec': return `${pr.value}s`;
      case 'm': return settings.unitSystem === 'imperial' ? `${(pr.value * 3.281).toFixed(1)} ft` : `${pr.value}m`;
      case 'kg': return formatWeight(pr.value, settings.unitSystem);
      default: return `${pr.value}`;
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">History</h1>

      <div className="flex gap-1 rounded-lg bg-zinc-900 p-1">
        {(['sessions', 'prs'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              view === v ? 'bg-zinc-700 text-white' : 'text-zinc-500'
            }`}
          >
            {v === 'sessions' ? 'Sessions' : 'Personal Records'}
          </button>
        ))}
      </div>

      {view === 'sessions' && (
        sessions.length === 0 ? (
          <p className="text-sm text-zinc-500">No sessions logged yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => {
              const workSets = s.sets.filter(set => !set.isWarmup);
              const duration = s.completedAt
                ? Math.round((new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)
                : null;

              return (
                <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{s.trainingDayLabel || 'Session'}</p>
                    <span className="text-xs text-zinc-500">{formatDate(s.startedAt)}</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-zinc-500">
                    <span>{workSets.length} sets</span>
                    {duration && <span>{duration}m</span>}
                    {s.sessionRpe && <span>RPE {s.sessionRpe}</span>}
                    {s.sessionMood && <span>{'😫😕😐😊🔥'[s.sessionMood - 1]}</span>}
                  </div>
                  <div className="mt-3 space-y-1">
                    {Object.entries(
                      s.sets.reduce<Record<string, typeof s.sets>>((acc, set) => {
                        (acc[set.exerciseId] ??= []).push(set);
                        return acc;
                      }, {})
                    ).map(([exId, sets]) => (
                      <div key={exId} className="text-xs">
                        <span className="text-zinc-400">{exName(exId)}: </span>
                        <span className="text-zinc-500">
                          {sets.filter(s => !s.isWarmup).map(s => formatSetDisplay(s)).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {view === 'prs' && (
        bestPRs.length === 0 ? (
          <p className="text-sm text-zinc-500">No PRs yet. Complete some sessions first.</p>
        ) : (
          <div className="space-y-3">
            {bestPRs.map(pr => {
              const ex = getEx(pr.exerciseId);
              return (
                <div key={pr.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{ex?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-zinc-500">
                        {ex?.category.replace(/_/g, ' ')} · {ex?.sport === 'both' ? 'LJ + CB' : ex?.sport === 'long_jump' ? 'Long Jump' : 'CB Football'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">{formatPRValue(pr)}</p>
                      <p className="text-xs text-zinc-500">{formatDate(pr.date)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
