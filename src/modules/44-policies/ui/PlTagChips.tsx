"use client";

interface PlTagChipsProps {
  tags: string[];
  maxVisible?: number;
  onTagClick?: (tag: string) => void;
}

const tagColors = [
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-pink-100 text-pink-700 border-pink-200',
];

export function PlTagChips({ tags, maxVisible = 3, onTagClick }: PlTagChipsProps) {
  if (!tags || tags.length === 0) {
    return <span className="text-stone-400 text-sm">—</span>;
  }

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag, index) => (
        <span
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`
            inline-flex items-center rounded-full border text-xs px-2 py-0.5 font-medium
            ${tagColors[index % tagColors.length]}
            ${onTagClick ? 'cursor-pointer hover:opacity-80' : ''}
          `}
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs px-2 py-0.5">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
