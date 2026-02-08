'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useCollection } from '@/lib/hooks';

// ---------------------------------------------------------------------------
// Demo fallback data
// ---------------------------------------------------------------------------
const DEMO_AUDIT: AuditEntry[] = [
  { id: 'av-01', action: 'view', target: 'Квартальный отчет Q4 2025', date: '2026-02-07T16:30:00Z', collection: 'Отчет' },
  { id: 'av-02', action: 'download', target: 'Выписка по счету CHF', date: '2026-02-07T15:12:00Z', collection: 'Документ' },
  { id: 'av-03', action: 'view', target: 'Структура владения (диаграмма)', date: '2026-02-07T14:05:00Z', collection: 'Пакет' },
  { id: 'av-04', action: 'view', target: 'Инвестиционная политика v3', date: '2026-02-06T11:22:00Z', collection: 'Документ' },
  { id: 'av-05', action: 'download', target: 'Налоговый пакет 2025', date: '2026-02-06T09:45:00Z', collection: 'Пакет' },
  { id: 'av-06', action: 'view', target: 'Благотворительный фонд — устав', date: '2026-02-05T17:30:00Z', collection: 'Документ' },
  { id: 'av-07', action: 'view', target: 'Портфельная аналитика', date: '2026-02-05T14:10:00Z', collection: 'Отчет' },
  { id: 'av-08', action: 'download', target: 'Соглашение о конфиденциальности', date: '2026-02-04T16:55:00Z', collection: 'Документ' },
  { id: 'av-09', action: 'view', target: 'Прогноз ликвидности', date: '2026-02-04T10:20:00Z', collection: 'Отчет' },
  { id: 'av-10', action: 'view', target: 'Стресс-тест портфеля', date: '2026-02-03T15:40:00Z', collection: 'Отчет' },
  { id: 'av-11', action: 'download', target: 'Доверительное управление — договор', date: '2026-02-03T11:15:00Z', collection: 'Документ' },
  { id: 'av-12', action: 'view', target: 'KYC-профиль (обновлённый)', date: '2026-02-02T09:30:00Z', collection: 'Документ' },
  { id: 'av-13', action: 'view', target: 'Распределение активов по классам', date: '2026-01-31T16:00:00Z', collection: 'Отчет' },
  { id: 'av-14', action: 'download', target: 'Пакет документов для аудита', date: '2026-01-30T14:25:00Z', collection: 'Пакет' },
  { id: 'av-15', action: 'view', target: 'Отчёт по рискам', date: '2026-01-28T10:50:00Z', collection: 'Отчет' },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuditEntry {
  id: string;
  action: 'view' | 'download';
  target: string;
  date: string;
  collection: string;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) + ', ' + d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function actionLabel(action: 'view' | 'download'): string {
  return action === 'view' ? 'Просмотр' : 'Скачивание';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PoAuditPage() {
  const { items, loading } = useCollection<any>('portalViews');

  const entries: AuditEntry[] = items.length > 0
    ? items.map((it: any) => ({
        id: it.id,
        action: it.action || 'view',
        target: it.target || it.name || it.title || 'Неизвестный объект',
        date: it.date || it.createdAt || it.ts || new Date().toISOString(),
        collection: it.collection || it.type || 'Документ',
      }))
    : DEMO_AUDIT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Журнал активности</h1>
        <p className="text-sm text-stone-500 mt-1">
          Ваши просмотры и скачивания за последние 30 дней
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5">
          <p className="text-sm text-stone-500">Всего действий</p>
          <p className="text-2xl font-semibold text-stone-800 mt-1">{entries.length}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5">
          <p className="text-sm text-stone-500">Просмотров</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            {entries.filter((e) => e.action === 'view').length}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5">
          <p className="text-sm text-stone-500">Скачиваний</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {entries.filter((e) => e.action === 'download').length}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5">
          <p className="text-sm text-stone-500">Последнее действие</p>
          <p className="text-sm font-medium text-stone-700 mt-2">
            {entries.length > 0 ? formatDateTime(entries[0].date) : '---'}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && items.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-12 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-500">Загрузка журнала...</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200/50">
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-4">
                  Действие
                </th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-4">
                  Объект
                </th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-4">
                  Дата
                </th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-4">
                  Тип
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-emerald-50/30 transition-colors"
                >
                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          entry.action === 'view'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {entry.action === 'view' ? <EyeIcon /> : <DownloadIcon />}
                      </span>
                      <span className="text-sm text-stone-700 font-medium">
                        {actionLabel(entry.action)}
                      </span>
                    </div>
                  </td>

                  {/* Target */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-800">{entry.target}</span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-500">{formatDateTime(entry.date)}</span>
                  </td>

                  {/* Collection / Type */}
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                      {entry.collection}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {entries.length === 0 && !loading && (
          <div className="py-16 text-center">
            <svg className="w-12 h-12 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-stone-400">Нет записей за последние 30 дней</p>
          </div>
        )}
      </div>
    </div>
  );
}
