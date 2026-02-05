/**
 * Committee Vote Schema
 * Голосования комитета
 */

import { CmVoteStatus, CmVoteChoice, CM_VOTE_STATUS, CM_VOTE_CHOICE, CM_DEFAULT_QUORUM_PCT } from '../config';

// Re-export types for convenience
export type { CmVoteStatus, CmVoteChoice };

export interface VoteCast {
  userId: string;
  userName: string;
  choice: CmVoteChoice;
  comment?: string;
  castAt: string;
}

export interface VoteResults {
  total: number;
  for: number;
  against: number;
  abstain: number;
  quorumMet: boolean;
  passed: boolean;
}

export interface CommitteeVote {
  id: string;
  clientId?: string;
  meetingId: string;
  agendaItemId: string;
  title: string;
  description?: string;
  status: CmVoteStatus;
  quorumPct: number;
  requiredMajorityPct: number;
  eligibleVoterIds: string[];
  votes: VoteCast[];
  results?: VoteResults;
  openedAt: string;
  closedAt?: string;
  closedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeVoteCreateInput {
  clientId?: string;
  meetingId: string;
  agendaItemId: string;
  title: string;
  description?: string;
  quorumPct?: number;
  requiredMajorityPct?: number;
  eligibleVoterIds: string[];
}

export function getVoteStatusConfig(status: CmVoteStatus) {
  return CM_VOTE_STATUS[status];
}

export function getVoteChoiceConfig(choice: CmVoteChoice) {
  return CM_VOTE_CHOICE[choice];
}

export function calculateVoteResults(vote: CommitteeVote): VoteResults {
  const total = vote.votes.length;
  const forCount = vote.votes.filter(v => v.choice === 'for').length;
  const againstCount = vote.votes.filter(v => v.choice === 'against').length;
  const abstainCount = vote.votes.filter(v => v.choice === 'abstain').length;

  const eligibleCount = vote.eligibleVoterIds.length;
  const participationPct = eligibleCount > 0 ? (total / eligibleCount) * 100 : 0;
  const quorumMet = participationPct >= vote.quorumPct;

  const votingCount = forCount + againstCount;
  const forPct = votingCount > 0 ? (forCount / votingCount) * 100 : 0;
  const passed = quorumMet && forPct >= vote.requiredMajorityPct;

  return {
    total,
    for: forCount,
    against: againstCount,
    abstain: abstainCount,
    quorumMet,
    passed,
  };
}

export function canCastVote(vote: CommitteeVote, userId: string): boolean {
  if (vote.status !== 'open') return false;
  if (!vote.eligibleVoterIds.includes(userId)) return false;
  if (vote.votes.some(v => v.userId === userId)) return false;
  return true;
}

export function hasVoted(vote: CommitteeVote, userId: string): boolean {
  return vote.votes.some(v => v.userId === userId);
}

export function canCloseVote(vote: CommitteeVote): boolean {
  return vote.status === 'open';
}

export function getVoteParticipation(vote: CommitteeVote): number {
  if (vote.eligibleVoterIds.length === 0) return 0;
  return Math.round((vote.votes.length / vote.eligibleVoterIds.length) * 100);
}

export function formatVoteResults(results: VoteResults, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const labels = {
    ru: { for: 'За', against: 'Против', abstain: 'Воздержались', quorum: 'Кворум', passed: 'Принято', failed: 'Отклонено' },
    en: { for: 'For', against: 'Against', abstain: 'Abstain', quorum: 'Quorum', passed: 'Passed', failed: 'Failed' },
    uk: { for: 'За', against: 'Проти', abstain: 'Утрималися', quorum: 'Кворум', passed: 'Прийнято', failed: 'Відхилено' },
  };
  const l = labels[lang];
  const status = results.quorumMet
    ? (results.passed ? l.passed : l.failed)
    : `${l.quorum}: ❌`;
  return `${l.for}: ${results.for}, ${l.against}: ${results.against}, ${l.abstain}: ${results.abstain} — ${status}`;
}
