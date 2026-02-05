'use client';

/**
 * Planning Goal Detail Component
 * Detailed view of a single goal
 */

import { useI18n } from '@/lib/i18n';
import { PlanningGoal, GOAL_PRIORITY_CONFIG, getYearsToGoal, calculateRequiredMonthlySaving } from '../schema/goal';
import { PlStatusPill } from './PlStatusPill';
import { PlSourceBadge } from './PlSourceBadge';

interface PlGoalDetailProps {
  goal: PlanningGoal;
  currentNetWorth?: number;
  lang?: 'ru' | 'en' | 'uk';
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PlGoalDetail({ goal, currentNetWorth = 0, lang: propLang, onEdit, onDelete }: PlGoalDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    targetAmount: { ru: 'Целевая сумма', en: 'Target Amount', uk: 'Цільова сума' },
    currentAmount: { ru: 'Текущая сумма', en: 'Current Amount', uk: 'Поточна сума' },
    targetDate: { ru: 'Целевая дата', en: 'Target Date', uk: 'Цільова дата' },
    yearsRemaining: { ru: 'Осталось лет', en: 'Years Remaining', uk: 'Залишилось років' },
    priority: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    fundingRatio: { ru: 'Прогресс', en: 'Progress', uk: 'Прогрес' },
    requiredMonthly: { ru: 'Требуемый ежемесячный взнос', en: 'Required Monthly', uk: 'Потрібний щомісячний внесок' },
    linkedAssets: { ru: 'Связанные активы', en: 'Linked Assets', uk: "Пов'язані активи" },
    notes: { ru: 'Заметки', en: 'Notes', uk: 'Нотатки' },
    edit: { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' },
    delete: { ru: 'Удалить', en: 'Delete', uk: 'Видалити' },
  };

  const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const yearsToGoal = getYearsToGoal(goal.targetDate);
  const requiredMonthly = calculateRequiredMonthlySaving(
    goal.targetAmount,
    goal.currentAmount || 0,
    yearsToGoal,
    0.06 // assume 6% return
  );

  const getProgressColor = (ratio: number): string => {
    if (ratio >= 80) return 'bg-green-500';
    if (ratio >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{goal.title}</h2>
            {goal.description && (
              <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <PlStatusPill status={goal.status} type="goal" lang={lang} />
            <PlSourceBadge source="manual" asOfDate={goal.updatedAt} lang={lang} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{labels.fundingRatio[lang]}</span>
          <span className="text-sm font-medium">{goal.fundingRatio}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(goal.fundingRatio)} transition-all`}
            style={{ width: `${Math.min(100, goal.fundingRatio)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{formatCurrency(goal.currentAmount || 0)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">{labels.targetAmount[lang]}</div>
          <div className="text-lg font-semibold">{formatCurrency(goal.targetAmount)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">{labels.currentAmount[lang]}</div>
          <div className="text-lg font-semibold">{formatCurrency(goal.currentAmount || 0)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">{labels.targetDate[lang]}</div>
          <div className="font-medium">{formatDate(goal.targetDate)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">{labels.yearsRemaining[lang]}</div>
          <div className="font-medium">
            {yearsToGoal.toFixed(1)} {lang === 'ru' ? 'лет' : lang === 'uk' ? 'років' : 'years'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">{labels.priority[lang]}</div>
          <div className="flex items-center gap-1">
            <span>{GOAL_PRIORITY_CONFIG[goal.priority].icon}</span>
            <span className="font-medium">{GOAL_PRIORITY_CONFIG[goal.priority].label[lang]}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">{labels.requiredMonthly[lang]}</div>
          <div className="font-medium text-blue-600">{formatCurrency(Math.round(requiredMonthly))}</div>
        </div>
      </div>

      {/* Linked Assets */}
      {goal.linkedAssetIds && goal.linkedAssetIds.length > 0 && (
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 mb-2">{labels.linkedAssets[lang]}</div>
          <div className="flex flex-wrap gap-1">
            {goal.linkedAssetIds.map((id) => (
              <span key={id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {goal.notes && (
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 mb-1">{labels.notes[lang]}</div>
          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{goal.notes}</div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {labels.edit[lang]}
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            {labels.delete[lang]}
          </button>
        )}
      </div>
    </div>
  );
}
