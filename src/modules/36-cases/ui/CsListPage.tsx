'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { useI18n, useTranslation } from '@/lib/i18n';
import { casesConfig } from '../config';
import { CsQueueTable, CaseRow } from './CsQueueTable';
import { CsMyCasesTable, MyCaseRow } from './CsMyCasesTable';
import { CsTemplatesTable, CaseTemplate } from './CsTemplatesTable';
import { CsSlaTable, SlaPolicy } from './CsSlaTable';
import { CsReportsPanel } from './CsReportsPanel';
import { CsActionsBar } from './CsActionsBar';

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

interface AuditEvent {
  id: string;
  collection: string;
  recordId: string;
  action: string;
  summary: string;
  actorName: string;
  ts: string;
  createdAt: string;
  updatedAt: string;
}

const CURRENT_USER_ID = 'user-001';

export function CsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'queue';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const { lang: locale } = useI18n();
  const t = useTranslation();
  const config = casesConfig;

  // Filters
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    priority: searchParams.get('priority') || '',
    status: searchParams.get('status') || '',
    source: searchParams.get('source') || '',
    search: searchParams.get('search') || '',
  });

  // Load data
  const { items: cases = [], loading: loadingCases } = useCollection<Case>('cases');
  const { items: templates = [] } = useCollection<CaseTemplate>('caseTemplates');
  const { items: slaPolicies = [] } = useCollection<SlaPolicy>('slaPolicies');
  const { items: auditEvents = [] } = useCollection<AuditEvent>('auditEvents');

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      if (filters.type && c.caseType !== filters.type) return false;
      if (filters.priority && c.priority !== filters.priority) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.source && c.sourceType !== filters.source) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!c.title.toLowerCase().includes(search) &&
            !c.caseNumber.toLowerCase().includes(search)) {
          return false;
        }
      }
      return true;
    });
  }, [cases, filters]);

  // Queue cases
  const queueCases: CaseRow[] = useMemo(() => {
    return filteredCases
      .filter(c => ['open', 'in_progress', 'awaiting_client'].includes(c.status))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const pA = priorityOrder[a.priority] ?? 2;
        const pB = priorityOrder[b.priority] ?? 2;
        if (pA !== pB) return pA - pB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [filteredCases]);

  // My cases
  const myCases: MyCaseRow[] = useMemo(() => {
    return filteredCases
      .filter(c => c.assignedToUserId === CURRENT_USER_ID)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const pA = priorityOrder[a.priority] ?? 2;
        const pB = priorityOrder[b.priority] ?? 2;
        if (pA !== pB) return pA - pB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [filteredCases]);

  // Case audit events
  const caseAuditEvents = useMemo(() => {
    return auditEvents
      .filter(e => e.collection === 'cases')
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, 100);
  }, [auditEvents]);

  const getTabCount = (tabKey: string): number | null => {
    switch (tabKey) {
      case 'queue':
        return queueCases.length;
      case 'my':
        return myCases.length;
      case 'templates':
        return templates.filter(t => t.isActive !== false).length;
      case 'sla':
        return slaPolicies.length;
      default:
        return null;
    }
  };

  const handleCreateCase = () => {
    // Would open create case modal
    router.push('/m/cases/list?action=create');
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/m/cases/list?action=create&template=${templateId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'queue':
        return (
          <CsQueueTable
            cases={queueCases}
            selectedIds={selectedCases}
            onSelectionChange={setSelectedCases}
            locale={locale}
          />
        );
      case 'my':
        return (
          <div className="p-4">
            <CsMyCasesTable
              cases={myCases}
              locale={locale}
              onOpenCase={(id) => router.push(`/m/cases/case/${id}`)}
            />
          </div>
        );
      case 'templates':
        return (
          <div className="p-4">
            <CsTemplatesTable
              templates={templates as CaseTemplate[]}
              locale={locale}
              onUseTemplate={handleUseTemplate}
            />
          </div>
        );
      case 'sla':
        return (
          <CsSlaTable
            policies={slaPolicies as SlaPolicy[]}
            locale={locale}
          />
        );
      case 'reports':
        return (
          <div className="p-4">
            <CsReportsPanel cases={filteredCases} locale={locale} />
          </div>
        );
      case 'audit':
        return (
          <div className="p-4">
            <div className="space-y-2">
              {caseAuditEvents.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  {t('noAuditEvents', { ru: 'Нет событий аудита', en: 'No audit events', uk: 'Немає подій аудиту' })}
                </div>
              ) : (
                caseAuditEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">{event.summary}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {event.actorName} · {new Date(event.ts).toLocaleString(locale)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      {(activeTab === 'queue' || activeTab === 'my') && (
        <CsActionsBar
          selectedCount={selectedCases.length}
          onCreateCase={handleCreateCase}
        />
      )}

      {/* Filters (for queue and my) */}
      {(activeTab === 'queue' || activeTab === 'my') && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('allTypes', { ru: 'Все типы', en: 'All Types', uk: 'Всі типи' })}</option>
              <option value="request">{t('request', { ru: 'Запрос', en: 'Request', uk: 'Запит' })}</option>
              <option value="incident">{t('incident', { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' })}</option>
              <option value="change">{t('change', { ru: 'Изменение', en: 'Change', uk: 'Зміна' })}</option>
              <option value="problem">{t('problem', { ru: 'Проблема', en: 'Problem', uk: 'Проблема' })}</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('allPriorities', { ru: 'Все приоритеты', en: 'All Priorities', uk: 'Всі пріоритети' })}</option>
              <option value="critical">{t('critical', { ru: 'Критичный', en: 'Critical', uk: 'Критичний' })}</option>
              <option value="high">{t('high', { ru: 'Высокий', en: 'High', uk: 'Високий' })}</option>
              <option value="medium">{t('medium', { ru: 'Средний', en: 'Medium', uk: 'Середній' })}</option>
              <option value="low">{t('low', { ru: 'Низкий', en: 'Low', uk: 'Низький' })}</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('allStatuses', { ru: 'Все статусы', en: 'All Statuses', uk: 'Всі статуси' })}</option>
              <option value="open">{t('open', { ru: 'Открыт', en: 'Open', uk: 'Відкритий' })}</option>
              <option value="in_progress">{t('inProgress', { ru: 'В работе', en: 'In Progress', uk: 'В роботі' })}</option>
              <option value="awaiting_client">{t('awaitingClient', { ru: 'Ожидает клиента', en: 'Awaiting Client', uk: 'Очікує клієнта' })}</option>
              <option value="resolved">{t('resolved', { ru: 'Решен', en: 'Resolved', uk: 'Вирішено' })}</option>
              <option value="closed">{t('closed', { ru: 'Закрыт', en: 'Closed', uk: 'Закритий' })}</option>
            </select>

            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={t('search', { ru: 'Поиск по номеру или названию...', en: 'Search by number or title...', uk: 'Пошук за номером або назвою...' })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {(filters.type || filters.priority || filters.status || filters.search) && (
              <button
                onClick={() => setFilters({ type: '', priority: '', status: '', source: '', search: '' })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {t('clearFilters', { ru: 'Сбросить', en: 'Clear', uk: 'Скинути' })}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {(config.tabs || []).map((tab) => {
            const count = getTabCount(tab.key);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedCases([]);
                }}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative
                  ${isActive
                    ? 'text-emerald-600 border-b-2 border-emerald-500 -mb-px'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.label[locale as keyof typeof tab.label] || tab.label.ru}
                {count !== null && count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loadingCases ? (
          <div className="p-8 text-center text-gray-500">
            {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}
