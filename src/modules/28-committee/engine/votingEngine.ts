/**
 * Voting Engine
 * Управление голосованиями комитета
 */

import { CommitteeVote, VoteCast, VoteResults, calculateVoteResults, CmVoteChoice } from '../schema/committeeVote';
import { CommitteeMeeting, CommitteeAttendee, getPresentAttendees } from '../schema/committeeMeeting';
import { CM_DEFAULT_QUORUM_PCT } from '../config';

export interface VoteCreationInput {
  meetingId: string;
  agendaItemId: string;
  title: string;
  description?: string;
  meeting: CommitteeMeeting;
  customQuorumPct?: number;
  customMajorityPct?: number;
}

export interface CastVoteInput {
  vote: CommitteeVote;
  userId: string;
  userName: string;
  choice: CmVoteChoice;
  comment?: string;
}

export interface CloseVoteResult {
  vote: CommitteeVote;
  results: VoteResults;
  passed: boolean;
  quorumMet: boolean;
}

export function createVote(input: VoteCreationInput): Omit<CommitteeVote, 'id' | 'createdAt' | 'updatedAt'> {
  const { meetingId, agendaItemId, title, description, meeting, customQuorumPct, customMajorityPct } = input;

  // Get eligible voters from present attendees with voting rights
  const eligibleAttendees = getPresentAttendees(meeting.attendees)
    .filter(a => ['chair', 'cio', 'member'].includes(a.role));

  return {
    clientId: meeting.clientId,
    meetingId,
    agendaItemId,
    title,
    description,
    status: 'open',
    quorumPct: customQuorumPct ?? CM_DEFAULT_QUORUM_PCT,
    requiredMajorityPct: customMajorityPct ?? 50.01, // Simple majority
    eligibleVoterIds: eligibleAttendees.map(a => a.userId),
    votes: [],
    openedAt: new Date().toISOString(),
  };
}

export function castVote(input: CastVoteInput): CommitteeVote {
  const { vote, userId, userName, choice, comment } = input;

  if (vote.status !== 'open') {
    throw new Error('Vote is not open');
  }

  if (!vote.eligibleVoterIds.includes(userId)) {
    throw new Error('User is not eligible to vote');
  }

  if (vote.votes.some(v => v.userId === userId)) {
    throw new Error('User has already voted');
  }

  const newVoteCast: VoteCast = {
    userId,
    userName,
    choice,
    comment,
    castAt: new Date().toISOString(),
  };

  return {
    ...vote,
    votes: [...vote.votes, newVoteCast],
    updatedAt: new Date().toISOString(),
  };
}

export function closeVote(vote: CommitteeVote, closedByUserId: string): CloseVoteResult {
  if (vote.status !== 'open') {
    throw new Error('Vote is already closed');
  }

  const results = calculateVoteResults(vote);

  const closedVote: CommitteeVote = {
    ...vote,
    status: 'closed',
    results,
    closedAt: new Date().toISOString(),
    closedByUserId,
    updatedAt: new Date().toISOString(),
  };

  return {
    vote: closedVote,
    results,
    passed: results.passed,
    quorumMet: results.quorumMet,
  };
}

export function getVoteBreakdown(vote: CommitteeVote): {
  forVotes: VoteCast[];
  againstVotes: VoteCast[];
  abstainVotes: VoteCast[];
  notVoted: string[];
} {
  const forVotes = vote.votes.filter(v => v.choice === 'for');
  const againstVotes = vote.votes.filter(v => v.choice === 'against');
  const abstainVotes = vote.votes.filter(v => v.choice === 'abstain');

  const votedUserIds = vote.votes.map(v => v.userId);
  const notVoted = vote.eligibleVoterIds.filter(id => !votedUserIds.includes(id));

  return {
    forVotes,
    againstVotes,
    abstainVotes,
    notVoted,
  };
}

export function formatVoteBreakdownText(
  vote: CommitteeVote,
  lang: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const breakdown = getVoteBreakdown(vote);
  const results = vote.results || calculateVoteResults(vote);

  const labels = {
    ru: {
      for: 'За',
      against: 'Против',
      abstain: 'Воздержались',
      notVoted: 'Не голосовали',
      quorum: 'Кворум',
      result: 'Результат',
      passed: 'Принято',
      failed: 'Не принято',
      noQuorum: 'Нет кворума',
    },
    en: {
      for: 'For',
      against: 'Against',
      abstain: 'Abstain',
      notVoted: 'Did not vote',
      quorum: 'Quorum',
      result: 'Result',
      passed: 'Passed',
      failed: 'Failed',
      noQuorum: 'No quorum',
    },
    uk: {
      for: 'За',
      against: 'Проти',
      abstain: 'Утрималися',
      notVoted: 'Не голосували',
      quorum: 'Кворум',
      result: 'Результат',
      passed: 'Прийнято',
      failed: 'Не прийнято',
      noQuorum: 'Немає кворуму',
    },
  };

  const l = labels[lang];
  let resultText = l.noQuorum;
  if (results.quorumMet) {
    resultText = results.passed ? l.passed : l.failed;
  }

  const lines = [
    `**${l.for}:** ${results.for}`,
    `**${l.against}:** ${results.against}`,
    `**${l.abstain}:** ${results.abstain}`,
    `**${l.notVoted}:** ${breakdown.notVoted.length}`,
    '',
    `**${l.quorum}:** ${results.quorumMet ? '✓' : '✗'} (${vote.quorumPct}% required)`,
    `**${l.result}:** ${resultText}`,
  ];

  return lines.join('\n');
}

export function canVoterParticipate(vote: CommitteeVote, userId: string): {
  canVote: boolean;
  reason?: string;
} {
  if (vote.status !== 'open') {
    return { canVote: false, reason: 'Vote is closed' };
  }

  if (!vote.eligibleVoterIds.includes(userId)) {
    return { canVote: false, reason: 'Not eligible to vote' };
  }

  if (vote.votes.some(v => v.userId === userId)) {
    return { canVote: false, reason: 'Already voted' };
  }

  return { canVote: true };
}
