"use client";

import { cn } from '@/lib/utils';

interface PerfTimeframeSwitcherProps {
  value: string;
  onChange: (timeframe: string) => void;
}

const timeframes = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
  { value: '3Y', label: '3Y' },
  { value: 'ALL', label: 'Все' }
];

export function PerfTimeframeSwitcher({ value, onChange }: PerfTimeframeSwitcherProps) {
  return (
    <div className="inline-flex bg-stone-100 rounded-lg p-1">
      {timeframes.map(tf => (
        <button
          key={tf.value}
          onClick={() => onChange(tf.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            value === tf.value
              ? "bg-white text-stone-800 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
