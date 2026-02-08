"use client";

interface CrPctPillProps {
  value: number;
  threshold?: number;
  showSign?: boolean;
  size?: 'sm' | 'md';
}

export function CrPctPill({ value, threshold, showSign = false, size = 'sm' }: CrPctPillProps) {
  let colorClass = 'bg-stone-100 text-stone-600';

  if (threshold !== undefined) {
    if (value > threshold) {
      colorClass = 'bg-red-100 text-red-700';
    } else if (value > threshold * 0.9) {
      colorClass = 'bg-amber-100 text-amber-700';
    } else {
      colorClass = 'bg-emerald-100 text-emerald-700';
    }
  }

  const formatted = `${showSign && value > 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {formatted}
    </span>
  );
}
