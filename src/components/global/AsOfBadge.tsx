"use client";

import { useApp } from "@/lib/store";

export function AsOfBadge() {
  const { locale, asOfDate, setAsOfDate } = useApp();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100/50 rounded-lg">
      <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-xs text-stone-500">
        {locale === "ru" ? "Данные на" : "As of"}:
      </span>
      <input
        type="date"
        value={asOfDate}
        onChange={(e) => setAsOfDate(e.target.value)}
        className="text-xs font-medium text-stone-700 bg-transparent border-none focus:outline-none cursor-pointer"
      />
    </div>
  );
}
