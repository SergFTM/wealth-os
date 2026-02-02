"use client";

import { cn } from '@/lib/utils';

interface Allocation {
  id: string;
  partnershipId: string;
  dimension: string;
  segment: string;
  value: number;
  currency: string;
  weight: number;
}

interface PsAllocationPanelProps {
  allocations: Allocation[];
  dimension?: 'assetClass' | 'geo' | 'strategy';
  partnershipName?: string;
}

const dimensionLabels: Record<string, string> = {
  assetClass: 'Класс активов', geo: 'География', strategy: 'Стратегия', sector: 'Сектор'
};

export function PsAllocationPanel({ allocations, dimension = 'assetClass', partnershipName }: PsAllocationPanelProps) {
  const filtered = allocations.filter(a => a.dimension === dimension);
  const total = filtered.reduce((s, a) => s + a.value, 0);
  const formatCurrency = (val: number, cur: string) => val.toLocaleString('ru-RU', { style: 'currency', currency: cur, maximumFractionDigits: 0 });
  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-stone-800">Аллокации</h3>
          {partnershipName && <p className="text-xs text-stone-500">{partnershipName}</p>}
        </div>
        <span className="text-xs text-stone-500">{dimensionLabels[dimension]}</span>
      </div>
      <div className="h-4 rounded-full overflow-hidden flex mb-4">
        {filtered.map((a, i) => (
          <div key={a.id} className={cn("h-full", colors[i % colors.length])} style={{ width: `${a.weight}%` }} title={a.segment} />
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((a, i) => (
          <div key={a.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={cn("w-3 h-3 rounded-sm", colors[i % colors.length])} />
              <span className="text-stone-700">{a.segment}</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-stone-800">{formatCurrency(a.value, a.currency)}</span>
              <span className="text-xs text-stone-500 ml-2">{a.weight.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-stone-500 text-sm text-center py-4">Нет данных</p>}
    </div>
  );
}
