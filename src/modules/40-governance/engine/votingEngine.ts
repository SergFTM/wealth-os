/**
 * Voting Engine - Manages votes, casting, tallying, and quorum
 */

import { BaseRecord } from '@/db/storage/storage.types';

export interface EligibleVoter {
  userId: string;
  name: string;
  weight: number;
}

export interface Delegation {
  fromUserId: string;
  toUserId: string;
  scope: 'all' | 'this_vote';
}

export interface VoteCast {
  userId: string;
  vote: 'yes' | 'no' | 'abstain';
  castAt: string;
  delegatedFrom?: string;
  comment?: string;
}

export interface VoteTally {
  yes: number;
  no: number;
  abstain: number;
  notVoted: number;
  quorumReached: boolean;
  passed: boolean;
}

export interface GovernanceVote extends BaseRecord {
  clientId: string;
  decisionId: string;
  meetingId?: string;
  opensAt: string;
  closesAt: string;
  status: 'open' | 'closed' | 'cancelled';
  quorumPct: number;
  eligibleVotersJson: EligibleVoter[];
  delegationJson: Delegation[];
  votesCastJson: VoteCast[];
  tallyJson: VoteTally;
  resultNotes?: string;
}

export interface OpenVoteInput {
  clientId: string;
  decisionId: string;
  meetingId?: string;
  opensAt?: string;
  closesAt: string;
  quorumPct: number;
  eligibleVoters: EligibleVoter[];
  delegations?: Delegation[];
}

/**
 * Create a new vote
 */
export function createVoteData(input: OpenVoteInput): Omit<GovernanceVote, 'id' | 'createdAt' | 'updatedAt'> {
  const now = new Date().toISOString();

  return {
    clientId: input.clientId,
    decisionId: input.decisionId,
    meetingId: input.meetingId,
    opensAt: input.opensAt || now,
    closesAt: input.closesAt,
    status: 'open',
    quorumPct: input.quorumPct,
    eligibleVotersJson: input.eligibleVoters,
    delegationJson: input.delegations || [],
    votesCastJson: [],
    tallyJson: {
      yes: 0,
      no: 0,
      abstain: 0,
      notVoted: getTotalWeight(input.eligibleVoters),
      quorumReached: false,
      passed: false,
    },
  };
}

/**
 * Get total voting weight
 */
export function getTotalWeight(voters: EligibleVoter[]): number {
  return voters.reduce((sum, v) => sum + v.weight, 0);
}

/**
 * Check if a user can vote (is eligible and hasn't voted)
 */
export function canVote(vote: GovernanceVote, userId: string): { canVote: boolean; reason?: string } {
  if (vote.status !== 'open') {
    return { canVote: false, reason: 'Vote is not open' };
  }

  const now = new Date();
  if (now > new Date(vote.closesAt)) {
    return { canVote: false, reason: 'Vote has expired' };
  }

  const isEligible = vote.eligibleVotersJson.some(v => v.userId === userId);
  if (!isEligible) {
    return { canVote: false, reason: 'User is not eligible to vote' };
  }

  const hasVoted = vote.votesCastJson.some(v => v.userId === userId);
  if (hasVoted) {
    return { canVote: false, reason: 'User has already voted' };
  }

  return { canVote: true };
}

/**
 * Cast a vote
 */
export function castVote(
  vote: GovernanceVote,
  userId: string,
  voteChoice: 'yes' | 'no' | 'abstain',
  comment?: string
): Partial<GovernanceVote> {
  const { canVote: allowed, reason } = canVote(vote, userId);
  if (!allowed) {
    throw new Error(reason || 'Cannot cast vote');
  }

  const newVoteCast: VoteCast = {
    userId,
    vote: voteChoice,
    castAt: new Date().toISOString(),
    comment,
  };

  const updatedVotesCast = [...vote.votesCastJson, newVoteCast];
  const newTally = calculateTally(vote.eligibleVotersJson, updatedVotesCast, vote.quorumPct);

  return {
    votesCastJson: updatedVotesCast,
    tallyJson: newTally,
  };
}

/**
 * Cast a delegated vote
 */
