'use client';

import { useRouter } from 'next/navigation';
import { SOURCE_TYPES } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface ResearchNote {
  id: string;
  title: string;
  linkedIdeaId?: string;
  linkedIdeaNumber?: string;
  sourceType: string;
  sourceUrl?: string;
  sourceAuthor?: string;
  sourceDate?: string;
  bodyMd: string;
  summaryText?: string;
  tagsJson?: string[];
  attachmentDocIdsJson?: string[];
  createdAt: string;
  updatedAt: string;
}

interface IdNoteDetailProps {
  note: ResearchNote;
  locale?: Locale;
  onEdit?: () => void;
  onSummarize?: () => void;
  onLinkToIdea?: () => void;
}

export function IdNoteDetail({
  note,
  locale = 'ru',
  onEdit,
  onSummarize,
  onLinkToIdea,
}: IdNoteDetailProps) {
  const router = useRouter();

  const getSourceLabel = (key: string) => {
    const config = SOURCE_TYPES[key as keyof typeof SOURCE_TYPES];
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                {getSourceLabel(note.sourceType)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
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
            {onSummarize && (
              <button
                onClick={onSummarize}
                className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {locale === 'ru' ? 'Резюмировать' : 'Summarize'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm">
          {note.sourceAuthor && (
            <div>
              <span className="text-gray-500">{locale === 'ru' ? 'Автор:' : 'Author:'}</span>
              <span className="ml-2 text-gray-900">{note.sourceAuthor}</span>
            </div>
          )}
          {note.sourceDate && (
            <div>
              <span className="text-gray-500">{locale === 'ru' ? 'Дата источника:' : 'Source Date:'}</span>
              <span className="ml-2 text-gray-900">{formatDate(note.sourceDate)}</span>
            </div>
          )}
          {note.sourceUrl && (
            <div>
              <a
                href={note.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {locale === 'ru' ? 'Источник' : 'Source'}
              </a>
            </div>
          )}
        </div>

        {/* Linked Idea */}
        {note.linkedIdeaId && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-xs text-emerald-600 mb-1">
              {locale === 'ru' ? 'Связано с идеей' : 'Linked to idea'}
            </div>
            <button
              onClick={() => router.push(`/m/ideas/idea/${note.linkedIdeaId}`)}
              className="font-mono text-sm text-emerald-700 hover:text-emerald-800"
            >
              {note.linkedIdeaNumber || note.linkedIdeaId} →
            </button>
          </div>
        )}

        {/* Tags */}
        {note.tagsJson && note.tagsJson.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tagsJson.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary (if available) */}
      {note.summaryText && (
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h2 className="font-semibold text-purple-900">
              {locale === 'ru' ? 'AI Резюме' : 'AI Summary'}
            </h2>
          </div>
          <p className="text-purple-800">{note.summaryText}</p>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          {locale === 'ru' ? 'Содержание' : 'Content'}
        </h2>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">
            {note.bodyMd}
          </div>
        </div>
      </div>

      {/* Attachments */}
      {note.attachmentDocIdsJson && note.attachmentDocIdsJson.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {locale === 'ru' ? 'Вложения' : 'Attachments'}
          </h2>
          <div className="space-y-2">
            {note.attachmentDocIdsJson.map((docId, i) => (
              <button
                key={i}
                onClick={() => router.push(`/m/documents/item/${docId}`)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
              >
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-900">{docId}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {!note.linkedIdeaId && onLinkToIdea && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <button
            onClick={onLinkToIdea}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + {locale === 'ru' ? 'Связать с идеей' : 'Link to Idea'}
          </button>
        </div>
      )}
    </div>
  );
}

export default IdNoteDetail;
