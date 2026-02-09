'use client';

/**
 * Committee Meeting Detail Page
 * /m/committee/meeting/[id]
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { CmMeetingDetail } from '@/modules/28-committee/ui/CmMeetingDetail';
import { CommitteeMeeting } from '@/modules/28-committee/schema/committeeMeeting';
import { CommitteeAgendaItem } from '@/modules/28-committee/schema/committeeAgendaItem';
import { CommitteeDecision } from '@/modules/28-committee/schema/committeeDecision';
import { CommitteeVote } from '@/modules/28-committee/schema/committeeVote';
import { CommitteeFollowUp } from '@/modules/28-committee/schema/committeeFollowUp';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommitteeMeetingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang } = useI18n();
  const [meeting, setMeeting] = useState<CommitteeMeeting | null>(null);
  const [agendaItems, setAgendaItems] = useState<CommitteeAgendaItem[]>([]);
  const [decisions, setDecisions] = useState<CommitteeDecision[]>([]);
  const [votes, setVotes] = useState<CommitteeVote[]>([]);
  const [followUps, setFollowUps] = useState<CommitteeFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const meetingRes = await fetch(`/api/collections/committeeMeetings/${id}`);
      if (!meetingRes.ok) {
        throw new Error('Meeting not found');
      }
      setMeeting(await meetingRes.json());

      const [agendaRes, decisionsRes, votesRes, followUpsRes] = await Promise.all([
        fetch('/api/collections/committeeAgendaItems'),
        fetch('/api/collections/committeeDecisions'),
        fetch('/api/collections/committeeVotes'),
        fetch('/api/collections/committeeFollowUps'),
      ]);

      const [agendaData, decisionsData, votesData, followUpsData] = await Promise.all([
        agendaRes.json(),
        decisionsRes.json(),
        votesRes.json(),
        followUpsRes.json(),
      ]);

      setAgendaItems(agendaData.items ?? []);
      setDecisions(decisionsData.items ?? []);
      setVotes(votesData.items ?? []);
      setFollowUps(followUpsData.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMeeting = async () => {
    if (!meeting) return;
    try {
      await fetch(`/api/collections/committeeMeetings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      fetchData();
    } catch (err) {
      console.error('Error starting meeting:', err);
    }
  };

  const handleCloseMeeting = async () => {
    if (!meeting) return;
    try {
      await fetch(`/api/collections/committeeMeetings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed', endedAt: new Date().toISOString() }),
      });
      fetchData();
    } catch (err) {
      console.error('Error closing meeting:', err);
    }
  };

  const handlePublishMinutes = async (clientSafe: boolean) => {
    if (!meeting) return;
    try {
      await fetch(`/api/collections/committeeMeetings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minutesStatus: 'published',
          minutesPublishedAt: new Date().toISOString(),
          minutesClientSafe: clientSafe,
        }),
      });
      fetchData();
    } catch (err) {
      console.error('Error publishing minutes:', err);
    }
  };

  const labels = {
    back: { ru: '← Назад к списку', en: '← Back to List', uk: '← Назад до списку' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Заседание не найдено', en: 'Meeting not found', uk: 'Засідання не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="space-y-4">
        <Link href="/m/committee/list?tab=meetings" className="text-sm text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
        <div className="text-center py-8 text-red-500">{error || labels.notFound[lang]}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/committee/list?tab=meetings" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <CmMeetingDetail
        meeting={meeting}
        agendaItems={agendaItems}
        decisions={decisions}
        votes={votes}
        followUps={followUps}
        onStartMeeting={handleStartMeeting}
        onCloseMeeting={handleCloseMeeting}
        onPublishMinutes={handlePublishMinutes}
        lang={lang}
      />
    </div>
  );
}
