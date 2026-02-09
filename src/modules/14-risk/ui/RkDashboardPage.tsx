"use client";

import { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useApp } from '@/lib/store';
import { ModuleAiPanel } from '@/components/shell/ModuleAiPanel';
import { RkKpiStrip } from './RkKpiStrip';
import { RkExposurePanel } from './RkExposurePanel';
import { RkVarWidget } from './RkVarWidget';
import { RkStressPanel } from './RkStressPanel';
import { RkAlertsTable } from './RkAlertsTable';
import { RkActionsBar } from './RkActionsBar';
import { RkScopeSwitcher } from './RkScopeSwitcher';

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

interface RkDashboardPageProps {
  exposures: Exposure[];
  scenarios: StressScenario[];
  stressRuns: StressRun[];
  alerts: RiskAlert[];
  onNavigate?: (path: string) => void;
}

const portfolioOptions = [
  { id: 'all', label: 'Все портфели', sublabel: 'Агрегированный риск' },
  { id: 'pf-001', label: 'Growth Portfolio', sublabel: '$50M' },
  { id: 'pf-002', label: 'Balanced Portfolio', sublabel: '$20M' },
  { id: 'pf-003', label: 'Aggressive Growth', sublabel: '$50M' },
];

export function RkDashboardPage({
  exposures,
  scenarios,
  stressRuns,
  alerts,
  onNavigate
}: RkDashboardPageProps) {
  const { aiPanelOpen } = useApp();
  const [selectedPortfolio, setSelectedPortfolio] = useState('pf-001');
  const [selectedDimension, setSelectedDimension] = useState('assetClass');
  const [isLoading, setIsLoading] = useState(false);

  const filteredExposures = selectedPortfolio === 'all'
    ? exposures
    : exposures.filter(e => e.portfolioId === selectedPortfolio);

  const filteredAlerts = selectedPortfolio === 'all'
    ? alerts
    : alerts.filter(a => a.portfolioId === selectedPortfolio);

  const filteredStressRuns = selectedPortfolio === 'all'
    ? stressRuns
    : stressRuns.filter(r => r.portfolioId === selectedPortfolio);

  const activeAlerts = filteredAlerts.filter(a => a.status !== 'resolved');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

  const handleRunStressTests = async () => {
    setIsLoading(true);
    // Simulate stress test run
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleRefreshMetrics = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    console.log('Acknowledging alert:', alertId);
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Риск и надзор</h1>
          <p className="text-sm text-stone-500 mt-1">Мониторинг рисков и управление экспозициями</p>
        </div>
        <RkScopeSwitcher
          options={portfolioOptions}
          value={selectedPortfolio}
          onChange={setSelectedPortfolio}
          label="Портфель"
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span>Риск метрики информационные, не являются инвестиционной рекомендацией</span>
      </div>

      {/* Critical alerts banner */}
      {criticalAlerts.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
            <AlertTriangle className="w-5 h-5" />
            {criticalAlerts.length} критических алертов требуют внимания
          </div>
          <div className="space-y-1">
            {criticalAlerts.slice(0, 3).map(alert => (
              <div
                key={alert.id}
                onClick={() => onNavigate?.(`/m/risk/item/${alert.id}?type=alert`)}
                className="text-sm text-red-600 hover:underline cursor-pointer"
              >
                • {alert.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <RkActionsBar
        onRunStressTests={handleRunStressTests}
        onRefreshMetrics={handleRefreshMetrics}
        onExportReport={() => console.log('Export report')}
        onScheduleReview={() => console.log('Schedule review')}
        isLoading={isLoading}
      />

      {/* KPIs */}
      <RkKpiStrip />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exposure Panel - 2 columns */}
        <div className="lg:col-span-2">
          <RkExposurePanel
            exposures={filteredExposures}
            selectedDimension={selectedDimension}
            onDimensionChange={setSelectedDimension}
          />
        </div>

        {/* VaR Widget - 1 column */}
        <div>
          <RkVarWidget />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts - 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-800">Активные алерты</h3>
              <button
                onClick={() => onNavigate?.('/m/risk/list?tab=alerts')}
                className="text-xs text-emerald-600 hover:underline"
              >
                Все алерты →
              </button>
            </div>
            <RkAlertsTable
              alerts={activeAlerts.slice(0, 5)}
              onRowClick={(alert) => onNavigate?.(`/m/risk/item/${alert.id}?type=alert`)}
              onAcknowledge={handleAcknowledgeAlert}
              showOnlyActive
            />
          </div>
        </div>

        {/* Stress Panel - 1 column */}
        <div>
          <RkStressPanel
            scenarios={scenarios.filter(s => s.status === 'active')}
            recentRuns={filteredStressRuns}
            onRunScenario={(id) => console.log('Run scenario:', id)}
            onViewRun={(id) => onNavigate?.(`/m/risk/item/${id}?type=stressRun`)}
          />
        </div>
      </div>
      </div>

      {/* AI Panel */}
      {aiPanelOpen && <ModuleAiPanel />}
    </div>
  );
}
