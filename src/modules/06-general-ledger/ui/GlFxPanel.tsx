"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface FxRate {
  id: string;
  date: string;
  pair: string;
  rate: number;
  sourceType: string;
  status: 'ok' | 'missing' | 'stale';
}

interface GlFxPanelProps {
  rates: FxRate[];
  onAddRate?: () => void;
  onImport?: () => void;
  compact?: boolean;
}

const statusLabels: Record<string, string> = {
  ok: 'OK',
  missing: 'Отсутствует',
  stale: 'Устарел'
};

export function GlFxPanel({ rates, onAddRate, onImport, compact }: GlFxPanelProps) {
  const missingCount = rates.filter(r => r.status === 'missing').length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">FX Курсы</h3>
          {missingCount > 0 && (
            <p className="text-xs text-rose-600 mt-0.5">⚠️ {missingCount} курсов отсутствует</p>
          )}
        </div>
        {!compact && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onImport}>Импорт</Button>
            <Button variant="primary" size="sm" onClick={onAddRate}>Добавить</Button>
          </div>
        )}
      </div>

      <div className="divide-y divide-stone-100 max-h-[300px] overflow-y-auto">
        {rates.slice(0, compact ? 5 : rates.length).map(rate => (
          <div key={rate.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-800">{rate.pair}</p>
              <p className="text-xs text-stone-500">{new Date(rate.date).toLocaleDateString('ru-RU')}</p>
            </div>
            <div className="text-right">
              {rate.status === 'ok' ? (
                <p className="font-mono text-stone-800">{rate.rate.toFixed(4)}</p>
              ) : (
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  rate.status === 'missing' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                )}>
                  {statusLabels[rate.status]}
                </span>
              )}
              <p className="text-xs text-stone-400 mt-0.5">{rate.sourceType.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>

      {rates.length === 0 && (
        <div className="p-6 text-center text-stone-500">
          <p className="mb-3">Нет FX курсов</p>
          <Button variant="secondary" onClick={onAddRate}>Добавить курс</Button>
        </div>
      )}
    </div>
  );
}
