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
  sourceAuthor?: string;
  createdAt: string;
}

interface IdNotesTableProps {
  notes: ResearchNote[];
  locale?: Locale;
  compact?: boolean;
  onSummarize?: (id: string) => void;
}

export function IdNotesTable({
  notes,
  locale = 'ru',
  compact = false,
  onSummarize,
}: IdNotesTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: compact ? undefined : 'numeric',
    });
  };

  const getSourceLabel = (key: string) => {
    const config = SOURCE_TYPES[key as keyof typeof SOURCE_TYPES];
    return config?.[locale] || config?.ru || key;
  };

  const sourceIcons: Record<string, React.ReactNode> = {
    article: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
      </svg>
    ),
    doc: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    call: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    meeting: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    report: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    screenshot: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {locale === 'ru' ? 'Нет заметок' : locale === 'uk' ? 'Немає нотаток' : 'No notes'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Название' : locale === 'uk' ? 'Назва' : 'Title'}
            </th>
            {!compact && (
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {locale === 'ru' ? 'Идея' : locale === 'uk' ? 'Ідея' : 'Idea'}
              </th>
            )}
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Тип' : locale === 'uk' ? 'Тип' : 'Type'}
            </th>
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Дата' : locale === 'uk' ? 'Дата' : 'Date'}
            </th>
            {onSummarize && (
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {notes.map((note) => (
            <tr
              key={note.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/m/ideas/note/${note.id}`)}
            >
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600">
                    {sourceIcons[note.sourceType] || sourceIcons.doc}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">{note.title}</div>
                    {note.sourceAuthor && (
                      <div className="text-xs text-gray-500">{note.sourceAuthor}</div>
                    )}
                  </div>
                </div>
              </td>
              {!compact && (
                <td className="py-3 px-3">
                  {note.linkedIdeaNumber ? (
                    <span className="font-mono text-xs text-emerald-600">
                      {note.linkedIdeaNumber}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              )}
              <td className="py-3 px-3">
                <span className="text-sm text-gray-600">
                  {getSourceLabel(note.sourceType)}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className="text-sm text-gray-500">
                  {formatDate(note.createdAt)}
                </span>
              </td>
              {onSummarize && (
                <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSummarize(note.id)}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    title={locale === 'ru' ? 'Резюмировать' : 'Summarize'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IdNotesTable;
