"use client";

import { useApp } from "@/lib/store";

interface PfActionsBarProps {
  onInitDemo: () => void;
  onResetDemo: () => void;
  onExportData: () => void;
  demoInitialized: boolean;
}

export function PfActionsBar({ onInitDemo, onResetDemo, onExportData, demoInitialized }: PfActionsBarProps) {
  const { locale } = useApp();

  const t = {
    init: locale === "ru" ? "Инициализировать демо" : "Initialize Demo",
    reset: locale === "ru" ? "Сбросить демо" : "Reset Demo",
    export: locale === "ru" ? "Экспорт данных" : "Export Data",
  };

  return (
    <div className="flex items-center gap-3">
      {!demoInitialized ? (
        <button
          onClick={onInitDemo}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t.init}
        </button>
      ) : (
        <button
          onClick={onResetDemo}
          className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-medium hover:bg-rose-100 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.reset}
        </button>
      )}

      <button
        onClick={onExportData}
        className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg font-medium hover:bg-stone-200 transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {t.export}
      </button>
    </div>
  );
}
