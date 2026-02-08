/**
 * Action Extractor - Extracts action items from decisions and meetings
 */

import { BaseRecord } from '@/db/storage/storage.types';

export interface GovernanceActionItem extends BaseRecord {
  clientId: string;
  meetingId?: string;
  decisionId?: string;
  title: string;
  description?: string;
  ownerUserId: string;
  ownerName: string;
  dueAt: string;
  status: 'open' | 'in_progress' | 'done' | 'cancelled' | 'deferred';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  linkedTaskId?: string;
  completedAt?: string;
  completionNotes?: string;
  reminderSent?: boolean;
  source: 'meeting' | 'decision' | 'manual' | 'ai_extracted';
}

export interface ActionItemInput {
  clientId: string;
  meetingId?: string;
  decisionId?: string;
  title: string;
  description?: string;
  ownerUserId: string;
  ownerName: string;
  dueAt: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  source?: 'meeting' | 'decision' | 'manual' | 'ai_extracted';
}

export interface DecisionForExtraction {
  id: string;
  clientId: string;
  meetingId?: string;
  title: string;
  proposalText: string;
  outcomeNotes?: string;
  status: string;
}

/**
 * Create action item data
 */
export function createActionItemData(
  input: ActionItemInput
): Omit<GovernanceActionItem, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: input.clientId,
    meetingId: input.meetingId,
    decisionId: input.decisionId,
    title: input.title,
    description: input.description,
    ownerUserId: input.ownerUserId,
    ownerName: input.ownerName,
    dueAt: input.dueAt,
    status: 'open',
    priority: input.priority || 'medium',
    source: input.source || 'manual',
    reminderSent: false,
  };
}

/**
 * Extract action items from decision outcome text
 * Uses simple pattern matching (in production, could use AI)
 */
export function extractActionsFromDecision(
  decision: DecisionForExtraction,
  defaultOwnerUserId: string,
  defaultOwnerName: string,
  defaultDueDays: number = 14
): ActionItemInput[] {
  const actions: ActionItemInput[] = [];
  const text = `${decision.proposalText}\n${decision.outcomeNotes || ''}`;

  // Common action patterns
  const actionPatterns = [
    /(?:action|задача|task):\s*(.+?)(?:\n|$)/gi,
    /(?:follow[ -]?up|followup):\s*(.+?)(?:\n|$)/gi,
    /(?:to[ -]?do|todo):\s*(.+?)(?:\n|$)/gi,
    /(?:next step|следующий шаг):\s*(.+?)(?:\n|$)/gi,
    /(?:assign(?:ed)? to|ответственный):\s*(\w+)\s*[-:]\s*(.+?)(?:\n|$)/gi,
  ];

  // Extract using patterns
  for (const pattern of actionPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const actionTitle = match[1].trim();
      if (actionTitle && actionTitle.length > 3) {
        actions.push({
          clientId: decision.clientId,
          meetingId: decision.meetingId,
          decisionId: decision.id,
          title: actionTitle,
          ownerUserId: defaultOwnerUserId,
          ownerName: defaultOwnerName,
          dueAt: getDefaultDueDate(defaultDueDays),
          priority: 'medium',
          source: 'ai_extracted',
        });
      }
    }
  }

  // If decision is approved, create a default follow-up action
  if (decision.status === 'approved' && actions.length === 0) {
    actions.push({
      clientId: decision.clientId,
      meetingId: decision.meetingId,
      decisionId: decision.id,
      title: `Follow up on: ${decision.title}`,
      description: `Ensure implementation of decision: ${decision.title}`,
      ownerUserId: defaultOwnerUserId,
      ownerName: defaultOwnerName,
      dueAt: getDefaultDueDate(defaultDueDays),
      priority: 'medium',
      source: 'decision',
    });
  }

  return actions;
}

/**
 * Get default due date (days from now)
 */
function getDefaultDueDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/**
 * Update action item status
 */
export function updateActionStatus(
  actionItem: GovernanceActionItem,
  newStatus: 'open' | 'in_progress' | 'done' | 'cancelled' | 'deferred',
  completionNotes?: string
): Partial<GovernanceActionItem> {
  const update: Partial<GovernanceActionItem> = { status: newStatus };

  if (newStatus === 'done') {
    update.completedAt = new Date().toISOString();
    if (completionNotes) {
      update.completionNotes = completionNotes;
    }
  }

  return update;
}

/**
 * Mark action as complete
 */
export function completeAction(
  actionItem: GovernanceActionItem,
  completionNotes?: string
): Partial<GovernanceActionItem> {
  return updateActionStatus(actionItem, 'done', completionNotes);
}

/**
 * Defer action item with new due date
 */
export function deferAction(
  actionItem: GovernanceActionItem,
  newDueAt: string
): Partial<GovernanceActionItem> {
  return {
    status: 'deferred',
    dueAt: newDueAt,
  };
}

/**
 * Link action item to workflow task
 */
export function linkToTask(
  actionItem: GovernanceActionItem,
  taskId: string
): Partial<GovernanceActionItem> {
  return {
    linkedTaskId: taskId,
  };
}

/**
 * Check if action is overdue
 */
export function isOverdue(actionItem: GovernanceActionItem): boolean {
  if (actionItem.status === 'done' || actionItem.status === 'cancelled') {
    return false;
  }

  const dueDate = new Date(actionItem.dueAt);
  const now = new Date();
  return dueDate < now;
}

/**
 * Check if action is due soon (within 3 days)
 */
export function isDueSoon(actionItem: GovernanceActionItem): boolean {
  if (actionItem.status === 'done' || actionItem.status === 'cancelled') {
    return false;
  }

  const dueDate = new Date(actionItem.dueAt);
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return dueDate <= threeDaysFromNow && dueDate >= now;
}

/**
 * Get actions requiring reminder
 */
export function getActionsNeedingReminder(actions: GovernanceActionItem[]): GovernanceActionItem[] {
  return actions.filter(a =>
    !a.reminderSent &&
    (isDueSoon(a) || isOverdue(a)) &&
    a.status !== 'done' &&
    a.status !== 'cancelled'
  );
}

/**
 * Get action summary for display
 */
export function getActionSummary(actionItem: GovernanceActionItem) {
  return {
    id: actionItem.id,
    title: actionItem.title,
    owner: actionItem.ownerName,
    dueAt: actionItem.dueAt,
    status: actionItem.status,
    priority: actionItem.priority,
    isOverdue: isOverdue(actionItem),
    isDueSoon: isDueSoon(actionItem),
    hasLinkedTask: !!actionItem.linkedTaskId,
    source: actionItem.source,
  };
}

/**
 * Convert governance action to workflow task format
 */
export function convertToWorkflowTask(
  actionItem: GovernanceActionItem,
  clientName: string
) {
  return {
    title: actionItem.title,
    description: actionItem.description || `Governance action: ${actionItem.title}`,
    clientId: actionItem.clientId,
    clientName,
    assigneeId: actionItem.ownerUserId,
    assigneeName: actionItem.ownerName,
    dueDate: actionItem.dueAt,
    priority: actionItem.priority,
    status: 'open',
    category: 'governance',
    sourceModule: 'governance',
    sourceRecordId: actionItem.id,
  };
}
