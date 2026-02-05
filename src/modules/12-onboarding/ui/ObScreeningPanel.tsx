"use client";

import { StatusBadge } from '@/components/ui/StatusBadge';

interface ScreeningCheck {
  id: string;
  caseId: string;
  subjectName: string;
  checkType: string;
  provider: string;
  status: string;
  resultRef: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ObScreeningPanelProps {
  checks: ScreeningCheck[];
  onMarkClear: (id: string) => void;
  onMarkMatch: (id: string) => void;
  onNeedsInfo: (id: string) => void;
  compact?: boolean;
}

const checkTypeLabels: Record<string, string> = {
  sanctions: 'Санкции',
  pep: 'PEP',
  adverse: 'Adverse Media',
};

const checkTypeColors: Record<string, string> = {
  sanctions: 'bg-red-50 text-red-700',
  pep: 'bg-purple-50 text-purple-700',
  adverse: 'bg-amber-50 text-amber-700',
};

const statusMap: Record<string, 'pending' | 'success' | 'critical' | 'warning'> = {
  pending: 'pending',
  clear: 'success',
  match: 'critical',
  needs_info: 'warning',
};

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  clear: 'Чисто',
  match: 'Совпадение',
  needs_info: 'Нужна инфо',
};

export function ObScreeningPanel({ checks, onMarkClear, onMarkMatch, onNeedsInfo, compact }: ObScreeningPanelProps) {
  if (checks.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400 text-sm">
        Нет проверок
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left py-2 px-3 font-medium text-stone-500">Субъект</th>
            <th className="text-left py-2 px-3 font-medium text-stone-500">Тип</th>
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Провайдер</th>}
            <th className="text-left py-2 px-3 font-medium text-stone-500">Статус</th>
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.id} className="border-b border-stone-100 hover:bg-stone-50/50">
              <td className="py-2 px-3 font-medium text-stone-800">{check.subjectName}</td>
              <td className="py-2 px-3">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${checkTypeColors[check.checkType] || ''}`}>
                  {checkTypeLabels[check.checkType] || check.checkType}
                </span>
              </td>
              {!compact && <td className="py-2 px-3 text-stone-500 text-xs">{check.provider || '—'}</td>}
              <td className="py-2 px-3">
                <StatusBadge status={statusMap[check.status] || 'info'} label={statusLabels[check.status]} size="sm" />
              </td>
              {!compact && (
                <td className="py-2 px-3">
                  {check.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => onMarkClear(check.id)} className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded">Clear</button>
                      <button onClick={() => onMarkMatch(check.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Match</button>
                      <button onClick={() => onNeedsInfo(check.id)} className="px-2 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded">Info</button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
