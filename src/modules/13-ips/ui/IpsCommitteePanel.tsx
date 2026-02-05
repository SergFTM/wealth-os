"use client";

import { Calendar, Users, FileText, ChevronRight, Plus, CheckCircle, Clock, Send } from 'lucide-react';

interface Meeting {
  id: string;
  date: string;
  status: 'draft' | 'held' | 'published';
  agendaCount: number;
  decisionsCount: number;
}

interface IpsCommitteePanelProps {
  meetings: Meeting[];
  onOpenMeeting: (id: string) => void;
  onCreateMeeting: () => void;
  onViewAll: () => void;
}

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  held: 'Проведено',
  published: 'Опубликовано',
};

const statusColors: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-600',
  held: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  draft: <Clock className="w-3 h-3" />,
  held: <CheckCircle className="w-3 h-3" />,
  published: <Send className="w-3 h-3" />,
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export function IpsCommitteePanel({
  meetings,
  onOpenMeeting,
  onCreateMeeting,
  onViewAll,
}: IpsCommitteePanelProps) {
  const recentMeetings = meetings.slice(0, 5);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-stone-800">Инвестиционный комитет</h3>
        </div>
        <button
          onClick={onCreateMeeting}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Заседание
        </button>
      </div>

      {recentMeetings.length === 0 ? (
        <div className="p-6 text-center">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-500">Нет заседаний</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentMeetings.map((meeting) => (
            <button
              key={meeting.id}
              onClick={() => onOpenMeeting(meeting.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-800">
                    {formatDate(meeting.date)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded ${statusColors[meeting.status]}`}>
                    {statusIcons[meeting.status]}
                    {statusLabels[meeting.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                  <span>{meeting.agendaCount} пунктов</span>
                  <span>{meeting.decisionsCount} решений</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          ))}
        </div>
      )}

      {meetings.length > 5 && (
        <button
          onClick={onViewAll}
          className="w-full mt-3 pt-3 border-t border-stone-100 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center gap-1"
        >
          Все заседания
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
