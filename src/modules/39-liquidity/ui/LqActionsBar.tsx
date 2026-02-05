"use client";

import { Plus, Upload, GitBranch, Zap, Database, FileText } from 'lucide-react';

interface LqActionsBarProps {
  onCreateForecast: () => void;
  onAddCashFlow: () => void;
  onImportFlows: () => void;
  onCreateScenario: () => void;
  onRunStressTest: () => void;
  onGenerateDemo: () => void;
  onShowAudit?: () => void;
}

export function LqActionsBar({
  onCreateForecast,
  onAddCashFlow,
  onImportFlows,
  onCreateScenario,
  onRunStressTest,
  onGenerateDemo,
  onShowAudit,
}: LqActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onCreateForecast}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Создать прогноз</span>
      </button>

      <button
        onClick={onAddCashFlow}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Добавить поток</span>
      </button>

      <button
        onClick={onImportFlows}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm font-medium">Импорт</span>
      </button>

      <button
        onClick={onCreateScenario}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <GitBranch className="w-4 h-4" />
        <span className="text-sm font-medium">Сценарий</span>
      </button>

      <button
        onClick={onRunStressTest}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">Стресс-тест</span>
      </button>

      <button
        onClick={onGenerateDemo}
        className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
      >
        <Database className="w-4 h-4" />
        <span className="text-sm">Demo</span>
      </button>

      {onShowAudit && (
        <button
          onClick={onShowAudit}
          className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all ml-auto"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">Audit</span>
        </button>
      )}
    </div>
  );
}
