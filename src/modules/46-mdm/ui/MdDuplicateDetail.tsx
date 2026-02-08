"use client";

import { useState } from 'react';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { MdmRecordTypeKey } from '../config';

interface MatchReason {
  field: string;
  reason: string;
  weight: number;
  valueA: unknown;
  valueB: unknown;
}

interface MdmDuplicate {
  id: string;
  clientId: string;
  recordTypeKey: MdmRecordTypeKey;
  candidateAId: string;
  candidateBId: string;
  matchScore: number;
  reasonsJson?: MatchReason[];
  status: string;
  mergeJobId?: string;
  ignoredAt?: string;
  ignoredBy?: string;
  ignoredReason?: string;
  createdAt: string;
}

interface MdDuplicateDetailProps {
  duplicate: MdmDuplicate;
  recordA?: Record<string, unknown>;
  recordB?: Record<string, unknown>;
  onIgnore?: (reason: string) => void;
  onStartMerge?: () => void;
}

type Tab = 'comparison' | 'merge_plan' | 'audit';

const recordTypeLabels: Record<MdmRecordTypeKey, string> = {
  people: 'Люди',
  entities: 'Сущности',
  accounts: 'Счета',
  assets: 'Активы',
};

export function MdDuplicateDetail({
  duplicate,
  recordA,
  recordB,
  onIgnore,
  onStartMerge,
}: MdDuplicateDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('comparison');
  const [ignoreReason, setIgnoreReason] = useState('');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'comparison', label: 'Сравнение' },
    { key: 'merge_plan', label: 'План слияния' },
    { key: 'audit', label: 'Audit' },
  ];

  const chosenA = (recordA?.chosenJson || {}) as Record<string, unknown>;
  const chosenB = (recordB?.chosenJson || {}) as Record<string, unknown>;
  const allFields = new Set([...Object.keys(chosenA), ...Object.keys(chosenB)]);

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const valuesMatch = (a: unknown, b: unknown): boolean => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().trim() === b.toLowerCase().trim();
    }
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Дубликат #{duplicate.id.substring(0, 8)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-stone-500">
                {recordTypeLabels[duplicate.recordTypeKey] || duplicate.recordTypeKey}
              </span>
              <MdStatusPill status={duplicate.status} size="md" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500">Совпадение:</span>
                <MdConfidencePill value={Math.round(duplicate.matchScore * 100)} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {duplicate.status === 'open' && (
              <>
                <button
                  onClick={onStartMerge}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium text-sm hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                  Начать слияние
                </button>
                <button
                  onClick={() => onIgnore?.(ignoreReason || 'Не дубликат')}
                  className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-all"
                >
                  Игнорировать
                </button>
              </>
            )}
          </div>
        </div>

        {duplicate.status === 'ignored' && duplicate.ignoredReason && (
          <div className="mt-4 p-3 bg-stone-50 rounded-lg">
            <span className="text-sm text-stone-600">
              Игнорирован: {duplicate.ignoredReason}
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
        {activeTab === 'comparison' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700 w-1/4">
                    Поле
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700 w-3/8">
                    Кандидат A
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700 w-3/8">
                    Кандидат B
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(allFields).map((field) => {
                  const valueA = chosenA[field];
                  const valueB = chosenB[field];
                  const match = valuesMatch(valueA, valueB);

                  return (
                    <tr
                      key={field}
                      className={`
                        border-b border-stone-100 last:border-b-0
                        ${match ? 'bg-emerald-50/50' : 'bg-amber-50/50'}
                      `}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-stone-600">
                        {field}
                        {match && (
                          <span className="ml-2 text-xs text-emerald-600">совпадает</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-800">
                        {formatValue(valueA)}
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-800">
                        {formatValue(valueB)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'merge_plan' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Предварительный план слияния</h3>
            <p className="text-stone-500 mb-6">
              Для каждого поля будет выбрано значение на основе правил survivorship
            </p>

            <div className="space-y-3">
              {(duplicate.reasonsJson || []).map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-stone-700">{reason.field}</span>
                    <span className="text-stone-500 ml-2 text-sm">{reason.reason}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                    Вес: {(reason.weight * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            {duplicate.status === 'open' && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Слияние записей требует подтверждения ответственным лицом. Нажмите
                  "Начать слияние" для создания задачи на слияние.
                </p>
              </div>
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
