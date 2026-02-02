"use client";

import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';

interface ReconIssue {
  type: 'quantity' | 'price' | 'missing_transaction' | 'duplicate' | 'other';
  description: string;
  severity: 'warning' | 'critical';
}

interface NetWorthReconciliationFlagsProps {
  reconStatus: 'ok' | 'issue' | 'pending';
  issues: ReconIssue[];
  syncJobId?: string;
  loading?: boolean;
  clientSafe?: boolean;
  onCreateTicket: () => void;
  onCreateTask: () => void;
}

const issueTypeLabels: Record<string, { ru: string; en: string }> = {
  quantity: { ru: 'Несовпадение количества', en: 'Quantity mismatch' },
  price: { ru: 'Несовпадение цены', en: 'Price mismatch' },
  missing_transaction: { ru: 'Пропущенная транзакция', en: 'Missing transaction' },
  duplicate: { ru: 'Дублирующая запись', en: 'Duplicate entry' },
  other: { ru: 'Другое', en: 'Other' }
};

export function NetWorthReconciliationFlags({
  reconStatus,
  issues,
  syncJobId,
  loading,
  clientSafe,
  onCreateTicket,
  onCreateTask
}: NetWorthReconciliationFlagsProps) {
  const { locale } = useApp();

  if (clientSafe) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-12 bg-stone-100 rounded-lg animate-pulse" />
        <div className="h-24 bg-stone-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-stone-600">
            {locale === 'ru' ? 'Статус сверки:' : 'Reconciliation Status:'}
          </span>
          <StatusBadge 
            status={reconStatus === 'ok' ? 'ok' : reconStatus === 'issue' ? 'critical' : 'warning'} 
            label={reconStatus === 'ok' ? 'OK' : reconStatus === 'issue' ? 'Issue' : 'Pending'}
          />
        </div>
        
        {syncJobId && (
          <span className="text-xs text-stone-400">
            Sync: {syncJobId}
          </span>
        )}
      </div>

      {/* Issues List */}
      {reconStatus === 'issue' && issues.length > 0 && (
        <div className="border border-rose-200 rounded-lg overflow-hidden">
          <div className="bg-rose-50 px-4 py-2 border-b border-rose-200">
            <span className="font-medium text-rose-800">
              {locale === 'ru' ? 'Обнаружены расхождения' : 'Discrepancies Found'}
            </span>
          </div>
          
          <div className="divide-y divide-rose-100">
            {issues.map((issue, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <svg className={`w-5 h-5 mt-0.5 ${issue.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-stone-800">
                    {issueTypeLabels[issue.type]?.[locale as 'ru' | 'en'] || issue.type}
                  </p>
                  <p className="text-sm text-stone-600 mt-0.5">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-rose-50 px-4 py-3 border-t border-rose-200 flex gap-2">
            <Button variant="primary" size="sm" onClick={onCreateTicket}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              {locale === 'ru' ? 'Тикет в Integrations' : 'Create Ticket'}
            </Button>
            <Button variant="secondary" size="sm" onClick={onCreateTask}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {locale === 'ru' ? 'Задача в Workflow' : 'Create Task'}
            </Button>
          </div>
        </div>
      )}

      {/* OK Status */}
      {reconStatus === 'ok' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-emerald-800">
              {locale === 'ru' ? 'Данные сверены' : 'Data Reconciled'}
            </p>
            <p className="text-sm text-emerald-600">
              {locale === 'ru' ? 'Расхождений не обнаружено' : 'No discrepancies found'}
            </p>
          </div>
        </div>
      )}

      {/* Pending Status */}
      {reconStatus === 'pending' && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-6 h-6 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div>
            <p className="font-medium text-amber-800">
              {locale === 'ru' ? 'Ожидает сверки' : 'Pending Reconciliation'}
            </p>
            <p className="text-sm text-amber-600">
              {locale === 'ru' ? 'Сверка будет выполнена при следующей синхронизации' : 'Will be reconciled on next sync'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
