'use client';

/**
 * Planning Projection Chart Component
 * Visualizes net worth projection over time
 */

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { YearlyProjection } from '../schema/planningRun';

interface PlProjectionChartProps {
  projections: YearlyProjection[];
  compareProjections?: { name: string; data: YearlyProjection[]; color: string }[];
  lang?: 'ru' | 'en' | 'uk';
  height?: number;
}

export function PlProjectionChart({
  projections,
  compareProjections,
  lang: propLang,
  height = 300,
}: PlProjectionChartProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    netWorth: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' },
    liquidAssets: { ru: 'Ликвидные', en: 'Liquid', uk: 'Ліквідні' },
    investedAssets: { ru: 'Инвестиции', en: 'Invested', uk: 'Інвестиції' },
  };

  // Calculate chart bounds
  const chartData = useMemo(() => {
    const allData = [projections, ...(compareProjections?.map(c => c.data) || [])].flat();
    const maxValue = Math.max(...allData.map(p => p.netWorth), 0);
    const minValue = Math.min(...allData.map(p => p.netWorth), 0);
    const range = maxValue - minValue || 1;

    return { maxValue, minValue, range };
  }, [projections, compareProjections]);

  const formatValue = (val: number): string => {
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  };

  // SVG-based area chart
  const chartWidth = 800;
  const chartHeight = height - 60;
  const padding = { top: 20, right: 20, bottom: 40, left: 70 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const xScale = (idx: number) => padding.left + (idx / (projections.length - 1 || 1)) * plotWidth;
  const yScale = (val: number) => {
    const normalized = (val - chartData.minValue) / chartData.range;
    return padding.top + plotHeight - normalized * plotHeight;
  };

  // Create path for main projection
  const createPath = (data: YearlyProjection[], key: keyof YearlyProjection): string => {
    if (data.length === 0) return '';
    return data
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p[key] as number)}`)
      .join(' ');
  };

  const createAreaPath = (data: YearlyProjection[], key: keyof YearlyProjection): string => {
    if (data.length === 0) return '';
    const linePath = createPath(data, key);
    return `${linePath} L ${xScale(data.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;
  };

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const value = chartData.minValue + (chartData.range * i) / tickCount;
      ticks.push(value);
    }
    return ticks;
  }, [chartData]);

  // X-axis ticks (every 5 years or so)
  const xTicks = useMemo(() => {
    const step = Math.max(1, Math.floor(projections.length / 6));
    return projections.filter((_, i) => i % step === 0 || i === projections.length - 1);
  }, [projections]);

  if (projections.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        {lang === 'ru' ? 'Нет данных для графика' : lang === 'uk' ? 'Немає даних для графіка' : 'No data for chart'}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        style={{ minWidth: 600, height }}
      >
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <line
            key={`grid-${i}`}
            x1={padding.left}
            y1={yScale(tick)}
            x2={chartWidth - padding.right}
            y2={yScale(tick)}
            stroke="#e5e7eb"
            strokeDasharray="4,4"
          />
        ))}

        {/* Zero line if applicable */}
        {chartData.minValue < 0 && chartData.maxValue > 0 && (
          <line
            x1={padding.left}
            y1={yScale(0)}
            x2={chartWidth - padding.right}
            y2={yScale(0)}
            stroke="#9ca3af"
            strokeWidth={1}
          />
        )}

        {/* Comparison projections */}
        {compareProjections?.map((comp, idx) => (
          <path
            key={`comp-${idx}`}
            d={createPath(comp.data, 'netWorth')}
            fill="none"
            stroke={comp.color}
            strokeWidth={2}
            strokeDasharray="6,3"
            opacity={0.7}
          />
        ))}

        {/* Main projection area */}
        <path
          d={createAreaPath(projections, 'netWorth')}
          fill="url(#areaGradient)"
          opacity={0.3}
        />

        {/* Main projection line */}
        <path
          d={createPath(projections, 'netWorth')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2.5}
        />

        {/* Liquid assets line */}
        <path
          d={createPath(projections, 'liquidAssets')}
          fill="none"
          stroke="#10b981"
          strokeWidth={1.5}
          strokeDasharray="4,2"
          opacity={0.7}
        />

        {/* Data points */}
        {projections
          .filter((_, i) => i % Math.max(1, Math.floor(projections.length / 10)) === 0 || i === projections.length - 1)
          .map((p, i) => {
            const idx = projections.indexOf(p);
            return (
              <circle
                key={`point-${i}`}
                cx={xScale(idx)}
                cy={yScale(p.netWorth)}
                r={4}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth={2}
              />
            );
          })}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={`y-label-${i}`}
            x={padding.left - 8}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-xs fill-gray-500"
          >
            {formatValue(tick)}
          </text>
        ))}

        {/* X-axis labels */}
        {xTicks.map((p) => {
          const idx = projections.indexOf(p);
          return (
            <text
              key={`x-label-${p.year}`}
              x={xScale(idx)}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {p.year}
            </text>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-blue-500" />
          <span className="text-gray-600">{labels.netWorth[lang]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-green-500 opacity-70" style={{ borderStyle: 'dashed' }} />
          <span className="text-gray-600">{labels.liquidAssets[lang]}</span>
        </div>
        {compareProjections?.map((comp, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 opacity-70" style={{ backgroundColor: comp.color, borderStyle: 'dashed' }} />
            <span className="text-gray-600">{comp.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
