'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface Payload {
  id: string;
  jobId: string;
  connectorId: string;
  entityType: string;
  direction?: 'inbound' | 'outbound';
  payloadJson?: Record<string, unknown>;
  payloadSize?: number;
  recordCount?: number;
  validationJson?: { valid?: boolean; errors?: Array<{ field?: string; message?: string }>; warnings?: unknown[] };
  mappingOutputJson?: Record<string, unknown>;
  createdAt: string;
}

interface SbPayloadDetailProps {
  payload: Payload;
}

const i18n = {
  ru: { back: '← Назад', rawPayload: 'Raw Payload', validation: 'Валидация', mappingOutput: 'Mapping Output', copyJson: 'Копировать JSON', valid: 'Валидно', invalid: 'Невалидно', errors: 'Ошибки', warnings: 'Предупреждения' },
  en: { back: '← Back', rawPayload: 'Raw Payload', validation: 'Validation', mappingOutput: 'Mapping Output', copyJson: 'Copy JSON', valid: 'Valid', invalid: 'Invalid', errors: 'Errors', warnings: 'Warnings' },
  uk: { back: '← Назад', rawPayload: 'Raw Payload', validation: 'Валідація', mappingOutput: 'Mapping Output', copyJson: 'Копіювати JSON', valid: 'Валідно', invalid: 'Невалідно', errors: 'Помилки', warnings: 'Попередження' },
};

export function SbPayloadDetail({ payload }: SbPayloadDetailProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];
  const [activeTab, setActiveTab] = useState<'raw' | 'validation' | 'mapping'>('raw');

  const handleCopy = () => {
    const data = activeTab === 'raw' ? payload.payloadJson : payload.mappingOutputJson;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/sandbox/list?tab=payloads')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-stone-800">{payload.id}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{payload.entityType}</span>
            <span className={`text-xs ${payload.direction === 'inbound' ? 'text-emerald-600' : 'text-blue-600'}`}>
              {payload.direction || 'inbound'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-stone-500">{payload.recordCount} records</div>
          <div className="text-xs text-stone-400">
            {payload.payloadSize ? `${(payload.payloadSize / 1024).toFixed(1)} KB` : '-'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
        <div className="flex border-b border-stone-100">
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'raw' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {t.rawPayload}
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'validation' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {t.validation}
            {payload.validationJson?.valid === false && (
              <span className="ml-1 text-rose-600">({payload.validationJson.errors?.length || 0})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'mapping' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {t.mappingOutput}
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'raw' && (
            <div className="relative">
              <pre className="bg-stone-900 text-stone-100 p-4 rounded-xl text-xs overflow-auto max-h-96 font-mono">
                {JSON.stringify(payload.payloadJson || { sample: 'data' }, null, 2)}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 text-stone-400 hover:text-stone-200"
              >
                {t.copyJson}
              </Button>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {payload.validationJson?.valid ? (
                  <>
                    <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                    <span className="font-medium text-emerald-700">{t.valid}</span>
                  </>
                ) : (
                  <>
                    <span className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">✗</span>
                    <span className="font-medium text-rose-700">{t.invalid}</span>
                  </>
                )}
              </div>

              {payload.validationJson?.errors && payload.validationJson.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-rose-700 mb-2">{t.errors}</h4>
                  <div className="space-y-2">
                    {payload.validationJson.errors.map((err, idx) => (
                      <div key={idx} className="p-3 bg-rose-50 rounded-lg text-sm">
                        {err.field && <code className="text-rose-700 font-semibold mr-2">{err.field}:</code>}
                        <span className="text-rose-600">{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'mapping' && (
            <div className="relative">
              <pre className="bg-stone-900 text-stone-100 p-4 rounded-xl text-xs overflow-auto max-h-96 font-mono">
                {JSON.stringify(payload.mappingOutputJson || { mapped: 'output' }, null, 2)}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 text-stone-400 hover:text-stone-200"
              >
                {t.copyJson}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <dt className="text-sm text-stone-500">Job</dt>
            <dd className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline"
                onClick={() => router.push(`/m/sandbox/job/${payload.jobId}`)}>
              {payload.jobId}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Connector</dt>
            <dd className="text-sm font-medium text-stone-800">{payload.connectorId}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Created</dt>
            <dd className="text-sm font-medium text-stone-800">
              {new Date(payload.createdAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
