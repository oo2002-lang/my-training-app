import { describe, it, expect } from 'vitest';
import { seedExercises, seedPrograms } from './seed';

describe('seed data integrity', () => {
  const exercises = seedExercises();
  const programs = seedPrograms(exercises);
  const exerciseIds = new Set(exercises.map(e => e.id));

  it('every exercise has a unique ID', () => {
    expect(exerciseIds.size).toBe(exercises.length);
  });

  it('every exercise referenced by a program exists in the exercise list', () => {
    const missing: string[] = [];
    for (const program of programs) {
      for (const block of program.blocks) {
        for (const week of block.weeks) {
          for (const day of week.days) {
            for (const dayEx of day.exercises) {
              if (!exerciseIds.has(dayEx.exerciseId)) {
                missing.push(`${program.name} > ${day.label}: exerciseId ${dayEx.exerciseId}`);
              }
            }
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('every exercise slug used by seedPrograms resolves', () => {
    const slugs = new Set(exercises.map(e => e.slug));
    const usedSlugs = [
      'a-skips', 'b-skips', 'leg-swings', 'accel-30m', 'flying-30m',
      'short-approach', 'pop-ups', 'hip-flexor-stretch', 'power-clean',
      'squat', 'rdl', 'bss', 'nordic-curl', 'hip-thrust', 'hanging-leg-raise',
      'bounding', 'depth-jumps', 'sl-bounds', 'hurdle-hops', 'hang-technique',
      'landing-drills', 'standing-lj', 'buildup-80', 'runway-marks',
      'full-approach', 'clean-pull', 'step-ups', 'tempo-200',
    ];
    for (const slug of usedSlugs) {
      expect(slugs.has(slug), `missing slug: ${slug}`).toBe(true);
    }
  });

  it('no program has zero exercises in any training day', () => {
    for (const program of programs) {
      for (const block of program.blocks) {
        for (const week of block.weeks) {
          for (const day of week.days) {
            expect(day.exercises.length, `${program.name} > ${day.label} has no exercises`).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
