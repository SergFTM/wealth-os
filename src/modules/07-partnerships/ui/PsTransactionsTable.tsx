"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Transaction {
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
  sourceRef?: string | null;
}

interface PsTransactionsTableProps {
  transactions: Transaction[];
  onOpen?: (id: string) => void;
  onApprove?: (id: string) => void;
  onPost?: (id: string) => void;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  contribution: 'Взнос', subscription: 'Подписка', redemption: 'Выкуп',
  buy_interest: 'Покупка', sell_interest: 'Продажа'
};
const typeColors: Record<string, string> = {
  contribution: 'bg-emerald-100 text-emerald-700', subscription: 'bg-blue-100 text-blue-700',
  redemption: 'bg-rose-100 text-rose-700', buy_interest: 'bg-purple-100 text-purple-700',
  sell_interest: 'bg-amber-100 text-amber-700'
};
const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'pending'> = {
  draft: 'pending', pending: 'warning', posted: 'ok', rejected: 'critical'
};

export function PsTransactionsTable({ transactions, onOpen, onApprove, onPost, compact }: PsTransactionsTableProps) {
  const formatCurrency = (val: number, cur: string) => val.toLocaleString('ru-RU', { style: 'currency', currency: cur, maximumFractionDigits: 0 });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && <div className="p-4 border-b border-stone-200"><h3 className="font-semibold text-stone-800">Транзакции</h3></div>}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дата</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Партнерство</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Владелец</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Сумма</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} onClick={() => onOpen?.(tx.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <td className="py-3 px-4 text-center text-stone-600">{new Date(tx.date).toLocaleDateString('ru-RU')}</td>
              <td className="py-3 px-4 text-stone-800">{tx.partnershipName || tx.partnershipId.split('-').pop()}</td>
              <td className="py-3 px-4 text-stone-800">{tx.ownerName || tx.ownerId.split('-').pop()}</td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs", typeColors[tx.type])}>{typeLabels[tx.type]}</span>
              </td>
              <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(tx.amount, tx.currency)}</td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={statusMap[tx.status]} size="sm" label={tx.status === 'posted' ? 'Проведено' : tx.status === 'pending' ? 'Ожидает' : tx.status === 'draft' ? 'Черновик' : 'Отклонено'} />
              </td>
              <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                {tx.status === 'pending' && <Button variant="primary" size="sm" onClick={() => onApprove?.(tx.id)}>Одобрить</Button>}
                {tx.status === 'pending' && <Button variant="ghost" size="sm" onClick={() => onPost?.(tx.id)}>GL</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && <div className="p-8 text-center text-stone-500">Нет транзакций</div>}
    </div>
  );
}
