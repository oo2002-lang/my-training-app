'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Exercise, Program, Block, Week, TrainingDay, DayExercise, PrescribedSet } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function ProgramBuilderPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<{ label: string; exercises: { exerciseId: string; sets: number; reps: number; rpe: number; intensity: number }[] }[]>([
    { label: 'Day 1', exercises: [] },
  ]);
  const [numWeeks, setNumWeeks] = useState(4);
  const [focus, setFocus] = useState<Block['focus']>('general');
  const [sport, setSport] = useState<Program['sport']>('combined');

  useEffect(() => {
    setExercises(store.getExercises());
  }, []);

  function addDay() {
    setDays([...days, { label: `Day ${days.length + 1}`, exercises: [] }]);
  }

  function removeDay(i: number) {
    setDays(days.filter((_, idx) => idx !== i));
  }

  function addExerciseToDay(dayIdx: number) {
    const updated = [...days];
    updated[dayIdx].exercises.push({
      exerciseId: exercises[0]?.id ?? '',
      sets: 3,
      reps: 8,
      rpe: 7,
      intensity: 72.5,
    });
    setDays(updated);
  }

  function removeExerciseFromDay(dayIdx: number, exIdx: number) {
    const updated = [...days];
    updated[dayIdx].exercises = updated[dayIdx].exercises.filter((_, i) => i !== exIdx);
    setDays(updated);
  }

  function updateDayLabel(dayIdx: number, label: string) {
    const updated = [...days];
    updated[dayIdx].label = label;
    setDays(updated);
  }

  function updateExercise(dayIdx: number, exIdx: number, field: string, value: string | number) {
    const updated = [...days];
    (updated[dayIdx].exercises[exIdx] as Record<string, unknown>)[field] = value;
    setDays(updated);
  }

  function save() {
    if (!name.trim()) return;

    const trainingDays: TrainingDay[] = days.map((d, di) => ({
      id: generateId(),
      dayNumber: di + 1,
      label: d.label,
      sortOrder: di + 1,
      exercises: d.exercises.map((ex, ei): DayExercise => ({
        id: generateId(),
        exerciseId: ex.exerciseId,
        sortOrder: ei + 1,
        section: ei < 2 ? 'main' : 'accessory',
        supersetGroup: null,
        sets: Array.from({ length: ex.sets }, (_, si): PrescribedSet => ({
          setNumber: si + 1,
          setType: 'working',
          targetReps: ex.reps || null,
          targetRpe: ex.rpe || null,
          intensityPct: ex.intensity || null,
          targetWeightKg: null,
          targetTime: null,
          targetDistance: null,
          targetDuration: null,
          restSeconds: ei < 2 ? 180 : 90,
        })),
      })),
    }));

    const weeks: Week[] = Array.from({ length: numWeeks }, (_, i) => ({
      id: generateId(),
      weekNumber: i + 1,
      isDeload: i === numWeeks - 1,
      status: i === 0 ? 'active' as const : 'upcoming' as const,
      days: trainingDays.map(d => ({
        ...d,
        id: generateId(),
        exercises: d.exercises.map(e => ({ ...e, id: generateId() })),
      })),
    }));

    const program: Program = {
      id: generateId(),
      name: name.trim(),
      description: description.trim() || undefined,
      status: 'active',
      sport,
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      blocks: [{
        id: generateId(),
        name: focus.charAt(0).toUpperCase() + focus.slice(1),
        sortOrder: 1,
        numWeeks,
        focus,
        weeks,
      }],
    };

    store.saveProgram(program);
    router.push(`/programs/${program.id}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <button onClick={() => router.push('/programs')} className="text-sm text-blue-400">
          ← Programs
        </button>
        <h1 className="mt-1 text-xl font-bold">New Program</h1>
      </div>

      <div className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Program name"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
        />
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Sport</label>
          <div className="flex gap-2">
            {([['long_jump', '🏃 Long Jump'], ['cb_football', '🏈 CB Football'], ['combined', '🏃🏈 Both']] as const).map(([val, label]) => (
              <button key={val} type="button" onClick={() => setSport(val)}
                className={`flex-1 rounded-lg py-2 text-xs font-medium ${sport === val ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Weeks</label>
            <select
              value={numWeeks}
              onChange={e => setNumWeeks(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none"
            >
              {[3, 4, 5, 6, 8].map(n => (
                <option key={n} value={n}>{n} weeks</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Focus</label>
            <select
              value={focus}
              onChange={e => setFocus(e.target.value as Block['focus'])}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none"
            >
              {['general', 'speed', 'power', 'technique', 'strength', 'conditioning', 'competition_prep', 'deload'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {days.map((day, di) => (
        <div key={di} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              value={day.label}
              onChange={e => updateDayLabel(di, e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:outline-none"
            />
            {days.length > 1 && (
              <button
                onClick={() => removeDay(di)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          {day.exercises.map((ex, ei) => (
            <div key={ei} className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={ex.exerciseId}
                  onChange={e => updateExercise(di, ei, 'exerciseId', e.target.value)}
                  className="flex-1 rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-xs text-zinc-100 focus:outline-none"
                >
                  {exercises.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeExerciseFromDay(di, ei)}
                  className="text-xs text-red-400"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-zinc-600">Sets</label>
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={e => updateExercise(di, ei, 'sets', Number(e.target.value))}
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Reps</label>
                  <input
                    type="number"
                    value={ex.reps}
                    onChange={e => updateExercise(di, ei, 'reps', Number(e.target.value))}
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-600">RPE</label>
                  <input
                    type="number"
                    value={ex.rpe}
                    step={0.5}
                    onChange={e => updateExercise(di, ei, 'rpe', Number(e.target.value))}
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-600">%e1RM</label>
                  <input
                    type="number"
                    value={ex.intensity}
                    step={2.5}
                    onChange={e => updateExercise(di, ei, 'intensity', Number(e.target.value))}
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-100"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => addExerciseToDay(di)}
            className="w-full rounded-lg border border-dashed border-zinc-700 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
          >
            + Add Exercise
          </button>
        </div>
      ))}

      <button
        onClick={addDay}
        className="w-full rounded-lg border border-dashed border-zinc-700 py-3 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
      >
        + Add Training Day
      </button>

      <button
        onClick={save}
        disabled={!name.trim() || days.every(d => d.exercises.length === 0)}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Program
      </button>
    </div>
  );
}
