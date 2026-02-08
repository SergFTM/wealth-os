'use client';

import { cn } from '@/lib/utils';
import { ExStatusPill } from './ExStatusPill';
import { ExSeverityPill } from './ExSeverityPill';
import { ExSlaBadge } from './ExSlaBadge';

export interface ExceptionRow {
  id: string;
  title: string;
  typeKey: string;
  severity: 'ok' | 'warning' | 'critical';
  status: 'open' | 'triage' | 'in_progress' | 'closed';
  sourceModuleKey: string;
  assignedToRole?: string;
  slaDueAt?: string;
  slaAtRisk?: boolean;
  createdAt: string;
}

interface ExQueueTableProps {
  data: ExceptionRow[];
  onRowClick?: (item: ExceptionRow) => void;
  onAssign?: (item: ExceptionRow) => void;
  onClose?: (item: ExceptionRow) => void;
  onEscalate?: (item: ExceptionRow) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const typeLabels: Record<string, string> = {
  sync: 'Синхронизация',
  recon: 'Сверка',
  missing_doc: 'Документ',
  stale_price: 'Цена',
  approval: 'Согласование',
  vendor_sla: 'SLA вендора',
  security: 'Безопасность'
};

const moduleLabels: Record<string, string> = {
  '14': 'Интеграции',
  '2': 'GL',
  '39': 'Ликвидность',
  '42': 'Сделки',
  '5': 'Документы',
  '16': 'Цены',
  '7': 'Согласования',
  '43': 'Вендоры',
  '17': 'Безопасность'
};

export function ExQueueTable({
  data,
  onRowClick,
  onAssign,
  onClose,
  onEscalate,
  isLoading,
  emptyMessage = 'Нет исключений'
}: ExQueueTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-8">
        <div className="text-center text-stone-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-24">Важность</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600">Название</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-28">Источник</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-28">Тип</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-24">Статус</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-28">SLA</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-32">Назначено</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-28">Создано</th>
              <th className="px-4 py-3 text-right font-medium text-stone-600 w-24">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'hover:bg-stone-50/50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                <td className="px-4 py-3">
                  <ExSeverityPill severity={item.severity} />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900 truncate max-w-xs">
                    {item.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {moduleLabels[item.sourceModuleKey] || `М${item.sourceModuleKey}`}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                    {typeLabels[item.typeKey] || item.typeKey}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ExStatusPill status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <ExSlaBadge slaDueAt={item.slaDueAt} slaAtRisk={item.slaAtRisk} />
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {item.assignedToRole || '—'}
                </td>
                <td className="px-4 py-3 text-stone-500 text-xs">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {onAssign && item.status !== 'closed' && (
                      <button
                        onClick={() => onAssign(item)}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 hover:text-stone-700"
                        title="Назначить"
                      >
                        <UserIcon />
                      </button>
                    )}
                    {onEscalate && item.status !== 'closed' && (
                      <button
                        onClick={() => onEscalate(item)}
                        className="p-1 rounded hover:bg-amber-100 text-stone-500 hover:text-amber-700"
                        title="Эскалировать"
                      >
                        <ArrowUpIcon />
                      </button>
                    )}
                    {onClose && item.status !== 'closed' && (
                      <button
                        onClick={() => onClose(item)}
                        className="p-1 rounded hover:bg-emerald-100 text-stone-500 hover:text-emerald-700"
                        title="Закрыть"
                      >
                        <CheckIcon />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default ExQueueTable;
