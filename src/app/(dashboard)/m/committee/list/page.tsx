'use client';

/**
 * Committee List Page with Tabs
 * /m/committee/list
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { CmMeetingsTable } from '@/modules/28-committee/ui/CmMeetingsTable';
import { CmAgendaTable } from '@/modules/28-committee/ui/CmAgendaTable';
import { CmDecisionsTable } from '@/modules/28-committee/ui/CmDecisionsTable';
import { CmVotesPanel } from '@/modules/28-committee/ui/CmVotesPanel';
import { CmFollowUpsTable } from '@/modules/28-committee/ui/CmFollowUpsTable';
import { CmTemplatesTable } from '@/modules/28-committee/ui/CmTemplatesTable';
import { CommitteeMeeting } from '@/modules/28-committee/schema/committeeMeeting';
import { CommitteeAgendaItem } from '@/modules/28-committee/schema/committeeAgendaItem';
import { CommitteeDecision } from '@/modules/28-committee/schema/committeeDecision';
import { CommitteeVote } from '@/modules/28-committee/schema/committeeVote';
import { CommitteeFollowUp, isFollowUpOverdue } from '@/modules/28-committee/schema/committeeFollowUp';
import { CommitteeTemplate } from '@/modules/28-committee/schema/committeeTemplate';
import { committeeConfig } from '@/modules/28-committee/config';

type TabKey = 'meetings' | 'agenda' | 'decisions' | 'votes' | 'followups' | 'templates' | 'audit';

interface Tab {
  key: string;
  label: Record<string, string>;
}

export default function CommitteeListPage() {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const statusParam = searchParams.get('status');
  const filterParam = searchParams.get('filter');

  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || 'meetings');
  const [meetings, setMeetings] = useState<CommitteeMeeting[]>([]);
  const [agendaItems, setAgendaItems] = useState<CommitteeAgendaItem[]>([]);
  const [decisions, setDecisions] = useState<CommitteeDecision[]>([]);
  const [votes, setVotes] = useState<CommitteeVote[]>([]);
  const [followUps, setFollowUps] = useState<CommitteeFollowUp[]>([]);
  const [templates, setTemplates] = useState<CommitteeTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meetingsRes, agendaRes, decisionsRes, votesRes, followUpsRes, templatesRes] = await Promise.all([
        fetch('/api/collections/committeeMeetings'),
        fetch('/api/collections/committeeAgendaItems'),
        fetch('/api/collections/committeeDecisions'),
        fetch('/api/collections/committeeVotes'),
        fetch('/api/collections/committeeFollowUps'),
        fetch('/api/collections/committeeTemplates'),
      ]);

      const [meetingsData, agendaData, decisionsData, votesData, followUpsData, templatesData] = await Promise.all([
        meetingsRes.json(),
        agendaRes.json(),
        decisionsRes.json(),
        votesRes.json(),
        followUpsRes.json(),
        templatesRes.json(),
      ]);

      setMeetings(meetingsData.items ?? []);
      setAgendaItems(agendaData.items ?? []);
      setDecisions(decisionsData.items ?? []);
      setVotes(votesData.items ?? []);
      setFollowUps(followUpsData.items ?? []);
      setTemplates(templatesData.items ?? []);
    } catch (error) {
      console.error('Error fetching committee data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredMeetings = meetings.filter(m => {
    if (statusParam && m.status !== statusParam) return false;
    if (filterParam === 'next') {
      return m.status === 'scheduled' && new Date(m.scheduledAt) > new Date();
    }
    if (filterParam === 'minutes_unpublished') {
      return m.status === 'closed' && m.minutesStatus === 'draft';
    }
    if (filterParam === 'packs') {
      return !!m.linkedPackId;
    }
    return true;
  });

  const filteredAgenda = agendaItems.filter(i => {
    if (statusParam && i.status !== statusParam) return false;
    if (filterParam === 'missing_docs') {
      return i.materialsDocIds.length === 0;
    }
    return true;
  });

  const filteredDecisions = decisions.filter(d => {
    if (statusParam && d.status !== statusParam) return false;
    return true;
  });

  const filteredVotes = votes.filter(v => {
    if (statusParam && v.status !== statusParam) return false;
    return true;
  });

  const filteredFollowUps = followUps.filter(f => {
    if (statusParam && f.status !== statusParam) return false;
    if (filterParam === 'overdue') {
      return isFollowUpOverdue(f);
    }
    return true;
  });

  const tabs: Tab[] = committeeConfig.tabs || [];

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
      <Link href="/m/committee" className="text-sm text-blue-600 hover:text-blue-700">
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
        {activeTab === 'meetings' && (
          <CmMeetingsTable
            meetings={filteredMeetings}
            agendaItems={agendaItems}
            decisions={decisions}
            lang={lang}
          />
        )}

        {activeTab === 'agenda' && (
          <CmAgendaTable
            items={filteredAgenda}
            meetings={meetings}
            lang={lang}
          />
        )}

        {activeTab === 'decisions' && (
          <CmDecisionsTable
            decisions={filteredDecisions}
            meetings={meetings}
            lang={lang}
          />
        )}

        {activeTab === 'votes' && (
          <div className="p-6">
            <CmVotesPanel
              votes={filteredVotes}
              meetings={meetings}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'followups' && (
          <CmFollowUpsTable
            followUps={filteredFollowUps}
            decisions={decisions}
            lang={lang}
          />
        )}

        {activeTab === 'templates' && (
          <CmTemplatesTable
            templates={templates}
            lang={lang}
          />
        )}

        {activeTab === 'audit' && (
          <div className="p-6 text-center text-gray-500">
            {lang === 'ru' ? 'Аудит событий комитета' : 'Committee audit events'}
          </div>
        )}
      </div>
    </div>
  );
}
