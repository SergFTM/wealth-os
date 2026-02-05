"use client";

interface ObActionsBarProps {
  onCreateCase: () => void;
  onCreateIntake: () => void;
  onCreateScreening: () => void;
  onCalcRisk: () => void;
  onSubmitApproval: () => void;
  onCreateEvidence: () => void;
}

export function ObActionsBar({
  onCreateCase,
  onCreateIntake,
  onCreateScreening,
  onCalcRisk,
  onSubmitApproval,
  onCreateEvidence,
}: ObActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onCreateCase}
        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
      >
        Создать кейс
      </button>
      <button
        onClick={onCreateIntake}
        className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
      >
        Создать intake
      </button>
      <button
        onClick={onCreateScreening}
        className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
      >
        Скрининг
      </button>
      <button
        onClick={onCalcRisk}
        className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        Рассчитать риск
      </button>
      <button
        onClick={onSubmitApproval}
        className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        На согласование
      </button>
      <button
        onClick={onCreateEvidence}
        className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        Evidence pack
      </button>
    </div>
  );
}
