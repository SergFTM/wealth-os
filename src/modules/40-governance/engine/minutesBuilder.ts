/**
 * Minutes Builder - Generates meeting minutes from meeting data
 */

import { BaseRecord } from '@/db/storage/storage.types';

export interface AttendeeRecord {
  userId: string;
  name: string;
  role: string;
  present: boolean;
}

export interface AgendaRecap {
  title: string;
  summary: string;
  outcome: string;
}

export interface DecisionRecap {
  decisionId: string;
  title: string;
  outcome: string;
}

export interface VoteRecap {
  voteId: string;
  decisionTitle: string;
  result: string;
  tally: string;
}

export interface ActionItemRecap {
  actionItemId: string;
  title: string;
  owner: string;
  dueDate: string;
}

export interface AiMeta {
  generated: boolean;
  model: string;
  confidence: number;
  assumptions: string[];
  sources: string[];
}

export interface GovernanceMinutes extends BaseRecord {
  clientId: string;
  meetingId: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  bodyMdRu: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  attendeesJson: AttendeeRecord[];
  agendaRecapJson: AgendaRecap[];
  decisionsRecapJson: DecisionRecap[];
  votesRecapJson: VoteRecap[];
  actionItemsRecapJson: ActionItemRecap[];
  clientSafePublished: boolean;
  publishedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  aiMetaJson?: AiMeta;
  exportedPdfDocId?: string;
}

export interface MinutesInput {
  clientId: string;
  meetingId: string;
  meetingName: string;
  meetingDate: string;
  location: string;
  attendees: AttendeeRecord[];
  agendaItems: AgendaRecap[];
  decisions: DecisionRecap[];
  votes: VoteRecap[];
  actionItems: ActionItemRecap[];
  additionalNotes?: string;
}

/**
 * Build minutes markdown from structured data
 */
