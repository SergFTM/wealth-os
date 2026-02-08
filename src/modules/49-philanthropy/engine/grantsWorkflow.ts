/**
 * Grants Workflow Engine
 * Manages grant lifecycle transitions with validation gates
 */

export type GrantStage = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'paid' | 'closed';

export interface GrantTransitionResult {
  success: boolean;
  newStage?: GrantStage;
  error?: string;
  blockers?: string[];
}

export interface Grant {
  id: string;
  stageKey: GrantStage;
  complianceStatusKey?: 'pending' | 'cleared' | 'flagged';
  docsStatusKey?: 'complete' | 'incomplete' | 'pending';
  approvalsIdsJson?: string[];
  approvedAmount?: number;
  requestedAmount?: number;
}

export interface ComplianceCheck {
  id: string;
  grantId: string;
  statusKey: 'open' | 'cleared' | 'flagged';
}

export interface Approval {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Stage transition rules
const STAGE_TRANSITIONS: Record<GrantStage, GrantStage[]> = {
  draft: ['submitted'],
  submitted: ['in_review', 'rejected'],
  in_review: ['approved', 'rejected'],
  approved: ['paid', 'rejected'],
  rejected: ['draft'], // Can reopen as draft
  paid: ['closed'],
  closed: [],
};

/**
 * Check if a stage transition is allowed
 */
export function canTransition(fromStage: GrantStage, toStage: GrantStage): boolean {
  return STAGE_TRANSITIONS[fromStage]?.includes(toStage) ?? false;
}

/**
 * Get allowed next stages for a grant
 */
export function getAllowedTransitions(currentStage: GrantStage): GrantStage[] {
  return STAGE_TRANSITIONS[currentStage] || [];
}

/**
 * Validate transition blockers
 */
export function getTransitionBlockers(
  grant: Grant,
  toStage: GrantStage,
  complianceChecks: ComplianceCheck[],
  approvals: Approval[]
): string[] {
  const blockers: string[] = [];

  // Check basic transition validity
  if (!canTransition(grant.stageKey, toStage)) {
    blockers.push(`Переход из ${grant.stageKey} в ${toStage} не разрешен`);
    return blockers;
  }

  // Transition-specific validations
  switch (toStage) {
    case 'submitted':
      if (!grant.requestedAmount || grant.requestedAmount <= 0) {
        blockers.push('Не указана запрашиваемая сумма');
      }
      break;

    case 'in_review':
      // No additional requirements
      break;

    case 'approved':
      // Compliance must be cleared
      const openChecks = complianceChecks.filter(
        c => c.grantId === grant.id && c.statusKey !== 'cleared'
      );
      if (openChecks.length > 0) {
        blockers.push(`${openChecks.length} комплаенс проверок не завершено`);
      }

      // Check for flagged compliance
      const flaggedChecks = complianceChecks.filter(
        c => c.grantId === grant.id && c.statusKey === 'flagged'
      );
      if (flaggedChecks.length > 0) {
        blockers.push(`${flaggedChecks.length} комплаенс проверок с флагом`);
      }

      // All required approvals must be approved
      if (grant.approvalsIdsJson && grant.approvalsIdsJson.length > 0) {
        const grantApprovals = approvals.filter(a =>
          grant.approvalsIdsJson?.includes(a.id)
        );
        const pendingApprovals = grantApprovals.filter(a => a.status === 'pending');
        if (pendingApprovals.length > 0) {
          blockers.push(`${pendingApprovals.length} согласований ожидают`);
        }
        const rejectedApprovals = grantApprovals.filter(a => a.status === 'rejected');
        if (rejectedApprovals.length > 0) {
          blockers.push(`${rejectedApprovals.length} согласований отклонено`);
        }
      }

      // Docs must be complete
      if (grant.docsStatusKey !== 'complete') {
        blockers.push('Документация не завершена');
      }
      break;

    case 'paid':
      // Must have approved amount
      if (!grant.approvedAmount || grant.approvedAmount <= 0) {
        blockers.push('Не указана одобренная сумма');
      }
      break;

    case 'closed':
      // No additional requirements
      break;
  }

  return blockers;
}

/**
 * Attempt to transition a grant to a new stage
 */
export function transitionGrant(
  grant: Grant,
  toStage: GrantStage,
  complianceChecks: ComplianceCheck[] = [],
  approvals: Approval[] = []
): GrantTransitionResult {
  const blockers = getTransitionBlockers(grant, toStage, complianceChecks, approvals);

  if (blockers.length > 0) {
    return {
      success: false,
      error: 'Переход заблокирован',
      blockers,
    };
  }

  return {
    success: true,
    newStage: toStage,
  };
}

/**
 * Get stage display info
 */
export function getStageInfo(stage: GrantStage): {
  label: { ru: string; en: string; uk: string };
  color: string;
} {
  const stageMap: Record<GrantStage, { label: { ru: string; en: string; uk: string }; color: string }> = {
    draft: { label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' }, color: 'stone' },
    submitted: { label: { ru: 'Подана', en: 'Submitted', uk: 'Подано' }, color: 'blue' },
    in_review: { label: { ru: 'На рассмотрении', en: 'In Review', uk: 'На розгляді' }, color: 'amber' },
    approved: { label: { ru: 'Одобрен', en: 'Approved', uk: 'Схвалено' }, color: 'emerald' },
    rejected: { label: { ru: 'Отклонен', en: 'Rejected', uk: 'Відхилено' }, color: 'red' },
    paid: { label: { ru: 'Выплачен', en: 'Paid', uk: 'Виплачено' }, color: 'green' },
    closed: { label: { ru: 'Закрыт', en: 'Closed', uk: 'Закрито' }, color: 'stone' },
  };

  return stageMap[stage];
}

/**
 * Calculate grant progress percentage
 */
export function getGrantProgress(stage: GrantStage): number {
  const progressMap: Record<GrantStage, number> = {
    draft: 10,
    submitted: 25,
    in_review: 50,
    approved: 75,
    rejected: 0,
    paid: 90,
    closed: 100,
  };

  return progressMap[stage] ?? 0;
}
