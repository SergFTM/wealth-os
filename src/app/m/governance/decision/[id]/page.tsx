"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { GvDecisionDetail } from '@/modules/40-governance/ui/GvDecisionDetail';
import { useApp } from '@/lib/store';

export default function DecisionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useApp();
  const decisionId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: decision, isLoading, error } = useRecord('gvDecisions', decisionId) as { data: any; isLoading: boolean; error: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: votes = [] } = useCollection('gvVotes') as { data: any[] };
  const { mutate: updateDecision } = useMutateRecord('gvDecisions', decisionId);

  // Find the vote associated with this decision
  const vote = votes.find((v) => v.decisionId === decisionId);

  const handleOpenVote = async () => {
    // Create a new vote for this decision
    const newVoteId = `vote_${Date.now()}`;
    await updateDecision({
      status: 'pending_vote',
      voteId: newVoteId
    });
    // In real app, would also create the vote record
  };

  const handleCastVote = async (choice: 'yes' | 'no' | 'abstain') => {
    if (!vote || !user) return;
    // In real app, would update the vote record
    console.log('Cast vote:', choice, 'by user:', user.name);
  };

  const handleCloseVote = async () => {
    if (!vote) return;
    // In real app, would close the vote and update decision status
  };

  const handleCreateActionItem = () => {
    router.push(`/m/governance/list?tab=actions&action=create&decisionId=${decisionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center py-12 text-stone-500">
          Решение не найдено
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 p-6">
      <GvDecisionDetail
        decision={decision}
        vote={vote}
        currentUserId={user?.name}
        onOpenVote={decision.status === 'draft' ? handleOpenVote : undefined}
        onCastVote={handleCastVote}
        onCloseVote={handleCloseVote}
        onCreateActionItem={decision.status === 'approved' ? handleCreateActionItem : undefined}
      />
    </div>
  );
}
