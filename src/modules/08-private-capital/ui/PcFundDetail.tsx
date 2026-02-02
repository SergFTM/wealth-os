"use client";

import { cn } from '@/lib/utils';

interface PcFundDetailProps {
  fund: {
    id: string;
    name: string;
    strategy: string;
    vintageYear: number;
    manager: string;
    currency: string;
    status: string;
    tags?: string[];
    notes?: string;
  };
  metrics?: {
    commitment: number;
    called: number;
    distributed: number;
    unfunded: number;
    nav: number;
    tvpi: number;
    irr: number;
    valuationAsOf?: string;
  };
  onClose: () => void;
  onEdit?: () => void;
  onAddCommitment?: () => void;
  onCreateCall?: () => void;
  onAddValuation?: () => void;
}

export function PcFundDetail({ fund, metrics, onClose, onEdit, onAddCommitment, onCreateCall, onAddValuation }: PcFundDetailProps) {
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const strategyLabels: Record<string, string> = {
    pe: 'Private Equity',
    vc: 'Venture Capital',
    real_estate: 'Real Estate',
    private_credit: 'Private Credit',
    infrastructure: 'Infrastructure',
    secondaries: 'Secondaries',
    fund_of_funds: 'Fund of Funds'
  };

  const statusLabels: Record<string, string> = {
    active: 'Активный',
    fully_invested: 'Полностью инвестирован',
    harvesting: 'Harvesting',
    liquidated: 'Ликвидирован'
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
        <div>
          <h2 className="text-lg font-bold text-stone-800">{fund.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              fund.strategy === 'pe' && "bg-purple-100 text-purple-700",
              fund.strategy === 'vc' && "bg-blue-100 text-blue-700",
              fund.strategy === 'real_estate' && "bg-amber-100 text-amber-700"
            )}>
              {strategyLabels[fund.strategy] || fund.strategy}
            </span>
            <span className="text-xs text-stone-500">Vintage {fund.vintageYear}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500">Commitment</div>
              <div className="text-lg font-bold text-stone-800">{formatCurrency(metrics.commitment, fund.currency)}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500">NAV</div>
              <div className="text-lg font-bold text-stone-800">{formatCurrency(metrics.nav, fund.currency)}</div>
              {metrics.valuationAsOf && <div className="text-xs text-stone-400">as of {metrics.valuationAsOf}</div>}
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500">Called</div>
              <div className="text-lg font-bold text-stone-700">{formatCurrency(metrics.called, fund.currency)}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500">Unfunded</div>
              <div className={cn("text-lg font-bold", metrics.unfunded > 0 ? "text-amber-600" : "text-stone-400")}>
                {formatCurrency(metrics.unfunded, fund.currency)}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500">Distributed</div>
              <div className="text-lg font-bold text-emerald-600">{formatCurrency(metrics.distributed, fund.currency)}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500">TVPI / IRR</div>
              <div className="text-lg font-bold text-stone-800">{metrics.tvpi.toFixed(2)}x / {metrics.irr.toFixed(1)}%</div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-sm text-stone-500">Manager</span>
            <span className="text-sm font-medium text-stone-800">{fund.manager}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-sm text-stone-500">Status</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              fund.status === 'active' && "bg-emerald-100 text-emerald-700",
              fund.status === 'harvesting' && "bg-amber-100 text-amber-700"
            )}>
              {statusLabels[fund.status] || fund.status}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-sm text-stone-500">Currency</span>
            <span className="text-sm font-medium text-stone-800">{fund.currency}</span>
          </div>
          {fund.tags && fund.tags.length > 0 && (
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-sm text-stone-500">Tags</span>
              <div className="flex gap-1">
                {fund.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {fund.notes && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-2">Notes</h4>
            <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg">{fund.notes}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-stone-200 flex flex-wrap gap-2">
        {onEdit && (
          <button onClick={onEdit} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 transition-colors">
            Редактировать
          </button>
        )}
        {onAddCommitment && (
          <button onClick={onAddCommitment} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200 transition-colors">
            + Обязательство
          </button>
        )}
        {onCreateCall && (
          <button onClick={onCreateCall} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
            + Call
          </button>
        )}
        {onAddValuation && (
          <button onClick={onAddValuation} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200 transition-colors">
            + NAV
          </button>
        )}
      </div>
    </div>
  );
}
