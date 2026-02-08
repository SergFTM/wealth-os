"use client";

import { useState } from 'react';
import { PlStatusPill } from './PlStatusPill';
import { PlTagChips } from './PlTagChips';
import { PlLinksPanel } from './PlLinksPanel';
import { PlAiPanel } from './PlAiPanel';
import { PlVersionsTable } from './PlVersionsTable';
import { PlAcknowledgementsTable } from './PlAcknowledgementsTable';
import { PolicyCategoryLabels, PolicyCategoryKey } from '../config';

interface Policy {
  id: string;
  title: string;
  categoryKey: PolicyCategoryKey;
  status: string;
  currentVersionId?: string;
  currentVersionLabel?: string;
  ownerUserId?: string;
  ownerName?: string;
  bodyMdRu: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  clientSafePublished: boolean;
  tagsJson?: string[];
  linkedIpsId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlPolicyDetailProps {
  policy: Policy;
  versions?: Array<{
    id: string;
    docType: 'policy' | 'sop';
    docTitle: string;
    versionLabel: string;
    status: string;
    createdByName?: string;
    publishedAt?: string;
    createdAt: string;
  }>;
  acknowledgements?: Array<{
    id: string;
    docType: 'policy' | 'sop';
    docTitle: string;
    versionLabel: string;
    subjectName: string;
    status: string;
    dueAt: string;
    acknowledgedAt?: string;
  }>;
  links?: Array<{
    id: string;
    policyId?: string;
    policyTitle?: string;
    sopId?: string;
    sopTitle?: string;
    linkedType: 'case' | 'incident' | 'breach' | 'ips';
    linkedId: string;
    linkedTitle: string;
    notes?: string;
    createdAt: string;
  }>;
  onCreateVersion?: () => void;
  onRequestAck?: () => void;
  onAddLink?: () => void;
  onPublish?: () => void;
}

type TabKey = 'overview' | 'content' | 'versions' | 'ack' | 'links' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Обзор' },
  { key: 'content', label: 'Содержание' },
  { key: 'versions', label: 'Версии' },
  { key: 'ack', label: 'Подтверждения' },
  { key: 'links', label: 'Связи' },
  { key: 'audit', label: 'Audit' },
];

export function PlPolicyDetail({
  policy,
  versions = [],
  acknowledgements = [],
  links = [],
  onCreateVersion,
  onRequestAck,
  onAddLink,
  onPublish,
}: PlPolicyDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{policy.title}</h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-sm px-3 py-1">
                {PolicyCategoryLabels[policy.categoryKey]?.ru || policy.categoryKey}
              </span>
              <PlStatusPill status={policy.status} size="md" />
              {policy.currentVersionLabel && (
                <span className="font-mono text-sm text-stone-600">{policy.currentVersionLabel}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {policy.clientSafePublished && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full border border-emerald-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Client-safe
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-stone-500">Владелец:</span>
            <div className="font-medium text-stone-800">
              {policy.ownerName || <span className="text-amber-600">Не назначен</span>}
            </div>
          </div>
          <div>
            <span className="text-stone-500">Создан:</span>
            <div className="font-medium text-stone-800">{formatDate(policy.createdAt)}</div>
          </div>
          <div>
            <span className="text-stone-500">Обновлен:</span>
            <div className="font-medium text-stone-800">{formatDate(policy.updatedAt)}</div>
          </div>
          <div>
            <span className="text-stone-500">Теги:</span>
            <div className="mt-1">
              <PlTagChips tags={policy.tagsJson || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-stone-200'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Краткое описание</h3>
              <div className="prose prose-stone prose-sm max-w-none">
                {policy.bodyMdRu ? (
                  <div className="whitespace-pre-wrap">{policy.bodyMdRu.slice(0, 500)}...</div>
                ) : (
                  <p className="text-stone-500">Содержание не заполнено</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                {onCreateVersion && (
                  <button
                    onClick={onCreateVersion}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Создать версию
                  </button>
                )}
                {onPublish && (
                  <button
                    onClick={onPublish}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Опубликовать
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Полное содержание</h3>
              <div className="prose prose-stone max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm bg-stone-50 p-4 rounded-lg border border-stone-200 max-h-[600px] overflow-auto">
                  {policy.bodyMdRu || 'Содержание не заполнено'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">История версий</h3>
                {onCreateVersion && (
                  <button
                    onClick={onCreateVersion}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    + Новая версия
                  </button>
                )}
              </div>
              <PlVersionsTable versions={versions} />
            </div>
          )}

          {activeTab === 'ack' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">Подтверждения ознакомления</h3>
                {onRequestAck && (
                  <button
                    onClick={onRequestAck}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    + Запросить
                  </button>
                )}
              </div>
              <PlAcknowledgementsTable acknowledgements={acknowledgements} />
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-800">Связи с кейсами и инцидентами</h3>
              <PlLinksPanel links={links} onAdd={onAddLink} />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Audit Trail</h3>
              <p className="text-stone-500 text-sm">История изменений загружается из auditEvents</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <PlAiPanel
            content={policy.bodyMdRu || ''}
            title={policy.title}
            locale="ru"
          />

          {activeTab !== 'links' && links.length > 0 && (
            <PlLinksPanel links={links.slice(0, 3)} onAdd={onAddLink} />
          )}
        </div>
      </div>
    </div>
  );
}
