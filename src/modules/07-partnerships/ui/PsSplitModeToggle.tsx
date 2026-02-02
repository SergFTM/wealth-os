"use client";

import { cn } from '@/lib/utils';

interface PsSplitModeToggleProps {
  value: 'ownership' | 'profit';
  onChange: (mode: 'ownership' | 'profit') => void;
}

export function PsSplitModeToggle({ value, onChange }: PsSplitModeToggleProps) {
  return (
    <div className="inline-flex bg-stone-100 rounded-lg p-1">
      <button
        onClick={() => onChange('ownership')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          value === 'ownership' ? "bg-white shadow-sm text-emerald-700" : "text-stone-500 hover:text-stone-700"
        )}
      >
        По собственности
      </button>
      <button
        onClick={() => onChange('profit')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          value === 'profit' ? "bg-white shadow-sm text-purple-700" : "text-stone-500 hover:text-stone-700"
        )}
      >
        По прибыли
      </button>
    </div>
  );
}
