/**
 * Interaction Engine
 * Manages interaction logs: meetings, calls, messages, notes
 */

export interface RelInteraction {
  id: string;
  clientId: string;
  householdId?: string;
  participantMdmIdsJson: string[];
  interactionTypeKey: 'meeting' | 'call' | 'message' | 'note';
  occurredAt: string;
  summary: string;
  notesInternal?: string;
  followUpDueAt?: string;
  statusKey: 'open' | 'closed';
  linkedThreadId?: string;
  linkedCaseId?: string;
  linkedTaskIdsJson: string[];
  clientSafeSnippet?: string;
  createdByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInteractionParams {
  clientId: string;
  householdId?: string;
  participantMdmIds: string[];
  interactionTypeKey: RelInteraction['interactionTypeKey'];
  occurredAt: string;
  summary: string;
  notesInternal?: string;
  followUpDueAt?: string;
  linkedThreadId?: string;
  linkedCaseId?: string;
  linkedTaskIds?: string[];
  createdByUserId?: string;
}

export async function createInteraction(
  params: CreateInteractionParams,
  apiBase: string = '/api/collections'
): Promise<RelInteraction> {
  const record = {
    clientId: params.clientId,
    householdId: params.householdId || null,
    participantMdmIdsJson: params.participantMdmIds,
    interactionTypeKey: params.interactionTypeKey,
    occurredAt: params.occurredAt,
    summary: params.summary,
    notesInternal: params.notesInternal || null,
    followUpDueAt: params.followUpDueAt || null,
    statusKey: 'open',
    linkedThreadId: params.linkedThreadId || null,
    linkedCaseId: params.linkedCaseId || null,
    linkedTaskIdsJson: params.linkedTaskIds || [],
    createdByUserId: params.createdByUserId || null,
  };

  const res = await fetch(`${apiBase}/relInteractions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!res.ok) throw new Error('Failed to create interaction');
  return res.json();
}

export async function closeInteraction(
  id: string,
  apiBase: string = '/api/collections'
): Promise<RelInteraction> {
  const res = await fetch(`${apiBase}/relInteractions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statusKey: 'closed' }),
  });

  if (!res.ok) throw new Error('Failed to close interaction');
  return res.json();
}

export async function setFollowUp(
  id: string,
  followUpDueAt: string,
  apiBase: string = '/api/collections'
): Promise<RelInteraction> {
  const res = await fetch(`${apiBase}/relInteractions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followUpDueAt, statusKey: 'open' }),
  });

  if (!res.ok) throw new Error('Failed to set follow-up');
  return res.json();
}

export async function linkTask(
  interactionId: string,
  taskId: string,
  existingTaskIds: string[],
  apiBase: string = '/api/collections'
): Promise<RelInteraction> {
  const linkedTaskIdsJson = [...existingTaskIds, taskId];

  const res = await fetch(`${apiBase}/relInteractions/${interactionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkedTaskIdsJson }),
  });

  if (!res.ok) throw new Error('Failed to link task');
  return res.json();
}

export async function linkCase(
  interactionId: string,
  caseId: string,
  apiBase: string = '/api/collections'
): Promise<RelInteraction> {
  const res = await fetch(`${apiBase}/relInteractions/${interactionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkedCaseId: caseId }),
  });

  if (!res.ok) throw new Error('Failed to link case');
  return res.json();
}

export async function publishClientSafeSnippet(
  interactionId: string,
  snippet: string,
  apiBase: string = '/api/collections'
): Promise<RelInteraction> {
  const res = await fetch(`${apiBase}/relInteractions/${interactionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientSafeSnippet: snippet }),
  });

  if (!res.ok) throw new Error('Failed to publish client-safe snippet');
  return res.json();
}

export function isFollowUpOverdue(interaction: RelInteraction): boolean {
  if (!interaction.followUpDueAt || interaction.statusKey === 'closed') {
    return false;
  }
  return new Date(interaction.followUpDueAt) < new Date();
}

export function getOverdueFollowUps(interactions: RelInteraction[]): RelInteraction[] {
  return interactions.filter(isFollowUpOverdue);
}

export function getInteractionsLast7Days(interactions: RelInteraction[]): RelInteraction[] {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return interactions.filter(i => new Date(i.occurredAt) >= sevenDaysAgo);
}

export function getInteractionTypeLabel(
  typeKey: string,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const labels: Record<string, Record<string, string>> = {
    meeting: { ru: 'Встреча', en: 'Meeting', uk: 'Зустріч' },
    call: { ru: 'Звонок', en: 'Call', uk: 'Дзвінок' },
    message: { ru: 'Сообщение', en: 'Message', uk: 'Повідомлення' },
    note: { ru: 'Заметка', en: 'Note', uk: 'Нотатка' },
  };
  return labels[typeKey]?.[locale] || typeKey;
}

export function groupInteractionsByDate(
  interactions: RelInteraction[]
): Map<string, RelInteraction[]> {
  const grouped = new Map<string, RelInteraction[]>();

  for (const interaction of interactions) {
    const date = interaction.occurredAt.split('T')[0];
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(interaction);
  }

  return grouped;
}
