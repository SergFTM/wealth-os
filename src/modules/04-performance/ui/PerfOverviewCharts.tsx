"use client";

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ReturnPoint {
  period: string;
  portfolioReturn: number;
  benchmarkReturn?: number;
}

interface PerfOverviewChartsProps {
  returns: ReturnPoint[];
  portfolioName?: string;
  benchmarkName?: string;
}

function SimpleLineChart({ 
  data, 
  lines, 
  height = 200 
}: { 
  data: { label: string; values: number[] }[];
  lines: { key: number; color: string; label: string }[];
  height?: number;
}) {
  const allValues = data.flatMap(d => d.values);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 0);
  const range = maxVal - minVal || 1;
  
  const width = 100;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = lines.map(line => {
    const linePoints = data.map((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((d.values[line.key] - minVal) / range) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
    return { ...line, points: linePoints };
  });

  const zeroY = padding + chartHeight - ((0 - minVal) / range) * chartHeight;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      {/* Zero line */}
      <line 
        x1={padding} 
        y1={zeroY} 
        x2={width - padding} 
        y2={zeroY} 
        stroke="#e5e5e5" 
        strokeWidth="0.5" 
        strokeDasharray="2,2"
      />
      
      {/* Lines */}
      {points.map(line => (
        <polyline
          key={line.key}
          points={line.points}
          fill="none"
          stroke={line.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      
      {/* Data points */}
      {points.map(line => 
        data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
          const y = padding + chartHeight - ((d.values[line.key] - minVal) / range) * chartHeight;
          return (
            <circle
              key={`${line.key}-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill={line.color}
            />
          );
        })
      )}
    </svg>
  );
}

export function PerfOverviewCharts({ returns, portfolioName = 'Портфель', benchmarkName = 'Бенчмарк' }: PerfOverviewChartsProps) {
  const chartData = useMemo(() => {
    // Calculate cumulative returns
    let portfolioCum = 100;
    let benchmarkCum = 100;
    
    return returns.map(r => {
      portfolioCum *= (1 + r.portfolioReturn / 100);
      if (r.benchmarkReturn !== undefined) {
        benchmarkCum *= (1 + r.benchmarkReturn / 100);
      }
      return {
        label: r.period,
        values: [portfolioCum, r.benchmarkReturn !== undefined ? benchmarkCum : 0]
      };
    });
  }, [returns]);

  const drawdownData = useMemo(() => {
    let peak = 100;
    let portfolioCum = 100;
    
    return returns.map(r => {
      portfolioCum *= (1 + r.portfolioReturn / 100);
      peak = Math.max(peak, portfolioCum);
      const drawdown = ((portfolioCum - peak) / peak) * 100;
      return {
        label: r.period,
        values: [drawdown, 0]
      };
    });
  }, [returns]);

  const hasBenchmark = returns.some(r => r.benchmarkReturn !== undefined);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Equity Curve */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Equity Curve</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span className="text-stone-500">{portfolioName}</span>
            </div>
            {hasBenchmark && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-400 rounded" />
                <span className="text-stone-500">{benchmarkName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="h-48">
          <SimpleLineChart
            data={chartData}
            lines={[
              { key: 0, color: '#10b981', label: portfolioName },
              ...(hasBenchmark ? [{ key: 1, color: '#60a5fa', label: benchmarkName }] : [])
            ]}
            height={192}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-400 mt-2 px-2">
          {returns.length > 0 && (
            <>
              <span>{returns[0]?.period}</span>
              <span>{returns[returns.length - 1]?.period}</span>
            </>
          )}
        </div>
      </div>

      {/* Drawdown Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Просадка (Drawdown)</h3>
        </div>
        <div className="h-48">
          <SimpleLineChart
            data={drawdownData}
            lines={[{ key: 0, color: '#f43f5e', label: 'Drawdown' }]}
            height={192}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-400 mt-2 px-2">
          {returns.length > 0 && (
            <>
              <span>{returns[0]?.period}</span>
              <span>{returns[returns.length - 1]?.period}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
