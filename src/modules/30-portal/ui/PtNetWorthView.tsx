'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';

const labels = {
  title: { ru: 'Обзор капитала', en: 'Net Worth Overview', uk: 'Огляд капіталу' },
  totalAssets: { ru: 'Всего активов', en: 'Total Assets', uk: 'Всього активів' },
  totalLiabilities: { ru: 'Обязательства', en: 'Total Liabilities', uk: 'Зобов\'язання' },
  netWorth: { ru: 'Чистая стоимость', en: 'Net Worth', uk: 'Чиста вартість' },
  assetsByCategory: { ru: 'Активы по категориям', en: 'Assets by Category', uk: 'Активи за категоріями' },
  liabilitiesByCategory: { ru: 'Обязательства по категориям', en: 'Liabilities by Category', uk: 'Зобов\'язання за категоріями' },
  sources: { ru: 'Источники данных', en: 'Data Sources', uk: 'Джерела даних' },
  sourcesDesc: { ru: 'Данные получены от депозитариев и банков', en: 'Data sourced from custodians and banks', uk: 'Дані отримані від депозитаріїв та банків' },
  asOf: { ru: 'Данные на', en: 'As of', uk: 'Дані на' },
  noData: { ru: 'Недостаточно данных', en: 'Insufficient data', uk: 'Недостатньо даних' },
  disclaimer: { ru: 'Данные носят информационный характер', en: 'Data is for informational purposes only', uk: 'Дані мають інформаційний характер' },
};

const assetCategories = [
  { key: 'equities', label: { ru: 'Акции', en: 'Equities', uk: 'Акції' }, value: 18500000, color: 'bg-emerald-500' },
  { key: 'fixed_income', label: { ru: 'Облигации', en: 'Fixed Income', uk: 'Облігації' }, value: 12200000, color: 'bg-blue-500' },
  { key: 'real_estate', label: { ru: 'Недвижимость', en: 'Real Estate', uk: 'Нерухомість' }, value: 8500000, color: 'bg-amber-500' },
  { key: 'alternatives', label: { ru: 'Альтернативы', en: 'Alternatives', uk: 'Альтернативи' }, value: 5200000, color: 'bg-purple-500' },
  { key: 'cash', label: { ru: 'Денежные средства', en: 'Cash', uk: 'Грошові кошти' }, value: 4850000, color: 'bg-stone-400' },
];

const liabilityCategories = [
  { key: 'mortgages', label: { ru: 'Ипотека', en: 'Mortgages', uk: 'Іпотека' }, value: 1500000, color: 'bg-rose-500' },
  { key: 'credit_lines', label: { ru: 'Кредитные линии', en: 'Credit Lines', uk: 'Кредитні лінії' }, value: 500000, color: 'bg-orange-500' },
];

export function PtNetWorthView() {
  const { locale, asOfDate } = useApp();
  const [loading, setLoading] = useState(true);

  const totalAssets = assetCategories.reduce((sum, cat) => sum + cat.value, 0);
  const totalLiabilities = liabilityCategories.reduce((sum, cat) => sum + cat.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
        <p className="text-sm text-stone-500 mt-1">
          {labels.asOf[locale]}: {new Date(asOfDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="text-sm text-stone-500 mb-2">{labels.totalAssets[locale]}</div>
          <div className="text-3xl font-semibold text-emerald-600">
            ${totalAssets.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="text-sm text-stone-500 mb-2">{labels.totalLiabilities[locale]}</div>
          <div className="text-3xl font-semibold text-rose-600">
            ${totalLiabilities.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="text-sm text-emerald-100 mb-2">{labels.netWorth[locale]}</div>
          <div className="text-3xl font-semibold">
            ${netWorth.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Assets breakdown */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-6">{labels.assetsByCategory[locale]}</h2>
        <div className="space-y-4">
          {assetCategories.map((cat) => {
            const percentage = (cat.value / totalAssets) * 100;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-700">{cat.label[locale]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-stone-500">{percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium text-stone-800">${cat.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liabilities breakdown */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-6">{labels.liabilitiesByCategory[locale]}</h2>
        <div className="space-y-4">
          {liabilityCategories.map((cat) => {
            const percentage = (cat.value / totalLiabilities) * 100;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-700">{cat.label[locale]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-stone-500">{percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium text-stone-800">${cat.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources disclaimer */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium text-emerald-800 text-sm">{labels.sources[locale]}</div>
            <div className="text-sm text-emerald-700 mt-1">{labels.sourcesDesc[locale]}</div>
            <div className="text-xs text-emerald-600 mt-2">{labels.disclaimer[locale]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
