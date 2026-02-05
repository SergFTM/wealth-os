/**
 * Minutes Renderer Engine
 * Генерация протоколов заседаний
 */

import { CommitteeMeeting, CommitteeAttendee, formatMeetingDate } from '../schema/committeeMeeting';
import { CommitteeAgendaItem, sortAgendaByOrder } from '../schema/committeeAgendaItem';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CommitteeVote, formatVoteResults, calculateVoteResults } from '../schema/committeeVote';
import { CommitteeFollowUp } from '../schema/committeeFollowUp';
import { CM_AGENDA_CATEGORY, CM_DECISION_RESULT, CM_ROLES } from '../config';

export interface MinutesData {
  meeting: CommitteeMeeting;
  agendaItems: CommitteeAgendaItem[];
  decisions: CommitteeDecision[];
  votes: CommitteeVote[];
  followUps: CommitteeFollowUp[];
}

export interface MinutesOptions {
  lang: 'ru' | 'en' | 'uk';
  clientSafe: boolean;
  includeVoteDetails: boolean;
  includeDissentNames: boolean;
  disclaimer: string;
  nextMeetingDate?: string;
}

export function renderMinutes(data: MinutesData, options: MinutesOptions): string {
  const { meeting, agendaItems, decisions, votes, followUps } = data;
  const { lang, clientSafe, includeVoteDetails, includeDissentNames, disclaimer, nextMeetingDate } = options;

  const labels = getLabels(lang);
  const lines: string[] = [];

  // Header
  lines.push(`# ${labels.title}`);
  lines.push('');
  lines.push(`## ${meeting.title}`);
  lines.push('');
  lines.push(`**${labels.date}:** ${formatMeetingDate(meeting.scheduledAt, lang)}`);
  if (meeting.location) {
    lines.push(`**${labels.location}:** ${meeting.location}`);
  }
  lines.push('');

  // Attendees
  lines.push(`## ${labels.attendees}`);
  lines.push('');
  for (const attendee of meeting.attendees) {
    if (clientSafe && attendee.role === 'observer') continue;
    const roleLabel = CM_ROLES[attendee.role]?.label[lang] || attendee.role;
    const status = attendee.present ? labels.present : labels.absent;
    lines.push(`- ${attendee.name} (${roleLabel}) — ${status}`);
  }
  lines.push('');

  // Quorum
  const votingMembers = meeting.attendees.filter(a => ['chair', 'cio', 'member'].includes(a.role));
  const presentVoters = votingMembers.filter(a => a.present).length;
  const quorumStatus = presentVoters >= Math.ceil(votingMembers.length * 0.6)
    ? `✓ ${labels.quorumMet}`
    : `✗ ${labels.noQuorum}`;
  lines.push(`**${labels.quorum}:** ${presentVoters}/${votingMembers.length} — ${quorumStatus}`);
  lines.push('');

  // Agenda
  lines.push(`## ${labels.agenda}`);
  lines.push('');
  const sortedAgenda = sortAgendaByOrder(agendaItems);
  for (let i = 0; i < sortedAgenda.length; i++) {
    const item = sortedAgenda[i];
    const categoryLabel = CM_AGENDA_CATEGORY[item.categoryKey]?.label[lang] || item.categoryKey;
    lines.push(`${i + 1}. ${item.title} (${categoryLabel})`);
  }
  lines.push('');

  // Decisions
  lines.push(`## ${labels.decisions}`);
  lines.push('');
  for (const decision of decisions) {
    const resultLabel = CM_DECISION_RESULT[decision.result]?.label[lang] || decision.result;
    lines.push(`### ${decision.title}`);
    lines.push('');
    lines.push(`**${labels.result}:** ${resultLabel}`);
    lines.push('');
    lines.push(decision.decisionText);
    lines.push('');

    if (decision.rationale && !clientSafe) {
      lines.push(`**${labels.rationale}:** ${decision.rationale}`);
      lines.push('');
    }

    // Vote details
    if (includeVoteDetails && decision.voteId) {
      const vote = votes.find(v => v.id === decision.voteId);
      if (vote && vote.results) {
        lines.push(`**${labels.voting}:** ${formatVoteResults(vote.results, lang)}`);

        if (!clientSafe && includeDissentNames) {
          const againstVotes = vote.votes.filter(v => v.choice === 'against');
          if (againstVotes.length > 0) {
            lines.push(`**${labels.dissent}:** ${againstVotes.map(v => v.userName).join(', ')}`);
          }
        }
        lines.push('');
      }
    }
  }

  // Follow-ups
  if (followUps.length > 0) {
    lines.push(`## ${labels.followUps}`);
    lines.push('');
    for (const followUp of followUps) {
      const dueDate = new Date(followUp.dueAt).toLocaleDateString(
        lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US'
      );
      lines.push(`- [ ] ${followUp.title} — ${followUp.ownerName || 'TBD'}, ${labels.due}: ${dueDate}`);
    }
    lines.push('');
  }

  // Next meeting
  if (nextMeetingDate) {
    lines.push(`## ${labels.nextMeeting}`);
    lines.push('');
    lines.push(nextMeetingDate);
    lines.push('');
  }

  // Disclaimer
  lines.push('---');
  lines.push('');
  lines.push(`*${disclaimer}*`);

  return lines.join('\n');
}

