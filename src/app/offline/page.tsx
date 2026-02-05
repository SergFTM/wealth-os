"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OfflineSnapshot {
  _meta?: {
    planId: string;
    syncedAt: string;
    audience: string;
    routes: string[];
  };
  networth?: number;
  lastReport?: string;
  pendingTasks?: number;
  pendingApprovals?: number;
}

export default function OfflinePage() {
  const [snapshot, setSnapshot] = useState<OfflineSnapshot | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Try to load offline snapshot from localStorage
    try {
      const stored = localStorage.getItem('wealthos_offline_snapshot');
      if (stored) {
        setSnapshot(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load offline snapshot:', e);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatDate = (isoString: string | undefined) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Wealth OS Offline</h1>
          <p className="text-stone-500">
            {isOnline
              ? 'Вы онлайн. Эта страница для работы без сети.'
              : 'Вы работаете без подключения к интернету.'
            }
          </p>
        </div>

        {/* Status Card */}
        <div className={`rounded-2xl p-6 mb-6 ${isOnline ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <span className={`font-medium ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isOnline ? 'Онлайн' : 'Офлайн'}
            </span>
          </div>
          {snapshot?._meta && (
            <div className="text-sm text-stone-600 space-y-1">
              <p>Последняя синхронизация: {formatDate(snapshot._meta.syncedAt)}</p>
              <p>Режим: {snapshot._meta.audience === 'portal' ? 'Клиентский портал' : 'Staff'}</p>
            </div>
          )}
        </div>

        {/* Offline Data Summary */}
        {snapshot && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 mb-6">
            <h2 className="font-semibold text-stone-800 mb-4">Доступные данные</h2>
            <div className="grid grid-cols-2 gap-4">
              {snapshot.networth !== undefined && (
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-xs text-stone-500 mb-1">Net Worth</p>
                  <p className="text-lg font-semibold text-stone-800">
                    ${snapshot.networth.toLocaleString()}
                  </p>
                </div>
              )}
              {snapshot.lastReport && (
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-xs text-stone-500 mb-1">Последний отчет</p>
                  <p className="text-lg font-semibold text-stone-800">{snapshot.lastReport}</p>
                </div>
              )}
              {snapshot.pendingTasks !== undefined && (
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-xs text-stone-500 mb-1">Задачи</p>
                  <p className="text-lg font-semibold text-stone-800">{snapshot.pendingTasks}</p>
                </div>
              )}
              {snapshot.pendingApprovals !== undefined && (
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-xs text-stone-500 mb-1">Согласования</p>
                  <p className="text-lg font-semibold text-stone-800">{snapshot.pendingApprovals}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 mb-6">
          <h2 className="font-semibold text-stone-800 mb-4">Быстрые ссылки</h2>
          <div className="space-y-2">
            <Link
              href="/portal"
              className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 transition-colors"
            >
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-stone-700">Клиентский портал</span>
            </Link>
            <Link
              href="/m/tasks"
              className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-blue-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-stone-700">Задачи</span>
            </Link>
            <Link
              href="/m/mobile"
              className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-purple-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-stone-700">Мобильный режим</span>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-700">
            Offline режим работает с данными последней синхронизации.
            Некоторые функции могут быть недоступны без подключения к сети.
          </p>
        </div>

        {/* Retry Button */}
        {!isOnline && (
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-lg shadow-emerald-500/25"
          >
            Попробовать подключиться
          </button>
        )}
      </div>
    </div>
  );
}
