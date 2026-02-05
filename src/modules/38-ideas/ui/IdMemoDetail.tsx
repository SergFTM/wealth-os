'use client';

import { useRouter } from 'next/navigation';
import { MEMO_AUDIENCES } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface IdeaMemo {
  id: string;
  ideaId: string;
  ideaNumber?: string;
  title: string;
  bodyMd: string;
  executiveSummary?: string;
  thesisSection?: string;
  risksSection?: string;
  ipsFitSection?: string;
  recommendationSection?: string;
  sourcesSection?: string;
  audience: string;
  status: string;
  publishedAt?: string;
  publishedTo?: { type: string; id: string }[];
  aiMetaJson?: {
    confidence?: number;
    assumptions?: string[];
    sources?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface IdMemoDetailProps {
  memo: IdeaMemo;
  locale?: Locale;
  onEdit?: () => void;
  onPublish?: () => void;
  onPublishToCommittee?: () => void;
  onPublishToReport?: () => void;
}

export function IdMemoDetail({
  memo,
  locale = 'ru',
  onEdit,
  onPublish,
  onPublishToCommittee,
  onPublishToReport,
}: IdMemoDetailProps) {
  const router = useRouter();

  const getAudienceLabel = (key: string) => {
    const config = MEMO_AUDIENCES[key as keyof typeof MEMO_AUDIENCES];
    return config?.[locale] || config?.ru || key;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US',
      { day: '2-digit', month: 'long', year: 'numeric' }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {memo.status === 'published' ? (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {locale === 'ru' ? 'Опубликован' : 'Published'}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  {locale === 'ru' ? 'Черновик' : 'Draft'}
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                memo.audience === 'client_safe'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {getAudienceLabel(memo.audience)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{memo.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {locale === 'ru' ? 'Редактировать' : 'Edit'}
              </button>
            )}
            {memo.status === 'draft' && onPublish && (
              <button
                onClick={onPublish}
                className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors"
              >
                {locale === 'ru' ? 'Опубликовать' : 'Publish'}
              </button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-500">{locale === 'ru' ? 'Идея:' : 'Idea:'}</span>
            <button
              onClick={() => router.push(`/m/ideas/idea/${memo.ideaId}`)}
              className="ml-2 font-mono text-emerald-600 hover:text-emerald-700"
            >
              {memo.ideaNumber || memo.ideaId}
            </button>
          </div>
          {memo.publishedAt && (
            <div>
              <span className="text-gray-500">{locale === 'ru' ? 'Опубликован:' : 'Published:'}</span>
              <span className="ml-2 text-gray-900">{formatDate(memo.publishedAt)}</span>
            </div>
          )}
        </div>

        {/* AI Meta */}
        {memo.aiMetaJson && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-xs font-medium text-purple-700">AI Generated</span>
              {memo.aiMetaJson.confidence && (
                <span className="text-xs text-purple-600">
                  • {locale === 'ru' ? 'Уверенность' : 'Confidence'}: {memo.aiMetaJson.confidence}%
                </span>
              )}
            </div>
            {memo.aiMetaJson.sources && memo.aiMetaJson.sources.length > 0 && (
              <div className="text-xs text-purple-700">
                {locale === 'ru' ? 'Источники' : 'Sources'}: {memo.aiMetaJson.sources.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Content - Premium Reader Style */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Document Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-gray-900">{memo.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {memo.ideaNumber} • {formatDate(memo.updatedAt)}
          </p>
        </div>

        {/* Document Body */}
        <div className="px-8 py-6 prose prose-emerald max-w-none">
          {/* Executive Summary */}
          {memo.executiveSummary && (
            <div className="mb-8 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
              <h3 className="text-sm font-semibold text-emerald-800 mb-2">
                {locale === 'ru' ? 'Резюме' : 'Executive Summary'}
              </h3>
              <p className="text-emerald-900">{memo.executiveSummary}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {memo.bodyMd}
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="px-8 py-4 bg-amber-50 border-t border-amber-100">
          <p className="text-xs text-amber-700">
            <strong>{locale === 'ru' ? 'Дисклеймер:' : 'Disclaimer:'}</strong>{' '}
            {locale === 'ru'
              ? 'Данный документ носит информационный характер. Не является индивидуальной инвестиционной рекомендацией.'
              : 'This document is for informational purposes only. This does not constitute individual investment advice.'
            }
          </p>
        </div>
      </div>

      {/* Publish Actions */}
      {memo.status === 'published' && (onPublishToCommittee || onPublishToReport) && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {locale === 'ru' ? 'Публикация в...' : 'Publish to...'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {onPublishToCommittee && (
              <button
                onClick={onPublishToCommittee}
                className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {locale === 'ru' ? 'Пакет комитета' : 'Committee Pack'}
              </button>
            )}
            {onPublishToReport && (
              <button
                onClick={onPublishToReport}
                className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {locale === 'ru' ? 'Отчёт' : 'Report Pack'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IdMemoDetail;
