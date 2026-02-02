"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  entityId: string | null;
  functionalCurrency: string;
  isActive: boolean;
}

interface GlCoATableProps {
  accounts: Account[];
  onEdit?: (id: string) => void;
  onDisable?: (id: string) => void;
  readOnly?: boolean;
}

const typeLabels: Record<string, string> = {
  asset: 'Актив',
  liability: 'Обязательство',
  equity: 'Капитал',
  income: 'Доход',
  expense: 'Расход'
};

const typeColors: Record<string, string> = {
  asset: 'bg-blue-100 text-blue-700',
  liability: 'bg-rose-100 text-rose-700',
  equity: 'bg-purple-100 text-purple-700',
  income: 'bg-emerald-100 text-emerald-700',
  expense: 'bg-amber-100 text-amber-700'
};

export function GlCoATable({ accounts, onEdit, onDisable, readOnly }: GlCoATableProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Код</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Entity</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Валюта</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Активен</th>
            {!readOnly && <th className="py-3 px-4"></th>}
          </tr>
        </thead>
        <tbody>
          {accounts.map(acc => (
            <tr key={acc.id} className="border-b border-stone-100 hover:bg-stone-50">
              <td className="py-3 px-4 font-mono text-stone-800">{acc.code}</td>
              <td className="py-3 px-4 font-medium text-stone-800">{acc.name}</td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", typeColors[acc.type])}>
                  {typeLabels[acc.type]}
                </span>
              </td>
              <td className="py-3 px-4 text-center text-stone-500 text-xs">
                {acc.entityId ? acc.entityId.split('-')[1] : 'Global'}
              </td>
              <td className="py-3 px-4 text-center text-stone-600">{acc.functionalCurrency}</td>
              <td className="py-3 px-4 text-center">
                <span className={cn("w-2 h-2 rounded-full inline-block", acc.isActive ? "bg-emerald-500" : "bg-stone-300")} />
              </td>
              {!readOnly && (
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.(acc.id)}>Изм.</Button>
                    <Button variant="ghost" size="sm" onClick={() => onDisable?.(acc.id)}>
                      {acc.isActive ? 'Откл.' : 'Вкл.'}
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {accounts.length === 0 && (
        <div className="p-8 text-center text-stone-500">Нет счетов в плане</div>
      )}
    </div>
  );
}
