"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { ModuleAiPanel } from '@/components/shell/ModuleAiPanel';
import { PerfKpiStrip } from './PerfKpiStrip';
import { PerfTimeframeSwitcher } from './PerfTimeframeSwitcher';
import { PerfOverviewCharts } from './PerfOverviewCharts';
import { PerfAllocationBreakdown } from './PerfAllocationBreakdown';
import { PerfBenchmarkCompare } from './PerfBenchmarkCompare';
import { PerfAttributionTable } from './PerfAttributionTable';
import { PerfAdvisorImpact } from './PerfAdvisorImpact';
import { PerfExplainPanel } from './PerfExplainPanel';
import { PerfActionsBar } from './PerfActionsBar';
import { PerfReportBuilder } from './PerfReportBuilder';
import seedData from '../seed.json';

interface PerformanceView {
  id: string;
  clientId: string;
  portfolioId: string;
  name: string;
  method: 'TWR' | 'MWR';
  timeframe: string;
  benchmarkId: string | null;
  status: string;
  isShared: boolean;
  lastGeneratedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Benchmark {
  id: string;
  name: string;
  type: string;
  currency: string;
  region: string | null;
}

interface ReturnPoint {
  id: string;
  objectType: string;
  objectId: string;
  period: string;
  returnPct: number;
  method: string;
}

interface AttributionRow {
  id: string;
  viewId: string;
  period: string;
  dimension: string;
  segment: string;
  weightAvg: number;
  returnPct: number;
  contributionPct: number;
  flowImpactPct?: number;
  feesImpactPct?: number;
  status: 'calculated' | 'estimated' | 'pending';
}

interface Advisor {
  id: string;
  name: string;
  mandate: string;
  aum: number;
  currency: string;
}

export function PerfDashboardPage() {
  const router = useRouter();
  const { aiPanelOpen } = useApp();
  const [timeframe, setTimeframe] = useState('YTD');
  const [showHelp, setShowHelp] = useState(false);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [attributionDimension, setAttributionDimension] = useState<'assetClass' | 'strategy' | 'geography' | 'liquidity' | 'advisor'>('assetClass');
  const clientSafe = false;

  // Load data from seed
  const views = seedData.performanceViews as PerformanceView[];
  const benchmarks = seedData.benchmarks as Benchmark[];
  const returns = seedData.returns as ReturnPoint[];
  const attribution = seedData.attributionRows as AttributionRow[];
  const advisors = seedData.advisors as Advisor[];

  // Active view
  const activeView = views.find(v => v.status === 'active' && v.isShared) || views[0];
  const activeBenchmark = benchmarks.find(b => b.id === activeView?.benchmarkId);

  // KPIs
  const kpis = useMemo(() => {
    const portfolioReturns = returns.filter(r => r.objectType === 'portfolio' && r.objectId === 'portfolio-001');
    const benchmarkReturns = returns.filter(r => r.objectType === 'benchmark' && r.objectId === 'bm-001');
    
    const twrYtd = portfolioReturns.reduce((acc, r) => acc * (1 + r.returnPct / 100), 1) - 1;
    const bmYtd = benchmarkReturns.reduce((acc, r) => acc * (1 + r.returnPct / 100), 1) - 1;
    const alpha = (twrYtd - bmYtd) * 100;

    const viewAttribution = attribution.filter(a => a.viewId === 'pv-001' && a.dimension === 'assetClass');
    const best = viewAttribution.reduce((a, b) => a.contributionPct > b.contributionPct ? a : b, viewAttribution[0]);
    const worst = viewAttribution.reduce((a, b) => a.contributionPct < b.contributionPct ? a : b, viewAttribution[0]);

    return [
      { id: 'twr-ytd', label: 'TWR YTD', value: twrYtd * 100, format: 'percent' as const, status: 'ok' as const, timeframe: 'YTD', trend: 'up' as const },
      { id: 'mwr-ytd', label: 'MWR YTD', value: twrYtd * 100 - 0.8, format: 'percent' as const, status: 'ok' as const, timeframe: 'YTD', trend: 'up' as const },
      { id: 'volatility', label: 'Волатильность', value: 12.5, format: 'percent' as const, status: 'warning' as const, timeframe: '1Y' },
      { id: 'max-drawdown', label: 'Max Drawdown', value: -8.2, format: 'percent' as const, status: 'warning' as const, timeframe: '1Y' },
      { id: 'alpha-ytd', label: 'Альфа YTD', value: alpha, format: 'percent' as const, status: alpha > 0 ? 'ok' as const : 'critical' as const, timeframe: 'YTD', trend: alpha > 0 ? 'up' as const : 'down' as const },
      { id: 'tracking-error', label: 'Tracking Error', value: 3.2, format: 'percent' as const, status: 'ok' as const, timeframe: '1Y' },
      { id: 'best-contributor', label: 'Лучший вклад', value: best?.segment || 'N/A', format: 'text' as const, status: 'ok' as const },
      { id: 'worst-contributor', label: 'Худший вклад', value: worst?.segment || 'N/A', format: 'text' as const, status: 'warning' as const }
    ];
  }, [returns, attribution]);

  // Chart data
  const chartReturns = useMemo(() => {
    const portfolioReturns = returns.filter(r => r.objectType === 'portfolio' && r.objectId === 'portfolio-001');
    const benchmarkReturns = returns.filter(r => r.objectType === 'benchmark' && r.objectId === 'bm-001');
    
    return portfolioReturns.map(pr => ({
      period: pr.period,
      portfolioReturn: pr.returnPct,
      benchmarkReturn: benchmarkReturns.find(br => br.period === pr.period)?.returnPct
    }));
  }, [returns]);

  // Allocation breakdown
  const breakdownSections = useMemo(() => {
    const viewAttribution = attribution.filter(a => a.viewId === 'pv-001');
    
    const dimensions = ['assetClass', 'strategy', 'geography', 'liquidity'];
    const labels: Record<string, string> = {
      assetClass: 'Класс актива',
      strategy: 'Стратегия',
      geography: 'География',
      liquidity: 'Ликвидность'
    };

    return dimensions.map(dim => ({
      dimension: dim,
      label: labels[dim],
      items: viewAttribution
        .filter(a => a.dimension === dim)
        .map(a => ({
          segment: a.segment,
          weight: a.weightAvg,
          return: a.returnPct,
          contribution: a.contributionPct
        }))
    })).filter(s => s.items.length > 0);
  }, [attribution]);

  // Benchmark compare data
  const benchmarkCompareRows = useMemo(() => {
    const periods = ['YTD', 'Q4 2025', 'Q3 2025', 'Q2 2025', 'Q1 2025'];
    const portfolioValues = [14.9, 3.5, 2.2, 4.8, 3.2];
    const benchmarkValues = [12.8, 3.2, 1.8, 4.2, 2.8];
    
    return periods.map((period, i) => ({
      period,
      portfolioReturn: portfolioValues[i],
      benchmarkReturn: benchmarkValues[i],
      excess: portfolioValues[i] - benchmarkValues[i]
    }));
  }, []);

  // Attribution table data
  const attributionRows = useMemo(() => {
    return attribution
      .filter(a => a.viewId === 'pv-001' && a.dimension === attributionDimension)
      .map(a => ({
        id: a.id,
        segment: a.segment,
        weightAvg: a.weightAvg,
        returnPct: a.returnPct,
        contributionPct: a.contributionPct,
        flowImpactPct: a.flowImpactPct,
        feesImpactPct: a.feesImpactPct,
        status: a.status
      }));
  }, [attribution, attributionDimension]);

  // Advisor data
  const advisorData = useMemo(() => {
    const advisorAttr = attribution.filter(a => a.viewId === 'pv-001' && a.dimension === 'advisor');
    return advisors.map(adv => {
      const attr = advisorAttr.find(a => a.segment === adv.name);
      return {
        ...adv,
        periodReturn: attr?.returnPct || 0,
        excess: (attr?.returnPct || 0) - 12.8 // vs ACWI
      };
    });
  }, [advisors, attribution]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50/30">
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Эффективность портфеля</h1>
            <p className="text-sm text-stone-500 mt-1">
              Измерение доходности, атрибуция, сравнение с бенчмарками
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PerfTimeframeSwitcher value={timeframe} onChange={setTimeframe} />
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-500"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Actions bar */}
        <div className="mb-6">
          <PerfActionsBar
            clientSafe={clientSafe}
            onCreateView={() => setShowReportBuilder(true)}
            onAddBenchmark={() => router.push('/m/performance/list?tab=benchmarks')}
            onImportFlows={() => router.push('/m/performance/list?tab=flows')}
            onExport={() => console.log('Export')}
            onCreateTask={() => console.log('Create task')}
          />
        </div>

        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* KPIs */}
            <PerfKpiStrip kpis={kpis} />

            {/* Charts */}
            <PerfOverviewCharts 
              returns={chartReturns} 
              portfolioName="Основной портфель"
              benchmarkName={activeBenchmark?.name || 'MSCI ACWI'}
            />

            {/* Allocation breakdown */}
            <PerfAllocationBreakdown sections={breakdownSections} />

            {/* Benchmark compare */}
            <PerfBenchmarkCompare 
              benchmarkName={activeBenchmark?.name || 'MSCI ACWI'}
              rows={benchmarkCompareRows}
              onRowClick={period => console.log('Clicked period:', period)}
            />

            {/* Attribution table */}
            <PerfAttributionTable
              rows={attributionRows}
              dimension={attributionDimension}
              onDimensionChange={(dim) => setAttributionDimension(dim as typeof attributionDimension)}
              onRowClick={row => console.log('Clicked row:', row)}
            />

            {/* Advisor impact */}
            <PerfAdvisorImpact 
              advisors={advisorData}
              clientSafe={clientSafe}
              onAdvisorClick={id => router.push(`/m/performance/list?tab=advisors&id=${id}`)}
            />

            {/* AI Explain panel */}
            <PerfExplainPanel
              portfolioId="portfolio-001"
              viewId={activeView?.id}
              timeframe={timeframe}
              onOpenCopilot={() => console.log('Open Copilot')}
              onCreateReport={() => router.push('/m/reporting')}
            />
          </div>

          {/* AI Panel or Help panel */}
          {aiPanelOpen ? (
            <ModuleAiPanel />
          ) : showHelp ? (
            <div className="w-80 flex-shrink-0">
              <HelpPanel
                title="Эффективность портфеля"
                description="Измерение доходности (TWR/MWR), атрибуция, сравнение с бенчмарками"
                features={[
                  'TWR исключает влияние денежных потоков',
                  'MWR показывает реальную доходность инвестора',
                  'Атрибуция по классам, стратегиям, географии',
                  'Сравнение с индексами и ETF',
                  'AI-объяснение изменений'
                ]}
                scenarios={[
                  'Почему портфель просел?',
                  'Кто дал вклад в рост?',
                  'Как сравнить с ACWI?',
                  'Создать отчёт для клиента'
                ]}
                dataSources={[
                  'Депозитарии (Credit Suisse, Goldman)',
                  'Pricing providers',
                  'GL (General Ledger)',
                  'Ручной ввод'
                ]}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Report Builder drawer */}
      <PerfReportBuilder
        open={showReportBuilder}
        onClose={() => setShowReportBuilder(false)}
        onSave={config => console.log('Saved config:', config)}
      />
    </div>
  );
}