export function castDelegatedVote(
  vote: GovernanceVote,
  votingUserId: string,
  delegatedFromUserId: string,
  voteChoice: 'yes' | 'no' | 'abstain',
  comment?: string
): Partial<GovernanceVote> {
  // Verify delegation exists
  const delegation = vote.delegationJson.find(
    d => d.fromUserId === delegatedFromUserId && d.toUserId === votingUserId
  );

  if (!delegation) {
    throw new Error('No valid delegation found');
  }

  // Check if delegator hasn't already had their vote cast
  const alreadyVoted = vote.votesCastJson.some(
    v => v.userId === delegatedFromUserId || v.delegatedFrom === delegatedFromUserId
  );

  if (alreadyVoted) {
    throw new Error('Delegated vote has already been cast');
  }

  const newVoteCast: VoteCast = {
    userId: delegatedFromUserId,
    vote: voteChoice,
    castAt: new Date().toISOString(),
    delegatedFrom: delegatedFromUserId,
    comment,
  };

  const updatedVotesCast = [...vote.votesCastJson, newVoteCast];
  const newTally = calculateTally(vote.eligibleVotersJson, updatedVotesCast, vote.quorumPct);

  return {
    votesCastJson: updatedVotesCast,
    tallyJson: newTally,
  };
}

/**
 * Calculate vote tally
 */
export function calculateTally(
  eligibleVoters: EligibleVoter[],
  votesCast: VoteCast[],
  quorumPct: number
): VoteTally {
  const totalWeight = getTotalWeight(eligibleVoters);

  let yesWeight = 0;
  let noWeight = 0;
  let abstainWeight = 0;

  const votedUserIds = new Set(votesCast.map(v => v.userId));

  for (const voteCast of votesCast) {
    const voter = eligibleVoters.find(v => v.userId === voteCast.userId);
    if (!voter) continue;

    switch (voteCast.vote) {
      case 'yes':
        yesWeight += voter.weight;
        break;
      case 'no':
        noWeight += voter.weight;
        break;
      case 'abstain':
        abstainWeight += voter.weight;
        break;
    }
  }

  const votedWeight = yesWeight + noWeight + abstainWeight;
  const notVotedWeight = totalWeight - votedWeight;

  // Quorum is calculated as percentage of votes cast vs total eligible
  const participationPct = totalWeight > 0 ? (votedWeight / totalWeight) * 100 : 0;
  const quorumReached = participationPct >= quorumPct;

  // Passed if quorum reached and yes > no (abstains don't count against)
  const passed = quorumReached && yesWeight > noWeight;

  return {
    yes: yesWeight,
    no: noWeight,
    abstain: abstainWeight,
    notVoted: notVotedWeight,
    quorumReached,
    passed,
  };
}

/**
 * Close a vote (either manually or when time expires)
 */
export function closeVote(vote: GovernanceVote, resultNotes?: string): Partial<GovernanceVote> {
  if (vote.status === 'closed') {
    throw new Error('Vote is already closed');
  }

  if (vote.status === 'cancelled') {
    throw new Error('Vote is cancelled');
  }

  // Recalculate final tally
  const finalTally = calculateTally(
    vote.eligibleVotersJson,
    vote.votesCastJson,
    vote.quorumPct
  );

  return {
    status: 'closed',
    tallyJson: finalTally,
    resultNotes,
  };
}

/**
 * Cancel a vote
 */
export function cancelVote(vote: GovernanceVote, reason?: string): Partial<GovernanceVote> {
  if (vote.status === 'closed') {
    throw new Error('Cannot cancel a closed vote');
  }

  return {
    status: 'cancelled',
    resultNotes: reason || 'Vote cancelled',
  };
}

/**
 * Check if vote should auto-close (past closesAt time)
 */
export function shouldAutoClose(vote: GovernanceVote): boolean {
  if (vote.status !== 'open') return false;

  const now = new Date();
  return now >= new Date(vote.closesAt);
}

/**
 * Get vote summary for display
 */
export function getVoteSummary(vote: GovernanceVote) {
  const totalWeight = getTotalWeight(vote.eligibleVotersJson);
  const votedCount = vote.votesCastJson.length;
  const eligibleCount = vote.eligibleVotersJson.length;

  return {
    id: vote.id,
    decisionId: vote.decisionId,
    status: vote.status,
    opensAt: vote.opensAt,
    closesAt: vote.closesAt,
    quorumPct: vote.quorumPct,
    eligibleCount,
    votedCount,
    participationPct: eligibleCount > 0 ? (votedCount / eligibleCount) * 100 : 0,
    tally: vote.tallyJson,
    isExpired: shouldAutoClose(vote),
  };
}

/**
 * Get remaining time for vote
 */
export function getRemainingTime(vote: GovernanceVote): { hours: number; minutes: number; expired: boolean } {
  const now = new Date();
  const closes = new Date(vote.closesAt);
  const diff = closes.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, expired: false };
}
