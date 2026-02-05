'use client';

/**
 * Committee Votes Panel Component
 */

import { CommitteeVote, getVoteParticipation, calculateVoteResults } from '../schema/committeeVote';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CmStatusPill, CmQuorumBadge } from './CmStatusPill';
import { CmVoteChoice } from '../config';

interface CmVotesPanelProps {
  votes: CommitteeVote[];
  meetings: CommitteeMeeting[];
  currentUserId?: string;
  onCastVote?: (voteId: string, choice: CmVoteChoice, comment?: string) => void;
  onCloseVote?: (voteId: string) => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    title: 'Голосование',
    topic: 'Тема',
    meeting: 'Заседание',
    status: 'Статус',
    quorum: 'Кворум',
    participation: 'Участие',
    results: 'Результат',
    for: 'За',
    against: 'Против',
    abstain: 'Воздержаться',
    close: 'Закрыть',
    voted: 'Вы проголосовали',
    notEligible: 'Вы не можете голосовать',
    noVotes: 'Нет голосований',
    comment: 'Комментарий',
  },
  en: {
    title: 'Voting',
    topic: 'Topic',
    meeting: 'Meeting',
    status: 'Status',
    quorum: 'Quorum',
    participation: 'Participation',
    results: 'Results',
    for: 'For',
    against: 'Against',
    abstain: 'Abstain',
    close: 'Close',
    voted: 'You have voted',
    notEligible: 'Not eligible to vote',
    noVotes: 'No votes',
    comment: 'Comment',
  },
  uk: {
    title: 'Голосування',
    topic: 'Тема',
    meeting: 'Засідання',
    status: 'Статус',
    quorum: 'Кворум',
    participation: 'Участь',
    results: 'Результат',
    for: 'За',
    against: 'Проти',
    abstain: 'Утриматися',
    close: 'Закрити',
    voted: 'Ви проголосували',
    notEligible: 'Ви не можете голосувати',
    noVotes: 'Немає голосувань',
    comment: 'Коментар',
  },
};

export function CmVotesPanel({
  votes,
  meetings,
  currentUserId,
  onCastVote,
  onCloseVote,
  lang = 'ru',
}: CmVotesPanelProps) {
  const l = labels[lang];

  const getMeetingTitle = (meetingId: string) =>
    meetings.find(m => m.id === meetingId)?.title || meetingId;

  if (votes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noVotes}</div>
    );
  }

  return (
    <div className="space-y-4">
      {votes.map(vote => {
        const participation = getVoteParticipation(vote);
        const results = vote.results || calculateVoteResults(vote);
        const hasVoted = currentUserId ? vote.votes.some(v => v.userId === currentUserId) : false;
        const canVote = currentUserId ? vote.eligibleVoterIds.includes(currentUserId) && !hasVoted && vote.status === 'open' : false;

        return (
          <div
            key={vote.id}
            className="p-4 rounded-xl border border-gray-200 bg-white space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{vote.title}</h4>
                <p className="text-sm text-gray-500">{getMeetingTitle(vote.meetingId)}</p>
              </div>
              <CmStatusPill status={vote.status} type="vote" lang={lang} />
            </div>

            {/* Description */}
            {vote.description && (
              <p className="text-sm text-gray-600">{vote.description}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{l.participation}:</span>
                <span className="font-medium">{participation}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{l.quorum}:</span>
                <CmQuorumBadge met={results.quorumMet} lang={lang} />
              </div>
            </div>

            {/* Results bar */}
            <div className="space-y-2">
              <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
                {results.for > 0 && (
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${(results.for / Math.max(results.total, 1)) * 100}%` }}
                  />
                )}
                {results.against > 0 && (
                  <div
                    className="bg-red-500"
                    style={{ width: `${(results.against / Math.max(results.total, 1)) * 100}%` }}
                  />
                )}
                {results.abstain > 0 && (
                  <div
                    className="bg-gray-400"
                    style={{ width: `${(results.abstain / Math.max(results.total, 1)) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span className="text-emerald-600">{l.for}: {results.for}</span>
                <span className="text-red-600">{l.against}: {results.against}</span>
                <span className="text-gray-500">{l.abstain}: {results.abstain}</span>
              </div>
            </div>

            {/* Actions */}
            {vote.status === 'open' && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {canVote && onCastVote ? (
                  <>
                    <button
                      onClick={() => onCastVote(vote.id, 'for')}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    >
                      {l.for}
                    </button>
                    <button
                      onClick={() => onCastVote(vote.id, 'against')}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      {l.against}
                    </button>
                    <button
                      onClick={() => onCastVote(vote.id, 'abstain')}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {l.abstain}
                    </button>
                  </>
                ) : hasVoted ? (
                  <span className="text-sm text-emerald-600">✓ {l.voted}</span>
                ) : (
                  <span className="text-sm text-gray-500">{l.notEligible}</span>
                )}

                {onCloseVote && (
                  <button
                    onClick={() => onCloseVote(vote.id)}
                    className="ml-auto px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {l.close}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
