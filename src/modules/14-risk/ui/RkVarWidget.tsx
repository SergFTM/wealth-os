"use client";

import { TrendingDown, AlertTriangle, Info } from 'lucide-react';

interface RkVarWidgetProps {
  var95: number;
  var99: number;
  cvar: number;
  limit95: number;
  limit99: number;
  limitCvar: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  asOfDate: string;
}

export function RkVarWidget({
  var95 = 2.4,
  var99 = 3.8,
  cvar = 4.2,
  limit95 = 2.8,
  limit99 = 4.5,
  limitCvar = 5.0,
  trend = 'down',
  trendValue = -0.3,
  asOfDate = '2025-01-15'
}: Partial<RkVarWidgetProps>) {
  const isBreached95 = var95 > limit95;
  const isBreached99 = var99 > limit99;
  const isBreachedCvar = cvar > limitCvar;

  const hasAnyBreach = isBreached95 || isBreached99 || isBreachedCvar;

  return (
    <div className={`bg-white rounded-2xl border ${hasAnyBreach ? 'border-red-200' : 'border-stone-200'} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className={`w-5 h-5 ${hasAnyBreach ? 'text-red-500' : 'text-stone-400'}`} />
          <h3 className="text-sm font-semibold text-stone-800">Value at Risk</h3>
        </div>
        <button className="p-1 text-stone-400 hover:text-stone-600">
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Main VaR display */}
      <div className={`p-4 rounded-xl mb-4 ${isBreached95 ? 'bg-red-50' : 'bg-stone-50'}`}>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-stone-500 mb-1">VaR (95%, 1-day)</div>
            <div className={`text-3xl font-bold ${isBreached95 ? 'text-red-600' : 'text-stone-800'}`}>
              {var95.toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs">
              {trend === 'down' ? (
                <span className="text-emerald-500">↓ {Math.abs(trendValue).toFixed(1)}%</span>
              ) : trend === 'up' ? (
                <span className="text-red-500">↑ {Math.abs(trendValue).toFixed(1)}%</span>
              ) : (
                <span className="text-stone-400">—</span>
              )}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Лимит: {limit95.toFixed(1)}%
            </div>
          </div>
        </div>

        {isBreached95 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
            <AlertTriangle className="w-3 h-3" />
            Превышение лимита на {(var95 - limit95).toFixed(2)}%
          </div>
        )}
      </div>

      {/* Secondary VaR metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-xl ${isBreached99 ? 'bg-red-50' : 'bg-stone-50'}`}>
          <div className="text-xs text-stone-500 mb-1">VaR (99%)</div>
          <div className={`text-xl font-bold ${isBreached99 ? 'text-red-600' : 'text-stone-800'}`}>
            {var99.toFixed(1)}%
          </div>
          <div className="text-xs text-stone-500">
            Лимит: {limit99.toFixed(1)}%
          </div>
        </div>
        <div className={`p-3 rounded-xl ${isBreachedCvar ? 'bg-red-50' : 'bg-stone-50'}`}>
          <div className="text-xs text-stone-500 mb-1">CVaR / ES</div>
          <div className={`text-xl font-bold ${isBreachedCvar ? 'text-red-600' : 'text-stone-800'}`}>
            {cvar.toFixed(1)}%
          </div>
          <div className="text-xs text-stone-500">
            Лимит: {limitCvar.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Visual gauge */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
          <span>0%</span>
          <span>VaR vs Лимит (95%)</span>
          <span>{(limit95 * 1.5).toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-gradient-to-r from-emerald-100 via-amber-100 to-red-100 rounded-full relative">
          {/* Limit marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-stone-600 rounded"
            style={{ left: `${(limit95 / (limit95 * 1.5)) * 100}%` }}
          />
          {/* Current value marker */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow ${
              isBreached95 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ left: `${Math.min((var95 / (limit95 * 1.5)) * 100, 98)}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
        На дату: {new Date(asOfDate).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
}
