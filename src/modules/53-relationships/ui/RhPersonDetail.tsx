"use client";

import React, { useState } from 'react';
import { RhRolePill } from './RhRolePill';
import { RhTierBadge } from './RhTierBadge';
import { RhTimeline, TimelineItem } from './RhTimeline';
import { RhRelationshipMap, MapNode, MapEdge } from './RhRelationshipMap';

export interface PersonDetailData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roleKey?: string;
  tierKey?: string;
  householdId?: string;
  householdName?: string;
  rmOwnerName?: string;
  consentSnapshot?: {
    hasGeneralConsent: boolean;
    hasSharingConsent: boolean;
    lastUpdated?: string;
  };
  notes?: string;
}

interface RhPersonDetailProps {
  person: PersonDetailData;
  relationships: { nodes: MapNode[]; edges: MapEdge[] };
  timeline: TimelineItem[];
  initiatives: Array<{ id: string; title: string; stageKey: string }>;
  coverage?: { primaryRm: string; backupRm?: string };
  documents?: Array<{ id: string; name: string; type: string }>;
  onTimelineItemClick?: (item: TimelineItem) => void;
  onNodeClick?: (node: MapNode) => void;
  onInitiativeClick?: (id: string) => void;
  onDocumentClick?: (id: string) => void;
}

type TabKey = 'overview' | 'map' | 'timeline' | 'initiatives' | 'coverage' | 'documents' | 'audit';

export function RhPersonDetail({
  person,
  relationships,
  timeline,
  initiatives,
  coverage,
  documents = [],
  onTimelineItemClick,
  onNodeClick,
  onInitiativeClick,
  onDocumentClick,
}: RhPersonDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'map', label: 'Карта связей' },
    { key: 'timeline', label: 'История' },
    { key: 'initiatives', label: 'Инициативы' },
    { key: 'coverage', label: 'Покрытие' },
    { key: 'documents', label: 'Документы' },
    { key: 'audit', label: 'Аудит' },
  ];

  const stageLabels: Record<string, string> = {
    idea: 'Идея',
    in_analysis: 'В анализе',
    in_progress: 'В работе',
    done: 'Завершено',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {person.roleKey && <RhRolePill role={person.roleKey} />}
              {person.tierKey && <RhTierBadge tier={person.tierKey} size="sm" />}
            </div>
          </div>
        </div>
        {person.householdName && (
          <div className="text-right text-sm text-gray-500">
            <p>Домохозяйство</p>
            <p className="font-medium text-gray-700">{person.householdName}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-3 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-64">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact cards */}
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Контактные данные</h3>
              {person.email && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">📧</span>
                  <a href={`mailto:${person.email}`} className="text-emerald-600 hover:underline">
                    {person.email}
                  </a>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">📞</span>
                  <a href={`tel:${person.phone}`} className="text-emerald-600 hover:underline">
                    {person.phone}
                  </a>
                </div>
              )}
              {person.rmOwnerName && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">👔</span>
                  <span>RM: {person.rmOwnerName}</span>
                </div>
              )}
            </div>

            {/* Consent snapshot */}
            {person.consentSnapshot && (
              <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Согласия</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={person.consentSnapshot.hasGeneralConsent ? 'text-emerald-600' : 'text-gray-400'}>
                      {person.consentSnapshot.hasGeneralConsent ? '✓' : '○'}
                    </span>
                    <span>Общее согласие</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={person.consentSnapshot.hasSharingConsent ? 'text-emerald-600' : 'text-gray-400'}>
                      {person.consentSnapshot.hasSharingConsent ? '✓' : '○'}
                    </span>
                    <span>Согласие на обмен данными</span>
                  </div>
                </div>
                {person.consentSnapshot.lastUpdated && (
                  <p className="text-xs text-gray-500">
                    Обновлено: {new Date(person.consentSnapshot.lastUpdated).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            )}

            {/* Notes */}
            {person.notes && (
              <div className="md:col-span-2 rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Заметки</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{person.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <RhRelationshipMap
            nodes={relationships.nodes}
            edges={relationships.edges}
            centerNodeId={`person:${person.id}`}
            onNodeClick={onNodeClick}
          />
        )}

        {activeTab === 'timeline' && (
          <RhTimeline items={timeline} onItemClick={onTimelineItemClick} />
        )}

        {activeTab === 'initiatives' && (
          <div className="space-y-3">
            {initiatives.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет связанных инициатив</p>
            ) : (
              initiatives.map((init) => (
                <div
                  key={init.id}
                  onClick={() => onInitiativeClick?.(init.id)}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{init.title}</p>
                    <span className="text-xs text-gray-500">{stageLabels[init.stageKey] || init.stageKey}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="rounded-xl border border-gray-200 p-4 space-y-4">
            {coverage ? (
              <>
                <div className="flex items-center gap-3">
                  <RhRolePill role="primary_rm" />
                  <span className="text-gray-700">{coverage.primaryRm}</span>
                </div>
                {coverage.backupRm && (
                  <div className="flex items-center gap-3">
                    <RhRolePill role="backup_rm" />
                    <span className="text-gray-700">{coverage.backupRm}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 py-4">Нет данных о покрытии</p>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет связанных документов</p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onDocumentClick?.(doc.id)}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">📄</span>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="text-center text-gray-500 py-8">
            Аудит событий будет отображен здесь
          </div>
        )}
      </div>
    </div>
  );
}

export default RhPersonDetail;
