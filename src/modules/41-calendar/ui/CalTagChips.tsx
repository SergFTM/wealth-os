"use client";

import { cn } from '@/lib/utils';

interface CalTagChipsProps {
  tags: string[];
  maxVisible?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function CalTagChips({ tags, maxVisible = 3, size = 'sm', className }: CalTagChipsProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleTags.map((tag, idx) => (
        <span
          key={idx}
          className={cn(
            "inline-flex items-center rounded-md bg-stone-100 text-stone-600 font-medium",
            size === 'sm' ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs"
          )}
        >
          #{tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-md bg-stone-50 text-stone-500 font-medium",
            size === 'sm' ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs"
          )}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

interface CalParticipantChipsProps {
  participants: Array<{
    userId: string;
    name: string;
    role?: string;
    status?: string;
  }>;
  maxVisible?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function CalParticipantChips({
  participants,
  maxVisible = 3,
  size = 'sm',
  className,
}: CalParticipantChipsProps) {
  if (!participants || participants.length === 0) return null;

  const visibleParticipants = participants.slice(0, maxVisible);
  const remainingCount = participants.length - maxVisible;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'declined':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'tentative':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleParticipants.map((participant, idx) => (
        <span
          key={participant.userId || idx}
          className={cn(
            "inline-flex items-center rounded-full border font-medium",
            size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-xs",
            getStatusColor(participant.status)
          )}
          title={`${participant.name}${participant.role ? ` (${participant.role})` : ''}`}
        >
          {participant.name.split(' ')[0]}
          {participant.role === 'organizer' && (
            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-stone-50 text-stone-500 font-medium border border-stone-200",
            size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-xs"
          )}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
