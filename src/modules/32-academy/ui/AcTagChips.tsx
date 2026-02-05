'use client';

import { cn } from '@/lib/utils';

interface AcTagChipsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  maxVisible?: number;
  size?: 'sm' | 'md';
}

const tagColors: Record<string, string> = {
  onboarding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  security: 'bg-rose-50 text-rose-700 border-rose-200',
  compliance: 'bg-amber-50 text-amber-700 border-amber-200',
  reporting: 'bg-blue-50 text-blue-700 border-blue-200',
  documents: 'bg-purple-50 text-purple-700 border-purple-200',
  ips: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  tax: 'bg-amber-50 text-amber-700 border-amber-200',
  trust: 'bg-purple-50 text-purple-700 border-purple-200',
  workflow: 'bg-blue-50 text-blue-700 border-blue-200',
  risk: 'bg-rose-50 text-rose-700 border-rose-200',
  sop: 'bg-rose-50 text-rose-700 border-rose-200',
  guide: 'bg-blue-50 text-blue-700 border-blue-200',
  ai: 'bg-purple-50 text-purple-700 border-purple-200',
  faq: 'bg-blue-50 text-blue-700 border-blue-200',
};

export function AcTagChips({ tags, onTagClick, maxVisible = 3, size = 'sm' }: AcTagChipsProps) {
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={cn(
            'inline-flex items-center rounded-md border font-medium transition-colors',
            tagColors[tag] || 'bg-stone-50 text-stone-600 border-stone-200',
            onTagClick && 'cursor-pointer hover:opacity-80',
            size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
          )}
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center rounded-md bg-stone-100 text-stone-500 font-medium',
            size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
          )}
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
