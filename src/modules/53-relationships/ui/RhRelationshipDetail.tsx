"use client";

import React from 'react';
import { RhRolePill } from './RhRolePill';

export interface RelationshipDetailData {
  id: string;
  fromRef: { type: string; id: string; name: string };
  toRef: { type: string; id: string; name: string };
  relationshipTypeKey: string;
  roleLabel?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  evidenceDocs: Array<{ id: string; name: string; type: string }>;
  sourceRef?: { type: string; id: string };
  createdAt: string;
  updatedAt: string;
}

interface RhRelationshipDetailProps {
  relationship: RelationshipDetailData;
  onFromClick?: () => void;
  onToClick?: () => void;
  onDocumentClick?: (docId: string) => void;
  onAddEvidence?: () => void;
  onEdit?: () => void;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  family: { label: 'Семейные отношения', color: 'purple' },
  role: { label: 'Роль', color: 'blue' },
  authority: { label: 'Доверенность', color: 'amber' },
  vendor_contact: { label: 'Контакт вендора', color: 'gray' },
  ownership_link: { label: 'Связь владения', color: 'emerald' },
};

const ENTITY_ICONS: Record<string, string> = {
  person: '👤',
  entity: '🏢',
  trust: '🏛️',
  household: '🏠',
};

export function RhRelationshipDetail({
  relationship,
  onFromClick,
  onToClick,
  onDocumentClick,
  onAddEvidence,
  onEdit,
}: RhRelationshipDetailProps) {
  const typeConfig = TYPE_LABELS[relationship.relationshipTypeKey] || {
    label: relationship.relationshipTypeKey,
    color: 'gray'
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isActive = () => {
    const now = new Date();
    const from = new Date(relationship.effectiveFrom);
    const to = relationship.effectiveTo ? new Date(relationship.effectiveTo) : null;
    return from <= now && (!to || to >= now);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{typeConfig.label}</h1>
          {relationship.roleLabel && (
            <div className="mt-2">
              <RhRolePill role={relationship.roleLabel} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isActive() ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
              ✓ Активно
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              Истекло
            </span>
          )}
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Редактировать
          </button>
        </div>
      </div>

      {/* From → To visualization */}
      <div className="rounded-xl border border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-center gap-8">
          {/* From */}
          <div
            onClick={onFromClick}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-all"
          >
            <span className="text-3xl mb-2">{ENTITY_ICONS[relationship.fromRef.type]}</span>
            <p className="font-medium text-gray-900">{relationship.fromRef.name}</p>
            <p className="text-xs text-gray-500">{relationship.fromRef.type}</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className={`w-24 h-1 bg-${typeConfig.color}-400 rounded`} />
            <span className="text-xs text-gray-500 mt-2">{typeConfig.label}</span>
          </div>

          {/* To */}
          <div
            onClick={onToClick}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-all"
          >
            <span className="text-3xl mb-2">{ENTITY_ICONS[relationship.toRef.type]}</span>
            <p className="font-medium text-gray-900">{relationship.toRef.name}</p>
            <p className="text-xs text-gray-500">{relationship.toRef.type}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dates */}
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Период действия</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Начало</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(relationship.effectiveFrom)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Окончание</span>
              <span className="text-sm font-medium text-gray-900">
                {relationship.effectiveTo ? formatDate(relationship.effectiveTo) : 'Бессрочно'}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Метаданные</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Создано</span>
              <span className="text-gray-900">{formatDate(relationship.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Обновлено</span>
              <span className="text-gray-900">{formatDate(relationship.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence documents */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Подтверждающие документы</h3>
          <button
            onClick={onAddEvidence}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + Добавить документ
          </button>
        </div>

        {relationship.evidenceDocs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Нет прикреплённых документов
          </p>
        ) : (
          <div className="space-y-2">
            {relationship.evidenceDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onDocumentClick?.(doc.id)}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="text-xl">📄</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RhRelationshipDetail;
