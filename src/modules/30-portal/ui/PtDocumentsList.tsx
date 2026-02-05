'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

const labels = {
  title: { ru: 'Документы', en: 'Documents', uk: 'Документи' },
  subtitle: { ru: 'Документы вашего household', en: 'Your household documents', uk: 'Документи вашого household' },
  category: { ru: 'Категория', en: 'Category', uk: 'Категорія' },
  date: { ru: 'Дата', en: 'Date', uk: 'Дата' },
  download: { ru: 'Скачать', en: 'Download', uk: 'Завантажити' },
  preview: { ru: 'Предпросмотр', en: 'Preview', uk: 'Попередній перегляд' },
  requestDoc: { ru: 'Запросить документ', en: 'Request Document', uk: 'Запросити документ' },
  noDocs: { ru: 'Нет доступных документов', en: 'No documents available', uk: 'Немає доступних документів' },
  allCategories: { ru: 'Все категории', en: 'All categories', uk: 'Всі категорії' },
  search: { ru: 'Поиск документов...', en: 'Search documents...', uk: 'Пошук документів...' },
};

const categoryLabels: Record<string, Record<string, string>> = {
  tax: { ru: 'Налоги', en: 'Tax', uk: 'Податки' },
  legal: { ru: 'Юридические', en: 'Legal', uk: 'Юридичні' },
  financial: { ru: 'Финансовые', en: 'Financial', uk: 'Фінансові' },
  compliance: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' },
  reports: { ru: 'Отчеты', en: 'Reports', uk: 'Звіти' },
  contracts: { ru: 'Контракты', en: 'Contracts', uk: 'Контракти' },
};

interface Document {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  fileSize?: number;
  mimeType?: string;
  clientVisible?: boolean;
}

export function PtDocumentsList() {
  const { locale } = useApp();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/collections/documents')
      .then(res => res.json())
      .then(data => {
        const clientDocs = (data || []).filter((d: Document) => d.clientVisible !== false);
        setDocuments(clientDocs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(documents.map(d => d.category))];

  const filteredDocs = documents.filter(d => {
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
          <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
        </div>
        <Link
          href="/portal/request/new?type=document_request"
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          {labels.requestDoc[locale]}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={labels.search[locale]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">{labels.allCategories[locale]}</option>
          {categories.map(c => (
            <option key={c} value={c}>{categoryLabels[c]?.[locale] || c}</option>
          ))}
        </select>
      </div>

      {/* Documents grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-5 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-800 text-sm truncate">{doc.name}</h3>
                  <div className="text-xs text-stone-500 mt-1">
                    {categoryLabels[doc.category]?.[locale] || doc.category}
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {new Date(doc.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors">
                  {labels.preview[locale]}
                </button>
                <button className="flex-1 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-200 transition-colors">
                  {labels.download[locale]}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-12 text-center">
          <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-stone-500">{labels.noDocs[locale]}</p>
        </div>
      )}
    </div>
  );
}
