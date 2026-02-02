"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Line {
  id: string;
  accountId: string;
  accountCode?: string;
  accountName?: string;
  debit: number;
  credit: number;
  currency: string;
  description: string;
}

interface Entry {
  id: string;
  entityId: string;
  date: string;
  periodId: string;
  memo: string;
  status: 'draft' | 'pending_approval' | 'posted' | 'rejected';
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  postedBy?: string | null;
  postedAt?: string | null;
  docIds: string[];
}

interface GlEntryDetailProps {
  entry: Entry;
  lines: Line[];
  onEdit?: () => void;
  onSubmit?: () => void;
  onPost?: () => void;
  onDelete?: () => void;
  onAttachDoc?: () => void;
  onViewAudit?: () => void;
  readOnly?: boolean;
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

export function GlEntryDetail({
  entry,
  lines,
  onEdit,
  onSubmit,
  onPost,
  onDelete,
  onAttachDoc,
  onViewAudit,
  readOnly
}: GlEntryDetailProps) {
  const formatCurrency = (val: number) => val.toLocaleString('ru-RU', { minimumFractionDigits: 2 });
  const isBalanced = Math.abs(entry.totalDebit - entry.totalCredit) < 0.01;
  const isDraft = entry.status === 'draft';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">{entry.memo}</h2>
            <p className="text-sm text-stone-500">ID: {entry.id}</p>
          </div>
          <StatusBadge status={statusMap[entry.status]} label={statusLabels[entry.status]} />
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Entity</p>
            <p className="font-medium text-stone-800">{entry.entityId}</p>
          </div>
          <div>
            <p className="text-stone-500">Дата</p>
            <p className="font-medium text-stone-800">{new Date(entry.date).toLocaleDateString('ru-RU')}</p>
          </div>
          <div>
            <p className="text-stone-500">Период</p>
            <p className="font-medium text-stone-800">{entry.periodId.replace('period-', '')}</p>
          </div>
          <div>
            <p className="text-stone-500">Создал</p>
            <p className="font-medium text-stone-800">{entry.createdBy.split('@')[0]}</p>
          </div>
        </div>
        {entry.postedBy && (
          <div className="mt-3 pt-3 border-t border-stone-100 text-sm">
            <span className="text-stone-500">Проведено: </span>
            <span className="text-stone-700">{entry.postedBy.split('@')[0]} · {entry.postedAt && new Date(entry.postedAt).toLocaleString('ru-RU')}</span>
          </div>
        )}
      </div>

      {/* Lines */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Линии проводки</h3>
          {isDraft && !readOnly && <Button variant="ghost" size="sm" onClick={onEdit}>Изменить</Button>}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="text-left py-2 px-4 text-xs font-medium text-stone-500">Счёт</th>
              <th className="text-right py-2 px-4 text-xs font-medium text-stone-500">Дебет</th>
              <th className="text-right py-2 px-4 text-xs font-medium text-stone-500">Кредит</th>
              <th className="text-left py-2 px-4 text-xs font-medium text-stone-500">Описание</th>
            </tr>
          </thead>
          <tbody>
            {lines.map(line => (
              <tr key={line.id} className="border-b border-stone-50">
                <td className="py-2 px-4">
                  <span className="font-mono text-xs text-stone-500 mr-1">{line.accountCode}</span>
                  <span className="text-stone-700">{line.accountName}</span>
                </td>
                <td className="py-2 px-4 text-right font-mono text-stone-800">
                  {line.debit > 0 ? formatCurrency(line.debit) : '—'}
                </td>
                <td className="py-2 px-4 text-right font-mono text-stone-800">
                  {line.credit > 0 ? formatCurrency(line.credit) : '—'}
                </td>
                <td className="py-2 px-4 text-stone-600">{line.description}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-stone-50/50 font-semibold">
              <td className="py-3 px-4 text-stone-700">Итого</td>
              <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(entry.totalDebit)}</td>
              <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(entry.totalCredit)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        {!isBalanced && (
          <div className="p-3 bg-rose-50 border-t border-rose-200">
            <p className="text-sm text-rose-700">⚠️ Проводка не сбалансирована</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onViewAudit}>Аудит</Button>
          <Button variant="secondary" onClick={onAttachDoc}>Прикрепить документ</Button>
          {isDraft && <Button variant="ghost" className="text-rose-600" onClick={onDelete}>Удалить</Button>}
          {isDraft && <Button variant="primary" onClick={onSubmit}>Отправить на согласование</Button>}
          {entry.status === 'pending_approval' && <Button variant="primary" onClick={onPost}>Провести</Button>}
        </div>
      )}
    </div>
  );
}
