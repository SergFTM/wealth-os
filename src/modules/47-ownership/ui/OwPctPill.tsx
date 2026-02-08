"use client";

interface OwPctPillProps {
  value: number;
  type?: 'ownership' | 'profit';
  size?: 'sm' | 'md';
}

export function OwPctPill({ value, type = 'ownership', size = 'sm' }: OwPctPillProps) {
  const bgColor = type === 'ownership' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <span className={`inline-flex items-center rounded font-medium ${bgColor} ${sizeClasses}`}>
      {value.toFixed(1)}%
    </span>
  );
}

export default OwPctPill;
