'use client';

/**
 * Data Quality Rules Table Component
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqRule, DQ_RULE_STATUS_CONFIG, getRuleIcon } from '../schema/dqRule';
import { DQ_DOMAINS, DQ_RULE_TYPES, DqDomain, DqRuleType } from '../config';
import { DqSeverityPill } from './DqSeverityPill';

interface DqRulesTableProps {
  rules: DqRule[];
  lang?: 'ru' | 'en' | 'uk';
  onRun?: (ruleId: string) => void;
  onToggle?: (ruleId: string, active: boolean) => void;
}

export function DqRulesTable({ rules, lang: propLang, onRun, onToggle }: DqRulesTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    name: { ru: 'Правило', en: 'Rule', uk: 'Правило' },
    domain: { ru: 'Домен', en: 'Domain', uk: 'Домен' },
    type: { ru: 'Тип', en: 'Type', uk: 'Тип' },
    severity: { ru: 'Severity', en: 'Severity', uk: 'Severity' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    lastRun: { ru: 'Последний запуск', en: 'Last Run', uk: 'Останній запуск' },
    exceptions: { ru: 'Исключения', en: 'Exceptions', uk: 'Винятки' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
  };

  const actions = {
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    run: { ru: 'Запустить', en: 'Run', uk: 'Запустити' },
    pause: { ru: 'Пауза', en: 'Pause', uk: 'Пауза' },
    activate: { ru: 'Активировать', en: 'Activate', uk: 'Активувати' },
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (rules.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'ru' ? 'Нет правил' : lang === 'uk' ? 'Немає правил' : 'No rules'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.name[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.domain[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.type[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.severity[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.status[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.lastRun[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.exceptions[lang]}</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">{headers.actions[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => {
            const domainConfig = DQ_DOMAINS[rule.domain as DqDomain];
            const typeConfig = DQ_RULE_TYPES[rule.ruleType as DqRuleType];
            const statusConfig = DQ_RULE_STATUS_CONFIG[rule.status];

            return (
              <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Link href={`/m/data-quality/rule/${rule.id}`} className="hover:text-blue-600">
                    <div className="flex items-center gap-2">
                      <span>{getRuleIcon(rule.ruleType)}</span>
                      <span className="font-medium text-gray-900">{rule.name}</span>
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>{domainConfig?.icon}</span>
                    <span>{domainConfig?.label[lang] || rule.domain}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {typeConfig?.label[lang] || rule.ruleType}
                </td>
                <td className="py-3 px-4 text-center">
                  <DqSeverityPill severity={rule.severityDefault} lang={lang} size="sm" />
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    rule.status === 'paused' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {statusConfig?.label[lang] || rule.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  {formatDate(rule.lastRunAt)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-medium ${
                    (rule.exceptionsCount || 0) > 0 ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {rule.exceptionsCount || 0}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/m/data-quality/rule/${rule.id}`}
                      className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      {actions.open[lang]}
                    </Link>
                    {onRun && rule.status === 'active' && (
                      <button
                        onClick={() => onRun(rule.id)}
                        className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {actions.run[lang]}
                      </button>
                    )}
                    {onToggle && (
                      <button
                        onClick={() => onToggle(rule.id, rule.status !== 'active')}
                        className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        {rule.status === 'active' ? actions.pause[lang] : actions.activate[lang]}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
