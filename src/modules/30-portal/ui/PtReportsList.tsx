'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { PtStatusPill } from './PtStatusPill';

const labels = {
  title: { ru: 'Отчеты', en: 'Reports', uk: 'Звіти' },
  subtitle: { ru: 'Опубликованные отчетные пакеты', en: 'Published report packages', uk: 'Опубліковані звітні пакети' },
  period: { ru: 'Период', en: 'Period', uk: 'Період' },
  type: { ru: 'Тип', en: 'Type', uk: 'Тип' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  published: { ru: 'Опубликован', en: 'Published', uk: 'Опубліковано' },
  view: { ru: 'Открыть', en: 'View', uk: 'Відкрити' },
  download: { ru: 'Скачать PDF', en: 'Download PDF', uk: 'Завантажити PDF' },
  noReports: { ru: 'Нет доступных отчетов', en: 'No reports available', uk: 'Немає доступних звітів' },
  filter: { ru: 'Фильтр', en: 'Filter', uk: 'Фільтр' },
  allTypes: { ru: 'Все типы', en: 'All types', uk: 'Всі типи' },
  allPeriods: { ru: 'Все периоды', en: 'All periods', uk: 'Всі періоди' },
};

interface ReportShare {
  id: string;
  name: string;
  packType: string;
  period: string;
  status: string;
  publishedAt: string;
  description?: string;
}

export function PtReportsList() {
  const { locale } = useApp();
  const [reports, setReports] = useState<ReportShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  useEffect(() => {
    fetch('/api/collections/reportShares')
      .then(res => res.json())
      .then(data => {
        const published = (data || []).filter((r: ReportShare) => r.status === 'published');
        setReports(published);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter(r => {
    if (typeFilter !== 'all' && r.packType !== typeFilter) return false;
    if (periodFilter !== 'all' && !r.period.includes(periodFilter)) return false;
    return true;
  });

  const types = [...new Set(reports.map(r => r.packType))];
  const periods = [...new Set(reports.map(r => r.period.split(' ')[0]))];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
        <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">{labels.allTypes[locale]}</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">{labels.allPeriods[locale]}</option>
          {periods.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Reports list */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-stone-800">{report.name}</h3>
                    <PtStatusPill status={report.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span>{labels.period[locale]}: {report.period}</span>
                    <span>{labels.type[locale]}: {report.packType}</span>
                  </div>
                  {report.description && (
                    <p className="text-sm text-stone-600 mt-2">{report.description}</p>
                  )}
                  <div className="text-xs text-stone-400 mt-2">
                    {labels.published[locale]}: {new Date(report.publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/portal/reports/${report.id}`}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    {labels.view[locale]}
                  </Link>
                  <button className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors">
                    {labels.download[locale]}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-12 text-center">
          <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-stone-500">{labels.noReports[locale]}</p>
        </div>
      )}
    </div>
  );
}
