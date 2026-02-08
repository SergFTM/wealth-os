"use client";

import { Button } from '@/components/ui/Button';
import { CalStatusPill } from './CalStatusPill';
import { cn } from '@/lib/utils';

interface MeetingNote {
  id: string;
  eventId: string;
  authorUserId: string;
  authorName?: string;
  bodyMdRu?: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  status: 'draft' | 'published';
  clientSafePublished: boolean;
  aiMetaJson?: {
    generatedAt: string;
    confidence: number;
    assumptions: string[];
    sources: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface CalNotesPanelProps {
  notes: MeetingNote[];
  locale?: 'ru' | 'en' | 'uk';
  onAddNote?: () => void;
  onNoteClick?: (note: MeetingNote) => void;
  onPublish?: (note: MeetingNote) => void;
  onPublishClientSafe?: (note: MeetingNote) => void;
  onSummarize?: (note: MeetingNote) => void;
  className?: string;
}

export function CalNotesPanel({
  notes,
  locale = 'ru',
  onAddNote,
  onNoteClick,
  onPublish,
  onPublishClientSafe,
  onSummarize,
  className,
}: CalNotesPanelProps) {
  const getBody = (note: MeetingNote) => {
    switch (locale) {
      case 'en':
        return note.bodyMdEn || note.bodyMdRu || '';
      case 'uk':
        return note.bodyMdUk || note.bodyMdRu || '';
      default:
        return note.bodyMdRu || '';
    }
  };

  const getPreview = (body: string, maxLength: number = 200) => {
    const text = body
      .replace(/^#+\s/gm, '')
      .replace(/\*\*/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50", className)}>
      <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Заметки</h3>
          <p className="text-xs text-stone-500">{notes.length} заметок</p>
        </div>
        {onAddNote && (
          <Button variant="secondary" size="sm" onClick={onAddNote}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить
          </Button>
        )}
      </div>

      <div className="divide-y divide-stone-100">
        {notes.length === 0 ? (
          <div className="px-4 py-8 text-center text-stone-500">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-sm">Нет заметок</p>
            {onAddNote && (
              <Button variant="secondary" size="sm" onClick={onAddNote} className="mt-3">
                Добавить заметку
              </Button>
            )}
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="px-4 py-3 hover:bg-stone-50/50 transition-colors cursor-pointer"
              onClick={() => onNoteClick?.(note)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-800">
                      {note.authorName || note.authorUserId}
                    </span>
                    <CalStatusPill status={note.status} size="sm" />
                    {note.clientSafePublished && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        Client-safe
                      </span>
                    )}
                    {note.aiMetaJson && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-2">
                    {getPreview(getBody(note))}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {new Date(note.updatedAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  {note.status === 'draft' && onPublish && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublish(note);
                      }}
                    >
                      Опубликовать
                    </Button>
                  )}
                  {note.status === 'published' && !note.clientSafePublished && onPublishClientSafe && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublishClientSafe(note);
                      }}
                    >
                      Client-safe
                    </Button>
                  )}
                  {onSummarize && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSummarize(note);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Full note view
export function CalNoteView({
  note,
  locale = 'ru',
  onEdit,
  onPublish,
  className,
}: {
  note: MeetingNote;
  locale?: 'ru' | 'en' | 'uk';
  onEdit?: () => void;
  onPublish?: () => void;
  className?: string;
}) {
  const getBody = () => {
    switch (locale) {
      case 'en':
        return note.bodyMdEn || note.bodyMdRu || '';
      case 'uk':
        return note.bodyMdUk || note.bodyMdRu || '';
      default:
        return note.bodyMdRu || '';
    }
  };

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-800">{note.authorName || note.authorUserId}</span>
          <CalStatusPill status={note.status} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          {note.status === 'draft' && onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Редактировать
            </Button>
          )}
          {note.status === 'draft' && onPublish && (
            <Button variant="primary" size="sm" onClick={onPublish}>
              Опубликовать
            </Button>
          )}
        </div>
      </div>

      <div className="prose prose-stone prose-sm max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: getBody()
              .replace(/\n/g, '<br/>')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/^- (.+)$/gm, '<li>$1</li>')
          }}
        />
      </div>

      {note.aiMetaJson && (
        <div className="mt-4 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI-сгенерировано · Уверенность: {(note.aiMetaJson.confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
}
