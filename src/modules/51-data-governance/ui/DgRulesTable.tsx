'use client';

import React from 'react';
import Link from 'next/link';
import { DataGovernanceRule } from '../engine/types';
import { RULE_TYPES } from '../config';

interface DgRulesTableProps {
  rules: DataGovernanceRule[];
  onRowClick?: (id: string) => void;
  onToggleEnabled?: (id: string, enabled: boolean) => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgRulesTable({ rules, onRowClick, onToggleEnabled, locale = 'ru' }: DgRulesTableProps) {
  const renderAppliesTo = (rule: DataGovernanceRule) => {
    const appliesTo = rule.appliesToJson;
    if (appliesTo.allKpis) {
      return locale === 'ru' ? 'Все KPIs' : 'All KPIs';
    }
    if (appliesTo.domains?.length) {
      return appliesTo.domains.join(', ');
    }
    if (appliesTo.collections?.length) {
      return appliesTo.collections.join(', ');
    }
    return '—';
  };

  const renderConfig = (rule: DataGovernanceRule) => {
    const config = rule.configJson;
    const parts: string[] = [];

    if (config.threshold !== undefined) {
      parts.push(`${locale === 'ru' ? 'Порог' : 'Threshold'}: ${config.threshold}%`);
    }
    if (config.days !== undefined) {
      parts.push(`${locale === 'ru' ? 'Дней' : 'Days'}: ${config.days}`);
    }
    if (config.deltaPercent !== undefined) {
      parts.push(`${locale === 'ru' ? 'Дельта' : 'Delta'}: ${config.deltaPercent}%`);
    }
    if (config.severity) {
      parts.push(`${locale === 'ru' ? 'Severity' : 'Severity'}: ${config.severity}`);
    }

    return parts.length > 0 ? parts.join(', ') : '—';
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-stone-200/50">
        <thead className="bg-stone-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Правило' : 'Rule'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Тип' : 'Type'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Применяется к' : 'Applies To'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Конфигурация' : 'Config'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Auto Exception' : 'Auto Exception'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Включено' : 'Enabled'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rules.map((rule) => (
            <tr
              key={rule.id}
              onClick={() => onRowClick?.(rule.id)}
              className="hover:bg-stone-50/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/m/governance-data/rule/${rule.id}`}
                  className="font-medium text-stone-900 hover:text-emerald-600"
                >
                  {rule.name}
                </Link>
                {rule.description && (
                  <p className="text-xs text-stone-500 truncate max-w-xs">{rule.description}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-700">
                  {RULE_TYPES[rule.ruleTypeKey]?.[locale] || rule.ruleTypeKey}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {renderAppliesTo(rule)}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {renderConfig(rule)}
              </td>
              <td className="px-4 py-3">
                {rule.configJson.autoEmitException ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">
                    {locale === 'ru' ? 'Да' : 'Yes'}
                  </span>
                ) : (
                  <span className="text-xs text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleEnabled?.(rule.id, !rule.enabled);
                  }}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                    ${rule.enabled ? 'bg-emerald-500' : 'bg-stone-300'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                      transition duration-200 ease-in-out
                      ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </td>
            </tr>
          ))}
          {rules.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                {locale === 'ru' ? 'Нет правил' : 'No rules'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
