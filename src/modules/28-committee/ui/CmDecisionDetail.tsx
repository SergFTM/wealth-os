'use client';

/**
 * Committee Decision Detail Component
 */

import { useState } from 'react';
import Link from 'next/link';
import { CommitteeDecision, getLinkedRefsByType } from '../schema/committeeDecision';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CommitteeVote, formatVoteResults, calculateVoteResults } from '../schema/committeeVote';
import { CommitteeFollowUp } from '../schema/committeeFollowUp';
import { CmStatusPill } from './CmStatusPill';
import { CmFollowUpsTable } from './CmFollowUpsTable';
import { CM_DECISION_RESULT } from '../config';

interface CmDecisionDetailProps {
  decision: CommitteeDecision;
  meeting: CommitteeMeeting;
  linkedVote?: CommitteeVote;
  followUps: CommitteeFollowUp[];
  onCreateTask?: () => void;
  onMarkDone?: () => void;
  lang?: 'ru' | 'en' | 'uk';
}

type TabKey = 'summary' | 'votes' | 'execution' | 'artifacts' | 'audit';

const labels = {
  ru: {
    tabs: {
      summary: 'Сводка',
      votes: 'Голосование',
      execution: 'Исполнение',
      artifacts: 'Артефакты',
      audit: 'Аудит',
    },
    meeting: 'Заседание',
    result: 'Результат',
    effective: 'Вступает в силу',
    expires: 'Истекает',
    owner: 'Ответственный за исполнение',
    status: 'Статус исполнения',
    rationale: 'Обоснование',
    aiAssisted: 'AI ассистент',
    confidence: 'Уверенность',
    noVote: 'Голосование не проводилось',
    noFollowUps: 'Нет задач на исполнение',
    artifacts: {
      report_pack: 'Отчетный пакет',
      document: 'Документ',
      task: 'Задача',
      comm_message: 'Сообщение',
      ips_waiver: 'IPS исключение',
    },
    noArtifacts: 'Нет связанных артефактов',
    actions: {
      createTask: 'Создать задачу',
      markDone: 'Отметить выполненным',
    },
  },
  en: {
    tabs: {
      summary: 'Summary',
      votes: 'Votes',
      execution: 'Execution',
      artifacts: 'Artifacts',
      audit: 'Audit',
    },
    meeting: 'Meeting',
    result: 'Result',
    effective: 'Effective',
    expires: 'Expires',
    owner: 'Execution Owner',
    status: 'Execution Status',
    rationale: 'Rationale',
    aiAssisted: 'AI Assisted',
    confidence: 'Confidence',
    noVote: 'No vote conducted',
    noFollowUps: 'No follow-up tasks',
    artifacts: {
      report_pack: 'Report Pack',
      document: 'Document',
      task: 'Task',
      comm_message: 'Message',
      ips_waiver: 'IPS Waiver',
    },
    noArtifacts: 'No linked artifacts',
    actions: {
      createTask: 'Create Task',
      markDone: 'Mark Done',
    },
  },
  uk: {
    tabs: {
      summary: 'Зведення',
      votes: 'Голосування',
      execution: 'Виконання',
      artifacts: 'Артефакти',
      audit: 'Аудит',
    },
    meeting: 'Засідання',
    result: 'Результат',
    effective: 'Набуває чинності',
    expires: 'Закінчується',
    owner: 'Відповідальний за виконання',
    status: 'Статус виконання',
    rationale: 'Обґрунтування',
    aiAssisted: 'AI асистент',
    confidence: 'Впевненість',
    noVote: 'Голосування не проводилося',
    noFollowUps: 'Немає задач на виконання',
    artifacts: {
      report_pack: 'Звітний пакет',
      document: 'Документ',
      task: 'Задача',
      comm_message: 'Повідомлення',
      ips_waiver: 'IPS виняток',
    },
    noArtifacts: 'Немає пов\'язаних артефактів',
    actions: {
      createTask: 'Створити задачу',
      markDone: 'Позначити виконаним',
    },
  },
};

