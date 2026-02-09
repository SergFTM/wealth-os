'use client';

import React from 'react';
import { LiquiditySummary, Locale, portalI18n } from '../types';
import { PCard, PCardHeader, PCardBody, PCardFooter } from './PCard';

interface PLiquidityProps {
  data: LiquiditySummary;
  locale?: Locale;
}

export function PLiquidity({ data, locale = 'ru' }: PLiquidityProps) {
  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Ликвидность', en: 'Liquidity', uk: 'Ліквідність' },
    cashToday: { ru: 'Денежные средства сегодня', en: 'Cash Today', uk: 'Грошові кошти сьогодні' },
    forecast: { ru: 'Прогноз', en: 'Forecast', uk: 'Прогноз' },
    days30: { ru: '30 дней', en: '30 days', uk: '30 днів' },
    days90: { ru: '90 дней', en: '90 days', uk: '90 днів' },
    inflows: { ru: 'Ожидаемые поступления', en: 'Expected Inflows', uk: 'Очікувані надходження' },
    outflows: { ru: 'Ожидаемые расходы', en: 'Expected Outflows', uk: 'Очікувані витрати' },
    netFlow: { ru: 'Нетто', en: 'Net', uk: 'Нетто' },
    alerts: { ru: 'Уведомления', en: 'Alerts', uk: 'Повідомлення' },
    noAlerts: { ru: 'Нет уведомлений', en: 'No alerts', uk: 'Немає повідомлень' },
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const netFlow = data.inflows30d - data.outflows30d;

  return (
    <div className="space-y-6">
      {/* Cash Today */}
      <PCard>
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-500 mb-2">{labels.cashToday[locale]}</p>
          <p className="text-4xl font-bold text-slate-800">{formatCurrency(data.cashToday)}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-emerald-600 font-medium">
              {locale === 'ru' ? 'Достаточно' : locale === 'en' ? 'Sufficient' : 'Достатньо'}
            </span>
          </div>
        </div>
      </PCard>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PCard>
          <PCardBody>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">{labels.forecast[locale]} {labels.days30[locale]}</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(data.cashForecast30d)}</p>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                style={{ width: `${Math.min((data.cashForecast30d / data.cashToday) * 100, 100)}%` }}
              />
            </div>
          </PCardBody>
        </PCard>

        <PCard>
          <PCardBody>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">{labels.forecast[locale]} {labels.days90[locale]}</p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(data.cashForecast90d)}</p>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                style={{ width: `${Math.min((data.cashForecast90d / data.cashToday) * 100, 100)}%` }}
              />
            </div>
          </PCardBody>
        </PCard>
      </div>

      {/* Cash Flow */}
      <PCard>
        <PCardHeader title={`${labels.forecast[locale]} ${labels.days30[locale]}`} />
        <PCardBody>
          <div className="space-y-4">
            {/* Inflows */}
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0-16l-4 4m4-4l4 4" />
                  </svg>
                </div>
                <span className="font-medium text-slate-700">{labels.inflows[locale]}</span>
              </div>
              <span className="text-lg font-semibold text-emerald-600">+{formatCurrency(data.inflows30d)}</span>
            </div>

            {/* Outflows */}
            <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m0 16l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <span className="font-medium text-slate-700">{labels.outflows[locale]}</span>
              </div>
              <span className="text-lg font-semibold text-red-500">-{formatCurrency(data.outflows30d)}</span>
            </div>

            {/* Net */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
              <span className="font-semibold text-slate-800">{labels.netFlow[locale]}</span>
              <span className={`text-xl font-bold ${netFlow >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
              </span>
            </div>
          </div>
        </PCardBody>
      </PCard>

      {/* Alerts */}
      <PCard>
        <PCardHeader title={labels.alerts[locale]} />
        <PCardBody>
          {data.alerts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-emerald-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-slate-400">{labels.noAlerts[locale]}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {data.alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-xl ${
                    alert.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p className={`text-sm ${alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PCardBody>
        <PCardFooter>
          <p className="text-xs text-slate-500">
            <span className="font-medium">{labels.asOf[locale]}:</span> {formatDate(data.asOfDate)}
          </p>
        </PCardFooter>
      </PCard>

      {/* Forecast Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800">
            {portalI18n.disclaimers.forecast[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}
