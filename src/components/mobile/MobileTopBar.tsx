'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface MobileTopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  actions?: Array<{
    id: string;
    icon: React.ReactNode;
    onClick: () => void;
    badge?: number;
  }>;
  className?: string;
}

export function MobileTopBar({
  title = 'Wealth OS',
  showBack = false,
  onBack,
  showMenu = true,
  onMenuToggle,
  actions = [],
  className,
}: MobileTopBarProps) {
  const router = useRouter();
  const { locale } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/80 backdrop-blur-lg border-b border-stone-200/50',
        'px-4 py-3 safe-area-top',
        className
      )}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Left: Back or Menu */}
        <div className="flex items-center gap-2 min-w-[60px]">
          {showBack ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : showMenu ? (
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-2 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* Center: Title or Logo */}
        <div className="flex-1 text-center">
          {title === 'Wealth OS' ? (
            <Link href="/portal" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-stone-800">Wealth OS</span>
            </Link>
          ) : (
            <h1 className="font-semibold text-stone-800 truncate">{title}</h1>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 min-w-[60px] justify-end">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label={action.id}
            >
              {action.icon}
              {action.badge !== undefined && action.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {action.badge > 99 ? '99+' : action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
