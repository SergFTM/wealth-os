'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AcTagChips } from './AcTagChips';
import { AcStatusPill } from './AcStatusPill';
import seedData from '../seed.json';
import { buildSearchIndex, searchDocuments, SearchDocument } from '../engine/searchIndex';

export function AcSearchView() {
  const router = useRouter();
  const { locale, clientSafe } = useApp();
  const [query, setQuery] = useState('');

  const labels = {
    title: { ru: 'Поиск по базе знаний', en: 'Search Knowledge Base', uk: 'Пошук по базі знань' },
    placeholder: { ru: 'Введите запрос...', en: 'Enter query...', uk: 'Введіть запит...' },
    results: { ru: 'Результаты', en: 'Results', uk: 'Результати' },
    noResults: { ru: 'Ничего не найдено', en: 'No results found', uk: 'Нічого не знайдено' },
    articles: { ru: 'Статьи', en: 'Articles', uk: 'Статті' },
    lessons: { ru: 'Уроки', en: 'Lessons', uk: 'Уроки' },
    faq: { ru: 'FAQ', en: 'FAQ', uk: 'FAQ' },
    policies: { ru: 'Политики', en: 'Policies', uk: 'Політики' },
  };

  // Build search documents from seed data
  const documents: SearchDocument[] = useMemo(() => {
    const docs: SearchDocument[] = [];

    // Articles
    seedData.kbArticles.forEach(art => {
      const a = art as unknown as Record<string, unknown>;
      docs.push({
        id: art.id,
        type: 'article',
        titleRu: art.titleRu,
        titleEn: art.titleEn,
        bodyRu: art.bodyRu,
        bodyEn: a.bodyEn as string,
        tagsJson: art.tagsJson,
        audience: art.audience,
      });
    });

    // Lessons
    seedData.kbLessons.forEach(les => {
      const l = les as unknown as Record<string, unknown>;
      docs.push({
        id: les.id,
        type: 'lesson',
        titleRu: les.titleRu,
        titleEn: les.titleEn,
        bodyRu: les.bodyRu,
        bodyEn: l.bodyEn as string,
        audience: les.audience,
      });
    });

    // FAQ
    seedData.kbFaq.forEach(faq => {
      const f = faq as unknown as Record<string, unknown>;
      docs.push({
        id: faq.id,
        type: 'faq',
        titleRu: faq.questionRu,
        titleEn: f.questionEn as string,
        bodyRu: faq.answerRu,
        bodyEn: f.answerEn as string,
        tagsJson: faq.tagsJson,
        audience: faq.audience,
      });
    });

    // Policies
    seedData.kbPolicies.forEach(pol => {
      const p = pol as unknown as Record<string, unknown>;
      docs.push({
        id: pol.id,
        type: 'policy',
        titleRu: pol.titleRu,
        titleEn: p.titleEn as string,
        bodyRu: pol.bodyRu,
        bodyEn: p.bodyEn as string,
        audience: pol.audience,
      });
    });

    return docs;
  }, []);

  const index = useMemo(() => buildSearchIndex(documents), [documents]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchDocuments(query, documents, index, {
      audience: clientSafe ? 'client' : undefined,
      limit: 20,
    });
  }, [query, documents, index, clientSafe]);

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Record<string, typeof results> = {
      article: [],
      lesson: [],
      faq: [],
      policy: [],
    };
    results.forEach(r => {
      if (groups[r.type]) groups[r.type].push(r);
    });
    return groups;
  }, [results]);

  const getTypeLabel = (type: string) => {
    const map: Record<string, keyof typeof labels> = {
      article: 'articles',
      lesson: 'lessons',
      faq: 'faq',
      policy: 'policies',
    };
    return labels[map[type] || 'articles'][locale];
  };

  const getTypeRoute = (type: string, id: string) => {
    const routes: Record<string, string> = {
      article: `/m/academy/article/${id}`,
      lesson: `/m/academy/lesson/${id}`,
      faq: `/m/academy/list?tab=faq`,
      policy: `/m/academy/list?tab=policies`,
    };
    return routes[type] || `/m/academy/list`;
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">{labels.title[locale]}</h2>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.placeholder[locale]}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Results */}
      {query.trim() && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-8 text-center">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-stone-500">{labels.noResults[locale]}</p>
            </div>
          ) : (
            Object.entries(grouped).map(([type, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={type} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
                  <h3 className="font-semibold text-stone-800 mb-4">{getTypeLabel(type)} ({items.length})</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(getTypeRoute(type, item.id))}
                        className="p-4 bg-stone-50 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-stone-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-stone-500 line-clamp-2">{item.excerpt}</p>
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <AcStatusPill status={item.audience} size="sm" />
                            <span className="text-xs text-stone-400">{Math.round(item.score * 100)}%</span>
                          </div>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="mt-2">
                            <AcTagChips tags={item.tags} maxVisible={3} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
