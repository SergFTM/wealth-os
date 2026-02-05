"use client";

import { Info } from 'lucide-react';

interface AiConfidenceBadgeProps {
  confidence: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AiConfidenceBadge({
  confidence,
  showTooltip = true,
  size = 'sm',
}: AiConfidenceBadgeProps) {
  const getColorClasses = () => {
    if (confidence >= 80) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (confidence >= 50) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getDescription = () => {
    if (confidence >= 80) {
      return 'Высокая уверенность';
    } else if (confidence >= 50) {
      return 'Средняя уверенность — рекомендуется проверка';
    } else {
      return 'Низкая уверенность — требуется верификация';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div className="relative group inline-flex">
      <span
        className={`inline-flex items-center gap-1 font-medium rounded border ${getColorClasses()} ${sizeClasses[size]}`}
      >
        {confidence}%
        {showTooltip && <Info className="w-3 h-3 opacity-60" />}
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-stone-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {getDescription()}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
        </div>
      )}
    </div>
  );
}
