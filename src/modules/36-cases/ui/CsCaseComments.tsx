'use client';

import { useCollection } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

interface Comment {
  id: string;
  caseId: string;
  authorSubjectType: string;
  authorId: string;
  authorName?: string | null;
  authorRole?: string | null;
  visibility: 'internal' | 'client';
  body: string;
  isSystemGenerated?: boolean;
  attachmentDocIdsJson?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CsCaseCommentsProps {
  caseId: string;
  locale?: string;
  onAddComment?: () => void;
}

export function CsCaseComments({ caseId, locale = 'ru', onAddComment }: CsCaseCommentsProps) {
  const t = useTranslation();

  const { items: allComments = [], loading } = useCollection<Comment>('caseComments');

  // Filter to this case and non-system comments
  const comments = allComments
    .filter(c => c.caseId === caseId && !c.isSystemGenerated)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Comment Button */}
      {onAddComment && (
        <div className="flex justify-end">
          <button
            onClick={onAddComment}
            className="
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
              bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('addComment', { ru: 'Добавить комментарий', en: 'Add Comment', uk: 'Додати коментар' })}
          </button>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {t('noComments', { ru: 'Нет комментариев', en: 'No comments', uk: 'Немає коментарів' })}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`
                p-4 rounded-lg border
                ${comment.visibility === 'internal'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-white border-gray-200'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                    {comment.authorName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {comment.authorName || t('unknown', { ru: 'Неизвестно', en: 'Unknown', uk: 'Невідомо' })}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {comment.authorRole && (
                        <span className="text-gray-400">{comment.authorRole}</span>
                      )}
                      <span>{new Date(comment.createdAt).toLocaleString(locale)}</span>
                    </div>
                  </div>
                </div>

                {comment.visibility === 'internal' && (
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {t('internal', { ru: 'Внутренний', en: 'Internal', uk: 'Внутрішній' })}
                  </span>
                )}
                {comment.visibility === 'client' && (
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {t('clientVisible', { ru: 'Видно клиенту', en: 'Client Visible', uk: 'Видно клієнту' })}
                  </span>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                {comment.body}
              </div>

              {comment.attachmentDocIdsJson && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">
                    {t('attachments', { ru: 'Вложения', en: 'Attachments', uk: 'Вкладення' })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(comment.attachmentDocIdsJson).map((docId: string) => (
                      <a
                        key={docId}
                        href={`/m/documents/item/${docId}`}
                        className="text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded"
                      >
                        {t('document', { ru: 'Документ', en: 'Document', uk: 'Документ' })}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
