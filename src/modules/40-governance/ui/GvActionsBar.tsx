"use client";

import { Button } from '@/components/ui/Button';

interface GvActionsBarProps {
  onCreateMeeting: () => void;
  onAddAgenda?: () => void;
  onCreateDecision?: () => void;
  onOpenVote?: () => void;
  onGenerateMinutes?: () => void;
  onGenerateDemo?: () => void;
  onOpenAudit?: () => void;
  showAll?: boolean;
}

export function GvActionsBar({
  onCreateMeeting,
  onAddAgenda,
  onCreateDecision,
  onOpenVote,
  onGenerateMinutes,
  onGenerateDemo,
  onOpenAudit,
  showAll = true,
}: GvActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" onClick={onCreateMeeting}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать заседание
      </Button>

      {showAll && onAddAgenda && (
        <Button variant="secondary" onClick={onAddAgenda}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Добавить повестку
        </Button>
      )}

      {showAll && onCreateDecision && (
        <Button variant="secondary" onClick={onCreateDecision}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Создать решение
        </Button>
      )}

      {showAll && onOpenVote && (
        <Button variant="secondary" onClick={onOpenVote}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Открыть голосование
        </Button>
      )}

      {showAll && onGenerateMinutes && (
        <Button variant="ghost" onClick={onGenerateMinutes}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Сгенерировать протокол
        </Button>
      )}

      {showAll && onGenerateDemo && (
        <Button variant="ghost" onClick={onGenerateDemo}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Demo governance
        </Button>
      )}

      {onOpenAudit && (
        <Button variant="ghost" onClick={onOpenAudit} className="ml-auto">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Audit
        </Button>
      )}
    </div>
  );
}
