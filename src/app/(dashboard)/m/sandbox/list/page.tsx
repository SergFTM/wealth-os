"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import {
  SbDatasetsTable,
  SbConnectorsTable,
  SbJobsTable,
  SbPayloadsTable,
  SbMappingPanel,
  SbReplayPanel,
  SbLogsTable,
} from '@/modules/33-sandbox/ui';
import { SbStatusPill } from '@/modules/33-sandbox/ui/SbStatusPill';
import seedData from '@/modules/33-sandbox/seed.json';

const tabs = [
  { id: 'environments', label: { ru: 'Среды', en: 'Environments', uk: 'Середовища' } },
  { id: 'datasets', label: { ru: 'Датасеты', en: 'Datasets', uk: 'Датасети' } },
  { id: 'connectors', label: { ru: 'Коннекторы', en: 'Connectors', uk: 'Конектори' } },
  { id: 'jobs', label: { ru: 'Sync Jobs', en: 'Sync Jobs', uk: 'Sync Jobs' } },
  { id: 'payloads', label: { ru: 'Payloads', en: 'Payloads', uk: 'Payloads' } },
  { id: 'mapping', label: { ru: 'Маппинг', en: 'Mapping', uk: 'Маппінг' } },
  { id: 'replay', label: { ru: 'Replay', en: 'Replay', uk: 'Replay' } },
  { id: 'logs', label: { ru: 'Логи', en: 'Logs', uk: 'Логи' } },
  { id: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
];

const i18n = {
  ru: { title: 'Sandbox', subtitle: 'Управление песочницей интеграций', back: '← Дашборд', noData: 'Нет данных' },
  en: { title: 'Sandbox', subtitle: 'Integration sandbox management', back: '← Dashboard', noData: 'No data' },
  uk: { title: 'Sandbox', subtitle: 'Управління пісочницею інтеграцій', back: '← Дашборд', noData: 'Немає даних' },
};

function SandboxListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useApp();
  const t = i18n[locale];

  const initialTab = searchParams.get('tab') || 'environments';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/sandbox/list?tab=${tabId}`, { scroll: false });
  };

  // Mock log data
  const mockLogs = Array.from({ length: 50 }, (_, i) => ({
    id: `sblog-${i}`,
    envId: 'sbenv-001',
    level: (['info', 'warn', 'error', 'debug'] as const)[i % 4],
    source: (['job', 'connector', 'mapping', 'replay'] as const)[i % 4],
    message: `Log message ${i + 1} - Sample sandbox log entry`,
    refsJson: i % 3 === 0 ? { jobId: `sbjob-00${i % 10}` } : undefined,
    createdAt: new Date(Date.now() - i * 60000).toISOString(),
  }));

  // Mock payloads
  const mockPayloads = Array.from({ length: 30 }, (_, i) => ({
    id: `sbpl-${String(i + 1).padStart(3, '0')}`,
    jobId: `sbjob-00${(i % 10) + 1}`,
    connectorId: `sbcon-00${(i % 5) + 1}`,
    entityType: (['transactions', 'positions', 'invoices', 'accounts'] as const)[i % 4],
    direction: (i % 2 === 0 ? 'inbound' : 'outbound') as 'inbound' | 'outbound',
    payloadSize: 1000 + i * 500,
    recordCount: 10 + i * 5,
    validationJson: { valid: i % 5 !== 0, errors: i % 5 === 0 ? [{ field: 'amount', message: 'Invalid' }] : [] },
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/sandbox')} className="bg-gradient-to-r from-indigo-500 to-purple-500">
          {t.back}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === tab.id
                ? "border-indigo-500 text-indigo-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label[locale]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'environments' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Dataset</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Connectors</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody>
                {seedData.sbEnvironments.map((env) => (
                  <tr
                    key={env.id}
                    className="border-b border-stone-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/m/sandbox/env/${env.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800 text-sm">{env.name}</div>
                      {env.description && <div className="text-xs text-stone-500">{env.description}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">{env.envType}</td>
                    <td className="px-4 py-3 text-center">
                      <SbStatusPill status={env.status as 'active' | 'archived' | 'paused'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-indigo-600">{env.linkedDatasetId || '-'}</td>
                    <td className="px-4 py-3 text-sm text-stone-600">{env.connectorIds?.length || 0}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">
                      {new Date(env.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'datasets' && (
          <SbDatasetsTable
            datasets={seedData.sbDatasets as never[]}
            onClone={(id) => alert(`Cloning dataset ${id} (demo)`)}
            onReset={(id) => alert(`Resetting dataset ${id} (demo)`)}
          />
        )}

        {activeTab === 'connectors' && (
          <SbConnectorsTable
            connectors={seedData.sbConnectors as never[]}
            onRunTest={(id) => alert(`Running test for connector ${id} (demo)`)}
          />
        )}

        {activeTab === 'jobs' && (
          <SbJobsTable
            jobs={seedData.sbSyncJobs as never[]}
            onRetry={(id) => alert(`Retrying job ${id} (demo)`)}
            onViewPayloads={(id) => router.push(`/m/sandbox/list?tab=payloads&jobId=${id}`)}
          />
        )}

        {activeTab === 'payloads' && (
          <SbPayloadsTable payloads={mockPayloads} />
        )}

        {activeTab === 'mapping' && (
          <SbMappingPanel
            mappings={seedData.sbMappings as never[]}
            onSave={(id) => alert(`Saving mapping ${id} (demo)`)}
          />
        )}

        {activeTab === 'replay' && (
          <SbReplayPanel
            replayRuns={seedData.sbReplayRuns as never[]}
            environments={seedData.sbEnvironments.map(e => ({ id: e.id, name: e.name }))}
            onRunReplay={(envId, eventType, count) => alert(`Running replay: ${count} ${eventType} events in ${envId} (demo)`)}
          />
        )}

        {activeTab === 'logs' && (
          <SbLogsTable
            logs={mockLogs}
            onExport={() => alert('Exporting logs (demo)')}
          />
        )}

        {activeTab === 'audit' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-8 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-stone-500">{locale === 'ru' ? 'Audit события модуля Sandbox' : 'Sandbox module audit events'}</p>
            <p className="text-xs text-stone-400 mt-2">{locale === 'ru' ? 'Фильтруется из auditEvents' : 'Filtered from auditEvents'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SandboxListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">Загрузка...</div>}>
      <SandboxListContent />
    </Suspense>
  );
}
