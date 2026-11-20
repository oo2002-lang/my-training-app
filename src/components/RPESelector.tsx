'use client';

import { cn } from '@/lib/utils';

const RPE_LABELS: Record<number, string> = {
  1: 'Rest',
  2: 'Very Light',
  3: 'Light',
  4: 'Light',
  5: 'Moderate',
  6: 'Easy 4+ left',
  7: 'Moderate 3 left',
  8: 'Hard 2 left',
  9: 'Very Hard 1 left',
  10: 'Max Effort',
};

export default function RPESelector({
  value,
  onChange,
  min = 5,
  max = 10,
  allowHalf = true,
}: {
  value: number | null;
  onChange: (rpe: number) => void;
  min?: number;
  max?: number;
  allowHalf?: boolean;
}) {
  const options: number[] = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
    if (allowHalf && i < max) options.push(i + 0.5);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {options.map(rpe => (
          <button
            key={rpe}
            type="button"
            onClick={() => onChange(rpe)}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-all',
              value === rpe
                ? rpe >= 9 ? 'bg-red-600 text-white'
                  : rpe >= 7 ? 'bg-amber-600 text-white'
                  : 'bg-green-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            )}
          >
            {rpe}
          </button>
        ))}
      </div>
      {value != null && (
        <p className="text-xs text-zinc-500">
          RPE {value} — {RPE_LABELS[Math.floor(value)] ?? ''}
        </p>
      )}
    </div>
  );
}
