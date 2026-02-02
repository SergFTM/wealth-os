"use client";

interface LqActionsBarProps {
  onAddAccount?: () => void;
  onAddMovement?: () => void;
  onAddObligation?: () => void;
  onAddForecast?: () => void;
  onExport?: () => void;
  onCreateTask?: () => void;
}

export function LqActionsBar({
  onAddAccount,
  onAddMovement,
  onAddObligation,
  onAddForecast,
  onExport,
  onCreateTask
}: LqActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50">
      <button
        onClick={onAddAccount}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
      >
        + Добавить счет
      </button>
      <button
        onClick={onAddMovement}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        + Движение
      </button>
      <button
        onClick={onAddObligation}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        + Обязательство
      </button>
      <button
        onClick={onAddForecast}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        + Прогноз
      </button>
      <div className="flex-1" />
      <button
        onClick={onExport}
        className="px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
      >
        Экспорт
      </button>
      <button
        onClick={onCreateTask}
        className="px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
      >
        Создать задачу
      </button>
    </div>
  );
}
