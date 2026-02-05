"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { IhKpiStrip } from './IhKpiStrip';
import { IhConnectorsTable } from './IhConnectorsTable';
import { IhJobsTable } from './IhJobsTable';
import { IhRunsTable } from './IhRunsTable';
import { IhQualityTable } from './IhQualityTable';

interface Connector {
  id: string;
  clientId: string;
  name: string;
  type: 'bank' | 'broker' | 'custodian' | 'accounting' | 'bill' | 'arch';
  provider: string;
  status: 'active' | 'disabled';
  health: 'ok' | 'warning' | 'critical';
  lastRunId: string | null;
  lastRunAt: string | null;
  notes: string | null;
}

interface SyncJob {
  id: string;
  connectorId: string;
  name: string;
  scheduleCron: string;
  status: 'enabled' | 'paused';
  retryPolicyJson: string;
  slaMinutes: number;
  targetModules: string[];
}

interface SyncRun {
  id: string;
  jobId: string;
  connectorId: string;
  startedAt: string;
  endedAt: string | null;
  status: 'success' | 'failed' | 'partial' | 'running';
  recordsIngested: number;
  errorsCount: number;
  logPath: string | null;
}

interface DataQualityIssue {
  id: string;
  connectorId: string;
  runId: string;
  issueType: 'duplicate' | 'missing' | 'stale' | 'conflict';
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'in_progress' | 'resolved';
  affectedTable: string;
  affectedRecordIds: string[];
  description: string;
  detectedAt: string;
  resolvedAt: string | null;
  resolutionType: string | null;
  resolutionNotes: string | null;
}

interface IhDashboardPageProps {
  connectors: Connector[];
  jobs: SyncJob[];
  runs: SyncRun[];
  issues: DataQualityIssue[];
  onConnectorClick?: (connector: Connector) => void;
  onJobClick?: (job: SyncJob) => void;
  onRunClick?: (run: SyncRun) => void;
  onIssueClick?: (issue: DataQualityIssue) => void;
}

export function IhDashboardPage({
  connectors,
  jobs,
  runs,
  issues,
  onConnectorClick,
  onJobClick,
  onRunClick,
  onIssueClick,
}: IhDashboardPageProps) {
  // Build connector and job name maps
  const connectorNames = connectors.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {} as Record<string, string>);

  const jobNames = jobs.reduce((acc, j) => {
    acc[j.id] = j.name;
    return acc;
  }, {} as Record<string, string>);

  // Calculate KPIs
  const activeConnectors = connectors.filter(c => c.status === 'active').length;
  const enabledJobs = jobs.filter(j => j.status === 'enabled').length;
  const failedRuns7d = runs.filter(r => r.status === 'failed').length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const criticalIssues = issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

  const kpiItems = [
    { id: 'connectorsActive', label: 'Активные коннекторы', value: activeConnectors.toString(), color: 'default' as const },
    { id: 'jobsScheduled', label: 'Jobs запланировано', value: enabledJobs.toString(), color: 'default' as const },
    { id: 'runsFailed7d', label: 'Ошибки 7д', value: failedRuns7d.toString(), color: failedRuns7d > 0 ? 'red' as const : 'emerald' as const },
    { id: 'qualityOpen', label: 'Открытые проблемы', value: openIssues.toString(), color: openIssues > 0 ? 'amber' as const : 'emerald' as const },
    { id: 'criticalIssues', label: 'Критические', value: criticalIssues.toString(), color: criticalIssues > 0 ? 'red' as const : 'emerald' as const },
  ];

  // Get recent items
  const recentRuns = [...runs].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 5);
  const recentIssues = [...issues].filter(i => i.status !== 'resolved').sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()).slice(0, 5);
  const unhealthyConnectors = connectors.filter(c => c.health !== 'ok').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Интеграции и качество данных</h1>
          <p className="text-stone-500 mt-1">Data Integrations Hub — управление коннекторами и мониторинг качества</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/m/integrations/list?tab=connectors"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Все коннекторы
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Новый коннектор
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <IhKpiStrip items={kpiItems} />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <p className="text-sm text-amber-700">
            Интеграции в MVP демонстрационные, реальные подключения требуют настройки и проверки.
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent runs */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Последние запуски</h2>
            <Link href="/m/integrations/list?tab=runs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Все запуски
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <IhRunsTable
            runs={recentRuns}
            jobNames={jobNames}
            connectorNames={connectorNames}
            onRowClick={onRunClick}
            compact
          />
        </div>

        {/* Open quality issues */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Открытые проблемы</h2>
            <Link href="/m/integrations/list?tab=quality" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Все проблемы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <IhQualityTable
            issues={recentIssues}
            connectorNames={connectorNames}
            onRowClick={onIssueClick}
            compact
          />
        </div>
      </div>

      {/* Connectors and jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connectors needing attention */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Требуют внимания</h2>
            <Link href="/m/integrations/list?tab=connectors&health=warning,critical" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Все коннекторы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {unhealthyConnectors.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-emerald-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              Все коннекторы работают нормально
            </div>
          ) : (
            <IhConnectorsTable
              connectors={unhealthyConnectors}
              onRowClick={onConnectorClick}
              compact
            />
          )}
        </div>

        {/* Scheduled jobs */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Запланированные jobs</h2>
            <Link href="/m/integrations/list?tab=jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Все jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <IhJobsTable
            jobs={jobs.filter(j => j.status === 'enabled').slice(0, 5)}
            connectorNames={connectorNames}
            onRowClick={onJobClick}
            compact
          />
        </div>
      </div>
    </div>
  );
}
