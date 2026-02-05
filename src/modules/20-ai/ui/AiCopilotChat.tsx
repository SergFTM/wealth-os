"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Shield, Bookmark, Copy, Check } from 'lucide-react';
import { AiConfidenceBadge } from './AiConfidenceBadge';
import { AiSourcesCard } from './AiSourcesCard';
import { AiFeedbackPanel } from './AiFeedbackPanel';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    module: string;
    recordType: string;
    recordId: string;
    label: string;
    value?: string | number;
  }>;
  assumptions?: string[];
  confidence?: number;
  clientSafe?: boolean;
  timestamp: Date;
}

interface AiCopilotChatProps {
  messages: Message[];
  isLoading?: boolean;
  clientSafeMode?: boolean;
  onSendMessage: (content: string) => void;
  onToggleClientSafe?: () => void;
  onSaveAsDraft?: (message: Message) => void;
  onFeedback?: (messageId: string, rating: 'up' | 'down', comment?: string) => void;
}

export function AiCopilotChat({
  messages,
  isLoading = false,
  clientSafeMode = false,
  onSendMessage,
  onToggleClientSafe,
  onSaveAsDraft,
  onFeedback,
}: AiCopilotChatProps) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Client-safe toggle */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span className="font-medium text-stone-800">AI Copilot</span>
        </div>
        <button
          onClick={onToggleClientSafe}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            clientSafeMode
              ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
              : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          Client-safe {clientSafeMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-violet-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-800 mb-2">
              Спросите AI Copilot
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Copilot поможет проанализировать данные, создать резюме, подготовить drafts и многое другое.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-stone-200'
                  : 'bg-gradient-to-br from-violet-500 to-purple-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-stone-600" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Content */}
            <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white border border-stone-200 text-stone-800'
                }`}
              >
                {message.clientSafe && message.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 mb-2">
                    <Shield className="w-3 h-3" />
                    Client-safe
                  </div>
                )}

                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {message.role === 'assistant' && message.confidence !== undefined && (
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <AiConfidenceBadge confidence={message.confidence} />
                  </div>
                )}
              </div>

              {/* Sources */}
              {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                <div className="mt-2">
                  <AiSourcesCard sources={message.sources} maxVisible={3} compact />
                </div>
              )}

              {/* Assumptions */}
              {message.role === 'assistant' && message.assumptions && message.assumptions.length > 0 && (
                <div className="mt-2 p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="text-xs font-medium text-stone-500 mb-1">Предположения:</div>
                  <ul className="text-xs text-stone-600 space-y-0.5">
                    {message.assumptions.map((assumption, idx) => (
                      <li key={idx}>• {assumption}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Копировать"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onSaveAsDraft?.(message)}
                    className="p-1.5 text-stone-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    title="Сохранить как draft"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <AiFeedbackPanel
                    eventId={message.id}
                    onSubmit={(feedback) =>
                      onFeedback?.(message.id, feedback.rating, feedback.comment)
                    }
                    compact
                  />
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-xs text-stone-400 mt-1 ${
                  message.role === 'user' ? 'text-right' : ''
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спросите Copilot..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? 'text-white bg-violet-600 hover:bg-violet-700 shadow-sm'
                : 'text-stone-400 bg-stone-100 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
