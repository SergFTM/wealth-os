"use client";

import { useState, useCallback, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { useCollection } from '@/lib/hooks';
import { createRecord } from '@/lib/apiClient';
import { HelpPanel } from '@/components/templates/HelpPanel';

import {
  NetWorthKpiStrip,
  NetWorthOverviewCharts,
  NetWorthHoldingsTable,
  NetWorthLiabilitiesTable,
  NetWorthEntityDrilldown,
  NetWorthActionsBar,
  NetWorthDetailDrawer
} from './index';

import seedData from '../seed.json';

const helpContent = `
# Единый капитал (Net Worth)

## Что показывает
Агрегация всех активов и обязательств.

## Source-first
Каждая цифра имеет источник и as-of дату.

## Статусы оценки
- **Priced** — рыночная цена
- **Estimated** — экспертная оценка
- **Stale** — устарела (>30 дней)
- **Missing** — нет данных

## Сценарии
- Найти неликвиды
- Сверить депозитарий
- Прикрепить документ
- Создать задачу
`;

interface Holding {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  ticker?: string;
  assetClass: string;
  entityId?: string;
  accountId?: string;
  value: number;
  currency: string;
  valuationStatus: string;
  asOf?: string;
  sourceType?: string;
  sourceRef?: string;
  reconStatus?: string;
  liquidity?: string;
  quantity?: number;
  price?: number;
  tags?: string[];
  [key: string]: unknown;
}

interface Liability {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  entityId?: string;
  balance: number;
  rate?: number;
  currency: string;
  frequency?: string;
  nextPaymentDate?: string;
  status: string;
  sourceType?: string;
  [key: string]: unknown;
}

export function NetWorthDashboardPage() {
  const { user, locale } = useApp();
  const clientSafe = user?.role === 'client';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<Holding | null>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Use seed data as fallback (API-ready structure)
  // Note: useCollection returns BaseRecord types, we cast to our local type
  type HoldingRecord = { id: string; createdAt: string; updatedAt: string } & Record<string, unknown>;
  type LiabilityRecord = { id: string; createdAt: string; updatedAt: string } & Record<string, unknown>;
  
  const { items: holdingsApi, loading: holdingsLoading } = useCollection<HoldingRecord>('holdings', { limit: 50 });
  const { items: liabilitiesApi, loading: liabilitiesLoading } = useCollection<LiabilityRecord>('liabilities', { limit: 50 });

  // Use seed data if API returns empty
  const holdings: Holding[] = holdingsApi.length > 0 
    ? (holdingsApi as unknown as Holding[]) 
    : (seedData.holdings as unknown as Holding[]);
  const liabilities: Liability[] = liabilitiesApi.length > 0 
    ? (liabilitiesApi as unknown as Liability[]) 
    : (seedData.liabilities as unknown as Liability[]);
  const loading = holdingsLoading || liabilitiesLoading;

  // Calculate KPIs
  const kpiItems = useMemo(() => {
    const totalAssets = holdings.reduce((sum, h) => sum + h.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
    const liquidAssets = holdings.filter(h => h.liquidity === 'liquid').reduce((sum, h) => sum + h.value, 0);
    const illiquidAssets = holdings.filter(h => h.liquidity === 'illiquid').reduce((sum, h) => sum + h.value, 0);
    const staleCount = holdings.filter(h => h.valuationStatus === 'stale').length;
    const noSourceCount = holdings.filter(h => !h.sourceType).length;
    const reconIssueCount = holdings.filter(h => h.reconStatus === 'issue').length;

    return [
      { key: 'netWorth', title: locale === 'ru' ? 'Общий капитал' : 'Net Worth', value: totalAssets - totalLiabilities, status: 'ok' as const, asOf: '28.01.2026', sources: ['Custodian', 'Bank'], link: '/m/net-worth/list', format: 'currency' as const },
      { key: 'totalAssets', title: locale === 'ru' ? 'Активы' : 'Assets', value: totalAssets, status: 'ok' as const, asOf: '28.01.2026', sources: ['All'], format: 'currency' as const },
      { key: 'totalLiabilities', title: locale === 'ru' ? 'Обязательства' : 'Liabilities', value: totalLiabilities, status: totalLiabilities > 10000000 ? 'warning' as const : 'ok' as const, asOf: '28.01.2026', sources: ['Bank'], format: 'currency' as const },
      { key: 'liquidAssets', title: locale === 'ru' ? 'Ликвидные' : 'Liquid', value: liquidAssets, status: 'ok' as const, asOf: '28.01.2026', sources: ['Custodian'], format: 'currency' as const },
      { key: 'illiquidAssets', title: locale === 'ru' ? 'Неликвидные' : 'Illiquid', value: illiquidAssets, status: 'ok' as const, asOf: '28.01.2026', sources: ['Manual'], format: 'currency' as const },
      { key: 'staleValuations', title: locale === 'ru' ? 'Устаревшие' : 'Stale', value: staleCount, status: staleCount > 0 ? 'warning' as const : 'ok' as const, asOf: '28.01.2026', sources: [], link: '/m/net-worth/list?valuationStatus=stale', format: 'number' as const },
      { key: 'assetsNoSource', title: locale === 'ru' ? 'Без источника' : 'No Source', value: noSourceCount, status: noSourceCount > 0 ? 'warning' as const : 'ok' as const, asOf: '28.01.2026', sources: [], link: '/m/net-worth/list?sourceType=missing', format: 'number' as const },
      { key: 'reconIssues', title: locale === 'ru' ? 'Расхождения' : 'Recon Issues', value: reconIssueCount, status: reconIssueCount > 0 ? 'critical' as const : 'ok' as const, asOf: '28.01.2026', sources: [], link: '/m/net-worth/list?recon=issue', format: 'number' as const }
    ];
  }, [holdings, liabilities, locale]);

  // Allocation data
  const allocation = useMemo(() => {
    const byClass: Record<string, number> = {};
    holdings.forEach(h => {
      byClass[h.assetClass] = (byClass[h.assetClass] || 0) + h.value;
    });
    const colors: Record<string, string> = {
      Public: '#10b981', Private: '#3b82f6', RealEstate: '#f59e0b',
      Cash: '#6366f1', Personal: '#ec4899', Other: '#6b7280'
    };
    return Object.entries(byClass).map(([key, value]) => ({
      key, label: key, value, color: colors[key] || '#6b7280'
    }));
  }, [holdings]);

  // Trend data (mock 90 days)
  const trend = useMemo(() => {
    const total = holdings.reduce((sum, h) => sum + h.value, 0) - liabilities.reduce((sum, l) => sum + l.balance, 0);
    return Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.now() - (9 - i) * 9 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      value: total * (0.95 + Math.random() * 0.1)
    }));
  }, [holdings, liabilities]);

  // Entity breakdown
  const entities = useMemo(() => {
    const byEntity: Record<string, { assets: number; liabs: number; breakdown: Record<string, number> }> = {};
    
    holdings.forEach(h => {
      const eId = h.entityId || 'unknown';
      if (!byEntity[eId]) byEntity[eId] = { assets: 0, liabs: 0, breakdown: {} };
      byEntity[eId].assets += h.value;
      byEntity[eId].breakdown[h.assetClass] = (byEntity[eId].breakdown[h.assetClass] || 0) + h.value;
    });

    liabilities.forEach(l => {
      const eId = l.entityId || 'unknown';
      if (!byEntity[eId]) byEntity[eId] = { assets: 0, liabs: 0, breakdown: {} };
      byEntity[eId].liabs += l.balance;
    });

    const entityNames: Record<string, { name: string; type: string }> = {
      e1: { name: 'Personal Holdings', type: 'individual' },
      e2: { name: 'Investment Trust', type: 'trust' },
      e3: { name: 'Real Estate LLC', type: 'company' },
      unknown: { name: 'Unassigned', type: 'other' }
    };

    return Object.entries(byEntity).map(([id, data]) => ({
      id,
      name: entityNames[id]?.name || id,
      type: entityNames[id]?.type || 'other',
      totalAssets: data.assets,
      totalLiabilities: data.liabs,
      breakdown: Object.entries(data.breakdown).map(([assetClass, value]) => ({ assetClass, value }))
    }));
  }, [holdings, liabilities]);

  const handleRowClick = useCallback((holding: Holding) => {
    setDrawerItem(holding);
    setDrawerOpen(true);
  }, []);

  const handleCreateTask = useCallback(async (holding: Holding) => {
    await createRecord('tasks', {
      title: `Задача: ${holding.name}`,
      description: `Проверить актив ${holding.name}`,
      status: 'open',
      priority: 'medium',
      linkedCollection: 'holdings',
      linkedId: holding.id
    });
    alert(locale === 'ru' ? 'Задача создана' : 'Task created');
  }, [locale]);

  const handleAddHolding = () => setModalType('holding');
  const handleAddLiability = () => setModalType('liability');
  const handleAddValuation = () => setModalType('valuation');
  const handleImport = () => alert('Import: Creates sync job');
  const handleExport = () => alert('Export: Downloads CSV');
  const handleCreateReport = () => alert('Report: Creates reporting package');

  return (
    <div className="flex min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {locale === 'ru' ? 'Единый капитал' : 'Net Worth'}
            </h1>
            <p className="text-stone-500 text-sm">
              {locale === 'ru' ? 'Агрегация активов и обязательств' : 'Assets and liabilities aggregation'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NetWorthActionsBar
              onAddHolding={handleAddHolding}
              onAddLiability={handleAddLiability}
              onAddValuation={handleAddValuation}
              onImport={handleImport}
              onExport={handleExport}
              onCreateReport={handleCreateReport}
              clientSafe={clientSafe}
            />
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors ml-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <NetWorthKpiStrip items={kpiItems} loading={loading} clientSafe={clientSafe} />

        {/* Charts */}
        <NetWorthOverviewCharts allocation={allocation} trend={trend} loading={loading} />

        {/* Tables Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <NetWorthHoldingsTable
            holdings={holdings.sort((a, b) => b.value - a.value)}
            loading={loading}
            clientSafe={clientSafe}
            onRowClick={handleRowClick}
            onCreateTask={handleCreateTask}
          />
          <NetWorthLiabilitiesTable
            liabilities={liabilities.sort((a, b) => b.balance - a.balance)}
            loading={loading}
            onRowClick={() => {}}
          />
        </div>

        {/* Entity Drilldown */}
        <NetWorthEntityDrilldown entities={entities} loading={loading} />
      </div>

      {/* Help Panel */}
      {helpOpen && (
        <div className="w-80 border-l border-stone-200 bg-white/80 backdrop-blur-sm p-6">
          <HelpPanel content={helpContent} onClose={() => setHelpOpen(false)} />
        </div>
      )}

      {/* Detail Drawer */}
      <NetWorthDetailDrawer
        open={drawerOpen}
        item={drawerItem}
        type="holding"
        valuations={seedData.valuations.filter(v => v.objectId === drawerItem?.id)}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => setModalType('editHolding')}
        onDelete={() => alert('Delete: Confirm modal')}
        onCreateTask={() => drawerItem && handleCreateTask(drawerItem)}
        onAddDocument={() => alert('Add document modal')}
        onAddValuation={() => setModalType('valuation')}
        clientSafe={clientSafe}
      />
    </div>
  );
}
