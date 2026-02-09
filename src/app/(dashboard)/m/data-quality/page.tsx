'use client';

/**
 * Data Quality Dashboard Page
 * /m/data-quality
 */

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useApp } from '@/lib/store';
import { ModuleAiPanel } from '@/components/shell/ModuleAiPanel';
import { DqKpiStrip } from '@/modules/27-data-quality/ui/DqKpiStrip';
import { DqHealthDashboard } from '@/modules/27-data-quality/ui/DqHealthDashboard';
import { DqAIInsightsPanel } from '@/modules/27-data-quality/ui/DqAIInsightsPanel';
import { DqActionsBar } from '@/modules/27-data-quality/ui/DqActionsBar';
import { DqMetric, computeOverallScore } from '@/modules/27-data-quality/schema/dqMetric';
import { DqException } from '@/modules/27-data-quality/schema/dqException';
import { DqConflict } from '@/modules/27-data-quality/schema/dqConflict';
import { DqSyncJob } from '@/modules/27-data-quality/schema/dqSyncJob';
import { DqReconCheck } from '@/modules/27-data-quality/schema/dqReconCheck';
import { generateInsights, generateSummaryText, DqInsight } from '@/modules/27-data-quality/engine/dqNarratives';
import { computeAllDomainScores } from '@/modules/27-data-quality/engine/dqScoring';
import { dataQualityConfig, DqDomain } from '@/modules/27-data-quality/config';

export default function DataQualityDashboardPage() {
  const { lang } = useI18n();
  const { aiPanelOpen } = useApp();
  const [metrics, setMetrics] = useState<DqMetric[]>([]);
  const [exceptions, setExceptions] = useState<DqException[]>([]);
  const [conflicts, setConflicts] = useState<DqConflict[]>([]);
  const [syncJobs, setSyncJobs] = useState<DqSyncJob[]>([]);
  const [reconChecks, setReconChecks] = useState<DqReconCheck[]>([]);
  const [insights, setInsights] = useState<DqInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningChecks, setRunningChecks] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, exceptionsRes, conflictsRes, jobsRes, reconRes] = await Promise.all([
        fetch('/api/collections/dqMetrics'),
        fetch('/api/collections/dqExceptions'),
        fetch('/api/collections/dqConflicts'),
        fetch('/api/collections/dqSyncJobs'),
        fetch('/api/collections/dqReconChecks'),
      ]);

      const [metricsData, exceptionsData, conflictsData, jobsData, reconData] = await Promise.all([
        metricsRes.json(),
        exceptionsRes.json(),
        conflictsRes.json(),
        jobsRes.json(),
        reconRes.json(),
      ]);

      const metricsArr = metricsData.items ?? [];
      const exceptionsArr = exceptionsData.items ?? [];
      const conflictsArr = conflictsData.items ?? [];
      const jobsArr = jobsData.items ?? [];
      const reconArr = reconData.items ?? [];

      setMetrics(metricsArr);
      setExceptions(exceptionsArr);
      setConflicts(conflictsArr);
      setSyncJobs(jobsArr);
      setReconChecks(reconArr);

      // Generate insights
      const domainScores = computeAllDomainScores({
        exceptions: exceptionsArr,
        conflicts: conflictsArr,
        reconChecks: reconArr,
      });

      const generatedInsights = generateInsights({
        exceptions: exceptionsArr,
        conflicts: conflictsArr,
        reconChecks: reconArr,
        syncJobs: jobsArr,
        domainScores,
      });

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error fetching data quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunChecks = async () => {
    setRunningChecks(true);
    try {
      // Simulate running checks
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchData();
      alert(lang === 'ru' ? 'Проверки завершены' : 'Checks completed');
    } finally {
      setRunningChecks(false);
    }
  };

  const handleCreateRule = () => {
    alert(lang === 'ru' ? 'Создание правила (demo)' : 'Create rule (demo)');
  };

  const handleGenerateDemo = async () => {
    try {
      await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'data-quality' }),
      });
      await fetchData();
      alert(lang === 'ru' ? 'Demo данные сгенерированы' : 'Demo data generated');
    } catch (error) {
      alert(lang === 'ru' ? 'Ошибка генерации' : 'Generation error');
    }
  };

  const handleExportReport = () => {
    alert(lang === 'ru' ? 'Экспорт отчёта (placeholder)' : 'Export report (placeholder)');
  };

  const handleDomainClick = (domain: DqDomain) => {
    window.location.href = `/m/data-quality/list?tab=exceptions&domain=${domain}`;
  };

  // Calculate KPI values
  const openExceptions = exceptions.filter(e => e.status === 'open').length;
  const criticalExceptions = exceptions.filter(e => e.severity === 'critical' && e.status === 'open').length;
  const unresolvedConflicts = conflicts.filter(c => c.status === 'open').length;
  const failedJobs24h = syncJobs.filter(j => {
    if (j.status !== 'failed') return false;
    const lastRun = j.lastRunAt ? new Date(j.lastRunAt) : null;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);
    return lastRun && lastRun >= cutoff;
  }).length;
  const reconBreaks = reconChecks.filter(r => r.status === 'break').length;
  const staleRules = 3; // Placeholder
  const tasksFromDq = exceptions.filter(e => e.linkedTaskIds && e.linkedTaskIds.length > 0).length;
  const healthScore = computeOverallScore(metrics);
  const summaryText = generateSummaryText(insights, healthScore, lang);

  const labels = {
    title: { ru: 'Качество данных', en: 'Data Quality', uk: 'Якість даних' },
    disclaimer: dataQualityConfig.disclaimer || {
      ru: 'Проверки качества данных в MVP демонстрационные',
      en: 'Data quality checks in MVP are demonstrative',
      uk: 'Перевірки якості даних в MVP демонстраційні',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{labels.title[lang]}</h1>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            ⚠️ {labels.disclaimer[lang]}
          </p>
        </div>

        {/* Actions Bar */}
        <DqActionsBar
          onRunChecks={handleRunChecks}
          onCreateRule={handleCreateRule}
          onGenerateDemo={handleGenerateDemo}
          onExportReport={handleExportReport}
          loading={runningChecks}
          lang={lang}
        />

        {/* KPI Strip */}
        <DqKpiStrip
          healthScore={healthScore}
          openExceptions={openExceptions}
          criticalExceptions={criticalExceptions}
          unresolvedConflicts={unresolvedConflicts}
          failedJobs24h={failedJobs24h}
          reconBreaks={reconBreaks}
          staleRules={staleRules}
          tasksFromDq={tasksFromDq}
          lang={lang}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Dashboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {lang === 'ru' ? 'Здоровье по доменам' : 'Health by Domain'}
              </h2>
              <DqHealthDashboard
                metrics={metrics}
                lang={lang}
                onDomainClick={handleDomainClick}
              />
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-1">
            <DqAIInsightsPanel
              insights={insights}
              summaryText={summaryText}
              lang={lang}
              onInsightClick={(insight) => {
                if (insight.domain) {
                  window.location.href = `/m/data-quality/list?tab=exceptions&domain=${insight.domain}`;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Module AI Panel */}
      {aiPanelOpen && <ModuleAiPanel />}
    </div>
  );
}
