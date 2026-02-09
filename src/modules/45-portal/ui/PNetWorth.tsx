'use client';

import React from 'react';
import { NetWorthSummary, Locale, portalI18n } from '../types';
import { PCard, PCardHeader, PCardBody, PCardFooter } from './PCard';

interface PNetWorthProps {
  data: NetWorthSummary;
  locale?: Locale;
}

export function PNetWorth({ data, locale = 'ru' }: PNetWorthProps) {
  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Чистый капитал', en: 'Net Worth', uk: 'Чистий капітал' },
    byAssetClass: { ru: 'По классам активов', en: 'By Asset Class', uk: 'За класами активів' },
    assetClass: { ru: 'Класс активов', en: 'Asset Class', uk: 'Клас активів' },
    value: { ru: 'Стоимость', en: 'Value', uk: 'Вартість' },
    share: { ru: 'Доля', en: 'Share', uk: 'Частка' },
    change30d: { ru: 'Изменение за 30 дней', en: '30-Day Change', uk: 'Зміна за 30 днів' },
    sources: { ru: 'Источники данных', en: 'Data Sources', uk: 'Джерела даних' },
    asOf: { ru: 'По состоянию на', en: 'As of', uk: 'Станом на' },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const assetColors = [
    'bg-emerald-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-teal-500',
    'bg-orange-500',
  ];

  return (
    <div className="space-y-6">
      {/* Total Card */}
      <PCard>
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-500 mb-2">{labels.title[locale]}</p>
          <p className="text-4xl font-bold text-slate-800 mb-4">{formatCurrency(data.total)}</p>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-lg font-semibold ${data.change30d >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {data.change30d >= 0 ? '+' : ''}{formatCurrency(data.change30d)}
            </span>
            <span className={`text-sm ${data.changePercent30d >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              ({data.changePercent30d >= 0 ? '+' : ''}{formatPercent(data.changePercent30d)})
            </span>
            <span className="text-sm text-slate-400">{labels.change30d[locale]}</span>
          </div>
        </div>
      </PCard>

      {/* Asset Class Breakdown */}
      <PCard>
        <PCardHeader title={labels.byAssetClass[locale]} />
        <PCardBody noPadding>
          {/* Visual bar */}
          <div className="px-6 py-4">
            <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex">
              {data.byAssetClass.map((item, idx) => (
                <div
                  key={item.name}
                  className={`${assetColors[idx % assetColors.length]} transition-all duration-500`}
                  style={{ width: `${item.percent}%` }}
                  title={`${item.name}: ${formatPercent(item.percent)}`}
                />
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-emerald-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {labels.assetClass[locale]}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {labels.value[locale]}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {labels.share[locale]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {data.byAssetClass.map((item, idx) => (
                  <tr key={item.name} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${assetColors[idx % assetColors.length]}`} />
                        <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-700 font-medium">
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-500">
                      {formatPercent(item.percent)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-emerald-100 bg-slate-50/50">
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {locale === 'ru' ? 'Итого' : locale === 'en' ? 'Total' : 'Разом'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    {formatCurrency(data.total)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-600">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </PCardBody>
        <PCardFooter>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="font-medium">{labels.asOf[locale]}:</span>{' '}
              {formatDate(data.asOfDate)}
            </div>
            <div>
              <span className="font-medium">{labels.sources[locale]}:</span>{' '}
              {data.sources.join(', ')}
            </div>
          </div>
        </PCardFooter>
      </PCard>

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-slate-600">
            {portalI18n.disclaimers.investment[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}
