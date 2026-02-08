"use client";

import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { LqDashboardPage } from '@/modules/39-liquidity/ui';

export default function LiquidityDashboardPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: forecasts = [] } = useCollection('cashForecasts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: positions = [] } = useCollection('cashPositions') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: flows = [] } = useCollection('cashFlows') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: scenarios = [] } = useCollection('cashScenarios') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stressTests = [] } = useCollection('cashStressTests') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: alerts = [] } = useCollection('liquidityAlerts') as { data: any[] };

  // Find active forecast for chart
  const activeForecast = forecasts.find((f) => f.status === 'active');
  const dailyBalances = activeForecast?.resultsJson?.dailyBalances || [];
  const minCashThreshold = activeForecast?.assumptionsJson?.minCashThreshold || 0;

  // Calculate KPIs
  const totalCashToday = positions.reduce((sum: number, p) => sum + (p.balance || 0), 0);
  const forecastsActive = forecasts.filter((f) => f.status === 'active').length;

  const today = new Date();
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const in90Days = new Date(today);
  in90Days.setDate(in90Days.getDate() + 90);

  const flows30d = flows.filter((f) => {
    const flowDate = new Date(f.flowDate);
    return flowDate >= today && flowDate <= in30Days;
  });

  const inflows30d = flows30d
    .filter((f) => f.flowType === 'inflow')
    .reduce((sum: number, f) => sum + (f.amount || 0), 0);
  const outflows30d = flows30d
    .filter((f) => f.flowType === 'outflow')
    .reduce((sum: number, f) => sum + (f.amount || 0), 0);
  const netOutflow30d = outflows30d - inflows30d;

  const capitalCalls90d = flows
    .filter((f) => {
      const flowDate = new Date(f.flowDate);
      return (
        f.flowType === 'outflow' &&
        f.categoryKey === 'capital_call' &&
        flowDate >= today &&
        flowDate <= in90Days
      );
    })
    .reduce((sum: number, f) => sum + (f.amount || 0), 0);

  const taxPayments90d = flows
    .filter((f) => {
      const flowDate = new Date(f.flowDate);
      return (
        f.flowType === 'outflow' &&
        f.categoryKey === 'tax_payment' &&
        flowDate >= today &&
        flowDate <= in90Days
      );
    })
    .reduce((sum: number, f) => sum + (f.amount || 0), 0);

  const alertsCritical = alerts.filter(
    (a) => a.severity === 'critical' && a.status === 'open'
  ).length;

  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);
  const stressTests30d = stressTests.filter((t) => {
    if (!t.runAt) return false;
    const runDate = new Date(t.runAt);
    return runDate >= last30Days;
  }).length;

  const scenarioVarianceMax = scenarios.length > 0 ? 15.2 : 0;

  const kpis = {
    totalCashToday,
    forecastsActive,
    netOutflow30d,
    capitalCalls90d,
    taxPayments90d,
    alertsCritical,
    stressTests30d,
    scenarioVarianceMax,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Планирование ликвидности</h1>
        <p className="text-sm text-stone-500 mt-1">
          Cash forecast, сценарный анализ и стресс-тестирование
        </p>
      </div>

      <LqDashboardPage
        kpis={kpis}
        dailyBalances={dailyBalances}
        forecasts={forecasts}
        positions={positions}
        flows={flows}
        scenarios={scenarios}
        stressTests={stressTests}
        alerts={alerts}
        minCashThreshold={minCashThreshold}
        onCreateForecast={() => router.push('/m/liquidity/forecast/new')}
        onAddCashFlow={() => router.push('/m/liquidity/flow/new')}
        onImportFlows={() => {}}
        onCreateScenario={() => router.push('/m/liquidity/scenario/new')}
        onRunStressTest={() => router.push('/m/liquidity/stress/new')}
        onOpenForecast={(id) => router.push(`/m/liquidity/forecast/${id}`)}
        onOpenScenario={(id) => router.push(`/m/liquidity/scenario/${id}`)}
        onOpenStressTest={(id) => router.push(`/m/liquidity/stress/${id}`)}
        onOpenAlert={(id) => router.push(`/m/liquidity/alert/${id}`)}
      />
    </div>
  );
}
