'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { dataGovernanceConfig } from '@/modules/51-data-governance/config';
import {
  DgKpiStrip,
  DgActionsBar,
  DgKpisTable,
  DgReconsTable,
  DgAiPanel,
} from '@/modules/51-data-governance/ui';
import { DataKpi, DataReconciliation, DataQualityScore, DataOverride, DataGovernanceRule } from '@/modules/51-data-governance/engine/types';
import { summarizeQualityRisks } from '@/modules/51-data-governance/engine/aiDataGovAssistant';

export default function DataGovernanceDashboardPage() {
  const router = useRouter();
  const [showAudit, setShowAudit] = useState(false);

  const { data: kpis = [] } = useCollection<DataKpi>('dataKpis');
  const { data: recons = [] } = useCollection<DataReconciliation>('dataReconciliations');
  const { data: qualityScores = [] } = useCollection<DataQualityScore>('dataQualityScores');
  const { data: overrides = [] } = useCollection<DataOverride>('dataOverrides');
  const { data: rules = [] } = useCollection<DataGovernanceRule>('dataGovernanceRules');
  const { data: exceptions = [] } = useCollection('exceptions');

  // Calculate KPIs
  const kpisTracked = kpis.length;
  const verifiedKpis = kpis.filter(k => k.trustBadgeKey === 'verified').length;
  const staleKpis = kpis.filter(k => k.trustBadgeKey === 'stale').length;
  const lowQualityScores = qualityScores.filter(q => q.scoreTotal < 60).length;
  const reconBreaksOpen = recons.filter(r => r.statusKey === 'break').length;
  const overridesPending = overrides.filter(o => o.statusKey === 'pending').length;
  const rulesEnabled = rules.filter(r => r.enabled).length;

  // Exceptions last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const exceptions7d = exceptions.filter((e: { createdAt: string }) =>
    new Date(e.createdAt) >= sevenDaysAgo
  ).length;

  const kpiStripData = [
    { key: 'kpisTracked', title: 'KPIs отслеживается', value: kpisTracked, status: 'ok' as const, href: '/m/governance-data/list?tab=kpis' },
    { key: 'verifiedKpis', title: 'Verified KPIs', value: verifiedKpis, status: 'ok' as const, href: '/m/governance-data/list?tab=kpis&filter=verified' },
    { key: 'staleKpis', title: 'Stale KPIs', value: staleKpis, status: staleKpis > 0 ? 'warning' as const : 'ok' as const, href: '/m/governance-data/list?tab=kpis&filter=stale' },
    { key: 'lowQuality', title: 'Низкое качество', value: lowQualityScores, status: lowQualityScores > 0 ? 'critical' as const : 'ok' as const, href: '/m/governance-data/list?tab=quality&filter=low' },
    { key: 'reconBreaks', title: 'Расхождения', value: reconBreaksOpen, status: reconBreaksOpen > 0 ? 'critical' as const : 'ok' as const, href: '/m/governance-data/list?tab=recons&filter=breaks' },
    { key: 'overridesPending', title: 'Ожидают одобрения', value: overridesPending, status: overridesPending > 0 ? 'warning' as const : 'ok' as const, href: '/m/governance-data/list?tab=overrides&status=pending' },
    { key: 'rulesEnabled', title: 'Правил активно', value: rulesEnabled, status: 'ok' as const, href: '/m/governance-data/list?tab=rules&status=enabled' },
    { key: 'exceptions7d', title: 'Exceptions 7д', value: exceptions7d, status: exceptions7d > 0 ? 'warning' as const : 'ok' as const, href: '/m/governance-data/list?tab=recons&period=7d' },
  ];

  // Quality scores map for KPIs table
  const qualityScoresMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const qs of qualityScores) {
      if (qs.scopeKey === 'kpi' && qs.scopeId) {
        map[qs.scopeId] = qs.scoreTotal;
      }
    }
    return map;
  }, [qualityScores]);

  // AI Quality Risks
  const aiQualityData = useMemo(() => {
    return summarizeQualityRisks(qualityScores, 'ru');
  }, [qualityScores]);

  // Actions
  const actions = [
    {
      key: 'createKpi',
      label: 'Создать KPI',
      variant: 'primary' as const,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
      onClick: () => console.log('Create KPI'),
    },
    {
      key: 'defineLineage',
      label: 'Определить Lineage',
      variant: 'secondary' as const,
      onClick: () => console.log('Define Lineage'),
    },
    {
      key: 'runQuality',
      label: 'Запустить Quality',
      variant: 'secondary' as const,
      onClick: () => console.log('Run Quality'),
    },
    {
      key: 'runRecon',
      label: 'Запустить Recon',
      variant: 'secondary' as const,
      onClick: () => console.log('Run Recon'),
    },
    {
      key: 'createOverride',
      label: 'Создать Override',
      variant: 'ghost' as const,
      onClick: () => console.log('Create Override'),
    },
  ];

  // Preview data
  const previewKpis = kpis.slice(0, 5);
  const previewRecons = recons.filter(r => r.statusKey === 'break').slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              {dataGovernanceConfig.title.ru}
            </h1>
            <p className="text-stone-600 mt-1">
              {dataGovernanceConfig.description?.ru}
            </p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/50">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-800">
              {dataGovernanceConfig.disclaimer?.ru}
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <DgKpiStrip kpis={kpiStripData} />

        {/* Actions Bar */}
        <DgActionsBar actions={actions} onAuditClick={() => setShowAudit(true)} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPIs Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-800">KPIs</h2>
              <button
                onClick={() => router.push('/m/governance-data/list?tab=kpis')}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Все KPIs →
              </button>
            </div>
            <DgKpisTable
              kpis={previewKpis}
              qualityScores={qualityScoresMap}
              onRowClick={(id) => router.push(`/m/governance-data/kpi/${id}`)}
            />
          </div>

          {/* AI Panel */}
          <div className="space-y-4">
            <DgAiPanel
              mode="quality"
              qualityRisks={aiQualityData.risks}
              qualitySummary={aiQualityData.summary}
            />
          </div>
        </div>

        {/* Recon Breaks */}
        {previewRecons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-800">Расхождения (Breaks)</h2>
              <button
                onClick={() => router.push('/m/governance-data/list?tab=recons&filter=breaks')}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Все сверки →
              </button>
            </div>
            <DgReconsTable
              recons={previewRecons}
              onRowClick={(id) => router.push(`/m/governance-data/recon/${id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
