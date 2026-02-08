// Deal Workflow Engine
// State machine for private deal lifecycle management

import { updateRecord, createRecord } from '@/lib/apiClient';

export type DealStage = 'draft' | 'in_review' | 'approved' | 'executed' | 'closed';

export interface PrivateDeal {
  id: string;
  clientId: string;
  name: string;
  dealType: string;
  stage: DealStage;
  amount?: number;
  currency?: string;
  approvalsJsonIds?: string[];
}

export interface StageTransition {
  from: DealStage;
  to: DealStage;
  requiredApprovals?: string[];
  requiredChecklist?: boolean;
  requiredDocs?: string[];
}

// Valid stage transitions
const VALID_TRANSITIONS: StageTransition[] = [
  { from: 'draft', to: 'in_review', requiredChecklist: true },
  { from: 'in_review', to: 'approved', requiredApprovals: ['cio', 'compliance'] },
  { from: 'in_review', to: 'draft' }, // Can go back to draft
  { from: 'approved', to: 'executed', requiredDocs: ['subscription_agreement'] },
  { from: 'approved', to: 'in_review' }, // Can go back to review
  { from: 'executed', to: 'closed' },
];

// Check if a transition is valid
export function isValidTransition(from: DealStage, to: DealStage): boolean {
  return VALID_TRANSITIONS.some(t => t.from === from && t.to === to);
}

// Get required approvals for a transition
export function getRequiredApprovals(from: DealStage, to: DealStage): string[] {
  const transition = VALID_TRANSITIONS.find(t => t.from === from && t.to === to);
  return transition?.requiredApprovals || [];
}

// Check if transition requirements are met
export async function checkTransitionRequirements(
  deal: PrivateDeal,
  targetStage: DealStage,
  approvals: Array<{ approverRole: string; status: string }>,
  checklist?: { completionPct: number },
  docs?: Array<{ docType: string; status: string }>
): Promise<{ allowed: boolean; blockers: string[] }> {
  const blockers: string[] = [];
  const transition = VALID_TRANSITIONS.find(
    t => t.from === deal.stage && t.to === targetStage
  );

  if (!transition) {
    return { allowed: false, blockers: [`Invalid transition from ${deal.stage} to ${targetStage}`] };
  }

  // Check required approvals
  if (transition.requiredApprovals) {
    for (const role of transition.requiredApprovals) {
      const approval = approvals.find(a => a.approverRole === role && a.status === 'approved');
      if (!approval) {
        blockers.push(`Missing approval from ${role.toUpperCase()}`);
      }
    }
  }

  // Check checklist completion
  if (transition.requiredChecklist && checklist) {
    if (checklist.completionPct < 100) {
      blockers.push(`Checklist not complete (${checklist.completionPct}%)`);
    }
  }

  // Check required documents
  if (transition.requiredDocs && docs) {
    for (const docType of transition.requiredDocs) {
      const doc = docs.find(d => d.docType === docType && d.status === 'approved');
      if (!doc) {
        blockers.push(`Missing or unapproved document: ${docType}`);
      }
    }
  }

  return { allowed: blockers.length === 0, blockers };
}

// Transition deal to new stage
export async function transitionDeal(
  dealId: string,
  targetStage: DealStage,
  force: boolean = false
): Promise<{ success: boolean; deal?: PrivateDeal; error?: string }> {
  try {
    const updated = await updateRecord<PrivateDeal>('dlPrivateDeals', dealId, {
      stage: targetStage,
    });

    if (updated) {
      return { success: true, deal: updated };
    }
    return { success: false, error: 'Failed to update deal' };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Get next possible stages for a deal
export function getNextStages(currentStage: DealStage): DealStage[] {
  return VALID_TRANSITIONS
    .filter(t => t.from === currentStage)
    .map(t => t.to);
}

// Get stage display info
export function getStageInfo(stage: DealStage): {
  label: { ru: string; en: string };
  color: string;
  order: number;
} {
  const stages: Record<DealStage, { label: { ru: string; en: string }; color: string; order: number }> = {
    draft: { label: { ru: 'Черновик', en: 'Draft' }, color: 'stone', order: 1 },
    in_review: { label: { ru: 'На рассмотрении', en: 'In Review' }, color: 'amber', order: 2 },
    approved: { label: { ru: 'Утверждено', en: 'Approved' }, color: 'emerald', order: 3 },
    executed: { label: { ru: 'Исполнено', en: 'Executed' }, color: 'blue', order: 4 },
    closed: { label: { ru: 'Закрыто', en: 'Closed' }, color: 'stone', order: 5 },
  };
  return stages[stage];
}

// Create audit event for stage change
export async function createStageChangeAudit(
  dealId: string,
  dealName: string,
  fromStage: DealStage,
  toStage: DealStage,
  userId: string,
  userName: string
): Promise<void> {
  await createRecord('auditEvents', {
    actorRole: 'user',
    actorName: userName,
    action: 'update',
    collection: 'dlPrivateDeals',
    recordId: dealId,
    summary: `Deal "${dealName}" stage changed from ${fromStage} to ${toStage}`,
    details: { fromStage, toStage, userId },
  });
}

export default {
  isValidTransition,
  getRequiredApprovals,
  checkTransitionRequirements,
  transitionDeal,
  getNextStages,
  getStageInfo,
  createStageChangeAudit,
};
