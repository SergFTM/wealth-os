'use client';

/**
 * Committee Agenda Item Detail Component
 */

import { useState } from 'react';
import Link from 'next/link';
import { CommitteeAgendaItem } from '../schema/committeeAgendaItem';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CommitteeVote } from '../schema/committeeVote';
import { CmStatusPill } from './CmStatusPill';
import { CmVotesPanel } from './CmVotesPanel';
import { CmSourcesCard } from './CmSourcesCard';
import { CM_AGENDA_CATEGORY } from '../config';

interface CmAgendaItemDetailProps {
  item: CommitteeAgendaItem;
  meeting: CommitteeMeeting;
  linkedDecision?: CommitteeDecision;
  linkedVote?: CommitteeVote;
  onAttachMaterials?: () => void;
  onSendToVote?: () => void;
  lang?: 'ru' | 'en' | 'uk';
}

type TabKey = 'proposal' | 'sources' | 'risk_ips' | 'vote' | 'decision' | 'audit';

const labels = {
  ru: {
    tabs: {
      proposal: 'Предложение',
      sources: 'Источники',
      risk_ips: 'Риски и IPS',
      vote: 'Голосование',
      decision: 'Решение',
      audit: 'Аудит',
    },
    meeting: 'Заседание',
    proposedBy: 'Предложил',
    category: 'Категория',
    status: 'Статус',
    materials: 'Материалы',
    attachments: 'Прикрепленные документы',
    noMaterials: 'Нет материалов',
    noDecision: 'Решение не принято',
    noVote: 'Голосование не проводилось',
    actions: {
      attach: 'Прикрепить материалы',
      sendToVote: 'Отправить на голосование',
      viewDoc: 'Просмотр',
    },
  },
  en: {
    tabs: {
      proposal: 'Proposal',
      sources: 'Sources',
      risk_ips: 'Risk & IPS',
      vote: 'Vote',
      decision: 'Decision',
      audit: 'Audit',
    },
    meeting: 'Meeting',
    proposedBy: 'Proposed by',
    category: 'Category',
    status: 'Status',
    materials: 'Materials',
    attachments: 'Attached documents',
    noMaterials: 'No materials',
    noDecision: 'No decision recorded',
    noVote: 'No vote conducted',
    actions: {
      attach: 'Attach Materials',
      sendToVote: 'Send to Vote',
      viewDoc: 'View',
    },
  },
  uk: {
    tabs: {
      proposal: 'Пропозиція',
      sources: 'Джерела',
      risk_ips: 'Ризики та IPS',
      vote: 'Голосування',
      decision: 'Рішення',
      audit: 'Аудит',
    },
    meeting: 'Засідання',
    proposedBy: 'Запропонував',
    category: 'Категорія',
    status: 'Статус',
    materials: 'Матеріали',
    attachments: 'Прикріплені документи',
    noMaterials: 'Немає матеріалів',
    noDecision: 'Рішення не прийнято',
    noVote: 'Голосування не проводилося',
    actions: {
      attach: 'Прикріпити матеріали',
      sendToVote: 'Відправити на голосування',
      viewDoc: 'Переглянути',
    },
  },
};

export function CmAgendaItemDetail({
  item,
  meeting,
  linkedDecision,
  linkedVote,
  onAttachMaterials,
  onSendToVote,
  lang = 'ru',
}: CmAgendaItemDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('proposal');
  const l = labels[lang];

  const categoryConfig = CM_AGENDA_CATEGORY[item.categoryKey];
  const tabs: TabKey[] = ['proposal', 'sources', 'risk_ips', 'vote', 'decision', 'audit'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{categoryConfig?.icon || '📋'}</span>
            <span className="text-sm text-gray-500">{categoryConfig?.label[lang] || item.categoryKey}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
          <Link
            href={`/m/committee/meeting/${meeting.id}`}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            {l.meeting}: {meeting.title}
          </Link>
        </div>
        <CmStatusPill status={item.status} type="agenda" lang={lang} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-gray-500">{l.proposedBy}: </span>
          <span className="text-gray-900 font-medium">{item.proposedByName || '—'}</span>
        </div>
        {item.estimatedMinutes && (
          <div>
            <span className="text-gray-500">{lang === 'ru' ? 'Время' : 'Time'}: </span>
            <span className="text-gray-900">{item.estimatedMinutes} {lang === 'ru' ? 'мин' : 'min'}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {item.materialsDocIds.length === 0 && onAttachMaterials && (
          <button
            onClick={onAttachMaterials}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            📎 {l.actions.attach}
          </button>
        )}
        {item.status === 'pending' && !item.linkedVoteId && onSendToVote && (
          <button
            onClick={onSendToVote}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            🗳️ {l.actions.sendToVote}
          </button>
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
        {activeTab === 'proposal' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">{l.tabs.proposal}</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{item.proposalText}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">{l.attachments}</h3>
              {item.materialsDocIds.length > 0 ? (
                <ul className="space-y-2">
                  {item.materialsDocIds.map((docId, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">📄 {docId}</span>
                      <Link
                        href={`/m/documents/item/${docId}`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {l.actions.viewDoc}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">{l.noMaterials}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <CmSourcesCard sources={item.sourceRefs} lang={lang} />
        )}

        {activeTab === 'risk_ips' && (
          <div className="text-center py-8 text-gray-500">
            Связанные риски и IPS нарушения
          </div>
        )}

        {activeTab === 'vote' && (
          linkedVote ? (
            <CmVotesPanel votes={[linkedVote]} meetings={[meeting]} lang={lang} />
          ) : (
            <div className="text-center py-8 text-gray-500">{l.noVote}</div>
          )
        )}

        {activeTab === 'decision' && (
          linkedDecision ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{linkedDecision.title}</h3>
                <CmStatusPill status={linkedDecision.result} type="result" lang={lang} />
              </div>
              <p className="text-gray-700">{linkedDecision.decisionText}</p>
              {linkedDecision.rationale && (
                <p className="text-sm text-gray-500">{linkedDecision.rationale}</p>
              )}
              <Link
                href={`/m/committee/decision/${linkedDecision.id}`}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                {lang === 'ru' ? 'Подробнее →' : 'Details →'}
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{l.noDecision}</div>
          )
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
