"use client";

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ForecastItem {
  id: string;
  dateOrWeek: string;
  category: string;
  direction: 'in' | 'out';
  amount: number;
  currency: string;
  confidence: 'high' | 'medium' | 'low';
  sourceType: string;
  notes: string;
}

interface LqForecastPanelProps {
  forecasts: ForecastItem[];
  onEdit?: (id: string) => void;
  onExplain?: () => void;
  onCreateItem?: () => void;
}

export function LqForecastPanel({ forecasts, onEdit, onExplain, onCreateItem }: LqForecastPanelProps) {
  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const categoryLabels: Record<string, string> = {
    rent: 'Аренда',
    dividend: 'Дивиденды',
    coupon: 'Купоны',
    capital_call: 'Capital Call',
    distribution: 'Распределение',
    bill: 'Счет',
    tax: 'Налоги',
    salary: 'Зарплата',
    other: 'Прочее'
  };

  const confidenceStatus: Record<string, 'ok' | 'warning' | 'info'> = {
    high: 'ok',
    medium: 'warning',
    low: 'info'
  };

  const columns = [
    { key: 'dateOrWeek', header: 'Период' },
    { key: 'category', header: 'Категория', render: (item: ForecastItem) => categoryLabels[item.category] || item.category },
    { key: 'direction', header: 'Направление', render: (item: ForecastItem) => (
      <span className={item.direction === 'in' ? 'text-emerald-600' : 'text-rose-500'}>
        {item.direction === 'in' ? '↓ Приход' : '↑ Расход'}
      </span>
    )},
    { key: 'amount', header: 'Сумма', render: (item: ForecastItem) => (
      <span className={item.direction === 'in' ? 'text-emerald-600' : 'text-rose-500'}>
        {item.direction === 'in' ? '+' : '-'}{formatCurrency(item.amount, item.currency)}
      </span>
    )},
    { key: 'confidence', header: 'Уверенность', render: (item: ForecastItem) => (
      <StatusBadge status={confidenceStatus[item.confidence]} label={item.confidence} />
    )},
    { key: 'sourceType', header: 'Источник' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Прогноз денежных потоков</h3>
        <div className="flex gap-2">
          {onExplain && (
            <button
              onClick={onExplain}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
            >
              Объяснить прогноз
            </button>
          )}
          {onCreateItem && (
            <button
              onClick={onCreateItem}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
              + Добавить
            </button>
          )}
        </div>
      </div>
      <DataTable
        data={forecasts}
        columns={columns}
        onRowClick={(item) => onEdit?.(item.id)}
        emptyMessage="Нет данных прогноза"
      />
    </div>
  );
}
