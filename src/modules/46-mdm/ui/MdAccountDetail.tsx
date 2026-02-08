"use client";

import { useState } from 'react';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { MdFieldLineageCard } from './MdFieldLineageCard';
import { AccountTypeLabels, AccountTypeKey } from '../config';

interface SourceData {
  sourceSystem: string;
  sourceId?: string;
  asOf: string;
  fieldsJson: Record<string, unknown>;
}

interface MdmAccount {
  id: string;
  clientId: string;
  status: string;
  accountTypeKey: AccountTypeKey;
  chosenJson: Record<string, unknown>;
  sourcesJson: SourceData[];
  confidenceJson: Record<string, number>;
  overridesJson?: Record<string, { value: unknown; overriddenBy: string; reason?: string }>;
  linkedEntityId?: string;
  dqScore?: number;
  mergedIntoId?: string;
  createdAt: string;
  updatedAt: string;
}

interface MdAccountDetailProps {
  account: MdmAccount;
  onOverrideField?: (field: string, value: unknown) => void;
  onAcceptSource?: (field: string, sourceSystem: string) => void;
}

type Tab = 'golden' | 'sources' | 'mapping' | 'audit';

const FIELD_LABELS: Record<string, string> = {
  accountName: 'Название счета',
  institution: 'Институция',
  accountNumber: 'Номер счета',
  accountNumberMasked: 'Номер (маскированный)',
  currency: 'Валюта',
  iban: 'IBAN',
  swift: 'SWIFT',
  routingNumber: 'Routing Number',
  openedDate: 'Дата открытия',
  relationship: 'Тип отношений',
};

export function MdAccountDetail({
  account,
  onOverrideField,
  onAcceptSource,
}: MdAccountDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('golden');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'golden', label: 'Golden Record' },
    { key: 'sources', label: 'Источники' },
    { key: 'mapping', label: 'Mapping' },
    { key: 'audit', label: 'Audit' },
  ];

  const getSourcesForField = (field: string) => {
    return (account.sourcesJson || [])
      .filter((s) => s.fieldsJson[field] !== undefined)
      .map((s) => ({
        sourceSystem: s.sourceSystem,
        value: s.fieldsJson[field],
        asOf: s.asOf,
      }));
  };

  const displayName = account.chosenJson.accountName ||
    `${account.chosenJson.institution} - ${account.chosenJson.accountNumberMasked || '****'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{String(displayName)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-stone-500">
                {AccountTypeLabels[account.accountTypeKey]?.ru || account.accountTypeKey}
              </span>
              <MdStatusPill status={account.status} size="md" />
              {account.dqScore !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-500">DQ:</span>
                  <MdConfidencePill value={account.dqScore} />
                </div>
              )}
            </div>
            {account.linkedEntityId && (
              <div className="mt-2 text-sm text-stone-500">
                Связан с: {account.linkedEntityId}
              </div>
            )}
          </div>
          <div className="text-right text-sm text-stone-500">
            <div>ID: {account.id}</div>
            <div>Обновлено: {new Date(account.updatedAt).toLocaleDateString('ru-RU')}</div>
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
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${activeTab === tab.key
                  ? 'bg-white border-t border-l border-r border-stone-200 text-emerald-700 -mb-px'
                  : 'text-stone-500 hover:text-stone-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'golden' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(account.chosenJson).map(([field, value]) => (
              <MdFieldLineageCard
                key={field}
                field={field}
                label={FIELD_LABELS[field] || field}
                chosenValue={value}
                confidence={account.confidenceJson?.[field] || 0}
                sources={getSourcesForField(field)}
                isOverridden={!!account.overridesJson?.[field]}
                onAcceptSource={(sourceSystem) => onAcceptSource?.(field, sourceSystem)}
                onOverride={() => onOverrideField?.(field, value)}
              />
            ))}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-4">
            {(account.sourcesJson || []).map((source, idx) => (
              <div
                key={`${source.sourceSystem}-${idx}`}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-stone-800">{source.sourceSystem}</span>
                  <span className="text-sm text-stone-500">
                    {new Date(source.asOf).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(source.fieldsJson).map(([field, val]) => (
                    <div key={field} className="text-sm">
                      <span className="text-stone-500">{FIELD_LABELS[field] || field}:</span>{' '}
                      <span className="text-stone-700">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mapping' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Источники и маппинги</h3>
            <p className="text-stone-500">
              Информация о маппинге счета к источникам данных
            </p>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="text-center py-12 text-stone-500">
            Audit события загружаются отдельно
          </div>
        )}
      </div>
    </div>
  );
}
