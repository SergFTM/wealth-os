'use client';

import { useRouter } from 'next/navigation';
import { IdStatusPill } from './IdStatusPill';
import { IdRiskTag } from './IdRiskTag';
import { ASSET_CLASSES, TIME_HORIZONS } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface Idea {
  id: string;
  ideaNumber: string;
  title: string;
  assetClass: string;
  horizonKey: string;
  status: string;
  riskLevel: string;
  ownerUserId: string;
  updatedAt: string;
}

interface IdIdeasTableProps {
  ideas: Idea[];
  locale?: Locale;
  compact?: boolean;
  onGenerateMemo?: (id: string) => void;
  onLinkCommittee?: (id: string) => void;
}

export function IdIdeasTable({
  ideas,
  locale = 'ru',
  compact = false,
  onGenerateMemo,
  onLinkCommittee,
}: IdIdeasTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getAssetLabel = (key: string) => {
    const config = ASSET_CLASSES[key as keyof typeof ASSET_CLASSES];
    return config?.[locale] || config?.ru || key;
  };

  const getHorizonLabel = (key: string) => {
    const config = TIME_HORIZONS[key as keyof typeof TIME_HORIZONS];
    return config?.[locale] || config?.ru || key;
  };

  if (ideas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {locale === 'ru' ? 'Нет идей' : locale === 'uk' ? 'Немає ідей' : 'No ideas'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? '№ Идеи' : locale === 'uk' ? '№ Ідеї' : 'Idea #'}
            </th>
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Название' : locale === 'uk' ? 'Назва' : 'Title'}
            </th>
            {!compact && (
              <>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ru' ? 'Актив' : locale === 'uk' ? 'Актив' : 'Asset'}
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ru' ? 'Горизонт' : locale === 'uk' ? 'Горизонт' : 'Horizon'}
                </th>
              </>
            )}
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Статус' : locale === 'uk' ? 'Статус' : 'Status'}
            </th>
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Риск' : locale === 'uk' ? 'Ризик' : 'Risk'}
            </th>
            {!compact && (
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {locale === 'ru' ? 'Обновлено' : locale === 'uk' ? 'Оновлено' : 'Updated'}
              </th>
            )}
            {(onGenerateMemo || onLinkCommittee) && (
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {locale === 'ru' ? 'Действия' : locale === 'uk' ? 'Дії' : 'Actions'}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ideas.map((idea) => (
            <tr
              key={idea.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/m/ideas/idea/${idea.id}`)}
            >
              <td className="py-3 px-3">
                <span className="font-mono text-sm text-emerald-600 font-medium">
                  {idea.ideaNumber}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className="font-medium text-gray-900 line-clamp-1">
                  {idea.title}
                </span>
              </td>
              {!compact && (
                <>
                  <td className="py-3 px-3">
                    <span className="text-sm text-gray-600">
                      {getAssetLabel(idea.assetClass)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-gray-600">
                      {getHorizonLabel(idea.horizonKey)}
                    </span>
                  </td>
                </>
              )}
              <td className="py-3 px-3">
                <IdStatusPill status={idea.status} locale={locale} size="sm" />
              </td>
              <td className="py-3 px-3">
                <IdRiskTag level={idea.riskLevel} locale={locale} showIcon={false} />
              </td>
              {!compact && (
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-500">
                    {formatDate(idea.updatedAt)}
                  </span>
                </td>
              )}
              {(onGenerateMemo || onLinkCommittee) && (
                <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {onGenerateMemo && (
                      <button
                        onClick={() => onGenerateMemo(idea.id)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title={locale === 'ru' ? 'Сгенерировать мемо' : 'Generate memo'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                    {onLinkCommittee && (
                      <button
                        onClick={() => onLinkCommittee(idea.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={locale === 'ru' ? 'Привязать к комитету' : 'Link to committee'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IdIdeasTable;
