'use client';

import { useTranslation } from '@/lib/i18n';

interface CsActionsBarProps {
  selectedCount?: number;
  onCreateCase: () => void;
  onQuickTriage?: () => void;
  onGenerateDemo?: () => void;
  onSlaReport?: () => void;
  onBulkAssign?: () => void;
  onBulkStatusChange?: () => void;
}

export function CsActionsBar({
  selectedCount = 0,
  onCreateCase,
  onQuickTriage,
  onGenerateDemo,
  onSlaReport,
  onBulkAssign,
  onBulkStatusChange,
}: CsActionsBarProps) {
  const t = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
      {/* Primary Actions */}
      <button
        onClick={onCreateCase}
        className="
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
          bg-gradient-to-r from-emerald-600 to-teal-600 text-white
          rounded-lg hover:from-emerald-700 hover:to-teal-700
          transition-all shadow-sm hover:shadow-md
        "
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t('createCase', { ru: 'Создать кейс', en: 'Create Case', uk: 'Створити кейс' })}
      </button>

      {onQuickTriage && (
        <button
          onClick={onQuickTriage}
          className="
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
            bg-white text-gray-700 border border-gray-300
            rounded-lg hover:bg-gray-50 transition-all
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {t('quickTriage', { ru: 'Быстрый triage', en: 'Quick Triage', uk: 'Швидкий triage' })}
        </button>
      )}

      {onGenerateDemo && (
        <button
          onClick={onGenerateDemo}
          className="
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
            bg-white text-gray-700 border border-gray-300
            rounded-lg hover:bg-gray-50 transition-all
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          {t('generateDemo', { ru: 'Demo кейсы', en: 'Generate Demo', uk: 'Demo кейси' })}
        </button>
      )}

      {onSlaReport && (
        <button
          onClick={onSlaReport}
          className="
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
            text-gray-600 hover:text-gray-900 transition-colors
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t('slaReport', { ru: 'Отчет SLA', en: 'SLA Report', uk: 'Звіт SLA' })}
        </button>
      )}

      {/* Bulk Actions (when items selected) */}
      {selectedCount > 0 && (
        <>
          <div className="h-6 w-px bg-gray-300 mx-2" />

          <span className="text-sm text-gray-500">
            {t('selected', {
              ru: `Выбрано: ${selectedCount}`,
              en: `Selected: ${selectedCount}`,
              uk: `Вибрано: ${selectedCount}`,
            })}
          </span>

          {onBulkAssign && (
            <button
              onClick={onBulkAssign}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                bg-blue-50 text-blue-700 border border-blue-200
                rounded-lg hover:bg-blue-100 transition-all
              "
            >
              {t('assign', { ru: 'Назначить', en: 'Assign', uk: 'Призначити' })}
            </button>
          )}

          {onBulkStatusChange && (
            <button
              onClick={onBulkStatusChange}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                bg-purple-50 text-purple-700 border border-purple-200
                rounded-lg hover:bg-purple-100 transition-all
              "
            >
              {t('changeStatus', { ru: 'Изменить статус', en: 'Change Status', uk: 'Змінити статус' })}
            </button>
          )}
        </>
      )}
    </div>
  );
}
