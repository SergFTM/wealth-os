'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { DlStageKanban } from '@/modules/29-deals/ui/DlStageKanban';
import { DlPipelineTable } from '@/modules/29-deals/ui/DlPipelineTable';
import { DlTransactionsTable } from '@/modules/29-deals/ui/DlTransactionsTable';
import { DlCorporateActionsTable } from '@/modules/29-deals/ui/DlCorporateActionsTable';
import { DlCapitalEventsTable } from '@/modules/29-deals/ui/DlCapitalEventsTable';
import { DlApprovalsTable } from '@/modules/29-deals/ui/DlApprovalsTable';
import { DlDocumentsPanel } from '@/modules/29-deals/ui/DlDocumentsPanel';

type TabKey = 'pipeline' | 'transactions' | 'actions' | 'events' | 'approvals' | 'documents' | 'audit';

export default function DealsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'pipeline';

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const [deals, setDeals] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [corporateActions, setCorporateActions] = useState<any[]>([]);
  const [capitalEvents, setCapitalEvents] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dealsRes, stagesRes, txRes, actionsRes, eventsRes, approvalsRes, docsRes, auditRes] = await Promise.all([
        fetch('/api/collections/deals'),
        fetch('/api/collections/dealStages'),
        fetch('/api/collections/dealTransactions'),
        fetch('/api/collections/corporateActions'),
        fetch('/api/collections/capitalEvents'),
        fetch('/api/collections/dealApprovals'),
        fetch('/api/collections/dealDocuments'),
        fetch('/api/collections/auditEvents')
      ]);

      if (dealsRes.ok) setDeals(await dealsRes.json());
      if (stagesRes.ok) setStages(await stagesRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
      if (actionsRes.ok) setCorporateActions(await actionsRes.json());
      if (eventsRes.ok) setCapitalEvents(await eventsRes.json());
      if (approvalsRes.ok) setApprovals(await approvalsRes.json());
      if (docsRes.ok) setDocuments(await docsRes.json());
      if (auditRes.ok) {
        const allAudit = await auditRes.json();
        setAuditEvents(allAudit.filter((e: any) =>
          e.collection?.startsWith('deal') || e.collection === 'corporateActions' || e.collection === 'capitalEvents'
        ));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'pipeline', label: 'Pipeline', count: deals.filter(d => d.status === 'active').length },
    { key: 'transactions', label: 'Транзакции', count: transactions.length },
    { key: 'actions', label: 'Корп. действия', count: corporateActions.filter(a => a.status !== 'applied').length },
    { key: 'events', label: 'Капитальные события', count: capitalEvents.filter(e => e.status === 'open').length },
    { key: 'approvals', label: 'Согласования', count: approvals.filter(a => a.status === 'pending').length },
    { key: 'documents', label: 'Документы', count: documents.filter(d => d.status === 'missing').length },
    { key: 'audit', label: 'Аудит' }
  ];

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/deals/list?tab=${tab}`, { scroll: false });
  };

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    if (searchQuery && !deal.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && deal.status !== statusFilter) return false;
    if (stageFilter !== 'all' && deal.stageId !== stageFilter) return false;
    return true;
  });

  // Filter approvals for pending
  const filteredApprovals = approvals.filter(approval => {
    if (statusFilter !== 'all' && approval.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-full"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Список сделок</h1>
        <button
          onClick={() => router.push('/m/deals')}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Назад к дашборду
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t border-x border-slate-200 -mb-px'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {activeTab === 'pipeline' && (
          <>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Все стадии</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.nameRu || stage.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="on-hold">На паузе</option>
              <option value="closed">Закрытые</option>
            </select>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {activeTab === 'approvals' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидают</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
          </select>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'pipeline' && (
          viewMode === 'kanban' ? (
            <DlStageKanban deals={filteredDeals} stages={stages} />
          ) : (
            <DlPipelineTable deals={filteredDeals} />
          )
        )}

        {activeTab === 'transactions' && (
          <DlTransactionsTable
            transactions={transactions}
            deals={deals}
            onPostToGl={async (txId) => {
              // Placeholder for post to GL
              console.log('Post to GL:', txId);
            }}
          />
        )}

        {activeTab === 'actions' && (
          <DlCorporateActionsTable
            actions={corporateActions}
            onApply={async (actionId) => {
              // Placeholder for apply action
              console.log('Apply action:', actionId);
            }}
          />
        )}

        {activeTab === 'events' && (
          <DlCapitalEventsTable
            events={capitalEvents}
            onClose={async (eventId) => {
              // Placeholder for close event
              console.log('Close event:', eventId);
            }}
          />
        )}

        {activeTab === 'approvals' && (
          <DlApprovalsTable
            approvals={filteredApprovals}
            deals={deals}
            onApprove={async (approvalId) => {
              // Placeholder for approve
              console.log('Approve:', approvalId);
            }}
            onReject={async (approvalId) => {
              // Placeholder for reject
              console.log('Reject:', approvalId);
            }}
          />
        )}

        {activeTab === 'documents' && (
          <div className="max-w-2xl">
            <DlDocumentsPanel documents={documents} />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Время</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Действие</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Коллекция</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Пользователь</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Описание</th>
                </tr>
              </thead>
              <tbody>
                {auditEvents.slice(0, 50).map((event: any) => (
                  <tr key={event.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(event.ts).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{event.action}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{event.collection}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{event.actorName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{event.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
