"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SbKpiStrip, SbActionsBar, SbEnvPanel, ActionIcons } from '@/modules/33-sandbox/ui';
import seedData from '@/modules/33-sandbox/seed.json';

const i18n = {
  ru: {
    title: 'Sandbox',
    subtitle: 'Песочница интеграций и тестовые подключения',
    disclaimer: 'Sandbox в MVP демонстрационный. Для production требуется изоляция инфраструктуры и секретов.',
    viewList: 'Подробнее',
    latestJobs: 'Последние Jobs',
    latestPayloads: 'Последние Payloads',
    noData: 'Нет данных',
  },
  en: {
    title: 'Sandbox',
    subtitle: 'Integration sandbox and test connections',
    disclaimer: 'Sandbox in MVP is demonstrational. Production requires infrastructure and secrets isolation.',
    viewList: 'View details',
    latestJobs: 'Latest Jobs',
    latestPayloads: 'Latest Payloads',
    noData: 'No data',
  },
  uk: {
    title: 'Sandbox',
    subtitle: 'Пісочниця інтеграцій та тестові підключення',
    disclaimer: 'Sandbox в MVP демонстраційний. Для production потрібна ізоляція інфраструктури та секретів.',
    viewList: 'Детальніше',
    latestJobs: 'Останні Jobs',
    latestPayloads: 'Останні Payloads',
    noData: 'Немає даних',
  },
};

const kpiLabels = {
  envCount: { ru: 'Sandbox сред', en: 'Sandbox Envs', uk: 'Sandbox середовищ' },
  activeDatasets: { ru: 'Активных датасетов', en: 'Active Datasets', uk: 'Активних датасетів' },
  mockConnectors: { ru: 'Mock коннекторов', en: 'Mock Connectors', uk: 'Mock конекторів' },
  jobs7d: { ru: 'Jobs 7д', en: 'Jobs 7d', uk: 'Jobs 7д' },
  failedJobs: { ru: 'Failed jobs', en: 'Failed Jobs', uk: 'Failed jobs' },
  payloadsCaptured: { ru: 'Payloads', en: 'Payloads Captured', uk: 'Payloads' },
  mappingErrors: { ru: 'Ошибки маппинга', en: 'Mapping Errors', uk: 'Помилки маппінгу' },
  replayRuns: { ru: 'Replay runs', en: 'Replay Runs', uk: 'Replay runs' },
};

const actionLabels = {
  createEnv: { ru: 'Создать среду', en: 'Create Environment', uk: 'Створити середовище' },
  cloneDataset: { ru: 'Клонировать датасет', en: 'Clone Dataset', uk: 'Клонувати датасет' },
  createConnector: { ru: 'Создать mock коннектор', en: 'Create Mock Connector', uk: 'Створити mock конектор' },
  runJob: { ru: 'Запустить sync job', en: 'Run Sync Job', uk: 'Запустити sync job' },
  replayEvents: { ru: 'Re-play события', en: 'Replay Events', uk: 'Re-play події' },
  generateDemo: { ru: 'Сгенерировать demo sandbox', en: 'Generate Demo Sandbox', uk: 'Згенерувати demo sandbox' },
};

