import { E1RMRecord, LoggedSet } from './types';
import { generateId } from './utils';

export function calculateE1RM(weightKg: number, reps: number, rpe: number | null): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1 && rpe === 10) return weightKg;

  const repsInReserve = rpe != null ? 10 - rpe : 0;
  const effectiveReps = reps + repsInReserve;

  // Epley formula with RPE adjustment
  return Math.round(weightKg * (1 + effectiveReps / 30) * 100) / 100;
}

export function createE1RMRecord(
  exerciseId: string,
  set: LoggedSet
): E1RMRecord | null {
  if (set.isWarmup || !set.actualWeightKg || !set.actualReps || set.actualReps <= 0) return null;

  const estimated = calculateE1RM(set.actualWeightKg, set.actualReps, set.actualRpe ?? null);
  if (estimated <= 0) return null;

  return {
    id: generateId(),
    exerciseId,
    estimatedMax: estimated,
    sourceSetId: set.id,
    formula: set.actualRpe != null ? 'rpe_adjusted' : 'epley',
    calculatedAt: new Date().toISOString(),
  };
}

export function resolveWeight(
  intensityPct: number | null,
  currentE1RM: number | null
): number | null {
  if (intensityPct == null || currentE1RM == null) return null;
  const raw = currentE1RM * intensityPct / 100;
  return Math.round(raw / 2.5) * 2.5;
}

export function shouldReduceLoad(
  recentSessionRPEs: { sessionRpe: number; avgTargetRpe: number }[]
): boolean {
  const overshoots = recentSessionRPEs.filter(
    s => s.sessionRpe - s.avgTargetRpe >= 1.5
  );
  return overshoots.length >= 2;
}

export function getE1RMTrend(
  records: E1RMRecord[]
): 'up' | 'down' | 'stable' | 'none' {
  if (records.length < 2) return 'none';

  const sorted = [...records].sort(
    (a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime()
  );
  const recent = sorted[0].estimatedMax;
  const previous = sorted[1].estimatedMax;
  const diff = recent - previous;
  const pct = (diff / previous) * 100;

  if (pct > 2) return 'up';
  if (pct < -2) return 'down';
  return 'stable';
}
