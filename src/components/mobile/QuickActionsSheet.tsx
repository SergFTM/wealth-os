'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  actionType: string;
  title: string;
  description?: string;
  icon?: string;
  deepLink: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  audience: 'staff' | 'client' | 'both';
}

const i18n = {
  ru: {
    title: 'Быстрые действия',
    noActions: 'Нет активных действий',
    close: 'Закрыть',
  },
  en: {
    title: 'Quick Actions',
    noActions: 'No active actions',
    close: 'Close',
  },
  uk: {
    title: 'Швидкі дії',
    noActions: 'Немає активних дій',
    close: 'Закрити',
  },
};

const iconMap: Record<string, React.ReactNode> = {
  CheckCircle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertTriangle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  FileText: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  MessageSquare: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Clock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CreditCard: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Shield: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

interface QuickActionsSheetProps {
  actions: QuickAction[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function QuickActionsSheet({ actions, isOpen, onClose, className }: QuickActionsSheetProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  const handleAction = (action: QuickAction) => {
    onClose();
    router.push(action.deepLink);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white rounded-t-3xl',
          'animate-in slide-in-from-bottom',
          'max-h-[70vh] overflow-hidden flex flex-col',
          'safe-area-bottom',
          className
        )}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-800">{t.title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Actions List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {actions.length === 0 ? (
            <div className="text-center py-8 text-stone-500">{t.noActions}</div>
          ) : (
            <div className="space-y-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-2xl transition-colors text-left',
                    'bg-stone-50 hover:bg-stone-100'
                  )}
                >
                  {/* Severity indicator */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      action.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      action.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                      action.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-emerald-100 text-emerald-600'
                    )}
                  >
                    {action.icon && iconMap[action.icon] ? iconMap[action.icon] : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-800 truncate">{action.title}</span>
                      {action.severity === 'critical' && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">
                          СРОЧНО
                        </span>
                      )}
                    </div>
                    {action.description && (
                      <p className="text-sm text-stone-500 truncate">{action.description}</p>
                    )}
                  </div>

                  {/* Arrow */}
                  <svg className="w-5 h-5 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Floating Action Button to trigger Quick Actions
interface QuickActionsFabProps {
  count?: number;
  onClick: () => void;
  className?: string;
}

export function QuickActionsFab({ count = 0, onClick, className }: QuickActionsFabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-24 right-4 z-40',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-emerald-500 to-emerald-600',
        'shadow-lg shadow-emerald-500/30',
        'flex items-center justify-center',
        'hover:shadow-xl hover:shadow-emerald-500/40 transition-shadow',
        'active:scale-95 transition-transform',
        className
      )}
    >
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
