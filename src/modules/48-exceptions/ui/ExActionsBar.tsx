'use client';

import { cn } from '@/lib/utils';

interface ExActionsBarProps {
  onCreateException: () => void;
  onRunClustering: () => void;
  onCreateRule: () => void;
  onApplyAutoRules: () => void;
  onGenerateDemo?: () => void;
  onOpenAudit?: () => void;
  isLoading?: boolean;
}

export function ExActionsBar({
  onCreateException,
  onRunClustering,
  onCreateRule,
  onApplyAutoRules,
  onGenerateDemo,
  onOpenAudit,
  isLoading
}: ExActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200">
      <button
        onClick={onCreateException}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
          'hover:from-emerald-700 hover:to-teal-700',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <PlusIcon />
        Создать исключение
      </button>

      <button
        onClick={onRunClustering}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'bg-white border border-stone-300 text-stone-700',
          'hover:bg-stone-50 hover:border-stone-400',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <LayersIcon />
        Кластеризация
      </button>

      <button
        onClick={onCreateRule}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'bg-white border border-stone-300 text-stone-700',
          'hover:bg-stone-50 hover:border-stone-400',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <SettingsIcon />
        Создать правило
      </button>

      <button
        onClick={onApplyAutoRules}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'bg-white border border-stone-300 text-stone-700',
          'hover:bg-stone-50 hover:border-stone-400',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <ZapIcon />
        Применить правила
      </button>

      <div className="flex-1" />

      {onGenerateDemo && (
        <button
          onClick={onGenerateDemo}
          disabled={isLoading}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm',
            'text-stone-500 hover:text-stone-700 hover:bg-stone-100',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <SparklesIcon />
          Демо данные
        </button>
      )}

      {onOpenAudit && (
        <button
          onClick={onOpenAudit}
          disabled={isLoading}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm',
            'text-stone-500 hover:text-stone-700 hover:bg-stone-100',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <ClipboardIcon />
          Аудит
        </button>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

export default ExActionsBar;
