import { BaseRecord } from '@/db/storage/storage.types';

export interface PolicyLink extends BaseRecord {
  clientId: string;
  policyId?: string;
  policyTitle?: string;
  sopId?: string;
  sopTitle?: string;
  linkedType: 'case' | 'incident' | 'breach' | 'ips';
  linkedId: string;
  linkedTitle: string;
  notes?: string;
  createdByUserId?: string;
  createdByName?: string;
}

export interface CreateLinkInput {
  clientId: string;
  policyId?: string;
  policyTitle?: string;
  sopId?: string;
  sopTitle?: string;
  linkedType: 'case' | 'incident' | 'breach' | 'ips';
  linkedId: string;
  linkedTitle: string;
  notes?: string;
  createdByUserId?: string;
  createdByName?: string;
}

export function createPolicyLink(input: CreateLinkInput): Omit<PolicyLink, 'id' | 'createdAt' | 'updatedAt'> {
  if (!input.policyId && !input.sopId) {
    throw new Error('Either policyId or sopId must be provided');
  }

  return {
    clientId: input.clientId,
    policyId: input.policyId,
    policyTitle: input.policyTitle,
    sopId: input.sopId,
    sopTitle: input.sopTitle,
    linkedType: input.linkedType,
    linkedId: input.linkedId,
    linkedTitle: input.linkedTitle,
    notes: input.notes,
    createdByUserId: input.createdByUserId,
    createdByName: input.createdByName,
  };
}

export function updateLinkNotes(link: PolicyLink, notes: string): Partial<PolicyLink> {
  return { notes };
}

export function getLinkSummary(link: PolicyLink): {
  id: string;
  docTitle: string;
  docType: 'policy' | 'sop';
  linkedType: string;
  linkedTitle: string;
} {
  return {
    id: link.id,
    docTitle: link.policyTitle || link.sopTitle || 'Unknown',
    docType: link.policyId ? 'policy' : 'sop',
    linkedType: link.linkedType,
    linkedTitle: link.linkedTitle,
  };
}

export function filterLinksByPolicy(links: PolicyLink[], policyId: string): PolicyLink[] {
  return links.filter(link => link.policyId === policyId);
}

export function filterLinksBySop(links: PolicyLink[], sopId: string): PolicyLink[] {
  return links.filter(link => link.sopId === sopId);
}

export function filterLinksByType(links: PolicyLink[], linkedType: PolicyLink['linkedType']): PolicyLink[] {
  return links.filter(link => link.linkedType === linkedType);
}

export function groupLinksByType(links: PolicyLink[]): Map<string, PolicyLink[]> {
  const grouped = new Map<string, PolicyLink[]>();

  for (const link of links) {
    if (!grouped.has(link.linkedType)) {
      grouped.set(link.linkedType, []);
    }
    grouped.get(link.linkedType)!.push(link);
  }

  return grouped;
}

export function countLinksByType(links: PolicyLink[]): Record<string, number> {
  const counts: Record<string, number> = {
    case: 0,
    incident: 0,
    breach: 0,
    ips: 0,
  };

  for (const link of links) {
    counts[link.linkedType] = (counts[link.linkedType] || 0) + 1;
  }

  return counts;
}

export function hasBreachLinks(links: PolicyLink[]): boolean {
  return links.some(link => link.linkedType === 'breach');
}

export function getLinkedTypeLabel(type: PolicyLink['linkedType'], locale: string = 'ru'): string {
  const labels: Record<string, Record<string, string>> = {
    case: { ru: 'Кейс', en: 'Case', uk: 'Кейс' },
    incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
    breach: { ru: 'Нарушение', en: 'Breach', uk: 'Порушення' },
    ips: { ru: 'IPS политика', en: 'IPS Policy', uk: 'IPS політика' },
  };

  return labels[type]?.[locale] || labels[type]?.ru || type;
}
