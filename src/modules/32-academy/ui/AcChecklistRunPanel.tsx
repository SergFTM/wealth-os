'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getRunStats, canToggleStep } from '../engine/checklistEngine';
import type { Checklist, ChecklistRun } from '../engine/checklistEngine';

interface AcChecklistRunPanelProps {
  checklist: Checklist;
  run: ChecklistRun;
  onToggleStep: (stepId: string) => void;
  onAbandon?: () => void;
}

export function AcChecklistRunPanel({ checklist, run, onToggleStep, onAbandon }: AcChecklistRunPanelProps) {
  const { locale } = useApp();
  const stats = getRunStats(run, checklist);

  const labels = {
    progress: { ru: 'Прогресс', en: 'Progress', uk: 'Прогрес' },
    steps: { ru: 'шагов', en: 'steps', uk: 'кроків' },
    completed: { ru: 'Завершено', en: 'Completed', uk: 'Завершено' },
    remaining: { ru: 'Осталось', en: 'Remaining', uk: 'Залишилось' },
    required: { ru: 'обяз.', en: 'req.', uk: "обов'яз." },
    abandon: { ru: 'Отменить', en: 'Abandon', uk: 'Скасувати' },
    orderEnforced: { ru: 'Порядок обязателен', en: 'Order enforced', uk: "Порядок обов'язковий" },
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">{labels.progress[locale]}</span>
          <span className="text-sm text-stone-500">{stats.completionPct}%</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-stone-500">
          <span>{labels.completed[locale]}: {stats.completedSteps}/{stats.totalSteps} {labels.steps[locale]}</span>
          <span>{labels.remaining[locale]}: {stats.remainingRequired} {labels.required[locale]}</span>
        </div>
      </div>

      {/* Order enforcement notice */}
      {checklist.enforceOrder && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-amber-700">{labels.orderEnforced[locale]}</span>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-2">
        {checklist.stepsJson.map((step, index) => {
          const stepState = run.stepStatesJson.find(s => s.stepId === step.id);
          const isCompleted = stepState?.completed || false;
          const canToggle = canToggleStep(run, checklist, step.id);
          const isDisabled = run.status === 'completed' || run.status === 'abandoned' || !canToggle;

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl transition-all',
                isCompleted ? 'bg-emerald-50' : 'bg-stone-50',
                !isDisabled && 'cursor-pointer hover:bg-opacity-70'
              )}
              onClick={() => !isDisabled && onToggleStep(step.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500'
                      : canToggle
                        ? 'border-stone-300 hover:border-emerald-400'
                        : 'border-stone-200 bg-stone-100'
                  )}
                >
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-medium">{index + 1}.</span>
                  <span className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-emerald-700' : 'text-stone-700'
                  )}>
                    {step.titleRu}
                  </span>
                  {step.required && (
                    <span className="text-xs text-rose-500">*</span>
                  )}
                </div>
                {stepState?.completedAt && (
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(stepState.completedAt).toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {run.status === 'in_progress' && onAbandon && (
        <div className="pt-4 border-t border-stone-200/50">
          <button
            onClick={onAbandon}
            className="text-sm text-rose-600 hover:text-rose-700"
          >
            {labels.abandon[locale]}
          </button>
        </div>
      )}

      {/* Completed state */}
      {run.status === 'completed' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-emerald-700">
            {labels.completed[locale]} {run.completedAt && new Date(run.completedAt).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
