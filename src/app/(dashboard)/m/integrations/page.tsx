"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IhDashboardPage } from '@/modules/18-integrations/ui/IhDashboardPage';

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

export default function IntegrationsDashboardPage() {
  const router = useRouter();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [issues, setIssues] = useState<DataQualityIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [connectorsRes, jobsRes, runsRes, issuesRes] = await Promise.all([
          fetch('/api/collections/connectors'),
          fetch('/api/collections/syncJobs'),
          fetch('/api/collections/syncRuns'),
          fetch('/api/collections/dataQualityIssues'),
        ]);

        const [connectorsRaw, jobsRaw, runsRaw, issuesRaw] = await Promise.all([
          connectorsRes.json(),
          jobsRes.json(),
          runsRes.json(),
          issuesRes.json(),
        ]);

        setConnectors(connectorsRaw.items ?? connectorsRaw ?? []);
        setJobs(jobsRaw.items ?? jobsRaw ?? []);
        setRuns(runsRaw.items ?? runsRaw ?? []);
        setIssues(issuesRaw.items ?? issuesRaw ?? []);
      } catch (error) {
        console.error('Failed to fetch integrations data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleConnectorClick = (connector: Connector) => {
    router.push(`/m/integrations/item/${connector.id}`);
  };

  const handleJobClick = (job: SyncJob) => {
    router.push(`/m/integrations/list?tab=jobs&id=${job.id}`);
  };

  const handleRunClick = (run: SyncRun) => {
    router.push(`/m/integrations/list?tab=runs&id=${run.id}`);
  };

  const handleIssueClick = (issue: DataQualityIssue) => {
    router.push(`/m/integrations/list?tab=quality&id=${issue.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <IhDashboardPage
      connectors={connectors}
      jobs={jobs}
      runs={runs}
      issues={issues}
      onConnectorClick={handleConnectorClick}
      onJobClick={handleJobClick}
      onRunClick={handleRunClick}
      onIssueClick={handleIssueClick}
    />
  );
}
