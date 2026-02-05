"use client";

import { useRef, useEffect } from 'react';
import { EyeOff, CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  messageType: 'normal' | 'system' | 'internal_note';
  content: string;
  mentionedUsersJson: string;
  readByUsersJson: string;
  createdAt: string;
  editedAt: string | null;
}

interface CmThreadViewProps {
  messages: Message[];
  currentUserId?: string;
  isClientSafe?: boolean;
  showInternalNotes?: boolean;
  onScrollToBottom?: () => void;
}

// Mock user data lookup
const getUserName = (userId: string): string => {
  const names: Record<string, string> = {
    'user-rm-001': 'Михаил Козлов',
    'user-rm-002': 'Анна Петрова',
    'user-rm-003': 'Дмитрий Сидоров',
    'user-pm-001': 'Сергей Иванов',
    'user-pm-002': 'Елена Морозова',
    'user-legal-001': 'Ольга Волкова',
    'user-compliance-001': 'Татьяна Белова',
    'user-ops-001': 'Алексей Новиков',
    'user-tax-001': 'Ирина Соколова',
    'user-cio-001': 'Виктор Орлов',
    'system': 'Система',
  };
  return names[userId] || userId;
};

const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatTime = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

export function CmThreadView({
  messages,
  currentUserId = 'user-rm-001',
  isClientSafe = false,
  showInternalNotes = true,
}: CmThreadViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filter messages based on visibility
  const visibleMessages = showInternalNotes
    ? messages
    : messages.filter(m => m.messageType !== 'internal_note');

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';

  visibleMessages.forEach((message) => {
    const messageDate = formatDate(message.createdAt);
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({ date: messageDate, messages: [message] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* Date separator */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs font-medium text-stone-500 px-2">
              {group.date}
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {group.messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              const isSystem = message.messageType === 'system';
              const isInternalNote = message.messageType === 'internal_note';
              const senderName = getUserName(message.senderId);
              const initials = getUserInitials(senderName);

              // System messages
              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-full text-xs text-stone-600">
                      <AlertCircle className="w-3 h-3" />
                      {message.content}
                    </div>
                  </div>
                );
              }

              // Regular and internal note messages
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  {!isOwn && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-xs font-medium text-stone-600">
                      {initials}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    {/* Sender name (for others' messages) */}
                    {!isOwn && (
                      <div className="text-xs font-medium text-stone-600 mb-1 ml-1">
                        {senderName}
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        isInternalNote
                          ? 'bg-amber-100 border border-amber-200'
                          : isOwn
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {/* Internal note indicator */}
                      {isInternalNote && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium mb-1">
                          <EyeOff className="w-3 h-3" />
                          Внутренняя заметка
                        </div>
                      )}

                      {/* Message content */}
                      <p className={`text-sm whitespace-pre-wrap ${
                        isInternalNote ? 'text-amber-900' : ''
                      }`}>
                        {renderMessageContent(message.content, isOwn && !isInternalNote)}
                      </p>

                      {/* Time and status */}
                      <div className={`flex items-center gap-1 mt-1 ${
                        isOwn && !isInternalNote ? 'justify-end' : ''
                      }`}>
                        <span className={`text-xs ${
                          isInternalNote
                            ? 'text-amber-600'
                            : isOwn
                              ? 'text-emerald-200'
                              : 'text-stone-400'
                        }`}>
                          {formatTime(message.createdAt)}
                        </span>
                        {message.editedAt && (
                          <span className={`text-xs ${
                            isOwn && !isInternalNote ? 'text-emerald-200' : 'text-stone-400'
                          }`}>
                            (ред.)
                          </span>
                        )}
                        {isOwn && !isInternalNote && (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-stone-500">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-stone-300" />
            <p>Начните диалог, отправив первое сообщение</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to render message content with mentions highlighted
function renderMessageContent(content: string, isWhiteText: boolean): React.ReactNode {
  // Simple @mention highlighting
  const parts = content.split(/(@\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return (
        <span
          key={i}
          className={`font-medium ${
            isWhiteText ? 'text-emerald-200' : 'text-emerald-600'
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}
