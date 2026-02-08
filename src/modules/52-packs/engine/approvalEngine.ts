/**
 * Approval Engine
 *
 * Handles approval workflows with RBAC enforcement.
 */

import {
  PackApproval,
  ApprovalRequest,
  ApprovalStatus,
  ApproverRole,
  RecipientType,
  SensitivityLevel,
  UrgencyLevel,
  ReportPack
} from './types';

/**
 * Role permissions for approving different recipient types
 */
const APPROVAL_PERMISSIONS: Record<ApproverRole, RecipientType[]> = {
  admin: ['auditor', 'bank', 'tax', 'legal', 'committee', 'investor', 'regulator', 'other'],
  cfo: ['auditor', 'bank', 'committee', 'investor'],
  controller: ['auditor', 'bank'],
  compliance: ['regulator', 'legal', 'auditor'],
  legal: ['legal', 'regulator'],
  family_office_head: ['auditor', 'bank', 'tax', 'legal', 'committee', 'investor', 'regulator', 'other']
};

/**
 * Sensitivity thresholds requiring additional approval
 */
const SENSITIVITY_APPROVERS: Record<SensitivityLevel, ApproverRole[]> = {
  low: ['admin', 'cfo', 'controller', 'compliance', 'legal', 'family_office_head'],
  medium: ['admin', 'cfo', 'controller', 'compliance', 'family_office_head'],
  high: ['admin', 'cfo', 'family_office_head']
};

/**
 * Determine required approver role based on pack
 */
export function determineRequiredApprover(pack: ReportPack): ApproverRole {
  const recipientType = pack.recipientJson.type;
  const sensitivity = pack.sensitivityKey;

  // High sensitivity always needs CFO or admin
  if (sensitivity === 'high') {
    if (['regulator', 'legal'].includes(recipientType)) {
      return 'compliance';
    }
    return 'cfo';
  }

  // Map recipient to primary approver
  const recipientApprovers: Record<RecipientType, ApproverRole> = {
    auditor: 'controller',
    bank: 'cfo',
    tax: 'controller',
    legal: 'legal',
    committee: 'cfo',
    investor: 'cfo',
    regulator: 'compliance',
    other: 'admin'
  };

  return recipientApprovers[recipientType] || 'admin';
}

/**
 * Check if user role can approve the pack
 */
export function canApprove(
  userRole: ApproverRole,
  recipientType: RecipientType,
  sensitivity: SensitivityLevel
): boolean {
  // Check recipient type permission
  const allowedRecipients = APPROVAL_PERMISSIONS[userRole] || [];
  if (!allowedRecipients.includes(recipientType)) {
    return false;
  }

  // Check sensitivity permission
  const allowedRoles = SENSITIVITY_APPROVERS[sensitivity] || [];
  if (!allowedRoles.includes(userRole)) {
    return false;
  }

  return true;
}

/**
 * Create approval request
 */
export function createApprovalRequest(
  request: ApprovalRequest,
  pack: ReportPack
): Partial<PackApproval> {
  const requiredRole = request.approverRoleKey || determineRequiredApprover(pack);

  // Default due date: 3 business days
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (request.urgencyKey === 'urgent' ? 1 : 3));

  return {
    packId: request.packId,
    requestedByUserId: request.requestedByUserId,
    approverRoleKey: requiredRole,
    statusKey: 'pending',
    urgencyKey: request.urgencyKey || 'normal',
    dueAt: request.dueAt || dueDate.toISOString(),
    notes: request.notes,
    createdAt: new Date().toISOString()
  };
}

/**
 * Process approval decision
 */
export function processApprovalDecision(
  approval: PackApproval,
  decision: 'approve' | 'reject',
  decisionByUserId: string,
  decisionByName: string,
  notes?: string
): Partial<PackApproval> {
  return {
    ...approval,
    statusKey: decision === 'approve' ? 'approved' : 'rejected',
    decisionByUserId,
    decisionByName,
    decisionAt: new Date().toISOString(),
    notes: notes || approval.notes
  };
}

/**
 * Check if approval is overdue
 */
export function isApprovalOverdue(approval: PackApproval): boolean {
  if (approval.statusKey !== 'pending') return false;
  if (!approval.dueAt) return false;

  return new Date(approval.dueAt) < new Date();
}

/**
 * Get approval summary for pack
 */
export function getApprovalSummary(approvals: PackApproval[]): {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  overdue: number;
  latestStatus: ApprovalStatus | null;
} {
  const summary = {
    total: approvals.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    overdue: 0,
    latestStatus: null as ApprovalStatus | null
  };

  for (const approval of approvals) {
    switch (approval.statusKey) {
      case 'pending':
        summary.pending++;
        if (isApprovalOverdue(approval)) {
          summary.overdue++;
        }
        break;
      case 'approved':
        summary.approved++;
        break;
      case 'rejected':
        summary.rejected++;
        break;
    }
  }

  // Determine latest/current status
  if (summary.rejected > 0) {
    summary.latestStatus = 'rejected';
  } else if (summary.pending > 0) {
    summary.latestStatus = 'pending';
  } else if (summary.approved > 0) {
    summary.latestStatus = 'approved';
  }

  return summary;
}

/**
 * Generate approval notification
 */
export function generateApprovalNotification(
  approval: PackApproval,
  pack: ReportPack,
  action: 'requested' | 'approved' | 'rejected' | 'reminder'
): {
  title: string;
  message: string;
  urgency: UrgencyLevel;
} {
  const packName = pack.name;
  const recipientOrg = pack.recipientJson.org;

  const notifications = {
    requested: {
      title: 'Запрос на одобрение пакета',
      message: `Пакет "${packName}" для ${recipientOrg} требует вашего одобрения.`,
      urgency: approval.urgencyKey || 'normal'
    },
    approved: {
      title: 'Пакет одобрен',
      message: `Пакет "${packName}" был одобрен и готов к публикации.`,
      urgency: 'low' as UrgencyLevel
    },
    rejected: {
      title: 'Пакет отклонён',
      message: `Пакет "${packName}" был отклонён. ${approval.notes || ''}`,
      urgency: 'normal' as UrgencyLevel
    },
    reminder: {
      title: 'Напоминание: ожидает одобрения',
      message: `Пакет "${packName}" ожидает вашего одобрения. Срок: ${approval.dueAt}`,
      urgency: 'high' as UrgencyLevel
    }
  };

  return notifications[action];
}

/**
 * Get pending approvals for role
 */
export function getPendingApprovalsForRole(
  approvals: PackApproval[],
  userRole: ApproverRole
): PackApproval[] {
  return approvals.filter(a =>
    a.statusKey === 'pending' &&
    (a.approverRoleKey === userRole || userRole === 'admin')
  );
}

/**
 * Validate approval request
 */
export function validateApprovalRequest(
  pack: ReportPack,
  existingApprovals: PackApproval[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check pack status
  if (pack.statusKey === 'approved' || pack.statusKey === 'shared') {
    errors.push('Пакет уже одобрен');
  }

  if (pack.statusKey === 'closed') {
    errors.push('Пакет закрыт');
  }

  // Check for pending approval
  const hasPending = existingApprovals.some(a => a.statusKey === 'pending');
  if (hasPending) {
    errors.push('Уже есть активный запрос на одобрение');
  }

  // Check pack has items
  if (!pack.itemsCount || pack.itemsCount === 0) {
    errors.push('Пакет должен содержать документы');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
