'use client';

/**
 * Data Quality Conflict Detail Component
 */

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { DqConflict, DQ_CONFLICT_STATUS_CONFIG } from '../schema/dqConflict';
import { DQ_CONFLICT_TYPES, DqConflictType } from '../config';
import { DqSeverityPill } from './DqSeverityPill';

interface DqConflictDetailProps {
  conflict: DqConflict;
  lang?: 'ru' | 'en' | 'uk';
  onResolve?: (resolution: 'keep_left' | 'keep_right' | 'merge' | 'delete_both') => void;
}

export function DqConflictDetail({
  conflict,
  lang: propLang,
  onResolve,
}: DqConflictDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    title: { ru: 'Детали конфликта', en: 'Conflict Details', uk: 'Деталі конфлікту' },
    type: { ru: 'Тип конфликта', en: 'Conflict Type', uk: 'Тип конфлікту' },
    severity: { ru: 'Severity', en: 'Severity', uk: 'Severity' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    created: { ru: 'Создан', en: 'Created', uk: 'Створено' },
    comparison: { ru: 'Сравнение записей', en: 'Record Comparison', uk: 'Порівняння записів' },
    leftRecord: { ru: 'Запись A', en: 'Record A', uk: 'Запис A' },
    rightRecord: { ru: 'Запись B', en: 'Record B', uk: 'Запис B' },
    resolution: { ru: 'Решение', en: 'Resolution', uk: 'Рішення' },
    actions: {
      keepLeft: { ru: 'Оставить A', en: 'Keep A', uk: 'Залишити A' },
      keepRight: { ru: 'Оставить B', en: 'Keep B', uk: 'Залишити B' },
      merge: { ru: 'Объединить', en: 'Merge', uk: 'Об\'єднати' },
      deleteBoth: { ru: 'Удалить оба', en: 'Delete Both', uk: 'Видалити обидва' },
    },
    fields: {
      collection: { ru: 'Коллекция', en: 'Collection', uk: 'Колекція' },
      recordId: { ru: 'ID записи', en: 'Record ID', uk: 'ID запису' },
      label: { ru: 'Название', en: 'Label', uk: 'Назва' },
    },
  };

  const typeConfig = DQ_CONFLICT_TYPES[conflict.conflictType as DqConflictType];
  const statusConfig = DQ_CONFLICT_STATUS_CONFIG[conflict.status];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const allFields = new Set([
    ...Object.keys(conflict.leftRef.keyFields),
    ...Object.keys(conflict.rightRef.keyFields),
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DqSeverityPill severity={conflict.severity} lang={lang} />
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                conflict.status === 'open' ? 'bg-red-100 text-red-700' :
                conflict.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {statusConfig?.label[lang] || conflict.status}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              {typeConfig?.label[lang] || conflict.conflictType}
            </h1>
            {conflict.title && (
              <p className="text-sm text-gray-500 mt-1">{conflict.title}</p>
            )}
            {conflict.description && (
              <p className="text-sm text-gray-500 mt-1">{conflict.description}</p>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {labels.created[lang]}: {formatDate(conflict.createdAt)}
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">{labels.comparison[lang]}</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Left Record */}
          <div className={`p-4 rounded-lg border-2 ${
            conflict.resolution === 'keep_left' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className="font-medium text-gray-900 mb-3">{labels.leftRecord[lang]}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{labels.fields.collection[lang]}:</span>
                <span className="font-mono">{conflict.leftRef.collection}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{labels.fields.recordId[lang]}:</span>
                <span className="font-mono text-xs">{conflict.leftRef.recordId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{labels.fields.label[lang]}:</span>
                <span className="font-medium">{conflict.leftRef.displayLabel}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 space-y-1">
                {Array.from(allFields).map((field) => (
                  <div key={field} className="flex justify-between text-sm">
                    <span className="text-gray-500">{field}:</span>
                    <span className="font-mono">
                      {String(conflict.leftRef.keyFields[field] ?? '-')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Record */}
          <div className={`p-4 rounded-lg border-2 ${
            conflict.resolution === 'keep_right' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className="font-medium text-gray-900 mb-3">{labels.rightRecord[lang]}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{labels.fields.collection[lang]}:</span>
                <span className="font-mono">{conflict.rightRef.collection}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{labels.fields.recordId[lang]}:</span>
                <span className="font-mono text-xs">{conflict.rightRef.recordId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{labels.fields.label[lang]}:</span>
                <span className="font-medium">{conflict.rightRef.displayLabel}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 space-y-1">
                {Array.from(allFields).map((field) => {
                  const leftVal = conflict.leftRef.keyFields[field];
                  const rightVal = conflict.rightRef.keyFields[field];
                  const isDiff = leftVal !== rightVal;
                  return (
                    <div key={field} className="flex justify-between text-sm">
                      <span className="text-gray-500">{field}:</span>
                      <span className={`font-mono ${isDiff ? 'text-red-600 font-medium' : ''}`}>
                        {String(rightVal ?? '-')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Actions */}
        {conflict.status === 'open' && onResolve && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{labels.resolution[lang]}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onResolve('keep_left')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {labels.actions.keepLeft[lang]}
              </button>
              <button
                onClick={() => onResolve('keep_right')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {labels.actions.keepRight[lang]}
              </button>
              <button
                onClick={() => onResolve('merge')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                {labels.actions.merge[lang]}
              </button>
              <button
                onClick={() => onResolve('delete_both')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {labels.actions.deleteBoth[lang]}
              </button>
            </div>
          </div>
        )}

        {/* Resolved info */}
        {conflict.status !== 'open' && conflict.resolution && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-800">
                {lang === 'ru' ? 'Решено: ' : 'Resolved: '}
                <span className="font-medium">
                  {labels.actions[conflict.resolution as keyof typeof labels.actions]?.[lang] || conflict.resolution}
                </span>
              </p>
              {conflict.resolvedAt && (
                <p className="text-xs text-emerald-600 mt-1">{formatDate(conflict.resolvedAt)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
