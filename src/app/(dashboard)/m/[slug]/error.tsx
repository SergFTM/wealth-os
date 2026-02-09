"use client";

import { useEffect } from "react";

export default function ModuleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Module Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="glass-card p-8 max-w-lg w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Ошибка модуля</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">Данные не прогрузились или отсутствуют</p>
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
          <p className="text-sm text-stone-600 dark:text-stone-400 font-mono break-all">
            {error.message || "Неизвестная ошибка"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Попробовать снова
          </button>
          <a
            href="/m/dashboard-home"
            className="px-4 py-2 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
          >
            Вернуться в меню
          </a>
        </div>
      </div>
    </div>
  );
}
