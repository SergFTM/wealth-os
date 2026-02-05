'use client';

/**
 * Committee Meeting Detail Component
 */

import { useState } from 'react';
import Link from 'next/link';
import { CommitteeMeeting, formatMeetingDate, getPresentAttendees } from '../schema/committeeMeeting';
import { CommitteeAgendaItem } from '../schema/committeeAgendaItem';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CommitteeVote } from '../schema/committeeVote';
import { CommitteeFollowUp } from '../schema/committeeFollowUp';
import { CmStatusPill, CmQuorumBadge } from './CmStatusPill';
import { CmAgendaTable } from './CmAgendaTable';
import { CmDecisionsTable } from './CmDecisionsTable';
import { CmVotesPanel } from './CmVotesPanel';
import { CmFollowUpsTable } from './CmFollowUpsTable';
import { CmMinutesView } from './CmMinutesView';
import { CM_ROLES } from '../config';

interface CmMeetingDetailProps {
  meeting: CommitteeMeeting;
  agendaItems: CommitteeAgendaItem[];
  decisions: CommitteeDecision[];
  votes: CommitteeVote[];
  followUps: CommitteeFollowUp[];
  onStartMeeting?: () => void;
  onCloseMeeting?: () => void;
  onAddAgendaItem?: () => void;
  onPublishMinutes?: (clientSafe: boolean) => void;
  onGeneratePack?: () => void;
  lang?: 'ru' | 'en' | 'uk';
}

type TabKey = 'overview' | 'agenda' | 'materials' | 'decisions' | 'votes' | 'followups' | 'minutes' | 'audit';

const labels = {
  ru: {
    tabs: {
      overview: 'Обзор',
      agenda: 'Повестка',
      materials: 'Материалы',
      decisions: 'Решения',
      votes: 'Голоса',
      followups: 'Исполнение',
      minutes: 'Протокол',
      audit: 'Аудит',
    },
    date: 'Дата',
    location: 'Место',
    scope: 'Scope',
    asOf: 'Данные на',
    attendees: 'Участники',
    present: 'Присутствуют',
    absent: 'Отсутствуют',
    quorum: 'Кворум',
    linkedPack: 'Отчетный пакет',
    noPack: 'Не привязан',
    actions: {
      start: 'Начать заседание',
      close: 'Закрыть заседание',
      addItem: 'Добавить пункт',
      generatePack: 'Сформировать пакет',
      publishMinutes: 'Опубликовать протокол',
      publishClientSafe: 'Для клиента',
    },
  },
  en: {
    tabs: {
      overview: 'Overview',
      agenda: 'Agenda',
      materials: 'Materials',
      decisions: 'Decisions',
      votes: 'Votes',
      followups: 'Follow-ups',
      minutes: 'Minutes',
      audit: 'Audit',
    },
    date: 'Date',
    location: 'Location',
    scope: 'Scope',
    asOf: 'As of',
    attendees: 'Attendees',
    present: 'Present',
    absent: 'Absent',
    quorum: 'Quorum',
    linkedPack: 'Report Pack',
    noPack: 'Not linked',
    actions: {
      start: 'Start Meeting',
      close: 'Close Meeting',
      addItem: 'Add Item',
      generatePack: 'Generate Pack',
      publishMinutes: 'Publish Minutes',
      publishClientSafe: 'Client-safe',
    },
  },
  uk: {
    tabs: {
      overview: 'Огляд',
      agenda: 'Порядок',
      materials: 'Матеріали',
      decisions: 'Рішення',
      votes: 'Голоси',
      followups: 'Виконання',
      minutes: 'Протокол',
      audit: 'Аудит',
    },
    date: 'Дата',
    location: 'Місце',
    scope: 'Scope',
    asOf: 'Дані на',
    attendees: 'Учасники',
    present: 'Присутні',
    absent: 'Відсутні',
    quorum: 'Кворум',
    linkedPack: 'Звітний пакет',
    noPack: 'Не привязаний',
    actions: {
      start: 'Почати засідання',
      close: 'Закрити засідання',
      addItem: 'Додати пункт',
      generatePack: 'Сформувати пакет',
      publishMinutes: 'Опублікувати протокол',
      publishClientSafe: 'Для клієнта',
    },
  },
};

