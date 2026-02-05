'use client';

import { useTranslation } from '@/lib/i18n';

interface NtActionsBarProps {
  selectedCount: number;
  onMarkRead: () => void;
  onMarkAllRead: () => void;
  onArchive: () => void;
  onCreateRule: () => void;
}

export function NtActionsBar({
  selectedCount,
  onMarkRead,
  onMarkAllRead,
  onArchive,
  onCreateRule,
}: NtActionsBarProps) {
  const t = useTranslation();

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <>
            <button
              onClick={onMarkRead}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('markRead', { ru: 'Прочитано', en: 'Mark Read', uk: 'Прочитано' })}
            </button>

            <button
              onClick={onArchive}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              {t('archive', { ru: 'Архивировать', en: 'Archive', uk: 'Архівувати' })}
            </button>

            <span className="text-sm text-gray-500 ml-2">
              {t('selectedItems', {
                ru: `Выбрано: ${selectedCount}`,
                en: `${selectedCount} selected`,
                uk: `Обрано: ${selectedCount}`
              })}
            </span>
          </>
        ) : (
          <button
            onClick={onMarkAllRead}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('markAllRead', { ru: 'Прочитать все', en: 'Mark All Read', uk: 'Прочитати все' })}
          </button>
        )}
      </div>

      <button
        onClick={onCreateRule}
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t('createRule', { ru: 'Создать правило', en: 'Create Rule', uk: 'Створити правило' })}
      </button>
    </div>
  );
}
