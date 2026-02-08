"use client";

import { useState } from 'react';
import { LqKpiStrip } from './LqKpiStrip';
import { LqActionsBar } from './LqActionsBar';
import { LqChartPanel } from './LqChartPanel';
import { LqForecastsTable } from './LqForecastsTable';
import { LqCashPositionsTable } from './LqCashPositionsTable';
import { LqFlowsTable } from './LqFlowsTable';
import { LqScenariosTable } from './LqScenariosTable';
import { LqStressTestsTable } from './LqStressTestsTable';
import { LqAlertsTable } from './LqAlertsTable';

interface KpiData {
  totalCashToday: number;
  forecastsActive: number;
  netOutflow30d: number;
  capitalCalls90d: number;
  taxPayments90d: number;
  alertsCritical: number;
  stressTests30d: number;
  scenarioVarianceMax: number;
}

interface DailyBalance {
  date: string;
  closingBalance: number;
  inflows: number;
  outflows: number;
}

interface CashForecast {
  id: string;
  name: string;
  scopeType: string;
  horizonDays: number;
  status: 'active' | 'draft' | 'archived';
  resultsJson?: {
    minBalance?: number;
    deficitDays?: number;
  };
  updatedAt: string;
}

interface CashPosition {
  id: string;
  accountName: string;
  currency: string;
  balance: number;
  sourceType: string;
  asOf: string;
}

interface CashFlow {
  id: string;
  flowType: 'inflow' | 'outflow';
  categoryKey: string;
  flowDate: string;
  amount: number;
  currency: string;
  description?: string;
  isConfirmed?: boolean;
}

interface CashScenario {
  id: string;
  name: string;
  scenarioType: 'base' | 'conservative' | 'aggressive' | 'custom';
  adjustmentsJson?: Record<string, unknown>;
  updatedAt: string;
}

interface CashStressTest {
  id: string;
  name: string;
  stressType: string;
  paramsJson?: { severity?: string };
  resultsJson?: { minCashReached?: number; breachesCount?: number };
  runAt?: string;
}

interface LiquidityAlert {
  id: string;
  title?: string;
  forecastId: string;
  deficitDate: string;
  shortfallAmount: number;
  currency: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'closed';
}

type TabKey = 'forecasts' | 'positions' | 'inflows' | 'outflows' | 'scenarios' | 'stress' | 'alerts' | 'audit';

interface LqDashboardPageProps {
  kpis: KpiData;
  dailyBalances?: DailyBalance[];
  forecasts: CashForecast[];
  positions: CashPosition[];
  flows: CashFlow[];
  scenarios: CashScenario[];
  stressTests: CashStressTest[];
  alerts: LiquidityAlert[];
  minCashThreshold?: number;
  onCreateForecast?: () => void;
  onAddCashFlow?: () => void;
  onImportFlows?: () => void;
  onCreateScenario?: () => void;
  onRunStressTest?: () => void;
  onOpenForecast?: (id: string) => void;
  onOpenScenario?: (id: string) => void;
  onOpenStressTest?: (id: string) => void;
  onOpenAlert?: (id: string) => void;
  onAcknowledgeAlert?: (id: string) => void;
  onCloseAlert?: (id: string) => void;
  onCreateTaskFromAlert?: (id: string) => void;
}

