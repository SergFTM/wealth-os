/**
 * Client-Safe Mapper
 * Publishes client-safe cards, hides internal notes
 */

export interface ClientSafeCard {
  id: string;
  householdId: string;
  householdName: string;
  summary: string;
  publishedAt: string;
  keyContacts: Array<{
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }>;
  recentUpdates: Array<{
    date: string;
    summary: string;
  }>;
  upcomingMeetings: Array<{
    date: string;
    title: string;
  }>;
}

export interface RelHousehold {
  id: string;
  clientId: string;
  name: string;
  tierKey: string;
  primaryRmUserId: string;
  membersMdmIdsJson: string[];
  notesInternal?: string;
  clientSafeSummary?: string;
  clientSafePublished: boolean;
  publishedAt?: string;
}

export interface MdmPerson {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roleKey?: string;
}

export interface RelInteraction {
  id: string;
  occurredAt: string;
  summary: string;
  notesInternal?: string;
  clientSafeSnippet?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
}

export async function publishClientSafeCard(
  householdId: string,
  summary: string,
  apiBase: string = '/api/collections'
): Promise<RelHousehold> {
  const now = new Date().toISOString();

  const res = await fetch(`${apiBase}/relHouseholds/${householdId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientSafeSummary: summary,
      clientSafePublished: true,
      publishedAt: now,
    }),
  });

  if (!res.ok) throw new Error('Failed to publish client-safe card');
  return res.json();
}

export async function unpublishClientSafeCard(
  householdId: string,
  apiBase: string = '/api/collections'
): Promise<RelHousehold> {
  const res = await fetch(`${apiBase}/relHouseholds/${householdId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientSafePublished: false,
    }),
  });

  if (!res.ok) throw new Error('Failed to unpublish client-safe card');
  return res.json();
}

export function buildClientSafeCard(
  household: RelHousehold,
  members: MdmPerson[],
  interactions: RelInteraction[],
  upcomingEvents: CalendarEvent[]
): ClientSafeCard {
  // Filter interactions to only those with client-safe snippets
  const safeInteractions = interactions
    .filter(i => i.clientSafeSnippet)
    .slice(0, 5)
    .map(i => ({
      date: i.occurredAt.split('T')[0],
      summary: i.clientSafeSnippet!,
    }));

  // Map members to key contacts (hide internal info)
  const keyContacts = members.map(m => ({
    name: m.name,
    role: getRoleLabel(m.roleKey || 'member'),
    email: m.email,
    phone: m.phone,
  }));

  // Map upcoming meetings
  const meetings = upcomingEvents.slice(0, 3).map(e => ({
    date: e.startAt.split('T')[0],
    title: e.title,
  }));

  return {
    id: household.id,
    householdId: household.id,
    householdName: household.name,
    summary: household.clientSafeSummary || '',
    publishedAt: household.publishedAt || new Date().toISOString(),
    keyContacts,
    recentUpdates: safeInteractions,
    upcomingMeetings: meetings,
  };
}

export function stripInternalNotes(interaction: RelInteraction): Partial<RelInteraction> {
  return {
    id: interaction.id,
    occurredAt: interaction.occurredAt,
    summary: interaction.clientSafeSnippet || interaction.summary,
  };
}

export function filterClientSafeInteractions(
  interactions: RelInteraction[]
): RelInteraction[] {
  return interactions.filter(i => i.clientSafeSnippet);
}

export function getPublishedHouseholds(households: RelHousehold[]): RelHousehold[] {
  return households.filter(h => h.clientSafePublished);
}

function getRoleLabel(roleKey: string): string {
  const labels: Record<string, string> = {
    owner: 'Владелец',
    spouse: 'Супруг(а)',
    child: 'Ребенок',
    trustee: 'Трасти',
    advisor: 'Советник',
    beneficiary: 'Бенефициар',
    member: 'Член семьи',
  };
  return labels[roleKey] || roleKey;
}

export async function syncToPortal(
  card: ClientSafeCard,
  apiBase: string = '/api/collections'
): Promise<void> {
  // Create or update portal document
  const portalDoc = {
    clientId: card.id,
    type: 'relationship_summary',
    title: `Relationship Summary: ${card.householdName}`,
    contentJson: card,
    publishedAt: new Date().toISOString(),
    status: 'published',
  };

  const res = await fetch(`${apiBase}/ptPortalDocuments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(portalDoc),
  });

  if (!res.ok) {
    console.warn('Failed to sync to portal, continuing...');
  }
}

export function generateClientSafeSummary(
  household: RelHousehold,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const templates: Record<string, string> = {
    ru: `Домохозяйство ${household.name} — ${getTierDescription(household.tierKey, 'ru')}. Ваш персональный менеджер всегда на связи для решения любых вопросов.`,
    en: `The ${household.name} household — ${getTierDescription(household.tierKey, 'en')}. Your personal relationship manager is always available to assist with any inquiries.`,
    uk: `Домогосподарство ${household.name} — ${getTierDescription(household.tierKey, 'uk')}. Ваш персональний менеджер завжди на зв'язку для вирішення будь-яких питань.`,
  };
  return templates[locale] || templates.ru;
}

function getTierDescription(tier: string, locale: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    A: {
      ru: 'приоритетное обслуживание уровня VIP',
      en: 'VIP-level priority service',
      uk: 'пріоритетне обслуговування рівня VIP',
    },
    B: {
      ru: 'расширенное обслуживание',
      en: 'enhanced service',
      uk: 'розширене обслуговування',
    },
    C: {
      ru: 'стандартное обслуживание',
      en: 'standard service',
      uk: 'стандартне обслуговування',
    },
  };
  return descriptions[tier]?.[locale] || '';
}
