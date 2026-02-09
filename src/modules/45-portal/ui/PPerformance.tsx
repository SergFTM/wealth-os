'use client';

import React from 'react';
import { PerformanceSummary, Locale, portalI18n } from '../types';
import { PCard, PCardHeader, PCardBody, PCardFooter } from './PCard';

interface PPerformanceProps {
  data: PerformanceSummary;
  locale?: Locale;
}

export function PPerformance({ data, locale = 'ru' }: PPerformanceProps) {
  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Доходность портфеля', en: 'Portfolio Performance', uk: 'Дохідність портфеля' },
    period: { ru: 'Период', en: 'Period', uk: 'Період' },
    return: { ru: 'Доходность', en: 'Return', uk: 'Дохідність' },
    benchmark: { ru: 'Бенчмарк', en: 'Benchmark', uk: 'Бенчмарк' },
    difference: { ru: 'Разница', en: 'Difference', uk: 'Різниця' },
    asOf: { ru: 'По состоянию на', en: 'As of', uk: 'Станом на' },
    chartPlaceholder: { ru: 'График доходности', en: 'Performance Chart', uk: 'Графік дохідності' },
  };

  const periodLabels: Record<string, Record<string, string>> = {
    '1M': { ru: '1 мес', en: '1M', uk: '1 міс' },
    '3M': { ru: '3 мес', en: '3M', uk: '3 міс' },
    '6M': { ru: '6 мес', en: '6M', uk: '6 міс' },
    'YTD': { ru: 'YTD', en: 'YTD', uk: 'YTD' },
    '1Y': { ru: '1 год', en: '1Y', uk: '1 рік' },
    '3Y': { ru: '3 года', en: '3Y', uk: '3 роки' },
    '5Y': { ru: '5 лет', en: '5Y', uk: '5 років' },
    'SI': { ru: 'С начала', en: 'Since Inception', uk: 'З початку' },
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPeriodLabel = (period: string) => {
    return periodLabels[period]?.[locale] || period;
  };

  // Find YTD for highlight
  const ytdPeriod = data.periods.find(p => p.period === 'YTD');

  return (
    <div className="space-y-6">
      {/* YTD Highlight */}
      {ytdPeriod && (
        <PCard>
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-500 mb-2">YTD {labels.return[locale]}</p>
            <p className={`text-4xl font-bold ${ytdPeriod.return >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {formatPercent(ytdPeriod.return)}
            </p>
            {ytdPeriod.benchmark !== undefined && data.benchmarkName && (
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <span className="text-slate-500">
                  {data.benchmarkName}: {formatPercent(ytdPeriod.benchmark)}
                </span>
                <span className={`font-medium ${(ytdPeriod.return - ytdPeriod.benchmark) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {(ytdPeriod.return - ytdPeriod.benchmark) >= 0 ? '+' : ''}
                  {(ytdPeriod.return - ytdPeriod.benchmark).toFixed(2)}% vs benchmark
                </span>
              </div>
            )}
          </div>
        </PCard>
      )}

      {/* Chart Placeholder */}
      <PCard>
        <PCardHeader title={labels.chartPlaceholder[locale]} />
        <PCardBody>
          <div className="h-64 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-emerald-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-sm text-slate-400">
                {locale === 'ru' ? 'Интерактивный график' : locale === 'en' ? 'Interactive chart' : 'Інтерактивний графік'}
              </p>
            </div>
          </div>
        </PCardBody>
      </PCard>

      {/* Performance Table */}
      <PCard>
        <PCardHeader title={labels.title[locale]} />
        <PCardBody noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-emerald-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {labels.period[locale]}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {labels.return[locale]}
                  </th>
                  {data.benchmarkName && (
                    <>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {labels.benchmark[locale]}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {labels.difference[locale]}
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {data.periods.map((period) => {
                  const diff = period.benchmark !== undefined ? period.return - period.benchmark : null;
                  return (
                    <tr key={period.period} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {getPeriodLabel(period.period)}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-semibold ${period.return >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {formatPercent(period.return)}
                      </td>
                      {data.benchmarkName && (
                        <>
                          <td className="px-6 py-4 text-right text-sm text-slate-500">
                            {period.benchmark !== undefined ? formatPercent(period.benchmark) : '—'}
                          </td>
                          <td className={`px-6 py-4 text-right text-sm font-medium ${diff !== null ? (diff >= 0 ? 'text-emerald-600' : 'text-red-500') : 'text-slate-400'}`}>
                            {diff !== null ? formatPercent(diff) : '—'}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PCardBody>
        <PCardFooter>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="font-medium">{labels.asOf[locale]}:</span>{' '}
              {formatDate(data.asOfDate)}
            </div>
            {data.benchmarkName && (
              <div>
                <span className="font-medium">{labels.benchmark[locale]}:</span>{' '}
                {data.benchmarkName}
              </div>
            )}
          </div>
        </PCardFooter>
      </PCard>

      {/* Investment Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800">
            {portalI18n.disclaimers.investment[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}
