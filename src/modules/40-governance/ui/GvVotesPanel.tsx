"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GvStatusPill } from './GvStatusPill';
import { GvVotePill, GvVoteTallyBar } from './GvVotePill';
import { GvQuorumBadge } from './GvQuorumBadge';

interface EligibleVoter {
  userId: string;
  name: string;
  weight: number;
}

interface VoteCast {
  userId: string;
  vote: 'yes' | 'no' | 'abstain';
  castAt: string;
  comment?: string;
}

interface Vote {
  id: string;
  decisionId: string;
  decisionTitle?: string;
  status: 'open' | 'closed' | 'cancelled';
  opensAt: string;
  closesAt: string;
  quorumPct: number;
  eligibleVotersJson: EligibleVoter[];
  votesCastJson: VoteCast[];
  tallyJson: {
    yes: number;
    no: number;
    abstain: number;
    notVoted: number;
    quorumReached: boolean;
    passed: boolean;
  };
}

interface GvVotesPanelProps {
  votes: Vote[];
  currentUserId?: string;
  onCastVote?: (voteId: string, choice: 'yes' | 'no' | 'abstain') => void;
  onCloseVote?: (voteId: string) => void;
  onVoteClick?: (vote: Vote) => void;
}

export function GvVotesPanel({
  votes,
  currentUserId,
  onCastVote,
  onCloseVote,
  onVoteClick,
}: GvVotesPanelProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const openVotes = votes.filter(v => v.status === 'open');
  const closedVotes = votes.filter(v => v.status !== 'open');

  const canUserVote = (vote: Vote) => {
    if (!currentUserId) return false;
    if (vote.status !== 'open') return false;

    const isEligible = vote.eligibleVotersJson.some(v => v.userId === currentUserId);
    const hasVoted = vote.votesCastJson.some(v => v.userId === currentUserId);

    return isEligible && !hasVoted;
  };

  const getUserVote = (vote: Vote): 'yes' | 'no' | 'abstain' | null => {
    if (!currentUserId) return null;
    const cast = vote.votesCastJson.find(v => v.userId === currentUserId);
    return cast?.vote || null;
  };

  const getRemainingTime = (closesAt: string) => {
    const diff = new Date(closesAt).getTime() - Date.now();
    if (diff <= 0) return 'Истекло';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}д ${hours % 24}ч`;
    }
    return `${hours}ч ${minutes}м`;
  };

  const totalWeight = (voters: EligibleVoter[]) =>
    voters.reduce((sum, v) => sum + v.weight, 0);

  return (
    <div className="space-y-6">
      {openVotes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide">
            Открытые голосования ({openVotes.length})
          </h3>

          {openVotes.map((vote) => {
            const total = totalWeight(vote.eligibleVotersJson);
            const participationPct = total > 0
              ? ((vote.tallyJson.yes + vote.tallyJson.no + vote.tallyJson.abstain) / total) * 100
              : 0;

            return (
              <div
                key={vote.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 cursor-pointer" onClick={() => onVoteClick?.(vote)}>
                    <h4 className="font-medium text-stone-800 hover:text-emerald-700">
                      {vote.decisionTitle || `Голосование #${vote.id.slice(-4)}`}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                      <span>Осталось: {getRemainingTime(vote.closesAt)}</span>
                      <span>|</span>
                      <span>Голосов: {vote.votesCastJson.length} / {vote.eligibleVotersJson.length}</span>
                    </div>
                  </div>
                  <GvQuorumBadge
                    participationPct={participationPct}
                    requiredPct={vote.quorumPct}
                    quorumReached={vote.tallyJson.quorumReached}
                    size="sm"
                  />
                </div>

                <GvVoteTallyBar
                  yes={vote.tallyJson.yes}
                  no={vote.tallyJson.no}
                  abstain={vote.tallyJson.abstain}
                  notVoted={vote.tallyJson.notVoted}
                  showLabels={true}
                />

                {canUserVote(vote) && onCastVote && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                    <span className="text-sm text-stone-600 mr-2">Ваш голос:</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onCastVote(vote.id, 'yes')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                    >
                      За
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onCastVote(vote.id, 'no')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700"
                    >
                      Против
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCastVote(vote.id, 'abstain')}
                    >
                      Воздержаться
                    </Button>
                  </div>
                )}

                {getUserVote(vote) && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                    <span className="text-sm text-stone-500">Вы проголосовали:</span>
                    <GvVotePill vote={getUserVote(vote)!} size="sm" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {closedVotes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide">
            Завершенные голосования ({closedVotes.length})
          </h3>

          {closedVotes.slice(0, 5).map((vote) => (
            <div
              key={vote.id}
              className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 cursor-pointer hover:bg-white/80 transition-colors"
              onClick={() => onVoteClick?.(vote)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-stone-700">
                    {vote.decisionTitle || `Голосование #${vote.id.slice(-4)}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <GvStatusPill status={vote.status} size="sm" />
                    {vote.tallyJson.passed ? (
                      <span className="text-xs text-emerald-600 font-medium">Принято</span>
                    ) : (
                      <span className="text-xs text-rose-600 font-medium">Отклонено</span>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <div>{vote.tallyJson.yes} за / {vote.tallyJson.no} против</div>
                  <div>Кворум: {vote.tallyJson.quorumReached ? 'Да' : 'Нет'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {votes.length === 0 && (
        <div className="text-center py-8 text-stone-500">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Нет голосований</p>
        </div>
      )}
    </div>
  );
}
