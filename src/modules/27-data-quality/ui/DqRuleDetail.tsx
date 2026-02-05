'use client';

/**
 * Data Quality Rule Detail Component
 */

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { DqRule, DQ_RULE_STATUS_CONFIG, getRuleIcon } from '../schema/dqRule';
import { DQ_DOMAINS, DQ_RULE_TYPES, DQ_SEVERITY, DqDomain, DqRuleType } from '../config';
import { DqSeverityPill } from './DqSeverityPill';

interface DqRuleDetailProps {
  rule: DqRule;
  lang?: 'ru' | 'en' | 'uk';
  onRun?: () => void;
  onToggle?: (active: boolean) => void;
  onEdit?: () => void;
}

export function DqRuleDetail({
  rule,
  lang: propLang,
  onRun,
  onToggle,
  onEdit,
}: DqRuleDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;
  const [activeTab, setActiveTab] = useState<'definition' | 'runs' | 'exceptions' | 'audit'>('definition');

  const labels = {
    tabs: {
      definition: { ru: 'Определение', en: 'Definition', uk: 'Визначення' },
      runs: { ru: 'Запуски', en: 'Runs', uk: 'Запуски' },
      exceptions: { ru: 'Исключения', en: 'Exceptions', uk: 'Винятки' },
      audit: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' },
    },
    fields: {
      domain: { ru: 'Домен', en: 'Domain', uk: 'Домен' },
      ruleType: { ru: 'Тип правила', en: 'Rule Type', uk: 'Тип правила' },
      targetCollection: { ru: 'Целевая коллекция', en: 'Target Collection', uk: 'Цільова колекція' },
      targetFields: { ru: 'Целевые поля', en: 'Target Fields', uk: 'Цільові поля' },
      threshold: { ru: 'Порог', en: 'Threshold', uk: 'Поріг' },
      severityDefault: { ru: 'Severity по умолчанию', en: 'Default Severity', uk: 'Severity за замовчуванням' },
      autoCreateTask: { ru: 'Автосоздание задачи', en: 'Auto-create Task', uk: 'Автостворення завдання' },
      ownerRole: { ru: 'Роль владельца', en: 'Owner Role', uk: 'Роль власника' },
      status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      lastRun: { ru: 'Последний запуск', en: 'Last Run', uk: 'Останній запуск' },
      exceptionsOpen: { ru: 'Открытых исключений', en: 'Open Exceptions', uk: 'Відкритих винятків' },
    },
    actions: {
      run: { ru: 'Запустить', en: 'Run', uk: 'Запустити' },
      edit: { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' },
      pause: { ru: 'Приостановить', en: 'Pause', uk: 'Призупинити' },
      activate: { ru: 'Активировать', en: 'Activate', uk: 'Активувати' },
    },
    yes: { ru: 'Да', en: 'Yes', uk: 'Так' },
    no: { ru: 'Нет', en: 'No', uk: 'Ні' },
  };

  const domainConfig = DQ_DOMAINS[rule.domain as DqDomain];
  const typeConfig = DQ_RULE_TYPES[rule.ruleType as DqRuleType];
  const statusConfig = DQ_RULE_STATUS_CONFIG[rule.status];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getRuleIcon(rule.ruleType)}</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{rule.name}</h1>
              {rule.description && (
                <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              rule.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              rule.status === 'paused' ? 'bg-gray-100 text-gray-600' :
              'bg-blue-100 text-blue-700'
            }`}>
              {statusConfig?.label[lang] || rule.status}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          {onRun && rule.status === 'active' && (
            <button
              onClick={onRun}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              ▶ {labels.actions.run[lang]}
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {labels.actions.edit[lang]}
            </button>
          )}
          {onToggle && (
            <button
              onClick={() => onToggle(rule.status !== 'active')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {rule.status === 'active' ? labels.actions.pause[lang] : labels.actions.activate[lang]}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {(['definition', 'runs', 'exceptions', 'audit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {labels.tabs[tab][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'definition' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.domain[lang]}</label>
                <div className="mt-1 flex items-center gap-2">
                  <span>{domainConfig?.icon}</span>
                  <span className="font-medium">{domainConfig?.label[lang] || rule.domain}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.ruleType[lang]}</label>
                <div className="mt-1 font-medium">{typeConfig?.label[lang] || rule.ruleType}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.targetCollection[lang]}</label>
                <div className="mt-1 font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                  {rule.targetCollection}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.targetFields[lang]}</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rule.targetFields.map((field, idx) => (
                    <span key={idx} className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.severityDefault[lang]}</label>
                <div className="mt-1">
                  <DqSeverityPill severity={rule.severityDefault} lang={lang} />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.autoCreateTask[lang]}</label>
                <div className="mt-1 font-medium">
                  {rule.autoCreateTask ? labels.yes[lang] : labels.no[lang]}
                </div>
              </div>

              {rule.ownerRole && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.ownerRole[lang]}</label>
                  <div className="mt-1 font-medium">{rule.ownerRole}</div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.lastRun[lang]}</label>
                <div className="mt-1 text-sm text-gray-600">{formatDate(rule.lastRunAt)}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.exceptionsOpen[lang]}</label>
                <div className="mt-1 font-medium text-lg">
                  {rule.exceptionsCount || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'runs' && (
          <div className="text-center py-8 text-gray-500">
            {lang === 'ru' ? 'История запусков появится здесь' : 'Run history will appear here'}
          </div>
        )}

        {activeTab === 'exceptions' && (
          <div className="text-center py-8 text-gray-500">
            {lang === 'ru' ? 'Исключения от этого правила появятся здесь' : 'Exceptions from this rule will appear here'}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="text-center py-8 text-gray-500">
            {lang === 'ru' ? 'История изменений появится здесь' : 'Change history will appear here'}
          </div>
        )}
      </div>
    </div>
  );
}
