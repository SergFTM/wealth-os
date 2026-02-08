'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';

const demoDocuments = [
  { id: 'doc-p-001', title: 'Квартальный отчёт Q4 2025', category: 'report', tags: ['квартальный', '2025'], publishedAt: '2026-01-15T10:00:00Z', publishedBy: 'УК Альфа Капитал', fileSize: 2450000, sharedToPortal: true },
  { id: 'doc-p-002', title: 'Выписка по счёту UBS — Январь 2026', category: 'statement', tags: ['выписка', 'UBS'], publishedAt: '2026-02-01T09:00:00Z', publishedBy: 'UBS Wealth Management', fileSize: 850000, sharedToPortal: true },
  { id: 'doc-p-003', title: 'Договор доверительного управления', category: 'contract', tags: ['договор', 'ДУ'], publishedAt: '2025-06-10T14:00:00Z', publishedBy: 'Юридический отдел', fileSize: 1200000, sharedToPortal: true },
  { id: 'doc-p-004', title: 'Налоговая справка 2025', category: 'tax', tags: ['налоги', '2025'], publishedAt: '2026-01-25T11:00:00Z', publishedBy: 'Налоговый консультант', fileSize: 450000, sharedToPortal: true },
  { id: 'doc-p-005', title: 'Страховой полис КАСКО', category: 'policy', tags: ['страховка', 'КАСКО'], publishedAt: '2025-11-20T16:00:00Z', publishedBy: 'СК Ингосстрах', fileSize: 780000, sharedToPortal: true },
  { id: 'doc-p-006', title: 'Протокол семейного совета — Декабрь 2025', category: 'minutes', tags: ['протокол', 'семейный совет'], publishedAt: '2025-12-18T12:00:00Z', publishedBy: 'Секретарь совета', fileSize: 320000, sharedToPortal: true },
];

const categoryLabels: Record<string, string> = {
  report: 'Отчёт', statement: 'Выписка', contract: 'Договор',
  tax: 'Налоги', policy: 'Полис', minutes: 'Протокол'
};

const categoryColors: Record<string, string> = {
  report: 'bg-blue-50 text-blue-700', statement: 'bg-emerald-50 text-emerald-700',
  contract: 'bg-purple-50 text-purple-700', tax: 'bg-amber-50 text-amber-700',
  policy: 'bg-teal-50 text-teal-700', minutes: 'bg-stone-100 text-stone-700'
};

export function PoDocumentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: docsData } = useCollection<any>('documents');
  const docs = docsData?.length ? docsData.filter((d: Record<string, unknown>) => d.sharedToPortal) : demoDocuments;

  const filtered = docs.filter((d: Record<string, unknown>) => {
    const matchSearch = !search || (d.title as string).toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU');
  const fmtSize = (b: number) => b > 1000000 ? `${(b / 1000000).toFixed(1)} МБ` : `${(b / 1000).toFixed(0)} КБ`;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Документы</h1>
      <p className="text-sm text-stone-500 mt-1 mb-6">Ваши документы и выписки</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 bg-white/80 border border-stone-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2 bg-white/80 border border-stone-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">Все категории</option>
          <option value="report">Отчёты</option>
          <option value="statement">Выписки</option>
          <option value="contract">Договоры</option>
          <option value="tax">Налоговые</option>
          <option value="policy">Полисы</option>
          <option value="minutes">Протоколы</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc: Record<string, unknown>) => (
          <button
            key={doc.id as string}
            onClick={() => router.push(`/portal/documents/${doc.id}`)}
            className="text-left bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5 hover:shadow-md transition-all hover:border-emerald-200"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[doc.category as string] || 'bg-stone-100 text-stone-600'}`}>
                {categoryLabels[doc.category as string] || String(doc.category)}
              </span>
              <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-stone-800 text-sm mb-2">{doc.title as string}</h3>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span>{fmt(doc.publishedAt as string)}</span>
              <span>{fmtSize(doc.fileSize as number)}</span>
            </div>
            {(doc.tags as string[])?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {(doc.tags as string[]).map((t: string) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded">{t}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
