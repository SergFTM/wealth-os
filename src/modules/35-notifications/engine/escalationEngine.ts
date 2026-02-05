/**
 * Notification Escalation Engine
 *
 * Handles automatic escalation of unacknowledged notifications,
 * SLA tracking, and multi-level escalation chains.
 */

export interface Notification {
  id: string;
  clientId: string;
  userId: string;
  title: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'snoozed' | 'archived';
  readAt?: string | null;
  deliveredAt?: string | null;
  ruleId?: string | null;
  escalationId?: string | null;
  createdAt: string;
}

export interface EscalationRule {
  escalateAfterMinutes?: number | null;
  escalateTo?: string | null;
  maxLevel?: number;
  slaMinutes?: number;
}

export interface Escalation {
  id: string;
  clientId: string;
  notificationId: string;
  notificationTitle: string;
  ruleId?: string | null;
  level: number;
  escalatedFromUserId: string;
  escalatedFromName: string;
  escalatedToUserId: string;
  escalatedToName: string;
  escalatedToRole?: string | null;
  reason: 'no_response' | 'sla_breach' | 'manual' | 'threshold' | 'critical';
  reasonDetail: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'expired';
  acknowledgedAt?: string | null;
  acknowledgedByUserId?: string | null;
  acknowledgedByName?: string | null;
  resolvedAt?: string | null;
  resolvedByUserId?: string | null;
  resolvedByName?: string | null;
  resolutionNotes?: string | null;
  slaDeadline?: string | null;
  slaBreach: boolean;
  nextEscalationAt?: string | null;
  maxLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationChain {
  levels: Array<{
    level: number;
    targetUserId?: string;
    targetRole?: string;
    delayMinutes: number;
  }>;
}

export interface EscalationCheckResult {
  shouldEscalate: boolean;
  notification: Notification;
  currentLevel: number;
  nextLevel: number;
  reason: Escalation['reason'];
  reasonDetail: string;
  targetUserId?: string;
  targetRole?: string;
}

/**
 * Default escalation chain based on priority
 */
export function getDefaultEscalationChain(priority: string): EscalationChain {
  switch (priority) {
    case 'urgent':
      return {
        levels: [
          { level: 1, targetRole: 'manager', delayMinutes: 15 },
          { level: 2, targetRole: 'director', delayMinutes: 30 },
          { level: 3, targetRole: 'superadmin', delayMinutes: 60 },
        ],
      };
    case 'high':
      return {
        levels: [
          { level: 1, targetRole: 'manager', delayMinutes: 60 },
          { level: 2, targetRole: 'director', delayMinutes: 240 },
        ],
      };
    case 'normal':
      return {
        levels: [
          { level: 1, targetRole: 'manager', delayMinutes: 480 },
        ],
      };
    default:
      return { levels: [] };
  }
}

/**
 * Checks if a notification needs escalation
 */
export function checkEscalationNeeded(
  notification: Notification,
  rule: EscalationRule | null,
  currentEscalation: Escalation | null,
  now: Date = new Date()
): EscalationCheckResult | null {
  // Don't escalate if already read
  if (notification.status === 'read' || notification.readAt) {
    return null;
  }

  // Don't escalate archived or failed notifications
  if (notification.status === 'archived' || notification.status === 'failed') {
    return null;
  }

  // Get escalation chain
  const chain = getDefaultEscalationChain(notification.priority);
  if (chain.levels.length === 0 && !rule?.escalateAfterMinutes) {
    return null;
  }

  // Determine current escalation level
  const currentLevel = currentEscalation?.level || 0;
  const maxLevel = rule?.maxLevel || chain.levels.length;

  // Check if max level reached
  if (currentLevel >= maxLevel) {
    return null;
  }

  // Get delay for next escalation
  let delayMinutes: number;
  let targetUserId: string | undefined;
  let targetRole: string | undefined;

  if (currentLevel === 0 && rule?.escalateAfterMinutes) {
    // Initial escalation from rule
    delayMinutes = rule.escalateAfterMinutes;
    targetUserId = rule.escalateTo || undefined;
  } else {
    // Use chain for subsequent escalations
    const nextLevelConfig = chain.levels.find(l => l.level === currentLevel + 1);
    if (!nextLevelConfig) {
      return null;
    }
    delayMinutes = nextLevelConfig.delayMinutes;
    targetUserId = nextLevelConfig.targetUserId;
    targetRole = nextLevelConfig.targetRole;
  }

  // Calculate reference time
  const referenceTime = currentEscalation
    ? new Date(currentEscalation.createdAt)
    : new Date(notification.deliveredAt || notification.createdAt);

  const escalationTime = new Date(referenceTime.getTime() + delayMinutes * 60 * 1000);

  // Check if escalation time has passed
  if (now < escalationTime) {
    return null;
  }

  // Determine reason
  let reason: Escalation['reason'] = 'no_response';
  let reasonDetail = `Нет реакции в течение ${delayMinutes} минут`;

  // Check SLA breach
  if (rule?.slaMinutes) {
    const slaDeadline = new Date(
      new Date(notification.createdAt).getTime() + rule.slaMinutes * 60 * 1000
    );
    if (now > slaDeadline) {
      reason = 'sla_breach';
      reasonDetail = `SLA нарушен (${rule.slaMinutes} минут)`;
    }
  }

  return {
    shouldEscalate: true,
    notification,
    currentLevel,
    nextLevel: currentLevel + 1,
    reason,
    reasonDetail,
    targetUserId,
    targetRole,
  };
}

/**
 * Creates an escalation record
 */
export function createEscalation(
  checkResult: EscalationCheckResult,
  fromUser: { id: string; name: string },
  toUser: { id: string; name: string },
  rule?: EscalationRule | null
): Omit<Escalation, 'id' | 'createdAt' | 'updatedAt'> {
  const now = new Date().toISOString();
  const chain = getDefaultEscalationChain(checkResult.notification.priority);
  const maxLevel = rule?.maxLevel || chain.levels.length;

  // Calculate next escalation time
  const nextLevelConfig = chain.levels.find(l => l.level === checkResult.nextLevel + 1);
  const nextEscalationAt = nextLevelConfig && checkResult.nextLevel < maxLevel
    ? new Date(Date.now() + nextLevelConfig.delayMinutes * 60 * 1000).toISOString()
    : null;

  // Calculate SLA deadline
  let slaDeadline: string | null = null;
  let slaBreach = false;
  if (rule?.slaMinutes) {
    slaDeadline = new Date(
      new Date(checkResult.notification.createdAt).getTime() + rule.slaMinutes * 60 * 1000
    ).toISOString();
    slaBreach = new Date() > new Date(slaDeadline);
  }

  return {
    clientId: checkResult.notification.clientId,
    notificationId: checkResult.notification.id,
    notificationTitle: checkResult.notification.title,
    ruleId: checkResult.notification.ruleId,
    level: checkResult.nextLevel,
    escalatedFromUserId: fromUser.id,
    escalatedFromName: fromUser.name,
    escalatedToUserId: toUser.id,
    escalatedToName: toUser.name,
    escalatedToRole: checkResult.targetRole || null,
    reason: checkResult.reason,
    reasonDetail: checkResult.reasonDetail,
    status: 'active',
    acknowledgedAt: null,
    acknowledgedByUserId: null,
    acknowledgedByName: null,
    resolvedAt: null,
    resolvedByUserId: null,
    resolvedByName: null,
    resolutionNotes: null,
    slaDeadline,
    slaBreach,
    nextEscalationAt,
    maxLevel,
  };
}

/**
 * Acknowledges an escalation
 */
export function acknowledgeEscalation(
  escalation: Escalation,
  user: { id: string; name: string }
): Partial<Escalation> {
  return {
    status: 'acknowledged',
    acknowledgedAt: new Date().toISOString(),
    acknowledgedByUserId: user.id,
    acknowledgedByName: user.name,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Resolves an escalation
 */
export function resolveEscalation(
  escalation: Escalation,
  user: { id: string; name: string },
  notes: string
): Partial<Escalation> {
  return {
    status: 'resolved',
    resolvedAt: new Date().toISOString(),
    resolvedByUserId: user.id,
    resolvedByName: user.name,
    resolutionNotes: notes,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Gets escalation statistics
 */
export function getEscalationStats(escalations: Escalation[]): {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  avgResolutionTimeMinutes: number;
  slaBreachCount: number;
  slaBreachRate: number;
} {
  const active = escalations.filter(e => e.status === 'active').length;
  const acknowledged = escalations.filter(e => e.status === 'acknowledged').length;
  const resolved = escalations.filter(e => e.status === 'resolved');

  // Calculate average resolution time
  let totalResolutionTime = 0;
  for (const esc of resolved) {
    if (esc.resolvedAt && esc.createdAt) {
      const created = new Date(esc.createdAt).getTime();
      const resolvedAt = new Date(esc.resolvedAt).getTime();
      totalResolutionTime += (resolvedAt - created) / (60 * 1000);
    }
  }
  const avgResolutionTimeMinutes = resolved.length > 0
    ? totalResolutionTime / resolved.length
    : 0;

  const slaBreachCount = escalations.filter(e => e.slaBreach).length;
  const slaBreachRate = escalations.length > 0
    ? slaBreachCount / escalations.length
    : 0;

  return {
    total: escalations.length,
    active,
    acknowledged,
    resolved: resolved.length,
    avgResolutionTimeMinutes,
    slaBreachCount,
    slaBreachRate,
  };
}
