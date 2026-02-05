"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Exposure {
  id: string;
  portfolioId: string;
  dimension: string;
  segment: string;
  exposure: number;
  benchmark: number;
  deviation: number;
  marketValue: number;
  asOfDate: string;
}

interface RkExposureTableProps {
  exposures: Exposure[];
  onRowClick?: (exposure: Exposure) => void;
}

type SortKey = 'segment' | 'exposure' | 'benchmark' | 'deviation' | 'marketValue';

export function RkExposureTable({ exposures, onRowClick }: RkExposureTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('exposure');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDimension, setFilterDimension] = useState<string>('all');

  const dimensions = ['all', ...new Set(exposures.map(e => e.dimension))];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredExposures = exposures
    .filter(e => filterDimension === 'all' || e.dimension === filterDimension)
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortKey === 'segment') {
        return multiplier * a.segment.localeCompare(b.segment);
      }
      return multiplier * ((a[sortKey] as number) - (b[sortKey] as number));
    });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-3 h-3 text-stone-300" />;
    return sortOrder === 'asc'
      ? <ArrowUp className="w-3 h-3 text-stone-600" />
      : <ArrowDown className="w-3 h-3 text-stone-600" />;
  };

  const dimensionLabels: Record<string, string> = {
    all: 'Все измерения',
    assetClass: 'Классы активов',
    sector: 'Секторы',
    geography: 'География',
    currency: 'Валюты',
    liquidity: 'Ликвидность',
    creditRating: 'Кредитный рейтинг',
    duration: 'Дюрация',
    marketCap: 'Капитализация',
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Filter */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex flex-wrap gap-2">
          {dimensions.map(dim => (
            <button
              key={dim}
              onClick={() => setFilterDimension(dim)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterDimension === dim
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {dimensionLabels[dim] || dim}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('segment')} className="flex items-center gap-1 text-xs font-semibold text-stone-600 uppercase">
                  Сегмент <SortIcon column="segment" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button onClick={() => handleSort('exposure')} className="flex items-center justify-end gap-1 text-xs font-semibold text-stone-600 uppercase w-full">
                  Экспозиция <SortIcon column="exposure" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button onClick={() => handleSort('benchmark')} className="flex items-center justify-end gap-1 text-xs font-semibold text-stone-600 uppercase w-full">
                  Бенчмарк <SortIcon column="benchmark" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button onClick={() => handleSort('deviation')} className="flex items-center justify-end gap-1 text-xs font-semibold text-stone-600 uppercase w-full">
                  Отклонение <SortIcon column="deviation" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button onClick={() => handleSort('marketValue')} className="flex items-center justify-end gap-1 text-xs font-semibold text-stone-600 uppercase w-full">
                  Стоимость <SortIcon column="marketValue" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExposures.map((exp) => (
              <tr
                key={exp.id}
                onClick={() => onRowClick?.(exp)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-stone-800">{exp.segment}</div>
                    <div className="text-xs text-stone-500">{dimensionLabels[exp.dimension] || exp.dimension}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(exp.exposure, 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-stone-800 w-12 text-right">{exp.exposure.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {exp.benchmark.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${
                    exp.deviation > 2 ? 'text-red-600' :
                    exp.deviation < -2 ? 'text-amber-600' :
                    'text-stone-600'
                  }`}>
                    {exp.deviation > 0 ? '+' : ''}{exp.deviation.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  ${(exp.marketValue / 1000000).toFixed(2)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExposures.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}
