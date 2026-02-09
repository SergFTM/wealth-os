"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Wealth-OS] Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Произошла ошибка</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          Данные не прогрузились или отсутствуют
        </p>
        <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
          <p className="text-xs text-stone-500 dark:text-stone-400 font-mono break-all">
            {error.message || "Неизвестная ошибка"}
          </p>
        </div>
        {error.digest && (
          <p className="text-xs text-stone-400 dark:text-stone-500 font-mono">ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Попробовать снова
          </button>
          <a
            href="/m/dashboard-home"
            className="px-6 py-2 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
          >
            Вернуться в меню
          </a>
        </div>
      </div>
    </div>
  );
}
