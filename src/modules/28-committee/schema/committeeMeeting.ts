/**
 * Committee Meeting Schema
 * Заседания комитета
 */

import { CmMeetingStatus, CmMinutesStatus, CM_MEETING_STATUS, CM_MINUTES_STATUS } from '../config';

export interface CommitteeAttendee {
  userId: string;
  name: string;
  role: 'chair' | 'cio' | 'member' | 'secretary' | 'observer';
  present: boolean;
}

export interface CommitteeMeeting {
  id: string;
  clientId?: string;
  scopeType?: 'global' | 'household' | 'entity';
  scopeId?: string;
  title: string;
  scheduledAt: string;
  endedAt?: string;
  status: CmMeetingStatus;
  attendees: CommitteeAttendee[];
  asOf?: string;
  linkedPackId?: string;
  minutesStatus: CmMinutesStatus;
  minutesDocId?: string;
  minutesPublishedAt?: string;
  minutesClientSafe?: boolean;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeMeetingCreateInput {
  clientId?: string;
  scopeType?: CommitteeMeeting['scopeType'];
  scopeId?: string;
  title: string;
  scheduledAt: string;
  attendees?: CommitteeAttendee[];
  asOf?: string;
  linkedPackId?: string;
  location?: string;
  notes?: string;
}

export function getMeetingStatusConfig(status: CmMeetingStatus) {
  return CM_MEETING_STATUS[status];
}

export function getMinutesStatusConfig(status: CmMinutesStatus) {
  return CM_MINUTES_STATUS[status];
}

export function canStartMeeting(meeting: CommitteeMeeting): boolean {
  return meeting.status === 'scheduled';
}

export function canCloseMeeting(meeting: CommitteeMeeting): boolean {
  return meeting.status === 'in_progress';
}

export function canPublishMinutes(meeting: CommitteeMeeting): boolean {
  return meeting.status === 'closed' && meeting.minutesStatus === 'draft';
}

export function formatMeetingDate(scheduledAt: string, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const date = new Date(scheduledAt);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US';
  return date.toLocaleDateString(locale, options);
}

export function getAttendeesByRole(attendees: CommitteeAttendee[], role: CommitteeAttendee['role']): CommitteeAttendee[] {
  return attendees.filter(a => a.role === role);
}

export function getPresentAttendees(attendees: CommitteeAttendee[]): CommitteeAttendee[] {
  return attendees.filter(a => a.present);
}

export function getQuorumCount(attendees: CommitteeAttendee[]): number {
  const votingMembers = attendees.filter(a => ['chair', 'cio', 'member'].includes(a.role));
  return votingMembers.filter(a => a.present).length;
}