export function LqDashboardPage({
  kpis,
  dailyBalances = [],
  forecasts,
  positions,
  flows,
  scenarios,
  stressTests,
  alerts,
  minCashThreshold = 0,
  onCreateForecast,
  onAddCashFlow,
  onImportFlows,
  onCreateScenario,
  onRunStressTest,
  onOpenForecast,
  onOpenScenario,
  onOpenStressTest,
  onOpenAlert,
  onAcknowledgeAlert,
  onCloseAlert,
  onCreateTaskFromAlert,
}: LqDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('forecasts');

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'forecasts', label: 'Прогнозы', count: forecasts.filter(f => f.status === 'active').length },
    { key: 'positions', label: 'Позиции', count: positions.length },
    { key: 'inflows', label: 'Притоки' },
    { key: 'outflows', label: 'Оттоки' },
    { key: 'scenarios', label: 'Сценарии', count: scenarios.length },
    { key: 'stress', label: 'Стресс-тесты', count: stressTests.length },
    { key: 'alerts', label: 'Алерты', count: alerts.filter(a => a.status === 'open').length },
    { key: 'audit', label: 'Аудит' },
  ];

  const inflows = flows.filter((f) => f.flowType === 'inflow');
  const outflows = flows.filter((f) => f.flowType === 'outflow');

  // Transform KPI data to array format expected by LqKpiStrip
  const kpiItems = [
    { id: 'totalCashToday', label: 'Кэш сегодня', value: `$${(kpis.totalCashToday / 1e6).toFixed(1)}M`, status: 'ok' as const, linkTo: '/m/liquidity/list?tab=positions' },
    { id: 'forecastsActive', label: 'Прогнозов', value: kpis.forecastsActive, status: 'info' as const, linkTo: '/m/liquidity/list?tab=forecasts' },
    { id: 'netOutflow30d', label: 'Чист. отток 30д', value: `$${(Math.abs(kpis.netOutflow30d) / 1e6).toFixed(1)}M`, status: kpis.netOutflow30d < 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=outflows' },
    { id: 'capitalCalls90d', label: 'Capital calls 90д', value: `$${(kpis.capitalCalls90d / 1e6).toFixed(1)}M`, status: kpis.capitalCalls90d > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=outflows' },
    { id: 'taxPayments90d', label: 'Налоги 90д', value: `$${(kpis.taxPayments90d / 1e6).toFixed(1)}M`, status: 'info' as const, linkTo: '/m/liquidity/list?tab=outflows' },
    { id: 'alertsCritical', label: 'Алертов', value: kpis.alertsCritical, status: kpis.alertsCritical > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=alerts' },
    { id: 'stressTests30d', label: 'Стресс-тестов', value: kpis.stressTests30d, status: 'info' as const, linkTo: '/m/liquidity/list?tab=stress' },
    { id: 'scenarioVarianceMax', label: 'Макс. расхождение', value: `${(kpis.scenarioVarianceMax * 100).toFixed(0)}%`, status: kpis.scenarioVarianceMax > 0.2 ? 'warning' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=scenarios' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <LqKpiStrip kpis={kpiItems} />

      {/* Actions Bar */}
      <LqActionsBar
        onCreateForecast={onCreateForecast || (() => {})}
        onAddCashFlow={onAddCashFlow || (() => {})}
        onImportFlows={onImportFlows || (() => {})}
        onCreateScenario={onCreateScenario || (() => {})}
        onRunStressTest={onRunStressTest || (() => {})}
        onGenerateDemo={() => {}}
      />

      {/* Chart Panel */}
      {dailyBalances.length > 0 && (
        <LqChartPanel
          title="Прогноз баланса (активный)"
          dailyBalances={dailyBalances}
          minCashThreshold={minCashThreshold}
        />
      )}

      {/* Critical Alerts Banner */}
      {alerts.filter((a) => a.severity === 'critical' && a.status === 'open').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-red-800">
                {alerts.filter((a) => a.severity === 'critical' && a.status === 'open').length} критических алертов требуют внимания
              </div>
              <p className="text-sm text-red-700 mt-1">
                Обнаружены прогнозируемые дефициты ликвидности. Перейдите во вкладку "Алерты" для подробностей.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Показать алерты
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    tab.key === 'alerts' && tab.count > 0
                      ? 'bg-red-100 text-red-600'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        {activeTab === 'forecasts' && (
          <LqForecastsTable
            forecasts={forecasts}
            onOpen={onOpenForecast || (() => {})}
          />
        )}

        {activeTab === 'positions' && (
          <LqCashPositionsTable positions={positions} onOpen={() => {}} />
        )}

        {activeTab === 'inflows' && (
          <LqFlowsTable flows={inflows} flowType="inflow" />
        )}

        {activeTab === 'outflows' && (
          <LqFlowsTable flows={outflows} flowType="outflow" />
        )}

        {activeTab === 'scenarios' && (
          <LqScenariosTable
            scenarios={scenarios}
            onOpen={onOpenScenario || (() => {})}
          />
        )}

        {activeTab === 'stress' && (
          <LqStressTestsTable
            tests={stressTests}
            onOpen={onOpenStressTest || (() => {})}
          />
        )}

        {activeTab === 'alerts' && (
          <LqAlertsTable
            alerts={alerts}
            onOpen={onOpenAlert || (() => {})}
            onAcknowledge={onAcknowledgeAlert}
            onClose={onCloseAlert}
            onCreateTask={onCreateTaskFromAlert}
          />
        )}

        {activeTab === 'audit' && (
          <div className="p-6 text-center text-stone-400">
            Audit trail будет отображён здесь
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-stone-400 py-4">
        Прогноз ликвидности основан на введенных данных и предположениях. Не является финансовой консультацией.
      </div>
    </div>
  );
}
