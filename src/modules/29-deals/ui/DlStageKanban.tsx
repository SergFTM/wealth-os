'use client';

import { useRouter } from 'next/navigation';
import { DlStatusPill, DlAssetTypePill } from './DlStatusPill';
import { cn } from '@/lib/utils';

interface Deal {
  id: string;
  dealNumber: string;
  name: string;
  assetType: string;
  stageId: string;
  status: string;
  estimatedValue: number;
  currency: string;
  expectedCloseAt: string;
}

interface Stage {
  id: string;
  name: string;
  nameRu?: string;
  color: string;
  isClosedStage: boolean;
}

interface DlStageKanbanProps {
  deals: Deal[];
  stages: Stage[];
  compact?: boolean;
  onMoveStage?: (dealId: string, newStageId: string) => void;
}

export function DlStageKanban({ deals, stages, compact = false, onMoveStage }: DlStageKanbanProps) {
  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const sortedStages = [...stages].sort((a, b) => {
    const orderA = parseInt(a.id.replace('stage-', '')) || 0;
    const orderB = parseInt(b.id.replace('stage-', '')) || 0;
    return orderA - orderB;
  });

  const getDealsByStage = (stageId: string) => {
    return deals.filter(d => d.stageId === stageId && d.status !== 'cancelled');
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/m/deals/deal/${dealId}`);
  };

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sortedStages.filter(s => !s.isClosedStage).map(stage => {
          const stageDeals = getDealsByStage(stage.id);
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-48 rounded-lg bg-white/60 backdrop-blur border border-white/20 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{stage.nameRu || stage.name}</span>
                <span
                  className="w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full"
                  style={{ backgroundColor: stage.color + '20', color: stage.color }}
                >
                  {stageDeals.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageDeals.slice(0, 3).map(deal => (
                  <div
                    key={deal.id}
                    onClick={() => handleDealClick(deal.id)}
                    className="p-2 rounded-md bg-white/80 border border-slate-100 cursor-pointer hover:border-emerald-200 transition-colors"
                  >
                    <div className="text-xs font-medium text-slate-900 truncate">{deal.name}</div>
                    <div className="text-xs text-slate-500">{formatCurrency(deal.estimatedValue, deal.currency)}</div>
                  </div>
                ))}
                {stageDeals.length > 3 && (
                  <div className="text-xs text-center text-slate-400">+{stageDeals.length - 3} ещё</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {sortedStages.map(stage => {
        const stageDeals = getDealsByStage(stage.id);
        return (
          <div
            key={stage.id}
            className={cn(
              'flex-shrink-0 w-72 rounded-xl bg-white/40 backdrop-blur border border-white/20',
              stage.isClosedStage && 'bg-emerald-50/40'
            )}
          >
            <div
              className="px-4 py-3 border-b border-white/20 flex items-center justify-between"
              style={{ borderLeftColor: stage.color, borderLeftWidth: 4 }}
            >
              <span className="font-medium text-slate-800">{stage.nameRu || stage.name}</span>
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full"
                style={{ backgroundColor: stage.color + '20', color: stage.color }}
              >
                {stageDeals.length}
              </span>
            </div>
            <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
              {stageDeals.map(deal => (
                <div
                  key={deal.id}
                  onClick={() => handleDealClick(deal.id)}
                  className="p-3 rounded-lg bg-white/80 border border-slate-100 cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-slate-400 font-mono">{deal.dealNumber}</span>
                    <DlAssetTypePill type={deal.assetType} />
                  </div>
                  <div className="font-medium text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {deal.name}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{formatCurrency(deal.estimatedValue, deal.currency)}</span>
                    <span className="text-slate-400">{formatDate(deal.expectedCloseAt)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <DlStatusPill status={deal.status} size="sm" />
                  </div>
                </div>
              ))}
              {stageDeals.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">
                  Нет сделок
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
