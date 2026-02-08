import { BaseRecord } from '@/db/storage/storage.types';

export interface PolicyAcknowledgement extends BaseRecord {
  clientId: string;
  docType: 'policy' | 'sop';
  docId: string;
  docTitle: string;
  versionId: string;
  versionLabel: string;
  subjectType: 'user' | 'role';
  subjectId: string;
  subjectName: string;
  status: 'requested' | 'acknowledged' | 'overdue';
  dueAt: string;
  acknowledgedAt?: string;
  evidenceJson?: {
    ipAddress?: string;
    userAgent?: string;
    signature?: string;
  };
  comment?: string;
  reminderSentAt?: string;
  reminderCount: number;
}

export interface RequestAckInput {
  clientId: string;
  docType: 'policy' | 'sop';
  docId: string;
  docTitle: string;
  versionId: string;
  versionLabel: string;
  subjectType: 'user' | 'role';
  subjectId: string;
  subjectName: string;
  dueAt: string;
}

export interface AcknowledgeInput {
  ipAddress?: string;
  userAgent?: string;
  signature?: string;
  comment?: string;
}

export function createAcknowledgementRequest(input: RequestAckInput): Omit<PolicyAcknowledgement, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: input.clientId,
    docType: input.docType,
    docId: input.docId,
    docTitle: input.docTitle,
    versionId: input.versionId,
    versionLabel: input.versionLabel,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    subjectName: input.subjectName,
    status: 'requested',
    dueAt: input.dueAt,
    reminderCount: 0,
  };
}

export function acknowledge(
  ack: PolicyAcknowledgement,
  input: AcknowledgeInput
): Partial<PolicyAcknowledgement> {
  if (ack.status === 'acknowledged') {
    throw new Error('Already acknowledged');
  }

  return {
    status: 'acknowledged',
    acknowledgedAt: new Date().toISOString(),
    evidenceJson: {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      signature: input.signature,
    },
    comment: input.comment,
  };
}

export function markOverdue(ack: PolicyAcknowledgement): Partial<PolicyAcknowledgement> | null {
  if (ack.status === 'acknowledged') {
    return null;
  }

  const now = new Date();
  const due = new Date(ack.dueAt);

  if (now > due && ack.status !== 'overdue') {
    return { status: 'overdue' };
  }

  return null;
}

export function recordReminderSent(ack: PolicyAcknowledgement): Partial<PolicyAcknowledgement> {
  return {
    reminderSentAt: new Date().toISOString(),
    reminderCount: ack.reminderCount + 1,
  };
}

export function canSendReminder(ack: PolicyAcknowledgement, minHoursBetween: number = 24): boolean {
  if (ack.status === 'acknowledged') {
    return false;
  }

  if (!ack.reminderSentAt) {
    return true;
  }

  const lastReminder = new Date(ack.reminderSentAt);
  const now = new Date();
  const hoursSince = (now.getTime() - lastReminder.getTime()) / (1000 * 60 * 60);

  return hoursSince >= minHoursBetween;
}

export function isOverdue(ack: PolicyAcknowledgement): boolean {
  if (ack.status === 'acknowledged') {
    return false;
  }

  const now = new Date();
  const due = new Date(ack.dueAt);
  return now > due;
}

export function getDaysUntilDue(ack: PolicyAcknowledgement): number {
  const now = new Date();
  const due = new Date(ack.dueAt);
  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getAckSummary(ack: PolicyAcknowledgement): {
  id: string;
  docTitle: string;
  versionLabel: string;
  subjectName: string;
  status: string;
  dueAt: string;
  daysUntilDue: number;
} {
  return {
    id: ack.id,
    docTitle: ack.docTitle,
    versionLabel: ack.versionLabel,
    subjectName: ack.subjectName,
    status: ack.status,
    dueAt: ack.dueAt,
    daysUntilDue: getDaysUntilDue(ack),
  };
}

export function filterOverdueAcks(acks: PolicyAcknowledgement[]): PolicyAcknowledgement[] {
  return acks.filter(ack => isOverdue(ack) || ack.status === 'overdue');
}

export function filterPendingAcks(acks: PolicyAcknowledgement[]): PolicyAcknowledgement[] {
  return acks.filter(ack => ack.status === 'requested' && !isOverdue(ack));
}

export function groupAcksByDoc(acks: PolicyAcknowledgement[]): Map<string, PolicyAcknowledgement[]> {
  const grouped = new Map<string, PolicyAcknowledgement[]>();

  for (const ack of acks) {
    const key = `${ack.docType}:${ack.docId}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(ack);
  }

  return grouped;
}
