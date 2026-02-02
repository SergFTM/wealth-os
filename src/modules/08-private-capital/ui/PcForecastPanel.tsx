"use client";

import { cn } from '@/lib/utils';

interface PcForecast {
  id: string;
  month: string;
  expectedCalls: number;
  expectedDistributions: number;
  net: number;
  confidence: string;
}

interface PcForecastPanelProps {
  forecasts: PcForecast[];
  onEdit?: (id: string) => void;
  onCreateTask?: () => void;
}

export function PcForecastPanel({ forecasts, onEdit, onCreateTask }: PcForecastPanelProps) {
  const formatCurrency = (val: number) => {
    const prefix = val >= 0 ? '+' : '';
    return prefix + new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatMonth = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
  };

  const confidenceLabels: Record<string, string> = {
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая',
    manual: 'Ручная'
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Прогноз Cash Flow</h3>
          <p className="text-xs text-stone-500 mt-1">Ожидаемые calls и distributions</p>
        </div>
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            className="px-3 py-1.5 text-xs bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
          >
            + Задача на review
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Месяц</th>
              <th className="text-right p-3 font-medium text-stone-600">Calls</th>
              <th className="text-right p-3 font-medium text-stone-600">Distributions</th>
              <th className="text-right p-3 font-medium text-stone-600">Net</th>
              <th className="text-left p-3 font-medium text-stone-600">Confidence</th>
              {onEdit && <th className="text-right p-3 font-medium text-stone-600"></th>}
            </tr>
          </thead>
          <tbody>
            {forecasts.map(f => (
              <tr key={f.id} className="border-t border-stone-100 hover:bg-stone-50/50 transition-colors">
                <td className="p-3 font-medium text-stone-800">{formatMonth(f.month)}</td>
                <td className="p-3 text-right text-rose-600">-{formatCurrency(f.expectedCalls).replace('+', '')}</td>
                <td className="p-3 text-right text-emerald-600">+{formatCurrency(f.expectedDistributions).replace('+', '')}</td>
                <td className={cn(
                  "p-3 text-right font-medium",
                  f.net >= 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {formatCurrency(f.net)}
                </td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    f.confidence === 'high' && "bg-emerald-100 text-emerald-700",
                    f.confidence === 'medium' && "bg-amber-100 text-amber-700",
                    f.confidence === 'low' && "bg-stone-100 text-stone-600",
                    f.confidence === 'manual' && "bg-blue-100 text-blue-700"
                  )}>
                    {confidenceLabels[f.confidence] || f.confidence}
                  </span>
                </td>
                {onEdit && (
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onEdit(f.id)}
                      className="text-xs text-stone-500 hover:text-stone-700"
                    >
                      ✏️
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