export default function SandboxDashboardPage() {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  // Calculate KPIs from seed data
  const envCount = seedData.sbEnvironments.filter(e => e.status === 'active').length;
  const activeDatasets = seedData.sbDatasets.filter(d => d.status === 'active').length;
  const mockConnectors = seedData.sbConnectors.filter(c => c.status === 'active').length;
  const jobs7d = seedData.sbSyncJobs.filter(j => {
    const created = new Date(j.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length;
  const failedJobs = seedData.sbSyncJobs.filter(j => j.status === 'failed').length;
  const payloadsCaptured = 120; // Demo value
  const mappingErrors = seedData.sbMappings.filter(m => m.status === 'draft').length;
  const replayRuns = seedData.sbReplayRuns.length;

  const kpis = [
    { id: 'envCount', value: envCount, label: kpiLabels.envCount, link: '/m/sandbox/list?tab=environments' },
    { id: 'activeDatasets', value: activeDatasets, label: kpiLabels.activeDatasets, link: '/m/sandbox/list?tab=datasets&status=active' },
    { id: 'mockConnectors', value: mockConnectors, label: kpiLabels.mockConnectors, link: '/m/sandbox/list?tab=connectors' },
    { id: 'jobs7d', value: jobs7d, label: kpiLabels.jobs7d, link: '/m/sandbox/list?tab=jobs&period=7d' },
    { id: 'failedJobs', value: failedJobs, label: kpiLabels.failedJobs, link: '/m/sandbox/list?tab=jobs&status=failed', status: failedJobs > 0 ? 'critical' as const : 'ok' as const },
    { id: 'payloadsCaptured', value: payloadsCaptured, label: kpiLabels.payloadsCaptured, link: '/m/sandbox/list?tab=payloads' },
    { id: 'mappingErrors', value: mappingErrors, label: kpiLabels.mappingErrors, link: '/m/sandbox/list?tab=mapping&filter=errors', status: mappingErrors > 0 ? 'warning' as const : 'ok' as const },
    { id: 'replayRuns', value: replayRuns, label: kpiLabels.replayRuns, link: '/m/sandbox/list?tab=replay' },
  ];

  const actions = [
    { id: 'createEnv', label: actionLabels.createEnv, icon: ActionIcons.Plus, variant: 'primary' as const, onClick: () => router.push('/m/sandbox/list?tab=environments&action=create') },
    { id: 'cloneDataset', label: actionLabels.cloneDataset, icon: ActionIcons.Clone, variant: 'secondary' as const, onClick: () => router.push('/m/sandbox/list?tab=datasets&action=clone') },
    { id: 'createConnector', label: actionLabels.createConnector, icon: ActionIcons.Plug, variant: 'secondary' as const, onClick: () => router.push('/m/sandbox/list?tab=connectors&action=create') },
    { id: 'runJob', label: actionLabels.runJob, icon: ActionIcons.Play, variant: 'secondary' as const, onClick: () => router.push('/m/sandbox/list?tab=jobs&action=run') },
    { id: 'replayEvents', label: actionLabels.replayEvents, icon: ActionIcons.Replay, variant: 'ghost' as const, onClick: () => router.push('/m/sandbox/list?tab=replay') },
    { id: 'generateDemo', label: actionLabels.generateDemo, icon: ActionIcons.Database, variant: 'ghost' as const, onClick: () => alert('Demo sandbox generated') },
  ];

  const latestJobs = seedData.sbSyncJobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/sandbox/list')} className="bg-gradient-to-r from-indigo-500 to-purple-500">
          {t.viewList} →
        </Button>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-amber-800">{t.disclaimer}</p>
      </div>

      {/* KPI Strip */}
      <SbKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <SbActionsBar actions={actions} />

      {/* Mini Panels Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Environments Panel */}
        <SbEnvPanel environments={seedData.sbEnvironments as never[]} />

        {/* Latest Jobs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">{t.latestJobs}</h3>
            <button
              onClick={() => router.push('/m/sandbox/list?tab=jobs')}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              All →
            </button>
          </div>
          <div className="space-y-3">
            {latestJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/m/sandbox/job/${job.id}`)}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-indigo-50 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <code className="text-xs text-stone-600">{job.id}</code>
                  <p className="text-xs text-stone-500 mt-0.5">{job.entityType} • {job.jobType}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  job.status === 'failed' ? 'bg-rose-100 text-rose-700' :
                  job.status === 'running' ? 'bg-blue-100 text-blue-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Payloads Preview */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">{t.latestPayloads}</h3>
          <button
            onClick={() => router.push('/m/sandbox/list?tab=payloads')}
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            All →
          </button>
        </div>
        <div className="text-center py-8 text-stone-500 text-sm">
          {payloadsCaptured} payloads captured • Click to view
        </div>
      </div>
    </div>
  );
}
