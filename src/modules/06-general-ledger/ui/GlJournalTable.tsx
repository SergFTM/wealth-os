"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface JournalEntry {
  id: string;
  entityId: string;
  date: string;
  periodId: string;
  memo: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'pending_approval' | 'posted' | 'rejected';
  createdBy: string;
  updatedAt: string;
}

interface GlJournalTableProps {
  entries: JournalEntry[];
  onOpen?: (id: string) => void;
  onSubmit?: (id: string) => void;
  onPost?: (id: string) => void;
  compact?: boolean;
}

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  pending_approval: 'На согласовании',
  posted: 'Проведено',
  rejected: 'Отклонено'
};

const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'pending'> = {
  draft: 'pending',
  pending_approval: 'warning',
  posted: 'ok',
  rejected: 'critical'
};

export function GlJournalTable({ entries, onOpen, onSubmit, onPost, compact }: GlJournalTableProps) {
  const router = useRouter();
  const formatCurrency = (val: number) => val.toLocaleString('ru-RU', { minimumFractionDigits: 2 });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="p-4 border-b border-stone-200">
          <h3 className="font-semibold text-stone-800">Журнальные проводки</h3>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">ID</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Entity</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Период</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дата</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Описание</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дебет</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr
              key={entry.id}
              onClick={() => onOpen?.(entry.id)}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer"
            >
              <td className="py-3 px-4 font-mono text-xs text-stone-600">{entry.id.split('-')[1]}</td>
              <td className="py-3 px-4 text-stone-600 text-xs">{entry.entityId.split('-')[1]}</td>
              <td className="py-3 px-4 text-center text-stone-600 text-xs">{entry.periodId.replace('period-', '')}</td>
              <td className="py-3 px-4 text-center text-stone-600">{new Date(entry.date).toLocaleDateString('ru-RU')}</td>
              <td className="py-3 px-4 text-stone-800 truncate max-w-[200px]">{entry.memo}</td>
              <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(entry.totalDebit)}</td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={statusMap[entry.status]} size="sm" label={statusLabels[entry.status]} />
              </td>
              <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                {entry.status === 'draft' && (
                  <Button variant="ghost" size="sm" onClick={() => onSubmit?.(entry.id)}>Отправить</Button>
                )}
                {entry.status === 'pending_approval' && (
                  <Button variant="primary" size="sm" onClick={() => onPost?.(entry.id)}>Провести</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && (
        <div className="p-8 text-center text-stone-500">Нет проводок</div>
      )}
    </div>
  );
}
