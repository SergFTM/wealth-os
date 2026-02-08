'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { portalNavItems, Locale } from '../types';

interface PortalNavProps {
  locale?: Locale;
}

const navIcons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  wallet: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  droplet: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  file: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  package: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  inbox: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  message: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  gavel: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function PortalNav({ locale = 'ru' }: PortalNavProps) {
  const pathname = usePathname();

  // Group nav items
  const mainItems = portalNavItems.slice(0, 1); // Overview
  const wealthItems = portalNavItems.slice(1, 5); // Net Worth, Portfolios, Performance, Liquidity
  const serviceItems = portalNavItems.slice(5, 11); // Documents to Governance
  const adminItems = portalNavItems.slice(11); // Consents, Settings

  const isActive = (path: string) => {
    if (path === '/p/overview' && pathname === '/p') return true;
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const renderNavItem = (item: typeof portalNavItems[0]) => (
    <Link
      key={item.key}
      href={item.path}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive(item.path)
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
        }
      `}
    >
      <span className={isActive(item.path) ? 'text-white' : 'text-slate-400'}>
        {navIcons[item.icon] || navIcons.file}
      </span>
      <span>{item.label[locale]}</span>
    </Link>
  );

  return (
    <nav className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white/60 backdrop-blur-md border-r border-emerald-100/50 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Main */}
        <div className="space-y-1">
          {mainItems.map(renderNavItem)}
        </div>

        {/* Wealth */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {locale === 'ru' ? 'Капитал' : locale === 'en' ? 'Wealth' : 'Капітал'}
          </p>
          <div className="space-y-1">
            {wealthItems.map(renderNavItem)}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {locale === 'ru' ? 'Сервисы' : locale === 'en' ? 'Services' : 'Сервіси'}
          </p>
          <div className="space-y-1">
            {serviceItems.map(renderNavItem)}
          </div>
        </div>

        {/* Admin */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {locale === 'ru' ? 'Управление' : locale === 'en' ? 'Admin' : 'Управління'}
          </p>
          <div className="space-y-1">
            {adminItems.map(renderNavItem)}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 px-4 border-t border-emerald-100">
          <div className="text-xs text-slate-400">
            <p className="mb-1">
              {locale === 'ru' ? 'Последнее обновление данных:' : locale === 'en' ? 'Last data update:' : 'Останнє оновлення даних:'}
            </p>
            <p className="font-medium text-slate-500">
              {new Date().toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
