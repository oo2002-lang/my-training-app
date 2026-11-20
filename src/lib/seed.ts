import { Exercise, Program, DayExercise, PrescribedSet, TrainingDay, Week, Block } from './types';
import { generateId } from './utils';

export function seedExercises(): Exercise[] {
  const exercises: Omit<Exercise, 'id'>[] = [
    // === SPRINTS ===
    { name: '10yd Sprint', slug: '10yd-sprint', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'both', cues: 'Explosive start, drive phase, stay low' },
    { name: '20yd Sprint', slug: '20yd-sprint', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'both' },
    { name: '40yd Dash', slug: '40yd-dash', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'both', cues: 'First 10 = drive, 10-30 = transition, 30-40 = top speed' },
    { name: '60m Sprint', slug: '60m-sprint', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'long_jump' },
    { name: '100m Sprint', slug: '100m-sprint', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'long_jump' },
    { name: 'Flying 30m', slug: 'flying-30m', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'long_jump', cues: '20m build-up into 30m at max velocity' },
    { name: 'Acceleration Runs (30m)', slug: 'accel-30m', category: 'sprint', trackingType: 'time', primaryMuscles: ['quads', 'glutes'], sport: 'both', cues: 'Focus on shin angle and arm drive' },
    { name: 'Build-Up Sprints (80%)', slug: 'buildup-80', category: 'sprint', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'both', cues: 'Gradually accelerate to 80%, coast, decelerate' },
    { name: 'Stride-Outs (70%)', slug: 'stride-outs', category: 'sprint', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], sport: 'both', cues: 'Relaxed speed, long strides, smooth turnover' },

    // === LONG JUMP DRILLS ===
    { name: 'Full Approach Jumps', slug: 'full-approach', category: 'jump_drill', trackingType: 'distance', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'long_jump', cues: 'Hit the board, attack takeoff, ride the air' },
    { name: 'Short Approach Jumps (6-step)', slug: 'short-approach', category: 'jump_drill', trackingType: 'distance', primaryMuscles: ['quads', 'glutes'], sport: 'long_jump', cues: '6 steps, focus on penultimate and takeoff' },
    { name: 'Pop-Ups', slug: 'pop-ups', category: 'jump_drill', trackingType: 'reps_only', primaryMuscles: ['calves', 'quads'], sport: 'long_jump', cues: 'Quick ground contact, tall posture at takeoff' },
    { name: 'Runway Marks Check', slug: 'runway-marks', category: 'jump_drill', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], sport: 'long_jump', cues: 'Run through, check consistency of marks' },
    { name: 'Penultimate Step Drills', slug: 'penultimate-drill', category: 'jump_drill', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], sport: 'long_jump', cues: 'Lower into penultimate, drive up on takeoff' },
    { name: 'Standing Long Jump', slug: 'standing-lj', category: 'jump_drill', trackingType: 'distance', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'long_jump' },
    { name: 'Hang Technique Reps', slug: 'hang-technique', category: 'jump_drill', trackingType: 'reps_only', primaryMuscles: ['core', 'hip flexors'], sport: 'long_jump', cues: 'Arms circle, hips forward, hold the hang' },
    { name: 'Landing Drills', slug: 'landing-drills', category: 'jump_drill', trackingType: 'reps_only', primaryMuscles: ['core', 'hamstrings'], sport: 'long_jump', cues: 'Feet shoot forward, heels lead, snap hips' },
    { name: 'Approach Rhythm Runs', slug: 'approach-rhythm', category: 'jump_drill', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], sport: 'long_jump', cues: 'Full approach run-through without jumping, nail the rhythm' },

    // === CB FOOTBALL DRILLS ===
    { name: 'Backpedal', slug: 'backpedal', category: 'cb_drill', trackingType: 'time', primaryMuscles: ['glutes', 'hamstrings', 'calves'], sport: 'cb_football', cues: 'Stay low, weight on balls of feet, short choppy steps' },
    { name: 'Backpedal to Hip Turn', slug: 'backpedal-hip-turn', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['glutes', 'hip flexors'], sport: 'cb_football', cues: 'Open hips explosively, dont false step, eyes on WR' },
    { name: 'Press Coverage Jam', slug: 'press-jam', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['chest', 'shoulders', 'core'], sport: 'cb_football', cues: 'Punch at sternum, mirror release, stay square' },
    { name: 'Break on Ball Drill', slug: 'break-on-ball', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], sport: 'cb_football', cues: 'Read QBs eyes, plant and drive, attack the ball' },
    { name: 'W-Drill', slug: 'w-drill', category: 'cb_drill', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'calves'], sport: 'cb_football', cues: 'Sharp cuts, stay low through transitions' },
    { name: 'Flip and Run', slug: 'flip-and-run', category: 'cb_drill', trackingType: 'time', primaryMuscles: ['glutes', 'hip flexors'], sport: 'cb_football', cues: 'Backpedal, flip hips 180, sprint, flip back' },
    { name: 'Man Coverage Reps', slug: 'man-coverage', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['full body'], sport: 'cb_football', cues: 'Stay in phase, mirror hips, play through hands' },
    { name: 'Zone Drop Reps', slug: 'zone-drops', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['full body'], sport: 'cb_football', cues: 'Read QB, get depth, break on throw' },
    { name: 'Ball Drills (Tips & INTs)', slug: 'ball-drills', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['hands', 'forearms'], sport: 'cb_football', cues: 'High point, diamond hands, tuck immediately' },
    { name: 'Pedal-Click-Close', slug: 'pedal-click-close', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['glutes', 'quads'], sport: 'cb_football', cues: 'Backpedal, click heels on break, close gap fast' },
    { name: 'Trail Technique Reps', slug: 'trail-technique', category: 'cb_drill', trackingType: 'reps_only', primaryMuscles: ['full body'], sport: 'cb_football', cues: 'Stay on hip, inside leverage, hand on receiver' },
    { name: 'Film Study / Walk-Through', slug: 'film-study', category: 'cb_drill', trackingType: 'duration', primaryMuscles: ['full body'], sport: 'cb_football', cues: 'Review opponent routes and tendencies' },

    // === AGILITY ===
    { name: '5-10-5 Shuttle', slug: '5-10-5', category: 'agility', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'calves'], sport: 'both' },
    { name: 'T-Drill', slug: 't-drill', category: 'agility', trackingType: 'time', primaryMuscles: ['quads', 'glutes'], sport: 'both' },
    { name: 'L-Drill (3-Cone)', slug: 'l-drill', category: 'agility', trackingType: 'time', primaryMuscles: ['quads', 'glutes'], sport: 'cb_football' },
    { name: 'Ladder Drills', slug: 'ladder', category: 'agility', trackingType: 'duration', primaryMuscles: ['calves', 'quads'], sport: 'both', cues: 'Quick feet, stay on balls of feet' },
    { name: 'Cone Weaves', slug: 'cone-weaves', category: 'agility', trackingType: 'time', primaryMuscles: ['quads', 'glutes'], sport: 'cb_football' },
    { name: 'Star Drill', slug: 'star-drill', category: 'agility', trackingType: 'time', primaryMuscles: ['quads', 'glutes', 'calves'], sport: 'cb_football', cues: 'Sprint to each cone from center, return each time' },

    // === PLYOMETRICS ===
    { name: 'Box Jumps', slug: 'box-jumps', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], equipment: 'plyo box', sport: 'both', cues: 'Full hip extension, soft landing' },
    { name: 'Depth Jumps', slug: 'depth-jumps', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['quads', 'calves'], equipment: 'plyo box', sport: 'both', cues: 'Step off, minimize ground contact, explode up' },
    { name: 'Single-Leg Bounds', slug: 'sl-bounds', category: 'plyo', trackingType: 'distance', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'both', cues: 'Drive knee, full extension, cover ground' },
    { name: 'Bounding', slug: 'bounding', category: 'plyo', trackingType: 'distance', primaryMuscles: ['quads', 'glutes', 'hamstrings'], sport: 'long_jump', cues: 'Alternate legs, big strides, stay tall' },
    { name: 'Hurdle Hops', slug: 'hurdle-hops', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['quads', 'calves'], equipment: 'hurdles', sport: 'both' },
    { name: 'Tuck Jumps', slug: 'tuck-jumps', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['quads', 'hip flexors'], sport: 'both' },
    { name: 'Broad Jumps', slug: 'broad-jumps', category: 'plyo', trackingType: 'distance', primaryMuscles: ['quads', 'glutes'], sport: 'both' },
    { name: 'Lateral Bounds', slug: 'lateral-bounds', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['glutes', 'adductors'], sport: 'cb_football', cues: 'Stick each landing, push off explosively' },
    { name: 'Single-Leg Box Jumps', slug: 'sl-box-jumps', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes'], equipment: 'plyo box', sport: 'both', cues: 'Takeoff leg only, drive knee, land soft' },
    { name: 'Altitude Drops', slug: 'altitude-drops', category: 'plyo', trackingType: 'reps_only', primaryMuscles: ['quads', 'calves'], equipment: 'plyo box', sport: 'long_jump', cues: 'Step off high box, absorb and stick the landing' },

    // === STRENGTH ===
    { name: 'Back Squat', slug: 'squat', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['quads', 'glutes'], equipment: 'barbell', sport: 'both' },
    { name: 'Front Squat', slug: 'front-squat', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['quads', 'core'], equipment: 'barbell', sport: 'both' },
    { name: 'Power Clean', slug: 'power-clean', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['full body'], equipment: 'barbell', sport: 'both', cues: 'Triple extension, pull under, catch in quarter squat' },
    { name: 'Hang Clean', slug: 'hang-clean', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['full body'], equipment: 'barbell', sport: 'both' },
    { name: 'Clean Pull', slug: 'clean-pull', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['back', 'glutes', 'hamstrings'], equipment: 'barbell', sport: 'both', cues: 'Full triple extension, shrug hard, no catch' },
    { name: 'Trap Bar Deadlift', slug: 'trap-bar-dl', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['quads', 'glutes', 'hamstrings'], equipment: 'trap bar', sport: 'both' },
    { name: 'RDL', slug: 'rdl', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['hamstrings', 'glutes'], equipment: 'barbell', sport: 'both' },
    { name: 'Hip Thrust', slug: 'hip-thrust', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', sport: 'both' },
    { name: 'Bulgarian Split Squat', slug: 'bss', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['quads', 'glutes'], equipment: 'dumbbells', sport: 'both' },
    { name: 'Step-Ups', slug: 'step-ups', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['quads', 'glutes'], equipment: 'dumbbells', sport: 'both' },
    { name: 'Nordic Hamstring Curl', slug: 'nordic-curl', category: 'strength', trackingType: 'reps_only', primaryMuscles: ['hamstrings'], sport: 'both', cues: 'Control the eccentric, hamstring injury prevention' },
    { name: 'Bench Press', slug: 'bench-press', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['chest', 'triceps'], equipment: 'barbell', sport: 'cb_football' },
    { name: 'DB Incline Press', slug: 'db-incline', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['chest', 'shoulders'], equipment: 'dumbbells', sport: 'cb_football' },
    { name: 'Weighted Pull-Ups', slug: 'weighted-pullups', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['back', 'biceps'], equipment: 'pull-up bar', sport: 'both' },
    { name: 'Single-Leg RDL', slug: 'sl-rdl', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['hamstrings', 'glutes'], equipment: 'dumbbell', sport: 'both' },
    { name: 'Goblet Squat', slug: 'goblet-squat', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['quads', 'glutes'], equipment: 'dumbbell', sport: 'both' },
    { name: 'DB Row', slug: 'db-row', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['back', 'biceps'], equipment: 'dumbbell', sport: 'both' },
    { name: 'Face Pull', slug: 'face-pull', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['rear delts', 'upper back'], equipment: 'cable', sport: 'both' },
    { name: 'Lateral Raise', slug: 'lateral-raise', category: 'strength', trackingType: 'weight_reps', primaryMuscles: ['shoulders'], equipment: 'dumbbells', sport: 'cb_football' },
    { name: 'Plank', slug: 'plank', category: 'strength', trackingType: 'duration', primaryMuscles: ['core'], sport: 'both' },
    { name: 'Hanging Leg Raise', slug: 'hanging-leg-raise', category: 'strength', trackingType: 'reps_only', primaryMuscles: ['core', 'hip flexors'], sport: 'both' },
    { name: 'Med Ball Rotational Throw', slug: 'mb-rotational', category: 'strength', trackingType: 'reps_only', primaryMuscles: ['core', 'obliques'], equipment: 'med ball', sport: 'both' },
    { name: 'Med Ball Overhead Slam', slug: 'mb-slam', category: 'strength', trackingType: 'reps_only', primaryMuscles: ['core', 'lats', 'shoulders'], equipment: 'med ball', sport: 'both' },

    // === MOBILITY / CONDITIONING ===
    { name: 'Hip Flexor Stretch', slug: 'hip-flexor-stretch', category: 'mobility', trackingType: 'duration', primaryMuscles: ['hip flexors'], sport: 'both' },
    { name: 'A-Skips', slug: 'a-skips', category: 'mobility', trackingType: 'reps_only', primaryMuscles: ['hip flexors', 'calves'], sport: 'both', cues: 'Drive knee, dorsiflexed ankle, quick ground contact' },
    { name: 'B-Skips', slug: 'b-skips', category: 'mobility', trackingType: 'reps_only', primaryMuscles: ['hamstrings', 'hip flexors'], sport: 'both', cues: 'Extend, claw back, cycle the leg' },
    { name: 'High Knees', slug: 'high-knees', category: 'mobility', trackingType: 'duration', primaryMuscles: ['hip flexors', 'calves'], sport: 'both' },
    { name: 'Butt Kicks', slug: 'butt-kicks', category: 'mobility', trackingType: 'duration', primaryMuscles: ['hamstrings'], sport: 'both' },
    { name: 'Walking Lunges', slug: 'walking-lunges', category: 'mobility', trackingType: 'reps_only', primaryMuscles: ['quads', 'glutes', 'hip flexors'], sport: 'both' },
    { name: 'Leg Swings', slug: 'leg-swings', category: 'mobility', trackingType: 'reps_only', primaryMuscles: ['hip flexors', 'hamstrings'], sport: 'both', cues: 'Front-back and side-to-side, controlled' },
    { name: 'Foam Roll', slug: 'foam-roll', category: 'mobility', trackingType: 'duration', primaryMuscles: ['full body'], sport: 'both' },
    { name: 'Tempo Run (200m)', slug: 'tempo-200', category: 'conditioning', trackingType: 'time', primaryMuscles: ['full body'], sport: 'both', cues: '70-75% effort, focus on form' },
    { name: 'Gasser (Sideline to Sideline)', slug: 'gasser', category: 'conditioning', trackingType: 'time', primaryMuscles: ['full body'], sport: 'cb_football' },
    { name: '300yd Shuttle', slug: '300yd-shuttle', category: 'conditioning', trackingType: 'time', primaryMuscles: ['full body'], sport: 'cb_football', cues: '25yd back and forth x6' },
    { name: 'Tempo Run (100m)', slug: 'tempo-100', category: 'conditioning', trackingType: 'time', primaryMuscles: ['full body'], sport: 'both', cues: '65-70% effort, active recovery' },
  ];

  return exercises.map(e => ({ ...e, id: generateId() }));
}

