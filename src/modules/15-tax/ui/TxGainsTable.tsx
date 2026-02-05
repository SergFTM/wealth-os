"use client";

import { TrendingUp, TrendingDown, DollarSign, Percent, Clock, CheckCircle } from 'lucide-react';

interface TaxGain {
  id: string;
  lotId: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  eventType: 'sell' | 'dividend' | 'coupon' | 'distribution';
  eventDate: string;
  quantity: number;
  proceeds: number;
  costBasis: number;
  realizedPL: number;
  term: 'short' | 'long';
  holdingDays: number;
  taxRate: number;
  taxAmount: number;
  currency: string;
  settlementDate: string;
  reportedToIrs: boolean;
}

interface TxGainsTableProps {
  gains: TaxGain[];
  onRowClick?: (gain: TaxGain) => void;
  showEventType?: 'all' | 'sell' | 'dividend' | 'coupon' | 'distribution';
}

const eventTypeConfig = {
  sell: { label: 'Продажа', color: 'text-blue-600', bg: 'bg-blue-50', icon: DollarSign },
  dividend: { label: 'Дивиденд', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Percent },
  coupon: { label: 'Купон', color: 'text-purple-600', bg: 'bg-purple-50', icon: Percent },
  distribution: { label: 'Распределение', color: 'text-amber-600', bg: 'bg-amber-50', icon: DollarSign },
};

const termConfig = {
  short: { label: 'КС', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  long: { label: 'ДС', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
};

export function TxGainsTable({ gains, onRowClick, showEventType = 'all' }: TxGainsTableProps) {
  const filteredGains = showEventType === 'all'
    ? gains
    : gains.filter(g => g.eventType === showEventType);

  const sortedGains = [...filteredGains].sort((a, b) => {
    return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
  });

  const formatCurrency = (value: number, currency: string = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate totals
  const totalGains = sortedGains.reduce((sum, g) => sum + (g.realizedPL > 0 ? g.realizedPL : 0), 0);
  const totalLosses = sortedGains.reduce((sum, g) => sum + (g.realizedPL < 0 ? Math.abs(g.realizedPL) : 0), 0);
  const totalTax = sortedGains.reduce((sum, g) => sum + g.taxAmount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <div className="text-xs text-emerald-600 font-medium mb-1">Прибыль</div>
          <div className="text-xl font-bold text-emerald-700">{formatCurrency(totalGains)}</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="text-xs text-red-600 font-medium mb-1">Убытки</div>
          <div className="text-xl font-bold text-red-700">{formatCurrency(totalLosses)}</div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div className="text-xs text-stone-600 font-medium mb-1">Налог к уплате</div>
          <div className="text-xl font-bold text-stone-700">{formatCurrency(totalTax)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Актив</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Дата</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Кол-во</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Выручка</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Базис</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">П/У</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Срок</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Налог</th>
              </tr>
            </thead>
            <tbody>
              {sortedGains.map((gain) => {
                const eventType = eventTypeConfig[gain.eventType];
                const term = termConfig[gain.term];
                const EventIcon = eventType.icon;
                const isProfit = gain.realizedPL >= 0;

                return (
                  <tr
                    key={gain.id}
                    onClick={() => onRowClick?.(gain)}
                    className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        {isProfit ? (
                          <TrendingUp className="w-4 h-4 mt-0.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mt-0.5 text-red-500" />
                        )}
                        <div>
                          <div className="font-semibold text-stone-800">{gain.symbol}</div>
                          <div className="text-xs text-stone-500 line-clamp-1">{gain.assetName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${eventType.bg} ${eventType.color}`}>
                        <EventIcon className="w-3 h-3" />
                        {eventType.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600">
                      {new Date(gain.eventDate).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-700">
                      {gain.quantity.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-700">
                      {formatCurrency(gain.proceeds, gain.currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600">
                      {formatCurrency(gain.costBasis, gain.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}{formatCurrency(gain.realizedPL, gain.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${term.bg} ${term.color}`}>
                        {term.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-stone-700">
                        {formatCurrency(gain.taxAmount, gain.currency)}
                      </div>
                      <div className="text-xs text-stone-500">{(gain.taxRate * 100).toFixed(0)}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedGains.length === 0 && (
          <div className="p-8 text-center text-stone-500">
            Нет реализованных событий для отображения
          </div>
        )}
      </div>
    </div>
  );
}
