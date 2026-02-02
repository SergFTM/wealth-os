"use client";

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiltersBar } from '@/components/templates/FiltersBar';
import { LqCashAccountsTable } from '@/modules/09-liquidity/ui/LqCashAccountsTable';
import { LqMovementsTable } from '@/modules/09-liquidity/ui/LqMovementsTable';
import { LqForecastPanel } from '@/modules/09-liquidity/ui/LqForecastPanel';
import { LqObligationsTable } from '@/modules/09-liquidity/ui/LqObligationsTable';
import { LqAlertsTable } from '@/modules/09-liquidity/ui/LqAlertsTable';
import { LqBucketsPanel } from '@/modules/09-liquidity/ui/LqBucketsPanel';
import { LqAccountDetail } from '@/modules/09-liquidity/ui/LqAccountDetail';
import { LqObligationDetail } from '@/modules/09-liquidity/ui/LqObligationDetail';

// Import seed data
import cashAccountsData from '@/db/data/cashAccounts.json';
import obligationsData from '@/db/data/obligations.json';
import forecastData from '@/db/data/cashForecast.json';
import alertsData from '@/db/data/liquidityAlerts.json';
import bucketsData from '@/db/data/liquidityBuckets.json';

const tabs = [
  { key: 'cash', label: 'Счета' },
  { key: 'movements', label: 'Движения' },
  { key: 'forecast', label: 'Прогноз' },
  { key: 'obligations', label: 'Обязательства' },
  { key: 'buckets', label: 'Корзины' },
  { key: 'alerts', label: 'Алерты' },
];

const entityNames: Record<string, string> = {
  'entity-001': 'Family Trust',
  'entity-002': 'Investment Holdings',
  'entity-003': 'European Holdings',
  'entity-004': 'Asset Management'
};

export default function LiquidityListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'cash';
  
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedObligationId, setSelectedObligationId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Parse data
  const accounts = useMemo(() => {
    const raw = (cashAccountsData as { cashAccounts?: unknown[] }).cashAccounts || [];
    return raw as Array<{
      id: string;
      name: string;
      clientId: string;
      entityId: string;
      bank: string;
      currency: string;
      balance: number;
      baseBalance: number;
      threshold: number;
      status: 'ok' | 'warning' | 'critical';
      lastSyncAt: string;
      sourceType: string;
    }>;
  }, []);
  
  const movements = useMemo(() => {
    const raw = (cashAccountsData as { cashMovements?: unknown[] }).cashMovements || [];
    return raw as Array<{
      id: string;
      accountId: string;
      entityId: string;
      date: string;
      type: 'inflow' | 'outflow' | 'transfer';
      amount: number;
      currency: string;
      status: 'planned' | 'posted' | 'cancelled';
      description: string;
      sourceType: string;
      sourceRef: string | null;
    }>;
  }, []);

  const obligations = obligationsData as Array<{
    id: string;
    name: string;
    entityId: string;
    type: string;
    dueDate: string;
    amount: number;
    currency: string;
    frequency: string;
    status: 'scheduled' | 'paid' | 'overdue' | 'cancelled';
    paidDate: string | null;
    sourceType: string;
    sourceRef: string | null;
  }>;

  const forecasts = forecastData as Array<{
    id: string;
    dateOrWeek: string;
    category: string;
    direction: 'in' | 'out';
    amount: number;
    currency: string;
    confidence: 'high' | 'medium' | 'low';
    sourceType: string;
    notes: string;
  }>;

  const alerts = alertsData as Array<{
    id: string;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    relatedType: string;
    relatedId: string;
    entityId: string;
    status: 'open' | 'acknowledged' | 'resolved';
    owner: string | null;
    createdAt: string;
  }>;

  const buckets = bucketsData as Array<{
    id: string;
    bucket: 'today' | '7d' | '30d' | '90d';
    inflows: number;
    outflows: number;
    net: number;
    status: 'ok' | 'warning' | 'critical';
  }>;

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const selectedObligation = obligations.find(o => o.id === selectedObligationId);

  const accountNames = useMemo(() => {
    return accounts.reduce((acc, a) => ({ ...acc, [a.id]: a.name }), {} as Record<string, string>);
  }, [accounts]);

  const setTab = (tab: string) => {
    router.push(`/m/liquidity/list?tab=${tab}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Ликвидность — Списки</h1>
          <p className="text-stone-500 mt-1">Счета, движения, прогнозы и обязательства</p>
        </div>
        <button
          onClick={() => router.push('/m/liquidity')}
          className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
        >
          ← Обзор
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <FiltersBar
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Content */}
      {activeTab === 'cash' && (
        <LqCashAccountsTable
          accounts={accounts}
          onOpen={setSelectedAccountId}
          entityNames={entityNames}
        />
      )}

      {activeTab === 'movements' && (
        <LqMovementsTable
          movements={movements}
          onOpen={(id) => console.log('Open movement:', id)}
          accountNames={accountNames}
          entityNames={entityNames}
        />
      )}

      {activeTab === 'forecast' && (
        <LqForecastPanel
          forecasts={forecasts}
          onEdit={(id) => console.log('Edit forecast:', id)}
          onCreateItem={() => console.log('Create forecast')}
        />
      )}

      {activeTab === 'obligations' && (
        <LqObligationsTable
          obligations={obligations}
          onOpen={setSelectedObligationId}
          entityNames={entityNames}
        />
      )}

      {activeTab === 'buckets' && (
        <LqBucketsPanel buckets={buckets} />
      )}

      {activeTab === 'alerts' && (
        <LqAlertsTable
          alerts={alerts}
          onOpen={(id) => console.log('Open alert:', id)}
          entityNames={entityNames}
        />
      )}

      {/* Account Detail Drawer */}
      {selectedAccount && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedAccountId(null)}
          />
          <LqAccountDetail
            account={selectedAccount}
            entityName={entityNames[selectedAccount.entityId]}
            onClose={() => setSelectedAccountId(null)}
            onEdit={() => console.log('Edit account')}
            onCreateTransfer={() => console.log('Create transfer')}
            onCreateTask={() => console.log('Create task')}
            onViewAudit={() => console.log('View audit')}
          />
        </>
      )}

      {/* Obligation Detail Drawer */}
      {selectedObligation && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedObligationId(null)}
          />
          <LqObligationDetail
            obligation={selectedObligation}
            entityName={entityNames[selectedObligation.entityId]}
            onClose={() => setSelectedObligationId(null)}
            onMarkPaid={() => console.log('Mark paid')}
            onReschedule={() => console.log('Reschedule')}
            onSendToBillPay={() => console.log('Send to BillPay')}
            onCreateTask={() => console.log('Create task')}
            onViewAudit={() => console.log('View audit')}
          />
        </>
      )}
    </div>
  );
}