function makeSet(n: number, type: PrescribedSet['setType'], overrides: Partial<PrescribedSet> = {}): PrescribedSet[] {
  return Array.from({ length: n }, (_, i) => ({
    setNumber: i + 1,
    setType: type,
    targetReps: null,
    targetRpe: null,
    intensityPct: null,
    targetWeightKg: null,
    targetTime: null,
    targetDistance: null,
    targetDuration: null,
    restSeconds: 120,
    ...overrides,
  }));
}

function de(exerciseId: string, sortOrder: number, section: DayExercise['section'], sets: PrescribedSet[], notes?: string): DayExercise {
  return { id: generateId(), exerciseId, sortOrder, section, supersetGroup: null, notes, sets };
}

export function seedPrograms(exercises: Exercise[]): Program[] {
  const f = (slug: string) => exercises.find(e => e.slug === slug)!.id;

  function buildWeeks(days: TrainingDay[], numWeeks: number, deloadLast = true): Week[] {
    return Array.from({ length: numWeeks }, (_, i) => ({
      id: generateId(),
      weekNumber: i + 1,
      isDeload: deloadLast && i === numWeeks - 1,
      status: i === 0 ? 'active' as const : 'upcoming' as const,
      days: days.map(d => ({
        ...d,
        id: generateId(),
        exercises: d.exercises.map(ex => ({ ...ex, id: generateId() })),
      })),
    }));
  }

  // ================================================================
  //  1. LONG JUMP — OFF-SEASON
  //  High volume, build top-end speed, explosive power, and technique
  //  4 days/week, 6-week block
  // ================================================================
  const ljOff1: TrainingDay = {
    id: generateId(), dayNumber: 1, label: 'Speed & Approaches', sortOrder: 1,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 20, restSeconds: 30 })),
      de(f('b-skips'), 2, 'warmup', makeSet(2, 'warmup', { targetReps: 20, restSeconds: 30 })),
      de(f('leg-swings'), 3, 'warmup', makeSet(2, 'warmup', { targetReps: 10, restSeconds: 20 })),
      de(f('accel-30m'), 4, 'main', makeSet(4, 'working', { targetRpe: 9, restSeconds: 180 }), 'Full effort from 3-point'),
      de(f('flying-30m'), 5, 'main', makeSet(3, 'working', { targetRpe: 9.5, restSeconds: 240 }), 'Build-up zone then max velocity'),
      de(f('short-approach'), 6, 'main', makeSet(6, 'working', { targetRpe: 8, restSeconds: 240 }), '6-step, work the penultimate-takeoff connection'),
      de(f('pop-ups'), 7, 'accessory', makeSet(3, 'working', { targetReps: 8, restSeconds: 90 })),
      de(f('hip-flexor-stretch'), 8, 'cooldown', makeSet(2, 'working', { targetDuration: 60, restSeconds: 0 })),
    ],
  };
  const ljOff2: TrainingDay = {
    id: generateId(), dayNumber: 2, label: 'Max Strength', sortOrder: 2,
    exercises: [
      de(f('power-clean'), 1, 'main', makeSet(5, 'working', { targetReps: 3, targetRpe: 8, intensityPct: 80, restSeconds: 180 }), 'Explosive triple extension'),
      de(f('squat'), 2, 'main', makeSet(4, 'working', { targetReps: 5, targetRpe: 7.5, intensityPct: 80, restSeconds: 180 })),
      de(f('rdl'), 3, 'main', makeSet(4, 'working', { targetReps: 6, targetRpe: 7, intensityPct: 72.5, restSeconds: 120 })),
      de(f('bss'), 4, 'accessory', makeSet(3, 'working', { targetReps: 8, targetRpe: 7, restSeconds: 90 }), 'Each leg'),
      de(f('nordic-curl'), 5, 'accessory', makeSet(3, 'working', { targetReps: 5, targetRpe: 8, restSeconds: 90 }), 'Injury prevention — control the eccentric'),
      de(f('hip-thrust'), 6, 'accessory', makeSet(3, 'working', { targetReps: 8, targetRpe: 7, intensityPct: 72.5, restSeconds: 90 })),
      de(f('hanging-leg-raise'), 7, 'accessory', makeSet(3, 'working', { targetReps: 12, restSeconds: 60 })),
    ],
  };
  const ljOff3: TrainingDay = {
    id: generateId(), dayNumber: 3, label: 'Plyos & Technique', sortOrder: 3,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 20, restSeconds: 30 })),
      de(f('bounding'), 2, 'main', makeSet(5, 'working', { targetRpe: 8.5, restSeconds: 180 }), '30-40m, max distance per bound'),
      de(f('depth-jumps'), 3, 'main', makeSet(4, 'working', { targetReps: 5, targetRpe: 8.5, restSeconds: 150 }), 'Minimize ground contact'),
      de(f('sl-bounds'), 4, 'main', makeSet(4, 'working', { targetRpe: 8, restSeconds: 150 }), 'Each leg, 20m'),
      de(f('hurdle-hops'), 5, 'main', makeSet(3, 'working', { targetReps: 6, targetRpe: 7.5, restSeconds: 120 })),
      de(f('hang-technique'), 6, 'accessory', makeSet(6, 'working', { targetReps: 3, restSeconds: 90 }), 'Walk-through then jog-through'),
      de(f('landing-drills'), 7, 'accessory', makeSet(5, 'working', { targetReps: 3, restSeconds: 60 })),
      de(f('standing-lj'), 8, 'accessory', makeSet(5, 'working', { targetRpe: 8, restSeconds: 120 })),
    ],
  };
  const ljOff4: TrainingDay = {
    id: generateId(), dayNumber: 4, label: 'Full Approach & Power', sortOrder: 4,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 20, restSeconds: 30 })),
      de(f('buildup-80'), 2, 'warmup', makeSet(2, 'warmup', { targetReps: 2, restSeconds: 60 })),
      de(f('runway-marks'), 3, 'main', makeSet(3, 'working', { targetReps: 1, restSeconds: 240 }), 'Dial in marks, adjust if needed'),
      de(f('full-approach'), 4, 'main', makeSet(6, 'working', { targetRpe: 9.5, restSeconds: 300 }), 'Full competition jumps — track every distance'),
      de(f('clean-pull'), 5, 'accessory', makeSet(3, 'working', { targetReps: 3, targetRpe: 8, intensityPct: 85, restSeconds: 150 })),
      de(f('step-ups'), 6, 'accessory', makeSet(3, 'working', { targetReps: 6, targetRpe: 7, restSeconds: 90 }), 'Each leg, explosive'),
      de(f('tempo-200'), 7, 'cooldown', makeSet(3, 'working', { targetRpe: 6, restSeconds: 120 }), '70% effort, flush lactic acid'),
    ],
  };

  const ljOffSeason: Program = {
    id: generateId(),
    name: 'Long Jump — Off-Season',
    description: 'High-volume block to build top-end speed, explosive power, and dial in approach/takeoff technique. 4 days/week, 6 weeks.',
    status: 'active',
    sport: 'long_jump',
    startDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    blocks: [
      { id: generateId(), name: 'Speed & Power', sortOrder: 1, numWeeks: 6, focus: 'speed', weeks: buildWeeks([ljOff1, ljOff2, ljOff3, ljOff4], 6) },
    ],
  };

  // ================================================================
  //  2. LONG JUMP — IN-SEASON
  //  Lower volume, maintain strength/speed, peak for meets
  //  3 days/week, 8-week block (competition season length)
  // ================================================================
  const ljIn1: TrainingDay = {
    id: generateId(), dayNumber: 1, label: 'Speed Maintenance', sortOrder: 1,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 15, restSeconds: 30 })),
      de(f('stride-outs'), 2, 'warmup', makeSet(3, 'warmup', { targetReps: 1, restSeconds: 60 }), '70% over 60m'),
      de(f('accel-30m'), 3, 'main', makeSet(3, 'working', { targetRpe: 9, restSeconds: 180 }), 'Quality over quantity'),
      de(f('approach-rhythm'), 4, 'main', makeSet(3, 'working', { targetReps: 1, restSeconds: 180 }), 'Full run-through, no jump — keep the rhythm sharp'),
      de(f('short-approach'), 5, 'main', makeSet(3, 'working', { targetRpe: 8, restSeconds: 180 }), 'Technical work, stay smooth'),
      de(f('hip-flexor-stretch'), 6, 'cooldown', makeSet(2, 'working', { targetDuration: 60, restSeconds: 0 })),
    ],
  };
  const ljIn2: TrainingDay = {
    id: generateId(), dayNumber: 2, label: 'Strength Maintenance', sortOrder: 2,
    exercises: [
      de(f('hang-clean'), 1, 'main', makeSet(3, 'working', { targetReps: 2, targetRpe: 7.5, intensityPct: 78, restSeconds: 150 }), 'Stay fast, keep the CNS sharp'),
      de(f('squat'), 2, 'main', makeSet(3, 'working', { targetReps: 3, targetRpe: 7, intensityPct: 82.5, restSeconds: 180 }), 'Heavy but low volume — maintain, dont build'),
      de(f('sl-rdl'), 3, 'accessory', makeSet(2, 'working', { targetReps: 6, targetRpe: 6.5, restSeconds: 90 }), 'Each leg, prehab'),
      de(f('nordic-curl'), 4, 'accessory', makeSet(2, 'working', { targetReps: 4, targetRpe: 7, restSeconds: 90 }), 'Hamstring health'),
      de(f('plank'), 5, 'accessory', makeSet(2, 'working', { targetDuration: 45, restSeconds: 60 })),
      de(f('foam-roll'), 6, 'cooldown', makeSet(1, 'working', { targetDuration: 300, restSeconds: 0 }), 'Full body, focus on problem areas'),
    ],
  };
  const ljIn3: TrainingDay = {
    id: generateId(), dayNumber: 3, label: 'Pre-Meet Activation', sortOrder: 3,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 15, restSeconds: 30 })),
      de(f('buildup-80'), 2, 'warmup', makeSet(3, 'warmup', { targetReps: 1, restSeconds: 60 })),
      de(f('box-jumps'), 3, 'main', makeSet(3, 'working', { targetReps: 3, targetRpe: 7, restSeconds: 90 }), 'CNS activation, not fatigue'),
      de(f('standing-lj'), 4, 'main', makeSet(3, 'working', { targetRpe: 7, restSeconds: 90 }), 'Feel the ground, stay explosive'),
      de(f('pop-ups'), 5, 'accessory', makeSet(2, 'working', { targetReps: 6, restSeconds: 60 }), 'Quick and snappy'),
      de(f('runway-marks'), 6, 'accessory', makeSet(2, 'working', { targetReps: 1, restSeconds: 180 }), 'Confidence check'),
      de(f('hip-flexor-stretch'), 7, 'cooldown', makeSet(2, 'working', { targetDuration: 60, restSeconds: 0 })),
    ],
  };

  const ljInSeason: Program = {
    id: generateId(),
    name: 'Long Jump — In-Season',
    description: 'Competition phase: maintain speed and strength, stay fresh for meets. Low volume, high intent. 3 days/week.',
    status: 'active',
    sport: 'long_jump',
    createdAt: new Date().toISOString(),
    blocks: [
      { id: generateId(), name: 'Competition', sortOrder: 1, numWeeks: 8, focus: 'competition_prep', weeks: buildWeeks([ljIn1, ljIn2, ljIn3], 8, false) },
    ],
  };

  // ================================================================
  //  3. CB FOOTBALL — OFF-SEASON
  //  Build the engine: speed, agility, coverage skills, strength
  //  4 days/week, 6-week block
  // ================================================================
  const cbOff1: TrainingDay = {
    id: generateId(), dayNumber: 1, label: 'Speed & Agility', sortOrder: 1,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 20, restSeconds: 30 })),
      de(f('ladder'), 2, 'warmup', makeSet(2, 'warmup', { targetDuration: 60, restSeconds: 30 }), 'Icky shuffle, in-out, crossover'),
      de(f('10yd-sprint'), 3, 'main', makeSet(5, 'working', { targetRpe: 9.5, restSeconds: 90 }), 'Explosive starts — this is your bread and butter'),
      de(f('40yd-dash'), 4, 'main', makeSet(3, 'working', { targetRpe: 10, restSeconds: 240 }), 'Full send'),
      de(f('5-10-5'), 5, 'main', makeSet(4, 'working', { targetRpe: 9, restSeconds: 120 }), 'Low hips, explode out of cuts'),
      de(f('l-drill'), 6, 'main', makeSet(3, 'working', { targetRpe: 9, restSeconds: 120 })),
      de(f('star-drill'), 7, 'accessory', makeSet(3, 'working', { targetRpe: 8, restSeconds: 120 })),
      de(f('tempo-200'), 8, 'cooldown', makeSet(2, 'working', { targetRpe: 6, restSeconds: 120 })),
    ],
  };
  const cbOff2: TrainingDay = {
    id: generateId(), dayNumber: 2, label: 'Coverage & Technique', sortOrder: 2,
    exercises: [
      de(f('backpedal'), 1, 'warmup', makeSet(3, 'warmup', { targetRpe: 6, restSeconds: 30 }), '15yd, focus on form'),
      de(f('backpedal-hip-turn'), 2, 'main', makeSet(6, 'working', { targetReps: 4, targetRpe: 8, restSeconds: 60 }), 'Both directions, speed up weekly'),
      de(f('press-jam'), 3, 'main', makeSet(6, 'working', { targetReps: 4, targetRpe: 7, restSeconds: 60 }), 'Inside, outside, and speed releases'),
      de(f('pedal-click-close'), 4, 'main', makeSet(5, 'working', { targetReps: 4, targetRpe: 8, restSeconds: 60 })),
      de(f('break-on-ball'), 5, 'main', makeSet(5, 'working', { targetReps: 4, targetRpe: 8, restSeconds: 90 })),
      de(f('flip-and-run'), 6, 'main', makeSet(4, 'working', { targetRpe: 8.5, restSeconds: 90 })),
      de(f('man-coverage'), 7, 'main', makeSet(6, 'working', { targetReps: 3, targetRpe: 8, restSeconds: 60 }), 'vs scout team WR'),
      de(f('ball-drills'), 8, 'accessory', makeSet(3, 'working', { targetReps: 10, restSeconds: 60 }), 'JUGS or partner throws — catch everything'),
    ],
  };
  const cbOff3: TrainingDay = {
    id: generateId(), dayNumber: 3, label: 'Strength & Power', sortOrder: 3,
    exercises: [
      de(f('hang-clean'), 1, 'main', makeSet(5, 'working', { targetReps: 3, targetRpe: 8, intensityPct: 80, restSeconds: 180 })),
      de(f('trap-bar-dl'), 2, 'main', makeSet(4, 'working', { targetReps: 5, targetRpe: 7.5, intensityPct: 80, restSeconds: 180 })),
      de(f('bench-press'), 3, 'main', makeSet(4, 'working', { targetReps: 5, targetRpe: 7.5, intensityPct: 80, restSeconds: 150 }), 'Need the pressing power for jams'),
      de(f('bss'), 4, 'accessory', makeSet(3, 'working', { targetReps: 8, targetRpe: 7, restSeconds: 90 }), 'Each leg'),
      de(f('weighted-pullups'), 5, 'accessory', makeSet(4, 'working', { targetReps: 5, targetRpe: 7.5, restSeconds: 90 })),
      de(f('nordic-curl'), 6, 'accessory', makeSet(3, 'working', { targetReps: 5, targetRpe: 8, restSeconds: 90 })),
      de(f('face-pull'), 7, 'accessory', makeSet(3, 'working', { targetReps: 12, targetRpe: 6.5, restSeconds: 60 })),
      de(f('mb-rotational'), 8, 'accessory', makeSet(3, 'working', { targetReps: 8, restSeconds: 60 }), 'Each side — rotational power for pressing'),
    ],
  };
  const cbOff4: TrainingDay = {
    id: generateId(), dayNumber: 4, label: 'Explosiveness & Drills', sortOrder: 4,
    exercises: [
      de(f('box-jumps'), 1, 'main', makeSet(4, 'working', { targetReps: 5, targetRpe: 7.5, restSeconds: 120 })),
      de(f('lateral-bounds'), 2, 'main', makeSet(4, 'working', { targetReps: 6, targetRpe: 8, restSeconds: 90 }), 'Each direction — mimic lateral cuts'),
      de(f('broad-jumps'), 3, 'main', makeSet(4, 'working', { targetReps: 3, targetRpe: 8, restSeconds: 120 })),
      de(f('depth-jumps'), 4, 'main', makeSet(3, 'working', { targetReps: 5, targetRpe: 8.5, restSeconds: 150 })),
      de(f('w-drill'), 5, 'accessory', makeSet(4, 'working', { targetRpe: 8, restSeconds: 90 })),
      de(f('cone-weaves'), 6, 'accessory', makeSet(3, 'working', { targetRpe: 8, restSeconds: 90 })),
      de(f('zone-drops'), 7, 'accessory', makeSet(4, 'working', { targetReps: 3, targetRpe: 7, restSeconds: 60 })),
      de(f('gasser'), 8, 'cooldown', makeSet(3, 'working', { targetRpe: 8, restSeconds: 120 }), 'Conditioning — push through'),
    ],
  };

  const cbOffSeason: Program = {
    id: generateId(),
    name: 'CB Football — Off-Season',
    description: 'Build the engine: top-end speed, change of direction, coverage technique, and functional strength. 4 days/week, 6 weeks.',
    status: 'active',
    sport: 'cb_football',
    createdAt: new Date().toISOString(),
    blocks: [
      { id: generateId(), name: 'Speed & Coverage', sortOrder: 1, numWeeks: 6, focus: 'speed', weeks: buildWeeks([cbOff1, cbOff2, cbOff3, cbOff4], 6) },
    ],
  };

  // ================================================================
  //  4. CB FOOTBALL — IN-SEASON
  //  Maintain, recover, game prep. Don't dig a hole.
  //  3 days/week, 10-week block (season length)
  //  Day 1 = post-game recovery (Mon), Day 2 = maintenance (Wed),
  //  Day 3 = pre-game activation (Fri)
  // ================================================================
  const cbIn1: TrainingDay = {
    id: generateId(), dayNumber: 1, label: 'Recovery & Film (Mon)', sortOrder: 1,
    exercises: [
      de(f('foam-roll'), 1, 'warmup', makeSet(1, 'warmup', { targetDuration: 300, restSeconds: 0 }), 'Full body, 5 min'),
      de(f('walking-lunges'), 2, 'warmup', makeSet(2, 'warmup', { targetReps: 10, restSeconds: 30 }), 'Flush blood, light'),
      de(f('hip-flexor-stretch'), 3, 'warmup', makeSet(2, 'warmup', { targetDuration: 60, restSeconds: 0 })),
      de(f('tempo-100'), 4, 'main', makeSet(4, 'working', { targetRpe: 5, restSeconds: 60 }), 'Active recovery, NOT sprinting'),
      de(f('film-study'), 5, 'main', makeSet(1, 'working', { targetDuration: 1200, restSeconds: 0 }), 'Review last game + scout next opponent'),
      de(f('trail-technique'), 6, 'accessory', makeSet(4, 'working', { targetReps: 3, targetRpe: 5, restSeconds: 30 }), 'Walk-through speed, pattern recognition'),
    ],
  };
  const cbIn2: TrainingDay = {
    id: generateId(), dayNumber: 2, label: 'Maintain Strength (Wed)', sortOrder: 2,
    exercises: [
      de(f('hang-clean'), 1, 'main', makeSet(3, 'working', { targetReps: 2, targetRpe: 7, intensityPct: 75, restSeconds: 150 }), 'Stay fast, low volume'),
      de(f('squat'), 2, 'main', makeSet(3, 'working', { targetReps: 3, targetRpe: 7, intensityPct: 80, restSeconds: 150 }), 'Maintain, dont chase PRs'),
      de(f('bench-press'), 3, 'main', makeSet(3, 'working', { targetReps: 4, targetRpe: 7, intensityPct: 77.5, restSeconds: 120 })),
      de(f('db-row'), 4, 'accessory', makeSet(2, 'working', { targetReps: 8, targetRpe: 6.5, restSeconds: 60 })),
      de(f('nordic-curl'), 5, 'accessory', makeSet(2, 'working', { targetReps: 4, targetRpe: 7, restSeconds: 60 }), 'Non-negotiable — protect the hammies'),
      de(f('plank'), 6, 'accessory', makeSet(2, 'working', { targetDuration: 30, restSeconds: 30 })),
    ],
  };
  const cbIn3: TrainingDay = {
    id: generateId(), dayNumber: 3, label: 'Pre-Game Activation (Fri)', sortOrder: 3,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 15, restSeconds: 20 })),
      de(f('ladder'), 2, 'warmup', makeSet(2, 'warmup', { targetDuration: 45, restSeconds: 20 }), 'Quick feet, wake up the CNS'),
      de(f('10yd-sprint'), 3, 'main', makeSet(3, 'working', { targetRpe: 8.5, restSeconds: 90 }), 'Activation, not exhaustion'),
      de(f('backpedal-hip-turn'), 4, 'main', makeSet(4, 'working', { targetReps: 3, targetRpe: 7, restSeconds: 45 }), 'Stay sharp'),
      de(f('press-jam'), 5, 'main', makeSet(3, 'working', { targetReps: 3, targetRpe: 6.5, restSeconds: 45 }), 'Light — feel the technique'),
      de(f('ball-drills'), 6, 'accessory', makeSet(2, 'working', { targetReps: 8, restSeconds: 30 }), 'Soft hands, eyes on the ball'),
      de(f('hip-flexor-stretch'), 7, 'cooldown', makeSet(2, 'working', { targetDuration: 60, restSeconds: 0 })),
    ],
  };

  const cbInSeason: Program = {
    id: generateId(),
    name: 'CB Football — In-Season',
    description: 'Game-week structure: Monday recovery + film, Wednesday strength maintenance, Friday pre-game activation. Stay healthy, stay sharp. 3 days/week.',
    status: 'active',
    sport: 'cb_football',
    createdAt: new Date().toISOString(),
    blocks: [
      { id: generateId(), name: 'Competition', sortOrder: 1, numWeeks: 10, focus: 'competition_prep', weeks: buildWeeks([cbIn1, cbIn2, cbIn3], 10, false) },
    ],
  };

  // ================================================================
  //  5. DUAL-SPORT (Training Both Simultaneously)
  //  When you're running track AND playing football
  //  Balances both — doesn't bury you
  //  4 days/week, 5-week block
  // ================================================================
  const dual1: TrainingDay = {
    id: generateId(), dayNumber: 1, label: 'Sprint & Agility', sortOrder: 1,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 20, restSeconds: 30 })),
      de(f('leg-swings'), 2, 'warmup', makeSet(2, 'warmup', { targetReps: 10, restSeconds: 20 })),
      de(f('accel-30m'), 3, 'main', makeSet(4, 'working', { targetRpe: 9, restSeconds: 180 }), 'Shared asset — sprint speed feeds both sports'),
      de(f('20yd-sprint'), 4, 'main', makeSet(3, 'working', { targetRpe: 9.5, restSeconds: 120 })),
      de(f('5-10-5'), 5, 'main', makeSet(3, 'working', { targetRpe: 9, restSeconds: 120 })),
      de(f('backpedal-hip-turn'), 6, 'accessory', makeSet(4, 'working', { targetReps: 4, targetRpe: 7.5, restSeconds: 60 })),
      de(f('tempo-100'), 7, 'cooldown', makeSet(2, 'working', { targetRpe: 5, restSeconds: 60 })),
    ],
  };
  const dual2: TrainingDay = {
    id: generateId(), dayNumber: 2, label: 'Strength', sortOrder: 2,
    exercises: [
      de(f('power-clean'), 1, 'main', makeSet(4, 'working', { targetReps: 3, targetRpe: 8, intensityPct: 80, restSeconds: 180 })),
      de(f('squat'), 2, 'main', makeSet(4, 'working', { targetReps: 4, targetRpe: 7.5, intensityPct: 80, restSeconds: 180 })),
      de(f('bench-press'), 3, 'main', makeSet(3, 'working', { targetReps: 5, targetRpe: 7, intensityPct: 77.5, restSeconds: 150 })),
      de(f('rdl'), 4, 'accessory', makeSet(3, 'working', { targetReps: 6, targetRpe: 7, intensityPct: 72.5, restSeconds: 120 })),
      de(f('weighted-pullups'), 5, 'accessory', makeSet(3, 'working', { targetReps: 5, targetRpe: 7, restSeconds: 90 })),
      de(f('nordic-curl'), 6, 'accessory', makeSet(3, 'working', { targetReps: 5, targetRpe: 8, restSeconds: 90 })),
      de(f('mb-slam'), 7, 'accessory', makeSet(3, 'working', { targetReps: 8, restSeconds: 60 })),
    ],
  };
  const dual3: TrainingDay = {
    id: generateId(), dayNumber: 3, label: 'Jumps & Plyos', sortOrder: 3,
    exercises: [
      de(f('a-skips'), 1, 'warmup', makeSet(2, 'warmup', { targetReps: 15, restSeconds: 30 })),
      de(f('short-approach'), 2, 'main', makeSet(5, 'working', { targetRpe: 8, restSeconds: 240 }), 'LJ technique work'),
      de(f('bounding'), 3, 'main', makeSet(4, 'working', { targetRpe: 8, restSeconds: 180 })),
      de(f('box-jumps'), 4, 'main', makeSet(3, 'working', { targetReps: 5, targetRpe: 7.5, restSeconds: 120 })),
      de(f('lateral-bounds'), 5, 'accessory', makeSet(3, 'working', { targetReps: 6, targetRpe: 7.5, restSeconds: 90 }), 'CB lateral movement'),
      de(f('standing-lj'), 6, 'accessory', makeSet(4, 'working', { targetRpe: 8, restSeconds: 120 })),
      de(f('hip-flexor-stretch'), 7, 'cooldown', makeSet(2, 'working', { targetDuration: 60, restSeconds: 0 })),
    ],
  };
  const dual4: TrainingDay = {
    id: generateId(), dayNumber: 4, label: 'CB Technique', sortOrder: 4,
    exercises: [
      de(f('backpedal'), 1, 'warmup', makeSet(3, 'warmup', { targetRpe: 6, restSeconds: 30 }), '15yd'),
      de(f('press-jam'), 2, 'main', makeSet(5, 'working', { targetReps: 4, targetRpe: 7.5, restSeconds: 60 })),
      de(f('pedal-click-close'), 3, 'main', makeSet(4, 'working', { targetReps: 4, targetRpe: 8, restSeconds: 60 })),
      de(f('break-on-ball'), 4, 'main', makeSet(5, 'working', { targetReps: 4, targetRpe: 8, restSeconds: 90 })),
      de(f('man-coverage'), 5, 'main', makeSet(5, 'working', { targetReps: 3, targetRpe: 8, restSeconds: 60 })),
      de(f('ball-drills'), 6, 'accessory', makeSet(3, 'working', { targetReps: 10, restSeconds: 60 })),
      de(f('zone-drops'), 7, 'accessory', makeSet(3, 'working', { targetReps: 3, targetRpe: 7, restSeconds: 60 })),
      de(f('foam-roll'), 8, 'cooldown', makeSet(1, 'working', { targetDuration: 300, restSeconds: 0 })),
    ],
  };

  const dualSport: Program = {
    id: generateId(),
    name: 'Dual-Sport: LJ + CB',
    description: 'For when you\'re training both long jump and cornerback simultaneously. Balanced load so you don\'t burn out. 4 days/week, 5 weeks.',
    status: 'active',
    sport: 'combined',
    createdAt: new Date().toISOString(),
    blocks: [
      { id: generateId(), name: 'General Prep', sortOrder: 1, numWeeks: 5, focus: 'general', weeks: buildWeeks([dual1, dual2, dual3, dual4], 5) },
    ],
  };

  return [ljOffSeason, ljInSeason, cbOffSeason, cbInSeason, dualSport];
}
