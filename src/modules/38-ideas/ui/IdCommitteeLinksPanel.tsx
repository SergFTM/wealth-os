'use client';

import { useRouter } from 'next/navigation';

type Locale = 'ru' | 'en' | 'uk';

interface CommitteeLink {
  ideaId: string;
  ideaNumber: string;
  ideaTitle: string;
  agendaItemId?: string;
  decisionId?: string;
  decisionStatus?: string;
  meetingDate?: string;
}

interface IdCommitteeLinksPanelProps {
  links: CommitteeLink[];
  locale?: Locale;
  onCreateAgendaItem?: (ideaId: string) => void;
  onAttachMemo?: (ideaId: string) => void;
  onRequestVote?: (ideaId: string) => void;
}

export function IdCommitteeLinksPanel({
  links,
  locale = 'ru',
  onCreateAgendaItem,
  onAttachMemo,
  onRequestVote,
}: IdCommitteeLinksPanelProps) {
  const router = useRouter();

  const labels = {
    ru: {
      title: 'Связь с комитетом',
      empty: 'Нет связанных идей',
      pending: 'На рассмотрении',
      approved: 'Одобрено',
      rejected: 'Отклонено',
      createAgenda: 'Создать пункт повестки',
      attachMemo: 'Прикрепить мемо',
      requestVote: 'Запросить голосование',
      nextMeeting: 'След. заседание',
    },
    en: {
      title: 'Committee Links',
      empty: 'No linked ideas',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      createAgenda: 'Create Agenda Item',
      attachMemo: 'Attach Memo',
      requestVote: 'Request Vote',
      nextMeeting: 'Next Meeting',
    },
    uk: {
      title: "Зв'язок з комітетом",
      empty: "Немає пов'язаних ідей",
      pending: 'На розгляді',
      approved: 'Схвалено',
      rejected: 'Відхилено',
      createAgenda: 'Створити пункт порядку',
      attachMemo: 'Прикріпити мемо',
      requestVote: 'Запросити голосування',
      nextMeeting: 'Наст. засідання',
    },
  };

  const t = labels[locale];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'approved':
        return t.approved;
      case 'rejected':
        return t.rejected;
      default:
        return t.pending;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(
      locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US',
      { day: '2-digit', month: 'short' }
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{t.title}</h3>
      </div>

      <div className="p-4">
        {links.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            {t.empty}
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.ideaId}
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <button
                      onClick={() => router.push(`/m/ideas/idea/${link.ideaId}`)}
                      className="font-mono text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {link.ideaNumber}
                    </button>
                    <div className="text-sm text-gray-900 mt-0.5">
                      {link.ideaTitle}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(link.decisionStatus)}`}>
                    {getStatusLabel(link.decisionStatus)}
                  </span>
                </div>

                {link.meetingDate && (
                  <div className="text-xs text-gray-500 mb-2">
                    {t.nextMeeting}: {formatDate(link.meetingDate)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {!link.agendaItemId && onCreateAgendaItem && (
                    <button
                      onClick={() => onCreateAgendaItem(link.ideaId)}
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {t.createAgenda}
                    </button>
                  )}
                  {link.agendaItemId && onAttachMemo && (
                    <button
                      onClick={() => onAttachMemo(link.ideaId)}
                      className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      {t.attachMemo}
                    </button>
                  )}
                  {link.agendaItemId && !link.decisionId && onRequestVote && (
                    <button
                      onClick={() => onRequestVote(link.ideaId)}
                      className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                    >
                      {t.requestVote}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IdCommitteeLinksPanel;
