"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import seedData from '@/modules/08-private-capital/seed.json';
import { PcFundsTable } from '@/modules/08-private-capital/ui/PcFundsTable';
import { PcCommitmentsTable } from '@/modules/08-private-capital/ui/PcCommitmentsTable';
import { PcCallsTable } from '@/modules/08-private-capital/ui/PcCallsTable';
import { PcDistributionsTable } from '@/modules/08-private-capital/ui/PcDistributionsTable';
import { PcValuationsTable } from '@/modules/08-private-capital/ui/PcValuationsTable';
import { PcVintagePanel } from '@/modules/08-private-capital/ui/PcVintagePanel';
import { PcForecastPanel } from '@/modules/08-private-capital/ui/PcForecastPanel';
import { PcDocumentsPanel } from '@/modules/08-private-capital/ui/PcDocumentsPanel';

type TabKey = 'funds' | 'commitments' | 'calls' | 'distributions' | 'valuations' | 'vintage' | 'forecast' | 'documents';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'funds', label: 'Фонды' },
  { key: 'commitments', label: 'Обязательства' },
  { key: 'calls', label: 'Capital Calls' },
  { key: 'distributions', label: 'Распределения' },
  { key: 'valuations', label: 'Оценки NAV' },
  { key: 'vintage', label: 'Vintage Analysis' },
  { key: 'forecast', label: 'Прогноз' },
  { key: 'documents', label: 'Документы' }
];

export default function PrivateCapitalListPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'funds';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const funds = seedData.funds;
  const commitments = seedData.commitments;
  const capitalCalls = seedData.capitalCalls;
  const distributions = seedData.distributions;
  const valuations = seedData.valuations;
  const vintageMetrics = seedData.vintageMetrics;
  const forecasts = seedData.forecasts;
  const documents = seedData.documents;

  // Enrich data with fund names
  const enrichedCommitments = useMemo(() => {
    return commitments.map(c => ({
      ...c,
      fundName: funds.find(f => f.id === c.fundId)?.name
    }));
  }, [commitments, funds]);

  const enrichedCalls = useMemo(() => {
    return capitalCalls.map(c => ({
      ...c,
      fundName: funds.find(f => f.id === c.fundId)?.name
    }));
  }, [capitalCalls, funds]);

  const enrichedDistributions = useMemo(() => {
    return distributions.map(d => ({
      ...d,
      fundName: funds.find(f => f.id === d.fundId)?.name
    }));
  }, [distributions, funds]);

  const enrichedValuations = useMemo(() => {
    return valuations.map(v => ({
      ...v,
      fundName: funds.find(f => f.id === v.fundId)?.name
    }));
  }, [valuations, funds]);

  const enrichedDocuments = useMemo(() => {
    return documents.map(d => ({
      ...d,
      fundName: funds.find(f => f.id === d.fundId)?.name
    }));
  }, [documents, funds]);

  // Enrich funds with metrics
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

  const renderContent = () => {
    switch (activeTab) {
      case 'funds':
        return (
          <PcFundsTable
            funds={fundsWithMetrics}
            onOpen={(id) => console.log('Open fund:', id)}
          />
        );
      case 'commitments':
        return (
          <PcCommitmentsTable
            commitments={enrichedCommitments}
            onOpen={(id) => console.log('Open commitment:', id)}
            onCreateCall={(id) => console.log('Create call for:', id)}
            onCreateTask={(id) => console.log('Create task for:', id)}
          />
        );
      case 'calls':
        return (
          <PcCallsTable
            calls={enrichedCalls}
            onOpen={(id) => console.log('Open call:', id)}
            onMarkPaid={(id) => console.log('Mark paid:', id)}
            onAttachDoc={(id) => console.log('Attach doc:', id)}
            onCreateTask={(id) => console.log('Create task:', id)}
          />
        );
      case 'distributions':
        return (
          <PcDistributionsTable
            distributions={enrichedDistributions}
            onOpen={(id) => console.log('Open distribution:', id)}
            onMarkReceived={(id) => console.log('Mark received:', id)}
            onAttachDoc={(id) => console.log('Attach doc:', id)}
          />
        );
      case 'valuations':
        return (
          <PcValuationsTable
            valuations={enrichedValuations}
            onOpen={(id) => console.log('Open valuation:', id)}
            onAddValuation={(fundId) => console.log('Add valuation for:', fundId)}
            onAttachDoc={(id) => console.log('Attach doc:', id)}
            onCreateTask={(id) => console.log('Create task:', id)}
          />
        );
      case 'vintage':
        return (
          <PcVintagePanel
            vintages={vintageMetrics}
            onVintageClick={(year) => console.log('Filter by vintage:', year)}
          />
        );
      case 'forecast':
        return (
          <PcForecastPanel
            forecasts={forecasts}
            onEdit={(id) => console.log('Edit forecast:', id)}
            onCreateTask={() => console.log('Create forecast task')}
          />
        );
      case 'documents':
        return (
          <PcDocumentsPanel
            documents={enrichedDocuments}
            onOpen={(id) => console.log('Open document:', id)}
            onUpload={() => console.log('Upload document')}
            onShare={(id) => console.log('Share document:', id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
            <Link href="/m/private-capital" className="hover:text-emerald-600">Частный капитал</Link>
            <span>/</span>
            <span>Список</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Private Capital</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
