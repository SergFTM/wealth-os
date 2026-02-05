'use client';

import { useRouter } from 'next/navigation';
import { Check, X, MoreHorizontal, Clock } from 'lucide-react';
import { DlStatusPill } from './DlStatusPill';

interface Approval {
  id: string;
  dealId: string;
  approvalType: string;
  requestedByName: string;
  status: string;
  dueAt: string;
  decidedByName?: string;
  decidedAt?: string;
  notes?: string;
}

interface Deal {
  id: string;
  name: string;
  dealNumber: string;
}

interface DlApprovalsTableProps {
  approvals: Approval[];
  deals: Deal[];
  compact?: boolean;
  onApprove?: (approvalId: string) => void;
  onReject?: (approvalId: string) => void;
}

const approvalTypeLabels: Record<string, string> = {
  ic: 'Инвест. комитет',
  legal: 'Юридический',
  cfo: 'CFO',
  compliance: 'Комплаенс',
  cio: 'CIO'
};

export function DlApprovalsTable({ approvals, deals, compact = false, onApprove, onReject }: DlApprovalsTableProps) {
  const router = useRouter();

  const getDeal = (dealId: string) => {
    return deals.find(d => d.id === dealId);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: compact ? undefined : 'numeric'
    });
  };

  const isOverdue = (dueAt: string, status: string) => {
    if (status !== 'pending') return false;
    return new Date() > new Date(dueAt);
  };

  const handleRowClick = (dealId: string) => {
    router.push(`/m/deals/deal/${dealId}?tab=approvals`);
  };

  const sortedApprovals = [...approvals].sort((a, b) => {
    // Pending first, then by due date
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  });

  if (compact) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Сделка</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Тип</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedApprovals.filter(a => a.status === 'pending').slice(0, 5).map(approval => {
              const deal = getDeal(approval.dealId);
              return (
                <tr
                  key={approval.id}
                  onClick={() => handleRowClick(approval.dealId)}
                  className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-2 text-sm font-medium text-slate-900 truncate max-w-[120px]">
                    {deal?.name || approval.dealId}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-700">
                    {approvalTypeLabels[approval.approvalType] || approval.approvalType}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {isOverdue(approval.dueAt, approval.status) && (
                        <Clock className="h-3 w-3 text-red-500" />
                      )}
                      <DlStatusPill status={approval.status} size="sm" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Сделка</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Запросил</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Срок</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Решение</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody>
          {sortedApprovals.map(approval => {
            const deal = getDeal(approval.dealId);
            const overdue = isOverdue(approval.dueAt, approval.status);
            return (
              <tr
                key={approval.id}
                onClick={() => handleRowClick(approval.dealId)}
                className={`border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors ${overdue ? 'bg-red-50/30' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-900">{deal?.name || approval.dealId}</div>
                  <div className="text-xs text-slate-500">{deal?.dealNumber}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                    {approvalTypeLabels[approval.approvalType] || approval.approvalType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{approval.requestedByName}</td>
                <td className="px-4 py-3">
                  <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                    {formatDate(approval.dueAt)}
                    {overdue && <span className="ml-1 text-xs">(просрочено)</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <DlStatusPill status={approval.status} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {approval.decidedByName ? (
                    <div>
                      <div>{approval.decidedByName}</div>
                      <div className="text-xs text-slate-400">{approval.decidedAt && formatDate(approval.decidedAt)}</div>
                    </div>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {approval.status === 'pending' && (
                      <>
                        {onApprove && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove(approval.id);
                            }}
                            className="p-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                            title="Одобрить"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {onReject && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject(approval.id);
                            }}
                            className="p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            title="Отклонить"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
