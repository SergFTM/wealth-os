'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { useCollection } from '@/lib/hooks';
import { ExKpiStrip } from '@/modules/48-exceptions/ui/ExKpiStrip';
import { ExActionsBar } from '@/modules/48-exceptions/ui/ExActionsBar';
import { ExQueueTable } from '@/modules/48-exceptions/ui/ExQueueTable';
import { ExClusterTable } from '@/modules/48-exceptions/ui/ExClusterTable';
import { ExAiPanel } from '@/modules/48-exceptions/ui/ExAiPanel';
import { Exception } from '@/modules/48-exceptions/engine/exceptionRouter';

export default function ExceptionsDashboardPage() {
  const router = useRouter();
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null);

  const { data: exceptions = [], isLoading: loadingExceptions, refetch: refetchExceptions } = useCollection<Exception>('exceptions');
  const { data: clusters = [], isLoading: loadingClusters } = useCollection<any>('exceptionClusters');
  const { data: rules = [], isLoading: loadingRules } = useCollection<any>('exceptionRules');

  const kpiData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const openExceptions = exceptions.filter(e => e.status !== 'closed');
    const criticalToday = openExceptions.filter(e =>
      e.severity === 'critical' && new Date(e.createdAt) >= today
    );
    const slaAtRisk = openExceptions.filter(e => e.slaAtRisk);
    const overdueAssigned = openExceptions.filter(e => {
      if (!e.slaDueAt) return false;
      return new Date(e.slaDueAt) < now && e.assignedToRole;
    });
    const autoClosed7d = exceptions.filter(e =>
      e.status === 'closed' &&
      e.closedAt &&
      new Date(e.closedAt) >= sevenDaysAgo
    );

    // Find top source module
    const sourceCount = new Map<string, number>();
    for (const e of openExceptions) {
      sourceCount.set(e.sourceModuleKey, (sourceCount.get(e.sourceModuleKey) || 0) + 1);
    }
    let topSource = '—';
    let maxCount = 0;
    for (const [key, count] of sourceCount) {
      if (count > maxCount) {
        maxCount = count;
        topSource = key;
      }
    }

    const moduleLabels: Record<string, string> = {
      '14': 'Интеграции',
      '2': 'GL',
      '39': 'Ликвидность',
      '42': 'Сделки',
      '5': 'Документы',
      '16': 'Цены',
      '43': 'Вендоры'
    };

    return {
      openExceptions: openExceptions.length,
      criticalToday: criticalToday.length,
      slaAtRisk: slaAtRisk.length,
      overdueAssigned: overdueAssigned.length,
      autoClosed7d: autoClosed7d.length,
      topModuleSource: moduleLabels[topSource] || topSource,
      activeClusters: clusters.filter((c: any) => c.status === 'active').length,
      enabledRules: rules.filter((r: any) => r.enabled).length
    };
  }, [exceptions, clusters, rules]);

  const selectedException = useMemo(() => {
    if (!selectedExceptionId) return null;
    return exceptions.find(e => e.id === selectedExceptionId) || null;
  }, [exceptions, selectedExceptionId]);

  const recentExceptions = useMemo(() => {
    return exceptions
      .filter(e => e.status !== 'closed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [exceptions]);

  const activeClusters = useMemo(() => {
    return clusters
      .filter((c: any) => c.status === 'active')
      .slice(0, 5);
  }, [clusters]);

  const handleExceptionClick = (item: any) => {
    setSelectedExceptionId(item.id);
    router.push(`/m/exceptions/exception/${item.id}`);
  };

  const handleClusterClick = (item: any) => {
    router.push(`/m/exceptions/cluster/${item.id}`);
  };

  const handleCreateException = () => {
    // Could open a modal or navigate to create form
    router.push('/m/exceptions/list?action=create');
  };

  const handleRunClustering = () => {
    // Run clustering logic
    router.push('/m/exceptions/list?tab=clusters&action=run');
  };

  const handleCreateRule = () => {
    router.push('/m/exceptions/list?tab=rules&action=create');
  };

  const handleApplyAutoRules = () => {
    router.push('/m/exceptions/list?tab=rules&action=apply');
  };

  const handleGenerateDemo = async () => {
    // Generate demo data - this would typically call an API
    refetchExceptions();
  };

  const handleOpenAudit = () => {
    router.push('/m/exceptions/list?tab=audit');
  };

  const isLoading = loadingExceptions || loadingClusters || loadingRules;

  return (
    <ModuleDashboard moduleSlug="exceptions" title="Центр исключений">
      <div className="space-y-6">
        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-600 text-xl">⚠️</span>
          <div>
            <p className="text-sm text-amber-800 font-medium">
              Центр исключений предназначен для операционной команды.
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Решения требуют проверки человеком.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <ExKpiStrip {...kpiData} />

        {/* Actions Bar */}
        <ExActionsBar
          onCreateException={handleCreateException}
          onRunClustering={handleRunClustering}
          onCreateRule={handleCreateRule}
          onApplyAutoRules={handleApplyAutoRules}
          onGenerateDemo={handleGenerateDemo}
          onOpenAudit={handleOpenAudit}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">Очередь исключений</h2>
              <button
                onClick={() => router.push('/m/exceptions/list?tab=queue')}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Показать все →
              </button>
            </div>
            <ExQueueTable
              data={recentExceptions}
              onRowClick={handleExceptionClick}
              isLoading={loadingExceptions}
              emptyMessage="Нет открытых исключений"
            />
          </div>

          {/* AI Panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-900">AI-ассистент</h2>
            <ExAiPanel
              exception={selectedException}
              onApplyStep={(step) => console.log('Apply step:', step)}
            />
          </div>
        </div>

        {/* Clusters Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Активные кластеры</h2>
            <button
              onClick={() => router.push('/m/exceptions/list?tab=clusters')}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Показать все →
            </button>
          </div>
          <ExClusterTable
            data={activeClusters}
            onRowClick={handleClusterClick}
            isLoading={loadingClusters}
            emptyMessage="Нет активных кластеров"
          />
        </div>
      </div>
    </ModuleDashboard>
  );
}
