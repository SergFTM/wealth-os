"use client";

import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TaxLot {
  id: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  assetClass: string;
  quantity: number;
  costBasis: number;
  costBasisPerShare: number;
  currentValue: number;
  currentPrice: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  term: 'short' | 'long';
  holdingDays: number;
  acquisitionDate: string;
  taxRate: number;
  estimatedTax: number;
  lotStatus: 'active' | 'partial' | 'closed';
  currency: string;
}

interface TxLotsTableProps {
  lots: TaxLot[];
  onRowClick?: (lot: TaxLot) => void;
  showTerm?: 'all' | 'short' | 'long';
}

const termConfig = {
  short: { label: 'Краткосрочн.', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  long: { label: 'Долгосрочн.', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
};

const statusConfig = {
  active: { label: 'Активный', color: 'text-blue-600', bg: 'bg-blue-50' },
  partial: { label: 'Частичный', color: 'text-amber-600', bg: 'bg-amber-50' },
  closed: { label: 'Закрыт', color: 'text-stone-500', bg: 'bg-stone-100' },
};

export function TxLotsTable({ lots, onRowClick, showTerm = 'all' }: TxLotsTableProps) {
  const filteredLots = showTerm === 'all'
    ? lots
    : lots.filter(l => l.term === showTerm);

  const sortedLots = [...filteredLots].sort((a, b) => {
    // Sort by unrealized P/L (largest losses first for tax harvesting visibility)
    return a.unrealizedPL - b.unrealizedPL;
  });

  const formatCurrency = (value: number, currency: string = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Актив</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Кол-во</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Базис</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Текущая</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">П/У</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Срок</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Дней</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Налог</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedLots.map((lot) => {
              const term = termConfig[lot.term];
              const status = statusConfig[lot.lotStatus];
              const TermIcon = term.icon;
              const isProfit = lot.unrealizedPL >= 0;

              return (
                <tr
                  key={lot.id}
                  onClick={() => onRowClick?.(lot)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    lot.unrealizedPL < -50000 ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {isProfit ? (
                        <TrendingUp className="w-4 h-4 mt-0.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mt-0.5 text-red-500" />
                      )}
                      <div>
                        <div className="font-semibold text-stone-800">{lot.symbol}</div>
                        <div className="text-xs text-stone-500 line-clamp-1">{lot.assetName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-stone-700">
                    {lot.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium text-stone-700">{formatCurrency(lot.costBasis, lot.currency)}</div>
                    <div className="text-xs text-stone-500">
                      {formatCurrency(lot.costBasisPerShare, lot.currency)}/шт
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium text-stone-700">{formatCurrency(lot.currentValue, lot.currency)}</div>
                    <div className="text-xs text-stone-500">
                      {formatCurrency(lot.currentPrice, lot.currency)}/шт
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`font-semibold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(lot.unrealizedPL, lot.currency)}
                    </div>
                    <div className={`text-xs ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isProfit ? '+' : ''}{lot.unrealizedPLPercent.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${term.bg} ${term.color}`}>
                      <TermIcon className="w-3 h-3" />
                      {term.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    {lot.holdingDays}
                    {lot.term === 'short' && lot.holdingDays > 300 && (
                      <span title="Скоро долгосрочный">
                        <AlertCircle className="w-3 h-3 text-amber-500 inline ml-1" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium text-stone-700">
                      {formatCurrency(Math.abs(lot.estimatedTax), lot.currency)}
                    </div>
                    <div className="text-xs text-stone-500">{(lot.taxRate * 100).toFixed(0)}%</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedLots.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет налоговых лотов для отображения
        </div>
      )}
    </div>
  );
}
