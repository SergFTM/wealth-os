'use client';

import { useRouter } from 'next/navigation';
import { WATCHLIST_TYPES } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface Watchlist {
  id: string;
  name: string;
  listType: string;
  ownerUserId: string;
  isShared?: boolean;
  alertsEnabled?: boolean;
  itemsCount?: number;
  createdAt: string;
}

interface IdWatchlistsTableProps {
  watchlists: Watchlist[];
  locale?: Locale;
  compact?: boolean;
}

export function IdWatchlistsTable({
  watchlists,
  locale = 'ru',
  compact = false,
}: IdWatchlistsTableProps) {
  const router = useRouter();

  const getTypeLabel = (key: string) => {
    const config = WATCHLIST_TYPES[key as keyof typeof WATCHLIST_TYPES];
    return config?.[locale] || config?.ru || key;
  };

  if (watchlists.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {locale === 'ru' ? 'Нет watchlists' : locale === 'uk' ? 'Немає watchlists' : 'No watchlists'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Название' : locale === 'uk' ? 'Назва' : 'Name'}
            </th>
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Тип' : locale === 'uk' ? 'Тип' : 'Type'}
            </th>
            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {locale === 'ru' ? 'Элементов' : locale === 'uk' ? 'Елементів' : 'Items'}
            </th>
            {!compact && (
              <>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ru' ? 'Доступ' : locale === 'uk' ? 'Доступ' : 'Access'}
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ru' ? 'Алерты' : locale === 'uk' ? 'Алерти' : 'Alerts'}
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {watchlists.map((wl) => (
            <tr
              key={wl.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/m/ideas/watchlist/${wl.id}`)}
            >
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">{wl.name}</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                  {getTypeLabel(wl.listType)}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className="text-sm font-medium text-gray-700">
                  {wl.itemsCount ?? 0}
                </span>
              </td>
              {!compact && (
                <>
                  <td className="py-3 px-3">
                    {wl.isShared ? (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {locale === 'ru' ? 'Общий' : 'Shared'}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        {locale === 'ru' ? 'Личный' : 'Private'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {wl.alertsEnabled ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                        </svg>
                        {locale === 'ru' ? 'Вкл' : 'On'}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IdWatchlistsTable;
