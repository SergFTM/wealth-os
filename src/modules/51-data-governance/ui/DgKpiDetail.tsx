'use client';

import React, { useState } from 'react';
import { DataKpi, DataLineage, DataQualityScore, DataReconciliation, DataOverride, WhyThisNumber } from '../engine/types';
import { DgTrustBadge } from './DgTrustBadge';
import { DgWhyThisNumberCard } from './DgWhyThisNumberCard';
import { DgSourcesPanel } from './DgSourcesPanel';
import { DgAiPanel } from './DgAiPanel';
import { KPI_DOMAINS } from '../config';

interface DgKpiDetailProps {
  kpi: DataKpi;
  lineage?: DataLineage;
  qualityScore?: DataQualityScore;
  recons?: DataReconciliation[];
  overrides?: DataOverride[];
  whyThisNumber?: WhyThisNumber;
  onEdit?: () => void;
  onDefineLineage?: () => void;
  onRunQuality?: () => void;
  locale?: 'ru' | 'en' | 'uk';
}

type TabKey = 'overview' | 'why' | 'lineage' | 'sources' | 'quality' | 'recon' | 'overrides' | 'audit';

export function DgKpiDetail({
  kpi,
  lineage,
  qualityScore,
  recons = [],
  overrides = [],
  whyThisNumber,
  onEdit,
  onDefineLineage,
  onRunQuality,
  locale = 'ru',
}: DgKpiDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'overview', label: locale === 'ru' ? 'Обзор' : 'Overview' },
    { key: 'why', label: locale === 'ru' ? 'Почему это число' : 'Why This Number' },
    { key: 'lineage', label: 'Lineage' },
    { key: 'sources', label: locale === 'ru' ? 'Источники' : 'Sources' },
    { key: 'quality', label: locale === 'ru' ? 'Качество' : 'Quality' },
    { key: 'recon', label: locale === 'ru' ? 'Сверки' : 'Reconciliation' },
    { key: 'overrides', label: 'Overrides' },
    { key: 'audit', label: 'Audit' },
  ];

  const formatValue = (val?: { value: number; currency?: string }) => {
    if (!val) return '—';
    if (val.currency) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: val.currency,
        maximumFractionDigits: 0,
      }).format(val.value);
    }
    return new Intl.NumberFormat('ru-RU').format(val.value);
  };

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
            <h1 className="text-2xl font-bold text-stone-900">{kpi.name}</h1>
            <DgTrustBadge badge={kpi.trustBadgeKey} size="md" locale={locale} />
          </div>
          <p className="text-stone-600 mt-1">{kpi.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
            <span>{KPI_DOMAINS[kpi.domainKey]?.[locale] || kpi.domainKey}</span>
            <span>•</span>
            <span>As-of: {formatDate(kpi.asOf)}</span>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            {locale === 'ru' ? 'Редактировать' : 'Edit'}
          </button>
        )}
      </div>

      {/* Value Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50/50 border border-stone-200/50">
        <div className="text-sm text-stone-500 mb-1">
          {locale === 'ru' ? 'Текущее значение' : 'Current Value'}
        </div>
        <div className="text-4xl font-bold text-stone-900">
          {formatValue(kpi.lastValueJson)}
        </div>
        {qualityScore && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-stone-500">Quality Score:</span>
            <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  qualityScore.scoreTotal >= 80
                    ? 'bg-emerald-500'
                    : qualityScore.scoreTotal >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${qualityScore.scoreTotal}%` }}
              />
            </div>
            <span className="text-sm font-medium">{qualityScore.scoreTotal}%</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
                <h3 className="font-medium text-stone-800 mb-2">
                  {locale === 'ru' ? 'Формула' : 'Formula'}
                </h3>
                <code className="text-sm text-stone-600 block p-2 bg-white rounded">
                  {kpi.formulaText || '—'}
                </code>
              </div>
              {kpi.assumptionsText && (
                <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
                  <h3 className="font-medium text-stone-800 mb-2">
                    {locale === 'ru' ? 'Допущения' : 'Assumptions'}
                  </h3>
                  <p className="text-sm text-stone-600 whitespace-pre-wrap">{kpi.assumptionsText}</p>
                </div>
              )}
            </div>
            <DgAiPanel
              mode="lineage"
              explanation={whyThisNumber ? {
                text: `${kpi.description}\n\nФормула: ${kpi.formulaText}`,
                confidence: qualityScore && qualityScore.scoreTotal >= 80 ? 'high' : 'medium',
                sources: lineage?.inputsJson.map(i => i.collection) || [],
                assumptions: kpi.assumptionsText?.split('\n').filter(a => a.trim()) || [],
                disclaimer: '',
              } : undefined}
              locale={locale}
            />
          </div>
        )}

        {activeTab === 'why' && whyThisNumber && (
          <DgWhyThisNumberCard data={whyThisNumber} locale={locale} />
        )}

        {activeTab === 'lineage' && (
          <div className="space-y-4">
            {lineage ? (
              <div className="space-y-4">
                {/* Inputs */}
                <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200/50">
                  <h3 className="font-medium text-stone-800 mb-3">
                    {locale === 'ru' ? 'Входные данные' : 'Inputs'}
                  </h3>
                  <div className="grid gap-2">
                    {lineage.inputsJson.map((input, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-blue-100">
                        <div className="font-medium text-stone-800">{input.collection}</div>
                        <div className="text-xs text-stone-500 mt-1">
                          {locale === 'ru' ? 'Поля:' : 'Fields:'} {input.fields.join(', ')}
                        </div>
                        {input.sourceNotes && (
                          <div className="text-xs text-stone-400 mt-1">{input.sourceNotes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transforms */}
                <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-200/50">
                  <h3 className="font-medium text-stone-800 mb-3">
                    {locale === 'ru' ? 'Этапы обработки' : 'Transforms'}
                  </h3>
                  <div className="space-y-3">
                    {lineage.transformsJson.map((t) => (
                      <div key={t.stepNo} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium">
                          {t.stepNo}
                        </div>
                        <div className="flex-1 p-3 bg-white rounded-lg border border-purple-100">
                          <div className="font-medium text-stone-800">{t.title}</div>
                          <div className="text-sm text-stone-600 mt-1">{t.description}</div>
                          {t.formula && (
                            <code className="text-xs text-stone-500 block mt-1">{t.formula}</code>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-500 mb-4">
                  {locale === 'ru' ? 'Lineage не определен для этого KPI' : 'No lineage defined for this KPI'}
                </p>
                {onDefineLineage && (
                  <button
                    onClick={onDefineLineage}
                    className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {locale === 'ru' ? 'Определить Lineage' : 'Define Lineage'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sources' && (
          <DgSourcesPanel
            sources={lineage?.inputsJson.map(i => ({
              name: i.collection,
              type: 'collection',
              collection: i.collection,
              lastSync: kpi.asOf,
              status: 'ok' as const,
            })) || []}
            locale={locale}
          />
        )}

        {activeTab === 'quality' && (
          <div className="space-y-4">
            {qualityScore ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50 text-center">
                  <div className="text-3xl font-bold text-stone-900">{qualityScore.completenessScore}%</div>
                  <div className="text-sm text-stone-500">{locale === 'ru' ? 'Полнота' : 'Completeness'}</div>
                </div>
                <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50 text-center">
                  <div className="text-3xl font-bold text-stone-900">{qualityScore.freshnessScore}%</div>
                  <div className="text-sm text-stone-500">{locale === 'ru' ? 'Свежесть' : 'Freshness'}</div>
                </div>
                <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50 text-center">
                  <div className="text-3xl font-bold text-stone-900">{qualityScore.consistencyScore}%</div>
                  <div className="text-sm text-stone-500">{locale === 'ru' ? 'Консистентность' : 'Consistency'}</div>
                </div>
                <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50 text-center">
                  <div className="text-3xl font-bold text-stone-900">{qualityScore.coverageScore}%</div>
                  <div className="text-sm text-stone-500">{locale === 'ru' ? 'Покрытие' : 'Coverage'}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-500 mb-4">
                  {locale === 'ru' ? 'Quality score не рассчитан' : 'Quality score not computed'}
                </p>
                {onRunQuality && (
                  <button
                    onClick={onRunQuality}
                    className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {locale === 'ru' ? 'Запустить Quality' : 'Run Quality'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recon' && (
          <div className="space-y-2">
            {recons.length > 0 ? (
              recons.map((r) => (
                <div key={r.id} className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-800">{r.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      r.statusKey === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.statusKey}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-stone-500">
                {locale === 'ru' ? 'Нет связанных сверок' : 'No linked reconciliations'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'overrides' && (
          <div className="space-y-2">
            {overrides.length > 0 ? (
              overrides.map((o) => (
                <div key={o.id} className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-800">{o.reason}</span>
                    <span className="text-sm text-stone-500">{o.statusKey}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-stone-500">
                {locale === 'ru' ? 'Нет overrides' : 'No overrides'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <p className="text-center py-8 text-stone-500">
            {locale === 'ru' ? 'Audit trail будет показан здесь' : 'Audit trail will be shown here'}
          </p>
        )}
      </div>
    </div>
  );
}
