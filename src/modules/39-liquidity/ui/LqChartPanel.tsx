"use client";

import { useMemo } from 'react';

interface DailyBalance {
  date: string;
  closingBalance: number;
  inflows: number;
  outflows: number;
}

interface LqChartPanelProps {
  title?: string;
  dailyBalances: DailyBalance[];
  minCashThreshold?: number;
  currency?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
  });
}

export function LqChartPanel({
  title = 'Cash Balance Forecast',
  dailyBalances,
  minCashThreshold = 0,
  currency = 'USD',
}: LqChartPanelProps) {
  // Sample data points for visualization (every 7 days)
  const chartData = useMemo(() => {
    if (!dailyBalances || dailyBalances.length === 0) {
      return [];
    }

    const step = Math.max(1, Math.floor(dailyBalances.length / 12));
    return dailyBalances.filter((_, i) => i % step === 0 || i === dailyBalances.length - 1);
  }, [dailyBalances]);

  const { maxValue, minValue } = useMemo(() => {
    if (chartData.length === 0) return { maxValue: 1000000, minValue: 0 };
    const balances = chartData.map((d) => d.closingBalance);
    return {
      maxValue: Math.max(...balances, minCashThreshold) * 1.1,
      minValue: Math.min(...balances, 0, minCashThreshold) * 0.9,
    };
  }, [chartData, minCashThreshold]);

  const range = maxValue - minValue || 1;

  const getY = (value: number): number => {
    return ((maxValue - value) / range) * 100;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{title}</h3>
        <div className="h-48 flex items-center justify-center text-stone-400">
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">{title}</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-emerald-500 rounded" />
            <span className="text-stone-500">Баланс</span>
          </div>
          {minCashThreshold > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-red-400 rounded border-dashed" />
              <span className="text-stone-500">Порог</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-stone-400">
          <span>{formatCurrency(maxValue)}</span>
          <span>{formatCurrency((maxValue + minValue) / 2)}</span>
          <span>{formatCurrency(minValue)}</span>
        </div>

        {/* Chart Content */}
        <div className="absolute left-16 right-0 top-0 bottom-6 border-l border-b border-stone-200">
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-px bg-stone-100" style={{ top: '25%' }} />
            <div className="absolute w-full h-px bg-stone-100" style={{ top: '50%' }} />
            <div className="absolute w-full h-px bg-stone-100" style={{ top: '75%' }} />
          </div>

          {/* Min cash threshold line */}
          {minCashThreshold > 0 && (
            <div
              className="absolute w-full h-px bg-red-400 border-dashed"
              style={{ top: `${getY(minCashThreshold)}%` }}
            />
          )}

          {/* Balance line */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox={`0 0 ${chartData.length - 1} 100`}
          >
            {/* Area under the line */}
            <path
              d={`
                M 0 ${getY(chartData[0].closingBalance)}
                ${chartData.map((d, i) => `L ${i} ${getY(d.closingBalance)}`).join(' ')}
                L ${chartData.length - 1} 100
                L 0 100
                Z
              `}
              fill="url(#gradient)"
              opacity="0.3"
            />
            {/* Line */}
            <path
              d={`
                M 0 ${getY(chartData[0].closingBalance)}
                ${chartData.map((d, i) => `L ${i} ${getY(d.closingBalance)}`).join(' ')}
              `}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Data points */}
          {chartData.map((d, i) => (
            <div
              key={d.date}
              className="absolute w-2 h-2 bg-emerald-500 rounded-full -translate-x-1 -translate-y-1 hover:scale-150 transition-transform cursor-pointer group"
              style={{
                left: `${(i / (chartData.length - 1)) * 100}%`,
                top: `${getY(d.closingBalance)}%`,
              }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-stone-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {formatDate(d.date)}: {formatCurrency(d.closingBalance)}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-16 right-0 bottom-0 h-6 flex justify-between text-xs text-stone-400">
          {chartData.slice(0, 6).map((d, i) => (
            <span key={d.date} style={{ width: `${100 / 6}%` }} className="text-center truncate">
              {formatDate(d.date)}
            </span>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-stone-200/50 grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-xs text-stone-400">Начальный</div>
          <div className="font-semibold text-stone-700">
            {formatCurrency(chartData[0]?.closingBalance || 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-400">Минимум</div>
          <div className="font-semibold text-stone-700">
            {formatCurrency(Math.min(...chartData.map((d) => d.closingBalance)))}
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-400">Максимум</div>
          <div className="font-semibold text-stone-700">
            {formatCurrency(Math.max(...chartData.map((d) => d.closingBalance)))}
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-400">Конечный</div>
          <div className="font-semibold text-stone-700">
            {formatCurrency(chartData[chartData.length - 1]?.closingBalance || 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
