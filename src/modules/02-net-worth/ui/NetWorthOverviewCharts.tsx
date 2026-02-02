"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface AllocationItem {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface TrendPoint {
  date: string;
  value: number;
}

interface NetWorthOverviewChartsProps {
  allocation: AllocationItem[];
  trend: TrendPoint[];
  loading?: boolean;
}

const COLORS = {
  Public: '#10b981',
  Private: '#3b82f6',
  RealEstate: '#f59e0b',
  Cash: '#6366f1',
  Personal: '#ec4899',
  Other: '#6b7280'
};

export function NetWorthOverviewCharts({ allocation, trend, loading }: NetWorthOverviewChartsProps) {
  const router = useRouter();
  const { locale } = useApp();
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const total = allocation.reduce((sum, a) => sum + a.value, 0);
  const maxTrend = Math.max(...trend.map(t => t.value));
  const minTrend = Math.min(...trend.map(t => t.value));
  const trendRange = maxTrend - minTrend || 1;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/80 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-stone-200 rounded w-1/3 mb-4" />
          <div className="h-48 bg-stone-100 rounded" />
        </div>
        <div className="bg-white/80 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-stone-200 rounded w-1/3 mb-4" />
          <div className="h-48 bg-stone-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Allocation Pie */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="text-sm font-semibold text-stone-700 mb-4">
          {locale === 'ru' ? 'Аллокация по классам' : 'Allocation by Class'}
        </h3>
        
        <div className="flex items-center gap-6">
          {/* Simple SVG Pie */}
          <svg viewBox="0 0 100 100" className="w-36 h-36">
            {allocation.reduce((acc, item, i) => {
              const percentage = (item.value / total) * 100;
              const startAngle = acc.angle;
              const endAngle = startAngle + (percentage * 3.6);
              
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);
              
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              const largeArc = percentage > 50 ? 1 : 0;
              const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
              
              acc.paths.push(
                <path
                  key={item.key}
                  d={path}
                  fill={item.color}
                  className={cn(
                    "transition-opacity cursor-pointer",
                    hoveredClass && hoveredClass !== item.key && "opacity-40"
                  )}
                  onMouseEnter={() => setHoveredClass(item.key)}
                  onMouseLeave={() => setHoveredClass(null)}
                  onClick={() => router.push(`/m/net-worth/list?assetClass=${item.key}`)}
                />
              );
              acc.angle = endAngle;
              return acc;
            }, { paths: [] as React.ReactNode[], angle: 0 }).paths}
          </svg>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {allocation.map(item => (
              <button
                key={item.key}
                onClick={() => router.push(`/m/net-worth/list?assetClass=${item.key}`)}
                onMouseEnter={() => setHoveredClass(item.key)}
                onMouseLeave={() => setHoveredClass(null)}
                className={cn(
                  "flex items-center justify-between w-full text-sm py-1 px-2 rounded transition-colors",
                  hoveredClass === item.key ? "bg-stone-100" : "hover:bg-stone-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-stone-600">{item.label}</span>
                </div>
                <span className="font-medium text-stone-800">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Line */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="text-sm font-semibold text-stone-700 mb-4">
          {locale === 'ru' ? 'Тренд Net Worth (90 дней)' : 'Net Worth Trend (90 days)'}
        </h3>

        <div className="relative h-48">
          {/* Hover tooltip */}
          {hoveredPoint && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded z-10">
              {hoveredPoint.date}: ${(hoveredPoint.value / 1000000).toFixed(2)}M
            </div>
          )}

          <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3].map(i => (
              <line
                key={i}
                x1="0" y1={i * 50}
                x2="400" y2={i * 50}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={trend.map((point, i) => {
                const x = (i / (trend.length - 1)) * 400;
                const y = 150 - ((point.value - minTrend) / trendRange) * 140;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Area fill */}
            <polygon
              fill="url(#trendGradient)"
              points={`0,150 ${trend.map((point, i) => {
                const x = (i / (trend.length - 1)) * 400;
                const y = 150 - ((point.value - minTrend) / trendRange) * 140;
                return `${x},${y}`;
              }).join(' ')} 400,150`}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Points */}
            {trend.map((point, i) => {
              const x = (i / (trend.length - 1)) * 400;
              const y = 150 - ((point.value - minTrend) / trendRange) * 140;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hoveredPoint === point ? 6 : 4}
                  fill="#10b981"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-[10px] text-stone-400">
            {trend.filter((_, i) => i % 3 === 0).map((point, i) => (
              <span key={i}>{point.date}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
