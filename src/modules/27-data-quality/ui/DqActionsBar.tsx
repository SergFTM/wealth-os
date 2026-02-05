'use client';

/**
 * Data Quality Actions Bar Component
 */

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface DqActionsBarProps {
  onRunChecks: () => void;
  onCreateRule: () => void;
  onGenerateDemo: () => void;
  onExportReport: () => void;
  loading?: boolean;
  lang?: 'ru' | 'en' | 'uk';
}

export function DqActionsBar({
  onRunChecks,
  onCreateRule,
  onGenerateDemo,
  onExportReport,
  loading = false,
  lang: propLang,
}: DqActionsBarProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    runChecks: { ru: 'Запустить проверки', en: 'Run Checks', uk: 'Запустити перевірки' },
    createRule: { ru: 'Создать правило', en: 'Create Rule', uk: 'Створити правило' },
    generateDemo: { ru: 'Demo ошибки', en: 'Generate Demo', uk: 'Demo помилки' },
    exportReport: { ru: 'Экспорт отчёта', en: 'Export Report', uk: 'Експорт звіту' },
    running: { ru: 'Выполняется...', en: 'Running...', uk: 'Виконується...' },
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onRunChecks}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span>
            {labels.running[lang]}
          </>
        ) : (
          <>
            <span>▶</span>
            {labels.runChecks[lang]}
          </>
        )}
      </button>

      <button
        onClick={onCreateRule}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
      >
        <span>+</span>
        {labels.createRule[lang]}
      </button>

      <button
        onClick={onGenerateDemo}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
      >
        <span>🎲</span>
        {labels.generateDemo[lang]}
      </button>

      <button
        onClick={onExportReport}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
      >
        <span>📄</span>
        {labels.exportReport[lang]}
      </button>
    </div>
  );
}
