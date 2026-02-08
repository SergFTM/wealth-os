"use client";

import { useState } from 'react';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { MdFieldLineageCard } from './MdFieldLineageCard';
import { PersonTypeLabels, PersonTypeKey } from '../config';

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
  role?: string;
}

interface MdmPerson {
  id: string;
  clientId: string;
  status: string;
  personTypeKey: PersonTypeKey;
  chosenJson: Record<string, unknown>;
  sourcesJson: SourceData[];
  confidenceJson: Record<string, number>;
  overridesJson?: Record<string, { value: unknown; overriddenBy: string; reason?: string }>;
  relationshipsJson?: Relationship[];
  attachmentDocIdsJson?: string[];
  dqScore?: number;
  mergedIntoId?: string;
  createdAt: string;
  updatedAt: string;
}

interface MdPersonDetailProps {
  person: MdmPerson;
  onOverrideField?: (field: string, value: unknown) => void;
  onAcceptSource?: (field: string, sourceSystem: string) => void;
}

type Tab = 'golden' | 'sources' | 'relationships' | 'documents' | 'audit';

const FIELD_LABELS: Record<string, string> = {
  firstName: 'Имя',
  lastName: 'Фамилия',
  middleName: 'Отчество',
  displayName: 'Отображаемое имя',
  email: 'Email',
  phone: 'Телефон',
  dateOfBirth: 'Дата рождения',
  address: 'Адрес',
  taxResidency: 'Налоговое резидентство',
  nationality: 'Гражданство',
  passportNumber: 'Номер паспорта',
  ssn: 'SSN',
  tin: 'ИНН',
};

export function MdPersonDetail({
  person,
  onOverrideField,
  onAcceptSource,
}: MdPersonDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('golden');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'golden', label: 'Golden Record' },
    { key: 'sources', label: 'Источники' },
    { key: 'relationships', label: 'Связи' },
    { key: 'documents', label: 'Документы' },
    { key: 'audit', label: 'Audit' },
  ];

  const getSourcesForField = (field: string) => {
    return (person.sourcesJson || [])
      .filter((s) => s.fieldsJson[field] !== undefined)
      .map((s) => ({
        sourceSystem: s.sourceSystem,
        value: s.fieldsJson[field],
        asOf: s.asOf,
      }));
  };

  const displayName = String(person.chosenJson.displayName ||
    `${person.chosenJson.firstName || ''} ${person.chosenJson.lastName || ''}`.trim() ||
    'Без имени');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{displayName}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-stone-500">
                {PersonTypeLabels[person.personTypeKey]?.ru || person.personTypeKey}
              </span>
              <MdStatusPill status={person.status} size="md" />
              {person.dqScore !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-500">DQ:</span>
                  <MdConfidencePill value={person.dqScore} />
                </div>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-stone-500">
            <div>ID: {person.id}</div>
            <div>Обновлено: {new Date(person.updatedAt).toLocaleDateString('ru-RU')}</div>
          </div>
        </div>

        {person.mergedIntoId && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-sm text-purple-700">
              Эта запись объединена в: {person.mergedIntoId}
            </span>
          </div>
        )}
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
            {Object.entries(person.chosenJson).map(([field, value]) => (
              <MdFieldLineageCard
                key={field}
                field={field}
                label={FIELD_LABELS[field] || field}
                chosenValue={value}
                confidence={person.confidenceJson?.[field] || 0}
                sources={getSourcesForField(field)}
                isOverridden={!!person.overridesJson?.[field]}
                onAcceptSource={(sourceSystem) => onAcceptSource?.(field, sourceSystem)}
                onOverride={() => onOverrideField?.(field, value)}
              />
            ))}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-4">
            {(person.sourcesJson || []).map((source, idx) => (
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

        {activeTab === 'relationships' && (
          <div className="space-y-4">
            {(person.relationshipsJson || []).length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                Нет связей
              </div>
            ) : (
              (person.relationshipsJson || []).map((rel, idx) => (
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
                    {rel.role && <div className="text-xs text-stone-400">{rel.role}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {(person.attachmentDocIdsJson || []).length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                Нет прикрепленных документов
              </div>
            ) : (
              (person.attachmentDocIdsJson || []).map((docId, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 flex items-center gap-3"
                >
                  <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="font-medium text-stone-700">Document</div>
                    <div className="text-sm text-stone-500">{docId}</div>
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
