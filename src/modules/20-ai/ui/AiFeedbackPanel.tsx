"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';

interface AiFeedbackPanelProps {
  eventId?: string;
  initialRating?: 'up' | 'down' | null;
  initialComment?: string;
  onSubmit?: (feedback: { rating: 'up' | 'down'; comment?: string }) => void;
  compact?: boolean;
}

export function AiFeedbackPanel({
  eventId,
  initialRating = null,
  initialComment = '',
  onSubmit,
  compact = false,
}: AiFeedbackPanelProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(!!initialRating);

  const handleRating = (newRating: 'up' | 'down') => {
    setRating(newRating);
    if (newRating === 'down') {
      setShowComment(true);
    }
  };

  const handleSubmit = () => {
    if (!rating) return;

    onSubmit?.({ rating, comment: comment || undefined });
    setSubmitted(true);
    setShowComment(false);
  };

  if (submitted && !compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-stone-500">
        {rating === 'up' ? (
          <>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
            <span>Спасибо за отзыв!</span>
          </>
        ) : (
          <>
            <ThumbsDown className="w-4 h-4 text-amber-500" />
            <span>Спасибо, мы учтем это.</span>
          </>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleRating('up')}
          className={`p-1.5 rounded-lg transition-all ${
            rating === 'up'
              ? 'text-emerald-600 bg-emerald-100'
              : 'text-stone-400 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
          title="Полезно"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleRating('down')}
          className={`p-1.5 rounded-lg transition-all ${
            rating === 'down'
              ? 'text-amber-600 bg-amber-100'
              : 'text-stone-400 hover:text-amber-600 hover:bg-amber-50'
          }`}
          title="Не полезно"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-stone-600">Был ли ответ полезен?</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleRating('up')}
            className={`p-2 rounded-lg transition-all ${
              rating === 'up'
                ? 'text-emerald-600 bg-emerald-100'
                : 'text-stone-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleRating('down')}
            className={`p-2 rounded-lg transition-all ${
              rating === 'down'
                ? 'text-amber-600 bg-amber-100'
                : 'text-stone-400 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowComment(!showComment)}
            className={`p-2 rounded-lg transition-all ${
              showComment
                ? 'text-blue-600 bg-blue-100'
                : 'text-stone-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Добавить комментарий"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showComment && (
        <div className="flex items-start gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Поделитесь, что можно улучшить..."
            className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={!rating}
            className={`p-2 rounded-lg transition-all ${
              rating
                ? 'text-white bg-violet-600 hover:bg-violet-700'
                : 'text-stone-400 bg-stone-100 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}

      {rating && !showComment && (
        <button
          onClick={handleSubmit}
          className="text-sm text-violet-600 hover:text-violet-700"
        >
          Отправить отзыв
        </button>
      )}
    </div>
  );
}
