'use client';

/**
 * Committee Minutes View Component
 */

import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CommitteeAgendaItem } from '../schema/committeeAgendaItem';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CommitteeVote } from '../schema/committeeVote';
import { CommitteeFollowUp } from '../schema/committeeFollowUp';
import { renderMinutes, MinutesData, MinutesOptions } from '../engine/minutesRenderer';
import { committeeConfig } from '../config';

interface CmMinutesViewProps {
  meeting: CommitteeMeeting;
  agendaItems: CommitteeAgendaItem[];
  decisions: CommitteeDecision[];
  votes: CommitteeVote[];
  followUps: CommitteeFollowUp[];
  clientSafe?: boolean;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    preview: 'Предпросмотр протокола',
    draft: 'Черновик',
    published: 'Опубликовано',
    clientSafe: 'Версия для клиента',
    internal: 'Внутренняя версия',
    export: 'Экспорт в документ',
    noMinutes: 'Протокол будет сформирован после закрытия заседания',
  },
  en: {
    preview: 'Minutes Preview',
    draft: 'Draft',
    published: 'Published',
    clientSafe: 'Client-safe version',
    internal: 'Internal version',
    export: 'Export to document',
    noMinutes: 'Minutes will be generated after meeting is closed',
  },
  uk: {
    preview: 'Попередній перегляд протоколу',
    draft: 'Чернетка',
    published: 'Опубліковано',
    clientSafe: 'Версія для клієнта',
    internal: 'Внутрішня версія',
    export: 'Експорт в документ',
    noMinutes: 'Протокол буде сформовано після закриття засідання',
  },
};

export function CmMinutesView({
  meeting,
  agendaItems,
  decisions,
  votes,
  followUps,
  clientSafe = false,
  lang = 'ru',
}: CmMinutesViewProps) {
  const l = labels[lang];

  if (meeting.status === 'scheduled') {
    return (
      <div className="text-center py-12 text-gray-500">
        {l.noMinutes}
      </div>
    );
  }

  const minutesData: MinutesData = {
    meeting,
    agendaItems,
    decisions,
    votes,
    followUps,
  };

  const options: MinutesOptions = {
    lang,
    clientSafe,
    includeVoteDetails: !clientSafe,
    includeDissentNames: !clientSafe,
    disclaimer: committeeConfig.disclaimer?.[lang] || '',
  };

  const minutesMd = renderMinutes(minutesData, options);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">{l.preview}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              meeting.minutesStatus === 'published'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {meeting.minutesStatus === 'published' ? l.published : l.draft}
          </span>
          {clientSafe && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {l.clientSafe}
            </span>
          )}
        </div>
        <button
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => {
            // TODO: Export to document vault
            console.log('Export minutes to document');
          }}
        >
          {l.export}
        </button>
      </div>

      {/* Minutes Content */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-auto max-h-[600px]">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
            {minutesMd}
          </pre>
        </div>
      </div>
    </div>
  );
}
