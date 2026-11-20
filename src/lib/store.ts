'use client';

import { Exercise, Program, Session, E1RMRecord, PRRecord, WellnessCheckin, UserSettings } from './types';
import { seedExercises, seedPrograms } from './seed';

const SCHEMA_VERSION = 3;

const KEYS = {
  exercises: 'ironlog_exercises',
  programs: 'ironlog_programs',
  sessions: 'ironlog_sessions',
  e1rmHistory: 'ironlog_e1rm',
  prs: 'ironlog_prs',
  wellness: 'ironlog_wellness',
  settings: 'ironlog_settings',
  initialized: 'ironlog_initialized',
  schemaVersion: 'ironlog_schema',
} as const;

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_SETTINGS: UserSettings = {
  unitSystem: 'imperial',
  displayName: 'Athlete',
  restTimerDefault: 120,
};

export const store = {
  init() {
    if (typeof window === 'undefined') return;
    const ver = localStorage.getItem(KEYS.schemaVersion);
    if (ver && Number(ver) >= SCHEMA_VERSION) return;
    // Wipe old schema and re-seed with sport-specific data
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    set(KEYS.exercises, seedExercises());
    set(KEYS.programs, seedPrograms());
    set(KEYS.sessions, []);
    set(KEYS.e1rmHistory, []);
    set(KEYS.prs, []);
    set(KEYS.wellness, []);
    set(KEYS.settings, DEFAULT_SETTINGS);
    localStorage.setItem(KEYS.schemaVersion, String(SCHEMA_VERSION));
    localStorage.setItem(KEYS.initialized, 'true');
  },

  // Exercises
  getExercises(): Exercise[] {
    return get<Exercise[]>(KEYS.exercises, []);
  },
  saveExercise(exercise: Exercise) {
    const all = this.getExercises();
    const idx = all.findIndex(e => e.id === exercise.id);
    if (idx >= 0) all[idx] = exercise;
    else all.push(exercise);
    set(KEYS.exercises, all);
  },

  // Programs
  getPrograms(): Program[] {
    return get<Program[]>(KEYS.programs, []);
  },
  getProgram(id: string): Program | undefined {
    return this.getPrograms().find(p => p.id === id);
  },
  saveProgram(program: Program) {
    const all = this.getPrograms();
    const idx = all.findIndex(p => p.id === program.id);
    if (idx >= 0) all[idx] = program;
    else all.push(program);
    set(KEYS.programs, all);
  },
  deleteProgram(id: string) {
    set(KEYS.programs, this.getPrograms().filter(p => p.id !== id));
  },

  // Sessions
  getSessions(): Session[] {
    return get<Session[]>(KEYS.sessions, []);
  },
  getSession(id: string): Session | undefined {
    return this.getSessions().find(s => s.id === id);
  },
  saveSession(session: Session) {
    const all = this.getSessions();
    const idx = all.findIndex(s => s.id === session.id);
    if (idx >= 0) all[idx] = session;
    else all.push(session);
    set(KEYS.sessions, all);
  },

  // e1RM
  getE1RMHistory(): E1RMRecord[] {
    return get<E1RMRecord[]>(KEYS.e1rmHistory, []);
  },
  getExerciseE1RM(exerciseId: string): E1RMRecord[] {
    return this.getE1RMHistory()
      .filter(r => r.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime());
  },
  getCurrentE1RM(exerciseId: string): number | null {
    const records = this.getExerciseE1RM(exerciseId);
    return records.length > 0 ? records[0].estimatedMax : null;
  },
  saveE1RMRecord(record: E1RMRecord) {
    const all = this.getE1RMHistory();
    all.push(record);
    set(KEYS.e1rmHistory, all);
  },

  // PRs
  getPRs(): PRRecord[] {
    return get<PRRecord[]>(KEYS.prs, []);
  },
  getExercisePR(exerciseId: string): PRRecord | undefined {
    const all = this.getPRs().filter(r => r.exerciseId === exerciseId);
    if (all.length === 0) return undefined;
    return all.reduce((best, r) => {
      if (r.unit === 'sec') return r.value < best.value ? r : best;
      return r.value > best.value ? r : best;
    });
  },
  savePR(record: PRRecord) {
    const all = this.getPRs();
    all.push(record);
    set(KEYS.prs, all);
  },

  // Wellness
  getWellnessCheckins(): WellnessCheckin[] {
    return get<WellnessCheckin[]>(KEYS.wellness, []);
  },
  getTodayCheckin(): WellnessCheckin | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.getWellnessCheckins().find(c => c.date === today);
  },
  saveCheckin(checkin: WellnessCheckin) {
    const all = this.getWellnessCheckins();
    const idx = all.findIndex(c => c.date === checkin.date);
    if (idx >= 0) all[idx] = checkin;
    else all.push(checkin);
    set(KEYS.wellness, all);
  },

  // Settings
  getSettings(): UserSettings {
    return get<UserSettings>(KEYS.settings, DEFAULT_SETTINGS);
  },
  saveSettings(settings: UserSettings) {
    set(KEYS.settings, settings);
  },

  // Reset
  resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
