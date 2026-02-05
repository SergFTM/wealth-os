/**
 * Approval Flow Engine
 * Handles deal approval workflows
 */

// Simple UUID generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface ApprovalRequest {
  id: string;
  clientId: string;
  dealId: string;
  approvalType: 'ic' | 'legal' | 'cfo' | 'compliance' | 'cio';
  requestedByUserId: string;
  requestedByName: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  dueAt: string;
  decidedByUserId?: string;
  decidedByName?: string;
  decidedAt?: string;
  notes?: string;
  autoMoveStage?: boolean;
  targetStageId?: string;
  createdAt: string;
}

export interface ApprovalDecision {
  decidedByUserId: string;
  decidedByName: string;
  status: 'approved' | 'rejected';
  notes?: string;
}

export interface ApprovalResult {
  approval: ApprovalRequest;
  auditEvent: {
    action: string;
    summary: string;
  };
  stageUpdate?: {
    dealId: string;
    newStageId: string;
  };
}

// SLA for each approval type (hours)
const APPROVAL_SLA: Record<string, number> = {
  ic: 72,
  legal: 48,
  cfo: 24,
  compliance: 48,
  cio: 24
};

/**
 * Create an approval request
 */
export function createApprovalRequest(params: {
  clientId: string;
  dealId: string;
  dealName: string;
  approvalType: 'ic' | 'legal' | 'cfo' | 'compliance' | 'cio';
  requestedByUserId: string;
  requestedByName: string;
  notes?: string;
  autoMoveStage?: boolean;
  targetStageId?: string;
}): ApprovalResult {
  const now = new Date();
  const slaHours = APPROVAL_SLA[params.approvalType] || 48;
  const dueAt = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

  const approval: ApprovalRequest = {
    id: uuidv4(),
    clientId: params.clientId,
    dealId: params.dealId,
    approvalType: params.approvalType,
    requestedByUserId: params.requestedByUserId,
    requestedByName: params.requestedByName,
    status: 'pending',
    dueAt: dueAt.toISOString(),
    notes: params.notes,
    autoMoveStage: params.autoMoveStage,
    targetStageId: params.targetStageId,
    createdAt: now.toISOString()
  };

  return {
    approval,
    auditEvent: {
      action: 'approval_requested',
      summary: `Запрос на согласование ${params.approvalType.toUpperCase()} для сделки "${params.dealName}" от ${params.requestedByName}`
    }
  };
}

/**
 * Process approval decision
 */
export function processApprovalDecision(
  approval: ApprovalRequest,
  decision: ApprovalDecision,
  dealName: string
): ApprovalResult {
  const now = new Date();

  const updatedApproval: ApprovalRequest = {
    ...approval,
    status: decision.status,
    decidedByUserId: decision.decidedByUserId,
    decidedByName: decision.decidedByName,
    decidedAt: now.toISOString(),
    notes: decision.notes || approval.notes
  };

  const result: ApprovalResult = {
    approval: updatedApproval,
    auditEvent: {
      action: decision.status === 'approved' ? 'approval_granted' : 'approval_rejected',
      summary: decision.status === 'approved'
        ? `${approval.approvalType.toUpperCase()} согласование одобрено ${decision.decidedByName} для сделки "${dealName}"`
        : `${approval.approvalType.toUpperCase()} согласование отклонено ${decision.decidedByName} для сделки "${dealName}"`
    }
  };

  // If approved and auto-move is enabled, add stage update
  if (decision.status === 'approved' && approval.autoMoveStage && approval.targetStageId) {
    result.stageUpdate = {
      dealId: approval.dealId,
      newStageId: approval.targetStageId
    };
  }

  return result;
}

/**
 * Check if approval is overdue
 */
export function isApprovalOverdue(approval: ApprovalRequest): boolean {
  if (approval.status !== 'pending') return false;
  return new Date() > new Date(approval.dueAt);
}

/**
 * Get approval priority based on due date and type
 */
export function getApprovalPriority(approval: ApprovalRequest): 'high' | 'medium' | 'low' {
  if (approval.status !== 'pending') return 'low';

  const hoursUntilDue = (new Date(approval.dueAt).getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilDue < 0) return 'high'; // Overdue
  if (hoursUntilDue < 12) return 'high';
  if (hoursUntilDue < 24) return 'medium';
  return 'low';
}

/**
 * Get required approvals for a stage transition
 */
export function getRequiredApprovals(
  fromStageId: string,
  toStageId: string
): string[] {
  const stageApprovals: Record<string, string[]> = {
    'screening->ic-review': ['ic'],
    'ic-review->legal': ['ic'],
    'legal->closing': ['legal', 'compliance'],
    'closing->post-close': ['cfo'],
    'post-close->closed': ['cio']
  };

  const key = `${fromStageId}->${toStageId}`;
  return stageApprovals[key] || [];
}

/**
 * Check if all required approvals are granted
 */
export function checkApprovalsComplete(
  approvals: ApprovalRequest[],
  requiredTypes: string[]
): boolean {
  for (const type of requiredTypes) {
    const approval = approvals.find(a => a.approvalType === type && a.status === 'approved');
    if (!approval) return false;
  }
  return true;
}
