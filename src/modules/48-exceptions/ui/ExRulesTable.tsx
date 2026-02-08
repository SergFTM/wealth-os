'use client';

import { cn } from '@/lib/utils';

export interface RuleRow {
  id: string;
  name: string;
  description?: string;
  ruleTypeKey: 'assign' | 'escalate' | 'close';
  enabled: boolean;
  priority?: number;
  matchCount?: number;
  lastRunAt?: string;
  createdAt: string;
}

interface ExRulesTableProps {
  data: RuleRow[];
  onRowClick?: (item: RuleRow) => void;
  onToggle?: (item: RuleRow, enabled: boolean) => void;
  onRun?: (item: RuleRow) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const ruleTypeLabels: Record<string, { label: string; className: string }> = {
  assign: { label: 'Назначение', className: 'bg-blue-100 text-blue-700' },
  escalate: { label: 'Эскалация', className: 'bg-amber-100 text-amber-700' },
  close: { label: 'Закрытие', className: 'bg-emerald-100 text-emerald-700' }
};

export function ExRulesTable({
  data,
  onRowClick,
  onToggle,
  onRun,
  isLoading,
  emptyMessage = 'Нет правил'
}: ExRulesTableProps) {
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
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-20">Вкл</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-20">Приор.</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-24">Сработало</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-32">Последний запуск</th>
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
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    ruleTypeLabels[item.ruleTypeKey]?.className || 'bg-stone-100 text-stone-600'
                  )}>
                    {ruleTypeLabels[item.ruleTypeKey]?.label || item.ruleTypeKey}
                  </span>
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
                <td className="px-4 py-3 text-center text-stone-600">
                  {item.priority || '—'}
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {item.matchCount ?? 0}
                </td>
                <td className="px-4 py-3 text-stone-500 text-xs">
                  {item.lastRunAt ? formatDateTime(item.lastRunAt) : 'Никогда'}
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  {onRun && item.enabled && (
                    <button
                      onClick={() => onRun(item)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-stone-100 text-stone-600 hover:bg-stone-200"
                    >
                      <PlayIcon />
                      Запустить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function PlayIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default ExRulesTable;
