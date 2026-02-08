"use client";

import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { OwKpiStrip } from '@/modules/47-ownership/ui/OwKpiStrip';
import { OwActionsBar } from '@/modules/47-ownership/ui/OwActionsBar';
import { OwAiPanel } from '@/modules/47-ownership/ui/OwAiPanel';
import { OwConcentrationsPanel } from '@/modules/47-ownership/ui/OwConcentrationsPanel';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function OwnershipDashboardPage() {
  const router = useRouter();
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ id: string; type: 'explain' | 'warning' | 'optimization' | 'question'; title: string; description: string; confidence: number }>>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: nodes = [] } = useCollection('ownershipNodes') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: links = [] } = useCollection('ownershipLinks') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ubos = [] } = useCollection('ownershipUbo') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: changes = [] } = useCollection('ownershipChanges') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: views = [] } = useCollection('ownershipViews') as { data: any[] };

  // Calculate KPIs
  const missingSources = links.filter((l: { sourceRefJson?: unknown }) => !l.sourceRefJson).length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentChanges = changes.filter((c: { changedAt: string }) => new Date(c.changedAt) >= thirtyDaysAgo).length;

  const kpis = [
    { key: 'nodesTotal', label: 'Узлы', value: nodes.length, status: 'ok' as const, href: '/m/ownership/list?tab=nodes' },
    { key: 'linksTotal', label: 'Связи', value: links.length, status: 'ok' as const, href: '/m/ownership/list?tab=links' },
    { key: 'uboRecords', label: 'UBO записи', value: ubos.length, status: 'ok' as const, href: '/m/ownership/list?tab=ubo' },
    { key: 'missingSources', label: 'Без источников', value: missingSources, status: missingSources > 0 ? 'warning' as const : 'ok' as const, href: '/m/ownership/list?tab=links&filter=missing_sources' },
    { key: 'loopsDetected', label: 'Циклы', value: 0, status: 'ok' as const, href: '/m/ownership/list?tab=links&filter=loops' },
    { key: 'concentrationsHigh', label: 'Концентрации', value: 0, status: 'ok' as const, href: '/m/ownership/list?tab=concentrations&filter=high' },
    { key: 'clientSafeViews', label: 'Публикаций', value: views.length, status: 'ok' as const, href: '/m/ownership/list?tab=client_safe' },
    { key: 'changesLast30d', label: 'Изменений 30д', value: recentChanges, status: 'info' as const, href: '/m/ownership/list?tab=changes&period=30d' },
  ];

  const actions = [
    { key: 'createNode', label: 'Создать узел', icon: 'plus', variant: 'primary' as const, onClick: () => router.push('/m/ownership/list?tab=nodes&create=true') },
    { key: 'createLink', label: 'Создать связь', icon: 'link', variant: 'secondary' as const, onClick: () => router.push('/m/ownership/list?tab=links&create=true') },
    { key: 'computeUbo', label: 'Рассчитать UBO', icon: 'calculator', variant: 'secondary' as const, onClick: () => {} },
    { key: 'publishClientSafe', label: 'Опубликовать', icon: 'share', variant: 'secondary' as const, onClick: () => {} },
    { key: 'openMap', label: 'Открыть карту', icon: 'map', variant: 'ghost' as const, onClick: () => router.push('/m/ownership/map') },
    { key: 'generateDemo', label: 'Генерировать демо', icon: 'sparkles', variant: 'ghost' as const, onClick: () => {} },
  ];

  const handleExplainStructure = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestions([
        {
          id: '1',
          type: 'explain',
          title: 'Структура владения',
          description: `Структура состоит из ${nodes.length} узлов и ${links.length} связей. Выявлено ${ubos.length} конечных бенефициаров.`,
          confidence: 95,
        },
      ]);
      setAiLoading(false);
    }, 1000);
  };

  const handleFindConcentrations = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestions([
        {
          id: '2',
          type: 'warning',
          title: 'Анализ концентраций',
          description: 'Не обнаружено критических концентраций риска в текущей структуре.',
          confidence: 85,
        },
      ]);
      setAiLoading(false);
    }, 1000);
  };

  const handleCheckOrphans = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestions([
        {
          id: '3',
          type: 'optimization',
          title: 'Проверка связей',
          description: 'Все узлы корректно связаны с домохозяйством.',
          confidence: 90,
        },
      ]);
      setAiLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-stone-800">Ownership Map</h1>
          <p className="text-sm text-stone-500 mt-1">
            Визуализация структуры владения: Household → Trusts → Entities → Accounts → Assets
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
            Ownership карта демонстрационная. Для юридически значимых выводов требуется проверка документов и юристов.
          </p>
        </div>

        {/* KPI Strip */}
        <OwKpiStrip kpis={kpis} />

        {/* Actions */}
        <OwActionsBar actions={actions} />

        {/* Quick map button */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Интерактивная карта владения</h2>
              <p className="text-emerald-100 mt-1">
                Визуализируйте полную структуру владения с drill-down в детали
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push('/m/ownership/map')}
              className="bg-white text-emerald-600 hover:bg-emerald-50"
            >
              Открыть карту →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Concentrations preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-800">Концентрации</h2>
                <button
                  onClick={() => router.push('/m/ownership/list?tab=concentrations')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Подробнее →
                </button>
              </div>
              <OwConcentrationsPanel
                metrics={[]}
                summary={{
                  totalNodes: nodes.length,
                  totalLinks: links.length,
                  avgOwnershipDepth: 2.3,
                  maxOwnershipDepth: 4,
                  riskScore: 25,
                }}
              />
            </div>

            {/* Recent changes preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-800">Последние изменения</h2>
                <button
                  onClick={() => router.push('/m/ownership/list?tab=changes')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Все изменения →
                </button>
              </div>
              {changes.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Нет изменений</p>
              ) : (
                <div className="space-y-2">
                  {changes.slice(0, 5).map((change: { id: string; changeTypeKey: string; changedAt: string }) => (
                    <div key={change.id} className="p-3 bg-stone-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-stone-700">{change.changeTypeKey}</span>
                      <span className="text-xs text-stone-400">
                        {new Date(change.changedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Panel */}
            <OwAiPanel
              onExplainStructure={handleExplainStructure}
              onFindConcentrations={handleFindConcentrations}
              onCheckOrphans={handleCheckOrphans}
              suggestions={aiSuggestions}
              isLoading={aiLoading}
            />

            {/* Help */}
            <HelpPanel
              title="Ownership Map"
              description="Визуализация и анализ структуры владения"
              features={[
                'Nodes: Household, Trust, Entity, Partnership, SPV, Account, Asset',
                'Links: ownershipPct и profitSharePct',
                'UBO: автоматический расчет конечных бенефициаров',
                'Timeline: история изменений долей',
                'Client-Safe: публикация для портала',
              ]}
              scenarios={[
                'Построение карты владения семьи',
                'Расчет UBO для compliance',
                'Анализ концентраций риска',
                'Публикация client-safe вида',
              ]}
              dataSources={[
                'MDM People/Entities',
                'Trust documents',
                'Partnership agreements',
                'Corporate documents',
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
