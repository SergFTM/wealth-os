"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  sourceType: string;
  reconciled: boolean;
}

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  functionalCurrency: string;
}

interface GlAccountDetailProps {
  account: Account;
  balance: { debit: number; credit: number };
  recentTransactions: Transaction[];
  period: string;
  onViewTransactions?: () => void;
  onEdit?: () => void;
}

const typeLabels: Record<string, string> = {
  asset: 'Актив',
  liability: 'Обязательство',
  equity: 'Капитал',
  income: 'Доход',
  expense: 'Расход'
};

export function GlAccountDetail({
  account,
  balance,
  recentTransactions,
  period,
  onViewTransactions,
  onEdit
}: GlAccountDetailProps) {
  const formatCurrency = (val: number) => val.toLocaleString('ru-RU', { minimumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-stone-500 font-mono">{account.code}</p>
            <h2 className="text-xl font-semibold text-stone-800">{account.name}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>Изменить</Button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Тип</p>
            <p className="font-medium text-stone-800">{typeLabels[account.type]}</p>
          </div>
          <div>
            <p className="text-stone-500">Валюта</p>
            <p className="font-medium text-stone-800">{account.functionalCurrency}</p>
          </div>
          <div>
            <p className="text-stone-500">Период</p>
            <p className="font-medium text-stone-800">{period}</p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-3">Баланс за период</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-blue-600 mb-1">Дебет</p>
            <p className="text-lg font-bold text-blue-700">{formatCurrency(balance.debit)}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg text-center">
            <p className="text-xs text-rose-600 mb-1">Кредит</p>
            <p className="text-lg font-bold text-rose-700">{formatCurrency(balance.credit)}</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg text-center">
            <p className="text-xs text-stone-600 mb-1">Сальдо</p>
            <p className={cn("text-lg font-bold", balance.debit - balance.credit >= 0 ? "text-emerald-700" : "text-rose-700")}>
              {formatCurrency(Math.abs(balance.debit - balance.credit))}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Последние транзакции</h3>
          <Button variant="ghost" size="sm" onClick={onViewTransactions}>Все транзакции →</Button>
        </div>
        <div className="divide-y divide-stone-100">
          {recentTransactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-800">{new Date(tx.date).toLocaleDateString('ru-RU')}</p>
                <p className="text-xs text-stone-500">{tx.sourceType}</p>
              </div>
              <div className="text-right">
                <p className={cn("font-mono", tx.amount >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)} {tx.currency}
                </p>
                {tx.reconciled && <span className="text-xs text-emerald-500">✓ сверено</span>}
              </div>
            </div>
          ))}
        </div>
        {recentTransactions.length === 0 && (
          <div className="p-6 text-center text-stone-500">Нет транзакций за период</div>
        )}
      </div>
    </div>
  );
}
