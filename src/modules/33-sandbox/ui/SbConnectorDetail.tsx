'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SbStatusPill } from './SbStatusPill';

interface Connector {
  id: string;
  connectorKey: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'error';
  configJson?: { responseDelayMs?: number; batchSize?: number; entityTypes?: string[] };
  errorInjectionJson?: { enabled?: boolean; failureRate?: number; errorTypes?: string[]; invalidFieldRate?: number };
  mappingIdsJson?: string[];
  lastJobId?: string;
  lastJobAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface SbConnectorDetailProps {
  connector: Connector;
  onRunTest?: () => void;
  onToggleErrorInjection?: (enabled: boolean, rate: number) => void;
}

const i18n = {
  ru: {
    back: '← Назад',
    config: 'Конфигурация',
    errorInjection: 'Error Injection',
    mappings: 'Привязанные маппинги',
    lastJob: 'Последний job',
    runTest: 'Запустить тест',
    generateSample: 'Сгенерировать sample payload',
    toggleError: 'Включить injection',
    failureRate: 'Частота ошибок',
    invalidRate: 'Невалидные поля',
  },
  en: {
    back: '← Back',
    config: 'Configuration',
    errorInjection: 'Error Injection',
    mappings: 'Linked Mappings',
    lastJob: 'Last Job',
    runTest: 'Run Test',
    generateSample: 'Generate sample payload',
    toggleError: 'Enable injection',
    failureRate: 'Failure Rate',
    invalidRate: 'Invalid Fields',
  },
  uk: {
    back: '← Назад',
    config: 'Конфігурація',
    errorInjection: 'Error Injection',
    mappings: 'Привязані маппінги',
    lastJob: 'Останній job',
    runTest: 'Запустити тест',
    generateSample: 'Згенерувати sample payload',
    toggleError: 'Увімкнути injection',
    failureRate: 'Частота помилок',
    invalidRate: 'Невалідні поля',
  },
};

export function SbConnectorDetail({ connector, onRunTest, onToggleErrorInjection }: SbConnectorDetailProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  const [errorEnabled, setErrorEnabled] = useState(connector.errorInjectionJson?.enabled || false);
  const [failureRate, setFailureRate] = useState(connector.errorInjectionJson?.failureRate || 0);

  const handleToggle = () => {
    const newEnabled = !errorEnabled;
    setErrorEnabled(newEnabled);
    onToggleErrorInjection?.(newEnabled, failureRate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/sandbox/list?tab=connectors')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-stone-800">{connector.name}</h1>
          <code className="text-sm bg-stone-100 px-2 py-0.5 rounded text-stone-600 mt-1 inline-block">
            {connector.connectorKey}
          </code>
        </div>
        <SbStatusPill status={connector.status} size="md" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Config */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">{t.config}</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">Response Delay</dt>
              <dd className="text-sm font-medium text-stone-800">
                {connector.configJson?.responseDelayMs || 100}ms
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">Batch Size</dt>
              <dd className="text-sm font-medium text-stone-800">
                {connector.configJson?.batchSize || 100}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500 mb-2">Entity Types</dt>
              <dd className="flex flex-wrap gap-1">
                {connector.configJson?.entityTypes?.map((type) => (
                  <span key={type} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                    {type}
                  </span>
                )) || <span className="text-sm text-stone-400">-</span>}
              </dd>
            </div>
          </dl>
        </div>

        {/* Error Injection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-100/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">{t.errorInjection}</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={errorEnabled}
                onChange={handleToggle}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-stone-700">{t.toggleError}</span>
            </label>

            {errorEnabled && (
              <>
                <div>
                  <label className="text-sm text-stone-500 block mb-1">{t.failureRate}: {failureRate}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={failureRate}
                    onChange={(e) => {
                      setFailureRate(Number(e.target.value));
                      onToggleErrorInjection?.(errorEnabled, Number(e.target.value));
                    }}
                    className="w-full"
                  />
                </div>
                <div className="text-xs text-stone-500">
                  Error types: {connector.errorInjectionJson?.errorTypes?.join(', ') || 'timeout, validation_error'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mappings */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">{t.mappings}</h3>
        {connector.mappingIdsJson && connector.mappingIdsJson.length > 0 ? (
          <div className="space-y-2">
            {connector.mappingIdsJson.map((mapId) => (
              <div
                key={mapId}
                onClick={() => router.push(`/m/sandbox/list?tab=mapping&id=${mapId}`)}
                className="flex items-center justify-between p-2 rounded-lg bg-stone-50 hover:bg-indigo-50 cursor-pointer"
              >
                <span className="text-sm text-stone-700">{mapId}</span>
                <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No linked mappings</p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={onRunTest}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            {t.runTest}
          </Button>
          <Button variant="secondary" onClick={() => alert('Sample payload generated (demo)')}>
            {t.generateSample}
          </Button>
        </div>
      </div>
    </div>
  );
}
