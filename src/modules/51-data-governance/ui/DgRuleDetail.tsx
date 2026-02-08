'use client';

import React from 'react';
import { DataGovernanceRule } from '../engine/types';
import { RULE_TYPES } from '../config';

interface DgRuleDetailProps {
  rule: DataGovernanceRule;
  onToggleEnabled?: () => void;
  onEdit?: () => void;
  onTestRun?: () => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgRuleDetail({
  rule,
  onToggleEnabled,
  onEdit,
  onTestRun,
  locale = 'ru',
}: DgRuleDetailProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900">{rule.name}</h1>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
            }`}>
              {rule.enabled
                ? (locale === 'ru' ? 'Включено' : 'Enabled')
                : (locale === 'ru' ? 'Отключено' : 'Disabled')}
            </span>
          </div>
          {rule.description && (
            <p className="text-stone-600 mt-1">{rule.description}</p>
          )}
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-700">
              {RULE_TYPES[rule.ruleTypeKey]?.[locale] || rule.ruleTypeKey}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleEnabled && (
            <button
              onClick={onToggleEnabled}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                rule.enabled
                  ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {rule.enabled
                ? (locale === 'ru' ? 'Отключить' : 'Disable')
                : (locale === 'ru' ? 'Включить' : 'Enable')}
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              {locale === 'ru' ? 'Редактировать' : 'Edit'}
            </button>
          )}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-6">
        {/* Applies To */}
        <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
          <h3 className="font-medium text-stone-800 mb-3">
            {locale === 'ru' ? 'Применяется к' : 'Applies To'}
          </h3>
          <div className="space-y-2">
            {rule.appliesToJson.allKpis && (
              <div className="text-sm text-stone-600">
                {locale === 'ru' ? 'Все KPIs' : 'All KPIs'}
              </div>
            )}
            {rule.appliesToJson.domains && rule.appliesToJson.domains.length > 0 && (
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {locale === 'ru' ? 'Домены:' : 'Domains:'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {rule.appliesToJson.domains.map((d, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {rule.appliesToJson.collections && rule.appliesToJson.collections.length > 0 && (
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {locale === 'ru' ? 'Коллекции:' : 'Collections:'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {rule.appliesToJson.collections.map((c, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {rule.appliesToJson.kpiIds && rule.appliesToJson.kpiIds.length > 0 && (
              <div>
                <div className="text-xs text-stone-500 mb-1">KPI IDs:</div>
                <div className="text-sm text-stone-600 font-mono">
                  {rule.appliesToJson.kpiIds.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuration */}
        <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
          <h3 className="font-medium text-stone-800 mb-3">
            {locale === 'ru' ? 'Конфигурация' : 'Configuration'}
          </h3>
          <dl className="space-y-2 text-sm">
            {rule.configJson.threshold !== undefined && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Порог' : 'Threshold'}</dt>
                <dd className="font-medium text-stone-800">{rule.configJson.threshold}%</dd>
              </div>
            )}
            {rule.configJson.days !== undefined && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Дней' : 'Days'}</dt>
                <dd className="font-medium text-stone-800">{rule.configJson.days}</dd>
              </div>
            )}
            {rule.configJson.deltaPercent !== undefined && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Дельта %' : 'Delta %'}</dt>
                <dd className="font-medium text-stone-800">{rule.configJson.deltaPercent}%</dd>
              </div>
            )}
            {rule.configJson.severity && (
              <div className="flex justify-between">
                <dt className="text-stone-500">Severity</dt>
                <dd className={`font-medium ${
                  rule.configJson.severity === 'critical'
                    ? 'text-red-600'
                    : rule.configJson.severity === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                }`}>
                  {rule.configJson.severity}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-stone-500">Auto Exception</dt>
              <dd className="font-medium text-stone-800">
                {rule.configJson.autoEmitException
                  ? (locale === 'ru' ? 'Да' : 'Yes')
                  : (locale === 'ru' ? 'Нет' : 'No')}
              </dd>
            </div>
            {rule.configJson.exceptionCategory && (
              <div className="flex justify-between">
                <dt className="text-stone-500">
                  {locale === 'ru' ? 'Категория Exception' : 'Exception Category'}
                </dt>
                <dd className="font-medium text-stone-800">{rule.configJson.exceptionCategory}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* JSON Config */}
      <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
        <h3 className="font-medium text-stone-800 mb-3">
          {locale === 'ru' ? 'JSON конфигурация' : 'JSON Configuration'}
        </h3>
        <pre className="text-xs text-stone-600 bg-white p-3 rounded-lg overflow-auto">
          {JSON.stringify(rule.configJson, null, 2)}
        </pre>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-stone-500">
        <span>{locale === 'ru' ? 'Создано:' : 'Created:'} {formatDate(rule.createdAt)}</span>
        <span>•</span>
        <span>{locale === 'ru' ? 'Обновлено:' : 'Updated:'} {formatDate(rule.updatedAt)}</span>
      </div>

      {/* Test Run */}
      {onTestRun && (
        <div className="pt-4 border-t border-stone-200">
          <button
            onClick={onTestRun}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {locale === 'ru' ? 'Тестовый запуск' : 'Test Run'}
          </button>
        </div>
      )}
    </div>
  );
}
