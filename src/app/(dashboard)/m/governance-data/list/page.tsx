'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { dataGovernanceConfig } from '@/modules/51-data-governance/config';
import {
  DgKpisTable,
  DgLineageTable,
  DgQualityScoresTable,
  DgReconsTable,
  DgOverridesTable,
  DgRulesTable,
} from '@/modules/51-data-governance/ui';
import {
  DataKpi,
  DataLineage,
  DataQualityScore,
  DataReconciliation,
  DataOverride,
  DataGovernanceRule,
} from '@/modules/51-data-governance/engine/types';
import { BaseRecord } from '@/db/storage/storage.types';

interface AuditEventRecord extends BaseRecord {
  ts: string;
  actorRole: string;
  actorName: string;
  action: string;
  collection: string;
  recordId: string;
  summary: string;
}

type TabKey = 'kpis' | 'lineage' | 'quality' | 'recons' | 'overrides' | 'rules' | 'audit';

export default function DataGovernanceListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'kpis';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Filters
  const [trustBadgeFilter, setTrustBadgeFilter] = useState<string>(searchParams.get('filter') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Data
  const { data: kpis = [] } = useCollection<DataKpi>('dataKpis');
  const { data: lineages = [] } = useCollection<DataLineage>('dataLineage');
  const { data: qualityScores = [] } = useCollection<DataQualityScore>('dataQualityScores');
  const { data: recons = [] } = useCollection<DataReconciliation>('dataReconciliations');
  const { data: overrides = [] } = useCollection<DataOverride>('dataOverrides');
  const { data: rules = [] } = useCollection<DataGovernanceRule>('dataGovernanceRules');
  const { data: auditEvents = [] } = useCollection<AuditEventRecord>('auditEvents');

  // Filter KPIs
  const filteredKpis = useMemo(() => {
    let result = kpis;
    if (trustBadgeFilter) {
      result = result.filter(k => k.trustBadgeKey === trustBadgeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(k =>
        k.name.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [kpis, trustBadgeFilter, searchQuery]);

  // Filter recons
  const filteredRecons = useMemo(() => {
    let result = recons;
    if (trustBadgeFilter === 'breaks') {
      result = result.filter(r => r.statusKey === 'break');
    }
    return result;
  }, [recons, trustBadgeFilter]);

  // Filter overrides
  const filteredOverrides = useMemo(() => {
    let result = overrides;
    if (statusFilter) {
      result = result.filter(o => o.statusKey === statusFilter);
    }
    return result;
  }, [overrides, statusFilter]);

  // Filter rules
  const filteredRules = useMemo(() => {
    let result = rules;
    if (statusFilter === 'enabled') {
      result = result.filter(r => r.enabled);
    } else if (statusFilter === 'disabled') {
      result = result.filter(r => !r.enabled);
    }
    return result;
  }, [rules, statusFilter]);

  // Filter quality scores
  const filteredQualityScores = useMemo(() => {
    let result = qualityScores;
    if (trustBadgeFilter === 'low') {
      result = result.filter(q => q.scoreTotal < 60);
    }
    return result;
  }, [qualityScores, trustBadgeFilter]);

  // Quality scores map
  const qualityScoresMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const qs of qualityScores) {
      if (qs.scopeKey === 'kpi' && qs.scopeId) {
        map[qs.scopeId] = qs.scoreTotal;
      }
    }
    return map;
  }, [qualityScores]);

  // Filter audit events for governance module
  const governanceAuditEvents = useMemo(() => {
    return auditEvents.filter(e =>
      ['dataKpis', 'dataLineage', 'dataQualityScores', 'dataReconciliations', 'dataOverrides', 'dataGovernanceRules'].includes(e.collection)
    );
  }, [auditEvents]);

  const tabs = dataGovernanceConfig.tabs || [];

  const handleToggleRuleEnabled = async (id: string, enabled: boolean) => {
    // Would call API to toggle rule
    console.log('Toggle rule:', id, enabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              {dataGovernanceConfig.title.ru}
            </h1>
          </div>
          <button
            onClick={() => router.push('/m/governance-data')}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as TabKey);
                  setTrustBadgeFilter('');
                  setStatusFilter('');
                }}
                className={`
                  px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'}
                `}
              >
                {tab.label.ru}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-stone-200/50">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {activeTab === 'kpis' && (
            <select
              value={trustBadgeFilter}
              onChange={(e) => setTrustBadgeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Все Trust Badges</option>
              <option value="verified">Verified</option>
              <option value="estimated">Estimated</option>
              <option value="stale">Stale</option>
            </select>
          )}

          {activeTab === 'quality' && (
            <select
              value={trustBadgeFilter}
              onChange={(e) => setTrustBadgeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Все уровни</option>
              <option value="low">Низкое качество (&lt;60%)</option>
            </select>
          )}

          {activeTab === 'recons' && (
            <select
              value={trustBadgeFilter}
              onChange={(e) => setTrustBadgeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Все статусы</option>
              <option value="breaks">Только Breaks</option>
            </select>
          )}

          {activeTab === 'overrides' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Все статусы</option>
              <option value="draft">Черновик</option>
              <option value="pending">Ожидает</option>
              <option value="approved">Одобрено</option>
              <option value="rejected">Отклонено</option>
              <option value="applied">Применено</option>
            </select>
          )}

          {activeTab === 'rules' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Все правила</option>
              <option value="enabled">Включенные</option>
              <option value="disabled">Отключенные</option>
            </select>
          )}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'kpis' && (
            <DgKpisTable
              kpis={filteredKpis}
              qualityScores={qualityScoresMap}
              onRowClick={(id) => router.push(`/m/governance-data/kpi/${id}`)}
            />
          )}

          {activeTab === 'lineage' && (
            <DgLineageTable
              lineages={lineages}
              onRowClick={(id) => router.push(`/m/governance-data/lineage/${id}`)}
            />
          )}

          {activeTab === 'quality' && (
            <DgQualityScoresTable
              scores={filteredQualityScores}
            />
          )}

          {activeTab === 'recons' && (
            <DgReconsTable
              recons={filteredRecons}
              onRowClick={(id) => router.push(`/m/governance-data/recon/${id}`)}
            />
          )}

          {activeTab === 'overrides' && (
            <DgOverridesTable
              overrides={filteredOverrides}
              onRowClick={(id) => router.push(`/m/governance-data/override/${id}`)}
            />
          )}

          {activeTab === 'rules' && (
            <DgRulesTable
              rules={filteredRules}
              onRowClick={(id) => router.push(`/m/governance-data/rule/${id}`)}
              onToggleEnabled={handleToggleRuleEnabled}
            />
          )}

          {activeTab === 'audit' && (
            <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white/80">
              <table className="min-w-full divide-y divide-stone-200/50">
                <thead className="bg-stone-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Время</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Действие</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Коллекция</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Описание</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Актор</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {governanceAuditEvents.slice(0, 50).map((event) => (
                    <tr key={event.id} className="hover:bg-stone-50/50">
                      <td className="px-4 py-3 text-sm text-stone-600">
                        {new Date(event.ts).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.action === 'create' ? 'bg-emerald-100 text-emerald-700' :
                          event.action === 'update' ? 'bg-blue-100 text-blue-700' :
                          event.action === 'delete' ? 'bg-red-100 text-red-700' :
                          event.action === 'approve' ? 'bg-green-100 text-green-700' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {event.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600">{event.collection}</td>
                      <td className="px-4 py-3 text-sm text-stone-800">{event.summary}</td>
                      <td className="px-4 py-3 text-sm text-stone-600">{event.actorName}</td>
                    </tr>
                  ))}
                  {governanceAuditEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                        Нет событий аудита
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