export function CmDecisionDetail({
  decision,
  meeting,
  linkedVote,
  followUps,
  onCreateTask,
  onMarkDone,
  lang = 'ru',
}: CmDecisionDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const l = labels[lang];

  const resultConfig = CM_DECISION_RESULT[decision.result];
  const decisionFollowUps = followUps.filter(f => f.decisionId === decision.id);
  const tabs: TabKey[] = ['summary', 'votes', 'execution', 'artifacts', 'audit'];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{decision.title}</h1>
          <Link
            href={`/m/committee/meeting/${meeting.id}`}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            {l.meeting}: {meeting.title}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <CmStatusPill status={decision.result} type="result" lang={lang} />
          <CmStatusPill status={decision.status} type="decision" lang={lang} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {decision.result === 'approved' && decision.status !== 'done' && onCreateTask && (
          <button
            onClick={onCreateTask}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {l.actions.createTask}
          </button>
        )}
        {decision.status === 'in_progress' && onMarkDone && (
          <button
            onClick={onMarkDone}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            {l.actions.markDone}
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
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Decision Text */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">{l.result}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-lg font-medium ${
                    decision.result === 'approved' ? 'text-emerald-600' :
                    decision.result === 'rejected' ? 'text-red-600' :
                    'text-amber-600'
                  }`}
                >
                  {resultConfig.label[lang]}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{decision.decisionText}</p>
            </div>

            {/* Rationale */}
            {decision.rationale && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">{l.rationale}</h3>
                <p className="text-gray-600">{decision.rationale}</p>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-500">{l.effective}</span>
                <p className="font-medium text-gray-900">{formatDate(decision.effectiveAt)}</p>
              </div>
              {decision.expiresAt && (
                <div>
                  <span className="text-sm text-gray-500">{l.expires}</span>
                  <p className="font-medium text-gray-900">{formatDate(decision.expiresAt)}</p>
                </div>
              )}
              {decision.executionOwnerName && (
                <div>
                  <span className="text-sm text-gray-500">{l.owner}</span>
                  <p className="font-medium text-gray-900">{decision.executionOwnerName}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-500">{l.status}</span>
                <p className="font-medium">
                  <CmStatusPill status={decision.status} type="decision" lang={lang} size="sm" />
                </p>
              </div>
            </div>

            {/* AI Info */}
            {decision.aiAssisted && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🤖 {l.aiAssisted}</span>
                  {decision.confidencePct && (
                    <span className="text-sm text-blue-700">
                      {l.confidence}: {decision.confidencePct}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'votes' && (
          linkedVote ? (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{linkedVote.title}</h3>
              {linkedVote.results && (
                <div className="space-y-3">
                  <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-gray-100">
                    {linkedVote.results.for > 0 && (
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(linkedVote.results.for / Math.max(linkedVote.results.total, 1)) * 100}%` }}
                      />
                    )}
                    {linkedVote.results.against > 0 && (
                      <div
                        className="bg-red-500"
                        style={{ width: `${(linkedVote.results.against / Math.max(linkedVote.results.total, 1)) * 100}%` }}
                      />
                    )}
                    {linkedVote.results.abstain > 0 && (
                      <div
                        className="bg-gray-400"
                        style={{ width: `${(linkedVote.results.abstain / Math.max(linkedVote.results.total, 1)) * 100}%` }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatVoteResults(linkedVote.results, lang)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{l.noVote}</div>
          )
        )}

        {activeTab === 'execution' && (
          decisionFollowUps.length > 0 ? (
            <CmFollowUpsTable followUps={decisionFollowUps} decisions={[decision]} lang={lang} />
          ) : (
            <div className="text-center py-8 text-gray-500">{l.noFollowUps}</div>
          )
        )}

        {activeTab === 'artifacts' && (
          decision.linkedRefs.length > 0 ? (
            <ul className="space-y-2">
              {decision.linkedRefs.map((ref, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">
                      {l.artifacts[ref.type as keyof typeof l.artifacts] || ref.type}
                    </span>
                    <p className="font-medium text-gray-900">{ref.title}</p>
                  </div>
                  <Link
                    href={`#${ref.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {lang === 'ru' ? 'Открыть' : 'Open'}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">{l.noArtifacts}</div>
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
