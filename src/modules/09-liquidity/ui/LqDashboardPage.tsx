"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LqKpiStrip } from './LqKpiStrip';
import { LqCashAccountsTable } from './LqCashAccountsTable';
import { LqBucketsPanel } from './LqBucketsPanel';
import { LqForecastPanel } from './LqForecastPanel';
import { LqObligationsTable } from './LqObligationsTable';
import { LqAlertsTable } from './LqAlertsTable';
import { LqStressTestPanel } from './LqStressTestPanel';
import { LqActionsBar } from './LqActionsBar';
import { LqAccountDetail } from './LqAccountDetail';
import { LqObligationDetail } from './LqObligationDetail';

// Import seed data
import cashAccountsData from '@/db/data/cashAccounts.json';
import obligationsData from '@/db/data/obligations.json';
import forecastData from '@/db/data/cashForecast.json';
import alertsData from '@/db/data/liquidityAlerts.json';
import bucketsData from '@/db/data/liquidityBuckets.json';

interface CashAccount {
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
}

interface Obligation {
  id: string;
  name: string;
  clientId: string;
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
}

const entityNames: Record<string, string> = {
  'entity-001': 'Family Trust',
  'entity-002': 'Investment Holdings',
  'entity-003': 'European Holdings',
  'entity-004': 'Asset Management'
};

export function LqDashboardPage() {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedObligationId, setSelectedObligationId] = useState<string | null>(null);

  // Parse data - handle both object and array formats
  const accounts = useMemo(() => {
    const raw = (cashAccountsData as { cashAccounts?: CashAccount[] }).cashAccounts || [];
    return raw as CashAccount[];
  }, []);

  const obligations = useMemo(() => {
    return obligationsData as Obligation[];
  }, []);

  const forecasts = useMemo(() => {
    return forecastData as Array<{
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
  }, []);

  const alerts = useMemo(() => {
    return alertsData as Array<{
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
  }, []);

  const buckets = useMemo(() => {
    return bucketsData as Array<{
      id: string;
      bucket: 'today' | '7d' | '30d' | '90d';
      inflows: number;
      outflows: number;
      net: number;
      status: 'ok' | 'warning' | 'critical';
    }>;
  }, []);

  // Compute KPIs
  const kpis = useMemo(() => {
    const totalCash = accounts.reduce((sum, acc) => sum + acc.baseBalance, 0);
    const todayBucket = buckets.find(b => b.bucket === 'today');
    const bucket30d = buckets.find(b => b.bucket === '30d');
    
    const upcoming7d = obligations.filter(o => {
      const due = new Date(o.dueDate);
      const now = new Date();
      const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7 && o.status !== 'paid';
    }).length;

    const capitalCalls30d = forecasts.filter(f => 
      f.category === 'capital_call' && f.direction === 'out'
    ).length;

    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'open').length;
    const belowThreshold = accounts.filter(a => a.status === 'warning' || a.status === 'critical').length;
    const missingFeeds = accounts.filter(a => {
      const lastSync = new Date(a.lastSyncAt);
      const now = new Date();
      return (now.getTime() - lastSync.getTime()) > 2 * 24 * 60 * 60 * 1000;
    }).length;

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val);
    };

    return [
      { id: 'totalCash', label: 'Общий кэш', value: formatCurrency(totalCash), status: 'ok' as const, linkTo: '/m/liquidity/list?tab=cash' },
      { id: 'cashToday', label: 'Bucket Today', value: formatCurrency(todayBucket?.net || 0), status: 'ok' as const, linkTo: '/m/liquidity/list?tab=buckets&bucket=today' },
      { id: 'netCash30d', label: 'Нетто 30д', value: formatCurrency(bucket30d?.net || 0), status: (bucket30d?.net || 0) < 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=forecast&period=30d' },
      { id: 'upcoming7d', label: 'Платежи 7д', value: upcoming7d, status: upcoming7d > 3 ? 'warning' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=obligations&period=7d' },
      { id: 'capitalCalls30d', label: 'Capital calls 30д', value: capitalCalls30d, status: 'ok' as const, linkTo: '/m/liquidity/list?tab=forecast&filter=capital_calls' },
      { id: 'alertsCritical', label: 'Критич. алерты', value: criticalAlerts, status: criticalAlerts > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=alerts&severity=critical' },
      { id: 'belowThreshold', label: 'Ниже порога', value: belowThreshold, status: belowThreshold > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/liquidity/list?tab=cash&filter=below_threshold' },
      { id: 'missingFeeds', label: 'Нет синка', value: missingFeeds, status: missingFeeds > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/integrations/list?tab=feeds' }
    ];
  }, [accounts, buckets, obligations, forecasts, alerts]);

  // Selected items
  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const selectedObligation = obligations.find(o => o.id === selectedObligationId);

  // Sorted obligations (upcoming first)
  const upcomingObligations = useMemo(() => {
    return [...obligations]
      .filter(o => o.status !== 'paid')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [obligations]);

  // Recent alerts
  const recentAlerts = useMemo(() => {
    return [...alerts]
      .filter(a => a.status === 'open')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [alerts]);

  const handleAction = (action: string) => {
    console.log('Action:', action);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Ликвидность и кэш</h1>
          <p className="text-stone-500 mt-1">Управление денежными потоками и обязательствами</p>
        </div>
        <button
          onClick={() => router.push('/m/liquidity/list')}
          className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Показать все →
        </button>
      </div>

      {/* KPI Strip */}
      <LqKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <LqActionsBar
        onAddAccount={() => handleAction('addAccount')}
        onAddMovement={() => handleAction('addMovement')}
        onAddObligation={() => handleAction('addObligation')}
        onAddForecast={() => handleAction('addForecast')}
        onExport={() => handleAction('export')}
        onCreateTask={() => handleAction('createTask')}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Accounts Table - 2 columns */}
        <div className="lg:col-span-2">
          <LqCashAccountsTable
            accounts={accounts}
            onOpen={setSelectedAccountId}
            entityNames={entityNames}
          />
        </div>

        {/* Buckets Panel */}
        <div>
          <LqBucketsPanel buckets={buckets} />
        </div>
      </div>

      {/* Forecast Panel */}
      <LqForecastPanel
        forecasts={forecasts}
        onEdit={(id) => console.log('Edit forecast:', id)}
        onExplain={() => console.log('Explain forecast')}
        onCreateItem={() => handleAction('addForecast')}
      />

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Obligations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
            <h3 className="font-semibold text-stone-800">Ближайшие обязательства</h3>
            <button
              onClick={() => router.push('/m/liquidity/list?tab=obligations')}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              Все →
            </button>
          </div>
          <LqObligationsTable
            obligations={upcomingObligations}
            onOpen={setSelectedObligationId}
            entityNames={entityNames}
            compact
          />
        </div>

        {/* Alerts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
            <h3 className="font-semibold text-stone-800">Алерты</h3>
            <button
              onClick={() => router.push('/m/liquidity/list?tab=alerts')}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              Все →
            </button>
          </div>
          <LqAlertsTable
            alerts={recentAlerts}
            onOpen={(id) => console.log('Open alert:', id)}
            entityNames={entityNames}
            compact
          />
        </div>
      </div>

      {/* Stress Test Panel */}
      <LqStressTestPanel
        onCreateTask={() => handleAction('createTask')}
      />

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
