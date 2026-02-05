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
  linkedEntityId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ObCaseDetailProps {
  caseData: OnboardingCase;
  onAssign?: () => void;
  onMoveStage?: () => void;
  onCreateTask?: () => void;
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
  risk: 'Риск-оценка',
  review: 'Проверка',
};

const stages = ['intake', 'docs', 'screening', 'risk', 'review'];

const statusMap: Record<string, 'active' | 'warning' | 'success' | 'critical' | 'pending'> = {
  active: 'active',
  on_hold: 'warning',
  ready_for_approval: 'pending',
  approved: 'success',
  rejected: 'critical',
};

export function ObCaseDetail({ caseData, onAssign, onMoveStage, onCreateTask }: ObCaseDetailProps) {
  const currentStageIdx = stages.indexOf(caseData.stage);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800">{caseData.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
            <span>{typeLabels[caseData.caseType] || caseData.caseType}</span>
            <span className="text-stone-300">|</span>
            <span>{caseData.id}</span>
          </div>
        </div>
        <StatusBadge status={statusMap[caseData.status] || 'info'} />
      </div>

      {/* Stage Progress */}
      <div className="flex items-center gap-1">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`flex-1 h-2 rounded-full ${
              i <= currentStageIdx ? 'bg-emerald-500' : 'bg-stone-200'
            }`} />
            {i < stages.length - 1 && <div className="w-1" />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-stone-400">
        {stages.map((s) => (
          <span key={s} className={s === caseData.stage ? 'text-emerald-600 font-medium' : ''}>
            {stageLabels[s]}
          </span>
        ))}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-stone-50">
          <div className="text-xs text-stone-500">Ответственный</div>
          <div className="text-sm font-medium text-stone-800">{caseData.assignee.split('@')[0]}</div>
        </div>
        <div className="p-3 rounded-lg bg-stone-50">
          <div className="text-xs text-stone-500">SLA</div>
          <ObSlaBadge dueAt={caseData.slaDueAt} status={caseData.status} />
        </div>
        <div className="p-3 rounded-lg bg-stone-50">
          <div className="text-xs text-stone-500">Риск</div>
          <div className="text-sm font-medium text-stone-800">{caseData.riskTier || '—'}</div>
        </div>
        <div className="p-3 rounded-lg bg-stone-50">
          <div className="text-xs text-stone-500">Создан</div>
          <div className="text-sm text-stone-600">{new Date(caseData.createdAt).toLocaleDateString('ru')}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onAssign && (
          <button onClick={onAssign} className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 border border-stone-200 rounded-lg">
            Назначить
          </button>
        )}
        {onMoveStage && (
          <button onClick={onMoveStage} className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg">
            Следующий этап →
          </button>
        )}
        {onCreateTask && (
          <button onClick={onCreateTask} className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 border border-stone-200 rounded-lg">
            Создать задачу
          </button>
        )}
      </div>
    </div>
  );
}
