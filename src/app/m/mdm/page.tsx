"use client";

import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { MdKpiStrip } from '@/modules/46-mdm/ui/MdKpiStrip';
import { MdActionsBar } from '@/modules/46-mdm/ui/MdActionsBar';
import { MdAiPanel } from '@/modules/46-mdm/ui/MdAiPanel';
import { MdDuplicatesTable } from '@/modules/46-mdm/ui/MdDuplicatesTable';
import { MdStewardQueueTable } from '@/modules/46-mdm/ui/MdStewardQueueTable';
import { HelpPanel } from '@/components/ui/HelpPanel';

export default function MdmDashboardPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('mdmEntities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: accounts = [] } = useCollection('mdmAccounts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assets = [] } = useCollection('mdmAssets') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: duplicates = [] } = useCollection('mdmDuplicates') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: mergeJobs = [] } = useCollection('mdmMergeJobs') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stewardQueue = [] } = useCollection('mdmStewardQueue') as { data: any[] };

  const openDuplicates = duplicates.filter((d) => d.status === 'open');
  const pendingMerges = mergeJobs.filter((m) => m.status === 'pending_approval');
  const openQueue = stewardQueue.filter((s) => s.status === 'open');
  const missingSourcesQueue = stewardQueue.filter((s) => s.issueTypeKey === 'missing_source');

  const kpis = [
    { key: 'people', label: 'People', value: people.length, status: 'ok' as const, href: '/m/mdm/list?tab=people' },
    { key: 'entities', label: 'Entities', value: entities.length, status: 'ok' as const, href: '/m/mdm/list?tab=entities' },
    { key: 'accounts', label: 'Accounts', value: accounts.length, status: 'ok' as const, href: '/m/mdm/list?tab=accounts' },
    { key: 'assets', label: 'Assets', value: assets.length, status: 'ok' as const, href: '/m/mdm/list?tab=assets' },
    { key: 'duplicates', label: 'Дубли открытые', value: openDuplicates.length, status: openDuplicates.length > 0 ? 'warning' as const : 'ok' as const, href: '/m/mdm/list?tab=duplicates&status=open' },
    { key: 'merges', label: 'Merge ожидают', value: pendingMerges.length, status: pendingMerges.length > 0 ? 'warning' as const : 'ok' as const, href: '/m/mdm/list?tab=duplicates&filter=pending_merge' },
    { key: 'queue', label: 'Очередь открыта', value: openQueue.length, status: openQueue.length > 0 ? 'warning' as const : 'ok' as const, href: '/m/mdm/list?tab=stewardship&status=open' },
    { key: 'missing', label: 'Без источников', value: missingSourcesQueue.length, status: missingSourcesQueue.length > 0 ? 'critical' as const : 'ok' as const, href: '/m/mdm/list?tab=stewardship&filter=missing_sources' },
  ];

  const actions = [
    { key: 'createRecord', label: 'Создать запись', variant: 'primary' as const, onClick: () => router.push('/m/mdm/list?create=true') },
    { key: 'runMatch', label: 'Запустить матчинг', variant: 'secondary' as const, onClick: () => {} },
    { key: 'createRule', label: 'Создать правило', variant: 'secondary' as const, onClick: () => router.push('/m/mdm/list?tab=rules&create=true') },
    { key: 'mergeWizard', label: 'Merge wizard', variant: 'secondary' as const, onClick: () => {} },
    { key: 'generateDemo', label: 'Demo MDM', variant: 'ghost' as const, onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-stone-800">Master Data Management</h1>
          <p className="text-sm text-stone-500 mt-1">
            Golden Record, устранение дублей, единый справочник
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Слияние записей требует подтверждения ответственным лицом.
          </p>
        </div>

        {/* KPI Strip */}
        <MdKpiStrip kpis={kpis} />

        {/* Actions */}
        <MdActionsBar actions={actions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Duplicates preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-800">Последние дубликаты</h2>
                <button
                  onClick={() => router.push('/m/mdm/list?tab=duplicates')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Все дубликаты →
                </button>
              </div>
              {openDuplicates.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Нет открытых дубликатов</p>
              ) : (
                <MdDuplicatesTable
                  data={openDuplicates.slice(0, 5)}
                  onRowClick={(dup) => router.push(`/m/mdm/duplicate/${dup.id}`)}
                />
              )}
            </div>

            {/* Steward queue preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-800">Очередь стюардов</h2>
                <button
                  onClick={() => router.push('/m/mdm/list?tab=stewardship')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Вся очередь →
                </button>
              </div>
              {openQueue.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Очередь пуста</p>
              ) : (
                <MdStewardQueueTable
                  data={openQueue.slice(0, 5)}
                  onRowClick={() => {}}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Panel */}
            <MdAiPanel
              onSuggestDuplicates={() => {}}
              onSuggestMerge={() => {}}
              onNormalizeAddress={() => {}}
            />

            {/* Help */}
            <HelpPanel
              title="MDM"
              description="Master Data Management для управления справочниками"
              features={[
                'People 360 - единый профиль',
                'Entity Registry - структура владения',
                'Identity Resolution - поиск дублей',
                'Golden Record - лучшие значения',
                'Data Stewardship - качество данных',
              ]}
              scenarios={[
                'Консолидация данных из источников',
                'Устранение дублирующих записей',
                'Нормализация справочников',
                'Audit изменений',
              ]}
              dataSources={[
                'Custodian APIs',
                'Bank feeds',
                'Bloomberg/Refinitiv',
                'Manual entry',
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
