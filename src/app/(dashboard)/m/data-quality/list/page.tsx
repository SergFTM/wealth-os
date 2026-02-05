'use client';

/**
 * Data Quality List Page with Tabs
 * /m/data-quality/list
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqRulesTable } from '@/modules/27-data-quality/ui/DqRulesTable';
import { DqExceptionsTable } from '@/modules/27-data-quality/ui/DqExceptionsTable';
import { DqConflictsTable } from '@/modules/27-data-quality/ui/DqConflictsTable';
import { DqSyncJobsTable } from '@/modules/27-data-quality/ui/DqSyncJobsTable';
import { DqReconTable } from '@/modules/27-data-quality/ui/DqReconTable';
import { DqHealthDashboard } from '@/modules/27-data-quality/ui/DqHealthDashboard';
import { DqRule } from '@/modules/27-data-quality/schema/dqRule';
import { DqException } from '@/modules/27-data-quality/schema/dqException';
import { DqConflict } from '@/modules/27-data-quality/schema/dqConflict';
import { DqSyncJob } from '@/modules/27-data-quality/schema/dqSyncJob';
import { DqReconCheck } from '@/modules/27-data-quality/schema/dqReconCheck';
import { DqMetric } from '@/modules/27-data-quality/schema/dqMetric';
import { dataQualityConfig, DqDomain, DqSeverity } from '@/modules/27-data-quality/config';

type TabKey = 'health' | 'rules' | 'exceptions' | 'conflicts' | 'jobs' | 'recon' | 'audit';

interface Tab {
  key: string;
  label: { ru: string; en: string; uk: string };
}

export default function DataQualityListPage() {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const domainParam = searchParams.get('domain') as DqDomain | null;
  const severityParam = searchParams.get('severity') as DqSeverity | null;
  const statusParam = searchParams.get('status');

  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || 'health');
  const [rules, setRules] = useState<DqRule[]>([]);
  const [exceptions, setExceptions] = useState<DqException[]>([]);
  const [conflicts, setConflicts] = useState<DqConflict[]>([]);
  const [syncJobs, setSyncJobs] = useState<DqSyncJob[]>([]);
  const [reconChecks, setReconChecks] = useState<DqReconCheck[]>([]);
  const [metrics, setMetrics] = useState<DqMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesRes, exceptionsRes, conflictsRes, jobsRes, reconRes, metricsRes] = await Promise.all([
        fetch('/api/collections/dqRules'),
        fetch('/api/collections/dqExceptions'),
        fetch('/api/collections/dqConflicts'),
        fetch('/api/collections/dqSyncJobs'),
        fetch('/api/collections/dqReconChecks'),
        fetch('/api/collections/dqMetrics'),
      ]);

      const [rulesData, exceptionsData, conflictsData, jobsData, reconData, metricsData] = await Promise.all([
        rulesRes.json(),
        exceptionsRes.json(),
        conflictsRes.json(),
        jobsRes.json(),
        reconRes.json(),
        metricsRes.json(),
      ]);

      setRules(rulesData.data || []);
      setExceptions(exceptionsData.data || []);
      setConflicts(conflictsData.data || []);
      setSyncJobs(jobsData.data || []);
      setReconChecks(reconData.data || []);
      setMetrics(metricsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on params
  const filteredExceptions = exceptions.filter(e => {
    if (domainParam && e.domain !== domainParam) return false;
    if (severityParam && e.severity !== severityParam) return false;
    if (statusParam && e.status !== statusParam) return false;
    return true;
  });

  const filteredConflicts = conflicts.filter(c => {
    if (statusParam && c.status !== statusParam) return false;
    return true;
  });

  const filteredJobs = syncJobs.filter(j => {
    if (statusParam && j.status !== statusParam) return false;
    return true;
  });

  const filteredRecon = reconChecks.filter(r => {
    if (statusParam && r.status !== statusParam) return false;
    return true;
  });

  const tabs: Tab[] = dataQualityConfig.tabs || [];

  const labels = {
    back: { ru: '← Назад к дашборду', en: '← Back to Dashboard', uk: '← Назад до дашборду' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link href="/m/data-quality" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {activeTab === 'health' && (
          <div className="p-6">
            <DqHealthDashboard
              metrics={metrics}
              lang={lang}
              onDomainClick={(domain) => {
                setActiveTab('exceptions');
                window.history.pushState({}, '', `/m/data-quality/list?tab=exceptions&domain=${domain}`);
              }}
            />
          </div>
        )}

        {activeTab === 'rules' && (
          <DqRulesTable
            rules={rules}
            lang={lang}
            onRun={(ruleId) => alert(`Run rule ${ruleId}`)}
            onToggle={(ruleId, active) => alert(`Toggle rule ${ruleId} to ${active}`)}
          />
        )}

        {activeTab === 'exceptions' && (
          <DqExceptionsTable
            exceptions={filteredExceptions}
            lang={lang}
            onCreateTask={(excId) => alert(`Create task for ${excId}`)}
            onResolve={(excId) => alert(`Resolve ${excId}`)}
          />
        )}

        {activeTab === 'conflicts' && (
          <DqConflictsTable
            conflicts={filteredConflicts}
            lang={lang}
            onMerge={(conflictId) => alert(`Merge ${conflictId}`)}
            onResolve={(conflictId) => alert(`Resolve ${conflictId}`)}
          />
        )}

        {activeTab === 'jobs' && (
          <DqSyncJobsTable
            jobs={filteredJobs}
            lang={lang}
            onRetry={(jobId) => alert(`Retry ${jobId}`)}
            onCreateIncident={(jobId) => alert(`Create incident for ${jobId}`)}
          />
        )}

        {activeTab === 'recon' && (
          <DqReconTable
            checks={filteredRecon}
            lang={lang}
            onCreateException={(checkId) => alert(`Create exception for ${checkId}`)}
            onExport={(checkId) => alert(`Export ${checkId}`)}
          />
        )}

        {activeTab === 'audit' && (
          <div className="p-8 text-center text-gray-500">
            {lang === 'ru' ? 'История аудита появится здесь' : 'Audit history will appear here'}
          </div>
        )}
      </div>
    </div>
  );
}
