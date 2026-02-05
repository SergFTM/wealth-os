"use client";

import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface RiskMetric {
  id: string;
  portfolioId: string;
  metric: string;
  label: string;
  value: number;
  unit: string;
  period: string;
  benchmark: number;
  benchmarkLabel: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
}

interface RkMetricsCardsProps {
  metrics: RiskMetric[];
  onMetricClick?: (metric: RiskMetric) => void;
}

const metricConfig: Record<string, { format: (v: number) => string; goodTrend: 'up' | 'down' | 'neutral' }> = {
  volatility: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
  maxDrawdown: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
  beta: { format: (v) => v.toFixed(2), goodTrend: 'neutral' },
  var95: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
  var99: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
  cvar: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
  sharpeRatio: { format: (v) => v.toFixed(2), goodTrend: 'up' },
  sortinoRatio: { format: (v) => v.toFixed(2), goodTrend: 'up' },
  trackingError: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
  informationRatio: { format: (v) => v.toFixed(2), goodTrend: 'up' },
  duration: { format: (v) => `${v.toFixed(1)} лет`, goodTrend: 'neutral' },
  herfindahl: { format: (v) => v.toFixed(3), goodTrend: 'down' },
  liquidityCoverage: { format: (v) => `${v.toFixed(0)}%`, goodTrend: 'up' },
  currencyExposure: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'neutral' },
  activeShare: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'up' },
  tailRisk: { format: (v) => `${v.toFixed(1)}%`, goodTrend: 'down' },
};

export function RkMetricsCards({ metrics, onMetricClick }: RkMetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {metrics.map((metric) => {
        const config = metricConfig[metric.metric] || { format: (v: number) => v.toFixed(2), goodTrend: 'neutral' };
        const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;

        // Determine if trend is good or bad
        const isGoodTrend = config.goodTrend === metric.trend ||
          (config.goodTrend === 'neutral');
        const trendColor = metric.trend === 'neutral' ? 'text-stone-400' :
          isGoodTrend ? 'text-emerald-500' : 'text-red-500';

        // Compare with benchmark
        const vsTarget = metric.value - metric.benchmark;
        const vsBenchmarkLabel = metric.metric.includes('Ratio') || metric.metric === 'informationRatio' || metric.metric === 'liquidityCoverage'
          ? (vsTarget >= 0 ? 'выше цели' : 'ниже цели')
          : (vsTarget <= 0 ? 'в пределах лимита' : 'превышает лимит');

        return (
          <div
            key={metric.id}
            onClick={() => onMetricClick?.(metric)}
            className="bg-white p-4 rounded-xl border border-stone-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-stone-500 uppercase font-medium">{metric.period}</span>
              <button className="p-1 text-stone-300 hover:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="w-3 h-3" />
              </button>
            </div>

            <div className="mb-2">
              <div className="text-2xl font-bold text-stone-800">
                {config.format(metric.value)}
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {metric.label}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                <span className={trendColor}>
                  {metric.trendValue > 0 ? '+' : ''}{metric.trendValue !== 0 ? config.format(metric.trendValue).replace('%', '') : '—'}
                </span>
              </div>
              <div className="text-xs text-stone-500">
                vs {metric.benchmarkLabel}
              </div>
            </div>

            {/* Benchmark comparison bar */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-500">{metric.benchmarkLabel}</span>
                <span className="text-stone-600">{config.format(metric.benchmark)}</span>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full relative">
                <div
                  className={`absolute h-full rounded-full ${
                    metric.value <= metric.benchmark ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.min((metric.value / metric.benchmark) * 100, 100)}%`,
                    maxWidth: '100%'
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-stone-600"
                  style={{ left: '100%', transform: 'translateX(-50%) translateY(-50%)' }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
