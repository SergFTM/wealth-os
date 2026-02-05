'use client';

import React from 'react';
import Link from 'next/link';

interface ApiActionsBarProps {
  onCreateKey?: () => void;
  onRotateKey?: () => void;
  onRevokeKey?: () => void;
  onCreateWebhook?: () => void;
  onTestWebhook?: () => void;
  onEmitEvents?: () => void;
}

export function ApiActionsBar({
  onCreateKey,
  onRotateKey,
  onRevokeKey,
  onCreateWebhook,
  onTestWebhook,
  onEmitEvents,
}: ApiActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onCreateKey}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать API ключ
      </button>

      <button
        onClick={onRotateKey}
        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Ротация
      </button>

      <button
        onClick={onRevokeKey}
        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        Отозвать
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={onCreateWebhook}
        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Создать webhook
      </button>

      <button
        onClick={onTestWebhook}
        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Тестировать
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={onEmitEvents}
        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Сгенерировать события
      </button>

      <Link
        href="/m/api/list?tab=explorer"
        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Explorer
      </Link>
    </div>
  );
}
