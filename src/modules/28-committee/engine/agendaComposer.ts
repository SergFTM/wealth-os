/**
 * Agenda Composer Engine
 * Формирование и управление повесткой заседания
 */

import { CommitteeAgendaItem, sortAgendaByOrder } from '../schema/committeeAgendaItem';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CM_AGENDA_CATEGORY } from '../config';

export interface AgendaSummary {
  meetingId: string;
  meetingTitle: string;
  scheduledAt: string;
  totalItems: number;
  totalMinutes: number;
  byCategory: Record<string, number>;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  missingMaterialsCount: number;
}

export interface AgendaSection {
  category: string;
  categoryLabel: { ru: string; en: string; uk: string };
  items: CommitteeAgendaItem[];
  totalMinutes: number;
}

export function composeAgendaSummary(
  meeting: CommitteeMeeting,
  items: CommitteeAgendaItem[]
): AgendaSummary {
  const meetingItems = items.filter(i => i.meetingId === meeting.id);
  const byCategory: Record<string, number> = {};

  for (const item of meetingItems) {
    byCategory[item.categoryKey] = (byCategory[item.categoryKey] || 0) + 1;
  }

  return {
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    scheduledAt: meeting.scheduledAt,
    totalItems: meetingItems.length,
    totalMinutes: meetingItems.reduce((sum, i) => sum + (i.estimatedMinutes || 0), 0),
    byCategory,
    pendingCount: meetingItems.filter(i => i.status === 'pending').length,
    approvedCount: meetingItems.filter(i => i.status === 'approved').length,
    rejectedCount: meetingItems.filter(i => i.status === 'rejected').length,
    missingMaterialsCount: meetingItems.filter(i => i.materialsDocIds.length === 0).length,
  };
}

export function groupAgendaByCategory(items: CommitteeAgendaItem[]): AgendaSection[] {
  const sorted = sortAgendaByOrder(items);
  const sections: Map<string, AgendaSection> = new Map();

  for (const item of sorted) {
    const category = item.categoryKey;
    if (!sections.has(category)) {
      sections.set(category, {
        category,
        categoryLabel: CM_AGENDA_CATEGORY[category]?.label || { ru: category, en: category, uk: category },
        items: [],
        totalMinutes: 0,
      });
    }
    const section = sections.get(category)!;
    section.items.push(item);
    section.totalMinutes += item.estimatedMinutes || 0;
  }

  return Array.from(sections.values());
}

export function generateAgendaText(
  meeting: CommitteeMeeting,
  items: CommitteeAgendaItem[],
  lang: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const sorted = sortAgendaByOrder(items.filter(i => i.meetingId === meeting.id));
  const lines: string[] = [];

  const headers = {
    ru: 'Повестка заседания',
    en: 'Meeting Agenda',
    uk: 'Порядок денний засідання',
  };

  lines.push(`# ${headers[lang]}: ${meeting.title}`);
  lines.push('');
  lines.push(`**${lang === 'ru' ? 'Дата' : lang === 'uk' ? 'Дата' : 'Date'}:** ${new Date(meeting.scheduledAt).toLocaleDateString()}`);
  lines.push('');

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const categoryLabel = CM_AGENDA_CATEGORY[item.categoryKey]?.label[lang] || item.categoryKey;
    const minutes = item.estimatedMinutes ? ` (${item.estimatedMinutes} ${lang === 'ru' ? 'мин' : 'min'})` : '';
    lines.push(`${i + 1}. **${item.title}** — ${categoryLabel}${minutes}`);
    if (item.proposedByName) {
      lines.push(`   ${lang === 'ru' ? 'Докладчик' : lang === 'uk' ? 'Доповідач' : 'Presenter'}: ${item.proposedByName}`);
    }
  }

  return lines.join('\n');
}

export function reorderAgendaItems(
  items: CommitteeAgendaItem[],
  itemId: string,
  newIndex: number
): CommitteeAgendaItem[] {
  const result = [...items];
  const currentIndex = result.findIndex(i => i.id === itemId);
  if (currentIndex === -1) return result;

  const [item] = result.splice(currentIndex, 1);
  result.splice(newIndex, 0, item);

  return result.map((item, index) => ({
    ...item,
    orderIndex: index + 1,
  }));
}

export function validateAgendaReadiness(
  items: CommitteeAgendaItem[]
): { ready: boolean; issues: string[] } {
  const issues: string[] = [];

  const pendingItems = items.filter(i => i.status === 'draft');
  if (pendingItems.length > 0) {
    issues.push(`${pendingItems.length} items still in draft`);
  }

  const missingMaterials = items.filter(i => i.materialsDocIds.length === 0);
  if (missingMaterials.length > 0) {
    issues.push(`${missingMaterials.length} items missing materials`);
  }

  return {
    ready: issues.length === 0,
    issues,
  };
}
