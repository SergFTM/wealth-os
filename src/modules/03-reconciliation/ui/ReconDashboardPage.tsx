"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCollection } from '@/lib/hooks';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { 
  ReconKpiStrip, 
  ReconHealthPanel, 
  ReconJobsTable, 
  ReconBreaksTable, 
  ReconExceptionsTable,
  ReconMappingPanel,
  ReconBreakDetail,
  ReconJobDetail,
  ReconActionsBar 
} from './index';

import seedData from '../seed.json';

// Types
interface DataFeed {
  id: string;
  providerName: string;
  type: 'custodian' | 'bank' | 'advisor' | 'manual';
  coverage: string[];
  status: 'ok' | 'stale' | 'error';
  lastSyncAt: string;
  authStatus?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReconJob {
  id: string;
  clientId?: string;
  feedId: string;
  asOf: string;
  scope?: string[];
  matchPct?: number | null;
  totalRecords?: number | null;
  matchedRecords?: number | null;
  breaksCount?: number | null;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string | null;
  triggeredBy?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReconBreak {
  id: string;
  jobId: string;
  clientId?: string;
  entityId?: string;
  accountId?: string;
  instrument?: string | null;
  breakType: string;
  expected: string | number | null;
  actual: string | number | null;
  delta?: number | null;
  currency?: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  owner?: string | null;
  resolution?: string;
  evidenceDocIds?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReconMapping {
  id: string;
  feedId: string;
  mappingType: 'symbol' | 'account' | 'entity';
  externalKey: string;
  internalKey?: string | null;
  externalName?: string;
  internalName?: string | null;
  status: 'mapped' | 'unmapped' | 'pending';
  confidence?: number | null;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReconException {
  id: string;
  feedId: string;
  exceptionType: string;
  errorCode?: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ReconDashboardPageProps {
  clientSafe?: boolean;
}

export function ReconDashboardPage({ clientSafe = false }: ReconDashboardPageProps) {
  // Fetch data from API with fallback to seed
  const { items: apiFeeds, loading: feedsLoading } = useCollection<DataFeed>('dataFeeds');
  const { items: apiJobs, loading: jobsLoading } = useCollection<ReconJob>('reconJobs');
  const { items: apiBreaks, loading: breaksLoading } = useCollection<ReconBreak>('reconBreaks');
  const { items: apiMappings, loading: mappingsLoading } = useCollection<ReconMapping>('reconMappings');
  
  // Use seed data as fallback
  const feeds = apiFeeds.length > 0 ? apiFeeds : (seedData.dataFeeds as unknown as DataFeed[]);
  const jobs = apiJobs.length > 0 ? apiJobs : (seedData.reconJobs as unknown as ReconJob[]);
  const breaks = apiBreaks.length > 0 ? apiBreaks : (seedData.reconBreaks as unknown as ReconBreak[]);
  const mappings = apiMappings.length > 0 ? apiMappings : (seedData.reconMappings as unknown as ReconMapping[]);
  const exceptions = seedData.reconExceptions as unknown as ReconException[];

  // State for modals/drawers
  const [selectedBreak, setSelectedBreak] = useState<ReconBreak | null>(null);
  const [selectedJob, setSelectedJob] = useState<ReconJob | null>(null);
  const [breakDrawerOpen, setBreakDrawerOpen] = useState(false);
  const [jobDrawerOpen, setJobDrawerOpen] = useState(false);

  const loading = feedsLoading || jobsLoading || breaksLoading || mappingsLoading;

  // Compute KPIs
  const kpiItems = useMemo(() => {
    const okFeeds = feeds.filter(f => f.status === 'ok').length;
    const staleFeeds = feeds.filter(f => f.status === 'stale').length;
    const errorFeeds = feeds.filter(f => f.status === 'error').length;
    const feedHealth = errorFeeds > 0 ? 'critical' : staleFeeds > 0 ? 'warning' : 'ok';

    const openBreaks = breaks.filter(b => b.status === 'open').length;
    const criticalBreaks = breaks.filter(b => b.severity === 'critical' && b.status !== 'resolved').length;
    const unmappedItems = mappings.filter(m => m.status === 'unmapped').length;
    const openExceptions = exceptions.filter(e => e.status === 'open').length;

    const lastJob = jobs.filter(j => j.status === 'completed').sort((a, b) => 
      new Date(b.finishedAt || b.startedAt).getTime() - new Date(a.finishedAt || a.startedAt).getTime()
    )[0];

    return [
      { 
        key: 'feedHealth', 
        title: 'Источники', 
        value: `${okFeeds}/${feeds.length} OK`, 
        status: feedHealth as 'ok' | 'warning' | 'critical',
        link: '/m/reconciliation/list?tab=feeds'
      },
      { 
        key: 'lastReconAt', 
        title: 'Последняя сверка', 
        value: lastJob ? new Date(lastJob.finishedAt || lastJob.startedAt).toLocaleDateString('ru-RU') : '—',
        status: lastJob ? 'ok' as const : 'warning' as const,
        format: 'datetime' as const,
        link: '/m/reconciliation/list?tab=jobs'
      },
      { 
        key: 'openBreaks', 
        title: 'Открыто расхождений', 
        value: openBreaks, 
        status: openBreaks === 0 ? 'ok' as const : openBreaks > 5 ? 'critical' as const : 'warning' as const,
        link: '/m/reconciliation/list?tab=breaks&status=open'
      },
      { 
        key: 'criticalBreaks', 
        title: 'Критические', 
        value: criticalBreaks, 
        status: criticalBreaks === 0 ? 'ok' as const : 'critical' as const,
        link: '/m/reconciliation/list?tab=breaks&severity=critical'
      },
      { 
        key: 'unmappedItems', 
        title: 'Без маппинга', 
        value: unmappedItems, 
        status: unmappedItems === 0 ? 'ok' as const : unmappedItems > 3 ? 'critical' as const : 'warning' as const,
        link: '/m/reconciliation/list?tab=mappings&status=unmapped'
      },
      { 
        key: 'staleFeeds', 
        title: 'Устаревшие', 
        value: staleFeeds + errorFeeds, 
        status: staleFeeds + errorFeeds === 0 ? 'ok' as const : 'warning' as const,
        link: '/m/reconciliation/list?tab=feeds&status=stale'
      },
      { 
        key: 'dataQualityIssues', 
        title: 'Качество данных', 
        value: openExceptions, 
        status: openExceptions === 0 ? 'ok' as const : 'warning' as const,
        link: '/m/integrations/list?tab=data_quality'
      },
      { 
        key: 'slaRisk', 
        title: 'Риск SLA', 
        value: criticalBreaks > 2 ? criticalBreaks : 0, 
        status: criticalBreaks > 2 ? 'critical' as const : 'ok' as const,
        link: '/m/workflow/list?tag=recon_sla'
      }
    ];
  }, [feeds, jobs, breaks, mappings, exceptions]);

  // Enrich jobs with feed names
  const enrichedJobs = useMemo(() => {
    return jobs.map(job => ({
      ...job,
      feedName: feeds.find(f => f.id === job.feedId)?.providerName
    })).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [jobs, feeds]);

  // Filter active breaks (open or investigating)
  const activeBreaks = useMemo(() => {
    return breaks
      .filter(b => b.status === 'open' || b.status === 'investigating')
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
      });
  }, [breaks]);

  // Enrich mappings with feed names
  const enrichedMappings = useMemo(() => {
    return mappings.map(m => ({
      ...m,
      feedName: feeds.find(f => f.id === m.feedId)?.providerName
    }));
  }, [mappings, feeds]);

  // Enrich exceptions with feed names
  const enrichedExceptions = useMemo(() => {
    return exceptions.map(e => ({
      ...e,
      feedName: feeds.find(f => f.id === e.feedId)?.providerName
    }));
  }, [exceptions, feeds]);

  // Handlers
  const handleBreakClick = useCallback((brk: ReconBreak) => {
    setSelectedBreak(brk);
    setBreakDrawerOpen(true);
  }, []);

  const handleJobClick = useCallback((job: ReconJob) => {
    setSelectedJob(job);
    setJobDrawerOpen(true);
  }, []);

  const handleRunSync = useCallback((feedId: string) => {
    console.log('Run sync for feed:', feedId);
    // TODO: Call API to trigger sync
  }, []);

  const handleRunRecon = useCallback(() => {
    console.log('Run reconciliation');
    // TODO: Open dialog to select feed and as-of date
  }, []);

  const handleExportReport = useCallback(() => {
    console.log('Export report');
    // TODO: Generate and download CSV/PDF
  }, []);

  // Related breaks for selected job
  const relatedBreaks = useMemo(() => {
    if (!selectedJob) return [];
    return breaks.filter(b => b.jobId === selectedJob.id);
  }, [selectedJob, breaks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Сверка депозитария</h1>
            <p className="text-stone-500 text-sm">Синхронизация и сверка позиций с источниками данных</p>
          </div>
          {!clientSafe && (
            <ReconActionsBar 
              onRunRecon={handleRunRecon}
              onExportReport={handleExportReport}
              onAddFeed={() => console.log('Add feed')}
              onAddMapping={() => console.log('Add mapping')}
              onCreateTask={() => console.log('Create task')}
              clientSafe={clientSafe}
            />
          )}
        </div>

        {/* KPI Strip */}
        <ReconKpiStrip items={kpiItems} loading={loading} clientSafe={clientSafe} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feed Health Panel */}
            <ReconHealthPanel 
              feeds={feeds} 
              loading={feedsLoading} 
              onRunSync={handleRunSync}
              clientSafe={clientSafe}
            />

            {/* Jobs Table */}
            <ReconJobsTable 
              jobs={enrichedJobs}
              loading={jobsLoading}
              limit={5}
              onRowClick={handleJobClick}
              onRerun={(jobId) => console.log('Rerun job:', jobId)}
            />

            {/* Breaks Table */}
            <ReconBreaksTable 
              breaks={activeBreaks}
              loading={breaksLoading}
              limit={8}
              onRowClick={handleBreakClick}
              onAssign={(breakId) => console.log('Assign:', breakId)}
              onCreateTask={(breakId) => console.log('Create task:', breakId)}
              onResolve={(breakId) => console.log('Resolve:', breakId)}
              clientSafe={clientSafe}
            />
          </div>

          {/* Right column - 1/3 width */}
          <div className="space-y-6">
            {/* Exceptions (internal only) */}
            <ReconExceptionsTable 
              exceptions={enrichedExceptions}
              limit={5}
              onRowClick={(exc) => console.log('Exception:', exc)}
              onCreateIssue={(excId) => console.log('Create issue:', excId)}
              clientSafe={clientSafe}
            />

            {/* Mapping Panel (internal only) */}
            <ReconMappingPanel 
              mappings={enrichedMappings}
              loading={mappingsLoading}
              onCreateMapping={() => console.log('Create mapping')}
              onApproveMapping={(id) => console.log('Approve mapping:', id)}
              onEditMapping={(m) => console.log('Edit mapping:', m)}
              clientSafe={clientSafe}
            />

            {/* Help Panel */}
            <HelpPanel 
              title="Сверка депозитария"
              description="Синхронизация и сверка позиций, транзакций и денежных движений из различных источников данных"
              features={[
                'Автоматическая загрузка данных из custodian и bank',
                'Сравнение позиций, транзакций и cash',
                'Выявление и классификация расхождений',
                'Маппинг внешних идентификаторов',
                'Аудит всех действий'
              ]}
              scenarios={[
                'Найти открытые расхождения',
                'Сверить позиции клиента',
                'Добавить новый источник данных',
                'Одобрить маппинг символа'
              ]}
              dataSources={[
                'Депозитарии (Credit Suisse, Goldman Sachs)',
                'Банки (UBS, HSBC, BNP Paribas)',
                'Консультанты (Family Office Advisors)',
                'Ручной ввод'
              ]}
            />
          </div>
        </div>
      </div>

      {/* Break Detail Drawer */}
      <ReconBreakDetail 
        brk={selectedBreak}
        open={breakDrawerOpen}
        onClose={() => setBreakDrawerOpen(false)}
        onAssign={(id, owner) => console.log('Assign:', id, owner)}
        onChangeStatus={(id, status) => console.log('Change status:', id, status)}
        onCreateTask={(id) => console.log('Create task:', id)}
        onAddDocument={(id) => console.log('Add document:', id)}
        onCheckMapping={(id) => console.log('Check mapping:', id)}
        onCreateIssue={(id) => console.log('Create issue:', id)}
        onRerun={(id) => console.log('Rerun for break:', id)}
        clientSafe={clientSafe}
      />

      {/* Job Detail Drawer */}
      <ReconJobDetail 
        job={selectedJob}
        relatedBreaks={relatedBreaks}
        open={jobDrawerOpen}
        onClose={() => setJobDrawerOpen(false)}
        onRerun={(id) => console.log('Rerun job:', id)}
        onExport={(id) => console.log('Export job:', id)}
        onBreakClick={(id) => {
          const brk = breaks.find(b => b.id === id);
          if (brk) {
            setJobDrawerOpen(false);
            setTimeout(() => {
              setSelectedBreak(brk);
              setBreakDrawerOpen(true);
            }, 200);
          }
        }}
        clientSafe={clientSafe}
      />
    </div>
  );
}
