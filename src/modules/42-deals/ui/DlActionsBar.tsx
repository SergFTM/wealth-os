"use client";

import { Button } from '@/components/ui/Button';

interface DlActionsBarProps {
  onCreateAction?: () => void;
  onCreateDeal?: () => void;
  onCreateFundEvent?: () => void;
  onCreateChecklist?: () => void;
  onRequestApproval?: () => void;
  onGenerateDemo?: () => void;
  onViewAll?: () => void;
  onAudit?: () => void;
}

export function DlActionsBar({
  onCreateAction,
  onCreateDeal,
  onCreateFundEvent,
  onCreateChecklist,
  onRequestApproval,
  onGenerateDemo,
  onViewAll,
  onAudit,
}: DlActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onCreateAction && (
        <Button variant="primary" onClick={onCreateAction}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Corporate action
        </Button>
      )}

      {onCreateDeal && (
        <Button variant="secondary" onClick={onCreateDeal}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Deal
        </Button>
      )}

      {onCreateFundEvent && (
        <Button variant="secondary" onClick={onCreateFundEvent}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Fund event
        </Button>
      )}

      {onCreateChecklist && (
        <Button variant="ghost" onClick={onCreateChecklist}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Checklist
        </Button>
      )}

      {onRequestApproval && (
        <Button variant="ghost" onClick={onRequestApproval}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Согласование
        </Button>
      )}

      <div className="flex-1" />

      {onViewAll && (
        <Button variant="ghost" onClick={onViewAll}>
          Все записи
        </Button>
      )}

      {onGenerateDemo && (
        <Button variant="ghost" onClick={onGenerateDemo}>
          Demo
        </Button>
      )}

      {onAudit && (
        <Button variant="ghost" onClick={onAudit}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Audit
        </Button>
      )}
    </div>
  );
}

export default DlActionsBar;
