'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ideasConfig } from '@/modules/38-ideas/config';
import { IdKpiStrip } from '@/modules/38-ideas/ui/IdKpiStrip';
import { IdActionsBar } from '@/modules/38-ideas/ui/IdActionsBar';
import { IdIdeasTable } from '@/modules/38-ideas/ui/IdIdeasTable';
import { IdWatchlistsTable } from '@/modules/38-ideas/ui/IdWatchlistsTable';
import { IdAiPanel } from '@/modules/38-ideas/ui/IdAiPanel';

type Locale = 'ru' | 'en' | 'uk';

interface Idea {
  id: string;
  ideaNumber: string;
  title: string;
  assetClass: string;
  horizonKey: string;
  thesisText: string;
  catalystsJson?: Array<{ description: string; timing?: string }>;
  risksJson?: Array<{ description: string; severity?: string }>;
  status: string;
  riskLevel: string;
  ownerUserId: string;
  updatedAt: string;
}

interface Watchlist {
  id: string;
  name: string;
  listType: string;
  ownerUserId: string;
  isShared?: boolean;
  alertsEnabled?: boolean;
  itemsCount?: number;
  createdAt: string;
}

export default function IdeasDashboardPage() {
  const router = useRouter();
  const [locale] = useState<Locale>('ru');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'idea' | 'watchlist' | 'note' | 'memo'>('idea');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ideasRes, watchlistsRes] = await Promise.all([
        fetch('/api/collections/ideas'),
        fetch('/api/collections/watchlists'),
      ]);

      if (ideasRes.ok) {
        const data = await ideasRes.json();
        setIdeas(data.items || []);
      }

      if (watchlistsRes.ok) {
        const data = await watchlistsRes.json();
        setWatchlists(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = (id: string) => {
    setSelectedIdeaIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id].slice(-2)
    );
  };

  // Calculate KPI data
  const kpiData = {
    ideasActive: ideas.filter(i => i.status === 'active').length,
    ideasPendingCommittee: ideas.filter(i => i.status === 'in_committee').length,
    watchlistsCount: watchlists.length,
    notesLast30d: 0, // Would need to fetch notes
    memosGenerated30d: 0, // Would need to fetch memos
    highRiskIdeas: ideas.filter(i => i.riskLevel === 'high' || i.riskLevel === 'very_high').length,
    outcomesTracked: 0, // Would need to fetch outcomes
    missingSources: ideas.filter(i => !i.catalystsJson?.length).length,
  };

  const openCreateModal = (type: 'idea' | 'watchlist' | 'note' | 'memo') => {
    setCreateType(type);
    setShowCreateModal(true);
  };

  const title = ideasConfig.title[locale] || ideasConfig.title.ru;
  const disclaimer = ideasConfig.disclaimer?.[locale] || ideasConfig.disclaimer?.ru;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {ideasConfig.description?.[locale] || ideasConfig.description?.ru}
          </p>
        </div>
        <button
          onClick={() => router.push('/m/ideas/list')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {locale === 'ru' ? 'Все записи' : 'View All'} →
        </button>
      </div>

      {/* Disclaimer Banner */}
      {disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-800">{disclaimer}</p>
          </div>
        </div>
      )}

      {/* KPI Strip */}
      <IdKpiStrip data={kpiData} locale={locale} />

      {/* Actions Bar */}
      <IdActionsBar
        locale={locale}
        onCreateIdea={() => openCreateModal('idea')}
        onCreateWatchlist={() => openCreateModal('watchlist')}
        onAddNote={() => openCreateModal('note')}
        onGenerateMemo={() => openCreateModal('memo')}
        onGenerateDemo={fetchData}
        onOpenAudit={() => router.push('/m/ideas/list?tab=audit')}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ideas Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              {locale === 'ru' ? 'Последние идеи' : 'Recent Ideas'}
            </h2>
            <button
              onClick={() => router.push('/m/ideas/list?tab=ideas')}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {locale === 'ru' ? 'Все' : 'All'} →
            </button>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              {locale === 'ru' ? 'Загрузка...' : 'Loading...'}
            </div>
          ) : (
            <IdIdeasTable
              ideas={ideas.slice(0, 5)}
              locale={locale}
              compact
              onGenerateMemo={(id) => router.push(`/m/ideas/idea/${id}?action=memo`)}
              onLinkCommittee={(id) => router.push(`/m/ideas/idea/${id}?action=committee`)}
            />
          )}
        </div>

        {/* AI Panel */}
        <div className="lg:col-span-1">
          <IdAiPanel
            ideas={ideas}
            selectedIds={selectedIdeaIds}
            onSelectIdea={handleSelectIdea}
            locale={locale}
          />
        </div>
      </div>

      {/* Watchlists Mini */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Watchlists</h2>
          <button
            onClick={() => router.push('/m/ideas/list?tab=watchlists')}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            {locale === 'ru' ? 'Все' : 'All'} →
          </button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            {locale === 'ru' ? 'Загрузка...' : 'Loading...'}
          </div>
        ) : (
          <IdWatchlistsTable
            watchlists={watchlists.slice(0, 4)}
            locale={locale}
            compact
          />
        )}
      </div>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {createType === 'idea' && (locale === 'ru' ? 'Создать идею' : 'Create Idea')}
              {createType === 'watchlist' && (locale === 'ru' ? 'Создать watchlist' : 'Create Watchlist')}
              {createType === 'note' && (locale === 'ru' ? 'Добавить заметку' : 'Add Note')}
              {createType === 'memo' && (locale === 'ru' ? 'Сгенерировать мемо' : 'Generate Memo')}
            </h2>
            <p className="text-gray-600 mb-4">
              {locale === 'ru' ? 'Форма создания будет здесь.' : 'Creation form will be here.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {locale === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  if (createType === 'idea') router.push('/m/ideas/list?tab=ideas&action=create');
                  if (createType === 'watchlist') router.push('/m/ideas/list?tab=watchlists&action=create');
                  if (createType === 'note') router.push('/m/ideas/list?tab=notes&action=create');
                  if (createType === 'memo') router.push('/m/ideas/list?tab=memos&action=create');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {locale === 'ru' ? 'Продолжить' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
