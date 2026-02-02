"use client";

interface PcActionsBarProps {
  onAddFund?: () => void;
  onAddCommitment?: () => void;
  onCreateCall?: () => void;
  onCreateDistribution?: () => void;
  onAddValuation?: () => void;
  onImportExcel?: () => void;
  onConnectArch?: () => void;
}

export function PcActionsBar({
  onAddFund,
  onAddCommitment,
  onCreateCall,
  onCreateDistribution,
  onAddValuation,
  onImportExcel,
  onConnectArch
}: PcActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onAddFund && (
        <button
          onClick={onAddFund}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium text-sm hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
        >
          + Добавить фонд
        </button>
      )}
      {onAddCommitment && (
        <button
          onClick={onAddCommitment}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-colors"
        >
          + Обязательство
        </button>
      )}
      {onCreateCall && (
        <button
          onClick={onCreateCall}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-colors"
        >
          + Capital Call
        </button>
      )}
      {onCreateDistribution && (
        <button
          onClick={onCreateDistribution}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-colors"
        >
          + Распределение
        </button>
      )}
      {onAddValuation && (
        <button
          onClick={onAddValuation}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-colors"
        >
          + Оценка NAV
        </button>
      )}
      
      <div className="flex-1" />
      
      {onImportExcel && (
        <button
          onClick={onImportExcel}
          className="px-3 py-2 text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1"
        >
          <span>📊</span> Import Excel
        </button>
      )}
      {onConnectArch && (
        <button
          onClick={onConnectArch}
          className="px-3 py-2 text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1"
        >
          <span>🔌</span> Arch Connector
        </button>
      )}
    </div>
  );
}
