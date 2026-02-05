"use client";

import { ArrowLeft, TrendingUp, TrendingDown, Clock, CheckCircle, Calendar, DollarSign, Percent, Activity } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

interface TxLotDetailProps {
  lot: TaxLot;
  onBack?: () => void;
  onSell?: () => void;
}

const termConfig = {
  short: { label: 'Краткосрочный (< 1 года)', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  long: { label: 'Долгосрочный (≥ 1 года)', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
};

const statusConfig = {
  active: { label: 'Активный', color: 'text-blue-600', bg: 'bg-blue-50' },
  partial: { label: 'Частично продан', color: 'text-amber-600', bg: 'bg-amber-50' },
  closed: { label: 'Закрыт', color: 'text-stone-500', bg: 'bg-stone-100' },
};

export function TxLotDetail({ lot, onBack, onSell }: TxLotDetailProps) {
  const term = termConfig[lot.term];
  const status = statusConfig[lot.lotStatus];
  const TermIcon = term.icon;
  const isProfit = lot.unrealizedPL >= 0;

  const formatCurrency = (value: number, currency: string = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const daysToLongTerm = lot.term === 'short' ? 365 - lot.holdingDays : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-500" />
            </button>
          )}
          <div className="flex items-center gap-3">
            {isProfit ? (
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{lot.symbol}</h1>
              <div className="text-stone-500">{lot.assetName}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${term.bg} ${term.color}`}>
            <TermIcon className="w-4 h-4 inline mr-1" />
            {lot.term === 'short' ? 'Краткосрочн.' : 'Долгосрочн.'}
          </span>
          <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Количество</span>
          </div>
          <div className="text-2xl font-bold text-stone-800">{lot.quantity.toLocaleString()}</div>
          <div className="text-xs text-stone-500">{lot.assetClass}</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Базис (cost basis)</span>
          </div>
          <div className="text-2xl font-bold text-stone-800">{formatCurrency(lot.costBasis, lot.currency)}</div>
          <div className="text-xs text-stone-500">{formatCurrency(lot.costBasisPerShare, lot.currency)} / шт</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Текущая стоимость</span>
          </div>
          <div className="text-2xl font-bold text-stone-800">{formatCurrency(lot.currentValue, lot.currency)}</div>
          <div className="text-xs text-stone-500">{formatCurrency(lot.currentPrice, lot.currency)} / шт</div>
        </div>

        <div className={`rounded-xl border p-4 ${isProfit ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isProfit ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span className={`text-xs font-medium uppercase ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
              Нереализованная П/У
            </span>
          </div>
          <div className={`text-2xl font-bold ${isProfit ? 'text-emerald-700' : 'text-red-700'}`}>
            {isProfit ? '+' : ''}{formatCurrency(lot.unrealizedPL, lot.currency)}
          </div>
          <div className={`text-xs ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}{lot.unrealizedPLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Holding Period */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-stone-400" />
            Период владения
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Дата приобретения</span>
              <span className="font-medium text-stone-800">
                {new Date(lot.acquisitionDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Дней владения</span>
              <span className="font-medium text-stone-800">{lot.holdingDays} дн.</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Статус периода</span>
              <span className={`font-medium ${term.color}`}>{term.label}</span>
            </div>
            {daysToLongTerm > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-700">
                  <Clock className="w-4 h-4 inline mr-2" />
                  До долгосрочного статуса: <strong>{daysToLongTerm} дн.</strong>
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Дата перехода: {new Date(new Date(lot.acquisitionDate).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tax Impact */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-stone-400" />
            Налоговые последствия
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Налоговая ставка</span>
              <span className="font-medium text-stone-800">{(lot.taxRate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Расчётный налог</span>
              <span className={`font-medium ${lot.unrealizedPL >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {lot.unrealizedPL >= 0
                  ? formatCurrency(lot.estimatedTax, lot.currency)
                  : `Экономия ${formatCurrency(Math.abs(lot.estimatedTax), lot.currency)}`
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Эффективная доходность после налога</span>
              <span className="font-medium text-stone-800">
                {((lot.unrealizedPL * (1 - lot.taxRate)) / lot.costBasis * 100).toFixed(2)}%
              </span>
            </div>
            {lot.unrealizedPL < 0 && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-sm text-emerald-700">
                  Этот лот имеет нереализованный убыток и может быть использован для tax-loss harvesting.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {lot.lotStatus === 'active' && onSell && (
        <div className="flex justify-end gap-3">
          <button
            onClick={onSell}
            className="px-4 py-2 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition-colors"
          >
            Симулировать продажу
          </button>
        </div>
      )}

      {/* Timestamps */}
      <div className="text-xs text-stone-500 pt-4 border-t border-stone-200">
        <div>Создано: {new Date(lot.createdAt).toLocaleString('ru-RU')}</div>
        <div>Обновлено: {new Date(lot.updatedAt).toLocaleString('ru-RU')}</div>
      </div>
    </div>
  );
}
