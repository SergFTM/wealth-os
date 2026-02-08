'use client';

import { cn } from '@/lib/utils';

export interface SlaPolicyRow {
  id: string;
  name: string;
  description?: string;
  appliesToTypeKey: string;
  appliesToSeverity?: string;
  defaultSlaHours: number;
  warningThresholdHours?: number;
  escalationHours?: number;
  enabled: boolean;
  priority?: number;
  createdAt: string;
}

interface ExSlaPoliciesTableProps {
  data: SlaPolicyRow[];
  onRowClick?: (item: SlaPolicyRow) => void;
  onToggle?: (item: SlaPolicyRow, enabled: boolean) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const typeLabels: Record<string, string> = {
  all: 'Все типы',
  sync: 'Синхронизация',
  recon: 'Сверка',
  missing_doc: 'Документы',
  stale_price: 'Цены',
  approval: 'Согласования',
  vendor_sla: 'SLA вендоров',
  security: 'Безопасность'
};

const severityLabels: Record<string, string> = {
  all: 'Все уровни',
  ok: 'Норма',
  warning: 'Внимание',
  critical: 'Критично'
};

export function ExSlaPoliciesTable({
  data,
  onRowClick,
  onToggle,
  isLoading,
  emptyMessage = 'Нет SLA-политик'
}: ExSlaPoliciesTableProps) {
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
              <th className="px-4 py-3 text-left font-medium text-stone-600">Название</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-28">Тип</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-24">Важность</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-24">SLA (ч)</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-28">Предупр. (ч)</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-28">Эскал. (ч)</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-20">Вкл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'hover:bg-stone-50/50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  !item.enabled && 'opacity-60'
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-stone-500 truncate max-w-xs mt-0.5">
                      {item.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                    {typeLabels[item.appliesToTypeKey] || item.appliesToTypeKey}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-stone-600">
                    {severityLabels[item.appliesToSeverity || 'all']}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-medium text-stone-700">
                  {item.defaultSlaHours}
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {item.warningThresholdHours || '—'}
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {item.escalationHours || '—'}
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggle?.(item, !item.enabled)}
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors relative',
                      item.enabled ? 'bg-emerald-500' : 'bg-stone-300'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                      item.enabled ? 'left-5' : 'left-0.5'
                    )} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExSlaPoliciesTable;
