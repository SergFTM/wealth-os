'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

const labels = {
  back: { ru: '← Назад к отчетам', en: '← Back to reports', uk: '← Назад до звітів' },
  download: { ru: 'Скачать PDF', en: 'Download PDF', uk: 'Завантажити PDF' },
  period: { ru: 'Период', en: 'Period', uk: 'Період' },
  published: { ru: 'Опубликован', en: 'Published', uk: 'Опубліковано' },
  sections: { ru: 'Разделы отчета', en: 'Report Sections', uk: 'Розділи звіту' },
  loading: { ru: 'Загрузка отчета...', en: 'Loading report...', uk: 'Завантаження звіту...' },
  notFound: { ru: 'Отчет не найден', en: 'Report not found', uk: 'Звіт не знайдено' },
  disclaimer: { ru: 'Отчет носит информационный характер. Проверьте данные перед принятием решений.', en: 'Report is for informational purposes. Verify data before making decisions.', uk: 'Звіт має інформаційний характер. Перевірте дані перед прийняттям рішень.' },
};

interface Report {
  id: string;
  name: string;
  packType: string;
  period: string;
  status: string;
  publishedAt: string;
  description?: string;
  sections?: { id: string; title: string; content: string }[];
}

interface PtReportViewerProps {
  reportId: string;
}

export function PtReportViewer({ reportId }: PtReportViewerProps) {
  const { locale } = useApp();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/collections/reportShares/${reportId}`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">{labels.loading[locale]}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center">
        <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-stone-500">{labels.notFound[locale]}</p>
        <Link href="/portal/reports" className="text-emerald-600 hover:text-emerald-700 mt-2 inline-block">
          {labels.back[locale]}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/portal/reports" className="text-sm text-emerald-600 hover:text-emerald-700">
        {labels.back[locale]}
      </Link>

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800 mb-2">{report.name}</h1>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{labels.period[locale]}: {report.period}</span>
              <span>•</span>
              <span>{labels.published[locale]}: {new Date(report.publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}</span>
            </div>
            {report.description && (
              <p className="text-stone-600 mt-4">{report.description}</p>
            )}
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {labels.download[locale]}
          </button>
        </div>
      </div>

      {/* Report content placeholder */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.sections[locale]}</h2>
        <div className="space-y-4">
          {(report.sections || [
            { id: '1', title: 'Executive Summary', content: 'Portfolio performance summary for the period...' },
            { id: '2', title: 'Asset Allocation', content: 'Current allocation across asset classes...' },
            { id: '3', title: 'Performance Attribution', content: 'Detailed performance breakdown...' },
          ]).map((section) => (
            <div key={section.id} className="p-4 bg-stone-50/50 rounded-xl">
              <h3 className="font-medium text-stone-800 mb-2">{section.title}</h3>
              <p className="text-sm text-stone-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800">{labels.disclaimer[locale]}</p>
        </div>
      </div>
    </div>
  );
}
