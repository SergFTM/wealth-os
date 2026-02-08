"use client";

import { DlStatusPill } from './DlStatusPill';
import { DlSeverityPill } from './DlSeverityPill';
import { Button } from '@/components/ui/Button';

interface Approval {
  id: string;
  linkedType: string;
  linkedName?: string;
  requestedByName?: string;
  approverRole: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueAt?: string;
  decisionNotes?: string;
  requestedAt?: string;
}

interface DlApprovalsPanelProps {
  approvals: Approval[];
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval) => void;
  onView?: (approval: Approval) => void;
  compact?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  cio: 'CIO',
  cfo: 'CFO',
  controller: 'Controller',
  compliance: 'Compliance',
  legal: 'Legal',
  ic: 'Inv. Committee',
  tax: 'Tax',
};

export function DlApprovalsPanel({
  approvals,
  onApprove,
  onReject,
  onView,
  compact = false,
}: DlApprovalsPanelProps) {
  if (approvals.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-stone-500">Нет согласований</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {approvals.map((approval) => {
        const isOverdue = approval.dueAt && new Date(approval.dueAt) < new Date() && approval.status === 'pending';

        return (
          <div
            key={approval.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl border ${
              isOverdue ? 'border-red-200' : 'border-stone-200/50'
            } p-4 hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-stone-800 truncate">
                    {approval.linkedName || 'Без названия'}
                  </span>
                  <DlStatusPill status={approval.status} size="sm" />
                  {approval.priority && approval.priority !== 'normal' && (
                    <DlSeverityPill severity={approval.priority} size="sm" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <span>Роль: <span className="font-medium">{ROLE_LABELS[approval.approverRole] || approval.approverRole}</span></span>
                  {approval.requestedByName && (
                    <span>От: {approval.requestedByName}</span>
                  )}
                  {approval.dueAt && (
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      Срок: {new Date(approval.dueAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                </div>

                {!compact && approval.decisionNotes && (
                  <p className="mt-2 text-sm text-stone-600 line-clamp-2">{approval.decisionNotes}</p>
                )}
              </div>

              {approval.status === 'pending' && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {onApprove && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onApprove(approval)}
                    >
                      Утвердить
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject(approval)}
                    >
                      Отклонить
                    </Button>
                  )}
                </div>
              )}

              {approval.status !== 'pending' && onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(approval)}
                >
                  Детали
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DlApprovalsPanel;
