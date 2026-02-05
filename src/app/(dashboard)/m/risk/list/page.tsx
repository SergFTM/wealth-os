"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layers, Target, Activity, TrendingDown, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';
import { RkExposureTable } from '@/modules/14-risk/ui/RkExposureTable';
import { RkConcentrationTable } from '@/modules/14-risk/ui/RkConcentrationTable';
import { RkMetricsCards } from '@/modules/14-risk/ui/RkMetricsCards';
import { RkAlertsTable } from '@/modules/14-risk/ui/RkAlertsTable';
import { RkActionsTable } from '@/modules/14-risk/ui/RkActionsTable';
import { RkScopeSwitcher } from '@/modules/14-risk/ui/RkScopeSwitcher';

interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Exposure extends BaseRecord {
  portfolioId: string;
  dimension: string;
  segment: string;
  exposure: number;
  benchmark: number;
  deviation: number;
  marketValue: number;
  asOfDate: string;
}

interface Concentration extends BaseRecord {
  portfolioId: string;
  type: string;
  name: string;
  identifier: string;
  weight: number;
  limit: number;
  status: 'ok' | 'warning' | 'breached';
  marketValue: number;
  asOfDate: string;
}

interface RiskMetric extends BaseRecord {
  portfolioId: string;
  metric: string;
  label: string;
  value: number;
  unit: string;
  period: string;
  benchmark: number;
  benchmarkLabel: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  asOfDate: string;
}

interface StressScenario extends BaseRecord {
  name: string;
  type: 'historical' | 'hypothetical';
  severity: 'moderate' | 'severe';
  status: 'active' | 'draft';
  lastRunDate: string | null;
  frequency: string;
}

interface StressRun extends BaseRecord {
  scenarioId: string;
  scenarioName: string;
  portfolioId: string;
  runDate: string;
  status: 'completed' | 'running' | 'failed';
  portfolioImpact: number | null;
  portfolioImpactValue: number | null;
  varBreached: boolean | null;
}

