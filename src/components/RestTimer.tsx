'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function RestTimer({ defaultSeconds = 120 }: { defaultSeconds?: number }) {
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback((secs?: number) => {
    setRemaining(secs ?? defaultSeconds);
    setRunning(true);
  }, [defaultSeconds]);

  const stop = useCallback(() => {
    setRunning(false);
    setRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setRunning(false);
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (!running && remaining === 0) {
    return (
      <div className="flex items-center gap-2">
        {[60, 90, 120, 180].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => start(s)}
            className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"
          >
            {s >= 60 ? `${s / 60}m` : `${s}s`}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="font-mono text-2xl font-bold tabular-nums text-blue-400">
        {mins}:{secs.toString().padStart(2, '0')}
      </div>
      <button
        type="button"
        onClick={stop}
        className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700"
      >
        Skip
      </button>
    </div>
  );
}
