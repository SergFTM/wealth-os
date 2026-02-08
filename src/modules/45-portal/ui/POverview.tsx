'use client';

import React from 'react';
import Link from 'next/link';
import { PortalKpis, PortalRequest, PortalDocument, PortalThread, Locale, portalI18n } from '../types';
import { PkKpiStrip } from './PkKpiStrip';
import { PCard, PCardHeader, PCardBody } from './PCard';
import { PStatusPill } from './PStatusPill';

interface POverviewProps {
  kpis: PortalKpis;
  recentRequests: PortalRequest[];
  recentDocuments: PortalDocument[];
  recentThreads: PortalThread[];
  locale?: Locale;
  onAskCopilot?: () => void;
}

export function POverview({
  kpis,
  recentRequests,
  recentDocuments,
  recentThreads,
  locale = 'ru',
  onAskCopilot,
}: POverviewProps) {
  const labels: Record<string, Record<Locale, string>> = {
    quickActions: { ru: 'Быстрые действия', en: 'Quick Actions', uk: 'Швидкі дії' },
    createRequest: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
    openPacks: { ru: 'Пакеты отчётов', en: 'Report Packs', uk: 'Пакети звітів' },
    sendMessage: { ru: 'Написать сообщение', en: 'Send Message', uk: 'Надіслати повідомлення' },
    askCopilot: { ru: 'Спросить AI', en: 'Ask AI', uk: 'Запитати AI' },
    recentRequests: { ru: 'Последние запросы', en: 'Recent Requests', uk: 'Останні запити' },
    newDocuments: { ru: 'Новые документы', en: 'New Documents', uk: 'Нові документи' },
    messages: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' },
    viewAll: { ru: 'Все', en: 'View All', uk: 'Усі' },
    noRequests: { ru: 'Нет активных запросов', en: 'No active requests', uk: 'Немає активних запитів' },
    noDocuments: { ru: 'Нет новых документов', en: 'No new documents', uk: 'Немає нових документів' },
    noMessages: { ru: 'Нет новых сообщений', en: 'No new messages', uk: 'Немає нових повідомлень' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-8">
      {/* KPI Strip */}
      <PkKpiStrip kpis={kpis} locale={locale} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{labels.quickActions[locale]}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/p/requests?new=1">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-medium">{labels.createRequest[locale]}</p>
            </div>
          </Link>

          <Link href="/p/packs">
            <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="font-medium text-slate-800">{labels.openPacks[locale]}</p>
            </div>
          </Link>

          <Link href="/p/threads?new=1">
            <div className="bg-white rounded-2xl border border-emerald-100/50 p-5 hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-medium text-slate-800">{labels.sendMessage[locale]}</p>
            </div>
          </Link>

          <button onClick={onAskCopilot}>
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-white hover:shadow-lg transition-all duration-200 cursor-pointer text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="font-medium">{labels.askCopilot[locale]}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <PCard>
          <PCardHeader
            title={labels.recentRequests[locale]}
            action={
              <Link href="/p/requests" className="text-sm text-emerald-600 hover:text-emerald-700">
                {labels.viewAll[locale]} →
              </Link>
            }
          />
          <PCardBody noPadding>
            {recentRequests.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">{labels.noRequests[locale]}</p>
            ) : (
              <div className="divide-y divide-emerald-50">
                {recentRequests.slice(0, 5).map((req) => (
                  <Link key={req.id} href={`/p/requests?id=${req.id}`}>
                    <div className="px-6 py-3 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{req.subject}</p>
                          <p className="text-xs text-slate-400 mt-0.5">#{req.number}</p>
                        </div>
                        <PStatusPill status={req.status} locale={locale} size="sm" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </PCardBody>
        </PCard>

        {/* New Documents */}
        <PCard>
          <PCardHeader
            title={labels.newDocuments[locale]}
            action={
              <Link href="/p/documents" className="text-sm text-emerald-600 hover:text-emerald-700">
                {labels.viewAll[locale]} →
              </Link>
            }
          />
          <PCardBody noPadding>
            {recentDocuments.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">{labels.noDocuments[locale]}</p>
            ) : (
              <div className="divide-y divide-emerald-50">
                {recentDocuments.slice(0, 5).map((doc) => (
                  <Link key={doc.id} href={`/p/documents?id=${doc.id}`}>
                    <div className="px-6 py-3 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{doc.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(doc.publishedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </PCardBody>
        </PCard>

        {/* Messages */}
        <PCard>
          <PCardHeader
            title={labels.messages[locale]}
            action={
              <Link href="/p/threads" className="text-sm text-emerald-600 hover:text-emerald-700">
                {labels.viewAll[locale]} →
              </Link>
            }
          />
          <PCardBody noPadding>
            {recentThreads.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">{labels.noMessages[locale]}</p>
            ) : (
              <div className="divide-y divide-emerald-50">
                {recentThreads.slice(0, 5).map((thread) => (
                  <Link key={thread.id} href={`/p/threads?id=${thread.id}`}>
                    <div className="px-6 py-3 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{thread.subject}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {thread.participantNames.join(', ')}
                          </p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </PCardBody>
        </PCard>
      </div>

      {/* AI Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-800">
            {portalI18n.disclaimers.ai[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}
