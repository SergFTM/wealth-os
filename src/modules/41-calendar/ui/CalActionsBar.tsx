"use client";

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CalActionsBarProps {
  onCreateEvent?: () => void;
  onCreateMeeting?: () => void;
  onAddAgenda?: () => void;
  onAddNote?: () => void;
  onCreateAction?: () => void;
  onGenerateDemo?: () => void;
  onOpenAudit?: () => void;
  className?: string;
}

export function CalActionsBar({
  onCreateEvent,
  onCreateMeeting,
  onAddAgenda,
  onAddNote,
  onCreateAction,
  onGenerateDemo,
  onOpenAudit,
  className,
}: CalActionsBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {onCreateEvent && (
        <Button variant="primary" onClick={onCreateEvent} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать событие
        </Button>
      )}

      {onCreateMeeting && (
        <Button variant="secondary" onClick={onCreateMeeting} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Создать встречу
        </Button>
      )}

      {onAddAgenda && (
        <Button variant="ghost" onClick={onAddAgenda} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Повестка
        </Button>
      )}

      {onAddNote && (
        <Button variant="ghost" onClick={onAddNote} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Заметка
        </Button>
      )}

      {onCreateAction && (
        <Button variant="ghost" onClick={onCreateAction} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Action Item
        </Button>
      )}

      <div className="flex-1" />

      {onGenerateDemo && (
        <Button variant="ghost" onClick={onGenerateDemo} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Demo
        </Button>
      )}

      {onOpenAudit && (
        <Button variant="ghost" onClick={onOpenAudit}>
          Audit
        </Button>
      )}
    </div>
  );
}
