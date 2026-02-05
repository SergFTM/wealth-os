'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

const navItems = [
  { href: '/portal', icon: 'home', label: { ru: 'Главная', en: 'Home', uk: 'Головна' } },
  { href: '/portal/networth', icon: 'chart', label: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' } },
  { href: '/portal/reports', icon: 'file', label: { ru: 'Отчеты', en: 'Reports', uk: 'Звіти' } },
  { href: '/portal/documents', icon: 'folder', label: { ru: 'Документы', en: 'Documents', uk: 'Документи' } },
  { href: '/portal/invoices', icon: 'receipt', label: { ru: 'Счета', en: 'Invoices', uk: 'Рахунки' } },
  { href: '/portal/requests', icon: 'inbox', label: { ru: 'Запросы', en: 'Requests', uk: 'Запити' } },
  { href: '/portal/threads', icon: 'message', label: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' } },
  { href: '/portal/profile', icon: 'user', label: { ru: 'Профиль', en: 'Profile', uk: 'Профіль' } },
];

const icons: Record<string, ReactNode> = {
  home: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  chart: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
  file: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  folder: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  receipt: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>,
  inbox: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>,
  message: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  user: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

export function PtSidebar() {
  const pathname = usePathname();
  const { locale } = useApp();

  return (
    <aside className="w-56 h-screen bg-white/60 backdrop-blur-xl border-r border-emerald-100/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-emerald-100/50">
        <Link href="/portal" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <span className="font-semibold text-stone-800 text-sm">Wealth OS</span>
            <div className="text-[10px] text-emerald-600 font-medium">CLIENT PORTAL</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-stone-600 hover:bg-emerald-50 hover:text-emerald-700"
                )}
              >
                <span className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-stone-400"
                )}>
                  {icons[item.icon]}
                </span>
                <span>{item.label[locale]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-100/50">
        <div className="text-[10px] text-stone-400 text-center">
          Wealth OS Portal v1.0
        </div>
      </div>
    </aside>
  );
}
