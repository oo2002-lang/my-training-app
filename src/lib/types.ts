export type TrackingType = 'weight_reps' | 'time' | 'distance' | 'reps_only' | 'duration';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: 'sprint' | 'plyo' | 'agility' | 'jump_drill' | 'cb_drill' | 'strength' | 'mobility' | 'conditioning' | 'other';
  trackingType: TrackingType;
  primaryMuscles: string[];
  equipment?: string;
  sport: 'long_jump' | 'cb_football' | 'both';
  cues?: string;
}

export interface PrescribedSet {
  setNumber: number;
  setType: 'warmup' | 'working' | 'backoff' | 'amrap';
  targetReps: number | null;
  targetRpe: number | null;
  intensityPct: number | null;
  targetWeightKg: number | null;
  targetTime: number | null;
  targetDistance: number | null;
  targetDuration: number | null;
  restSeconds: number;
}

export interface DayExercise {
  id: string;
  exerciseId: string;
  sortOrder: number;
  section: 'warmup' | 'main' | 'accessory' | 'cooldown';
  supersetGroup: number | null;
  notes?: string;
  sets: PrescribedSet[];
}

export interface TrainingDay {
  id: string;
  dayNumber: number;
  label: string;
  sortOrder: number;
  exercises: DayExercise[];
}

export interface Week {
  id: string;
  weekNumber: number;
  isDeload: boolean;
  status: 'upcoming' | 'active' | 'completed';
  days: TrainingDay[];
}

export interface Block {
  id: string;
  name: string;
  sortOrder: number;
  numWeeks: number;
  focus: 'speed' | 'power' | 'technique' | 'strength' | 'conditioning' | 'deload' | 'general' | 'competition_prep';
  weeks: Week[];
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'archived' | 'completed';
  sport: 'long_jump' | 'cb_football' | 'combined';
  startDate?: string;
  createdAt: string;
  blocks: Block[];
}

export interface LoggedSet {
  id: string;
  exerciseId: string;
  prescribedSetId?: string;
  setNumber: number;
  actualWeightKg: number | null;
  actualReps: number | null;
  actualTime: number | null;
  actualDistance: number | null;
  actualDuration: number | null;
  actualRpe: number | null;
  isWarmup: boolean;
  completedAt: string;
}

export interface Session {
  id: string;
  programId?: string;
  trainingDayId?: string;
  trainingDayLabel?: string;
  startedAt: string;
  completedAt?: string;
  sessionRpe?: number;
  sessionMood?: number;
  notes?: string;
  sets: LoggedSet[];
}

export interface E1RMRecord {
  id: string;
  exerciseId: string;
  estimatedMax: number;
  sourceSetId?: string;
  formula: 'epley' | 'brzycki' | 'rpe_adjusted';
  calculatedAt: string;
}

export interface PRRecord {
  id: string;
  exerciseId: string;
  value: number;
  unit: 'kg' | 'sec' | 'm' | 'reps';
  setId: string;
  date: string;
}

export interface WellnessCheckin {
  id: string;
  date: string;
  sleepQuality: number;
  soreness: number;
  energy: number;
  stress: number;
  notes?: string;
  readinessScore: number;
}

export interface UserSettings {
  unitSystem: 'metric' | 'imperial';
  displayName: string;
  activeProgramId?: string;
  currentWeekId?: string;
  restTimerDefault: number;
}
