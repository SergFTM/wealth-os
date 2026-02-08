"use client";

import { useState } from 'react';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { MdFieldLineageCard } from './MdFieldLineageCard';
import { AssetTypeLabels, AssetTypeKey } from '../config';

interface SourceData {
  sourceSystem: string;
  sourceId?: string;
  asOf: string;
  fieldsJson: Record<string, unknown>;
}

interface MdmAsset {
  id: string;
  clientId: string;
  status: string;
  assetTypeKey: AssetTypeKey;
  chosenJson: Record<string, unknown>;
  identifiersJson?: Record<string, string>;
  sourcesJson: SourceData[];
  confidenceJson: Record<string, number>;
  overridesJson?: Record<string, { value: unknown; overriddenBy: string; reason?: string }>;
  dqScore?: number;
  mergedIntoId?: string;
  createdAt: string;
  updatedAt: string;
}

interface MdAssetDetailProps {
  asset: MdmAsset;
  onOverrideField?: (field: string, value: unknown) => void;
  onAcceptSource?: (field: string, sourceSystem: string) => void;
}

type Tab = 'golden' | 'identifiers' | 'sources' | 'positions' | 'audit';

const FIELD_LABELS: Record<string, string> = {
  name: 'Название',
  displayName: 'Отображаемое имя',
  ticker: 'Тикер',
  isin: 'ISIN',
  cusip: 'CUSIP',
  sedol: 'SEDOL',
  exchange: 'Биржа',
  currency: 'Валюта',
  assetClass: 'Класс актива',
  sector: 'Сектор',
  country: 'Страна',
  description: 'Описание',
  bloomberg: 'Bloomberg ID',
  reuters: 'Reuters ID',
  internalKey: 'Внутренний ключ',
};

export function MdAssetDetail({
  asset,
  onOverrideField,
  onAcceptSource,
}: MdAssetDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('golden');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'golden', label: 'Golden Record' },
    { key: 'identifiers', label: 'Идентификаторы' },
    { key: 'sources', label: 'Источники' },
    { key: 'positions', label: 'Позиции' },
    { key: 'audit', label: 'Audit' },
  ];

  const getSourcesForField = (field: string) => {
    return (asset.sourcesJson || [])
      .filter((s) => s.fieldsJson[field] !== undefined)
      .map((s) => ({
        sourceSystem: s.sourceSystem,
        value: s.fieldsJson[field],
        asOf: s.asOf,
      }));
  };

  const displayName = asset.chosenJson.displayName || asset.chosenJson.name ||
    asset.chosenJson.ticker || 'Без названия';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{String(displayName)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-stone-500">
                {AssetTypeLabels[asset.assetTypeKey]?.ru || asset.assetTypeKey}
              </span>
              <MdStatusPill status={asset.status} size="md" />
              {asset.dqScore !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-500">DQ:</span>
                  <MdConfidencePill value={asset.dqScore} />
                </div>
              )}
            </div>
            {Boolean(asset.chosenJson.ticker) && (
              <div className="mt-2 text-lg font-mono text-emerald-600">
                {String(asset.chosenJson.ticker)}
                {Boolean(asset.chosenJson.exchange) && (
                  <span className="text-stone-400 text-sm ml-2">
                    ({String(asset.chosenJson.exchange)})
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right text-sm text-stone-500">
            <div>ID: {asset.id}</div>
            <div>Обновлено: {new Date(asset.updatedAt).toLocaleDateString('ru-RU')}</div>
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
            {Object.entries(asset.chosenJson).map(([field, value]) => (
              <MdFieldLineageCard
                key={field}
                field={field}
                label={FIELD_LABELS[field] || field}
                chosenValue={value}
                confidence={asset.confidenceJson?.[field] || 0}
                sources={getSourcesForField(field)}
                isOverridden={!!asset.overridesJson?.[field]}
                onAcceptSource={(sourceSystem) => onAcceptSource?.(field, sourceSystem)}
                onOverride={() => onOverrideField?.(field, value)}
              />
            ))}
          </div>
        )}

        {activeTab === 'identifiers' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Все идентификаторы</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(asset.identifiersJson || {}).map(([key, value]) => (
                <div key={key} className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xs text-stone-500 uppercase">{key}</div>
                  <div className="font-mono text-stone-800">{value || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-4">
            {(asset.sourcesJson || []).map((source, idx) => (
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

        {activeTab === 'positions' && (
          <div className="text-center py-12 text-stone-500">
            Позиции загружаются из портфельного модуля
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
