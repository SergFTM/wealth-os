/**
 * Initiative Engine
 * Manages initiative pipeline: idea → in_analysis → in_progress → done
 */

export interface RelInitiative {
  id: string;
  clientId: string;
  householdId: string;
  title: string;
  description?: string;
  stageKey: 'idea' | 'in_analysis' | 'in_progress' | 'done';
  ownerUserId: string;
  dueAt?: string;
  successCriteria?: string;
  linkedCaseId?: string;
  linkedTaskIdsJson: string[];
  attachmentsDocIdsJson: string[];
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInitiativeParams {
  clientId: string;
  householdId: string;
  title: string;
  description?: string;
  stageKey?: RelInitiative['stageKey'];
  ownerUserId: string;
  dueAt?: string;
  successCriteria?: string;
}

export async function createInitiative(
  params: CreateInitiativeParams,
  apiBase: string = '/api/collections'
): Promise<RelInitiative> {
  const record = {
    clientId: params.clientId,
    householdId: params.householdId,
    title: params.title,
    description: params.description || null,
    stageKey: params.stageKey || 'idea',
    ownerUserId: params.ownerUserId,
    dueAt: params.dueAt || null,
    successCriteria: params.successCriteria || null,
    linkedCaseId: null,
    linkedTaskIdsJson: [],
    attachmentsDocIdsJson: [],
  };

  const res = await fetch(`${apiBase}/relInitiatives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!res.ok) throw new Error('Failed to create initiative');
  return res.json();
}

export async function moveToStage(
  id: string,
  stageKey: RelInitiative['stageKey'],
  apiBase: string = '/api/collections'
): Promise<RelInitiative> {
  const patch: Partial<RelInitiative> = { stageKey };

  if (stageKey === 'done') {
    patch.closedAt = new Date().toISOString();
  }

  const res = await fetch(`${apiBase}/relInitiatives/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error('Failed to update initiative stage');
  return res.json();
}

export async function linkCaseToInitiative(
  initiativeId: string,
  caseId: string,
  apiBase: string = '/api/collections'
): Promise<RelInitiative> {
  const res = await fetch(`${apiBase}/relInitiatives/${initiativeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkedCaseId: caseId }),
  });

  if (!res.ok) throw new Error('Failed to link case to initiative');
  return res.json();
}

export async function linkTaskToInitiative(
  initiativeId: string,
  taskId: string,
  existingTaskIds: string[],
  apiBase: string = '/api/collections'
): Promise<RelInitiative> {
  const linkedTaskIdsJson = [...existingTaskIds, taskId];

  const res = await fetch(`${apiBase}/relInitiatives/${initiativeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkedTaskIdsJson }),
  });

  if (!res.ok) throw new Error('Failed to link task to initiative');
  return res.json();
}

export async function addAttachment(
  initiativeId: string,
  docId: string,
  existingDocIds: string[],
  apiBase: string = '/api/collections'
): Promise<RelInitiative> {
  const attachmentsDocIdsJson = [...existingDocIds, docId];

  const res = await fetch(`${apiBase}/relInitiatives/${initiativeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attachmentsDocIdsJson }),
  });

  if (!res.ok) throw new Error('Failed to add attachment');
  return res.json();
}

export function getOpenInitiatives(initiatives: RelInitiative[]): RelInitiative[] {
  return initiatives.filter(i => i.stageKey !== 'done');
}

export function getInitiativesByStage(
  initiatives: RelInitiative[]
): Map<string, RelInitiative[]> {
  const stages = ['idea', 'in_analysis', 'in_progress', 'done'];
  const grouped = new Map<string, RelInitiative[]>();

  for (const stage of stages) {
    grouped.set(stage, initiatives.filter(i => i.stageKey === stage));
  }

  return grouped;
}

export function isInitiativeOverdue(initiative: RelInitiative): boolean {
  if (!initiative.dueAt || initiative.stageKey === 'done') {
    return false;
  }
  return new Date(initiative.dueAt) < new Date();
}

export function getStageLabel(
  stageKey: string,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const labels: Record<string, Record<string, string>> = {
    idea: { ru: 'Идея', en: 'Idea', uk: 'Ідея' },
    in_analysis: { ru: 'В анализе', en: 'In Analysis', uk: 'В аналізі' },
    in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' },
    done: { ru: 'Завершено', en: 'Done', uk: 'Завершено' },
  };
  return labels[stageKey]?.[locale] || stageKey;
}

export function getStageColor(stageKey: string): string {
  const colors: Record<string, string> = {
    idea: 'gray',
    in_analysis: 'blue',
    in_progress: 'amber',
    done: 'green',
  };
  return colors[stageKey] || 'gray';
}

export function getNextStage(currentStage: string): string | null {
  const flow: Record<string, string> = {
    idea: 'in_analysis',
    in_analysis: 'in_progress',
    in_progress: 'done',
  };
  return flow[currentStage] || null;
}
