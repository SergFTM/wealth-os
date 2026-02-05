'use client';

/**
 * Committee Agenda Item Detail Page
 * /m/committee/item/[id]
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { CmAgendaItemDetail } from '@/modules/28-committee/ui/CmAgendaItemDetail';
import { CommitteeMeeting } from '@/modules/28-committee/schema/committeeMeeting';
import { CommitteeAgendaItem } from '@/modules/28-committee/schema/committeeAgendaItem';
import { CommitteeDecision } from '@/modules/28-committee/schema/committeeDecision';
import { CommitteeVote } from '@/modules/28-committee/schema/committeeVote';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommitteeAgendaItemDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang } = useI18n();
  const [item, setItem] = useState<CommitteeAgendaItem | null>(null);
  const [meeting, setMeeting] = useState<CommitteeMeeting | null>(null);
  const [linkedDecision, setLinkedDecision] = useState<CommitteeDecision | undefined>();
  const [linkedVote, setLinkedVote] = useState<CommitteeVote | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const itemRes = await fetch(`/api/collections/committeeAgendaItems/${id}`);
      if (!itemRes.ok) {
        throw new Error('Agenda item not found');
      }
      const itemData = await itemRes.json();
      const agendaItem = itemData.data as CommitteeAgendaItem;
      setItem(agendaItem);

      // Fetch meeting
      const meetingRes = await fetch(`/api/collections/committeeMeetings/${agendaItem.meetingId}`);
      if (meetingRes.ok) {
        const meetingData = await meetingRes.json();
        setMeeting(meetingData.data);
      }

      // Fetch linked decision if exists
      if (agendaItem.linkedDecisionId) {
        const decisionRes = await fetch(`/api/collections/committeeDecisions/${agendaItem.linkedDecisionId}`);
        if (decisionRes.ok) {
          const decisionData = await decisionRes.json();
          setLinkedDecision(decisionData.data);
        }
      }

      // Fetch linked vote if exists
      if (agendaItem.linkedVoteId) {
        const voteRes = await fetch(`/api/collections/committeeVotes/${agendaItem.linkedVoteId}`);
        if (voteRes.ok) {
          const voteData = await voteRes.json();
          setLinkedVote(voteData.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading agenda item');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachMaterials = () => {
    console.log('Attach materials to agenda item');
  };

  const handleSendToVote = () => {
    console.log('Send agenda item to vote');
  };

  const labels = {
    back: { ru: '← Назад к списку', en: '← Back to List', uk: '← Назад до списку' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Пункт не найден', en: 'Item not found', uk: 'Пункт не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !item || !meeting) {
    return (
      <div className="space-y-4">
        <Link href="/m/committee/list?tab=agenda" className="text-sm text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
        <div className="text-center py-8 text-red-500">{error || labels.notFound[lang]}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/committee/list?tab=agenda" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <CmAgendaItemDetail
        item={item}
        meeting={meeting}
        linkedDecision={linkedDecision}
        linkedVote={linkedVote}
        onAttachMaterials={handleAttachMaterials}
        onSendToVote={handleSendToVote}
        lang={lang}
      />
    </div>
  );
}
