"use client";

import {
  Play,
  FileText,
  Lock,
  Send,
  Download,
  Plus,
  Calculator,
  RefreshCw
} from 'lucide-react';

interface FeActionsBarProps {
  context: 'dashboard' | 'contracts' | 'schedules' | 'runs' | 'invoices' | 'ar';
  onNewContract?: () => void;
  onNewSchedule?: () => void;
  onNewRun?: () => void;
  onBulkLock?: () => void;
  onBulkSend?: () => void;
  onExport?: () => void;
  onRecalculate?: () => void;
  selectedCount?: number;
}

export function FeActionsBar({
  context,
  onNewContract,
  onNewSchedule,
  onNewRun,
  onBulkLock,
  onBulkSend,
  onExport,
  onRecalculate,
  selectedCount = 0,
}: FeActionsBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Context-specific primary actions */}
      {context === 'dashboard' && (
        <>
          <button
            onClick={onNewRun}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            <Play className="w-4 h-4" />
            Новый расчёт
          </button>
          <button
            onClick={onNewContract}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Новый договор
          </button>
        </>
      )}

      {context === 'contracts' && (
        <button
          onClick={onNewContract}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый договор
        </button>
      )}

      {context === 'schedules' && (
        <button
          onClick={onNewSchedule}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый тариф
        </button>
      )}

      {context === 'runs' && (
        <>
          <button
            onClick={onNewRun}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Новый расчёт
          </button>
          {selectedCount > 0 && (
            <button
              onClick={onBulkLock}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-colors"
            >
              <Lock className="w-4 h-4" />
              Заблокировать ({selectedCount})
            </button>
          )}
        </>
      )}

      {context === 'invoices' && (
        <>
          {selectedCount > 0 && (
            <button
              onClick={onBulkSend}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
              Отправить ({selectedCount})
            </button>
          )}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </>
      )}

      {context === 'ar' && (
        <>
          <button
            onClick={onRecalculate}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить AR
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </>
      )}

      {/* Universal export for list views */}
      {(context === 'contracts' || context === 'schedules' || context === 'runs') && (
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Экспорт
        </button>
      )}
    </div>
  );
}