export function buildMinutesMarkdown(input: MinutesInput, locale: 'ru' | 'en' | 'uk' = 'ru'): string {
  const i18n = {
    ru: {
      title: 'Протокол заседания',
      date: 'Дата',
      location: 'Место',
      attendees: 'Присутствовали',
      absent: 'Отсутствовали',
      role: 'Роль',
      agenda: 'Повестка дня',
      outcome: 'Результат',
      decisions: 'Принятые решения',
      decision: 'Решение',
      votes: 'Результаты голосований',
      vote: 'Голосование',
      result: 'Результат',
      tally: 'Подсчет',
      actionItems: 'Action Items',
      owner: 'Ответственный',
      dueDate: 'Срок',
      notes: 'Дополнительные заметки',
      present: 'присутствовал',
      notPresent: 'отсутствовал',
    },
    en: {
      title: 'Meeting Minutes',
      date: 'Date',
      location: 'Location',
      attendees: 'Attendees',
      absent: 'Absent',
      role: 'Role',
      agenda: 'Agenda',
      outcome: 'Outcome',
      decisions: 'Decisions Made',
      decision: 'Decision',
      votes: 'Voting Results',
      vote: 'Vote',
      result: 'Result',
      tally: 'Tally',
      actionItems: 'Action Items',
      owner: 'Owner',
      dueDate: 'Due Date',
      notes: 'Additional Notes',
      present: 'present',
      notPresent: 'absent',
    },
    uk: {
      title: 'Протокол засідання',
      date: 'Дата',
      location: 'Місце',
      attendees: 'Присутні',
      absent: 'Відсутні',
      role: 'Роль',
      agenda: 'Порядок денний',
      outcome: 'Результат',
      decisions: 'Прийняті рішення',
      decision: 'Рішення',
      votes: 'Результати голосувань',
      vote: 'Голосування',
      result: 'Результат',
      tally: 'Підрахунок',
      actionItems: 'Action Items',
      owner: 'Відповідальний',
      dueDate: 'Термін',
      notes: 'Додаткові нотатки',
      present: 'присутній',
      notPresent: 'відсутній',
    },
  };

  const t = i18n[locale];
  const lines: string[] = [];

  // Header
  lines.push(`# ${t.title}: ${input.meetingName}`);
  lines.push('');
  lines.push(`**${t.date}:** ${formatDate(input.meetingDate, locale)}`);
  lines.push(`**${t.location}:** ${input.location}`);
  lines.push('');

  // Attendees
  lines.push(`## ${t.attendees}`);
  lines.push('');
  const present = input.attendees.filter(a => a.present);
  const absent = input.attendees.filter(a => !a.present);

  if (present.length > 0) {
    present.forEach(a => {
      lines.push(`- **${a.name}** (${a.role})`);
    });
    lines.push('');
  }

  if (absent.length > 0) {
    lines.push(`### ${t.absent}`);
    absent.forEach(a => {
      lines.push(`- ${a.name} (${a.role})`);
    });
    lines.push('');
  }

  // Agenda
  if (input.agendaItems.length > 0) {
    lines.push(`## ${t.agenda}`);
    lines.push('');
    input.agendaItems.forEach((item, idx) => {
      lines.push(`### ${idx + 1}. ${item.title}`);
      if (item.summary) {
        lines.push(item.summary);
      }
      lines.push(`**${t.outcome}:** ${item.outcome}`);
      lines.push('');
    });
  }

  // Decisions
  if (input.decisions.length > 0) {
    lines.push(`## ${t.decisions}`);
    lines.push('');
    lines.push(`| ${t.decision} | ${t.outcome} |`);
    lines.push('|---|---|');
    input.decisions.forEach(d => {
      lines.push(`| ${d.title} | ${d.outcome} |`);
    });
    lines.push('');
  }

  // Votes
  if (input.votes.length > 0) {
    lines.push(`## ${t.votes}`);
    lines.push('');
    lines.push(`| ${t.vote} | ${t.result} | ${t.tally} |`);
    lines.push('|---|---|---|');
    input.votes.forEach(v => {
      lines.push(`| ${v.decisionTitle} | ${v.result} | ${v.tally} |`);
    });
    lines.push('');
  }

  // Action Items
  if (input.actionItems.length > 0) {
    lines.push(`## ${t.actionItems}`);
    lines.push('');
    lines.push(`| # | ${t.actionItems} | ${t.owner} | ${t.dueDate} |`);
    lines.push('|---|---|---|---|');
    input.actionItems.forEach((item, idx) => {
      lines.push(`| ${idx + 1} | ${item.title} | ${item.owner} | ${item.dueDate} |`);
    });
    lines.push('');
  }

  // Additional notes
  if (input.additionalNotes) {
    lines.push(`## ${t.notes}`);
    lines.push('');
    lines.push(input.additionalNotes);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format date for display
 */
function formatDate(dateStr: string, locale: 'ru' | 'en' | 'uk'): string {
  const date = new Date(dateStr);
  const localeMap = { ru: 'ru-RU', en: 'en-US', uk: 'uk-UA' };
  return date.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Create minutes data structure
 */
export function createMinutesData(
  input: MinutesInput,
  aiGenerated: boolean = false
): Omit<GovernanceMinutes, 'id' | 'createdAt' | 'updatedAt'> {
  const bodyMdRu = buildMinutesMarkdown(input, 'ru');
  const bodyMdEn = buildMinutesMarkdown(input, 'en');
  const bodyMdUk = buildMinutesMarkdown(input, 'uk');

  const aiMeta: AiMeta | undefined = aiGenerated ? {
    generated: true,
    model: 'claude-opus-4-5-20251101',
    confidence: 0.85,
    assumptions: ['Meeting data is complete', 'Attendee list is accurate'],
    sources: ['Meeting agenda', 'Decision records', 'Vote records', 'Action items'],
  } : undefined;

  return {
    clientId: input.clientId,
    meetingId: input.meetingId,
    status: 'draft',
    bodyMdRu,
    bodyMdEn,
    bodyMdUk,
    attendeesJson: input.attendees,
    agendaRecapJson: input.agendaItems,
    decisionsRecapJson: input.decisions,
    votesRecapJson: input.votes,
    actionItemsRecapJson: input.actionItems,
    clientSafePublished: false,
    aiMetaJson: aiMeta,
  };
}

/**
 * Approve minutes
 */
export function approveMinutes(minutes: GovernanceMinutes, approverUserId: string): Partial<GovernanceMinutes> {
  if (minutes.status === 'published') {
    throw new Error('Minutes are already published');
  }

  return {
    status: 'approved',
    approvedBy: approverUserId,
    approvedAt: new Date().toISOString(),
  };
}

/**
 * Publish minutes (make available to clients if client-safe)
 */
export function publishMinutes(minutes: GovernanceMinutes, clientSafe: boolean = false): Partial<GovernanceMinutes> {
  if (minutes.status !== 'approved' && minutes.status !== 'draft') {
    throw new Error('Minutes must be approved or in draft before publishing');
  }

  return {
    status: 'published',
    clientSafePublished: clientSafe,
    publishedAt: new Date().toISOString(),
  };
}

/**
 * Update minutes content
 */
export function updateMinutesContent(
  minutes: GovernanceMinutes,
  bodyMdRu: string,
  bodyMdEn?: string,
  bodyMdUk?: string
): Partial<GovernanceMinutes> {
  if (minutes.status === 'published') {
    throw new Error('Cannot edit published minutes');
  }

  return {
    bodyMdRu,
    bodyMdEn,
    bodyMdUk,
    status: 'draft', // Reset to draft if edited
    aiMetaJson: undefined, // Clear AI meta if manually edited
  };
}

/**
 * Get minutes summary for display
 */
export function getMinutesSummary(minutes: GovernanceMinutes) {
  return {
    id: minutes.id,
    meetingId: minutes.meetingId,
    status: minutes.status,
    attendeesCount: minutes.attendeesJson.length,
    decisionsCount: minutes.decisionsRecapJson.length,
    votesCount: minutes.votesRecapJson.length,
    actionItemsCount: minutes.actionItemsRecapJson.length,
    clientSafe: minutes.clientSafePublished,
    aiGenerated: minutes.aiMetaJson?.generated ?? false,
    publishedAt: minutes.publishedAt,
  };
}
