'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Exercise, LoggedSet, Session, TrainingDay, PRRecord } from '@/lib/types';
import { calculateE1RM, createE1RMRecord, resolveWeight } from '@/lib/e1rm';
import { generateId, formatWeight, formatDuration } from '@/lib/utils';
import RPESelector from '@/components/RPESelector';
import RestTimer from '@/components/RestTimer';

export default function WorkoutPage() {
  return <Suspense><WorkoutInner /></Suspense>;
}

interface ActiveSet {
  dayExerciseId: string;
  exerciseId: string;
  setIndex: number;
  weight: string;
  reps: string;
  time: string;
  distance: string;
  duration: string;
  rpe: number | null;
  isWarmup: boolean;
}

function WorkoutInner() {
  const params = useParams();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [day, setDay] = useState<TrainingDay | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [active, setActive] = useState<ActiveSet | null>(null);
  const [sessionRpe, setSessionRpe] = useState<number | null>(null);
  const [sessionMood, setSessionMood] = useState<number | null>(null);
  const [showFinish, setShowFinish] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [settings] = useState(() => store.getSettings());

  const getExercise = useCallback(
    (id: string) => exercises.find(e => e.id === id),
    [exercises]
  );

  useEffect(() => {
    const exs = store.getExercises();
    setExercises(exs);

    const program = store.getProgram(params.programId as string);
    if (!program) { router.push('/programs'); return; }

    let found: TrainingDay | null = null;
    for (const block of program.blocks) {
      for (const week of block.weeks) {
        const d = week.days.find(d => d.id === params.dayId);
        if (d) { found = d; break; }
      }
      if (found) break;
    }
    if (!found) { router.push('/programs'); return; }
    setDay(found);

    const s: Session = {
      id: generateId(),
      programId: program.id,
      trainingDayId: found.id,
      trainingDayLabel: found.label,
      startedAt: new Date().toISOString(),
      sets: [],
    };
    setSession(s);

    const firstEx = found.exercises[0];
    if (firstEx) {
      const ex = exs.find(e => e.id === firstEx.exerciseId);
      const ps = firstEx.sets[0];
      const targetWeight = ex?.trackingType === 'weight_reps'
        ? resolveWeight(ps?.intensityPct ?? null, store.getCurrentE1RM(firstEx.exerciseId))
        : null;
      setActive({
        dayExerciseId: firstEx.id,
        exerciseId: firstEx.exerciseId,
        setIndex: 0,
        weight: targetWeight?.toString() ?? '',
        reps: ps?.targetReps?.toString() ?? '',
        time: ps?.targetTime?.toString() ?? '',
        distance: ps?.targetDistance?.toString() ?? '',
        duration: ps?.targetDuration?.toString() ?? '',
        rpe: null,
        isWarmup: ps?.setType === 'warmup',
      });
    }
  }, [params.programId, params.dayId, router]);

  useEffect(() => {
    if (!session) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  if (!day || !session) return null;

  const currentDayExercise = day.exercises[currentExIdx];

  function getExInfo(exId: string) {
    return exercises.find(e => e.id === exId);
  }

  function logSet() {
    if (!active || !session) return;
    const exInfo = getExInfo(active.exerciseId);
    if (!exInfo) return;

    const weightKg = exInfo.trackingType === 'weight_reps'
      ? (settings.unitSystem === 'imperial'
        ? Math.round(parseFloat(active.weight || '0') / 2.20462 * 100) / 100
        : parseFloat(active.weight || '0'))
      : null;
    const reps = ['weight_reps', 'reps_only'].includes(exInfo.trackingType) ? parseInt(active.reps || '0') || null : null;
    const time = exInfo.trackingType === 'time' ? parseFloat(active.time || '0') || null : null;
    const distance = exInfo.trackingType === 'distance' ? parseFloat(active.distance || '0') || null : null;
    const dur = exInfo.trackingType === 'duration' ? parseInt(active.duration || '0') || null : null;

    if (!reps && !time && !distance && !dur && !weightKg) return;

    const logged: LoggedSet = {
      id: generateId(),
      exerciseId: active.exerciseId,
      setNumber: session.sets.filter(s => s.exerciseId === active.exerciseId).length + 1,
      actualWeightKg: weightKg,
      actualReps: reps,
      actualTime: time,
      actualDistance: distance,
      actualDuration: dur,
      actualRpe: active.rpe,
      isWarmup: active.isWarmup,
      completedAt: new Date().toISOString(),
    };

    const updatedSession = { ...session, sets: [...session.sets, logged] };
    setSession(updatedSession);
    store.saveSession(updatedSession);

    // e1RM for weight exercises
    if (!active.isWarmup && weightKg && weightKg > 0 && reps && reps > 0) {
      const e1rmRecord = createE1RMRecord(active.exerciseId, {
        ...logged,
        actualReps: reps,
      });
      if (e1rmRecord) store.saveE1RMRecord(e1rmRecord);
    }

    // Check for PRs
    checkAndSavePR(exInfo, logged);

    advanceToNextSet(active, updatedSession);
  }

  function checkAndSavePR(exInfo: Exercise, logged: LoggedSet) {
    if (logged.isWarmup) return;
    const existing = store.getExercisePR(exInfo.id);

    let newPR: PRRecord | null = null;
    if (exInfo.trackingType === 'time' && logged.actualTime) {
      if (!existing || logged.actualTime < existing.value) {
        newPR = { id: generateId(), exerciseId: exInfo.id, value: logged.actualTime, unit: 'sec', setId: logged.id, date: new Date().toISOString() };
      }
    } else if (exInfo.trackingType === 'distance' && logged.actualDistance) {
      if (!existing || logged.actualDistance > existing.value) {
        newPR = { id: generateId(), exerciseId: exInfo.id, value: logged.actualDistance, unit: 'm', setId: logged.id, date: new Date().toISOString() };
      }
    } else if (exInfo.trackingType === 'weight_reps' && logged.actualWeightKg) {
      if (!existing || logged.actualWeightKg > existing.value) {
        newPR = { id: generateId(), exerciseId: exInfo.id, value: logged.actualWeightKg, unit: 'kg', setId: logged.id, date: new Date().toISOString() };
      }
    }
    if (newPR) store.savePR(newPR);
  }

  function advanceToNextSet(current: ActiveSet, sess: Session) {
    if (!day) return;
    const dayEx = day.exercises.find(de => de.id === current.dayExerciseId);
    if (!dayEx) return;

    const nextSetIdx = current.setIndex + 1;
    if (nextSetIdx < dayEx.sets.length) {
      const nextPrescribed = dayEx.sets[nextSetIdx];
      const exInfo = getExInfo(current.exerciseId);
      const targetWeight = exInfo?.trackingType === 'weight_reps'
        ? resolveWeight(nextPrescribed.intensityPct, store.getCurrentE1RM(current.exerciseId))
        : null;
      setActive({
        dayExerciseId: current.dayExerciseId,
        exerciseId: current.exerciseId,
        setIndex: nextSetIdx,
        weight: targetWeight?.toString() ?? current.weight,
        reps: nextPrescribed.targetReps?.toString() ?? '',
        time: nextPrescribed.targetTime?.toString() ?? '',
        distance: nextPrescribed.targetDistance?.toString() ?? '',
        duration: nextPrescribed.targetDuration?.toString() ?? '',
        rpe: null,
        isWarmup: nextPrescribed.setType === 'warmup',
      });
      return;
    }

    const nextExIdx = currentExIdx + 1;
    if (nextExIdx < day.exercises.length) {
      setCurrentExIdx(nextExIdx);
      const nextEx = day.exercises[nextExIdx];
      const nextSet = nextEx.sets[0];
      const nextExInfo = getExInfo(nextEx.exerciseId);
      const targetWeight = nextExInfo?.trackingType === 'weight_reps'
        ? resolveWeight(nextSet?.intensityPct ?? null, store.getCurrentE1RM(nextEx.exerciseId))
        : null;
      setActive({
        dayExerciseId: nextEx.id,
        exerciseId: nextEx.exerciseId,
        setIndex: 0,
        weight: targetWeight?.toString() ?? '',
        reps: nextSet?.targetReps?.toString() ?? '',
        time: nextSet?.targetTime?.toString() ?? '',
        distance: nextSet?.targetDistance?.toString() ?? '',
        duration: nextSet?.targetDuration?.toString() ?? '',
        rpe: null,
        isWarmup: nextSet?.setType === 'warmup',
      });
      return;
    }

    setActive(null);
    setShowFinish(true);
  }

  function finishWorkout() {
    if (!session) return;
    const finished: Session = {
      ...session,
      completedAt: new Date().toISOString(),
      sessionRpe: sessionRpe ?? undefined,
      sessionMood: sessionMood ?? undefined,
    };
    store.saveSession(finished);
    router.push('/history');
  }

  function formatSetResult(s: LoggedSet) {
    const ex = getExInfo(s.exerciseId);
    if (!ex) return '';
    switch (ex.trackingType) {
      case 'weight_reps':
        return `${s.actualWeightKg ? formatWeight(s.actualWeightKg, settings.unitSystem) : 'BW'} × ${s.actualReps}`;
      case 'time':
        return `${s.actualTime}s`;
      case 'distance':
        return settings.unitSystem === 'imperial' && s.actualDistance
          ? `${(s.actualDistance * 3.281).toFixed(1)} ft`
          : `${s.actualDistance}m`;
      case 'reps_only':
        return `${s.actualReps} reps`;
      case 'duration':
        return `${s.actualDuration}s`;
      default:
        return '';
    }
  }

  // ========== FINISH SCREEN ==========
  if (showFinish) {
    const workSets = session.sets.filter(s => !s.isWarmup);
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Session Complete!</h1>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <p className="text-xl font-bold">{workSets.length}</p>
            <p className="text-xs text-zinc-500">Work Sets</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <p className="text-xl font-bold">{formatDuration(elapsed)}</p>
            <p className="text-xs text-zinc-500">Duration</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-400">Session RPE — How hard was it?</p>
          <RPESelector value={sessionRpe} onChange={setSessionRpe} min={1} max={10} allowHalf={false} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-400">How did it feel?</p>
          <div className="flex gap-2">
            {[
              { val: 1, label: '😫' },
              { val: 2, label: '😕' },
              { val: 3, label: '😐' },
              { val: 4, label: '😊' },
              { val: 5, label: '🔥' },
            ].map(m => (
              <button
                key={m.val}
                onClick={() => setSessionMood(m.val)}
                className={`flex-1 rounded-lg py-3 text-xl transition-all ${
                  sessionMood === m.val ? 'bg-blue-600 scale-110' : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={finishWorkout}
          className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-500"
        >
          Save & Finish
        </button>
      </div>
    );
  }

  // ========== ACTIVE WORKOUT ==========
  const activeExInfo = active ? getExInfo(active.exerciseId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{day.label}</h1>
          <p className="font-mono text-sm text-zinc-500">{formatDuration(elapsed)}</p>
        </div>
        <button
          onClick={() => setShowFinish(true)}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
        >
          Finish
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {day.exercises.map((de, i) => (
          <div
            key={de.id}
            className={`h-1 flex-1 rounded-full ${
              i < currentExIdx ? 'bg-green-500' :
              i === currentExIdx ? 'bg-blue-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* Current exercise */}
      {active && currentDayExercise && activeExInfo && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                activeExInfo.category === 'sprint' ? 'bg-red-900/50 text-red-400' :
                activeExInfo.category === 'plyo' ? 'bg-orange-900/50 text-orange-400' :
                activeExInfo.category === 'jump_drill' ? 'bg-purple-900/50 text-purple-400' :
                activeExInfo.category === 'cb_drill' ? 'bg-blue-900/50 text-blue-400' :
                activeExInfo.category === 'agility' ? 'bg-cyan-900/50 text-cyan-400' :
                activeExInfo.category === 'strength' ? 'bg-amber-900/50 text-amber-400' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                {activeExInfo.category.replace(/_/g, ' ')}
              </span>
              <span className="text-xs uppercase tracking-wider text-zinc-600">
                {currentDayExercise.section}
              </span>
            </div>
            <p className="mt-1 text-lg font-bold">{activeExInfo.name}</p>
            <p className="text-sm text-zinc-500">
              Set {active.setIndex + 1} of {currentDayExercise.sets.length}
              {active.isWarmup && <span className="ml-1 text-amber-400">(Warm-up)</span>}
            </p>
          </div>

          {/* Coaching cues */}
          {activeExInfo.cues && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
              <p className="text-xs text-zinc-400">💡 {activeExInfo.cues}</p>
            </div>
          )}

          {/* No-equipment alternatives */}
          {activeExInfo.alternatives && activeExInfo.alternatives.length > 0 && (
            <details className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2">
              <summary className="cursor-pointer text-xs text-zinc-500">🔄 No {activeExInfo.equipment ?? 'equipment'}? Alternatives</summary>
              <ul className="mt-1.5 space-y-1">
                {activeExInfo.alternatives.map((alt, i) => (
                  <li key={i} className="text-xs text-zinc-400">• {alt}</li>
                ))}
              </ul>
            </details>
          )}

          {/* Target info */}
          {currentDayExercise.sets[active.setIndex] && (() => {
            const ps = currentDayExercise.sets[active.setIndex];
            const targets: string[] = [];
            if (ps.targetReps) targets.push(`${ps.targetReps} reps`);
            if (ps.targetTime) targets.push(`${ps.targetTime}s target`);
            if (ps.targetDistance) targets.push(`${ps.targetDistance}m target`);
            if (ps.targetDuration) targets.push(`${ps.targetDuration}s`);
            if (ps.targetRpe) targets.push(`RPE ${ps.targetRpe}`);
            if (ps.intensityPct) targets.push(`${ps.intensityPct}% e1RM`);
            return targets.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                {targets.map((t, i) => (
                  <span key={i} className="rounded bg-zinc-800 px-2 py-1">{t}</span>
                ))}
              </div>
            ) : null;
          })()}

          {/* Notes */}
          {currentDayExercise.notes && (
            <p className="text-xs text-zinc-500 italic">{currentDayExercise.notes}</p>
          )}

          {/* Input fields based on tracking type */}
          <div className="space-y-3">
            {activeExInfo.trackingType === 'weight_reps' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">
                    Weight ({settings.unitSystem === 'imperial' ? 'lbs' : 'kg'})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={active.weight}
                    onChange={e => setActive({ ...active, weight: e.target.value })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-center text-lg font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">Reps</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={active.reps}
                    onChange={e => setActive({ ...active, reps: e.target.value })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-center text-lg font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {activeExInfo.trackingType === 'time' && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Time (seconds)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={active.time}
                  onChange={e => setActive({ ...active, time: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-center text-2xl font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            )}

            {activeExInfo.trackingType === 'distance' && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Distance ({settings.unitSystem === 'imperial' ? 'feet' : 'meters'})
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={active.distance}
                  onChange={e => setActive({ ...active, distance: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-center text-2xl font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            )}

            {activeExInfo.trackingType === 'reps_only' && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Reps Completed</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={active.reps}
                  onChange={e => setActive({ ...active, reps: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-center text-2xl font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            )}

            {activeExInfo.trackingType === 'duration' && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Duration (seconds)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={active.duration}
                  onChange={e => setActive({ ...active, duration: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-center text-2xl font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* RPE selector */}
          <div>
            <label className="mb-1 block text-xs text-zinc-500">RPE (optional)</label>
            <RPESelector value={active.rpe} onChange={rpe => setActive({ ...active, rpe })} />
          </div>

          {/* e1RM preview for weight exercises */}
          {activeExInfo.trackingType === 'weight_reps' && active.weight && active.reps &&
            parseFloat(active.weight) > 0 && parseInt(active.reps) > 0 && (
            <p className="text-xs text-zinc-500">
              Estimated 1RM:{' '}
              <span className="text-zinc-300">
                {formatWeight(
                  calculateE1RM(
                    settings.unitSystem === 'imperial'
                      ? parseFloat(active.weight) / 2.20462
                      : parseFloat(active.weight),
                    parseInt(active.reps),
                    active.rpe
                  ),
                  settings.unitSystem
                )}
              </span>
            </p>
          )}

          <button
            onClick={logSet}
            className="w-full rounded-lg bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-500 active:scale-[0.98] transition-transform"
          >
            Log Set
          </button>

          {/* Rest timer */}
          <div className="pt-2 border-t border-zinc-800">
            <p className="mb-2 text-xs text-zinc-500">Rest Timer</p>
            <RestTimer defaultSeconds={currentDayExercise.sets[active.setIndex]?.restSeconds ?? 120} />
          </div>
        </div>
      )}

      {/* Logged sets summary */}
      {session.sets.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-400">Completed</p>
          <div className="space-y-1">
            {session.sets.map(s => {
              const ex = getExInfo(s.exerciseId);
              return (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-zinc-900/50 px-3 py-2 text-sm">
                  <span className="text-zinc-400 truncate mr-2">
                    {ex?.name ?? 'Unknown'}
                    {s.isWarmup && <span className="ml-1 text-zinc-600">(W)</span>}
                  </span>
                  <span className="font-mono text-zinc-300 whitespace-nowrap">
                    {formatSetResult(s)}
                    {s.actualRpe != null && <span className="ml-1 text-zinc-500">@{s.actualRpe}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
