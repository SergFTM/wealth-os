'use client';

/**
 * Planning Goals Table Component
 * List of financial goals with progress
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { PlanningGoal, GOAL_PRIORITY_CONFIG, GOAL_STATUS_CONFIG } from '../schema/goal';
import { PlStatusPill } from './PlStatusPill';

interface PlGoalsTableProps {
  goals: PlanningGoal[];
  lang?: 'ru' | 'en' | 'uk';
  onEdit?: (id: string) => void;
}

export function PlGoalsTable({ goals, lang: propLang, onEdit }: PlGoalsTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    title: { ru: 'Цель', en: 'Goal', uk: 'Ціль' },
    priority: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' },
    targetAmount: { ru: 'Целевая сумма', en: 'Target Amount', uk: 'Цільова сума' },
    targetDate: { ru: 'Срок', en: 'Target Date', uk: 'Термін' },
    fundingRatio: { ru: 'Прогресс', en: 'Progress', uk: 'Прогрес' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const getPriorityIcon = (priority: PlanningGoal['priority']): string => {
    return GOAL_PRIORITY_CONFIG[priority].icon;
  };

  const getPriorityColor = (priority: PlanningGoal['priority']): string => {
    const colors = {
      critical: 'text-red-600',
      high: 'text-amber-600',
      medium: 'text-blue-600',
      low: 'text-gray-500',
    };
    return colors[priority];
  };

  const getProgressColor = (ratio: number): string => {
    if (ratio >= 80) return 'bg-green-500';
    if (ratio >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {lang === 'ru' ? 'Нет целей' : lang === 'uk' ? 'Немає цілей' : 'No goals'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.title[lang]}</th>
            <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.priority[lang]}</th>
            <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.targetAmount[lang]}</th>
            <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.targetDate[lang]}</th>
            <th className="text-left py-3 px-2 font-medium text-gray-600 w-32">{headers.fundingRatio[lang]}</th>
            <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.status[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr
              key={goal.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => onEdit?.(goal.id)}
            >
              <td className="py-3 px-2">
                <Link
                  href={`/m/planning/goal/${goal.id}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {goal.title}
                </Link>
                {goal.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{goal.description}</div>
                )}
              </td>
              <td className="py-3 px-2">
                <span className={`flex items-center gap-1 ${getPriorityColor(goal.priority)}`}>
                  <span>{getPriorityIcon(goal.priority)}</span>
                  <span className="text-xs">
                    {GOAL_PRIORITY_CONFIG[goal.priority].label[lang]}
                  </span>
                </span>
              </td>
              <td className="py-3 px-2 text-right font-mono">
                {formatCurrency(goal.targetAmount)}
              </td>
              <td className="py-3 px-2 text-gray-600">
                {formatDate(goal.targetDate)}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(goal.fundingRatio)} transition-all`}
                      style={{ width: `${Math.min(100, goal.fundingRatio)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-10 text-right">
                    {goal.fundingRatio}%
                  </span>
                </div>
              </td>
              <td className="py-3 px-2">
                <PlStatusPill status={goal.status} type="goal" lang={lang} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
