/**
 * Quorum Calculator - Computes quorum status for votes and meetings
 */

export interface QuorumParticipant {
  userId: string;
  name?: string;
  weight: number;
  present?: boolean;
  voted?: boolean;
}

export interface QuorumResult {
  totalWeight: number;
  participatingWeight: number;
  requiredWeight: number;
  requiredPct: number;
  participationPct: number;
  quorumReached: boolean;
  deficit: number;
  surplus: number;
}

export interface QuorumRisk {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  message: string;
  missingWeight: number;
  missingParticipants: number;
}

/**
 * Calculate quorum for a meeting based on attendance
 */
export function calculateMeetingQuorum(
  participants: QuorumParticipant[],
  requiredPct: number
): QuorumResult {
  const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);
  const presentWeight = participants
    .filter(p => p.present)
    .reduce((sum, p) => sum + p.weight, 0);

  const requiredWeight = (totalWeight * requiredPct) / 100;
  const participationPct = totalWeight > 0 ? (presentWeight / totalWeight) * 100 : 0;
  const quorumReached = presentWeight >= requiredWeight;

  return {
    totalWeight,
    participatingWeight: presentWeight,
    requiredWeight,
    requiredPct,
    participationPct,
    quorumReached,
    deficit: quorumReached ? 0 : requiredWeight - presentWeight,
    surplus: quorumReached ? presentWeight - requiredWeight : 0,
  };
}

/**
 * Calculate quorum for a vote based on votes cast
 */
export function calculateVoteQuorum(
  voters: QuorumParticipant[],
  requiredPct: number
): QuorumResult {
  const totalWeight = voters.reduce((sum, v) => sum + v.weight, 0);
  const votedWeight = voters
    .filter(v => v.voted)
    .reduce((sum, v) => sum + v.weight, 0);

  const requiredWeight = (totalWeight * requiredPct) / 100;
  const participationPct = totalWeight > 0 ? (votedWeight / totalWeight) * 100 : 0;
  const quorumReached = votedWeight >= requiredWeight;

  return {
    totalWeight,
    participatingWeight: votedWeight,
    requiredWeight,
    requiredPct,
    participationPct,
    quorumReached,
    deficit: quorumReached ? 0 : requiredWeight - votedWeight,
    surplus: quorumReached ? votedWeight - requiredWeight : 0,
  };
}

/**
 * Assess quorum risk for an upcoming meeting
 */
export function assessQuorumRisk(
  totalParticipants: number,
  confirmedParticipants: number,
  requiredPct: number
): QuorumRisk {
  const confirmationRate = totalParticipants > 0
    ? (confirmedParticipants / totalParticipants) * 100
    : 0;

  const requiredParticipants = Math.ceil((totalParticipants * requiredPct) / 100);
  const missingParticipants = Math.max(0, requiredParticipants - confirmedParticipants);

  if (confirmationRate >= requiredPct + 20) {
    return {
      level: 'none',
      message: 'Достаточно подтверждений для кворума',
      missingWeight: 0,
      missingParticipants: 0,
    };
  }

  if (confirmationRate >= requiredPct + 10) {
    return {
      level: 'low',
      message: 'Кворум вероятен, но рекомендуется подтвердить участие',
      missingWeight: 0,
      missingParticipants: 0,
    };
  }

  if (confirmationRate >= requiredPct) {
    return {
      level: 'medium',
      message: 'Кворум на границе, требуются дополнительные подтверждения',
      missingWeight: 0,
      missingParticipants,
    };
  }

  if (confirmationRate >= requiredPct - 10) {
    return {
      level: 'high',
      message: `Риск отсутствия кворума. Не хватает ${missingParticipants} участников`,
      missingWeight: 0,
      missingParticipants,
    };
  }

  return {
    level: 'critical',
    message: `Критический риск! Не хватает ${missingParticipants} участников для кворума`,
    missingWeight: 0,
    missingParticipants,
  };
}

/**
 * Calculate weighted quorum risk
 */
