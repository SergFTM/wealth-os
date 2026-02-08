/**
 * Agenda Builder - Create and manage meeting agendas
 */

export interface AgendaItem {
  id: string;
  clientId: string;
  eventId: string;
  title: string;
  description?: string;
  orderIndex: number;
  status: 'planned' | 'discussed' | 'deferred';
  ownerUserId?: string;
  ownerName?: string;
  durationMinutes?: number;
  linkedDecisionId?: string;
  attachmentDocIdsJson: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgendaItemData {
  clientId: string;
  eventId: string;
  title: string;
  description?: string;
  orderIndex?: number;
  ownerUserId?: string;
  ownerName?: string;
  durationMinutes?: number;
  linkedDecisionId?: string;
}

export function createAgendaItemData(
  data: CreateAgendaItemData,
  existingItems: AgendaItem[] = []
): Omit<AgendaItem, 'id' | 'createdAt' | 'updatedAt'> {
  const maxOrder = existingItems.reduce((max, item) => Math.max(max, item.orderIndex), -1);

  return {
    clientId: data.clientId,
    eventId: data.eventId,
    title: data.title,
    description: data.description,
    orderIndex: data.orderIndex ?? maxOrder + 1,
    status: 'planned',
    ownerUserId: data.ownerUserId,
    ownerName: data.ownerName,
    durationMinutes: data.durationMinutes,
    linkedDecisionId: data.linkedDecisionId,
    attachmentDocIdsJson: [],
  };
}

export function markAgendaDiscussed(item: AgendaItem): Partial<AgendaItem> {
  return {
    status: 'discussed',
    updatedAt: new Date().toISOString(),
  };
}

export function markAgendaDeferred(item: AgendaItem): Partial<AgendaItem> {
  return {
    status: 'deferred',
    updatedAt: new Date().toISOString(),
  };
}

export function reorderAgendaItems(
  items: AgendaItem[],
  itemId: string,
  newIndex: number
): Array<{ id: string; orderIndex: number }> {
  const sorted = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  const currentIndex = sorted.findIndex(item => item.id === itemId);

  if (currentIndex === -1) return [];

  const [movedItem] = sorted.splice(currentIndex, 1);
  sorted.splice(newIndex, 0, movedItem);

  return sorted.map((item, index) => ({
    id: item.id,
    orderIndex: index,
  }));
}

export function getAgendaForEvent(items: AgendaItem[], eventId: string): AgendaItem[] {
  return items
    .filter(item => item.eventId === eventId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getTotalDuration(items: AgendaItem[]): number {
  return items.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
}

export function generateAgendaTemplate(
  meetingType: 'family' | 'committee' | 'governance' | 'advisor' | 'bank',
  clientId: string,
  eventId: string
): Array<Omit<AgendaItem, 'id' | 'createdAt' | 'updatedAt'>> {
  const templates: Record<string, Array<{ title: string; duration: number }>> = {
    family: [
      { title: 'Приветствие и обзор повестки', duration: 5 },
      { title: 'Финансовый обзор', duration: 20 },
      { title: 'Обсуждение распределений', duration: 15 },
      { title: 'Семейные вопросы', duration: 20 },
      { title: 'Следующие шаги и action items', duration: 10 },
    ],
    committee: [
      { title: 'Обзор протокола предыдущего заседания', duration: 10 },
      { title: 'Инвестиционные предложения', duration: 30 },
      { title: 'Анализ рисков', duration: 20 },
      { title: 'Голосование по решениям', duration: 15 },
      { title: 'Разное', duration: 10 },
    ],
    governance: [
      { title: 'Утверждение протокола', duration: 10 },
      { title: 'Обзор политик', duration: 25 },
      { title: 'Голосования по изменениям', duration: 20 },
      { title: 'Compliance updates', duration: 15 },
      { title: 'Следующие шаги', duration: 10 },
    ],
    advisor: [
      { title: 'Текущий статус', duration: 15 },
      { title: 'Обсуждение вопросов клиента', duration: 30 },
      { title: 'Рекомендации', duration: 20 },
      { title: 'Action items', duration: 10 },
    ],
    bank: [
      { title: 'Обзор портфеля', duration: 20 },
      { title: 'Рыночный outlook', duration: 15 },
      { title: 'Инвестиционные предложения', duration: 25 },
      { title: 'Операционные вопросы', duration: 15 },
      { title: 'Следующие шаги', duration: 10 },
    ],
  };

  const template = templates[meetingType] || templates.family;

  return template.map((item, index) => ({
    clientId,
    eventId,
    title: item.title,
    orderIndex: index,
    status: 'planned' as const,
    durationMinutes: item.duration,
    attachmentDocIdsJson: [],
  }));
}

export function formatAgendaMarkdown(items: AgendaItem[]): string {
  const sorted = [...items].sort((a, b) => a.orderIndex - b.orderIndex);

  let md = '## Повестка дня\n\n';

  sorted.forEach((item, index) => {
    const statusIcon = item.status === 'discussed' ? '✓' : item.status === 'deferred' ? '→' : '○';
    const duration = item.durationMinutes ? ` (${item.durationMinutes} мин)` : '';
    const owner = item.ownerName ? ` — ${item.ownerName}` : '';

    md += `${index + 1}. ${statusIcon} **${item.title}**${duration}${owner}\n`;
    if (item.description) {
      md += `   ${item.description}\n`;
    }
    md += '\n';
  });

  const total = getTotalDuration(sorted);
  md += `---\n*Общая продолжительность: ~${total} мин*\n`;

  return md;
}
