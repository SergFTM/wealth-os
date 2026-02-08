"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GvStatusPill } from './GvStatusPill';
import { GvVotePill, GvVoteTallyBar } from './GvVotePill';
import { GvQuorumBadge } from './GvQuorumBadge';
import { cn } from '@/lib/utils';

interface Alternative {
  title: string;
  description: string;
}

interface Decision {
  id: string;
  title: string;
  proposalText: string;
  alternativesJson?: Alternative[];
  riskNotes?: string;
  status: 'draft' | 'pending_vote' | 'approved' | 'rejected' | 'deferred';
  outcomeNotes?: string;
  categoryKey?: string;
  impactLevel?: string;
  meetingId?: string;
  meetingName?: string;
  agendaItemId?: string;
  voteId?: string;
  createdAt?: string;
}

interface Vote {
  id: string;
  status: 'open' | 'closed' | 'cancelled';
  quorumPct: number;
  eligibleVotersJson: Array<{ userId: string; name: string; weight: number }>;
  votesCastJson: Array<{ userId: string; vote: string; castAt: string }>;
  tallyJson: {
    yes: number;
    no: number;
    abstain: number;
    notVoted: number;
    quorumReached: boolean;
    passed: boolean;
  };
  closesAt: string;
}

interface GvDecisionDetailProps {
  decision: Decision;
  vote?: Vote;
  currentUserId?: string;
  onOpenVote?: () => void;
  onCastVote?: (choice: 'yes' | 'no' | 'abstain') => void;
  onCloseVote?: () => void;
  onCreateActionItem?: () => void;
  onOpenAudit?: () => void;
}

const categoryLabels: Record<string, string> = {
  investment: 'Инвестиции',
  distribution: 'Распределение',
  spending: 'Расходы',
  governance: 'Governance',
  trust: 'Trust',
  family: 'Семья',
  philanthropy: 'Филантропия',
  succession: 'Преемственность',
  other: 'Другое',
};

const impactLabels: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'bg-stone-100 text-stone-600' },
  medium: { label: 'Средний', color: 'bg-amber-100 text-amber-700' },
  high: { label: 'Высокий', color: 'bg-orange-100 text-orange-700' },
  critical: { label: 'Критический', color: 'bg-rose-100 text-rose-700' },
};

