'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';

const demoPacks = [
  { id: 'pack-p-001', title: 'Годовой отчёт 2025', description: 'Полный годовой отчётный пакет: доходность, аллокация, налоги, трасты', itemsCount: 12, publishedAt: '2026-01-20T10:00:00Z', statusKey: 'published' },
  { id: 'pack-p-002', title: 'Квартальный пакет Q4 2025', description: 'Квартальный отчёт по всем портфелям и сущностям', itemsCount: 8, publishedAt: '2026-01-10T10:00:00Z', statusKey: 'published' },
  { id: 'pack-p-003', title: 'Налоговый пакет 2025', description: 'Налоговые справки, расчёты, gain/loss отчёты', itemsCount: 6, publishedAt: '2026-01-25T10:00:00Z', statusKey: 'published' },
  { id: 'pack-p-004', title: 'Trust & Estate обзор', description: 'Обзор трастовых структур и событий за 2025 год', itemsCount: 5, publishedAt: '2025-12-15T10:00:00Z', statusKey: 'published' },
  { id: 'pack-p-005', title: 'Благотворительность — Impact 2025', description: 'Отчёт о благотворительной деятельности и результатах', itemsCount: 4, publishedAt: '2026-01-30T10:00:00Z', statusKey: 'published' },
];

export function PoPacksPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packsData } = useCollection<any>('reportPacks');
  const packs = packsData?.length ? packsData.filter((p: Record<string, unknown>) => p.statusKey === 'published') : demoPacks;
  const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU');

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Отчётные пакеты</h1>
      <p className="text-sm text-stone-500 mt-1 mb-6">Пакеты, подготовленные для вас</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packs.map((pack: Record<string, unknown>) => (
          <button
            key={pack.id as string}
            onClick={() => router.push(`/portal/packs/${pack.id}`)}
            className="text-left bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 hover:shadow-md transition-all hover:border-emerald-200"
          >
            <div className="flex items-start justify-between mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs text-stone-400">{fmt(pack.publishedAt as string)}</span>
            </div>
            <h3 className="font-medium text-stone-800 mb-2">{pack.title as string}</h3>
            <p className="text-sm text-stone-500 mb-3">{pack.description as string}</p>
            <span className="text-xs text-emerald-600 font-medium">{pack.itemsCount as number} документов</span>
          </button>
        ))}
      </div>
    </div>
  );
}
