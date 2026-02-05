"use client";

import { ObSlaBadge } from './ObSlaBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface OnboardingCase {
  id: string;
  name: string;
  caseType: string;
  stage: string;
  status: string;
  riskTier: string | null;
  assignee: string;
  slaDueAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ObCasesTableProps {
  cases: OnboardingCase[];
  onOpen: (id: string) => void;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  household: 'Household',
  entity: 'Entity',
  trust: 'Trust',
  advisor: 'Advisor',
};

const stageLabels: Record<string, string> = {
  intake: 'Intake',
  docs: 'Документы',
  screening: 'Скрининг',
  risk: 'Риск',
  review: 'Проверка',
};

const stageColors: Record<string, string> = {
  intake: 'bg-blue-100 text-blue-700',
  docs: 'bg-amber-100 text-amber-700',
  screening: 'bg-purple-100 text-purple-700',
  risk: 'bg-orange-100 text-orange-700',
  review: 'bg-emerald-100 text-emerald-700',
};

const riskColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const statusMap: Record<string, 'active' | 'warning' | 'success' | 'critical' | 'pending' | 'draft'> = {
  active: 'active',
  on_hold: 'warning',
  ready_for_approval: 'pending',
  approved: 'success',
  rejected: 'critical',
};

export function ObCasesTable({ cases, onOpen, compact }: ObCasesTableProps) {
  if (cases.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400 text-sm">
        Нет кейсов
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left py-2 px-3 font-medium text-stone-500">Кейс</th>
            <th className="text-left py-2 px-3 font-medium text-stone-500">Тип</th>
            <th className="text-left py-2 px-3 font-medium text-stone-500">Этап</th>
            <th className="text-left py-2 px-3 font-medium text-stone-500">Статус</th>
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Риск</th>}
            <th className="text-left py-2 px-3 font-medium text-stone-500">SLA</th>
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Ответственный</th>}
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Обновлен</th>}
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr
              key={c.id}
              onClick={() => onOpen(c.id)}
              className="border-b border-stone-100 hover:bg-emerald-50/30 cursor-pointer transition-colors"
            >
              <td className="py-2 px-3 font-medium text-stone-800">{c.name}</td>
              <td className="py-2 px-3 text-stone-600">{typeLabels[c.caseType] || c.caseType}</td>
              <td className="py-2 px-3">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${stageColors[c.stage] || 'bg-stone-100 text-stone-600'}`}>
                  {stageLabels[c.stage] || c.stage}
                </span>
              </td>
              <td className="py-2 px-3">
                <StatusBadge status={statusMap[c.status] || 'info'} label={c.status === 'ready_for_approval' ? 'К согласованию' : undefined} size="sm" />
              </td>
              {!compact && (
                <td className="py-2 px-3">
                  {c.riskTier ? (
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${riskColors[c.riskTier] || ''}`}>
                      {c.riskTier}
                    </span>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
              )}
              <td className="py-2 px-3">
                <ObSlaBadge dueAt={c.slaDueAt} status={c.status} />
              </td>
              {!compact && <td className="py-2 px-3 text-stone-500">{c.assignee.split('@')[0]}</td>}
              {!compact && (
                <td className="py-2 px-3 text-stone-400 text-xs">
                  {new Date(c.updatedAt).toLocaleDateString('ru')}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
