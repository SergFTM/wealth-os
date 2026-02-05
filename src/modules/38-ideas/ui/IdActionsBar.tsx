'use client';

import { ideasConfig } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface IdActionsBarProps {
  locale?: Locale;
  onCreateIdea: () => void;
  onCreateWatchlist: () => void;
  onAddNote: () => void;
  onGenerateMemo: () => void;
  onGenerateDemo?: () => void;
  onOpenAudit?: () => void;
}

export function IdActionsBar({
  locale = 'ru',
  onCreateIdea,
  onCreateWatchlist,
  onAddNote,
  onGenerateMemo,
  onGenerateDemo,
  onOpenAudit,
}: IdActionsBarProps) {
  const actions = ideasConfig.actions || [];

  const handleAction = (key: string) => {
    switch (key) {
      case 'createIdea':
        onCreateIdea();
        break;
      case 'createWatchlist':
        onCreateWatchlist();
        break;
      case 'addNote':
        onAddNote();
        break;
      case 'generateMemo':
        onGenerateMemo();
        break;
      case 'generateDemo':
        onGenerateDemo?.();
        break;
    }
  };

  const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-sm',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
  };

  const icons: Record<string, React.ReactNode> = {
    plus: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    list: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    'file-text': (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    sparkles: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    database: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => handleAction(action.key)}
          className={`
            inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${variantClasses[action.variant || 'secondary']}
          `}
        >
          {action.icon && icons[action.icon]}
          {action.label[locale] || action.label.ru}
        </button>
      ))}

      {onOpenAudit && (
        <button
          onClick={onOpenAudit}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 ml-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Audit
        </button>
      )}
    </div>
  );
}

export default IdActionsBar;
