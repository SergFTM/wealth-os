/**
 * Decision Engine
 * Формирование и управление решениями комитета
 */

import { CommitteeAgendaItem } from '../schema/committeeAgendaItem';
import { CommitteeDecision, CommitteeDecisionCreateInput, CmDecisionResult } from '../schema/committeeDecision';
import { CommitteeVote, VoteResults } from '../schema/committeeVote';

export interface DecisionDraft {
  agendaItemId: string;
  agendaItemTitle: string;
  meetingId: string;
  proposedResult: CmDecisionResult;
  proposedText: string;
  rationale?: string;
  voteResults?: VoteResults;
}

export function createDecisionFromVote(
  agendaItem: CommitteeAgendaItem,
  vote: CommitteeVote,
  results: VoteResults
): CommitteeDecisionCreateInput {
  let result: CmDecisionResult;

  if (results.passed) {
    result = 'approved';
  } else if (!results.quorumMet) {
    result = 'deferred';
  } else {
    result = 'rejected';
  }

  return {
    meetingId: agendaItem.meetingId,
    agendaItemId: agendaItem.id,
    title: agendaItem.title,
    decisionText: agendaItem.proposalText,
    result,
    effectiveAt: new Date().toISOString(),
    voteId: vote.id,
  };
}

export function createDecisionFromAgendaItem(
  agendaItem: CommitteeAgendaItem,
  result: CmDecisionResult,
  decisionText?: string,
  rationale?: string
): CommitteeDecisionCreateInput {
  return {
    meetingId: agendaItem.meetingId,
    agendaItemId: agendaItem.id,
    title: agendaItem.title,
    decisionText: decisionText || agendaItem.proposalText,
    rationale,
    result,
    effectiveAt: new Date().toISOString(),
  };
}

export function generateDecisionSummary(
  decisions: CommitteeDecision[],
  lang: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const labels = {
    ru: {
      title: 'Сводка решений',
      approved: 'Одобрено',
      rejected: 'Отклонено',
      waived: 'Исключения',
      deferred: 'Отложено',
      total: 'Всего',
    },
    en: {
      title: 'Decisions Summary',
      approved: 'Approved',
      rejected: 'Rejected',
      waived: 'Waived',
      deferred: 'Deferred',
      total: 'Total',
    },
    uk: {
      title: 'Зведення рішень',
      approved: 'Схвалено',
      rejected: 'Відхилено',
      waived: 'Винятки',
      deferred: 'Відкладено',
      total: 'Всього',
    },
  };

  const l = labels[lang];
  const counts = {
    approved: decisions.filter(d => d.result === 'approved').length,
    rejected: decisions.filter(d => d.result === 'rejected').length,
    waived: decisions.filter(d => d.result === 'waived').length,
    deferred: decisions.filter(d => d.result === 'deferred').length,
  };

  return `## ${l.title}
- ${l.approved}: ${counts.approved}
- ${l.rejected}: ${counts.rejected}
- ${l.waived}: ${counts.waived}
- ${l.deferred}: ${counts.deferred}
- **${l.total}**: ${decisions.length}`;
}

export function validateDecision(decision: CommitteeDecisionCreateInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!decision.title || decision.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!decision.decisionText || decision.decisionText.trim().length === 0) {
    errors.push('Decision text is required');
  }

  if (!decision.result) {
    errors.push('Result is required');
  }

  if (!decision.meetingId) {
    errors.push('Meeting ID is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getExecutionPlan(decision: CommitteeDecision): string[] {
  const actions: string[] = [];

  if (decision.result === 'approved') {
    actions.push('Create follow-up tasks for execution');
    actions.push('Notify execution owner');
    actions.push('Update related IPS/risk records if applicable');
  }

  if (decision.result === 'waived') {
    actions.push('Create waiver record in IPS module');
    actions.push('Set waiver expiration date');
    actions.push('Document justification');
  }

  if (decision.result === 'rejected') {
    actions.push('Document rejection rationale');
    actions.push('Notify proposer');
  }

  if (decision.result === 'deferred') {
    actions.push('Schedule for next meeting');
    actions.push('Request additional information');
  }

  return actions;
}

export function linkDecisionArtifacts(
  decision: CommitteeDecision,
  artifacts: Array<{ type: string; id: string; title: string }>
): CommitteeDecision {
  return {
    ...decision,
    linkedRefs: [
      ...decision.linkedRefs,
      ...artifacts.map(a => ({
        type: a.type as any,
        id: a.id,
        title: a.title,
      })),
    ],
  };
}