export function renderMinutesClientSafe(data: MinutesData, options: Omit<MinutesOptions, 'clientSafe'>): string {
  return renderMinutes(data, { ...options, clientSafe: true, includeDissentNames: false });
}

function getLabels(lang: 'ru' | 'en' | 'uk') {
  const labels = {
    ru: {
      title: 'Протокол заседания инвестиционного комитета',
      date: 'Дата и время',
      location: 'Место',
      attendees: 'Участники',
      present: 'присутствовал',
      absent: 'отсутствовал',
      quorum: 'Кворум',
      quorumMet: 'Достигнут',
      noQuorum: 'Не достигнут',
      agenda: 'Повестка дня',
      decisions: 'Решения',
      result: 'Результат',
      rationale: 'Обоснование',
      voting: 'Голосование',
      dissent: 'Голосовали против',
      followUps: 'Задачи на исполнение',
      due: 'срок',
      nextMeeting: 'Следующее заседание',
    },
    en: {
      title: 'Investment Committee Meeting Minutes',
      date: 'Date and Time',
      location: 'Location',
      attendees: 'Attendees',
      present: 'present',
      absent: 'absent',
      quorum: 'Quorum',
      quorumMet: 'Met',
      noQuorum: 'Not met',
      agenda: 'Agenda',
      decisions: 'Decisions',
      result: 'Result',
      rationale: 'Rationale',
      voting: 'Voting',
      dissent: 'Voted against',
      followUps: 'Follow-up Tasks',
      due: 'due',
      nextMeeting: 'Next Meeting',
    },
    uk: {
      title: 'Протокол засідання інвестиційного комітету',
      date: 'Дата і час',
      location: 'Місце',
      attendees: 'Учасники',
      present: 'присутній',
      absent: 'відсутній',
      quorum: 'Кворум',
      quorumMet: 'Досягнуто',
      noQuorum: 'Не досягнуто',
      agenda: 'Порядок денний',
      decisions: 'Рішення',
      result: 'Результат',
      rationale: 'Обґрунтування',
      voting: 'Голосування',
      dissent: 'Голосували проти',
      followUps: 'Задачі на виконання',
      due: 'термін',
      nextMeeting: 'Наступне засідання',
    },
  };
  return labels[lang];
}

export function exportMinutesToDocument(minutesMd: string, meeting: CommitteeMeeting): {
  title: string;
  content: string;
  category: string;
  tags: string[];
} {
  return {
    title: `Протокол ${meeting.title} - ${formatMeetingDate(meeting.scheduledAt, 'ru')}`,
    content: minutesMd,
    category: 'committee_minutes',
    tags: ['committee', 'minutes', 'protocol'],
  };
}

export function generateMinutesSummary(data: MinutesData, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const { decisions, followUps } = data;

  const labels = {
    ru: {
      summary: 'Краткая сводка',
      decisions: 'Решений принято',
      approved: 'одобрено',
      rejected: 'отклонено',
      tasks: 'Задач создано',
    },
    en: {
      summary: 'Summary',
      decisions: 'Decisions made',
      approved: 'approved',
      rejected: 'rejected',
      tasks: 'Tasks created',
    },
    uk: {
      summary: 'Короткий підсумок',
      decisions: 'Рішень прийнято',
      approved: 'схвалено',
      rejected: 'відхилено',
      tasks: 'Задач створено',
    },
  };

  const l = labels[lang];
  const approved = decisions.filter(d => d.result === 'approved').length;
  const rejected = decisions.filter(d => d.result === 'rejected').length;

  return `**${l.summary}:** ${l.decisions}: ${decisions.length} (${approved} ${l.approved}, ${rejected} ${l.rejected}). ${l.tasks}: ${followUps.length}.`;
}
