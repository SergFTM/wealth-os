"use client";

import { useApp } from '@/lib/store';

interface HelpPanelProps {
  content: string;
  onClose: () => void;
}

export function HelpPanel({ content, onClose }: HelpPanelProps) {
  const { locale } = useApp();

  const renderLine = (line: string, i: number) => {
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-lg font-bold text-stone-800 mt-0 mb-2">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-base font-semibold text-stone-700 mt-4 mb-1">{line.slice(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-sm font-medium text-stone-600 mt-3 mb-1">{line.slice(4)}</h3>;
    }
    if (line.startsWith('- **')) {
      const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/)
      if (match) {
        return (
          <p key={i} className="text-sm text-stone-600 ml-3 mb-1">
            • <strong className="text-stone-700">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}
          </p>
        );
      }
    }
    if (line.startsWith('- ')) {
      return <p key={i} className="text-sm text-stone-600 ml-3 mb-1">• {line.slice(2)}</p>;
    }
    if (line.trim()) {
      return <p key={i} className="text-sm text-stone-600 mb-1">{line}</p>;
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">
          {locale === 'ru' ? 'Справка' : 'Help'}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {content.split('\n').map((line, i) => renderLine(line, i))}
      </div>
    </div>
  );
}
