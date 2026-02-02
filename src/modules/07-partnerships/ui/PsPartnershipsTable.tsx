"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Partnership {
  id: string;
  name: string;
  type: string;
  splitMode: string;
  nav: number;
  currency: string;
  status: string;
  ownersCount?: number;
}

interface PsPartnershipsTableProps {
  partnerships: Partnership[];
  onOpen?: (id: string) => void;
  onEdit?: (id: string) => void;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  LP: 'LP', LLC: 'LLC', Trust: 'Траст', SPV: 'SPV', Family: 'Семейный', JV: 'JV'
};

const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'pending'> = {
  active: 'ok', inactive: 'pending', liquidating: 'warning'
};

export function PsPartnershipsTable({ partnerships, onOpen, onEdit, compact }: PsPartnershipsTableProps) {
  const formatCurrency = (val: number, cur: string) => 
    val.toLocaleString('ru-RU', { style: 'currency', currency: cur, maximumFractionDigits: 0 });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="p-4 border-b border-stone-200">
          <h3 className="font-semibold text-stone-800">Партнерства</h3>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Режим</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">NAV</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Владельцы</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {partnerships.map(p => (
            <tr key={p.id} onClick={() => onOpen?.(p.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <td className="py-3 px-4 font-medium text-stone-800">{p.name}</td>
              <td className="py-3 px-4 text-center">
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-xs">{typeLabels[p.type] || p.type}</span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs", p.splitMode === 'ownership' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>
                  {p.splitMode === 'ownership' ? 'Собств.' : 'Прибыль'}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(p.nav, p.currency)}</td>
              <td className="py-3 px-4 text-center text-stone-600">{p.ownersCount ?? '—'}</td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={statusMap[p.status] || 'pending'} size="sm" label={p.status === 'active' ? 'Активен' : p.status === 'liquidating' ? 'Ликвидация' : 'Неактивен'} />
              </td>
              <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(p.id)}>Изм.</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {partnerships.length === 0 && <div className="p-8 text-center text-stone-500">Нет партнерств</div>}
    </div>
  );
}
