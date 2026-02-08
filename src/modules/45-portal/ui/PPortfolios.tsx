'use client';

import React, { useState } from 'react';
import { PortfolioSummary, Locale, portalI18n } from '../types';
import { PCard, PCardHeader, PCardBody, PCardFooter } from './PCard';

interface PPortfoliosProps {
  portfolios: PortfolioSummary[];
  locale?: Locale;
}

export function PPortfolios({ portfolios, locale = 'ru' }: PPortfoliosProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioSummary | null>(null);

  const labels: Record<string, Record<Locale, string>> = {
    portfolios: { ru: 'Портфели', en: 'Portfolios', uk: 'Портфелі' },
    custodian: { ru: 'Кастодиан', en: 'Custodian', uk: 'Кастодіан' },
    account: { ru: 'Счёт', en: 'Account', uk: 'Рахунок' },
    value: { ru: 'Стоимость', en: 'Value', uk: 'Вартість' },
    allocation: { ru: 'Структура', en: 'Allocation', uk: 'Структура' },
    assetClass: { ru: 'Класс', en: 'Class', uk: 'Клас' },
    share: { ru: 'Доля', en: 'Share', uk: 'Частка' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
    total: { ru: 'Общая стоимость', en: 'Total Value', uk: 'Загальна вартість' },
    portfolioCount: { ru: 'портфелей', en: 'portfolios', uk: 'портфелів' },
    noPortfolios: { ru: 'Нет портфелей', en: 'No portfolios', uk: 'Немає портфелів' },
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

  const totalValue = portfolios.reduce((sum, p) => sum + p.value, 0);

  const allocationColors = [
    'from-emerald-400 to-emerald-500',
    'from-amber-400 to-amber-500',
    'from-blue-400 to-blue-500',
    'from-purple-400 to-purple-500',
    'from-rose-400 to-rose-500',
  ];

  if (portfolios.length === 0) {
    return (
      <PCard>
        <PCardBody>
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400">{labels.noPortfolios[locale]}</p>
          </div>
        </PCardBody>
      </PCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <PCard>
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-2">{labels.total[locale]}</p>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalValue)}</p>
          <p className="text-sm text-slate-400 mt-1">
            {portfolios.length} {labels.portfolioCount[locale]}
          </p>
        </div>
      </PCard>

      {/* Portfolio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolios.map((portfolio, idx) => (
          <PCard
            key={portfolio.id}
            hover
            onClick={() => setSelectedPortfolio(portfolio)}
            className="cursor-pointer"
          >
            <PCardBody>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{portfolio.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{portfolio.custodian}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${allocationColors[idx % allocationColors.length]} flex items-center justify-center text-white font-bold text-sm`}>
                  {portfolio.name.charAt(0)}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{labels.account[locale]}</p>
                  <p className="text-sm font-mono text-slate-600">{portfolio.accountNumberMasked}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(portfolio.value)}</p>
                  <p className="text-xs text-slate-400">
                    {formatPercent((portfolio.value / totalValue) * 100)} {locale === 'ru' ? 'от общего' : 'of total'}
                  </p>
                </div>
              </div>
            </PCardBody>
          </PCard>
        ))}
      </div>

      {/* Portfolio Detail Drawer */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedPortfolio(null)} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedPortfolio.name}</h2>
                <p className="text-sm text-slate-500">{selectedPortfolio.custodian}</p>
              </div>
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Value */}
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl">
                <p className="text-sm font-medium text-slate-500 mb-1">{labels.value[locale]}</p>
                <p className="text-3xl font-bold text-slate-800">{formatCurrency(selectedPortfolio.value)}</p>
              </div>

              {/* Account */}
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">{labels.account[locale]}</p>
                <p className="text-lg font-mono text-slate-700 bg-slate-50 px-4 py-2 rounded-lg">
                  {selectedPortfolio.accountNumberMasked}
                </p>
              </div>

              {/* Allocation */}
              <div>
                <p className="text-sm font-medium text-slate-500 mb-4">{labels.allocation[locale]}</p>
                <div className="space-y-3">
                  {selectedPortfolio.allocation.map((item, idx) => (
                    <div key={item.assetClass}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700">{item.assetClass}</span>
                        <span className="text-sm font-medium text-slate-800">{formatPercent(item.percent)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${allocationColors[idx % allocationColors.length]}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 text-right mt-1">{formatCurrency(item.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
