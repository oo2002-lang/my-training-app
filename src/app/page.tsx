'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Program, Session, WellnessCheckin } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const SPORT_LABELS: Record<string, string> = {
  long_jump: '🏃 Long Jump',
  cb_football: '🏈 CB Football',
  combined: '🏃🏈 Dual-Sport',
};

export default function Dashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [checkin, setCheckin] = useState<WellnessCheckin | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrograms(store.getPrograms());
    setSessions(store.getSessions());
    setCheckin(store.getTodayCheckin());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 3);

  const activePrograms = programs.filter(p => p.status === 'active');

  const streak = (() => {
    if (sessions.length === 0) return 0;
    const dates = [...new Set(sessions.map(s => s.startedAt.split('T')[0]))].sort().reverse();
    let count = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (diff <= i + 1) count++;
      else break;
    }
    return count;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">IronLog</h1>
        <p className="text-sm text-zinc-500">Long Jump & CB Football Training</p>
      </div>

      {/* Readiness */}
      {!checkin ? (
        <Link
          href="/checkin"
          className="block rounded-xl border border-amber-800/50 bg-amber-950/30 p-4"
        >
          <p className="font-medium text-amber-400">Daily Check-In</p>
          <p className="text-sm text-zinc-400">Log your readiness before training</p>
        </Link>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Today&apos;s Readiness</p>
            <span className={`text-xl font-bold ${
              checkin.readinessScore >= 4 ? 'text-green-400' :
              checkin.readinessScore >= 3 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {checkin.readinessScore.toFixed(1)}/5
            </span>
          </div>
          <div className="mt-2 flex gap-3 text-xs text-zinc-500">
            <span>Sleep {checkin.sleepQuality}/5</span>
            <span>Energy {checkin.energy}/5</span>
            <span>Soreness {checkin.soreness}/5</span>
            <span>Stress {checkin.stress}/5</span>
          </div>
          {checkin.readinessScore < 2.5 && (
            <p className="mt-2 text-xs text-red-400">
              Low readiness — consider a lighter session or rest day
            </p>
          )}
        </div>
      )}

      {/* Active programs quick-start */}
      {activePrograms.map(prog => (
        <div key={prog.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{SPORT_LABELS[prog.sport] ?? prog.sport}</span>
          </div>
          <p className="font-medium">{prog.name}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {prog.blocks[0]?.weeks
              .find(w => w.status === 'active')
              ?.days.map(day => (
                <Link
                  key={day.id}
                  href={`/workout/${prog.id}/${day.id}`}
                  className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  {day.label}
                </Link>
              ))}
          </div>
        </div>
      ))}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <p className="text-2xl font-bold">{sessions.length}</p>
          <p className="text-xs text-zinc-500">Sessions</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-zinc-500">Day Streak</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <p className="text-2xl font-bold">{programs.length}</p>
          <p className="text-xs text-zinc-500">Programs</p>
        </div>
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-zinc-400">Recent Sessions</h2>
          <div className="space-y-2">
            {recentSessions.map(s => (
              <div key={s.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{s.trainingDayLabel || 'Session'}</p>
                  <span className="text-xs text-zinc-500">{formatDate(s.startedAt)}</span>
                </div>
                <div className="mt-1 flex gap-3 text-xs text-zinc-500">
                  <span>{s.sets.length} sets</span>
                  {s.sessionRpe && <span>RPE {s.sessionRpe}</span>}
                  {s.completedAt && (
                    <span>
                      {Math.round((new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)}m
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link href="/history" className="mt-2 block text-center text-sm text-blue-400">
            View All History →
          </Link>
        </div>
      )}

      {/* Empty state */}
      {sessions.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-lg font-medium">Ready to train?</p>
          <p className="mt-1 text-sm text-zinc-500">
            Long Jump and CB programs are loaded — pick one and go
          </p>
          <Link
            href="/programs"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            View Programs
          </Link>
        </div>
      )}
    </div>
  );
}
