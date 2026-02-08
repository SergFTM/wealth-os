'use client';

import React from 'react';
import { PoSourceFooter } from './PoSourceFooter';
import { PoClientSafeBadge } from './PoClientSafeBadge';

interface Props {
  documentId: string;
}

const demoDoc = {
  id: 'doc-p-001',
  title: 'Квартальный отчёт Q4 2025',
  category: 'report',
  tags: ['квартальный', '2025', 'инвестиции'],
  publishedAt: '2026-01-15T10:00:00Z',
  publishedBy: 'УК Альфа Капитал',
  fileSize: 2450000,
  description: 'Полный квартальный отчёт о состоянии портфелей за Q4 2025 года. Включает анализ доходности, аллокации и рыночный обзор.',
};

const categoryLabels: Record<string, string> = {
  report: 'Отчёт', statement: 'Выписка', contract: 'Договор',
  tax: 'Налоги', policy: 'Полис', minutes: 'Протокол'
};

export function PoDocumentDetail({ documentId }: Props) {
  const doc = { ...demoDoc, id: documentId };
  const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  const fmtSize = (b: number) => b > 1000000 ? `${(b / 1000000).toFixed(1)} МБ` : `${(b / 1000).toFixed(0)} КБ`;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => window.history.back()} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Назад к документам
        </button>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-stone-800">{doc.title}</h1>
          <PoClientSafeBadge />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-xs text-stone-400 mb-1">Категория</p>
            <span className="text-sm font-medium text-stone-700">{categoryLabels[doc.category] || doc.category}</span>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Опубликован</p>
            <span className="text-sm text-stone-700">{fmt(doc.publishedAt)}</span>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Автор</p>
            <span className="text-sm text-stone-700">{doc.publishedBy}</span>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Размер</p>
            <span className="text-sm text-stone-700">{fmtSize(doc.fileSize)}</span>
          </div>
        </div>

        {doc.description && (
          <p className="text-sm text-stone-600 mb-4">{doc.description}</p>
        )}

        <div className="flex flex-wrap gap-1 mb-6">
          {doc.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">{t}</span>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Скачать
          </button>
          <button className="px-5 py-2.5 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Просмотреть
          </button>
        </div>
      </div>

      {/* Audit note */}
      <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-emerald-700 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Ваш просмотр документа записан в журнал аудита
        </div>
      </div>

      <PoSourceFooter
        asOfDate={doc.publishedAt}
        sources={[doc.publishedBy]}
      />
    </div>
  );
}
