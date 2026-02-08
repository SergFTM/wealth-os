'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PoKpiStrip, PoKpiItem } from './PoKpiStrip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = any;

export function PoHomePage() {
  const { data: announcements, isLoading } = useCollection<AnyRecord>('portalAnnouncements');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const asOfDate = today.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const kpis: PoKpiItem[] = [
    { label: 'Чистая стоимость', value: '$12.4M', change: '+2.1% за месяц', status: 'ok' },
    { label: 'Доходность YTD', value: '+8.2%', change: 'Выше бенчмарка', status: 'ok' },
    { label: 'Новые документы', value: '3', change: 'За последние 7 дней', status: 'info' },
    { label: 'Открытые запросы', value: '2', change: '1 в работе', status: 'warning' },
    { label: 'Новые сообщения', value: '5', change: '2 непрочитанных', status: 'info' },
  ];

  const fallbackAnnouncements = [
    {
      id: 'ann-1',
      title: 'Квартальный отчёт Q4 2025 опубликован',
      body: 'Доступен для скачивания в разделе "Пакеты"',
      createdAt: '2026-01-15T10:00:00Z',
      priority: 'normal',
    },
    {
      id: 'ann-2',
      title: 'Обновление налоговых данных за 2025 год',
      body: 'Налоговые формы загружены в раздел документов',
      createdAt: '2026-01-10T14:30:00Z',
      priority: 'high',
    },
    {
      id: 'ann-3',
      title: 'Плановое обслуживание портала 20 февраля',
      body: 'Портал будет недоступен с 02:00 до 06:00 МСК',
      createdAt: '2026-02-05T09:00:00Z',
      priority: 'normal',
    },
  ];

  const displayAnnouncements =
    announcements && announcements.length > 0 ? announcements : fallbackAnnouncements;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">
          Добро пожаловать, Александр
        </h1>
        <p className="text-stone-500 mt-1 capitalize">{formattedDate}</p>
      </div>

      {/* As-of date */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400">Данные по состоянию на:</span>
        <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
          {asOfDate}
        </span>
      </div>

      {/* KPI Strip */}
      <PoKpiStrip items={kpis} />

      {/* Announcements */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Объявления</h2>
          <span className="text-xs text-stone-400">
            {displayAnnouncements.length} объявлений
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayAnnouncements.map((ann: AnyRecord) => (
              <div
                key={ann.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-stone-50/60 border border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    ann.priority === 'high' ? 'bg-amber-500' : 'bg-emerald-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800">{ann.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{ann.body}</p>
                </div>
                <span className="text-xs text-stone-400 shrink-0">
                  {new Date(ann.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Капитал', href: '/portal/net-worth', icon: 'chart' },
          { label: 'Документы', href: '/portal/documents', icon: 'doc' },
          { label: 'Пакеты', href: '/portal/packs', icon: 'pack' },
          { label: 'Запросы', href: '/portal/requests', icon: 'request' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-4 text-center hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <p className="text-sm font-medium text-stone-700 group-hover:text-emerald-700">
              {link.label}
            </p>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-stone-400 pt-2">
        Данные портала носят информационный характер. Не является финансовой консультацией.
      </p>
    </div>
  );
}
