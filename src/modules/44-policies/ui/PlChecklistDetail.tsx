"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ChecklistStep {
  orderIndex: number;
  title: string;
  description?: string;
  responsibleRole?: string;
}

interface Checklist {
  id: string;
  name: string;
  linkedSopId?: string;
  linkedSopTitle?: string;
  stepsJson: ChecklistStep[];
  usageCount: number;
  lastUsedAt?: string;
  createdByUserId?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlChecklistDetailProps {
  checklist: Checklist;
  onUse?: () => void;
  onCreateTaskPlan?: () => void;
  onEdit?: () => void;
}

export function PlChecklistDetail({
  checklist,
  onUse,
  onCreateTaskPlan,
  onEdit,
}: PlChecklistDetailProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleStep = (orderIndex: number) => {
    const newSet = new Set(completedSteps);
    if (newSet.has(orderIndex)) {
      newSet.delete(orderIndex);
    } else {
      newSet.add(orderIndex);
    }
    setCompletedSteps(newSet);
  };

  const completedCount = completedSteps.size;
  const totalSteps = checklist.stepsJson.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{checklist.name}</h1>
            {checklist.linkedSopTitle && (
              <p className="text-stone-600">
                Связанный SOP: <span className="font-medium">{checklist.linkedSopTitle}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="ghost" onClick={onEdit}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Редактировать
              </Button>
            )}
            {onCreateTaskPlan && (
              <Button variant="secondary" onClick={onCreateTaskPlan}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Создать план задач
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-stone-500">Шагов:</span>
            <div className="font-medium text-stone-800">{totalSteps}</div>
          </div>
          <div>
            <span className="text-stone-500">Использований:</span>
            <div className="font-medium text-stone-800">{checklist.usageCount}</div>
          </div>
          <div>
            <span className="text-stone-500">Автор:</span>
            <div className="font-medium text-stone-800">{checklist.createdByName || '—'}</div>
          </div>
          <div>
            <span className="text-stone-500">Последнее исп.:</span>
            <div className="font-medium text-stone-800">
              {checklist.lastUsedAt ? formatDate(checklist.lastUsedAt) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">Прогресс выполнения</span>
          <span className="text-sm text-stone-600">
            {completedCount} / {totalSteps} ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">Шаги чеклиста</h3>
        <div className="space-y-3">
          {checklist.stepsJson.map((step) => {
            const isCompleted = completedSteps.has(step.orderIndex);

            return (
              <label
                key={step.orderIndex}
                className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleStep(step.orderIndex)}
                    className="w-5 h-5 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 mt-0.5"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? 'bg-emerald-200 text-emerald-700'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {step.orderIndex}
                    </span>
                    <div>
                      <h4 className={`font-medium ${isCompleted ? 'text-emerald-800 line-through' : 'text-stone-800'}`}>
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className={`text-sm mt-1 ${isCompleted ? 'text-emerald-600' : 'text-stone-600'}`}>
                          {step.description}
                        </p>
                      )}
                      {step.responsibleRole && (
                        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          {step.responsibleRole}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {onUse && completedCount === totalSteps && totalSteps > 0 && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <p className="text-emerald-700 font-medium mb-3">Все шаги выполнены!</p>
            <Button variant="primary" onClick={onUse}>
              Отметить использование
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
