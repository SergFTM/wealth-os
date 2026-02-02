"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ReconSummary {
  type: 'bank' | 'custodian';
  entityId: string;
  accountId: string;
  status: 'open' | 'in_progress' | 'completed';
  openItems: number;
  matchedCount: number;
  totalItems: number;
}

interface GlReconPanelProps {
  reconciliations: ReconSummary[];
  onGoToRecon?: () => void;
}

const statusLabels: Record<string, string> = {
  open: 'Открыта',
  in_progress: 'В работе',
  completed: 'Завершена'
};

const statusColors: Record<string, string> = {
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700'
};

export function GlReconPanel({ reconciliations, onGoToRecon }: GlReconPanelProps) {
  const router = useRouter();
  const bankRecons = reconciliations.filter(r => r.type === 'bank');
  const custodianRecons = reconciliations.filter(r => r.type === 'custodian');
  const totalOpen = reconciliations.reduce((sum, r) => sum + r.openItems, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Сверки</h3>
          {totalOpen > 0 && (
            <p className="text-xs text-amber-600 mt-0.5">{totalOpen} открытых позиций</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onGoToRecon ? onGoToRecon() : router.push('/m/reconciliation')}
        >
          Перейти →
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Bank Recons */}
        <div>
          <p className="text-xs font-medium text-stone-500 uppercase mb-2">Банковские</p>
          {bankRecons.length > 0 ? (
            <div className="space-y-2">
              {bankRecons.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-stone-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-stone-700">{r.accountId.split('-').pop()}</p>
                    <p className="text-xs text-stone-500">{r.matchedCount}/{r.totalItems} сверено</p>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColors[r.status])}>
                    {statusLabels[r.status]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">Нет банковских сверок</p>
          )}
        </div>

        {/* Custodian Recons */}
        <div>
          <p className="text-xs font-medium text-stone-500 uppercase mb-2">Кастодиан</p>
          {custodianRecons.length > 0 ? (
            <div className="space-y-2">
              {custodianRecons.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-stone-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-stone-700">{r.accountId.split('-').pop()}</p>
                    <p className="text-xs text-stone-500">{r.matchedCount}/{r.totalItems} сверено</p>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColors[r.status])}>
                    {statusLabels[r.status]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">Нет сверок с кастодианом</p>
          )}
        </div>
      </div>
    </div>
  );
}