interface RiskAlert extends BaseRecord {
  portfolioId: string;
  title: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  description: string;
  currentValue: number | null;
  threshold: number | null;
  unit: string | null;
  source: string;
  assignedTo: string | null;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

interface RiskAction extends BaseRecord {
  portfolioId: string;
  alertId: string;
  title: string;
  type: 'rebalance' | 'hedge' | 'escalation' | 'reporting';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  dueDate: string;
  assignedTo: string;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string | null;
}

const tabs = [
  { id: 'exposures', label: 'Экспозиции', icon: Layers },
  { id: 'concentrations', label: 'Концентрации', icon: Target },
  { id: 'metrics', label: 'Метрики', icon: Activity },
  { id: 'stress', label: 'Стресс-тесты', icon: TrendingDown },
  { id: 'alerts', label: 'Алерты', icon: AlertTriangle },
  { id: 'actions', label: 'Действия', icon: Shield },
];

const portfolioOptions = [
  { id: 'all', label: 'Все портфели', sublabel: 'Агрегированный вид' },
  { id: 'pf-001', label: 'Growth Portfolio', sublabel: '$50M' },
  { id: 'pf-002', label: 'Balanced Portfolio', sublabel: '$20M' },
  { id: 'pf-003', label: 'Aggressive Growth', sublabel: '$50M' },
];

export default function RiskListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'exposures';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPortfolio, setSelectedPortfolio] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [metrics, setMetrics] = useState<RiskMetric[]>([]);
  const [scenarios, setScenarios] = useState<StressScenario[]>([]);
  const [stressRuns, setStressRuns] = useState<StressRun[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [actions, setActions] = useState<RiskAction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          exposuresRes,
          concentrationsRes,
          metricsRes,
          scenariosRes,
          stressRunsRes,
          alertsRes,
          actionsRes,
        ] = await Promise.all([
          fetch('/api/collections/riskExposures'),
          fetch('/api/collections/riskConcentrations'),
          fetch('/api/collections/riskMetrics'),
          fetch('/api/collections/stressScenarios'),
          fetch('/api/collections/stressRuns'),
          fetch('/api/collections/riskAlerts'),
          fetch('/api/collections/riskActions'),
        ]);

        const [
          exposuresData,
          concentrationsData,
          metricsData,
          scenariosData,
          stressRunsData,
          alertsData,
          actionsData,
        ] = await Promise.all([
          exposuresRes.json(),
          concentrationsRes.json(),
          metricsRes.json(),
          scenariosRes.json(),
          stressRunsRes.json(),
          alertsRes.json(),
          actionsRes.json(),
        ]);

        setExposures(exposuresData.items || []);
        setConcentrations(concentrationsData.items || []);
        setMetrics(metricsData.items || []);
        setScenarios(scenariosData.items || []);
        setStressRuns(stressRunsData.items || []);
        setAlerts(alertsData.items || []);
        setActions(actionsData.items || []);
      } catch (error) {
        console.error('Failed to fetch risk data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterByPortfolio = <T extends { portfolioId?: string }>(items: T[]) =>
    selectedPortfolio === 'all' ? items : items.filter(i => i.portfolioId === selectedPortfolio);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/risk/list?tab=${tabId}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-stone-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/m/risk')}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Риск данные</h1>
            <p className="text-sm text-stone-500 mt-1">Детальный просмотр рисковых метрик</p>
          </div>
        </div>
        <RkScopeSwitcher
          options={portfolioOptions}
          value={selectedPortfolio}
          onChange={setSelectedPortfolio}
          label="Портфель"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'exposures' && (
        <RkExposureTable
          exposures={filterByPortfolio(exposures)}
          onRowClick={(exp) => router.push(`/m/risk/item/${exp.id}?type=exposure`)}
        />
      )}

      {activeTab === 'concentrations' && (
        <RkConcentrationTable
          concentrations={filterByPortfolio(concentrations)}
          onRowClick={(conc) => router.push(`/m/risk/item/${conc.id}?type=concentration`)}
        />
      )}

      {activeTab === 'metrics' && (
        <RkMetricsCards
          metrics={filterByPortfolio(metrics)}
          onMetricClick={(metric) => router.push(`/m/risk/item/${metric.id}?type=metric`)}
        />
      )}

      {activeTab === 'stress' && (
        <div className="space-y-6">
          {/* Scenarios */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200">
              <h3 className="text-sm font-semibold text-stone-800">Сценарии</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Сценарий</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Серьёзность</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Последний запуск</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario) => (
                    <tr
                      key={scenario.id}
                      onClick={() => router.push(`/m/risk/item/${scenario.id}?type=scenario`)}
                      className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-stone-800">{scenario.name}</td>
                      <td className="px-4 py-3 text-stone-600">
                        {scenario.type === 'historical' ? 'Исторический' : 'Гипотетический'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          scenario.severity === 'severe' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {scenario.severity === 'severe' ? 'Серьёзный' : 'Умеренный'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          scenario.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {scenario.status === 'active' ? 'Активный' : 'Черновик'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-stone-500">
                        {scenario.lastRunDate ? new Date(scenario.lastRunDate).toLocaleDateString('ru-RU') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stress Runs */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200">
              <h3 className="text-sm font-semibold text-stone-800">Запуски стресс-тестов</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Сценарий</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Дата запуска</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Влияние</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">VaR</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filterByPortfolio(stressRuns).map((run) => (
                    <tr
                      key={run.id}
                      onClick={() => router.push(`/m/risk/item/${run.id}?type=stressRun`)}
                      className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-stone-800">{run.scenarioName}</td>
                      <td className="px-4 py-3 text-stone-600">
                        {new Date(run.runDate).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {run.portfolioImpact !== null ? (
                          <span className={`font-medium ${
                            run.portfolioImpact < -20 ? 'text-red-600' :
                            run.portfolioImpact < -10 ? 'text-amber-600' :
                            'text-stone-600'
                          }`}>
                            {run.portfolioImpact.toFixed(1)}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {run.varBreached !== null && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            run.varBreached ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {run.varBreached ? 'Превышен' : 'OK'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          run.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                          run.status === 'running' ? 'bg-blue-100 text-blue-600' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {run.status === 'completed' ? 'Завершён' :
                           run.status === 'running' ? 'В процессе' : 'Ошибка'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <RkAlertsTable
          alerts={filterByPortfolio(alerts)}
          onRowClick={(alert) => router.push(`/m/risk/item/${alert.id}?type=alert`)}
          onAcknowledge={(id) => console.log('Acknowledge:', id)}
        />
      )}

      {activeTab === 'actions' && (
        <RkActionsTable
          actions={filterByPortfolio(actions)}
          onRowClick={(action) => router.push(`/m/risk/item/${action.id}?type=action`)}
          onApprove={(id) => console.log('Approve:', id)}
          showCompleted
        />
      )}
    </div>
  );
}
