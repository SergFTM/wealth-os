"use client";

interface MdConfidencePillProps {
  value: number;
  size?: 'sm' | 'md';
}

export function MdConfidencePill({ value, size = 'sm' }: MdConfidencePillProps) {
  let colorClass = 'bg-red-100 text-red-700 border-red-200';

  if (value >= 90) {
    colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  } else if (value >= 70) {
    colorClass = 'bg-lime-100 text-lime-700 border-lime-200';
  } else if (value >= 50) {
    colorClass = 'bg-amber-100 text-amber-700 border-amber-200';
  } else if (value >= 30) {
    colorClass = 'bg-orange-100 text-orange-700 border-orange-200';
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${colorClass}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      `}
    >
      {value}%
    </span>
  );
}
