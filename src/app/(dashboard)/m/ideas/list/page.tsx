'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ideasConfig } from '@/modules/38-ideas/config';
import { IdIdeasTable } from '@/modules/38-ideas/ui/IdIdeasTable';
import { IdWatchlistsTable } from '@/modules/38-ideas/ui/IdWatchlistsTable';
import { IdNotesTable } from '@/modules/38-ideas/ui/IdNotesTable';
import { IdMemosTable } from '@/modules/38-ideas/ui/IdMemosTable';
import { IdCommitteeLinksPanel } from '@/modules/38-ideas/ui/IdCommitteeLinksPanel';
import { IdOutcomesPanel } from '@/modules/38-ideas/ui/IdOutcomesPanel';

type Locale = 'ru' | 'en' | 'uk';
type TabKey = 'ideas' | 'watchlists' | 'notes' | 'memos' | 'committee' | 'outcomes' | 'audit';

export default function IdeasListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale] = useState<Locale>('ru');
  const [activeTab, setActiveTab] = useState<TabKey>((searchParams.get('tab') as TabKey) || 'ideas');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [memos, setMemos] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    assetClass: '',
    riskLevel: '',
    search: '',
  });

  const tabs = ideasConfig.tabs || [];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'ideas':
          const ideasRes = await fetch('/api/collections/ideas');
          if (ideasRes.ok) {
            const data = await ideasRes.json();
            setIdeas(data.items || []);
          }
          break;
        case 'watchlists':
          const wlRes = await fetch('/api/collections/watchlists');
          if (wlRes.ok) {
            const data = await wlRes.json();
            setWatchlists(data.items || []);
          }
          break;
        case 'notes':
          const notesRes = await fetch('/api/collections/researchNotes');
          if (notesRes.ok) {
            const data = await notesRes.json();
            setNotes(data.items || []);
          }
          break;
        case 'memos':
          const memosRes = await fetch('/api/collections/ideaMemos');
          if (memosRes.ok) {
            const data = await memosRes.json();
            setMemos(data.items || []);
          }
          break;
        case 'outcomes':
          const outRes = await fetch('/api/collections/ideaOutcomes');
          if (outRes.ok) {
            const data = await outRes.json();
            setOutcomes(data.items || []);
          }
          break;
        case 'audit':
          const auditRes = await fetch('/api/collections/auditEvents?collection=ideas');
          if (auditRes.ok) {
            const data = await auditRes.json();
            setAuditEvents(data.items || []);
          }
          break;
        case 'committee':
          // Load ideas with committee links
          const cmtRes = await fetch('/api/collections/ideas?status=in_committee');
          if (cmtRes.ok) {
            const data = await cmtRes.json();
            setIdeas(data.items || []);
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/ideas/list?tab=${tab}`);
  };

  const filteredIdeas = ideas.filter(idea => {
    if (filters.status && idea.status !== filters.status) return false;
    if (filters.assetClass && idea.assetClass !== filters.assetClass) return false;
    if (filters.riskLevel && idea.riskLevel !== filters.riskLevel) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!idea.title.toLowerCase().includes(search) &&
          !idea.ideaNumber.toLowerCase().includes(search)) {
        return false;
      }
    }
    return true;
  });

  const committeeLinks = ideas
    .filter(i => i.committeeAgendaItemId || i.status === 'in_committee')
    .map(i => ({
      ideaId: i.id,
      ideaNumber: i.ideaNumber,
      ideaTitle: i.title,
      agendaItemId: i.committeeAgendaItemId,
      decisionId: i.committeeDecisionId,
      decisionStatus: i.committeeDecisionId ? 'approved' : 'pending',
    }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/m/ideas')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ideasConfig.title[locale] || ideasConfig.title.ru}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as TabKey)}
              className={`
                px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.label[locale] || tab.label.ru}
            </button>
          ))}
        </div>
      </div>

      {/* Filters (for ideas tab) */}
      {activeTab === 'ideas' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder={locale === 'ru' ? 'Поиск...' : 'Search...'}
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{locale === 'ru' ? 'Все статусы' : 'All Statuses'}</option>
              <option value="draft">{locale === 'ru' ? 'Черновик' : 'Draft'}</option>
              <option value="active">{locale === 'ru' ? 'Активная' : 'Active'}</option>
              <option value="in_committee">{locale === 'ru' ? 'В комитете' : 'In Committee'}</option>
              <option value="approved">{locale === 'ru' ? 'Одобрена' : 'Approved'}</option>
              <option value="rejected">{locale === 'ru' ? 'Отклонена' : 'Rejected'}</option>
              <option value="archived">{locale === 'ru' ? 'Архив' : 'Archived'}</option>
            </select>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters(f => ({ ...f, riskLevel: e.target.value }))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{locale === 'ru' ? 'Все риски' : 'All Risk Levels'}</option>
              <option value="low">{locale === 'ru' ? 'Низкий' : 'Low'}</option>
              <option value="medium">{locale === 'ru' ? 'Средний' : 'Medium'}</option>
              <option value="high">{locale === 'ru' ? 'Высокий' : 'High'}</option>
              <option value="very_high">{locale === 'ru' ? 'Очень высокий' : 'Very High'}</option>
            </select>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            {locale === 'ru' ? 'Загрузка...' : 'Loading...'}
          </div>
        ) : (
          <>
            {activeTab === 'ideas' && (
              <IdIdeasTable
                ideas={filteredIdeas}
                locale={locale}
                onGenerateMemo={(id) => router.push(`/m/ideas/idea/${id}?action=memo`)}
                onLinkCommittee={(id) => router.push(`/m/ideas/idea/${id}?action=committee`)}
              />
            )}

            {activeTab === 'watchlists' && (
              <IdWatchlistsTable
                watchlists={watchlists}
                locale={locale}
              />
            )}

            {activeTab === 'notes' && (
              <IdNotesTable
                notes={notes}
                locale={locale}
                onSummarize={(id) => router.push(`/m/ideas/note/${id}?action=summarize`)}
              />
            )}

            {activeTab === 'memos' && (
              <IdMemosTable
                memos={memos}
                locale={locale}
              />
            )}

            {activeTab === 'committee' && (
              <div className="p-4">
                <IdCommitteeLinksPanel
                  links={committeeLinks}
                  locale={locale}
                  onCreateAgendaItem={(id) => console.log('Create agenda for', id)}
                  onAttachMemo={(id) => console.log('Attach memo to', id)}
                  onRequestVote={(id) => console.log('Request vote for', id)}
                />
              </div>
            )}

            {activeTab === 'outcomes' && (
              <div className="p-4">
                <IdOutcomesPanel
                  outcomes={outcomes}
                  locale={locale}
                  onAddOutcome={() => console.log('Add outcome')}
                  onEditOutcome={(id) => console.log('Edit outcome', id)}
                />
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        {locale === 'ru' ? 'Время' : 'Time'}
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        {locale === 'ru' ? 'Пользователь' : 'User'}
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        {locale === 'ru' ? 'Действие' : 'Action'}
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        {locale === 'ru' ? 'Описание' : 'Summary'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(event.ts).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {event.actorName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                            {event.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {event.summary}
                        </td>
                      </tr>
                    ))}
                    {auditEvents.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          {locale === 'ru' ? 'Нет событий' : 'No events'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
