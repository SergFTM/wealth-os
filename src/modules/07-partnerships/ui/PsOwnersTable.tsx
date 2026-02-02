"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Owner {
  id: string;
  name: string;
  ownerType: string;
  residence: string | null;
  kycStatus: string;
  status: string;
}

interface PsOwnersTableProps {
  owners: Owner[];
  onOpen?: (id: string) => void;
  onLinkEntity?: (id: string) => void;
}

const typeLabels: Record<string, string> = { person: 'Физлицо', entity: 'Юрлицо', trust: 'Траст' };
const kycColors: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  expired: 'bg-rose-100 text-rose-700',
  not_required: 'bg-stone-100 text-stone-500'
};

export function PsOwnersTable({ owners, onOpen, onLinkEntity }: PsOwnersTableProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Owner/EBO</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Резид.</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">KYC</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {owners.map(o => (
            <tr key={o.id} onClick={() => onOpen?.(o.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <td className="py-3 px-4 font-medium text-stone-800">{o.name}</td>
              <td className="py-3 px-4 text-center">
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-xs">{typeLabels[o.ownerType]}</span>
              </td>
              <td className="py-3 px-4 text-center text-stone-600">{o.residence || '—'}</td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs", kycColors[o.kycStatus])}>
                  {o.kycStatus === 'approved' ? 'OK' : o.kycStatus === 'pending' ? 'Ожидает' : o.kycStatus === 'expired' ? 'Истёк' : 'Не треб.'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={cn("w-2 h-2 rounded-full inline-block", o.status === 'active' ? "bg-emerald-500" : "bg-stone-300")} />
              </td>
              <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" onClick={() => onLinkEntity?.(o.id)}>Link entity</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {owners.length === 0 && <div className="p-8 text-center text-stone-500">Нет владельцев</div>}
    </div>
  );
}