export function GvDecisionDetail({
  decision,
  vote,
  currentUserId,
  onOpenVote,
  onCastVote,
  onCloseVote,
  onCreateActionItem,
  onOpenAudit,
}: GvDecisionDetailProps) {
  const [activeTab, setActiveTab] = useState<'proposal' | 'voting' | 'outcome'>('proposal');

  const canUserVote = () => {
    if (!vote || !currentUserId) return false;
    if (vote.status !== 'open') return false;
    const isEligible = vote.eligibleVotersJson.some(v => v.userId === currentUserId);
    const hasVoted = vote.votesCastJson.some(v => v.userId === currentUserId);
    return isEligible && !hasVoted;
  };

  const getUserVote = () => {
    if (!vote || !currentUserId) return null;
    const cast = vote.votesCastJson.find(v => v.userId === currentUserId);
    return cast?.vote as 'yes' | 'no' | 'abstain' | null;
  };

  const totalWeight = (voters: Array<{ weight: number }>) =>
    voters.reduce((sum, v) => sum + v.weight, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/m/governance/list?tab=decisions">
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-stone-800">{decision.title}</h1>
            <GvStatusPill status={decision.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            {decision.categoryKey && (
              <span>{categoryLabels[decision.categoryKey]}</span>
            )}
            {decision.impactLevel && (
              <>
                <span>|</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  impactLabels[decision.impactLevel]?.color
                )}>
                  {impactLabels[decision.impactLevel]?.label}
                </span>
              </>
            )}
            {decision.meetingName && (
              <>
                <span>|</span>
                <span>{decision.meetingName}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {decision.status === 'draft' && onOpenVote && (
            <Button variant="primary" onClick={onOpenVote}>
              Открыть голосование
            </Button>
          )}
          {decision.status === 'approved' && onCreateActionItem && (
            <Button variant="secondary" onClick={onCreateActionItem}>
              Создать action item
            </Button>
          )}
          {onOpenAudit && (
            <Button variant="ghost" onClick={onOpenAudit}>
              Audit
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-4">
          {(['proposal', 'voting', 'outcome'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              {tab === 'proposal' && 'Предложение'}
              {tab === 'voting' && 'Голосование'}
              {tab === 'outcome' && 'Результат'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'proposal' && (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
                <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                  Текст предложения
                </h3>
                <p className="text-stone-700 whitespace-pre-wrap">{decision.proposalText}</p>
              </div>

              {decision.alternativesJson && decision.alternativesJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                    Альтернативы
                  </h3>
                  <div className="space-y-3">
                    {decision.alternativesJson.map((alt, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 rounded-lg">
                        <p className="font-medium text-stone-800">{alt.title}</p>
                        <p className="text-sm text-stone-600 mt-1">{alt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {decision.riskNotes && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-3">
                    Заметки о рисках
                  </h3>
                  <p className="text-amber-800">{decision.riskNotes}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'voting' && (
            <>
              {vote ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide">
                        Голосование
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {vote.votesCastJson.length} из {vote.eligibleVotersJson.length} проголосовали
                      </p>
                    </div>
                    <GvStatusPill status={vote.status} />
                  </div>

                  <GvVoteTallyBar
                    yes={vote.tallyJson.yes}
                    no={vote.tallyJson.no}
                    abstain={vote.tallyJson.abstain}
                    notVoted={vote.tallyJson.notVoted}
                  />

                  {vote.status === 'open' && canUserVote() && onCastVote && (
                    <div className="pt-4 border-t border-stone-200">
                      <p className="text-sm text-stone-600 mb-3">Ваш голос:</p>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => onCastVote('yes')}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        >
                          За
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => onCastVote('no')}
                          className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700"
                        >
                          Против
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onCastVote('abstain')}
                          className="flex-1"
                        >
                          Воздержаться
                        </Button>
                      </div>
                    </div>
                  )}

                  {getUserVote() && (
                    <div className="pt-4 border-t border-stone-200 flex items-center gap-2">
                      <span className="text-sm text-stone-500">Вы проголосовали:</span>
                      <GvVotePill vote={getUserVote()!} />
                    </div>
                  )}

                  {vote.status === 'closed' && (
                    <div className={cn(
                      "p-4 rounded-lg",
                      vote.tallyJson.passed ? "bg-emerald-50" : "bg-rose-50"
                    )}>
                      <p className={cn(
                        "font-medium",
                        vote.tallyJson.passed ? "text-emerald-700" : "text-rose-700"
                      )}>
                        {vote.tallyJson.passed ? 'Решение принято' : 'Решение отклонено'}
                      </p>
                      <p className="text-sm text-stone-600 mt-1">
                        Кворум: {vote.tallyJson.quorumReached ? 'достигнут' : 'не достигнут'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
                  <p className="text-stone-500">Голосование не открыто</p>
                  {decision.status === 'draft' && onOpenVote && (
                    <Button variant="primary" onClick={onOpenVote} className="mt-4">
                      Открыть голосование
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'outcome' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Результат
              </h3>
              {decision.outcomeNotes ? (
                <p className="text-stone-700 whitespace-pre-wrap">{decision.outcomeNotes}</p>
              ) : (
                <p className="text-stone-500">Результат не записан</p>
              )}

              {decision.status === 'approved' && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  {onCreateActionItem && (
                    <Button variant="secondary" onClick={onCreateActionItem}>
                      Создать action item
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {vote && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Кворум
              </h3>
              <GvQuorumBadge
                participationPct={
                  totalWeight(vote.eligibleVotersJson) > 0
                    ? ((vote.tallyJson.yes + vote.tallyJson.no + vote.tallyJson.abstain) /
                       totalWeight(vote.eligibleVotersJson)) * 100
                    : 0
                }
                requiredPct={vote.quorumPct}
                quorumReached={vote.tallyJson.quorumReached}
                showProgress
              />
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
              Метаданные
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">ID</span>
                <span className="text-stone-800 font-mono">{decision.id.slice(-8)}</span>
              </div>
              {decision.createdAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Создано</span>
                  <span className="text-stone-800">
                    {new Date(decision.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
