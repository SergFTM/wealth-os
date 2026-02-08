"use client";

import React, { useState } from 'react';
import { RhPeopleTable, PersonRow } from './RhPeopleTable';
import { RhHouseholdsTable, HouseholdRow } from './RhHouseholdsTable';
import { RhRelationshipsTable, RelationshipRow } from './RhRelationshipsTable';
import { RhInteractionsTable, InteractionRow } from './RhInteractionsTable';
import { RhInitiativesTable, InitiativeRow } from './RhInitiativesTable';
import { RhCoverageTable, CoverageRow } from './RhCoverageTable';
import { RhVipCockpit, VipHouseholdView } from './RhVipCockpit';

type TabKey = 'people' | 'households' | 'relationships' | 'interactions' | 'initiatives' | 'coverage' | 'vip' | 'audit';

const TAB_CONFIG: { key: TabKey; label: string }[] = [
  { key: 'people', label: 'Люди' },
  { key: 'households', label: 'Домохозяйства' },
  { key: 'relationships', label: 'Связи' },
  { key: 'interactions', label: 'Взаимодействия' },
  { key: 'initiatives', label: 'Инициативы' },
  { key: 'coverage', label: 'Покрытие' },
  { key: 'vip', label: 'VIP' },
  { key: 'audit', label: 'Аудит' },
];

interface AuditEventRow {
  id: string;
  ts: string;
  actorName: string;
  action: string;
  collection: string;
  recordId: string;
  summary: string;
}

interface RhListPageProps {
  initialTab?: string;
  people: PersonRow[];
  households: HouseholdRow[];
  relationships: RelationshipRow[];
  interactions: InteractionRow[];
  initiatives: InitiativeRow[];
  coverages: CoverageRow[];
  vipHouseholds: VipHouseholdView[];
  auditEvents: AuditEventRow[];
  loading?: boolean;
  // Filters
  filters: {
    search: string;
    roleKey: string;
    tierKey: string;
    statusKey: string;
    period: string;
  };
  onFiltersChange: (filters: Record<string, string>) => void;
  // VIP actions
  onRefreshVip?: (householdId: string) => void;
  onPublishVip?: (householdId: string) => void;
  onCreateThread?: (householdId: string) => void;
  onCreateRequest?: (householdId: string) => void;
  onCreateInitiative?: (householdId: string) => void;
  onAssignCoverage?: (coverageId: string) => void;
}

export function RhListPage({
  initialTab,
  people,
  households,
  relationships,
  interactions,
  initiatives,
  coverages,
  vipHouseholds,
  auditEvents,
  loading,
  filters,
  onFiltersChange,
  onRefreshVip,
  onPublishVip,
  onCreateThread,
  onCreateRequest,
  onCreateInitiative,
  onAssignCoverage,
}: RhListPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>((initialTab as TabKey) || 'people');

  const counts: Record<TabKey, number> = {
    people: people.length,
    households: households.length,
    relationships: relationships.length,
    interactions: interactions.length,
    initiatives: initiatives.length,
    coverage: coverages.length,
    vip: vipHouseholds.length,
    audit: auditEvents.length,
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${activeTab === tab.key
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            placeholder="Поиск..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={filters.tierKey}
          onChange={(e) => onFiltersChange({ ...filters, tierKey: e.target.value })}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option value="">Все уровни</option>
          <option value="A">Tier A</option>
          <option value="B">Tier B</option>
          <option value="C">Tier C</option>
        </select>

        <select
          value={filters.statusKey}
          onChange={(e) => onFiltersChange({ ...filters, statusKey: e.target.value })}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option value="">Все статусы</option>
          <option value="open">Открыто</option>
          <option value="closed">Закрыто</option>
        </select>

        <select
          value={filters.period}
          onChange={(e) => onFiltersChange({ ...filters, period: e.target.value })}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option value="">Все время</option>
          <option value="7d">7 дней</option>
          <option value="30d">30 дней</option>
          <option value="90d">90 дней</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Tab Content */}
      {!loading && (
        <>
          {activeTab === 'people' && <RhPeopleTable people={people} />}
          {activeTab === 'households' && <RhHouseholdsTable households={households} />}
          {activeTab === 'relationships' && <RhRelationshipsTable relationships={relationships} />}
          {activeTab === 'interactions' && <RhInteractionsTable interactions={interactions} />}
          {activeTab === 'initiatives' && <RhInitiativesTable initiatives={initiatives} />}
          {activeTab === 'coverage' && (
            <RhCoverageTable coverages={coverages} onAssign={onAssignCoverage} />
          )}
          {activeTab === 'vip' && (
            <RhVipCockpit
              households={vipHouseholds}
              onRefresh={onRefreshVip}
              onPublish={onPublishVip}
              onCreateThread={onCreateThread}
              onCreateRequest={onCreateRequest}
              onCreateInitiative={onCreateInitiative}
            />
          )}
          {activeTab === 'audit' && (
            <AuditTable events={auditEvents} />
          )}
        </>
      )}
    </div>
  );
}

function AuditTable({ events }: { events: AuditEventRow[] }) {
  const formatDate = (ts: string) =>
    new Date(ts).toLocaleString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const actionLabels: Record<string, string> = {
    create: 'Создание',
    update: 'Обновление',
    delete: 'Удаление',
    approve: 'Согласование',
    view: 'Просмотр',
    share: 'Публикация',
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">📋</span>
        <p>Нет событий аудита</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Время</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Автор</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Действие</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Коллекция</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Описание</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50/50">
              <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(event.ts)}</td>
              <td className="px-4 py-3 font-medium text-gray-700">{event.actorName}</td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {actionLabels[event.action] || event.action}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">{event.collection}</td>
              <td className="px-4 py-3 text-gray-600">{event.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RhListPage;
