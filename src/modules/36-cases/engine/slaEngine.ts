/**
 * SLA Engine
 * Manages SLA calculations, breach detection, and escalations
 */

export interface SlaPolicy {
  id: string;
  name: string;
  appliesToType?: string | null;
  appliesToPriority?: string | null;
  responseHours?: number | null;
  resolutionHours: number;
  escalationJson?: string | null;
  businessHoursOnly?: boolean;
  businessHoursStart?: string | null;
  businessHoursEnd?: string | null;
  businessDaysJson?: string | null;
}

export interface Case {
  id: string;
  caseType: string;
  priority: string;
  status: string;
  slaPolicyId?: string | null;
  responseDueAt?: string | null;
  dueAt?: string | null;
  slaBreached?: boolean;
  escalationLevel?: number;
  createdAt: string;
}

export interface EscalationRule {
  level: number;
  hoursBeforeDue: number;
  notifyRoles: string[];
  action?: string;
}

export function findMatchingPolicy(
  caseType: string,
  priority: string,
  policies: SlaPolicy[]
): SlaPolicy | null {
  // First try exact match
  let match = policies.find(
    p => p.appliesToType === caseType && p.appliesToPriority === priority
  );
  if (match) return match;

  // Try type match with any priority
  match = policies.find(
    p => p.appliesToType === caseType && (p.appliesToPriority === 'all' || !p.appliesToPriority)
  );
  if (match) return match;

  // Try priority match with any type
  match = policies.find(
    p => (p.appliesToType === 'all' || !p.appliesToType) && p.appliesToPriority === priority
  );
  if (match) return match;

  // Fall back to default policy
  const defaultPolicy = policies.find(p =>
    (p.appliesToType === 'all' || !p.appliesToType) &&
    (p.appliesToPriority === 'all' || !p.appliesToPriority)
  );

  return defaultPolicy || null;
}

export function calculateDueDates(
  createdAt: string,
  policy: SlaPolicy
): { responseDueAt: string | null; dueAt: string } {
  const created = new Date(createdAt);

  let responseDueAt: string | null = null;
  if (policy.responseHours) {
    const responseDate = addBusinessHours(
      created,
      policy.responseHours,
      policy.businessHoursOnly || false,
      policy.businessHoursStart || '09:00',
      policy.businessHoursEnd || '18:00',
      policy.businessDaysJson ? JSON.parse(policy.businessDaysJson) : [1, 2, 3, 4, 5]
    );
    responseDueAt = responseDate.toISOString();
  }

  const dueDate = addBusinessHours(
    created,
    policy.resolutionHours,
    policy.businessHoursOnly || false,
    policy.businessHoursStart || '09:00',
    policy.businessHoursEnd || '18:00',
    policy.businessDaysJson ? JSON.parse(policy.businessDaysJson) : [1, 2, 3, 4, 5]
  );

  return {
    responseDueAt,
    dueAt: dueDate.toISOString(),
  };
}

function addBusinessHours(
  start: Date,
  hours: number,
  businessHoursOnly: boolean,
  startTime: string,
  endTime: string,
  businessDays: number[]
): Date {
  if (!businessHoursOnly) {
    return new Date(start.getTime() + hours * 60 * 60 * 1000);
  }

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const businessDayMinutes = (endH * 60 + endM) - (startH * 60 + startM);

  let remainingMinutes = hours * 60;
  const current = new Date(start);

  while (remainingMinutes > 0) {
    if (!businessDays.includes(current.getDay())) {
      current.setDate(current.getDate() + 1);
      current.setHours(startH, startM, 0, 0);
      continue;
    }

    const currentMinutes = current.getHours() * 60 + current.getMinutes();
    const dayStart = startH * 60 + startM;
    const dayEnd = endH * 60 + endM;

    if (currentMinutes < dayStart) {
      current.setHours(startH, startM, 0, 0);
    } else if (currentMinutes >= dayEnd) {
      current.setDate(current.getDate() + 1);
      current.setHours(startH, startM, 0, 0);
      continue;
    }

    const minutesLeftToday = dayEnd - Math.max(currentMinutes, dayStart);

    if (remainingMinutes <= minutesLeftToday) {
      current.setMinutes(current.getMinutes() + remainingMinutes);
      remainingMinutes = 0;
    } else {
      remainingMinutes -= minutesLeftToday;
      current.setDate(current.getDate() + 1);
      current.setHours(startH, startM, 0, 0);
    }
  }

  return current;
}

export function checkSlaBreach(caseData: Case): {
  isBreached: boolean;
  hoursOverdue: number;
  breachType: 'response' | 'resolution' | null;
} {
  const now = new Date();

  if (caseData.status === 'resolved' || caseData.status === 'closed') {
    return { isBreached: false, hoursOverdue: 0, breachType: null };
  }

  if (caseData.responseDueAt && caseData.status === 'open') {
    const responseDue = new Date(caseData.responseDueAt);
    if (now > responseDue) {
      const overdue = (now.getTime() - responseDue.getTime()) / (1000 * 60 * 60);
      return { isBreached: true, hoursOverdue: overdue, breachType: 'response' };
    }
  }

  if (caseData.dueAt) {
    const due = new Date(caseData.dueAt);
    if (now > due) {
      const overdue = (now.getTime() - due.getTime()) / (1000 * 60 * 60);
      return { isBreached: true, hoursOverdue: overdue, breachType: 'resolution' };
    }
  }

  return { isBreached: false, hoursOverdue: 0, breachType: null };
}

export function getEscalationLevel(
  caseData: Case,
  policy: SlaPolicy
): { level: number; shouldEscalate: boolean; notifyRoles: string[] } {
  if (!policy.escalationJson || !caseData.dueAt) {
    return { level: 0, shouldEscalate: false, notifyRoles: [] };
  }

  const escalationRules: EscalationRule[] = JSON.parse(policy.escalationJson);
  const now = new Date();
  const dueAt = new Date(caseData.dueAt);
  const hoursUntilDue = (dueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  const currentLevel = caseData.escalationLevel || 0;

  for (const rule of escalationRules.sort((a, b) => b.level - a.level)) {
    if (rule.level > currentLevel && hoursUntilDue <= rule.hoursBeforeDue) {
      return {
        level: rule.level,
        shouldEscalate: true,
        notifyRoles: rule.notifyRoles,
      };
    }
  }

  return { level: currentLevel, shouldEscalate: false, notifyRoles: [] };
}

export function formatTimeRemaining(dueAt: string): string {
  const now = new Date();
  const due = new Date(dueAt);
  const diffMs = due.getTime() - now.getTime();

  if (diffMs < 0) {
    const hours = Math.abs(diffMs) / (1000 * 60 * 60);
    if (hours < 1) {
      return `Просрочено на ${Math.round(hours * 60)} мин`;
    }
    return `Просрочено на ${Math.round(hours)} ч`;
  }

  const hours = diffMs / (1000 * 60 * 60);
  if (hours < 1) {
    return `${Math.round(hours * 60)} мин`;
  }
  if (hours < 24) {
    return `${Math.round(hours)} ч`;
  }
  return `${Math.round(hours / 24)} д`;
}
