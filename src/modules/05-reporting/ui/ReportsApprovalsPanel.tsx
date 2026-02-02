"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Approval {
  id: string;
  requesterId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  dueAt: string;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReportsApprovalsPanelProps {
  approvals: Approval[];
  packStatus: string;
  onSubmitForApproval?: () => void;
  onApprove?: (approvalId: string) => void;
  onReject?: (approvalId: string, comment: string) => void;
  currentUserId?: string;
  readOnly?: boolean;
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  approved: 'Одобрено',
  rejected: 'Отклонено',
};

export function ReportsApprovalsPanel({
  approvals,
  packStatus,
  onSubmitForApproval,
  onApprove,
  onReject,
  currentUserId,
  readOnly = false
}: ReportsApprovalsPanelProps) {
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const canSubmit = packStatus === 'draft' && !readOnly;
  const canApprove = (approval: Approval) => 
    approval.status === 'pending' && 
    currentUserId === approval.approverId &&
    !readOnly;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Согласования</h3>
        {canSubmit && (
          <Button variant="primary" size="sm" onClick={onSubmitForApproval}>
            Отправить на согласование
          </Button>
        )}
      </div>

      {approvals.length > 0 ? (
        <div className="divide-y divide-stone-100">
          {approvals.map(approval => (
            <div key={approval.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      approval.status === 'pending' ? "bg-amber-100 text-amber-700" :
                      approval.status === 'approved' ? "bg-emerald-100 text-emerald-700" :
                      "bg-rose-100 text-rose-700"
                    )}>
                      {statusLabels[approval.status]}
                    </span>
                    <span className="text-sm text-stone-600">
                      {approval.approverId.split('@')[0]}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 space-y-1">
                    <p>От: {approval.requesterId.split('@')[0]}</p>
                    <p>Срок: {new Date(approval.dueAt).toLocaleDateString('ru-RU')}</p>
                    {approval.comment && (
                      <p className="italic">«{approval.comment}»</p>
                    )}
                  </div>
                </div>
                
                {canApprove(approval) && (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onApprove?.(approval.id)}
                    >
                      Одобрить
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600"
                      onClick={() => {
                        const comment = prompt('Причина отклонения:');
                        if (comment) onReject?.(approval.id, comment);
                      }}
                    >
                      Отклонить
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-stone-500">
          <p className="mb-4">Нет запросов на согласование</p>
          {canSubmit && (
            <Button variant="secondary" onClick={onSubmitForApproval}>
              Отправить на согласование
            </Button>
          )}
        </div>
      )}

      {pendingApprovals.length > 0 && (
        <div className="p-4 bg-amber-50 border-t border-amber-200">
          <p className="text-sm text-amber-700">
            ⏳ {pendingApprovals.length} ожидающих согласования
          </p>
        </div>
      )}
    </div>
  );
}
