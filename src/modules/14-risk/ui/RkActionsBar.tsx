"use client";

import { PlayCircle, Download, RefreshCw, Settings, Calendar } from 'lucide-react';

interface RkActionsBarProps {
  onRunStressTests?: () => void;
  onExportReport?: () => void;
  onRefreshMetrics?: () => void;
  onSettings?: () => void;
  onScheduleReview?: () => void;
  isLoading?: boolean;
}

export function RkActionsBar({
  onRunStressTests,
  onExportReport,
  onRefreshMetrics,
  onSettings,
  onScheduleReview,
  isLoading
}: RkActionsBarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
      <div className="flex items-center gap-2">
        {onRunStressTests && (
          <button
            onClick={onRunStressTests}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            Запустить стресс-тест
          </button>
        )}
        {onRefreshMetrics && (
          <button
            onClick={onRefreshMetrics}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50 ${
              isLoading ? 'animate-pulse' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить метрики
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onScheduleReview && (
          <button
            onClick={onScheduleReview}
            className="inline-flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Запланировать обзор</span>
          </button>
        )}
        {onExportReport && (
          <button
            onClick={onExportReport}
            className="inline-flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Экспорт</span>
          </button>
        )}
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
