"use client";

import React from 'react';
import { RhStatusPill } from './RhStatusPill';

export interface InitiativeDetailData {
  id: string;
  title: string;
  description?: string;
  stageKey: string;
  ownerUser: { id: string; name: string };
  household: { id: string; name: string };
  dueAt?: string;
  successCriteria?: string;
  linkedCase?: { id: string; title: string };
  linkedTasks: Array<{ id: string; title: string; status: string }>;
  attachments: Array<{ id: string; name: string; type: string }>;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RhInitiativeDetailProps {
  initiative: InitiativeDetailData;
  onHouseholdClick?: () => void;
  onOwnerClick?: () => void;
  onCaseClick?: () => void;
  onTaskClick?: (id: string) => void;
  onAttachmentClick?: (id: string) => void;
  onMoveToNextStage?: () => void;
  onLinkCase?: () => void;
  onCreateTask?: () => void;
  onAddAttachment?: () => void;
  onAiSuggestPlan?: () => void;
}

const STAGE_CONFIG: Record<string, { label: string; color: string; next?: string }> = {
  idea: { label: 'Идея', color: 'gray', next: 'in_analysis' },
  in_analysis: { label: 'В анализе', color: 'blue', next: 'in_progress' },
  in_progress: { label: 'В работе', color: 'amber', next: 'done' },
  done: { label: 'Завершено', color: 'green' },
};

export function RhInitiativeDetail({
  initiative,
  onHouseholdClick,
  onOwnerClick,
  onCaseClick,
  onTaskClick,
  onAttachmentClick,
  onMoveToNextStage,
  onLinkCase,
  onCreateTask,
  onAddAttachment,
  onAiSuggestPlan,
}: RhInitiativeDetailProps) {
  const stageConfig = STAGE_CONFIG[initiative.stageKey] || STAGE_CONFIG.idea;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!initiative.dueAt || initiative.stageKey === 'done') return false;
    return new Date(initiative.dueAt) < new Date();
  };

  const getNextStageLabel = () => {
    if (!stageConfig.next) return null;
    return STAGE_CONFIG[stageConfig.next]?.label;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{initiative.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <RhStatusPill status={initiative.stageKey} />
            {isOverdue() && (
              <span className="text-sm text-red-600 font-medium">⚠️ Просрочено</span>
            )}
          </div>
        </div>
        {getNextStageLabel() && (
          <button
            onClick={onMoveToNextStage}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
          >
            Перейти: {getNextStageLabel()}
          </button>
        )}
      </div>

      {/* Stage pipeline */}
      <div className="flex items-center gap-2">
        {Object.entries(STAGE_CONFIG).map(([key, config], index, arr) => (
          <React.Fragment key={key}>
            <div
              className={`
                flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors
                ${initiative.stageKey === key
                  ? `bg-${config.color}-100 text-${config.color}-700 border-2 border-${config.color}-300`
                  : 'bg-gray-100 text-gray-500'}
              `}
            >
              {config.label}
            </div>
            {index < arr.length - 1 && (
              <span className="text-gray-300">→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Description */}
      {initiative.description && (
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Описание</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{initiative.description}</p>
        </div>
      )}

      {/* Meta info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Детали</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Домохозяйство</span>
              <button
                onClick={onHouseholdClick}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {initiative.household.name}
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Ответственный</span>
              <button
                onClick={onOwnerClick}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {initiative.ownerUser.name}
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Срок</span>
              <span className={`text-sm font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                {initiative.dueAt ? formatDate(initiative.dueAt) : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Создано</span>
              <span className="text-sm text-gray-900">{formatDate(initiative.createdAt)}</span>
            </div>
            {initiative.closedAt && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Закрыто</span>
                <span className="text-sm text-gray-900">{formatDate(initiative.closedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Success criteria */}
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Критерии успеха</h3>
          {initiative.successCriteria ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{initiative.successCriteria}</p>
          ) : (
            <p className="text-sm text-gray-500">Не определены</p>
          )}
        </div>
      </div>

      {/* AI suggestion */}
      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h3 className="font-semibold text-gray-900">AI-помощник</h3>
          </div>
          <button
            onClick={onAiSuggestPlan}
            className="px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-50 transition-colors"
          >
            Предложить план
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          AI может предложить план действий и следующие шаги на основе аналогичных инициатив
        </p>
      </div>

      {/* Linked case */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Связанный кейс</h3>
          {!initiative.linkedCase && (
            <button
              onClick={onLinkCase}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Связать кейс
            </button>
          )}
        </div>
        {initiative.linkedCase ? (
          <button
            onClick={onCaseClick}
            className="w-full p-3 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors"
          >
            <p className="text-sm font-medium text-gray-900">📋 {initiative.linkedCase.title}</p>
          </button>
        ) : (
          <p className="text-sm text-gray-500">Нет связанного кейса</p>
        )}
      </div>

      {/* Linked tasks */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Связанные задачи</h3>
          <button
            onClick={onCreateTask}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + Создать задачу
          </button>
        </div>
        {initiative.linkedTasks.length > 0 ? (
          <div className="space-y-2">
            {initiative.linkedTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onTaskClick?.(task.id)}
                className="w-full p-3 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <span className="text-xs text-gray-500">{task.status}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Нет связанных задач</p>
        )}
      </div>

      {/* Attachments */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Вложения</h3>
          <button
            onClick={onAddAttachment}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + Добавить
          </button>
        </div>
        {initiative.attachments.length > 0 ? (
          <div className="space-y-2">
            {initiative.attachments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onAttachmentClick?.(doc.id)}
                className="w-full p-3 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <span className="text-xl">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.type}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Нет вложений</p>
        )}
      </div>
    </div>
  );
}

export default RhInitiativeDetail;
