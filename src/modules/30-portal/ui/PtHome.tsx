'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { PtStatusPill } from './PtStatusPill';
import { PtAnnouncementBanner } from './PtAnnouncementBanner';
import { cn } from '@/lib/utils';

const labels = {
  welcome: { ru: 'Добро пожаловать', en: 'Welcome', uk: 'Ласкаво просимо' },
  netWorth: { ru: 'Чистая стоимость', en: 'Net Worth', uk: 'Чиста вартість' },
  latestReport: { ru: 'Последний отчет', en: 'Latest Report', uk: 'Останній звіт' },
  openRequests: { ru: 'Открытые запросы', en: 'Open Requests', uk: 'Відкриті запити' },
  recentDocs: { ru: 'Недавние документы', en: 'Recent Documents', uk: 'Останні документи' },
  unpaidInvoices: { ru: 'Неоплаченные счета', en: 'Unpaid Invoices', uk: 'Неоплачені рахунки' },
  createRequest: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
  viewReports: { ru: 'Открыть отчеты', en: 'View Reports', uk: 'Відкрити звіти' },
  viewDocs: { ru: 'Открыть документы', en: 'View Documents', uk: 'Відкрити документи' },
  noData: { ru: 'Нет данных', en: 'No data', uk: 'Немає даних' },
  viewAll: { ru: 'Смотреть все', en: 'View All', uk: 'Дивитись все' },
  asOf: { ru: 'Данные на', en: 'As of', uk: 'Дані на' },
};

interface SummaryData {
  netWorth: number;
  openRequests: number;
  unpaidInvoices: number;
  recentDocuments: { id: string; name: string; category: string; createdAt: string }[];
  latestReport: { id: string; name: string; period: string; publishedAt: string } | null;
  requests: { id: string; title: string; status: string; createdAt: string }[];
}

export function PtHome() {
  const { locale, user, asOfDate } = useApp();
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/collections/clientRequests').then(r => r.json()),
      fetch('/api/collections/documents').then(r => r.json()),
      fetch('/api/collections/feeInvoices').then(r => r.json()),
      fetch('/api/collections/reportShares').then(r => r.json()),
    ]).then(([requests, docs, invoices, reports]) => {
      const openReqs = (requests || []).filter((r: { status: string }) => !['completed', 'cancelled'].includes(r.status));
      const unpaid = (invoices || []).filter((i: { status: string }) => i.status !== 'paid');
      const clientDocs = (docs || []).filter((d: { clientVisible?: boolean }) => d.clientVisible !== false).slice(0, 5);
      const publishedReports = (reports || []).filter((r: { status: string }) => r.status === 'published');

      setData({
        netWorth: 47250000,
        openRequests: openReqs.length,
        unpaidInvoices: unpaid.length,
        recentDocuments: clientDocs,
        latestReport: publishedReports[0] || null,
        requests: openReqs.slice(0, 5),
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">
            {labels.welcome[locale]}, {user?.name}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {labels.asOf[locale]}: {new Date(asOfDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/portal/request/new"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
          >
            {labels.createRequest[locale]}
          </Link>
        </div>
      </div>

      {/* Announcements */}
      <PtAnnouncementBanner />

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth */}
        <Link href="/portal/networth" className="group">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
            <div className="text-sm text-stone-500 mb-2">{labels.netWorth[locale]}</div>
            <div className="text-3xl font-semibold text-stone-800">
              ${(data?.netWorth || 0).toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +2.4% {locale === 'ru' ? 'за месяц' : 'this month'}
            </div>
          </div>
        </Link>

        {/* Open Requests */}
        <Link href="/portal/requests" className="group">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
            <div className="text-sm text-stone-500 mb-2">{labels.openRequests[locale]}</div>
            <div className="text-3xl font-semibold text-stone-800">{data?.openRequests || 0}</div>
            <div className="text-xs text-stone-400 mt-2">{labels.viewAll[locale]} →</div>
          </div>
        </Link>

        {/* Unpaid Invoices */}
        <Link href="/portal/invoices" className="group">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
            <div className="text-sm text-stone-500 mb-2">{labels.unpaidInvoices[locale]}</div>
            <div className="text-3xl font-semibold text-stone-800">{data?.unpaidInvoices || 0}</div>
            <div className="text-xs text-stone-400 mt-2">{labels.viewAll[locale]} →</div>
          </div>
        </Link>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800">{labels.openRequests[locale]}</h2>
            <Link href="/portal/requests" className="text-sm text-emerald-600 hover:text-emerald-700">
              {labels.viewAll[locale]}
            </Link>
          </div>
          {data?.requests && data.requests.length > 0 ? (
            <div className="space-y-3">
              {data.requests.map((req) => (
                <Link
                  key={req.id}
                  href={`/portal/requests/${req.id}`}
                  className="block p-3 rounded-xl hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-stone-800">{req.title}</span>
                    <PtStatusPill status={req.status} />
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {new Date(req.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-sm">{labels.noData[locale]}</div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800">{labels.recentDocs[locale]}</h2>
            <Link href="/portal/documents" className="text-sm text-emerald-600 hover:text-emerald-700">
              {labels.viewAll[locale]}
            </Link>
          </div>
          {data?.recentDocuments && data.recentDocuments.length > 0 ? (
            <div className="space-y-3">
              {data.recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-stone-800 truncate">{doc.name}</div>
                    <div className="text-xs text-stone-400">{doc.category}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-sm">{labels.noData[locale]}</div>
          )}
        </div>
      </div>

      {/* Latest Report */}
      {data?.latestReport && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-emerald-100 text-sm mb-1">{labels.latestReport[locale]}</div>
              <div className="text-xl font-semibold">{data.latestReport.name}</div>
              <div className="text-emerald-100 text-sm mt-1">{data.latestReport.period}</div>
            </div>
            <Link
              href={`/portal/reports/${data.latestReport.id}`}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium text-sm transition-colors"
            >
              {labels.viewReports[locale]}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
