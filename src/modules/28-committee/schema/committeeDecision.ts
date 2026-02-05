/**
 * Committee Decision Schema
 * Решения комитета
 */

import { CmDecisionResult, CmDecisionStatus, CM_DECISION_RESULT, CM_DECISION_STATUS } from '../config';

// Re-export types for convenience
export type { CmDecisionResult, CmDecisionStatus };

export interface LinkedRef {
  type: 'report_pack' | 'document' | 'task' | 'comm_message' | 'ips_waiver';
  id: string;
  title: string;
}

export interface CommitteeDecision {
  id: string;
  clientId?: string;
  meetingId: string;
  agendaItemId?: string;
  title: string;
  decisionText: string;
  rationale?: string;
  result: CmDecisionResult;
  effectiveAt: string;
  expiresAt?: string;
  executionOwnerUserId?: string;
  executionOwnerName?: string;
  status: CmDecisionStatus;
  linkedRefs: LinkedRef[];
  voteId?: string;
  aiAssisted?: boolean;
  confidencePct?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeDecisionCreateInput {
  clientId?: string;
  meetingId: string;
  agendaItemId?: string;
  title: string;
  decisionText: string;
  rationale?: string;
  result: CmDecisionResult;
  effectiveAt?: string;
  expiresAt?: string;
  executionOwnerUserId?: string;
  executionOwnerName?: string;
  linkedRefs?: LinkedRef[];
  voteId?: string;
  aiAssisted?: boolean;
  confidencePct?: number;
  tags?: string[];
}

export function getDecisionResultConfig(result: CmDecisionResult) {
  return CM_DECISION_RESULT[result];
}

export function getDecisionStatusConfig(status: CmDecisionStatus) {
  return CM_DECISION_STATUS[status];
}

export function isDecisionActive(decision: CommitteeDecision): boolean {
  const now = new Date();
  const effective = new Date(decision.effectiveAt);
  if (decision.expiresAt) {
    const expires = new Date(decision.expiresAt);
    return now >= effective && now <= expires;
  }
  return now >= effective;
}

export function canCreateTasks(decision: CommitteeDecision): boolean {
  return decision.result === 'approved' && decision.status !== 'done';
}

export function getLinkedRefsByType(refs: LinkedRef[], type: LinkedRef['type']): LinkedRef[] {
  return refs.filter(r => r.type === type);
}

export function formatDecisionSummary(decision: CommitteeDecision, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const resultLabel = CM_DECISION_RESULT[decision.result].label[lang];
  return `${resultLabel}: ${decision.title}`;
}

export function getDecisionsByResult(decisions: CommitteeDecision[], result: CmDecisionResult): CommitteeDecision[] {
  return decisions.filter(d => d.result === result);
}

export function countDecisionsByStatus(decisions: CommitteeDecision[]): Record<CmDecisionStatus, number> {
  return {
    open: decisions.filter(d => d.status === 'open').length,
    in_progress: decisions.filter(d => d.status === 'in_progress').length,
    done: decisions.filter(d => d.status === 'done').length,
  };
}
