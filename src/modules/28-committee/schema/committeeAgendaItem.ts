/**
 * Committee Agenda Item Schema
 * Пункты повестки заседаний
 */

import { CmAgendaCategory, CmAgendaStatus, CM_AGENDA_CATEGORY, CM_AGENDA_STATUS } from '../config';

export interface SourceRef {
  type: 'portfolio' | 'risk_alert' | 'ips_policy' | 'ips_breach' | 'ai_narrative' | 'report' | 'document';
  id: string;
  title: string;
  asOf?: string;
}

export interface CommitteeAgendaItem {
  id: string;
  clientId?: string;
  meetingId: string;
  title: string;
  categoryKey: CmAgendaCategory;
  proposalText: string;
  proposedByUserId: string;
  proposedByName?: string;
  status: CmAgendaStatus;
  materialsDocIds: string[];
  sourceRefs: SourceRef[];
  orderIndex: number;
  estimatedMinutes?: number;
  discussionNotes?: string;
  linkedVoteId?: string;
  linkedDecisionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeAgendaItemCreateInput {
  clientId?: string;
  meetingId: string;
  title: string;
  categoryKey: CmAgendaCategory;
  proposalText: string;
  proposedByUserId: string;
  proposedByName?: string;
  materialsDocIds?: string[];
  sourceRefs?: SourceRef[];
  orderIndex?: number;
  estimatedMinutes?: number;
}

export function getCategoryConfig(category: CmAgendaCategory) {
  return CM_AGENDA_CATEGORY[category];
}

export function getAgendaStatusConfig(status: CmAgendaStatus) {
  return CM_AGENDA_STATUS[status];
}

export function canSendToVote(item: CommitteeAgendaItem): boolean {
  return item.status === 'pending' && !item.linkedVoteId;
}

export function hasMissingMaterials(item: CommitteeAgendaItem): boolean {
  return item.materialsDocIds.length === 0;
}

export function getSourceRefsByType(refs: SourceRef[], type: SourceRef['type']): SourceRef[] {
  return refs.filter(r => r.type === type);
}

export function sortAgendaByOrder(items: CommitteeAgendaItem[]): CommitteeAgendaItem[] {
  return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function formatProposalSummary(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
