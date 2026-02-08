'use client';

import React from 'react';
import Link from 'next/link';
import { PortalKpis, Locale } from '../types';

interface PkKpiStripProps {
  kpis: PortalKpis;
  locale?: Locale;
}

export function PkKpiStrip({ kpis, locale = 'ru' }: PkKpiStripProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
    });
  };

  const labels: Record<string, Record<Locale, string>> = {
    netWorth: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' },
    ytd: { ru: 'YTD', en: 'YTD', uk: 'YTD' },
    cash: { ru: 'Денежные средства', en: 'Cash', uk: 'Грошові кошти' },
    requests: { ru: 'Открытые запросы', en: 'Open Requests', uk: 'Відкриті запити' },
    documents: { ru: 'Новые документы', en: 'New Documents', uk: 'Нові документи' },
    meeting: { ru: 'Ближайшая встреча', en: 'Next Meeting', uk: 'Найближча зустріч' },
    last30d: { ru: 'за 30 дней', en: 'last 30 days', uk: 'за 30 днів' },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Net Worth */}
      <Link href="/p/net-worth" className="group">
        <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <p className="text-xs font-medium text-slate-500 mb-1">{labels.netWorth[locale]}</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(kpis.netWorth)}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-xs font-medium ${kpis.netWorthChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {kpis.netWorthChange >= 0 ? '+' : ''}{formatCurrency(kpis.netWorthChange)}
            </span>
            <span className="text-xs text-slate-400">{labels.last30d[locale]}</span>
          </div>
        </div>
      </Link>

      {/* YTD Performance */}
      <Link href="/p/performance" className="group">
        <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <p className="text-xs font-medium text-slate-500 mb-1">{labels.ytd[locale]}</p>
          <p className={`text-xl font-bold ${kpis.performanceYtd >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatPercent(kpis.performanceYtd)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <div className={`w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden`}>
              <div
                className={`h-full rounded-full ${kpis.performanceYtd >= 0 ? 'bg-emerald-500' : 'bg-red-400'}`}
                style={{ width: `${Math.min(Math.abs(kpis.performanceYtd) * 5, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Cash */}
      <Link href="/p/liquidity" className="group">
        <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <p className="text-xs font-medium text-slate-500 mb-1">{labels.cash[locale]}</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(kpis.cashToday)}</p>
          <div className="flex items-center gap-1 mt-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-slate-400">OK</span>
          </div>
        </div>
      </Link>

      {/* Open Requests */}
      <Link href="/p/requests" className="group">
        <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <p className="text-xs font-medium text-slate-500 mb-1">{labels.requests[locale]}</p>
          <p className="text-xl font-bold text-slate-800">{kpis.openRequests}</p>
          <div className="flex items-center gap-1 mt-2">
            {kpis.openRequests > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-amber-600">
                  {locale === 'ru' ? 'Требуют внимания' : locale === 'en' ? 'Need attention' : 'Потребують уваги'}
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">
                {locale === 'ru' ? 'Все закрыты' : locale === 'en' ? 'All closed' : 'Усі закриті'}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* New Documents */}
      <Link href="/p/documents" className="group">
        <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <p className="text-xs font-medium text-slate-500 mb-1">{labels.documents[locale]}</p>
          <p className="text-xl font-bold text-slate-800">{kpis.newDocuments}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-slate-400">{labels.last30d[locale]}</span>
          </div>
        </div>
      </Link>

      {/* Next Meeting */}
      <Link href="/p/calendar" className="group">
        <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <p className="text-xs font-medium text-slate-500 mb-1">{labels.meeting[locale]}</p>
          {kpis.nextMeetingDate ? (
            <>
              <p className="text-xl font-bold text-slate-800">{formatDate(kpis.nextMeetingDate)}</p>
              <p className="text-xs text-slate-400 mt-2 truncate">{kpis.nextMeetingTitle}</p>
            </>
          ) : (
            <p className="text-lg text-slate-400">—</p>
          )}
        </div>
      </Link>
    </div>
  );
}
