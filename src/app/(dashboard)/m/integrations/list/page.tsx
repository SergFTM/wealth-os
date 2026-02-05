"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plug, Calendar, Play, Link2, AlertTriangle, Scale, AlertCircle } from 'lucide-react';
import { IhConnectorsTable } from '@/modules/18-integrations/ui/IhConnectorsTable';
import { IhJobsTable } from '@/modules/18-integrations/ui/IhJobsTable';
import { IhRunsTable } from '@/modules/18-integrations/ui/IhRunsTable';
import { IhMappingPanel } from '@/modules/18-integrations/ui/IhMappingPanel';
import { IhQualityTable } from '@/modules/18-integrations/ui/IhQualityTable';
import { IhReconciliationTable } from '@/modules/18-integrations/ui/IhReconciliationTable';
import { IhErrorsConsole } from '@/modules/18-integrations/ui/IhErrorsConsole';

type TabId = 'connectors' | 'jobs' | 'runs' | 'mapping' | 'quality' | 'reconciliation' | 'errors';

const tabs: { id: TabId; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'connectors', label: 'Коннекторы', Icon: Plug },
  { id: 'jobs', label: 'Jobs', Icon: Calendar },
  { id: 'runs', label: 'Runs', Icon: Play },
  { id: 'mapping', label: 'Mapping', Icon: Link2 },
  { id: 'quality', label: 'Quality', Icon: AlertTriangle },
  { id: 'reconciliation', label: 'Reconciliation', Icon: Scale },
  { id: 'errors', label: 'Errors', Icon: AlertCircle },
];

function IntegrationsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as TabId) || 'connectors';

  const [connectors, setConnectors] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [reconciliations, setReconciliations] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          connectorsRes,
          jobsRes,
          runsRes,
          mappingsRes,
          issuesRes,
          reconciliationsRes,
          errorsRes,
        ] = await Promise.all([
          fetch('/api/collections/connectors'),
          fetch('/api/collections/syncJobs'),
          fetch('/api/collections/syncRuns'),
          fetch('/api/collections/mappings'),
          fetch('/api/collections/dataQualityIssues'),
          fetch('/api/collections/reconciliations'),
          fetch('/api/collections/errorLogs'),
        ]);

        const [
          connectorsData,
          jobsData,
          runsData,
          mappingsData,
          issuesData,
          reconciliationsData,
          errorsData,
        ] = await Promise.all([
          connectorsRes.json(),
          jobsRes.json(),
          runsRes.json(),
          mappingsRes.json(),
          issuesRes.json(),
          reconciliationsRes.json(),
          errorsRes.json(),
        ]);

        setConnectors(connectorsData);
        setJobs(jobsData);
        setRuns(runsData);
        setMappings(mappingsData);
        setIssues(issuesData);
        setReconciliations(reconciliationsData);
        setErrors(errorsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Build name maps
  const connectorNames = connectors.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {} as Record<string, string>);

  const jobNames = jobs.reduce((acc, j) => {
    acc[j.id] = j.name;
    return acc;
  }, {} as Record<string, string>);

  const handleTabChange = (tabId: TabId) => {
    router.push(`/m/integrations/list?tab=${tabId}`);
  };

  const handleConnectorClick = (connector: any) => {
    router.push(`/m/integrations/item/${connector.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/m/integrations"
          className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Интеграции</h1>
          <p className="text-stone-500">Управление коннекторами, jobs и качеством данных</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.Icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {currentTab === 'connectors' && (
          <IhConnectorsTable
            connectors={connectors}
            onRowClick={handleConnectorClick}
          />
        )}

        {currentTab === 'jobs' && (
          <IhJobsTable
            jobs={jobs}
            connectorNames={connectorNames}
            onRowClick={(job) => console.log('Job clicked:', job)}
          />
        )}

        {currentTab === 'runs' && (
          <IhRunsTable
            runs={runs}
            jobNames={jobNames}
            connectorNames={connectorNames}
            onRowClick={(run) => console.log('Run clicked:', run)}
          />
        )}

        {currentTab === 'mapping' && (
          <IhMappingPanel
            mappings={mappings}
            connectorNames={connectorNames}
            onRowClick={(mapping) => console.log('Mapping clicked:', mapping)}
          />
        )}

        {currentTab === 'quality' && (
          <IhQualityTable
            issues={issues}
            connectorNames={connectorNames}
            onRowClick={(issue) => console.log('Issue clicked:', issue)}
          />
        )}

        {currentTab === 'reconciliation' && (
          <IhReconciliationTable
            reconciliations={reconciliations}
            onRowClick={(rec) => console.log('Reconciliation clicked:', rec)}
          />
        )}

        {currentTab === 'errors' && (
          <IhErrorsConsole
            errors={errors}
            connectorNames={connectorNames}
          />
        )}
      </div>
    </div>
  );
}

export default function IntegrationsListPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <IntegrationsListContent />
    </Suspense>
  );
}
