"use client";

import { Leaf, TrendingDown, AlertTriangle, CheckCircle, Clock, X, ArrowRight } from 'lucide-react';

interface HarvestingOpportunity {
  id: string;
  lotId: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  quantity: number;
  costBasis: number;
  currentValue: number;
  unrealizedLoss: number;
  term: 'short' | 'long';
  holdingDays: number;
  potentialSavings: number;
  taxRate: number;
  suggestedAction: 'sell' | 'hold';
  replacementSuggestion: string | null;
  washSaleRisk: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'approved' | 'executed' | 'declined';
  notes: string | null;
}

interface TxHarvestingPanelProps {
  opportunities: HarvestingOpportunity[];
  onSelect?: (opportunity: HarvestingOpportunity) => void;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const priorityConfig = {
  high: { label: 'Высокий', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { label: 'Средний', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { label: 'Низкий', color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-200' },
};

const statusConfig = {
  new: { label: 'Новая', color: 'text-blue-600', bg: 'bg-blue-100' },
  reviewing: { label: 'На рассмотрении', color: 'text-amber-600', bg: 'bg-amber-100' },
  approved: { label: 'Одобрено', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  executed: { label: 'Исполнено', color: 'text-stone-600', bg: 'bg-stone-200' },
  declined: { label: 'Отклонено', color: 'text-red-600', bg: 'bg-red-100' },
};

export function TxHarvestingPanel({ opportunities, onSelect, onApprove, onDecline }: TxHarvestingPanelProps) {
  const activeOpportunities = opportunities.filter(o => o.status !== 'executed' && o.status !== 'declined');
  const totalPotentialSavings = activeOpportunities.reduce((sum, o) => sum + o.potentialSavings, 0);
  const totalLoss = activeOpportunities.reduce((sum, o) => sum + Math.abs(o.unrealizedLoss), 0);

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const statusOrder = { new: 0, reviewing: 1, approved: 2, executed: 3, declined: 4 };

    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Не является налоговой консультацией.</strong> Представленные возможности носят информационный характер.
          Проконсультируйтесь с налоговым консультантом перед принятием решений.
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">Потенциальная экономия</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{formatCurrency(totalPotentialSavings)}</div>
          <div className="text-xs text-emerald-600 mt-1">{activeOpportunities.length} активных возможностей</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-700">Убытки для реализации</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{formatCurrency(totalLoss)}</div>
          <div className="text-xs text-red-600 mt-1">Нереализованные убытки</div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
        {sortedOpportunities.map((opp) => {
          const priority = priorityConfig[opp.priority];
          const status = statusConfig[opp.status];
          const isActionable = opp.status === 'new' || opp.status === 'reviewing';

          return (
            <div
              key={opp.id}
              onClick={() => onSelect?.(opp)}
              className={`p-4 hover:bg-stone-50 cursor-pointer transition-colors ${
                opp.status === 'executed' || opp.status === 'declined' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-stone-800">{opp.symbol}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${priority.bg} ${priority.color}`}>
                      {priority.label}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    {opp.washSaleRisk && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-600">
                        Риск wash sale
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-600">{opp.assetName}</div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-stone-500">
                      Убыток: <span className="text-red-600 font-medium">{formatCurrency(Math.abs(opp.unrealizedLoss))}</span>
                    </span>
                    <span className="text-stone-500">
                      Экономия: <span className="text-emerald-600 font-medium">{formatCurrency(opp.potentialSavings)}</span>
                    </span>
                    <span className="text-stone-500">
                      Срок: {opp.term === 'short' ? 'Краткосрочн.' : 'Долгосрочн.'} ({opp.holdingDays} дн.)
                    </span>
                  </div>
                  {opp.replacementSuggestion && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                      <ArrowRight className="w-3 h-3" />
                      Замена: <span className="font-medium text-stone-700">{opp.replacementSuggestion}</span>
                    </div>
                  )}
                  {opp.notes && (
                    <div className="mt-2 text-xs text-stone-500 italic">{opp.notes}</div>
                  )}
                </div>

                {isActionable && (
                  <div className="flex items-center gap-2">
                    {onApprove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(opp.id);
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Одобрить"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {onDecline && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDecline(opp.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Отклонить"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {opp.status === 'approved' && (
                  <span title="Ожидает исполнения">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </span>
                )}
                {opp.status === 'executed' && (
                  <span title="Исполнено">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {sortedOpportunities.length === 0 && (
          <div className="p-8 text-center text-stone-500">
            <Leaf className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <div>Нет возможностей для налогового харвестинга</div>
          </div>
        )}
      </div>
    </div>
  );
}
