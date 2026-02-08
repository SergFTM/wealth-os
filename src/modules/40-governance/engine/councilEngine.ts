/**
 * Council Engine - Manages governance meetings, participants, and status
 */

import { BaseRecord } from '@/db/storage/storage.types';

export interface GovernanceMeeting extends BaseRecord {
  clientId: string;
  name: string;
  meetingDateTime: string;
  locationType: 'virtual' | 'in_person' | 'hybrid';
  locationDetails?: string;
  status: 'planned' | 'in_progress' | 'closed';
  participantIdsJson: string[];
  participantRolesJson: Array<{ userId: string; role: string }>;
  quorumPct: number;
  clientSafeVisible: boolean;
  threadId?: string;
  notes?: string;
}

export interface ParticipantRole {
  userId: string;
  role: 'chair' | 'secretary' | 'member' | 'observer' | 'advisor';
  name?: string;
}

export interface MeetingCreateInput {
  clientId: string;
  name: string;
  meetingDateTime: string;
  locationType: 'virtual' | 'in_person' | 'hybrid';
  locationDetails?: string;
  participants: ParticipantRole[];
  quorumPct?: number;
  clientSafeVisible?: boolean;
}

export interface MeetingUpdateInput {
  name?: string;
  meetingDateTime?: string;
  locationType?: 'virtual' | 'in_person' | 'hybrid';
  locationDetails?: string;
  participants?: ParticipantRole[];
  quorumPct?: number;
  clientSafeVisible?: boolean;
  notes?: string;
}

/**
 * Create a new meeting record
 */
export function createMeetingData(input: MeetingCreateInput): Omit<GovernanceMeeting, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: input.clientId,
    name: input.name,
    meetingDateTime: input.meetingDateTime,
    locationType: input.locationType,
    locationDetails: input.locationDetails,
    status: 'planned',
    participantIdsJson: input.participants.map(p => p.userId),
    participantRolesJson: input.participants.map(p => ({ userId: p.userId, role: p.role })),
    quorumPct: input.quorumPct ?? 60,
    clientSafeVisible: input.clientSafeVisible ?? false,
  };
}

/**
 * Update meeting status
 */
export function updateMeetingStatus(
  meeting: GovernanceMeeting,
  newStatus: 'planned' | 'in_progress' | 'closed'
): Partial<GovernanceMeeting> {
  // Validate status transitions
  const validTransitions: Record<string, string[]> = {
    planned: ['in_progress', 'closed'],
    in_progress: ['closed'],
    closed: [], // Cannot transition from closed
  };

  if (!validTransitions[meeting.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${meeting.status} to ${newStatus}`);
  }

  return { status: newStatus };
}

/**
 * Start a meeting (transition to in_progress)
 */
export function startMeeting(meeting: GovernanceMeeting): Partial<GovernanceMeeting> {
  return updateMeetingStatus(meeting, 'in_progress');
}

/**
 * Close a meeting
 */
export function closeMeeting(meeting: GovernanceMeeting): Partial<GovernanceMeeting> {
  return updateMeetingStatus(meeting, 'closed');
}

/**
 * Add a participant to a meeting
 */
export function addParticipant(
  meeting: GovernanceMeeting,
  participant: ParticipantRole
): Partial<GovernanceMeeting> {
  if (meeting.status === 'closed') {
    throw new Error('Cannot add participants to a closed meeting');
  }

  const existingIds = meeting.participantIdsJson || [];
  const existingRoles = meeting.participantRolesJson || [];

  if (existingIds.includes(participant.userId)) {
    throw new Error('Participant already exists in meeting');
  }

  return {
    participantIdsJson: [...existingIds, participant.userId],
    participantRolesJson: [...existingRoles, { userId: participant.userId, role: participant.role }],
  };
}

/**
 * Remove a participant from a meeting
 */
export function removeParticipant(
  meeting: GovernanceMeeting,
  userId: string
): Partial<GovernanceMeeting> {
  if (meeting.status === 'closed') {
    throw new Error('Cannot remove participants from a closed meeting');
  }

  return {
    participantIdsJson: (meeting.participantIdsJson || []).filter(id => id !== userId),
    participantRolesJson: (meeting.participantRolesJson || []).filter(p => p.userId !== userId),
  };
}

/**
 * Update a participant's role
 */
export function updateParticipantRole(
  meeting: GovernanceMeeting,
  userId: string,
  newRole: string
): Partial<GovernanceMeeting> {
  if (meeting.status === 'closed') {
    throw new Error('Cannot update roles in a closed meeting');
  }

  const roles = (meeting.participantRolesJson || []).map(p =>
    p.userId === userId ? { ...p, role: newRole } : p
  );

  return { participantRolesJson: roles };
}

/**
 * Get participant count
 */
export function getParticipantCount(meeting: GovernanceMeeting): number {
  return (meeting.participantIdsJson || []).length;
}

/**
 * Get participants with voting rights (exclude observers and advisors)
 */
export function getVotingParticipants(meeting: GovernanceMeeting): ParticipantRole[] {
  const nonVotingRoles = ['observer', 'advisor'];
  return (meeting.participantRolesJson || [])
    .filter(p => !nonVotingRoles.includes(p.role)) as ParticipantRole[];
}

/**
 * Check if meeting is upcoming (within next 7 days)
 */
export function isUpcoming(meeting: GovernanceMeeting): boolean {
  if (meeting.status !== 'planned') return false;

  const meetingDate = new Date(meeting.meetingDateTime);
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return meetingDate >= now && meetingDate <= sevenDaysLater;
}

/**
 * Get meeting summary for display
 */
export function getMeetingSummary(meeting: GovernanceMeeting) {
  return {
    id: meeting.id,
    name: meeting.name,
    date: meeting.meetingDateTime,
    status: meeting.status,
    participantsCount: getParticipantCount(meeting),
    votingParticipantsCount: getVotingParticipants(meeting).length,
    quorumPct: meeting.quorumPct,
    clientSafe: meeting.clientSafeVisible,
    isUpcoming: isUpcoming(meeting),
  };
}
