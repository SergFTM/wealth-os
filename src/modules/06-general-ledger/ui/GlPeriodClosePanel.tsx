"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Period {
  id: string;
  entityId: string;
  name: string;
  status: 'open' | 'closing' | 'closed';
  closeChecklist: {
    journalsPosted: boolean;
    fxRatesPresent: boolean;
    reconciliationsComplete: boolean;
    approvalsComplete: boolean;
  };
}

interface GlPeriodClosePanelProps {
  period: Period;
  onStartClose?: () => void;
  onRequestApproval?: () => void;
  onClose?: () => void;
  onReopen?: () => void;
  canClose?: boolean;
  canReopen?: boolean;
}

const checklistItems = [
  { key: 'journalsPosted', label: 'Все проводки проведены' },
  { key: 'fxRatesPresent', label: 'FX курсы заполнены' },
  { key: 'reconciliationsComplete', label: 'Сверки завершены' },
  { key: 'approvalsComplete', label: 'Согласования получены' }
];

export function GlPeriodClosePanel({
  period,
  onStartClose,
  onRequestApproval,
  onClose,
  onReopen,
  canClose = false,
  canReopen = false
}: GlPeriodClosePanelProps) {
  const checklist = period.closeChecklist;
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const allComplete = completedCount === totalCount;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-800">Закрытие периода</h3>
            <p className="text-sm text-stone-500">{period.name} · {period.entityId.split('-').pop()}</p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            period.status === 'open' ? "bg-emerald-100 text-emerald-700" :
            period.status === 'closing' ? "bg-amber-100 text-amber-700" :
            "bg-stone-100 text-stone-700"
          )}>
            {period.status === 'open' ? 'Открыт' : period.status === 'closing' ? 'Закрывается' : 'Закрыт'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-stone-600">Чеклист закрытия</span>
            <span className="font-medium text-stone-800">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all", allComplete ? "bg-emerald-500" : "bg-amber-500")}
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {checklistItems.map(item => {
            const done = checklist[item.key as keyof typeof checklist];
            return (
              <li key={item.key} className="flex items-center gap-2 text-sm">
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  done ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400"
                )}>
                  {done ? '✓' : '○'}
                </span>
                <span className={done ? "text-stone-700" : "text-stone-500"}>{item.label}</span>
              </li>
            );
          })}
        </ul>

        {period.status === 'open' && (
          <Button variant="secondary" className="w-full" onClick={onStartClose}>
            Начать закрытие
          </Button>
        )}

        {period.status === 'closing' && !allComplete && (
          <p className="text-sm text-amber-600 text-center">Завершите чеклист для закрытия</p>
        )}

        {period.status === 'closing' && allComplete && !canClose && (
          <Button variant="primary" className="w-full" onClick={onRequestApproval}>
            Запросить согласование
          </Button>
        )}

        {period.status === 'closing' && allComplete && canClose && (
          <Button variant="primary" className="w-full" onClick={onClose}>
            Закрыть период
          </Button>
        )}

        {period.status === 'closed' && canReopen && (
          <Button variant="ghost" className="w-full text-amber-600" onClick={onReopen}>
            Переоткрыть период
          </Button>
        )}
      </div>
    </div>
  );
}
