"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Account {
  id: string;
  code: string;
  name: string;
}

interface Line {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  description: string;
}

interface GlEntryComposerProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: { memo: string; entityId: string; periodId: string; lines: Line[] }) => void;
  accounts: Account[];
  entities: { id: string; name: string }[];
  periods: { id: string; name: string }[];
  initialEntry?: { memo: string; entityId: string; periodId: string; lines: Line[] };
}

export function GlEntryComposer({
  open,
  onClose,
  onSave,
  accounts,
  entities,
  periods,
  initialEntry
}: GlEntryComposerProps) {
  const [memo, setMemo] = useState(initialEntry?.memo || '');
  const [entityId, setEntityId] = useState(initialEntry?.entityId || entities[0]?.id || '');
  const [periodId, setPeriodId] = useState(initialEntry?.periodId || periods[0]?.id || '');
  const [lines, setLines] = useState<Line[]>(initialEntry?.lines || [
    { id: '1', accountId: '', debit: 0, credit: 0, description: '' },
    { id: '2', accountId: '', debit: 0, credit: 0, description: '' }
  ]);

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const addLine = () => {
    setLines([...lines, { id: String(Date.now()), accountId: '', debit: 0, credit: 0, description: '' }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof Line, value: string | number) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSave = () => {
    if (!isBalanced || !memo || lines.some(l => !l.accountId)) return;
    onSave({ memo, entityId, periodId, lines });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">
            {initialEntry ? 'Редактировать проводку' : 'Новая проводка'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-600 mb-1 block">Entity</label>
              <select value={entityId} onChange={e => setEntityId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm">
                {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-600 mb-1 block">Период</label>
              <select value={periodId} onChange={e => setPeriodId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm">
                {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-600 mb-1 block">Описание</label>
            <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="Описание проводки..." className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-stone-600">Линии</label>
              <Button variant="ghost" size="sm" onClick={addLine}>+ Добавить</Button>
            </div>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={line.id} className="flex gap-2 items-start p-2 bg-stone-50 rounded-lg">
                  <span className="text-xs text-stone-400 mt-2">{i + 1}</span>
                  <select value={line.accountId} onChange={e => updateLine(line.id, 'accountId', e.target.value)} className="flex-1 px-2 py-1.5 border border-stone-200 rounded text-sm">
                    <option value="">Выберите счёт</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
                  </select>
                  <input type="number" value={line.debit || ''} onChange={e => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)} placeholder="Дебет" className="w-24 px-2 py-1.5 border border-stone-200 rounded text-sm text-right" />
                  <input type="number" value={line.credit || ''} onChange={e => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)} placeholder="Кредит" className="w-24 px-2 py-1.5 border border-stone-200 rounded text-sm text-right" />
                  <button onClick={() => removeLine(line.id)} className="p-1 text-stone-400 hover:text-rose-500" disabled={lines.length <= 2}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className={cn("p-3 rounded-lg text-sm flex items-center justify-between", isBalanced ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
            <span>{isBalanced ? '✓ Сбалансировано' : '⚠ Не сбалансировано'}</span>
            <span>Дебет: {totalDebit.toFixed(2)} | Кредит: {totalCredit.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="secondary" onClick={handleSave} disabled={!isBalanced}>Сохранить черновик</Button>
          <Button variant="primary" onClick={handleSave} disabled={!isBalanced}>Отправить на согласование</Button>
        </div>
      </div>
    </div>
  );
}
