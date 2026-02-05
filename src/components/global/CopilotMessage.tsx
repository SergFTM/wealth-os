"use client";

import { User, Sparkles, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopilotMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: Array<{ label: string; href: string }>;
  onFeedback?: (rating: 'up' | 'down') => void;
  clientSafe?: boolean;
}

export function CopilotMessage({
  role,
  content,
  timestamp,
  confidence,
  sources,
  onFeedback,
  clientSafe,
}: CopilotMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (rating: 'up' | 'down') => {
    setFeedbackGiven(rating);
    onFeedback?.(rating);
  };

  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-stone-200' : 'bg-violet-100'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-stone-600" />
        ) : (
          <Sparkles className="w-4 h-4 text-violet-600" />
        )}
      </div>

      {/* Message */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block p-3 rounded-2xl ${
            isUser
              ? 'bg-stone-100 text-stone-800 rounded-tr-sm'
              : 'bg-violet-50 text-stone-800 rounded-tl-sm'
          }`}
        >
          {/* Client-safe badge */}
          {!isUser && clientSafe && (
            <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
              Client-safe
            </div>
          )}

          {/* Content */}
          <div className="text-sm whitespace-pre-wrap">{content}</div>

          {/* Confidence */}
          {!isUser && confidence !== undefined && (
            <div className="mt-2 pt-2 border-t border-violet-100">
              <span
                className={`text-xs font-medium ${
                  confidence >= 80
                    ? 'text-emerald-600'
                    : confidence >= 50
                      ? 'text-amber-600'
                      : 'text-red-600'
                }`}
              >
                Уверенность: {confidence}%
              </span>
            </div>
          )}

          {/* Sources */}
          {!isUser && sources && sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-violet-100">
              <div className="text-xs text-stone-500 mb-1">Источники:</div>
              <div className="flex flex-wrap gap-1">
                {sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.href}
                    className="text-xs text-violet-600 hover:text-violet-700 hover:underline"
                  >
                    {source.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
          <span className="text-xs text-stone-400">{timestamp}</span>

          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                title="Копировать"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {onFeedback && (
                <>
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`p-1 transition-colors ${
                      feedbackGiven === 'up'
                        ? 'text-emerald-600'
                        : 'text-stone-400 hover:text-emerald-600'
                    }`}
                    title="Полезно"
                    disabled={feedbackGiven !== null}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback('down')}
                    className={`p-1 transition-colors ${
                      feedbackGiven === 'down'
                        ? 'text-red-600'
                        : 'text-stone-400 hover:text-red-600'
                    }`}
                    title="Не полезно"
                    disabled={feedbackGiven !== null}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
