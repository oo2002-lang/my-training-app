# Strength Training App — Clean-Room Specification

## Conceptual Overview

### How It All Fits Together

A strength training app revolves around one loop: **prescribe → perform → record → adapt**.

A **program** is a multi-week training plan. It's divided into **blocks** (typically 3–6 weeks each), which contain **weeks**, which contain **training days**. Each training day lists the **exercises** the athlete should perform, grouped into sections (warm-up, main work, accessories). Each exercise has one or more **sets** with prescribed targets: a weight (or intensity) and a rep count.

When the athlete trains, they work through each set and log what they actually lifted — the **actual weight** and **actual reps**. After the session, they rate how hard it felt on the **RPE scale** (Rate of Perceived Exertion, 1–10), and optionally answer a quick wellness check (sleep, soreness, energy).

The system uses the recorded performance plus RPE to estimate the athlete's **e1RM** (estimated one-rep max) for each exercise. That e1RM feeds back into the next session's prescriptions: if the athlete is progressing, loads go up; if RPE is consistently high or performance dips, the system holds or reduces load. This is **auto-regulation** — the program adapts to the athlete rather than following a rigid percentage chart.

### Key Concepts

**RPE (Rate of Perceived Exertion):** A 1–10 scale where 10 means maximum effort (couldn't do another rep) and 6 means very easy (4+ reps left in reserve). RPE is collected per-session as an overall difficulty rating. Combined with actual load/reps, it allows e1RM estimation via Epley or similar formulas adjusted for perceived difficulty.

**e1RM (Estimated One-Rep Max):** The calculated maximum weight an athlete could lift for one rep on a given exercise, derived from their recent performance. Rather than testing a true 1RM (which is fatiguing and risky), the system infers it from submaximal sets. e1RM is the basis for prescribing future loads as a percentage of max.

**Auto-Regulation:** Instead of fixed percentages that ignore daily readiness, an auto-regulated program adjusts loads based on recent e1RM trends and session RPE. If an athlete reports RPE 9 on sets prescribed at RPE 7, the system knows they're fatigued and can reduce next session's loads.

**Periodization:** Programs are structured into blocks with different training emphases (hypertrophy → strength → peaking). Each block manipulates volume (sets × reps) and intensity (% of e1RM) to drive long-term progression while managing fatigue.

---

## Database Schema (PostgreSQL)

### Users & Auth

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    unit_system     TEXT NOT NULL DEFAULT 'metric'  -- 'metric' | 'imperial'
        CHECK (unit_system IN ('metric', 'imperial')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Exercise Library

```sql
CREATE TABLE exercises (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    category        TEXT NOT NULL
        CHECK (category IN (
            'barbell_compound', 'dumbbell', 'bodyweight',
            'machine', 'cable', 'kettlebell', 'cardio', 'other'
        )),
    primary_muscles TEXT[] NOT NULL DEFAULT '{}',   -- e.g. {'chest', 'triceps'}
    equipment       TEXT,                            -- e.g. 'barbell', 'pull-up bar'
    is_unilateral   BOOLEAN NOT NULL DEFAULT false,
    track_weight    BOOLEAN NOT NULL DEFAULT true,   -- false for bodyweight-only
    created_by      UUID REFERENCES users(id),       -- NULL = system-provided
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_slug ON exercises(slug);
```

### Programs & Structure

```sql
CREATE TABLE programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'paused', 'archived', 'completed')),
    start_date      DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blocks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,              -- e.g. 'Hypertrophy', 'Strength', 'Deload'
    sort_order      SMALLINT NOT NULL,
    num_weeks       SMALLINT NOT NULL DEFAULT 4,
    focus           TEXT NOT NULL DEFAULT 'general'
        CHECK (focus IN ('hypertrophy', 'strength', 'peaking', 'deload', 'general')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE weeks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id        UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    week_number     SMALLINT NOT NULL,          -- 1-indexed within the block
    is_deload       BOOLEAN NOT NULL DEFAULT false,
    status          TEXT NOT NULL DEFAULT 'upcoming'
        CHECK (status IN ('upcoming', 'active', 'completed')),
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ
);

CREATE TABLE training_days (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id         UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    day_number      SMALLINT NOT NULL,          -- 1-indexed within the week
    label           TEXT,                        -- e.g. 'Upper A', 'Lower B', 'Full Body'
    sort_order      SMALLINT NOT NULL
);
```

### Exercise Prescriptions (the Plan)

```sql
CREATE TABLE day_exercises (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_day_id UUID NOT NULL REFERENCES training_days(id) ON DELETE CASCADE,
    exercise_id     UUID NOT NULL REFERENCES exercises(id),
    sort_order      SMALLINT NOT NULL,
    section         TEXT NOT NULL DEFAULT 'main'
        CHECK (section IN ('warmup', 'main', 'accessory', 'cooldown')),
    superset_group  SMALLINT,                   -- NULL = standalone, same int = grouped
    notes           TEXT
);

CREATE TABLE prescribed_sets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_exercise_id     UUID NOT NULL REFERENCES day_exercises(id) ON DELETE CASCADE,
    set_number          SMALLINT NOT NULL,       -- 1-indexed
    set_type            TEXT NOT NULL DEFAULT 'working'
        CHECK (set_type IN ('warmup', 'working', 'backoff', 'dropset', 'amrap')),
    target_reps         SMALLINT,                -- NULL for AMRAP
    target_rpe          NUMERIC(3,1),            -- e.g. 7.0, 8.5; NULL = no RPE target
    intensity_pct       NUMERIC(5,2),            -- % of e1RM, e.g. 72.50; NULL = auto
    target_weight_kg    NUMERIC(7,2),            -- resolved weight; NULL = compute from e1RM
    rest_seconds        SMALLINT DEFAULT 120
);
```

### Workout Logging (the Performance)

```sql
CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    training_day_id UUID REFERENCES training_days(id),  -- NULL = freestyle session
    started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ,
    session_rpe     SMALLINT CHECK (session_rpe BETWEEN 1 AND 10),
    session_mood    SMALLINT CHECK (session_mood BETWEEN 1 AND 5),
    notes           TEXT,
    duration_secs   INT GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (completed_at - started_at))::INT
    ) STORED
);

CREATE TABLE logged_sets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    exercise_id         UUID NOT NULL REFERENCES exercises(id),
    prescribed_set_id   UUID REFERENCES prescribed_sets(id), -- NULL = ad-hoc set
    set_number          SMALLINT NOT NULL,
    actual_weight_kg    NUMERIC(7,2),
    actual_reps         SMALLINT NOT NULL,
    actual_rpe          NUMERIC(3,1),            -- per-set RPE (optional)
    is_warmup           BOOLEAN NOT NULL DEFAULT false,
    completed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_logged_sets_session ON logged_sets(session_id);
CREATE INDEX idx_logged_sets_exercise ON logged_sets(exercise_id);
```

### e1RM Tracking & Auto-Regulation

```sql
CREATE TABLE e1rm_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id     UUID NOT NULL REFERENCES exercises(id),
    estimated_max   NUMERIC(7,2) NOT NULL,       -- in kg
    source_set_id   UUID REFERENCES logged_sets(id),
    formula         TEXT NOT NULL DEFAULT 'epley'
        CHECK (formula IN ('epley', 'brzycki', 'lombardi', 'rpe_adjusted')),
    calculated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_e1rm_user_exercise ON e1rm_history(user_id, exercise_id, calculated_at DESC);

-- Materialized view for current e1RM per user/exercise
CREATE VIEW current_e1rm AS
SELECT DISTINCT ON (user_id, exercise_id)
    user_id, exercise_id, estimated_max, calculated_at
FROM e1rm_history
ORDER BY user_id, exercise_id, calculated_at DESC;
```

### Readiness & Wellness

```sql
CREATE TABLE wellness_checkins (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checked_in_at   DATE NOT NULL DEFAULT CURRENT_DATE,
    sleep_quality   SMALLINT CHECK (sleep_quality BETWEEN 1 AND 5),
    soreness        SMALLINT CHECK (soreness BETWEEN 1 AND 5),
    energy          SMALLINT CHECK (energy BETWEEN 1 AND 5),
    stress          SMALLINT CHECK (stress BETWEEN 1 AND 5),
    notes           TEXT,
    UNIQUE (user_id, checked_in_at)
);
```

### Exercise Swaps & Preferences

```sql
CREATE TABLE exercise_swaps (
    exercise_id     UUID NOT NULL REFERENCES exercises(id),
    swap_id         UUID NOT NULL REFERENCES exercises(id),
    similarity      NUMERIC(3,2) DEFAULT 1.0,    -- 0.0–1.0 match score
    PRIMARY KEY (exercise_id, swap_id),
    CHECK (exercise_id != swap_id)
);

CREATE TABLE user_exercise_favorites (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id     UUID NOT NULL REFERENCES exercises(id),
    PRIMARY KEY (user_id, exercise_id)
);
```

---

## Feature List

### MVP (v1)

1. **Exercise Library**
   - Searchable/filterable catalog of exercises with muscle groups and equipment
   - User-created custom exercises
   - Swap suggestions (same muscle group / equipment)

2. **Program Builder**
   - Create a program with blocks → weeks → training days → exercises → sets
   - Prescribe sets by target reps, target RPE, or percentage of e1RM
   - Support sections: warm-up, main lifts, accessories, cooldown
   - Superset/circuit grouping

3. **Workout Logger**
   - Step through prescribed sets one at a time
   - Log actual weight and reps per set
   - Mark warm-up sets complete/skip
   - Timer between sets (configurable rest duration)
   - Add ad-hoc sets or exercises not in the plan

4. **Post-Session RPE**
   - Prompt for session RPE (1–10) after completing a workout
   - Optional mood/sentiment rating (5-point scale)

5. **e1RM Calculation**
   - Auto-calculate e1RM after each working set using Epley formula:
     `e1RM = weight × (1 + reps / 30)`
   - RPE-adjusted variant: adjust for reps-in-reserve
     `effective_reps = actual_reps + (10 - RPE)`
   - Track e1RM history per exercise over time
   - Display trend (up/down/stable) on exercise cards

6. **Auto-Regulated Prescriptions**
   - Resolve `target_weight_kg` from `intensity_pct × current_e1rm`
   - If session RPE consistently exceeds target RPE by ≥1.5, flag for load reduction
   - Deload week: automatically reduce volume by 40% and intensity by 10%

7. **Workout History**
   - Per-exercise history: weight × reps over time
   - Per-session summary: total volume (sets × reps × weight), duration, RPE
   - Training streak tracking

8. **Wellness Check-In**
   - Daily pre-workout questionnaire: sleep, soreness, energy, stress (1–5 each)
   - Readiness score = weighted average → surface a warning if below threshold

### v2 Enhancements

9. **Program Templates**
   - Pre-built program templates (e.g., 5/3/1, PPL, Upper/Lower)
   - Clone and customize templates

10. **Volume Analytics**
    - Weekly volume per muscle group (sets × reps at RPE ≥ 7)
    - Total tonnage tracking (weight × reps summed)
    - Volume landmarks: MV (maintenance), MEV (minimum effective), MRV (max recoverable)

11. **Exercise Notes & Cues**
    - Per-exercise text notes that persist across sessions
    - Form cue reminders shown before first set

12. **Training Extras**
    - Optional add-on work per session (mobility, conditioning, rehab)
    - Tracked separately from main program volume

13. **Offline Support**
    - Queue logged sets locally when offline
    - Sync when connectivity returns

14. **Export**
    - Export workout history as CSV
    - Export program as shareable JSON

---

## e1RM & Auto-Regulation Logic (Pseudocode)

```
function calculate_e1rm(weight_kg, reps, rpe):
    if reps == 1 and rpe == 10:
        return weight_kg

    reps_in_reserve = 10 - rpe        // RPE 8 → 2 reps in reserve
    effective_reps = reps + reps_in_reserve

    // Epley formula with RPE adjustment
    return weight_kg * (1 + effective_reps / 30)


function resolve_prescription(prescribed_set, user_id, exercise_id):
    if prescribed_set.target_weight_kg is not null:
        return prescribed_set.target_weight_kg

    e1rm = get_current_e1rm(user_id, exercise_id)
    if e1rm is null:
        return null  // user must enter weight manually

    return round_to_nearest_2_5(e1rm * prescribed_set.intensity_pct / 100)


function should_reduce_load(user_id, exercise_id, window = 3 sessions):
    recent = get_recent_sessions(user_id, exercise_id, limit=window)

    overshoot_count = count sessions where
        actual session_rpe - average target_rpe of sets >= 1.5

    return overshoot_count >= 2  // 2 of last 3 sessions felt too hard


function generate_deload_week(normal_week):
    deload = copy(normal_week)
    for each exercise_prescription in deload:
        prescription.target_reps = round(prescription.target_reps * 0.6)
        prescription.intensity_pct = prescription.intensity_pct - 10
    return deload
```

---

## JSON Data Shapes (for API / Local Storage)

### Program Summary
```json
{
  "id": "uuid",
  "name": "Upper/Lower Hypertrophy",
  "status": "active",
  "start_date": "2026-11-25",
  "blocks": [
    {
      "id": "uuid",
      "name": "Accumulation",
      "focus": "hypertrophy",
      "weeks": [
        {
          "id": "uuid",
          "week_number": 1,
          "is_deload": false,
          "status": "active",
          "days": [
            {
              "id": "uuid",
              "day_number": 1,
              "label": "Upper A",
              "exercises": [
                {
                  "exercise_id": "uuid",
                  "exercise_name": "Bench Press",
                  "section": "main",
                  "superset_group": null,
                  "sets": [
                    {
                      "set_number": 1,
                      "set_type": "working",
                      "target_reps": 8,
                      "target_rpe": 7.0,
                      "intensity_pct": 72.5,
                      "resolved_weight_kg": 85.0,
                      "rest_seconds": 180
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Logged Session
```json
{
  "id": "uuid",
  "training_day_id": "uuid",
  "started_at": "2026-11-25T18:30:00Z",
  "completed_at": "2026-11-25T19:45:00Z",
  "session_rpe": 7,
  "session_mood": 4,
  "sets": [
    {
      "exercise_id": "uuid",
      "exercise_name": "Bench Press",
      "set_number": 1,
      "actual_weight_kg": 85.0,
      "actual_reps": 8,
      "actual_rpe": 7.5,
      "is_warmup": false,
      "e1rm_calculated": 107.7
    }
  ],
  "summary": {
    "total_volume_kg": 12480,
    "total_sets": 24,
    "duration_minutes": 75
  }
}
```

---

## Notes

- All weights stored in kg internally; convert for display based on `user.unit_system`.
- This spec describes the domain model from first principles. The schema, naming, feature set, and logic are original. No proprietary code, assets, identifiers, or API shapes from any existing app were used.
- The e1RM formulas (Epley, Brzycki) are public-domain exercise science, published in peer-reviewed literature since the 1950s.
- RPE for resistance training is based on the Borg CR-10 scale as adapted by Mike Tuchscherer (RTS), which is widely used in the powerlifting and strength training community.
