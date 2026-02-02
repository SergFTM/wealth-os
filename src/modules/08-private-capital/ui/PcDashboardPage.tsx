"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import seedData from '../seed.json';
import { PcKpiStrip } from './PcKpiStrip';
import { PcFundsTable } from './PcFundsTable';
import { PcCallsTable } from './PcCallsTable';
import { PcDistributionsTable } from './PcDistributionsTable';
import { PcVintagePanel } from './PcVintagePanel';
import { PcJCurvePanel } from './PcJCurvePanel';
import { PcForecastPanel } from './PcForecastPanel';
import { PcActionsBar } from './PcActionsBar';
import { PcFundDetail } from './PcFundDetail';

interface Fund {
  id: string;
  name: string;
  strategy: string;
  vintageYear: number;
  manager: string;
  currency: string;
  status: string;
  tags?: string[];
}

interface Commitment {
  id: string;
  fundId: string;
  amountCommitted: number;
  amountCalled: number;
  amountDistributed: number;
  unfunded: number;
  currency: string;
}

interface Valuation {
  id: string;
  fundId: string;
  nav: number;
  asOf: string;
  status: string;
}

export function PcDashboardPage() {
  const router = useRouter();
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);

  // Compute aggregations from seed data
  const funds = seedData.funds as Fund[];
  const commitments = seedData.commitments as Commitment[];
  const valuations = seedData.valuations as Valuation[];
  const capitalCalls = seedData.capitalCalls;
  const distributions = seedData.distributions;
  const vintageMetrics = seedData.vintageMetrics;
  const forecasts = seedData.forecasts;
  const documents = seedData.documents;

  // Aggregate fund data with commitments and valuations
  const fundsWithMetrics = useMemo(() => {
    return funds.map(fund => {
      const fundCommitments = commitments.filter(c => c.fundId === fund.id);
      const latestValuation = valuations
        .filter(v => v.fundId === fund.id)
        .sort((a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime())[0];
      
      const totalCommitment = fundCommitments.reduce((sum, c) => sum + c.amountCommitted, 0);
      const totalCalled = fundCommitments.reduce((sum, c) => sum + c.amountCalled, 0);
      const totalDistributed = fundCommitments.reduce((sum, c) => sum + c.amountDistributed, 0);
      const nav = latestValuation?.nav || 0;
      const tvpi = totalCalled > 0 ? (totalDistributed + nav) / totalCalled : 0;
      
      return {
        ...fund,
        commitment: totalCommitment,
        called: totalCalled,
        distributed: totalDistributed,
        nav,
        tvpi,
        irr: vintageMetrics.find(v => v.vintageYear === fund.vintageYear)?.irr || 0,
        valuationAsOf: latestValuation?.asOf
      };
    });
  }, [funds, commitments, valuations, vintageMetrics]);

  // KPI calculations
  const kpis = useMemo(() => {
    const totalCommitments = commitments.reduce((sum, c) => sum + c.amountCommitted, 0);
    const totalUnfunded = commitments.reduce((sum, c) => sum + c.unfunded, 0);
    const navTotal = valuations.reduce((sum, v) => sum + v.nav, 0);
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const calls30d = capitalCalls.filter(c => new Date(c.dueDate) >= thirtyDaysAgo).length;
    const dist30d = distributions.filter(d => new Date(d.date) >= thirtyDaysAgo).length;
    
    const staleValuations = valuations.filter(v => v.status === 'stale').length;
    const missingDocs = documents.filter(d => d.status === 'missing').length;
    const underperforming = vintageMetrics.filter(v => v.flag === 'underperform').length;

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val);
    };

    return [
      { id: 'totalCommitments', label: 'Обязательства', value: formatCurrency(totalCommitments), status: 'ok' as const, linkTo: '/m/private-capital/list?tab=commitments' },
      { id: 'unfunded', label: 'Невыбрано', value: formatCurrency(totalUnfunded), status: totalUnfunded > 5000000 ? 'warning' as const : 'ok' as const, linkTo: '/m/private-capital/list?tab=commitments' },
      { id: 'calls30d', label: 'Calls 30д', value: calls30d, status: 'ok' as const, linkTo: '/m/private-capital/list?tab=calls' },
      { id: 'distributions30d', label: 'Distributions 30д', value: dist30d, status: 'ok' as const, linkTo: '/m/private-capital/list?tab=distributions' },
      { id: 'navTotal', label: 'NAV', value: formatCurrency(navTotal), status: 'ok' as const, linkTo: '/m/private-capital/list?tab=valuations' },
      { id: 'staleValuations', label: 'Устаревшие оценки', value: staleValuations, status: staleValuations > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/private-capital/list?tab=valuations' },
      { id: 'missingDocs', label: 'Нет документов', value: missingDocs, status: missingDocs > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/private-capital/list?tab=documents' },
      { id: 'underperforming', label: 'Отстающие vintages', value: underperforming, status: underperforming > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/private-capital/list?tab=vintage' }
    ];
  }, [commitments, valuations, capitalCalls, distributions, documents, vintageMetrics]);

  // Recent calls and distributions
  const recentCalls = useMemo(() => {
    return capitalCalls
      .filter(c => c.status !== 'paid')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map(call => ({
        ...call,
        fundName: funds.find(f => f.id === call.fundId)?.name
      }));
  }, [capitalCalls, funds]);

  const recentDistributions = useMemo(() => {
    return distributions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(dist => ({
        ...dist,
        fundName: funds.find(f => f.id === dist.fundId)?.name
      }));
  }, [distributions, funds]);

  // Selected fund for detail view
  const selectedFund = useMemo(() => {
    if (!selectedFundId) return null;
    const fund = fundsWithMetrics.find(f => f.id === selectedFundId);
    if (!fund) return null;
    
    const fundCommitments = commitments.filter(c => c.fundId === fund.id);
    return {
      fund: {
        id: fund.id,
        name: fund.name,
        strategy: fund.strategy,
        vintageYear: fund.vintageYear,
        manager: fund.manager,
        currency: fund.currency,
        status: fund.status,
        tags: fund.tags
      },
      metrics: {
        commitment: fund.commitment || 0,
        called: fund.called || 0,
        distributed: fund.distributed || 0,
        unfunded: fundCommitments.reduce((sum, c) => sum + c.unfunded, 0),
        nav: fund.nav || 0,
        tvpi: fund.tvpi || 0,
        irr: fund.irr || 0,
        valuationAsOf: fund.valuationAsOf
      }
    };
  }, [selectedFundId, fundsWithMetrics, commitments]);

  const handleAction = (action: string) => {
    console.log('Action:', action);
    // TODO: Implement modals/forms
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Частный капитал</h1>
          <p className="text-stone-500 mt-1">PE/VC фонды, обязательства и распределения</p>
        </div>
        <button
          onClick={() => router.push('/m/private-capital/list')}
          className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Показать все →
        </button>
      </div>

      {/* KPI Strip */}
      <PcKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <PcActionsBar
        onAddFund={() => handleAction('addFund')}
        onAddCommitment={() => handleAction('addCommitment')}
        onCreateCall={() => handleAction('createCall')}
        onCreateDistribution={() => handleAction('createDistribution')}
        onAddValuation={() => handleAction('addValuation')}
        onImportExcel={() => handleAction('importExcel')}
        onConnectArch={() => handleAction('connectArch')}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funds Table - 2 columns */}
        <div className="lg:col-span-2">
          <PcFundsTable
            funds={fundsWithMetrics}
            onOpen={setSelectedFundId}
          />
        </div>

        {/* Vintage Panel */}
        <div>
          <PcVintagePanel
            vintages={vintageMetrics}
            onVintageClick={(year) => router.push(`/m/private-capital/list?tab=vintage&year=${year}`)}
          />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Calls Queue */}
        <PcCallsTable
          calls={recentCalls}
          onOpen={(id) => console.log('Open call:', id)}
          compact
        />

        {/* Distributions Queue */}
        <PcDistributionsTable
          distributions={recentDistributions}
          onOpen={(id) => console.log('Open distribution:', id)}
          compact
        />

        {/* J-Curve */}
        <PcJCurvePanel />
      </div>

      {/* Forecast Panel */}
      <PcForecastPanel
        forecasts={forecasts}
        onEdit={(id) => console.log('Edit forecast:', id)}
        onCreateTask={() => console.log('Create forecast review task')}
      />

      {/* Fund Detail Drawer */}
      {selectedFund && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedFundId(null)}
          />
          <PcFundDetail
            fund={selectedFund.fund}
            metrics={selectedFund.metrics}
            onClose={() => setSelectedFundId(null)}
            onEdit={() => console.log('Edit fund')}
            onAddCommitment={() => console.log('Add commitment')}
            onCreateCall={() => console.log('Create call')}
            onAddValuation={() => console.log('Add valuation')}
          />
        </>
      )}
    </div>
  );
}
