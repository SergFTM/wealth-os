"use client";

import { useState, useRef } from 'react';
import { Send, Paperclip, AtSign, Eye, EyeOff, Smile, Bold, Italic, Link2, List } from 'lucide-react';

interface CmMessageComposerProps {
  threadId: string;
  isClientSafe?: boolean;
  onSend?: (message: {
    content: string;
    messageType: 'normal' | 'internal_note';
    mentionedUsers?: string[];
  }) => void;
  onAttach?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function CmMessageComposer({
  threadId,
  isClientSafe = false,
  onSend,
  onAttach,
  disabled = false,
  placeholder = 'Введите сообщение...',
}: CmMessageComposerProps) {
  const [content, setContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!content.trim() || disabled) return;

    // Extract mentioned users from @mentions
    const mentionedUsers = content.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];

    onSend?.({
      content: content.trim(),
      messageType: isInternalNote ? 'internal_note' : 'normal',
      mentionedUsers,
    });

    setContent('');
    setIsInternalNote(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertFormatting = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);

    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = selected ? start + before.length + selected.length + after.length : start + before.length;
      textarea.setSelectionRange(selected ? newPos : start + before.length, selected ? newPos : start + before.length);
    }, 0);
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${
      isInternalNote
        ? 'border-amber-300 bg-amber-50'
        : 'border-stone-200 bg-white'
    }`}>
      {/* Internal note banner */}
      {isInternalNote && (
        <div className="px-4 py-2 bg-amber-100 border-b border-amber-200">
          <div className="flex items-center gap-2 text-xs text-amber-800">
            <EyeOff className="w-3.5 h-3.5" />
            <span className="font-medium">Внутренняя заметка</span>
            <span>— не будет видна клиенту</span>
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isInternalNote ? 'Внутренняя заметка для команды...' : placeholder}
          disabled={disabled}
          rows={3}
          className={`w-full px-4 py-3 text-sm resize-none focus:outline-none ${
            isInternalNote ? 'bg-amber-50' : 'bg-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-1">
          {/* Formatting buttons */}
          <button
            onClick={() => insertFormatting('**')}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Жирный (⌘B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('_')}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Курсив (⌘I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('[', '](url)')}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Ссылка"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('\n- ')}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Список"
          >
            <List className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-stone-200 mx-1" />

          {/* Mention */}
          <button
            onClick={() => insertFormatting('@', '')}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Упомянуть"
          >
            <AtSign className="w-4 h-4" />
          </button>

          {/* Attach */}
          <button
            onClick={onAttach}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title="Прикрепить файл"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-stone-200 mx-1" />

          {/* Internal note toggle (only for client-safe threads) */}
          {isClientSafe && (
            <button
              onClick={() => setIsInternalNote(!isInternalNote)}
              className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors ${
                isInternalNote
                  ? 'text-amber-700 bg-amber-200 hover:bg-amber-300'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
              }`}
              title={isInternalNote ? 'Отправить как обычное сообщение' : 'Отправить как внутреннюю заметку'}
            >
              {isInternalNote ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {isInternalNote ? 'Внутренняя' : 'Видимое'}
            </button>
          )}
        </div>

        {/* Send button */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">⌘ + Enter</span>
          <button
            onClick={handleSend}
            disabled={!content.trim() || disabled}
            className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              content.trim() && !disabled
                ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                : 'text-stone-400 bg-stone-100 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
