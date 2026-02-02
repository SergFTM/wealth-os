"use client";

import { cn } from '@/lib/utils';

interface PcFund {
  id: string;
  name: string;
  strategy: string;
  vintageYear: number;
  commitment?: number;
  called?: number;
  distributed?: number;
  nav?: number;
  tvpi?: number;
  irr?: number;
  valuationAsOf?: string;
  currency?: string;
}

interface PcFundsTableProps {
  funds: PcFund[];
  onOpen: (id: string) => void;
  compact?: boolean;
}

const strategyLabels: Record<string, string> = {
  pe: 'PE',
  vc: 'VC',
  real_estate: 'RE',
  private_credit: 'Credit',
  infrastructure: 'Infra',
  secondaries: 'Secondaries',
  fund_of_funds: 'FoF'
};

export function PcFundsTable({ funds, onOpen, compact }: PcFundsTableProps) {
  const formatCurrency = (val?: number, currency = 'USD') => {
    if (val === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50">
        <h3 className="font-semibold text-stone-800">Фонды</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Фонд</th>
              <th className="text-left p-3 font-medium text-stone-600">Стратегия</th>
              <th className="text-left p-3 font-medium text-stone-600">Vintage</th>
              {!compact && (
                <>
                  <th className="text-right p-3 font-medium text-stone-600">Commitment</th>
                  <th className="text-right p-3 font-medium text-stone-600">Called</th>
                  <th className="text-right p-3 font-medium text-stone-600">Distributed</th>
                </>
              )}
              <th className="text-right p-3 font-medium text-stone-600">NAV</th>
              {!compact && (
                <>
                  <th className="text-right p-3 font-medium text-stone-600">TVPI</th>
                  <th className="text-right p-3 font-medium text-stone-600">IRR</th>
                  <th className="text-left p-3 font-medium text-stone-600">As-of</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr
                key={fund.id}
                onClick={() => onOpen(fund.id)}
                className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="p-3 font-medium text-stone-800">{fund.name}</td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    fund.strategy === 'pe' && "bg-purple-100 text-purple-700",
                    fund.strategy === 'vc' && "bg-blue-100 text-blue-700",
                    fund.strategy === 'real_estate' && "bg-amber-100 text-amber-700",
                    fund.strategy === 'private_credit' && "bg-emerald-100 text-emerald-700",
                    fund.strategy === 'infrastructure' && "bg-stone-100 text-stone-700",
                    fund.strategy === 'secondaries' && "bg-pink-100 text-pink-700",
                    fund.strategy === 'fund_of_funds' && "bg-cyan-100 text-cyan-700"
                  )}>
                    {strategyLabels[fund.strategy] || fund.strategy}
                  </span>
                </td>
                <td className="p-3 text-stone-600">{fund.vintageYear}</td>
                {!compact && (
                  <>
                    <td className="p-3 text-right text-stone-600">{formatCurrency(fund.commitment, fund.currency)}</td>
                    <td className="p-3 text-right text-stone-600">{formatCurrency(fund.called, fund.currency)}</td>
                    <td className="p-3 text-right text-stone-600">{formatCurrency(fund.distributed, fund.currency)}</td>
                  </>
                )}
                <td className="p-3 text-right font-medium text-stone-800">{formatCurrency(fund.nav, fund.currency)}</td>
                {!compact && (
                  <>
                    <td className="p-3 text-right text-stone-600">{fund.tvpi?.toFixed(2) || '-'}x</td>
                    <td className="p-3 text-right text-stone-600">{fund.irr !== undefined ? `${fund.irr.toFixed(1)}%` : '-'}</td>
                    <td className="p-3 text-stone-500 text-xs">{fund.valuationAsOf || '-'}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
