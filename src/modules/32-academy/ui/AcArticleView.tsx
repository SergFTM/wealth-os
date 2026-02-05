'use client';

import { useApp } from '@/lib/store';
import { AcStatusPill } from './AcStatusPill';
import { AcTagChips } from './AcTagChips';
import { renderContent, getReadingTime } from '../engine/contentRenderer';

interface Article {
  id: string;
  titleRu: string;
  titleEn?: string;
  bodyRu: string;
  bodyEn?: string;
  tagsJson?: string[];
  audience: string;
  status: string;
  relatedModuleKeysJson?: string[];
  viewCount?: number;
  updatedAt: string;
}

interface AcArticleViewProps {
  article: Article;
  onPublish?: () => void;
  onEdit?: () => void;
}

export function AcArticleView({ article, onPublish, onEdit }: AcArticleViewProps) {
  const { locale, clientSafe } = useApp();

  const title = locale === 'ru' ? article.titleRu : article.titleEn || article.titleRu;
  const body = locale === 'ru' ? article.bodyRu : article.bodyEn || article.bodyRu;
  const readingTime = getReadingTime(body);
  const renderedContent = renderContent(body, { locale, clientSafe });

  const labels = {
    readingTime: { ru: 'мин. чтения', en: 'min read', uk: 'хв. читання' },
    views: { ru: 'просмотров', en: 'views', uk: 'переглядів' },
    updated: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' },
    relatedModules: { ru: 'Связанные модули', en: 'Related Modules', uk: "Пов'язані модулі" },
    edit: { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' },
    publish: { ru: 'Опубликовать', en: 'Publish', uk: 'Опублікувати' },
    clientSafeNote: { ru: 'Доступно клиентам', en: 'Client accessible', uk: 'Доступно клієнтам' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
              <span>{readingTime} {labels.readingTime[locale]}</span>
              <span>•</span>
              <span>{article.viewCount || 0} {labels.views[locale]}</span>
              <span>•</span>
              <span>{labels.updated[locale]}: {new Date(article.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AcStatusPill status={article.status} />
            <AcStatusPill status={article.audience} />
          </div>
        </div>

        {/* Tags */}
        {article.tagsJson && article.tagsJson.length > 0 && (
          <div className="mt-4">
            <AcTagChips tags={article.tagsJson} maxVisible={10} size="md" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200/50">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              {labels.edit[locale]}
            </button>
          )}
          {article.status === 'draft' && onPublish && (
            <button
              onClick={onPublish}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              {labels.publish[locale]}
            </button>
          )}
        </div>
      </div>

      {/* Client-safe indicator */}
      {(article.audience === 'client' || article.audience === 'both') && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm text-blue-700">{labels.clientSafeNote[locale]}</span>
        </div>
      )}

      {/* Content */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div
          className="prose prose-stone prose-emerald max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>

      {/* Related Modules */}
      {article.relatedModuleKeysJson && article.relatedModuleKeysJson.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <h3 className="font-semibold text-stone-800 mb-3">{labels.relatedModules[locale]}</h3>
          <div className="flex flex-wrap gap-2">
            {article.relatedModuleKeysJson.map((moduleKey) => (
              <a
                key={moduleKey}
                href={`/m/${moduleKey}`}
                className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                → {moduleKey}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
