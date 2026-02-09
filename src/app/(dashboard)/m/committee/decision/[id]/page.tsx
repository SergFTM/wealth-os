'use client';

/**
 * Committee Decision Detail Page
 * /m/committee/decision/[id]
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { CmDecisionDetail } from '@/modules/28-committee/ui/CmDecisionDetail';
import { CommitteeMeeting } from '@/modules/28-committee/schema/committeeMeeting';
import { CommitteeDecision } from '@/modules/28-committee/schema/committeeDecision';
import { CommitteeVote } from '@/modules/28-committee/schema/committeeVote';
import { CommitteeFollowUp } from '@/modules/28-committee/schema/committeeFollowUp';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommitteeDecisionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang } = useI18n();
  const [decision, setDecision] = useState<CommitteeDecision | null>(null);
  const [meeting, setMeeting] = useState<CommitteeMeeting | null>(null);
  const [linkedVote, setLinkedVote] = useState<CommitteeVote | undefined>();
  const [followUps, setFollowUps] = useState<CommitteeFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const decisionRes = await fetch(`/api/collections/committeeDecisions/${id}`);
      if (!decisionRes.ok) {
        throw new Error('Decision not found');
      }
      const dec = await decisionRes.json() as CommitteeDecision;
      setDecision(dec);

      // Fetch meeting
      const meetingRes = await fetch(`/api/collections/committeeMeetings/${dec.meetingId}`);
      if (meetingRes.ok) {
        setMeeting(await meetingRes.json());
      }

      // Fetch linked vote if exists
      if (dec.voteId) {
        const voteRes = await fetch(`/api/collections/committeeVotes/${dec.voteId}`);
        if (voteRes.ok) {
          setLinkedVote(await voteRes.json());
        }
      }

      // Fetch follow-ups
      const followUpsRes = await fetch('/api/collections/committeeFollowUps');
      if (followUpsRes.ok) {
        const followUpsData = await followUpsRes.json();
        setFollowUps(followUpsData.items ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading decision');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!decision) return;
    console.log('Create task for decision:', decision.id);
  };

  const handleMarkDone = async () => {
    if (!decision) return;
    try {
      await fetch(`/api/collections/committeeDecisions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      });
      fetchData();
    } catch (err) {
      console.error('Error marking decision as done:', err);
    }
  };

  const labels = {
    back: { ru: '← Назад к списку', en: '← Back to List', uk: '← Назад до списку' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Решение не найдено', en: 'Decision not found', uk: 'Рішення не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !decision || !meeting) {
    return (
      <div className="space-y-4">
        <Link href="/m/committee/list?tab=decisions" className="text-sm text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
        <div className="text-center py-8 text-red-500">{error || labels.notFound[lang]}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/committee/list?tab=decisions" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <CmDecisionDetail
        decision={decision}
        meeting={meeting}
        linkedVote={linkedVote}
        followUps={followUps}
        onCreateTask={handleCreateTask}
        onMarkDone={handleMarkDone}
        lang={lang}
      />
    </div>
  );
}
