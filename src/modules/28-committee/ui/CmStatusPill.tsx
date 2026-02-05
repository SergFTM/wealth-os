'use client';

/**
 * Committee Status Pill Component
 * Visual indicator for meeting/agenda/decision/vote status
 */

import {
  CM_MEETING_STATUS,
  CM_MINUTES_STATUS,
  CM_AGENDA_STATUS,
  CM_DECISION_RESULT,
  CM_DECISION_STATUS,
  CM_VOTE_STATUS,
  CM_VOTE_CHOICE,
  CmMeetingStatus,
  CmMinutesStatus,
  CmAgendaStatus,
  CmDecisionResult,
  CmDecisionStatus,
  CmVoteStatus,
  CmVoteChoice,
} from '../config';

type StatusValue = CmMeetingStatus | CmMinutesStatus | CmAgendaStatus | CmDecisionResult | CmDecisionStatus | CmVoteStatus | CmVoteChoice;

interface CmStatusPillProps {
  status: StatusValue;
  type: 'meeting' | 'minutes' | 'agenda' | 'result' | 'decision' | 'vote' | 'choice';
  lang?: 'ru' | 'en' | 'uk';
  size?: 'sm' | 'md';
}

const STATUS_CONFIGS = {
  meeting: CM_MEETING_STATUS,
  minutes: CM_MINUTES_STATUS,
  agenda: CM_AGENDA_STATUS,
  result: CM_DECISION_RESULT,
  decision: CM_DECISION_STATUS,
  vote: CM_VOTE_STATUS,
  choice: CM_VOTE_CHOICE,
};

const COLOR_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-800',
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-600',
  green: 'bg-green-100 text-green-800',
};

export function CmStatusPill({ status, type, lang = 'ru', size = 'md' }: CmStatusPillProps) {
  const config = STATUS_CONFIGS[type] as Record<string, { label: { ru: string; en: string; uk: string }; color: string }>;
  const statusConfig = config[status];

  if (!statusConfig) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs px-2 py-1">
        {status}
      </span>
    );
  }

  const colorClass = COLOR_CLASSES[statusConfig.color] || COLOR_CLASSES.gray;
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClasses}`}>
      {statusConfig.label[lang]}
    </span>
  );
}

export function CmQuorumBadge({ met, lang = 'ru' }: { met: boolean; lang?: 'ru' | 'en' | 'uk' }) {
  const labels = {
    ru: { met: 'Кворум ✓', notMet: 'Нет кворума' },
    en: { met: 'Quorum ✓', notMet: 'No quorum' },
    uk: { met: 'Кворум ✓', notMet: 'Немає кворуму' },
  };

  const colorClass = met ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800';

  return (
    <span className={`inline-flex items-center rounded-full font-medium text-xs px-2 py-1 ${colorClass}`}>
      {met ? labels[lang].met : labels[lang].notMet}
    </span>
  );
}
