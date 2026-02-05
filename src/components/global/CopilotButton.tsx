"use client";

import { Sparkles } from 'lucide-react';

interface CopilotButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function CopilotButton({ onClick, hasUnread = false }: CopilotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors"
      title="Открыть AI Copilot"
    >
      <Sparkles className="w-4 h-4" />
      <span className="hidden sm:inline">Copilot</span>
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-violet-600 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
