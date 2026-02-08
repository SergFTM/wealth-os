"use client";

import { useState } from 'react';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { MdFieldLineageCard } from './MdFieldLineageCard';
import { EntityTypeLabels, EntityTypeKey } from '../config';

interface SourceData {
  sourceSystem: string;
  sourceId?: string;
  asOf: string;
  fieldsJson: Record<string, unknown>;
}

interface Relationship {
  targetType: string;
  targetId: string;
  relationshipType: string;
  ownershipPct?: number;
  role?: string;
}

interface MdmEntity {
  id: string;
  clientId: string;
  status: string;
  entityTypeKey: EntityTypeKey;
  chosenJson: Record<string, unknown>;
  sourcesJson: SourceData[];
  confidenceJson: Record<string, number>;
  overridesJson?: Record<string, { value: unknown; overriddenBy: string; reason?: string }>;
  relationshipsJson?: Relationship[];
  dqScore?: number;
  mergedIntoId?: string;
  createdAt: string;
  updatedAt: string;
}

interface MdEntityDetailProps {
  entity: MdmEntity;
  onOverrideField?: (field: string, value: unknown) => void;
  onAcceptSource?: (field: string, sourceSystem: string) => void;
}

type Tab = 'golden' | 'sources' | 'ubos' | 'audit';

const FIELD_LABELS: Record<string, string> = {
  legalName: 'Юридическое название',
  displayName: 'Отображаемое имя',
  jurisdiction: 'Юрисдикция',
  registrationNumber: 'Регистрационный номер',
  taxId: 'Налоговый ID',
  incorporationDate: 'Дата регистрации',
  registeredAddress: 'Юридический адрес',
  operatingAddress: 'Операционный адрес',
  lei: 'LEI',
  giin: 'GIIN',
};

export function MdEntityDetail({
  entity,
  onOverrideField,
  onAcceptSource,
}: MdEntityDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('golden');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'golden', label: 'Golden Record' },
    { key: 'sources', label: 'Источники' },
    { key: 'ubos', label: 'UBOs и связи' },
    { key: 'audit', label: 'Audit' },
  ];

  const getSourcesForField = (field: string) => {
    return (entity.sourcesJson || [])
      .filter((s) => s.fieldsJson[field] !== undefined)
      .map((s) => ({
        sourceSystem: s.sourceSystem,
        value: s.fieldsJson[field],
        asOf: s.asOf,
      }));
  };

  const displayName = entity.chosenJson.displayName || entity.chosenJson.legalName || 'Без названия';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{String(displayName)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-stone-500">
                {EntityTypeLabels[entity.entityTypeKey]?.ru || entity.entityTypeKey}
              </span>
              <MdStatusPill status={entity.status} size="md" />
              {entity.dqScore !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-500">DQ:</span>
                  <MdConfidencePill value={entity.dqScore} />
                </div>
              )}
            </div>
            {Boolean(entity.chosenJson.jurisdiction) && (
              <div className="mt-2 text-sm text-stone-500">
                Юрисдикция: {String(entity.chosenJson.jurisdiction)}
              </div>
            )}
          </div>
          <div className="text-right text-sm text-stone-500">
            <div>ID: {entity.id}</div>
            <div>Обновлено: {new Date(entity.updatedAt).toLocaleDateString('ru-RU')}</div>
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
            {Object.entries(entity.chosenJson).map(([field, value]) => (
              <MdFieldLineageCard
                key={field}
                field={field}
                label={FIELD_LABELS[field] || field}
                chosenValue={value}
                confidence={entity.confidenceJson?.[field] || 0}
                sources={getSourcesForField(field)}
                isOverridden={!!entity.overridesJson?.[field]}
                onAcceptSource={(sourceSystem) => onAcceptSource?.(field, sourceSystem)}
                onOverride={() => onOverrideField?.(field, value)}
              />
            ))}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-4">
            {(entity.sourcesJson || []).map((source, idx) => (
              <div
                key={`${source.sourceSystem}-${idx}`}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800">{source.sourceSystem}</span>
                    {source.sourceId && (
                      <span className="text-xs text-stone-500">#{source.sourceId}</span>
                    )}
                  </div>
                  <span className="text-sm text-stone-500">
                    {new Date(source.asOf).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(source.fieldsJson).map(([field, val]) => (
                    <div key={field} className="text-sm">
                      <span className="text-stone-500">{FIELD_LABELS[field] || field}:</span>{' '}
                      <span className="text-stone-700">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ubos' && (
          <div className="space-y-4">
            {(entity.relationshipsJson || []).length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                Нет связей и UBO
              </div>
            ) : (
              (entity.relationshipsJson || []).map((rel, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-stone-800">{rel.targetType}</div>
                    <div className="text-sm text-stone-500">{rel.relationshipType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-stone-600">{rel.targetId}</div>
                    {rel.ownershipPct !== undefined && (
                      <div className="text-xs text-emerald-600">{rel.ownershipPct}% владения</div>
                    )}
                    {rel.role && <div className="text-xs text-stone-400">{rel.role}</div>}
                  </div>
                </div>
              ))
            )}
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
