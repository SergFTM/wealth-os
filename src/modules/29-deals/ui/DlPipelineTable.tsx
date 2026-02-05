'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, ArrowRight } from 'lucide-react';
import { DlStatusPill, DlStagePill, DlAssetTypePill } from './DlStatusPill';

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
  ownerUserId: string;
  counterparty?: string;
}

interface DlPipelineTableProps {
  deals: Deal[];
  compact?: boolean;
  onMoveStage?: (dealId: string) => void;
  onRequestApproval?: (dealId: string) => void;
}

export function DlPipelineTable({ deals, compact = false, onMoveStage, onRequestApproval }: DlPipelineTableProps) {
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
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: compact ? undefined : 'numeric'
    });
  };

  const handleRowClick = (dealId: string) => {
    router.push(`/m/deals/deal/${dealId}`);
  };

  if (compact) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Сделка</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Стадия</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Оценка</th>
            </tr>
          </thead>
          <tbody>
            {deals.slice(0, 5).map(deal => (
              <tr
                key={deal.id}
                onClick={() => handleRowClick(deal.id)}
                className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <DlAssetTypePill type={deal.assetType} />
                    <span className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{deal.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <DlStagePill stageId={deal.stageId} />
                </td>
                <td className="px-4 py-2 text-right text-sm text-slate-600">
                  {formatCurrency(deal.estimatedValue, deal.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deals.length > 5 && (
          <div className="px-4 py-2 border-t border-slate-100 text-center">
            <button
              onClick={() => router.push('/m/deals/list?tab=pipeline')}
              className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              Показать все {deals.length} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Номер</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Название</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Стадия</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Оценка</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Закрытие</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => (
            <tr
              key={deal.id}
              onClick={() => handleRowClick(deal.id)}
              className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 text-sm font-mono text-slate-500">{deal.dealNumber}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{deal.name}</div>
                {deal.counterparty && (
                  <div className="text-xs text-slate-500">{deal.counterparty}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <DlAssetTypePill type={deal.assetType} />
              </td>
              <td className="px-4 py-3">
                <DlStagePill stageId={deal.stageId} />
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                {formatCurrency(deal.estimatedValue, deal.currency)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {formatDate(deal.expectedCloseAt)}
              </td>
              <td className="px-4 py-3">
                <DlStatusPill status={deal.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show actions menu
                  }}
                  className="p-1 rounded hover:bg-slate-100 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
