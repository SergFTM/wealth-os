"use client";

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface CashScenario {
  id: string;
  name: string;
  scenarioType: 'base' | 'conservative' | 'aggressive' | 'custom';
  description?: string;
  adjustmentsJson?: {
    inflowHaircut?: number;
    outflowIncrease?: number;
    distributionDelayDays?: number;
    capitalCallShiftDays?: number;
    interestRateShock?: number;
  };
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LqScenarioDetailProps {
  scenario: CashScenario;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const typeLabels: Record<string, { label: string; className: string }> = {
  base: { label: 'Базовый', className: 'bg-blue-100 text-blue-700' },
  conservative: { label: 'Консервативный', className: 'bg-amber-100 text-amber-700' },
  aggressive: { label: 'Агрессивный', className: 'bg-red-100 text-red-700' },
  custom: { label: 'Пользовательский', className: 'bg-purple-100 text-purple-700' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LqScenarioDetail({
  scenario,
  onBack,
  onEdit,
  onDelete,
}: LqScenarioDetailProps) {
  const adj = scenario.adjustmentsJson || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-stone-800">{scenario.name}</h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  typeLabels[scenario.scenarioType].className
                }`}
              >
                {typeLabels[scenario.scenarioType].label}
              </span>
              {scenario.isDefault && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                  По умолчанию
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500 mt-1">
              Создан: {formatDate(scenario.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm">Редактировать</span>
            </button>
          )}
          {onDelete && !scenario.isDefault && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Удалить</span>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {scenario.description && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Описание</h3>
          <p className="text-stone-600">{scenario.description}</p>
        </div>
      )}

      {/* Adjustments */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-4">Корректировки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-500 mb-1">Haircut на притоки</div>
            <div className={`text-xl font-bold ${(adj.inflowHaircut || 0) > 0 ? 'text-red-600' : (adj.inflowHaircut || 0) < 0 ? 'text-emerald-600' : 'text-stone-600'}`}>
              {adj.inflowHaircut ? `${adj.inflowHaircut > 0 ? '-' : '+'}${Math.abs(adj.inflowHaircut)}%` : '0%'}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {(adj.inflowHaircut || 0) > 0 ? 'Снижение притоков' : (adj.inflowHaircut || 0) < 0 ? 'Увеличение притоков' : 'Без изменений'}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-500 mb-1">Увеличение оттоков</div>
            <div className={`text-xl font-bold ${(adj.outflowIncrease || 0) > 0 ? 'text-red-600' : (adj.outflowIncrease || 0) < 0 ? 'text-emerald-600' : 'text-stone-600'}`}>
              {adj.outflowIncrease ? `${adj.outflowIncrease > 0 ? '+' : ''}${adj.outflowIncrease}%` : '0%'}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {(adj.outflowIncrease || 0) > 0 ? 'Рост оттоков' : (adj.outflowIncrease || 0) < 0 ? 'Снижение оттоков' : 'Без изменений'}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-500 mb-1">Задержка дистрибуций</div>
            <div className={`text-xl font-bold ${(adj.distributionDelayDays || 0) > 0 ? 'text-amber-600' : (adj.distributionDelayDays || 0) < 0 ? 'text-emerald-600' : 'text-stone-600'}`}>
              {adj.distributionDelayDays || 0} дней
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {(adj.distributionDelayDays || 0) > 0 ? 'Позже' : (adj.distributionDelayDays || 0) < 0 ? 'Раньше' : 'Без изменений'}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-500 mb-1">Сдвиг capital calls</div>
            <div className={`text-xl font-bold ${(adj.capitalCallShiftDays || 0) > 0 ? 'text-red-600' : (adj.capitalCallShiftDays || 0) < 0 ? 'text-emerald-600' : 'text-stone-600'}`}>
              {adj.capitalCallShiftDays || 0} дней
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {(adj.capitalCallShiftDays || 0) > 0 ? 'Раньше (хуже)' : (adj.capitalCallShiftDays || 0) < 0 ? 'Позже (лучше)' : 'Без изменений'}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-500 mb-1">Шок ставок</div>
            <div className={`text-xl font-bold ${(adj.interestRateShock || 0) > 0 ? 'text-red-600' : (adj.interestRateShock || 0) < 0 ? 'text-emerald-600' : 'text-stone-600'}`}>
              {adj.interestRateShock || 0} bp
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {(adj.interestRateShock || 0) > 0 ? 'Рост ставок' : (adj.interestRateShock || 0) < 0 ? 'Снижение ставок' : 'Без изменений'}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-2">Метаданные</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-stone-500">ID:</span>{' '}
            <span className="font-mono text-stone-600">{scenario.id}</span>
          </div>
          <div>
            <span className="text-stone-500">Обновлён:</span>{' '}
            <span className="text-stone-600">{formatDate(scenario.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
