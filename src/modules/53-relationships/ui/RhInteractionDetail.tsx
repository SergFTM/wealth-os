"use client";

import React from 'react';
import { RhStatusPill } from './RhStatusPill';

export interface InteractionDetailData {
  id: string;
  interactionTypeKey: string;
  occurredAt: string;
  summary: string;
  notesInternal?: string;
  clientSafeSnippet?: string;
  followUpDueAt?: string;
  statusKey: string;
  participants: Array<{ id: string; name: string }>;
  householdId?: string;
  householdName?: string;
  linkedThread?: { id: string; subject: string };
  linkedCase?: { id: string; title: string };
  linkedTasks: Array<{ id: string; title: string; status: string }>;
  createdByUser?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface RhInteractionDetailProps {
  interaction: InteractionDetailData;
  onParticipantClick?: (id: string) => void;
  onHouseholdClick?: () => void;
  onThreadClick?: () => void;
  onCaseClick?: () => void;
  onTaskClick?: (id: string) => void;
  onSetFollowUp?: () => void;
  onClose?: () => void;
  onCreateTask?: () => void;
  onLinkCase?: () => void;
  onPublishSnippet?: () => void;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  meeting: { icon: '📅', label: 'Встреча' },
  call: { icon: '📞', label: 'Звонок' },
  message: { icon: '💬', label: 'Сообщение' },
  note: { icon: '📝', label: 'Заметка' },
};

export function RhInteractionDetail({
  interaction,
  onParticipantClick,
  onHouseholdClick,
  onThreadClick,
  onCaseClick,
  onTaskClick,
  onSetFollowUp,
  onClose,
  onCreateTask,
  onLinkCase,
  onPublishSnippet,
}: RhInteractionDetailProps) {
  const typeConfig = TYPE_CONFIG[interaction.interactionTypeKey] || TYPE_CONFIG.note;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = () => {
    if (!interaction.followUpDueAt || interaction.statusKey === 'closed') return false;
    return new Date(interaction.followUpDueAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">
            {typeConfig.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{typeConfig.label}</h1>
            <p className="text-sm text-gray-500">{formatDate(interaction.occurredAt)}</p>
          </div>
        </div>
        <RhStatusPill status={isOverdue() ? 'overdue' : interaction.statusKey} />
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Краткое описание</h3>
        <p className="text-gray-700">{interaction.summary}</p>
      </div>

      {/* Participants */}
      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Участники</h3>
        <div className="flex flex-wrap gap-2">
          {interaction.participants.map((p) => (
            <button
              key={p.id}
              onClick={() => onParticipantClick?.(p.id)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              👤 {p.name}
            </button>
          ))}
        </div>
        {interaction.householdName && (
          <button
            onClick={onHouseholdClick}
            className="mt-3 text-sm text-emerald-600 hover:text-emerald-700"
          >
            🏠 {interaction.householdName}
          </button>
        )}
      </div>

      {/* Internal notes */}
      {interaction.notesInternal && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-600">🔒</span>
            <h3 className="font-semibold text-amber-800">Внутренние заметки</h3>
          </div>
          <p className="text-amber-900 text-sm whitespace-pre-wrap">{interaction.notesInternal}</p>
        </div>
      )}

      {/* Follow-up */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Follow-up</h3>
          {interaction.statusKey === 'open' && (
            <button
              onClick={onSetFollowUp}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Установить дату
            </button>
          )}
        </div>
        {interaction.followUpDueAt ? (
          <div className={`mt-2 p-3 rounded-lg ${isOverdue() ? 'bg-red-50' : 'bg-gray-50'}`}>
            <p className={`text-sm font-medium ${isOverdue() ? 'text-red-700' : 'text-gray-700'}`}>
              {formatDate(interaction.followUpDueAt)}
              {isOverdue() && ' — Просрочено!'}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">Не установлено</p>
        )}
      </div>

      {/* Linked items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Linked case */}
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Связанный кейс</h3>
            {!interaction.linkedCase && (
              <button
                onClick={onLinkCase}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + Связать
              </button>
            )}
          </div>
          {interaction.linkedCase ? (
            <button
              onClick={onCaseClick}
              className="w-full p-3 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900">📋 {interaction.linkedCase.title}</p>
            </button>
          ) : (
            <p className="text-sm text-gray-500">Нет связанного кейса</p>
          )}
        </div>

        {/* Linked thread */}
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Связанный тред</h3>
          {interaction.linkedThread ? (
            <button
              onClick={onThreadClick}
              className="w-full p-3 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900">💬 {interaction.linkedThread.subject}</p>
            </button>
          ) : (
            <p className="text-sm text-gray-500">Нет связанного треда</p>
          )}
        </div>
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
        {interaction.linkedTasks.length > 0 ? (
          <div className="space-y-2">
            {interaction.linkedTasks.map((task) => (
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

      {/* Client-safe snippet */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Client-safe публикация</h3>
          {!interaction.clientSafeSnippet && (
            <button
              onClick={onPublishSnippet}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Опубликовать
            </button>
          )}
        </div>
        {interaction.clientSafeSnippet ? (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <p className="text-sm text-gray-700">{interaction.clientSafeSnippet}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Публикация скроет внутренние заметки и покажет только summary
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        {interaction.statusKey === 'open' && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Закрыть взаимодействие
          </button>
        )}
      </div>
    </div>
  );
}

export default RhInteractionDetail;
