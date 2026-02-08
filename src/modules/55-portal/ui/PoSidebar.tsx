'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: Record<string, string>;
  icon: React.ReactNode;
}

const nav: NavItem[] = [
  { href: '/portal', label: { ru: 'Главная', en: 'Home', uk: 'Головна' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
  { href: '/portal/net-worth', label: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /> },
  { href: '/portal/performance', label: { ru: 'Доходность', en: 'Performance', uk: 'Дохідність' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
  { href: '/portal/documents', label: { ru: 'Документы', en: 'Documents', uk: 'Документи' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  { href: '/portal/packs', label: { ru: 'Пакеты', en: 'Packs', uk: 'Пакети' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
  { href: '/portal/ownership', label: { ru: 'Владение', en: 'Ownership', uk: 'Володіння' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
  { href: '/portal/philanthropy', label: { ru: 'Благотворительность', en: 'Philanthropy', uk: 'Благодійність' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /> },
  { href: '/portal/relationships', label: { ru: 'Отношения', en: 'Relationships', uk: 'Стосунки' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
  { href: '/portal/requests', label: { ru: 'Запросы', en: 'Requests', uk: 'Запити' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /> },
  { href: '/portal/consent', label: { ru: 'Согласия', en: 'Consent', uk: 'Згоди' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
  { href: '/portal/messages', label: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
  { href: '/portal/audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' }, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
];

interface Props {
  locale?: 'ru' | 'en' | 'uk';
}

export function PoSidebar({ locale = 'ru' }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-stone-200/50 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-stone-200/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-stone-800 text-base">Wealth OS</span>
            <span className="block text-[10px] text-emerald-600 font-medium tracking-wider uppercase">Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span>{item.label[locale]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-200/30">
        <span className="text-[10px] text-stone-400">Wealth OS Portal v1.0</span>
      </div>
    </aside>
  );
}
