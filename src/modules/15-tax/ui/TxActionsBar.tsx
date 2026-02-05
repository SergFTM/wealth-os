"use client";

import { Plus, Download, Upload, RefreshCw, Filter, Calendar, FileText, Send, Settings } from 'lucide-react';

interface TxActionsBarProps {
  onCreateLot?: () => void;
  onCreatePack?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  onCalendar?: () => void;
  onReports?: () => void;
  onSettings?: () => void;
  activeTab?: string;
  isLoading?: boolean;
}

export function TxActionsBar({
  onCreateLot,
  onCreatePack,
  onExport,
  onImport,
  onRefresh,
  onFilter,
  onCalendar,
  onReports,
  onSettings,
  activeTab,
  isLoading = false,
}: TxActionsBarProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        {/* Primary Actions based on context */}
        {activeTab === 'lots' && onCreateLot && (
          <button
            onClick={onCreateLot}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить лот
          </button>
        )}

        {activeTab === 'advisorPacks' && onCreatePack && (
          <button
            onClick={onCreatePack}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Создать пакет
          </button>
        )}

        {/* Import/Export */}
        {onImport && (
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Импорт
          </button>
        )}

        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Calendar View */}
        {onCalendar && (
          <button
            onClick={onCalendar}
            className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title="Календарь дедлайнов"
          >
            <Calendar className="w-4 h-4" />
          </button>
        )}

        {/* Reports */}
        {onReports && (
          <button
            onClick={onReports}
            className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title="Налоговые отчёты"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}

        {/* Filter */}
        {onFilter && (
          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title="Фильтры"
          >
            <Filter className="w-4 h-4" />
          </button>
        )}

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors disabled:opacity-50"
            title="Обновить"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* Settings */}
        {onSettings && (
          <button
            onClick={onSettings}
            className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title="Настройки модуля"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
