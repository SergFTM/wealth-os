'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { useI18n, useTranslation } from '@/lib/i18n';
import { casesConfig } from '../config';
import { CsKpiStrip } from './CsKpiStrip';
import { CsQueueTable, CaseRow } from './CsQueueTable';
import { CsMyCasesTable, MyCaseRow } from './CsMyCasesTable';
import { CsActionsBar } from './CsActionsBar';
import { CsDisclaimerBanner } from './CsDisclaimerBanner';

interface Case {
  id: string;
  clientId: string;
  caseNumber: string;
  title: string;
  caseType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed';
  sourceType: string;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  reporterName?: string | null;
  clientVisible?: boolean;
  dueAt?: string | null;
  slaBreached?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CaseTemplate {
  id: string;
  name: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

const CURRENT_USER_ID = 'user-001'; // Mock current user

export function CsDashboardPage() {
  const router = useRouter();
  const { lang: locale } = useI18n();
  const t = useTranslation();

  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  // Load data
  const { items: cases = [], loading: loadingCases } = useCollection<Case>('cases');
  const { items: templates = [] } = useCollection<CaseTemplate>('caseTemplates');

  // Calculate KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const openStatuses = ['open', 'in_progress', 'awaiting_client'];

    const openInQueue = cases.filter(c => openStatuses.includes(c.status)).length;
    const myOpenCases = cases.filter(c =>
      c.assignedToUserId === CURRENT_USER_ID && openStatuses.includes(c.status)
    ).length;
    const breachedSla = cases.filter(c => c.slaBreached && openStatuses.includes(c.status)).length;
    const dueSoon24h = cases.filter(c => {
      if (!c.dueAt || !openStatuses.includes(c.status)) return false;
      const due = new Date(c.dueAt);
      return due > now && due <= oneDayFromNow;
    }).length;
    const incidents7d = cases.filter(c =>
      c.caseType === 'incident' && new Date(c.createdAt) >= sevenDaysAgo
    ).length;
    const changesPending = cases.filter(c =>
      c.caseType === 'change' && c.status !== 'resolved' && c.status !== 'closed'
    ).length;
    const clientCasesOpen = cases.filter(c =>
      c.clientVisible && openStatuses.includes(c.status)
    ).length;
    const caseTemplates = templates.filter(t => t.isActive !== false).length;

    return {
      openInQueue,
      myOpenCases,
      breachedSla,
      dueSoon24h,
      incidents7d,
      changesPending,
      clientCasesOpen,
      caseTemplates,
    };
  }, [cases, templates]);

  // Queue cases (limited to 10 for preview)
  const queueCases: CaseRow[] = useMemo(() => {
    return cases
      .filter(c => ['open', 'in_progress', 'awaiting_client'].includes(c.status))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const pA = priorityOrder[a.priority] ?? 2;
        const pB = priorityOrder[b.priority] ?? 2;
        if (pA !== pB) return pA - pB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .slice(0, 10);
  }, [cases]);

  // My cases
  const myCases: MyCaseRow[] = useMemo(() => {
    return cases
      .filter(c =>
        c.assignedToUserId === CURRENT_USER_ID &&
        ['open', 'in_progress', 'awaiting_client'].includes(c.status)
      )
      .slice(0, 5);
  }, [cases]);

  const handleCreateCase = () => {
    router.push('/m/cases/list?action=create');
  };

  const handleQuickTriage = () => {
    router.push('/m/cases/list?tab=queue&action=triage');
  };

  const handleGenerateDemo = async () => {
    // Would generate demo cases via API
    alert(t('demoGenerated', { ru: 'Demo кейсы сгенерированы', en: 'Demo cases generated', uk: 'Demo кейси згенеровано' }));
  };

  const handleSlaReport = () => {
    router.push('/m/cases/list?tab=reports');
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <CsDisclaimerBanner />

      {/* KPI Strip */}
      <CsKpiStrip kpis={kpis} locale={locale} />

      {/* Actions Bar */}
      <CsActionsBar
        selectedCount={selectedCases.length}
        onCreateCase={handleCreateCase}
        onQuickTriage={handleQuickTriage}
        onGenerateDemo={handleGenerateDemo}
        onSlaReport={handleSlaReport}
      />

      {/* Queue Preview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('queue', { ru: 'Очередь кейсов', en: 'Case Queue', uk: 'Черга кейсів' })}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {t('queueDescription', {
                ru: `${kpis.openInQueue} открытых кейсов`,
                en: `${kpis.openInQueue} open cases`,
                uk: `${kpis.openInQueue} відкритих кейсів`
              })}
            </p>
          </div>
          <a
            href="/m/cases/list?tab=queue"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {t('viewAll', { ru: 'Все кейсы', en: 'View All', uk: 'Всі кейси' })}
          </a>
        </div>

        {loadingCases ? (
          <div className="p-8 text-center text-gray-500">
            {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
          </div>
        ) : (
          <CsQueueTable
            cases={queueCases}
            selectedIds={selectedCases}
            onSelectionChange={setSelectedCases}
            locale={locale}
          />
        )}
      </div>

      {/* My Cases Preview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('myCases', { ru: 'Мои кейсы', en: 'My Cases', uk: 'Мої кейси' })}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {t('myCasesDescription', {
                ru: `${kpis.myOpenCases} назначено мне`,
                en: `${kpis.myOpenCases} assigned to me`,
                uk: `${kpis.myOpenCases} призначено мені`
              })}
            </p>
          </div>
          <a
            href="/m/cases/list?tab=my"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {t('viewAll', { ru: 'Все мои', en: 'View All', uk: 'Всі мої' })}
          </a>
        </div>

        {loadingCases ? (
          <div className="p-8 text-center text-gray-500">
            {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
          </div>
        ) : (
          <div className="p-4">
            <CsMyCasesTable
              cases={myCases}
              locale={locale}
              onOpenCase={(id) => router.push(`/m/cases/case/${id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
