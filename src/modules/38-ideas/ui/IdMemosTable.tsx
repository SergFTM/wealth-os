'use client';

import { useRouter } from 'next/navigation';
import { MEMO_AUDIENCES } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface IdeaMemo {
  id: string;
  title: string;
  ideaId: string;
  ideaNumber?: string;
  audience: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
}

interface IdMemosTableProps {
  memos: IdeaMemo[];
  locale?: Locale;
  compact?: boolean;
}

export function IdMemosTable({
  memos,
  locale = 'ru',
  compact = false,
}: IdMemosTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getAudienceLabel = (key: string) => {
    const config = MEMO_AUDIENCES[key as keyof typeof MEMO_AUDIENCES];
    return config?.[locale] || config?.ru || key;
  };

  if (memos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {locale === 'ru' ? 'Нет меморандумов' : locale === 'uk' ? 'Немає меморандумів' : 'No memos'}
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
              {locale === 'ru' ? 'Статус' : locale === 'uk' ? 'Статус' : 'Status'}
            </th>
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Аудитория' : locale === 'uk' ? 'Аудиторія' : 'Audience'}
            </th>
            {!compact && (
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {locale === 'ru' ? 'Дата' : locale === 'uk' ? 'Дата' : 'Date'}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {memos.map((memo) => (
            <tr
              key={memo.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/m/ideas/memo/${memo.id}`)}
            >
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900 line-clamp-1">{memo.title}</span>
                </div>
              </td>
              {!compact && (
                <td className="py-3 px-3">
                  {memo.ideaNumber ? (
                    <span className="font-mono text-xs text-emerald-600">
                      {memo.ideaNumber}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              )}
              <td className="py-3 px-3">
                {memo.status === 'published' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {locale === 'ru' ? 'Опубликован' : 'Published'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {locale === 'ru' ? 'Черновик' : 'Draft'}
                  </span>
                )}
              </td>
              <td className="py-3 px-3">
                <span className={`text-xs ${memo.audience === 'client_safe' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {getAudienceLabel(memo.audience)}
                </span>
              </td>
              {!compact && (
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-500">
                    {formatDate(memo.publishedAt || memo.createdAt)}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IdMemosTable;
