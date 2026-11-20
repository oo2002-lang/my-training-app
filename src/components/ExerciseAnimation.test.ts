import { describe, it, expect } from 'vitest';
import { seedExercises } from '../lib/seed';

const SLUG_TO_PATTERN: Record<string, string> = {
  'squat': 'squat', 'front-squat': 'squat', 'goblet-squat': 'squat',
  'rdl': 'hinge', 'sl-rdl': 'hinge', 'trap-bar-dl': 'hinge',
  'power-clean': 'clean', 'hang-clean': 'clean', 'clean-pull': 'clean',
  'bench-press': 'push', 'db-incline': 'push', 'press-jam': 'push',
  'weighted-pullups': 'pull', 'db-row': 'pull',
  'box-jumps': 'jump', 'depth-jumps': 'jump', 'tuck-jumps': 'jump',
  'broad-jumps': 'jump', 'hurdle-hops': 'jump', 'sl-box-jumps': 'jump',
  'altitude-drops': 'jump', 'standing-lj': 'jump',
  'sl-bounds': 'bound', 'bounding': 'bound', 'lateral-bounds': 'lateral',
  '10yd-sprint': 'sprint', '20yd-sprint': 'sprint', '40yd-dash': 'sprint',
  '60m-sprint': 'sprint', '100m-sprint': 'sprint', 'flying-30m': 'sprint',
  'accel-30m': 'sprint', 'buildup-80': 'sprint', 'stride-outs': 'sprint',
  'bss': 'lunge', 'step-ups': 'lunge', 'walking-lunges': 'lunge',
  'hip-thrust': 'hip_thrust',
  'plank': 'plank',
  'nordic-curl': 'curl', 'hanging-leg-raise': 'curl',
  'backpedal': 'backpedal', 'backpedal-hip-turn': 'backpedal',
  'pedal-click-close': 'backpedal', 'flip-and-run': 'backpedal',
  '5-10-5': 'lateral', 't-drill': 'lateral', 'l-drill': 'lateral',
  'ladder': 'lateral', 'cone-weaves': 'lateral', 'star-drill': 'lateral',
  'w-drill': 'lateral',
  'face-pull': 'pull', 'lateral-raise': 'raise',
  'mb-rotational': 'throw', 'mb-slam': 'throw',
  'hip-flexor-stretch': 'stretch', 'leg-swings': 'stretch', 'foam-roll': 'stretch',
  'a-skips': 'bound', 'b-skips': 'bound', 'high-knees': 'bound', 'butt-kicks': 'bound',
  'pop-ups': 'jump', 'full-approach': 'sprint', 'short-approach': 'sprint',
  'runway-marks': 'sprint', 'approach-rhythm': 'sprint',
  'penultimate-drill': 'sprint', 'hang-technique': 'jump', 'landing-drills': 'jump',
  'break-on-ball': 'sprint', 'man-coverage': 'backpedal', 'zone-drops': 'backpedal',
  'trail-technique': 'backpedal', 'ball-drills': 'throw', 'film-study': 'generic',
  'gasser': 'sprint', '300yd-shuttle': 'sprint', 'tempo-200': 'sprint', 'tempo-100': 'sprint',
};

describe('ExerciseAnimation coverage', () => {
  const exercises = seedExercises();

  it('every seeded exercise slug has an animation mapping', () => {
    const unmapped: string[] = [];
    for (const ex of exercises) {
      if (!SLUG_TO_PATTERN[ex.slug]) {
        unmapped.push(ex.slug);
      }
    }
    expect(unmapped, `These slugs have no animation: ${unmapped.join(', ')}`).toEqual([]);
  });
});