export function assessWeightedQuorumRisk(
  participants: QuorumParticipant[],
  requiredPct: number
): QuorumRisk {
  const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);
  const confirmedWeight = participants
    .filter(p => p.present)
    .reduce((sum, p) => sum + p.weight, 0);

  const confirmationPct = totalWeight > 0 ? (confirmedWeight / totalWeight) * 100 : 0;
  const requiredWeight = (totalWeight * requiredPct) / 100;
  const missingWeight = Math.max(0, requiredWeight - confirmedWeight);
  const missingParticipants = participants.filter(p => !p.present).length;

  if (confirmationPct >= requiredPct + 20) {
    return {
      level: 'none',
      message: 'Достаточно подтверждений для кворума',
      missingWeight: 0,
      missingParticipants: 0,
    };
  }

  if (confirmationPct >= requiredPct + 10) {
    return {
      level: 'low',
      message: 'Кворум вероятен',
      missingWeight: 0,
      missingParticipants: 0,
    };
  }

  if (confirmationPct >= requiredPct) {
    return {
      level: 'medium',
      message: 'Кворум на границе',
      missingWeight: 0,
      missingParticipants,
    };
  }

  if (confirmationPct >= requiredPct - 10) {
    return {
      level: 'high',
      message: `Риск отсутствия кворума. Не хватает ${missingWeight.toFixed(0)} голосов`,
      missingWeight,
      missingParticipants,
    };
  }

  return {
    level: 'critical',
    message: `Критический риск! Не хватает ${missingWeight.toFixed(0)} голосов для кворума`,
    missingWeight,
    missingParticipants,
  };
}

/**
 * Get quorum badge status
 */
export function getQuorumBadgeStatus(result: QuorumResult): {
  status: 'success' | 'warning' | 'error';
  label: string;
  tooltip: string;
} {
  if (result.quorumReached) {
    if (result.surplus > result.requiredWeight * 0.2) {
      return {
        status: 'success',
        label: `${result.participationPct.toFixed(0)}%`,
        tooltip: `Кворум достигнут с запасом (${result.participatingWeight}/${result.requiredWeight})`,
      };
    }
    return {
      status: 'success',
      label: `${result.participationPct.toFixed(0)}%`,
      tooltip: `Кворум достигнут (${result.participatingWeight}/${result.requiredWeight})`,
    };
  }

  if (result.participationPct >= result.requiredPct - 10) {
    return {
      status: 'warning',
      label: `${result.participationPct.toFixed(0)}%`,
      tooltip: `Не хватает ${result.deficit.toFixed(0)} для кворума`,
    };
  }

  return {
    status: 'error',
    label: `${result.participationPct.toFixed(0)}%`,
    tooltip: `Кворум не достигнут (${result.participatingWeight}/${result.requiredWeight})`,
  };
}

/**
 * Calculate who is needed for quorum
 */
export function getNeededForQuorum(
  participants: QuorumParticipant[],
  currentWeight: number,
  requiredWeight: number
): QuorumParticipant[] {
  if (currentWeight >= requiredWeight) {
    return [];
  }

  const needed: QuorumParticipant[] = [];
  let accumulatedWeight = currentWeight;

  // Sort by weight descending
  const notParticipating = participants
    .filter(p => !p.present && !p.voted)
    .sort((a, b) => b.weight - a.weight);

  for (const participant of notParticipating) {
    if (accumulatedWeight >= requiredWeight) break;
    needed.push(participant);
    accumulatedWeight += participant.weight;
  }

  return needed;
}

/**
 * Format quorum for display
 */
export function formatQuorum(result: QuorumResult): string {
  const status = result.quorumReached ? 'Достигнут' : 'Не достигнут';
  return `${status} (${result.participationPct.toFixed(0)}% / ${result.requiredPct}%)`;
}

/**
 * Get quorum progress percentage (for progress bars)
 */
export function getQuorumProgress(result: QuorumResult): number {
  if (result.requiredWeight === 0) return 100;
  return Math.min(100, (result.participatingWeight / result.requiredWeight) * 100);
}
