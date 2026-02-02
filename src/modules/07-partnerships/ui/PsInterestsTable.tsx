"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Interest {
  id: string;
  partnershipId: string;
  partnershipName?: string;
  ownerId: string;
  ownerName?: string;
  ownershipPct: number;
  profitSharePct: number;
  effectiveDate: string;
  status: string;
  approved: boolean;
}

interface PsInterestsTableProps {
  interests: Interest[];
  onOpen?: (id: string) => void;
  onApprove?: (id: string) => void;
  splitMode?: 'ownership' | 'profit';
}

export function PsInterestsTable({ interests, onOpen, onApprove, splitMode = 'ownership' }: PsInterestsTableProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Партнерство</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Владелец</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">
              {splitMode === 'ownership' ? 'Владение %' : 'Прибыль %'}
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дата</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {interests.map(i => (
            <tr key={i.id} onClick={() => onOpen?.(i.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <td className="py-3 px-4 text-stone-800">{i.partnershipName || i.partnershipId}</td>
              <td className="py-3 px-4 text-stone-800">{i.ownerName || i.ownerId}</td>
              <td className="py-3 px-4 text-right font-mono font-medium text-stone-800">
                {splitMode === 'ownership' ? i.ownershipPct : i.profitSharePct}%
              </td>
              <td className="py-3 px-4 text-center text-stone-600">{new Date(i.effectiveDate).toLocaleDateString('ru-RU')}</td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium",
                  i.status === 'active' && i.approved ? "bg-emerald-100 text-emerald-700" :
                  i.status === 'pending_change' ? "bg-amber-100 text-amber-700" :
                  "bg-stone-100 text-stone-500"
                )}>
                  {i.status === 'active' ? 'Активна' : i.status === 'pending_change' ? 'Ожидает' : 'Закрыта'}
                </span>
              </td>
              <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                {i.status === 'pending_change' && !i.approved && (
                  <Button variant="primary" size="sm" onClick={() => onApprove?.(i.id)}>Одобрить</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {interests.length === 0 && <div className="p-8 text-center text-stone-500">Нет долей</div>}
    </div>
  );
}