export function CmMeetingDetail({
  meeting,
  agendaItems,
  decisions,
  votes,
  followUps,
  onStartMeeting,
  onCloseMeeting,
  onAddAgendaItem,
  onPublishMinutes,
  onGeneratePack,
  lang = 'ru',
}: CmMeetingDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const l = labels[lang];

  const meetingAgenda = agendaItems.filter(i => i.meetingId === meeting.id);
  const meetingDecisions = decisions.filter(d => d.meetingId === meeting.id);
  const meetingVotes = votes.filter(v => v.meetingId === meeting.id);
  const meetingFollowUps = followUps.filter(f => f.meetingId === meeting.id);

  const presentAttendees = getPresentAttendees(meeting.attendees);
  const votingMembers = meeting.attendees.filter(a => ['chair', 'cio', 'member'].includes(a.role));
  const presentVoters = votingMembers.filter(a => a.present).length;
  const quorumMet = presentVoters >= Math.ceil(votingMembers.length * 0.6);

  const tabs: TabKey[] = ['overview', 'agenda', 'materials', 'decisions', 'votes', 'followups', 'minutes', 'audit'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
          <p className="text-gray-500 mt-1">{formatMeetingDate(meeting.scheduledAt, lang)}</p>
        </div>
        <div className="flex items-center gap-3">
          <CmStatusPill status={meeting.status} type="meeting" lang={lang} />
          <CmStatusPill status={meeting.minutesStatus} type="minutes" lang={lang} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {meeting.status === 'scheduled' && onStartMeeting && (
          <button
            onClick={onStartMeeting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {l.actions.start}
          </button>
        )}
        {meeting.status === 'in_progress' && onCloseMeeting && (
          <button
            onClick={onCloseMeeting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700"
          >
            {l.actions.close}
          </button>
        )}
        {onAddAgendaItem && meeting.status !== 'closed' && (
          <button
            onClick={onAddAgendaItem}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {l.actions.addItem}
          </button>
        )}
        {onGeneratePack && (
          <button
            onClick={onGeneratePack}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {l.actions.generatePack}
          </button>
        )}
        {meeting.status === 'closed' && meeting.minutesStatus === 'draft' && onPublishMinutes && (
          <>
            <button
              onClick={() => onPublishMinutes(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {l.actions.publishMinutes}
            </button>
            <button
              onClick={() => onPublishMinutes(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              {l.actions.publishClientSafe}
            </button>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {l.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meeting Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{l.date}</h3>
              <p className="text-gray-600">{formatMeetingDate(meeting.scheduledAt, lang)}</p>

              {meeting.location && (
                <>
                  <h3 className="font-medium text-gray-900">{l.location}</h3>
                  <p className="text-gray-600">{meeting.location}</p>
                </>
              )}

              {meeting.asOf && (
                <>
                  <h3 className="font-medium text-gray-900">{l.asOf}</h3>
                  <p className="text-gray-600">{new Date(meeting.asOf).toLocaleDateString()}</p>
                </>
              )}

              <h3 className="font-medium text-gray-900">{l.linkedPack}</h3>
              {meeting.linkedPackId ? (
                <Link href={`/m/reports/pack/${meeting.linkedPackId}`} className="text-emerald-600 hover:text-emerald-700">
                  {meeting.linkedPackId}
                </Link>
              ) : (
                <p className="text-gray-400">{l.noPack}</p>
              )}
            </div>

            {/* Attendees */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{l.attendees}</h3>
                <CmQuorumBadge met={quorumMet} lang={lang} />
              </div>
              <div className="space-y-2">
                {meeting.attendees.map((attendee, idx) => {
                  const roleLabel = CM_ROLES[attendee.role]?.label[lang] || attendee.role;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        attendee.present ? 'bg-emerald-50' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-gray-900">{attendee.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({roleLabel})</span>
                      </div>
                      <span className={`text-sm ${attendee.present ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {attendee.present ? '✓' : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500">
                {l.present}: {presentAttendees.length} / {meeting.attendees.length}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <CmAgendaTable items={meetingAgenda} meetings={[meeting]} lang={lang} />
        )}

        {activeTab === 'materials' && (
          <div className="text-center py-8 text-gray-500">
            Материалы привязаны к пунктам повестки
          </div>
        )}

        {activeTab === 'decisions' && (
          <CmDecisionsTable decisions={meetingDecisions} meetings={[meeting]} lang={lang} />
        )}

        {activeTab === 'votes' && (
          <CmVotesPanel votes={meetingVotes} meetings={[meeting]} lang={lang} />
        )}

        {activeTab === 'followups' && (
          <CmFollowUpsTable followUps={meetingFollowUps} decisions={meetingDecisions} lang={lang} />
        )}

        {activeTab === 'minutes' && (
          <CmMinutesView
            meeting={meeting}
            agendaItems={meetingAgenda}
            decisions={meetingDecisions}
            votes={meetingVotes}
            followUps={meetingFollowUps}
            lang={lang}
          />
        )}

        {activeTab === 'audit' && (
          <div className="text-center py-8 text-gray-500">
            Аудит событий
          </div>
        )}
      </div>
    </div>
  );
}
