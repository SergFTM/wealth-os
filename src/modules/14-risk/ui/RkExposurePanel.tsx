"use client";

import React, { useState } from 'react';
import { PieChart, BarChart2 } from 'lucide-react';

interface Exposure {
  id: string;
  dimension: string;
  segment: string;
  exposure: number;
  benchmark: number;
  deviation: number;
}

interface RkExposurePanelProps {
  exposures: Exposure[];
  selectedDimension?: string;
  onDimensionChange?: (dimension: string) => void;
}

const dimensions = [
  { id: 'assetClass', label: 'Классы активов' },
  { id: 'sector', label: 'Секторы' },
  { id: 'geography', label: 'География' },
  { id: 'currency', label: 'Валюты' },
  { id: 'liquidity', label: 'Ликвидность' },
];

const colors = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
];

export function RkExposurePanel({ exposures, selectedDimension = 'assetClass', onDimensionChange }: RkExposurePanelProps) {
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('bar');

  const filteredExposures = exposures.filter(e => e.dimension === selectedDimension);
  const maxExposure = Math.max(...filteredExposures.map(e => Math.max(e.exposure, e.benchmark)));

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-800">Экспозиции портфеля</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('bar')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'bar' ? 'bg-stone-100 text-stone-700' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'pie' ? 'bg-stone-100 text-stone-700' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <PieChart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dimension selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dimensions.map(dim => (
          <button
            key={dim.id}
            onClick={() => onDimensionChange?.(dim.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedDimension === dim.id
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {dim.label}
          </button>
        ))}
      </div>

      {/* Bar chart view */}
      {viewMode === 'bar' && (
        <div className="space-y-3">
          {filteredExposures.map((exp, index) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-700 font-medium">{exp.segment}</span>
                <div className="flex items-center gap-2">
                  <span className="text-stone-800 font-semibold">{exp.exposure.toFixed(1)}%</span>
                  <span className={`text-xs ${exp.deviation > 0 ? 'text-red-500' : exp.deviation < 0 ? 'text-emerald-500' : 'text-stone-400'}`}>
                    {exp.deviation > 0 ? '+' : ''}{exp.deviation.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="relative h-6 bg-stone-100 rounded-lg overflow-hidden">
                {/* Portfolio bar */}
                <div
                  className={`absolute top-0 left-0 h-3 ${colors[index % colors.length]} rounded-t-lg transition-all`}
                  style={{ width: `${(exp.exposure / maxExposure) * 100}%` }}
                />
                {/* Benchmark bar */}
                <div
                  className="absolute bottom-0 left-0 h-3 bg-stone-300 rounded-b-lg transition-all"
                  style={{ width: `${(exp.benchmark / maxExposure) * 100}%` }}
                />
                {/* Benchmark marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-stone-600"
                  style={{ left: `${(exp.benchmark / maxExposure) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded" />
              <span>Портфель</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-stone-300 rounded" />
              <span>Бенчмарк</span>
            </div>
          </div>
        </div>
      )}

      {/* Pie chart view (simplified visual) */}
      {viewMode === 'pie' && (
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {filteredExposures.reduce((acc, exp, index) => {
                const startAngle = acc.offset;
                const angle = (exp.exposure / 100) * 360;
                const endAngle = startAngle + angle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);

                const largeArc = angle > 180 ? 1 : 0;

                acc.paths.push(
                  <path
                    key={exp.id}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    className={colors[index % colors.length].replace('bg-', 'fill-')}
                  />
                );
                acc.offset = endAngle;
                return acc;
              }, { paths: [] as React.ReactElement[], offset: 0 }).paths}
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            {filteredExposures.slice(0, 6).map((exp, index) => (
              <div key={exp.id} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${colors[index % colors.length]}`} />
                <span className="text-stone-600 flex-1">{exp.segment}</span>
                <span className="text-stone-800 font-medium">{exp.exposure.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
