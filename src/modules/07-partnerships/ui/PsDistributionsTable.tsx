"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Distribution {
  id: string;
  partnershipId: string;
  partnershipName?: string;
  ownerId: string;
  ownerName?: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  docIds?: string[];
}

interface PsDistributionsTableProps {
  distributions: Distribution[];
  onOpen?: (id: string) => void;
  onApprove?: (id: string) => void;
  onPost?: (id: string) => void;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  cash: 'Cash', in_kind: 'In-kind', return_of_capital: 'Возврат капит.', fee: 'Комиссия'
};
const typeColors: Record<string, string> = {
  cash: 'bg-emerald-100 text-emerald-700', in_kind: 'bg-blue-100 text-blue-700',
  return_of_capital: 'bg-purple-100 text-purple-700', fee: 'bg-amber-100 text-amber-700'
};
const statusMap: Record<string, 'ok' | 'warning' | 'pending'> = {
  posted: 'ok', pending: 'warning', draft: 'pending'
};
const statusLabels: Record<string, string> = {
  posted: 'Проведено', pending: 'Ожидает', draft: 'Черновик'
};

export function PsDistributionsTable({ distributions, onOpen, onApprove, onPost, compact }: PsDistributionsTableProps) {
  const formatCurrency = (val: number, cur: string) => val.toLocaleString('ru-RU', { style: 'currency', currency: cur, maximumFractionDigits: 0 });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && <div className="p-4 border-b border-stone-200"><h3 className="font-semibold text-stone-800">Распределения</h3></div>}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дата</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Партнерство</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Владелец</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Сумма</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Док</th>
            {!compact && <th className="py-3 px-4"></th>}
          </tr>
        </thead>
        <tbody>
          {distributions.map(d => (
            <tr key={d.id} onClick={() => onOpen?.(d.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <td className="py-3 px-4 text-center text-stone-600">{new Date(d.date).toLocaleDateString('ru-RU')}</td>
              <td className="py-3 px-4 text-stone-800">{d.partnershipName || d.partnershipId.split('-').pop()}</td>
              <td className="py-3 px-4 text-stone-800">{d.ownerName || d.ownerId.split('-').pop()}</td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs", typeColors[d.type])}>{typeLabels[d.type]}</span>
              </td>
              <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(d.amount, d.currency)}</td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={statusMap[d.status] || 'pending'} size="sm" label={statusLabels[d.status] || d.status} />
              </td>
              <td className="py-3 px-4 text-center">
                {(d.docIds && d.docIds.length > 0) ? (
                  <span className="text-emerald-600">📎</span>
                ) : (
                  <span className="text-stone-300">—</span>
                )}
              </td>
              {!compact && (
                <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                  {d.status === 'pending' && (
                    <>
                      <Button variant="primary" size="sm" onClick={() => onApprove?.(d.id)}>Одобрить</Button>
                      <Button variant="ghost" size="sm" onClick={() => onPost?.(d.id)}>GL</Button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {distributions.length === 0 && <div className="p-8 text-center text-stone-500">Нет распределений</div>}
    </div>
  );
}
