"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  promptType: string;
}

interface CopilotEntryProps {
  onSubmit: (message: string, promptType?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  quickActions?: QuickAction[];
  disabled?: boolean;
}

export function CopilotEntry({
  onSubmit,
  isLoading = false,
  placeholder = "Введите запрос...",
  quickActions = [],
  disabled = false,
}: CopilotEntryProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSubmit(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    onSubmit(action.label, action.promptType);
  };

  return (
    <div className="border-t border-stone-200 bg-white p-4">
      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              disabled={isLoading || disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-full hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          rows={1}
          className="w-full px-4 py-3 pr-12 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none disabled:bg-stone-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="absolute right-2 bottom-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Disclaimer */}
      <p className="mt-2 text-xs text-stone-400 text-center">
        AI выводы информационные и требуют проверки человеком
      </p>
    </div>
  );
}
