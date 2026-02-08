'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function PortalTopbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100/50 sticky top-0 z-50">
      <div className="h-full max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/p" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-800">Wealth OS</span>
            <span className="text-xs text-emerald-600 ml-2 px-2 py-0.5 bg-emerald-50 rounded-full font-medium">
              Client Portal
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
          </button>

          {/* Help */}
          <button className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">Александр Иванов</p>
                <p className="text-xs text-slate-500">Владелец</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                АИ
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-emerald-100/50 py-2 z-50">
                <div className="px-4 py-2 border-b border-emerald-50">
                  <p className="font-medium text-slate-800">Александр Иванов</p>
                  <p className="text-xs text-slate-500">alex@example.com</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/p/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Настройки
                  </Link>
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                    onClick={() => {
                      document.cookie = 'portal=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                      window.location.href = '/';
                    }}
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
