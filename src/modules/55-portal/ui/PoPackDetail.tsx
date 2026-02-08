'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { PoSourceFooter } from './PoSourceFooter';

interface Props {
  packId: string;
}

interface PackItem {
  id: string;
  title: string;
  type: string;
  date: string;
}

const MOCK_PACK = {
  id: 'pack-001',
  title: 'Квартальный отчётный пакет Q4 2025',
  description:
    'Полный пакет отчётности за четвёртый квартал 2025 года. Включает консолидированную позицию, аналитику доходности, налоговый обзор и сопроводительные документы.',
  asOfDate: '2025-12-31',
  items: [
    { id: 'pi-1', title: 'Консолидированный отчёт по активам', type: 'PDF', date: '2026-01-15' },
    { id: 'pi-2', title: 'Аналитика доходности портфеля', type: 'XLSX', date: '2026-01-15' },
    { id: 'pi-3', title: 'Налоговый обзор за Q4', type: 'PDF', date: '2026-01-18' },
    { id: 'pi-4', title: 'Отчёт о движении денежных средств', type: 'PDF', date: '2026-01-18' },
    { id: 'pi-5', title: 'Сопроводительное письмо от RM', type: 'DOCX', date: '2026-01-20' },
  ] as PackItem[],
};

const typeColors: Record<string, string> = {
  PDF: 'bg-red-50 text-red-600',
  XLSX: 'bg-emerald-50 text-emerald-600',
  DOCX: 'bg-blue-50 text-blue-600',
};

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PoPackDetail({ packId }: Props) {
  const pack = { ...MOCK_PACK, id: packId };

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-stone-800">{pack.title}</h1>
            <p className="text-stone-500 mt-2 leading-relaxed">{pack.description}</p>
            <p className="text-sm text-stone-400 mt-3">
              По состоянию на: {formatDate(pack.asOfDate)}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Опубликован
          </span>
        </div>
      </div>

      {/* Items list */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-stone-800">
            Содержимое пакета
          </h2>
          <span className="text-sm text-stone-400">
            {pack.items.length} документов
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {pack.items.map((item: PackItem) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-stone-50/50 -mx-2 px-2 rounded-xl transition-colors"
            >
              {/* Type badge */}
              <span
                className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold ${
                  typeColors[item.type] || 'bg-stone-100 text-stone-500'
                }`}
              >
                {item.type}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 truncate">
                  {item.title}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {formatDate(item.date)}
                </p>
              </div>

              {/* Download icon */}
              <button className="shrink-0 p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-emerald-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Download all */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Скачать все документы
          </button>
        </div>

        <PoSourceFooter
          asOfDate={pack.asOfDate}
          sources={['WealthOS Reporting', 'Custodian Feed']}
        />
      </div>
    </div>
  );
}
