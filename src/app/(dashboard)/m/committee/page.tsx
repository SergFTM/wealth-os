'use client';

/**
 * Committee Dashboard Page
 * /m/committee
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useApp } from '@/lib/store';
import { ModuleAiPanel } from '@/components/shell/ModuleAiPanel';
import { CmKpiStrip } from '@/modules/28-committee/ui/CmKpiStrip';
import { CmMeetingsTable } from '@/modules/28-committee/ui/CmMeetingsTable';
import { CmDecisionsTable } from '@/modules/28-committee/ui/CmDecisionsTable';
import { CmActionsBar } from '@/modules/28-committee/ui/CmActionsBar';
import { CommitteeMeeting } from '@/modules/28-committee/schema/committeeMeeting';
import { CommitteeAgendaItem } from '@/modules/28-committee/schema/committeeAgendaItem';
import { CommitteeDecision } from '@/modules/28-committee/schema/committeeDecision';
import { CommitteeVote } from '@/modules/28-committee/schema/committeeVote';
import { CommitteeFollowUp } from '@/modules/28-committee/schema/committeeFollowUp';
import { committeeConfig } from '@/modules/28-committee/config';

export default function CommitteeDashboardPage() {
  const { lang } = useI18n();
  const { aiPanelOpen } = useApp();
  const [meetings, setMeetings] = useState<CommitteeMeeting[]>([]);
  const [agendaItems, setAgendaItems] = useState<CommitteeAgendaItem[]>([]);
  const [decisions, setDecisions] = useState<CommitteeDecision[]>([]);
  const [votes, setVotes] = useState<CommitteeVote[]>([]);
  const [followUps, setFollowUps] = useState<CommitteeFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meetingsRes, agendaRes, decisionsRes, votesRes, followUpsRes] = await Promise.all([
        fetch('/api/collections/committeeMeetings'),
        fetch('/api/collections/committeeAgendaItems'),
        fetch('/api/collections/committeeDecisions'),
        fetch('/api/collections/committeeVotes'),
        fetch('/api/collections/committeeFollowUps'),
      ]);

      const [meetingsData, agendaData, decisionsData, votesData, followUpsData] = await Promise.all([
        meetingsRes.json(),
        agendaRes.json(),
        decisionsRes.json(),
        votesRes.json(),
        followUpsRes.json(),
      ]);

      setMeetings(meetingsData.items ?? []);
      setAgendaItems(agendaData.items ?? []);
      setDecisions(decisionsData.items ?? []);
      setVotes(votesData.items ?? []);
      setFollowUps(followUpsData.items ?? []);
    } catch (error) {
      console.error('Error fetching committee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = () => {
    console.log('Create meeting');
  };

  const handleAddAgendaItem = () => {
    console.log('Add agenda item');
  };

  const handleRecordDecision = () => {
    console.log('Record decision');
  };

  const handleOpenVote = () => {
    console.log('Open vote');
  };

  const handlePublishMinutes = () => {
    console.log('Publish minutes');
  };

  const handleGenerateDemo = async () => {
    console.log('Generate demo meeting');
  };

  const labels = {
    title: { ru: 'Инвестиционный комитет', en: 'Investment Committee', uk: 'Інвестиційний комітет' },
    disclaimer: committeeConfig.disclaimer || {
      ru: 'Решения комитета фиксируются для отчетности. Не является индивидуальной инвестиционной рекомендацией',
      en: 'Committee decisions are recorded for reporting purposes. Not individual investment advice',
      uk: 'Рішення комітету фіксуються для звітності. Не є індивідуальною інвестиційною рекомендацією',
    },
    recentMeetings: { ru: 'Последние заседания', en: 'Recent Meetings', uk: 'Останні засідання' },
    recentDecisions: { ru: 'Последние решения', en: 'Recent Decisions', uk: 'Останні рішення' },
    viewAll: { ru: 'Все →', en: 'View All →', uk: 'Всі →' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  // Sort meetings by date descending
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  // Sort decisions by date descending
  const sortedDecisions = [...decisions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
      <CmActionsBar
        onCreateMeeting={handleCreateMeeting}
        onAddAgendaItem={handleAddAgendaItem}
        onRecordDecision={handleRecordDecision}
        onOpenVote={handleOpenVote}
        onPublishMinutes={handlePublishMinutes}
        onGenerateDemo={handleGenerateDemo}
        lang={lang}
      />

      {/* KPI Strip */}
      <CmKpiStrip
        meetings={meetings}
        agendaItems={agendaItems}
        decisions={decisions}
        votes={votes}
        followUps={followUps}
        lang={lang}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meetings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{labels.recentMeetings[lang]}</h2>
            <Link
              href="/m/committee/list?tab=meetings"
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {labels.viewAll[lang]}
            </Link>
          </div>
          <CmMeetingsTable
            meetings={sortedMeetings}
            agendaItems={agendaItems}
            decisions={decisions}
            mini
            limit={6}
            lang={lang}
          />
        </div>

        {/* Recent Decisions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{labels.recentDecisions[lang]}</h2>
            <Link
              href="/m/committee/list?tab=decisions"
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {labels.viewAll[lang]}
            </Link>
          </div>
          <CmDecisionsTable
            decisions={sortedDecisions}
            meetings={meetings}
            mini
            limit={6}
            lang={lang}
          />
        </div>
      </div>
      </div>

      {/* AI Panel */}
      {aiPanelOpen && <ModuleAiPanel />}
    </div>
  );
}
