'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { WellnessCheckin } from '@/lib/types';
import { generateId, todayString } from '@/lib/utils';

const CATEGORIES = [
  { key: 'sleepQuality' as const, label: 'Sleep Quality', emoji: '😴', low: 'Terrible', high: 'Great' },
  { key: 'energy' as const, label: 'Energy Level', emoji: '⚡', low: 'Drained', high: 'Energized' },
  { key: 'soreness' as const, label: 'Muscle Soreness', emoji: '🦵', low: 'Very Sore', high: 'Fresh' },
  { key: 'stress' as const, label: 'Stress Level', emoji: '🧠', low: 'High Stress', high: 'Calm' },
];

export default function CheckinPage() {
  const router = useRouter();
  const [values, setValues] = useState({ sleepQuality: 3, energy: 3, soreness: 3, stress: 3 });
  const [notes, setNotes] = useState('');
  const [existing, setExisting] = useState(false);

  useEffect(() => {
    const today = store.getTodayCheckin();
    if (today) {
      setValues({
        sleepQuality: today.sleepQuality,
        energy: today.energy,
        soreness: today.soreness,
        stress: today.stress,
      });
      setNotes(today.notes || '');
      setExisting(true);
    }
  }, []);

  const readiness = (values.sleepQuality + values.energy + values.soreness + values.stress) / 4;

  function save() {
    const checkin: WellnessCheckin = {
      id: generateId(),
      date: todayString(),
      ...values,
      notes: notes || undefined,
      readinessScore: readiness,
    };
    store.saveCheckin(checkin);
    router.push('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Daily Check-In</h1>
        <p className="text-sm text-zinc-500">How are you feeling today?</p>
      </div>

      <div className="space-y-5">
        {CATEGORIES.map(cat => (
          <div key={cat.key}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {cat.emoji} {cat.label}
              </span>
              <span className="text-sm font-bold text-blue-400">{values[cat.key]}/5</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValues(prev => ({ ...prev, [cat.key]: n }))}
                  className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all ${
                    values[cat.key] === n
                      ? n <= 2 ? 'bg-red-600 text-white'
                        : n === 3 ? 'bg-amber-600 text-white'
                        : 'bg-green-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-zinc-600">
              <span>{cat.low}</span>
              <span>{cat.high}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
        <p className="text-sm text-zinc-400">Readiness Score</p>
        <p className={`text-3xl font-bold ${
          readiness >= 4 ? 'text-green-400' :
          readiness >= 3 ? 'text-amber-400' : 'text-red-400'
        }`}>
          {readiness.toFixed(1)}/5
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {readiness >= 4 ? 'Great — go all out today' :
           readiness >= 3 ? 'Decent — train as planned' :
           readiness >= 2 ? 'Below average — consider reducing intensity' :
           'Low — consider a rest day'}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-zinc-400">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
          placeholder="Anything worth noting..."
        />
      </div>

      <button
        onClick={save}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500"
      >
        {existing ? 'Update Check-In' : 'Save Check-In'}
      </button>
    </div>
  );
}
