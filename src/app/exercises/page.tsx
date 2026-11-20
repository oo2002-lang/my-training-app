'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Exercise } from '@/lib/types';
import { generateId, formatWeight } from '@/lib/utils';
import { getE1RMTrend } from '@/lib/e1rm';

const CATEGORIES: { value: Exercise['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sprint', label: 'Sprint' },
  { value: 'jump_drill', label: 'Jump Drills' },
  { value: 'cb_drill', label: 'CB Drills' },
  { value: 'plyo', label: 'Plyo' },
  { value: 'agility', label: 'Agility' },
  { value: 'strength', label: 'Strength' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'conditioning', label: 'Conditioning' },
];

const SPORTS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'long_jump', label: 'Long Jump' },
  { value: 'cb_football', label: 'CB Football' },
  { value: 'both', label: 'Both Sports' },
];

const CAT_COLORS: Record<string, string> = {
  sprint: 'bg-red-900/50 text-red-400',
  plyo: 'bg-orange-900/50 text-orange-400',
  jump_drill: 'bg-purple-900/50 text-purple-400',
  cb_drill: 'bg-blue-900/50 text-blue-400',
  agility: 'bg-cyan-900/50 text-cyan-400',
  strength: 'bg-amber-900/50 text-amber-400',
  mobility: 'bg-green-900/50 text-green-400',
  conditioning: 'bg-pink-900/50 text-pink-400',
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterSport, setFilterSport] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Exercise['category']>('sprint');
  const [newTracking, setNewTracking] = useState<Exercise['trackingType']>('reps_only');
  const [newSport, setNewSport] = useState<Exercise['sport']>('both');
  const [newMuscles, setNewMuscles] = useState('');
  const [settings] = useState(() => store.getSettings());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExercises(store.getExercises());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const filtered = exercises.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat !== 'all' && e.category !== filterCat) return false;
    if (filterSport !== 'all' && e.sport !== filterSport && e.sport !== 'both') return false;
    return true;
  });

  function addExercise() {
    if (!newName.trim()) return;
    const ex: Exercise = {
      id: generateId(),
      name: newName.trim(),
      slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      category: newCategory,
      trackingType: newTracking,
      primaryMuscles: newMuscles.split(',').map(s => s.trim()).filter(Boolean),
      sport: newSport,
    };
    store.saveExercise(ex);
    setExercises(store.getExercises());
    setNewName('');
    setNewMuscles('');
    setShowAdd(false);
  }

  function formatPR(ex: Exercise) {
    const pr = store.getExercisePR(ex.id);
    if (!pr) return null;
    switch (pr.unit) {
      case 'sec': return `${pr.value}s`;
      case 'm': return settings.unitSystem === 'imperial' ? `${(pr.value * 3.281).toFixed(1)} ft` : `${pr.value}m`;
      case 'kg': return formatWeight(pr.value, settings.unitSystem);
      default: return `${pr.value}`;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Exercises</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          {showAdd ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Exercise name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
          />
          <div className="grid grid-cols-3 gap-2">
            <select value={newCategory} onChange={e => setNewCategory(e.target.value as Exercise['category'])}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs text-zinc-100 focus:outline-none">
              {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select value={newTracking} onChange={e => setNewTracking(e.target.value as Exercise['trackingType'])}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs text-zinc-100 focus:outline-none">
              <option value="time">Time</option>
              <option value="distance">Distance</option>
              <option value="reps_only">Reps</option>
              <option value="weight_reps">Weight+Reps</option>
              <option value="duration">Duration</option>
            </select>
            <select value={newSport} onChange={e => setNewSport(e.target.value as Exercise['sport'])}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs text-zinc-100 focus:outline-none">
              <option value="both">Both</option>
              <option value="long_jump">Long Jump</option>
              <option value="cb_football">CB Football</option>
            </select>
          </div>
          <input
            value={newMuscles}
            onChange={e => setNewMuscles(e.target.value)}
            placeholder="Muscles (comma-separated)"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
          />
          <button onClick={addExercise}
            className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-500">
            Save Exercise
          </button>
        </div>
      )}

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search exercises..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
      />

      {/* Sport filter */}
      <div className="flex gap-1.5">
        {SPORTS.map(s => (
          <button key={s.value} onClick={() => setFilterSport(s.value)}
            className={`rounded-full px-3 py-1 text-xs ${
              filterSport === s.value ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilterCat(c.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${
              filterCat === c.value ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-600">{filtered.length} exercises</p>

      <div className="space-y-2">
        {filtered.map(ex => {
          const pr = formatPR(ex);
          const e1rm = ex.trackingType === 'weight_reps' ? store.getCurrentE1RM(ex.id) : null;
          const trend = ex.trackingType === 'weight_reps' ? getE1RMTrend(store.getExerciseE1RM(ex.id)) : 'none';

          return (
            <div key={ex.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{ex.name}</p>
                    <span className={`rounded px-1.5 py-0.5 text-xs ${CAT_COLORS[ex.category] ?? 'bg-zinc-800 text-zinc-400'}`}>
                      {ex.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="mt-0.5 flex gap-2 text-xs text-zinc-500">
                    <span>{ex.trackingType.replace(/_/g, ' ')}</span>
                    <span>{ex.sport === 'both' ? 'LJ + CB' : ex.sport === 'long_jump' ? 'LJ' : 'CB'}</span>
                    {ex.primaryMuscles.length > 0 && <span>{ex.primaryMuscles.slice(0, 3).join(', ')}</span>}
                  </div>
                  {ex.cues && <p className="mt-1 text-xs text-zinc-600 italic">{ex.cues}</p>}
                  {ex.alternatives && ex.alternatives.length > 0 && (
                    <p className="mt-0.5 text-xs text-zinc-600">🔄 {ex.alternatives.join(' · ')}</p>
                  )}
                </div>
                <div className="text-right ml-2 shrink-0">
                  {pr && <p className="text-sm font-bold text-green-400">PR: {pr}</p>}
                  {e1rm && (
                    <p className="text-xs text-zinc-400">
                      e1RM: {formatWeight(e1rm, settings.unitSystem)}
                      {trend === 'up' ? ' ↑' : trend === 'down' ? ' ↓' : trend === 'stable' ? ' →' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-zinc-500">No exercises found.</p>
        )}
      </div>
    </div>
  );
}
