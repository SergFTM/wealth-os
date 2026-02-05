'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AcStatusPill } from './AcStatusPill';
import { AcTagChips } from './AcTagChips';

interface Article {
  id: string;
  titleRu: string;
  titleEn?: string;
  tagsJson?: string[];
  audience: string;
  status: string;
  viewCount?: number;
  updatedAt: string;
}

interface AcArticlesTableProps {
  articles: Article[];
  onPublish?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function AcArticlesTable({ articles, onPublish, onDuplicate }: AcArticlesTableProps) {
  const router = useRouter();
  const { locale } = useApp();

  const labels = {
    title: { ru: 'Название', en: 'Title', uk: 'Назва' },
    tags: { ru: 'Теги', en: 'Tags', uk: 'Теги' },
    audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    views: { ru: 'Просмотры', en: 'Views', uk: 'Перегляди' },
    updated: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    publish: { ru: 'Опубликовать', en: 'Publish', uk: 'Опублікувати' },
    duplicate: { ru: 'Дублировать', en: 'Duplicate', uk: 'Дублювати' },
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.title[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.tags[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.audience[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.status[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.views[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.updated[locale]}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.actions[locale]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/m/academy/article/${article.id}`)}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-800">
                    {locale === 'ru' ? article.titleRu : article.titleEn || article.titleRu}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AcTagChips tags={article.tagsJson || []} maxVisible={2} />
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={article.audience} />
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={article.status} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {article.viewCount?.toLocaleString() || 0}
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">
                  {new Date(article.updatedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                      onClick={() => router.push(`/m/academy/article/${article.id}`)}
                    >
                      {labels.open[locale]}
                    </button>
                    {article.status === 'draft' && onPublish && (
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => onPublish(article.id)}
                      >
                        {labels.publish[locale]}
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        className="text-xs text-stone-500 hover:text-stone-700"
                        onClick={() => onDuplicate(article.id)}
                      >
                        {labels.duplicate[locale]}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
