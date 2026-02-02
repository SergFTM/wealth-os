"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TrialBalanceRow {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

interface GlTrialBalanceWidgetProps {
  rows: TrialBalanceRow[];
  period: string;
  entity?: string;
}

export function GlTrialBalanceWidget({ rows, period, entity }: GlTrialBalanceWidgetProps) {
  const router = useRouter();
  const formatCurrency = (val: number) => val.toLocaleString('ru-RU', { minimumFractionDigits: 2 });

  const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Оборотно-сальдовая ведомость</h3>
          <p className="text-xs text-stone-500">{entity || 'Консолидировано'} · {period}</p>
        </div>
        <button
          onClick={() => router.push('/m/general-ledger/list?tab=reports&report=trial_balance')}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Открыть полный →
        </button>
      </div>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50/30">
            <th className="text-left py-2 px-4 text-xs font-medium text-stone-500">Счёт</th>
            <th className="text-right py-2 px-4 text-xs font-medium text-stone-500">Дебет</th>
            <th className="text-right py-2 px-4 text-xs font-medium text-stone-500">Кредит</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((row, i) => (
            <tr key={i} className="border-b border-stone-50">
              <td className="py-2 px-4">
                <span className="font-mono text-xs text-stone-500 mr-2">{row.accountCode}</span>
                <span className="text-stone-700">{row.accountName}</span>
              </td>
              <td className="py-2 px-4 text-right font-mono text-stone-800">
                {row.debit > 0 ? formatCurrency(row.debit) : '—'}
              </td>
              <td className="py-2 px-4 text-right font-mono text-stone-800">
                {row.credit > 0 ? formatCurrency(row.credit) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-stone-50/50 font-semibold">
            <td className="py-3 px-4 text-stone-700">Итого</td>
            <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(totalDebit)}</td>
            <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(totalCredit)}</td>
          </tr>
        </tfoot>
      </table>

      {Math.abs(totalDebit - totalCredit) > 0.01 && (
        <div className="p-3 bg-rose-50 border-t border-rose-200">
          <p className="text-xs text-rose-700">⚠️ Дебет ≠ Кредит. Разница: {formatCurrency(Math.abs(totalDebit - totalCredit))}</p>
        </div>
      )}
    </div>
  );
}
