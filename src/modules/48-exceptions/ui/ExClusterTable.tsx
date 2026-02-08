'use client';

import { cn } from '@/lib/utils';

export interface ClusterRow {
  id: string;
  name: string;
  clusterTypeKey: string;
  status: 'active' | 'resolved';
  openCount: number;
  totalCount: number;
  topSourceJson?: {
    moduleKey: string;
    count: number;
  };
  createdAt: string;
}

interface ExClusterTableProps {
  data: ClusterRow[];
  onRowClick?: (item: ClusterRow) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const clusterTypeLabels: Record<string, string> = {
  type_source: 'Тип и источник',
  title_pattern: 'Паттерн названия',
  temporal: 'Временной'
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

export function ExClusterTable({
  data,
  onRowClick,
  isLoading,
  emptyMessage = 'Нет кластеров'
}: ExClusterTableProps) {
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
              <th className="px-4 py-3 text-left font-medium text-stone-600">Название кластера</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-32">Тип</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-24">Открытых</th>
              <th className="px-4 py-3 text-center font-medium text-stone-600 w-24">Всего</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-32">Топ источник</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-24">Статус</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 w-28">Создан</th>
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
                  <div className="font-medium text-stone-900">{item.name}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                    {clusterTypeLabels[item.clusterTypeKey] || item.clusterTypeKey}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    'font-medium',
                    item.openCount > 0 ? 'text-amber-600' : 'text-stone-500'
                  )}>
                    {item.openCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {item.totalCount}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {item.topSourceJson
                    ? `${moduleLabels[item.topSourceJson.moduleKey] || item.topSourceJson.moduleKey} (${item.topSourceJson.count})`
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    item.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-stone-100 text-stone-600'
                  )}>
                    {item.status === 'active' ? 'Активный' : 'Решён'}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-500 text-xs">
                  {formatDate(item.createdAt)}
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

export default ExClusterTable;
